var m_xmlHTTP = CreateXmlHttpRequest();
var m_evalXML = CreateXmlDocument();
var g_szAcceptLang = "ko";
var m_sReqMode;
var m_oFormEditor;
var m_cvtXML = CreateXmlDocument().createTextNode("");
var m_bFrmExtDirty = false;
var m_bFrmInfoDirty = false;
var m_oFormReader;
var m_sOPubDocNO = "";


window.onload = initOnload;
function initOnload() {
    initialize();
}


function initialize() {	 //debugger
    m_oFormEditor = parent.editor;
    m_oFormReader = parent.reader;

    //	m_oFormReader.location.href = getInfo("fmpf")+"_V"+getInfo("fmrv")+"_read.htm";
    initBtn();
    //DocLinkInfo.innerHTML = szdoclinksinfo;
    try {
        //parent.fileview.DocLinkInfo.innerHTML = szdoclinksinfo;
        if (String(window.location).indexOf("_read.htm") > -1) { //조회페이지 일때만 첨부파일 영역 활성화	  
            var eTR = DocLinkInfo.parentElement;
            while (eTR.tagName != "TABLE") {
                eTR = eTR.parentElement;
            }
            if (bFileView) {
                eTR.style.display = "none";
            } else {
                eTR.style.display = "";
            }
            parent.main.rows = "40,*,80,0";
        } else {
            parent.document.getElementById('main').rows = "40,*,0,0";
        }
    } catch (e) { alert(e.message); }
}
function getInfo(sKey) { try { return parent.g_dicFormInfo.item(sKey); } catch (e) { alert("양식정보에 없는 키값[" + sKey + "]입니다."); } }
function setInfo(sKey, sValue) {
    try {
        if (parent.g_dicFormInfo.Exists(sKey)) parent.g_dicFormInfo.Remove(sKey);
        parent.g_dicFormInfo.Add(sKey, sValue);
    } catch (e) { alert(gMessage254 + sKey + gMessage255); }
}
function initBtn() {
    if (getInfo("readtype") == "preview") //미리보기 창인지 검증
    {
        timerID = setInterval("setPreView()", 1000);
        return;
    }

    switch (getInfo("mode")) {
        case "DRAFT":
        case "TEMPSAVE":
            //displayBtn("","","none","","none","");			
            displayBtn("", "", "none", "", "none", "none", "");
            break;
        case "COMPLETE":
            //displayBtn("none","none","none","","none","none");			
            displayBtn("none", "none", "none", "none", "", "none", "none");
            break;
        default:
            //displayBtn("none","none","none","","none","none");
            displayBtn("none", "none", "none", "none", "", "none", "none");
            break;
    }

}
function displayBtn(sDocNo, sSave, sTempSave, btPreView, sPrint, sNumber, sAttach) {
    //function displayBtn(sDocNo,sSave,sTempSave,sPrint,sNumber,sAttach){
    //btDocNo.style.display= sDocNo;//"문서번호발급"
    document.getElementById('btSave').style.display = sSave; //"저장"
    document.getElementById('btTempSave').style.display = sTempSave; //"임시저장"
    document.getElementById('btPreView').style.display = btPreView; //"미리보기""
    document.getElementById('btPrintView').style.display = sPrint; //"인쇄"
    document.getElementById('lblNumber').style.display = sNumber;
    document.getElementById('btAttach').style.display = sAttach;
    //btDocNo.disabled=(getInfo("DOC_NO")==null || getInfo("DOC_NO")==""?false:true);
}
function disableBtns(bDisable) {
    //btDocNo.disabled = bDisable;
    //btCancel.disabled = bDisable;
    document.getElementById('btPrintView').disabled = bDisable;
}
function evaluateForm() {
    return m_oFormEditor.checkForm((m_sReqMode == "TEMPSAVE" ? true : false));
}
function getDefaultXML() {
    var sXML
	= makeNode("piid", (m_sReqMode == "TEMPSAVE" ? "" : null)) + makeNode("wiid") + makeNode("pdef")
	+ makeNode("mode") + makeNode("dpid") + makeNode("usid")
	+ makeNode("fmid") + makeNode("fmnm") + makeNode("fmpf") + makeNode("fmbt") + makeNode("fmrv")
	+ makeNode("fiid") + makeNode("ftid") + makeNode("pfid") + makeNode("scid") + makeNode("fmfn") + makeNode("fiid_response")
	+ getFormInfosXML()
	+ (m_bFrmExtDirty ? getFormInfoExtXML() : "");
    return sXML;
}
function getFormInfosXML() {
    var forminfos = "";
    var m_oFormInfos = CreateXmlDocument();
    m_oFormInfos.async = false;
    m_bFrmInfoDirty = false;

    forminfos = getPIDC();
    return forminfos;
}
function getPIDC() {
    var m_oFormInfos = CreateXmlDocument();
    m_oFormInfos.async = false;
    m_oFormInfos.loadXML("<?xml version='1.0' encoding='utf-8'?><ClientAppInfo><App name='FormInfo'><forminfos><forminfo/></forminfos></App></ClientAppInfo>");
    var root = m_oFormInfos.documentElement;
    var currNode = root.childNodes.item(0).childNodes.item(0).childNodes.item(0);
    currNode.setAttribute("prefix", getInfo("fmpf"));
    currNode.setAttribute("revision", getInfo("fmrv"));
    currNode.setAttribute("instanceid", getInfo("fiid"));
    currNode.setAttribute("id", getInfo("fmid"));
    currNode.setAttribute("name", getInfo("fmnm"));
    currNode.setAttribute("schemaid", getInfo("scid"));
    currNode.setAttribute("index", "0");
    currNode.setAttribute("filename", getInfo("fmfn"));
    currNode.setAttribute("subject", ((m_oFormEditor.document.getElementsByName("SUBJECT")[0] == undefined) ? getInfo("SUBJECT") : m_oFormEditor.document.getElementsByName("SUBJECT")[0].value));
    currNode.setAttribute("secure_doc", (document.getElementById("chk_secrecy") == undefined ? "0":(document.getElementById("chk_secrecy").checked == true) ? "1" : "0"));
    currNode.setAttribute("req_response", ((m_oFormEditor.document.getElementsByName("REQ_RESPONSE")[0] == undefined) ? "" : m_oFormEditor.document.getElementsByName("REQ_RESPONSE")[0].value));
    currNode.setAttribute("isfile", ((m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value == "") ? "0" : "1"));


    return (!window.ActiveXObject) ? (new XMLSerializer()).serializeToString(root) : root.xml;
}
function getFormInfoExtXML() {
    var forminfoext = "";
    /* 각 양식으로 내려보낼것 forminfoext = m_oFormEditor.getFormInfoExtXML();*/

    forminfoext = "<forminfoext><forminfo>"
	+ "<outerpub>" + (getInfo("scOPub") == '1' ? "True" : "False") + "</outerpub>"
	+ "<innerpub>" + (getInfo("scIPub") == '1' ? "True" : "False") + "</innerpub>"
	+ "<innerpost>False</innerpost>";

    if (getInfo("scIPub") == '1' || getInfo("scOPub") == '1') {
        forminfoext += "<receiptlist>" + (getInfo("scOPub") == '1' ? "" : m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value) + "</receiptlist>";
    } else { forminfoext += "<receiptlist></receiptlist>"; }
    forminfoext += "<sealauthority>" + (m_sReqMode == "SIGN" ? (getInfo("dpid") + ';' + getInfo("dpdsn")) : '') + "</sealauthority>"
	+ "<scEdms>" + (getInfo("scEdms") == '1' ? "True" : "False") + "</scEdms>"
	+ "<class>" + (getInfo("scEdms") == '1' ? getInfo("scEdmsV") : '') + "</class>"
	+ "<issuedocno>" + (getInfo("scDNum") == '1' ? "True" : "False") + "</issuedocno>"
	+ "<docinfo>"
	+ " <outerpubdocno>" + m_sOPubDocNO + "</outerpubdocno>" //외부공문번호 넣어줄것
	+ " <docno>" + ((m_oFormEditor.document.getElementsByName("DOC_NO")[0] == undefined) ? '' : m_oFormEditor.document.getElementsByName("DOC_NO")[0].value) + "</docno>"
	+ " <recno>" + ((m_oFormEditor.document.getElementsByName("RECEIVE_NO")[0] == undefined) ? '' : m_oFormEditor.getReceiveNo()) + "</recno>";

    if ((getInfo("fmpf") == "DRAFT")) {
        forminfoext += " <catcode>" + m_oFormEditor.document.getElementsByName("DOC_CLASS_ID")[0].value + "</catcode>"
		+ " <catname>" + m_oFormEditor.document.getElementsByName("DOC_CLASS_NAME")[0].value + "</catname>"
		+ " <keepyear>" + m_oFormEditor.document.getElementsByName("SAVE_TERM")[0].value + "</keepyear>"
		+ " <fiscalyear>" + getFiscalYear(m_oFormEditor.document.getElementsByName("APPLIED")[0].value) + "</fiscalyear>"
		+ " <enforcedate>" + m_oFormEditor.document.getElementsByName("APPLIED")[0].value + "</enforcedate>"
		+ " <docsec>" + m_oFormEditor.document.getElementsByName("DOC_LEVEL")[0].value + "</docsec>"
		+ " <ispublic>" + ((m_oFormEditor.document.getElementsByName("ISPUBLIC")[0].value == '공개') ? 'Y' : 'N') + "</ispublic>";
    } else {
        forminfoext += " <catcode></catcode>"
		+ " <catname></catname>"
		+ " <keepyear></keepyear>"
		+ " <fiscalyear>" + ((m_oFormEditor.document.getElementsByName('fiscalyear')[0] == undefined) ? '' : m_oFormEditor.document.getElementsByName('fiscalyear')[0].value) + "</fiscalyear>"
		+ " <enforcedate></enforcedate>"
		+ " <docsec></docsec>"
		+ " <ispublic></ispublic>";
    }
    forminfoext += " <deptcode>" + getInfo("dpid") + "</deptcode>"
	+ " <deptpath>" + getInfo("dppathdn") + "</deptpath>"
	+ " <attach>"
    //+" <path>" + getInfo("fmpath") + getInfo("fiid") + "."+ ((getInfo("fmbt")=='dhml')?'htm':getInfo("fmbt")) +"</path>"  //결재본문path
	+ " <path>" + getInfo("fmpath") + getInfo("piid") + '_' + getInfo("fiid") + ".mht</path>" //결재본문path	
	+ " </attach>"
	+ " <circulation>" + (getInfo("scOPub") == '1' ? m_oFormEditor.CIRCULATION.value : '1') + "</circulation>"
	+ " <sentunitname>" + ((m_oFormEditor.SENT_OU_NAME == undefined) ? '' : m_oFormEditor.SENT_OU_NAME.value) + "</sentunitname>"
	+ " <regcomment>" + ((m_oFormEditor.REGISTRATION_COMMENT == undefined) ? '' : m_oFormEditor.REGISTRATION_COMMENT.value) + "</regcomment>"
	+ "</docinfo>"
	+ "<JFID>" + (getInfo("scChgr") == '1' ? getInfo("scChgrV") : '') + "</JFID>" //담당자처리
	+ "<IsChargeConfirm>" + (getInfo("scChgrConf") == '1' ? 'true' : 'false') + "</IsChargeConfirm>" //담당자 확인
	+ "<ChargeOU>" + (getInfo("scChgrOU") == '1' ? getInfo("scChgrOUV") : '') + "</ChargeOU>"
	+ "</forminfo></forminfoext>";
    return forminfoext;
    //	+"<IsReturn>"+(getInfo("scReturn")=='1'?'true':'false')+"</IsReturn>"

}
function getFiscalYear(sApplyDate) {
    var sFiscalYear = "";
    if (sApplyDate.substring(6, 7) >= 3) {
        sFiscalYear = sApplyDate.substring(0, 4)
    } else {
        sFiscalYear = sApplyDate.substring(0, 4) - 1;
    }
    return sFiscalYear;
}
function evalXML(sXML) {
    if (!m_evalXML.loadXML(sXML)) {
        var err = m_evalXML.parseError;
        throw new Error(err.errorCode, "desc:" + err.reason + "\nsrctxt:" + err.srcText + "\nline:" + err.line + "\tcolumn:" + err.linepos);
    }
}
function requestHTTP(sMethod, sUrl, bAsync, sCType, pCallback, vBody) {
    m_xmlHTTP.open(sMethod, sUrl, bAsync);
    m_xmlHTTP.setRequestHeader("Accept-Language", g_szAcceptLang);
    m_xmlHTTP.setRequestHeader("Content-type", sCType);
    if (pCallback != null) m_xmlHTTP.onreadystatechange = pCallback;
    (vBody != null) ? m_xmlHTTP.send(vBody) : m_xmlHTTP.send();
}
function receiveHTTP() {
    if (m_xmlHTTP.readyState == 4) {
        m_xmlHTTP.onreadystatechange = event_noop;
        var xmlReturn = m_xmlHTTP.responseXML;
        var bCompensate = false;
        var sParam = "top.close()";
        if (m_sReqMode == "EDMS") sParam = null;
        //m_oFormEditor.endProgress();
        if (xmlReturn.xml == "") {
            bCompensate = true;
            sParam = null;
            //alert(m_xmlHTTP.responseText);
        } else {
            var errorNode = xmlReturn.selectSingleNode("response/error");
            if (errorNode != null) {
                bCompensate = true;
                sParam = null;
                alert("Desc: " + errorNode.text);
            } else {
                switch (m_sReqMode) {
                    case "SAVE":
                        if (getInfo("mode") == "TEMPSAVE") {
                            parent.refreshList();
                            alert(gMessage261);
                        } else if (getInfo("mode") == "COMPLETE") {
                            parent.refreshList();
                            alert(gMessage261);
                        } else {
                            alert(gMessage261);
                        }
                        break;
                    case "TEMPSAVE": if (getInfo("mode") == "TEMPSAVE") parent.refreshList(); alert('임시함에 저장되었습니다.'); setInfo("mode", "TEMPSAVE"); setInfo("ftid", xmlReturn.selectSingleNode("response/ftid").text); break;
                    default: break;
                }
            }
        }
        if (bCompensate) {
            switch (m_sReqMode) {
                case "SAVE":
                    if (getInfo("mode") == "TEMPSAVE") { var sFiid = getInfo("fiid_spare"); setInfo("fiid_spare", getInfo("fiid")); setInfo("fiid", sFiid); } //fiid switching
                    break;
                default: break;
            }
        }
        disableBtns(false);
        //m_oFormEditor.endProgress(sParam);
        if (sParam != null) top.close();
    }
}
function event_noop() { return (false); }
function requestProcess(sReqMode) {
//debugger
    // m_oFormEditor.document.getElementsByName('DOC_NO')[0].value

    m_sReqMode = sReqMode;
    //if (confirm("처리하시겠습니까?"+(sReqMode=="TEMPSAVE"?"\n임시함 저장 시에는 발송번호와 발행매수는 저장되지 않습니다.":""))){				
    try {
        disableBtns(true);
        if (evaluateForm()) {
            var sTargetURL = "submitForm.aspx";
            var sMsgTitle;
            var sAddage;
            var aReqForm = getInfo("fmpf").split("_");
            switch (sReqMode) {
                case "SAVE":
                    sMsgTitle = gLabel_save;
                    if (getInfo("mode") == "TEMPSAVE") {
                        var sItem = "<request><item id=\"" + getInfo("ftid") + "\" fitn=\"" + getInfo("fitn") + "\" fiid=\"" + getInfo("fiid") + "\" fmpf=\"" + getInfo("fmpf") + "\"/></request>";
                        evalXML(sItem);
                        var sUrl = "../InstMgr/switchFT2Del.aspx";
                        requestHTTP("POST", sUrl, true, "text/xml", null, sItem);
                        receiveGeneralQuery();
                    }
                    if (m_oFormEditor.document.getElementsByName('ATTACH_FILE_INFO')[0].value != '') {//첨부파일 존재시 수행
                        //if (m_oFormEditor.AttFileInfo.innerHTML !=''  && m_oFormEditor.attach.value !=''){//첨부파일 존재시 수행
                        m_bFileSave = false;
                        //if(m_oFormEditor.ATTACH_FILE_INFO.value.indexOf("</fileinfos>") < 0)
                        if (m_oFormEditor.document.getElementsByName('ATTACH_FILE_INFO')[0].value.indexOf("</fileinfos>") < 0) {
                            try {
                                var sFiles = "<request><fileinfos>" + m_oFormEditor.document.getElementsByName('ATTACH_FILE_INFO')[0].value + "</fileinfos></request>";
                                evalXML(sFiles);
                                var sURL = "/CoviWeb/approval/FileAttach/fnMoveFilegetFileInfo.aspx";
                                receiveFileHTTP("POST", sURL, sFiles);
                            } catch (e) {
                                disableBtns(false);
                            }
                        } else {
                            m_bFileSave = true;
                        }
                    }


                    sAddage = makeNode("dpid") + makeNode("dpdsn")
						+ m_oFormEditor.getFormXML();
                    m_bFrmExtDirty = true;
                    break;
                case "TEMPSAVE":
                    sMsgTitle = gLabel_composing;
                    //if(getInfo("mode")=="REJECT"){} 반려뿐만 아니라 전체 문서 임시저장 가능																	
                    if (getInfo("mode") != "SAVE" && getInfo("mode") != "TEMPSAVE") { var sFiid = getInfo("fiid"); setInfo("fiid", getInfo("fiid_spare")); setInfo("fiid_spare", sFiid); }
                    sTargetURL = "../TempSave/saveForm.aspx";
                    //m_oFormEditor.dField["DOC_NO"].value = "";
                    m_oFormEditor.document.getElementsByName('DOC_NO')[0].value = "";
                    sAddage = makeNode("fmfn") + m_oFormEditor.getFormXML();

                    if (m_oFormEditor.AttFileInfo.innerHTML != '' && m_oFormEditor.attach.value != '') {//첨부파일 존재시 수행
                        m_bFileSave = false;
                        try {
                            var sFiles = "<request>" + m_oFormEditor.attach.value + "</request>";
                            evalXML(sFiles);
                            var sURL = "../FileAttach/fnMoveFilegetFileInfo.aspx";
                            receiveFileHTTP("POST", sURL, sFiles);
                        } catch (e) {
                            disableBtns(false);
                        }
                    }

                    m_bFrmExtDirty = true;
                    break;
                default:
                    alert("[" + sReqMode + "]" + gMessage72);
                    return;
            }
            try {
                //m_oFormEditor.beginProgress("잠시 기다려 주십시오...",sMsgTitle+"처리 중입니다...");
                var sText = "<request>" + getDefaultXML() + sAddage + "</request>";
                evalXML(sText);
                //alert(sText);
                requestHTTP("POST", sTargetURL, false, "text/xml", null, sText);
                receiveHTTP();
            } catch (e) {
                disableBtns(false);
                //m_oFormEditor.endProgress();
                alert(sMsgTitle + gMessage9 + "\nDesc:" + e.description + "\nError number: " + e.number);
            }
            try {
                parent.opener.setWorkList();
            } catch (e) { }
        } else {
            disableBtns(false);
        }
    } catch (e) { alert(e.description); }
    //}
}
var printDiv;
var btAction = "";
function doButtonAction2(obj) { //debugger

    var sUrl = "";
    var iWidth = 640;
    var iHeight = 480;
    var sSize = "fix";
    var sMode = getInfo("mode");
    btAction = obj.id;
    try {
        switch (obj.id) {
            case "btSave": //문서번호발급
                if (m_oFormEditor.document.getElementsByName("SUBJECT")[0].value == "")
                    throw new Error(-1, gMessage28);
                //if(txtIssueCount.value=="" || isNaN(txtIssueCount.value))
                //	throw new Error(-1,"발행매수를 입력하지 않았거나 올바른 숫자가 아닙니다.");
                //				if(m_oFormEditor.mField["RECEIVE_POST"].value=="")
                //					throw new Error(-1,"수신처를 입력하지 않았습니다.");
                //if(m_oFormEditor.dField["APPLIED"].value=="")
                if (m_oFormEditor.document.getElementsByName('APPLIED')[0].value == "")
                    throw new Error(-1, gMessage260);

                if (!confirm(gMessage77)) return;

                //var sEfDate = m_oFormEditor.dField["APPLIED"].value;
                var sEfDate = m_oFormEditor.document.getElementsByName('APPLIED')[0].value;
                sEfDate = sEfDate.substr(0, 4) + "/" + sEfDate.substr(5, 2) + "/" + sEfDate.substr(8, 2);

                //2008.08 우리금융 : REGISTRATION_COMMENT 에 항목 추가
                var sRecmt;
                if (getInfo("fmpf") == "OFFICIAL_DOCUMENT_03") { //수기문서
                    sRecmt = makeNode("approval", m_oFormEditor.document.getElementsByName('APPROVE')[0].value);
                } else if (getInfo("fmpf") == "OFFICIAL_DOCUMENT_01") { //직인날인부
                    sRecmt = makeNode("approval", m_oFormEditor.document.getElementsByName('APPROVE')[0].value)
				        + makeNode("receive", m_oFormEditor.document.getElementsByName('RECEIVE')[0].value)
				        + makeNode("stemp", m_oFormEditor.document.getElementsByName('STEMP')[0].value)
				        + makeNode("kind", "수기");
                } else if (getInfo("fmpf") == "OFFICIAL_DOCUMENT_04") { //대외공문발송
                    sRecmt = "수기";
                } else if (getInfo("fmpf") == "OFFICIAL_DOCUMENT_05") { //라이선스
                    sRecmt = "수기";
                }

                var sSealForiGate = ""; //직인날인 연동 - 물류관리    
                if (getInfo("fmpf") == "OFFICIAL_DOCUMENT_01") {
                    sSealForiGate = makeNode("sSNDSNDPL", m_oFormEditor.document.getElementsByName('APPROVE')[0].value)
				        + makeNode("sSEALXXGB", m_oFormEditor.document.getElementsByName('STEMP')[0].value)
				        + makeNode("sAPPRIDNT", m_oFormEditor.document.getElementsByName('APPRIDNT')[0].value);
                }

                var sItem = "<request>"
				 + makeNode("doclisttype", m_oFormEditor.document.getElementsByName('DOCUMENT_KIND')[0].value)
				 + makeNode("dpid_apv", getInfo("dpid_apv")) + makeNode("etnm") + makeNode("dpdn_apv") + makeNode("dpdsn")
				 + makeNode("docdpid", getInfo("etid"))
				 + makeNode("apvdate", getInfo("svdt"))
				 + makeNode("efdate", sEfDate)
				 + makeNode("subject", m_oFormEditor.document.getElementsByName('SUBJECT')[0].value)
				 + makeNode("regcmt", sRecmt)
				 + makeNode("rdpdn", m_oFormEditor.document.getElementsByName('RECEIVE_POST')[0].value)
				 + makeNode("usdn", getInfo("usdn"))
				 + makeNode("usid", getInfo("usid"))
				 + makeNode("indn", getInfo("usdn"))
				 + makeNode("inid", getInfo("usid"))
				 + makeNode("doc_class", m_oFormEditor.document.getElementsByName('DOC_CLASS_ID')[0].value)
				 + makeNode("doc_no", m_oFormEditor.document.getElementsByName('DOC_NO')[0].value)
				 + getFormInfosXML()
				 + sSealForiGate
				 + "</request>";
                evalXML(sItem);

                var sUrl = "RegisterDocumentList.aspx?actionmode=NEW";
                m_sReqMode = "REGISTERDOCNO";

                requestHTTP("POST", sUrl, true, "text/xml", receiveGeneralQuery, sItem);

                //receiveGeneralQuery();

                //		        requestProcess("SAVE");
                break;
            case "btTempSave": //임시저장

                if (m_oFormEditor.dField["SUBJECT"].value == "")
                    throw new Error(-1, gMessage28);
                if (m_oFormEditor.dField["APPLIED"].value == "")
                    throw new Error(-1, gMessage260);
                if (!confirm(gMessage28)) return;

                //if(m_oFormEditor.dField["DOC_NO"].value!=""){												
                if (m_oFormEditor.document.getElementsByName('DOC_NO')[0].value != "") {
                    var sItem = "<request>"
                    //+ makeNode("docno", m_oFormEditor.dField["DOC_NO"].value)						
					+ makeNode("docno", m_oFormEditor.document.getElementsByName('DOC_NO')[0].value)
					+ "</request>";
                    evalXML(sItem);
                    var sUrl = "RegisterDocumentList.aspx?actionmode=DELETE";
                    m_sReqMode = "";
                    requestHTTP("POST", sUrl, true, "text/xml", null, sItem);
                    receiveGeneralQuery();
                }
                requestProcess("TEMPSAVE");
                break;
            case "btPreView": //미리보기
                sSize = "resize"; iWidth = 790; iHeight = window.screen.availHeight - 100; sUrl = "PREVIEW.htm";
                openWindow(sUrl, "", iWidth, iHeight, sSize);
                break;
            case "btPrintView":  //인쇄 미리보기           
            case "btPrint":  //인쇄
                if (m_oFormEditor.location.pathname.indexOf('read.htm') > -1) {
                    printDiv = m_oFormEditor.bodytable.innerHTML; iWidth = 800; iHeight = 700; sUrl = "PrintForm.htm";
                } else if (m_oFormEditor.location.pathname.indexOf('read.htm') == -1) { // 글작성시 미리보기 2010.04.27
                    printDiv = m_oFormEditor.bodytable.innerHTML; iWidth = 800; iHeight = 700; sUrl = "PrintForm.htm";
                }
                else {
                    sUrl = "OD_PrintPREVIEW.htm"; m_oFormEditor.bgetCommentView = false; //404오류
                }
                if (sUrl != null) {
                    openWindow(sUrl, "", "1", "1", "fix"); //openWindowHidden
                }
                break;
            case "btCancel":
                if (sMode == "DRAFT") {
                    //if(m_oFormEditor.dField["DOC_NO"].value!=""){												
                    if (m_oFormEditor.document.getElementsByName('DOC_NO')[0].value != "") {
                        var sItem = "<request>"
							+ makeNode("docno", m_oFormEditor.document.getElementsByName('DOC_NO')[0].value)
							+ "</request>";
                        evalXML(sItem);
                        var sUrl = "RegisterDocumentList.aspx?actionmode=DELETE";
                        m_sReqMode = "";
                        requestHTTP("POST", sUrl, true, "text/xml", null, sItem);
                        receiveGeneralQuery();
                    }
                }
                parent.close();
                break;
            case "btAttach": //첨부파일
                if (!window.ActiveXObject) {//CB
                    attFile3(); iWidth = 280; iHeight = 150;
                } else {
                    if (gFileAttachType == "1") { //시스템 사용 첨부파일 컴포턴트 0 : CoviFileTrans, 1:DEXTUploadX					
                        attFile(); iWidth = 480; iHeight = 326;
                    } else {
                        attFile2(); iWidth = 480; iHeight = 326;
                    }
                }
                break;
        }
    } catch (e) { alert(e.description); }
}

