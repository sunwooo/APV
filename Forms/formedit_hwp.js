var Idx=0;//한글테이블관련 추가
var RIdx=0;//한글테이블관련 추가
function setRequestApvListHWP(sMode,elmList){//신청서 아래아한글
	var elm, elmTaskInfo, elmReceive, elmApv;
	var strDate;

	SetHwpEditMode("edit");
	if (Idx==0)	Idx = 3;
	if (RIdx ==0) RIdx = 5;

	//table 조정
	setReqIniTblHWP(sMode, (sMode=='R')?RIdx:Idx,elmList.length-1)

	setReqApvTblHWP(sMode+"NAME", elmList.length);	setReqApvTblHWP(sMode+"APPROVE", elmList.length);

	Idx = elmList.length -1;

	for (var i=0; i<elmList.length;i++) {
		elm = elmList.nextNode();
		elmTaskInfo = elm.selectSingleNode("taskinfo");
		if (i>0)	HwpCtrl.PutFieldText(sMode+"NAME"+i, elm.getAttribute("position").substring(elm.getAttribute("position").lastIndexOf(";")+1)	);				
		
		strDate = elmTaskInfo.getAttribute("datecompleted");
		if (strDate == null) {strDate = "";}
		var strApvResult = "";
		switch( elmTaskInfo.getAttribute("kind")){
			case "authorize":
						InsertApvInfo(sMode+"APPROVE"+i, "","","전결","","","");
						InsertApvInfo(sMode+"APPROVE"+Idx, elm.getAttribute("code"), elm.getAttribute("name"),"",interpretResult(elmTaskInfo.getAttribute("result")),elmTaskInfo.getAttribute("customattribute1"),strDate);
						break;
			case "substitute":
						InsertApvInfo(sMode+"APPROVE"+i, "","","대결","","","");
						InsertApvInfo(sMode+"APPROVE"+(i+1), elm.getAttribute("code"), elm.getAttribute("name"),"",interpretResult(elmTaskInfo.getAttribute("result")),elmTaskInfo.getAttribute("customattribute1"),strDate);
						break;
			case "skip":
						InsertApvInfo(sMode+"APPROVE"+i, "","","/","","","");
						break;
			case "bypass":	break; //"후열"
			case "charge":InsertApvInfo(sMode+"APPROVE"+i, "",elm.getAttribute("name"),"","","","");break;
			default :
				InsertApvInfo(sMode+"APPROVE"+i, elm.getAttribute("code"), elm.getAttribute("name"),"",interpretResult(elmTaskInfo.getAttribute("result")),elmTaskInfo.getAttribute("customattribute1"),strDate);
		}
	}
	SetHwpEditMode("read");
}
function setReqIniTblHWP(sMode,iIndex,iLength){
	HwpCtrl.MoveToField(sMode+"NAME"+"0");	
	HwpCtrl.MovePos(101);
	if (iIndex > iLength){ //삭제
		for(var i=iLength;i<iIndex;i++) HwpCtrl.Run("TableDeleteColumn");		
	}else if (iIndex < iLength){//추가
		for(var i=iIndex;i<iLength;i++) HwpCtrl.Run("TableInsertRightColumn");		
	}
}
function setReqApvTblHWP(sFldName, iLength){//한글 신청서 결재선 초기화
	HwpCtrl.MoveToField(sFldName+"0");	
	var i=0;
	do{
		HwpCtrl.SetCurFieldName(sFldName+ i);
		i++;//alert(i);
	}while(HwpCtrl.MovePos(101) && i < iLength);	// 현재 캐럿이 위치한 셀의 오른쪽으로 이동
}
function draftheaderPrint(oApvList){ //기안문 두문의 기안부서 소속자 표현
	switch(getInfo("mode")){
		case "DRAFT" :
		case "TEMPSAVE":
			var elmRoot, elmList, elm, elmTaskInfo;
			var strDate, strFieldName;
			elmRoot = oApvList.documentElement;
			if (elmRoot != null){
				var strHeader = "담당 ";
				var stroucode = "";
				(getInfo("INITIATOR_NAME") != undefined)? strHeader += getInfo("INITIATOR_NAME"): strHeader += getInfo("usdn");
				(getInfo("INITIATOR_OU_ID") != undefined)? stroucode = getInfo("INITIATOR_OU_ID"): stroucode = getInfo("dpid");
				elmList = elmRoot.selectNodes("step[@unittype='person' and @routetype='approve']/ou/person");
				var iLimit = 2;
				for (var i=0; (i<elmList.length && i < iLimit);i++) {
					elm = elmList.nextNode();
					elmTaskInfo = elm.selectSingleNode("taskinfo");
					if (elm.getAttribute("oucode")== stroucode){
						if ( strHeader != elm.getAttribute("name") ){
							strHeader = elm.getAttribute("position").substring(elm.getAttribute("position").lastIndexOf(";")+1) +' '+ elm.getAttribute("name") +' '+strHeader;
						}else{
							strHeader = elm.getAttribute("position").substring(elm.getAttribute("position").lastIndexOf(";")+1) +' '+strHeader;
						}
					}
					if (i == 2){ return;	}
				}
			}
			INITIATOR_INFO.value = getInfo("dpdn")+" " + strHeader + " " + getInfo("usem");
			//HwpCtrl.PutFieldText("INITIATOR_INFO",INITIATOR_INFO.value);
			break;
		default : HwpCtrl.PutFieldText("INITIATOR_INFO",INITIATOR_INFO.value);break;
	}
}
function draftApvList(oApvList){
	if (getInfo("mode")!= "DRAFT" && getInfo("mode") !="TEMPSAVE"){
		var elmRoot, elmList, elm, elmTaskInfo;
		var strDate, strFieldName;
		var j;
		SetHwpEditMode("edit");
		elmRoot = oApvList.documentElement;
		if ( elmRoot != null){
			elmList = elmRoot.selectNodes("step[@unittype='person' and @routetype='approve']/ou/person[taskinfo/@kind!='charge']");
			var Apvlines = "";
			if (elmList.length > (Idx - 3)){//alert("줄수 = "+Idx + " 결재단계 : " + elmList.length );
				AppendField(elmList.length + 4 - Idx );
				SetFieldsName();
			}else if((elmList.length <= (Idx - 3) ) && (elmList.length > 0)) {
				for (var i=0;i < (Idx-2 - elmList.length) ;i++){
					HwpCtrl.MoveToField("NAME3");						
					HwpCtrl.MovePos(104);			// 현재 캐럿이 위치한 셀에서 열의 끝으로 이동								
					DeleteField();
				}
			}
			HwpCtrl.PutFieldText("APPROVE0",getInfo("SAVE_TERM"));//보존기간				
			HwpCtrl.PutFieldText("APPROVE1",getInfo("ISPUBLIC"));//공개여부
			HwpCtrl.MoveToField("APPROVE0");	//최종결재자 우측 상단
			HwpCtrl.MovePos(101);									
			HwpCtrl.SetCurFieldName("LASTAPPROVETITLE");
			HwpCtrl.MovePos(103);						
			HwpCtrl.SetCurFieldName("LASTAPPROVER");

			strFieldName = Idx-1; //기안자
			HwpCtrl.PutFieldText("APPROVE"+strFieldName,(getInfo("INITIATOR_NAME")==undefined)?getInfo("usdn"):getInfo("INITIATOR_NAME"));				

			for (var i=0; i<elmList.length;i++) {
				elm = elmList.nextNode();
				elmTaskInfo = elm.selectSingleNode("taskinfo");
				strFieldName = Idx-2 - i;
				strDate = elmTaskInfo.getAttribute("datecompleted");
				if (strDate == null) {strDate = "";}
				if (parseInt(strFieldName) > 1 ){
					HwpCtrl.PutFieldText("NAME"+strFieldName, elm.getAttribute("position").substring(elm.getAttribute("position").lastIndexOf(";")+1)	);				
					var strApvResult = "";
					switch( elmTaskInfo.getAttribute("kind")){
						case "authorize":
									InsertApvInfo("APPROVE"+strFieldName, "","","전결","","","");
									InsertApvInfo("LASTAPPROVER", elm.getAttribute("code"), elm.getAttribute("name"),"",interpretResult(elmTaskInfo.getAttribute("result")),elmTaskInfo.getAttribute("customattribute1"),strDate);
									break;
						case "substitute":
									InsertApvInfo("APPROVE"+strFieldName, "","","대결","","","");
									if (parseInt(strFieldName-1) > 1){
										InsertApvInfo("APPROVE"+(strFieldName-1), elm.getAttribute("code"), elm.getAttribute("name"),"",interpretResult(elmTaskInfo.getAttribute("result")),elmTaskInfo.getAttribute("customattribute1"),strDate);
									}else{
										InsertApvInfo("LASTAPPROVER", elm.getAttribute("code"), elm.getAttribute("name"),"",interpretResult(elmTaskInfo.getAttribute("result")),elmTaskInfo.getAttribute("customattribute1"),strDate);
									}
									break;
						case "skip":
									InsertApvInfo("APPROVE"+strFieldName, "","","/","","","");
									break;
						case "bypass":	break; //"후열"
						case "charge":InsertApvInfo("APPROVE"+strFieldName, "",elm.getAttribute("name"),"","","","");break;
						default :
							InsertApvInfo("APPROVE"+strFieldName, elm.getAttribute("code"), elm.getAttribute("name"),"",interpretResult(elmTaskInfo.getAttribute("result")),elmTaskInfo.getAttribute("customattribute1"),strDate);
					}
				}else {
					if ( HwpCtrl.GetFieldText("LASTAPPROVER") == "") InsertApvInfo("LASTAPPROVER", elm.getAttribute("code"), elm.getAttribute("name"),interpretKind(elmTaskInfo.getAttribute("kind"), elmTaskInfo.getAttribute("result")),interpretResult(elmTaskInfo.getAttribute("result")),elmTaskInfo.getAttribute("customattribute1"),strDate);
				}
			}

			//협조
			elmList = elmRoot.selectNodes("step[@unittype='person' and @routetype='assist']/ou/person"); //개인협조??
			if (elmList.length!=0){
				HwpCtrl.MoveToField("APPROVE"+(Idx-1));						
				HwpCtrl.MovePos(101);			// 현재 캐럿이 위치한 셀에서 열의 아래로 이동								
				HwpCtrl.SetCurFieldName("ASSIST");
				HwpCtrl.MoveToField("ASSIST", true, true, false);
				Apvlines = "";
				for (var i=0; i<elmList.length;i++) {
					elm = elmList.nextNode();
					elmTaskInfo = elm.selectSingleNode("taskinfo");
					strDate = elmTaskInfo.getAttribute("datecompleted");
					if (strDate == null) {strDate = "";}
					HwpInsertText(elm.getAttribute("ouname") + elm.getAttribute("position").substring(elm.getAttribute("position").lastIndexOf(";")+1));
					if (interpretResult(elmTaskInfo.getAttribute("result")) =='반려') setRejectColor("반려");
					//SetNextLine(+interpretResult(elmTaskInfo.getAttribute("result")),"Assist");
					if (strDate != "") InsertPictureAssist(elm.getAttribute("code"),elmTaskInfo.getAttribute("customattribute1"), strDate);
					Apvlines += elm.getAttribute("ouname") + elm.getAttribute("position").substring(elm.getAttribute("position").lastIndexOf(";")+1) + interpretKind(elmTaskInfo.getAttribute("kind"), elmTaskInfo.getAttribute("result")) + formatDate(strDate) + "\r\n";
					if ( i <= (elmList.length-1)) SetNextLine("\r\n","Assist");
				}
			}

			
			//수신
			Apvlines = "";
			elmList = elmRoot.selectNodes("ccinfo/ou/person");//[@belongto='global' or @belongto='receiver' ]
			if (elmList.length!=0){
				for (var i=0; i<elmList.length;i++) {
					elm = elmList.nextNode();
					Apvlines += " \r\n"+  elm.getAttribute("ouname") + elm.getAttribute("position").substring(elm.getAttribute("position").lastIndexOf(";")+1);
				}
			}
			elmList = elmRoot.selectNodes("ccinfo/role");//[@belongto='global' or @belongto='receiver' ]
			if (elmList.length!=0){
				for (var i=0; i<elmList.length;i++) {
					elm = elmList.nextNode();
					Apvlines += " \r\n"+  elm.getAttribute("name");
				}
			}

			if (Apvlines != "")	 HwpCtrl.PutFieldText("CC_NAME", Apvlines.substring(2));				
		}
		SetHwpEditMode("read");
	}
	if ((getInfo("scIPub") == '1') ||(getInfo("fmpf")=='ENFORCE')){	m_oRecList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+parent.menu.RecDeptList.value);	}
	if (getInfo("scOPub") == '1') 	HwpCtrl.PutFieldText("RECEIVE_NAME", RECEIVE_NAMES.value); //대외공문
}
function InsertApvInfo(field, apvid, apvname, apvkind, apvresult, signtype, strDate){
	if (strDate != ""){
		InsertPicture(field,apvid, apvname, "",apvresult,signtype, formatDate(strDate));
	}else{		HwpCtrl.PutFieldText(field, apvname +" "+ apvkind);}
}
function InsertPicture(field, apvid, apvname, apvresult, apvkind, signtype, apvDate){
	HwpCtrl.MoveToField(field, true, true, false);
	HwpInsertText(apvname);
	if (apvkind =='반려') setRejectColor(apvkind);
	if (signtype != null ){
		HwpCtrl.MoveToField(field, true, false, false);
		var path = "http://"+document.location.host+g_BaseImgURL + signtype;
		var pCtrl = HwpCtrl.InsertPicture(path, true, 3, 0, 0, 0);
		if(!pCtrl) HwpInsertText(" " +apvDate);
	}else{HwpInsertText(" " +apvDate);}
}
function setRejectColor(sReject){
	var act = HwpCtrl.CreateAction("CharShape");	// 검색된 문자에 하이라이트
	var set = act.CreateSet();
	act.GetDefault(set);
	set.SetItem("TextColor", 0x0000FF);	
	act.Execute(set);
	HwpInsertText(sReject);
	set.SetItem("TextColor", 0x000000);	
	act.Execute(set);
}
function InsertPictureAssist(apvid,signtype, apvDate){
	if (signtype != ""){
		var path = "http://"+document.location.host+g_BaseImgURL+ signtype;
		var pCtrl = HwpCtrl.InsertPicture(path, true, 1, 0, 0, 0,5,5);
		if(!pCtrl) HwpInsertText( formatDate(apvDate));
	}else{HwpInsertText( formatDate(apvDate));}
}
function enforceApvList(oApvList){
		var elmRoot, elmList, elm, elmTaskInfo, strDate, strFieldName;
		SetHwpEditMode("edit");	
		elmRoot = oApvList.documentElement.selectSingleNode("step[@unittype='ou' and @routetype='receive']/ou");
		if ( elmRoot != null){
			HwpCtrl.PutFieldText("RECINF1",elmRoot.selectSingleNode("taskinfo").getAttribute("datereceived"));
			HwpCtrl.PutFieldText("RECINF2",getReceiveNo());
			HwpCtrl.PutFieldText("RECINF3",elmRoot.getAttribute("name")); //처리과
			elm = elmRoot.selectSingleNode("person[taskinfo/@kind='charge']"); //담당자

			HwpCtrl.PutFieldText("RECINF4", ( elm != null)?elm.getAttribute("name"):getInfo("usdn"));

			elmList = elmRoot.selectNodes("person[taskinfo/@kind!='charge']"); //수신부서 정보 조회-taskinfo/@kind='normal'
			var Apvlines = "";
			for (var i=0; i<elmList.length;i++) {
				elm = elmList.nextNode();
				elmTaskInfo = elm.selectSingleNode("taskinfo");
				strFieldName = Idx - 1 - i;
				HwpCtrl.PutFieldText("POSITION"+strFieldName, elm.getAttribute("position").substring(elm.getAttribute("position").lastIndexOf(";")+1)	);				
				strDate = elmTaskInfo.getAttribute("datecompleted");
				if (strDate == null) {strDate = "";}
				var strApvResult = "";
				switch( elmTaskInfo.getAttribute("kind")){
					case "authorize":
								InsertApvInfo("APPROVE"+strFieldName, "","","전결","","","");
								InsertApvInfo("APPROVE"+( Idx  - elmList.length), elm.getAttribute("code"), elm.getAttribute("name"),"",interpretResult(elmTaskInfo.getAttribute("result")),elmTaskInfo.getAttribute("customattribute1"),strDate);
								break;
					case "substitute":
								InsertApvInfo("APPROVE"+strFieldName, "","","대결","","","");
								InsertApvInfo("APPROVE"+(strFieldName-1), elm.getAttribute("code"), elm.getAttribute("name"),"",interpretResult(elmTaskInfo.getAttribute("result")),elmTaskInfo.getAttribute("customattribute1"),strDate);
								break;
					case "skip":
								if ( HwpCtrl.GetFieldText("APPROVE"+strFieldName) == "") InsertApvInfo("APPROVE"+strFieldName, "","","/","","","");
								break;
					case "bypass":	break; //"후열"
					default :
						InsertApvInfo("APPROVE"+strFieldName, elm.getAttribute("code"), elm.getAttribute("name"),"",interpretResult(elmTaskInfo.getAttribute("result")),elmTaskInfo.getAttribute("customattribute1"),strDate);
				}
			}
		}
		SetHwpEditMode("read");
}

