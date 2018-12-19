<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DocListSelect.aspx.cs" Inherits="COVIFlowNet_Doclist_DocListSelect" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<html xmlns="http://www.w3.org/1999/xhtml" >
	<head runat="server">
		<title></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Cache-Control" content="no-cache" />
		<meta http-equiv="Pragma" content="no-cache" />
        <script language="javascript" type="text/javascript" src="../../common/script/CFL.js"></script>
		<script language="javascript" type="text/javascript" src="../../common/script/COVIFlowNet/openWindow.js"></script>
		<script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
	    <!-- 구 달력 관련  -->
        <!--<link type="text/css" rel="stylesheet" href="/coviweb/approval/forms/calendar/datepickercontrol.css" />-->
        <!-- 신 달력 관련  -->
        <link rel="stylesheet" href="/CoviWeb/SiteReference/Jcalendar/themes/base/jquery.ui.all.css"/>
        <script type="text/javascript" language="javascript"  src="/CoviWeb/SiteReference/Jcalendar/jquery-1.8.2.js"></script>
        <script type="text/javascript" language="javascript"  src="/CoviWeb/SiteReference/Jcalendar/JqueryDatePicker.js"></script>
        <script type="text/javascript" language="javascript"  src="/CoviWeb/SiteReference/Jcalendar/ui/jquery.ui.core.js"></script>
        <script type="text/javascript" language="javascript"  src="/CoviWeb/SiteReference/Jcalendar/ui/jquery.ui.datepicker.js"></script>
	</head>
<body leftmargin="0" topmargin="0" rightmargin="0" bottommargin="0" marginwidth="0" marginheight="0">
<div class="popup_title">
  <div class="title_tl">
    <div class="title_tr" style="background-position-y:0%">
      <div class="title_tc">
            <h2><span><%= Resources.Approval.msg_174 %></span></h2>
      </div>
    </div>
  </div>    
</div>
  <div class="Btn_L small" style="padding-left: 10px; padding-right: 10px;">
     <div><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_group01_left.gif" /></div>
        <div style="width: 760px; height: 28px; background: url(<%=Session["user_thema"] %>/Covi/Common/btn/btn_group01_bg.gif);">
          <ul style="margin: 0; padding: 0;">
            <li style=" width: 510px; padding-top: 1px;">
                <span style="display:none"><%= Resources.Approval.lbl_year %>:&nbsp;
                <select style="display:none" id="cboDate" name="cboDate" onchange="return cboDate_onchange1()" class="input">
                </select>&nbsp;&nbsp;&nbsp;<%= Resources.Approval.lbl_month %>:&nbsp;
                <select style="display:none" id="cboDate1" name="cboDate1" onchange="return cboDate_onchange()" class="input">
                <option value="total" selected><%= str_approve_sel_all%></option>
                </select>
                </span>
                <span id="spanSearch" style="width:100%;">
                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <tr>
                                <td height="25" class="SLPop"><b><%=Resources.Approval.lbl_search %></b></td>
                                <td>&nbsp;
                                    <select name="sel_Search" style="width:70px">
                                        <option value="PI_SUBJECT" selected><asp:Label runat="server" ID="lbl_Title" /></option>
