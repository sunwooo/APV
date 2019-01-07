<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApvActBasic.aspx.cs" Inherits="Approval_ApvProcess_ApvActBasic" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title></title>
	<script type="text/javascript" language="javascript" src="../../common/script/CFL.js"></script>
	<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js" ></script>
</head>
<body>

<div class="popup_title">
  <div class="title_tl">
    <div class="title_tr">
      <div class="title_tc">
      <h2><span id="lbl_Action"></span></h2></div>
    </div>
  </div>
</div>
<div style="padding-left: 35px; padding-right: 20px;">
	<!-- 등록 div 시작 -->
	<div class="write">
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tr>
			  <td colspan="2" class="line"></td>
			</tr>
			<tr id="triptPassword" style="display:none;">
			  <td class="title"><%=Resources.Approval.lbl_approvalpwd %></td>
			  <td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><input type="password" class="type-text" id="iptPassword" onKeyPress="if (event.keyCode==13) fn_approval();" style=" width: 150px;" /><span id="spAppName"></span></td>
			</tr>
			<tr id="trlinetPassword" style="display:none;">
			  <td colspan="2" class="line"></td>
			</tr>    
			<tr id="trSignImage" style="display:none;">
			  <td class="title"><%=Resources.Approval.lbl_signtype %></td>
			  <td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><span id="spanRdo" style="display:none;"><input type="radio" value="stamp" name="radSign" id="radSign" onclick="make_select('stamp')"><%=Resources.Approval.lbl_stamp %>					
				<input type="radio" value="sign" name="radSign" id="radSign" onclick="make_select('sign')"><%=Resources.Approval.lbl_sign %>	 				
				<input checked type="radio" value="usnm" name="radSign" id="radSign"  onclick="make_select('usnm')"><%=Resources.Approval.lbl_Name %>	 	</span>	
				<select name="selImage" id="selImage" size="1"  onChange="setImage();" style="width:100%;display:none;">
				</select></td>
			</tr>
			<tr id="trlineSignImage" style="display:none;">
			  <td colspan="2" class="line"></td>
			</tr>
			<tr>
			  <td class="title"><%=Resources.Approval.lbl_comment %><br /><img src="<%=Session["user_thema"] %>/Covi/Common/icon/blank.gif" Name="selectImage" ID="selectImage" border="0" style="width:30px;height:30px" align="absmiddle"></td>
			  <td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><textarea id="txtComment" name="txtComment" style="width: 98%; height: 70px; ime-mode:active;"></textarea></td>
			</tr>
			<!--2011.03.22 시작 -->
			<tr style="display:none;">
			  <td colspan="2" class="line"></td>
			</tr>
			<tr style="display:none;" id="tr_memo">
			    <td class="title"><%=Resources.Approval.lbl_Reason %></td>
			    <td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><textarea id="txtMemo" name="txtMemo" style="width: 98%; height: 30px;"></textarea></td>
			</tr>
			<!--2011.03.22 끝 -->
			<tr>
			  <td colspan="2" class="line"></td>
			</tr>
		  </table>
  </div>
    <!-- 등록 div 끝 -->
</div>
<div class="popup_Btn small" style=" text-align: right; padding-right: 20px;">
      <a href="#" class="Btn04" id="btOK" name="cbBTN" onclick="javascript:fn_approval();"><span id="btn_Action"></span></a>
      <a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:parent.window.close();"><span><%= Resources.Approval.btn_close %></span></a>
