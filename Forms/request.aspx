<%@ Page Language="C#" AutoEventWireup="true" validateRequest="false" CodeFile="request.aspx.cs" Inherits="Approval_Forms_request" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>결재연동양식연결</title>
    <script language="javascript" type="text/javascript">
       // var m_cvtXML = new ActiveXObject("MSXML2.DOMDocument").createTextNode("");
        var m_cvtXML = CreateXmlDocument().createTextNode("");

  function CreateXmlDocument() {
            if (window.ActiveXObject) { // code for IE
                return new ActiveXObject("Microsoft.XMLDOM");
            } else if (document.implementation.createDocument) {// code for Mozilla, Firefox, Opera, etc.
                return document.implementation.createDocument("", "", null);
            } else {
                alert('Your browser cannot handle this script');
                return null;
            }
        }
        window.onload = initOnload;
        function initOnload() {
            var userid = '<%=userid %>';
            var key = '<%=key%>';
			//alert("userid" + userid);
			//alert("key" + key);
            var fromData = '<%=_fromData%>';
            var fmbdxml = "";
			
			fmbdxml += makeNode("tbContentElement", fromData, null, true);
			fmbdxml = "<BODY_CONTEXT>" + fmbdxml + "</BODY_CONTEXT>";
			form1.fmbd.value = fmbdxml;
            form1.submit();
        }
        function makeNode(sName, vVal, sKey, bCData) {
            //debugger;
            if (vVal == null) { m_cvtXML.text = dField[(sKey != null ? sKey : sName)].value; } else { m_cvtXML.text = vVal; }
            return "<" + sName + ">" + (bCData ? "" : "") + (bCData ? m_cvtXML.text + "" : m_cvtXML.xml) + "</" + sName + ">";
            //return "<" + sName + ">" + (bCData ? "<![CDATA[" : "") + (bCData ? m_cvtXML.text + "]]>" : m_cvtXML.xml) + "</" + sName + ">";
        }
        function toUTF8(szInput) {
            var wch, x, uch = "", szRet = "";
            for (x = 0; x < szInput.length; x++) {
                wch = szInput.charCodeAt(x);
                if (!(wch & 0xFF80)) {
                    szRet += "%" + wch.toString(16);
                }
                else if (!(wch & 0xF000)) {
                    uch = "%" + (wch >> 6 | 0xC0).toString(16) +
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
            return (szRet);
        }                
    </script>
</head>
<body>
    <form id="form1" action="Form.aspx?fmid=<%=fmid %>&scid=<%=scid %>&fmpf=<%=fmpf %>&fmrv=<%=fmrv %>&mode=DRAFT&fmnm=<%=fmnm %>" method="post">
       <textarea id="fmbd" name="fmbd" cols="10" rows="10" style="display:none"><%=_fromData %></textarea>
       <input type="hidden" id="gbnno" name="gbnno" value="<%=_gbnno%>" />
	   <input type="hidden" id="docType" name="docType" value="<%=_docType%>" />
	   
       
    </form>
</body>
</html>
