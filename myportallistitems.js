var m_xmlHTTP=new ActiveXObject("MSXML2.XMLHTTP");
var m_objXML=new ActiveXObject("MSXML2.DOMDocument");
var g_szAcceptLang="ko";
var L_idsSearcing_Text="Loading...";
var L_idsUnknownError_Text="Unknown Error";
var g_eGalTable;
var g_eErrorDiv;
var g_eCurrentRow;
var g_objXmlSelectedWorkItem=null;
var m_objRowLastSelected=null;
var m_objRowRange=null;
var UP=0;
var DOWN=1;
var truthBeTold;
var pagecnt = 5;
var g_totalpage=1;

function window.onload(){
	g_eErrorDiv = window.document.all['divErrorMessage'];
	//clearContents();
	queryGetData();
}
function queryGetData(){
	if ( page == "") { page = 1;}
	//var szURL = "/xmlwf/query/wf_worklistquery01approval.xml?";
	//szURL +="USER_ID=" + uid+"&MODE=" + gLocation+"&PI_NAME=" + "&PI_INITIATOR_NAME=" + ''+"&PI_ETC=" + '';
	//requestHTTP("GET",szURL,true,"text/xml",receiveHTTP,null);
	////doProgressIndicator(true);
    var PF_PERFORMER_ID=uid;
    var USER_ID=uid;
    var PF_SUB_KIND="";
	var PI_FINISHED="";
	var PI_NAME= "";//toUTF8(spi_name);
	var PAGENUM= page;
	var PAGECNT= pagecnt;
	var QUERYSIZE= pagecnt;	
	var GROUP_KIND= "total";
	var TITLE= "";//toUTF8(gTitle);
	var ORDERFILED="";			
	var ORDERDESC="";	
	var PI_INITIATOR_NAME="";
	var PI_ETC= "";
	var WI_STATE=288;
	var PI_STATE=288;
	var PF_STATE = "1";
	var MODE="";
	var connectionname = "INST_ConnectionString";
    var pXML =null ;
    if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01approval ";	
    pXML += "'" + PF_PERFORMER_ID + "','" + WI_STATE + "','" + PI_STATE + "','" + MODE + "','" + PI_NAME + "','" + PI_INITIATOR_NAME + "','" + PI_ETC + "','" + PAGENUM + "','" + PAGECNT + "','" + QUERYSIZE + "','" + GROUP_KIND + "','" + TITLE + "','" + ORDERFILED + "','" + ORDERDESC +"'";
    var sXML = "<Items><connectionname>"+connectionname+"</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
    var szURL = "getXMLQuery.aspx";
    requestHTTP("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTP, sXML);
}

function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	m_xmlHTTP.open(sMethod,sUrl,bAsync);
	//m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
	m_xmlHTTP.setRequestHeader( "Content-type", sCType);
	if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
}
function receiveHTTP(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		var xmlReturn=m_xmlHTTP.responseXML;
		if(xmlReturn.xml==""){
			alert(m_xmlHTTP.responseText);
		}else{
			var errorNode=xmlReturn.selectSingleNode("response/error");
			if(errorNode!=null){
				alert("Desc: " + errorNode.text);
			}
			else{
				var m_oXSLProcessor, strXSLFile;
				strXSLFile = "wf_worklistquery01.xsl"; //personal document

				m_oXSLProcessor = makeProcessor(strXSLFile);
				m_oXSLProcessor.input = xmlReturn;
				m_oXSLProcessor.addParameter("sortby", gOrder);
				if ( page == "") { page = 1;}

				m_oXSLProcessor.addParameter("iPage", page);
				m_oXSLProcessor.addParameter("iPageSize", pagecnt);
				m_oXSLProcessor.transform();
				m_objXML.loadXML(m_oXSLProcessor.output);

				(truthBeTold)?document.location.reload():processXml();
			}
		}
	}
}
function receiveGeneralQuery(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseXML.xml==""){
			alert(m_xmlHTTP.responseText);
		}else{
			var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			if(errorNode!=null){
				alert("Desc: " + errorNode.text);
			}else{
				alert(m_xmlHTTP.responseXML.documentElement.text);
				document.location.reload();
			}
		}
	}
}
function processXml(){
	window.totalcount.innerHTML=  m_objXML.selectSingleNode("response/totalcount").text;
	if (m_objXML.selectSingleNode("response/totalcount").text == '0'){ displayZero(true);}
	//2003.03.27 ?⑹꽑???섏젙
	processXmlData(m_objXML);
	//doProgressIndicator(false); 
	//alert(1);

}
function makeProcessor(urlXsl){
	var oXslDom = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
	oXslDom.async = false;
	if(!oXslDom.load(urlXsl)){
		alertParseError(oXslDom.parseError);
		throw new Error(-1,"couldn't make TemplateProcessor with ["+urlXsl+"].");
	}
	var oXSLTemplate = new ActiveXObject("MSXML2.XSLTemplate");
	oXSLTemplate.stylesheet = oXslDom;
	return oXSLTemplate.createProcessor();
}
function doProgressIndicator(fDisplay){
	if (fDisplay){
		addMessage(L_idsSearcing_Text);
	}
	else{
		g_eErrorDiv.style.display = "none";
		divGalTable.style.display = "block";
	}
}
function displayZero(fDisplay){
	if (fDisplay){
		g_eErrorDiv.innerText = "There is no result.";
		g_eErrorDiv.style.display = "block";
		divGalTable.style.display = "none";
	}
	else{
		g_eErrorDiv.style.display = "none";
		divGalTable.style.display = "block";
	}
}
function clearContents(){
	g_eErrorDiv.innerText = "";
	g_eErrorDiv.style.display = "none";
	divGalTable.style.display = "block";
}
function event_noop(){return(false);} 
function HtmlEncode(text){
    return text.replace(/&amp;/g, '&').replace(/&quot;/g, "\"").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&apos;/g, "'");
}
function processXmlData(objXML){
	objXML.documentElement.transformNodeToObject(g_oSSXML.documentElement,m_objXML);

	var m_oXSLProcessor;
	var xslURL="myportallistitems.xsl";
	m_oXSLProcessor = makeProcessor(xslURL);
	m_oXSLProcessor.input = m_objXML;
	m_oXSLProcessor.addParameter("sTitle", gLabel);
	m_oXSLProcessor.transform();
	divGalTable.innerHTML = m_oXSLProcessor.output;
	g_eGalTable = window.document.all['tblGalInfo'];
	g_eGalTable.attachEvent("ondblclick", event_GalTable_ondblclick);
}

