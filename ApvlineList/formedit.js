var m_xmlHTTP = CreateXmlHttpRequest();
var m_evalXML = CreateXmlDocument();
var g_szAcceptLang = "ko";
var m_cvtXML = CreateXmlDocument().createTextNode("");
var m_oApvList = CreateXmlDocument();
var m_oRecList = CreateXmlDocument();
var sReceiveNo = "";
var g_BaseImgURL = "/GWStorage/e-sign/ApprovalSign/";
var g_BaseFormURL = "/GWStorage/e-sign/ApprovalForm/";
var g_BaseSender = "(주) 코 비 젼";
var g_BaseHeader = '"고객과 미래를 함께 합니다"';
var g_BaseORGNAME = '(주) 코 비 젼';
var elmComment = CreateXmlDocument(); //	의견

var m_KMWebAttURL = '';
var m_sApvMode = "";
var m_print = false; //출력상태여부 - 출력형태로 할때 사용 
var bFileView = false;
var bPresenceView = false;
var bDisplayOnly = false;

//CB작업을 위해 추가
var m_oFormEditor = self;
var m_oFormMenu = parent.menu;
try { if (m_oFormMenu == null) m_oFormMenu = parent.parent.menu; } catch (e) { }


try {
    //작성페이지에서는 출력/출력미리보기/본문인쇄 모두 안보이게 (2013-03-21 HIW)
    if (document.location.href.indexOf('read.htm') == -1) {
        m_oFormMenu.document.getElementById("btPrint").style.display = "none";
        m_oFormMenu.document.getElementById("btPrintView").style.display = "none";
        m_oFormMenu.document.getElementById("btPrintOnlyBody").style.display = "none";
    }
}
catch (e) { }


function getInfo(sKey) { try { return parent.g_dicFormInfo.item(sKey); } catch (e) { alert(m_oFormMenu.gMessage254 + sKey + m_oFormMenu.gMessage255); } } //"양식정보에 없는 키값["+sKey+"]입니다."
function setInfo(sKey, sValue) {
    try {
        if (parent.g_dicFormInfo.Exists(sKey)) parent.g_dicFormInfo.Remove(sKey);
        parent.g_dicFormInfo.Add(sKey, sValue);
    } catch (e) { alert(m_oFormMenu.gMessage254 + sKey + m_oFormMenu.gMessage255); } //"양식정보에 없는 키값["+sKey+"]입니다."
}
function handleResize(elm, offset) {
    var intHeight = document.body.clientHeight - offset;
    if (intHeight <= 0) intHeight = 25;
    elm.style.height = intHeight + "px";
}
function makeNode(sName, vVal, sKey, bCData) {
    if (!window.ActiveXObject) {
        if (vVal == null) { m_cvtXML.textContent = document.getElementsByName((sKey != null ? sKey : sName))[0].value; } else { m_cvtXML.textContent = vVal; }
    } else {
        if (vVal == null) { m_cvtXML.text = document.getElementsByName((sKey != null ? sKey : sName))[0].value; } else { m_cvtXML.text = vVal; }
    }
    //if(vVal==null){	m_cvtXML.text = dField[(sKey!=null?sKey:sName)].value;	}else{	m_cvtXML.text = vVal;	}
    return "<" + sName + ">" + (bCData ? "<![CDATA[" : "") + (bCData ? m_cvtXML.text + "]]>" : m_cvtXML.xml) + "</" + sName + ">";
}
function getFormXML() {
    var sXML = "";
    sXML = getBodyContext();
    var unFiltered = document.getElementsByTagName("*");
    for (i = 0; i < unFiltered.length; i++) {
        if (unFiltered[i].getAttribute("id") == "dField") {
            sXML += makeNode(unFiltered[i].getAttribute("name"), unFiltered[i].value);
        }
    }
    return "<formdata>" + sXML + "</formdata>";
}
var Modify_Comment = "";
function getChangeFormXML() {//debugger;
    var sXML = "";
    sXML = getBodyContext();
    //common fields( ex)cField, mField를 제외한 dField 화면에 보이지 않는 값)
    if (!window.ActiveXObject) {
        sXML += makeCBFormXML("input", "dField");
        sXML += makeCBFormXML("select", "dField");
        sXML += makeCBFormXML("radio", "dField");
        sXML += makeCBFormXML("textarea", "dField");
    } else {
        for (var i = 0; i < dField.length; i++) {
            if (dField[i].value != getInfo(dField[i].name)) { sXML += makeNode(dField[i].name); }
        }
    }
    if ((m_oFormMenu.document.getElementsByName("bLASTAPPROVER")[0].value == 'true' && getInfo("scDNum") == '1') || (getInfo("mode") == "SIGN")) { //최종결재자 문서정보 넘길것
        try { if (sXML.indexOf("<DOC_NO") == -1) sXML += makeNode("DOC_NO"); } catch (e) { }
    }

    //body_context & specfic fields	
    //receive no process//
    if ((getInfo("mode") == "REDRAFT") && (m_oFormMenu.getHasReceiveno() == "true")) {
        sXML += makeNode("RECEIVE_NO");
        if (sXML.indexOf("INITIATOR_OU_ID") == -1) sXML += makeNode("INITIATOR_OU_ID");
    }
    var sXMLAdd = "";
    if (Modify_Comment != "") {
        sXMLAdd = "<MODIFY_COMMENT><![CDATA[" + Modify_Comment + "]]></MODIFY_COMMENT>";
    }
    //last modifier info
    if (sXML != "") { return "<LAST_MODIFIER_ID>" + getInfo("usid") + "</LAST_MODIFIER_ID><formdata>" + sXML + "</formdata>" + sXMLAdd; } else { return "<formdata>" + sXML + "</formdata>" + sXMLAdd; }
}
function makeCBFormXML(szTagName, szFieldId) {
    var szReturn = "";
    var unFiltered = document.getElementsByTagName(szTagName);
    for (var i = 0; i < unFiltered.length; i++) {
        if (unFiltered[i].getAttribute("id") == szFieldId) {
            if (unFiltered[i].value != getInfo(unFiltered[i].getAttribute("name"))) {
                if (szTagName == "select") {
                    szReturn += getSelRadio(unFiltered[i])
                } else {
                    szReturn += makeNode(unFiltered[i].getAttribute("name"));
                }
            }
        }
    }
    return szReturn;
}
/*doc info - final approver, charge,  uses*/
function getDocFormXML() {
    var sXML = "";
    if ((getInfo("fmpf") == 'DRAFT') || (getInfo("fmpf") == 'OUTERPUBLISH') || (getInfo("fmpf") == 'OFFICIAL_DOCUMENT') || (getInfo("fmpf") == 'DRAFT03')) {
        if ((m_oFormMenu.document.getElementsByName("bLASTAPPROVER")[0].value == 'true') || (getInfo("mode") == "SIGN")) { //최종결재자 문서정보 넘길것
            sXML += makeNode("DOC_NO") + makeNode("INITIATOR_OU_ID") + makeNode("DOC_OU_NAME") + makeNode("DOC_CLASS_ID") + makeNode("APPLIED");
        }
    } else {
        if ((m_oFormMenu.document.getElementsByName("bLASTAPPROVER")[0].value == 'true')) { //최종결재자 문서정보 넘길것
            sXML += makeNode("DOC_NO", "0000") + makeNode("INITIATOR_OU_ID") + makeNode("DOC_OU_NAME", getInfo("INITIATOR_OU_NAME")) + makeNode("DOC_CLASS_ID", "0000") + makeNode("APPLIED", "2004.05.18");
        }
    }
    if ((getInfo("mode") == "REDRAFT") && (m_oFormMenu.getHasReceiveno() == "true")) sXML += makeNode("RECEIVE_NO") + makeNode("INITIATOR_OU_ID");
    if (sXML != "") { return "<LAST_MODIFIER_ID>" + getInfo("usid") + "</LAST_MODIFIER_ID><formdata>" + sXML + "</formdata>"; } else { return "<formdata>" + sXML + "</formdata>"; }
}

function initApvList() {//debugger;
    //회수문서 및 임시저장 문서 재사용 시 부서코드/부서명/회사코드 최종본 반영 위해 수정 by sunny 2006.12. 양식쪽 일괄작업 어려움 공통함수 부분에서처리함
    if (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE") {
        try { document.getElementsByName("INITIATOR_OU_ID")[0].value = getInfo("dpid_apv"); } catch (e) { }
        try { document.getElementsByName("INITIATOR_OU_NAME")[0].value = getInfo("dpdn_apv"); } catch (e) { }
        try { document.getElementsByName("ENT_CODE")[0].value = getInfo("etid"); } catch (e) { }
    }
    //양식 설명 위해 추가
    if (getInfo("fmwkds") != "") { try { document.getElementById("tdforminfo").innerHTML = getInfo("fmwkds").replace("\n", "<br>"); document.getElementById("divforminfo").style.display = ""; } catch (e) { } }
    m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + m_oFormMenu.document.getElementsByName("APVLIST")[0].value);

//2015-01-14 hyh 추가
    var nodeFlag = false;
    var rNode = m_oApvList.selectSingleNode("steps/division[@divisiontype='receive']");
    var pNode;
    if (rNode != null) 
    {
        pNode = rNode.selectSingleNode("step/ou/person");
        /*
        if (pNode == null) {
            alert(1);
            m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + m_oFormMenu.document.getElementsByName("APVLIST")[0].value);
        }
        else {
            node = true;
        }
        */
        do {
            var nodeFlag = false;
            var rNode = m_oApvList.selectSingleNode("steps/division[@divisiontype='receive']");
            var pNode;
            if (rNode != null) 
            {
                pNode = rNode.selectSingleNode("step/ou/person");
                if (pNode == null) 
                {//alert(1);
                    m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + m_oFormMenu.document.getElementsByName("APVLIST")[0].value);
                }
            }
            else 
            {
                nodeFlag = true;
            }
        }
        while (nodeFlag == true)
    }
    //2015-01-14 hyh 추가 끝

    //20130911 hyh 추가
   if(getInfo("gloct") == "DEPART"){
    if (document.location.href.indexOf('read.htm') > -1 && getInfo("commentlist").indexOf("rejectedtodept") > -1) {
        var m_Comment = CreateXmlDocument();
        var elm;
        m_Comment.loadXML("<?xml version='1.0' encoding='utf-8'?>" + getInfo("commentlist"));
        var m_CommentList = m_Comment.selectNodes("WF_COMMENT/comment_list");
        //for (var i = 0; i < m_CommentList.length; i++) {
            //elm = m_CommentList.nextNode();

            var comment_list = m_CommentList[m_CommentList.length-1].getAttribute("COMMENT");
            //if (comment_list.text.indexOf("rejectedtodept") > -1) {
            
            if(m_CommentList[m_CommentList.length-1].getAttribute("COMMENT").indexOf("rejectedtodept") > -1) {
                var insertDate = m_CommentList[m_CommentList.length-1].getAttribute("INSERT_DATE").replace("T", " ").substring(0, m_CommentList[m_CommentList.length-1].getAttribute("INSERT_DATE").replace("T", " ").indexOf("."));
                var comment = m_oApvList.createElement("comment");
                comment.setAttribute("relatedresult", "rejectedto");
                comment.setAttribute("datecommented", insertDate);
                //2014-04-29 hyh 추가
                comment.setAttribute("comment_Dept", m_CommentList[m_CommentList.length-1].getAttribute("COMMENT").split("&")[2]);
                //2014-04-29 hyh 추가 끝
                if (m_oApvList.selectSingleNode("steps/division[@divisiontype='receive']") != null) {
                    var oFirstNode = m_oApvList.selectSingleNode("steps/division[@divisiontype='receive']");
                    var elmOU = oFirstNode.selectSingleNode("step/ou");
                    if (elmOU.selectSingleNode("person") != null) {
                        var elmPerson = elmOU.selectSingleNode("person");
                        var elmTaskInfo = elmPerson.selectSingleNode("taskinfo");
                        elmTaskInfo.appendChild(comment);
                        //comment.text = comment_list;
                        comment.text = comment_list.split("&")[0];
                    }
                }
            }
        }
    }
	//if (getInfo("loct") == "APPROVAL") {
    //retiredCheck(m_oApvList)

    //퇴직자 체크 로직추가 시작 2015.03.10//
    if (getInfo("mode") == "APPROVAL" || getInfo("mode") == "PROCESS" || getInfo("mode") == "PCONSULT" || getInfo("mode") == "RECAPPROVAL" || getInfo("mode") == "SUBAPPROVAL") {
      chkRetire(getInfo("mode"));

    }
    //20130911 hyh 추가 끝

    setInlineApvList(m_oApvList);
    //타양식 내용복사 
    //parent.timerID = setInterval(parent.DiffFormTempMemo, 1000);
    //관련업무 내용 추가
    try { if (parent.rel_activityid != "") { getTaskID(parent.rel_activityname + ";" + parent.rel_activityid); } } catch (e) { }
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
function chkRetire(strMode) {
    var xmlApv = new ActiveXObject("MSXML2.DOMDocument");
    xmlApv.loadXML("<?xml version='1.0' encoding='utf-8'?>" + parent.menu.field["APVLIST"].value);
    try {
        var nodesAllItems;
        if (strMode == "APPROVAL" || strMode == "PCONSULT" || strMode== "RECAPPROVAL" || strMode == "SUBAPPROVAL") {
            nodesAllItems = xmlApv.selectNodes("steps/division/step/ou/person[taskinfo/@status='inactive']"); //기결재자는 체크 안함
        } else {
            nodesAllItems = xmlApv.selectNodes("steps/division/step/ou/person[taskinfo/@status='pending' or taskinfo/@status='inactive']");
        }

        if (nodesAllItems.length > 0) {
            var oSteps = xmlApv.selectSingleNode("steps");
            chkAbsent(oSteps, strMode);
        }
    }
    catch (e) { alert(e.message); }
}
function chkAbsent(oSteps, oMode) {
    var oUsers;
    if (oMode == "APPROVAL" || oMode == "PCONSULT" || oMode== "RECAPPROVAL" || oMode == "SUBAPPROVAL") {
        oUsers = oSteps.selectNodes("division/step/ou/person[taskinfo/@status='inactive']"); //기결재자는 체크 안함
    } else {
        oUsers = oSteps.selectNodes("division/step/ou/person[taskinfo/@status='pending' or taskinfo/@status='inactive']"); //기결재자는 체크 안함
    }
    var elmUsers;
    var sUsers = "";
    var pXML, sXML;
    var szURL = "../getXMLQuery.aspx";
    if (oUsers.length > 0) {
        for (var i = 0; i < oUsers.length; i++) {
            elmUsers = oUsers[i];
            sUsers = elmUsers.getAttribute("code");
            sUserName = elmUsers.getAttribute("name");
            sDeptName = elmUsers.getAttribute("ouname");
            pXML = " EXEC dbo.usp_CheckAbsentMember '" + sUsers + "' ";
            sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>";
            requestHTTP("POST", szURL, false, "text/xml", receiveHTTPchkAbsentUsers, sXML);
            if (retireCheck) break;
        }
    }
}
//2015.01.08 결재선상의 퇴직자 체크(기결재자 제외)
function receiveHTTPchkAbsentUsers() {
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
                    alert("결재선에 퇴직자 (사번 변경 포함) 가 있습니다. 반송처리 후 재기안 하시기 바랍니다.");
                    //doButtonActionD();
                    // parent.menu.openRetire(arrUserName[0], arrDeptName2[2]);
                    m_oFormMenu.document.getElementById("btApproved").style.display = "none";
                    retireCheck = true;
                    return false;
                }
            }
        }
    }
}
//퇴직자 체크 로직끝 2015.03.10//

function setInlineApvList(oApvList) {
    if (oApvList == null) {//IE8.0대비
        if (m_oFormMenu.document.getElementsByName("APVLIST")[0] == undefined) {
            oApvList = null;
            setInlineApvList(oApvList);
        }
        else {
            m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + m_oFormMenu.document.getElementsByName("APVLIST")[0].value);
            oApvList = m_oApvList;
        }
    }
    if ((getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE") && getInfo("scFRMAPVLINE") == "1") {
        try { displayApvListFormApvLine(oApvList); } catch (e) { }
    } else {
        if (getInfo("scApvLineTypeV") == "2") {  //테이블형태로 표시
            
            if (getInfo("mobileyn") == "Y") {
                displayApvListNXpath(oApvList);
            } else {
                displayApvList(oApvList);
                
            }
        } else {  //Section형태로 표시
           
            //안드로이드 프로요적용201103
            if (getInfo("mobileyn") == "Y") {
                displayApvListColsNXpath(oApvList);
            } else {
                displayApvListCols(oApvList);
                
                
            }
        }
    }
}

