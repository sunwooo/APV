var m_oApvList = new ActiveXObject("MSXML2.DOMDocument");
var m_print = false; //출력상태여부 - 출력형태로 할때 사용 
var bFileView = false;
var bPresenceView = true;

/*수신처, 발신처 부서 결재선 표현*/			
function getRequestApvList(elmList,elmVisible,sMode,bReceive,sApvTitle,bDisplayCharge){//신청서html
	var elm, elmTaskInfo, elmReceive, elmApv;
	var strDate;
	var j=0;
	var Apvlines ="";
	var ApvPOSLines="<tr>";
	var ApvSignLines = "<tr>";
	var ApvApproveNameLines="<tr>";
	var ApvDateLines="<tr>";
	var ApvCmt="<tr>";	
	var strColTD = elmList.length - elmVisible.length;
	var strwidth = "90"; //String(100/strColTD);
	var rWIDTH = "90";
	var elmRoot = m_oApvList.documentElement;
	var elmSendList = elmRoot.selectSingleNode("division[@divisiontype='send']/taskinfo[@status='completed']");
	var tempCount = 0;
	if (getInfo("scIPub") == "1") {
	    hReciveBool.value = bReceive;
	    rWIDTH = "90";
	} else {
	    if (elmList.length > 5) {
	        rWIDTH = String(715 / elmList.length);
	    } else if (getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") { rWIDTH = "238px"; } 
	    else {rWIDTH = "143px"; }
	}
	for (var i = 0; i < elmList.length - j; i++) {

	    elm = elmList.nextNode();
	    elmTaskInfo = elm.selectSingleNode("taskinfo");
	    //빈칸 채우기
	    if (i == elmList.length - 1 && i != 0 && getInfo("fmpf") != "WF_FORM_DRAFT_HS" && getInfo("fmpf") != "WF_FORM_HS_DRAFT" && getInfo("fmpf") != "WF_FORM_HM_DRAFT") {//결재선에 5명미만일 경우 최종결자만 우측정렬하고 나머진 좌측정렬한다.(기본결재란 5칸)  - 현대백화점
	        var k = 5;
	        if (getInfo("scIPub") == "1") {
	            if (getInfo("scRec") == "1") { k = 3; }
	            else { k = 4; }
	        }
	        for (k; k > elmList.length; k--) {
	            ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;'>調整</td>";
	            ApvSignLines += "<td width='" + rWIDTH + "' height='60' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>/</td>";
	            ApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>&nbsp;</td>";
	            ApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>&nbsp;</td>";
	        }

	    }
	    else if (i != 0 && getInfo("fmpf") == "WF_FORM_DRAFT_HS") 
	    {
	        if (elmList.length < 5) {
	            var tempC = 5 - elmList.length - tempCount;
	            for (var l = 0; l < tempC; l++) {
	                if (l == 0) { ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>調整</td>"; }
	                else if (l == 1) { ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>決定</td>"; }
	                else {
	                    ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;'>報告(後決)</td>";
	                }
	                ApvSignLines += "<td width='" + rWIDTH + "' height='60' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>/</td>";
	                ApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>&nbsp;</td>";
	                ApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>&nbsp;</td>";
	            }
	            tempCount = tempCount + 1;
	            tempCount++;
	        }
	    }
	    else if (i != 0 && (getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT")) {//빈칸 채우기
	        if (elmList.length < 3) {
	            var tempC = 3 - elmList.length - tempCount;
	            var tmpNum = 10;
	            for (var l = 0; l < tempC; l++) {
	                if (String(window.location).indexOf("_read.htm") > -1) {
	                    ApvPOSLines += "<td id='apvline_" + tmpNum + "' height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>";
	                    ApvPOSLines += "</td>";
	                }
	                else {
	                    ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>";
	                    ApvPOSLines += "<select id='mField' name='apvline_" + tmpNum + "'>";
	                    ApvPOSLines += "<option value='調整'>調整</option>";
	                    ApvPOSLines += "<option value='決定'>決定</option>";
	                    ApvPOSLines += "<option value='後決'>後決</option>";
	                    ApvPOSLines += "</select>";
	                    ApvPOSLines += "</td>";
	                }
	                ApvSignLines += "<td width='" + rWIDTH + "' height='60' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>/</td>";
	                ApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>&nbsp;</td>";
	                ApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>&nbsp;</td>";
	            }
	            tempCount = tempCount + 1;
	            tempCount++;
	        }
	    }
        //자동결재선에 따라 부서표시 수정부분 추가
        if (i == 0) {
            if (sApvTitle != "" && sApvTitle != undefined) {
                sApvTitle = elm.getAttribute("ouname").replace(/-/gi, "<br/>");
            }
            if (bReceive) { //담당부서 결재선
                if (sApvTitle != "") {
                    if (getInfo("scIPub") == "1") { ApvPOSLines += "<td rowspan='4' width='25' height='110' align='center' style='color: #111111; font-family: 굴림, Dotum;font-size: 15px;' nowrap='f'>決栽</td>"; }
                    else { ApvPOSLines += "<td rowspan='4' width='25' height='110' align='center' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #d9ebf8;' nowrap='f'>주관부서</td>"; }
                } //주관부서 결재선
            } else {
            //if (sApvTitle != "") {
                if (getInfo("scPRec") == "1" || getInfo("scDRec") == "1" || getInfo("scChgr") == "1" || getInfo("scChgrOU") == "1") {
                        ApvPOSLines += "<td rowspan='4' width='25' height='110' align='center' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #d9ebf8;' nowrap='f'>신청부서</td>";
                }
                else {
                    if (getInfo("fmpf") == "WF_FORM_DRAFT_HS" || getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") { ApvPOSLines += ""; }
                    else {
                        ApvPOSLines += "<td rowspan='4' width='25' height='110' align='center' style='color: #111111; font-family: 굴림, Dotum;font-size: 15px;' nowrap='f'>決栽</td>";
                    }
                }
            //} //신청부서 결재선           		
        }
    }
        //결재방에서 직책이 아닌 직위 표시로 바꿈 - 현대백화점
        if ((bDisplayCharge && i == 0) || (elmTaskInfo.getAttribute("visible") != "n")) //결재선 숨기기한 사람 숨기기
        {
            if (elmTaskInfo.getAttribute("kind") == 'charge') {
                var sTitle = "";
                try {
                    sTitle = elm.getAttribute("position");
                    if (sTitle.substring(sTitle.lastIndexOf(";") + 1) == "") sTitle = elm.getAttribute("level"); // kckangy update 2005.02.26
                    sTitle = sTitle.substring(sTitle.lastIndexOf(";") + 1);
                } catch (e) {
                    if (elm.nodeName == "role") {
                        sTitle = elm.getAttribute("name");
                        sTitle = sTitle.substr(sTitle.length - 2);
                    }
                }
                // kckangy update 2005.02.26
                if (bReceive && elmList.length == 1) {
                    var temp_charge = parent.menu.gLabel_charge; 				//"담당"
                }
                else {
                    var temp_charge = parent.menu.gLabel_charge_apvline;  //"기안"
                }
                if (getInfo("fmpf") == "WF_FORM_DRAFT_HS" || getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") {
                    ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>起案</td>"; //결재선 상단  표시되는곳
                }
                else {
                    ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;'>起案</td>";
                }
            }
            else {

                var sTitle = "";
                try {
                    sTitle = elm.getAttribute("position");
                    if (sTitle.substring(sTitle.lastIndexOf(";") + 1) == "") sTitle = elm.getAttribute("level"); // kckangy update 2005.02.26
                    sTitle = sTitle.substring(sTitle.lastIndexOf(";") + 1);
                } catch (e) {
                    if (elm.nodeName == "role") {
                        sTitle = elm.getAttribute("name");
                        sTitle = sTitle.substr(sTitle.length - 2);
                    }
                }
                if (sTitle == parent.menu.gLabel_charge_person) {
                    sTitle = parent.menu.gLabel_charge; //"담당"
                }
                if (i == elmList.length - 1) {
                    if (getInfo("fmpf") == "WF_FORM_DRAFT_HS") { }
                    else if (getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") {
                        if (String(window.location).indexOf("_read.htm") > -1) {
                            ApvPOSLines += "<td id='apvline_" + i + "' height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>";
                            ApvPOSLines += "</td>";
                        }
                        else {
                            ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>";
                            ApvPOSLines += "<select id='mField' name='apvline_" + i + "'>";
                            ApvPOSLines += "<option value='調整'>調整</option>";
                            ApvPOSLines += "<option selected value='決定'>決定</option>";
                            ApvPOSLines += "<option value='後決'>後決</option>";
                            ApvPOSLines += "</select>";
                            ApvPOSLines += "</td>";
                        }
                    }
                    else{
                        ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;'>決定</td>"; 
                    }
                }
                else if (getInfo("fmpf") == "WF_FORM_DRAFT_HS" && i == elmList.length - 2) {
                ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;'>報告(後決)</td>";
                }
                else if (getInfo("fmpf") == "WF_FORM_DRAFT_HS" && i == elmList.length - 3) {
                ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>決定</td>";
                }
                else {
                    if (getInfo("fmpf") == "WF_FORM_DRAFT_HS") {
                        ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>調整</td>";
                    }
                    else if (getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") {
                        if (String(window.location).indexOf("_read.htm") > -1) {
                            ApvPOSLines += "<td id='apvline_" + i + "' height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>";
                            ApvPOSLines += "</td>";
                        }
                        else {
                            ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>";
                            ApvPOSLines += "<select id='mField' name='apvline_" + i + "'>";
                            ApvPOSLines += "<option value='調整'>調整</option>";
                            ApvPOSLines += "<option value='決定'>決定</option>";
                            ApvPOSLines += "<option value='後決'>後決</option>";
                            ApvPOSLines += "</td>";
                        }
                    }
                    else {
                        ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;'>調整</td>";
                    }
                }
            }
            if (getInfo("fmpf") == "WF_FORM_DRAFT_HS" && i == elmList.length - 1 && i != 0) {
                ApvDateLines += "";
                ApvSignLines += "";
                ApvApproveNameLines += "";
            }
            else {
                ApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>";
                ApvSignLines += "<td width='" + rWIDTH + "' height='60' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>";
                ApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>";
            }
            //발송일자 표시.. - 현대백화점 
            try {
                SendDate.innerHTML = formatDate(elmSendList.getAttribute("datecompleted"),"R"); //formatDate(strDate);
            }
            catch (e) {
                //양식에 SendDate(발송일자)가 정의 되지 않으면 그냥 지나가게 처리
            }
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
                if (parent.menu.m_CmtBln == false) { ApvCmt += (assistcmt == null) ? "&nbsp;" : parent.menu.gLabel_comment; }
                else
                { ApvCmt += (assistcmt == null) ? "&nbsp;" : "<a href=\'#\' onclick=\'viewComment(\"" + i + "\")\'>" + parent.menu.gLabel_comment + "</a>"; }
            }

            var sCode = "";
            var elmtemp;
            if (elm.nodeName == "role")
                try { sCode = elm.selectSingleNode("person").getAttribute("code"); elmtemp = elm.selectSingleNode("person"); } catch (e) { }
            else
                sCode = elm.getAttribute("code");

            var elmname = (elmtemp != null) ? elmtemp : elm;

            if (i == elmList.length - 1 && i != 0 && !bReceive) {
                //대내문서 발송부서 최종 결재자 표시
                var oPosition = elm.getAttribute("position").split(";");

                try {
                    idDept.innerHTML = elm.getAttribute("ouname"); //소속
                    idJopPosion.innerHTML = oPosition[1]; //직위
                    idName.innerHTML = elm.getAttribute("name"); //성명
                    if (elmTaskInfo.getAttribute("datecompleted") != "" && elmTaskInfo.getAttribute("datecompleted") != null) {
                        idSign.innerHTML = getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); //서명
                    } else {
                        idSign.innerHTML = "/";
                    }
                } catch (e) { }
           }
            if (getInfo("fmpf") == "WF_FORM_DRAFT_HS" && i == elmList.length - 1 && i != 0) {
                switch (elmTaskInfo.getAttribute("kind")) {
                    case "authorize":
                        eApvSignLine.innerHTML = parent.menu.gLabel_authorize + interpretResult(elmTaskInfo.getAttribute("result")); //전결
                        eApvApproveNameLine.innerHTML = sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name"); //"&nbsp;";
                        eApvDateLine.innerHTML = (strDate == "") ? "&nbsp;" : formatDate(strDate, "APV");
                        LastApv = "/";
                        LastApvName = elmname.getAttribute("name") + interpretResult(elmTaskInfo.getAttribute("result"));
                        LastDate = formatDate(strDate, "APV");
                        break;
                    case "substitute":
                        if (strDate == "") { eApvSignLine.innerHTML = parent.menu.gLabel_substitue; } else { ApvSignLines += getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); } //"대결"
                        eApvApproveNameLine.innerHTML = sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name");
                        eApvDateLine.innerHTML = formatDate(strDate, "APV");
                        LastApv = "";
                        LastApvName = "";
                        LastDate = "";
                        break;
                    case "skip":
                        eApvSignLine.innerHTML = "/";
                        eApvApproveNameLine.innerHTML = sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name"); //"&nbsp;";
                        eApvDateLine.innerHTML = "&nbsp;";
                        break;
                    case "bypass":
                        eApvSignLine.innerHTML = (LastApv == "") ? parent.menu.gLabel_bypass : LastApv; //"후열"
                        eApvApproveNameLine.innerHTML = sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name");
                        eApvDateLine.innerHTML = (LastDate == "") ? formatDate(strDate, "APV") : LastDate;
                        break; //"후열"
                    case "review":
                        eApvSignLine.innerHTML = (strDate == "") ? parent.menu.gLabel_review : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); //후결
                        eApvApproveNameLine.innerHTML = sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name");
                        eApvDateLine.innerHTML = (strDate == "") ? "&nbsp;" : formatDate(strDate, "APV");
                        break;
                    default:
                        eApvSignLine.innerHTML = (strDate == "") ? "/" : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true);
                        eApvApproveNameLine.innerHTML = sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name");
                        eApvDateLine.innerHTML = (strDate == "") ? "&nbsp;" : formatDate(strDate, "APV");
                }
            }
            else {
                switch (elmTaskInfo.getAttribute("kind")) {
                    case "authorize":
                        ApvSignLines += parent.menu.gLabel_authorize + interpretResult(elmTaskInfo.getAttribute("result")); //전결
                        ApvApproveNameLines += sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name"); //"&nbsp;";
                        if (getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") {
                            ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate, "APV");
                        }
                        else {
                            ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        }
                        LastApv = "/";
                        LastApvName = elmname.getAttribute("name") + interpretResult(elmTaskInfo.getAttribute("result"));
                        if (getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") {
                            LastDate = formatDate(strDate, "APV");
                        }
                        else {
                            LastDate = formatDate(strDate);
                        }
                        break;
                    case "substitute":
                        if (strDate == "") { ApvSignLines += parent.menu.gLabel_substitue; } else { ApvSignLines += getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); } //"대결"
                        ApvApproveNameLines += sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name");
                        if (getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") {
                            ApvDateLines += formatDate(strDate, "APV");
                        }
                        else {
                            ApvDateLines += formatDate(strDate);
                        }
                        LastApv = "";
                        LastApvName = "";
                        LastDate = "";
                        break;
                    case "skip":
                        ApvSignLines += "/";
                        ApvApproveNameLines += sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name"); //"&nbsp;";
                        ApvDateLines += "&nbsp;";
                        break;
                    case "bypass":
                        ApvSignLines += (LastApv == "") ? parent.menu.gLabel_bypass : LastApv; //"후열"
                        ApvApproveNameLines += sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name");
                        if (getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") {
                            ApvDateLines += (LastDate == "") ? formatDate(strDate, "APV") : LastDate;
                        }
                        else {
                            ApvDateLines += (LastDate == "") ? formatDate(strDate) : LastDate;
                        }
                        break;   //"후열"
                    case "review":
                        ApvSignLines += (strDate == "") ? parent.menu.gLabel_review : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); //후결
                        ApvApproveNameLines += sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name");
                        if (getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") {
                            ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate, "APV");
                        }
                        else {
                            ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        }
                        break;
                    case "charge":
                        ApvSignLines += getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true);
                        ApvApproveNameLines += sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name");
                        if (getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") {
                            ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate, "APV");
                        }
                        else {
                            ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        }
                        break;
                    default:
                        ApvSignLines += (strDate == "") ? "/" : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true);
                        ApvApproveNameLines += sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name");
                        if (getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") {
                            ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate, "APV");
                        }
                        else {
                            ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                        }
                }
                ApvSignLines += "</td>";
                ApvApproveNameLines += "</td>";
                ApvDateLines += "</td>";
            }
        }
        //결재선에 기안자만 있을 경우 기안자 이후로 공란 3 or 4(신청서)칸 자동 추가 - 현대백화점
        if (elmList.length == 1) {
            var l = 5;
            if (getInfo("scIPub") == "1") {
                if (getInfo("scRec") == "1") { l = 3; }
                else { l = 4; }
            }
            if (getInfo("fmpf") == "WF_FORM_DRAFT_HS") {
                l = 4;
                for (l; l > 1; l--) {
                    if (l == 3) { ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>決定</td>"; }
                    else if (l == 2) { ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;'>報告(後決)</td>"; }
                    else { ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>調整</td>"; }
                    ApvSignLines += "<td width='" + rWIDTH + "' height='60' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>/</td>";
                    ApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>&nbsp;</td>";
                    ApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>&nbsp;</td>";
                }
            }
            else if (getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") {//기안자만 있을경우(처음 문서를 열었을때)
                l = 3;
                var tmpNum = 10;
                for (l; l > 1; l--) {
                    if (String(window.location).indexOf("_read.htm") > -1){
                        ApvPOSLines += "<td id='apvline_" + tmpNum + "' height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>";
                        ApvPOSLines += "</td>";
                    }
                    else{
                        ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;background-color:#CCCCCC;'>";
                        ApvPOSLines += "<select id='mField' name='apvline_" + tmpNum + "'>";
                        ApvPOSLines += "<option value='調整'>調整</option>";
                        ApvPOSLines += "<option value='決定'>決定</option>";
                        ApvPOSLines += "<option value='後決'>後決</option>";
                        ApvPOSLines += "</td>";
                    }
                    ApvSignLines += "<td width='" + rWIDTH + "' height='60' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>/</td>";
                    ApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>&nbsp;</td>";
                    ApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>&nbsp;</td>";
                    tmpNum++;
                }
            }
            else {
                for (l; l > 1; l--) {
                    if (l == 2) { ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;'>決定</td>"; }
                    else { ApvPOSLines += "<td height='20'  width='" + rWIDTH + "' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 14px;'>調整</td>"; }
                    ApvSignLines += "<td width='" + rWIDTH + "' height='60' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>/</td>";
                    ApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>&nbsp;</td>";
                    ApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>&nbsp;</td>";
                }
            }
        }
	}//for문
	Apvlines = ApvPOSLines + "</tr>" + ApvSignLines + "</tr>" + ApvDateLines + "</tr>" + ApvApproveNameLines + "</tr>";
	if (getInfo("fmpf") == "WF_FORM_DRAFT_HS" || getInfo("fmpf") == "WF_FORM_HS_DRAFT" || getInfo("fmpf") == "WF_FORM_HM_DRAFT") {
	    Apvlines = "<table bgcolor='#FFFFFF' border='1' cellpadding='0' cellspacing='0' bordercolor='#111111' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;'>" + Apvlines + "</table>";	//width:95%;
	}
	else{
	    Apvlines = "<table bgcolor='#FFFFFF' border='2' cellpadding='0' cellspacing='0' bordercolor='#111111' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;'>" + Apvlines + "</table>";	//width:95%;
	}
	return Apvlines;	
}


//결재라인
function displayApvList(oApvList)
{
	var elmRoot, elmdiv, elmList, elm, elmTaskInfo, elmReceive, ApvList, elmVisible, elmRecList;
	var Apvlines = "";
	var strDate, strFieldName, strwidth, strColTD, LastDate;
	//logo.src = "http://tstmaeil.com/COVINet/BackStorage/Approval/" + (getInfo("ENT_CODE")!=undefined?getInfo("ENT_CODE"):getInfo("etid"))+".gif";//회사 logo 처리
	elmRoot = oApvList.documentElement;		
	if(elmRoot != null){
	    elmdiv = elmRoot.selectNodes("division");
	    for(var i=0; i < elmdiv.length ; i++){
	        elm = elmdiv.nextNode();
	        elmList = elm.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='approve' or @routetype='receive') ]/ou/(person|role)");
	        elmVisible = elm.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='approve' or @routetype='receive') ]/ou/(person|role)[taskinfo/@visible='n']");			
	        
	        var elmComment = elm.selectNodes("step/ou/person/taskinfo/comment");		
            if ((bgetCommentView && elmComment.length>0 && String(window.location).indexOf("_read.htm") > -1) ||(bgetCommentView && elmComment.length>0 && parent.menu.sMody==true))
            {
                if(m_print == false) getCommentView(elmComment,i);
            }
	        
	        if(getInfo("scPRec") =="1" || getInfo("scDRec") =="1" || getInfo("scChgr") == "1" || getInfo("scChgrOU") == "1"){//수신처가 있는경우 좌측:내부결재 우측 수신처 결재선
	            var oApvSignLines = "";
	            var oApvApproveNameLines = "";
	            var oApvDateLines = "";
	            var oApvPOSLines = "<tr><td rowspan='4' width='25' height='110' align='center' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #d9ebf8;' nowrap='f'>주관부서</td>";
	            if(elmdiv.length > 1){
    			    if(i == 0) {try{LApvLine.innerHTML = getRequestApvList(elmList,elmVisible,"",false,elm.getAttribute("ouname"));}catch(e){AppLine.innerHTML= getRequestApvList(elmList,"",true,elm.getAttribute("ouname"));}}
    			    if(i == 1) {
    			        var sOUName = elm.getAttribute("ouname");
    			        //try{if(sOUName == null){sOUName=elm.selectSingleNode("step/ou").getAttribute("name");}}catch(e){}
    			        try {
    			            if (sOUName == null) {
    			                for (var g = 0; g < 5; g++) {
    			                    oApvSignLines += "<td width='143' height='60' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>/</td>";
    			                    oApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>&nbsp;</td>";
    			                    oApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>&nbsp;</td>";
    			                }
    			                var oApvlines = oApvPOSLines + oApvSignLines + "</tr>" + oApvApproveNameLines + "</tr>" + oApvDateLines + "</tr>";
    			                RApvLine.innerHTML = "<table bgcolor='#FFFFFF' border='2' cellpadding='0' cellspacing='0' bordercolor='#111111' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;'>" + oApvlines + "</table>";
    			            } else {
    			                RApvLine.innerHTML = getRequestApvList(elmList, elmVisible, "", true, sOUName, true);
    			            }  
    			        }
    			        catch(e){AppLine.innerHTML= getRequestApvList(elmList,"",true,elm.getAttribute("ouname"));}
    			    }
	            }else{
	                LApvLine.width = 760; //600;
	                RApvLine.width = 760;
    			    if(i == 0) {
    			        try{LApvLine.innerHTML = getRequestApvList(elmList,elmVisible,"",false,elm.getAttribute("ouname"));}catch(e){AppLine.innerHTML= getRequestApvList(elmList,"",true,elm.getAttribute("ouname"));}
    			        //담당부서/담당업무뿌려주기//주관부서없을경우
    			        for (var g = 0; g < 5; g++) {
    			            oApvSignLines += "<td width='143' height='60' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>/</td>";
    			            oApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>&nbsp;</td>";
    			            oApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>&nbsp;</td>";
    			        }
    			        var oApvlines = oApvPOSLines + oApvSignLines + "</tr>" + oApvApproveNameLines + "</tr>" + oApvDateLines + "</tr>";
    			        RApvLine.innerHTML = "<table bgcolor='#FFFFFF' border='2' cellpadding='0' cellspacing='0' bordercolor='#111111' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;'>" + oApvlines + "</table>"; //현대"<table bordercolor='#111111' border='2' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100;width:'><tr><td rowspan='4' bgcolor='#F2F2F2' width='10' height='100' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>"+parent.menu.gLabel_managedept+"</td><td height='20'  bgcolor='#F2F2F2'  width='100' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>&nbsp;</td></tr><tr><td height='50' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>"+(getInfo("scChgr")=="1"?getInfo("scChgrV").split("@")[1]:"")+"</td></tr><tr><td height='20'  align='center' valign='bottom' style='font-size:8pt;'></td></tr><tr><td height='20' align='center' valign='middle' style='font-size:8pt;'></td></tr></table>";
    			    }
	            }
	        }else{
	            if(elmdiv.length > 1){
    			    if(i == 0) {try{LApvLine.innerHTML = getRequestApvList(elmList,elmVisible,"",false,elm.getAttribute("ouname"));}catch(e){AppLine.innerHTML= getRequestApvList(elmList,"",true,elm.getAttribute("ouname"));}}
    			    if(i == 1) {try{RApvLine.innerHTML = getRequestApvList(elmList,elmVisible,"",true,elm.getAttribute("ouname"), true);}catch(e){AppLine.innerHTML= getRequestApvList(elmList,"",true,elm.getAttribute("ouname"));}}
	            }else{
									AppLine.align = "right";
	                AppLine.innerHTML =  getRequestApvList(elmList,elmVisible,"",false,elm.getAttribute("ouname"));
	            }
	        }
	        
	        
	    }
		
		//협조부서/협조자 분리하여 표시 - 현대백화점 //합의출력		
		elmList = elmRoot.selectNodes("(division/step[(@unittype='person' or @unittype='role') and (@routetype='assist' or @routetype='consult')]/ou/(person|role))"); //개인합의
		elmOUList = elmRoot.selectNodes("(division/step[@unittype='ou' and (@routetype='assist' or @routetype='consult')]/ou)"); //부서협조		
		elmListCount = elmList.length + elmOUList.length;
		var LastTitle, LastCmt, LastResult;
		var ApvlinesList = "";
		var ApvlinesOUList = "";
		var sPosition = "";
		// 현대홈쇼핑 품의일 경우 협조 따로 구성함
		// 부서협조
		if (getInfo("fmpf") == "WF_FORM_DRAFT_HS" || getInfo("fmpf") == "WF_FORM_HS_DRAFT") {
		    Assist_1.innerHTML = "";
		    Assist_2.innerHTML = "";
		    Assist_3.innerHTML = "";
		    Assist_4.innerHTML = "";
		    if (elmOUList.length != 0) {
		        for (var i = 0; i < elmOUList.length; i++) {
		            elmOUPersonList = elmRoot.selectNodes("(division/step[@unittype='ou' and (@routetype='assist' or @routetype='consult')]/ou/person)") //협조부서 결재선
		            elm = elmOUList.nextNode();
		            elmTaskInfo = elm.selectSingleNode("taskinfo");
		            strDate = elmTaskInfo.getAttribute("datecompleted");
		            if (strDate == null) { strDate = ""; }
		            switch (i) {
		                case 0:
		                    Assist_1.innerHTML = elm.getAttribute("name");
		                    if (strDate == "" && elm.childNodes.length > 1) { Assist_sign1.innerHTML = "진행중" }
		                    else if (strDate != "") {
		                        for (var k = 0; k < elm.childNodes.length; k++) {
		                            var sCode = "";
		                            if (k == elm.childNodes.length - 1) {
		                                var sCode = elm.childNodes[k].getAttribute("code")
		                                elmTaskInfoT = elm.childNodes[k].lastChild;
		                                elmName = elm.childNodes[k].getAttribute("name")
		                                Assist_sign1.innerHTML = getSignUrl(sCode, elmTaskInfoT.getAttribute("customattribute1"), elmName, strDate, false, elmTaskInfoT.getAttribute("result"), "assi");
		                            }
		                        }
		                    }
		                    else { Assist_sign1.innerHTML = ""; } //interpretResult(elmTaskInfo.getAttribute("result")); }
		                    Assist_date1.innerHTML = formatDate(strDate, "APV");
		                    break;
		                case 1:
		                    Assist_2.innerHTML = elm.getAttribute("name");
		                    if (strDate == "" && elm.childNodes.length > 1) { Assist_sign2.innerHTML = "진행중" }
		                    else if (strDate != "") {
		                        for (var j = 0; j < elm.childNodes.length; j++) {
		                            var sCode = "";
		                            if (j == elm.childNodes.length - 1) {
		                                var sCode = elm.childNodes[j].getAttribute("code")
		                                elmTaskInfoT = elm.childNodes[j].lastChild
		                                elmName = elm.childNodes[j].getAttribute("name")
		                                Assist_sign2.innerHTML = getSignUrl(sCode, elmTaskInfoT.getAttribute("customattribute1"), elmName, strDate, false, elmTaskInfoT.getAttribute("result"), "assi");
		                            }
		                        }
		                    }
		                    else { Assist_sign2.innerHTML = ""; } //interpretResult(elmTaskInfo.getAttribute("result")); }
		                    Assist_date2.innerHTML = formatDate(strDate, "APV");
		                    break;
		                case 2:
		                    Assist_3.innerHTML = elm.getAttribute("name");
		                    if (strDate == "" && elm.childNodes.length > 1) { Assist_sign3.innerHTML = "진행중" }
		                    else if (strDate != "") {
		                        for (var t = 0; t < elm.childNodes.length; t++) {
		                            var sCode = "";
		                            if (t == elm.childNodes.length - 1) {
		                                var sCode = elm.childNodes[t].getAttribute("code")
		                                elmTaskInfoT = elm.childNodes[t].lastChild
		                                elmName = elm.childNodes[t].getAttribute("name")
		                                Assist_sign3.innerHTML = getSignUrl(sCode, elmTaskInfoT.getAttribute("customattribute1"), elmName, strDate, false, elmTaskInfoT.getAttribute("result"), "assi");
		                            }
		                        }
		                    }
		                    else { Assist_sign3.innerHTML = ""; } //interpretResult(elmTaskInfo.getAttribute("result")); }
		                    Assist_date3.innerHTML = formatDate(strDate, "APV");
		                    break;
		                case 3:
		                    Assist_4.innerHTML = elm.getAttribute("name");
		                    if (strDate == "" && elm.childNodes.length > 1) { Assist_sign4.innerHTML = "진행중" }
		                    else if (strDate != "") {
		                        for (var q = 0; q < elm.childNodes.length; q++) {
		                            var sCode = "";
		                            if (q == elm.childNodes.length - 1) {
		                                var sCode = elm.childNodes[q].getAttribute("code")
		                                elmTaskInfoT = elm.childNodes[q].lastChild
		                                elmName = elm.childNodes[q].getAttribute("name")
		                                Assist_sign4.innerHTML = getSignUrl(sCode, elmTaskInfoT.getAttribute("customattribute1"), elmName, strDate, false, elmTaskInfoT.getAttribute("result"), "assi");
		                            }
		                        }
		                    }
		                    else { Assist_sign4.innerHTML = ""; } //interpretResult(elmTaskInfo.getAttribute("result")); }
		                    Assist_date4.innerHTML = formatDate(strDate, "APV");
		                    break;
		            }
		        }
		    }
		}
		//개인협조
		else if (getInfo("fmpf") == "WF_FORM_HM_DRAFT") {
		    Assist_1.innerHTML = "";
		    Assist_2.innerHTML = "";
		    Assist_3.innerHTML = "";
		    Assist_4.innerHTML = "";
		    if (elmList.length != 0) {
		        for (var i = 0; i < elmList.length; i++) {
		            elm = elmList.nextNode();
		            elmTaskInfo = elm.selectSingleNode("taskinfo");
		            strDate = elmTaskInfo.getAttribute("datecompleted");
		            //debugger;
		            if (strDate == null) { strDate = ""; }
		            switch (i) {
		                case 0:
		                    var ptArr = elm.getAttribute("position").split(";")[1];
		                    var ptOuName = elm.getAttribute("ouname");
		                    Assist_1.innerHTML = ptOuName + " " + ptArr + "/" + elm.getAttribute("name");
		                    if (strDate != "") {
		                        for (var k = 0; k < elm.childNodes.length; k++) {
		                            var sCode = "";
		                            if (k == elm.childNodes.length - 1) {
		                                var sCode = elm.childNodes[k].getAttribute("code")
		                                elmTaskInfoT = elm.childNodes[k];
		                                elmName = elm.childNodes[k].getAttribute("name")
		                                Assist_sign1.innerHTML = getSignUrl(sCode, elmTaskInfoT.getAttribute("customattribute1"), elmName, strDate, false, elmTaskInfoT.getAttribute("result"), "assi");
		                            }
		                        }
		                    }
		                    else { Assist_sign1.innerHTML = ""; }
		                    Assist_date1.innerHTML = formatDate(strDate, "APV");
		                    break;
		                case 1:
		                    var ptArr = elm.getAttribute("position").split(";")[1];
		                    var ptOuName = elm.getAttribute("ouname");
		                    Assist_2.innerHTML = ptOuName + " " + ptArr + "/" + elm.getAttribute("name");
		                    if (strDate != "") {
		                        for (var j = 0; j < elm.childNodes.length; j++) {
		                            var sCode = "";
		                            if (j == elm.childNodes.length - 1) {
		                                var sCode = elm.childNodes[j].getAttribute("code")
		                                elmTaskInfoT = elm.childNodes[j];
		                                elmName = elm.childNodes[j].getAttribute("name")
		                                Assist_sign2.innerHTML = getSignUrl(sCode, elmTaskInfoT.getAttribute("customattribute1"), elmName, strDate, false, elmTaskInfoT.getAttribute("result"), "assi");
		                            }
		                        }
		                    }
		                    else { Assist_sign2.innerHTML = ""; }
		                    Assist_date2.innerHTML = formatDate(strDate, "APV");
		                    break;
		                case 2:
		                    var ptArr = elm.getAttribute("position").split(";")[1];
		                    var ptOuName = elm.getAttribute("ouname");
		                    Assist_3.innerHTML = ptOuName + " " + ptArr + "/" + elm.getAttribute("name");
		                    if (strDate != "") {
		                        for (var t = 0; t < elm.childNodes.length; t++) {
		                            var sCode = "";
		                            if (t == elm.childNodes.length - 1) {
		                                var sCode = elm.childNodes[t].getAttribute("code")
		                                elmTaskInfoT = elm.childNodes[t];
		                                elmName = elm.childNodes[t].getAttribute("name")
		                                Assist_sign3.innerHTML = getSignUrl(sCode, elmTaskInfoT.getAttribute("customattribute1"), elmName, strDate, false, elmTaskInfoT.getAttribute("result"), "assi");
		                            }
		                        }
		                    }
		                    else { Assist_sign3.innerHTML = ""; }
		                    Assist_date3.innerHTML = formatDate(strDate, "APV");
		                    break;
		                case 3:
		                    var ptArr = elm.getAttribute("position").split(";")[1];
		                    var ptOuName = elm.getAttribute("ouname");
		                    Assist_4.innerHTML = ptOuName + " " + ptArr + "/" + elm.getAttribute("name");
		                    if (strDate != "") {
		                        for (var q = 0; q < elm.childNodes.length; q++) {
		                            var sCode = "";
		                            if (q == elm.childNodes.length - 1) {
		                                var sCode = elm.childNodes[q].getAttribute("code")
		                                elmTaskInfoT = elm.childNodes[q];
		                                elmName = elm.childNodes[q].getAttribute("name")
		                                Assist_sign4.innerHTML = getSignUrl(sCode, elmTaskInfoT.getAttribute("customattribute1"), elmName, strDate, false, elmTaskInfoT.getAttribute("result"), "assi");
		                            }
		                        }
		                    }
		                    else { Assist_sign4.innerHTML = ""; }
		                    Assist_date4.innerHTML = formatDate(strDate, "APV");
		                    break;
		            }
		        }
		    }
		}
		else {
		    if (elmOUList.length != 0) {
		        ApvlinesOUList = "<tr><td width='220' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold;'>협조부서</td>";
		        ApvlinesOUList += "   <td width='220' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold;'>성명(최종결재자)</td>";
		        ApvlinesOUList += "   <td width='150' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold;'>결재일자</td>";
		        ApvlinesOUList += "   <td width='150' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold;'>결재결과</td></tr>";
		        for (var i = 0; i < elmOUList.length; i++) {
		            elmOUPersonList = elmRoot.selectNodes("(division/step[@unittype='ou' and (@routetype='assist' or @routetype='consult')]/ou/person)") //협조부서 결재선
		            elm = elmOUList.nextNode();
		            ApvlinesOUList += "<tr><td height='30' style='font-size:9pt;padding-left:4;'>" + elm.getAttribute("name") + "</td><td valign='middle' style='font-size:9pt;padding-left:4;'>";
		            elmTaskInfo = elm.selectSingleNode("taskinfo");
		            strDate = elmTaskInfo.getAttribute("datecompleted");
		            if (strDate == null) {
		                strDate = "";
		                ApvlinesOUList += "</td>";
		                ApvlinesOUList += "<td align='center' style='font-size:8pt;'></td>"; //debugger
		                if (elm.childNodes.length > 1) {
		                    ApvlinesOUList += "<td style='font-size:9pt;'>진행중</td></tr>";
		                } else {
		                    ApvlinesOUList += "<td style='font-size:9pt;'></td></tr>";
		                }
		            }
		            else if (strDate != "") {
		                for (var j = 0; j < elm.childNodes.length; j++) {
		                    var sCode = "";
		                    if (j == elm.childNodes.length - 1) {
		                        var sCode = elm.childNodes[j].getAttribute("code")
		                        elmTaskInfoT = elm.childNodes[j].lastChild;
		                        elmName = elm.childNodes[j].getAttribute("name")
		                        var elmPosition = elm.childNodes[j].getAttribute("position").split(";")[1];
		                        ApvlinesOUList += elmPosition + " " + elmName + "</td>";
		                        ApvlinesOUList += "<td align='center' style='font-size:8pt;'>" + formatDate(strDate, "APV") + "</td>"; //debugger
		                        ApvlinesOUList += "<td style='font-size:9pt;'>" + getSignUrl(sCode, elmTaskInfoT.getAttribute("customattribute1"), elmName, strDate, false, elmTaskInfoT.getAttribute("result"), "assi") + "</td></tr>";
		                        //getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true) + "</td></tr>";
		                    }
		                }
		            }
		            //Apvlines += (strDate=="")?"&nbsp;</td>":interpretResult(elmTaskInfo.getAttribute("result"))+"</td>";
		            //ApvlinesOUList += "" + "</td>";
		            //ApvlinesOUList += "<td align='center' style='font-size:8pt;'>" + formatDate(strDate,"APV") + "</td>";
		            //ApvlinesOUList += "<td style='font-size:9pt;'>" + interpretResult(elmTaskInfo.getAttribute("result")); //getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true) + "</td></tr>";
		        }
		    }
		    if (elmList.length != 0) {
		        var strApvNm = "협조자 부서";
		        //		        if (getInfo("scCAt1") == "1") { strApvNm = "정보보안 담당"; }
		        //		        else { strApvNm = "협조자"; }
		        ApvlinesList = "<tr><td width='220' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold;'>" + strApvNm + "</td>";
		        ApvlinesList += "   <td width='220' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold;'>성명</td>";
		        ApvlinesList += "   <td width='150' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold;'>결재일자</td>";
		        ApvlinesList += "   <td width='150' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold;'>결재결과</td></tr>";
		        for (var i = 0; i < elmList.length; i++) {
		            elm = elmList.nextNode();
		            sPosition = elm.getAttribute("position");
		            sPosition = sPosition.substring(sPosition.lastIndexOf(";") + 1);
		            var sCode = "";
		            var sTitle = "";
		            if (elm.nodeName == "role") {
		                try { sCode = elm.selectSingleNode("person").getAttribute("code"); } catch (e) { }
		                try { sTitle = elm.getAttribute("name"); } catch (e) { }
		            } else {
		                sCode = elm.getAttribute("code");
		                sTitle = elm.getAttribute("level");
		                sTitle = elm.getAttribute("name"); //sTitle.substring(sTitle.lastIndexOf(";")+1)+" "+
		            }
		            elmTaskInfo = elm.selectSingleNode("taskinfo");
		            strDate = elmTaskInfo.getAttribute("datecompleted");
		            if (strDate == null) { strDate = ""; }
		            var assistcmt = elm.selectSingleNode("taskinfo/comment");
		            switch (elmTaskInfo.getAttribute("kind")) {
		                case "substitute":
		                    LastTitle = getPresence(sCode, "assist" + i + sCode, elmname.getAttribute("sipaddress")) + elm.getAttribute("name");
		                    LastCmt = (assistcmt == null) ? "&nbsp;" : assistcmt.text.replace(/\n/g, "<br>");
		                    LastResult = ((strDate == "") ? "&nbsp;" : formatDate(strDate, "APV") + interpretResult(elmTaskInfo.getAttribute("result")));
		                    break;
		                case "bypass":
		                    ApvlinesList += "<tr ><td height='30' style='font-size:9pt; padding-left:4;'>" + elm.getAttribute("ouname") + "</td>";
		                    ApvlinesList += "<td style='font-size:9pt; padding-left:4;'>";
		                    ApvlinesList += sTitle + " " + parent.menu.gLabel_substitue + "&nbsp;&nbsp;" + LastTitle + "</td>";
		                    ApvlinesList += "<td align='center' style='font-size:9pt;'>" + LastResult + "</td>";
		                    ApvlinesList += "<td style='padding-left:4; word-break:break-all'>";
		                    ApvlinesList += LastCmt;
		                    ApvlinesList += "</td></tr>";
		                    break; //"후열"
		                default:
		                    ApvlinesList += "<tr ><td height='30' style='font-size:9pt; padding-left:4;'>" + elm.getAttribute("ouname") + "</td>";
		                    ApvlinesList += "<td style='font-size:9pt; padding-left:4;'>" + sPosition + " " + sTitle + "</td>";
		                    ApvlinesList += "<td align='center' style='font-size:9pt;'>" + ((strDate == "") ? "&nbsp;" : formatDate(strDate, "APV")) + "</td>"; //+ interpretResult(elmTaskInfo.getAttribute("result"))
		                    ApvlinesList += "<td style='font-size:9pt;padding-left:4; word-break:break-all'>";
		                    ApvlinesList += getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), "assi");
		                    ApvlinesList += "</td></tr>";
		                    break;
		            }

		        }
		    }
		    if (elmListCount != 0) {
		        //Apvlines = "<table width='100%' cellpadding='2' cellspacing='0' bgcolor='#FFFFFF' border='1' bordercolor='#dc5f0a' style='border-collapse: collapse;'>" + Apvlines + "</table>";
		        ApvlinesOUList = "<table width='100%' cellpadding='2' cellspacing='0' bgcolor='#FFFFFF' border='2' bordercolor='#111111' style='border-collapse: collapse;text-align:center; table-layout:fixed;'>" + ApvlinesOUList + "</table>";
		        ApvlinesList = "<table width='100%' cellpadding='2' cellspacing='0' bgcolor='#FFFFFF' border='2' bordercolor='#111111' style='border-collapse: collapse;text-align:center; table-layout:fixed;'>" + ApvlinesList + "</table>";
		        //AssistLine.innerHTML = Apvlines; AssistLine.style.display = "";
		        AssistLine.innerHTML = ApvlinesOUList + "<table><tr><td></td><tr></table>" + ApvlinesList; AssistLine.style.display = "";
		    } else {
		        AssistLine.innerHTML = ""; AssistLine.style.display = "none";
		    }
		}
		//참조자 출력
    displayCCInfo(elmRoot);
	}
	//배포처(수신처) 출력
	try {//배포처(수신)가 2개 이상일 경우 하단에 표시되게.. - 현대백화점
	    var oRecLine = initRecList().split(",");
	    var LenRecLIne = String(oRecLine.length - 1);
	    if (oRecLine.length > 1) {
	        RecLine.value = oRecLine[0] + " 외 " + LenRecLIne;
	        mRecLine.value = initRecList();
	        tbRecCC.style.display = ""; TrRecLine.style.display = "";
	    } else { RecLine.value = initRecList(); TrRecLine.style.display = "none"; }

	} catch (e) { }
	try{G_displaySpnDocLinkInfo();}catch(e){}
	try{G_displaySpnRejectDocLinkInfo();}catch(e){}
	try{if(getInfo("scPM")=="1") G_displaySpnPMLinkInfo((getInfo("scPMV")==""?null:getInfo("scPMV")));}catch(e){}

}