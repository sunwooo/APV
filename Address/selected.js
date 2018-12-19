var m_XMLDOM = CreateXmlDocument();
var g_szAcceptLang = "ko";
var m_szUrlParams = "";
var m_xmlHTTP;
var m_objResultWin;
var m_ENT="";

var g_objMessage;
var m_oParent;
var m_oUserList;
var g_eGalTable = document.getElementById("tblGalInfo");
var g_edivGalTable = document.getElementById("divGalTable");
var g_eCurrentRow = null;
var m_iCurrentList = -1;
var m_bUser;
var m_bGroup;
var m_bRef;
var m_bMail;
var m_bIns;
var m_bRecp;
var m_bCCGroup;
getDialogArguments();
var m_objWinDlgArgs = parent.parent.parent.dialogArguments;

var m_oldValue; //2007-08-26 신택상 이전 목록값 가져오기 
var m_rtnValue;

var m_bSuggest;  //제안(2008.07.03 by HIW)
var g_objSuggestKind;  //제안-구분값(2008.07.03 by HIW)
var g_objSuggestListBox;  //제안(2008.07.03 by HIW)
var g_Kind;  //2012-12-17 HIW 

window.onload= initOnload;
function initOnload() {
    
	m_bMail = getArg("bMail",false);
	m_bUser = getArg("bUser", false);
	m_bGroup = getArg("bGroup",false);
	m_bRef = getArg("bRef",false);
	m_bIns = getArg("bIns",false);//상근감사
	m_bRecp = getArg("bRecp",false);
	m_bCCGroup = getArg("bCCGroup",false);
	m_oldValue = getArg("m_oldValue",false);
	g_objMessage = getArg("objMessage", null);
	m_bSuggest = getArg("bSuggest", false);  //제안(2008.07.03 by HIW) 
	g_objSuggestKind = getArg("objSuggestKind", false);  //제안-구분값(2008.07.03 by HIW)
	g_objSuggestListBox = getArg("objSuggestListBox", false);  //제안-리스트박스객체(2008.07.03 by HIW)
	g_Kind = getArg("bKind", false);  //2012-12-17 HIW
	
	m_XMLDOM.loadXML("<selected><to>"+getArg("sTo","")+"</to><cc>"+getArg("sCc","")+"</cc><bcc>"+getArg("sBcc","")+"</bcc><user>"+getArg("sUser","")+"</user><group>"+getArg("sGroup","")+"</group><role>"+getArg("sRole","")+"</role></selected>");
	/*if(!m_XMLDOM.parsed){
		alertParseError(m_XMLDOM.parseError);
		parent.parent.parent.close();
	}*/

    var szId = "tblGalInfo";
    var unFiltered = document.getElementsByTagName('TABLE');
    var j=0;
    for (var i = 0; i < unFiltered.length; i++){
        if (unFiltered[i].getAttribute('id') == szId){
            g_eGalTable[j]   = unFiltered[i];
            j++;
        }
    }    
	if(!window.addEventListener) {
	    g_eGalTable[0].attachEvent("onmousedown",event_GalTable_onmousedown);
	    g_eGalTable[1].attachEvent("onmousedown",event_GalTable_onmousedown);
	    g_eGalTable[2].attachEvent("onmousedown",event_GalTable_onmousedown);
	    g_eGalTable[3].attachEvent("onmousedown",event_GalTable_onmousedown);
	    g_eGalTable[4].attachEvent("onmousedown",event_GalTable_onmousedown);
	    g_eGalTable[5].attachEvent("onmousedown",event_GalTable_onmousedown);
	    //document.attachEvent("onmousemove",event_GalTable_onmousemove);//위치 이상현상으로 처리 막음
    }
    else {	    
        g_eGalTable[0].addEventListener("mousedown",event_GalTable_onmousedown, false);
	    g_eGalTable[1].addEventListener("mousedown",event_GalTable_onmousedown, false);
	    g_eGalTable[2].addEventListener("mousedown",event_GalTable_onmousedown, false);
	    g_eGalTable[3].addEventListener("mousedown",event_GalTable_onmousedown, false);
	    g_eGalTable[4].addEventListener("mousedown",event_GalTable_onmousedown, false);
	    g_eGalTable[5].addEventListener("mousedown",event_GalTable_onmousedown, false);
	    //document.addEventListener("mousemove",event_GalTable_onmousemove, false);//위치 이상현상으로 처리 막음
    }
    szId = "divGalTable";
    unFiltered = document.getElementsByTagName('DIV');
    j=0;
    for (var i = 0; i < unFiltered.length; i++){
        if (unFiltered[i].getAttribute('id') == szId){
            g_edivGalTable[j]   = unFiltered[i];
            j++;
        }
    }    
    
	if(m_bMail){
		document.getElementsByName("trList")[0].style.display = "block";
		switchParentNode(0);
		refresh(0);
		document.getElementsByName("trList")[1].style.display = "block";
		switchParentNode(1);
		refresh(1);
		document.getElementsByName("trList")[2].style.display = "block";
		switchParentNode(2);
		refresh(2);
		parent.document.body.children[1].children[2].rows = "60%,*";
		document.getElementsByName("radRecips")[0].checked = true;
	}else if(m_bUser || m_bRef || m_bIns){
		g_edivGalTable[3].style.height = "300px";
		document.getElementsByName("trList")[3].style.display = "block";
		switchParentNode(3);
		refresh(3);
		document.getElementsByName("radRecips")[3].checked = true;
		if (m_bCCGroup)	parent.document.getElementById("Tab").dftPriv.style.display="block";
	}else if(m_bGroup || m_bRecp){
		if (m_bCCGroup){
			parent.document.getElementById("Tab").m_oSelTab.className="TabUnSel";
			parent.document.getElementById("Tab").m_oSelTab.style.display="none";
			var oNode =parent.document.getElementById("Tab").document.getElementsByName(parent.Tab.m_oSelTab.contentID);
			oNode.className="TabUnSel";

			parent.document.getElementById("Tab").dftRole.className="TabSel";
			parent.document.getElementById("Tab").dftRole.style.display="block";
			
			oNode = parent.document.getElementById("Tab").document.getElementsByName("tabRole");

			oNode.className="TabSel";
			
			oNode = oNode.firstChild;
			if(oNode.src==""||oNode.src=="_blank"){
				oNode.src = oNode.dataSrc;
			}
			document.getElementsByName("trList")[5].style.display = "";
		}else{
			document.getElementsByName("trList")[4].style.height = "470px";
			g_edivGalTable[4].style.height="465px";
			document.getElementsByName("trList")[4].style.display = "";
		}
		//parent.document.body.children[1].children[1].rows = "100%,*";
		parent.document.body.children[1].children[2].rows = "100%,*";
		document.getElementById("idmaintable").style.height = "470px";
		
		document.getElementsByName("radRecips")[4].checked = true;
		switchParentNode(4);
		refresh(4);
	}else{
		document.getElementsByName("trList")[5].style.display = "block";
		switchParentNode(5);
		refresh(5);
		parent.document.body.children[1].children[2].rows = "15%,*";
	}
	
	if (m_oldValue != false || m_oldValue != "" || m_oldValue != null)
	{	
		var m_oldList = CreateXmlDocument();
		var i,eml;
		m_oldList.loadXML(m_oldValue);
		elmlist = m_oldList.selectNodes("//item");
		for(var i=0; i< elmlist.length; i++){
			elm = elmlist[i];
			addListItem(elm);
		}
		if(m_bGroup || m_bRecp){
			refresh(4);
		}
		else if(m_bUser || m_bRef || m_bIns){
			refresh(3);
		}else{
			refresh(3);
		}

	}
}