function setInlineRecList(oApvList) { draftRecList(oApvList); }
//default html apv list display : #1 Approver Line, #1Assit person Line
function draftHTMLApvList(oApvList) {
    var elmRoot, elmList, elm, elmTaskInfo;
    var strDate, strFieldName;
    elmRoot = oApvList.documentElement;
    if (elmRoot != null) {
        elmList = elmRoot.selectNodes("division/step[@unittype='person' and @routetype='approve']/ou/person");
        var Apvlines = "";
        if (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE") {
            Apvlines += "<tr class=editing ><td width='50%' align='center'>기안자</td><td align='center'  bgcolor='#ffffff'>" + getInfo("usdn") + "</td><td></td><tr>";
        }
        for (var i = 0; i < elmList.length; i++) {
            elm = elmList.nextNode();
            elmTaskInfo = elm.selectSingleNode("taskinfo");
            ApvlinsDown = "<tr class=editing ><td width='40%' align='center'>" + elm.getAttribute("title").substring(elm.getAttribute("title").lastIndexOf(";") + 1) + "</td>";

            strDate = elmTaskInfo.getAttribute("datecompleted");
            if (strDate == null) { strDate = ""; }

            ApvlinsDown += "<td  width='40%' align='center' bgcolor='#ffffff'>";
            switch (elmTaskInfo.getAttribute("kind")) {
                case "authorize":
                    ApvlinsDown += "전결";
                    LastApv = getSignUrl(elm.getAttribute("code"), elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result")) + interpretResult(elmTaskInfo.getAttribute("result")) + "<br>" + elm.getAttribute("name");
                    break;
                case "substitute":
                    ApvlinsDown += "대결";
                    LastApv = getSignUrl(elm.getAttribute("code"), elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result")) + interpretResult(elmTaskInfo.getAttribute("result")) + "<br>" + elm.getAttribute("name");
                    break;
                case "skip":
                    ApvlinsDown += (i < elmList.length - 1) ? "/" : LastApv; break;
                case "bypass": ApvlinsDown += (LastApv == "") ? "후열" : LastApv; break; //"후열"
                case "review": ApvlinsDown += (strDate == "") ? "후결" : getSignUrl(elm.getAttribute("code"), elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result")) + interpretResult(elmTaskInfo.getAttribute("result")); break;
                case "charge":
                    ApvlinsDown += (strDate == "") ? m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) : getSignUrl(elm.getAttribute("code"), "stamp", elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result")) + interpretResult(elmTaskInfo.getAttribute("result")); break;
                default:
                    ApvlinsDown += (strDate == "") ? m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) : getSignUrl(elm.getAttribute("code"), elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result")) + interpretResult(elmTaskInfo.getAttribute("result"));
            }

            ApvlinsDown += "</td><td  width='20%' align='center'>" + formatDate(strDate) + "</td><tr>";
            Apvlines = ApvlinsDown + Apvlines;
        }
        Apvlines = "<table  cellpadding='0' cellspacing='1' width='100%' height='100%' border='1'  style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;' bgcolor='#B9CBEA'>" + Apvlines + "</table>";
        document.getElementById("AppLine").innerHTML = Apvlines;


        //협조
        elmList = elmRoot.selectNodes("division/step[@unittype='person' and @routetype='assist']/ou/person"); //개인협조??
        if (elmList.length != 0) {
            Apvlines = "";
            for (var i = 0; i < elmList.length; i++) {
                elm = elmList.nextNode();
                elmTaskInfo = elm.selectSingleNode("taskinfo");
                strDate = elmTaskInfo.getAttribute("datecompleted");
                if (strDate == null) { strDate = ""; }
                Apvlines += "<tr><td width='45%' align='center'>" + m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false) + "</td><td width='35%' align='center'>" + getSignUrl(elm.getAttribute("code"), elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result")) + "</td><td  width='20%' align='center'>" + formatDate(strDate) + "</td><tr>"
            }
            Apvlines = "<table cellpadding='0' cellspacing='1' width='100%' border='1' style='border-collapse: collapse;height:100%;'>" + Apvlines + "</table>";
            document.getElementById("AssistLine").innerHTML = Apvlines;
        }
    }
}
//dhtml body type 인장표현
function getSignUrl(apvid, signtype, apvname, sDate, bDisplayDate, sResult, breturn) {//debugger;
    
    var rtn = "";
    if (!breturn) {
        return m_oFormMenu.getLngLabel(apvname, false);
    } else {
        if (sDate != "") {
            if (signtype != "" && signtype != null && signtype != "undefined") {
                if (signtype == "stamp") {
                    return m_oFormMenu.getLngLabel(apvname, false);
                }
                else {
                    //if(sResult != 'rejected'){
                    //rtn = "<img src='" + g_BaseImgURL + signtype + "' border=0 style='width:50px;height:50px'>";
                    rtn = "<img src='" + g_BaseImgURL + "Backstamp/" + signtype + "' border=0 style='width:50px;height:50px'>";  //2013-02-25 HIW (기존 서명이미지를 삭제하고 새로등록한경우라면 변경전 예전서명이미지도 나오게하기위해 Backstamp폴더에서 가져옴..)
                    //}else{
                    //			rtn = "<span style='width:50px;height:50px'>&nbsp;</span>";
                    //}
                }
            } else {
                //rtn = (bDisplayDate == false) ? m_oFormMenu.getLngLabel(apvname, false) : m_oFormMenu.getLngLabel(apvname, false) + '<br>' + formatDate(sDate);
                if (sResult == "rejected")  //결재/반송 Default서명이미지 Display (2012-11-16 HIW)
                    rtn = "<img src='" + g_BaseImgURL + "Default/default_Reject.gif' border=0 style='width:30px;height:40px'>";
                else
                    rtn = "<img src='" + g_BaseImgURL + "Default/default_Approval.gif' border=0 style='width:30px;height:40px'>";
            }
            return rtn;
        } else { return rtn; }
    }
}
function interpretResult(strresult, szExtType) {//2008.11
    var sKind = "";
    if (szExtType == "ExtType") {
        if (strresult == "rejected") { sKind = "<font color='red'>&nbsp;" + m_oFormMenu.gLabel_ExtType2 + "</font>"; } //"반려"
        if (strresult == "agreed") { sKind = parent.menu.gLabel_ExtType1; } 		//"합의"
        if (strresult == "disagreed") { sKind = parent.menu.gLabel_ExtType2; } //"이의"	    
    } else {
        if (strresult == "authorized") { sKind = parent.menu.gLabel_apv; } 		//"승인"
        if (strresult == "substituted") { sKind = parent.menu.gLabel_apv; } 		//"승인"
        if (strresult == "completed") { sKind = parent.menu.gLabel_apv; } 			//"승인"
        if (strresult == "reviewed") { sKind = parent.menu.gLabel_apv; } 		//"승인"
        if (strresult == "rejected") { sKind = "<font color='red'>&nbsp;" + m_oFormMenu.gLabel_reject + "</font>"; } 	//"반려"
        if (strresult == "agreed") { sKind = parent.menu.gLabel_agree; } 				//"합의"
        if (strresult == "disagreed") { sKind = parent.menu.gLabel_disagree; } //"이의"
        if (strresult == "reserved") { sKind = parent.menu.gLabel_hold; } 			//"보류"
        if (strresult == "bypassed") { sKind = parent.menu.gLabel_bypass; } 		//"후열"
        if (strresult == "confirmed") { sKind = parent.menu.gLabel_confirm; } 		//"후열"
    }
    return sKind;
}
function interpretKind(strkind, strresult, routetype, allottype, name) {
    var sKind;
    switch (strkind) {
        case "normal": sKind = ""; break; //""
        case "charge": sKind = m_oFormMenu.gLabel_charge; break; 		//"담당"
        case "authorize": sKind = m_oFormMenu.gLabel_authorize; break; 	//"전결"
        case "review": sKind = m_oFormMenu.gLabel_review; break; 		//"후결"
        case "consent": sKind = m_oFormMenu.gLabel_consent; break; 		//""
        case "substitute": sKind = m_oFormMenu.gLabel_substitue; break; 	//"대결"
        case "bypass": sKind = m_oFormMenu.gLabel_bypass; break; 		//"후열"
        case "confirm": sKind = parent.menu.gLabel_confirm; break; 														//"확인"
        case "skip": sKind = "--"; break;
    }
    //normal일 경우 세부설정
    if (strkind == "normal") {
        if (routetype == "assist") {
            switch (allottype) {
                case "parallel":
                    sKind = m_oFormMenu.gLabel_ParallelAssist; //병렬
                    break;
                case "serial":
                    sKind = m_oFormMenu.gLabel_serialAssist;  //순차
                    break;
                default:
                    sKind = m_oFormMenu.gLabel_assist;
            }
        } else if (routetype == "audit") {
            //결재선에서 넘어온 이름을 그대로 사용
            if (name == "개인감사") {
                sKind = m_oFormMenu.gLabel_audit; //감사;
            } else {
                sKind = m_oFormMenu.gLabel_person_audit1; //준법감시;
            }

        } else if (name == "ExtType") {
            sKind = m_oFormMenu.gLabel_ExtType;
        }
    } else {
        if ((strresult == "rejected") && (strkind != "normal")) {
            //sKind=sKind+((getInfo("fmbt") == "HWP")?" 반려":"<br>반려");
            sKind = sKind + ((getInfo("fmbt") == "HWP") ? " " + m_oFormMenu.gLabel_reject : "<br>" + m_oFormMenu.gLabel_reject);
        } else if ((strresult == "rejected") && (strkind == "normal")) {
            sKind = m_oFormMenu.gLabel_reject; //"반려"
        }
    }
    return sKind;
}
function formatDateCVT(sDate) {
    if (sDate == "" || sDate == null)
        return "";
    var szDate = sDate.replace(/-/g, "/").replace(/오후/, "pm").replace(/오전/, "am");
    if (szDate.indexOf("pm") > -1) {
        szDate = szDate.replace("pm ", "");
        var atemp = szDate.split(" ");
        var tmp = parseInt(atemp[1].split(":")[0]) + 12;
        if (tmp > 23 && parseInt(atemp[1].split(":")[1]) > 0) tmp = tmp - 12;
        tmp = dblDigit(tmp);
        var atemp2 = atemp[0].split("/");
        szDate = atemp2[1] + "/" + atemp2[2] + "/" + atemp2[0] + " " + tmp + atemp[1].substring(atemp[1].indexOf(":"), 10);
    } else {
        szDate = szDate.replace("am ", "");
        var atemp = szDate.split(" ");
        var atemp2 = atemp[0].split("/");
        szDate = atemp2[1] + "/" + atemp2[2] + "/" + atemp2[0] + " " + atemp[1];
    }
    var dtDate = new Date(szDate);
    return dtDate.getFullYear() + "-" + dblDigit(dtDate.getMonth() + 1) + "-" + dblDigit(dtDate.getDate()) + " " + dblDigit(dtDate.getHours()) + ":" + dblDigit(dtDate.getMinutes()); //+":"+dblDigit(dtDate.getSeconds());
}

function dblDigit(iVal) { return (iVal < 10 ? "0" + iVal : iVal); }

function formatDate(tDate, sMode) {
    tDate = formatDateCVT(tDate);
    if (sMode == "R") {
        var aRecDate = tDate.split("-");
        if (aRecDate.length > 2) { return aRecDate[0] + "년  " + aRecDate[1] + "월 " + aRecDate[2].substring(0, 2) + "일"; } else { return ""; }
    } else if (sMode == "D") {
        var aRecDate = tDate.split("-");
        if (aRecDate.length > 2) { return aRecDate[0] + "-" + aRecDate[1] + "-" + aRecDate[2].substring(0, 2); } else { return ""; }
    } else if (sMode == "Y") {
        var aRecDate = tDate.split(".");
        if (aRecDate.length > 2) { return aRecDate[0] + "년  " + aRecDate[1] + "월 " + aRecDate[2] + "일"; } else { return ""; }
    } else if (sMode == "A") {
        var aRecDate = tDate.split("-");
        if (aRecDate.length > 2) { return aRecDate[0] + aRecDate[1]; } else { return ""; }
    } else if (sMode == "APV") {//"2012-07-23 13:44"
        var aRecDate = tDate.split("-");
        if (aRecDate.length > 2) {
            var dtDate = new Date(tDate.replace(/-/g, "/").replace(/오후/, "pm").replace(/오전/, "am"));
            return dtDate.getYear() + "-" + dblDigit(dtDate.getMonth() + 1) + "-" + dblDigit(dtDate.getDate()) + " " + dblDigit(dtDate.getHours()) + ":" + dblDigit(dtDate.getMinutes());
        } else { return ""; }
    } else if (sMode == "T") {//"12-07-23 13:44"
        var aRecDate = tDate.split("-");
        if (aRecDate.length > 2) {
            var dtDate = new Date(tDate.replace(/-/g, "/").replace(/오후/, "pm").replace(/오전/, "am"));
            return String(dtDate.getYear()).substring(2, 4) + "-" + dblDigit(dtDate.getMonth() + 1) + "-" + dblDigit(dtDate.getDate()) + " " + dblDigit(dtDate.getHours()) + ":" + dblDigit(dtDate.getMinutes());
        } else { return ""; }
    } else if (sMode == "M") {
        var aRecDate = tDate.split("-");
        if (aRecDate.length > 2) { return aRecDate[0] + "." + aRecDate[1]; } else { return ""; }
    } else {
        var aRecDate = tDate.split("-");
        if (aRecDate.length > 2) { return aRecDate[0] + "-" + aRecDate[1] + "-" + aRecDate[2].substring(0, 2); } else { return ""; }
    }
}
function dblDigit(iVal) { return (iVal < 10 ? "0" + iVal : iVal); }
function formatDate2(sDate) {
    /*			
    if(sDate==null || sDate=="")
    return " ";
    var dtDate = new Date(sDate.replace(/-/g,"/").replace(/오후/,"pm").replace(/오전/,"am"));
    return dtDate.getYear()+"-"+dblDigit(dtDate.getMonth()+1)+"-"+dblDigit(dtDate.getDate())+" "+dblDigit(dtDate.getHours())+":"+dblDigit(dtDate.getMinutes());//+":"+dblDigit(dtDate.getSeconds());
    */
    var tDate = formatDateCVT(sDate);
    return tDate;
}

var gFileArray = new Array();
var gFileNameArray = new Array();
function G_displaySpnAttInfo(bRead) {//수정본
    //debugger;
    var attFiles, fileLoc, szAttFileInfo;
    var displayFileName;
    var re = /_N_/g;
    // 2005.06.16  박형진 추가 (결재완료후 이관 문서 의견,첨부파일 링크 유무를 표현 하기 위해 , G_displaySpnAttInfo())
    ////////////////////////////////////////
    var bReadOnly = false;
    if (bRead != null) bReadOnly = bRead;

    ////////////////////////////////////////
    //2006.12.05 by wolf upload UI 변경
    // 편집 모드인지 확인
    var bEdit = false;
    if (String(window.location).indexOf("_read.htm") > -1) {
        bEdit = false
    } else {
        bEdit = true;
    }
    //if ((getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT" && getInfo("fmnm") != "통신지")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT")||parent.g_szEditable==true){bEdit = true;}  //2007.05.30 박동현 부서합의 재기안시 첨부파일, 연결문서 에디터형태로

    szAttFileInfo = "";
    MultiDownLoadString = "";
    //2006.12.05 by wolf upload UI 변경 End

    if (document.getElementsByName("ATTACH_FILE_INFO")[0].value != "") {
        var r, res;
        var s = document.getElementsByName("ATTACH_FILE_INFO")[0].value;
        res = /^^^/i;
        attFiles = s.replace(res, "");
        var fState;
        var m_oFileList = CreateXmlDocument();
        if (attFiles.indexOf("</fileinfos>") < 0) {
            m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?><fileinfos>" + attFiles + "</fileinfos>");
        } else {
            m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + attFiles);
        }
        var elmRoot, elmList, elm, elmTaskInfo;
        elmRoot = m_oFileList.documentElement;
        if (elmRoot != null) {
            // 변경부분 : 07. 6. 11. JSI
            szAttFileInfo = "";
            elmList = $(elmRoot).find("fileinfo > file");
            $(elmRoot).find("fileinfo > file").each(function(i, elm) {
                var filename = $(elm).attr("name");
                var filesize = $(elm).attr("size");
                var limitSize = (filesize == null) ? "0" : m_oFormMenu.FormatStringToNumber(parseInt(filesize) / 1024);

                displayFileName = $(elm).attr("name").substring(0, $(elm).attr("name").lastIndexOf("."));
                displayFileName = displayFileName.replace(re, "&");
                if ($(elm).attr("state") != null) {
                    fState = $(elm).attr("state");
                }
                else {
                    fState = "";
                }

                if (bEdit) {
                    //szAttFileInfo +="<input type=checkbox id='chkFile' name='_" + elm.getAttribute("name").substring(0, elm.getAttribute("name").lastIndexOf("."))  + "' value='" + elm.getAttribute("name")  + "' style='vertical-align:middle;'>";
                    szAttFileInfo += '<input type=\"checkbox\" id=\"chkFile\" name=\"chkFile\" value=\"' + $(elm).attr("name") + '\" style=\"vertical-align:middle;\">';

                } else {//편집모드가 아닐때만 다중다운로드 문자열 생성

                    MultiDownLoadString += $(elm).attr("location").replace(new RegExp("\\+", "g"), "%2B")
			                                + "|" + $(elm).attr("name").replace(new RegExp("\\+", "g"), "%2B")
			                                + "|" + filesize
			                                + "`";
                }

                //////////////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////
                if ($(elm).attr("location").indexOf(".") > -1) {
                    if (bReadOnly) {
                        //szAttFileInfo +=  displayFileName;
                        if (bReadOnly == "display") {//이민지(2010-05-06): 파일 용량을 MB 이상도 표현하기 위해 수정
                            if (limitSize >= 1024) {
                                limitSize = limitSize / 1024;
                                limitSize = parseFloat(limitSize).toFixed(1);
                                szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                szAttFileInfo += "<b>" + $(elm).attr("name") + " (" + limitSize + "MB)" + "</b>&nbsp;";
                            }
                            else {
                                szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                szAttFileInfo += "<b>" + $(elm).attr("name") + " (" + limitSize + "KB)" + "</b>&nbsp;";
                            }
                        }
                        else {
                            szAttFileInfo += displayFileName;
                        }
                    }
                    else {
                        //szAttFileInfo += "<a name=\""+displayFileExtendName +  "\" href=\"#\"  onclick='javascript:readcheck("+i+",\""+elm.getAttribute("location").replace("+","%2B")+"\",\""+displayFileExtendName +  "\")'>" + displayFileName + "</a>";
                        if (getInfo("loct") == "TEMPSAVE" || getInfo("mode") == "ADMINEDMS") //2006.10
                        {
                            if (limitSize >= 1024) {
                                limitSize = limitSize / 1024;
                                limitSize = parseFloat(limitSize).toFixed(1);
                                szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
								+ "&nbsp;<a href=\"javascript:PopListSingle(\'" + String(i) + "\');\"  ><b>" + $(elm).attr("name")
								+ " (" + limitSize + "MB)" + "</b></a>&nbsp;";
                            }
                            else {
                                szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
								+ "&nbsp;<a href=\"javascript:PopListSingle('" + String(i) + "');\"  ><b>" + $(elm).attr("name")
								+ " (" + limitSize + "KB)" + "</b></a>&nbsp;";
                            }
                            gFileArray[i] = $(elm).attr("location").replace(new RegExp("\\+", "g"), "%2B") + ":" + filesize;
                            gFileNameArray[i] = $(elm).attr("name");
                        }
                        else {
                            //2006.04.17 사원 이후창 수정
                            //covi download컴포넌트 추가 관련
                            //downloadfile() 함수를 바로 호출하도록 한다
                            if (fState == "" || fState == "OLD") {
                                if (limitSize >= 1024) {
                                    limitSize = limitSize / 1024;
                                    limitSize = parseFloat(limitSize).toFixed(1);
                                    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
									+ "&nbsp;<a href=\"javascript:PopListSingle('" + String(i) + "');\"  ><b>" + $(elm).attr("name")
									+ " (" + limitSize + "MB)" + "</b></a>&nbsp;";
                                }
                                else {
                                    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
									+ "&nbsp;<a href=\"javascript:PopListSingle('" + String(i) + "');\"  ><b>" + $(elm).attr("name")
									+ " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
                                }
                                gFileArray[i] = $(elm).attr("location").replace(new RegExp("\\+", "g"), "%2B") + ":" + filesize;
                                gFileNameArray[i] = $(elm).attr("name");
                            }
                            else if (fState == "NEW") {
                                if (limitSize >= 1024) {
                                    limitSize = limitSize / 1024;
                                    limitSize = parseFloat(limitSize).toFixed(1);
                                    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
									+ "&nbsp;<a href=\"javascript:PopListSingle('" + String(i) + "');\"  ><b>" + $(elm).attr("name")
									+ " (" + limitSize + "MB)" + "</b></a>&nbsp;";
                                }
                                else {
                                    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
									+ "&nbsp;<a href=\"javascript:PopListSingle('" + String(i) + "');\"  ><b>" + $(elm).attr("name")
									+ " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
                                }
                                gFileArray[i] = $(elm).attr("location").replace(new RegExp("\\+", "g"), "%2B") + ":" + filesize;
                                gFileNameArray[i] = $(elm).attr("name");
                            }
                            else {//삭제일경우
                                szAttFileInfo += "";
                                gFileArray[i] = "";
                                gFileNameArray[i] = "";
                            }
                        }
                    }
                }
                else {
                    if (limitSize >= 1024) {
                        limitSize = limitSize / 1024;
                        limitSize = parseFloat(limitSize).toFixed(1);
                        szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\"" + m_KMWebAttURL + $(elm).attr("location") + "\" target = \"_blank\" ><b>" + $(elm).attr("name") + " (" + limitSize + "MB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
                    }
                    else {
                        szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\"" + m_KMWebAttURL + $(elm).attr("location") + "\" target = \"_blank\" ><b>" + $(elm).attr("name") + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
                    }
                }
                //////////////////////////////////////////////////////////////////////////////

                if (i < elmList.length - 1)
                    //szAttFileInfo += ", ";
                    szAttFileInfo += "<br>";  //2013-02-25 HIW
            }
			);
            //2006.12.05 by wolf upload UI 변경
            // 편집 모드인지 확인해서 편집모드이면 삭제버튼 display
            if (bEdit) {
                if (document.getElementsByName("ATTACH_FILE_INFO")[0].value != "") {
                    m_oFormMenu.makeDictionary(document.getElementsByName("ATTACH_FILE_INFO")[0].value);
                    szAttFileInfo += "<a href='javascript:deleteitemFile();'><img src='/GWImages/Common/attachicon/del.gif' border='0' style='vertical-align:middle;' /></a>";
                }
            }
        }

        if (MultiDownLoadString != "") {//debugger;
            if (bReadOnly == "display") {
                document.getElementById("AttFileInfo").parentNode.children[0].innerHTML = "첨부파일";
            } else {
                if (!window.ActiveXObject) {
                } else {
                    if (m_oFormMenu.gFileAttachType == "1") { //시스템 사용 첨부파일 컴포턴트 0 : CoviFileTrans, 1:DEXTUploadX
                        document.getElementById("AttFileInfo").parentNode.children[0].innerHTML = "<a href='javascript:DownloadDEXTUpload(window);'>첨부파일<img src='/GwImages/BLUE/Covi/common/icon/btn_icon01_down.gif' width='12' height='13' hspace='7' align='absmiddle'  border='0' /></a>";
                    } else {
                        //document.getElementById("AttFileInfo").parentNode.children[0].innerHTML = "<a href='javascript:DownloadCOVIUpload();'>첨부파일<img src='/GwImages/BLUE/Covi/common/icon/btn_icon01_down.gif' width='12' height='13' hspace='7' align='absmiddle'  border='0' /></a>";
                        //첨부파일건수 표시 (2013-02-25 HIW)
                        var sAttFileTitle = "<a href='javascript:DownloadCOVIUpload();'>첨부파일<img src='/GwImages/BLUE/Covi/common/icon/btn_icon01_down.gif' width='12' height='13' hspace='7' align='absmiddle'  border='0' /></a>";
                        if($(elmRoot).find("fileinfo > file").length > 0)
                            sAttFileTitle += "<br>( " + $(elmRoot).find("fileinfo > file").length + m_oFormMenu.gLabel_Number + " )";
                        document.getElementById("AttFileInfo").parentNode.children[0].innerHTML = sAttFileTitle;

                    }
                }
            }
        }
        document.getElementById("AttFileInfo").innerHTML = szAttFileInfo;
        if (parent.frames.document.getElementById("fileview") != null) {
            parent.frames.document.getElementById("fileview").document.getElementById("AttFileInfo").innerHTML = document.getElementById("AttFileInfo").innerHTML; parent.frames.document.getElementById("fileview").setMultiDownLoad(MultiDownLoadString);
        }
    } else {

        document.getElementById("AttFileInfo").innerHTML = szAttFileInfo;
        if (parent.frames.document.getElementById("fileview") != null) {
            parent.frames.document.getElementById("fileview").document.getElementById("AttFileInfo").innerHTML = document.getElementById("AttFileInfo").innerHTML; parent.frames.document.getElementById("fileview").setMultiDownLoad(MultiDownLoadString);
        }
    }
    if (!window.ActiveXObject) {
        //document.getElementById("AttFileInfo").parentNode.children[0].innerHTML = m_oFormMenu.gLabel_AttachList;
        //첨부파일건수 표시 (2013-02-25 HIW)
        var sAttFileTitle = m_oFormMenu.gLabel_AttachList;
        if ($(elmRoot).find("fileinfo > file").length > 0)
            sAttFileTitle += "<br>( " + $(elmRoot).find("fileinfo > file").length + m_oFormMenu.gLabel_Number + " )";
        document.getElementById("AttFileInfo").parentNode.children[0].innerHTML = sAttFileTitle;
    }
}

function DownloadCOVIUpload() {
    var winstyle = "height=360, width=275, status=no, resizable=no, help=no, scroll=no";
    var winpath = "/CoviWeb/SiteReference/Common/covi_fileListdown.aspx";

    var path = winpath + "?FileInfo=" + escape(MultiDownLoadString);    //한글파일명 처리

    var strNewFearture = ModifyWindowFeature(winstyle);
    window.open(path, 'CoviDownLoad', strNewFearture);
    //window.open(path, 'CoviDownLoad', winstyle)
}

function DownloadDEXTUpload(oWindows) {
    var winstyle = "dialogHeight:445px;dialogWidth:445px;status:no;resizable:no;help:no;scroll:no";
    var winpath = "/CoviWeb/SiteReference/Common/FileDownloadMonitor.aspx";
    var rgParams = new Array();

    rgParams["oWin"] = oWindows;
    rgParams["oList"] = MultiDownLoadString;

    return oWindows.showModalDialog(winpath, rgParams, winstyle);
}

//CoviFileTrans
var MultiDownLoadString; //일괄다운로드용 문자열
function G_displaySpnAttInfo2(bRead) {//수정본
    //debugger;
    var attFiles, fileLoc, szAttFileInfo;
    var displayFileName;
    var re = /_N_/g;
    // 추가 (결재완료후 이관 문서 의견,첨부파일 링크 유무를 표현 하기 위해 , G_displaySpnAttInfo())
    ////////////////////////////////////////
    var bReadOnly = false;
    if (bRead != null) bReadOnly = bRead;

    ////////////////////////////////////////
    //upload UI 변경
    // 편집 모드인지 확인
    var bEdit = false;
    if (String(window.location).indexOf("_read.htm") > -1) {
        bEdit = false
    } else {
        bEdit = true;
    }
    //if ((getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT" && getInfo("fmnm") != "통신지")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT")||parent.g_szEditable==true){bEdit = true;}  //2007.05.30 박동현 부서합의 재기안시 첨부파일, 연결문서 에디터형태로

    szAttFileInfo = "";
    MultiDownLoadString = "";
    //upload UI 변경 End
    if (document.getElementsByName("ATTACH_FILE_INFO")[0].value != "") {
        var r, res;
        var s = document.getElementsByName("ATTACH_FILE_INFO")[0].value;
        res = /^^^/i;
        attFiles = s.replace(res, "");


        var fState;
        var m_oFileList = CreateXmlDocument();
        m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?><fileinfos>" + attFiles + "</fileinfos>");
        var elmRoot, elmList, elm, elmTaskInfo;
        elmRoot = m_oFileList.documentElement;
        if (elmRoot != null) {
            elmList = elmRoot.selectNodes("fileinfo/file");

            // 변경부분 :
            szAttFileInfo = "";

            for (var i = 0; i < elmList.length; i++) {
                elm = elmList.nextNode();
                var filename = elm.getAttribute("name");
                var filesize = elm.getAttribute("size");
                //var limitSize = m_oFormMenu.FormatStringToNumber(parseInt(filesize) / 1024) ;
                var limitSize = (filesize == null) ? "0" : m_oFormMenu.FormatStringToNumber(parseInt(filesize) / 1024);

                displayFileName = elm.getAttribute("name").substring(0, elm.getAttribute("name").lastIndexOf("."));
                displayFileName = displayFileName.replace(re, "&");
                if (elm.getAttribute("state") != null) {

                    fState = elm.getAttribute("state");
                }
                else {
                    fState = "";
                }

                //upload UI 변경
                if (bEdit) {
                    //szAttFileInfo +="<input type=checkbox id='chkFile' name='_" + elm.getAttribute("name").substring(0, elm.getAttribute("name").lastIndexOf("."))  + "' value='" + elm.getAttribute("name")  + "' style='vertical-align:middle;'>";
                    szAttFileInfo += '<input type=\"checkbox\" id=\"chkFile\" name=\"chkFile\" value=\"' + elm.getAttribute("name") + '\" style=\"vertical-align:middle;\">';
                } else {//편집모드가 아닐때만 다중다운로드 문자열 생성
                    MultiDownLoadString += (MultiDownLoadString == "" ? escape(elm.getAttribute("location").replace(new RegExp("\\+", "g"), "%2B")).replace("'", "\\%27") + ":" + filesize : ";" + escape(elm.getAttribute("location").replace(new RegExp("\\+", "g"), "%2B")) + ":" + filesize);
                }
                //debugger;
                //////////////////////////////////////////////////////////////////////////////
                if (elm.getAttribute("location").indexOf(".") > -1) {
                    if (bReadOnly) {
                        //szAttFileInfo +=  displayFileName;
                        //szAttFileInfo +=  displayFileName;
                        if (bReadOnly == "display") {//이민지(2010-05-06): 파일 용량을 MB 이상도 표현하기 위해 수정
                            if (limitSize >= 1024) {
                                limitSize = limitSize / 1024;
                                limitSize = parseFloat(limitSize).toFixed(1);
                                szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                szAttFileInfo += "<b>" + elm.getAttribute("name") + " (" + limitSize + "MB)" + "</b>&nbsp;";
                            }
                            else {
                                szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                szAttFileInfo += "<b>" + elm.getAttribute("name") + " (" + limitSize + "KB)" + "</b>&nbsp;";
                            }
                        }
                        else {
                            szAttFileInfo += displayFileName;
                        }
                    }
                    else {
                        //szAttFileInfo += "<a name=\""+displayFileExtendName +  "\" href=\"#\"  onclick='javascript:readcheck("+i+",\""+elm.getAttribute("location").replace("+","%2B")+"\",\""+displayFileExtendName +  "\")'>" + displayFileName + "</a>";
                        if (getInfo("loct") == "TEMPSAVE" || getInfo("mode") == "ADMINEDMS") //2006.10
                        {
                            if (limitSize >= 1024) {
                                limitSize = limitSize / 1024;
                                limitSize = parseFloat(limitSize).toFixed(1);
                                szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
								+ "&nbsp;<a href=\"javascript:PopListSingle('" + String(i) + "');\"  ><b>" + elm.getAttribute("name")
								+ " (" + limitSize + "MB)" + "</b></a>&nbsp;";
                            }
                            else {
                                szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
								+ "&nbsp;<a href=\"javascript:PopListSingle('" + String(i) + "');\"  ><b>" + elm.getAttribute("name")
								+ " (" + limitSize + "KB)" + "</b></a>&nbsp;";
                            }
                            gFileArray[i] = elm.getAttribute("location").replace(new RegExp("\\+", "g"), "%2B").replace("'", "\\%27") + ":" + filesize;
                            gFileNameArray[i] = elm.getAttribute("name");
                        }
                        else {
                            //covi download컴포넌트 추가 관련
                            //downloadfile() 함수를 바로 호출하도록 한다
                            if (fState == "" || fState == "OLD") {
                                if (limitSize >= 1024) {
                                    limitSize = limitSize / 1024;
                                    limitSize = parseFloat(limitSize).toFixed(1);
                                    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
									+ "&nbsp;<a href=\"javascript:PopListSingle('" + String(i) + "');\"  ><b>" + elm.getAttribute("name")
									+ " (" + limitSize + "MB)" + "</b></a>&nbsp;";
                                }
                                else {
                                    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
									+ "&nbsp;<a href=\"javascript:PopListSingle('" + String(i) + "');\"  ><b>" + elm.getAttribute("name")
									+ " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
                                }
                                gFileArray[i] = elm.getAttribute("location").replace(new RegExp("\\+", "g"), "%2B").replace("'", "\\%27") + ":" + filesize;
                                gFileNameArray[i] = elm.getAttribute("name");
                            }

                            else if (fState == "NEW") {
                                if (limitSize >= 1024) {
                                    limitSize = limitSize / 1024;
                                    limitSize = parseFloat(limitSize).toFixed(1);
                                    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
									+ "&nbsp;<a href=\"javascript:PopListSingle('" + String(i) + "');\"  ><b>" + elm.getAttribute("name")
									+ " (" + limitSize + "MB)" + "</b></a>&nbsp;";
                                }
                                else {
                                    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
									+ "&nbsp;<a href=\"javascript:PopListSingle('" + String(i) + "');\"  ><b>" + elm.getAttribute("name")
									+ " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
                                }
                                gFileArray[i] = elm.getAttribute("location").replace(new RegExp("\\+", "g"), "%2B").replace("'", "\\%27") + ":" + filesize;
                                gFileNameArray[i] = elm.getAttribute("name");
                            }
                            else {//삭제일경우
                                szAttFileInfo += "";
                            }
                        }
                    }
                }
                else {
                    if (limitSize >= 1024) {
                        limitSize = limitSize / 1024;
                        limitSize = parseFloat(limitSize).toFixed(1);
                        szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\"" + m_KMWebAttURL + elm.getAttribute("location") + "\" target = \"_blank\" ><b>" + elm.getAttribute("name") + " (" + limitSize + "MB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
                    }
                    else {
                        szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\"" + m_KMWebAttURL + elm.getAttribute("location") + "\" target = \"_blank\" ><b>" + elm.getAttribute("name") + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
                    }
                    //szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\""+m_KMWebAttURL+elm.getAttribute("location")+ "\" target = \"_blank\" ><b>" + elm.getAttribute("name") + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
                }
                //////////////////////////////////////////////////////////////////////////////

                if (i < elmList.length - 1)
                    szAttFileInfo += ", ";
            }

            //upload UI 변경
            // 편집 모드인지 확인해서 편집모드이면 삭제버튼 display
            if (bEdit) {
                if (document.all['ATTACH_FILE_INFO'].value != "") {
                    m_oFormMenu.makeDictionary(document.all['ATTACH_FILE_INFO'].value);
                    szAttFileInfo += "<a href='javascript:deleteitemFile();'><img src='/GWImages/Common/attachicon/del.gif' border='0' style='vertical-align:middle;' /></a>";
                }
            }

        }

        document.getElementById("AttFileInfo").innerHTML = szAttFileInfo;
        if (parent.frames.document.getElementById("fileview") != null) {
            parent.frames.document.getElementById("fileview").document.getElementById("AttFileInfo").innerHTML = document.getElementById("AttFileInfo").innerHTML; parent.frames.document.getElementById("fileview").setMultiDownLoad(MultiDownLoadString);
        }
    } else {
        document.getElementById("AttFileInfo").innerHTML = szAttFileInfo;
        if (parent.frames.document.getElementById("fileview") != null) {
            parent.frames.document.getElementById("fileview").document.getElementById("AttFileInfo").innerHTML = document.getElementById("AttFileInfo").innerHTML; parent.frames.document.getElementById("fileview").setMultiDownLoad(MultiDownLoadString);
        }
    }
    if (!window.ActiveXObject) document.getElementById("AttFileInfo").parentNode.children[0].innerHTML = m_oFormMenu.gLabel_AttachList;

}
function PopListSingle(SingleDownLoadString) {
    /*parameter 변경 기존 url에서 index로
    if (!window.ActiveXObject) {
    parent.frames[3].src ='/CoviWeb/SiteReference/Common/covi_filedownloadbasic.aspx?usercode='+parent.getInfo("usid")+"&filepath=" + SingleDownLoadString ;
    }else{
    parent.download.location.href ='/CoviWeb/SiteReference/Common/covi_fileSingledown.aspx?filepath=' + toUTF8(SingleDownLoadString) ;//usercode='+parent.getInfo("usid")+"&
    }
    */
    if (!window.ActiveXObject) {
        parent.download.location.href = '../fileattach/htmldown.aspx?filename=' + gFileNameArray[parseInt(SingleDownLoadString)] + "&location=" + gFileArray[parseInt(SingleDownLoadString)];
    } else {
        //2014-06-09 hyh 수정
        //parent.download.location.href = '/CoviWeb/SiteReference/Common/covi_fileSingledown.aspx?filepath=' + toUTF8(gFileArray[parseInt(SingleDownLoadString)]); //usercode='+parent.getInfo("usid")+"&
        //parent.download.location.href = '../fileattach/htmldown.aspx?filename=' + escape(gFileNameArray[parseInt(SingleDownLoadString)]) + "&location=" + gFileArray[parseInt(SingleDownLoadString)];
          parent.download.location.href = '../fileattach/htmldown.aspx?filename=' + toUTF8(gFileNameArray[parseInt(SingleDownLoadString)]) + "&location=" + gFileArray[parseInt(SingleDownLoadString)];
        //2014-06-09 hyh 수정 끝
    }
}

function deleteitemFile() {
    m_oFormMenu.deleteitem();
}

//첨부경로이미지 
function getAttachImage(image) {
    image = image.toLowerCase();
    if (image == "alz" || image == "asf" || image == "asp" || image == "avi" ||
        image == "bmp" || image == "cab" || image == "css" || image == "csv" ||
        image == "dll" || image == "doc" || image == "exe" || image == "gif" ||
        image == "zip" || image == "doc" || image == "ppt" || image == "dll" ||
        image == "htm" || image == "html" || image == "inf" || image == "iso" ||
        image == "jpg" || image == "js" || image == "lzh" || image == "mid" ||
        image == "mp3" || image == "mpeg" || image == "mpg" || image == "pdf" ||
        image == "rar" || image == "reg" || image == "sys" || image == "txt" ||
        image == "htm" || image == "html" || image == "inf" || image == "iso" ||
        image == "vbs" || image == "wav" || image == "wma" || image == "wmv" ||
        image == "xls" || image == "xml" || image == "xsl" || image == "zip" ||
        image == "xlsx" || image == "docx" || image == "pptx" || image == "hwp") {
        var imageurl = "<img src='" + m_oFormMenu.g_imgBasePath + "/Covi/Common/icon/icon_filetype_" + image + ".gif' style='vertical-align:middle;' />";
    }
    else {
        var imageurl = "<img src='" + m_oFormMenu.g_imgBasePath + "/Covi/Common/icon/icon_filetype_unknown.gif' style='vertical-align:middle;' />";
    }
    return imageurl;
}


// 한글을 포함한 문자열에서 문자열의 길이를 반환한다. 
function getLengthOfString(str) {
    var len = str.length;
    var han = 0;
    var res = 0;

    for (i = 0; i < len; i++) {
        var a = str.charCodeAt(i);
        if (a > 128) han++;
    }
    res = (len - han) + (han * 2);
    return res;
}
//첨부파일 읽기 확인시 사용
function makearray(n) {
    this.length = n;
    for (var i = 0; i < n; i++)
        this[i] = 0;
    return this;
}
//첨부파일 읽기 확인시 사용
function readcheck(i) { readCheck[i] = "1"; }
function setDefaultBody(sText) {
    if (sText == null || sText == "") return;
    switch (getInfo("fmbt")) {
        case "DHTML":
            try {
                Wec.MIMEValue = sText;
            } catch (e) {
                alert(e.message);
                tbContentElement.DocumentHTML = sText;
            }
            break;
        case "HWP":
            HwpCtrl.SetTextFile(sText, "HWP", ""); break;
    }
}
function viewSummary() { //문서정보관련(요약전)
    openWindow("doc_summary.htm", "", 380, 280, "fix");
}
function insertDicFileInfo(fileName) { m_oDicFileInfo.add(fileName, document.getElementsByName("filelocation")[0].value + fileName); }
function event_noop() { return (false); }
function getReceiveNo() {
    var strRecDeptNo = document.getElementsByName("RECEIVE_NO")[0].value;
    if (strRecDeptNo != "") {
        var iFIndex = strRecDeptNo.indexOf('[' + getInfo("dpid") + ']');
        if (iFIndex != -1) {
            var iLIndex = strRecDeptNo.indexOf(';', iFIndex);
            var iMIndex = strRecDeptNo.indexOf(']', iFIndex);
            return strRecDeptNo.substring(iMIndex + 1, iLIndex);
        } else { return ""; }
    } else { return ""; }
}
function DeCodeRecList(sRecList) {
    var r, res, sRecDept;
    var s = sRecList;
    res = /@/i;
    sRecDept = s.replace(res, "");
    m_oRecList.loadXML("<?xml version='1.0' encoding='utf-8'?><groups>" + sRecDept + "</groups>");
    var elmList = m_oRecList.documentElement.selectNodes("group");
    sRecDept = "";
    if (elmList.length != 0) {
        for (var i = 0; i < elmList.length; i++) {
            sRecDept += "@";
            var elm = elmList.nextNode();
            var elmnodelist = elm.selectNodes("item/AN");
            var sRecDeptNode = "";
            for (var j = 0; j < elmnodelist.length; j++) {
                var elmnode = elmnodelist.nextNode();
                sRecDeptNode += ";" + elmnode.text;
            }
            if (sRecDeptNode.length > 0) sRecDeptNode = sRecDeptNode.substring(1);
            sRecDept += sRecDeptNode;
        }
        if (sRecDept.length > 0) sRecDept = sRecDept.substring(1);
    }
    if (sRecList.length > 1) {//수신처지정없음
        if (sRecList.substr(0, 1) == '@') sRecDept = "@" + sRecDept;
    }
    return sRecDept;
}


//수신처, 발신처 부서 결재선 표현 - PC용 
function getRequestApvList(elmList, elmVisible, sMode, bReceive, sApvTitle, bDisplayCharge) {//신청서html
   // debugger;
    var elm, elmTaskInfo, elmReceive, elmApv;
    var strDate;
    var j = 0;
    var Apvlines = "";
    var ApvPOSLines = ""; //부서명 or 발신부서,신청부서,담당부서,수신부서 등등 으로 표기<tr>
    var ApvTitleLines = "";
    var ApvSignLines = ""; //결재자 사인이미지 들어가는 부분<tr>
    var ApvApproveNameLines = ""; //결재자 성명 및 contextmenu 및 </br>붙임 후 결재일자 표기<tr>
    var ApvDateLines = "<tr>"; //사용안함
    var ApvCmt = "<tr>";
    var strColTD = elmList.length - elmVisible.length;
    var strwidth = "90"; //String(100/strColTD);
    var strAuthorizeDate = "";
    var strAuthorizeSign = "";  //2013-03-06 HIW
    var strAuthorizeName = "";  //2013-03-06 HIW
    //debugger;  //1212
    for (var i = 0; i < elmList.length - j; i++) {
        elm = elmList.nextNode();
        elmTaskInfo = elm.selectSingleNode("taskinfo");
        if (elmTaskInfo.getAttribute("kind") != "conveyance") {
            //첫번째열 타이틀 HIW
            //자동결재선에 따라 부서표시 수정부분 추가
            if (i == 0) {
                if (sApvTitle != "" && sApvTitle != undefined) {
                    sApvTitle = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false).replace(/-/gi, "<br/>");
                }
                if (bReceive) { //담당부서 결재선
                    if (sApvTitle != "") {
                        //ApvPOSLines += "<td rowspan='4' width='25' height='100' align='center' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' nowrap='f'>"+(sApvTitle==undefined?m_oFormMenu.gLabel_management+"<br>"+m_oFormMenu.gLabel_dept:sApvTitle)+"</td>";}
                        //ApvPOSLines += "<th class='tit'>" + (sApvTitle == undefined ? m_oFormMenu.gLabel_management + "<br>" + m_oFormMenu.gLabel_dept : sApvTitle) + "</th>";
                        ApvPOSLines += "<th class='tit'>" + m_oFormMenu.gLabel_Acceptdept + "</th>";  //수신부서 HIW
                    }
                } else { //debugger;
                    if (sApvTitle != "") {
                        if(getInfo("scDRec")=="0" && getInfo("scChgr")=="0" && getInfo("scPRec")=="0" && getInfo("scChgrOU")=="0" && getInfo("scIPub")=="0" && getInfo("scGRec")=="0")  //품의프로세스인 경우 (HIW)
                            ApvPOSLines += "<th class='tit'>" + m_oFormMenu.gLabel__app + "</th>";  //결재 HIW
                        else {
                            //ApvPOSLines += "<td rowspan='4' width='25' height='100' align='center' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' nowrap='f'>"+(sApvTitle==undefined?m_oFormMenu.gLabel_request+"<br>"+m_oFormMenu.gLabel_dept:sApvTitle)+"</td>";}
                            //ApvPOSLines += "<th class='tit'>" + (sApvTitle == undefined ? m_oFormMenu.gLabel_request + "<br>" + m_oFormMenu.gLabel_dept : sApvTitle) + "</th>";
                            //ApvPOSLines += "<th class='tit'>" + m_oFormMenu.gLabel_Send_Dept + "</th>";  //발신부서 HIW
                            ApvPOSLines += "<th class='tit'>" + GetSendDeptLang() + "</th>";  //발신부서 HIW
                        }
                    }
                }
            }
         
            //
            if ((elmTaskInfo.getAttribute("visible") != "n")) //결재선 숨기기한 사람 숨기기(bDisplayCharge && i==0 ) ||
            {
                if (elmTaskInfo.getAttribute("kind") == 'charge') {
                    // kckangy update 2005.02.26
                    if (bReceive && elmList.length == 1) {
                        var temp_charge = m_oFormMenu.gLabel_charge;  //"담당"
                    }
                    else {
                        var temp_charge = m_oFormMenu.gLabel_charge_apvline;  //"기안"
                    }
                    //ApvPOSLines += "<td height='20'  width='"+strwidth+"' align='center' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + temp_charge + "</td>";
                    //첫번째행(기안) 
                    ApvTitleLines += "<td><table class='table_1_1' summary='서명' cellpadding='0' cellspacing='0'><tr><th width='" + strwidth + "'>" + temp_charge + "</th></tr>";
                }
                else {  //debugger;
                    var sTitle = "";
                    try {
                        if (elm.getAttribute("stampRights") == "Y")  //인장권자인 경우 직책대신 "인장권자"로 표시 (HIW)
                            sTitle = m_oFormMenu.gLabel_StampRighter;
                        else {
                            //sTitle = elm.getAttribute("position");
                            sTitle = elm.getAttribute("title");
                            sTitle = m_oFormMenu.getLngLabel(sTitle, true);
                        }
                    } catch (e) {
                        if (elm.nodeName == "role") {
                            sTitle = elm.getAttribute("name");
                        }
                    }
                    if (sTitle == m_oFormMenu.gLabel_charge_person) {
                        sTitle = m_oFormMenu.gLabel_charge; //"담당"
                    }
                    //ApvPOSLines += "<td height='20'  width='"+strwidth+"' align='center' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + sTitle +"</td>";
                    //첫번째행(직책)
                    ApvTitleLines += "<td><table class='table_1_1' summary='서명' cellpadding='0' cellspacing='0'><tr><th width='" + strwidth + "'>" + sTitle + "</th></tr>";
                }

                //날짜행 시작	
                ApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>";

                //서명행 시작
                //ApvSignLines += "<td height='50' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>";
                ApvSignLines += "<tr><td height='50' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>";

                //결재자명 시작
                //ApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>";
                //ApvApproveNameLines += "<tr><td class='la'>";
                ApvApproveNameLines += "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;' align='center'>";  //HIW

                strDate = elmTaskInfo.getAttribute("datecompleted");
                if (strDate == null) {
                    strDate = "";
                    ApvCmt += "&nbsp;";
                }
                else {
                    var assistcmt = elm.selectSingleNode("taskinfo/comment");
                    if (assistcmt != null) {
                        aryComment[i] = assistcmt.text;
                    } else {
                        aryComment[i] = "";
                    }

                    // 수신,발신처 있을경우의 문서 이관시 '의견' 란 링크 삭제
                    if (m_oFormMenu.m_CmtBln == false) { ApvCmt += (assistcmt == null) ? "&nbsp;" : m_oFormMenu.gLabel_comment; }
                    else
                    { ApvCmt += (assistcmt == null) ? "&nbsp;" : "<a href=\'#\' onclick=\'viewComment(\"" + i + "\")\'>" + m_oFormMenu.gLabel_comment + "</a>"; }
                }

                var sCode = "";
                var elmtemp;
                if (elm.nodeName == "role")
                    try { sCode = elm.selectSingleNode("person").getAttribute("code"); elmtemp = elm.selectSingleNode("person"); } catch (e) { }
                else
                    sCode = elm.getAttribute("code");

                
                var elmname = (elmtemp != null) ? elmtemp : elm;
                /*
                switch (elmTaskInfo.getAttribute("kind")) {
                    case "authorize":
                        ApvSignLines += m_oFormMenu.gLabel_authorize + interpretResult(elmTaskInfo.getAttribute("result")); //전결
                        //ApvApproveNameLines += "&nbsp;<br />";	
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;<br />" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + interpretResult(elmTaskInfo.getAttribute("result")) + "<br />";
                        ApvApproveNameLines += (strDate == "") ? "<span class='txt_gn11_blur'>&nbsp;</span>" : "<span class='txt_gn11_blur'>" + formatDate(strDate, "T") + "</span>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        LastApv = "/";
                        LastApvName = m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + interpretResult(elmTaskInfo.getAttribute("result")) + "<br />"; ;
                        LastDate = formatDate(strDate, "T");
                        break;
                    case "substitute":
                        if (strDate == "") { ApvSignLines += m_oFormMenu.gLabel_substitue; } else { ApvSignLines += "<span class='txt_gn11_blur'>" + m_oFormMenu.gLabel_substitue + "</span>" + getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); } //"대결"
                        ApvApproveNameLines += getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + interpretResult(elmTaskInfo.getAttribute("result")) + "<br />";
                        ApvApproveNameLines += (strDate == "") ? "<span class='txt_gn11_blur'>&nbsp;</span>" : "<span class='txt_gn11_blur'>" + formatDate(strDate, "T") + "</span>";
                        ApvDateLines += formatDate(strDate);
                        LastApv = "";
                        LastApvName = "";
                        LastDate = "";
                        break;
                    case "skip":
                        ApvSignLines += "/";
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;<br />" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + interpretResult(elmTaskInfo.getAttribute("result")) + "<br />";
                        ApvApproveNameLines += (strDate == "") ? "<span class='txt_gn11_blur'>&nbsp;</span>" : "<span class='txt_gn11_blur'>" + formatDate(strDate, "T") + "</span>";
                        ApvDateLines += "&nbsp;";
                        break;
                    case "bypass":
                        ApvSignLines += (LastApv == "") ? m_oFormMenu.gLabel_bypass : LastApv; //"후열"							
                        //ApvApproveNameLines += (LastApvName=="")? getPresence(sCode, i+sCode, elmname.getAttribute("sipaddress"))+m_oFormMenu.getLngLabel(elmname.getAttribute("name"),false):LastApvName;	

                        ApvApproveNameLines += ((LastApvName == "") ? getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) : LastApvName) + interpretResult(elmTaskInfo.getAttribute("result")) + "<br />";
                        ApvApproveNameLines += (LastDate == "") ? "<span class='txt_gn11_blur'>" + formatDate(strDate) + "</span>" : "<span class='txt_gn11_blur'>" + LastDate + "</span>";

                        //ApvDateLines += (LastDate =="")?formatDate(strDate):LastDate ;
                        break; //"후열"
                    case "review":
                        ApvSignLines += (strDate == "") ? m_oFormMenu.gLabel_review : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); //후결
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;<br />" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + interpretResult(elmTaskInfo.getAttribute("result")) + "<br />";
                        ApvApproveNameLines += (strDate == "") ? "<span class='txt_gn11_blur'>&nbsp;</span>" : "<span class='txt_gn11_blur'>" + formatDate(strDate, "T") + "</span>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        break;
                    case "charge":
                        ApvSignLines += (strDate == "") ? m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true);
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;;<br />" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + interpretResult(elmTaskInfo.getAttribute("result")) + ";<br />";
                        ApvApproveNameLines += (strDate == "") ? "<span class='txt_gn11_blur'>&nbsp;</span>" : "<span class='txt_gn11_blur'>" + formatDate(strDate, "T") + "</span>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        break;
                    default:
                        ApvSignLines += (strDate=="")?m_oFormMenu.getLngLabel(elm.getAttribute("name"),false): getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"), true);
                        ApvApproveNameLines += (strDate=="")?"&nbsp;<br />":  getPresence(sCode, i+sCode, elmname.getAttribute("sipaddress"))+m_oFormMenu.getLngLabel(elmname.getAttribute("name"),false)+interpretResult(elmTaskInfo.getAttribute("result"))+"<br />";
                        ApvApproveNameLines += (strDate=="")?"<span class='txt_gn11_blur'>&nbsp;</span>": "<span class='txt_gn11_blur'>"+ formatDate(strDate,"T")+"</span>";
                        ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
                }
                */
                //debugger;
                //이수그룹 결재선으로 수정 (2012-11-08  HIW)
                var sResult = "";
                if (elmTaskInfo.getAttribute("result") == "rejected")  //반송인경우만 상태 표시
                    sResult = interpretResult(elmTaskInfo.getAttribute("result"));
                switch (elmTaskInfo.getAttribute("kind")) { 
                    case "authorize":  //전결
                        ApvSignLines += m_oFormMenu.gLabel_authorize + interpretResult(elmTaskInfo.getAttribute("result")); 
                        //ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + sResult + "</td></tr>";
                        //ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
                        ApvApproveNameLines += "&nbsp;</td></tr>";  //HIW
                        ApvApproveNameLines += "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>";  //HIW
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        LastApv = "/";
                        LastApvName = m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + sResult + "<br />";
                        LastDate = formatDate(strDate, "T");

                        //추가 2013-03-06 HIW
                        strAuthorizeDate = strDate;
                        strAuthorizeName = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);  
                        if (elmTaskInfo.getAttribute("result") == "rejected")   //반송인경우
                            strAuthorizeSign = "<img src='" + g_BaseImgURL + "Default/default_Reject.gif' border=0 style='width:30px;height:40px'>";  //전결일경우 최종결재자에겐 디폴트 반송이미지 보여줌
                        else
                            strAuthorizeSign = getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true);  //전결일경우 최종결재자에겐 전결자의 서명이미지 보여줌
                        break;
                    case "substitute":
                        //if (strDate == "") { ApvSignLines += m_oFormMenu.gLabel_substitue; } else { ApvSignLines += "<span class='txt_gn11_blur'>" + m_oFormMenu.gLabel_substitue + "</span>" + getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); } //"대결"
                        //ApvApproveNameLines += getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + sResult + "</td></tr>";
                        //대결표시형태 수정 (2013-01-08 HIW)
                        if (strDate == "") { ApvSignLines += m_oFormMenu.gLabel_substitue; } else { ApvSignLines += getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); } //"대결"
                        ApvApproveNameLines += getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + sResult + "(" + m_oFormMenu.gLabel_substitue + ")</td></tr>";
                        ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
                        ApvDateLines += formatDate(strDate);
                        LastApv = "";
                        LastApvName = "";
                        LastDate = "";
                        break;
                    case "skip":
                        //2013-03-06 yu2mi :결재안함 맨 마지막에 전결권자 넣어주기
                        //                        ApvSignLines += "/";
                        //                        ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + sResult + "</td></tr>";
                        //                        ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
                        //                        ApvDateLines += "&nbsp;";
                        if (i == elmList.length - 1 && strAuthorizeDate != "") {  //최종결재자
                            //ApvSignLines += getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strAuthorizeDate, false, elmTaskInfo.getAttribute("result"), true);
                            //ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + sResult + "</td></tr>";
                            ApvSignLines += strAuthorizeSign;  //HIW
                            ApvApproveNameLines += getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + strAuthorizeName + "</td></tr>";  //HIW
                            ApvApproveNameLines += (strAuthorizeDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strAuthorizeDate, "D") + "</span></td>";
                            ApvDateLines += "&nbsp;";
                        } else {
                            ApvSignLines += "/";
                            ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + sResult + "</td></tr>";
                            ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
                            ApvDateLines += "&nbsp;";
                        }

                        break;
                    case "bypass":  //후열
                        /*
                        ApvSignLines += (LastApv == "") ? m_oFormMenu.gLabel_bypass : LastApv; //"후열"							
                        //ApvApproveNameLines += (LastApvName=="")? getPresence(sCode, i+sCode, elmname.getAttribute("sipaddress"))+m_oFormMenu.getLngLabel(elmname.getAttribute("name"),false):LastApvName;	
                        ApvApproveNameLines += ((LastApvName == "") ? getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + "&nbsp;</td></tr>" : LastApvName) + sResult + "</td></tr>";
                        ApvApproveNameLines += (LastDate == "") ? "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate) + "</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + LastDate + "</span></td>";
                        //ApvDateLines += (LastDate =="")?formatDate(strDate):LastDate ;
                        */
                        if (LastApv == "") { ApvSignLines += m_oFormMenu.gLabel_bypass; } else { ApvSignLines += LastApv; } //"대결"
                        ApvApproveNameLines += getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + sResult + "(" + m_oFormMenu.gLabel_bypass + ")</td></tr>";
                        ApvApproveNameLines += (LastDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(LastDate, "D") + "</span></td>";
                        ApvDateLines += formatDate(LastDate);

                        break; 
                    case "review":
                        ApvSignLines += (strDate == "") ? m_oFormMenu.gLabel_review : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); //후결
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + sResult + "</td></tr>";
                        ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        break;
                    case "charge":
                        ApvSignLines += (strDate == "") ? m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true);
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + sResult + "</td></tr>";
                        ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        break;
                    default: //debugger;
                        ApvSignLines += (strDate == "") ? m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true);
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + sResult + "</td></tr>";
                        ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                }
                
                ApvSignLines += "</td></tr>";
                ApvApproveNameLines += "</td></tr></table></td>";

                ApvDateLines += "</td>";
                var tempApvLine = ApvPOSLines + ApvTitleLines + ApvSignLines + ApvApproveNameLines;
                ApvPOSLines = "";
                ApvTitleLines = "";
                ApvSignLines = "";
                ApvApproveNameLines = "";
                //감사인 경우 최종 결재자만 보여줌
                if (elm.parentNode.parentNode.getAttribute("routetype") == "audit") {
                    if (sApvTitle != "") {
                        Apvlines = "<th class='tit'>" + (sApvTitle == undefined ? m_oFormMenu.gLabel_request + "<br>" + m_oFormMenu.gLabel_dept : sApvTitle) + "</th>" + tempApvLine;
                    } else { Apvlines = tempApvLine; }
                } else {
                    Apvlines += tempApvLine;
                }
            }
        } //결재선제외	
    }
    // 2005.07.13 박형진 수정 기안자,결재자 '이름' 출력하도록
    //Apvlines = ApvPOSLines + "</tr>" + ApvSignLines + "</tr>" + ApvApproveNameLines + "</tr>" + ApvDateLines + "</tr>";	

    //N단계 신청 결재선뿌려주기 201107
    //Apvlines = "<table bgcolor='#FFFFFF' border='1' bordercolor='#dc5f0a' style='border-collapse: collapse;MARGIN-TOP: 0px;'>" + Apvlines + "</table>";	//width:95%;
    Apvlines = "<table class='table_1' summary='서명' cellpadding='0' cellspacing='0'><tr>" + Apvlines + "</tr></table>"; //width:95%;
    
    return Apvlines;
}