</div>	   
</body>
</html>
	<script language="javascript" type="text/javascript">
        var m_oApvList = CreateXmlDocument();
		var m_xmlHTTP = CreateXmlHttpRequest();
		var aSign;
		var aStamp;
		var smode="sign";
		var bAdd = false; //지정반송 반송대상 추가
		var swiid="";//지정반송 대상 wiid
		var sApvName="";
		//var g_UsePWDCheck = "T"; //결재암호 체크System.Web.Configuration.WebConfigurationManager.AppSettings["WF_UsePWDCheck"]
		var g_UsePWDCheck = "<%= g_UsePWDCheck %>";
		var g_UseSignImageCheck = opener.getInfo("scSign"); //서명이미지 사용여부
		var g_width  = 500;
		var g_height = 318;

		window.onload= initOnload;
        function initOnload(){
			if (g_UsePWDCheck == "F" ){
			    document.getElementById("triptPassword").style.display="none";
			    document.getElementById("trlinetPassword").style.display="none";
				document.getElementById("txtComment").style.height = "80px";
			}else{
			    document.getElementById("triptPassword").style.display="";
			    document.getElementById("trlinetPassword").style.display="";
                document.getElementById("iptPassword").focus();
                g_height = g_height + 20;
			 }
			if (g_UseSignImageCheck == "1")
			{
				smode="sign";
				var szURL = "../../common/FileAttach/GetApvImage.aspx";
				requestHTTP("GET",szURL,false,"text/xml",receiveHTTP,null);
			}else{
				//g_height = g_height - 44;  //주석처리 HIW
    			//getComment();
			}
            if(String(m_oFormEditor.location).indexOf("_read.htm") == -1 &&  m_oFormMenu.getInfo("loct") == "APPROVAL" ) //편집 모드
            {
                document.getElementById("tr_memo").style.display="";
                 g_height = g_height+ 30;
            }
            window.resizeTo(600,g_height);
            var sy = window.screen.height / 2 - g_height;// /2 -  20;
            var sx = window.screen.width  / 2 - 600 / 2;
            window.moveTo(sx, sy);
		}
		
		function getComment()
		{
		    bcomment = false;
	        smode = "comment";
            var pXML = " exec dbo.usp_wf_get_comment '" +parent.opener.getInfo("fiid") + "','" +parent.opener.getInfo("usid")+ "','" +parent.opener.getInfo("mode")+ "'";
            
            var sXML = "<Items><connectionname>INST_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
            var szURL = "../getXMLQuery.aspx";
            requestHTTP("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTP, sXML);
		}
		
		function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
			m_xmlHTTP.open(sMethod,sUrl,bAsync);
			//m_xmlHTTP.setRequestHeader("Accept-Language","ko");
			m_xmlHTTP.setRequestHeader( "Content-type", sCType);
			if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
			(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
		}
		function receiveHTTP(){
			if(m_xmlHTTP.readyState==4){			
				m_xmlHTTP.onreadystatechange=event_noop;
				if(m_xmlHTTP.responseText.charAt(0)=='\r'){
					alert(m_xmlHTTP.responseText);
				}else{
				    if(m_xmlHTTP.responseXML!=null){
					    var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
					    if(errorNode!=null){
						    if(errorNode.text.indexOf("<%=Resources.Approval.msg_102 %>") > -1){
							    //alert("결재암호가 틀립니다");
							    alert("<%=Resources.Approval.msg_102 %>");
							    document.getElementById("iptPassword").value="";
						    }else{
							    alert("Desc: " + errorNode.text);
						    }
					    }else
					    {//debugger;
						    if (smode == "sign"){
							    try{
								    var sImage = m_xmlHTTP.responseXML.selectSingleNode("response/item").text
								    var aImage = sImage.split('@');
								    aStamp = aImage[0].split(';');
								    aSign = aImage[1].split(';');
								    if (aImage[0] !=""){
									    radSign[0].checked = true;
								     make_select('stamp');
								    }else if ( aImage[1] != ""){
									    radSign[1].checked = true;
									    make_select('sign');
								    }else{
									    make_select('usnm');
								    }
								    if(document.getElementById("selImage").options.length > 1 && aImage[1] != ""){
								        document.getElementById("selImage").style.display="";
								        document.getElementById("trSignImage").style.display = "";
								        document.getElementById("trlineSignImage").style.display = "";		
								        document.getElementById("selectImage").style.display = "";	
                                        g_height = g_height - 16;		
								    }else{
                                        //g_height = g_height - 42;  //주석처리 HIW
                                    }
							    }catch(e){}
							    getComment();
						    }else if(smode=="password"){
    						    
							    if ( m_xmlHTTP.responseXML.selectSingleNode("response").text == "ok"){
								    //parent.close();
								    if ( m_oFormMenu.getInfo("mode") == "REDRAFT" && m_oFormMenu.getInfo("loct") == "REDRAFT" ){
									    m_oFormMenu.requestProcess("RECREATE");
								    }else{
                                        fn_SaveComment("s");
									    //m_oFormMenu.requestProcess("APPROVE");
								    }
							    }else{
								    alert(m_xmlHTTP.responseXML.selectSingleNode("response").text);
							    }
						    }else if(smode=="comment"){
						        if (m_xmlHTTP.responseXML.selectSingleNode("response/NewDataSet/Table/COMMENT") == null){
						            bcomment = false;
						        }else{
						            //2013-04-16 hyh 수정
                                    //document.getElementById("txtComment").value = m_xmlHTTP.responseXML.selectSingleNode("response/NewDataSet/Table/COMMENT").text;
                                    document.getElementById("txtComment").value = "";
                                    //2013-04-16 hyh 수정 끝
						            bcomment = true;
						        }
						    }
					    }
					}
				}
			}
		}
		
		function event_noop(){return(false);}

		function makeNode(str){
			var oOption = document.createElement("OPTION");	
			document.getElementById("selImage").options.add(oOption);
			oOption.text=str;
			oOption.value=str;	
			return;	
		}
		function make_select(sMode){
			if ( sMode == 'usnm'){
				var intCount = document.getElementById("selImage").options.length;
				for (var i=intCount;i!=0;i--){
					document.getElementById("selImage").options.remove(i-1);			
				}	
				document.getElementById("selectImage").src = "<%=Session["user_thema"] %>/Covi/Common/icon/blank.gif" ;//"../../common/Images/groupware/blank.gif";
			}else{
				(sMode== 'stamp')?make_selImage(aStamp):make_selImage(aSign);
			}
		}
		function make_selImage(aImage){
			var intCount = document.getElementById("selImage").options.length;
			for (var i=intCount;i!=0;i--){
				document.getElementById("selImage").options.remove(i-1);			
			}	
			for(var i=0;i<aImage.length;i++){
				makeNode(aImage[i]);
			}
			if ( aImage.length > 0 ){ document.getElementById("selImage").options[0].selected = true;setImage();}
			return;
		}
		function setImage(){
			var sName = document.getElementById("selImage").value;
			var sUPUrl = "/GWstorage/e-sign/ApprovalSign/";
			if(sName ==""){
			    selectImage.src = "<%=Session["user_thema"] %>/Covi/Common/icon/no_img.gif" ;
			}else{
			    selectImage.src = sUPUrl + sName;
			}
		}
		var bcomment = false;
		</script>
<script language="javascript" type="text/javascript">
var m_oFormMenu = opener;
var m_oFormEditor = opener.parent.editor;
var gMessage63 = "<%= Resources.Approval.msg_063 %>";			

var sACTIONINDEX= m_oFormMenu.document.getElementsByName("ACTIONINDEX")[0].value;
m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+m_oFormMenu.document.getElementsByName("APVLIST")[0].value);

