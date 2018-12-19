<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListMonitor.aspx.cs" Inherits="COVINet.COVIFlowNet.ListMonitor" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Worklist</title>
    <link href="<%=Session["user_thema"] %>/css/app_css_style.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" language="javascript" src="../common/script/CFL.js"></script>
	<script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
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
	        //.open(theURL,winName,features);
		}

		var selLocation = "<%=Request.QueryString["location"]%>" ;
		var selApv = "tabApvLine" ;
		var strMode = "<%=Request.QueryString["mode"]%>" ;
		var bArchived = false ;
	    try{bArchived = parent.menu_fr.bArchived;}catch(e){}
		function window.onload() {		
			setPerTab() ;	// Tab에 Label 설정

			if(selLocation == ""){selLocation = "PREAPPROVAL";}			
			eval(selLocation).className = "tab_on_center" ;
			eval(selLocation+"_l").className = "tab_on_left" ;
			eval(selLocation+"_r").className = "tab_on_right" ;

			//setWorkList(eval(selLocation).name, eval(selLocation).getAttribute("colLabel")) ;			
			setGroup(selLocation) ;			
			setDelete(selLocation) ; 			

			var cookiedata = document.cookie; 	
			if ( cookiedata.indexOf("chkView=True") > -1 ){ 
				chkView.checked = true;
				disApv(chkView);
			}
			//확인대상자 조회하기
			var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[[dbo].[usp_getJFMember4WfApprover]]]></sql><type>sp</type></Items>" ;
            var szURL = "getXMLQuery.aspx";
            requestHTTP("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTP, sXML);
			
		}

		function changeBox(selTab){
			if (selTab.name != selLocation) {
//				eval(selLocation).className = "tab_offbg_105" ;
//				selTab.className = "tab_onbg_105" ;
				eval(selLocation).className = "tab_off_center" ;
				eval(selLocation+"_l").className = "tab_off_left" ;
				eval(selLocation+"_r").className = "tab_off_right" ;
				selTab.className = "tab_on_center" ;
				eval(selTab.id+"_l").className = "tab_on_left" ;
				eval(selTab.id+"_r").className = "tab_on_right" ;
				
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
//				eval(selApv).className = "tab_offbg_105" ;
//				selTab.className = "tab_onbg_105" ;
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
		    //2006.12.13 by wolf 사용자 문서 조회 및 수정
		    //iworklist.location 에 파라미터 추가 
		    //새로작성
		    iworklist.location = "listitems.aspx?uid="+uid+"&location=" + pLocation + "&mode=" + strMode +  "&label=" + escape(pLabel) + "&admintype=" + admintype;
		    //기존 주석
			//iworklist.location = "listitems.aspx?uid="+uid+"&location=" + pLocation + "&mode=" + strMode +  "&label=" + escape(pLabel) ;
			//2006.12.13 by wolf 사용자 문서 조회 및 수정 End
		}

		function setPerTab() {
			PREAPPROVAL.setAttribute("colLabel", "<%= Resources.Approval.lbl_doc_requested %>") ; //기안일자
			APPROVAL.setAttribute("colLabel", "<%= Resources.Approval.lbl_receivedate  %>") ; //받은일자
	//		CONSULT.setAttribute("colLabel", "결재일시") ;
			PROCESS.setAttribute("colLabel", "<%= Resources.Approval.lbl_approvdate %>") ; //결재일자
			COMPLETE.setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>") ; //완료일자
			REJECT.setAttribute("colLabel", "<%= Resources.Approval.lbl_rejectdate %>") ; //반려일자
			TEMPSAVE.setAttribute("colLabel", "<%= Resources.Approval.lbl_moddate %>") ; //저장일자
			CCINFO.setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>") ; //완료일자
			//TCINFO.setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>") ; //완료일자
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
//			else if(kind=="PF_SUB_KIND")
//			{			
//				iworklist.location = "listgroup.aspx?uid="+uid+"&location=" + selLocation + "&mode=" + strMode + "&kind=PF_SUB_KIND" ;
//				golist="<iframe frameborder=0 id='iworklist' name='iworklist' src='listgroup.aspx?uid="+ uid  + "&location=" + "<%=Request.QueryString["location"]%>" + "&mode=" + "<%=Request.QueryString["mode"]%>" + "&kind=PF_SUB_KIND' style='WIDTH:100%;HEIGHT:80%'></iframe>";						
//			}
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
		    if (uid != ""){
			    iworklist.document.location.reload();
			    setApvLineClear();
			}
		}
		function cmdSearch_onClick(){
			if (window.kind.value != "total") {alert("<%= Resources.Approval.msg_004 %>...!");return false;} //그룹정렬이 전체일 경우에만 가능합니다
			setApvLineClear();
			window.kind.value = "total";
			iworklist.cmdSearch_onClick(window.sel_Search.value, window.search.value);
		}
		function cboUser_onchange(){
			uid = self.cboUser.value.split(";")[1];
			//gEntCode = self.cboUser.value.split(";")[0];
			setWorkList(selLocation, eval(selLocation).getAttribute("colLabel"));
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
			if(strTempSave == "TCINFO")
			{
			    kind.style.display = "none";
			    sel_Search.length = 1;
			    sel_Search.options(0).selected = true;
			    			    
			}
			else
			{
			     kind.style.display  = "";
			     sel_Search.length = 2;
			     sel_Search.options(1).value = "PI_INITIATOR_NAME"
				 sel_Search.options(1).text = "<%= Resources.Approval.lbl_writer %>" //기안자
			     
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
			if((strLocation=="REJECT") || (strLocation=="TEMPSAVE")  ) {  //2006.09.19 김현태 완료함 삭제버튼 제거 (strLocation=="COMPLETE") || 
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
        var m_xmlHTTP=new ActiveXObject("MSXML2.XMLHTTP");
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
						    elm = elmlist.nextNode();
						    makeNodeUser(elm.selectSingleNode("PERSON_CODE").text, elm.selectSingleNode("UNIT_NAME").text + ' ' + elm.selectSingleNode("DISPLAY_NAME").text +' ' +elm.selectSingleNode("JOBPOSITION_Z").text.split("&")[0]);
					    }
			        }
		        }
	        }
        }
        function event_noop(){return(false);} 
        
		function cboUser_onchange(){
			uid = self.cboUser.value;
            setWorkList(eval(selLocation).name, eval(selLocation).getAttribute("colLabel")) ;				
			return;
		}
		function makeNodeUser(strcode, strname){
			var oOption = document.createElement("OPTION");
			cboUser.options.add(oOption);
			oOption.text=strname;
			oOption.value=strcode;	
			return;	
		}
		
    </script>
