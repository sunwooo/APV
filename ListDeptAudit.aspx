<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListDeptAudit.aspx.cs" Inherits="COVINet.COVIFlowNet.ListDeptAudit" %>
<%@ Register Src="Portal/UxFooter.ascx" TagName="UxFooter" TagPrefix="ucfooter" %>
<%@ Register Src="Portal/UxQuickMenu.ascx" TagName="UxQuickMenu" TagPrefix="ucquickmenu" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Worklist</title>
	<script type="text/javascript" language="javascript" src="../common/script/CFL.js"></script>
	<script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
    <link type="text/css" rel="stylesheet" href="/coviweb/approval/forms/calendar/datepickercontrol.css" /> 

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
    <li id="btn_option">
        <span><b><%=Resources.Approval.lbl_search %></b>&nbsp;</span>
                <span style="display:none;">&nbsp;
                    <select id="sel_Search" name="sel_Search" style="width:70" onchange="javascript:selChange()">
                       <%-- <option value=""><%=Resources.Approval.lbl_total %></option>--%>
                        <option value="PI_INITIATOR_UNIT_NAME"><%=Resources.Approval.lbl_writedept %></option>
                        <option value="PI_ACCEPTDEPT"><%=Resources.Approval.lbl_Acceptdept %></option>
                        <option value="PI_SUBJECT" selected><%=Resources.Approval.lbl_subject %></option>
                        <option value="PI_INITIATOR_NAME"><%=Resources.Approval.lbl_writer %></option>
                        <option value="WI_PERFORMER_NAME"><%=Resources.Approval.lbl_by%></option>
                     </select>
                     &nbsp;
                 </span>
                 <span>
                    <input name="search" id="txtSerach" type="text" class="type-text" size="40" style="IME-MODE:active; WIDTH:150px;" onKeyPress="if (event.keyCode==13) cmdSearch_onClick();" />
                 </span>
         <span id="td_dept" name="td_dept" style="display:none;" >
                  <a class="btnov" href="#" onclick="javascript:editList();"  >
                <img align="middle" 
                    src="../../GwImages/BLUE/Covi/Common/btn/btn_icon01_register.gif" /><%=Resources.Approval.btn_deptselect %></a>
         
         &nbsp;&nbsp;&nbsp;</span>

         <span><b><%=Resources.Approval.lbl_doc_requested %></b>&nbsp;</span>
         <span>
            <input type="text" id="QSDATE" name="QSDATE" readonly="readonly" style='font-size:9pt; PADDING-LEFT: 3px; width:70px;'  datepicker="true" datepicker_format="YYYY-MM-DD" />
            <b>&nbsp;~&nbsp;</b>
            <input type="text" id="SEARCHDATE" name="SEARCHDATE" readonly="readonly" style='font-size:9pt; PADDING-LEFT: 3px; width:70px;'  datepicker="true" datepicker_format="YYYY-MM-DD" />
         </span>
         <span>
            <select name="sel_Form" id="sel_Form" style="width:70" >
                <option value="" selected><%=Resources.Approval.lbl_total %></option>
            </select>
        </span>
        <span id="btn_search">
			<a class="btnov" href="#" onclick="javascript:cmdSearch_onClick();" style="cursor:default;" class="btnov"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_search.gif" align="middle" />&nbsp;<%=Resources.Approval.btn_search %></span></a>
			<a class="btnov" href="#" onclick="javascript:goExcel();" style="display:none;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_excel.gif" align="middle" /><%=Resources.Approval.lbl_SaveToExcel%></span></a>
		</span>
        
      <!-- 분류 select div 시작 -->
       <span style="display:none;"><input type="checkbox" name="chktab" onclick="distab(this);" ID="chktab" style="CURSOR:hand"/>&nbsp;<asp:Label runat="server" ID="DisplayTab" />&nbsp;&nbsp;<!--탭보기-->
      <input type="checkbox" name="chkView" onclick="disApv(this);" ID="chkView" style="CURSOR:hand">&nbsp;<asp:Label runat="server" ID="ApvLineView" />&nbsp;&nbsp;</span><!--결재선보기-->
      <span style="display:none;"><select name="kind" onchange="group()"></select></span>
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
			<iframe id="iApvLine" name="iApvLine" width='100%' height=130 frameborder=0 src='about:blank'" datasrc="../ApvlineMgr/ApvlineViewer.aspx" style='margin:0; padding:0; scroll=auto;'></iframe>
			</span>
			<span id="spanApvGraphic" style="DISPLAY: none" name="spanApvGraphic">
			<iframe id=iApvGraphic style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; scroll: auto" dataSrc=./ApvMonitor/MonitorGraphic.aspx name=iApvGraphic src="./ApvMonitor/MonitorGraphic.aspx" frameBorder=0 width="100%" height=130></iframe>
			</span>        
        </div>     
    </div>
    <!-- list graphic div 끝 -->
    
	  <!--  approval line view by  2008.04 sunnyhwang -->
		<div id="PopLayerAPV" style="display:none; position:absolute;width:650px;height:280px;"  onmouseout="this.style.display='none';">
        <iframe id="nPopLayerAPV" name="nPopLayerAPV" src="ListItemsApproveLine.aspx" style="border-color:Black;width:650px;height:280px; border-width:thin; border-style:dotted;" frameborder="0"></iframe>
    </div>    
    <input type="hidden" id="hidQSDATE" runat="server" />
    <input type="hidden" id="hidQEDATE" runat="server" />
    <input type="hidden" id="hidSearchValue" runat="server" />
    <!--footer start-->
    <ucfooter:UxFooter ID="UxFooter1" runat="server" />
    <!--footer end -->
