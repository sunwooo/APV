<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListToDo.aspx.cs" Inherits="COVINet.COVIFlowNet.List" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ Register Src="Portal/UxFooter.ascx" TagName="UxFooter" TagPrefix="ucfooter" %>
<%@ Register Src="Portal/UxQuickMenu.ascx" TagName="UxQuickMenu" TagPrefix="ucquickmenu" %>

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>List</title>
    <link rel="alternate" type="application/rss+xml" title="결재함" href="/CoviWeb/Approval/Portal/GetRssData.aspx?location=APPROVAL"/>
	<style type="text/css">
	<!--
	    #SLayer {
		    position:absolute;
		    left:150px;
		    top:55px;
		    width:600px;
		    z-index:1;
	    }
        #oPopUpHTML1 {
            position:absolute;
            left:644px;
            top:94px;
            z-index:1;
        }
        -->
    </style>
    <link type="text/css" rel="stylesheet" href="/coviweb/approval/forms/calendar/datepickercontrol.css" /> 
	<script type="text/javascript" language="javascript" src="../common/script/CFL.js"></script>
	<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
	<!-- 달력 선택 참조  -->
</head>
<body>
<div id="SubWidth">
  <!-- 타이틀 영역 div 시작 -->
  <div class="Title">
    <h1><span id="spanArchived" style="display:none;">&nbsp;<%=Resources.Approval.lbl_old_doc %> - </span><asp:Label runat="server" ID="PageName" style="display:none;" /><span id="bar" style="display:none"> - </span><span id="foldername"></span></h1>
   <!-- 네비게이션 영역 시작 -->
    <ul class="small" style="display:none;">
      <li>Home&gt;</li>
      <li><asp:Label runat="server" ID="PagePath" />&gt;</li>
      <li><span id="spanArchivedPass" style="display:none;"><b><%=Resources.Approval.lbl_old_doc %></b></span></li>
      <li><b><asp:Label runat="server" ID="PageName2" /></b></li>
    </ul>
    <!-- 네비게이션 영역 끝 -->
    <!-- 타이틀 라인 시작 -->
    <%--<div class="Title_bg01"></div>
    <div class="Title_bg02"></div>--%>
  </div>
  <!-- 타이틀 라인 끝 -->
