var m_oApvList;
var m_oCCList;
var m_sApvMode;
//new dtd
var m_sSelectedStepType;
var m_sSelectedDivisionType;
//new dtd
var m_sSelectedRouteType;
var m_sSelectedUnitType;
var m_sSelectedAllotType;
var m_sSelectedStepRef;
var m_oXSLProcessor;
var m_oHTMLProcessor;
var m_oInfoSrc;
var m_oFormMenu;
var m_oFormEditor;
var m_xmlHTTP = CreateXmlHttpRequest();
var m_xmlHTTPXSL = CreateXmlHttpRequest();
var m_oCurrentOUNode;
var m_bCC;
var l_bGroup; //그룹참조여부
var m_sNAuthTL1 = '000'; //보직음없
var m_sNAuthTL2 = '31';
var m_modeless = null;
var PrivateYN = null; //20180731 개인결재선 추가시 변경 

function initialize() {
    //m_oInfoSrc --> [object]	
    m_oInfoSrc = top.opener;

    if (m_oInfoSrc == null) {
        m_oInfoSrc = parent.monitorList;
        if (m_oInfoSrc == null) {
            if (parent.iworklist.location.href.toUpperCase().indexOf("LISTITEMS.ASPX") > 0) { m_oInfoSrc = parent.iworklist; }
            else { m_oInfoSrc = parent.iworklist.ifrDL; }
        }
        m_sApvMode = getInfo("mode");
        if (m_sApvMode == "READ") { trButton.style.display = "none"; }
    } else {
        if (top.opener.g_dicFormInfo != null) {
            //m_sApvMode --> APVLINE
            m_sApvMode = getInfo("mode");
            initPrivateLineBtns();
        } else if (top.g_dicFormInfo != null) {
            m_oInfoSrc = top;
            m_sApvMode = getInfo("mode");
            initFormLineBtns();
        } else {
            m_oInfoSrc = top.opener.parent;
            m_sApvMode = getInfo("mode");
            initButtons();
        }
    }

    //m_oFormMenu --> [object]
    //m_oFormEditor --> [object]	
    //	    m_oFormMenu = m_oInfoSrc.menu;
    //	    m_oFormEditor = m_oInfoSrc.editor;

    m_oFormMenu = m_oInfoSrc.document.getElementById('menu');
    m_oFormEditor = m_oInfoSrc.document.getElementById('editor');

    try {
        m_oXSLProcessor = makeProcessor("ApvlineGen.xsl");
        //m_oHTMLProcessor = makeProcessorScript("ApvlineDisplay_xsl.aspx");
    } catch (e) { alert(e.description); return false; }

    m_oApvList = CreateXmlDocument();
    m_oCCList = CreateXmlDocument();
    m_oCCList.loadXML("<?xml version='1.0' encoding='utf-8'?><cc/>");
    //if(m_oFormMenu.APVLIST.value==""){		
    if (get_choiseIdOrName("APVLIST") == "") {
        requestHTTP("GET", "getApvSteps.aspx", true, "text/xml; charset=utf-8", initServerValues, null);
        //		m_xmlHTTP.open("GET",,false);
        //		m_xmlHTTP.onreadystatechange=initServerValues;
        //		m_xmlHTTP.send();				
    } else {
        //if(!m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+m_oFormMenu.APVLIST.value)){
        if (!m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + get_choiseIdOrName("APVLIST"))) {
            alertParseError(m_oApvList.parseError);
        } else {
            initiateCC();
            if (getInfo("loct") == 'APPROVAL' || getInfo("loct") == 'REDRAFT' || admintype == "ADMIN") {
                if (m_sApvMode == "REDRAFT" || m_sApvMode == "SUBREDRAFT" || m_sApvMode == "RECAPPROVAL" || m_sApvMode == "SUBAPPROVAL") {
                    if (m_sApvMode == "RECAPPROVAL" || m_sApvMode == "REDRAFT") {
                        m_oCurrentOUNode = m_oApvList.documentElement.selectSingleNode("division[@divisiontype='receive' and taskinfo/@status='pending']");
                    } else if (m_sApvMode == "SUBAPPROVAL") {
                        m_oCurrentOUNode = m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']/step[@unittype='ou']/ou[taskinfo/@status='pending' and taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']");
                    } else {
                        m_oCurrentOUNode = m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']/step[@unittype='ou']/ou[taskinfo/@status='pending' and taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']"); //@code='"+getInfo("dpid_apv")+"' 
                        if (m_oCurrentOUNode == null) {
                            m_oCurrentOUNode = m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']/step[@unittype='ou']/ou[taskinfo/@status='pending']");
                        }
                    }
                    try {
                        if (m_sApvMode == "REDRAFT" || m_sApvMode == "RECAPPROVAL") {
                            var elmCharge = m_oCurrentOUNode.selectSingleNode("step/ou/person[taskinfo/@kind='charge']");
                            if (elmCharge == null) {
                                var oChargeNode = getChargeNode();

                                var oStep = m_oApvList.createElement("step");
                                var oOU = m_oApvList.createElement("ou");
                                oStep.setAttribute("unittype", "person"); //ou
                                oStep.setAttribute("routetype", "approve"); //receive
                                oStep.setAttribute("name", strlable_ChargeDept_Rec); //"담당부서수신"
                                oOU.setAttribute("code", getInfo("dpid_apv"));
                                oOU.setAttribute("name", getInfo("dpdn_apv"));

                                if (oChargeNode != null) m_oCurrentOUNode.appendChild(oStep).appendChild(oOU).appendChild(oChargeNode);
                            }
                        } else {
                            var elmCharge = m_oCurrentOUNode.selectSingleNode("person[taskinfo/@kind='charge']");
                            if (elmCharge == null) {
                                var oChargeNode = getChargeNode();
                                if (oChargeNode != null) m_oCurrentOUNode.appendChild(oChargeNode);
                            }
                        }
                    } catch (e) { alert(e.description); return false; }
                }
                //공통 결재인 경우 결재자 추가를 방지한다.2007.05.31
                var elm = m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']/step[@unittype='person' and @routetype='approve' and @allottype='parallel' and taskinfo/@status='pending']");
                if (elm != null && (m_sApvMode == "APPROVAL" || m_sApvMode == "RECAPPROVAL")) {
                    m_SameApprove = true;
                    //tblPAudit.style.display=(getInfo("scPAdt")==1?"":"none");//감사추가
                    //tblPAudit.style.display=(getInfo("scDAdt")==1?"":"none");
                    document.getElementById("tblPerson").style.display = "none";
                    document.getElementById("tblPlPerson").style.display = "none";
                    document.getElementById("tblPConsult").style.display = "none"; document.getElementById("tblPConsult2").style.display = "none";
                    document.getElementById("tblDConsult").style.display = "none";
                    document.getElementById("tblReceipt").style.display = "none";
                    document.getElementById("tblCharge").style.display = "none"; //수신자버튼 활성화 2006.08 by sunnyhwang
                    document.getElementById("tblGroup").style.display = "none";
                    document.getElementById("tblPAssist").style.display = "none"; document.getElementById("tblPAssistPL").style.display = "none";
                    document.getElementById("tblDAssist").style.display = "none";
                    document.getElementById("dvCC").style.display = "none";

                    document.getElementById("dvCommon").style.display = "none";
                    document.getElementById("dvAudit").style.display = "none";

                    //동시결재자 각각이 결재선을 변경할 없도록 한다.
                    //2007.10.08 by JSK
                    document.getElementById("btUp").parentNode.parentNode.parentNode.style.display = "none";
                    document.getElementById("btDeleteCC").parentNode.parentNode.style.display = "none";
                    document.getElementById("btDeleteRec").parentNode.parentNode.style.display = "none";
                }
            }
            refreshList();
            refreshCC(true);
        }
    }
    return true;
}
function initiateCC() {
    var ccList = m_oApvList.selectNodes("steps/ccinfo");

    if (ccList.length > 0) {
        var elm = ccList.nextNode();
        while (elm != null) {
            m_oCCList.documentElement.appendChild(elm.cloneNode(true));
            elm = ccList.nextNode();
        }
    }
}

function initServerValues() {
    if (m_xmlHTTP.readyState == 4) {

        m_xmlHTTP.onreadystatechange = event_noop;
        if (m_xmlHTTP.responseText.charAt(0) == "\r") {

        } else {
            var errorNode = m_xmlHTTP.responseXML.selectSingleNode("error");
            if (errorNode != null) {
                alert(strMsg_030 + "\n at initServerValues in ApvlineMgr.js\nError Desc:" + errorNode.text); //"오류가 발생했습니다."
            }
            else {
                try {
                    m_oFormMenu.APVLIST.value = m_xmlHTTP.responseXML.xml;
                }
                catch (e) {//이준희(2010-12-22): Added to support SharePoint environment.
                    m_oFormMenu.childNodes[0].value = m_xmlHTTP.responseXML.xml;
                }
                m_oApvList.loadXML(m_xmlHTTP.responseXML.xml);
                initiateCC();
                refreshList();
                refreshCC(true);
            }
        }
    }
}
function event_noop() { return (false); }
function makeProcessor(urlXsl) {
    if (("ActiveXObject" in window)) {
        var oXslDom = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
        oXslDom.async = false;
        if (!oXslDom.load(urlXsl)) {
            alertParseError(oXslDom.parseError);
            throw new Error(-1, "couldn't make TemplateProcessor with [" + urlXsl + "].");
        }
        var oXSLTemplate = new ActiveXObject("MSXML2.XSLTemplate");
        oXSLTemplate.stylesheet = oXslDom;
        return oXSLTemplate.createProcessor();
    } else {
        var oProcessor = new XSLTProcessor();
        var oXSL = "";
        var oXslDom = CreateXmlDocument();
        var oXMLHttp = CreateXmlHttpRequest();
        oXMLHttp.open("GET", urlXsl, false);
        oXMLHttp.send();
        //시간 늘리기
        delay(600);
        if (oXMLHttp.status == 200) {
            var parser = new DOMParser();
            oXslDom = parser.parseFromString(oXMLHttp.responseText, "text/xml");
            oProcessor.importStylesheet(oXslDom);
        }
        return oProcessor;
    }
}
function makeProcessorScript(urlXsl) {
    var oXSL = "";
    var oXslDom = CreateXmlDocument();
    var oXMLHttp = CreateXmlHttpRequest();
    oXMLHttp.open("GET", urlXsl, false);
    oXMLHttp.send();
    //시간 늘리기
    delay(600);
    if (oXMLHttp.status == 200) {
        oXSL = oXMLHttp.responseText;
    }
    return oXSL;
}
function delay(gap) {/*gap is in milisecs*/
    var then, now;
    then = new Date().getTime();
    now = then;
    while ((now - then) < gap) {
        now = new Date().getTime();
    }
}
function initButtons() {
    document.getElementById("dvCommon").style.display = "";
    document.getElementById("dvCC").style.display = (getInfo("scCC") == "1" ? "" : "none");
    document.getElementById("dvCommon").style.height = (getInfo("scCC") == "1" ? 250 : 400) + "px";
    document.getElementById("tblapvinfo").style.height = (getInfo("scCC") == "1" ? 195 : 414) + "px"; document.getElementById("Apvlist").style.height = document.getElementById("tblapvinfo").style.height;
    document.getElementById("divccinfomain").style.display = (getInfo("scCC") == "1" ? "" : "none");
    m_bCC = (getInfo("scCC") == "1" ? true : false);

    document.getElementById("tblPerson").style.display = "";
    document.getElementById("btSaveApvLine").style.display = "none";
    document.getElementById("dvAudit").style.display = (getInfo("scAudt") == 1 ? "" : "none"); //감사
    try { if ((getInfo("mode") == "REDRAFT" || getInfo("mode") == "RECAPROVAL") && (getInfo("scDRec") == "1" || getInfo("scChgr") == "1" || getInfo("scChgrOU") == "1" || getInfo("scIPub") == "1")) { document.getElementById("tblReceiptRef").style.display = ""; document.getElementById("tblDraftRef").style.display = "none"; } } catch (e) { }
    try { if (getInfo("fmpf") == "WF_CONFERENCE") { document.getElementById("tblDraftRef").style.display = ""; document.getElementById("tblReceiptRef").style.display = "none"; } } catch (e) { }

    //2009.02 관리자 기능 추가
    if (admintype == 'ADMIN') {//관리자로 결재선관리 open 한 경우
        if (getInfo("loct") == "PREAPPROVAL" || getInfo("loct") == "APPROVAL" || getInfo("loct") == "PROCESS" && m_sApvMode != "REJECT") {
            document.getElementById("tblPConsult").style.display = (getInfo("scPAgr") == 1 ? "" : "none"); document.getElementById("tblPConsult2").style.display = (getInfo("scPAgrSEQ") == 1 ? "" : "none");
            document.getElementById("tblDConsult").style.display = (getInfo("scDAgr") == 1 ? "" : "none"); document.getElementById("tblDConsult2").style.display = (getInfo("scDAgrSEQ") == 1 ? "" : "none");
            document.getElementById("tblReceipt").style.display = (getInfo("scDRec") == 1 ? "" : "none");
            document.getElementById("tblCharge").style.display = (getInfo("scPRec") == 1 ? "" : "none"); //수신자버튼 활성화 2006.08 by sunnyhwang
            //document.getElementById("tblGroup").style.display=(getInfo("scGRec")==1?"":"none");
            document.getElementById("tblPAssist").style.display = (getInfo("scPCoo") == 1 ? "" : "none"); document.getElementById("tblPAssistPL").style.display = (getInfo("scPCooPL") == 1 ? "" : "none");
            document.getElementById("tblDAssist").style.display = (getInfo("scDCoo") == 1 ? "" : "none"); document.getElementById("tblDAssistPL").style.display = (getInfo("scDCooPL") == 1 ? "" : "none");
            document.getElementById("tblPReview").style.display = (getInfo("scReview") == 1 ? "" : "none");
            if (getInfo("scIPub") == 1) initDeplyList();
            //20110318 확인/참조결재
            document.getElementById("tblPersonConfirm").style.display = (getInfo("scPConfirm") == 1 ? "" : "none");
            document.getElementById("tblPersonShare").style.display = (getInfo("scPShare") == 1 ? "" : "none");
        } else {
            document.getElementById("dvCommon").style.display = "none";
            document.getElementById("dvAudit").style.display = "none";
            m_bCC = false;
        }
    } else if (getInfo("loct") == "PREAPPROVAL" || getInfo("loct") == "COMPLETE" && m_sApvMode != "REJECT") {
        document.getElementById("dvCommon").style.display = "none";
        document.getElementById("dvAudit").style.display = "none";
        m_bCC = false;
    } else {
        switch (m_sApvMode) {
            case "APPROVAL":
                document.getElementById("tblPAudit").style.display = (getInfo("scPAdt") == 1 ? "" : "none"); //감사추가
                document.getElementById("tblDAudit").style.display = (getInfo("scDAdt") == 1 ? "" : "none");
                document.getElementById("tblPAudit1").style.display = (getInfo("scPAdt1") == 1 ? "" : "none"); //감사추가
                document.getElementById("tblDAudit1").style.display = (getInfo("scDAdt1") == 1 ? "" : "none");
                document.getElementById("tblPConsult").style.display = (getInfo("scPAgr") == 1 ? "" : "none"); document.getElementById("tblPConsult2").style.display = (getInfo("scPAgrSEQ") == 1 ? "" : "none");
                document.getElementById("tblDConsult").style.display = (getInfo("scDAgr") == 1 ? "" : "none"); document.getElementById("tblDConsult2").style.display = (getInfo("scDAgrSEQ") == 1 ? "" : "none");
                document.getElementById("tblReceipt").style.display = (getInfo("scDRec") == 1 ? "" : "none");
                document.getElementById("tblCharge").style.display = (getInfo("scPRec") == 1 ? "" : "none"); //수신자버튼 활성화 2006.08 by sunnyhwang
                //document.getElementById("tblGroup").style.display=(getInfo("scGRec")==1?"":"none");
                document.getElementById("tblPAssist").style.display = (getInfo("scPCoo") == 1 ? "" : "none"); document.getElementById("tblPAssistPL").style.display = (getInfo("scPCooPL") == 1 ? "" : "none");
                document.getElementById("tblDAssist").style.display = (getInfo("scDCoo") == 1 ? "" : "none"); document.getElementById("tblDAssistPL").style.display = (getInfo("scDCooPL") == 1 ? "" : "none"); //순차합의 --> 합의에서 받아서 처리
                //document.getElementById("tblDAuditETC.style.display=(getInfo("scDCoo")==1?"":"none"); //부서감시 --> 협조에서 받아서 처리
                if (getInfo("scIPub") == 1) initDeplyList();
                document.getElementById("tblPReview").style.display = (getInfo("scReview") == 1 ? "" : "none");
                //20110318 확인/참조결재
                document.getElementById("tblPersonConfirm").style.display = (getInfo("scPConfirm") == 1 ? "" : "none");
                document.getElementById("tblPersonShare").style.display = (getInfo("scPShare") == 1 ? "" : "none");
                break;
            case "RECAPPROVAL":
                document.getElementById("tblPAudit").style.display = (getInfo("scPAdt") == 1 ? "" : "none");
                document.getElementById("tblDAudit").style.display = (getInfo("scDAdt") == 1 ? "" : "none");
                document.getElementById("tblPAudit1").style.display = (getInfo("scPAdt1") == 1 ? "" : "none");
                document.getElementById("tblDAudit1").style.display = (getInfo("scDAdt1") == 1 ? "" : "none");
                document.getElementById("tblPConsult").style.display = (getInfo("scPAgr") == 1 ? "" : "none"); document.getElementById("tblPConsult2").style.display = (getInfo("scPAgrSEQ") == 1 ? "" : "none");
                //document.getElementById("tblDConsult").style.display=(getInfo("scDAgr")==1?"":"none");tblDConsult2.style.display=(getInfo("scDAgrSEQ")==1?"":"none");
                document.getElementById("tblDConsult").style.display = "none"; tblDConsult2.style.display = "none";
                document.getElementById("tblReceipt").style.display = "none";
                document.getElementById("tblGroup").style.display = "none";
                document.getElementById("tblPAssist").style.display = (getInfo("scPCoo") == 1 ? "" : "none"); document.getElementById("tblPAssistPL").style.display = (getInfo("scPCooPL") == 1 ? "" : "none");
                document.getElementById("tblDAssist").style.display = "none"; document.getElementById("tblDAssistPL").style.display = "none";
                //20110318 확인/참조결재
                document.getElementById("tblPersonConfirm").style.display = (getInfo("scPConfirm") == 1 ? "" : "none");
                document.getElementById("tblPersonShare").style.display = (getInfo("scPShare") == 1 ? "" : "none");

                break;
            case "SUBAPPROVAL":
                document.getElementById("tblPConsult").style.display = "none"; document.getElementById("tblPConsult2").style.display = "none";
                document.getElementById("tblDConsult").style.display = "none";
                document.getElementById("tblReceipt").style.display = "none";
                document.getElementById("tblGroup").style.display = "none";
                document.getElementById("tblPAssist").style.display = "none"; document.getElementById("tblPAssistPL").style.display = "none";
                document.getElementById("tblDAssist").style.display = "none"; document.getElementById("tblDAssistPL").style.display = "none";
                document.getElementById("divccinfomain").style.display = "none"; document.getElementById("dvCC").style.display = "none";
                document.getElementById("tblapvinfo").style.height = 414 + "px"; document.getElementById("Apvlist").style.height = document.getElementById("tblapvinfo").style.height;
                break;
            case "CHARGE":
                document.getElementById("tblPConsult").style.display = "none"; document.getElementById("tblPConsult2").style.display = "none";
                document.getElementById("tblDConsult").style.display = "none"; document.getElementById("tblDConsult2").style.display = "none";
                document.getElementById("tblReceipt").style.display = "none";
                document.getElementById("tblGroup").style.display = "none";
                document.getElementById("tblPAssist").style.display = "none"; document.getElementById("tblPAssistPL").style.display = "none";
                document.getElementById("tblDAssist").style.display = "none"; document.getElementById("tblDAssistPL").style.display = "none";
                break;
            case "REDRAFT":
                document.getElementById("tblPAudit").style.display = (getInfo("scPAdt") == 1 ? "" : "none");
                document.getElementById("tblDAudit").style.display = (getInfo("scDAdt") == 1 ? "" : "none");
                document.getElementById("tblPConsult").style.display = (getInfo("scPAgr") == 1 ? "" : "none"); document.getElementById("tblPConsult2").style.display = (getInfo("scPAgrSEQ") == 1 ? "" : "none");
                document.getElementById("tblDConsult").style.display = "none"; document.getElementById("tblDConsult2").style.display = "none";
                document.getElementById("tblReceipt").style.display = "none";
                document.getElementById("tblGroup").style.display = "none";
                document.getElementById("tblPAssist").style.display = (getInfo("scPCoo") == 1 ? "" : "none"); document.getElementById("tblPAssistPL").style.display = (getInfo("scPCooPL") == 1 ? "" : "none");
                /*
                    191216_김선재 : 특정 결재문서 문서수신 시 "부서합의" 버튼 넣기
                */
                if(
                    getInfo("fmpf").toUpperCase() == "WF_FORM_ERP_EVENT" /*경조금 신청서*/
                ) {
                    document.getElementById("tblDAssist").style.display = ""; document.getElementById("tblDAssistPL").style.display = "none";
                }else {
                    document.getElementById("tblDAssist").style.display = "none"; document.getElementById("tblDAssistPL").style.display = "none";
                }
                document.getElementById("divtApvLine").style.display = "";
                //document.getElementById("tApvLine").style.display="";
                //document.getElementById("tblApplyLine").style.display=""; //개인결재선적용
                //iApvLine.location.href = "../Apvlinelist/PrivateLineList.aspx";
                //20110318 확인/참조결재
                document.getElementById("tblPersonConfirm").style.display = (getInfo("scPConfirm") == 1 ? "" : "none");
                document.getElementById("tblPersonShare").style.display = (getInfo("scPShare") == 1 ? "" : "none");
                document.getElementById("tblCharge").style.display = (getInfo("scPRec") == 1 ? "" : "none"); //N단결재수신자버튼 활성화 2011.06 by sunnyhwang
                break;
            case "SUBREDRAFT":
                document.getElementById("tblPConsult").style.display = "none"; document.getElementById("tblPConsult2").style.display = "none";
                document.getElementById("tblDConsult").style.display = "none"; document.getElementById("tblDConsult2").style.display = "none";
                document.getElementById("tblReceipt").style.display = "none";
                document.getElementById("tblGroup").style.display = "none";
                document.getElementById("tblPAssist").style.display = "none"; document.getElementById("tblPAssistPL").style.display = "none";
                document.getElementById("tblDAssist").style.display = "none"; document.getElementById("tblDAssistPL").style.display = "none";
                document.getElementById("divtApvLine").style.display = "";
                document.getElementById("divccinfomain").style.display = "none";
                document.getElementById("dvCC").style.display = "none";
                //document.getElementById("tApvLine.style.display="";
                //document.getElementById("tblApplyLine.style.display=""; //개인결재선적용
                document.getElementById("tblapvinfo").style.height = 414 + "px"; document.getElementById("Apvlist").style.height = document.getElementById("tblapvinfo").style.height;
                //iApvLine.location.href = "../Apvlinelist/PrivateLineList.aspx";
                break;
            case "PCONSULT":
                document.getElementById("dvCommon").style.display = "none";
                document.getElementById("dvAudit").style.display = "none";
                //오른쪽 버튼 활성화 막기
                document.getElementById("btResetLine").style.display = "none";
                document.getElementById("btUp").style.display = "none";
                document.getElementById("btDown").style.display = "none";
                document.getElementById("btDelete").style.display = "none";
                document.getElementById("btDeleteCC").style.display = "none";
                break;
            case "PROCESS":
                document.getElementById("dvCommon").style.display = "none";
                document.getElementById("dvAudit").style.display = "none";
                //오른쪽 버튼 활성화 막기
                document.getElementById("btResetLine").style.display = "none";
                document.getElementById("btUp").style.display = "none";
                document.getElementById("btDown").style.display = "none";
                document.getElementById("btDelete").style.display = "none";
                document.getElementById("btDeleteCC").style.display = "none";
                break;
            case "COMPLETE":
                document.getElementById("dvCommon").style.display = "none";
                document.getElementById("dvAudit").style.display = "none";
                //오른쪽 버튼 활성화 막기
                document.getElementById("btResetLine").style.display = "none";
                document.getElementById("btUp").style.display = "none";
                document.getElementById("btDown").style.display = "none";
                document.getElementById("btDelete").style.display = "none";
                document.getElementById("btDeleteCC").style.display = "none";
                break;
            case "REJECT":
                document.getElementById("dvCommon").style.display = "none";
                document.getElementById("dvAudit").style.display = "none";
                //오른쪽 버튼 활성화 막기
                document.getElementById("btResetLine").style.display = "none";
                document.getElementById("btUp").style.display = "none";
                document.getElementById("btDown").style.display = "none";
                document.getElementById("btDelete").style.display = "none";
                document.getElementById("btDeleteCC").style.display = "none";
                break;
            case "MONITOR":
                document.getElementById("dvCommon").style.display = "none";
                document.getElementById("dvAudit").style.display = "none";
                document.getElementById("dvCC").style.display = "none";
                break;
            case "PREAPPROVAL":
                document.getElementById("dvCommon").style.display = "none";
                document.getElementById("dvAudit").style.display = "none";
                document.getElementById("dvCC").style.display = "none";
                break;
            case "":
                m_bCC = false;
                break;
            default:
                document.getElementById("tblPAudit").style.display = (getInfo("scPAdt") == 1 ? "" : "none");
                document.getElementById("tblDAudit").style.display = (getInfo("scDAdt") == 1 ? "" : "none");
                document.getElementById("tblPAudit1").style.display = (getInfo("scPAdt1") == 1 ? "" : "none");
                document.getElementById("tblDAudit1").style.display = (getInfo("scDAdt1") == 1 ? "" : "none");
                document.getElementById("tblPConsult").style.display = (getInfo("scPAgr") == 1 ? "" : "none"); document.getElementById("tblPConsult2").style.display = (getInfo("scPAgrSEQ") == 1 ? "" : "none");
                document.getElementById("tblDConsult").style.display = (getInfo("scDAgr") == 1 ? "" : "none"); document.getElementById("tblDConsult2").style.display = (getInfo("scDAgrSEQ") == 1 ? "" : "none");
                document.getElementById("tblReceipt").style.display = (getInfo("scDRec") == 1 ? "" : "none");
                document.getElementById("tblCharge").style.display = (getInfo("scPRec") == 1 ? "" : "none"); //수신자버튼 활성화 2006.08 by sunnyhwang
                //document.getElementById("tblGroup").style.display=(getInfo("scGRec")==1?"":"none");
                document.getElementById("tblPAssist").style.display = (getInfo("scPCoo") == 1 ? "" : "none"); document.getElementById("tblPAssistPL").style.display = (getInfo("scPCooPL") == 1 ? "" : "none");

                document.getElementById("tblDAssist").style.display = (getInfo("scDCoo") == 1 ? "" : "none"); document.getElementById("tblDAssistPL").style.display = (getInfo("scDCooPL") == 1 ? "" : "none"); //순차합의 --> 합의에서 받아서 처리
                //document.getElementById("tblDAuditETC").style.display=(getInfo("scDAdt")==2?"":"none"); //부서감시 --> 협조에서 받아서 처리
                if (getInfo("scIPub") == 1) initDeplyList();
                document.getElementById("divtApvLine").style.display = "";
                //document.getElementById("tApvLine").style.display="";
                //document.getElementById("tblApplyLine").style.display=""; //개인결재선적용
                document.getElementById("btSaveApvLine").style.display = "none"; //결재선 저장
                //iApvLine.location.href = "../Apvlinelist/PrivateLineList.aspx";
                try { document.getElementById("tblPlPerson").style.display = (getInfo("scPApprover") == 1 ? "" : "none"); } catch (e) { } //동시결재

                document.getElementById("tblExtType").style.display = (getInfo("scExtType") == 1 ? "" : "none"); //특이결재
                document.getElementById("tblPReview").style.display = (getInfo("scReview") == 1 ? "" : "none");

                //20110318 확인/참조결재
                document.getElementById("tblPersonConfirm").style.display = (getInfo("scPConfirm") == 1 ? "" : "none");
                document.getElementById("tblPersonShare").style.display = (getInfo("scPShare") == 1 ? "" : "none");
                break;
        }
    }

}
//2007.04 by sunny - 배포처 초기화 작업 공통함수 생성
function initDeplyList() {
    document.getElementById("tblRecDept").style.display = (getInfo("scIPub") == 1 ? "" : "none");
    document.getElementById("dvRec").style.display = (getInfo("scIPub") == 1 ? "" : "none");
    //배포처 size 키우기
    if (getInfo("scIPub") == "1") {
        document.getElementById("tblapvinfo").style.height = (getInfo("scCC") == "1" ? 120 : 200) + "px"; document.getElementById("Apvlist").style.height = document.getElementById("tblapvinfo").style.height;
        document.getElementById("tdrecinfo").style.height = (getInfo("scCC") == "1" ? 125 : 180) + "px";
        document.getElementById("tdccinfo").style.height = (getInfo("scCC") == "1" ? 100 : 10) + "px";
        document.getElementById("dvCommon").style.height = (getInfo("scCC") == "1" ? 160 : 210) + "px";
        document.getElementById("dvRec").style.height = 90 + "px";
        document.getElementById("dvCC").style.height = (getInfo("scCC") == "1" ? 140 : 10) + "px";
        try { ListItems.frameElement.height = 205 + "px"; } catch (e) { }
        chkAction(mType);

    }
    document.getElementById("divTabExt").style.display = (getInfo("scIPub") == 1 ? "" : "none");
    document.getElementById("divrecinfo").style.display = (getInfo("scIPub") == 1 ? "" : "none");
    //document.getElementById("divtDeployList").style.display=(getInfo("scGRec")==1?"":"none");   //2013-03-15 HIW
    //document.getElementById("divtPersonDeployList").style.display=(getInfo("scIPub")==1?"":"none");  //2013-03-15 HIW
    if (getInfo("scGRec") == 1) { iDeployList.location.href = "../ApvLineList/DeployList.aspx"; } //GroupList.aspx"
}
function initPrivateLineBtns() {
    document.getElementById("dvCommon").style.display = "";
    document.getElementById("tblPerson").style.display = "";
    document.getElementById("tblPAssist").style.display = "";
    document.getElementById("tblPersonShare").style.display = "";
    document.getElementById("tblReceipt").style.display = "none";
    document.getElementById("tblDAssist").style.display = "";
    document.getElementById("tblPConsult").style.display = "none";
    document.getElementById("tblDConsult").style.display = "none"; document.getElementById("divDConsult").style.display = "none";
    document.getElementById("tblPAudit").style.display = "none";
    document.getElementById("tblDAudit").style.display = "none";
    document.getElementById("dvAudit").style.display = "none";
    document.getElementById("dvCC").style.display = "none";
    document.getElementById("btResetLine").style.display = "none";
    document.getElementById("btSaveApvLine").style.display = "none";
    document.getElementById("tblapvinfo").style.height = 414 + "px"; document.getElementById("Apvlist").style.height = document.getElementById("tblapvinfo").style.height;

    try { document.getElementById("tblPlPerson").style.display = "none"; } catch (e) { } //동시결재
}
function initFormLineBtns() {
    document.getElementById("dvCommon").style.display = "";
    document.getElementById("tblPerson").style.display = "";
    document.getElementById("tblReceipt").style.display = "none";
    document.getElementById("tblPAssist").style.display = "none";
    document.getElementById("tblDAssist").style.display = "none";
    document.getElementById("tblPConsult").style.display = "none";
    document.getElementById("tblDConsult").style.display = "none"; document.getElementById("divDConsult").style.display = "none";
    document.getElementById("dvAudit").style.display = "none";
    document.getElementById("dvCC").style.display = "none";
    document.getElementById("btResetLine").style.display = "none";
    document.getElementById("btSaveApvLine").style.display = "none";
    //신청서 수신처 추가 for BC
    document.getElementById("tblReceipt").style.display = "none";
    document.getElementById("tblCharge").style.display = "";
    document.getElementById("tblapvinfo").style.height = 414 + "px"; document.getElementById("Apvlist").style.height = document.getElementById("tblapvinfo").style.height;
}

