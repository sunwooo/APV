<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Portallist.aspx.cs" Inherits="COVIFlowNet_Portallist" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Worklist</title>

</head>
    <body style="margin-top:0; margin-right:0;" topmargin="0" leftmargin="0">
    <div class="write">
        <!-- 리스트 시작 -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
          <tr style="padding-top:15px;">
            <td width="48%" valign="top"><!-- 그룹명 테이블 시작 -->
		    <div class="sTitle"><asp:Label ID="strSubject" runat="server"></asp:Label></div>
		    <!-- 컬러 라인부분 div 시작 -->
		    <div class="BTable_bg04" style="height: 2px; font-size:1px;"></div>
		    <div class="BTable_bg03" style="height: 1px; font-size:1px;"></div>
		    <div style="height: 1px; background-color:#FFFFFF; font-size:1px;"></div>
		    <div class="BTable_bg01" style="height: 2px; font-size:1px;"></div>
		    <div style="height: 1px; background-color:#FFFFFF; font-size:1px;"></div>
		    <!-- 컬러 라인부분 div 끝 -->
		   </td>
      </tr>
      <tr>
		    <td height="1" class="BTable_bg03"></td>
	  </tr>
      <tr>
            <td><iframe id=iworklist width='100%' frameborder="0" src='' style='PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px; scroll:no'></iframe></td>
      </tr>
    </table>
    <!-- 리스트 끝 -->
	</div>
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
		    var strNewFearture = ModifyWindowFeature(features);
	        window.open(theURL,winName,strNewFearture);
		}

		var selLocation = "<%=Request.QueryString["location"]%>" ;
		var selApv = "tabApvLine" ;
		var strMode = "<%=Request.QueryString["mode"]%>" ;
		var bArchived = false ;
	    try{bArchived = parent.menu_fr.bArchived;}catch(e){}
	    
	    
	    
		function window.onload() {
		    if(location.search == "?location=DEPART"){
		    var deptid="<%= Session["user_dept_code"] %>"; 
		    var parentdeptid="<%= Session["user_parent_dept_code"]%>";
		    if( deptid != parentdeptid) deptid=parentdeptid;   
		        uid = deptid+"_R";
		        setWorkList('DEPART', '받은일자') ;
		    }
		    else{
			    setWorkList('APPROVAL', '받은일자') ;
		    }
		}

		function changeBox(selTab){
		
			if (selTab.name != selLocation) {
				eval(selLocation).className = "tab_off_center" ;
				eval(selLocation+"_l").className = "tab_off_left" ;
				eval(selLocation+"_r").className = "tab_off_right" ;
				selTab.className = "tab_on_center" ;
				eval(selTab.id+"_l").className = "tab_on_left" ;
				eval(selTab.id+"_r").className = "tab_on_right" ;
				
				selLocation = selTab.name ;
				setWorkList(selTab.name, selTab.getAttribute("colLabel")) ;
				setGroup(selTab.name) ;
				setDelete(selLocation) ;
				setApvLineClear();
				setControl() ;
			}
		}

		function changeApv(selTab, oApvLine, strApvlineDisp, oApvGraphic, strApvGraphicDisp) {
			if (selTab.name != selApv) {
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
		    
		    
			iworklist.location = "portallistitems.aspx?uid="+uid+"&location=" + pLocation + "&mode=" + strMode +  "&label=" + escape(pLabel) ;
		}

		function setPerTab() {
			
			APPROVAL.setAttribute("colLabel", "<%= Resources.Approval.lbl_receivedate  %>") ; //받은일자
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
			var kind = window.kind.value;
			
			var golist;
			
			setApvLineClear();
			window.search.value = "" ;

			if (kind=="total")
			{				
				iworklist.location = "listitems.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=" ;
			}
			else if(kind=="WORKDT")
			{				
				iworklist.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=WORKDT" ;
			}
			else if(kind=="PI_INITIATOR_NAME")
			{
				iworklist.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=PI_INITIATOR_NAME" ;
			}
			else if(kind=="PI_INITIATOR_UNIT_NAME")
			{			
				iworklist.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=PI_INITIATOR_UNIT_NAME" ;
			}
			else if(kind=="FORM_NAME")
			{
				iworklist.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=FORM_NAME" ;
			}	
		}
		function showSubGroup(){
			uid = selSubGroup.value;
			group();
			setApvLineClear();
		}
		function refresh() {
			iworklist.document.location.reload();
			setApvLineClear();
			parent.menu_fr.getApprovalCount();
		}
		function cmdSearch_onClick(){
			if (window.kind.value != "total") {alert("<%= Resources.Approval.msg_004 %>...!");return false;} //그룹정렬이 전체일 경우에만 가능합니다
			setApvLineClear();
			window.kind.value = "total";
			iworklist.cmdSearch_onClick(window.sel_Search.value, window.search.value);
		}
		function setGroup(strTempSave) {
			var k = 0 ;
			if(strTempSave!="TEMPSAVE") {k=5;}
			else {k=3;}
			kind.length = k;
			kind.options(0).value = "total";
			kind.options(0).text = "<%= Resources.Approval.lbl_total %>"; //전체
			kind.options(1).value = "WORKDT";
			kind.options(1).text = "<%= Resources.Approval.lbl_date_by %>"; //날짜별
			if(strTempSave!="TEMPSAVE") {
				kind.options(2).value = "PI_INITIATOR_NAME";
				kind.options(2).text = "<%= Resources.Approval.lbl_initiator_by %>"; //기안자별
				kind.options(3).value = "PI_INITIATOR_UNIT_NAME";
				kind.options(3).text = "<%= Resources.Approval.lbl_initiatou_by %>"; //기안부서별
				kind.options(4).value = "FORM_NAME";
				kind.options(4).text = "<%= Resources.Approval.lbl_form_by %>"; //양식별
			}
			else {
				kind.options(2).value = "FORM_NAME";
				kind.options(2).text = "<%= Resources.Approval.lbl_form_by %>"; //양식별
			}
		}
		function setSearch(strTempSave){
			var s = 0;
			if(strTempSave!="TEMPSAVE") {s=4;}
			else {s=1;}
			sel_Search.length = s;
			sel_Search.options(0).value = "PI_SUBJECT";
			sel_Search.options(0).text = "<%= Resources.Approval.lbl_subject %>"; //제목
			if(strTempSave!="TEMPSAVE") {
				sel_Search.options(1).value = "PI_INITIATOR_UNIT_NAME"
				sel_Search.options(1).text = "<%= Resources.Approval.lbl_writedept %>" //기안부서
				sel_Search.options(2).value = "PI_INITIATOR_NAME"
				sel_Search.options(2).text = "<%= Resources.Approval.lbl_writer %>" //기안자
				sel_Search.options(3).value = "PI_BUSINESS_DATA2"
				sel_Search.options(3).text = "<%= Resources.Approval.lbl_approver %>" //결재자
			}

		}
		function setDelete(strLocation) {
			if((strLocation=="COMPLETE") || (strLocation=="REJECT") || (strLocation=="TEMPSAVE") ||(strLocation=="CCINFO")  ) {
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
				//2005.12.20 by wolf 결재선 보기 체크 박스 클릭시 조회
				try{
					iworklist.showDetailCheckBox(); // 일반 리스트
				}catch(e){
					try{
						iworklist.ifrDL.showDetailCheckBox(); // 그룹 조회시
					}catch(e){}
				}
			}
			else {
				iworklist.frameElement.height = "380" ;
				divApv.style.display = "none" ;
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
		function fnGOAPPROVAL()
		{
		    parent.parent.mainFrame.mainimage3.onclick();
		    parent.location="about:blank";
		} 
		
    </script>	
	</body>
</html>
