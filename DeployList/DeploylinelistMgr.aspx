<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DeploylinelistMgr.aspx.cs" Inherits="DeployList_DeploylinelistMgr" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title><%=titleName%></title> <!--20161017 추가-->
    <script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
</head>
<body>
<div class="popup_title">
  <div class="title_tl">
    <div class="title_tr">
      <div class="title_tc">
      <h2><%= Resources.Approval.lbl_deploylinesetupcomment_01%>
        <select id='SelEnt' onchange="SetENT(this.value)" style="display:none;"></select>
      </h2>
      </div>
    </div>
  </div>
</div>
<div class="popup_box">
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_top_left.gif" /></td>
    <td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_top_bg.gif"></td>
    <td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_top_right.gif" /></td>
  </tr>
  <tr>
    <td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_left_bg.gif"></td>
    <td><table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td width="100" style=" padding-left: 10px;"><b><asp:Label runat="server" id="msg_txt_Deployline_name" /> :</b></td>
        <td style=" padding-top: 5px; padding-bottom: 5px;"><input type="text" class="type-text" id="title" name="title" maxlength="20" style=" width: 760px;" /></td>
      </tr>
      <tr>
        <td colspan="2" class="line"></td>
      </tr>
      <tr>
        <td style=" padding-left: 10px;"><b><asp:Label runat="server" ID="msg_txt_Deployline_desc" /> :</b></td>
        <td style=" padding-top: 5px; padding-bottom: 5px;"><input type="text" class="type-text" id="description" name="description" maxlength="50" style=" width: 760px;" /></td>
      </tr>      
    </table></td>
    <td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_right_bg.gif"></td>
  </tr>  
  <tr>
    <td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_bottom_left.gif" /></td>
    <td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_bottom_bg.gif"></td>
    <td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_bottom_right.gif" /></td>
  </tr>
</table>
</div>          
				               
<div style="padding-top: 10px; padding-left: 0px; padding-right: 0px;">
  <!-- 등록 div 시작 -->
  <div class="write">
  <!-- 일반 div 시작 -->
    <div> 
        <iframe id="ApvlineViewer" frameborder="0" style="WIDTH:100%;HEIGHT:445px;" src="../DeployList/DeployLinePrivate.aspx"></iframe>
    </div>
  </div>
</div>

<!-- 버튼_시작-->
<div class="popup_Btn small AlignR">
  <a href="#" class="Btn04" id="btOK" name="cbBTN" onClick="doButtonAction(event);"><span><%= Resources.Approval.btn_confirm_setup %></span></a> 
  <a href="#" class="Btn04" id="btExit" name="cbBTN" onClick="doButtonAction(event);"><span><%= Resources.Approval.btn_close %></span></a>