function alertParseError(err){
	//if(err) alert(" Error in selected.js\ndesc:"+err.reason+"\nsrcurl:"+err.url+"\nsrctxt:"+err.srcText+"\nline:"+err.line+"\tcolumn:"+err.linepos);
}
function setSourceList(oSource){
	m_oUserList = oSource;
}
function getArg(sArgName, vDefault) {
    try{
        var v = m_objWinDlgArgs[sArgName];
        if (v == null) 
        {
		    return vDefault; 
        }
		else 
        {
            return v;
		}
		
	}catch(e){
		return vDefault;
	}
}
/*원본
function addDblClicked(){
	if (m_bGroup == false && m_bCCGroup==true && parent.document.getElementById("Tab").m_oSelTab.contentID!="tabPriv"){
		alert('그룹을 선택하시지 않았습니다. \n그룹탭을 선택하신 후 작업하세요!!!');
		return false;
	}
	for (var i=0;i<radRecips.length;i++){
		if(radRecips[i].checked==true){
			addClicked(i);
			break;
		}
	}
} */
// 체크박스 멀티체크 20060913 - 인호
function addDblClicked(){
for (var i=0;i<radRecips.length;i++)
	{
		if(radRecips[i].checked==true){
			//addClicked(i);
			var iType = i;
			if (m_bGroup == false && m_bCCGroup==true && parent.document.getElementById("Tab").m_oSelTab.contentID!="tabPriv"){
						alert(msg_196);
		        //alert('그룹을 선택하시지 않았습니다. \n그룹탭을 선택하신 후 작업하세요!!!');
		        return false;
	        }
	        if ((iType==3)&&(m_bGroup || m_bRecp)){
		        if(m_bCCGroup){iType=5;}else{iType=4;}
	        }	
            var oChkRowSelect = parent.frames[3].chkRowSelect;//top.ListItems
	        var oSelNode = m_oUserList.getCurrentNode();
        	
	        if(oSelNode != null){
		        switchParentNode(iType);
		        if(m_oParent.selectSingleNode("item[AN = '" + oSelNode.selectSingleNode("AN").text + "']") == null){
			        addListItem(oSelNode.cloneNode(true));
			        refresh(iType);
		        }
	        }
			break;
		}
	}
}


