var m_oApvList;
var m_oCCList;
var m_sApvMode;
var m_sSelectedRouteType;
var m_sSelectedUnitType;
var m_sSelectedAllotType;
var m_sSelectedStepRef;
var m_oXSLProcessor;
var m_oHTMLProcessor;
var m_oInfoSrc;
var m_oFormMenu;
var m_oFormEditor;
var m_xmlHTTP=new ActiveXObject("MSXML2.XMLHTTP");
var m_oCurrentOUNode;
var m_bCC;
var l_bGroup;//그룹참조여부
var m_sNAuthTL1 = '000'; //보직없음
var m_sNAuthTL2 = '31'; 
var m_modeless = null;

function initialize(){
	//m_oInfoSrc --> [object]
	m_oInfoSrc = top.opener;	
	
	if(m_oInfoSrc==null){
		m_oInfoSrc = parent.monitorList;
		if(m_oInfoSrc==null){
			if(parent.iworklist.location.href.toUpperCase().indexOf("LISTITEMS.ASPX") > 0) {m_oInfoSrc = parent.iworklist;}
			else{m_oInfoSrc = parent.iworklist.ifrDL;}
		}
		m_sApvMode = getInfo("mode");
		if(m_sApvMode=="READ"){trButton.style.display="none";}
	}else{
		if (top.opener.g_dicFormInfo!=null){	
			//m_sApvMode --> APVLINE
			m_sApvMode = getInfo("mode");		    
			initPrivateLineBtns();
		}else if( top.g_dicFormInfo!=null){
			m_oInfoSrc = top;
			m_sApvMode = getInfo("mode");		    
			initFormLineBtns();
		}else{
			m_oInfoSrc = top.opener.parent;
			m_sApvMode = getInfo("mode");
			initButtons();
		}
	}
	
	//m_oFormMenu --> [object]
	//m_oFormEditor --> [object]
	m_oFormMenu = m_oInfoSrc.menu;
	m_oFormEditor = m_oInfoSrc.editor;
	
	try{
		m_oXSLProcessor = makeProcessor("ApvlineGen.xsl");
		m_oHTMLProcessor = makeProcessor("ApvlineDisplay.xsl");
	}catch(e){alert(e.description);return false;}

	m_oApvList = new ActiveXObject("MSXML2.DOMDocument");
	m_oCCList = new ActiveXObject("MSXML2.DOMDocument");
	m_oCCList.loadXML("<?xml version='1.0' encoding='utf-8'?><cc/>");
	
	if(m_oFormMenu.APVLIST.value==""){		
		m_xmlHTTP.open("GET","getApvSteps.aspx",true);
		m_xmlHTTP.onreadystatechange=initServerValues;
		m_xmlHTTP.send();				
	}else{		
		if(!m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+m_oFormMenu.APVLIST.value)){
			alertParseError(m_oApvList.parseError);			
		}else{		
			initiateCC();
			if (getInfo("loct") == 'APPROVAL' || getInfo("loct") == 'REDRAFT' ){
				if (m_sApvMode == "REDRAFT" || m_sApvMode == "SUBREDRAFT" || m_sApvMode == "RECAPPROVAL"  || m_sApvMode == "SUBAPPROVAL" ){
					if (m_sApvMode == "RECAPPROVAL"  || m_sApvMode == "SUBAPPROVAL" ){
						m_oCurrentOUNode = m_oApvList.documentElement.selectSingleNode("step[@unittype='ou']/ou[taskinfo/@status='pending' and person/@code='" + getInfo("usid")+ "']"); //
					}else{
						m_oCurrentOUNode = m_oApvList.documentElement.selectSingleNode("step[@unittype='ou']/ou[@code='"+getInfo("dpid_apv")+"' and taskinfo/@status='pending']"); //
						if ( m_oCurrentOUNode == null ) {
							m_oCurrentOUNode = m_oCurrentOUNode = m_oApvList.documentElement.selectSingleNode("step[@unittype='ou']/ou[taskinfo/@status='pending']"); //
						}
					}
					try{
						var elmCharge = m_oCurrentOUNode.selectSingleNode("person[taskinfo/@kind='charge']");
						if (elmCharge == null){
							var oChargeNode = getChargeNode();
							if (oChargeNode!=null) m_oCurrentOUNode.appendChild(oChargeNode);
						}
					}catch (e){ alert(e.description); return false;}
				}
			}
			refreshList();
			refreshCC(true);
		}		
	}
	return true;
}
function initiateCC(){	
	var ccList = m_oApvList.selectNodes("steps/ccinfo");
	
	if(ccList.length>0){
		var elm = ccList.nextNode();
		while(elm!=null){
			m_oCCList.documentElement.appendChild(elm.cloneNode(true));
			elm = ccList.nextNode();
		}
	}
}

function initServerValues(){	
	if(m_xmlHTTP.readyState==4){	
		
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=="\r"){
			//alert(m_xmlHTTP.responseText);			
		}else{			
			var errorNode=m_xmlHTTP.responseXML.selectSingleNode("error");
			if(errorNode!=null){
				alert("오류가 발생했습니다. at initServerValues in ApvlineMgr.js\nError Desc:" + errorNode.text);
			}else{
				m_oFormMenu.APVLIST.value = m_xmlHTTP.responseXML.xml;
				//alert(m_oFormMenu.APVLIST.value);
				//m_oFormMenu.APVLIST.value -->				//<?xml version="1.0"?>				//<steps initiatorcode="200208" initiatoroucode="2100" status="inactive"/>
				m_oApvList.loadXML(m_xmlHTTP.responseXML.xml);
				initiateCC();
				refreshList();
				refreshCC(true);
			}
		}
	}
}
function event_noop(){return(false);}
function makeProcessor(urlXsl){
	// XSL 문서를 DOM 객체로 로딩
	var oXslDom = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
	oXslDom.async = false;
	if(!oXslDom.load(urlXsl)){
		alertParseError(oXslDom.parseError);
		throw new Error(-1,"couldn't make TemplateProcessor with ["+urlXsl+"].");
	}
	// XML 문서와 XSL 문서를 병합하여 결과를 저장할 XSLTemplate 객체 생성 
	var oXSLTemplate = new ActiveXObject("MSXML2.XSLTemplate");
	oXSLTemplate.stylesheet = oXslDom;
	// XSLTemplate 프로세서 생성
	return oXSLTemplate.createProcessor();
}
function initButtons(){
	dvCommon.style.display="";
	tblPerson.style.display="";
	btSaveApvLine.style.display="none";
	dvAudit.style.display=(getInfo("scAudt")==1?"":"none"); //감사
	tblReceiptRef.style.display=(getInfo("scDRec")=="1"||getInfo("scChgr")=="1"||getInfo("scChgrOU")=="1"?"":"none");
	try{if(getInfo("fmpf") =="WF_CONFERENCE"){tblDraftRef.style.display="";tblReceiptRef.style.display="none";} }catch(e){}
	m_bCC = true;
	if (getInfo("loct")=="PREAPPROVAL"||getInfo("loct")=="PROCESS"||getInfo("loct")=="COMPLETE"&&m_sApvMode!="REJECT"){
		dvCommon.style.display="none";
		dvAudit.style.display="none";
		m_bCC = false;
	}else{
		switch(m_sApvMode){
			case "APPROVAL":
				tblPConsult.style.display=(getInfo("scPAgr")==1?"":"none");
				tblDConsult.style.display=(getInfo("scDAgr")==1?"":"none");
				tblReceipt.style.display=(getInfo("scDRec")==1?"":"none");
				tblGroup.style.display=(getInfo("scGRec")==1?"":"none");
				tblPAssist.style.display=(getInfo("scPCoo")==1?"":"none"); 
				tblDAssist.style.display=(getInfo("scDCoo")==1?"":"none");
				break;
			case "RECAPPROVAL":
				tblPConsult.style.display=(getInfo("scPAgr")==2?"":"none");//????
				tblDConsult.style.display="none";
				tblReceipt.style.display="none";
				tblGroup.style.display="none";
				tblPAssist.style.display="none";
				tblDAssist.style.display="none";
				break;
			case "SUBAPPROVAL":
				tblPConsult.style.display="none";
				tblDConsult.style.display="none";
				tblReceipt.style.display="none";
				tblGroup.style.display="none";
				tblPAssist.style.display="none";
				tblDAssist.style.display="none";
				break;
			case "CHARGE":
				tblPConsult.style.display="none";
				tblDConsult.style.display="none";
				tblReceipt.style.display="none";
				tblGroup.style.display="none";
				tblPAssist.style.display="none";
				tblDAssist.style.display="none";
				break;
			case "REDRAFT":
				tblPConsult.style.display=(getInfo("scPAgr")==1?"":"none");
				tblDConsult.style.display="none";
				tblReceipt.style.display="none";
				tblGroup.style.display="none";
				tblPAssist.style.display="none";
				tblDAssist.style.display="none";
				tblApplyLine.style.display=""; //개인결재선적용
				break;
			case "SUBREDRAFT":
				tblPConsult.style.display="none";
				tblDConsult.style.display="none";
				tblReceipt.style.display="none";
				tblGroup.style.display="none";
				tblPAssist.style.display="none";
				tblDAssist.style.display="none";
				tblApplyLine.style.display=""; //개인결재선적용
				break;
			case "PCONSULT":
				dvCommon.style.display="none";
				dvAudit.style.display="none";
				//오른쪽 버튼 활성화 막기
				btResetLine.style.display="none";
				btUp.style.display="none";
				btDown.style.display="none";
				btDelete.style.display="none";
				btDeleteCC.style.display="none";
				break;
			case "PROCESS":
				dvCommon.style.display="none";
				dvAudit.style.display="none";
				//오른쪽 버튼 활성화 막기
				btResetLine.style.display="none";
				btUp.style.display="none";
				btDown.style.display="none";
				btDelete.style.display="none";
				btDeleteCC.style.display="none";
				break;
			case "COMPLETE":
				dvCommon.style.display="none";
				dvAudit.style.display="none";
				//오른쪽 버튼 활성화 막기
				btResetLine.style.display="none";
				btUp.style.display="none";
				btDown.style.display="none";
				btDelete.style.display="none";
				btDeleteCC.style.display="none";
				break;
			case "REJECT":
				dvCommon.style.display="none";
				dvAudit.style.display="none";
				//오른쪽 버튼 활성화 막기
				btResetLine.style.display="none";
				btUp.style.display="none";
				btDown.style.display="none";
				btDelete.style.display="none";
				btDeleteCC.style.display="none";
				break;
			case "MONITOR":
				dvCommon.style.display="none";
				dvAudit.style.display="none";
				dvCC.style.display="none";
				break;
			case "PREAPPROVAL":
				dvCommon.style.display="none";
				dvAudit.style.display="none";
				dvCC.style.display="none";
				break;
			case "":
				m_bCC = false;break;
			default:
				tblPConsult.style.display=(getInfo("scPAgr")==1?"":"none");
				tblDConsult.style.display=(getInfo("scDAgr")==1?"":"none");
				tblReceipt.style.display=(getInfo("scDRec")==1?"":"none");
				tblGroup.style.display=(getInfo("scGRec")==1?"":"none");
				tblPAssist.style.display=(getInfo("scPCoo")==1?"":"none");
				tblDAssist.style.display=(getInfo("scDCoo")==1?"":"none");
				tblRecDept.style.display=(getInfo("scIPub")==1?"":"none");
				//배포처 size 키우기
				if (getInfo("scIPub")==1)
				{
					tdccinfo.height = 100;
					tdrecinfo.height = 100;
					chkAction(mType);
				}
				divrecinfo.style.display=(getInfo("scIPub")==1?"":"none");
				tblApplyLine.style.display=""; //개인결재선적용
				btSaveApvLine.style.display="none"; //결재선 저장
				break;
		}
	}
}
function initPrivateLineBtns(){
	dvCommon.style.display="";
	tblPerson.style.display="";
	tblReceipt.style.display="none";
	tblPAssist.style.display="none";
	tblDAssist.style.display="none";
	tblPConsult.style.display="";
	tblDConsult.style.display="none";
	dvAudit.style.display="none";
	dvCC.style.display="none";
	btResetLine.style.display="none";
	btSaveApvLine.style.display="none";
}
function initFormLineBtns(){
	dvCommon.style.display="";
	tblPerson.style.display="";
	tblReceipt.style.display="none";
	tblPAssist.style.display="none";
	tblDAssist.style.display="none";
	tblPConsult.style.display="none";
	tblDConsult.style.display="none";
	dvAudit.style.display="none";
	dvCC.style.display="none";
	btResetLine.style.display="none";
	btSaveApvLine.style.display="none";
}

