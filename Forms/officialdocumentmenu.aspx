<%@ Page Language="C#" AutoEventWireup="true" CodeFile="officialdocumentmenu.aspx.cs" Inherits="Forms_officialdocumentmenu" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >
<html xmlns="http://www.w3.org/1999/xhtml">
	<head runat="server">
		<meta http-equiv="Content-Language" content="ko" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Form Menu</title>
		<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js"></script>	
		<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Dictionary.js"></script>		
		<script type="text/javascript" language="javascript" src="../../common/script/COVIFlowNet/openWindow.js"></script>
		<script type="text/javascript" language="javascript" src="formmenu.js"></script>
		<script type="text/javascript" language="javascript" src="officialdocumentmenu.js"></script>
	</head>
	<body leftmargin="0" topmargin="0" marginheight="0" marginwidth="0" ondragstart="return false" onselectstart="return false"> 
	    <div id="dellink"></div>
	    <textarea style="display:none" id="field" name="APVLIST"></textarea>
        <div class="Approval_Btn" id="divMenu">   
            <div style="width: 800px; height: 27px; background: url(<%=Session["user_thema"] %>/Covi/Common/btn/btn_group03_bg.gif); padding-top: 4px;padding-left:10px; padding-right:10px;">
                <span >
                    <!-- 발행매수--><span id="lblNumber" name="cbBTN" style="display: none;"><%= Resources.Approval.lbl_doc_number%> <input type="text" value="1" id="txtIssueCount" size="3"></span>
                    <!-- 수정    --><span id="btModify" name="cbBTN" onclick="doButtonAction2(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.btn_modify %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
                    <!-- 저장    --><span id="btSave" name="cbBTN" onclick="doButtonAction2(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_generic.gif" align="middle" /><%= Resources.Approval.btn_save%></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
	                <!-- 임시저장--><span id="btTempSave" name="cbBTN" onclick="doButtonAction2(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_save.gif" align="middle" /><%= Resources.Approval.btn_tempsave%></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
	                <!-- 첨부    --><span id="btAttach" name="cbBTN" onclick="doButtonAction2(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_append.gif" align="middle" /><%= Resources.Approval.btn_attach%></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>       
	            </span>
                <span align="right">
                    <!-- 미리보기 --><span id="btPreView" name="cbBTN" onclick="doButtonAction2(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_preview.gif" align="middle" alt="<%= Resources.Approval.btn_preview %>" /></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>                    
			        <!-- 인쇄미리보기 --><span id="btPrintView" name="cbBTN" onclick="doButtonAction2(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_printview.gif" align="middle" /><%--<%= Resources.Approval.btn_printview %>--%></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			        <!-- 인쇄 --><span id="btPrint" name="cbBTN" onclick="doButtonAction2(this);" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_printing.gif" align="middle" /><%--<%= Resources.Approval.btn_print %>--%></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
			        <!-- 닫기(preview) --><span id="btExitPreView" name="btExitPreView" onclick="javascript:top.close();" style="display:none;"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_close.gif" align="middle" /><%= Resources.Approval.btn_close %></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
                </span>
		    </div>
		</div>
		<textarea id="BodyString" style="display:none;width:100; height:20"></textarea>
		<iframe src="" name="frAttachFiles" height="1" width="1" ></iframe>
  <form id="attachfile_form" name="attachfile_form" method="post" style="display:none;" action="">
  <input type="hidden" name="hidINIListFiles" id="hidINIListFiles" />
  <input type="hidden" name="hidlocation" id="hidlocation" />
  </form>
   		
	</body>
	<script type="text/javascript" language="javascript">
	    var gMessage9 = "<%= Resources.Approval.msg_009 %>";
	    var gMessage28 = "<%= Resources.Approval.msg_028 %>";
	    var gMessage72 = "<%= Resources.Approval.msg_072 %>";
	    var gMessage73 = "<%= Resources.Approval.msg_073 %>";
	    var gMessage77 = "<%= Resources.Approval.msg_077 %>";
	    var gMessage254 = "<%= Resources.Approval.msg_254 %>";
	    var gMessage255 = "<%= Resources.Approval.msg_255 %>";
	    var gMessage260 = "<%= Resources.Approval.msg_260 %>";
	    var gMessage261 = "<%= Resources.Approval.msg_261 %>";
	    var gLabel_personalSave	= "<%=Resources.Approval.lbl_personalSave %>";
	    var gLabel_composing	= "<%=Resources.Approval.lbl_composing %>";
	    var gLabel_save	= "<%=Resources.Approval.lbl_save %>";
    	
	    var g_imgBasePath = "<%=Session["user_thema"] %>";
	    var gLabel_year_1	= "<%=Resources.Approval.lbl_year_1 %>";
	    var gLabel_year_3	= "<%=Resources.Approval.lbl_year_3 %>";
	    var gLabel_year_5	= "<%=Resources.Approval.lbl_year_5 %>";
	    var gLabel_year_7	= "<%=Resources.Approval.lbl_year_7 %>";
	    var gLabel_year_10	= "<%=Resources.Approval.lbl_year_10 %>";
	    var gLabel_permanence	= "<%=Resources.Approval.lbl_permanence %>";
    	
	    var gFileAttachType = "<%=System.Web.Configuration.WebConfigurationManager.AppSettings["FileAttachType"] %>"; //첨부파일 컴퍼넌트 타입 체크
		var gLabel_AttachList = "<%=Resources.Approval.lbl_AttachList %>";
		function FormatStringToNumber(sValue){
			return parseInt(sValue);
		}
	</script>
</html>