//최대7개의 결재선을 고정으로 표시하기 위한 함수
//pMaxApv : 최대 결재선 갯수
//pRemainApv : 남은 결재선 갯수(실제 공란으로 표시할 결재선갯수)
//poHTML : Return될 HTML 변수명 ( ApvPOSLines|ApvSignLines|ApvApproveNameLines|ApvDateLines)
function displayRemainApv(pMaxApv, pRemainApv, poHTML, strwidth) {
    var tmpHTML = "", tmpRemainApv = "";
    tmpRemainApv = pMaxApv - pRemainApv - 1;

    if (poHTML == "ApvPOSLines") {
        if (tmpRemainApv == 6 && tmpRemainApv > 0) {
            tmpHTML += "<td height='20'  bgcolor='#f5ebe1' colspan='" + (tmpRemainApv - 1) + "' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>" + m_oFormMenu.gLabel_investigation + "</td>"; //검토
            tmpHTML += "<td height='20'  bgcolor='#f5ebe1' width='" + strwidth + "%' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>" + m_oFormMenu.gLabel_Approved + "</td>"; 							//승인	
        } else if (tmpRemainApv < 6 && tmpRemainApv > 0) {
            tmpHTML += "<td height='20'  bgcolor='#f5ebe1' colspan='" + (tmpRemainApv) + "' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>" + m_oFormMenu.gLabel_investigation + "</td>"; 	//검토
        }
    } else {
        for (var i = 0; i < tmpRemainApv; i++) {
            switch (poHTML) {
                case "ApvSignLines":
                    tmpHTML += "<td height='20' width='14%' align='center' valign='top' style='font-size:8pt; WIDTH:" + strwidth + "%;'></td>"; break; //2006.09.25 김현태 결재선 상단 디스플레이
                case "ApvApproveNameLines":
                    tmpHTML += "<td height='20' width='14%' align='center' valign='top' style='font-size:8pt; WIDTH:" + strwidth + "%;'>---</td>"; break; //2006.09.25 김현태 결재선 상단 디스플레이
                case "ApvDateLines":
                    tmpHTML += "<td height='20' width='14%'  align='center' valign='bottom' style='font-size:8pt; WIDTH:" + strwidth + "%;'></td>"; break;
            }
        }
    }

    return tmpHTML;
}
//문서등급 조회
function getDocLevel(szCode) {
    var szName = '';
    /*보광그룹변경
    switch (szCode){
    case "10" : szName = "공개";break;
    case "20" : szName = "대외비";break;
    case "30" : szName = "중요";break;
    case "40" : szName = "극비";break;	
    }
    */

    //일반문서, 보안문서
    switch (szCode) {
        case "10": szName = "일반문서"; break;
        case "20": szName = "보안문서"; break;
    }
    return szName;
}


//	var m_objXML=CreateXmlDocument();
//	var elmList, elm;
//	var elmListLan;
//	try{
//	m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?>"+getInfo("BODY_CONTEXT"));
//	elmList = m_objXML.documentElement.childNodes;
//	if(elmList.length > 0){
//	szName = m_objXML.documentElement.selectSingleNode("DOC_LEVEL_NAME").text;
//	}
//	}catch(e){
//	}	
//	return szName;
//}
//	

//보존년한 조회
function getSaveTerm(szCode) {
    var szName = '';
    switch (szCode) {
        case "1": szName = m_oFormMenu.gLabel_year_1; break; 		//"1년"
        case "3": szName = m_oFormMenu.gLabel_year_3; break; 		//"3년"
        case "5": szName = m_oFormMenu.gLabel_year_5; break; 		//"4년"
        case "7": szName = m_oFormMenu.gLabel_year_7; break; 		//"5년"
        case "10": szName = m_oFormMenu.gLabel_year_10; break; 	//"10년"
        case "99": szName = m_oFormMenu.gLabel_permanence; break; //"영구"
    }
    return szName;
}
//문서등급 create
function setDocLevel() {
    /*보광그룹 수정
    makeCBOobject("10","공개",DOC_LEVEL);
    makeCBOobject("20","대외비",DOC_LEVEL);
    makeCBOobject("30","중요",DOC_LEVEL);
    makeCBOobject("40","극비",DOC_LEVEL);
	
	setDefaultCBOobject((getInfo("DOC_LEVEL")==null?"40":getInfo("DOC_LEVEL")),DOC_LEVEL);
    */

    // 일반문서, 보안문서
    //makeCBOobject("10", "일반문서", DOC_LEVEL);
    //makeCBOobject("20", "보안문서", DOC_LEVEL);
    document.getElementsByName("DOC_LEVEL")[0].length = 0;
    makeCBOobject("10", "일반문서", document.getElementsByName("DOC_LEVEL")[0]);
    makeCBOobject("20", "보안문서", document.getElementsByName("DOC_LEVEL")[0]);


    //setDefaultCBOobject((getInfo("DOC_LEVEL") == null ? "10" : getInfo("DOC_LEVEL")), DOC_LEVEL);
    //setDefaultCBOobject((getInfo("DOC_LEVEL") == null ? "10" : getInfo("DOC_LEVEL")), document.getElementsByName("DOC_LEVEL")[0]);
    setDefaultCBOobject(getInfo("DOC_LEVEL"), document.getElementsByName("DOC_LEVEL")[0]);



    //    var connectionname = "FORM_DEF_ConnectionString";
    //    var pXML = "covi_groupware.dbo.DMP_ACLLIST_SELECT";
    //    var aXML = "<param><name>CD_DEPT</name><type>nvarchar</type><length>100</length><value><![CDATA["+getInfo("etid")+"]]></value></param>";
    //        aXML += "<param><name>DV_ACLTYPE</name><type>varchar</type><length>10</length><value><![CDATA[SYSTEM ACL]]></value></param>";
    //    var sPostBody = "<Items><connectionname>"+connectionname+"</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
    //    var sTargetURL = "../getXMLQuery.aspx";
    //    //requestHTTP("POST", sTargetURL, true, "text/xml", receiveDocLevelQuery, sPostBody);
    //    requestHTTP((sPostBody == null ? "GET" : "POST"), sTargetURL, true, "text/xml", receiveDocLevelQuery, sPostBody);

}

//보존년한 create
function setSaveTerm() {
    /*
    makeCBOobject("1", m_oFormMenu.gLabel_year_1, document.getElementsByName("SAVE_TERM")[0]); 			//"1년"
    makeCBOobject("3", m_oFormMenu.gLabel_year_3, document.getElementsByName("SAVE_TERM")[0]); 			//"3년"
    makeCBOobject("5", m_oFormMenu.gLabel_year_5, document.getElementsByName("SAVE_TERM")[0]); 			//"5년"
    makeCBOobject("7", m_oFormMenu.gLabel_year_7, document.getElementsByName("SAVE_TERM")[0]); 			//"7년"
    makeCBOobject("10", m_oFormMenu.gLabel_year_10, document.getElementsByName("SAVE_TERM")[0]); 		//"10년"
    makeCBOobject("99", m_oFormMenu.gLabel_permanence, document.getElementsByName("SAVE_TERM")[0]);     //"영구"
    setDefaultCBOobject(getInfo("SAVE_TERM"), document.getElementsByName("SAVE_TERM")[0]);
    */
	
    makeCBOobject("1", GetSaveTermLang("1"), document.getElementsByName("SAVE_TERM")[0]); 			//"1년"
    makeCBOobject("3", GetSaveTermLang("3"), document.getElementsByName("SAVE_TERM")[0]); 			//"3년"
    makeCBOobject("5", GetSaveTermLang("5"), document.getElementsByName("SAVE_TERM")[0]); 			//"5년"
    makeCBOobject("7", GetSaveTermLang("7"), document.getElementsByName("SAVE_TERM")[0]); 			//"7년"
    makeCBOobject("10", GetSaveTermLang("10"), document.getElementsByName("SAVE_TERM")[0]); 		//"10년"
    makeCBOobject("99", GetSaveTermLang("99"), document.getElementsByName("SAVE_TERM")[0]);         //"영구"
    
    setDefaultCBOobject(getInfo("SAVE_TERM"), document.getElementsByName("SAVE_TERM")[0]);
	
	
}

function makeCBOobject(strcode, strname, cboObject) {
    try {
        /*
        var oOption = document.createElement("OPTION");
        cboObject.options.add(oOption);
        oOption.text = strname;
        oOption.value = strcode;
        */
        //JQuery로 변경 (HIW)
        $("<option value='" + strcode + "'>" + strname + "</option>").appendTo("select[name=" + cboObject.name + "]"); 

    } catch (e) { }
    return;
}
function setDefaultCBOobject(strcode, cboObject) {
    if (strcode == '' || strcode == null) strcode = '1';
    for (var i = 0; i < cboObject.length; i++) {
        if (cboObject.options[i].value == strcode) {
            cboObject.options[i].selected = true;
        }
    }
}

function setKind() {
    makeCBOobject("품의", "품의", document.getElementsByName("SEL_KIND")[0]);
    makeCBOobject("보고", "보고", document.getElementsByName("SEL_KIND")[0]);
}


////////////////////////////////////////////////////////////////////
//				나모 컨트롤에 추가된 이미지, 업로드				  //	
////////////////////////////////////////////////////////////////////
// 나모에 이미지 경로를 가지고 XFileUpload 로 Front에 올린다.

var gz_xmlHTTP = CreateXmlHttpRequest();
var up_xmlHTTP = CreateXmlHttpRequest();
var gz_Editor = "0"; //시스템 사용 에디터 0.TextArea, 1.DHtml, 2.TagFree, 3.XFree, 4.TagFree/XFree, 5.Activesquare, 6.CrossEditor, 7.ActivesquareDefault/CrossEditor -
function UpdateImageData() {
    gz_Editor = getInfo("editortype");
    var nfile = "";
    var nfolder = "IMAGEATTACH";
    var truedata = "";
    var n = -1;
    var szMimeValue, szURL, imgList;
    imgList = "";
    if (getInfo("editortype") == "3" || (getInfo("editortype") == "4" && !window.ActiveXObject)) {
        document.getElementById("dhtml_body").value = tbContentElement.GetHtmlValue();
        n = document.getElementById("dhtml_body").value.indexOf('http://') + 1;
    } else if (getInfo("editortype") == "2" || (getInfo("editortype") == "4" && window.ActiveXObject)) {
        document.tbContentElement.SetDefaultTargetAs('_blank'); //link 변경
        document.getElementById("dhtml_body").value = document.tbContentElement.HtmlValue;
        n = document.getElementById("dhtml_body").value.indexOf('file:///');
    } else if (getInfo("editortype") == "6" || (getInfo("editortype") == "7" && !window.ActiveXObject)) {
        document.getElementById("dhtml_body").value = tbContentElement.GetHtmlValue();
        n = document.getElementById("dhtml_body").value.indexOf('http://') + 1;
    } else if (getInfo("editortype") == "5" || (getInfo("editortype") == "7" && window.ActiveXObject)) {
        n = document.tbContentElement.GetFileNum(0);
    }

    if (n > 0) {
        if (getInfo("editortype") == "3" || (getInfo("editortype") == "4" && !window.ActiveXObject)) {
            szMimeValue = tbContentElement.GetHtmlValue();
            szURL = "/CoviWeb/common/FileAttach/BodyImgMoveBackStorage_xfree.aspx";  //nonActivetagfree
            truedata = szMimeValue;
            var dom = tbContentElement.GetDom();
            var imgs = dom.getElementsByTagName("img");
            var imgInfo = "";

            for (var i = 0; i < imgs.length; i++) {
                var img = imgs[i];
                var imgPath = img.src;
                imgInfo = imgInfo + imgPath + "|";
            }

            if (imgInfo.length > 0) {
                imgInfo = imgInfo.substr(0, (imgInfo.length - 1))
            }
            imgList = imgInfo;

        } else if (getInfo("editortype") == "2" || (getInfo("editortype") == "4" && window.ActiveXObject)) {
            szMimeValue = document.tbContentElement.MimeEnValue;
            szURL = "/CoviWeb/common/FileAttach/BodyImgMoveBackStorage_tagfree.aspx"; //
            truedata = szMimeValue;
        } else if (getInfo("editortype") == "6" || (getInfo("editortype") == "7" && !window.ActiveXObject)) {
            szMimeValue = tbContentElement.GetHtmlValue();
            szURL = "/CoviWeb/common/FileAttach/BodyImgMoveBackStorage_CrossEditor.aspx";  //nonActivetagfree
            truedata = szMimeValue;
        } else if (getInfo("editortype") == "5" || (getInfo("editortype") == "7" && !window.ActiveXObject)) {
            //	        imgList = getFileList();
            //	        if (imgList != "") {
            //	            // 기존에 저장되어 있는 이미지 경로는 http://이므로 실제로 새롭게 올린 화일의 경로는 로컬경로가 되므로 로컬경로를 확인하여 보내준다.
            //	            var sdata = imgList.split("|");
            //	            if (sdata.length > 0) {
            //	                for (var i = 0; i < sdata.length - 1; i++) {
            //	                    var str = sdata[i];
            //	                    if (str.indexOf("http://") == -1) { truedata += str + "|"; }
            //	                }
            //	            }
            //	        }
            szMimeValue = document.tbContentElement.MimeValue;
            szURL = "/CoviWeb/common/FileAttach/BodyImgMoveBackstorage_namo.aspx";
            truedata = szMimeValue;
        }

        if (truedata != "") {
            // frontstorage에 있는 이미지를 BackStorage\Approval 로 이동
            var szRequestXml = "<?xml version='1.0'?>" +
									"<parameters>" +
									  "<fname><![CDATA[" + getInfo("svdt").replace(/:/gi, "").replace(/오후/gi, "").replace(/오전/gi, "") + "]]></fname>" +
									  "<foldername><![CDATA[" + nfolder + "]]></foldername>" +
									  "<filename><![CDATA[" + imgList + "]]></filename>" +
									  "<mime><![CDATA[" + szMimeValue + "]]></mime>" +
									  "<domain><![CDATA[" + "http://" + document.location.host + "]]></domain>" +
									"</parameters>";

            gz_xmlHTTP.open("POST", szURL, false);
            gz_xmlHTTP.setRequestHeader("Content-type", "text/xml; charset=utf-8");
            gz_xmlHTTP.send(szRequestXml);
            event_attchSync();
        }
    }
}
// 나모 본문 작성후, 기안및 재기안 시에 이미지 경로를 서버측 주소롤 바꾸어서 저장한다.
function ChangeImgURL() {
    var objDOM; //Namo tbContentElement_Dom
    switch (gz_Editor) {
        case "1": objDOM = tbContentElement.CreateDOM();
            objDOM.charset = "utf-8";
            var imgName = new Array;
            var szdate = getInfo("svdt").replace(/:/gi, "").replace(/오후/gi, "").replace(/오전/gi, "");
            var g_szURL = "http://" + document.location.host + "/COVInet/BackStorage/e-sign/Approval/attach";
            for (var i = 0; i < objDOM.images.length; i++) {
                var imgSrc = objDOM.images[i].src;
                imgSrc = imgSrc.toLowerCase();
                if (imgSrc.indexOf("file:///") > -1) { //backstorage/approval/attach== -1					
                    imgName[i] = imgSrc.substring(imgSrc.lastIndexOf('/') + 1, imgSrc.length);
                    objDOM.images[i].src = g_szURL + "/" + szdate + "_" + imgName[i];
                }
            }
            tbContentElement.Value = objDOM.body.innerHTML.replace(/ekpweb1.medison.com/gi, "ekp.medison.com").replace(/ekpweb2.medison.com/gi, "ekp.medison.com");
            tbContentElement.DeleteDOM(); // DOM 사용하고 난 후에는 삭제해주어야 한다.		
            break;
        case "2": //objDOM = oWebEditor.GetDOM(); 
            break;
    }
}
function event_attchSync() {
    //	if(gz_xmlHTTP.readystate == 4){
    //		gz_xmlHTTP.onreadystatechange = event_noop;
    if (gz_xmlHTTP.status == 200) {
        var error = gz_xmlHTTP.responseXML.selectSingleNode("//error");
        if (error != null) {
            alert("AttachImage ERROR : " + error.text);
            return;
        } else {
            document.getElementById("dhtml_body").value = gz_xmlHTTP.responseXML.selectSingleNode("//htmldata").text;

            if (getInfo("editortype") == "3" || (getInfo("editortype") == "4" && !window.ActiveXObject)) {
                tbContentElement.SetHtmlValue(document.getElementById("dhtml_body").value);
            } else if (getInfo("editortype") == "2" || (getInfo("editortype") == "4" && window.ActiveXObject)) {
                document.tbContentElement.HtmlValue = document.getElementById("dhtml_body").value;
            } else if (getInfo("editortype") == "6" || (getInfo("editortype") == "7" && !window.ActiveXObject)) {
                tbContentElement.SetBodyValue(document.getElementById("dhtml_body").value);
            } else if (getInfo("editortype") == "5" || (getInfo("editortype") == "7" && window.ActiveXObject)) {
                document.tbContentElement.value = document.getElementById("dhtml_body").value;
                //url변경
                var objDOM = document.tbContentElement.CreateDOM();
                objDOM.charset = "utf-8";
                var imgName = new Array;
                var szdate = getInfo("svdt").replace(/:/gi, "").replace(/오후/gi, "").replace(/오전/gi, "").replace(/ /gi, "");
                var g_szURL = "/GWStorage/e-sign/Approval/IMAGEATTACH"; //"http://" + document.location.host + 
                for (var i = 0; i < objDOM.images.length; i++) {
                    var imgSrc = objDOM.images[i].src;
                    imgSrc = imgSrc.toLowerCase();
                    if (imgSrc.indexOf("file:///") > -1) { //backstorage/approval/attach== -1					
                        imgName[i] = imgSrc.substring(imgSrc.lastIndexOf('/') + 1, imgSrc.length);
                        objDOM.images[i].src = g_szURL + "/" + szdate + "_" + imgName[i];
                    }
                }
                document.tbContentElement.Value = objDOM.body.innerHTML;
                document.tbContentElement.DeleteDOM(); // DOM 사용하고 난 후에는 삭제해주어야 한다.		                    

            }
        }
    } else {
        alert(gz_xmlHTTP.statusText);
    }
    //	}
}
//수신처 부서출력
function displayRecApvDept(pRecDept) {
    var retHTML = "<table bordercolor='#111111' border='2' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100;width:95%;'><tr>";
    retHTML += "<td rowspan='3' bgcolor='#f5ebe1' width='40' height='100' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>" + m_oFormMenu.gLabel_management + "<br>" + m_oFormMenu.gLabel_dept + "</td>";
    retHTML += "<td height='20'  bgcolor='#f5ebe1'  width='100%' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>&nbsp;</td>";
    retHTML += "</tr><tr>";
    retHTML += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>" + pRecDept + "</td>";
    retHTML += "</tr><tr>";
    retHTML += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'></td>";
    retHTML += "</tr><tr>";
    retHTML += "<td height='20' align='center' valign='middle' style='font-size:8pt;'></td>";
    retHTML += "</tr></table>";
    return retHTML;
}


var sRecDeptUserYN = "N";  //수신부서 결재선자 (2012-11-22 HIW)
var gCommentCnt = 0;  //보여줄 코멘트갯수 (2012-11-23 HIW)


//결재선 그리기 (Table형태) - PC용
function displayApvList(oApvList) {//debugger; //1212
    //oApvList.xml="<?xml version=''''1.0''''?><steps initiatorcode=''''ISU_STWEBMASTER'''' initiatoroucode=''''ISU_STISU_ST011'''' status=''''completed'''' datecreated=''''2013-09-10 14:55:06'''' datecompleted=''''2013-09-10 14:55:43''''><division divisiontype=''''send'''' name=''''발신'''' oucode=''''ISU_STISU_ST011'''' ouname=''''정보관리팀;SYSTEM BUSINESS TEAM;정보관리팀;정보관리팀''''><taskinfo status=''''completed'''' result=''''completed'''' kind=''''send'''' datereceived=''''2013-09-10 14:52:29'''' datecompleted=''''2013-09-10 14:55:18''''/><step unittype=''''person'''' routetype=''''approve'''' name=''''기안자''''><ou code=''''ISU_STISU_ST011'''' name=''''정보관리팀;SYSTEM BUSINESS TEAM;정보관리팀;정보관리팀''''><person code=''''ISU_STWEBMASTER'''' name=''''관리자;webmaster;관리자;webmaster'''' position=''''ISU_STZ999;기타;etc.;;'''' title=''''ISU_ST99999;기타;etc.;;其他'''' level=''''ISU_STZ999;기타;;;'''' oucode=''''ISU_STISU_ST011'''' ouname=''''정보관리팀;SYSTEM BUSINESS TEAM;정보관리팀;정보관리팀'''' sipaddress=''''''''><taskinfo status=''''completed'''' result=''''completed'''' kind=''''charge'''' datereceived=''''2013-09-10 14:55:06'''' customattribute1=''''sign_ISU_STWEBMASTER_WebmasterSing_0.bmp'''' datecompleted=''''2013-09-10 14:55:06'''' wiid=''''99EB992C-A0A5-4CC3-B2D3-C51A2F5AC805''''/></person></ou></step></division><division divisiontype=''''receive'''' name=''''수신'''' oucode=''''ISU_STISU_ST011'''' ouname=''''정보관리팀;SYSTEM BUSINESS TEAM;정보관리팀;정보관리팀''''><taskinfo kind=''''receive'''' status=''''pending'''' result=''''pending'''' datereceived=''''2013-09-10 14:55:53''''/><step unittype=''''person'''' routetype=''''approve'''' name=''''담당부서''''><ou code=''''ISU_STISU_ST011'''' name=''''정보관리팀;SYSTEM BUSINESS TEAM;정보관리팀;정보관리팀''''><person code=''''ISU_ST12001'''' name=''''박선우;Park Sun-woo;박선우;朴仙又'''' position=''''ISU_STA135;사원;Staff;사원;社員'''' title=''''ISU_ST10150;팀원;(영)팀원;J팀원;C팀원'''' level=''''ISU_STA330;4급갑;;;'''' oucode=''''ISU_STISU_ST011'''' ouname=''''정보관리팀;SYSTEM BUSINESS TEAM;정보관리팀;정보관리팀'''' sipaddress=''''''''><taskinfo status=''''pending'''' result=''''pending'''' kind=''''charge'''' datereceived=''''2013-09-11 09:57:49''''><comment relatedresult=\''''rejectedto\'''' datecommented=\''''2013-07-11 13:15:08\''''><![CDATA[지정반송테스트]]></comment></taskinfo></person></ou></step></division></steps>";
    var elmRoot, elmdiv, elmList, elm, elmTaskInfo, elmReceive, ApvList, elmVisible, elmRecList;
    var Apvlines = "";
    var strDate, strFieldName, strwidth, strColTD, LastDate;
    var bRoleChk = false;
    //logo.src = "http://tstmaeil.com/COVINet/BackStorage/Approval/" + (getInfo("ENT_CODE")!=undefined?getInfo("ENT_CODE"):getInfo("etid"))+".gif";//회사 logo 처리
    elmRoot = oApvList.documentElement;
    
    if (elmRoot != null) {
        
        //=== 현사용자가 수신부서 결재선자인지의 유무 (HIW)
        if (m_oFormMenu.gProcessKind == "Cooperate") {  //협조프로세스
            $($.parseXML(elmRoot.xml)).find("division").each(function () {
                /*
                if ($(this).attr("divisiontype") == "receive") {
                $(this).find("step").each(function (j, stepNode) {
                if ($(stepNode).find("person").attr("code") == getInfo("ptid"))
                sRecDeptUserYN = "Y";
                });
                }
                */
                if ($(this).attr("divisiontype") == "receive" && $(this).attr("oucode") == getInfo("dpid")) {
                    sRecDeptUserYN = "Y";
                    
                }
            });
        }
        //===============================================
        
        elmdiv = elmRoot.selectNodes("division");
        
        for (var i = 0; i < elmdiv.length; i++) {
            elm = elmdiv.nextNode();


            if (window.ActiveXObject) {
                
                elmList = elm.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='approve' or @routetype='receive') and @name!='reference']/ou/(person|role)");
                elmVisible = elm.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='approve' or @routetype='receive') and @name!='reference']/ou/(person|role)[taskinfo/@visible='n']");
                if (elm.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='approve' or @routetype='receive') and @name!='reference']/ou/(role)").length > 0) {
                    bRoleChk = true;
                }
            } else {
            
                elmList = elm.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='approve' or @routetype='receive') and @name!='reference' ]/ou/*[name()='person' or name()='role']"); //(person|role)
                elmVisible = elm.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='approve' or @routetype='receive') and @name!='reference']/ou/*[name()='person' or name()='role'][taskinfo/@visible='n']");
                if (elm.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='approve' or @routetype='receive') and @name!='reference' ]/ou/*[name()='role']").length > 0) {
                    bRoleChk = true;
                }
            }
            //debugger;
            //var elmComment = elm.selectNodes("//step/ou/person/taskinfo/comment");
            var elmComment = $(elm).find("step > ou > person > taskinfo > comment");
            if ((bgetCommentView && elmComment.length > 0 && String(window.location).indexOf("_read.htm") > -1) || (bgetCommentView && elmComment.length > 0 && m_oFormMenu.sMody == true)) {
                if (m_print == false) {
                    getCommentView(elmComment);  //의견 Display
                    
                }
            }
            
            //담당부서(수신부서)
            if (getInfo("scPRec") == "1" || getInfo("scDRec") == "1" || getInfo("scChgr") == "1" || getInfo("scChgrOU") == "1") {//수신처가 있는경우 좌측:내부결재 우측 수신처 결재선
                if (elmdiv.length > 1) {
                    if (i == 0) { try { document.getElementById("LApvLine").innerHTML = getRequestApvList(elmList, elmVisible, "", false, m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false)); } catch (e) { document.getElementById("AppLine").innerHTML = getRequestApvList(elmList, "", true, m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false)); } }
                    //N단계 신청 결재선뿌려주기 201107
                    if (i > 0) {
                        var sOUName = elm.getAttribute("ouname");
                     
                        try { if (sOUName == null || sOUName == "") { sOUName = elm.selectSingleNode("step/ou").getAttribute("name"); } } catch (e) { }
                        //담당부서/담당업무뿌려주기  2011-04-13  			        
                        if (elmList.length == 0 || bRoleChk) {
                            //document.getElementById("RApvLine").innerHTML = "<table class='table_1' cellSpacing='0' cellPadding='0' summary='서명'><tr><th class='tit'>" + m_oFormMenu.gLabel_managedept + "</th><td><table class='table_1_1' cellspacing='0' summary='서명' cellpadding='0'><tr><th width='90'>&nbsp;</th></tr><tr><td style='FONT-STYLE: italic; FONT-FAMILY: Georgia, Times New Roman, Times, serif,gulim; COLOR: #4584c9; FONT-SIZE: 11pt; FONT-WEIGHT: bold' height='50' vAlign='middle' align='center'>" + m_oFormMenu.getLngLabel(sOUName, false) + "</td></tr><tr><td class='la'>&nbsp;<br /><span class='txt_gn11_blur'>&nbsp;</span></td></tr></table></td></tr></table>";  // dc5f0a를 000000로 바꿈
                            if (i == 1) {
                                document.getElementById("RApvLine").innerHTML = "<table class='table_1' cellSpacing='0' cellPadding='0' summary='서명'><tr><th class='tit'>" + m_oFormMenu.gLabel_Acceptdept + "</th><td><table class='table_1_1' cellspacing='0' summary='서명' cellpadding='0'><tr><th width='90'>&nbsp;</th></tr><tr><td style='FONT-STYLE: italic; FONT-FAMILY: Georgia, Times New Roman, Times, serif,gulim; COLOR: #4584c9; FONT-SIZE: 11pt; FONT-WEIGHT: bold' height='50' vAlign='middle' align='center'>" + m_oFormMenu.getLngLabel(sOUName, false) + "</td></tr><tr><td style='BORDER-TOP: #D6D7D6 1px solid;'>&nbsp;</td></tr><tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td></tr></table></td></tr></table>";  // dc5f0a를 000000로 바꿈 , 처리부서를 수신부서로 변경(HIW)
                            } else {
                                document.getElementById("RApvLine").innerHTML += "<table class='table_1' cellSpacing='0' cellPadding='0' summary='서명'><tr><th class='tit'>" + m_oFormMenu.gLabel_Acceptdept + "</th><td><table class='table_1_1' cellspacing='0' summary='서명' cellpadding='0'><tr><th width='90'>&nbsp;</th></tr><tr><td style='FONT-STYLE: italic; FONT-FAMILY: Georgia, Times New Roman, Times, serif,gulim; COLOR: #4584c9; FONT-SIZE: 11pt; FONT-WEIGHT: bold' height='50' vAlign='middle' align='center'>" + m_oFormMenu.getLngLabel(sOUName, false) + "</td></tr><tr><td style='BORDER-TOP: #D6D7D6 1px solid;'>&nbsp;</td></tr><tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td></tr></table></td></tr></table>";  // dc5f0a를 000000로 바꿈 , 처리부서를 수신부서로 변경(HIW)
                            }
                        } else {
                            if (i == 1) {
                                
                                try { document.getElementById("RApvLine").innerHTML = getRequestApvList(elmList, elmVisible, "", true, m_oFormMenu.getLngLabel(sOUName, false), true); } catch (e) { document.getElementById("AppLine").innerHTML = getRequestApvList(elmList, "", true, m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false)); }
                            } else {
                                var szPreRApvLine = document.getElementById("RApvLine").innerHTML;
                                document.getElementById("RApvLine").parentNode.style.height = String(90 * (i + 1)) + "px";
                                try { document.getElementById("RApvLine").innerHTML = szPreRApvLine + getRequestApvList(elmList, elmVisible, "", true, m_oFormMenu.getLngLabel(sOUName, false), true); } catch (e) { document.getElementById("AppLine").innerHTML = getRequestApvList(elmList, "", true, m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false)); }
                            }
                        }
                    }
                    //N단계 신청 결재선뿌려주기 201107
                } else {
                    if (i == 0) {
                        try { document.getElementById("LApvLine").innerHTML = getRequestApvList(elmList, elmVisible, "", false, null); } catch (e) { document.getElementById("AppLine").innerHTML = getRequestApvList(elmList, "", true, m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false)); }
                        //담당부서/담당업무뿌려주기 2011-04-13
                        var sOUName = "";
                        if (getInfo("scChgr") == "1") {
                            sOUName = getInfo("scChgrV").split("@")[1];
                        }
                        if (getInfo("scChgrOU") == "1") {
                            sOUName = m_oFormMenu.getLngLabel(getInfo("scChgrOUV").split("@")[1], false)
                        }
                        //document.getElementById("RApvLine").innerHTML = "<table class='table_1' cellSpacing='0' cellPadding='0' summary='서명'><tr><th class='tit'>" + m_oFormMenu.gLabel_managedept + "</th><td><table class='table_1_1' cellspacing='0' summary='서명' cellpadding='0'><tr><th width='90'>&nbsp;</th></tr><tr><td style='FONT-STYLE: italic; FONT-FAMILY: Georgia, Times New Roman, Times, serif,gulim; COLOR: #4584c9; FONT-SIZE: 11pt; FONT-WEIGHT: bold' height='50' vAlign='middle' align='center'>" + m_oFormMenu.getLngLabel(sOUName, false) + "</td></tr><tr><td class='la'>&nbsp;<br /><span class='txt_gn11_blur'>&nbsp;</span></td></tr></table></td></tr></table>";  // dc5f0a를 000000로 바꿈
                        document.getElementById("RApvLine").innerHTML = "<table class='table_1' cellSpacing='0' cellPadding='0' summary='서명'><tr><th class='tit'>" + m_oFormMenu.gLabel_Acceptdept + "</th><td><table class='table_1_1' cellspacing='0' summary='서명' cellpadding='0'><tr><th width='90'>&nbsp;</th></tr><tr><td style='FONT-STYLE: italic; FONT-FAMILY: Georgia, Times New Roman, Times, serif,gulim; COLOR: #4584c9; FONT-SIZE: 11pt; FONT-WEIGHT: bold' height='50' vAlign='middle' align='center'>" + m_oFormMenu.getLngLabel(sOUName, false) + "</td></tr><tr><td style='BORDER-TOP: #D6D7D6 1px solid;'>&nbsp;</td></tr><tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td></tr></table></td></tr></table>";  // dc5f0a를 000000로 바꿈 , 처리부서를 수신부서로 변경(HIW)
                        
                    }
                }
            } else {
                if (elmdiv.length > 1) {
                   
                    if (getInfo("fmpf") != "WF_FORM_ISU_ALL_COM010") {  //대내공문일경우는 발신부서 보여주지 않음 (2012-12-20 HIW)
                        if (i == 0) { try { document.getElementById("LApvLine").innerHTML = getRequestApvList(elmList, elmVisible, "", false, m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false)); } catch (e) { document.getElementById("AppLine").innerHTML = getRequestApvList(elmList, "", true, m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false)); } }
                    }
                  
                    if (i == 1) { try { document.getElementById("RApvLine").innerHTML = getRequestApvList(elmList, elmVisible, "", true, m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false), true); } catch (e) { document.getElementById("AppLine").innerHTML = getRequestApvList(elmList, "", true, m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false)); } }
                } else {
                    document.getElementById("AppLine").align = "left";   //"right";
                    document.getElementById("AppLine").innerHTML = getRequestApvList(elmList, elmVisible, "", false, m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false));
                }
            }

        }
       
        //합의자/합의부서 출력
        if (window.ActiveXObject) {
            elmList = elmRoot.selectNodes("division/step[(@unittype='person' or @unittype='role') and (@routetype='assist' or @routetype='consult')]/ou/(person|role)[taskinfo/@kind!='conveyance']"); //개인합의
        } else {
            elmList = elmRoot.selectNodes("division/step[(@unittype='person' or @unittype='role') and (@routetype='assist' or @routetype='consult')]/ou/*[(name()='person' or name()='role')][taskinfo/@kind!='conveyance']"); //개인합의
        }
        elmOUList = elmRoot.selectNodes("division/step[@unittype='ou' and (@routetype='assist' or @routetype='consult')]/ou"); //부서협조		
        elmListCount = elmList.length + elmOUList.length;
        var LastTitle, LastCmt, LastResult;

        if (elmListCount != 0) {
            Apvlines = "<tr><th>" + m_oFormMenu.gLabel_dept + "</th>";
            //Apvlines += "	<th>" + m_oFormMenu.gLabel_jobtitle + "</th>";
            Apvlines += "	<th>" + m_oFormMenu.gLabel_username + "</th>";
            Apvlines += "	<th>" + m_oFormMenu.gLabel_consultdate + "</th>";  //합의일자  //m_oFormMenu.gLabel_approvdate(결재일자)
            Apvlines += "   <th>" + m_oFormMenu.gLabel_comment + "</th></tr>";

            //합의자
            for (var i = 0; i < elmList.length; i++) {
                elm = elmList.nextNode();
                //elm = elmList[i];
                var sCode = "";
                var sTitle = "";
                var sName = "";
                var sComment = "";

                if (elm.nodeName == "role") {
                    try { sCode = elm.selectSingleNode("person").getAttribute("code"); } catch (e) { }
                    try { sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("title"), false); } catch (e) { }
                    try { sName = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false); } catch (e) { }
                } else {
                    sCode = elm.getAttribute("code");
                    sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("title"), true);
                    sName = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false); //sTitle.substring(sTitle.lastIndexOf(";")+1)+" "+
                }
                elmTaskInfo = elm.selectSingleNode("taskinfo");
                strDate = elmTaskInfo.getAttribute("datecompleted");
                if (strDate == null) { strDate = ""; }
                var assistcmt = elm.selectSingleNode("taskinfo/comment"); //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.
                var sActionState = "";
                if (elmTaskInfo.getAttribute("result") == "agreed")  //행위상태값이 "합의"일경우 "결재"가아닌 "합의"로 표시 (2012-11-09 HIW)
                    sActionState = m_oFormMenu.gLabel_assist;
                else if (elmTaskInfo.getAttribute("result") == "disagreed")  //행위상태값이 "반송"일경우 "반송"이아닌 "이의"로 표시 (2012-11-09 HIW)
                    sActionState = m_oFormMenu.gLabel_objection;
                else
                    sActionState = interpretResult(elmTaskInfo.getAttribute("result"));

                switch (elmTaskInfo.getAttribute("kind")) {
                    case "substitute":
                        LastTitle = getPresence(sCode, "assist" + i + sCode, elm.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                        LastCmt = (assistcmt == null) ? "&nbsp;" : assistcmt.text.replace(/\n/g, "<br>");
                        //LastResult = ((strDate == "") ? "&nbsp;" : formatDate(strDate) + interpretResult(elmTaskInfo.getAttribute("result")));
                        LastResult = ((strDate == "") ? "&nbsp;" : formatDate(strDate) + sActionState);  //HIW
                        break;
                    case "bypass":
                        Apvlines += "<tr><td width='150px' align='center'>" + m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false) + "</td>"; //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.
                        //Apvlines += "<td>" + sTitle + "</td>";
                        Apvlines += "<td width='90px' align='center'>";
                        Apvlines += sName + " " + m_oFormMenu.gLabel_substitue + " " + LastTitle + "</td>";
                        Apvlines += "<td align='center'>" + LastResult + "</td>";
                        Apvlines += "<td width='250px'>";
                        Apvlines += LastCmt;
                        Apvlines += "</td></tr>";
                        break; //"후열"
                    default:
                        
                        Apvlines += "<tr><td width='150px' align='center'>" + m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false) + "</td>"; //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.
                        //Apvlines += "<td>" + sTitle + "</td>"; //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.
                        Apvlines += "<td width='90px' align='center'>" + sName + "</td>"; //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.
                        //Apvlines += "<td align='center'>" + ((strDate == "") ? "&nbsp;" : formatDate(strDate, "T") + " " + interpretResult(elmTaskInfo.getAttribute("result"))) + "</td>";
                        Apvlines += "<td align='center'>" + ((strDate == "") ? "&nbsp;" : formatDate(strDate, "D") + " " + sActionState) + "</td>";  //HIW
                        Apvlines += "<td width='250px'>";
                        Apvlines += (assistcmt == null) ? "&nbsp;" : assistcmt.text.replace(/\n/g, "<br />");
                        Apvlines += "</td></tr>";
                        break;
                }
            }

            //합의부서
            //debugger;
            for (var i = 0; i < elmOUList.length; i++) {
                //2014-08-05 hyh 수정 
		//elm = elmOUList.nextNode();
                //elmTaskInfo = elm.selectSingleNode("taskinfo");
                elm = elmOUList[i];
                elmTaskInfo = elmOUList[i].selectSingleNode("taskinfo")
                //2014-08-05 hyh 수정 끝
                strDate = elmTaskInfo.getAttribute("datecompleted");
                if (strDate == null) { strDate = ""; }
                //2014-02-28 hyh 수정
                //var assistcmt = elmTaskInfo.selectSingleNode("comment")
                //if (elmRoot.selectNodes("division/step[@unittype='ou' and (@routetype='assist' or @routetype='consult')]/ou/person/taskinfo").nextNode().selectSingleNode("comment") != undefined || elmRoot.selectNodes("division/step[@unittype='ou' and (@routetype='assist' or @routetype='consult')]/ou/person/taskinfo").nextNode().selectSingleNode("comment") != null)

                //2014-03-28 hyh 추가
                //debugger;
                var elmPerson = elm.selectNodes("person")
                var tmpAssistcmt="";
                for (j = 0; j < elmPerson.length; j++) {
                    if (elmTaskInfo.getAttribute("status") != "pending") {
                        //2014-03-28 hyh 추가 끝
                        if (elmRoot.selectNodes("division/step[@unittype='ou' and (@routetype='assist' or @routetype='consult')]/ou/person/taskinfo").nextNode() != null) {
                            if (elmRoot.selectNodes("division/step[@unittype='ou' and (@routetype='assist' or @routetype='consult')]/ou/person/taskinfo").nextNode().selectSingleNode("comment") != undefined || elmRoot.selectNodes("division/step[@unittype='ou' and (@routetype='assist' or @routetype='consult')]/ou/person/taskinfo").nextNode().selectSingleNode("comment") != null) {
                                //var assistcmt = elmRoot.selectNodes("division/step[@unittype='ou' and (@routetype='assist' or @routetype='consult')]/ou/person/taskinfo").nextNode().selectSingleNode("comment");
                                //var assistcmt += elm.selectNodes("person")[j].nodeTypedValue + "//";
                                if (elm.selectNodes("person")[j].nodeTypedValue != "") {
                                    tmpAssistcmt += "*"+elm.selectNodes("person")[j].attributes(1).nodeValue.split(";")[0] + " " + elm.selectNodes("person")[j].attributes(2).nodeValue.split(";")[1] + "의 의견 : " + elm.selectNodes("person")[j].nodeTypedValue + "&&";
                                }
                            } else {
                               //2014-08-05 hyh 수정 
                                 //var assistcmt = elmTaskInfo.selectSingleNode("comment");
                                //var assistcmt = elm.selectNodes("person")[j].nodeTypedValue;
				if(elm.selectNodes("person")[j].nodeTypedValue != "")
 			        {                                
                                 	tmpAssistcmt += "*"+elm.selectNodes("person")[j].attributes(1).nodeValue.split(";")[0] + " " + elm.selectNodes("person")[j].attributes(2).nodeValue.split(";")[1] + "의 의견 : " + elm.selectNodes("person")[j].nodeTypedValue + "&&";
		                }
                               //2014-08-05 hyh 수정 끝
                            }
                        }
                        else {
                            var assistcmt = elmTaskInfo.selectSingleNode("comment");

                        }
                        //2014-03-28 hyh 추가
                    }
                    else {
                        //2014-08-12 hyh 수정
                        //var assistcmt = elmTaskInfo.selectSingleNode("comment");
                        //var assistcmt = elm.selectNodes("person")[j].nodeTypedValue;
                         if(elm.selectNodes("person")[j].nodeTypedValue != "")
			 {
                         	tmpAssistcmt += "*"+elm.selectNodes("person")[j].attributes(1).nodeValue.split(";")[0] + " " + elm.selectNodes("person")[j].attributes(2).nodeValue.split(";")[1] + "의 의견 : " + elm.selectNodes("person")[j].nodeTypedValue + "&&";
			 }
                        //2014-08-12 hyh 수정 끝
                    }
                    //2014-03-28 hyh 추가 끝

                }
                //alert(tmpAssistcmt);

                    //2014-02-28 hyh 수정 끝

                    var sActionState = "";
                    if (elmTaskInfo.getAttribute("result") == "agreed")  //행위상태값이 "합의"일경우 "결재"가아닌 "합의"로 표시 (2012-11-09 HIW)
                        sActionState = m_oFormMenu.gLabel_assist;
                    else if (elmTaskInfo.getAttribute("result") == "disagreed")  //행위상태값이 "반송"일경우 "반송"이아닌 "이의"로 표시 (2012-11-09 HIW)
                        sActionState = m_oFormMenu.gLabel_objection;
                    else
                        sActionState = interpretResult(elmTaskInfo.getAttribute("result"));
                    /*
                    Apvlines += "<tr><td>" + m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) + "</td><td>";
                    //Apvlines += (strDate=="")?"&nbsp;</td>":interpretResult(elmTaskInfo.getAttribute("result"))+"</td>";
                    Apvlines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) + "</td>";
                    Apvlines += "<td>" + formatDate(strDate) + "</td><td style='display:none'>";
                    var assistcmt = elmTaskInfo.selectSingleNode("comment")
                    Apvlines += (assistcmt == null) ? "&nbsp;" : assistcmt.text;
                    Apvlines += "</td></tr>";
                    */

                    Apvlines += "<tr><td width='150px' align='center'>" + m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) + "</td>"; //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.
                    Apvlines += "<td width='90px' align='center'>" + m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) + "</td>"; //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.
                    Apvlines += "<td align='center'>" + ((strDate == "") ? "&nbsp;" : formatDate(strDate, "D") + " " + sActionState) + "</td>";  //HIW
                    Apvlines += "<td width='250px'>";

                    //2014-06-02 hyh 수정
                    //Apvlines += (assistcmt == null) ? "&nbsp;" : assistcmt.text.replace(/\n/g, "<br />");

                    if (elmTaskInfo.getAttribute("status") == "inactive") {
                        Apvlines += (assistcmt == null) ? "&nbsp;" : "";
                    }
                    else {
                        /*
                        try {
                            Apvlines += (assistcmt == null) ? "&nbsp;" : assistcmt.text.replace(/\n/g, "<br />");
                        } catch (e) { Apvlines += (assistcmt == null) ? "&nbsp;" : assistcmt.replace(/\n/g, "<br />"); }
                        */

                        //Apvlines += tmpAssistcmt.replace(/\n/g, "<br />").replace("//", "<br/><br/>");
                        //Apvlines = Apvlines.replace("//", "<br/><br/>");
 
                        //2014-08-05 hyh 수정
                        Apvlines += tmpAssistcmt.replace(/\n/g, "<br />").split("&&").join("<br/>");
                        //Apvlines +=  "* 결재자 " + elmPerson[i].getAttribute("name").split(";")[0] + " 의 의견" + "<br/>" + assistcmt.replace(/\n/g, "<br />").split("&&").join("<br/>");
                        //2014-08-05 hyh 수정 끝
                    }

                    //2014-06-02 hyh 수정 끝
                    Apvlines += "</td></tr>";
               // }
                }
                    Apvlines = "<table class='table_7' summary='합의' cellpadding='0' cellspacing='0'>" + Apvlines + "</table>";
                    document.getElementById("AssistLine").innerHTML = Apvlines; 
                    //2014-09-15 hyh 수정
		    //document.getElementById("AssistLine").style.display = "";
	  	    if ($(elm).parent().parent().parent().attr("divisiontype") == "send" && sRecDeptUserYN == "Y")
		    {
			document.getElementById("AssistLine").style.display = "none";
		    }
		    else
		    {
			document.getElementById("AssistLine").style.display = "";
    	            }
                    //2014-09-15 hyh 수정 끝
                    
                } else {

                    document.getElementById("AssistLine").innerHTML = ""; document.getElementById("AssistLine").style.display = "none";
            }

        //참조자 출력
        displayCCInfo(elmRoot);

        //감사자 출력
        elmList = elmRoot.selectNodes("division/step[@routetype='audit']/ou/person");
        if (elmList.length > 0) {
            elmVisible = elmRoot.selectNodes("division/step[@routetype='audit']/ou/person[taskinfo/@visible='n']");
            var sAdtLine = "";
            try { sAdtLine = getRequestApvList(elmList, elmVisible, "", false, "감사"); } catch (e) { }
            if (document.getElementById("RApvLine") != null) {
                document.getElementById("RApvLine").innerHTML = "<table style='width:100%' cellpadding='0' cellspacing='0' border='0'><tr><td align='right' style='width:80%;'>" + document.getElementById("RApvLine").innerHTML + "</td><td align='right' style='width:20%;'>" + sAdtLine + "</td></tr></table>";
            } else {
                document.getElementById("AppLine").innerHTML = "<table style='width:100%' cellpadding='0' cellspacing='0' border='0'><tr><td align='right' style='width:80%;'>" + document.getElementById("AppLine").innerHTML + "</td><td align='right' style='width:20%;'>" + sAdtLine + "</td></tr></table>";
            }
        }

    }
    //배포처 출력
    
    try { if (document.getElementById("RecLine") != null) document.getElementById("RecLine").innerHTML = initRecList(); } catch (e) { }
    try { G_displaySpnDocLinkInfo(); } catch (e) { }
    try { G_displaySpnRejectDocLinkInfo(); } catch (e) { }
    try { if (getInfo("scPM") == "1") G_displaySpnPMLinkInfo((getInfo("scPMV") == "" ? null : getInfo("scPMV"))); } catch (e) { }
    
}


