<%@ Page Language="C#" AutoEventWireup="true" CodeFile="listJD.aspx.cs" Inherits="COVIFlowNet_listJD" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Worklist</title>
    <script type="text/javascript" language="javascript" src="/CoviWeb/common/script/CFL.js"></script>
    
</head>
    <body style="margin-top:0; margin-right:0;">
		<table width="100%" border="0" cellpadding="0" cellspacing="0">
			<tr>
				<td style="background-color:#ffffff; height:3" colspan="2"></td>
			</tr>
		    <tr>
			<td style="width:15; height:238"><img src="../common/images/Covi/spacer.gif" width="15" height="1"alt=""/></td>
			<td style="width:100%;" colspan="3" valign="top">
			    <table width="99%"  border="0" cellspacing="0" cellpadding="0">
				<tr >
				    <td width="57%" height="30" align="left" class="title"><img src="/CoviWeb/common/Images/icon/icon_greensquare.gif" width="19" height="19" align="absMiddle"><asp:Label runat="server" ID="PageName2" Text="담당직무함"/> - <%=Request.QueryString["location_name"]%> </td>
				    <td width="43%" align="right" valign="bottom">HOME > <asp:Label runat="server" ID="PagePath" Text="전자결재" /> > <span class="text-green"><asp:Label runat="server" ID="PageName" Text="담당직무함" /></span></td>
				</tr>
				<tr>
				    <td colspan="2" align="center" valign="middle"><table width="100%" height="3"  border="0" cellpadding="0" cellspacing="0">
					<tr>
						<td width="20%" class="title_greenline"></td>
						<td width="80%" class="title_grayline"></td>
					</tr>
				</table></td>
				</tr>
				<tr>
				    <td height="41" colspan="2">
				        <table width="100%"  border="0" cellspacing="0" cellpadding="0">
					        <tr>
					            <td width="8"><img src="/CoviWeb/common/images/Covi/search_left.gif" width="8" height="37"></td>
					            <td align="left" background="/CoviWeb/common/images/Covi/search_center.gif" class="left10px">
					                <table border="0" cellpadding="0" cellspacing="0">
                                        <tr align="center">
                                            <td>
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                    <tr align="center">                                                
						                                <td align="left"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_left.gif" alt=""/></td>
                                                        <td class="btn_bg" onclick="javascript:refresh();"><asp:Label runat="server" ID="btn_reload" /></td>
                                                        <td align="right"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_right.gif" alt=""/></td>
                                                    </tr>
                                                </table>
						                    </td>                            
                                            <td>
                                                <span id="imgDelete" style="display:none">
                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                        <tr align="center">
                                                            <!--img id="imgDelete" src="../common/images/button/btn_delete.gif" width="52" height="21" align="absMiddle" style="DISPLAY:none;CURSOR:hand" onclick="iworklist.delete_onClick();setApvLineClear();">&nbsp;&nbsp;&nbsp;&nbsp; -->
                                                            <td align="left"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_left.gif" alt=""/></td>
                                                            <td class="btn_bg" onclick="iworklist.delete_onClick();setApvLineClear();"><asp:Label runat="server" ID="btn_delete" /></td>
                                                            <td align="right"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_right.gif" alt=""/></td>                                                    
                                                        </tr>
                                                    </table>
                                                </span>
 						                    </td>                            
                                            <td>&nbsp;
						                        <img src="/CoviWeb/common/images/icon/arrow_green.gif" width="10" height="9">
		                    	                <select name="sel_Search" style="width:70">
	                                                <option value="PI_NAME" selected ><asp:Label runat="server" ID="lbl_Title" /></option>
	                                                <option value="PI_INITIATOR_NAME"><asp:Label runat="server" ID="lbl_Intiator" /></option>
                                                </select>
						                         <img src="/CoviWeb/common/Images/icon/spot_gray.gif" width="1" height="18" align="absMiddle">
						                        <input name="search" type="text" class="input3" size="40" style="IME-MODE:active; WIDTH:120px" onKeyPress="if (event.keyCode==13) cmdSearch_onClick();">&nbsp;
						                    </td>                            
                                            <td>
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                <tr align="center">
                                                <td>
                                                    <!--img src="../common/images/button/btn_search.gif" width="52" height="21" align="absMiddle" style="CURSOR:hand" onclick="cmdSearch_onClick()"> -->
                                                    <td align="left"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_left.gif" alt=""/></td>
                                                    <td class="btn_bg" onclick="cmdSearch_onClick()"><asp:Label runat="server" ID="btn_search" /></td>
                                                    <td align="right"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_right.gif" alt=""/></td>
                                                    <td>&nbsp;&nbsp;&nbsp;</td>   
                                                </td>
                                                </tr>
                                            </table>						                        
						                    </td>                            
                                            <td>
						                        <input type="checkbox" name="chkView" onclick="disApv(this);" ID="chkView" style="CURSOR:hand"> <asp:Label runat="server" ID="ApvLineView" />&nbsp;&nbsp;<!--결재선보기-->
						                    </td>                            
                                            <td>
						                        <select name="kind" onchange="group()" class="input3"></select>
						                    </td>
						                </tr>
						            </table>
					            </td>
					            <td width="10"><img src="/CoviWeb/common/Images/Covi/search_right.gif" width="8" height="37"></td>
					        </tr>
				        </table>
				    </td>
				</tr>
			</table>
			<!-- 리스트 -->
			<table border="0" cellspacing="0" cellpadding="0" style="height:23px;display:none;">
				<tr>
			        <td>
	                    <div style="display:">
		                    <table border="0" cellspacing="0" cellpadding="0" >
			                    <tr>
				                    <td class="tab_off_left" id="_APPROVAL_l" name="_APPROVAL_l"></td>
                    				<td onclick="javascript:changeBox(this);" class = "tab_off_center" id="_APPROVAL" name="_APPROVAL" ><%= Resources.Approval.lbl_doc_approve2%></td><!--미결함-->
	    			                <td class="tab_off_right" id="_APPROVAL_r" name="_APPROVAL_r"></td>
		    	                </tr>
		                    </table>		
	                    </div>
			        </td>
			        <td>
	                    <div style="display:">
		                    <table border="0" cellspacing="0" cellpadding="0" >
			                    <tr>
				                    <td class="tab_off_left" id="_PROCESS_l" name="_PROCESS_l"></td>
				                    <td onclick="javascript:changeBox(this);" class = "tab_off_center" id="_PROCESS" name="_PROCESS"><%= Resources.Approval.lbl_doc_process2%></td><!--진행함-->
	    			                <td class="tab_off_right" id="_PROCESS_r" name="_PROCESS_r"></td>
		    	                </tr>
		                    </table>		
	                    </div>
			        </td>
			        <td>
	                    <div style="display:">
		                    <table border="0" cellspacing="0" cellpadding="0" >
			                    <tr>
				                    <td class="tab_off_left" id="_COMPLETE_l" name="_COMPLETE_l"></td>
				                    <td onclick="javascript:changeBox(this);" class = "tab_off_center" id="_COMPLETE" name="_COMPLETE"><%= Resources.Approval.lbl_doc_complete2%></td><!--완료함-->
	    			                <td class="tab_off_right" id="_COMPLETE_r" name="_COMPLETE_r"></td>
		    	                </tr>
		                    </table>		
	                    </div>
			        </td>
			        <td>
	                    <div style="display:">
		                    <table border="0" cellspacing="0" cellpadding="0" >
			                    <tr>
				                    <td class="tab_off_left" id="_REJECT_l" name="_REJECT_l"></td>
                    				<td onclick="javascript:changeBox(this);" class = "tab_off_center" id="_REJECT" name="_REJECT"><%= Resources.Approval.lbl_doc_reject2%></td><!--반려함-->
	    			                <td class="tab_off_right" id="_REJECT_r" name="_REJECT_r"></td>
		    	                </tr>
		                    </table>		
	                    </div>
			        </td>
				</tr>
			</table>
			<table width="99%"  border="0" cellspacing="0" cellpadding="0">
				<tr>
				<td width="100%" height="3" align="center" valign="middle" class="tab_line"></td>
				</tr>
			</table>
			<table width="99%" border="0" cellspacing="0" cellpadding="0">
			    <tr>
			        <td><iframe id=iworklist width='100%' height=380 frameborder=0 src='' style='PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px; scroll:auto'></iframe></td>
			    </tr>
			</table>
			<table width="99%"  border="0" cellspacing="0" cellpadding="0">
				<tr >
				<td width="100%" height="3" align="center" valign="middle" class="table_topline"></td>
				</tr>
			</table>
			<div id="divApv" style="DISPLAY:none">
			<br>
			<!-- 결재선 -->
			<table border="0" cellspacing="0" cellpadding="0" style="height:23px;">
				<tr>
			        <td>
	                    <div style="display:">
		                    <table border="0" cellspacing="0" cellpadding="0" >
			                    <tr>
				                    <td class="tab_on_left" id="tabApvLine_l" name="tabApvLine_l"></td>
    				                <td onclick="javascript:changeApv(this,'spanApvLine','','spanApvGraphic','none');" class = "tab_on_center" id="tabApvLine" name="tabApvLine" style="cursor:hand"><%= Resources.Approval.lbl_list%></td><!--리스트-->
	    			                <td class="tab_on_right" id="tabApvLine_r" name="tabApvLine_r"></td>
		    	                </tr>
		                    </table>		
	                    </div>
			        </td>
			        <td>
	                    <div style="display:">
		                    <table border="0" cellspacing="0" cellpadding="0" >
			                    <tr>
				                    <td class="tab_off_left" id="tabApvGraphic_l" name="tabApvGraphic_l"></td>
                    				<td onclick="javascript:changeApv(this,'spanApvLine','none','spanApvGraphic','');" class = "tab_off_center" id="tabApvGraphic" name="tabApvGraphic" style="cursor:hand"><%= Resources.Approval.lbl_graphic%></td><!--그래픽-->
	    			                <td class="tab_off_right" id="tabApvGraphic_r" name="tabApvGraphic_r"></td>
		    	                </tr>
		                    </table>		
	                    </div>
			        </td>
				</tr>
			</table>
			<table width="99%"  border="0" cellspacing="0" cellpadding="0">
				<tr >
				<td width="100%" height="3" align="center" valign="middle" class="tab_line"></td>
				</tr>
			</table>
			<table width="99%" border="0" cellspacing="0" cellpadding="0">
				<tr>
				<td>
					<SPAN id="spanApvLine" name="spanApvLine">
					<iframe id="iApvLine" name="iApvLine" width='100%' height=130 frameborder=0 src='about:blank'" datasrc="../ApvlineMgr/ApvlineViewer.aspx" style='margin:0; padding:0; scroll=auto;'></iframe>
					</SPAN>
					<SPAN id=spanApvGraphic style="DISPLAY: none" name="spanApvGraphic"><IFRAME id=iApvGraphic style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; scroll: auto" dataSrc=./ApvMonitor/MonitorGraphic.aspx name=iApvGraphic src="./ApvMonitor/MonitorGraphic.aspx" frameBorder=0 width="100%" height=130></IFRAME>
					</SPAN>
				</td>
				</tr>
			</table>
			<table width="99%" border="0" cellspacing="0" cellpadding="0">
				<tr >
				<td width="100%" height="3" align="center" valign="middle" class="table_topline"></td>
				</tr>
			</table>
			</div>
		    </td>
		</tr>
		</table>
