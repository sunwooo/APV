function requestApvlist(oApvList,sMode){//신청서종류(html, hwp)
	var elmRoot, elmList, elmReceive, ApvList;
	var Apvlines = "";

	elmRoot = oApvList.documentElement;
	elmReceive = elmRoot.selectNodes("step[@unittype='ou' and @routetype='receive']/ou"); //수신부서개수

	elmList = elmRoot.selectNodes("step[@unittype='person' and @routetype='approve']/ou/person");
	if (elmList.length>0){
			Apvlines = getRequestApvListHTML(elmList,sMode,false);
			if (elmReceive.length > 0 ){	LApvLine.innerHTML = Apvlines;	}else{RApvLine.innerHTML = Apvlines;	LApvLine.innerHTML = "";}
	}else{
			if (sMode == "T")	{//교원
				if (getInfo("fmpf").substring(getInfo("fmpf").length-5) == 'RPT_T'){//교무과보고서
					Apvlines += "<tr><td rowspan='2'>확<br><br>인</td><td class='deptsignfield'>교학과</td></tr>";
					Apvlines += "<tr><td class='signfield'></td></tr>";
				}else if (getInfo("fmpf").substring(getInfo("fmpf").length-4) == 'IN_T'){//단과대용신청서
					Apvlines += "<tr><td rowspan='2'>참<br><br>조</td><td class='deptsignfield'>학과장</td></tr>";
					Apvlines += "<tr><td class='signfield'></td></tr>";
				}else{//교무과신청서
					Apvlines += "<tr><td rowspan='2'>참<br><br>조</td><td class='deptsignfield'>학과장</td><td rowspan='2'>확<br><br>인</td><td class='deptsignfield'>교학과</td></tr>";
					Apvlines += "<tr><td class='signfield'></td><td class='signfield'></td></tr>";
				}
			}else{
				Apvlines += "<tr><td rowspan='2'>신청<br><br>부서</td><td class='deptsignfield'>담당</td><td class='deptsignfield'>팀장</td><td class='deptsignfield'>본부장</td></tr>";
				Apvlines += "<tr><td class='signfield' ></td><td class='signfield'></td><td class='signfield'></td></tr>";
			}
			if ((getInfo("fmpf") == 'REQUEST_WORKSHOP_IN_RPT_T') || (getInfo("fmpf") == 'REQUEST_STUDYTRIP_IN_RPT_T') ){
				LApvLine.innerHTML = "";
			}else{
				LApvLine.innerHTML = "<table border='1' bordercolor='#111111'  style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;'>" + Apvlines + "</table>";
			}
	}

	Apvlines = "";
	elmList = elmRoot.selectNodes("step[@unittype='ou' and @routetype='receive']/ou/person");
	ApvList = elmRoot.selectNodes("step[@unittype='ou' and @routetype='receive']/ou/person");
	if (elmList.length!=0){
			RApvLine.innerHTML = getRequestApvListHTML(elmList,sMode,true);
	}else {
			if (elmReceive.length > 0 || RApvLine.innerHTML  == ''){
				var aReqForm = getInfo("fmpf").split("_");
				if (aReqForm.length > 3 && aReqForm[2] == 'IN'){
					Apvlines += "<tr><td rowspan='2'>결<br><br>재</td><td class='deptsignfield'>계</td><td class='deptsignfield' >계장</td><td class='deptsignfield' >과장</td><td class='deptsignfield' >교학부장</td><td class='deptsignfield' >학장</td></tr>";
					Apvlines += "<tr><td class='signfield' height=60></td><td class='signfield' ></td><td class='signfield' ></td><td class='signfield' ></td><td class='signfield' ></td></tr>";
				}else{
					Apvlines += "<tr><td rowspan='2'>인<br><br>재<br><br>개<br><br>발</td><td class='deptsignfield'>담당</td><td class='deptsignfield'>팀장</td></tr>";
					Apvlines += "<tr><td class='signfield'></td><td class='signfield'></td></tr>";
				}

				RApvLine.innerHTML ="<table border='1' bordercolor='#111111'  style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;'>" + Apvlines + "</table>";
			}
	}
}