//참조자 출력 - 일반참조자
function displayCCInfo(elmRoot) {

    displayCCInfo2(elmRoot)  //조회가능참조자 (2012-11-15 추가 HIW)
    
    var ccInfos = $(elmRoot).find("ccinfo");
    var sSendccInfos = "";
    var sRecccInfos = "";

    if (ccInfos.length > 0) {
        for (var i = 0; i < ccInfos.length; i++) {
            var sList = "";
            var ccInfo = ccInfos[i];
            var sBelongTo = $(ccInfo).attr("belongto");
            var ccList = $(ccInfo.childNodes);
            var ccListIndex = 0;
            var cc = ccList[ccListIndex]; ccListIndex++;
            while (cc != null) {
                if (cc.hasChildNodes()) cc = cc.firstChild;
                if (cc.nodeName == "person") {
                    sList += (sList.length > 0 ? ";&nbsp;" : "") + m_oFormMenu.getLngLabel($(cc).attr("ouname"), false) + " " + m_oFormMenu.getLngLabel($(cc).attr("title"), true) + " " + m_oFormMenu.getLngLabel($(cc).attr("name"), false);
                } else if (cc.nodeName == "ou") {
                    sList += (sList.length > 0 ? ";&nbsp;" : "") + m_oFormMenu.getLngLabel($(cc).attr("name"), false);
                } else if (cc.nodeName == "group") {
                    sList += (sList.length > 0 ? ";&nbsp;" : "") + m_oFormMenu.getLngLabel($(cc).attr("name"), false);
                }

                cc = ccList[ccListIndex]; ccListIndex++;
            }

            //2012-11-15 추가 HIW
            var vSplit = "";
            if (document.getElementById("SendCC").innerHTML != "" && sList != "")
                vSplit = ";&nbsp"

            switch (sBelongTo) {
                case "global": document.getElementById("CC").innerHTML = sList; break;
                case "sender":
                    sSendccInfos += (sSendccInfos.length > 0 ? ";" : "") + sList;
                    //document.getElementById("SendCC").innerHTML = sSendccInfos;
                    document.getElementById("SendCC").innerHTML = document.getElementById("SendCC").innerHTML + vSplit + sSendccInfos;  //위구문주석후 추가. 조회가능참조자와 같이 보여주기위한 수정(2012-11-15 HIW)
                    break;
                case "receiver":
                    sRecccInfos += (sRecccInfos.length > 0 ? ";" : "") + sList;
                    //document.getElementById("RecCC").innerHTML = sRecccInfos;
                    document.getElementById("RecCC").innerHTML = document.getElementById("SendCC").innerHTML + vSplit + sRecccInfos;  //위구문주석후 추가. 조회가능참조자와 같이 보여주기위한 수정(2012-11-15 HIW)
                    break;
            }
        }
        //참조자 목록 보이기 처리
        if (sSendccInfos.length + sRecccInfos.length > 0) {
            try { document.getElementById("CCLine").style.display = ""; } catch (e) { }
        } else {
            try { document.getElementById("CCLine").style.display = ""; } catch (e) { }
        }
    } else {
        try { document.getElementById("CCLine").style.display = ""; } catch (e) { }
    }
}


//참조자 출력 - 조회가능참조자(진행함에서 문서열람가능한 참조자) 2012-11-15 추가 HIW
function displayCCInfo2(elmRoot) {//debugger;
    
    var vUnitNm = "";
    var vJikChek = "";
    var vUserNm = "";
    var vCcList = "";

    $(elmRoot).find("step").each(function () {

        if ($(this).attr("name") == "reference") {
            l_UnitType = $(this).attr("type");  //속성접근
            l_UR_Code = $(this).find("UR_Code").text();  //엘리먼트접근

            vUnitNm = m_oFormMenu.getLngLabel($(this).find("ou").attr("name"), false);
            vUserNm = m_oFormMenu.getLngLabel($(this).find("person").attr("name"), false);
            try {
                vJikChek = $(this).find("person").attr("title").split(";")[1] + ";" + $(this).find("person").attr("title").split(";")[2] + ";" + $(this).find("person").attr("title").split(";")[3] + ";" + $(this).find("person").attr("title").split(";")[4]
                vJikChek = m_oFormMenu.getLngLabel(vJikChek, false);
            } 
            catch (e) { vJikChek = ""; }

            vCcList += vUnitNm + " " + vJikChek + " " + vUserNm + "; ";
        }
    });

    if (vCcList.length > 0) {
        vCcList = vCcList.substring(0, vCcList.length - 2);
    }
    document.getElementById("SendCC").innerHTML = vCcList;
}

//참조자,수신자리스트 2006.8.26 이학승
function getRecCCList4CK() {
    //수신자,참조자리스트 2006.8.25 이학승		
    var strflag = false;
    var sItems = "<request>";
    var sUrl;
    sUrl = "../Circulation/Circulation_CC_View.aspx?fiid=" + getInfo("fiid");
    sItems += "</request>";
    requestHTTP("POST", sUrl, true, "text/xml; charset=utf-8", receiveHTTP, sItems);
}

function receiveHTTP() {
    var m_oRecLists = CreateXmlDocument();
    var sSendccInfos = "";
    var sRecccInfos = "";

    if (m_xmlHTTP.readyState == 4) {
        m_xmlHTTP.onreadystatechange = event_noop;
        var xmlReturn = m_xmlHTTP.responseXML;
        if (m_xmlHTTP.responseText == "") {
            alert(m_xmlHTTP.responseText);
        } else {
            var errorNode = xmlReturn.selectSingleNode("response/error");
            if (errorNode != null) {
                alert("Desc: " + errorNode.text);
            }
        }
    }
}

//협조처 목록 조회
function initRecList() {
    if (getInfo("scIPub") == "1" && getInfo("scIPubV") != "" && String(window.location).indexOf("_read.htm") == -1 && RECEIVE_NAMES.value == "") {
        var strIPub = getInfo("scIPubV");
        document.getElementsByName("RECEIVE_NAMES")[0].value = strIPub.split("||")[0];
        document.getElementsByName("RECEIPT_LIST")[0].value = strIPub.split("||")[1];
    }
    var szReturn = '';
    var aRecDept = document.getElementsByName("RECEIVE_NAMES")[0].value.split("@");
    var sRecDept = aRecDept[0];
    var Include = "";
    if (sRecDept != null && sRecDept != '') {
        var aRec = sRecDept.split(";");
        for (var i1 = 0; i1 < aRec.length; i1++) {
            //szReturn += (szReturn!=''?", ":"")+(aRec[i].split(":")[1]);		
            if (aRec[i1].split(":")[2] == "Y") {
                Include = "(" + parent.menu.gLabel__recinfo_td2 + ")";
            }
            szReturn += (szReturn != '' ? ", " : "") + (m_oFormMenu.getLngLabel(aRec[i1].split(":")[1], false, "^")) + Include;
            Include = "";
        }
    }
    //협조자 목록
    sRecDept = aRecDept[1];
    if (sRecDept != null && sRecDept != '') {
        var aRec = sRecDept.split(";");
        for (var i = 0; i < aRec.length; i++) { szReturn += (szReturn != '' ? ", " : "") + (m_oFormMenu.getLngLabel(aRec[i].split(":")[1], false, "^")); }
    }
    //수신처 그룹 추가 
    sRecDept = aRecDept[2];
    if (sRecDept != null && sRecDept != '') {
        var aRec = sRecDept.split(";");
        for (var i = 0; i < aRec.length; i++) { szReturn += (szReturn != '' ? ", " : "") + (aRec[i].split(":")[1]); }
    }
    return szReturn;
}

