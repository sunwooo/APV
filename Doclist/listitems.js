var m_xmlHTTP = CreateXmlHttpRequest();
var m_xmlHTTPXSL = CreateXmlHttpRequest();
var m_objXML = CreateXmlDocument();
/* 웹표준으로수정
var m_xmlHTTP=new ActiveXObject("MSXML2.XMLHTTP");
var m_objXML=new ActiveXObject("MSXML2.DOMDocument");*/
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
var strSearch;
var truthBeTold;
var pagecnt = 10;
var g_totalpage = "";
var g_totalcount = "";
var g_orderfield = "";
var g_orderdesc = "";
var	gOrder = "";

window.onload= initOnload;
function initOnload()
{	
	g_eErrorDiv = document.getElementById("divErrorMessage");

	clearContents();	
	queryGetData();	
}
function queryGetData(){
	if ( page == "") { page = 1;}
	
	var aryOrder = new String();
	aryOrder = gOrder.split(";");	
	
	if (aryOrder.length>1){
		g_orderfield = aryOrder[1];
		g_orderdesc = aryOrder[0];
	}	

	var OWNER_UNIT_CODE= sDept;//alert(window.location);
	var DOC_LIST_TYPE= sDocListType;//alert(sDocListType);
	var YEARMONTH= sMonth;
	var PAGE= page;
	var PAGECOUNT= pagecnt;
	var ORDER_FIELD= g_orderfield;
	var ORDER_SORT= g_orderdesc; 
	/*
	var pXML = "	EXEC dbo.usp_wfform_docList ";
	pXML += "'" + OWNER_UNIT_CODE + "','" + DOC_LIST_TYPE + "','" + YEARMONTH + "','" + PAGE + "','" + PAGECOUNT + "','" + ORDER_FIELD + "','" + ORDER_SORT +"'";
	*/
	var pXML = "dbo.usp_wfform_docList";//alert(57);
	var aXML="<param><name>OWNER_UNIT_CODE</name><type>varchar</type><length>256</length><value><![CDATA["+OWNER_UNIT_CODE+"]]></value></param>";
	    aXML+="<param><name>DOC_LIST_TYPE</name><type>varchar</type><length>256</length><value><![CDATA["+DOC_LIST_TYPE+"]]></value></param>";
	    aXML+="<param><name>YEARMONTH</name><type>varchar</type><length>256</length><value><![CDATA["+YEARMONTH+"]]></value></param>";
	    aXML+="<param><name>PAGE</name><type>int</type><length>4</length><value><![CDATA["+PAGE+"]]></value></param>";
	    aXML+="<param><name>PAGECOUNT</name><type>int</type><length>4</length><value><![CDATA["+PAGECOUNT+"]]></value></param>";
	    aXML+="<param><name>ORDER_FIELD</name><type>varchar</type><length>256</length><value><![CDATA["+ORDER_FIELD+"]]></value></param>";
	    aXML+="<param><name>ORDER_SORT</name><type>varchar</type><length>256</length><value><![CDATA["+ORDER_SORT+"]]></value></param>";
	
	var	connectionname = "FORM_DEF_ConnectionString";
    var sXML = "<Items><connectionname>"+connectionname+"</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>" + aXML + "</Items>" ;
    //var szURL = "../getXMLQuery.aspx";
    var szURL = "./getXMLDocList.aspx";
	
	doProgressIndicator(true);
    requestHTTP("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTP, sXML);
}

function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	m_xmlHTTP.open(sMethod,sUrl,bAsync);
	m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
	m_xmlHTTP.setRequestHeader( "Content-type", sCType);
	if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
}
function receiveHTTP(){
	if(m_xmlHTTP.readyState==4){	
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			alert(m_xmlHTTP.responseText);
		}
		else{
			var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			if(errorNode!=null){
				alert("Desc: " + errorNode.text);
			}
			else{
			    //m_objXML.loadXML(m_xmlHTTP.responseXML.documentElement.xml);
			    m_objXML = m_xmlHTTP.responseXML;
		      
              processXml();
			
//				var m_oXSLProcessor, strXSLFile;
//				var aXML = "";
//				strXSLFile = "wf_doclistquery01.xsl"; 
//               
//				m_oXSLProcessor = makeProcessorScript(strXSLFile);
//				
//				if ( page == "") { page = 1;}
//				
//				aXML+="<param><name>iPage</name><value><![CDATA["+page+"]]></value></param>";
//            	aXML+="<param><name>iPageSize</name><value><![CDATA["+pagecnt+"]]></value></param>";
//				
//				var sXML = "<Items><xml><![CDATA[" + m_xmlHTTP.responseXML.xml + "]]></xml><xslxml><![CDATA[" + m_oXSLProcessor + "]]></xslxml>"+aXML+"</Items>" ;
//	        
//                var szURL = "../getXMLXslParsing.aspx";

//                requestHTTPXSL("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTPXSL, sXML);
			}
		}
	}
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
		      m_objXML.loadXML(xmlReturn.documentElement.xml);
		      
              processXml();
		}
	}
}
function receiveHTTPXSL2(){	
	if(m_xmlHTTPXSL.readyState==4){
		m_xmlHTTPXSL.onreadystatechange=event_noop;
		var xmlReturn=m_xmlHTTPXSL.responseXML;
		
		if (m_xmlHTTPXSL.responseText.charAt(0) == '\r') {
			alert(m_xmlHTTPXSL.responseText);
		}
		else
		{		
		    m_objXML.loadXML(xmlReturn.documentElement.xml);		   
		    document.getElementById("divGalTable").innerHTML = m_objXML.xml;
		    
		    g_eGalTable = window.document.getElementById("tblGalInfo");

            if(window.addEventListener){           
	            g_eGalTable.addEventListener("mousedown",event_GalTable_ondblclick, false);
	        }else{	   
	            g_eGalTable.attachEvent("onmousedown",event_GalTable_ondblclick);	    
	        }
        		
            if (gOrder != '')
	        {
		        var aOrder=gOrder.split(";");
		        document.getElementById('span'+aOrder[1]).innerHTML = '<img src="'+ g_imgBasePath+ '/Covi/common/icon/blt_07_'+aOrder[0]+'.gif" align="absmiddle">';
	        }
		}
	}
}
function processXml(){
	var pageList = "";
    var temp = page - 1;
    var cPage = parseInt(temp / 10);    
    var startPage;
    if (cPage == 0) {
        startPage = 1;
    }
    else {
        startPage = cPage + "1";
    }
    var endPage = m_objXML.selectSingleNode("response/totalpage").text;
    var fPage;
    var temp2 = endPage - 1;
    var ePage = parseInt(temp2 / 10);
    if (cPage == ePage) {
        fPage = endPage
    }
    else if (endPage == "NaN") {
        fPage = 1;
    }
    else {
        fPage = parseInt(startPage) + 9;
    }
    for (i = startPage; i <= fPage; i++) {
        if (pageList != "") { pageList = pageList + "&nbsp;|&nbsp;"; }
        (i == page) ? pageList += "<span><b>" + i + "</b></span>" : pageList += "<a href='#' onclick='go_page(" + i + ")'>" + i + "</a>";
    }
    document.getElementById("totalpage").innerHTML = pageList;
	try{parent.document.getElementById("totalpage").innerHTML = pageList;}catch(e){}
	g_totalpage = m_objXML.selectSingleNode("response/totalpage").text;
	g_totalcount = m_objXML.selectSingleNode("response/totalcount").text;	
		
	processXmlData(m_objXML);
	
	doProgressIndicator(false); 

}
function makeProcessor(urlXsl){
    if (window.ActiveXObject) {
        var oXslDom = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
        oXslDom.async = false;
        if(!oXslDom.load(urlXsl)){
	        alertParseError(oXslDom.parseError);
	        throw new Error(-1,"couldn't make TemplateProcessor with ["+urlXsl+"].");
        }
        var oXSLTemplate = new ActiveXObject("MSXML2.XSLTemplate");
        oXSLTemplate.stylesheet = oXslDom;
        return oXSLTemplate.createProcessor();
    }else{
        var oXSL = "";
 
        var oXMLHttp =  CreateXmlHttpRequest();
        oXMLHttp.open("GET",urlXsl,false);
        oXMLHttp.send();
        //시간 늘리기
        delay(600);
        if ( oXMLHttp.status == 200){
           var parser = new DOMParser();
           oXslDom = parser.parseFromString(oXMLHttp.responseText,"text/xml");           
        }

        var oProcessor = new XSLTProcessor();
        oProcessor.importStylesheet(oXslDom);
        return oProcessor;
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
function sortColumn(szClm){
	var aOrder=gOrder.split(";");
	if(aOrder[1]==szClm && aOrder[0]=="asc")
		gOrder="desc;" + szClm;
	else
		gOrder="asc;" + szClm;			
	
	if(m_xmlHTTP.responseXML.xml != ""){
		clearContents();
		go_page(page);		

		doProgressIndicator(false); 
	}else if (m_objXML.documentElement.childNodes.length == 0){
		clearContents();
		displayZero(true);
	}
}
function doProgressIndicator(fDisplay){
	if (fDisplay){
		addMessage(L_idsSearcing_Text);
	}
	else{
		g_eErrorDiv.style.display = "none";
		document.getElementById("divGalTable").style.display = "block";
	}
}
function displayZero(fDisplay){
	if (fDisplay){
		g_eErrorDiv.innerText = "검색된 자료가 없습니다.";		
	}
	else{
		g_eErrorDiv.style.display = "none";
		document.getElementById("divGalTable").style.display = "block";
	}
}
function clearContents(){
	g_eErrorDiv.innerText = "";
	g_eErrorDiv.style.display = "none";
	document.getElementById("divGalTable").style.display = "block";
}
function event_noop(){return(false);} 
function HtmlEncode(text){
    return text.replace(/&amp;/g, '&').replace(/&quot;/g, "\"").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&apos;/g, "'");
}
function processXmlData(objXML){
//	var m_oXSLProcessor;
//	switch (sDocListType)
//	{
//	    case "1": m_oXSLProcessor = makeProcessorScript("regdoclistXSL.aspx");break;
//	    case "2": m_oXSLProcessor = makeProcessorScript("recdoclistXSL.aspx");break;
//	    case "3": m_oXSLProcessor = makeProcessorScript("pubregdoclistXSL.aspx");break;
//	    case "4": m_oXSLProcessor = makeProcessorScript("pubrecdoclistXSL.aspx");break;
//	    case "5": m_oXSLProcessor = makeProcessorScript("sealdoclistXSL.aspx");break;
//	    case "6": m_oXSLProcessor = makeProcessorScript("reqrecdoclistXSL.aspx");break;
//	    case "7": m_oXSLProcessor = makeProcessorScript("senddoclistXSL.aspx");break;
//	    case "8": m_oXSLProcessor = makeProcessorScript("notedoclistXSL.aspx");break;
//	    case "9": m_oXSLProcessor = makeProcessorScript("notesealdoclistXSL.aspx");break;
//	    case "10" :m_oXSLProcessor = makeProcessorScript("senddoclistXSL.aspx");break;
//	    case "11" :m_oXSLProcessor = makeProcessorScript("senddoclistXSL.aspx");break;
//	}

//    var sXML = "<Items><xml><![CDATA[" + objXML.xml + "]]></xml><xslxml><![CDATA[" + m_oXSLProcessor + "]]></xslxml></Items>" ;
//	        
//    var szURL = "../getXMLXslParsing.aspx";
//    
//    requestHTTPXSL("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTPXSL2, sXML);

    //m_objXML.loadXML(xmlReturn.documentElement.xml);		   
    document.getElementById("divGalTable").innerHTML = objXML.selectSingleNode("response/listhtml").xml;
    
    g_eGalTable = document.getElementById("tblGalInfo");
    if(g_eGalTable!=null){
        if(window.addEventListener){           
            g_eGalTable.addEventListener("mousedown",event_GalTable_ondblclick, false);
        }else{	   
            g_eGalTable.attachEvent("onmousedown",event_GalTable_ondblclick);	    
        }
	}
    if (gOrder != "")
    {
        var aOrder=gOrder.split(";");
        document.getElementById('span'+aOrder[1]).innerHTML = '<img src="'+ g_imgBasePath+ '/Covi/common/icon/blt_07_'+aOrder[0]+'.gif" align="absmiddle">';
    }
    
}
function event_GalTable_onmousedown(){
	if (event.srcElement.tagName != "THEAD" && event.srcElement.tagName != "TABLE" ){
		eTR = event.srcElement.parentElement;
		while(eTR.tagName != "TR"){
			eTR = eTR.parentElement;
		}
		g_eCurrentRow = eTR;
			
		if(g_eCurrentRow != null){
			if(event.ctrlKey){
				m_objRowRange = null;
				var fFire = false;												
				if (g_eCurrentRow.className == "rowselected")
					mf_unselectRecord(g_eCurrentRow);
				else
					mf_selectRecord(g_eCurrentRow);

				//search.focus();
			}
			else if(event.shiftKey){
				if (m_objRowRange == null){
				   if (m_objRowLastSelected != null){
						mf_unselectAll(g_eCurrentRow);
						m_objRowRange = new RowRange(m_objRowLastSelected, g_eCurrentRow);
					}
					else{
						m_objRowRange = new RowRange(g_eCurrentRow, g_eCurrentRow);
					}
				}
				else{
					m_objRowRange.endRow = g_eCurrentRow;
					m_objRowRange.update();
					m_objRowLastSelected = g_eCurrentRow;
				}				
				//search.focus()
			}
			else{
				m_objRowRange = null;
				mf_unselectAll(g_eCurrentRow);
				mf_selectRecord(g_eCurrentRow);
			}
		}
	}
}
function mf_unselectAll(objcol){
	for (var x=g_eGalTable.rows.length-1; x >= 1; x--){
		if(g_eGalTable.rows[x].className == "rowselected" && objcol.sourceIndex != g_eGalTable.rows[x].sourceIndex){
			g_eGalTable.rows[x].setAttribute("className","rowunselected");
			g_eGalTable.rows[x].style.backgroundColor ="#ffffff";// "transparent";
			g_eGalTable.rows[x].style.color ="#333333";// "windowtext";
		}
	}
}
function RowRange(objStartRow, objEndRow){	
	var iDelta = objStartRow.sourceIndex - objEndRow.sourceIndex;
	var objNextRow;	
	this.rangeDirection = 0;	
	if (iDelta == 0){
		mf_selectRecord(objStartRow);
	}
	else{
		this.rangeDirection = (iDelta < 0)?DOWN:UP;
		mf_selectRecord(objStartRow);		
		objNextRow = mf_getNextRow(objStartRow,this.rangeDirection);
		for( ;objNextRow.uniqueID != objEndRow.uniqueID &&  mf_selectRecord(objNextRow);){
			objNextRow = mf_getNextRow(objNextRow,this.rangeDirection);
		}
		mf_selectRecord(objEndRow);
	}	
	this.startRow = objStartRow;
	this.tempEndRow = objEndRow;
	this.endRow   = objEndRow;	
	this.trimRange = mf_trimRowRange;
	this.expandRange = mf_expandRange;
	this.update =  mf_updateRowRange;
}
function mf_selectRecord(objRecord){
	var retval = true;	
	if (objRecord != null && objRecord != false){
		if (objRecord.className  != "rowselected"){
			m_objRowLastSelected = objRecord;			
			objRecord.setAttribute("className","rowselected");
			objRecord.style.backgroundColor = "#D6E7FB";//"highlight";
			objRecord.style.color ="#333333";// "highlighttext";
		}
	}
	else{
		retval = false;
	}
	return(retval);
}
function mf_unselectRecord(objRecord){		
	var retval = false;	
	if(objRecord != null){
		objRecord.setAttribute("className","rowunselected");
		objRecord.style.backgroundColor = "#ffffff";//"transparent";
		objRecord.style.color = "#333333";//"windowtext";		
		retval = true;
	}
	return(retval);
}
function mf_getNextRow(objRow, iDirection){
	var objNextRow = null;
	var retval = false;	
	if (objRow != null){
		if(iDirection == UP)
			objNextRow = objRow.previousSibling;
		else
			objNextRow = objRow.nextSibling;
		
		if(objNextRow != null)retval = objNextRow;		
	}
	return(retval);
}
function mf_updateRowRange(){
	var objNextRow;
	var iTempDir = 0;
	var iDelta = this.startRow.sourceIndex - this.endRow.sourceIndex;
	if(iDelta < 0){
		iTempDir = DOWN;
	}
	else if(iDelta > 0){
		iTempDir = UP;
	}
	else if(iDelta == 0){
		mf_unselectRecord(this.tempEndRow);
		this.tempEndRow = this.endRow;
		this.rangeDirection = null;
		return(true);
	}
	if (this.rangeDirection == null)this.rangeDirection = iTempDir;
	if(iTempDir == this.rangeDirection){
		 //Either add or remove rows based on the endRow
		var iEndDelta = this.tempEndRow.sourceIndex - this.endRow.sourceIndex;
		if(iEndDelta > 0 ){
			if(this.rangeDirection == DOWN)
				//remove rows
				this.trimRange(UP);
			else
				//add rows
				this.expandRange(this.tempEndRow);
		}
		if(iEndDelta < 0){
			if(this.rangeDirection == UP)
				//remove rows
				this.trimRange(DOWN);
			else
				//add rows
				this.expandRange(this.tempEndRow);
		}
	}
	else{
		//Unselect all rows except the start row
		this.rangeDirection = iTempDir;
		var objSelector = this.startRow;
		objSelector.setAttribute("className","rowSelectedException");
		mf_unselectAll(objSelector);
		objSelector.setAttribute("className","rowselected");
		//add rows in range
		this.expandRange(this.startRow);
	}
}
function mf_trimRowRange(iDirection){
	//remove rows
	mf_unselectRecord(this.tempEndRow);
	var objTempRow = mf_getNextRow(this.tempEndRow, iDirection);	
	if(objTempRow){
		for(;objTempRow.uniqueID != this.endRow.uniqueID && mf_unselectRecord(objTempRow);){
			objTempRow = mf_getNextRow(objTempRow,  iDirection);
		}
		this.tempEndRow = this.endRow;
	}
}
function mf_expandRange(objStartRow){
	var objTempRow = mf_getNextRow(objStartRow, this.rangeDirection);
	mf_selectRecord(this.endRow);	
	if (mf_selectRecord(objTempRow)){
		for(;objTempRow.uniqueID != this.endRow.uniqueID && mf_selectRecord(objTempRow) ;){
			objTempRow = mf_getNextRow(objTempRow,  this.rangeDirection);
		}
		this.tempEndRow = this.endRow;
	}
}
function mf_scrollIntoView(objRow){
	if ((objRow.offsetTop + objRow.offsetHeight - this.scrollTop) > this.clientHeight){
		objRow.scrollIntoView(false);
	}
	else if(objRow.offsetTop < this.scrollTop){
		objRow.scrollIntoView(true);
	}
}
function event_GalTable_ondblclick(e){
    var evt=(window.event)?window.event: e;
    el = (evt.srcElement)?evt.srcElement:evt.target;
    
	if (el.parentNode.parentNode.tagName != "THEAD" && el.parentNode.parentNode.tagName != "TABLE" ){
		if (g_eCurrentRow != null){
			g_eCurrentRow.setAttribute("className","rowunselected");
			g_eCurrentRow.style.backgroundColor = "#ffffff";//"transparent";
			g_eCurrentRow.style.color = "#333333";//"windowtext";
		}
		eTR = el.parentNode;
		while(eTR.tagName != "TR"){
			eTR = eTR.parentNode;
		}
		eTR.setAttribute("className","rowselected");
		g_eCurrentRow = eTR;
		g_eCurrentRow.style.backgroundColor ="#F4F9FD";// "HIGHLIGHT";
		g_eCurrentRow.style.color = "#333333";//"HIGHLIGHTTEXT";
		processSelectedRow();
	}
}
function processSelectedRow(){	
	if (getRowAttribute(g_eCurrentRow,"fmid") != ''){
		var strURL ="../Forms/Form.aspx?mode=COMPLETE" + "&piid=" + getRowAttribute(g_eCurrentRow,"piid")  + "&bstate=" + getRowAttribute(g_eCurrentRow,"bstate")
					+ "&fmid=" + getRowAttribute(g_eCurrentRow,"fmid") + "&fmnm=" + toUTF8(getRowAttribute(g_eCurrentRow,"fmnm"))
					+ "&fmpf=" + getRowAttribute(g_eCurrentRow,"fmpf") + "&fmrv=" + getRowAttribute(g_eCurrentRow,"fmrv") + "&fiid=" + getRowAttribute(g_eCurrentRow,"fiid")
					+ "&ftid=" + getRowAttribute(g_eCurrentRow,"ftid") + "&fitn=" + getRowAttribute(g_eCurrentRow,"fitn") + "&scid=" + getRowAttribute(g_eCurrentRow,"scid")
					+ "&pfsk=" + getRowAttribute(g_eCurrentRow,"pfsk")+ "&pidc=" +  "&pibd1=" + "&secdoc=" + getRowAttribute(g_eCurrentRow,"secdoc")+ "&edms_document=" + getRowAttribute(g_eCurrentRow,"edms_document");//toUTF8(getRowAttribute(g_eCurrentRow,"pidc")) +
		openWindow(strURL,"",800,600,'fix');//toUTF8(getRowAttribute(g_eCurrentRow,"pibd1"))
	}
}
function getRowAttribute(elm,sName){var v=elm.getAttribute(sName);return (v==null?"":v);}
function addAddress(rgData,szWI,szPI){
	var eTD;
	var eTR = g_eGalTable.insertRow();
	eTR.setAttribute("className","rowunselected");
	eTR.setAttribute("workitemid",szWI);
	eTR.setAttribute("processid",szPI);
	eTR.attachEvent("onkeydown",event_row_onkeydown);
	eTR.attachEvent("onkeyup",event_row_onkeyup);
	eTR.attachEvent("onselectstart",event_row_onselectstart);

	for (var x=0;x<rgData.length;x++){
		if (x!=1){
			eTD = eTR.insertCell();
			eTD.valign = "top";
			eTD.noWrap=true;
			eTD.style.overflow = "hidden";
			eTD.style.paddingRight = "1px";
			eTD.innerHTML = rgData[x];
		}
		else{
			eTD = eTR.insertCell();
			eTD.valign = "top";
			eTD.noWrap=true;
			eTD.style.paddingRight = "1px";
			eTD.innerHTML = rgData[x];
		}
	}
}
function addMessage(szMsg){
	var re = /항목을 찾을 수 없습니다./i;
   
	if(szMsg.search(re)!=-1) szMsg = "Could not find the matching item.";
	g_eErrorDiv.innerText = szMsg;
	g_eErrorDiv.style.display = "block";
	document.getElementById("divGalTable").style.display = "none";
}
function event_row_onkeydown(){
	if (event.keyCode == 16){ 
		//shift key	
	}
	else if(event.keyCode == 17){ 
		//ctrl key		
	}
	else if(event.keyCode == 40){ 
		//down		
		objRow = m_objRowLastSelected;
		m_objRowRange = null;
		var objNextRow = mf_getNextRow(objRow,  DOWN);
		if (objNextRow != false){
			mf_unselectAll(objNextRow);
			mf_selectRecord(objNextRow);
			mf_scrollIntoView(objNextRow);
			m_objRowLastSelected = objNextRow;
		}	
	}
	else if (event.keyCode == 38){
		//up
		objRow = m_objRowLastSelected;
		m_objRowRange = null;
		var objNextRow = mf_getNextRow(objRow,  UP);
		if (objNextRow != false){
			mf_unselectAll(objNextRow);
			mf_selectRecord(objNextRow);
			mf_scrollIntoView(objNextRow);
			m_objRowLastSelected = objNextRow;
		}		
	}
	else if (event.keyCode == 13){ 
		//enter
		eTR = m_objRowLastSelected;
		m_objRowRange = null;		
		while(eTR.tagName != "TR"){
			eTR = eTR.parentElement;
		}
		eTR.setAttribute("className","rowselected");
		g_eCurrentRow = eTR;
		g_eCurrentRow.style.backgroundColor = "highlight";
		g_eCurrentRow.style.color = "highlighttext";		
		processSelectedRow();
	}
	else if(event.keyCode==46){
		//delete
		delete_onClick();
	}
}
function event_row_onkeyup(){
	if (event.keyCode == 16){ 
		//shift key
		//search.focus();
	}
	else if(event.keyCode == 17){ 
		//ctrl key
		//search.focus();
	}
}
function event_row_onselectstart(){
	event.cancelBubble = true;
	event.returnValue = false;
}
function cmdSearch_onClick(){
    page=1;gOrder='';
	strSearch = window.search.value;
	if (strSearch==""){
	    alert("검색어를 입력하십시오");

	}
	else{
		clearContents();
		(gLocation == "TEMPSAVE")?TempQueryGetData():queryGetData();
	}
}

function go_page(pagegb){

    if(g_totalpage < 2)
    {
        //return;
    }

	var currPage = 1;
	switch (pagegb)	{
	case "f"  :	currPage=1;break;
	case "p" :	currPage=(parseInt(page)-1);break;
	case "n" :	currPage=(parseInt(page)+1);break;
	case "l"  :	currPage=g_totalpage;break;
	default:		currPage=pagegb;break;
	}

	if (parseInt(currPage) < 1) currPage = 1;
	if (parseInt(currPage) > parseInt(g_totalpage)) currPage = g_totalpage;
	page = currPage;

	queryGetData()

	/*var m_oXSLProcessor, strXSLFile;
	strXSLFile = "wf_doclistquery01.xsl"; 

	m_oXSLProcessor = makeProcessor(strXSLFile);
	m_oXSLProcessor.input = m_xmlHTTP.responseXML;
	m_oXSLProcessor.addParameter("sortby", "SERIAL_NUMBER");
	if ( page == "") { page = 1;}

	m_oXSLProcessor.addParameter("iPage", page);
	m_oXSLProcessor.addParameter("iPageSize", pagecnt);
	m_oXSLProcessor.transform();
	m_objXML.loadXML(m_oXSLProcessor.output);

	processXml();
	*/

	/*
	var url="listitems.aspx?uid=" + uid + "&location=" + gLocation + "&kind=" + kind + "&title=" + gTitle + "&page=" + page+"&label="+gLabel;
	window.open(url,"_self");
	*/
}

function openpopup(){
	var	pi_id = getRowAttribute(g_eCurrentRow,"piid");
	//alert(pi_id);
	var szURL = "ReceiptList.aspx?PIID=" + pi_id;
	//alert(szURL );
	CoviWindow(szURL, "newMessageWindow", 550, 300, "resize") ;
}

function CoviWindow(fileName,windowName,theWidth,theHeight,etcParam) {	
	var x = theWidth;
	var y = theHeight;

	var sx = window.screen.width  / 2 - x / 2;
	var sy = window.screen.height / 2 - y / 2 - 40;
	if (etcParam == 'fix') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0";
	}
	else if (etcParam == 'resize') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1";
	}
	else if (etcParam == 'scroll') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1";
	}
	if (sy < 0 ) {
		sy = 0;
	}
	var sz = ",top=" + sy + ",left=" + sx;
	if (windowName == "newMessageWindow" || windowName == "") {
		windowName = new String(Math.round(Math.random() * 100000));
	}
	var strNewFearture = ModifyWindowFeature(etcParam + ",width=" + x + ",height=" + y + sz);
    window.open(fileName,windowName,strNewFearture);
    //window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
	//objNewWin =  window.showModalDialog(fileName, windowName,"dialogHeight:400px;dialogWidth:350px;status:no;resizable:yes;help:no;")   
}
/*
function go_page(page){
	var szURL = "DocListItems.aspx?doclisttype=" + sDocListType + "&page=" + page + "&strMONTH=" + sMonth;
	window.open(szURL,"_self");
}
*/

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

function alertParseError(err){
	alert("오류가 발생했습니다. in listitems.js\ndesc:"+err.reason+"\nsrcurl:"+err.url+"\nsrctxt:"+err.srcText+"\nline:"+err.line+"\tcolumn:"+err.linepos);
}

/*

个*/