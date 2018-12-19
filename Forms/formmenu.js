var m_xmlHTTP = CreateXmlHttpRequest();
var m_evalXML = CreateXmlDocument();
var g_szAcceptLang  = "ko";
var m_sReqMode;
var m_oFormEditor;
var m_cvtXML = CreateXmlDocument().createTextNode("");
var m_bApvDirty = false;
var m_bFrmExtDirty = false;
var m_bFrmInfoDirty = false;
var m_bFrmClientFileDitry =false;
var m_sOPubDocNO = ""; 
var m_sAddList="";
var m_ibIdx=0;
var m_bDeputy=false;
var m_oFormReader;
var m_bFileSave = true;
var m_CmtBln =  true;
var m_ApvChangeMode = "";		//	결재선변경 모드값
var m_wfid =""; //현재결재자사번
var m_RejectDocLink="";//반송 원문서 필요 정보
var m_bTabForm = false;//탭형태로 양식 open 여부
var m_FixApvLineData = null; //지정결재선 필요 정보
var m_FixApvLineCTData = ""; //지정결재선 Controller 필요 정보
var m_FixApvLineDAF = null; //지정결재선 DAF 필요 정보
var sgINIListFiles = "";//이민지(2011-01-10): 기존 파일의 쿼리스트링 전송으로 인해 인코딩 문제가 발생 - 수정위해 추가
var a,ua = navigator.userAgent;
this.agent= { 
    safari    : ((a=ua.split('AppleWebKit/')[1])?(a.split('(')[0]).split('.')[0]:0)>=412 ,
    konqueror : ((a=ua.split('Konqueror/')[1])?a.split(';')[0]:0)>=3.4 ,
    mozes     : ((a=ua.split('Gecko/')[1])?a.split(" ")[0]:0) >= 20011128 ,
    opera     : (!!window.opera) && (document.body.style.opacity=="") ,
    msie      : (!!("ActiveXObject" in window))?(!!(new ActiveXObject("Microsoft.XMLHTTP"))):(navigator.appName == 'Microsoft Internet Explorer')?true:false 
} //safari, konqueror, opera url 한글 인코딩 처리를 위해추가
var btoUtf = ((this.agent.safari || this.agent.konqueror || this.agent.opera)?false:true);

var m_KMWebAttURL='http://172.20.2.152/KPlusWebMaeil/Medison/Cabinet/KnowledgeDetail.aspx?oid=';
window.onload = initOnload;
function initOnload() {
	/*
    if (getInfo("fmpf") == "WF_FROM_ISU_ALL_020") {

        document.getElementById("btRejectImg").style.display = "none";
        document.getElementById("spanbtReject").style.display = "none";
        document.getElementById("btRejectLine").style.display = "none";
        
    }
	*/

    if (getInfo("fmpf") == "WF_FORM_COMMON_BUDGET_CHG") {
        document.getElementById("spnReceipt").style.display = "none";
        document.getElementById("spnReceiptImg").style.display = "none";
        document.getElementById("spnReceiptIine").style.display = "none";
        //document.getElementById("spnApprovalLine").style.display = "none";

        //2016.4.4 PSW 추가
        if (getInfo("mode") == "REDRAFT") {
            //alert("redraft");
            document.getElementById("spnApprovalLineline").style.display = "none";
            document.getElementById("spnApprovalLineImg").style.display = "none";
            document.getElementById("spnApprovalLine").style.display = "none";
        }

    }
	
	if (getInfo("fmpf") == "WF_SLIP") {
        //2016.4.4 PSW 추가
        if (getInfo("mode") == "REDRAFT") {
            if (getInfo("etid") == "ISU_ST") {
                document.getElementById("spnModify").style.display = "";
                document.getElementById("spnModifyImg").style.display = "";
                

            } else {
            document.getElementById("spnModify").style.display = "none";
            document.getElementById("spnModifyImg").style.display = "none";
  
               
            }
        }
      
    }


//    if (getInfo("loct") == "APPROVAL" || getInfo("loct") == "REDRAFT") {
//        fnShowInk_check();
    //    }

    //if (getInfo("fmpf") == "WF_FORM_ISU_ALL_COM010") {  //대내공문일경우 (2012-12-20 HIW)
        document.getElementById("btPrintOnlyBody").style.display = "";  //본문인쇄버튼
    //}

	//연결문서 버튼 기능 우선 숨김 처리..20060831	
	if (getInfo("loct") != "DRAFT" && getInfo("loct") != "TEMPSAVE"){
	    if(getInfo("scPM") == "1" && getInfo("scPMV") != ""){if(getInfo("scPMV").split("^").length > 1){}else{document.getElementById("btPM").style.display="";}}
	} else { document.getElementById("btDocLinked").style.display = ""; document.getElementById("btDocLink").style.display = ""; if (getInfo("scPM") == "1") { document.getElementsByName("btPM")[0].style.display = ""; } }
    if (parent.g_szEditable) { document.getElementById("btDocLinked").style.display = ""; document.getElementById("btDocLink").style.display = ""; document.getElementById("btPreView").style.display = ""; if (getInfo("scPM") == "1") { document.getElementById("btPM").style.display = ""; } }

	if(top.location.href.toUpperCase().indexOf("/FORMS/FORMTAB.ASPX") > -1){m_bTabForm = true; divMenu.childNodes[1].style.width = "990px";	}
	
    if(getInfo("scCMB")==null || getInfo("scCMB")=="0"){
		m_oFormEditor = parent.editor;
		m_oFormReader = parent.reader;
			
		if (parent.admintype != "ADMIN" && getInfo("loct") == "APPROVAL" && (getInfo("mode") == "APPROVAL" || getInfo("mode") == "PCONSULT" || getInfo("mode") == "RECAPPROVAL")) {

		    setApvList();  //로그인자가 대결자인 경우 대결자정보 결재선XML에 추가
		}
		else {
		    document.getElementsByName("APVLIST")[0].value = getInfo("apst");
		}

		if(getInfo("mode")=="DRAFT" ||getInfo("mode")=="TEMPSAVE" || ((getInfo("loct")=="APPROVAL" || getInfo("loct")=="REDRAFT") && getInfo("mode")=="REDRAFT")) setDomainData();
		document.getElementById("RecDeptList").value = getInfo("RECEIVE_NAMES");
		if(getInfo("scSign")=="1"){document.getElementsByName("SIGNIMAGETYPE")[0].value = getInfo("usit");}
		
        initBtn();
		
	    if ((getInfo("loct")=="MONITOR") || (getInfo("loct")=="PREAPPROVAL") || (getInfo("loct")=="PROCESS") || (getInfo("loct")=="COMPLETE") && (getInfo("mode")!="REJECT")){
            if ((getInfo("loct")=="PROCESS") && (getInfo("mode")=="PROCESS" || getInfo("mode")=="PCONSULT" || getInfo("mode")=="RECAPPROVAL" || getInfo("mode")=="SUBAPPROVAL" || getInfo("mode")=="AUDIT") && getInfo("INITIATOR_ID")==getInfo("usid") && getInfo("pfsk") == "T006"){ 
		        m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>"+document.getElementsByName("APVLIST")[0].value);
		        var elmRoot = m_evalXML.documentElement;
		        var elmList = elmRoot.selectNodes("division/step/ou/person[taskinfo/@kind!='charge']");
		        var strDate;
		        for(var i=0; i<elmList.length;i++){
				    var elm = elmList.nextNode();
				    var elmTaskInfo = elm.selectSingleNode("taskinfo");
				    if(elmTaskInfo.getAttribute("datecompleted") != null) {strDate =elmTaskInfo.getAttribute("datecompleted");}
		        }
		        //2006.12.14 by wolf //2006.12.13 by wolf 사용자 문서 조회 및 수정
		        //관리자 모드가 아닐때
		        if(parent.admintype != "ADMIN"){
		            if(strDate == null){
					    document.getElementById("btWithdraw").style.display = ""; //회수
                        //수신처 담당자가 pending 상태일 때는 회수 안됨
                        //수신처 수신함에 pending 일 경우 회수 안됨
                        elmList = elmRoot.selectNodes("division[@divisiontype='receive' and taskinfo/@status='pending']/step/ou");
                        if (elmList.length > 0 )
                        {
 				            document.getElementById("btWithdraw").style.display = "none"; //회수
                        }            
					    
		            }else if (strDate != null && getInfo("scDraftCancel")=="1"){
                        if(elmRoot.selectSingleNode("division[@divisiontype='receive']/step/ou/person[@code = '"+getInfo("usid")+"' and taskinfo/@kind = 'charge']") == null){
		                    document.getElementById("btAbort").style.display = "";		 //진행 중 문서도 취소가 됨
		                }
		            }
		        }	
		         //강제합의
                var m_XML = CreateXmlDocument();
                m_XML.loadXML("<root>" + getInfo("BODY_CONTEXT")+"</root>");
                var strBody = m_XML.documentElement;
                var elmAssist = elmRoot.selectNodes("division[taskinfo/@status='pending']/step[@routetype='assist' and @unittype='ou' and taskinfo/@status='pending']");
                if(elmAssist.length > 0 && getInfo("scForcedConsent")=="1")
                {
                    if(addDate("d",getInfo("scForcedConsentV"),getInfo("INITIATED_DATE"),"-") <= getInfo("svdt").substring(0,10))
                    {
                        document.getElementById("btForcedConsent").style.display="";
                    }
                }	    
		        //합의부서 삭제 - 
                elmAssist = elmRoot.selectNodes("division[taskinfo/@status='pending']/step[@routetype='assist' and @unittype='ou' and taskinfo/@status='pending']/ou[taskinfo/@status='pending']");
                if(getInfo("scDCooRemove") == "1" && elmAssist.length > 0 ){
                    var bPendigOUs = false;
                    for(var ia=0;ia<elmAssist.length  ; ia++){
                        var elmaOU = elmAssist.nextNode();
                        var elmaPerson = elmaOU.selectNodes("person");
                        if(elmaPerson.length == 0 ){
                            bPendigOUs = true;break;
                        }
                    }
                    if(bPendigOUs) document.getElementById("btDCooRemove").style.display = "";
                }
		    }
		}
		if(getInfo("pfsk") == "MONITOR"){ 
			document.getElementById("btRecDept").style.display= "none";document.getElementById("btPrint").style.display = "none"; document.getElementById("btOrder").style.display = "none"; document.getElementById("btReUse").style.display = "none"; document.getElementById("btCirculate").style.display = "none";
			switch (getInfo("loct")){
				case "PREAPPROVAL":document.getElementById("btMonitor").style.display = "none";break;
				case "COMPLETE":document.getElementById("btMonitor").style.display = "";document.getElementById("btExit").alt=gLabel__close2;break; //"미확인 닫기"
			}
		}
        //2007.07.19 by sunny 승인취소 버튼 활성화, 본인 결재 다음에 일반 결재가 있으면서 결재를 하지 않았을 경우 해당 
        if (getInfo("scApproveCancel")=="1" &&( getInfo("pfsk")=="T000" &&  getInfo("loct")=="PROCESS" && getInfo("pfsk")=="T000" && (getInfo("mode")=="PROCESS" || getInfo("mode")=="SUBAPPROVAL" ||  getInfo("mode")=="RECAPPROVAL") && (getInfo("ptid")==getInfo("usid") || getInfo("dptid")==getInfo("usid")))){ 
            m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>"+document.getElementsByName("APVLIST")[0].value);
            var elmRoot = m_evalXML.documentElement;
            var elmList = elmRoot.selectNodes("division[taskinfo/@status='pending' and step/ou/person/@code='"+getInfo("usid")+"']/step/ou/person[taskinfo/@kind!='charge' and taskinfo/@kind!='bypass' and taskinfo/@kind!='review' and taskinfo/@kind!='skip']");
            var strDate;
            var bCompleted = false;//사용자 결재완료여부
            var bWICancel = false;//승인취소 버튼 활성화 여부
            for(var i=elmList.length-1; i>=0;i--){
            var elm = elmList[i];//elmList.nextNode();
            var elmTaskInfo = elm.selectSingleNode("taskinfo");
            if(elmTaskInfo.getAttribute("status") == "inactive"){//문서를 받지 않은 경우
            }else{
                if(elmTaskInfo.getAttribute("status") == 'reserved'){//보류
                    bCompleted = true;
                    break;
                }else if(elmTaskInfo.getAttribute("status") == 'pending'){//대기 일반결재일때만 승인취소가능
                    if(elm.parentNode.parentNode.getAttribute("routetype") != "approve"){
                        bWICancel = false; break;
                    }else{
                        bCompleted = false;
                    }
                }else if(bCompleted == false && elmTaskInfo.getAttribute("datecompleted") != null && elm.getAttribute("code") == getInfo("usid")){
                    bWICancel = true; break;
                }else{
                    bWICancel = false; break;
                }
            }
            }
            //합의/감사 일 대 같은 Process내의 결재만 결재취소 버튼 활성화2008.10
            var elmNode = elmRoot.selectSingleNode("division[taskinfo/@status='pending']/step/ou[taskinfo/@status='pending']");
            if(elmNode != null && elmNode.parentNode.getAttribute("routetype") != "approve"){ //합의/감사/감시
                bWICancel = false;
            }

            if(getInfo("mode") == "SUBAPPROVAL"){
                elmList = elmRoot.selectNodes("division[taskinfo/@status='pending' and step/ou/person/@code='"+getInfo("usid")+"']/step/ou[taskinfo/@piid='"+getInfo("piid").toUpperCase() +"']/person[taskinfo/@kind!='charge' and taskinfo/@kind!='bypass' and taskinfo/@kind!='review' and taskinfo/@kind!='skip']");
                if(elmList.length > 0){
                     bCompleted = false;
                    for(var i=elmList.length-1; i>=0;i--){
                        var elm = elmList[i];//elmList.nextNode();
                        var elmTaskInfo = elm.selectSingleNode("taskinfo");
                        if(elmTaskInfo.getAttribute("status") == "inactive"){//문서를 받지 않은 경우
                        }else{
                            if(elmTaskInfo.getAttribute("status") == 'reserved'){//보류
                                bCompleted = true;
                                break;
                            }else if(elmTaskInfo.getAttribute("status") == 'pending'){//대기 일반결재일때만 승인취소가능
                                if(elm.parentNode.parentNode.getAttribute("routetype") != "approve"){
                                    bWICancel = false; break;
                                }else{
                                    bCompleted = false;
                                }
                            }else if(bCompleted == false && elmTaskInfo.getAttribute("datecompleted") != null && elm.getAttribute("code") == getInfo("usid")){
                                bWICancel = true; break;
                            }else{
                                bWICancel = false; break;
                            }
                        }
                    }
                }else{
                    bWICancel = false;
                }
            }

            //수신처 담당자가 pending 상태일 때는 회수 안됨
            elmList = elmRoot.selectNodes("division[@divisiontype='receive' and taskinfo/@status='pending']/step/ou/person[taskinfo/@kind='normal']");
            if (elmList.length > 0 )
            {
                elmList = elmRoot.selectNodes("division[@divisiontype='receive' and taskinfo/@status='pending']/step/ou/person[taskinfo/@kind='charge']");
                if (elmList.length == 0 )
                {
                    bWICancel = false;
                }
            }
            //수신처 수신함에 pending 일 경우 회수 안됨
            elmList = elmRoot.selectNodes("division[@divisiontype='receive' and taskinfo/@status='pending']/step/ou");
            if (elmList.length > 0 )
            {
                elmList = elmRoot.selectNodes("division[@divisiontype='receive' and taskinfo/@status='pending']/step/ou/person[taskinfo/@kind='charge']");
                if (elmList.length == 0 )
                {
                    bWICancel = false;
                }
            }            
            if (bWICancel){
                document.getElementById("btApproveCancel").style.display = "";
            }
        }

        //코멘트팝업창 띄우기
        //2013-07-11 hyh 수정
        //setTimeout(commentOpen, 1000);
        if (getInfo("apst").indexOf("rejectedto") < 0) {
            setTimeout(commentOpen, 1000);
        }
        //2013-07-11 hyh 수정 끝

        //변경히스토리팝업창 띄우기
        setTimeout(OpenEditHistory, 1000);

	}else{
	    //2006.12.14 by wolf //2006.12.13 by wolf 사용자 문서 조회 및 수정
	    //관리자 모드가 아닐때
	    if(parent.admintype != "ADMIN"){
		    //Legacy일경우 
		    switch(getInfo("loct")){
			    case "DRAFT":
				    document.getElementById("btDraft").style.display= "";	//"기안하기"
				    document.getElementById("btLine").style.display= "";	  //"결재선관리"
				    break;
			    case "APPROVAL": 
				    document.getElementById("btAction").style.display= ""; //"결재하기"
				    break;
			    default:
				    document.getElementById("btLine").style.display= "";		//"결재선관리"
			    break;
		    }
		 }
		  //2006.12.14 by wolf //2006.12.13 by wolf 사용자 문서 조회 및 수정 End
    } //;alert(1330);

    /*2013-12-06 PSW 수정*/
    //임시함에서는 출력/출력미리보기/인쇄버튼 안보이게 (2013-02-27 HIW)
    if (getInfo("loct") == "TEMPSAVE") {
        document.getElementById("btPrint").style.display = "none";
        document.getElementById("btPrintView").style.display = "none";
        //document.getElementById("btPrintOnlyBody").style.display = "none";
    }

}

function commentOpen()
{//미결 혹은 재기안으로 문서를 열 경우 의견이 있는 경우 의견 창 display 20080919
    if(getInfo("loct") == "APPROVAL" || getInfo("loct") == "REDRAFT"){
		  m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>"+document.getElementsByName("APVLIST")[0].value);
      var elmRoot = m_evalXML.documentElement;
      var elmList;
      if (!this.agent.msie) {
          
        elmList = elmRoot.selectNodes("division/step/ou/*[name()='person' or name()='role']/taskinfo/comment");
    } else {
         
        //elmList = elmRoot.selectNodes("division/step/ou/(person|role)/taskinfo/comment");

        if (gProcessKind = "Cooperate") 
        {

            $($.parseXML(elmRoot.xml)).find("division").each(function () {
                /*
                if ($(this).attr("divisiontype") == "receive") {
                $(this).find("step").each(function (j, stepNode) {
                if ($(stepNode).find("person").attr("code") == getInfo("ptid"))
                sRecDeptUserYN = "Y";
                });
                }
                */
                if ($(this).attr("divisiontype") == "receive" && $(this).attr("oucode") == getInfo("dpid")) 
                {

                    elmList = elmRoot.selectNodes("division[@divisiontype='receive']/step/ou/(person|role)/taskinfo/comment");
                }
                else 
                {
                    elmList = elmRoot.selectNodes("division/step/ou/(person|role)/taskinfo/comment");
                }
            });
             
        }
        else
        {

            elmList = elmRoot.selectNodes("division/step/ou/(person|role)/taskinfo/comment");

        }

      }
    //if (elmList.length > 0) {
    if (elmList.length > 0) {  //위구문 주석처리후 추가 (2012-11-23 HIW)
           
		    var sUrl2="../Comment/comment_view.aspx?form_inst_id=" + getInfo("fiid");
		    var strNewFearture = ModifyWindowFeature("toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=550,height=450");
            window.open(sUrl2,"",strNewFearture);
            //window.open(sUrl2,"","toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=550,height=450");
	    }
    }
}


//변경히스토리 창띄우기 (2013-02-22 HIW)
function OpenEditHistory() { //debugger;
   
    if (getInfo("loct") == "APPROVAL" || getInfo("loct") == "REDRAFT") {

        if (getInfo("mode") != "RECAPPROVAL" && getInfo("mode") != "SUBAPPROVAL" && getInfo("mode") != "REDRAFT") {  //수신부서내결재 or 합의부서내결재가 아닌경우 ([COVI_FLOW_FORM_INST].[dbo].[WF_FORM_HISTORY_WF_양식테이블명] --> 수신부서에서 내부결재로 재기안하는경우 이테이블에 무조건 들어가므로 수신부서내결재에서는 아예 안보여주게하기위함)

            var url = "/CoviWeb/Approval/CallBack.aspx";
            var param = "CODE=62&fiid=" + getInfo("fiid") + "&fmpf=" + getInfo("fmpf") + "&fmrv=" + getInfo("fmrv");

            var xml = DoCallback(url, param);
            var result = xml.responseXML;
            var vHistoryCnt = 0;

            var elmRoot = result.documentElement;
            //debugger;
            if (SelectSingleNode(elmRoot, "result") != "SUCEESS") {
                alert("[Error]\n\r\n\r" + SelectSingleNode(elmRoot, "result"));
                return;
            }
            else {
                var vRtnVal = "";
                try {
                    if ($(elmRoot).find("Table").length > 0) {
                        $(elmRoot).find("Table").each(function (i) {

                            vHistoryCnt++;
                        });
                    }
                } catch (e) {
                    alert(e.message);
                }
            }

            if (vHistoryCnt > 0) {
                var sUrl = "HistoryList.aspx?fiid=" + getInfo("fiid") + "&fmpf=" + getInfo("fmpf") + "&fmrv=" + getInfo("fmrv");
                var strNewFearture = ModifyWindowFeature("toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=880,height=670");
                window.open(sUrl, "", strNewFearture);
                //window.open(sUrl2,"","toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=550,height=450");
            }
        }
    }
}

function setApvDirty(){m_bApvDirty=true;}
function setApvChangeMode(pMode){m_ApvChangeMode=pMode;}	//결재선변경 모드
function getInfo(sKey){try{return parent.g_dicFormInfo.item(sKey);}catch(e){alert(gMessage254+sKey+gMessage255);}} //"양식정보에 없는 키값["+sKey+"]입니다."
function setInfo(sKey,sValue){
	try{	
		if(parent.g_dicFormInfo.Exists(sKey))	parent.g_dicFormInfo.Remove(sKey);
		parent.g_dicFormInfo.Add(sKey,sValue);
	}catch(e){alert(gMessage254+sKey+gMessage255);} //"양식정보에 없는 키값["+sKey+"]입니다."
}

//2007-10-15 미리보기 창에서 하던 함수를 수정함
function setPreView()   
{document.body.focus();
	var sFormXml = parent.parent.opener.m_oFormEditor.getFormXML();
	if(sFormXml.indexOf("<BODY_CONTEXT>") == -1){
		sFormXml = sFormXml.replace("</formdata>","");
		sFormXml += makeNode("BODY_CONTEXT",getInfo("BODY_CONTEXT"));
		sFormXml += "</formdata>";
	}
	var xmlFormXML= CreateXmlDocument();
	xmlFormXML.loadXML(sFormXml);
	var FormNodes = xmlFormXML.documentElement.childNodes; 
	var FormNode;
	for (var i=0; i < FormNodes.length ; i++){
		FormNode = FormNodes[i];
		setInfo(FormNode.nodeName, FormNode.text);
	}
	setInfo("INITIATED_DATE",getInfo("svdt"));
	g_szEditable = false;
	setInfo("mode","COMPLETE");
	setInfo("loct","COMPLETE");
	document.getElementsByName("APVLIST")[0].value =parent.parent.opener.document.getElementsByName("APVLIST")[0].value;
	parent.frames[1].height = "100%";
	parent.editor.location.href = getInfo("fmpf")+'_V' + getInfo("fmrv")+"_read.htm";
	setTimeout("setHeader()",1000);
	var aBtn = document.getElementsByName("cbBTN");
	for(var i = 0; i < aBtn.length;i++){
	    aBtn[i].style.display = "none";
	}
	document.getElementById("btPrint").style.display = "";
	document.getElementById("btPrintView").style.display = "";          
	document.getElementById("btExitPreView").style.display = "";    
    
    clearInterval(timerID);
}

function setHeader(){
    try {
        parent.editor.G_displaySpnDocLinkInfo();
        parent.document.body.focus(); // 작성창에서 미리보기시 포커스가 작성창으로 가는 문제 때문에 현페이지로 포커스를 다시 가져옴 (2013-04-05 leesh)
        
    }catch(e){}
}


function initBtn(){//debugger;
    if(getInfo("fmpf").indexOf("CNM") > -1)
    {
        document.getElementById("btHistory").style.display = "none";document.getElementById("li_btHistory").style.display="none";
    }
    
    if(getInfo("readtype") == "preview") //미리보기 창인지 검증
    {   
        document.getElementById("btExit").style.display = "none"; // 닫기 버튼은 항상 디스플레이
        document.getElementById("btHistory").style.display = "none";document.getElementById("li_btHistory").style.display="none";document.getElementById("btBBS").style.display = "none";document.getElementById("btMail").style.display = "none";
        try { document.getElementById("btDocLink").style.display = "none"; document.getElementById("btPreView").style.display = "none"; document.getElementById("btPM").style.display = "none"; } catch (e) { }
        timerID = setInterval("setPreView()",1000);
        
        return;
    }
	var strRecDept = (getDisplayMode(getInfo("mode"),'scIPub')=="none")?"none":getDisplayMode(getInfo("mode"),'scIPub');
	var strPrint="none";	
	document.getElementById("chk_urgent").disabled = true;	document.getElementById("chk_secrecy").disabled = true;    document.getElementById("chk_edmschk").disabled = true;
	
    switch(getInfo("loct")){
		case "PREAPPROVAL":
		case "PROCESS":
		    
            //2009.02 : 회신옵션 추가
		    if(getInfo("scReply") == "1"){
                //document.getElementById("reform").style.display = "";document.getElementById("li_reform").style.display = "";
                
                if(getInfo("REPLY") =="1"){
                    document.getElementById("chk_reform").checked = true;
                }
                document.getElementById("chk_reform").disabled  = true;
            }
		case "COMPLETE":
			if(getInfo("loct")=="COMPLETE" && getInfo("pfsk")!="T010") {document.getElementById("li_btCirculate").style.display="";document.getElementById("btCirculate").style.display=""; document.getElementById("btCirculate_View").style.display="";document.getElementById("li_btCirculate_View").style.display="";}
			if(getInfo("loct")=="COMPLETE") {		       
		       document.getElementById("btPcSave").style.display="";document.getElementById("btMailSend").style.display="none";document.getElementById("btUrl").style.display=""; 
		    }
		    if (getInfo("fmusyn") == "1") { document.getElementById("btReUse").style.display = "none"; }
 
		    //2009.02 : 회신옵션 추가
		    if(getInfo("scReply") == "1" ){  // scReply(스키마 회신기능) 이 1 
                //document.getElementById("reform").style.display = "";document.getElementById("li_reform").style.display = "";
                
                if( getInfo("pfsk") =="R" || getInfo("pfsk") =="REQCMP"){ //pfsk 가 REQCMP(부서 접수완료함일때)
                    if(getInfo("REPLY") =="1"){
                        document.getElementById("chk_reform").checked = true;
                        document.getElementById("btReturnForm").style.display = "";
                    }
                    else
                    {
                        document.getElementById("chk_reform").checked = false;
                    }
                }
                else
                {
                  if(getInfo("REPLY") =="1"){
                        document.getElementById("chk_reform").checked = true;
                    }  
                }
                document.getElementById("chk_reform").disabled  = true;
            }
		case "CANCEL":
		case "JOBDUTY":
		case "REVIEW":
		case "REJECT":
		    displayBtn("none", "none", "none", "none", "", "none", "none", "none", "none", "none", "none", "none", "none", getInfo("loct") == "COMPLETE" ? "" : "none", "none", "none");
		    strPrint = "";
		    document.getElementById("btPrint").style.display = strPrint; //출력
		    document.getElementById("btPrintView").style.display = strPrint; //출력미리보기

            //20150105 전표양식만 완료함에서 재사용 금지 추가
		    if ((getInfo("loct") == "COMPLETE" || getInfo("loct") == "REJECT") && getInfo("INITIATOR_ID") == getInfo("usid")) {
		        if (getInfo("fmpf") == "WF_SLIP" || getInfo("fmpf") == "WF_FORM_COMMON_BUDGET_CHG" || getInfo("fmpf") == "WF_ORDER"  || getInfo("fmpf") == "WF_FORM_ISU_ST_30" || getInfo("fmpf") == "WF_FORM_ISU_ST_33" || getInfo("fmpf") == "WF_FORM_ISU_CH_COM0030") {
		            document.getElementById("btReUse").style.display = "none";
		        }
		        else 
		        {
		            document.getElementById("btReUse").style.display = "";
		        }

		    }
		    //20150105 전표양식만 완료함에서 재사용 금지 추가 끝


		    //20170102 휴가(취소)신청서 완료함에서 재사용 금지 추가 PSW
		    if ((getInfo("loct") == "COMPLETE" || getInfo("loct") == "REJECT") && getInfo("INITIATOR_ID") == getInfo("usid")) {
		        if (getInfo("fmpf") == "WF_SLIP" || getInfo("fmpf") == "WF_FORM_COMMON_VACATION" || getInfo("fmpf") == "WF_FORM_COMMON_VACA_REGIST" || getInfo("fmpf") == "WF_FORM_COMMON_VACA_CANCEL" || getInfo("fmpf") == "WF_ORDER" ) { //
		            document.getElementById("btReUse").style.display = "none";
		        }
		        else {
		            document.getElementById("btReUse").style.display = "";
		        }

		    }
		    //끝
		    
		    
		    //if ((getInfo("loct") == "COMPLETE" || getInfo("loct") == "REJECT") && getInfo("INITIATOR_ID") == getInfo("usid")) document.getElementById("btReUse").style.display = ""; 20150105 전표양식 완료시 재사용 금지
		    if (getInfo("fmusyn") == "1") { document.getElementById("btReUse").style.display = "none"; }

		    document.getElementById("btCommentView").style.display = ""; document.getElementById("li_btCommentView").style.display = ""; //btCirculate_View.style.display="";			
		    if ((getInfo("loct") == "COMPLETE")) {
		        //대외공문의 경우 추가기능 활성화
		        if (getInfo("scOPub") == "1") { document.getElementById("btExt").style.display = "none"; document.getElementById("btOTransMail").style.display = ""; }
		    }
		    else { document.getElementById("btBBS").style.display = "none"; } //btCirculate_View.style.display="";
		    if ((getInfo("loct") == "COMPLETE") && getInfo("mode") == "COMPLETE") { if (getInfo("scIPub") == '1' || getInfo("scOPub") == '1') { document.getElementById("btReceiptView").style.display = ""; document.getElementById("li_btReceiptView").style.display = ""; } }
		    //2008.02.21 조회 버튼 활성화 추가, 백종기
		    if (document.getElementById("btCommentView").style.display != "none" || document.getElementById("btCirculate_View").style.display != "none" || document.getElementById("btHistory").style.display != "none" || document.getElementById("btReceiptView").style.display != "none") {
		        document.getElementById("btView").style.display = "none";
		    }

		    //의견버튼 추가 : 2008.09 완료된 문서에 기안자+결재자에 한해서 의견 추가
		    if ((getInfo("loct") == "COMPLETE" && getInfo("mode") == "COMPLETE") && getInfo("scCmtAdd") == "1" && (getInfo("pfsk") == "T000" || getInfo("pfsk") == "T004" || getInfo("pfsk") == "T006" || getInfo("pfsk") == "T009" || getInfo("pfsk") == "T016")) {
		        document.getElementById("btComment").style.display = "";
		        document.getElementById("btCommentView").style.display = "";
		        document.getElementById("li_btCommentView").style.display = "";
		    }
		    //feedback버튼 추가 : 2010.12 기안자한테 feedback 문서에 한해서
		    if (getInfo("loct") == "COMPLETE" && getInfo("mode") == "COMPLETE" && getInfo("scFeedback") == "1" && getInfo("feedback") == "1" && getInfo("INITIATOR_ID") == getInfo("usid")) {
		        document.getElementById("btCommentFeedback").style.display = "";
		    }
		    break;
		case "ADMINEDMS":document.getElementById("bt_adminedms").style.display = "";break;
		case "DRAFT": 
		    //2009.02 : 회신옵션 추가
		    if(getInfo("scReply") == "1"){
		        //document.getElementById("reform").style.display = "";document.getElementById("li_reform").style.display = "";
		        document.getElementById("btReturnForm").style.display = "none"; //회신버튼
		        document.getElementById("btReceiptView").style.display = "none";document.getElementById("li_btReceiptView").style.display = "none";//수신현황버튼
		        document.getElementById("chk_reform").checked = false;
		        document.getElementById("chk_reform").disabled  = false;
		    }
		    if(getInfo("scOPub") == "1"){document.getElementById("btOTransPV").style.display="";}
		case "PREDRAFT":
		case "TEMPSAVE":			
            displayBtn("", "none", getDisplayMode(getInfo("mode"), 'scEdms'), "none", "", "none", "none", "none", "none", "", "none", "", "", "none", "none", "none");		

			document.getElementById("chk_secrecy").disabled = false;	document.getElementById("chk_edmschk").disabled = false;	document.getElementById("chk_urgent").disabled = false;
			document.getElementById("btComment").style.display="none";document.getElementById("btHistory").style.display = "none";document.getElementById("li_btHistory").style.display="none";	document.getElementById("btBBS").style.display = "none";document.getElementById("btMail").style.display = "none";
			
			//2008.02.21 첨부 버튼 활성화 추가, 백종기
			document.getElementById("btAttached").style.display= "";	document.getElementById("btView").style.display= "none";
			
			//2011.09.14 회수 버튼 활성화 추가 시작, 이은정
			 if(getInfo("scReply") == "1"){
                //document.getElementById("reform").style.display = "";document.getElementById("li_reform").style.display = "";
                
                if(getInfo("REPLY") =="1"){
                    document.getElementById("chk_reform").checked = true;
                }else{
                    document.getElementById("chk_reform").checked = false;
                }
                document.getElementById("chk_reform").disabled  = false;
            }		
            //2011.09.14 회수 버튼 활성화 추가 끝, 이은정			
			break;
        case "REDRAFT":
            //2009.02 : 회신옵션 추가
            if (getInfo("scReply") == "1") {  // scReply(스키마 회신기능) 이 1 
                //document.getElementById("reform").style.display = "";document.getElementById("li_reform").style.display = "";

                if (getInfo("REPLY") == "1") {
                    document.getElementById("chk_reform").checked = true;
                }
                document.getElementById("chk_reform").disabled = true;
            }
            //=== 신청/협조프로세서 문서일경우 접수버튼->결재 결재선버튼->내부결재로 변경 (2012-11-14 HIW) ======
            var vProcessKind = "";
            if (getInfo("scDRec") == "0" && getInfo("scChgr") == "0" && getInfo("scPRec") == "0" && getInfo("scChgrOU") == "0" && getInfo("scIPub") == "0" && getInfo("scGRec") == "0")  //품의프로세스인 경우 (HIW)
            {
                vProcessKind = "Draft";
                //2014-01-16 hyh 추가
                document.getElementById("btModify").style.display = "";
                //2014-01-16 hyh 추가 끝
            }
            else { //신청프로세스, 협조프로세스
                vProcessKind = "NonDraft";
                //document.getElementById("spnReceipt").innerHTML = gLabel_Approval2;  //이름변경안하기로 함 (2013-03-05)
                //document.getElementById("spnApprovalLine").innerHTML = gLabel_InnerApproval; 
            }
            //===============================================================================================
        case "APPROVAL":
            switch (getInfo("mode")) {
                case "APPROVAL": //일반결재
                    var strRecDept = (getDisplayMode(getInfo("mode"), 'scIPub') == "none") ? "none" : getDisplayMode(getInfo("mode"), 'scIPub');
                    //2009.02 : 회신옵션 추가	
                    if (getInfo("scReply") == "1") {
                        //document.getElementById("reform").style.display = "";document.getElementById("li_reform").style.display = "";

                        if (getInfo("REPLY") == "1") {
                            document.getElementById("chk_reform").checked = true;
                        }
                        document.getElementById("chk_reform").disabled = true;
                    }
                    displayBtn("none", "none", "none", "none", "", "none", "", "none", "none", "none", "", "none", "none", "none", "none", "none"); //모든 결재자 첨부파일 추가				
                    document.getElementById("btCommentView").style.display = ""; document.getElementById("li_btCommentView").style.display = "";


                    if (getInfo("scCHBis") == "1") {
                        if (!fn_GetReview()) { document.getElementById("btModify").style.display = ""; }
                    } else {
                        document.getElementById("btModify").style.display = "none";
                    }
                    //if(getInfo("scTransfer") == "1" && getInfo("ptid") == getInfo("usid")) document.getElementById("btForward").style.display = ""; //전달버튼 비활성화 20121011
                    break;
                case "AUDIT": //감사
                case "PCONSULT": //개인합의				
                    document.getElementById("btCommentView").style.display = ""; document.getElementById("li_btCommentView").style.display = "";
                    displayBtn("none", "none", "none", "none", "", "none", "", "none", "none", "none", "", "none", "none", "", "", "none");
                    if (getInfo("scTransfer") == "1" && getInfo("ptid") == getInfo("usid")) document.getElementById("btForward").style.display = ""; //전달버튼 활성화
                    break;
                case "RECAPPROVAL": //수신결재				
                    document.getElementById("btCommentView").style.display = ""; document.getElementById("li_btCommentView").style.display = "";
                    if (getInfo("scReply") == "1") {
                        //document.getElementById("reform").style.display = "";document.getElementById("li_reform").style.display = "";

                        if (getInfo("REPLY") == "1") {
                            document.getElementById("chk_reform").checked = true;
                        }
                        document.getElementById("chk_reform").disabled = true;
                    }
                    document.getElementById("btModify").style.display = (getInfo("scRCHBis") == "1") ? "" : "none";
                    displayBtn("none", "none", "none", "none", "none", "none", "", "none", "", "none", "", "none", "none", "none", "none", "none"); //모든 결재자 첨부파일 추가					
                    if (getInfo("scTransfer") == "1" && getInfo("ptid") == getInfo("usid")) document.getElementById("btForward").style.display = ""; //전달버튼 활성화

                    //협조프로세스이고 스키마의 부서내반송에 체크된 경우 (2013-03-07 HIW)
                    if (gProcessKind = "Cooperate" && getInfo("scRJTODept")=="1") {  
                        //document.getElementById("btReject").style.display = "none";
						//협조프로세스이고 스키마의 부서내반송에 체크된 경우 (2014-02-1 LHI)
						document.getElementById("btReject").style.display = "";
                    }
                    break;
                case "SUBAPPROVAL": //부서합의내결재
                    //2014-01-16 hyh 추가 
                    if (getInfo("scDRec") == "0" && getInfo("scChgr") == "0" && getInfo("scPRec") == "0" && getInfo("scChgrOU") == "0" && getInfo("scIPub") == "0" && getInfo("scGRec") == "0")  //품의프로세스인 경우 (HIW)
                    {
                        document.getElementById("btModify").style.display = "";
                    }
                    //2014-01-16 hyh 추가 끝
                    if (getInfo("scTransfer") == "1" && getInfo("ptid") == getInfo("usid")) document.getElementById("btForward").style.display = ""; //전달버튼 활성화
                    displayBtn("none", "none", "none", "none", "none", "none", "", "none", "", "none", "", "none", "none", "", "", "none"); break;
                case "DEPART": //부서
                    break;
                case "CHARGE": //담당자				
                    document.getElementById("btCommentView").style.display = ""; document.getElementById("li_btCommentView").style.display = "";
                    displayBtn("none", "none", "none", "none", "none", "none", "", "none", "none", "none", "", "none", "none", "", "", "none"); break;
                case "REDRAFT": //재기안
                    var sdisplay = "";
                    var sAttDisplay = "";
                    if (getInfo("pfsk") == "T008") {
                        displayBtn("none", "none", "none", "none", "", "none", "", "none", "none", "none", "", (getInfo("scCHBis") == "1") ? "" : "none", "none", "none", "none", "none");
                    } else {
                        sAttDisplay = "";
                        //2009.02 : 문서관리자 권한 설정
                        if (getInfo("scRec") == "1") {
                            sdisplay = "none";
                            sAttDisplay = "none";
                            if (getInfo("usismanager") == "true" || getInfo("usisdocmanager") == "true" || getInfo("dpisdocmanager") == "false") {
                                if (getInfo("ptid") == getInfo("pfpfid")) {
                                    document.getElementById("btRec").style.display = "";
                                } else {
                                    document.getElementById("btRec").style.display = "none";
                                }
                            }
                        }
                        if (getInfo("scRecBtn") == "1") { sdisplay = ""; sAttDisplay = ""; document.getElementById("btCharge").style.display = ""; }
                        if (getInfo("loct") == "REDRAFT" && getInfo("mode") == "REDRAFT") {//신청서 수신함 조회 시
                            displayBtn("none", "none", "none", "none", "none", "none", "", "none", "", "none", "", "none", "none", "none", "none", "none"); //모든 결재자 첨부파일 추가					
                            //2009.02 : 문서관리자 권한 설정
                            if (getInfo("usismanager") == "true" || getInfo("usisdocmanager") == "true" || getInfo("dpisdocmanager") == "false") {
                                if (getInfo("scRecBtn") == "1") document.getElementById("btCharge").style.display = "";
                                document.getElementById("btLine").style.display = "none";
                                document.getElementById("btDeptLine").style.display = "";
                                if (getInfo("scRCHBis") == "1") { btModify.style.display = ""; } //2009.01 광주은행 요청사항 접수상태서 내용 변경 가능하도록
                            } else {
                                document.getElementById("btCharge").style.display = "none";
                                document.getElementById("btLine").style.display = "none";
                                document.getElementById("btDeptLine").style.display = "none";
                            }
                        } else {
                            displayBtn("none", "none", "none", "none", "none", "none", "none", "none", sdisplay, "none", "none", sAttDisplay, "none", "", "", "none");
                        }
                    }
                    document.getElementById("btCommentView").style.display = ""; document.getElementById("li_btCommentView").style.display = "";
                    document.getElementById("btModify").style.display = (getInfo("scRCHBis") == "1") ? "" : "none";
                    break;
                case "SUBREDRAFT": //합의재기안
                    if (getInfo("scRecBtn") == "1") document.getElementById("btCharge").style.display = ""; if (getInfo("scTransfer") == "1") document.getElementById("btForward").style.display = "";
                    displayBtn("none", "none", "none", "none", "none", "none", "none", "none", "", "none", "none", "none", "none", "none", "", "none");
                    if (getInfo("usismanager") == "true" || getInfo("usisdocmanager") == "true" || getInfo("dpisdocmanager") == "false") {
                        if (getInfo("scTransfer") == "1") document.getElementById("btForward").style.display = "";
                        if (getInfo("scRecBtn") == "1") document.getElementById("btCharge").style.display = "";
                        document.getElementById("btLine").style.display = "none"; //"결재선관리"
                        displayBtn("none", "none", "none", "none", "none", "none", "none", "none", "", "none", "none", "none", "none", "none", "", "none");
                    } else if (getInfo("pfsk") == "T008") {
                        document.getElementById("btCharge").style.display = "";
                        document.getElementById("btLine").style.display = "none"; //"결재선관리"
                        displayBtn("none", "none", "none", "none", "none", "none", "none", "none", "", "none", "none", "none", "none", "none", "", "none");
                    } else {
                        document.getElementById("btCharge").style.display = "none";
                        document.getElementById("btLine").style.display = "none";
                        document.getElementById("btDeptLine").style.display = "none";
                    }
                    break;
                case "TRANS": //변환
                    displayBtnTrans(); break;
                case "SIGN": //직인처리
                    displayBtnTrans(); break;
            }
            //20110318 확인결재추가
            if (getInfo("pfsk") == "T019") document.getElementById("btModify").style.display = "none";
            break;	
	}
	if(getInfo("loct")=="CCINFO"){
	    document.getElementById("btPcSave").style.display = "";
    }
	
	if(getInfo("scSecrecy") == "1") { document.getElementById("secrecy").style.display = "" ;document.getElementById("li_secrecy").style.display = "" ;}
	if(getInfo("scEdmsUser") == "1")  { document.getElementById("edmschk").style.display = "" ;document.getElementById("li_edmschk").style.display = "" ;}
	
	//feedback 활성화
	if(getInfo("scFeedback") == "1") { 
	    if(getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || (getInfo("mode") == "APPROVAL" && getInfo("feedback") == "1")){
	        document.getElementById("feedback").style.display = "" ;document.getElementById("li_feedback").style.display = "" ;
	    }
	}
	//옵션 활성화
	if(getInfo("scSecrecy") == "1" || document.getElementById("urgent").style.display == ""){
		document.getElementById("btOption").style.display = "none";
	}else{
		document.getElementById("btOption").style.display = "none";
	}
	//수신 시에 담당자지정 버튼은 스키마에 담당자 또는 담당부서가 지정되어 있는 경우에 한함.
	//다중 수신 시에 타부서 담당자로 담당자를 지정하는 경우에는 지정된 담당자가 자신이 처리해야할
	//수신부서 정보를 찾아오지 못하기 때문(자신이 처리해야 할 수신부서 정보는 자신이 속한 결재조직의
	//코드로 찾아옴). 
	if(getInfo("mode") == "REDRAFT" && (getInfo("scChgr")=="1" || getInfo("scChgrOU")=="1")){
		//btCharge.style.display = "";
	}
	//완료 후 나타나는 버튼 활성화 시 묶음 활성화
	if(document.getElementById("btCirculate").style.display == "" || document.getElementById("btBBS").style.display == "" || document.getElementById("btMail").style.display == "" || document.getElementById("bt_receive_cc").style.display == ""){
	    //document.getElementById("btEtcDo").style.display = "block"; (양식상단의 회람버튼)
	}else{
	    document.getElementById("btEtcDo").style.display = "none";
	}
	
	//관리자 추가 기능 2008.08
	if(parent.admintype == "ADMIN"){
	   switch(getInfo("loct")){
	    case "PREAPPROVAL":
	    case "APPROVAL":
	    case "PROCESS":
	        if(getInfo("mode") == "PROCESS"){
                m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>"+document.getElementsByName("APVLIST")[0].value);
                var elmRoot = m_evalXML.documentElement;
                var strDate;
                 //합의부서 삭제 - 
                var elmAssist = elmRoot.selectNodes("division[taskinfo/@status='pending']/step[@routetype='assist' and @unittype='ou' and taskinfo/@status='pending']/ou[taskinfo/@status='pending']");
                if(getInfo("scDCooRemove") == "1" && elmAssist.length > 0 ){
                    var bPendigOUs = false;
                    for(var ia=0;ia<elmAssist.length  ; ia++){
                        var elmaOU = elmAssist.nextNode();
                        var elmaPerson = elmaOU.selectNodes("person");
                        if(elmaPerson.length == 0 ){
                            bPendigOUs = true;break;
                        }
                    }
                    if(bPendigOUs){
                         document.getElementById("btDCooRemove").style.display = "";
                    }
                }
                if( elmAssist.length == 0 ){//합의단계가 아닐 경우에 결재선 변경 가능
    	            document.getElementById("btAPVLINEModify").style.display="";//결재선변경
                }
	        }else{
	            document.getElementById("btAPVLINEModify").style.display="";//결재선변경
	            if(getInfo("mode") == "APPROVAL" || getInfo("mode")=="RECAPPROVAL" || getInfo("mode")=="SUBAPPROVAL"){
	               //if(getInfo("ptid")==getInfo("pfpfid")) btForward.style.display = "";
	            }
            }
            document.getElementById("btAdminAbort").style.display = ""; //관리자 강제 취소 - 진행 중 문서도 취소가 됨
	        break;
	     
	   }
	   document.getElementById("btModify").style.display= "";//문서편집
	   document.getElementById("btDeleteDoc").style.display="";//문서삭제
	   if (((getInfo("loct") == "COMPLETE" && getInfo("mode") == "COMPLETE" )) || ( getInfo("loct")=="REDRAFT")){if (getInfo("scIPub") == '1' || getInfo("scOPub")=='1'){document.getElementById("btReceiptView").style.display="";document.getElementById("li_btReceiptView").style.display = "";}}            
	   
	}
	
	if((parent.admintype == "ADMIN") && (getInfo("loct") =="APPROVAL" || getInfo("loct") =="REDRAFT") && (getInfo("mode") == "APPROVAL"||getInfo("mode") == "PCONSULT"||getInfo("mode") == "SUBREDRAFT"||getInfo("mode") == "SUBAPPROVAL"||getInfo("mode") == "RECAPPROVAL")){
	    document.getElementById("btForward").style.display = "";
	}

	//크롬에서 인쇄버튼 안보이게 처리 (HIW)
	if(_Browser == "CHROME")
	    document.getElementById("btPrint").style.display = "none";

	//2013-09-25 hyh 추가
    if (getInfo("loct") == "SHARE") {
	    document.getElementById("li_btCirculate").style.display = "";
	    document.getElementById("btCirculate").style.display = "";
	    document.getElementById("li_btCirculate_View").style.display = "";
	    document.getElementById("btCirculate_View").style.display = "";
	}
	//2013-09-25 hyh 추가 끝
}

function displayBtn(sDraft,schangeSave,sDoc,sPost,sLine,sRecDept,sAction,sDeptDraft,sDeptLine,sSave,sMail,sAttach, sPreview, sCommand, sRec, sTempMemo){
    document.getElementById("btDraft").style.display= sDraft;//"기안하기"
	//2006.09.19 김현태 btchangeSave 제어는 initBtn() 에서 처리
	//btchangeSave.style.display= "none"; //schangeSave;//"수정"
	//btDoc.style.display= sDoc;//"문서정보"
	document.getElementById("btPost").style.display= sPost;//"게시"
	document.getElementById("btLine").style.display= sLine;//"결재선관리"
	document.getElementById("btRecDept").style.display= sRecDept;//"수신처지정"
	document.getElementById("btAction").style.display= sAction;//="결재하기"
	//if(getInfo("usid") == getInfo("ptid")  && getInfo("pfsk")=="T009") document.getElementById("btForward").style.display= sAction;//합의자일경우에만 전달버튼 활성화
	document.getElementById("btDeptDraft").style.display= sDeptDraft;//"재기안"
	document.getElementById("btDeptLine").style.display= sDeptLine;//"내부결재선관리"
	document.getElementById("btSave").style.display= sSave;//"임시저장"
	//document.getElementById("btMail").style.display= "none";//"메일보내기"sMail;//테스트 진행중 신택상
	document.getElementById("btAttach").style.display= sAttach;//"파일첨부"
	//document.getElementById("btEDMSAttach").style.display= sAttach;//"파일첨부"
	document.getElementById("btPreView").style.display= sPreview;//"미리보기"
	if(parent.g_szEditable) document.getElementById("btPreView").style.display="";
	//document.getElementById("btOrder").style.display = sCommand;//업무지시
	//document.getElementById("btCirculate").style.display = sCommand;//회람
	//btRec.style.display=sRec;
	document.getElementById("btnTempMemo").style.display= sTempMemo;//"임시메모"
	
	//기밀문서 권한 지정
	if(getInfo("secdoc")=="1"){
		document.getElementById("chk_secrecy").checked = true;		
	}
	
	//'문서이관' 체크박스 상태값 확인 2005.08.03 박형진 추가
	if(getInfo("edms_document")=="1"){ 
		document.getElementById("chk_edmschk").checked = true; 
	}
	document.getElementById("urgent").style.display = "";document.getElementById("li_urgent").style.display = "";//sDraft; //긴급결재 기안시 지정
	if(getInfo("pipr")=="5") document.getElementById("chk_urgent").checked = true;	//긴급결재 기안시 지정
	
	if(getInfo("scApv")=="1" && sAction == "")  //개별버튼사용시 
	{	
		document.getElementById("btAction").style.display= "none";//="결재하기"
		var bReviewr = fn_GetReview();
		if(getInfo("mode") == "REDRAFT" || getInfo("mode") == "SUBREDRAFT"){
		    if(getInfo("pfsk") == "T008"){ //담당자 재기안일 경우 결재버튼 활성화
				document.getElementById("btApproved").style.display= "";
				if(!bReviewr) document.getElementById("btReject").style.display= "";
		    }
		}else{
		    //20110318 확인결재추가
		    if(getInfo("pfsk") == "T019"){//확인결재
		        document.getElementById("spanbtApproved").innerHTML  = gLabel_confirm;
		        document.getElementById("btApproved").style.display= "";
		    }else{
		        document.getElementById("btApproved").style.display= "";
		        if(!fn_GetReview()) document.getElementById("btReject").style.display= "";
		    }
		}
		switch (getInfo("mode")) {
	        case "AUDIT":
        		if(getInfo("scHold")=="1" && getInfo("ptid") == getInfo("usid") ){ document.getElementById("btHold").style.display= "";}
		        if(getInfo("scRJTO") == "1" && fn_checkrejectedtoA()){ document.getElementById("btRejectedto").style.display="";}
		        break;
		    case "PCONSULT":
		        if (getInfo("pfsk") == "T009") {
		            document.getElementById("spanbtApproved").innerHTML = gLabel_agree;
		            document.getElementById("spanbtReject").innerHTML = gLabel_objection;  //gLabel_disagree;  //"반송"을 "이의"로 변경 HIW
		        }
		        if (getInfo("scHold") == "1" && getInfo("ptid") == getInfo("usid") && getInfo("pfsk") != "T019") { document.getElementById("btHold").style.display = ""; }
		        break;
	        case "SUBAPPROVAL": //합의부서내 결재
		        //if(getInfo("scRJTO") == "1" && fn_checkrejectedtoA()){ document.getElementById("btRejectedto").style.display="";} 주석처리 20151229 지정반송
           	    if(getInfo("scHold")=="1" && getInfo("ptid") == getInfo("usid") && getInfo("pfsk") != "T019"){ document.getElementById("btHold").style.display= "";}
		        break;
	        case "RECAPPROVAL": //수신부서내 결재
		        if(getInfo("scRJTO") == "1" && fn_checkrejectedtoA()){ if(!bReviewr) document.getElementById("btRejectedto").style.display="";}
		        if(getInfo("scRJTODept") == "1"){ if(!bReviewr) document.getElementById("btRejectedtoDept").style.display="";}
        		if(getInfo("scHold")=="1" && getInfo("ptid") == getInfo("usid") && getInfo("pfsk") != "T019" ){ if(!bReviewr) document.getElementById("btHold").style.display= "";}
		        break;
	        case "APPROVAL":
		        if(getInfo("scRJTO") == "1" && fn_checkrejectedtoA()){ if(!bReviewr) document.getElementById("btRejectedto").style.display="";}
        		if(getInfo("scHold")=="1" && getInfo("ptid") == getInfo("usid") && getInfo("pfsk") != "T019" ){ if(!bReviewr) document.getElementById("btHold").style.display= "";}
		        break;
	        case "CHARGE":
		        break;
		    case "REDRAFT"://201108
        		if(getInfo("scHold")=="1" && getInfo("pfsk") == "T008" && getInfo("loct") == "APPROVAL" && getInfo("gloct") == "JOBFUNCTION" ){ document.getElementById("btHold").style.display= "";}
        		break; 
        }		
	}
    if(getInfo("loct") == "REVIEW" && getInfo("mode") == "APPROVAL" ){
        if(getInfo("scReviewV") == "1"){//공람결재
            document.getElementById("btApproved").style.display= "";document.getElementById("spanbtApproved").innerHTML = gLabel_confirm;
        }else{//공람열람
            var sItems="<request>";
			sItems+="<item wiid=\""+getInfo("wiid")+"\" ptid=\"" +getInfo("ptid") +"\" pfid=\""+ getInfo("pfid") +"\" pfsk=\""+ getInfo("pfsk") +"\" usid=\""+ getInfo("ptid") +"\" />";
		    sItems+="</request>";   
		    requestHTTP("POST","../InstMgr/switchWI2Complete.aspx",false,"text/xml",receiveGeneralQuery,sItems);   
	    }
    }
    //사용자 문서 조회 및 수정
	if(parent.admintype == "ADMIN"){
	    if(getInfo("loct") == "PREAPPROVAL" || getInfo("loct") == "APPROVAL" || getInfo("loct") == "PROCESS" || getInfo("loct") == "COMPLETE" || getInfo("loct") == "REJECT"){
	      document.getElementById("btModify").style.display= "";	//편집버튼 활성화
        
	      switch(getInfo("mode")){
            case "PREAPPROVAL": //예고함
			    break;
			case "APPROVAL":		//미결함
			    document.getElementById("btAction").style.display= "none";
			    break;
		    case "PROCESS":			//진행함
			    btWithdraw.style.display= "none";
			    break;
			case "COMPLETE":		//완료함				    
			    break;
			case "REJECT":			//부결함
			    break;
			}
        }
	}
	
	//feedback 사용
	if(getInfo("feedback") == "1"){
	    document.getElementById("chk_feedback").checked = true;	
	    document.getElementById("selfeedback").value = getInfo("selfeedback");
	}
}
function displayBtnTrans(){//시행문변환관련버튼
	if(getInfo("loct") != 'COMPLETE'){
		switch(getInfo("pfsk")){
			case "T001":
				document.getElementById("btITrans").style.display = "";
				document.getElementById("btTrans").style.display = "none";
				document.getElementById("btRecDept").style.display= "";		//"수신처지정"
				iBody.style.display="";
				break;
			case "T002":
				document.getElementById("btTrans").style.display = "none";
				document.getElementById("btOTrans").style.display = "";
				document.getElementById("btRecDept").style.display= "none";//"수신처지정"
				break;
			case "T003":
				document.getElementById("btSign").style.display = "";break;
			case "T007": break;
		}
	}else{
		if(getInfo("fmpf")=="DRAFT") document.getElementById("btOTrans").style.display = "";	
	}
}
function getDisplayMode(sReadMode,sSchemaOption){//스키마 옵션에 따른 버튼 활성화	
	if(getInfo(sSchemaOption) == "1"){ return "";}else{ return "none";}
}
function disableBtns(bDisable){
	document.getElementById("btDraft").disabled = bDisable;
	document.getElementById("btExit").disabled = bDisable;
	document.getElementById("btPrint").disabled = bDisable;
}
//1인결재 및 담당자 추가 관련 수정 20006.08 by sunny
function evaluateForm(){	
	switch(getInfo("fmpf")) {
		case "DRAFT":
		case "OUTERPUBLISH":
			if((getInfo("mode")=="TEMPSAVE"||getInfo("mode")=="DRAFT") && m_oFormEditor.document.getElementsByName("SUBJECT")[0].value==""){				
				alert(gMessage28);return false; //"제목을 입력하세요."
			}
		case "REQUEST":
		default:
		    if (m_sReqMode != "TEMPSAVE" && m_sReqMode != "APPROVE") {
            //if (m_sReqMode != "TEMPSAVE") {
		        if (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE") {
		            if (getInfo("scIPub") == "1" && (m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value == "@@" || m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value == "")) {
		                alert(gMessage74); //"수신처가 없습니다. 수신처를 지정하십시요."  
		                return false;
		            }
		        }
		        m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>" + document.getElementsByName("APVLIST")[0].value);
		        var elmRoot = m_evalXML.documentElement;
		        var elmList;
		        if (!this.agent.msie) {
		            elmList = elmRoot.selectNodes("division[taskinfo/@status='inactive' or taskinfo/@status='pending' ]/step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/*[name()='person' or name()='role'][taskinfo[@kind!='charge']]");
		        } else {
		            elmList = elmRoot.selectNodes("division[taskinfo/@status='inactive' or taskinfo/@status='pending' ]/step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/(person|role)[taskinfo[@kind!='charge']]");
		        }

		        if (getInfo("mode") == "REDRAFT") {
		            if (m_sReqMode == "CHARGE") {
		                elmList = elmRoot.selectNodes("division[@divisiontype='receive']/step");
		            } else {
		                if (!this.agent.msie) {
		                    elmList = elmRoot.selectNodes("division[@divisiontype='receive']/step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/*[name()='person' or name()='role'][taskinfo/@kind!='charge']");
		                } else {
		                    elmList = elmRoot.selectNodes("division[@divisiontype='receive']/step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/(person|role)[taskinfo/@kind!='charge']");
		                }
		            }
		        } else if (getInfo("mode") == "SUBREDRAFT") {
		            if (m_sReqMode == "CHARGE") {
		                elmList = elmRoot.selectNodes("division[taskinfo/@status='pending']/step/ou[taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']");
		            } else {
		                if (!this.agent.msie) {
		                    elmList = elmRoot.selectNodes("division[taskinfo/@status='pending']/step/ou[taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']/*[name()='person' or name()='role'][taskinfo/@kind!='charge']");
		                } else {
		                    elmList = elmRoot.selectNodes("division[taskinfo/@status='pending']/step/ou[taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']/(person|role)[taskinfo/@kind!='charge']");
		                }
		            }
		        }


		        if (elmList.length == 0 && parent.admintype != "ADMIN") {
		            if (getInfo("scChrDraft") == "1" || (getInfo("mode") == "REDRAFT" && document.getElementsByName("ACTIONINDEX")[0].value != "")) {
		                if (getInfo("scChrDraft") == "1") {
		                    if (!confirm(gMessage198)) { //"결재자가 없습니다.\r\n작성자 전결을 하시겠습니까?"
		                        return false;
		                    }
		                }
		            } else {
		                alert(gMessage29); //"결재선이 지정되지 않았습니다."
		                return false;
		            }
		        }
		        var elmRecList;
		        if (!this.agent.msie) {
		            elmRecList = elmRoot.selectNodes("division[taskinfo/@status='pending']/step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/*[name()='person' or name()='role'][taskinfo[@kind!='charge']]");
		        } else {
		            elmRecList = elmRoot.selectNodes("division[taskinfo/@status='pending']/step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/(person|role)[taskinfo[@kind!='charge']]");
		        }
		        if (getInfo("scDRec") == 1 && (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || getInfo("mode") == "APPROVAL")) {
		            var elmOu = elmRoot.selectNodes("division/step[@routetype='receive']/ou");
		            if (elmOu.length == 0) {
		                //if (confirm(gMessage199)) return m_oFormEditor.checkForm((m_sReqMode == "TEMPSAVE" ? true : false)); //"경유부서 없이 진행하시겠습니까?"  //주석처리 (2013-03-06 HIW)
		                //경고창으로 변경 (2013-03-06 HIW)
                        alert(gMessage333);  //수신부서를 지정하지 않았습니다.
		                return false; 
		            } else {
		                //수신처를 1개만 지정하도록 수정 2004.11.10 김영종
		                //							var elmReceive = elmRoot.selectNodes("division/step[@unittype='ou' and @routetype='receive']");
		                //							//한번에 두개 이상의 수신처를 지정 할 경우 Check
		                //							if(elmReceive.length>1){alert(gMessage200);return false;}			//"수신처는 1개만 지정 가능 합니다. \n수신처를 다시 지정해 주십시요."
		                //							if(elmReceive.length>0){
		                //									var ouReceive = elmReceive[0].selectNodes("ou");
		                //									//한번씩 하나씩 두번 이상의 수신처를 지정 할 경우 Check
		                //									if(ouReceive.length>1){alert(gMessage200);return false;}  //"수신처는 1개만 지정 가능 합니다. \n수신처를 다시 지정해 주십시요."
		                //							}
		            }
		        }

		        if (getInfo("scPRec") == 1 && (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || getInfo("mode") == "APPROVAL")) {
		            var elmOu = elmRoot.selectNodes("division/step[@routetype='receive']/ou/person");

		            if (elmOu.length == 0) {
		                if (getInfo("scPRecV") == "select") {
		                    if (!confirm(gMessage201)) return false; //"담당자 지정없이 진행하시겠습니까?"
		                } else {
		                    if (getInfo("scDRec") == 1 && (getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE" || getInfo("mode") == "APPROVAL")) {
		                        elmOu = elmRoot.selectNodes("division/step[@routetype='receive']");
		                        if (elmOu.length == 0) {
		                            alert(gMessage181); //"담당자를 지정하십시요"
		                            return false;
		                        }
		                    } else {
		                        alert(gMessage181); //"담당자를 지정하십시요"
		                        return false;
		                    }
		                }
		            } else {
		                //담당업무를 1개만 지정하도록 수정 2005.04.21 황선희
		                var elmReceive = elmRoot.selectNodes("division/step[@unittype='person' and @routetype='receive']");
		                //한번에 두개 이상의 담당업무를 지정 할 경우 Check
		                //if(elmReceive.length>1){alert("담당자는 1개만 지정 가능 합니다. \n담당자를 다시 지정해 주십시요.");return false;} 
		                //if(elmReceive.length>1){alert(strMsg_055);return false;} 
		                if (elmReceive.length > 0) {
		                    var ouReceive = elmReceive[0].selectNodes("person");
		                    //한번씩 하나씩 두번 이상의 담당업무를 지정 할 경우 Check
		                    //if(ouReceive.length>1){alert("담당자는 1개만 지정 가능 합니다. \n담당자를 다시 지정해 주십시오.");return false;} 
		                    //if(ouReceive.length>1){alert(strMsg_055);return false;} 
		                }
		            }
		        }
				
				//[2014-07-21] PSW 휴가변경신청서, 취소일수-변경일수 체크함수 확인
				/*
				if (m_oFormEditor.checkDays() != null) {
		            if (m_oFormEditor.checkDays() == 'false') {
						return false;
		            }
		        }*/
				
		        //문서이관 관련 check
		        if (getInfo("scEdmsLegacy") == "1" && m_sReqMode == "DRAFT" && (m_oFormEditor.document.getElementsByName("DOC_LEVEL")[0].value == "" || m_oFormEditor.document.getElementsByName("SAVE_TERM")[0].value == "" || m_oFormEditor.document.getElementsByName("DOC_CLASS_NAME")[0].value == "")) {
		            alert(gMessage202); //"문서관리시스템 이관을 위한 문서정보를 입력하십시오."
		            return false;
		        }

		        return m_oFormEditor.checkForm((m_sReqMode == "TEMPSAVE" ? true : false));
		        break;
		    } else {
		        //if(m_oFormEditor.SUBJECT.value=="" ){
		        //    alert(gMessage28);return false; //"제목을 입력하세요."
		        //	return false;
		        //}else{
		        return true;
		        //}			
		    }               	
	    }
}
function getDefaultXML(){
		var sXML 
		= makeNode("piid",(m_sReqMode=="TEMPSAVE"?"":null)) + makeNode("wiid") + makeNode("pdef") + makeNode("pfsk") + makeNode("ptid")
		+ (getInfo("pfsk")=="T008"?makeNode("mode","REDRAFT"):makeNode("mode")) + makeNode("dpid") + makeNode("usid") + makeNode("sabun")+ makeNode("dpid_apv")  + makeNode("dpdn_apv", getInfo("dpdn_apv").replace("&","&amp;"))  +makeNode("usdn")  + makeNode("dpdsn") 
		+ makeNode("fmid") + makeNode("fmnm") + makeNode("fmpf") + makeNode("fmbt") + makeNode("fmrv")
		+ makeNode("fiid") + makeNode("ftid") + makeNode("pfid") + makeNode("scid") + makeNode("fmfn")+ makeNode("fiid_response") + makeNode("fiid_spare")
		+ getFormInfosXML()
		+ getApvList();
		if(getInfo("pfsk")=="T005" || getInfo("pfsk") == "T018"){
		}else{
		    sXML = sXML + (m_bFrmExtDirty?getFormInfoExtXML():""); // T005 후결, T018 공람
		}
	return sXML;
}
function setForwardApvList(elmRoot){//전달일 경우 처리
	try{
		var xmlApv= CreateXmlDocument();
		xmlApv.loadXML("<apvlist>"+getInfo("apst")+"</apvlist>");
		if(getInfo("mode")=="APPROVAL" ||getInfo("mode")=="PCONSULT" || getInfo("mode")=="RECAPPROVAL"  || getInfo("mode")=="SUBAPPROVAL"  ){ //기안부서결재선 및 수신부서 결재선
		    var oFirstNode;
		    if (parent.admintype == "ADMIN") {
		        if (getInfo("mode") == "APPROVAL") {
		            oFirstNode = xmlApv.selectSingleNode("apvlist/steps/division/step[@routetype='approve' and (ou/person[@code='" + getInfo("ptid") + "']/taskinfo[@status='pending'] or ou/role[person/@code='" + getInfo("ptid") + "']/taskinfo[@status='pending'])]");
		        } else if (getInfo("mode") == "PCONSULT") {
		            oFirstNode = xmlApv.selectSingleNode("apvlist/steps/division/step[ou/*[(../person/@code='" + getInfo("ptid") + "'  ) or (../role/person/@code='" + getInfo("ptid") + "' )]/taskinfo[@status='pending']]");
		        } else if (getInfo("mode") == "SUBAPPROVAL") {
		            oFirstNode = xmlApv.selectSingleNode("apvlist/steps/division/step[ou[taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']/*[(../person/@code='" + getInfo("ptid") + "' ) or (../role/person/@code='" + getInfo("ptid") + "' )]/taskinfo[@status='pending']]");
		        } else {
		            oFirstNode = xmlApv.selectSingleNode("apvlist/steps/division/step[@unittype='ou' and @routetype='receive' and ou/person[@code='" + getInfo("usid") + "']/taskinfo[@kind!='charge' and @status='pending']]");
		        }
		    } else {
		    if (getInfo("mode") == "APPROVAL") {
		            oFirstNode = xmlApv.selectSingleNode("apvlist/steps/division/step[@routetype='approve' and (ou/person[@code='" + getInfo("ptid") + "']/taskinfo[@status='pending'] or ou/role[person/@code='" + getInfo("ptid") + "']/taskinfo[@status='pending'])]");
		        } else if (getInfo("mode") == "PCONSULT") {
		            if (parent.admintype == "ADMIN") {
		                oFirstNode = xmlApv.selectSingleNode("apvlist/steps/division/step[ou/*[(../person/@code='" + getInfo("ptid") + "' ) or (../role/person/@code='" + getInfo("ptid") + "' )]/taskinfo[@status='pending']]");
		            } else {
		                oFirstNode = xmlApv.selectSingleNode("apvlist/steps/division/step[ou/*[(../person/@code='" + getInfo("ptid") + "' and ../person/@code='" + getInfo("usid") + "' ) or (../role/person/@code='" + getInfo("ptid") + "' and ../role/person/@code='" + getInfo("usid") + "')]/taskinfo[@status='pending']]");
		            }
		        } else if (getInfo("mode") == "SUBAPPROVAL") {
		            if (parent.admintype == "ADMIN") {
		                oFirstNode = xmlApv.selectSingleNode("apvlist/steps/division/step[ou[taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']/*[(../person/@code='" + getInfo("ptid") + "'  ) or (../role/person/@code='" + getInfo("ptid") + "' )]/taskinfo[@status='pending']]");
		            }else{
		                oFirstNode = xmlApv.selectSingleNode("apvlist/steps/division/step[ou[taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']/*[(../person/@code='" + getInfo("ptid") + "' and ../person/@code='" + getInfo("usid") + "' ) or (../role/person/@code='" + getInfo("ptid") + "' and ../role/person/@code='" + getInfo("usid") + "')]/taskinfo[@status='pending']]");
		            }
		        } else {
		            if (parent.admintype == "ADMIN") {
		                oFirstNode = xmlApv.selectSingleNode("apvlist/steps/division/step[@unittype='ou' and @routetype='receive' and ou/person[taskinfo/@kind!='charge' and taskinfo/@status='pending']]");
		            } else {
		                oFirstNode = xmlApv.selectSingleNode("apvlist/steps/division/step[@unittype='ou' and @routetype='receive' and ou/person[@code='" + getInfo("usid") + "']/taskinfo[@kind!='charge' and @status='pending']]");
		            }
		        }
		    }
			if(oFirstNode != null){
				m_bDeputy = true;m_bApvDirty = true;var elmOU;var elmPerson;var elmInactivePerson;
				switch(getInfo("mode")){
					case "APPROVAL":
					case "PCONSULT":
					    if (parent.admintype == "ADMIN") {
					        elmOU = oFirstNode.selectSingleNode("ou[(person/@code='" + getInfo("ptid") + "'  and person/taskinfo/@status='pending') or (role/person/@code='" + getInfo("ptid") + "'  and role/taskinfo/@status='pending')]");
					        elmPerson = elmOU.selectSingleNode("*[((../person/@code='" + getInfo("ptid") + "' ) or (person/@code='" + getInfo("ptid") + "' )) and taskinfo[@status='pending']]");
					    } else {
					        elmOU = oFirstNode.selectSingleNode("ou[(person/@code='" + getInfo("ptid") + "' and person/@code='" + getInfo("usid") + "' and person/taskinfo/@status='pending') or (role/person/@code='" + getInfo("ptid") + "' and role/person/@code='" + getInfo("usid") + "' and role/taskinfo/@status='pending')]");
					        elmPerson = elmOU.selectSingleNode("*[((../person/@code='" + getInfo("ptid") + "' and ../person/@code='" + getInfo("usid") + "') or (person/@code='" + getInfo("ptid") + "' and person/@code='" + getInfo("usid") + "' )) and taskinfo[@status='pending']]");
					    }
					    break;
					case "SUBAPPROVAL":
					    if (parent.admintype == "ADMIN") {
					        elmOU = oFirstNode.selectSingleNode("ou[taskinfo/@piid='" + getInfo("piid").toUpperCase() + "' and (person/@code='" + getInfo("ptid") + "'  and person/taskinfo/@status='pending') or (role/person/@code='" + getInfo("ptid") + "'  and role/taskinfo/@status='pending')]");
					        elmPerson = elmOU.selectSingleNode("*[((../person/@code='" + getInfo("ptid") + "' ) or (person/@code='" + getInfo("ptid") + "')) and taskinfo[@status='pending']]");
					        elmInactivePerson = elmOU.selectSingleNode("*[taskinfo/@status='inactive']");
					    } else {
					        elmOU = oFirstNode.selectSingleNode("ou[taskinfo/@piid='" + getInfo("piid").toUpperCase() + "' and (person/@code='" + getInfo("ptid") + "' and person/@code='" + getInfo("usid") + "' and person/taskinfo/@status='pending') or (role/person/@code='" + getInfo("ptid") + "' and role/person/@code='" + getInfo("usid") + "' and role/taskinfo/@status='pending')]");
					        elmPerson = elmOU.selectSingleNode("*[((../person/@code='" + getInfo("ptid") + "' ) or (person/@code='" + getInfo("ptid") + "')) and taskinfo[@status='pending']]");
					        elmInactivePerson = elmOU.selectSingleNode("*[taskinfo/@status='inactive']");
					    }
					    break;
					case "RECAPPROVAL":
					    if (parent.admintype == "ADMIN") {
					        elmOU = oFirstNode.selectSingleNode("ou"); elmPerson = elmOU.selectSingleNode("person[taskinfo/@kind!='charge' and taskinfo/@status='pending']"); elmInactivePerson = elmOU.selectSingleNode("*[taskinfo/@status='inactive']");
					    } else {
					        elmOU = oFirstNode.selectSingleNode("ou"); elmPerson = elmOU.selectSingleNode("person[@code='" + getInfo("usid") + "' and taskinfo[@kind!='charge' and @status='pending']]"); elmInactivePerson = elmOU.selectSingleNode("*[taskinfo/@status='inactive']");
					    }
					    break;
				}
				var elmTaskInfo = elmPerson.selectSingleNode("taskinfo");
				var skind = elmTaskInfo.getAttribute("kind");
				//taskinfo kind 현재 결재자의 kind=conveyance, 다음 결재자는 원결재자의 kind를 받는다.
				elmTaskInfo.setAttribute("status","completed");
				elmTaskInfo.setAttribute("result","completed");
				elmTaskInfo.setAttribute("kind","conveyance");
				elmTaskInfo.setAttribute("datecompleted", getInfo("svdt"));
				if (parent.admintype == "ADMIN") {
				    elmTaskInfo.setAttribute("visible", "n");
				}
				if (document.getElementsByName("ACTIONCOMMENT")[0].value != "") {
				    if (elmTaskInfo.selectSingleNode("comment") != null) {
				        var comment = elmTaskInfo.selectSingleNode("comment");
				        comment.setAttribute("datecommented", getInfo("svdt"));
				        comment.setAttribute("relatedresult", "completed");
				        comment.text = document.getElementsByName("ACTIONCOMMENT")[0].value;
				    } else {
				        var comment = xmlApv.createElement("comment");
				        comment.setAttribute("datecommented", getInfo("svdt"));
				        comment.setAttribute("relatedresult", "completed");
				        comment.text = document.getElementsByName("ACTIONCOMMENT")[0].value;
				        elmTaskInfo.appendChild(comment);
				    }
				}

				//전달받은 사용자 결재선 생성
				var oStep=xmlApv.createElement("step");
				var oOU=xmlApv.createElement("ou");
				var oPerson=xmlApv.createElement("person");
				var oTaskinfo=xmlApv.createElement("taskinfo");
				if(getInfo("mode") == "RECAPPROVAL" || getInfo("mode") == "SUBAPPROVAL"){
					if(elmInactivePerson != null){
						elmOU.insertBefore(oPerson,elmInactivePerson).appendChild(oTaskinfo);
					}else{
						elmOU.appendChild(oPerson).appendChild(oTaskinfo);
					}
				}else{
					elmOU.appendChild(oPerson).appendChild(oTaskinfo);
				}
				/*
				if (getInfo("mode")=="APPROVAL" ){ //동시결재일 경우 추가 처리 필요2006.02
					'xmlApv.documentElement.firstChild.insertBefore(oStep,oFirstNode).appendChild(oOU).appendChild(oPerson).appendChild(oTaskinfo);
					elmOU.appendChild(oPerson).appendChild(oTaskinfo);
					oStep.setAttribute("unittype","person");
					oStep.setAttribute("routetype","approve");
					oStep.setAttribute("name",gLabel_approve);
					oOU.setAttribute("code",elmRoot.selectSingleNode("item/RG").text);
					oOU.setAttribute("name",elmRoot.selectSingleNode("item/RGNM").text);
				}else{//수신부서 person 포함.
					elmOU.insertBefore(oPerson,elmPerson).appendChild(oTaskinfo);
				}
				*/
				oPerson.setAttribute("code",elmRoot.selectSingleNode("item/AN").text);
				oPerson.setAttribute("name",elmRoot.selectSingleNode("item/DN").text);
				oPerson.setAttribute("position",elmRoot.selectSingleNode("item").getAttribute("po"));
				oPerson.setAttribute("title",elmRoot.selectSingleNode("item").getAttribute("tl"));
				oPerson.setAttribute("level",elmRoot.selectSingleNode("item").getAttribute("lv"));
				oPerson.setAttribute("oucode",elmRoot.selectSingleNode("item/RG").text);
				oPerson.setAttribute("ouname",elmRoot.selectSingleNode("item/RGNM").text);
				oPerson.setAttribute("sipaddress",elmRoot.selectSingleNode("item/SIP").text);
				oTaskinfo.setAttribute("status","pending");
				oTaskinfo.setAttribute("result","pending");
				oTaskinfo.setAttribute("kind",skind);
				oTaskinfo.setAttribute("datereceived",getInfo("svdt"));
				var oResult = xmlApv.selectSingleNode("apvlist/steps");
				document.getElementsByName("APVLIST")[0].value = (!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(oResult) : oResult.xml;
			}else{document.getElementsByName("APVLIST")[0].value = getInfo("apst");}
		}else{document.getElementsByName("APVLIST")[0].value = getInfo("apst");}
	}catch (e){alert(e.message);}
}

function setApvList(){//로그인자가 대결일 경우 대결자정보 결재선XML에 추가
	try{
		var xmlApv= CreateXmlDocument();
		xmlApv.loadXML("<apvlist>"+getInfo("apst")+"</apvlist>");
		if(getInfo("mode")=="APPROVAL" ||getInfo("mode")=="PCONSULT" || getInfo("mode")=="RECAPPROVAL"){ //기안부서결재선 및 수신부서 결재선
			var oFirstNode;
			if (getInfo("mode") == "APPROVAL" || getInfo("mode") == "RECAPPROVAL") {  //getInfo("mode") == "RECAPPROVAL" 조건 추가함(2013-03-19 HIW)  --> 수신부서의 대결자일경우 대결/후열 표시가 되지않는 문제로인해  		
				oFirstNode=xmlApv.selectSingleNode("apvlist/steps/division/step[@routetype='approve' and (ou/person[@code='"+getInfo("ptid")+"' and @code!='"+getInfo("usid")+"' ]/taskinfo[@status='pending'] or ou/role[person/@code!='"+getInfo("ptid")+"' and person/@code!='"+getInfo("usid")+"' ]/taskinfo[@status='pending'])]");
            } else if (getInfo("mode") == "PCONSULT") {
			    if(!this.agent.msie){
				    oFirstNode=xmlApv.selectSingleNode("apvlist/steps/division/step[ou/*[name()='person' or name()='role'][(@code='"+getInfo("ptid")+"' and @code!='"+getInfo("usid")+"'  and taskinfo/@status='pending') or (person/@code='"+getInfo("ptid")+"' and person/@code!='"+getInfo("usid")+"' and taskinfo/@status='pending')]]");
			    }else{				
				    oFirstNode=xmlApv.selectSingleNode("apvlist/steps/division/step[ou/(person|role)[(@code='"+getInfo("ptid")+"' and @code!='"+getInfo("usid")+"'  and taskinfo/@status='pending') or (person/@code='"+getInfo("ptid")+"' and person/@code!='"+getInfo("usid")+"' and taskinfo/@status='pending')]]");
				}
			}else{
				oFirstNode=xmlApv.selectSingleNode("apvlist/steps/division/step[@unittype='ou' and @routetype='receive' and ou/person[@code!='"+getInfo("usid")+"']/taskinfo[@kind!='charge' and @status='pending']]");
			}
			if(oFirstNode != null){
				m_bDeputy = true;m_bApvDirty = true;var elmOU;var elmPerson;
				switch(getInfo("mode")){
					case "APPROVAL":
					case "PCONSULT":
						elmOU = oFirstNode.selectSingleNode("ou[(person/@code='"+getInfo("ptid")+"' and person/@code!='"+getInfo("usid")+"' and person/taskinfo/@status='pending') or (role/person/@code='"+getInfo("ptid")+"' and role/person/@code!='"+getInfo("usid")+"' and role/taskinfo/@status='pending')]");
						elmPerson = elmOU.selectSingleNode("*[((../person/@code='"+getInfo("ptid")+"' and ../person/@code!='"+getInfo("usid")+"') or (@code='"+getInfo("ptid")+"' and @code!='"+getInfo("usid")+"' )) and taskinfo[@status='pending']]");
						break;
					case "RECAPPROVAL":elmOU = oFirstNode.selectSingleNode("ou");elmPerson = elmOU.selectSingleNode("person[@code!='"+getInfo("usid")+"' and taskinfo[@kind!='charge' and @status='pending']]");
						break;
				}
				var elmTaskInfo = elmPerson.selectSingleNode("taskinfo");
				var skind = elmTaskInfo.getAttribute("kind");
				var sallottype = "serial";
				try{ sallottype = oFirstNode.getAttribute("allottype");}catch(e){}
				//taskinfo kind에 따라 처리  일반결재 -> 대결, 대결->사용자만 변환, 전결->전결, 기존사용자는 결재안함으로
				switch (skind){
					case "substitute": //대결
						if(getInfo("mode")=="APPROVAL"){
							elmOU.setAttribute("code",getInfo("dpid_apv"));
							elmOU.setAttribute("name",getInfo("dpdn_apv"));
						}
						elmPerson.setAttribute("code",getInfo("usid"));
						elmPerson.setAttribute("name",getInfo("usdn"));
						elmPerson.setAttribute("position",getInfo("uspc")+";"+getInfo("uspn"));
						elmPerson.setAttribute("title",getInfo("ustc")+";"+getInfo("ustn"));
						elmPerson.setAttribute("level",getInfo("uslc")+";"+getInfo("usln"));
						elmPerson.setAttribute("oucode",getInfo("dpid"));
						elmPerson.setAttribute("ouname",getInfo("dpdn"));
						elmPerson.setAttribute("sipaddress",getInfo("ussip"));
						elmTaskInfo.setAttribute("datereceived",getInfo("svdt"));
						break;
					case "authorize"://전결 결재안함
						elmTaskInfo.setAttribute("status","completed");
						elmTaskInfo.setAttribute("result","skipped");
						elmTaskInfo.setAttribute("kind","skip");
						elmTaskInfo.removeAttribute("datereceived");
						break;
					case "consent": //합의 -> 후열
					case "charge":  //담당 -> 후열
					case "normal":  //일반결재 -> 후열
						elmTaskInfo.setAttribute("status","inactive");
						elmTaskInfo.setAttribute("result","inactive");
						elmTaskInfo.setAttribute("kind","bypass");
						elmTaskInfo.removeAttribute("datereceived");
						break;
                }

				if(skind=="authorize" || skind=="normal" || skind=="consent" || skind=="charge"){
					var oStep=xmlApv.createElement("step");
					var oOU=xmlApv.createElement("ou");
					var oPerson=xmlApv.createElement("person");
					var oTaskinfo=xmlApv.createElement("taskinfo");
					if(getInfo("mode")=="APPROVAL" && sallottype =="serial"){
						//xmlApv.documentElement.firstChild.insertBefore(oStep,oFirstNode).appendChild(oOU).appendChild(oPerson).appendChild(oTaskinfo);
						var oDiv = oFirstNode.parentNode;
                        oDiv.insertBefore(oStep,oFirstNode).appendChild(oOU).appendChild(oPerson).appendChild(oTaskinfo);
						oStep.setAttribute("unittype","person");
						oStep.setAttribute("routetype","approve");
						oStep.setAttribute("name",gLabel_approve);
						oOU.setAttribute("code",getInfo("dpid_apv"));
						oOU.setAttribute("name",getInfo("dpdn_apv"));
					}else{//수신부서 person 포함.
						elmOU.insertBefore(oPerson,elmPerson).appendChild(oTaskinfo);
		            }

                    //대결자 셋팅
					oPerson.setAttribute("code",getInfo("usid"));
					oPerson.setAttribute("name",getInfo("usdn"));
					oPerson.setAttribute("position",getInfo("uspc")+";"+getInfo("uspn"));
					oPerson.setAttribute("title",getInfo("ustc")+";"+getInfo("ustn"));
					oPerson.setAttribute("level",getInfo("uslc")+";"+getInfo("usln"));
					oPerson.setAttribute("oucode",getInfo("dpid"));
					oPerson.setAttribute("ouname",getInfo("dpdn"));
					oPerson.setAttribute("sipaddress",getInfo("ussip"));
					
					oTaskinfo.setAttribute("status","pending");
					oTaskinfo.setAttribute("result","pending");
					oTaskinfo.setAttribute("kind",(skind=="authorize")?skind:"substitute");
					oTaskinfo.setAttribute("datereceived", getInfo("svdt"));

					if(skind=='charge'){
						oFirstNode = oStep;
						var oStep=xmlApv.createElement("step");
						var oOU=xmlApv.createElement("ou");
						var oPerson=xmlApv.createElement("person");
						var oTaskinfo=xmlApv.createElement("taskinfo");
						xmlApv.documentElement.firstChild.insertBefore(oStep,oFirstNode).appendChild(oOU).appendChild(oPerson).appendChild(oTaskinfo);
						oStep.setAttribute("unittype","person");
						oStep.setAttribute("routetype","approve");
						oStep.setAttribute("name",gLabel__writer);
						oOU.setAttribute("code",getInfo("dpid_apv"));
						oOU.setAttribute("name",getInfo("dpdn_apv"));
						oPerson.setAttribute("code",getInfo("usid"));
						oPerson.setAttribute("name",getInfo("usdn"));
						oPerson.setAttribute("position",getInfo("uspc")+";"+getInfo("uspn"));
						oPerson.setAttribute("title",getInfo("ustc")+";"+getInfo("ustn"));
						oPerson.setAttribute("level",getInfo("uslc")+";"+getInfo("usln"));
						oPerson.setAttribute("oucode",getInfo("dpid"));
						oPerson.setAttribute("ouname",getInfo("dpdn"));
    					oPerson.setAttribute("sipaddress",getInfo("ussip"));
						
						oTaskinfo.setAttribute("status","complete");
						oTaskinfo.setAttribute("result","complete");
						oTaskinfo.setAttribute("kind","charge");
						oTaskinfo.setAttribute("datereceived",getInfo("svdt"));
						oTaskinfo.setAttribute("datecompleted",getInfo("svdt"));
					}
				}
				var oResult = xmlApv.selectSingleNode("apvlist/steps");
				document.getElementsByName("APVLIST")[0].value = (!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(oResult) :oResult.xml;
			}else{document.getElementsByName("APVLIST")[0].value = getInfo("apst");}
		}else{document.getElementsByName("APVLIST")[0].value = getInfo("apst");}
	}catch (e){alert(e.message);}
}

function getApvList(){
    var xmlApv = CreateXmlDocument();
	xmlApv.loadXML("<apvlist>"+document.getElementsByName("APVLIST")[0].value+"</apvlist>");
	if(m_sReqMode=="RECREATE" && getInfo("scRec")=="1"){
		var oFirstNode=xmlApv.selectSingleNode("apvlist/steps/division[taskinfo/@status='pending' and @divisiontype='receive' and @oucode='"+getInfo("dpid_apv")+"']");
		if(oFirstNode==null){
			var oStep=xmlApv.createElement("step");
			var oOU=xmlApv.createElement("ou");
			var oTaskinfo=xmlApv.createElement("taskinfo");
			xmlApv.documentElement.firstChild.appendChild(oStep).appendChild(oOU).appendChild(oTaskinfo);
			oStep.setAttribute("unittype","person");//ou
			oStep.setAttribute("routetype","approve");//receive
			oStep.setAttribute("name",gLabel__ChargeDept_Rec);
			oOU.setAttribute("code",getInfo("dpid_apv"));
			oOU.setAttribute("name",getInfo("dpdn_apv"));
			oTaskinfo.setAttribute("status","pending");
			oTaskinfo.setAttribute("result","pending");
			oTaskinfo.setAttribute("kind","normal");
			oTaskinfo.setAttribute("datereceived",getInfo("svdt"));
			oFirstNode =  xmlApv.selectSingleNode("apvlist/steps/division/step[@unittype='ou' and @routetype='receive']/ou[@code='"+getInfo("dpid_apv")+"' and taskinfo/@status='pending']");
		}
		/*
		//2014-04-23 hyh 추가
		if (oFirstNode != null) {
		//2014-04-23 hyh 추가 끝
		if(oFirstNode.selectSingleNode("person[@code='"+getInfo("usid")+"']/taskinfo[@kind='charge']")==null){
			var oPerson=xmlApv.createElement("person");
			var oTaskinfo=xmlApv.createElement("taskinfo");
			//xmlApv.selectSingleNode("apvlist/steps/division/step[@unittype='ou' and @routetype='receive']/ou[@code='"+getInfo("dpid_apv")+"' and taskinfo/@status='pending']").appendChild(oPerson).appendChild(oTaskinfo);
			xmlApv.selectSingleNode("apvlist/steps/division[taskinfo/@status='pending' and @divisiontype='receive' and @oucode='"+getInfo("dpid_apv")+"']").appendChild(oPerson).appendChild(oTaskinfo);

			oPerson.setAttribute("code",getInfo("usid"));
			oPerson.setAttribute("name",getInfo("usdn"));
			oPerson.setAttribute("position",getInfo("uspc")+";"+getInfo("uspn"));
			oPerson.setAttribute("title",getInfo("ustc")+";"+getInfo("ustn"));
			oPerson.setAttribute("level",getInfo("uslc")+";"+getInfo("usln"));
			oPerson.setAttribute("oucode",getInfo("dpid"));
			oPerson.setAttribute("ouname",getInfo("dpdn"));
			oPerson.setAttribute("sipaddress",getInfo("ussip"));
			
			oTaskinfo.setAttribute("status","pending");
			oTaskinfo.setAttribute("result","pending");
			oTaskinfo.setAttribute("kind","charge");
			oTaskinfo.setAttribute("datereceived",getInfo("svdt"));
		}
		//2014-04-23 hyh 추가
		}
		//2014-04-23 hyh 추가 끝
                */
	}
	//2006.9.20 김현태 결재선 임시 저장 관련 수정 - 기안자만 있는 경우 넘기지 결재선을 넘기지 않는다.
	if(m_sReqMode=="TEMPSAVE"){
		var oFirstNodeList=xmlApv.selectNodes("apvlist/steps/division/step/ou/person");
			//alert(oFirstNodeList.length );
		if(oFirstNodeList.length == 1){//기안자만 있는 경우
			xmlApv.loadXML("<apvlist></apvlist>");
		}else{//기안자가 있는 경우 기안자 노드 삭제
		    var oCurrentDivNode = xmlApv.selectSingleNode("apvlist/steps/division[@divisiontype='send']");
		    var oChargeNode = oCurrentDivNode.selectSingleNode("step[ou/person/taskinfo/@kind='charge']");
		    if(oChargeNode != null) oCurrentDivNode.removeChild(oChargeNode);
		    var oCurrentDivTaskinfo = oCurrentDivNode.selectSingleNode("taskinfo");
	        oCurrentDivTaskinfo.setAttribute("status","inactive");
	        oCurrentDivTaskinfo.setAttribute("result","inactive");
		    try{oCurrentDivTaskinfo.removeAttribute("datereceived");}catch(e){}
		    //그외 노드의 경우 status result datereceived
		    var oTaskinfos =oCurrentDivNode.selectNodes("step/ou/person/taskinfo[@status='pending']");
		    for(var i=0;i<oTaskinfos.length;i++){
		        var elm = oTaskinfos.nextNode();
		        elm.setAttribute("status","inactive");
		        elm.setAttribute("result","inactive");
		        elm.removeAttribute("datereceived");
		    }
		    oTaskinfos =oCurrentDivNode.selectNodes("step/taskinfo[@status='pending']");
		    for(var i=0;i<oTaskinfos.length;i++){
		        var elm = oTaskinfos.nextNode();
		        elm.setAttribute("status","inactive");
		        elm.setAttribute("result","inactive");
		        elm.removeAttribute("datereceived");
		    }
		}
	}
	return (!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(xmlApv) : xmlApv.xml;
}
function getFormInfosXML(){
	var forminfos = "";
	var m_oFormInfos = CreateXmlDocument();
	m_oFormInfos.async = false;
	m_bFrmInfoDirty = false;
	
	forminfos =  getPIDC();
	return forminfos;
}
function getPIDC(){	
	var m_oFormInfos = CreateXmlDocument();
	m_oFormInfos.async = false;
	m_oFormInfos.loadXML("<?xml version='1.0' encoding='utf-8'?><ClientAppInfo><App name='FormInfo'><forminfos><forminfo/></forminfos></App></ClientAppInfo>");
	var root = m_oFormInfos.documentElement;
	var currNode = root.childNodes.item(0).childNodes.item(0).childNodes.item(0);
	currNode.setAttribute("prefix",  getInfo("fmpf") );
	currNode.setAttribute("revision", getInfo("fmrv") );
	currNode.setAttribute("instanceid", getInfo("fiid"));
	currNode.setAttribute("id", getInfo("fmid"));
	currNode.setAttribute("name",getInfo("fmnm"));
	currNode.setAttribute("schemaid",  getInfo("scid"));
	currNode.setAttribute("index",  "0");
	currNode.setAttribute("filename",  getInfo("fmfn"));
	currNode.setAttribute("subject", ((m_oFormEditor.document.getElementsByName("SUBJECT")[0]==undefined)? getInfo("SUBJECT"):m_oFormEditor.document.getElementsByName("SUBJECT")[0].value));
	//currNode.setAttribute("secure_doc", document.getElementById("chk_secrecy").value);
	currNode.setAttribute("secure_doc", (document.getElementById("chk_secrecy").checked == true )?"1":"0");
	//currNode.setAttribute("edms_document", document.getElementById("chk_edmschk").value);  // 문서이관 유,무 체크박스
	//currNode.setAttribute("urgentreason",document.getElementsByName("REASON")[0].value);
	currNode.setAttribute("req_response", ((m_oFormEditor.document.getElementsByName("REQ_RESPONSE")[0]==undefined)?"":m_oFormEditor.document.getElementsByName("REQ_RESPONSE")[0].value));
	currNode.setAttribute("isfile", ((m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value=="")?"0":"1"));	
	
	//feedback 추가
	currNode.setAttribute("feedback", (document.getElementById("chk_feedback").checked == true )?"1":"0");
	currNode.setAttribute("selfeedback", document.getElementById("selfeedback").value);
	
	return (!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(root) : root.xml;
}
function getFormInfoXML(){ //양식정보추가
	var m_oFormInfos = CreateXmlDocument();
	m_oFormInfos.async = false;
	m_oFormInfos.loadXML("<?xml version='1.0' encoding='utf-8'?>"+getPIDC());//getInfo("pidc")
	var root = m_oFormInfos.documentElement;	
	var currNode = root.childNodes.item(0).childNodes.item(0).childNodes.item(0);
	var forminfoNode = currNode.cloneNode(true);

	forminfoNode.setAttribute("prefix",  getInfo("fmpf") );
	forminfoNode.setAttribute("revision", getInfo("fmrv") );
	forminfoNode.setAttribute("instanceid", getInfo("fiid_response"));
	forminfoNode.setAttribute("id", getInfo("fmid"));
	forminfoNode.setAttribute("name",getInfo("fmnm"));
	forminfoNode.setAttribute("schemaid",  getInfo("scid"));
	forminfoNode.setAttribute("index",  1);
	forminfoNode.setAttribute("filename",  getInfo("fmfn"));	
	forminfoNode.setAttribute("subject", m_oFormEditor.document.getElementsByName("SUBJECT")[0].value);
	forminfoNode.setAttribute("secure_doc", document.getElementById("chk_secrecy").value);	
	forminfoNode.setAttribute("req_response",((m_oFormEditor.document.getElementsByName("REQ_RESPONSE")[0]==undefined)?'':m_oFormEditor.document.getElementsByName("REQ_RESPONSE")[0].value));
	forminfoNode.setAttribute("isfile", ((m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value=="")?"0":"1"));
	
	//feedback 추가
	forminfoNode.setAttribute("feedback", (document.getElementById("chk_feedback").checked == true )?"1":"0");
	forminfoNode.setAttribute("selfeedback", document.getElementById("selfeedback").value);

	root.childNodes.item(0).childNodes.item(0).appendChild(forminfoNode);
	
	return (!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(root) :root.xml;
}
function getFormInfoExtXML(){	
	var forminfoext = "";
	/* 각 양식으로 내려보낼것 forminfoext = m_oFormEditor.getFormInfoExtXML();*/
	forminfoext = "<forminfoext><forminfo>"
	+makeNode("outerpub", (getInfo("scOPub")=='1'?"True":"False"))
	+makeNode("innerpub",(getInfo("scIPub")=='1'?"True":"False"))
	+makeNode("innerpost",(getInfo("fmpf")=='WF_PUBLIC_BOARD'?"True":"False"));
	//각 부서함들 저장여부 설정
	forminfoext += makeNode("scABox",getInfo("scABox"))+makeNode("scSBox",getInfo("scSBox"))+makeNode("scRBox",getInfo("scRBox"))+makeNode("scRPBox",getInfo("scRPBox"))+makeNode("scCBox",getInfo("scCBox"))+makeNode("scCPBox",getInfo("scCPBox")) +makeNode("scGARBox",getInfo("scGARBox"))+makeNode("scGAPBox",getInfo("scGAPBox"))+makeNode("scSAPBox",getInfo("scSAPBox"))+makeNode("scSARBox",getInfo("scSARBox"))+makeNode("scFAPBox",getInfo("scFAPBox"))+ makeNode("scJFBox", getInfo("scJFBox"))+ makeNode("scJFBoxV", getInfo("scJFBoxV")) + makeNode("scGRBox", getInfo("scGRBox"));

	if(getInfo("scIPub") == '1' || getInfo("scOPub")=='1'){
		forminfoext +=makeNode("receiptlist",(getInfo("scOPub")=='1'?"":m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value));
	}else{	forminfoext +=makeNode("receiptlist","");}
	forminfoext +=makeNode("sealauthority",m_sReqMode=="SIGN"?(getInfo("dpid_apv") +';'+ getInfo("dpdsn")):'')
				+makeNode("scEdms",getInfo("scEdms")=='1'?"True":"False")+makeNode("scEdmsLegacy",getInfo("scEdmsLegacy")=='1'?"True":"False") //2006.08추가 by sunny
				+makeNode("docclass",getInfo("scDocClassV"))	
				+makeNode("issuedocno", getInfo("scDNum")=='1'?"True":"False");
	var sdocinfo =  makeNode("outerpubdocno",m_sOPubDocNO) //외부공문번호 넣어줄것
					+makeNode("docno",(m_oFormEditor.document.getElementsByName("DOC_NO")[0]==undefined)?'':m_oFormEditor.document.getElementsByName("DOC_NO")[0].value)
					+makeNode("recno", (m_oFormEditor.document.getElementsByName("RECEIVE_NO")[0]==undefined)?'':m_oFormEditor.getReceiveNo())
					+makeNode("dpdsn", getInfo("dpdsn"))
					+makeNode("catcode", (m_oFormEditor.document.getElementsByName("DOC_CLASS_ID")[0]==undefined)?'':m_oFormEditor.document.getElementsByName("DOC_CLASS_ID")[0].value)
					+makeNode("catname", (m_oFormEditor.document.getElementsByName("DOC_CLASS_NAME")[0]==undefined)?'':m_oFormEditor.document.getElementsByName("DOC_CLASS_NAME")[0].value)
					+makeNode("keepyear",(m_oFormEditor.document.getElementsByName("SAVE_TERM")[0]==undefined)?'':m_oFormEditor.document.getElementsByName("SAVE_TERM")[0].value )
					+makeNode("fiscalyear",(m_oFormEditor.document.getElementsByName("APPLIED")[0]==undefined)?'':getFiscalYear(m_oFormEditor.document.getElementsByName("APPLIED")[0].value))
					+makeNode("enforcedate",(m_oFormEditor.document.getElementsByName("APPLIED")[0]==undefined)?'':m_oFormEditor.document.getElementsByName("APPLIED")[0].value)
					+makeNode("docsec",(m_oFormEditor.document.getElementsByName("DOC_LEVEL")[0]==undefined)?'':m_oFormEditor.document.getElementsByName("DOC_LEVEL")[0].value)
					+makeNode("ispublic",(m_oFormEditor.document.getElementsByName("ISPUBLIC")[0]==undefined)?'': ((m_oFormEditor.document.getElementsByName("ISPUBLIC")[0].value==gLabel__open)?'Y':'N'))
					+makeNode("deptcode",getInfo("dpid"))+makeNode("deptpath",getInfo("dppathdn"))
					+"<attach>"+makeNode("path", getInfo("fmpath") + getInfo("fiid") + ".mht") +  (m_sReqMode=="TEMPSAVE"?"":getFormInfoExtAttachXML()) + "</attach>"	//첨부파일path
					+makeNode("circulation",(getInfo("scOPub")=='1'?'1':'1'))
					+makeNode("sentunitname",(m_oFormEditor.document.getElementsByName("SENT_OU_NAME")[0]==undefined)?'':m_oFormEditor.document.getElementsByName("SENT_OU_NAME")[0].value)
					+makeNode("regcomment",(m_oFormEditor.document.getElementsByName("REGISTRATION_COMMENT")[0]==undefined)?'':m_oFormEditor.document.getElementsByName("REGISTRATION_COMMENT")[0].value);
					+makeNode("sel_entpart",(m_oFormEditor.document.getElementsByName("SEL_ENTPART")[0]==undefined)?'':m_oFormEditor.document.getElementsByName("SEL_ENTPART")[0].value);
	forminfoext +=  "<docinfo>"+sdocinfo+"</docinfo>"
					+makeNode("JFID",(getInfo("scChgr")=='1'?getInfo("scChgrV"):''))//담당자처리
					+makeNode("IsChargeConfirm",(getInfo("scChgrConf")=='1'?'true':'false') )//담당자 확인
					+makeNode("ChargeOU",(getInfo("scChgrOU")=='1'?getInfo("scChgrOUV"):''))
					+makeNode("rejectedto",(getInfo("scRJTO")=='1'?'true':'false'))
					+makeNode("MakeReport",(getInfo("scMRPT")=='1'?getInfo("scMRPTV"):''))
					+makeNode("WORKREQUEST_ID",(m_oFormEditor.document.getElementsByName("WORKREQUEST_ID")[0]==undefined)?'':m_oFormEditor.document.getElementsByName("WORKREQUEST_ID")[0].value)
					+makeNode("parentfiid",(m_oFormEditor.document.getElementsByName("REPLY_PARENT_FORM_INST_ID")[0] == undefined)?"":m_oFormEditor.document.getElementsByName("REPLY_PARENT_FORM_INST_ID")[0].value)
					+makeNode("IsLegacy",(getInfo("scLegacy")=="1"?getInfo("scLegacyV"):""))
					+makeNode("entcode",(m_oFormEditor.document.getElementsByName("ENT_CODE")[0] == undefined)?getInfo("ENT_CODE"):m_oFormEditor.document.getElementsByName("ENT_CODE")[0].value)
					+makeNode("entname",(m_oFormEditor.document.getElementsByName("ENT_NAME")[0] == undefined)?getInfo("ENT_NAME"):m_oFormEditor.document.getElementsByName("ENT_NAME")[0].value)
					+makeNode("docnotype",getInfo("scDNumV"))
					+makeNode("ConsultOK",(getInfo("scConsultOK")=="1"?'true':'false'))
					+makeNode("IsMobile",(getInfo("scMobile")=="1"?'true':'false'))
					+makeNode("IsSubReturn",(getInfo("scDCooReturn")=="1"?'true':'false'))
					+makeNode("IsDeputy",(gDeputyType=="T"?'true':'false'))
					+makeNode("scAutoCmm",getInfo("scAutoCmm"))
					+makeNode("scAutoCmmV",getInfo("scAutoCmmV"))
					+makeNode("scNotify",getInfo("scNotify"))
					+makeNode("scNotifyV",getInfo("scNotifyV"))
					+ makeNode("IsSMS", getChkSMS())
					+ "</forminfo></forminfoext>";		
	return forminfoext;
	//					+"<attach>"+makeNode("path", getInfo("fmpath") + getInfo("piid") +'_' + getInfo("fiid") + ".mht") +  (m_sReqMode=="TEMPSAVE"?"":getFormInfoExtAttachXML()) + "</attach>"	//첨부파일path
	//					+makeNode("IsReturn",(getInfo("scReturn")=='1'?'true':'false'))
}
function getChkSMS() {
    var _return = "N";
    try {
        if (m_oFormEditor.document.getElementsByName("CHK_SMS")[0] == undefined) {
            _return = "N";
        } else {
            if (m_oFormEditor.document.getElementsByName("CHK_SMS")[0].tagName == "span" || m_oFormEditor.document.getElementsByName("CHK_SMS")[0].tagName == "SPAN") {
                if (m_oFormEditor.document.getElementsByName("HD_CHK_SMS")[0].value == "1") {
                    _return = "Y";
                } else {
                    _return = "N";
                }
            } else {
                if (m_oFormEditor.document.getElementsByName("CHK_SMS")[0].checked) {
                    _return = "Y";
                } else {
                    _return = "N";
                }
            }
        }
    } catch (e) {
        _return = "N";
    }
    return _return;
}
function getFiscalYear(sApplyDate){
	var sFiscalYear = "";	
	sFiscalYear = sApplyDate.substring(0,4)	
	return sFiscalYear;
}
function getFormInfoExtAttachXML(){
	if(m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value != ""){
		var r, res;
		var s =m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value;
		res = /^^^/i;
		attFiles = s.replace(res, "");
		var szAttFileInfo = "";
		var m_oFileList = CreateXmlDocument();
		m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+attFiles);
		var elmRoot, elmList, elm, elmTaskInfo;
		var slocation;
		elmRoot = m_oFileList.documentElement;
		if(elmRoot != null){
			elmList = elmRoot.selectNodes("fileinfo/file");
			for (var i=0; i<elmList.length;i++) {
				elm = elmList.nextNode();
				slocation = "";					
				slocation = elm.getAttribute("location");				
				szAttFileInfo += makeNode("path", getInfo("attpath") + slocation.substring(slocation.lastIndexOf("ATTACH") + 7).replace("/", "\\"));			
			}
		}
		return szAttFileInfo;
	}else{ return "";}
}
function evalXML(sXML){
	if(!m_evalXML.loadXML(sXML)){
		var err = m_evalXML.parseError;
		throw new Error(err.errorCode,"desc:"+err.reason+"\nsrctxt:"+err.srcText+"\nline:"+err.line+"\tcolumn:"+err.linepos);
	}
}
/*
function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	m_xmlHTTP.open(sMethod,sUrl,bAsync);
	//m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
	m_xmlHTTP.setRequestHeader("Content-type", sCType);
	if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	
	if(sUrl== "../InstMgr/switchFT2Del.aspx"){//임시함 결재문서 기안시
	    var cookiedata = document.cookie; 	
	    if(cookiedata.indexOf("chkTempListView=True") > -1){ 
	    }
	    else{
	        (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send(); 
	    }  
	 }
	 else{
	    (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
	 }
}
*/
function receiveHTTP(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		var xmlReturn=m_xmlHTTP.responseXML;
		var bCompensate=false;
		var sParam="top.close()";
		if(m_sReqMode == "EDMS") sParam=null;
		m_oFormEditor.endProgress();
		if(((!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(xmlReturn) :xmlReturn.xml)==""){
			bCompensate=true;
			sParam=null;			
		}else{
			var errorNode=xmlReturn.selectSingleNode("response/error");
			if(errorNode!=null){
				bCompensate=true;sParam=null;alert("Desc: " + errorNode.text);
			}else{
				switch(m_sReqMode){
					case "RECREATE":
					//try{saveApvDocument(xmlReturn.selectSingleNode("response/docno").text); }catch(e){}
  					parent.refreshList();
					
					//2018.09.12 psw
					tongPush("REDRAFT");
					break;
					
					case "APPROVE"://debugger;//try{saveApvDocument(xmlReturn.selectSingleNode("response/docno").text); }catch(e){}
				    parent.refreshList();
					
					//2018.09.12 psw
					tongPush("APPROVE");
				    
					break;
					case "SIGN":
						sParam=null;document.getElementById("btSign").style.display = "none";parent.refreshList();
						break;
					case "DRAFT":
						try
						{//이준희(2011-01-21): 
							if(wgCEPSBas.CEPD.ID != '')
							{//alert(parent.opener.opener.frames.length);
								wgCEPSBas.location = wgCEPSBas.location.toString();
							}//parent.opener.frames[0].location = '/CEPS/Dum/Dum.htm?CEPSMod=Bas&Dst=';
						}//wgCEPSBas.location = parent.sgCEPSUrlRot + 'CEPS/Dum/Dum.htm?CEPSMod=Bas&Dst=';
						catch(e)
						{
						}			    
						alert(gMessage70);//debugger;//"결재문서작성이 완료되었습니다."
						
						//2018.09.12 psw
						tongPush("DRAFT");
						
						if (getInfo("mode") == "TEMPSAVE" && getInfo("ustmplistview") != "Y") {//2010.11 개인환경설정이용							
							var sFiid=getInfo("fiid");														
							setInfo("fiid",getInfo("fiid_spare"));
							setInfo("fiid_spare",sFiid);							
							var sItem = "<request><item id=\""+getInfo("ftid")+"\" fitn=\""+getInfo("fitn")+"\" fiid=\""+getInfo("fiid")+"\" fmpf=\""+getInfo("fmpf")+"\"/></request>";							
							evalXML(sItem);						
					    
							var sUrl = "../InstMgr/switchFT2Del.aspx";								
							requestHTTP("POST",sUrl,false,"text/xml",null,sItem);
							receiveGeneralQuery();
							parent.refreshList(); 
						}//fiid switching
						break;
					case "TEMPSAVE":
					    alert(gMessage71); //"임시함에 저장되었습니다."

				   	if (getInfo("mode") == "TEMPSAVE" || getInfo("mode") == "DRAFT") { if (!m_bTabForm) { parent.gotoFolder('../list.aspx?uid=' + getInfo("usid") + '&location=TEMPSAVE', '임시함');} }
				   	setInfo("mode", "TEMPSAVE"); setInfo("ftid", xmlReturn.selectSingleNode("response/ftid").text);
				   	break;
					case "WITHDRAW": requestTempSaveProcess("TEMPSAVE"); parent.refreshList();alert(xmlReturn.selectSingleNode("response").text);
						break;
					case "CHARGE":
					case "REDRAFT":
					case "ITRANS": 
					case "OTRANS": parent.refreshList();
						break;
					case "EDMS": setInfo("fmbd") = "<html><head></head><body>"+xmlReturn.selectSingleNode("response").text+"</body></html>";
						break;
					default:break;
				}
			}
		}
		if(bCompensate){
			switch(m_sReqMode){
				case "DRAFT": 
					if(getInfo("mode")=="TEMPSAVE"){var sFiid=getInfo("fiid_spare");setInfo("fiid_spare",getInfo("fiid"));setInfo("fiid",sFiid);}	//fiid switching
					break;
				default: break;
			}
		}
		disableBtns(false);
		//m_oFormEditor.endProgress(sParam);
		if(sParam != null){ //다중 문서 open 경우로 수정
			if(m_bTabForm){//탭문서 보기 OPEN
				parent.parent.closeFormbyForm();
            } else {
            ///* [2013-11-14] PSW 수정 3*///
                //if (getInfo("mode") != "TEMPSAVE") {
                    //2014-06-11 hyh 추가
 	           try {
        	        if (getInfo("mode") == "DRAFT") {
                	    top.opener.parent.document.getElementById("leftFrame").contentWindow.getApprovalCountDraft();
	                }
        	    }
	            catch (e) { }
            //2014-06-11 hyh 추가 끝
                    top.close();
                //}
			}
		}
	}
}
function event_noop(){return(false);}
var _AutoCmm = false;
function requestProcess(sReqMode){
	m_sReqMode = sReqMode;	
    //if(evaluateForm()){	    
        if(sReqMode!="APPROVE" && sReqMode!="RECREATE"){
            if (getInfo("usmsgboxview") == "Y") {
                if(!confirm(gMessage77)){ //"처리하시겠습니까?"
                    return;
                }
            }
        }
    	try{
			disableBtns(true);
		    m_oFormEditor.beginProgress(gMessage67, gMessage67); //"잠시 기다려 주십시오… 저장하는 중"
		    var sTargetURL="submitForm.aspx";
		    var sMsgTitle;
		    var sAddage="";	
	        var aReqForm = getInfo("fmpf").split("_");	
		    m_bFileSave = true;
		    switch(sReqMode){					
			    case "DRAFT": //"기안"
				    sMsgTitle = gLabel__draft;
    				
				    if(m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value !=''){//첨부파일 존재시 수행
					    m_bFileSave = false;
					    if(m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value.indexOf("</fileinfos>") < 0)
					    {
					        try{
						        var sFiles = "<request><fileinfos>"+m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value+"</fileinfos></request>";
						        evalXML(sFiles);
						        var sURL = "/CoviWeb/approval/FileAttach/fnMoveFilegetFileInfo.aspx";
						        receiveFileHTTP("POST",sURL,sFiles);
					        }catch(e){
						        disableBtns(false);
					        }
					    }else{
					        m_bFileSave = true;
					    }
				    }				    
				    sAddage = makeNode("pipo",(document.getElementById("chk_urgent").checked==true)?"5":"3") + makeNode("dpid") + makeNode("dpid_apv") + makeNode("dpdsn") + m_oFormEditor.getFormXML();
				    m_bFrmExtDirty = true;
                                    //document.getElementsByName("frmMessengerNotice")[0].src = gMessengerCallURL + "?msgtype=CV1&users_id=" + getInfo("usid");
				    
					//2017.8.23 LHI hrTong에 푸시
					/*
					if (top.name != "newWindow"){
						if (top.opener.parent.parent.parent.frames["topFrame"].document.frames["TongPushfr"] != null) {   
							top.opener.parent.parent.parent.frames["topFrame"].document.frames["TongPushfr"].location.href = "/CoviWeb/TongPush.aspx?userId=" + getNextApprover() + "&subject=" + m_oFormEditor.document.getElementsByName("SUBJECT")[0].value;
						}
					}
					*/
					//tongPush("DRAFT");
					
					
					break;
			    case "CHANGEAPV":	//"결재선변경"
				    sMsgTitle = gLabel__changeapprover;

				    m_bFileSave = true;
				    sTargetURL="ReassignApvList.aspx";				    
				    sAddage = m_oFormEditor.getChangeFormXML() +makeNode("PIID",getInfo("piid"))+makeNode("admintype", parent.admintype);

				    m_bFrmExtDirty = true;
				    break;
			    case "BYPASS":	//"결재선변경"
				    sMsgTitle = gLabel__changeapprover;

				    m_bFileSave = true;
				    sTargetURL="ReassignApvList.aspx";				    
				    sAddage = makeNode("PIID",getInfo("piid"))+makeNode("wfid",m_wfid)+makeNode("name","",null,true);

				    m_bFrmExtDirty = true;
				    break;						
			    case "CHARGE": //"담당자 지정"
				    sMsgTitle = gLabel__Charger;
				    var szdoclisttype = "2";
				    if(getInfo("scChgr")==1 || getInfo("scDRec")==1 ||  getInfo("scChgrOU")==1){szdoclisttype = "6";}
    				
				    if(m_oFormEditor.document.getElementsByName("attach")[0].value !=''){//첨부파일 존재시 수행
					    try{
						    var sFiles = "<request>"+m_oFormEditor.document.getElementsByName("attach")[0].value+"</request>";
						    evalXML(sFiles);
						    var sURL = "/CoviWeb/approval/FileAttach/fnMoveFilegetFileInfo.aspx";
						    receiveFileHTTP("POST",sURL,sFiles);
					    }catch(e){
						    disableBtns(false);
					    }
				    }
    				
				    sTargetURL="reassignWorkItem.aspx";
				    sAddage = makeNode("gubun",m_sAddList)+makeNode("id",document.getElementsByName("CHARGEID")[0].value,null,true) + makeNode("name",document.getElementsByName("CHARGENAME")[0].value) +  makeNode("dpid") + makeNode("dpid_apv") + makeNode("dpdsn")
				    + makeNode("isissuedocno", 'false') + makeNode("doclisttype", szdoclisttype) + m_oFormEditor.getFormXML() + makeNode("admintype", parent.admintype) + makeNode("apvcmt", document.getElementsByName("ACTIONCOMMENT")[0].value);
    				
				    m_bFrmExtDirty = true;
				    break;
			    case "RECREATE": //"재기안"

				    //2014-07-29 hyh 추가
				    if (getInfo("commentlist").indexOf("rejectedtodept") > -1) {
				        var m_Comment = CreateXmlDocument();
				        var elm;
				        m_Comment.loadXML("<?xml version='1.0' encoding='utf-8'?>" + getInfo("commentlist"));
				        var m_CommentList = m_Comment.selectNodes("WF_COMMENT/comment_list");
				        for (var i = 0; i < m_CommentList.length; i++) {
				            var comment_list = m_CommentList[i].getAttribute("COMMENT");
				            if (m_CommentList[i].getAttribute("COMMENT").indexOf("rejectedtodept") > -1) {
				                var removeComment = m_CommentList[i].xml;
				                setInfo("commentlist", getInfo("commentlist").replace(removeComment, ""));
				            }
				        }
				    }
				    //2014-07-29 hyh 추가 끝

			   	    sMsgTitle = gLabel__redraft;
				    var szdoclisttype = "2";
				    if (getInfo("scChgr") == 1 || getInfo("scDRec") == 1 || getInfo("scChgrOU") == 1 || getInfo("scPRec") == 1) {
					    szdoclisttype = "6";
				    }

				    if (m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value != '') {//첨부파일 존재시 수행
					    m_bFileSave = false;
					    try{
					        //2013-04-17 hyh 수정
					        //var sFiles = "<request>" + m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value + "</request>";
					        if (m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value.indexOf("<fileinfos>") > -1) {
					            var sFiles = "<request>" + m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value + "</request>";
					        } else {
					            var sFiles = "<request><fileinfos>" + m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value + "</fileinfos></request>";
					        }
					        //2013-04-17 hyh 수정 끝
						    evalXML(sFiles);
						    var sURL = "/CoviWeb/approval/FileAttach/fnMoveFilegetFileInfo.aspx";
						    receiveFileHTTP("POST",sURL,sFiles);
					    }catch(e){
						    disableBtns(false);
					    }
				    }
				    if(getInfo("scSign")=="1" && document.getElementsByName("SIGNIMAGETYPE")[0].value ==""){
				        document.getElementsByName("SIGNIMAGETYPE")[0].value = getInfo("usit");
				    }				    
    								    
				    sAddage =  makeNode("pipo",(document.getElementById("chk_urgent").checked==true)?"5":"3") + makeNode("dpid") + makeNode("dpid_apv") + makeNode("dpdsn") + makeNode("actidx",document.getElementsByName("ACTIONINDEX")[0].value)+ makeNode("actcmt",document.getElementsByName("ACTIONCOMMENT")[0].value,null,true)	+ makeNode("signimagetype",document.getElementsByName("SIGNIMAGETYPE")[0].value,null,true)
				    + makeNode("isissuedocno", getIsIssueDocNo()) + makeNode("doclisttype", szdoclisttype) + makeNode("signimagetype", document.getElementsByName("SIGNIMAGETYPE")[0].value, null, true)
                    + m_oFormEditor.getChangeFormXML() + makeNode("islast", getIsLast()); //2007.08추가 // getFormXML() -> getChangeFormXML() (변경부분만 히스토리에 남김(2013-04-04 leesh)
    				    				
				    m_bFrmExtDirty = true;
				    if((getInfo("REQ_RESPONSE") == "Y") || (getInfo("fmpf") == "HK_DRAFT_COOPERATION")) m_bFrmInfoDirty = true;
				    break;
				case "APPROVE": //"결재"
				    sMsgTitle = gLabel__app;

				    if (m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value != '') {//첨부파일 존재시 수행
				        m_bFileSave = false;
				        if (m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value.indexOf("</fileinfos>") < 0) {
				            try {
				                var sFiles = "<request><fileinfos>" + m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value + "</fileinfos></request>";
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

				    sAddage = makeNode("pipo", (document.getElementById("chk_urgent").checked == true) ? "5" : "3") + makeNode("usem") + makeNode("dpid") + makeNode("dpid_apv") + makeNode("dpdsn") + makeNode("usid") + makeNode("usdn") + makeNode("deputy", (m_bDeputy) ? "true" : "false")
				    + makeNode("actidx", document.getElementsByName("ACTIONINDEX")[0].value)
				    + makeNode("actcmt", document.getElementsByName("ACTIONCOMMENT")[0].value, null, true)
				    + makeNode("signimagetype", document.getElementsByName("SIGNIMAGETYPE")[0].value, null, true)
				    + makeNode("isissuedocno", getIsIssueDocNo())
				    + makeNode("doclisttype", "1")
				    + m_oFormEditor.getChangeFormXML() + makeNode("islast", getIsLast()); //변경내용 부분은 확인필요
				    if (getInfo("mode") == 'APPROVAL' || getInfo("mode") == 'RECAPPROVAL' || getIsIssueDocNo() == "true") m_bFrmExtDirty = true; //결재,수신결재일경우만넘김																				

				    m_bFrmExtDirty = true;
				    m_bFrmInfoDirty = true;
				    //
				    //debugger;

				    m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>" + document.getElementsByName("APVLIST")[0].value);
				    var elmRoot = m_evalXML.documentElement;
                    /*
                    //2013-09-27 hyh 추가 지정반송 후 지정반송자가 다시 결재시에 반송사유 삭제
                    if (elmRoot.getElementsByTagName("comment")[0] != null) {
				        if (elmRoot.getElementsByTagName("comment")[0].getAttribute("relatedresult") == "rejectedto") {
				            var commentNode = elmRoot.getElementsByTagName("comment")[0];
				            commentNode.parentNode.removeChild(commentNode);
				        }
				    }
                    m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>" + getInfo("commentlist"));
				    var commentRoot = m_evalXML.documentElement;
				    if (commentRoot.getElementsByTagName("comment_list")[0] != null) {
				        var commentNode = commentRoot.getElementsByTagName("comment_list")[0];
				        commentNode.parentNode.removeChild(commentNode);
                    }
				    //2013-09-27 hyh 추가 끝
                    */
				    var oRecSteps = elmRoot.selectNodes("division[@divisiontype='receive' and taskinfo/@status='pending' ]/step/ou/person/taskinfo[@kind!='review' and @kind!='bypass' and  @kind!='skip' ]");
				    var oinaciveRecSteps = elmRoot.selectNodes("division[@divisiontype='receive' and taskinfo/@status='pending']/step[(@routetype!='review' and  @unittype='person' ) or (@routetype!='review' and  @unittype='ou' and taskinfo/@status='inactive') ]/ou/*[(taskinfo/@kind!='review' and taskinfo/@kind!='bypass' and  taskinfo/@kind!='skip' and taskinfo/@status='inactive') or @status='inactive' ]");
				    //debugger;
				    if (getInfo("scAutoCmm") == "1" && oRecSteps.length == getInfo("scAutoCmmV") && oinaciveRecSteps.length == 1) {
				        if (!confirm(gMessage324)) {
				            _AutoCmm = true;
				        }
				    }

				    //메신져클라이언트 결재카운터 호출위한 나라비젼측 페이지호출 (2013-02-25 HIW)
				    //document.all.frmMessengerNotice.src = "../Test.aspx";
				    //document.all.frmMessengerNotice.src = gMessengerCallURL + "?msgtype=COV&users_id=" + getInfo("usid"); //타브라우저 오류 나서 수정
				    document.getElementsByName("frmMessengerNotice")[0].src = gMessengerCallURL + "?msgtype=COV&users_id=" + getInfo("usid");
				    
					//2017.8.23 LHI hrTong에 푸시
					/*
					if (top.name != "newWindow"){
						if (top.opener.parent.parent.parent.frames["topFrame"].document.frames["TongPushfr"] != null) {   
							top.opener.parent.parent.parent.frames["topFrame"].document.frames["TongPushfr"].location.href = "/CoviWeb/TongPush.aspx?userId=" + getNextApprover() + "&subject=" + m_oFormEditor.document.getElementsByName("SUBJECT")[0].value;
						}
					}
					*/
					//tongPush("APPROVE");
					
					
					break;
			    case "ITRANS": //"시행문변환"
				    var sURL = "formTransEnforce.aspx?fmcnt="+(m_oFormEditor.document.getElementsByName("aSubject").length-1);
				    receiveFileHTTP("GET",sURL,null);
				    switch(getInfo("pfsk")){
					    case "T001": document.getElementById("btITrans").style.display = "";
								break;
					    case "T002": document.getElementById("btOTrans").style.display = "";
								break;
				    }
				    sMsgTitle = gLabel__Trans1;
				    sAddage = makeNode("usem")				    
				    + makeNode("actidx","approve")
				    + makeNode("actcmt",document.getElementsByName("ACTIONCOMMENT")[0].value,null,true)
				    + m_oFormEditor.getFormXML();
				    m_bFrmExtDirty = true;
				    m_bFrmInfoDirty = true;
				    break;
			    case "OTRANS": //"대외공문변환"				    
				    switch(getInfo("pfsk")){
					    case "T001": document.getElementById("btITrans").style.display = "";
								break;
					    case "T002": document.getElementById("btOTrans").style.display = "";
								break;
				    }
				    sMsgTitle = gLabel__Trans2;
				    sAddage = makeNode("usem")				    
				    + makeNode("actidx",document.getElementsByName("ACTIONINDEX")[0].value)
				    + makeNode("actcmt",document.getElementsByName("ACTIONCOMMENT")[0].value,null,true)
				    + m_oFormEditor.getFormXML();
				    m_bFrmInfoDirty= true;
				    break;
			    case "SIGN": //"직인처리"
				    sMsgTitle = gLabel__jic;
				    sAddage = makeNode("usem") +  makeNode("dpid") + makeNode("dpid_apv") + makeNode("dpdsn")				    
				    + makeNode("actidx",document.getElementsByName("ACTIONINDEX")[0].value)
				    + makeNode("actcmt",document.getElementsByName("ACTIONCOMMENT")[0].value,null,true)
				    + makeNode("isissuedocno","true")
				    + makeNode("doclisttype","3")					
				    + m_oFormEditor.getFormXML();
				    m_bFrmExtDirty = true; //문서번호 넘김
				    m_bFrmInfoDirty= true;
				    break;
			    case "TEMPSAVE": //"임시함"					
				     //2006.09.20 김현태 첨부파일 임시저장 수행						
				    if(m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value !=''){//첨부파일 존재시 수행
					    m_bFileSave = false;
					    if(m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value.indexOf("</fileinfos>") < 0)
					    {
					        try{
						        var sFiles = "<request><fileinfos>"+m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value+"</fileinfos></request>";
						        evalXML(sFiles);
						        var sURL = "/CoviWeb/approval/FileAttach/fnMoveFilegetFileInfo.aspx";
						        receiveFileHTTP("POST",sURL,sFiles);
					        }catch(e){
						        disableBtns(false);
					        }
					    }else{
					        m_bFileSave = true;
					    }
				    }
    				
				    sMsgTitle = gLabel__composing;
				    //if(getInfo("mode")=="REJECT"){} 반려뿐만 아니라 전체 문서 임시저장 가능																	
				    if(getInfo("mode")!="DRAFT" && getInfo("mode")!="TEMPSAVE"){var sFiid=getInfo("fiid");setInfo("fiid",getInfo("fiid_spare"));setInfo("fiid_spare",sFiid);}						
				    sTargetURL="../TempSave/saveForm.aspx";				   
				    sAddage=makeNode("fmfn")+m_oFormEditor.getFormXML();
    			
				    m_bFrmExtDirty = true;
				    break;
			    case "WITHDRAW": //"결재문서 회수"
				    sMsgTitle = gLabel__Doc_back;
				    sTargetURL="../InstMgr/switchPI2Abort.aspx";
				    sAddage =  makeNode("usid") + makeNode("actcmt",document.getElementsByName("ACTIONCOMMENT")[0].value,null,true)+ makeNode("type","withdraw") +makeNode("IsMobile",(getInfo("scMobile")=="1"?'true':'false')) + getInfoBodyContext() ;//2007.08 수정
				    break;
			    case "ABORT": //"결재문서 취소"
				    sMsgTitle = gLabel__Doc_cancel;
				    sTargetURL="../InstMgr/switchPI2Abort.aspx";
				    sAddage =  makeNode("usid") + makeNode("actcmt",document.getElementsByName("ACTIONCOMMENT")[0].value,null,true) + makeNode("type","abort") +makeNode("IsMobile",(getInfo("scMobile")=="1"?'true':'false'))+ getInfoBodyContext() ;//2007.08 수정
				    break;
			    case "APPROVECANCEL": //"승인 취소"
				    sMsgTitle = gLabel__Approve_cancel;
				    sTargetURL="../InstMgr/switchWI2Cancel.aspx";
				    sAddage =  makeNode("usid") + makeNode("actcmt",document.getElementsByName("ACTIONCOMMENT")[0].value,null,true) ;
				    break;
			    case "MONITOR": //"결재문서 확인"
				    sMsgTitle = gLabel__Doc_OK;
				    sTargetURL="../InstMgr/switchMonitorOK.aspx";
				    break;
				case "DELETEDOC":   //결재문서삭제
					sMsgTitle = "결재문서 삭제";
					m_bFileSave = true;sTargetURL="../InstMgr/deletePIForm.aspx";	
					sAddage =  makeNode("usid") 
					        + makeNode("DOC_NO",(m_oFormEditor.document.getElementsByName("DOC_NO")[0]==undefined)?"":m_oFormEditor.document.getElementsByName("DOC_NO")[0].value)
					        + makeNode("OfficialDocNo",getInfo("scOfficialDocNo"));
					break;
				case "FORCEDCONSENT": //강제합의
				    sMsgTitle = "결재문서 삭제";
					m_bFileSave = true;sTargetURL="../InstMgr/ForcedConsent.aspx";	
					sAddage =  makeNode("usid");
					sAddage =  makeNode("PARENT_PROCESS_ID",getInfo("piid2"));		
					break;
			    default:
				    alert("["+sReqMode+"]" + gMessage72); //는 지정되지 않은 모드입니다.
				    return;
		    }
		    try{
			    if(m_bFileSave == true){					
				    if(getInfo("mode")=="PREDRAFT"){setInfo("mode","DRAFT");}
			        if(sReqMode == "DRAFT" &&  getInfo("mode")=="TEMPSAVE"){				            
				        var sFiid=getInfo("fiid");														
				        setInfo("fiid",getInfo("fiid_spare"));
				        setInfo("fiid_spare",sFiid);
								sAddage	+= makeNode("fiid_spare",getInfo("fiid_spare"));    					
			        }	//fiid switching
			        var defaultXML = getDefaultXML();
					if(_AutoCmm){
					    defaultXML = defaultXML.replace("<scAutoCmm>1","<scAutoCmm>0");
					}
					
                    //2013-09-27 hyh 추가 지정반송 후 지정반송자가 다시 결재시에 반송사유 삭제
					
					var apvList = getDefaultXML().substring(getDefaultXML().indexOf("<apvlist>"), getDefaultXML().indexOf("</apvlist>")+10);
					m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>" + apvList);
					var removeComment;
					for (i = 0; i < m_evalXML.documentElement.parentNode.getElementsByTagName("comment").length; i++) {
					    if (m_evalXML.documentElement.parentNode.getElementsByTagName("comment")[i].getAttribute("relatedresult") == "rejectedto")
					        removeComment = m_evalXML.documentElement.parentNode.getElementsByTagName("comment")[i].xml;
                    }
					if (getDefaultXML().indexOf("<comment relatedresult=\"rejectedto\"") > -1) {
					    defaultXML = getDefaultXML().replace(removeComment,"");
                    }
					//2013-09-27 hyh 추가 끝

					//2013-09-27 수정 지정반송 후 지정반송자가 다시 결재시에 반송사유 삭제
                    /*
					//var sText = "<request>"+defaultXML+sAddage+"</request>";
					var sText = "<request>" + getDefaultXML() + sAddage + "</request>";
                    */
					var sText = "<request>"+defaultXML+sAddage+"</request>";
					//2013-09-27 수정 끝
					evalXML(sText);							
				
				    requestHTTP("POST",sTargetURL,true,"text/xml",receiveHTTP,sText);//false
			    }else{
				    disableBtns(false);
				    alert(gMessage203); //"첨부파일이 정상적으로 처리되지 않았습니다."
			    }
		    }catch(e){
			    disableBtns(false);
			    m_oFormEditor.endProgress();
			    alert(gMessage73 + "\nDesc:"+e.description + "\nError number: " + e.number); //"저장하지 못했습니다."
		    }
		}catch(e){alert(e.description);}
	//}else{
	//	disableBtns(false);
	//}
                                    //document.getElementsByName("frmMessengerNotice")[0].src = gMessengerCallURL + "?msgtype=CV1&users_id=" + getInfo("usid");
}
/////////////////////////////////////////////////////////////////
// 작성일 : 2006-09-21
// 작성자 : 박상호
// 내  용 : 이부분이 늘어 날 수 있음, 늘어나게될경우 정리필요
/////////////////////////////////////////////////////////////////
function circOpen(){
	var strURL = "../Circulation/Circulation_Update.aspx?piid=" + getInfo("piid") + "&fiid=" + getInfo("fiid") + "&openDo=Circulate&openType=2";
	var nWidth = 400;
	var nHeight = 400;	
	openWindow(strURL,"Cirdulation",nWidth,nHeight, "fix");
}
function ccOpen(){
	var strURL = "../Circulation/Circulation_Update.aspx?piid=" + getInfo("piid") + "&fiid=" + getInfo("fiid") + "&openDo=Circulate&openType=1";
	var nWidth = 400;
	var nHeight = 400;	
	openWindow(strURL,"Cirdulation",nWidth,nHeight, "fix");
}
function receiveOpen(){
	var strURL = "../Circulation/Circulation_Update.aspx?piid=" + getInfo("piid") + "&fiid=" + getInfo("fiid") + "&openDo=Circulate&openType=0";
	var nWidth = 400;
	var nHeight = 400;	
	openWindow(strURL,"Cirdulation",nWidth,nHeight, "fix");
}
/////////////////////////////////////////////////////////////////

var printDiv;
function doButtonAction(obj) {//debugger;
	var sUrl;
	var iWidth=640;
	var iHeight=480;
	var sSize="fix";
	//var elmComment;
	
	var formNm = getInfo("fmpf");
    if(m_oFormEditor.location.pathname.indexOf('read.htm') > -1){
	    m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>" +document.getElementsByName("APVLIST")[0].value);
	    var elmlength = m_evalXML.selectNodes("steps/division/step").length;			    
	    for(k=0; k<elmlength; k++){
	        var commentCount = 0;
	        var elmComment = m_evalXML.selectSingleNode("steps/division/step/ou/person/taskinfo/comment");
	        if(elmComment != null){++commentCount;}
	    }
    }
	
	try{
		switch(obj.id){
            case "bt_receive_cc": //수신/참조
                receiveOpen();
	            break;			
            case "btreceive": //수신
	            iWidth=400;iHeight=400;
                receiveOpen();
	            break;	
            case "btCC": //참조
	            iWidth=400;iHeight=400;
                ccOpen();
	            break;					
            case "btCirculate": //회람				
	            iWidth = 920;iHeight  = 600; sSize = "fix";	//hjy iHeight:520
	            sUrl= "../Circulation/CirculationMgr.aspx?piid=" + getInfo("piid") + "&fiid=" + getInfo("fiid") + "&openDo=Circulate&openType=2"; //hjy				
	            break;
            case "bt_receive_cc_circulation": //수신/참조/회람 
                sUrl= "../Circulation/CirculationMgr.aspx?piid=" + getInfo("piid") + "&fiid=" + getInfo("fiid") + "&openDo=Circulate&openType=0";
                iWidth = 900;	iHeight  = 520;		sSize = "fix";
                break;
            case "btDraft": //기안하기

                if ((getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE") && getInfo("scFRMAPVLINE") == "1") {
                    parent.editor.chkApplyAPVLine();
                }
                m_sReqMode = "DRAFT";
                if (evaluateForm()) {
                    if (_Browser == "CHROME") {
                        iHeight = 370; iWidth = 500;
                    }
                    else if (_Browser == "FIREFOX") {
                        iHeight = 330; iWidth = 500;
                    }
                    else if (_Browser == "SAFARI") {
                        iHeight = 220; iWidth = 500;
                    }
                    else {
                        iHeight = 274; iWidth = 500;
                    }
                    sUrl = "../ApvProcess/ApvprocessDraft.aspx?type=DRAFT";
                    sWindowName = "winAction"; sSize = "resize";
                }
                break;
            case "btChgApv": //결재선변경
	            changeApvList();
	            break;
            case "btLine": //결재선관리
	            if((getInfo("loct")=="MONITOR") ||(getInfo("loct")=="PREAPPROVAL") || (getInfo("loct")=="PROCESS") ||(getInfo("loct")=="REVIEW") ||  (getInfo("loct")=="COMPLETE") || (getInfo("mode")=="REJECT")|| (getInfo("mode")=="JOBDUTY") || (getInfo("mode")=="PCONSULT") || getInfo("pfsk")=="T019"){ //20110318확인결재추가-확인결재자 결재선변경권한없음
		            iHeight = 400; iWidth = 750;  //iHeight = 600; iWidth = 950;
		            sUrl="../ApvlineMgr/ApvlineViewer.aspx";
	            }else{
		            if((getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE") && getInfo("scFRMAPVLINE") == "1"){    
			            parent.editor.chkApplyAPVLine();
		            }
			        iHeight = 590; iWidth = 920;  //iHeight = 548; iWidth = 920;
		            sUrl="../ApvlineMgr/ApvlineMgr.aspx";
	            }				
	            break;
	        case "btAction": //결재하기

	            //2016.4.4 PSW 추가
	            if (getInfo("fmpf") == "WF_FORM_COMMON_BUDGET_CHG") {
	                try {
	                    if (!m_oFormEditor.CheckValidationByReceiptDept())
	                        return;
	                }
	                catch (e) { }
	            }

	            iHeight = 280; iWidth = 630; sSize = "resize";
	            sUrl = "../ApvProcess/Apvprocess.aspx";

	            break;
	        case "btDeptDraft": //재기안 2007.07 기안과 UI 통일	requestProcess("RECREATE");break;

		    //2014-07-29 hyh 추가
                if (getInfo("commentlist").indexOf("rejectedtodept") > -1) {
	                var m_Comment = CreateXmlDocument();
	                var elm;
	                m_Comment.loadXML("<?xml version='1.0' encoding='utf-8'?>" + getInfo("commentlist"));
	                var m_CommentList = m_Comment.selectNodes("WF_COMMENT/comment_list");
	                for (var i = 0; i < m_CommentList.length; i++) {
	                    var comment_list = m_CommentList[i].getAttribute("COMMENT");
	                    if (m_CommentList[i].getAttribute("COMMENT").indexOf("rejectedtodept") > -1) {
	                        var removeComment = m_CommentList[i].xml;
	                        setInfo("commentlist", getInfo("commentlist").replace(removeComment, ""));
	                    }
	                }
	            }
	            //2014-07-29 hyh 추가 끝

	            //신청양식 주관부서작성란 Validation체크 (2013-01-18 HIW)
	            if (getInfo("fmpf") == "WF_FORM_ERP_EVENT" || getInfo("fmpf") == "WF_FORM_ERP_IN_TRIP" || getInfo("fmpf") == "WF_FORM_ERP_OUT_TRIP" || getInfo("fmpf") == "WF_FORM_COMMON_BUDGET_CHG") {
	                try {
	                    if (!m_oFormEditor.CheckValidationByReceiptDept())
	                        return;
	                }
	                catch (e) { }
	            }

                //document.getElementsByName("ACTIONINDEX")[0].value = "approve";
                //iHeight = 280; iWidth = 500;	sUrl="../ApvProcess/ApvprocessDraft.aspx?type=RECREATE";sWindowName = "winAction";

                document.getElementsByName("ACTIONINDEX")[0].value = "approve";


                 if (getInfo("fmpf") == "WF_SLIP") {

	                var XmlParse = CreateXmlDocument();
	                XmlParse.loadXML("<?xml version='1.0' encoding='utf-8'?>" + document.getElementsByName("APVLIST")[0].value);
	                var EmlRecivecode = XmlParse.selectNodes("steps/division");
	                var recivecode;
	                
					 //20180621 크로스브라우징 처리
	                /*
                    for (var i = 0; i < EmlRecivecode.length; i++) {
	                    if (EmlRecivecode[i].getAttribute("divisiontype") == "receive") {
	                        recivecode = EmlRecivecode[i].getAttribute("oucode");
	                    }
	                }
					*/
					
					var agent = navigator.userAgent.toLowerCase();

	                if (agent.indexOf("chrome") != -1) {

	                    for (var i = 0; i < EmlRecivecode.length; i++) 
	                    {
	                        if (EmlRecivecode.item[i].attributes[0].value == "receive") 
	                        {
	                            recivecode = EmlRecivecode.item[i].attributes[3].value;
	                        }
	                    }

	                }
	                else
	                {
	                    for (var i = 0; i < EmlRecivecode.length; i++) 
	                    {
	                        if (EmlRecivecode[i].getAttribute("divisiontype") == "receive")
	                        {
	                            recivecode = EmlRecivecode[i].getAttribute("oucode");
	                        }
	                    }

	                }
	                //크로스부라우징 처리 끝
					

	                var xmlbodycontext = CreateXmlDocument();
	                xmlbodycontext.loadXML("<?xml version='1.0' encoding='utf-8'?>" + getInfo("BODY_CONTEXT"));
	                var Emlgbnno = xmlbodycontext.selectSingleNode("BODY_CONTEXT/gbnno").text;
	                var Emlentcode = xmlbodycontext.selectSingleNode("BODY_CONTEXT/entcode").text;

	                iHeight = 280; iWidth = 500; sUrl = "../ApvProcess/ApvprocessDraft.aspx?type=RECREATE&fmpf=" + getInfo("fmpf") + "&FIID=" + getInfo("fiid") + "&gbnno=" + Emlgbnno + "&recivecode=" + recivecode + "&entcode=" + Emlentcode + ""; sWindowName = "winAction";

	            }
	            else {

	                iHeight = 280; iWidth = 500; sUrl = "../ApvProcess/ApvprocessDraft.aspx?type=RECREATE"; sWindowName = "winAction";
	            }

                sSize = "resize";
				
				//2017.8.23 LHI hrTong에 푸시
		        //alert("3 top.name : "+ top.name); //newWindow
				/*
				if (top.name != "newWindow"){
					if (top.opener.parent.parent.parent.frames["topFrame"].document.frames["TongPushfr"] != null) {   
						top.opener.parent.parent.parent.frames["topFrame"].document.frames["TongPushfr"].location.href = "/CoviWeb/TongPush.aspx?userId=" + getNextApprover() + "&subject=" + m_oFormEditor.document.getElementsByName("SUBJECT")[0].value;
					}
				}
				*/
				//tongPush("btDeptDraft");
				
				
				
                break;
            case "btCharge": //재기안담당자 지정
	            m_sAddList ='charge'; addList(m_sAddList);
	            break;
            case "btDeptLine": //재기안결재선관리
	            iHeight = 600; iWidth = 950;sUrl="../ApvlineMgr/ApvlineMgr.aspx";
	            break;
	        case "btAttach": //첨부파일	
	            if (!("ActiveXObject" in window)) {//CB
	                attFile3(); iWidth = 280; iHeight = 150;
	            } else {
	                if (gFileAttachType == "1") { //시스템 사용 첨부파일 컴포턴트 0 : CoviFileTrans, 1:DEXTUploadX					
	                    attFile(); iWidth = 480; iHeight = 326;
	                } else {
	                    attFile2(); iWidth = 480; iHeight = 326;
	                }
	            }
	            break;
            case "menu2": //첨부..
              if(gFileAttachType == "1"){ //시스템 사용 첨부파일 컴포턴트 0 : CoviFileTrans, 1:DEXTUploadX					
		            attFile();iWidth=480;iHeight=326;break;
	            }else{
		            attFile2();iWidth=480;iHeight=326;break;
	            }
            case "btPreView": //미리보기
	            sSize = "resize";iWidth=790;iHeight=window.screen.availHeight-100;sUrl="PREVIEW.htm";
                break;
            
	        case "btPrint": //인쇄
	            if (elmComment == null) {
	                try { m_oFormEditor.document.getElementById("tbCommentView").style.display = "none"; } catch (e) { }
	            } else {
	                if (confirm(gMessage288)) {//"의견을 포함하여 인쇄하시겠습니까?\n [확인]->[의견포함],\n [닫기]->[의견미포함]"
	                    try { m_oFormEditor.document.getElementById("tbCommentView").style.display = ""; } catch (e) { }
	                } else {
	                    try { m_oFormEditor.document.getElementById("tbCommentView").style.display = "none"; } catch (e) { }
	                }
	            }

	            m_CmtBln = false;
	            m_oFormEditor.bPresenceView = false;
	            //m_oFormEditor.displayApvList(m_evalXML); 20160315 jkh출력중복에 대한 주석처리

	            //에디터가있는 양식과 없는양식에따라 인쇄범위를 다르게 설정 (2012-11-20 HIW)
	            if (m_oFormEditor.document.getElementById("tblDraftBody") == null) {  //에디터없는 양식
	                printDiv = m_oFormEditor.document.getElementById("bodytable").innerHTML; iWidth = 100; iHeight = 100;
	            }
	            else {  //에디터있는 양식
	                //printDiv = m_oFormEditor.document.getElementById("bodytable").innerHTML+ m_oFormEditor.document.getElementById("divBodyContent").innerHTML + m_oFormEditor.document.getElementById("divApprovalLine").innerHTML;
	                printDiv = m_oFormEditor.document.getElementById("bodytable").innerHTML;
	                iWidth = 100; iHeight = 100; //HIW
	            }

	            if (gPrintType == "0") {
	                sUrl = "Print.htm";
	            } else if (gPrintType == "1") {
	                m_oFormReader.print_part('editor');
	            }
	            m_CmtBln = true;
	            m_oFormEditor.bPresenceView = true;
	            //m_oFormEditor.displayApvList(m_evalXML); //20160315 jkh출력중복에 대한 주석처리
	            break;
	        case "btPrintView": //인쇄미리보기
	            //debugger;
	            var commentFlag = true;
	            if (elmComment == null) {
	                try { m_oFormEditor.document.getElementById("tbCommentView").style.display = "none"; } catch (e) { }
	            } else {
	                if (confirm(gMessage288)) {//"의견을 포함하여 인쇄하시겠습니까?\n [확인]->[의견포함],\n [닫기]->[의견미포함]"
	                    try { m_oFormEditor.document.getElementById("tbCommentView").style.display = ""; commentFlag = true; } catch (e) { }
	                } else {
	                    try { m_oFormEditor.document.getElementById("tbCommentView").style.display = "none"; commentFlag = false; } catch (e) { }
	                }
	            }

	            m_CmtBln = false;
	            m_oFormEditor.bPresenceView = false;
	            m_oFormEditor.displayApvList(m_evalXML);

	            //에디터가있는 양식과 없는양식에따라 인쇄범위를 다르게 설정 (2012-11-20 HIW)
	            if (m_oFormEditor.document.getElementById("tblDraftBody") == null) {  //에디터없는 양식
	                printDiv = m_oFormEditor.document.getElementById("bodytable").innerHTML; iWidth = 800; iHeight = 700;
	            }
	            else {  //에디터있는 양식
	                //printDiv = m_oFormEditor.document.getElementById("bodytable").innerHTML + m_oFormEditor.document.getElementById("divBodyContent").innerHTML + m_oFormEditor.document.getElementById("divApprovalLine").innerHTML;
	                if (commentFlag == true) {
	                    //printDiv = m_oFormEditor.document.getElementById("bodytable").innerHTML + m_oFormEditor.document.getElementById("divBodyContent").innerHTML + m_oFormEditor.document.getElementById("divApprovalLine").innerHTML + m_oFormEditor.document.getElementById("tbCommentView").innerHTML;	
	                    printDiv = m_oFormEditor.document.getElementById("bodytable").innerHTML;
	                }
	                else {
	                    //printDiv = m_oFormEditor.document.getElementById("bodytable").innerHTML + m_oFormEditor.document.getElementById("divBodyContent").innerHTML + m_oFormEditor.document.getElementById("divApprovalLine").innerHTML;
	                    printDiv = m_oFormEditor.document.getElementById("bodytable").innerHTML;
	                }
	                iWidth = 800; iHeight = 700; //HIW
	            }

	            if (gPrintType == "0") {
	                sUrl = "PrintForm.htm";
	            } else if (gPrintType == "1") {
	                m_oFormReader.print_part('editor');
	            }
	            m_CmtBln = true;
	            m_oFormEditor.bPresenceView = true;
	            //m_oFormEditor.displayApvList(m_evalXML);
	            break;
	        case "btPrintOnlyBody": //본문만 인쇄 (2012-12-20 HIW)
	            
	            m_CmtBln = false;
	            m_oFormEditor.bPresenceView = false;
	            m_oFormEditor.displayApvList(m_evalXML);

	            //에디터가있는 양식과 없는양식에따라 인쇄범위를 다르게 설정 (2012-11-20 HIW)
	            if (m_oFormEditor.document.getElementById("tblDraftBody") == null) {  //에디터없는 양식
	                printDiv = m_oFormEditor.document.getElementById("bodytable").innerHTML; iWidth = 800; iHeight = 700;
	            }
	            else {  //에디터있는 양식
	                //if (getInfo("fmpf") == "WF_FORM_ISU_ALL_COM010") { //대내공문일경우
	                    printDiv = m_oFormEditor.document.getElementById("divBodyContent").innerHTML;
	                    iWidth = 800; iHeight = 700; //HIW
	                //}
	            }

	            if (gPrintType == "0") {
	                sUrl = "PrintForm.htm";
	            } else if (gPrintType == "1") {
	                m_oFormReader.print_part('editor');
	            }
	            m_CmtBln = true;
	            m_oFormEditor.bPresenceView = true;
	            m_oFormEditor.displayApvList(m_evalXML);
	            break;
            case "btHistory": //히스토리				
	            //sSize = "resize";iWidth=880;iHeight=680;sUrl="HistoryList.aspx?fiid=" + getInfo("fiid") +"&fmpf=" + getInfo("fmpf")+"&fmrv=" + getInfo("fmrv");break;
	            iWidth=880;iHeight=672;sUrl="HistoryList.aspx?fiid=" + getInfo("fiid") +"&fmpf=" + getInfo("fmpf")+"&fmrv=" + getInfo("fmrv");break;
            case "btBBS":			   
                var rtnBBS = GetFolderSelect(); // 게시판 선택 SiteRefence/js/Utilty.js 

                if(rtnBBS == undefined){return;}
                if(rtnBBS != null & rtnBBS[0] != "" )
                {
                    rtnBBS = "<BBS><ID_FOLDER>" + rtnBBS[0] +"</ID_FOLDER>"+"<NAME_FORDER>"+rtnBBS[1]+"</NAME_FORDER>"+ "<SUBJECT>" + getInfo("SUBJECT") + "</SUBJECT><HTML_BODY><![CDATA[" +m_oFormEditor.document.getElementById("bodytable").innerHTML + "]]></HTML_BODY></BBS>";
                    receiveBBSHTTP("POST","SendBBS.aspx",rtnBBS);
                }

	            break;
            case "btSave": //임시저장 
                if((getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE") && getInfo("scFRMAPVLINE") == "1"){    
		            parent.editor.chkApplyAPVLine();
	            }       
	            m_sReqMode = "TEMPSAVE";
	            requestProcess("TEMPSAVE");
	            break;
            case "btRecDept": //수신처 지정				
	            iWidth=480;iHeight=326;
	            sUrl="receive_list.htm";
	            break;
            case "btMail": //전자메일발송
                openWindow("PostMail.aspx","MAIL","800","600","resize");
                break;				
            case "btDoc": //문서요약정보
	            parent.editor.viewSummary();
	            break;
            case "btPost": //게시판등록
	            formPost();
	            break;
            case "btModify": //수정
	            parent.g_szEditable = true; //2006.12
	            m_oFormEditor.location.href = getInfo("fmpf")+"_V"+getInfo("fmrv")+".htm"; 
	            if(parent.admintype == "ADMIN"){document.getElementById("btchangeSave").style.display= "";}
				if (parent.admintype == "ADMIN") { document.getElementById("btnGuide").style.display = "none"; }
	            document.getElementById("btPreView").style.display= "";document.getElementById("btPrint").style.display= "none";document.getElementById("btModify").style.display="none";
                document.getElementById("btCharge").style.display = "none";
                document.getElementById("btAttached").style.display = "";
                document.getElementById("btDocLinked").style.display = "";
                document.getElementById("btDocLink").style.display = "";
                document.getElementById("btAttach").style.display = "";
                document.getElementById("btPreView").style.display = "";
                if (getInfo("scPM") == "1") { document.getElementById("btPM").style.display = ""; }

                //2016.4.4 PSW 추가
                document.getElementById("spnApprovalLineline").style.display = "";
                document.getElementById("spnApprovalLineImg").style.display = "";
                document.getElementById("spnApprovalLine").style.display = "";

	            break;
            case "btchangeSave": //수정저장
	            changeFormdata();
	            break;				
            case "btECNMail": //ECN 전자메일변환
	            sendECNMail();
	            break;		
            case "btExit":
	            try{parent.parent.Form_Close();}catch(e){}
                if(parent.close() == undefined)
                {
                   try{	if(m_bTabForm){	parent.parent.closeFormbyForm();}else{parent.parent.parent.close();}}catch(e){}
                }
                break;			
            case "btTrans": //내부결재선관리
	            if(getInfo("scIPub") == '1'){					
		            if (confirm(gMessage100)){m_oFormEditor.initEnforceForm();} //"수신처지정이 완료되었습니까?"
	            }else{	m_oFormEditor.initEnforceForm();}
	            break;
            case "btITrans": //시행문변환
	            requestProcess("ITRANS");
	            break;
            case "btOTrans": //대외공문변환				
	            iWidth=800;iHeight=600;
	            sUrl="form.aspx?fmid={24B5511A49314EF9B83BA6982AABBFD4}&fmnm=%eb%8c%80%ec%99%b8%ea%b3%b5%eb%ac%b8&fmpf=OFFICIAL_DOCUMENT&scid={F3632B012D3A4663A017C12D3C9A8C91}&mode=DRAFT&fmrv=0&fmfn=OFFICIAL_DOCUMENT";
	            break;
            case "btSign": //직인
	            m_oFormEditor.PutSignImage();	requestProcess("SIGN");
	            break;
            case "btAdd": //일괄기안 안건추가
	            m_oFormEditor.AddBody();
	            break;
            case "btDelete": //일괄기안 안건삭제
	            m_oFormEditor.DeleteBody();
	            break;
            case "btWithdraw": //회수
	            requestProcess("WITHDRAW");
	            break;
            case "btAbort": //취소
	            iHeight = 280; iWidth = 500;sUrl="../ApvProcess/ApvprocessDraft.aspx?type=WITHDRAW";sWindowName = "winAction";sSize = "resize";
	            break;
            case "btApproveCancel":
	            iHeight = 280; iWidth = 500;sUrl="../ApvProcess/ApvprocessDraft.aspx?type=APPROVECANCEL";sWindowName = "winAction";sSize = "resize";
              break;
            case "btOrder": //업무지시
	            var szURL = "/COVINet/COVIGWNet/PKnowledge/TASK_New.aspx";
	            CoviWindow(szURL,'','800','600', 'resize');				
	            break;
            case "btMonitor": //현황
	            requestProcess("MONITOR");
	            break;
	        case "btRec": //접수

	            //[2014-02-28] PSW 결재완료시 알림창 추가
	            if (!confirm("본인결재로 완료 처리하시겠습니까?")) {
	                return;
	                /*
	                //신청양식 주관부서작성란 Validation체크 (2013-01-18 HIW)
	                if (getInfo("fmpf") == "WF_FORM_ERP_EVENT" || getInfo("fmpf") == "WF_FORM_ERP_IN_TRIP" || getInfo("fmpf") == "WF_FORM_ERP_OUT_TRIP") {
	                try {
	                if (!m_oFormEditor.CheckValidationByReceiptDept())
	                return;
	                }
	                catch (e) { }
	                }
	                */
	            } else {
	                if (getInfo("fmpf") == "WF_FORM_COMMON_BUDGET_CHG") {
	                    try {
	                        if (!m_oFormEditor.CheckValidationByReceiptDept())
	                            return;
	                    }
	                    catch (e) { }
	                }
	            }

	            requestProcess("RECREATE");
	            break;
	        case "btReUse": //재사용
	            if (getInfo("mode") != "DRAFT" && getInfo("mode") != "TEMPSAVE") {
	                //반송함에서 재사용할 경우 원문서 경로 포함시키기 getInfo("pidc")
	                if (getInfo("mode") == "REJECT" && getInfo("loct") == "REJECT") {
	                    m_RejectDocLink = getInfo("wiid") + "@@@" + getPIDC() + ";" + getInfo("piid") + ";" + "" + "@@@" + getInfo("SUBJECT") + "@@@" + getInfo("DOC_NO");
	                }
	                //재사용 후 임시저장 시 fiid값원복으로 인해 주석201107
	                //var sFiid=getInfo("fiid");setInfo("fiid",getInfo("fiid_spare"));setInfo("fiid_spare",sFiid);
	                setInfo("fiid", getInfo("fiid_reuse")); setInfo("REPLY", "");
	                setInfo("piid", getInfo("piid_spare")); setInfo("pidc", ""); setInfo("mode", "DRAFT"); setInfo("loct", "DRAFT");
	                initBtn(); m_sReqMode = "DRAFT"; document.getElementsByName("APVLIST")[0].value = ""; setInfo("DOC_NO", ""); setInfo("RECEIVE_NO", ""); setInfo("INITIATOR_ID", getInfo("usid")); setInfo("INITIATOR_NAME", getInfo("usnm")); setInfo("INITIATOR_OU_ID", getInfo("dpid_apv")); setInfo("INITIATOR_OU_NAME", getInfo("dpnm_apv"));
	                setInfo("wiid", ""); //201107 재사용으로 임시저장 시 결재선 저장을 위해 처리
	                //의견부분 삭제 
	                setInfo("commentlist", "<WF_COMMENT></WF_COMMENT>");
	                m_oFormEditor.location.href = getInfo("fmpf") + "_V" + getInfo("fmrv") + ".htm";
	                document.getElementsByName("APVLIST")[0].value = '<steps initiatorcode="' + getInfo("usid") + '" initiatoroucode="' + getInfo("dpid_apv") + '" status="inactive"></steps>';
	                setDomainData(); //기본결재선 조회
	            }

	            document.getElementById("btReUse").style.display = "none"; document.getElementById("btPrint").style.display = "none"; document.getElementById("btCommentView").style.display = "none"; document.getElementById("li_btCommentView").style.display = "none"; document.getElementById("btExt").style.display = "none";

	            // 재사용시 Menu 정리 (배포번호, 배포수신함, 변경이력) display:none 처리 : 07. 7. 9. JSI
	            document.getElementById("btCirculate").style.display = "none"; document.getElementById("btCirculate_View").style.display = "none"; document.getElementById("li_btCirculate_View").style.display = "none"; document.getElementById("btHistory").style.display = "none"; document.getElementById("li_btHistory").style.display = "none"; document.getElementById("btReceiptView").style.display = "none"; document.getElementById("bt_receive_cc").style.display = "none";
	            //연결문서 & 업무메뉴얼 연결
	            if (getInfo("loct") != "DRAFT" && getInfo("loct") != "TEMPSAVE") {
	                if (getInfo("scPM") == "1" && getInfo("scPMV") != "") { if (getInfo("scPMV").split("^").length > 1) { } else { document.getElementById("btPM").style.display = ""; } }
	            } else { document.getElementById("btDocLinked").style.display = ""; document.getElementById("btDocLink").style.display = ""; if (getInfo("scPM") == "1") { document.getElementById("btPM").style.display = ""; } }
                if (parent.g_szEditable) { document.getElementById("btDocLinked").style.display = ""; document.getElementById("btDocLink").style.display = ""; document.getElementById("btPreView").style.display = ""; if (getInfo("scPM") == "1") { document.getElementById("btPM").style.display = ""; } }

	            initBtn();
	            break;
            case "btReturnForm"://회신 : 2008.08.05 백승찬 대리
                 
	            if(getInfo("mode")!="DRAFT" && getInfo("mode")!="TEMPSAVE" ){
            	    
	                checkReturnForm();
            	    
	                if(bReturnForm)
	                {
	                    //회신용 재기안지에 발신부서 정보를 수신부서에 넣기 
	                    var receiptList = getInfo("INITIATOR_OU_ID")+"|"+"Y"+"@@"; //99993|Y@@ 2008.08.06 백승찬 대리
	                    setInfo("RECEIPT_LIST",receiptList);
            		    
	                    var receiptListName = getInfo("INITIATOR_OU_ID")+":"+getInfo("INITIATOR_OU_NAME")+":Y@@";     //99999:Project Team:Y@@
	                    setInfo("RECEIVE_NAMES",receiptListName); 
            		    
	                    //회신용 재기안지에 현재 기안의 Process Instance ID 넣기
	                    setInfo("REPLY_PARENT_FORM_INST_ID",getInfo("fiid"));
	                    //회신용 재기안지는 회신기능이 적용되지 않도록 조치
	                    setInfo("scReply","0");
	                    document.getElementById("reform").style.display ="none";document.getElementById("li_reform").style.display = "none";
            		    
	                    //수신현황버튼제어
	                    document.getElementById("btReceiptView").style.display="none";document.getElementById("li_btReceiptView").style.display = "none";
            		    
		                var sFiid=getInfo("fiid");setInfo("fiid",getInfo("fiid_spare"));setInfo("fiid_spare",sFiid);
		                setInfo("piid", getInfo("piid_spare"));setInfo("pidc",""); setInfo("mode","DRAFT");setInfo("loct","DRAFT");
		                initBtn(); m_sReqMode = "DRAFT"; document.getElementsByName("APVLIST")[0].value = "";setInfo("DOC_NO","");setInfo("RECEIVE_NO","");setInfo("ATTACH_FILE_INFO","");setInfo("INITIATOR_ID",getInfo("usid"));setInfo("INITIATOR_NAME",getInfo("usnm"));setInfo("INITIATOR_OU_ID",getInfo("dpid_apv"));setInfo("INITIATOR_OU_NAME",getInfo("dpnm_apv"));
		                m_oFormEditor.location.href = getInfo("fmpf")+"_V"+getInfo("fmrv")+".htm";
		                document.getElementsByName("APVLIST")[0].value = '<steps initiatorcode="' + getInfo("usid") + '" initiatoroucode="' + getInfo("dpid_apv") + '" status="inactive"></steps>';
		                setDomainData(); //기본결재선 조회
            		    
		                // 회신 Menu 정리 
	                    document.getElementById("btCirculate").style.display="none"; document.getElementById("btCirculate_View").style.display="none";document.getElementById("li_btCirculate_View").style.display="none";document.getElementById("btHistory").style.display="none";document.getElementById("li_btHistory").style.display="none";document.getElementById("btComment").style.display="none";
	                    document.getElementById("btReUse").style.display="none"; document.getElementById("btReturnForm").style.display="none";//document.getElementById("btPrint").style.display="none";
	                }
	                else
	                {
                        alert(gMessage264);
	                }
	            }
	            break;
            case "btEDMSAttach": //EDMS 첨부
	            var szURL="http://172.20.2.152/KPlusWebMaeil/Medison/Cabinet/FindKnowledge.aspx";CoviWindow(szURL,'','800','600', 'resize');
	            break;
            case "btReceiptView": //수신현황조회
               if(getInfo("REPLY") =="1"){ 
                iHeight = 400;iWidth = 1020; 
               }
               else{
                iHeight = 400; iWidth = 800; 
               }
	            sSize = "scrollbars=1";
	            sUrl="../DocList/ReceiptList.aspx?ppiid="+getInfo("PROCESS_ID")+"&piid=" + getInfo("piid")+"&fiid="+getInfo("fiid")+"&reply="+getInfo("REPLY");//+"&reply="+getInfo("REPLY");     
	            break;
            case "bt_adminedms": //오류난 htm문서를 생성				
	            saveApvDocument(getInfo("DOC_NO")); 		
              break;
            case "btForward": //문서전달
	            //if(confirm(gMessage197)){ if((getInfo("loct") == "REDRAFT") && (getInfo("mode") == "REDRAFT" || getInfo("mode")=="SUBREDRAFT")){m_sAddList ='chargegroup';}else{m_sAddList ='charge';} addList(m_sAddList);} //"본 결재문서를 결재권한자(개인/부서)에게 전달하시겠습니까?"
                iHeight = 290; iWidth = 500; sUrl = "../ApvProcess/ApvActForward.aspx";
                break;
            case "btApproved": //승인

                //2016.4.4 PSW 추가
                if (getInfo("fmpf") == "WF_FORM_COMMON_BUDGET_CHG") {
                    try {
                        if (!m_oFormEditor.CheckValidationByReceiptDept())
                            return;
                    }
                    catch (e) { }
                }

                m_sReqMode = "APPROVE";
                if (evaluateForm()) {
                    document.getElementsByName("ACTIONINDEX")[0].value = "approve";
                    iHeight = 340; iWidth = 500; sUrl = "../ApvProcess/ApvActBasic.aspx";
                }
                break;
            case "btReject": //반려
            	m_sReqMode = "APPROVE";
                //[2014-03-04] PSW 협조프로세스에서 반송 알림창 확인
                //if (gProcessKind = "Cooperate" && getInfo("scRJTODept") == "1") {
				//[2014-03-31] PSW 수정
				  if (gProcessKind = "Cooperate" && getInfo("scRJTODept") == "1" && getInfo("mode")=="RECAPPROVAL") {
                    if (!confirm("부서간 반송입니다. 반송하시겠습니까?")) {
                        break;
                    }
                }
				//반려
                if (evaluateForm()) {
                    document.getElementsByName("ACTIONINDEX")[0].value = "reject";
                    iHeight = 290; iWidth = 500; sUrl = "../ApvProcess/ApvActBasic.aspx";
                }
                break;
            case "btHold": //보류	
                m_sReqMode = "APPROVE";
                if(evaluateForm()){
                  document.getElementsByName("ACTIONINDEX")[0].value = "reserve";
                  iHeight = 290; iWidth = 500;sUrl="../ApvProcess/ApvActBasic.aspx";
                }
	            break;
            case "btRejectedto": //지정반송
                m_sReqMode = "APPROVE";
                  //지정반송가능여부 체크	if (fn_checkrejectedtoA())
                if(evaluateForm()){
                  document.getElementsByName("ACTIONINDEX")[0].value = "rejectedto";
                  iHeight = 230; iWidth = 600;sUrl="../ApvProcess/ApvActBasic.aspx";
                }
	            break;	
	        case "btRejectedtoDept": //부서 내 반송(수신함으로)
                m_sReqMode = "APPROVE";
                if(evaluateForm()){
                    document.getElementsByName("ACTIONINDEX")[0].value = "rejectedtodept";
                  iHeight = 230; iWidth = 600;sUrl="../ApvProcess/ApvActBasic.aspx";
                }
	            break;	
            case "btComment": //의견
                var sKind="";
                if(getInfo("mode")=="DRAFT" || getInfo("mode")=="TEMPSAVE"){
                    sKind="initiator";
                }else if(
                            (getInfo("mode")=="APPROVAL" || 
                            getInfo("mode")=="PCONSULT" || 
                            getInfo("mode")=="SUBAPPROVAL" || 
                            getInfo("mode")=="RECAPPROVAL" || 
                            getInfo("mode")=="REDRAFT")  && 
                            (getInfo("loct")=="APPROVAL" )
                        ) 
                {
                    m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>"+document.getElementsByName("APVLIST")[0].value);
                    var elmRoot = m_evalXML.documentElement;
                    var elmList = elmRoot.selectNodes("division/step/ou/person[taskinfo[(../../taskinfo[@kind='consent']) or @kind!='charge']]");
                    var oPendingSteps = elmRoot.selectNodes("division/step[.//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='pending' or .//taskinfo/@status='reserved')]");
                    var oinActiveSteps = elmRoot.selectNodes("division/step[@routetype!='receive' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass' and .//taskinfo/@kind!='skip'  and .//taskinfo/@status='inactive']");

                    if(( oPendingSteps.length == 1 ) && (oinActiveSteps.length == 0)){
                        sKind = "lastapprove";
                    }
                    else
                    {
                        sKind="approve";
                    }
                    if(getInfo("mode") == "REDRAFT"){
                        sKind="initiator";
                    }
                    
                }else if(getInfo("pfsk")=="T009"){
                    sKind="agreed";
                }else if(getInfo("pfsk")=="T015"){
                    sKind="receive";
                }else if(getInfo("mode")=="COMPLETE"){
                    sKind="lastapprove";
                }
                iHeight = 260; iWidth = 600;
                //추가 의견 안내 메일 발송으로 인한 수정 2006.09 sunny
	            sUrl="../Comment/comment_add.aspx?piid="+getInfo("piid")+"&form_inst_id=" + getInfo("fiid") + "&user_id=" + getInfo("usid") + "&kind=" + sKind + "&mode=" + getInfo("mode") + "&user_name=" + toUTF8(getInfo("usdn")); 				
	            break;
            case "btCommentView":
                iHeight = 444; iWidth = 450;
	            var sUrl2="../Comment/comment_view.aspx?piid="+getInfo("piid")+"&form_inst_id=" + getInfo("fiid");
	            //feedback추가2010.12
	            if(getInfo("feedback") == "1"){
	                sUrl2 +="&feedback=" + getInfo("feedback");
	            }
	            var strNewFearture = ModifyWindowFeature("toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=" + iWidth + ",height=" + iHeight);
	            window.open(sUrl2,"",strNewFearture);
	            //window.open(sUrl2,"","toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=" + iWidth + ",height=" + iHeight)
	            break;
            case "btCirculate_View":
                iHeight = 396; iWidth = 500;
	            var sUrl2="../Circulation/Circulation_Read_View.aspx?form_inst_id=" + getInfo("fiid");
	            var strNewFearture = ModifyWindowFeature("toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=" + iWidth + ",height=" + iHeight);
	            window.open(sUrl2,"",strNewFearture);
	            //window.open(sUrl2,"","toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=" + iWidth + ",height=" + iHeight)
	            break;			
            case "btBypass":			    
                m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>"+document.getElementsByName("APVLIST")[0].value);
                var elmRoot = m_evalXML.documentElement;
                var elmPerson = elmRoot.selectSingleNode("division/step/ou/person[taskinfo/@status='pending' and taskinfo/@result='pending']");
                if(elmPerson != null){
                    m_wfid = elmPerson.getAttribute("code");
                    requestProcess("BYPASS");
                }
                break;
                case "btArchives":
                    m_oFormEditor.Archives();
                break;
                case "btPcSave": //PC저장
                    PcSave();
                break;		
            case "btExt": //확장기능 - 개별 양식에서 확장 기능 사용 시 
                try{m_oFormEditor.LegacyProcess();}catch(e){}
                break;
            case "btAdminAbort"://관리자 강제기안취소200808
			    requestProcess("WITHDRAW");	
			    break;
            case "btPcSave"://PC저장200807
                PcSave();break; 
            case "btAPVLINEModify" ://결재선변경200808//changeApvList();
			    iHeight = 530; iWidth = 920;
			    sUrl="../ApvlineMgr/ApvlineMgr.aspx?admintype=ADMIN";
                break;  
            case "btChgApv"://결재선변경내역 저장200808
                changeApvList();break;             
            case "btDeleteDoc" ://문서삭제200808
			    requestProcess("DELETEDOC");	
                break;              
            case "btForcedConsent" : //강제합의200808
                forcedConsent();
                break;
            case "btCSR":	 //우리투자증권 CSR요청서 검토의견입력 버튼 : 2008.09.26 백승찬 대리
                m_oFormEditor.document.getElementById("bodycontext_review").style.display="";
				break;
			case "btDCooRemove": //합의부서 삭제 200811
			    iHeight = 376; iWidth = 500; sSize = "noresize"; 
	            var szFont = "FONT-FAMILY: '굴림';font-size:9px;";
                var sFeature = szFont+"dialogHeight:"+iHeight+"px;dialogWidth:"+iWidth+"px;status:no;resizable:no;help:no;";
                var strNewFearture = ModifyDialogFeature(sFeature);
	            var rgParams=null;
	            rgParams=new Array();
	            rgParams["APVLIST"] = document.getElementsByName("APVLIST")[0].value;
	            rgParams["objMessage"] = window;
                
                vRetval = window.showModelessDialog("../ApvProcess/selectOUs.aspx", rgParams, strNewFearture);			    
			    break;
			case "btForcedConsent" : //강제합의200808
                forcedConsent();
                break;
			case "btOTransPV":
			    //다음다이렉트 특수기능 작성창에서 출력 --> 일반출력으로 변경
                try{m_oFormEditor.document.getElementById("tbCommentView").style.display= "";}catch(e){}
                
                m_CmtBln = false;
                m_oFormEditor.bPresenceView = false;
                m_oFormEditor.displayApvList(m_evalXML); 
                m_oFormEditor.document.getElementById("AppLine").parentElement.parentElement.style.display="none";
                m_oFormEditor.document.getElementById("tdforminfo").parentElement.parentElement.style.display="none";
                printDiv = m_oFormEditor.document.getElementById("bodytable").innerHTML;iWidth=100;iHeight=100;	
                
                if(gPrintType == "0"){
                  sUrl = "Print.htm";
                }else if(gPrintType == "1"){
                    m_oFormReader.print_part('editor');
                }
                m_CmtBln = true;
                m_oFormEditor.bPresenceView = true;
                m_oFormEditor.displayApvList(m_evalXML); 			    
                m_oFormEditor.document.getElementById("AppLine").parentElement.parentElement.style.display="";
                m_oFormEditor.document.getElementById("tdforminfo").parentElement.parentElement.style.display="";
			    break;
			case "btOTransMail":
			    //다음다이렉트 특수기능 대외공문 완료시 메일 발송 --> 일반메일 보내기로 변경 대외공문 포맷으로 변경작업 필요
			    //try{m_oFormEditor.sendMail();}catch(e){}
			    m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>" +document.getElementsByName("APVLIST")[0].value)
			    m_oFormEditor.bFileView = false;
			    m_oFormEditor.bPresenceView = false;
			    m_oFormEditor.sCommentHtml="";
	            m_oFormEditor.bCommentViewFirst=true;
                m_oFormEditor.displayApvList(m_evalXML);
                //첨부파일 경로 넣어주기 Igate 양식 첨부파일 display 살리기
                var beforeStyle="";
		        var eTR = m_oFormEditor.document.getElementById("DocLinkInfo").parentElement;
                while(eTR.tagName != "TABLE"){
	                eTR = eTR.parentElement;
                }
                
                m_oFormEditor.G_displaySpnAttInfo_Mail();
                m_oFormEditor.G_displaySpnDocLinkInfo_Mail();
                var beforeStyle = eTR.style.display;
                eTR.style.display = "none";
                m_oFormEditor.document.getElementById("AppLine").parentElement.parentElement.style.display="none";
                m_oFormEditor.document.getElementById("tdforminfo").parentElement.parentElement.style.display="none";
                //sMailBody = "<style type=\"text/css\">p {font-size:12px; font-family:gulim,arial; margin:0pt;}</style>";
                sMailBody = "<style>";
                try {for (var i = 0; i < parent.editor.document.styleSheets.length; i++) {sMailBody += getStyle(parent.editor.document.styleSheets[i].href);}} catch (e) { }
                sMailBody += "</style>";                
                sMailBody += "<P>&nbsp;</P><P>&nbsp;</P><BR/>"+m_oFormEditor.document.getElementById("bodytable").innerHTML;         
                eTR.style.display = beforeStyle;
   				m_oFormEditor.bPresenceView = false;//true;
   				m_oFormEditor.bFileView = true;
   				m_oFormEditor.sCommentHtml="";
                m_oFormEditor.bCommentViewFirst=true;
                m_oFormEditor.displayApvList(m_evalXML);
                m_oFormEditor.G_displaySpnAttInfo(false);
                m_oFormEditor.G_displaySpnDocLinkInfo();
                m_oFormEditor.document.getElementById("AppLine").parentElement.parentElement.style.display="";
                m_oFormEditor.document.getElementById("tdforminfo").parentElement.parentElement.style.display="";
				sendMail();			    
			    break;
			case "btMailSend":
			    m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>" +document.getElementsByName("APVLIST")[0].value)
			    m_oFormEditor.bFileView = false;
			    m_oFormEditor.bPresenceView = false;
			    m_oFormEditor.sCommentHtml="";
	            m_oFormEditor.bCommentViewFirst=true;
                m_oFormEditor.displayApvList(m_evalXML);
                //첨부파일 경로 넣어주기 Igate 양식 첨부파일 display 살리기
                var beforeStyle="";
		        var eTR = m_oFormEditor.document.getElementById("DocLinkInfo").parentElement;
                while(eTR.tagName != "TABLE"){
	                eTR = eTR.parentElement;
                }
                
                m_oFormEditor.G_displaySpnAttInfo_Mail();
                m_oFormEditor.G_displaySpnDocLinkInfo_Mail();
                var beforeStyle = eTR.style.display;
                eTR.style.display = "";
                //sMailBody = "<style type=\"text/css\">p {font-size:12px; font-family:gulim,arial; margin:0pt;}</style>";
                sMailBody = "<style>";
                try {for (var i = 0; i < parent.editor.document.styleSheets.length; i++) {sMailBody += getStyle(parent.editor.document.styleSheets[i].href);}} catch (e) { }
                sMailBody += "</style>";                
                sMailBody += "<P>&nbsp;</P><P>&nbsp;</P><BR/><div style='width:740px'>"+m_oFormEditor.document.getElementById("bodytable").innerHTML + "</div>";         
                eTR.style.display = beforeStyle;
   				m_oFormEditor.bPresenceView = false;//true;
   				m_oFormEditor.bFileView = true;
   				m_oFormEditor.sCommentHtml="";
                m_oFormEditor.bCommentViewFirst=true;
                m_oFormEditor.displayApvList(m_evalXML);
                m_oFormEditor.G_displaySpnAttInfo(false);
                m_oFormEditor.G_displaySpnDocLinkInfo();
				sendMail();
			    break;
			case "btUrl": //URL 넣기
			    var sLINKUrl = parent.window.location.href;
		        var bReturn = false;
		        window.clipboardData.clearData("Text");
		        bReturn = window.clipboardData.setData("Text", sLINKUrl);
        		
		        if(true==bReturn)
		        {
			        alert(gMessage289);//"문서URL이 클립보드에 복사되었습니다."
		        }
			    break;
            //추가 의견 안내 메일 발송으로 인한 수정 2006.09 sunny
            case "btCommentFeedback": //Feedback의견
                var sKind="feedback";

                iHeight = 260; iWidth = 600;
	            sUrl="../Comment/comment_feedback.aspx?piid="+getInfo("piid")+"&form_inst_id=" + getInfo("fiid") + "&user_id=" + getInfo("usid") + "&kind=" + sKind + "&mode=" + getInfo("mode") + "&user_name=" + toUTF8(getInfo("usdn"));
	            break;
		}
		
		if(sUrl!=null){		   
		    wgSaveTmp = openWindow(sUrl,"",iWidth,iHeight,sSize);
		}
		
	}catch(e){alert(e.description);}
}
function CoviWindow(fileName,windowName,theWidth,theHeight,etcParam) {
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

	if(windowName == "newMessageWindow")
	{
		windowName = new String(Math.round(Math.random() * 100000));
	}

	var strNewFearture = ModifyWindowFeature(etcParam + ",width=" + x + ",height=" + y + sz);
    window.open(fileName,windowName,strNewFearture);
    //window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}
function insertDicFileInfo(fileName){
	m_oFormEditor.insertDicFileInfo(fileName);
}
//DEXTUploadX
function setAttachInfo(AttFileInfo, AttFiles){	
	if(m_oFormEditor.document.getElementsByName("attach")[0].value == ""){
		m_oFormEditor.document.getElementById("AttFileInfo").innerHTML = AttFileInfo;
		m_oFormEditor.document.getElementsByName("attach")[0].value = AttFiles; //attach에서 변경
		m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value = AttFiles; //attach에서 변경            
	}else{
		var aAttFileInfo = m_oFormEditor.document.getElementById("AttFileInfo").innerHTML.split("|");
		var aAttach = m_oFormEditor.document.getElementsByName("attach")[0].value.split("^^^");
		var aAttFile = m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value.split("^^^");

		aAttFileInfo[m_ibIdx] = AttFileInfo;
		aAttach[m_ibIdx] = AttFiles;
		aAttFile[m_ibIdx] = AttFiles;

		var sAttFileInfo = "";
		var sAttach = "";
		var sAttFile = "";
		
		for(var i=0; i < aAttach.length; i++){
			sAttFileInfo += "|" + aAttFileInfo[i];
			sAttach += "^^^" + aAttach[i];
			sAttFile += "^^^" + aAttFile[i];
		}
		if(sAttFileInfo.length > 1) sAttFileInfo = sAttFileInfo.substring(1);
		if(sAttach.length > 1) sAttach = sAttach.substring(3);
		if(sAttFile.length > 1) sAttFile = sAttFile.substring(3);

		m_oFormEditor.document.getElementById("AttFileInfo").innerHTML = sAttFileInfo;
		m_oFormEditor.document.getElementsByName("attach")[0].value = sAttach; //attach에서 변경
		m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value = sAttFile; //attach에서 변경
	}	
	m_oFormEditor.G_displaySpnAttInfo(false);	
}
//CoviFileTrans
function setAttachInfo2(AttFileInfo, AttFiles){	
	if(m_oFormEditor.document.getElementsByName("attach")[0].value == ""){
		m_oFormEditor.document.getElementsByName("attach")[0].value =AttFileInfo;
		m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value=AttFileInfo;
		m_oFormEditor.document.getElementById("AttFileInfo").innerHTML += AttFiles;
		m_oFormEditor.G_displaySpnAttInfo2(false);	
	}else{		
		m_oFormEditor.document.getElementById("AttFileInfo").innerHTML+=AttFiles;
		m_oFormEditor.document.getElementsByName("attach")[0].value =AttFileInfo;
		m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value=AttFileInfo;
		m_oFormEditor.G_displaySpnAttInfo2(false);
	}	
}

function attFile()
{//DEXTUploadX
  var aAttFile = m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value.split("^^^");
	var sAttFile = aAttFile[m_ibIdx];	
	var attach =  (sAttFile != null)?sAttFile.replace("%","%25").replace("&","%26").replace("#","%23").replace("+","%2B"):"";
	makeDictionary(m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value);	
        
	var szPath = "../FileAttach/fileuploadX.aspx";
	var rgParams=null;
	rgParams=new Array();
	rgParams["objMessage"] = window;
        
	var szFont = "FONT-FAMILY: 'gulim';font-size:9px;";
	var nWidth = 400;
	var nHeight = 300;
	
	openWindow(szPath,"fileattach",390,250, "fix"); //2007.03.29
}

function attFile2() {//CoviFileTrans
    //debugger;
    var strphygicalName="";
    var strlocation="";
    var strINIListFiles="";

    //ATTACH_FILE_INFO에서 업로드 파일 정보를 가져온다
    var strURL ="";
    
    if ( m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value != ""){	
		var r, res;
		var s =m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value;
		
		res = /^^^/i;
		attFiles = s.replace(res, "");
		
		var m_oFileList = CreateXmlDocument();
		m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+attFiles);
		var elmRoot, elmList, elm, elmTaskInfo;
		
		var elmListLoc,elmLoc;
		elmRoot = m_oFileList.documentElement;
		
		if (elmRoot != null){
		    
			elmList = elmRoot.selectNodes("//file");		
			elmListLoc	= elmRoot.selectNodes("//file");		
			szAttFileInfo = "";
			
			elmTaskInfo=elmListLoc.nextNode();
			
			
			//substring(elm.getAttribute("location").lastIndexOf("/")+1, elm.getAttribute("location").length)
			for (var i=0; i<elmList.length;i++) 
			{
			    strlocation = elmTaskInfo.getAttribute("location");
			    strlocation=strlocation.substring(0,strlocation.lastIndexOf("/")+1);
			    
                elm = elmList.nextNode();
				strINIListFiles = strINIListFiles + elm.getAttribute("location").substring(elm.getAttribute("location").lastIndexOf("/")+1, elm.getAttribute("location").length)+":"+elm.getAttribute("size") +":"+elm.getAttribute("user_name") +":"+elm.getAttribute("dept_name") +";" ;
				//strlocation = elm.getAttribute("location").substring(0, elm.getAttribute("location").lastIndexOf("/")+1);
			}
			
		}
	}

	if(gFileAttachType=="2")
	{
		strURL="../FileAttach/fileuploadCovi.aspx";
        //document.attachfile_form.action="../FileAttach/fileuploadCovi.aspx"; 
        document.getElementById("hidINIListFiles").value = strINIListFiles; 
        document.getElementById("hidlocation").value = strlocation; 		
	}
	else
	{
		strURL="../FileAttach/fileupload.aspx";
        document.attachfile_form.action="../FileAttach/fileupload.aspx"; 
        document.getElementById("hidINIListFiles").value = strINIListFiles; 
        document.getElementById("hidlocation").value = strlocation; 		
	}
	 
	strURL=strURL+"?INIListFiles="+escape(strINIListFiles);
	strURL=strURL+"&FileLoc="+escape(strlocation);	
	
	//파일 첨부 관련 추가 수정 부분
	//2006.12.05 by wolf upload UI 변경
	//iFrame으로 띄움
	
	if(gFileAttachType=="2")
	{
		openWindow(strURL,"fileattach",540,270, "fix");
	}
	else if(gFileAttachType=="3")
	{
		fnCoviSlvTransTmp(strINIListFiles);
	}
	else if(gFileAttachType=="4")
	{
		fnSlvTransIfIe(strURL, strINIListFiles);
	}
	else
	{
		frAttachFiles.location = strURL;//fnCoviSlvTransTmp(strINIListFiles)
        //document.attachfile_form.target ="frAttachFiles"; 
       //document.attachfile_form.submit(); 		
	}
}

function fnSlvTransIfIe(strURL, strINIListFiles)
{
	try
	{
        if (window.ActiveXObject)
		{//이민지(2010-05-28): IE 인 경우에는 CoviUpload 실행
		    //frAttachFiles.location = strURL;
		    document.attachfile_form.target = "frAttachFiles";
            //document.attachfile_form.target = "_blank";
		    document.attachfile_form.submit();
		}
		else
		{//이민지(2010-05-28): 다른 브라우저인 경우에는 CoviSilverlightTrans 실행
			fnCoviSlvTransTmp(strINIListFiles);
		}
	}
	catch(e)
	{
	}
}

function fnCoviSlvTransTmp(strINIListFiles)
{//이민지(2010-04-14): CoviSilverlightTrans용 영역을 처리하는 함수를 추가함.
	
	var nav = null;
	var AgControl = null;
	var version = "3.0.50106.0"; // The Silverlight version to test for
	try
	{
		nav = navigator.plugins["Silverlight Plug-In"];
		AgControl = new ActiveXObject("AgControl.AgControl");
	}
	catch(e)
	{
	}
	if(nav == null && AgControl == null)
	{
	    var sHtmS = 'DIV';
		var oDocS = top.frames[1].document;
		oDvS = oDocS.createElement(sHtmS);
		var oTmpS = oDocS.body.children[0];
		oDocS.body.insertBefore(oDvS, oTmpS);
		sHtmS = 'z-Index: 9999;';
		oDvS.style.cssText = sHtmS;
		sHtmS = '<object style="z-index:9999;"><a href="http://go.microsoft.com/fwlink/?LinkID=124807" style="text-decoration:none;"><img src="http://go.microsoft.com/fwlink/?LinkId=108181" alt="Get Microsoft Silverlight" style="border-style:none"></a></object>';
		oDvS.innerHTML = sHtmS;
		alert("Silverlight 로고를 클릭하여 플러그인을 먼저 설치한 후 재시도 해 주십시오.");
	}
	else
	{
		var sHtm = '';
		var oDv = null, oDoc = null, oTmp = null, sINIListFiles = '', iFrameWidth = '', sleft = '', iFrameHeight = '', stop = '', sSrc = '';
		var sHtm0 = '';	
		var oDv0 = null, oDoc0 = null, oTmp0 = null, iFrameWidth0 = '', iFrameHeight0 = '';
		sSrc = '/COVIWeb/Approval/FileAttach/fileupload4Slv.aspx?mod=SlvTrans&INIListFiles=' + strINIListFiles + '&"';//alert(strINIListFiles);
		sgINIListFiles = strINIListFiles;//이민지(2011.01.10) :기존 파일의 쿼리스트링 전송으로 인해 인코딩 문제가 발생 - 수정위해 추가
		oDv = document.getElementById('dvSilverlightTransWrap');
		if(oDv != null)
		{//이미 레이어가 만들어져 있으면
			oDv.src = '';//해당 레이어를 재사용하고
			return;//함수를 탈출함.
		}

		iFrameWidth0 = this.document.body.scrollWidth - 38;
		iFrameHeight0 = this.parent.document.body.scrollHeight;
		oDoc0 = top.frames[1].document;
		sHtm0 = 'DIV';
		oDv0 = oDoc0.createElement(sHtm0);
		oTmp0 = oDoc0.body.children[0];
		oDoc0.body.insertBefore(oDv0, oTmp0);
		sHtm0 = 'position: absolute; left: 0px; top:0px; margin: 0px; padding: 0px; width:'+iFrameWidth0+'; height: '+iFrameHeight0+'; z-Index: 998; backgroundColor:#FFFFFF;  filter:alpha(opacity=1);';
		oDv0.style.cssText = sHtm0;
		sHtm0 = '<iframe frameborder="0" noframe src="/COVIWeb/Approval/FileAttach/ApprovalSlvTrans.htm" width="' + iFrameWidth0 + 'px" height="' + iFrameHeight0 + 'px" onclick="javascript:fnCOPMSlvWarn();" style="border: none; margin: 0px; padding: 0px; width: ' + iFrameWidth0 + '; height: ' + iFrameHeight0 + 'px;"></iframe>';
		oDv0.id = 'dvSilverlightTransWrapWrap';
		oDv0.innerHTML = sHtm0;
		
		iFrameWidth = this.document.body.offsetWidth;
		iFrameHeight = this.parent.document.body.scrollHeight;
		sleft = (iFrameWidth-568)/2;
		stop = (iFrameHeight-344)/2;
		oDoc = top.frames[1].document;
		sHtm = 'DIV';
		oDv = oDoc.createElement(sHtm);
		oTmp = oDoc.body.children[0];
		oDoc.body.insertBefore(oDv, oTmp);
		//sHtm = 'position: absolute; left:'+sleft+'; top:' + stop + '; margin: 0px; padding: 0px; width: 790px; height: 500px; z-Index: 999;';
		sHtm = 'position: absolute; left:'+sleft+'; top:' + stop + '; margin: 0px; padding: 0px; width: 583px; height: 353px; z-Index: 999;';
		oDv.style.cssText = sHtm;
		sINIListFiles = escape(strINIListFiles);
		sHtm = '<iframe frameborder="0" noframe src="' + sSrc + '" allowTransparency="true" style="border: none; margin: 0px; padding: 0px; width: 100%; height: 100%;"></iframe>';
		oDv.id = 'dvSilverlightTransWrap'
		oDv.innerHTML = sHtm;//alert(sHtm);
	}
}

function attFile3(){
   var aAttFile = m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value.split("^^^");
	var sAttFile = aAttFile[m_ibIdx];	
	var attach =  (sAttFile != null)?sAttFile.replace("%","%25").replace("&","%26").replace("#","%23").replace("+","%2B"):"";
	makeDictionary(m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value);	
        
	var szPath = "../FileAttach/fileupload4Net.aspx";
	var rgParams=null;
	rgParams=new Array();
	rgParams["objMessage"] = window;
        
	var szFont = "FONT-FAMILY: 'gulim';font-size:9px;";
	var nWidth = 400;
	var nHeight = 300;
	
	openWindow(szPath,"fileattach",390,250, "fix"); //2007.03.29
}
function setAttInfo(){
	var AttFileInfo = getListVal(""); //눈에 보이는 값	
	var AttFiles = getListXML("");  //xml 	
	setAttachInfo(AttFileInfo, AttFiles);
	m_bFrmClientFileDitry = false;
}
function addDictionary(strKey, fileInfo, filesize, filestate, username, deptname) {
	var key = strKey;
	if(key.indexOf("attachEvent") > -1){
	}else{
	    if (dicFileInfo.Exists(key) == false) {	
	        dicFileInfo.Add(key, fileInfo); 
	        dicFileInfoSize.Add(key, filesize);
	        dicFileInfoState.Add(key, (filestate == null ? "OLD" : filestate)); 
	        dicFileInfoUserName.Add(key, username); 
	        dicFileInfoDeptName.Add(key, deptname); 
	    }
	}
}

//새로 작성
function getListVal(href){
	var aryTemp = new Array();
	var aryKey = new Array();
	var strItem = new String();
	var strListVal="";
	aryTemp = dicFileInfo.Items();
	aryKey = dicFileInfo.Keys();
    var aryTempLengh = (this.agent.msie == false) ? aryTemp.length - 2 : aryTemp.length - 1;
    //phm
    aryTempLengh = (!("ActiveXObject" in window) ? aryTemp.length - 1 : aryTemp.length - 2);
	for(i = 0;i <= aryTempLengh;i++) {
		var temp = String(aryTemp[i]).split(";");
		strItem = '<input type=\"checkbox\" id=\"chkFile\" name=\"_' + aryKey[i] + '\" value=\"' + aryKey[i] + '\">'; 		
		if(temp.length < 2)
		{		    
		    strItem += "<a href=\""+temp[0].replace("+","%2B")+ "\" target = \"_blank\" >" + aryKey[i] + "</a>";
		}
		else
		{		 
		    strItem += "<a href=\""+temp[2].replace("+","%2B")+ "\" target = \"_blank\" >" + aryKey[i] + "</a>";
		}
		strListVal = strListVal + ", " + strItem;
	}
	
	if(strListVal == null || strListVal == "")
		return "";
	else
		return strListVal.substring(1)+"&nbsp;&nbsp;&nbsp;<a href='#' onclick='parent.menu.deleteitem();'><font color='#009900'><b>"+gLabel_file_delete+"<b></font></a>";
}
function getListXML(){
	var aryTemp = new Array();
	var aryKey = new Array();
	var arrSize = new Array();
	var arrState = new Array();
	var arrUserName = new Array();
	var arrDeptName = new Array();
	
	var strItem = new String();
	var strListVal;
	strListVal = "";
	var ofileinfo= CreateXmlDocument();
	ofileinfo.loadXML("<fileinfo></fileinfo>");
	
	
	aryTemp = dicFileInfo.Items();
	aryKey = dicFileInfo.Keys();
	arrSize = dicFileInfoSize.Items();
	arrState = dicFileInfoState.Items();
	arrUserName = dicFileInfoUserName.Items();
	arrDeptName = dicFileInfoDeptName.Items();

	for(i = 0;i <= aryTemp.length-1;i++) {	    
	    var strtemp = aryTemp[i]; //.replace(/'/g,"&apos;");
	    if( aryKey[i] != "attachEvent"){	    
	        strListVal += "<file name='" + aryKey[i] + "'" + " location='" + strtemp + "' size='" + arrSize[i] + "' state='" + arrState[i] + "'></file>";
    		
		    var ofile = ofileinfo.createElement("file");

		    ofile.setAttribute("name", aryKey[i]);
		    //ofile.setAttribute("storageid", temp[0]);
		    //ofile.setAttribute("id", temp[1]);
		    ofile.setAttribute("location", strtemp);
		    ofile.setAttribute("size",arrSize[i]);		
		    if(arrState[i] != null){
		        ofile.setAttribute("state",arrState[i]);
		    }else{
		        ofile.setAttribute("state","OLD");
		    }
		    ofile.setAttribute("user_name",arrUserName[i]);
		    ofile.setAttribute("dept_name",arrDeptName[i]);
    		
		    ofileinfo.documentElement.appendChild(ofile);
		}
	}
	if (strListVal == null || strListVal == "") {
	    return "";
	} else {
	    if (m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value.indexOf("</fileinfos>") < 0) {
	        return (!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(ofileinfo) :ofileinfo.xml;
	    } else {
	        return "<fileinfos>" + ((!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(ofileinfo) :ofileinfo.xml) + "</fileinfos>";
	    }
	}    
}
function fileDelete(deleteFiles)
{
	var frame="<IFRAME ID='ifrDL' FRAMEBORDER=0 style='HEIGHT:0%;WIDTH:100%' SRC='../FileAttach/filedelete.aspx?deleteFiles="+toUTF8(deleteFiles)+"'  scrolling='no'></IFRAME>";	
	document.getElementById("dellink").innerHTML=frame;
	document.getElementById("dellink").style.display="none";	
	return true;
}
function deleteitem(){
	var deletemark = DeleteMarked();	
	var aryTemp = new Array();
	var aryKey = new Array();
	var position, delKey, delItem;	
	
	if(deletemark != ""){
		aryKey = dicFileInfo.Keys();
		aryTemp = dicFileInfo.Items();
		try{
			delKey = ""; delItem = "";
			for(var i=aryKey.length-1;i>-1;i--){
				position = deletemark.indexOf(aryKey[i]);
				if(position >= 0) {
					delKey = delKey + aryKey[i] +"|";
					delItem = delItem + aryTemp[i] +"|";
				}
			}
			deleteDictionary();
		}catch(e){
			alert(e.description);
		}
	}
}	
function DeleteMarked(){  
	var tmp="" ;
	var elementName="" ;
	if(m_oFormEditor.document.getElementsByName("chkFile").length == null){
		if(m_oFormEditor.document.getElementsByName("chkFile")[0].checked){
			tmp =  m_oFormEditor.document.getElementsByName("chkFile")[0].value ;
		}
	}else{
		for (var j=m_oFormEditor.document.getElementsByName("chkFile").length -1 ; j>=0 ; j--){
		if(m_oFormEditor.document.getElementsByName("chkFile")[j].checked){ 
				tmp = tmp + "|" + m_oFormEditor.document.getElementsByName("chkFile")[j].value ;
			}
		}
	}
	return tmp;
}

function deleteDictionary() {
//debugger
	var deletemark = DeleteMarked();	
	var aryTemp = new Array() ;
	var aryKey = new Array() ;
	var position ;
	var deleteFiles=""
	if (deletemark != "") {
		aryKey = dicFileInfo.Keys();
		aryTemp = dicFileInfo.Items();	
		try{
			for(var i=aryKey.length-1;i>-1;i--){
			    if(aryKey[i] != "attachEvent"){
				    position = deletemark.indexOf(aryKey[i]) ;
				    var temp = aryTemp[i].split(";");
				    if (position >= 0) {
					    dicFileInfo.Remove(aryKey[i]) ;
					    dicFileInfoSize.Remove(aryKey[i]) ;
					    dicFileInfoState.Remove(aryKey[i]) ;
					    dicFileInfoUserName.Remove(aryKey[i]) ;
					    dicFileInfoDeptName.Remove(aryKey[i]) ;
					    deleteFiles += aryTemp[i]+";";		
				    }
				}	
			}
			fileDelete(deleteFiles);
		}catch(e){
			alert( e.description);
		}
	}
	//refreshList();
	setAttInfo();
}
function fileHref(name){return name.replace("%","%25").replace("&","%26").replace("#","%23").replace("+","%2B")}
//2005.07 XfileUpload 관련 추가 끝

//결재선변경
function changeApvList(){
	try{
		requestProcess("CHANGEAPV");
	}catch(e){
		alert("Error number: " + e.number);
	}
}
//강제합의
function forcedConsent(){
	try{
		requestProcess("FORCEDCONSENT");
	}catch(e){
		alert("Error number: " + e.number);
	}
}
function changeFormdata(){//debugger;
	var szText;
	var szmode = getInfo("mode");
	try{
	    m_bFileSave = true;
		m_oFormEditor.beginProgress(gMessage67, gMessage67);
		if(m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value !=''){//첨부파일 존재시 수행
			m_bFileSave = false;
			if(m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value.indexOf("</fileinfos>") < 0)
			{
			    try{
				    var sFiles = "<request><fileinfos>"+m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value+"</fileinfos></request>";
				    evalXML(sFiles);
				    var sURL = "/CoviWeb/approval/FileAttach/fnMoveFilegetFileInfo.aspx";
				    receiveFileHTTP("POST",sURL,sFiles);
			    }catch(e){
				    disableBtns(false);
			    }
			}else{
			    m_bFileSave = true;
			}
		}						
		setInfo("mode",szmode);
		
		if(m_bFileSave == true){					
            //szText = "<request>" + getDefaultXML() + m_oFormEditor.getChangeFormXML() + "</request>"; //2003.04.21 수정 변경된 사항만 넘김
            szText = "<request>" + m_oFormEditor.getChangeFormXML() + makeNode("admintype", parent.admintype)  + getDefaultXML() + "</request>"; //2003.04.21 수정 변경된 사항만 넘김
            evalXML(szText);		
            requestHTTP("POST","dosavebody.aspx",true,"text/xml",receiveHTTP,szText);
		}else{
			disableBtns(false);
			alert(gMessage203); //'첨부파일이 정상적으로 처리되지 않았습니다.'
		}
		
	}catch(e){
		if(m_bTabForm){//탭문서 보기 OPEN
				m_oFormEditor.endProgress('parent.parent.closeFormbyForm();');
		}else{m_oFormEditor.endProgress('top.close()');}
		alert(gMessage73+e.description + "\r\nError number: " + e.number); //"저장하지 못했습니다."
	}
}
function makeXMLNode(sName,vVal,bCData) {
	return "<"+sName+">"+(bCData?"<![CDATA[":"")+vVal+(bCData?"]]>":"")+"</"+sName+">";
}
function makeNode(sName,vVal,sKey,bCData) {
    if(!this.agent.msie){
	    if(vVal==null){	m_cvtXML.textContent= getInfo((sKey!=null?sKey:sName));}else{	m_cvtXML.textContent = vVal;}	
    }else {
    	if(vVal==null){	m_cvtXML.text= getInfo((sKey!=null?sKey:sName));}else{	m_cvtXML.text = vVal;}	
    }
	return "<"+sName+">"+(bCData?"<![CDATA[":"")+(bCData?m_cvtXML.text+"]]>": m_cvtXML.xml)+"</"+sName+">";
}
function HtmlEncode(text){
    return text.replace(/&/g, '&amp').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function addList(sMode){
	var rgParams=null;
	rgParams=new Array();
	rgParams["bMail"]  = false;
	rgParams["bUser"] = (sMode=='charge'?true:false);
	rgParams["bGroup"] = (sMode=='charge'?false:true);
	rgParams["bRef"] = false;
	rgParams["bIns"] = false; 
	rgParams["bRecp"] = false;	
	rgParams["sCatSignType"] = gLabel__recieve_apv; //"수신결재"
	rgParams["sDeptSignType"] = gLabel_approve;			//"일반결재"
	rgParams["sDeptSignStatus"] = gLabel_receive;   //"수신"
	rgParams["sUserSignType"] = gLabel_approve;			//"일반결재"
	rgParams["sUserSignStatus"] = gLabel_inactive;  //"대기"
	rgParams["objMessage"] = window;

	if(sMode == 'receive'){
		var aRecDept = RecDeptList.value.split("@");
		var sRecDept = aRecDept[iBody.selectedIndex];
		if(sRecDept != null){
			if(sRecDept.length>15) rgParams["sGroup"] = sRecDept.substring(7,sRecDept.length-8);
		}
	}
	var szFont = "FONT-FAMILY: '굴림';font-size:9px;";
    var nWidth = 640;
    var nHeight = 610;
    var sFeature = szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;help:no;";
    var strNewFearture = ModifyDialogFeature(sFeature);
    //var vRetval = window.showModelessDialog("/COVIWeb/approval/address/address.aspx", rgParams, strNewFearture);
    var vRetval = window.showModalDialog("/COVIWeb/approval/address/address.aspx", rgParams, strNewFearture);
    //var vRetval = window.showModelessDialog("../address/address.aspx", rgParams, szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;help:no;");

}
function insertToList(oList){
	if(m_sAddList == 'receive'){
		var aRecDept = document.getElementById("RecDeptList").value.split("@");
		aRecDept[document.getElementById("iBody").selectedIndex] = (!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(oList) :oList.xml;
		var sRecDept = "";
		for(var i=0 ; i< aRecDept.length ; i++){sRecDept+='@' + aRecDept[i];}
		if(sRecDept.length > 1) sRecDept = sRecDept.substring(1);
		document.getElementById("RecDeptList").value = sRecDept;
		m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value = document.getElementById("RecDeptList").value;
		var m_oRecList = CreateXmlDocument();
		m_oRecList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+aRecDept[document.getElementById("iBody").selectedIndex]);
		m_oFormEditor.setInlineRecList(m_oRecList);

		m_oFormEditor.document.getElementsByName("RECEIPT_LIST").value = m_oFormEditor.DeCodeRecList(document.getElementById("RecDeptList").value);
		m_bFrmExtDirty = true;
	}else if(m_sAddList == 'charge' ||m_sAddList == 'chargegroup') {
		var m_oChargeList = CreateXmlDocument();
        m_oChargeList.loadXML(oList.xml);		
        var elmRoot = m_oChargeList.documentElement;
		var elmlist = elmRoot.selectNodes("item");
		if(elmlist.length == 0){
			alert(gMessage54); //'담당자를 지정하십시요.'
			return false;
		}else if(elmlist.length > 1){
			alert(gMessage55); //"담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요."
			return false;
		}else{
			try{document.getElementsByName("CHARGEID")[0].value  = elmRoot.selectSingleNode("item/AN").text;}catch(e){}
			try{document.getElementsByName("CHARGENAME")[0].value = elmRoot.selectSingleNode("item/DN").text;}catch(e){}
			setForwardApvList(elmRoot);
			requestProcess('CHARGE');
		}
	}else if(m_sAddList == 'request' ||m_sAddList == 'study'){
		var m_oRequestList = CreateXmlDocument();
		m_oRequestList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+(!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(oList) :oList.xml);
		var elmRoot = m_oRequestList.documentElement;
		var elmlist = elmRoot.selectNodes("item");
		if(elmlist.length == 0){
			alert(gMessage54); //'담당자를 지정하십시요.'
			return false;
		}else if(elmlist.length > 1){
			alert(gMessage55); //"담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요."
			return false;
		}else{m_oFormEditor.setRequestPersonInfo(elmRoot,false, m_sAddList);}
	}
}
function receiveFileHTTP(sMethod,sURL,sText){
	requestHTTP(sMethod,sURL,false,"text/xml",null,sText);
	var xmlReturn=m_xmlHTTP.responseXML;
	if(((!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(xmlReturn) : xmlReturn.xml)==""){
		throw new Error(-1,m_xmlHTTP.responseText);
	}else{
		var errorNode=xmlReturn.selectSingleNode("response/error");
		if(errorNode!=null){
			throw new Error(-1,errorNode.text);
		}else{
			switch(getInfo("mode")){
			    case "APPROVAL":
				case "DRAFT" :
				case "TEMPSAVE" :
				case "COMPLETE" :
					m_bFrmClientFileDitry = true;
					m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value = (!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(xmlReturn.selectSingleNode("response/fileinfos")) : xmlReturn.selectSingleNode("response/fileinfos").xml;
					m_bFileSave = true;
					break;
				case "RECAPPROVAL":
				case "PCONSULT":
				case "CHARGE":
				case "SUBAPPROVAL":
				case "REDRAFT":	
					m_bFrmClientFileDitry = true;
					if(xmlReturn.selectNodes("response/fileinfos").length > 0)	m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value =(!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString( xmlReturn.selectSingleNode("response/fileinfos")) :  xmlReturn.selectSingleNode("response/fileinfos").xml;
					m_bFileSave = true;
					break;
	            case "SUBREDRAFT":  //수신부서 재기안 (2013-03-04 HIW)
	                m_bFrmClientFileDitry = true;
	                if (xmlReturn.selectNodes("response/fileinfos").length > 0) m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value = (!("ActiveXObject" in window)) ? (new XMLSerializer()).serializeToString(xmlReturn.selectSingleNode("response/fileinfos")) : xmlReturn.selectSingleNode("response/fileinfos").xml;
	                m_bFileSave = true;
	                break;
				case "TRANS": setFormInfoDictionary(xmlReturn.documentElement.childNodes);
					break;
				case "SIGN":
					break;
				case "ADMINEDMS":alert(gMessage204); //"결재문서 생성이 완료되었습니다."
					if(m_bTabForm){parent.parent.closeFormbyForm();}else{top.close();}
					parent.refreshList();
					break;
				//2014-06-11 hyh 추가
	            		case "PROCESS":
	                		m_bFrmClientFileDitry = true;
			                if (xmlReturn.selectNodes("response/fileinfos").length > 0) m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value = (!("ActiveXObject" in window)) ? (new XMLSerializer()).serializeToString(xmlReturn.selectSingleNode("response/fileinfos")) : xmlReturn.selectSingleNode("response/fileinfos").xml;
		                	m_bFileSave = true;
	                		break;
	            		//2014-06-11 hyh 추가 끝
				default: 
					break;
			}
		}
	}
}
function setFormInfoDictionary(elmList){
	var elmnode;
	for(var i=0;i< elmList.length;i++){
		elmnode = elmList.nextNode();
		setInfo(elmnode.nodeName, elmnode.text);
	}
}
function getIsIssueDocNo(){
	var sRtn = "";
	switch (getInfo("mode")){
		case 'PCONSULT': 
			if((document.getElementsByName("bLASTAPPROVER")[0].value == 'true') && (getInfo("scDNumLegacy") == '1'))sRtn = "true";
			break;
		case 'APPROVAL':
			if((document.getElementsByName("bLASTAPPROVER")[0].value == 'true') && (document.getElementsByName("ACTIONINDEX")[0].value == 'approve') && (getInfo("scDNumLegacy") == '1'))	sRtn = "true";
			break;
		case 'RECAPPROVAL': 
			if((getInfo("scIPub") == "0") && ( document.getElementsByName("bLASTAPPROVER")[0].value == 'true') && (document.getElementsByName("ACTIONINDEX")[0].value == 'approve') && (getInfo("scDNumLegacy") == '1'))	sRtn = "true";
			break;
		case 'SUBAPPROVAL': 
			if((document.getElementsByName("bLASTAPPROVER")[0].value == 'true') && (getInfo("scDNumLegacy") == '1')) sRtn = "true";
			break;
		case 'REDRAFT':	//1. 부서장 접수 후 수신대장에도 보관, 신청서-담당업무확정에 대해서는 수신대장 보관하지 않음			
			if((getInfo("scIPub") == "0") && (document.getElementsByName("bLASTAPPROVER")[0].value == 'true' ) && (document.getElementsByName("ACTIONINDEX")[0].value == 'approve') && (getInfo("scDNumLegacy") == '1'))	sRtn = "true";
			break;
		case 'SUBREDRAFT': sRtn = getHasReceiveno();
			break;
		case 'DRAFT': sRtn = "true";
			break;
		default:sRtn = "false";		
	}
	return sRtn;
}
function getHasReceiveno(){
	var sRtn="false";
	//신청서-담당업무확정에 대해서는 수신대장 보관하지 않음
	if(getInfo("scChgr") == "1"){sRtn="false";}else{sRtn="true";}	
	return sRtn;
}
var szformgubun = "";

//임시저장결재선/마지막결재선 가져오기
function setDomainData(){	
	if(getInfo("mode") == "DRAFT" ||getInfo("mode") == "TEMPSAVE" || getInfo("mode") == "REDRAFT"){		
		var szURL = "setDomainData.aspx?usid="+getInfo("usid")+"&fmid="+getInfo("fmid")+"&dppathid="+getInfo("dppathid")+"&dppathdn="+toUTF8(getInfo("dppathdn"))+"&pdefid="+getInfo("pdef");		
		szURL=szURL+"&mode="+getInfo("mode")+"&scChgr="+getInfo("scChgr")+"&scChgrV="+getInfo("scChgrV")+"&bsid="+getInfo("bsid")+"&ftid="+getInfo("ftid"); // 2006.09.20 김현태 임시저장시 결재선 저장 추가 +"&ftid="+getInfo("ftid")
		szURL=szURL+"&scCDTApvLine="+getInfo("scCDTApvLine")+"&scCDTApvLineV="+getInfo("scCDTApvLineV")+"&scRCDTApvLine="+getInfo("scRCDTApvLine")+"&scRCDTApvLineV="+getInfo("scRCDTApvLineV")+"&usapprover="+getInfo("usapprover");
        szURL=szURL+"&dpid="+getInfo("dpid")  + "&fmpf=" + getInfo("fmpf"); 
        //2011.07 구분별 결재선
        szformgubun = getInfo("dppathid").split("\\")[2];
        szURL=szURL+"&scMODEApvLine="+getInfo("scMODEApvLine")+"&scMODEApvLineV="+getInfo("scid")+szformgubun;
		requestHTTP("GET",szURL,true,"text/xml",receiveApvHTTP,null);
	}else{m_bApvDirty = true;}
}
function receiveApvHTTP(){//debugger;
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			alert(m_xmlHTTP.responseText);
		}else{//debugger;
		    if(m_xmlHTTP.responseXML!= null){
			    var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			    if(errorNode!=null){
				    alert("Desc: " + errorNode.text);
			    }else{
				    var elmList = m_xmlHTTP.responseXML.selectNodes("response/item");				
				    if(getInfo("mode") == 'DRAFT' || getInfo("mode") == "TEMPSAVE" || getInfo("mode") == "REDRAFT"){
					    var oApvList =  CreateXmlDocument();
					    if(!oApvList.loadXML(document.getElementsByName("APVLIST")[0].value)){
						    alert(gMessage75); //"결재선 지정 오류"
					    }else{
						    m_bApvDirty = true;
						    var oGetApvList =  CreateXmlDocument();
						    if(m_xmlHTTP.responseXML.selectSingleNode("response/item/signinform") != null)
						    {
						        oGetApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+m_xmlHTTP.responseXML.selectSingleNode("response/item/signinform").text);
						    }
						    var oCurrentOUNode;
						    if (getInfo("mode") == "REDRAFT") {
						        //담당부서 - 담당부서 및 담당업무 결재선 삭제할것 그 후로 기안자 결재선 입력할것
						        oCurrentOUNode = oApvList.documentElement.selectSingleNode("division[@divisiontype='receive' and taskinfo/@status='pending']");
						        if(oCurrentOUNode == null){
							        var oDiv=oApvList.createElement("division");
							        var oDivTaskinfo=oApvList.createElement("taskinfo");
							        oDiv.appendChild(oDivTaskinfo);
							        oApvList.documentElement.appendChild(oDiv)
							        oDiv.setAttribute("divisiontype","receive");
							        oDiv.setAttribute("name",gLabel__ChargeDept);
							        oDiv.setAttribute("oucode",getInfo("dpid_apv"));
							        oDiv.setAttribute("ouname",(gOUNameType=="1"?(getInfo("etnm") + "-"):"") + getInfo("dpdn_apv"));
							        oDivTaskinfo.setAttribute("status","pending");
							        oDivTaskinfo.setAttribute("result","pending");
							        oDivTaskinfo.setAttribute("kind","receive");
							        oDivTaskinfo.setAttribute("datereceived",getInfo("svdt"));
    						      oCurrentOUNode = oApvList.documentElement.selectSingleNode("division[@divisiontype='receive' and taskinfo/@status='pending']");
						        }
						        var oRecOUNode = oCurrentOUNode.selectSingleNode("step[ou/taskinfo/@status='pending']");
						        if(oRecOUNode != null) oCurrentOUNode.removeChild(oRecOUNode);
						        var oChargeNode = oCurrentOUNode.selectSingleNode("step[ou/person/taskinfo/@status='pending']");
						        if(oChargeNode != null){
						            //person의 takinfo가 inactive가 있는 경우 routetype을 변경함 for 보광
						            var nodesInactives = oCurrentOUNode.selectNodes("step[@routetype='receive' and ou/person/taskinfo/@status='inactive']");
						            for(var i=0; i < nodesInactives.length ; i++){
						                var nodesInactive = nodesInactives.nextNode();
							            nodesInactive.setAttribute("unittype","person");
							            nodesInactive.setAttribute("routetype","approve");
							            nodesInactive.setAttribute("name",gLabel__ChargeDept);
						            }
						            oCurrentOUNode.removeChild(oChargeNode);
						        }
						        var oJFNode = oCurrentOUNode.selectSingleNode("step[ou/role/taskinfo/@status='pending' or ou/role/taskinfo/@status='reserved'  ]");//201108
						        var bHold = false; //201108 보류여부
						        var oComment=null;
						        if(oJFNode != null){
						            var oHoldTaskinfo = oJFNode.selectSingleNode("ou/role/taskinfo[@status='reserved']");
						            if(oHoldTaskinfo != null) {
						                bHold = true;
						                oComment = oHoldTaskinfo.selectSingleNode("comment").cloneNode(true);
						            }
						            oCurrentOUNode.removeChild(oJFNode);
						        }
                                //201108
								    oCurrentOUNode.setAttribute("oucode",getInfo("dpid_apv"));
								    oCurrentOUNode.setAttribute("ouname",(gOUNameType=="1"?(getInfo("etnm") + "-"):"") + getInfo("dpdn_apv"));
								    var oDivTaskinfo = oCurrentOUNode.selectSingleNode("taskinfo");
								    oDivTaskinfo.setAttribute("status","pending");
								    oDivTaskinfo.setAttribute("result","pending");
    								
								    var oStep=oApvList.createElement("step");
								    var oOU=oApvList.createElement("ou");
								    var oPerson=oApvList.createElement("person");
								    var oTaskinfo=oApvList.createElement("taskinfo");
    								
								    oStep.setAttribute("unittype","person");
								    oStep.setAttribute("routetype","approve");
								    oStep.setAttribute("name",gLabel__ChargeDept);
								    oOU.setAttribute("code",getInfo("dpid_apv"));
								    oOU.setAttribute("name",getInfo("dpdn_apv"));
								    oCurrentOUNode.appendChild(oStep).appendChild(oOU).appendChild(oPerson).appendChild(oTaskinfo)

								    oPerson.setAttribute("code",getInfo("usid"));
								    oPerson.setAttribute("name",getInfo("usdn"));
								    oPerson.setAttribute("position",getInfo("uspc")+";"+getInfo("uspn"));
								    oPerson.setAttribute("title",getInfo("ustc")+";"+getInfo("ustn"));
								    oPerson.setAttribute("level",getInfo("uslc")+";"+getInfo("usln"));
								    oPerson.setAttribute("oucode",getInfo("dpid"));
								    oPerson.setAttribute("ouname",(gOUNameType=="1"?(getInfo("etnm") + "-"):"") + getInfo("dpdn"));
            					    oPerson.setAttribute("sipaddress",getInfo("ussip"));
								    oTaskinfo.setAttribute("status",(bHold==true?"reserved":"pending"));//201108
								    oTaskinfo.setAttribute("result",(bHold==true?"reserved":"pending"));//201108
								    oTaskinfo.setAttribute("kind","charge");
								    oTaskinfo.setAttribute("datereceived",getInfo("svdt"));
    								if(bHold) oTaskinfo.appendChild(oComment);//201108
    								
								    elmList = oCurrentOUNode.selectNodes("step");
								    for(var i=elmList.length-1;i>0;i--){
										    if(elmList.item(i).selectSingleNode("ou/person/taskinfo").getAttribute("kind") == "charge"){
												    var currNode3 = oCurrentOUNode.insertBefore(elmList.item(i), elmList.item(i+1-elmList.length));												
										     }
								    }						
    							
							    //2006.04.25 by wolf 퇴직자 및 인사정보 최신 적용을 위해 추가 예외사항생기더라도 기안/재기안자 결재선 디스플레이
							    document.getElementsByName("APVLIST")[0].value = (!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(oApvList.documentElement) : oApvList.documentElement.xml;
							    var nodesAllItems;
							    nodesAllItems = oGetApvList.selectNodes("steps/division[@divisiontype='send']/step");
    							
							    //2006.04.25 by wolf 퇴직자 체크 및 인사정보 체크
							    //oCurrentOUNode.appendChild(nodesAllItems.item(x));

                                  //재기안에서 문서를 열면서 담당부서자동결재선 적용여부 확인
                                  if((getInfo("mode") == "REDRAFT") && getInfo("scRCDTApvLine") == "1" && getInfo("scRCDTApvLineV") != ""){
                                      m_FixApvLineData = m_xmlHTTP.responseXML.selectSingleNode("response/item/signinform");
                                      oApvList.loadXML(setFixApvLineREDRAFT(oApvList, oCurrentOUNode));
                                  } else {
                                  //2013.03 yu2mi: 수신부서에서 재기안시 자동 결재선 가져오는 부분 막음 s
//								    if(nodesAllItems.length > 0){
//									    var oSteps = oGetApvList.selectSingleNode("steps");
//									    var oCheckSteps = chkAbsent(oSteps);
//									    if(oCheckSteps){					
//										    for(var x=0; x<nodesAllItems.length; x++){
//											    oCurrentOUNode.appendChild(nodesAllItems.nextNode().cloneNode(true));
//										    }
//									    }
//								    }
//								    if(nodesAllItems.length > 0){
//									    document.getElementById("btDeptDraft").style.display = "inline";
                                      //								    }
                                      //2013.03 yu2mi: 수신부서에서 재기안시 자동 결재선 가져오는 부분 막음 e
							    }
						    }else{
							    if(getInfo("dpid")!=getInfo("dpid_apv"))
								    oApvList.documentElement.setAttribute("initiatoroucode",getInfo("dpid_apv"));
    							
							    var oDiv=oApvList.createElement("division");
							    var oDivTaskinfo=oApvList.createElement("taskinfo");
							    var oStep=oApvList.createElement("step");
							    var oOU=oApvList.createElement("ou");
							    var oPerson=oApvList.createElement("person");
							    var oTaskinfo=oApvList.createElement("taskinfo");
							    oDiv.appendChild(oDivTaskinfo);
							    oApvList.documentElement.appendChild(oDiv).appendChild(oStep).appendChild(oOU).appendChild(oPerson).appendChild(oTaskinfo);
							    oDiv.setAttribute("divisiontype","send");
							    oDiv.setAttribute("name",gLabel__circulation_sent);
							    oDiv.setAttribute("oucode",getInfo("dpid_apv"));
							    oDiv.setAttribute("ouname",(gOUNameType=="1"?(getInfo("etnm") + "-"):"") + getInfo("dpdn_apv"));
							    oDivTaskinfo.setAttribute("status","inactive");
							    oDivTaskinfo.setAttribute("result","inactive");
							    oDivTaskinfo.setAttribute("kind","send");
							    oDivTaskinfo.setAttribute("datereceived",getInfo("svdt"));
							    oStep.setAttribute("unittype","person");
							    oStep.setAttribute("routetype","approve");
							    oStep.setAttribute("name",gLabel__writer);
							    oOU.setAttribute("code",getInfo("dpid_apv"));
							    oOU.setAttribute("name",getInfo("dpdn_apv"));
							    oPerson.setAttribute("code",getInfo("usid"));
							    oPerson.setAttribute("name",getInfo("usdn"));
							    oPerson.setAttribute("position",getInfo("uspc")+";"+getInfo("uspn"));
							    oPerson.setAttribute("title",getInfo("ustc")+";"+getInfo("ustn"));
							    oPerson.setAttribute("level",getInfo("uslc")+";"+getInfo("usln"));
							    oPerson.setAttribute("oucode",getInfo("dpid"));
							    oPerson.setAttribute("ouname",(gOUNameType=="1"?(getInfo("etnm") + "-"):"") + getInfo("dpdn"));
        					    oPerson.setAttribute("sipaddress",getInfo("ussip"));
							    oTaskinfo.setAttribute("status","inactive");
							    oTaskinfo.setAttribute("result","inactive");
							    oTaskinfo.setAttribute("kind","charge");
							    oTaskinfo.setAttribute("datereceived",getInfo("svdt"));
    							
							    if(getInfo("scSign")=="1"){
							        document.getElementsByName("SIGNIMAGETYPE")[0].value = getInfo("usit");
    							    oTaskinfo.setAttribute("customattribute1",document.getElementsByName("SIGNIMAGETYPE")[0].value);
							    }
							    //퇴직자 및 인사정보 최신 적용을 위해 추가 예외사항생기더라도 기안/재기안자 결재선 디스플레이
							    document.getElementsByName("APVLIST")[0].value =(!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(oApvList) : oApvList.xml;
                                oCurrentOUNode =oApvList.documentElement.selectSingleNode("division[taskinfo/@status='inactive']");							

                                //지정결재선을 사용하는 경우 결재선 생성을 달리함
                                if(getInfo("scCDTApvLine") == "1" && getInfo("scCDTApvLineV") != ""){
                                  m_FixApvLineData = m_xmlHTTP.responseXML.selectSingleNode("response/item/signinform");
                                  oApvList.loadXML(setFixApvLine(oApvList, oCurrentOUNode));
                                }else{
                                  var nodesAllItems;
                                  //debugger;
								    // 합의를 사용하지 않는 기안에는 합의가 없음
								    // 개인결재선 -> 기본결재선(*) 정보
								    var sPath="", sPathOU="";
								    if(getInfo("scPCoo") == "1" || getInfo("scPCooPL") =="1" ){sPath = "or @routetype='assist'";}
								    if(getInfo("scPAgr") == "1" || getInfo("scPAgrSEQ") =="1" ){sPath = sPath + " or @routetype='consult'";}
								    if(getInfo("scPAdt") == "1"){sPath = sPath + " or @routetype='audit'";} //개인감사 추가
								    if(getInfo("scDAdt") == "1"){sPathOU = sPathOU + " @routetype='audit'";} //부서감사 추가
								    if(getInfo("scDCoo") == "1"){sPathOU += ((sPathOU!="")? " or ":"") + " @routetype='assist'";} //부서협조 추가
								    if(getInfo("scDAgr") == "1"){sPathOU += ((sPathOU!="")? " or ":"") + " @routetype='consult'";} //부서합의 추가
								    nodesAllItems = oGetApvList.selectNodes("steps/division/step[(@unittype='person' and ( @routetype='approve' " + sPath + ")) " + ((sPathOU=="")?"":" or ( @unittype='ou' and ("+sPathOU+"))") +" ]");
								    var sccInfos = oGetApvList.selectNodes("steps/ccinfo");
								    if(nodesAllItems.length > 0){
									    var oSteps = oGetApvList.selectSingleNode("steps");
									    var oCheckSteps = chkAbsent(oSteps);
									    if (oCheckSteps) {
                                           //회람후 합의부서 오류 처리를 위한 수정 20160504					
										    for(var x=0; x<nodesAllItems.length; x++){
										        var enodeItem = nodesAllItems.nextNode();
										        if (enodeItem != null) {

										            var oApvList2 = CreateXmlDocument();
                                                    enodeItem = nodesAllItems[x];
                                                    oApvList2.loadXML("<?xml version='1.0' encoding='utf-8'?>" + enodeItem.xml);

                                                    var assistline = oApvList2.selectNodes("step[@unittype='ou']/ou/taskinfo[@datereceived]");
                                                    if (assistline.length > 0)
                                                    {
                                                        for (var y = 0; y < assistline.length; y++)
                                                       {
                                                           assistline[y].attributes.getNamedItem("status").value = "inactive";
                                                           assistline[y].attributes.getNamedItem("result").value = "inactive";
                                                           if (assistline[y].attributes.getNamedItem("datereceived") != null) assistline[y].attributes.removeNamedItem("datereceived");
                                                           if (assistline[y].attributes.getNamedItem("datecompleted") != null) assistline[y].attributes.removeNamedItem("datecompleted");
                                                           if (assistline[y].attributes.getNamedItem("piid") != null) assistline[y].attributes.removeNamedItem("piid");
                                                           enodeItem = assistline[y].parentNode.parentNode;
                                                       }
                                                    }
										        }
										        oCurrentOUNode.appendChild(enodeItem.cloneNode(true));
										    }
									    }
								    }

								    //양식 결재선에 수신처.
								    if(getInfo("scDRec")==1 || getInfo("scPRec")==1){
									    nodesAllItems = oGetApvList.selectNodes("steps/division[@divisiontype='receive' and step/@routetype='receive' and (step/@unittype='ou' or step/@unittype='person' )]");
									    for(var x=0; x<nodesAllItems.length; x++){
										    oApvList.documentElement.appendChild(nodesAllItems.nextNode().cloneNode(true));
									    }
								    }
								    //참조자 출력
								    //개인결재선 참조 불러오기
								    var nodesItems = sccInfos;
								    if(nodesItems.length > 0){									
									    //퇴직자 및 부서이동 및 직급변경 체크
									    //var oCheckSteps = chkAbsent(oSteps);
									    //if ( oCheckSteps ){					
										    for(var x=0; x<nodesItems.length; x++){
											    oApvList.documentElement.appendChild(nodesItems.nextNode().cloneNode(true));
										    }
								    }
							    }
						    }
						    document.getElementsByName("APVLIST")[0].value = (!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(oApvList) : oApvList.xml;
					    }
				    }
				    //담당부서 , 업무담당자 수정할것
    //				//2005.11.15 by wolf 업무담당자 불러오기
    //				if (getInfo("scChgr")=="1" && getInfo("scChgrV")=="select" && (getInfo("mode") == "DRAFT" ||getInfo("mode") == "TEMPSAVE" ))	{
    //						var szURL = "http://"+document.location.host+"/xmlorg/query/org_jfmembercheck.xml?ENT_CODE="+getInfo("etid")+"&FMPF="+getInfo("fmpf")+"&RGCODE="+getInfo("usrc");		
    //						requestHTTP("GET",szURL,false,"text/xml",null,null);
    //						receiveJFHTTP();
    //				}
    //				//2006.02.13 by wolf 담당부서 불러오기
    //				if (getInfo("scChgrOU")=="1" && (getInfo("mode") == "DRAFT" ||getInfo("mode") == "TEMPSAVE") ){
    //					if( getInfo("scChgrOUV")!="" ){
    //						var sChgrOUV = getInfo("scChgrOUV");
    //						var arrayChgrOUV = sChgrOUV.split("@");
    //						document.getElementsByName("REQ_DEPT")[0].value = arrayChgrOUV[1];
    //					}else{
    //						alert("담당부서가 없습니다. 관리자에게 문의 바랍니다.");
    //					}
    //				}
    //				}
			    }
			}
		}
	}
}
function updateDocList(){
	if(getInfo("fmpf") == 'OUTERPUBLISH_ENFORCE'){
		var strRecDeptNo = getInfo("RECEIVE_NO");
		var iFIndex = strRecDeptNo.indexOf('['+getInfo("INITIATOR_OU_ID")+']');
		var strRecDocNO="";
		var sProcessStatus="결재진행중";
		var szURL = "";
		if(iFIndex != -1){
			var iLIndex = strRecDeptNo.indexOf(';',iFIndex);
			var iMIndex = strRecDeptNo.indexOf(']',iFIndex);
			strRecDocNO =  strRecDeptNo.substring(iMIndex+1, iLIndex);
		}
		if(strRecDocNO != '')	{
			var aDocNO = strRecDocNO.split(" ");
			szURL = '&OWNER_ID=' + getInfo("INITIATOR_OU_ID")+ '&LIST_TYPE=4&FISCAL_YEAR=' +aDocNO[1]+ '&SERIAL_NUMBER=' +aDocNO[3];
			if(getInfo("mode") == 'RECAPPROVAL'){
				if(( document.getElementsByName("bLASTAPPROVER")[0].value == 'true' ) && (document.getElementsByName("ACTIONINDEX")[0].value == 'approve'))	sProcessStatus = '결재종료';
			}else{
			}
		}
		return false; //saveApvDocument 수행하지 않음
	}
	return true; //saveApvDocument 수행함
}
function selPRIORITY(){
	var pIndex = PRIORITY.selectedIndex;
	var pValue = PRIORITY.options[pIndex].value;
	if(pValue != "3"  && document.getElementsByName("REASON")[0].value == ""){
		//alert('우선순위선택 사유를 입력하십시요.')
		document.getElementsByName("REASON")[0].focus();
	}
}
//긴급결재
function chk_urgent_onclick(){	
	document.getElementById("chk_urgent").value = (document.getElementById("chk_urgent").checked == true )?"1":"0";		
}
//기밀문서
function chk_secrecy_onclick(){	
    document.getElementById("chk_secrecy").checked = (document.getElementById("chk_secrecy").checked == true )?false:true;		
	document.getElementById("chk_secrecy").value = (document.getElementById("chk_secrecy").checked == true )?"1":"0";		
}
//문서이관
function chk_edmschk_onclick(){		
	document.getElementById("chk_edmschk").value = (document.getElementById("chk_edmschk").checked == true )?"1":"0";	
	//setInfo("chk_edmschk", chk_edmschk.value);	
}
//양식창에서 수신처 view
function goViewRecList(){
	openWindow("receive_list.htm","",480,326,"fix");
}
//회신 (추가 : 2008.08.05 백승찬 대리)
function chk_reform_onclick(){
//	document.getElementById("chk_reform").value = (document.getElementById("chk_reform").checked == true )?"0":"1";
//2011.09.14 회수 check true = 1 , check false = 0으로 수정
    document.getElementById("chk_reform").value = (document.getElementById("chk_reform").checked == true )?"1":"0";
		
	m_oFormEditor.document.getElementsByName("REPLY")[0].value = document.getElementById("chk_reform").value;
}
function receiveGeneralQuery(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(((!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(m_xmlHTTP.responseXML) :m_xmlHTTP.responseXML.xml)==""){
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

function toUTF8(szInput){
	var wch,x,uch="",szRet="";
	if(btoUtf){
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
	}else{
	    szRet = szInput;
	}
	return(szRet);
}
/*메일 작성창 open */
var ogetWellKnownMailboxUrl =  CreateXmlHttpRequest();
var rg_Mailbox;
var g_xmlHTTP = CreateXmlHttpRequest();
var szApvBodyCtx="";
//function sendMail(){	getWellKnownMailboxUrl(ogetWellKnownMailboxUrl,g_szBaseURL+"@"+gMailDomain,event_sync_Mail);}
//function sendMail(){CoviWindow(g_szBaseURL + '/Mail/webmail/writemail/write.aspx?strTemp=sendmail','',800,600,'resize');}
function sendMail(){OpenNewMsg("sendmail");}
function OpenNewMsg(code) 
{
    //mailform.action = g_szBaseURL + "/CBMail/webmail/writemail/write.aspx?strTemp=" + code; //개발
    mailform.action = g_szBaseURL + "/Mail/webmail/writemail/write.aspx?strTemp=" + code; //운영
            
    var szwidth = 800;
    var szheight = 690;
    calcWindowLocation(szwidth,szheight);
    windowName = new String(Math.round(Math.random() * 100000));
    var strNewFearture = ModifyWindowFeature("toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=" + szwidth + ",height=" + szheight + ",top=" + theTop + ",left=" + theLeft);
    window.open("",windowName,strNewFearture);
    //window.open("",windowName,"toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=" + szwidth + ",height=" + szheight + ",top=" + theTop + ",left=" + theLeft)

    //제목 넘기기
    mailform.Subject.value = getInfo("SUBJECT");
    //본문 넘기기
	mailform.HTMLBody.value = encode(sMailBody);
	//2011-03-07 본문 넘기기 전 sMailBody base64로 인코딩 hichang 끝
	//첨부파일 처리
//    데이터포멧 : 파일경로1|파일명1|파일사이즈1?파일경로2|파일명2|파일사이즈2?  - 파일사이즈 단위(byte)
//    예) \GWStorage\BOARD\1155\AttachFile\200907\1649_소프트웨어사용인증서.ppt|소프트웨어사용인증서.ppt|313856?
	var szAttFileInfo = "";
	if (getInfo("ATTACH_FILE_INFO") != ""){		
		var r, res;
		var s = getInfo("ATTACH_FILE_INFO");
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
		var fmurl = getInfo("fmurl").replace("EDMS","")+"ATTACH/";
		var attpath = getInfo("attpath");
		if (elmRoot != null){
			szAttFileInfo = "";
            elmList = elmRoot.selectNodes("fileinfo/file");
            for(var i=0; i < elmList.length; i++){
                elm = elmList.nextNode();
                if(elm == null) elm = elmList[i];			
				var filename = elm.getAttribute("name");
				var filesize = elm.getAttribute("size");
                var fileurl = elm.getAttribute("location");
                var filepath = fileurl.replace(fmurl, attpath).replace("/","\\");
                filepath = filepath.substring(filepath.indexOf("\\\\")+1, filepath.length);
                filepath = filepath.substring(filepath.indexOf("\\")+1, filepath.length);
                filepath = filepath.substring(filepath.indexOf("\\"), filepath.length);
                
                szAttFileInfo += filepath+"|"+filename+"|"+filesize;
				if (i < elmList.length - 1)
					szAttFileInfo += "?";
			}
        }
    }
    mailform.attachfiles.value = encode(szAttFileInfo);
	mailform.target = windowName;
	mailform.submit();  
}
//2011-03-07 본문 넘기기 전 sMailBody base64로 인코딩 hichang 시작
var base64s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function encode(decStr) {
	decStr = escape(decStr);
	var bits, dual, i = 0, encOut = '';
	while (decStr.length >= i + 3) {
		bits =
  (decStr.charCodeAt(i++) & 0xff) << 16 |
  (decStr.charCodeAt(i++) & 0xff) << 8 |
   decStr.charCodeAt(i++) & 0xff;
		encOut +=
  base64s.charAt((bits & 0x00fc0000) >> 18) +
  base64s.charAt((bits & 0x0003f000) >> 12) +
  base64s.charAt((bits & 0x00000fc0) >> 6) +
  base64s.charAt((bits & 0x0000003f));
	}
	if (decStr.length - i > 0 && decStr.length - i < 3) {
		dual = Boolean(decStr.length - i - 1);
		bits =
  ((decStr.charCodeAt(i++) & 0xff) << 16) |
   (dual ? (decStr.charCodeAt(i) & 0xff) << 8 : 0);
		encOut +=
  base64s.charAt((bits & 0x00fc0000) >> 18) +
  base64s.charAt((bits & 0x0003f000) >> 12) +
  (dual ? base64s.charAt((bits & 0x00000fc0) >> 6) : '=') + '=';
	}
	return encOut;
}
//2011-03-07 본문 넘기기 전 sMailBody base64로 인코딩 hichang 끝
//2011-03-07 본문 넘기기 전 sMailBody base64로 디코딩 hichang 시작
function decode(encStr) {
	var bits, decOut = '', i = 0;
	for (; i < encStr.length; i += 4) {
		bits =
  (base64s.indexOf(encStr.charAt(i)) & 0xff) << 18 |
  (base64s.indexOf(encStr.charAt(i + 1)) & 0xff) << 12 |
  (base64s.indexOf(encStr.charAt(i + 2)) & 0xff) << 6 |
   base64s.indexOf(encStr.charAt(i + 3)) & 0xff;
		decOut += String.fromCharCode(
  (bits & 0xff0000) >> 16, (bits & 0xff00) >> 8, bits & 0xff);
	}
	if (encStr.charCodeAt(i - 2) == 61)
		undecOut = decOut.substring(0, decOut.length - 2);
	else if (encStr.charCodeAt(i - 1) == 61)
		undecOut = decOut.substring(0, decOut.length - 1);
	else undecOut = decOut;
	return unescape(undecOut);
}
//2011-03-07 본문 넘기기 전 sMailBody base64로 디코딩 hichang 끝
var theLeft;
var theTop;
function calcWindowLocation(theWidth,theHeight) {
    var objNewWin;
           
    var x = theWidth;
    var y = theHeight;
           
    theLeft = window.screen.width  / 2 - x / 2;
    theTop = window.screen.height / 2 - y / 2 - 20;
}
function getWellKnownMailboxUrl(oHTTP,sRootURL,listener) {
	var sBody = '<?xml version="1.0"?>' +
				'<a:propfind xmlns:a="DAV:" xmlns:b="urn:schemas:httpmail:"  xmlns:e="http://schemas.microsoft.com/exchange/">' 
		+	'<a:prop><b:inbox/><b:calendar/><b:sentitems/><b:deleteditems/><b:contacts/><b:drafts/><b:junkmail/><b:outbox/><b:tasks/><b:journal/><b:notes/>' +
				'</a:prop></a:propfind>';
	oHTTP.open("PROPFIND", sRootURL,false);
	oHTTP.setRequestHeader( "Depth:", "0");
	oHTTP.setRequestHeader( "Brief:", "t");
	oHTTP.setRequestHeader( "Content-type:", "text/xml");
	if(listener!=null) oHTTP.onreadystatechange = listener;
	oHTTP.send(sBody);
}
function event_sync_Mail(){
	if(ogetWellKnownMailboxUrl.readyState == 4) {		
		ogetWellKnownMailboxUrl.onreadystatechange = event_noop;
		if(ogetWellKnownMailboxUrl.status == 207) {
			setWellKnownMailboxUrl(ogetWellKnownMailboxUrl, null) ;
			rg_Mailbox = new Array();
			var objResponseXML = ogetWellKnownMailboxUrl.responseXML;
			var xmlNodes = objResponseXML.selectNodes("a:multistatus/a:response/a:propstat/a:prop/*");		
			for(var i=0;i <= xmlNodes.length - 1; i++) {				
				 rg_Mailbox[xmlNodes.item(i).baseName]  =  (xmlNodes.item(i).text).replace( g_szBaseURL, "");
			}
			var stmpMode = getInfo("mode");
			setInfo("mode","ADMINEDMS");
			m_oFormEditor.G_displaySpnAttInfo();
			m_oFormEditor.G_displaySpnDocLinkInfo();			
			szApvBodyCtx = m_oFormEditor.document.getElementById("bodytable").innerHTML;
			setInfo("mode",stmpMode);
			m_oFormEditor.G_displaySpnAttInfo();
			m_oFormEditor.G_displaySpnDocLinkInfo();
			//CoviWindow('/COVINet/COVIMail/netMail/NewMail_Tagfree.aspx?FolderUrl=' + g_szBaseURL+ rg_Mailbox["drafts"]+'?Cmd=new','',800,600,'resize');
			CoviWindow('/Mail/webmail/writemail/write.aspx?strTemp=sendmail&Subject=Test&HTMLBody=Test','',800,600,'resize');
		}
	}
}
function setWellKnownMailboxUrl(oHTTP, listener) {
	var g_oXML = new ActiveXObject("Microsoft.XMLDOM");
	var sXML = "<result>";
	var objResponseXML = oHTTP.responseXML;
	var xmlNodes = objResponseXML.selectNodes("a:multistatus/a:response/a:propstat/a:prop/*");
	for(var i=0;i <= xmlNodes.length - 1; i++){
		sXML += "<" + xmlNodes.item(i).baseName + ">" + (xmlNodes.item(i).text).replace(g_szBaseURL, "") + "</" + xmlNodes.item(i).baseName + ">" ;
	}
	sXML += "</result>";
	g_oXML.loadXML(sXML);
	var sURL = g_szBaseURL + "CoviGwNet/include/setSessionMailBoxUrl.aspx";
	g_xmlHTTP.open("POST",sURL,true);
	g_xmlHTTP.setRequestHeader("Accept-Language:", "ko");
	g_xmlHTTP.setRequestHeader("Content-type:", "text/xml");
	if(listener!=null){
		g_xmlHTTP.onreadystatechange = listener;
	}
	g_xmlHTTP.send((!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(g_oXML) :g_oXML.xml);
}

function requestTempSaveProcess(sReqMode){
	m_sReqMode = sReqMode;	
		try{
			disableBtns(true);
			if(evaluateForm()){	
				var sTargetURL="submitForm.aspx";
				var sMsgTitle;
				var sAddage;				
				switch(sReqMode){					
					case "TEMPSAVE":						
						sMsgTitle = gLabel__personalSave; //"개인 저장함"
						
						var sFiid=getInfo("fiid");setInfo("fiid",getInfo("fiid_spare"));setInfo("fiid_spare",sFiid);//setInfo("mode","REJECT");
						setInfo("mode","DRAFT");setInfo("loct","DRAFT");
						sTargetURL="../TempSave/saveForm.aspx";
						var sFormXml = m_oFormEditor.getFormXML();
						if(sFormXml.indexOf("<BODY_CONTEXT>") == -1){
							sFormXml = sFormXml.replace("</formdata>","");
							sFormXml += makeNode("BODY_CONTEXT",getInfo("BODY_CONTEXT"));
							sFormXml += "</formdata>";
						}
						sAddage=makeNode("fmfn")+sFormXml;
						m_bFrmExtDirty = true;
						break;
				}
				try{
				    m_oFormEditor.beginProgress(gMessage67, gMessage67); //"잠시 기다려 주십시오… 저장하는 중"

				    //관리자에 의한 강제취소 처리시작 - 임시저장 보정 2010.12
				    var szusidback = "";
				    if (parent.admintype == "ADMIN") {
				        szusidback = getInfo("usid");
				        setInfo("usid", getInfo("INITIATOR_ID"));
				    }
					var sText = "<request>"+getDefaultXML()+sAddage+makeNode("fiid_spare")+"</request>";
					evalXML(sText);
					requestHTTP("POST",sTargetURL,false,"text/xml",null,sText);
					receiveHTTP();
					if (parent.admintype == "ADMIN" && szusidback != "") {
					    setInfo("usid", szusidback);
					}
					//관리자에 의한 강제취소 처리 끝 - 임시저장 보정 2010.12
            	} catch (e) {
					disableBtns(false);
					m_oFormEditor.endProgress();
					alert(gMessage73 + "\nDesc:"+e.description + "\nError number: " + e.number); //"저장하지 못했습니다."
				}
			}else{
				disableBtns(false);
			}
		}catch(e){alert(e.description);}
}
function getEDMSDocs(){
	try{
		//m_oFormEditor.beginProgress("잠시 기다려 주십시오...","본문내용을 읽는 중입니다...");
		var sTargetURL = "/kplusweb/Hanjin/Cabinet/GetKnowledge.aspx?Oid="+getInfo("Oid");
		m_sReqMode = "EDMS";
		requestHTTP("Get",sTargetURL,false,"text/xml",receiveHTTP,null);
	}catch(e){
		//m_oFormEditor.endProgress();
	}
}
// 지식 첨부 링크
function inputEDMS(szValue, szName){
	var aAttFile = m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value.split("^^^");
	var sAttFile = aAttFile[0];	
	var attach =  (sAttFile != null)?sAttFile.replace("%","%25").replace("&","%26").replace("#","%23").replace("+","%2B"):"";
	makeDictionary(m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value);
	addDictionary(szName,"1;"+szName+";"+szValue);	
	setAttInfo();
}

var dicFileInfo = new Dictionary();
//2006.12.05 by wolf upload UI 변경 
// Dictionary 추가
var dicFileInfoSize = new Dictionary();
var dicFileInfoState = new Dictionary();
var dicFileInfoUserName = new Dictionary();
var dicFileInfoDeptName = new Dictionary();
//2006.12.05 by wolf upload UI 변경  End
function makeDictionary(strFileInfo){
	if(strFileInfo != ""){
		var m_oFileList = CreateXmlDocument();
		m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+ strFileInfo);
		var elmRoot, elmList, elm, elmTaskInfo;
		elmRoot = m_oFileList.documentElement;
		if(elmRoot!=null){			
			elmList = elmRoot.selectNodes("//fileinfos");
			
			if(elmList.length == 0){			
				elmList = elmRoot.selectNodes("file");
			}else{	
				elmList = elmRoot.selectNodes("fileinfo/file");				
			}
			
			for (var i=0; i<elmList.length;i++) {
				elm = elmList.nextNode();
				addDictionary(elm.getAttribute("name"), elm.getAttribute("location"), elm.getAttribute("size"), elm.getAttribute("state"),  elm.getAttribute("user_name"),  elm.getAttribute("dept_name")); //파일명, url 넘김, size, state 넘김
			}
		}
	}
}
//퇴직자 및 인사정보 최신 적용을 위해 추가
function chkAbsent(oSteps){
	var oUsers = oSteps.selectNodes("division/step/ou/person");
	var elmUsers;
	var sUsers="";
	for(var i=0; i < oUsers.length ; i++){
		elmUsers = oUsers.nextNode();
		if(sUsers.length > 0){
		    var szcmpUsers = ";" + sUsers + ";";
		    if(szcmpUsers.indexOf(";" + elmUsers.getAttribute("code") + ";") == -1){
			    sUsers += ";"+ elmUsers.getAttribute("code");
			}
		}else{
			sUsers += elmUsers.getAttribute("code");
		}
	}
	var pXML = "dbo.usp_CheckAbsentMember";
	var aXML = "<param><name>USER_ID</name><type>VarChar</type><length>2000</length><value><![CDATA["+sUsers+"]]></value></param>";
    var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
    var szURL = "../address/getXMLQuery.aspx?Type=searchMember";
    requestHTTP("POST",szURL,false,"text/xml",null, sXML);
	return chkAbsentUsers(oSteps);
}
//퇴직자 및 인사정보 최신 적용을 위해 추가
function chkAbsentUsers(oSteps) {
	if(m_xmlHTTP.readyState==4){	
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=="\r"){
			//alert(m_xmlHTTP.responseText);			
		}else{			
			var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			if(errorNode!=null){
				return false;
			}else{
				//Active 한 사용자들 모두 조회, 부서, 직위, 직급, 직책 비고
             var m_objXML=CreateXmlDocument();
                /*
	            var m_oMemberXSLProcessor = makeProcessor("../Address/org_chkabsent.xsl");
	            m_oMemberXSLProcessor.input = m_xmlHTTP.responseXML;
	            m_oMemberXSLProcessor.transform();
	            m_objXML.loadXML(m_oMemberXSLProcessor.output);
	            */
	            var m_oMemberXSLProcessor = CreateXmlDocument();
	            m_oMemberXSLProcessor.async = false; 
				m_oMemberXSLProcessor.load("../Address/org_chkabsent.xsl");
	            m_objXML.loadXML(m_xmlHTTP.responseXML.transformNode(m_oMemberXSLProcessor));
				//Active 한 사용자들 모두 조회, 부서, 직위, 직급, 직책 비고
				var oUsers = m_objXML.selectNodes("response/addresslist/item");
				var oUser;
				var sAbsentResult="";
				var sResult="";
				var oStepUsers = oSteps.selectNodes("division/step/ou/person");
				
				for(var i=0;i<oStepUsers.length;i++){
					oUser = oStepUsers.nextNode();
					var oChkAbsent = m_objXML.selectNodes("response/addresslist/item[AN='" +oUser.getAttribute("code") + "']");
					if(oChkAbsent != null){ 
						var oChkAbsentNode = m_objXML.selectSingleNode("response/addresslist/item[AN='"+oUser.getAttribute("code") + "'  and RG='" + oUser.getAttribute("oucode") + "' ]"); //and RGNM = '" + oUser.getAttribute("ouname") + "' and @tl='"+ oUser.getAttribute("title") +"'
						if(oChkAbsentNode != null){
							/*직급코드까지체크 일시중단
						    var oChkAbsentNode2 = m_objXML.selectSingleNode("response/addresslist/item[@po='" + oUser.getAttribute("position") + "' and AN='" + oUser.getAttribute("code") + "'  and RG='" + oUser.getAttribute("oucode") + "' ]");
						    if (oChkAbsentNode2 == null) {//직급코드까지 체크하도록 함
						        sResult += "	" + oUser.getAttribute("ouname") + " : " + oUser.getAttribute("name") + "\n";
						    }*/						    
                            //2013-06-03 hyh 주석
						    //oChkAbsentNode = m_objXML.selectSingleNode("response/addresslist/item[AN='"+oUser.getAttribute("code") + "' ]");
						    //2013-06-03 hyh 주석 끝
						    oUser.setAttribute("oucode", oChkAbsentNode.selectSingleNode("RG").text);
						    oUser.setAttribute("ouname", oChkAbsentNode.selectSingleNode("RGNM").text);
						    oUser.setAttribute("position", oChkAbsentNode.getAttribute("po"));
						    oUser.setAttribute("title", oChkAbsentNode.getAttribute("tl"));
						    oUser.setAttribute("level", oChkAbsentNode.getAttribute("lv"));
						} else {
						    //sResult += "	" + oUser.getAttribute("ouname") +" : " + oUser.getAttribute("name")+"\n";
					    }
					}else{//퇴직자
						sAbsentResult += "	" + oUser.getAttribute("ouname") +" : " + oUser.getAttribute("name")+"\n";
					}
				}
				if(sAbsentResult != ""){
					alert(gMessage57+sAbsentResult); //"선택한 개인 결재선에 퇴직자가 포함되어 적용이 되지 않습니다.\n\n---퇴직자--- \n\n"
					return false;
				}else{
					if(sResult != ""){
						alert(gMessage173+sResult); //"선택한 개인 결재선의 부서/인사정보가 최신정보와 일치하지 않아 적용이 되지 않습니다.\n\n---변경자--- \n\n"
						return false;
					}else{
						return true;
					}
					
				}
			}
		}
	}
}
function makeProcessor(urlXsl){
    if (("ActiveXObject" in window)) {
        var oXslDom = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
        oXslDom.async = false;
        if(!oXslDom.load(urlXsl)){
	        alertParseError(oXslDom.parseError);
	        throw new Error(-1,"couldn't make TemplateProcessor with ["+urlXsl+"].");
        }
        var oXSLTemplate = new ActiveXObject("MSXML2.XSLTemplate");
        oXSLTemplate.stylesheet = oXslDom;
        return oXSLTemplate.createProcessor();
    }else{
        if(urlXsl.indexOf(".xsl") > -1){
	        var oXslDom = CreateXmlDocument();
	        oXslDom.async = false;
	        oXslDom.load(urlXsl); 
            var oProcessor = new XSLTProcessor();
            oProcessor.importStylesheet(oXslDom.text);
            return oProcessor;
        }else{
            var oProcessor = new XSLTProcessor();
            oProcessor.importStylesheet(urlXsl);
            return oProcessor;
        }
    }
}
function getRecCCList4CK(){
    m_oFormEditor.initApvList();
}

//후결여부 체크
function fn_GetReview(){  
    var m_apvXML = CreateXmlDocument();
    m_apvXML.loadXML(document.getElementsByName("APVLIST")[0].value); 
    var oReviewNode = m_apvXML.documentElement.selectSingleNode("division/step/ou/person[taskinfo/@kind='review' and taskinfo/@status='pending']");
    if(oReviewNode != null){
        if(getInfo("usid") == oReviewNode.getAttribute("code")){
            return true
        }
    }
    return false;
}
//후결여부 체크
//최종결재여부 체크
function getIsLast(){
	var sRtn = "";
    var m_oApvList = CreateXmlDocument();
    m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+document.getElementsByName("APVLIST")[0].value);
	
	var oPendingSteps = m_oApvList.documentElement.selectNodes("division/step[.//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='pending' or .//taskinfo/@status='reserved')]");
	var oinActiveSteps = m_oApvList.documentElement.selectNodes("division/step[.//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass' and .//taskinfo/@kind!='skip'  and .//taskinfo/@status='inactive']");
	if(( oPendingSteps.length == 1 ) && (oinActiveSteps.length == 0)){
		sRtn="true";
	}else{
		sRtn="false";
	}
	if(sRtn == "false"){
	    switch (getInfo("mode")){
		    case "PCONSULT": 
	            if(getInfo("mode") == "PCONSULT" && getInfo("pfsk") == "T004" && document.getElementsByName("ACTIONINDEX")[0].value == 'reject'){ //합의 반려 가능
    		        sRtn="true";
	            }
	           break;
	        default:
	            if(document.getElementsByName("ACTIONINDEX")[0].value == 'reject'){ //결재 반려 가능
    		        sRtn="true";
	            }
	            break;
	    }
	} 
	return sRtn;
}
//양식 내역 보내기
function getInfoBodyContext(){
	var sFormXml = m_oFormEditor.getFormXML();
	if(sFormXml.indexOf("<BODY_CONTEXT>") == -1){
		sFormXml = sFormXml.replace("</formdata>","");
		sFormXml += makeNode("BODY_CONTEXT",getInfo("BODY_CONTEXT"));
		sFormXml += "</formdata>";
	}
	return sFormXml;
}

function receiveBBSHTTP(sMethod,sURL,sText){
	requestHTTP(sMethod,sURL,false,"text/xml",null,sText);
	var xmlReturn=m_xmlHTTP.responseXML;
	
	if(((!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(xmlReturn):xmlReturn.xml)==""){
		throw new Error(-1,m_xmlHTTP.responseText);
	}else{
	    
	  var errorNode=xmlReturn.selectSingleNode("response/error");
		if(errorNode!=null){
			throw new Error(-1,errorNode.text);
		}else{
		    alert(gMessage170); //"완료되었습니다."       
		}
	}
}

function saveApvDocument(strDocNo){
	var strReturn="false";
	m_CmtBln = false;
	
	if( getInfo("mode")=="APPROVAL" ||getInfo("mode")=="PCONSULT" || getInfo("mode") == "RECAPPROVAL" || getInfo("mode") == "REDRAFT")
	{
		if((document.getElementsByName("bLASTAPPROVER")[0].value == 'true' ) && (document.getElementsByName("ACTIONINDEX")[0].value == 'approve')) 	strReturn = "true";
		//if ((field["ACTIONINDEX"].value == 'cancel')) 	strReturn = "true"; //기각일 경우도 이관
		//if ((getInfo("pfsk")=='T004' && getInfo("scReturn")=='1') && field["ACTIONINDEX"].value == 'cancel') 	sRtn = "true";
		//if (getInfo("pfsk")=='T011' ) 	strReturn = "true";
	}else if(getInfo("mode")=="ADMINEDMS")
	{
		strReturn = "true";
	} 

	var oApvList =  CreateXmlDocument();
	oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+document.getElementsByName("APVLIST")[0].value)
	
	var elmRoot, elmList;
	elmRoot = oApvList.documentElement;		
	elmList = elmRoot.selectNodes("division/step/ou");

	//  스키마 정의에서 수신부서사용 선택이 체크되어 있으면서 결재선에 수신부서가 없는 경우를 위하여 조건문 변경					
	//if ( (getInfo("scDRec") == '1' && elmList.length != 0) || (getInfo("scChgr") == '1' || getInfo("scChgrOU") == '1' )){  			
	if((getInfo("scIPub") == '1' && getInfo("mode") != 'REDRAFT' && getInfo("mode") != 'RECAPPROVAL' ) ||  getInfo("scIPub") != '1'){
		if((getInfo("scEdmsLegacy") == '1')  && strReturn =="true" && (getInfo("scEdmsLegacyV")=="" || (getInfo("scEdmsLegacyV")==getInfo("mode")) || getInfo("mode") == "ADMINEDMS"))
		{			
			//결재문서이관시 본문내용
//			if (strDocNo == "" ) strDocNo = getInfo("DOC_NO");
//			if (strDocNo != "")
//			{
				if(getInfo("mode") != "ADMINEDMS")
				{
					var oApvRoot= CreateXmlDocument();	
					if(getInfo("pfsk")=='T011')
					{
						m_sReqMode="APPROVE";			
						oApvRoot.loadXML(getApvList());
					}
					else
					{
						oApvRoot.loadXML("<apvlist>"+document.getElementsByName("APVLIST")[0].value+"</apvlist>");
				  }
					var oStep = oApvRoot.selectSingleNode("apvlist/steps/division/step[ou/*/taskinfo[@status='pending' or @status='reserved']]");
					if(oStep != null){				
						var oPerson = oStep.selectSingleNode("ou/*[taskinfo[@status='pending' or @status='reserved']]");
						if(oPerson != null){
							var oTaskinfo  = oPerson.selectSingleNode("taskinfo");
							var skind = oTaskinfo.getAttribute("kind");
							oTaskinfo.setAttribute("status","complete");
							switch (skind){
								case "substitute": //대결
									oTaskinfo.setAttribute("result","substituted");break;
								case "authorize"://전결 결재안함
									oTaskinfo.setAttribute("result","authorized");break;
								case "normal":  //일반결재 -> 후열
									if(document.getElementsByName("ACTIONINDEX")[0].value == 'approve'){
									    oTaskinfo.setAttribute("result","completed");
									}else{
									    oTaskinfo.setAttribute("result","canceled");
									}
									break;
								default:
									if(document.getElementsByName("ACTIONINDEX")[0].value == 'approve'){
									    oTaskinfo.setAttribute("result","completed");
									}else{
									    oTaskinfo.setAttribute("result","canceled");
									}
							}
							oTaskinfo.setAttribute("datecompleted",getInfo("svdt"));
							oTaskinfo.setAttribute("customattribute1",document.getElementsByName("SIGNIMAGETYPE")[0].value);
							if(document.getElementsByName("ACTIONCOMMENT")[0].value != ""){
								if(oTaskinfo.selectSingleNode("comment") != null){
									var comment=oTaskinfo.selectSingleNode("comment");
									comment.setAttribute("datecommented",getInfo("svdt"));
									comment.setAttribute("relatedresult",document.getElementsByName("ACTIONINDEX")[0].value);
									comment.text = document.getElementsByName("ACTIONCOMMENT")[0].value;
								}else{
									var comment=oApvRoot.createElement("comment");
									comment.setAttribute("datecommented",getInfo("svdt"));
									comment.setAttribute("relatedresult",document.getElementsByName("ACTIONINDEX")[0].value);
									comment.text = document.getElementsByName("ACTIONCOMMENT")[0].value;
									oTaskinfo.appendChild(comment);
								}
							}
						}
					}
					var oResult = oApvRoot.selectSingleNode("apvlist/steps");
					document.getElementsByName("APVLIST")[0].value = (!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(oResult): oResult.xml;
					setInfo("DOC_NO", strDocNo);
					setInfo("ATTACH_FILE_INFO",m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value);
					m_oFormEditor.document.getElementsByName("DOC_NO")[0].value = strDocNo;
					if(m_oFormEditor.document.getElementsByName("SAVE_TERM") != null)	setInfo("SAVE_TERM",m_oFormEditor.document.getElementsByName("SAVE_TERM")[0].value);
					if(m_oFormEditor.document.getElementsByName("DOC_LEVEL") != null)	setInfo("DOC_LEVEL",m_oFormEditor.document.getElementsByName("DOC_LEVEL")[0].value);
					if(m_oFormEditor.document.getElementsByName("RECEIVE_NAMES") != null)	setInfo("RECEIVE_NAMES",m_oFormEditor.document.getElementsByName("RECEIVE_NAMES")[0].value);
					if(m_oFormEditor.document.getElementsByName("RECEIPT_LIST") != null)	setInfo("RECEIPT_LIST",m_oFormEditor.document.getElementsByName("RECEIPT_LIST")[0].value);
					if(m_oFormEditor.document.getElementsByName("SUBJECT.value") != "") setInfo("SUBJECT",m_oFormEditor.document.getElementsByName("SUBJECT")[0].value);
					
					var szBody = m_oFormEditor.getBodyContext();
					if(szBody.indexOf("<BODY_CONTEXT><![CDATA") > -1){
						szBody = szBody.substring(23,szBody.length-18);
					}else{
						szBody = szBody.replace("<BODY_CONTEXT>","").replace("</BODY_CONTEXT>","");
					}
					szBody = szBody.replace(/&lt;/gi,"<").replace(/&gt;/gi,">");
					if(szBody != ""){
						setInfo("BODY_CONTEXT",szBody);
					}
					
					m_oFormReader.initForm();
					m_oFormReader.G_displaySpnAttInfo(false);
					setInfo("ATTACH_FILE_INFO",m_oFormEditor.document.getElementsByName("ATTACH_FILE_INFO")[0].value);				
					m_oFormReader.initApvList();
				}
				m_oFormReader.initApvList();
				
//				var sText = getApproveDocument();				
//				evalXML(sText);
//				receiveFileHTTP("POST","../FileAttach/SaveAppDoc.aspx",sText);
	            try{
		            var oXMLHTTP =CreateXmlHttpRequest();
		            var sz = "<request><context_body><![CDATA["+m_oFormReader.bodytable.innerHTML+"]]></context_body><comment><![CDATA[]]></comment></request>";
		            var getHTMLSource = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'></head><body topmargin='0' leftmargin='0' scroll='auto' align='center'>"+m_oFormReader.bodytable.innerHTML+"</body></html>"
		            oXMLHTTP.open("GET",SiteAdminURL+"/"+ApplicationAdminName+"/Approval_Admin/LegacyMgr/mimeConvertCDO.aspx",false);
		            oXMLHTTP.setRequestHeader("Content-type:", "text/xml");
		            oXMLHTTP.send(makeXML(getHTMLSource,""));
		            if(oXMLHTTP.status >= 400) {
			            alert("ERROR : " + oXMLHTTP.statusText + " mimeConvertCDO admin 인증 누가좀 해줘요"); //admin 인증 안되네요 일단 보류
			            return false;
		            }else{
			            var returnVal = oXMLHTTP.responseXML.selectSingleNode("response/error") ;
			            if(returnVal != null){
				            //alert("MIME 변환 실패 : " + returnVal.text);
				            return false;
			            }else{
				            try{
					            var oXMLHTTP3 = CreateXmlHttpRequest();;
					            oXMLHTTP3.open("GET",SiteAdminURL+"/"+ApplicationAdminName+"/Approval_Admin/LegacyMgr/downProcess.aspx",false);
					            oXMLHTTP3.send(makeXML(getHTMLSource,""));
					            if(oXMLHTTP3.status >= 400) {
						            //alert("downProcess ERROR : " + oXMLHTTP3.statusText);
						            return false;
					            }else{
						            var returnVal = oXMLHTTP3.responseXML.selectSingleNode("response/error") ;
						            if(returnVal != null){
							            alert("error: " + returnVal.text);
							            return false;
						            }
					            }
				            }catch(e){
					            alert(e.description);
				            }
			            }
		            }
	            }catch(ex){
		            alert(ex.description);
		            return false;
	            }
	        }
//		}else{alert('문서번호 발행 오류');}
		}	
	//}	
}
function makeXML(pBody,pComment){
	var sXML ="<request>"
			+ "<piid>"+getInfo("piid")+"</piid>"
			+ "<fiid>"+getInfo("fiid")+"</fiid>"
			+ "<body><![CDATA["+pBody+"]]></body>"
			+ "<comment><![CDATA["+pComment+"]]></comment>"
			+ "<path><![CDATA["+m_oFormEditor.getInfo("fmpath") +getInfo("fiid") + ".mht"+"]]></path>"
			+ "<pathcomment><![CDATA["+m_oFormEditor.getInfo("fmpath") +getInfo("fiid") + "_결재정보.htm"+"]]></pathcomment>"
			+ "</request>";

	return sXML;
}
//지정결재선 셋팅 시작
var m_oXSLProcessor;
function setFixApvLine(oApvList, oCurrentOUNode, indexCondition, indexCTCondition){
  //m_FixApvLineData ; requester 지정 결재선 정보
  //<NewDataSet>
  //Table : 지정결재선
  //Table1 : controller
  //Table2~: 금액 관련 결재선
  //지정결재선 추가
    var array1 = getInfo("scCDTApvLineV").split("|");
    m_oXSLProcessor = makeProcessor("../ApvLineMgr/ApvlineGen.xsl");

    var m_objXMLMember = CreateXmlDocument();
    m_objXMLMember.loadXML(m_FixApvLineData.xml);
  
	if(m_FixApvLineData != null ){
      
      //기존에 추가된 사용자 지우기
      if(m_FixApvLineData.selectSingleNode("//Table2") != null){
          var m_objXMLETC=CreateXmlDocument();
          var m_XMLDOMETC=CreateXmlDocument();
          var szXML = "";
          for(var ii=2; ii< array1.length ; ii++){
			try{szXML += m_FixApvLineData.selectSingleNode("//"+ " Table"+ii ).xml;}catch(e){}
          }
          m_objXMLETC.loadXML("<signinform><NewDataSet>"+szXML+"</NewDataSet></signinform>");
          var m_oMemberXSLProcessorETC = makeProcessor("../Address/org_memberqueryfixapvline.xsl");
          m_oMemberXSLProcessorETC.addParameter("type", "etc");
          m_oMemberXSLProcessorETC.input = m_objXMLETC;
          m_oMemberXSLProcessorETC.transform();
          m_objXMLETC.loadXML(m_oMemberXSLProcessorETC.output);    
          m_XMLDOMETC.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
          var m_oParentETC = m_XMLDOMETC.selectSingleNode("selected/user")
          var elmListETC = m_objXMLETC.selectNodes("response/addresslist/item");
          for(var i=0; i < elmListETC.length; i++){
              var elm = elmListETC.nextNode();
              var oStepUser = oCurrentOUNode.selectSingleNode("step[ou/person[@code = '" +elm.selectSingleNode("AN").text +"' and taskinfo/@kind != 'charge' and taskinfo/@status='inactive']]");
              if(oStepUser != null){
                  if(m_FixApvLineData.selectSingleNode("//Table[PERSON_CODE ='"+elm.selectSingleNode("AN").text+"']") == null)                  oCurrentOUNode.removeChild(oStepUser);
              }
          }			
      } 	
          
 	
      var m_objXMLMember = CreateXmlDocument();
      m_objXMLMember.loadXML(m_FixApvLineData.xml);
  	
      var m_objXML=CreateXmlDocument();
      var m_oMemberXSLProcessor = makeProcessor("../Address/org_memberqueryfixapvline.xsl");
	  m_oMemberXSLProcessor.addParameter("type", "fix");
      m_oMemberXSLProcessor.input = m_objXMLMember;
      m_oMemberXSLProcessor.transform();
      m_objXML.loadXML(m_oMemberXSLProcessor.output);

    var m_XMLDOM = CreateXmlDocument();
    m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
    if(!m_XMLDOM.parsed){
    }
    var m_oParent = m_XMLDOM.selectSingleNode("selected/user");
      var elmList = m_objXML.selectNodes("response/addresslist/item");
      for(var i=0; i < elmList.length; i++){
          var elm = elmList.nextNode();
          m_oParent.appendChild(elm.cloneNode(true));
      }			
      
      m_objXML.loadXML(m_oParent.xml);
      insertToList4ApvLine(oApvList, oCurrentOUNode, m_objXML);
      
      //controller 추가
      //전체 혹은 brand별 controller 있을 경우 default 추가
      //금액 조건까지는 여기에서 처리
      //특이조건은 양식에서 처리
      if(m_FixApvLineData.selectSingleNode("//Table1/CONTOLLER") == null){
      var szCTList = "";
      var usdv = getInfo("dpid").substring(0,4);
	    var barndid = getInfo("dpid").substring(4,11);		    
	    
	    if(getInfo("dpid").length<10)
	    {
	        usdv='1100';
	        barndid=getInfo("dpid");
	    }
	    
	    var bManager = gManagerYN;
          
          var oChargePerson = oApvList.documentElement.selectSingleNode("division[@divisiontype='send' and taskinfo/@status='inactive']/step/ou/person[taskinfo/@kind='charge']");
          //대리작성
          try{
              if(parent.editor.ProxyYN.value == "Y" && parent.menu.chk_proxy.checked){
                  //if (oChargePerson.getAttribute("code") !=  parent.editor.ProxySabun.value){
                      usdv = parent.editor.ProxyDeptCode.value.substring(0,4);
                      barndid = parent.editor.ProxyDeptCode.value.substring(4,11);
                      if(parent.editor.ProxyDeptCode.value.length < 10)
	                {
	                    usdv='1100';
	                    barndid=getInfo("dpid");
	                }
                      
                      //대결자 manager 여부
                      if(usdv=="1300" || usdv=="1400"){ 
                          bManager = chkManager(parent.editor.ProxySabun.value,parent.editor.ProxyDeptCode.value);
                      }
                  //}
              }
          }catch(e){}
          
          if(array1[1] == "T"){//CT설정일 경우에만 수행
              m_oMemberXSLProcessor = makeProcessor("../Address/org_memberqueryfixapvline.xsl");
              m_oMemberXSLProcessor.addParameter("type", "controller");
              var m_objXMLMember2 = CreateXmlDocument();
              
              if(m_FixApvLineCTData.documentElement.getAttribute("ALL"+usdv) == "1"){//전brand 공통 controller 있을 경우
                  m_oMemberXSLProcessor.input = m_objXMLMember;
                  m_oMemberXSLProcessor.transform();
                  m_objXML.loadXML(m_oMemberXSLProcessor.output);    
                  
                  m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
                  m_oParent = m_XMLDOM.selectSingleNode("selected/user")
                  elmList = m_objXML.selectNodes("response/addresslist/item");
                  for(var i=0; i < elmList.length; i++){
                      var elm = elmList.nextNode();
                      m_oParent.appendChild(elm.cloneNode(true));
                  }			
                  
                  m_objXML.loadXML(m_oParent.xml);        
                  insertToList4ApvLine(oApvList, oCurrentOUNode, m_objXML);
                  
              }else{
                  //brand별 controller
                  var temp = m_FixApvLineCTData.documentElement.selectSingleNode("CT"+barndid).text;
                  if(temp != "") {
                      m_oMemberXSLProcessor.input = m_objXMLMember;
                      m_oMemberXSLProcessor.transform();
                      m_objXML.loadXML(m_oMemberXSLProcessor.output);    
                      
                      m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
                      m_oParent = m_XMLDOM.selectSingleNode("selected/user")
                      elmList = m_objXML.selectNodes("response/addresslist/item");
                      for(var i=0; i < elmList.length; i++){
                          var elm = elmList.nextNode();
                          m_oParent.appendChild(elm.cloneNode(true));
                      }			
                      
                      m_objXML.loadXML(m_oParent.xml);        
                      insertToList4ApvLine(oApvList, oCurrentOUNode, m_objXML);
                  }
                  //금액별 controller - 기준 index가 들어올 경우 및  기준금액이 있을 경우 처리
                  //indexCTCondition이 2인 경우 삭제
                  
//                    oStepUser = oCurrentOUNode.selectSingleNode("step[ou/person[@code = '" +m_FixApvLineCTData.documentElement.selectSingleNode("AM1CT"+barndid).text +"' and taskinfo/@kind != 'charge' and taskinfo/@status='inactive']]");
//                    if (oStepUser != null) oCurrentOUNode.removeChild(oStepUser);
//                    oStepUser = oCurrentOUNode.selectSingleNode("step[ou/person[@code = '" +m_FixApvLineCTData.documentElement.selectSingleNode("AM2CT"+barndid).text +"' and taskinfo/@kind != 'charge' and taskinfo/@status='inactive']]");
//                    if (oStepUser != null) oCurrentOUNode.removeChild(oStepUser);
              
//                    oStepUser = oCurrentOUNode.selectSingleNode("step[ou/person[@code = '" +m_FixApvLineCTData.documentElement.selectSingleNode("ETC1CT"+usdv).text +"' and taskinfo/@kind != 'charge' and taskinfo/@status='inactive']]");
//                    if (oStepUser != null) oCurrentOUNode.removeChild(oStepUser);
//                    oStepUser = oCurrentOUNode.selectSingleNode("step[ou/person[@code = '" +m_FixApvLineCTData.documentElement.selectSingleNode("ETC2CT"+usdv).text +"' and taskinfo/@kind != 'charge' and taskinfo/@status='inactive']]");
//                    if (oStepUser != null) oCurrentOUNode.removeChild(oStepUser);
//                    
                  var oCheckUser = null;
                  oStepUser = oCurrentOUNode.selectSingleNode("step[ou/person[@code = '" +m_FixApvLineCTData.documentElement.selectSingleNode("AM1CT"+barndid).text +"' and taskinfo/@kind != 'charge' and taskinfo/@status='inactive']]");
                  oCheckUser = m_FixApvLineData.selectSingleNode("//Table[PERSON_CODE ='"+ m_FixApvLineCTData.documentElement.selectSingleNode("AM1CT"+barndid).text +"']");

                  if(oStepUser != null && oCheckUser == null) oCurrentOUNode.removeChild(oStepUser); 
                  oStepUser = oCurrentOUNode.selectSingleNode("step[ou/person[@code = '" +m_FixApvLineCTData.documentElement.selectSingleNode("AM2CT"+barndid).text +"' and taskinfo/@kind != 'charge' and taskinfo/@status='inactive']]");
                  oCheckUser = m_FixApvLineData.selectSingleNode("//Table[PERSON_CODE ='"+ m_FixApvLineCTData.documentElement.selectSingleNode("AM2CT"+barndid).text +"']");
                  
                  if(oStepUser != null && oCheckUser == null) oCurrentOUNode.removeChild(oStepUser);
              
                  oStepUser = oCurrentOUNode.selectSingleNode("step[ou/person[@code = '" +m_FixApvLineCTData.documentElement.selectSingleNode("ETC1CT"+usdv).text +"' and taskinfo/@kind != 'charge' and taskinfo/@status='inactive']]");
                  oCheckUser = m_FixApvLineData.selectSingleNode("//Table[PERSON_CODE ='"+ m_FixApvLineCTData.documentElement.selectSingleNode("ETC1CT"+usdv).text +"']");

                  if(oStepUser != null && oCheckUser == null) oCurrentOUNode.removeChild(oStepUser);
                  oStepUser = oCurrentOUNode.selectSingleNode("step[ou/person[@code = '" +m_FixApvLineCTData.documentElement.selectSingleNode("ETC2CT"+usdv).text +"' and taskinfo/@kind != 'charge' and taskinfo/@status='inactive']]");
                  oCheckUser = m_FixApvLineData.selectSingleNode("//Table[PERSON_CODE ='"+ m_FixApvLineCTData.documentElement.selectSingleNode("ETC2CT"+usdv).text +"']");
                  if(oStepUser != null && oCheckUser == null) oCurrentOUNode.removeChild(oStepUser);

                  if(indexCTCondition == null){
                      temp = m_FixApvLineCTData.documentElement.selectSingleNode("AM1"+barndid).text;
//                        if(temp=="")
//                        {
//                            temp="0";
//                        }
//                        //barndid='1400'
                      if(temp == "0"){
                          if(szCTList != ""){
                              szCTList += "or " + "PERSON_CODE = '" +m_FixApvLineCTData.documentElement.selectSingleNode("AM1CT"+barndid).text+ "'" ;
                          }else{
                              szCTList = "PERSON_CODE = '" +m_FixApvLineCTData.documentElement.selectSingleNode("AM1CT"+barndid).text+ "'" ;
                          }
                          m_objXMLMember2.loadXML("<signinform><NewDataSet>"+m_objXMLMember.selectSingleNode("//Table1["+szCTList+"]").xml+"</NewDataSet></signinform>");
                          m_oMemberXSLProcessor.input = m_objXMLMember2; 
                          m_oMemberXSLProcessor.transform();
                          m_objXML.loadXML(m_oMemberXSLProcessor.output);    

                          m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
                          m_oParent = m_XMLDOM.selectSingleNode("selected/user")
                          elmList = m_objXML.selectNodes("response/addresslist/item");
                          for(var i=0; i < elmList.length; i++){
                              var elm = elmList.nextNode();
                              m_oParent.appendChild(elm.cloneNode(true));
                          }			

                          m_objXML.loadXML(m_oParent.xml);        
                          insertToList4ApvLine(oApvList, oCurrentOUNode, m_objXML);
                      }
                  }else{
                      if(indexCTCondition == "1"){
                          temp = m_FixApvLineCTData.documentElement.selectSingleNode("AM1"+barndid).text;
                          if(temp == "0"){
                              szCTList = "PERSON_CODE = '" +m_FixApvLineCTData.documentElement.selectSingleNode("AM1CT"+barndid).text+ "'" ;
                              m_objXMLMember2.loadXML("<signinform><NewDataSet>"+m_objXMLMember.selectSingleNode("//Table1["+szCTList+"]").xml+"</NewDataSet></signinform>");
                              m_oMemberXSLProcessor.input = m_objXMLMember2; 
                              m_oMemberXSLProcessor.transform();
                              m_objXML.loadXML(m_oMemberXSLProcessor.output);    

                              m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
                              m_oParent = m_XMLDOM.selectSingleNode("selected/user")
                              elmList = m_objXML.selectNodes("response/addresslist/item");
                              for(var i=0; i < elmList.length; i++){
                                  var elm = elmList.nextNode();
                                  m_oParent.appendChild(elm.cloneNode(true));
                              }			

                              m_objXML.loadXML(m_oParent.xml);        
                              insertToList4ApvLine(oApvList, oCurrentOUNode, m_objXML);
                          }
                      }
                      if(indexCTCondition == "2"){
                          temp = m_FixApvLineCTData.documentElement.selectSingleNode("AM2"+barndid).text;
                          if(temp != "0"){
                              szCTList = "PERSON_CODE = '" +m_FixApvLineCTData.documentElement.selectSingleNode("AM2CT"+barndid).text+ "'" ;

                              m_objXMLMember2.loadXML("<signinform><NewDataSet>"+m_objXMLMember.selectSingleNode("//Table1["+szCTList+"]").xml+"</NewDataSet></signinform>");
                              m_oMemberXSLProcessor.input = m_objXMLMember2; 
                              m_oMemberXSLProcessor.transform();
                              m_objXML.loadXML(m_oMemberXSLProcessor.output);    

                              m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
                              m_oParent = m_XMLDOM.selectSingleNode("selected/user")
                              elmList = m_objXML.selectNodes("response/addresslist/item");
                              for(var i=0; i < elmList.length; i++){
                                  var elm = elmList.nextNode();
                                  m_oParent.appendChild(elm.cloneNode(true));
                              }			

                              m_objXML.loadXML(m_oParent.xml);        
                              insertToList4ApvLine(oApvList, oCurrentOUNode, m_objXML);
                              
                          }
                      } 
                  }
                  //TER CPD, PPD를 위한 금액 특이 조건 check
                  if((getInfo("fmpf") == "WF_LOREAL_FORM20" && ( usdv=="1300" || usdv=="1400") ) && ( m_FixApvLineCTData.documentElement.selectSingleNode("ETC1CT"+usdv).text  != "" || m_FixApvLineCTData.documentElement.selectSingleNode("ETC2CT"+usdv).text !="")){
                      //1조건 외화 혹은 부서장이면  특정인
                      //debugger;
                      if(parent.editor.SEL_GL1!=null){
                          //이후창 수정 
                          //TER SEL_GL1재사용일 경우 SEL_GL1 이 SPAN이라 안되는 경우 있음
                          var nSEL_GL1="";
                          if(parent.editor.SEL_GL1.tagName=="SPAN")
                          {
                              nSEL_GL1=parent.editor.SEL_GL1.innerHTML;
                          }
                          else
                          {
                              nSEL_GL1=parent.editor.SEL_GL1.options[parent.editor.SEL_GL1.selectedIndex].text;
                          }
                          if(nSEL_GL1=="")
                          {
                              nSEL_GL1="KRW";
                          }
                          //원본
                          //if( parent.editor.SEL_GL1.options[parent.editor.SEL_GL1.selectedIndex].text != "KRW" || bManager == "Y" ){
                          //수정본
                          if(nSEL_GL1 != "KRW" || bManager == "Y"){
                              szCTList = "PERSON_CODE = '" +m_FixApvLineCTData.documentElement.selectSingleNode("ETC1CT"+usdv).text+ "'" ;
                              m_objXMLMember2.loadXML("<signinform><NewDataSet>"+m_objXMLMember.selectSingleNode("//Table1["+szCTList+"]").xml+"</NewDataSet></signinform>");
                              m_oMemberXSLProcessor.input = m_objXMLMember2; 
                              m_oMemberXSLProcessor.transform();
                              m_objXML.loadXML(m_oMemberXSLProcessor.output);    

                              m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
                              m_oParent = m_XMLDOM.selectSingleNode("selected/user")
                              elmList = m_objXML.selectNodes("response/addresslist/item");
                              for(var i=0; i < elmList.length; i++){
                                  var elm = elmList.nextNode();
                                  m_oParent.appendChild(elm.cloneNode(true));
                              }			

                              m_objXML.loadXML(m_oParent.xml);        
                              insertToList4ApvLine(oApvList, oCurrentOUNode, m_objXML);
                              }
                      
                      } 
                      //2조건 krw이거나 부서장이 아니면 특정인
                      if(parent.editor.SEL_GL1!=null){
                          //이후창 수정 
                          //TER SEL_GL1재사용일 경우 SEL_GL1 이 SPAN이라 안되는 경우 있음
                          var nSEL_GL1="";
                          if(parent.editor.SEL_GL1.tagName=="SPAN")
                          {
                              nSEL_GL1=parent.editor.SEL_GL1.innerHTML;
                          }
                          else
                          {
                              nSEL_GL1=parent.editor.SEL_GL1.options[parent.editor.SEL_GL1.selectedIndex].text;
                          }
                          
                          if(nSEL_GL1=="")
                          {
                              nSEL_GL1="KRW";
                          }
                          //원본
                          //if( parent.editor.SEL_GL1.options[parent.editor.SEL_GL1.selectedIndex].text == "KRW" && bManager == "N" ){
                          //수정본
                          if(nSEL_GL1 == "KRW" || bManager == "N"){
                              szCTList = "PERSON_CODE = '" +m_FixApvLineCTData.documentElement.selectSingleNode("ETC2CT"+usdv).text+ "'" ;
                              m_objXMLMember2.loadXML("<signinform><NewDataSet>"+m_objXMLMember.selectSingleNode("//Table1["+szCTList+"]").xml+"</NewDataSet></signinform>");
                              m_oMemberXSLProcessor.input = m_objXMLMember2; 
                              m_oMemberXSLProcessor.transform();
                              m_objXML.loadXML(m_oMemberXSLProcessor.output);    

                              m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
                              m_oParent = m_XMLDOM.selectSingleNode("selected/user")
                              elmList = m_objXML.selectNodes("response/addresslist/item");
                              for(var i=0; i < elmList.length; i++){
                                  var elm = elmList.nextNode();
                                  m_oParent.appendChild(elm.cloneNode(true));
                              }			

                              m_objXML.loadXML(m_oParent.xml);        
                              insertToList4ApvLine(oApvList, oCurrentOUNode, m_objXML);
                           }
                      }else{
                          if(bManager == "Y"){
                              szCTList = "PERSON_CODE = '" +m_FixApvLineCTData.documentElement.selectSingleNode("ETC1CT"+usdv).text+ "'" ;
                          }
                          else
                          {
                              szCTList = "PERSON_CODE = '" +m_FixApvLineCTData.documentElement.selectSingleNode("ETC2CT"+usdv).text+ "'" ;
//                                if(getInfo("usid")==m_FixApvLineCTData.documentElement.selectSingleNode("ETC2CT"+usdv).text)
//                                {
//                                    szCTList = "PERSON_CODE = '" +m_FixApvLineCTData.documentElement.selectSingleNode("ETC1CT"+usdv).text+ "'" ;
//                                }
//                                else
//                                {
//                                    szCTList = "PERSON_CODE = '" +m_FixApvLineCTData.documentElement.selectSingleNode("ETC2CT"+usdv).text+ "'" ;
//                                }
                          }
                              m_objXMLMember2.loadXML("<signinform><NewDataSet>"+m_objXMLMember.selectSingleNode("//Table1["+szCTList+"]").xml+"</NewDataSet></signinform>");
                              m_oMemberXSLProcessor.input = m_objXMLMember2; 
                              m_oMemberXSLProcessor.transform();
                              m_objXML.loadXML(m_oMemberXSLProcessor.output);    

                              m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
                              m_oParent = m_XMLDOM.selectSingleNode("selected/user")
                              elmList = m_objXML.selectNodes("response/addresslist/item");
                              for(var i=0; i < elmList.length; i++){
                                  var elm = elmList.nextNode();
                                  m_oParent.appendChild(elm.cloneNode(true));
                              }			

                              m_objXML.loadXML(m_oParent.xml);        
                              insertToList4ApvLine(oApvList, oCurrentOUNode, m_objXML);
                      
                      }                
                  }

              }
          }
          /*   
          m_oMemberXSLProcessor.transform();
          m_objXML.loadXML(m_oMemberXSLProcessor.output);    
          
          m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
          m_oParent = m_XMLDOM.selectSingleNode("selected/user")
          elmList = m_objXML.selectNodes("response/addresslist/item");
          for(var i=0; i < elmList.length; i++){
              var elm = elmList.nextNode();
              m_oParent.appendChild(elm);
          }			
          
          m_objXML.loadXML((!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(m_oParent):m_oParent.xml);        
          insertToList4ApvLine(oApvList, oCurrentOUNode, m_objXML);
          */
      }
      //특정 금액
      if(indexCondition != null){
          if(indexCondition >= 2){
              if(m_FixApvLineData.selectSingleNode("//Table2") != null){
                  var m_objXMLETC=CreateXmlDocument();
                  var szXML = "";
                  for(var ii=2; ii<= indexCondition ; ii++){
                          try{szXML += m_FixApvLineData.selectSingleNode("//"+"Table"+ii ).xml;}catch(e){}
                  }
                  m_objXMLETC.loadXML("<signinform><NewDataSet>"+szXML+"</NewDataSet></signinform>");
                  
                  //추가(by chlee)
                  m_oMemberXSLProcessor = makeProcessor("../Address/org_memberqueryfixapvline.xsl");
				  m_oMemberXSLProcessor.addParameter("type", "etc");
                  m_oMemberXSLProcessor.input = m_objXMLETC;
                  m_oMemberXSLProcessor.transform();
                  m_objXML.loadXML(m_oMemberXSLProcessor.output);    
                  m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
                  m_oParent = m_XMLDOM.selectSingleNode("selected/user")
                  elmList = m_objXML.selectNodes("response/addresslist/item");
                  for(var i=0; i < elmList.length; i++){
                      var elm = elmList.nextNode();
                      if(m_oParent.selectSingleNode("item[AN = '"+elm.selectSingleNode("AN").text+"']") == null){
                          m_oParent.appendChild(elm);
                          //특수조건으로 들어오는 경우 기존의 N+1인 경우 삭제되고 CONTROLLER 다음으로 들어간다.
                          var oStepUser = oCurrentOUNode.selectSingleNode("step[ou/person[@code = '" +elm.selectSingleNode("AN").text +"' and taskinfo/@kind != 'charge' and taskinfo/@status='inactive']]");
                          if(oStepUser != null){
                              oCurrentOUNode.removeChild(oStepUser.cloneNode(true));
                          }
                        
                      }
                  }			
                  m_objXML.loadXML(m_oParent.xml);  
                  
                  insertToList4ApvLine(oApvList, oCurrentOUNode, m_objXML);
              } 
          }
      }
  }
  return oApvList.xml;
}

function insertToList4ApvLine(oApvList, oCurrentOUNode, oSrcDoc){    
	m_oXSLProcessor.input = chkDuplicateApprover(oSrcDoc, oApvList);
  m_oXSLProcessor.addParameter("steptype", "division");
  m_oXSLProcessor.addParameter("divisiontype", "send");

  m_oXSLProcessor.addParameter("unittype", "person");
  m_oXSLProcessor.addParameter("routetype", "approve");
  m_oXSLProcessor.addParameter("allottype", "serial");
  m_oXSLProcessor.addParameter("referencename", gLabel_approve);
  m_oXSLProcessor.addParameter("childvisible", "");
  m_oXSLProcessor.transform();
  var oTargetDoc = CreateXmlDocument();
  oTargetDoc.loadXML(m_oXSLProcessor.output);
  
  var oChildren = oTargetDoc.documentElement.selectNodes("division/step");
  var elm=oChildren.nextNode();

  var xpathCur;
  var oSelectedElm;
  while(elm!=null){
    oCurrentOUNode.appendChild(elm.cloneNode(true));
    elm = oChildren.nextNode();
  }
}

function chkDuplicateApprover(oSrcDoc, m_oApvList){
	var oSrcDocList = oSrcDoc.selectNodes("//item");
	var bDelete=false;
	for(var i=0 ; i < oSrcDocList.length; i++){
		var item = oSrcDocList.nextNode();		
		var xPathDelete='';
		if(!this.agent.msie){
            xPathDelete = "division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step/ou/*[name()='person' or name()='role']";
        }else{
            xPathDelete = "division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step/ou/(person|role)";
        }
		//0419 기안자도 추가 안됨
		//xPathDelete +="[@code='" + item.selectSingleNode("AN").text+ "' and @name='"+ item.selectSingleNode("DN").text+"' and taskinfo/@kind !='charge']";
		xPathDelete +="[@code='" + item.selectSingleNode("AN").text+ "' and @name='"+ item.selectSingleNode("DN").text+"' ]";
		if(m_oApvList.documentElement.selectSingleNode(xPathDelete) != null){
			oSrcDoc.documentElement.removeChild(item);
			bDelete= true;
		}
	}
	return oSrcDoc;
}

function chkAMTAPVLINE(szAMT){    
  if(getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"){
      if(getInfo("scCDTApvLine") == "1" && getInfo("scCDTApvLineV") != ""){
          var array1 = getInfo("scCDTApvLineV").split("|");
          var arrayAMT = new Array();
          var arrayCondition= new Array();
          var j=0;
          if(array1.length > 2){
              for(var i=2; i < array1.length ; i ++){
                  arrayAMT[j] = array1[i].split(";")[0];
                  arrayCondition[j] = array1[i].split(";")[1];
                  j++;
              }
          }
          var k=j-1;
          while(k>= 0){
              if(Number(szAMT) >= Number(arrayAMT[k])){
                  break;
              }
              k--;        
          }
	    var oApvList =  CreateXmlDocument();
	    if(!oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+parent.menu.document.getElementsByName("APVLIST")[0].value)){
	    }
  		
          //금액별 controller
          //PR / PO / Internal Order : less than 10 mW > Jhun, Dae Chan
          //PR / PO / Internal Order : equal to or more than 10 mW > Kim, So Jin
          
          var szCTList = "";
          var usdv = getInfo("dpid").substring(0,4);
					var barndid = getInfo("dpid").substring(4,11);
					if(getInfo("dpid").length < 10)
					{
							usdv='1100';
							barndid=getInfo("dpid");
					}
          var oChargePerson = oApvList.documentElement.selectSingleNode("division[@divisiontype='send' and taskinfo/@status='inactive']/step/ou/person[taskinfo/@kind='charge']");
          //대리작성
          try{
              if(parent.editor.ProxyYN.value == "Y" && parent.menu.chk_proxy.checked){
                  //if (oChargePerson.getAttribute("code") !=  parent.editor.ProxySabun.value){
                      usdv = parent.editor.ProxyDeptCode.value.substring(0,4);
                      barndid = parent.editor.ProxyDeptCode.value.substring(4,11);
                  if(parent.editor.ProxyDeptCode.value.length < 10)
	                {
	                    usdv='1100';
	                    barndid=getInfo("dpid");
	                }
                  //}
              }
          }catch(e){}
          //controller 사용일 경우 들어감
          var AMCTcnt = null;
          if(array1[1] == "T"){
              var tempAM1 = m_FixApvLineCTData.documentElement.selectSingleNode("AM1"+barndid).text;
              var tempAM1CT = m_FixApvLineCTData.documentElement.selectSingleNode("AM1CT"+barndid).text;
              var tempAM2 = m_FixApvLineCTData.documentElement.selectSingleNode("AM2"+barndid).text;
              var tempAM2CT = m_FixApvLineCTData.documentElement.selectSingleNode("AM2CT"+barndid).text;
              if(tempAM1 != "" || tempAM2 != ""){
                  if( Number(szAMT) >= Number(tempAM2)){
                      AMCTcnt = 2;
                  }else if(Number(tempAM2) > Number(szAMT)){
                      AMCTcnt = 1;
                  }
              }
          }
	    var oCurrentOUNode =oApvList.documentElement.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pendig' ]");	
          if(Number(k) >= 0){
              oApvList.loadXML(parent.menu.setFixApvLine(oApvList, oCurrentOUNode, k+2, AMCTcnt));
          }else{
              oApvList.loadXML(parent.menu.setFixApvLine(oApvList, oCurrentOUNode, null, AMCTcnt));
          }
          parent.menu.document.getElementsByName("APVLIST")[0].value  = (!("ActiveXObject" in window)) ?(new XMLSerializer()).serializeToString(oApvList.documentElement):oApvList.documentElement.xml; 
          try{parent.editor.initApvList();}catch(e){}
      }
  }
}
//담당업무함 지정결재선 셋팅
function setFixApvLineREDRAFT(oApvList, oCurrentOUNode){
  //m_FixApvLineData ; requester 지정 결재선 정보
  //<NewDataSet>
  //Table : 지정결재선
  //Table1 : controller
  //지정결재선 추가
  
    m_oXSLProcessor = makeProcessor("../ApvLineMgr/ApvlineGen.xsl");

  var m_objXMLMember = CreateXmlDocument();
  m_objXMLMember.loadXML(m_FixApvLineData.xml);

  var m_objXML=CreateXmlDocument();
  var m_oMemberXSLProcessor = makeProcessor("../Address/org_memberqueryfixapvline.xsl");
	m_oMemberXSLProcessor.addParameter("type", "fix");
  m_oMemberXSLProcessor.input = m_objXMLMember;
  m_oMemberXSLProcessor.transform();
  m_objXML.loadXML(m_oMemberXSLProcessor.output);

  var m_XMLDOM = CreateXmlDocument();
  m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
  if(!m_XMLDOM.parsed){
  }
  var m_oParent = m_XMLDOM.selectSingleNode("selected/user");
  var elmList = m_objXML.selectNodes("response/addresslist/item");
  for(var i=0; i < elmList.length; i++){
      var elm = elmList.nextNode();
      m_oParent.appendChild(elm);
  }			
  
  m_objXML.loadXML(m_oParent.xml);
  insertToList4ApvLine(oApvList, oCurrentOUNode, m_objXML);
  
  return oApvList.xml;
}
function chkManager(szusid, szdeptid){
	var pXML = " EXEC dbo.usp_CheckMANAGER '"  +szdeptid + "','"+ szusid+"' ";
  var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
  var szURL = "../address/getXMLQuery.aspx?Type=searchMember";
  requestHTTP("POST",szURL,false,"text/xml",null, sXML);
	return (chkManagerReceive()== true?"Y":"N");
}
//2007.12.27 by sunny 부서장여부 확인
function chkManagerReceive(){	
	if(m_xmlHTTP.readyState==4){	
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=="\r"){
		
		}else{			
			var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			if(errorNode!=null){
				return false;
			}else{
			    if(m_xmlHTTP.responseXML.selectSingleNode("ROOT").text == ""){
			        return false;
			    }else{
			        return true;
			    }
			}
		}
	}
}
function insertAfter(newElement,targetElement) {
  var parent = targetElement.parentNode;
  if(parent.lastChild==targetElement) {
      parent.appendChild(newElement);
  } else {
      parent.insertBefore(newElement,targetElement.nextSibling);
  }
}
//지정결재선 셋팅 끝

//결재문서 PC저장
//function PcSave(){
//  //양식 특정함수 포함된 내역 빼기
//  parent.editor.bDisplayOnly = true;
//  parent.editor.bPresenceView = false;
//  parent.editor.initApvList();
//  parent.editor.G_displaySpnAttInfo("display");
//  var sBodyHTML = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'><link rel='stylesheet' href='http://" + document.location.host + g_imgBasePath +"/css/css_style.css' type='text/css'></head><body topmargin='0' leftmargin='0' scroll='auto' align='center'>"+m_oFormEditor.document.getElementById("bodytable").innerHTML+"</body></html>";
//  var oXMLHTTP =CreateXmlHttpRequest();
//  var sz = "<request><context_body><![CDATA["+sBodyHTML+"]]></context_body><comment><![CDATA["+""+"]]></comment><filename><![CDATA["+getInfo("DOC_NO")+"]]></filename><fiid>"+getInfo("fiid")+"</fiid><url><![CDATA[http://"+window.location.host+"]]></url><fmnm><![CDATA["+getInfo("fmnm")+"]]></fmnm></request>";
//  document.frPCSAVE.action = "../../common/FileAttach/PCSaveToMHT.aspx";//"../Portal/PCSaveToMHT.aspx";					
//  document.frPCSAVE.target = "frAttachFiles";
//  document.frPCSAVE.txtHTML.value = sz;
//  document.frPCSAVE.submit();
//  //다시 올려주기
//  parent.editor.bDisplayOnly = false;
//  parent.editor.bPresenceView = true;
//  parent.editor.G_displaySpnAttInfo(false);
//  parent.editor.initApvList();
//  
//}
//PC 저장 수정_2011.09.07
function PcSave(){
    //양식 특정함수 포함된 내역 빼기
  parent.editor.bDisplayOnly = true;
  parent.editor.bPresenceView = false;
  parent.editor.initApvList();
  parent.editor.G_displaySpnAttInfo("display");
  //var sBodyHTML = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=euc-kr;'><link rel='stylesheet' href='http://" + document.location.host + g_imgBasePath + "/css/css_style.css' type='text/css'></head><body topmargin='0' leftmargin='0' scroll='auto' align='center'>" + m_oFormEditor.document.getElementById("bodytable").innerHTML + "</body></html>";
  //var sBodyHTML = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=uft-8'><link rel='stylesheet' href='http://" + document.location.host + g_imgBasePath + "/css/css_style.css' type='text/css'></head><body topmargin='0' leftmargin='0' scroll='auto' align='center'>" + m_oFormEditor.document.getElementById("bodytable").innerHTML + "</body></html>";
  //var sBodyHTML = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'><link rel='stylesheet' href='http://" + document.location.host + "/GwImages/common/css/css_style.css' type='text/css'></head><body topmargin='0' leftmargin='0' scroll='auto' align='center'>" + m_oFormEditor.document.getElementById("bodytable").innerHTML + "</body></html>";
  var sBodyHTML = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'><style>";
  try {
      for (var i = 0; i < parent.editor.document.styleSheets.length; i++) {
          sBodyHTML += getStyle(parent.editor.document.styleSheets[i].href.replace("approval_form.css", "approval_form_mht.css"));
      }
  } catch (e) { }

  //sBodyHTML += "</style></head><body topmargin='0' leftmargin='0' scroll='auto' align='center'>" + m_oFormEditor.document.getElementById("bodytable").innerHTML + "</body></html>";

  //input border 제거
  var h = m_oFormEditor.$('#bodytable').html().replace(/border: currentColor; /g , 'BORDER-TOP:medium none;BORDER-RIGHT:medium none;BORDER-BOTTOM:medium none;BORDER-LEFT:medium none;')


  sBodyHTML += "</style></head><body topmargin='0' leftmargin='0' scroll='auto' align='center'>" + h + "</body></html>";




  var oXMLHTTP = CreateXmlHttpRequest();
  var sz = "<request><context_body><![CDATA["+sBodyHTML+"]]></context_body><comment><![CDATA["+""+"]]></comment><filename><![CDATA["+getInfo("DOC_NO")+"]]></filename><fiid>"+getInfo("fiid")+"</fiid><url><![CDATA[http://"+window.location.host+"]]></url><fmnm><![CDATA["+getInfo("fmnm")+"]]></fmnm></request>";
  document.frPCSAVE.action = "../../common/FileAttach/PCSaveToMHT.aspx";//"../Portal/PCSaveToMHT.aspx";					
  document.frPCSAVE.target = "frAttachFiles";
  document.frPCSAVE.txtHTML.value = sz;
  document.frPCSAVE.submit();
  //다시 올려주기
  parent.editor.bDisplayOnly = false;
  parent.editor.bPresenceView = true;
  parent.editor.G_displaySpnAttInfo(false);
  parent.editor.initApvList();
  
}
function getStyle(sURL) {
    var oHttp = CreateXmlHttpRequest();
    oHttp.open("GET", sURL, false);
    oHttp.send();
    if (oHttp.status >= 400) {
        //throw new Error(oHttp.status, sURL + "을 여는 도중 오류가 발생하였습니다.\n" + oHttp.statusText);
        return "";
    } else {
        var sStyle = oHttp.responseText;
        return sStyle;
    }
}

// 수신부서 부서완료함에서 회신을 했는지 확인(회신버튼 클릭시) : 2008.08.08 백승찬 대리
function checkReturnForm()
{
    var pXML = "usp_wf_ReturnFormCheck";
    var aXML ="<param><name>reserved1</name><type>varchar</type><length>34</length><value><![CDATA["+getInfo("fiid")+"]]></value></param>";
    var connectionname = "INST_ConnectionString";
    
    var sXML = "<Items><connectionname>"+connectionname+"</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;

    var szURL = "../getXMLQuery.aspx";
    
    requestHTTP("POST",szURL,false,"text/xml; charset=utf-8",receiveHTTPReturnForm, sXML);
}

function receiveHTTPReturnForm(){ 
    if(m_xmlHTTP.readyState==4)
    {
		m_xmlHTTP.onreadystatechange=event_noop;
		var xmlReturn=m_xmlHTTP.responseXML;
		
		if(xmlReturn.xml==""){
			bCompensate=true;
			sParam=null;
		}else{
		    var elmlist = xmlReturn.selectSingleNode("response/NewDataSet/Table/CNT");
		    
		    var iCount  = elmlist.text;
		    
		    if(iCount > 0){
		        bReturnForm = false;
		    }
		    else{
		        bReturnForm = true;
		    } 
		}
	}
}	

//합의부서 시작
function requestProcessDCooAbort(szOUs){
	try{
	    var sTargetURL = "../InstMgr/DeleteAssistOUs.aspx";
        var sText = "<request>"+getDefaultXML()+szOUs+"</request>";
        evalXML(sText);							

        requestHTTP("POST",sTargetURL,false,"text/xml",receiveHTTP,sText);
	}catch(e){
		alert(gMessage73 + "\n"+e.description + "\nError number: " + e.number); //sMsgTitle+"하지 못했습니다.
	}
}


/* 날짜 가감 함수 
사용예 : 2009-01-01 에 3 일 더하기 ==> addDate("d", 3, "2009-01-01", "-");*/
function addDate(pInterval, pAddVal, pYyyymmdd, pDelimiter)
{
    var yyyy;
    var mm;
    var dd;
    var cDate;
    var oDate;
    var cYear, cMonth, cDay;

    if (pDelimiter != "") {
        pYyyymmdd = pYyyymmdd.replace(eval("/\\" + pDelimiter + "/g"), "");
    }

    yyyy = pYyyymmdd.substr(0, 4);
    mm  = pYyyymmdd.substr(4, 2);
    dd  = pYyyymmdd.substr(6, 2);

    if (pInterval == "yyyy") {
        yyyy = (yyyy * 1) + (pAddVal * 1); 
    } else if (pInterval == "m") {
        mm  = (mm * 1) + (pAddVal * 1);
    } else if (pInterval == "d") {
        dd  = (dd * 1) + (pAddVal * 1);
    }

    cDate = new Date(yyyy, mm - 1, dd) // 12월, 31일을 초과하는 입력값에 대해 자동으로 계산된 날짜가 만들어짐.
    cYear = cDate.getFullYear();
    cMonth = cDate.getMonth() + 1;
    cDay = cDate.getDate();

    cMonth = cMonth < 10 ? "0" + cMonth : cMonth;
    cDay = cDay < 10 ? "0" + cDay : cDay;

    if (pDelimiter != "") {
        return cYear + pDelimiter + cMonth + pDelimiter + cDay;
    } else {
        return cYear + cMonth + cDay;
    }
}
/*지정 반송 check*/
function fn_checkrejectedtoA() {    
    var m_oApvList = CreateXmlDocument();//new ActiveXObject("MSXML2.DOMDocument")
    m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+document.getElementsByName("APVLIST")[0].value);

	var oApprovedSteps ;
	if ( getInfo("mode") == "RECAPPROVAL"){ ///ou[taskinfo/@status='pending']/person[taskinfo/@kind='normal' and taskinfo/@status='inactive']
		oApprovedSteps = m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed')]");
	}else if ( getInfo("mode") == "SUBAPPROVAL"){ ///ou[taskinfo/@status='pending']/person[taskinfo/@kind='normal' and taskinfo/@status='inactive']
        //oApprovedSteps = m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[taskinfo/@status='pending']/ou[taskinfo/@status='pending' and taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']/person[taskinfo/@kind!='review' and taskinfo/@kind!='bypass'  and taskinfo/@kind!='skip' and taskinfo/@kind!='conveyance' and (taskinfo/@status='completed')]");
        // 부서합의 시 지정결재선 버튼 나오지 않도록 수정
        oApprovedSteps = m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[taskinfo/@status='pending' and unittype != 'ou']/ou[taskinfo/@status='pending' and taskinfo/@piid='" + getInfo("piid").toUpperCase() + "']/person[taskinfo/@kind!='review' and taskinfo/@kind!='bypass'  and taskinfo/@kind!='skip' and taskinfo/@kind!='conveyance' and (taskinfo/@status='completed')]");
	}else{
		oApprovedSteps = m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed')]");
	}

	if ( getInfo("scRJTO") == "1"  && getInfo("scRJTOV") != "" ){
		var iRJCnt =0;
		var oRJSteps;
		if ( getInfo("mode") == "RECAPPROVAL"){
			oRJSteps= m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@rejectee='y']");
		}else if ( getInfo("mode") == "SUBAPPROVAL"){
		    if(!this.agent.msie){
			    oRJSteps= m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='consult']/ou[taskinfo/@status='pending'  and taskinfo/@piid='" +getInfo("piid").toUpperCase()  + "']/*[name()='person' or name()='role'][taskinfo/@rejectee='y']");
			}else{
			    oRJSteps= m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='consult']/ou[taskinfo/@status='pending'  and taskinfo/@piid='" +getInfo("piid").toUpperCase()  + "']/(person|role)[taskinfo/@rejectee='y']");
			}
		}else{
			oRJSteps= m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@rejectee='y']");
		}
		
		iRJCnt = oRJSteps.length;
		if ( iRJCnt >= parseInt(getInfo("scRJTOV"))){
			return false;
		}
	}
	if ( oApprovedSteps.length == 0 ){
		return false;
	}else{
		var iApvCNT = 0;
		var szCode = "";
		var szName = "";
		for(var i=0;i < oApprovedSteps.length ; i++){
			var oStep = oApprovedSteps.nextNode();
			var oTaskInfo;
			if (oStep.getAttribute("allottype") != "parallel"){
			if ( getInfo("mode") == "RECAPPROVAL"){
			    if(!this.agent.msie){
				    oTaskInfo= oStep.selectSingleNode("ou/*[name()='person' or name()='role']/taskinfo[@kind!='conveyance']");
				}else{
				    oTaskInfo= oStep.selectSingleNode("ou/(person|role)/taskinfo[@kind!='conveyance']");
				}
			}else if ( getInfo("mode") == "SUBAPPROVAL"){
				oTaskInfo= oStep.selectSingleNode("taskinfo");
			}else{
			    if(!this.agent.msie){
				    oTaskInfo= oStep.selectSingleNode("ou/*[name()='person' or name()='role']/taskinfo[@kind!='conveyance']");
			    }else{
				    oTaskInfo= oStep.selectSingleNode("ou/(person|role)/taskinfo[@kind!='conveyance']");
				}
			}
			if ( oTaskInfo.getAttribute("rejectee") != 'y'){
				iApvCNT++;
				szCode = oTaskInfo.parentNode.getAttribute("wiid");
				szName = oTaskInfo.parentNode.getAttribute("name");
			}
			}
		}
		if ( iApvCNT > 0 ){
		    return true;
		}else{
			return false;
		}
	}
}
function getLngLabel(szLngLabel, szType, szSplit) {
    if (szSplit == undefined)
        szSplit = ";";
    var rtnValue = "";
    var idxlng = gLngIdx;
    if(szType){idxlng++;}
    var ary = szLngLabel.split(";");
    if(szSplit){ary = szLngLabel.split(szSplit);}
    if(ary.length > idxlng){
        rtnValue = ary[idxlng];
    }else{
        if(szType){rtnValue = ary[1];}
        else{rtnValue = ary[0];}
    }
    return rtnValue;
}
/*feedback 추가*/
function chk_feedback_onclick(){	
    document.getElementById("chk_feedback").checked = (document.getElementById("chk_feedback").checked == true )?false:true;		
	document.getElementById("chk_feedback").value = (document.getElementById("chk_feedback").checked == true )?"1":"0";	
    m_oFormEditor.document.getElementsByName("DOC_SUMMARY")[0].value = "feedback:"+document.getElementById("chk_feedback").value  + "@" + document.getElementById("selfeedback").value;
}
function selfeedback_onchange(value){
    m_oFormEditor.document.getElementsByName("DOC_SUMMARY")[0].value = "feedback:"+document.getElementById("chk_feedback").value  + "@" + value;
}

var igCEPSCnt = 0;//이준희(2010-12-15): 이하, SharePoint 환경을 지원하기 위해 추가함.
var igCEPSFrmnuTmr = 0, igCEPSFrmnuItv = 512, igCEPSTmrExpr = 0;
var sgCEPSBdyPrv = '', sgCEPSBdyAll = '', sgCEPSBdyPub = '';
var wgCEPSBas = null;

fnCEPSFrmnu();

function fnCEPSFrmnu()
{
	try
	{//alert(top.opener.parent.frames.length);
		wgCEPSBas = top.opener.parent;//Preserve the channel to the base window
	}
	catch(e)
	{//return;
	}//;alert(wgCEPSBas.CEPD.ID);return;
	try
	{//if((wgCEPSBas.CEPD.ID == null || wgCEPSBas.CEPD.ID == '') && window.location.toString().indexOf('/cOvIwEb/apprOvAl/fOrms/') == -1)
		if(window.location.toString().indexOf('/cOvIwEb/ApprOvAl/fOrms/') == -1 && (wgCEPSBas.CEPD.ID == null || wgCEPSBas.CEPD.ID == ''))
		{//No SharePoin URI to process here.
			return;
		}
	}
	catch(e)
	{
		return;
	}
	igCEPSFrmnuTmr = window.setInterval('fnCEPSFrmnuItv()', igCEPSFrmnuItv);
	if(getInfo('mode') == 'DRAFT' && window.onunload == null)
	{
		window.onunload = fnCEPSFrmnuOnunload;
	}
}

function fnCEPSFrmnuOnunload()
{//Clean the HTML file for the item body.
	var sPst = '', sResp = '', sTmp = '';
	var ele = null;
	var xhp = null;
	try
	{
		if(m_sReqMode == 'DRAFT')
		{//Submitted; later, add a case when an error occurred during the draft process.
			return;
		}//;debugger;//Not submitted
		xhp = fnCEPSXhp();
		xhp.open('POST', '/CEPS/Fifo/Fifo.ashx', false);//xhp.setRequestHeader('Content-Type', 'application/json');
		xhp.send('CEPSMod!Dcr^CEPSVal!' + wgCEPSBas.CEPD.BdyKey);
	}
	catch(e)
	{
		;
	}
}

function fnCEPSFrmnuItv()
{//top.document.title += '|';
	var bCEPDEx = false;
	var i = 0, iW = 0, iTmp = 0;
	var sFol = '', sHtm = '', sResp = '', sTmp = '';
	var asPri = new Array(), asTmp = new Array();
	var doc = null, dv = null, tbl = null;
	var rect = null;
	var xhp = null;
	try
	{//debugger;
		doc = parent.frames[1].document;
		tbl = doc.getElementById('bodycontext');
		rect = tbl.getBoundingClientRect();
		iW = rect.right - rect.left;
		tbl = tbl.nextSibling;
		iTmp = tbl.offsetWidth;
	}
	catch(e)
	{
		return;
	}
	window.clearInterval(igCEPSFrmnuTmr);
	try
	{//이준희(2011-03-08): Added to apply the authentication expiration policy.//debugger;//alert(top.opener.window.sessionStorage.getItem('CEPSActivity'));
		//top.document.title += '0{';
		wgCEPSBas.fnCEPSActivityChk(top.frames[1]);
		//top.document.title += '}0';//alert(window.sessionStorage.getItem('CEPSActivity'));
	}
	catch(e)
	{
	}
	dv = doc.createElement('DIV');//tbl.style.border = 'solid 1px red';dv.style.border = 'solid 1px red';//$$
	dv.id = 'dvCEPSUriWrp';
	tbl.parentNode.insertBefore(dv, tbl);
	if(window.location.toString().indexOf('/cOvIwEb/ApprOvAl/fOrms/') > -1)
	{//Triggered from CEPS Agent
		try
		{
			igCEPSFrmnuTmr = window.setInterval('fnCEPSWflBdyExtr("TRG")', igCEPSFrmnuItv);//결재문서 본문 프레임의 스크립트 완료를 대기함.
		}
		catch(e)
		{
			return;
		}
		return;
	}
	dv.style.textAlign = 'center';
	dv.style.width = '100%';//dv.style.width = iW.toString() + 'px';//dv.style.border = 'solid 1px red';//$$
	dv.style.border = 'none';//dv.style.border = 'solid 1px red';
	dv.style.overflowY = 'hidden';
	iH = 1;//480
	sHtm += '<input id="mField" type="hidden" name="CEPSUriBdy" value=""/>';//Body key, actually
	sHtm += '<input id="mField" type="hidden" name="CEPSUriFrmDsp" value="' + wgCEPSBas.CEPD.FrmDsp + '"/>';
	sHtm += '<input id="mField" type="hidden" name="CEPSUriID" value="' + wgCEPSBas.CEPD.ID + '"/>';
	sHtm += '<input id="mField" type="hidden" name="CEPSUriIte" value="' + wgCEPSBas.CEPD.Uri + '"/>';
	sHtm += '<iframe id="ifrCEPDIte" ';//debugger;
	sHtm += 'src="';
	if(getInfo('mode') == 'COMPLETE')
	{//For a completed CoviFlow document.
		try//xhp = CreateXmlHttpRequest();
		{//Check whether CEPD document has been complete and exists
			xhp = fnCEPSXhp();//xhp.open('GET', parent.sgCEPSUriAbstRot + 'UriEx?sPID=' + getInfo('PROCESS_ID'), false);
		}
		catch(e)
		{
		}
		try
		{
			xhp.open('POST', '/CEPS/Fifo/Fifo.ashx', false);
			xhp.send('CEPSMod!Bex^CEPSVal!' + getInfo('PROCESS_ID'));
			try
			{
				sResp = xhp.responseText;//alert(sResp);//$$For IE 9//sResp = sResp.substring(0, sResp.length - 1);alert(sResp);
				asTmp = sResp.split('_-_');
				sFol = asTmp[1];
				asTmp = asTmp[0].split('|');//asTmp = sResp.split('|');
			}
			catch(e)
			{
			}
			if(asTmp.length > 0)
			{
				bCEPDEx = true;
			}
		}
		catch(e)
		{
		}//dv.style.height = '128px';//$$
	}
	if(bCEPDEx)
	{//CEPD document prepared.
		sTmp = '';
		asPri = '||'.split('|');//Null handling.
		for(i = 0; i < asTmp.length - 1; i++)
		{
			if(asTmp[i] == 'MHT')
			{//Web archive format supported
				if(navigator.userAgent.indexOf('MSIE') > -1)
				{//Browser is Internet Explorer; the highest priority.//sTmp = parent.sgCEPSUrlRot + 'CEPS/Snd/Mht.aspx?PID=' + getInfo('PROCESS_ID');
					asPri[0] = '/CEPS/Snd/Mht.aspx?PID=' + getInfo('PROCESS_ID') + '&Fol=' + encodeURIComponent(sFol);//asPri[0] = '/CEPS/Snd/Mht.aspx?PID=' + getInfo('PROCESS_ID');
					break;
				}
			}
			else
			{
				if(asTmp[i] == 'PDF')
				{					
					asPri[1] = '/Rec/Records/' + getInfo('PROCESS_ID') + '/Item_Body.pdf';
				}
				else
				{
					asPri[2] = '/Rec/Records/' + getInfo('PROCESS_ID') + '/Item_Body.xps';
				}
			}
		}
		for(i = 0; i < asPri.length; i++)
		{
			if(asPri[i] != '')
			{
				sTmp = asPri[i];
				break;
			}
		}
	}
	else
	{/*[wgCEPSBas.CEPD] is generated by
		During draft: CEPSOvr.js
		On reading: Form.aspx.cs 
		*/
		sTmp = wgCEPSBas.CEPD.FrmDsp + '&IsDlg=1&ID=' + wgCEPSBas.CEPD.ID;
	}
	sHtm += sTmp;
	sHtm += '" frameBorder="0" style="';
	sHtm += 'border: none; ';//sHtm += 'border: solid 1px red; ';//$$
	sHtm += 'width: ' + iW.toString() + 'px; ';//sHtm += 'height: ' + iH.toString() + 'px; ';
	sHtm += 'height: 100%; ';
	sHtm += 'margin: 0px; padding: 0px; text-align: center; overflow: hidden;">';
	sHtm += '</iframe>';//sHtm += '</div>';//sHtm += '<input id="mField" type="hidden" name="dvCEPSUri" value="' + sTmp + '"/>';
	dv.innerHTML = sHtm;
	iTmp = wgCEPSBas.CEPD.FrmDsp.indexOf('&H=');
	if(iTmp == -1)
	{
		igCEPSFrmnuTmr = window.setInterval('fnCEPSFrmnuItvH()', igCEPSFrmnuItv);
	}
	else
	{//Height already recorded
		if(bCEPDEx)//if(getInfo('mode') == 'COMPLETE')
		{//CEPD document prepared.
			igCEPSFrmnuTmr = window.setInterval('fnCEPSWflBdyExtr("LNK")', igCEPSFrmnuItv);//Display CEPD link, first.
		}
		else
		{
			dv.style.height = wgCEPSBas.CEPD.FrmDsp.split('&H=')[1] + 'px';
		}
	}
}

function fnCEPSWflBdyExtr(sMod)
{
	var i = 0;
	var sHtm = '', sTmp = '';
	var dv = null, ele = null;
	var atd = new Array();
	var doc = null;
	try
	{
		doc = parent.frames[1].document;
		sHtm = doc.documentElement.outerHTML;
	}
	catch(e)
	{
		return;
	}
	if(sgCEPSBdyPrv == sHtm)
	{
		igCEPSCnt++;
	}
	else
	{
		sgCEPSBdyPrv = sHtm;
	}
	if(igCEPSCnt < 1)//2
	{
		return;
	}
	window.clearInterval(igCEPSFrmnuTmr);
	switch(sMod)
	{
		case 'LNK'://Display the CEPD link.
			atd = doc.getElementById('headtable').getElementsByTagName('TD');
			for(i = 0; i < atd.length; i++)
			{
				if(atd[i].name == 'DOC_NO')
				{
					break;
				}
			}
			if(atd[i].name == null)
			{//Not found
				return;
			}
			sTmp = getInfo('PROCESS_ID');
			sHtm = atd[i].innerHTML;
			sHtm += '<br />';
			sHtm += '<a href="javascript: void(0);" onclick="parent.frames[0].fnCEPSFrmnuCepd(this);"><img src="/_Layouts/Images/CEPS/CEPD.ico" align="absmiddle" style="border: none;" /><span>' + sTmp + '</span></a>';
			atd[i].innerHTML = sHtm;//debugger;
			if(parent.frames[1].document.getElementById('ifrCEPDIte').src.indexOf('/Mht.aspx') > -1)
			{//MHT body has been loaded
				igCEPSCnt = 0;
				sgCEPSBdyPrv = '0';
				igCEPSFrmnuTmr = window.setInterval('fnCEPSFrmnuItvHMht()', igCEPSFrmnuItv);//Measure and set the height of MHT page.
			}
			break;
		case 'TRG'://Triggered from CEPS Agent
			fnCEPSHtmCraft(doc);
			dv = doc.getElementById('dvCEPSUriWrp');
			ele = doc.createElement('INPUT');
			ele.id = 'hdCEPSUriBdy';
			ele.type = 'hidden';
			dv.appendChild(ele);//alert(sgCEPSBdyAll);
			ele.value = sgCEPSBdyAll;//The whold body
			/*ele = doc.createElement('INPUT');
			ele.id = 'hdCEPSUriBdyPub';
			ele.type = 'hidden';
			dv.appendChild(ele);
			ele.value = sgCEPSBdyPub;//For public document standard*/
			top.document.title = 'CEPSCompl';//parent.frames[3].location = parent.sgCEPSUrlRot + 'CEPS/Dum/Dum.htm'
			parent.frames[3].location = '/CEPS/Dum/Dum.htm';//Raise a [DocumentCompleted] event.
			window.setTimeout('try{parent.frames[3].location = "/CEPS/Dum/Dum.htm";}catch(e){};', 1024);
			break;
		default:
			break;
	}
}

function fnCEPSFrmnuCepd(ele)
{//이준희(2011-01-03): Added a function that runs when CEPD link is clicked within a CoviFlow document.
	var sTmp = '';
	var w = null;
	w = parent.opener.parent;
	sTmp = '/' + ele.childNodes[1].innerHTML + '.cepd';
	//w.frames[w.frames.length - 1].location = parent.sgCEPSUrlRot + 'CEPS/Dum/Dum.htm?CEPSMod=Wop&Dst=' + encodeURIComponent(sTmp);
	wgCEPSBas.window.open(sTmp, 'newtab', '');

	parent.opener = opener;
	parent.close();
	
	//w.open(sTmp, 'newtab', '');//Not working cross-domain
	/*fnCEPSCloseWrp = function(window)
	{
		w.fnCEPSClose(window);
	}*/
	/*sTmp = w.fnCEPSClose.toString();//+ ';fnCEPSClose(null)';
	sTmp = sTmp.substring(sTmp.indexOf('{'));
	sTmp = 'fnCEPSCloseWrp = function(window)' + sTmp;
	sTmp += 'debugger; ';
	sTmp += ';fnCEPSCloseWrp(window)';*/
	//window.setTimeout(sTmp, 1);//sTmp = ele.innerHTML;
	//window.setTimeout(sTmp, 1);//fnCEPSCloseWrp(window);
	//w.window.open(sTmp, w.name, '');//w.open(sTmp, w.name, '');//w.window.open(sTmp, w.name, '');
	//w.open(sTmp, '_newtab', '');//w.window.open(sTmp, w.name, '');//sTmp = ele.childNodes[0].innerHTML;
}

function fnCEPSFrmnuItvH()
{//top.document.title += '|||';//이준희(2011-01-03): Added a function to get the height of display form for a SharePoint item.
	var iH = 0;
	var sResp = '';
	var asTmp = new Array();
	var ele = null;
	try
	{
		iH = wgCEPSBas.CEPD.H;//$$
	}
	catch(e)
	{
		return;
	}
	if(!(iH > 0))
	{
		return;
	}
	if(iH > 1024)
	{//Set the maximum.
		iH = 1024;
	}
	window.clearInterval(igCEPSFrmnuTmr);
	ele = parent.frames[1].document.getElementById('dvCEPSUriWrp');
	ele.style.height = iH.toString() + 'px';
	ele.childNodes[1].value += '&H=' + iH.toString();
	igCEPSFrmnuTmr = window.setInterval('fnCEPSFrmnuItvBdy()', igCEPSFrmnuItv);
}

function fnCEPSFrmnuItvHMht()
{////이준희(2011-01-03): Added a function to measure the height of MHT page.
	var iH = 0, iHPrv = 0;
	var doc = null;
	try
	{
		doc = parent.frames[1].document.getElementById('ifrCEPDIte').contentDocument;//alert(doc);
		iHPrv = parseInt(sgCEPSBdyPrv);//top.document.title += iHPrv.toString();
		iH = doc.body.scrollHeight;//top.document.title += iH.toString();
		if(iH == iHPrv)
		{
			igCEPSCnt++;
		}
		if(igCEPSCnt < 2)
		{
			sgCEPSBdyPrv = iH.toString();
			return;
		}
	}
	catch(e)
	{
		return;
	}
	window.clearInterval(igCEPSFrmnuTmr);
	parent.frames[1].document.getElementById('dvCEPSUriWrp').style.height = iH.toString() + 'px';
}

function fnCEPSFrmnuItvBdy()
{//top.document.title += '|';
	var i = 0;
	var sResp = '', sTmp = '';
	var asTmp = new Array();
	var ele = null;
	var xhp = null;
	try
	{
		sResp = wgCEPSBas.CEPD.BdyKey;//alert(sResp);
	}
	catch(e)
	{
		return;
	}
	if(sResp == '')
	{
		return;
	}//;alert(0);
	window.clearInterval(igCEPSFrmnuTmr);
	ele = parent.frames[1].document.getElementById('dvCEPSUriWrp');//sTmp = '<![CDATA[';
	sTmp += sResp;//sTmp += ']]';
	ele.childNodes[0].value = sTmp;
}

function fnCEPSHtmCraft(oDoc)
{//이준희(2009-09-22): 지정된 document의 HTML을 저장에 적합한 형태로 가공한 결과를 반환하는 함수를 추가함.
	var sRet = '';
	var i = 0, iCnt = 0, iEnd = 0, iMid = 0, iSta = 0, iTot = 0;
	var sBdyCtx = '', sOnMDn = '', sRet = '', sTmp = '', sUrlRot = '';
	var ele = null, eleSep = null;
	var oStys = null;
	var asSty = new Array();
	var asAtc = new Array(), asTmp = new Array();
	var aEle = new Array();
	var oReg = null;
	sTmp = window.location.toString().replace('://', ':::');
	sUrlRot = sTmp.substring(0, sTmp.indexOf('/') + 1).replace(':::', '://');

	iCnt = oDoc.scripts.length;//debugger;
	for(i = 0; i < iCnt; i++)
	{//모든 스크립트 블럭들을
		try
		{
			oDoc.scripts[0].outerHTML = '';//삭제함.
		}
		catch(e)
		{
		}
	}//top.opener.fnCOPMRes(oDoc.getElementById('dvCOPMCts'));//다국어 처리를 함; iframe 내에서는 타이밍 이슈로 인해 불완전하게 처리됨.		
	/*iCnt = oDoc.links.length;//debugger;
	for(i = 0; i < iCnt; i++)
	{//모든 <a>들에 대해
		try
		{
			oDoc.links[i].removeAttribute('href');//삭제함.
		}
		catch(e)
		{
		}
	}*///sRet = sRet.replace(/<script/gi, '<COPMDummy');//sRet = sRet.replace(/<\/script/gi, '<\/COPMDummy');
	try
	{//Delete all the hidden fields.
		aEle = oDoc.getElementsByTagName('INPUT');//debugger;
		for(i = 0; i < aEle.length; i++)
		{
			try
			{
				if(aEle[i].type == 'hidden')
				{//aEle[i].parentNode.removeChild(aEle[i]);//top.document.title += '|';
					asTmp.push(aEle[i]);
				}
			}
			catch(e)
			{
			}
		}
		while(ele = asTmp.pop())
		{
			ele.parentNode.removeChild(ele);
		}
		ele = oDoc.getElementById('mField');
		while(ele != null)
		{
			if(ele.style.display == 'none')
			{
				ele.parentNode.removeChild(ele);
			}
			else
			{
				ele.id = '';
			}
			ele = oDoc.getElementById('mField');
			if(ele == null)
			{
				ele = oDoc.getElementById('dField');
			}
			if(ele == null)
			{
				ele = oDoc.getElementById('cField');
			}
			if(ele == null)
			{
				ele = oDoc.getElementById('dhtml_body');
			}
		}
	}
	catch(e)
	{
	}//sRet = sRet.replace(sBdyCtx, 'CEPSPubBdyCtx{' + sBdyCtx + '}CEPSPubBdyCtx');//May fail due to the tag-pair correction of .outerHTML
	ele = oDoc.getElementById('bodycontext');
	eleSep = document.createElement('SPAN');//Separators for public document standard
	eleSep.id = 'spnCEPSPubDocBdySta';
	eleSep.innerHTML = 'spnCEPSPubDocBdySta';
	eleSep.style.display = 'none';
	ele.parentNode.insertBefore(eleSep, ele);
	eleSep = document.createElement('SPAN');
	eleSep.id = 'spnCEPSPubDocBdyEnd';
	eleSep.innerHTML = 'spnCEPSPubDocBdyEnd';
	eleSep.style.display = 'none';
	ele.parentNode.insertBefore(eleSep, ele.nextSibling);

	try
	{//Remove the hierarchy parts of attachments' URLs.
		aEle = oDoc.getElementById('AttFileInfo').getElementsByTagName('A');
		asTmp = new Array();
		for(i = 0; i < aEle.length; i++)
		{//For each binary file
			sTmp = aEle[i].innerHTML;
			if(sTmp.indexOf('>') > -1)
			{//Tag -like <b></>- included
				sTmp = sTmp.split('>')[1].split('<')[0];
			}
			if(sTmp.indexOf('B)') > -1 || sTmp.indexOf('KB)') > -1 || sTmp.indexOf('MB)') > -1)
			{//Later, improve this condition
				sTmp = 'Workflow_' + sTmp.substring(0, sTmp.lastIndexOf(' ('));
			}
			asAtc.push(sTmp);//List the correct -file name only- URIs
			aEle[i].href = sTmp;//debugger;
			asTmp.push(aEle[i].href);//List the wrong URIs
		}
	}
	catch(e)
	{
	}
	sRet = oDoc.documentElement.outerHTML;//debugger;

	sRet = sRet.replace(/<script/gi,				'<SCRIPT');//1: 제거할 태그들의 대소문자를 통일함.
	sRet = sRet.replace(/<\/script/gi,				'<\/SCRIPT');
	sRet = sRet.replace(/text\/css/gi,				'TEXT/CSS');
	sRet = sRet.replace(/<link/gi,					'<LINK');
	sRet = sRet.replace(/\.css/gi,					'\.CSS');
	sRet = sRet.replace(/\/_layouts\/images\//gi,	'\/_LAYOUTS\/IMAGES\/');
	sRet = sRet.replace(/onclick\=/gi,				'ONCLICK=');
	sRet = sRet.replace(/onload\=/gi,				'ONLOAD=');
	sRet = sRet.replace(/href\=\"javascript/gi,		'HREF\=\"JAVASCRIPT');
	sRet = sRet.replace(/\<input/gi,				'<INPUT');//sRet = sRet.replace(/\<image/gi,				'<IMAGE');
	
	iSta = sRet.indexOf('<SCRIPT');//2: 스크립트들을 제거함.
	while(iSta > -1)
	{//;top.document.title += ' |';
		iMid = sRet.indexOf('>', iSta);
		iEnd = sRet.indexOf('\/SCRIPT>', iMid + 1) + 7;
		if(iSta <= iEnd)
		{
			break;
		}
		sRet = fnCEPSRemove(sRet, iSta, iEnd);
		iSta = sRet.indexOf('<SCRIPT');
	}

	iSta = sRet.indexOf('HREF="JAVASCRIPT');//인라인 스크립트 이벤트들을 제거함.
	while(iSta > -1)
	{
		iEnd = sRet.indexOf('"', iSta + 1);
		if(iSta <= iEnd)
		{
			break;
		}
		sRet = fnCEPSRemove(sRet, iSta, iEnd);
		iSta = sRet.indexOf('HREF="JAVASCRIPT');
	}
				
	iSta = 0;//이미지 버튼들을 제거함.
	while(iSta > -1)
	{
		iSta = sRet.indexOf('<INPUT', iSta + 1)
		iEnd = sRet.indexOf('>', iSta);
		if(iSta <= iEnd)
		{
			break;
		}
		sRet = fnCEPSRemove(sRet, iSta, iEnd);
	}//;debugger;

	/*oStys = oDoc.styleSheets;//CSS 파일들임.
	iTot = oStys.length;
	for(i = 0; i < iTot; i++)
	{
		sTmp = oStys[i].cssText;
		asSty[i] = '<style type=text\/css>' + sTmp + '<\/style>';//3: 각 CSS 파일들의 내용을 추출함.
	}
	i = 0;
	iSta = 0;
	while(sRet.indexOf('TEXT\/CSS') > -1 && sRet.indexOf('.CSS') > -1)
	{
		iSta = sRet.indexOf('<LINK', iSta + 1);
		iEnd = sRet.indexOf('>', iSta);
		sTmp = sRet.substring(iSta, iEnd + 1);
		if(sTmp.indexOf('TEXT\/CSS') == -1)
		{
		}
		else
		{//sRet = fnCEPSRemove(sRet, iSta, iEnd);
			sRet = sRet.replace(sTmp, asSty[i++]);//4: CSS 파일들을 인라인 스타일로 대체함.
		}
	}*/

	/*sTmp = sUrlRot + 'GwImages/';//sTmp = sUrlRot + '_layouts/images/';
	oReg = new RegExp(sTmp, 'gi');
	sRet = sRet.replace(oReg, 'BC170B68ACA54961AD0B910EC43EEEB2');
	//sRet = sRet.replace(/\/_LAYOUTS\/IMAGES\//gi,						sUrlRot + '_layouts/images/');//이미지들의 절대 경로를 full-URL로 교체함; 이렇게 해야 이미지가 MHT 파일 내에 인코딩됨.
	sRet = sRet.replace(/\/GWIMAGES\//gi,								sUrlRot + '_layouts/images/');
	sRet = sRet.replace(/BC170B68ACA54961AD0B910EC43EEEB2/gi,			sUrlRot + '_layouts\/images\/');
				
	sRet = sRet.replace(/src\=\"http/gi,								'BC170B68ACA54961AD0B910EC43EEEB2');
	sRet = sRet.replace(/src\=\"/gi,									'src\=\"' + sUrlRot.substring(0, sUrlRot.length - 1));
	sRet = sRet.replace(/BC170B68ACA54961AD0B910EC43EEEB2/gi,			'src\=\"http');*/
				
	sRet = sRet.replace(/href\=\"http/gi,								'BC170B68ACA54961AD0B910EC43EEEB2');//href 경로들을 full-URL로 교체함.
	sRet = sRet.replace(/href\=\"/gi,									'href\=\"' + sUrlRot.substring(0, sUrlRot.length - 1));
	sRet = sRet.replace(/BC170B68ACA54961AD0B910EC43EEEB2/gi,			'href\=\"http');
	try
	{
		sRet = sRet.replace(/onmousedown\=/g, '');
		sOnMDn = 'javascript: var sTmp = \'\'; sTmp = window.location.toString(); sTmp = sTmp.substring(0, sTmp.lastIndexOf(\'/\') + 1); sTmp += \'_-_CEPSFl_-_\'; window.location = sTmp;';
		sTmp = sUrlRot.substring(0, sUrlRot.length - 1);//debugger;
		for(i = 0; i < asTmp.length; i++)
		{//For each binary file//sRet = sRet.replace(sTmp + asAtc[i], asAtc[i]);
			sRet = sRet.replace(sTmp + asAtc[i], sOnMDn.replace('_-_CEPSFl_-_', asAtc[i]));
		}
	}
	catch(e)
	{
	}

	iSta = sRet.indexOf('ONCLICK="');//onclick 이벤트들을 제거함.
	while(iSta > -1)
	{
		iEnd = sRet.indexOf('"', iSta + 1);
		if(iSta <= iEnd)
		{
			break;
		}
		sRet = fnCEPSRemove(sRet, iSta, iEnd);
		iSta = sRet.indexOf('ONCLICK="');
	}
	sRet = sRet.replace(/ONLOAD\=/gi, 'ONKEYUP=');//Discard the all onload() event handlers.
	sgCEPSBdyAll = sRet;
}

function fnCEPSRemove(sSrc, iSta, iEnd)
{//이준희(2009-05-14): 특정 문자열에서, iSta로부터 iEnd까지를 삭제하는 함수를 추가함.
	var sRet = '', sFrnt = '', sRear = '', sClue = '';
	sClue = sSrc.substring(iSta, iEnd + 1);//sFrnt = sSrc.substring(0, iSta);//작동하나, 메모리 사용량이 많은 것으로 보임.
	sRet = sSrc.replace(sClue, '');//sRear = sSrc.substring(iEnd + 1);sRet = sFrnt + sRear;
	return sRet;
}

function fnCEPSXhp()
{//참고로, window.XMLHttpRequest은 연결 실패에 대한 감도가 낮음.
	var i = 0;
	var asVer = [ 
		"MSXML2.XMLHttp.5.0",
		"MSXML2.XMLHttp.4.0",
		"MSXML2.XMLHttp.3.0",
		"MSXML2.XMLHttp",
		"Microsoft.XMLHttp"
	];
	var oXhp = null;
	for(i = 0; i < asVer.length; i++)
	{
		try
		{
			oXhp = new ActiveXObject(asVer[i]);
			return oXhp;
		}
		catch(e)
		{
		}
	}
	if(window.XMLHttpRequest)
	{
		oXhp = new XMLHttpRequest();
		return oXhp;
	}//throw new Error("No XMLhttp");
}

//HR Push

function tongPush(gubun) {
	var nextId = getNextApprover();
    var $iFrm = $('<IFRAME id="iFrm" src="/Coviweb/TongPush.aspx?approveId=' + getInfo("usid") + '&nextId=' + nextId + '&processId=' + getInfo("piid") +'&gubun=' + gubun + '" frameBorder="0" name="iFrm" scrolling="no"></IFRAME>');
	$iFrm.appendTo('body');
	
	/*
    var reqParam = 'userId=' + getNextApprover() + '&subject='+ m_oFormEditor.document.getElementsByName("SUBJECT")[0].value;
    try{
		$.ajax({
			type: "GET",
			async: true,
			url: "/CoviWeb/TongPush.aspx",
			dataType: "html", // xml, html, script, json 미지정시 자동판단
			timeout: 30000, //제한 시간
			cache: false,
			data: reqParam, // $($('form')).serialize()
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			error: function (request, status, error) {
				alert("tongPush error : " + error);
			},
			beforeSend: function () {
			},
			success: function (dataObj) {
			}
		});
	}catch(e){
	}
	*/
}


//다음결재자 찾기
function getNextApprover() {
    var strNextApprover =""; //다음결재자 PERSON_CODE
    var xmldoc;

    var elmRoot = document.getElementsByName("APVLIST")[0].value;
    //alert(document.getElementsByName("APVLIST")[0].value);
    try {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(elmRoot);
    } catch (e) {
        try {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(elmRoot, "text/xml");
        } catch (e) {
            //alert("error : " + e);
        }
    }

    var list = xmlDoc.getElementsByTagName('step');
    try {
        for (var i = 0; i < list.length; i++) {

            if (list[i].attributes.getNamedItem("name").nodeValue != "기안자") { //기안자는 대상에서 제외

                if (list[i].attributes.getNamedItem("unittype").nodeValue == "ou") { //대상이 부서
                    //alert(list[i].firstChild);
                    //alert(list[i].firstChild.nextSibling);
                    //alert(list[i].firstChild.nextSibling.firstChild);
                    if (list[i].firstChild.nextSibling.firstChild.attributes.getNamedItem("status").nodeValue == "inactive") { //결재대상(부서)이면 중단
                        //alert("다음결재가 부서이므로 푸시 대상 없음");
                        strNextApprover = "";
                        i = list.length;
                    }

                } else if (list[i].attributes.getNamedItem("unittype").nodeValue == "person") { //대상자가 개인

                    if (list[i].attributes.getNamedItem("routetype").nodeValue == "approve") { //일반결재

                        if (list[i].firstChild.firstChild.firstChild.attributes.getNamedItem("status").nodeValue == "inactive") { //결재하지 않은 처음대상자를 찾고 중단
                            //alert("다음 일반결재 : " + list[i].firstChild.firstChild.attributes.getNamedItem("code").nodeValue);
                            strNextApprover = list[i].firstChild.firstChild.attributes.getNamedItem("code").nodeValue;
                            i = list.length;
                        }

                    } else if (list[i].attributes.getNamedItem("name").nodeValue == "순차합의") { //개인순차합의

                        if (list[i].firstChild.nextSibling.firstChild.firstChild.attributes.getNamedItem("status").nodeValue == "inactive") { //결재하지 않은 처음대상자를 찾고 중단
                            //alert("다음 개인순차합의 : " + list[i].firstChild.nextSibling.firstChild.attributes.getNamedItem("code").nodeValue);
                            strNextApprover = list[i].firstChild.nextSibling.firstChild.attributes.getNamedItem("code").nodeValue;
                            i = list.length;
                        }

                    }

                }
            }
        }
    } catch (e) {
        //alert("error : " + e.toString);
        return strNextApprover;
    }
    return strNextApprover;
}