switch(sACTIONINDEX){
	case "approve": //승인
		if (m_oFormMenu.getInfo("pfsk") == "T009" || m_oFormMenu.getInfo("pfsk") == "T004") {
			//거부화면 용어 반려로 나옴 bugFix. hichang
			document.getElementById("lbl_Action").innerHTML = "<%= Resources.Approval.lbl_holdcomment_03 %>";
			document.getElementById("btn_Action").innerHTML = "<%= Resources.Approval.btn_confirm_agree_1 %>";
		}
		//20110317 확인결재추가 시작
		else if(m_oFormMenu.getInfo("pfsk") == "T019"){
			document.getElementById("lbl_Action").innerHTML = "<%= Resources.Approval.lbl_confirmcomment_01 %>";
			document.getElementById("btn_Action").innerHTML = "<%= Resources.Approval.btn_confirm_confirm %>";
		}
		else {
			document.getElementById("lbl_Action").innerHTML = "<%= Resources.Approval.lbl_approvecomment_01 %>";
			document.getElementById("btn_Action").innerHTML = "<%= Resources.Approval.btn_confirm_approve %>";
		}
		break;
	case "reject": //반려
		if (m_oFormMenu.getInfo("pfsk") == "T009" || m_oFormMenu.getInfo("pfsk") == "T004") {
			//거부화면 용어 반려로 나옴 bugFix. hichang
			document.getElementById("lbl_Action").innerHTML = "<%= Resources.Approval.lbl_holdcomment_02 %>";
			document.getElementById("btn_Action").innerHTML = "<%= Resources.Approval.btn_confirm_reject_1 %>";
		}
		else {
		document.getElementById("lbl_Action").innerHTML = "<%= Resources.Approval.lbl_rejectcomment_01 %>";
		document.getElementById("btn_Action").innerHTML = "<%= Resources.Approval.btn_confirm_reject %>";
		}
break;
case "reject2": //반려
    if (m_oFormMenu.getInfo("pfsk") == "T009" || m_oFormMenu.getInfo("pfsk") == "T004") {
        //거부화면 용어 반려로 나옴 bugFix. hichang
        document.getElementById("lbl_Action").innerHTML = "<%= Resources.Approval.lbl_holdcomment_02 %>";
        document.getElementById("btn_Action").innerHTML = "<%= Resources.Approval.btn_confirm_reject_1 %>";
    }
    else {
        document.getElementById("lbl_Action").innerHTML = "<%= Resources.Approval.lbl_rejectcomment_01 %>";
        document.getElementById("btn_Action").innerHTML = "<%= Resources.Approval.btn_confirm_reject %>";
    }
    break;
	case "rejectedto":
        document.getElementById("lbl_Action").innerHTML= "<%= Resources.Approval.lbl_rejectcomment_01 %>";
        document.getElementById("btn_Action").innerHTML ="<%= Resources.Approval.btn_confirm_reject %>";
        if ( swiid == "" ){ fn_checkrejectedto();}
        break;
    case "rejectedtodept":
        document.getElementById("lbl_Action").innerHTML= "문서를 부서내 반송합니다.";
        document.getElementById("btn_Action").innerHTML ="<%= Resources.Approval.btn_rejectedtodept %>";
        break;
    case "reserve":
        document.getElementById("lbl_Action").innerHTML= "<%= Resources.Approval.lbl_holdcomment_01 %>";
        document.getElementById("btn_Action").innerHTML ="<%= Resources.Approval.btn_confirm_hold %>";
        break;
    default:
        document.getElementById("lbl_Action").innerHTML= "<%= Resources.Approval.lbl_approvecomment_01 %>";
        document.getElementById("btn_Action").innerHTML ="<%= Resources.Approval.btn_confirm_approve %>";
        break;
    }

function checkCommentLength(){
	if(document.getElementById("txtComment").value.length>201){
		document.getElementById("txtComment").innerText=document.getElementById("txtComment").value.substring(0,201);
		return false;
	}else
		return true;
}

function getInfo(sKey){try{return m_oFormMenu.g_dicFormInfo.item(sKey);}catch(e){alert(gMessage61);}} //alert("양식정보에 없는 키값["+sKey+"]입니다."

