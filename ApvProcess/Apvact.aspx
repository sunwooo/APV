<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Apvact.aspx.cs" Inherits="COVIFlowNet_ApvProcess_Apvact" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
	<script type="text/javascript" language="javascript" src="../../common/script/CFL.js"></script>
</head>
<body leftmargin="0" topmargin="0" rightmargin="0" scroll="no">
<div style="padding-left: 35px; padding-right: 20px;">
	<!-- 등록 div 시작 -->
	<div class="write">

	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td colspan="2" class="line"></td>
		</tr>
		<tr>
			<td class="title"><%=Resources.Approval.lbl_result %></td>
			<td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><input checked type="radio" value="approve" name="radAction" id="radAction" style="WIDTH:31px;"><%=Resources.Approval.lbl_Approved%>	<span id="spanReject"><input type="radio" value="reject" name="radAction" id="radAction" style="WIDTH:31px;"><%=Resources.Approval.lbl_reject%>	</span><span id="spanHold" style="display:none;"><input type="radio" value="reserve" name="radAction" id="radAction" style="WIDTH:31px;"><%=Resources.Approval.lbl_hold %></span><input type="radio" value="rejectedto" name="radAction" id="radAction" style="display:none;WIDTH: 30;" onClick="fn_checkrejectedto();"><span id="spreject" style="display:none"><%=Resources.Approval.lbl_rejectedto %></span></td>
		</tr>
		<tr>
			<td colspan="2" class="line"></td>
		</tr>
		<tr id="triptPassword" name="triptPassword" style="display:block;">
			<td class="title"><%=Resources.Approval.lbl_approvalpwd %></td>
			<td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><input type="password" id="iptPassword" onKeyPress="if (event.keyCode==13) fn_approval();" style="WIDTH: 80%;" class='input4'><span id="spAppName"></span></td>
		</tr>
		<tr style="display:none;">
			<td colspan="2" class="line"></td>
		</tr>
		<tr style="display:none;">
			<td class="title"><%=Resources.Approval.lbl_signtype %></td>
			<td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;">
				<input type="radio" value="stamp" name="radSign" id="radSign" style="WIDTH:28px;" onclick="make_select('stamp')"><%=Resources.Approval.lbl_stamp %>							
				<input type="radio" value="sign" name="radSign" id="radSign" style="WIDTH:26px;" onclick="make_select('sign')"><%=Resources.Approval.lbl_sign %>	 				
				<input checked type="radio" value="usnm" name="radSign" id="radSign" style="WIDTH:28px;" onclick="make_select('usnm')"><%=Resources.Approval.lbl_Name %>	 
				<SELECT name="selImage" id="selImage" size="3"  onChange="setImage();" style="width:100%;">
				</SELECT>
			
			</td>
		</tr>
		<tr>
			<td colspan="2" class="line"></td>
		</tr>
		<tr>
			<%--<td class="title"><%=Resources.Approval.lbl_comment %><br /><img src="../../common/images/groupware/blank.gif" Name="selectImage" ID="selectImage" border="0" style="width:30px;height:30px" align="absmiddle"></td>--%>
			<td class="title"><%=Resources.Approval.lbl_comment %><br /><img src="<%=Session["user_thema"] %>/Covi/Common/icon/blank.gif" Name="selectImage" ID="selectImage" border="0" style="width:30px;height:30px" align="absmiddle"></td>
			<td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><textarea id="txtComment" name="txtComment" rows="10" style="width: 330px;"></textarea></td>
		</tr>
		<tr>
			<td colspan="2" class="line"></td>
		</tr>
	</table>  
	 </div>
    <!-- 등록 div 끝 -->
</div>
<div class="popup_Btn small" style=" text-align: right; padding-right: 20px;">
  <table border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td><a href="#" class="Btn04" onclick="javascript:fn_approval();"><span><%=Resources.Approval.btn_confirm%></span></a> </td>
      <td><a href="#" class="Btn04" onclick="javascript:parent.window.close();"><span><%=Resources.Approval.btn_cancel%></span></a> </td>
    </tr>
  </table>
</div>	   
   
