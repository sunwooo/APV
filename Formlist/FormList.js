//alert(1);
var fngCoviFlowOnload = null;//이준희(2010-10-05): Added a variable to store the original window_onload().
var m_xmlHTTP = CreateXmlHttpRequest();
var m_objXML = CreateXmlDocument();
var m_objXML2 = CreateXmlDocument();
var bState = "";
/* 웹표준화로 수정
var m_xmlHTTP=new ActiveXObject("MSXML2.XMLHTTP");*/
var g_szAcceptLang="ko";
var L_idsSearcing_Text="Loading...";
var L_idsUnknownError_Text="Unknown Error";
var oFormXML = null;
var selMainTab = "";
var varType = "";

//XSL 파일 XML Load 방식 변경 hichang
var m_xmlXSL = "";

{//이준희(2010-10-05): Improved the initialization by checking and preserving the original window_onload()
	var dteFrmLstPrv = null;//window.onload = initOnloadFormList;
	if(window.onload == null)
	{//alert(18);
		window.onload = initOnloadFormList;
	}
	else
	{//alert(22);
		fngCoviFlowOnload = window.onload;
		window.onload = function()
		{
			initOnloadFormList();
			fngCoviFlowOnload();
		}
	}
}

function initOnloadFormList() {
  
	{//이준희(2010-10-05): Added to avoid inter-frame interference in SharePoint environment.
	try
	{
		if(document.getElementById('hddCEPSFlowUrlC').value.indexOf('FORMLIST.ASPX') == -1)
		{
			return;
		}
	}
	catch(e)
	{
	}
	}
    
    /*
    //웹표준화로수정
    if (!window.ActiveXObject) {
      getXSL();
    }
	else
	{//alert(38);
	    queryGetDataFormList();
	}
	//웹표준화로수정
	*/
	
	getXSL();
	queryGetDataFormList();
	
	if(selMainTab == "") {selMainTab = "tab1";}	
    if(rel_activityid != ""){
		document.getElementById("spanactivityname").innerHTML =rel_activityname; 
		document.getElementById("spanactivitydesc").style.display ="";
		document.getElementById("spanactivityname").style.display ="";
    }
}

function getXSL()
{
	var iDif = 0;
	var dteNow = new Date();//이준희(2011-03-09): SharePoint 지원을 위해 부분 수정함.
	if(dteFrmLstPrv == null)
	{
		dteFrmLstPrv = new Date();
	}
	else
	{
		iDif = dteNow - dteFrmLstPrv;
		if(iDif < 2048)
		{
			return;
		}
	}//;alert(iDif);
	bState = 'XSL';//debugger;
	var szURL = '/CoviWeb/Approval/FormList/FormListALLXSL.aspx';//alert(szURL);
	fnRequestHTTPFrmLst("GET", szURL, false, "text/xml", null, null);//debugger;
	receiveHTTPXSL();
}

function getXSL2()
{
	bState = "XSL2";
	var szURL = "/CoviWeb/Approval/FormList/FormListXSL.aspx";
	fnRequestHTTPFrmLst("GET", szURL, false, "text/xml", null, null);
	receiveHTTPXSL();
}

function receiveHTTPXSL()
{
	if (m_xmlHTTP.status == 200)
	{
	    m_xmlXSL = m_xmlHTTP.responseText;
	}
} 

function queryGetDataFormList() {
    //debugger;
	/*2020-01-14 PSW 내부회계관리양식으로 인해 일시적 오픈 처리 (윤태진 차장님)*/
    if (gAdminSysTotal == "Y" || user_code == "ISU_ST10003" || user_code == "ISU_ST17005" )  //전체시스템관리자  HIW
	//if (gAdminSysTotal == "Y")  //전체시스템관리자  HIW	
		viewall = "T";
    else
        viewall = "F";

    //20161102 다국어처리    
	var	connectionname = "FORM_DEF_ConnectionString";
    var searchWord = document.getElementById("Ctl00_Usercontentsholder_Ctl00_Txtsearchword").value;
    var pXML = "[dbo].[usp_wfform_formlistquery01]";//alert(user_etid);
    //var aXML = "<param><name>ent_code</name><type>varchar</type><length>32</length><value>" + getWorkplaceCD() + "</value></param>";
    var aXML = "<param><name>ent_code</name><type>varchar</type><length>32</length><value>" + user_etid + "</value></param>";
    aXML += "<param><name>viewall</name><type>varchar</type><length>1</length><value>" + viewall + "</value></param>";
    aXML += "<param><name>form_name</name><type>varchar</type><length>50</length><value>%" + searchWord + "%</value></param>";
    aXML += "<param><name>language</name><type>nvarchar</type><length>50</length><value>" + language + "</value></param>";
    var sXML = "<Items><connectionname>"+connectionname+"</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
    var szURL = "/CoviWeb/Approval/getXMLQuery.aspx";//debugger;
    fnRequestHTTPFrmLst("POST", szURL, false, "text/xml; charset=utf-8", null, sXML);
    fnReceiveHTTPFrmLst();
}