function fn_approval() {
	var i,choice,comment, blastapprove,signimagetype; 		
   
    
//	// 종류 선택 찾기(결재, 보류, 반려인지 확인해서 index 에 값 저장
//	for(i=0;i<radAction.length;i++){if(radAction[i].checked){choice=radAction[i].value;break;}}
//  UI변경으로 인해 radio 버튼 사라짐 --> 변경함
    choice =sACTIONINDEX;
  
  
	if (choice=="rejectedto" && bAdd == false){
		if ( swiid == "" ){ 
			fn_checkrejectedto();
			//alert("반송시킬 대상을 지정하십시요.");
			return;
		}else{
			setRJTApvList();
		}
	}
	if(choice=="reserve" && !(fn_checkrereserve())){
		return;
	}
	//2013-10-07 hyh 수정
    //if ((sACTIONINDEX!="approve" && sACTIONINDEX!="rejectedtodept") && document.getElementById("txtComment").value==""){
    if ((sACTIONINDEX != "approve") && document.getElementById("txtComment").value == "") {
    //2013-10-07 hyh 수정 끝
		alert("<%=Resources.Approval.msg_064 %>");
		return;
    }
    if (String(m_oFormEditor.location).indexOf("_read.htm") == -1 && m_oFormMenu.getInfo("loct") == "APPROVAL" && document.getElementById("tr_memo").style.display == "") //편집 모드
    {
        if (document.getElementById("txtMemo").value == "") {
            alert("변경 사유를 입력하세요");
            return;
        }
    }
    // 의견 저장
    //fn_SaveComment('s');
	
	// 직인 이미지
	var aradSign =  document.getElementsByName("radSign");
	for(i=0;i<aradSign.length;i++){if(aradSign[i].checked){signimagetype=aradSign[i].value;break;}}
	if ( signimagetype !='usnm' && document.getElementById("selImage").value == ''){
		alert("<%=Resources.Approval.msg_150 %>");// '인장 혹은 서명 이미지를 선택하십시요.'
		return;
	}else{signimagetype = (signimagetype=='usnm')?"":document.getElementById("selImage").value;}
	//signimagetype = "";
	//결재선 확인은 결재선 관리에서 수행한다.
	m_oFormMenu.document.getElementsByName("PASSWORD")[0].value = document.getElementById("iptPassword").value;
	m_oFormMenu.document.getElementsByName("ACTIONINDEX")[0].value = choice;
	m_oFormMenu.document.getElementsByName("ACTIONCOMMENT")[0].value = document.getElementById("txtComment").value;
	m_oFormMenu.document.getElementsByName("SIGNIMAGETYPE")[0].value = signimagetype;
	m_oFormEditor.Modify_Comment = document.getElementById("txtMemo").value;
	blastapprove =  fn_lastapproval();
	m_oFormMenu.document.getElementsByName("bLASTAPPROVER")[0].value = blastapprove;
	var sAddage = m_oFormMenu.makeNode("usid") + m_oFormMenu.makeNode("actpwd",m_oFormMenu.document.getElementsByName("PASSWORD")[0].value,null,true)
	var sText = "<request>"+sAddage+"</request>";

	m_oFormMenu.evalXML(sText);
	//결재암호 체크 여부 확인
	if ( g_UsePWDCheck == "T"){
	    m_oFormMenu.focus();    //부모창으로 포커스 이동
		var sTargetURL = "getProcessBizData.aspx";
		smode="password";
		requestHTTP("POST",sTargetURL,true,"text/xml",receiveHTTP,sText);
	}else{
		//parent.close();
		m_oFormMenu.focus();    //부모창으로 포커스 이동
		if (m_oFormMenu.getInfo("mode") == "REDRAFT" && m_oFormMenu.getInfo("loct") == "REDRAFT") {
		    m_oFormMenu.requestProcess("RECREATE");
		} else {
		    //2011.03.22
		    fn_SaveComment("s");
		    //m_oFormMenu.requestProcess("APPROVE");
		}
	}
}

