<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListFolder.aspx.cs" Inherits="COVINet.COVIFlowNet.List" %>
<%@ Register Src="Portal/UxFooter.ascx" TagName="UxFooter" TagPrefix="ucfooter" %>
<%@ Register Src="Portal/UxQuickMenu.ascx" TagName="UxQuickMenu" TagPrefix="ucquickmenu" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
	<title>Worklist</title>
		<style type="text/css">
		<!--
		#SLayer {
			position:absolute;
			left:150px;
			top:55px;
			width:600px;
			z-index:1;
		}
		-->
		</style>	
	<script type="text/javascript" src="../common/script/CFL.js"></script>
	<script type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
</head>
<body>
<form runat="server">
<div id="SubWidth">
  <!-- 타이틀 영역 div 시작 -->
  <div class="Title">
	<h1><asp:Label runat="server" ID="PageName" style="display:none;"/><span id="bar" style="display:none"> - </span><%=Request.QueryString["location_name"]%></h1>
	<!-- 네비게이션 영역 시작 -->
	<ul class="small" style="display:none;">
	  <li>Home&gt;</li>
	  <li><asp:Label runat="server" ID="PagePath" />&gt;</li>
	  <li><span id="spanArchivedPass" style="display:none;"><b><%=Resources.Approval.lbl_old_doc %></b></span></li>
	  <li><b><asp:Label runat="server" ID="PageName2" /></b></li>
	</ul>
	<!-- 네비게이션 영역 끝 -->
  </div>
  <!-- 타이틀 라인 끝 -->
	<!-- 버튼 영역 div 시작 -->
	<div class="n_btntb">
		<ul style="padding-top:3px;">
		<li>
		<a id="btn_reload" class="btnov" href="#" onclick="javascript:refresh();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_refresh.gif" align="middle" /><%=Resources.Approval.btn_refresh %></span></a> 
		<a id="btn_add" class="btnov" href="#" onclick="javascript:folderaddclick(this, event);"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_register.gif" align="middle" /><%=Resources.Approval.btn_userfolderadd %></span></a> 
		<span id="imgModi" style="display:none;" > 
			<a class="btnov" href="#" onclick="javascript:modify_onClick();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_revision.gif" align="middle" /><%=Resources.Approval.btn_userfoldernameupdate%></span></a>
		</span>
		<span id="imgDelete" style="display:none;" > 
			<a class="btnov" href="#" onclick="javascript:delete_onClick();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_delete.gif" align="middle" /><%=Resources.Approval.btn_delete %></span></a>
		</span>
		<span id="spanApprove" style="display:none;">
			<a  class="btnov" href="#" onclick="javascript:approve_onClick();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_delete.gif" align="middle" /><%=Resources.Approval.btn_approve %></span></a>
		</span>
		<span id="btn_userfoldermove_2" style="display:none;" >
			<a class="btnov" href="#" onclick="javascript:foldermove_OnClick();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_move.gif" align="middle" /><%=Resources.Approval.btn_userfoldermove %></span></a>
		</span>
		<span id="btn_restore" style="display:none;" >
			<a class="btnov" href="#" onclick="javascript:restore_OnClick();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_move.gif" align="middle" /><%=Resources.Approval.btn_restore %></span></a>
		</span>
		<span id="btn_search" style="display:none">
			<a class="btnov" href="#" onclick="javascript:search_OnClick();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_search.gif" align="middle" /><%=Resources.Approval.btn_search %></span></a>
		</span>
		</li>
		<!-- 분류 select div 시작 -->
		<li>
		  <span style="display:none;"><input type="checkbox" name="chkView" onclick="disApv(this);" ID="chkView" style="CURSOR:hand">&nbsp;<asp:Label runat="server" ID="ApvLineView" />&nbsp;&nbsp;</span><!--결재선보기-->
		  <select id="kind" name="kind" onchange="group()"></select>
		</li>
		<!-- 분류 select div 끝 -->
	  </ul>
	</div>
	<!--탭 div 시작-->
	<div class="tab01 small" style="display:none;">
		 <ul>
			<li id="divPREAPPROVAL" style="display:;"><a href="#"  onclick="javascript:changeBox(this);" id="_PREAPPROVAL" name="PREAPPROVAL" class="s1"><span><%= Resources.Approval.lbl_doc_pre2 %></span></a><!--예고함--></li>
			<li id="divAPPROVAL" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_APPROVAL" name="APPROVAL" class="s1"><span><%= Resources.Approval.lbl_doc_approve2%></span></a><!--미결함--></li>
			<li id="divPROCESS" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_PROCESS" name="PROCESS" class="s1"><span><%= Resources.Approval.lbl_doc_process2%></span></a><!--진행함--></li>
			<li id="divCOMPLETE" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_COMPLETE" name="COMPLETE" class="s1"><span><%= Resources.Approval.lbl_doc_complete2%></span></a><!--완료함--></li>
			<li id="divREJECT" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_REJECT" name="REJECT" class="s1"><span><%= Resources.Approval.lbl_doc_reject2%></span></a><!--반려함--></li>
			<li id="divTEMPSAVE" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_TEMPSAVE" name="TEMPSAVE" class="s1"><span><%= Resources.Approval.lbl_composing%></span></a><!--임시함--></li>			
			<li id="divCCINFO" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_CCINFO" name="CCINFO" class="s1"><span><%= Resources.Approval.lbl_doc_reference2%></span></a><!--참조함--></li>			
			<li id="divTCINFO" style="display:;"><a href="#"  onclick="javascript:changeBox(this);"  id="_TCINFO" name="TCINFO" class="s1"><span><%= Resources.Approval.btn_Circulate%>/<%= Resources.Approval.lbl_circulation_rec%></span></a><!--수신/참조함--></li>						  
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
			<iframe id="iApvLine" name="iApvLine" width='100%' height="130" frameborder="0" src="about:blank" datasrc="../ApvlineMgr/ApvlineViewer.aspx" style='margin:0; padding:0; scroll=auto;'></iframe>
			</span>
			<span id="spanApvGraphic" style="DISPLAY: none" name="spanApvGraphic">
			<iframe id="iApvGraphic" style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; scroll: auto" dataSrc="./ApvMonitor/MonitorGraphic.aspx name=iApvGraphic" src="./ApvMonitor/MonitorGraphic.aspx" frameBorder=0 width="100%" height=130></iframe>
			</span>		
		</div>	 
	</div>
	<!-- list graphic div 끝 -->
	<!-- 검색 영역 div 시작 -->
	<div id="SLayer" style="display:none;">
	<div class="Box06">
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
			  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
				<tr>
				  <td>&nbsp;</td>
				  <td align="right">
					<!-- 검색 시작 -->
					<table border="0" cellspacing="0" cellpadding="0">
					  <tr>
						<td height="25" class="SLPop"><b><%=Resources.Approval.lbl_search %></b></td>
						<td>&nbsp;
							<select id="sel_Search" name="sel_Search" style="width:70">
								<option value="SUBJECT" selected ><asp:Label runat="server" ID="lbl_Title" /></option>
								<option value="PI_INITIATOR_NAME"><asp:Label runat="server" ID="lbl_Intiator" /></option>
							 </select>
							 &nbsp;
						 </td>
						<td><input id="search" name="search" type="text" class="type-text" size="40" style="IME-MODE:active; WIDTH:220px" onKeyPress="if (event.keyCode==13) cmdSearch_onClick();" /><a href="#" onclick="cmdSearch_onClick()"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_search02.gif" align="absmiddle" border="0" /></a></td>
						<td style="padding:0 2px 8px 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_box_x.gif" alt="" onclick="javascript:SLayer.style.display='none'"></td>
					  </tr>
				  </table>
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
	</div>
	<!-- 검색 영역 div 끝 --> 
	  <!--  approval line view  -->
		<div id="PopLayerAPV" style="display:none; position:absolute;width:650px;height:280px;"  onmouseout="this.style.display='none';">
		<iframe id="nPopLayerAPV" name="nPopLayerAPV" src="ListItemsApproveLine.aspx" style="border-color:Black;width:650px;height:280px; border-width:thin; border-style:dotted;" frameborder="0"></iframe>
	</div>	
	  <!--  add user folder  -->
		<div class="write" id="divfoldername"  style="display:none; position:absolute;" onmouseover="this.style.display='';"><%-- onmouseout="this.style.display='none';">--%>
			<div class="AppPop" style="width :380px;height:auto;" >
				<table border="0" cellpadding="0" cellspacing="0" style="width:100%;height:100%;" >
					<tr>
						<td><strong><%=Resources.Approval.lbl_Name %>:</strong>&nbsp;
						<div style="display:none"><CoviWebControls:CoviDropDown runat="server" ID="classify"  /></div>
						<input id="foldername" name="foldername" size="30" maxlength="30" type="text" class="type-text" style=" width: 270px; height:15px;" onKeyPress="if (event.keyCode==13) foldersave();" value="" />&nbsp;
						<a href="#" onclick="javascript:foldersave()" class="Btn02"><span><%=Resources.Approval.btn_save %></span></a></td>
						<td style="padding-bottom:6px;">
							<img src="<%=Session["user_thema"] %>/Covi/Common/btn_type2/btn_x02.gif" alt="" onclick="javascript:document.getElementById('divfoldername').style.display='none';" />
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="write" id="divfoldername_01"  style="display:none; position:absolute;"> <%--onmouseout="this.style.display='none';" onmouseover="this.style.display='';"--%>
			<div class="AppPop" style="width:250px;height:40px;" >
				<table border="0" cellpadding="0" cellspacing="0" style="width:100%;height:100%;" >
					<tr>
						<td><strong><%=Resources.Approval.lbl_Name %>:</strong>&nbsp;<input id="foldername01" name="foldername01" size="30" maxlength="30" type="text" class="type-text" style=" width: 120px; height:15px;" onKeyPress="if (event.keyCode==13) foldersave01();" value="" />&nbsp;<a href="#" onclick="javascript:foldersave01()" class="Btn02"><span><%=Resources.Approval.btn_modify %></span></a></td>
						<td style="padding-bottom:6px;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn_type2/btn_x02.gif" alt="" onclick="javascript:document.getElementById('divfoldername_01').style.display='none';"></td>
					</tr>
				</table>
			</div>
		</div>	
		<input type="hidden" id="hidFolderid" value="" />	  
	<!--footer start-->
	<ucfooter:UxFooter ID="UxFooter1" runat="server" />
	<!--footer end -->
