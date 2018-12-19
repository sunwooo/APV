// JScript 파일
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
var g_totalpage = "";
var g_totalcount = "";
var g_pagecount = "1";
var g_querysize = "";
var g_orderfield = "";
var g_orderdesc = "";
var temp_querysize = "";
var gGubun="";

function window.onload(){
    
	g_eErrorDiv = window.document.all['divErrorMessage'];	
//	if( gLocation == "DEPART" && uid.substring(uid.length-1) == 'A') setYearMonth();
	clearContents();
	queryGetData();
}
function queryGetData(){
    
	if (temp_querysize=="0" || temp_querysize=="" )
		g_querysize=pagecnt;
	else
		g_querysize=temp_querysize;
		
	if ( page == "") { page = 1;}
	var spi_name = "";
	var sGubun = "";
	var spi_initiator = "";
	var spi_etc = "";
    if(gSearch != ""){
		//page = 1;
		switch (gGubun){
		    case "PI_NAME" : spi_name = gSearch;   break;
	        case "PI_INITIATOR_NAME":  spi_initiator = gSearch; break;
		}
     }
    if(kind == "name"){spi_initiator =gTitle;}
    if(kind == "doc"){spi_etc = gTitle;}
	var szURL = null;
	//var szURL = "Worklist.aspx?uid=" + uid + "&location=" + gLocation + "&page=" + page + "&kind=" + kind + "&title=" + gTitle + "&search=" + gSearch;

    /*parameter setting start by sunnyhwang */
	var aryOrder = new String();
	aryOrder = gOrder.split(";");	
	
	if (aryOrder.length>1){
		g_orderfield = aryOrder[1];
		g_orderdesc = aryOrder[0];
	}	

    var PF_PERFORMER_ID="";
    var USER_ID="";
    var PF_SUB_KIND="";
	var PI_FINISHED="";
	var PI_NAME= spi_name;//toUTF8(spi_name);
	var PAGENUM= page;
	var PAGECNT= pagecnt;
	var QUERYSIZE= g_querysize;	
	var GROUP_KIND= kind;
	var TITLE= gTitle;//toUTF8(gTitle);
	var ORDERFILED=g_orderfield;			
	var ORDERDESC=g_orderdesc;	
	var PI_INITIATOR_NAME=spi_initiator;
	var PI_ETC= spi_etc;
	var WI_STATE=528;
	var PI_STATE=528;
	var PF_STATE = "1";
	var MODE="";
	var connectionname = "INST_ConnectionString";
	
	if (parent.fldrName != '') PI_FINISHED = parent.fldrName;
    var pXML =null ;

	if( gLocation == "DEPART"){
		var strBox = uid.substring(uid.lastIndexOf("_")+1);
		var strDeptID = uid.substring(0,uid.lastIndexOf("_"));
		PF_SUB_KIND = uid.substring(uid.lastIndexOf("_")+1);
		PF_PERFORMER_ID = strDeptID;
		switch (strBox){
			case "A": //품의함
                pXML = "exec dbo.usp_wf_worklistdeptquery01A ";break;
			case "R"://수신함
				pXML = "exec dbo.usp_wf_worklistdeptquery01R ";break;
			case "RC"://부서접수완료함-수신함
				pXML = "exec dbo.usp_wf_worklistdeptquery01RC ";break;
			case "C": //부서함
			    PF_SUB_KIND='C';pXML = "exec dbo.usp_wf_worklistdeptquery01C ";break;
			case "S": //발신함
			    PF_SUB_KIND='S';pXML = "exec dbo.usp_wf_worklistdeptquery01S ";break;			
			case "E"://접수함
			    PF_SUB_KIND='E';pXML = "exec dbo.usp_wf_worklistdeptquery01E ";break;			
			case "I"://참조함
			    PF_SUB_KIND='I';pXML = "exec dbo.usp_wf_worklistdeptquery01I "; break;			
		}
		pXML += "'" + PF_PERFORMER_ID + "','" + WI_STATE + "','" + PI_STATE+ "','" + MODE+ "','" + PI_NAME+"','" + PI_INITIATOR_NAME +  "','" + PF_SUB_KIND + "','" + PI_FINISHED + "','" + PAGENUM+ "','" + PAGECNT+ "','" + QUERYSIZE+ "','" + GROUP_KIND+ "','" + TITLE+ "','" + ORDERFILED+ "','" + ORDERDESC + "'";
	}else{
		var sLocation;
		switch (gLocation){
			case "PREAPPROVAL":	if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01preapproval ";
			case "APPROVAL":	if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01approval ";
			case "CONSULT":		if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01consult ";
			case "PROCESS":		if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01process ";
			case "CANCEL":		if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01cancel ";
			case "REJECT":		if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01reject ";
			case "CCINFO":		if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01ccinfo ";
			case "COMPLETE":	if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01complete ";
//			case "COMPLETE":	if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01complete_new ";
				if(sLocation==null) sLocation = gLocation;
			case "JOBFUNCTION":			
				var strBox = uid.substring(uid.lastIndexOf("_")+1);
				var strDeptID = uid.substring(0,uid.lastIndexOf("_"));
        		PF_PERFORMER_ID = strDeptID;
								
				switch (strBox){
					case "SP": //특정부서함
						pXML = "exec dbo.usp_wf_worklistdeptquery01SP ";break;
					default :
					    PF_SUB_KIND='T008';
						if(pXML==null) pXML = "exec dbo.usp_wf_worklistquery01general ";
						if(gLocation == "JOBFUNCTION") {
						    PF_PERFORMER_ID = strDeptID; //toUTF8(strDeptID);
							gLocationMode = strBox;
						}else{
						    PF_PERFORMER_ID = uid;
						}
						if(sLocation==null){
							sLocation = gLocationMode;
							switch(sLocation){
								case "APPROVAL":WI_STATE='288';PI_STATE='288';break;
								case "PROCESS":WI_STATE='528';PI_STATE='288';break;
								case "COMPLETE":WI_STATE='528';PI_STATE='528';break;
								case "REJECT":WI_STATE='528';PI_STATE='528';break;
							}
						}
						MODE=sLocation;
						break;						
				}
				if (gLocation == "JOBFUNCTION" ){
                	pXML += "'" + PF_PERFORMER_ID + "','"+ PF_SUB_KIND + "','" + PF_STATE + "','" + WI_STATE + "','" + PI_STATE + "','" + MODE + "','" + PI_NAME + "','" + PI_INITIATOR_NAME + "','" + PI_ETC + "','" + PAGENUM + "','" + PAGECNT + "','" + QUERYSIZE + "','" + GROUP_KIND + "','" + TITLE + "','" + ORDERFILED + "','" + ORDERDESC +"'";
				}else{
                	pXML += "'" + PF_PERFORMER_ID + "','" + WI_STATE + "','" + PI_STATE + "','" + MODE + "','" + PI_NAME + "','" + PI_INITIATOR_NAME + "','" + PI_ETC + "','" + PAGENUM + "','" + PAGECNT + "','" + QUERYSIZE + "','" + GROUP_KIND + "','" + TITLE + "','" + ORDERFILED + "','" + ORDERDESC +"'";
				}
				break;
			case "TEMPSAVE":
				if(pXML==null)pXML = "exec dbo.usp_wfform_tempsavequery01 ";
				connectionname = "FORM_DEF_ConnectionString";
			    PF_PERFORMER_ID = uid;

            	pXML += "'" + PF_PERFORMER_ID + "','" + PI_NAME + "','" + PAGENUM + "','" + PAGECNT + "','" + QUERYSIZE + "','" + GROUP_KIND + "','" + TITLE + "','" + ORDERFILED + "','" + ORDERDESC +"'";
                //exec sp_wfform_tempsavequery01 @USER_ID, @SUBJECT, @PAGENUM, @PAGECNT, @QUERYSIZE, @GROUP_KIND, @TITLE, @ORDERFILED, @ORDERDESC
				break;
		}
    }
    var sXML = "<Items><connectionname>"+connectionname+"</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
    var szURL = "../getXMLQuery.aspx";
	doProgressIndicator(true);
    requestHTTP("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTP, sXML);
	
}

function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	m_xmlHTTP.open(sMethod,sUrl,bAsync);
	m_xmlHTTP.setRequestHeader("Content-type", sCType);
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
				
				switch(gLocation){
					case "DEPART":
						var strBox = uid.substring(uid.length-1);
						switch (strBox){
							case "R":
								strXSLFile = "../wf_worklistquerydeptr.xsl"; //부서수신함 
								break;
							default:
								strXSLFile = "../wf_worklistquery01.xsl";
						}
						break;
					case "TEMPSAVE":
						strXSLFile = "../TempSave/wfform_tempsavequery01.xsl";
						break;
					default:
						strXSLFile = "../wf_worklistquery01.xsl"; //개인함
				}
				
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
	
	processXmlData(m_objXML);
	doProgressIndicator(false); 

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
	var m_oXSLProcessor;
	var xslURL;
	switch(gLocation){
		case "TEMPSAVE":xslURL="TempSave/listitems_TempXSL.aspx"; break;
		default:xslURL="portallistitemsXSL.aspx";
	}
	m_oXSLProcessor = makeProcessor(xslURL);
	m_oXSLProcessor.input = m_objXML;
	m_oXSLProcessor.addParameter("sTitle", gLabel);
	m_oXSLProcessor.transform();
	divGalTable.innerHTML = m_oXSLProcessor.output;
	g_eGalTable = window.document.all['tblGalInfo'];
	//g_eGalTable.attachEvent("onmousedown",event_GalTable_onmousedown);
	g_eGalTable.attachEvent("onclick", event_GalTable_ondblclick);
	if (gOrder != '')
	{
		var aOrder=gOrder.split(";");

		eval('span'+aOrder[1]).innerHTML = '<img src="/CoviWeb/common/images/icon/icon_'+aOrder[0]+'.gif" align="absmiddle">';
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
			g_eGalTable.rows[x].style.backgroundColor = "#ffffff";//"transparent";
			g_eGalTable.rows[x].style.color = "#333333";//"windowtext";
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
			objRecord.style.color = "#333333";//"highlighttext";
		}
	}
	else{
		retval = false;
	}
	return(retval);
}