function makeProcessor(urlXsl) {
    if (window.ActiveXObject) {
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
        oProcessor.importStylesheet(urlXsl);
        return oProcessor;
    }
}
function receiveGeneralQuery() {
    if (m_xmlHTTP.readyState == 4) {
        m_xmlHTTP.onreadystatechange = event_noop;
        if (m_xmlHTTP.responseXML.xml == "") {
        } else {
            var errorNode = m_xmlHTTP.responseXML.selectSingleNode("response/error");
            if (errorNode != null) {
                alert("Desc: " + errorNode.text);
            } else {

            }
        }
    }
}
/*
function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
m_xmlHTTP.open(sMethod,sUrl,bAsync);
m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
m_xmlHTTP.setRequestHeader("Content-type", sCType);
if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
}*/
function event_noop() { return (false); }
function evalXML(sXML) {
    if (!m_evalXML.loadXML(sXML)) {
        var err = m_evalXML.parseError;
        throw new Error(err.errorCode, "desc:" + err.reason + "\nsrctxt:" + err.srcText + "\nline:" + err.line + "\tcolumn:" + err.linepos);
    }
}
var aryComment = new Array();
function viewComment(idx) {
    var rgParams = null;
    rgParams = new Array();
    rgParams["objMessage"] = aryComment[idx];
    var nWidth = 400;
    var nHeight = 400;
    var sFeature = "dialogHeight:" + nHeight + "px;dialogWidth:" + nWidth + "px;status:no;resizable:yes;scrolling:no;help:no;";
    var strNewFearture = ModifyDialogFeature(sFeature);
    var vRetval = window.showModelessDialog("../ApvLineMgr/comment.aspx", rgParams, strNewFearture);
    //var vRetval = window.showModelessDialog("../ApvLineMgr/comment.aspx", rgParams, "dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;scrolling:no;help:no;");
}
function getSplitted(src, delim, idx) { var aSrc = src.split(delim); return (aSrc.length > idx ? aSrc[idx] : ""); }
function toUTF8(szInput) {
    var wch, x, uch = "", szRet = "";
    if (m_oFormMenu.btoUtf) {
        for (x = 0; x < szInput.length; x++) {
            wch = szInput.charCodeAt(x);
            if (!(wch & 0xFF80)) {
                szRet += "%" + wch.toString(16);
            }
            else if (!(wch & 0xF000)) {
                uch = "%" + (wch >> 6 | 0xC0).toString(16) +
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
    }
    return (szRet);
}
function InputDocLinks(szValue) {
    try {
        if (document.getElementsByName("DOCLINKS")[0].value == "") {
            document.getElementsByName("DOCLINKS")[0].value = szValue; G_displaySpnDocLinkInfo();
        }
        else {
            adddocitem(szValue);
        }
    }
    catch (e) {
    }
}
function G_displaySpnDocLinkInfo() {//수정본
    var szdoclinksinfo = "";
    var szdoclinks = "";
    if (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL") || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT") || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT") || parent.g_szEditable == true) {
        try { szdoclinks = document.getElementsByName("DOCLINKS")[0].value; } catch (e) { }
    } else {
        try { szdoclinks = document.getElementsByName("DOCLINKS")[0].value; } catch (e) { }
        if (szdoclinks == "") {
            var m_objXML = CreateXmlDocument();
            try { m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>" + getInfo("BODY_CONTEXT") + "</root>"); } catch (e) { m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>" + getInfo("BODY_CONTEXT") + "</root>"); }
            if (m_objXML.documentElement.selectSingleNode("DOCLINKS") == null)
            { szdoclinks = "" } else {
                szdoclinks = m_objXML.documentElement.selectSingleNode("DOCLINKS").text;
            }
            try { document.getElementsByName("DOCLINKS")[0].value = szdoclinks; } catch (e) { }
            //szdoclinks = m_objXML.documentElement.selectSingleNode("DOCLINKS").text;
        }
    }
    //DOCLINKS 값에 undefined 가 들어 가서 오류남. 원인 찾기전 임시로 작성
    szdoclinks = szdoclinks.replace("undefined^", "");
    szdoclinks = szdoclinks.replace("undefined", "");
    if (szdoclinks != "") {
        var adoclinks = szdoclinks.split("^");
        for (var i = 0; i < adoclinks.length; i++) {
            if (adoclinks[i].length > 0 && adoclinks[i] != "") {

                var adoc = adoclinks[i].split("@@@");
                var aForm = adoc[1].split(";");
                var objXML = CreateXmlDocument();
                objXML.loadXML(aForm[0]);
                var pibd1 = aForm[0];
                var piid = aForm[1];
                var bstate = aForm[2];
                var fmid = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('id');
                var fmnm = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('name');
                var fmpf = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('prefix');
                var fmrv = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('revision');
                var scid = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('schemaid');
                var fiid = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('instanceid');
                var fmfn = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('filename');

                var FormUrl = "http://" + document.location.host + "/CoviWeb/approval/forms/form.aspx";

                //2006.12.05 by wolf upload UI 변경 : 07. 7. 6. JSI
                //편집 모드인지 확인
                var bEdit = false;
                if (String(window.location).indexOf("_read.htm") > -1) {
                    bEdit = false
                } else {
                    bEdit = true;
                }

                if (bEdit) {
                    if (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL") || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT") || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT") || parent.g_szEditable == true) {
                        szdoclinksinfo += "<input type=checkbox id='chkDoc' name='_" + adoc[0] + "' value='" + adoc[0] + "'>";
                    }
                    szdoclinksinfo += "<span onmouseover='this.style.color=\"#2f71ba\";' onmouseout='this.style.color=\"#111111\";'  style='cursor:hand;'  onclick=\"window.open('";
                    szdoclinksinfo += FormUrl + "?mode=COMPLETE" + "&piid=" + piid + "&bstate=" + bstate + "&fmid=" + fmid + "&fmnm=" + toUTF8(fmnm) + "&fmpf=" + fmpf + "&fmrv=" + fmrv + "&fiid=" + fiid + "&scid=" + scid;
                    szdoclinksinfo += "','','width=800,height=600') \">" + adoc[2] + "</span>";

                } else {
                    if (bDisplayOnly) {
                        szdoclinksinfo += adoc[2];
                    } else {
                        szdoclinksinfo += "<span onmouseover='this.style.color=\"#2f71ba\";' onmouseout='this.style.color=\"#111111\";'  style='cursor:hand;'  onclick=\"window.open('";
                        szdoclinksinfo += FormUrl + "?mode=COMPLETE" + "&piid=" + piid + "&bstate=" + bstate + "&fmid=" + fmid + "&fmnm=" + toUTF8(fmnm) + "&fmpf=" + fmpf + "&fmrv=" + fmrv + "&fiid=" + fiid + "&scid=" + scid;
                        szdoclinksinfo += "','','width=800,height=600') \">" + adoc[2] + "</span>";
                    }
                    // 연결문서 구분짓기 위한 Comma 추가 : 07. 6. 11. JSI
                    if (i < adoclinks.length - 1) {
                        szdoclinksinfo += ", ";
                    }
                }


            }
            
        }

        // 조건문 추가 : 07. 7. 6. JSI
        if (bEdit) {
            if (szdoclinksinfo != "" && (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL")) || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT") || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT") || parent.g_szEditable == true) {
                szdoclinksinfo += "<a href='#' onclick='deletedocitem();'><font color='#009900'><b>" + m_oFormMenu.gLabel_link_delete + "<b></font></a>";
            }
        }
    }
    document.getElementById("DocLinkInfo").innerHTML = szdoclinksinfo;
}
//연결 문서 링크 파트
//문서 관리로 연결 하기 위해 넣어 두었음
function fnDocsView(productid, versionid, folderid) {
    var szURL = "/COVINet/COVIDocsNet/WEB/View/";
    szURL += "viewDocument_portal.aspx?productID=" + productid
	+ "&versionID=" + versionid + "&productType=DOCUMENT&folderID="
	+ folderid;
    szURL += "&LinkDocYN=Y"
    document.all['DOC_LINK_VIEW'].src = szURL;
}
function processSelectedRow(piid, bstate, fmid, fmnm, fmpf, fmrv, fiid, scid) {
    var strURL = "Form.aspx?mode=COMPLETE" + "&piid=" + piid + "&bstate=" + bstate
					+ "&fmid=" + fmid + "&fmnm=" + toUTF8(fmnm)
					+ "&fmpf=" + fmpf + "&fmrv=" + fmrv + "&fiid=" + fiid + "&scid=" + scid;
    openWindow(strURL, "newMessageWindow", 800, 600, 'resize');
}
function deletedocitem() {
    var adoclinks = document.getElementsByName("DOCLINKS")[0].value.split("^");
    var szdoclinksinfo = "";

    var tmp = "";
    if (chkDoc.length == null) {
        if (chkDoc.checked) {
            tmp = chkDoc.value;
            for (var i = adoclinks.length - 1; i >= 0; i--) {
                if (adoclinks[i] != null && adoclinks[i].indexOf(tmp) > -1) {
                    adoclinks[i] = null;
                }
            }
        }
    } else {
        for (var j = chkDoc.length - 1; j >= 0; j--) {
            if (chkDoc[j].checked) {
                tmp = chkDoc[j].value;
                for (var i = adoclinks.length - 1; i >= 0; i--) {
                    if (adoclinks[i] != null && adoclinks[i].indexOf(tmp) > -1) {
                        adoclinks[i] = null;
                    }
                }
            }
        }
    }
    for (var i = 0; i < adoclinks.length; i++) {
        if (adoclinks[i] != null) {
            if (szdoclinksinfo != "") {
                szdoclinksinfo += "^" + adoclinks[i];
            } else {
                szdoclinksinfo += adoclinks[i];
            }
        }
    }
    document.getElementsByName("DOCLINKS")[0].value = szdoclinksinfo;
    G_displaySpnDocLinkInfo();
}
function adddocitem(szAddDocLinks) {
    var adoclinks = document.getElementsByName("DOCLINKS")[0].value.split("^");
    var aadddoclinks = szAddDocLinks.split("^");
    var szdoclinksinfo = "";

    var tmp = "";
    for (var i = 0; i < aadddoclinks.length; i++) {
        if (aadddoclinks[i] != null) {
            var bexitdoclinks = false;
            for (var j = 0; j < adoclinks.length; j++) { if (aadddoclinks[i] == adoclinks[j]) { bexitdoclinks = true; } }
            if (!bexitdoclinks) adoclinks[adoclinks.length] = aadddoclinks[i];
        }
    }

    for (var i = 0; i < adoclinks.length; i++) {
        if (adoclinks[i] != null) {
            if (szdoclinksinfo != "") {
                szdoclinksinfo += "^" + adoclinks[i];
            } else {
                szdoclinksinfo += adoclinks[i];
            }
        }
    }
    document.getElementsByName("DOCLINKS")[0].value = szdoclinksinfo;
    G_displaySpnDocLinkInfo();
}
function setDocLinks() {
    var szdoclinksinfo = "";
    if (document.getElementsByName("DOCLINKS")[0].value != "") {
        var adoclinks = document.getElementsByName("DOCLINKS")[0].value.split("^");
        for (var i = 0; i < adoclinks.length; i++) {
            var adoc = adoclinks[i].split("@@@");
            if (szdoclinksinfo != "") {
                szdoclinksinfo += ",'" + adoc[0] + "'";
            } else {
                szdoclinksinfo += "'" + adoc[0] + "'";
            }
        }
    }
}
//파일 다운로드 관련 함수 추가
//covidownload컴포넌트 관련
function downloadfile() {
    var szURL = "../FileAttach/download.aspx";
    var strphygicalName = "";
    var strlocation = ""
    //ATTACH_FILE_INFO에서 업로드 파일 정보를 가져온다

    if (document.all['ATTACH_FILE_INFO'].value != "") {
        var r, res;
        var s = document.all['ATTACH_FILE_INFO'].value;

        res = /^^^/i;
        attFiles = s.replace(res, "");
        var m_oFileList = CreateXmlDocument();
        m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + attFiles);
        var elmRoot, elmList, elm, elmTaskInfo;
        elmRoot = m_oFileList.documentElement;
        if (elmRoot != null) {
            elmList = elmRoot.selectNodes("fileinfo/file");
            szAttFileInfo = "";
            for (var i = 0; i < elmList.length; i++) {
                elm = elmList.nextNode();

                if (elm.getAttribute("location").indexOf("/FrontStorage/") == -1) {
                    if (elm.getAttribute("state") != "DEL") {
                        strphygicalName = strphygicalName + elm.getAttribute("location").substring(elm.getAttribute("location").lastIndexOf("/") + 1, elm.getAttribute("location").length) + ":" + elm.getAttribute("size") + ";";
                        strlocation = elm.getAttribute("location").substring(0, elm.getAttribute("location").lastIndexOf("/") + 1);
                    }
                }
            }
        }
    }
    //phygicalName 
    //파일명:사이즈; 
    szURL = szURL + "?phygicalName=" + escape(strphygicalName);
    //location
    //파일 업로드한 경로 backstorage
    //단 앞에 서버 명은 없음으로download.aspx 에서 처리한다
    szURL = szURL + "&location=" + strlocation;

    CoviWindow(szURL, '', '280', '363', 'fix');
}
//다운로드 관련 창을 띄우기 위해서
//cfl.js에 있는 것과 같다 
//하지만 인클루드가 안되서리 결국 넣어 주었다
function CoviWindow(fileName, windowName, theWidth, theHeight, etcParam) {
    var objNewWin;
    var x = theWidth;
    var y = theHeight;

    var sx = window.screen.width / 2 - x / 2;
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
    if (sy < 0) {
        sy = 0;
    }
    var sz = ",top=" + sy + ",left=" + sx;
    if (windowName == "newMessageWindow" || windowName == "") {
        windowName = new String(Math.round(Math.random() * 100000));
    }
    var strNewFearture = ModifyWindowFeature(etcParam + ",width=" + x + ",height=" + y + sz);
    objNewWin = window.open(fileName, windowName, strNewFearture);
    //objNewWin = window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}
//양식내 지급결재 처리
function chk_urgent_onclick() {
    try { m_oFormMenu.chk_urgent.checked = CHKREQTYPE.checked; } catch (e) { }
    m_oFormMenu.chk_urgent_onclick();
}
//문서번호 발번 시 관련 값 체크
function checkDocNo(bTemp) {
    if (!bTemp) {
        try {
            if (FORMNO.value == "") {
                alert("양식 내 서식번호가 없습니다.");
                return false;
            } else if (txtDeptCode.value == "") {
                alert("양식 내 과명이 없습니다.");
                return false;
            } else if (txtDocCode.value == "") {
                alert("양식 내 분류가 없습니다.");
                return false;
            }
            //현해당 조건은 전체 체크 최하순으로 가야함

            else if (txtDocCodeDesc != null) {
                if (txtDocCodeDesc.value == "") {
                    alert("양식 내 직무가 없습니다.");
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return true;
            }
        } catch (e) {
            alert(e.message)
            return false;
        }
    }
}

//의견 여부 체크 및 링크
function chk_comment_link(user_code, skind) {alert(2);
    var spath = "";
    if (skind == null) {
    } else {
        switch (skind) {
            case "R": spath = "and @KIND='receive'"; break;
            case "charge": spath = "and @KIND='initiator'"; break;
            default: spath = "and @KIND!='initiator' and @KIND!='receive'"; break;
        }
    }
    if (elmComment.selectSingleNode("//comment_list[@USER_ID='" + user_code + "' " + spath + "]/@USER_ID") != null) {
        var sUrl = "../Comment/comment_view.aspx?form_inst_id=" + getInfo("fiid");
        return "&nbsp;<font color='red' size='2'>☜</font>";
    } else {
        return "";
    }
}

//내외부 변환 시 수신/참조자 삭제
function deleteRecCCInfos() {
    var sDivision = "";
    if (getInfo("fmpf") == "WF_CUCKOO_DEVELOP") {//부품개발요청서의 경우 처리
        try { sDivision = ((SUSIN_NO.value == "") ? "1" : String(parseInt(SUSIN_NO.value) + 1)); } catch (e) { }
    }
    var deleteinfo = "<REQUEST><MODE>FORM</MODE><FORM_INST_ID>" + getInfo("fiid") + "</FORM_INST_ID><DIVISION>" + sDivision + "</DIVISION></REQUEST>";
    var xmlhttp = CreateXmlHttpRequest();
    xmlhttp.open("post", "../Circulation/DelMail.aspx", false);
    xmlhttp.setRequestHeader("Accept-Language", "ko");
    xmlhttp.setRequestHeader("Content-type", "text/xml");

    xmlhttp.send(deleteinfo);

    if (xmlhttp.responseXML.selectSingleNode("//response").text == "OK") {
    } else {
        alert(m_oFormMenu.gMessage256); //"일시적인 문제로 인해 삭제가 취소되었습니다."
    }
    try { document.getElementById("CCLine").innerHTML = ""; } catch (e) { }
}


//결재선 그리기 (Section형태) - PC용
function displayApvListCols(oApvList) {
    
    if (getInfo('fmpf') != 'WF_FORM_DRAFT' && getInfo('fmpf') != 'WF_FORM_COORDINATE' && getInfo('fmpf') != 'WF_FORM_MEMO') {
        if (document.getElementById("workrequestdisplay") != undefined) {
            document.getElementById("workrequestdisplay").style.display = "none";
        }
    }
    var elmRoot, elmList, elm, elmTaskInfo, elmReceive, ApvList, emlSkip, elmCmtList; // 2006.01.16 elmListR, elmR : 다중수신부서 여부를 알기위한 nodes 변수
    var Apvlines = "";
    var strDate, strFieldName, strwidth, strColTD, LastDate;
    var rtnPOSLine, stepList, TaskInfo, writeTaskInfo, rtnConsentLine, ConsentLine;

    elmRoot = oApvList.documentElement;
    if (elmRoot != null) {
        //상단 결재선 그리기 Start
        //  결재선 DTD는 <division divisiontype="...."><step></step></division><division divisiontype="...."><step></step></division>로
        //  구성되어있다. 따라서 n개의 divison을 divisiontype에 따라 결재선에 표시하면 된다.
        elmList = elmRoot.selectNodes("division");

        for (var i = 0; i < elmList.length; i++) {
            stepList = elmList.nextNode();
            rtnPOSLine = getApvListCols(stepList);
            TaskInfo = stepList.getAttribute("divisiontype");

            if (getInfo("scPRec") != 0 || getInfo("scDRec") != 0 && getInfo("scIPub") == 0) //신청서
            {
                if (TaskInfo == "send") {
                    //신청부서
                    writeTaskInfo = m_oFormMenu.gLabel_reqdept;
                }
                else if (TaskInfo == "receive") {
                    //처리부서
               
                    writeTaskInfo = m_oFormMenu.gLabel_managedept;

                }
            }
            else if (getInfo("scPRec") == 0 && getInfo("scDRec") == 0 && getInfo("scIPub") != 0)//협조문
            {
                if (TaskInfo == "send") {
                    //발의부서
                    writeTaskInfo = m_oFormMenu.gLabel_Propdept;
                }
                else if (TaskInfo == "receive") {
                    //수신부서
               
                    writeTaskInfo = m_oFormMenu.gLabel_Acceptdept;

                }
            }
            else if (getInfo("scPRec") == 0 && getInfo("scDRec") == 0 && getInfo("scIPub") == 0)//일반결재
            {
                writeTaskInfo = m_oFormMenu.gLabel_approver;
            }

            //개인결재선 적용 버튼 여부
            if (getInfo("scPRec") == 0 && getInfo("scDRec") == 0 && getInfo("scIPub") == 0)//일반결재
            {
                Apvlines += "<table><tr>"
                    + "<td id='displayApv" + i + "' align = 'left' width='190'> " + "<a onclick=\"if(ApvTable" + i + " != '' ){if (document.getElementById('ApvTable" + i + "').style.display == ''){document.getElementById('ApvTable" + i + "').style.display ='none';document.getElementById('span_ApvTable" + i + "').innerHTML = '<img src=" + m_oFormMenu.g_imgBasePath + "/COVI/common/btn/btn_up.gif>';}else{document.getElementById('ApvTable" + i + "').style.display ='';document.getElementById('span_ApvTable" + i + "').innerHTML = '<img src=" + m_oFormMenu.g_imgBasePath + "/COVI/common/btn/btn_down.gif>';}}\" style='cursor:hand;font-size:9pt;'>"
				    + writeTaskInfo + "<span id='span_ApvTable" + i + "' ><img src='" + parent.menu.g_imgBasePath + "/COVI/common/btn/btn_down.gif'></span> " + " </a>"
				    + "</td>" //결재선				
				    + "<td id='ApvlineButton' style='display:none'>"
				    + "<a onclick=\"if(ApvlineLayer" + i + " != '' ){if (document.getElementById('ApvlineLayer" + i + "').style.display == ''){document.getElementById('ApvlineLayer" + i + "').style.display ='none';document.getElementById('span_ApvlineLayer" + i + "').innerHTML = '<img src=" + m_oFormMenu.g_imgBasePath + "/Covi/common/btn/btn_icon_down.gif>';}else{eval(ApvlineLayer" + i + ").style.display ='';document.getElementById('span_ApvlineLayer" + i + "').innerHTML = '<img src=" + m_oFormMenu.g_imgBasePath + "/Covi/common/btn/btn_icon_up.gif>';}}\" style='cursor:hand;font-size:9pt;'><span id='span_ApvlineLayer" + i + "' ><img src='" + m_oFormMenu.g_imgBasePath + "/Covi/common/btn/btn_icon_down.gif'></span> " + " </a>"
                    + "</td>"
                    + "</tr></table>"
                    + "<div id='ApvlineLayer" + i + "' style='display:none; z-index:0; width:88px; position:absolute; height:68px'>"
                    + "<table width='100%' border='0' cellspacing='0' cellpadding='0'>"
                    + "  <tr>"
                    + "      <td>"
                    + "          <table width='400' height='103' border='0' cellpadding='1' cellspacing='1' bgcolor='#7975CA'>"
                    + "              <tr>"
                    + " 				    <td width='400'>"
                    + "  					<table width='395' height='99' border='0' align='center' cellpadding='0' cellspacing='0' bgcolor='#ffffff'>"
                    + "  						<tr>"
                    + "  							<td  style='padding-top:4px; padding-left:3px'>"
                    + "  								<div align='left' style='line-height:130%'>"
                    + "                                      <iframe id='iApvLine' name='iApvLine' width='100%' height='100%' frameborder='0' src='PrivateLineList.aspx' datasrc='PrivateLineList.aspx' style='PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px; scrollx:hidden;'></iframe>"
                    + "									</div>"
                    + "								</td>"
                    + " 							</tr>"
                    + " 						</table>"
                    + "					</td>"
                    + "				</tr>"
                    + " 			</table>"
                    + "      </td>"
                    + "  </tr>"
                    + "</table>"
                    + "</div>"
				    + "<table  id='ApvTable" + i + "'  class='table_7' summary='결재선' cellpadding='0' cellspacing='0'>"
				    + "	<tr >"
				    + "		<th>" + m_oFormMenu.gLabel_no + "</th>" //순  번 
				    + "		<th>" + m_oFormMenu.gLabel_dept + "</th>" //부서3
				    + "		<th>" + m_oFormMenu.gLabel_username + "</th>" //성  명4
				    + "		<th>" + m_oFormMenu.gLabel_jobtitle + "</th>" //직  책5
				    + "		<th>" + m_oFormMenu.gLabel_kind + "</th>" //종  류
				    + "		<th>" + m_oFormMenu.gLabel_state + "</th>" //상태2
				    + "		<th>" + m_oFormMenu.gLabel_approvdate + "</th>" // 결재일자
				    + "		<th>" + m_oFormMenu.gLabel_oriapprover + "</th>" //	원결재자  				    
				    + "	</tr>"
				    + rtnPOSLine + "</table><br>";

            } else {
                Apvlines += "<table><tr>"
                    + "<td id='displayApv" + i + "' align = 'left' width='190'> " + "<a onclick=\"if(ApvTable" + i + " != '' ){if (eval(ApvTable" + i + ").style.display == ''){eval(ApvTable" + i + ").style.display ='none';eval(span_ApvTable" + i + ").innerHTML = '<img src=" + m_oFormMenu.g_imgBasePath + "/covi/common/btn/btn_up.gif>';}else{eval(ApvTable" + i + ").style.display ='';eval(span_ApvTable" + i + ").innerHTML = '<img src=" + m_oFormMenu.g_imgBasePath + "/covi/common/btn/btn_down.gif>';}}\" style='cursor:hand;font-size:9pt;'>"
				    + writeTaskInfo + "<span id='span_ApvTable" + i + "' ><img src='" + m_oFormMenu.g_imgBasePath + "/Covi/common/btn/btn_down.gif'></span> " + " </a>"
				    + "</td>" //결재선                    
                    + "</tr></table>"
				    + "<table  id='ApvTable" + i + "' class='table_7' summary='결재선' cellpadding='0' cellspacing='0'>"
				    + "	<tr >"
				    + "		<th>" + m_oFormMenu.gLabel_no + "</th>" //순  번 
				    + "		<th>" + m_oFormMenu.gLabel_dept + "</th>" //부서3
				    + "		<th>" + m_oFormMenu.gLabel_username + "</th>" //성  명4
				    + "		<th>" + m_oFormMenu.gLabel_jobtitle + "</th>" //직  책5
				    + "		<th>" + m_oFormMenu.gLabel_kind + "</th>" //종  류
				    + "		<th>" + m_oFormMenu.gLabel_state + "</th>" //상태2
				    + "		<th>" + m_oFormMenu.gLabel_approvdate + "</th>" // 결재일자
				    + "		<th>" + m_oFormMenu.gLabel_oriapprover + "</th>" //	원결재자  		
				    + "	</tr>"
				    + rtnPOSLine + "</table><br>";
            }

        }
        document.getElementById("AppLine").innerHTML = Apvlines; // + '<scriptlanguage="javascript" type="text/javascript"><!-- function tdisplayApv(displayId){if(displayId !="" ){if (eval(displayId).style.display == ""){eval(displayId).style.display ="none";eval("span_" + displayId).innerHTML= "▲";}else{eval(displayId).style.display ="";eval("span_" + displayId).innerHTML= "▼";} }   }</script>';

        //참조자 출력
        var ccInfos = elmRoot.selectNodes("ccinfo");
        var sSendccInfos = "";
        var sRecccInfos = "";

        if (ccInfos.length > 0) {
            for (var i = 0; i < ccInfos.length; i++) {
                var sList = "";
                var ccInfo = ccInfos.nextNode();
                var sBelongTo = ccInfo.getAttribute("belongto");
                var ccList = ccInfo.childNodes;
                var ccListIndex = 0;
                var cc = ccList[ccListIndex]; ccListIndex++;
                while (cc != null) {
                    if (cc.hasChildNodes()) cc = cc.firstChild;
                    if (cc.nodeName == "person") {
                        sList += (sList.length > 0 ? ";" : "") + m_oFormMenu.getLngLabel(cc.getAttribute("ouname"), false) + " " + m_oFormMenu.getLngLabel(cc.getAttribute("title"), true) + " " + m_oFormMenu.getLngLabel(cc.getAttribute("name"), false);
                    } else if (cc.nodeName == "ou") {
                        sList += (sList.length > 0 ? ";" : "") + m_oFormMenu.getLngLabel(cc.getAttribute("name"), false);
                    } else if (cc.nodeName == "group") {
                        sList += (sList.length > 0 ? ";" : "") + m_oFormMenu.getLngLabel(cc.getAttribute("name"), false);
                    }

                    cc = ccList[ccListIndex]; ccListIndex++;
                }
                switch (sBelongTo) {
                    case "global": document.getElementById("CC").innerHTML = sList; break;
                    case "sender":
                        sSendccInfos += (sSendccInfos.length > 0 ? ";" : "") + sList;
                        document.getElementById("SendCC").innerHTML = sSendccInfos;
                        break;
                    case "receiver":
                        sRecccInfos += (sRecccInfos.length > 0 ? ";" : "") + sList;
                        document.getElementById("RecCC").innerHTML = sRecccInfos;
                        break;
                }
            }
        }
    }

    //개인결재선 적용 버튼 여부
    try {
        if (getInfo("scPRec") == 0 && getInfo("scDRec") == 0 && getInfo("scIPub") == 0)//일반결재
        {
            if (document.getElementById("ApvlineButton") != null) {
                document.getElementById("ApvlineButton").style.display = (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE") ? "inline" : "none";
            }
        }
    } catch (e) { }
    //상단 결재선 그리기 End

    //배포처 출력
    if (document.getElementById("RecLine") != null) { document.getElementById("RecLine").innerHTML = initRecList(); }
    try { G_displaySpnDocLinkInfo(); } catch (e) { }
    try { G_displaySpnRejectDocLinkInfo(); } catch (e) { }
    try { if (getInfo("scPM") == "1") G_displaySpnPMLinkInfo((getInfo("scPMV") == "" ? null : getInfo("scPMV"))); } catch (e) { }

}
// 협조 출력
function getApvListConsent(oApvStepList) {
    var elmRoot, elmList, elm, elmTaskInfo, elmReceive, ApvList, emlSkip, elmCmtList, elmListR, elmR; // 2006.01.16 elmListR, elmR : 다중수신부서 여부를 알기위한 nodes 변수
    var Apvlines = "";
    var strDate, strFieldName, strwidth, strColTD, LastDate;
    if (window.ActiveXObject) {
        elmList = oApvStepList.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='consult')]/ou/(peson|role)");
    } else {
        elmList = oApvStepList.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='consult')]/ou/*[name()!='taskinfo']");
    }
    var Apvlines = "";
    var ApvPOSLines = "";
    var Apvdecide = ""; 				//2005-12-05 신택상 대결,후열 등을 표시
    var ApvState = "";
    var ApvSignLines = "";
    var ApvDept = "";
    var ApvApproveNameLines = "";
    var ApvDateLines = "";
    var ApvCmt = "";
    var Cmts = "";
    var sTitle = "";
    var elmAudit;
    var OriginApprover = "";
    var nextelm;

    for (var i = 0; i < elmList.length; i++) {
        ApvSignLines = "&nbsp;";      //결재자 이름
        ApvCmt = "&nbsp;";            //사용자 코멘트 
        OriginApprover = "&nbsp;";    //원결재자
        sTitle = "&nbsp;";            //직책
        var sCode = ""; 								//사용자 아이디

        elm = elmList.nextNode();
        if (elm == null) { // 더이상 노드가 없으면 빠져나감
            break;
        }

        elmTaskInfo = elm.selectSingleNode("taskinfo");

        if (elmTaskInfo.getAttribute("visible") != "n") {
            if (elmTaskInfo.getAttribute("kind") != 'skip') {
                if (elmTaskInfo.getAttribute("kind") == 'charge') {
                    try {
                        sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("title"), true);
                    } catch (e) {
                        if (elm.nodeName == "role") {
                            sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                            //sTitle=sTitle.substr(sTitle.length-2);
                        }
                    }
                } else {
                    try {
                        sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("title"), true);
                        //sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
                    } catch (e) {
                        if (elm.nodeName == "role") {
                            sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                            //sTitle=sTitle.substr(sTitle.length-2);
                        }
                    }
                }
                strDate = elmTaskInfo.getAttribute("datecompleted");
                if (strDate == null) {
                    strDate = "";
                    ApvCmt = "";
                } else {
                    var assistcmt = elm.selectSingleNode("taskinfo/comment");
                    if (assistcmt != null) {
                        ApvCmt = assistcmt.text.replace(/\n/g, "<br />");
                    }
                }

                Apvdecide = m_oFormMenu.gLabel_apv; //"결재"
                if (elm.nodeName == "role")
                    try { sCode = elm.selectSingleNode("person").getAttribute("code"); } catch (e) { }
                else
                    sCode = elm.getAttribute("code");

                switch (elmTaskInfo.getAttribute("kind")) {
                    case "consent":
                        Apvdecide = m_oFormMenu.gLabel_consent; //"합의"
                        ApvSignLines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                        ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), true);
                        ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                        ApvDateLines = "";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                        break;
                }
                //2005-12-05 신택상 결재라인 양식 수정

                if (ApvCmt == "" || ApvCmt == "&nbsp;") {
                    ApvPOSLines = "<tr><td style='background:#FFFFFF;font-size:9pt;'  height='20'>" + Apvdecide + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;'  height='20'>" + ApvState + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;'  height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle + "</td><td style='background:#FFFFFF;font-size:9pt;' >"
				                   + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + OriginApprover + "</td></tr>" + ApvPOSLines;
                }
                else {
                    ApvPOSLines = "<tr><td style='background:#FFFFFF;font-size:9pt;'  height='20'>" + Apvdecide + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;'  height='20'>" + ApvState + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle + "</td><td style='background:#FFFFFF;font-size:9pt;' >"
				                   + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + "<tr><td style='background:#FFFFFF;font-size:9pt;' align='left' height='20' colspan='7' style='padding-left:10px'> " + ApvCmt + "</td></tr>" + ApvPOSLines;
                }
            }
        }
    }
    return ApvPOSLines;
}

// 결재라인 변경 (displayApvListCols에서 호출)
function getApvListCols(oApvStepList) {
    var elmRoot, elmStep, elmList, elm, elmTaskInfo, elmReceive, ApvList, emlSkip, elmCmtList, elmListR, elmR; // 2006.01.16 elmListR, elmR : 다중수신부서 여부를 알기위한 nodes 변수
    var Apvlines = "";
    var strDate, strFieldName, strwidth, strColTD, LastDate;
    elmListSteps = oApvStepList.selectNodes("step[(@routetype='approve' or @routetype='assist' or @routetype='receive' or @routetype= 'consult' or @routetype='audit')]");

    var Apvlines = "";
    var ApvPOSLines = "";
    var Apvdecide = ""; 				//2005-12-05 신택상 대결,후열 등을 표시
    var ApvState = "";
    var ApvSignLines = "";
    var ApvDept = "";
    var ApvApproveNameLines = "";
    var ApvDateLines = "";
    var ApvCmt = "";
    var ApvCmtHtml = "";
    var Cmts = "";
    var sTitle = "";
    var elmAudit;
    var OriginApprover = "";
    var nextelm;
    var cnt = 1;
    var ApvVisible;

    for (var ii = 0; ii < elmListSteps.length; ii++) {
        ApvSignLines = "&nbsp;";      //결재자 이름
        ApvCmt = "&nbsp;";            //사용자 코멘트 
        OriginApprover = "&nbsp;";    //원결재자
        sTitle = "&nbsp;";            //직책
        sCode = "";           //사용자 아이디

        elmStep = elmListSteps.nextNode();
        if (elmStep == null) { // 더이상 노드가 없으면 빠져나감
            break;
        }

        elmList = elmStep.selectNodes("ou");    //부서가져오기
        if (elmStep.getAttribute("unittype") == "ou") {
            ApvSignLines = "&nbsp;";      //결재자 이름
            ApvCmt = "&nbsp;";            //사용자 코멘트 
            OriginApprover = "&nbsp;";    //원결재자
            sTitle = "&nbsp;";            //직책
            sCode = "";           //사용자 아이디
            //부서단위처리
            //if(elm.firstChild.parentNode.parentNode.parentNode.getAttribute("routetype") == "assist"){Apvdecide = m_oFormMenu.gLabel_assist;} //"합 의"
            ////ApvSignLines += (strDate=="")?elm.getAttribute("name"): getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));

            //부서일 경우 for문 시작
            for (var ij = 0; ij < elmList.length; ij++) {
                elm = elmList.nextNode();
                if (elm == null) { // 더이상 노드가 없으면 빠져나감
                    break;
                }
                elmTaskInfo = elm.selectSingleNode("taskinfo");
                strDate = elmTaskInfo.getAttribute("datecompleted");
                if (strDate == null) {
                    strDate = ""; ApvCmt = "";
                }
                if (elm.parentNode.getAttribute("routetype") == "consult") { Apvdecide = m_oFormMenu.gLabel_DeptConsent; } //"부 서 합 의"
                if (elm.parentNode.getAttribute("routetype") == "assist") { Apvdecide = m_oFormMenu.gLabel_DeptAssist; } //"개 인 합 의"
                if (elm.parentNode.getAttribute("routetype") == "audit") { Apvdecide = m_oFormMenu.gLabel_audit; } //"감사"
                if (elm.parentNode.getAttribute("routetype") == "audit" && elm.parentNode.getAttribute("name") == "부서감사") { Apvdecide = m_oFormMenu.gLabel_dept_audit; }
                if (elm.parentNode.getAttribute("name") == "ExtType") { Apvdecide = m_oFormMenu.gLabel_ExtType; } //"심 의"
                ApvSignLines += (strDate == "") ? "" : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), "", strDate, false, elmTaskInfo.getAttribute("result"), false);
                ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                ApvDateLines = "";
                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;

                if (strDate == "" && elmTaskInfo.getAttribute("datereceived") != "") {
                    ApvVisible = "T";
                } else {
                    ApvVisible = "F";
                }

                if (ApvCmt == "" || ApvCmt == "&nbsp;") {
                    ApvPOSLines = "<tr style='font-family: Arial, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background:#FFFFFF;font-size:9pt;'>" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20' onclick='javascript:deptdisplayApv(\"INDEPT" + cnt + "\")' >" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle
	                               + "<td style='background:#FFFFFF;font-size:9pt;'>" + Apvdecide + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState + "</td>" + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + getInnerApvListCols(elm, ApvVisible, cnt) + ApvPOSLines;
                    cnt++;
                }
                else {
                    ApvPOSLines = "<tr style='font-family: Arial, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background:#FFFFFF;font-size:9pt;'>" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20' onclick='javascript:deptdisplayApv(\"INDEPT" + cnt + "\")' >" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle
	                               + "<td style='background:#FFFFFF;font-size:9pt;'>" + Apvdecide + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState + "</td>" + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + "<tr><td style='background:#FFFFFF;font-size:9pt;' align='left' height='20' colspan='8' style='padding-left:10px'> " + ApvCmt + "</td></tr>" + getInnerApvListCols(elm, ApvVisible, cnt) + ApvPOSLines;
                    cnt++;
                }
            }
            //부서일 경우 for문 끝
        } else if (elmStep.getAttribute("unittype") == "person") {

            if (window.ActiveXObject) {
                elmList = elmStep.selectNodes("ou/(person|role)"); //사람 가져오기
            } else {
                elmList = elmStep.selectNodes("ou/*[name()='person' or name()='role']"); //사람 가져오기
            }
            // 사람일 경우 for 문 시작	
            for (var i = 0; i < elmList.length; i++) {
                ApvSignLines = "&nbsp;";      //결재자 이름
                ApvCmt = "&nbsp;";            //사용자 코멘트 
                OriginApprover = "&nbsp;";    //원결재자
                sTitle = "&nbsp;";            //직책
                var sCode = "";           //사용자 아이디

                elm = elmList.nextNode();
                if (elm == null) { // 더이상 노드가 없으면 빠져나감
                    break;
                }

                elmTaskInfo = elm.selectSingleNode("taskinfo");

                if (elmTaskInfo.getAttribute("visible") != "n") {
                    if (elmTaskInfo.getAttribute("kind") != 'skip' && elmTaskInfo.getAttribute("kind") != "conveyance" && elmTaskInfo.getAttribute("kind") != "reference") {
                        if (elmTaskInfo.getAttribute("kind") == 'charge') {
                            try {
                                sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("title"), true);
                                //sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
                            } catch (e) {
                                if (elm.nodeName == "role") {
                                    sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                                    //sTitle=sTitle.substr(sTitle.length-2);
                                }
                            }
                        } else {
                            try {
                                sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("title"), true);
                                //sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
                            } catch (e) {
                                if (elm.nodeName == "role") {
                                    sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                                    //sTitle=sTitle.substr(sTitle.length-2);
                                }
                            }
                        }
                        strDate = elmTaskInfo.getAttribute("datecompleted");
                        if (strDate == null) {
                            strDate = "";
                            ApvCmt = "";
                        } else {
                            var assistcmt = elm.selectSingleNode("taskinfo/comment");
                            if (assistcmt != null) {
                                ApvCmt = assistcmt.text.replace(/\n/g, "<br>");
                                if (assistcmt != null) {
                                    ApvCmt = assistcmt.text.replace(/\n/g, "<br>");
                                    if (ApvCmt.indexOf("<br>") > -1) {
                                        ApvCmtHtml = "<td colspan='7' id='comment_hidden_" + sCode + cnt + "' ><table><tr>"
                                                    + "<td width='95%' style='background:#FFFFFF;font-size:9pt;' align='left' style='padding-left:10px'> " + ApvCmt.substring(0, ApvCmt.indexOf("<br>")) + "...</td>"
                                                    + "<td width='5%' style='background:#FFFFFF;font-size:9pt;cursor:hand' valign='top' onclick=\"javascript:Comment_view('" + sCode + cnt + "')\" >▼<td>"
                                                    + "</tr></table></td>"
                                                    + "<td colspan='7' id='comment_view_" + sCode + cnt + "' style='display:none'><table><tr>"
                                                    + "<td width='95%' style='background:#FFFFFF;font-size:9pt;' align='left' style='padding-left:10px'> " + ApvCmt + "</td>"
                                                    + "<td width='5%' style='background:#FFFFFF;font-size:9pt;cursor:hand' valign='top' onclick=\"javascript:Comment_hidden('" + sCode + cnt + "')\" >▲<td>"
                                                    + "</tr></table></td>"
                                    } else {
                                        ApvCmtHtml = "<td style='background:#FFFFFF;font-size:9pt;' align='left' height='20' colspan='6' style='padding-left:10px'> " + ApvCmt + "</td>";
                                    }
                                }
                            }
                        }

                        Apvdecide = m_oFormMenu.gLabel_approve; // "결 재"
                        if (elm.nodeName == "role")
                            try { sCode = elm.selectSingleNode("person").getAttribute("code"); } catch (e) { }
                        else
                            sCode = elm.getAttribute("code");

                        ApvKind = interpretKind(elmTaskInfo.getAttribute("kind"), elmTaskInfo.getAttribute("result"), elm.firstChild.parentNode.parentNode.parentNode.getAttribute("routetype"), elm.firstChild.parentNode.parentNode.parentNode.getAttribute("allottype"), elm.firstChild.parentNode.parentNode.parentNode.getAttribute("name"));
                        switch (elmTaskInfo.getAttribute("kind")) {
                            case "authorize":
                                ApvSignLines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                                ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                                ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                                ApvDateLines = "";
                                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                LastApv = "/";
                                LastApvName = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) + interpretResult(elmTaskInfo.getAttribute("result"));
                                LastDate = formatDate(strDate);
                                //ApvKind = "전결";
                                break;
                            case "substitute":
                                ApvSignLines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                                ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                                ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                                ApvDateLines = "";
                                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                //LastApv = getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));
                                LastApv = getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), false);
                                LastApvName = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) + interpretResult(elmTaskInfo.getAttribute("result"));
                                LastDate = formatDate(strDate);
                                //원결재자 가져오기
                                nextelm = elmList.nextNode();
                                OriginApprover = m_oFormMenu.getLngLabel(nextelm.getAttribute("name"), false);
                                //ApvKind = "대결";
                                break;
                            case "skip":
                                ApvSignLines += "/";
                                ApvDept = getAttribute("/");
                                ApvDateLines = "";
                                ApvDateLines += "&nbsp;";
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                break;
                            case "bypass":
                                ApvSignLines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                                ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                                ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                                ApvDateLines = "";
                                ApvDateLines += (LastDate == "") ? m_oFormMenu.gLabel_bypass : LastDate; //"후열"
                                ApvApproveNameLines += (LastApvName == "") ? m_oFormMenu.gLabel_bypass : LastApvName; //"후열"
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                break; //"후열"
                            case "review":
                                ApvSignLines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                                ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                                ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                                ApvDateLines = "";
                                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                break;
                            case "charge":
                                ApvSignLines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                                ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                                ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                                ApvDateLines = "";
                                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                break;
                            case "consent":
                                ApvSignLines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                                ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                                ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                                ApvDateLines = "";
                                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                break;
                            default:
                                ApvSignLines += (strDate == "") ? m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), false);
                                ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                                ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                                ApvDateLines = "";
                                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                        }

                        if (ApvCmt == "" || ApvCmt == "&nbsp;") {
                            ApvPOSLines = "<tr style='font-family: Arial, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background:#FFFFFF;font-size:9pt;'>" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle
			                               + "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState + "</td>" + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + ApvPOSLines;
                            cnt++;
                        }
                        else {
                            ApvPOSLines = "<tr style='font-family: Arial, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background:#FFFFFF;font-size:9pt;'>" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle
			                               + "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState + "</td>" + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + "<tr><td> " + ApvCmtHtml + "</td></tr>" + ApvPOSLines;
                            cnt++;
                        }
                    }
                }
            }
            //사람일 경우 for문 끝
        }
    }

    return ApvPOSLines;
}
// 가로 내부 결재선
function getInnerApvListCols(oApvStepList, DeptState, parentCnt) {
    var elmRoot, elmStep, elmList, elm, elmTaskInfo, elmReceive, ApvList, emlSkip, elmCmtList, elmListR, elmR; // 2006.01.16 elmListR, elmR : 다중수신부서 여부를 알기위한 nodes 변수
    var Apvlines = "";
    var strDate, strFieldName, strwidth, strColTD, LastDate;
    if (window.ActiveXObject) {
        elmList = oApvStepList.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='approve' or @routetype='assist' or @routetype='receive' or @routetype= 'consult' or @routetype='audit')]/ou/(person|role)");
    } else {
        elmList = oApvStepList.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='approve' or @routetype='assist' or @routetype='receive' or @routetype= 'consult' or @routetype='audit')]/ou/*[name()='person' or name()='role']");
    }

    var Apvlines = "";
    var ApvPOSLines = "";
    var Apvdecide = ""; 				//2005-12-05 신택상 대결,후열 등을 표시
    var ApvState = "";
    var ApvSignLines = "";
    var ApvDept = "";
    var ApvApproveNameLines = "";
    var ApvDateLines = "";
    var ApvCmt = "";
    var Cmts = "";
    var sTitle = "";
    var elmAudit;
    var OriginApprover = "";
    var nextelm;
    var cnt = 1;
    var sCode = "";

    // 사람일 경우 for 문 시작	
    for (var i = 0; i < elmList.length; i++) {
        ApvSignLines = "&nbsp;";      //결재자 이름
        ApvCmt = "&nbsp;";            //사용자 코멘트 
        OriginApprover = "&nbsp;";    //원결재자
        sTitle = "&nbsp;";            //직책
        sCode = "";           //사용자 아이디
        ApvKind = "";

        elm = elmList.nextNode();
        if (elm == null) { // 더이상 노드가 없으면 빠져나감
            break;
        }

        elmTaskInfo = elm.selectSingleNode("taskinfo");

        if (elmTaskInfo.getAttribute("visible") != "n") {
            if (elmTaskInfo.getAttribute("kind") != 'skip') {
                if (elmTaskInfo.getAttribute("kind") == 'charge') {
                    try {
                        sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("title"), true);
                        //sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
                    } catch (e) {
                        if (elm.nodeName == "role") {
                            sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                            //sTitle=sTitle.substr(sTitle.length-2);
                        }
                    }
                } else {
                    try {
                        sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("title"), true);
                        //sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
                    } catch (e) {
                        if (elm.nodeName == "role") {
                            sTitle = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                            //sTitle=sTitle.substr(sTitle.length-2);
                        }
                    }
                }
                strDate = elmTaskInfo.getAttribute("datecompleted");
                if (strDate == null) {
                    strDate = "";
                    ApvCmt = "";
                } else {
                    var assistcmt = elm.selectSingleNode("taskinfo/comment");
                    if (assistcmt != null) {
                        ApvCmt = assistcmt.text.replace(/\n/g, "<br>");
                    }
                }

                Apvdecide = m_oFormMenu.gLabel_approve; // "결 재"
                if (elm.nodeName == "role")
                    try { sCode = elm.selectSingleNode("person").getAttribute("code"); } catch (e) { }
                else
                    sCode = elm.getAttribute("code");
                ApvKind = interpretKind(elmTaskInfo.getAttribute("kind"), elmTaskInfo.getAttribute("result"), "", "", m_oFormMenu.gLabel_approve);

                switch (elmTaskInfo.getAttribute("kind")) {
                    case "authorize":
                        //Apvdecide = m_oFormMenu.gLabel_authorize; // "전 결";
                        ApvSignLines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                        ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                        ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                        ApvDateLines = "";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                        LastApv = "/";
                        LastApvName = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) + interpretResult(elmTaskInfo.getAttribute("result"));
                        LastDate = formatDate(strDate);
                        //ApvKind = "전결";
                        break;
                    case "substitute":
                        //Apvdecide = m_oFormMenu.gLabel_substitue; //"대 결";
                        ApvSignLines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                        ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                        ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                        ApvDateLines = "";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                        //LastApv = getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));
                        LastApv = getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), false);
                        LastApvName = m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) + interpretResult(elmTaskInfo.getAttribute("result"));
                        LastDate = formatDate(strDate);
                        //원결재자 가져오기
                        nextelm = elmList.nextNode();
                        OriginApprover = m_oFormMenu.getLngLabel(nextelm.getAttribute("name"), false);
                        //ApvKind = "대결";
                        break;
                    case "skip":
                        ApvSignLines += "/";
                        ApvDept = getAttribute("/");
                        ApvDateLines = "";
                        ApvDateLines += "&nbsp;";
                        ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                        //ApvKind = elmTaskInfo.getAttribute("kind");
                        break;
                    case "bypass":
                        //Apvdecide = m_oFormMenu.gLabel_bypass; //"후 열"
                        //2006.02.22 by wolf 후열자 이름 넣어주기
                        ApvSignLines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                        ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                        ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                        ApvDateLines = "";
                        ApvDateLines += (LastDate == "") ? m_oFormMenu.gLabel_bypass : LastDate; //"후열"
                        ApvApproveNameLines += (LastApvName == "") ? m_oFormMenu.gLabel_bypass : LastApvName; //"후열"
                        ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                        //ApvKind = "후열";
                        break; //"후열"
                    case "review":
                        //Apvdecide = m_oFormMenu.gLabel_review; //"후 결"
                        //ApvSignLines += (strDate=="")?m_oFormMenu.gLabel_review: getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result")); // "후결"
                        //ApvSignLines += (strDate=="")?m_oFormMenu.gLabel_review: getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false); // "후결"
                        ApvSignLines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                        ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                        ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                        ApvDateLines = "";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                        //ApvKind = "후결";						
                        break;
                    case "charge":
                        //Apvdecide = parent.menu.gLabel_apv;  //기안자 //"결 재"
                        ApvSignLines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                        ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                        ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                        ApvDateLines = "";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                        //ApvKind = "담당";
                        break;
                    case "consent":
                        //Apvdecide = "참조"; 
                        ApvSignLines += m_oFormMenu.getLngLabel(elm.getAttribute("name"), false);
                        ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                        ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                        ApvDateLines = "";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                        break;
                    default:
                        //합의
                        //							if(elm.firstChild.parentNode.parentNode.parentNode.getAttribute("routetype") == "assist")
                        //							{
                        //							    // 순차 병렬 따로 설정한다.
                        //							    switch(elm.firstChild.parentNode.parentNode.parentNode.getAttribute("allottype")){
                        //					            case "parallel":
                        //					                Apvdecide = m_oFormMenu.gLabel_ParallelAssist; //병렬
                        //					            break;
                        //					            case "serial":
                        //					                Apvdecide = m_oFormMenu.gLabel_serialAssist;  //순차
                        //					            break;
                        //					            default:
                        //					                Apvdecide = m_oFormMenu.gLabel_assist;
                        //					            }
                        //							}
                        //ApvSignLines += (strDate=="")?elm.getAttribute("name"): getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));
                        ApvSignLines += (strDate == "") ? m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), false);
                        ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
                        ApvDept = m_oFormMenu.getLngLabel(elm.getAttribute("ouname"), false);
                        ApvDateLines = "";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                        //ApvKind = interpretResult(elmTaskInfo.getAttribute("result"));
                }

                if (DeptState == "T") //내부결재 진행중에만 보이기
                {
                    if (ApvCmt == "" || ApvCmt == "&nbsp;") {
                        ApvPOSLines = "<tr id='INDEPT" + parentCnt + "' style='font-family: Arial, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background-color:#f5ebe1; color:#142460;'>" + parentCnt + "-" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle
	                                   + "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState + "</td>" + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + ApvPOSLines;
                        cnt++;
                    }
                    else {
                        ApvPOSLines = "<tr id='INDEPT" + parentCnt + "' style='font-family: Arial, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background-color:#f5ebe1; color:#142460;'>" + parentCnt + "-" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle
	                                   + "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState + "</td>" + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + "<tr id='INDEPT" + parentCnt + "' ><td style='background:#FFFFFF;font-size:9pt;' align='left' height='20' colspan='8' style='padding-left:10px'> " + ApvCmt + "</td></tr>" + ApvPOSLines;
                        cnt++;
                    }
                } else {
                    if (ApvCmt == "" || ApvCmt == "&nbsp;") {
                        ApvPOSLines = "<tr id='INDEPT" + parentCnt + "' style='font-family: Arial, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;display:none;'><td style='background-color:#f5ebe1; color:#142460;'>" + parentCnt + "-" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle
	                                   + "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState + "</td>" + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + ApvPOSLines;
                        cnt++;
                    }
                    else {
                        ApvPOSLines = "<tr id='INDEPT" + parentCnt + "' style='font-family: Arial, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;display:none;'><td style='background-color:#f5ebe1; color:#142460;'>" + parentCnt + "-" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle
	                                   + "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState + "</td>" + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + "<tr id='INDEPT" + parentCnt + "' style='display:none'  ><td style='background:#FFFFFF;font-size:9pt;' align='left' height='20' colspan='8' style='padding-left:10px'> " + ApvCmt + "</td></tr>" + ApvPOSLines;
                        cnt++;
                    }
                }

            }
        }
    }
    //사람일 경우 for문 끝

    return ApvPOSLines;
}

function tdisplayApv(displayId) {
    if (displayId != "") {
        if (document.getElementById(displayId).style.display == "") {
            document.getElementById(displayId).style.display = "none";
            document.getElementById("span_" + displayId).innerHTML = "▲";

        } else {
            document.getElementById(displayId).style.display = "";
            document.getElementById("span_" + displayId).innerHTML = "▼";
        }
    }
}

/* 문서관리시스템 분류선택창 OPEN 시작 */
function OpenDocClass() {
    if (m_oFormMenu.gDocboxMenu == "T") {
        fnPopUpModal("../../Admin/Approval_Admin/DocboxFolderMgr/DocBoxTreeSelect.aspx", 400, 380);
    } else {
        fnPopUpModal("../../ExtensionService/Doc/DM_Folder_List.aspx?approvalYN=Y", 400, 380);
    }
    //--기존소스입니다.--    
    //var strResult = fnPopUpModal("../../ExtensionService/Doc/DM_Folder_List.aspx",400,380);
    //    if( strResult != undefined  && strResult != "" && strResult != null )
    //    {
    //        if (strResult!=""){
    //            var strvalue = strResult.split('|');
    //            DOC_CLASS_NAME.value = strvalue[0];//분류체계 명
    //            DOC_CLASS_ID.value = strvalue[1]; //분류체계 아이디
    //        }
    //    }else 
    //    {
    //        alert("분류 폴더를 선택해 주세요")
    //    }
}

function fnPopUpModal(modalUrl, modalWidth, modalHeight) {
    var ModalStyle = "dialogWidth:" + modalWidth + "px;dialogHeight:" + modalHeight + "px;status=no;scroll=no";
    var strResult;
    try {
        var pWidth = 400;
        var pHeight = 380;
        var options = 'width=' + pWidth;
        options += ' ,height=' + pHeight;
        options += ' ,left=' + (screen.availWidth - pWidth) / 2;
        options += ' ,top=' + (screen.availHeight - pHeight) / 2;
        options += ' ,scrollbars=no';
        options += ' ,titlebar=no';
        options += ' ,resizable=no';
        options += ' ,Status=no';
        options += ' ,toolbar=no';

        var strNewFearture = ModifyWindowFeature(options);
        strResult = window.open(modalUrl, "", strNewFearture);
        //strResult = window.open(modalUrl, "", options);

        //--기존소스입니다.--          
        //strResult = window.showModalDialog(modalUrl, window,ModalStyle);
    }
    catch (exception) {
        alert(exception.description);
    }
    //return strResult;
}
/* 문서관리시스템 분류선택창 끝 */
/*** 업무의뢰 선택 시작 ***/
function OpenWorkRequest() {
    openWindow("../../ExtensionService/Taskmgr/TM_TaskApproval.aspx", "workRequest", 800, 550, "resize");
}
function DelWorkRequest() {
    document.getElementsByName("WORKREQUEST_ID")[0].value = "";
    document.getElementsByName("WORKREQUEST_NAME")[0].value = "";
}

function getTaskID(strTaskID) {
    if (strTaskID != ";") {
        document.getElementsByName("WORKREQUEST_ID")[0].value = strTaskID.split(";")[1];
        document.getElementsByName("WORKREQUEST_NAME")[0].value = strTaskID.split(";")[0];
    }
}
/*** 업무의뢰 선택 끝 ***/

/*** 사업장 쿼리 조회 요청 ***/
function initENTPART() {
    var connectionname = "FORM_DEF_ConnectionString";
    var pXML = "dbo.usp_wfform_regionlist";
    var aXML = "<param><name>ENT_CODE</name><type>varchar</type><length>100</length><value><![CDATA[" + getInfo("etid") + "]]></value></param>";
    var sPostBody = "<Items><connectionname>" + connectionname + "</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>" + aXML + "</Items>";
    var sTargetURL = "../getXMLQuery.aspx";
    requestHTTP("POST", sTargetURL, true, "text/xml", receiveFORMQuery, sPostBody);

}
/*** 사업장 쿼리 조회 결과 처리 ***/
function receiveFORMQuery() {
    if (m_xmlHTTP.readyState == 4) {
        m_xmlHTTP.onreadystatechange = event_noop;
        if (m_xmlHTTP.responseXML == null) {
            //alert(m_xmlHTTP.responseText);
        } else {
            var xmlReturn = m_xmlHTTP.responseXML;
            var elmlist = xmlReturn.selectNodes("response/NewDataSet/Table");
            var elm;
            for (var i = 0; i < elmlist.length; i++) {
                elm = elmlist.nextNode();
                var oOption = document.createElement("option");
                document.getElementsByName("SEL_ENTPART")[0].options.add(oOption);
                if (elm.selectSingleNode("NAME") != null) {
                    oOption.text = elm.selectSingleNode("NAME").text;
                    oOption.value = elm.selectSingleNode("REGION_CODE").text;
                }
            }
            if ((getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE")) {
                if (document.getElementsByName("SEL_ENTPART")[0].value == "") {
                    document.getElementsByName("SEL_ENTPART")[0].value = getInfo("etid");
                }
            }
            if (elmlist.length > 1) {
                document.getElementById("partdisplay").style.display = "";
            }
        }
        delay(1000);
        setDocLevel();
    }
}
/*** 보안등급 쿼리 조회 결과 처리 ***/
function receiveDocLevelQuery() {
    if (m_xmlHTTP.readyState == 4) {
        m_xmlHTTP.onreadystatechange = event_noop;
        if (m_xmlHTTP.responseXML.xml == "") {

        } else {
            var xmlReturn = m_xmlHTTP.responseXML;
            var elmlist = xmlReturn.selectNodes("response/NewDataSet/Table");
            var elm;
            for (var i = 0; i < elmlist.length; i++) {
                elm = elmlist.nextNode();

                makeCBOobject(elm.selectSingleNode("ID_ACLLIST").text, getSplitted(elm.selectSingleNode("NM_ACLLISTNAME").text, "_", 1), document.getElementsByName("DOC_LEVEL")[0]);
            }
            if (getInfo("DOC_LEVEL") == undefined) {
                document.getElementsByName("DOC_LEVEL")[0].selectedIndex = 0;
                try { document.getElementsByName("DOC_LEVEL_NAME")[0].value = document.getElementsByName("DOC_LEVEL")[0].text } catch (e) { }
            } else {
                setDefaultCBOobject(getInfo("DOC_LEVEL"), document.getElementsByName("DOC_LEVEL")[0]);
            }
        }
    }
}
//보안등급 선택
function DOC_LEVEL_Change(obj) {
    try { document.getElementsByName("DOC_LEVEL_NAME")[0].value = obj[obj.selectedIndex].text } catch (e) { }
}
function G_displaySpnRejectDocLinkInfo() {//수정본
    var szdoclinksinfo = "";
    var szdoclinks = "";
    if (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE") {
        if (document.getElementsByName("REJECTDOCLINKS")[0] != null) {
            try { szdoclinks = document.getElementsByName("REJECTDOCLINKS")[0].value; } catch (e) { } 
        }
    } else {
        if (document.getElementsByName("REJECTDOCLINKS")[0] != null) {
            try { szdoclinks = document.getElementsByName("REJECTDOCLINKS")[0].value; } catch (e) { } 
        }
        if (szdoclinks == "") {
            var m_objXML = CreateXmlDocument();
            try { m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?>" + getInfo("BODY_CONTEXT")); } catch (e) { m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>" + getInfo("BODY_CONTEXT") + "</root>"); }
            if (m_objXML.documentElement.selectSingleNode("REJECTDOCLINKS") != null) szdoclinks = m_objXML.documentElement.selectSingleNode("REJECTDOCLINKS").text;
        }
    }
    //반송함에서 열려진 문서인 경우
    if (m_oFormMenu.m_RejectDocLink != "") {
        if (szdoclinks.indexOf(m_oFormMenu.m_RejectDocLink) == -1) {
            if (szdoclinks != "") {
                szdoclinks += "^" + m_oFormMenu.m_RejectDocLink;
            } else {
                szdoclinks = m_oFormMenu.m_RejectDocLink;
            }
            if (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE") {
                document.getElementsByName("REJECTDOCLINKS")[0].value = szdoclinks;
            }
        }
    }
    if (szdoclinks == null) { szdoclinks = ""; }
    if (szdoclinks != "") {
        var adoclinks = szdoclinks.split("^");
        for (var i = 0; i < adoclinks.length; i++) {
            var adoc = adoclinks[i].split("@@@");

            var aForm = adoc[1].split(";");
            var objXML = CreateXmlDocument();
            objXML.loadXML(aForm[0]);
            var pibd1 = aForm[0];
            var piid = aForm[1];
            var bstate = aForm[2];
            var fmid = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('id');
            var fmnm = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('name');
            var fmpf = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('prefix');
            var fmrv = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('revision');
            var scid = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('schemaid');
            var fiid = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('instanceid');
            var fmfn = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('filename');
            szdoclinksinfo += "<a style='cursor:hand' onClick=\"processSelectedRow(\'" + piid + "\',\'" + bstate + "\',\'" + fmid + "\',\'" + fmnm + "\',\'" + fmpf + "\',\'" + fmrv + "\',\'" + fiid + "\',\'" + scid + "\')\">" + adoc[3] + "-" + adoc[2] + "</a>&nbsp;&nbsp;";
        }
    }
    if (document.getElementById("RejectDocLinkInfo") != null) document.getElementById("RejectDocLinkInfo").innerHTML = szdoclinksinfo;
}

function setDisplayApvlineLayer(isDisplay) {
    if (isDisplay == 1) {
        document.getElementById("ApvlineLayer").style.display = "inline";
    } else if (isDisplay == 2) {
        document.getElementById("ApvlineLayer").style.display = "none";
    }
}
//프로세스 메뉴얼 추가

function InputPMLinks(szPMV) {
    var szHTML = "";
    if (getInfo("scPM") == "1") {
        G_displaySpnPMLinkInfo(szPMV, (szPMV == null ? false : true));
    }
}
function G_displaySpnPMLinkInfo(szPMV, bView) {//수정본
    var szdoclinksinfo = "";
    var szdoclinks = "";
    if (szPMV != null) {
        szdoclinks = szPMV;
    } else {
        if (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL") || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT") || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT") || parent.g_szEditable == true) {
            try { szdoclinks = PMLINKS.value; } catch (e) { }
        } else {
            try { szdoclinks = PMLINKS.value; } catch (e) { }
            if (szdoclinks == "") {
                var m_objXML = CreateXmlDocument();
                try { m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>" + getInfo("BODY_CONTEXT") + "</root>"); } catch (e) { m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>" + getInfo("BODY_CONTEXT") + "</root>"); }
                szdoclinks = m_objXML.documentElement.selectSingleNode("PMLINKS").text;
            }
        }
    }
    if (szdoclinks != "") {
        var adoclinks = szdoclinks.split("^");
        for (var i = 0; i < adoclinks.length; i++) {
            var aForm = adoclinks[i].split(";");
            var pmid = aForm[0];
            var pmnm = aForm[1];
            var FormUrl = "http://" + document.location.host + "/CoviBPM/COVIBPMNet/BPD/Common/BPDefiner/ProcessPool/ProcessMapView.aspx?Popup=true&";

            // 편집 모드인지 확인
            var bEdit = false;
            if (String(window.location).indexOf("_read.htm") > -1) { bEdit = false } else { bEdit = true; }
            if (bEdit) {
                if (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL") || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT") || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT") || parent.g_szEditable == true) {//getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"
                    if (getInfo("scPMV") == "") {
                        szdoclinksinfo += "<input type=checkbox id='chkPM' name='_" + pmid + "' value='" + pmid + "'>";
                    }
                }
            }
            szdoclinksinfo += "<span onmouseover='this.style.color=\"#2f71ba\";' onmouseout='this.style.color=\"#111111\";'  style='cursor:hand;'  onclick=\"window.open('";
            szdoclinksinfo += FormUrl + "ProcessID=" + pmid;
            szdoclinksinfo += "','','width=800,height=600') \">" + pmnm + "</span>";
            if (i < (adoclinks.length - 1)) { szdoclinksinfo += ", "; }
        }
        if (bEdit) {
            if (szdoclinksinfo != "" && (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL")) || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT") || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT") || parent.g_szEditable == true) {//getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"
                if (getInfo("scPMV") == "") { szdoclinksinfo += "<a href='#' onclick='deletepmitem();'><font color='#009900'><b>" + m_oFormMenu.gLabel_delete + "<b></font></a>"; }
            }
        }
    }
    document.getElementById("PMLinkInfo").innerHTML = szdoclinksinfo;
    if (document.getElementById("PMLinkInfo").innerHTML != "") {
        if (document.getElementById("trPMLinkInfo") != undefined) {
            document.getElementById("trPMLinkInfo").style.display = "";
        }
    }
}
function deletepmitem() {
    var adoclinks = PMLINKS.value.split("^");
    var szdoclinksinfo = "";

    var tmp = "";
    if (chkPM.length == null) {
        if (chkPM.checked) {
            tmp = chkPM.value;
            for (var i = adoclinks.length - 1; i >= 0; i--) {
                if (adoclinks[i] != null && adoclinks[i].indexOf(tmp) > -1) {
                    adoclinks[i] = null;
                }
            }
        }
    } else {
        for (var j = chkPM.length - 1; j >= 0; j--) {
            if (chkPM[j].checked) {
                tmp = chkPM[j].value;
                for (var i = adoclinks.length - 1; i >= 0; i--) {
                    if (adoclinks[i] != null && adoclinks[i].indexOf(tmp) > -1) {
                        adoclinks[i] = null;
                    }
                }
            }
        }
    }
    for (var i = 0; i < adoclinks.length; i++) {
        if (adoclinks[i] != null) {
            if (szdoclinksinfo != "") {
                szdoclinksinfo += "^" + adoclinks[i];
            } else {
                szdoclinksinfo += adoclinks[i];
            }
        }
    }
    PMLINKS.value = szdoclinksinfo;
    G_displaySpnPMLinkInfo();
}
//양식 이름 옆의 쪼그만 버튼 시작 2008.01
function AnchorPosition_getPageOffsetLeft(el) {
    var ol = el.offsetLeft;
    while ((el = el.offsetParent) != null) { ol += el.offsetLeft; }
    return ol;
}
function AnchorPosition_getPageOffsetTop(el) {
    var ot = el.offsetTop;
    while ((el = el.offsetParent) != null) { ot += el.offsetTop; }
    return ot;
}

