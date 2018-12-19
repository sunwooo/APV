var g_strMainOffice		= "";	//蹂몃?肄붾뱶
var g_strMainOfficeName	= "";	//蹂몃?紐?
var g_szBaseFolder		= "http://" + window.document.location.host + "/Covi/";
var g_strBaseFolder		= "http://" + window.document.location.host + "/Covi/";
var g_strPublicFolderUrl= "http://" + window.document.location.host + "/public/";
var g_objSelectedSubMenu;		//?곷떒 SubMenu
var perHref="" ;
var g_iPollingIneterval = 60; //calendar polling interval in seconds

//////// Menu Image 泥섎━ /////////
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v3.0
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}
//////// Menu Image 泥섎━ /////////

function topMenu(strMenu,bDisplay) {
	switch (strMenu) {
		case "?고렪?? :
			parent.list.document.location = "/Covi/today/main.asp?menu=true&menuasp=navbar/menu_mail.asp";
	  		break;
		case "?고렪?⑦솃" :
			parent.list.document.location = "/Covi/today/main.asp?menu=true&menuasp=navbar/menu_mail.asp?dftview=home";
	  		break;
		case "sentitems" :
			parent.list.document.location = "/Covi/today/main.asp?menu=true&menuasp=navbar/menu_mail.asp?dftview=sentitems";
	  		break;
		case "?곕씫泥? :
			parent.list.document.location = "/Covi/today/main.asp?menu=true&menuasp=navbar/menu_mail.asp?dftview=contacts";
	  		break;
		case "?섍꼍?ㅼ젙" :
			parent.list.document.location = "/Covi/today/main.asp?menu=true&menuasp=navbar/menu_mail.asp?dftview=configuration";
	  		break;
	  	case "寃곗옱?? :
	  		parent.list.document.location = "/Covi/today/main.asp?menu=true&menuasp=/Covi/approval/Menu_approval.asp";
	  		break;
		default :
	}
}

function bottomMenu(strMenu) {
	switch (strMenu) {
		case "?고렪?? :
			modeUrl 	= "http://" + window.document.location.host + "/Covi/person/mail/GGOI_newpost_W01.asp?Cmd=new&Drafts=" + toUTF8(g_szDraftsURL);
			etcParam 	= 'fix';
			//CoviWindow(modeUrl,'',screen.availWidth-6,screen.availHeight-22,etcParam);
			CoviFullWindow(modeUrl,'','resize');
			break;
	    default :
	    	modeUrl 	= '/Covi/today/UnderConstruction.htm';
	    	etcParam 	= 'fix';
			CoviWindow(modeUrl,'',800,600,etcParam);
	    	break;
	}
}

function displayHome(bDisplay)
{
	switch(bDisplay) {
		case "0" :		// ??硫붾돱
			menu.style.display = "";
			break;
		case "false" :	// NavBar媛 ?녿뒗 硫붾돱
			menu.style.display = "none";
			break;
 		case "true" :	// NavBar媛 ?덈뒗 硫붾돱
			menu.style.display = "";
			break;
		default :
			break;
	}
}

function rtnlocation(strFolderName)
{
}

function rtnCompany(strCompany) {
	return("");
}

function getMainOffice() {
	g_strMainOffice = "";
}

function NavBarRefresh() {
	window.document.location = window.document.location;
}