//사업장 찾기
function getWorkplaceCD() {
    var _return = "";
    var arrDeptPathId = user_dppathid.split("\\");

    if (arrDeptPathId[2] != null) {
        _return = arrDeptPathId[2].replace("U_", "");
    }

    return _return;
}

function fnRequestHTTPFrmLst(sMethod, sUrl, bAsync, sCType, pCallback, vBody)
{//alert(0);//이준희(2011-03-09): SharePoint 지원을 위해 부분 수정함.
	m_xmlHTTP.open(sMethod, sUrl, bAsync);//m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
	m_xmlHTTP.setRequestHeader("Content-type", sCType);
	if(pCallback != null)
	{
		m_xmlHTTP.onreadystatechange = pCallback;
	}//;debugger;
	if(vBody == null)
	{
		m_xmlHTTP.send();
	}
	else
	{//alert(sUrl);
		m_xmlHTTP.send(vBody);
	}//;alert(sUrl);
}

function fnReceiveHTTPFrmLst()
{//이준희(2011-03-09): SharePoint 지원을 위해 부분 수정함.
	if(m_xmlHTTP.readyState != 4)
	{
		return;
	}
	m_xmlHTTP.onreadystatechange = event_noop;
	if(m_xmlHTTP.responseText.charAt(0) == '\r')
	{
		alert(m_xmlHTTP.responseText);
		return;
	}
	refreshList(m_xmlHTTP.responseXML);
}

function receiveHTTP_back()
{
	if(m_xmlHTTP.readyState==4)
	{
		m_xmlHTTP.onreadystatechange=event_noop;
		var xmlReturn=m_xmlHTTP.responseXML;
		//prompt ("", xmlReturn.xml);
		//if(xmlReturn.xml==""){
		if(m_xmlHTTP.responseText.charAt(0)=='\r')
		{
			alert(m_xmlHTTP.responseText);
		}
		else
		{
		    //웹 표준화로 수정
	        if (bState == "XSL" || bState == "XSL2")
	        {
                var parser = new DOMParser();
                switch(bState){
                    case "XSL" : 
                        m_objXML = parser.parseFromString(m_xmlHTTP.responseText, "text/xml");
                        queryGetDataFormList();
                        //웹 표준화로 수정
                        bState = "";
                        break;
                    case "XSL2" : 
                        m_objXML2 = parser.parseFromString(m_xmlHTTP.responseText, "text/xml");
                        bState = "";
                        break;
                }
            } 
            else
            {
                var errorNode = xmlReturn.selectSingleNode("response/error");
                if (errorNode != null) {
                    alert("Desc: " + errorNode.text);
                }
                else 
                {
                    oFormXML = xmlReturn;
                    if (window.ActiveXObject) {
                        var m_oXSLProcessor, strXSLFile;
                        //strXSLFile = "FormListXSL.aspx"; //FormListXSL
                        strXSLFile = "FormListALLXSL.aspx"; //FormListXSL
                        m_oXSLProcessor = makeProcessor(strXSLFile);
                        m_oXSLProcessor.input = xmlReturn;
                        m_oXSLProcessor.transform();
                        FormList.innerHTML = m_oXSLProcessor.output;
                    }else{
                        document.getElementById("FormList").innerHTML = xmlReturn.transformNode(m_objXML);
                        getXSL2();
                    }
                }
		    }
		}
	}
}

function event_noop(){return(false);}

