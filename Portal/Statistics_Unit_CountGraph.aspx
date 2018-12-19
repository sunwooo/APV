<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Statistics_Unit_CountGraph.aspx.cs" Inherits="Approval_Portal_Statistics_Unit_CountGraph" %>
<%@ Register Assembly="CoviChart" Namespace="CoviChart" TagPrefix="cc1" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>부서별그래프</title>
</head>
<body class="abox02_cc">
    <form id="form1" runat="server" method="post" target="_self">
	<table width="100%" border="0" cellpadding="0" cellspacing="0">
   	     <tr>
		    <td class="n_boxtop"><span><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/table_ex.gif" /></span><strong><%=strSubject %></strong></td>
         </tr>
   	     <tr>
   	       <td>
   	        <div id="Stgraph" runat="server" visible="true"></div>
   	       </td>
	      </tr>
	</table>
	</form>
</body>
</html>