// UTF8濡?Encoding
function encodingURL(szInput) {

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

function toUTF8(szInput){
	var wch,x,uch="",szRet="";

	for (x=0; x<szInput.length; x++){
		wch=szInput.charCodeAt(x);
		if (!(wch & 0xFF80)){
			szRet += "%" + wch.toString(16);
		}
		else if (!(wch & 0xF000)){
			uch = "%" + (wch>>6 | 0xC0).toString(16) +
				  "%" + (wch & 0x3F | 0x80).toString(16);
			szRet += uch;
		}
		else{
			uch = "%" + (wch >> 12 | 0xE0).toString(16) +
				  "%" + (((wch >> 6) & 0x3F) | 0x80).toString(16) +
				  "%" + (wch & 0x3F | 0x80).toString(16);
			szRet += uch;
		}
	}
	return(szRet);
}

function calcWindowLocation(theWidth,theHeight) {
	var objNewWin;

	var x = theWidth
	var y = theHeight

	theLeft = window.screen.width  / 2 - x / 2
	theTop = window.screen.height / 2 - y / 2 - 20
}

function CoviNoticeWindow(fileName) {
	var etcParam = "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";dialogTop:0;dialogLeft:0";
	etcParam = etcParam + ";help:no;";
	window.showModalDialog(fileName,'',etcParam);
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

	if (windowName == "newMessageWindow")
	{
		windowName = new String(Math.round(Math.random() * 100000));
	}

	window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}

function CoviPositionWindow(fileName,windowName,theWidth,theHeight,theTop,theLeft,etcParam) {
	if (etcParam == 'fix') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0";
	}
	else if (etcParam == 'resize') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1";
	}
	else if (etcParam == 'scroll') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1";
	}

	var sz = ",width=" + theWidth + ",height=" + theHeight + ",top=" + theTop + ",left=" + theLeft ;

	if (windowName == "newMessageWindow")
	{
		windowName = new String(Math.round(Math.random() * 100000));
	}

	window.open(fileName,windowName, etcParam + sz);
}

function CoviFullWindow(fileName,windowName,etcParam) {
	
	var x = 800;
	var y = 600;

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

	if (windowName == "newMessageWindow")
	{
		windowName = new String(Math.round(Math.random() * 100000));
	}
	window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}

function CoviFullResizeWindow(fileName,windowName) {
	var etcParam = "toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes";
	etcParam = etcParam + ",width=" + screen.availWidth + ",height=" + screen.availHeight + ",top=0,left=0";

	window.open(fileName,windowName, etcParam );
}

