var m_xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP");
var m_evalXML = new ActiveXObject("MSXML2.DOMDocument");
var g_szAcceptLang  = "ko";
var m_cvtXML = new ActiveXObject("MSXML2.DOMDocument").createTextNode("");
var m_oApvList = new ActiveXObject("MSXML2.DOMDocument");
var m_oRecList = new ActiveXObject("MSXML2.DOMDocument");
var sReceiveNo = "";
var g_BaseImgURL = "/covinet/BackStorage/e-sign/ApprovalSign/";
var g_BaseFormURL = "/covinet/BackStorage/e-sign/ApprovalForm/";
var g_BaseSender = "(주) 코 비 젼";
var g_BaseHeader = '"고객과 미래를 함께 합니다"';
var g_BaseORGNAME = '(주) 코 비 젼';

//var m_KMWebAttURL='http://172.20.2.152/KPlusWebMaeil/Medison/Cabinet/KnowledgeDetail.aspx?oid=';

function getInfo(sKey){try{return parent.g_dicFormInfo.item(sKey);}catch(e){alert("양식정보에 없는 키값["+sKey+"]입니다.");}}
function setInfo(sKey,sValue){
	try{	
		if(parent.g_dicFormInfo.Exists(sKey))	parent.g_dicFormInfo.Remove(sKey);
		parent.g_dicFormInfo.Add(sKey,sValue);
	}catch(e){alert("양식정보에 없는 키값["+sKey+"]입니다.");}
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
	
	//function getBodyContext(){if (getInfo("mode")=="DRAFT"){return makeNode("BODY_CONTEXT",tbContentElement.DocumentHTML,null,true);}}
	
	//alert("formedit.js(sXML):"+sXML);
	return "<formdata>" + sXML + "</formdata>";
}
function getChangeFormXML(){

	var sXML="";	
	sXML = getBodyContext(); //sXML+=makeNode("BODY_CONTEXT",GetBody(),null,false); 	
	//common fields( ex)cField, mField를 제외한 dField 화면에 보이지 않는 값)
	for(var i=0;i<dField.length;i++){
		if ( dField[i].value != getInfo(dField[i].name)){ sXML+=makeNode(dField[i].name);	}
	}
		
	if ((parent.menu.field["bLASTAPPROVER"].value ==  'true' && getInfo("scDNum")=='1') || (getInfo("mode") == "SIGN")){ //최종결재자 문서정보 넘길것
		//sXML+= makeNode("DOC_NO") + makeNode("INITIATOR_OU_ID") + makeNode("DOC_OU_NAME") + makeNode("DOC_CLASS_ID");
		//try{sXML+= makeNode("DOC_NO") + makeNode("INITIATOR_OU_ID") + makeNode("DOC_OU_NAME");}catch(e){}
	}

	//body_context & specfic fields	
	//receive no process//
	if ((getInfo("mode") == "REDRAFT") && (parent.menu.getHasReceiveno() == "true")){
	 sXML+= makeNode("RECEIVE_NO");
		if (sXML.indexOf("INITIATOR_OU_ID") == -1 ) sXML+=makeNode("INITIATOR_OU_ID"); 
	} 
	//last modifier info
	if (sXML!=""){	return "<LAST_MODIFIER_ID>"+getInfo("usid")+"</LAST_MODIFIER_ID><formdata>" + sXML + "</formdata>";}else{return "<formdata>" + sXML + "</formdata>";}
}
/*doc info - final approver, charge,  uses*/
function getDocFormXML(){
	var sXML="";
	if ((getInfo("fmpf") =='DRAFT') || (getInfo("fmpf") =='OUTERPUBLISH')||(getInfo("fmpf") =='OFFICIAL_DOCUMENT')||(getInfo("fmpf") =='DRAFT03') ){
		if ((parent.menu.field["bLASTAPPROVER"].value ==  'true') || (getInfo("mode") == "SIGN")){ //최종결재자 문서정보 넘길것
			sXML+= makeNode("DOC_NO") + makeNode("INITIATOR_OU_ID") + makeNode("DOC_OU_NAME") + makeNode("DOC_CLASS_ID") + makeNode("APPLIED");
		}
	}else{
		if ((parent.menu.field["bLASTAPPROVER"].value ==  'true')){ //최종결재자 문서정보 넘길것
			sXML+= makeNode("DOC_NO","0000") + makeNode("INITIATOR_OU_ID") + makeNode("DOC_OU_NAME",getInfo("INITIATOR_OU_NAME")) + makeNode("DOC_CLASS_ID","0000") + makeNode("APPLIED","2004.05.18");
		}
	}
	if ((getInfo("mode") == "REDRAFT") && (parent.menu.getHasReceiveno() == "true")) sXML+= makeNode("RECEIVE_NO") +  makeNode("INITIATOR_OU_ID"); 
	if (sXML!=""){	return "<LAST_MODIFIER_ID>"+getInfo("usid")+"</LAST_MODIFIER_ID><formdata>" + sXML + "</formdata>";}else{return "<formdata>" + sXML + "</formdata>";}
}
function initApvList(){
	m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + parent.menu.field["APVLIST"].value);	
	setInlineApvList(m_oApvList);
}
function setInlineApvList(oApvList){displayApvList(oApvList);}
function setInlineRecList(oApvList){draftRecList(oApvList);}
//default html apv list display : #1 Approver Line, #1Assit person Line
function draftHTMLApvList(oApvList){
	var elmRoot, elmList, elm, elmTaskInfo;
	var strDate, strFieldName;
	elmRoot = oApvList.documentElement;
	if ( elmRoot != null){
		elmList = elmRoot.selectNodes("division/step[@unittype='person' and @routetype='approve']/ou/person");
		var Apvlines ="";
		if (getInfo("mode")=="DRAFT" || getInfo("mode")=="TEMPSAVE" ){
			Apvlines +="<tr class=editing ><td width='50%' align='center'>기안자</td><td align='center'  bgcolor='#ffffff'>"+getInfo("usdn")+"</td><td></td><tr>";;
		}
		for (var i=0; i<elmList.length;i++) {
			elm = elmList.nextNode();
			elmTaskInfo = elm.selectSingleNode("taskinfo");
			ApvlinsDown = "<tr class=editing ><td width='40%' align='center'>" + elm.getAttribute("title").substring(elm.getAttribute("title").lastIndexOf(";")+1) + "</td>";
			
			strDate = elmTaskInfo.getAttribute("datecompleted");
			if (strDate == null) {strDate = "";}

			ApvlinsDown += "<td  width='40%' align='center' bgcolor='#ffffff'>";
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
						ApvlinsDown += (strDate=="")?elm.getAttribute("name"): getSignUrl(elm.getAttribute("code"),"stamp",elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));break;
				default :
						ApvlinsDown += (strDate=="")?elm.getAttribute("name"): getSignUrl(elm.getAttribute("code"),elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));
			}
			
			ApvlinsDown += "</td><td  width='20%' align='center'>"+formatDate(strDate)+"</td><tr>";
			Apvlines = ApvlinsDown +Apvlines ;
		}
		Apvlines = "<table  cellpadding='0' cellspacing='0' width='100%' height='100%' border='1'  style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;'>" + Apvlines + "</table>";
		AppLine.innerHTML = Apvlines;
		

		//협조
		elmList = elmRoot.selectNodes("division/step[@unittype='person' and @routetype='assist']/ou/person"); //개인협조??
		if (elmList.length!=0){
			Apvlines = "";
			for (var i=0; i<elmList.length;i++) {
				elm = elmList.nextNode();
				elmTaskInfo = elm.selectSingleNode("taskinfo");
				strDate = elmTaskInfo.getAttribute("datecompleted");
				if (strDate == null) {strDate = "";}
				//Apvlines +=elm.getAttribute("ouname") + elm.getAttribute("title").substring(elm.getAttribute("title").lastIndexOf(";")+1) +"<br>";
				Apvlines +="<tr><td width='45%' align='center'>"+elm.getAttribute("ouname") +"</td><td width='35%' align='center'>" + getSignUrl(elm.getAttribute("code"),elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false) + "</td><td  width='20%' align='center'>"+formatDate(strDate)+"</td><tr>"
			}
			Apvlines = "<table cellpadding='0' cellspacing='0' width='100%' border='1' style='border-collapse: collapse;height:100%;'>" + Apvlines + "</table>";
			AssistLine.innerHTML = Apvlines;
		}
	}
}
function getSignUrl(apvid,signtype,apvname,sDate,bDisplayDate,sResult){//dhtml body type 인장표현
	var rtn="";
	if (sDate != ""){
		if (signtype != "" ){
			if (signtype=="stamp"){
				rtn= "<img src='"+g_BaseImgURL+"sign_"+apvid+"_0.jpg' border=0 style='width:50px;height:50px'>";
				// 원본 소스
				// rtn= "<img src='"+g_BaseImgURL+"sign_"+apvid+"_0.jpg' border=0 style='width:30px;height:30px'>";
				//rtn= "<img src='"+g_BaseImgURL+signtype+"_"+apvid+"_0.jpg' border=0 style='width:30px;height:30px'>";
			}
			else if(sResult != 'agreed'){					
					rtn= "<img src='"+g_BaseImgURL+signtype+"' border=0 style='width:30px;height:30px'>";
				}
			else{
				if (sResult != 'rejected'){
					//rtn= "<img src='"+g_BaseImgURL+"sign_"+apvid+"_0.jpg' border=0 style='width:30px;height:30px'>";
					// 원본 소스
					// rtn= "<img src='"+g_BaseImgURL+signtype+"' border=0 style='width:30px;height:30px'>";
					rtn= "<img src='"+g_BaseImgURL+signtype+"' border=0 style='width:50px;height:50px'>";
				}
			}
		}else{	rtn = (bDisplayDate==false)?apvname:apvname+'<br>'+ formatDate(sDate);}
		return rtn;
	}else{	return rtn;	}
}
function interpretResult(strresult){
	var sKind = "";
	if (strresult=="rejected") {	sKind="반려";	}
	if (strresult=="agreed") {	sKind="합의";	}
	if (strresult=="disagreed") {	sKind="이의";	}
	return sKind;
}
function interpretKind(strkind, strresult) {
	var sKind;
    switch(strkind) {
        case "normal":		sKind = "";break;
        case "charge":		sKind = "담당";break;
        case "authorize":	sKind = "전결";break;
        case "review":		sKind = "후결";break;
	case "consent":		sKind = "";break;
        case "substitute":	sKind = "대결";break; //"대결"
        case "bypass":		sKind = "";break; //"후열"
        case "confirm":		sKind = "확인";break;
        case "skip":		sKind = "--";break;
    }
	if ((strresult=="rejected") && (strkind!="normal")){
		sKind=sKind+((getInfo("fmbt") == "HWP")?" 반려":"<br>반려");
	}else if ((strresult=="rejected") && (strkind=="normal")){
		sKind="반려";
	}
	return sKind;
}
function formatDate(tDate, sMode){
	if (sMode == "R"){
		var aRecDate = tDate.split("-");
		if ( aRecDate.length >2 ){return aRecDate[0] + "년  " + aRecDate[1] + "월 " + aRecDate[2].substring(0,2) + "일";}else{return "";}
	}else if (sMode == "D"){
		var aRecDate = tDate.split("-");
		if ( aRecDate.length >2 ){return aRecDate[0] + "-" + aRecDate[1] + "-" + aRecDate[2].substring(0,2);}else{return "";}
	}else if (sMode == "Y"){
		var aRecDate = tDate.split(".");
		if ( aRecDate.length >2 ){return aRecDate[0] + "년  " + aRecDate[1] + "월 " + aRecDate[2] + "일";}else{return "";}
	}else if (sMode == "A"){
		var aRecDate = tDate.split("-");
		if ( aRecDate.length >2 ){
			var szDate = aRecDate[0] + "-" + aRecDate[1] + "-" + aRecDate[2].substring(0,2)+ " ";
			var aTime = tDate.substring(tDate.lastIndexOf(" ")+1,tDate.length).split(":");
			if (tDate.indexOf("오후") > -1){
				szDate += String( 12 + parseInt(aTime[0]) ) + ":" + aTime[1];
			}else{
				szDate += aTime[0] + ":" + aTime[1];
			}
			return  szDate;
		}else{return "";}
	}
	/*else if (sMode == "M"){
		var aRecDate = tDate.split("-");
		if ( aRecDate.length >2 ){
			var szDate = aRecDate[0] + "년  " + aRecDate[1] + "월  " + aRecDate[2].substring(0,2)+ "일  ";
			var aTime = tDate.substring(tDate.lastIndexOf(" ")+1,tDate.length).split(":");
			if (tDate.indexOf("오후") > -1){
				szDate += String( 12 + parseInt(aTime[0]) ) + "시  " + aTime[1] + "분";
			}else{
				szDate += aTime[0] + "시  " + aTime[1] + "분";
			}
			return  szDate;
		}else{return "";}
	}*/else{
		if (tDate=="" || tDate == undefined){return "";}
		return tDate.substring(5,7) + '/' + tDate.substring(8,10) ;
	}
}
function G_displaySpnAttInfo(bRead){//수정본
	var attFiles, fileLoc, szAttFileInfo ;
	var displayFileName;		
	var re = /_N_/g;
	// 2005.06.16  박형진 추가 (결재완료후 이관 문서 의견,첨부파일 링크 유무를 표현 하기 위해 , G_displaySpnAttInfo())
	////////////////////////////////////////
	var bReadOnly = false;
	if (bRead != null) bReadOnly = bRead;
	////////////////////////////////////////

	if (document.all['ATTACH_FILE_INFO'].value != ""){		
		var r, res;
		var s =document.all['ATTACH_FILE_INFO'].value;
		res = /^^^/i;
		attFiles = s.replace(res, "");
		var m_oFileList = new ActiveXObject("MSXML2.DOMDocument");
		m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+attFiles);
		var elmRoot, elmList, elm, elmTaskInfo;
		elmRoot = m_oFileList.documentElement;
		if (elmRoot != null){
			elmList = elmRoot.selectNodes("fileinfo/file");			
			szAttFileInfo = "";
			for (var i=0; i<elmList.length;i++) {
				elm = elmList.nextNode();
				displayFileName = elm.getAttribute("name").substring(0, elm.getAttribute("name").lastIndexOf(".")) ;
				displayFileName = displayFileName.replace(re,"&");
				/*
				if ((getInfo("mode") == "APPROVAL" ||getInfo("mode") == "RECAPPROVAL")  && getInfo("loct") == "APPROVAL"  ){
					szAttFileInfo +="<input type=checkbox id='chkFile' name='_" + elm.getAttribute("name").substring(0, elm.getAttribute("name").lastIndexOf("."))  + "' value='" + elm.getAttribute("name")  + "'>";
					//alert(11);
				}
				*/
				//displayFileName = escape(displayFileName);
				//alert(displayFileName);
				//szAttFileInfo += "<a href=\"../fileattach/download.aspx?location="+escape(elm.getAttribute("location").replace("+","%2B"))+ "&filename=" +  escape(displayFileName) + "\" target = \"_blank\" onclick='javascript:readcheck("+i+")'>" + displayFileName + "</a>";
				//szAttFileInfo += "<a href=\"../fileattach/download.aspx?location="+escape(elm.getAttribute("location").replace("+","%2B"))+ "&filename=" +  escape(displayFileName) + "\" target = \"_blank\" >" + displayFileName + "</a>";
				
				// 
				//////////////////////////////////////////////////////////////////////////////
				if (elm.getAttribute("location").indexOf(".") > -1 ){
					if (bReadOnly){
						szAttFileInfo +=  displayFileName;
					}else{
						//szAttFileInfo += "<a name=\""+displayFileExtendName +  "\" href=\"#\"  onclick='javascript:readcheck("+i+",\""+elm.getAttribute("location").replace("+","%2B")+"\",\""+displayFileExtendName +  "\")'>" + displayFileName + "</a>";
						if (getInfo("loct") == "TEMPSAVE" )
						{
							szAttFileInfo += "<a href=\""+elm.getAttribute("location").replace("+","%2B")+  "\" target = \"_blank\" >" + elm.getAttribute("name") + "</a>";
						}else{							
							//szAttFileInfo += "<a href=\"FileDownLoad.aspx?DisplayFile="+escape(displayFileName.replace("·","%^&").replace("·","%^&"))+"&URL="+escape(elm.getAttribute("location").replace("+","%2B").replace("·","%^&").replace("·","%^&"))+"&MacAddress="+escape(macAddress)+"&DocId="+escape(getInfo("fiid"))+"\" TARGET=\"_blank\" >" + displayFileName + "</a>"; //TARGET=\"_blank\"
						    //szAttFileInfo += "<a href=\"FileDownLoad.aspx?DisplayFile=&URL="+escape(elm.getAttribute("location").replace("+","%2B").replace("·","%^&").replace("·","%^&"))+"&MacAddress="+escape(macAddress)+"&DocId="+escape(getInfo("fiid"))+"\" TARGET=\"_blank\" >" + displayFileName + "</a>"; //TARGET=\"_blank\"
							//szAttFileInfo += "<a href=\"../fileattach/download.aspx?DisplayFile=&URL="+escape(elm.getAttribute("location").replace("+","%2B").replace("·","%^&").replace("·","%^&"))+"&DocId="+escape(getInfo("fiid"))+"\" TARGET=\"_blank\" >" + displayFileName + "</a>"; //TARGET=\"_blank\"
							//szAttFileInfo += "<a hrf=\"../fileattach/download.aspx?location="+toUTF8(elm.getAttribute("location"))+ "&filename=" +  toUTF8(displayFileName) + "\" target = \"_blank\">"  + elm.getAttribute("name") + "</a>";
							//2006.04.17 사원 이후창 수정
							//covi download컴포넌트 추가 관련
							//downloadfile() 함수를 바로 호출하도록 한다
							szAttFileInfo += "<a href='javascript:downloadfile();' >"  + elm.getAttribute("name") + "</a>";
							
						}
					}							
				}else{
					szAttFileInfo += "<a href=\""+m_KMWebAttURL+elm.getAttribute("location")+ "\" target = \"_blank\" >" + elm.getAttribute("name") + "</a>"; //TARGET=\"_blank\"
				}
				//////////////////////////////////////////////////////////////////////////////
				
				if (i < elmList.length - 1)
					szAttFileInfo += ", ";
			}
			/*
			if ((getInfo("mode") == "APPROVAL" ||getInfo("mode") == "RECAPPROVAL")  && getInfo("loct") == "APPROVAL"){
				parent.menu.makeDictionary(document.all['ATTACH_FILE_INFO'].value);
				szAttFileInfo +="<a href='#' onclick='parent.menu.deleteitem();'><font color='#009900'><b>파일삭제<b></font></a>"; 
			}
			*/
		}
		//alert(szAttFileInfo);
		AttFileInfo.innerHTML = szAttFileInfo;
	}
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
	if (strRecDeptNo != ""){
		var iFIndex = strRecDeptNo.indexOf('['+getInfo("dpid")+']');
		if (iFIndex != -1){
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
	if (elmList.length!=0){
		for (var i=0; i<elmList.length;i++) {
			sRecDept +=  "@";
			var elm = elmList.nextNode();
			var elmnodelist = elm.selectNodes("item/AN");
			var sRecDeptNode="";
			for(var j=0;j < elmnodelist.length;j++){
				var elmnode = elmnodelist.nextNode();
				sRecDeptNode += ";" + elmnode.text;
			}
			if (sRecDeptNode.length > 0) sRecDeptNode = sRecDeptNode.substring(1);
			sRecDept += sRecDeptNode;
		}
		if (sRecDept.length > 0) sRecDept = sRecDept.substring(1);
	}
	if( sRecList.length > 1 ){//수신처지정없음
		if (sRecList.substr(0,1) ==  '@') sRecDept = "@"+sRecDept;
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
	var ApvSignLines="<tr>";
	var ApvApproveNameLines="<tr>";
	var ApvDateLines="<tr>";
	var ApvCmt="<tr>";	
	//if (bDisplayCharge  == null ) bDisplayCharge = false;
	//if (!bDisplayCharge ) if(!bReceive && elmList.length > 0 && getInfo("mode") != "DRAFT" && getInfo("mode") != "TEMPSAVE"){elmList.nextNode(); j=1}else{j=0;}
	
	//if (!bDisplayCharge ) if(!bReceive && elmList.length > 0 && getInfo("mode") != "DRAFT" && getInfo("mode") != "TEMPSAVE"){elmList.nextNode(); j=1}else{j=0;}
	if (bReceive){ //담당부서 결재선
		if (sApvTitle!=""){ ApvPOSLines += "<td rowspan='3' bgcolor='#F2F2F2' width='40' height='100' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>"+(sApvTitle==undefined?"주관<br>부서":sApvTitle)+"</td>";}
	}else{
		if (sApvTitle!=""){ ApvPOSLines += "<td rowspan='3' bgcolor='#F2F2F2' width='40' height='100' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>"+(sApvTitle==undefined?"신청<br>부서":sApvTitle)+"</td>";}				
	}
	//var strColTD = elmList.length - elmVisible.length;		
	var ApvListMaxLength = 7;
	var strColTD = ApvListMaxLength;
	var strwidth = String(100/strColTD);
	
//	var lastApprover="";
//	lastApprover = elmList(elmList.length-1).getAttribute("code");
	//var oNodes = elmList.selectNodes("step[@routetype='approve' and @unittype='person']");								
	var lastApprover = elmList(elmList.length-1).getAttribute("code");

	for (var i=0; i<elmList.length-j;i++) {
		//elm = elmList.nextNode();
		elm = elmList(i);
		elmTaskInfo = elm.selectSingleNode("taskinfo");
		if(i!=0&&elm.getAttribute("code")==lastApprover){
			ApvPOSLines += displayRemainApv(ApvListMaxLength, i, "ApvPOSLines", strwidth);
			ApvSignLines += displayRemainApv(ApvListMaxLength, i, "ApvSignLines", strwidth);
			ApvApproveNameLines += displayRemainApv(ApvListMaxLength, i, "ApvApproveNameLines", strwidth);
			ApvDateLines += displayRemainApv(ApvListMaxLength, i, "ApvDateLines", strwidth);
		}

		if((bDisplayCharge && i==0 ) || ( elmTaskInfo.getAttribute("visible") != "n")) //결재선 숨기기한 사람 숨기기
		{
			var sTitle="";
			try{
				sTitle=elm.getAttribute("title");
				sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
			}catch(e){
				if(elm.nodeName=="role"){
					sTitle=elm.getAttribute("name");
					sTitle=sTitle.substr(sTitle.length-2);
				}
			}
			if (sTitle == "담당자")
			{
				sTitle = "담당";
			}
			sTitle = sTitle.replace("T장","팀장").replace("문장","부문장").replace("영장","운영장").replace("점장","지점장").replace("부장","본부장");
			if(elmTaskInfo.getAttribute("kind") == 'charge')			
				ApvPOSLines += "<td height='20'  bgcolor='#F2F2F2'  width='"+strwidth+"%' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>작성 </td>";
			else{	
						if(elm.getAttribute("code")==lastApprover)
							ApvPOSLines += "<td height='20' align='center' bgcolor='#F2F2F2' width='"+strwidth+"%' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>승인</td>";				
						else
							//ApvPOSLines += "<td height='20'  bgcolor='#F2F2F2'  width='"+strwidth+"%' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>" + sTitle +"</td>";
							ApvPOSLines += "<td height='20'  bgcolor='#F2F2F2'  width='"+strwidth+"%' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>검토</td>";
			}		
					
			ApvDateLines +="<td height='20' align='center' valign='middle' style='font-size:8pt; WIDTH:" + strwidth + "%;'>";
			ApvSignLines += "<td height='20' align='center' valign='middle' style='font-size:8pt WIDTH:" + strwidth + "%;'>";
			//ApvSignLines += "<td height='50' width='14%' align='center' valign='middle'>";
			//ApvSignLines += "<table border='1' width='14%' style='border-color:#FF0000'><tr><td style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,궁서체;font-style:italic;color:#4584C9;font-weight:bold'>"
			ApvApproveNameLines += "<td height='20'  align='center' valign='bottom' style='font-size:8pt; WIDTH:" + strwidth + "%;'>";
			//ApvCmt +="<td height='20'  align='center' width='14%' valign='middle' style='font-size:8pt'>";

			strDate = elmTaskInfo.getAttribute("datecompleted");
			if (strDate == null) {
				strDate = "";
				ApvCmt +="&nbsp;";
			}else{
						var assistcmt = elm.selectSingleNode("taskinfo/comment");
						if (assistcmt != null){
							aryComment[i]  = assistcmt.text;
						}else{
							aryComment[i]  = "";
						}

						// 수신,발신처 있을경우의 문서 이관시 '의견' 란 링크 삭제
						if(parent.menu.m_CmtBln == false) { ApvCmt +=(assistcmt ==null)?"&nbsp;":"의견"; }
						else
						{	ApvCmt +=(assistcmt ==null)?"&nbsp;":"<a href=\'#\' onclick=\'viewComment(\""+i+"\")\'>의견</a>"; }

						//ApvCmt +=(assistcmt ==null)?"&nbsp;":"<a href=\'#\' onclick=\'viewComment(\""+i+"\")\'>의견</a>";
			}
			
			var sCode="";
			var elmtemp;
			if(elm.nodeName=="role")
				try{sCode=elm.selectSingleNode("person").getAttribute("code");elmtemp = elm.selectSingleNode("person");}catch(e){}
			else
				sCode=elm.getAttribute("code");
				
			var elmname= ( elmtemp != null)?elmtemp:elm;
			switch( elmTaskInfo.getAttribute("kind")){
				case "authorize":
						ApvSignLines += sTitle+"<br>";
						ApvSignLines += "전결"+interpretResult(elmTaskInfo.getAttribute("result"));
						ApvApproveNameLines += "&nbsp;";	
						ApvApproveNameLines += (strDate=="")?"&nbsp;": "<br>"+formatDate(strDate, "A");
						//ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
						ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate, "A");
						LastApv  ="/";// getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"))+interpretResult(elmTaskInfo.getAttribute("result"));
						LastApvName = elmname.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
						LastDate = formatDate(strDate, "A");
						break;
				case "substitute":
						ApvSignLines += sTitle+"<br>";
						//if( strDate == "" ){ApvSignLines += "대결"}else{ApvSignLines += getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false);}
						if(strDate==""){ApvSignLines += "대결";}
						ApvApproveNameLines += elmname.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));	
						ApvApproveNameLines += (strDate=="")?"&nbsp;":"<br>"+formatDate(strDate, "A");
						ApvDateLines += formatDate(strDate, "A");
						LastApv = "";
						LastApvName = "";
						LastDate ="";
						//LastApv = getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));
						//LastApvName = elmname.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
						//LastDate = formatDate(strDate);
						break;
				case "skip":
						//ApvSignLines += (i<elmList.length-1)?"/":LastApv;
						//ApvApproveNameLines += (i < elmList.length-1)?"&nbsp;":LastApvName;
						//ApvDateLines += (i<elmList.length-1)?"&nbsp;":LastDate;
						ApvSignLines += sTitle+"<br>";
						ApvSignLines += "/";
						ApvApproveNameLines +="&nbsp;";
						ApvApproveNameLines += "&nbsp;";
						ApvDateLines += "&nbsp;";
						break;
				case "bypass":
				        if (LastApv == undefined)  var LastApv = "";
				        if (LastApvName == undefined) var LastApvName = "";
						ApvSignLines += sTitle+"<br>";
						ApvSignLines += (LastApv=="")?"후열":LastApv;							
						ApvApproveNameLines += (LastApvName=="")?elmname.getAttribute("name"):LastApvName;	
						ApvApproveNameLines += (LastDate =="")?"<br>"+formatDate(strDate,"A"):"<br>"+LastDate ;
						ApvDateLines += (LastDate =="")?formatDate(strDate, "A"):LastDate ;
						break; //"후열"
				case "review": 	
						ApvSignLines += sTitle+"<br>";
						//ApvSignLines += (strDate=="")?"후결": getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"));//+interpretResult(elmTaskInfo.getAttribute("result"));
						ApvSignLines += (strDate=="")?"후결":"&nbsp;";
						ApvApproveNameLines += (strDate=="")?elmname.getAttribute("name"): elmname.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
						ApvApproveNameLines += (strDate=="")?"&nbsp;": "<br>"+formatDate(strDate, "A");
						ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate, "A");
						break;
				case "charge": 
						//ApvSignLines += (strDate=="")?elm.getAttribute("name"): getSignUrl(sCode,"stamp",elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));
						ApvSignLines += sTitle+"<br>";
						//ApvSignLines += elm.getAttribute("name");
						ApvSignLines += "<br>";
						ApvApproveNameLines += (strDate=="")?elmname.getAttribute("name"): elmname.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
						ApvApproveNameLines += (strDate=="")?"&nbsp;": "<br>"+formatDate(strDate, "A");
						ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate, "A");
						break;
				default :
						ApvSignLines += sTitle+"<br>";
//						ApvSignLines += (strDate=="")?elm.getAttribute("name"): getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"));//+interpretResult(elmTaskInfo.getAttribute("result"));
						ApvSignLines += "<br>";
						ApvApproveNameLines += (strDate=="")?"&nbsp;": elmname.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
						ApvApproveNameLines += (strDate=="")?"&nbsp;": "<br>"+formatDate(strDate, "A");
						ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate, "A");
			}
			//ApvSignLines += "</td></tr></table></td>";
			ApvSignLines += "</td>";
			ApvApproveNameLines += "</td>";
			ApvDateLines += "</td>";		
			//ApvCmt += "</td>";				
		}	
	}
	if(elmList.length==1){
			ApvPOSLines += displayRemainApv(ApvListMaxLength, i-1, "ApvPOSLines", strwidth);
			ApvSignLines += displayRemainApv(ApvListMaxLength, i-1, "ApvSignLines", strwidth);
			ApvApproveNameLines += displayRemainApv(ApvListMaxLength, i-1, "ApvApproveNameLines", strwidth);
			ApvDateLines += displayRemainApv(ApvListMaxLength, i-1, "ApvDateLines", strwidth);
	}
	// 2005.07.13 박형진 수정 기안자,결재자 '이름' 출력하도록
	//Apvlines = ApvPOSLines + "</tr>" + ApvSignLines + "</tr>" + ApvDateLines + "</tr>" + ApvCmt  + "</tr>";
	//Apvlines = ApvPOSLines + "</tr>" + ApvSignLines + "</tr>" + ApvApproveNameLines + "</tr>" + ApvDateLines + "</tr>" + ApvCmt  + "</tr>";
	Apvlines = ApvPOSLines + "</tr>" + ApvSignLines + "</tr>" + ApvApproveNameLines + "</tr>";
	//alert(Apvlines);

	Apvlines = "<table bordercolor='#111111' border='2' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;width:95%;'>" + Apvlines + "</table>";	
	alert(Apvlines);
	return Apvlines;	
}
//최대7개의 결재선을 고정으로 표시하기 위한 함수
//	pMaxApv : 최대 결재선 갯수
//	pRemainApv : 남은 결재선 갯수(실제 공란으로 표시할 결재선갯수)
//	poHTML : Return될 HTML 변수명 ( ApvPOSLines|ApvSignLines|ApvApproveNameLines|ApvDateLines)
function displayRemainApv(pMaxApv, pRemainApv, poHTML, strwidth){
	var tmpHTML="", tmpRemainApv="";
	tmpRemainApv = pMaxApv - pRemainApv - 1;
	for(var i=0; i<tmpRemainApv; i++){
		switch(poHTML){
			case "ApvPOSLines":
				tmpHTML += "<td height='20'  bgcolor='#F2F2F2'  width='"+strwidth+"%' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'></td>"; break;
			case "ApvSignLines":
				tmpHTML += "<td height='20' width='14%' align='center' valign='middle' style='font-size:8pt; WIDTH:" + strwidth + "%;'></td>"; break;
			case "ApvApproveNameLines":
				tmpHTML += "<td height='20' width='14%' align='center' valign='middle' style='font-size:8pt; WIDTH:" + strwidth + "%;'>---</td>"; break;
			case "ApvDateLines":
				tmpHTML += "<td height='20' width='14%'  align='center' valign='bottom' style='font-size:8pt; WIDTH:" + strwidth + "%;'></td>"; break;
		}
	}
	return tmpHTML;
}
//문서등급 조회
function getDocLevel(szCode){
	var szName='';
	switch (szCode){
		case "10" : szName = "1등급";break;
		case "20" : szName = "2등급";break;
		case "30" : szName = "3등급";break;
		case "40" : szName = "4등급";break;	
	}
	return szName;
}

