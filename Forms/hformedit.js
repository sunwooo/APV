var m_xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP");
var m_evalXML = new ActiveXObject("MSXML2.DOMDocument");
var g_szAcceptLang  = "ko";
var m_cvtXML = new ActiveXObject("MSXML2.DOMDocument").createTextNode("");
var m_oApvList = new ActiveXObject("MSXML2.DOMDocument");
var m_oRecList = new ActiveXObject("MSXML2.DOMDocument");
var sReceiveNo = "";
var g_BaseImgURL = "/GWStorage/e-sign/ApprovalSign/";
var g_BaseFormURL = "/GWStorage/e-sign/ApprovalForm/";
var g_BaseSender = "(주) 코 비 젼";
var g_BaseHeader = '"고객과 미래를 함께 합니다"';
var g_BaseORGNAME = '(주) 코 비 젼';
var elmComment = new ActiveXObject("MSXML2.DOMDocument");	//	의견

var m_KMWebAttURL='';
var m_sApvMode = "";
var m_print = false; //출력상태여부 - 출력형태로 할때 사용 
var bFileView = false;
var bPresenceView = true;
var bFirst = true;
function getInfo(sKey){try{return parent.g_dicFormInfo.item(sKey);}catch(e){alert(parent.menu.gMessage254+sKey+parent.menu.gMessage255);}} //"양식정보에 없는 키값["+sKey+"]입니다."
function setInfo(sKey,sValue){
	try{	
		if(parent.g_dicFormInfo.Exists(sKey))	parent.g_dicFormInfo.Remove(sKey);
		parent.g_dicFormInfo.Add(sKey,sValue);
	}catch(e){alert(parent.menu.gMessage254+sKey+parent.menu.gMessage255);} //"양식정보에 없는 키값["+sKey+"]입니다."
}
function handleResize(elm,offset) {
	var intHeight = document.body.clientHeight - offset;
	if(intHeight <= 0) intHeight = 25;
	elm.style.height = intHeight + "px";
}
function makeNode(sName,vVal,sKey,bCData) {
	if(vVal==null){	m_cvtXML.text = dField[(sKey!=null?sKey:sName)].value;	}else{	m_cvtXML.text = vVal;	}
	return "<"+sName+">"+(bCData?"<![CDATA[":"")+(bCData?m_cvtXML.text+"]]>":m_cvtXML.xml)+"</"+sName+">";
}
function getFormXML() {
	var sXML="";	
	sXML = getBodyContext();		
	//common fields( ex)cField, mField를 제외한 dField 화면에 보이지 않는 값)
	for(var i=0;i<dField.length;i++){sXML+=makeNode(dField[i].name);}
	//body_context & specfic fields	(<BODY_CONTEXT> 내용을 가져옴)  양식이름.htm	
		
	return "<formdata>" + sXML + "</formdata>";
}
function getChangeFormXML(){
	var sXML="";	
	sXML = getBodyContext();
	//common fields( ex)cField, mField를 제외한 dField 화면에 보이지 않는 값)
	for(var i=0;i<dField.length;i++){
		if(dField[i].value != getInfo(dField[i].name)){ sXML+=makeNode(dField[i].name);	}
	}
		
	if((parent.menu.field["bLASTAPPROVER"].value ==  'true' && getInfo("scDNum")=='1') || (getInfo("mode") == "SIGN")){ //최종결재자 문서정보 넘길것
		try{if(sXML.indexOf("<DOC_NO") == -1)  sXML+= makeNode("DOC_NO");}catch(e){}
	}

	//body_context & specfic fields	
	//receive no process//
	if((getInfo("mode") == "REDRAFT") && (parent.menu.getHasReceiveno() == "true")){
	 sXML+= makeNode("RECEIVE_NO");
		if(sXML.indexOf("INITIATOR_OU_ID") == -1) sXML+=makeNode("INITIATOR_OU_ID"); 
	} 
	//last modifier info
	if(sXML!=""){	return "<LAST_MODIFIER_ID>"+getInfo("usid")+"</LAST_MODIFIER_ID><formdata>" + sXML + "</formdata>";}else{return "<formdata>" + sXML + "</formdata>";}
}
/*doc info - final approver, charge,  uses*/
function getDocFormXML(){
	var sXML="";
	if((getInfo("fmpf") =='DRAFT') || (getInfo("fmpf") =='OUTERPUBLISH')||(getInfo("fmpf") =='OFFICIAL_DOCUMENT')||(getInfo("fmpf") =='DRAFT03')){
		if((parent.menu.field["bLASTAPPROVER"].value ==  'true') || (getInfo("mode") == "SIGN")){ //최종결재자 문서정보 넘길것
			sXML+= makeNode("DOC_NO") + makeNode("INITIATOR_OU_ID") + makeNode("DOC_OU_NAME") + makeNode("DOC_CLASS_ID") + makeNode("APPLIED");
		}
	}else{
		if((parent.menu.field["bLASTAPPROVER"].value ==  'true')){ //최종결재자 문서정보 넘길것
			sXML+= makeNode("DOC_NO","0000") + makeNode("INITIATOR_OU_ID") + makeNode("DOC_OU_NAME",getInfo("INITIATOR_OU_NAME")) + makeNode("DOC_CLASS_ID","0000") + makeNode("APPLIED","2004.05.18");
		}
	}
	if((getInfo("mode") == "REDRAFT") && (parent.menu.getHasReceiveno() == "true")) sXML+= makeNode("RECEIVE_NO") +  makeNode("INITIATOR_OU_ID"); 
	if(sXML!=""){	return "<LAST_MODIFIER_ID>"+getInfo("usid")+"</LAST_MODIFIER_ID><formdata>" + sXML + "</formdata>";}else{return "<formdata>" + sXML + "</formdata>";}
}
function initApvList(){
    //회수문서 및 임시저장 문서 재사용 시 부서코드/부서명/회사코드 최종본 반영 위해 수정 by sunny 2006.12. 양식쪽 일괄작업 어려움 공통함수 부분에서처리함
    if(getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"){
        try{INITIATOR_OU_ID.value = getInfo("dpid_apv");}catch(e){}
        try{INITIATOR_OU_NAME.value = getInfo("dpdn_apv");}catch(e){}
        try{ENT_CODE.value = getInfo("etid");}catch(e){}
    }
    //양식 설명 위해 추가
    if(getInfo("fmwkds") != ""){try{tdforminfo.innerHTML = getInfo("fmwkds").replace("\n","<br>");divforminfo.style.display="";}catch(e){}}
		m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + parent.menu.field["APVLIST"].value);
		setInlineApvList(m_oApvList);
    //타양식 내용복사 
    parent.timerID = setInterval("parent.DiffFormTempMemo()",1000);
    //관련업무 내용 추가
    try{if(parent.rel_activityid != "") {getTaskID(parent.rel_activityname+";"+parent.rel_activityid);}}catch(e){}
}
function setInlineApvList(oApvList) {
    if(oApvList == null){//IE8.0대비
		m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + parent.menu.field["APVLIST"].value);	
        oApvList = m_oApvList;
    }
	if((getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE") && getInfo("scFRMAPVLINE") == "1"){    
		try{displayApvListFormApvLine(oApvList);}catch(e){}
	}else{
			if(getInfo("scApvLineTypeV") == "2"){
			    displayApvList(oApvList);				
			}else{
				displayApvListCols(oApvList);
			}
	}
}
function setInlineRecList(oApvList){draftRecList(oApvList);}
//default html apv list display : #1 Approver Line, #1Assit person Line
function draftHTMLApvList(oApvList){
	var elmRoot, elmList, elm, elmTaskInfo;
	var strDate, strFieldName;
	elmRoot = oApvList.documentElement;
	if(elmRoot != null){
		elmList = elmRoot.selectNodes("division/step[@unittype='person' and @routetype='approve']/ou/person");
		var Apvlines ="";
		if(getInfo("mode")=="DRAFT" || getInfo("mode")=="TEMPSAVE" ){
			Apvlines +="<tr class=editing ><td width='50%' align='center'>기안자</td><td align='center'  bgcolor='#ffffff'>"+getInfo("usdn")+"</td><td></td><tr>";
		}
		for (var i=0; i<elmList.length;i++) {
			elm = elmList.nextNode();
			elmTaskInfo = elm.selectSingleNode("taskinfo");
			ApvlinsDown = "<tr class=editing ><td width='40%' align='center'>" + elm.getAttribute("title").substring(elm.getAttribute("title").lastIndexOf(";")+1) + "</td>";
			
			strDate = elmTaskInfo.getAttribute("datecompleted");
			if(strDate == null) {strDate = "";}

			ApvlinsDown += "<td  width='40%' align='center' bgcolor='#ffffff'>";
			switch( elmTaskInfo.getAttribute("kind")){
				case "authorize":
						ApvlinsDown += "전결";
						LastApv = getSignUrl(elm.getAttribute("code"),elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"))+interpretResult(elmTaskInfo.getAttribute("result"))+"<br>"+elm.getAttribute("name");
						break;
				case "substitute":
						ApvlinsDown += "대결";
						LastApv = getSignUrl(elm.getAttribute("code"),elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"))+interpretResult(elmTaskInfo.getAttribute("result"))+"<br>"+elm.getAttribute("name");
						break;
				case "skip":
						ApvlinsDown +=  (i < elmList.length-1)? "/":LastApv;break;
				case "bypass":	ApvlinsDown += (LastApv=="")?"후열":LastApv;break; //"후열"
				case "review": ApvlinsDown += (strDate=="")?"후결": getSignUrl(elm.getAttribute("code"),elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"))+interpretResult(elmTaskInfo.getAttribute("result"));break;
				case "charge": 
						ApvlinsDown += (strDate=="")?elm.getAttribute("name"): getSignUrl(elm.getAttribute("code"),"stamp",elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"))+interpretResult(elmTaskInfo.getAttribute("result"));break;
				default :
						ApvlinsDown += (strDate=="")?elm.getAttribute("name"): getSignUrl(elm.getAttribute("code"),elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"))+interpretResult(elmTaskInfo.getAttribute("result"));
			}
			
			ApvlinsDown += "</td><td  width='20%' align='center'>"+formatDate(strDate)+"</td><tr>";
			Apvlines = ApvlinsDown +Apvlines ;
		}
		Apvlines = "<table  cellpadding='0' cellspacing='1' width='100%' height='100%' border='1'  style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;' bgcolor='#B9CBEA'>" + Apvlines + "</table>";
		AppLine.innerHTML = Apvlines;
		

		//협조
		elmList = elmRoot.selectNodes("division/step[@unittype='person' and @routetype='assist']/ou/person"); //개인협조
		if(elmList.length!=0){
			Apvlines = "";
			for (var i=0; i<elmList.length;i++) {
				elm = elmList.nextNode();
				elmTaskInfo = elm.selectSingleNode("taskinfo");
				strDate = elmTaskInfo.getAttribute("datecompleted");
				if(strDate == null) {strDate = "";}				
				Apvlines +="<tr><td width='45%' align='center'>"+elm.getAttribute("ouname") +"</td><td width='35%' align='center'>" + getSignUrl(elm.getAttribute("code"),elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result")) + "</td><td  width='20%' align='center'>"+formatDate(strDate)+"</td><tr>"
			}
			Apvlines = "<table cellpadding='0' cellspacing='1' width='100%' border='1' style='border-collapse: collapse;height:100%;'>" + Apvlines + "</table>";
			AssistLine.innerHTML = Apvlines;
		}
	}
}
//dhtml body type 인장표현
function getSignUrl(apvid,signtype,apvname,sDate,bDisplayDate,sResult,breturn){
	var rtn="";
	if (!breturn) {
	    return apvname;
	}
	else if (breturn == "assi") {
	    if (signtype != "" && signtype != null) {
	        if (signtype == "stamp") {
	            rtn = "<img src='" + g_BaseImgURL + "sign_" + apvid + "_0.jpg' border=0 style='width:50px;height:28px'>";
	        }
	        else {
	            if (sResult != 'rejected' && sResult != 'canceled') {
	                rtn = "<img src='" + g_BaseImgURL + signtype + "' border=0 style='width:50px;height:28px'>";
	            } else {//<span style='width:50px;height:30px'>&nbsp;</span>
	                if (sResult != 'canceled') {
	                    //반송이미지 있으면 반송이미지 삽입하고 사인뒤에 반송 표시를 하는거면 아래 주석처럼 처리!
	                    rtn = "반송"; //"<img src='" + g_BaseImgURL + signtype + "' border=0 style='width:50px;height:28px'>" + "<span style='color:red; font-size:12px;font-style:normal;font-weight:normal;vertical-align:bottom;'>(반)</span>";
	                } else { rtn = "부결"; }
	            }
	        }
	    } else {
	        if (sResult != 'rejected' && sResult != 'canceled') {//canceled
	            if (sDate != "") {
	                rtn = "승인";
	            }
	        } else {
	            if (sResult != 'canceled') {
	                //반송이미지 있으면 반송이미지 삽입하고 사인뒤에 반송 표시를 하는거면 아래 주석처럼 처리!
	                rtn = "반송"; 
	            } else { rtn = "부결"; }
	        }
	        //rtn = (bDisplayDate == false) ? apvname : apvname + '<br>' + formatDate(sDate);
	    }
	    return rtn;
	}
	else {
	    //if(sDate != ""){
	    if (signtype != "" && signtype != null) {
	        if (signtype == "stamp") {
	            rtn = "<img src='" + g_BaseImgURL + "sign_" + apvid + "_0.jpg' border=0 style='width:50px;height:50px'>";
	        }
	        else {
	            if (sResult != 'rejected' && sResult != 'canceled') {
	                rtn = "<img src='" + g_BaseImgURL + signtype + "' border=0 style='width:50px;height:50px'>";
	            } else {
	                if (sResult != 'canceled') {
	                    rtn = "반송";
	                } else { rtn = "부결"; }
	            }
	        }
	    } else {
	        rtn = (bDisplayDate == false) ? apvname : apvname + '<br>' + formatDate(sDate);
	    }
	    return rtn;
	    //}else{	return rtn;	}
	}
}
function interpretResult(strresult, szExtType){//2008.11
	var sKind = "";
	if(szExtType == "ExtType"){
	    if(strresult=="rejected") {	sKind="<font color='red'>&nbsp;"+parent.menu.gLabel_ExtType2+"</font>";}	//"반려"
	    if(strresult=="agreed") {	sKind=parent.menu.gLabel_ExtType1;	}			//"합의"
	    if(strresult=="disagreed") {	sKind=parent.menu.gLabel_ExtType2;	}	//"이의"	    
	}else{
	    if(strresult=="authorized")  {	sKind=parent.menu.gLabel_apv;	}			//"승인"
	    if(strresult=="substituted")  {	sKind=parent.menu.gLabel_apv;	}			//"승인"
	    if(strresult=="completed")  {	sKind=parent.menu.gLabel_apv;	}				//"승인"
	    if(strresult=="reviewed" )   {	sKind=parent.menu.gLabel_apv;	}			//"승인"
	    if(strresult=="rejected") {	sKind="<font color='red'>&nbsp;"+parent.menu.gLabel_reject+"</font>";}		//"반려"
	    if(strresult=="agreed") {	sKind=parent.menu.gLabel_agree;	}					//"합의"
	    if(strresult=="disagreed") {	sKind=parent.menu.gLabel_disagree;	}	//"이의"
	    if(strresult=="reserved") {	sKind=parent.menu.gLabel_hold;	}				//"보류"
	    if(strresult=="bypassed") {	sKind=parent.menu.gLabel_bypass;	}			//"후열"
	}
	return sKind;
}
function interpretKind(strkind, strresult,routetype,allottype,name) {
	var sKind;
    switch(strkind) {
        case "normal":		  sKind = "";break;//""
        case "charge":		  sKind = parent.menu.gLabel_charge;break;			//"담당"
        case "authorize":	  sKind = parent.menu.gLabel_authorize;break;		//"전결"
        case "review":		  sKind = parent.menu.gLabel_review;break;			//"후결"
				case "consent":		  sKind = parent.menu.gLabel_consent;break;			//""
        case "substitute":	sKind = parent.menu.gLabel_substitue;break;		//"대결"
        case "bypass":		  sKind = parent.menu.gLabel_bypass;break;			//"후열"
        case "confirm":		  sKind = "";break;															//"확인"
        case "skip":		    sKind = "--";break;
    }
    //normal일 경우 세부설정
    if(strkind == "normal")
    {
        if(routetype == "assist")
        {
            switch(allottype) {
            case "parallel":
               sKind = parent.menu.gLabel_ParallelAssist; //병렬
                break;
            case "serial":
                sKind = parent.menu.gLabel_serialAssist;  //순차
                break;
            default:
                sKind = parent.menu.gLabel_assist;
            }
        }else if(routetype == "audit"){
            //결재선에서 넘어온 이름을 그대로 사용
            if(name == "개인감사"){                       
                sKind = parent.menu.gLabel_audit;//감사;
            }else{
                sKind = parent.menu.gLabel_person_audit1;//준법감시;
            }
            
        }else if(name == "ExtType"){
            sKind = parent.menu.gLabel_ExtType;
        }
    }else{
	    if ((strresult=="rejected") && (strkind!="normal")){
		    //sKind=sKind+((getInfo("fmbt") == "HWP")?" 반려":"<br>반려");
		    sKind=sKind+((getInfo("fmbt") == "HWP")?" "+parent.menu.gLabel_reject:"<br>"+parent.menu.gLabel_reject);
	    }else if ((strresult=="rejected") && (strkind=="normal")){
		    sKind=parent.menu.gLabel_reject;//"반려"
	    }
	}
	return sKind;	
}
function formatDateCVT(sDate){			
	if(sDate=="" || sDate==null)
		return "";
	var dtDate = new Date(sDate.replace(/-/g,"/").replace(/오후/,"pm").replace(/오전/,"am"));
	return dtDate.getYear()+"-"+dblDigit(dtDate.getMonth()+1)+"-"+dblDigit(dtDate.getDate())+" "+dblDigit(dtDate.getHours())+":"+dblDigit(dtDate.getMinutes());//+":"+dblDigit(dtDate.getSeconds());
}
function dblDigit(iVal){return (iVal<10?"0"+iVal:iVal);}
function formatDate(tDate, sMode){
    tDate = formatDateCVT(tDate);
	if(sMode == "R"){
		var aRecDate = tDate.split("-");
		if(aRecDate.length > 2){return aRecDate[0] + "년  " + aRecDate[1] + "월 " + aRecDate[2].substring(0,2) + "일";}else{return "";}
	}else if(sMode == "D"){
		var aRecDate = tDate.split("-");
		if(aRecDate.length > 2){return aRecDate[0] + "-" + aRecDate[1] + "-" + aRecDate[2].substring(0,2);}else{return "";}
	}else if(sMode == "Y"){
		var aRecDate = tDate.split(".");
		if(aRecDate.length > 2){return aRecDate[0] + "년  " + aRecDate[1] + "월 " + aRecDate[2] + "일";}else{return "";}
	}else if(sMode == "A"){
	    var aRecDate = tDate.split("-");
	    if(aRecDate.length > 2){return aRecDate[0] + aRecDate[1];}else{return "";}
	}else if(sMode == "APV"){
		var aRecDate = tDate.split("-");
		if(aRecDate.length > 2){		   
			var dtDate = new Date(tDate.replace(/-/g,"/").replace(/오후/,"pm").replace(/오전/,"am"));
			return dtDate.getYear()+"-"+dblDigit(dtDate.getMonth()+1)+"-"+dblDigit(dtDate.getDate())+" "+dblDigit(dtDate.getHours())+":"+dblDigit(dtDate.getMinutes());
		}else{return "";}
    }else if(sMode == "M"){
	    var aRecDate = tDate.split("-");
	    if(aRecDate.length > 2){return aRecDate[0] + "." + aRecDate[1];}else{return "";}
	}else{
		var aRecDate = tDate.split("-");
		if(aRecDate.length > 2){return aRecDate[0] + "-" + aRecDate[1] + "-" + aRecDate[2].substring(0,2);}else{return "";}		
	}
}
function dblDigit(iVal){return (iVal<10?"0"+iVal:iVal);}
function G_displaySpnAttInfo(bRead){//수정본

	var attFiles, fileLoc, szAttFileInfo ;
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
	if(String(window.location).indexOf("_read.htm") > -1){
	    bEdit = false
	}else{
	    bEdit = true;
	}
	//if ((getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT" && getInfo("fmnm") != "통신지")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT")||parent.g_szEditable==true){bEdit = true;}  //2007.05.30 박동현 부서합의 재기안시 첨부파일, 연결문서 에디터형태로

	szAttFileInfo = "";
	MultiDownLoadString = "";
	//2006.12.05 by wolf upload UI 변경 End

	if (document.all['ATTACH_FILE_INFO'].value != ""){		
		var r, res;
		var s =document.all['ATTACH_FILE_INFO'].value;
		res = /^^^/i;
		attFiles = s.replace(res, "");
		
		var fState;
		var m_oFileList = new ActiveXObject("MSXML2.DOMDocument");
		if (attFiles.indexOf("</fileinfos>") < 0) {
		    m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?><fileinfos>" + attFiles + "</fileinfos>");
		} else {
		    m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + attFiles);
		}
		var elmRoot, elmList, elm, elmTaskInfo;
		elmRoot = m_oFileList.documentElement;
		if (elmRoot != null){
			elmList = elmRoot.selectNodes("fileinfo/file");			
			
			// 변경부분 : 07. 6. 11. JSI
			szAttFileInfo = "&nbsp;&nbsp;";
			
			for (var i=0; i<elmList.length;i++) {
				elm = elmList.nextNode();
				var filename = elm.getAttribute("name");
				var filesize = elm.getAttribute("size");
                var limitSize = parent.menu.FormatStringToNumber(parseInt(filesize) / 1024) ;
                        					
				displayFileName = elm.getAttribute("name").substring(0, elm.getAttribute("name").lastIndexOf(".")) ;
				displayFileName = displayFileName.replace(re,"&");
				if(elm.getAttribute("state")!=null)
				{
				
				    fState= elm.getAttribute("state");
				}
				else
				{
				    fState="";
				}
				
				//2006.12.05 by wolf upload UI 변경
				if(bEdit){
					szAttFileInfo +="<input type=checkbox id='chkFile' name='_" + elm.getAttribute("name").substring(0, elm.getAttribute("name").lastIndexOf("."))  + "' value='" + elm.getAttribute("name")  + "' style='vertical-align:middle;'>";
				}else{//편집모드가 아닐때만 다중다운로드 문자열 생성
				    
			        MultiDownLoadString += elm.getAttribute("location")//.replace(new RegExp( "\\+", "g" ),"%2B")
			                                +"|"+elm.getAttribute("name")//.replace(new RegExp( "\\+", "g" ),"%2B")
			                                +"|"+filesize
			                                +"`"; 
				}
				
				//////////////////////////////////////////////////////////////////////////////
				if (elm.getAttribute("location").indexOf(".") > -1 ){
					if (bReadOnly){
						szAttFileInfo +=  displayFileName;
					}else{
						//szAttFileInfo += "<a name=\""+displayFileExtendName +  "\" href=\"#\"  onclick='javascript:readcheck("+i+",\""+elm.getAttribute("location").replace("+","%2B")+"\",\""+displayFileExtendName +  "\")'>" + displayFileName + "</a>";
						if (getInfo("loct") == "TEMPSAVE" || getInfo("mode") == "ADMINEDMS"  ) //2006.10
						{
							//szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\""+elm.getAttribute("location").replace("+","%2B")+  "\" target = \"_blank\" ><b>" + elm.getAttribute("name") + " (" + limitSize + "KB)" +"</b></a>&nbsp;";
							szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) 
							+ "&nbsp;<a href=\"javascript:PopListSingle('"+escape(elm.getAttribute("location").replace(new RegExp( "\\+", "g" ),"%2B")) +":"+filesize+ "');\"  ><b>" + elm.getAttribute("name") 
							+ " (" + limitSize + "KB)" +"</b></a>&nbsp;";
						}else{							
							//2006.04.17 사원 이후창 수정
							//covi download컴포넌트 추가 관련
							//downloadfile() 함수를 바로 호출하도록 한다
							if(fState==""||fState=="OLD")
							{
							    //szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\"../fileattach/htmldown.aspx?location="+escape(elm.getAttribute("location").replace("+","%2B"))+ "&filename=" +  escape(elm.getAttribute("name")) + "\" target = \"_blank\" ><b>" + elm.getAttribute("name") + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
							    
							    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) 
							    + "&nbsp;<a href=\"javascript:PopListSingle('"+escape(elm.getAttribute("location").replace(new RegExp( "\\+", "g" ),"%2B")) +":"+filesize+ "');\"  ><b>" + elm.getAttribute("name") 
							    + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
							}
							
							else if(fState=="NEW")
							{
							    //szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\"../fileattach/htmldown.aspx?location="+escape(elm.getAttribute("location").replace("+","%2B"))+ "&filename=" +  escape(elm.getAttribute("name")) + "\" target = \"_blank\" ><b>" + elm.getAttribute("name") + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
							    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) 
							    + "&nbsp;<a href=\"javascript:PopListSingle('"+escape(elm.getAttribute("location").replace(new RegExp( "\\+", "g" ),"%2B")) +":"+filesize+ "');\"  ><b>" + elm.getAttribute("name") 
							    + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
							}
							else 
							{//삭제일경우
							    szAttFileInfo +="";
							}
						}
					}							
				}else{
					szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\""+m_KMWebAttURL+elm.getAttribute("location")+ "\" target = \"_blank\" ><b>" + elm.getAttribute("name") + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
				}
				//////////////////////////////////////////////////////////////////////////////
				
				if (i < elmList.length - 1)
					szAttFileInfo += ", ";
			}
			
			//2006.12.05 by wolf upload UI 변경
            // 편집 모드인지 확인해서 편집모드이면 삭제버튼 display
		    if(bEdit){
		        if(document.all['ATTACH_FILE_INFO'].value != ""){
				    parent.menu.makeDictionary(document.all['ATTACH_FILE_INFO'].value);
				    szAttFileInfo +="<a href='javascript:deleteitemFile();'><img src='/GWImages/Common/attachicon/del.gif' border='0' style='vertical-align:middle;' /></a>"; 
				}
			}
			
		}
		if(MultiDownLoadString != "")
		{
//		    szAttFileInfo = "<table border='0' width='100%' height='100%' cellpadding='0' cellspacing='0' style='padding-left:2px;font-family: \"굴림\", Dotum; font-size: 12px;'><tr><td width='80%'>"
//		                    +szAttFileInfo 
//		                    +"</td>"
//		                    +"<td align='right' widty='20%'><span class='board_list_title'>"
//		                    +"<img src='/GwImages/BLUE/Covi/common/icon/btn_icon01_down.gif' width='12' height='13' hspace='7' align='absmiddle' />"
//		                    +"<a href='javascript:DownloadCOVIUpload();'>DownLoad</a></span></td></tr></table>";
		    if (parent.menu.gFileAttachType == "1") { //시스템 사용 첨부파일 컴포턴트 0 : CoviFileTrans, 1:DEXTUploadX
		        AttFileInfo.parentNode.children[0].innerHTML = "<a href='javascript:DownloadDEXTUpload(window);'>첨부파일<img src='/GwImages/BLUE/Covi/common/icon/btn_icon01_down.gif' width='12' height='13' hspace='7' align='absmiddle'  border='0' /></a>";
            }else{
                AttFileInfo.parentNode.children[0].innerHTML = "<a href='javascript:DownloadCOVIUpload();'>첨부파일<img src='/GwImages/BLUE/Covi/common/icon/btn_icon01_down.gif' width='12' height='13' hspace='7' align='absmiddle'  border='0' /></a>";
            }
		}
		AttFileInfo.innerHTML = szAttFileInfo;
		try{parent.fileview.AttFileInfo.innerHTML = AttFileInfo.innerHTML; parent.fileview.setMultiDownLoad(MultiDownLoadString);}catch(e){}
	}else{
	
	    AttFileInfo.innerHTML = szAttFileInfo;
		try{parent.fileview.AttFileInfo.innerHTML = AttFileInfo.innerHTML;parent.fileview.setMultiDownLoad(MultiDownLoadString);}catch(e){}
	}
}

function DownloadCOVIUpload()
{
	var winstyle = "height=360, width=275, status=no, resizable=no, help=no, scroll=no";
	var winpath = "/CoviWeb/SiteReference/Common/covi_fileListdown.aspx";

	//var path = winpath + "?FileInfo=" + escape(MultiDownLoadString);    //한글파일명 처리
	var path = winpath + "?FileInfo=" + toUTF8(MultiDownLoadString);
    
    var strNewFearture = ModifyWindowFeature(winstyle);
    window.open(path, 'CoviDownLoad',strNewFearture);
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
var MultiDownLoadString;//일괄다운로드용 문자열
function G_displaySpnAttInfo2(bRead){//수정본

	var attFiles, fileLoc, szAttFileInfo ;
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
	if(String(window.location).indexOf("_read.htm") > -1){
	    bEdit = false
	}else{
	    bEdit = true;
	}
	//if ((getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT" && getInfo("fmnm") != "통신지")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT")||parent.g_szEditable==true){bEdit = true;}  //2007.05.30 박동현 부서합의 재기안시 첨부파일, 연결문서 에디터형태로

	szAttFileInfo = "";
	MultiDownLoadString = "";
	//upload UI 변경 End

	if (document.all['ATTACH_FILE_INFO'].value != ""){		
		var r, res;
		var s =document.all['ATTACH_FILE_INFO'].value;
		res = /^^^/i;
		attFiles = s.replace(res, "");
		
		var fState;
		var m_oFileList = new ActiveXObject("MSXML2.DOMDocument");
		m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?><fileinfos>"+attFiles+"</fileinfos>");
		var elmRoot, elmList, elm, elmTaskInfo;
		elmRoot = m_oFileList.documentElement;
		if (elmRoot != null){
			elmList = elmRoot.selectNodes("fileinfo/file");			
			
			// 변경부분 :
			szAttFileInfo = "&nbsp;&nbsp;";
			
			for (var i=0; i<elmList.length;i++) {
				elm = elmList.nextNode();
				var filename = elm.getAttribute("name");
				var filesize = elm.getAttribute("size");
                var limitSize = parent.menu.FormatStringToNumber(parseInt(filesize) / 1024) ;
                        					
				displayFileName = elm.getAttribute("name").substring(0, elm.getAttribute("name").lastIndexOf(".")) ;
				displayFileName = displayFileName.replace(re,"&");
				if(elm.getAttribute("state")!=null)
				{
				
				    fState= elm.getAttribute("state");
				}
				else
				{
				    fState="";
				}
				
				//upload UI 변경
				if(bEdit){
					szAttFileInfo +="<input type=checkbox id='chkFile' name='_" + elm.getAttribute("name").substring(0, elm.getAttribute("name").lastIndexOf("."))  + "' value='" + elm.getAttribute("name")  + "' style='vertical-align:middle;'>";
				}else{//편집모드가 아닐때만 다중다운로드 문자열 생성
				    MultiDownLoadString += (MultiDownLoadString==""?escape(elm.getAttribute("location").replace(new RegExp( "\\+", "g" ),"%2B"))+":"+filesize:";"+escape(elm.getAttribute("location").replace(new RegExp( "\\+", "g" ),"%2B"))+":"+filesize );
				}
				
				//////////////////////////////////////////////////////////////////////////////
				if (elm.getAttribute("location").indexOf(".") > -1 ){
					if (bReadOnly){
						szAttFileInfo +=  displayFileName;
					}else{
						//szAttFileInfo += "<a name=\""+displayFileExtendName +  "\" href=\"#\"  onclick='javascript:readcheck("+i+",\""+elm.getAttribute("location").replace("+","%2B")+"\",\""+displayFileExtendName +  "\")'>" + displayFileName + "</a>";
						if (getInfo("loct") == "TEMPSAVE" || getInfo("mode") == "ADMINEDMS"  ) //2006.10
						{
							//szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\""+elm.getAttribute("location").replace("+","%2B")+  "\" target = \"_blank\" ><b>" + elm.getAttribute("name") + " (" + limitSize + "KB)" +"</b></a>&nbsp;";
							szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) 
							+ "&nbsp;<a href=\"javascript:PopListSingle('"+escape(elm.getAttribute("location").replace(new RegExp( "\\+", "g" ),"%2B")) +":"+filesize+ "');\"  ><b>" + elm.getAttribute("name") 
							+ " (" + limitSize + "KB)" +"</b></a>&nbsp;";
						}else{							
							//covi download컴포넌트 추가 관련
							//downloadfile() 함수를 바로 호출하도록 한다
							if(fState==""||fState=="OLD")
							{
							    //szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\"../fileattach/htmldown.aspx?location="+escape(elm.getAttribute("location").replace("+","%2B"))+ "&filename=" +  escape(elm.getAttribute("name")) + "\" target = \"_blank\" ><b>" + elm.getAttribute("name") + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
							    
							    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) 
							    + "&nbsp;<a href=\"javascript:PopListSingle('"+escape(elm.getAttribute("location").replace(new RegExp( "\\+", "g" ),"%2B")) +":"+filesize+ "');\"  ><b>" + elm.getAttribute("name") 
							    + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
							}
							
							else if(fState=="NEW")
							{
							    //szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\"../fileattach/htmldown.aspx?location="+escape(elm.getAttribute("location").replace("+","%2B"))+ "&filename=" +  escape(elm.getAttribute("name")) + "\" target = \"_blank\" ><b>" + elm.getAttribute("name") + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
							    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) 
							    + "&nbsp;<a href=\"javascript:PopListSingle('"+escape(elm.getAttribute("location").replace(new RegExp( "\\+", "g" ),"%2B")) +":"+filesize+ "');\"  ><b>" + elm.getAttribute("name") 
							    + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
							}
							else 
							{//삭제일경우
							    szAttFileInfo +="";
							}
						}
					}							
				}else{
					szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\""+m_KMWebAttURL+elm.getAttribute("location")+ "\" target = \"_blank\" ><b>" + elm.getAttribute("name") + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
				}
				//////////////////////////////////////////////////////////////////////////////
				
				if (i < elmList.length - 1)
					szAttFileInfo += ", ";
			}
			
			//upload UI 변경
            // 편집 모드인지 확인해서 편집모드이면 삭제버튼 display
		    if(bEdit){
		        if(document.all['ATTACH_FILE_INFO'].value != ""){
				    parent.menu.makeDictionary(document.all['ATTACH_FILE_INFO'].value);
				    szAttFileInfo +="<a href='javascript:deleteitemFile();'><img src='/GWImages/Common/attachicon/del.gif' border='0' style='vertical-align:middle;' /></a>"; 
				}
			}
			
		}
		
		AttFileInfo.innerHTML = szAttFileInfo;
		try{parent.fileview.AttFileInfo.innerHTML = AttFileInfo.innerHTML; parent.fileview.setMultiDownLoad(MultiDownLoadString);}catch(e){}
	}else{
	
	    AttFileInfo.innerHTML = szAttFileInfo;
		try{parent.fileview.AttFileInfo.innerHTML = AttFileInfo.innerHTML;parent.fileview.setMultiDownLoad(MultiDownLoadString);}catch(e){}
	}
}
function PopListSingle(SingleDownLoadString){
     parent.download.location.href ='/CoviWeb/SiteReference/Common/covi_fileSingledown.aspx?usercode='+parent.getInfo("usid")+"&filepath=" + SingleDownLoadString ;
}
    