function refreshList(oDOM)
{
	try
	{
		var sXML = "<Items><xml><![CDATA[" + oDOM.xml.replace(/<!\[CDATA\[/gi, "@CDATASTART").replace(/\]\]>/gi, "@CDATAEND") + "]]></xml><xslxml><![CDATA[" + m_xmlXSL + "]]></xslxml></Items>";
		var szURL = '/CoviWeb/Approval/GetXMLXslParsing.aspx';//alert(0);
		fnRequestHTTPFrmLst("POST", szURL, false, "text/xml; charset=utf-8", null, sXML);//alert(1);
		receiveHTTPXSLXML();//alert(2);
	}
	catch(e)
	{
		alert(sgMsg_Err_Apv + " at refreshList in FormList.aspx\nError Desc:" + e.description);//이준희(2011-03-09): FormList.js에서 서버 태그를 직접 사용하는 오류를 발견해 이를 수정함.
	}
}

function receiveHTTPXSLXML()
{
	if(m_xmlHTTP.readyState != 4)
	{
		return;
	}
	//m_xmlHTTP.onreadystatechange = event_noop;
	if(m_xmlHTTP.responseText.charAt(0) == '\r')
	{
		alert(m_xmlHTTP.responseText);
		return;
	}//;alert(0);//;alert(m_xmlHTTP.responseXML.documentElement.xml);
	try
	{
		document.getElementById("FormList").innerHTML = m_xmlHTTP.responseXML.documentElement.xml;
		//window.setTimeout('document.getElementById("FormList").innerHTML = m_xmlHTTP.responseXML.documentElement.xml;', 1);
		m_xmlHTTP.onreadystatechange = event_noop;
	}
	catch(e)
	{//debugger;
		;
	}
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
        var oProcessor = new XSLTProcessor();
        oProcessor.importStylesheet(urlXsl);
        return oProcessor;
    }
}

//탭 이동

var selLocation = "tab_1" ;
var selIdx = 1;

function changeBox(selTab, idx){
	if (selTab.getAttribute("name") != selLocation) {	   
		document.getElementById("div"+selMainTab.replace("_","")).className = "" ;
        document.getElementById("div"+selTab.id.replace("_","")).className = "current" ;
        selMainTab = selTab.getAttribute("name") ;		
		document.getElementById("tb_" + idx).style.display = "";
		document.getElementById("tb_" + String(selIdx)).style.display = "none";
		selLocation = selTab.getAttribute("name") ;
		
		selIdx = idx;
	}
}