//보존년한 조회
function getSaveTerm(szCode){
	var szName='';
	switch (szCode){
		case "1" : szName = "1년";break;
		case "2" : szName = "3년";break;
		case "3" : szName = "5년";break;
		case "4" : szName = "10년";break;
		case "0" : szName = "영구";break;
	}
	return szName;
}
//문서등급 create
function setDocLevel(){
	makeCBOobject("10","1등급",DOC_LEVEL);
	makeCBOobject("20","2등급",DOC_LEVEL);
	makeCBOobject("30","3등급",DOC_LEVEL);
	makeCBOobject("40","4등급",DOC_LEVEL);
	
	setDefaultCBOobject((getInfo("DOC_LEVEL")==null?"40":getInfo("DOC_LEVEL")),DOC_LEVEL);
}
//보존년한 create
function setSaveTerm(){
	makeCBOobject("1","1년",SAVE_TERM);
	makeCBOobject("2","3년",SAVE_TERM);
	makeCBOobject("3","5년",SAVE_TERM);
	makeCBOobject("4","10년",SAVE_TERM);
	makeCBOobject("0","영구",SAVE_TERM);
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
	if (strcode=='' || strcode == null ) strcode = '1';
	for(var i=0; i<cboObject.length ; i++){
		if (cboObject.options[i].value == strcode)
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
var gz_Editor="0"; // 0 : Namo, 1: TagFree
function UpdateImageData(){	
	var nfile = "";
	var nfolder = "attach";
	var truedata = "";	
	var n =-1;
	var szMimeValue,szURL,imgList;
	imgList = "";
	switch(gz_Editor){
		case "0": n= tbContentElement.GetFileNum(0); break;
		case "1": n= tbContentElement.HtmlValue.indexOf('file:///');break;
	}
	
	if (n > -1){ 
		switch(gz_Editor){
			case "0": 
				imgList = getFileList();
				if (imgList != "" ){
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
				szURL = "./NamoImage/BackstroageMove.aspx";
				break;
			case "1": 
				szMimeValue =tbContentElement.MimeEnValue;
				szURL = "./NamoImage/TagFree.aspx";
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
		case "0": objDOM = tbContentElement.CreateDOM(); 
			objDOM.charset = "utf-8";
			var imgName = new Array;
			var szdate = getInfo("svdt").replace(/:/gi,"").replace(/오후/gi,"").replace(/오전/gi,"");
			var g_szURL = "http://" + document.location.host + "/COVINet/BackStorage/Approval/attach";
			for (var i = 0; i < objDOM.images.length; i++){			
				var imgSrc = objDOM.images[i].src;  			
				imgSrc = imgSrc.toLowerCase();
				if ( imgSrc.indexOf("file:///") > -1 ){ //backstorage/approval/attach== -1
					//if ( imgSrc.indexOf(".gif") != -1 || imgSrc.indexOf(".jpg") != -1 || imgSrc.indexOf(".bmp") != -1 ){								
						imgName[i] = imgSrc.substring(imgSrc.lastIndexOf('/') + 1, imgSrc.length);						
						objDOM.images[i].src = g_szURL +"/"+ szdate + "_"+ imgName[i];
					//}					
				}
			}
			tbContentElement.Value = objDOM.body.innerHTML.replace(/ekpweb1.medison.com/gi,"ekp.medison.com").replace(/ekpweb2.medison.com/gi,"ekp.medison.com");		
			tbContentElement.DeleteDOM(); // DOM 사용하고 난 후에는 삭제해주어야 한다.		
			break;
		case "1": //objDOM = tbContentElement.GetDOM(); 
		break;
	}
}


function event_attchSync(){
//	if(gz_xmlHTTP.readystate == 4){
//		gz_xmlHTTP.onreadystatechange = event_noop;
		if(gz_xmlHTTP.status == 200 ){
			var error = gz_xmlHTTP.responseXML.selectSingleNode("//error");
			if (error != null){ 
				alert("AttachImage ERROR : " + error.text);
				return;
			}else{
				 if (gz_Editor == "1") {
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
	retHTML += "<td rowspan='3' bgcolor='#F2F2F2' width='40' height='100' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>주관<br>부서</td>";
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
//결재라인
function displayApvList(oApvList){
	var elmRoot, elmList, elm, elmTaskInfo, elmReceive, ApvList, elmVisible, elmRecList;
	var Apvlines = "";
	var strDate, strFieldName, strwidth, strColTD, LastDate;
	//logo.src = "http://tstmaeil.com/COVINet/BackStorage/Approval/" + (getInfo("ENT_CODE")!=undefined?getInfo("ENT_CODE"):getInfo("etid"))+".gif";//회사 logo 처리

	elmRoot = oApvList.documentElement;		
	if (elmRoot != null){
		elmReceive = elmRoot.selectSingleNode("division[@divisiontype='receive']"); //수신처
		if (elmReceive != null || getInfo("scDRec") =="1" || getInfo("scChgr") == "1" || getInfo("scChgrOU") == "1"){//수신처가 있는경우 좌측:내부결재 우측 수신처 결재선			
			elmList = elmRoot.selectNodes("division[@divisiontype='send']/step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/(person|role)");
			elmVisible = elmRoot.selectNodes("division/step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/(person|role)[taskinfo/@visible='n']");			
			if (elmList.length>0)	try{LApvLine.innerHTML = getRequestApvList(elmList,elmVisible,"",false);}catch(e){AppLine.innerHTML= getRequestApvList(elmList,"",false);}
			Apvlines = "";
			/*
			elmList = elmRoot.selectNodes("step[(@unittype='ou' or @unittype='person') and @routetype='receive']/ou/(person|role)");	
			elmVisible = elmRoot.selectNodes("step[(@unittype='ou' or @unittype='person') and @routetype='receive']/ou/(person|role)[taskinfo/@visible='n']");			
			//if (elmList.length!=0)	RApvLine.innerHTML = getRequestApvList(elmList,"",true,elmReceive.getAttribute("name"));
			if (elmList.length!=0)	try{RApvLine.innerHTML = getRequestApvList(elmList,elmVisible,"",true);}catch(e){}
			*/
			//경유부서 처리
			elmRecList = elmRoot.selectNodes("division[@divisiontype='receive']");///step[(@unittype='ou' or @unittype='person') and @routetype='receive']/ou
			for(var i=0; i < elmRecList.length ; i++){
				elm = elmRecList(i);
				//elm = elmRecList.nextNode();							
				elmList = elm.selectNodes("step/ou/(person|role)");	
				elmVisible = elm.selectNodes("step/ou/(person|role)[taskinfo/@visible='n']");			
				if (elmList.length!=0){
					try{
						/*
						switch (i){
							case 0 : break;
							case 1 : LApvLineADD.innerHTML = RApvLine(i).innerHTML.replace("주관","경유");break;
							case 2 : RApvLineADD.innerHTML = LApvLineADD.innerHTML ; LApvLineADD.innerHTML = RApvLine(i).innerHTML.replace("주관","경유");break;;
						}
						*/
						RApvLine(i).innerHTML = getRequestApvList(elmList,elmVisible,"",true);
					}catch(e){}
				}
			}
			//try{if(elmRecList.length > 1){ AppLineADD.style.display="";}else{RApvLine.innerHTML = "<table bordercolor='#111111' border='2' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100;width:95%;'><tr><td rowspan='4' bgcolor='#F2F2F2' width='40' height='100' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>주관<br>부서</td><td height='20'  bgcolor='#F2F2F2'  width='100%' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>&nbsp;</td></tr><tr><td height='50' align='center' valign='middle' style='font-size:11pt;font-family: Georgia, Times New Roman, Times, serif,궁서체;font-style:italic;color:#4584C9;font-weight:bold'></td></tr><tr><td height='20'  align='center' valign='bottom' style='font-size:8pt;'></td></tr><tr><td height='20' align='center' valign='middle' style='font-size:8pt;'></td></tr></table>";}}catch(e){}
			try{if(elmRecList.length > 1){ AppLineADD.style.display="";}else{RApvLine(i).innerHTML = displayRecApvDept(elmRecList(i).selectSingleNode("//division/step/ou/@name").text);}}catch(e){}
		}else{//오른쪽에 내부결재
			elmList = elmRoot.selectNodes("division[@divisiontype='send']/step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/(person|role)");		
			elmVisible = elmRoot.selectNodes("division[@divisiontype='send']/step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/(person|role)[taskinfo/@visible='n']");					
			
			var Apvlines ="";
			var ApvPOSLines="<tr>";
			var ApvSignLines="<tr>";
			var ApvApproveNameLines="<tr>";
			var ApvDateLines="<tr>";			
			var ApvCmt="<tr>";	
			
			ApvPOSLines += "<td rowspan='5' bgcolor='#F2F2F2' width='20' height='100' align='center' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>결<br><br>재</td>";

			//strColTD = ( getInfo("mode") != "DRAFT" )?elmList.length-1:elmList.length;	
			//strColTD += 1;

			//strColTD = elmList.length - elmVisible.length;
			var ApvListMaxLength = 7;
			var strColTD = ApvListMaxLength;
			strwidth = String(100/strColTD);

			var lastApprover = elmList(elmList.length-1).getAttribute("code");
			
			for (var i=0; i<elmList.length;i++) {
				//elm = elmList.nextNode();
				elm = elmList(i);
				elmTaskInfo = elm.selectSingleNode("taskinfo");
				if(i!=0&&elm.getAttribute("code")==lastApprover){
					ApvPOSLines += displayRemainApv(ApvListMaxLength, i, "ApvPOSLines", strwidth);
					ApvSignLines += displayRemainApv(ApvListMaxLength, i, "ApvSignLines", strwidth);
					ApvApproveNameLines += displayRemainApv(ApvListMaxLength, i, "ApvApproveNameLines", strwidth);
					ApvDateLines += displayRemainApv(ApvListMaxLength, i, "ApvDateLines", strwidth);
				}
					
				if(elmTaskInfo.getAttribute("visible")!="n")
				{					
					var sTitle="";
					try{
						sTitle=elm.getAttribute("title");
						sTitle=sTitle.substring(sTitle.lastIndexOf(";")+1)
					}catch(e){
						if(elm.nodeName=="role"){
							sTitle=elm.getAttribute("name");
							sTitle=sTitle.substr(sTitle.length-2);
						}
					}
					sTitle = sTitle.replace("T장","팀장").replace("문장","부문장").replace("영장","운영장").replace("점장","지점장").replace("부장","본부장");
					if(elmTaskInfo.getAttribute("kind") == 'charge')			
						ApvPOSLines += "<td height='20' align='center' bgcolor='#F2F2F2' width='"+strwidth+"%' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>작성</td>";				
					else{
						if(elm.getAttribute("code")==lastApprover)
							ApvPOSLines += "<td height='20' align='center' bgcolor='#F2F2F2' width='"+strwidth+"%' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>승인</td>";				
						else
							ApvPOSLines += "<td height='20' align='center' bgcolor='#F2F2F2' width='"+strwidth+"%' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>검토</td>";				
					}
					
					ApvSignLines += "<td height='40' width='"+strwidth+"%' align='center' valign='middle' style='font-size:8pt;'>";									
					ApvApproveNameLines += "<td height='20' width='"+strwidth+"%' align='center' valign='middle' style='font-size:8pt;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>";
					ApvDateLines +="<td height='20' width='"+strwidth+"%' align='center' valign='middle' style='font-size:8pt'>";
					//ApvCmt +="<td height='20'  align='center' valign='middle' style='font-size:8pt; PADDING-TOP: 4px;'>";

					strDate = elmTaskInfo.getAttribute("datecompleted");
					if (strDate == null) {
						strDate = "";
						ApvCmt +="&nbsp;";
					}else{
						var assistcmt = elm.selectSingleNode("taskinfo/comment");
						if (assistcmt != null){
							aryComment[i]  = assistcmt.text;
						}else{
							aryComment[i]  = "";
						}
						

						if(parent.menu.m_CmtBln == false) { ApvCmt +=(assistcmt ==null)?"&nbsp;":"의견"; }
						else
						{	ApvCmt +=(assistcmt ==null)?"&nbsp;":"<a href=\'#\' onclick=\'viewComment(\""+i+"\")\'>의견</a>"; }

					}
					var sCode="";
					var elmtemp;
					if(elm.nodeName=="role")
						try{sCode=elm.selectSingleNode("person").getAttribute("code");elmtemp = elm.selectSingleNode("person");}catch(e){}
					else
						sCode=elm.getAttribute("code");
						
					var elmname= ( elmtemp != null)?elmtemp:elm;

					switch( elmTaskInfo.getAttribute("kind")){
						case "authorize":
								ApvSignLines += sTitle+"<br>";
								ApvSignLines += "전결"+interpretResult(elmTaskInfo.getAttribute("result"));
								ApvApproveNameLines += "&nbsp;";	
								ApvApproveNameLines += (strDate=="")?"&nbsp;": "<br>"+formatDate(strDate, "A");
								//ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate);
								ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate, "A");
								LastApv  ="/";// getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"))+interpretResult(elmTaskInfo.getAttribute("result"));
								LastApvName = elmname.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
								LastDate = formatDate(strDate, "A");
								break;
						case "substitute":
								ApvSignLines += sTitle+"<br>";
								//if( strDate == "" ){ApvSignLines += "대결"}else{ApvSignLines += getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false);}
								if(strDate==""){ApvSignLines += "대결";}
								ApvApproveNameLines += elmname.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));	
								ApvApproveNameLines += (strDate=="")?"&nbsp;":"<br>"+formatDate(strDate, "A");
								ApvDateLines += formatDate(strDate, "A");
								LastApv = "";
								LastApvName = "";
								LastDate ="";
								//LastApv = getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));
								//LastApvName = elmname.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
								//LastDate = formatDate(strDate);
								break;
						case "skip":
								//ApvSignLines += (i<elmList.length-1)?"/":LastApv;
								//ApvApproveNameLines += (i < elmList.length-1)?"&nbsp;":LastApvName;
								//ApvDateLines += (i<elmList.length-1)?"&nbsp;":LastDate;
								ApvSignLines += sTitle+"<br>";
								ApvSignLines += "/";
								ApvApproveNameLines +="&nbsp;";
								ApvApproveNameLines += "&nbsp;";
								ApvDateLines += "&nbsp;";
								break;
						case "bypass":
						        if (LastApv == undefined)  var LastApv = "";
				                if (LastApvName == undefined) var LastApvName = "";
								ApvSignLines += sTitle+"<br>";
								ApvSignLines += (LastApv=="")?"후열":LastApv;							
								ApvApproveNameLines += (LastApvName=="")?elmname.getAttribute("name"):LastApvName;	
								ApvApproveNameLines += (LastDate =="")?"<br>"+formatDate(strDate,"A"):"<br>"+LastDate ;
								ApvDateLines += (LastDate =="")?formatDate(strDate, "A"):LastDate ;
								break; //"후열"
						case "review": 	
								ApvSignLines += sTitle+"<br>";
								//ApvSignLines += (strDate=="")?"후결": getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"));//+interpretResult(elmTaskInfo.getAttribute("result"));
								ApvSignLines += (strDate=="")?"후결":"&nbsp;";
								ApvApproveNameLines += (strDate=="")?elmname.getAttribute("name"): elmname.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
								ApvApproveNameLines += (strDate=="")?"&nbsp;": "<br>"+formatDate(strDate, "A");
								ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate, "A");
								break;
						case "charge": 
								//ApvSignLines += (strDate=="")?elm.getAttribute("name"): getSignUrl(sCode,"stamp",elm.getAttribute("name"),strDate,false)+interpretResult(elmTaskInfo.getAttribute("result"));
								ApvSignLines += sTitle+"<br>";
								//ApvSignLines += elm.getAttribute("name");
								ApvSignLines += "<br>";
								ApvApproveNameLines += (strDate=="")?elmname.getAttribute("name"): elmname.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
								ApvApproveNameLines += (strDate=="")?"&nbsp;": "<br>"+formatDate(strDate, "A");
								ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate, "A");
								break;
						default :
								ApvSignLines += sTitle+"<br>";
		//						ApvSignLines += (strDate=="")?elm.getAttribute("name"): getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false,elmTaskInfo.getAttribute("result"));//+interpretResult(elmTaskInfo.getAttribute("result"));
								ApvSignLines += "<br>";
								ApvApproveNameLines += (strDate=="")?elmname.getAttribute("name"): elmname.getAttribute("name")+interpretResult(elmTaskInfo.getAttribute("result"));
								ApvApproveNameLines += (strDate=="")?"&nbsp;": "<br>"+formatDate(strDate, "A");
								ApvDateLines += (strDate=="")?"&nbsp;": formatDate(strDate, "A");
					}
					ApvSignLines += "</td>";
					ApvApproveNameLines += "</td>";
					ApvDateLines += "</td>";				
					//ApvCmt += "</td>";								
				}	
			}
			if(elmList.length==1){
					ApvPOSLines += displayRemainApv(ApvListMaxLength, i-1, "ApvPOSLines", strwidth);
					ApvSignLines += displayRemainApv(ApvListMaxLength, i-1, "ApvSignLines", strwidth);
					ApvApproveNameLines += displayRemainApv(ApvListMaxLength, i-1, "ApvApproveNameLines", strwidth);
					ApvDateLines += displayRemainApv(ApvListMaxLength, i-1, "ApvDateLines", strwidth);
			}
			Apvlines = ApvPOSLines + "</tr>" + ApvSignLines + "</tr>" + ApvApproveNameLines + "</tr>";
			//Apvlines = ApvPOSLines + "</tr>" + ApvSignLines + "</tr>" + ApvApproveNameLines + "</tr>" + ApvDateLines  + "</tr>"+ ApvCmt +  "</tr>";
			//Apvlines = "<table bordercolor='#111111' width='100%' height='140' border='2' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;table-layout:fixed' cellpadding='0'>" + Apvlines + "</table>";
			Apvlines = "<table bordercolor='#111111' width='100%' height='140' border='2' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;' cellpadding='0'>" + Apvlines + "</table>";
			AppLine.innerHTML = Apvlines;
			//alert(AppLine.innerHTML );			
		}
		//합의출력		
		elmList = elmRoot.selectNodes("(division/step[(@unittype='person' or @unittype='role') and @routetype='consult']/ou/(person|role))"); //개인합의
		elmOUList = elmRoot.selectNodes("(division/step[@unittype='ou' and @routetype='consult']/ou)"); //부서협조
		elmListCount = elmList.length + elmOUList.length;		
 	
		if (elmListCount!=0){
			Apvlines = "<tr><td height='20' width='100' align='center' bgcolor='#F2F2F2' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>부서명</td>";
			Apvlines += "<td height='20' width='200' align='center' bgcolor='#F2F2F2' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>성명</td>";
			Apvlines += "	<td height='20' colspan='2' width='100%' align='center' bgcolor='#F2F2F2' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>합의 결과</td></tr>";
			//Apvlines += "   <td height='20' width='50%' align='center' bgcolor='#F2F2F2' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>의&nbsp;&nbsp;&nbsp;견</td></tr>";
			for (var i=0; i<elmList.length;i++) {
				//elm = elmList.nextNode();
				elm = elmList(i);
				var sCode="";
				var sTitle="";
				if(elm.nodeName=="role"){
					try{sCode=elm.selectSingleNode("person").getAttribute("code");}catch(e){}
					try{sTitle=elm.getAttribute("name");}catch(e){}
				}else{
					sCode=elm.getAttribute("code");
					sTitle=elm.getAttribute("title");
					sTitle=elm.getAttribute("ouname")+" "+sTitle.substring(sTitle.lastIndexOf(";")+1)+" "+elm.getAttribute("name");
				}
				elmTaskInfo = elm.selectSingleNode("taskinfo");
				strDate = elmTaskInfo.getAttribute("datecompleted");
				if (strDate == null) {strDate = "";}
				var assistcmt = elm.selectSingleNode("taskinfo/comment");
				switch( elmTaskInfo.getAttribute("kind")){
					case "substitute":
							LastTitle = elm.getAttribute("title").substring(elm.getAttribute("title").lastIndexOf(";")+1)+" "+elm.getAttribute("name");
							LastCmt = (assistcmt ==null)?"&nbsp;":assistcmt.text.replace(/\n/g,"<br>");
							break;
					case "bypass":
							Apvlines +="<tr><td height='30' width='100' style='font-size:9pt; padding-left:4;'>"+elm.getAttribute("ouname")+"</td>";
							Apvlines +="<td height='30' width='200' style='font-size:9pt; padding-left:4;'>"+sTitle+" 대결 " + LastTitle +"</td>";
							Apvlines +="<td style='padding-left:4; word-break:break-all'>";	
							Apvlines +=LastCmt;
							Apvlines +="</td>";
							Apvlines +="<td></td>";			//	의견여부
							Apvlines +="</tr>";
							break; //"후열"
					default:
							Apvlines +="<tr><td height='30' width='100' style='font-size:9pt; padding-left:4;'>"+elm.getAttribute("ouname")+"</td>";
							Apvlines +="<td height='30' width='150' style='font-size:9pt; padding-left:4;'>"+sTitle+"</td>";
							Apvlines +="<td style='padding-left:4; word-break:break-all'>";	
							Apvlines +=interpretResult(elmTaskInfo.getAttribute("result"))+" "+formatDate(strDate, "A");
							Apvlines +=(assistcmt ==null)?"&nbsp;":assistcmt.text.replace(/\n/g,"<br>");
							Apvlines +="</td>";
							Apvlines +="<td></td>";			//	의견여부
							Apvlines +="</tr>";
						break;
				}
				
				//Apvlines +="<td height='30' width='220' style='font-size:9pt; padding-left:4;'>"+sTitle+"</td>";
				////Apvlines +="<tr><td height='30' align='center' style='font-size:9pt;'>"+sTitle+"</td><td align='center' valign='middle' style='font-size:9pt;'>";
				//// 합의자 서명 이미지 출력 으로 수정  ' 2005.07.20 박형진 수정
				////Apvlines += (strDate=="")?"&nbsp;</td>": getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+"</td>"; //getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+
				////Apvlines += (strDate=="")?"&nbsp;</td>": interpretResult(elmTaskInfo.getAttribute("result"))+"</td>"; //getSignUrl(sCode,elmTaskInfo.getAttribute("customattribute1"),elm.getAttribute("name"),strDate,false)+
				////Apvlines +="<td align='center' align='center' style='font-size:9pt;'>"+formatDate(strDate)+"</td><td style='word-break:break-all'>";
				//Apvlines +="<td style='padding-left:4; word-break:break-all'>";	
				//Apvlines +=(assistcmt ==null)?"&nbsp;":assistcmt.text.replace(/\n/g,"<br>");
				//Apvlines +="</td></tr>";
			}
			for (var i=0; i<elmOUList.length;i++) {					
				elm = elmOUList.nextNode();						
				Apvlines +="<tr><td height='20'  align='center' style='font-size:9pt;'>"+elm.getAttribute("name")+"</td><td align='center' valign='middle' style='font-size:9pt;'>";
				elmTaskInfo = elm.selectSingleNode("taskinfo");
				strDate = elmTaskInfo.getAttribute("datecompleted");
				if (strDate == null) {strDate = "";}
				Apvlines += (strDate=="")?"&nbsp;</td>":interpretResult(elmTaskInfo.getAttribute("result"))+"</td>";
				Apvlines +="<td  align='center' style='font-size:8pt;'>"+formatDate(strDate)+"</td><td>";
				var assistcmt = elmTaskInfo.selectSingleNode("comment")
				Apvlines +=(assistcmt ==null)?"&nbsp;":assistcmt.text;
				Apvlines +="</td></tr>";
			} 
			Apvlines = "<table bordercolor='#111111' width='100%' border='2' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;table-layout:fixed' cellpadding='0'>" + Apvlines + "</table>";
			AssistLine.innerHTML = Apvlines;			
		}else{
			AssistLine.innerHTML = "";				
		}
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
			//참조자 목록 보이기 처리
			if (sSendccInfos.length+sRecccInfos.length > 0 ){
				try{CCLine.style.display = "";}catch(e){} 
			}else{
				try{CCLine.style.display = "none";}catch(e){} 
			}

		}else{
			try{CCLine.style.display = "none";}catch(e){} 
		}
	}
	//배포처 출력
	try{RecLine.innerHTML = initRecList();}catch(e){}
	try{G_displaySpnDocLinkInfo();}catch(e){}
}

//협조처 목록 조회
function initRecList(){
	var szReturn='';
	var aRecDept = RECEIVE_NAMES.value.split("@");
	var sRecDept = aRecDept[0];
	if ( sRecDept != null && sRecDept !=''){
		var aRec = sRecDept.split(";");
		for(var i=0;i<aRec.length;i++){			szReturn += (szReturn!=''?", ":"")+(aRec[i].split(":")[1]+"장");		}
	}
	if (szReturn != ''){
		if(getInfo("fmpf") == "WF_COORDINATION"){
			szReturn = "<table bordercolor='#111111' width='100%' border='2' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;' cellpadding='0'><tr><td width='20' align='center' bgcolor='#F2F2F2' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>수<br>신<br>부<br>서</td><td style='font-size:9pt; padding-left:8; padding-top:8;' valign='top'>" + szReturn + "</td></tr></table>";
		}else{
			szReturn = "<table bordercolor='#111111' width='100%' border='2' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;table-layout:fixed' cellpadding='0'><tr><td width='11%' align='center' bgcolor='#F2F2F2' style='font-size:9pt;font-weight:bold;PADDING-BOTTOM: 0px; PADDING-TOP: 3px'>통지부서</td><td style='font-size:9pt; padding-left:8;'>" + szReturn + "</td></tr></table>";
		}
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
			//alert(m_xmlHTTP.responseText);
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
	var nHeight = 410;
	var vRetval = window.showModelessDialog("../ApvLineMgr/comment.aspx", rgParams, "dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;scrolling:no;help:no;");
}
function getSplitted(src,delim,idx){var aSrc = src.split(delim);return (aSrc.length>idx?aSrc[idx]:"");}

function toUTF8(szInput){
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
function InputDocLinks(szValue){
	doclinks.value = szValue;
	G_displaySpnDocLinkInfo();
}
function G_displaySpnDocLinkInfo(){//수정본
	var szdoclinksinfo = "";
	var szdoclinks="";
	if (  getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"){
		szdoclinks = doclinks.value;
	}else{
		var m_objXML=new ActiveXObject("MSXML2.DOMDocument");
		m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?><root>"+getInfo("BODY_CONTEXT")+"</root>");
		szdoclinks = m_objXML.documentElement.selectSingleNode("DOCLINKS").text;
	}
	if ( szdoclinks != ""){
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
			if (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"){
				szdoclinksinfo +="<input type=checkbox id='chkDoc' name='_" + adoc[0] + "' value='" + adoc[0] + "'>";
			}
			szdoclinksinfo +="<a href='#' onClick=\"processSelectedRow('"+piid+"','"+bstate+"','"+fmid+"','"+fmnm+"','"+fmpf+"','"+fmrv+"','"+fiid+"','"+scid+"')\">" +adoc[2] + "</a>&nbsp;&nbsp;";
		}
		if (szdoclinksinfo != "" && (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE")){
			szdoclinksinfo +="<a href='#' onclick='deletedocitem();'><font color='#009900'><b>연결삭제<b></font></a>"; 
		}
	}
	DocLinkInfo.innerHTML = szdoclinksinfo;
}
function processSelectedRow(piid,bstate,fmid,fmnm,fmpf,fmrv,fiid,scid){	
		var strURL ="Form.aspx?mode=COMPLETE" + "&piid=" + piid  + "&bstate=" + bstate
					+ "&fmid=" + fmid + "&fmnm=" + toUTF8(fmnm)
					+ "&fmpf=" + fmpf + "&fmrv=" + fmrv + "&fiid=" + fiid+ "&scid=" + scid;
		openWindow(strURL,"newMessageWindow",800,600,'resize');
}
function deletedocitem(){
	var adoclinks = doclinks.value.split("^");
	var szdoclinksinfo = "";

	var tmp="" ;
	if ( chkDoc.length == null){
		if ( chkDoc.checked ){
			tmp =  chkDoc.value;
			for(var i=adoclinks.length-1; i >= 0 ; i--){
				if(adoclinks[i]!=null && adoclinks[i].indexOf(tmp) > -1 ){
					adoclinks[i] = null;
				}
			}
		}
	}else{
		for (var j=chkDoc.length -1; j>=0 ;j--){
			if (chkDoc[j].checked){ 
				tmp =  chkDoc[j].value;
				for(var i=adoclinks.length-1; i >= 0 ; i--){
					if(adoclinks[i]!=null && adoclinks[i].indexOf(tmp) > -1 ){
						adoclinks[i] = null;
					}
				}
			}
		}
	}
	for(var i=0; i < adoclinks.length ; i++){
		if (adoclinks[i]!=null){
			if (szdoclinksinfo != ""){
				szdoclinksinfo += "^" +adoclinks[i] ;
			}else{
				szdoclinksinfo += adoclinks[i] ;
			}
		}
	}
	 doclinks.value = szdoclinksinfo;
	 G_displaySpnDocLinkInfo();
}
function setDocLinks(){
	var szdoclinksinfo = "";
	if ( doclinks.value != ""){
		var adoclinks = doclinks.value.split("^");
		for(var i=0; i < adoclinks.length ; i ++){
			var adoc = adoclinks[i].split("@@@");
			if (szdoclinksinfo != ""){
				szdoclinksinfo += ",'" +adoc[0]+"'" ;
			}else{
				szdoclinksinfo += "'" + adoc[0]+"'" ;
			}
		}
		//var szURL = "http://"+document.location.host+"/xmlwfform/query/wfform_doclistupdate03.xml?REGISTERED_ID=" + szdoclinksinfo + "&LINK_DOC_NO="+getInfo("fiid");
		//parent.menu.requestHTTP("GET",szURL,false,"text/xml",null,null);
	}
}
// 2006.4.17 사원 이후창 추가
//파일 다운로드 관련 함수 추가
//covidownload컴포넌트 관련
function downloadfile()
{
    
    var szURL="../FileAttach/download.aspx";
    var strphygicalName="";
    var strlocation=""
    //ATTACH_FILE_INFO에서 업로드 파일 정보를 가져온다
    
    if (document.all['ATTACH_FILE_INFO'].value != ""){		
		var r, res;
		var s =document.all['ATTACH_FILE_INFO'].value;
		
		res = /^^^/i;
		attFiles = s.replace(res, "");
		var m_oFileList = new ActiveXObject("MSXML2.DOMDocument");
		m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+attFiles);
		var elmRoot, elmList, elm, elmTaskInfo;
		elmRoot = m_oFileList.documentElement;
		if (elmRoot != null){
			elmList = elmRoot.selectNodes("fileinfo/file");			
			szAttFileInfo = "";
			for (var i=0; i<elmList.length;i++) 
			{
                elm = elmList.nextNode();
				strphygicalName = strphygicalName+ elm.getAttribute("location").substring(elm.getAttribute("location").lastIndexOf("/")+1, elm.getAttribute("location").length)+":"+elm.getAttribute("size") +";" ;
				strlocation = elm.getAttribute("location").substring(0, elm.getAttribute("location").lastIndexOf("/")+1);
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

	
	CoviWindow(szURL,'','280','345', 'fix');

    
}
// 2006.4.17 사원 이후창 추가
//다운로드 관련 창을 띄우기 위해서
//cfl.js에 있는 것과 같다 
//하지만 인클루드가 안되서리 결국 넣어 주었다
function CoviWindow(fileName,windowName,theWidth,theHeight,etcParam) {
	var objNewWin;
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
	if (windowName == "newMessageWindow" || windowName == "") {
		windowName = new String(Math.round(Math.random() * 100000));
	}
	var strNewFearture = ModifyWindowFeature(etcParam + ",width=" + x + ",height=" + y + sz);
    objNewWin = window.open(fileName,windowName,strNewFearture);
    //objNewWin = window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}

// 2006.4.17 사원 이후창 추가
//파일 다운로드 관련 함수 추가
//covidownload컴포넌트 관련
function downloadfile()
{
    
    var szURL="../FileAttach/download.aspx";
    var strphygicalName="";
    var strlocation=""
    //ATTACH_FILE_INFO에서 업로드 파일 정보를 가져온다
    
    if (document.all['ATTACH_FILE_INFO'].value != ""){		
		var r, res;
		var s =document.all['ATTACH_FILE_INFO'].value;
		
		res = /^^^/i;
		attFiles = s.replace(res, "");
		var m_oFileList = new ActiveXObject("MSXML2.DOMDocument");
		m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+attFiles);
		var elmRoot, elmList, elm, elmTaskInfo;
		elmRoot = m_oFileList.documentElement;
		if (elmRoot != null){
			elmList = elmRoot.selectNodes("fileinfo/file");			
			szAttFileInfo = "";
			for (var i=0; i<elmList.length;i++) 
			{
                elm = elmList.nextNode();
				strphygicalName = strphygicalName+ elm.getAttribute("location").substring(elm.getAttribute("location").lastIndexOf("/")+1, elm.getAttribute("location").length)+":"+elm.getAttribute("size") +";" ;
				strlocation = elm.getAttribute("location").substring(0, elm.getAttribute("location").lastIndexOf("/")+1);
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

	
	CoviWindow(szURL,'','280','345', 'fix');

    
}
// 2006.4.17 사원 이후창 추가
//다운로드 관련 창을 띄우기 위해서
//cfl.js에 있는 것과 같다 
//하지만 인클루드가 안되서리 결국 넣어 주었다
function CoviWindow(fileName,windowName,theWidth,theHeight,etcParam) {
	var objNewWin;
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
	if (windowName == "newMessageWindow" || windowName == "") {
		windowName = new String(Math.round(Math.random() * 100000));
	}
	var strNewFearture = ModifyWindowFeature(etcParam + ",width=" + x + ",height=" + y + sz);
    objNewWin = window.open(fileName,windowName,strNewFearture);
    //objNewWin = window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}
