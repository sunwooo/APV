<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListAudit.aspx.cs" Inherits="COVINet.COVIFlowNet.ListAudit" %>
<%@ Register Src="Portal/UxFooter.ascx" TagName="UxFooter" TagPrefix="ucfooter" %>
<%@ Register Src="Portal/UxQuickMenu.ascx" TagName="UxQuickMenu" TagPrefix="ucquickmenu" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Worklist</title>
    <style type="text/css">
	<!--
	    #SLayer {
		    position:absolute;
		    left:150px;
		    top:55px;
		    width:400px;
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

</head>
<body>  
<div id="SubWidth">
  <!-- 타이틀 영역 div 시작 -->
  <div class="Title">
    <h1>&nbsp;<asp:Label runat="server" ID="PageName" /></h1>
    <!-- 네비게이션 영역 시작 -->
    <ul class="small" style="display:none;">
      <li>Home&gt;</li>
      <li><asp:Label runat="server" ID="PagePath" />&gt;</li>
      <li><b><asp:Label runat="server" ID="PageName2" /></b></li>
    </ul>
    <!-- 네비게이션 영역 끝 -->
    <!-- 타이틀 라인 시작
    <div class="Title_bg01"></div>
    <div class="Title_bg02"></div> -->
  </div>
  <!-- 타이틀 라인 끝 -->
<!-- 버튼 영역 div 시작 -->
<div class="n_btntb">
<ul>
    <li id="btn_main">
        <a ID="btn_reload" class="btnov" href="#" onclick="javascript:editUnit();" style="cursor:default;" class="btnov"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_refresh.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_deptselect%></span></a>
    </li>
    <li id="btn_option">
	    <div ID="imgDelete" style="display:none;" >
            <a class="Btn_Group01" href="#" onclick="javascript:document.getElementById('iworklist').contentWindow.delete_onClick();setApvLineClear();" style="cursor:default;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_delete.gif" /><%=Resources.Approval.btn_delete %></span></a>
        </div>
        <select id="cboUser" name="cboUser"   style="width:80;font-size:9pt;" onchange="return cboUser_onchange();"><!-- onchange="return cboUser_onchange();"--><option>--부서를 선택하세요--</option></select>&nbsp;
        <span id="btn_search" style="display:;">
			<a class="btnov" href="#" onclick="javascript:search_OnClick();" style="cursor:default;" class="btnov"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_search.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_search %></span></a>
		</span>
    
      <!-- 분류 select div 시작 -->
      <input type="checkbox" name="chktab" onclick="distab(this);" id="chktab" style="CURSOR:hand"/>&nbsp;<asp:Label runat="server" ID="DisplayTab" />&nbsp;&nbsp;<!--탭보기-->
      <span style="display:none;"><input type="checkbox" name="chkView" onclick="disApv(this);" id="chkView" style="CURSOR:hand">&nbsp;<asp:Label runat="server" ID="ApvLineView" />&nbsp;&nbsp;</span><!--결재선보기-->
      <select id="kind" name="kind" onchange="group()" style="display:none;"></select>
      <!-- 분류 select div 시작 -->
    </li>