function getInfo(sKey){try{return m_oInfoSrc.g_dicFormInfo.item(sKey);}catch(e){alert("양식정보에 없는 키값["+sKey+"]입니다.");}}
function alertParseError(err){
	alert("오류가 발생했습니다. in ApvlineMgr.js\ndesc:"+err.reason+"\nsrcurl:"+err.url+"\nsrctxt:"+err.srcText+"\nline:"+err.line+"\tcolumn:"+err.linepos);
}
function deleteSelfAndParent(elmCur,sLimit){
	var elmParent = elmCur.parentNode;
	do{
		var nodeName = elmCur.nodeName;
		if(nodeName=="step" || nodeName==sLimit || elmParent.selectNodes(nodeName).length>1){
		//if(nodeName=="step" || nodeName==sLimit || elmParent.selectNodes(nodeName).length>1 || elmParent.selectNodes("ou").length==1){
			var elmDeleted = elmParent.removeChild(elmCur);
			return elmDeleted;
		}else{
			elmCur = elmParent;
			elmParent = elmCur.parentNode;
		}
	}while(elmParent!=null);
}
function convertSignTypeToAllotType(sSignType){
	var sAllotType;
	switch(sSignType){
		case "일반결재":sAllotType = "";break;
		case "순차합의":sAllotType = "serial";break;
		case "병렬합의":sAllotType = "parallel";break;
	}
	return sAllotType;
}
function convertUserSignTypeToKind(sSignType, bConsult){
    var sKind;
    switch(sSignType){
        case "일반결재":sKind = (bConsult?"consent":"normal");break;
        case "결재안함":sKind = "normal";break;
        case "전결":sKind = "authorize";break;
        case "대결":sKind = "substitute";break;
        case "후결":sKind = "review";break;
        case "사후보고":sKind = "bypass";break;
    }
    return sKind;
}
function interpretSignStatus(sSignStatus, bConsult, bPending, sStatus, sResult){
    switch(sSignStatus){
        case "대기":sStatus = (bPending?"pending":"inactive");sResult = (bPending?"pending":"inactive");break;
        case "결재":sStatus = "completed";sResult = (bConsult?"agreed":"completed");break;
        case "전결":sStatus = "completed";sResult = "authorized";break;
        case "후결":sStatus = "completed";sResult = "reviewed";break;
        case "사후보고":sStatus = "completed";sResult = "bypassed";break;
        case "대결":sStatus = "completed";sResult = "substituted";break;
        case "반려":sStatus = (bConsult?"completed":"rejected");sResult = (bConsult?"disagreed":"rejected");break;        
        case "보류":sStatus = "reserved";sResult = "reserved";break;
    }
}
function interpretType(sType, sUnitType, sRouteType){
	switch(sType){
		case "일반결재":sUnitType = "person";sRouteType = "approve";break;
		case "부서합의":sUnitType = "ou";sRouteType = "consult";break;
		case "개인합의":sUnitType = "person";sRouteType = "consult";break;
		case "수신결재":sUnitType = "ou";sRouteType = "receive";break;
		case "상근감사":sUnitType = "role";sRouteType = "audit";break;
		case "일상감사":sUnitType = "ou";sRouteType = "audit";break;
		case "협조":sUnitType = "ou";sRouteType = "assist";break;
		case "협조":sUnitType = "person";sRouteType = "assist";break;
		case "공람":sUnitType = "ou";sRouteType = "review";break;
		case "통보":sUnitType = "ou";sRouteType = "notify";break;
		default:sUnitType = "person";sRouteType = "approve";break;
	}
}
function getSplitted(src,delim,idx){var aSrc = src.split(delim);return (aSrc.length>idx?aSrc[idx]:"");}
function recalcXPath(orgXPath,elmName,diff){
	var idxbegin;
	var idxend;
	
	if(elmName!="person"){
		idxbegin = orgXPath.indexOf(elmName)+elmName.length+1;
		idxend = orgXPath.indexOf("]",idxbegin);
	}else{
		idxbegin = orgXPath.indexOf(elmName)+elmName.length+7;
		idxend = orgXPath.indexOf("]",idxbegin)
	}
	
	var prefix = orgXPath.substr(0,idxbegin);
	var suffix = orgXPath.substr(idxend);
			
	var idx = (diff==0?0:parseInt(orgXPath.substring(idxbegin,idxend))+diff);
	if(idx<0)idx=0;
	return prefix+idx+suffix;
}
function getFamilyAttribute(elmCur,sTargetNode,sAttrName){
	var elmParent = elmCur;
	while(elmParent!=null){
		if(elmParent.nodeName==sTargetNode){
			return elmParent.getAttribute(sAttrName);
		}
		elmParent = elmParent.parentNode;
	}
	return null;
}
function getSibling(elmCur,sLevel,sKeyName,sKeyValue,bNext,bIgnoreCurrentLevel){
	var elmLevelCur = elmCur;
	var elmChildPath;
	bIgnoreCurrentLevel=(bIgnoreCurrentLevel==null?false:bIgnoreCurrentLevel);
	while(elmLevelCur!=null){
		if(elmLevelCur.nodeName==sLevel){
			var elmSiblingNext = (bNext?elmLevelCur.nextSibling:elmLevelCur.previousSibling);
			while(elmSiblingNext!=null){
				if(sKeyName==null || elmSiblingNext.getAttribute(sKeyName)==sKeyValue){
					var elmNext = ((!bIgnoreCurrentLevel)&&elmChildPath!=null?elmSiblingNext.selectSingleNode(elmChildPath):elmSiblingNext);
					return elmNext;
				}
				elmSiblingNext = (bNext?elmSiblingNext.nextSibling:elmSiblingNext.previousSibling);
			}
			break;
		}
		var sCurNodeName = (
			elmLevelCur.nodeName=="person" || elmLevelCur.nodeName=="role" ? 
			"(person|role)" :
			elmLevelCur.nodeName);
		elmChildPath = sCurNodeName+(elmChildPath!=null?"/"+elmChildPath:"");
		elmLevelCur = elmLevelCur.parentNode;
	}
	return null;
}
function getNextElm(elmCur){
	var sRouteType = getFamilyAttribute(elmCur,"step","routetype");
	var sUnitType = getFamilyAttribute(elmCur,"step","unittype");
	var sCurUnitType = elmCur.nodeName;
	var sLevel,sKeyAttribute,sKeyValue;
	switch(sRouteType){
		case "approve" :
			sLevel="step";
			sKeyAttribute="routetype";
			sKeyValue=sRouteType;
			break;
		case "assist" :
		case "receive" :
		case "consult" :
		default:
			sLevel=sCurUnitType;
			sKeyAttribute=null;
			sKeyValue=null;
			sAdopteeLevel="person";
			sAdopteeNodeName="role";
			break;
	}
	var elmNext = getSibling(elmCur,sLevel,sKeyAttribute,sKeyValue,true,false);
	return elmNext;
}