function showDetail(ProcInstID,SchemaID){
    if (ProcInstID != ""){
	    parent.m_ProcInstID =  ProcInstID;
	    //2006.04.03사원 이후창 주석 처리
	    //추후 풀어 줄것 테스트 하기 위해 주석으로 만들었음
	    requestHTTP("GET","./ApvlineMgr/getApvSteps.aspx?piid="+ProcInstID+"&scid="+SchemaID,true,"text/xml",receiveHTTPMonitor);
	}
	return;
}
function receiveHTTPMonitor(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			alert(m_xmlHTTP.responseText);
		}else{
			menu.APVLIST.value = m_xmlHTTP.responseText.replace(/<\?xml version=\"1.0\" encoding=\"utf-8\"\?>/,"").replace(/<\?xml version=\"1.0\" encoding=\"euc-kr\"\?>/,"");
			try {
				parent.iApvLine.location = "./ApvlineMgr/ApvlineViewer.aspx";
				parent.iApvGraphic.drawGraphic(menu.APVLIST.value);
			} catch(e) {
				parent.parent.iApvLine.location = "./ApvlineMgr/ApvlineViewer.aspx";
				parent.parent.iApvGraphic.drawGraphic(menu.APVLIST.value);
			}
		}
	}
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
		var strURL ="../Forms/Form.aspx?mode=" + getRowAttribute(g_eCurrentRow,"mode")
					+ "&piid=" + getRowAttribute(g_eCurrentRow,"piid") + "&pfid=" + getRowAttribute(g_eCurrentRow,"pfid")
					+ "&ptid=" + toUTF8(getRowAttribute(g_eCurrentRow,"participantid")) + "&pist=" + getRowAttribute(g_eCurrentRow,"piviewstate")
					+ "&wiid=" + getRowAttribute(g_eCurrentRow,"workitemid") + "&bstate=" + getRowAttribute(g_eCurrentRow,"bstate")
					+ "&fmid=" + getRowAttribute(g_eCurrentRow,"fmid") + "&fmnm=" + toUTF8(getRowAttribute(g_eCurrentRow,"fmnm"))
					+ "&fmpf=" + getRowAttribute(g_eCurrentRow,"fmpf") + "&fmrv=" + getRowAttribute(g_eCurrentRow,"fmrv") + "&fiid=" + getRowAttribute(g_eCurrentRow,"fiid")
					+ "&ftid=" + getRowAttribute(g_eCurrentRow,"ftid") + "&fitn=" + getRowAttribute(g_eCurrentRow,"fitn") + "&scid=" + getRowAttribute(g_eCurrentRow,"scid")
					+ "&pfsk=" + getRowAttribute(g_eCurrentRow,"pfsk") + "&pidc=" + toUTF8(getRowAttribute(g_eCurrentRow,"pidc")) + "&pibd1=" + toUTF8(getRowAttribute(g_eCurrentRow,"pibd1"))
					+ "&secdoc=" + getRowAttribute(g_eCurrentRow,"secdoc")+ "&edms_document=" + getRowAttribute(g_eCurrentRow,"edms_document")+"&pipr="+getRowAttribute(g_eCurrentRow,"pipr");				
					
					
		//alert("strURL:"+ strURL);
		var width = 800 ;
		var height = window.screen.height - 65;