</head>
    <body style="margin-top:0; margin-right:0;">
		<table width="100%" border="0" cellpadding="0" cellspacing="0">
			<tr>
				<td style="background-color:#ffffff; height:3" colspan="2"></td>
			</tr>
		    <tr>
			<td style="width:15; height:238"><img src="../common/images/groupware/spacer.gif" width="15" height="1"alt=""/></td>
			<td style="width:100%;" valign="top">
			<table width="100%"  border="0" cellspacing="0" cellpadding="0">
				<tr><%-- class="titlebg"--%>
				<td width="20%" height="30" align="left" class="title"><img src="../common/images/icon/icon_greensquare.gif" width="19" height="19" align="absMiddle">&nbsp;결재확인함</td><!--개인결재함-->
				<td width="43%" align="right" valign="bottom">Home > <asp:Label runat="server" ID="PagePath" /> > <span class="text-green"><asp:Label runat="server" ID="PageName2" /></span></td>
				</tr>
				<tr>
				<td colspan="2" align="center" valign="middle">
				<table width="100%" height="3"  border="0" cellpadding="0" cellspacing="0">
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
					            <td width="8"><img src="../common/images/groupware/search_left.gif" width="8" height="37"></td>
					            <td align="left" background="../common/images/groupware/search_center.gif" class="left10px">						            
						            <table border="0" cellpadding="0" cellspacing="0">
                                      <tr align="center">
                                        <td>
                                            <table border="0" cellpadding="0" cellspacing="0">
                                                <tr align="center">
                                                    <!--img src="../common/images/button/btn_reflash.gif" width="74" height="21" align="absMiddle" style="CURSOR:hand"  onclick="javascript:refresh();"-->
                                                    <td align="left"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_left.gif" alt=""/></td>
                                                    <td class="btn_bg" onclick="javascript:refresh();"><asp:Label runat="server" ID="btn_reload" /></td>
                                                    <td align="right"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_right.gif" alt=""/></td>
                                                    <%--<td>&nbsp;</td>  --%> 
                                                </tr>
                                            </table>
                                        </td>                            
                                        <td align="left">
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
                                        <td>&nbsp;</td>
                                        <td align="left">
                                            <select id="cboUser" name="cboUser" onchange="return cboUser_onchange();"  style="width:80;font-size:9pt;">
					                            <option>--확인 대상자를 선택하십시요--</option>
					                        </select>&nbsp;
					                    </td>                                      
                                        <td align="left">						                
						                    <img src="../common/images/icon/arrow_green.gif" width="10" height="9">&nbsp;
						                    	<select name="sel_Search" style="width:70;font-size:9pt;">
					                                <option value="PI_NAME" selected ><asp:Label runat="server" ID="lbl_Title" /></option>
					                                <option value="PI_INITIATOR_NAME"><asp:Label runat="server" ID="lbl_Intiator" /></option>
				                                </select>
						                    &nbsp;<img src="../common/images/icon/spot_gray.gif" width="1" height="18" align="absMiddle"><!--제목-->
						                    <input name="search" type="text" class="input3" size="20" style="IME-MODE:active; WIDTH:80px" onKeyPress="if (event.keyCode==13) cmdSearch_onClick();">&nbsp;
						                </td>
						                <td align="left">
						                    <table border="0" cellpadding="0" cellspacing="0">
                                                <tr align="center">
                                                    <!--img src="../common/images/button/btn_search.gif" width="52" height="21" align="absMiddle" style="CURSOR:hand" onclick="cmdSearch_onClick()"> -->
                                                    <td align="left"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_left.gif" alt=""/></td>
                                                    <td class="btn_bg" onclick="cmdSearch_onClick()"><asp:Label runat="server" ID="btn_search" /></td>
                                                    <td align="right"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_right.gif" alt=""/></td>
                                                </tr>
                                            </table>
						                </td>
						                <td>&nbsp;</td>  
						                <td align="left">
						                    <input type="checkbox" name="chkView" onclick="disApv(this);" ID="chkView" style="CURSOR:hand">&nbsp;<asp:Label runat="server" ID="ApvLineView" />&nbsp;<!--결재선보기-->
						                    <select name="kind" onchange="group()" class="input3"></select>
						               </td>  
						            </tr>
                                    </table>
					            </td>
					            <td width="10"><img src="../common/images/groupware/search_right.gif" width="8" height="37"></td>
					        </tr>
				        </table>
				    </td>
				</tr>
			</table>
			<!-- 리스트 -->
			<table border="0" cellpadding="0" cellspacing="0" style="height:23px">
			    <tr>
			        <td>
	                    <div style="display:;">
		                    <table border="0" cellspacing="0" cellpadding="0" >
			                    <tr>
				                    <td class="tab_off_left" id="PREAPPROVAL_l" name="PREAPPROVAL_l"></td>
    				                <td onclick="javascript:changeBox(this);" class = "tab_off_center" id="PREAPPROVAL" name="PREAPPROVAL"><%= Resources.Approval.lbl_doc_pre2%></td><!--예고함-->
	    			                <td class="tab_off_right" id="PREAPPROVAL_r" name="PROCESS_r"></td>
		    	                </tr>
		                    </table>		
	                    </div>
			        </td>
			        <td>
	                    <div style="display:none;">
		                    <table border="0" cellspacing="0" cellpadding="0" >
			                    <tr>
				                    <td class="tab_off_left" id="APPROVAL_l" name="APPROVAL_l"></td>
                    				<td onclick="javascript:changeBox(this);" class = "tab_off_center" id="APPROVAL" name="APPROVAL" ><%= Resources.Approval.lbl_doc_approve2%></td><!--미결함-->
	    			                <td class="tab_off_right" id="APPROVAL_r" name="APPROVAL_r"></td>
		    	                </tr>
		                    </table>		
	                    </div>
			        </td>
			        <td>
	                    <div style="display:">
		                    <table border="0" cellspacing="0" cellpadding="0" >
			                    <tr>
				                    <td class="tab_off_left" id="PROCESS_l" name="PROCESS_l"></td>
				                    <td onclick="javascript:changeBox(this);" class = "tab_off_center" id="PROCESS" name="PROCESS"><%= Resources.Approval.lbl_doc_process2%></td><!--진행함-->
	    			                <td class="tab_off_right" id="PROCESS_r" name="PROCESS_r"></td>
		    	                </tr>
		                    </table>		
	                    </div>
			        </td>
			        <td>
	                    <div style="display:">
		                    <table border="0" cellspacing="0" cellpadding="0" >
			                    <tr>
				                    <td class="tab_off_left" id="COMPLETE_l" name="COMPLETE_l"></td>
				                    <td onclick="javascript:changeBox(this);" class = "tab_off_center" id="COMPLETE" name="COMPLETE"><%= Resources.Approval.lbl_doc_complete2%></td><!--완료함-->
	    			                <td class="tab_off_right" id="COMPLETE_r" name="COMPLETE_r"></td>
		    	                </tr>
		                    </table>		
	                    </div>
			        </td>
			        <td>
	                    <div style="display:">
		                    <table border="0" cellspacing="0" cellpadding="0" >
			                    <tr>
				                    <td class="tab_off_left" id="REJECT_l" name="REJECT_l"></td>
                    				<td onclick="javascript:changeBox(this);" class = "tab_off_center" id="REJECT" name="REJECT"><%= Resources.Approval.lbl_doc_reject2%></td><!--반려함-->
	    			                <td class="tab_off_right" id="REJECT_r" name="REJECT_r"></td>
		    	                </tr>
		                    </table>		
	                    </div>
			        </td>
			        <td>
	                    <div style="display:none;">
		                    <table border="0" cellspacing="0" cellpadding="0" >
			                    <tr>
				                    <td class="tab_off_left" id="TEMPSAVE_l" name="TEMPSAVE_l"></td>
                    				<td onclick="javascript:changeBox(this);" class = "tab_off_center" id="TEMPSAVE" name="TEMPSAVE"><%= Resources.Approval.lbl_composing%></td><!--임시함-->
	    			                <td class="tab_off_right" id="TEMPSAVE_r" name="TEMPSAVE_r"></td>
		    	                </tr>
		                    </table>		
	                    </div>
			        </td>
			        <td>
	                    <div style="display:;">
		                    <table border="0" cellspacing="0" cellpadding="0" >
			                    <tr>
				                    <td class="tab_off_left" id="CCINFO_l" name="CCINFO_l"></td>
                    				<td onclick="javascript:changeBox(this);" class = "tab_off_center" id="CCINFO" name="CCINFO"><%= Resources.Approval.lbl_doc_reference2%></td><!--수신/참조함-->
	    			                <td class="tab_off_right" id="CCINFO_r" name="CCINFO_r"></td>
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
			<table border="0" cellpadding="0" cellspacing="0" style="height:23px">
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
<%--			<table border="0" cellspacing="0" cellpadding="0" style="height:23px;">
				<tr>
				<td style="width:105px;" align="center" onclick="javascript:changeApv(this,'spanApvLine','','spanApvGraphic','none');" class = "tab_onbg_105" id="tabApvLine" name="tabApvLine" style="cursor:hand"><%= Resources.COVIFlowNet.lbl_list%></td><!--리스트-->
				<td style="width:105px;" align="center" onclick="javascript:changeApv(this,'spanApvLine','none','spanApvGraphic','');" class = "tab_offbg_105" id="tabApvGraphic" name="tabApvGraphic" style="cursor:hand"><%= Resources.COVIFlowNet.lbl_graphic %></td><!--그래픽-->
				</tr>
			</table>--%>
			<table width="99%"  border="0" cellspacing="0" cellpadding="0">
				<tr >
				<td width="100%" height="3" align="center" valign="middle" class="tab_line"></td>
				</tr>
			</table>
			<table width="99%" border="0" cellspacing="0" cellpadding="0">
				<tr>
				<td>
					<SPAN id="spanApvLine" name="spanApvLine">
					<iframe id="iApvLine" name="iApvLine" width='100%' height=130 frameborder=0 src='about:blank' datasrc="../ApvlineMgr/ApvlineViewer.aspx" style='margin:0; padding:0; scroll=auto;'></iframe>
					</SPAN>
					<SPAN id=spanApvGraphic style="DISPLAY: none" name="spanApvGraphic"><IFRAME id=iApvGraphic style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; scroll: auto" dataSrc=./ApvMonitor/MonitorGraphic.aspx name=iApvGraphic src="./ApvMonitor/MonitorGraphic.aspx" frameBorder=0 width="100%" height=130></IFRAME>
					</SPAN>
				</td>
				</tr>
			</table>
			<table width="99%" border="0"   cellspacing="0" cellpadding="0">
				<tr >
				<td width="100%" height="3" align="center" valign="middle" class="table_topline"></td>
				</tr>
			</table>
			</div>
		    </td>
		</tr>
		</table>
	</body>
</html>
