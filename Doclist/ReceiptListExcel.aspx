<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ReceiptListExcel.aspx.cs" Inherits="Doclist_ReceiptListExcel" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>제목 없음</title>
</head>
<body oncontextmenu="return false;" style="FONT-SIZE: 9pt" leftMargin="0" topMargin="0">
		<table border="0" width="100%" height="5" align="center">
			<tr>
				<td>&nbsp;</td>
			</tr>
		</table>
		<table border="1" cellpadding="2" cellspacing="0" style="TABLE-LAYOUT: fixed;" width="100%">
			<tr bgcolor="olive">
			<%if (sReply == "1")
                {%>
	                    <td align="center"><%= Resources.Approval.lbl_RecvDeptName %></td>	
	                    <td align="center"><%= Resources.Approval.lbl_receiver %></td>						
	                    <td align="center"><%= Resources.Approval.lbl_receipt %><br /><%= Resources.Approval.lbl_Is %></td>
	                    <td align="center"><%= Resources.Approval.lbl_Processing %><br /><%= Resources.Approval.lbl_state %></td>
	                    <td align="center"><%= Resources.Approval.lbl_app %><br /><%= Resources.Approval.lbl_result2 %></td>
	                    <td align="center"><%= Resources.Approval.lbl_arrived_time %></td>
	                    <td align="center"><%= Resources.Approval.lbl_receipt_time %></td>
	                    <td align="center"><%= Resources.Approval.lbl_complete_time %></td>
	                    <td align="center">&nbsp;</td>
	                    <td align="center"><%= Resources.Approval.lbl_charge_person %></td>
	                    <td align="center"><%= Resources.Approval.lbl_draft_date %></td>
	                    <td align="center"><%= Resources.Approval.lbl_complete_time %></td>
                <% } %>
                <% else{ %>
					    <td align="center"><%= Resources.Approval.lbl_RecvDeptName %></td>	
					    <td align="center"><%= Resources.Approval.lbl_receiver %></td>							
					    <td align="center"><%= Resources.Approval.lbl_receipt %><br /><%= Resources.Approval.lbl_Is %></td>
					    <td align="center"><%= Resources.Approval.lbl_Processing %><br /><%= Resources.Approval.lbl_state %></td>
					    <td align="center"><%= Resources.Approval.lbl_app %><br /><%= Resources.Approval.lbl_result2 %></td>
					    <td align="center"><%= Resources.Approval.lbl_arrived_time %></td>
					    <td align="center"><%= Resources.Approval.lbl_receipt_time %></td>
					    <td align="center"><%= Resources.Approval.lbl_complete_time %></td>
				<% } %>	
			</tr>	
			<%= strExcelList%>
		</table>
	</body>
</html>
