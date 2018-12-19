<%@ Page Language="C#" AutoEventWireup="true" CodeFile="listitems.aspx.cs" Inherits="COVIFlowNet_Address_listitems" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
	<head runat="server">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title></title>
		<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js"></script>
	</head>
	<body style="overflow-x:hidden;">
		<div id='divGalTable' class="iframe_border" style="height:100%;">			
			<table id='tblGalInfo' width="100%" border="0" cellspacing="0" cellpadding="0" class="BTable">
				<tr class="BTable_bg02" style="height:25px">
					<td style="padding-left:5px"><input Type="CheckBox" onClick="CheckedAll(event);" name="chkall" id="chkall"></td>						
					<td ><%= Resources.Approval.lbl_username%></td>
					<td ><%= Resources.Approval.lbl_jobposition%></td>
					<td ><%= Resources.Approval.lbl_jobtitle%></td>
					<td ><%= Resources.Approval.lbl_dept%></td>
				</tr>
				<tr>
					<td height="1px" colspan="5" class="BTable_bg03"></td>
				</tr>
			</table>
		</div>
		<div id='divErrorMessage' class='errormessage'></div>		
		<span id="tooltip" class="tooltip"></span>
		<input type="hidden" id="chk" name="chk" />
		<textarea id="txtData" runat="server" style="display:none;"></textarea>
	</body>
	<script language="javascript" type="text/javascript" src="listitems.js"></script>
	<script language="javascript" type="text/javascript">
		var gOUNameType = "<%=System.Web.Configuration.WebConfigurationManager.AppSettings["Default_OUNameType"] %>";
		var gLngIdx = <%=strLangIndex %>;
		var g_oSSXML = CreateXmlDocument();
		if ("ActiveXObject" in window)
		{
			g_oSSXML.async = false;
			try
			{//top.document.title += '0_';
				g_oSSXML.load("sort.xsl");//top.document.title += '1_';
			}
			catch(e)
			{//top.document.title += '2_';
			}
		}
		else
		{
			getXSL();			
		}

		function getXSL(){
			var szURL = "sort.xsl";
			requestHTTP("GET",szURL,true,"text/xml",receiveHTTPXSL,null);
		}

		function receiveHTTPXSL()
		{
			if(m_xmlHTTP.readyState==4)
			{
				m_xmlHTTP.onreadystatechange=event_noop;
				var parser = new DOMParser();
				g_oSSXML = parser.parseFromString(m_xmlHTTP.responseText, "text/xml");//debugger;
			}
		}						
	</script>
<!--

个-->
</html>