<script type="text/javascript" language="javascript">
		var uid="<%=Request.QueryString["uid"]%>";
		if(uid==""){
			uid="<%=Session["user_code"]%>";
		}

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
		window.open(theURL,winName,features);
		}

		var selLocation = "<%=Request.QueryString["location"]%>" ;
		var selMainTab = uid.substr(uid.lastIndexOf("_")) ;
		var selApv = "tabApvLine" ;
		var strMode = "<%=Request.QueryString["mode"]%>" ;
		var deptId = uid.substring(0,uid.lastIndexOf("_"));

		var bArchived = false ;
	    try{bArchived = parent.menu_fr.bArchived;}catch(e){}
		
		function window.onload() {
			setPerTab() ;	// Tab에 Label 설정

			if(selMainTab == "") {selMainTab = "_APPROVAL";}
			eval(selMainTab).className = "tab_on_center" ;
			eval(selMainTab+"_l").className = "tab_on_left" ;
			eval(selMainTab+"_r").className = "tab_on_right" ;
//			eval(selMainTab).className = "tab_onbg_105" ;

//			iworklist.frameElement.height = "220" ;
//			divApv.style.display = "" ;
			setWorkList(selLocation, eval(selMainTab).getAttribute("colLabel")) ;
			setGroup(selLocation) ;
			setApvLineClear();

			//2006.04.13 by wolf 결재선 보기 쿠키정보 읽어오기
			var cookiedata = document.cookie; 	
			if ( cookiedata.indexOf("chkView=True") > -1 ){ 
				chkView.checked = true;
				disApv(chkView);
			}
		}

		function changeBox(selTab){
			if (selTab.name != selMainTab) {
//				eval(selMainTab).className = "tab_offbg" ;
//				selTab.className = "tab_onbg" ;
				eval(selMainTab).className = "tab_off_center" ;
				eval(selMainTab+"_l").className = "tab_off_left" ;
				eval(selMainTab+"_r").className = "tab_off_right" ;
				selTab.className = "tab_on_center" ;
				eval(selTab.id+"_l").className = "tab_on_left" ;
				eval(selTab.id+"_r").className = "tab_on_right" ;

				selMainTab = selTab.name ;
				strMode = selMainTab.substr(selMainTab.lastIndexOf("_")+1);
				setWorkList(selLocation, selTab.getAttribute("colLabel")) ;
				setGroup(selTab.name) ;
				setApvLineClear();
				setControl(selTab.name) ;
			}
		}

		function changeApv(selTab, oApvLine, strApvlineDisp, oApvGraphic, strApvGraphicDisp) {
			if (selTab.name != selApv) {
//				eval(selApv).className = "tab_offbg" ;
//				selTab.className = "tab_onbg" ;
				eval(selApv).className = "tab_off_center" ;
				eval(selApv+"_l").className = "tab_off_left" ;
				eval(selApv+"_r").className = "tab_off_right" ;
				selTab.className = "tab_on_center" ;
				eval(selTab.id+"_l").className = "tab_on_left" ;
				eval(selTab.id+"_r").className = "tab_on_right" ;

				selApv = selTab.name ;
				eval(oApvLine).style.display = strApvlineDisp ;
				eval(oApvGraphic).style.display = strApvGraphicDisp ;
			}
		}

		function setWorkList(pLocation, pLabel) {
			iworklist.location = "listitems.aspx?uid="+toUTF8(deptId)+selMainTab+"&location=" + pLocation + "&mode=" + strMode +  "&label=" + toUTF8(pLabel) ;
		}

		function setPerTab() {
			_APPROVAL.setAttribute("colLabel", "<%= Resources.Approval.lbl_receivedate %>") ; //받은날자
			_PROCESS.setAttribute("colLabel", "<%= Resources.Approval.lbl_receivedate %>") ; //받은날자
			_REJECT.setAttribute("colLabel", "<%= Resources.Approval.lbl_rejectdate %>") ; //반려일자
			_COMPLETE.setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>") ; //완료일자
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
			
			window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
		}
		function group()
		{	
			var kind = window.kind.value;
			var golist;
			setApvLineClear();
			window.search.value = "";
			selLocation = "JOBDUTY";
			if (kind=="total")
			{				
				iworklist.location = "listitems.aspx?uid="+toUTF8(deptId)+selMainTab+"&location=" + selLocation + "&mode=" + strMode + "&kind=" ;
			}
			else if(kind=="WORKDT")
			{				
				iworklist.location = "listgroup.aspx?uid="+toUTF8(deptId)+"&location=" + selLocation + "&mode=" + strMode + "&kind=WORKDT" ;
			}
			else if(kind=="INITIATOR_NAME")
			{
				iworklist.location = "listgroup.aspx?uid="+toUTF8(deptId)+"&location=" + selLocation + "&mode=" + strMode + "&kind=INITIATOR_NAME" ;
			}
			else if(kind=="INITIATOR_OU_NAME")
			{			
				iworklist.location = "listgroup.aspx?uid="+toUTF8(deptId)+"&location=" + selLocation + "&mode=" + strMode + "&kind=INITIATOR_OU_NAME" ;
			}
//			else if(kind=="PF_SUB_KIND")
//			{			
//				iworklist.location = "listgroup.aspx?uid="+deptId+selMainTab+"&location=" + selLocation + "&mode=" + strMode + "&kind=PF_SUB_KIND" ;
//				golist="<iframe frameborder=0 id='iworklist' name='iworklist' src='listgroup.aspx?uid="+ uid  + "&location=" + "<%=Request.QueryString["location"]%>" + "&mode=" + "<%=Request.QueryString["mode"]%>" + "&kind=PF_SUB_KIND' style='WIDTH:100%;HEIGHT:80%'></iframe>";						
//			}
			else if(kind=="FORM_NAME")
			{
				iworklist.location = "listgroup.aspx?uid="+toUTF8(deptId)+"&location=" + selLocation + "&mode=" + strMode + "&kind=FORM_NAME" ;
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
			//parent.menu_fr.getApprovalCount();
		}
		function cmdSearch_onClick(){
			if (window.kind.value != "total") {alert("<%= Resources.Approval.msg_004 %>...!");return false;} //그룹정렬이 전체일 경우에만 가능합니다
			setApvLineClear();
			window.kind.value = "total";
			iworklist.cmdSearch_onClick(window.sel_Search.value, window.search.value);
		}
		function setGroup(strTempSave) {
			var k = 5 ;
			kind.length = k
			kind.options(0).value = "total"
			kind.options(0).text = "<%= Resources.Approval.lbl_total %>" //전체
			kind.options(1).value = "WORKDT"
			kind.options(1).text = "<%= Resources.Approval.lbl_date_by %>" //날짜별
			kind.options(2).value = "INITIATOR_NAME"
			kind.options(2).text = "<%= Resources.Approval.lbl_initiator_by %>" //기안자별
			kind.options(3).value = "INITIATOR_OU_NAME"
			kind.options(3).text = "<%= Resources.Approval.lbl_initiatou_by %>" //기안부서별
			kind.options(4).value = "FORM_NAME"
			kind.options(4).text = "<%= Resources.Approval.lbl_form_by %>" //양식별
		}
		function setDelete(strLocation) {
			if((strLocation=="COMPLETE") || (strLocation=="REJECT") || (strLocation=="TEMPSAVE")) {
				imgDelete.style.display = "" ;
			}
			else {imgDelete.style.display = "none" ;}	
		}
		function setApvLineClear() {
			iApvLine.location = "about:blank" ;
			iApvGraphic.drawGraphic("");
		}
		function setControl() {
			window.kind.value = "total";
			window.search.value = "" ;
		}
		function disApv(oApvCheck) {
			if(oApvCheck.checked) {
				iworklist.frameElement.height = "220" ;
				divApv.style.display = "" ;
			}
			else {
				iworklist.frameElement.height = "380" ;
				divApv.style.display = "none" ;
			}
		}
		function toUTF8(szInput){
			var wch,x,uch="",szRet="";
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
			return(szRet);
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
		</script>		
	</body>
</html>
