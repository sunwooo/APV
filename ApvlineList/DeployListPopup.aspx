<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DeployListPopup.aspx.cs" Inherits="COVIFlowNet_ApvlineList_DeployListPopup" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title></title>
</head>
<body>
	<form id="myForm" name="myForm" method="post" runat="server">
		<div class="popup_title">
		  <div class="title_tl">
			<div class="title_tr">
			  <div class="title_tc">
			  <h2><span><%= Resources.Approval.lbl_DistributionDeptListcomment_01 %></span></h2></div>
			</div>
		  </div>
		</div>
	    
		<table width="100%" border="0" cellpadding="0" cellspacing="0">
			 <tr>
				<td>						    
						<table   width="100%"  cellpadding="0" cellspacing="0" border="0">
							<tr class="BTable_bg02" style="height:25px">								    
								<td align="center" width="5%">&nbsp;</td>
								<td align="center" width="95%"><%= Resources.Approval.lbl_Dept_User %></td>									    
							</tr>
							<tr><td colspan="2" height='1' colspan='3' align='center' class='table_line'></td></tr>		
						   <tr><td colspan="2"><span id='DeployDeptList'></span></td></tr> 								   					   
						</table>							                               
				</td>
			</tr>
		</table>
		<div class="popup_Btn small AlignR">
			<a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:window.close();"><span><%= Resources.Approval.btn_close %></span></a>
		</div>
    </form>
	<script language="javascript" type="text/javascript">
		var UserID="<%=UserID%>";
		var GroupID="<%=GroupID%>";
		var m_id="";
		var m_xmlHTTP = CreateXmlHttpRequest();
		var m_objGrpInfoXML = CreateXmlDocument();
		var m_sSelGrpID;
		m_objGrpInfoXML.loadXML("<addresslist/>");

		window.onload= initOnload;
		function initOnload(){
            var pXML = "dbo.usp_GetDistributionDept";
            var aXML = "<param><name>GroupID</name><type>VarChar</type><length>100</length><value><![CDATA["+GroupID+"]]></value></param>";
            aXML += "<param><name>LANGUAGE</name><type>VarChar</type><length>100</length><value><![CDATA["+"<%=strLangID %>"+"]]></value></param>";
            
            var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
            var szURL = "../GetXMLQuery.aspx";
            requestHTTP("POST",szURL,true,"text/xml",receiveHTTP, sXML);	           
		}

		function receiveHTTP(){
			if(m_xmlHTTP.readyState==4){
				m_xmlHTTP.onreadystatechange=event_noop;
				if(m_xmlHTTP.responseText.charAt(0)=='\r'){
					alert(m_xmlHTTP.responseText);
				}else{
					var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
					if(errorNode!=null){
						alert("Desc: " + errorNode.text);
					}else{
						var elmlist = m_xmlHTTP.responseXML.selectNodes("response/NewDataSet/Table");
						var szHTML = "<table width=\"100%\"  border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
						for(var i=0; i < elmlist.length; i++){
							var elm = elmlist.nextNode();
							szHTML +="<tr><td height=\"20px\" width=\"10\"></td><td nowrap=\"t\" align=\"left\">";
							szHTML +=elm.selectSingleNode("NAME").text;
							szHTML +="</td></tr>";
							szHTML +="<tr><td colspan=\"2\" height=\"1px\" class=\"table_line\"></td></tr>";
						}
						szHTML +="</table>";
						document.getElementById("DeployDeptList").innerHTML = szHTML;
//						var xslDOM=new ActiveXObject("MSXML2.DOMDocument");
//						xslDOM.async=false;
//						xslDOM.load("DeployListPopup.xsl");
//						//document.body.innerHTML = m_xmlHTTP.responseXML.transformNode(xslDOM);
//						DeployDeptList.innerHTML = m_xmlHTTP.responseXML.transformNode(xslDOM);
					}
				}
			}
		}
		function event_noop(){return(false);}
			
		function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
			m_xmlHTTP.open(sMethod,sUrl,bAsync);
			m_xmlHTTP.setRequestHeader("Accept-Language","ko");
			m_xmlHTTP.setRequestHeader( "Content-type", sCType);
			if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
			(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
		}
		
	</script>    
</body>
</html>