</ul>
</div>
<!--탭 div 시작-->
    <div class="tab01 small" id="divtab" style="display:none;">
         <ul>
            <li id="divPREAPPROVAL" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);" id="_PREAPPROVAL" name="PREAPPROVAL"><span><%= Resources.Approval.lbl_doc_pre2 %></span></a><!--예고함--></li>
            <li id="divAPPROVAL" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);"  id="_APPROVAL" name="APPROVAL"><span><%= Resources.Approval.lbl_doc_approve2%></span></a><!--미결함--></li>
            <li id="divPROCESS" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_PROCESS" name="PROCESS"><span><%= Resources.Approval.lbl_doc_process2%></span></a><!--진행함--></li>
            <li id="divCOMPLETE" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_COMPLETE" name="COMPLETE"><span><%= Resources.Approval.lbl_doc_complete2%></span></a><!--완료함--></li>
            <li id="divREJECT" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_REJECT" name="REJECT"><span><%= Resources.Approval.lbl_doc_reject2%></span></a><!--반려함--></li>
			<li id="divTEMPSAVE" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);"  id="_TEMPSAVE" name="TEMPSAVE"><span><%= Resources.Approval.lbl_composing%></span></a><!--임시함--></li>            
			<li id="divCCINFO" style="display:none;"><a href="#"  onclick="javascript:changeBox(this);"  id="_CCINFO" name="CCINFO"><span><%= Resources.Approval.lbl_doc_reference2%></span></a><!--참조함--></li>            
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
			<iframe id="iApvLine" name="iApvLine" width='100%' height="130" frameborder="0" src='about:blank'" datasrc="../ApvlineMgr/ApvlineViewer.aspx" style='margin:0; padding:0; scroll:auto;'></iframe>
			</span>
			<span id="spanApvGraphic" style="DISPLAY: none" name="spanApvGraphic">
			<iframe id="iApvGraphic" style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; scroll: auto" dataSrc="./ApvMonitor/MonitorGraphic.aspx" name="iApvGraphic" src="./ApvMonitor/MonitorGraphic.aspx" frameBorder="0" width="100%" height="130"></iframe>
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
                                <td height="25" class="SLPop"><b><%=Resources.Approval.lbl_search %></b>&nbsp;</td>
                                <td style="display:none;">&nbsp;
                                    <select id="sel_Search" name="sel_Search" style="width:70">
                                        <option value="PI_NAME" selected ><asp:Label runat="server" ID="lbl_Title" /></option>
                                        <option value="PI_INITIATOR_NAME"><asp:Label runat="server" ID="lbl_Intiator" /></option>
                                     </select>
                                     &nbsp;
                                 </td>
                                
                                 <td>                                                                             
                                    <input type="text" id="QSDATE" name="QSDATE" readonly="readonly" style='font-size:9pt; PADDING-LEFT: 3px; width:70px;'  datepicker="true" datepicker_format="YYYY-MM-DD" />                                        
                                    <b>~</b>
                                    <input type="text" id="SEARCHDATE" name="SEARCHDATE" readonly="readonly" style='font-size:9pt; PADDING-LEFT: 3px; width:70px;'  datepicker="true" datepicker_format="YYYY-MM-DD" />
                                </td>
                                <td ><input name="search" id="search" type="text" class="type-text" size="40" style="IME-MODE:active; WIDTH:150px;display:none;" onKeyPress="if (event.keyCode==13) cmdSearch_onClick();" /><a href="#" onclick="cmdSearch_onClick()"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_search02.gif" align="absmiddle" border="0" /></a></td>
                                <td style="padding:0 2px 8px 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_box_x.gif" alt="" onclick="javascript:document.getElementById('SLayer').style.display='none';DatePickerControl.hide();"></td>
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
        <iframe id="nPopLayerAPV" name="nPopLayerAPV" src="ListItemsApproveLine.aspx" style="border-color:Black;width:650px;height:280px; border-width:thin; border-style:dotted;" frameborder="0"></iframe>
    </div>    
    <input type="hidden" id="hidQSDATE" runat="server" />
    <input type="hidden" id="hidQEDATE" runat="server" />
    <!--footer start-->
    <ucfooter:UxFooter ID="UxFooter1" runat="server" />
    <!--footer end -->
</div>
<!--quick Menu-->
<ucquickmenu:UxQuickMenu ID="UxWF_Footer" runat="server" />
<!--quick End-->
<!-- 달력선택 div 시작 -->
<div id="minical" OnClick="this.style.display='none';" oncontextmenu="return false" ondragstart="return false"
onselectstart="return false" style="background : buttonface; margin: 5; margin-top: 2;border-top: 1 solid buttonhighlight;border-left: 1 solid buttonhighlight;border-right: 1 solid buttonshadow;border-bottom: 1 solid buttonshadow;width:175;display:none;position: absolute; z-index: 2"></div>
<iframe id="frmcal"  scrolling="no" frameborder="0" style="background : buttonface; margin: 5; margin-top: 2;border-top: 0 solid buttonhighlight;border-left: 0 solid buttonhighlight;border-right: 0 solid buttonshadow;border-bottom: 0 solid buttonshadow;width:175;display:none;position: absolute; z-index: 1"></iframe>
<!-- 달력선택 div 종료 -->

	<script language="javascript" type="text/javascript">
		var gLabel_Months = <%=Resources.Approval.lbl_Months %>;
		var gLabel_Days = <%=Resources.Approval.lbl_Days %>;
	</script>


