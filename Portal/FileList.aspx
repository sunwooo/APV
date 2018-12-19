<%@ Page Language="C#" AutoEventWireup="true" CodeFile="FileList.aspx.cs" Inherits="Approval_Portal_FileList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>제목 없음</title>
    <script type="text/javascript" language="javascript" src="/CoviWeb/common/script/coviflownet/openwindow.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <table><tr><%=GetFileList() %></tr></table>
    <iframe id="download" src="" name="download" style="display:none;"></iframe>
    </form>
    <script type="text/javascript" language="javascript">
        var m_xmlHTTP = CreateXmlHttpRequest();
        var m_evalXML = CreateXmlDocument();
        /* 웹표준화로 수정
        var m_xmlHTTP = new ActiveXObject("Msxml2.XMLHTTP");
        var m_evalXML = new ActiveXObject("Msxml2.DOMDocument");*/
        
        var oXML = null;
        var usid = "<%=Session["user_code"]%>";
        
        window.onload= initOnload;
        function initOnload()
        {
            // getData();
        }
        /* 웹표준화로 수정
        function window.onload(){
           // getData();
        }*/
        
        function getData(){
            try{
                var pXML ="dbo.usp_wf_worklistquery01Attach";
                var aXML ="<param><name>USER_ID</name><type>VarChar</type><length>256</length><value>"+usid+"</value></param>";
                aXML +="<param><name>WI_CREATED</name><type>VARHCHAR</type><length>10</length><value>"+'2009-01-01'+"</value></param>";
                var sXML ="<Items><connectionname>INST_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
                var szURL = "../GetXMLQuery.aspx";
                requestHTTP("POST",szURL,true,"text/xml",receiveHTTP,sXML);
            }catch(e)
            {
                alert("Error:"+e.description+"\r\nError number: " + e.number);
            }
        }
        function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody)
		{	
			m_xmlHTTP.open(sMethod,sUrl,bAsync);
			m_xmlHTTP.setRequestHeader("Content-type", sCType);
			if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
			(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
		}
		function event_noop(){return(false);}
		function receiveHTTP(){
		    if(m_xmlHTTP.readyState==4){
		        m_xmlHTTP.onreadystatechange=event_noop;
		        var xmlReturn=m_xmlHTTP.responseXML;
		        if(m_xmlHTTP.responseText.charAt(0) == '\r'){
		            alert(m_xmlHTTP.responseText);
		        }else{
		            var errorNode = m_xmlHTTP.responseXML.selectSingleNode("response/error");
		            
		            if(errorNode != null){
		                alert("Desc: "+ errorNode.text);
		            }else{
		                //try{
		                    //debugger;
		                    var m_oXSLProcessor, strXSLFile;
		                    strXSLFile = "file_listXSL.aspx";
		                    m_oXSLProcessor = makeProcessor(strXSLFile);
				            m_oXSLProcessor.input = xmlReturn;
				            m_oXSLProcessor.transform();
				            //alert(fileList.innerHTML);
				            fileList.innerHTML=m_oXSLProcessor.output;
				            oXML = xmlReturn;
		                //}catch(e){
		                //}
		            }
		            
		        }
		    }
		}
		function makeProcessor(urlXsl){
	        var oXslDom = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
	        oXslDom.async = false;
	        if(!oXslDom.load(urlXsl)){
		        throw new Error(-1,"couldn't make TemplateProcessor with ["+urlXsl+"].");
	        }
	        var oXSLTemplate = new ActiveXObject("MSXML2.XSLTemplate");
	        oXSLTemplate.stylesheet = oXslDom;
	        return oXSLTemplate.createProcessor();
        }
        var g_eCurrentRow;
        function event_GalTable_ondblclick(){
            if (event.srcElement.parentElement.parentElement.tagName != "THEAD" && event.srcElement.parentElement.parentElement.tagName != "TABLE" ){
                if (g_eCurrentRow != null){
//	                g_eCurrentRow.setAttribute("className","rowunselected");
//	                g_eCurrentRow.style.backgroundColor = "#ffffff";//"transparent";
//	                g_eCurrentRow.style.color = "#333333";//"windowtext";
                }
                eTR = event.srcElement.parentElement;
                while(eTR.tagName != "TR"){
	                eTR = eTR.parentElement;
                }
//                eTR.setAttribute("className","rowselected");
                g_eCurrentRow = eTR;
//                g_eCurrentRow.style.backgroundColor = "#e2e8ce";//"HIGHLIGHT";
//                g_eCurrentRow.style.color = "#333333";//"HIGHLIGHTTEXT";		
                processSelectedRow();
            }
        }
        function processSelectedRow(){
            if ( getRowAttribute(g_eCurrentRow,"fmid") != "" ){
                var strURL ="../Forms/Form.aspx?mode=" + getRowAttribute(g_eCurrentRow,"mode")
                            + "&piid=" + getRowAttribute(g_eCurrentRow,"piid")
                            + "&pfid=" + getRowAttribute(g_eCurrentRow,"pfid")
                            + "&ptid=" + getRowAttribute(g_eCurrentRow,"ptid")
                            + "&wiid=" + getRowAttribute(g_eCurrentRow,"wiid")
                            + "&bstate=" + getRowAttribute(g_eCurrentRow,"bstate")
                            + "&fiid=" + getRowAttribute(g_eCurrentRow,"fiid")
                            + "&pfsk=" + getRowAttribute(g_eCurrentRow,"pfsk")
                            + "&fmid=" + getRowAttribute(g_eCurrentRow,"fmid")
                            + "&fmnm=" + toUTF8(getRowAttribute(g_eCurrentRow,"fmnm"))
                            + "&fmpf=" + getRowAttribute(g_eCurrentRow,"fmpf")
                            + "&scid=" + getRowAttribute(g_eCurrentRow,"scid")
                            + "&fmrv=" + getRowAttribute(g_eCurrentRow,"fmrv")
                            + "&fmfn=" + getRowAttribute(g_eCurrentRow,"fmfn");
                            
                            
//			                + "&piid=" + getRowAttribute(g_eCurrentRow,"piid") + "&pfid=" + getRowAttribute(g_eCurrentRow,"pfid")
//			                + "&ptid=" + toUTF8(getRowAttribute(g_eCurrentRow,"participantid")) + "&pist=" + getRowAttribute(g_eCurrentRow,"piviewstate")
//			                + "&wiid=" + getRowAttribute(g_eCurrentRow,"workitemid") + "&bstate=" + getRowAttribute(g_eCurrentRow,"bstate")
//			                + "&fmid=" + getRowAttribute(g_eCurrentRow,"fmid") + "&fmnm=" + toUTF8(getRowAttribute(g_eCurrentRow,"fmnm"))
//			                + "&fmpf=" + getRowAttribute(g_eCurrentRow,"fmpf") + "&fmrv=" + getRowAttribute(g_eCurrentRow,"fmrv") + "&fiid=" + getRowAttribute(g_eCurrentRow,"fiid")
//			                + "&ftid=" + getRowAttribute(g_eCurrentRow,"ftid") + "&fitn=" + getRowAttribute(g_eCurrentRow,"fitn") + "&scid=" + getRowAttribute(g_eCurrentRow,"scid")
//			                + "&pfsk=" + getRowAttribute(g_eCurrentRow,"pfsk") + "&pidc=" + toUTF8(getRowAttribute(g_eCurrentRow,"pidc")) + "&pibd1=" + toUTF8(getRowAttribute(g_eCurrentRow,"pibd1"))
//			                + "&secdoc=" + getRowAttribute(g_eCurrentRow,"secdoc")+ "&edms_document=" + getRowAttribute(g_eCurrentRow,"edms_document")+"&pipr="+getRowAttribute(g_eCurrentRow,"pipr");				
                var width = 800 ;
                var height = window.screen.height - 65;
                openWindow(strURL,"",width ,height ,'fix');
            }
        }

        function getRowAttribute(elm,sName){var v=elm.getAttribute(sName);return (v==null?"":v);}
        function toUTF8(szInput){
	        var wch,x,uch="",szRet="";
	        for (x=0; x<szInput.length; x++) {
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
        function PopListSingle(){
             var SingleDownLoadString = '';
             
            if (event.srcElement.parentElement.parentElement.tagName != "THEAD" && event.srcElement.parentElement.parentElement.tagName != "TABLE" ){
                if (g_eCurrentRow != null){
                }
                eTR = event.srcElement.parentElement;
                while(eTR.tagName != "TR"){
                    eTR = eTR.parentElement;
                }
                g_eCurrentRow = eTR;
                SingleDownLoadString = getRowAttribute(g_eCurrentRow,"fileurl")
            }    
            if (  SingleDownLoadString != ''){        
                download.location.href ='/CoviWeb/SiteReference/Common/covi_fileSingledown.aspx?filepath=' + toUTF8(SingleDownLoadString) ;
             }
        }
    </script>
</body>

</html>