//조용욱(2010-11-16):변경된 저장함수, InkComment 저장경로 추가, 실행흐름 조절
function fn_SaveComment(sCall) {
    var blastapprove = fn_lastapproval();
    var sKind = "";
    var sItems = "<request>";
    var sUrl = "../Comment/comment_apv.aspx";
    // 추가변수
    var bReady = false;
    var strDate = fnCOPMNow();
    var objXaml = opener.parent.frames[1].document.getElementById('silverObjInkWrite');

    if (blastapprove == "true") {
        sKind = "lastapprove";
    } else if (opener.getInfo("mode") == "REDRAFT") {
        sKind = "initiator";
    } else { sKind = "approve"; }

    //20130911 hyh 수정
    /*
    sItems += "<call>" + sCall + "</call>"
                + "<fiid>" + parent.opener.getInfo("fiid") + "</fiid>"
                + "<userid>" + parent.opener.getInfo("usid") + "</userid>"
                + "<username><![CDATA[" + parent.opener.getInfo("usdn") + "]]></username>"
                + "<kind>" + sKind + "</kind>"
                + "<mode>" + parent.opener.getInfo("mode") + "</mode>"
                + "<comment><![CDATA[" + txtComment.value + "]]></comment>"
                + "<save_path>";
    sItems += "</save_path></request>";
    */
    
    //var approver = "이한일 차장";
    //var datecommented = "2013-09-10";
    
    if (sACTIONINDEX == "rejectedtodept") {
        sItems += "<call>" + sCall + "</call>"
                + "<fiid>" + parent.opener.getInfo("fiid") + "</fiid>"
                + "<userid>" + parent.opener.getInfo("usid") + "</userid>"
                + "<username><![CDATA[" + parent.opener.getInfo("usdn") + "]]></username>"
                + "<kind>" + sKind + "</kind>"
                + "<mode>" + parent.opener.getInfo("mode") + "</mode>"
                + "<comment><![CDATA[" + txtComment.value + "&rejectedtodept&" + parent.opener.getInfo("dpdn") + "&" + parent.opener.getInfo("usdn") + "&" + parent.opener.getInfo("uspn") + " ]]></comment>"
                + "<save_path>";
        sItems += "</save_path></request>";
    } else {
        sItems += "<call>" + sCall + "</call>"
                + "<fiid>" + parent.opener.getInfo("fiid") + "</fiid>"
                + "<userid>" + parent.opener.getInfo("usid") + "</userid>"
                + "<username><![CDATA[" + parent.opener.getInfo("usdn") + "]]></username>"
                + "<kind>" + sKind + "</kind>"
                + "<mode>" + parent.opener.getInfo("mode") + "</mode>"
                + "<comment><![CDATA[" + txtComment.value + "]]></comment>"
                + "<save_path>";
        sItems += "</save_path></request>";
    }
    
    //20130911 hyh 수정 끝
    requestHTTP("POST", sUrl, false, "text/xml; charset=utf-8", receiveHTTP_Comment, sItems);
    fnNextProcess();

    if (sCall == "d") txtComment.value = ""
}
var checkIsSavedCnt = 0;
var objIsSaved = null;
var sgfnSaveTmpUrl = '';
var sgfnSaveTmp = '';
//실버라이트 컨트롤에서 저장과정이 정상적으로 이루어지면 호출하는 다음 프로세스를 위한 함수
//정상적인 저장이 이루어지지 않으면 경고창을 띄우고 다음 프로세스로 진행되지 않는다.
function fnSaveTmp() {
    var objXaml = opener.parent.frames[1].document.getElementById('silverObjInkWrite');
    if (objXaml.content.WriteScriptKey.IsSaved()) {
        requestHTTP("POST", sgfnSaveTmpUrl, false, "text/xml; charset=utf-8", receiveHTTP_Comment,sgfnSaveTmp);
        fnNextProcess();
        clearInterval(objIsSaved);
    }
//    else {
//        alert("저장에 실패하였습니다.");
//    }
}
//최종적인 결재 프로세스
function fnNextProcess() {
    parent.close();
    if (m_oFormMenu.getInfo("mode") == "REDRAFT" && m_oFormMenu.getInfo("loct") == "REDRAFT") {
        m_oFormMenu.requestProcess("RECREATE");
    }
    else {
        m_oFormMenu.requestProcess("APPROVE");
    }
}

//현재 일자를 yyyymmddhhmmss 형식으로 반환하는 함수를 copy함.
function fnCOPMNow() {
    var sToday = '', sTmp = '', dt = '';
    dt = new Date();

    sTmp += dt.getYear().toString();
    sToday += sTmp;
    sTmp = (parseInt(dt.getMonth()) + 1).toString();
    sTmp = ('0' + sTmp);
    sTmp = sTmp.substring(sTmp.length - 2, sTmp.length);
    sToday += sTmp;
    sTmp = dt.getDate().toString();
    sTmp = ('0' + sTmp);
    sTmp = sTmp.substring(sTmp.length - 2, sTmp.length);
    sToday += sTmp;
    sTmp = dt.getHours().toString();
    sTmp = ('0' + sTmp);
    sTmp = sTmp.substring(sTmp.length - 2, sTmp.length);
    sToday += sTmp;
    sTmp = dt.getMinutes().toString();
    sTmp = ('0' + sTmp);
    sTmp = sTmp.substring(sTmp.length - 2, sTmp.length);
    sToday += sTmp;
    sTmp = dt.getSeconds().toString();
    sTmp = ('0' + sTmp);
    sTmp = sTmp.substring(sTmp.length - 2, sTmp.length);
    sToday += sTmp;
    return sToday;
}

function receiveHTTP_Comment(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			//alert(m_xmlHTTP.responseText);
		}else{
		    if(m_xmlHTTP.responseXML!=null){
			    var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			    if(errorNode!=null){
				    alert("Desc: " + errorNode.text);
			    }else{	
			        var Message = m_xmlHTTP.responseXML.selectSingleNode("response/message")
			        if (Message!=null)	alert(Message.text);
			    }
			}
		}
	}
}

