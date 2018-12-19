<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PostMail.aspx.cs" Inherits="Approval_Forms_PostMail" %>

<head>
    <title>제목 없음</title>
</head>
<script language="javascript" type="text/javascript">
<!--
function fn_onLoad() {

    document.getElementById('formid').value = "<%=User_id%>";
    document.getElementById('to').value = "";
    document.getElementById('body').value= opener.m_oFormEditor.bodytable.innerHTML  //.replace(/javascript:tdisplayApv/g, '&gt;');
    document.forms[0].submit();
}

function toUTF8(szInput)
{
 var wch,x,uch="",szRet="";
 for (x=0; x<szInput.length; x++)
  {
  wch=szInput.charCodeAt(x);
  if (!(wch & 0xFF80)) {
   szRet += "%" + wch.toString(16);
  }
  else if (!(wch & 0xF000)) {
   uch = "%" + (wch>>6 | 0xC0).toString(16) +
      "%" + (wch & 0x3F | 0x80).toString(16);
   szRet += uch;
  }
  else {
   uch = "%" + (wch >> 12 | 0xE0).toString(16) +
      "%" + (((wch >> 6) & 0x3F) | 0x80).toString(16) +
      "%" + (wch & 0x3F | 0x80).toString(16);
   szRet += uch;
  }
 }
 return(szRet);
}
//-->
</script>
<body onload="fn_onLoad()">
    <form id="form1" action="http://wmail.workplace2.com/cgi-bin/sso.cgi" method="post" >
        <input type="hidden" id="formid" name="formid"/>
        <input type="hidden" id="to" name="to"/>
        <input type="hidden" id="subject" name="subject"/>
        <input type="hidden" id="body" name="body"/>
        <input type="hidden" id="authmode" name="authmode" value="pagelink"/>
        <input type="hidden" id="lp" name="lp" value="singlecomposer"/>
    </form>
</body>
</html>
