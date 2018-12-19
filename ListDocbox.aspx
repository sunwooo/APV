<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListDocbox.aspx.cs" Inherits="Approval_ListDocbox" %>
<%@ Register Src="Portal/UxFooter.ascx" TagName="UxFooter" TagPrefix="ucfooter" %>
<%@ Register Src="Portal/UxQuickMenu.ascx" TagName="UxQuickMenu" TagPrefix="ucquickmenu" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Untitled Page</title>
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
	<!-- 달력 선택 참조  -->
	<script language="JavaScript" src="../Approval/Forms/calendar/__cal.js" type="text/javascript"></script>
	<script language="vbscript" src="../Approval/Forms/calendar/__cal.vbs" type="text/vbscript"></script>      
	<script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
	<script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/Dictionary.js"></script>  
</head>
<body>
    <div id="SubWidth">
    
        <!-- 타이틀 영역 div 시작 -->
        <div class="Title">
            <h1><span id="spanArchived" style="display:none;">&nbsp;<%=Resources.Approval.lbl_old_doc %> - </span><asp:Label runat="server" ID="PageName" style="display:none;" /><span id="bar" style="display:none"> - </span><span id="foldername"></span> &nbsp;
         		<select name="ManageUnit" id="ManageUnit" style="width:145; display:none;" onchange="queryManageDept();">
					<option><%=Resources.Approval.lbl_selection%></option><!--선택-->
				</select><!--부서함 공유-->   
            </h1>
            <!-- 네비게이션 영역 시작 -->
            <ul class="small" style="display:none;">
                <li>Home&gt;</li>
                <li><asp:Label runat="server" ID="PagePath" />&gt;</li>
                <li><span id="spanArchivedPass" style="display:none;"><b><%=Resources.Approval.lbl_old_doc %></b></span></li>
                <li><b><asp:Label runat="server" ID="PageName2" /></b></li>
            </ul>
        <!-- 네비게이션 영역 끝 -->																								
        </div>
        <!-- 타이틀 영역 div 끝 -->
        			    
        <!-- 버튼 영역 div 시작 -->
        <div class="n_btntb">
            <ul>
                <li id="btn_main">
                    <span>
                        <a id="btn_reload" class="btnov" href="#" onclick="javascript:refresh();" style="cursor: default;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_refresh.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_refresh %></span></a>
                    </span>
                    <span id="spanBlocApprove" style="display:none;">
                        <a class="btnov" href="#" onclick="javascript:BlocApprove_onClick();" style="cursor:default;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_decide.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_blocReceipt%></span></a>
                    </span>
                    <span id="spanBlocApvline" style="display:none;">
                        <a class="btnov" href="#" onclick="javascript:BlocApvline_onClick();" style="cursor:default;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_decide.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_blocApvline%></span></a>
                    </span>
                    <span id="spanBlocCharge" style="display:none;">
                        <a class="btnov" href="#" onclick="javascript:BlocCharge_onClick();" style="cursor:default;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_decide.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_blocCharge%></span></a>
                    </span>
                    <span id="spanExcel" style="display:none;">
                        <a id="approve_bt_excel" class="btnov" href="#" onclick="javascript:SavePC();" style="cursor:default;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_save.gif" align="middle" />&nbsp;<%= Resources.Approval.lbl_SaveToExcel %></span></a>
                    </span>
                    <span id="btn_search" style="display:;">
	                    <a class="btnov" href="#" onclick="javascript:search_OnClick();" style="cursor:default;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_search.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_search %></span></a>
                    </span>
                   
                </li>
                <li id="ExpMenu" style="display:none;">
                    <a class="btnov"  href="#" onclick="fn_ExtMenu();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_setting.gif" align="middle" />&nbsp;<%= Resources.Approval.btn_extmenu %></span></a>
                    <a id="menu1" ctid="1" onclick="event_onmouseover(this);" onmouseout="event_onmouseout(this);"  style="display:none;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_group-select.gif" align="absmiddle"/></a>
                </li>   
                <li id="btn_option">
                  <!-- 분류 select div 시작 -->
                  <span id="spanoption"><input type="checkbox" checked="checked" name="chktab" onclick="distab(this);" id="chktab" style="CURSOR:hand" />&nbsp;<asp:Label runat="server" ID="DisplayTab" />&nbsp;<!--탭보기--><select id="kind" name="kind" onchange="group()" style="display:none;"></select>&nbsp;<select id="cboDate" name="cboDate" onchange="return cboDate_onchange1()" style="display:none;"></select>&nbsp;<select id="cboDate1" name="cboDate1" onchange="return cboDate_onchange()" style="display:none;"></select></span>
                  <!-- 분류 select div 시작 -->
                </li>
            </ul>
        </div>                                                                                      
        <!-- 버튼 영역 div 끝 -->
        
        
        <!-- 게시판 리스트 div 시작 -->
		<div class="BTable" id="divworklist">
		    <iframe id="iworklist" width='100%' height='100%' frameborder='0' src='' style='PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px;'></iframe>
		</div>
        <!-- 게시판 리스트 div 끝 -->
        
        
        <!-- list graphic div 시작 -->
        <div id="divApv" style="DISPLAY:none">
            <!-- 탭 div 시작 -->
            <div class="tab01 small">
              <ul>
                <li id="divtabApvLine" style="display:;"><a href="#" onclick="javascript:changeApv(this,'spanApvLine','','spanApvGraphic','none');" id="tabApvLine" name="tabApvLine"><span><%= Resources.Approval.lbl_list%></span></a></li>
                <li id="divtabApvGraphic" style="display:;"><a href="#" onclick="javascript:changeApv(this,'spanApvLine','none','spanApvGraphic','');" id="tabApvGraphic" name="tabApvGraphic"><span><%= Resources.Approval.lbl_graphic%></span></a></li>
              </ul>
            </div>
            <!-- 탭 div 끝 -->
            <div>
                <span id="spanApvLine" name="spanApvLine">
			    <iframe id="iApvLine" name="iApvLine" width='100%' height=130 frameborder=0 src='about:blank' datasrc="../ApvlineMgr/ApvlineViewer.aspx" style='margin:0; padding:0; scroll=auto;'></iframe>
			    </span>
			    <span id="spanApvGraphic" style="DISPLAY: none" name="spanApvGraphic">
			    <iframe id="iApvGraphic" style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; scroll: auto" dataSrc=./ApvMonitor/MonitorGraphic.aspx name=iApvGraphic src="./ApvMonitor/MonitorGraphic.aspx" frameBorder=0 width="100%" height=130></iframe>
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
                                        <select name="sel_Search" style="width:70">
                                            <option value="PROCESS_SUBJECT" selected ><asp:Label runat="server" ID="lbl_Title" /></option>
                                            <option value="INITIATOR_NAME"><asp:Label runat="server" ID="lbl_Intiator" /></option>
                                         </select>
                                         &nbsp;
                                     </td>
                                     <td>
                                        <input type="text" name="QSDATE" class="type-text" style="width:80px;" /> 
			                                <img alt=""  src="/GWImages/Common/icon/icon_calendar.gif" class="Out"  align="absMiddle" onclick="MiniCal(QSDATE,-200,0)" style="CURSOR:hand"> ~ 
			                            <input type="text" name="QEDATE" class="type-text" style="width:80px;" /> 
			                                <img alt=""  src="/GWImages/Common/icon/icon_calendar.gif" class="Out"  align="absMiddle" onclick="MiniCal(QEDATE,-200,0)" style="CURSOR:hand">&nbsp;
                                     </td>
                                    <td><input name="search" type="text" class="type-text" size="40" style="IME-MODE:active; WIDTH:150px" onKeyPress="if (event.keyCode==13) cmdSearchDept_onClick();" /><a href="#" onclick="cmdSearchDept_onClick();"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_search02.gif" align="absmiddle" border="0" /></a></td>
		                                <td style="padding:0 2px 8px 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_box_x.gif" alt="" onclick="javascript:SLayer.style.display='none'"></td>
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
                                        <td rowspan="7" valign="top" style="padding:0 2px 8px 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_box_x.gif" alt="" onclick="javascript:SLayer.style.display='none'"></td>
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
                                            <input
                                                type="text" id="begin_date2" name="begin_date2" value="" size="12" class="input01"
                                                style="width: 70px;" readonly /><input type="hidden" name="hbegin_date2" id="hbegin_date2"/><img alt=""  src="/GWImages/Common/icon/icon_calendar.gif" class="Out"  align="absMiddle" onclick="MiniCal(begin_date2,-200,0)" style="CURSOR:hand">&nbsp;
                                            ~
                                            <input type="text" id="end_date2" name="end_date2" value="" size="12" class="input01"
                                                style="width: 70px;" readonly /><input type="hidden" name="hend_date2" id="hend_date2"/><img alt=""  src="/GWImages/Common/icon/icon_calendar.gif" class="Out"  align="absMiddle" onclick="MiniCal(end_date2,-200,0)" style="CURSOR:hand">&nbsp;
                                            &nbsp;
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
                                    <tr>
                                        <td colspan="4">(* 다중검색 개발중입니다. 단일검색만 가능함.)</td>
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
        
        
        <!-- 달력선택 div 시작 -->
		<div id="minical" OnClick="this.style.display='none';" oncontextmenu="return false" ondragstart="return false"
		onselectstart="return false" style="background : buttonface; margin: 5; margin-top: 2;border-top: 1 solid buttonhighlight;border-left: 1 solid buttonhighlight;border-right: 1 solid buttonshadow;border-bottom: 1 solid buttonshadow;width:175;display:none;position: absolute; z-index: 2"></div>
		<iframe id="frmcal"  scrolling="no" frameborder="0" style="background : buttonface; margin: 5; margin-top: 2;border-top: 0 solid buttonhighlight;border-left: 0 solid buttonhighlight;border-right: 0 solid buttonshadow;border-bottom: 0 solid buttonshadow;width:175;display:none;position: absolute; z-index: 1"></iframe>
        <!-- 달력선택 div 종료 -->
        
        
		<!--  approval line view by  2008.04 sunnyhwang -->
		<div id="PopLayerAPV" style="display:none; position:absolute;width:650px;height:280px;"  onmouseout="this.style.display='none';">
				<iframe id="nPopLayerAPV" name="nPopLayerAPV" src="ListItemsApproveLine.aspx" style="border-color:Black;width:650px;height:280px; border-width:thin; border-style:dotted;" frameborder="0"></iframe>
		</div>
        <!-- 첨부 레이어 2008.04 강성채-->
        <div id="PopLayer" style="display:none; position:absolute;width:650px;height:280px;" onmouseout="this.style.display='none';" >
            <iframe id="nPopLayer" name="nPopLayer" src="./ApvInfoList/AttachFileList.aspx" style="border-color:Black;width:660px;height:280px; border-width:thin;" frameborder="1"></iframe>
        </div>
        
		<!--footer start-->
		<ucfooter:UxFooter ID="UxFooter1" runat="server" />
		<!--footer end -->
		
		<!-- 확장 영역 div 시작 --> 
	    <div id="oPopUpHTML1" style='display:none;'>
           <div class="Btn_G">
                <ul>
                    <li id="divbtnRSS" style="display:none;"><a href="#" id="aid01" class="Btn_Group01" onclick="javascript:parent.copyRSSUrl();"  style="width: 180px;height:20px;vertical-align:bottom;" ><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn_type2/btn_icon01_rss.gif" align="absmiddle" />&nbsp;<%=Resources.Approval.btn_RSS %></span></a></li>
                    <li id="btn_userfoldermove" style="display:none;"><a href="#" id="aid02" class="Btn_Group01" onclick="javascript:parent.foldermove_OnClick('user');" style="width: 180px;height:20px;vertical-align:bottom;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn_type2/btn_icon01_move.gif" align="absmiddle" />&nbsp;<%=span_userfoldermove %></span></a></li>
                    <li id="btn_unitfoldermove" style="display:none;"><a href="#" id="aid03" class="Btn_Group01" onclick="javascript:parent.foldermove_OnClick('unit');" style="width: 180px;height:20px;vertical-align:bottom;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn_type2/btn_icon01_move.gif" align="middle" />&nbsp;<%=span_unitfoldermove %></span></a></li>
                </ul>
           </div>
        </div>
        <!-- 확장 영역 div 끝 --> 
    </div>
    
    
	<div style="DISPLAY:none">
        <form id="menu"><input type="hidden" name="APVLIST"></form>
        <form id="editor"></form>
    </div>
    <input type="hidden" id="field" name="ACTIONCOMMENT" value="" />
	<!--quick Menu-->
	<ucquickmenu:UxQuickMenu ID="UxWF_Footer" runat="server" />
	<!--quick End-->
    <span style="display:none;"><input type="checkbox" name="chkView" onclick="disApv(this);" id="chkView" style="CURSOR:hand"> <asp:Label runat="server" ID="ApvLineView" />&nbsp;</span><!--결재선보기-->
	
    
    <input type="hidden" id="hidQSDATE" runat="server" />
    <input type="hidden" id="hidQEDATE" runat="server" />		
    <script type="text/javascript" language="javascript" src="../common/script/CFL.js"></script>
	<script type="text/javascript" language="javascript">
	    var uid="<%=Request.QueryString["uid"]%>";