<!-- 버튼 영역 div 시작 -->
    <div class="n_btntb">
      <ul style="padding-top:0px;">
        <li id="btn_main">
            <a ID="btn_reload" class="btnov" href="#" onclick="javascript:refresh();" ><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_refresh.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_refresh %></span></a>
            <span ID="imgDelete" style="display:none;" >
            <a class="btnov" href="#" onclick="javascript:delete_onClick();" ><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_delete.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_delete %></span></a>
            </span>
            <span ID="spanApprove" style="display:none;" >
            <a class="btnov" href="#" onclick="javascript:approve_onClick();" ><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_decide.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_blocApprove %></span></a>
            </span>
            <span id="spanExcel" style="display:;">
            <a ID="approve_bt_excel" class="btnov" href="#" onclick="javascript:SavePC();" ><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_save.gif" align="middle" />&nbsp;<%= Resources.Approval.lbl_SaveToExcel %></span></a>
            </span>
            <span ID="btn_userfoldermove" style="display:none;">
            <a  class="btnov" href="#" onclick="javascript:foldermove_OnClick();" ><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_move.gif" align="middle" /><%=Resources.Approval.btn_userfoldercopy %></span></a>
            </span>
            <span ID="divbtnRSS" style="display:none;">
            <a  class="btnov" href="#" onclick="javascript:copyRSSUrl();" ><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_rss.gif" align="middle" /><%=Resources.Approval.btn_RSS %></span></a>
            </span>
			<span id="btn_search" style="display:;">
				<a class="btnov" href="#" onclick="javascript:search_OnClick();" ><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_search.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_search %></span></a>
			</span>
        </li>
        <!--
        <li style=" padding-top: 4px;"  id="ExpMenu" style="display:none;">
            <a class="btnov"  href="#" onclick="fn_ExtMenu();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_setting.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_extmenu %></span></a>
            <a id="menu1" ctid="1" onclick="event_onmouseover(this);" onmouseout="event_onmouseout(this);" style="display:none;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_group-select.gif" align="absmiddle" /></a>
        </li> 
        -->
        <li id="btn_option">
          <!-- 분류 select div 시작 -->
          <input type="checkbox" name="chktab" checked="checked" onclick="distab(this);" ID="chktab" style="CURSOR:hand"/>&nbsp;<asp:Label runat="server" ID="DisplayTab" />&nbsp;&nbsp;<!--탭보기-->
          <span style="display:none;"><input type="checkbox" name="chkView" onclick="disApv(this);" ID="chkView" style="CURSOR:hand">&nbsp;<asp:Label runat="server" ID="ApvLineView" />&nbsp;&nbsp;</span><!--결재선보기-->
	      <select id="kind" name="kind" onchange="group()"></select>
	      <select id="mode" name="mode" onchange="mode()"></select>
          <!-- 분류 select div 시작 -->
        </li>
      </ul>
    </div>
    <!--탭 div 시작-->
    <div class="tab01 small" id="divtab" style="display:;">
         <ul>
            <li id="divPREAPPROVAL" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);" id="_PREAPPROVAL" name="PREAPPROVAL" class="s1"><span><%= Resources.Approval.lbl_doc_pre2 %></span></a><!--예고함--></li>
            <li id="divAPPROVAL" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);"  id="_APPROVAL" name="APPROVAL" class="s1"><span><%= Resources.Approval.lbl_doc_approve2%></span></a><!--미결함--></li>            
            <li id="divPROCESS" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);"  id="_PROCESS" name="PROCESS" class="s1"><span><%= Resources.Approval.lbl_doc_process2%></span></a><!--진행함--></li>
            <li id="divTODO" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_TODO" name="TODO" class="s1"><span><%= Resources.Approval.lbl_doc_todo%></span></a><!--예고,미결,진행 2010.04.07 한송이  --></li>         
            <li id="divCOMPLETE" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);"  id="_COMPLETE" name="COMPLETE" class="s1"><span><%= Resources.Approval.lbl_doc_complete2%></span></a><!--완료함--></li>
            <li id="divFINISH" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_FINISH" name="FINISH" class="s1"><span><%= Resources.Approval.lbl_doc_complete2%></span></a><!--완료함(완료, 반려) 2010.04.07 한송이  --></li>            
            <li id="divREJECT" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);"  id="_REJECT" name="REJECT" class="s1"><span><%= Resources.Approval.lbl_doc_reject2%></span></a><!--반려함--></li>         
            <li id="divCCINFO" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);"  id="_CCINFO" name="CCINFO" class="s1"><span><%= Resources.Approval.lbl_doc_reference2%></span></a><!--참조함--></li>            
			<li id="Li1" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);"  id="A1" name="TCINFO" class="s1"><span><%= Resources.Approval.lbl_doc_circulation%></span></a><!--수신/참조함(회람함)--></li>                        
			<li id="divTCINFO" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_TCINFO" name="TCINFO" class="s1"><span><%= Resources.Approval.lbl_doc_circulation%></span></a><!--수신/참조함(회람함) 2010.04.07 한송이  --></li>                          
            <li id="divREVIEW1" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);"  id="_REVIEW1" name="REVIEW1" class="s1"><span><%= Resources.Approval.lbl_doc_review_all%></span></a><!--공람함 전체--></li>                          
			<li id="divREVIEW2" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);"  id="_REVIEW2" name="REVIEW2" class="s1"><span><%= Resources.Approval.lbl_doc_review_unread%></span></a><!--공람함 읽을함--></li>                          
			<li id="divREVIEW3" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);"  id="_REVIEW3" name="REVIEW3" class="s1"><span><%= Resources.Approval.lbl_doc_review_read%></span></a><!--공람함 읽은함--></li>
			<li id="divTEMPSAVE" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_TEMPSAVE" name="TEMPSAVE" class="s1"><span><%= Resources.Approval.lbl_composing2%></span></a><!--임시함--></li>                         
          </ul>
     </div>

    <!-- 게시판 리스트 div 시작 -->
    <div class="BTable" id="divworklist">
    <iframe id="iworklist" width='100%' height='100%' frameborder='0' src='' style='PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px;'></iframe>
    </div>
    <!-- 게시판 리스트 div 끝 -->
    <!-- list graphic div 시작 -->
    <div id="divApv" style="DISPLAY:none">
        <!-- 탭 div 시작 -->
        <div class="tab01 small pm_tab">
          <ul>
            <li id="divtabApvLine" style="display:;" class="current"><a href="#" class="s1" onclick="javascript:changeApv(this,'spanApvLine','','spanApvGraphic','none');" id="tabApvLine" name="tabApvLine"><span><%= Resources.Approval.lbl_list%></span></a></li>
            <li id="divtabApvGraphic" style="display:;"><a href="#" class="s1" onclick="javascript:changeApv(this,'spanApvLine','none','spanApvGraphic','');" id="tabApvGraphic" name="tabApvGraphic"><span><%= Resources.Approval.lbl_graphic%></span></a></li>
          </ul>
        </div>
        <!-- 탭 div 끝 -->
        <div>
            <span id="spanApvLine" name="spanApvLine">
			<iframe id="iApvLine" name="iApvLine" width="100%" height="100%" frameborder="0" src="about:blank" datasrc="../ApvlineMgr/ApvlineViewer.aspx" style="margin:0; padding:0; scroll=auto;"></iframe>
			</span>
			<span id="spanApvGraphic" style="DISPLAY: none" name="spanApvGraphic">
			<iframe id="iApvGraphic" style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; scroll: auto" dataSrc="./ApvMonitor/MonitorGraphic.aspx" name="iApvGraphic" src="./ApvMonitor/MonitorGraphic.aspx" frameBorder="0" width="100%" height="100%"></iframe>
			</span>        
        </div>     
    </div>
    <!-- list graphic div 끝 -->
     <!-- 검색 영역 div 시작 -->
     <div id="SLayer" class="Box06" style="display:none;">
      <div class="Box06_tl">
        <div class="Box06_tr">
          <div class="Box06_tc"></div>
        </div>
      </div>
      <div class="Box06_cl">
        <div class="Box06_cr">
          <div class="Box06_cc">
            <!-- 검색 조건 시작 -->
            <div class="Search">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>&nbsp;</td>
                  <td align="right">
                    <!-- 검색 시작 -->
                    <div id="span_search" style="display:none">  
                        <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td height="25" class="SLPop"><b><%=Resources.Approval.lbl_search %></b></td>
                                <td>&nbsp;                                 
                                    <select id="sel_Search" name="sel_Search" style="width:70"> 
                                        <option value="PI_NAME" selected ><asp:Label runat="server" ID="lbl_Title" /></option>
                                        <option value="PI_INITIATOR_NAME"><asp:Label runat="server" ID="lbl_Intiator" /></option>
                                     </select>
                                     &nbsp;
                                 </td>
                                 <td>
                                    <input type="text" id="QSDATE" name="QSDATE" readonly="readonly" style='font-size:9pt; PADDING-LEFT: 3px; width:70px;'  datepicker="true" datepicker_format="YYYY-MM-DD" />
                                    <b>&nbsp;~&nbsp;</b>
                                    <input type="text" id="QEDATE" name="QEDATE" readonly="readonly" style='font-size:9pt; PADDING-LEFT: 3px; width:70px;'  datepicker="true" datepicker_format="YYYY-MM-DD" />
                                 </td>
                                <td><input id="search" name="search" type="text" class="type-text" size="40" style="IME-MODE:active; WIDTH:150px" onKeyPress="if (event.keyCode==13) cmdSearch_onClick();" /><a href="#" onclick="cmdSearch_onClick()"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_search02.gif" align="absmiddle" border="0" /></a></td>
                                <td style="padding:0 2px 8px 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_box_x.gif" alt="" onclick="javascript:document.getElementById('SLayer').style.display='none';DatePickerControl.hide();"></td>
                            </tr>
                        </table>
                    </div>
                    <div id="span_detailsearch" style="display: none">
                        <table  border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td class="SLPop">
                                    <%=Resources.Approval.lbl_formname%>
                                </td>
                                <td align="left" style="padding-left:5px;width:210px;">
                                    <input
                                        name="FormName" id="FormName" type="text" class="input01" onkeypress="if (event.keyCode==13) {cmdDetailSearch_onClick();}"
                                        size="40" style="ime-mode: active; width: 200px"/><input type="hidden" name="hFormName" id="hFormName"/>
                                   <%-- <img src="<%=Session["user_thema"]  %>/Covi/Common/icon/icon_list.gif" name="btnKMMap" id="Img1" align="absMiddle"
                                        border="0" onclick="fnFormCategory();" style="cursor: hand" alt="양식명 선택" />--%>
                                </td>
                                <td rowspan="7" valign="top"><a href="#" onclick="cmdDetailSearch_onClick()"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_search02.gif" align="absmiddle" border="0" /></a></td>
                                <td rowspan="7" valign="top" style="padding:0 2px 8px 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_box_x.gif" alt="" onclick="javascript:document.getElementById('SLayer').style.display='none';DatePickerControl.hide();"></td>
                            </tr>
                            <tr>
                                <td class="SLPop">
                                    <%=Resources.Approval.lbl_DocNo%>
                                </td>
                                <td align="left" style="padding-left:5px;">
                                    <input
                                        name="DocNum" id="DocNum" type="text" class="input01" size="40" onkeypress="if (event.keyCode==13) {cmdDetailSearch_onClick();}"
                                        style="ime-mode: active; width: 200px" />&nbsp;<input type="hidden" name="hDocNum" id="hDocNum"/>
                                </td>
                            </tr>
                            <tr>
                                <td class="SLPop">
                                    <%=Resources.Approval.lbl_subject %>
                                </td>
                                <td align="left" style="padding-left:5px;">
                                    <input
                                        name="jemok_search" id="jemok_search" type="text" class="input01" size="60" onkeypress="if (event.keyCode==13) {cmdDetailSearch_onClick();}"
                                        style="ime-mode: active; width: 200px"/>&nbsp;<input type="hidden" name="hjemok_search" id="hjemok_search"/>
                                </td>
                            </tr>
                            <tr>
                                <td class="SLPop">
                                    <%=Resources.Approval.lbl_writer%>
                                </td>
                                <td align="left" style="padding-left:5px;">
                                    <input
                                        name="kian_search" id="kian_search" type="text" class="input01" onkeypress="if (event.keyCode==13) {cmdDetailSearch_onClick();}"
                                        size="40" style="ime-mode: active; width: 200px"/>&nbsp;<input type="hidden" name="hkian_search" id="hkian_search"/>
                                </td>
                            </tr>
                            <tr>
                                <td class="SLPop">
                                    <%=Resources.Approval.lbl_writedept%>
                                </td>
                                <td align="left" style="padding-left:5px;">
                                    <input
                                        name="kian_unit_search" id="kian_unit_search" type="text" class="input01" size="40"
                                        onkeypress="if (event.keyCode==13) {cmdDetailSearch_onClick();}" style="ime-mode: active;
                                        width: 200px"/>&nbsp;<input type="hidden" name="hkian_unit_search" id="hkian_unit_search"/>
                                </td>
                            </tr>
                            <tr>
                                <td class="SLPop">
                                    <span id="dateTitle"><%=Resources.Approval.lbl_donedate%></span>
                                </td>
                                <td align="left" style="padding-left:5px;">
                                    <input type="text" id="begin_date2" name="begin_date2" readonly="readonly" style='font-size:9pt; PADDING-LEFT: 3px; width:60px;'  datepicker="true" datepicker_format="YYYY-MM-DD" />
                                    <b>&nbsp;~&nbsp;</b>
                                    <input type="text" id="end_date2" name="end_date2" readonly="readonly" style='font-size:9pt; PADDING-LEFT: 3px; width:60px;'  datepicker="true" datepicker_format="YYYY-MM-DD" />
                                </td>
                            </tr>
                            <tr>
                                <td class="SLPop">
                                    <%=Resources.Approval.lbl_DocboxFolder%>
                                </td>
                                <td align="left" style="padding-left:5px;">
                                    <input
                                        name="DocCategory" id="DocCategory" type="text" class="input01" size="40" readonly
                                        style="ime-mode: active; width: 185px"/>&nbsp;<input type="hidden" name="hDocCategory" id="hDocCategory"/><img src="<%=Session["user_thema"]  %>/Covi/Common/icon/icon_list.gif"
                                            name="btnKMMap" id="btnKMMap" align="absMiddle" border="0" onclick="OpenDocClass();"
                                            style="cursor: hand" alt="문서분류 선택" >
                                </td>
                            </tr>
                        </table>
                    </div>
                  <!-- 검색 끝 -->
                  </td>
                </tr>
                </table>
           </div>
            <!-- 검색 조건 끝 -->
          </div>
        </div>
      </div>
      <div class="Box06_bl">
        <div class="Box06_br">
          <div class="Box06_bc"></div>
        </div>
      </div>
    </div>   
    <!-- 검색 영역 div 끝 --> 
	<!--  approval line view by  2008.04 sunnyhwang -->
	<div id="PopLayerAPV" style="display:none; position:absolute;width:650px;height:280px;"  onmouseout="this.style.display='none';">
        <iframe id="nPopLayerAPV" name="nPopLayerAPV" src="ListItemsApproveLine.aspx" style="background : white; border-color:Black;width:660px;height:280px; border-width:thin; border-style:dotted; overflow:hidden" frameborder="0"></iframe>
    </div>    
    <!--footer start-->
    <!-- 첨부 레이어 -->
    <div id="PopLayer" style="display:none; position:absolute;width:650px;height:280px;" onmouseout="this.style.display='none';" >
        <iframe id="nPopLayer" name="nPopLayer" src="./ApvInfoList/AttachFileList.aspx" style="border-color:Black;width:660px;height:280px; border-width:thin;" frameborder="1"></iframe>
    </div>
    <ucfooter:UxFooter ID="UxFooter1" runat="server" />
    
    <!--footer end -->