</body>
</html>
<script language="javascript" type="text/javascript">
		var m_xmlHTTP=new ActiveXObject("MSXML2.XMLHTTP");
		var aSign;
		var aStamp;
		var smode="sign";
		var bAdd = false; //지정반송 반송대상 추가
		var swiid="";//지정반송 대상 wiid
		var sApvName="";
		var g_UsePWDCheck = "F"; //결재암호 체크System.Web.Configuration.WebConfigurationManager.AppSettings["WF_UsePWDCheck"]

		function window.onload()
		{
			if (g_UsePWDCheck == "F" ){
			    triptPassword.style.display="none";
			}else{
                iptPassword.focus();	
			 }
			getComment();
			smode="sign";
			var szURL = "../../common/FileAttach/GetApvImage.aspx";
			//requestHTTP("GET",szURL,true,"text/xml",receiveHTTP,null);
		}
		
		function getComment()
		{
		    bcomment = false;
	        smode = "comment";
	        //2007.01 재기안자 결재의견 오류 수정
            var pXML = "SELECT COMMENT FROM WF_COMMENT WITH (NOLOCK) WHERE FORM_INST_ID ='" + parent.opener.getInfo("fiid") + "' AND USER_ID = '"+ parent.opener.getInfo("usid");
            if  (parent.opener.getInfo("mode") == "REDRAFT"){
             pXML =pXML +"' AND MODE='N'";
            }else{
             pXML =pXML +"' AND KIND <> 'initiator' AND MODE='N'";
            }
            var sXML = "<Items><connectionname>INST_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
            var szURL = "../getXMLQuery.aspx";
            requestHTTP("POST",szURL,false,"text/xml; charset=utf-8",receiveHTTP, sXML);
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
					//alert(m_xmlHTTP.responseText);
				}else{
					var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
					if(errorNode!=null){
						if(errorNode.text.indexOf("<%=Resources.Approval.msg_102 %>") > -1){
							//alert("결재암호가 틀립니다");
							alert("<%=Resources.Approval.msg_102 %>");
							iptPassword.value="";
						}else{
							alert("Desc: " + errorNode.text);
						}
					}else{
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
							
							}catch(e){}
						}else if(smode=="password"){
							if ( m_xmlHTTP.responseXML.selectSingleNode("response").text == "ok"){
								parent.close();
								if ( m_oFormMenu.getInfo("mode") == "REDRAFT" && m_oFormMenu.getInfo("loct") == "REDRAFT" ){
									m_oFormMenu.requestProcess("RECREATE");
								}else{
									m_oFormMenu.requestProcess("APPROVE");
								}
							}else{
								alert(m_xmlHTTP.responseXML.selectSingleNode("response").text);
							}
						}else if(smode=="comment"){
						    if (m_xmlHTTP.responseXML.selectSingleNode("response/NewDataSet/Table/COMMENT") == null){
						        bcomment = false;
						    }else{
						        txtComment.value = m_xmlHTTP.responseXML.selectSingleNode("response/NewDataSet/Table/COMMENT").text;
						        bcomment = true;
						    }
						}
					}
				}
			}
		}
		
		function event_noop(){return(false);}

		function makeNode(str){
			var oOption = document.createElement("OPTION");	
			selImage.options.add(oOption);
			oOption.text=str;
			oOption.value=str;	
			return;	
		}
		function make_select(sMode){
			if ( sMode == 'usnm'){
				var intCount = self.selImage.options.length;
				for (var i=intCount;i!=0;i--){
					self.selImage.options.remove(i-1);			
				}	
				//selectImage.src = "/CoviWeb/common/Images/groupware/blank.gif";
				
				selectImage.src = "<%=Session["user_thema"] %>/Covi/Common/icon/blank.gif" ;
			}else{
				(sMode== 'stamp')?make_selImage(aStamp):make_selImage(aSign);
			}
		}
		function make_selImage(aImage){
			var intCount = self.selImage.options.length;
			for (var i=intCount;i!=0;i--){
				self.selImage.options.remove(i-1);			
			}	
			for(var i=0;i<aImage.length;i++){
				makeNode(aImage[i]);
			}
			if ( aImage.length > 0 ){ self.selImage.options[0].selected = true;setImage();}
			return;
		}
		function setImage(){
			var sName = selImage.value;
			var sUPUrl = "/covinet/BackStorage/e-sign/ApprovalSign/";
			selectImage.src = sUPUrl + sName;
		}
		var bcomment = false;
		//function getComment(){
		    //의견 작성 여부
		    /*
		    smode = "comment";
            var pXML = "SELECT COMMENT FROM WF_COMMENT WITH (NOLOCK) WHERE FORM_INST_ID ='" + parent.opener.getInfo("fiid") + "' AND USER_ID = '"+ parent.opener.getInfo("usid") +"'";
            var sXML = "<Items><connectionname>INST_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
            var szURL = "../getXMLQuery.aspx";
            requestHTTP("POST",szURL,false,"text/xml; charset=utf-8",receiveHTTP, sXML);
            */
		//}
		</script>