//체크박스 멀티체크 20060921-인호최종수정
function addClicked(iType) {
    if (m_bGroup == false && m_bCCGroup==true && ((parent.document.getElementById("Tab").contentWindow)?parent.document.getElementById("Tab").contentWindow:parent.document.getElementById("Tab")).m_oSelTab.contentID!="tabPriv"){
		alert(msg_196);
		        //alert('그룹을 선택하시지 않았습니다. \n그룹탭을 선택하신 후 작업하세요!!!');
		return false;
	}
	if ((iType==3)&&(m_bGroup || m_bRecp)){
		if(m_bCCGroup){iType=5;}else{iType=4;}
	}	
    var oChkRowSelect = parent.frames[3].document.getElementsByName("chkRowSelect");
	var oSelNode = m_oUserList.getCurrentNode();
	
	if((m_bGroup || m_bRecp) && ((parent.document.getElementById("Tab").contentWindow)?parent.document.getElementById("Tab").contentWindow:parent.document.getElementById("Tab")).m_oSelTab.contentID!="tabGroup" ){
	}else if((m_bUser) &&((parent.document.getElementById("Tab").contentWindow)?parent.document.getElementById("Tab").contentWindow:parent.document.getElementById("Tab")).m_oSelTab.contentID!="tabGroup" ){
	}else{
	    if(oSelNode == null){
	        return false;
	    }
	}
	if(oSelNode != null){
		switchParentNode(iType);
		if(m_oParent.selectSingleNode("item[AN = '" + oSelNode.selectSingleNode("AN").text + "']") == null){
			addListItem(oSelNode.cloneNode(true));
			refresh(iType);
		}
	}
	else{
     if(oChkRowSelect.length ==0 && oSelNode != null){ //oChkRowSelect.length == 0 && 
            switchParentNode(iType);
		    if(m_oParent.selectSingleNode("item[AN = '" + oSelNode.selectSingleNode("AN").text + "']") == null){
			    addListItem(oSelNode.cloneNode(true));
			    refresh(iType);
			}
     }
     else{
	 if(oChkRowSelect.length != null || oChkRowSelect.length == null){
	    if(oChkRowSelect.length == undefined ){
	        if(oChkRowSelect.checked){		//	체크된것만 가져오기
                var eTR = oChkRowSelect.parentNode;
				while(eTR.tagName != "TR") {	eTR = eTR.parentNode;}
			    parent.frames[3].g_eCurrentRow = eTR;
			    parent.frames[3].processSelectedRow();   
	        
	            var oSelNode = m_oUserList.getCurrentNode();//수정분
	            if (oSelNode != null)
	            {
		            if (oSelNode.length > 1) {
			            alert(msg_195);//alert('한명만 선택하십시요.');
			            return;
		            }	
	            }
	            if(oSelNode != null){
		            switchParentNode(iType);
		            if(m_oParent.selectSingleNode("item[AN = '" + oSelNode.selectSingleNode("AN").text + "']") == null){
				            addListItem(oSelNode.cloneNode(true));
				            refresh(iType);
		            }
	            }
            }
	    }else{
	        for (var i=0; i < oChkRowSelect.length; i++){
		        if(oChkRowSelect[i].checked){		//	체크된것만 가져오기
		                var eTR = oChkRowSelect[i].parentNode;
						while(eTR.tagName != "TR") {	eTR = eTR.parentNode;}
					    parent.frames[3].g_eCurrentRow = eTR;
					    parent.frames[3].processSelectedRow();   
						
			            var oSelNode = m_oUserList.getCurrentNode();//수정분
			            if (oSelNode != null)
			            {
				            if (oSelNode.length > 1) {
					            alert(msg_195);//alert('한명만 선택하십시요.');
					            return;
				            }	
			            }
			            if(oSelNode != null){
				            switchParentNode(iType);
					        if(m_oParent.selectSingleNode("item[AN = '" + oSelNode.selectSingleNode("AN").text + "']") == null){
					            addListItem(oSelNode.cloneNode(true));
					            refresh(iType);
				            }
			            }
		            }
	            }
	        }
	    }
	}  
	}
}
function addNode(oNode){
	var oSelNode = oNode;
	var iType;
	
	if(oSelNode != null){
		for (var i=0;i<radRecips.length;i++){
			if(radRecips[i].checked==true){
				iType = i;
				break;
			}
		}	
		switchParentNode(iType);
		if (m_oParent!=null){
			if(m_oParent.selectSingleNode("item[AN = '" + oSelNode.selectSingleNode("AN").text + "']") == null){
				addListItem(oSelNode.cloneNode(true));
				refresh(iType);
			}
		}
	}
}
/* 원본*/
function removeClicked(iType){
	if ((iType==3)&&(m_bGroup || m_bRecp)){
		if(m_bCCGroup){iType=5;}else{iType=4;}
	}
	if(iType != m_iCurrentList) return;

	switchParentNode(iType);
	
	if(g_eCurrentRow!=null){
		var oSelNode = m_oParent.selectSingleNode("item[AN = '" + g_eCurrentRow.an + "']");
		
		removeListItem(oSelNode);
		g_eCurrentRow = null;
		m_iCurrentList = -1;
		refresh(iType);
	}
} 