function Open_Form(fmid, fmnm, fmpt, scid, fmrv, fmfn)
{//debugger;//양식 오픈
	var today = new Date();
	var strURL = '/CoviWeb/Approval/Forms/Form.aspx?fmid=' + fmid + "&fmnm=" + toUTF8(fmnm) + "&fmpf="+fmpt+"&scid="+scid+"&mode=DRAFT&fmrv="+fmrv+"&fmfn="+fmfn+"&TaskID="+rel_activityid+"&TaskName="+toUTF8(rel_activityname);
	//alert(strURL);//var x, y;//x=800;//y=650;//z=window.screen.height - 400;//양식이 view위치조정 기존 -65
	var cookiedata = document.cookie; 	
	if(cookiedata.indexOf("chkFormTabView=True") > -1 ){
			var oTopOpenWindow = null;
			if ( parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
				oTopOpenWindow = parent.oFRMWIN;
			}
			if(oTopOpenWindow == null){
						strURL = strURL.replace("Forms/Form.aspx?","Forms/FormTab.aspx?");
						openWindow(strURL,"FORMS",1024 ,720 ,'fix');
						if ( parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
							parent.oFRMWIN = win;
						}else{
						}
			}else{
				try{
					if(oTopOpenWindow.name == "FORMS"){
						oTopOpenWindow.setformTab2(strURL,fmnm, fmid+today.getTime());//창이 떠 있는 경우 데이터 넘기기 처리
					}else{//신규 창 열기
						strURL = strURL.replace("Forms/Form.aspx?","Forms/FormTab.aspx?");
						openWindow(strURL,"FORMS",1024 ,720 ,'fix');
						if ( parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
							parent.oFRMWIN = win;
						}else{
							parent.parent.oFRMWIN = win;
						}
					}
				}catch(e){//신규 창 열기
						strURL = strURL.replace("Forms/Form.aspx?","Forms/FormTab.aspx?");
						openWindow(strURL,"FORMS",1024 ,720 ,'fix');
						if ( parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
							parent.oFRMWIN = win;
						}else{
							parent.parent.oFRMWIN = win;
						}
				}
			}
	}else{
		openWindow(strURL,"",800,720,'fix'); //작성페이지는 여러 개를 열 수 있도록 한다.
	}

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
function viewlist(type) {
	var m_oXSLProcessor, strXSLFile;
	varType = type;
	switch (type) {
		case "tab":getXSL2();queryGetDataFormList();break;
		case "list":getXSL();queryGetDataFormList();break;
	}
}
function viewlist_back(type) {
	var m_oXSLProcessor, strXSLFile;
	//strXSLFile = "FormList.xsl";
    if (window.ActiveXObject) {
	    switch (type){
	        case "tab" : strXSLFile = "FormListXSL.aspx"; break;
	        case "list" : strXSLFile = "FormListALLXSL.aspx"; break;
	    }
	    m_oXSLProcessor = makeProcessor(strXSLFile);
	    m_oXSLProcessor.input = oFormXML;
    	
	    if(g_orderfield!="" && g_orderdesc != ""){
	        m_oXSLProcessor.addParameter("sortby", g_orderfield);
	        m_oXSLProcessor.addParameter("sortorder", g_orderdesc);
	    }
	   // m_oXSLProcessor.transform();
	    document.getElementById("FormList").innerHTML = m_oXSLProcessor.output;
	}else{
	    switch (type){
	        case "tab" :  m_oXSLProcessor = makeProcessor(m_objXML2); break;
	        case "list" : m_oXSLProcessor = makeProcessor(m_objXML); break;
	    }
	    if(g_orderfield!="" && g_orderdesc != ""){
	        m_oXSLProcessor.setParameter(null,"sortby", g_orderfield);
	        m_oXSLProcessor.setParameter(null,"sortorder", g_orderdesc);
	    }	
        var oResultDom = m_oXSLProcessor.transformToDocument(oFormXML);
        var oSerializer = new XMLSerializer();
        var sResult = oSerializer.serializeToString(oResultDom);
        if (sResult.indexOf("<transformiix:result") > -1) {
            sResult = sResult.substring(sResult.indexOf(">") + 1, 
                                        sResult.lastIndexOf("<"));
        }
	   document.getElementById("FormList").innerHTML= sResult;
	        
	}
    if (listtype=='list' && gOrder != '')
	{
		var aOrder=gOrder.split(";");
		switch(aOrder[0]){
		    case "ascending":
        		document.getElementById('span'+aOrder[1]).innerHTML = '<img src="'+ g_imgBasePath+'/Covi/common/icon/blt_07_asc.gif" align="absmiddle">';
    		    break;
		    case "descending":
        		document.getElementById('span'+aOrder[1]).innerHTML = '<img src="' + g_imgBasePath +'/Covi/common/icon/blt_07_desc.gif" align="absmiddle">';
	    	    break;
		}
	}	
}
var g_orderfield = "";
var g_orderdesc = "";
var gOrder="";
function sortColumn(szClm){
	var aOrder=gOrder.split(";");
	if(aOrder[1]==szClm && aOrder[0]=="ascending"){
		gOrder="descending;" + szClm;
		g_orderdesc = "descending";
		g_orderfield = szClm;
	}else{
		gOrder="ascending;" + szClm;
		g_orderdesc = "ascending";
		g_orderfield = szClm;
	}
    viewlist(listtype);			
}
// 문서대장 작성버튼 클릭시 해당 양식 오픈 by 2008.10.1 강효정(Doclist.aspx파일에 openWindow함수 Url이 박혀있어서 새로 만듬.)
function Open_FormDocList(fmid, fmnm, fmpt, scid, fmrv, fmfn){
	var strURL = "../forms/form.aspx?fmid=" + fmid + "&fmnm=" + toUTF8(fmnm) + "&fmpf="+fmpt+"&scid="+scid+"&mode=DRAFT&fmrv="+fmrv+"&fmfn="+fmfn;
	var x, y;
	x=800;
	y=window.screen.height - 95;

    CoviWindow(strURL,"Form",x,y,'resize');
}


function changeBoxFirst() {
//	document.getElementById(selMainTab).className = "";
	document.getElementById("tb_" + String(selIdx)).display = "none";
	document.getElementById("tab_1").className = "current";
	document.getElementById("tb_1").display = "";
	selLocation = "tab_1"
	selIdx = 1;
	selMainTab = "tab_1";
} 


/*

个*/