<%@ Page Language="C#" AutoEventWireup="true" CodeFile="listJF.aspx.cs" Inherits="COVIFlowNet_listJF" %>
<%@ Register Src="Portal/UxFooter.ascx" TagName="UxFooter" TagPrefix="ucfooter" %>
<%@ Register Src="Portal/UxQuickMenu.ascx" TagName="UxQuickMenu" TagPrefix="ucquickmenu" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Worklist</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="alternate" type="application/rss+xml" title="결재함" href="/CoviWeb/Approval/Portal/GetRssData.aspx?location=APPROVAL"/>
		<style type="text/css">
			<!--
			#SLayer {
				position:absolute;
				left:150px;
				top:55px;
				width:400px;
				z-index:1;
			}
			-->
		</style>      
     <script type="text/javascript" language="javascript" src="../common/script/CFL.js"></script>
</head>
<body>
        <div id="SubWidth">
          <!-- 타이틀 영역 div 시작 -->
          <div class="Title">
            <h1><!--<asp:Label runat="server" ID="PageName2" />&nbsp; -->
            <span id="spanArchived" style="display:none;">&nbsp;<%=Resources.Approval.lbl_old_doc %> - </span><%=Request.QueryString["location_name"]%> - <span id="foldername"></span>
            </h1>
            <!-- 네비게이션 영역 시작 -->
            <ul class="small" style="display:none">
              <li>Home&gt;</li>
              <li><asp:Label runat="server" ID="PagePath" />&gt;</li>
              <li><b><asp:Label runat="server" ID="PageName" /></b></li>
            </ul>
            <!-- 네비게이션 영역 끝 -->
          </div>
          <!-- 타이틀 영역 div 끝 -->
          <!-- 버튼 영역 div 시작 -->
          <div class="n_btntb">
            <ul>
            <li>
                 <a class="btnov" href="#" onclick="javascript:refresh();" ><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_refresh.gif" align="middle" /><%=Resources.Approval.btn_refresh %></span></a> 
                <span id="imgDelete" style="display:none;" >
	                <a class="btnov" href="#" onclick="javascript:delete_onClick();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_delete.gif" align="middle" /><%=Resources.Approval.btn_delete %></span></a>
                </span>
                <span id="spanApprove" style="display:none;" >
	                <a class="btnov" href="#" onclick="javascript:approve_onClick();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_decide.gif" align="middle" /><%=Resources.Approval.btn_approve %></span></a>
                </span>
                <span id="divbtnRSS" style="display:none;">
                    <a class="btnov" href="#" onclick="javascript:copyRSSUrl();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_rss.gif" align="middle" /><%=Resources.Approval.btn_RSS %></span></a>
                </span>
                <span id="btn_search" style="display:;">
	                <a class="btnov" href="#" onclick="javascript:search_OnClick();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_search.gif" align="middle" /><%=Resources.Approval.btn_search %></span></a>
                </span>
            </li>
            <!-- 분류 select div 시작 -->
            <li>
              <!--<input type="checkbox" name="chktab" onclick="distab(this);" ID="chktab" style="CURSOR:hand">&nbsp;<asp:Label runat="server" ID="DisplayTab" />&nbsp;&nbsp;--> <!--탭보기-->
              <span style="display:none;"><input type="checkbox" name="chkView" onclick="disApv(this);" id="chkView" style="CURSOR:hand"/> <asp:Label runat="server" ID="ApvLineView" />&nbsp;&nbsp;</span><!--결재선보기-->
              <select id="kind" name="kind" onchange="group()"></select>
            </li>
            <!-- 분류 select div 끝 -->
          </ul>
        </div>
        <!--탭 div 시작-->
            <!-- 탭 div 시작 -->
            <div class="tab01 small"  id="divtab" ><!--style="display:none;">-->
              <ul>
                <li id="divAPPROVAL" style="display:;"><a href="#" onclick="javascript:changeBox(this);" id="_APPROVAL" name="_APPROVAL" class="s1"><span><%= Resources.Approval.lbl_doc_approve2%></span></a></li>
                <li id="divPROCESS" style="display:;"><a href="#" onclick="javascript:changeBox(this);" id="_PROCESS" name="_PROCESS" class="s1"><span><%= Resources.Approval.lbl_doc_process2%></span></a></li>
                <li id="divCOMPLETE"  style="display:;"><a href="#" onclick="javascript:changeBox(this);" id="_COMPLETE" name="_COMPLETE" class="s1"><span><%= Resources.Approval.lbl_doc_complete2%></span></a></li>
                <li id="divREJECT" style="display:;"><a href="#" onclick="javascript:changeBox(this);" id="_REJECT" name="_REJECT" class="s1"><span><%= Resources.Approval.lbl_doc_reject2%></span></a></li>
              </ul>
            </div>
            <!-- 탭 div 끝 -->   
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
			        <iframe id="iApvLine" name="iApvLine" width="100%" height="130px" frameborder=0 src='about:blank'" datasrc="../ApvlineMgr/ApvlineViewer.aspx" style='margin:0; padding:0; scroll:auto;'></iframe>
			        </span>
			        <span id="spanApvGraphic" style="DISPLAY: none" name="spanApvGraphic">
			        <iframe id="iApvGraphic" style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; scroll: auto" dataSrc="./ApvMonitor/MonitorGraphic.aspx" name="iApvGraphic" src="./ApvMonitor/MonitorGraphic.aspx" frameBorder="0" width="100%" height="130px"></iframe>
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
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td>&nbsp;</td>
                              <td  align="right">
                                <!-- 검색 시작 -->
                                <table border="0" cellspacing="0" cellpadding="0">
                                  <tr>
                                    <td height="25" class="SLPop" ><b><%=Resources.Approval.lbl_search %></b></td>
                                    <td>&nbsp;
                                        <select name="sel_Search" id="sel_Search" style="width:70">
                                            <option value="PI_SUBJECT" selected ><asp:Label runat="server" ID="lbl_Title" /></option>
                                            <option value="PI_INITIATOR_NAME"><asp:Label runat="server" ID="lbl_Intiator" /></option>
                                         </select>
                                         &nbsp;
                                     </td>
                                    <td><input name="search" id="search" type="text" class="type-text" size="40" style="IME-MODE:active; WIDTH:220px" onKeyPress="if (event.keyCode==13) cmdSearch_onClick();" /><a href="#" onclick="cmdSearch_onClick()"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_search02.gif" align="absmiddle" border="0" /></a></td>
						            <td style="padding:0 2px 8px 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_box_x.gif" alt="" onclick="javascript:document.getElementById('SLayer').style.display='none'"></td>
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
	      <!--  approval line view by  2008.04 sunnyhwang -->
		    <div id="PopLayerAPV" style="display:none; position:absolute;width:650px;height:280px;"  onmouseout="this.style.display='none';">
            <iframe id="nPopLayerAPV" name="nPopLayerAPV" src="ListItemsApproveLine.aspx" style=" background-color:White; border-color:Black;width:660px;height:280px; border-width:thin; border-style:dotted;" frameborder="0"></iframe>
            </div>    
              
            <!-- 첨부 레이어 2008.04 강성채-->
            <div id="PopLayer" style="display:none; position:absolute;width:650px;height:280px;" onmouseout="this.style.display='none';" >
                <iframe id="nPopLayer" name="nPopLayer" src="./ApvInfoList/AttachFileList.aspx" style="border-color:Black;width:660px;height:280px; border-width:thin;" frameborder="1"></iframe>
            </div>             
				<!--footer start-->
				<ucfooter:UxFooter ID="UxFooter1" runat="server" />
				<!--footer end -->
			</div>
			<!--quick Menu-->
			<ucquickmenu:UxQuickMenu ID="UxWF_Footer" runat="server" />
			<!--quick End-->
 <script type="text/javascript" language="javascript">
		var uid="<%=Request.QueryString["uid"]%>";
		if(uid==""){
			uid="<%=Session["user_code"]%>";
		}
	    //hichang 2010-02-08 bstroed start
        var bstored = "<%=Request.QueryString["bstored"] %>";
        if(bstored == "true" && uid.indexOf("_APPROVAL") > -1 ){ uid = uid.replace("_APPROVAL","_COMPLETE");}
        //hichang 2010-02-08 bstroed end

        var selLocation = "<%=Request.QueryString["location"]%>" ;
        var selMainTab = uid.substr(uid.lastIndexOf("_")) ;
        var selApv = "tabApvLine" ;
        var strMode = "<%=Request.QueryString["mode"]%>" ;
        var deptId = uid.substring(0,uid.lastIndexOf("_"));
        
        var userid = "<%=Session["user_code"]%>";//201107 공문게시

		var bArchived = false ;
	    //try{bArchived = (parent.frames[0].chkjfarchive.checked?true:false);}catch(e){}
		var usit = "<%=usit %>";
		//사용자 N+2 결재관련 수정 by sunny 2008.03 for loreal
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
			if(selMainTab == "") {selMainTab = "_APPROVAL";}
            document.getElementById("div"+selMainTab.replace("_","")).className = "current" ;
			setWorkList(selLocation, document.getElementById(selMainTab).getAttribute("colLabel"));
			setGroup(selLocation) ;
			setApvLineClear();
			setRSS(selLocation) ;
			setApprove(selMainTab);//일괄결재버튼 활성화 여부2007.11--201107수정
			//hichang 2011-02-08 start
		    if(bstored == "true"){
                document.getElementById("divAPPROVAL").style.display = "none";        
                document.getElementById("divPROCESS").style.display = "none";
                document.getElementById('spanArchived').style.display="";        
            }
			//hichang 2011-02-08 end
			//201107 공문게시
            if(uid == "APVBOARD_COMPLETE"){
                document.getElementById("divtab").style.display="none";
                document.getElementById("kind").style.display="none";
                document.getElementById("foldername").style.display="none";
                bArchived = true;
            }
			//2006.04.13 by wolf 결재선 보기 쿠키정보 읽어오기
			var cookiedata = document.cookie; 	
			if ( cookiedata.indexOf("chkView=True") > -1 ){ 
				chkView.checked = true;
				disApv(chkView);
			}
			document.getElementById('foldername').innerHTML = document.getElementById(selMainTab).innerHTML.replace("<span>","").replace("</span>","");
		}


		function changeBox(selTab){
			if (selTab.name != selMainTab) {
                document.getElementById("div"+selMainTab.replace("_","")).className = "" ;
                document.getElementById("div"+selTab.id.replace("_","")).className = "current" ;
                selMainTab = selTab.name ;
				strMode = selMainTab.substr(selMainTab.lastIndexOf("_")+1);
				
				if(strMode == "COMPLETE" || strMode == "REJECT"){
				    bArchived = true;
				}else{
				    bArchived = false;
				}
				setWorkList(selLocation, selTab.getAttribute("colLabel")) ;
				setGroup(selTab.name) ;
				setApvLineClear();
				setControl(selTab.name) ;
				setApprove(strMode);
                document.getElementById('foldername').innerHTML = document.getElementById(selMainTab).innerHTML.replace("<span>","").replace("</span>","");
				setRSS(selMainTab) ;
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
            document.getElementById("iworklist").contentWindow.location = "listitems.aspx?uid="+toUTF8(deptId)+selMainTab+"&location=" + pLocation + "&mode=" + strMode +  "&label=" + toUTF8(pLabel) ;
		}

		function setPerTab() {
			document.getElementById('_APPROVAL').setAttribute("colLabel", "<%= Resources.Approval.lbl_receivedate %>") ; //받은날자
			document.getElementById('_PROCESS').setAttribute("colLabel", "<%= Resources.Approval.lbl_receivedate %>") ; //받은날자
			document.getElementById('_REJECT').setAttribute("colLabel", "<%= Resources.Approval.lbl_rejectdate %>") ; //반려일자
			document.getElementById('_COMPLETE').setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>") ; //완료일자
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
			var kind = document.getElementById('kind').value;
			var golist;
			
			setApvLineClear();			
			selLocation = "JOBFUNCTION";
			if (kind=="total")
			{				
				document.getElementById("iworklist").contentWindow.location = "listitems.aspx?uid="+toUTF8(deptId)+selMainTab+"&location=" + selLocation + "&mode=" + strMode + "&kind=" ;
			}
			else if(kind=="WORKDT")
			{				
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+toUTF8(deptId)+selMainTab+"&location=" + selLocation + "&mode=" + strMode + "&kind=WORKDT" ;
			}
			else if(kind=="PI_INITIATOR_NAME")
			{
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+toUTF8(deptId)+selMainTab+"&location=" + selLocation + "&mode=" + strMode + "&kind=PI_INITIATOR_NAME" ;
			}
			else if(kind=="PI_INITIATOR_UNIT_NAME")
			{			
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+toUTF8(deptId)+selMainTab+"&location=" + selLocation + "&mode=" + strMode + "&kind=PI_INITIATOR_UNIT_NAME" ;
			}
//			else if(kind=="PF_SUB_KIND")
//			{			
//				iworklist.location = "listgroup.aspx?uid="+deptId+selMainTab+"&location=" + selLocation + "&mode=" + strMode + "&kind=PF_SUB_KIND" ;
//				golist="<iframe frameborder=0 id='iworklist' name='iworklist' src='listgroup.aspx?uid="+ uid  + "&location=" + "<%=Request.QueryString["location"]%>" + "&mode=" + "<%=Request.QueryString["mode"]%>" + "&kind=PF_SUB_KIND' style='WIDTH:100%;HEIGHT:80%'></iframe>";						
//			}
			else if(kind=="FORM_NAME")
			{
				document.getElementById("iworklist").contentWindow.location = "listgroup.aspx?uid="+toUTF8(deptId)+selMainTab+"&location=" + selLocation + "&mode=" + strMode + "&kind=FORM_NAME" ;
			}	
			setApvLineClear();
		}
		function showSubGroup(){
		    uid = selSubGroup.value;
			group();
			setApvLineClear();
		}
		function refresh() {
		    
			document.getElementById('iworklist').contentWindow.location.reload();
			setApvLineClear();
			//parent.menu_fr.getApprovalCount();
		}
		function cmdSearch_onClick(){
		    var kind = document.getElementById('kind');
		    
			if (kind.value != "total") 
			{
			    alert("<%= Resources.Approval.msg_004 %>...!");
			    return false;
			} //그룹정렬이 전체일 경우에만 가능합니다
			
			setApvLineClear();
			document.getElementById('kind').value = "total";
			document.getElementById('iworklist').contentWindow.cmdSearch_onClick(document.getElementById('sel_Search').value, document.getElementById('search').value);
		}
		
		function setGroup(strTempSave) {
			var k = 5;
			document.getElementById('kind').length = k;
			document.getElementById('kind').options[0].value = "total";
			document.getElementById('kind').options[0].text = "<%= Resources.Approval.lbl_total %>"; //전체
			document.getElementById('kind').options[1].value = "WORKDT";
			document.getElementById('kind').options[1].text = "<%= Resources.Approval.lbl_date_by %>"; //날짜별
			document.getElementById('kind').options[2].value = "PI_INITIATOR_NAME";
			document.getElementById('kind').options[2].text = "<%= Resources.Approval.lbl_initiator_by %>"; //기안자별
			document.getElementById('kind').options[3].value = "PI_INITIATOR_UNIT_NAME";
			document.getElementById('kind').options[3].text = "<%= Resources.Approval.lbl_initiatou_by %>"; //기안부서별
			document.getElementById('kind').options[4].value = "FORM_NAME";
			document.getElementById('kind').options[4].text = "<%= Resources.Approval.lbl_form_by %>"; //양식별
		}
		
		function setDelete(strLocation) {
			if((strLocation=="COMPLETE") || (strLocation=="REJECT") || (strLocation=="TEMPSAVE")) {
				document.getElementById('imgDelete').style.display = "" ;
			}
			else {document.getElementById('imgDelete').style.display = "none" ;}	
		}
		
		function setApvLineClear() {
			iApvLine.location = "about:blank" ;
			iApvGraphic.drawGraphic("");
		}
		
		function setControl() {
            document.getElementById('kind').value = "total";
            document.getElementById('search').value = ""
		}
		
		function disApv(oApvCheck) {
			if(oApvCheck.checked) {
				document.getElementById('divApv').style.display = "" ;
			}
			else {
				document.getElementById('divApv').style.display = "none" ;
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
		
		function setApprove(strLocation){
		    if(bArchived){
		        document.getElementById('spanApprove').style.display = "none" ;
		    }else{
			    if((strLocation=="APPROVAL")  ) {
				    document.getElementById('spanApprove').style.display = "" ;				
			    }
			    else {document.getElementById('spanApprove').style.display = "none" ;}	
			}		
		    
		}
		
		function delete_onClick(){
			var kind = document.getElementById('kind').value;
			if (kind=="total"){
    		    document.getElementById('iworklist').contentWindow.delete_onClick();
		    }else{
		        document.getElementById('iworklist').contentWindow.document.getElementById('ifrDL').contentWindow.delete_onClick(); // 그룹 조회시
		    }
		    setApvLineClear();
		}
		
		function approve_onClick(){			
			var kind = document.getElementById('kind').value;
			if (kind=="total"){
    		    document.getElementById('iworklist').contentWindow.cmdapprove_OnClick();
		    }else{
    		    document.getElementById('iworklist').contentWindow.document.getElementById('ifrDL').contentWindow.cmdapprove_OnClick();
		    }
		}		
		
		//탭 활성화 2008.02 sunny	
        function distab(objchecktabview){
            if(objchecktabview.checked) {
                document.getElementById('divtab').style.display = "";
	        }
	        else {
                document.getElementById('divtab').style.display = "none";
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
            if (window.ActiveXObject) {
                if (bstored != "true"){
                    if(strLocation=="_COMPLETE" || strLocation=="_REJECT" ) {  
                        document.getElementById('divbtnRSS').style.display ="none";
                    }else{
                        //전자결재 RSS버튼 활성화여부 미결함/진행함/진행(통합)/수신함/담당업무미결/담당업무진행
                        document.getElementById('divbtnRSS').style.display ="none";
                        var aButton = strRSSButtonValue.split(":");
                        switch(strLocation){
                            case "_APPROVAL": document.getElementById('divbtnRSS').style.display = (aButton[4] == "1"?"":"none");break;
                            case "_PROCESS": document.getElementById('divbtnRSS').style.display = (aButton[5] == "1"?"":"none");break;
                        }
                    }
                }else{ document.getElementById('divbtnRSS').style.display ="none";}
            }
            else
            {
                document.getElementById('divbtnRSS').style.display ="none";
            }
        }		
        /*=======================================================================
        내      용  : 검색 활성화
        작  성  자  : 황선희
        ========================================================================*/   
        function search_OnClick(){
            document.getElementById('SLayer').style.display = "";        
        }
    </script>
	</body>
</html>
