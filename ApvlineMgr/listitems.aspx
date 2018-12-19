<%@ Page Language="C#" AutoEventWireup="true" CodeFile="listitems.aspx.cs" Inherits="COVIFlowNet_ApvlineMgr_listitems" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
	<head runat="server">
		<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8" />
	</head>
	<body>
		<XML id="g_oSSXML" src="sort.xsl"></XML>
		<DIV id='divGalTable'>			
			<table id='tblGalInfo' width="100%" border="0" cellspacing="0" cellpadding="0" class="BTable">				
			    <tr class="BTable_bg02" style="height:25px">
				    <th style="padding-left:5px"><input Type="CheckBox" onClick="CheckedAll();" name='chkall'></th>						
				    <th onClick="sortColumn('DN');"><%= Resources.Approval.lbl_username%></th>
				    <th onClick="sortColumn('@po');"><%= Resources.Approval.lbl_jobposition%></th>
				    <th onClick="sortColumn('@tl');"><%= Resources.Approval.lbl_jobtitle%></th>
				    <th onClick="sortColumn('DP');"><%= Resources.Approval.lbl_dept%></th>
			    </tr>
			    <tr>
                    <td height="1" colspan="6" class="BTable_bg03"></td>
                </tr>
			</table>
		</DIV>
		<DIV id='divErrorMessage' class='errormessage'></DIV>		
		<span id="tooltip" class="tooltip"></span>
	</body>
	<script language="javascript" type="text/javascript" src="listitems.js"></script>
	<script language="javascript" type="text/javascript">
        var gOUNameType = "<%=System.Web.Configuration.WebConfigurationManager.AppSettings["Default_OUNameType"] %>";
        var gLngIdx = <%=strLangIndex %>;
	</script>
</html>
