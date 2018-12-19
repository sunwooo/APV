<%@ Page Language="C#" AutoEventWireup="true" CodeFile="doc.aspx.cs" Inherits="Approval_Forms_doc" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>결재연동양식연결</title>
    <script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js" ></script>
    <script type="text/javascript" language="javascript" >
        window.onload = initOnload;
        function initOnload() {
            var piid = '<%=_piid %>';
            var pidc = '<%=PIDC%>';

            //정보가져오기 만들기
            var szURL = "form.aspx?mode=COMPLETE&piid=" + piid;
            var m_oFormInfos = CreateXmlDocument();
            m_oFormInfos.async = false;
            m_oFormInfos.loadXML("<?xml version='1.0' encoding='utf-8'?>" + pidc);
            var root = m_oFormInfos.documentElement;
            var forminfoNode = root.childNodes.item(0).childNodes.item(0).childNodes.item(0);
            var fmpf = forminfoNode.getAttribute("prefix");
            var fmrv = forminfoNode.getAttribute("revision");
            var fiid = forminfoNode.getAttribute("instanceid");
            var fmid = forminfoNode.getAttribute("id");
            var fmnm = forminfoNode.getAttribute("name");
            var scid = forminfoNode.getAttribute("schemaid");
            szURL += "&fmpf=" + fmpf;
            szURL += "&fmrv=" + fmrv;
            szURL += "&fiid=" + fiid;
            szURL += "&fmid=" + fmid;
            szURL += "&fmnm=" + toUTF8(fmnm);
            szURL += "&scid=" + scid;
            szURL += "&mobileyn=" + "<%=mobileyn %>";


            document.getElementById("form1").action = szURL;
            //submit호출
            document.getElementById("form1").submit();
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
    <form id="form1" action="Form.aspx" method="post">
       <textarea id="fmbd" name="fmbd" cols="10" rows="10" style="display:none"></textarea>
    </form>
</body>
</html>