//	    if(uid==""){
//		    uid="<%=Session["user_dept_code"]%>";
//	    }
	    var userid="<%=Session["user_code"]%>";
        var barchived = "<%=Request.QueryString["barchived"] %>";
        var classid = "<%=Request.QueryString["classid"] %>";
        var sUsismanager ="<%=strUsismanager %>";  //부서장 여부
        var sUsisdocmanager ="<%=strUsisdocmanager %>";  //문서관리자 여부
	    var sDpisdocmanager = "<%=strDpisdocmanager %>"  //부서내 문서관리자 여부
	    var sDeptListButton = "<%=strDeptListButton %>";
	    function MM_reloadPage(init) {  //reloads the window if Nav4 resized
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
	        var strNewFearture = ModifyWindowFeature(features);
	        window.open(theURL,winName,strNewFearture);
	    }
	    var selLocation = "<%=Request.QueryString["location"]%>" ;
	    var selMainTab = "" ;
	    //var choTab = "<%=Request.QueryString["location_name"]%>";
	    var selApv = "tabApvLine" ;
	    var strMode = "<%=Request.QueryString["mode"]%>" ;
	    var deptId = uid;
		var bArchived = false ;
	    try{bArchived = (barchived=="true"?true:false);}catch(e){}
        var sDeptListButton = "<%=strDeptListButton %>";
        var sDeptList = "<%=strDeptList %>";
        var bAuditDept = "<%=bAuditDept%>";
		var admintype = "<%=Request.QueryString["admintype"]%>";
		var gLngIdx = <%=strLangIndex %>;
		var sEntCode = "<%=sEntCode%>";
        
	    function window.onload() {
			setYearMonth();
            cboDate.style.display="";
			cboDate1.style.display="";
            selMainTab = uid.substring(uid.lastIndexOf("_"));
			setWorkList(selLocation, "<%= Resources.Approval.lbl_donedate  %>") ;
			setGroup(selMainTab) ;
			setApvLineClear();
			setControl(selMainTab);
			//setRSS(selMainTab);
			//setFolderMove(selMainTab);
			//Display_multi(selMainTab);

		    //2006.04.13 by wolf 결재선 보기 쿠키정보 읽어오기
		    var cookiedata = document.cookie; 	
		    if ( cookiedata.indexOf("chkView=True") > -1 ){ 
			    chkView.checked = true;
			    disApv(chkView);
		    }
			//2007.03 by sunnyhwang archive 처리
			if (bArchived){
				spanArchived.style.display = "none";	
				spanArchivedPass.style.display = "";
				PageName2.style.display = "none"; 
				//PageName.style.display = "";
				//bar.style.display = "";
				chktab.style.display = "none";
				DisplayTab.style.display = "none";
			}
			document.getElementById('foldername').innerHTML = "<%=Request.QueryString["location_name"]%>";
			getManageDept(userid);//부서관리
	    }

		function changeBox(selTab){//debugger;
			if (selTab.name != selMainTab) {
                eval("div"+selMainTab.replace("_","")).className = "" ;
                eval("div"+selTab.id.replace("_","")).className = "current" ;

				selMainTab = selTab.name ;
				setWorkList(selLocation, selTab.getAttribute("colLabel")) ;
				setGroup(selTab.name) ;
				setApvLineClear();
				setControl(selTab.name) ;
				foldername.innerHTML = selTab.innerHTML.replace("<SPAN>","").replace("</SPAN>","");
				setFolderMove(selMainTab);
				Display_multi(selMainTab);
			}
		}

		function changeApv(selTab, oApvLine, strApvlineDisp, oApvGraphic, strApvGraphicDisp) {
			if (selTab.name != selApv) {
                eval("div"+selApv.replace("_","")).className = "" ;
			    eval("div"+selTab.id.replace("_","")).className = "current" ;

				selApv = selTab.name ;
				eval(oApvLine).style.display = strApvlineDisp ;
				eval(oApvGraphic).style.display = strApvGraphicDisp ;
				try{
					if(spanApvLine.style.display == ""){
						iApvLine.frameElement.height = iApvLine.tblapvinfo.offsetHeight+iApvLine.tdccinfo.offsetHeight+15;	
					}else{
						iApvGraphic.frameElement.height = iApvGraphic.divgraphic.offsetHeight+5;
					}
				}catch(e){}
				
			}
		}

		function setWorkList(pLocation, pLabel) {
			iworklist.location = "listitems.aspx?uid="+deptId+"_"+classid+"&location=" + pLocation + "&mode=" + strMode +  "&label=" + escape(pLabel)  + "&entcode=" + sEntCode ;
		}

		function mastermail() {
			var modeUrl	= "http://" + window.document.location.host + "/CoviGWNet/person/mail/GGOI_newpost_W01.asp?Cmd=new&MailTo=webmaster" ;
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
		}	
		
			
		function group()
		{
			var kind = window.kind.value;
			var golist;
			
			setApvLineClear();
			window.search.value = "" ;
			setDate() ;
			
			if (kind=="total")
			{				
				iworklist.location = "listitems.aspx?uid="+deptId+"_"+classid+"&location=" + selLocation + "&mode=" + strMode + "&kind=" + "&entcode=" + sEntCode ;
			}
			else if(kind=="WORKDT")
			{				
				iworklist.location = "listgroup.aspx?uid="+deptId+"_"+classid+"&location=" + selLocation + "&mode=" + strMode + "&kind=WORKDT&subkind=" + classid + "&entcode=" + sEntCode ;
			}
			else if(kind=="PI_INITIATOR_NAME")
			{
				iworklist.location = "listgroup.aspx?uid="+deptId+"_"+classid+"&location=" + selLocation + "&mode=" + strMode + "&kind=PI_INITIATOR_NAME&subkind=" + classid + "&entcode=" + sEntCode ;
			}
			else if(kind=="PI_INITIATOR_UNIT_NAME")
			{			
				iworklist.location = "listgroup.aspx?uid="+deptId+"_"+classid+"&location=" + selLocation + "&mode=" + strMode + "&kind=PI_INITIATOR_UNIT_NAME&subkind=" + classid + "&entcode=" + sEntCode ;
			}

			else if(kind=="FORM_NAME")
			{
				iworklist.location = "listgroup.aspx?uid="+deptId+"_"+classid+"&location=" + selLocation + "&mode=" + strMode + "&kind=FORM_NAME&subkind=" + classid + "&entcode=" + sEntCode ;
			}
			
			if (kind=="total"){
				cboDate.style.display="";
				cboDate1.style.display="";
			}else{
				cboDate.style.display="none";
				cboDate1.style.display="none";
			}	
			setApvLineClear();
		}

		function showSubGroup(){
			uid = selSubGroup.value;
			group();
			setApvLineClear();
		}
		function refresh() {
			iworklist.document.location.reload();
			setApvLineClear();
			parent.frames[0].getApprovalCount();
		}
		function cmdSearch_onClick(){
			if (window.kind.value != "total") {alert("<%= Resources.Approval.msg_004 %>...!");return false;}//"그룹정렬이 전체일 경우에만 가능합니다...!"
			setApvLineClear();
			
			window.kind.value = "total";
			iworklist.cmdSearch_onClick(window.sel_Search.value, window.search.value);
		}
		function cmdDetailSearch_onClick(){
		    if (window.kind.value != "total") {alert("<%= Resources.Approval.msg_004 %>...!");return false;} //그룹정렬이 전체일 경우에만 가능합니다
			setApvLineClear();
			window.kind.value = "total";
			
	        var begin_date = "";
	        var end_date = "";
	        begin_date = window.begin_date2.value;
	        end_date = window.end_date2.value;
			
	        //추가 : 일반검색 및 상세검색 분기 (2008.09.18 백승찬 대리)
	        var gubun = "";
	        var iDefault = 0;
	        var iDetail = 0;
			
            var searchValue = "";

            var jemok_search = window.jemok_search.value;
            var kian_search  = window.kian_search.value;   
            var kian_unit_search = window.kian_unit_search.value;
            var DocCategory  =  window.DocCategory.value;  
            var DocNum = window.DocNum.value;
            var FormName = window.FormName.value;                    

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
           
            iworklist.cmdSearch_onClick(gubun, searchValue, begin_date, end_date);  
			//검색 후 검색창 display none
			SLayer.style.display = "none";
			//검색 후 검색어 초기화
			search.value = "";
		}
		//부서문서함 검색용 임시함수
		function cmdSearchDept_onClick(){
			if (window.kind.value != "total") {alert("<%= Resources.Approval.msg_004 %>...!");return false;}//"그룹정렬이 전체일 경우에만 가능합니다...!"
			setApvLineClear();
			
			window.kind.value = "total";
			iworklist.cmdSearchDept_onClick(window.sel_Search.value, window.search.value, document.all("QSDATE").value, document.all("QEDATE").value);
			//검색 후 검색창 display none
			SLayer.style.display = "none";
			//검색 후 검색어 초기화
			search.value = "";
		}
		//라벨 관련 수정해야 할부분
		
		function setGroup(strTempSave) {
	    if ( strTempSave == "_D"){
		    kind.style.display = "none";
            sel_Search.length = 1;
            sel_Search.options(0).selected = true;
	    }else{
	        kind.style.display = "";
		    var k = 5 ;
		    kind.length = k
		    kind.options(0).value = "total"
		    kind.options(0).text = "<%= Resources.Approval.lbl_total  %>" //전체
		    kind.options(1).value = "WORKDT"
		    kind.options(1).text = "<%= Resources.Approval.lbl_date_by  %>" //날짜별
		    kind.options(2).value = "PI_INITIATOR_NAME"
		    kind.options(2).text = "<%= Resources.Approval.lbl_initiator_by  %>" //기안자별
		    kind.options(3).value = "PI_INITIATOR_UNIT_NAME"
		    kind.options(3).text = "<%= Resources.Approval.lbl_initiatou_by  %>" //기안부서별
		    kind.options(4).value = "FORM_NAME"
		    kind.options(4).text = "<%= Resources.Approval.lbl_form_by  %>" //양식별
			}
		}
		// 라벨 관련 수정해야 할부분끝
		function setApvLineClear() {
			iApvLine.location = "about:blank" ;
			iApvGraphic.drawGraphic("");
		}		
		//부서함관련수정
		var fldrName='';
		var strDate;
		var aryDate;
		var bOnGoing;
		var strDate = new String();
		var aryDate = new Array();
		function setYearMonth(){
			strDate = "<%=strDate%>";
			aryDate = strDate.split("/"); 
			
			for(i=aryDate.length-1;i>-1;i--){
				aryDate1 = aryDate[i].split("#");  
				makeNode1(aryDate1[0]);
				if (aryDate1[0] == self.cboDate.value){
					makeNode2(aryDate1[1]);					
				}
			}

			setDate() ;
		}
		function makeNode1(str){
			var oOption = document.createElement("OPTION");
			
			for (k=cboDate.options.length-1;k>-1;k--){
				if(str == cboDate.options(k).value){
					return; 
				}
			}
			cboDate.options.add(oOption);
			oOption.text=str;
			oOption.value=str;	
			return;	
		}
		function makeNode2(str){
			var oOption = document.createElement("OPTION");	
			
			for (j=cboDate1.options.length-1;j>-1;j--){
				if(str == cboDate1.options(j).value){
					return;  
				}
			}
			cboDate1.options.add(oOption);
			oOption.text=str;
			oOption.value=str;	
			return;	
		}
		function cboDate_onchange(){			
			if (window.kind.value != "total") {alert("<%= Resources.Approval.msg_004 %>...!");return false;}
			if (self.cboDate1.value.indexOf("<%=Resources.Approval.lbl_month %>") == 2){
				fldrName = self.cboDate.value.substring(0,4) + self.cboDate1.value.substring(0,2);
			}else{
				fldrName = self.cboDate.value.substring(0,4) + "0" + self.cboDate1.value.substring(0,1);
			}	
			if (fldrName != ""){
				iworklist.queryGetData();
			}
			return;
		}
		function cboDate_onchange1(){
			if (window.kind.value != "total") {alert("<%= Resources.Approval.msg_004 %>...!");return false;}
			var intCount = self.cboDate1.options.length;
			for (i=intCount;i!=0;i--){
				self.cboDate1.options.remove(i-1);
			}	
			strDate = "<%=strDate%>";
			aryDate = strDate.split("/");
			for(i=aryDate.length-1;i>-1;i--){
				aryDate1 = aryDate[i].split("#");  
				if (aryDate1[0] == self.cboDate.value){
					makeNode2(aryDate1[1]); 
				}
				makeNode1(aryDate1[0]);
			}
			if(self.cboDate.value == "<%=strYear%><%= Resources.Approval.lbl_year %>") {
				cboDate1.text = "<%=strMonth%><%= Resources.Approval.lbl_month %>";
				cboDate1.value = "<%=strMonth%><%= Resources.Approval.lbl_month %>";	
			}
			cboDate_onchange();
			return;
		}
		function setControl(selTabName) {
			setDate();
			window.kind.value = "total";
			window.search.value = "" ;
			
		}
		function setDate() {
			cboDate.text = "<%=strYear%><%= Resources.Approval.lbl_year %>" ;
			cboDate.value = "<%=strYear%><%= Resources.Approval.lbl_year %>" ;
			cboDate1.text = "<%=strMonth%><%= Resources.Approval.lbl_month %>" ;
			cboDate1.value = "<%=strMonth%><%= Resources.Approval.lbl_month %>" ;
			fldrName = "" ;
		}
		function disApv(oApvCheck) {
			if(oApvCheck.checked) {
				//iworklist.frameElement.height = "220" ;
				divApv.style.display = "" ;
			}
			else {
				//iworklist.frameElement.height = "340" ;
				divApv.style.display = "none" ;
			}
		}
		//2005.09.01 백종기 추가 - 왼쪽 메뉴 refresh를 위해 추가
		function refreshList(){			
			document.location.reload();
			//parent.menu_fr.document.location.reload();
		}

		//2006.04.13 by wolf 결재선 보기 체크정보를 쿠키로 저장
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
        //탭 활성화 2008.02 sunny	
        function distab(objchecktabview){
          if(objchecktabview.checked) {
				    divtab.style.display = "";
          }
          else {
				    divtab.style.display = "none";
          }
        }
		
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
      if (!bArchived){
				if((strLocation=="TEMPSAVE") ) {  
            divbtnRSS.style.display ="none";
        }else{
            divbtnRSS.style.display = "" ;
        }
      }else{ divbtnRSS.style.display ="none";}
    }		
    /*=======================================================================
      내      용  : 검색 활성화
      작  성  자  : 황선희
      ========================================================================*/   
    function search_OnClick(){
//        if (!bArchived){
//		    span_search.style.display="";
//		    span_detailsearch.style.display="none";
//        }else{
//            span_search.style.display="none";
//		    span_detailsearch.style.display="";
//		    SLayer.style.width="340px";
//        }
        
        span_search.style.display="";
		span_detailsearch.style.display="none";
		if(SLayer.style.display == ""){
            SLayer.style.display = "none";
        }else{
            SLayer.style.display = "";
        }
		//검색창 활성화 시 기간 검색을 위한 시작날짜/끝날짜 디폴트값 입력(기간 한달)
		document.all("QSDATE").value = document.getElementById("hidQSDATE").value;
	    document.all("QEDATE").value = document.getElementById("hidQEDATE").value;
    }
    
    function foldermove_OnClick(gubun){
      var kind = window.kind.value;
      if (kind=="total"){
        if(gubun=='unit'){
            iworklist.foldermove_OnClick('unit');
        }else{
            iworklist.foldermove_OnClick('user');
        }
      }else{
        if(gubun=='unit'){
            iworklist.ifrDL.foldermove_OnClick('unit');
        }else{
            iworklist.ifrDL.foldermove_OnClick('user');
        }
      }
    }
      
	function setFolderMove(selMainTab) {
		if( (selMainTab=="_R") || (selMainTab=="_D") ) {  
		    btn_userfoldermove.style.display="none"; 				
		    btn_unitfoldermove.style.display="none"; 				
		}
		else {
			btn_userfoldermove.style.display=""; 
			var aButton = sDeptList.split(":"); 				
			if(aButton[7]=="1"){
			    btn_unitfoldermove.style.display="";
			}else{
			    btn_unitfoldermove.style.display="none";
			}
		}	
	}    
		
	/*=======================================================================
	작성목적	: 일괄버튼 활성화 유무
	작 성 자	: 유유미
	최초작성일	: 2009.02
	========================================================================*/   
    function Display_multi(selMainTab){
        //권한체크
        var bView = false;
        if(sUsismanager=="true")    bView= true;
        else
        {
            if(sUsisdocmanager=="true") bView= true;
            else
            {
                if(sDpisdocmanager=="false")    bView= true;            
            }
        }
        // 버튼 display
        if(bView && selMainTab=="_R")
        {
            //li객체 너비 제어
            ExpMenu.style.display="none";
            var aButton = sDeptListButton.split(":");      
            if(aButton[0]=="1")   spanBlocApprove.style.display="";
            if(aButton[1]=="1")   spanBlocApvline.style.display="";
            if(aButton[2]=="1")   spanBlocCharge.style.display="";
        }else{
            spanBlocApprove.style.display="none";
            spanBlocApvline.style.display="none";
            spanBlocCharge.style.display="none";
            if(admintype != ""){//관리자일경우 비활성화
                ExpMenu.style.display="none";
            }else{
                ExpMenu.style.display="";
            }
        }
    }    
    
    /*=======================================================================
	작성목적	: 일괄접수 처리
	작 성 자	: 유유미
	최초작성일	: 2009.02
	========================================================================*/
    function BlocApprove_onClick(){
        //if(confirm("<%= Resources.Approval.msg_258 %>")){ //접수하시겠습니까?
		    var kind = window.kind.value;
		    if (kind=="total"){
		        iworklist.cmdapprove_OnClick("");
	        }else{
		        iworklist.ifrDL.cmdapprove_OnClick();
	        }
	    //}
	}	
	
	/*=======================================================================
	작성목적	: 일괄결재선 지정 처리
	작 성 자	: 유유미
	최초작성일	: 2009.02
	========================================================================*/
	
	var g_dicFormInfo =  new Dictionary();;
	g_dicFormInfo.Add('mode','DEPTLIST');
	g_dicFormInfo.Add('etid','A1');
	
	function BlocApvline_onClick(){
	    //다국어 처리 하면서 고쳐준 부분
	    
	    menu.APVLIST.value="";
//	    if (window.kind.value=="total"){
//	        if(!iworklist.getCheckBox()) return;
//        }else{
//	        alert("분류가 전체일 경우에만 가능합니다"); return;
//        }
	    CoviWindow("ApvlineMgr/ApvlineMgr.aspx","ApvlinelistMgr",950,600,'fix');	
	}
	
	function goBlocApvline(){ //multi2()
	    
	    var kind = window.kind.value;
		if (window.kind.value=="total"){
		    iworklist.cmdapprove_OnClick(menu.APVLIST.value);
	    }else{
		    iworklist.ifrDL.cmdapprove_OnClick();
	    }
	    menu.APVLIST.value="";
	}
	
	/*=======================================================================
	작성목적	: 일괄담당자 지정 처리
	작 성 자	: 유유미
	최초작성일	: 2009.02
	========================================================================*/
	function BlocCharge_onClick(){
//	    if (window.kind.value=="total"){
//	        if(!iworklist.getCheckBox()) return;
//        }else{
//	        alert("분류가 전체일 경우에만 가능합니다"); return;
//        }
	    var m_sAddList ='charge'; 
	    addList(m_sAddList);
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
	    rgParams["sCatSignType"] = "<%= Resources.Approval.lbl_recieve_apv %>";//"수신결재"; 
	    rgParams["sDeptSignType"] = "<%= Resources.Approval.lbl_normalapprove %>";//"일반결재";
	    rgParams["sDeptSignStatus"] = "<%= Resources.Approval.lbl_receive %>";//"수신"; 
	    rgParams["sUserSignType"] = "<%= Resources.Approval.lbl_normalapprove %>";//"일반결재";
	    rgParams["sUserSignStatus"] = "<%= Resources.Approval.lbl_inactive %>";//"대기"; 
	    rgParams["objMessage"] = window;
	    //2007.07 유유미 : 오류 수정 추가부분
	    rgParams["mode"] = "menu";

	    if(sMode == 'receive'){
		    var aRecDept = RecDeptList.value.split("@");
		    var sRecDept = aRecDept[iBody.selectedIndex];
		    if (sRecDept != null){
			    if(sRecDept.length>15) rgParams["sGroup"] = sRecDept.substring(7,sRecDept.length-8);
		    }
	    }
        var szFont = "FONT-FAMILY: '굴림';font-size:9px;";
        var nWidth = 640;
        var nHeight = 610;
        var sFeature = szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;help:no;";
        var strNewFearture = ModifyDialogFeature(sFeature);
        var vRetval = window.showModelessDialog("/COVIWeb/approval/address/address.aspx", rgParams, strNewFearture);
        //var vRetval = window.showModelessDialog("address/address.aspx", rgParams, szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;help:no;");
    }
	
	function insertToList(oList){
	    var m_oChargeList = new ActiveXObject("MSXML2.DOMDocument");
	    m_oChargeList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+oList.xml);
	    var elmRoot = m_oChargeList.documentElement;
	    var elmlist = elmRoot.selectNodes("item");
	    if (elmlist.length == 0 ){
		    alert("<%=Resources.Approval.msg_181 %>"); //'담당자를 지정하십시요!'
		    return false;
	    }else if(elmlist.length > 1){
		    alert("<%=Resources.Approval.msg_182 %>"); //'1명의 담당자만 지정하십시요!'
		    return false;
	    }else{
		    iworklist.requestProcess(elmRoot);
	    }
    }
    
    function delete_onClick(){
		var kind = window.kind.value;
		if (kind=="total"){
		    iworklist.delete_onClick(false);
	    }else{
	        iworklist.ifrDL.delete_onClick(false); // 그룹 조회시
	    }
	    setApvLineClear();
	}
	
	</script>	
	
	
    <script language="javascript" type="text/javascript">
        <!--
        ////////////////////////3단 메뉴 보여주기///////////////////////
	    var g_oPopEL		= null;
	    var sgColorBasic	= '';//이준희(2008-03-04): 기본 배경색|글자색
	    var sgColorMouseOver	= '';//이준희(2008-03-04): mouseover시의 배경색|글자색
	    var sgPrvEle	        = '';//이준희(2008-03-04): 직전에 선택되었던 버튼의 ID
        var oPopup = window.createPopup();
            oPopup.document.createStyleSheet("<%=Session["user_thema"] %>/css/css_style.css", 0);        
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
		            var oPopupBody = oPopup.document.body;       
		            oPopupBody.innerHTML = oContextHTML.innerHTML;
				    try
				    {//이준희(2008-02-28): 툴바상의 풀다운 목록에 대한 디자인상의 보정을 위해 추가함; 차후 CSS로 완전히 제어가 가능한지 고려해 볼 것.
					    sTmp = fnAdjClass(oPopupBody);
					    w = sTmp.split('|')[0];
					    h = sTmp.split('|')[1];//alert(sTmp);					
				    }
				    catch(e)
				    {
				    }
		                fadeIn(oPopupBody);
		                oPopupBody.attachEvent("onmouseleave", event_Popup_mouseleave);
			        var iX = 0;//이준희(2008-02-27): 풀다운 목록이 해당 메뉴 아이템의 좌측 경계선에 X 좌표를 기준하도록 하기 위해 수정함.
			        iX = fnGetX();
			        oPopup.show(iX,25, w, h, el);
    			     
			    }
            }

            function fnAdjClass(obj)
            {//이준희(2008-02-28): 툴바상의 풀다운 목록에 대한 디자인상의 보정을 위해 추가함; 차후 CSS로 완전히 제어가 가능한지 고려해 볼 것.
			    var sRet	= '', sTmp = 0;
			    var oLnks	= null;
			    var i		= 0;
			    var iUnit	= 0;//단위 행의 높이임.
			    iUnit = 20; //높이를 29 에서 20으로 바꿈
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
			    sRet += '110';
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
	            oPopup.hide();
	            //checkbox가 있는 경우 원래 html 에 해당 선택 값 넘기기
	            var el = g_oPopEL;
	            var oContextHTML = window.document.all["oPopUpHTML" + el.ctid];
	            if (oContextHTML != null ) {
	                if (oContextHTML.innerHTML.indexOf("checkbox") > -1 ){
		                var oPopupBody = oPopup.document.body;
		                oContextHTML.innerHTML =  oPopupBody.innerHTML ;		                       
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
        try{
            if (window.kind.value != "total") 
	        {
    	       		    
	            return false;
	        } //그룹정렬이 전체일 경우에만 가능합니다
	        if(iworklist.g_totalcount == "0") 
		    {
		        alert("<%= Resources.Approval.msg_279 %>");
		        return false;
		    }
    		var ListType = selMainTab.replace("tab","");	
            var sdoclistname='';
	        switch (ListType)
	        {
	            case "_A": sdoclistname= "<%= Resources.Approval.lbl_doc_deptcomplet %>";break;
	            case "_E": sdoclistname= "<%= Resources.Approval.lbl_doc_reference2 %>";break;
	            case "_S": sdoclistname= "<%= Resources.Approval.lbl_doc_sent %>";break;
	            case "_SS": sdoclistname= "<%= Resources.Approval.lbl_doc_finish %>";break;
	            case "_R": sdoclistname= "<%= Resources.Approval.lbl_doc_receive %>";break;
	            case "_RC": sdoclistname= "<%= Resources.Approval.lbl_doc_receiveprocess %>";break;
	            case "_I": sdoclistname= "<%= Resources.Approval.lbl_doc_reference2 %>";break;
	            case "_D": sdoclistname= "<%= Resources.Approval.lbl_doc_circulation%>";break;
	            case "_AD": sdoclistname= "<%=Resources.Approval.lbl_doc_auditou %>";break;
	        }
    					
	        if(iworklist.bDetail == true)
	        {
	            iworklist.SavePC_detail(ListType,escape(sdoclistname) );
	        }
	        else
	        { 
                var arrSearchValue = frames("iworklist").getSearchValue().split(';');
                var search_type = arrSearchValue[0];
                var search_value = arrSearchValue[1];
                var start_date = arrSearchValue[2];
                var end_date = arrSearchValue[3];
                var str_ListType = ListType.replace("_", "");
                var query = "ListType=" + str_ListType  + "&doclistname="+escape(sdoclistname) + "&SearchType="+escape(search_type) + "&SearchWord="+escape(search_value)+ "&start_date="+escape(start_date)+ "&end_date="+escape(end_date);
                var url = "ListDeptItemsExcel.aspx?"+query ;
                document.form1.action = url;
                document.form1.target = "result_fr";
                document.form1.submit();				

	        }   
	    }
	    catch(e){}
	}  
		//관리부서 조회
		function queryManageDept(){
		
			if(document.getElementById('ManageUnit').value != ""){
				deptId= document.getElementById('ManageUnit').value;
				uid = deptId;
			    setWorkList(selLocation, "<%= Resources.Approval.lbl_donedate  %>") ;
				setApvLineClear();
				//clearText();
			}
		}	    
		var	m_xmlHTTPUnit = CreateXmlHttpRequest();
		//부서함조회
		function getManageUnit(unitID){
			try{
				var pXML = "dbo.usp_GetUnitJoin";					
				var aXML = "<param><name>DIVKEY</name><type>VarChar</type><length>100</length><value>UNIT</value></param>";
				aXML += "<param><name>userID</name><type>VarChar</type><length>100</length><value></value></param>";
				aXML += "<param><name>unitID</name><type>VarChar</type><length>100</length><value><![CDATA["+unitID+"]]></value></param>";
				var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
				var szURL = "GetXMLQuery.aspx";
				requestHTTPUnit("POST",szURL,true,"text/xml",receiveManageUnitHTTP, sXML); 
			}catch(e){
				alert("Error : " + e.description + "\r\nError number: " + e.number);
			}				
		}
		function event_noop(){return;}
		function requestHTTPUnit(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
			m_xmlHTTPUnit.open(sMethod,sUrl,bAsync);
			m_xmlHTTPUnit.setRequestHeader("Content-type", sCType);
			if(pCallback!=null)m_xmlHTTPUnit.onreadystatechange = pCallback;
			(vBody!=null)?m_xmlHTTPUnit.send(vBody):m_xmlHTTPUnit.send();			
		}

		function receiveManageUnitHTTP(){
			var t_flag = false;
			if(m_xmlHTTPUnit.readyState==4){
	
				m_xmlHTTPUnit.onreadystatechange=event_noop;
				if(m_xmlHTTPUnit.responseText.charAt(0)=='\r'){
					alert( m_xmlHTTPUnit.responseXML.xml);
				}else{
					var errorNode = m_xmlHTTPUnit.responseXML.selectSingleNode("response/error");
					if(errorNode != null){
						alert("Desc: " + errorNode.text);
					}else{
						try{
							if(m_xmlHTTPUnit.responseXML.selectNodes("response/NewDataSet/Table").length > 0){
								var elmList = m_xmlHTTPUnit.responseXML.selectNodes("response/NewDataSet/Table");
								var elm;
								var szText="";

								if(document.getElementById('ManageUnit').length == "1"){
									resetCBOobject(document.getElementById('ManageUnit'));
									makeCBOobject(deptId,"<%= Resources.Approval.lbl_BelongDept %>",document.getElementById('ManageUnit')); //부서함선택
								}

								for(var i=0 ; i <elmList.length;i++){
									elm = elmList.nextNode();
									if ( elm != null){
										if (elm.selectSingleNode("MGR_UNIT_CODE") !=null && elm.selectSingleNode("MGR_UNIT_CODE").text!="" && elm.selectSingleNode("MGR_UNIT_CODE").text !="null")
										{
											t_flag = true;
											makeCBOobject(elm.selectSingleNode("MGR_UNIT_CODE").text,getLngLabel(elm.selectSingleNode("MGR_UNIT_NAME").text,false), document.getElementById('ManageUnit'));
										}							
									}
								}

								if(t_flag == false)
								{
									resetCBOobject(document.getElementById('ManageUnit'));
									makeCBOobject(deptId,"<%= Resources.Approval.lbl_BelongDept %>", document.getElementById('ManageUnit')); //부서함선택
								}								
							}
							 //타부서함 조회 활성화 : 조회가능 부서가 있는 경우만 
							  if ( document.getElementById('ManageUnit').length > 1 ){
								document.getElementById('ManageUnit').style.display = "";
							  }else{
								//document.getElementById('ManageUnit').style.display = "none";
							  }
						}catch(e){alert("Error : " + e.description + "\r\nError number: " + e.number);}
					}
				}
			}
		}

		//관리부서함조회
		function getManageDept(userID){	  //처리
		
			try{
				var pXML = "dbo.usp_GetUnitJoin";					
				var aXML = "<param><name>DIVKEY</name><type>VarChar</type><length>100</length><value>director</value></param>";
				aXML += "<param><name>userID</name><type>VarChar</type><length>100</length><value><![CDATA["+userID+"]]></value></param>";
				aXML += "<param><name>unitID</name><type>VarChar</type><length>100</length><value>unitID</value></param>";
				var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
				var szURL = "GetXMLQuery.aspx";
				requestHTTPUnit("POST",szURL,true,"text/xml",receiveManageDeptHTTP, sXML);
			
			}catch(e){
				alert("Error : " + e.description + "\r\nError number: " + e.number);
			}				
		}
		function receiveManageDeptHTTP(){
		
			var t_flag = false;
			if(m_xmlHTTPUnit.readyState==4){
			
				m_xmlHTTPUnit.onreadystatechange=event_noop;
				if(m_xmlHTTPUnit.responseText.charAt(0)=='\r'){
					alert(m_xmlHTTPUnit.responseText);
				}else{
					var errorNode = m_xmlHTTPUnit.responseXML.selectSingleNode("response/error");
					
					if(errorNode != null){
						alert("Desc: " + errorNode.text);
					}else{
						try{
							if(m_xmlHTTPUnit.responseXML.selectNodes("response/NewDataSet/Table").length > 0){

								var elmList = m_xmlHTTPUnit.responseXML.selectNodes("response/NewDataSet/Table");
								var elm;
								var szText="";
								resetCBOobject(document.getElementById('ManageUnit'));
								makeCBOobject(deptId,"<%= Resources.Approval.lbl_BelongDept %>", document.getElementById('ManageUnit')); //부서함선택
								for(var i=0 ; i <elmList.length;i++){
									elm = elmList.nextNode();

									try{
										if (elm.selectSingleNode("UNIT_CODE")!=null && elm.selectSingleNode("UNIT_CODE").text!="" && elm.selectSingleNode("UNIT_CODE").text !="null")
										{
											t_flag = true;	
											makeCBOobject(elm.selectSingleNode("UNIT_CODE").text,getLngLabel(elm.selectSingleNode("UNIT_NAME").text,false), document.getElementById('ManageUnit'));
										}

									}catch(e){
										//alert("<%=Resources.Approval.msg_166 %>");
									}
								}
								if(t_flag == false)
								{
									resetCBOobject( document.getElementById('ManageUnit'));
									makeCBOobject(deptId,"<%= Resources.Approval.lbl_BelongDept %>",document.getElementById('ManageUnit')); //부서함선택
								}else{
								}
							}
						}catch(e){alert("Error : " + e.description + "\r\nError number: " + e.number);}
						//getManageUnit(uid);  //통합부서관리
					}
				}
			}
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

		function resetCBOobject(cboObject){
			try{
				cboObject.length = 0;
			}catch(e){}
			return;	
		}	      
        function OpenDocClass(){
            
            fnPopUpModal("../ExtensionService/Doc/DM_Folder_List.aspx",20,18);

        }
        function fnPopUpModal(modalUrl,modalWidth,modalHeight)
        {
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
        -->
    </script>
    
    
    <!-- 엑셀파일 -->
    <form class="form" id="form1" method="post" name="myform" target="result_fr"></form>
    <iframe src="" name="result_fr" height="100" width="100" style="DISPLAY:none;"></iframe>		                                
    <!-- /엑셀파일 -->
</body>
</html>