function event_GalTable_ondblclick(){
	if (event.srcElement.parentElement.parentElement.tagName != "THEAD" && event.srcElement.parentElement.parentElement.tagName != "TABLE" ){
		if (g_eCurrentRow != null){
			g_eCurrentRow.setAttribute("className","rowunselected");
			g_eCurrentRow.style.backgroundColor = "#ffffff";//"transparent";
			g_eCurrentRow.style.color = "#333333";//"windowtext";
		}
		eTR = event.srcElement.parentElement;
		while(eTR.tagName != "TR"){
			eTR = eTR.parentElement;
		}
		eTR.setAttribute("className","rowselected");
		g_eCurrentRow = eTR;
		g_eCurrentRow.style.backgroundColor = "#e2e8ce";//"HIGHLIGHT";
		g_eCurrentRow.style.color = "#333333";//"HIGHLIGHTTEXT";		
		processSelectedRow();
	}
}
function processSelectedRow(){
	if ( getRowAttribute(g_eCurrentRow,"fmid") != "" ){
		var strURL ="Forms/Form.aspx?mode=" + getRowAttribute(g_eCurrentRow,"mode")
					+ "&piid=" + getRowAttribute(g_eCurrentRow,"piid") + "&pfid=" + getRowAttribute(g_eCurrentRow,"pfid")
					+ "&ptid=" + getRowAttribute(g_eCurrentRow,"participantid") + "&pist=" + getRowAttribute(g_eCurrentRow,"piviewstate")
					+ "&wiid=" + getRowAttribute(g_eCurrentRow,"workitemid") + "&bstate=" + getRowAttribute(g_eCurrentRow,"bstate")
					+ "&fmid=" + getRowAttribute(g_eCurrentRow,"fmid") + "&fmnm=" + toUTF8(getRowAttribute(g_eCurrentRow,"fmnm"))
					+ "&fmpf=" + getRowAttribute(g_eCurrentRow,"fmpf") + "&fmrv=" + getRowAttribute(g_eCurrentRow,"fmrv") + "&fiid=" + getRowAttribute(g_eCurrentRow,"fiid")
					+ "&ftid=" + getRowAttribute(g_eCurrentRow,"ftid") + "&fitn=" + getRowAttribute(g_eCurrentRow,"fitn") + "&scid=" + getRowAttribute(g_eCurrentRow,"scid")
					+ "&pfsk=" + getRowAttribute(g_eCurrentRow,"pfsk") + "&pidc=" + "&pibd1=" + toUTF8(getRowAttribute(g_eCurrentRow,"pibd1"))
					+ "&secdoc=" + getRowAttribute(g_eCurrentRow,"secdoc");//+ toUTF8(getRowAttribute(g_eCurrentRow,"pidc")) 
		//alert("strURL:"+ strURL);
		var width = 800 ;
		var height = window.screen.height - 65;
//		if (getRowAttribute(g_eCurrentRow,"fmpf") == "BUDGET_CHANGE_REQUEST") height = 700 ;
		openWindow(strURL,"FORMS",width ,height ,'resize');
	}
}
function getRowAttribute(elm,sName){var v=elm.getAttribute(sName);return (v==null?"":v);}
function addMessage(szMsg){
	var re = /??ぉ??李얠쓣 ???놁뒿?덈떎./i;
   
	if(szMsg.search(re)!=-1) szMsg = "Could not find the matching item.";
	g_eErrorDiv.innerText = szMsg;
	g_eErrorDiv.style.display = "block";
	divGalTable.style.display = "none";
}