function fn_lastapproval(){
	var oPendingSteps = m_oApvList.documentElement.selectNodes("division/step[.//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='pending' or .//taskinfo/@status='reserved')]");
	//var oinActiveSteps = m_oApvList.documentElement.selectNodes("division/step[@routetype!='receive' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass' and .//taskinfo/@kind!='skip'  and .//taskinfo/@status='inactive']");
	var oinActiveSteps = m_oApvList.documentElement.selectNodes("division/step[.//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass' and .//taskinfo/@kind!='skip'  and .//taskinfo/@status='inactive']");
	if (( oPendingSteps.length == 1 ) && (oinActiveSteps.length == 0)){
		return "true";
	}else{
		return "false";
	}
}
function fn_checkrereserve(){
	//var oApprovedSteps = m_oApvList.documentElement.selectNodes("division/step[@routetype='approve' or @routetype='consult']/ou/person[taskinfo/@status='reserved']");	
	var oApprovedSteps = m_oApvList.documentElement.selectNodes("division/step[@routetype='approve' or @routetype='consult' or @routetype='assist' or @routetype='audit']/ou/person[taskinfo/@status='reserved']");
    //201108
	if(m_oFormMenu.getInfo("gloct") == "JOBFUNCTION" && oApprovedSteps.length == 0){
	    oApprovedSteps = m_oApvList.documentElement.selectNodes("division/step[@routetype='receive']/ou/role[taskinfo/@status='reserved']");
	}
	if (oApprovedSteps.length > 0){
		alert("<%=Resources.Approval.msg_065 %>" );//"결재 보류는 단 1회만 가능합니다."
		return false;
	}else{
		return true;
	}
}
/*지정반송 추가 시작*/
/*지정 반송 check*/
function fn_checkrejectedto() {
	var oApprovedSteps ;
	if ( m_oFormMenu.getInfo("mode") == "RECAPPROVAL"){ ///ou[taskinfo/@status='pending']/person[taskinfo/@kind='normal' and taskinfo/@status='inactive']
		oApprovedSteps = m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed' and not(.//taskinfo/@rejectee))]");
	}else if ( m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){ ///ou[taskinfo/@status='pending']/person[taskinfo/@kind='normal' and taskinfo/@status='inactive']
    oApprovedSteps = m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='assist']/ou[taskinfo/@status='pending' and taskinfo/@piid='" + m_oFormMenu.getInfo("piid").toUpperCase() + "']/person[taskinfo/@kind!='review' and taskinfo/@kind!='bypass'  and taskinfo/@kind!='skip' and taskinfo/@kind!='conveyance' and (taskinfo/@status='completed' and not(taskinfo/@rejectee))]");
	}else{
		oApprovedSteps = m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed' and not(.//taskinfo/@rejectee))]");
	}

	if ( m_oFormMenu.getInfo("scRJTO") == "1"  && m_oFormMenu.getInfo("scRJTOV") != "" ){
		var iRJCnt =0;
		var oRJSteps;
		if ( m_oFormMenu.getInfo("mode") == "RECAPPROVAL"){
			oRJSteps= m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@rejectee='y']");
		}else if ( m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){
		    //if(!window.ActiveXObject){
                    if (!isWindow()) {
    			oRJSteps= m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='consult']/ou[taskinfo/@status='pending'  and taskinfo/@piid='" +m_oFormMenu.getInfo("piid").toUpperCase() + "']/*[name()='person' or name()='role'][taskinfo/@rejectee='y']");
		    }else{
    			oRJSteps= m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='consult']/ou[taskinfo/@status='pending'  and taskinfo/@piid='" +m_oFormMenu.getInfo("piid").toUpperCase() + "']/(person|role)[taskinfo/@rejectee='y']");
			}
		}else{
			oRJSteps= m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@rejectee='y']");
		}
		
		iRJCnt = oRJSteps.length;
		if ( iRJCnt >= parseInt(m_oFormMenu.getInfo("scRJTOV"))){
			//alert("이미 [" + m_oFormMenu.getInfo("scRJTOV")+"회]의 지정반송을 했습니다.\r\n 더 이상의 지정반송은 할 수 없습니다.");
			alert("<%=Resources.Approval.msg_110 %>");
			return false;
		}
	}
	//oApprovedSteps.length
	if ( oApprovedSteps.length == 0 ){
		//alert("지정 반송시킬 대상이 없습니다.\n반송을 선택하십시요");
		alert("<%=Resources.Approval.msg_110 %>");
		return false;
	}else{
		var iApvCNT = 0;
		var szCode = "";
		var szName = "";
		for(var i=0;i < oApprovedSteps.length ; i++){
			var oStep = oApprovedSteps.nextNode();
			var oTaskInfo;
			if (oStep.getAttribute("allottype") != "parallel"){
			if ( m_oFormMenu.getInfo("mode") == "RECAPPROVAL"){
    		       //if(!window.ActiveXObject){
                       if (!isWindow()) {
    				oTaskInfo= oStep.selectSingleNode("ou/*[name()='person' or name()='role']/taskinfo[@kind!='conveyance']");
    			}else{
    				oTaskInfo= oStep.selectSingleNode("ou/(person|role)/taskinfo[@kind!='conveyance']");
    			}
			}else if ( m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){
				oTaskInfo= oStep.selectSingleNode("taskinfo");
			}else{
    		        //if(!window.ActiveXObject){
                        if (!isWindow()) {
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
			var strURL = "selectApprover.aspx";
			openWindow(strURL,"selectApprover",400,200,'resize');
			/* 직전결재자에게만 반송함 2005.11 황선희
			var szTemp = selectApprover();
			szCode = szTemp.split("@")[0];
			szName = szTemp.split("@")[1];
			if ( szCode != "" && szName != ""){
				inputApprover(szCode, szName);
			}else{
				alert("반송대상이 없습니다");
			}
			*/
		}else{
			//alert("지정 반송시킬 대상이 없습니다.\n반려를 선택하십시요");
    		alert("<%=Resources.Approval.msg_110 %>");
			return false;
		}
	}
}
function openWindow(fileName,windowName,theWidth,theHeight, etcParam) {
	var objNewWin;
	var x = theWidth;
	var y = theHeight;

	var sy = window.screen.height / 2 - y / 2 - 70;
	if (etcParam == 'fix') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0";
		var sy = window.screen.height / 2 - y / 2 - 40;
	}
	else if (etcParam == 'resize') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1";
		var sy = window.screen.height / 2 - y / 2 - 40;
	}

	var sx = window.screen.width  / 2 - x / 2;


	if (sy < 0 ) {
		sy = 0;
	}
	
	var sz = ",top=" + sy + ",left=" + sx;

	if (windowName == "newMessageWindow") 
	{
	windowName = new String(Math.round(Math.random() * 100000));
	} 
	
    var strNewFearture = ModifyWindowFeature(etcParam + ",width=" + x + ",height=" + y + sz);
	objNewWin =window.open(fileName,windowName,strNewFearture);
	//objNewWin = window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}