function deleteitemFile(){
	parent.menu.deleteitem();
}

//첨부경로이미지 
function getAttachImage(image)
{
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
        image == "xlsx" || image == "docx" || image == "pptx" || image == "hwp")
    {
        var imageurl = "<img src='"+parent.menu.g_imgBasePath+"/Covi/Common/icon/icon_filetype_" + image + ".gif' style='vertical-align:middle;' />" ;
    }
    else
    {
         var imageurl = "<img src='"+parent.menu.g_imgBasePath+"/Covi/Common/icon/icon_filetype_unknown.gif' style='vertical-align:middle;' />" ;
    }
    return imageurl;
}


// 한글을 포함한 문자열에서 문자열의 길이를 반환한다. 
function getLengthOfString(str){
	var len = str.length; 
	var han = 0; 
	var res = 0; 
	
	for(i=0;i<len;i++) { 
		var a=str.charCodeAt(i); 
		if(a>128) han++; 	
	} 
	res = (len-han) + (han*2); 	
	return res; 
}
//첨부파일 읽기 확인시 사용
function makearray(n){
	this.length = n;
    for (var i = 0 ; i < n ; i++)
        this[i] = 0;
    return this;
}
//첨부파일 읽기 확인시 사용
function readcheck(i){readCheck[i]="1";}
function setDefaultBody(sText){
	if(sText==null||sText=="")return;
	switch(getInfo("fmbt")){
		case "DHTML":
			try{
				Wec.MIMEValue = sText;
			}catch(e){
				alert(e.message);
				tbContentElement.DocumentHTML=sText;
			}
			break;
		case "HWP":
			HwpCtrl.SetTextFile(sText, "HWP", "");break;
	}
}
function viewSummary(){ //문서정보관련(요약전)
	openWindow("doc_summary.htm","",380,280,"fix");
}
function insertDicFileInfo(fileName){m_oDicFileInfo.add(fileName, dField["filelocation"].value + fileName);}
function event_noop(){return(false);}
function getReceiveNo(){
	var strRecDeptNo = RECEIVE_NO.value;
	if(strRecDeptNo != ""){
		var iFIndex = strRecDeptNo.indexOf('['+getInfo("dpid")+']');
		if(iFIndex != -1){
			var iLIndex = strRecDeptNo.indexOf(';',iFIndex);
			var iMIndex = strRecDeptNo.indexOf(']',iFIndex);
			return  strRecDeptNo.substring(iMIndex+1, iLIndex);
		}else{return "";}
	}else{return "";}
}
function DeCodeRecList(sRecList){
	var r, res, sRecDept;
	var s = sRecList;
	res = /@/i;
	sRecDept = s.replace(res, "");
	m_oRecList.loadXML("<?xml version='1.0' encoding='utf-8'?><groups>"+sRecDept+"</groups>");
	var elmList = m_oRecList.documentElement.selectNodes("group");
	sRecDept = "";
	if(elmList.length!=0){
		for (var i=0; i<elmList.length;i++) {
			sRecDept +=  "@";
			var elm = elmList.nextNode();
			var elmnodelist = elm.selectNodes("item/AN");
			var sRecDeptNode="";
			for(var j=0;j < elmnodelist.length;j++){
				var elmnode = elmnodelist.nextNode();
				sRecDeptNode += ";" + elmnode.text;
			}
			if(sRecDeptNode.length > 0) sRecDeptNode = sRecDeptNode.substring(1);
			sRecDept += sRecDeptNode;
		}
		if(sRecDept.length > 0) sRecDept = sRecDept.substring(1);
	}
	if(sRecList.length > 1){//수신처지정없음
		if(sRecList.substr(0,1) == '@') sRecDept = "@"+sRecDept;
	}
	return sRecDept;
}	
/*수신처, 발신처 부서 결재선 표현*/			
function getRequestApvList(elmList,elmVisible,sMode,bReceive,sApvTitle,bDisplayCharge){//신청서html
	var elm, elmTaskInfo, elmReceive, elmApv;
	var strDate;
	var j=0;
	var Apvlines ="";
	var ApvPOSLines="<tr>";
	//var ApvSignLines = "<tr>";
	var ApvSignLines = "";
	var ApvApproveNameLines="<tr>";
	var ApvDateLines="<tr>";
	var ApvCmt="<tr>";	
	var strColTD = elmList.length - elmVisible.length;
	var strwidth = "100"; //String(100/strColTD);
	var rWIDTH = "90";
	var elmRoot = m_oApvList.documentElement;
	var elmSendList = elmRoot.selectSingleNode("division[@divisiontype='send']/taskinfo[@status='completed']");
	if (getInfo("scIPub") == "1") {
	    hReciveBool.value = bReceive;
	    rWIDTH = "90";
	} else {
	    if (elmList.length > 5) {
	        rWIDTH = String(945 / elmList.length);
	    } else {rWIDTH = "189"; }
	}
	if (elmList.length == 0 && getInfo("scDRec") == "1") {
	    ApvPOSLines += "<td rowspan='4' width='25' height='110' align='center' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #d9ebf8;' nowrap='f'>주<br/>관<br/>부<br/>서</td>";
	    for (var n=0; n < 5; n++) {
	        ApvSignLines += "<td width='" + rWIDTH + "' height='60' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>/</td>";
	        ApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>&nbsp;</td>";
	        ApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>&nbsp;</td>";
	    }
	}
	for (var i = 0; i < elmList.length - j; i++) {
        elm = elmList.nextNode();
        elmTaskInfo = elm.selectSingleNode("taskinfo");

        if (i == elmList.length - 1 && i != 0) {//결재선에 5명미만일 경우 최종결자만 우측정렬하고 나머진 좌측정렬한다.(기본결재란 5칸)  - 현대백화점
            var k = 5;
            if (getInfo("scIPub") == "1") { var k = 4; }
            for (k; k > elmList.length; k--) {
                ApvSignLines += "<td width='" + rWIDTH + "' height='60' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>/</td>";
                ApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>&nbsp;</td>";
                ApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>&nbsp;</td>";
            }
        }
        //자동결재선에 따라 부서표시 수정부분 추가
        if (i == 0) {
            if (sApvTitle != "" && sApvTitle != undefined) {
                sApvTitle = elm.getAttribute("ouname").replace(/-/gi, "<br/>");
            }
            if (bReceive) { //담당부서 결재선
                if (sApvTitle != "") {
                    if (getInfo("scIPub") == "1") { ApvPOSLines += "<td rowspan='4' width='25' height='110' align='center' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #d9ebf8;' nowrap='f'>결<br/>재<br/>란</td>"; }
                    else { ApvPOSLines += "<td rowspan='4' width='25' height='110' align='center' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #d9ebf8;' nowrap='f'>주<br/>관<br/>부<br/>서</td>"; }  //+ (sApvTitle == undefined ? parent.menu.gLabel_management + "<br>" + parent.menu.gLabel_dept : sApvTitle) + "</td>";
                } //주관부서 결재선
            } else {
                //if (sApvTitle != "") {
                if (getInfo("scPRec") == "1" || getInfo("scDRec") == "1" || getInfo("scChgr") == "1" || getInfo("scChgrOU") == "1") {
                    ApvPOSLines += "<td rowspan='4' width='25' height='110' align='center' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #d9ebf8;' nowrap='f'>신<br/>청<br/>부<br/>서</td>"; //+ (sApvTitle == undefined ? parent.menu.gLabel_request + "<br>" + parent.menu.gLabel_dept : sApvTitle) + "</td>";
                }
                else {
                    if (getInfo("fmpf") == "WF_FORM_DRAFT_BHS") {
                        ApvPOSLines += "";
                    }
                    else {
                        ApvPOSLines += "<td rowspan='4' width='25' height='110' align='center' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #d9ebf8;' nowrap='f'>결<br/>재<br/>란</td>"; //+ (sApvTitle == undefined ? parent.menu.gLabel_request + "<br>" + parent.menu.gLabel_dept : sApvTitle) + "</td>";
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
                //ApvPOSLines += "<td height='20'  width='"+strwidth+"' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + temp_charge + "</td>";//결재선 상단  표시되는곳 //현대백화점 사용안함
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
                //ApvPOSLines += "<td height='20'  width='"+strwidth+"' align='center' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + sTitle +"</td>";//결재선 상단 직위or직책 표시되는곳 //현대백화점 사용안함
            }

            ApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>";
            ApvSignLines += "<td width='" + rWIDTH + "' height='60' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>";
            ApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>";
            //발송일자 표시.. - 현대백화점 
            try {
                SendDate.innerHTML = formatDate(elmSendList.getAttribute("datecompleted"), "R"); //formatDate(strDate);
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
                    idDept.innerText = elm.getAttribute("ouname"); //소속
                    idJopPosion.innerText = oPosition[1]; //직위
                    idName.innerText = elm.getAttribute("name"); //성명
                    if (elmTaskInfo.getAttribute("datecompleted") != "" && elmTaskInfo.getAttribute("datecompleted") != null) {
                        idSign.innerHTML = getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); //서명
                    } else {
                        idSign.innerText = "/";
                    }
                } catch (e) { }
            }
            if (elmTaskInfo.getAttribute("status") == "reserved") {}
            switch (elmTaskInfo.getAttribute("kind")) {
                case "authorize":
                    if (strDate == "") { ApvSignLines += parent.menu.gLabel_substitue; } else { ApvSignLines += getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); ApvSignLines += "<span style='color:red; font-size:10px;font-style:normal;font-weight:normal;vertical-align:bottom;'>(전)</span>"; } //"대결"
                    //ApvSignLines += parent.menu.gLabel_authorize + interpretResult(elmTaskInfo.getAttribute("result")); //전결
                    ApvApproveNameLines += sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name"); //"&nbsp;";
                    ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                    LastApv = "/";
                    LastApvName = elmname.getAttribute("name") + interpretResult(elmTaskInfo.getAttribute("result"));
                    LastDate = formatDate(strDate);
                    break;
                case "substitute":
                    if (strDate == "") { ApvSignLines += parent.menu.gLabel_substitue; } else { ApvSignLines += getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); ApvSignLines += "<span style='color:red; font-size:10px;font-style:normal;font-weight:normal;vertical-align:bottom;'>(대)</span>"; } //"대결"
                    ApvApproveNameLines += sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name"); //getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name") + interpretResult(elmTaskInfo.getAttribute("result"));
                    ApvDateLines += formatDate(strDate);
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
                    ApvApproveNameLines += sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name"); //(LastApvName == "") ? getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name") : LastApvName;
                    ApvDateLines += (LastDate == "") ? formatDate(strDate) : LastDate;
                    break; //"후열"
                case "review":
                    ApvSignLines += (strDate == "") ? parent.menu.gLabel_review : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true);
                    ApvSignLines += (strDate == "") ? "":"<span style='color:red; font-size:10px;font-style:normal;font-weight:normal;vertical-align:bottom;'>(후)</span>"; //후결
                    ApvApproveNameLines += sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name"); //(strDate == "") ? "&nbsp;" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name") + interpretResult(elmTaskInfo.getAttribute("result"));
                    ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                    break;
                case "charge":
                    if (bReceive && getInfo("loct") == "REDRAFT") {
                        ApvSignLines += "";
                    }
                    else {
                        ApvSignLines += getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true);
                    }
                    ApvApproveNameLines += sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name"); //(strDate == "") ? "&nbsp;" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name") + interpretResult(elmTaskInfo.getAttribute("result"));
                    ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
                    try {//품의서 기안자 결재선에서 분리함 - 현대백화점
                        if (init_name != undefined || init_name != null) {
                            init_name.innerHTML = sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name");
                        }
                    } catch (e) { }
                    break;
                default:
                    if (elmTaskInfo.getAttribute("status") == "reserved") { ApvSignLines += "보류중"; } //결재보류시 결재선에 보류 표시 - 현대백화점
                    else { ApvSignLines += (strDate == "") ? "/" : getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true); }
                    if (i != 0 && getInfo("fmpf") == "WF_FORM_DRAFT_BHS" && (i == elmList.length - 1 || i == elmList.length - 2)) {
                        ApvApproveNameLines += "보 고(후결)";
                    }
                    else {
                        ApvApproveNameLines += sTitle + "/" + getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name"); //(strDate == "") ? "&nbsp;" : getPresence(sCode, i + sCode, elmname.getAttribute("sipaddress")) + elmname.getAttribute("name") + interpretResult(elmTaskInfo.getAttribute("result"));
                    }
                    ApvDateLines += (strDate == "") ? "&nbsp;" : formatDate(strDate);
            }
            ApvSignLines += "</td>";
            ApvApproveNameLines += "</td>";
            ApvDateLines += "</td>";
            if (i == 0 && (getInfo("fmpf") == "WF_FORM_DRAFT_HY" || getInfo("fmpf") == "WF_FORM_HD_DRAFT" || getInfo("fmpf") == "WF_FORM_DRAFT_BHS" || getInfo("fmpf") == "WF_FORM_FG_DRAFT")) {
                ApvPOSLines = "<tr>";
                ApvSignLines = "";
                ApvApproveNameLines = "<tr>";
                ApvDateLines = "<tr>";
            }
        }
        //결재선에 기안자만 있을 경우 기안자 이후로 공란 3 or 4(신청서)칸 자동 추가 - 현대백화점
        if (elmList.length == 1) {
            var l = 5;
            if (getInfo("scIPub") == "1") { l = 4; }
            for (l ; l > 1; l--) {
                ApvSignLines += "<td width='" + rWIDTH + "' height='60' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,gulim;font-style:italic;color:#4584C9;font-weight:bold'>/</td>";
                ApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'>&nbsp;</td>";
                ApvDateLines += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>&nbsp;</td>";
            }
        }
	}
	// 2005.07.13 박형진 수정 기안자,결재자 '이름' 출력하도록
	//Apvlines = ApvPOSLines + "</tr>" + ApvSignLines + "</tr>" + ApvApproveNameLines + "</tr>" + ApvDateLines + "</tr>";
	if (getInfo("scIPub") == "1" || getInfo("fmpf") == "WF_FORM_DRAFT_HY" || getInfo("fmpf") == "WF_FORM_HD_DRAFT" || getInfo("fmpf") == "WF_FORM_FG_DRAFT") {
	    Apvlines = ApvPOSLines + ApvApproveNameLines.replace("<tr>","") + "</tr><tr>" + ApvSignLines + "</tr>" + ApvDateLines + "</tr>";
	} else if (getInfo("fmpf") == "WF_FORM_DRAFT_BHS") {
	    Apvlines = ApvApproveNameLines + "</tr>" + ApvSignLines + "</tr>" + ApvDateLines + "</tr>";
	}else {
	    Apvlines = ApvPOSLines + ApvSignLines + "</tr>" + ApvApproveNameLines + "</tr>" + ApvDateLines + "</tr>";
	}
	if (getInfo("fmpf") == "WF_FORM_DRAFT_HY" || getInfo("fmpf") == "WF_FORM_HD_DRAFT" || getInfo("fmpf") == "WF_FORM_FG_DRAFT") {
	    Apvlines = "<table bgcolor='#FFFFFF' border='1' cellpadding='0' cellspacing='0' bordercolor='#111111' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;'>" + Apvlines + "</table>"; //width:95%;
	}
	else {
	    Apvlines = "<table bgcolor='#FFFFFF' border='2' cellpadding='0' cellspacing='0' bordercolor='#111111' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;'>" + Apvlines + "</table>"; //width:95%;
	}
	return Apvlines;	
}
//최대7개의 결재선을 고정으로 표시하기 위한 함수
//pMaxApv : 최대 결재선 갯수
//pRemainApv : 남은 결재선 갯수(실제 공란으로 표시할 결재선갯수)
//poHTML : Return될 HTML 변수명 ( ApvPOSLines|ApvSignLines|ApvApproveNameLines|ApvDateLines)
function displayRemainApv(pMaxApv, pRemainApv, poHTML, strwidth){
	var tmpHTML="", tmpRemainApv="";
	tmpRemainApv = pMaxApv - pRemainApv - 1;
	
	if(poHTML == "ApvPOSLines"){
	    if(tmpRemainApv == 6 && tmpRemainApv > 0){
				tmpHTML += "<td height='20'  bgcolor='#F2F2F2' colspan='"+(tmpRemainApv-1)+"' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>"+parent.menu.gLabel_investigation+"</td>";	//검토
				tmpHTML += "<td height='20'  bgcolor='#F2F2F2' width='"+strwidth+"%' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>"+parent.menu.gLabel_Approved+"</td>";								//승인	
	    }else if(tmpRemainApv < 6 && tmpRemainApv > 0){
				tmpHTML += "<td height='20'  bgcolor='#F2F2F2' colspan='"+(tmpRemainApv)+"' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>"+parent.menu.gLabel_investigation+"</td>";		//검토
	    }
	}else{
	    for(var i=0; i<tmpRemainApv; i++){
		    switch(poHTML){
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
function getDocLevel(szCode){
	var szName='';
	/*보광그룹변경
	switch (szCode){
		case "10" : szName = "공개";break;
		case "20" : szName = "대외비";break;
		case "30" : szName = "중요";break;
		case "40" : szName = "극비";break;	
	}
	*/
	var m_objXML=new ActiveXObject("MSXML2.DOMDocument");
	var elmList, elm;
	var elmListLan;
	try{
		m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?>"+getInfo("BODY_CONTEXT"));
		elmList = m_objXML.documentElement.childNodes;
		if(elmList.length > 0){
		    szName = m_objXML.documentElement.selectSingleNode("DOC_LEVEL_NAME").text;
		}
	}catch(e){
	}	
	return szName;
}
//보존년한 조회
function getSaveTerm(szCode){
	var szName='';
	switch (szCode){
		case "1" : szName = parent.menu.gLabel_year_1;break;			//"1년"
		case "3" : szName = parent.menu.gLabel_year_3;break;			//"3년"
		case "5" : szName = parent.menu.gLabel_year_5;break;			//"4년"
		case "7" : szName = parent.menu.gLabel_year_7;break;			//"5년"
		case "10" : szName = parent.menu.gLabel_year_10;break;		//"10년"
		case "15" : szName = parent.menu.gLabel_year_15;break;		//"15년"
		case "99" : szName = parent.menu.gLabel_permanence;break;	//"영구"
	}
	return szName;
}
//문서등급 create
function setDocLevel(){
  /*보광그룹 수정
	makeCBOobject("10","공개",DOC_LEVEL);
	makeCBOobject("20","대외비",DOC_LEVEL);
	makeCBOobject("30","중요",DOC_LEVEL);
	makeCBOobject("40","극비",DOC_LEVEL);
	
	setDefaultCBOobject((getInfo("DOC_LEVEL")==null?"40":getInfo("DOC_LEVEL")),DOC_LEVEL);
	*/
	var connectionname = "FORM_DEF_ConnectionString";
    var pXML = "covi_groupware.dbo.DMP_ACLLIST_SELECT";
    var aXML = "<param><name>CD_DEPT</name><type>nvarchar</type><length>100</length><value><![CDATA["+getInfo("etid")+"]]></value></param>";
        aXML += "<param><name>DV_ACLTYPE</name><type>varchar</type><length>10</length><value><![CDATA[SYSTEM ACL]]></value></param>";
    var sPostBody = "<Items><connectionname>"+connectionname+"</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
    var sTargetURL = "../getXMLQuery.aspx";
	requestHTTP((sPostBody==null?"GET":"POST"),sTargetURL,false,"text/xml",receiveDocLevelQuery,sPostBody);
	
}
//보존년한 create
function setSaveTerm(){
	makeCBOobject("1",parent.menu.gLabel_year_1,SAVE_TERM);				//"1년"
	makeCBOobject("3",parent.menu.gLabel_year_3,SAVE_TERM);				//"3년"
	makeCBOobject("5",parent.menu.gLabel_year_5,SAVE_TERM);				//"5년"
	makeCBOobject("7",parent.menu.gLabel_year_7,SAVE_TERM);				//"7년"
	makeCBOobject("10",parent.menu.gLabel_year_10,SAVE_TERM);			//"10년"
	makeCBOobject("15",parent.menu.gLabel_year_15,SAVE_TERM);			//"15년"
	makeCBOobject("99",parent.menu.gLabel_permanence,SAVE_TERM);	//"영구"
	setDefaultCBOobject(getInfo("SAVE_TERM"),SAVE_TERM);
}
function makeCBOobject(strcode, strname, cboObject){
	try{
	var oOption = document.createElement("OPTION");
	cboObject.options.add(oOption);
	oOption.text=strname;
	oOption.value=strcode;	
	}catch(e){}
	return;	
}
function setDefaultCBOobject(strcode, cboObject){
	if(strcode=='' || strcode == null) strcode = '1';
	for(var i=0; i<cboObject.length ; i++){
		if(cboObject.options[i].value == strcode)
		{
			cboObject.options[i].selected = true;
		}
	}
}
////////////////////////////////////////////////////////////////////
//				나모 컨트롤에 추가된 이미지, 업로드				  //	
////////////////////////////////////////////////////////////////////
// 나모에 이미지 경로를 가지고 XFileUpload 로 Front에 올린다.

var gz_xmlHTTP = new ActiveXObject("Microsoft.xmlhttp");
var up_xmlHTTP = new ActiveXObject("Microsoft.xmlhttp");
var gz_Editor="0"; // 0 : dhtml; 1: Namo, 2: TagFree
function UpdateImageData(){	

  gz_Editor = "2";
	var nfile = "";
	var nfolder = "IMAGEATTACH";	
	var truedata = "";	
	var n =-1;
	var szMimeValue,szURL,imgList;
	imgList = "";
	switch(gz_Editor){
		case "1": n= tbContentElement.GetFileNum(0); break;
		case "2": 
			document.tbContentElement.SetDefaultTargetAs('_blank');//link 변경
			dhtml_body.value = tbContentElement.HtmlValue;	
			n= tbContentElement.HtmlValue.indexOf('file:///');break;
	}
	
	if(n > -1){ 
		switch(gz_Editor){
			case "1": 
				imgList = getFileList();
				if(imgList != "" ){
					// 기존에 저장되어 있는 이미지 경로는 http://이므로 실제로 새롭게 올린 화일의 경로는 로컬경로가 되므로 로컬경로를 확인하여 보내준다.
					var sdata = imgList.split("|");
					if(sdata.length > 0 )	{				
						for(var i=0; i<sdata.length - 1; i++)	{
							var str = sdata[i];
							if(str.indexOf("http://") == -1){		truedata += str + "|";	}
						}
					}
				}
				szMimeValue = tbContentElement.MimeValue;
				szURL = "/CoviWeb/common/FileAttach/BodyImgMoveBackstorage_namo.aspx";
				break;
			case "2": 
				szMimeValue =tbContentElement.MimeEnValue;
				szURL =  "/CoviWeb/common/FileAttach/BodyImgMoveBackStorage_tagfree.aspx";//
				truedata = szMimeValue;
				break;
		}

		if(truedata != ""){					
			//var rgDialogArgs = {"imgList" : truedata};
			//var hWin = window.showModalDialog("/COVINet/COVIFlowNet/Forms/NamoImage/ImageUpload.htm", rgDialogArgs,"dialogHeight: 120px; dialogWidth: 170px;dialogLeft: "+(window.screen.Width-170)/2+";dialogTop: "+(window.screen.Height-120)/2+";status:no; resizable:no;help:no;center:no");			
			// frontstorage에 있는 이미지를 BackStorage\Approval 로 이동
			var szRequestXml = "<?xml version='1.0'?>"+
									"<parameters>"+
									  "<fname><![CDATA[" + getInfo("svdt").replace(/:/gi,"").replace(/오후/gi,"").replace(/오전/gi,"") + "]]></fname>"+
									  "<foldername><![CDATA[" + nfolder + "]]></foldername>"+
									  "<filename><![CDATA[" + imgList + "]]></filename>"+										
									  "<mime><![CDATA[" + szMimeValue + "]]></mime>"+										
									  "<domain><![CDATA[" + "http://" + document.location.host  + "]]></domain>"+										
									"</parameters>";	

			gz_xmlHTTP.open("POST",szURL,false);
			gz_xmlHTTP.setRequestHeader( "Content-type:", "text/xml");  
			gz_xmlHTTP.send(szRequestXml);
			event_attchSync();
		}
	}
}
// 나모 본문 작성후, 기안및 재기안 시에 이미지 경로를 서버측 주소롤 바꾸어서 저장한다.
function ChangeImgURL() {
	var objDOM; //Namo tbContentElement_Dom
	switch(gz_Editor){
		case "1": objDOM = tbContentElement.CreateDOM(); 
			objDOM.charset = "utf-8";
			var imgName = new Array;
			var szdate = getInfo("svdt").replace(/:/gi,"").replace(/오후/gi,"").replace(/오전/gi,"");
			var g_szURL = "http://" + document.location.host + "/COVInet/BackStorage/e-sign/Approval/attach";
			for (var i = 0; i < objDOM.images.length; i++){			
				var imgSrc = objDOM.images[i].src;  			
				imgSrc = imgSrc.toLowerCase();
				if(imgSrc.indexOf("file:///") > -1){ //backstorage/approval/attach== -1					
						imgName[i] = imgSrc.substring(imgSrc.lastIndexOf('/') + 1, imgSrc.length);						
						objDOM.images[i].src = g_szURL +"/"+ szdate + "_"+ imgName[i];					
				}
			}
			tbContentElement.Value = objDOM.body.innerHTML.replace(/ekpweb1.medison.com/gi,"ekp.medison.com").replace(/ekpweb2.medison.com/gi,"ekp.medison.com");		
			tbContentElement.DeleteDOM(); // DOM 사용하고 난 후에는 삭제해주어야 한다.		
			break;
		case "2": //objDOM = oWebEditor.GetDOM(); 
		break;
	}
}
function event_attchSync(){
//	if(gz_xmlHTTP.readystate == 4){
//		gz_xmlHTTP.onreadystatechange = event_noop;
		if(gz_xmlHTTP.status == 200){
			var error = gz_xmlHTTP.responseXML.selectSingleNode("//error");
			if(error != null){ 
				alert("AttachImage ERROR : " + error.text);
				return;
			}else{
				 if(gz_Editor == "2") {
						tbContentElement.HtmlValue = gz_xmlHTTP.responseXML.selectSingleNode("//htmldata").text;
						dhtml_body.value = gz_xmlHTTP.responseXML.selectSingleNode("//htmldata").text;
				 }
			}
		}else{
			alert(gz_xmlHTTP.statusText);
		}
//	}
}
//수신처 부서출력
function displayRecApvDept(pRecDept){
	var retHTML = "<table bordercolor='#111111' border='2' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100;width:95%;'><tr>";
	retHTML += "<td rowspan='3' bgcolor='#F2F2F2' width='40' height='100' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>"+parent.menu.gLabel_management+"<br>"+parent.menu.gLabel_dept+"</td>";
	retHTML += "<td height='20'  bgcolor='#F2F2F2'  width='100%' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>&nbsp;</td>";
	retHTML += "</tr><tr>";
	retHTML += "<td height='20' align='center' valign='middle' style='font-size:8pt;'>"+pRecDept+"</td>";
	retHTML += "</tr><tr>";
	retHTML += "<td height='20'  align='center' valign='bottom' style='font-size:8pt;'></td>";
	retHTML += "</tr><tr>";
	retHTML += "<td height='20' align='center' valign='middle' style='font-size:8pt;'></td>";
	retHTML += "</tr></table>";
	return retHTML;
}
////////////////////////////////////////////////////////////////////
//				태그 프리 컨트롤에 추가된 이미지, 업로드				  //	
////////////////////////////////////////////////////////////////////
// 태그프리에 삽입된 이미지 경로를 가지고 XFileUpload 로 Front에 올린다.
var gz_xmlHTTP = new ActiveXObject("Microsoft.xmlhttp");
var up_xmlHTTP = new ActiveXObject("Microsoft.xmlhttp");
var gz_Editor="1"; // 0 : Namo, 1: TagFree
function UpdateImageData_tagfree(){	
	var nfile = "";
	var nfolder = "attach";
	var truedata = "";	
	var n =-1;
	var szMimeValue,szURL,imgList;
	imgList = "";
	
	switch(gz_Editor){
		case "0": n= tbContentElement.GetFileNum(0); break;
		case "1": n= AlternateBODY.HtmlValue.indexOf('file:///');break;
	}
	
	if(n > -1){ 
		switch(gz_Editor){
			case "0": 
				imgList = getFileList();
				
				if(imgList != ""){
					// 기존에 저장되어 있는 이미지 경로는 http://이므로 실제로 새롭게 올린 화일의 경로는 로컬경로가 되므로 로컬경로를 확인하여 보내준다.
					var sdata = imgList.split("|");
					if(sdata.length > 0)	{				
						for(var i=0; i<sdata.length - 1; i++)	{
							var str = sdata[i];
							if(str.indexOf("http://") == -1){		truedata += str + "|";	}
						}
					}
				}
				szMimeValue = tbContentElement.MimeValue;
				szURL = "./NamoImage/BackstroageMove.aspx";
				break;
			case "1":
			    szMimeValue =AlternateBODY.MimeEnValue;
				szURL = "TagFree.aspx";
				truedata = szMimeValue;
				break;
		}

		if(truedata != ""){	
			//var rgDialogArgs = {"imgList" : truedata};
			//var hWin = window.showModalDialog("/COVINet/COVIFlowNet/Forms/NamoImage/ImageUpload.htm", rgDialogArgs,"dialogHeight: 120px; dialogWidth: 170px;dialogLeft: "+(window.screen.Width-170)/2+";dialogTop: "+(window.screen.Height-120)/2+";status:no; resizable:no;help:no;center:no");			
			// frontstorage에 있는 이미지를 BackStorage\Approval 로 이동
			var szRequestXml = "<?xml version='1.0'?>"+
									"<parameters>"+
									  //"<fname><![CDATA[" + getInfo("svdt").replace(/:/gi,"").replace(/오후/gi,"").replace(/오전/gi,"") + "]]></fname>"+
									  //"<foldername><![CDATA[" + nfolder + "]]></foldername>"+
									  //"<filename><![CDATA[" + imgList + "]]></filename>"+										
									  "<mime><![CDATA[" + szMimeValue + "]]></mime>"+										
									  "<domain><![CDATA[" + "http://" + "210.105.131.222"  + "]]></domain>"+										
									"</parameters>";	

			gz_xmlHTTP.open("POST",szURL,false);
			gz_xmlHTTP.setRequestHeader( "Content-type:", "text/xml");  
			gz_xmlHTTP.send(szRequestXml);
			event_attchSync_tagfree();
		}
	}
}
function event_attchSync_tagfree(){        
//	if(gz_xmlHTTP.readystate == 4){
//		gz_xmlHTTP.onreadystatechange = event_noop;
		if(gz_xmlHTTP.status == 200){
			var error = gz_xmlHTTP.responseXML.selectSingleNode("//error");
			if(error != null){ 
				alert("AttachImage ERROR : " + error.text);
				return;
			}else{
				 if(gz_Editor == "1") {
						tbContentElement.HtmlValue = gz_xmlHTTP.responseXML.selectSingleNode("//htmldata").text;
						dhtml_body.value = gz_xmlHTTP.responseXML.selectSingleNode("//htmldata").text;
				 }
			}
		}else{
			alert(gz_xmlHTTP.statusText);
		}
//	}
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
	        elmList = elm.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='approve' or @routetype='receive') ]/ou/(person|role)[taskinfo/@kind!='conveyance']");
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
	            var oApvPOSLines = "<tr><td rowspan='4' width='25' height='110' align='center' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #d9ebf8;' nowrap='f'>주<br/>관<br/>부<br/>서</td>";
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
	                LApvLine.width = 970; //600;
	                RApvLine.width = 970;
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
					AppLine.innerHTML = getRequestApvList(elmList, elmVisible, "", false, elm.getAttribute("ouname"));
	            }
	        }


	    }
		//협조부서/협조자 분리하여 표시 - 현대백화점 //합의출력		
		elmList = elmRoot.selectNodes("(division/step[(@unittype='person' or @unittype='role') and (@routetype='assist' or @routetype='consult')]/ou/(person|role))"); //개인협조
		elmOUList = elmRoot.selectNodes("(division/step[@unittype='ou' and (@routetype='assist' or @routetype='consult')]/ou)"); //부서협조
		elmListCount = elmList.length + elmOUList.length;
		var LastTitle, LastCmt, LastResult;
		var ApvlinesList = "";
		var ApvlinesOUList = "";
		var sPosition = "";
		// 현대백화점 품의일 경우 협조 따로 구성함
		// 협조부서
		if (getInfo("fmpf") == "WF_FORM_DRAFT_HY") {
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
		                    Assist_date1.innerHTML = formatDate(strDate);
		                    break;
		                case 1:
		                    Assist_2.innerHTML = elm.getAttribute("name");
		                    if (strDate == "" && elm.childNodes.length > 1) { Assist_sign2.innerHTML = "진행중" }
		                    else if (strDate != "") {
		                        for (var j = 0; j < elm.childNodes.length; j++) {
		                            var sCode = "";
		                            if (j == elm.childNodes.length - 1) {
		                                var sCode = elm.childNodes[j].getAttribute("code")
		                                elmTaskInfoT = elm.childNodes[j].lastChild;
		                                elmName = elm.childNodes[j].getAttribute("name")
		                                Assist_sign2.innerHTML = getSignUrl(sCode, elmTaskInfoT.getAttribute("customattribute1"), elmName, strDate, false, elmTaskInfoT.getAttribute("result"), "assi");
		                            }
		                        }
		                    }
		                    else { Assist_sign2.innerHTML = ""; } //interpretResult(elmTaskInfo.getAttribute("result")); }
		                    Assist_date2.innerHTML = formatDate(strDate);
		                    break;
		                case 2:
		                    Assist_3.innerHTML = elm.getAttribute("name");
		                    if (strDate == "" && elm.childNodes.length > 1) { Assist_sign3.innerHTML = "진행중" }
		                    else if (strDate != "") {
		                        for (var t = 0; t < elm.childNodes.length; t++) {
		                            var sCode = "";
		                            if (t == elm.childNodes.length - 1) {
		                                var sCode = elm.childNodes[t].getAttribute("code")
		                                elmTaskInfoT = elm.childNodes[t].lastChild;
		                                elmName = elm.childNodes[t].getAttribute("name")
		                                Assist_sign3.innerHTML = getSignUrl(sCode, elmTaskInfoT.getAttribute("customattribute1"), elmName, strDate, false, elmTaskInfoT.getAttribute("result"), "assi");
		                            }
		                        }
		                    }
		                    else { Assist_sign3.innerHTML = ""; } //interpretResult(elmTaskInfo.getAttribute("result")); }
		                    Assist_date3.innerHTML = formatDate(strDate);
		                    break;
		                case 3:
		                    Assist_4.innerHTML = elm.getAttribute("name");
		                    if (strDate == "" && elm.childNodes.length > 1) { Assist_sign4.innerHTML = "진행중" }
		                    else if (strDate != "") {
		                        for (var q = 0; q < elm.childNodes.length; q++) {
		                            var sCode = "";
		                            if (q == elm.childNodes.length - 1) {
		                                var sCode = elm.childNodes[q].getAttribute("code")
		                                elmTaskInfoT = elm.childNodes[q].lastChild;
		                                elmName = elm.childNodes[q].getAttribute("name")
		                                Assist_sign4.innerHTML = getSignUrl(sCode, elmTaskInfoT.getAttribute("customattribute1"), elmName, strDate, false, elmTaskInfoT.getAttribute("result"), "assi");
		                            }
		                        }
		                    }
		                    else { Assist_sign4.innerHTML = ""; } //interpretResult(elmTaskInfo.getAttribute("result")); }
		                    Assist_date4.innerHTML = formatDate(strDate);
		                    break;
		            }
		        }
		    }
		}
		//개인협조
		else if (getInfo("fmpf") == "WF_FORM_HD_DRAFT" || getInfo("fmpf") == "WF_FORM_DRAFT_BHS" || getInfo("fmpf") == "WF_FORM_FG_DRAFT") {
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
		                    Assist_1.innerHTML = ptArr +"/"+ elm.getAttribute("name");
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
		                    Assist_date1.innerHTML = formatDate(strDate);
		                    break;
		                case 1:
		                    var ptArr = elm.getAttribute("position").split(";")[1];
		                    Assist_2.innerHTML = ptArr + "/" + elm.getAttribute("name");
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
		                    Assist_date2.innerHTML = formatDate(strDate);
		                    break;
		                case 2:
		                    var ptArr = elm.getAttribute("position").split(";")[1];
		                    Assist_3.innerHTML = ptArr + "/" + elm.getAttribute("name");
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
		                    Assist_date3.innerHTML = formatDate(strDate);
		                    break;
		                case 3:
		                    var ptArr = elm.getAttribute("position").split(";")[1];
		                    Assist_4.innerHTML = ptArr + "/" + elm.getAttribute("name");
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
		                    Assist_date4.innerHTML = formatDate(strDate);
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
		                        ApvlinesOUList += elmPosition+ " " + elmName + "</td>";
		                        ApvlinesOUList += "<td align='center' style='font-size:8pt;'>" + formatDate(strDate) + "</td>";//debugger
		                        ApvlinesOUList += "<td style='font-size:9pt;'>" + getSignUrl(sCode, elmTaskInfoT.getAttribute("customattribute1"), elmName, strDate, false, elmTaskInfoT.getAttribute("result"), "assi") +"</td></tr>";
		                        //getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true) + "</td></tr>";
		                    }
		                }
		            }
		            //Apvlines += (strDate=="")?"&nbsp;</td>":interpretResult(elmTaskInfo.getAttribute("result"))+"</td>";
		            //ApvlinesOUList += "" + "</td>";
		            //ApvlinesOUList += "<td align='center' style='font-size:8pt;'>" + formatDate(strDate) + "</td>";
		            //ApvlinesOUList += "<td style='font-size:9pt;'>" + interpretResult(elmTaskInfo.getAttribute("result")); //getSignUrl(sCode, elmTaskInfo.getAttribute("customattribute1"), elm.getAttribute("name"), strDate, false, elmTaskInfo.getAttribute("result"), true) + "</td></tr>";
		        }
		    }
		    if (elmList.length != 0) {
		        var strApvNm = "협조자 부서";
//		        if (getInfo("scCAt1") == "1") { strApvNm = "정보보안 담당"; }
//		        else { strApvNm = "협조자"; }
		        ApvlinesList = "<tr><td width='220' style='color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold;'>"+strApvNm+"</td>";
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
		                    LastResult = ((strDate == "") ? "&nbsp;" : formatDate(strDate) + interpretResult(elmTaskInfo.getAttribute("result")));
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
		                    ApvlinesList += "<td align='center' style='font-size:9pt;'>" + ((strDate == "") ? "&nbsp;" : formatDate(strDate)) + "</td>"; //+ interpretResult(elmTaskInfo.getAttribute("result"))
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
//고정결재선 지정 시 사용함
function staticApv() {
    if (getInfo("scCAt1") == "1") {
        m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + parent.menu.APVLIST.value);
        var oCurrentOUNode = m_oApvList.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending' ]");
        m_oXSLProcessor = makeProcessor("../ApvLineMgr/ApvlineGen.xsl");
        var m_objXML = new ActiveXObject("MSXML2.DOMDocument");
        m_objXML.loadXML(getInfo("scCAt1V"));
        insertToList4ApvLine(m_objXML, oCurrentOUNode, "division", "send", "person", "assist", "parallel", "협조", getInfo("mode"));

        parent.menu.APVLIST.value = m_oApvList.documentElement.xml;
        initApvList();
    }
}
//참조자 2008.09
function displayCCInfo(elmRoot){
	var ccInfos = elmRoot.selectNodes("ccinfo");
	var sSendccInfos = "";
	var sRecccInfos = "";
			
	if(ccInfos.length > 0){
		for(var i=0;i<ccInfos.length;i++){
			var sList = "";
			var ccInfo = ccInfos[i];
			var sBelongTo = ccInfo.getAttribute("belongto");
			var ccList = ccInfo.childNodes;
			var cc = ccList.nextNode();
			while(cc!=null){
				if(cc.hasChildNodes())cc=cc.firstChild;
				if(cc.nodeName == "person"){
				    sList += (sList.length > 0 ? ";" : "") + "" + getSplitted(cc.getAttribute("position"), ";", 1) + "/" + cc.getAttribute("name"); //level를 position으로 변경 - 현대백화점//+ cc.getAttribute("ouname")
				}else if(cc.nodeName == "ou"){
					sList+=(sList.length>0?";":"")+cc.getAttribute("name");
				}else if(cc.nodeName == "group"){
					sList+=(sList.length>0?";":"")+cc.getAttribute("name");
				}

				cc = ccList.nextNode();
			}				
			switch(sBelongTo){
				case "global":CC.innerHTML=sList;break;
				case "sender":
				    sSendccInfos += (sSendccInfos.length > 0 ? ";" : "") + sList;
				    try { SendCC.innerHTML = sSendccInfos; } catch (e) { }
				    break;
				case "receiver":
					sRecccInfos+=(sRecccInfos.length>0?";":"")+sList;
					try { RecCC.innerHTML = sRecccInfos; } catch (e) { }
					break;
			}
        }
        var SRccInfos = sSendccInfos + sRecccInfos;
        try {SRCCLine.value = SRccInfos;} catch (e) { }
        var oSRccInfos = SRccInfos.split(";");
        var nSRccInfos = String(oSRccInfos.length - 1);
//        try { idCCLine.value = SRccInfos;
//            if (oSRccInfos.length > 1) {
//                idCCLine.value = oSRccInfos[0] + " 외 " + nSRccInfos;
//                tbRecCC.style.display = ""; TrCCLine.style.display = "";
//            } else { TrCCLine.style.display = "none"; }
//        } catch (e) { }
		//참조자 목록 보이기 처리
		if(sSendccInfos.length+sRecccInfos.length > 0){
		    try { CCLine.style.display = "";} catch (e) { } 
		}else{
			try{CCLine.style.display = "";}catch(e){} 
		}

	}else{
	try { idCCLine.value = ""; SRCCLine.value = "";TrCCLine.style.display = "none"; } catch (e) { } 
	}
}
//참조자,수신자리스트 2006.8.26 이학승
function getRecCCList4CK(){
	//수신자,참조자리스트 2006.8.25 이학승		
    var strflag = false;
    var sItems="<request>";
    var sUrl;
    sUrl = "../Circulation/Circulation_CC_View.aspx?fiid=" + getInfo("fiid") ;     
    sItems+="</request>";
    requestHTTP("POST",sUrl,true,"text/xml; charset=utf-8",receiveHTTP,sItems);
}
function receiveHTTP(){
	var m_oRecLists = new ActiveXObject("MSXML2.DOMDocument");
	var sSendccInfos = "";
	var sRecccInfos = "";
	
	if(m_xmlHTTP.readyState==4){	
		m_xmlHTTP.onreadystatechange=event_noop;
		var xmlReturn=m_xmlHTTP.responseXML;
		if(m_xmlHTTP.responseText==""){
			alert(m_xmlHTTP.responseText);	
		}else{
			var errorNode=xmlReturn.selectSingleNode("response/error");
			if(errorNode!=null){
				alert("Desc: " + errorNode.text);
			}
		}			
	}
}
//협조처 목록 조회
function initRecList(){
  var szReturn='';  
	var aRecDept = RECEIVE_NAMES.value.split("@");
	var sRecDept = aRecDept[0];
	if (parent.menu.chk_secrecy.checked == true && sRecDept != "") {
	    alert("수신부서가 지정된 문서는 보안문서로 설정할 수 없습니다.");
	    return false;
	}
	var Include ="";
	if(sRecDept != null && sRecDept !=''){
		var aRec = sRecDept.split(";");
		for(var i1=0;i1<aRec.length;i1++){			
		    //szReturn += (szReturn!=''?", ":"")+(aRec[i].split(":")[1]);		
		    if(aRec[i1].split(":")[2] == "Y")
		    {
		        Include ="("+parent.menu.gLabel__recinfo_td2+")";
		    }
		    szReturn += (szReturn!=''?", ":"")+(aRec[i1].split(":")[1])+Include;
		    Include ="";
		}
	}
	//협조자 목록 추가 2008-06-19
	sRecDept = aRecDept[1];
	if(sRecDept != null && sRecDept !=''){
		var aRec = sRecDept.split(";");		
		for(var i=0;i<aRec.length;i++){			szReturn += (szReturn!=''?", ":"")+(aRec[i].split(":")[1]);		}
	}
	
	if(szReturn != ''){
//		if(getInfo("fmpf") == "WF_COORDINATION"){
//			szReturn = "<table bordercolor='#111111' width='100%' border='2' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;' cellpadding='0'><tr><td width='20' align='center' bgcolor='#F2F2F2' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>수<br>신<br>부<br>서</td><td style='font-size:9pt; padding-left:8; padding-top:8;' valign='top'>" + szReturn + "</td></tr></table>";
//		}else{
//			szReturn = "<table bordercolor='#111111' width='100%' border='2' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;table-layout:fixed' cellpadding='0'><tr><td width='11%' align='center' bgcolor='#F2F2F2' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>통지부서</td><td style='font-size:9pt; padding-left:8;'>" + szReturn + "</td></tr></table>";
//		}
		return szReturn;
	}else{
		return szReturn;
	}
}
function makeProcessor(urlXsl){
	var oXslDom = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
	oXslDom.async = false;
	if(!oXslDom.load(urlXsl)){
		alertParseError(oXslDom.parseError);
		throw new Error(-1,"couldn't make TemplateProcessor with ["+urlXsl+"].");
	}
	var oXSLTemplate = new ActiveXObject("MSXML2.XSLTemplate");
	oXSLTemplate.stylesheet = oXslDom;
	return oXSLTemplate.createProcessor();
}
function receiveGeneralQuery(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseXML.xml==""){
		}else{
			var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			if(errorNode!=null){
				alert("Desc: " + errorNode.text);
			}else{
							
			}
		}
	}
}
function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	m_xmlHTTP.open(sMethod,sUrl,bAsync);
	m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
	m_xmlHTTP.setRequestHeader("Content-type", sCType);
	if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
}
function event_noop(){return(false);}
function evalXML(sXML){
	if(!m_evalXML.loadXML(sXML)){
		var err = m_evalXML.parseError;
		throw new Error(err.errorCode,"desc:"+err.reason+"\nsrctxt:"+err.srcText+"\nline:"+err.line+"\tcolumn:"+err.linepos);
	}
}
var aryComment = new Array();
function viewComment(idx){
	var rgParams = null;
	rgParams = new Array();
	rgParams["objMessage"] = aryComment[idx];
	var nWidth = 400;
    var nHeight = 400;
    var sFeature = "dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;scrolling:no;help:no;";
    var strNewFearture = ModifyDialogFeature(sFeature);
    var vRetval = window.showModelessDialog("../ApvLineMgr/comment.aspx", rgParams, strNewFearture);
	//var vRetval = window.showModelessDialog("../ApvLineMgr/comment.aspx", rgParams, "dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;scrolling:no;help:no;");
}
function getSplitted(src,delim,idx){var aSrc = src.split(delim);return (aSrc.length>idx?aSrc[idx]:"");}
function toUTF8(szInput){
	var wch,x,uch="",szRet="";
	for (x=0; x<szInput.length; x++) {
		wch=szInput.charCodeAt(x);
		if(!(wch & 0xFF80)) {
			szRet += "%" + wch.toString(16);
		}
		else if(!(wch & 0xF000)) {
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
function InputDocLinks(szValue){
	try{
      if(DOCLINKS.value == "")
      {	
				DOCLINKS.value = szValue;G_displaySpnDocLinkInfo();	
      }
      else
      {	
				adddocitem(szValue);
      }
	}
	catch(e)
	{
	}
}
function G_displaySpnDocLinkInfo(){//수정본
	var szdoclinksinfo = "";
	var szdoclinks="";
	if(getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT")||parent.g_szEditable == true){
		try{szdoclinks = DOCLINKS.value;
		}catch(e){}
	}else{
		try{szdoclinks = DOCLINKS.value;}catch(e){}
        if(szdoclinks==""){
		    var m_objXML=new ActiveXObject("MSXML2.DOMDocument");
		    try{m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>"+getInfo("BODY_CONTEXT")+"</root>");}catch(e){m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>"+getInfo("BODY_CONTEXT")+"</root>");}
		    if(m_objXML.documentElement.selectSingleNode("DOCLINKS") == null)
		    {szdoclinks =""}else{
		        szdoclinks = m_objXML.documentElement.selectSingleNode("DOCLINKS").text;}
		    try{DOCLINKS.value = szdoclinks;}catch(e){}
		    //szdoclinks = m_objXML.documentElement.selectSingleNode("DOCLINKS").text;
		}
	}  
	//DOCLINKS 값에 undefined 가 들어 가서 오류남. 원인 찾기전 임시로 작성
	szdoclinks = szdoclinks.replace("undefined^","");
	szdoclinks = szdoclinks.replace("undefined","");
	if(szdoclinks != ""){	
		var adoclinks = szdoclinks.split("^");
		for(var i=0; i < adoclinks.length ; i ++){
			var adoc = adoclinks[i].split("@@@");
			var aForm = adoc[1].split(";");
			var objXML = new ActiveXObject("MSXML.DOMDocument");
			objXML.loadXML(aForm[0]);
			var pibd1 = aForm[0];
			var piid = aForm[1];
			var bstate = aForm[2];
			var fmid	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('id');
			var fmnm	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('name');
			var fmpf	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('prefix');
			var fmrv	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('revision');
			var scid	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('schemaid');
			var fiid	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('instanceid');
			var fmfn	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('filename');
			var FormUrl = "http://" + document.location.host +"/CoviWeb/approval/forms/form.aspx";
						
			//2006.12.05 by wolf upload UI 변경 : 07. 7. 6. JSI
      //편집 모드인지 확인
      var bEdit = false;
      if(String(window.location).indexOf("_read.htm") > -1){
          bEdit = false
      }else{
          bEdit = true;
      }
			
			if(bEdit) {			
			    if(getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"||  (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT")||parent.g_szEditable == true){
				    szdoclinksinfo +="<input type=checkbox id='chkDoc' name='_" + adoc[0] + "' value='" + adoc[0] + "'>";    				
			    }			    
			    szdoclinksinfo +="<span onmouseover='this.style.color=\"#2f71ba\";' onmouseout='this.style.color=\"#111111\";'  style='cursor:hand;'  onclick=\"window.open('";
			                      szdoclinksinfo += FormUrl+ "?mode=COMPLETE" + "&piid=" + piid  + "&bstate=" + bstate+ "&fmid=" + fmid + "&fmnm=" + toUTF8(fmnm) + "&fmpf=" + fmpf + "&fmrv=" + fmrv + "&fiid=" + fiid+ "&scid=" + scid;
			                      szdoclinksinfo += "','','width=800,height=600') \">" + adoc[2] + "</span>";
			
			} else {
			    szdoclinksinfo +="<span onmouseover='this.style.color=\"#2f71ba\";' onmouseout='this.style.color=\"#111111\";'  style='cursor:hand;'  onclick=\"window.open('";
			                      szdoclinksinfo += FormUrl+ "?mode=COMPLETE" + "&piid=" + piid  + "&bstate=" + bstate+ "&fmid=" + fmid + "&fmnm=" + toUTF8(fmnm) + "&fmpf=" + fmpf + "&fmrv=" + fmrv + "&fiid=" + fiid+ "&scid=" + scid;
			                      szdoclinksinfo += "','','width=800,height=600') \">" + adoc[2] + "</span>";			  
					
				// 연결문서 구분짓기 위한 Comma 추가 : 07. 6. 11. JSI
				if(i < adoclinks.length - 1 ){
				szdoclinksinfo += ", ";}			
			}
		}
		
		// 조건문 추가 : 07. 7. 6. JSI
		if(bEdit) {		
		    if(szdoclinksinfo != "" && (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL"))|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT")||parent.g_szEditable == true){
					szdoclinksinfo +="<a href='#' onclick='deletedocitem();'><font color='#009900'><b>"+parent.menu.gLabel_link_delete+"<b></font></a>"; 
		    }
		}
	}
	DocLinkInfo.innerHTML = szdoclinksinfo;
}
//연결 문서 링크 파트
//문서 관리로 연결 하기 위해 넣어 두었음
function fnDocsView(productid, versionid, folderid)
{    
  var szURL = "/COVINet/COVIDocsNet/WEB/View/";
	szURL+="viewDocument_portal.aspx?productID=" + productid 
	+ "&versionID=" + versionid + "&productType=DOCUMENT&folderID="
	+folderid;
	szURL+="&LinkDocYN=Y"
	document.all['DOC_LINK_VIEW'].src=szURL;
}
function processSelectedRow(piid,bstate,fmid,fmnm,fmpf,fmrv,fiid,scid){	
		var strURL ="Form.aspx?mode=COMPLETE" + "&piid=" + piid  + "&bstate=" + bstate
					+ "&fmid=" + fmid + "&fmnm=" + toUTF8(fmnm)
					+ "&fmpf=" + fmpf + "&fmrv=" + fmrv + "&fiid=" + fiid+ "&scid=" + scid;
		openWindow(strURL,"newMessageWindow",800,600,'resize');
}
function deletedocitem(){
	var adoclinks = DOCLINKS.value.split("^");
	var szdoclinksinfo = "";

	var tmp="" ;
	if(chkDoc.length == null){
		if(chkDoc.checked){
			tmp =  chkDoc.value;
			for(var i=adoclinks.length-1; i >= 0 ; i--){
				if(adoclinks[i]!=null && adoclinks[i].indexOf(tmp) > -1){
					adoclinks[i] = null;
				}
			}
		}
	}else{
		for (var j=chkDoc.length -1; j>=0 ;j--){
			if(chkDoc[j].checked){ 
				tmp =  chkDoc[j].value;
				for(var i=adoclinks.length-1; i >= 0 ; i--){
					if(adoclinks[i]!=null && adoclinks[i].indexOf(tmp) > -1){
						adoclinks[i] = null;
					}
				}
			}
		}
	}
	for(var i=0; i < adoclinks.length ; i++){
		if(adoclinks[i]!=null){
			if(szdoclinksinfo != ""){
				szdoclinksinfo += "^" +adoclinks[i];
			}else{
				szdoclinksinfo += adoclinks[i];
			}
		}
	}
	 DOCLINKS.value = szdoclinksinfo;
	 G_displaySpnDocLinkInfo();
}
function adddocitem(szAddDocLinks){
	var adoclinks = DOCLINKS.value.split("^");
	var aadddoclinks = szAddDocLinks.split("^");
	var szdoclinksinfo = "";

	var tmp="";
	for(var i=0; i < aadddoclinks.length ; i++){
		if(aadddoclinks[i]!=null){
			var bexitdoclinks = false;
			for(var j=0;j<adoclinks.length;j++){if(aadddoclinks[i] == adoclinks[j]){bexitdoclinks = true;}}
			if(!bexitdoclinks) adoclinks[adoclinks.length] = aadddoclinks[i];
		}
	}

	for(var i=0; i < adoclinks.length ; i++){
		if(adoclinks[i]!=null){
			if(szdoclinksinfo != ""){
				szdoclinksinfo += "^" +adoclinks[i];
			}else{
				szdoclinksinfo += adoclinks[i];
			}
		}
	}
	 DOCLINKS.value = szdoclinksinfo;
	 G_displaySpnDocLinkInfo();
}
function setDocLinks(){
	var szdoclinksinfo = "";
	if(DOCLINKS.value != ""){
		var adoclinks = DOCLINKS.value.split("^");
		for(var i=0; i < adoclinks.length ; i ++){
			var adoc = adoclinks[i].split("@@@");
			if(szdoclinksinfo != ""){
				szdoclinksinfo += ",'" +adoc[0]+"'";
			}else{
				szdoclinksinfo += "'" + adoc[0]+"'";
			}
		}		
	}
}
//파일 다운로드 관련 함수 추가
//covidownload컴포넌트 관련
function downloadfile()
{
    var szURL="../FileAttach/download.aspx";
    var strphygicalName="";
    var strlocation=""
    //ATTACH_FILE_INFO에서 업로드 파일 정보를 가져온다
    
    if(document.all['ATTACH_FILE_INFO'].value != ""){		
		var r, res;
		var s =document.all['ATTACH_FILE_INFO'].value;
		
		res = /^^^/i;
		attFiles = s.replace(res, "");
		var m_oFileList = new ActiveXObject("MSXML2.DOMDocument");
		m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+attFiles);
		var elmRoot, elmList, elm, elmTaskInfo;
		elmRoot = m_oFileList.documentElement;
		if(elmRoot != null){
			elmList = elmRoot.selectNodes("fileinfo/file");			
			szAttFileInfo = "";
			for (var i=0; i<elmList.length;i++) 
			{
        elm = elmList.nextNode();
        
        if(elm.getAttribute("location").indexOf("/FrontStorage/")==-1)
        {
            if(elm.getAttribute("state")!="DEL")
            {
								strphygicalName = strphygicalName+ elm.getAttribute("location").substring(elm.getAttribute("location").lastIndexOf("/")+1, elm.getAttribute("location").length)+":"+elm.getAttribute("size") +";";
								strlocation = elm.getAttribute("location").substring(0, elm.getAttribute("location").lastIndexOf("/")+1);
						}
				}
			}			
		}
	}
	//phygicalName 
	//파일명:사이즈; 
	szURL=szURL+"?phygicalName="+escape(strphygicalName);
	//location
	//파일 업로드한 경로 backstorage
	//단 앞에 서버 명은 없음으로download.aspx 에서 처리한다
	szURL=szURL+"&location="+strlocation;
	
	CoviWindow(szURL,'','280','363', 'fix');    
}
//다운로드 관련 창을 띄우기 위해서
//cfl.js에 있는 것과 같다 
//하지만 인클루드가 안되서리 결국 넣어 주었다
function CoviWindow(fileName,windowName,theWidth,theHeight,etcParam) {
	var objNewWin;
	var x = theWidth;
	var y = theHeight;

	var sx = window.screen.width  / 2 - x / 2;
	var sy = window.screen.height / 2 - y / 2 - 40;
	if(etcParam == 'fix') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0";
	}
	else if(etcParam == 'resize') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1";
	}
	else if(etcParam == 'scroll') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1";
	}
	if(sy < 0) {
		sy = 0;
	}
	var sz = ",top=" + sy + ",left=" + sx;
	if(windowName == "newMessageWindow" || windowName == "") {
		windowName = new String(Math.round(Math.random() * 100000));
	}
	var strNewFearture = ModifyWindowFeature(etcParam + ",width=" + x + ",height=" + y + sz);
    objNewWin = window.open(fileName,windowName,strNewFearture);
    //objNewWin = window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}
