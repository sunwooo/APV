<%@ Page Language="C#" AutoEventWireup="true" CodeFile="FormMenu.aspx.cs" Inherits="COVIFlowNet_Forms_FormMenu" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head runat="server">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Form Menu</title>
		<!-- 공통 -->
		<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Config.js?v=1" ></script>
		<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/EmbedObject.js?v=1" ></script>
		<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js?v=1" ></script>
		<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Dictionary.js?v=1" ></script>
		<script type="text/javascript" language="javascript" src="../../common/script/COVIFlowNet/openWindow.js?v=1"></script>
        <script type="text/javascript" language="javascript" src="../../common/script/jquery-1.6.1.min.js?v=1"></script>
        <script type="text/javascript" language="javascript" src="../../SiteReference/js/jquery-1.7.2.min.js?v=1"></script>
        <script type="text/javascript" language="javascript" src="../../SiteReference/js/Silverlight.js?v=1"></script>
        <%--<script type="text/javascript" language="javascript" src="formmenu_ink.js"></script>--%>
		<script type="text/javascript" language="javascript" src="formmenu.js?v=1"></script>
	</head>
	<body leftmargin="0" topmargin="0" marginheight="0" marginwidth="0" ondragstart="return false" onselectstart="return false"> 
<!--	디버깅용 요소임-->
	<div id='dvTmp'></div>
	<textarea style="display:none" id="field" name="APVLIST"></textarea> <input type="hidden" id="field" name="PASSWORD" value="" />
	<input type="hidden" id="field" name="ACTIONINDEX" value="" /> <input type="hidden" id="field" name="ACTIONCOMMENT" value="" />
	<input type="hidden" id="field" name="SIGNIMAGETYPE" value="" /> <textarea style="display:none" id="RecDeptList" cols="0" rows="0"></textarea>
	<input type="hidden" id="field" name="bLASTAPPROVER" value="false" /> <input type="hidden" id="field" name="CHARGEID" value="false" />
	<input type="hidden" id="field" name="CHARGENAME" value="false" /><textarea id="BodyString" style="display:none;width:100; height:20" cols="0" rows="0"></textarea>
	<div id="dellink"></div>
	
	<!-- 버튼 영역 div 시작 -->
	<div class="Approval_Btn" id="divMenu">
		<%--<div style="width: 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_group03_left.gif" /></div>--%>
		<div style="width: 800px; height: 27px; background: url(<%=Session["user_thema"] %>/Covi/Common/btn/btn_group03_bg.gif); padding-top: 4px;padding-left:10px; padding-right:10px;">
			<!-- 저장 --><span id="btchangeSave" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%=Resources.Approval.btn_save  %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 편집 --><span id="btModify" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><span id='spnModifyImg'><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /></span><span id="spnModify"><%= Resources.Approval.btn_modify %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span></span>
			<!-- 후열 --><span id="btBypass" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.lbl_PApprvBypass %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 기안 --><span id="btDraft" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_drafting.gif" align="middle" /><%= Resources.Approval.btn_draft %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 결재 --><span id="btAction" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_decide.gif" align="middle" /><%= Resources.Approval.btn_apv %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 합의 --><span id="btApproved" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_approval.gif" align="middle" /><span id="spanbtApproved"><%= Resources.Approval.btn_apv%></span></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 반려 --><span id="btReject" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img id="btRejectImg" src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_rejection.gif" align="middle" /><span id="spanbtReject"><%= Resources.Approval.lbl_reject %></span></a><img id="btRejectLine" src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 보류 --><span id="btHold" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_reservation.gif" align="middle" /><%= Resources.Approval.lbl_hold %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>	 
			<!-- 지정반송 --><span id="btRejectedto" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_earmark.gif" align="middle" /><%= Resources.Approval.lbl_rejectedto %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 부서내반송 --><span id="btRejectedtoDept" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_earmark.gif" align="middle" /><%= Resources.Approval.btn_rejectedtodept %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>

			<!-- 결재하기 -->
			<span id="btApprove" style="display:none;">
				<a href="#" id="menu1" ctid="1" onclick="event_onmouseover(this);" class="Btn_Group03" ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_append.gif" align="middle" /><%= Resources.Approval.btn_approve %></a>
				<a href="#">
					<img src="<%=Session["user_thema"] %>/Covi/common/btn/btn_down.gif" id="menuview1" ctid="1" onclick="sub_event_onmouseover(this);" align="absmiddle" class="btn_select" />
					<img src="<%=Session["user_thema"] %>/Covi/common/btn/btn_up.gif" id="menuhide1" ctid="1" onclick="sub_event_onmouseout(this);" align="absmiddle" class="btn_select" style='display:none;' />
				</a>
				<img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" />
			</span>
			<!-- 문서정보 --><span id="btDoc" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.lbl_doc_infomation %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 결재선 --><span id="btLine" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_decide-sch.gif" align="middle" /><%= Resources.Approval.lbl_approver %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 수신처 --><span id="btRecDept" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.btn_recdept %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 전달 --><span id="btForward" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.btn_forward %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 회수 --><span id="btWithdraw" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_collection.gif" align="middle" /><%= Resources.Approval.btn_Withdraw %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>	  
			<!-- 취소 --><span id="btAbort" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_cancel.gif" align="middle" /><%= Resources.Approval.btn_cancel %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 승인취소 --><span id="btApproveCancel" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_dec-cansel.gif" align="middle" /><%= Resources.Approval.lbl_Approved%><%= Resources.Approval.btn_cancel %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 게시 --><span id="btPost" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.lbl_Post %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 변환 --><span id="btTrans" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.lbl_Trans %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 시행 --><span id="btITrans" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.lbl_ITrans %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 대외공문 --><span id="btOTrans" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.lbl_OTrans %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 성안문 --><span id="btArchives" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.lbl_Archives %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 번호발행 --><span id="btDocNo" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.lbl_Number_publication %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 직인 --><span id="btSign" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.lbl_OfficialSeal %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
            <!--2015.12.10 psw -->
			<!-- 접수 --><span id="btRec" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img id="spnReceiptImg" src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><span id="spnReceipt"><%= Resources.Approval.btn_receipt %></span></a><img id="spnReceiptIine" src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 결재선 --><span id="btDeptLine" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img id="spnApprovalLineImg" src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_decide-sch.gif" align="middle" /><span id="spnApprovalLine"><%= Resources.Approval.lbl_assignapprover %></span></a><img id="spnApprovalLineline" src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 결재선변경 --><span id="btAPVLINEModify" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_decide-sch.gif" align="middle" /><%= Resources.Approval.btn_apvlinemodify%></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 결재선저장 --><span id="btChgApv" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_decide-sch.gif" align="middle" /><%= Resources.Approval.btn_apprvline_save%></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 재기안 --><span id="btDeptDraft" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.btn_draft %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 담당자 --><span id="btCharge" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.btn_charge %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
            <!-- 임시저장 --><span id="btSave" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_save.gif" align="middle" alt="<%= Resources.Approval.btn_tempsave %>" /><%= Resources.Approval.btn_tempsave %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 회신 --><span id="btReturnForm" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" alt="<%= Resources.Approval.btn_docreply %>" /><%= Resources.Approval.btn_docreply %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 재사용 --><span id="btReUse" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.btn_reuse %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 파일첨부 --><span id="btAttached" style="display:none;"><a class="Btn_Group03" href="#" id="btAttach" name="cbBTN" onclick="doButtonAction(this);" style="vertical-align:middle;" ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_append.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_attachfile%></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 문서연결 --><span id="btDocLinked" style="display:none;"><a class="Btn_Group03" href="#" id="btDocLink" name="cbBTN" onclick="DocLink();" style="vertical-align:middle;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_connection.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_doclink %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 프로세스메뉴얼 --><span id="btPMed" style="display:none;"><a class="Btn_Group03" href="#" id="btPM" name="cbBTN" onclick="ProcessLink();" style="vertical-align:middle;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_p-manual.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_PM %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 지식첨부 --><span id="btEDMSAttached" style="display:none;"><a class="Btn_Group03" href="#" id="btEDMSAttach" name="cbBTN" onclick="doButtonAction(this);" style="vertical-align:middle;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_knowledge.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_attachknow %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!--긴급--><span id="li_urgent" style="display:none; cursor:default;"><a class="Btn_Group03" href="#" id="urgent" name="urgent" onclick="chk_urgent_onclick();"  style=" vertical-align:middle;display:none; cursor:default;"><input type="checkbox" name="chk_urgent" id="chk_urgent" onclick="chk_urgent_onclick()" value="0" /> <%= Resources.Approval.lbl_urgent_aprv %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!--emds첨부--><span id="li_edmschk" style="display:none;"><a class="Btn_Group03" href="#" id="edmschk" name="edmschk" onclick="chk_edmschk_onclick();"  style=" vertical-align:middle;display:none;"><input type="checkbox" name="chk_edmschk" id="chk_edmschk" onclick="chk_edmschk_onclick()" value="0" /> <%= Resources.Approval.btn_transdoc %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!--기밀--><span id="li_secrecy" style="display:none;"><a class="Btn_Group03" href="#" id="secrecy" name="secrecy" onclick="chk_secrecy_onclick()" style=" vertical-align:middle;display:none; cursor:default;"><input type="checkbox" name="chk_secrecy" id="chk_secrecy" onclick="chk_secrecy_onclick()" value="0" /> <%= Resources.Approval.lbl_secret_doc %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 미리보기 --><span id="btPreView" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_preview.gif" align="middle" alt="<%= Resources.Approval.btn_preview %>" /><%= Resources.Approval.btn_preview %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>		
			<!--가이드--><span id="btnGuide" onclick="eventent();"  style="display:none" ><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_p-manual.gif" align="middle" alt="<%= Resources.Approval.btn_guide %>" /><%= Resources.Approval.btn_guide %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>	
              
			<!--feedback기능 -->
			<span id="li_feedback" style="display:none;"><a class="Btn_Group03" href="#" id="feedback" name="feedback" onclick="chk_feedback_onclick()" style=" vertical-align:middle;display:none; cursor:default;"><input type="checkbox" name="chk_feedback" id="chk_feedback" onclick="chk_feedback_onclick()" value="0" /> feedback</a>&nbsp;<select id="selfeedback" name="selfeedback" onchange="selfeedback_onchange(this.value);">
					<option value="1" selected>1개월</option>
					<option value="2">2개월</option>
				</select>
				</span>
			<!-- 첨부 -->
			
			<!-- 확인 --><span style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn`_icon03_generic.gif" align="middle" /><%= Resources.Approval.btn_confirm %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<span id="" style="display:none;">
				<a href="#" id="menu2" ctid="2" onclick="event_onmouseover(this);doButtonAction(this);" class="Btn_Group03" ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_append.gif" align="middle" /><%= Resources.Approval.btn_attach %></a>
				<a href="#">
					<img src="<%=Session["user_thema"] %>/Covi/common/btn/btn_down.gif" id="menuview2" ctid="2" onclick="sub_event_onmouseover(this);" align="absmiddle" class="btn_select" />
					<img src="<%=Session["user_thema"] %>/Covi/common/btn/btn_up.gif" id="menuhide2" ctid="2" onclick="sub_event_onmouseout(this);" align="absmiddle" class="btn_select" style='display:none;' />
				</a>
				<img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" />
			</span>

			
			<!-- 조회 -->
			<span id="btView" style="display:none;">
				<a href="#" id="menu3" ctid="3" onclick="event_onmouseover(this);" class="Btn_Group03" ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_append.gif" align="middle" /><%= Resources.Approval.btn_reference %></a>
				<a href="#">
					<img src="<%=Session["user_thema"] %>/Covi/common/btn/btn_down.gif" id="menuview3" ctid="3" onclick="sub_event_onmouseover(this);" align="absmiddle" class="btn_select" />
					<img src="<%=Session["user_thema"] %>/Covi/common/btn/btn_up.gif" id="menuhide3" ctid="3" onclick="sub_event_onmouseout(this);" align="absmiddle" class="btn_select" style='display:none;' />
				</a>
				<img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" />
			</span>

			<!-- 메일보내기 --><span id="btMailSend" name="cbBTN"  onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_appmail.gif" align="middle" style="vertical-align:middle;" /><%= Resources.Approval.btn_mail %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
		  
			<!-- 옵션 -->
			<span id="btOption" style="display:none;">
				<a href="#" id="menu4" ctid="4" onclick="event_onmouseover(this);" class="Btn_Group03" ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_append.gif" align="middle" /><%= Resources.Approval.btn_form_option %></a>
				<a href="#">
					<img src="<%=Session["user_thema"] %>/Covi/common/btn/btn_down.gif" id="menuview4" ctid="4" onclick="sub_event_onmouseover(this);" align="absmiddle" class="btn_select" />
					<img src="<%=Session["user_thema"] %>/Covi/common/btn/btn_up.gif" id="menuhide4" ctid="4" onclick="sub_event_onmouseout(this);" align="absmiddle" class="btn_select" style='display:none;' />
				</a>
				<img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" />
			</span>		  
			
			<!-- 강제합의	 --><span id="btForcedConsent" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" alt="<%= Resources.Approval.btn_forcedconsent %>" /><%= Resources.Approval.btn_forcedconsent%></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 합의부서삭제 --><span id="btDCooRemove" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" alt="<%= Resources.Approval.btn_dcooremove %>" /><%= Resources.Approval.btn_dcooremove%></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 문서  삭제 --><span id="btDeleteDoc" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" alt="<%= Resources.Approval.btn_docdelete %>" /><%= Resources.Approval.btn_docdelete%></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!--(관)기안취소--><span id="btAdminAbort" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" alt="<%= Resources.Approval.btn_draftabort %>" /><%= Resources.Approval.btn_draftabort%></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
		</div>
		<%--<div style="width: 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_group03_right.gif" /></div>--%>
	</div>
	<!-- 2열버튼 영역 div 시작 -->
	<div class="App_Btn" id="divMenu02">
		<div style="width: 800px; height:26px; padding-top: 4px; padding-left:10px; padding-right:10px;">
			<!-- 의견 --><span id="btComment" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_opinion.gif" align="middle" /><%= Resources.Approval.btn_comment %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>		
			 <!-- Feedback의견 --><span id="btCommentFeedback" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_opinion.gif" align="middle" />Feedback</a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>		
		   <!-- 업무지시 --><span id="btOrder" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.btn_order %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 문서이관 --><span id="bt_adminedms" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.btn_transdoc %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			
			<!--양식변환--><span id="li_reform" style="display:none;"><a class="Btn_Group03" href="#" id="reform" name="reform" onclick="iconchange(4);"  style=" vertical-align:middle;display:none;"><input type="checkbox" name="chk_reform" id="chk_reform"  onclick="chk_reform_onclick()" value="0" /> <%= Resources.Approval.lbl_reform_doc%></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>	
			
			<!-- 의견보기 --><span id="li_btCommentView" style="display:none;"><a class="Btn_Group03" href="#" style="display:none;" id="btCommentView" name="cbBTN" onclick="doButtonAction(this);" ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_opinion-sch.gif" align="middle" />&nbsp;<%= Resources.Approval.lbl_comment_view %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 배포현황 --><span id="li_btCirculate_View" style="display:none;"><a class="Btn_Group03" href="#" style="display:none;" id="btCirculate_View" name="cbBTN" onclick="doButtonAction(this);" ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_cir-status.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_Circulation_View %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>	  
			<!-- 히스토리 --><span id="li_btHistory" style="display:;"><a class="Btn_Group03" href="#" style="display:;" id="btHistory" name="cbBTN" onclick="doButtonAction(this);"  ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_history.gif" align="middle" />&nbsp;<%= Resources.Approval.lbl_History %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>  
			<!-- 수신현황 --><span id="li_btReceiptView" style="display:none;"><a class="Btn_Group03" href="#" style="display:none;" id="btReceiptView" name="cbBTN" onclick="doButtonAction(this);" ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_cir-status.gif" align="middle" />&nbsp;<%= Resources.Approval.lbl_receipt_view %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			
			<!-- 배포 / 회람 --><span id="li_btCirculate" style="display:none;"><a class="Btn_Group03" href="#" id="btCirculate" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_circular.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_Circulate %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 게시발송 --><span id="li_btBBS" style="display:none;"><a class="Btn_Group03" href="#" id="btBBS" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_board.gif" align="middle" />&nbsp;<%= Resources.Approval.lbl_Notice_dispatch %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 메일보내기 --><span id="li_btMail" style="display:none;"><a class="Btn_Group03" href="#" id="btMail" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_mail.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_mail %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 수신/참조 --><span id="li_bt_receive_cc" style="display:none;"><a class="Btn_Group03" href="#" id="bt_receive_cc" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" />&nbsp;<%= Resources.Approval.bt_receive_cc %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			
			<!-- 후처리행위회람 -->
			<span id="btEtcDo" style="display:none;" >
				<a href="#" id="menu5" ctid="5" onclick="doButtonAction(this);" class="Btn_Group03" ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_circular.gif" align="middle" /><%= Resources.Approval.btn_Circulate %></a>			  
				<img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" />
			</span>
			
			<!-- PC SAVE -->
			<span id="btPcSave" name="cbBTN"  onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_save.gif" align="middle" /><%= Resources.Approval.btn_PCSave %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 추가기능 --><span id="btExt" name="cbBTN"  onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_print.gif" align="middle" /><span id="spanExt"><%= Resources.Approval.btn_print %></span></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
            <!--다음 대외공문 기안시 미리보기 --><span id="btOTransPV" name="cbBTN"  onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_appprint.gif" align="middle" /><span id="spanOTransMail"><%= Resources.Approval.lbl_OTransPV%></span></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!--다음 대외공문 메일발송   --><span id="btOTransMail" name="cbBTN"  onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_appmail.gif" align="middle" /><span id="span1">잉크쓰기</span></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 인쇄 --><span id="btPrint" name="cbBTN" onclick="doButtonAction(this);" style="display:;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_printing.gif" align="middle" /><%= Resources.Approval.btn_print %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 인쇄미리보기 --><span id="btPrintView" name="cbBTN" onclick="doButtonAction(this);" style="display:;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_printview.gif" align="middle" /><%= Resources.Approval.btn_printview %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 본문인쇄 --><span id="btPrintOnlyBody" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_printview.gif" align="middle" /><%= Resources.Approval.btn_PrintBody %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
            <!-- 닫기 --><span id="btExit" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_close.gif" align="middle" /><%= Resources.Approval.btn_close %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 닫기(preview) --><span id="btExitPreView" name="btExitPreView" onclick="javascript:top.close();" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_close.gif" align="middle" /><%= Resources.Approval.btn_close %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			
			<!-- URL --><span id="btUrl" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn_type2/btn_icon01_copy.gif" align="middle" /><%= Resources.Approval.btn_Url %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 기타 --><span style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></a></span>
			<!-- 임시메모 --><span id="btnTempMemo" name="btnTempMemo" onclick="javascript:tempMemo();" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_list.gif" align="middle" /><%= Resources.Approval.btn_TempMemo %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			<!-- 미니창 --><span id="btMinimize" name="btMinimize" onclick="Minimize()" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_mini.gif" align="middle" alt="<%= Resources.Approval.lbl_Mini_Window2 %>" /><%= Resources.Approval.lbl_Mini_Window2 %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
		</div>
	</div>
	<!-- 2열버튼 영역 div 끝 -->
	<!-- 버튼 영역 div 끝 -->
	<div id="oPopUpHTML1" style='display:none;'>
		<div class="Btn_G">
			<ul></ul>
		</div>
	</div>
	<div id="oPopUpHTML2" style='display:none;'><!-- 파일첨부 --><!-- 문서연결 --><!-- 프로세스메뉴얼 --><!-- 지식첨부 -->
		<div class="Btn_G">
			<ul>
				<%--<li><a class="Btn_Group03" href="#" id="btAttach" name="cbBTN" onclick="parent.doButtonAction(this);parent.iconchange(2);" style="display:none; vertical-align:middle; width: 96%;" ><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_append.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_attachfile%></span>	</a></li>
				<li><a class="Btn_Group03" href="#" id="btDocLink" name="cbBTN" onclick="parent.DocLink();parent.iconchange(2);" style="width:96%;display:none; vertical-align:middle;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_connection.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_doclink %></span></a></li>
				<li><a class="Btn_Group03" href="#" id="btPM" name="cbBTN" onclick="parent.ProcessLink();parent.iconchange(2);" style="width: 96%;display:none; vertical-align:middle;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_p-manual.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_PM %></span></a></li>
				<li><a class="Btn_Group03" href="#" id="btEDMSAttach" name="cbBTN" onclick="parent.doButtonAction(this);parent.iconchange(2);" style="width: 96%;display:none; vertical-align:middle;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_knowledge.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_attachknow %></span></a></li>--%>
			</ul>
		</div>
	</div>
	<!-- 의견보기 --><!-- 배포현황 --><!-- 히스토리 --><!-- 수신현황 -->
	<div id="oPopUpHTML3" style='display:none;'>
		<div class="Btn_G">
			<ul>
				<%--<li id="li_btCommentView" style="display:none;"><a class="Btn_Group03" href="#" style="display:none;" id="btCommentView" name="cbBTN" onclick="parent.doButtonAction(this);parent.iconchange(3);" style="width:96%;" ><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_opinion-sch.gif" align="middle" />&nbsp;<%= Resources.Approval.lbl_comment_view %></span></a></li>
				<li id="li_btCirculate_View" style="display:none;"><a class="Btn_Group03" href="#" style="display:none;" id="btCirculate_View" name="cbBTN" onclick="parent.doButtonAction(this);parent.iconchange(3);" style="width:96%;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_cir-status.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_Circulation_View %></span></a></li>	  
				<li id="li_btHistory" style="display:;"><a class="Btn_Group03" href="#" style="display:;" id="btHistory" name="cbBTN" onclick="parent.doButtonAction(this);parent.iconchange(3);" style="width:96%;" ><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_history.gif" align="middle" />&nbsp;<%= Resources.Approval.lbl_History %></span></a></li>  
				<li id="li_btReceiptView" style="display:none;"><a class="Btn_Group03" href="#" style="display:none;" id="btReceiptView" name="cbBTN" onclick="parent.doButtonAction(this);parent.iconchange(3);" style="width:96%;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_cir-status.gif" align="middle" />&nbsp;<%= Resources.Approval.lbl_receipt_view %></span></a></li>--%>	  
			</ul>
		</div>
	</div>
	<!--긴급--><!--emds첨부--><!--기밀--><!--양식변환-->   
		<!-- 체크 박스 나오는 곳 시작 -->
	<div id="oPopUpHTML4" style="display:none;">
		<div class="Btn_G">
			<ul id="divcheck">
				<%--<li id="li_urgent" style="display:none;"><a class="Btn_Group03" href="#" id="urgent" name="urgent onclick="parent.chk_urgent_onclick();parent.iconchange(4);"  style=" vertical-align:middle;width:96%;display:none;"><input type="checkbox" name="chk_urgent" id="chk_urgent" onclick="parent.chk_urgent_onclick()" value="0" /><span> <%= Resources.Approval.lbl_urgent_aprv %>&nbsp;</span></a></li>
				<li id="li_edmschk" style="display:none;"><a class="Btn_Group03" href="#" id="edmschk" name="edmschk" onclick="parent.chk_edmschk_onclick();parent.iconchange(4);"  style=" vertical-align:middle;width:96%;;display:none;"><input type="checkbox" name="chk_edmschk" id="chk_edmschk" onclick="parent.chk_edmschk_onclick()" value="0" /><span> <%= Resources.Approval.btn_transdoc %></span></a></li>
				<li id="li_secrecy" style="display:none;"><a class="Btn_Group03" href="#" id="secrecy" name="secrecy" onclick="parent.iconchange(4);"  style=" vertical-align:middle;width:96%;display:none;"><input type="checkbox" name="chk_secrecy" id="chk_secrecy" onclick="parent.chk_secrecy_onclick()" value="0" /><span> <%= Resources.Approval.lbl_secret_doc %></span></a></li>
				<li id="li_reform" style="display:none;"><a class="Btn_Group03" href="#" id="reform" name="reform" onclick="parent.iconchange(4);"  style=" vertical-align:middle;width:96%;display:none;"><input type="checkbox" name="chk_reform" id="chk_reform"  onclick="parent.chk_reform_onclick()" value="0" /><span> <%= Resources.Approval.lbl_reform_doc%></span></a></li>	--%>
			</ul>
		</div>
	</div>
		<!-- 체크 박스 나오는 곳 끝 -->
	<!-- 완료 되었을 경우 할 수 있는 행위 모음 -->
	<div id="oPopUpHTML5" style='display:none;'>
		<div class="Btn_G">
			<ul>	  
				<%--<li><a class="Btn_Group03" href="#" id="btCirculate" name="cbBTN" onclick="parent.doButtonAction(this);parent.iconchange(5);" style="display:none;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_circular.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_Circulate %></span></a></li>
				<li><a class="Btn_Group03" href="#" id="btBBS" name="cbBTN" onclick="parent.doButtonAction(this);parent.iconchange(5);" style="display:none;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_board.gif" align="middle" />&nbsp;<%= Resources.Approval.lbl_Notice_dispatch %></span></a></li>
				<li><a class="Btn_Group03" href="#" id="btMail" name="cbBTN" onclick="parent.doButtonAction(this);parent.iconchange(5);" style="display:none;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_mail.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_mail %></span></a></li>
				<li><a class="Btn_Group03" href="#" id="bt_receive_cc" name="cbBTN" onclick="parent.doButtonAction(this);parent.iconchange(5);" style="display:none;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" />&nbsp;<%= Resources.Approval.bt_receive_cc %></span></a></li>--%>
			</ul>
		</div>
	</div>
	
	<!-- 임시메모 -->
	<div id="divTempMemo" style="display:none; padding-left:0px; width:796px;">
		<textarea id="sTempMemo" rows="4" cols="" style="width:100%; font-size:11pt; padding-left:3px; overflow-y:auto; border-left:none; border-right:none; border-top:none;" onfocus="dragApp();"></textarea>
	</div>
	<!-- 미니창 -->
	<div id="divMini">
		<div id="divminimenu" class="Approval_Btn"  style="display:none;">
			<div style="width: 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_group03_left.gif" /></div>
			<div class="AlignR" style="width: 327px; height: 31px; background: url(<%=Session["user_thema"] %>/Covi/Common/btn/btn_group03_bg.gif); padding-top: 4px;"><a class="Btn_Group03" href="#" id="btMinimize2" name="btMinimize2" onclick="Minimize()"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_big.gif" align="middle" /><%= Resources.Approval.lbl_Mini_window %></span></a></div>
			<div style="width: 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_group03_right.gif" /></div>
		</div>
		<!-- 버튼 영역 div 끝 -->
		  <!-- 양식명, 제목 div 시작 -->
		  <div id="divminiform" style="display:none;">
		  <div class="popup_box" style=" margin-top: 5px; margin-left: 8px; margin-right: 5px;">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			  <tr>
				<td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_top_left.gif" /></td>
				<td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_top_bg.gif"></td>
				<td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_top_right.gif" /></td>
			  </tr>
			  <tr>
				<td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_left_bg.gif"></td>
				<td style=" padding-top: 5px; padding-bottom: 5px;"><table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
					  <td width="55" style=" padding-left: 10px; padding-bottom: 10px;"><b><%=Resources.Approval.lbl_form %> :</b></td>
					  <td style=" padding-bottom: 10px;"><span style=" color: #000000; font-size: 14px; font-weight:bold" id="formname" name="formname"></span></td>
					</tr>
					<tr>
					  <td colspan="2" class="line"></td>
					</tr>
					<tr>
					  <td style=" padding-left: 10px; padding-top: 10px;"><b><%=Resources.Approval.lbl_subject %>  :</b></td>
					  <td style=" padding-top: 10px;"><span style=" color: #992300; font-weight:bold"  id="formsubject" name="formsubject"></span></td>
					</tr>
				</table></td>
				<td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_right_bg.gif"></td>
			  </tr>
			  <tr>
				<td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_bottom_left.gif" /></td>
				<td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_bottom_bg.gif"></td>
				<td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_bottom_right.gif" /></td>
			  </tr>
			</table>
		  </div>
		  <!-- 양식명, 제목 div 끝 -->   
		  </div>
	</div>
		<form id="frPCSAVE" name="frPCSAVE" method="post"  target="frAttachFiles" action="">
			<textarea id="txtHTML" name="txtHTML" rows="" cols="" style="display:none;" ></textarea>
		</form>
	<!--2006.12.05 by wolf 첨부파일 처리용 IFrame-->
	<iframe src="" name="frAttachFiles" height="1" width="1" ></iframe>
	<!--2006.12.05 by wolf 첨부파일 처리용 IFrame End-->
	<form name="mailform" method="post" style="display:none">
	<input type="hidden" name="Subject" />
	<input type="hidden" name="HTMLBody" value="" /> 
	<input type="hidden" name="attachfiles" />
   </form>
  <form id="attachfile_form" name="attachfile_form" method="post" style="display:none;" action="">
  <input type="hidden" name="hidINIListFiles" id="hidINIListFiles" />
  <input type="hidden" name="hidlocation" id="hidlocation" />
  </form>
  <!--메신져클라이언트 결재카운터 호출위한 나라비젼측 페이지호출용 IFrame (2013-02-25 HIW)-->
  <iframe src="" name="frmMessengerNotice" height="1" width="1" ></iframe>
   
<!-- 결재선저장 <span id="btChgApv" name="cbBTN" onclick="doButtonAction(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" alt="<%= Resources.Approval.btn_docreply %>" /><%= Resources.Approval.btn_docreply %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>-->
<!-- 승인 <li><a class="Btn_Group03" href="#" id="btApproved" name="cbBTN" onclick="parent.doButtonAction(this);parent.iconchange(1);" style="width:96%;display:none;" ><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_approval.gif" align="middle" /><%= Resources.Approval.lbl_Approved %></span></a></li>-->
<!-- 반려 <li><a class="Btn_Group03" href="#" id="btReject" name="cbBTN" onclick="parent.doButtonAction(this);parent.iconchange(1);" style="width:96%;display:none;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_rejection.gif" align="middle" /><%= Resources.Approval.lbl_reject %></span></a></li>-->
<!-- 보류 <li><a class="Btn_Group03" href="#" id="btHold" name="cbBTN" onclick="parent.doButtonAction(this);parent.iconchange(1);" style="width:96%;display:none;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_reservation.gif" align="middle" /><%= Resources.Approval.lbl_hold %></span></a></li>-->
 
	<script type="text/javascript" language="javascript">
			
			/*
					200110_김선재 : 내부회계 관련 문서 작성가이드 적용
			*/
			if(getInfo("fmpf").indexOf("WF_FORM_ISU_ACCOUNTING") != -1) {console.log($("#btnGuide").html().replace(/결재 가이드/g, '작성 가이드'));
                btnGuide.style.display="";
                // 버튼명칭 변경 : 결재 가이드 -> 작성 가이드
                $("#btnGuide").html(
                		$("#btnGuide").html().replace(/결재 가이드/g, '작성 가이드')
                );

			}else if("<%=Session["user_ent_code"].ToString()%>" == "ISU_ST"){
                btnGuide.style.display="";
                
      }else if("<%=Session["user_ent_code"].ToString()%>" == "ISU"){
                btnGuide.style.display="";
                
			}else{
                btnGuide.style.display="none";
           }

            function eventent(){
            
                //alert("<%=Session["user_ent_code"].ToString()%>");
                /*
										200110_김선재 : 내부회계 관련 문서 작성가이드 적용
								*/
                if(getInfo("fmpf").indexOf("WF_FORM_ISU_ACCOUNTING") != -1){
                    
                    url = "http://gw.isu.co.kr/Coviweb/Approval/Forms/formGuideInAcc.aspx";
                    targetName = "guide"

                    window.open(url, targetName, "height=710,width=860,status=yes,toolbar=no,menubar=no, scrollbars=yes, resizable=yes") ;
                }else if("<%= Session["user_ent_code"].ToString() %>" == "ISU_ST"){
                    
                    url = "http://gw.isu.co.kr/Coviweb/Approval/Forms/formGuide.aspx";
                    targetName = "guide"

                    window.open(url, targetName, "height=810,width=1200,status=yes,toolbar=no,menubar=no, scrollbars=yes, resizable=yes") ;
                }else if("<%= Session["user_ent_code"].ToString() %>" == "ISU"){
                    
                    url = "http://gw.isu.co.kr/Coviweb/Approval/Forms/formGuideIsu.aspx";
                    targetName = "guide"

                    window.open(url, targetName, "height=730,width=1000,status=yes,toolbar=no,menubar=no, scrollbars=yes, resizable=yes") ;
                }
                
            }
			
            var gMessengerCallURL = '<%=System.Configuration.ConfigurationManager.AppSettings["MessengerCallURL"].ToString() %>';

			/** formmenu.js 용 리소스 파일 변수 Start  **/
			var gLabel__close2 = "<%= Resources.Approval.lbl_close2 %>";			
			var gLabel__writer = "<%= Resources.Approval.lbl_writer %>";
			var gLabel__ChargeDept_Rec = "<%= Resources.Approval.lbl_ChargeDept_Rec %>";
			var gLabel__open = "<%= Resources.Approval.lbl_open %>";			
			var gLabel__Charger = "<%= Resources.Approval.lbl_Charger %>";
			var gLabel__changeapprover = "<%= Resources.Approval.lbl_changeapprover %>";
			var gLabel__draft = "<%= Resources.Approval.lbl_Draft %>";
			var gLabel__redraft = "<%= Resources.Approval.lbl_redraft %>";
			var gLabel__app = "<%= Resources.Approval.lbl_app %>";
			var gLabel__Trans1 = "<%= Resources.Approval.lbl_Trans1 %>";
			var gLabel__Trans2 = "<%= Resources.Approval.lbl_Trans2 %>";
			var gLabel__jic = "<%= Resources.Approval.lbl_jic %>";
			var gLabel__composing = "<%= Resources.Approval.lbl_composing %>";
			var gLabel__Doc_back = "<%= Resources.Approval.lbl_Doc_back %>";
			var gLabel__Doc_cancel = "<%= Resources.Approval.lbl_Doc_cancel %>";
			var gLabel__Approve_cancel = "<%= Resources.Approval.lbl_Approve_cancel %>";
			var gLabel__Doc_OK = "<%= Resources.Approval.lbl_Doc_OK %>";
			var gLabel__recieve_apv = "<%= Resources.Approval.lbl_recieve_apv %>";
			var gLabel__receive = "<%= Resources.Approval.lbl_receive %>";
			var gLabel__inactive = "<%= Resources.Approval.lbl_inactive %>";
			var gLabel__ChargeDept = "<%= Resources.Approval.lbl_ChargeDept %>";
			var gLabel__circulation_sent = "<%= Resources.Approval.lbl_circulation_sent %>";	
			var gLabel__personalSave = "<%= Resources.Approval.lbl_personalSave %>";
			var gLabel__recinfo_td2 = "<%= Resources.Approval.lbl_recinfo_td2 %>";
			var gLabel_inactive = "<%= Resources.Approval.lbl_inactive %>";
			/** formmenu.js 용 리소스 파일 변수 End **/
		
			var gMessage28 = "<%= Resources.Approval.msg_028 %>";
			var gMessage29 = "<%= Resources.Approval.msg_029 %>";			
			var gMessage54 = "<%= Resources.Approval.msg_054 %>";
			var gMessage55 = "<%= Resources.Approval.msg_055 %>";
			var gMessage67 = "<%= Resources.Approval.msg_067 %>";			
			var gMessage70 = "<%= Resources.Approval.msg_070 %>";
			var gMessage71 = "<%= Resources.Approval.msg_071 %>";
			var gMessage72 = "<%= Resources.Approval.msg_072 %>";		
			var gMessage73 = "<%= Resources.Approval.msg_073 %>";
			var gMessage74 = "<%= Resources.Approval.msg_074 %>";
			var gMessage75 = "<%= Resources.Approval.msg_075 %>";		
			var gMessage77 = "<%= Resources.Approval.msg_077 %>";
			var gMessage100 = "<%= Resources.Approval.msg_100 %>";		
			var gMessage170 = "<%= Resources.Approval.msg_170 %>";			
			var gMessage173 = "<%= Resources.Approval.msg_173 %>";			
			var gMessage181 = "<%= Resources.Approval.msg_181 %>";			
			var gMessage197 = "<%= Resources.Approval.msg_197 %>";			
			var gMessage198 = "<%= Resources.Approval.msg_198 %>";			
			var gMessage199 = "<%= Resources.Approval.msg_199 %>";			
			var gMessage200 = "<%= Resources.Approval.msg_200 %>";			
			var gMessage201 = "<%= Resources.Approval.msg_201 %>";			
			var gMessage202 = "<%= Resources.Approval.msg_202 %>";			
			var gMessage203 = "<%= Resources.Approval.msg_203 %>";			
			var gMessage204 = "<%= Resources.Approval.msg_204 %>";
			var gMessage254 = "<%= Resources.Approval.msg_254 %>";
			var gMessage255 = "<%= Resources.Approval.msg_255 %>";
			var gMessage256 = "<%= Resources.Approval.msg_256 %>";
			var gMessage257 = "<%= Resources.Approval.msg_257 %>";
			var gMessage264 = "<%= Resources.Approval.msg_264 %>";
			var gMessage288 = "<%= Resources.Approval.msg_288 %>";
			var gMessage289 = "<%= Resources.Approval.msg_289 %>";
			
			var gMessage324 = "<%= Resources.Approval.msg_324 %>";
            		var gMessage333 = "<%= Resources.Approval.msg_333 %>";

			var gMessage337 = "<%= Resources.Approval.msg_337 %>";

			/** formeditor.js 용 리소스 파일 변수 Start **/
			var g_imgBasePath = '<%="http://" + ConfigurationManager.AppSettings["LinKURL"].ToString() + Session["user_thema"] %>';
			var gLabel_approval = "<%=Resources.Approval.lbl_approval %>";
			var gLabel_reject	= "<%=Resources.Approval.lbl_reject %>";  
			var gLabel_charge	= "<%=Resources.Approval.lbl_charge %>";
			var gLabel_charge_person	= "<%=Resources.Approval.lbl_charge_person %>";
			var gLabel_authorize	= "<%=Resources.Approval.lbl_authorize %>";
			var gLabel_review	= "<%=Resources.Approval.lbl_review %>";
			var gLabel_substitue	= "<%=Resources.Approval.lbl_substitue %>";
			var gLabel_year	= "<%=Resources.Approval.lbl_year %>";
			var gLabel_month	= "<%=Resources.Approval.lbl_month %>";
			var gLabel_day	= "<%=Resources.Approval.lbl_day %>";
			var gLabel_auditdept	= "<%=Resources.Approval.btn_auditdept %>";
			var gLabel_comment	= "<%=Resources.Approval.lbl_comment %>";
			var gLabel_viewopinion	= "<%=Resources.Approval.lbl_viewopinion %>";
			var gLabel_bypass	= "<%=Resources.Approval.lbl_bypass %>";
			var gLabel_audit	= "<%=Resources.Approval.lbl_audit %>";
			var gLabel_consent	= "<%=Resources.Approval.lbl_consent %>";
			var gLabel_senddept	= "<%=Resources.Approval.lbl_send %><%=Resources.Approval.lbl_dept %>";
			var gLabel_reqdept	= "<%=Resources.Approval.lbl_reqdept %>";
			var gLabel_receivedept	= "<%=Resources.Approval.lbl_receive %><%=Resources.Approval.lbl_dept %>";
			var gLabel_managedept	= "<%=Resources.Approval.btn_managedept %>";
			var gLabel_apv	= "<%=Resources.Approval.lbl_Approved %>";
			var gLabel_gubun	= "<%=Resources.Approval.lbl_gubun %>";
			var gLabel_state = "<%=Resources.Approval.lbl_state %>"; 
			var gLabel_username	= "<%=Resources.Approval.lbl_username %>";
			var gLabel_jobtitle	= "<%=Resources.Approval.lbl_jobtitle %>";
			var gLabel_approvdate	= "<%=Resources.Approval.lbl_approvdate %>";
            var gLabel_consultdate	= "<%=Resources.Approval.lbl_ConsultDate %>";
			var gLabel_oriapprover	= "<%=Resources.Approval.lbl_oriapprover %>";
			var gLabel_comment	= "<%=Resources.Approval.lbl_comment %>";
			var gLabel_disagree	= "<%=Resources.Approval.lbl_reject %>";
            var gLabel_objection	= "<%=Resources.Approval.lbl_Objection %>";
			var gLabel_agree	= "<%=Resources.Approval.lbl_assist %>";  //lbl_agree
			var gLabel_reviewer	= "심의자";
			var gLabel_dept	= "<%=Resources.Approval.lbl_dept %>";
			var gLabel_jobposition	= "<%=Resources.Approval.lbl_jobposition %>";
			var gLabel_reviewresult	= "심의결과";
			var gLabel_reviewcomment	= "<%=Resources.Approval.lbl_comment %>";
			var gLabel_writedept	= "<%=Resources.Approval.lbl_writedept %>";
			var gLabel_approver	="<%=Resources.Approval.lbl_approver%>";
			var gLabel_Propdept	="<%=Resources.Approval.lbl_Propdept%>";
			var gLabel_Acceptdept ="<%=Resources.Approval.lbl_Acceptdept%>";
            var gLabel_Send_Dept = "<%= Resources.Approval.lbl_SendDept %>";
			var gLabel_assist	="<%=Resources.Approval.lbl_assist%>";
			var gLabel_send = "<%=Resources.Approval.lbl_send %>";
			var gLabel_receive = "<%=Resources.Approval.lbl_receive %>";
			var gLabel_approve = "<%=Resources.Approval.lbl_normalapprove %>";
			var gLabel_hold = "<%=Resources.Approval.lbl_hold %>";
			var gLabel_charge_apvline = "<%=Resources.Approval.lbl_charge_apvline %>";
			var gLabel_delete = "<%=Resources.Approval.lbl_delete %>";
			var gLabel_request	= "<%=Resources.Approval.lbl_request2 %>";
			var gLabel_management	= "<%=Resources.Approval.lbl_management %>";
			var gLabel_file_delete	= "<%=Resources.Approval.lbl_file_delete %>";
			var gLabel_investigation	= "<%=Resources.Approval.lbl_investigation %>";
			var gLabel_Approved	= "<%=Resources.Approval.lbl_Approved %>";
			var gLabel_year_1	= "<%=Resources.Approval.lbl_year_1 %>";
			var gLabel_year_3	= "<%=Resources.Approval.lbl_year_3 %>";
			var gLabel_year_5	= "<%=Resources.Approval.lbl_year_5 %>";
			var gLabel_year_7	= "<%=Resources.Approval.lbl_year_7 %>";
			var gLabel_year_10	= "<%=Resources.Approval.lbl_year_10 %>";
			var gLabel_year_15	= "<%=Resources.Approval.lbl_year_15 %>";
			var gLabel_permanence	= "<%=Resources.Approval.lbl_permanence %>";
			var gLabel_link_delete	= "<%=Resources.Approval.lbl_link_delete %>";
			var gLabel_dept_audit	= "<%=Resources.Approval.lbl_dept_audit %>";
			var gLabel_person_audit	= "<%=Resources.Approval.lbl_person_audit %>";
			var gLabel_person_audit1 = "<%=Resources.Approval.lbl_person_audit1 %>"
			var gLabel_person_audit2 = "<%=Resources.Approval.lbl_person_audit2 %>"
			var gLabel_dept_audit2 = "<%=Resources.Approval.lbl_dept_audit2 %>";
			var gLabel_ExtType = "<%=Resources.Approval.lbl_ExtType %>";
			var gLabel_ExtType1 = "<%=Resources.Approval.lbl_ExtType_disagree%>";
			var gLabel_ExtType2 = "<%=Resources.Approval.lbl_ExtType_agree%>";
			var gLabel_DeptConsent = "<%=Resources.Approval.lbl_DeptConsent%>";
			var gLabel_DeptAssist = "<%=Resources.Approval.lbl_DeptAssist%>";
			var gLabel_no = "<%=Resources.Approval.lbl_no %>";
			var gLabel_kind = "<%=Resources.Approval.lbl_kind %>";
			var gLabel_confirm = "<%=Resources.Approval.lbl_Confirm %>";
            var gLabel_ApprovalGubun = "<%=Resources.Approval.lbl_separation %>";
            var gLabel_DocCate = "<%=Resources.Approval.lbl_DocboxFolder %>";  //문서분류
            var gLabel_SaveTerm = "<%=Resources.Approval.lbl_retention %>";  //보존년한
            var gLabel_Subject = "<%=Resources.Approval.lbl_subject %>";  //제목
            var gLabel_Subject = "<%=Resources.Approval.lbl_AttachFile2 %>";  //첨부파일
            var gLabel_DocLinkInfo = "<%=Resources.Approval.lbl_DocLinkInfo %>";  //연결문서
            var gLabel_Cc = "<%=Resources.Approval.lbl_cc %>";  //참조
            var gLabel_Approval2 = "<%=Resources.Approval.btn_approval2 %>";  //결재
            var gLabel_InnerApproval = "<%=Resources.Approval.lbl_InnerApproval %>";  //내부결재
            var gLabel_Number = "<%=Resources.Approval.lbl_Number %>";  //개
            var gLabel_StampRighter = "<%= Resources.Approval.lbl_StampRightsPerson2 %>";  //인장권자 

			var gLabel_ParallelAssist	="<%=Resources.Approval.lbl_parallel%><%=Resources.Approval.lbl_assist%>";
			var gLabel_serialAssist	="<%=Resources.Approval.lbl_serial%><%=Resources.Approval.lbl_assist%>";

			
			var gLabel_Months = <%=Resources.Approval.lbl_Months %>;
			var gLabel_Days = <%=Resources.Approval.lbl_Days %>;
	  
			var gLabel_AttachList = "<%=Resources.Approval.lbl_AttachList %>";
			/** formeditor.js 용 리소스 파일 변수 End **/
			
			var gMailDomain = "<%=System.Configuration.ConfigurationSettings.AppSettings["WF_MailDomain"]  %>";
			var g_szBaseURL = "<%=System.Configuration.ConfigurationSettings.AppSettings["MailCountUrl"]  %>";
			var gFileAttachType = "<%=System.Configuration.ConfigurationSettings.AppSettings["FileAttachType"] %>"; //첨부파일 컴퍼넌트 타입 체크
			var gMailSuffix = "<%=System.Configuration.ConfigurationSettings.AppSettings["MailSuffix"].ToString()%>";
			var gOUNameType = "<%=System.Configuration.ConfigurationSettings.AppSettings["Default_OUNameType"] %>";
			var gPrintType = "<%=System.Configuration.ConfigurationSettings.AppSettings["PrintType"].ToString()%>";
			var gDocboxMenu = "<%=System.Configuration.ConfigurationSettings.AppSettings["WF_DocboxMenu"].ToString()%>";

			var gLngIdx = <%=strLangIndex %>;
			
            var inkvisit = 0;

			////////////////////////3단 메뉴 보여주기///////////////////////
			var g_oPopEL			= null;
			var sgColorBasic		= '';//이준희(2008-03-04): 기본 배경색|글자색
			var sgColorMouseOver	= '';//이준희(2008-03-04): mouseover시의 배경색|글자색
			var	sgPrvEle			= '';//이준희(2008-03-04): 직전에 선택되었던 버튼의 ID
			var ogBtnProgressive	= null;//점진 노출 기호가 사용된 버튼임.
			// window.createPopup관련 함수 시작 by ssuby
			if (!window.ActiveXObject) {

				Object.prototype.attachEvent = function(event, handler) {
					this.addEventListener(event.substring(2), handler, false);
				};
				
				Document.prototype.createStyleSheet = function(cssPath) {
					var head = document.getElementsByTagName('HEAD').item(0);
					var style = document.createElement('link');
					style.href = cssPath;
					style.rel = 'stylesheet';
					style.type = 'text/css';
					head.appendChild(style);
				}; 

			    window.createPopup = crPopup;
			}

            //프로세스 종류 (2012-11-22 HIW)
            var gProcessKind = "";
            if (getInfo("scDRec") == "0" && getInfo("scChgr") == "0" && getInfo("scPRec") == "0" && getInfo("scChgrOU") == "0" && getInfo("scIPub") == "0" && getInfo("scGRec") == "0")  //품의프로세스인 경우
                gProcessKind = "Draft";  //품의 프로세스
            else if (getInfo("pdefname") == "ApprovalSystem-Request[0.0]")  
                gProcessKind = "Request";  //신청프로세스
            else
                gProcessKind = "Cooperate";  //협조프로세스


			function crPopup() {
				return new _popup();
			}

			function _popup() {
				//debugger;
				this.wnd = null;
				this.document = new Array();
				this.document.body = new Array();
				this.document.body.innerHTML = "";
				this.show = _show;
				this.hide = _hide;
			}

			function _show(iX, iY, iWidth, iHeight, elm) {
				if (this.wnd == null) {
					this.wnd = document.createElement("DIV");
					this.wnd.style.position = "absolute";
					this.wnd.style.top = 0;
					this.wnd.style.left = 0;
					this.wnd.style.visibility = 'hidden';
					elm.appendChild(this.wnd);
				}

				this.wnd.style.top = iY;
				this.wnd.style.left = iX;
				this.wnd.style.width = iWidth;
				this.wnd.style.height = iHeight;
				this.wnd.innerHTML = this.document.body.innerHTML;
				this.wnd.style.visibility = 'visible';
				//this.wnd.style.display = 'block';
				
			}

			function _hide() {
				this.wnd.style.visibility = 'hide';

			}
			// window.createPopup관련 함수 끝 by ssuby
			function event_onmouseover(obj)
			{
				g_oPopEL = obj;		   
			}
			
			function sub_event_onmouseover(obj)
			{
				g_oPopEL = obj;
				setTimeout("richDropDown()","1");
			}

			function sub_event_onmouseout(obj) {
				window.document.getElementById("menuview" + obj.getAttribute("ctid")).style.display=""; 
				window.document.getElementById("menuhide" + obj.getAttribute("ctid")).style.display="none";
				window.document.getElementById("oPopUpHTML" + obj.getAttribute("ctid")).style.display="none";			
			}

			var oPopup = window.createPopup();
			//oPopup.document.createStyleSheet(g_imgBasePath +"/css/css_style.css", 0);
			function richDropDown()
			{
			
				var el				= g_oPopEL;
				var oContextHTML	= window.document.getElementById("oPopUpHTML" + el.getAttribute("ctid"));
				var w				= "150";
				var sTmp			= '';		
		  		var oTmp			= null;
				if (oContextHTML == null)
				{
					return;
				}
				oContextHTML.style.display = "";				
				var h = oContextHTML.offsetHeight- 20;			   
				oContextHTML.style.display = "none";
				if(oContextHTML.childNodes[0].innerHTML == "")
				{
					h = 0;
					w = 0;
				}
				var oPopupBody = oPopup.document.body;
				oPopupBody.innerHTML = oContextHTML.innerHTML;
						try
						{//이준희(2008-02-28): 툴바상의 풀다운 목록에 대한 디자인상의 보정을 위해 추가함; 차후 CSS로 완전히 제어가 가능한지 고려해 볼 것.
							sTmp = fnAdjClass(oPopupBody);
							w = sTmp.split('|')[0];
							h = sTmp.split('|')[1];
						}
						catch(e)
						{
						}
						fadeIn(oPopupBody);
						oPopupBody.attachEvent("onclick", event_Popup_mouseleave);
						oPopupBody.attachEvent("onmouseleave", event_Popup_mouseleave);
						oPopupBody.attachEvent("ondragstart",event_false);
						oPopupBody.attachEvent("onselectstart",event_false);
						var iX = 0;//이준희(2008-02-27): 풀다운 목록이 해당 메뉴 아이템의 좌측 경계선에 X 좌표를 기준하도록 하기 위해 수정함.
						iX = fnGetX(-6);//oPopup.show(0, 20, w, h, el);//(X 좌표, Y 좌표, .....)
						oPopup.show(iX, 17, w, h, el);
						
						try
						{
							oTmp = el;
							sTmp = oTmp.src;
							if(sTmp == null)
							{
								oTmp = oTmp.children[1].firstChild;
								sTmp = oTmp.src;
							}
							sTmp = sTmp.toUpperCase();//점진노출 기호를 전환함.
							sTmp = sTmp.replace('BTN_DOWN.GIF', 'BTN_UP.GIF');
							oTmp.src = sTmp;
							ogBtnProgressive = oTmp;
						}
						catch(e)
						{
						}
						el = null;
						oContextHTML = null;  
					}

			function fnAdjClass(obj)
			{//이준희(2008-02-28): 툴바상의 풀다운 목록에 대한 디자인상의 보정을 위해 추가함; 차후 CSS로 완전히 제어가 가능한지 고려해 볼 것.
						var sRet	= '', sTmp = 0;
						var oLnks	= null;
						var i		= 0;
						var iUnit	= 0;//단위 행의 높이임.
						if(g_oPopEL.getAttribute("ctid")=="4")
						{
							iUnit = 29;
						}else{
							iUnit = 24;
						}
						try
						{//이하 효과 없음.
							oLnks = obj.document.body;//변수 용도 변경
							oLnks.oncontextmenu	= 'return false;';
							oLnks.ondragstart	= 'return false;';
							oLnks.onselectstart	= 'return false;';
						}
						catch(e)
						{
						}
						oLnks = obj.document.links;
						var ii=0;
						for(i = 0; i < oLnks.length; i++)
						{
							oLnks[i].style.paddingTop			= '5px';
							oLnks[i].style.paddingBottom		= '5px';
							oLnks[i].style.width				= '100%';
							oLnks[i].parentElement.style.width	= '100%';
							oLnks[i].onmouseover				= fnAdjOnMouseOver;
							oLnks[i].firstChild.onmouseover		= null;						
							oLnks[i].style.color				= '#ffffff';//Hover 효과를 무시하기 위함.
							oLnks[i].style.backgroundImage		= oLnks[i].currentStyle.backgroundImage;
							oLnks[i].style.cssText				= oLnks[i].style.cssText + ';selector-dummy: expression(this.hideFocus=true);';//탭 인덱스를 가진 요소의 테두리를 없애기 위함.
							if(oLnks[i].style.display == ""){
									ii++;
							}
						}
						sgColorBasic					= oLnks[1].currentStyle.backgroundColor + '|' + oLnks[1].currentStyle.color;//sgColorMouseOver				= oLnks[0].currentStyle.color + '|' + oLnks[0].currentStyle.backgroundColor;//sgColorMouseOver				= oLnks[0].currentStyle.backgroundColor + '|' + oLnks[0].currentStyle.color;
						sTmp = top.frames[1].document.body.currentStyle.backgroundColor;					
						sgColorMouseOver				= sTmp + '|' + oLnks[0].currentStyle.backgroundColor;//IE 6.0과 7.0에서 이 부분에 차이가 있음을 참고할 것.
						oLnks[0].style.color			= '#ffffff';
						oLnks[0].style.backgroundColor	= oLnks[1].currentStyle.backgroundColor;
						i--;
						try
						{
							if(oLnks[0].firstChild.tagName == 'INPUT')
							{//체크박스가 있는 행일 경우
								iUnit++;//단위 행의 높이는 1px이 증가함.
							}
							if(top.opener.top.location.href.indexOf('Debug=True') > -1 )
							{//디버깅용 라인임.
								;
							}
						}
						catch(e)
						{
						}					
						i = ii * iUnit + 2;//행수 * 단위 높이 + 상하 마진 
						sRet += '200';
						sRet += '|';
						sRet += i.toString();
						sgPrvEle = '';
						return sRet;
			}
			
			function fnAdjOnMouseOver()
			{
						var oLnks	= null;
						var i		= 0;
						var iCount	= 0;
						var sTmp	= '';
						oLnks = this.document.links;//sgBGMouseOver					= oLnks[0].currentStyle.backgroundColor;//if(this.currentStyle.backgroundColor == 'transparent')//if(this.currentStyle.backgroundColor == sgBGMouseOver)
						if(this.id == sgPrvEle)
						{//같은 A 요소 내에서 모자간에 이동할 경우						
							return;//함수를 탈출함.
						}
						sgPrvEle = this.id;					
						for(i = 0; i < oLnks.length; i++)
						{
							if(oLnks[i].id == this.id)
							{
								this.style.backgroundColor	= sgColorMouseOver.split('|')[0];					
								this.style.color = '#000000';
							}
							else
							{
								oLnks[i].style.backgroundColor	= sgColorBasic.split('|')[0];
								oLnks[i].style.color			= sgColorBasic.split('|')[1];//oLnks[i].style.backgroundColor	= this.style.color;//oLnks[i].style.color			= this.style.backgroundColor;//if(oLnks[i].style.backgroundColor.toUpperCase() == '#FFFFFF'){iCount++;}
							}
						}
			}
					
			function fnGetX()
			{//이준희(2008-02-27): 풀다운 목록이 해당 메뉴 아이템의 좌측 경계선에 X 좌표를 기준하도록 하기 위해 추가함.
						var iRet	= 0;
						var	iCnst	= 0;//아이콘을 기준으로 정렬하기 위한 보정 상수임.
						var oTmp	= null;
						iCnst = -5;
						oTmp = g_oPopEL.parentElement.parentElement;
						iRet = oTmp.offsetLeft - g_oPopEL.offsetLeft + iCnst;
						return iRet;
			}

			function event_Popup_mouseleave(oBtn)
			{
				oPopup.hide();		   
				//checkbox가 있는 경우 원래 html 에 해당 선택 값 넘기기
				var el = g_oPopEL;
				var oContextHTML = window.document.getElementById("oPopUpHTML" + el.ctid);
				if (oContextHTML != null ) {
					if (oContextHTML.innerHTML.indexOf("checkbox") > -1 ){
						var oPopupBody = oPopup.document.body;
						oContextHTML.innerHTML =  oPopupBody.innerHTML ;							   
					}
				}
				try
						{
							sTmp = ogBtnProgressive.src.toUpperCase();//점진노출 기호를 전환함.
							sTmp = sTmp.replace('BTN_UP.GIF', 'BTN_DOWN.GIF');
							ogBtnProgressive.src = sTmp;
						}
						catch(e)
						{
						}
						el				= null;
						oContextHTML	= null;
			}

			function fadeIn(obj)
			{
				obj.style.filter="blendTrans(duration=0.5)";
				if (obj.filters.blendTrans.status != 2)
				{
					obj.filters.blendTrans.apply();
					obj.filters.blendTrans.play();
				}
			}
					
			function iconchange(id)
			{
				window.document.getElementById("menuview" + id).style.display=""; 
				window.document.getElementById("menuhide" + id).style.display="none";			
			}
			 
			var PopUpWidth = 120;
			//팀장 여부 체크하기  Y/N(Y이면 팀장)
			var gManagerYN = "<%= GetManagerYN() %>";
			var gDeputyType = "<%=strDeputyType %>";//대결타입 T:대결자대결기간설정
			function event_false(oBtn){
				return false;
			}
		</script>
	<script language="javascript" type="text/javascript">

		document.getElementById("formname").innerHTML = parent.g_dicFormInfo.item("fmnm");

		function Test(){
			saveApvDocument('9999');
		}
		function DocLink(){
			var		iWidth=800;iHeight=510;sSize="fix";
			
			var		sUrl="../DocList/DocListSelect.aspx";
			//20060926이후창 변경		
			if(sUrl!=null)openWindow(sUrl,"",iWidth,iHeight,sSize);
		}	
		function InputDocLinks(szValue){
			
			m_oFormEditor.InputDocLinks(szValue);
		}
		//프로세스 메뉴얼 연결 200801 by sunny
		function ProcessLink(){
			//기본 연결 프로세스 메뉴얼이 있는 경우 자동 연결
			//2개 이상일 경우 하단의 프로세스 메뉴얼 활성화 및 link 제공
			//기본이 없는 경우 사용자 선택 창 open
			if(getInfo("scPMV") != ""){
				if(getInfo("scPMV").split("^").length > 1){
					m_oFormEditor.InputPMLinks(getInfo("scPMV"));
				}else{
					var aForm =getInfo("scPMV").split(";");
					var pmid = aForm[0];
					var pmnm = aForm[1];
					var FormUrl = "http://" + document.location.host +"/CoviBPM/COVIBPMNet/BPD/Common/BPDefiner/ProcessPool/ProcessMapView.aspx";
					var strNewFearture = ModifyWindowFeature('width=800,height=600');
					window.open(FormUrl+"?ProcessID="+pmid+"&Popup=true",'',strNewFearture);
					//window.open(FormUrl+"?ProcessID="+pmid+"&Popup=true",'','width=800,height=600');					
				}
			}else{
				var rgParams=null;
				rgParams=new Array();
			   
				var szFont = "FONT-FAMILY: '굴림';font-size:9px;";
				var nWidth = 640;
				var nHeight = 540;			
				var szURL = "/CoviBPM/COVIBPMNet/BPD/Admin/BPDefiner/Organization/OrganizationAuthority.aspx?System=APPROVAL";
				var szParam = "";
				if(m_oFormEditor.PMLINKS.value != ""){
				   var array = m_oFormEditor.PMLINKS.value.split("^");
				   for(var i=0; i < array.length ; i++){
						 if ( szParam != ""){
							szParam += "^";
						 }
						szParam += array[i].split(";")[0];
				   } 
				   if ( szParam != "") szURL = szURL + "&Check=" + szParam;
				}
				var vRetval = window.showModalDialog(szURL, rgParams, szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;help:no;");
				if (vRetval != null) {
					m_oFormEditor.PMLINKS.value = vRetval;			
					m_oFormEditor.InputPMLinks();
				}
			}
		}
		//미니창
		var formHTML="";
		var formdisplay="none";
		var szformwidth, szformheight;
		function Minimize() {
		    var szwidth, szheight;
		    try {
		        document.getElementById("formname").innerHTML = getInfo("fmnm");
		        if (m_oFormEditor.document.getElementsByName("SUBJECT")[0].value != "") {
		            document.getElementById("formsubject").innerHTML = m_oFormEditor.document.getElementsByName("SUBJECT")[0].value;
		        }

		        if (document.getElementById("divMenu").style.display == "") {
		            m_oFormEditor.document.getElementById("bodytable").style.display = "none";
		            formHTML = m_oFormEditor.document.getElementById("divforminfo").innerHTML;
		            formdisplay = m_oFormEditor.document.getElementById("divforminfo").style.display;
		            szwidth = 360; szheight = 200;
		            m_oFormEditor.document.getElementById("divforminfo").innerHTML = document.getElementById("divminiform").innerHTML;
		            m_oFormEditor.document.getElementById("divforminfo").style.display = "";

		            //강성채 추가 ..임시메모기능때문에
		            document.getElementById("divTempMemo").style.display = "none";
		            if (m_bTabForm) {
		            } else {
		                parent.document.getElementById("main").setAttribute("rows", "58,*,0");
		            }
		        } else {
		            m_oFormEditor.document.getElementById("bodytable").style.display = "";
		            m_oFormEditor.document.getElementById("divforminfo").innerHTML = formHTML;
		            m_oFormEditor.document.getElementById("divforminfo").style.display = formdisplay;
		            if (m_bTabForm) {
		                szwidth = "1024"; szheight = "740";
		            } else {
		                szwidth = "812"; szheight = "740";
		            }
		        }
		        if (m_bTabForm) {
		            top.resizeTo(szwidth, szheight);
		        } else {
		            if (window.parent.parent.location.href == window.parent.location.href) {
		                window.parent.resizeTo(szwidth, szheight);
		            }
		            else {
		                window.parent.parent.resizeTo(szwidth, szheight);
		            }
		        }
		        document.getElementById("divMenu").style.display = (document.getElementById("divMenu").style.display == "") ? "none" : "";
		        document.getElementById("divminimenu").style.display = (document.getElementById("divminimenu").style.display == "") ? "none" : "";
		    } catch (e) { }
		}
		
		//임시메모 2008.03 강성채
		function tempMemo(){
			document.getElementById("divTempMemo").style.display=(document.getElementById("divTempMemo").style.display=="none")?"":"none";
			if(document.getElementById("divTempMemo").style.display == ""){
				parent.document.getElementById("main").setAttribute("rows","135,*,0");
			}
			else{
				parent.document.getElementById("main").setAttribute("rows","58,*,0");
			}
		}
		function dragApp(){
		   document.oncontextmenu = function(){return true;}
		   document.onselectstart = function(){return true;}
		   document.ondragstart = function(){return true;}
		}
		function FormatStringToNumber(sValue){
			return parseInt(sValue);
		}

	</script>

	<script type="text/vbscript" language="vbscript">
		function ReplaceString(PName)	
			Dim strReplaceString 		
			strReplaceString =  Replace(PName, "%", "%25")
			strReplaceString = Replace(strReplaceString, "&", "%26")	
			strReplaceString = Replace(strReplaceString, "#", "%23")
			strReplaceString = Replace(strReplaceString, "+", "%2B")
			ReplaceString = Replace(strReplaceString, "''", "'")			 
		end function
		
'		function FormatStringToNumber(sValue)	
'			FormatStringToNumber= FormatNumber(sValue,0)			 
'		end function
	</script>	   


</body>
</html>