function draftRecList(oApvList,rIdx){//결재선 2003.04.24 황선희 작성 한글2002 기준
	var elmRoot, elmList, elm, elmCode;
	var strDate, strFieldName;
	SetHwpEditMode("edit");	//alert(parent.menu.field["APVLIST"].value);
	elmRoot = oApvList.documentElement;
	if (elmRoot != null){
		var Apvlines = "";
		//수신
		elmList = elmRoot.selectNodes("item/DN");  //이름
		elmRNList =  elmRoot.selectNodes("item/RN"); //수신기호

		if (elmList.length!=0){
			Apvlines = "";
			if (elmList.length == 1){
				elm = elmList.nextNode();
				Apvlines += elm.text;
				if (rIdx == "" || rIdx == 0){
					HwpCtrl.PutFieldText("RECEIVE_NAME", Apvlines);
					HwpCtrl.PutFieldText("RECEIVENAMES", "");
				}else{SetNextLine("수신처 " + Apvlines);}
			}else{
				for (var i=0; i<elmList.length;i++) {
					elm = elmRNList.nextNode();
					Apvlines +=  ", "+elm.text;
				}
				if(Apvlines.length > 0) Apvlines = changeRecList(Apvlines.substring(1));
				if (rIdx == "" || rIdx == 0){
					HwpCtrl.PutFieldText("RECEIVE_NAME", "수신처 참조");
					HwpCtrl.PutFieldText("RECEIVENAMES", "수신처 " + Apvlines);
				}else{SetNextLine("수신처 " + Apvlines);}
			}
		}
	}else{
		HwpCtrl.PutFieldText("RECEIVE_NAME", "내부결재");
		HwpCtrl.PutFieldText("RECEIVENAMES", "");
	}
	SetHwpEditMode("read");
}
function changeRecList(sList){
	var aRec = sList.split(",");
	var sRecList = "";
	var sName, sSubList;
	var sNo =0, cnt=0;
	aRec.sort();
	var snamesign="";
	var snosign = 0;
	sName = "";
	for(var i=0; i < aRec.length; i++){
		snamesign = aRec[i].substr(0,2);
		snosign = aRec[i].substr(2);
		if (snosign !== 'NaN'){
			if (sName == snamesign){
				if((snosign - sNo) == 1 ){
					cnt++;
					sNo = snosign;
				}else{
					if (cnt > 0){sRecList += "-" + sNo +","+snosign;}else{sRecList += "," + snosign;}
					cnt=0;
				}
			}else{
				if (sName != "" ){
					if (cnt > 0){
							sRecList += "-" + sNo+", "+snamesign+snosign;
							cnt=0;
					}else{sRecList += ", " +snamesign + snosign;}
				}else{sRecList += ", "+snamesign + snosign;	}
				sName = snamesign;
				sNo = snosign;
			}
		}else{
			sRecList += ", " + aRec[i];
			sName = snamesign;
			sNo = 0;
		}
	}
	if (sName == snamesign){
		if((snosign - sNo) == 1 ){
		}else if (cnt > 0){sRecList += "-" + sNo;		}
	}else{		sName = snamesign;		sRecList += ", "+sName+" " + snosign;	}
	if (sRecList.length > 1) sRecList = sRecList.substring(2);
	return sRecList;
}
function GetBody(){//한글 입력양식기 Base64 Encoding Stream dhtml
	var sBody="";
	switch (getInfo("fmpf")){
		case "DRAFT":
		case "ENFORCE":
			for(var i=0 ; i < aSubject.length ; i++){if (aSubject[i]!= null)	sBody+="<body id='"+i+"' title='" + aSubject[i]+ "' sender='" + aSender[i]+ "'><![CDATA["+aBody[i]+"]]></body>";}
			sBody = "<bodyinfo>"+sBody+"</bodyinfo>";
			break;
		case "OUTERPUBLISH":
			sBody="<bodyinfo><body id='0' title='" + SUBJECT.value+ "' sender='"+g_BaseSender+"'><![CDATA["+HwpCtrl.GetTextFile(gTextMode, "")+"]]></body></bodyinfo>";
			break;
		default: //hwpctrl 한개 사용
			sBody= (dhtml_body.value != '')?dhtml_body.value:HwpCtrl.GetTextFile(gTextMode, "");
			break;
	}
	return sBody;
}
function SetBody(strBody, strfilename, iSelIdx){//한글 입력양식기 Base64 Decoding Stream
	//if (strfilename != ''){if(!HwpCtrl.Open(_GetBasePath()+"hwpforms/"+strfilename+".hwp", "HWP", "code:acp;url:true")){alert("문서 열기 실패"); return;}}
	if (strfilename != ''){if(!HwpCtrl.Open("http://"+document.location.host+g_BaseFormURL+strfilename+".hwp", "HWP", "code:acp;url:true")){alert("문서 열기 실패"); return;}}
	if (getInfo("fmpf") == "DRAFT" ||getInfo("fmpf") == "OUTERPUBLISH" || getInfo("fmpf") == "ENFORCE" || getInfo("fmpf") == "OUTERPUBLISH_ENFORCE" ){//xml형태로 본문내역보관//책갈피 찾아가서 insert
		var strbodycontext;
		var setListParaPos;
		var dctrlcode = HwpCtrl.HeadCtrl();
		while (dctrlcode != null){
			if (dctrlcode.CtrlID == "bokm"){
				var BookMarkName = dctrlcode.Properties.Item("CtrlData").Item("Name");
				if (BookMarkName == "startbm"){
					setListParaPos = dctrlcode.GetAnchorPos(0);
					break;
				}
			}
			dctrlcode = dctrlcode.Next();
		}  	
		HwpCtrl.SetPosBySet(setListParaPos);
		var iselectedIndex = iSelIdx;
		if (strBody != "" )	{
			var aRecDept = parent.menu.RecDeptList.value.split("@");
			var m_oRecList = new ActiveXObject("MSXML2.DOMDocument");
			var m_oBodyContext = new ActiveXObject("MSXML2.DOMDocument");
			m_oBodyContext.loadXML("<?xml version='1.0' encoding='utf-8'?>"+strBody);
			var elmRoot = m_oBodyContext.documentElement;
			if (elmRoot != null){
				var elmList = elmRoot.selectNodes("body");
				var elm;
				for (var i=0; i<elmList.length;i++) {
					elm = elmList.nextNode();
					aSubject[i] = elm.getAttribute("title");
					aBody[i] = elm.text;
					aSender[i] = (elm.getAttribute("sender")==undefined?"":elm.getAttribute("sender"));
					if (iselectedIndex != null ){
						if (iselectedIndex == i)	{
							HwpCtrl.PutFieldText("SUBJECT",elm.getAttribute("title"));
							HwpCtrl.SetTextFile(elm.text, "HWP", "insertfile");SetNextLine();SetNextLine();
							m_oRecList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+aRecDept[i]);
							draftRecList(m_oRecList,0);
							//HwpCtrlBody.SetTextFile(elm.text, "HWP", "");
							if(strfilename == "ENFORCE") HwpCtrl.PutFieldText("SENDER",elm.getAttribute("sender")=="undefined"?g_BaseSender:elm.getAttribute("sender"));
						}
					}else{
						if (i >0){
							SetNextLine();SetNextLine("(제 "+(i+1)+" 안)");SetNextLine("수신 수신처 참조");SetNextLine("참조");SetNextLine();SetNextLine("제목 : "+elm.getAttribute("title"));
							if (parent.menu.iBody.length < aSubject.length){
								var oOption = parent.menu.document.createElement("OPTION");
								parent.menu.iBody.options.add(oOption);
								oOption.text =  parent.menu.iBody.length + "안" ;
							}
							HwpCtrl.Run("InsertLine");
						}else{HwpCtrl.PutFieldText("SUBJECT",elm.getAttribute("title"));HwpCtrl.PutFieldText("GIANNO",(elmList.length >1)?"(제 "+(i+1)+" 안)":"");}
						
						HwpCtrl.SetTextFile(elm.text, "HWP", "insertfile");SetNextLine();SetNextLine();
						//if (getInfo("mode") =="TEMPSAVE")	HwpCtrl.SetTextFile(elm.text, "HWP", "");

						if((getInfo("fmpf") != "OUTERPUBLISH")){
							if ( i==0 && elmList.length == 1){
								HwpCtrl.PutFieldText("SENDER",elm.getAttribute("sender")=="undefined"?g_BaseSender:elm.getAttribute("sender"));
							}else{SetNextLine(elm.getAttribute("sender"),"S");SetNextLine();	}
						}
						
						m_oRecList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+aRecDept[i]);
						draftRecList(m_oRecList,(elmList.length == 1)?i:"Rec");
					}
				}
				HwpCtrl.PutFieldText("HEADER",((getInfo("fmpf") == "OUTERPUBLISH" && aRecDept.length > 0)?"":'"직인생략"\n\r')+g_BaseHeader);						
				HwpCtrl.PutFieldText("ORGNAME",g_BaseORGNAME);
				if ((getInfo("mode") == 'TRANS' || getInfo("mode") == 'COMPLETE' || getInfo("mode") == 'SIGN' ) && strfilename == "ENFORCE"){
					m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+parent.menu.field["APVLIST"].value);
					elmRoot = m_oApvList.documentElement;
					if ( elmRoot != null){
						elmList = elmRoot.selectNodes("step[@unittype='person' and @routetype='approve']/ou/person[./taskinfo[@kind='authorize']]");
						if(elmList.length == 1){
							elm = elmList.nextNode();
							elmTaskInfo = elm.selectSingleNode("taskinfo");
							HwpCtrl.PutFieldText("AUTHINFO",'[전결 '+ elm.getAttribute("title").substring(elm.getAttribute("title").lastIndexOf(";")+1) + ' ' +elm.getAttribute("name")+']');
							if (elmTaskInfo.getAttribute("customattribute1") != null)	{
								HwpCtrl.MoveToField("AUTHINFO", true, false, false);
								var path = "http://"+document.location.host+g_BaseImgURL+elmTaskInfo.getAttribute("customattribute1");
								var pCtrl = HwpCtrl.InsertPicture(path, true, 3, 0, 0, 0);
							}
						}
					}
				}
				
				if( iselectedIndex == null) 	RECEIPT_LIST.value= DeCodeRecList(parent.menu.RecDeptList.value);//수신처

			}
		}
	}else{
		HwpCtrl.SetTextFile((strBody!=''?strBody:getInfo("fmbd")), "HWP", "");
	}
}
function CharShapeFont()
{
	var act = HwpCtrl.CreateAction("CharShape");
	var set = act.CreateSet();
	act.GetDefault(set);
	set.SetItem("Height",200);
	act.Execute(set);
}
function SetNextLine(sTitle,sMode){
	if (sMode == "Assist")	{
		HwpInsertText(sTitle);
	}else if (sMode == "S") {
		HwpSetParagraph(sTitle, 3, true, 200)
	}else{
		HwpSetParagraph(sTitle, 1, false, 100)
	}
}
function HwpSetParagraph(sTitle, sAlign, bBolder, iSize){
	//try{
	HwpCtrl.Run("MoveDocEnd");//MoveTopLevelEnd

	var act1 = HwpCtrl.CreateAction("ParagraphShape");
	var set1 = act1.CreateSet();
	act1.GetDefault(set1);
	set1.SetItem("AlignType", sAlign);
	act1.Execute(set1);

	var act2 = HwpCtrl.CreateAction("CharShape");
	var set2 = act2.CreateSet();
	act2.GetDefault(set2);
	set2.SetItem("Bold", (bBolder==true)?1:0);		
	set2.SetItem("SizeHangul", iSize);
	act2.Execute(set2);

	var act = HwpCtrl.CreateAction("InsertText");
	var set = act.CreateSet();
	if( sTitle != undefined){
		if (sTitle.substring(0,2) == '제목'){
			set.SetItem("Text", sTitle+"\r\n");
			/*HwpCtrl.MovePos(22); //
			//HwpCtrl.Run("MoveDocEnd");//MoveTopLevelEnd
			HwpCtrl.Run("InsertLine");*/
		}else{
			set.SetItem("Text", sTitle+"\r\n");
		}
	}else{
		set.SetItem("Text", "\r\n");
	}
	act.Execute(set);
	//}catch(e){alert(e.message);}
}

