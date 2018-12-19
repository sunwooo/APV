<%@ Page Language="C#" AutoEventWireup="true" CodeFile="MonitorProcess.aspx.cs" Inherits="COVIFlowNet_ApvMonitor_MonitorProcess" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>전자결재</title>
	<script language="javascript" type="text/javascript" src="/CoviWeb/common/script/CFL.js"></script>
</head>
<body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td class="openline">&nbsp;&nbsp;&nbsp;결재문서 단계조회</td>
			</tr>
		</table>
		<table cellpadding="0" cellspacing="0" style="TABLE-LAYOUT: fixed" width="100%" align="center">
			<tr bgcolor="#f1f1f1">
				<td width="130" class='gallistheading'>단계</td>
				<td width="80" class='gallistheading'>담당</td>
				<td width="50" class='gallistheading'>상태</td>
				<td width="100" class='gallistheading'>받은일시</td>
				<td width="100" class='gallistheading'>완료일시</td>
			</tr>
			<%=gString%>
		</table>
</body>
</html>