//양식내 지급결재 처리
function chk_urgent_onclick(){
    try{parent.menu.chk_urgent.checked = CHKREQTYPE.checked;}catch(e){}
    parent.menu.chk_urgent_onclick();
}
//문서번호 발번 시 관련 값 체크
function checkDocNo(bTemp){
    if(!bTemp){
        try{           
            if(FORMNO.value == ""){
                alert("양식 내 서식번호가 없습니다.");
                return false;
            }else if(txtDeptCode.value == ""){
                alert("양식 내 과명이 없습니다.");
                return false;
            }else if(txtDocCode.value == ""){
                alert("양식 내 분류가 없습니다.");
                return false;
            }
            //현해당 조건은 전체 체크 최하순으로 가야함
		
            else if(txtDocCodeDesc!=null)
            {
                if(txtDocCodeDesc.value == ""){
                alert("양식 내 직무가 없습니다.");
                return false;
                }
                else{
                    return true;
                }
            }
            else{
                return true;
            }
        }catch(e){
            alert(e.message)
            return false;
        }
    }
}

//의견 여부 체크 및 링크
function chk_comment_link(user_code, skind){
    var spath = "";
    if(skind == null){
    }else{
        switch (skind){
            case "R": spath = "and @KIND='receive'";break;
            case "charge":spath = "and @KIND='initiator'";break;
            default:spath = "and @KIND!='initiator' and @KIND!='receive'";break;
        }
    }
	if(elmComment.selectSingleNode("//comment_list[@USER_ID='"+user_code+"' "+ spath +"]/@USER_ID")!=null){
		var sUrl = "../Comment/comment_view.aspx?form_inst_id="+getInfo("fiid");		
		return "&nbsp;<font color='red' size='2'>☜</font>";
	}else{
		return "";
	}
}
//내외부 변환 시 수신/참조자 삭제
function deleteRecCCInfos(){
    var sDivision = "";
    if(getInfo("fmpf") == "WF_CUCKOO_DEVELOP"){//부품개발요청서의 경우 처리
        try{sDivision = ((SUSIN_NO.value=="")?"1":String(parseInt(SUSIN_NO.value)+1));}catch(e){}
    }
    var deleteinfo = "<REQUEST><MODE>FORM</MODE><FORM_INST_ID>" +getInfo("fiid") + "</FORM_INST_ID><DIVISION>" + sDivision + "</DIVISION></REQUEST>";
	var xmlhttp = new ActiveXObject("MSXML2.XMLHTTP");
	xmlhttp.open("post","../Circulation/DelMail.aspx",false);
	xmlhttp.setRequestHeader("Accept-Language","ko");
	xmlhttp.setRequestHeader("Content-type", "text/xml");

	xmlhttp.send(deleteinfo);

	if(xmlhttp.responseXML.selectSingleNode("//response").text=="OK") {		
	}else{
		alert(parent.menu.gMessage256); //"일시적인 문제로 인해 삭제가 취소되었습니다."
	}
    try{CCLine.innerHTML = "";}catch(e){}
}
//결재라인 보광 신택상 2007-07-09
function displayApvListCols(oApvList){
   if(getInfo('fmpf') != 'WF_FORM_DRAFT' && getInfo('fmpf') != 'WF_FORM_COORDINATE' && getInfo('fmpf') != 'WF_FORM_MEMO')
   {
        if(document.all.workrequestdisplay != undefined)
        {
            workrequestdisplay.style.display = "none";
        }
   }
    var elmRoot, elmList, elm, elmTaskInfo, elmReceive, ApvList, emlSkip, elmCmtList; // 2006.01.16 elmListR, elmR : 다중수신부서 여부를 알기위한 nodes 변수
	var Apvlines = "";
	var strDate, strFieldName, strwidth, strColTD, LastDate;
	var rtnPOSLine,stepList,TaskInfo, writeTaskInfo , rtnConsentLine, ConsentLine;
	
    elmRoot = oApvList.documentElement;
    if (elmRoot != null){
        //상단 결재선 그리기 Start
        //  결재선 DTD는 <division divisiontype="...."><step></step></division><division divisiontype="...."><step></step></division>로
        //  구성되어있다. 따라서 n개의 divison을 divisiontype에 따라 결재선에 표시하면 된다.
        elmList = elmRoot.selectNodes("division");
        
        for(var i=0; i<elmList.length; i++){
            stepList = elmList.nextNode();
            rtnPOSLine= getApvListCols(stepList);
            TaskInfo =  stepList.getAttribute("divisiontype");
            
            if(getInfo("scPRec") != 0 || getInfo("scDRec") != 0 && getInfo("scIPub") == 0) //신청서
            {
                if(TaskInfo == "send")
                {
                    //신청부서
                    writeTaskInfo = parent.menu.gLabel_reqdept;           
                }
                else if(TaskInfo == "receive")
                {
                    //처리부서
                    writeTaskInfo = parent.menu.gLabel_managedept;       
                
                }
            }
            else if(getInfo("scPRec") == 0 && getInfo("scDRec") == 0 && getInfo("scIPub") != 0)//협조문
            {
                if(TaskInfo == "send")
                {
                    //발의부서
                    writeTaskInfo = parent.menu.gLabel_Propdept;
                }
                else if ( TaskInfo == "receive")
                {
                    //수신부서
                    writeTaskInfo = parent.menu.gLabel_Acceptdept;
                
                }
            }
            else if(getInfo("scPRec") == 0 && getInfo("scDRec") == 0 && getInfo("scIPub") == 0)//일반결재
            {
                writeTaskInfo = parent.menu.gLabel_approver;       
            } 
            
            //개인결재선 적용 버튼 여부
            if(getInfo("scPRec") == 0 && getInfo("scDRec") == 0 && getInfo("scIPub") == 0)//일반결재
            {
                Apvlines +=   "<table><tr>" 
                    +"<td id='displayApv"+i+"' align = 'left' width='190'> "+"<a onclick=\"if(ApvTable"+i+" != '' ){if (eval(ApvTable"+i+").style.display == ''){eval(ApvTable"+i+").style.display ='none';eval(span_ApvTable"+i+").innerHTML = '<img src="+parent.menu.g_imgBasePath+"/COVI/common/btn/btn_up.gif>';}else{eval(ApvTable"+i+").style.display ='';eval(span_ApvTable"+i+").innerHTML = '<img src="+parent.menu.g_imgBasePath+"/COVI/common/btn/btn_down.gif>';}}\" style='cursor:hand;font-size:9pt;'>"
				    + writeTaskInfo + "<span id='span_ApvTable"+i+"' ><img src='"+parent.menu.g_imgBasePath+"/COVI/common/btn/btn_down.gif'></span> "  + " </a>"
				    +"</td>" //결재선				
				    +"<td id='ApvlineButton' style='display:none'>"
				    +"<a onclick=\"if(ApvlineLayer"+i+" != '' ){if (eval(ApvlineLayer"+i+").style.display == ''){eval(ApvlineLayer"+i+").style.display ='none';eval(span_ApvlineLayer"+i+").innerHTML = '<img src="+parent.menu.g_imgBasePath+"/Covi/common/btn/btn_icon_down.gif>';}else{eval(ApvlineLayer"+i+").style.display ='';eval(span_ApvlineLayer"+i+").innerHTML = '<img src="+parent.menu.g_imgBasePath+"/Covi/common/btn/btn_icon_up.gif>';}}\" style='cursor:hand;font-size:9pt;'><span id='span_ApvlineLayer"+i+"' ><img src='"+parent.menu.g_imgBasePath+"/Covi/common/btn/btn_icon_down.gif'></span> "  + " </a>"				  
                    +"</td>"                                        
                    +"</tr></table>"
                    +"<div id='ApvlineLayer"+ i +"' style='display:none; z-index:0; width:88px; position:absolute; height:68px'>"
                    +"<table width='100%' border='0' cellspacing='0' cellpadding='0'>"
                    +"  <tr>"
                    +"      <td>"
                    +"          <table width='400' height='103' border='0' cellpadding='1' cellspacing='1' bgcolor='#7975CA'>"
                    +"              <tr>"
                    +" 				    <td width='400'>" 
                    +"  					<table width='395' height='99' border='0' align='center' cellpadding='0' cellspacing='0' bgcolor='#ffffff'>"
                    +"  						<tr>"
                    +"  							<td  style='padding-top:4px; padding-left:3px'>"
                    +"  								<div align='left' style='line-height:130%'>"  
                    +"                                      <iframe id='iApvLine' name='iApvLine' width='100%' height='100%' frameborder='0' src='PrivateLineList.aspx' datasrc='PrivateLineList.aspx' style='PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px; scrollx:hidden;'></iframe>"
                    +"									</div>"
                    +"								</td>"
                    +" 							</tr>"
                    +" 						</table>"
                    +"					</td>"
                    +"				</tr>"
                    +" 			</table>"
                    +"      </td>"
                    +"  </tr>"
                    +"</table>"	
                    +"</div>"               
				    +"<table  id='ApvTable"+ i +"' border=1  cellpadding=0 cellspacing=1 bordercolor='#dc5f0a' width='100%'  bgcolor='#ffffff' style='font-size:9pt;border-collapse: collapse;'>"
				    +"	<tr >"
				    +"		<td  height='20'  width='4%'  style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + parent.menu.gLabel_no + "</td>" //순  번 
				    +"		<td  height='20'  width='15%' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + parent.menu.gLabel_dept + "</td>" //부서3
				    +"		<td  height='20'  width='21%' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + parent.menu.gLabel_username + "</td>" //성  명4
				    +"		<td  height='20'  width='10%' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + parent.menu.gLabel_jobtitle +"</td>" //직  책5
				    +"		<td  height='20'  width='10%' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + parent.menu.gLabel_kind +"</td>" //종  류
				    +"		<td  height='20'  width='10%' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + parent.menu.gLabel_state + "</td>" //상태2
				    +"		<td  height='20'  width='9%' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + parent.menu.gLabel_approvdate + "</td>" // 결재일자
				    +"		<td  height='20'  width='21%' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + parent.menu.gLabel_oriapprover + "</td>" //	원결재자  				    
				    +"	</tr>"
				    + rtnPOSLine + "</table><br>";
				    
		        }else{
		            Apvlines +=   "<table><tr>" 
                    +"<td id='displayApv"+i+"' align = 'left' width='190'> "+"<a onclick=\"if(ApvTable"+i+" != '' ){if (eval(ApvTable"+i+").style.display == ''){eval(ApvTable"+i+").style.display ='none';eval(span_ApvTable"+i+").innerHTML = '<img src="+parent.menu.g_imgBasePath+"/covi/common/btn/btn_up.gif>';}else{eval(ApvTable"+i+").style.display ='';eval(span_ApvTable"+i+").innerHTML = '<img src="+parent.menu.g_imgBasePath+"/covi/common/btn/btn_down.gif>';}}\" style='cursor:hand;font-size:9pt;'>"
				    + writeTaskInfo + "<span id='span_ApvTable"+i+"' ><img src='"+parent.menu.g_imgBasePath+"/Covi/common/btn/btn_down.gif'></span> "  + " </a>"
				    +"</td>" //결재선                    
                    +"</tr></table>"                           
				    +"<table  id='ApvTable"+ i +"' border=1  cellpadding=0 cellspacing=1 bordercolor='#dc5f0a' width='100%'  bgcolor='#ffffff' style='font-size:9pt;border-collapse: collapse;'>"
				    +"	<tr >"
				    +"		<td  height='20'  width='4%'  style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + parent.menu.gLabel_no + "</td>" //순  번 
				    +"		<td  height='20'  width='15%' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + parent.menu.gLabel_dept + "</td>" //부서3
				    +"		<td  height='20'  width='21%' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + parent.menu.gLabel_username + "</td>" //성  명4
				    +"		<td  height='20'  width='10%' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + parent.menu.gLabel_jobtitle +"</td>" //직  책5
				    +"		<td  height='20'  width='10%' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + parent.menu.gLabel_kind +"</td>" //종  류
				    +"		<td  height='20'  width='10%' style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;' >" + parent.menu.gLabel_state + "</td>" //상태2
				    +"		<td  height='20'  width='9%'  style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + parent.menu.gLabel_approvdate + "</td>" // 결재일자
				    +"		<td  height='20'  width='21%'  style='color: #662800; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #f5ebe1;'>" + parent.menu.gLabel_oriapprover + "</td>" //	원결재자  		
				    +"	</tr>"
				    + rtnPOSLine + "</table><br>";
		        }
				    
            }
            AppLine.innerHTML = Apvlines; // + '<scriptlanguage="javascript" type="text/javascript"><!-- function tdisplayApv(displayId){if(displayId !="" ){if (eval(displayId).style.display == ""){eval(displayId).style.display ="none";eval("span_" + displayId).innerHTML= "▲";}else{eval(displayId).style.display ="";eval("span_" + displayId).innerHTML= "▼";} }   }</script>';
             
			//참조자 출력
			var ccInfos = elmRoot.selectNodes("ccinfo");
			var sSendccInfos = "";
			var sRecccInfos = "";
					
			if(ccInfos.length > 0){
				for(var i=0;i<ccInfos.length;i++){
					var sList = "";
					var ccInfo = ccInfos[i];
					var sBelongTo = ccInfo.getAttribute("belongto");
					var ccList = ccInfo.childNodes;
					var cc = ccList.nextNode();
					while(cc!=null){
						if(cc.hasChildNodes())cc=cc.firstChild;
						if(cc.nodeName == "person"){
							sList+=(sList.length>0?";":"")+cc.getAttribute("ouname")+" "+getSplitted(cc.getAttribute("title"),";",1)+" "+cc.getAttribute("name");
						}else if(cc.nodeName == "ou"){
							sList+=(sList.length>0?";":"")+cc.getAttribute("name");
						}else if(cc.nodeName == "group"){
							sList+=(sList.length>0?";":"")+cc.getAttribute("name");
						}

						cc = ccList.nextNode();
					}				
					switch(sBelongTo){
						case "global":CC.innerHTML=sList;break;
						case "sender":						
							sSendccInfos+=(sSendccInfos.length>0?";":"")+sList;
								SendCC.innerHTML=sSendccInfos;
							break;
						case "receiver":
							sRecccInfos+=(sRecccInfos.length>0?";":"")+sList;
							RecCC.innerHTML=sRecccInfos;	
							break;
					}
				}
		    }     
        }
     
    //개인결재선 적용 버튼 여부
	try{
		if(getInfo("scPRec") == 0 && getInfo("scDRec") == 0 && getInfo("scIPub") == 0)//일반결재
		{
			if(getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"){
				ApvlineButton.style.display= "inline";	
			}else{
				ApvlineButton.style.display="none";
			} 
		}
	}catch(e){}
     //상단 결재선 그리기 End
     
    //배포처 출력
	try{RecLine.innerHTML = initRecList();}catch(e){}
	try{G_displaySpnDocLinkInfo();}catch(e){}
	try{G_displaySpnRejectDocLinkInfo();}catch(e){}
	try{if(getInfo("scPM")=="1") G_displaySpnPMLinkInfo((getInfo("scPMV")==""?null:getInfo("scPMV")));}catch(e){}
    
}
// 협조 출력
function getApvListConsent(oApvStepList)
{   
  var elmRoot, elmList, elm, elmTaskInfo, elmReceive, ApvList, emlSkip, elmCmtList, elmListR, elmR; // 2006.01.16 elmListR, elmR : 다중수신부서 여부를 알기위한 nodes 변수
	var Apvlines = "";
	var strDate, strFieldName, strwidth, strColTD, LastDate;
	
	elmList = oApvStepList.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='consult')]/ou/(person|role)");    
	
	var Apvlines ="";
	var ApvPOSLines="";
	var Apvdecide="";					//2005-12-05 신택상 대결,후열 등을 표시
	var ApvState = "";
	var ApvSignLines="";
	var ApvDept = "";
	var ApvApproveNameLines="";
	var ApvDateLines="";			
	var ApvCmt="";	
	var Cmts = "";
	var sTitle="";
	var elmAudit;
	var OriginApprover = "";
	var nextelm; 
	
	for (var i=0; i<elmList.length;i++) {
		ApvSignLines = "&nbsp;";      //결재자 이름
		ApvCmt = "&nbsp;";            //사용자 코멘트 
		OriginApprover = "&nbsp;";    //원결재자
		sTitle = "&nbsp;";            //직책
		var sCode="";									//사용자 아이디

		elm = elmList.nextNode();
		if(elm == null){ // 더이상 노드가 없으면 빠져나감
			break;
		}
		
        elmTaskInfo = elm.selectSingleNode("taskinfo");
		
		if(elmTaskInfo.getAttribute("visible")!="n")
		{
			if(elmTaskInfo.getAttribute("kind") != 'skip')
			{
				if(elmTaskInfo.getAttribute("kind") == 'charge'){
					try{
						sTitle=elm.getAttribute("title");
						sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
					}catch(e){
						if(elm.nodeName=="role"){
							sTitle=elm.getAttribute("name");
							sTitle=sTitle.substr(sTitle.length-2);
						}
					}
				}else{
					try{
						sTitle=elm.getAttribute("title");
						sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
					}catch(e){
						if(elm.nodeName=="role"){
							sTitle=elm.getAttribute("name");
							sTitle=sTitle.substr(sTitle.length-2);
						}
					}
				}
				strDate = elmTaskInfo.getAttribute("datecompleted");
				if(strDate == null) {
					strDate = "";
					ApvCmt ="";
				}else{
					var assistcmt = elm.selectSingleNode("taskinfo/comment");
					if(assistcmt != null){
					    ApvCmt = assistcmt.text.replace(/\n/g,"<br>");
					}
				}
				
				Apvdecide = parent.menu.gLabel_apv; //"결재"
				if(elm.nodeName=="role")
					try{sCode=elm.selectSingleNode("person").getAttribute("code");}catch(e){}
				else
					sCode=elm.getAttribute("code");
            
				switch( elmTaskInfo.getAttribute("kind")){
					case "consent": 
					    Apvdecide = parent.menu.gLabel_consent; //"합의"
							ApvSignLines += elm.getAttribute("name");
							ApvDept = elm.getAttribute("ouname");
							ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
							ApvDateLines = "";
							ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
							ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;"+ ApvDateLines;
							break;
				}
				//2005-12-05 신택상 결재라인 양식 수정
		
				if(ApvCmt == "" || ApvCmt == "&nbsp;")
				{
				    ApvPOSLines = "<tr><td style='background:#FFFFFF;font-size:9pt;'  height='20'>" + Apvdecide + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;'  height='20'>" + ApvState + "</td>" +  "<td style='background:#FFFFFF;font-size:9pt;'  height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle + "</td><td style='background:#FFFFFF;font-size:9pt;' >" 
				                   + ApvDateLines +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + OriginApprover + "</td></tr>" + ApvPOSLines;
				}
				else
				{
				    ApvPOSLines = "<tr><td style='background:#FFFFFF;font-size:9pt;'  height='20'>" + Apvdecide + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;'  height='20'>" + ApvState + "</td>" +  "<td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" +  "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle + "</td><td style='background:#FFFFFF;font-size:9pt;' >" 
				                   + ApvDateLines +  "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover + "</td></tr>" + "<tr><td style='background:#FFFFFF;font-size:9pt;' align='left' height='20' colspan='7' style='padding-left:10px'> " + ApvCmt + "</td></tr>"+ApvPOSLines;
				}
			}
		}
	}
	return ApvPOSLines;
}
// 결재라인 변경
function getApvListCols(oApvStepList)
{   
    var elmRoot,elmStep, elmList, elm, elmTaskInfo, elmReceive, ApvList, emlSkip, elmCmtList, elmListR, elmR; // 2006.01.16 elmListR, elmR : 다중수신부서 여부를 알기위한 nodes 변수
	var Apvlines = "";
	var strDate, strFieldName, strwidth, strColTD, LastDate;
	elmListSteps = oApvStepList.selectNodes("step[(@routetype='approve' or @routetype='assist' or @routetype='receive' or @routetype= 'consult' or @routetype='audit')]");		
	//elmList = oApvStepList.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='approve' or @routetype='assist' or @routetype='receive' or @routetype= 'consult' or @routetype='audit')]/ou/(person|role)");		
    	
	var Apvlines ="";
	var ApvPOSLines="";
	var Apvdecide="";					//2005-12-05 신택상 대결,후열 등을 표시
	var ApvState = "";
	var ApvSignLines="";
	var ApvDept = "";
	var ApvApproveNameLines="";
	var ApvDateLines="";			
	var ApvCmt="";	
	var Cmts = "";
	var sTitle="";
	var elmAudit;
	var OriginApprover = "";
	var nextelm; 
	var cnt = 1;
	var ApvVisible;
	
	for (var ii=0; ii<elmListSteps.length;ii++) {  
	    ApvSignLines = "&nbsp;";      //결재자 이름
		ApvCmt = "&nbsp;";            //사용자 코멘트 
		OriginApprover = "&nbsp;";    //원결재자
		sTitle = "&nbsp;";            //직책
		sCode="";           //사용자 아이디

		elmStep = elmListSteps.nextNode();
		if(elmStep == null){ // 더이상 노드가 없으면 빠져나감
			break;
		}
		
		elmList = elmStep.selectNodes("ou");    //부서가져오기
	    if(elmStep.getAttribute("unittype") == "ou"){
	        ApvSignLines = "&nbsp;";      //결재자 이름
		    ApvCmt = "&nbsp;";            //사용자 코멘트 
		    OriginApprover = "&nbsp;";    //원결재자
		    sTitle = "&nbsp;";            //직책
		    sCode="";           //사용자 아이디
		    //부서단위처리
	        //if(elm.firstChild.parentNode.parentNode.parentNode.getAttribute("routetype") == "assist"){Apvdecide = parent.menu.gLabel_assist;} //"합 의"
	        ////ApvSignLines += (strDate=="")?elm.getAttribute("name"): getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));
            
            
            //부서일 경우 for문 시작
            for (var ij=0; ij<elmList.length;ij++){
	            elm = elmList.nextNode();
		        if(elm == null){ // 더이상 노드가 없으면 빠져나감
			        break;
		        }
	            elmTaskInfo = elm.selectSingleNode("taskinfo");
	            strDate = elmTaskInfo.getAttribute("datecompleted");
	            if (strDate == null) {
		            strDate = "";ApvCmt ="";
	            }
		        if(elm.parentNode.getAttribute("routetype") == "consult"){Apvdecide = parent.menu.gLabel_DeptConsent;} //"부 서 합 의"
		        if(elm.parentNode.getAttribute("routetype") == "assist"){Apvdecide = parent.menu.gLabel_DeptAssist;} //"개 인 합 의"
		        if(elm.parentNode.getAttribute("routetype") == "audit"){Apvdecide = parent.menu.gLabel_audit;} //"감사"
		        if(elm.parentNode.getAttribute("routetype") == "audit" && elm.parentNode.getAttribute("name") == "부서감사" ){Apvdecide = parent.menu.gLabel_dept_audit;}
		        if(elm.parentNode.getAttribute("name") == "ExtType" ){Apvdecide = parent.menu.gLabel_ExtType;} //"심 의"
	            ApvSignLines += (strDate=="")?"": getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),"",strDate,false,elmTaskInfo.getAttribute("result"),false);
	            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
	            ApvDept = elm.getAttribute("name");
	            ApvDateLines = "";
	            ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
	            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
	            
	            if(strDate == "" && elmTaskInfo.getAttribute("datereceived") != "")
	            {
	                ApvVisible = "T";
	            }else{
	               ApvVisible = "F";
	            }
	            
	            if(ApvCmt == "" || ApvCmt == "&nbsp;")
	            {                   
	                ApvPOSLines = "<tr style='font-family: 굴림, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background:#FFFFFF;font-size:9pt;'>" +cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20' onclick='javascript:deptdisplayApv(\"INDEPT"+ cnt +"\")' >" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle 
	                               +  "<td style='background:#FFFFFF;font-size:9pt;'>" + Apvdecide + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState +  "</td>" +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines +  "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover +  "</td></tr>"+ getInnerApvListCols(elm,ApvVisible,cnt) + ApvPOSLines;
	                cnt++; 
	            }
	            else
	            {                                                                                                                                                               
	                ApvPOSLines = "<tr style='font-family: 굴림, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background:#FFFFFF;font-size:9pt;'>" +cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20' onclick='javascript:deptdisplayApv(\"INDEPT"+ cnt +"\")' >" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle 
	                               +  "<td style='background:#FFFFFF;font-size:9pt;'>" + Apvdecide + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState +  "</td>" +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines +  "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover +  "</td></tr>" + "<tr><td style='background:#FFFFFF;font-size:9pt;' align='left' height='20' colspan='8' style='padding-left:10px'> " + ApvCmt + "</td></tr>"+getInnerApvListCols(elm,ApvVisible,cnt)+ApvPOSLines;
	                cnt++;
	            }
		    }
	        //부서일 경우 for문 끝
		}else if(elmStep.getAttribute("unittype") == "person"){
		
	        elmList = elmStep.selectNodes("ou/(person|role)"); //사람 가져오기
            // 사람일 경우 for 문 시작	
            for (var i=0; i<elmList.length;i++) {
	            ApvSignLines = "&nbsp;";      //결재자 이름
	            ApvCmt = "&nbsp;";            //사용자 코멘트 
	            OriginApprover = "&nbsp;";    //원결재자
	            sTitle = "&nbsp;";            //직책
	            var sCode="";           //사용자 아이디

	            elm = elmList.nextNode();
	            if(elm == null){ // 더이상 노드가 없으면 빠져나감
		            break;
	            }
        		
   	            elmTaskInfo = elm.selectSingleNode("taskinfo");
        		
	            if(elmTaskInfo.getAttribute("visible")!="n")
	            {
		            if(elmTaskInfo.getAttribute("kind") != 'skip')
		            {
			            if(elmTaskInfo.getAttribute("kind") == 'charge'){
				            try{
					            sTitle=elm.getAttribute("title");
					            sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
				            }catch(e){
					            if(elm.nodeName=="role"){
						            sTitle=elm.getAttribute("name");
						            sTitle=sTitle.substr(sTitle.length-2);
					            }
				            }
			            }else{
				            try{
					            sTitle=elm.getAttribute("title");
					            sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
				            }catch(e){
					            if(elm.nodeName=="role"){
						            sTitle=elm.getAttribute("name");
						            sTitle=sTitle.substr(sTitle.length-2);
					            }
				            }
			            }
			            strDate = elmTaskInfo.getAttribute("datecompleted");
			            if (strDate == null) {
				            strDate = "";
				            ApvCmt ="";
			            }else{
				            var assistcmt = elm.selectSingleNode("taskinfo/comment");
				            if (assistcmt != null){
				                ApvCmt = assistcmt.text.replace(/\n/g,"<br>");
				            }
			            }
                        
			            Apvdecide = parent.menu.gLabel_approve; // "결 재"
			            if(elm.nodeName=="role")
				            try{sCode=elm.selectSingleNode("person").getAttribute("code");}catch(e){}
			            else
				            sCode=elm.getAttribute("code");

				        ApvKind = interpretKind(elmTaskInfo.getAttribute("kind"),elmTaskInfo.getAttribute("result"),elm.firstChild.parentNode.parentNode.parentNode.getAttribute("routetype"),elm.firstChild.parentNode.parentNode.parentNode.getAttribute("allottype"),elm.firstChild.parentNode.parentNode.parentNode.getAttribute("name"));
			            switch( elmTaskInfo.getAttribute("kind")){
				            case "authorize":
						            ApvSignLines += elm.getAttribute("name");
						            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
						            ApvDept = elm.getAttribute("ouname"); 
						            ApvDateLines = "";
						            ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
						            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;	
					                LastApv  ="/";
						            LastApvName = elm.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
						            LastDate = formatDate(strDate);
						            //ApvKind = "전결";
						            break;
				            case "substitute":
						            ApvSignLines +=elm.getAttribute("name");
						            ApvDept = elm.getAttribute("ouname"); 
						            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
						            ApvDateLines = "";
						            ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
						            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;										
						            //LastApv = getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));
						            LastApv = getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"),false);
						            LastApvName = elm.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
						            LastDate = formatDate(strDate);
						            //원결재자 가져오기
						            nextelm  = elmList.nextNode();
						            OriginApprover = nextelm.getAttribute("name");
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
						            ApvSignLines +=elm.getAttribute("name")
						            ApvDept = elm.getAttribute("ouname");
						            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
						            ApvDateLines = "";
						            ApvDateLines += (LastDate =="")?parent.menu.gLabel_bypass:LastDate ; //"후열"
						            ApvApproveNameLines += (LastApvName=="")?parent.menu.gLabel_bypass:LastApvName; //"후열"
						            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
						            break; //"후열"
				            case "review": 
						            ApvSignLines +=elm.getAttribute("name");
						            ApvDept = elm.getAttribute("ouname");
						            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
						            ApvDateLines = "";
						            ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
						            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;		
						            break;
				            case "charge": 
						            ApvSignLines += elm.getAttribute("name");
						            ApvDept = elm.getAttribute("ouname");
						            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
						            ApvDateLines = "";
						            ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
						            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;"+ ApvDateLines;
						            break;
				            case "consent": 
						            ApvSignLines += elm.getAttribute("name");
						            ApvDept = elm.getAttribute("ouname");
						            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
						            ApvDateLines = "";
						            ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
						            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;"+ ApvDateLines;
						            break;
				            default :
						            ApvSignLines += (strDate=="")?elm.getAttribute("name"): getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"),false);
						            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
						            ApvDept = elm.getAttribute("ouname");
						            ApvDateLines = "";
						            ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
						            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
			            }
        		
			            if(ApvCmt == "" || ApvCmt == "&nbsp;")
			            {
			                ApvPOSLines = "<tr style='font-family: 굴림, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background:#FFFFFF;font-size:9pt;'>" +cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle 
			                               +  "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState +  "</td>" +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines +  "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover +  "</td></tr>" + ApvPOSLines;
			                cnt++; 
			            }
			            else
			            {
			                ApvPOSLines = "<tr style='font-family: 굴림, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background:#FFFFFF;font-size:9pt;'>" +cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle 
			                               +  "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState +  "</td>" +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines +  "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover +  "</td></tr>" + "<tr><td style='background:#FFFFFF;font-size:9pt;' align='left' height='20' colspan='8' style='padding-left:10px'> " + ApvCmt + "</td></tr>"+ApvPOSLines;
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
function getInnerApvListCols(oApvStepList,DeptState,parentCnt)
{   
    var elmRoot,elmStep, elmList, elm, elmTaskInfo, elmReceive, ApvList, emlSkip, elmCmtList, elmListR, elmR; // 2006.01.16 elmListR, elmR : 다중수신부서 여부를 알기위한 nodes 변수
	var Apvlines = "";
	var strDate, strFieldName, strwidth, strColTD, LastDate;
	elmList = oApvStepList.selectNodes("person");		
	//elmList = oApvStepList.selectNodes("step[(@unittype='person' or @unittype='role') and (@routetype='approve' or @routetype='assist' or @routetype='receive' or @routetype= 'consult' or @routetype='audit')]/ou/(person|role)");		
    	
	var Apvlines ="";
	var ApvPOSLines="";
	var Apvdecide="";					//2005-12-05 신택상 대결,후열 등을 표시
	var ApvState = "";
	var ApvSignLines="";
	var ApvDept = "";
	var ApvApproveNameLines="";
	var ApvDateLines="";			
	var ApvCmt="";	
	var Cmts = "";
	var sTitle="";
	var elmAudit;
	var OriginApprover = "";
	var nextelm; 
	var cnt = 1;
	var sCode = "";
	
	
    // 사람일 경우 for 문 시작	
    for (var i=0; i<elmList.length;i++) {
        ApvSignLines = "&nbsp;";      //결재자 이름
        ApvCmt = "&nbsp;";            //사용자 코멘트 
        OriginApprover = "&nbsp;";    //원결재자
        sTitle = "&nbsp;";            //직책
        sCode="";           //사용자 아이디
        ApvKind = "";

        elm = elmList.nextNode();
        if(elm == null){ // 더이상 노드가 없으면 빠져나감
            break;
        }
		
        elmTaskInfo = elm.selectSingleNode("taskinfo");
		
        if(elmTaskInfo.getAttribute("visible")!="n")
        {
            if(elmTaskInfo.getAttribute("kind") != 'skip')
            {
	            if(elmTaskInfo.getAttribute("kind") == 'charge'){
		            try{
			            sTitle=elm.getAttribute("title");
			            sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
		            }catch(e){
			            if(elm.nodeName=="role"){
				            sTitle=elm.getAttribute("name");
				            sTitle=sTitle.substr(sTitle.length-2);
			            }e
		            }
	            }else{
		            try{
			            sTitle=elm.getAttribute("title");
			            sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
		            }catch(e){
			            if(elm.nodeName=="role"){
				            sTitle=elm.getAttribute("name");
				            sTitle=sTitle.substr(sTitle.length-2);
			            }
		            }
	            }
	            strDate = elmTaskInfo.getAttribute("datecompleted");
	            if (strDate == null) {
		            strDate = "";
		            ApvCmt ="";
	            }else{
		            var assistcmt = elm.selectSingleNode("taskinfo/comment");
		            if (assistcmt != null){
		                ApvCmt = assistcmt.text.replace(/\n/g,"<br>");
		            }
	            }
                
	            Apvdecide = parent.menu.gLabel_approve; // "결 재"
	            if(elm.nodeName=="role")
		            try{sCode=elm.selectSingleNode("person").getAttribute("code");}catch(e){}
	            else
		            sCode=elm.getAttribute("code");
		            ApvKind = interpretKind(elmTaskInfo.getAttribute("kind"),elmTaskInfo.getAttribute("result"),"","",parent.menu.gLabel_approve);

				
	            switch( elmTaskInfo.getAttribute("kind")){
		            case "authorize":
				            //Apvdecide = parent.menu.gLabel_authorize; // "전 결";
				            ApvSignLines += elm.getAttribute("name");
				            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
				            ApvDept = elm.getAttribute("ouname"); 
				            ApvDateLines = "";
				            ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
				            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;	
			                LastApv  ="/";
				            LastApvName = elm.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
				            LastDate = formatDate(strDate);
				            //ApvKind = "전결";
				            break;
		            case "substitute":
				            //Apvdecide = parent.menu.gLabel_substitue; //"대 결";
				            ApvSignLines +=elm.getAttribute("name");
				            ApvDept = elm.getAttribute("ouname"); 
				            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
				            ApvDateLines = "";
				            ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
				            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;										
				            //LastApv = getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));
				            LastApv = getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"),false);
				            LastApvName = elm.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
				            LastDate = formatDate(strDate);
				            //원결재자 가져오기
				            nextelm  = elmList.nextNode();
				            OriginApprover = nextelm.getAttribute("name");
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
				            //Apvdecide = parent.menu.gLabel_bypass; //"후 열"
				            //2006.02.22 by wolf 후열자 이름 넣어주기
				            ApvSignLines +=elm.getAttribute("name")
				            ApvDept = elm.getAttribute("ouname");
				            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
				            ApvDateLines = "";
				            ApvDateLines += (LastDate =="")?parent.menu.gLabel_bypass:LastDate ; //"후열"
				            ApvApproveNameLines += (LastApvName=="")?parent.menu.gLabel_bypass:LastApvName; //"후열"
				            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
				            //ApvKind = "후열";
				            break; //"후열"
		            case "review": 
				            //Apvdecide = parent.menu.gLabel_review; //"후 결"
				            //ApvSignLines += (strDate=="")?parent.menu.gLabel_review: getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result")); // "후결"
				            //ApvSignLines += (strDate=="")?parent.menu.gLabel_review: getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false); // "후결"
				            ApvSignLines +=elm.getAttribute("name");
				            ApvDept = elm.getAttribute("ouname");
				            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
				            ApvDateLines = "";
				            ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
				            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;		
				            //ApvKind = "후결";						
				            break;
		            case "charge": 
				            //Apvdecide = parent.menu.gLabel_apv;  //기안자 //"결 재"
				            ApvSignLines += elm.getAttribute("name");
				            ApvDept = elm.getAttribute("ouname");
				            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
				            ApvDateLines = "";
				            ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
				            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;"+ ApvDateLines;
				            //ApvKind = "담당";
				            break;
		            case "consent": 
				            //Apvdecide = "참조"; 
				            ApvSignLines += elm.getAttribute("name");
				            ApvDept = elm.getAttribute("ouname");
				            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
				            ApvDateLines = "";
				            ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
				            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;"+ ApvDateLines;
				            break;
		            default :
				            //합의
//							if(elm.firstChild.parentNode.parentNode.parentNode.getAttribute("routetype") == "assist")
//							{
//							    // 순차 병렬 따로 설정한다.
//							    switch(elm.firstChild.parentNode.parentNode.parentNode.getAttribute("allottype")){
//					            case "parallel":
//					                Apvdecide = parent.menu.gLabel_ParallelAssist; //병렬
//					            break;
//					            case "serial":
//					                Apvdecide = parent.menu.gLabel_serialAssist;  //순차
//					            break;
//					            default:
//					                Apvdecide = parent.menu.gLabel_assist;
//					            }
//							}
				            //ApvSignLines += (strDate=="")?elm.getAttribute("name"): getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));
				            ApvSignLines += (strDate=="")?elm.getAttribute("name"): getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"),false);
				            ApvState = interpretResult(elmTaskInfo.getAttribute("result"));
				            ApvDept = elm.getAttribute("ouname");
				            ApvDateLines = "";
				            ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
				            ApvApproveNameLines += "&nbsp;&nbsp;&nbsp;&nbsp;" + ApvDateLines;
				            //ApvKind = interpretResult(elmTaskInfo.getAttribute("result"));
	            }
            
		        if(DeptState == "T") //내부결재 진행중에만 보이기
		        {
	                if(ApvCmt == "" || ApvCmt == "&nbsp;")
	                {
	                    ApvPOSLines = "<tr id='INDEPT" + parentCnt + "' style='font-family: 굴림, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background-color:#f5ebe1; color:#142460;'>" + parentCnt + "-" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle 
	                                   +  "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState +  "</td>" +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines +  "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover +  "</td></tr>" + ApvPOSLines;
	                    cnt++; 
	                }
	                else
	                {
	                    ApvPOSLines = "<tr id='INDEPT" + parentCnt + "' style='font-family: 굴림, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;'><td style='background-color:#f5ebe1; color:#142460;'>" + parentCnt + "-" +cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle 
	                                   +  "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState +  "</td>" +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines +  "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover +  "</td></tr>" + "<tr id='INDEPT" + parentCnt + "' ><td style='background:#FFFFFF;font-size:9pt;' align='left' height='20' colspan='8' style='padding-left:10px'> " + ApvCmt + "</td></tr>"+ApvPOSLines;
	                    cnt++;
	                }
	            }else{
	                if(ApvCmt == "" || ApvCmt == "&nbsp;")
	                {
	                    ApvPOSLines = "<tr id='INDEPT" + parentCnt + "' style='font-family: 굴림, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;display:none;'><td style='background-color:#f5ebe1; color:#142460;'>" + parentCnt + "-" + cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle 
	                                   +  "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState +  "</td>" +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines +  "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover +  "</td></tr>" + ApvPOSLines;
	                    cnt++; 
	                }
	                else
	                {
	                    ApvPOSLines = "<tr id='INDEPT" + parentCnt + "' style='font-family: 굴림, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;display:none;'><td style='background-color:#f5ebe1; color:#142460;'>" + parentCnt + "-" +cnt + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvDept + "</td>" + "<td style='background:#FFFFFF;font-size:9pt;' >" + ApvSignLines +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + sTitle 
	                                   +  "<td style='background:#FFFFFF;font-size:9pt;'>" + ApvKind + "</td><td style='background:#FFFFFF;font-size:9pt;' height='20'>" + ApvState +  "</td>" +  "</td><td style='background:#FFFFFF;font-size:9pt;' >" + ApvDateLines +  "</td><td style='background:#FFFFFF;font-size:9pt;'>" + OriginApprover +  "</td></tr>" + "<tr id='INDEPT" + parentCnt + "' style='display:none'  ><td style='background:#FFFFFF;font-size:9pt;' align='left' height='20' colspan='8' style='padding-left:10px'> " + ApvCmt + "</td></tr>"+ApvPOSLines;
	                    cnt++;
	                }
	            }
	            
            }
        }
   }
   //사람일 경우 for문 끝
    
	return ApvPOSLines;
}

function tdisplayApv(displayId)
{
		if(displayId != ""){
			if(eval(displayId).style.display == ""){
					eval(displayId).style.display ="none";
					eval("span_" + displayId).innerHTML = "▲";

			}else{
					eval(displayId).style.display ="";
					eval("span_" + displayId).innerHTML = "▼";
			}
		}
}

/* 문서관리시스템 분류선택창 OPEN 시작 */
function OpenDocClass(){
    if(parent.menu.gDocboxMenu == "T"){
        fnPopUpModal("../../Admin/Approval_Admin/DocboxFolderMgr/DocBoxTreeSelect.aspx",400,380);
    }else{
        fnPopUpModal("../../ExtensionService/Doc/DM_Folder_List.aspx",400,380);
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

function fnPopUpModal(modalUrl,modalWidth,modalHeight)
{
     var ModalStyle = "dialogWidth:" + modalWidth + "px;dialogHeight:"+modalHeight+"px;status=no;scroll=no";
     var strResult;
        try
        { 
            var pWidth = 400;
            var pHeight = 380;
            var options =  'width=' + pWidth;
            options += ' ,height=' + pHeight;
            options += ' ,left=' + (screen.availWidth-pWidth)/2;
            options += ' ,top=' + (screen.availHeight-pHeight)/2;
            options += ' ,scrollbars=no';
            options += ' ,titlebar=no';
            options += ' ,resizable=no';
            options += ' ,Status=no';
            options += ' ,toolbar=no';
            
            var strNewFearture = ModifyWindowFeature(options);
	        strResult = window.open(modalUrl, "",strNewFearture);
	        //strResult = window.open(modalUrl, "", options);
            
            //--기존소스입니다.--          
            //strResult = window.showModalDialog(modalUrl, window,ModalStyle);
        }
        catch(exception)
        {
            alert(exception.description);
        }
        //return strResult;
}
/* 문서관리시스템 분류선택창 끝 */
/*** 업무의뢰 선택 시작 ***/
function OpenWorkRequest(){
    openWindow("../../ExtensionService/Taskmgr/TM_TaskApproval.aspx","workRequest",800,550, "resize");
}
function DelWorkRequest(){
    WORKREQUEST_ID.value ="";
    WORKREQUEST_NAME.value ="";
}

function getTaskID(strTaskID){
    if(strTaskID != ";"){
        WORKREQUEST_ID.value =strTaskID.split(";")[1] ;
        WORKREQUEST_NAME.value =strTaskID.split(";")[0] ;
    }
}
/*** 업무의뢰 선택 끝 ***/

/*** 사업장 쿼리 조회 요청 ***/
function initENTPART(){
	var connectionname = "FORM_DEF_ConnectionString";
    var pXML = "dbo.usp_wfform_regionlist";
    var aXML = "<param><name>ENT_CODE</name><type>varchar</type><length>100</length><value><![CDATA["+getInfo("etid")+"]]></value></param>";
    var sPostBody = "<Items><connectionname>"+connectionname+"</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
    var sTargetURL = "../getXMLQuery.aspx";
	requestHTTP((sPostBody==null?"GET":"POST"),sTargetURL,false,"text/xml",receiveFORMQuery,sPostBody);
    
}
/*** 사업장 쿼리 조회 결과 처리 ***/
function receiveFORMQuery(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseXML.xml==""){
			//alert(m_xmlHTTP.responseText);
		}else{
			var xmlReturn=m_xmlHTTP.responseXML;
		    var elmlist = xmlReturn.selectNodes("response/NewDataSet/Table");
		    var elm;
		    for(var i=0 ; i < elmlist.length ; i++){
		        elm = elmlist.nextNode();
                var oOption = document.createElement("option");
                SEL_ENTPART.options.add(oOption);
                oOption.text=elm.selectSingleNode("NAME").text;
                oOption.value=elm.selectSingleNode("REGION_CODE").text;						        
		    }
		    if((getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE")){
		        if(SEL_ENTPART.value == ""){
    		        SEL_ENTPART.value = getInfo("etid");
		        }
		    }
		    if(elmlist.length > 1){
		        partdisplay.style.display="";
		    }
		}
	}
}
/*** 보안등급 쿼리 조회 결과 처리 ***/
function receiveDocLevelQuery(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseXML.xml==""){
					
		}else{
			var xmlReturn=m_xmlHTTP.responseXML;
		    var elmlist = xmlReturn.selectNodes("response/NewDataSet/Table");
		    var elm;
		    for(var i=0 ; i < elmlist.length ; i++){
		        elm = elmlist.nextNode();
		        
            	makeCBOobject(elm.selectSingleNode("ID_ACLLIST").text,getSplitted(elm.selectSingleNode("NM_ACLLISTNAME").text,"_",1),DOC_LEVEL);
		    }
		    if(getInfo("DOC_LEVEL") == undefined){ 
                DOC_LEVEL.selectedIndex = 0;
                 try{DOC_LEVEL_NAME.value = DOC_LEVEL[0].text}catch(e){}
		    }else{
		        setDefaultCBOobject(getInfo("DOC_LEVEL"), DOC_LEVEL);
		    }
		}
	}
}
//보안등급 선택
function DOC_LEVEL_Change(obj){
    try{DOC_LEVEL_NAME.value = obj[obj.selectedIndex].text}catch(e){}
}
function G_displaySpnRejectDocLinkInfo(){//수정본
	var szdoclinksinfo = "";
	var szdoclinks="";
	if(getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"){
		try{szdoclinks = REJECTDOCLINKS.value;}catch(e){}
	}else{
		try{szdoclinks = REJECTDOCLINKS.value;}catch(e){}
        if(szdoclinks==""){
		    var m_objXML=new ActiveXObject("MSXML2.DOMDocument");
		    try{m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>"+getInfo("BODY_CONTEXT")+"</root>");}catch(e){m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>"+getInfo("BODY_CONTEXT")+"</root>");}
		    szdoclinks = m_objXML.documentElement.selectSingleNode("REJECTDOCLINKS").text;
		}
	}
	//반송함에서 열려진 문서인 경우
	if(parent.menu.m_RejectDocLink != ""){
	    if(szdoclinks.indexOf(parent.menu.m_RejectDocLink) == -1){
	        if(szdoclinks != ""){
	            szdoclinks +="^"+ parent.menu.m_RejectDocLink;
	        }else{
	            szdoclinks = parent.menu.m_RejectDocLink;
	        } 
	        if(getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"){
	            REJECTDOCLINKS.value = szdoclinks;
	        }
	    }
	}
	if(szdoclinks != ""){
		var adoclinks = szdoclinks.split("^");
		for(var i=0; i < adoclinks.length ; i ++){
			var adoc = adoclinks[i].split("@@@");

			var aForm = adoc[1].split(";");
			var objXML = new ActiveXObject("MSXML.DOMDocument");
			objXML.loadXML(aForm[0]);
			var pibd1 = aForm[0];
			var piid = aForm[1];
			var bstate = aForm[2];
			var fmid	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('id');
			var fmnm	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('name');
			var fmpf	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('prefix');
			var fmrv	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('revision');
			var scid	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('schemaid');
			var fiid		= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('instanceid');
			var fmfn	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('filename');
			szdoclinksinfo +="<a style='cursor:hand' onClick=\"processSelectedRow(\'"+piid+"\',\'"+bstate+"\',\'"+fmid+"\',\'"+fmnm+"\',\'"+fmpf+"\',\'"+fmrv+"\',\'"+fiid+"\',\'"+scid+"\')\">" +adoc[3]+"-"+adoc[2] + "</a>&nbsp;&nbsp;";			
		}
	}
	RejectDocLinkInfo.innerHTML = szdoclinksinfo;
}

function setDisplayApvlineLayer(isDisplay) {
	if(isDisplay == 1) {
		ApvlineLayer.style.display= "inline";
	} else if(isDisplay == 2) {
		ApvlineLayer.style.display= "none";
	}
}
//프로세스 메뉴얼 추가

function InputPMLinks(szPMV){
    var szHTML = "";
    if(getInfo("scPM") == "1"){
        G_displaySpnPMLinkInfo(szPMV, (szPMV == null?false:true));
    }
}
function G_displaySpnPMLinkInfo(szPMV, bView){//수정본
	var szdoclinksinfo = "";
	var szdoclinks="";
	if(szPMV != null){
	    szdoclinks = szPMV;
	}else{
	    if(getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT")||parent.g_szEditable == true){
		    try{szdoclinks = PMLINKS.value;}catch(e){}
	    }else{
		    try{szdoclinks = PMLINKS.value;}catch(e){}
            if(szdoclinks==""){
		        var m_objXML=new ActiveXObject("MSXML2.DOMDocument");
		        try{m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>"+getInfo("BODY_CONTEXT")+"</root>");}catch(e){m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>"+getInfo("BODY_CONTEXT")+"</root>");}
		        szdoclinks = m_objXML.documentElement.selectSingleNode("PMLINKS").text;
		    }
	    } 
	} 
	if(szdoclinks != ""){	
		var adoclinks = szdoclinks.split("^");
		for(var i=0; i < adoclinks.length ; i ++){
			var aForm = adoclinks[i].split(";");
			var pmid = aForm[0];
			var pmnm = aForm[1];
			var FormUrl = "http://" + document.location.host +"/CoviBPM/COVIBPMNet/BPD/Common/BPDefiner/ProcessPool/ProcessMapView.aspx?Popup=true&";
			
	        // 편집 모드인지 확인
	        var bEdit = false;
	        if(String(window.location).indexOf("_read.htm") > -1){  bEdit = false}else{ bEdit = true;}
			if(bEdit) {
			    if(getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"||  (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT")||parent.g_szEditable == true){//getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"
			        if(getInfo("scPMV") == ""){
			            szdoclinksinfo +="<input type=checkbox id='chkPM' name='_" + pmid + "' value='" + pmid + "'>";
			        }
			    }
			}
		    szdoclinksinfo +="<span onmouseover='this.style.color=\"#2f71ba\";' onmouseout='this.style.color=\"#111111\";'  style='cursor:hand;'  onclick=\"window.open('";
		                      szdoclinksinfo += FormUrl+ "ProcessID=" + pmid;
		                      szdoclinksinfo += "','','width=800,height=600') \">" + pmnm + "</span>";
			if(i < (adoclinks.length - 1) ){	szdoclinksinfo += ", ";}
		}
		if(bEdit) {
		    if(szdoclinksinfo != "" && (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL"))|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT")||parent.g_szEditable == true){//getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"
			    if(getInfo("scPMV") == ""){szdoclinksinfo +="<a href='#' onclick='deletepmitem();'><font color='#009900'><b>"+parent.menu.gLabel_delete+"<b></font></a>"; }
		    }
		}
	}
	PMLinkInfo.innerHTML = szdoclinksinfo;   
	if(PMLinkInfo.innerHTML != ""){
	    trPMLinkInfo.style.display =""; 
	}
}
function deletepmitem(){
	var adoclinks = PMLINKS.value.split("^");
	var szdoclinksinfo = "";

	var tmp="";
	if(chkPM.length == null){
		if(chkPM.checked ){
			tmp = chkPM.value;
			for(var i=adoclinks.length-1; i >= 0 ; i--){
				if(adoclinks[i]!=null && adoclinks[i].indexOf(tmp) > -1){
					adoclinks[i] = null;
				}
			}
		}
	}else{
		for (var j=chkPM.length -1; j>=0 ;j--){
			if(chkPM[j].checked){ 
				tmp =  chkPM[j].value;
				for(var i=adoclinks.length-1; i >= 0 ; i--){
					if(adoclinks[i]!=null && adoclinks[i].indexOf(tmp) > -1){
						adoclinks[i] = null;
					}
				}
			}
		}
	}
	for(var i=0; i < adoclinks.length ; i++){
		if(adoclinks[i]!=null){
			if(szdoclinksinfo != ""){
				szdoclinksinfo += "^" +adoclinks[i];
			}else{
				szdoclinksinfo += adoclinks[i];
			}
		}
	}
	 PMLINKS.value = szdoclinksinfo;
	 G_displaySpnPMLinkInfo();
}
//양식 이름 옆의 쪼그만 버튼 시작 2008.01
function displayminimenu(obj){
	minimenu(obj, -100, 10, obj.value);
}
function minimenu(f1,diffx,diffy,szvalue){
    x = (document.layers) ? loc.pageX : event.clientX;
    y = (document.layers) ? loc.pageY : event.clientY;
    sH = parseInt(document.body.scrollTop);
    sW = parseInt(document.body.scrollLeft);
	
    minifmmenu.style.pixelTop	= sH+y+diffy;
    minifmmenu.style.pixelLeft	= sW+x+diffx;
    f1.src = (minifmmenu.style.display == "block") ? parent.menu.g_imgBasePath+"/Covi/common/btn/btn_icon_down.gif" : parent.menu.g_imgBasePath+"/Covi/common/btn/btn_icon_up.gif";	
    minifmmenu.style.display = (minifmmenu.style.display == "block") ? "none" : "block";
    if(minifmmenu.style.display == "none"){
        dropForm.style.display = "none"	
    } 
    if(minifmmenu.style.display == "block"){
        var oContextHTML = frmminimenu.document.all["divminemenu_Main"];
        if(oContextHTML != null) {
            oContextHTML.style.display = "";

            var h = oContextHTML.offsetHeight;		       
            var w = oContextHTML.offsetWidth;
            minifmmenu.style.width = w;
            minifmmenu.style.height = h;
        }   
    } 
    if(parent.menu.btReUse.title == "1"){//재사용일 경우 타양식 내용 복사 안보임
        frmminimenu.document.getElementById("dCopy").style.display = "none";
    }    
}
//타양식으로 내용 복사 2008.05 강성채
function copyDiff(diffx, diffy, obj){
    sH = parseInt(document.body.scrollTop);
    sW = parseInt(document.body.scrollLeft);
	
    dropForm.style.pixelTop	= sH+diffy;
    dropForm.style.pixelLeft = sW+diffx; 

    dropForm.style.display = (dropForm.style.display == "block") ? "none" : "block";	
    if(dropForm.style.display == "block"){
        var oContextHTML = nDropForm.document.all["divDifferform"];
        if(oContextHTML != null) {
            oContextHTML.style.display = "";

            var h = oContextHTML.offsetHeight;		       
            var w = oContextHTML.offsetWidth;
            dropForm.style.width = w;
            dropForm.style.height = h;
        }   
    }
}
//양식 이름 옆의 쪼그만 버튼 종료
//양식 이름 셋팅
function initheadname(szfmnm, bContextMenu){
    var szheadname = szfmnm;
    if(parent.frames.item(0).btModify.title == "1"){//편집모드일경우 버튼 안보임
        if(bContextMenu){
            szheadname += '<img src=\"'+parent.menu.g_imgBasePath+'/Covi/common/btn/btn_temp_space.gif" align="abmiddle" alt="" />';//이미지를 뺄경우 디자인이 틀어져서 빈이미지 넣음
        }
    }
    else{
        if(bContextMenu){
            szheadname += '&nbsp;<img src=\"'+parent.menu.g_imgBasePath+'/Covi/common/btn/btn_icon_down.gif" align="abmiddle" alt="" onclick="displayminimenu(this)"/>';
        }
    }
    return szheadname;
}
function setTagFreeBug(){
	if(getInfo("BODY_CONTEXT") != undefined){     //기안,임시저장으로 저장된 값 setting        
       setBodyContext(getInfo("BODY_CONTEXT"));
       try{G_displaySpnDocLinkInfo();}catch(e){}
   }else {//양식 생성 시 입력한 본문내역 조회            
        if(getInfo("fmbd") != "undefined")
        {      
         try{var dom = tbContentElement.getDom();	dom.body.innerHTML= getInfo("fmbd");}catch(e){}
        }
   }    
}
//MS Presence
function getPresence(szpersoncode, szid, szsipaddress){
    var szreturn = ""
    var sType = parent.g_usepresence;
	if(!m_print){
	    if (bPresenceView) {
//	        if (sType == "ocs") {
//	            szreturn = "<span>";
//	            szreturn += "<img src='/GWImages/common/namecontrol_images/unknown.gif'  style='border-width:0px;' align='absmiddle'  covimode='imgctxmenu' onload='";
//	            szreturn += "	PresenceControl(\"" + ((szsipaddress != null) ? szsipaddress : szpersoncode + parent.menu.gMailSuffix) + "\");' id=\"ctl00_ContentPlaceHolder1_GridView1_ctl" + szid + "_presence\" />";
//	            szreturn += "	</span>";
//	        }
//	        else if (sType == "ctx") {
//                szreturn = "<a href='#' onclick='javascript:OpenContextMenu4Approval(this)' class='text02_L'  onmouseout='MM_swapImgRestore()' ";
//                szreturn += "   onmouseover='MM_swapImage(\"Image"+szid+"\",\"\",\"/GWImages/Yellow/Covi/Common/icon/icon_writer_on.gif',1)  person_code='"+szpersoncode+"' >";
//                szreturn += "	<img id='Image"+szid+"' name='Image"+szid+"' src='/GWImages/Yellow/Covi/Common/icon/icon_writer_off.gif' border='0' align='absmiddle' covimode='imgctxmenu'>";
//                szreturn += "	</a>";
//	        }
		}
	}
	return szreturn;
}

var sCommentHtml="";
var bCommentViewFirst = true;
var bgetCommentView = true;

//2007.06 유유미 의견 표시 테스트 입니다.
function getCommentView(elmComment,cnt) {
        //division이 2개이상일 경우 최근 division의 의견으로 초기화되는 현상방지 - 현대백화점
        tdCommentView.innerHTML = "";
        if (cnt == 0) {
            sCommentHtml = "";
        }
            //if (sCommentHtml!="") bCommentViewFirst=false;    // 2008.9.25 by 강효정 이 코드가 들어가면 인쇄버튼 누를 때마다 똑같은 의견이 중복되서 보이게 됨.

        if (bCommentViewFirst && cnt == 0) {
            sCommentHtml+='<table  border="2" bordercolor="#111111" id="com_tbl" cellpadding="0" cellspacing="0" style="border-collapse: collapse;" align="center" width="100%">';
            sCommentHtml +='<tr><td width="15%" height="20" align="center" style="color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #FFFFFF;">결재구분</td>';
            sCommentHtml += '<td width="15%" height="20" align="center" style="color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #FFFFFF;">결재자</td>';
            sCommentHtml += '<td width="15%" height="20" align="center" style="color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #FFFFFF;">결재일시</td>';
            sCommentHtml += '<td width="55%" height="20" align="center" style="color: #111111; font-family: 굴림, Dotum;font-size: 12px; font-weight: bold; background: #FFFFFF;">결재의견</td></tr>';
        }
        var elm,sGubun;
        var assistcmt,sJobTitle,sJobPosition,sResult1,sResult2;
        for(var i=0; i<elmComment.length; i++)
        {  
            sCommentHtml +='<tr align="center">';
            elm= elmComment.nextNode();
            
            sJobTitle = elm.parentNode.parentNode.getAttribute("title").split(";");
	        sJobPosition = elm.parentNode.parentNode.getAttribute("position").split(";");
	        
	        sGubun=elm.parentNode.parentNode.parentNode.parentNode;
	        if (sJobPosition != "") {
	            sViewJob = sJobPosition[1];
	        } else {
	            if (sJobTitle == "") {
	                sViewJob = sJobPosition[1];
	            } else {
	                sViewJob = sJobTitle[1];
	            }
	        }
	        
	        //결재유형1
	        if (sGubun.getAttribute("unittype") == "person" && sGubun.getAttribute("routetype") != "consult" && sGubun.getAttribute("allottype") == "parallel" )
	        {
	            sResult1="동시결재";
	        }
	        else if (sGubun.getAttribute("unittype") == "ou" && sGubun.getAttribute("routetype") == "assist")
	        {
	            sResult1="협조부서";
	        }else
	        {
	            sResult1=sGubun.getAttribute("name");
	        }
	        
	        //결재유형2
	        if (sGubun.getAttribute("routetype")=="assist" && sGubun.getAttribute("unittype")=="person" )
	        {
	            sResult2=elm.parentNode.getAttribute("result");
	        }else if (sGubun.getAttribute("routetype")=="assist" && elm.parentNode.getAttribute("result") =="" )
	        {
	            sResult2=elm.parentNode.parentNode.parentNode.selectSingleNode("taskinfo").getAttribute("result");
	        }else
	        {
	            sResult2=elm.parentNode.getAttribute("status");
	        }	        
	        switch(sResult2)
	        {
	            case "rejected" : sResult2 ="반송"; break;
	            case "completed" : sResult2 ="승인"; break;
	            case "reserved" : sResult2 ="보류"; break;
	            case "agreed" : sResult2 ="합의"; break;
	            case "disagreed" : sResult2 ="이견"; break;	   
	            case "none" : sResult2 ="대상아님"; break;	   
	            default : sResult2 = sResult2; break;
	        }
	        
            assistcmt = elm.text.replace(/\n/g,"<br>");
            sCommentHtml += '<td style="font-size: 9pt;font-family: "굴림", Dotum; padding-left: 10px;">'+ sResult1 +'('+sResult2+')</td>';
            sCommentHtml += '<td style="font-size: 9pt;font-family: "굴림", Dotum; padding-left: 3px;">' + sViewJob + '/' + elm.parentNode.parentNode.getAttribute("name") + '</td>'; //+elm.parentNode.parentNode.getAttribute("ouname") +'/'+elm.parentNode.parentNode.getAttribute("name") +'/'+ sViewJob+'</td>';
            //sCommentHtml += '<td style="font-size: 9pt;padding-left: 3px;">'+ formatDate2(elm.getAttribute("datecommented")) +'</td>';
            sCommentHtml += '<td style="font-size: 9pt;font-family: "굴림", Dotum; padding-left: 3px;">'+ formatDate(elm.parentNode.getAttribute("datecompleted")) +'</td>';
            sCommentHtml += '<td align="left" style="font-size: 9pt;font-family: "굴림", Dotum; padding-left: 13px;">' + assistcmt + '</td>';               
            sCommentHtml +='</tr>';
        }
        tdCommentView.style.display = "none";
        tdCommentView.innerHTML=sCommentHtml + '</table>';
}
function formatDate2(sDate){			
	if(sDate==null || sDate=="")
		return " ";
	var dtDate = new Date(sDate.replace(/-/g,"/").replace(/오후/,"pm").replace(/오전/,"am"));
	return dtDate.getYear()+"-"+dblDigit(dtDate.getMonth()+1)+"-"+dblDigit(dtDate.getDate())+" "+dblDigit(dtDate.getHours())+":"+dblDigit(dtDate.getMinutes());//+":"+dblDigit(dtDate.getSeconds());
}
function G_displaySpnAttInfo_Mail(){//수정본
	var attFiles, fileLoc, szAttFileInfo ;
	var displayFileName;		
	var re = /_N_/g;
	
	szAttFileInfo = "";
	MultiDownLoadString = "";

	if (document.all['ATTACH_FILE_INFO'].value != ""){		
		var r, res;
		var s =document.all['ATTACH_FILE_INFO'].value;
		res = /^^^/i;
		attFiles = s.replace(res, "");
		
		var fState;
		var m_oFileList = new ActiveXObject("MSXML2.DOMDocument");
		m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+attFiles);
		var elmRoot, elmList, elm, elmTaskInfo;
		elmRoot = m_oFileList.documentElement;
		if (elmRoot != null){
			elmList = elmRoot.selectNodes("fileinfo/file");			
			
			// 변경부분 : 07. 6. 11. JSI
			szAttFileInfo = "&nbsp;&nbsp;";
			
			for (var i=0; i<elmList.length;i++) {
				elm = elmList.nextNode();
				var filename = elm.getAttribute("name");
				var filesize = elm.getAttribute("size");
                var limitSize = parent.menu.FormatStringToNumber(parseInt(filesize) / 1024) ;
//     parent.download.location.href ='/Common/CoviUpload/covi_fileSingledown.aspx?usercode='+parent.getInfo("usid")+"&filepath=" + SingleDownLoadString ;
                        					
				displayFileName = elm.getAttribute("name").substring(0, elm.getAttribute("name").lastIndexOf(".")) ;
				displayFileName = displayFileName.replace(re,"&");
				//////////////////////////////////////////////////////////////////////////////
				if (elm.getAttribute("location").indexOf(".") > -1 ){
//			        szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) 
//			        + "&nbsp;<a href=\"/COVIPortalNet/OutLookDummy.aspx?hhdFrom=outlook&hhdBiz=APV&hhdRtUrl="+escape("/COVIFlowNet/Forms/LegacyFileDownLoad.aspx?usercode="+getInfo("usid")+"&filepath="+elm.getAttribute("location").replace("+","%2B")) +":"+filesize+ "\"  target='WRPOPAPVMAIL' ><b>" + elm.getAttribute("name") 
//			        + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
//debugger
//			        szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) 
//			        + "&nbsp;<a href=\"/COVIPortalNet/OutLookDummy.aspx?hhdFrom=outlook&hhdBiz=APV&hhdRtUrl="+escape("/Common/CoviUpload/covi_fileSingledown_Mail.aspx?usercode="+getInfo("usid")+"&filepath="+elm.getAttribute("location").replace(new RegExp( "\\+", "g" ),"%2B")) +":"+filesize+"&fmpf="+parent.editor.getInfo("fmpf")+ "\"  target='WRPOPAPVMAIL' ><b>" + elm.getAttribute("name") 
//			        + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
				    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
				    + "&nbsp;<a href=\""+elm.getAttribute("location").replace(new RegExp("\\+", "g"))+"\"><b>"+ elm.getAttribute("name") +"</b></a>&nbsp;";                   
				}
				//////////////////////////////////////////////////////////////////////////////
				
				if (i < elmList.length - 1)
					szAttFileInfo += ", ";
			}
		}
		AttFileInfo.innerHTML = szAttFileInfo;
	}
}
function G_displaySpnDocLinkInfo_Mail(){//메일 보내기(문서첨부링크 만들기)
	var szdoclinksinfo = "";
	var szdoclinks="";
	if (  getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" ){
			try{szdoclinks = DOCLINKS.value;}catch(e){}
	}else{
		try{szdoclinks = DOCLINKS.value;}catch(e){}
        if(szdoclinks==""){
		    var m_objXML=new ActiveXObject("MSXML2.DOMDocument");
		    try{m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>"+getInfo("BODY_CONTEXT")+"</root>");}catch(e){m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>"+getInfo("BODY_CONTEXT")+"</root>");}
		    if(m_objXML.documentElement.selectSingleNode("DOCLINKS") == null)
		    {szdoclinks =""}else{
		        szdoclinks = m_objXML.documentElement.selectSingleNode("DOCLINKS").text;}
		    try{DOCLINKS.value = szdoclinks;}catch(e){}
		}
	}  
	//2007.08 유유미 : DOCLINKS 값에 undefined 가 들어 가서 오류남. 원인 찾기전 임시로 작성
	//szdoclinks = szdoclinks.replace("undefined^","");
	//szdoclinks = szdoclinks.replace("undefined","");
	if ( szdoclinks != ""){	
		var adoclinks = szdoclinks.split("^");
		szdoclinksinfo = "&nbsp;&nbsp;";
		for(var i=0; i < adoclinks.length ; i ++){
			var adoc = adoclinks[i].split("@@@");
			var aForm = adoc[1].split(";");
			var objXML = new ActiveXObject("MSXML.DOMDocument");
			objXML.loadXML(aForm[0]);
			if ( objXML.xml != ""){
			    var pibd1 = aForm[0];
			    var piid = aForm[1];
			    var bstate = aForm[2];
			    var fmid	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('id');
			    var fmnm	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('name');
			    var fmpf	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('prefix');
			    var fmrv	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('revision');
			    var scid	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('schemaid');
			    var fiid	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('instanceid');
			    var fmfn	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('filename');
    			
			    //2006.12.05 by wolf upload UI 변경 : 07. 7. 6. JSI
	            // 편집 모드인지 확인
	            var bEdit = false;
	            if(String(window.location).indexOf("_read.htm") > -1){
	                bEdit = false
	            }else{
	                bEdit = true;
	            }
    			
			    if (bEdit) {
    			
			        if (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"||  (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT")||parent.g_szEditable == true){//getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"
				        szdoclinksinfo +="<input type=checkbox id='chkDoc' name='_" + adoc[0] + "' value='" + adoc[0] + "'>";
        				
			        }
			        szdoclinksinfo +="<img height='14' src='/common/images/COVIPortalNet/i_clip.gif' width='7' align='absmiddle' />&nbsp;<a style='cursor:hand' href='"+processSelectedRow_Mail(piid, bstate, fmid, fmnm, fmpf, fmrv,fiid,scid)+"' target='_blank'><b>" +adoc[2] + "</b></a>&nbsp;&nbsp;";
    			
			    } else {
			        szdoclinksinfo +="<img height='14' src='/common/images/COVIPortalNet/i_clip.gif' width='7' align='absmiddle' />&nbsp;<a href='"+processSelectedRow_Mail(piid, bstate, fmid, fmnm, fmpf, fmrv,fiid,scid)+"' target='_blank'><b>" +adoc[2] + "</b></a>&nbsp;&nbsp;";
    			
			        // 연결문서 구분짓기 위한 Comma 추가 : 07. 6. 11. JSI
			        if (i < adoclinks.length - 1 ){szdoclinksinfo += ", ";}
			    }
			}
		}
		
		// 조건문 추가 : 07. 7. 6. JSI
		if (bEdit) {
		
		    if (szdoclinksinfo != "" && (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBAPPROVAL"))|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "PCONSULT")|| (getInfo("loct") == "APPROVAL" && getInfo("mode") == "SUBREDRAFT")||parent.g_szEditable == true){//getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"

			    szdoclinksinfo +="<a href='#' onclick='deletedocitem();'><img src='/GWImages/Common/attachicon/del.gif' border='0' style='vertical-align:middle;' /></a>"; 
		    }
		}
	}
	DocLinkInfo.innerHTML = szdoclinksinfo;
	try{
        parent.fileview.DocLinkInfo.innerHTML = szdoclinksinfo; 
	    if(String(window.location).indexOf("_read.htm") > -1){ //조회페이지 일때만 첨부파일 영역 활성화
		    var eTR = DocLinkInfo.parentElement;
            while(eTR.tagName != "TABLE"){
	            eTR = eTR.parentElement;
            }
	        if(bFileView){
	            eTR.style.display = "none";
	        }else{
	            eTR.style.display = "";
	        }
	        parent.main.rows = "40,*,80,0";
	    }else{
		    var eTR = DocLinkInfo.parentElement;
            while(eTR.tagName != "TABLE"){
	            eTR = eTR.parentElement;
            }
            eTR.style.display = "";
	        parent.main.rows = "40,*,0,0";
	    }
	}catch(e){}
}