function displayminimenu(obj) {
    minimenu(obj, -100, 10, obj.value);
}
function minimenu__(f1, diffx, diffy, szvalue) {
    //x = (document.layers) ? loc.pageX : event.clientX;
    //y = (document.layers) ? loc.pageY : event.clientY;
    var x = 0; var y = 0;
    var sH = 0; var sW = 0;
    if (document.getElementById) {
        if (isNaN(window.screenX)) {
            x = window.screenLeft;
            y = window.screenTop;
        } else {
            x = AnchorPosition_getPageOffsetLeft(f1) + 10;
            y = AnchorPosition_getPageOffsetTop(f1) + 10;
        }
    }
    else if (document.all) {
        x = event.clientX;
        y = event.clientY;
        sH = parseInt(document.body.scrollTop);
        sW = parseInt(document.body.scrollLeft);
    }
    else if (document.layers) {
        x = loc.pageX;
        y = loc.pageY;
        sH = parseInt(document.body.scrollTop);
        sW = parseInt(document.body.scrollLeft);
    }

    //document.getElementById("minifmmenu").style.pixelTop	= sH+y+diffy;
    //document.getElementById("minifmmenu").style.pixelLeft	= sW+x+diffx;
    document.getElementById("minifmmenu").style.top = sH + y + diffy + "px";
    document.getElementById("minifmmenu").style.left = sW + x + diffx + "px";
    f1.src = (document.getElementById("minifmmenu").style.display == "block") ? m_oFormMenu.g_imgBasePath + "/Covi/common/btn/btn_icon_down.gif" : m_oFormMenu.g_imgBasePath + "/Covi/common/btn/btn_icon_up.gif";
    document.getElementById("minifmmenu").style.display = (document.getElementById("minifmmenu").style.display == "block") ? "none" : "block";
    if (document.getElementById("minifmmenu").style.display == "none") {
        document.getElementById("dropForm").style.display = "none"
    }
    if (document.getElementById("minifmmenu").style.display == "block") {
        var oContextHTML = document.getElementById("frmminimenu").contentDocument.getElementById("divminemenu_Main");
        if (oContextHTML != null) {
            oContextHTML.style.display = "";

            var h = oContextHTML.offsetHeight;
            var w = oContextHTML.offsetWidth;
            document.getElementById("minifmmenu").style.width = w + "px";
            document.getElementById("minifmmenu").style.height = h + "px";
        }
    }
    if (m_oFormMenu.document.getElementById("btReUse").title == "1") {//재사용일 경우 타양식 내용 복사 안보임
        document.getElementById("frmminimenu").contentDocument.getElementById("dCopy").style.display = "none";
    }
}
function minimenu(f1, diffx, diffy, szvalue) {
    //debugger;

    var x = 0; var y = 0;
    var sH = 0; var sW = 0;
    if (document.getElementById) {
        if (isNaN(window.screenX)) {
            //			x=window.screenLeft;
            //			y = window.screenTop;
            x = (document.layers) ? loc.pageX : event.clientX;
            y = (document.layers) ? loc.pageY : event.clientY;
        } else {
            x = AnchorPosition_getPageOffsetLeft(f1) + 10;
            y = AnchorPosition_getPageOffsetTop(f1) + 10;
        }
    }
    else if (document.all) {
        x = event.clientX;
        y = event.clientY;
        sH = parseInt(document.body.scrollTop);
        sW = parseInt(document.body.scrollLeft);
    }
    else if (document.layers) {
        x = loc.pageX;
        y = loc.pageY;
        sH = parseInt(document.body.scrollTop);
        sW = parseInt(document.body.scrollLeft);
    }

    if (window.ActiveXObject) {
        document.getElementById("minifmmenu").style.pixelTop = sH + y + diffy;
        document.getElementById("minifmmenu").style.pixelLeft = sW + x + diffx;
    } else {
        document.getElementById("minifmmenu").style.top = sH + y + diffy + "px";
        document.getElementById("minifmmenu").style.left = sW + x + diffx + "px";
    }f
    f1.src = (document.getElementById("minifmmenu").style.display == "block") ? m_oFormMenu.g_imgBasePath + "/Covi/common/btn/btn_icon_down.gif" : m_oFormMenu.g_imgBasePath + "/Covi/common/btn/btn_icon_up.gif";
    document.getElementById("minifmmenu").style.display = (document.getElementById("minifmmenu").style.display == "block") ? "none" : "block";
    if (document.getElementById("minifmmenu").style.display == "none") {
        document.getElementById("dropForm").style.display = "none"
    }
    if (document.getElementById("minifmmenu").style.display == "block") {
        //debugger;
        if (window.ActiveXObject) {
            var oContextHTML = frmminimenu.document.all["divminemenu_Main"];
        } else {
            var oContextHTML = document.getElementById("frmminimenu").contentDocument.getElementById("divminemenu_Main");
        }
        if (oContextHTML != null) {
            oContextHTML.style.display = "";

            var h = oContextHTML.offsetHeight;
            var w = oContextHTML.offsetWidth;
            document.getElementById("minifmmenu").style.width = w + "px";
            document.getElementById("minifmmenu").style.height = h + "px";
            document.getElementById("divminifmmenu").style.width = w + "px";
            document.getElementById("divminifmmenu").style.height = h + "px"; //20111020
        }
    }
    if (m_oFormMenu.document.getElementById("btReUse").title == "1") {//재사용일 경우 타양식 내용 복사 안보임
        if (window.ActiveXObject) {
            frmminimenu.document.getElementById("dCopy").style.display = "none";
        } else {
            document.getElementById("frmminimenu").contentDocument.getElementById("dCopy").style.display = "none";
        }
    }
}
//타양식으로 내용 복사 2008.05 강성채
function copyDiff(diffx, diffy, obj) {
    sH = parseInt(document.body.scrollTop);
    sW = parseInt(document.body.scrollLeft);

    document.getElementById("dropForm").style.Top = sH + diffy;
    document.getElementById("dropForm").style.Left = sW + diffx;

    document.getElementById("dropForm").style.display = (document.getElementById("dropForm").style.display == "block") ? "none" : "block";
    if (document.getElementById("dropForm").style.display == "block") {
        var oContextHTML = document.getElementById("nDropForm").document.getElementById("divDifferform");
        if (oContextHTML != null) {
            oContextHTML.style.display = "";

            var h = oContextHTML.offsetHeight;
            var w = oContextHTML.offsetWidth;
            document.getElementById("dropForm").style.width = w;
            document.getElementById("dropForm").style.height = h;
        }
    }
}

//양식 이름 셋팅 + 양식 이름 옆의 쪼그만 버튼 
function initheadname(szfmnm, bContextMenu) {
    var szheadname = szfmnm;
    if (m_oFormMenu.document.getElementById("btModify").title == "1") {//편집모드일경우 버튼 안보임
        if (bContextMenu) {
            szheadname += '<img src=\"' + m_oFormMenu.g_imgBasePath + '/Covi/common/btn/btn_temp_space.gif" align="abmiddle" alt="" />'; //이미지를 뺄경우 디자인이 틀어져서 빈이미지 넣음
        }
    }
    else {
        if (bContextMenu) {
            //szheadname += '&nbsp;<img src=\"' + m_oFormMenu.g_imgBasePath + '/Covi/common/btn/btn_icon_down.gif" align="abmiddle" alt="" onclick="displayminimenu(this)"  id="btn_formhead" />';
            szheadname += '<img src=\"' + m_oFormMenu.g_imgBasePath + '/Covi/common/btn/btn_temp_space.gif" align="abmiddle" alt="" />'; //버튼 뺌 (빈이미지로 대체) 2012-12-06 HIW
        }
    }
    return szheadname;
}

function setTagFreeBug() {
    if (getInfo("BODY_CONTEXT") != undefined) {     //기안,임시저장으로 저장된 값 setting        
        setBodyContext(getInfo("BODY_CONTEXT"));
        try { G_displaySpnDocLinkInfo(); } catch (e) { }
    } else {//양식 생성 시 입력한 본문내역 조회            
        if (getInfo("fmbd") != "undefined") {
            try { var dom = tbContentElement.getDom(); dom.body.innerHTML = getInfo("fmbd"); } catch (e) { }
        }
    }
}
//MS Presence
function randomPIndex() {
    var ranNum;
    ranNum = Math.floor(Math.random() * 100000);
    return ranNum;
}

function getPresence(szpersoncode, szid, szsipaddress) {
    var szreturn = ""
    if (getInfo("mobileyn") == "Y") {
    } else {
        if (!m_print) {
            if (bPresenceView) {
                szreturn = "<span>";
                szreturn += "<img src='/GWImages/common/namecontrol_images/unknown.gif'  style='border-width:0px;' align='absmiddle'  covimode='imgctxmenu' onload='";
                szreturn += "	IMNRC(\"" + ((szsipaddress != null) ? szsipaddress : szpersoncode + m_oFormMenu.gMailSuffix) + "\", this);' id=\"ctl00_ContentPlaceHolder1_GridView1_ctl" + randomPIndex() + "_presence\" />";
                szreturn += "	</span>&nbsp;";
            }
            else {
                szreturn = "&nbsp;";
            }
        }
    }
    //return szreturn;
    return "";
}

var sCommentHtml = "";
var bCommentViewFirst = true;
var bgetCommentView = true;

//의견 표시
function getCommentView(elmComment) {
    
    /*
    if (document.getElementById("tdCommentView") != null) {
        document.getElementById("tdCommentView").innerHTML = "";
        sCommentHtml = "";
        //if (sCommentHtml!="") bCommentViewFirst=false;    // 2008.9.25 by 강효정 이 코드가 들어가면 인쇄버튼 누를 때마다 똑같은 의견이 중복되서 보이게 됨.

        if (bCommentViewFirst) {//alert(0);
            sCommentHtml += '<table class="table_3" summary="결재의견" cellpadding="0" cellspacing="0">';
            sCommentHtml += '<tr><th style="width:16%">결재구분</th>';
            sCommentHtml += '<th style="width:26%">결재자</th>';
            sCommentHtml += '<th style="width:18%">결재일시</th>';
            sCommentHtml += '<th style="width:40%">결재의견</th></tr>';
        }
        var elm, sGubun;
        var assistcmt, sJobTitle, sJobPosition, sResult1, sResult2;
        for (var i = 0; i < elmComment.length; i++) {
            sCommentHtml += '<tr>';
            elm = elmComment[i];

            sJobTitle = m_oFormMenu.getLngLabel(elm.parentNode.parentNode.getAttribute("title"), true);
            sJobPosition = m_oFormMenu.getLngLabel(elm.parentNode.parentNode.getAttribute("position"), true);

            sGubun = elm.parentNode.parentNode.parentNode.parentNode;

            if (sJobTitle == "") {
                sViewJob = sJobPosition;
            } else {
                sViewJob = sJobTitle;
            }

            //결재유형1
            if (sGubun.getAttribute("unittype") == "person" && sGubun.getAttribute("routetype") != "consult" && sGubun.getAttribute("allottype") == "parallel") {
                sResult1 = m_oFormMenu.gLabel_approve; //"동시결재";
            }
            else if (sGubun.getAttribute("unittype") == "ou" && sGubun.getAttribute("routetype") == "assist") {
                sResult1 = m_oFormMenu.gLabel_DeptConsent;
            } else {
                sResult1 = sGubun.getAttribute("name");
            }

            //결재유형2
            if (sGubun.getAttribute("routetype") == "assist" && sGubun.getAttribute("unittype") == "person") {
                sResult2 = elm.parentNode.getAttribute("result");
            } else if (sGubun.getAttribute("routetype") == "assist" && elm.parentNode.getAttribute("result") == "") {
                sResult2 = elm.parentNode.parentNode.parentNode.selectSingleNode("taskinfo").getAttribute("result");
            } else {
                sResult2 = elm.parentNode.getAttribute("status");
            }
            switch (sResult2) {
                case "rejected": sResult2 = m_oFormMenu.gLabel_reject; break; //"반송"
                case "completed": sResult2 = m_oFormMenu.gLabel_apv; break; //"승인"
                case "reserved": sResult2 = m_oFormMenu.gLabel_hold; break; //"보류"
                case "agreed": sResult2 = m_oFormMenu.gLabel_assist; break; //"합의"
                case "disagreed": sResult2 = m_oFormMenu.gLabel_disagree; break; //"이견"   
                case "none": sResult2 = ""; break; //"대상아님"
                default: sResult2 = sResult2; break;
            }

            assistcmt = elm.text.replace(/\n/g, "<br>");
            sCommentHtml += '<td style="font-size: 9pt;font-family: Arial, Dotum; padding-left: 10px;">' + sResult1 + '(' + sResult2 + ')</td>';
            sCommentHtml += '<td style="font-size: 9pt;font-family: Arial, Dotum; padding-left: 3px;">' + m_oFormMenu.getLngLabel(elm.parentNode.parentNode.getAttribute("ouname"), false) + '/' + m_oFormMenu.getLngLabel(elm.parentNode.parentNode.getAttribute("name"), false) + '/' + sViewJob + '</td>';
            //sCommentHtml += '<td style="font-size: 9pt;padding-left: 3px;">'+ formatDate2(elm.getAttribute("datecommented")) +'</td>';
            sCommentHtml += '<td style="font-size: 9pt;font-family: Arial, Dotum; padding-left: 3px;">' + formatDate2(elm.parentNode.getAttribute("datecompleted")) + '</td>';
            sCommentHtml += '<td style="font-size: 9pt;font-family: Arial, Dotum; text-align:left; padding-left: 10px;">' + assistcmt + '</td>';
            sCommentHtml += '</tr>';
        }
        document.getElementById("tdCommentView").style.display = "";
        document.getElementById("tdCommentView").innerHTML = sCommentHtml + '</table>';
    }
    */
    
    //이수그룹용 의견표시 (2012-11-09 HIW)
    if (document.getElementById("tdCommentView") != null) {
        document.getElementById("tdCommentView").innerHTML = "";
       
        if (m_oFormMenu.gProcessKind == "Cooperate") {//jkh 2015-04-17 협조프로세스와 신청프로세스 분기
            sCommentHtml = "";
            //if (sCommentHtml!="") bCommentViewFirst=false;    // 2008.9.25 by 강효정 이 코드가 들어가면 인쇄버튼 누를 때마다 똑같은 의견이 중복되서 보이게 됨.
        }
            if (bCommentViewFirst) {//alert(0);
                //sCommentHtml += '<table class="table_3" summary="결재의견" cellpadding="0" cellspacing="0">';
                
                sCommentHtml += '<table class="table_8" summary="결재의견" cellpadding="0" cellspacing="0">';  //HIW
            }
        

        var sStr = "";  //추가 HIW
        if (getInfo("uslng") == "ko-KR")
            sStr = "의 의견"
       
        var elm, sGubun;
        var assistcmt, sJobTitle, sJobPosition, sResult1, sResult2;
        //debugger;
        $(elmComment).each(function (k, elm) {
            //2014-04-29 hyh 추가
            var flag = true;
            if ($(elm)[0].getAttribute("comment_Dept") == null) {
                //2014-05-13 hyh 수정    
                flag = true;
                /*
                if ($(elm)[0].getAttribute("comment_Dept") == getInfo("dpid")) {
                flag = true;
                } 
                else {
                flag = false;
                }
                */
                //2014-05-13 hyh 수정 끝
            }
            else {
                //2014-05-13 hyh 수정
                /*
                if ($(elm)[0].getAttribute("comment_Dept") != getInfo("dpdn")) {
                flag = false;
                }
                */

                if ($(elm)[0].getAttribute("comment_Dept") == getInfo("dpid") || $(elm)[0].getAttribute("comment_Dept") == getInfo("dpdn")) {
                    flag = true;
                }
                else {
                    flag = true;
                }
                //2014-05-13 hyh 수정 끝
            }

            if (flag) {
                //2014-04-29 hyh 추가 끝
                sCommentHtml += '<tr>';
                //elm = elmComment[i];
                var vvv = $(elm).parent().parent().attr("title");
                sJobTitle = m_oFormMenu.getLngLabel($(elm).parent().parent().attr("title"), true);
                sJobPosition = m_oFormMenu.getLngLabel($(elm).parent().parent().attr("position"), true);
                sGubun = $(elm).parent().parent().parent().parent();

                if (sJobTitle == "") {
                    sViewJob = sJobPosition;
                } else {
                    sViewJob = sJobTitle;
                }

                //결재유형1
                if (sGubun.attr("unittype") == "person" && sGubun.attr("routetype") != "consult" && sGubun.attr("allottype") == "parallel") {
                    sResult1 = m_oFormMenu.gLabel_approve; //"동시결재";

                }
                else if (sGubun.attr("unittype") == "ou" && sGubun.attr("routetype") == "assist") {
                    sResult1 = m_oFormMenu.gLabel_DeptConsent;

                } else {
                    sResult1 = sGubun.attr("name");
                }

                //결재유형2
                if (sGubun.attr("routetype") == "assist" && sGubun.attr("unittype") == "person") {
                    sResult2 = $(elm).parent().attr("result");
                } else if (sGubun.attr("routetype") == "assist" && $(elm).parent().attr("result") == "") {
                    sResult2 = $(elm).parent().parent().parent().find("taskinfo").attr("result");
                } else {
                    sResult2 = $(elm).parent().attr("status");
                }

                switch (sResult2) {
                    case "rejected": sResult2 = m_oFormMenu.gLabel_reject; break; //"반송"
                    case "completed": sResult2 = m_oFormMenu.gLabel_apv; break; //"승인"
                    case "reserved": sResult2 = m_oFormMenu.gLabel_hold; break; //"보류"
                    case "agreed": sResult2 = m_oFormMenu.gLabel_assist; break; //"합의"
                    case "disagreed": sResult2 = m_oFormMenu.gLabel_disagree; break; //"이견"   
                    case "none": sResult2 = ""; break; //"대상아님"
                    default: sResult2 = sResult2; break;
                }

                //== 수신부서에서는 수신부서 의견만 보이게 (2012-11-22 HIW) ======
                var bProceed = false;

                if (sRecDeptUserYN == "Y") {
                    if ($(elm).parent().parent().parent().parent().parent().attr("divisiontype") == "receive" && getInfo("dpid") == $(elm).parent().parent().parent().parent().parent().attr("oucode"))  //수신부서코멘트이고 로그인사용자부서가 수신부서인 경우
                    {
                        bProceed = true;
                    }
                    else {
                        bProceed = false;
                    }
                }
                else {
                    bProceed = true;
                }
                //===============================================================



                //2015-02-09 hyh 추가		
                //if ((getInfo("gloct") != "DEPART" && getInfo("mode") != "COMPLETE") || (getInfo("mode") == "REDRAFT")) {
                //2015-02-09 hyh 추가 끝		
                if (bProceed) {
                    //2014-06-18 hyh 추가
                    //if(getInfo("mode") != "RECAPPROVAL") 
                    //{                    		    
                    //2014-06-18 hyh 추가 끝
                    //debugger;
                    gCommentCnt++;  //보여줄 코멘트 갯수 (2012-11-23 HIW)
                    assistcmt = $(elm).text().replace(/\n/g, "<br>");
                    sCommentHtml += '<td align="left" style="font-size: 9pt;font-family: Arial, Dotum; padding-left: 10px;padding-top: 3px;padding-bottom: 3px;padding-right: 10px;"> ';

                    //20130911 hyh 수정
                    /*
                    sCommentHtml += '[' + formatDate($(elm).parent().attr("datecompleted"), "D") + ']&nbsp;&nbsp;';  //날짜   //+ sResult1 + '(' + sResult2 + ')  //결과상태값
                    //2013-07-10 hyh 수정
                    //2013-04-23 hyh 추가
                    //if ($(elm).attr("relatedresult") == "rejected") sStr = "의 반송사유";
                    if ($(elm).attr("relatedresult") == "rejected" || $(elm).attr("relatedresult") == "rejectedto") sStr = "의 반송사유";
                    //2013-04-23 hyh 추가 끝
                    //2013-07-10 hyh 수정 끝
                    sCommentHtml += m_oFormMenu.getLngLabel($(elm).parent().parent().attr("ouname"), false) + " " + m_oFormMenu.getLngLabel($(elm).parent().parent().attr("name"), false) + " " + sJobPosition + sStr;
                    */




                    if (document.location.href.indexOf('read.htm') > -1 && getInfo("commentlist").indexOf("rejectedtodept") > -1) {
                        //debugger;
                        var m_Comment = CreateXmlDocument();
                        m_Comment.loadXML("<?xml version='1.0' encoding='utf-8'?>" + getInfo("commentlist"));
                        var m_CommentList = m_Comment.selectNodes("WF_COMMENT/comment_list");
                        //for (var i = 0; i < m_CommentList.length; i++) {
                        var comment_list = m_CommentList[m_CommentList.length - 1].getAttribute("INSERT_DATE").replace("T", " ").substring(0, m_CommentList[m_CommentList.length - 1].getAttribute("INSERT_DATE").replace("T", " ").indexOf("."));
                        var commentList = m_CommentList[m_CommentList.length - 1].getAttribute("COMMENT");
                        if (m_CommentList[m_CommentList.length - 1].getAttribute("COMMENT").indexOf("rejectedtodept") > -1) {
                            var dpdn = commentList.split("&")[2];
                            var usdn = commentList.split("&")[3];
                            var uspn = commentList.split("&")[5]; //20150806 부서 이름 수정 

                            sCommentHtml += '[' + formatDate(comment_list, "D") + ']&nbsp;&nbsp;';  //날짜   //+ sResult1 + '(' + sResult2 + ')  //결과상태값
                            if ($(elm).attr("relatedresult") == "rejected" || $(elm).attr("relatedresult") == "rejectedto") sStr = "의 반송사유";

                            //2014-07-29 hyh 수정
                            //2014-08-14 hyh 수정
                            /*
                            //sCommentHtml += m_oFormMenu.getLngLabel($(elm).parent().parent().attr("ouname"), false) + " " + m_oFormMenu.getLngLabel($(elm).parent().parent().attr("name"), false) + " " + sJobPosition + sStr;
                            sCommentHtml += dpdn.split(";")[0] + " " + usdn.split(";")[0] + " " + uspn.split(";")[0] + sStr;
                            */

                            try {
                                if ($(elm).attr("relatedresult").indexOf("rejected") > -1) {

                                    sCommentHtml += dpdn.split(";")[0] + " " + usdn.split(";")[0] + " " + uspn.split(";")[0] + sStr;
                                }
                                else {

                                    sCommentHtml += m_oFormMenu.getLngLabel($(elm).parent().parent().attr("ouname"), false) + " " + m_oFormMenu.getLngLabel($(elm).parent().parent().attr("name"), false) + " " + sJobPosition + sStr;

                                    //부서내 반송 수정 2015-07-16 추가
                                    //if (m_oFormMenu.gProcessKind == "Cooperate") {
                                    //var DEPT = $(elm).attr("comment_Dept").split(";");

                                    //if (getInfo("dpdsn") != DEPT[0]) {
                                    // sCommentHtml = "";
                                    //}
                                    //}
                                    //부서내 반송 수정 2015-07-16 추가 끝

                                }
                            }
                            catch (e) {

                                //sCommentHtml += m_oFormMenu.getLngLabel($(elm).parent().parent().attr("ouname"), false) + " " + m_oFormMenu.getLngLabel($(elm).parent().parent().attr("name"), false) + " " + sJobPosition + sStr; //2015-08-06 부서내 반송의견을 위해서 주석
                                sCommentHtml += m_oFormMenu.getLngLabel($(elm).parent().parent().attr("ouname"), false) + " " + m_CommentList[m_CommentList.length - 1].getAttribute("USER_NAME").split(";")[0] + " " + m_CommentList[m_CommentList.length - 1].getAttribute("COMMENT").split("&")[4].split(";")[0] + sStr; //2015-08-06 부서내 반송의견 

                            }

                            //2014-08-14 hyh 수정 끝
                            //2014-07-29 hyh 수정 끝
                        }
                        //}
                    } else {

                        sCommentHtml += '[' + formatDate($(elm).parent().attr("datecompleted"), "D") + ']&nbsp;&nbsp;';  //날짜   //+ sResult1 + '(' + sResult2 + ')  //결과상태값
                        //2013-07-10 hyh 수정
                        //2013-04-23 hyh 추가
                        //if ($(elm).attr("relatedresult") == "rejected") sStr = "의 반송사유";
                        if ($(elm).attr("relatedresult") == "rejected" || $(elm).attr("relatedresult") == "rejectedto") sStr = "의 반송사유";
                        //2013-04-23 hyh 추가 끝
                        //2013-07-10 hyh 수정 끝
                        sCommentHtml += m_oFormMenu.getLngLabel($(elm).parent().parent().attr("ouname"), false) + " " + m_oFormMenu.getLngLabel($(elm).parent().parent().attr("name"), false) + " " + sJobPosition + sStr;


                    }

                    
                    //20130911 hyh 수정 끝
                    sCommentHtml += '<br>';
                    sCommentHtml += assistcmt;
                    sCommentHtml += '</td>';
                    //2014-06-18 hyh 추가
                    //}
                    //2014-06-18 hyh 추가 끝

                    if (sResult1) {
                        sCommentHtml = '';
                    }

                    //부서내 반송 수정 2015-08-06 추가
                    if (m_oFormMenu.gProcessKind == "Cooperate") {
                        if ($(elm).parent().parent().parent().parent().parent().attr("divisiontype") == "receive") {


                            if (getInfo("dpid") != $(elm).parent().parent().parent().parent().parent().attr("oucode")) {
                                sCommentHtml = "";
                            }
                        }
                    }
                    //부서내 반송 수정 2015-08-06 추가 끝



                }

                //2015-02-09 hyh 추가	
                //}
                //2015-02-09 hyh 추가 끝

                //2014-04-29 hyh 추가
            }
            //2014-04-29 hyh 추가 끝
        });
        
        document.getElementById("tdCommentView").style.display = "";
        document.getElementById("tdCommentView").innerHTML = sCommentHtml + '</table>';
        


    }
    
}

function G_displaySpnAttInfo_Mail() {//수정본
    var attFiles, fileLoc, szAttFileInfo;
    var displayFileName;
    var re = /_N_/g;

    szAttFileInfo = "";
    MultiDownLoadString = "";

    if (document.all['ATTACH_FILE_INFO'].value != "") {
        var r, res;
        var s = document.all['ATTACH_FILE_INFO'].value;
        res = /^^^/i;
        attFiles = s.replace(res, "");

        var fState;
        var m_oFileList = CreateXmlDocument(); ;
        m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + attFiles);
        var elmRoot, elmList, elm, elmTaskInfo;
        elmRoot = m_oFileList.documentElement;
        if (elmRoot != null) {
            elmList = elmRoot.selectNodes("fileinfo/file");

            szAttFileInfo = "&nbsp;&nbsp;";

            for (var i = 0; i < elmList.length; i++) {
                elm = elmList.nextNode();
                var filename = elm.getAttribute("name");
                var filesize = elm.getAttribute("size");
                var limitSize = m_oFormMenu.FormatStringToNumber(parseInt(filesize) / 1024);

                displayFileName = elm.getAttribute("name").substring(0, elm.getAttribute("name").lastIndexOf("."));
                displayFileName = displayFileName.replace(re, "&");
                //////////////////////////////////////////////////////////////////////////////
                if (elm.getAttribute("location").indexOf(".") > -1) {
                    //szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\"/CoviWeb/SiteReference/Common/covi_fileSingledown.aspx?usercode="+getInfo("usid")+"&filepath="+escape(elm.getAttribute("location").replace(new RegExp( "\\+", "g" ),"%2B"))  +":"+filesize+"&fmpf="+getInfo("fmpf")+ " \"  target=\'_blank\' ><b>" + elm.getAttribute("name") + " (" + limitSize + "KB)" + "</b></a>&nbsp;";
                    //szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<span onclick=\"javascript:PopListSingle(\'http://"+document.location.host+"/CoviWeb/SiteReference/Common/covi_fileSingledown.aspx?usercode="+getInfo("usid")+"&filepath=" + escape(elm.getAttribute("location").replace(new RegExp( "\\+", "g" ),"%2B")) +":"+filesize+ "\');\"  ><b>" + elm.getAttribute("name") + "</b></span>&nbsp;"; 
                    //szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<span onclick=\"javascript:PopListSingle(\'http://" + document.location.host + "/CoviWeb/SiteReference/Common/covi_fileSingledown.aspx?filepath=" + toUTF8(elm.getAttribute("location").replace(new RegExp("\\+", "g"), "%2B").replace("'", "\\%27") + ":" + filesize) + "\');\"  ><b>" + elm.getAttribute("name") + "</b></span>&nbsp;"; 
                    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;" + elm.getAttribute("name") + "&nbsp;";
                }
                //////////////////////////////////////////////////////////////////////////////

                if (i < elmList.length - 1) szAttFileInfo += ", ";
            }
        }
        document.getElementById("AttFileInfo").innerHTML = szAttFileInfo;
        document.getElementById("AttFileInfo").parentNode.children[0].innerHTML = m_oFormMenu.gLabel_AttachList;
    }
}
function G_displaySpnDocLinkInfo_Mail() {//메일 보내기(문서첨부링크 만들기)
    var szdoclinksinfo = "";
    var szdoclinks = "";
    if (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE") {
        try { szdoclinks = document.getElementsByName("DOCLINKS")[0].value; } catch (e) { }
    } else {
        try { szdoclinks = document.getElementsByName("DOCLINKS")[0].value; } catch (e) { }
        if (szdoclinks == "") {
            var m_objXML = CreateXmlDocument();
            try { m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>" + getInfo("BODY_CONTEXT") + "</root>"); } catch (e) { m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>" + getInfo("BODY_CONTEXT") + "</root>"); }
            if (m_objXML.documentElement.selectSingleNode("DOCLINKS") == null)
            { szdoclinks = "" } else {
                szdoclinks = m_objXML.documentElement.selectSingleNode("DOCLINKS").text;
            }
            try { document.getElementsByName("DOCLINKS")[0].value = szdoclinks; } catch (e) { }
        }
    }
    //2007.08 유유미 : DOCLINKS 값에 undefined 가 들어 가서 오류남. 원인 찾기전 임시로 작성
    //szdoclinks = szdoclinks.replace("undefined^","");
    //szdoclinks = szdoclinks.replace("undefined","");
    if (szdoclinks != "") {
        var adoclinks = szdoclinks.split("^");
        szdoclinksinfo = "&nbsp;&nbsp;";
        for (var i = 0; i < adoclinks.length; i++) {
            var adoc = adoclinks[i].split("@@@");
            var aForm = adoc[1].split(";");
            var objXML = CreateXmlDocument();
            objXML.loadXML(aForm[0]);
            if (objXML.xml != "") {
                var pibd1 = aForm[0];
                var piid = aForm[1];
                var bstate = aForm[2];
                var fmid = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('id');
                var fmnm = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('name');
                var fmpf = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('prefix');
                var fmrv = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('revision');
                var scid = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('schemaid');
                var fiid = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('instanceid');
                var fmfn = objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('filename');

                //2006.12.05 by wolf upload UI 변경 : 07. 7. 6. JSI
                // 편집 모드인지 확인
                var bEdit = false;
                if (String(window.location).indexOf("_read.htm") > -1) {
                    bEdit = false
                } else {
                    bEdit = true;
                }

                if (bEdit) {

                    if (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL") || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT") || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT") || parent.g_szEditable == true) {//getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"
                        szdoclinksinfo += "<input type=checkbox id='chkDoc' name='_" + adoc[0] + "' value='" + adoc[0] + "'>";

                    }
                    szdoclinksinfo += "<img height='14' src='/common/images/COVIPortalNet/i_clip.gif' width='7' align='absmiddle' />&nbsp;<a style='cursor:hand' href='" + processSelectedRow_Mail(piid, bstate, fmid, fmnm, fmpf, fmrv, fiid, scid) + "' target='_blank'><b>" + adoc[2] + "</b></a>&nbsp;&nbsp;";

                } else {
                    szdoclinksinfo += "<img height='14' src='/common/images/COVIPortalNet/i_clip.gif' width='7' align='absmiddle' />&nbsp;<a href='" + processSelectedRow_Mail(piid, bstate, fmid, fmnm, fmpf, fmrv, fiid, scid) + "' target='_blank'><b>" + adoc[2] + "</b></a>&nbsp;&nbsp;";

                    // 연결문서 구분짓기 위한 Comma 추가 : 07. 6. 11. JSI
                    if (i < adoclinks.length - 1) { szdoclinksinfo += ", "; }
                }
            }
        }

        // 조건문 추가 : 07. 7. 6. JSI
        if (bEdit) {

            if (szdoclinksinfo != "" && (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL")) || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT") || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT") || parent.g_szEditable == true) {//getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"

                szdoclinksinfo += "<a href='#' onclick='deletedocitem();'><img src='/GWImages/Common/attachicon/del.gif' border='0' style='vertical-align:middle;' /></a>";
            }
        }
    }
    document.getElementById("DocLinkInfo").innerHTML = szdoclinksinfo;
    try {
        parent.frames.document.getElementById("fileview").document.getElementById("DocLinkInfo").innerHTML = szdoclinksinfo;
        if (String(window.location).indexOf("_read.htm") > -1) { //조회페이지 일때만 첨부파일 영역 활성화
            var eTR = document.getElementById("DocLinkInfo").parentElement;
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
            var eTR = document.getElementById("DocLinkInfo").parentElement;
            while (eTR.tagName != "TABLE") {
                eTR = eTR.parentElement;
            }
            eTR.style.display = "";
            parent.main.rows = "40,*,0,0";
        }
    } catch (e) { }
}