function getRequestApvListHTML(elmList,sMode,bReceive){//신청서html
	var elm, elmTaskInfo, elmReceive, elmApv;
	var strDate,j;
	var Apvlines = "";
	var ApvlinesUp = "";
	var ApvlinsDown = "";
	var LastApv="";
	if(!bReceive && elmList.length > 0 && getInfo("mode") != "DRAFT" ){elmList.nextNode(); j=1}else{j=0;}
	for (var i=0; i<elmList.length-j;i++) {
		elm = elmList.nextNode();
		elmTaskInfo = elm.selectSingleNode("taskinfo");
		if (bReceive){ //담당부서 결재선
			if (i==0){
				ApvlinesUp += "<td class='deptsignfield'>계</td>";
			}else{
				ApvlinesUp += "<td class='deptsignfield'>" + elm.getAttribute("position").substring(elm.getAttribute("position").lastIndexOf(";")+1) + "</td>";
			}
		}else{
			if (i==0){
				if((getInfo("mode") == "DRAFT"  && elmList.length == 1) ||(getInfo("mode") != "DRAFT"  && elmList.length == 2) ){
					if (getInfo("fmpf").substring(getInfo("fmpf").length-4) == 'IN_T'){//단과대용신청서
						ApvlinesUp += "<td rowspan='2'>참<br><br>조</td><td class='deptsignfield'>학과장</td>";
					}else{
						ApvlinesUp += (sMode=='T')?"<td rowspan='2'>확<br><br>인</td><td class='deptsignfield'>교학과</td>":"<td class='deptsignfield'>" + elm.getAttribute("position").substring(elm.getAttribute("position").lastIndexOf(";")+1) + "</td>";
					}
				}else{
					ApvlinesUp += (sMode=='T')?"<td rowspan='2'>참<br><br>조</td><td class='deptsignfield'>학과장</td>":"<td class='deptsignfield'>" + elm.getAttribute("position").substring(elm.getAttribute("position").lastIndexOf(";")+1) + "</td>";
				}
			}else if(i==1){
				ApvlinesUp += (sMode=='T')?"<td rowspan='2'>확<br><br>인</td><td  class='deptsignfield'>교학과</td>":"<td class='deptsignfield'>" + elm.getAttribute("position").substring(elm.getAttribute("position").lastIndexOf(";")+1) + "</td>";
			}else{
				ApvlinesUp += "<td class='deptsignfield'>" + elm.getAttribute("position").substring(elm.getAttribute("position").lastIndexOf(";")+1) + "</td>";
			}
		}
		
		strDate = elmTaskInfo.getAttribute("datecompleted");
		if (strDate == null) {strDate = "";}

		ApvlinsDown += "<td  class='signfield'>";
		switch( elmTaskInfo.getAttribute("kind")){
			case "authorize":
					ApvlinsDown += "전결";
					LastApv = getSignUrl(elm.getAttribute("code"),elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate)+interpretResult(elmTaskInfo.getAttribute("result"))+"<br>"+elm.getAttribute("name");
					break;
			case "substitute":
					ApvlinsDown += "대결";
					LastApv = getSignUrl(elm.getAttribute("code"),elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate)+interpretResult(elmTaskInfo.getAttribute("result"))+"<br>"+elm.getAttribute("name");
					break;
			case "skip":
					ApvlinsDown +=  (i < elmList.length-1)? "/":LastApv;break;
			case "bypass":	ApvlinsDown += (LastApv=="")?"후열":LastApv;break; //"후열"
			case "review": ApvlinsDown += (strDate=="")?"후결": getSignUrl(elm.getAttribute("code"),elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate)+interpretResult(elmTaskInfo.getAttribute("result"));break;
			case "charge": 
					ApvlinsDown += (strDate=="")?elm.getAttribute("name"): getSignUrl(elm.getAttribute("code"),"stamp",elm.getAttribute("name"),strDate)+interpretResult(elmTaskInfo.getAttribute("result"));break;
			default :
					ApvlinsDown += (strDate=="")?elm.getAttribute("name"): getSignUrl(elm.getAttribute("code"),elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate)+interpretResult(elmTaskInfo.getAttribute("result"));
		}
		
		ApvlinsDown += "</td>";
	}
	Apvlines +="<tr>" + ApvlinesUp+ "</tr><tr>" + ApvlinsDown + "</tr>";
	Apvlines = "<table border='1' bordercolor='#111111'  style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;'>" + Apvlines + "</table>";
	return Apvlines;
}
function getRequestPerson(sGubun){
	parent.menu.m_sAddList = (sGubun=='S')?"study":"request";
	parent.menu.addList("charge");
}
function setRequestPersonInfo(elmRoot,bDraftIni,sMode){
	//bDraftIni 신청서 신청인으로 초기화	alert(getInfo("dppathid") + "\n" + getInfo("dppathdn"));
	var aDPID = getInfo("dppathid").split('\\');
	var aDPDN = getInfo("dppathdn").split('\\');
	var sTstatus = getInfo("fmpf").substring(getInfo("fmpf").length-1);
	var strDPID = (sTstatus=='T')?aDPID[aDPID.length-2]:aDPID[aDPID.length-1];
	var strDPDN = (sTstatus=='T')?aDPDN[aDPDN.length-2]:aDPDN[aDPDN.length-1];
	var strUPDPID = (sTstatus=='T')?aDPID[aDPID.length-3]:aDPID[aDPID.length-2];
	var strUPDPDN = (sTstatus=='T')?aDPDN[aDPDN.length-3]:aDPDN[aDPDN.length-2];
	if (sMode == 'study'){
		CHARGE_ID.value = (bDraftIni==true)?getInfo("usid"):elmRoot.selectSingleNode("item/AN").text;
		CHARGE_NAME.value = (bDraftIni==true)?getInfo("usdn"):elmRoot.selectSingleNode("item/DN").text;
		CHARGE_OU_ID.value = (bDraftIni==true)?getInfo("dpid"):elmRoot.selectSingleNode("item/UG").text;
		CHARGE_OU_NAME.value = (bDraftIni==true)?getInfo("dpdn"):elmRoot.selectSingleNode("item/UGNM").text;
		CHARGE_TITLE_ID.value = (bDraftIni==true)?getInfo("uspc"):elmRoot.selectSingleNode("item/@po").text.split(";")[0];
		CHARGE_TITLE_NAME.value = (bDraftIni==true)?getInfo("uspn"):elmRoot.selectSingleNode("item/PO").text;
		CHARGE_MAJOR_ID.value = (bDraftIni==true)?aDPID[aDPID.length-1]:elmRoot.selectSingleNode("item/RG").text;
		CHARGE_MAJOR_NAME.value = (bDraftIni==true)?aDPDN[aDPDN.length-1]:elmRoot.selectSingleNode("item/RGNM").text;
	}else{
		APPLICANT_ID.value = (bDraftIni==true)?getInfo("usid"):elmRoot.selectSingleNode("item/AN").text;
		APPLICANT_NAME.value = (bDraftIni==true)?getInfo("usdn"):elmRoot.selectSingleNode("item/DN").text;
		APPLICANT_OU_ID.value = (bDraftIni==true)?strDPID:(elmRoot.selectSingleNode("item/RV2").text!='')?"":elmRoot.selectSingleNode("item/RG").text;
		APPLICANT_OU_NAME.value = (bDraftIni==true)?strDPDN:(elmRoot.selectSingleNode("item/RV2").text!='')?elmRoot.selectSingleNode("item/RV2").text:elmRoot.selectSingleNode("item/RGNM").text;
		APPLICANT_POSITION_ID.value = (bDraftIni==true)?getInfo("uspc"):elmRoot.selectSingleNode("item/@po").text.split(";")[0];
		APPLICANT_POSITION_NAME.value = (bDraftIni==true)?getInfo("uspn"):elmRoot.selectSingleNode("item/PO").text;
		APPLICANT_UP_OU_ID.value = (bDraftIni==true)?strUPDPID:(elmRoot.selectSingleNode("item/RV2").text!='')?"":elmRoot.selectSingleNode("item/UG").text;
		APPLICANT_UP_OU_NAME.value = (bDraftIni==true)?strUPDPDN:(elmRoot.selectSingleNode("item/RV2").text!='')?elmRoot.selectSingleNode("item/RV1").text:elmRoot.selectSingleNode("item/UGNM").text;
		//전공
		if (sTstatus == 'T' && getInfo("fmpf")!="REQUEST_VACATION_T"){//교원 휴가신청서 제외
			APPLICANT_MAJOR_ID.value = (bDraftIni==true)?aDPID[aDPID.length-1]:elmRoot.selectSingleNode("item/RG").text;
			APPLICANT_MAJOR_NAME.value = (bDraftIni==true)?aDPDN[aDPDN.length-1]:elmRoot.selectSingleNode("item/RGNM").text;
		}
	}
}