</div>
<!-- 버튼_끝-->
    <script language="javascript" type="text/javascript">
		if( top.opener.bState=="change"){
		
			document.getElementById("title").value = top.opener.document.getElementById("Apvline").contentWindow.m_title;
			document.getElementById("description").value = top.opener.document.getElementById("Apvline").contentWindow.m_dscr;
			if(top.opener.document.getElementById("Apvline").contentWindow.m_main=="Y")
			{
			    Main_apvline.checked=true;
			}
		}
	    function setchangeApvlineList(){		
	    
		    var elmRoot = document.getElementById("ApvlineViewer").contentWindow.cirdom.documentElement;	    			
		  	
			    var sText = '<request><type>change</type><id>'
			    +top.opener.document.getElementById("Apvline").contentWindow.m_id+'</id><userid>'+top.opener.UserID
			    +'</userid><title><![CDATA['+document.getElementById("title").value+']]></title><dscr><![CDATA['+document.getElementById("description").value+']]></dscr>'
			    +''+elmRoot.xml+'</request>';
				
			    evalXML(sText);

			    m_xmlHTTP.open("POST","SetDeploylist.aspx",true);				    
			    m_xmlHTTP.setRequestHeader("Content-type", "text/xml");
			    m_xmlHTTP.onreadystatechange=receiveHTTP;
			    m_xmlHTTP.send(sText);			  
	    }
	    function setApvlineList(){
		    var elmRoot = document.getElementById("ApvlineViewer").contentWindow.cirdom.documentElement;	    			
	    
		    var sText = '<request><type>add</type><id>'+ top.opener.document.getElementById("Apvline").contentWindow.m_id
		    +'</id><userid>'+top.opener.UserID+'</userid><title><![CDATA['+document.getElementById("title").value+']]></title><dscr><![CDATA['
		    +document.getElementById("description").value+']]></dscr>'+elmRoot.xml+'</request>';
		    evalXML(sText);

		    m_xmlHTTP.open("POST","SetDeploylist.aspx",true);
		   
		    m_xmlHTTP.setRequestHeader("Content-type", "text/xml");
		    m_xmlHTTP.onreadystatechange=receiveHTTP;
		    m_xmlHTTP.send(sText);			  
	    }
		
	</script>
	<script language="javascript" type="text/javascript">
        function SetENT(m_EntCode)
        {
            var cntWndw = document.getElementById("ApvlineViewer").contentWindow;
            cntWndw.document.getElementById("iSearch").contentWindow.frameElement.src="../Address/search.aspx?Ent="+m_EntCode;
            cntWndw.document.getElementById("iGroup").contentWindow.frameElement.src="../ApvLineMgr/OrgTree.aspx?Ent="+m_EntCode;
        }
        function GetEnt(){
        
            var pXML = "dbo.usp_GetEntInfo";
            var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type></Items>" ;
            var szURL = "../GetXMLQuery.aspx";
            requestHTTP("POST",szURL,true,"text/xml",receiveHTTPEnt, sXML);
        }
        function receiveHTTPEnt(){
            if(m_xmlHTTP.readyState==4){
                m_xmlHTTP.onreadystatechange=event_noop;
                var xmlReturn=m_xmlHTTP.responseXML;
                if(xmlReturn.xml==""){
    	        
                }else{
	                var errorNode=xmlReturn.selectSingleNode("response/error");
	                if(errorNode!=null){
		                alert("Desc: " + errorNode.text);
	                }else{
//	                    var m_oChargeList = new ActiveXObject("MSXML2.DOMDocument");
                        var m_oChargeList = CreateXmlDocument();
                        m_oChargeList.loadXML(m_xmlHTTP.responseText);  
	                    var elmRoot = m_oChargeList.documentElement;
		                var elmlist = elmRoot.selectNodes("NewDataSet/Table");
		                var elm;
		                var oOption = document.createElement("OPTION");
    			        
    			        
		                //콤보 박스 초기화
		                document.getElementById("SelEnt").length = 0;
		                document.getElementById("SelEnt").options.add(oOption);
	                    oOption.text="<%=Resources.Approval.lbl_total %>";
	                    oOption.value="";
    			        
		                for(var i = 0; i < elmlist.length; i++)
		                {
		                    elm = elmlist.nextNode();
    			            
		                    var oOption = document.createElement("OPTION");
		                    document.getElementById("SelEnt").options.add(oOption);

		                    //20161017 추가
		                    
		                    if ("<%=language%>" == "zh-CN")
                            {
                              oOption.text=elm.selectSingleNode("ENG_NAME").text;
                            }
                            else
                            {
                              oOption.text=elm.selectSingleNode("NAME").text;
                               
                            }
                             //20161017 추가끝
		                    oOption.value=elm.selectSingleNode("ENT_CODE").text;
		                }
    			        
			            if (elmlist.length > 0){
			                document.getElementById("SelEnt").style.display = "";
			            }
	                }
                }
            }
        }
    </script>
    <script language="javascript" type="text/javascript">
		//var m_evalXML = new ActiveXObject("MSXML2.DOMDocument");
		//var m_xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP");
		var m_xmlHTTP = CreateXmlHttpRequest();
		var m_evalXML = CreateXmlDocument();
	    var sEntGroupYN = "<%=ConfigurationManager.AppSettings["WF_ENTGROUPYN"] %>";		    
        document.getElementById("SelEnt").value = '<%=Session["user_ent_code"].ToString()%>';
		//debugger;
		if ((top.opener.bState=="add") && (top.opener.document.getElementById("Apvline").contentWindow.m_id == "")) {		
			top.opener.document.getElementById("menu").APVLIST.value = "";
			if(sEntGroupYN == "T") GetEnt();
	    }else if ((top.opener.bState=="add") && (top.opener.document.getElementById("Apvline").contentWindow.m_id == "")) {
		    top.opener.document.getElementById("menu").APVLIST.value = "";
		    if(sEntGroupYN == "T") GetEnt();
	    }else if(top.opener.bState=="add"){
	        if(sEntGroupYN == "T") GetEnt();
	    }else{
		    queryGetData();
	    }

		function queryGetData() 
		{		
			var szURL = "GetDeploylist.aspx?PDD_ID="+ top.opener.document.getElementById("Apvline").contentWindow.m_id;			
			requestHTTP("GET",szURL,true,"text/xml",receiveHTTPStep,null);
		}

		function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
			m_xmlHTTP.open(sMethod,sUrl,bAsync);			
			m_xmlHTTP.setRequestHeader( "Content-type", sCType);
			if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
			(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
		}
		function receiveHTTPStep(){
		
			if(m_xmlHTTP.readyState==4){
				m_xmlHTTP.onreadystatechange=event_noop;
				if(m_xmlHTTP.responseText.charAt(0)=='\r'){
					alert(m_xmlHTTP.responseText);
				}else{				
					var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
					if(errorNode!=null){
						alert(errorNode.text);
					}else{
						top.opener.document.getElementById("menu").APVLIST.value = m_xmlHTTP.responseXML.selectSingleNode("response/item[id='"+ top.opener.document.getElementById("Apvline").contentWindow.m_id + "']/signinform/root").xml; 			
					}
					if(sEntGroupYN == "T") GetEnt();
				}
			}
		}
		
		    
		function doButtonAction(e){		
		    var clickID = e.srcElement ? e.srcElement.parentNode.id : e.target.parentNode.id;
			switch(clickID){
				case "btOK":
					if ( document.getElementById("title").value.length == 0 )
					{
					    alert('<%=msg_err_apv_subject%>');
					    document.getElementById("title").focus();return false;
					}
					if(document.getElementById("ApvlineViewer").contentWindow.xmldom == undefined) 
					{
					    alert('<%=msg_err_apv_line%>');
					    return false;
					}
					var elmRoot = document.getElementById("ApvlineViewer").contentWindow.xmldom.documentElement;	
					if (elmRoot.childNodes.length < 1)
					{
					    alert('<%=msg_err_apv_line%>');
					    return false;
					}
					if (top.opener.bState=="change"){
						setchangeApvlineList();
					}
					else{
						setApvlineList();
					}
					break;						
				case "btExit":	
				    window.close();
				    break;
			}
		}
		function receiveHTTP(){
			if(m_xmlHTTP.readyState==4){
				m_xmlHTTP.onreadystatechange=event_noop;
				if(m_xmlHTTP.responseText.charAt(0)=="\r"){
					alert(m_xmlHTTP.responseText);
				}else{
					var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
					if(errorNode!=null){
						alert(errorNode.text);
					}else{
						window.close();
						top.opener.location.reload();				
					}
				}
			}
		}
		function event_noop(){return(false);}
		function evalXML(sXML){
			if(!m_evalXML.loadXML(sXML)){
				var err = m_evalXML.parseError;
				throw new Error(err.errorCode,err.reason+"\nsrctxt:"+err.srcText+"\nline:"+err.line+"\tcolumn:"+err.linepos);
			}
		}
		
		
	</script>
</body>
</html>