function changeFormdata() {
    var szText;
    try {
        //m_oFormEditor.beginProgress('잠시 기다려 주십시오...','처리 중입니다...');
        szText = "<request>" + makeNode("piid", getInfo("piid"), null, false)
				+ makeNode("fmid", getInfo("fmid"), null, false)
				+ m_oFormEditor.getChangeFormXML() + "</request>"; //2003.04.21 수정 변경된 사항만 넘김
        evalXML(szText);
        requestHTTP("POST", "dosavebody.aspx", true, "text/xml", receiveHTTP, szText);
    } catch (e) {
        //m_oFormEditor.endProgress('top.close()');
        alert(gMessage73 + e.description + "\r\nError number: " + e.number);
    }
}
function makeXMLNode(sName, vVal, bCData) {
    return "<" + sName + ">" + (bCData ? "<![CDATA[" : "") + vVal + (bCData ? "]]>" : "") + "</" + sName + ">";
}

function makeNode(sName, vVal, sKey, bCData) {
    if (!window.ActiveXObject) {
        if (vVal == null) { m_cvtXML.textContent = getInfo((sKey != null ? sKey : sName)); } else { m_cvtXML.textContent = vVal; }
    } else {
        if (vVal == null) { m_cvtXML.text = getInfo((sKey != null ? sKey : sName)); } else { m_cvtXML.text = vVal; }
    }
    return "<" + sName + ">" + (bCData ? "<![CDATA[" : "") + (bCData ? m_cvtXML.text + "]]>" : m_cvtXML.xml) + "</" + sName + ">";
}