function inputApprover(szCode, szName){
	swiid = szCode;
	sApvName = szName;
	document.getElementById("spAppName").innerHTML =  sApvName;
}
function setRJTApvList(){
	var oLastStep, oOU ;
	var oSteps;
	if ( m_oFormMenu.getInfo("mode") == "RECAPPROVAL"){
	    oLastStep = m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']/step[ .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='skip' and ( .//taskinfo/@status='inactive' )]"); //@routetype='approve' andand .//taskinfo/@kind!='bypass' 
		oSteps = m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve'  and  .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and ((.//taskinfo/@status='completed' or .//taskinfo/@status='pending') and not(.//taskinfo/@rejectee))]");
	}else if ( m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){
		oOU = m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']/step[taskinfo/@status='pending']/ou[taskinfo/@status='pending' and taskinfo/@piid='" + m_oFormMenu.getInfo("piid").toUpperCase() + "']");
	        //if(!window.ActiveXObject){
                if (!isWindow()) {
    		oLastStep = m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']/step[taskinfo/@status='pending' ]/ou[taskinfo/@status='pending' and taskinfo/@piid='"+m_oFormMenu.getInfo("piid").toUpperCase()+"']/*[name()='person' or name()='role'][taskinfo/@status='inactive']"); //taskinfo/@kind='normal' and (친전이 올 수 있음)
    		oSteps = m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[taskinfo/@status='pending' ]/ou[taskinfo/@status='pending' and taskinfo/@piid='"+m_oFormMenu.getInfo("piid").toUpperCase()+"']/*[name()='person' or name()='role'][(taskinfo/@kind!='review' and taskinfo/@kind!='bypass'  and taskinfo/@kind!='skip' and taskinfo/@kind!='conveyance') and (( taskinfo/@status='completed' or taskinfo/@status='pending') and not(taskinfo/@rejectee))]");
		}else{
    		oLastStep = m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']/step[taskinfo/@status='pending' ]/ou[taskinfo/@status='pending' and taskinfo/@piid='"+m_oFormMenu.getInfo("piid").toUpperCase()+"']/(person|role)[taskinfo/@status='inactive']"); //taskinfo/@kind='normal' and (친전이 올 수 있음)
    		oSteps = m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[taskinfo/@status='pending' ]/ou[taskinfo/@status='pending' and taskinfo/@piid='"+m_oFormMenu.getInfo("piid").toUpperCase()+"']/(person|role)[(taskinfo/@kind!='review' and taskinfo/@kind!='bypass'  and taskinfo/@kind!='skip' and taskinfo/@kind!='conveyance') and ((taskinfo/@status='completed' or taskinfo/@status='pending') and not(taskinfo/@rejectee))]");
		}
	}else{
		//oLastStep = m_oApvList.documentElement.selectSingleNode("step[@routetype='approve' and .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and ( .//taskinfo/@status='inactive'  )]");
	    oLastStep = m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']/step[ .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='skip' and ( .//taskinfo/@status='inactive' )]"); //@routetype='approve' andand .//taskinfo/@kind!='bypass' 
		oSteps = m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and ((.//taskinfo/@status='completed' or .//taskinfo/@status='pending') and not(.//taskinfo/@rejectee))]");
	}

	var oStep, oPerson, oTaskInfo;
	for (var i=0 ; i < oSteps.length ; i++){
		if (m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){
			oStep = oSteps.nextNode();
			oPerson = oStep;
		}else{
			oStep = oSteps.nextNode();
    	        //if(!window.ActiveXObject){
                if (!isWindow()) {
			    oPerson = oStep.selectSingleNode("ou/*[name()='person' or name()='role'][taskinfo/@kind!='conveyance']");
	        }else{		
			    oPerson = oStep.selectSingleNode("ou/(person|role)[taskinfo/@kind!='conveyance']");
			}
		}
		oTaskInfo = oPerson.selectSingleNode("taskinfo");
		//넘어온 코드와 같다면 결재선에 추가
		if ( oTaskInfo.getAttribute("wiid") == swiid || bAdd == true){
			var oCStep = oStep.cloneNode(true);
			var oCTaskInfo;
			if ( m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){
				oCTaskInfo = oCStep.selectSingleNode("taskinfo");
			}else{
				var oCOU = oCStep.selectSingleNode("ou");
    	            //if(!window.ActiveXObject){
                    if (!isWindow()) {
    				oCTaskInfo = oCStep.selectSingleNode("ou/*[name()='person' or name()='role']/taskinfo[@kind!='conveyance']");
	            }else{		
    				oCTaskInfo = oCStep.selectSingleNode("ou/(person|role)/taskinfo[@kind!='conveyance']");
			    }				
				//전달자들은 삭제 2006.03. by sunny
				var oRmvPerson;
    	                        //if(!window.ActiveXObject){
                                if (!isWindow()) {
				    oRmvPerson = oCOU.selectNodes("*[name()='person' or name()='role'][taskinfo/@kind='conveyance']");
				}else{
				    oRmvPerson = oCOU.selectNodes("(person|role)[taskinfo/@kind='conveyance']");
				}
				for(var k=0; k < oRmvPerson.length ; k++){
					oCOU.removeChild(oRmvPerson(k));
				}
			}
			
			oCTaskInfo.setAttribute("status","inactive");
			oCTaskInfo.setAttribute("result","inactive");
			//oCTaskInfo.setAttribute("kind","normal");
			oCTaskInfo.removeAttribute("datereceived");
			oCTaskInfo.removeAttribute("datecompleted");
			oCTaskInfo.removeAttribute("customattribute1");
			oCTaskInfo.removeAttribute("wiid");
			oCTaskInfo.removeAttribute("visible");
			oCTaskInfo.removeAttribute("rejectee");
			
			var oComment = oCTaskInfo.selectSingleNode("comment");
			if ( oComment != null){
				var oldCommt = oCTaskInfo.removeChild(oComment);
			}
			bAdd = true;
//			if (oTaskInfo.getAttribute("kind") != "charge"){
			    oTaskInfo.setAttribute("visible","n");
//			}
			oTaskInfo.setAttribute("rejectee","y");
			if (oTaskInfo.getAttribute("status") == "pending" ){ //지정반송자
				oTaskInfo.setAttribute("daterejectedto",m_oFormMenu.getInfo("svdt"));
			}
			if ( m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){
				if (oLastStep == null)
				{
					oOU.appendChild(oCStep);
				}else{
					oOU.insertBefore(oCStep, oLastStep);
				}
			}else{
				m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']").insertBefore(oCStep, oLastStep);
			}
		}
	}
	m_oFormMenu.document.getElementsByName("APVLIST")[0].value = m_oApvList.documentElement.xml;	
}
function selectApprover(){
	var oStep, oPerson, oTaskInfo;
	var oApprovedSteps;
	var szTemp="";
	//var oApprovedSteps = opener.m_oApvList.documentElement.selectNodes("step[@routetype='approve' and .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed')]");
	if ( m_oFormMenu.getInfo("mode") == "RECAPPROVAL"){
		oApprovedSteps =m_oApvList.documentElement.selectNodes("division/step[@routetype='receive' ]/ou[taskinfo/@status='pending']/person[(taskinfo/@kind='normal' or taskinfo/@kind='charge') and taskinfo/@status='completed' and not(taskinfo/@rejectee)]");
		for(var i=0;i < oApprovedSteps.length ; i++){
			oPerson = oApprovedSteps.nextNode();
			oTaskInfo = oPerson.selectSingleNode("taskinfo");
			if ( oTaskInfo.getAttribute("rejectee") != 'y'){
				szTemp = oTaskInfo.getAttribute("wiid")+"@"+oPerson.getAttribute("name");
			}
		}
	}else if ( m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){
		oApprovedSteps =m_oApvList.documentElement.selectNodes("division/step[taskinfo/@status='pending' ]/ou[taskinfo/@status='pending']/person[(taskinfo/@kind='normal' or taskinfo/@kind='charge') and taskinfo/@status='completed' and not(taskinfo/@rejectee)]");
		for(var i=0;i < oApprovedSteps.length ; i++){
			oPerson = oApprovedSteps.nextNode();
			oTaskInfo = oPerson.selectSingleNode("taskinfo");
			if ( oTaskInfo.getAttribute("rejectee") != 'y'){
				szTemp = oTaskInfo.getAttribute("wiid")+"@"+oPerson.getAttribute("name");
			}
		}
	}else{
			oApprovedSteps = m_oApvList.documentElement.selectNodes("division/step[@routetype='approve' and not( @*='parallel') and .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed' and not(.//taskinfo/@rejectee))]");			
			for(var i=0;i < oApprovedSteps.length ; i++){
				oStep = oApprovedSteps.nextNode();
				//if(!window.ActiveXObject){
                                if (!isWindow()) {
				    oPerson = oStep.selectSingleNode("ou/*[name()='person' or name()='role']");
				}else{
				    oPerson = oStep.selectSingleNode("ou/(person|role)");
				}
				oTaskInfo = oPerson.selectSingleNode("taskinfo");
				if ( oTaskInfo.getAttribute("rejectee") != 'y'){
					szTemp = oTaskInfo.getAttribute("wiid")+"@"+oPerson.getAttribute("name");
				}
			}
			
	}

	return szTemp;
}

/*지정반송 추가 끝*/
</script>