function getCookie(name){
	var nameOfCookie = name + "=";
	var x = 0;
	while ( x <= document.cookie.length )
	{
		var y = (x+nameOfCookie.length);
		if ( document.cookie.substring( x, y ) == nameOfCookie ) {
			if ((endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
				endOfCookie = document.cookie.length;
			return unescape( document.cookie.substring( y, endOfCookie ) );
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if ( x == 0 )
			break;
	}
	return "";
}

function changeReadState(MsgUrl){
	var sBody = "<?xml version='1.0'?><d:propertyupdate xmlns:d='DAV:' xmlns:c='urn:schemas:httpmail:'><d:set><d:prop><c:read>1</c:read></d:prop></d:set></d:propertyupdate>"

	var oHTTP = new ActiveXObject("Microsoft.XMLHTTP")

	oHTTP.open("PROPPATCH",MsgUrl,true);

	oHTTP.setRequestHeader("Content-Type","text/xml");
	oHTTP.setRequestHeader("Depth", "0");
	oHTTP.send(sBody);
}
function CoviEncodingWindow(fileName,windowName,theWidth,theHeight, etcParam) {
	
	var x = theWidth;
	var y = theHeight;

	var sx = window.screen.width  / 2 - x / 2;
	var sy = window.screen.height / 2 - y / 2 - 40;


	if (etcParam == 'fix') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=0";
	}
	else if (etcParam == 'resize') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1";
		var sy = window.screen.height / 2 - y / 2 - 40;
	}

	if (sy < 0 ) {
		sy = 0;
	}

	var sz = ",top=" + sy + ",left=" + sx;

	if (windowName == "newMessageWindow")
	{
	windowName = new String(Math.round(Math.random() * 100000));
	}

	window.open(fileName + "=" + strURL,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}

function CoviOpenWindow(fileName,windowName,theWidth,theHeight){
	etcParam = "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes";
	window.open(fileName,windowName, etcParam + ",width=" + theWidth + ",height=" + theHeight);
}

function todayOpen(objMail, strType) {
	var szUrl = "";
	for (var i = 0;szUrl=="" && i < objMail.children.length ; i++)	{
		if (objMail.children[i].tagName == "TD"){
			var objTD = objMail.children[i];
			for (var j =0;j < objTD.children.length ;j++ ){
				if (objTD.children[j].tagName == "A"){
					szUrl = objTD.children[j]._href;
					break;
				}
			}
		} else if (objMail.children[i].tagName == "A"){
			var objTD = objMail.children[i];
			szUrl = objTD._href;
			break;
		}
	}
	if (szUrl == ""){
		alert("寃쎈줈媛 ?뺥솗?섏? ?딆뒿?덈떎.. ");
		return false;
	} else {
		if (strType == "mail"){	
			var modeUrl = szUrl + "/?cmd=open";
		} else {
			var tempUrl = szUrl.split("/") ;
			var msgId = tempUrl[tempUrl.length-1] ;
			var modeUrl = g_szBaseFolder + "forms/generalpost/GGOB_editpost_W02.asp?msgId=" + msgId + "&msgUrl=" + szUrl + "&folderUrl=" ;
		}
		changeReadState(szUrl);
		var etcParam = "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes";
		CoviFullWindow(modeUrl,'','resize');
	//	document.location.reload();
	}
}

var oGetUnreadHTTP;
function getUnreadCount() {
	try{
		var strReq;
		strReq = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
		strReq = strReq + "<d:propfind xmlns:d='DAV:' xmlns:h='urn:schemas:httpmail:'>" ;
		strReq = strReq + "<d:prop><h:unreadcount/></d:prop>";
		strReq = strReq + "</d:propfind>";

		oGetUnreadHTTP = new ActiveXObject("Microsoft.XMLhttp");

		oGetUnreadHTTP.Open("PROPFIND", g_szInboxUrl , true);
		oGetUnreadHTTP.setRequestHeader("Depth", "0");
		oGetUnreadHTTP.setRequestHeader( "Brief:", "t");
		oGetUnreadHTTP.setRequestHeader("Content-Type", "text/xml");
		oGetUnreadHTTP.onreadystatechange =getUnreadCount_event_sync;
		oGetUnreadHTTP.send(strReq);

		if (oGetUnreadHTTP.status == 207)	{
			strUnreadCount = oGetUnreadHTTP.responseXML.selectSingleNode("a:multistatus/a:response/a:propstat/a:prop/d:unreadcount").text;
		} else {
			strUnreadCount = 0;
		}
	}
	catch (e){
		alert("getUnreadCount:" + e.description);
		g_szCount = 0;
	}

//    return strUnreadCount ;

}
function getUnreadCount_event_sync(){
	if(oGetUnreadHTTP.readyState == 4) {
		if (oGetUnreadHTTP.status == 207)	{
			g_szCount = oGetUnreadHTTP.responseXML.selectSingleNode("a:multistatus/a:response/a:propstat/a:prop/d:unreadcount").text;
		} else {
			g_szCount = 0;
		}
		spnUnreadCount.innerText = g_szCount;
		pageCount();
		listMail();
		if (g_szCount > 0) getPageHTML(g_szPage,g_szTotalPage);
	}
}

function getWellKownMailboxUrl(oHTTP,sRootURL,listener){	
	var sBody = '<?xml version="1.0"?>' +
				'<a:propfind xmlns:a="DAV:" xmlns:b="urn:schemas:httpmail:" >' +
				'<a:prop><b:inbox/><b:calendar/><b:sentitems/><b:deleteditems/><b:contacts/><b:drafts/><b:outbox/>' +
				'</></>';

	oHTTP.open("PROPFIND", sRootURL,true);
	oHTTP.setRequestHeader( "Depth:", "0");
	oHTTP.setRequestHeader( "Brief:", "t");
	oHTTP.setRequestHeader( "Content-type:", "text/xml");
  
    if(listener!=null) oHTTP.onreadystatechange = listener;  
  
	oHTTP.send(sBody);
}

function event_noop(){
	return(false);
}

var oXML = new ActiveXObject("Microsoft.XMLDOM");
var m_xmlHTTP = new ActiveXObject("Microsoft.xmlhttp");

function setWellKnownMailboxUrl(oHTTP){
	var sXML = "<result><![CDATA[<XML>";
	var objResponseXML = oHTTP.responseXML;
	var xmlNodes = objResponseXML.selectNodes("a:multistatus/a:response/a:propstat/a:prop/*");

	for(var i=0;i <= xmlNodes.length - 1; i++){
		sXML += "<" + xmlNodes.item(i).baseName + ">" + (xmlNodes.item(i).text).replace(g_szUserBase, "") + "</" + xmlNodes.item(i).baseName + ">" ;
	}

	sXML += "</XML>]]></result>";

	oXML.loadXML(sXML);

	var sURL = "/Covi/include/setSessionMailBoxUrl.asp";
	m_xmlHTTP.open("POST",sURL,true);
	m_xmlHTTP.setRequestHeader("Accept-Language:", "ko");
	m_xmlHTTP.setRequestHeader( "Content-type:", "text/xml");  
	m_xmlHTTP.onreadystatechange = doProcess;
	m_xmlHTTP.send(sXML);
}

function doProcess() {
	if(m_xmlHTTP.readyState == 4){
		m_xmlHTTP.onreadystatechange = event_noop;//re-entrant gate
		if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			alert("error in doProcess(): no responseText returned");
		}
		else{
			var oXML = new ActiveXObject("Microsoft.XMLDOM");

			if (oXML.loadXML(m_xmlHTTP.responseText)==true)	{
				var errorNode=oXML.selectSingleNode("result/error");
				if(errorNode!=null){
					alert("error: " + errorNode.text);
				}			
			}else{
				alert("硫붿씪 ?뺣낫 ?ㅼ젙 ?ㅻ쪟...!") ;
			} 
		}
	}
}

function eventsync_home(){ 
	if(oGetWellKownMailboxUrl.readyState == 4) {		
		oGetWellKownMailboxUrl.onreadystatechange  = event_noop;
		if(oGetWellKownMailboxUrl.status == 207)
		{
			setWellKnownMailboxUrl(oGetWellKownMailboxUrl)
			szInboxUrl	= oGetWellKownMailboxUrl.responseXML.selectSingleNode("a:multistatus/a:response/a:propstat/a:prop/d:inbox").text;
			szCalendarUrl = oGetWellKownMailboxUrl.responseXML.selectSingleNode("a:multistatus/a:response/a:propstat/a:prop/d:calendar").text;

			var g_szInboxUrl	= oGetWellKownMailboxUrl.responseXML.selectSingleNode("a:multistatus/a:response/a:propstat/a:prop/d:inbox").text;
			var g_szCalendarUrl = oGetWellKownMailboxUrl.responseXML.selectSingleNode("a:multistatus/a:response/a:propstat/a:prop/d:calendar").text;

			mailtest.location = "/Covi/today/todaymail/m_view.asp?folderUrl="+ encodingURL(g_szInboxUrl);
			todaycal.location = "/Covi/today/TodayCalendar/s_list.asp?folderUrl="+ encodingURL(g_szCalendarUrl);
		} else {
		}
	}
}

function eventsync_bottom()
{
	if(oGetWellKownMailboxUrl.readyState == 4) {	
		oGetWellKownMailboxUrl.onreadystatechange  = event_noop;		
		if(oGetWellKownMailboxUrl.status == 207)
		{
			setWellKnownMailboxUrl(oGetWellKownMailboxUrl)
			g_szDraftsURL	= oGetWellKownMailboxUrl.responseXML.selectSingleNode("a:multistatus/a:response/a:propstat/a:prop/d:drafts").text;
			g_szDraftsURL	= g_szDraftsURL.replace(g_szUserBase, "")
			g_szFolder		= oGetWellKownMailboxUrl.responseXML.selectSingleNode("a:multistatus/a:response/a:propstat/a:prop/d:calendar").text;
			g_szFolder		= g_szFolder.replace(g_szUserBase, "")
		} else {
		}
	}
}

function eventsync_mailview(){  
	if(oGetWellKownMailboxUrl.readyState == 4) {	
		oGetWellKownMailboxUrl.onreadystatechange  = event_noop;	// false 由ы꽩 	
		if(oGetWellKownMailboxUrl.status == 207)
		{
			setWellKnownMailboxUrl(oGetWellKownMailboxUrl)
			g_szDraftsURL		= oGetWellKownMailboxUrl.responseXML.selectSingleNode("a:multistatus/a:response/a:propstat/a:prop/d:drafts").text;
			
			g_szDraftsURL		= g_szDraftsURL.replace(g_szUserBase, "");

			g_szCalendarURL		= oGetWellKownMailboxUrl.responseXML.selectSingleNode("a:multistatus/a:response/a:propstat/a:prop/d:calendar").text;
			g_szCalendarURL		= g_szCalendarURL.replace(g_szUserBase, "");

			g_szContactsURL		= oGetWellKownMailboxUrl.responseXML.selectSingleNode("a:multistatus/a:response/a:propstat/a:prop/d:contacts").text;
			g_szContactsURL		= g_szContactsURL.replace(g_szUserBase, "");

			g_szDeletedItemsURL	= oGetWellKownMailboxUrl.responseXML.selectSingleNode("a:multistatus/a:response/a:propstat/a:prop/d:deleteditems").text;
			g_szDeletedItemsURL = g_szDeletedItemsURL.replace(g_szUserBase, "");

			g_szSentitems = oGetWellKownMailboxUrl.responseXML.selectSingleNode("a:multistatus/a:response/a:propstat/a:prop/d:sentitems").text;
			g_szSentitems = g_szSentitems.replace(g_szUserBase, "");
		} else {
		}
	}
}

function getMailboxUrl(szRootURL) {
	var m_rgMailbox = null;
	
	var oXMLDOM = new ActiveXObject("Microsoft.XMLDOM");

	if (oXMLDOM.loadXML(MailboxUrl)==true) {
		try	{
			m_rgMailbox = { "inbox" : oXMLDOM.selectSingleNode("XML/inbox").text,
								 "calendar" : oXMLDOM.selectSingleNode("XML/calendar").text,
								 "sentitems" : oXMLDOM.selectSingleNode("XML/sentitems").text,
								 "deleteditems" : oXMLDOM.selectSingleNode("XML/deleteditems").text,
								 "contacts" : oXMLDOM.selectSingleNode("XML/contacts").text,
								 "drafts" : oXMLDOM.selectSingleNode("XML/drafts").text,
								 "outbox" : oXMLDOM.selectSingleNode("XML/outbox").text
							   };

			return m_rgMailbox;
		}
		catch (e){
			return m_rgMailbox;
		}
	}	

}

function TotalSize(iTotalSize){
	iTotalSize  = iTotalSize/1024;	
	if (iTotalSize > 1024) { 
		iStotalSize	= parseInt(iTotalSize/1024);
		iMod		= Math.round((iTotalSize%1024)/100);
		sTotalSize	= iStotalSize + "." + iMod + "M";
	} else {
		iStotalSize = parseInt(iTotalSize);
		iMod		= Math.round((iTotalSize%1024)/100);
		sTotalSize	= iStotalSize + "." + iMod + "K";
	}
	iTotalSize = sTotalSize;
	return iTotalSize ; 
}	

function openNewWindow(fileName,windowName,theWidth,theHeight) {
		
	if (windowName =="OutlookWebAccessHelp")
	{
		calcWindowLocation(theWidth,theHeight);
		window.open(fileName,windowName,"toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width="+theWidth+",height="+theHeight+",top=" + theTop + ",left=" + theLeft)
	}
	else
	{
		if (windowName == "newMessageWindow") 
		{
			//generate random window ID
			 windowName = new String(Math.round(Math.random() * 100000));
		}
		calcWindowLocation(theWidth,theHeight);
		window.open(fileName,windowName,"toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1,width="+(screen.availWidth-10).toString() +",height="+(screen.availHeight-30).toString()+",top=0,left=0" )
	}
}

function encodeChar(sData)
{
	return sData.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function mouseOver(thisObj) {
	thisObj.style.textDecoration = "underline";
}
function mouseOut(thisObj) {
	thisObj.style.textDecoration = "none";
}

// Per Mail Box Size
function perMailBoxSize(sUserAlias, sServer) {
         
	var	strURLMailbox = "http://" + sServer + "/exchange/" + sUserAlias;

	var	sSQL	= "SELECT \"http://schemas.microsoft.com/exchange/foldersize\" as FolderSize , "
				+ " \"urn:schemas:httpmail:unreadcount\" as unreadcount ,\"DAV:visiblecount\"  as visiblecount "
				+ " FROM SCOPE ('deep traversal of \"" + strURLMailbox + "\"')"
				+ " WHERE \"DAV:isfolder\" = TRUE" ;

	var sXML	= "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
				+ "<d:searchrequest xmlns:d=\"DAV:\" xmlns:x=\"urn:schemas:httpmail:\">"
				+ "  <d:sql>" + sSQL + "</d:sql>"
				+ "</d:searchrequest>";

	if(oDavRequest_url != null) {
		oDavRequest_url.open("SEARCH", strURLMailbox, true);
		oDavRequest_url.SetRequestHeader("Content-Type", "text/xml");
		oDavRequest_url.onreadystatechange = event_perMailBoxSize;
		oDavRequest_url.send(sXML);
	}
	
}

function event_perMailBoxSize() {
	if(oDavRequest_url == null) return(false);
	if(oDavRequest_url.readyState == 4) {
		oDavRequest_url.onreadystatechange  = event_noop;	
		var sTotalSize;
		var iTotalSize = 0;
		var iMod = 0;
		if( oDavRequest_url.status == 207 ) {		
			var oXMLDOM = new ActiveXObject("Microsoft.XMLDOM");
			oXMLDOM.loadXML(oDavRequest_url.responseText);

			var oNodes_N = oXMLDOM.selectNodes("a:multistatus/a:response");

			perMailBoxSize_html('inbox',oNodes_N);
			perMailBoxSize_html('sentitems',oNodes_N);
			perMailBoxSize_html('outbox',oNodes_N);
			perMailBoxSize_html('drafts',oNodes_N);
			perMailBoxSize_html('deleteditems',oNodes_N);
			
			var per_url = SubpersonMailBox(g_Location); 
			if(per_url!=false)	perMailBoxSize_html('person',oNodes_N,perHref);	//	alert(perHref);
			perMailBoxSize_html('person1',oNodes_N);
			
			var oNode;
			var oNodes = oXMLDOM.selectNodes("//FolderSize");
			for (iLength = 0 ; iLength<oNodes.length ; iLength++) {
				oNode = oNodes.item(iLength);
				iTotalSize = iTotalSize + parseInt(oNode.text);
			}
		}
		
		iTotalSize  = TotalSize(iTotalSize);
 		displaySize.innerHTML = iTotalSize ;
	}
}

function perMailBoxSize_html(flag,oNodes_N,perHref){ 
	var chkDisp = false ;

	var IsDisplay = true ; 
	if(flag=="inbox"){ 
		var per_url = rg_Mailbox["inbox"].replace(g_szUserBase,"") ;
		var href_Val = g_szUserBase + rg_Mailbox["inbox"]; var folderName = "諛쏆??몄??? ; 
	}else if(flag=="sentitems"){ 
		var per_url = rg_Mailbox["sentitems"].replace(g_szUserBase,"") ;
		var href_Val = g_szUserBase + rg_Mailbox["sentitems"];var folderName = "蹂대궦?몄??? ;
	}else if(flag=="outbox"){	
		var per_url = rg_Mailbox["outbox"].replace(g_szUserBase,"") ;
		var href_Val = g_szUserBase + rg_Mailbox["outbox"];var folderName = "蹂대궪?몄??? ;
	}else if(flag=="drafts"){	
		var per_url = rg_Mailbox["drafts"].replace(g_szUserBase,"") ;
		var href_Val = g_szUserBase + rg_Mailbox["drafts"];var folderName = "?꾩떆蹂닿??? ;
	}else if(flag=="deleteditems"){
		var per_url = rg_Mailbox["deleteditems"].replace(g_szUserBase,"") ;
		var href_Val = g_szUserBase + rg_Mailbox["deleteditems"];var folderName = "吏?댄렪吏?? ;
	}else if(flag=="person"){	
		var per_url = perHref ;var folderName = "媛쒖씤?몄??? ;
	}else if(flag=="person1"){ 
		var per_url = g_Location.replace(g_szUserBase,"") ;
		per_url = per_url.toUpperCase( );
		var href_Val =g_Location; 	var folderName = "媛쒖씤?몄??? ;
	}	
    
	 var bb,aa,oNodes11;var aaTotalSize1="";var visiblecount,unreadcount,tempCnt
	 var unreadcountText="",visiblecountText=""; 
	 var tempCntArray =new Array();
	for (var i=0 ; i<oNodes_N.length ; i++) { 
   		oNodes11 = oNodes_N.item(i).selectNodes("a:href");
   		bb = oNodes_N.item(i).selectNodes("a:propstat/a:prop/FolderSize");
		aa = oNodes11.item(0).text ;  
		unreadcount =  oNodes_N.item(i).selectNodes("a:propstat/a:prop/unreadcount").item(0).text; 
		visiblecount =  oNodes_N.item(i).selectNodes("a:propstat/a:prop/visiblecount").item(0).text; 
		
		if(flag=="person"){
			aa = aa.replace(g_szUserBase,"") ;		
			if(per_url.indexOf(aa) >0){  
				unreadcountText  = parseInt( parseInt(unreadcount) + unreadcountText) ;
	 			visiblecountText = parseInt( parseInt(visiblecount) + visiblecountText);
				aaTotalSize1  = parseInt(aaTotalSize1 + parseInt(bb.item(0).text));
				eval("displayCnt_"+flag).innerHTML= unreadcount+"/"+visiblecount ; 		
		 		eval("displayAmount_"+flag).innerHTML=  TotalSize(aaTotalSize1) ;
		 		eval("displayButton_"+flag).innerHTML= "<img src='images/icon_del.gif' style='cursor:hand' border='0' onClick=per_getMailBoxURL('"+ per_url +"','"+folderName+"','"+flag+"');>" ; 
		 	
			}
		}else if( aa.indexOf(per_url) > 0 ){ 
			unreadcountText  = parseInt( parseInt(unreadcount) + unreadcountText) ;
	 		visiblecountText = parseInt( parseInt(visiblecount) + visiblecountText);
			aaTotalSize1  =  parseInt(aaTotalSize1 + parseInt(bb.item(0).text));	 		
	 	
	 		if(flag=="person1"){ 
	 			tempCnt = displayCnt_person.innerHTML ; 
	 			if(tempCnt.length>0){
	 			}else{
	 				displayButton_person.innerHTML = "<img src='images/icon_del.gif' style='cursor:hand' border='0' onClick=per_getMailBoxURL('"+ href_Val +"','"+folderName+"','"+flag+"');>" ; 
	 			} 
	 			
	 			displayCnt_person.innerHTML= unreadcountText+"/"+visiblecountText  ; 	
	 			displayAmount_person.innerHTML=  TotalSize(aaTotalSize1) ;
	 		}else{
				if(chkDisp == false) {
					eval("displayCnt_"+flag).innerHTML= unreadcount+"/"+visiblecount  ; 		
					eval("displayAmount_"+flag).innerHTML=  TotalSize(aaTotalSize1) ;
					eval("displayButton_"+flag).innerHTML= "<img src='images/icon_del.gif' style='cursor:hand' border='0' onClick=per_getMailBoxURL('"+ href_Val +"','"+folderName+"','"+flag+"');>" ;
				}
				chkDisp = true ;
	 		}
		}	
	} 
}

function SubpersonMailBox(perUrl){
	var oDavRequest_person = new ActiveXObject("Microsoft.XMLHTTP");
	
	var m_bstrRequestXML = '' +
	'<searchrequest xmlns="DAV:">' +
	  '<sql> Select "DAV:displayname" as displayname, "DAV:comment" as comment, "http://schemas.microsoft.com/exchange/content-href" as contenthref,' +
	  '"DAV:hassubs" as hassubs,"DAV:contentclass" as contentclass ' +
		'FROM Scope(\'HIERARCHICAL TRAVERSAL OF ""\') ' +
		'WHERE "DAV:ishidden" = false ' +
	'</>' +
	'</>';		
	
	oDavRequest_person.open("SEARCH", perUrl, false); 
	oDavRequest_person.setRequestHeader("Content-type", "text/xml");
	oDavRequest_person.setRequestHeader("Brief:", "t");
	oDavRequest_person.setRequestHeader("Translate", "f");
	oDavRequest_person.setRequestHeader("Accept-Language:","ko,en-us;q=0.5");
	oDavRequest_person.send(m_bstrRequestXML); 
	
	if(oDavRequest_person.readyState == 4 && oDavRequest_person.status == 207){  		
		oDavRequest_person.onreadystatechange  = event_noop;	
		var oXMLDOM2 = new ActiveXObject("Microsoft.XMLDOM");
		oXMLDOM2.loadXML(oDavRequest_person.responseText);
		var objXML      = oDavRequest_person.responseXML;
		
		var nodeMultistatus = objXML.documentElement;
		var objCollHREF = nodeMultistatus.selectNodes("a:response/a:href");
		var subHref;
		if(objCollHREF.length != 0){
			for (var i = 0; i < objCollHREF.length ; i++){
				perHref = perHref + objCollHREF.item(i).text+"," ;
				subHref = SubpersonMailBox(objCollHREF.item(i).text);
			}	
		}
			return(perHref);
	}
}

function openWindow(fileName,windowName,theWidth,theHeight, etcParam) {
	
	var x = theWidth;
	var y = theHeight;

	var sy = window.screen.height / 2 - y / 2 - 70;
	if (etcParam == 'fix') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0";
		var sy = window.screen.height / 2 - y / 2 - 40;
	}
	else if (etcParam == 'resize') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1";
		var sy = window.screen.height / 2 - y / 2 - 40;
	}

	var sx = window.screen.width  / 2 - x / 2;

	if (sy < 0 ) {
		sy = 0;
	}
	
	var sz = ",top=" + sy + ",left=" + sx;

	if (windowName == "newMessageWindow") {
	windowName = new String(Math.round(Math.random() * 100000));
	} 
	window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}