function Multiremove(iType){
	if(iType != m_iCurrentList) return;
	
	switchParentNode(iType);
	
	if(g_eCurrentRow!=null){
		var oSelNode = m_oParent.selectSingleNode("item[AN = '" + g_eCurrentRow.an + "']");
		removeListItem(oSelNode);
		g_eCurrentRow = null;
	}
}


//신규추가부분 완료
    
function switchParentNode(iType){
	switch(iType){
		case 0:
			m_oParent = m_XMLDOM.selectSingleNode("selected/to");
			break;
		case 1:
			m_oParent = m_XMLDOM.selectSingleNode("selected/cc");
			break;
		case 2:
			m_oParent = m_XMLDOM.selectSingleNode("selected/bcc");
			break;
		case 3:
			m_oParent = m_XMLDOM.selectSingleNode("selected/user");
			break;
		case 4:
			m_oParent = m_XMLDOM.selectSingleNode("selected/group");
			break;
		case 5:
			m_oParent = m_XMLDOM.selectSingleNode("selected/group");
			break;
	}
}
function cancelClicked(){
	parent.parent.close();
}
function okClicked(){
    
	if(m_bMail){
		addRecipient("MsgTo",m_XMLDOM.selectSingleNode("selected/to"));
		addRecipient("MsgCc",m_XMLDOM.selectSingleNode("selected/cc"));
		addRecipient("MsgBcc",m_XMLDOM.selectSingleNode("selected/bcc"));
	}else if(m_bUser||m_bRef){
	if (m_bSuggest)  //제안(2008.07.03 by HIW)
	{
	    member_selected_user_Suggest(m_XMLDOM.selectSingleNode("selected/user"));
	}
	else if (g_Kind == "01")  //2012-12-17 HIW
	{
	    MemberSelectConfirm(m_XMLDOM.selectSingleNode("selected/user"));
	}
	else {
	    inputValues("selected/user");
	}
	}else if(m_bIns){
		m_oParent = m_XMLDOM.selectSingleNode("selected/user");
		if(m_oParent.hasChildNodes()){
			copyToIns();
		}
	}else if(m_bGroup||m_bRecp){	   
	    if(m_bSuggest)  //제안(2008.07.03 by HIW)
		{
		    m_oParent = m_XMLDOM.selectSingleNode("selected/group");
		    var oNodes = m_oParent.childNodes;
    			
		    if(m_oParent.hasChildNodes())
		    {			   
			    if (oNodes.length > 1) 
			    {			
				    alert('한 부서만 선택하십시요!');
				    return;
			    }		
				    
			    inputSuggValues();
		    }
		}
		else
		{
		    inputValues("selected/group");
		}
    }
    
    if (m_rtnValue != false) {
        if (window.ActiveXObject) 
            this.close();
        else
            parent.parent.close(); //2013-03-21 HIW
	}
}
function addRecipient(szWhich,oParent){
	if(oParent.hasChildNodes()){
		var szDN="";
		var szAddrs="";
		var oInput;
		var oNodes = oParent.childNodes;
		var oItem = oNodes.nextNode();
		while(oItem!=null){
			szDN = oItem.selectSingleNode("DN").text.replace(/\x08/g,"&");
			//escape any [ or ] or \
			szDN = szDN.replace(/(\\|\[|\])/g,"\\"+"$1");
			szAddrs = szAddrs + ";" + szDN + "[smtp:" + oItem.selectSingleNode("EM").text.replace(/\x08/g,"&") + "]";
			oItem = oNodes.nextNode();
		}		
		oInput = g_objMessage.document.all(szWhich);
		oInput.value = oInput.value + szAddrs;
	}
}
function copyToIns(){
	var oCloneXML = new ActiveXObject("MSXML2.DOMDocument");
	oCloneXML.loadXML("<addresslist></addresslist>");
	var oParent = oCloneXML.firstChild;
	var oChildren = m_oParent.childNodes;
	var oChild = oChildren.nextNode();
	while(oChild!=null){
		oParent.appendChild(oChild.cloneNode(true));
		try{oChild = oChildren.nextNode();}catch(e){oChild=null;}
	}
	g_objMessage.insertIns(oCloneXML);
	return;
}
function inputValues(sElm){
    m_oParent = m_XMLDOM.selectSingleNode(sElm);
    if (m_oParent != null && m_oParent.hasChildNodes()) {
        m_rtnValue = g_objMessage.insertToList(m_oParent);
    }
}
function nodeData(oNode,szName){
	return oNode.selectSingleNode(szName).text.replace(/\x08/g,"&");
}
function setMessage(objMsgWindow){
	g_objMessage = objMsgWindow;
}
function addListItem(oNode){
	try{
		m_oParent.appendChild(oNode);
	}catch(e){
		alert(e.description);
	}
}
function removeListItem(oNode){
	try{
		m_oParent.removeChild(oNode);
	}catch(e){
		alert(e.description);
	}
}
function refresh(iType){
	clearContents(iType);
	
	var rgData = new Array();
	var nodes = m_oParent.selectNodes("item");
	
	if (nodes.length > 0)
	{
		g_eGalTable[iType].rows[0].style.display="";
		if(m_bGroup || m_bRecp){
			if ( m_bCCGroup ){
				for(var x=0; x<nodes.length; x++){
				    var el = nodes.nextNode();                       
					rgData[0] = nodeXData(el,x,"AN");
					rgData[1] = nodeXData(el,x,"DN");
					//rgData[2] = "";//nodeXData(el,x,"SGAN");
					//rgData[3] = nodeXData(el,x,"SGDN");
					addAddress(iType,rgData,
							nodeXData(el,x,"AN"),
							"",
							nodeXData(el,x,"AN"));
				}
			}else{
				for(var x=0; x<nodes.length; x++){
				     var el = nodes.nextNode(); 
					rgData[0] = ""//nodeXData(el,x,"AN");
					rgData[1] = nodeXData(el,x,"DN");
					rgData[2] = "";//nodeXData(el,x,"SGAN");
					rgData[3] = nodeXData(el,x,"SGDN");

			            addAddress(iType,rgData,
							nodeXData(el,x,"EM"),
							nodeXData(el,x,"JD"),
//							nodeXData(el,x,"ETNM"),
							nodeXData(el,x,"AN"));
				}
			}
		}else{
			for(var x=0; x<nodes.length; x++)
			{                       
				var el = nodes.nextNode();                            
				rgData[0] = nodeXData(el,x,"DN");
				rgData[1] = nodeXData(el,x,"PO");
				rgData[2] = nodeXData(el,x,"TL");
				rgData[3] = nodeXData(el,x,"DP");

				addAddress(iType,rgData,
						nodeXData(el,x,"EM"),
						nodeXData(el,x,"JD"),
						nodeXData(el,x,"AN"));
			}
		}
	}
}
function nodeXData(node,idx,szName){
	try{
	    if(node.selectSingleNode(szName)) {
		    return node.selectSingleNode(szName).text.replace(/\x08/g,"&");
		}else {
		    return "";
		}
	}catch(e){return "";}
}
function addAddress(iType,rgData,szEM,szJD,szAN){
	var eTD;
	var eTR = g_eGalTable[iType].insertRow(g_eGalTable[iType].rows.length);
	eTR.setAttribute("className","rowunselected");
	eTR.setAttribute("em",szEM);
	eTR.setAttribute("jd",szJD);
	eTR.setAttribute("an",szAN);
	eTR.setAttribute("pn",rgData[0]);
	eTR.style.height = "20px";
    
	for (var x=0;x<rgData.length;x++)
	{
		eTD = eTR.insertCell(eTR.cells.length);
		eTD.halign = "top";
		eTD.noWrap=true;
		eTD.style.paddingRight = "10px";
		eTD.innerHTML = getLngLabel(rgData[x].replace(/&/g,"&amp;"),false);
	}
}
function event_GalTable_onmousedown(e){
    var evt=(window.event)?window.event: e;
    var el = (evt.srcElement)?evt.srcElement:evt.target;	

	if (el.tagName.toUpperCase() != "TABLE" )//el.parentNode.parentNode.tagName.toUpperCase() != "THEAD" && 
	{
		if (g_eCurrentRow != null)
		{
			g_eCurrentRow.setAttribute("className","rowunselected");
			g_eCurrentRow.style.backgroundColor = "#FFFFFF";//"transparent";
		}
		var   eTR = el.parentNode;
	    while(eTR.tagName.toUpperCase() != "TR")
	    {
		    eTR = eTR.parentNode;
	    }
	    eTR.setAttribute("className","rowselected");
	    g_eCurrentRow = eTR;
	    g_eCurrentRow.style.backgroundColor = "#EEF7F9";//"highlight";
	    //g_eCurrentRow.style.color =  "#FFFFFF";//"highlighttext";		
	    processSelectedRow(); 
	}
}
function event_GalTable_onmousemove(e){
    var evt=(window.event)?window.event: e;
    var el = (evt.srcElement)?evt.srcElement:evt.target;	
	document.getElementById("tooltip").style.display = "none";
	
	if(el==null)return;
	
	if (el.tagName != "TH" && el.tagName != "TABLE" && el.tagName != "DIV" && el.tagName != "SPAN")
	{
		while(el.tagName != "TR")
		{
			el = el.parentNode;
			if(el==null)return;
		}
        if(el.jd!=null && el.pn != ""){
			document.getElementById("tooltip").innerText = el.pn;
			document.getElementById("tooltip").style.left = event.clientX + 10;
			document.getElementById("tooltip").style.top = event.clientY + 10;
			document.getElementById("tooltip").style.zIndex = 1;
			document.getElementById("tooltip").style.display = "block";
		}
	}
}
function processSelectedRow(){
	var el = g_eCurrentRow.parentNode;
//	var bDept = true;
	while(el.tagName != "TABLE")
	{
		el = el.parentNode;
	}
	m_iCurrentList = parseInt(el.attributes["name"].value);
	if(m_iCurrentList == 3){
		parent.parent.frames[5].window.getDetailInfo(g_eCurrentRow.attributes["an"].value);
	}
}
function clearContents(iType){
	for (var x=g_eGalTable[iType].rows.length-1; x >= 1; x--)
	{
		g_eGalTable[iType].deleteRow(x);
	}
	g_edivGalTable[iType].style.display = "block";
}

