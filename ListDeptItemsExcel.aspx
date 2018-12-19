<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListDeptItemsExcel.aspx.cs" Inherits="Approval_ListDeptItemsExcel" %>

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
			<tr>
				<td><%= strListName%>&nbsp;</td>
			</tr>
		</table>
		<table border="1" cellpadding="2" cellspacing="0" style="TABLE-LAYOUT: fixed;" width="100%">
			<tr bgcolor="olive">
				<TD align="center"><%=Resources.Approval.lbl_gubun%></TD>
				<TD align="center"><%=Resources.Approval.lbl_subject%> </TD>
				<TD align="center"><%=Resources.Approval.lbl_date%></TD>
				<TD align="center"><%=Resources.Approval.lbl_writedept%> </TD>
				<TD align="center"><%=Resources.Approval.lbl_writer%></TD>
				<TD align="center"><%=Resources.Approval.lbl_formname%> </TD>
			</tr>	
		<%= strExcelList%>
			</table>	
	</body>
</html>
