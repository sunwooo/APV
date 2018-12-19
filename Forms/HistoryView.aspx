<%@ Page Language="C#" AutoEventWireup="true" CodeFile="HistoryView.aspx.cs" Inherits="COVIFlowNet_Forms_HistoryView" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="Cache-Control" content="no-cache" />
	<meta http-equiv="Pragma" content="no-cache" />
	<title></title>
    <script type="text/javascript" language="javascript" src="../../SiteReference/js/Utility.js"></script>
</head>
<body leftmargin="0" topmargin="0">
<iframe frameborder="0" id="iframefrm" src='' width="100%" height="490px" ></iframe>
<!-- 양식전체본문 -->

<script type="text/javascript" language="javascript">
var oApvList = CreateXmlDocument();
var oParent;
var oMenu, oEditor;
var timerID;
var oiframefrm;

window.onload = initOnload;
function initOnload() {
    if ( parent != null){
        oParent = parent.opener;
    }else{
        oParent = opener.opener;
    }

	var szURL = String(oParent.parent.location.href);
	if(szURL.indexOf("_read") == -1){
	    szURL = szURL.replace(".htm","_read.htm").replace(".HTM","_read.HTM");
	}
	document.getElementById("iframefrm").src = szURL;
	setTimeout("setPreView()",1000);
 }
 function setPreView() {
     try {
         try {
             if (document.getElementById("iframefrm").contentDocument) {
                 document.getElementById("iframefrm").contentDocument.body.rows = "0,*,0";
                 document.getElementById("iframefrm").contentWindow.g_szEditable = false;

                 oMenu = document.getElementById("iframefrm").contentWindow.frames[0];
                 oEditor = document.getElementById("iframefrm").contentWindow.frames[1];
             } else {
                 iframefrm.main.rows = "0,*,0";
                 iframefrm.main.g_szEditable = false;

                 oMenu = iframefrm.menu;
                 oEditor = iframefrm.editor;
             }
             oMenu.setInfo("mode", "COMPLETE");
             oMenu.setInfo("loct", "COMPLETE");
             setHeader();
             var sFormXml = '<%=selEnt.ToString() %>';
             var xmlFormXML = CreateXmlDocument();
             xmlFormXML.loadXML(sFormXml);
             var FormNodes = xmlFormXML.documentElement;
             var elmList = FormNodes.selectNodes("Table");
             for (var i = 0; i < elmList.length; i++) {
                 elm = elmList.nextNode();
                 if (elm == null) elm = elmList.item[i];
                 oMenu.setInfo(elm.selectSingleNode("FIELD_NAME").text, elm.selectSingleNode("MODIFIED_VALUE").text);
             }
             //oEditor.src = oMenu.getInfo("fmpf") + '_V' + oMenu.getInfo("fmrv") + "_read.htm";
             try {
                 oEditor.initForm();
             } catch (e) { }
             //setTimeout("setHeader()", 1000);
         } catch (e) {
             //alert(e.message);
             setTimeout("setPreView()", 1000);
         }
         //clearInterval(timerID);
     } catch (e) {alert(e.message); }
}
   
function setHeader(){
	oEditor.document.getElementById("AppLine").style.display="none";
	oMenu.document.getElementById("secrecy").style.display  = "none";
}

</script>
</body>
</html>