// 2007.07.03 HIW 추가 : 제안시스템에서 사용
function inputSuggValues()
{
	if(m_oParent.hasChildNodes())
	{	    
		var szDN="";
		var szText="";
		var deptid = "" ;
		var szAddrs="";
		var oInput;
		var oNodes = m_oParent.childNodes;
		var oItem = oNodes.nextNode();
		
		
		while(oItem!=null)
		{
			szDN = oItem.selectSingleNode("AN").text.replace(/\x08/g,"&");
			szDN = szDN + ":" + oItem.selectSingleNode("DN").text.replace(/\x08/g,"&");			
			szDN = szDN + ":" + "ENT_CODE" + ":" +oItem.selectSingleNode("ETCD").text.replace(/\x08/g,"&");			
			
			szDN = szDN.replace(/(\\|\[|\])/g,"\\"+"$1");
			szText = oItem.selectSingleNode("DN").text.replace(/\x08/g,"&");
			deptid = oItem.selectSingleNode("AN").text.replace(/\x08/g,"&");
			
			if(m_bSuggest)  //제안에서사용(부서선택) 2008.08.04 by HIW	
			{
			    if(oItem.selectSingleNode("TYPE") != null)
			    {
			        if(oItem.selectSingleNode("TYPE").text.replace(/\x08/g,"&") == "PERSON")
			        {
			            alert("부서선택만 가능합니다");
			            return(true);
			        }
			    }
			    
			    var kind = g_objSuggestKind; 
			    
				//부모창 함수 호출
		        g_objMessage.fnSelDeptProcess(szDN, szText, deptid, kind);
			    
			    return;
			}	
		}
	}
}