function HtmlEncode(text) {
    return text.replace(/&/g, '&amp').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function requestTempSaveProcess(sReqMode) {
    m_sReqMode = sReqMode;
    try {
        disableBtns(true);
        if (evaluateForm()) {
            var sTargetURL = "submitForm.aspx";
            var sMsgTitle;
            var sAddage;
            switch (sReqMode) {
                case "TEMPSAVE":
                    sMsgTitle = gLabel_personalSave;
                    var sFiid = getInfo("fiid"); setInfo("fiid", getInfo("fiid_spare")); setInfo("fiid_spare", sFiid); setInfo("mode", "REJECT");
                    sTargetURL = "../TempSave/saveForm.aspx";
                    sAddage = makeNode("fmfn") + m_oFormEditor.getFormXML();
                    m_bFrmExtDirty = true;
                    break;
            }
            try {
                //m_oFormEditor.beginProgress("잠시 기다려 주십시오...",sMsgTitle+"처리 중입니다...");
                var sText = "<request>" + getDefaultXML() + sAddage + "</request>";
                evalXML(sText);
                requestHTTP("POST", sTargetURL, false, "text/xml", null, sText);
                receiveHTTP();
            } catch (e) {
                disableBtns(false);
                //m_oFormEditor.endProgress();
                alert(sMsgTitle + gMessage9 + "\nDesc:" + e.description + "\nError number: " + e.number);
            }
        } else {
            disableBtns(false);
        }
    } catch (e) { alert(e.description); }
}
function receiveGeneralQuery() {
    if (m_xmlHTTP.readyState == 4) {
        m_xmlHTTP.onreadystatechange = event_noop;
        if (m_xmlHTTP.responseXML.xml == "") {
            //alert(m_xmlHTTP.responseText);
        } else {

            var errorNode = m_xmlHTTP.responseXML.selectSingleNode("response/error");
            if (errorNode != null) {
                //alert(errorNode.text);
                switch (m_sReqMode) {
                    case "REGISTERDOCNO":
                        //m_oFormEditor.dField["DOC_NO"].value = m_xmlHTTP.responseXML.selectSingleNode("response/docno").text;
                        m_oFormEditor.document.getElementsByName('DOC_NO')[0].value = m_xmlHTTP.responseXML.selectSingleNode("response/docno").text;
                        //btDocNo.disabled = true;
                        break;
                    default: break;
                }

            } else {
                switch (m_sReqMode) {
                    case "REGISTERDOCNO":
                        //m_oFormEditor.dField["DOC_NO"].value = m_xmlHTTP.responseXML.selectSingleNode("response/docno").text;
                        m_oFormEditor.document.getElementsByName('DOC_NO')[0].value = m_xmlHTTP.responseXML.selectSingleNode("response/docno").text;
                        //btDocNo.disabled = true;
                        break;
                    default: break;
                }
                if (btAction == "btSave") requestProcess("SAVE");
            }
        }
    }
    //2007-10-15 미리보기 창에서 하던 함수를 수정함
    function setPreView() {
        var sFormXml = parent.parent.opener.m_oFormEditor.getFormXML();
        if (sFormXml.indexOf("<BODY_CONTEXT>") == -1) {
            sFormXml = sFormXml.replace("</formdata>", "");
            sFormXml += makeNode("BODY_CONTEXT", getInfo("BODY_CONTEXT"));
            sFormXml += "</formdata>";
        }
        var xmlFormXML = CreateXmlDocument();
        xmlFormXML.loadXML(sFormXml);
        var FormNodes = xmlFormXML.documentElement.childNodes;
        var FormNode;
        for (var i = 0; i < FormNodes.length; i++) {
            FormNode = FormNodes[i];
            setInfo(FormNode.nodeName, FormNode.text);
        }
        setInfo("INITIATED_DATE", getInfo("svdt"));
        g_szEditable = false;
        setInfo("mode", "COMPLETE");
        setInfo("loct", "COMPLETE");

        parent.frames[1].height = "100%";
        parent.editor.location.href = getInfo("fmpf") + '_V' + getInfo("fmrv") + "_read.htm";
        setTimeout("setHeader()", 1000);
        var aBtn = document.getElementsByName("cbBTN");
        for (var i = 0; i < aBtn.length; i++) {
            aBtn[i].style.display = "none";
        }

        document.getElementById("btSave").style.display = "none";
        document.getElementById("btPrintView").style.display = "";
        document.getElementById("btExitPreView").style.display = "";

        clearInterval(timerID);
    }

}