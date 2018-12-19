<%@ Page Language="C#" AutoEventWireup="true" CodeFile="formmenuExt.aspx.cs" Inherits="Approval_Forms_formmenuExt" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>제목 없음</title>
    <script type="text/javascript" language="javascript">
        window.onload= initOnload;
        function initOnload(){
            document.getElementsByName("APVLIST")[0].value = getInfo("apst");
        }
        function getInfo(sKey){try{return parent.g_dicFormInfo.item(sKey);}catch(e){alert(gMessage254+sKey+gMessage255);}} //"양식정보에 없는 키값["+sKey+"]입니다."
        function FormatStringToNumber(sValue){
	        return parseInt(sValue);
	    }
        //다국어처리
      function getLngLabel(szLngLabel, szType, szSplit){
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
    </script>
</head>
<body>
    <div id='dvTmp'></div>
	<textarea style="display:none" id="field" name="APVLIST"></textarea> <input type="hidden" id="field" name="PASSWORD" value="" />
	<input type="hidden" id="field" name="ACTIONINDEX" value="" /> <input type="hidden" id="field" name="ACTIONCOMMENT" value="" />
	<input type="hidden" id="field" name="SIGNIMAGETYPE" value="" /> <textarea style="display:none" id="RecDeptList" cols="0" rows="0"></textarea>
	<input type="hidden" id="field" name="bLASTAPPROVER" value="false" /> <input type="hidden" id="field" name="CHARGEID" value="false" />
	<input type="hidden" id="field" name="CHARGENAME" value="false" /><textarea id="BodyString" style="display:none;width:100; height:20" cols="0" rows="0"></textarea>
	<div id="dellink"></div>
	<script type="text/javascript" language="javascript">
			
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

			/** formeditor.js 용 리소스 파일 변수 Start **/
			var g_imgBasePath = "<%=Session["user_thema"] %>";
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
			var gLabel_oriapprover	= "<%=Resources.Approval.lbl_oriapprover %>";
			var gLabel_comment	= "<%=Resources.Approval.lbl_comment %>";
			var gLabel_disagree	= "<%=Resources.Approval.lbl_disagree %>";
			var gLabel_agree	= "<%=Resources.Approval.lbl_agree %>";
			var gLabel_reviewer	= "심의자";
			var gLabel_dept	= "<%=Resources.Approval.lbl_dept %>";
			var gLabel_jobposition	= "<%=Resources.Approval.lbl_jobposition %>";
			var gLabel_reviewresult	= "심의결과";
			var gLabel_reviewcomment	= "<%=Resources.Approval.lbl_comment %>";
			var gLabel_writedept	= "<%=Resources.Approval.lbl_writedept %>";
			var gLabel_approver	="<%=Resources.Approval.lbl_approver%>";
			var gLabel_Propdept	="<%=Resources.Approval.lbl_Propdept%>";
			var gLabel_Acceptdept	="<%=Resources.Approval.lbl_Acceptdept%>";
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
</script>	
</body>
</html>
