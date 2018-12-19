<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListItems_AttachLayer.aspx.cs" Inherits="Approval_Forms_ListItems_AttachLayer" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>ListItem_AttachLayer</title>
    <script type="text/javascript" language="javascript" src="../../common/script/coviflownet/openwindow.js"></script>
    <script type="text/javascript" language="javascript" src="formedit.js"></script>
</head>
<body onload="initAttach()">
    <form id="form1" runat="server">
        <div>
		    <table width='100%' cellpadding='2' cellspacing='0'>
		        <tr>
                      <td height="2" colspan="3" class="BTable_bg01"></td>
                </tr>
				<tr>
                    <td height="2" colspan="3" class="BTable_bg03"></td>
                </tr>
                <tr class="BTable_bg02">
			        <td></td>
			        <td><b><%= Resources.Approval.lbl_AttachList %></b></td>
			        <td align="center"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_x.gif" onclick="javascript:parent.PopLayer.style.display='none';" /></td>
                </tr>
                <tr>
					<%--<td style="width:20%;" valign="top"><b><%= Resources.Approval.lbl_FileName %></b></td>--%>
					<td colspan="3" id="AttFileInfo" valign="middle"></td>
				</tr>
		    </table>
        </div>
        <iframe id="download" src="" name="download" style="display:none;"></iframe>
    </form>
    <script type="text/javascript" language="javascript" >
    var m_KMWebAttURL='';
    var bReadOnly = false;
    var fmpf = "<%=Request.QueryString["fmpf"] %>";
    var fmrv = "<%=Request.QueryString["fmrv"] %>";
    var fiid = "<%=Request.QueryString["fiid"] %>"; 
    var furl = "<%=Request.QueryString["furl"] %>";

    var bArchived = parent.barchived;
    function initAttach(){
		var connectionname = "FORM_INST_ConnectionString";
		if(bArchived){connectionname = "FORM_INST_ARCHIVE_ConnectionString";}
        var pXML = "dbo.usp_form_attachfileinfo";
        var aXML = "<param><name>fmpf</name><type>varchar</type><length>30</length><value><![CDATA["+fmpf+"]]></value></param>";
        aXML+= "<param><name>revision</name><type>varchar</type><length>10</length><value><![CDATA["+fmrv+"]]></value></param>";
        aXML+= "<param><name>fiid</name><type>char</type><length>34</length><value><![CDATA["+fiid+"]]></value></param>";
        var sPostBody = "<Items><connectionname>"+connectionname+"</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
        var sTargetURL = "../getXMLQuery.aspx";
	    requestHTTP((sPostBody==null?"GET":"POST"),sTargetURL,false,"text/xml",receiveAttachQuery,sPostBody);
    }
    
    
function receiveAttachQuery(){
	var attFiles, szAttFileInfo ;
	var displayFileName;	
	
		
	var re = /_N_/g;
	if(m_xmlHTTP.readyState==4){
	 
       //2008.09.17 liyahn 일반 게시판인 경우
        if(furl !=null && furl != "")
        {
            var arrfurl, arrfnm;
            
            szAttFileInfo="";
            arrfurl = furl.split("|");
    	   
    	   arrfnm ="";
           for (var i=0; i<arrfurl.length;i++ )
           {
                arrfnm = arrfurl[i].substring(arrfurl[i].lastIndexOf("_")+1,arrfurl[i].length);
    	         
                szAttFileInfo += "<a href=\""+ arrfurl[i].toString().replace("+","%2B") +  "\" target = \"_blank\" >" + arrfnm.toString() + "</a><br/>";
    	        
    	        var sizeHeight = (i+1)*20+27;
				parent.document.getElementById("nPopLayer").style.height = sizeHeight-(i*8);
           }
        }
        else{

		    m_xmlHTTP.onreadystatechange=event_noop;
		    if(m_xmlHTTP.responseXML.xml==""){
			    //alert(m_xmlHTTP.responseText);
		    }
		    else{
			    var xmlReturn=m_xmlHTTP.responseXML;
		        var elmlist = xmlReturn.selectNodes("response/NewDataSet/Table");
		        var elm;
		        for(var i=0 ; i < elmlist.length ; i++){
		            elm = elmlist.nextNode();	
		            var attFiles = elm.text;
		            var fState="";
						    var m_oFileList = new ActiveXObject("MSXML2.DOMDocument");
						    m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+attFiles);
						    var nelmRoot, nelmList, nelm, nelmTaskInfo;
						    nelmRoot = m_oFileList.documentElement;
						    if (nelmRoot != null){
							    nelmList = nelmRoot.selectNodes("fileinfo/file");			
							    szAttFileInfo = "";
							    for (var i=0; i<nelmList.length;i++) {
								    nelm = nelmList.nextNode();
								    displayFileName = nelm.getAttribute("name").substring(0, nelm.getAttribute("name").lastIndexOf(".")) ;
								    displayFileName = displayFileName.replace(re,"&");
    	
							      if (nelm.getAttribute("location").indexOf(".") > -1 ){
									    if (bReadOnly){
										    szAttFileInfo +=  displayFileName;
									    }
									    else{
											    if(fState==""||fState=="OLD"||fState=="NEW"){
													    szAttFileInfo += "<a href=\"javascript:PopListSingle('"+escape(nelm.getAttribute("location").replace("+","%2B")) + ":')\"  >" + nelm.getAttribute("name") + "</a>";
													    //szAttFileInfo += "<a href=\""+nelm.getAttribute("location").replace("+","%2B")+  "\" target = \"_blank\" >" + nelm.getAttribute("name") + "</a>";
											    }	
								      }						
							      }
								    else{
										    szAttFileInfo += "<a href=\"javascript:PopListSingle('"+m_KMWebAttURL+nelm.getAttribute("location")+ ":')\" >" + nelm.getAttribute("name") + "</a>"; //TARGET=\"_blank\"
								    }
								    if (i < nelmList.length - 1)
											    szAttFileInfo += "<br />";
								    var sizeHeight = (i+1)*20+27;
								    parent.document.getElementById("nPopLayer").style.height = sizeHeight-(i*8); 
						      }//end for		        
					      }//end if
				    }//end for
		    }//end else
		} 
		
		AttFileInfo.innerHTML = szAttFileInfo;
	}//end if 
	
}//end function
function PopListSingle(SingleDownLoadString){
     download.location.href ='/CoviWeb/SiteReference/Common/covi_fileSingledown.aspx?filepath=' +SingleDownLoadString;
}
    </script>
</body>
</html>