<script language="javascript" type="text/javascript">
//iptPassword.focus();
var m_oFormMenu = parent.opener;
var m_oFormEditor = parent.opener.parent.editor;

switch(m_oFormMenu.getInfo("mode")){
	case "AUDIT":
//		radAction[0].nextSibling.nodeValue="결재";
//		radAction[1].nextSibling.nodeValue="반려";
//		//radAction[2].nextSibling.nodeValue="보류";
		radAction[0].nextSibling.nodeValue="<%=Resources.Approval.lbl_Approved %>";
		radAction[1].nextSibling.nodeValue="<%=Resources.Approval.lbl_reject %>";
		//radAction[2].nextSibling.nodeValue="<%=Resources.Approval.lbl_hold %>";

		break;
	case "PCONSULT":
//		radAction[0].nextSibling.nodeValue="동의";
//		//spanReject.style.display="none";
//		radAction[1].nextSibling.nodeValue="이견";
//		//radAction[2].nextSibling.nodeValue="보류";
		radAction[0].nextSibling.nodeValue="<%=Resources.Approval.lbl_agree %>";
		//spanReject.style.display="none";
		radAction[1].nextSibling.nodeValue="<%=Resources.Approval.lbl_disagree %>";
		//radAction[2].nextSibling.nodeValue="<%=Resources.Approval.lbl_hold %>";
		
		break;
	case "SUBAPPROVAL": //합의부서내 결재
		if ( m_oFormMenu.getInfo("scRJTO") == "1" ){   radAction[3].style.display="";spreject.style.display="";	}
		break;
	case "RECAPPROVAL": //수신부서내 결재
		if ( m_oFormMenu.getInfo("scRJTO") == "1" ){   radAction[3].style.display="";spreject.style.display="";	}
		radAction[1].nextSibling.nodeValue="반송";
		break;
	case "APPROVAL":
//		radAction[0].nextSibling.nodeValue="결재";
//		radAction[1].nextSibling.nodeValue="반려";
//		radAction[2].nextSibling.nodeValue="보류";
		radAction[0].nextSibling.nodeValue="<%=Resources.Approval.lbl_Approved %>";
		radAction[1].nextSibling.nodeValue="<%=Resources.Approval.lbl_reject %>";
		radAction[2].nextSibling.nodeValue="<%=Resources.Approval.lbl_hold %>";spanHold.style.display="";radAction[2].style.display="";
		/* 2006.11 쿠쿠전자의 경우 1단계 결재에서 지정반송 막음
		if ( m_oFormMenu.getInfo("scRJTO") == "1" ){  //동시결재의 경우 지정반송 기능 막음
			var m_oApvList = new ActiveXObject("MSXML2.DOMDocument");
			if(!m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+m_oFormMenu.APVLIST.value)){
				alertParseError(m_oApvList.parseError);			
			}
			var elmRoot = m_oApvList.documentElement;
			var elmStep = elmRoot.selectSingleNode("division/step[@routetype='approve' and (ou/person/taskinfo[@status='pending'] or ou/role/taskinfo[@status='pending'])]");
			var sallottype = "serial";
			try{ sallottype = elmStep.getAttribute("allottype");}catch(e){}
			if ( sallottype == "serial" || sallottype == null  ){  radAction[3].style.display="";spreject.style.display="";}
		}
		*/
		break;
	case "CHARGE":
//		radAction[0].nextSibling.nodeValue="접수";
//		radAction[1].nextSibling.nodeValue="반려";
//		//radAction[2].nextSibling.nodeValue="보류";
		radAction[0].nextSibling.nodeValue="<%=Resources.Approval.btn_receipt %>";
		radAction[1].nextSibling.nodeValue="<%=Resources.Approval.lbl_reject %>";
		//radAction[2].nextSibling.nodeValue="<%=Resources.Approval.lbl_hold %>";
		break;
}

