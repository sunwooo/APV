<%@ Page Language="C#" AutoEventWireup="true" CodeFile="MonitorGraphic.aspx.cs" Inherits="COVIFlowNet_ApvMonitor_MonitorGraphic" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
	<head runat="server">
		<title></title>
        <style type="text/css">
            table {font-size:9pt;color:black}
        </style>
		<script type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
		<script type="text/javascript">
			var m_xmlHTTPXSL = CreateXmlHttpRequest();
			var m_objXML = CreateXmlDocument();
			var g_szAcceptLang="ko";//alert(10);

			function drawGraphic(srcXML)
			{//alert(13);
				var src = CreateXmlDocument(); 
				var target = CreateXmlDocument();
				var m_oXSLProcessor;
				src.loadXML("<?xml version='1.0' encoding='utf-8'?>"+srcXML);
				m_oXSLProcessor = makeProcessorScript("MonitorGraphicXSL.aspx");
				var sXML = "<Items><xml><![CDATA[" + src.xml.replace(/<!\[CDATA\[/gi, "@CDATASTART").replace(/\]\]>/gi, "@CDATAEND") + "]]></xml><xslxml><![CDATA[" + m_oXSLProcessor + "]]></xslxml><param><name>lngindex</name><value><![CDATA["+"<%=strLangIndex %>"+"]]></value></param></Items>";
				var szURL = "../getXMLXslParsing.aspx";
				requestHTTPXSL("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTPXSL, sXML);
			}

			function requestHTTPXSL(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
				m_xmlHTTPXSL.open(sMethod,sUrl,bAsync);
				m_xmlHTTPXSL.setRequestHeader("Accept-Language",g_szAcceptLang);
				m_xmlHTTPXSL.setRequestHeader("Content-type", sCType);
				if(pCallback!=null)m_xmlHTTPXSL.onreadystatechange = pCallback;
				(vBody!=null)?m_xmlHTTPXSL.send(vBody):m_xmlHTTPXSL.send();
			}

			function receiveHTTPXSL(){	
				if(m_xmlHTTPXSL.readyState==4){
					m_xmlHTTPXSL.onreadystatechange=event_noop;
					var xmlReturn=m_xmlHTTPXSL.responseXML;
		
					if (m_xmlHTTPXSL.responseText.charAt(0) == '\r') {
						alert(m_xmlHTTPXSL.responseText);
					}
					else
					{
						document.getElementById("divmain").innerHTML =  xmlReturn.documentElement.xml;
   
						try{ parent.document.getElementById("iApvGraphic").height = 235;	}catch(e){}	      
					}
				}
			}
			function makeProcessorScript(urlXsl){
			  var oXSL = "";
			  var oXslDom = CreateXmlDocument();
				var oXMLHttp =  CreateXmlHttpRequest();
				oXMLHttp.open("GET",urlXsl,false);
				oXMLHttp.send();
				//시간 늘리기
				delay(600);
				if ( oXMLHttp.status == 200){
				   oXSL = oXMLHttp.responseText;
				}
				return oXSL;
			}
			function delay(gap){/*gap is in milisecs*/
				var then, now;
				then = new Date().getTime();
				now=then;
				while((now-then)<gap)
				{
					now = new Date().getTime();
				}
			}
		</script>
	</head>
	<body>
		<div id="divmain" style="height:220px;"></div>
	</body>
</html>