<script type="text/javascript" language="javascript">
		var uid="";
		//2006.12.13 by wolf 사용자 문서 조회 및 수정
		//변수 선언
		var admintype = "MONITOR";
		//2006.12.13 by wolf 사용자 문서 조회 및 수정 End

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
		    //window.open(theURL,winName,features);
		}

		var selLocation = "<%=Request.QueryString["location"]%>" ;
		var selApv = "tabApvLine" ;
		var strMode = "<%=Request.QueryString["mode"]%>" ;
		var bArchived = false ;
	    try{if(parent.frames[0].bArchived) bArchived = parent.frames[0].bArchived;}catch(e){}
		var gLngIdx = <%=strLangIndex %>;
	    
	    window.onload= initOnload;
        function initOnload()
        {

            setPerTab() ;	// Tab에 Label 설정

			if(selLocation == ""){selLocation = "COMPLETE";}
			document.getElementById("div"+selLocation.replace("_","")).className = "current" ;
			/*  웹표준화로 수정
			eval("div"+selLocation.replace("_","")).className = "current" ;*/
			

			//setWorkList(eval(selLocation).name, eval(selLocation).getAttribute("colLabel")) ;			
			setGroup(selLocation) ;			
			setDelete(selLocation) ;
			//setSearch(selLocation) ; 			

			var cookiedata = document.cookie; 	
			if ( cookiedata.indexOf("chkView=True") > -1 ){ 
				document.getElementById("chkView").checked = true;
				disApv(document.getElementById("chkView"));
			}
        }
 
		function changeBox(selTab){
			if (selTab.name != selLocation) {
			
				document.getElementById("div"+selLocation.replace("_","")).className = "" ;
                document.getElementById("div"+selTab.id.replace("_","")).className = "current" ;
				
				selLocation = selTab.name ;
				if (uid!="")	setWorkList(selTab.name, selTab.getAttribute("colLabel")) ;
				
				setGroup(selTab.name) ;
				//setDelete(selLocation) ;
				setApvLineClear();
				setControl() ;
			}
		}

		function changeApv(selTab, oApvLine, strApvlineDisp, oApvGraphic, strApvGraphicDisp) {
		
			if (selTab.name != selApv) {
				
				document.getElementById("div"+selApv.replace("_","")).className = "" ;
			    document.getElementById("div"+selTab.id.replace("_","")).className = "current" ;

				selApv = selTab.name ;
				document.getElementById(oApvLine).style.display = strApvlineDisp ;
				document.getElementById(oApvGraphic).style.display = strApvGraphicDisp ;
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
		    document.getElementById("iworklist").contentWindow.location = "/CoviWeb/approval/listitems.aspx?uid="+uid+"&location=" + pLocation + "&mode=" + strMode +  "&label=" + escape(pLabel) + "&admintype=" + admintype;
		}

		function setPerTab() {
			document.getElementById("_PREAPPROVAL").setAttribute("colLabel", "<%= Resources.Approval.lbl_doc_requested %>") ; //기안일자
			document.getElementById("_APPROVAL").setAttribute("colLabel", "<%= Resources.Approval.lbl_receivedate  %>") ; //받은일자
			document.getElementById("_PROCESS").setAttribute("colLabel", "<%= Resources.Approval.lbl_doc_requested %>") ; //결재일자
			document.getElementById("_COMPLETE").setAttribute("colLabel","<%= Resources.Approval.lbl_doc_requested %>") ; //완료일자
			document.getElementById("_REJECT").setAttribute("colLabel", "<%= Resources.Approval.lbl_doc_requested %>") ; //반려일자
			document.getElementById("_TEMPSAVE").setAttribute("colLabel", "<%= Resources.Approval.lbl_moddate %>") ; //저장일자
			document.getElementById("_CCINFO").setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>") ; //완료일자
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
			//window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
		}
		function group()
		{	
			var kind = document.getElementById("kind").value;
			var golist;
			
			setApvLineClear();
			//window.search.value = "" ;
			document.getElementById("search").value = "";
			if(uid == ""){
			    alert("부서를 선택하세요.");
			}else{
			    if (kind=="total")
			    {				
				    document.getElementById("iworklist").contentWindow.location = "listitems.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind="+ "&admintype=" + admintype; ;
			    }
			    else if(kind=="WORKDT")
			    {				
				    document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=WORKDT" + "&admintype=" + admintype; ;
			    }
			    else if(kind=="PI_INITIATOR_NAME")
			    {
				    document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=PI_INITIATOR_NAME" + "&admintype=" + admintype; ;
			    }
			    else if(kind=="PI_INITIATOR_UNIT_NAME")
			    {			
				    document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=PI_INITIATOR_UNIT_NAME" + "&admintype=" + admintype; ;
			    }
    //			else if(kind=="PF_SUB_KIND")
    //			{			
    //				iworklist.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=PF_SUB_KIND" ;
    //				golist="<iframe frameborder=0 id='iworklist' name='iworklist' src='listgroup.aspx?uid="+ uid  + "&location=" + "<%=Request.QueryString["location"]%>" + "&mode=" + "<%=Request.QueryString["mode"]%>" + "&kind=PF_SUB_KIND' style='WIDTH:100%;HEIGHT:80%'></iframe>";						
    //			}
			    else if(kind=="FORM_NAME")
			    {
				    document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=FORM_NAME" ;
			    }	
			}
		}
		function showSubGroup(){
			uid = document.getElementById("selSubGroup").value;
			group();
			setApvLineClear();
		}
		function refresh() {
		    if (uid != ""){
			    document.getElementById("iworklist").document.location.reload();
			    setApvLineClear();
			}
		}
		/*=======================================================================
		내      용  : 검색 활성화
		작  성  자  : 황선희
		========================================================================*/   
		  function search_OnClick(){
			if (!bArchived){
				document.getElementById("span_search").style.display="";
				//span_detailsearch.style.display="none";
			}else{
				document.getElementById("span_search").style.display="none";
				//span_detailsearch.style.display="";
				document.getElementById("SLayer").style.width="140px";
			}
	        
			if(document.getElementById("SLayer").style.display == ""){
				document.getElementById("SLayer").style.display = "none";
			}else{
				document.getElementById("SLayer").style.display = "";
			}
	        
	          
			//검색창 활성화 시 기간 검색을 위한 시작날짜/끝날짜 디폴트값 입력(기간 한달)
			document.getElementById("QSDATE").value = document.getElementById("hidQSDATE").value;
			document.getElementById("SEARCHDATE").value = document.getElementById("hidQEDATE").value;
		  }
			
	
		function cmdSearch_onClick(){
		
		    if(document.getElementById("iworklist").contentWindow.location.href == "about:blank") return;
		    
			if (document.getElementById("kind").value != "total") {alert("<%= Resources.Approval.msg_004 %>...!");return false;} //그룹정렬이 전체일 경우에만 가능합니다
			setApvLineClear();
			document.getElementById("kind").value = "total";
			document.getElementById("iworklist").contentWindow.uid = self.document.getElementById("cboUser").value;
			
			document.getElementById("iworklist").contentWindow.cmdSearch_onClick(document.getElementById("sel_Search").value, document.getElementById("search").value, document.getElementById("QSDATE").value, document.getElementById("SEARCHDATE").value);
			//setWorkList(selLocation, eval(selLocation).getAttribute("colLabel"));
			//검색 후 검색창 display none
			document.getElementById("SLayer").style.display = "none";
			//검색 후 검색어 초기화
			document.getElementById("search").value = "";
		}
		
		function setGroup(strTempSave) {
			var k = 0 ;
			if(strTempSave!="TEMPSAVE") {k=5;}
			else {k=3;}
			document.getElementById("kind").length = k;
			document.getElementById("kind").options[0].value = "total";
			document.getElementById("kind").options[0].text = "<%= Resources.Approval.lbl_total %>"; //전체
			document.getElementById("kind").options[1].value = "WORKDT";
			document.getElementById("kind").options[1].text = "<%= Resources.Approval.lbl_date_by %>"; //날짜별
			if(strTempSave!="TEMPSAVE") {
				document.getElementById("kind").options[2].value = "PI_INITIATOR_NAME";
				document.getElementById("kind").options[2].text = "<%= Resources.Approval.lbl_initiator_by %>"; //기안자별
				document.getElementById("kind").options[3].value = "PI_INITIATOR_UNIT_NAME";
				document.getElementById("kind").options[3].text = "<%= Resources.Approval.lbl_initiatou_by %>"; //기안부서별
				document.getElementById("kind").options[4].value = "FORM_NAME";
				document.getElementById("kind").options[4].text = "<%= Resources.Approval.lbl_form_by %>"; //양식별
			}
			else {
				document.getElementById("kind").options[2].value = "FORM_NAME";
				document.getElementById("kind").options[2].text = "<%= Resources.Approval.lbl_form_by %>"; //양식별
			}
			if(strTempSave == "TCINFO")
			{
			    document.getElementById("kind").style.display = "none";
			    document.getElementById("sel_Search").length = 1;
			    document.getElementById("sel_Search").options[0].selected = true;
			    			    
			}
			else
			{
			     document.getElementById("kind").style.display  = "none";
			     document.getElementById("sel_Search").length = 2;
			     document.getElementById("sel_Search").options[1].value = "PI_INITIATOR_NAME"
				 document.getElementById("sel_Search").options[1].text = "<%= Resources.Approval.lbl_writer %>" //기안자
			     
			}
		}
		function setSearch(strTempSave){
			var s = 0;
			if(strTempSave!="TEMPSAVE") {s=3;}
			else {s=1;}
			document.getElementById("sel_Search").length = s;
			document.getElementById("sel_Search").options[0].value = "PI_SUBJECT";
			document.getElementById("sel_Search").options[0].text = "<%= Resources.Approval.lbl_subject %>"; //제목
			if(strTempSave!="TEMPSAVE") {
				document.getElementById("sel_Search").options[1].value = "PI_INITIATOR_UNIT_NAME"
				document.getElementById("sel_Search").options[1].text = "<%= Resources.Approval.lbl_writedept %>" //기안부서
				document.getElementById("sel_Search").options[2].value = "PI_INITIATOR_NAME"
				document.getElementById("sel_Search").options[2].text = "<%= Resources.Approval.lbl_writer %>" //기안자
				//sel_Search.options(3).value = "PI_BUSINESS_DATA2"
				//sel_Search.options(3).text = "<%= Resources.Approval.lbl_approver %>" //결재자
			}

		}
		function setDelete(strLocation) {
			if((strLocation=="REJECT") || (strLocation=="TEMPSAVE")  ) {  //2006.09.19 김현태 완료함 삭제버튼 제거 (strLocation=="COMPLETE") || 
				document.getElementById("imgDelete").style.display = "" ;				
			}
			else {document.getElementById("imgDelete").style.display = "none" ;}
		}
		function setApvLineClear() {
			iApvLine.location = "about:blank" ;			
			iApvGraphic.drawGraphic("");			
		}
		function setControl() {
			//window.kind.value = "total";
			//window.search.value = "" ;
			document.getElementById("kind").value = "total";
			document.getElementsByName("search")[0].value = "";
		}
		function disApv(oApvCheck) {
		
			if(oApvCheck.checked) {
				//iworklist.frameElement.height = "220" ;
				document.getElementById("divApv").style.display = "" ;
				//2005.12.20 by wolf 결재선 보기 체크 박스 클릭시 조회
				try{
					document.getElementById("iworklist").contentWindow.showDetailCheckBox(); // 일반 리스트
				}catch(e){
					try{
						document.getElementById("iworklist").contentWindow.document.getElementById("ifrDL").contentWindow.showDetailCheckBox(); // 그룹 조회시
					}catch(e){}
				}
			}
			else {
				//iworklist.frameElement.height = "380" ;
				document.getElementById("divApv").style.display = "none" ;
			}
			
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
        var m_xmlHTTP = CreateXmlHttpRequest();
        /* 웹표준화로수정
        var m_xmlHTTP=new ActiveXObject("MSXML2.XMLHTTP");*/
        
        function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	        m_xmlHTTP.open(sMethod,sUrl,bAsync);
	        //m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
	        m_xmlHTTP.setRequestHeader("Content-type", sCType);
	        if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	        (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
        	
        }		
        function receiveHTTP(){
	        if(m_xmlHTTP.readyState==4){
		        m_xmlHTTP.onreadystatechange=event_noop;
		        var xmlReturn=m_xmlHTTP.responseXML;
		        if(xmlReturn.xml==""){
			        alert(m_xmlHTTP.responseText);
		        }else{
			        var errorNode=xmlReturn.selectSingleNode("response/error");
			        if(errorNode!=null){
				        alert("Desc: " + errorNode.text);
			        }else{
					    var elmlist = xmlReturn.selectNodes("response/NewDataSet/Table");
					    var elm;
					    for(var i=0;i < elmlist.length;i++){
						    //elm = elmlist.nextNode();
						    elm = getselectNodesArray(elmlist, i);
						    makeNodeUser(elm.selectSingleNode("PERSON_CODE").text, elm.selectSingleNode("UNIT_NAME").text + ' ' + elm.selectSingleNode("DISPLAY_NAME").text +' ' +elm.selectSingleNode("JOBPOSITION_Z").text.split("&")[0]);
					    }
			        }
		        }
	        }
        }
        function event_noop(){return(false);} 
        
		function cboUser_onchange(){
			uid = self.document.getElementById("cboUser").value;
            //setWorkList(eval(selLocation).name, eval(selLocation).getAttribute("colLabel")) ;				
 			document.getElementById("iworklist").contentWindow.uid = self.document.getElementById("cboUser").value.split(";")[1];
           setWorkList(selLocation, document.getElementsByName(selLocation)[0].getAttribute("colLabel"));	        
			return;
		}
		function makeNodeUser(strcode, strname){
			var oOption = document.createElement("OPTION");
			document.getElementById("cboUser").options.add(oOption);
			oOption.text=strname;
			oOption.value=strcode;	
			return;	
		}

	   function editUnit(m_flag){
	    
			var rgParams=null;
			flag = m_flag;
			rgParams=new Array();
			rgParams["bMail"]  = false;
			rgParams["bUser"] = false;
			rgParams["bGroup"] = true;
			rgParams["bRef"] = false;
			rgParams["bIns"] = false; 
			rgParams["bRecp"] = false; 
			rgParams["sCatSignType"] = null; 
			rgParams["sDeptSignType"] = null;
			rgParams["sDeptSignStatus"] = null; 
			rgParams["sUserSignType"] = null;
			rgParams["sUserSignStatus"] = null; 
		
			rgParams["m_oldValue"] = false ; 
			
			rgParams["objMessage"] = window;
			var szFont = "FONT-FAMILY: '굴림';font-size:9px;";
			var nWidth = 640;
			var nHeight = 610;
			var sFeature = szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;help:no;";
			var strNewFearture = ModifyDialogFeature(sFeature);       
	        
			var vRetval =  window.showModalDialog("/COVIWeb/approval/address/address.aspx", rgParams, strNewFearture);        
		}
		
		function insertToList(oList){
			//var m_oChargeList = new ActiveXObject("MSXML2.DOMDocument");
		    
			var m_oChargeList = CreateXmlDocument();
			m_oChargeList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+oList.xml);

			var elmRoot = m_oChargeList.documentElement;
			var elmlist = elmRoot.selectNodes("item");
			var elm;
			var allUid = "";
			var rtnDeptName ="";
			var rtnDeptCode ="";
		    
			if(elmlist.length > 1){
				alert("한개의 부서만 선택하십시오.");
				return false;
			}else if(elmlist.length == 1){
				self.document.getElementById("cboUser").length = elmlist.length;
				uid = "";
		           
				for(var i=0; i < elmlist.length ; i++){
					//elm = elmlist.nextNode();
					elm = getselectNodesArray(elmlist, i);
		            
					document.getElementById("cboUser").options[i].value = elm.selectSingleNode("AN").text; 
					document.getElementById("cboUser").options[i].text = elm.selectSingleNode("ETNM").text+"-"+getLngLabel(elm.selectSingleNode("DN").text,false);  //기안부서
					if (uid != ''){
						uid = uid + "|" + elm.selectSingleNode("AN").text ;
					}else{
						uid =  elm.selectSingleNode("AN").text;
					}
				}
				setWorkList(selLocation, document.getElementsByName(selLocation)[0].getAttribute("colLabel"));	        
			}else{
				alert("선택된 부서가 없습니다.");
			}

		}
    
    // Node의 Item접근을 위해서 사용  IE와 FireFox의 차이로 인하여 
    function getselectNodesArray(col, i) {    
        if (navigator.appName == "Microsoft Internet Explorer") {
            col = col[i];        
        }
        else {
            col = col.item[i];
        }
        return col ;
    }
    
	function dblDigit(iVal)
	{
	    return (iVal<10 ? "0"+iVal : iVal);
	}
	
	function distab(objchecktabview)
	{
        if(objchecktabview.checked) {
            document.getElementById("divtab").style.display = "";
        }
        else {
            document.getElementById("divtab").style.display = "none";
        }
    }						
	
    </script>
    <script type="text/javascript" language="javascript" src="/coviweb/approval/forms/calendar/datepickercontrol.js"></script>
	</body>
</html>
