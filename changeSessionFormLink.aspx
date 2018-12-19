<%@ Page Language="vb" AutoEventWireup="false"%>
<%
	Session("user_id") = Request("user_id").ToString()
	Response.Redirect("./Forms/FormLink.aspx?piid="+Request("PIID").ToString()+"&fiid="+Request("FIID").ToString(), False)
%>