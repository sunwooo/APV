<%@ Page Language="C#" AutoEventWireup="true" CodeFile="download.aspx.cs" Inherits="Approval_FileAttach_download" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>제목 없음</title>
</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" border="0" cellpadding="0" cellspacing="0"><!--이준희(2006-10-24):  height="100%"를 시도해 보았으나 불필요한 것으로 판단됨.-->
	    <tr>
	      <td>
		    <script src="filedownload.js" language ="javascript" ></script>
	      </td>
	    </tr>
	</table>
<script language ="javascript">
var strlocation="<%=strlocation%>";
var strphygicalName="<%=strphygicalName%>"
//window.resizeTo(289, 392);//이준희(2006-10-24): formedit.js에서 크기를 조정하는 것으로 대신함.
</script>    
</body>
</html>