//2006.09.19 김현태 후결여부 체크
if(m_oFormMenu.fn_GetReview()){
    spanReject.style.display = "none";
    spanHold.style.display = "none";
}
/*var m_apvXML = new ActiveXObject("MSXML2.DOMDocument");
m_apvXML.loadXML(m_oFormMenu.field["APVLIST"].value); 
var oReviewNode = m_apvXML.documentElement.selectSingleNode("division/step/ou/person[taskinfo/@kind='review' and taskinfo/@status='pending']");
if(oReviewNode != null){
    if(m_oFormMenu.getInfo("usid") == oReviewNode.getAttribute("code")){
        spanReject.style.display = "none";
        spanHold.style.display = "none";
    }
}*/
//2006.09.19 김현태 후결여부 체크

function checkCommentLength(){
	if(txtComment.value.length>201){
		txtComment.innerText=txtComment.value.substring(0,201);
		return false;
	}else
		return true;
}

function getInfo(sKey){try{return parent.g_dicFormInfo.item(sKey);}catch(e){alert(gMessage61);}} //alert("양식정보에 없는 키값["+sKey+"]입니다."

function fn_approval() {	
	var i,choice,comment, blastapprove,signimagetype; 		
    
    // 의견 저장
    fn_SaveComment('s');
    
	// 종류 선택 찾기(결재, 보류, 반려인지 확인해서 index 에 값 저장
	for(i=0;i<radAction.length;i++){if(radAction[i].checked){choice=radAction[i].value;break;}}
	
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
	if (choice!="approve" && txtComment.value==""){
		//alert("의견을 입력하십시요."); 
		alert("<%=Resources.Approval.msg_064 %>");
		return;
		//쿠쿠전의 경우 의견입력을 다른 곳에서 함 2006.08  by sunnyhwang --> 의견입력으로 변경
		/*
		    bcomment = false;
	        smode = "comment";
            var pXML = "SELECT COMMENT FROM WF_COMMENT WITH (NOLOCK) WHERE FORM_INST_ID ='" + parent.opener.getInfo("fiid") + "' AND USER_ID = '"+ parent.opener.getInfo("usid") +"'";
            var sXML = "<Items><connectionname>INST_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
            var szURL = "../getXMLQuery.aspx";
            requestHTTP("POST",szURL,false,"text/xml; charset=utf-8",receiveHTTP, sXML);
        */
	}	
	//쿠쿠전의 경우 의견입력을 다른 곳에서 함 2006.08  by sunnyhwang--> 의견입력으로 변경
	/*
	if (choice!="approve" && bcomment==false){
		alert("<%=Resources.Approval.msg_064 %>");
		//parent.window.close();
		return;
	}	*/
	// 직인 이미지 
	for(i=0;i<radSign.length;i++){if(radSign[i].checked){signimagetype=radSign[i].value;break;}}
	if ( signimagetype !='usnm' && selImage.value == ''){
		alert("<%=Resources.Approval.msg_150 %>");// '인장 혹은 서명 이미지를 선택하십시요.'
		return;
	}else{signimagetype = (signimagetype=='usnm')?"":selImage.value;}
	
	var chkrtn = parent.processlist.evaluateApvList();
	if ( chkrtn == false) return;
		
	var elmRoot = parent.processlist.m_oApvList.documentElement;
	var elmOu = elmRoot.selectNodes("division/step[@routetype='receive']/ou");
	if (elmOu.length > 0){
		if(m_oFormMenu.getInfo("scDRecLimit")==1 && m_oFormMenu.getInfo("scDRecLimitV")!='' && elmOu.length > parseInt(m_oFormMenu.getInfo("scDRecLimitV"))){
			alert("결재선에서 수신부서 수는 " + m_oFormMenu.getInfo("scDRecLimitV") + "을 초과할 수 없습니다"); 
			return false;
		}
	}

	m_oFormMenu.field["APVLIST"].value = parent.processlist.m_oApvList.documentElement.xml;	
	m_oFormMenu.field["PASSWORD"].value = iptPassword.value;
	m_oFormMenu.field["ACTIONINDEX"].value = choice;
	/*
	alert("첨언크기 :"+txtComment.value.length);
	if(txtComment.value.length > 100)
		alert("Text화일로 저장해야 겠소!!");
	else
		alert("그냥 저장해도 되거쏘이다!~");
	*/
	m_oFormMenu.field["ACTIONCOMMENT"].value = txtComment.value;
	m_oFormMenu.field["SIGNIMAGETYPE"].value = signimagetype;
	blastapprove =  fn_lastapproval();
	m_oFormMenu.field["bLASTAPPROVER"].value = blastapprove;
	var sAddage = m_oFormMenu.makeNode("usid") + m_oFormMenu.makeNode("actpwd",m_oFormMenu.field["PASSWORD"].value,null,true)
	var sText = "<request>"+sAddage+"</request>";

	m_oFormMenu.evalXML(sText);
	//결재암호 체크 여부 확인
	if ( g_UsePWDCheck == "T"){
		var sTargetURL = "getProcessBizData.aspx";
		smode="password";
		requestHTTP("POST",sTargetURL,false,"text/xml",receiveHTTP,sText);
	}else{
		parent.close();
		if ( m_oFormMenu.getInfo("mode") == "REDRAFT" && m_oFormMenu.getInfo("loct") == "REDRAFT" ){
			m_oFormMenu.requestProcess("RECREATE");
		}else{
			m_oFormMenu.requestProcess("APPROVE");
		}
	}
}
function fn_SaveComment(sCall){
    var blastapprove =  fn_lastapproval();
    var sKind="";    
    var sItems="<request>";
    var sUrl="../Comment/comment_apv.aspx";
    
    if(blastapprove == "true"){
     sKind="lastapprove";
    }else if(parent.opener.getInfo("mode") == "REDRAFT"){
     sKind="initiator";
    }else{ sKind="approve";    }
    
    sItems +="<call>"+ sCall +"</call>"
            + "<fiid>" + parent.opener.getInfo("fiid") + "</fiid>"            
            + "<userid>" + parent.opener.getInfo("usid") + "</userid>"
            + "<username>" + parent.opener.getInfo("usdn") + "</username>"
            + "<kind>" + sKind + "</kind>"
            + "<mode>" + parent.opener.getInfo("mode") + "</mode>"
            + "<comment>" + txtComment.value + "</comment>";
    sItems+="</request>";
	requestHTTP("POST",sUrl,false,"text/xml; charset=utf-8",receiveHTTP_Comment,sItems);
	if (sCall=="d") txtComment.value=""
}