// 2007.07.03 HIW 추가 : 제안시스템에서 사용
function member_selected_user_Suggest(oParent)
{	
	if(oParent.hasChildNodes())
	{
		var szDN="";
		var szText="";
		var szAddrs="";
		var strListUserID;
		var strUserID, strUserDisplayName;
		var oInput;
		var oNodes = oParent.childNodes;
		var oItem = oNodes.nextNode();
		var varUserID = new Array();
		var varUserName = new Array();
		var i = 0;
		
		var kind = g_objSuggestKind; 
		var objControl = g_objSuggestListBox;  //리턴결과를 대입할 컨트롤(리스트박스,텍스트박스등..)
	
		switch(kind)
		{
		    case 1 :  //단계별담당자 리스트박스에 추가하기위한 경우
		    {
		        while(oItem!=null)
		        {
			        strUserID = oItem.selectSingleNode("AN").text.replace(/\x08/g,"&");  //사용자ID
			        strUserID = strUserID + "|" + oItem.selectSingleNode("DN").text.replace(/\x08/g,"&");  //사용자명
			        strUserID = strUserID + "|" + oItem.selectSingleNode("RG").text.replace(/\x08/g,"&");  //부서코드
			        strUserID = strUserID + "|" + oItem.selectSingleNode("DP").text.replace(/\x08/g,"&");  //부서명
			        strUserID = strUserID + "|" + oItem.selectSingleNode("PO").text.replace(/\x08/g,"&");  //직위명
			        strUserDisplayName = oItem.selectSingleNode("DP").text.replace(/\x08/g,"&");    //User DeptName  
			        strUserDisplayName = strUserDisplayName + " " + oItem.selectSingleNode("PO").text.replace(/\x08/g,"&");  //User Position
			        strUserDisplayName = strUserDisplayName + " " + oItem.selectSingleNode("DN").text.replace(/\x08/g,"&");  //User Name

			        //strListUserID = g_objMessage.document.frmPersonalACL.listUserID.value;
        		    
		            if (objControl != null) 
		            {
		                if(oItem.selectSingleNode("TYPE") != null)
			            {
		                    if(oItem.selectSingleNode("TYPE").text.replace(/\x08/g,"&") == "UNIT")
			                {
			                    alert("부서는 추가할 수 없습니다");
			                    return(true);
			                }
			            }
			            
			            for (var j=0; j<objControl.options.length; j++) 
			            {
				            if (strUserID == objControl.options[j].value) 
				            {
					            alert("이미 추가된 사용자 입니다.");
					            return(true);
				            }
			            }
			            varUserID[i] = strUserID;
		                varUserName[i] = strUserDisplayName;    
		            }
		            else 
		            {
		                varUserID[i] = strUserID;
		                varUserName[i] = strUserDisplayName;
		            }	
        		    
			        oItem = oNodes.nextNode();
			        i++;
		        }		
        		
		        //부모창의 함수 호출
		        g_objMessage.fnAddUserProcess(varUserID, varUserName, objControl, kind);
		        
		        break;
		    }
		    case 2 :  //평가자 텍스트박스에 대입하기위한 경우
		    {
		        if (oNodes.length > 1) 
		        {
			        alert('한명만 선택하십시요.');
			        return;
		        }		
		        while(oItem != null)
		        {
			        strUserID = oItem.selectSingleNode("AN").text.replace(/\x08/g,"&");  //사용자ID
			        strUserID = strUserID + "|" + oItem.selectSingleNode("DN").text.replace(/\x08/g,"&");  //사용자명
			        strUserID = strUserID + "|" + oItem.selectSingleNode("RG").text.replace(/\x08/g,"&");  //부서코드
			        strUserID = strUserID + "|" + oItem.selectSingleNode("DP").text.replace(/\x08/g,"&");  //부서명
			        strUserID = strUserID + "|" + oItem.selectSingleNode("PO").text.replace(/\x08/g,"&");  //직위명
			        strUserDisplayName = oItem.selectSingleNode("DP").text.replace(/\x08/g,"&");        //User Department
			        strUserDisplayName = strUserDisplayName + " " + oItem.selectSingleNode("PO").text.replace(/\x08/g,"&");  //User Position
			        strUserDisplayName = strUserDisplayName + " " + oItem.selectSingleNode("DN").text.replace(/\x08/g,"&");  //User Name
			        
			        if(oItem.selectSingleNode("TYPE") != null)
			        {
			            if(oItem.selectSingleNode("TYPE").text.replace(/\x08/g,"&") == "UNIT")
		                {
		                    alert("부서는 추가할 수 없습니다");
		                    return(true);
		                }
		            }      
			            
			        varUserID[i] = strUserID;
		            varUserName[i] = strUserDisplayName;
		            
		            oItem = oNodes.nextNode();
		            i++;
		        }
        		
        		g_objMessage.fnAddUserProcess(varUserID, varUserName, objControl, kind);
        		
		        break;
		    }
		}
		
	}
}