function openWindow2(fileName,windowName,theWidth,theHeight, etcParam) {
	
	var x = theWidth;
	var y = theHeight;

	var sy = window.screen.height / 2 - y / 2 - 70;
	if (etcParam == 'fix') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0";
		var sy = window.screen.height / 2 - y / 2 - 40;
	}
	else if (etcParam == 'resize') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1";
		var sy = window.screen.height / 2 - y / 2 - 40;
	}

	var sx = window.screen.width  / 2 - x / 2;


	if (sy < 0 ) {
		sy = 0;
	}
	
	var sz = ",top=" + sy + ",left=" + sx;

	if (windowName == "newMessageWindow"){
	windowName = new String(Math.round(Math.random() * 100000));
	} 
	window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}

function openDocWindow(fileName,windowName,etcParam) {
	var x=800;
	var y=600;

	var sx = window.screen.width  / 2 - x / 2;
	var sy = window.screen.height / 2 - y / 2 - 40;
	var sz = ",top=" + sy + ",left=" + sx;

	if (windowName == "newMessageWindow") 
	{
	windowName = new String(Math.round(Math.random() * 100000));
	}

	if (etcParam == 'fix') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0";
	}
	else if (etcParam == 'resize') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1";
	}
	window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}

function mastermail() {
	var modeUrl	= "http://" + window.document.location.host + "/Covi/person/mail/GGOI_newpost_W01.asp?Cmd=new&MailTo=webmaster" ;
	CoviFullWindow(modeUrl,'','resize');
}