function getInfo(sKey) { try { return m_oInfoSrc.g_dicFormInfo.item(sKey); } catch (e) { alert(strMsg_254 + sKey + strMsg_255); } } //"양식정보에 없는 키값["+sKey+"]입니다."

function alertParseError(err) {
    alert(strMsg_030 + "\n in ApvlineMgr.js\ndesc:" + err.reason + "\nsrcurl:" + err.url + "\nsrctxt:" + err.srcText + "\nline:" + err.line + "\tcolumn:" + err.linepos); //"오류가 발생했습니다."
}
function deleteSelfAndParent(elmCur, sLimit) {

    var elmParent = elmCur.parentNode;
    do {
        var nodeName = elmCur.nodeName;
        if (nodeName == "division" || nodeName == sLimit || elmParent.selectNodes(nodeName).length > 1) {
            var elmDeleted = elmParent.removeChild(elmCur);
            return elmDeleted;
        } else if (nodeName == "step" || nodeName == sLimit || elmParent.selectNodes(nodeName).length > 1) {
            var elmDeleted = elmParent.removeChild(elmCur);
            return elmDeleted;
        } else if (nodeName == "step" || nodeName == sLimit || elmParent.selectNodes(nodeName).length > 1 || elmParent.selectNodes("step").length == 1) {
            elmCur = elmParent;
            elmParent = elmCur.parentNode;
        } else {
            elmCur = elmParent;
            elmParent = elmCur.parentNode;
        }
    } while (elmParent != null);
}
function convertSignTypeToAllotType(sSignType) {
    var sAllotType;
    switch (sSignType) {
        case strlable_normalapprove: sAllotType = ""; break; //"일반결재"
        case strlable_Seq: sAllotType = "serial"; break; 	 //"순차합의"
        case strlable_Par: sAllotType = "parallel"; break;  //"병렬합의"
    }
    return sAllotType;
}
function convertUserSignTypeToKind(sSignType, bConsult) {
    var sKind;
    switch (sSignType) {
        case strlable_normalapprove: sKind = (bConsult ? "consent" : "normal"); break; //"일반결재"
        case strlable_NoApprvl: sKind = "normal"; break; 												 //"결재안함"
        case strlable_authorize: sKind = "authorize"; break; 										 //"전결"
        case strlable_substitue: sKind = "substitute"; break; 										 //"대결"
        case strlable_review: sKind = "review"; break; 													 //"후결"
        case strlable_after: sKind = "bypass"; break; 														 //"사후보고"
    }
    return sKind;
}
function interpretSignStatus(sSignStatus, bConsult, bPending, sStatus, sResult) {
    switch (sSignStatus) {
        case strlable_inactive: sStatus = (bPending ? "pending" : "inactive"); sResult = (bPending ? "pending" : "inactive"); break; //"대기"
        case strlable_apv: sStatus = "completed"; sResult = (bConsult ? "agreed" : "completed"); break; 											  //"결재" 
        case strlable_authorize: sStatus = "completed"; sResult = "authorized"; break; 																			//"전결"
        case strlable_review: sStatus = "completed"; sResult = "reviewed"; break; 																					//"후결"
        case strlable_after: sStatus = "completed"; sResult = "bypassed"; break; 																						//"사후보고"
        case strlable_substitue: sStatus = "completed"; sResult = "substituted"; break; 																		//"대결"
        case lbl_reject: sStatus = (bConsult ? "completed" : "rejected"); sResult = (bConsult ? "disagreed" : "rejected"); break; 	//"반송"        
        case strlable_hold: sStatus = "reserved"; sResult = "reserved"; break; 																						  //"보류"
    }
}
function interpretType(sType, sUnitType, sRouteType) {
    switch (sType) {
        case strlable_normalapprove: sUnitType = "person"; sRouteType = "approve"; break; //"일반결재"
        case strlable_DeptConsent: sUnitType = "ou"; sRouteType = "consult"; break;       //"부서합의"
        case strlable_PersonalCon: sUnitType = "person"; sRouteType = "consult"; break;   //"개인합의"
        case strlable_recieve_apv: sUnitType = "ou"; sRouteType = "receive"; break;       //"수신결재"
        case strlable_audit_fulltime: sUnitType = "role"; sRouteType = "audit"; break;    //"상근감사"		
        case strlable_audit_daily: sUnitType = "ou"; sRouteType = "audit"; break;         //"일상감사"
        case strlable_assist: sUnitType = "ou"; sRouteType = "assist"; break;             //"협조"
        case strlable_assist: sUnitType = "person"; sRouteType = "assist"; break;         //"협조"
        case strlable_PublicInspect: sUnitType = "ou"; sRouteType = "review"; break;      //"공람"
        case strlable_SendInfo: sUnitType = "ou"; sRouteType = "notify"; break;           //"통보"
        default: sUnitType = "person"; sRouteType = "approve"; break;
    }
}
function getSplitted(src, delim, idx) { var aSrc = src.split(delim); return (aSrc.length > idx ? aSrc[idx] : ""); }
function recalcXPath(orgXPath, elmName, diff) {
    var idxbegin;
    var idxend;

    if (elmName != "person") {
        idxbegin = orgXPath.indexOf(elmName) + elmName.length + 1;
        idxend = orgXPath.indexOf("]", idxbegin);
    } else {
        idxbegin = orgXPath.indexOf(elmName) + elmName.length + 7;
        idxend = orgXPath.indexOf("]", idxbegin)
    }

    var prefix = orgXPath.substr(0, idxbegin);
    var suffix = orgXPath.substr(idxend);

    var idx = (diff == 0 ? 0 : parseInt(orgXPath.substring(idxbegin, idxend)) + diff);
    if (idx < 0) idx = 0;
    return prefix + idx + suffix;
}
function getFamilyAttribute(elmCur, sTargetNode, sAttrName) {
    var elmParent = elmCur;
    while (elmParent != null) {
        if (elmParent.nodeName == sTargetNode) {
            return elmParent.getAttribute(sAttrName);
        }
        elmParent = elmParent.parentNode;
    }
    return null;
}
function getSibling(elmCur, sLevel, sKeyName, sKeyValue, bNext, bIgnoreCurrentLevel) {
    var elmLevelCur = elmCur;
    var elmChildPath;
    bIgnoreCurrentLevel = (bIgnoreCurrentLevel == null ? false : bIgnoreCurrentLevel);
    while (elmLevelCur != null) {
        if (elmLevelCur.nodeName == sLevel) {
            var elmSiblingNext = (bNext ? elmLevelCur.nextSibling : elmLevelCur.previousSibling);
            while (elmSiblingNext != null) {
                if (sKeyName == null || elmSiblingNext.getAttribute(sKeyName) == sKeyValue) {
                    var elmNext = ((!bIgnoreCurrentLevel) && elmChildPath != null ? elmSiblingNext.selectSingleNode(elmChildPath) : elmSiblingNext);
                    return elmNext;
                }
                elmSiblingNext = (bNext ? elmSiblingNext.nextSibling : elmSiblingNext.previousSibling);
            }
            break;
        }
        var sCurNodeName = (
			elmLevelCur.nodeName == "person" || elmLevelCur.nodeName == "role" ?
			((!("ActiveXObject" in window)) ? "*[name()='person' or name()='role']" : "(person|role)") :
			elmLevelCur.nodeName);
        elmChildPath = sCurNodeName + (elmChildPath != null ? "/" + elmChildPath : "");
        elmLevelCur = elmLevelCur.parentNode;
    }
    return null;
}
function getNextElm(elmCur) {
    var sRouteType = getFamilyAttribute(elmCur, "step", "routetype");
    var sUnitType = getFamilyAttribute(elmCur, "step", "unittype");
    var sCurUnitType = elmCur.nodeName;
    var sLevel, sKeyAttribute, sKeyValue;
    switch (sRouteType) {
        case "approve":
            sLevel = "step";
            sKeyAttribute = "routetype";
            sKeyValue = sRouteType;
            break;
        case "assist":
        case "receive":
        case "consult":
        default:
            sLevel = sCurUnitType;
            sKeyAttribute = null;
            sKeyValue = null;
            sAdopteeLevel = "person";
            sAdopteeNodeName = "role";
            break;
    }
    var elmNext = getSibling(elmCur, sLevel, sKeyAttribute, sKeyValue, true, false);
    return elmNext;
}

