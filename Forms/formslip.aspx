﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="formslip.aspx.cs" Inherits="Approval_Forms_fromslip" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width,user-scalable=yes,initial-scale=0.5,maximum-scale=4.0" />
    <title><%= strFormName %></title>
    <script type="text/javascript" language="javascript">
		window.focus();/*个*/
    </script>
    <script type="text/javascript" language="javascript" src="../../SiteReference/js/Utility.js"></script>
    <script type="text/javascript" language="javascript" src="../../SiteReference/js/Dictionary.js"></script>
	<script type="text/javascript" language="javascript">
	    var admintype = "<%=Request.QueryString["admintype"]%>";
		var rel_activityid = "<%=Request["TaskID"] %>";
		var rel_activityname = "<%=Request["TaskName"]%>";
		var gLngIdx = <%=strLangIndex %>;
	</script>
	<% MakeScript(); %>
	<script type="text/javascript" language="javascript">
	    function gotoFolder(strFolderURL, strFolderName)
		{
			try {

			    if (strFolderName != undefined) {
			        strFolderURL += "&location_name=" + escape(strFolderName);
			    }
	
			    if (opener.name == "rightFrame") { 
				    opener.location.href = strFolderURL;
				} else if (opener.parent.name == "rightFrame") {  // 프레임안에 하나 더 감싸여 있을 경우
				    opener.parent.location.href = strFolderURL;	
				}
			}catch(e){alert(e.message)}
        }
        
	</script>
    <script type="text/javascript" language="javascript" src="form.js"></script>

</head>
<% if (sMobileYN == "Y")
   { %>
    <frameset id="main" name="main" framespacing="0" border="false" frameborder="0" rows="0,*,0,0">
		<frame id="menu" scrolling="no"  src="<%=sMenuURL %>" name="menu" />
		<frame id="editor" src="" name="editor" />
		<frame id="reader" src="" name="reader" />
		<frame id="download" src="" name="download" />
		<noframes>
			<body>
				<p><%= Resources.Approval.msg_001%></p>
			</body>
		</noframes>
	</frameset>
<% }
   else
   { %>
    <frameset id="main" name="main" framespacing="0" border="false" frameborder="0" rows="58,*,0,0">
		<frame id="menu" scrolling="no"  src="<%=sMenuURL %>" name="menu" />
		<frame id="editor" src="" name="editor" />
		<frame id="reader" src="" name="reader" />
		<frame id="download" src="" name="download" />
		<noframes>
			<body>
				<p><%= Resources.Approval.msg_001%></p>
			</body>
		</noframes>
	</frameset>
<%} %>
</html>