function HwpInsertText(sText){
	var act = HwpCtrl.CreateAction("InsertText");
	var set = act.CreateSet();
	set.SetItem("Text", sText);
	act.Execute(set);
}
function SetHwpEditMode(sMode){
	var sKind;
    switch(sMode) {
        case "read":		sKind = 0;break; //읽기 전용
        case "edit":		sKind = 1;break; //입력
        case "form":		sKind = 2;break; //양식폼 - 누름틀만 활성화
		default:
			sKind = 0;break; //읽기 전용
    }
	HwpCtrl.EditMode = sKind;
}
function GotoTableFirstCell(sviewMode){//테이블 찾아가기
	HwpCtrl.MoveToField("NAME0");
	if (sviewMode == "DRAFT"){
		SetFieldsName();
	}else if (sviewMode == "ENFORCE"){
		SetFieldsNameEnforce();//	alert(HwpCtrl.GetFieldText("APPROVE"+Idx));
	}
}
// AddRowNum만큼의 셀 나누기
function sPlitField(AddRowNum){
	HwpCtrl.MoveToField("NAME"+ Idx);	
	HwpCtrl.MovePos(100);			// 현재 캐럿이 위치한 셀의 위쪽으로 이동
	sPlitFieldRow(AddRowNum);
	//alert(HwpCtrl.GetCurFieldName());
	HwpCtrl.MoveToField("APPROVE"+Idx);	
	HwpCtrl.MovePos(100);			// 현재 캐럿이 위치한 셀의 위쪽으로 이동
	sPlitFieldRow(AddRowNum);
}
function	sPlitFieldRow(AddRowNum){
	var act = HwpCtrl.CreateAction("TableSplitCell");
	var set = act.CreateSet();
	set.SetItem("Rows", AddRowNum);
	set.SetItem("Cols", 1);
	set.SetItem("DistributeHeight", 1);
	set.SetItem("Merge", 1);
	act.Execute(set);
}