//openGal(       "수신결재",  "일반결재",   "수신",         "일반결재",   "대기",false,false,true,false,false,false);
function openGal(sCatSignType,sDeptSignType,sDeptSignStatus,sUserSignType,sUserSignStatus,bMail,bUser,bGroup,bRef,bIns,bRecp,sAddageKey,sAddage,bCCGroup){
	var bOpen = false;
	if ( m_modeless == null ){
		bOpen = true;
	}else{
		try{
			if ( m_modeless.src != '' )	m_modeless.close();
		    	bOpen = true;
		}catch (e){bOpen = true;}
	}
	if (bOpen){	
	var rgParams=null;
	rgParams=new Array();
	rgParams["bMail"]  = bMail;
	rgParams["bUser"] = bUser;
	rgParams["bGroup"] = bGroup;
	rgParams["bRef"] = bRef;
	rgParams["bIns"] = bIns; 
	rgParams["bRecp"] = bRecp; 
	rgParams["bCCGroup"] = bCCGroup; //참조자그룹
	rgParams["sCatSignType"] = sCatSignType; 
	rgParams["sDeptSignType"] = sDeptSignType;
	rgParams["sDeptSignStatus"] = sDeptSignStatus; 
	rgParams["sUserSignType"] = sUserSignType;
	rgParams["sUserSignStatus"] = sUserSignStatus; 
	if(sAddageKey!=null&&sAddage!=null)rgParams[sAddageKey]=sAddage;
	rgParams["objMessage"] = window;

	var szFont = "FONT-FAMILY: '굴림';font-size:9px;";
	var nWidth = 630;
	var nHeight = 550;
	var vRetval = window.showModelessDialog("../address/address.htm", rgParams, szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;help:no;");
	m_modeless = vRetval;
	}
}
function deletePerson(){	
	var stepLength = m_oApvList.documentElement.selectNodes("step").length;
	var oSelTR = Apvlist.getSelectedRow();
	var xpathCur;
	//if((oSelTR!=null)&&(m_oApvList.documentElement.selectNodes("step").length>1)){
	if(oSelTR!=null){
		xpathCur = oSelTR.id;		
		var elm = m_oApvList.documentElement.selectSingleNode(xpathCur);
		if(elm.selectSingleNode("taskinfo[@datereceived and @datereceived!='']")!=null){
			alert("기안자이거나 이미 수신받은 결재자는 삭제할 수 없습니다.");
			return;
		}
		if (elm.selectSingleNode("taskinfo").getAttribute("kind")=="substitute"||elm.selectSingleNode("taskinfo").getAttribute("kind")=="bypass"){
			alert("선택된 결재자의 결재종류는 일반결재이어야 삭제할 수 있습니다.");
			return;
		}
		if (elm.selectSingleNode("taskinfo").getAttribute("status")=="inactive" && elm.parentNode.parentNode.getAttribute("routetype")=="approve" && elm.parentNode.parentNode.getAttribute("unittype")=="person" && (m_sApvMode == "SUBREDRAFT" ||m_sApvMode == "SUBAPPROVAL"  ) ){
			alert("부서합의 경우 일반 결재자 삭제를 할 수 없습니다.");
			return;
		}
		var elmDeleted = deleteSelfAndParent(elm,"step");
		var sPrevElmXPath = recalcXPath(xpathCur,elmDeleted.nodeName,-1);
		if(stepLength == 1){
			refreshList();
		}else if(m_oApvList.documentElement.selectSingleNode(sPrevElmXPath+"//taskinfo").getAttribute("datereceived")!=null){
			refreshList();
		}else{
			refreshList(sPrevElmXPath);
		}
	}   
}
function addPerson(){	
	if(m_oApvList.selectSingleNode("steps/step[@routetype='approve']/ou/(person|role)/taskinfo[@kind='authorize']")!=null){
		alert("전결자가 지정되어있는 경우에는 결재자를 추가할 수 없습니다.\n전결자를 일반결재 상태로 변경하신 후에 다시 추가하십시오.");
		return false;
	}
	m_sSelectedRouteType="approve";
	m_sSelectedUnitType="person";
	m_sSelectedAllotType="";
	m_sSelectedStepRef="일반결재";
	l_bGroup = false;
	//openGal("일반결재","일반결재","수신","일반결재","대기",false,true,false,false,false,false);
	insertToList(switchParentNode(3));
}
function addRecPerson(){
	if(m_oApvList.selectSingleNode("steps/step[@routetype='receive']/ou/(person|role)/taskinfo[@kind='authorize']")!=null){
		alert("전결자가 지정되어있는 경우에는 결재자를 추가할 수 없습니다.\n전결자를 일반결재 상태로 변경하신 후에 다시 추가하십시오.");
		return false;
	}
	m_sSelectedRouteType="receive";
	m_sSelectedUnitType="person";
	m_sSelectedAllotType="";
	m_sSelectedStepRef="수신결재";
	l_bGroup = false;
	//openGal("일반결재","수신결재","수신","일반결재","대기",false,true,false,false,false,false);
	insertToList(switchParentNode(3));
}
function addReceiptPerson(){
	if(m_oApvList.selectSingleNode("steps/step[@routetype='receive']/ou/(person|role)/taskinfo[@kind='authorize']")!=null){
		alert("전결자가 지정되어있는 경우에는 결재자를 추가할 수 없습니다.\n전결자를 일반결재 상태로 변경하신 후에 다시 추가하십시오.");
		return false;
	}
	m_sSelectedRouteType="approve";
	m_sSelectedUnitType="person";
	m_sSelectedAllotType="";
	m_sSelectedStepRef="일반결재";
	l_bGroup = false;
	//openGal("일반결재","일반결재","수신","일반결재","대기",false,true,false,false,false,false);
	insertToList(switchParentNode(3));
}
function addSubPerson(){
	m_sSelectedRouteType="assist";
	m_sSelectedUnitType="person";
	m_sSelectedAllotType="";
	m_sSelectedStepRef="수신결재";
	l_bGroup = false;
	//openGal("일반결재","수신결재","수신","일반결재","대기",false,true,false,false,false,false);
	insertToList(switchParentNode(3));
}
function addChargePerson(){
	m_sSelectedRouteType="approve";
	m_sSelectedUnitType="role";
	m_sSelectedAllotType="";
	m_sSelectedStepRef="담당결재";
	l_bGroup = false;
	//openGal("일반결재","담당결재","담당","일반결재","대기",false,true,false,false,false,false);
	insertToList(switchParentNode(3));
}
function addPConsult(){
	m_sSelectedRouteType="consult";
	m_sSelectedUnitType="person";
	m_sSelectedAllotType="parallel";
	m_sSelectedStepRef="개인합의";
	l_bGroup = false;
	//openGal("개인합의","병렬합의","수신","일반결재","대기",false,true,false,false,false,false);
	insertToList(switchParentNode(3));
}
function addReceipt(){
	m_sSelectedRouteType="receive";
	m_sSelectedUnitType="ou";
	m_sSelectedAllotType="";
	m_sSelectedStepRef="담당부서수신";
	l_bGroup = false;
	//openGal("수신결재","일반결재","수신","일반결재","대기",false,false,true,false,false,false,"","",l_bGroup);
	insertToList(switchParentNode(4));
}
function addGroup(){
	m_sSelectedRouteType="receive";
	m_sSelectedUnitType="group";
	m_sSelectedAllotType="";
	m_sSelectedStepRef="배포목록수신";
	l_bGroup = true;
	m_sSelectedUnitType="group";
	//sAddage=(l_bGroup)?reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/role")):reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/ou/person"));
	//openGal("수신결재","일반결재","수신","일반결재","대기",false,false,true,false,false,false,"","",l_bGroup);
}
function addDConsult(){
	m_sSelectedRouteType="consult";
	m_sSelectedUnitType="ou";
	m_sSelectedAllotType="parallel";
	m_sSelectedStepRef="부서합의";
	l_bGroup = false;
	//openGal("부서합의","병렬합의","수신","일반결재","대기",false,false,true,false,false,false);
	insertToList(switchParentNode(4));
}
function addDAssist(){
	m_sSelectedRouteType="assist";
	m_sSelectedUnitType="ou";
	m_sSelectedAllotType="parallel";
	m_sSelectedStepRef="협조처";
	l_bGroup = false;
	//openGal("수신결재","일반결재","수신","일반결재","대기",false,false,false,false,false,true);
	insertToList(switchParentNode(4));
}
function addPAssist(){//개인순차협조
	m_sSelectedRouteType="assist";
	m_sSelectedUnitType="person";
	m_sSelectedAllotType="serial";
	m_sSelectedStepRef="협조자";
	l_bGroup = false;
	//openGal("일반결재","일반결재","수신","일반결재","대기",false,true,false,false,false,false);
	//openGal("수신결재","일반결재","수신","일반결재","대기",false,false,false,false,false,true);
	insertToList(switchParentNode(3));
}
function setCC(allottype){
	m_sSelectedRouteType="ccinfo";
	m_sSelectedUnitType="person";
	m_sSelectedAllotType=allottype;
	m_sSelectedStepRef="참조자";
	var sAddage;//=reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/ou/person"));
	//l_bGroup = confirm("그룹참조를 지정하시겠습니까?\n현재 지정된 일반 참조자들은 삭제됩니다.!!!");
	l_bGroup = false;
	//m_sSelectedUnitType=(l_bGroup)?"role":"person";

	//if (allottype == "receiver"){		//for(var i=0; i < rdoRecCC.length; i++){	if (rdoRecCC[i].checked)	 m_sSelectedUnitType = rdoRecCC[i].value;		}
	//	 m_sSelectedUnitType = rdoRecCC.value;	
	//}
	//sAddage=(l_bGroup)?reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/role")):reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/ou/person"));

	for(var i=0; i < radioCC.length;i++){
		if (radioCC[i].checked)
		{
			m_sSelectedUnitType = radioCC[i].value;	
		}
	}
	/*
	switch (m_sSelectedUnitType)	{
	case "person": sAddage = reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/ou/person"));
		openGal("참조자","일반결재","수신","일반결재","대기",false,false,false,true,false,false,"sUser",sAddage,l_bGroup);	break;
	case "ou":sAddage = reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/ou[not(person)]"));
		openGal("참조자","일반결재",            "수신",               "일반결재",         "대기",               false, false, true,      false,false,false,"sGroup",sAddage,l_bGroup,true);	break;
	case "group":sAddage = reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/group"));
		openGal("참조자","일반결재","수신","일반결재","대기",false,false,true,false,false,false,"sGroup",sAddage,true);	break;
	}
	*/
	switch (m_sSelectedUnitType)	{
	case "person": insertToList(switchParentNode(3));	break;
	case "ou":insertToList(switchParentNode(4));	break;
	case "group":insertToList(switchParentNode(4));	break;
	}
	/*
	m_sSelectedRouteType="ccinfo";
	//m_sSelectedUnitType="person";
	m_sSelectedAllotType=allottype;
	m_sSelectedStepRef="참조자";
	//var sAddage=reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/ou/person"));
	var sAddage;
	//l_bGroup = confirm("그룹참조를 지정하시겠습니까?\n현재 지정된 일반 참조자들은 삭제됩니다.!!!");
	l_bGroup = false;

	m_sSelectedUnitType=(l_bGroup)?"role":"person";
	//sAddage=(l_bGroup)?reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/role")):reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/ou/person"));
	//openGal("참조자","일반결재","수신","일반결재","대기",false,false,false,true,false,false,"sUser",sAddage,l_bGroup);
	insertToList(switchParentNode(3));
	*/
}
function reverseItems(oNodeList){
	if(oNodeList.length>0){
		var sList="";
		for(var i=0;i<oNodeList.length;i++){
			var oPNode=oNodeList[i];
			if (l_bGroup){
				sList+="<item tl=\""+""+"\" po=\""+""+"\" lv=\""+""+"\"><DN>"+oPNode.getAttribute("name")+"</DN><DO>"+oPNode.getAttribute("name")+"</DO><JD/><LN/><FN/><TL>"+""+"</TL><PO>"+""+"</PO><LV>"+""+"</LV><AN>"+oPNode.getAttribute("code")+"</AN><PI/><CP/><DP>"+oPNode.getAttribute("name")+"</DP><RGNM>"+oPNode.getAttribute("name")+"</RGNM><OF/><CY/><EM/><SO/><SG>"+""+"</SG><RG>"+oPNode.getAttribute("code")+"</RG></item>";
			}else{
				sList+="<item tl=\""+oPNode.getAttribute("title")+"\" po=\""+oPNode.getAttribute("position")+"\" lv=\""+oPNode.getAttribute("level")+"\"><DN>"+oPNode.getAttribute("name")+"</DN><DO>"+oPNode.getAttribute("name")+"</DO><JD/><LN/><FN/><TL>"+oPNode.getAttribute("title").split(";")[1]+"</TL><PO>"+oPNode.getAttribute("position").split(";")[1]+"</PO><LV>"+oPNode.getAttribute("level").split(";")[1]+"</LV><AN>"+oPNode.getAttribute("code")+"</AN><PI/><CP/><DP>"+oPNode.getAttribute("ouname")+"</DP><RGNM>"+oPNode.getAttribute("ouname")+"</RGNM><OF/><CY/><EM/><SO/><SG>"+oPNode.getAttribute("oucode")+"</SG><RG>"+oPNode.getAttribute("oucode")+"</RG></item>";				
			}
		}		
		return sList;
	}
}
function deleteCC(){
	var stepLength = m_oApvList.documentElement.selectNodes("step").length;
	var oSelTR = this.getSelectedRow();
	var xpathCur;
	if(oSelTR!=null){
		xpathCur = oSelTR.id;		
		var elm = m_oApvList.documentElement.selectSingleNode(xpathCur);
		var elmDeleted = deleteSelfAndParent(elm,"ccinfo");
		var sPrevElmXPath = recalcXPath(xpathCur,elmDeleted.nodeName,-1);
		refreshCC();
	}   
}
function addRecDept(){
	m_sSelectedRouteType="dist";
	m_sSelectedUnitType="ou";
	m_sSelectedAllotType="parallel";
	m_sSelectedStepRef="부서배포";
	l_bGroup = false;
	if(mType==0){
		insertToList(switchParentNode(4));
	}else{
		insertToList(switchParentNode(3));
	}
}

//oList --> 조직도 화면에서 리턴값으로 넘어온 xml 데이타
function insertToList(oList){
	m_modeless = null;
	var xpathNew="";
	var oSrcDoc = new ActiveXObject("MSXML2.DOMDocument");
	var oSelTR = Apvlist.getSelectedRow();
	if(!oSrcDoc.loadXML(oList.xml)){
		//alert(oSrcDoc.parseError);
		alertParseError(oSrcDoc.parseError);
		return;
	}
	
	//배포처 처리 2005.08 황선희
	if (m_sSelectedRouteType == 'dist'){
		setDistDept(oList);
	}else{
		/*
		//결재선에 중복 사용자 삽입 방지 2005.07 황선희
		if (m_sSelectedUnitType != "ou" &&  m_sApvMode != "SUBREDRAFT" )
		{
			m_oXSLProcessor.input = chkDuplicateApprover(oSrcDoc);
		}else{
			m_oXSLProcessor.input = oSrcDoc;
		}
		*/

		//개인 합의는 부서장만 선택한다. 2005.11 황선희
		//일반결재는 개인만 선택한다. 2005.11 황선희
		if ( m_sSelectedRouteType == "consult"){oSrcDoc = chkManagerConsult(oSrcDoc);}
		if ( m_sSelectedRouteType == "approve" ||  m_sSelectedRouteType == "receive" ){oSrcDoc = chkManagerApprove(oSrcDoc);}
		if ( oSrcDoc.selectNodes("//item").length == 0) {
			return;
		}
		m_oXSLProcessor.input = oSrcDoc;

		try { 
			//맨 처음 elmRoot --> <steps initiatorcode=\"200208\" initiatoroucode=\"2100\" status=\"inactive\"/>	
			var elmRoot = m_oApvList.documentElement;
			var bSeparate = false;
			var sSeparateLevel = "step/ou";
			var elmTarget = null;
			var sVisible = null;
			var refreshTarget = refreshList;
			//alert("m_sSelectedRouteType: " + m_sSelectedRouteType +" m_sApvMode : "+ m_sApvMode);
			switch(m_sSelectedRouteType){
				case "ccinfo":	oSelTR=null;sVisible="";bSeparate=true;refreshTarget=refreshCC;elmTarget=elmRoot;
					//var elmcc=elmRoot.selectSingleNode("ccinfo[@belongto='"+m_sSelectedAllotType+"']");
					//if(elmcc!=null)elmRoot.removeChild(elmcc);
					break;
				case "consult":	if(sVisible==null)sVisible="";
					//elmTarget=elmRoot.selectSingleNode("step[@routetype='"+m_sSelectedRouteType+"' and @unittype='"+m_sSelectedUnitType+"']");
					//if(elmTarget==null){
						elmTarget=elmRoot;bSeparate=true;
					//}else{
					//	bSeparate=false;
					//}
					break;
				case "receive":	if(sVisible==null)sVisible="";
				case "assist":	if(sVisible==null)sVisible="";
				case "review":	if(sVisible==null)sVisible="n";
				case "notify":	if(sVisible==null)sVisible="n";
					elmTarget=elmRoot.selectSingleNode("step[@routetype='"+m_sSelectedRouteType+"' and @unittype='"+m_sSelectedUnitType+"']");
					if(elmTarget==null){
						elmTarget=elmRoot;bSeparate=true;
					}else{
						bSeparate=false;
					}
					break;
				case "audit":	if(sVisible==null)sVisible="";
					elmTarget=elmRoot;bSeparate=true;
					break;
				case "approve":	if(sVisible==null)sVisible="";
				default:		if(sVisible==null)sVisible="";
					if(m_sApvMode=="REDRAFT"||m_sApvMode=="SUBREDRAFT" ||m_sApvMode=="RECAPPROVAL"  ||m_sApvMode=="SUBAPPROVAL"){
						elmTarget=m_oCurrentOUNode;bSeparate=false;sSeparateLevel="step/ou/person"
					}else{
						elmTarget=elmRoot;bSeparate=true;
					}
					break;
			}
			
			m_oXSLProcessor.addParameter("unittype", m_sSelectedUnitType);
			m_oXSLProcessor.addParameter("routetype", m_sSelectedRouteType);
			m_oXSLProcessor.addParameter("allottype", m_sSelectedAllotType);
			m_oXSLProcessor.addParameter("referencename", m_sSelectedStepRef);
			m_oXSLProcessor.addParameter("childvisible", sVisible);
			m_oXSLProcessor.transform();
			var oTargetDoc = new ActiveXObject("MSXML2.DOMDocument");
			oTargetDoc.loadXML(m_oXSLProcessor.output);
			var oChildren = (bSeparate?oTargetDoc.documentElement.childNodes:oTargetDoc.documentElement.selectNodes(sSeparateLevel));
			var elm = oChildren.nextNode();		
			var xpathCur;
			var oSelectedElm;
			//alert(m_sSelectedUnitType+'--'+m_sSelectedRouteType +'---'+oTargetDoc.xml);
			
			while(elm!=null){
				elmTarget.appendChild(elm.cloneNode(true));
				elm = oChildren.nextNode();
			}
			refreshTarget();
		}catch(e){
			alert("오류가 발생했습니다. at insertToList in ApvlineMgr.js\nError Desc:" + e.description);
		}
	}
    return;
}
function refreshList(selectedRowId){
	Apvlist.clearSelection();
	Apvlist.document.body.innerHTML = "";
	try { 
		//alert(m_oApvList.xml); //저장될 xml
   		m_oHTMLProcessor.input = m_oApvList; 
   		   		
		if (getInfo("loct")=="PREAPPROVAL"||getInfo("loct")=="PROCESS"||getInfo("loct")=="COMPLETE"){
			m_oHTMLProcessor.addParameter("viewtype", "read");
		}else{
			switch(m_sApvMode){
				case "DRAFT":
				case "TEMPSAVE":
					m_oHTMLProcessor.addParameter("viewtype", "create");
					break;
				case "REDRAFT":
					m_oHTMLProcessor.addParameter("viewtype", "change");
					break;
				case "SUBREDRAFT":
					m_oHTMLProcessor.addParameter("viewtype", "change");
					m_oHTMLProcessor.addParameter("currentroutetype", "consult");
					break;
				case "APVLINE":
					m_oHTMLProcessor.addParameter("viewtype", "create");
					break;
				case "APPROVAL":
					m_oHTMLProcessor.addParameter("viewtype", "change");
					break;
				case "SUBAPPROVAL":
					m_oHTMLProcessor.addParameter("viewtype", "change");
					m_oHTMLProcessor.addParameter("currentroutetype", "consult");
					break;
				case "RECAPPROVAL":
					m_oHTMLProcessor.addParameter("viewtype", "change");
					break;
				case "CHARGE":
					m_oHTMLProcessor.addParameter("viewtype", "change");
					break;
				default:
					m_oHTMLProcessor.addParameter("viewtype", "read");
					break;
			}
		}
		m_oHTMLProcessor.transform();
		
		Apvlist.document.body.innerHTML = m_oHTMLProcessor.output;
		if(selectedRowId!=null)Apvlist.selectRow(selectedRowId);

		//debugging info
		if(m_oFormMenu.APVLISTTABLE!=null)m_oFormMenu.APVLISTTABLE.value=Apvlist.document.body.innerHTML;

	}catch(e){
		alert("오류가 발생했습니다. at refreshList in ApvlineMgr.js\nError Desc:" + e.description);
	}
}
function refreshCC(bAll){
	var sPath = "";
	bAll = true;
	if(bAll==null || bAll==false)sPath="[@belongto='" + m_sSelectedAllotType + "']";
	var ccInfos = m_oApvList.selectNodes("steps/ccinfo"+sPath);
	var otblccinfo = document.all["tblccinfo"];
	var tbllength = otblccinfo.rows.length;
	//Table 지우기
	for(var i=0;i<tbllength-2;i++){
		otblccinfo.deleteRow();
	}
	var eTR, eTD;
	for(var i=0;i<ccInfos.length;i++){
		var sList = "";
		var ccInfo = ccInfos[i];
		var sBelongTo = ccInfo.getAttribute("belongto");
		var ccList = ccInfo.childNodes;
		for(var j=0 ; j < ccList.length; j++){
			var cc = ccList.nextNode();
			if(cc.hasChildNodes())cc=cc.firstChild;

			eTR = tblccinfo.insertRow();
			//eTR.attachEvent("onmouseover",overM);
			//eTR.attachEvent("onmouseout",outM);
			if(cc.nodeName == "person"){
				eTR.setAttribute("id","ccinfo["+i+"]/*["+j+"]/(person|role)[0]");
				eTR.attachEvent("onmousedown", selectCCRow);
				eTR.align= "center";
				eTD = eTR.insertCell(); eTD.innerHTML = cc.getAttribute("name"); eTD.height=20;
				eTD = eTR.insertCell(); eTD.innerHTML = getSplitted(cc.getAttribute("title"),";",1);
				eTD = eTR.insertCell(); eTD.innerHTML = getSplitted(cc.getAttribute("level"),";",1);
				eTD = eTR.insertCell(); eTD.innerHTML = (sBelongTo=="sender")?"발신":((sBelongTo=="global")?"전역":"수신");
				eTD = eTR.insertCell(); eTD.innerHTML = cc.getAttribute("ouname");
			}else if(cc.nodeName == "ou"){
				eTR.setAttribute("id","ccinfo["+i+"]/*["+j+"]");
				eTR.attachEvent("onmousedown", selectCCRow);
				eTR.align= "center";
				eTD = eTR.insertCell(); eTD.innerHTML = "&nbsp;"; eTD.height=20;
				eTD = eTR.insertCell(); eTD.innerHTML = "&nbsp;";
				eTD = eTR.insertCell(); eTD.innerHTML = "&nbsp;";
				eTD = eTR.insertCell(); eTD.innerHTML = (sBelongTo=="sender")?"발신":((sBelongTo=="global")?"전역":"수신");
				eTD = eTR.insertCell(); eTD.innerHTML = cc.getAttribute("name");
			}else if(cc.nodeName == "group"){
				eTR.setAttribute("id","ccinfo["+i+"]/*["+j+"]");
				eTR.attachEvent("onmousedown", selectCCRow);
				eTR.align= "center";
				eTD = eTR.insertCell(); eTD.innerHTML = "&nbsp;"; eTD.height=20;
				eTD = eTR.insertCell(); eTD.innerHTML = "&nbsp;";
				eTD = eTR.insertCell(); eTD.innerHTML = "&nbsp;";
				eTD = eTR.insertCell(); eTD.innerHTML = (sBelongTo=="sender")?"발신":((sBelongTo=="global")?"전역":"수신");
				eTD = eTR.insertCell(); eTD.innerHTML = cc.getAttribute("name");
			}

			eTR = tblccinfo.insertRow();
			eTD = eTR.insertCell();			eTD.height =1;			eTD.colSpan = 5;			eTD.className = "table_line";

		}
		/*
		while(cc!=null){
			var cc = ccList.nextNode();
			if(cc.hasChildNodes())cc=cc.firstChild;
			sList+=(sList.length>0?";":"")+cc.getAttribute("ouname")+" "+getSplitted(cc.getAttribute("title"),";",1)+" "+cc.getAttribute("name");
			cc = ccList.nextNode();
		}
		switch(sBelongTo){
			case "global":txtCC.innerHTML=sList;break;
			case "sender":txtSendCC.innerHTML=sList;break;
			case "receiver":txtRecCC.innerHTML=sList;break;
		}
		*/
	}
}
function moveUpDown(str){
	var oSelTR = Apvlist.getSelectedRow();
	if(oSelTR==null)return;
	try{
		var elmRoot = m_oApvList.documentElement;
		var xpathCur = oSelTR.id;
		var elmCur = elmRoot.selectSingleNode(xpathCur);

		if(elmCur==null)return;

		var elmParent = elmCur;
		var xpathNew;
		var sRouteType = getFamilyAttribute(elmCur,"step","routetype");
		var sUnitType = getFamilyAttribute(elmCur,"step","unittype");
		var elmTaskInfo;
		if(elmCur.nodeName=="person"){
			elmTaskInfo = elmCur.selectSingleNode("taskinfo");
		}

		switch (str){
			case "UP" :
				var elmNext=null;
				do{
					elmCur = elmParent;
					elmNext = elmCur.nextSibling;
					while(elmNext!=null && elmNext.nodeName!=elmCur.nodeName){
						elmNext=elmNext.nextSibling;
					}
					elmParent = elmCur.parentNode;
				}while(elmParent.nodeName!="steps" && elmNext==null);
				if(elmNext==null){
					return;
				}else{

					if(elmTaskInfo!=null){
						if(getFamilyAttribute(elmNext,"step","routetype")==sRouteType
							&&getFamilyAttribute(elmNext,"step","unittype")==sUnitType){
						
							if(elmTaskInfo.getAttribute("kind")!="normal"&&elmNext.nodeName!="ou"){
								alert("순서를 바꿀 수 없습니다. 선택된 결재자의 결재종류는 일반결재이어야 합니다.");
								return;
							}
							if(elmNext.nodeName=="person"
								||(sRouteType=="approve"&&sUnitType=="person")){
								
								elmTaskInfo = elmNext.selectSingleNode(".//taskinfo");
								if(elmTaskInfo.getAttribute("kind")!="normal"){
									alert("순서를 바꿀 수 없습니다. 다음 결재자의 결재종류는 일반결재이어야 합니다.");
									return;
								}
							}
						}
						if(!(sRouteType=="receive"&&sUnitType=="ou")
							&&getFamilyAttribute(elmNext,"step","routetype")=="approve"
							&&getFamilyAttribute(elmNext,"step","unittype")=="person"){
								elmTaskInfo = elmNext.selectSingleNode(".//taskinfo");
								if(elmTaskInfo.getAttribute("kind")=="authorize"){
									alert("순서를 바꿀 수 없습니다. 다음 결재자의 결재종류는 전결입니다.");
									return;
								}
						}
					}
					switch (sRouteType){
						case "assist" :
						case "receive" :
						case "consult" :
							if(elmNext.nodeName=="step"	//Step 전체
								&&elmNext.getAttribute("routetype")==sRouteType	//겹치는 대상이 동일한 RouteType
								&&elmNext.getAttribute("unittype")==sUnitType){	//동일한 UnitType(부서/개인)
								
								var oChildren = elmCur.selectNodes("ou");
								var elm = oChildren.nextNode();
								while(elm!=null){
									elmNext.appendChild(elm);
									elm = oChildren.nextNode();
								}
								elmParent.removeChild(elmCur);
								xpathNew=recalcXPath(xpathCur,"ou",0);
							}else{
								elmParent.insertBefore(elmNext,elmCur);
								xpathNew=recalcXPath(xpathCur,elmCur.nodeName,1);
							}
							break;
						case "approve" :
						default:
							elmParent.insertBefore(elmNext,elmCur);
							xpathNew=recalcXPath(xpathCur,elmCur.nodeName,1);
							break;
					}
				}				
				break;

			case "DOWN" :
				var elmPrev=null;
				do{
					elmCur = elmParent;
					elmPrev = elmCur.previousSibling;
					while(elmPrev!=null && elmPrev.nodeName!=elmCur.nodeName){
						elmPrev=elmPrev.previousSibling;
					}
					elmParent = elmCur.parentNode;
				}while(elmParent.nodeName!="steps" && elmPrev==null);
				if(elmPrev==null){
					return;
				}else{
					if(elmPrev.nodeName=="step")elmTaskInfo = elmPrev.selectSingleNode("ou/person/taskinfo");
					if(elmTaskInfo!=null){
						
						if(elmTaskInfo.getAttribute("datereceived")!=null){
							alert("순서를 바꿀 수 없습니다. 이전 결재자가 기안자이거나 이미 결재문서를 받았습니다.");
							return;
						}
						if(getFamilyAttribute(elmPrev,"step","routetype")==sRouteType
							&&getFamilyAttribute(elmPrev,"step","unittype")==sUnitType){
					
							if(elmTaskInfo.getAttribute("kind")!="normal"&&elmPrev.nodeName!="ou"){
								alert("순서를 바꿀 수 없습니다. 선택된 결재자의 결재종류는 일반결재이어야 합니다.");
								return;
							}
							
							if(elmPrev.nodeName=="person"
								||(sRouteType=="approve"&&sUnitType=="person")){
								
								elmTaskInfo = elmPrev.selectSingleNode(".//taskinfo");
								if(elmTaskInfo.getAttribute("kind")!="normal"){
									alert("순서를 바꿀 수 없습니다. 이전 결재자의 결재종류는 일반결재이어야 합니다.");
									return;
								}
							}
						}
					}
					switch (sRouteType){
						case "assist" :
						case "receive" :
						case "consult" :
							if(elmPrev.nodeName=="step"	//Step 전체
								&&elmPrev.getAttribute("routetype")==sRouteType	//겹치는 대상이 동일 RouteType
								&&elmPrev.getAttribute("unittype")==elmCur.getAttribute("unittype")){	//동일한 Unittype(부서/개인)
								
								var oChildren = elmCur.selectNodes("ou");
								var elm = oChildren.nextNode();
								while(elm!=null){
									elmPrev.appendChild(elm);
									elm = oChildren.nextNode();
								}
								elmParent.removeChild(elmCur);
								xpathNew=recalcXPath(xpathCur,elmCur.nodeName,-1);
							}else{
								elmParent.insertBefore(elmCur,elmPrev);
								xpathNew=recalcXPath(xpathCur,elmCur.nodeName,-1);
							}
							break;
						case "approve" :
						default:
							elmParent.insertBefore(elmCur,elmPrev);
							xpathNew=recalcXPath(xpathCur,elmCur.nodeName,-1);
							break;
					}
				}
				break;
		}
		refreshList(xpathNew);
	}catch(e){
		alert("오류가 발생했습니다. at moveUpDown in ApvlineMgr.js\nError Desc:" + e.description);
	}       
}
function statusChange(){
	var bSetDirty=false;
	var oSelTR = Apvlist.getPatentRow();
	var xpathCur = oSelTR.id;

	var elmRoot = m_oApvList.documentElement;
	var elmCur = elmRoot.selectSingleNode(xpathCur);
	var elmTaskInfo = elmCur.selectSingleNode("taskinfo");

	var sRouteType = getFamilyAttribute(elmCur,"step","routetype");
	var sUnitType = getFamilyAttribute(elmCur,"step","unittype");

	var elmNext = getNextElm(elmCur);

	var sCurType = Apvlist.event.srcElement.value;	
	switch(sCurType){
		case "substitute": //대결
			if(elmNext==null){
				alert("결재종류를 바꿀 수 없습니다. 대결을 할 대상이 없습니다.");
			}else{
				var elmNextTaskInfo = elmNext.selectSingleNode("taskinfo");
				if(elmNextTaskInfo.getAttribute("kind")!="normal"){
					alert("결재종류를 바꿀 수 없습니다. 다음 결재자의 결재종류는 일반결재이어야 합니다.");
				}else{
					elmTaskInfo.setAttribute("kind","substitute");
					elmNextTaskInfo.setAttribute("kind","bypass");
					bSetDirty = true;
				}
			}
			break;
		case "authorize": //전결
			/*var atitle = elmCur.getAttribute("title").split(";");
			// 보직없거나 계장인경우 전결권한 제한 추가 코딩 2003.08
			if ((atitle[0] == m_sNAuthTL1) || (atitle[0] == m_sNAuthTL2)){
				alert("결재종류를 바꿀 수 없습니다. 보직이 없거나 계장의 경우 전결권한이 없습니다.");
			}else{*/
				var elmNextAssist = getSibling(elmCur,"step","routetype","assist",true,true)
				if(sRouteType=="approve"&&(sUnitType=="person"||sUnitType=="role")&&elmNextAssist!=null){
					alert("결재종류를 바꿀 수 없습니다. 전결자 다음에 협조가 올 수 없습니다.");
				}else{
					elmTaskInfo.setAttribute("kind","authorize");
					while(elmNext!=null){
						var elmNextTaskInfo = elmNext.selectSingleNode("taskinfo");
						elmNextTaskInfo.setAttribute("kind","skip");
						elmNextTaskInfo.setAttribute("status","skipped");
						elmNextTaskInfo.setAttribute("result","skipped");
						elmNext = getNextElm(elmNext);
					}					
					bSetDirty = true;
				}
			/*}*/
			break;
		case "review": //후결
			//현재 결재자(문서를 받은 경우)를 후결로 하는 경우 방지
			if(elmTaskInfo.getAttribute("datereceived")!=""){
				alert("결재종류를 바꿀 수 없습니다. 현재 결재자는 후결로 변경할 수 없습니다.");
			}else{
				var elmAnotherReviewer;
				if(sRouteType=="approve"&&(sUnitType=="person"||sUnitType=="role")){
					elmAnotherReviewer=elmRoot.selectSingleNode("step[@routetype='approve' and (@unittype='person' or @unittype='role')]/ou/(person|role)[taskinfo/@kind='review']");
				}else{
					elmAnotherReviewer=elmCur.parentNode.selectSingleNode("(person|role)[taskinfo/@kind='review']");
				}
				if(elmAnotherReviewer!=null){
					alert("결재종류를 바꿀 수 없습니다. 후결자가 두 명이상 있을 수 없습니다.");
				}else{
					elmTaskInfo.setAttribute("kind","review");
					bSetDirty = true;
				}
			}
			break;
		case "confidential":  //친선
		    elmTaskInfo.setAttribute("kind","confidential");			
			while(elmNext!=null){
				elmNextTaskInfo = elmNext.selectSingleNode("taskinfo");
				elmNextTaskInfo.setAttribute("kind","normal");
				elmNextTaskInfo.setAttribute("status","inactive");
				elmNextTaskInfo.setAttribute("result","inactive");

				elmNext = getNextElm(elmNext);
				if(elmNext==null || elmNext.selectSingleNode("taskinfo[@kind='skip']")==null)elmNext=null;
			}
			bSetDirty = true;
		    break;
		case "conveyance":  //전달
		    elmTaskInfo.setAttribute("kind","conveyance");			
			while(elmNext!=null){
				elmNextTaskInfo = elmNext.selectSingleNode("taskinfo");
				elmNextTaskInfo.setAttribute("kind","normal");
				elmNextTaskInfo.setAttribute("status","inactive");
				elmNextTaskInfo.setAttribute("result","inactive");

				elmNext = getNextElm(elmNext);
				if(elmNext==null || elmNext.selectSingleNode("taskinfo[@kind='skip']")==null)elmNext=null;
			}
			bSetDirty = true;
		    break;
		case "normal": //일반결재
			elmTaskInfo.setAttribute("kind","normal");			
			while(elmNext!=null){
				elmNextTaskInfo = elmNext.selectSingleNode("taskinfo");
				elmNextTaskInfo.setAttribute("kind","normal");
				elmNextTaskInfo.setAttribute("status","inactive");
				elmNextTaskInfo.setAttribute("result","inactive");

				elmNext = getNextElm(elmNext);
				if(elmNext==null || elmNext.selectSingleNode("taskinfo[@kind='skip']")==null)elmNext=null;
			}
			bSetDirty = true;
			break;
		default:	
	}	
	if(bSetDirty)try{m_oFormMenu.setApvDirty();}catch(e){}
	refreshList(xpathCur);
}
function setApvList(){	
	if(evaluateApvList()){
		//child가 없는 node 삭제
		var ccInfos = m_oApvList.selectNodes("steps/ccinfo");
		for(var i=0;i<ccInfos.length;i++){
			var ccInfo = ccInfos.nextNode();
			var ccList = ccInfo.childNodes;
			if (ccList.length == 0){	m_oApvList.documentElement.removeChild(ccInfo);}
		}
		m_oFormMenu.APVLIST.value = m_oApvList.documentElement.xml;
		//alert(m_oApvList.documentElement.xml);
		var sMode = m_sApvMode.toUpperCase();
		if((sMode == "REDRAFT") || (sMode == "SUBREDRAFT")){
			m_oFormMenu.btDeptDraft.style.display = "inline";
		}
		if((sMode == "DRAFT")||(sMode == "TEMPSAVE") ||(sMode == "REDRAFT")||(sMode == "SUBREDRAFT")){
			m_oFormEditor.setInlineApvList(m_oApvList);

		//마지막 결재자인지 확인	
			var oPendingSteps = m_oApvList.documentElement.selectNodes("step[.//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='pending' or .//taskinfo/@status='reserved')]");
			var oinActiveSteps = m_oApvList.documentElement.selectNodes("step[@routetype!='receive' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass' and .//taskinfo/@kind!='skip'  and .//taskinfo/@status='inactive']");
			//alert(oPendingSteps.length + "---"+ oinActiveSteps.length);
			if (( oPendingSteps.length == 1 ) && (oinActiveSteps.length == 0)){
				m_oFormMenu.field["bLASTAPPROVER"].value = "true";
			}else{
				m_oFormMenu.field["bLASTAPPROVER"].value = "false";
			}
		//마지막 결재자인지 확인

		}
		window.close();
	}
}
function joinAttrs(elmList,sAttrName){
	if(elmList.length==0)return "";
	var sJoin="";
	var elm = elmList.nextNode();
	while(elm!=null){
		sJoin+=(sJoin==""?"":";")+elm.getAttribute(sAttrName);
		elm = elmList.nextNode();
	}
	elmList.reset();
	return sJoin;
}
function doButtonAction(){
	var bSetDirty=false;
	switch(event.srcElement.id){
		case "btPerson":	 bSetDirty=true;
/*			if (m_sApvMode=="REDRAFT"){
				addRecPerson();
				break;
			}else if (m_sApvMode=="SUBREDRAFT"){
				addSubPerson();
				break;
			}else 
*/			if (m_sApvMode=="CHARGE"){
				addChargePerson();
				break;
			}else if (m_sApvMode=="REDRAFT"){
				addReceiptPerson();
				break;			
			}else{				
				addPerson();
				break;
			}
		case "btReceipt":	bSetDirty=true;addReceipt();break;
		case "btGroup":		bSetDirty=true;addGroup();break;
		case "btPAssist":	bSetDirty=true;addPAssist();break;
		case "btDAssist":	bSetDirty=true;addDAssist();break;
		case "btPConsult":	bSetDirty=true;addPConsult();break;
		case "btDConsult":	bSetDirty=true;addDConsult();break;		
		case "btDelete":	bSetDirty=true;deletePerson();break;
		case "btUp":		bSetDirty=true;moveUpDown("UP");break;
		case "btDown":		bSetDirty=true;moveUpDown("DOWN");break;
		case "btCC":		if(m_bCC){bSetDirty=true;setCC("global");}break;
		case "btSendCC":	if(m_bCC){bSetDirty=true;setCC("sender");}break;
		case "btRecCC":		if(m_bCC){bSetDirty=true;setCC("receiver");}break;
		case "btDeleteCC":	bSetDirty=true;deleteCC();break;
		case "btApplyLine":	bSetDirty=true;applyLine();break;
		case "btResetLine":	resetLine();break;
		case "btOK":		setApvList();break;
		case "btExit":		window.close();break;
		case "btRecDept":if(m_bCC) addRecDept();break;
		case "btDeleteRec":delList();break;
		
	}
	if(bSetDirty)try{m_oFormMenu.setApvDirty();}catch(e){}
}
function viewComment(idx){	
	var rgParams = null;
	rgParams = new Array();
	rgParams["objMessage"] = Apvlist.getComment(idx);
	var nWidth = 400;
	var nHeight = 410;
	var vRetval = window.showModelessDialog("comment.htm", rgParams, "dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;scrolling:no;help:no;");
}
function applyLine(){
	if (self.iApvLine.m_id!=""){
		switch(m_sApvMode){
			case "REDRAFT":
				var oSteps = self.iApvLine.queryGetData();
				var oCheckSteps = chkAbsent(oSteps);
				if ( oCheckSteps ){
					var nodesAllItems = oSteps.selectNodes("step/ou/person");
					for(var x=0; x<nodesAllItems.length; x++){
						m_oCurrentOUNode.appendChild(nodesAllItems.item(x));
					}
					refreshList();
				}
				break;
			case "SUBREDRAFT":
				//협조전
				alert("아직 지원하지 않습니다");
				break;
			default:
				var oSteps = self.iApvLine.queryGetData();
				var oCheckSteps = chkAbsent(oSteps);
				var oApvList = new ActiveXObject("MSXML2.DOMDocument");
												
				if ( oCheckSteps ){					
					var oStep=oApvList.createElement("step");
					var oOU=oApvList.createElement("ou");
					var oPerson=oApvList.createElement("person");
					var oTaskinfo=oApvList.createElement("taskinfo");
					oSteps.insertBefore(oStep, oSteps.firstChild).appendChild(oOU).appendChild(oPerson).appendChild(oTaskinfo);
					oStep.setAttribute("unittype","person");
					oStep.setAttribute("routetype","approve");
					oStep.setAttribute("name","기안자");
					oOU.setAttribute("code",getInfo("dpid_apv"));
					oOU.setAttribute("name",getInfo("dpdn_apv"));
					oPerson.setAttribute("code",getInfo("usid"));
					oPerson.setAttribute("name",getInfo("usdn"));
					oPerson.setAttribute("position",getInfo("uspc")+";"+getInfo("uspn"));
					oPerson.setAttribute("title",getInfo("ustc")+";"+getInfo("ustn"));
					oPerson.setAttribute("level",getInfo("uslc")+";"+getInfo("usln"));
					oPerson.setAttribute("oucode",getInfo("dpid"));
					oPerson.setAttribute("ouname",getInfo("dpdn"));
					oTaskinfo.setAttribute("status","inactive");
					oTaskinfo.setAttribute("result","inactive");
					oTaskinfo.setAttribute("kind","charge");
					oTaskinfo.setAttribute("datereceived",getInfo("svdt"));
					
					var nodesAllItems = oSteps.selectNodes("steps/step");
					for(var x=0; x<nodesAllItems.length; x++){
						oSteps.documentElement.appendChild(nodesAllItems.item(x));
					}					
					
					m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+oSteps.xml);
					refreshList();
					refreshCC(true);
				}
				break;
		}
	}else{
		alert("결재선을 먼저 선택하십시요");
	}	
}
function resetLine(){
	m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+m_oFormMenu.APVLIST.value);
	self.Apvlist.clearSelection();
	refreshList();
}
function evaluateApvList(){
	var elmRoot = m_oApvList.documentElement;
	//alert(elmRoot.xml);
	//scCHLimit 결재자 제한
	//scACLimit  합의자 제한
	if( getInfo("scCHLimit")==1 && getInfo("scCHLimitV")!=''){
		var elmApprove = elmRoot.selectNodes("step[@routetype='approve' and @unittype='person' and ou/person[taskinfo/@kind!='charge']]");
		if (elmApprove==null){
			alert("결재자를 지정하십시요");
			return false;
		}else if(elmApprove.length > parseInt(getInfo("scCHLimitV"))){
			alert("결재선에서 결재자수 " + getInfo("scCHLimitV") + "명을 초과할 수 없습니다"); return false;
		}
		//return true;
	}
	
	if (getInfo("scPCoo")==1&&(m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL"||m_sApvMode=="PCONSULT")){
		var elmAssist = elmRoot.selectSingleNode("step[@routetype='assist' and @unittype='person']");
		if (elmAssist==null){
			//if(confirm("협조자 없이 진행하시겠습니까?"))return true;
			//	return chkConsultAppLine(elmRoot);
			if (!chkConsultAppLine(elmRoot)) return false;
		}else{
			//	return chkConsultAppLine(elmRoot);
			if (!chkConsultAppLine(elmRoot)) return false;
		}
		//return true;
	}
	if (getInfo("scPAgr")==1&&(m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL"||m_sApvMode=="PCONSULT")){
		var elmConsult = elmRoot.selectSingleNode("step[@routetype='consult' and @unittype='person' and @allottype='parallel']");
		if (elmConsult==null){
			//if(confirm("개인합의 없이 진행하시겠습니까?")){
				if (getInfo("scDAgr") == "1"){
					//return chkConsultAppLine(elmRoot);
					if (!chkConsultAppLine(elmRoot)) return false;
				}else{
					//return true;
				}
			//}else{
			//	return false;
			//}
		}else{
		 	if(getInfo("scACLimit")==1 && getInfo("scACLimitV")!='' && elmConsult.selectNodes("ou").length > parseInt(getInfo("scACLimitV"))){
				alert("결재선에서 합의자수 " + getInfo("scACLimitV") + "명을 초과할 수 없습니다"); return false;
			}else{
				//return chkConsultAppLine(elmRoot);
				if (!chkConsultAppLine(elmRoot)) return false;
			}
		}
	}
	if (getInfo("scDAgr")==1&&(m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL"||m_sApvMode=="PCONSULT")){
		var elmConsult = elmRoot.selectSingleNode("step[@routetype='consult' and @unittype='ou' and @allottype='parallel']");
		if (elmConsult==null){
			//if(confirm("부서합의 없이 진행하시겠습니까?")){
				if (getInfo("scPAgr") == "1"){
					//return chkConsultAppLine(elmRoot);
					if (!chkConsultAppLine(elmRoot)) return false;
				}else{
					//return true;
				}
			//}else{
			//	return false;
			//}
		}else{
			//return true;
		}
	}
	
	if (getInfo("scPAgr")==2&&(m_sApvMode=="REDRAFT"||m_sApvMode=="RECAPPROVAL")){
		var elmConsult = elmRoot.selectSingleNode("step[@routetype='consult' and @unittype='person' and @allottype='parallel']");
		if (elmConsult==null){
			//if(confirm("부서합의 없이 진행하시겠습니까?"))return true;
			//return false;
		}else{
			var emlSteps = elmRoot.selectNodes("step");
			var emlStep;
			var HasApprover = false;
			var HasConsult = false;
			for(var i=0; i< emlSteps.length;i++){
				emlStep=emlSteps.nextNode();
				if (emlStep.getAttribute("routetype") == "consult"){
					HasConsult = true;
				}
				if ( HasConsult ){
					if (emlStep.getAttribute("routetype") == "approve"){
						HasApprover = true;
					}
				}
			}
			
			if ( HasApprover == true ) {
				//return true;
			}else{
				alert("결재선에서 합의는 최종결재자 전에 위치해야 합니다.\n현 합의를 결재자 아래로 내려주십시요.");return false;
			}
			
		}
	}
	
	if (getInfo("scDRec")==1&&(m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL")){
		//var elmOu = elmRoot.selectSingleNode("step[@routetype='receive' and @unittype='ou']");
		/*if (elmOu==null){alert("수신부서를 지정하십시요");return false;} 2003.06 황선희 주석처리*/
		var elmOu = elmRoot.selectNodes("step[@routetype='receive']/ou");
		
		//if (elmOu==null){
		if (elmOu.length==0){
			//if(confirm("수신처 없이 진행하시겠습니까?"))return true;
			//return false;
			//alert("수신처를 지정하십시요."); return false;
			//if(confirm("경유부서 없이 진행하시겠습니까?"))return true;			
		}else{
			//수신처를 1개만 지정하도록 수정 2004.11.10 김영종
 			var elmReceive = elmRoot.selectNodes("step[@unittype='ou' and @routetype='receive']");
			//한번에 두개 이상의 수신처를 지정 할 경우 Check
 			if(elmReceive.length>1){alert("수신처는 1개만 지정 가능 합니다. \n수신처를 다시 지정해 주십시요.");return false;} 
 			var ouReceive = elmReceive[0].selectNodes("ou");
			//한번씩 하나씩 두번 이상의 수신처를 지정 할 경우 Check
 			if(ouReceive.length>1){alert("수신처는 1개만 지정 가능 합니다. \n수신처를 다시 지정해 주십시요.");return false;} 
		}
		//return true;
	}
	
	if (getInfo("scChgr")==1&& getInfo("scChgrV")=="select" && (m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL")){
		//var elmOu = elmRoot.selectSingleNode("step[@routetype='receive' and @unittype='ou']");
		/*if (elmOu==null){alert("수신부서를 지정하십시요");return false;} 2003.06 황선희 주석처리*/
		var elmOu = elmRoot.selectNodes("step[@routetype='receive']/ou/role");
		
		//if (elmOu==null){
		if (elmOu.length==0){
			alert("담당업무를 지정하십시요");
			return false;
		}else if (elmOu.length>1){
			alert("담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요.");
			return false;
		}else{
			//담당업무를 1개만 지정하도록 수정 2005.04.21 황선희
 			var elmReceive = elmRoot.selectNodes("step[@unittype='person' and @routetype='receive']");
			//한번에 두개 이상의 담당업무를 지정 할 경우 Check
 			if(elmReceive.length>1){alert("담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요.");return false;} 
 			var ouReceive = elmReceive[0].selectNodes("role");
			//한번씩 하나씩 두번 이상의 담당업무를 지정 할 경우 Check
 			if(ouReceive.length>1){alert("담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요.");return false;} 
		}
		var emlSteps = elmRoot.selectNodes("step");
		var emlStep;
		var HasApprover = false;
		var HasReceive= false;
		for(var i=0; i< emlSteps.length;i++){
			emlStep=emlSteps.nextNode();
			if (emlStep.getAttribute("routetype") == "receive" && emlStep.getAttribute("unittype") == "person" ){
				HasReceive = true;
			}
			if ( HasReceive ){
				if (emlStep.getAttribute("routetype") == "approve"){
					HasApprover = true;
				}
			}
		}
		if ( HasApprover == true ) {
			alert("결재선에서 담당부서처리는 최종결재자 다음에 위치해야 합니다.\n현 업무담당를 결재자 위로 올려주십시요.");return false;
		}else{
			//return true;
		}
	}
	
	if (getInfo("scDCoo")==1&&(m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL")){
		var elmOu = elmRoot.selectSingleNode("step[@routeype='assist' and @unittype='ou']");
		/*if (elmOu==null){alert("협조처를 지정하십시요");return false;} 2003.04 황선희 주석처리*/
		if (elmOu==null){
			if(!confirm("협조처 없이 진행하시겠습니까?")) return false;
		}
		//return true;
	}
	
	if (getInfo("scPCoo")==1&&(m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL")){
		var elmAssist = elmRoot.selectSingleNode("step[@routetype='assist' and @unittype='person']");
		if (elmAssist==null){
			if(!confirm("협조자 없이 진행하시겠습니까?")) return false;
		}
		//return true;
	}
	if (getInfo("scDAgr")==1&& m_sApvMode=="SUBREDRAFT"){
		if (m_oCurrentOUNode.selectNodes("person").length < 2 )
		{
			alert("결재선을 지정하십시요");return false;
		}
	}
	return true;
}
//감사 처리
function setAudit() {}
function switchAudit(){}
function getChargeNode(){
	var sText = "../Forms/getChargeApvSteps.aspx";
	requestHTTP("GET",sText,false,"text/xml",null,null);
	return receiveHTTP();
}
var g_szAcceptLang  = "ko";
function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	m_xmlHTTP.open(sMethod,sUrl,bAsync);
	m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
	m_xmlHTTP.setRequestHeader("Content-type", sCType);
	if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
}
function receiveHTTP(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			//alert(m_xmlHTTP.responseText);
		}else{
			var errorNode=m_xmlHTTP.responseXML.selectSingleNode("person/error");
			if(errorNode!=null){
				alert("Desc: " + errorNode.text);
			}else{	
				return m_xmlHTTP.responseXML.selectSingleNode("person");
			}
		}
	}
}

function setVisibility()
{
	var bSetDirty=false;
	var oSelTR = Apvlist.getPatentRow();
	var xpathCur = oSelTR.id;

	var elmRoot = m_oApvList.documentElement;
	var elmCur = elmRoot.selectSingleNode(xpathCur);
	var elmTaskInfo = elmCur.selectSingleNode("taskinfo");

	var sCurType = Apvlist.event.srcElement.value;	
	switch(sCurType){
		case "y": //보이기			
			elmTaskInfo.setAttribute("visible","y");			
			bSetDirty = true;				
			break;
		case "n": //감추기
			elmTaskInfo.setAttribute("visible","n");			
			bSetDirty = true;				
			break;
	}	
	if(bSetDirty)try{m_oFormMenu.setApvDirty();}catch(e){}
	refreshList(xpathCur);
}
function changeVtitle()
{
	var bSetDirty=false;
	var oSelTR = Apvlist.getPatentRow();
	var xpathCur = oSelTR.id;

	var elmRoot = m_oApvList.documentElement;
	var elmCur = elmRoot.selectSingleNode(xpathCur);	
	var elmTitle = elmCur.getAttribute("title");
	var aTitle = elmTitle.split(";");
	var sCurType = Apvlist.event.srcElement.value;
	var elmNewTitle = aTitle[0]+";"+sCurType;
		
	elmCur.setAttribute("title",elmNewTitle);			
	bSetDirty = true;
	if(m_oFormMenu.APVLIST=="undefined") m_oFormMenu.setApvDirty();
	refreshList(xpathCur);
}
function splitName(sValue){
	return sValue.substr(sValue.lastIndexOf(";")+1);
}
function getChargeOUNode(){
	var oStep=m_oApvList.createElement("step");
	var oOU=m_oApvList.createElement("ou");
	var oTaskinfo=m_oApvList.createElement("taskinfo");
	m_oApvList.documentElement.appendChild(oStep).appendChild(oOU).appendChild(oTaskinfo);
	oStep.setAttribute("unittype","ou");
	oStep.setAttribute("routetype","receive");
	oStep.setAttribute("name","담당부서수신");
	oOU.setAttribute("code",getInfo("dpid_apv"));
	oOU.setAttribute("name",getInfo("dpdn_apv"));
	oTaskinfo.setAttribute("status","pending");
	oTaskinfo.setAttribute("result","pending");
	oTaskinfo.setAttribute("kind","normal");
	oTaskinfo.setAttribute("datereceived",getInfo("svdt"));
	return m_oApvList.documentElement.selectSingleNode("step[@unittype='ou']/ou[@code='"+getInfo("dpid_apv")+"' and taskinfo/@status='pending']"); //
}
function chkAbsent(oSteps){
	var oUsers = oSteps.selectNodes("step/ou/person");
	var elmUsers;
	var sUsers="";
	for(var i=0; i < oUsers.length ; i++){
		elmUsers = oUsers.nextNode();
		if(sUsers.length > 0 ){
			sUsers += ";"+ elmUsers.getAttribute("code");
		}else{
			sUsers += elmUsers.getAttribute("code");
		}
	}
	var szURL = "/xmlorg/query/org_chkabsent.xml?USER_ID="+sUsers;
	requestHTTP("GET",szURL,false,"text/xml",null,null);
	return chkAbsentUsers();
}
function chkAbsentUsers(){	
	if(m_xmlHTTP.readyState==4){	
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=="\r"){
			//alert(m_xmlHTTP.responseText);			
		}else{			
			var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			if(errorNode!=null){
				return true;
			}else{
				var oUsers = m_xmlHTTP.responseXML.selectNodes("response/addresslist/item");
				var oUser;
				var sResult="";
				for(var i=0;i<oUsers.length;i++){
					oUser = oUsers.nextNode();
					sResult += "	" + oUser.selectSingleNode("RGNM").text +" : " + oUser.selectSingleNode("DN").text+"\n";
				}
				alert("선택한 개인 결재선에 퇴직자가 포함되어 적용이 되지 않습니다.\n\n---퇴직자--- \n\n"+sResult);
				return false;
			}
		}
	}
}
function chkConsultAppLine(elmRoot){
	var emlSteps = elmRoot.selectNodes("step");
	var emlStep;
	var elmList = elmRoot.selectNodes("step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/(person|role)");	// 2004.10.26 update
	var elm, elmTaskInfo;	// 2004.10.26 update
	var HasApprover = false;
	var HasConsult = false;
	var HadReviewer = false;	// 2004.10.26 update
	var PreConsult = false ;	// 2004.10.26 update
	var EndReviewer = false ;	// 2004.10.26 update
	var CurConsult = false ;	// 2004.10.26 update

	for(var i=0; i< emlSteps.length;i++){
		emlStep=emlSteps.nextNode();
		if (emlStep.getAttribute("routetype") == "consult" || emlStep.getAttribute("routetype") == "assist" )	HasConsult = true;
		if (i==emlSteps.length-2 && emlStep.getAttribute("routetype") == "consult")	PreConsult = true ;	// 2004.10.26 update
		if (i==emlSteps.length-1 && emlStep.getAttribute("routetype") == "consult")	CurConsult = true ;	// 2004.10.26 update
	}
	// 2004.10.26 update 
	for (var j=0; j<elmList.length;j++) {
		elm = elmList.nextNode();
		elmTaskInfo = elm.selectSingleNode("taskinfo");
		if (j==elmList.length-1 && elmTaskInfo.getAttribute("kind") == "review")	EndReviewer = true ;	// 2004.10.26 update
	}
	//

	if ( HasConsult ){
		if (emlStep.getAttribute("routetype") == "approve" && elmTaskInfo.getAttribute("kind") != "review") HasApprover = true;	// 2004.10.26 update
	}
	if ( HasConsult ){
		if ( HasApprover == true ) {
			return true;
		}else{
			// 2004.10.26 update 
			if (PreConsult && EndReviewer){
				alert("최종결재자가 후결인 경우에 전 결재자는 합의일 수 없습니다.");return false;
			}else{
			    // 2006.02.24 : 박상호 -> 합의자 최종결재자 전에 위치해야 하는 로직 삭제 (합의자에서 끝날수 있음)
			    /*
				if (CurConsult){				
					alert("결재선에서 합의는 최종결재자 전에 위치해야 합니다.\n현 합의를 결재자 아래로 내려주십시요.");return false;
				}else{return true;}
				*/
				return true;
			}
			//
		}
	}else{
		return true;
	}
}

function chkDuplicateApprover(oSrcDoc){
		var oSrcDocList = oSrcDoc.selectNodes("//item");
	for(var i=0 ; i < oSrcDocList.length; i++){
		var item = oSrcDocList.nextNode();
		var xPathDelete='';
		switch(m_sSelectedRouteType){
			case "ccinfo":	
				switch (m_sSelectedUnitType)	{
					case "person": xPathDelete = "ccinfo/ou/(person|role)";	break;
					case "ou":xPathDelete = "ccinfo/ou";	break;
					case "group":xPathDelete = "ccinfo/group";break;
				}
				break;
			default :
				switch (m_sSelectedUnitType)	{
					case "person": xPathDelete = "step/ou/(person|role)";	break;
					case "ou":xPathDelete = "step/ou";	break;
					case "group":xPathDelete = "step/group";break;
				}
				break;
		}
		if (item.selectSingleNode("ROLE") != null ){
			if (item.selectSingleNode("ROLE").text == "manager"){
				xPathDelete +="[@code='UNIT_MANAGER' and @ouname='"+ item.selectSingleNode("DN").text+"']"
			}else{
				xPathDelete +="[@code='" + item.selectSingleNode("AN").text+ "' and @name='"+ item.selectSingleNode("DN").text+"']"
			}
		}else{
			xPathDelete +="[@code='" + item.selectSingleNode("AN").text+ "' and @name='"+ item.selectSingleNode("DN").text+"']"
		}
		if (m_oApvList.documentElement.selectSingleNode(xPathDelete) != null){
			oSrcDoc.documentElement.removeChild(item);
		}
	}
	return oSrcDoc;
}
function chkManagerConsult(oSrcDoc){
	var bDeleted = false;
	if(m_sSelectedRouteType == "consult"){
		var oSrcDocList = oSrcDoc.selectNodes("//item");
		for(var i=0 ; i < oSrcDocList.length; i++){
			var item = oSrcDocList.nextNode();
			var xPathDelete='';
			// 2006.02.24 : 박상호 -> 부서장체크 해제
			/*
			if (item.selectSingleNode("ROLE") != null ){
				if (item.selectSingleNode("ROLE").text != "manager"){
					oSrcDoc.documentElement.removeChild(item);
					bDeleted = true;
				}
			}
			*/
		}
	}
	if (bDeleted) alert("합의자는 부서장만 선택할 수 있습니다.\n개인을 직접 지정할 수 없습니다.");
	return oSrcDoc;
}
function  chkManagerApprove(oSrcDoc){
	var bDeleted = false;
	if(m_sSelectedRouteType == "approve" || m_sSelectedRouteType == "receive" ){
		var oSrcDocList = oSrcDoc.selectNodes("//item");
		for(var i=0 ; i < oSrcDocList.length; i++){
			var item = oSrcDocList.nextNode();
			var xPathDelete='';
			if (item.selectSingleNode("ROLE") != null ){
				if (item.selectSingleNode("ROLE").text == "manager"){
					oSrcDoc.documentElement.removeChild(item);
					bDeleted = true;
				}
			}
		}
	}
	if (bDeleted) alert("결재자는 부서장을 선택할 수 없습니다.\n개인을 직접 지정하십시요.");
	return oSrcDoc;
}
//배포처 추가 
var m_oRecList = new ActiveXObject("MSXML2.DOMDocument");
var mType=0;
function setDistDept(oList){
	if (opener.m_oFormEditor.RECEIVE_NAMES.value == '')	opener.m_oFormEditor.RECEIVE_NAMES.value='@@';
	if (opener.m_oFormEditor.RECEIPT_LIST.value == '')	opener.m_oFormEditor.RECEIPT_LIST.value='@@';

	var aRecDept = opener.m_oFormEditor.RECEIVE_NAMES.value.split("@");
	var sRecDept='';
	var elmList, emlNode;
	elmList = oList.selectNodes("//item");
	for(var i=0;i<elmList.length;i++){
		emlNode = elmList.nextNode();
		if (chkDuplicate(emlNode.selectSingleNode("AN").text))	sRecDept+=";"+emlNode.selectSingleNode("AN").text+":"+emlNode.selectSingleNode("DN").text;
	}
	if( aRecDept[mType].length < 1 ) sRecDept = sRecDept.substring(1);
	aRecDept[mType] += sRecDept;

	sRecDept = "";
	for(var i=0 ; i< aRecDept.length ; i++){sRecDept+='@' + aRecDept[i];}

	if( sRecDept.length > 1 ) sRecDept = sRecDept.substring(1);

	opener.m_oFormEditor.RECEIVE_NAMES.value = sRecDept;
	opener.m_oFormEditor.RECEIPT_LIST.value = RecList();
	//txtRecDept.value = initRecList();
	chkAction(mType);
}
function chkDuplicate(code){
	var aRecDept = opener.m_oFormEditor.RECEIVE_NAMES.value.split("@");
	var cmpString = aRecDept[mType];
	var cmpIndex = cmpString.indexOf(code);
	if ( cmpIndex < 0){ return true;}else{return false;}
}
function RecList(){
	var aRecDept = opener.m_oFormEditor.RECEIVE_NAMES.value.split("@");
	var sRecList="";
	for(var i=0; i< aRecDept.length;i++){
		var aRec = aRecDept[i].split(";");
		sRecList+="@";
		sRecDept= "";
		for(var j=0;j<aRec.length;j++){
			sRecDept += ";"+aRec[j].split(":")[0];	
		}
		if (sRecDept.length > 0) sRecDept = sRecDept.substring(1);
		sRecList+= sRecDept;
	}
	if (sRecList.length > 0) sRecList = sRecList.substring(1);
	return sRecList;
}
//협조처 목록 조회
function initRecList(){
	var szReturn='';
	var aRecDept = opener.m_oFormEditor.RECEIVE_NAMES.value.split("@");
	var sRecDept = aRecDept[0];
	if ( sRecDept != null && sRecDept !=''){
		var aRec = sRecDept.split(";");
		for(var i=0;i<aRec.length;i++){			szReturn += (szReturn!=''?", ":"")+aRec[i].split(":")[1];		}
	}

	return szReturn;
}
function  chkAction(actType){
	mType=actType;
	if (opener.m_oFormEditor.RECEIVE_NAMES.value == '')	opener.m_oFormEditor.RECEIVE_NAMES.value='@@';
	if (opener.m_oFormEditor.RECEIPT_LIST.value == '')	opener.m_oFormEditor.RECEIPT_LIST.value='@@';
	var aRecDept = opener.m_oFormEditor.RECEIVE_NAMES.value.split("@");
	var sRecDept = aRecDept[mType];
	make_selRec(sRecDept);
}
function make_selRec(sRecList){
	var otbl = document.all["tblrecinfo"];
	var tbllength = otbl.rows.length;
	//Table 지우기
	for(var i=0;i<tbllength-2;i++){
		otbl.deleteRow();
	}
	var eTR, eTD;
	if ( sRecList != null && sRecList !=''){
		var aRec = sRecList.split(";");
		for(var i=0;i<aRec.length;i++){
			eTR = otbl.insertRow();
			eTR.setAttribute("id",aRec[i].split(":")[0]);
			eTR.attachEvent("onmousedown", selectDistRow);
			eTD = eTR.insertCell(); eTD.innerHTML = aRec[i].split(":")[1]; eTD.height=20;
		}
	}
	return;
}
function delList(){
	var oSelTR = this.getSelectedDistRow();
	if(oSelTR!=null){
		if (oSelTR.id != null){
			var aRecDept = opener.m_oFormEditor.RECEIVE_NAMES.value.split("@");
			var aRecCode = opener.m_oFormEditor.RECEIPT_LIST.value.split("@");
			var aSelectRecDept = aRecDept[mType].split(";");
			var aSelectRecCode = aRecCode[mType].split(";");
			var sRecDept='';
			var sRecCode='';
			for(var i=0;i<aSelectRecCode.length;i++){
				if (oSelTR.id != aSelectRecCode[i]){
					sRecDept+=";"+aSelectRecDept[i];
					sRecCode+=";"+aSelectRecCode[i];
				}
			}
			if (sRecDept.length > 0) sRecDept = sRecDept.substring(1);
			if (sRecCode.length > 0) sRecCode = sRecCode.substring(1);
			aRecDept[mType] = sRecDept;
			aRecCode[mType] = sRecCode;
			sRecDept='';
			sRecCode='';
			for(var j=0; j< aRecDept.length;j++){
				sRecDept += "@" + aRecDept[j];				
				sRecCode += "@" + aRecCode[j];				
			}
			if (sRecDept.length > 0) sRecDept = sRecDept.substring(1);
			if (sRecCode.length > 0) sRecCode = sRecCode.substring(1);
			opener.m_oFormEditor.RECEIVE_NAMES.value = sRecDept;
			opener.m_oFormEditor.RECEIPT_LIST.value = sRecCode;
		}
		chkAction(mType);
	}   
}