//사용자 선택 확인 (2012-12-17 HIW)
function MemberSelectConfirm(oParent) {
    if (oParent.hasChildNodes()) {
        var szDN = "";
        var szText = "";
        var szAddrs = "";
        var strListUserID;
        var strUserInfo = "";
        var oInput;
        var oNodes = oParent.childNodes;
        var oItem = oNodes.nextNode();
        var arrRtnVal = new Array();
        var i = 0;

        var kind = g_objSuggestKind;
        var objControl = g_objSuggestListBox;  //리턴결과를 대입할 컨트롤(리스트박스,텍스트박스등../ 선택한 사용자들이 부모창의 리스트박스등에 중복되지않는지 체크위해)

        switch (g_Kind) {
            case "01":  //관리자화면에서 인장권자 추가시
                {
                    if (oNodes.length > 1) {
                        alert('한명만 선택하십시요.');
                        return;
                    }
                    while (oItem != null) {
                        strUserInfo = "";
                        strUserInfo += oItem.selectSingleNode("AN").text.replace(/\x08/g, "&");  //사용자ID
                        strUserInfo += "|" + oItem.selectSingleNode("DN").text.replace(/\x08/g, "&");  //사용자명
                        strUserInfo += "|" + oItem.selectSingleNode("RG").text.replace(/\x08/g, "&");  //부서코드
                        strUserInfo += "|" + oItem.selectSingleNode("DP").text.replace(/\x08/g, "&");  //부서명
                        strUserInfo += "|" + oItem.selectSingleNode("PO").text.replace(/\x08/g, "&");  //직위명

                        if (oItem.selectSingleNode("TYPE") != null) {
                            if (oItem.selectSingleNode("TYPE").text.replace(/\x08/g, "&") == "UNIT") {
                                alert("부서는 추가할 수 없습니다");
                                return (true);
                            }
                        }

                        arrRtnVal[i] = strUserInfo;

                        oItem = oNodes.nextNode();
                        i++;
                    }

                    g_objMessage.fnAddUserProcess(arrRtnVal, objControl);

                    break;
                }

                
        }

    }
}