//2010.01.28 yu2mi : 결재선 의견 접기 펼치기
function Comment_view(comment_id) {
    var objComment_hidden = eval('comment_hidden_' + comment_id);
    var objComment_view = eval('comment_view_' + comment_id);
    objComment_hidden.style.display = "none";
    objComment_view.style.display = "";
}

function Comment_hidden(comment_id) {
    var objComment_hidden = eval('comment_hidden_' + comment_id);
    var objComment_view = eval('comment_view_' + comment_id);
    objComment_hidden.style.display = "";
    objComment_view.style.display = "none";
}

function processSelectedRow_Mail(piid, bstate, fmid, fmnm, fmpf, fmrv, fiid, scid) {
    var strURL = "/coviweb/approval/forms/form.aspx?mode=COMPLETE" + "&piid=" + piid + "&bstate=" + bstate
					+ "&fmid=" + fmid + "&fmnm=" + toUTF8(fmnm)
					+ "&fmpf=" + fmpf + "&fmrv=" + fmrv + "&fiid=" + fiid + "&scid=" + scid
					+ "&hhdFrom=outlook&hhdBiz=APV&hhdRtUrl=FORM";
    return "http://" + window.location.host + strURL;
}


//결재선 그리기 (Table형태) - 안드로이드 모바일용 
function displayApvListNXpath(oApvList) {
    var elmRoot, elmdiv, elmList, elm, elmTaskInfo, elmReceive, ApvList, elmVisible, elmRecList;
    var Apvlines = "";
    var strDate, strFieldName, strwidth, strColTD, LastDate;
    //logo.src = "http://tstmaeil.com/COVINet/BackStorage/Approval/" + (getInfo("ENT_CODE")!=undefined?getInfo("ENT_CODE"):getInfo("etid"))+".gif";//회사 logo 처리
    elmRoot = oApvList.documentElement;
    if (elmRoot != null) {

        //=== 현사용자가 수신부서 결재선자인지의 유무 (HIW)
        if (m_oFormMenu.gProcessKind == "Cooperate") {  //협조프로세스
            $($.parseXML(elmRoot.xml)).find("division").each(function () {
                /*
                if ($(this).attr("divisiontype") == "receive") {
                $(this).find("step").each(function (j, stepNode) {
                if ($(stepNode).find("person").attr("code") == getInfo("ptid"))
                sRecDeptUserYN = "Y";
                });
                }
                */
                if ($(this).attr("divisiontype") == "receive" && $(this).attr("oucode") == getInfo("dpid")) {
                    sRecDeptUserYN = "Y";
                }
            });
        }
        //===============================================

        $(elmRoot).find("division").each(function (i, element) {
            if (i == 0) {
                elmList = $(element).find("step[routetype='approve'][name!='reference']  > ou > person");
                elmVisible = $(element).find("step[routetype='approve'][name!='reference'] > ou > person > taskinfo[visible='n']");

            } else {
                elmList = $(element).find("step[routetype='receive'][name!='reference']  > ou > person,role", "step[routetype='audit'][name!='reference']  > ou > person,role", "step[routetype='receive'][name!='reference']  > ou > person,role"); //(person|role)
                elmVisible = $(element).find("step[routetype='receive'][name!='reference'] > ou > (person,role) > taskinfo[visible='n']", "step[routetype='audit'][name!='reference'] > ou > (person,role) > taskinfo[visible='n']", "step[routetype='receive'][name!='reference'] > ou > (person,role) > taskinfo[visible='n']");
                if (elmList.length == 0) {
                    elmList = $(element).find("step[routetype='approve'][name!='reference']  > ou > person,role", "step[routetype='audit'][name!='reference']  > ou > person,role", "step[routetype='receive'][name!='reference']  > ou > person,role"); //(person|role)
                    elmVisible = $(element).find("step[routetype='approve'][name!='reference'] > ou > (person,role) > taskinfo[visible='n']", "step[routetype='audit'][name!='reference'] > ou > (person,role) > taskinfo[visible='n']", "step[routetype='receive'][name!='reference'] > ou > (person,role) > taskinfo[visible='n']");
                }
            }

            var elmComment = $(element).find("step > ou > person > taskinfo > comment");
            if ((bgetCommentView && elmComment.length > 0 && String(window.location).indexOf("_read.htm") > -1) || (bgetCommentView && elmComment.length > 0 && m_oFormMenu.sMody == true)) {
                if (m_print == false) getCommentView(elmComment);
            }

            //담당부서 (수신부서)
            if (getInfo("scPRec") == "1" || getInfo("scDRec") == "1" || getInfo("scChgr") == "1" || getInfo("scChgrOU") == "1") {//수신처가 있는경우 좌측:내부결재 우측 수신처 결재선
                //N단계 신청 결재선뿌려주기 201107
                if ($(elmRoot).find("division").length > 1) {
                    if (i == 0) { try { document.getElementById("LApvLine").innerHTML = getRequestApvListNXpath(elmList, elmVisible, "", false, m_oFormMenu.getLngLabel($(element).attr("ouname"), false)); } catch (e) { document.getElementById("AppLine").innerHTML = getRequestApvListNXpath(elmList, "", true, m_oFormMenu.getLngLabel($(element).attr("ouname"), false)); } }
                    if (i > 0) {
                        var sOUName = $(element).attr("ouname");
                        try { if (sOUName == null || sOUName == "") { sOUName = $(element).find("step > ou").attr("name"); } } catch (e) { }
                        //담당부서/담당업무뿌려주기    			        
                        if (elmList.length == 0) {
                            //document.getElementById("RApvLine").innerHTML = "<table bgcolor='#FFFFFF' border='1' bordercolor='#dc5f0a' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100;width:'><tr><td rowspan='5' width='25' height='100' align='center' style='color: #662800; font-family: Arial, Dotum; font-size: 12px; font-weight: bold; background: #f5ebe1;' nowrap='f'>" + m_oFormMenu.gLabel_managedept + "</td><td height='20' width='100' align='center' style='color: #662800; font-family: Arial, Dotum; font-size: 12px; font-weight: bold; background: #f5ebe1;'>&nbsp;</td></tr><tr><td height='50' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>" + m_oFormMenu.getLngLabel(sOUName, false) + "</td></tr><tr><td height='20'  align='center' valign='middle' style='font-size:8pt;'></td></tr><tr><td height='20' align='center' valign='middle' style='font-size:8pt;'></td></tr></table>";  // dc5f0a를 000000로 바꿈
                            //document.getElementById("RApvLine").innerHTML = "<table bgcolor='#FFFFFF' border='1' bordercolor='#dc5f0a' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100;width:'><tr><td rowspan='5' width='25' height='100' align='center' style='color: #662800; font-family: Arial, Dotum; font-size: 12px; font-weight: bold; background: #f5ebe1;' nowrap='f'>" + m_oFormMenu.gLabel_Acceptdept + "</td><td height='20' width='100' align='center' style='color: #662800; font-family: Arial, Dotum; font-size: 12px; font-weight: bold; background: #f5ebe1;'>&nbsp;</td></tr><tr><td height='50' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>" + m_oFormMenu.getLngLabel(sOUName, false) + "</td></tr><tr><td height='20'  align='center' valign='middle' style='font-size:8pt;'></td></tr><tr><td height='20' align='center' valign='middle' style='font-size:8pt;'></td></tr></table>";  // dc5f0a를 000000로 바꿈 , 처리부서를 수신부서로 변경(HIW)
                            document.getElementById("RApvLine").innerHTML = "<table class='table_1' cellSpacing='0' cellPadding='0' summary='서명'><tr><th class='tit'>" + m_oFormMenu.gLabel_Acceptdept + "</th><td><table class='table_1_1' cellspacing='0' summary='서명' cellpadding='0'><tr><th width='90'>&nbsp;</th></tr><tr><td style='FONT-STYLE: italic; FONT-FAMILY: Georgia, Times New Roman, Times, serif,gulim; COLOR: #4584c9; FONT-SIZE: 11pt; FONT-WEIGHT: bold' height='50' vAlign='middle' align='center'>" + m_oFormMenu.getLngLabel(sOUName, false) + "</td></tr><tr><td style='BORDER-TOP: #D6D7D6 1px solid;'>&nbsp;</td></tr><tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td></tr></table></td></tr></table>";  // dc5f0a를 000000로 바꿈 , 처리부서를 수신부서로 변경(HIW)
                        } else {
                            if (i == 1) {
                                try { document.getElementById("RApvLine").innerHTML = getRequestApvList(elmList, elmVisible, "", true, m_oFormMenu.getLngLabel(sOUName, false), true); } catch (e) { document.getElementById("RApvLine").innerHTML = getRequestApvListNXpath(elmList, "", true, m_oFormMenu.getLngLabel($(element).attr("ouname"), false)); }
                            } else {
                                var szPreRApvLine = document.getElementById("RApvLine").innerHTML;
                                document.getElementById("RApvLine").parentNode.style.height = String(90 * (i + 1)) + "px";
                                try { document.getElementById("RApvLine").innerHTML = szPreRApvLine + ((szPreRApvLine == "") ? "" : "<br />") + getRequestApvList(elmList, elmVisible, "", true, m_oFormMenu.getLngLabel(sOUName, false), true); } catch (e) { document.getElementById("AppLine").innerHTML = getRequestApvListNXpath(elmList, "", true, m_oFormMenu.getLngLabel($(element).attr("ouname"), false)); }
                            }
                        }
                    }
                    //N단계 신청 결재선뿌려주기 201107
                } else {
                    document.getElementById("LApvLine").width = "600px";
                    document.getElementById("RApvLine").width = "200px";
                    if (i == 0) {
                        try { document.getElementById("LApvLine").innerHTML = getRequestApvListNXpath(elmList, elmVisible, "", false, null); } catch (e) { document.getElementById("AppLine").innerHTML = getRequestApvList(elmList, "", true, m_oFormMenu.getLngLabel($(element).attr("ouname"), false)); }
                        //담당부서/담당업무뿌려주기
                        var sOUName = "";
                        if (getInfo("scChgr") == "1") {
                            sOUName = getInfo("scChgrV").split("@")[1];
                        }
                        if (getInfo("scChgrOU") == "1") {
                            sOUName = m_oFormMenu.getLngLabel(getInfo("scChgrOUV").split("@")[1], false)
                        }
                        //document.getElementById("RApvLine").innerHTML = "<table bgcolor='#FFFFFF' border='1' bordercolor='#dc5f0a' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100;width:'><tr><td rowspan='5' width='25' height='100' align='center' style='color: #662800; font-family: Arial, Dotum; font-size: 12px; font-weight: bold; background: #f5ebe1;' nowrap='f'>" + m_oFormMenu.gLabel_managedept + "</td><td height='20' width='100' align='center' style='color: #662800; font-family: Arial, Dotum; font-size: 12px; font-weight: bold; background: #f5ebe1;'>&nbsp;</td></tr><tr><td height='50' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>" + sOUName + "</td></tr><tr><td height='20'  align='center' valign='middle' style='font-size:8pt;'></td></tr><tr><td height='20' align='center' valign='middle' style='font-size:8pt;'></td></tr></table>";  // dc5f0a를 000000로 바꿈
                        //document.getElementById("RApvLine").innerHTML = "<table bgcolor='#FFFFFF' border='1' bordercolor='#dc5f0a' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100;width:'><tr><td rowspan='5' width='25' height='100' align='center' style='color: #662800; font-family: Arial, Dotum; font-size: 12px; font-weight: bold; background: #f5ebe1;' nowrap='f'>" + m_oFormMenu.gLabel_Acceptdept + "</td><td height='20' width='100' align='center' style='color: #662800; font-family: Arial, Dotum; font-size: 12px; font-weight: bold; background: #f5ebe1;'>&nbsp;</td></tr><tr><td height='50' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>" + sOUName + "</td></tr><tr><td height='20'  align='center' valign='middle' style='font-size:8pt;'></td></tr><tr><td height='20' align='center' valign='middle' style='font-size:8pt;'></td></tr></table>";  // dc5f0a를 000000로 바꿈 , 처리부서를 수신부서로 변경(HIW)
                        document.getElementById("RApvLine").innerHTML = "<table class='table_1' cellSpacing='0' cellPadding='0' summary='서명'><tr><th class='tit'>" + m_oFormMenu.gLabel_Acceptdept + "</th><td><table class='table_1_1' cellspacing='0' summary='서명' cellpadding='0'><tr><th width='90'>&nbsp;</th></tr><tr><td style='FONT-STYLE: italic; FONT-FAMILY: Georgia, Times New Roman, Times, serif,gulim; COLOR: #4584c9; FONT-SIZE: 11pt; FONT-WEIGHT: bold' height='50' vAlign='middle' align='center'>" + m_oFormMenu.getLngLabel(sOUName, false) + "</td></tr><tr><td style='BORDER-TOP: #D6D7D6 1px solid;'>&nbsp;</td></tr><tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td></tr></table></td></tr></table>";  // dc5f0a를 000000로 바꿈 , 처리부서를 수신부서로 변경(HIW)
                    }
                }
            } else {
                if ($(elmRoot).find("division").length > 1) {
                    if (getInfo("fmpf") != "WF_FORM_ISU_ALL_COM010") {  //대내공문일경우는 발신부서 보여주지 않음 (2012-12-20 HIW)
                        if (i == 0) { try { document.getElementById("LApvLine").innerHTML = getRequestApvListNXpath(elmList, elmVisible, "", false, m_oFormMenu.getLngLabel($(element).attr("ouname"), false)); } catch (e) { document.getElementById("AppLine").innerHTML = getRequestApvListNXpath(elmList, "", true, m_oFormMenu.getLngLabel($(element).attr("ouname"), false)); } }
                    }
                    if (i == 1) { try { document.getElementById("RApvLine").innerHTML = getRequestApvListNXpath(elmList, elmVisible, "", true, m_oFormMenu.getLngLabel($(element).attr("ouname"), false), true); } catch (e) { document.getElementById("AppLine").innerHTML = getRequestApvListNXpath(elmList, "", true, m_oFormMenu.getLngLabel($(element).attr("ouname"), false)); } }
                } else {
                    document.getElementById("AppLine").align = "left";   //"right";
                    document.getElementById("AppLine").innerHTML = getRequestApvListNXpath(elmList, elmVisible, "", false, m_oFormMenu.getLngLabel($(element).attr("ouname"), false));
                }
            }
        }
	    );
        
        //합의자/합의부서 출력
        /*
        elmList = $(elmRoot).find("division > step[routetype='consult'][unittype='person'] > ou > person", "division > step[routetype='assist'][unittype='person'] > ou > person");
        elmOUList = $(elmRoot).find("division > step[routetype='consult'][unittype='ou'] > ou", "division > step[routetype='assist'][unittype='ou'] > ou"); //부서협조	
        */
        //elmList = elmRoot.selectNodes("division/step[(@unittype='person' or @unittype='role') and (@routetype='assist' or @routetype='consult')]/ou/(person|role)[taskinfo/@kind!='conveyance']"); //개인합의
        //elmList = $(elmRoot).find("division > step[unittype='person'][unittype='role'] > ou > person", "division > step[routetype='assist'][routetype='consult'] > ou > person");
        elmList = $(elmRoot).find("division>step[unittype='person'][routetype='assist']>ou>person:has(taskinfo[kind!='conveyance'])");
        elmOUList = $(elmRoot).find("division > step[unittype='ou'] > ou", "division > step[routetype='assist'][routetype='consult'] > ou"); //부서협조	
        
        elmListCount = elmList.length + elmOUList.length;
        var LastTitle, LastCmt, LastResult;
        
        if (elmListCount != 0) {
            Apvlines = "<tr><th>" + m_oFormMenu.gLabel_dept + "</th>";
            Apvlines += "	<th>" + m_oFormMenu.gLabel_username + "</th>";
            Apvlines += "	<th>" + GetConsultDateLang()  + "</th>";  //합의일자  //m_oFormMenu.gLabel_approvdate(결재일자)
            Apvlines += "   <th>" + m_oFormMenu.gLabel_comment + "</th></tr>";

            //합의자
            $(elmList).each(function (index, element) {
                var sCode = "";
                var sTitle = "";
                var sName = "";
                var sComment = "";

                if (element.nodeName == "role") {
                    try { sCode = $(element).find("person").code; } catch (e) { }
                    try { sTitle = m_oFormMenu.getLngLabel($(element).attr("name"), false); } catch (e) { }
                    try { sName = m_oFormMenu.getLngLabel($(element).attr("name"), false); } catch (e) { }
                } else {
                    sCode = $(element).attr("code");
                    sTitle = m_oFormMenu.getLngLabel($(element).attr("title"), true);
                    sName = m_oFormMenu.getLngLabel($(element).attr("name"), false); //sTitle.substring(sTitle.lastIndexOf(";")+1)+" "+
                } 
                elmTaskInfo = $(element).find("taskinfo");
                strDate = $(elmTaskInfo).attr("datecompleted");
                if (strDate == null) { strDate = ""; }
                var assistcmt = $(element).find("taskinfo > comment"); //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.

                var sActionState = "";
                if ($(elmTaskInfo).attr("result") == "agreed")  //행위상태값이 "합의"일경우 "결재"가아닌 "합의"로 표시 (2012-11-09 HIW)
                    sActionState = m_oFormMenu.gLabel_assist;
                else if ($(elmTaskInfo).attr("result") == "disagreed")  //행위상태값이 "반송"일경우 "반송"이아닌 "이의"로 표시 (2012-11-09 HIW)
                    sActionState = m_oFormMenu.gLabel_objection;
                else
                    sActionState = interpretResult($(elmTaskInfo).attr("result"));

                switch ($(elmTaskInfo).attr("kind")) {
                    case "conveyance": break;
                    case "substitute":
                        LastTitle = getPresence(sCode, "assist" + i + sCode, $(element).attr("sipaddress")) + m_oFormMenu.getLngLabel($(element).attr("name"), false);
                        LastCmt = ($(assistcmt).val() == null) ? "&nbsp;" : $(assistcmt).val().replace(/\n/g, "<br />");
                        //LastResult = ((strDate == "") ? "&nbsp;" : formatDate(strDate, "T") + interpretResult($(elmTaskInfo).attr("result")));
                        LastResult = ((strDate == "") ? "&nbsp;" : formatDate(strDate, "D") + sActionState);  //HIW
                        break;
                    case "bypass":
                        Apvlines += "<tr><td width='150px' align='center'>" + m_oFormMenu.getLngLabel($(element).attr("ouname"), false) + "</td>"; //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.
                        Apvlines += "<td width='90px' align='center'>";
                        Apvlines += sTitle + " " + m_oFormMenu.gLabel_substitue + " " + LastTitle + "</td>";
                        Apvlines += "<td align='center'>" + LastResult + "</td>";
                        Apvlines += "<td width='250px'>";
                        Apvlines += LastCmt;
                        Apvlines += "</td></tr>";
                        break; //"후열"
                    default:
                        Apvlines += "<tr><td width='150px' align='center'>" + m_oFormMenu.getLngLabel($(element).attr("ouname"), false) + "</td>"; //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.
                        //Apvlines += "<td>" + sTitle + "</td>"; //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.
                        Apvlines += "<td width='90px' align='center'>" + sName + "</td>"; //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.
                        //Apvlines += "<td>" + ((strDate == "") ? "&nbsp;" : formatDate(strDate, "T") + " " + interpretResult($(elmTaskInfo).attr("result"))) + "</td>";
                        Apvlines += "<td align='center'>" + ((strDate == "") ? "&nbsp;" : formatDate(strDate, "D") + " " + sActionState) + "</td>";  //HIW
                        Apvlines += "<td width='250px'>";
                        Apvlines += ($(assistcmt).val() == null) ? "&nbsp;" : $(assistcmt).val().replace(/\n/g, "<br />");
                        Apvlines += "</td></tr>";
                        break;
                }
            }
			);
            
            //합의부서
            $(elmOUList).each(function (index, element) {
                if ($(element).find("perfon").length == 0) {
                    elmTaskInfo = $(element).find("taskinfo");
                    strDate = $(elmTaskInfo).attr("datecompleted");
                    if (strDate == null) { strDate = ""; }
                    var assistcmt = elmTaskInfo.find("comment").text();   //elmTaskInfo.selectSingleNode("comment")

                    var sActionState = "";
                    if ($(elmTaskInfo).attr("result") == "agreed")  //행위상태값이 "합의"일경우 "결재"가아닌 "합의"로 표시 (2012-11-09 HIW)
                        sActionState = m_oFormMenu.gLabel_assist;
                    else if ($(elmTaskInfo).attr("result") == "disagreed")  //행위상태값이 "반송"일경우 "반송"이아닌 "이의"로 표시 (2012-11-09 HIW)
                        sActionState = m_oFormMenu.gLabel_objection;
                    else
                        sActionState = interpretResult($(elmTaskInfo).attr("result"));

                    Apvlines += "<tr><td width='150px' align='center'>" + m_oFormMenu.getLngLabel($(element).attr("name"), false) + "</td>"; //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.
                    Apvlines += "<td width='90px' align='center'>" + m_oFormMenu.getLngLabel($(element).attr("name"), false) + "</td>"; //이준희(2007-07-06): 문서창 상단에서 협조자의 의견이 잘리지 않도록 수정함.
                    Apvlines += "<td align='center'>" + ((strDate == "") ? "&nbsp;" : formatDate(strDate, "D") + " " + sActionState) + "</td>";  //HIW
                    Apvlines += "<td width='250px'>";
                    Apvlines += (assistcmt == null) ? "&nbsp;" : assistcmt.replace(/\n/g, "<br />");
                    Apvlines += "</td></tr>";
                }
            });

            Apvlines = "<table class='table_7' summary='합의' cellpadding='0' cellspacing='0'>" + Apvlines + "</table>";
            document.getElementById("AssistLine").innerHTML = Apvlines; document.getElementById("AssistLine").style.display = "";

        } else {

            document.getElementById("AssistLine").innerHTML = ""; document.getElementById("AssistLine").style.display = "none";
        }
        //참조자 출력
        displayCCInfo(elmRoot);

        //감사자 출력
        elmList = $(elmRoot).find("division > step[routetype='audit'] > ou > person");
        if (elmList.length > 0) {
            elmVisible = $(elmRoot).find("division > step[routetype='audit'] > ou > person[ > taskinfo[visible='n']]");
            var sAdtLine = "";
            try { sAdtLine = getRequestApvListNXpath(elmList, elmVisible, "", false, "감사"); } catch (e) { }
            if (document.getElementById("RApvLine") != null) {
                document.getElementById("RApvLine").innerHTML = "<table style='width:100%' cellpadding='0' cellspacing='0' border='0'><tr><td align='right' style='width:80%;'>" + document.getElementById("RApvLine").innerHTML + "</td><td align='right' style='width:20%;'>" + sAdtLine + "</td></tr></table>";
            } else {
                document.getElementById("AppLine").innerHTML = "<table style='width:100%' cellpadding='0' cellspacing='0' border='0'><tr><td align='right' style='width:80%;'>" + document.getElementById("AppLine").innerHTML + "</td><td align='right' style='width:20%;'>" + sAdtLine + "</td></tr></table>";
            }
        }

    }
    //배포처 출력
    //2013-04-15 hyh 수정
    //try { if (document.getElementById("RecLine") != null) document.getElementById("RecLine").innerHTML = initRecList(); } catch (e) { }
    try {
        if (document.getElementById("RecLine") != null) {
            document.getElementById("RecLine").innerHTML = initRecList();
            var aRecDept = document.getElementsByName("RECEIVE_NAMES")[0].value.split("@");
            var sRecDept = aRecDept[0];
            if (sRecDept != "") {
                document.getElementById("trRecDept").style.display = "";
            }
        }
    } catch (e) { }
    //2013-04-15 hyh 수정 끝
    try { G_displaySpnDocLinkInfo(); } catch (e) { }
    try { G_displaySpnRejectDocLinkInfo(); } catch (e) { }
    try { if (getInfo("scPM") == "1") G_displaySpnPMLinkInfo((getInfo("scPMV") == "" ? null : getInfo("scPMV"))); } catch (e) { }

}