</div>
<!--quick Menu-->
<ucquickmenu:UxQuickMenu ID="UxWF_Footer" runat="server" />
<!--quick End-->
	<script type="text/javascript" language="javascript">
	    var gLabel_Months = <%=Resources.Approval.lbl_Months %>;
		var gLabel_Days = <%=Resources.Approval.lbl_Days %>;

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
	    try{bArchived = parent.menu_fr.bArchived;}catch(e){}
		function window.onload() {		
		    
		    document.getElementById("hidSearchValue").value = "";
		    //검색창 활성화 시 기간 검색을 위한 시작날짜/끝날짜 디폴트값 입력(기간 한달)
		    document.all("QSDATE").value = document.getElementById("hidQSDATE").value;
	        document.all("SEARCHDATE").value = document.getElementById("hidQEDATE").value;
	        
			setPerTab() ;	// Tab에 Label 설정

			if(selLocation == ""){selLocation = "COMPLETE";}
			eval("div"+selLocation.replace("_","")).className = "current" ;			
			

			setWorkList(eval(selLocation).name, eval(selLocation).getAttribute("colLabel")) ;			
			setGroup(selLocation) ;			

			var cookiedata = document.cookie; 	
			if ( cookiedata.indexOf("chkView=True") > -1 ){ 
				chkView.checked = true;
				disApv(chkView);
			}
			queryGetData();
		}

		function changeBox(selTab){
			if (selTab.name != selLocation) {
			
				eval("div"+selLocation.replace("_","")).className = "" ;
                eval("div"+selTab.id.replace("_","")).className = "current" ;
				
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
		    iworklist.location = "listitems.aspx?uid="+uid+"&location=" + pLocation + "&mode=" + strMode +  "&label=" + escape(pLabel) + "&admintype=" + admintype;
		}

		function setPerTab() {
			_PREAPPROVAL.setAttribute("colLabel", "<%= Resources.Approval.lbl_doc_requested %>") ; //기안일자
			_APPROVAL.setAttribute("colLabel", "<%= Resources.Approval.lbl_receivedate  %>") ; //받은일자
	//		CONSULT.setAttribute("colLabel", "결재일시") ;
			_PROCESS.setAttribute("colLabel", "<%= Resources.Approval.lbl_doc_requested %>") ; //결재일자
			_COMPLETE.setAttribute("colLabel","<%= Resources.Approval.lbl_doc_requested %>") ; //완료일자
			_REJECT.setAttribute("colLabel", "<%= Resources.Approval.lbl_doc_requested %>") ; //반려일자
			_TEMPSAVE.setAttribute("colLabel", "<%= Resources.Approval.lbl_moddate %>") ; //저장일자
			_CCINFO.setAttribute("colLabel", "<%= Resources.Approval.lbl_donedate %>") ; //완료일자
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
		    var msg_308 = "";//
		    if(iworklist.location.href == "about:blank") return;
		    //if(!CheckDate()) {alert(msg_308); return;}
			setApvLineClear();
			window.kind.value = "total";
			var SearchValue = "";
			SearchValue += document.getElementById("sel_Search").value + ";";
			SearchValue += document.getElementById("txtSerach").value + ";";
			SearchValue += document.all("QSDATE").value.replace(/-/g,"") + ";";
			SearchValue += document.all("SEARCHDATE").value.replace(/-/g,"") + ";";
			SearchValue += document.all("sel_Form").value + ";";
			document.getElementById("hidSearchValue").value = SearchValue;			
			iworklist.cmdSearch_onClick(window.sel_Search.value, window.search.value, document.all("QSDATE").value, document.all("SEARCHDATE").value);
			search.value = "";
		}
		
		
		function CheckDate(){		
	        var dtSDate = new Date(document.getElementById("QSDATE").value.replace(/-/g,"/"));
	        //end 일 3개월 이전 날짜
	        var dt3MonthDate = new Date(DateAdd("MM", -3, document.getElementById("SEARCHDATE").value).replace(/-/g,"/"));
	        
	        if(dtSDate < dt3MonthDate) return false;
	        else return true
        }
        
        
        function DateAdd(strGbn,addNumber, strOrgDate ) 
        {   
            strOrgDate = strOrgDate.replace(/-/gi,"");
            if(strOrgDate.length != 8 )
            {
                return "";
            }    
            
            var yyyy    = strOrgDate.substring(0,4);
            var mm      = strOrgDate.substring(4,6);
            var dd      = strOrgDate.substring(6,8);
            
            if(strGbn.toUpperCase() == "YEAR" || strGbn.toUpperCase() == "YYYY" || strGbn.toUpperCase() == "YY")    
            {
                yyyy = eval(yyyy) + addNumber;        
            }else if(strGbn.toUpperCase() == "MONTH" || strGbn.toUpperCase() == "MM")
            {
                mm = eval(mm) + addNumber;
                
            }else if(strGbn.toUpperCase() == "DAY" || strGbn.toUpperCase() == "DD")
            {
                dd = eval(dd)+ addNumber;        
            }   

            var r_date = new Date();
            r_date.setFullYear(yyyy);
            r_date.setMonth(mm-1)
            r_date.setDate(dd);
            
            yyyy = String(r_date.getFullYear());
            mm   = String(r_date.getMonth() + 1);
            dd   = String(r_date.getDate());
            
            mm = (mm.length == 1 ? +"0" + mm : mm );
            dd = (dd.length == 1 ? +"0" + dd : dd );
            
            
            return yyyy+"-"+mm+"-"+dd;
        }   

        
        function dblDigit(iVal){return (iVal<10?"0"+iVal:iVal);}
        
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
			
		}
		function setSearch(strTempSave){
			var s = 0;
			if(strTempSave!="TEMPSAVE") {s=3;}
			else {s=1;}
			sel_Search.length = s;
			sel_Search.options(0).value = "PI_SUBJECT";
			sel_Search.options(0).text = "<%= Resources.Approval.lbl_subject %>"; //제목
			if(strTempSave!="TEMPSAVE") {
				sel_Search.options(1).value = "PI_INITIATOR_UNIT_NAME"
				sel_Search.options(1).text = "<%= Resources.Approval.lbl_writedept %>" //기안부서
				sel_Search.options(2).value = "PI_INITIATOR_NAME"
				sel_Search.options(2).text = "<%= Resources.Approval.lbl_writer %>" //기안자
				//sel_Search.options(3).value = "PI_BUSINESS_DATA2"
				//sel_Search.options(3).text = "<%= Resources.Approval.lbl_approver %>" //결재자
			}

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
				//iworklist.frameElement.height = "220" ;
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
				//iworklist.frameElement.height = "380" ;
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

		function dblDigit(iVal){return (iVal<10?"0"+iVal:iVal);}
		
		
		
		
		function distab(objchecktabview){
            if(objchecktabview.checked) {
                divtab.style.display = "";
	        }
	        else {
                divtab.style.display = "none";
	        }
        }						
		function editList(){
	        var rgParams=null;
	        rgParams=new Array();
	        rgParams["bMail"]  = false;
	        rgParams["bUser"] = false;
	        rgParams["bGroup"] = false;
	        rgParams["bRef"] = false;
	        rgParams["bIns"] = false; 
	        rgParams["bRecp"] = true; 
	        rgParams["sCatSignType"] = null; 
	        rgParams["sDeptSignType"] = null;
	        rgParams["sDeptSignStatus"] = null; 
	        rgParams["sUserSignType"] = null;
	        rgParams["sUserSignStatus"] = null; 
	        rgParams["objMessage"] = window;

	        var szFont = "FONT-FAMILY: '굴림';font-size:9px;";var nWidth = 640;var nHeight = 610;
                    var sFeature = szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;help:no;";
	                var strNewFearture = ModifyDialogFeature(sFeature);
	                var vRetval = window.showModelessDialog("/COVIWeb/approval/address/address.aspx", rgParams, strNewFearture);
        }
        
        
        function insertToList(oList){
		    search.value = oList.selectSingleNode("item/DN").text.split(";")[0];				
		}
		
		function selChange(){
		    if(sel_Search.value=="PI_INITIATOR_UNIT_NAME" || sel_Search.value=="PI_ACCEPTDEPT"){
		        td_dept.style.display ="";
		    }else{
		        td_dept.style.display ="none";
		    }
		}
		
		function queryGetData(){		
		    var viewall ="T";
		    var user_etid = "<%= Session["user_ent_code"] %>";
            var language = "<%= Session["user_language"] %>";//20161102 다국어처리 - 다국어 가져오는 부분
	        var	connectionname = "FORM_DEF_ConnectionString";
            var pXML = "[dbo].[usp_wfform_formlistquery01]";
            var aXML = "<param><name>ent_code</name><type>varchar</type><length>32</length><value>"+user_etid+"</value></param>";
            aXML += "<param><name>viewall</name><type>varchar</type><length>1</length><value>"+viewall+"</value></param>";
            aXML += "<param><name>language</name><type>nvarchar</type><length>50</length><value>" + language + "</value></param>";
            var sXML = "<Items><connectionname>"+connectionname+"</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
            
            var szURL = "getXMLQuery.aspx";
            requestHTTP("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTP, sXML);
        }

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
		        //prompt ("", xmlReturn.xml);
		        if(xmlReturn.xml==""){
			        alert(m_xmlHTTP.responseText);
		        }else{
			        var errorNode=xmlReturn.selectSingleNode("response/error");
			        if(errorNode!=null){
				        alert("Desc: " + errorNode.text);
			        }
			        else{
				        var oList = xmlReturn.selectNodes("response/NewDataSet/Table1");
                            
				        for(var i=0;i<oList.length;i++){
				            var elmList = oList[i];
                            var oOption = document.createElement("option");
                            sel_Form.options.add(oOption);
                            oOption.text=elmList.selectSingleNode("FORM_NAME").text;
                            oOption.value=elmList.selectSingleNode("FORM_NAME").text;			        
				        }
			        }
		        }
	        }
        }
        
        // 조회조건내의 검색 된 결재확인 목록을 Excel로 Export한다.
        function goExcel()
	    {
		    try
			{			
				if(document.getElementById('iworklist').contentWindow.g_totalcount  == "0")
				{
					alert("<%= Resources.Approval.msg_279 %>");
					return false;
				}
				var sdoclistname= "<%= Resources.Approval.lbl_doc_deptcomplet %>";
				if( document.getElementById('iworklist').contentWindow.bDetail == true)
				{
					document.getElementById('iworklist').contentWindow.SavePC_detail(ListType,escape(sdoclistname) );
				}
				else
				{
					var SearchValue = "";
			        SearchValue += document.getElementById("sel_Search").value + ";";
			        SearchValue += document.getElementById("txtSerach").value + ";";
			        SearchValue += document.all("QSDATE").value.replace(/-/g,"") + ";";
			        SearchValue += document.all("SEARCHDATE").value.replace(/-/g,"") + ";";
			        SearchValue += document.all("sel_Form").value + ";";
			        //document.getElementById("hidSearchValue").value = SearchValue;
			        document.getElementById("hdn_Excel").value = SearchValue;
			        
			        document.getElementById("btn_Excel").click();
		
//					var arrSearchValue = document.getElementById("hidSearchValue").value.split(';');
//					var search_type = arrSearchValue[0];
//					var search_value = arrSearchValue[1];
//					var start_date = arrSearchValue[2];
//					var end_date = arrSearchValue[3];	
//					var selForm = arrSearchValue[4];					
					//var selForm = arrSearchValue[5];
//					
//					var query = "doclistname="+escape(sdoclistname) 
//					            + "&SearchType="+escape(search_type) 
//					            + "&SearchWord="+escape(search_value) 
//					            + "&start_date="+escape(start_date) 
//					            + "&end_date="+escape(end_date)
//					            + "&selForm="+escape(selForm);
//					         
//					var url = "ListDeptAuditExcel.aspx?"+query;
//					
//					document.getElementById('form1').action = url;					
//					document.getElementById('form1').target = "result_fr";					
//					document.getElementById('form1').submit();

				}   
			}
			catch(e){}
	    }	    
	   
    </script>
    <script type="text/javascript" language="javascript" src="/coviweb/approval/forms/calendar/datepickercontrol.js"></script>
   <%-- <form class="form" id="form1" method="post" name="myform" target="result_fr">
        
    </form>
    <iframe src="" name="result_fr" height="100" width="100" style="DISPLAY:none;"></iframe>--%>
   
    <form id="form2" runat="server">  
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
       <input type="hidden" id="hdn_Excel" runat="server" />
        <asp:UpdatePanel ID="up_Excel" runat="server" UpdateMode="Conditional">
            <ContentTemplate>
            </ContentTemplate>
            <Triggers>
               <%-- <asp:AsyncPostBackTrigger ControlID="btn_Excel" EventName="Click" />--%>
               <asp:PostBackTrigger ControlID="btn_Excel" />
            </Triggers>
        </asp:UpdatePanel>
        <asp:Button ID="btn_Excel" runat="server" style="display:none;" OnClick="btn_Excel_Click" />
    </form>
	</body>
</html>