//openGal(       "수신결재",  "일반결재",   "수신",         "일반결재",   "대기",false,false,true,false,false,false);
function openGal(sCatSignType, sDeptSignType, sDeptSignStatus, sUserSignType, sUserSignStatus, bMail, bUser, bGroup, bRef, bIns, bRecp, sAddageKey, sAddage, bCCGroup) {
    var bOpen = false;
    if (m_modeless == null) {
        bOpen = true;
    } else {
        try {
            if (m_modeless.src != '') m_modeless.close();
            bOpen = true;
        } catch (e) { bOpen = true; }
    }
    if (bOpen) {
        var rgParams = null;
        rgParams = new Array();
        rgParams["bMail"] = bMail;
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
        if (sAddageKey != null && sAddage != null) rgParams[sAddageKey] = sAddage;
        rgParams["objMessage"] = window;

        var szFont = "FONT-FAMILY: '굴림';font-size:9px;";
        var nWidth = 640;
        var nHeight = 610;
        var sFeature = szFont + "dialogHeight:" + nHeight + "px;dialogWidth:" + nWidth + "px;status:no;resizable:yes;help:no;";
        var strNewFearture = ModifyDialogFeature(sFeature);
        var vRetval = window.showModelessDialog("/COVIWeb/approval/address/address.aspx", rgParams, strNewFearture);
        //var vRetval = window.showModelessDialog("../address/address.aspx", rgParams, szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;help:no;");
        m_modeless = vRetval;
    }
}
function deletePerson() {
    var stepLength = m_oApvList.documentElement.selectNodes("division/step").length;
    var oSelTR = getSelectedRowApvlist();
    //    if(!("ActiveXObject" in window)){
    //    	oSelTR = document.getElementById("Apvlist").contentWindow.getSelectedRow();
    //    }else{
    //    	oSelTR = Apvlist.getSelectedRow();
    //    }	
    var xpathCur;
    var elmDeleted;
    //if((oSelTR!=null)&&(m_oApvList.documentElement.selectNodes("step").length>1)){
    if (oSelTR != null) {
        xpathCur = oSelTR.id;
        if (!("ActiveXObject" in window)) { xpathCur = ConvertXpath(xpathCur); }
        var elm = m_oApvList.documentElement.selectSingleNode(xpathCur);
        //if (elm.selectSingleNode("taskinfo[@datereceived and @datereceived!='']") != null || elm.selectSingleNode("taskinfo[@kind='charge']") != null) {
	   if (elm.selectSingleNode("taskinfo").getAttribute("status")=="completed" || elm.selectSingleNode("taskinfo[@kind='charge']") != null){ //jkh 수정 2015.1.26(삭제시 오류)
            alert(strMsg_033); //"기안자이거나 이미 수신받은 결재자는 삭제할 수 없습니다."
            return;
        }
        if (elm.nodeName == "division") {
            if (elm.selectSingleNode("taskinfo").getAttribute("status") == "inactive" && elm.getAttribute("divisiontype") == "receive" && (m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL")) {
                alert(strMsg_035); //"부서합의 경우 일반 결재자 삭제를 할 수 없습니다."
                return;
            }
            elmDeleted = deleteSelfAndParent(elm, "division");
        } else {
            if (elm.selectSingleNode("taskinfo").getAttribute("kind") == "substitute" || elm.selectSingleNode("taskinfo").getAttribute("kind") == "bypass") {
                alert(strMsg_034); //"선택된 결재자의 결재종류는 일반결재이어야 삭제할 수 있습니다."
                return;
            }
            if (elm.selectSingleNode("taskinfo").getAttribute("status") == "inactive" && elm.parentNode.parentNode.getAttribute("routetype") == "approve" && elm.parentNode.parentNode.getAttribute("unittype") == "person" && (m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL")) {
                alert(strMsg_035); //"부서합의 경우 일반 결재자 삭제를 할 수 없습니다."
                return;
            }
            if (elm.selectSingleNode("taskinfo").getAttribute("status") == "inactive" && elm.parentNode.parentNode.getAttribute("routetype") == "audit" && (m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL")) {
                // return;
            }
            if ((m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL") && (elm.parentNode.selectSingleNode("taskinfo").getAttribute("piid") != getInfo("piid").toUpperCase())) {
                return;
            }
            //201107 구분별 결재선 추가
            if (getInfo("scMODEApvLine") == "1" && getInfo("scMODEApvLineV") != "" && opener.szformgubun != "") {
                var m_objXML = CreateXmlDocument();
                m_objXML.loadXML(getInfo("scMODEApvLineV"));
                var xmlBody = m_objXML.documentElement;
                var objApprovres = xmlBody.selectSingleNode("ITEM[CODE='" + opener.szformgubun + "']/APVLINESUMMARY");
                if (objApprovres != null) {
                    var szApprovers = objApprovres.text;
                    var szcurrentuser = elm.getAttribute("code") + "@" + elm.parentNode.parentNode.getAttribute("routetype") + ";";
                    if (szApprovers.indexOf(szcurrentuser) > -1) {
                        //동일 결재자 확인
                        var ochkApprover = m_oApvList.documentElement.selectNodes("division/step[@routetype='" + elm.parentNode.parentNode.getAttribute("routetype") + "']/ou/person[@code='" + elm.getAttribute("code") + "']");
                        if (ochkApprover.length == 1) return;
                    }
                }
            }
            elmDeleted = deleteSelfAndParent(elm, "step");
        }
        var sPrevElmXPath = recalcXPath(xpathCur, elmDeleted.nodeName, -1);
        try {
            //div 밑에 step node가 없는 경우 div node 삭제
            var elmdivList = m_oApvList.documentElement.selectNodes("division");
            for (var i = 0; i < elmdivList.length; i++) {
                var elm = elmdivList.nextNode();
                var elmList = elm.childNodes;
                if (elmList.length == 1) { m_oApvList.documentElement.removeChild(elm); }
            }
            if (stepLength == 1) {
                refreshList();
            } else if (m_oApvList.documentElement.selectSingleNode(sPrevElmXPath + "/taskinfo").getAttribute("datereceived") != null) {
                refreshList();
            } else {
                refreshList(sPrevElmXPath);
            }
        } catch (e) {
            refreshList();
        }
    }
}
function addPerson() {  //debugger;
    if (getInfo("mode") == "SUBREDRAFT" || getInfo("mode") == "SUBAPPROVAL") {
        var chkel = null;
        if (!("ActiveXObject" in window)) {
            chkel = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='pending']/step[taskinfo/@status='pending']/ou[taskinfo/@status='pending' and taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']/*[name()='person' or name()='role']/taskinfo[@kind='authorize']")
        } else {
            chkel = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='pending']/step[taskinfo/@status='pending']/ou[taskinfo/@status='pending' and taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']/(person|role)/taskinfo[@kind='authorize']")
        }
        if (chkel != null) {
            alert(strMsg_036);
            return false;
        }

    } else {
        var chkel = null;
        if (!("ActiveXObject" in window)) {
            chkel = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step[@routetype='approve']/ou/*[name()='person' or name()='role']/taskinfo[@kind='authorize']")
        } else {
            chkel = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step[@routetype='approve']/ou/(person|role)/taskinfo[@kind='authorize']")
        }
        if (chkel != null) {
            alert(strMsg_036); //"전결자가 지정되어있는 경우에는 결재자를 추가할 수 없습니다.\n전결자를 일반결재 상태로 변경하신 후에 다시 추가하십시오."
            return false;
        }
    }

    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "approve";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_normalapprove; //"일반결재"
    l_bGroup = false;
    //openGal("일반결재","일반결재","수신","일반결재","대기",false,true,false,false,false,false);
    //	var oXML  = switchParentNode(3);
    //	if(oXML.xml == "<user></user>"){alert("결재자를 선택하세요");return false;}

    //insertToList(oXML);
    insertToList(switchParentNode(3));

}

// serial 2006.03.01 by sunny
function addparallelPerson() {
    var chkel = null;
    if (!("ActiveXObject" in window)) {
        chkel = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step[@routetype='approve']/ou/*[name()='person' or name()='role']/taskinfo[@kind='authorize']")
    } else {
        chkel = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step[@routetype='approve']/ou/(person|role)/taskinfo[@kind='authorize']")
    }
    if (chkel != null) {
        alert(strMsg_036); //"전결자가 지정되어있는 경우에는 결재자를 추가할 수 없습니다.\n전결자를 일반결재 상태로 변경하신 후에 다시 추가하십시오."
        return false;
    }
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "approve";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "parallel";
    m_sSelectedStepRef = strlable_normalapprove; //"일반결재"
    l_bGroup = false;
    //openGal("일반결재","일반결재","수신","일반결재","대기",false,true,false,false,false,false);
    insertToList(switchParentNode(3));
}
function addRecPerson() {
    var chkel = null;
    if (!("ActiveXObject" in window)) {
        chkel = m_oApvList.selectSingleNode("steps/division/step[@routetype='receive']/ou/*[name='person' or name='role']/taskinfo[@kind='authorize']")
    } else {
        chkel = m_oApvList.selectSingleNode("steps/division/step[@routetype='receive']/ou/(person|role)/taskinfo[@kind='authorize']")
    }
    if (chkel != null) {
        alert(strMsg_036); //"전결자가 지정되어있는 경우에는 결재자를 추가할 수 없습니다.\n전결자를 일반결재 상태로 변경하신 후에 다시 추가하십시오."
        return false;
    }
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "receive";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_recieve_apv; //"수신결재"
    l_bGroup = false;
    //openGal("일반결재","수신결재","수신","일반결재","대기",false,true,false,false,false,false);
    insertToList(switchParentNode(3));
}
function addReceiptPerson() {
    var chkel = null;
    if (!("ActiveXObject" in window)) {
        chkel = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='pending']/step[@routetype='receive']/ou/*[name()='person' or name()='role']/taskinfo[@kind='authorize']")
    } else {
        chkel = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='pending']/step[@routetype='receive']/ou/(person|role)/taskinfo[@kind='authorize']");
    }
    if (chkel != null) {
        alert(strMsg_036); //"전결자가 지정되어있는 경우에는 결재자를 추가할 수 없습니다.\n전결자를 일반결재 상태로 변경하신 후에 다시 추가하십시오."
        return false;
    }
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "receive"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "approve";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_normalapprove; //"일반결재"
    l_bGroup = false;
    //openGal("일반결재","일반결재","수신","일반결재","대기",false,true,false,false,false,false);
    insertToList(switchParentNode(3));
}
function addSubPerson() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "assist";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_recieve_apv; //"수신결재"
    l_bGroup = false;
    //openGal("일반결재","수신결재","수신","일반결재","대기",false,true,false,false,false,false);
    insertToList(switchParentNode(3));
}
function addChargePerson() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "approve";
    m_sSelectedUnitType = "role";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_charge_approve; //"담당결재"
    l_bGroup = false;
    //openGal("일반결재","담당결재","담당","일반결재","대기",false,true,false,false,false,false);
    insertToList(switchParentNode(3));
}
function addCharge() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "receive"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "receive";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_charge_approve; //"담당결재"
    l_bGroup = false;
    //openGal("일반결재","담당결재","담당","일반결재","대기",false,true,false,false,false,false);
    insertToList(switchParentNode(3));
}
function addPConsult(sAllotType) {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "consult";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = sAllotType; //"parallel";
    m_sSelectedStepRef = (sAllotType == "serial" ? strlable_Seq : strlable_Par);  //"순차합의":"병렬합의"
    l_bGroup = false;
    //openGal("개인합의","병렬합의","수신","일반결재","대기",false,true,false,false,false,false);
    insertToList(switchParentNode(3));
}
function addReceipt() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "receive"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "receive";
    m_sSelectedUnitType = "ou";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_ChargeDept_Rec; //"담당부서수신"
    l_bGroup = false;
    //openGal("수신결재","일반결재","수신","일반결재","대기",false,false,true,false,false,false,"","",l_bGroup);
    insertToList(switchParentNode(4));
}
function addGroup() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "receive";
    m_sSelectedUnitType = "group";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_DistributeList_Rec; //"배포목록수신"
    l_bGroup = true;
    m_sSelectedUnitType = "group";
    //sAddage=(l_bGroup)?reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/role")):reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/ou/person"));
    //openGal("수신결재","일반결재","수신","일반결재","대기",false,false,true,false,false,false,"","",l_bGroup);
}
function addDConsult(szAllotType) {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "consult";
    m_sSelectedUnitType = "ou";
    //	var szallottype = sallottype;
    //	for(var i=0; i < radioDConsult.length;i++){
    //	    if (radioDConsult[i].checked) szallottype = radioDConsult[i].value;
    //	}
    m_sSelectedAllotType = szAllotType; //"parallel";
    m_sSelectedStepRef = strlable_DeptConsent; //"부서합의"
    l_bGroup = false;
    if (selTab == "tSearch" || selTab == "tGroup") {
        insertToList(switchParentNode(4));
    }
}
function addDAssist(szAllotType) {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "assist";
    m_sSelectedUnitType = "ou";
    m_sSelectedAllotType = szAllotType; //"serial";
    m_sSelectedStepRef = strlable_DAsist; //"협조처"
    l_bGroup = false;
    l_bGroup = false;
    if (selTab == "tSearch" || selTab == "tGroup") {
        insertToList(switchParentNode(4));
    }
}
function addPAssist(szAllotType) {//개인순차협조 --개인병렬헙조 추가 for BK by sunny in 2007.07
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "assist";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = szAllotType; //"serial"
    m_sSelectedStepRef = (szAllotType == "serial" ? strlable_Seq : strlable_Par); //"순차합의"
    l_bGroup = false;
    insertToList(switchParentNode(3));
}
function addPAudit(sMode) {//개인감사-준법감시인
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "audit";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "serial";
    m_sSelectedStepRef = strlable_person_audit3; //"개인감사"
    l_bGroup = false;
    var sName = "감사";
    if (sMode == "준법") { m_sSelectedStepRef = strlable_person_audit; sName = "개인준법"; } //"개인준법"

    var oAuditStep = m_oApvList.selectSingleNode("steps/division/step[@routetype='audit' and @name='" + m_sSelectedStepRef + "' and taskinfo/@datereceived!='']");
    if (oAuditStep == null) {
        if (sMode == "준법") {
            if (getInfo("scPAdt1V") == "") {
                insertToList(switchParentNode(3));
            } else {
                var aAudit = getInfo("scPAdt1V").split("@@"); //2007.12 변경
                var m_AuditevalXML = CreateXmlDocument();
                m_AuditevalXML.loadXML(aAudit[2]);
                insertToList(m_AuditevalXML.documentElement); //꼭 확인할 것
            }
        } else {
            //스키마 조건 추가할 것 2007.12 변경완료
            if (getInfo("scPAdtV") == "") {
                insertToList(switchParentNode(3));
            } else {
                var aAudit = getInfo("scPAdtV").split("@@"); //2007.12 변경
                var m_AuditevalXML = CreateXmlDocument();
                m_AuditevalXML.loadXML(aAudit[2]);
                insertToList(m_AuditevalXML.documentElement); //꼭 확인할 것
            }
        }
    } else {
        if (sMode == "준법") {
            alert(strMsg_253); //"준법부서는 1회만 지정할 수 있습니다."		    
        } else {
            alert(strMsg_176); //"결재선에서 감사는 단 1회 만 지정할 수 있습니다. 이미 감사가 완료되었습니다."
        }
    }
}
function addDAudit(sMode) {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "audit";
    m_sSelectedUnitType = "ou";
    m_sSelectedAllotType = "serial";
    m_sSelectedStepRef = strlable_dept_audit3; //"부서감사"
    l_bGroup = false;
    var sName = "감사";
    if (sMode == "준법") { m_sSelectedStepRef = strlable_dept_audit; sName = "부서준법"; } //"부서준법"
    var oAuditStep = m_oApvList.selectSingleNode("steps/division/step[@routetype='audit' and @name='" + m_sSelectedStepRef + "' ]");
    if (oAuditStep == null) {
        if (sMode == "준법") {
            if (getInfo("scDAdt1V") == "") {
                insertToList(switchParentNode(4));
            } else {
                var aAudit = getInfo("scDAdt1V").split("@@"); //2007.12 변경
                var m_AuditevalXML = CreateXmlDocument();
                m_AuditevalXML.loadXML(aAudit[2]);
                insertToList(m_AuditevalXML.documentElement); //꼭 확인할 것
            }
        } else {
            //스키마 조건 추가할 것 2007.12 변경완료
            if (getInfo("scDAdtV") == "") {
                insertToList(switchParentNode(4));
            } else {
                var aAudit = getInfo("scDAdtV").split("@@"); //2007.12 변경
                var m_AuditevalXML = CreateXmlDocument();
                m_AuditevalXML.loadXML(aAudit[2]);
                insertToList(m_AuditevalXML.documentElement); //꼭 확인할 것
            }
        }
    } else {
        if (sMode == "준법") {
            alert(strMsg_253); //"준법부서는 1회만 지정할 수 있습니다."		    
        } else {
            alert(strMsg_176); //"결재선에서 감사는 단 1회 만 지정할 수 있습니다. 이미 감사가 완료되었습니다."
        }
    }

}
function addDAuditETC() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "audit";
    m_sSelectedUnitType = "ou";
    m_sSelectedAllotType = "serial";
    m_sSelectedStepRef = strlable_watch; //"감시"
    l_bGroup = false;
    //openGal("수신결재","일반결재","수신","일반결재","대기",false,false,false,false,false,true);
    //insertToList(switchParentNode(4));
    var oAssistStep = m_oApvList.selectSingleNode("steps/division/step[@routetype='audit' and @name='감시' and taskinfo/@datereceived!='']");
    if (oAssistStep == null) {
        var elmRoot = m_oApvList.documentElement;
        var aAssist = gAssistOU.split(":");
        var elmAssist = elmRoot.selectSingleNode("division/step[@routetype='audit' and @name='감시']/ou");
        if (elmAssist == null) {
            var oCurrentDiv = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='inactive' or taskinfo/@status='pending']");
            var oStep = m_oApvList.createElement("step");
            var oOU = m_oApvList.createElement("ou");
            var oRole = m_oApvList.createElement("role");
            var oTaskinfo = m_oApvList.createElement("taskinfo");
            var oOUTaskinfo = m_oApvList.createElement("taskinfo");
            oCurrentDiv.appendChild(oStep).appendChild(oOUTaskinfo);
            oStep.appendChild(oOU).appendChild(oTaskinfo);
            oStep.setAttribute("unittype", "ou");
            oStep.setAttribute("routetype", "audit");
            oStep.setAttribute("allottype", "serial");
            oStep.setAttribute("name", strlable_watch); //"감시"
            oOU.setAttribute("code", aAssist[0]);
            oOU.setAttribute("name", aAssist[1]);
            oOUTaskinfo.setAttribute("status", "inactive");
            oOUTaskinfo.setAttribute("result", "inactive");
            oOUTaskinfo.setAttribute("kind", "normal");
            oTaskinfo.setAttribute("status", "inactive");
            oTaskinfo.setAttribute("result", "inactive");
            oTaskinfo.setAttribute("kind", "normal");
        }
        refreshList();
    } else {
        alert(strMsg_177); //"결재선에서 감시는 단 1회 만 지정할 수 있습니다. 이미 감시가 완료되었습니다."
    }
}
//특이결재 추가
function addExtType() {
    var aExtType = getInfo("scExtTypeV").split(";");
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = aExtType[0];
    m_sSelectedUnitType = aExtType[1];
    m_sSelectedAllotType = aExtType[2];
    m_sSelectedStepRef = "ExtType";
    l_bGroup = false;
    if (m_sSelectedUnitType == "person") {
        insertToList(switchParentNode(3));
    } else if (m_sSelectedUnitType == "ou") {
        insertToList(switchParentNode(4));
    }
}
//공람자추가
function addPReview() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "review";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "parallel";
    m_sSelectedStepRef = "review"; //"일반결재"
    l_bGroup = false;
    //openGal("일반결재","일반결재","수신","일반결재","대기",false,true,false,false,false,false);
    insertToList(switchParentNode(3));
}
function setCC(allottype) {
    m_sSelectedStepType = "ccinfo";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "ccinfo";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = allottype;
    m_sSelectedStepRef = strlable_ref; //"참조자"
    var sAddage; //=reverseItems(m_oApvList.selectNodes("steps/ccinfo[@belongto='"+allottype+"']/ou/person"));
    l_bGroup = false;
    for (var i = 0; i < document.getElementsByName("radioCC").length; i++) {
        if (document.getElementsByName("radioCC")[i].checked) {
            m_sSelectedUnitType = document.getElementsByName("radioCC")[i].value;
        }
    }
    if (selTab == "tSearch" || selTab == "tGroup") {
        if (getInfo("scCC") == "1") {
            var sChk = document.getElementById("chk").value;
            var bSelect = false;
            switch (selTab) {
                case "tSearch": m_oUserList = (!("ActiveXObject" in window)) ? document.getElementById("ListItems") : window.frames["ListItems"]; break;
                case "tGroup": m_oUserList = (!("ActiveXObject" in window)) ? document.getElementById("ListItems") : window.frames["ListItems"]; break;
            }
            if (selTab == "tGroup" && sChk == "1") {
                var sel_row = (!("ActiveXObject" in window)) ? m_oUserList.contentDocument.getElementsByName('chkRowSelect') : m_oUserList.document.getElementsByName('chkRowSelect');
                var chk_count = sel_row.length;
                if (chk_count > 0) {
                    for (var i = (chk_count - 1); i >= 0; i--) {
                        if (sel_row[i].checked) {
                            bSelect = true;
                        }
                    }
                }
            }

            if (getInfo("scCCV") == "" || getInfo("scCCV") == "11") { //기본 셋팅 값이 없거나, 개인/부서 모두 사용하는 경우
                m_sSelectedUnitType = "person"; insertToList(switchParentNode(3));
                if (bSelect == false) {
                    m_sSelectedUnitType = "ou"; insertToList(switchParentNode(4));
                }
            } else {
                if (getInfo("scCCV").substring(1, 2) == "1") {
                    if (bSelect == false) {
                        m_sSelectedUnitType = "ou"; insertToList(switchParentNode(4));
                    }
                }
                if (getInfo("scCCV").substring(0, 1) == "1") {
                    m_sSelectedUnitType = "person"; insertToList(switchParentNode(3));
                }
            }
        }
    }
    //	switch (m_sSelectedUnitType)	{
    //	case "person": insertToList(switchParentNode(3));	break;
    //	case "ou":insertToList(switchParentNode(4));	break;
    //	case "group":insertToList(switchParentNode(4));	break;
    //	}
}
function reverseItems(oNodeList) {
    if (oNodeList.length > 0) {
        var sList = "";
        for (var i = 0; i < oNodeList.length; i++) {
            var oPNode = oNodeList[i];
            if (l_bGroup) {
                sList += "<item tl=\"" + "" + "\" po=\"" + "" + "\" lv=\"" + "" + "\"><DN>" + oPNode.getAttribute("name") + "</DN><DO>" + oPNode.getAttribute("name") + "</DO><JD/><LN/><FN/><TL>" + "" + "</TL><PO>" + "" + "</PO><LV>" + "" + "</LV><AN>" + oPNode.getAttribute("code") + "</AN><PI/><CP/><DP>" + oPNode.getAttribute("name") + "</DP><RGNM>" + oPNode.getAttribute("name") + "</RGNM><OF/><CY/><EM/><SO/><SG>" + "" + "</SG><RG>" + oPNode.getAttribute("code") + "</RG></item>";
            } else {
                sList += "<item tl=\"" + oPNode.getAttribute("title") + "\" po=\"" + oPNode.getAttribute("position") + "\" lv=\"" + oPNode.getAttribute("level") + "\"><DN>" + oPNode.getAttribute("name") + "</DN><DO>" + oPNode.getAttribute("name") + "</DO><JD/><LN/><FN/><TL>" + oPNode.getAttribute("title").split(";")[1] + "</TL><PO>" + oPNode.getAttribute("position").split(";")[1] + "</PO><LV>" + oPNode.getAttribute("level").split(";")[1] + "</LV><AN>" + oPNode.getAttribute("code") + "</AN><PI/><CP/><DP>" + oPNode.getAttribute("ouname") + "</DP><RGNM>" + oPNode.getAttribute("ouname") + "</RGNM><OF/><CY/><EM/><SO/><SG>" + oPNode.getAttribute("oucode") + "</SG><RG>" + oPNode.getAttribute("oucode") + "</RG></item>";
            }
        }
        return sList;
    }
}
function deleteCC() {
    var stepLength = m_oApvList.documentElement.selectNodes("division/step").length;
    var oSelTR;
    oSelTR = getSelectedRow();

    var xpathCur;

    if (oSelTR != null) {
        xpathCur = oSelTR.id;
        if (!("ActiveXObject" in window)) { xpathCur = ConvertXpath(xpathCur); }
        var elm = m_oApvList.documentElement.selectSingleNode(xpathCur);
        if (elm == null) return;

        var elmDeleted = deleteSelfAndParent(elm, "ccinfo");
        var sPrevElmXPath = recalcXPath(xpathCur, elmDeleted.nodeName, -1);
        refreshCC();
    }
}

//배포처 추가
function addRecDept() {

    m_sSelectedRouteType = "dist";
    m_sSelectedUnitType = "ou";
    m_sSelectedAllotType = "parallel";
    m_sSelectedStepRef = "부서배포";
    l_bGroup = false;
    //우리금융그룹 변경 12.22
    //mtype 변경

    if (selTab == "tSearch" && iSearch.document.getElementById("buse").checked == false) {  //사용자는 지정못하게 (2013-03-15 HIW)
        alert(strMsg_335);
        return;
    }

    if (selTab == "tSearch" || selTab == "tGroup") {
        //부서 선택일 경우 mtype =0  그외 일 경우 1
        if (selTab == "tSearch") {
            if (((!("ActiveXObject" in window)) ? iSearch.document.getElementById("buse").checked : iSearch.buse.checked)) {
                mType = 0;
            } else {
                mType = 1;
            }
        }
        if (selTab == "tGroup") {
            var sChk = document.getElementById("chk").value;
            var bSelect = false;
            m_oUserList = ListItems;
            if (selTab == "tGroup" && sChk == "1") {
                var sel_row = (!("ActiveXObject" in window)) ? m_oUserList.contentDocument.getElementsByName('chkRowSelect') : m_oUserList.chkRowSelect;
                var chk_count = sel_row.length;
                if (chk_count > 0) {
                    for (var i = (chk_count - 1); i >= 0; i--) {
                        if (sel_row[i].checked) {
                            bSelect = true;
                        }
                    }
                }
            }
            if (bSelect) {
                mType = 1;
            } else {
				// 배포그룹을 0으로 보내면 배포그룹이 아니라 부서로 들어가서 그룹이 하나의 부서로 체크되도록 만들기에 주석처리함 2020-03-19 Covision HSB
                //mType = 0;
            }
        }
    } else if (selTab == "tDeployList") {//수신처그룹
        //2014-12-12 hyh 수정 공용배포그룹 하위부서 추가 가능
        //mType=2;
        if (selTab == "tDeployList") {
            var sChk = document.getElementById("chk").value;
            var bSelect = false;
            m_oUserList = ListItems;
            if (selTab == "tGroup" && sChk == "1") {
                var sel_row = (!("ActiveXObject" in window)) ? m_oUserList.contentDocument.getElementsByName('chkRowSelect') : m_oUserList.chkRowSelect;
                var chk_count = sel_row.length;
                if (chk_count > 0) {
                    for (var i = (chk_count - 1); i >= 0; i--) {
                        if (sel_row[i].checked) {
                            bSelect = true;
                        }
                    }
                }
            }
            if (bSelect) {
                mType = 1;
            } else {
                mType = 0;
            }
        }
        //2014-12-12 hyh 수정 끝
    } else if (selTab == "spantCirculationLine") {
        mType = 1;
    }

    if (mType == 0) {
        insertToList(switchParentNode(4));
    } else if (mType == 2) {
        insertToList(switchParentNode(4));
    } else {
        if (mType != 1)
            insertToList(switchParentNode(3));
        else {  //사용자는 지정못하게 (2013-03-15 HIW)
            alert(strMsg_335);
            return;
        }
    }
}

//oList --> 조직도 화면에서 리턴값으로 넘어온 xml 데이타
function insertToList(oList) { //debugger;
	/**
     * (대표이사) 수신부서 지정 불가요청 처리 PSW 2020-04-09
     * 업무연락, 인사발령통보서 제외
     * */
    var elmList, emlNode;
    elmList = oList.selectNodes("item");
    for (var i = 0; i < elmList.length; i++) {
        emlNode = elmList.nextNode();
        if (emlNode == null) emlNode = elmList[i];
        if (emlNode.selectSingleNode("AN") != null) {
            //alert(emlNode.selectSingleNode("AN").text);
        }
    }

    if (emlNode.selectSingleNode("AN").text == "ISU_STISU_ST002" && getInfo("fmpf") != "WF_FROM_ISU_ALL_020" && getInfo("fmpf") != "WF_FORM_ISU_ST_20") {
        alert("대표이사를 수신부서로 지정할 수 없습니다.");
        return false;
    }
    //200610_김선재 : 수신부서 지정 불가 조직 설정
    switch(emlNode.selectSingleNode("AN").text) {
        case "ISU_CHDAFA1":/*화학 재무담당*/
            alert("수신부서로 지정할 수 없는 부서입니다.");
            return false;
    }
    /* 적용끝 */
	
    m_modeless = null;
    var xpathNew = "";
    var oSrcDoc = CreateXmlDocument();
    var oSelTR;
    //    if(window.addEventListener){
    //    	oSelTR = document.getElementById("Apvlist").contentWindow.getSelectedRow();
    //    }else{
    //    	oSelTR = Apvlist.getSelectedRow();
    //    }		
    oSelTR = getSelectedRowApvlist();
    if (!oSrcDoc.loadXML(oList.xml)) {
        //alert(oSrcDoc.parseError);
        alertParseError(oSrcDoc.parseError);
        return;
    }
    //배포처 처리 2005.08 황선희
    if (m_sSelectedRouteType == 'dist') {
        setDistDept(oList);
    } else {
        var oSrcDocExt = CreateXmlDocument();
        //결재선에 중복 사용자 삽입 방지 2005.07 황선희
        if (m_sSelectedUnitType != "ou" && m_sApvMode != "SUBREDRAFT" && getInfo("scChkDuplicateApv") == "1") {
            oSrcDoc = chkDuplicateApprover(oSrcDoc);
        } else {
            oSrcDoc = oSrcDoc;
        }
        //개인 합의는 부서장만 선택한다. 2005.11 황선희
        //일반결재는 개인만 선택한다. 2005.11 황선희
        //		if ( m_sSelectedRouteType == "consult"){oSrcDoc = chkManagerConsult(oSrcDoc);}
        //		if ( m_sSelectedRouteType == "approve" ||  m_sSelectedRouteType == "receive" ){oSrcDoc = chkManagerApprove(oSrcDoc);}
        if (oSrcDoc.selectNodes("//item").length == 0) {
            return;
        }
        if (!("ActiveXObject" in window)) {
        } else {

            m_oXSLProcessor.input = oSrcDoc;
        }
        try {
            //맨 처음 elmRoot --> <steps initiatorcode=\"200208\" initiatoroucode=\"2100\" status=\"inactive\"/>	
            var elmRoot = m_oApvList.documentElement;
            var bDivisionSeparate = false; //boolean of division 
            var bSeparate = false;
            var sSeparateLevel = "division/step/ou";
            var elmTarget = null;
            var sVisible = null;
            var refreshTarget = refreshList;
            //alert("m_sSelectedRouteType: " + m_sSelectedRouteType +" m_sApvMode : "+ m_sApvMode);
            switch (m_sSelectedRouteType) {
                case "ccinfo": oSelTR = null; sVisible = ""; bSeparate = true; refreshTarget = refreshCC; elmTarget = elmRoot;
                    //var elmcc=elmRoot.selectSingleNode("ccinfo[@belongto='"+m_sSelectedAllotType+"']");
                    //if(elmcc!=null)elmRoot.removeChild(elmcc);
                    break;
                case "assist": if (sVisible == null) sVisible = "";
                case "consult": if (sVisible == null) sVisible = "";
                    //					//elmTarget=elmRoot.selectSingleNode("step[@routetype='"+m_sSelectedRouteType+"' and @unittype='"+m_sSelectedUnitType+"']");
                    //					//if(elmTarget==null){
                    //						elmTarget=elmRoot;bSeparate=true;
                    //					//}else{
                    //					//	bSeparate=false;
                    //					//}
                    if (elmRoot.selectSingleNode("division[@divisiontype='" + m_sSelectedDivisionType + "']") == null) {
                        var oDiv = m_oApvList.createElement("division");
                        var oTaskinfo = m_oApvList.createElement("taskinfo");
                        elmRoot.appendChild(oDiv).appendChild(oTaskinfo);
                        oDiv.setAttribute("divisiontype", m_sSelectedDivisionType);
                        oDiv.setAttribute("name", m_sSelectedStepRef);
                        oDiv.setAttribute("oucode", "");
                        oDiv.setAttribute("ouname", "");
                        oTaskinfo.setAttribute("status", "inactive");
                        oTaskinfo.setAttribute("kind", m_sSelectedRouteType);
                    }

                    //                  수신 부서 내 합의 대비용
                    if (m_sApvMode == "REDRAFT" || m_sApvMode == "RECAPPROVAL") {
                        elmTarget = m_oCurrentOUNode.selectSingleNode("step[@routetype='" + m_sSelectedRouteType + "' and @unittype='" + m_sSelectedUnitType + "' and taskinfo/@status='inactive']");
                        if (elmTarget == null) {
                            elmTarget = m_oCurrentOUNode; bSeparate = true;
                        } else {
                            bSeparate = false;
                        }
                        sSeparateLevel = "division/step/ou";
                    } else if (m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL") {
                        elmTarget = m_oCurrentOUNode;
                        bSeparate = false;
                        sSeparateLevel = "division/step/ou/person";
                    } else {
                        elmTarget = elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step[@routetype='" + m_sSelectedRouteType + "' and @unittype='" + m_sSelectedUnitType + "' and @allottype='" + m_sSelectedAllotType + "'and taskinfo/@status='inactive']");

                        if (elmTarget == null) {
                            elmTarget = elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']"); bSeparate = true;
                        } else {
                            //부서합의의 경우 순차 및 병렬 합의가 존재한다.
                            if (m_sSelectedRouteType == "consult" && m_sSelectedAllotType == "serial" && m_sSelectedUnitType == "ou") {
                                elmTarget = elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']"); bSeparate = true;
                                //개인헙조의 경우 순차 및 병렬 협조가 존재한다.
                            } else if (m_sSelectedRouteType == "assist" && m_sSelectedAllotType == "serial" && m_sSelectedUnitType == "ou") {
                                elmTarget = elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']"); bSeparate = true;
                            } else {
                                bSeparate = false;
                            }
                        }
                        sSeparateLevel = "division/step/ou";
                    }
                    /* 다단계 합의 방지 시 사용*/
                    //					if(getInfo("fmpf").indexOf("WF_CNM") > -1 && m_sSelectedRouteType == "assist"){
                    //                        elmTarget=elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']");bSeparate=true;
                    //					}else{
                    //								var elmTaskinfo = elmTarget.selectSingleNode(".//taskinfo");
                    //								if(bSeparate==false && elmTaskinfo.getAttribute("result")=="completed"){
                    //										alert(strMsg_178);//alert("합의완료 이후에는 합의자를 추가 할 수 없습니다.");
                    //										return;
                    //								}
                    //					}
                    //2010.01.25 yu2mi :다중 병렬 합의
                    if (getInfo("scMltStep") == "1" && m_sSelectedAllotType == "parallel") {
                        var elmTargets = elmRoot.selectNodes("division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step"); //[@routetype='"+m_sSelectedRouteType+"' and @unittype='" + m_sSelectedUnitType + "' ]
                        if (elmTargets.length > 0) { //기안자 패스
                            elmTarget = elmTargets.nextNode();
                            var elmTargetTmp = elmTarget;
                            while (elmTarget) {
                                elmTargetTmp = elmTarget;
                                elmTarget = elmTargets.nextNode();
                            }
                            elmTarget = elmTargetTmp;
                            //마지막 결재 라인이 합의/협조가 아닐 경우 전체 할당.
                            if (elmTarget.getAttribute("routetype") != m_sSelectedRouteType || elmTarget.getAttribute("unittype") != m_sSelectedUnitType) {
                                elmTarget = elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']"); bSeparate = true;
                            }
                        } else {
                            elmTarget = elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']"); bSeparate = true;
                        }
                    } else if (getInfo("scMltStep") == "1") {//다중합의 허용
                        elmTarget = elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']"); bSeparate = true;
                    }

                    break;
                case "receive": if (sVisible == null) sVisible = "";
                    //수신단계별로 div 생성됨
                    //		            if (elmRoot.selectSingleNode("division[@divisiontype='"+m_sSelectedDivisionType+"']") == null){
                    //			            var oDiv=m_oApvList.createElement("division");
                    //			            var oTaskinfo = m_oApvList.createElement("taskinfo");
                    //		                elmRoot.appendChild(oDiv).appendChild(oTaskinfo);
                    //			            oDiv.setAttribute("divisiontype",m_sSelectedDivisionType);
                    //			            oDiv.setAttribute("name", m_sSelectedStepRef);
                    //			            oTaskinfo.setAttribute("status","inactive");
                    //			            oTaskinfo.setAttribute("kind", m_sSelectedRouteType);
                    //		            }
                    //					elmTarget=elmRoot.selectSingleNode("division[@divisiontype='"+m_sSelectedDivisionType+"']");
                    if (m_sSelectedDivisionType == 'receive' && m_sSelectedRouteType == 'receive') {
                        if (m_sSelectedUnitType == 'ou' || (m_sSelectedUnitType == 'person' && elmRoot.selectSingleNode("division[@divisiontype='" + m_sSelectedDivisionType + "' and taskinfo/@status='inactive']/step[@routetype='receive']/ou/person") == null)) {
                            var oDiv = m_oApvList.createElement("division");
                            var oTaskinfo = m_oApvList.createElement("taskinfo");
                            elmRoot.appendChild(oDiv).appendChild(oTaskinfo);
                            oDiv.setAttribute("divisiontype", m_sSelectedDivisionType);
                            oDiv.setAttribute("name", m_sSelectedStepRef);
                            oDiv.setAttribute("ouname", "");
                            oDiv.setAttribute("oucode", "");
                            oTaskinfo.setAttribute("status", "inactive");
                            oTaskinfo.setAttribute("kind", m_sSelectedRouteType);
                            elmTarget = oDiv;
                        } else {
                            //2011.06 담당자 지정 시 수신처로 합쳐지는 거 방지 sunny
                            if (m_sSelectedUnitType == 'person') {
                                elmTarget = elmRoot.selectSingleNode("division[@divisiontype='" + m_sSelectedDivisionType + "' and taskinfo/@status='inactive' and step[@routetype='receive']/ou/person/taskinfo/@status='inactive']");
                            } else {
                                elmTarget = elmRoot.selectSingleNode("division[@divisiontype='" + m_sSelectedDivisionType + "' and taskinfo/@status='inactive']");
                            }
                        }
                    }
                    bSeparate = true;
                    break;
                case "review": sVisible = ""; if (sVisible == null) sVisible = "n";
                case "notify": if (sVisible == null) sVisible = "n";
                    //꼭 수정할 것
                    elmTarget = elmRoot.selectSingleNode("division/step[@routetype='" + m_sSelectedRouteType + "' and @unittype='" + m_sSelectedUnitType + "']");
                    if (elmTarget == null) {
                        elmTarget = elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']"); bSeparate = true;
                    } else {
                        bSeparate = false;
                    }
                    break;
                case "audit": if (sVisible == null) sVisible = "";
                case "approve": if (sVisible == null) sVisible = "";
                default: if (sVisible == null) sVisible = "";
                    if (m_sApvMode == "REDRAFT" || m_sApvMode == "RECAPPROVAL") {
                        elmTarget = m_oCurrentOUNode; bSeparate = true; sSeparateLevel = "division/step/ou/person"; //bSeparate=false;sSeparateLevel="division/step/ou/person"
                    } else if (m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL") {
                        elmTarget = m_oCurrentOUNode; bSeparate = false; sSeparateLevel = "division/step/ou/person";
                    } else {
                        //elmTarget=elmRoot;bSeparate=true;
                        if (elmRoot.selectSingleNode("division[@divisiontype='" + m_sSelectedDivisionType + "']") == null) {
                            var oDiv = m_oApvList.createElement("division");
                            var oTaskinfo = m_oApvList.createElement("taskinfo");
                            elmRoot.appendChild(oDiv).appendChild(oTaskinfo);
                            oDiv.setAttribute("divisiontype", m_sSelectedDivisionType);
                            oDiv.setAttribute("name", m_sSelectedStepRef);
                            oDiv.setAttribute("oucode", "");
                            oDiv.setAttribute("ouname", "");
                            oTaskinfo.setAttribute("status", "inactive");
                            oTaskinfo.setAttribute("kind", m_sSelectedRouteType);
                        }
                        elmTarget = elmRoot.selectSingleNode("division");
                        bSeparate = true;
                        //20110515 동시결재 merge기능 시작
                        if (m_sSelectedRouteType == "approve" && m_sSelectedAllotType == "parallel") {
                            var elmTargets = elmRoot.selectNodes("division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step"); //[@routetype='"+m_sSelectedRouteType+"' and @unittype='" + m_sSelectedUnitType + "' ]
                            if (elmTargets.length > 1) { //기안자 패스
                                var ii = 0;
                                elmTarget = elmTargets.nextNode();
                                if (elmTarget == null) elmTarget = elmTargets[ii];
                                var elmTargetTmp = elmTarget;
                                while (elmTarget) {
                                    elmTargetTmp = elmTarget;
                                    elmTarget = elmTargets.nextNode();
                                    ii++;
                                    if (elmTarget == null) elmTarget = elmTargets[ii];
                                }
                                elmTarget = elmTargetTmp;
                                //마지막 결재 라인이 동시결재가 아닐 경우 전체 할당.
                                if (elmTarget.getAttribute("routetype") == "approve" && elmTarget.getAttribute("unittype") == "person") { //&& (elmTarget.getAttribute("allottype") != "parallel")
                                    if (elmTarget.getAttribute("allottype") == "parallel") {
                                        bSeparate = false;
                                    } else {
                                        elmTarget = elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']"); bSeparate = true;
                                    }
                                } else {
                                    elmTarget = elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']"); bSeparate = true;
                                }
                            } else {
                                elmTarget = elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']"); bSeparate = true;
                            }
                        }
                        //20110515 동시결재 merge기능 끝
                    }
                    break;
            }

            var oTargetDoc = CreateXmlDocument();
            if (!("ActiveXObject" in window)) {
                //ApvlineGen.xsl파일에 파라미터 대입
                m_oXSLProcessor.setParameter("", "steptype", m_sSelectedStepType);
                m_oXSLProcessor.setParameter("", "divisiontype", m_sSelectedDivisionType);

                m_oXSLProcessor.setParameter("", "unittype", m_sSelectedUnitType);
                m_oXSLProcessor.setParameter("", "routetype", m_sSelectedRouteType);
                m_oXSLProcessor.setParameter("", "allottype", m_sSelectedAllotType);
                m_oXSLProcessor.setParameter("", "referencename", m_sSelectedStepRef);
                m_oXSLProcessor.setParameter("", "childvisible", sVisible);
                try { m_oXSLProcessor.setParameter("", "ounametype", gOUNameType) } catch (e) { } //부서명 옵션
                //try{m_oXSLProcessor.addParameter("splittype",(getInfo("scMltStep") == "1"?"split":""))}catch(e){} //부서명 옵션
                //2010.01.25 yu2mi :다중 병렬 합의
                try { m_oXSLProcessor.setParameter("", "splittype", (getInfo("scMltStep") == "1" && m_sSelectedAllotType != "parallel" ? "split" : "")) } catch (e) { } //부서명 옵션
                //2011.03.17 참조/확인결재
                if (m_sSelectedStepRef == "confirm" || m_sSelectedStepRef == "reference") {
                    try { m_oXSLProcessor.setParameter("", "kindext", m_sSelectedStepRef); } catch (e) { }
                } else {
                    //2014-10-24 hyh 수정
                    //try { m_oXSLProcessor.addParameter("kindext",""); } catch (e) { }
                    try { m_oXSLProcessor.setParameter("", "kindext", m_sSelectedStepRef); } catch (e) { }
                    //2014-10-24 hyh 수정 끝
                }
                try { m_oXSLProcessor.setParameter("", "stampRights", gStampRightsYN); } catch (e) { }  //인장권자여부 (2012-12-17 HIW)

                oTargetDoc = m_oXSLProcessor.transformToDocument(oSrcDoc);

            } else {

                //ApvlineGen.xsl파일에 파라미터 대입
                m_oXSLProcessor.addParameter("steptype", m_sSelectedStepType);
                m_oXSLProcessor.addParameter("divisiontype", m_sSelectedDivisionType);

                m_oXSLProcessor.addParameter("unittype", m_sSelectedUnitType);
                m_oXSLProcessor.addParameter("routetype", m_sSelectedRouteType);
                m_oXSLProcessor.addParameter("allottype", m_sSelectedAllotType);
                m_oXSLProcessor.addParameter("referencename", m_sSelectedStepRef);
                m_oXSLProcessor.addParameter("childvisible", sVisible);
                try { m_oXSLProcessor.addParameter("ounametype", gOUNameType) } catch (e) { } //부서명 옵션
                //try{m_oXSLProcessor.addParameter("splittype",(getInfo("scMltStep") == "1"?"split":""))}catch(e){} //부서명 옵션
                //2010.01.25 yu2mi :다중 병렬 합의
                try { m_oXSLProcessor.addParameter("splittype", (getInfo("scMltStep") == "1" && m_sSelectedAllotType != "parallel" ? "split" : "")) } catch (e) { } //부서명 옵션
                //2011.03.17 참조/확인결재
                if (m_sSelectedStepRef == "confirm" || m_sSelectedStepRef == "reference") {
                    try { m_oXSLProcessor.addParameter("kindext", m_sSelectedStepRef); } catch (e) { }
                } else {
                    try { m_oXSLProcessor.addParameter("kindext", ""); } catch (e) { }
                }
                try { m_oXSLProcessor.addParameter("stampRights", gStampRightsYN); } catch (e) { }  //인장권자여부 (2012-12-17 HIW)  ApvlineGen.xsl(결재선XML)파일에 파라미터 대입

                m_oXSLProcessor.transform();
                oTargetDoc.loadXML(m_oXSLProcessor.output);
            }
            //var oChildren = (bSeparate?oTargetDoc.documentElement.childNodes:oTargetDoc.documentElement.selectNodes(sSeparateLevel));
            var oChildren = (bSeparate ? oTargetDoc.documentElement.firstChild.childNodes : oTargetDoc.documentElement.selectNodes(sSeparateLevel)); //documentElement.firstChild.selectNodes(sSeparateLevel)
            if (m_sSelectedStepType == "ccinfo") { oChildren = oTargetDoc.documentElement.childNodes; }
            var idxoChildren = 0;
            var elm = (bSeparate ? oChildren.item(idxoChildren) : oChildren.nextNode()); idxoChildren++;

            var xpathCur;
            var oSelectedElm;
            //alert(m_sSelectedUnitType+'--'+m_sSelectedRouteType +'---'+oTargetDoc.xml);
            while (elm != null) {

                if (m_sSelectedDivisionType == 'receive' && m_sSelectedRouteType == 'receive' && m_sSelectedUnitType == 'ou') {
                    if (elmRoot.selectNodes("division[@divisiontype='" + m_sSelectedDivisionType + "' and taskinfo/@status='inactive']").length > 0) {
                    } else {
                        var oDiv = m_oApvList.createElement("division");
                        var oTaskinfo = m_oApvList.createElement("taskinfo");
                        elmRoot.appendChild(oDiv).appendChild(oTaskinfo);
                        oDiv.setAttribute("divisiontype", m_sSelectedDivisionType);
                        oDiv.setAttribute("name", m_sSelectedStepRef);
                        oTaskinfo.setAttribute("status", "inactive");
                        oTaskinfo.setAttribute("kind", m_sSelectedRouteType);
                        elmTarget = oDiv;
                    }
                }

                elmTarget.appendChild(elm.cloneNode(true));
                elm = (bSeparate ? oChildren.item(idxoChildren) : oChildren.nextNode()); idxoChildren++;
            }

            //합의인 경우 무조건 작성자 다음으로 node 이동 by sunny 2006.09 
            //setApvList4Consult();

            refreshTarget();
        } catch (e) {
            alert(strMsg_030 + "\n at insertToList in ApvlineMgr.js\nError Desc:" + e.description); //"오류가 발생했습니다."
        }
    }
    document.getElementById("chk").value = "";

    return;
}

var gselectedRowId = null;

function refreshList(selectedRowId) {
    gselectedRowId = selectedRowId;
    try {
        //            var pXML =null ;
        //            var aXML = "";
        //    		    aXML+="<param><name>lngindex</name><value><![CDATA["+gLngIdx+"]]></value></param>";
        //		    if (getInfo("loct")=="PREAPPROVAL"||getInfo("loct")=="COMPLETE"){		//	쿠쿠전자 수정
        //    		    aXML+="<param><name>viewtype</name><value><![CDATA["+"read"+"]]></value></param>";
        //		    }else{
        //			    switch(m_sApvMode){
        //				    case "DRAFT":
        //				    case "TEMPSAVE":
        //            		    aXML+="<param><name>viewtype</name><value><![CDATA["+"create"+"]]></value></param>";
        //					    break;
        //				    case "REDRAFT":
        //            		    aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
        //					    break;
        //				    case "SUBREDRAFT":
        //            		    aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
        //            		    aXML+="<param><name>currentroutetype</name><value><![CDATA["+"consult"+"]]></value></param>";
        //					    break;
        //				    case "APVLINE":
        //            		    aXML+="<param><name>viewtype</name><value><![CDATA["+"create"+"]]></value></param>";
        //					    break;
        //				    case "APPROVAL":
        //            		    aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
        //					    break;
        //				    case "SUBAPPROVAL":
        //            		    aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
        //            		    aXML+="<param><name>currentroutetype</name><value><![CDATA["+"consult"+"]]></value></param>";
        //					    break;
        //				    case "RECAPPROVAL":
        //            		    aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
        //					    break;
        //				    case "CHARGE":
        //            		    aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
        //					    break;
        //				    case "PROCESS":
        //            		    aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
        //					    break;
        //				    case "DEPTLIST": //200902 추가 시작 : 일괄결재선지정
        //            		    aXML+="<param><name>viewtype</name><value><![CDATA["+"create"+"]]></value></param>";
        //					    break;
        //				    default:
        //            		    aXML+="<param><name>viewtype</name><value><![CDATA["+"read"+"]]></value></param>";
        //					    break;
        //			    }
        //		    }
        //   		    aXML+="<param><name>deputytype</name><value><![CDATA["+gDeputyType+"]]></value></param>";//대결자설정사용여부
        //   		    
        //            var sXML = "<Items><xml><![CDATA[" +m_oApvList.xml.replace(/<!\[CDATA\[/gi, "@CDATASTART").replace(/\]\]>/gi, "@CDATAEND")+"]]></xml><xslxml><![CDATA[" + m_oHTMLProcessor + "]]></xslxml></Items>" ;
        //	        if ( aXML != "") {
        //		        sXML = "<Items><xml><![CDATA[" +m_oApvList.xml.replace(/<!\[CDATA\[/gi, "@CDATASTART").replace(/\]\]>/gi, "@CDATAEND")+"]]></xml><xslxml><![CDATA[" + m_oHTMLProcessor + "]]></xslxml>"+aXML+"</Items>" ;
        //	        }
        //            var szURL = "../getXMLXslParsing.aspx";
        //            requestHTTPXSL("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTPXSL, sXML);
        //            
        //       /*
        //   		    m_oHTMLProcessor.input = m_oApvList; 
        //       		   		
        //		    if (getInfo("loct")=="PREAPPROVAL"||getInfo("loct")=="COMPLETE"){		//	쿠쿠전자 수정
        //			    m_oHTMLProcessor.addParameter("viewtype", "read");
        //		    }else{
        //			    switch(m_sApvMode){
        //				    case "DRAFT":
        //				    case "TEMPSAVE":
        //					    m_oHTMLProcessor.addParameter("viewtype", "create");
        //					    break;
        //				    case "REDRAFT":
        //					    m_oHTMLProcessor.addParameter("viewtype", "change");
        //					    break;
        //				    case "SUBREDRAFT":
        //					    m_oHTMLProcessor.addParameter("viewtype", "change");
        //					    m_oHTMLProcessor.addParameter("currentroutetype", "consult");
        //					    break;
        //				    case "APVLINE":
        //					    m_oHTMLProcessor.addParameter("viewtype", "create");
        //					    break;
        //				    case "APPROVAL":
        //					    m_oHTMLProcessor.addParameter("viewtype", "change");
        //					    break;
        //				    case "SUBAPPROVAL":
        //					    m_oHTMLProcessor.addParameter("viewtype", "change");
        //					    m_oHTMLProcessor.addParameter("currentroutetype", "consult");
        //					    break;
        //				    case "RECAPPROVAL":
        //					    m_oHTMLProcessor.addParameter("viewtype", "change");
        //					    break;
        //				    case "CHARGE":
        //					    m_oHTMLProcessor.addParameter("viewtype", "change");
        //					    break;
        //				    case "PROCESS":
        //					    m_oHTMLProcessor.addParameter("viewtype", "change");
        //					    break;
        //				    case "DEPTLIST": //200902 추가 시작 : 일괄결재선지정
        //					    m_oHTMLProcessor.addParameter("viewtype", "create");
        //					    break;
        //				    default:
        //					    m_oHTMLProcessor.addParameter("viewtype", "read");
        //					    break;
        //			    }
        //		    }
        //		    m_oHTMLProcessor.addParameter("deputytype", gDeputyType);//대결자설정사용여부
        //		    m_oHTMLProcessor.transform();
        //    		
        //		    Apvlist.document.body.innerHTML = m_oHTMLProcessor.output;
        //		    if(selectedRowId!=null)Apvlist.selectRow(selectedRowId);

        //		    //debugging info
        //		    if(m_oFormMenu.APVLISTTABLE!=null)m_oFormMenu.APVLISTTABLE.value=Apvlist.document.body.innerHTML;
        //        }
        //		    */
        ApvLineDisaplyNXSL();
    } catch (e) {
        //alert("오류가 발생했습니다. at refreshList in ApvlineMgr.js\nError Desc:" + e.description);
        alert(strMsg_030 + "\n at refreshList in ApvlineMgr.js\nError Desc:" + e.description);
    }
}
function receiveHTTPXSL() {
    if (m_xmlHTTPXSL.readyState == 4) {
        m_xmlHTTPXSL.onreadystatechange = event_noop;
        var xmlReturn = m_xmlHTTPXSL.responseXML;
        //if(xmlReturn.xml==""){
        if (m_xmlHTTPXSL.responseText.charAt(0) == '\r') {
            alert(m_xmlHTTPXSL.responseText);
        }
        else {
            if (!("ActiveXObject" in window)) {
                document.getElementById("Apvlist").contentWindow.clearSelection();
                document.getElementById("Apvlist").contentDocument.body.innerHTML = "";
            } else {
                Apvlist.clearSelection();
                Apvlist.document.body.innerHTML = "";
            }
            if (!("ActiveXObject" in window)) {
                document.getElementById("Apvlist").contentDocument.body.innerHTML = xmlReturn.documentElement.xml;
                if (gselectedRowId != null) document.getElementById("Apvlist").contentWindow.selectRow(gselectedRowId);
                //debugging info
                if (m_oFormMenu.APVLISTTABLE != null) m_oFormMenu.APVLISTTABLE.value = document.getElementById("Apvlist").contentDocument.body.innerHTML;
            } else {
                Apvlist.document.body.innerHTML = xmlReturn.documentElement.xml;
                if (gselectedRowId != null) Apvlist.selectRow(gselectedRowId);

                //debugging info
                if (m_oFormMenu.APVLISTTABLE != null) m_oFormMenu.APVLISTTABLE.value = Apvlist.document.body.innerHTML;
            }
            gselectedRowId = null;
        }
    }
}

function refreshCC(bAll) {
    var sPath = "";
    bAll = true;
    if (bAll == null || bAll == false) sPath = "[@belongto='" + m_sSelectedAllotType + "']";
    var ccInfos = m_oApvList.selectNodes("steps/ccinfo" + sPath);
    var otblccinfo = document.getElementById("tblccinfo");
    var tbllength = otblccinfo.rows.length;
    //Table 지우기
    for (var i = 0; i < tbllength - 2; i++) {
        otblccinfo.deleteRow(tbllength - i - 1);
    }
    var eTR, eTD;
    for (var i = 0; i < ccInfos.length; i++) {
        var sList = "";
        var ccInfo = ccInfos.nextNode();
        var sBelongTo = ccInfo.getAttribute("belongto");
        var ccList = ccInfo.childNodes;
        for (var j = 0; j < ccList.length; j++) {
            var cc = ccList[j];
            if (cc.hasChildNodes()) cc = cc.firstChild;

            eTR = otblccinfo.insertRow(otblccinfo.rows.length);
            if (!("ActiveXObject" in window)) {
                eTR.addEventListener('mousedown', selectCCRow, true);
            } else {
                eTR.attachEvent("onmousedown", selectCCRow);
            }
            if (cc.nodeName == "person") {
                eTR.setAttribute("id", "ccinfo[" + i + "]/*[" + j + "]/(person|role)[0]");
                //eTR.align= "center";
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = getLngLabel(cc.getAttribute("name"), false); eTD.style.paddingLeft = "10px"; //eTD.height=20;
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = getLngLabel(cc.getAttribute("position"), true);
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = getLngLabel(cc.getAttribute("title"), true);
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = (sBelongTo == "sender") ? strlable_send : ((sBelongTo == "global") ? strlable_global : strlable_receive); //"발신""전역""수신"
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = getLngLabel(cc.getAttribute("ouname"), false);
            } else if (cc.nodeName == "ou") {
                eTR.setAttribute("id", "ccinfo[" + i + "]/*[" + j + "]");
                //eTR.align= "center";
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = "&nbsp;"; eTD.style.paddingLeft = "10px"; //eTD.height=20;
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = "&nbsp;";
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = "&nbsp;";
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = (sBelongTo == "sender") ? strlable_send : ((sBelongTo == "global") ? strlable_global : strlable_receive); //"발신""전역""수신"
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = getLngLabel(cc.getAttribute("name"), false);
            } else if (cc.nodeName == "group") {
                eTR.setAttribute("id", "ccinfo[" + i + "]/*[" + j + "]");
                //eTR.align= "center";
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = "&nbsp;"; eTD.style.paddingLeft = "10px"; //eTD.height=20;
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = "&nbsp;";
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = "&nbsp;";
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = (sBelongTo == "sender") ? strlable_send : ((sBelongTo == "global") ? strlable_global : strlable_receive); //"발신""전역""수신"
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = getLngLabel(cc.getAttribute("name"), false);
            }
        }

    }
}
function moveUpDown(str) { //debugger;
    var oSelTR = getSelectedRowApvlist();
    //    if(window.addEventListener){
    //    	oSelTR = document.getElementById("Apvlist").contentWindow.getSelectedRow();
    //    }else{
    //    	oSelTR = Apvlist.getSelectedRow();
    //    }		
    if (oSelTR == null) return;
    try {
        var elmRoot = m_oApvList.documentElement;
        var xpathCur = oSelTR.id;
        if (!("ActiveXObject" in window)) { xpathCur = ConvertXpath(xpathCur); }
        var elmCur = elmRoot.selectSingleNode(xpathCur);

        if (elmCur == null) return;

        var elmParent = elmCur;
        var xpathNew;
        var sRouteType = getFamilyAttribute(elmCur, "step", "routetype");
        var sUnitType = getFamilyAttribute(elmCur, "step", "unittype");
        var elmTaskInfo;
		
        if (elmCur.nodeName == "person") {
            elmTaskInfo = elmCur.selectSingleNode("taskinfo");
        }

        if ((m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL") && (elmCur.parentNode.selectSingleNode("taskinfo") != null && elmCur.parentNode.selectSingleNode("taskinfo").getAttribute("piid") != getInfo("piid").toUpperCase())) {
            alert(strMsg_303); //"다른 부서의 결재선은 수정할 수 없습니다."
            return;
        }
        if ((m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL") && (elmCur.parentNode.selectSingleNode("taskinfo") == null)) {
            alert(strMsg_303);
            return;
        }


        switch (str) {
            case "UP":
                var elmNext = null;
                do {
                    elmCur = elmParent;
                    elmNext = elmCur.nextSibling;
                    while (elmNext != null && elmNext.nodeName != elmCur.nodeName) {
                        elmNext = elmNext.nextSibling;
                    }
                    elmParent = elmCur.parentNode;
                    //}while(elmParent.nodeName!="steps" && elmNext==null);
                    //division 변경 처리  by sunny
                } while ((elmParent.nodeName != "steps" && elmParent.nodeName != "division") && elmNext == null);
                if (elmNext == null) {
                    return;
                } else {

                    if (elmTaskInfo != null) {
                        if (getFamilyAttribute(elmNext, "step", "routetype") == sRouteType
							&& getFamilyAttribute(elmNext, "step", "unittype") == sUnitType) {

                            if ((elmTaskInfo.getAttribute("kind") != "consent" && elmTaskInfo.getAttribute("kind") != "normal") && elmNext.nodeName != "ou") {
                                alert(strMsg_038); //"순서를 바꿀 수 없습니다. 선택된 결재자의 결재종류는 일반결재이어야 합니다."
                                return;
                            }
                            if (elmNext.nodeName == "person"
								|| (sRouteType == "approve" && sUnitType == "person")) {

                                elmTaskInfo = elmNext.selectSingleNode(".//taskinfo");
                                if (elmTaskInfo.getAttribute("kind") != "normal") {
                                    alert(strMsg_038); //"순서를 바꿀 수 없습니다. 다음 결재자의 결재종류는 일반결재이어야 합니다."
                                    return;
                                }
                            }
                        }
                        if (!(sRouteType == "receive" && sUnitType == "ou")
							&& getFamilyAttribute(elmNext, "step", "routetype") == "approve"
							&& getFamilyAttribute(elmNext, "step", "unittype") == "person") {
                            elmTaskInfo = elmNext.selectSingleNode(".//taskinfo");
                            if (elmTaskInfo.getAttribute("kind") == "authorize") {
                                alert(strMsg_039); //"순서를 바꿀 수 없습니다. 다음 결재자의 결재종류는 전결입니다."
                                return;
                            }
                        }
                    }
                    switch (sRouteType) {
                        case "assist":
                        case "consult":
                            if (elmNext.nodeName == "step"	//Step 전체
								&& elmNext.getAttribute("routetype") == sRouteType	//겹치는 대상이 동일한 RouteType
								&& elmNext.getAttribute("unittype") == sUnitType) {	//동일한 UnitType(부서/개인)

                                var oChildren = elmCur.selectNodes("ou");
                                var elm = oChildren.nextNode();
                                while (elm != null) {
                                    elmNext.appendChild(elm);
                                    elm = oChildren.nextNode();
                                }
                                elmParent.removeChild(elmCur);
                                xpathNew = recalcXPath(xpathCur, "ou", 0);
                            } else {
                                elmParent.insertBefore(elmNext, elmCur);
                                xpathNew = recalcXPath(xpathCur, elmCur.nodeName, 1);
                            }
                            break;
                        case "approve":
                        case "receive":
                        default:
                            elmParent.insertBefore(elmNext, elmCur);
                            xpathNew = recalcXPath(xpathCur, elmCur.nodeName, 1);
                            break;
                    }
                }
                break;

            case "DOWN":
                var elmPrev = null;
                do {
                    elmCur = elmParent;
                    elmNext = elmCur.nextSibling;
                    elmPrev = elmCur.previousSibling;
                    while (elmPrev != null && elmPrev.nodeName != elmCur.nodeName) {
                        elmPrev = elmPrev.previousSibling;
                    }
                    elmParent = elmCur.parentNode;
                    //division 변경 처리  by sunny
                    //}while(elmParent.nodeName!="steps" && elmPrev==null);
                } while ((elmParent.nodeName != "steps" && elmParent.nodeName != "division") && elmPrev == null);

                //감사/감시 위에 결재자 2인 이상 제어(2007.6.7. by chlee)
                //위로 버튼은 적용을 받지 않음
                //아래로 버튼일때
                //0. 현재 위치가 감사 또는 감시일 때만 해당
                //1. 상위가 null이면 아래로 이동 가능
                //2. 바로 위가 감사 또는 감시이면 이동 가능
                //3. 위 1,2에 해당하지 않으면 이동 불가
                //				if(elmNext==null){
                //					alert("No data!");
                //				}
                //				else{
                //					alert(elmNext.xml);
                //					alert(elmNext.getAttribute("name"));
                //				}
                if (elmCur.getAttribute("name") == "감사" || elmCur.getAttribute("name") == "감시") {
                    if ((elmNext != null) && elmNext.getAttribute("name") != "감사" && elmNext.getAttribute("name") != "감시") {
                        return;
                    }
                }
                //------------------------------------------------->

                if (elmPrev == null) {
                    return;
                } else {
                    //division 변경 처리 by sunny
                    if (elmPrev.nodeName == "division") elmTaskInfo = elmPrev.selectSingleNode("taskinfo");
                    if (elmTaskInfo != null) {
                        if (elmTaskInfo.getAttribute("datereceived") != null) {
                            alert(strMsg_040);
                            return;
                        }
                    }
                    elmTaskInfo = null;
                    if (elmPrev.nodeName == "step") elmTaskInfo = elmPrev.selectSingleNode("ou/person/taskinfo");
                    if (elmTaskInfo != null) {

                        if (elmTaskInfo.getAttribute("datereceived") != null) {
                            alert(strMsg_040); //"순서를 바꿀 수 없습니다. 이전 결재자가 기안자이거나 이미 결재문서를 받았습니다."
                            return;
                        }
                        if (getFamilyAttribute(elmPrev, "step", "routetype") == sRouteType
							&& getFamilyAttribute(elmPrev, "step", "unittype") == sUnitType) {

                            if ((elmTaskInfo.getAttribute("kind") != "consent" && elmTaskInfo.getAttribute("kind") != "normal") && elmPrev.nodeName != "ou") {
                                alert(strMsg_038); //"순서를 바꿀 수 없습니다. 선택된 결재자의 결재종류는 일반결재이어야 합니다."
                                return;
                            }

                            if (elmPrev.nodeName == "person"
								|| (sRouteType == "approve" && sUnitType == "person")) {

                                elmTaskInfo = elmPrev.selectSingleNode(".//taskinfo");
                                if (elmTaskInfo.getAttribute("kind") != "normal") {
                                    alert(strMsg_038); //"순서를 바꿀 수 없습니다. 이전 결재자의 결재종류는 일반결재이어야 합니다."
                                    return;
                                }
                            }
                        }
                    }
                    switch (sRouteType) {
                        case "assist":
                        case "consult":
                            if (elmPrev.nodeName == "step"	//Step 전체
								&& elmPrev.getAttribute("routetype") == sRouteType	//겹치는 대상이 동일 RouteType
								&& elmPrev.getAttribute("unittype") == elmCur.getAttribute("unittype")) {	//동일한 Unittype(부서/개인)

                                var oChildren = elmCur.selectNodes("ou");
                                var elm = oChildren.nextNode();
                                while (elm != null) {
                                    elmPrev.appendChild(elm);
                                    elm = oChildren.nextNode();
                                }
                                elmParent.removeChild(elmCur);
                                xpathNew = recalcXPath(xpathCur, elmCur.nodeName, -1);
                            } else {
                                elmParent.insertBefore(elmCur, elmPrev);
                                xpathNew = recalcXPath(xpathCur, elmCur.nodeName, -1);
                            }
                            break;
                        case "approve":
                        case "receive":
                        default:
                            elmParent.insertBefore(elmCur, elmPrev);
                            xpathNew = recalcXPath(xpathCur, elmCur.nodeName, -1);
                            break;
                    }
                }
                break;
        }
        refreshList(xpathNew);
    } catch (e) {
        alert(strMsg_030 + "\n at moveUpDown in ApvlineMgr.js\nError Desc:" + e.description); //"오류가 발생했습니다."
    }
}

function statusChange(e) {
    var bSetDirty = false;
    var oSelTR;
    //    if(window.addEventListener){
    //    	oSelTR = document.getElementById("Apvlist").contentWindow.getPatentRow(e);
    //    }else{
    //    	oSelTR = Apvlist.getPatentRow(e);
    //    }
    oSelTR = getPatentRowApvlist(e)
    var xpathCur = oSelTR.id;
    if (!("ActiveXObject" in window)) { xpathCur = ConvertXpath(xpathCur); }

    var elmRoot = m_oApvList.documentElement;
    var elmCur = elmRoot.selectSingleNode(xpathCur);
    var elmTaskInfo = elmCur.selectSingleNode("taskinfo");

    var sRouteType = getFamilyAttribute(elmCur, "step", "routetype");
    var sUnitType = getFamilyAttribute(elmCur, "step", "unittype");

    //본인이 속해있는 결재단계만 수정을 한다.
    //합의 부서에서 일반결재 단계 수정을 막는다.
    if ((m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL") && (sRouteType == "approve")) {
        refreshList(xpathCur);
        return;
    }
    if ((m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL") && (sRouteType != "approve")) {
        var Curpiid = m_oCurrentOUNode.selectSingleNode("taskinfo/@piid").text;
        var Cmppiid = elmCur.parentNode.selectSingleNode("taskinfo/@piid").text;
        if (Curpiid == Cmppiid) {
        } else {
            refreshList(xpathCur);
            return;
        }
    }

    var elmNext = getNextElm(elmCur);

    var sCurType = (!("ActiveXObject" in window)) ? e.target.value : event.srcElement.value;

    switch (sCurType) {
        case "substitute": //대결
            if (elmNext == null) {
                alert(strMsg_042); //"결재종류를 바꿀 수 없습니다. 대결을 할 대상이 없습니다."
            } else {
                var elmNextTaskInfo = elmNext.selectSingleNode("taskinfo");
                if (elmNextTaskInfo.getAttribute("kind") != "normal") {
                    alert(strMsg_038); //"결재종류를 바꿀 수 없습니다. 다음 결재자의 결재종류는 일반결재이어야 합니다."
                } else {
                    elmTaskInfo.setAttribute("kind", "substitute");
                    elmNextTaskInfo.setAttribute("kind", "bypass");
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
            var elmNextAssist = getSibling(elmCur, "step", "routetype", "assist", true, true)
            var elmNextConsult = getSibling(elmCur, "step", "routetype", "consult", true, true);
            var elmNextAudit = getSibling(elmCur, "step", "routetype", "audit", true, true);
			var elmNextName = getSibling(elmCur, "step", "name", "reference", true, true); // jkh추가 20160503

            if (sRouteType == "approve" && (sUnitType == "person" || sUnitType == " role") && elmNextAssist != null) {
                alert(strMsg_044); //"결재종류를 바꿀 수 없습니다. 전결자 다음에 협조가 올 수 없습니다."
            } else if (sRouteType == "approve" && (sUnitType == "person" || sUnitType == "role") && elmNextConsult != null) {
                alert(strMsg_044);
            } else if (sRouteType == "approve" && (sUnitType == "person" || sUnitType == "role") && elmNextAudit != null) {
                alert(strMsg_044);
				//20160503 jkh추가
            } else if (sRouteType == "approve" && elmNextName != null) {
                alert("결재종류를 바꿀 수 없습니다. 전결자 다음에 참조자가 올 수 없습니다."); //"결재종류를 바꿀 수 없습니다. 전결자 다음에 참조자가 올 수 없습니다."
                ////20160503 jkh끝
            } else {
                elmTaskInfo.setAttribute("kind", "authorize");
                while (elmNext != null) {
                    var elmNextTaskInfo = elmNext.selectSingleNode("taskinfo");
                    elmNextTaskInfo.setAttribute("kind", "skip");
                    elmNextTaskInfo.setAttribute("status", "skipped");
                    elmNextTaskInfo.setAttribute("result", "skipped");
                    elmNext = getNextElm(elmNext);
                }
                bSetDirty = true;
            }
            /*}*/
            break;
        case "review": //후결
		     var elmNextName = getSibling(elmCur, "step", "name", "reference", true, true); // jkh추가 20160503
            //현재 결재자(문서를 받은 경우)를 후결로 하는 경우 방지
            //if(elmTaskInfo.getAttribute("datereceived")!=""){
            if (elmTaskInfo.getAttribute("datereceived") != null) {
                alert(strMsg_121); //"결재종류를 바꿀 수 없습니다. 현재 결재자는 후결로 변경할 수 없습니다."
            }
            //2013-12-11 hyh 추가
            else if (xpathCur.split("/")[1].substring(xpathCur.split("/")[1].indexOf("step[") + 6, 5) == elmRoot.selectNodes("division/step").length - 1) {
                alert(strMsg_334);  //최상위결재권자는 "참조", "합의", "부서합의", "전결", "후열"로 지정할 수 없습니다.
            }
            //2013-12-11 hyh 추가 끝
			
			//2016-05-04 jkh 추가
            else if (sRouteType == "approve" && elmNextName != null) {
             alert("결재종류를 바꿀 수 없습니다. 후결자 다음에 참조자가 올 수 없습니다."); //"결재종류를 바꿀 수 없습니다. 전결자 다음에 참조자가 올 수 없습니다."
            }
            //2016-05-04 jkh 끝
            else {
                var elmAnotherReviewer;
                var xPathReviewer = "(person|role)[taskinfo/@kind='review']";
                if (!("ActiveXObject" in window)) { xPathReviewer = xPathReviewer.replace("(person|role)", "(name()='person' or name()='role')") }

                if (sRouteType == "approve" && (sUnitType == "person" || sUnitType == "role")) {
                    elmAnotherReviewer = elmRoot.selectSingleNode(xpathCur.split("/")[0] + "/step/ou/" + xPathReviewer);
                } else {
                    elmAnotherReviewer = elmCur.parentNode.selectSingleNode(xPathReviewer);
                }
                if (elmAnotherReviewer != null) {
                    //2013-03-21 yu2mi : 이수 다중후결 수정
                    //alert(strMsg_046); //"결재종류를 바꿀 수 없습니다. 후결자가 두 명이상 있을 수 없습니다."
                    elmTaskInfo.setAttribute("kind", "review");
                    bSetDirty = true;
                } else {
                    elmTaskInfo.setAttribute("kind", "review");
                    bSetDirty = true;
                }
            }
            break;
        case "confidential":  //친선
            elmTaskInfo.setAttribute("kind", "confidential");
            while (elmNext != null) {
                elmNextTaskInfo = elmNext.selectSingleNode("taskinfo");
                elmNextTaskInfo.setAttribute("kind", "normal");
                elmNextTaskInfo.setAttribute("status", "inactive");
                elmNextTaskInfo.setAttribute("result", "inactive");

                elmNext = getNextElm(elmNext);
                if (elmNext == null || elmNext.selectSingleNode("taskinfo[@kind='skip']") == null) elmNext = null;
            }
            bSetDirty = true;
            break;
        case "conveyance":  //전달
            elmTaskInfo.setAttribute("kind", "conveyance");
            while (elmNext != null) {
                elmNextTaskInfo = elmNext.selectSingleNode("taskinfo");
                elmNextTaskInfo.setAttribute("kind", "normal");
                elmNextTaskInfo.setAttribute("status", "inactive");
                elmNextTaskInfo.setAttribute("result", "inactive");

                elmNext = getNextElm(elmNext);
                if (elmNext == null || elmNext.selectSingleNode("taskinfo[@kind='skip']") == null) elmNext = null;
            }
            bSetDirty = true;
            break;
        case "normal": //일반결재
            if (elmNext == null) {
                //2013-03-21 yu2mi : 이수 다중후결 수정
                if (elmTaskInfo.getAttribute("datereceived") != null && elmTaskInfo.getAttribute("kind") == "review") {
                    alert(strMsg_336); //"이미 받은 후결은 변경 할 수 없습니다."
                    elmNext = null;
                    bExitNormal = true;
                } else {
                    elmTaskInfo.setAttribute("kind", "normal");
                    if (elmTaskInfo.getAttribute("datereceived") != null) {
                    } else {
                        elmTaskInfo.setAttribute("status", "inactive");
                        elmTaskInfo.setAttribute("result", "inactive");
                        //elmTaskInfo.setAttribute("customattribute2",null);
                    }
                }
            } else {
                var bExitNormal = false;
                while (elmNext != null) {
                    elmNextTaskInfo = elmNext.selectSingleNode("taskinfo");
                    if (elmNextTaskInfo.getAttribute("datereceived") != null) {
                        alert(strMsg_179); //"다음 결재자가 이미 문서를 받았습니다."
                        elmNext = null;
                        bExitNormal = true;
                    } else {
                        //if ( elmNextTaskInfo.getAttribute("kind")!="skip"){ //신택상
                        elmNextTaskInfo.setAttribute("kind", "normal");
                        if (elmNextTaskInfo.getAttribute("datereceived") != null) {
                        } else {
                            elmNextTaskInfo.setAttribute("status", "inactive");
                            elmNextTaskInfo.setAttribute("result", "inactive");
                        }
                        if (elmNextTaskInfo.getAttribute("customattribute2") != null) elmNextTaskInfo.removeAttribute("customattribute2");
                        //}
                        elmNext = getNextElm(elmNext);
                        //if(elmNext==null || elmNext.selectSingleNode("taskinfo[@kind='skip']")==null)elmNext=null;
                    }
                }
                if (!bExitNormal) {
                    elmTaskInfo.setAttribute("kind", "normal");
                    if (elmTaskInfo.getAttribute("datereceived") != null) {
                    } else {
                        elmTaskInfo.setAttribute("status", "inactive");
                        elmTaskInfo.setAttribute("result", "inactive");
                    }
                    if (elmTaskInfo.getAttribute("customattribute2") != null) elmTaskInfo.removeAttribute("customattribute2");
                }
            }
            bSetDirty = true;
            break;
        // 2006-08-25 이두표 시작 
        case "bypass": //후열
            if (elmNext == null) {
                alert(strMsg_149); //"결재종류를 바꿀 수 없습니다. 최종 결재자는 후열을 선택 할 수 없습니다."
            } else {
                elmTaskInfo.setAttribute("kind", "bypass");
                //elmTaskInfo.setAttribute("status","completed");
                elmTaskInfo.setAttribute("status", getInfo("svdt"));
                //elmTaskInfo.setAttribute("result","bypassed");
                elmTaskInfo.setAttribute("result", "prebypass");
                //elmTaskInfo.setAttribute("datecompleted",getInfo("svdt"));
                elmTaskInfo.setAttribute("datecompleted", "");
                //2006.10.11 김현태 다음 결재자 일반결재 변환 막음
                /*
                while(elmNext!=null){
                elmNextTaskInfo = elmNext.selectSingleNode("taskinfo");
                elmNextTaskInfo.setAttribute("kind","normal");

                elmNextTaskInfo.setAttribute("status","inactive");
                elmNextTaskInfo.setAttribute("result","inactive");

                elmNext = getNextElm(elmNext);
                if(elmNext==null || elmNext.selectSingleNode("taskinfo[@kind='skip']")==null)elmNext=null;
                }
                */
                bSetDirty = true;
                try { m_oFormMenu.setApvChangeMode("bypass"); } catch (e) { }
            }
            break;
        // 2006-08-25 이두표 끝 
        case "skip": //결재안함
            var bExitNormal = false;
            if (elmTaskInfo.getAttribute("datereceived") != null) {
                //alert("결재문서를 받은 경우 결재안함으로 변경불가합니다.");
                bExitNormal = true;
                elmNext = null;
            }
            //skip 다음으로 결재문서를 받은 사용자가 있을 경우 변경을 하지 못함
            while (elmNext != null) {
                elmNextTaskInfo = elmNext.selectSingleNode("taskinfo");
                if (elmNextTaskInfo.getAttribute("datereceived") != null) {
                    alert(strMsg_179); ; //"다음 결재자가 이미 문서를 받았습니다."
                    bExitNormal = true;
                    elmNext = null;
                } else {
                    elmNext = getNextElm(elmNext);
                    //if(elmNext==null || elmNext.selectSingleNode("taskinfo[@kind='skip']")==null)elmNext=null;
                }
            }
            if (!bExitNormal) {
                elmTaskInfo.setAttribute("kind", "skip");
                elmTaskInfo.setAttribute("status", "skipped");
                elmTaskInfo.setAttribute("result", "skipped");
                //elmTaskInfo.setAttribute("customattribute2","기타");
                bSetDirty = true;
            }
            break;
        default:
    }
    if (bSetDirty) try { m_oFormMenu.setApvDirty(); } catch (e) { }
    refreshList(xpathCur);
}

function setApvList() {

    //=== 제일상단의 결재자가 참조,합의,부서합의,전결인경우 경고창 띄우기 (2012-11-15 HIW)  ======
    var vIsMaxUpCc = false;
    var vPreRootDivision = "N";
	
	if(getInfo("mode")=="DRAFT"){  //jkh 조건문 20161110
	
	chkRetire(); //jkh 2015-04-16 결재리스트 퇴직자 체크
    //jkh 2015-04-16 결재리스트에 퇴직자가 있으면 새로고침 추가 
	
	}
	
    if (retireCheckYN == "N") {

        location.reload();


        return false;
    }
    //jkh 2015-04-16 결재리스트에 퇴직자가 있으면 새로고침 끝

    $("#tblApvList tr").each(function (i) {

        if (i == 2) {  //제일상단 결재자

            //alert($(this).find("td:nth-child(6)").text());
            var vAppType = $(this).find("td:nth-child(6)").text();
            //if (vAppType == "참조" || vAppType == "Reference" || vAppType == "参照") {
            if (CheckProhibitType(vAppType)) {
                //alert(strMsg_328);  //결재선에서 참조는 최종결재자 전에 위치해야 합니다.\n현 참조자를 결재자 아래로 내려주십시요.
                alert(strMsg_334);  //최상위결재권자는 "참조", "합의", "부서합의", "전결", "후열"로 지정할 수 없습니다.
                vIsMaxUpCc = true;
                return;
            }
        }

        if (vPreRootDivision == "Y") {
            var vAppType = $(this).find("td:nth-child(6)").text();
            //if (vAppType == "참조" || vAppType == "Reference" || vAppType == "参照") {
            if (CheckProhibitType(vAppType)) {
                //alert(strMsg_328);  //결재선에서 참조는 최종결재자 전에 위치해야 합니다.\n현 참조자를 결재자 아래로 내려주십시요.
                alert(strMsg_334);  //최상위결재권자는 "참조", "합의", "부서합의", "전결", "후열"로 지정할 수 없습니다.
                vIsMaxUpCc = true;
                return;
            }
        }
        var vNo = $(this).find("td:nth-child(1)").text();
        if (vNo.length == 1)
            vPreRootDivision = "Y";
        else
            vPreRootDivision = "N";

    });

    if (vIsMaxUpCc)
        return;
    //=======================================================================

    //=== 인장권자 Validation 체크 (2012-12-17 HIW)  =========================
    //debugger;
	//2014-12-19 PSW 부서문서함에서 재사용시 인장권자 체크 관련 수정
    //if(opener.getInfo("gloct") != "DEPART")
    //{
        //2014-03-25 hyh 수정
        //if (getInfo("fmpf") == "WF_FORM_ISU_ALL_COM010") {  //대내공문일경우
        //2020-01-28 psw 수정
        //if (getInfo("fmpf") == "WF_FORM_ISU_ALL_COM010" || getInfo("fmnm").indexOf("대외공문") == 0) {  //대내공문, 대외공문일경우
        if (getInfo("fmpf") == "WF_FORM_ISU_ALL_COM010" || (getInfo("fmnm").indexOf("대외공문") == 0 && getInfo("fmpf") != "WF_FORM_ISU_ALL_COM030")) {  //대내공문, 대외공문일경우 (대외공문_접수 양식은 제외)
        //2020-01-28 psw 수정 끝
		//2014-03-25 hyh 수정 끝
            var vStampRightsCnt = 0;
            var vStampRightsSeq = 0;
            var vSeq = 0;

            $("#tblApvList tr").each(function (i) {
                if (i > 1) {

                    if ($(this).attr("divisionType") == "send") {
                        vSeq++;

                        if ($(this).attr("STAMP") == "Y") {
                            //$(this).attr("personCode")  //PERSON_CODE
                            vStampRightsCnt++;
                            vStampRightsSeq = vSeq;
                        }
                    }
                }
            });
           
			
			if (getInfo("mode") == "DRAFT") { //20170912 인장권자 수정 
			     
				//2014-03-25 hyh 추가
				if (vStampRightsCnt < 1) {
					alert(strlable_StampRightsNo); //alert("인장권자를 지정하세요");
					return false;
				}
				//2014-03-25 hyh 추가 끝

				if (vStampRightsCnt > 1) {
					alert(strlable_StampRightsOnlyOne);  //alert("결재선에서 인장권자는 한명이여야 합니다.");
					return;
				}
				if (vStampRightsCnt > 0 && vStampRightsSeq > 1) {
					alert(strlable_StampRightsLastPosit);   //alert("인장권자는 최종결재자에 위치해야 합니다.");
					return;
				}
			}
        }
    //}
    //=======================================================================
    //debugger;
    if (evaluateApvList()) {
        //child가 없는 node 삭제
        var ccInfos = m_oApvList.selectNodes("steps/ccinfo");
        for (var i = 0; i < ccInfos.length; i++) {
            var ccInfo = ccInfos.nextNode(); //ccInfos[i];
            var ccList = ccInfo.childNodes;
            if (ccList.length == 0) { m_oApvList.documentElement.removeChild(ccInfo); }
        }
        //합의 기안자 다음으로 무조건 넘김 by sunny 2006.09
        //setApvList4Consult();
        //진행 중 결재문서 변경 by sunny 2006.10
        var bChange = false;
        var m_oApvListExt = CreateXmlDocument();
        m_oApvListExt.loadXML(get_choiseIdOrName("APVLIST"));
        if (m_oApvListExt.documentElement.xml != m_oApvList.documentElement.xml) { bChange = true; }

        if (m_oFormMenu.contentWindow) {
            m_oFormMenu.contentWindow.document.getElementsByName("APVLIST")[0].value = m_oApvList.documentElement.xml;
        }
        else {
            m_oFormMenu.children.item("APVLIST").value = m_oApvList.documentElement.xml; ;
        }
        if (admintype == "ADMIN") {//관리자 일 경우 결재선 변경 함수 호출
            if (getInfo("RECEIPT_LIST") != opener.m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value) { bChange = true; }
            if (bChange) { (m_oFormMenu.contentWindow ? m_oFormMenu.contentWindow : m_oFormMenu).document.getElementById("btChgApv").style.display = ""; (m_oFormEditor.contentWindow) ? m_oFormEditor.contentWindow.setInlineApvList() : m_oFormEditor.setInlineApvList(); } //(m_oFormMenu.contentWindow?m_oFormMenu.contentWindow:m_oFormMenu).document.getElementById("btChgApv").style.display = "";
            window.close();
        } else {
            var sMode = m_sApvMode.toUpperCase();
            if ((sMode == "REDRAFT") || (sMode == "SUBREDRAFT")) {
                (m_oFormMenu.contentWindow ? m_oFormMenu.contentWindow : m_oFormMenu).document.getElementById("btDeptDraft").style.display = "inline";
                (m_oFormMenu.contentWindow ? m_oFormMenu.contentWindow : m_oFormMenu).document.getElementById("btRec").style.display = "none";
                (m_oFormMenu.contentWindow ? m_oFormMenu.contentWindow : m_oFormMenu).document.getElementById("btCharge").style.display = "none";
            }
            if ((sMode == "DRAFT") || (sMode == "TEMPSAVE") || (sMode == "REDRAFT") || (sMode == "SUBREDRAFT") || (sMode == "APPROVAL") || (sMode == "PROCESS") || (sMode == "RECAPPROVAL")) {  //2007.10 박동현 (sMode == "RECAPPROVAL") 추가
                (m_oFormEditor.contentWindow) ? m_oFormEditor.contentWindow.setInlineApvList() : m_oFormEditor.setInlineApvList();

                //if (sMode == "REDRAFT" || sMode == "SUBREDRAFT") {
		           // m_oFormEditor.contentWindow.location.reload(); //2016-03-07 jkh 의견 중복보이는거 처리 추가(합의부서&수신부서)
                // }
                //if (sMode == "SUBREDRAFT") {
                //    m_oFormEditor.contentWindow.location.reload(); //2016-03-07 jkh 의견 중복보이는거 처리 추가(합의부서)
                //}
				
                if (sMode == "PROCESS") {  // 진행함일때만 결재선변경 버튼 필요 sMode == "APPROVAL" || 
                    if (bChange) ((m_oFormEditor.contentDocument) ? m_oFormEditor.contentDocument : m_oFormMenu.document).getElementById("btChgApv").style.display = "";
                }

                //마지막 결재자인지 확인	
                var oPendingSteps = m_oApvList.documentElement.selectNodes("division/step[.//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='pending' or .//taskinfo/@status='reserved')]");
                var oinActiveSteps = m_oApvList.documentElement.selectNodes("division/step[@routetype!='receive' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass' and .//taskinfo/@kind!='skip'  and .//taskinfo/@status='inactive']");
                var oLASTAPPROVER = ((m_oFormMenu.contentWindow) ? m_oFormMenu.contentWindow.document.getElementsByName("bLASTAPPROVER")[0] : m_oFormMenu.children.item("bLASTAPPROVER"));
                if ((oPendingSteps.length == 1) && (oinActiveSteps.length == 0)) {
                    if (oLASTAPPROVER != null) oLASTAPPROVER.value = "true";
                } else {
                    if (oLASTAPPROVER != null) oLASTAPPROVER.value = "false";
                }
                //마지막 결재자인지 확인
            }

            //200902 추가 시작 : 일괄결재선지정
            if (sMode == "DEPTLIST") {
                var m_oApvList2 = CreateXmlDocument();
                m_oApvList2.loadXML("<?xml version='1.0' encoding='utf-8'?>" + get_choiseIdOrName("APVLIST"));
                var elmRoot = m_oApvList2.documentElement;
                var elmlistCount = elmRoot.selectNodes("division/step/ou/person").length;
                if (elmlistCount == 0) {
                    if (!window.confirm(strMsg_259)) {
                        return;
                    } else {
                        ((m_oInfoSrc.contentWindow) ? m_oInfoSrc.contentWindow : m_oInfoSrc).goBlocApvline();
                    }
                } else {
                    ((m_oInfoSrc.contentWindow) ? m_oInfoSrc.contentWindow : m_oInfoSrc).goBlocApvline();
                }
            }
            window.close();
        }
    }
}

//"참조","합의","부서합의","전결","후열"인지 체크 (2013-03-13 HIW)
function CheckProhibitType(pType) {
    var vResult = false;
    if (pType == "참조")
        vResult = true;
    else if (pType == "Reference")
        vResult = true;
    else if (pType == "参照")
        vResult = true;
    else if (pType == "参照")
        vResult = true;
    else if (pType == "합의")
        vResult = true;
    else if (pType == "Consent")
        vResult = true;
    else if (pType == "合计")
        vResult = true;
    else if (pType == "合意")
        vResult = true;
    else if (pType == "부서합의")
        vResult = true;
    else if (pType == "Department consent")
        vResult = true;
    else if (pType == "部门协议")
        vResult = true;
    else if (pType == "部署合意")
        vResult = true;
    else if (pType == "전결일반결재")
        vResult = true;
    else if (pType == "授权一般决裁") //jkh추가 20161011
        vResult = true;
    return vResult;
}

function joinAttrs(elmList, sAttrName) {
    if (elmList.length == 0) return "";
    var sJoin = "";
    var elm = elmList.nextNode();
    while (elm != null) {
        sJoin += (sJoin == "" ? "" : ";") + elm.getAttribute(sAttrName);
        elm = elmList.nextNode();
    }
    elmList.reset();
    return sJoin;
}

function doButtonAction(obj) { //debugger;
    var bSetDirty = false;
    //switch(event.srcElement.id){
    switch (obj.id) {
        case "btPerson": bSetDirty = true;
            /*			if (m_sApvMode=="REDRAFT"){
            addRecPerson();
            break;
            }else if (m_sApvMode=="SUBREDRAFT"){
            addSubPerson();
            break;
            }else 
            */

            //대내공문일경우 인장권자 중복체크 (2012-12-17 HIW)
            //if (gStampRightsYN == "Y") {
            if (getInfo("fmpf") == "WF_FORM_ISU_ALL_COM010") {
                if (!CheckDupStampRights())
                    return;
            }

            if (m_sApvMode == "CHARGE") {
                addChargePerson();
            } else if (m_sApvMode == "REDRAFT") {
                addReceiptPerson();
            } else {
                addPerson();
            }
            break;
        case "btReceipt": bSetDirty = true; addReceipt(); break;
        case "btCharge": bSetDirty = true; addCharge(); break;
        case "btGroup": bSetDirty = true; addGroup(); break;
        case "btPAssist": bSetDirty = true; addPAssist('serial'); break;
        case "btPAssistPL": bSetDirty = true; addPAssist('parallel'); break; //병렬협조추가forBK
        case "btDAssist": bSetDirty = true; addDAssist('serial'); break;
        case "btDAssistPL": bSetDirty = true; addDAssist('parallel'); break;
        case "btPConsult": bSetDirty = true; addPConsult('parallel'); break;
        case "btPConsult2": bSetDirty = true; addPConsult('serial'); break;
        case "btDConsult": bSetDirty = true; addDConsult('parallel'); break;
        case "btDConsult2": bSetDirty = true; addDConsult('serial'); break;
        case "btDelete": bSetDirty = true; deletePerson(); break;
        case "btUp": bSetDirty = true; moveUpDown("UP"); break;
        case "btDown": bSetDirty = true; moveUpDown("DOWN"); break;
        case "btCC": if (m_bCC) { bSetDirty = true; setCC("global"); } break;
        case "btSendCC": if (m_bCC) { bSetDirty = true; setCC("sender"); } break;
        case "btRecCC": if (m_bCC) { bSetDirty = true; setCC("receiver"); } break;
        case "btDeleteCC": bSetDirty = true; deleteCC(); break;
        case "btApplyLine": bSetDirty = true; applyLine(); break;
        case "btResetLine": resetLine(); break;
        case "btOK": setApvList(); break;
        case "btExit": window.close(); break;
        case "btRecDept": addRecDept(); break;
        case "btDeleteRec": delList(); break;
        case "btPlPerson": bSetDirty = true; addparallelPerson(); break; //동시결재 추가 2006.03.01 by sunny
        case "btPAudit": bSetDirty = true; addPAudit("감사"); break; //감사 추가 2007.02 by sunny
        case "btPAudit1": bSetDirty = true; addPAudit("준법"); break;
        case "btDAudit": bSetDirty = true; addDAudit("감사"); break;
        case "btDAudit1": bSetDirty = true; addDAudit("준법"); break; //준법처
        case "btDAuditETC": bSetDirty = true; addDAuditETC(); break;
        case "btSaveApvLine": CoviWindow("../ApvLIneList/ApvlinelistMgr.aspx", "ApvlinelistMgr", 900, 680, 'fix'); break;
        case "btExtType": bSetDirty = true; addExtType(); break;
        case "btPReview": bSetDirty = true; addPReview(); break;
        case "btPersonConfirm": bSetDirty = true; addPersonExt('confirm'); break;
        case "btPersonShare": bSetDirty = true; addPersonExt('reference'); break;
    }
    if (bSetDirty) try { if (m_oFormMenu.contentWindow) { m_oFormMenu.contentWindow.setApvDirty(); } else { m_oFormMenu.setApvDirty(); } } catch (e) { }
}

//인장권자 중복체크 (2012-12-17 HIW)
function CheckDupStampRights() {
    //debugger;
    var vRtnVal = true;

    //if (gStampRightsYN == "Y") {
    var vSelUsersCd = "";
    var vTableID = ListItems.g_eGalTable.id;

    $("#ListItems").contents().find("#" + vTableID + " tr").each(function (i) {  //왼쪽리스트테이블ID: tblGalInfo
        if (i > 0) {
            if ($(this).find("td:nth-child(1)").children().attr('checked')) {
                vSelUsersCd += $(this).attr("em") + ";";
            }
        }
    });

    if (vSelUsersCd.length > 0) {
        vSelUsersCd = vSelUsersCd.substring(0, vSelUsersCd.length - 1);
        var arrUsersCd = vSelUsersCd.split(";")
        for (var k = 0; k < arrUsersCd.length; k++) {
            $("#tblApvList tr").each(function (i) {
                if (i > 1) {
                    if ($(this).attr("STAMP") == "Y") {
                        if (arrUsersCd[k] == $(this).attr("personCode")) {
                            alert(strlable_StampRightsNoDupli);  //alert("인장권자는 결재선에 중복되어 들어갈 수 없습니다.");
                            vRtnVal = false;
                            return vRtnVal;
                        }
                    }
                }
            });

        }
    }
    //}
    return vRtnVal;
}

function viewComment(idx) {
    var rgParams = null;
    rgParams = new Array();
    rgParams["objMessage"] = document.getElementById(idx).value; //Apvlist.getComment(idx);
    var nWidth = 420;
    var nHeight = 420;
    var sFeature = "dialogHeight:" + nHeight + "px;dialogWidth:" + nWidth + "px;status:no;resizable:yes;scrolling:no;help:no;";
    var strNewFearture = ModifyDialogFeature(sFeature);
    //201107 의견조회 관련 수정
    var vRetval = window.showModalDialog("comment.aspx", rgParams, strNewFearture);
    //var vRetval = window.showModelessDialog("comment.aspx", rgParams, "dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;scrolling:no;help:no;");

}
function applyLine() {//debugger;
    if (self.iApvLine.m_id != "") {
        switch (m_sApvMode) {
            case "REDRAFT":
                //2006.09.26 김현태 개인결재선 적용방법 변경
                //var oSteps = self.iApvLine.queryGetData();
                var oSteps = self.iApvLine.getApvlineStep();
                var oCheckSteps = chkAbsent(oSteps);
                if (oCheckSteps) {
                    /*
                    var nodesAllItems = oSteps.selectNodes("division/step");//oSteps.selectNodes("division/step/ou/person");
                    for(var x=0; x<nodesAllItems.length; x++){
                    m_oCurrentOUNode.appendChild(nodesAllItems.item(x));
                    }
                    */
                    //크로스브라우징 처리 (2013-03-21 HIW)
                    var nodesAllItems = $(oSteps).find("division>step");
                    $(nodesAllItems).each(function (index, element) {
                        $(m_oCurrentOUNode).append($(element));
                    });

                    refreshList();
                    //2006.09.26 개인결재선 리스트 Refresh
                    self.iApvLine.getPrivateSteps();
                }
                break;
            case "SUBREDRAFT":
                //협조전				
                alert(strMsg_047); //"아직 지원하지 않습니다"
                break;
            default:
                //2006.09.26 김현태 개인결재선 적용방법 변경
                //var oSteps = self.iApvLine.queryGetData();
                var oSteps = self.iApvLine.getApvlineStep();
                PrivateYN = "Y"; //20180731 개인결재선 추가시 변경 
				var oCheckSteps = chkAbsent(oSteps);
                //var oCheckSteps = true;
                var oApvList = CreateXmlDocument();

                if (oCheckSteps) {
                    var oStep = oApvList.createElement("step");
                    var oOU = oApvList.createElement("ou");
                    var oPerson = oApvList.createElement("person");
                    var oTaskinfo = oApvList.createElement("taskinfo");
                    var oDivStep = oSteps.selectSingleNode("division/step");
                    var oDivTaskinfo = oSteps.selectSingleNode("division/taskinfo");
                    var oDiv = oSteps.selectSingleNode("division");
                    //2006.09.20 김현태 결재선 적용 시 기안자 사라지는 오류 수정
                    //oSteps.insertBefore(oStep, oSteps.firstChild).appendChild(oOU).appendChild(oPerson).appendChild(oTaskinfo);
                    oSteps.firstChild.insertBefore(oStep, oDivStep).appendChild(oOU).appendChild(oPerson).appendChild(oTaskinfo);
                    oSteps.setAttribute("initiatoroucode", getInfo("dpid_apv"));
                    oStep.setAttribute("unittype", "person");
                    oStep.setAttribute("routetype", "approve");
                    oStep.setAttribute("name", strlable_writer);
                    oOU.setAttribute("code", getInfo("dpid_apv"));
                    oOU.setAttribute("name", getInfo("dpdn_apv"));
                    oPerson.setAttribute("code", getInfo("usid"));
                    oPerson.setAttribute("name", getInfo("usdn"));
                    oPerson.setAttribute("position", getInfo("uspc") + ";" + getInfo("uspn"));
                    oPerson.setAttribute("title", getInfo("ustc") + ";" + getInfo("ustn"));
                    oPerson.setAttribute("level", getInfo("uslc") + ";" + getInfo("usln"));
                    oPerson.setAttribute("oucode", getInfo("dpid"));
                    oPerson.setAttribute("ouname", getInfo("dpdn"));
                    oPerson.setAttribute("sipaddress", getInfo("ussip"));
                    oTaskinfo.setAttribute("status", "inactive");
                    oTaskinfo.setAttribute("result", "inactive");
                    oTaskinfo.setAttribute("kind", "charge");
                    oTaskinfo.setAttribute("datereceived", getInfo("svdt"));
                    oTaskinfo.setAttribute("customattribute1", getInfo("usit"));
                    oDivTaskinfo.setAttribute("status", "inactive");
                    oDivTaskinfo.setAttribute("result", "inactive");
                    oDivTaskinfo.setAttribute("kind", "normal");
                    oDivTaskinfo.setAttribute("datereceived", getInfo("svdt"));
                    oDiv.setAttribute("name", strlable_circulation_sent); //"발신"
                    oDiv.setAttribute("oucode", getInfo("dpid_apv"));
                    oDiv.setAttribute("ouname", getInfo("dpdn_apv"));

                    var nodesAllItems = oSteps.selectNodes("steps/division/step");
                    for (var x = 0; x < nodesAllItems.length; x++) {
                        oSteps.documentElement.appendChild(nodesAllItems.item(x));
                    }

                    m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + oSteps.xml);
                    refreshList();
                    refreshCC(true);
                    //2006.09.26 개인결재선 리스트 Refresh
                    self.iApvLine.getPrivateSteps();
                }
                break;
        }
    } else {
        alert(strMsg_048); //"결재선을 먼저 선택하십시요"
    }
}
function resetLine() {
    m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + m_oFormMenu.APVLIST.value);
    document.getElementById("Apvlist").contentWindow.clearSelection();
    refreshList();
}
function evaluateApvList() {
    var elmRoot = m_oApvList.documentElement;
    //scCHLimit 결재자 제한	//scACLimit  합의자 제한
    if (getInfo("scCHLimit") == 1 && getInfo("scCHLimitV") != '') {
        var elmApprove = elmRoot.selectNodes("division/step[@routetype='approve' and @unittype='person' and ou/person[taskinfo/@kind!='charge']]");
        if (elmApprove == null) {
            alert(strMsg_049); //"결재자를 지정하십시요"
            return false;
        } else if (elmApprove.length > parseInt(getInfo("scCHLimitV"))) {
            alert(strMsg_050); return false; //alert("결재선에서 결재자수 " + getInfo("scCHLimitV") + "명을 초과할 수 없습니다"); return false;
        }
    }

    if (getInfo("scPCoo") == 1 && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL" || m_sApvMode == "PCONSULT")) {
        var elmAssist = elmRoot.selectSingleNode("division/step[@routetype='assist' and @unittype='person']");
        if (elmAssist == null) {
            //if(confirm("협조자 없이 진행하시겠습니까?"))return true;
            //	return chkConsultAppLine(elmRoot);
            if (!chkConsultAppLine(elmRoot)) return false;
        } else {
            //	return chkConsultAppLine(elmRoot);
            if (!chkConsultAppLine(elmRoot)) return false;
        }
    }
    if (getInfo("scPAgr") == 1 && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL" || m_sApvMode == "PCONSULT")) {
        var elmConsult = elmRoot.selectSingleNode("division/step[@routetype='consult' and @unittype='person' and @allottype='parallel']");
        if (elmConsult == null) {
            //if(confirm("개인합의 없이 진행하시겠습니까?")){
            if (getInfo("scDAgr") == "1") {
                //return chkConsultAppLine(elmRoot);
                if (!chkConsultAppLine(elmRoot)) return false;
            } else {
                //return true;
            }
            //}else{
            //	return false;
            //}
        } else {
            if (getInfo("scACLimit") == 1 && getInfo("scACLimitV") != '' && elmConsult.selectNodes("ou").length > parseInt(getInfo("scACLimitV"))) {
                //alert("결재선에서 합의자수 " + getInfo("scACLimitV") + "명을 초과할 수 없습니다"); return false;
                alert(strMsg_051 + "\r\n ~ : " + getInfo("scACLimitV")); return false;
            } else {
                //return chkConsultAppLine(elmRoot);
                if (!chkConsultAppLine(elmRoot)) return false;
            }
        }
    }
    if (getInfo("scDAgr") == 1 && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL" || m_sApvMode == "PCONSULT")) {
        var elmConsult = elmRoot.selectSingleNode("division/step[@routetype='consult' and @unittype='ou' and @allottype='parallel']");
        if (elmConsult == null) {
            //if(confirm("부서합의 없이 진행하시겠습니까?")){
            if (getInfo("scPAgr") == "1") {
                //return chkConsultAppLine(elmRoot);
                if (!chkConsultAppLine(elmRoot)) return false;
            } else {
                //return true;
            }
            //}else{
            //	return false;
            //}
        } else {
            //            var emlSteps = elmRoot.selectNodes("division/step");
            //            var emlStep;
            //            var HasApprover = false;
            //            var HasConsult = false;
            //            for (var i = 0; i < emlSteps.length; i++) {
            //                emlStep = emlSteps.nextNode();
            //                if (emlStep.getAttribute("routetype") == "consult") {
            //                    HasConsult = true;
            //                }
            //                if (HasConsult) {
            //                    if (emlStep.getAttribute("routetype") == "approve") {
            //                        HasApprover = true;
            //                    }
            //                }
            //            }

            //            if (HasApprover == true) {
            //                //return true;
            //            } else {
            //                alert(strMsg_052); return false; //"결재선에서 합의는 최종결재자 전에 위치해야 합니다.\n현 합의를 결재자 아래로 내려주십시요."
            //            }

        }
    }

    if (getInfo("scPAgr") == 2 && (m_sApvMode == "REDRAFT" || m_sApvMode == "RECAPPROVAL")) {
        var elmConsult = elmRoot.selectSingleNode("division/step[@routetype='consult' and @unittype='person' and @allottype='parallel']");
        if (elmConsult == null) {
            //if(confirm("부서합의 없이 진행하시겠습니까?"))return true;
            //return false;
        } else {
            var emlSteps = elmRoot.selectNodes("division/step");
            var emlStep;
            var HasApprover = false;
            var HasConsult = false;
            for (var i = 0; i < emlSteps.length; i++) {
                emlStep = emlSteps.nextNode();
                if (emlStep.getAttribute("routetype") == "consult") {
                    HasConsult = true;
                }
                if (HasConsult) {
                    if (emlStep.getAttribute("routetype") == "approve") {
                        HasApprover = true;
                    }
                }
            }

            if (HasApprover == true) {
                //return true;
            } else {
                alert(strMsg_052); return false; //"결재선에서 합의는 최종결재자 전에 위치해야 합니다.\n현 합의를 결재자 아래로 내려주십시요."
            }

        }
    }

    if (getInfo("scDRec") == 1 && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL")) {
        //var elmOu = elmRoot.selectSingleNode("step[@routetype='receive' and @unittype='ou']");
        /*if (elmOu==null){alert("수신부서를 지정하십시요");return false;} 2003.06 황선희 주석처리*/
        var elmOu = elmRoot.selectNodes("division/step[@routetype='receive']/ou");

        //if (elmOu==null){
        if (elmOu.length == 0) {
            //if(confirm("수신처 없이 진행하시겠습니까?"))return true;
            //return false;
            //alert("수신처를 지정하십시요."); return false;
            //if(confirm("경유부서 없이 진행하시겠습니까?"))return true;			
        } else {
            //BC카드의 경우 수신처 n개 지정 가능
            //			//수신처를 1개만 지정하도록 수정 2004.11.10 김영종
            // 			var elmReceive = elmRoot.selectNodes("division/step[@unittype='ou' and @routetype='receive']");
            //			//한번에 두개 이상의 수신처를 지정 할 경우 Check
            // 			//if(elmReceive.length>1){alert("수신처는 1개만 지정 가능 합니다. \n수신처를 다시 지정해 주십시요.");return false;} 
            // 			if(elmReceive.length>1){alert(strMsg_053);return false;} 
            // 			var ouReceive = elmReceive[0].selectNodes("ou");
            //			//한번씩 하나씩 두번 이상의 수신처를 지정 할 경우 Check
            // 			//if(ouReceive.length>1){alert("수신처는 1개만 지정 가능 합니다. \n수신처를 다시 지정해 주십시요.");return false;} 
            // 			if(ouReceive.length>1){alert(strMsg_053);return false;} 
        }
        //return true;
    }

    if (getInfo("scChgr") == 1 && getInfo("scChgrV") == "select" && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL")) {
        //var elmOu = elmRoot.selectSingleNode("step[@routetype='receive' and @unittype='ou']");
        /*if (elmOu==null){alert("수신부서를 지정하십시요");return false;} 2003.06 황선희 주석처리*/
        var elmOu = elmRoot.selectNodes("division/step[@routetype='receive']/ou/role");

        //if (elmOu==null){
        if (elmOu.length == 0) {
            alert(strMsg_054); //"담당업무를 지정하십시요"
            return false;
        } else if (elmOu.length > 1) {
            alert(strMsg_055); //"담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요."
            return false;
        } else {
            //담당업무를 1개만 지정하도록 수정 2005.04.21 황선희
            var elmReceive = elmRoot.selectNodes("division/step[@unittype='person' and @routetype='receive']");
            //한번에 두개 이상의 담당업무를 지정 할 경우 Check
            //if(elmReceive.length>1){alert("담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요.");return false;} 
            if (elmReceive.length > 1) { alert(strMsg_055); return false; }
            var ouReceive = elmReceive[0].selectNodes("role");
            //한번씩 하나씩 두번 이상의 담당업무를 지정 할 경우 Check
            //if(ouReceive.length>1){alert("담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요.");return false;} 
            if (ouReceive.length > 1) { alert(strMsg_055); return false; }
        }
        var emlSteps = elmRoot.selectNodes("division/step");
        var emlStep;
        var HasApprover = false;
        var HasReceive = false;
        for (var i = 0; i < emlSteps.length; i++) {
            emlStep = emlSteps.nextNode();
            if (emlStep.getAttribute("routetype") == "receive" && emlStep.getAttribute("unittype") == "person") {
                HasReceive = true;
            }
            if (HasReceive) {
                if (emlStep.getAttribute("routetype") == "approve") {
                    HasApprover = true;
                }
            }
        }
        if (HasApprover == true) {
            alert(strMsg_056); return false; //"결재선에서 담당부서처리는 최종결재자 다음에 위치해야 합니다.\n현 업무담당를 결재자 위로 올려주십시요."
        } else {
            //return true;
        }
    }

    if (getInfo("scDCoo") == 1 && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL")) {
        var elmOu = elmRoot.selectSingleNode("division/step[@routeype='assist' and @unittype='ou']");
        /*if (elmOu==null){alert("협조처를 지정하십시요");return false;} 2003.04 황선희 주석처리*/
        if (elmOu == null) {
            //if(!confirm("협조처 없이 진행하시겠습니까?")) return false;
            //if(!confirm(strMsg_122)) return false;
        }
        //return true;
    }

    if (getInfo("scPCoo") == 1 && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL")) {
        var elmAssist = elmRoot.selectSingleNode("division/step[@routetype='assist' and @unittype='person']");
        if (elmAssist == null) {
            //if(!confirm("협조자 없이 진행하시겠습니까?")) return false;
            //if(!confirm(strMsg_123)) return false;
        }
        //return true;
    }
    if (getInfo("scDAgr") == 1 && m_sApvMode == "SUBREDRAFT") {
        //if (m_oCurrentOUNode.selectNodes("person[taskinfo/@kind!='charge' and taskinfo/@kind!='skip' ]").length < 1 )
        if (m_oCurrentOUNode.selectNodes("person[taskinfo/@kind!='skip' ]").length < 1) {
            //alert("결재선을 지정하십시요");return false;
            alert(strMsg_029); return false;
        }
    }
    //수신자 추가 2006.08 by sunny
    if (getInfo("scPRec") == 1 && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL")) {
        var elmOu = elmRoot.selectNodes("division/step[@routetype='receive']/ou/person");

        if (elmOu.length == 0) {
            if (getInfo("scPRecV") == "select") {
            } else {
                if (getInfo("scDRec") == 1 && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL")) {
                    elmOu = elmRoot.selectNodes("division/step[@routetype='receive']");
                    if (elmOu.length == 0) {
                        alert(strMsg_181); //"담당자를 지정하십시요"
                        return false;
                    }
                } else {
                    alert(strMsg_181); //"담당자를 지정하십시요"
                    return false;
                }
            }
            //		}else if (elmOu.length>1){
            //			//alert("담당자는 1개만 지정 가능 합니다. \n담당자를 다시 지정해 주십시요.");
            //			alert(strMsg_182);
            //			return false;
            //		}else{
            //			//담당업무를 1개만 지정하도록 수정 2005.04.21 황선희
            // 			var elmReceive = elmRoot.selectNodes("division/step[@unittype='person' and @routetype='receive']");
            //			//한번에 두개 이상의 담당업무를 지정 할 경우 Check
            // 			//if(elmReceive.length>1){alert("담당자는 1개만 지정 가능 합니다. \n담당자를 다시 지정해 주십시요.");return false;} 
            // 			if(elmReceive.length>1){alert(strMsg_183);return false;} 
            // 			var ouReceive = elmReceive[0].selectNodes("person");
            //			//한번씩 하나씩 두번 이상의 담당업무를 지정 할 경우 Check
            // 			//if(ouReceive.length>1){alert("담당자는 1개만 지정 가능 합니다. \n담당자를 다시 지정해 주십시요.");return false;} 
            // 			if(ouReceive.length>1){alert(strMsg_184);return false;} 
        }
        var emlSteps = elmRoot.selectNodes("division/step");
        var emlStep;
        var HasApprover = false;
        var HasReceive = false;
        for (var i = 0; i < emlSteps.length; i++) {
            emlStep = emlSteps.nextNode();
            if (emlStep.getAttribute("routetype") == "receive" && emlStep.getAttribute("unittype") == "person") {
                HasReceive = true;
            }
            if (HasReceive) {
                if (emlStep.getAttribute("routetype") == "approve") {
                    HasApprover = true;
                }
            }
        }
        if (HasApprover == true) {
            alert(strMsg_056); return false; //"결재선에서 담당부서처리는 최종결재자 다음에 위치해야 합니다.\n현 업무담당를 결재자 위로 올려주십시요."
        } else {
            //return true;
        }
    }
    //감사 조건 추가 - 최종결재자 이전에 위치해야 함
    if (getInfo("scGAdt") == 1 && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL" || m_sApvMode == "PCONSULT" || m_sApvMode == "AUDIT")) {
        var elmAudit = elmRoot.selectSingleNode("division/step[@routetype='audit' and @unittype='person']");
        if (elmAudit == null) {
            return chkConsultAppLine(elmRoot);
        }
    }
    //감사 관련 종료
    //감사사용 양식에서 상무 이상이 결재자에 있는 경우 감사자가 반드시 존재해야함
    if (getInfo("scDAdt") == 1 && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL")) {
        //        var elmApprovers = elmRoot.selectNodes("division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step[@routetype='approve' and @unittype='person']/ou/person[@position='10;사장' or @position='11;부사장' or @position='14;상무']");
        //        if (elmApprovers.length > 0) {
        //            var elmAuditOU = elmRoot.selectSingleNode("division/step[@routetype='audit' and @unittype='ou']");
        //            if (elmAuditOU == null) {
        //                alert(strMsg_185); //"최종 결재자가 담당상무 이상일 경우\r\n사전 또는 사후감사를 지정해야 합니다."
        //                return false;
        //            }
        //        }
        var emlSteps = elmRoot.selectNodes("division/step[@routetype!='review']");
        var emlStep;
        var sXPathAdt = "division/step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/(person|role)";
        if (!("ActiveXObject" in window)) { sXPathAdt = sXPathAdt.replace("(person|role)", "*[name()='person' or name()='role']") }
        var elmList = elmRoot.selectNodes(sXPathAdt);
        var elm, elmTaskInfo, ii;
        var HasApprover = false;
        var HasConsult = false;
        var HadReviewer = false;
        var PreConsult = false;
        var EndReviewer = false;
        var CurConsult = false;
        var bAuth = false;
        ii = 0;
        for (var i = 0; i < emlSteps.length; i++) {
            emlStep = emlSteps.nextNode();
            if (emlStep.getAttribute("routetype") == "audit") {
                HasConsult = true;
                if (bAuth) {
                    alert(strMsg_304); //"전결 다음에 일상감사가 올 수 없습니다.");
                    return false;
                }
            } //감사관련 수정
            if (i == emlSteps.length - 2 && emlStep.getAttribute("routetype") == "audit") PreConsult = true; // 2004.10.26 update
            if (i == emlSteps.length - 1 && emlStep.getAttribute("routetype") == "audit") CurConsult = true; // 2004.10.26 update
            if (emlStep.selectSingleNode("ou/person/taskinfo") != null && emlStep.selectSingleNode("ou/person/taskinfo").getAttribute("kind") == "authorize") bAuth = true;

        }
        // 2004.10.26 update 
        for (var j = 0; j < elmList.length; j++) {
            elm = elmList.nextNode();
            elmTaskInfo = elm.selectSingleNode("taskinfo");
            if (j == elmList.length - 1 && (elmTaskInfo.getAttribute("kind") == "review" || elmTaskInfo.getAttribute("kind") == "confirm")) EndReviewer = true; // 2004.10.26 update
        }
        //

        if (HasConsult) {
            if (emlStep.getAttribute("routetype") == "approve" && elmTaskInfo.getAttribute("kind") != "review" && elmTaskInfo.getAttribute("kind") != "skip") HasApprover = true; // 2004.10.26 update
        }
        //        if (HasConsult) {
        //            if (HasApprover == true) {
        //            } else {
        //                if (PreConsult && EndReviewer) {
        //                    alert(strMsg_305); return false;//"최종결재자가 후결인 경우에 전 결재는 일상감사일 수 없습니다."); 
        //                } else {
        //                    if (CurConsult) {
        //                        alert(strMsg_306); return false;//"일상 감사는 최종 결재자 이전에 위치해야 합니다."
        //                    }
        //                }
        //            }
        //        } else {
        //        }

    }

    //후결자 확인
    /*
    var emlSteps = elmRoot.selectNodes("division/step");
    if (m_sApvMode=="DRAFT" || m_sApvMode=="TEMPSAVE"){
    emlSteps = elmRoot.selectNodes("division[@divisiontype='send']/step");
    }else{
    emlSteps = elmRoot.selectNodes("division[taskinfo/@status='pending']/step");
    }
    var emlStep;
    var HasReviewApprover = false;
    var HasReviewer= false;
    for(var i=0; i< emlSteps.length;i++){
    emlStep=emlSteps.nextNode();
    var elmTaskinfo = emlStep.selectSingleNode("ou/person/taskinfo");
    if (emlStep.getAttribute("routetype") == "approve" && emlStep.getAttribute("unittype") == "person" && elmTaskinfo.getAttribute("kind") == "review" ){
    HasReviewer = true;
    }
    if ( HasReviewer ){
    if (emlStep.getAttribute("routetype") == "approve" && elmTaskinfo.getAttribute("kind") != "review"){
    HasReviewApprover = true;
    }
    }
    }
    if ( HasReviewApprover == true ) {
    //alert("결재선에서 담당부서처리는 최종결재자 다음에 위치해야 합니다.\n현 업무담당를 결재자 위로 올려주십시요.");return false;
    alert("후결은 최종승인자만 가능합니다.");return false;
    }else{
    //return true;
    }
    */
    //2010-09-03 최근엽 추가 (재기안시 결재선 체크)     
    if (m_sApvMode == "REDRAFT") {
        var rtask = elmRoot.selectSingleNode("division[taskinfo[@kind='receive' and @status='pending']]/step/ou/person/taskinfo[@kind != 'charge']");
        if (rtask == null) {
            if (getInfo("scChrDraft") == "1") {
            } else {
                alert(strMsg_049); //"결재자를 지정하십시요"
                return false;
            }
        }
    }
    return true;
}
//감사 처리
function setAudit() { }
function switchAudit() { }
function getChargeNode() {
    /* 정상적으로 처리가 되어야 하나 호출 및 데이터도 보이나 넘겨주지가 않음. 강제코딩2007.12 by sunny
    var sText = "../Forms/getChargeApvSteps.aspx";
    requestHTTP("GET",sText,false,"text/xml",null,null);
    return receiveHTTP();
    */
    var oPerson = m_oApvList.createElement("person");
    var oTaskinfo = m_oApvList.createElement("taskinfo");
    oPerson.appendChild(oTaskinfo);
    oPerson.setAttribute("code", getInfo("usid"));
    oPerson.setAttribute("name", getInfo("usdn"));
    oPerson.setAttribute("position", getInfo("uspc") + ";" + getInfo("uspn"));
    oPerson.setAttribute("title", getInfo("ustc") + ";" + getInfo("ustn"));
    oPerson.setAttribute("level", getInfo("uslc") + ";" + getInfo("usln"));
    oPerson.setAttribute("oucode", getInfo("dpid"));
    oPerson.setAttribute("ouname", (gOUNameType == "1" ? (getInfo("etnm") + "-") : "") + getInfo("dpdn"));
    oPerson.setAttribute("sipaddress", getInfo("ussip"));
    oTaskinfo.setAttribute("status", "inactive");
    oTaskinfo.setAttribute("result", "inactive");
    oTaskinfo.setAttribute("kind", "charge");

    return oPerson;
}
var g_szAcceptLang = "ko";
function requestHTTP(sMethod, sUrl, bAsync, sCType, pCallback, vBody) {
    m_xmlHTTP.open(sMethod, sUrl, bAsync);
    m_xmlHTTP.setRequestHeader("Accept-Language", g_szAcceptLang);
    m_xmlHTTP.setRequestHeader("Content-type", sCType);
    if (pCallback != null) m_xmlHTTP.onreadystatechange = pCallback;
    (vBody != null) ? m_xmlHTTP.send(vBody) : m_xmlHTTP.send();
}
function requestHTTPXSL(sMethod, sUrl, bAsync, sCType, pCallback, vBody) {
    m_xmlHTTPXSL.open(sMethod, sUrl, bAsync);
    m_xmlHTTPXSL.setRequestHeader("Accept-Language", g_szAcceptLang);
    m_xmlHTTPXSL.setRequestHeader("Content-type", sCType);
    if (pCallback != null) m_xmlHTTPXSL.onreadystatechange = pCallback;
    (vBody != null) ? m_xmlHTTPXSL.send(vBody) : m_xmlHTTPXSL.send();
}
function receiveHTTP() {
    if (m_xmlHTTP.readyState == 4) {
        m_xmlHTTP.onreadystatechange = event_noop;
        if (m_xmlHTTP.responseText.charAt(0) == '\r') {
            //alert(m_xmlHTTP.responseText);
        } else {
            var errorNode = m_xmlHTTP.responseXML.selectSingleNode("person/error");
            if (errorNode != null) {
                alert("Desc: " + errorNode.text);
            } else {
                alert(m_xmlHTTP.responseText);
                return m_xmlHTTP.responseXML.selectSingleNode("person");
            }
        }
    }
}

function setVisibility(e) {
    var bSetDirty = false;
    var oSelTR;
    //    if(window.addEventListener){
    //    	oSelTR = document.getElementById("Apvlist").contentWindow.getPatentRow(e);
    //    }else{
    //    	oSelTR = Apvlist.getPatentRow();
    //    }	
    oSelTR = getPatentRowApvlist(e)
    var xpathCur = oSelTR.id;
    if (!("ActiveXObject" in window)) { xpathCur = ConvertXpath(xpathCur); }

    var elmRoot = m_oApvList.documentElement;
    var elmCur = elmRoot.selectSingleNode(xpathCur);
    var elmTaskInfo = elmCur.selectSingleNode("taskinfo");

    var sCurType = Apvlist.event.srcElement.value;
    switch (sCurType) {
        case "y": //보이기			
            elmTaskInfo.setAttribute("visible", "y");
            bSetDirty = true;
            break;
        case "n": //감추기
            elmTaskInfo.setAttribute("visible", "n");
            bSetDirty = true;
            break;
    }
    if (bSetDirty) try { m_oFormMenu.setApvDirty(); } catch (e) { }
    refreshList(xpathCur);
}
function changeVtitle(e) {
    var bSetDirty = false;
    var oSelTR;
    //    if(window.addEventListener){
    //    	oSelTR = document.getElementById("Apvlist").contentWindow.getPatentRow(e);
    //    }else{
    //    	oSelTR = Apvlist.getPatentRow(e);
    //    }
    oSelTR = getPatentRowApvlist(e)
    var xpathCur = oSelTR.id;
    if (!("ActiveXObject" in window)) { xpathCur = ConvertXpath(xpathCur); }

    var elmRoot = m_oApvList.documentElement;
    var elmCur = elmRoot.selectSingleNode(xpathCur);
    var elmTitle = elmCur.getAttribute("title");
    var aTitle = elmTitle.split(";");
    var sCurType = Apvlist.event.srcElement.value;
    var elmNewTitle = aTitle[0] + ";" + sCurType;

    elmCur.setAttribute("title", elmNewTitle);
    bSetDirty = true;
    if (m_oFormMenu.document.getElementById("APVLIST") == "undefined") m_oFormMenu.setApvDirty();
    refreshList(xpathCur);
}
function splitName(sValue) {
    return sValue.substr(sValue.lastIndexOf(";") + 1);
}
function getChargeOUNode() {
    var oStep = m_oApvList.createElement("step");
    var oOU = m_oApvList.createElement("ou");
    var oTaskinfo = m_oApvList.createElement("taskinfo");
    m_oApvList.documentElement.appendChild(oStep).appendChild(oOU).appendChild(oTaskinfo);
    oStep.setAttribute("unittype", "ou");
    oStep.setAttribute("routetype", "receive");
    oStep.setAttribute("name", strlable_ChargeDept_Rec); //"담당부서수신"
    oOU.setAttribute("code", getInfo("dpid_apv"));
    oOU.setAttribute("name", getInfo("dpdn_apv"));
    oTaskinfo.setAttribute("status", "pending");
    oTaskinfo.setAttribute("result", "pending");
    oTaskinfo.setAttribute("kind", "normal");
    oTaskinfo.setAttribute("datereceived", getInfo("svdt"));
    return m_oApvList.documentElement.selectSingleNode("division/step[@unittype='ou']/ou[@code='" + getInfo("dpid_apv") + "' and taskinfo/@status='pending']"); //
}
function getPersonDeploy() {
    if (self.iPersonDeployList.m_id != "") {

        var oSteps = self.iPersonDeployList.queryGetData();
        var oCheckSteps = chkAbsent(oSteps);
    }
    return oSteps;
}
function chkAbsent(oSteps) {
    var oUsers = oSteps.selectNodes("division/step/ou/person");
    var elmUsers;
    var sUsers = "";
    for (var i = 0; i < oUsers.length; i++) {
        elmUsers = oUsers.nextNode();
        if (sUsers.length > 0) {
            var szcmpUsers = ";" + sUsers + ";";
            if (szcmpUsers.indexOf(";" + elmUsers.getAttribute("code") + ";") == -1) {
                sUsers += ";" + elmUsers.getAttribute("code");
            }
        } else {
            sUsers += elmUsers.getAttribute("code");
        }
    }
    var pXML = " EXEC dbo.usp_CheckAbsentMember '" + sUsers + "' ";
    var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>";
    var szURL = "../address/getXMLQuery.aspx?Type=searchMember";
    requestHTTP("POST", szURL, false, "text/xml", null, sXML);
    return chkAbsentUsers(oSteps);
}
var bchkAbsent = false;
function chkAbsentUsers(oSteps) {
    if (m_xmlHTTP.readyState == 4) {
        m_xmlHTTP.onreadystatechange = event_noop;
        if (m_xmlHTTP.responseText.charAt(0) == "\r") {
            //alert(m_xmlHTTP.responseText);			
        } else {
            var errorNode = m_xmlHTTP.responseXML.selectSingleNode("response/error");
            if (errorNode != null) {
                return true;
            } else {
                var m_objXML = CreateXmlDocument();
                if (("ActiveXObject" in window)) {
                    var m_oMemberXSLProcessor = makeProcessor("../Address/org_chkabsent.xsl");
                    m_oMemberXSLProcessor.input = m_xmlHTTP.responseXML;
                    m_oMemberXSLProcessor.transform();
                    m_objXML.loadXML(m_oMemberXSLProcessor.output);
                } else {
                    var m_xmlDOM = CreateXmlDocument();
                    m_xmlDOM.async = false;
                    m_xmlDOM.load("../Address/org_chkabsent.xsl"); //Apvline.xsl 
                    m_objXML.loadXML(m_xmlHTTP.responseXML.transformNode(m_xmlDOM));
                }

                //Active 한 사용자들 모두 조회, 부서, 직위, 직급, 직책 비고
                var oUsers = m_objXML.selectNodes("response/addresslist/item");
                var oUser;
                var sAbsentResult = "";
                var sResult = "";
                var oStepUsers = oSteps.selectNodes("division/step/ou/person");

                for (var i = 0; i < oStepUsers.length; i++) {
                    oUser = oStepUsers.nextNode();

                    var oChkAbsent = m_objXML.selectNodes("response/addresslist/item[AN='" + oUser.getAttribute("code") + "']");
                    if (oChkAbsent != null) {
                        //2011.02농수산요청으로 사용자 최신정보 반영으로 변경 - 겸직은 처리 필요
                        //var oChkAbsentNode = m_objXML.selectSingleNode("response/addresslist/item[AN='"+oUser.getAttribute("code") + "'  and RG='" + oUser.getAttribute("oucode") + "' and RGNM = '" + oUser.getAttribute("ouname") + "']"); //and @tl='"+ oUser.getAttribute("title") +"'
                        var oChkAbsentNode = m_objXML.selectSingleNode("response/addresslist/item[AN='" + oUser.getAttribute("code") + "']"); //and @tl='"+ oUser.getAttribute("title") +"'
                        //20180731 개인결재선 추가시 변경 
						//if (oChkAbsentNode != null) {
					    if (oChkAbsentNode != null && PrivateYN == null) {
                            oUser.setAttribute("oucode", oChkAbsentNode.selectSingleNode("RG").text);
                            oUser.setAttribute("ouname", oChkAbsentNode.selectSingleNode("RGNM").text);
                            oUser.setAttribute("position", oChkAbsentNode.getAttribute("po"));
                            oUser.setAttribute("title", oChkAbsentNode.getAttribute("tl"));
                            oUser.setAttribute("level", oChkAbsentNode.getAttribute("lv"));
                        } else {
                            //2011.02농수산요청으로 사용자 최신정보 반영으로 변경
                            //sResult += "	" + oUser.getAttribute("ouname") +" : " + oUser.getAttribute("name")+"\n";
                        }
                    } else {//퇴직자
                        sAbsentResult += "	" + oUser.getAttribute("ouname") + " : " + oUser.getAttribute("name") + "\n";
                    }
                }

                oStepUsers = oSteps.selectNodes("root/user");
                bchkAbsent = true;
                for (var i = 0; i < oStepUsers.length; i++) {
                    oUser = oStepUsers.nextNode();
                    mType = "1";
                    setDistDept(oUser);
                }
                var oStepGroups = oSteps.selectNodes("root/group");

                for (var i = 0; i < oStepGroups.length; i++) {
                    oGroup = oStepGroups.nextNode();
                    mType = "0";
                    setDistDept(oGroup);
                }

                if (sAbsentResult != "") {
                    alert(strMsg_057 + sAbsentResult); //"선택한 개인 결재선에 퇴직자가 포함되어 적용이 되지 않습니다.\n\n---퇴직자--- \n\n"
                    return false;
                } else {
                    if (sResult != "") {
                        //alert("선택한 개인 결재선의 부서/인사정보가 최신정보와 일치하지 않아 적용이 되지 않습니다.\n\n---변경자--- \n\n"+sResult);
                        alert(strMsg_173 + " \n\n" + sResult)
                        return false;
                    } else {
                        return true;
                    }

                }
            }
        }
    }
}
function chkConsultAppLine(elmRoot) {
    var emlSteps = elmRoot.selectNodes("division/step");
    var emlStep;
    var xpathCur = "division/step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/(person|role)";
    if (!("ActiveXObject" in window)) { xpathCur = ConvertXpath(xpathCur); }
    var elmList = elmRoot.selectNodes(xpathCur);
    var elm, elmTaskInfo;
    var HasApprover = false;
    var HasConsult = false;
    var HadReviewer = false;
    var PreConsult = false;
    var EndReviewer = false;
    var CurConsult = false;

    for (var i = 0; i < emlSteps.length; i++) {
        emlStep = emlSteps.nextNode();
        if (emlStep.getAttribute("routetype") == "consult" || emlStep.getAttribute("routetype") == "assist" || emlStep.getAttribute("routetype") == "audit") HasConsult = true; //감사관련 수정
        if (i == emlSteps.length - 2 && emlStep.getAttribute("routetype") == "consult") PreConsult = true; // 2004.10.26 update
        if (i == emlSteps.length - 1 && emlStep.getAttribute("routetype") == "consult") CurConsult = true; // 2004.10.26 update
    }
    // 2004.10.26 update 
    for (var j = 0; j < elmList.length; j++) {
        elm = elmList.nextNode();
        elmTaskInfo = elm.selectSingleNode("taskinfo");
        if (j == elmList.length - 1 && elmTaskInfo.getAttribute("kind") == "review") EndReviewer = true; // 2004.10.26 update
    }
    //

    if (HasConsult) {
        if (emlStep.getAttribute("routetype") == "approve" && elmTaskInfo.getAttribute("kind") != "review") HasApprover = true; // 2004.10.26 update
    }
    if (HasConsult) {
        if (HasApprover == true) {
            return true;
        } else {
            // 2004.10.26 update 
            if (PreConsult && EndReviewer) {
                //alert("최종결재자가 후결인 경우에 전 결재자는 합의일 수 없습니다.");return false;
                alert(strMsg_058); return false;
            } else {
                // 2006.02.24 : 박상호 -> 합의자 최종결재자 전에 위치해야 하는 로직 삭제 (합의자에서 끝날수 있음)
                if (CurConsult) {
                    alert(strMsg_052); return false;
                } else { return true; }
                //return true;
            }
            //
        }
    } else {
        return true;
    }
}

function chkDuplicateApprover(oSrcDoc) {
    var oSrcDocList = oSrcDoc.selectNodes("//item");
    var bDelete = false;
    for (var i = 0; i < oSrcDocList.length; i++) {
        var item = oSrcDocList.nextNode();
        var xPathDelete = '';
        switch (m_sSelectedRouteType) {
            case "ccinfo":
                switch (m_sSelectedUnitType) {
                    case "person": xPathDelete = "ccinfo/ou/(person|role)"; break;
                    case "ou": xPathDelete = "ccinfo/ou"; break;
                    case "group": xPathDelete = "ccinfo/group"; break;
                }
                break;
            default:
                switch (m_sSelectedUnitType) {
                    case "person": xPathDelete = "division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step/ou/(person|role)"; break;
                    case "ou": xPathDelete = "division/step/ou"; break;
                    case "group": xPathDelete = "division/step/group"; break;
                }
                break;
        }
        if (item.selectSingleNode("ROLE") != null) {
            if (item.selectSingleNode("ROLE").text == "manager") {
                xPathDelete += "[@code='UNIT_MANAGER' and @ouname='" + item.selectSingleNode("DN").text + "']";
            } else {
                xPathDelete += "[@code='" + item.selectSingleNode("AN").text + "' and @name='" + item.selectSingleNode("DN").text + "' and taskinfo/@kind !='charge']";
            }
        } else {
            xPathDelete += "[@code='" + item.selectSingleNode("AN").text + "' and @name='" + item.selectSingleNode("DN").text + "' and taskinfo/@kind !='charge']";
        }
        if (!("ActiveXObject" in window)) {
            xPathDelete = xPathDelete.replace("(person|role)", "*[name()='person' or name()='role']");
        }
        if (m_oApvList.documentElement.selectSingleNode(xPathDelete) != null) {
            oSrcDoc.documentElement.removeChild(item);
            bDelete = true;
        }
    }

    if (bDelete) { alert(strMsg_186); } //alert("결재자가 이미 지정되어 있습니다.");}
    return oSrcDoc;
}
function chkManagerConsult(oSrcDoc) {
    var bDeleted = false;
    if (m_sSelectedRouteType == "consult") {
        var oSrcDocList = oSrcDoc.selectNodes("//item");
        for (var i = 0; i < oSrcDocList.length; i++) {
            var item = oSrcDocList.nextNode();
            var xPathDelete = '';
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
    //if (bDeleted) alert("합의자는 부서장만 선택할 수 있습니다.\n개인을 직접 지정할 수 없습니다.");
    if (bDeleted) alert(strMsg_124);
    return oSrcDoc;
}
function chkManagerApprove(oSrcDoc) {
    var bDeleted = false;
    if (m_sSelectedRouteType == "approve" || m_sSelectedRouteType == "receive") {
        var oSrcDocList = oSrcDoc.selectNodes("//item");
        for (var i = 0; i < oSrcDocList.length; i++) {
            var item = oSrcDocList.nextNode();
            var xPathDelete = '';
            if (item.selectSingleNode("ROLE") != null) {
                if (item.selectSingleNode("ROLE").text == "manager") {
                    oSrcDoc.documentElement.removeChild(item);
                    bDeleted = true;
                }
            }
        }
    }
    //if (bDeleted) alert("결재자는 부서장을 선택할 수 없습니다.\n개인을 직접 지정하십시요.");
    if (bDeleted) alert(strMsg_125);
    return oSrcDoc;
}
//배포처 추가 
var m_oRecList = CreateXmlDocument();
var mType = 0;
var sCheckBoxFormat = "";
function setDistDept(oList) {
    //2011.07 공문게시옵션 추가 - 1차부서및 1차조직의 장만 선택 가능 배포그룹제외
    if (getInfo("scGRBox") == "1" && mType != "2") {
        var elmList, emlNode;
        elmList = oList.selectNodes("item");
        for (var i = 0; i < elmList.length; i++) {
            emlNode = elmList.nextNode();
            if (emlNode == null) emlNode = elmList[i];
            if (emlNode.selectSingleNode("SGAN") != null && emlNode.selectSingleNode("SGAN").text.indexOf("99999") > -1) { //최상위부서코드
            } else if (emlNode.selectSingleNode("TL") != null && emlNode.selectSingleNode("TL").text.indexOf("본부장") > -1) { //최상위부서코드
            } else {
                alert("본부 혹은 본부장만 선택 가능합니다.");
                return;
            }
        }
    }

    if (opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value == '') opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value = '@@';
    if (opener.m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value == '') opener.m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value = '@@';
    if (opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value == 'ALL:전부서@@') opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value = '@@';
    if (opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value == 'ALL:전부점@@') opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value = '@@';
    if (opener.m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value == 'ALL@@') opener.m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value = '@@';

    var aRecDept = opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value.split("@");
    var aRecDeptList = opener.m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value.split("@");
    var sRecDept = '';
    var sRecDeptList = '';
    var elmList, emlNode;

    elmList = oList.selectNodes("item");
    for (var i = 0; i < elmList.length; i++) {
        emlNode = elmList.nextNode();
        if (chkDuplicate(emlNode.selectSingleNode("AN").text)) {

            //2016.06.21 PSW 시작
		    if (getInfo("fmpf") == "WF_FORM_ISU_ALL_COM010") {  //대내공문일 경우,수신부서 목록에 회사명 같이 표기
		        sRecDept += ";" + emlNode.selectSingleNode("AN").text + ":" + emlNode.selectSingleNode("ETNM").text + " " + emlNode.selectSingleNode("DN").text.replace(/;/gi, "^"); //다국어처리
		        sRecDeptList += ";" + emlNode.selectSingleNode("AN").text;
		    } else {
		        sRecDept += ";" + emlNode.selectSingleNode("AN").text + ":" + emlNode.selectSingleNode("DN").text.replace(/;/gi, "^"); //다국어처리
		        sRecDeptList += ";" + emlNode.selectSingleNode("AN").text;
		    }
		    //2016.06.21 PSW 끝
			
			
			
			// 배포그룹도 하위부서 추가하기위해 2도 체크박스 생성 2020-03-19 Covision HSB
			// if (mType == 0 && !bchkAbsent) {
            if ((mType == 0 || mType == 2) && !bchkAbsent) {

                sRecDept += ":N"; //Y에서 N으로 변경, 하위부서포함 default에서 미포함으로 변경
                sRecDeptList += "|N"; //Y에서 N으로 변경, 하위부서포함 default에서 미포함으로 변경
                if (emlNode.selectSingleNode("CHILD_CNT") != null) {
                    if (mType == 0 && emlNode.selectSingleNode("CHILD_CNT").text == "N") {
                        sCheckBoxFormat += ";" + emlNode.selectSingleNode("AN").text + ":";
                    }
                }
            }
        }
    }
    if (aRecDept[mType].length < 1) sRecDept = sRecDept.substring(1);
    if (aRecDeptList[mType].length < 1) sRecDeptList = sRecDeptList.substring(1);
    aRecDept[mType] += sRecDept;
    aRecDeptList[mType] += sRecDeptList;

    sRecDept = "";
    for (var i = 0; i < aRecDept.length; i++) { sRecDept += '@' + aRecDept[i]; }

    if (sRecDept.length > 1) sRecDept = sRecDept.substring(1);

    sRecDeptList = "";
    for (var i = 0; i < aRecDeptList.length; i++) { sRecDeptList += '@' + aRecDeptList[i]; }

    if (sRecDeptList.length > 1) sRecDeptList = sRecDeptList.substring(1);

    opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value = sRecDept;
    opener.m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value = sRecDeptList; //RecList();

    chkAction(mType);
}
function chkDuplicate(code) {
    var aRecDept = opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value.split("@");
    var cmpString = aRecDept[mType];
    //var cmpIndex = cmpString.indexOf(code);
    //if (cmpIndex < 0) { return true; } else { return false; }

    //==부서코드의 정확한 비교위해 위구문 주석처리후 아래구문 추가 (2013-03-20 HIW) ===
    var vIsResult = true;
    if (cmpString.split(":")[0] == code)  //cmpString.split(":")[0] --> 부서코드를 정확히 비교하기위해 부서코드만 가져오기 
        vIsResult = false;
    if (vIsResult) { return true; } else { return false; }
    //==============================================================================
}
function RecList() {
    var aRecDept = opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value.split("@");
    var sRecList = "";
    for (var i = 0; i < aRecDept.length; i++) {
        var aRec = aRecDept[i].split(";");
        sRecList += "@";
        sRecDept = "";
        for (var j = 0; j < aRec.length; j++) {
            sRecDept += ";" + aRec[j].split(":")[0];
            if (i == 0 && !bchkAbsent) {
                sRecDept += "|N";
            }
        }
        if (sRecDept.length > 0) sRecDept = sRecDept.substring(1);
        sRecList += sRecDept;
    }
    if (sRecList.length > 0) sRecList = sRecList.substring(1);
    return sRecList;
}
//협조처 목록 조회
function initRecList() {
    var szReturn = '';
    var aRecDept = opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value.split("@");
    var sRecDept = aRecDept[0];
    if (sRecDept != null && sRecDept != '') {
        var aRec = sRecDept.split(";");
        for (var i = 0; i < aRec.length; i++) { szReturn += (szReturn != '' ? ", " : "") + aRec[i].split(":")[1]; }
    }

    return szReturn;
}
function chkAction(actType) {
    if (opener != null && m_sApvMode.toUpperCase() != "DEPTLIST") {
        mType = actType;
        if (opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value == '') opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value = '@@';
        if (opener.m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value == '') opener.m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value = '@@';
        var aRecDept = opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value.split("@");
        //var sRecDept = aRecDept[mType];
        var sRecDept = aRecDept[0] + ";" + aRecDept[1] + ";" + aRecDept[2];
        make_selRec(sRecDept);
        if (mType == "2" && selTab != "tDeployList") {
            changeTab("tDeployList");
        }
    }
}
function make_selRec(sRecList) {
    var otbl = document.getElementById("tblrecinfo");
    var tbllength = otbl.rows.length;
    //Table 지우기
    for (var i = 0; i < tbllength - 2; i++) {
        otbl.deleteRow(tbllength - i - 1);
    }
    var eTR, eTD;
    var aRecDept = opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value.split("@");
    for (var ii = 0; ii < aRecDept.length; ii++) {
        var sRecDept = aRecDept[ii];

        //        if(ii==0){
        //            eTR = otbl.insertRow();
        //            eTR.className = "BTable_bg02";
        //            eTR.height = "25px";
        //            eTD = eTR.insertCell();
        //            
        //            eTD.innerHTML = "수신처/수신자/수신처그룹";
        //	        eTD.width="70%";
        //            eTD = eTR.insertCell();
        //            
        //            eTD.innerHTML = "하위부서 포함";
        //        }
        ///////////////////////////타이틀 추가 -->
        if (sRecDept != "") {
            var aRec = sRecDept.split(";");
            for (var i = 0; i < aRec.length; i++) {
                eTR = otbl.insertRow(otbl.rows.length);
                eTR.setAttribute("id", aRec[i].split(":")[0]);
                if (!("ActiveXObject" in window)) {
                    eTR.addEventListener('mousedown', selectDistRow, true);
                } else {
                    eTR.attachEvent("onmousedown", selectDistRow);
                }
                var strName = aRec[i].split(":")[1];
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = getLngLabel(strName, false, "^"); eTD.height = 20 + "px";
                
				// 배포그룹도 하위부서 체크박스 생성 2020-03-19 Covision HSB
				//if(mType==0)
                //if (ii == 0) {
				if (ii == 0 || ii == 2) {	
                    eTD = eTR.insertCell(eTR.cells.length);
                    if (aRec[i].split(":")[0] == "ALL") { //전부서 처리
                        eTD.innerHTML = "<INPUT id='' Type='Checkbox' disabled style=\"padding-right=15px\" >";

                    } else {
                        if (aRec[i].split(":")[2] == "Y") {
                            eTD.innerHTML = "<INPUT id='' Type='Checkbox' "
		                                  + "onclick=\"changeCheckBox('" + aRec[i].split(":")[2] + "','" + aRec[i].split(":")[0] + "','" + aRec[i].split(":")[1] + "')\" style=\"padding-right=15px\" CHECKED>";
                        } else {
                            if (sCheckBoxFormat.indexOf(";" + aRec[i].split(":")[0] + ":") > -1) {
                                eTD.innerHTML = "<INPUT id='' Type='Checkbox' disabled "
		                                  + "onclick=\"changeCheckBox('" + aRec[i].split(":")[2] + "','" + aRec[i].split(":")[0] + "','" + aRec[i].split(":")[1] + "')\" style=\"padding-right=15px\" >";
                            } else {
                                eTD.innerHTML = "<INPUT id='' Type='Checkbox' "
		                                  + "onclick=\"changeCheckBox('" + aRec[i].split(":")[2] + "','" + aRec[i].split(":")[0] + "','" + aRec[i].split(":")[1] + "')\" style=\"padding-right=15px\" >";
                            }
                        }
                    }
                } else {
                    eTD = eTR.insertCell(eTR.cells.length);
                    eTD.innerHTML = "&nbsp;";
                }
            }
        }
    }
    return;
}
function changeCheckBox(type, code, name) {

    var sRecDept = opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value;
    var sRecDeptList = opener.m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value;

    //if(type=="N")
    if (sRecDept.indexOf(code + ":" + name + ":N") > -1) {
        sRecDept = sRecDept.replace(code + ":" + name + ":N", code + ":" + name + ":Y");
        sRecDeptList = sRecDeptList.replace(code + "|N", code + "|Y");
    } else {
        sRecDept = sRecDept.replace(code + ":" + name + ":Y", code + ":" + name + ":N");
        sRecDeptList = sRecDeptList.replace(code + "|Y", code + "|N");
    }
    opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value = sRecDept;
    opener.m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value = sRecDeptList;
}
function delList() {
    var oSelTR;
    oSelTR = getSelectedDistRow();
    if (oSelTR != null) {
        if (oSelTR.id != null) {
            var aRecDept = opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value.split("@");
            var aRecCode = opener.m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value.split("@");
            for (var ii = 0; ii < aRecDept.length; ii++) {
                var aSelectRecDept = aRecDept[ii].split(";");
                var aSelectRecCode = aRecCode[ii].split(";");
                var sRecDept = '';
                var sRecCode = '';
                for (var i = 0; i < aSelectRecCode.length; i++) {
                    if (oSelTR.id != aSelectRecCode[i].split("|")[0]) {
                        sRecDept += ";" + aSelectRecDept[i];
                        sRecCode += ";" + aSelectRecCode[i];
                    } else {//고정배포처
                        if (getInfo("scIPub") == "1" && getInfo("scIPubV") != "") {
                            var strIPubV = ";" + getInfo("scIPubV");
                            if (strIPubV.indexOf(";" + oSelTR.id + ":") > -1) {
                                sRecDept += ";" + aSelectRecDept[i];
                                sRecCode += ";" + aSelectRecCode[i];
                            }
                        }
                    }
                }
                if (sRecDept.length > 0) sRecDept = sRecDept.substring(1);
                if (sRecCode.length > 0) sRecCode = sRecCode.substring(1);
                aRecDept[ii] = sRecDept;
                aRecCode[ii] = sRecCode;
                sRecDept = '';
                sRecCode = '';
            }
            for (var j = 0; j < aRecDept.length; j++) {
                sRecDept += "@" + aRecDept[j];
                sRecCode += "@" + aRecCode[j];
            }
            if (sRecDept.length > 0) sRecDept = sRecDept.substring(1);
            if (sRecCode.length > 0) sRecCode = sRecCode.substring(1);
            opener.m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value = sRecDept;
            opener.m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value = sRecCode;
        } else {
            if (oSelTR.type == "0") {
                alert(strMsg_187); //"배포리스트 구분을 조직도를 선택하세요.");
            } else {
                alert(strMsg_188); //"배포리스트 구분을 배포리스트를 선택하세요.");
            }
        }
        chkAction(mType);
    }
}
var sUserName, sDeptName;
var retireCheck = false;
//퇴직자 체크후 결재자에게 반려 알림

//function retiredCheck(strMode) {
//    
//    var checkApv, rePersonCode;
//    checkApv = oApvList.selectNodes("steps/division/step");
//    for (k = 0; k < checkApv.length; k++) {
//      if (checkApv[k].childNodes[0].childNodes[0].childNodes[0].attributes[1].value == "inactive") {
//          rePersonCode = checkApv[k].childNodes[0].childNodes[0].attributes[0].value;
//          if (rePersonCode == "ISU_ST07009") {
//                alert("결재선에 퇴직자 (사번 변경 포함) 가 있습니다. 반송처리 후 재기안 하시기 바랍니다.");
//                //20130911 hyh 추가 끝
//                setInlineApvList(oApvList); //양식 수정 예정 JANG
//                try { if (parent.rel_activityid != "") { getTaskID(parent.rel_activityname + ";" + parent.rel_activityid); } } catch (e) { }
//                break;
//            } else {
//                alert("퇴직자 없음");
//                setInlineApvList(oApvList);
//                try { if (parent.rel_activityid != "") { getTaskID(parent.rel_activityname + ";" + parent.rel_activityid); } } catch (e) { }
//            }
//           
//        }
//    }
//}

//jkh 결재리스트에 퇴직자 체크 로직시작 2015.04.15//
function chkRetire() {
   // var xmlApv = new ActiveXObject("MSXML2.DOMDocument");
   // xmlApv.loadXML("<?xml version='1.0' encoding='utf-8'?>" + parent.menu.field["APVLIST"].value);
    try {
        var nodesAllItems;
             nodesAllItems = m_oApvList.selectNodes("steps/division/step/ou/person"); 
        
        if (nodesAllItems.length > 0) {
            var oSteps = m_oApvList.selectSingleNode("steps");
            chkAbsent1(oSteps);
        }
    }
    catch (e) { alert(e.message); }
}

function chkAbsent1(oSteps) {
   
        var oUsers;
        oUsers = oSteps.selectNodes("division/step/ou/person"); //기결재자는 체크 안함

    var elmUsers;
    var sUsers = "";
    var pXML, sXML;
    var szURL = "../getXMLQuery.aspx";
    if (oUsers.length > 0) {
        for (var i = 0; i < oUsers.length; i++) {
            elmUsers = oUsers[i];
            
            //20170207 주석 시작           
            /* 
            sUsers = elmUsers.getAttribute("code");
            sUserName = elmUsers.getAttribute("name");
            sDeptName = elmUsers.getAttribute("ouname");
            */
            //20170207 주석 시작 끝

            //20170207 추가시작
            sUsers = $(elmUsers).attr('code');
            sUserName = $(elmUsers).attr('name');
            sDeptName = $(elmUsers).attr('ouname');
            //20170207 추가 끝
            
            pXML = " EXEC dbo.usp_CheckAbsentMember '" + sUsers + "' ";
            sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>";
            requestHTTP("POST", szURL, false, "text/xml", receiveHTTPchkAbsentUsers1, sXML);
            if (retireCheck) break;
        }
    }
}

var retireCheckYN;
function receiveHTTPchkAbsentUsers1() {
    var chkUserTF = true;
    if (m_xmlHTTP.readyState == 4) {
        m_xmlHTTP.onreadystatechange = event_noop;
        if (m_xmlHTTP.responseText.charAt(0) == "\r") {
        } else {
            var errorNode = m_xmlHTTP.responseXML.selectSingleNode("response/error");
            if (errorNode != null) {
                return false;
            } else {
                var xmlReturn = m_xmlHTTP.responseXML;
                var elmlist = xmlReturn.selectNodes("response/NewDataSet/Table");
                if (elmlist.length > 0) {
                    sUserName = "A";
                    return true;
                } else {
                    var arrUserName = sUserName.split(";");
                    sUserName = arrUserName[0];
                    var arrDeptName = sDeptName.split(";");
                    var arrDeptName2 = arrDeptName[0].split("\\");
                    retireCheckYN = "N";
                    //alert("결재선에 퇴직자 (사번 변경 포함) 가 있습니다. 반송처리 후 재기안 하시기 바랍니다.");
                    alert("결재리스트에 퇴직자(" + sUserName + ")가 포함되어 있습니다.\n개인결재선을 삭제 후 새로 등록해 주시기 바랍니다.");
                    //doButtonActionD();
                    // parent.menu.openRetire(arrUserName[0], arrDeptName2[2]);
                    retireCheck = true;
                    
                    return false;
                    
                }
            }
        }
    }
}
//jkh 결재리스트에 퇴직자 체크 로직끝 2015.04.15//

//쿠쿠전자 추가
function setApvList4Consult() {
    //    var elmList = m_oApvList.documentElement.selectNodes("division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step");
    //    var elmcharge = elmList.item(0);
    //    var elmdiv = m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']");
    //    //결재자 이동
    //    var NoNConsult = 0;
    //    for(var i=1;i<elmList.length;i++){
    //        if(elmList.item(i).getAttribute("routetype") == "consult"){
    //            var currNode1 = elmdiv.appendChild(elmList.item(i));
    //            //var oldChild = elmdiv.removeChild(elmList.item(i));
    //        }else{
    //            NoNConsult++;   
    //        }
    //    }    
    //    elmList = elmdiv.selectNodes("step");
    //    for(var i=elmList.length-1;i>1;i--){
    //        if(elmList.item(i).getAttribute("routetype") == "consult"){
    //            if (NoNConsult > 0){
    //                var currNode2 = elmdiv.insertBefore(elmList.item(i), elmList.item(2));
    //            }else{
    //                var currNode3 = elmdiv.insertBefore(elmList.item(i), elmList.item(1));
    //            }
    //            //var oldChild = elmdiv.removeChild(elmList.item(i));
    //         }
    //    }
}
//BC카드 추가 결재안함 사유 추가
function statusChangeSkipKind() {
    var bSetDirty = false;
    var oSelTR;
    //    if(window.addEventListener){
    //    	oSelTR = document.getElementById("Apvlist").contentWindow.getPatentRow();
    //    }else{
    //    	oSelTR = Apvlist.getPatentRow();
    //    }		
    oSelTR = getPatentRowApvlist(e)
    var xpathCur = oSelTR.id;
    if (!("ActiveXObject" in window)) { xpathCur = ConvertXpath(xpathCur); }
    var elmRoot = m_oApvList.documentElement;
    var elmCur = elmRoot.selectSingleNode(xpathCur);
    var elmTaskInfo = elmCur.selectSingleNode("taskinfo");

    var sRouteType = getFamilyAttribute(elmCur, "step", "routetype");
    var sUnitType = getFamilyAttribute(elmCur, "step", "unittype");

    var elmNext = getNextElm(elmCur);

    var sCurType = Apvlist.event.srcElement.value;
    var bExitNormal = false;
    //skip 다음으로 결재문서를 받은 사용자가 있을 경우 변경을 하지 못함
    while (elmNext != null) {
        elmNextTaskInfo = elmNext.selectSingleNode("taskinfo");
        if (elmNextTaskInfo.getAttribute("datereceived") != null) {
            alert(strMsg_179); //"다음 결재자가 이미 문서를 받았습니다."
            bExitNormal = true;
            elmNext = null;
        } else {
            elmNext = getNextElm(elmNext);
            //if(elmNext==null || elmNext.selectSingleNode("taskinfo[@kind='skip']")==null)elmNext=null;
        }
    }
    if (!bExitNormal) {
        //elmTaskInfo.setAttribute("customattribute2",sCurType);
        bSetDirty = true;
    }

    if (bSetDirty) try { m_oFormMenu.setApvDirty(); } catch (e) { }
    refreshList(xpathCur);
}
// 특정공람자 추가
function setApvList4Review() {
    var scmpCode = "06"; //부장 desc
    var bApprover = false;
    if (getInfo("scReviewFix") == "1" && getInfo("scReviewFixV") != "" && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL")) {
        //특정 직위 이상의 결재자 포함 여부확인
        var elmList = m_oApvList.selectNodes("steps/division/step[@routetype='approve' and @unittype='person' ]/ou/person[taskinfo/@kind!='skip' and taskinfo/@kind!='bypass']");
        for (var i = 0; i < elmList.length; i++) {
            var elm = elmList.nextNode();
            var szposition = elm.getAttribute("level").split(";")[0];
            //if(parseInt(szposition) <= 300){
            //01  사장/02  부사장/03  감사 /04  상무이사 /05  상근감사위원/06  본부장 
            if (szposition.indexOf("01") > -1 || szposition.indexOf("02") > -1 || szposition.indexOf("03") > -1 || szposition.indexOf("05") > -1 || szposition.indexOf("06") > -1) {
                bApprover = true;
                break;
            }
        }
        //일상감사(감사실) 포함되어 있으면 상근감사 지정하지 않아도 됨
        var elmList = m_oApvList.selectNodes("steps/division/step[@routetype='audit' and @unittype='ou' ]");
        if (elmList.length > 0) {
            bApprover = false;
        }
        var aReview = getInfo("scReviewFixV").split("@@"); //shpark@@박상훈@@<user>
        if (bApprover) {
            //특이 공람자 포함여부 확인
            var elm = m_oApvList.selectSingleNode("steps/division/step[@routetype='review' and @unittype='person' ]/ou/person[@code='" + aReview[0] + "']");
            if (elm == null) {
                var m_ReviewevalXML = CreateXmlDocument();
                m_ReviewevalXML.loadXML(aReview[2]);

                m_sSelectedStepType = "division";
                m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
                m_sSelectedRouteType = "review";
                m_sSelectedUnitType = "person";
                m_sSelectedAllotType = "parallel";
                m_sSelectedStepRef = "review"; //"일반결재"
                l_bGroup = false;

                insertToList(m_ReviewevalXML.documentElement); //꼭 확인할 것
            }
        } else { //특이 공람자 삭제 처리 해야함
            var elm = m_oApvList.selectSingleNode("steps/division/step[@routetype='review' and @unittype='person' ]/ou/person[@code='" + aReview[0] + "']");
            if (elm != null) {
                //remove
                var oDiv = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='pending' or taskinfo/@status='inactive']");
                var oStep = oDiv.selectSingleNode("step[@routetype='review' and @unittype='person']");
                var oldChild = oStep.selectSingleNode("ou[person/@code='" + aReview[0] + "']");
                oStep.removeChild(oldChild);
                if (oStep.selectNodes("ou").length == 0) {
                    oDiv.removeChild(oStep);
                }
            }
        }

    }
}
function ConvertXpath(szXPath) {
    //index변환 "divison[0]/step[1]/ou[3]/(person|role)
    /*
    "divison [
    0        ]/step [
    1        ]/ou [
    3        ]/(person|role)
    */
    var szCVTPath = "";
    if (szXPath.indexOf("division[0]/step[") > -1 || szXPath.indexOf("division[1]/step[") > -1 || szXPath.indexOf("division[2]/step[") > -1 || szXPath.indexOf("division[3]/step[") > -1 || szXPath.indexOf("division[4]/step[") > -1
    || szXPath.indexOf("ccinfo[") > -1
    ) {
        var AryNumber = szXPath.split("[");
        for (var i = 0; i < AryNumber.length; i++) {
            if (AryNumber[i].indexOf("]") > -1) {
                var AryNumber2 = AryNumber[i].split("]");
                for (var j = 0; j < AryNumber2.length; j++) {
                    if (isNumber(AryNumber2[j])) {
                        AryNumber2[j] = parseInt(AryNumber2[j]) + 1;
                    }
                }
                for (var j = 0; j < AryNumber2.length; j++) {
                    szCVTPath += AryNumber2[j] + ((j == 0) ? "]" : "")
                }
                if (i < AryNumber.length - 1) szCVTPath += "[";
            } else {
                szCVTPath += AryNumber[i] + ((i == 0) ? "[" : "");
            }
        }
    } else {
        szCVTPath = szXPath;
    }
    return szCVTPath.replace("(person|role)", "*[name()='person' or name()='role']");
}
/*************************************************************************
함수명 : containsCharsOnly
기  능 : 특정문자가 존재하는지 체크
인  수 : input, chars - 객체, 찾고자하는 문자
리턴값 : 존재하면 true
**************************************************************************/
function containsCharsOnly(input, chars) {
    for (var inx = 0; inx < input.length; inx++) {
        if (chars.indexOf(input.charAt(inx)) == -1)
            return false;
    }
    return true;
}

/*************************************************************************
함수명 : isNumber
기  능 : 입력값이 숫자인지를 체크
인  수 : input - 입력값
리턴값 : 숫자 true , 숫자외문자 false
**************************************************************************/
function isNumber(input) {
    var chars = "0123456789";
    if (input == "") return false;
    return containsCharsOnly(input, chars);
}

function get_choiseIdOrName(IdName) {
    var tmpValue = "";
    if (m_oFormMenu.contentWindow) {
        tmpValue = m_oFormMenu.contentWindow.document.getElementsByName(IdName)[0].value;
    }
    else {
        tmpValue = m_oFormMenu.children.item(IdName).value;
    }
    return tmpValue;
}
function set_choiseIdOrName(IdName) {
    var tmpobj;
    if (m_oFormMenu.contentWindow) {
        tmpobj = m_oFormMenu.contentWindow.document.getElementsByName(IdName)[0];
    }
    else {
        tmpobj = m_oFormMenu.children.item(IdName);
    }
    return tmpobj;
}
function ApvLineDisaplyNXSL() {//debugger;
    var viewtype = "read";
    if (getInfo("loct") == "PREAPPROVAL" || getInfo("loct") == "COMPLETE") {
        viewtype = "read";
    } else {
        switch (m_sApvMode) {
            case "DRAFT":
            case "TEMPSAVE": viewtype = "create"; break;
            case "REDRAFT": viewtype = "change"; break;
            case "SUBREDRAFT": viewtype = "change"; break;
            case "APVLINE": viewtype = "create"; break;
            case "APPROVAL": viewtype = "change"; break;
            case "SUBAPPROVAL": viewtype = "change"; break;
            case "RECAPPROVAL": viewtype = "change"; break;
            case "CHARGE": viewtype = "change"; break;
            case "PROCESS": viewtype = "change"; break;
            case "DEPTLIST": //200902 추가 시작 : 일괄결재선지정
                viewtype = "create"; break;
            case "AUDIT": //2010.02 yu2mi : 결재선 UI 변경 - audit도 결재선 변경 할 수 있도록 수정
                viewtype = "create"; break;
            default: viewtype = "read"; break;
        }
    }
    var szHeader = "";
    var szLIST = "";
    switch (viewtype) {
        case "read": szHeader = szLISTread; break;
        case "create": szHeader = szLISTcreate; break;
        case "change": szHeader = szLISTchange; break;
    }
    var elmList = m_oApvList.documentElement.selectNodes("division");
    var didx = 1;
    for (var x = 0; x < elmList.length; x++) {
        var odiv = elmList.nextNode();
        if (odiv == null) odiv = elmList[x]; //2011.07
        var vDivisionType = odiv.getAttribute("divisiontype");  //발신부서/수신부서구분 (2012-12-17 HIW)
        var osteps = odiv.selectNodes("step");
        var ohiddensteps = odiv.selectNodes("step[taskinfo/@visible='n']");
        if (elmList.length > 1) {
            var sHTML = calltemplatehtmlrow(
                "division[" + x + "]",
                (x + 1),
                odiv.getAttribute("name"),
                ";",
                ";",
                odiv.selectSingleNode("taskinfo"),
                odiv.getAttribute("ouname"),
                odiv.getAttribute("oucode"),
                viewtype,
                odiv.getAttribute("divisiontype"),
                odiv.getAttribute("divisiontype"),
                null, vDivisionType, "N");  //마지막인자: 인장권자여부추가 (2012-12-17 HIW)
            szLIST = sHTML + szLIST;
        }
        for (var xx = 0; xx < osteps.length; xx++) {
            var ostep = osteps.nextNode();
            if (ostep == null) ostep = osteps[x]; //2011.07
            var osteptaskinfo = ostep.selectSingleNode("taskinfo");
            if (osteptaskinfo == null || osteptaskinfo.getAttribute("visible") != 'n') {
                var steproutetype = ostep.getAttribute("routetype");
                var stepunittype = ostep.getAttribute("unittype");
                var parentunittype = steproutetype;
                var assureouvisible = "";
                if (steproutetype == "notify") {
                } else {
                    if (stepunittype == "ou" && (steproutetype == "assist" || steproutetype == "consult" || steproutetype == "receive" || steproutetype == "audit")) assureouvisible = "true";
                    var oous = ostep.selectNodes("ou");
                    var ohiddenoous = ostep.selectNodes("ou[taskinfo/@visible='n']");
                    for (var xxx = 0; xxx < oous.length; xxx++) {
                        var oou = oous.nextNode();
                        if (oou == null) oou = oous[x]; //2011.07
                        var ooutaskinfo = oou.selectSingleNode("taskinfo");
                        var xpathopersons = "(person|role)";

                        if (!("ActiveXObject" in window)) { xpathopersons = ConvertXpath(xpathopersons); }
                        var opersons = oou.selectNodes(xpathopersons);
                        var ohiddenpersons = oou.selectNodes(xpathopersons + "[taskinfo/@visible='n']");

                        var xpathcntvisibleperson = "(person|role)[not(taskinfo/@visible='n')]";
                        if (!("ActiveXObject" in window)) { xpathcntvisibleperson = ConvertXpath(xpathcntvisibleperson); }
                        //var cntvisibleperson = oou.selectNodes(xpathcntvisibleperson).length;
                        var cntvisibleperson = opersons.length - ohiddenpersons.length;
                        //debugger
                        if ((stepunittype != 'person' && cntvisibleperson == 0) || (cntvisibleperson > 0 && assureouvisible == 'true')) {
                            if (ooutaskinfo == null || ooutaskinfo.getAttribute("visible") != 'n') {
                                var indexxxxx = dblDigit(x + 1);
                                indexxxxx += ((indexxxxx != "") ? "." : "") + dblDigit(xx + 1 - ohiddensteps.length);
                                if (oous.length > 1) {
                                    indexxxxx += ((indexxxxx != "") ? "." : "") + dblDigit(xxx + 1 - ohiddenoous.length);
                                }
                                var sHTML = calltemplatehtmlrow(
									"division[" + x + "]/step[" + xx + "]/ou[" + xxx + "]",
									indexxxxx,
									oou.getAttribute("name"),
									"",
									"",
									oou.selectSingleNode("taskinfo"),
									oou.getAttribute("name"),
									"",
									viewtype,
									steproutetype,
									stepunittype,
									parentunittype, vDivisionType, "N");  //마지막인자: 인장권자여부추가 (2012-12-17 HIW)
                                szLIST = sHTML + szLIST;
                                didx++;
                            }
                        }
                        for (var xxxx = 0; xxxx < opersons.length; xxxx++) {
                            var operson = opersons.nextNode();
                            if (operson == null) operson = opersons[x]; //2011.07
                            var otaskinfo = operson.selectSingleNode("taskinfo");
                            var indexxxxx = dblDigit(x + 1);

                            if ((stepunittype == 'person' && cntvisibleperson > 1) || (stepunittype != 'person' && cntvisibleperson > 0)) {
                                indexxxxx += ((indexxxxx != "") ? "." : "") + dblDigit(xxx + 1 - ohiddenoous.length);
                                indexxxxx += ((indexxxxx != "") ? "." : "") + dblDigit(xxxx + 1 - ohiddenpersons.length);
                            } else {
                                indexxxxx += ((indexxxxx != "") ? "." : "") + dblDigit(xx + 1 - ohiddensteps.length);
                            }
                            if (otaskinfo.getAttribute("visible") != 'n') {
                                var displayname = "";
                                var title = "";
                                var level = "";
                                var oudisplayname = "";
                                var code = "";
                                var vStampRightYN = "N";  //인장권자여부 (2012-12-17 HIW)

                                var oroleperson = null;
                                if (operson.nodeName == "role") {
                                    oroleperson = operson.selectSingleNode("person");
                                    if (oroleperson != null) {
                                        displayname = oroleperson.getAttribute("name");
                                        title = oroleperson.getAttribute("title");
                                        level = oroleperson.getAttribute("position");
                                        oudisplayname = oroleperson.getAttribute("ouname");
                                        code = oroleperson.getAttribute("code");
                                        try {
                                            vStampRightYN = oroleperson.getAttribute("stampRights");  //인장권자여부 (2012-12-17 HIW)
                                        } catch (e) { vStampRightYN = "N" }
                                    } else {
                                        displayname = operson.getAttribute("name");
                                        oudisplayname = operson.getAttribute("ouname");
                                        code = operson.getAttribute("code");
                                    }
                                } else {
                                    displayname = operson.getAttribute("name");
                                    title = operson.getAttribute("title");
                                    level = operson.getAttribute("position");
                                    oudisplayname = operson.getAttribute("ouname");
                                    code = operson.getAttribute("code");
                                    try {
                                        vStampRightYN = operson.getAttribute("stampRights");  //인장권자여부 (2012-12-17 HIW)
                                    } catch (e) { vStampRightYN = "N" }
                                }
                                //debugger
                                var sHTML = calltemplatehtmlrow(
								"division[" + x + "]/step[" + xx + "]/ou[" + xxx + "]/(person|role)[" + xxxx + "]",
								indexxxxx,
								displayname,
								title,
								level,
								otaskinfo,
								oudisplayname,
								code,
								viewtype,
								steproutetype,
								stepunittype,
								parentunittype, vDivisionType, vStampRightYN);  //인장권자여부:vStampRightYN 추가 (2012-12-17 HIW)
                                szLIST = sHTML + szLIST;
                                didx++;
                            }
                        }
                    }

                }
            }
        }

    }
    document.getElementById("Apvlist").innerHTML = "<table id=\"tblApvList\" width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"BTable\">" + szHeader + szLIST + "</table>";
    if (gselectedRowId != null) selectRowApvlist(gselectedRowId);

    //== 체크박스 모두 초기화 (체크해제) 2012-12-17 HIW =========
    var vTableID = ListItems.g_eGalTable.id;
    $("#ListItems").contents().find("#" + vTableID + " tr").each(function (i) {  //왼쪽리스트테이블ID: tblGalInfo
        if (i > 0) {
            if ($(this).find("td:nth-child(1)").children().attr('checked')) {
                $(this).find("td:nth-child(1)").children().attr('checked', false);
            }
        }
    });
    //=========================================================
}

function calltemplatehtmlrow(itemid, index, displayname, title, level, itemtaskinfo, oudisplayname, person_code, viewtype, steproutetype, stepunittype, parentunittype, pDivisionType, pStampRights) {  //pStampRights:인장권자여부 (2012-12-17 HIW)
    //debugger
    var sHTML = ""
    var szcustomattribute2 = "";
    if (itemtaskinfo.parentNode.parentNode.parentNode.nodeName == "step") szcustomattribute2 = itemtaskinfo.parentNode.parentNode.parentNode.getAttribute("name");
    if (viewtype == 'create' || viewtype == 'myread') {
        sHTML = "<tr ";
        if (viewtype == 'create') {
            sHTML += " onmousedown=\"selectRowApvlist(null, event)\" ";
            //sHTML += " onmousemove=\"event_GalTable_onmousemoveapvlist(null, event)\" ";
            //sHTML += " ondblclick=\"event_GalTable_ondblclickapvlist(event)\" ";
            if (index.toString().indexOf(".") == -1) {//division그리기201108
                sHTML += " style=\"height:25px;background-color:e8e8e8;\" ";
            } else {
                sHTML += " style=\"height:25px\" ";
            }

        }
        sHTML += " id=\"" + itemid + "\" ";

        //== 인장권자여부= <tr>에 속성추가 (2012-12-17 HIW) ============
        /*
        if (gStampRightsYN == "Y") {  //인장권자 추가인경우
        var vTableID = ListItems.g_eGalTable.id;
           
        $("#ListItems").contents().find("#" + vTableID + " tr").each(function (i) {  //왼쪽리스트테이블ID: tblGalInfo
        if (i > 0) {
        if ($(this).find("td:nth-child(1)").children().attr('checked')) {
        if ($(this).attr("em") == person_code) 
        sHTML += " STAMP=\"Y\" ";  //<tr>에 속성추가
        else
        sHTML += " STAMP=\"N\" ";  
        }
        }
        });
        } 
        */
        sHTML += " personCode=\"" + person_code + "\" ";  //속성추가 (2012-12-17 HIW)  
        sHTML += " divisionType=\"" + pDivisionType + "\" ";  //발신부서/수신부서 구분 속성추가 (2012-12-17 HIW) 
        sHTML += " STAMP=\"" + pStampRights + "\" ";  //인장권자여부 속성추가 (2012-12-17 HIW) 
        //==============================================================

        sHTML += " />";
        sHTML += "<td nowrap=\"t\" ";
        sHTML += ">";
        sHTML += getDotCountSpace(String(index));
        sHTML += "</td>";
        sHTML += "<td nowrap=\"t\" ";
        sHTML += ">" + splitNameExt(displayname, gLngIdx) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\" ";
        sHTML += ">" + splitName(level, gLngIdx) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\" ";
        sHTML += ">" + splitName(title, gLngIdx) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\" ";
        sHTML += ">" + convertSignResult(String(itemtaskinfo.getAttribute("result")), String(itemtaskinfo.getAttribute("kind")), String(szcustomattribute2)) + "&#160;</td>";

        sHTML += "<td nowrap=\"t\">";
        sHTML += applytemplatesitemtaskinfo(itemtaskinfo, viewtype);
        sHTML += "</td>";
        sHTML += "<td nowrap=\"t\" ";
        sHTML += ">" + splitNameExt(oudisplayname, gLngIdx) + "&#160;</td>";
        sHTML += "</tr>";
    } else if (viewtype == 'read') {
        sHTML = "<tr ";
        if (index.toString().indexOf(".") == -1) {//division그리기201108
            sHTML += " style=\"height:25px;background-color:e8e8e8;\" ";
        } else {
            sHTML += " style=\"height:25px\" ";
        }

        sHTML += " id=\"" + itemid + "\"> ";
        sHTML += " personCode=\"" + person_code + "\" ";  //속성추가 (2012-12-17 HIW)
        sHTML += " divisionType=\"" + pDivisionType + "\" ";  //발신부서/수신부서 구분 속성추가 (2012-12-17 HIW) 
        sHTML += " STAMP=\"" + pStampRights + "\" ";  //인장권자여부 속성추가 (2012-12-17 HIW) 
        sHTML += "<td nowrap=\"t\">";
        sHTML += getDotCountSpace(String(index));
        sHTML += "</td>";
        sHTML += "<td nowrap=\"t\">" + splitNameExt(displayname, gLngIdx) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">" + splitName(level, gLngIdx) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">" + splitName(title, gLngIdx) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">" + convertSignResult(String(itemtaskinfo.getAttribute("result")), String(itemtaskinfo.getAttribute("kind")), String(szcustomattribute2)) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">";
        sHTML += applytemplatesitemtaskinfo(itemtaskinfo, viewtype) + "</td>";
        sHTML += "<td nowrap=\"t\">" + splitNameExt(oudisplayname, gLngIdx) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">" + formatDate(itemtaskinfo.getAttribute("datecompleted")) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">" + formatDate(itemtaskinfo.getAttribute("datereceived")) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">" + applytemplatesdisplaycomment(itemtaskinfo, itemid) + "&#160;</td>";
        sHTML += "</tr>";
    } else if (viewtype == 'change') {
        var datereceived = itemtaskinfo.getAttribute("datereceived");
        sHTML = "<tr ";
        if (index.toString().indexOf(".") == -1) {//division그리기201108
            sHTML += " style=\"height:25px;background-color:e8e8e8;\" ";
        } else {
            sHTML += " style=\"height:25px\" ";
        }

        sHTML += " id=\"" + itemid + "\" ";
        if (datereceived == null) {
            sHTML += " onmousedown=\"selectRowApvlist(null, event)\" ";
            //sHTML += " ondblclick=\"event_GalTable_ondblclickapvlist(event)\" ";
        } else if (datereceived != undefined) {
            sHTML += " onmousedown=\"selectRowApvlist(null, event)\" ";
            //sHTML += " ondblclick=\"event_GalTable_ondblclickapvlist(event)\" ";
        }
        sHTML += " personCode=\"" + person_code + "\" ";  //속성추가 (2012-12-17 HIW)
        sHTML += " divisionType=\"" + pDivisionType + "\" ";  //발신부서/수신부서 구분 속성추가 (2012-12-17 HIW) 
        sHTML += " STAMP=\"" + pStampRights + "\" ";  //인장권자여부 속성추가 (2012-12-17 HIW) 
        sHTML += " > ";
        sHTML += "<td nowrap=\"t\" >";
        sHTML += getDotCountSpace(String(index));
        sHTML += "</td>";
        sHTML += "<td nowrap=\"t\">" + splitNameExt(displayname, gLngIdx) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">" + splitName(level, gLngIdx) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">" + splitName(title, gLngIdx) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">" + convertSignResult(String(itemtaskinfo.getAttribute("result")), String(itemtaskinfo.getAttribute("kind")), String(szcustomattribute2)) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">" + applytemplatesitemtaskinfo(itemtaskinfo, viewtype) + "</td>";
        sHTML += "<td nowrap=\"t\">" + splitNameExt(oudisplayname, gLngIdx) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">" + formatDate(itemtaskinfo.getAttribute("datecompleted")) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">" + formatDate(itemtaskinfo.getAttribute("datereceived")) + "&#160;</td>";
        sHTML += "<td nowrap=\"t\">" + applytemplatesdisplaycomment(itemtaskinfo, itemid) + "&#160;</td>";
        sHTML += "</tr>";
    }
    return sHTML;
}

//201107 의견조회 관련 수정
var cmtid = 0;
function applytemplatesdisplaycomment(itemtaskinfo, itemid) {
    var commentkey = itemid;
    var sHTML = "";
    if (itemtaskinfo.selectSingleNode("comment") != null) {
        commentkey = cmtid; cmtid++;
        sHTML = "<a href=\"javascript:viewComment('" + commentkey + "');\">" + strlable_comment + "</a>";
        sHTML += "<textarea style=\"display:none\" id=\"" + commentkey + "\">" + applytemplatescomment(itemtaskinfo.selectSingleNode("comment")) + "</textarea>";
    }
    return sHTML;
}
function applytemplatescomment(comment) {
    var sHTML = "";
    if (comment != null) {
        sHTML = "<b>" + convertSignResult(String(comment.getAttribute("relatedresult")), String(comment.getAttribute("kind")), comment.parentNode.parentNode.parentNode.parentNode.getAttribute("name")) + "</b>";
        sHTML += formatDate(String(comment.getAttribute("datecommented")));
        sHTML += "<br />" + replaceCR(String(comment.text));
    }
    return sHTML;
}
//2011.03.17 결재종류 추가 ( 확인, 참조)
function addPersonExt(szkind) {
    if (getInfo("mode") == "SUBREDRAFT" || getInfo("mode") == "SUBAPPROVAL") {
        var chkel = null;
        if (!("ActiveXObject" in window)) {
            chkel = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='pending']/step[taskinfo/@status='pending']/ou[taskinfo/@status='pending' and taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']/*[name()='person' or name()='role']/taskinfo[@kind='authorize']")
        } else {
            chkel = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='pending']/step[taskinfo/@status='pending']/ou[taskinfo/@status='pending' and taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']/(person|role)/taskinfo[@kind='authorize']")
        }
        if (chkel != null) {
            alert(strMsg_036);
            return false;
        }

    } else {
        var chkel = null;
        if (!("ActiveXObject" in window)) {
            chkel = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step[@routetype='approve']/ou/*[name()='person' or name()='role']/taskinfo[@kind='authorize']")
        } else {
            chkel = m_oApvList.selectSingleNode("steps/division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step[@routetype='approve']/ou/(person|role)/taskinfo[@kind='authorize']")
        }
        if (chkel != null) {
            alert(strMsg_036); //"전결자가 지정되어있는 경우에는 결재자를 추가할 수 없습니다.\n전결자를 일반결재 상태로 변경하신 후에 다시 추가하십시오."
            return false;
        }
    }

    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send"; //수신부서일 경우 변경 필요
    m_sSelectedRouteType = "approve";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = szkind; //"일반결재"
    l_bGroup = false;
    insertToList(switchParentNode(3));
}