//수신처, 발신처 부서 결재선 표현 - 안드로이드 모바일용 
function getRequestApvListNXpath(elmList, elmVisible, sMode, bReceive, sApvTitle, bDisplayCharge) {//신청서html
    var elm, elmTaskInfo, elmReceive, elmApv;
    var strDate;
    var j = 0;
    var Apvlines = "";
    var ApvPOSLines = ""; //부서명 or 발신부서,신청부서,담당부서,수신부서 등등 으로 표기<tr>
    var ApvTitleLines = "";
    var ApvSignLines = ""; //결재자 사인이미지 들어가는 부분<tr>
    var ApvApproveNameLines = ""; //결재자 성명 및 contextmenu 및 </br>붙임 후 결재일자 표기<tr>
    var ApvDateLines = "<tr>"; //사용안함
    var ApvCmt = "<tr>";
    var strColTD = elmList.length - elmVisible.length;
    var strwidth = "90"; //String(100/strColTD);
    var strAuthorizeDate = "";
    var strAuthorizeSign = "";  //2013-03-06 HIW
    var strAuthorizeName = "";  //2013-03-06 HIW
   
    for (var i = 0; i < elmList.length - j; i++) {
        elm = elmList[i];
        elmTaskInfo = $(elm).find("taskinfo");

        if ($(elmTaskInfo).attr("kind") == 'conveyance') {
        } else {
            //첫번째열 타이틀 HIW
            //자동결재선에 따라 부서표시 수정부분 추가
            if (i == 0) {
                if (sApvTitle != "" && sApvTitle != undefined) {
                    sApvTitle = m_oFormMenu.getLngLabel($(elm).attr("ouname"), false).replace(/-/gi, "<br/>");
                }
                if (bReceive) { //담당부서 결재선
                    if (sApvTitle != "") {
                        //ApvPOSLines += "<th class='tit'>" + (sApvTitle == undefined ? m_oFormMenu.gLabel_management + "<br>" + m_oFormMenu.gLabel_dept : sApvTitle) + "</th>"; 
                        ApvPOSLines += "<th class='tit'>" + m_oFormMenu.gLabel_Acceptdept + "</th>";  //수신부서 HIW
                    }
                } else {
                    if (sApvTitle != "") {
                        //ApvPOSLines += "<th class='tit'>" + (sApvTitle == undefined ? m_oFormMenu.gLabel_request + "<br>" + m_oFormMenu.gLabel_dept : sApvTitle) + "</th>";
                        if (getInfo("scDRec") == "0" && getInfo("scChgr") == "0" && getInfo("scPRec") == "0" && getInfo("scChgrOU") == "0" && getInfo("scIPub") == "0" && getInfo("scGRec") == "0")  //품의프로세스인 경우 (HIW)
                            ApvPOSLines += "<th class='tit'>" + m_oFormMenu.gLabel__app + "</th>";  //결재 HIW
                        else {
                            ApvPOSLines += "<th class='tit'>" + GetSendDeptLang() + "</th>";  //발신부서 HIW
                        }
                    }
                }
            }
            if (($(elmTaskInfo).attr("visible") != "n")) //(bDisplayCharge && i==0 ) || 결재선 숨기기한 사람 숨기기
            {
                if ($(elmTaskInfo).attr("kind") == 'charge') {
                    if (bReceive && elmList.length == 1) {
                        var temp_charge = m_oFormMenu.gLabel_charge; //"담당"
                    }
                    else {
                        var temp_charge = m_oFormMenu.gLabel_charge_apvline;  //"기안"
                    }
                    ApvTitleLines += "<td><table class='table_1_1' summary='서명' cellpadding='0' cellspacing='0'><tr><th width='" + strwidth + "'>" + temp_charge + "</th></tr>";
                }
                else {
                    var sTitle = "";
                    try {
                        //sTitle = $(elm).attr("level");
                        sTitle = $(elm).attr("title");
                        sTitle = m_oFormMenu.getLngLabel(sTitle, true);
                    } catch (e) {
                        if (elm.nodeName == "role") {
                            sTitle = $(elm).attr("name");
                            sTitle = sTitle.substr(sTitle.length - 2);
                        }
                    }
                    if (sTitle == m_oFormMenu.gLabel_charge_person) {
                        sTitle = m_oFormMenu.gLabel_charge; //"담당"
                    }
                    //첫번째행(직책)
                    ApvTitleLines += "<td><table class='table_1_1' summary='서명' cellpadding='0' cellspacing='0'><tr><th width='" + strwidth + "'>" + sTitle + "</th></tr>";
                }

                //날짜행 시작	
                ApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>";
                
                //서명행 시작
                ApvSignLines += "<tr><td height='50' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>";
                
                //결재자명 시작
                //ApvApproveNameLines += "<tr><td class='la'>";
                ApvApproveNameLines += "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;' align='center'>";  //HIW

                strDate = $(elmTaskInfo).attr("datecompleted");
                if (strDate == null) {
                    strDate = "";
                    ApvCmt += "&nbsp;";
                }
                else {
                    var assistcmt = $(elm).find("taskinfo > comment");
                    if (assistcmt != null) {
                        aryComment[i] = $(assistcmt).val();
                    } else {
                        aryComment[i] = "";
                    }

                    // 수신,발신처 있을경우의 문서 이관시 '의견' 란 링크 삭제
                    if (m_oFormMenu.m_CmtBln == false) { ApvCmt += (assistcmt == null) ? "&nbsp;" : m_oFormMenu.gLabel_comment; }
                    else
                    { ApvCmt += (assistcmt == null) ? "&nbsp;" : "<a href=\'#\' onclick=\'viewComment(\"" + i + "\")\'>" + m_oFormMenu.gLabel_comment + "</a>"; }
                }

                var sCode = "";
                var elmtemp;
                if (elm.nodeName == "role")
                    try { sCode = $(elm).find("person").attr("code"); elmtemp = $(elm).find("person"); } catch (e) { }
                else
                    sCode = $(elm).attr("code");

                var elmname = (elmtemp != null) ? elmtemp : elm;

                /*
                switch ($(elmTaskInfo).attr("kind")) {
                    case "authorize":
                        ApvSignLines += m_oFormMenu.gLabel_authorize + interpretResult($(elmTaskInfo).attr("result")); //전결
                        //ApvApproveNameLines += "&nbsp;<br />";	
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;<br />" : getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + interpretResult($(elmTaskInfo).attr("result")) + "<br />";
                        ApvApproveNameLines += (strDate == "") ? "<span class='txt_gn11_blur'>&nbsp;</span>" : "<span class='txt_gn11_blur'>" + formatDate(strDate, "T") + "</span>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        LastApv = "/";
                        LastApvName = m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + interpretResult($(elmTaskInfo).attr("result")) + "<br />";
                        LastDate = formatDate(strDate, "T");
                        break;
                    case "substitute":
                        if (strDate == "") { ApvSignLines += m_oFormMenu.gLabel_substitue; } else { ApvSignLines += getSignUrl(sCode, $(elmTaskInfo).attr("customattribute1"), elm.getAttribute("name"), strDate, false, $(elmTaskInfo).attr("result"), true); } //"대결"
                        ApvApproveNameLines += getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + interpretResult($(elmTaskInfo).attr("result")) + "<br />";
                        ApvApproveNameLines += (strDate == "") ? "<span class='txt_gn11_blur'>&nbsp;</span>" : "<span class='txt_gn11_blur'>" + formatDate(strDate, "T") + "</span>";
                        ApvDateLines += formatDate(strDate);
                        LastApv = "";
                        LastApvName = "";
                        LastDate = "";
                        break;
                    case "skip":
                        ApvSignLines += "/";
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;<br />" : getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + interpretResult($(elmTaskInfo).attr("result")) + "<br />";
                        ApvApproveNameLines += (strDate == "") ? "<span class='txt_gn11_blur'>&nbsp;</span>" : "<span class='txt_gn11_blur'>" + formatDate(strDate, "T") + "</span>";
                        ApvDateLines += "&nbsp;";
                        break;
                    case "bypass":
                        ApvSignLines += (LastApv == "") ? m_oFormMenu.gLabel_bypass : LastApv; //"후열"							
                        ApvApproveNameLines += ((LastApvName == "") ? getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) : LastApvName) + interpretResult($(elmTaskInfo).attr("result")) + "<br />";
                        ApvApproveNameLines += (LastDate == "") ? "<span class='txt_gn11_blur'>" + formatDate(strDate) + "</span>" : "<span class='txt_gn11_blur'>" + LastDate + "</span>";
                        //ApvDateLines += (LastDate =="")?formatDate(strDate):LastDate ;
                        break; //"후열"
                    case "review":
                        ApvSignLines += (strDate == "") ? m_oFormMenu.gLabel_review : getSignUrl(sCode, $(elmTaskInfo).attr("customattribute1"), $(elm).attr("name"), strDate, false, $(elmTaskInfo).attr("result"), true); //후결
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;<br />" : getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + interpretResult($(elmTaskInfo).attr("result")) + "<br />";
                        ApvApproveNameLines += (strDate == "") ? "<span class='txt_gn11_blur'>&nbsp;</span>" : "<span class='txt_gn11_blur'>" + formatDate(strDate, "T") + "</span>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        break;
                    case "charge":
                        ApvSignLines += (strDate == "") ? m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) : getSignUrl(sCode, $(elmTaskInfo).attr("customattribute1"), $(elm).attr("name"), strDate, false, $(elmTaskInfo).attr("result"), true);
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;<br />" : getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + interpretResult($(elmTaskInfo).attr("result")) + "<br />";
                        ApvApproveNameLines += (strDate == "") ? "<span class='txt_gn11_blur'>&nbsp;</span>" : "<span class='txt_gn11_blur'>" + formatDate(strDate, "T") + "</span>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        break;
                    default:
                        ApvSignLines += (strDate == "") ? m_oFormMenu.getLngLabel(elm.getAttribute("name"), false) : getSignUrl(sCode, $(elmTaskInfo).attr("customattribute1"), $(elm).attr("name"), strDate, false, $(elmTaskInfo).attr("result"), true);
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;<br />" : getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + interpretResult($(elmTaskInfo).attr("result")) + "<br />";
                        ApvApproveNameLines += (strDate == "") ? "<span class='txt_gn11_blur'>&nbsp;</span>" : "<span class='txt_gn11_blur'>" + formatDate(strDate, "T") + "</span>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                }
                */
                
                //이수그룹 결재선으로 수정 (2012-11-08  HIW)
                var sResult = "";
                if ($(elmTaskInfo).attr("result") == "rejected")  //반송인경우만 상태 표시
                    sResult = interpretResult($(elmTaskInfo).attr("result"));
                switch ($(elmTaskInfo).attr("kind")) {
                    case "authorize":  //전결
                        ApvSignLines += m_oFormMenu.gLabel_authorize + interpretResult($(elmTaskInfo).attr("result")); 
                        //ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + sResult + "</td></tr>";
                        //ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
                        ApvApproveNameLines += "&nbsp;</td></tr>";
                        ApvApproveNameLines += "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        LastApv = "/";
                        LastApvName = m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + interpretResult($(elmTaskInfo).attr("result")) + "<br />";
                        LastDate = formatDate(strDate, "T");

                        //추가 2013-03-06 HIW
                        strAuthorizeDate = strDate;
                        strAuthorizeName = m_oFormMenu.getLngLabel($(elmname).attr("name"), false);
                        if ($(elmTaskInfo).attr("result") == "rejected")   //반송인경우
                            strAuthorizeSign = "<img src='" + g_BaseImgURL + "Default/default_Reject.gif' border=0 style='width:30px;height:40px'>";  //전결일경우 최종결재자에겐 디폴트 반송이미지 보여줌
                        else
                            strAuthorizeSign = getSignUrl(sCode, $(elmTaskInfo).attr("customattribute1"), $(elmname).attr("name"), strDate, false, $(elmTaskInfo).attr("result"), true);  //전결일경우 최종결재자에겐 전결자의 서명이미지 보여줌
                        break;
                    case "substitute":
                        //if (strDate == "") { ApvSignLines += m_oFormMenu.gLabel_substitue; } else { ApvSignLines += getSignUrl(sCode, $(elmTaskInfo).attr("customattribute1"), elm.getAttribute("name"), strDate, false, $(elmTaskInfo).attr("result"), true); } //"대결"
                        //ApvApproveNameLines += getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + interpretResult($(elmTaskInfo).attr("result")) + "<br />";
                        //ApvApproveNameLines += (strDate == "") ? "<span class='txt_gn11_blur'>&nbsp;</span>" : "<span class='txt_gn11_blur'>" + formatDate(strDate, "T") + "</span>";
                        //대결표시형태 수정 (2013-01-08 HIW)
                        if (strDate == "") { ApvSignLines += m_oFormMenu.gLabel_substitue; } else { ApvSignLines += getSignUrl(sCode, $(elmTaskInfo).attr("customattribute1"), $(elmname).attr("name"), strDate, false, $(elmTaskInfo).attr("result"), true); } //"대결"
                        ApvApproveNameLines += getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + sResult + "(" + m_oFormMenu.gLabel_substitue + ")</td></tr>";
                        ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
                        ApvDateLines += formatDate(strDate);
                        LastApv = "";
                        LastApvName = "";
                        LastDate = "";
                        break;
                    case "skip":
                        //2013-03-06 yu2mi :결재안함 맨 마지막에 전결 권자 넣어 주기
//                        ApvSignLines += "/";
//                        ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + sResult + "</td></tr>";
//                        ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
//                        ApvDateLines += "&nbsp;";
                        if (i == elmList.length - 1 && strAuthorizeDate != "") {
                            //ApvSignLines += getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strAuthorizeDate, false, elmTaskInfo.getAttribute("result"), true);
                            //ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + m_oFormMenu.getLngLabel(elmname.getAttribute("name"), false) + sResult + "</td></tr>";
                            ApvSignLines += strAuthorizeSign;  //HIW
                            ApvApproveNameLines += getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + strAuthorizeName + "</td></tr>";  //HIW
                            ApvApproveNameLines += (strAuthorizeDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strAuthorizeDate, "D") + "</span></td>";
                            ApvDateLines += "&nbsp;";
                        } else {
                            ApvSignLines += "/";
                            ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + sResult + "</td></tr>";
                            ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
                            ApvDateLines += "&nbsp;";
                        }
                        break;
                    case "bypass":  //후열
                        /*
                        ApvSignLines += (LastApv == "") ? m_oFormMenu.gLabel_bypass : LastApv; //"후열"							
                        //ApvApproveNameLines += (LastApvName=="")? getPresence(sCode, i+sCode, elmname.getAttribute("sipaddress"))+m_oFormMenu.getLngLabel(elmname.getAttribute("name"),false):LastApvName;	
                        ApvApproveNameLines += ((LastApvName == "") ? getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + "&nbsp;</td></tr>" : LastApvName) + sResult + "</td></tr>";
                        ApvApproveNameLines += (LastDate == "") ? "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate) + "</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + LastDate + "</span></td>";
                        //ApvDateLines += (LastDate =="")?formatDate(strDate):LastDate ;
                        */
                        if (LastApv == "") { ApvSignLines += m_oFormMenu.gLabel_bypass; } else { ApvSignLines += LastApv; } //"대결"
                        ApvApproveNameLines += getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + sResult + "(" + m_oFormMenu.gLabel_bypass + ")</td></tr>";
                        ApvApproveNameLines += (LastDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(LastDate, "D") + "</span></td>";
                        ApvDateLines += formatDate(LastDate);
                        break; 
                    case "review":
                        ApvSignLines += (strDate == "") ? m_oFormMenu.gLabel_review : getSignUrl(sCode, $(elmTaskInfo).attr("customattribute1"), $(elmname).attr("name"), strDate, false, $(elmTaskInfo).attr("result"), true); //후결
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + sResult + "</td></tr>";
                        ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        break;
                    case "charge":
                        ApvSignLines += (strDate == "") ? m_oFormMenu.getLngLabel($(elmname).attr("name"), false) : getSignUrl(sCode, $(elmTaskInfo).attr("customattribute1"), $(elmname).attr("name"), strDate, false, $(elmTaskInfo).attr("result"), true);
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + sResult + "</td></tr>";
                        ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        break;
                    default: //debugger;
                        ApvSignLines += (strDate == "") ? m_oFormMenu.getLngLabel($(elmname).attr("name"), false) : getSignUrl(sCode, $(elmTaskInfo).attr("customattribute1"), $(elmname).attr("name"), strDate, false, $(elmTaskInfo).attr("result"), true);
                        ApvApproveNameLines += (strDate == "") ? "&nbsp;</td></tr>" : getPresence(sCode, i + sCode, $(elmname).attr("sipaddress")) + m_oFormMenu.getLngLabel($(elmname).attr("name"), false) + sResult + "</td></tr>";
                        ApvApproveNameLines += (strDate == "") ? "<tr><td style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>&nbsp;</span></td>" : "<tr><td align='center' style='BORDER-TOP: #D6D7D6 1px solid;'><span class='txt_gn11_blur'>" + formatDate(strDate, "D") + "</span></td>";
                        ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                }
                ApvSignLines += "</td></tr>";
                ApvApproveNameLines += "</td></tr></table></td>";

                ApvDateLines += "</td>";
                var tempApvLine = ApvPOSLines + ApvTitleLines + ApvSignLines + ApvApproveNameLines;
                ApvPOSLines = "";
                ApvTitleLines = "";
                ApvSignLines = "";
                ApvApproveNameLines = "";
                //감사인 경우 최종 결재자만 보여줌
                if ($(elm).parent().parent().attr("routetype") == "audit") {
                    if (sApvTitle != "") {
                        Apvlines = "<th class='tit'>" + (sApvTitle == undefined ? m_oFormMenu.gLabel_request + "<br>" + m_oFormMenu.gLabel_dept : sApvTitle) + "</th>" + tempApvLine;
                    } else { Apvlines = tempApvLine; }
                } else {
                    Apvlines += tempApvLine;
                }
            }
        }
    }
    // 2005.07.13 박형진 수정 기안자,결재자 '이름' 출력하도록
    //Apvlines = ApvPOSLines + "</tr>" + ApvSignLines + "</tr>" + ApvApproveNameLines + "</tr>" + ApvDateLines + "</tr>";	
    //N단계 신청 결재선뿌려주기 201107
    //Apvlines = "<table bgcolor='#FFFFFF' border='1' bordercolor='#dc5f0a' style='border-collapse: collapse;MARGIN-TOP: 0px;'>" + Apvlines + "</table>";	//width:95%;
    Apvlines = "<table class='table_1' summary='서명' cellpadding='0' cellspacing='0'><tr>" + Apvlines + "</tr></table>"; //width:95%;
    return Apvlines;
}


//결재선 그리기 (Section형태) - 안드로이드 모바일용
function displayApvListColsNXpath(oApvList) {
    if (getInfo('fmpf') != 'WF_FORM_DRAFT' && getInfo('fmpf') != 'WF_FORM_COORDINATE' && getInfo('fmpf') != 'WF_FORM_MEMO') {
        if (document.getElementById("workrequestdisplay") != undefined) {
            document.getElementById("workrequestdisplay").style.display = "none";
        }
    }
    var elmRoot, elmList, elm, elmTaskInfo, elmReceive, ApvList, emlSkip, elmCmtList; // 2006.01.16 elmListR, elmR : 다중수신부서 여부를 알기위한 nodes 변수
    var Apvlines = "";
    var strDate, strFieldName, strwidth, strColTD, LastDate;
    var rtnPOSLine, stepList, TaskInfo, writeTaskInfo, rtnConsentLine, ConsentLine;

    elmRoot = oApvList.documentElement;
    if (elmRoot != null) {
        
        //상단 결재선 그리기 Start
        //  결재선 DTD는 <division divisiontype="...."><step></step></division><division divisiontype="...."><step></step></division>로
        //  구성되어있다. 따라서 n개의 divison을 divisiontype에 따라 결재선에 표시하면 된다.
        $(elmRoot).find("division").each(function (i, element) {
            rtnPOSLine = getApvListColsNXPath(element);
            TaskInfo = $(element).attr("divisiontype");
            if (getInfo("scPRec") != 0 || getInfo("scDRec") != 0 && getInfo("scIPub") == 0) //신청서
            {
                if (TaskInfo == "send") {
                    //신청부서
                    writeTaskInfo = m_oFormMenu.gLabel_reqdept;
                }
                else if (TaskInfo == "receive") {
                    //처리부서
                    writeTaskInfo = m_oFormMenu.gLabel_managedept;
                    

                }
            }
            else if (getInfo("scPRec") == 0 && getInfo("scDRec") == 0 && getInfo("scIPub") != 0)//협조문
            {
                if (TaskInfo == "send") {
                    //발의부서
                    writeTaskInfo = m_oFormMenu.gLabel_Propdept;
                }
                else if (TaskInfo == "receive") {
                    //수신부서
                    writeTaskInfo = m_oFormMenu.gLabel_Acceptdept;

                }
            }
            else if (getInfo("scPRec") == 0 && getInfo("scDRec") == 0 && getInfo("scIPub") == 0)//일반결재
            {
                writeTaskInfo = m_oFormMenu.gLabel_approver;
            }
            
            //개인결재선 적용 버튼 여부
            if (getInfo("scPRec") == 0 && getInfo("scDRec") == 0 && getInfo("scIPub") == 0)//일반결재
            {
                Apvlines += "<table><tr>"
                    + "<td id='displayApv" + i + "' align = 'left' width='190'> " + "<a onclick=\"if(ApvTable" + i + " != '' ){if (document.getElementById('ApvTable" + i + "').style.display == ''){document.getElementById('ApvTable" + i + "').style.display ='none';document.getElementById('span_ApvTable" + i + "').innerHTML = '<img src=" + m_oFormMenu.g_imgBasePath + "/COVI/common/btn/btn_up.gif>';}else{document.getElementById('ApvTable" + i + "').style.display ='';document.getElementById('span_ApvTable" + i + "').innerHTML = '<img src=" + m_oFormMenu.g_imgBasePath + "/COVI/common/btn/btn_down.gif>';}}\" style='cursor:hand;font-size:9pt;'>"
				    + writeTaskInfo + "<span id='span_ApvTable" + i + "' ><img src='" + parent.menu.g_imgBasePath + "/COVI/common/btn/btn_down.gif'></span> " + " </a>"
				    + "</td>" //결재선				
				    + "<td id='ApvlineButton' style='display:none'>"
				    + "<a onclick=\"if(ApvlineLayer" + i + " != '' ){if (document.getElementById('ApvlineLayer" + i + "').style.display == ''){document.getElementById('ApvlineLayer" + i + "').style.display ='none';document.getElementById('span_ApvlineLayer" + i + "').innerHTML = '<img src=" + m_oFormMenu.g_imgBasePath + "/Covi/common/btn/btn_icon_down.gif>';}else{eval(ApvlineLayer" + i + ").style.display ='';document.getElementById('span_ApvlineLayer" + i + "').innerHTML = '<img src=" + m_oFormMenu.g_imgBasePath + "/Covi/common/btn/btn_icon_up.gif>';}}\" style='cursor:hand;font-size:9pt;'><span id='span_ApvlineLayer" + i + "' ><img src='" + m_oFormMenu.g_imgBasePath + "/Covi/common/btn/btn_icon_down.gif'></span> " + " </a>"
                    + "</td>"
                    + "</tr></table>"
                    + "<div id='ApvlineLayer" + i + "' style='display:none; z-index:0; width:88px; position:absolute; height:68px'>"
                    + "<table width='100%' border='0' cellspacing='0' cellpadding='0'>"
                    + "  <tr>"
                    + "      <td>"
                    + "          <table width='400' height='103' border='0' cellpadding='1' cellspacing='1' bgcolor='#7975CA'>"
                    + "              <tr>"
                    + " 				    <td width='400'>"
                    + "  					<table width='395' height='99' border='0' align='center' cellpadding='0' cellspacing='0' bgcolor='#ffffff'>"
                    + "  						<tr>"
                    + "  							<td  style='padding-top:4px; padding-left:3px'>"
                    + "  								<div align='left' style='line-height:130%'>"
                    + "                                      <iframe id='iApvLine' name='iApvLine' width='100%' height='100%' frameborder='0' src='PrivateLineList.aspx' datasrc='PrivateLineList.aspx' style='PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px; scrollx:hidden;'></iframe>"
                    + "									</div>"
                    + "								</td>"
                    + " 							</tr>"
                    + " 						</table>"
                    + "					</td>"
                    + "				</tr>"
                    + " 			</table>"
                    + "      </td>"
                    + "  </tr>"
                    + "</table>"
                    + "</div>"
				    + "<table  id='ApvTable" + i + "' border=1  cellpadding=0 cellspacing=1 bordercolor='#dc5f0a' width='100%'  bgcolor='#ffffff' style='font-size:9pt;border-collapse: collapse;'>"
				    + "	<tr >"
				    + "		<td  height='20'  width='4%'  style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + m_oFormMenu.gLabel_no + "</td>" //순  번 
				    + "		<td  height='20'  width='15%' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + m_oFormMenu.gLabel_dept + "</td>" //부서3
				    + "		<td  height='20'  width='21%' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + m_oFormMenu.gLabel_username + "</td>" //성  명4
				    + "		<td  height='20'  width='10%' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + m_oFormMenu.gLabel_jobtitle + "</td>" //직  책5
				    + "		<td  height='20'  width='10%' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + m_oFormMenu.gLabel_kind + "</td>" //종  류
				    + "		<td  height='20'  width='10%' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + m_oFormMenu.gLabel_state + "</td>" //상태2
				    + "		<td  height='20'  width='9%' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + m_oFormMenu.gLabel_approvdate + "</td>" // 결재일자
				    + "		<td  height='20'  width='21%' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + m_oFormMenu.gLabel_oriapprover + "</td>" //	원결재자  				    
				    + "	</tr>"
				    + rtnPOSLine + "</table><br>";

            } else {
                Apvlines += "<table><tr>"
                    + "<td id='displayApv" + i + "' align = 'left' width='190'> " + "<a onclick=\"if(ApvTable" + i + " != '' ){if (eval(ApvTable" + i + ").style.display == ''){eval(ApvTable" + i + ").style.display ='none';eval(span_ApvTable" + i + ").innerHTML = '<img src=" + m_oFormMenu.g_imgBasePath + "/covi/common/btn/btn_up.gif>';}else{eval(ApvTable" + i + ").style.display ='';eval(span_ApvTable" + i + ").innerHTML = '<img src=" + m_oFormMenu.g_imgBasePath + "/covi/common/btn/btn_down.gif>';}}\" style='cursor:hand;font-size:9pt;'>"
				    + writeTaskInfo + "<span id='span_ApvTable" + i + "' ><img src='" + m_oFormMenu.g_imgBasePath + "/Covi/common/btn/btn_down.gif'></span> " + " </a>"
				    + "</td>" //결재선                    
                    + "</tr></table>"
				    + "<table  id='ApvTable" + i + "' border=1  cellpadding=0 cellspacing=1 bordercolor='#dc5f0a' width='100%'  bgcolor='#ffffff' style='font-size:9pt;border-collapse: collapse;'>"
				    + "	<tr >"
				    + "		<td  height='20'  width='4%'  style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + m_oFormMenu.gLabel_no + "</td>" //순  번 
				    + "		<td  height='20'  width='15%' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + m_oFormMenu.gLabel_dept + "</td>" //부서3
				    + "		<td  height='20'  width='21%' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + m_oFormMenu.gLabel_username + "</td>" //성  명4
				    + "		<td  height='20'  width='10%' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + m_oFormMenu.gLabel_jobtitle + "</td>" //직  책5
				    + "		<td  height='20'  width='10%' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + m_oFormMenu.gLabel_kind + "</td>" //종  류
				    + "		<td  height='20'  width='10%' style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + m_oFormMenu.gLabel_state + "</td>" //상태2
				    + "		<td  height='20'  width='9%'  style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + m_oFormMenu.gLabel_approvdate + "</td>" // 결재일자
				    + "		<td  height='20'  width='21%'  style='color: #662800; font-family: Arial, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + m_oFormMenu.gLabel_oriapprover + "</td>" //	원결재자  		
				    + "	</tr>"
				    + rtnPOSLine + "</table><br>";
            }
        } //for
            );
        document.getElementById("AppLine").innerHTML = Apvlines;
        //참조자 출력
        var ccInfos = $(elmRoot).find("ccinfo");
        var sSendccInfos = "";
        var sRecccInfos = "";

        if (ccInfos.length > 0) {

            $(ccInfos).each(function(index, element) {
                var sList = "";
                var sBelongTo = $(element).attr("belongto");
                var ccList = $(element.childNodes); //here
                var ccListIndex = 0;
                var cc = ccList[ccListIndex]; ccListIndex++;
                while (cc != null) {
                    if (cc.hasChildNodes()) cc = cc.firstChild;
                    if (cc.nodeName == "person") {
                        sList += (sList.length > 0 ? ";" : "") + m_oFormMenu.getLngLabel($(cc).attr("ouname"), false) + " " + m_oFormMenu.getLngLabel($(cc).attr("title"), true) + " " + m_oFormMenu.getLngLabel($(cc).attr("name"), false);
                    } else if (cc.nodeName == "ou") {
                        sList += (sList.length > 0 ? ";" : "") + m_oFormMenu.getLngLabel($(cc).attr("name"), false);
                    } else if (cc.nodeName == "group") {
                        sList += (sList.length > 0 ? ";" : "") + m_oFormMenu.getLngLabel($(cc).attr("name"), false);
                    }

                    cc = ccList[ccListIndex]; ccListIndex++;
                }
                switch (sBelongTo) {
                    case "global": document.getElementById("CC").innerHTML = sList; break;
                    case "sender":
                        sSendccInfos += (sSendccInfos.length > 0 ? ";" : "") + sList;
                        document.getElementById("SendCC").innerHTML = sSendccInfos;
                        break;
                    case "receiver":
                        sRecccInfos += (sRecccInfos.length > 0 ? ";" : "") + sList;
                        document.getElementById("RecCC").innerHTML = sRecccInfos;
                        break;
                }
            } //for
		        );
        } //if
    }

    //개인결재선 적용 버튼 여부
    try {
        if (getInfo("scPRec") == 0 && getInfo("scDRec") == 0 && getInfo("scIPub") == 0)//일반결재
        {
            if (document.getElementById("ApvlineButton") != null) {
                document.getElementById("ApvlineButton").style.display = (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE") ? "inline" : "none";
            }
        }
    } catch (e) { }
    //상단 결재선 그리기 End

    //배포처 출력
    if (document.getElementById("RecLine") != null) { document.getElementById("RecLine").innerHTML = initRecList(); }
    try { G_displaySpnDocLinkInfo(); } catch (e) { }
    try { G_displaySpnRejectDocLinkInfo(); } catch (e) { }
    try { if (getInfo("scPM") == "1") G_displaySpnPMLinkInfo((getInfo("scPMV") == "" ? null : getInfo("scPMV"))); } catch (e) { }

}

//결재선 (안드로이드 모바일용)  //displayApvListColsNXpath()에서 호출
function getApvListColsNXPath(oApvStepList) {
    var elmRoot, elmStep, elmList, elm, elmTaskInfo, elmReceive, ApvList, emlSkip, elmCmtList, elmListR, elmR; // 2006.01.16 elmListR, elmR : 다중수신부서 여부를 알기위한 nodes 변수
    var Apvlines = "";
    var strDate, strFieldName, strwidth, strColTD, LastDate;
    elmListSteps = $(oApvStepList).find("step[routetype='approve'],step[routetype='assist'],step[routetype='receive'],step[routetype='consult'],step[routetype='audit']");
    //elmListSteps = $(oApvStepList).find("step[routetype='approve'], [routetype='assist'] , [routetype='receive'] , [routetype='consult'] , [routetype='audit']");
    //teps = oApvStepList.find("step[(@routetype='approve' or @routetype='assist' or @routetype='receive' or @routetype= 'consult' or @routetype='audit')]");		
    var Apvlines = "";
    var ApvPOSLines = "";
    var Apvdecide = ""; 				//2005-12-05 신택상 대결,후열 등을 표시
    var ApvState = "";
    var ApvSignLines = "";
    var ApvDept = "";
    var ApvApproveNameLines = "";
    var ApvDateLines = "";
    var ApvCmt = "";
    var ApvCmtHtml = "";
    var Cmts = "";
    var sTitle = "";
    var elmAudit;
    var OriginApprover = "";
    var nextelm;
    var cnt = 1;
    var ApvVisible;

    for (var ii = 0; ii < elmListSteps.length; ii++) {
        ApvSignLines = "&nbsp;";      //결재자 이름
        ApvCmt = "&nbsp;";            //사용자 코멘트 
        OriginApprover = "&nbsp;";    //원결재자
        sTitle = "&nbsp;";            //직책
        sCode = "";           //사용자 아이디

        elmStep = elmListSteps[ii];
        if (elmStep == null) { // 더이상 노드가 없으면 빠져나감
            break;
        }

        elmList = $(elmStep).find("ou");    //부서가져오기
        if ($(elmStep).attr("unittype") == "ou") {
            ApvSignLines = "&nbsp;";      //결재자 이름
            ApvCmt = "&nbsp;";            //사용자 코멘트 
            OriginApprover = "&nbsp;";    //원결재자
            sTitle = "&nbsp;";            //직책
            sCode = "";           //사용자 아이디
            //부서단위처리
            //if(elm.firstChild.parentNode.parentNode.parentNode.getAttribute("routetype") == "assist"){Apvdecide = m_oFormMenu.gLabel_assist;} //"합 의"
            ////ApvSignLines += (strDate=="")?elm.getAttribute("name"): getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));

            //부서일 경우 for문 시작
            for (var ij = 0; ij < elmList.length; ij++) {
                elm = elmList[ij];
                if (elm == null) { // 더이상 노드가 없으면 빠져나감
                    break;
                }
                elmTaskInfo = $(elm).find("taskinfo");
                strDate = $(elmTaskInfo).attr("datecompleted");
                if (strDate == null) {
                    strDate = ""; ApvCmt = "";
                }
                if ($(elm.parentNode).attr("routetype") == "consult") { Apvdecide = m_oFormMenu.gLabel_DeptConsent; } //"부 서 합 의"
                if ($(elm.parentNode).attr("routetype") == "assist") { Apvdecide = m_oFormMenu.gLabel_DeptAssist; } //"개 인 합 의"
                if ($(elm.parentNode).attr("routetype") == "audit") { Apvdecide = m_oFormMenu.gLabel_audit; } //"감사"
                if ($(elm.parentNode).attr("routetype") == "audit" && elm.parentNode.attr("name") == "부서감사") { Apvdecide = m_oFormMenu.gLabel_dept_audit; }
                if ($(elm.parentNode).attr("name") == "ExtType") { Apvdecide = m_oFormMenu.gLabel_ExtType; } //"심 의"
                ApvSignLines += (strDate == "") ? "" : getSignUrl(sCode, $(elmTaskInfo).attr("customattribute1"), "", strDate, false, $(elmTaskInfo).attr("result"), false);
                ApvState = interpretResult($(elmTaskInfo).attr("result"));
                ApvDept = m_oFormMenu.getLngLabel($(elm).attr("name"), false);
                ApvDateLines = "";
                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;

                if (strDate == "" && $(elmTaskInfo).attr("datereceived") != "") {
                    ApvVisible = "T";
                } else {
                    ApvVisible = "F";
                }

                if (ApvCmt == "" || ApvCmt == "&nbsp;") {
                    ApvPOSLines = "<tr style='font-family: Arial, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background:#FFFFFF;font-size:9pt;'>" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20' onclick='javascript:deptdisplayApv(\"INDEPT" + cnt + "\")' >" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle
	                               + "<td style='background:#FFFFFF;font-size:9pt;'>" + Apvdecide + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState + "</td>" + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + getInnerApvListCols($(elm), ApvVisible, cnt) + ApvPOSLines;
                    cnt++;
                }
                else {
                    ApvPOSLines = "<tr style='font-family: Arial, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background:#FFFFFF;font-size:9pt;'>" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20' onclick='javascript:deptdisplayApv(\"INDEPT" + cnt + "\")' >" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle
	                               + "<td style='background:#FFFFFF;font-size:9pt;'>" + Apvdecide + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState + "</td>" + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + "<tr><td style='background:#FFFFFF;font-size:9pt;' align='left' height='20' colspan='8' style='padding-left:10px'> " + ApvCmt + "</td></tr>" + getInnerApvListCols($(elm), ApvVisible, cnt) + ApvPOSLines;
                    cnt++;
                }
            }
            //부서일 경우 for문 끝
        } else if ($(elmStep).attr("unittype") == "person") {

            elmList = $(elmStep).find("ou > person,role"); //사람 가져오기
            // 사람일 경우 for 문 시작	
            for (var i = 0; i < elmList.length; i++) {
                ApvSignLines = "&nbsp;";      //결재자 이름
                ApvCmt = "&nbsp;";            //사용자 코멘트 
                OriginApprover = "&nbsp;";    //원결재자
                sTitle = "&nbsp;";            //직책
                var sCode = "";           //사용자 아이디

                elm = elmList[i];
                if (elm == null) { // 더이상 노드가 없으면 빠져나감
                    break;
                }

                elmTaskInfo = $(elm).find("taskinfo");

                if ($(elmTaskInfo).attr("visible") != "n") {
                    if ($(elmTaskInfo).attr("kind") != 'skip') {
                        if ($(elmTaskInfo).attr("kind") == 'charge') {
                            try {
                                sTitle = m_oFormMenu.getLngLabel($(elm).attr("title"), true);
                                //sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
                            } catch (e) {
                                if (elm.nodeName == "role") {
                                    sTitle = m_oFormMenu.getLngLabel($(elm).attr("name"), false);
                                    //sTitle=sTitle.substr(sTitle.length-2);
                                }
                            }
                        } else {
                            try {
                                sTitle = m_oFormMenu.getLngLabel($(elm).attr("title"), true);
                                //sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
                            } catch (e) {
                                if (elm.nodeName == "role") {
                                    sTitle = m_oFormMenu.getLngLabel($(elm).attr("name"), false);
                                    //sTitle=sTitle.substr(sTitle.length-2);
                                }
                            }
                        }
                        strDate = $(elmTaskInfo).attr("datecompleted");
                        if (strDate == null) {
                            strDate = "";
                            ApvCmt = "";
                        } else {
                            var assistcmt = $(elm).find("taskinfo > comment");
                            if ($(assistcmt) != null) {
                                ApvCmt = assistcmt.text().replace(/\n/g, "<br>");
                                if (ApvCmt.indexOf("<br>") > -1) {
                                    ApvCmtHtml = "<td colspan='7' id='comment_hidden_" + sCode + cnt + "' ><table><tr>"
                                                + "<td width='95%' style='background:#FFFFFF;font-size:9pt;' align='left' style='padding-left:10px'> " + ApvCmt.substring(0, ApvCmt.indexOf("<br>")) + "...</td>"
                                                + "<td width='5%' style='background:#FFFFFF;font-size:9pt;cursor:hand' valign='top' onclick=\"javascript:Comment_view('" + sCode + cnt + "')\" >▼<td>"
                                                + "</tr></table></td>"
                                                + "<td colspan='7' id='comment_view_" + sCode + cnt + "' style='display:none'><table><tr>"
                                                + "<td width='95%' style='background:#FFFFFF;font-size:9pt;' align='left' style='padding-left:10px'> " + ApvCmt + "</td>"
                                                + "<td width='5%' style='background:#FFFFFF;font-size:9pt;cursor:hand' valign='top' onclick=\"javascript:Comment_hidden('" + sCode + cnt + "')\" >▲<td>"
                                                + "</tr></table></td>"
                                } else {
                                    ApvCmtHtml = "<td style='background:#FFFFFF;font-size:9pt;' align='left' height='20' colspan='6' style='padding-left:10px'> " + ApvCmt + "</td>";
                                }
                            }
                        }

                        Apvdecide = m_oFormMenu.gLabel_approve; // "결 재"
                        if (elm.nodeName == "role")
                            try { sCode = $(elm).find("person").attr("code"); } catch (e) { }
                        else
                            sCode = $(elm).attr("code");

                        ApvKind = interpretKind($(elmTaskInfo).attr("kind"), $(elmTaskInfo).attr("result"), $(elm.firstChild.parentNode.parentNode.parentNode).attr("routetype"), $(elm.firstChild.parentNode.parentNode.parentNode).attr("allottype"), $(elm.firstChild.parentNode.parentNode.parentNode).attr("name"));
                        switch ($(elmTaskInfo).attr("kind")) {
                            case "authorize":
                                ApvSignLines += m_oFormMenu.getLngLabel($(elm).attr("name"), false);
                                ApvState = interpretResult($(elmTaskInfo).attr("result"));
                                ApvDept = m_oFormMenu.getLngLabel($(elm).attr("ouname"), true);
                                ApvDateLines = "";
                                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                LastApv = "/";
                                LastApvName = m_oFormMenu.getLngLabel($(elm).attr("name"), false) + interpretResult($(elmTaskInfo).attr("result"));
                                LastDate = formatDate(strDate);
                                //ApvKind = "전결";
                                break;
                            case "substitute":
                                ApvSignLines += m_oFormMenu.getLngLabel($(elm).attr("name"), false);
                                ApvDept = m_oFormMenu.getLngLabel($(elm).attr("ouname"), false);
                                ApvState = interpretResult($(elmTaskInfo).attr("result"));
                                ApvDateLines = "";
                                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                //LastApv = getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));
                                LastApv = getSignUrl(sCode, $(elmTaskInfo).attr("customattribute1"), $(elm).attr("name"), strDate, false, $(elmTaskInfo).attr("result"), false);
                                LastApvName = m_oFormMenu.getLngLabel($(elm).attr("name"), false) + interpretResult($(elmTaskInfo).attr("result"));
                                LastDate = formatDate(strDate);
                                //원결재자 가져오기
                                nextelm = elmList.nextNode();
                                OriginApprover = m_oFormMenu.getLngLabel(nextelm.attr("name"), false);
                                //ApvKind = "대결";
                                break;
                            case "skip":
                                ApvSignLines += "/";
                                ApvDept = getAttribute("/");
                                ApvDateLines = "";
                                ApvDateLines += "&nbsp;";
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                break;
                            case "bypass":
                                ApvSignLines += m_oFormMenu.getLngLabel($(elm).attr("name"), false);
                                ApvDept = m_oFormMenu.getLngLabel($(elm).attr("ouname"), false);
                                ApvState = interpretResult($(elmTaskInfo).attr("result"));
                                ApvDateLines = "";
                                ApvDateLines += (LastDate == "") ? m_oFormMenu.gLabel_bypass : LastDate; //"후열"
                                ApvApproveNameLines += (LastApvName == "") ? m_oFormMenu.gLabel_bypass : LastApvName; //"후열"
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                break; //"후열"
                            case "review":
                                ApvSignLines += m_oFormMenu.getLngLabel($(elm).attr("name"), false);
                                ApvDept = m_oFormMenu.getLngLabel($(elm).attr("ouname"), false);
                                ApvState = interpretResult($(elmTaskInfo).attr("result"));
                                ApvDateLines = "";
                                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                break;
                            case "charge":
                                ApvSignLines += m_oFormMenu.getLngLabel($(elm).attr("name"), false);
                                ApvDept = m_oFormMenu.getLngLabel($(elm).attr("ouname"), false);
                                ApvState = interpretResult($(elmTaskInfo).attr("result"));
                                ApvDateLines = "";
                                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                break;
                            case "consent":
                                ApvSignLines += m_oFormMenu.getLngLabel($(elm).attr("name"), false);
                                ApvDept = m_oFormMenu.getLngLabel($(elm).attr("ouname"), false);
                                ApvState = interpretResult($(elmTaskInfo).attr("result"));
                                ApvDateLines = "";
                                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                                break;
                            default:
                                ApvSignLines += (strDate == "") ? m_oFormMenu.getLngLabel($(elm).attr("name"), false) : getSignUrl(sCode, $(elmTaskInfo).attr("customattribute1"), $(elm).attr("name"), strDate, false, $(elmTaskInfo).attr("result"), false);
                                ApvState = interpretResult($(elmTaskInfo).attr("result"));
                                ApvDept = m_oFormMenu.getLngLabel($(elm).attr("ouname"), false);
                                ApvDateLines = "";
                                ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                                ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
                        }

                        if (ApvCmt == "" || ApvCmt == "&nbsp;") {
                            ApvPOSLines = "<tr style='font-family: Arial, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background:#FFFFFF;font-size:9pt;'>" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle
			                               + "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState + "</td>" + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + ApvPOSLines;
                            cnt++;
                        }
                        else {
                            ApvPOSLines = "<tr style='font-family: Arial, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background:#FFFFFF;font-size:9pt;'>" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle
			                               + "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState + "</td>" + "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines + "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + "<tr><td> " + ApvCmtHtml + "</td></tr>" + ApvPOSLines;
                            cnt++;
                        }
                    }
                }
            }
            //사람일 경우 for문 끝
        }
    }

    return ApvPOSLines;
}



/**
* @func CreateXmlDocument() { return object }
* @brief DOM 객체를 호출함.
*/
function CreateXmlDocument() {
    if (window.ActiveXObject) { // code for IE
        return new ActiveXObject("Microsoft.XMLDOM");
    } else if (document.implementation.createDocument) {// code for Mozilla, Firefox, Opera, etc.
        return document.implementation.createDocument("", "", null);
    } else {
        alert('Your browser cannot handle this script');
        return null;
    }
}

/**
* @func CreateXmlHttpRequest() { return object }
* @brief XMLHTTP 객체를 호출함.
*/
function CreateXmlHttpRequest() {

    alert(window.ActiveXObject);
    if (window.ActiveXObject) {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
        
            return new ActiveXObject("Msxml.XMLHTTP");
        }
    }
    else if (window.XMLHttpRequest) { return new XMLHttpRequest(); }
    else { return null; }
}

function SelectSingleNode(xmlDoc, elementPath) {
    if (window.ActiveXObject) {
        if (elementPath == "response/error") {
            return null;
        } else {
            return xmlDoc.selectSingleNode(elementPath).text;
        }
    }
    else {
        var xpe = new XPathEvaluator();
        var nsResolver = xpe.createNSResolver(xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);
        var results = xpe.evaluate(elementPath, xmlDoc, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        if (elementPath == "response/error") {
            return null;
        } else {
            return results.singleNodeValue.textContent;
        }
    }
}


//양식제목에서 에디터안의 제목란과 Sync (2012-11-07 HIW)
function SetSubjectTbxSync() {

    try {
        //제목에 "'"를 "`"로 치환
        var vSubjectTmp = document.getElementsByName("SUBJECT")[0].value;
        if (vSubjectTmp.indexOf("'") > -1)
            document.getElementsByName("SUBJECT")[0].value = ReplaceChars(vSubjectTmp, "'", "`");

        TagfreeScriptEditor.document.getElementById("tdSubject").innerHTML = "<p align='left'>&nbsp;" + document.getElementsByName("SUBJECT")[0].value + "</p>";

    } catch (e) { }
}

//양식문서번호에서 에디터안의 문서번호란과 Sync (2013-03-18 HIW)
function SetDocNoTbxSync() {

    try {
        TagfreeScriptEditor.document.getElementById("tdDocNum").innerHTML = "<p align='left'>&nbsp;" + document.getElementsByName("DocNum")[0].value + "</p>";
    } catch (e) { }
}

var vSaveTermChangeCnt = 0;

//에디터안의 보존년한 Sync (2012-11-07 HIW)
function SetSaveTermTbxSync() {

    try {
        if (vSaveTermChangeCnt == 0) {
            //에디터 높이를 에디터내용만큼 지정
            var oIFrm = $("#TagfreeScriptEditor");
            oIFrm.height(oIFrm.context.body.scrollHeight);
        }
        
        vSaveTermChangeCnt++;

        //에디터스크롤 제일위로..
        TagfreeScriptEditor.scrollTo(0, 0)

        TagfreeScriptEditor.document.getElementById("tdSaveTerm").innerHTML = "<center>" + $("select[name=SAVE_TERM] option:selected").text() + "</center>";

        //제목에 포커스 (본문에 제목이 들어가지않는 양식인 경우 에러날수있음)
        document.getElementsByName("SUBJECT")[0].focus();
    }
    catch (e) { }

    
}

//발신부서 다국어 (HIW)
function GetSendDeptLang() {
    var sStr = "";
    if (getInfo("uslng") == "ko-KR")
        sStr = "발신부서";
    else if (getInfo("uslng") == "en-US")
        sStr = "Sending dept";
    else if (getInfo("uslng") == "ja-JP")
        sStr = "発信部門";    
    else
        sStr = "発信部門";    

    return sStr;
}


//합의일자 다국어 (HIW)
function GetConsultDateLang() {
    var sStr = "";
    if (getInfo("uslng") == "ko-KR")
        sStr = "합의일자";
    else if (getInfo("uslng") == "en-US")
        sStr = "Agreement dated";
    else if (getInfo("uslng") == "ja-JP")
        sStr = "合意日";
    else
        sStr = "合意日期";

    return sStr;
}

//보존년한 다국어 (HIW)
function GetSaveTermLang(pVal) {
    var sStr = "";
    if (pVal == "99") {
        if (getInfo("uslng") == "ko-KR")
            sStr = "영구";
        else if (getInfo("uslng") == "en-US")
            sStr = "Eternity";
        else if (getInfo("uslng") == "ja-JP")
            sStr = "永久";
        else
            sStr = "永久";
    }
    else {
        if (getInfo("uslng") == "ko-KR")
            sStr = pVal + "년";
        else if (getInfo("uslng") == "en-US")
            sStr = pVal + "Year";
        else if (getInfo("uslng") == "ja-JP")
            sStr = pVal + "年";
        else
            sStr = pVal + "年";
    }

    return sStr;
}