function receiveHTTP_Comment(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			//alert(m_xmlHTTP.responseText);
		}else{
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

function fn_lastapproval(){
	var oPendingSteps = parent.processlist.m_oApvList.documentElement.selectNodes("division/step[.//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='pending' or .//taskinfo/@status='reserved')]");
	var oinActiveSteps = parent.processlist.m_oApvList.documentElement.selectNodes("division/step[@routetype!='receive' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass' and .//taskinfo/@kind!='skip'  and .//taskinfo/@status='inactive']");
	//alert(oPendingSteps.length + "---"+ oinActiveSteps.length);
	if (( oPendingSteps.length == 1 ) && (oinActiveSteps.length == 0)){
		return "true";
	}else{
		return "false";
	}
}
function fn_checkrereserve(){
	var oApprovedSteps = parent.processlist.m_oApvList.documentElement.selectNodes("division/step[@routetype='approve' or @routetype='consult']/ou/person[taskinfo/@status='reserved']");	
	if (oApprovedSteps.length > 0){
		alert("<%=Resources.Approval.msg_065 %>" );//"결재 보류는 단 1회만 가능합니다."
		return false;
	}else{
		return true;
	}
}
/*지정반송 추가 시작*/
/*지정 반송 check*/
function fn_checkrejectedto(){
	var oApprovedSteps ;
	if ( m_oFormMenu.getInfo("mode") == "RECAPPROVAL"){ ///ou[taskinfo/@status='pending']/person[taskinfo/@kind='normal' and taskinfo/@status='inactive']
		oApprovedSteps = parent.processlist.m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed')]");
	}else if ( m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){ ///ou[taskinfo/@status='pending']/person[taskinfo/@kind='normal' and taskinfo/@status='inactive']
		oApprovedSteps = parent.processlist.m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='consult']/ou[taskinfo/@status='pending' and taskinfo/@piid='" +m_oFormMenu.getInfo("piid") + "']/person[taskinfo/@kind!='review' and taskinfo/@kind!='bypass'  and taskinfo/@kind!='skip' and taskinfo/@kind!='conveyance' and (taskinfo/@status='completed')]");
	}else{
		oApprovedSteps = parent.processlist.m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed')]");
	}

	if ( m_oFormMenu.getInfo("scRJTO") == "1"  && m_oFormMenu.getInfo("scRJTOV") != "" ){
		var iRJCnt =0;
		var oRJSteps;
		if ( m_oFormMenu.getInfo("mode") == "RECAPPROVAL"){
			oRJSteps= parent.processlist.m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@rejectee='y']");
		}else if ( m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){
			oRJSteps= parent.processlist.m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='consult']/ou[taskinfo/@status='pending'  and taskinfo/@piid='" +m_oFormMenu.getInfo("piid") + "']/(person|role)[taskinfo/@rejectee='y']");
		}else{
			oRJSteps= parent.processlist.m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@rejectee='y']");
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
				oTaskInfo= oStep.selectSingleNode("ou/(person|role)/taskinfo[@kind!='conveyance']");
			}else if ( m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){
				oTaskInfo= oStep.selectSingleNode("taskinfo");
			}else{
				oTaskInfo= oStep.selectSingleNode("ou/(person|role)/taskinfo[@kind!='conveyance']");
			}
			if ( oTaskInfo.getAttribute("rejectee") != 'y'){
				iApvCNT++;
				szCode = oTaskInfo.parentNode.getAttribute("wiid");
				szName = oTaskInfo.parentNode.getAttribute("name");
			}
			}
		}
		if ( iApvCNT > 0 ){
			//alert("반송시킬 대상을 지정하세요");
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
	spAppName.innerHTML =  sApvName;
}
function setRJTApvList(){
	var oLastStep, oOU ;
	var oSteps;
	if ( m_oFormMenu.getInfo("mode") == "RECAPPROVAL"){
		oLastStep = parent.processlist.m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']/step[ .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass' and .//taskinfo/@kind!='skip' and ( .//taskinfo/@status='inactive' )]");//@routetype='approve' and
		oSteps = parent.processlist.m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve'  and  .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed' or .//taskinfo/@status='pending'  )]");
	}else if ( m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){
		oOU = parent.processlist.m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']/step[@routetype='consult']/ou[taskinfo/@status='pending' and taskinfo/@piid='" + m_oFormMenu.getInfo("piid") + "']");
		oLastStep = parent.processlist.m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']/step[@routetype='consult' ]/ou[taskinfo/@status='pending' and taskinfo/@piid='"+m_oFormMenu.getInfo("piid")+"']/(person|role)[taskinfo/@status='inactive']"); //taskinfo/@kind='normal' and (친전이 올 수 있음)
		oSteps = parent.processlist.m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='consult' ]/ou[taskinfo/@status='pending' and taskinfo/@piid='"+m_oFormMenu.getInfo("piid")+"']/(person|role)[(taskinfo/@kind!='review' and taskinfo/@kind!='bypass'  and taskinfo/@kind!='skip' and taskinfo/@kind!='conveyance') and ( taskinfo/@status='completed' or taskinfo/@status='pending'  )]");
	}else{
		//oLastStep = parent.processlist.m_oApvList.documentElement.selectSingleNode("step[@routetype='approve' and .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and ( .//taskinfo/@status='inactive'  )]");
		oLastStep = parent.processlist.m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']/step[ .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass' and .//taskinfo/@kind!='skip' and ( .//taskinfo/@status='inactive' )]");//@routetype='approve' and
		oSteps = parent.processlist.m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed' or .//taskinfo/@status='pending'  )]");
	}

	var oStep, oPerson, oTaskInfo;
	for (var i=0 ; i < oSteps.length ; i++){
		if (m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){
			oStep = oSteps.nextNode();
			oPerson = oStep;
		}else{
			oStep = oSteps.nextNode();
			oPerson = oStep.selectSingleNode("ou/(person|role)[taskinfo/@kind!='conveyance']");
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
				oCTaskInfo = oCStep.selectSingleNode("ou/(person|role)/taskinfo[@kind!='conveyance']");
				//전달자들은 삭제 2006.03. by sunny
				var oRmvPerson = oCOU.selectNodes("(person|role)[taskinfo/@kind='conveyance']");
				for(var k=0; k < oRmvPerson.length ; k++){
					oCOU.removeChild(oRmvPerson(k));
				}
			}
			
			oCTaskInfo.setAttribute("status","inactive");
			oCTaskInfo.setAttribute("result","inactive");
			oCTaskInfo.setAttribute("kind","normal");
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
			if (oTaskInfo.getAttribute("kind") != "charge"){
			    oTaskInfo.setAttribute("visible","n");
			}
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
				parent.processlist.m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='pending']").insertBefore(oCStep, oLastStep);
			}
		}
	}
	//alert(parent.processlist.m_oApvList.documentElement.xml);
	//if (bAdd){parent.processlist.refreshList();}
}
function selectApprover(){
	var oStep, oPerson, oTaskInfo;
	var oApprovedSteps;
	var szTemp="";
	//var oApprovedSteps = opener.parent.processlist.m_oApvList.documentElement.selectNodes("step[@routetype='approve' and .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed')]");
	if ( m_oFormMenu.getInfo("mode") == "RECAPPROVAL"){
		oApprovedSteps =parent.processlist.m_oApvList.documentElement.selectNodes("division/step[@routetype='receive' ]/ou[taskinfo/@status='pending']/person[(taskinfo/@kind='normal' or taskinfo/@kind='charge') and taskinfo/@status='completed']");
		for(var i=0;i < oApprovedSteps.length ; i++){
			oPerson = oApprovedSteps.nextNode();
			oTaskInfo = oPerson.selectSingleNode("taskinfo");
			if ( oTaskInfo.getAttribute("rejectee") != 'y'){
				szTemp = oTaskInfo.getAttribute("wiid")+"@"+oPerson.getAttribute("name");
			}
		}
	}else if ( m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){
		oApprovedSteps =parent.processlist.m_oApvList.documentElement.selectNodes("division/step[@routetype='consult' ]/ou[taskinfo/@status='pending']/person[(taskinfo/@kind='normal' or taskinfo/@kind='charge') and taskinfo/@status='completed']");
		for(var i=0;i < oApprovedSteps.length ; i++){
			oPerson = oApprovedSteps.nextNode();
			oTaskInfo = oPerson.selectSingleNode("taskinfo");
			if ( oTaskInfo.getAttribute("rejectee") != 'y'){
				szTemp = oTaskInfo.getAttribute("wiid")+"@"+oPerson.getAttribute("name");
			}
		}
	}else{
			oApprovedSteps = parent.processlist.m_oApvList.documentElement.selectNodes("division/step[@routetype='approve' and not( @*='parallel') and .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed')]");			
			for(var i=0;i < oApprovedSteps.length ; i++){
				oStep = oApprovedSteps.nextNode();
				oPerson = oStep.selectSingleNode("ou/(person|role)");
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