// AddRowNum만큼의 줄을 추가한다.
function AppendField(AddRowNum){
	for (var i=0; i<AddRowNum; i++)	{				
		HwpCtrl.MoveToField("NAME1");	
		HwpCtrl.MovePos(104);			// 현재 캐럿이 위치한 셀에서 행(row)의 시작	
		HwpCtrl.MovePos(103);			// 현재 캐럿이 위치한 셀의 아래쪽으로 이동
		HwpCtrl.Run("TableAppendRow");		
	}	
}
// 현재 캐럿이 있는 줄을 삭제한다.
function DeleteField(){
	HwpCtrl.Run("TableDeleteRow");				
	SetFieldsName();
}
// 테이블 각 셀의 필드명을 다시 부여한다.
function SetFieldsName(){
	Idx=0;
	HwpCtrl.MoveToField("NAME0");	
	HwpCtrl.MovePos(104);			// 현재 캐럿이 위치한 셀에서 행(row)의 시작	
	do{
		HwpCtrl.SetCurFieldName("NAME" + Idx);
		HwpCtrl.MovePos(101);			// 현재 캐럿이 위치한 셀에서 오른쪽으로 이동
		HwpCtrl.SetCurFieldName("APPROVE" + Idx);
	
		HwpCtrl.MovePos(104);			// 현재 캐럿이 위치한 셀에서 행의 시작으로 이동	
		Idx++;
	}while(HwpCtrl.MovePos(103));			// 현재 캐럿이 위치한 셀의 아래쪽으로 이동
	Idx--;
}
function SetFieldsNameEnforce(){
	HwpCtrl.MoveToField("NAME0");	
	HwpCtrl.MovePos(104);			// 현재 캐럿이 위치한 셀에서 행(row)의 시작	
	HwpCtrl.MovePos(101);			// 현재 캐럿이 위치한 셀에서 오른쪽으로 이동
	HwpCtrl.SetCurFieldName("NAME01"); 
	HwpCtrl.MovePos(101);			// 현재 캐럿이 위치한 셀에서 오른쪽으로 이동
	Idx=0;
	//수신부서정보 입력
	do{
		HwpCtrl.SetCurFieldName("RECINF" + Idx);
		Idx++;
	}while(HwpCtrl.MovePos(103));			// 현재 캐럿이 위치한 셀의 아래쪽으로 이동
	Idx--;
	//수신부서결재정보입력
	HwpCtrl.MoveToField("RECINF0");	
	HwpCtrl.MovePos(101);			// 지시
	HwpCtrl.MovePos(101);			// 현재 캐럿이 위치한 셀에서 오른쪽으로 이동
	HwpCtrl.SetCurFieldName("APVCOMMNET"); //선결첨언
	HwpCtrl.MovePos(103);			// 현재 캐럿이 위치한 셀의 아래쪽으로 이동
	var i=0;
	do{
		HwpCtrl.SetCurFieldName("POSITION" + i); //결재자보직
		HwpCtrl.MovePos(101);			
		HwpCtrl.SetCurFieldName("APPROVE" + i); //결재자명
		HwpCtrl.MovePos(100);			
		i++;
	}while(HwpCtrl.MovePos(103));			// 현재 캐럿이 위치한 셀의 아래쪽으로 이동
}
//직인삽입
function PutSignImage(){
	var path = "http://"+document.location.host+g_BaseImgURL+"stamp_dongeui.gif";
	HwpCtrl.MoveToField("SIGNIMAGE", true, true, false);
	var pCtrl = HwpCtrl.InsertPicture(path, true, 2, 0, 0, 0);
	if(!pCtrl) alert('직인 이미지 삽입 오류');
}