</div>
<!--quick Menu-->
<ucquickmenu:UxQuickMenu ID="UxWF_Footer" runat="server" />
</form>
<!--quick End-->
	<script type="text/javascript">
		//이준희(2010-10-14): Moved thie script block below <body> node properly.
		//debugger;//변수 선언
		var uid="<%=Request.QueryString["uid"]%>";
		if(uid==""){
			uid="<%=Session["user_code"]%>";
		}
		var ownerid="<%=Request.QueryString["ownerid"]%>";
		var barchived = "<%=Request.QueryString["barchived"]%>";
		var admintype = "<%=Request.QueryString["admintype"]%>";
		var foldermode ="<%=Request.QueryString["FOLDERMODE"]%>"; 
		
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
		//var deptId = uid.substring(0,uid.lastIndexOf("_"));
		var bArchived = false ;
		//alert(234);
		try{bArchived = (barchived=="true"?true:false);}catch(e){}
		
		var userid = "<%=Session["user_code"]%>";

		//사용자 강제변경 수정
		if (admintype == ""){
			var strBox = uid.substring(uid.lastIndexOf("_")+1);
			if (selLocation == "DEPART" || selLocation == "JOBFUNCTION" || selLocation == "UFOLDER" ){
			}else{//개인함-본인것만 보도록 uid 강제 변환
				uid = userid;
			}
		}
		var a,ua = navigator.userAgent;
		this.agent= { 
			safari	: ((a=ua.split('AppleWebKit/')[1])?(a.split('(')[0]).split('.')[0]:0)>=412 ,
			konqueror : ((a=ua.split('Konqueror/')[1])?a.split(';')[0]:0)>=3.4 ,
			mozes	 : ((a=ua.split('Gecko/')[1])?a.split(" ")[0]:0) >= 20011128 ,
			opera	 : (!!window.opera) && (document.body.style.opacity=="") ,
			msie	  : (!!window.ActiveXObject)?(!!(new ActiveXObject("Microsoft.XMLHTTP"))):false 
		} //safari, konqueror, opera url 한글 인코딩 처리를 위해추가
		var btoUtf = ((this.agent.safari || this.agent.konqueror || this.agent.opera)?false:true);
		
		window.onload= initOnload;
		function initOnload() {	   
			setPerTab() ;	// Tab에 Label 설정
			
			setWorkList(selLocation, "<%=Resources.Approval.lbl_savedate %>") ;		
			setGroup(selLocation) ;			
			setDelete(selLocation) ; 			
			//setApvLineClear();
			setApprove(selLocation);//일괄결재버튼 활성화 여부2007.11
			setFolderMove(selLocation) ; 			
			
			var cookiedata = document.cookie; 	
			if ( cookiedata.indexOf("chkView=True") > -1 ){ 
				chkView.checked = true;
				disApv(chkView);
			}
			if (bArchived){
				document.getElementById("spanArchived").style.display = "";	
				document.getElementById("spanArchivedPass").style.display = "";
				document.getElementById("PageName2").style.display = "none"; //08.02.01 강성채 추가
				document.getElementById("PageName").style.display = "";
				document.getElementById("bar").style.display = "";				
			}			
		}

		function changeBox(selTab){
			if (selTab.name != selLocation) {
				selLocation = selTab.name;
				strMode = selLocation.substr(selLocation.lastIndexOf("_")+1);
				setWorkList(selTab.name, selTab.getAttribute("colLabel"));
				setGroup(selTab.name);
				setApvLineClear();
				setControl(selTab.name);
				setApprove(strMode);
				setDelete(selLocation);
				setFolderMove(selLocation);				
			}
		}

		function changeApv(selTab, oApvLine, strApvlineDisp, oApvGraphic, strApvGraphicDisp) {
			if (selTab.name != selApv) {
				document.getElementById("div"+selApv.replace("_","")).className = "" ;
				document.getElementById("div"+selTab.id.replace("_","")).className = "current" ;

				selApv = selTab.name ;
				eval(oApvLine).style.display = strApvlineDisp ;
				eval(oApvGraphic).style.display = strApvGraphicDisp;
				//alert(304);
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
			document.getElementById("iworklist").src = "listitems.aspx?uid="+uid+"&location=" + pLocation + "&mode=" + strMode +  "&label=" + ((btoUtf)?escape(pLabel):pLabel) + "&admintype=" + admintype;		  
		}

		function setPerTab() {
			document.getElementById("_PREAPPROVAL").setAttribute("colLabel", "<%= Resources.Approval.lbl_doc_requested %>"); //기안일자
			document.getElementById("_APPROVAL").setAttribute("colLabel", "<%= Resources.Approval.lbl_receivedate  %>"); //받은일자
	//		CONSULT.setAttribute("colLabel", "결재일시") ;
			document.getElementById("_PROCESS").setAttribute("colLabel", "<%= Resources.Approval.lbl_approvdate %>"); //결재일자
			document.getElementById("_COMPLETE").setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>"); //완료일자
			document.getElementById("_REJECT").setAttribute("colLabel", "<%= Resources.Approval.lbl_rejectdate %>"); //반려일자
			document.getElementById("_TEMPSAVE").setAttribute("colLabel", "<%= Resources.Approval.lbl_moddate %>"); //저장일자
			document.getElementById("_CCINFO").setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>"); //완료일자
			document.getElementById("_TCINFO").setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>"); //완료일자
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
		{	//debugger;
			var kind = document.getElementById("kind").value;
			
			var golist;
			
			setApvLineClear();
			document.getElementById("search").value = "";

			if (kind=="total")
			{				
				document.getElementById("iworklist").contentWindow.location = "listitems.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=";
			}
			else if(kind=="WORKDT")
			{				
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=WORKDT" + "&gLabel=" +toUTF8(document.getElementById('iworklist').contentWindow.gLabel);
			}
			else if(kind=="INITIATOR_NAME")
			{
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=INITIATOR_NAME" + "&gLabel=" +toUTF8(document.getElementById('iworklist').contentWindow.gLabel);
			}
			else if(kind=="INITIATOR_UNIT_NAME")
			{			
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=INITIATOR_UNIT_NAME" + "&gLabel=" +toUTF8(document.getElementById('iworklist').contentWindow.gLabel);
			}
//			else if(kind=="PF_SUB_KIND")
//			{			
//				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=PF_SUB_KIND" ;
//				golist="<iframe frameborder=0 id='iworklist' name='iworklist' src='listgroup.aspx?uid="+ uid  + "&location=" + "<%=Request.QueryString["location"]%>" + "&mode=" + "<%=Request.QueryString["mode"]%>" + "&kind=PF_SUB_KIND' style='WIDTH:100%;HEIGHT:80%'></iframe>";						
//			}
			else if(kind=="FORM_NAME")
			{
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=FORM_NAME" + "&gLabel=" +toUTF8(document.getElementById('iworklist').contentWindow.gLabel);
			}	
			else if(kind=="SENDER_NAME")
			{
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=SENDER_NAME" + "&gLabel=" +toUTF8(document.getElementById('iworklist').contentWindow.gLabel);
			}
		}
	
		function toUTF8(szInput){
			var wch,x,uch="",szRet="";
			if(btoUtf){
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
			}else{
			   szRet =  szInput;
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
		}
		function cmdSearch_onClick(){
			if (document.getElementById("kind").value != "total") {alert("<%= Resources.Approval.msg_004 %>...!");return false;} //그룹정렬이 전체일 경우에만 가능합니다
			setApvLineClear();
			document.getElementById("kind").value = "total";
			document.getElementById("iworklist").contentWindow.cmdSearch_onClick(document.getElementById("sel_Search").value, document.getElementsByName("search")[0].value, "", "");			
		}
		function setGroup(strTempSave) {
			var k = 0 ;
			if(strTempSave =="TEMPSAVE") {
				k=3;
			}else if(strTempSave=="TCINFO"){
				k=4;
			}else {
				k=5;
			}
			
			document.getElementById("kind").length = k;
			document.getElementById("kind").options[0].value = "total";
			document.getElementById("kind").options[0].text = "<%= Resources.Approval.lbl_total %>"; //전체
			document.getElementById("kind").options[1].value = "WORKDT";
			document.getElementById("kind").options[1].text = "<%= Resources.Approval.lbl_date_by %>"; //날짜별
			if(strTempSave =="TEMPSAVE") {
				document.getElementById("kind").options[2].value = "FORM_NAME";
				document.getElementById("kind").options[2].text = "<%= Resources.Approval.lbl_form_by %>"; //양식별
			}else if(strTempSave=="TCINFO"){
				document.getElementById("kind").options[2].value = "FORM_NAME";
				document.getElementById("kind").options[2].text = "<%= Resources.Approval.lbl_form_by %>"; //양식별
				document.getElementById("kind").options[3].value = "SENDER_NAME";
				document.getElementById("kind").options[3].text = "<%= Resources.Approval.lbl_SenderName %>"; //양식별
			}else {
				document.getElementById("kind").options[2].value = "INITIATOR_NAME";
				document.getElementById("kind").options[2].text = "<%= Resources.Approval.lbl_initiator_by %>"; //기안자별
				document.getElementById("kind").options[3].value = "INITIATOR_UNIT_NAME";
				document.getElementById("kind").options[3].text = "<%= Resources.Approval.lbl_initiatou_by %>"; //기안부서별
				document.getElementById("kind").options[4].value = "FORM_NAME";
				document.getElementById("kind").options[4].text = "<%= Resources.Approval.lbl_form_by %>"; //양식별
			}
			if(strTempSave == "TCINFO")
			{
				//document.getElementById("kind").style.display = "none";
				document.getElementById("sel_Search").length = 1;
				document.getElementById("sel_Search").options[0].selected = true;
			}
			else
			{
				 document.getElementById("kind").style.display = "";
				 document.getElementById("sel_Search").length = 2;
				 document.getElementById("sel_Search").options[1].value = "INITIATOR_NAME";
				 document.getElementById("sel_Search").options[1].text = "<%= Resources.Approval.lbl_writer %>"; //기안자
				 
			}
		}
		function setSearch(strTempSave){
			var s = 0;
			if(strTempSave!="TEMPSAVE") {s=4;}
			else {s=1;}		
			document.getElementById("sel_Search").length = s;
			document.getElementById("sel_Search").options[0].value = "SUBJECT";
			document.getElementById("sel_Search").options[0].text = "<%= Resources.Approval.lbl_subject %>"; //제목
			if(strTempSave!="TEMPSAVE") {		
				document.getElementById("sel_Search").options[1].value = "INITIATOR_UNIT_NAME";
				document.getElementById("sel_Search").options[1].text = "<%= Resources.Approval.lbl_writedept %>"; //기안부서
				document.getElementById("sel_Search").options[2].value = "INITIATOR_NAME";
				document.getElementById("sel_Search").options[2].text = "<%= Resources.Approval.lbl_writer %>"; //기안자
				//sel_Search.options(3).value = "PI_BUSINESS_DATA2"
				//sel_Search.options(3).text = "<%= Resources.Approval.lbl_approver %>" //결재자
			}

		}
		function setDelete(strLocation) {
			if((strLocation=="COMPLETE") || (strLocation=="REJECT") || (strLocation=="TEMPSAVE")  || (strLocation=="CCINFO") || (strLocation=="UFOLDER")) {  
				document.getElementById("imgDelete").style.display = "";
			}
			else {
				document.getElementById("imgDelete").style.display = "none";
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
			if(oApvCheck.checked) {
				//iworklist.frameElement.height = "220" ;
				divApv.style.display = "" ;
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
				//iworklist.frameElement.height = "380" ;
				document.getElementById("divApv").style.display = "none";
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
			document.cookie = name + "=" + ((btoUtf)?escape( value ):value) + "; path=/; expires=" + todayDate.toGMTString() + ";" + location.host;
		} 
		function setApprove(strLocation){
			if(bArchived){
				document.getElementById('spanApprove').style.display = "none";
			}else{
				if((strLocation=="APPROVAL" && admintype =="")  ) {
					document.getElementById('spanApprove').style.display = "";				
				}
				else {document.getElementById('spanApprove').style.display = "none";}	
			}		
			
		}
		function delete_onClick(){
			var kind = document.getElementById("kind").value;
			if (kind=="total"){
				document.getElementById("iworklist").contentWindow.delete_onClick();
			}else{
				document.getElementById("iworklist").contentWindow.document.getElementById("ifrDL").contentWindow.delete_onClick(); // 그룹 조회시
			}
			setApvLineClear();
		}
		function approve_onClick(){
			var kind = document.getElementById("kind").value;
			if (kind=="total"){
				document.getElementById("iworklist").contentWindow.cmdapprove_OnClick();
			}else{
				document.getElementById("iworklist").contentWindow.document.getElementById("ifrDL").contentWindow.cmdapprove_OnClick();
			}
		}	
		function foldermove_OnClick(){//debugger;
			var kind = document.getElementById("kind").value;
			var gubun = "unit";
			var tmpuid = uid;
			if (ownerid == ""){
				gubun=(uid == userid)?"user":"unit";
			}else{
				gubun=(ownerid == userid)?"user":"unit";
				uid = ownerid;
				if(gubun=="unit"){
					uid = ownerid+"_";
				}
			}
			
			if (kind=="total"){
				tmpuid = document.getElementById("iworklist").contentWindow.uid;
				if(gubun=="unit"){
					document.getElementById("iworklist").contentWindow.uid = ownerid+"_";
				}
				document.getElementById("iworklist").contentWindow.foldermove_OnClick(gubun);
   				document.getElementById("iworklist").contentWindow.uid = tmpuid;
			}else{
				tmpuid = document.getElementById("iworklist").contentWindow.document.getElementById("ifrDL").contentWindow.uid;
				if(gubun=="unit"){
					document.getElementById("iworklist").contentWindow.document.getElementById("ifrDL").contentWindow.uid = ownerid+"_";
				}
	   			document.getElementById("iworklist").contentWindow.document.getElementById("ifrDL").contentWindow.foldermove_OnClick(gubun);
				document.getElementById("iworklist").contentWindow.document.getElementById("ifrDL").contentWindow.uid = tmpuid;
			}
			uid = tmpuid;
		}
		function setFolderMove(strLocation) {
			if(foldermode == 'N'  ) {  
				document.getElementById("btn_userfoldermove_2").style.display=""; //폴더 이동 활성화 2008.01 sunny				
				document.getElementById("btn_restore").style.display="none";
				document.getElementById("btn_search").style.display="";				
			}
			if(foldermode == 'X'){
				document.getElementById("btn_userfoldermove_2").style.display="none"; //폴더 이동 활성화 2008.01 sunny
				document.getElementById("btn_restore").style.display="";				
				document.getElementById("btn_search").style.display="";				
			}
			if(foldermode == 'I'  ) {  
				document.getElementById("btn_userfoldermove_2").style.display="none"; //폴더 이동 활성화 2008.01 sunny				
				document.getElementById("btn_restore").style.display="none";
				document.getElementById("kind").style.display = "none";
				document.getElementById("btn_search").style.display="none";				
				document.getElementById("imgModi").style.display = "";
				//iworklist.divPaging.style.display="none";
			}
		}
		function restore_OnClick(){//휴지통 복구
			var kind = document.getElementById("kind").value;
			if (kind=="total"){
				document.getElementById("iworklist").contentWindow.restore_OnClick();
			}else{
				document.getElementById("iworklist").contentWindow.document.getElementById("ifrDL").contentWindow.restore_OnClick();
			}			
		}	
		//추가 입력란 활성화
		function folderaddclick(f1, e){  
			var x=0;var y=0;
			var sH=0;var sW=0;
			if (document.getElementById) {
				if (isNaN(window.screenX)) {
//					x=window.screenLeft;
//					y=window.screenTop;
					x=AnchorPosition_getPageOffsetLeft(f1)+10;
					y=AnchorPosition_getPageOffsetTop(f1)+10;

				}else {
					x=AnchorPosition_getPageOffsetLeft(f1)+10;
					y=AnchorPosition_getPageOffsetTop(f1)+10;
				}
			}
			else if (document.all) {
				x=event.clientX;
				y=event.clientY;
				sH = parseInt(document.body.scrollTop);
				sW = parseInt(document.body.scrollLeft);
			}
			else if (document.layers) {
				x=loc.pageX;
				y=loc.pageY;
				sH = parseInt(document.body.scrollTop);
				sW = parseInt(document.body.scrollLeft);
			}
			if(document.getElementById("divfoldername") != null){
				document.getElementById("divfoldername").style.left = sW+x-10 +"px";
				document.getElementById("divfoldername").style.top = sH+y+10 +"px";
			}	  
			if(document.getElementById("divfoldername").style.display == "none"){
			  document.getElementById("divfoldername").style.display = "inline";
			  document.getElementById("foldername").focus();
			}else{
			  document.getElementById("divfoldername").style.display = "none";
			}
		}
		//폴더명 수정
		function modify_onClick(){
			var kind = document.getElementById("kind").value;
			var chk_value;
			if(kind == "total"){
				if(document.getElementById("iworklist").contentWindow.chk_check() == false){return false;}
				else{chk_value = document.getElementById("iworklist").contentWindow.chk_check().split("&&");}
			}
			x = (document.layers) ? loc.pageX : event.clientX;
			y = (document.layers) ? loc.pageY : event.clientY;
			sH = parseInt(document.body.scrollTop);
			sW = parseInt(document.body.scrollLeft);
			if(document.getElementById("divfoldername_01") != null){
				document.getElementById("divfoldername_01").style.left = sW+x-10 +"px";
				document.getElementById("divfoldername_01").style.top = sH+y+10 +"px";
			}	  
			if( document.getElementById("divfoldername_01").style.display == "none"){
			  document.getElementById("divfoldername_01").style.display = "inline";
			  document.getElementById("hidFolderid").value = chk_value[0];
			  document.getElementById("foldername01").value = chk_value[1];
			  document.getElementById("foldername01").select();
			}else{
			  document.getElementById("divfoldername_01").style.display = "none";
			}
		}
		function AnchorPosition_getPageOffsetLeft (el) {
			var ol=el.offsetLeft;
			while ((el=el.offsetParent) != null) { ol += el.offsetLeft; }
			return ol;
		}
		function AnchorPosition_getPageOffsetTop (el) {
			var ot=el.offsetTop;
			while((el=el.offsetParent) != null) { ot += el.offsetTop; }
			return ot;
		}	  
		// 공백제거
		function trim(txt){
			return txt.replace(/^\s+/, '').replace(/\s+$/, '');
		}
	  
		//신규 폴더 저장
		var	m_xmlHTTP = CreateXmlHttpRequest();
		var m_folderid = "";
		var m_mode = "";
		//String[] m_parentid = document.getElementById("hidClassify").value.split('|');
		//String[] m_parentid = document.getElementById("hidClassify").value.split('|').toString();
//		var m_parentid = document.getElementById("hidClassify").value;
		
		function foldersave()
		{	   
			if(trim(document.getElementById("foldername").value) =="") {document.getElementById("foldername").value = "";alert("<%= Resources.Approval.msg_275 %>"); return;}
			m_mode = "foldersave";
			var m_parentid = document.getElementById("classify").value;
			//alert(m_parentid);
			var folderownerid = uid;
			if(ownerid != "") folderownerid = ownerid;
			var sXML = "<Items><mode>INSERT</mode><folderid></folderid><foldername><![CDATA[" + document.getElementById("foldername").value + "]]></foldername><foldermode>N</foldermode><uid><![CDATA["+folderownerid+"]]></uid><pid><![CDATA[" + m_parentid + "]]></pid></Items>" ;
			var szURL = "UserFolder.aspx";
			requestHTTP("POST",szURL,true,"text/xml",receiveHTTP, sXML);
		}
		//폴더명 수정 저장
		function foldersave01(){   
			m_folderid = document.getElementById("hidFolderid").value;
			if(trim(document.getElementById("foldername01").value) =="") {document.getElementById("foldername").value = "";alert("<%= Resources.Approval.msg_275 %>"); return;}
			m_mode = "foldersave";
			var m_parentid = document.getElementById("classify").value;
			var folderownerid = uid;
			if(ownerid != "") folderownerid = ownerid;
			var sXML = "<Items><mode>MODIFY</mode><folderid>"+m_folderid+"</folderid><foldername><![CDATA[" + document.getElementById("foldername01").value + "]]></foldername><foldermode>N</foldermode><uid><![CDATA["+folderownerid+"]]></uid><pid><![CDATA[" + m_parentid + "]]></pid></Items>" ;
			var szURL = "UserFolder.aspx";
			requestHTTP("POST",szURL,true,"text/xml",receiveHTTP, sXML);
		}
		function event_noop(){return;}
		
		
		function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
			m_xmlHTTP.open(sMethod,sUrl,bAsync);
			//m_xmlHTTP.setRequestHeader("Accept-Language","ko");
			m_xmlHTTP.setRequestHeader("Content-type", sCType);
			if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
			(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
		}
		function receiveHTTP(){
			if(m_xmlHTTP.readyState==4){
				m_xmlHTTP.onreadystatechange=event_noop;
				var xmlReturn=m_xmlHTTP.responseXML;
				//divprogress.style.display = "none";
				if(xmlReturn.xml==""){
					//alert(m_xmlHTTP.responseText);
				}else{
					var errorNode=xmlReturn.selectSingleNode("response/error");
					if(errorNode!=null){
						alert("Desc: " + errorNode.text);
					}else{
						switch(m_mode){
							case "foldersave":
								alert(xmlReturn.selectSingleNode("response").text);
								document.getElementById("divfoldername").style.display="none";
								parent.leftFrame.location.reload();
								refresh();
								document.getElementById("divfoldername_01").style.display = "none";
								//parent.parent.window.location.href=""; refresh user's left menu frame.
								break;
							case "foldermove":
								alert(xmlReturn.selectSingleNode("response").text);
								if(opener.gLocation != "UFOLDER"){ //다른 폴더로 이동
									opener.delete_onClick(true);
								}else{
									try{opener.parent.refresh();}catch(e){try{opener.parent.parent.refresh();}catch(e){}}
								}
								window.close();
								break;
						}
					}
				}
			}
		}
		function search_OnClick(){//검색 활성화
			document.getElementById("SLayer").style.display = "";
		}
					
	</script>
</body>
</html>