//		if (getRowAttribute(g_eCurrentRow,"fmpf") == "BUDGET_CHANGE_REQUEST") height = 700 ;
		openWindow(strURL,"",width ,height ,'fix');
	}
}
function getRowAttribute(elm,sName){var v=elm.getAttribute(sName);return (v==null?"":v);}
function addMessage(szMsg){
	var re = /항목을 찾을 수 없습니다./i;
   
	if(szMsg.search(re)!=-1) szMsg = "Could not find the matching item.";
	g_eErrorDiv.innerText = szMsg;
	g_eErrorDiv.style.display = "block";
	divGalTable.style.display = "none";
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
		g_eCurrentRow.style.backgroundColor = "#e2e8ce";//"highlight";
		g_eCurrentRow.style.color = "#333333";//"highlighttext";		
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
function cmdSearch_onClick(strGubun,  strSearch){
	gGubun = strGubun;
	gSearch = strSearch;
	if (gSearch==""){
		alert("검색어를 입력하십시오");
	}
	else{
		clearContents();
		queryGetData();
        page=1;gOrder='';
	}
}
function delete_onClick(){
	if((gLocation=="APPROVAL") || (gLocation=="PROCESS") || (uid.lastIndexOf("_R")>0) || (uid.lastIndexOf("_A")>0) || (uid.lastIndexOf("_S")>0) || (uid.lastIndexOf("_P")>0)){
		alert("항목을 지우실 수 없습니다.");
		return false;
	}
	var strflag = false;
	var sItems="<request>";
	var sUrl;
	if (gLocation == "TEMPSAVE"){
		for (var x=g_eGalTable.rows.length-1; x >= 1; x--){
			var item = g_eGalTable.rows[x];
			if(item.className == "rowselected"){
				sItems+="<item id=\""+item.id+"\" fitn=\""+item.fitn+"\" fiid=\""+item.fiid+"\" fmpf=\""+item.fmpf+"\"/>";
				strflag = true;
			}
		}
		sUrl = "../InstMgr/switchFT2Del.aspx";
	}else if(gLocation == "CCINFO") {
		sItems+="<mode>cancel</mode>"; //할당취소
		for (var x=g_eGalTable.rows.length-1; x >= 1; x--){
			var item = g_eGalTable.rows[x];
			if(item.className == "rowselected"){
				sItems+="<item wiid=\""+item.workitemid+"\" ptid=\"" +item.ptid +"\" pfid=\""+ item.pfid +"\" />";
				strflag = true;
			}
		}
		sUrl = "../InstMgr/switchWI2Del.aspx";
	
	}else{
		sItems+="<mode>delete</mode>"; //worktiem 삭제 처리
		for (var x=g_eGalTable.rows.length-1; x >= 1; x--){
			var item = g_eGalTable.rows[x];
			if(item.className == "rowselected"){
				sItems+="<item wiid=\""+item.workitemid+"\"/>";
				strflag = true;
			}
		}
		sUrl = "../InstMgr/switchWI2Del.aspx";
	}
	sItems+="</request>";

	if(strflag == false){
		alert("선택된 항목이 없습니다.");
		return;
	}	
	truthBeTold = window.confirm("해당 항목들을 삭제하시겠습니까?");
	if (truthBeTold != true){return;}
	//alert(sItems);
	requestHTTP("POST",sUrl,true,"text/xml",receiveGeneralQuery,sItems);
}
function go_page(pagegb){

    if(g_totalpage < 1)
    {
        //return;
    }
    
	var currPage = 1;
	switch (pagegb)	{
	case "f"  :	currPage=1;break;
	case "p" :	currPage=(page-1);break;
	case "n" :	currPage=(page+1);break;
	case "l"  :	currPage=g_totalpage;break;
	default:
	    if (pagegb == ""){return;}
		if (isNaN(pagegb)){return;}else{currPage=pagegb;};
	    break;
	}
	if (parseInt(currPage) < 1) currPage = 1;
	if (parseInt(currPage) > g_totalpage) currPage = g_totalpage;
	page = currPage;

	if (eval(page)==eval(g_pagecount)){
		if (eval(g_querysize) < pagecnt){
			g_querysize=g_totalcount-(g_pagecount-1)*pagecnt;
		}else{
			g_querysize=g_totalcount-(g_pagecount-1)*g_querysize;
		}
	}else{
		g_querysize=pagecnt;
	}
	
	temp_querysize = g_querysize;
	queryGetData();
}
function groupby(){	
	var szSrc;
	if (skind.value=="total"){
		szSrc = "listitems.aspx?uid=" + uid + "&location=" + gLocation + "&label=" + strlabel;
	}
	else if (skind.value=="name"){
		szSrc = "listgroup.aspx?uid=" + uid + "&location=" + gLocation + "&kind=name";
	}
	else{
		szSrc = "listgroup.aspx?uid=" + uid + "&location=" + gLocation + "&kind=doc";
	}
	parent.worklist.innerHTML="<IFRAME id=iworklist frameborder=0 width=100% height=100% SRC='" + szSrc + "'></IFRAME>";
}
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