</div>

<div id="oPopUpHTML1" style='display:none;'>
</div>	
<input type="hidden" id="hidQSDATE" runat="server" />
<input type="hidden" id="hidQEDATE" runat="server" />
<!--quick Menu-->
<ucquickmenu:UxQuickMenu ID="UxWF_Footer" runat="server" />
<!--quick End-->
	<script type="text/javascript" language="javascript">
	    var gLabel_Months = <%=Resources.Approval.lbl_Months %>;
		var gLabel_Days = <%=Resources.Approval.lbl_Days %>;
		var uid="<%=Request.QueryString["uid"]%>";
		var strDeleteButtonValue = "<%=strDeleteButtonValue %>";
		if(uid==""){
			uid="<%=Session["user_code"]%>";
		}
        var barchived = "<%=Request.QueryString["barchived"] %>";
		
		//변수 선언
		var admintype = "<%=Request.QueryString["admintype"]%>";
		
		function MM_reloadPage(init) {  //reloads the window if Nav4 resized 
        //debugger
		if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
			document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
		else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
		}
		MM_reloadPage(true);

		/* 그림을 클릭시에 테두리에 점선이 나타나는것을 없애는 스크립트. */
		function bluring(){ 
		if(event.srcElement.tagName=="A"||event.srcElement.tagName=="IMG") document.body.focus(); 
		} 
		document.onfocusin=bluring;

		function MM_openBrWindow(theURL,winName,features) { //v2.0
		    //window.open(theURL,winName,features);
		    var strNewFearture = ModifyWindowFeature(features);
	        window.open(theURL,winName,strNewFearture);
		}
        
        
		var selLocation = "<%=Request.QueryString["location"]%>" ;		
		var selApv = "tabApvLine" ;
		var strMode = "<%=Request.QueryString["mode"]%>" ;
		//var deptId = uid.substring(0,uid.lastIndexOf("_"));
		//archive
		var bArchived = false ;
	    try{bArchived = (barchived=="true"?true:false);}catch(e){}
	    
		//사용자 강제변경
		if (admintype == ""){
		    var userid = "<%=Session["user_code"]%>";
    		var strBox = uid.substring(uid.lastIndexOf("_")+1);
    		if (selLocation == "DEPART" || selLocation == "JOBFUNCTION"){
    		}else{//개인함-본인것만 보도록 uid 강제 변환
    		    uid = userid;
    		}
		}
		//사용자 서명이미지 호출 
		var usit = "<%=usit %>";
		//사용자 N+2 결재관련 수정
		var usapprover = "<%= Session["user_approver_fullcode"] %>";//.ToString().Replace("\\","|")Session["user_approver_sabun"] 
        var a,ua = navigator.userAgent;
        this.agent= { 
            safari    : ((a=ua.split('AppleWebKit/')[1])?(a.split('(')[0]).split('.')[0]:0)>=412 ,
            konqueror : ((a=ua.split('Konqueror/')[1])?a.split(';')[0]:0)>=3.4 ,
            mozes     : ((a=ua.split('Gecko/')[1])?a.split(" ")[0]:0) >= 20011128 ,
            opera     : (!!window.opera) && (document.body.style.opacity=="") ,
            msie      : (!!window.ActiveXObject)?(!!(new ActiveXObject("Microsoft.XMLHTTP"))):false 
        } //safari, konqueror, opera url 한글 인코딩 처리를 위해추가
		var btoUtf = ((this.agent.safari || this.agent.konqueror || this.agent.opera)?false:true);
		var strRSSButtonValue = "<%=strRSSButtonValue %>";//2011-04-11 RSS버튼 활성화 추가
        
		window.onload= initOnload;
        function initOnload() {		
			setPerTab() ;	// Tab에 Label 설정			
			if(selLocation == "") {selLocation = "_TODO";}
			document.getElementById("div"+selLocation.replace("_","")).className = "current" ;
            setWorkListItem(selLocation, document.getElementById( "_" + selLocation).getAttribute("colLabel"));
			setGroup(selLocation) ;			
			setDelete(selLocation) ; 			
			//setApvLineClear();
			setApprove(selLocation);//일괄결재버튼 활성화			
			setFolderMove(selLocation) ; 			
			//결재카운트 refresh()
		    setSearch(selLocation) ;
		    setRSS(selLocation);//RSS버튼 활성화 여부
			//Display_ExpMenu(selLocation);
			DisplayExcelBtn(selLocation);
			if(selLocation == "APPROVAL" || selLocation == "TODO"){
				try{parent.frames[0].getApprovalCount();}catch(e){}
			}
			if(selLocation == "REVIEW1" || selLocation == "REVIEW2" || selLocation == "REVIEW3"  ){
				document.getElementById("divPREAPPROVAL").style.display = "none";	
			    document.getElementById("divAPPROVAL").style.display = "none";	
			    //document.getElementById("divPROCESS").style.display = "none";	
			    document.getElementById("divTODO").style.display = "none"; // 진행함(예결, 미결, 진행)
			    //document.getElementById("divCOMPLETE").style.display = "none";	
			    document.getElementById("divFINISH").style.display = "none";	//완료 (완료, 반려)
			    document.getElementById("divREJECT").style.display = "none";	
			    document.getElementById("divTEMPSAVE").style.display = "none";	
			    document.getElementById("divCCINFO").style.display = "none";
			    document.getElementById("divTCINFO").style.display = "none";
			    document.getElementById("divREVIEW1").style.display = "";
			    document.getElementById("divREVIEW2").style.display = "";
			    document.getElementById("divREVIEW3").style.display = "";
			}
			//결재선 보기 쿠키정보 읽어오기
			var cookiedata = document.cookie; 	
			if ( cookiedata.indexOf("chkView=True") > -1 ){ 
				chkView.checked = true;
				disApv(chkView);
			}		
			// foldername.innerHTML 
			document.getElementById('foldername').innerHTML = document.getElementById('_' + selLocation).innerHTML.replace("<SPAN>","").replace("</SPAN>","");
		}
		function changeBox(selTab){
		   
			if (selTab.name != selLocation) {
                document.getElementById("div"+selLocation.replace("_","")).className = "";
                document.getElementById("div"+selTab.id.replace("_","")).className = "current";
           
                selLocation = selTab.name ;
				strMode = selLocation.substr(selLocation.lastIndexOf("_")+1);
		
				document.getElementById("foldername").innerHTML = selTab.innerHTML.replace("<SPAN>","").replace("</SPAN>","");
				//selLocation = selTab.name ;
				if(strMode == "COMPLETE" || strMode == "FINISH" || strMode == "REJECT" || strMode == "CCINFO" || strMode == "REVIEW3"){
				    bArchived = true; // sp,(covi_flow_inst_archive, covi_flow_inst)
				}else{
				    bArchived = false;
				}
			
				setWorkList(selTab.name, selTab.getAttribute("colLabel"));
//				setGroup(selTab.name);
//				setApvLineClear();
//				setControl(selTab.name);
//				setApprove(strMode);
//				//setTodo(strMode);
//				setDelete(selLocation) ;
//			    setFolderMove(selLocation); 			
//				setSearch(selLocation);
//				//setControl();
//				//setApprove(selLocation);
//				setRSS(selLocation);//RSS버튼 활성화 여부 2008.05
//				//Display_ExpMenu(selLocation);
//				DisplayExcelBtn(selLocation);
			}
		}
		function changeApv(selTab, oApvLine, strApvlineDisp, oApvGraphic, strApvGraphicDisp) {
			if (selTab.name != selApv) {
                document.getElementById("div"+selApv.replace("_","")).className = "";
			    document.getElementById("div"+selTab.id.replace("_","")).className = "current";

				selApv = selTab.name ;
				document.getElementById(oApvLine).style.display = strApvlineDisp ;
				document.getElementById(oApvGraphic).style.display = strApvGraphicDisp;
			}
		}
		function setWorkList(pLocation, pLabel) {
		    //document.getElementById("iworklist").src = "listitems.aspx?uid="+uid+"&location=" + pLocation + "&mode=" + strMode +  "&label=" + ((btoUtf)?escape(pLabel):pLabel) + "&admintype=" + admintype; //수정
		    window.document.location = "ListToDo.aspx?uid="+uid+"&location="+pLocation+ "&mode=" + strMode + "&location_name=&barchived="+bArchived  +  "&label=" + ((btoUtf)?escape(pLabel):pLabel) + "&admintype=" + admintype;//+"&bstored="+bstored 
		}
		function setWorkListItem(pLocation, pLabel) {
		    document.getElementById("iworklist").src = "listitems.aspx?uid="+uid+"&location=" + pLocation + "&mode=" + strMode +  "&label=" + ((btoUtf)?escape(pLabel):pLabel) + "&admintype=" + admintype; //수정
		}		
		function setPerTab() {
			document.getElementById("_PREAPPROVAL").setAttribute("colLabel", "<%= Resources.Approval.lbl_doc_requested %>"); //기안일자
			document.getElementById("_APPROVAL").setAttribute("colLabel", "<%= Resources.Approval.lbl_receivedate  %>"); //받은일자
			//document.getElementById("_PROCESS").setAttribute("colLabel", "<%= Resources.Approval.lbl_approvdate %>"); //결재일자
			document.getElementById("_TODO").setAttribute("colLabel", "<%= Resources.Approval.lbl_approvdate %>"); //결재일자 //수정 2010.04.07 한송이
			//document.getElementById("_COMPLETE").setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>"); //완료일자
			document.getElementById("_FINISH").setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>"); //완료일자 2010.04.07 한송이
			document.getElementById("_REJECT").setAttribute("colLabel", "<%= Resources.Approval.lbl_rejectdate %>"); //반려일자
			document.getElementById("_TEMPSAVE").setAttribute("colLabel", "<%= Resources.Approval.lbl_moddate %>"); //저장일자
			document.getElementById("_CCINFO").setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>"); //완료일자
			document.getElementById("_TCINFO").setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>"); //완료일자			
			document.getElementById("_REVIEW1").setAttribute("colLabel","<%= Resources.Approval.lbl_receivedate  %>");//받은일자
			document.getElementById("_REVIEW2").setAttribute("colLabel","<%= Resources.Approval.lbl_receivedate  %>");//받은일자
			document.getElementById("_REVIEW3").setAttribute("colLabel","<%= Resources.Approval.lbl_donedate %>");//완료일자		
		}
		function mastermail() {
			var modeUrl	= "http://" + window.document.location.host + "/CoviGWNet/person/mail/GGOI_newpost_W01.asp?Cmd=new&MailTo=webmaster";
			CoviFullWindow(modeUrl,'','resize');
		}
		function CoviFullWindow(fileName,windowName,etcParam) {			
			var x = 800;
			var y = 600;

			var sx = window.screen.width  / 2 - x / 2;
			var sy = window.screen.height / 2 - y / 2 - 40;

			if (etcParam == 'fix') 
			{
				etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0";
			}else if (etcParam == 'resize') 
			{
				etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1";
			}else if (etcParam == 'scroll') 
			{
				etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1";
			}

			if (sy < 0 ) sy = 0;	
			var sz = ",top=" + sy + ",left=" + sx;
			if (windowName == "newMessageWindow") windowName = new String(Math.round(Math.random() * 100000));
			
			var strNewFearture = ModifyWindowFeature(etcParam + ",width=" + x + ",height=" + y + sz);
	        window.open(fileName,windowName,strNewFearture);
			//window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
		}		
		function group()
		{ 
			var kind = document.getElementById("kind").value;
			document.getElementById("mode").value = "total";
   
			var golist;
			
			setApvLineClear();
			document.getElementById("search").value = "";
			
			var szgLabel = "";
			
			if(kind=="total"){
			    szgLabel = document.getElementById('_' + selLocation).getAttribute("colLabel")
			}else{
			    szgLabel = document.getElementById('iworklist').contentWindow.gLabel;
			}
            if(btoUtf) szgLabel =toUTF8(szgLabel); 
            
			if (kind=="total")
			{				
				document.getElementById("iworklist").contentWindow.location = "listitems.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind="+ "&label=" +szgLabel + "&admintype=" + admintype; 
			}
			else if(kind=="WORKDT")
			{						
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode	  + "&kind=WORKDT" + "&gLabel=" +szgLabel + "&admintype=" + admintype;						
			}
			else if(kind=="PI_INITIATOR_NAME")
			{			    
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=PI_INITIATOR_NAME" + "&gLabel=" +szgLabel + "&admintype=" + admintype;
			}
			else if(kind=="PI_INITIATOR_UNIT_NAME")
			{			
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=PI_INITIATOR_UNIT_NAME" + "&gLabel=" +szgLabel + "&admintype=" + admintype;
			}
//			else if(kind=="PF_SUB_KIND")
//			{			
//				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=PF_SUB_KIND" ;
//				golist="<iframe frameborder=0 id='iworklist' name='iworklist' src='listgroup.aspx?uid="+ uid  + "&location=" + "<%=Request.QueryString["location"]%>" + "&mode=" + "<%=Request.QueryString["mode"]%>" + "&kind=PF_SUB_KIND' style='WIDTH:100%;HEIGHT:80%'></iframe>";						
//			}
			else if(kind=="FORM_NAME")
			{
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=FORM_NAME" + "&gLabel=" +szgLabel + "&admintype=" + admintype;
			}	
			else if(kind=="SENDER_NAME")
			{
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=SENDER_NAME" + "&gLabel=" +szgLabel + "&admintype=" + admintype;
			}
		}
		function toUTF8(szInput){
	        var wch,x,uch="",szRet="";
	        if(szInput!= null){
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
	        }
	        return(szRet);
        }
		function showSubGroup(){
			uid = selSubGroup.value;
			group();
			setApvLineClear();
		}
		function refresh() {		    
			document.getElementById("iworklist").contentWindow.location.reload();
			setApvLineClear();
			if(selLocation == "APPROVAL"){
				try{parent.frames[0].getApprovalCount();}catch(e){}
			}
		}
		function cmdSearch_onClick(){		
			if (document.getElementById("kind").value != "total") {alert("<%= Resources.Approval.msg_004 %>...!");return false;} //그룹정렬이 전체일 경우에만 가능합니다
			setApvLineClear();
			document.getElementById("kind").value = "total";
			document.getElementById("iworklist").contentWindow.cmdSearch_onClick(document.getElementById("sel_Search").value, document.getElementsByName("search")[0].value, document.getElementsByName("QSDATE")[0].value, document.getElementsByName("QEDATE")[0].value);
			//검색 후 검색창 display none
			document.getElementById("SLayer").style.display = "none";
			//검색 후 검색어 초기화
			document.getElementsByName("search")[0].value = "";
		}
		function cmdDetailSearch_onClick(){
		    if (document.getElementById("kind").value != "total") {alert("<%= Resources.Approval.msg_004 %>...!");return false;} //그룹정렬이 전체일 경우에만 가능합니다
			setApvLineClear();
			document.getElementById("kind").value = "total";
			
	        var begin_date = "";
	        var end_date = "";
	        begin_date = document.getElementById("begin_date2").value;
	        end_date = document.getElementById("end_date2").value;
			
	        //추가 : 일반검색 및 상세검색 분기 (2008.09.18 백승찬 대리)
	        var gubun = "";
	        var iDefault = 0;
	        var iDetail = 0;
			
            var searchValue = "";

            var jemok_search = document.getElementById("jemok_search").value;
            var kian_search  = document.getElementById("kian_search").value;   
            var kian_unit_search = document.getElementById("kian_unit_search").value;
            var DocCategory  = document.getElementById("DocCategory").value;  
            var DocNum = document.getElementById("DocNum").value;
            var FormName = document.getElementById("FormName").value;                    

            //기본검색조건
            if(FormName.length > 0){  //양식명
                gubun="PI_FORM_NAME";
                searchValue=FormName;
            }
            if(jemok_search.length > 0){  //제목
                gubun="PI_SUBJECT";
                searchValue=jemok_search;
            }
            if(kian_search.length > 0){   //기안자
                gubun="PI_INITIATOR_NAME";
                searchValue=kian_search;
            }
            if(kian_unit_search.length > 0){  //기안부서
                gubun="PI_INITIATOR_UNIT_NAME";
                searchValue=kian_unit_search;
            }
            if(DocNum.length > 0){  //문서번호
                gubun="PI_DOC_NUMBER";
                searchValue=DocNum;
            }
            if(DocCategory.length > 0){  //문서분류
                gubun="PI_DOC_FOLDER_NAME";
                searchValue=DocCategory;
            }
            if(window.begin_date2.value.length > 0){  //문서분류
                gubun="WORKDT";
            }
            
            if ( searchValue.indexOf("'")>-1)
            {
                alert("검색에 사용할수 없는 문자(따옴표)를 입력했습니다.");
                return;
            }
           
            document.getElementById("iworklist").contentWindow.cmdSearch_onClick(gubun, searchValue, begin_date, end_date);  
			//검색 후 검색창 display none
			document.getElementById("SLayer").style.display = "none";
			//검색 후 검색어 초기화
			document.getElementById("search").value = "";
		}	
		function setGroup(strTempSave) {
			var k = 0;
			if(strTempSave =="TEMPSAVE") {
				k=3;
			}else if(strTempSave=="TCINFO"){
				k=4;
			}else {
				k=5;
			}
			var okind = document.getElementById("kind");			
			okind.length = k;
			okind.options[0].value = "total";
			okind.options[0].text = "<%= Resources.Approval.lbl_total %>"; //전체
			okind.options[1].value = "WORKDT";
			okind.options[1].text = "<%= Resources.Approval.lbl_date_by %>"; //날짜별
			if(strTempSave =="TEMPSAVE") {
				okind.options[2].value = "FORM_NAME";
				okind.options[2].text = "<%= Resources.Approval.lbl_form_by %>"; //양식별
			}else if(strTempSave=="TCINFO"){
				okind.options[2].value = "FORM_NAME";
				okind.options[2].text = "<%= Resources.Approval.lbl_form_by %>"; //양식별
				okind.options[3].value = "SENDER_NAME";
				okind.options[3].text = "<%= Resources.Approval.lbl_SenderName %>"; //양식별
			}else {
				okind.options[2].value = "PI_INITIATOR_NAME";
				okind.options[2].text = "<%= Resources.Approval.lbl_initiator_by %>"; //기안자별
				okind.options[3].value = "PI_INITIATOR_UNIT_NAME";
				okind.options[3].text = "<%= Resources.Approval.lbl_initiatou_by %>"; //기안부서별
				okind.options[4].value = "FORM_NAME";
				okind.options[4].text = "<%= Resources.Approval.lbl_form_by %>"; //양식별
			}
			if(strTempSave == "TCINFO")
			{
			    okind.style.display = "none";
                document.getElementById("sel_Search").length = 1;
                document.getElementById("sel_Search").options[0].selected = true;
			}
			else
			{
			     okind.style.display = "";
			}
			
			//통합함 작업
			if(strTempSave == "TODO" || strTempSave == "FINISH"){
			    var oMode = document.getElementById("mode");
			    if(strTempSave =="TODO") {
			        oMode.length = 4;
			    }else{
			        oMode.length = 3;
			    }
			    oMode.options[0].value = "total";
			    oMode.options[0].text = "<%= Resources.Approval.lbl_total %>"; //전체
			    if(strTempSave =="TODO") {
				    oMode.options[1].value = "PREAPPROVAL";
				    oMode.options[1].text = "<%= Resources.Approval.lbl_doc_pre2 %>"; //양식별
				    oMode.options[2].value = "APPROVAL";
				    oMode.options[2].text = "<%= Resources.Approval.lbl_doc_approve2 %>"; //양식별
				    oMode.options[3].value = "PROCESS";
				    oMode.options[3].text = "<%= Resources.Approval.lbl_doc_process2 %>"; //양식별
			    }else if(strTempSave=="FINISH"){
				    oMode.options[1].value = "COMPLETE";
				    oMode.options[1].text = "<%= Resources.Approval.lbl_doc_complete2 %>"; //양식별
				    oMode.options[2].value = "REJECT";
				    oMode.options[2].text = "<%= Resources.Approval.lbl_doc_reject2 %>"; //양식별
    		    }
    		    oMode.options[0].selected = true;
			    oMode.style.display = "";
			}else{
			    document.getElementById("mode").style.display = "none";
		    }
		}
		function setSearch(strTempSave){
			var s = 0;
			if(strTempSave!="TEMPSAVE"  && strTempSave!="TCINFO" ) {s=3;}
			else {s=1;}
			var osel_Search =document.getElementById("sel_Search");
			osel_Search.length = s;
			osel_Search.options[0].value = "PI_SUBJECT";
			osel_Search.options[0].text = "<%= Resources.Approval.lbl_subject %>"; //제목
			if(strTempSave!="TEMPSAVE" && strTempSave!="TCINFO") {
				osel_Search.options[1].value = "PI_INITIATOR_UNIT_NAME";
				osel_Search.options[1].text = "<%= Resources.Approval.lbl_writedept %>"; //기안부서
				osel_Search.options[2].value = "PI_INITIATOR_NAME";
				osel_Search.options[2].text = "<%= Resources.Approval.lbl_writer %>"; //기안자
			}
		}		
		function setDelete(strLocation) {  
		    var oimgDelete =document.getElementById('imgDelete'); 
			if((strLocation=="REJECT") || (strLocation=="TEMPSAVE")) {  
				oimgDelete.style.display = "";
			}
			else {
			    var aButton = strDeleteButtonValue.split(":");
			    switch(strLocation){
			        case "TODO" ://진행함
			                if(aButton[0] == "1"){
			                    oimgDelete.style.display = "none";
			                }
			                else{oimgDelete.style.display = "none";}
			            break;
			        case "COMPLETE" ://완료함
			            if(aButton[0] == "1"){
			                oimgDelete.style.display = "";
			            }
			            else{oimgDelete.style.display = "none";}
			        break;
			         case "FINISH" ://완료함
			            if(aButton[0] == "1"){
			                oimgDelete.style.display = "";
			            }
			            else{oimgDelete.style.display = "none";}
			        break;
			        case "CCINFO" ://참조함
			            if(aButton[1] == "1"){
			                oimgDelete.style.display = "";
			            }
			            else{oimgDelete.style.display = "none";}
			        break;
			        case "TCINFO" ://회람함
			            if(aButton[2] == "1"){
			                oimgDelete.style.display = "";
			            }
			            else{oimgDelete.style.display = "none";}
			        break;
			        case "REVIEW3" ://공람완료함
			            if(aButton[3] == "1"){
			                oimgDelete.style.display = "";
			            }
			            else{oimgDelete.style.display = "none";}
			        break;
			        default :
			            oimgDelete.style.display = "none";
			        break;
			    }
			}	
		}
		function setApvLineClear() {
            document.getElementById('iApvLine').contentWindow.location = "about:blank";			
			try{document.getElementById("iApvGraphic").contentWindow.drawGraphic("");}catch(e){}
		}
		function setControl() {
			window.document.getElementById("kind").value = "total";
			window.document.getElementById("search").value = "";
		}
		function disApv(oApvCheck) {
		    //refresh();
			if(oApvCheck.checked) {
				//iworklist.frameElement.height = "220" ;
				divApv.style.display = "";
				//2005.12.20 by wolf 결재선 보기 체크 박스 클릭시 조회
				try{
			        var kind = document.getElementById("kind").value;
			        if (kind=="total"){
    					document.getElementById("iworklist").contentWindow.showDetailCheckBox(); // 일반 리스트
		            }else{
						document.getElementById("iworklist").contentWindow.document.getElementById("ifrDL").contentWindow.showDetailCheckBox(); // 그룹 조회시
		            }
				}catch(e){
				}
			}
			else {
				//iworklist.frameElement.height = "340" ;
				document.getElementById("divApv").style.display = "none";
			}
		}
		//결재선 보기 체크정보를 쿠키로 저장
		function setdisApvCookie(oApvCheck) {
			if(oApvCheck.checked) {
				setCookie( "chkView", "True", 1 ) // 2006.04.13 by wolf 결재선보기 체크정보 쿠키저장
			}
			else {
				setCookie( "chkView", "False", 1 ) // 2006.04.13 by wolf 결재선보기 체크정보 쿠키저장
			}
		}
		function setCookie( name, value, expiredays )
		{ 
			var todayDate = new Date(); 
			todayDate.setDate( todayDate.getDate() + expiredays ); 
			document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";" + location.host;
		}
		function setApprove(strLocation){
		    if(bArchived){
		        document.getElementById('spanApprove').style.display = "none";
		    }else{
			    if((strLocation=="APPROVAL" && admintype =="")  ) {
				    document.getElementById('spanApprove').style.display = "none";		
			    } else if ((strLocation=="TODO" && admintype =="")  ) { // 2010.04.09
				    document.getElementById('spanApprove').style.display = ""; //개인문서함(폴더통합) 일괄결재부분
			    }
			    else {document.getElementById('spanApprove').style.display = "none";}	
			}		
		}
		
		function delete_onClick(){		//debugger  delete확인
			var kind = document.getElementById("kind").value;
			if (kind=="total"){
    		    document.getElementById("iworklist").contentWindow.delete_onClick(false);
		    }else{
		        document.getElementById("iworklist").contentWindow.document.getElementById("ifrDL").contentWindow.delete_onClick(false); // 그룹 조회시
		    }
		    setApvLineClear();
		}
		function approve_onClick(){		 
			var kind = document.getElementById("kind").value;
			var Pwdtotal_App = "<%=ConfigurationManager.AppSettings["PWD_TOTALAPPROVAL"] %>";
			if (kind=="total"){
    		    document.getElementById("iworklist").contentWindow.cmdapprove_OnClick("",Pwdtotal_App);
		    }else{
    		    document.getElementById("iworklist").contentWindow.document.getElementById("ifrDL").contentWindow.cmdapprove_OnClick("",Pwdtotal_App);
		    }
		}	
		function foldermove_OnClick(){		
			var kind = document.getElementById("kind").value;
			if (kind=="total"){
    		    document.getElementById("iworklist").contentWindow.foldermove_OnClick();
		    }else{
    		    document.getElementById("iworklist").contentWindow.document.getElementById("ifrDL").contentWindow.foldermove_OnClick();
		    }
		}
		//폴더 이동 활성화
		function setFolderMove(strLocation) {
			if((strLocation=="COMPLETE") || (strLocation=="REJECT") || (strLocation=="CCINFO")  || (strLocation=="TCINFO")  || (strLocation=="FINISH")  ) {  
				document.getElementById("btn_userfoldermove").style.display="";				
			}
			else {
				document.getElementById("btn_userfoldermove").style.display="none";			
			}	
		}
		//탭 활성화
        function distab(objchecktabview){
            if(objchecktabview.checked) {
                document.getElementById("divtab").style.display = "";
	        }
	        else {
                document.getElementById("divtab").style.display = "none";
	        }
        }
	    /*=======================================================================
        내      용  : RSS 기능을 수행한다
        작  성  자  : 황선희
        ========================================================================*/
        var guserguid = "<%=Session["user_guid"] %>";   
        function copyRSSUrl()
        {
            var sRSSUrl = "http://" + window.location.host + "/COVIWeb/Approval/Portal/GetRssData.aspx?location=" + selLocation+"&uid="+uid+"&userguid="+guserguid;
            var bReturn = false;
            
            window.clipboardData.clearData("Text");
            bReturn = window.clipboardData.setData("Text", sRSSUrl);
        	
            if(true==bReturn)
            {
	            alert("<%=Resources.Approval.msg_193 %>");//RSS 경로가 클립보드에 복사되었습니다.
            }
        }
        
        function setRSS(strLocation){
            if (window.ActiveXObject){
                if (!bArchived){
                    if((strLocation=="TEMPSAVE") ) {  
                      document.getElementById('divbtnRSS').style.display ="none";
                    }else{
                      document.getElementById('divbtnRSS').style.display = "none" ;
                      //전자결재 RSS버튼 활성화여부 미결함/진행함/진행(통합)/수신함/담당업무미결/담당업무진행/참조-회람함(개인)/참조-회람함(부서)	                            document.getElementById('divbtnRSS').style.display ="none";
                        var aButton = strRSSButtonValue.split(":");
                        switch(strLocation){
                            case "TODO": document.getElementById('divbtnRSS').style.display = (aButton[2] == "1"?"":"none");break;
                            case "TCINFO": document.getElementById('divbtnRSS').style.display = (aButton[6] == "1"?"":"none");break;
                        }
                    }
                }else{ document.getElementById('divbtnRSS').style.display ="none";}
            }else{
                document.getElementById('divbtnRSS').style.display ="none";            
            }
        }		
      			
	    /*=======================================================================
        내      용  : 검색 활성화
        작  성  자  : 황선희
        ========================================================================*/   
        function search_OnClick(){       
            //if (!bArchived){
                document.getElementById("span_search").style.display="";
                document.getElementById("span_detailsearch").style.display="none";
//            }else{
//                document.getElementById("span_search").style.display="none";
//                document.getElementById("span_detailsearch").style.display="";
//                document.getElementById("SLayer").style.width="340px";
//            }

            if(document.getElementById("SLayer").style.display == ""){
                document.getElementById("SLayer").style.display = "none";
            }else{
                document.getElementById("SLayer").style.display = "";
            }
          
            //검색창 활성화 시 기간 검색을 위한 시작날짜/끝날짜 디폴트값 입력(기간 한달)
            document.getElementsByName("QSDATE")[0].value = document.getElementById("hidQSDATE").value;
            document.getElementsByName("QEDATE")[0].value = document.getElementById("hidQEDATE").value;
        }
        /*=======================================================================
        내      용  : 확장메뉴
        작  성  자  : 유유미
        수  정  자  : 관리자 모드에서는 확장메뉴 보이지 않음
        ========================================================================*/   			
        function Display_ExpMenu(strLocation)
        {
            if((strLocation=="TEMPSAVE" || admintype != ""))
            {              
                document.getElementById('ExpMenu').style.display="none";
            }else{                
                document.getElementById('ExpMenu').style.display="";
            }
        }
        /*=======================================================================
        내      용  : 통합함FILTER
        작  성  자  : 황선희
        수  정  자  : 
        ========================================================================*/   			
        function mode()
		{ 
			var mode = document.getElementById("mode").value;
            document.getElementById("kind").value = "total";
			var golist;
			
			setApvLineClear();
			document.getElementById("search").value = "";
			
			var szgLabel = "";
			
			if(mode=="total"){
			    szgLabel = document.getElementById('_' + selLocation).getAttribute("colLabel")
			}else{
			    szgLabel = document.getElementById('iworklist').contentWindow.gLabel;
			}
            if(btoUtf) szgLabel =toUTF8(szgLabel); 
            
			if (mode=="total")
			{				
				document.getElementById("iworklist").contentWindow.location = "listitems.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + mode + "&kind="+ "&label=" +szgLabel + "&admintype=" + admintype; 
			}
			else if(mode=="PREAPPROVAL")
			{						
				document.getElementById("iworklist").contentWindow.location = "listitems.aspx?uid="+uid+"&location=" + mode + "&mode=" + mode + "&kind="+ "&label=" +szgLabel + "&admintype=" + admintype; 
			}
			else if(mode=="APPROVAL")
			{			    
				document.getElementById("iworklist").contentWindow.location = "listitems.aspx?uid="+uid+"&location=" + mode + "&mode=" + mode + "&kind="+ "&label=" +szgLabel + "&admintype=" + admintype; 
			}
			else if(mode=="PROCESS")
			{			
				document.getElementById("iworklist").contentWindow.location = "listitems.aspx?uid="+uid+"&location=" + mode + "&mode=" + mode + "&kind="+ "&label=" +szgLabel + "&admintype=" + admintype; 
			}
			else if(mode=="COMPLETE")
			{
				document.getElementById("iworklist").contentWindow.location = "listitems.aspx?uid="+uid+"&location=" + mode + "&mode=" + mode + "&kind="+ "&label=" +szgLabel + "&admintype=" + admintype; 
			}	
			else if(mode=="REJECT")
			{
				document.getElementById("iworklist").contentWindow.location = "listitems.aspx?uid="+uid+"&location=" + mode + "&mode=" + mode + "&kind="+ "&label=" +szgLabel + "&admintype=" + admintype; 
			}
		}
    </script>
    <script language="javascript" type="text/javascript">
        ////////////////////////3단 메뉴 보여주기///////////////////////
	    var g_oPopEL		= null;
	    var sgColorBasic	= '';//이준희(2008-03-04): 기본 배경색|글자색
	    var sgColorMouseOver	= '';//이준희(2008-03-04): mouseover시의 배경색|글자색
	    var sgPrvEle	        = '';//이준희(2008-03-04): 직전에 선택되었던 버튼의 ID
        //var oPopup = window.createPopup();
            //oPopup.document.createStyleSheet("<%=Session["user_thema"] %>/css/css_style.css", 0);        
        var PopUpWidth = 130;
        var sgPaddingTop;
        var sgPaddingBottom;
        var sgWidth;
        var sgColor;
        var sgBackgroundImage;
        var sgBackgroundColor;
        var sgCssText;
        var sgBackColor;
        var sgPopupCtrl;
            
        function getParams()
        {
       
           sgPopupCtrl       = getStyle(".PopupCtrl");
           sgPaddingTop      = sgPopupCtrl.paddingTop;
           sgPaddingBottom   = sgPopupCtrl.paddingBottom;
           sgWidth           = sgPopupCtrl.width;
           sgColor           = sgPopupCtrl.color;
           sgBackgroundImage = sgPopupCtrl.backgroundImage;
           sgBackgroundColor = sgPopupCtrl.backgroundColor;
           sgCssText         = sgPopupCtrl.cssText + ';selector-dummy: expression(this.hideFocus=true);';//탭 인덱스를 가진 요소의 테두리를 없애기 위함.								                							
           sgBackColor       = getStyle(".PopupCtrl Back").backgroundColor;
        }
                         
        function event_onmouseover(obj)
        {
       
            g_oPopEL = obj;	  	     
            getParams();
            setTimeout("richDropDown()","1");	       
        }

        function event_onmouseout(obj) {	   
            window.document.all["oPopUpHTML" + obj.ctid].style.display="none";            
        }
      
        function richDropDown()
        {
            var el				= g_oPopEL;
            var oContextHTML	= window.document.all["oPopUpHTML" + el.ctid];
            var w				= "95";
            var sTmp			= '';        
	      	
            if (oContextHTML != null)
            {
	            oContextHTML.style.display = "";		        
	            var h = oContextHTML.offsetHeight- 20;	
	            oContextHTML.style.display = "none";
	            if(oContextHTML.childNodes[0].innerHTML == "")
	            {
		            h = 0;
		            w = 0;
	            }
	            //var oPopupBody = oPopup.document.body;       
	            //oPopupBody.innerHTML = oContextHTML.innerHTML;
			    try
			    {//이준희(2008-02-28): 툴바상의 풀다운 목록에 대한 디자인상의 보정을 위해 추가함; 차후 CSS로 완전히 제어가 가능한지 고려해 볼 것.
				    //sTmp = fnAdjClass(oPopupBody);
				    //w = sTmp.split('|')[0];
				    //h = sTmp.split('|')[1];//alert(sTmp);					
			    }
			    catch(e)
			    {
			    }
	                //fadeIn(oPopupBody);
	                //oPopupBody.attachEvent("onmouseleave", event_Popup_mouseleave);
		        var iX = 0;//이준희(2008-02-27): 풀다운 목록이 해당 메뉴 아이템의 좌측 경계선에 X 좌표를 기준하도록 하기 위해 수정함.
		        iX = fnGetX();
		        //oPopup.show(iX,25, w, h, el);
			     
		    }
        }

        function fnAdjClass(obj)
        {//이준희(2008-02-28): 툴바상의 풀다운 목록에 대한 디자인상의 보정을 위해 추가함; 차후 CSS로 완전히 제어가 가능한지 고려해 볼 것.
		    var sRet	= '', sTmp = 0;
		    var oLnks	= null;
		    var i		= 0;
		    var iUnit	= 0;//단위 행의 높이임.
		    iUnit = 20;//29;
		    var j       = 0;
		    try
		    {      			     
		        //이하 효과 없음.
			    oLnks = obj.document.body;//변수 용도 변경
			    oLnks.oncontextmenu	= 'return false;';
			    oLnks.ondragstart	= 'return false;';
			    oLnks.onselectstart	= 'return false;';
		    }
		    catch(e)
		    {
		    }
			//debugger;
		    oLnks = obj.document.links;
		    for(i = 0; i < oLnks.length; i++)
		    {         
			    oLnks[i].style.paddingTop		      = sgPaddingTop;
			    oLnks[i].style.paddingBottom		  = sgPaddingBottom;
			    oLnks[i].style.width			      = sgWidth;
			    oLnks[i].parentElement.style.width	  = sgWidth;
			    oLnks[i].onmouseover			      = fnAdjOnMouseOver;
			    oLnks[i].firstChild.onmouseover		  = null;
			    oLnks[i].style.color			      = sgColor;//Hover 효과를 무시하기 위함.
			    oLnks[i].style.backgroundImage		  = sgBackgroundImage;
			    oLnks[i].firstChild.style.color		  = "White" ; //sgColor;
			    oLnks[i].firstChild.style.backgroundImage = sgBackgroundImage;  // 버튼의 이미지 처럼 보이는 부분제거 위해 추가
			    oLnks[i].style.cssText			          = sgCssText; //탭 인덱스를 가진 요소의 테두리를 없애기 위함.
			    if ( oLnks[i].parentElement.style.display == "none") j++;								
		    }
		    sgColorBasic					              = sgBackgroundColor + '|' +  "White" ; //sgColor;						
		    //debugger;
		    //sTmp = '#ffffff';
		    sTmp = sgBackColor;
		    sgColorMouseOver				        = sTmp + '|' + sgBackgroundColor;//IE 6.0과 7.0에서 이 부분에 차이가 있음을 참고할 것.
		    oLnks[0].style.color			        = sgColor;
		    oLnks[0].style.backgroundColor	        = sgBackgroundColor;
			
		    i = (i-j) * iUnit + 2;//행수 * 단위 높이 + 상하 마진
		    sRet += '100';
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
			
		    oLnks = this.document.links;
		    if(this.id == sgPrvEle)
		    {				
			    return;//함수를 탈출함.
		    }
		    sgPrvEle = this.id;
			
			
		    for(i = 0; i < oLnks.length; i++)
		    {
			    if(oLnks[i].id == this.id)
			    {
				    this.style.backgroundColor	= sgColorMouseOver.split('|')[0];
				    this.firstChild.style.color	    	= sgColorMouseOver.split('|')[1];
			    }
			    else
			    {
				    oLnks[i].style.backgroundColor	= sgColorBasic.split('|')[0];
				    oLnks[i].firstChild.style.color		    = sgColorBasic.split('|')[1];//oLnks[i].style.backgroundColor	= this.style.color;//oLnks[i].style.color			= this.style.backgroundColor;//if(oLnks[i].style.backgroundColor.toUpperCase() == '#FFFFFF'){iCount++;}
			    }
		    }
        }
                
        function fnGetX()
        {
                        //이준희(2008-02-27): 풀다운 목록이 해당 메뉴 아이템의 좌측 경계선에 X 좌표를 기준하도록 하기 위해 추가함.
		    var iRet	= 0;
		    var	iCnst	= 0;//아이콘을 기준으로 정렬하기 위한 보정 상수임.
		    var oTmp	= null;
		    iCnst = 5;
		    oTmp = g_oPopEL.parentElement;
		    iRet = oTmp.offsetLeft - g_oPopEL.offsetLeft + iCnst;
		    return iRet;
        }

        function event_Popup_mouseleave()
        {
            //oPopup.hide();
            //checkbox가 있는 경우 원래 html 에 해당 선택 값 넘기기
            var el = g_oPopEL;
            var oContextHTML = window.document.all["oPopUpHTML" + el.ctid];
            if (oContextHTML != null ) {
                if (oContextHTML.innerHTML.indexOf("checkbox") > -1 ){
	                //var oPopupBody = oPopup.document.body;
	                //oContextHTML.innerHTML =  oPopupBody.innerHTML ;		                       
                }
            }
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
                
       function getStyle(strClass)
       {
         var objStyle;
         var index =0;
         // 정확한 스타일인지를 확인한다
         var tempCss = document.styleSheets(index).href;
            while(tempCss==""){
                index++;
                tempCss = document.styleSheets(index).href;
            }
         var tempUrl = "<%=Session["user_thema"] %>/CSS/css_style.css";
          
         if (tempCss.toUpperCase() != tempUrl.toUpperCase())
         {
            //alert(tempCss);
           return ;
         }
      
         for(var i=0; i < document.styleSheets[index].rules.length; i++)  
         {
           if(document.styleSheets[index].rules[i].selectorText==strClass)
           {
            objStyle = document.styleSheets[index].rules[i].style;
            break;
           }
         }  
                  
         return objStyle;
       }
       
       
       function fn_ExtMenu()
       {
            g_oPopEL = document.getElementById("menu1");
            getParams();
            setTimeout("richDropDown()","1");
       }
           
       
   //엑셀 추가
    function SavePC() {   
        if (document.getElementById("kind").value != "total") 
	    {
	       		    
	        return false;
	    } //그룹정렬이 전체일 경우에만 가능합니다
		
		if(document.getElementById('iworklist').contentWindow.g_totalcount == "0") 
		{
		    alert("<%= Resources.Approval.msg_279 %>");
		    return false;
		}
        var sdoclistname='';
	    switch (selLocation)
	    {
	        case "APPROVAL": sdoclistname= "<%= Resources.Approval.lbl_doc_approve2%>";break;
	        case "PROCESS": sdoclistname= "<%= Resources.Approval.lbl_doc_process2%>";break;
	        case "TODO": sdoclistname= "<%= Resources.Approval.lbl_doc_process2%>";break; //수정
	        case "REJECT": sdoclistname= "<%= Resources.Approval.lbl_doc_reject2%>";break;
	        case "COMPLETE": sdoclistname= "<%= Resources.Approval.lbl_doc_complete2%>";break;
	        case "FINISH": sdoclistname= "<%= Resources.Approval.lbl_doc_complete2%>";break; //수정
	        case "CCINFO": sdoclistname= "<%= Resources.Approval.lbl_doc_reference2%>";break;
	        case "TEMPSAVE": sdoclistname= "<%= Resources.Approval.lbl_composing%>";break;
	        case "TCINFO": sdoclistname= "<%= Resources.Approval.lbl_doc_circulation%>";break;
	        case "REVIEW1": sdoclistname= "<%= Resources.Approval.lbl_doc_review_all%>";break;
	        case "REVIEW2": sdoclistname= "<%= Resources.Approval.lbl_doc_review_unread%>";break;
	        case "REVIEW3": sdoclistname= "<%= Resources.Approval.lbl_doc_review_read%>";break;
	    }
					
	    if(selLocation == "TCINFO")
	    {
	        //alert("회람함 구현예정");
	    }
	    else
	    {             
            var arrSearchValue = document.getElementById('iworklist').contentWindow.getSearchValue().split(';');
            var search_type = arrSearchValue[0];
            var search_value = arrSearchValue[1];
            var start_date = arrSearchValue[2];
            var end_date = arrSearchValue[3];
            var query = "ListType=" + selLocation  + "&doclistname="+escape(sdoclistname) + "&SearchType="+escape(search_type) + "&SearchWord="+escape(search_value)+ "&start_date="+escape(start_date)+ "&end_date="+escape(end_date);
            var url = "ListItemsExcel.aspx?"+query+"&barchived="+bArchived;
            document.getElementById("form1").action = url;
            document.getElementById("form1").target = "result_fr";
            document.getElementById("form1").submit();				

	    }
	}
	
	function DisplayExcelBtn(selLocation){
	    if(selLocation == "PREAPPROVAL" ||  selLocation == "TEMPSAVE" || selLocation == "TCINFO"){
	        document.getElementById('spanExcel').style.display = "none";
	    }
	    else{
	        document.getElementById('spanExcel').style.display = "";
	    }
	}     
    function OpenDocClass(){        
        fnPopUpModal("../ExtensionService/Doc/DM_Folder_List.aspx",20,18);
    }
    function fnPopUpModal(modalUrl,modalWidth,modalHeight){
        var ModalStyle = "dialogWidth:" + modalWidth + "px;dialogHeight:"+modalHeight+"px;status=no;scroll=no";
        var strResult;
        try
        { 
            var pWidth = 20;
            var pHeight = 18;
            var options =  'width=' + pWidth+'px';
            options += ' ,height=' + pHeight+'px';
            options += ' ,left=' + (screen.availWidth-pWidth)/2;
            options += ' ,top=' + (screen.availHeight-pHeight)/2;
            options += ' ,scrollbars=no';
            options += ' ,titlebar=no';
            options += ' ,resizable=no';
            options += ' ,Status=no';
            options += ' ,toolbar=no';
            
            var strNewFearture = ModifyWindowFeature(options);
            var strResult = window.showModalDialog(modalUrl, "",strNewFearture);
            DocCategory.value = strResult.split("/")[0];
            
        }
        catch(exception)
        {
            alert(exception.description);
        }
    }
	
    </script>
    <form class="form" id="form1" method="post" name="myform" target="result_fr">
    </form>
    <iframe src="" name="result_fr" height="100" width="100" style="DISPLAY:none;"></iframe>
    
    <script type="text/javascript" language="javascript" src="/coviweb/approval/forms/calendar/datepickercontrol.js"></script>
</body>
</html>