<%--                                        <option value="PI_INITIATOR_NAME"><asp:Label runat="server" ID="lbl_Intiator" /></option>
                                        <option value="PI_INITIATOR_UNIT_NAME"><asp:Label runat="server" ID="lbl_InitUnit" /></option>--%>
                                     </select>
                                     &nbsp;
                                 </td>
                                 <td>
                                    <!--
                                    <input type="text" id="QSDATE" name="QSDATE" readonly="readonly" style='font-size:9pt; PADDING-LEFT: 3px; width:70px;' datepicker="true" datepicker_format="YYYY-MM-DD" /> 
                                    <input type="text" id="QEDATE" name="QEDATE" readonly="readonly" style='font-size:9pt; PADDING-LEFT: 3px; width:70px;' datepicker="true" datepicker_format="YYYY-MM-DD" /> 
                                    -->
                                    <input type="text" id="QSDATE" name="QSDATE" runat="server" readonly="readonly" style="font-size: 9pt; padding-left: 3px; width: 70px;"/>
                                    <input type="text" id="QEDATE" name="QEDATE" runat="server" readonly="readonly" style="font-size: 9pt; padding-left: 3px; width: 70px;"/>
                                 </td>
                                <td><input id="search" name="search" type="text" class="type-text" size="40" style="IME-MODE:active; height:20px; WIDTH:140px" onKeyPress="if (event.keyCode==13) cmdSearch_onClick();" /><a href="#" onclick="cmdSearch_onClick()"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_search02.gif" align="absmiddle" border="0" /></a></td>
                            </tr>
                        </table>                
                </span>
            </li>
            <li style=" width: 250px; padding-top: 4px; text-align:right;">
              <!-- 분류 select div 시작 -->
                <select id="cboDocListType" style="HEIGHT:20px;width:250px; font-size:9pt" name="cboDocListType" onchange="viewDocListType()" >
                    <%--<option value="1" selected>문서번호대장</option>
                    <option value="7">문서발송대장</option> 
                    <option value="2">수신대장</option>--%>
                    <!-- <option value="6">신청서접수대장</option> -->
                    <!-- <option value="3">대외문서등록대장</option> -->									
                    <option value="OLD-COMPLETED" selected><%=Resources.Approval.lbl_doc_person2%>-<%= Resources.Approval.lbl_doc_complete2%></option> <!--개인문서함-완료함-->
                    <%--<option value="OLD-CCINFO"><%=Resources.Approval.lbl_doc_person2%>-<%= Resources.Approval.lbl_doc_reference2%></option>--%>  
                    <option value="TCINFO"><%=Resources.Approval.lbl_doc_person2%>-<%= Resources.Approval.lbl_doc_circulation%></option>   <!--개인문서함-참조/회람함-->
                    <option value="OLD-A"><%=Resources.Approval.lbl_doc_dept2%>-<%= Resources.Approval.lbl_completedBox%></option>   <!--부서문서함-품의함-->
                    <option value="OLD-B"><%=Resources.Approval.lbl_doc_dept2%>-<%= Resources.Approval.lbl_doc_sent%></option>   <!--부서문서함-발신함-->
                    <option value="OLD-REC_COMPLETED"><%=Resources.Approval.lbl_doc_dept2%>-<%= Resources.Approval.lbl_doc_receiveprocess%></option>  <!--부서문서함-수신처리함-->
                    <%--<option value="DIST"><%=Resources.Approval.lbl_doc_dept2%>-<%= Resources.Approval.lbl_doc_circulation%></option>--%>    <!--부서문서함-참조회람함-->

                    <option value="MIG-INDI_COMPLETED"><%=Resources.Approval.lbl_old_doc%>-<%= Resources.Approval.lbl_doc_person2%>(<%= Resources.Approval.lbl_doc_complete2%>)</option>  <!--이관문서보관함-개인문서함(완료함)-->
                    <option value="MIG-INDI_CIRCU"><%=Resources.Approval.lbl_old_doc%>-<%= Resources.Approval.lbl_doc_person2%>(<%= Resources.Approval.lbl_doc_reference2%>)</option>  <!--이관문서보관함-개인문서함(참조함)-->
                    <option value="MIG-DEPT_DRAFT"><%=Resources.Approval.lbl_old_doc%>-<%= Resources.Approval.lbl_doc_dept2%>(<%= Resources.Approval.lbl_doc_deptcomplet%>)</option>  <!--이관문서보관함-부서문서함(품의함)-->
                    <option value="MIG-DEPT_SEND"><%=Resources.Approval.lbl_old_doc%>-<%= Resources.Approval.lbl_doc_dept2%>(<%= Resources.Approval.lbl_doc_sent%>)</option>  <!--이관문서보관함-부서문서함(발신함)-->
                    <option value="MIG-DEPT_RECPROCESS"><%=Resources.Approval.lbl_old_doc%>-<%= Resources.Approval.lbl_doc_dept2%>(<%= Resources.Approval.lbl_doc_receiveprocess%>)</option>  <!--이관문서보관함-부서문서함(수신처리함)-->
                </select>
              <!-- 분류 select div 끝 -->
            </li>
          </ul>
        </div>
       <div><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_group01_right.gif" /></div>
   </div>
    <!-- 게시판 리스트 div 시작 -->
    <div class="BTable" id="divworklist" style="padding-left: 10px; padding-right: 10px;">
	    <iframe id="docList"  name="docList"  width='100%' height='300' frameborder='0' src='' style='PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px;'></iframe>
    </div>
    <!-- 게시판 리스트 div 끝 -->
	<div class="Paging"><input name="gopage" type="text" class="input" size="4" onKeyPress="if (event.keyCode==13) go_page(this.value);" style="display:none">
		<a href="#" onclick="go_page('f')"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_start.gif" align="absmiddle" /></a>
		<a href="#" onclick="go_page('p')" ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_prev.gif" hspace="7" align="absmiddle" /></a>
		 <span id="totalpage"></span>
		<a href="#" onclick="go_page('n')"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_next.gif" hspace="7" align="absmiddle" /></a>
		<a href="#" onclick="go_page('l')"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_end.gif" align="absmiddle" /></a>
	</div>
	<div class="popup_Btn small AlignR">
		<a href="#" class="Btn04" id="btOK" name="cbBTN" onclick="javascript:OK();"><span><%= Resources.Approval.btn_doclink %></span></a> 
		<a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:window.close();"><span><%= Resources.Approval.btn_close %></span></a>
	</div>
	<iframe src="" name="result_fr" height="10" width="100" style="DISPLAY:none"></iframe>
	<form class="form" id="form1" method="post" name="myform" target="result_fr"></form>

    <input type="hidden" id="hidQSDATE" runat="server" />
    <input type="hidden" id="hidQEDATE" runat="server" />
    <script language="javascript" type="text/javascript">

        //JdatePicker 선언
        $(function () {
	        //html페이지에 삽입하는 경우
	        //jDatePicker("<%=QSDATE.ClientID%>", "ko-KR"); // id, 다국어 정보(한국어: ko-KR)
            //jDatePicker("<%=QEDATE.ClientID%>", "ko-KR");  // id, 다국어 정보(한국어: ko-KR)
            jDatePicker("<%=QSDATE.ClientID%>", "<%=slanguage %>"); // id, 다국어 정보
            jDatePicker("<%=QEDATE.ClientID%>", "<%=slanguage%>");  // id, 다국어 정보
        });

		var fldrName;
		var strDate;
		var aryDate;
		var bOnGoing;
		var strDate = new String();
		var aryDate = new Array();
		var sAuthDeptCode = "00080";//총무부
		var sUserDeptCode = '<%= Session["user_dept_code"].ToString()%>';
		var page = "1";
		var fmpf = opener.getInfo("fmpf");
		var gLabel_Months = <%=Resources.Approval.lbl_Months %>;
		var gLabel_Days = <%=Resources.Approval.lbl_Days %>;

		window.onload= initOnload;
        function initOnload()
        {
			strDate = "<%=strDate%>";
			aryDate = strDate.split("/"); 
			
			for(i=aryDate.length-1;i>-1;i--){
				aryDate1 = aryDate[i].split("#");  
				makeNode1(aryDate1[0]);
				if (aryDate1[0] == document.getElementById("cboDate").value){
					makeNode2(aryDate1[1]); 
				}
			}

			//document.getElementById("cboDate").text = "<%=strYear%>";
			document.getElementById("cboDate").value = "<%=strYear%>";
			//document.getElementById("cboDate1").text = "<%=Resources.Approval.lbl_total %>";
			document.getElementById("cboDate1").value = "<%=Resources.Approval.lbl_total %>";

			//2005.09.05 황선희 수정
			viewDocListType();	
            //검색창 활성화 시 기간 검색을 위한 시작날짜/끝날짜 디폴트값 입력(기간 한달)
		    document.getElementById("QSDATE").value = document.getElementById("hidQSDATE").value;
	        document.getElementById("QEDATE").value = document.getElementById("hidQEDATE").value;
        }
		function cboDate_onchange(){
			if (self.cboDate1.value == '<%=Resources.Approval.lbl_total %>'){
				fldrName = self.cboDate.value.substring(0,4);
			}else if (self.cboDate1.value.indexOf("월") == 2){
				fldrName = self.cboDate.value.substring(0,4) + self.cboDate1.value.substring(0,2);
			}else{
				fldrName = self.cboDate.value.substring(0,4) + "0" + self.cboDate1.value.substring(0,1);
			}	
			if (fldrName != ""){
				window.self.docList.location = "DocListItemsSelect.aspx?dept_code="+sUserDeptCode+"&docListType=" + "COMPLETED" + "&strMonth=" + fldrName;
			}
			return;
		}
		function cboDate_onchange1(){			
			var intCount = document.getElementById("cboDate1").options.length;
			for (i=intCount;i!=0;i--){
				document.getElementById("cboDate1").options.remove(i);			
			}
			strDate = "<%=strDate%>";
			aryDate = strDate.split("/");
			for(i=aryDate.length-1;i>-1;i--){
				aryDate1 = aryDate[i].split("#");  
				if (aryDate1[0] == document.getElementById("cboDate").value){
					makeNode2(aryDate1[1]); 
				}
				makeNode1(aryDate1[0]);
			}
			cboDate_onchange();				
			return;
		}
		function makeNode1(str){
			var oOption = document.createElement("OPTION");
			
			for (k=document.getElementById("cboDate").options.length-1;k>-1;k--){
				if(str == document.getElementById("cboDate").options[k].value){
					return; 
				}
			}
			document.getElementById("cboDate").options.add(oOption);
			oOption.text=str;
			oOption.value=str;	
			return;	
		}
		function makeNode2(str){
			var oOption = document.createElement("OPTION");	
			
			for (j=document.getElementById("cboDate1").options.length-1;j>-1;j--){
				if(str == document.getElementById("cboDate1").options[j].value){
					return;  
				}
			}
			document.getElementById("cboDate1").options.add(oOption);
			oOption.text=str;
			oOption.value=str;	
			return;	
		}
		function removeNode(str){
			var oChild=document.getElementById("cboDate").options.children(str);
			document.getElementById("cboDate").removeChild(oChild);
			return;
		}
		//function viewDocListType(){				
        function viewDocListType()
        {				
            if (( sAuthDeptCode == sUserDeptCode ) && (document.getElementById("cboDocListType").value == '4' )){
				//imgSave.style.display = "";
			}else{
				//imgSave.style.display = "none";
			}

            //기간 디폴트값 입력(기간 한달)
            //2014-10-28 hyh 수정
		    document.getElementById("QSDATE").value = document.getElementById("hidQSDATE").value;
	        document.getElementById("QEDATE").value = document.getElementById("hidQEDATE").value;			
            //document.getElementById("QSDATE").value = document.getElementById("QSDATE").value;
	        //document.getElementById("QEDATE").value = document.getElementById("QEDATE").value;			
            //2014-10-28 hyh 수정 끝
			if (document.getElementById("cboDate1").value == '<%=Resources.Approval.lbl_total %>'){
				fldrName = document.getElementById("cboDate").value.substring(0,4);
			}else if (document.getElementById("cboDate1").value.indexOf("월") == 2){
				fldrName = document.getElementById("cboDate").value.substring(0,4) + document.getElementById("cboDate1").value.substring(0,2);
			}else{
				fldrName = document.getElementById("cboDate").value.substring(0,4) + "0" + document.getElementById("cboDate1").value.substring(0,1);
			}	
			if (fldrName != ""){
				window.self.docList.location = "DocListItemsSelect.aspx?docListType=" + document.getElementById("cboDocListType").value + "&strMonth=" + fldrName;						
			}
			//return;	
		}
		function mastermail() {
			var modeUrl	= "http://" + window.document.location.host + "/CoviGWNet/person/mail/GGOI_newpost_W01.aspx?Cmd=new&MailTo=webmaster" ;
			CoviFullWindow(modeUrl,'','resize');
		}
		function CoviFullWindow(fileName,windowName,etcParam) {
			var x = 800;
			var y = 600;
			var sx = window.screen.width  / 2 - x / 2;
			var sy = window.screen.height / 2 - y / 2 - 40;

			if (etcParam == 'fix'){
				etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0";
			}else if (etcParam == 'resize'){
				etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1";
			}else if (etcParam == 'scroll'){
				etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1";
			}

			if (sy < 0 ) sy = 0;	
			var sz = ",top=" + sy + ",left=" + sx;
			if (windowName == "newMessageWindow") windowName = new String(Math.round(Math.random() * 100000));
			
			var strNewFearture = ModifyWindowFeature(etcParam + ",width=" + x + ",height=" + y + sz);
	        window.open(fileName,windowName,strNewFearture);
	        //window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
		}
		function openWindow(registered_id, serial_number) {
			//var szURL = "RegisterOutPubDocs.aspx?registered_id=" + registered_id + "&serial_number=" + serial_number;
			//CoviWindow(szURL, "newMessageWindow", 400, 370, "fix") ;
			var szURL = "../forms/form.aspx?fmid={A950BDB1C5CB456CBB7DB1F538F849B0}&fmnm=대외공문접수&fmpf=OUTERPUBLISH_ENFORCE&scid={59EF56B327824994B0494901FB5E22CF}&mode=DRAFT&fmrv=0&fmfn=OUTERPUBLISH_ENFORCE";


			CoviWindow(szURL, "Form", 380,250,'resize');
			//openWindow(strURL,"Form",710,600,'resize');

		}
		function go_page(spage){
			page = spage;
			docList.go_page(spage);
		}
		function OK(){
			opener.InputDocLinks(docList.getSelected());
				window.close();
		}
		function cmdSearch_onClick(){
			document.getElementById("docList").contentWindow.cmdSearch_onClick(document.getElementsByName("sel_Search")[0].value, document.getElementsByName("search")[0].value, document.getElementsByName("QSDATE")[0].value, document.getElementsByName("QEDATE")[0].value);
			//docList.cmdSearch_onClick(window.sel_Search.value, window.search.value, document.all("QSDATE").value, document.all("QEDATE").value);
			document.getElementById("search").value = "";
		}
		
	</script>	
    <script type="text/javascript" language="javascript" src="/coviweb/approval/forms/calendar/datepickercontrol.js"></script>
</body>
</html>

