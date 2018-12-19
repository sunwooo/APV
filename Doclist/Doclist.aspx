<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Doclist.aspx.cs" Inherits="COVIFlowNet_Doclist_Doclist" %>
<%@ Register Src="../Portal/UxFooter.ascx" TagName="UxFooter" TagPrefix="ucfooter" %>
<%@ Register Src="../Portal/UxQuickMenu.ascx" TagName="UxQuickMenu" TagPrefix="ucquickmenu" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
	<head id="Head1" runat="server">
		<title>Untitled Page</title>
		<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
		<script type="text/javascript" language="javascript" src="../../common/script/CFL.js"></script>
		<script type="text/javascript" language="javascript" src="../Formlist/FormList.js"></script>	
	</head>
	<body>
		<div id="SubWidth">
		  <!-- 타이틀 영역 div 시작 -->
		  <div class="Title">
			<h1><!--<asp:Label runat="server" ID="DoclistPageName" /> ---> <span id="foldername"></span></h1> 
			<!-- 네비게이션 영역 시작 -->
			<ul class="small" style="display:none;">
			  <li>Home&gt;</li>
			  <li><asp:Label runat="server" ID="PagePath" />&gt;</li>
			  <li><b><asp:Label runat="server" ID="DoclistPageName2" /></b></li>
			</ul>
			<!-- 네비게이션 영역 끝 -->	 																							
		  </div>
		  <!-- 타이틀 영역 div 끝 -->		
      	    
		  <!-- 버튼 영역 div 시작 -->
		  <div class="n_btntb">
			  <ul style="padding-top:0px;">
				<li>
					<span id="span_note" style="display:none;">
					<a id="approve_bt_write" class="btnov" href="#" onclick="javascript:WriteDocList();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_register.gif" align="middle" /><%=Resources.Approval.btn_DirectWrite%></span></a>
					</span>
					<a id="approve_bt_reload" class="btnov" href="#" onclick="javascript:viewDocListType();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_refresh.gif" align="middle" /><%=Resources.Approval.btn_refresh %></span></a>
					<a id="approve_bt_excel" class="btnov" href="#" onclick="javascript:SavePC();"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_save.gif" align="middle" /><%= Resources.Approval.lbl_SaveToExcel %></span></a>
				</li>
				<li>
				  <input type="checkbox" name="chktab" onclick="distab(this);" id="chktab" style="CURSOR:hand" />&nbsp;<asp:Label runat="server" ID="DisplayTab" />&nbsp;&nbsp;<!--탭보기-->
					<span><%= Resources.Approval.lbl_year %>:&nbsp;
					<select id="cboDate" name="cboDate" onchange="return cboDate_onchange1()" class="input"></select>&nbsp;&nbsp;&nbsp;<%= Resources.Approval.lbl_month %>:&nbsp;
					<select id="cboDate1" name="cboDate1" onchange="return cboDate_onchange()" class="input"><option value="total" selected><%= str_approve_sel_all%></option></select>
					</span>
				</li>
			  </ul>
			</div>
			<!-- 탭 div 시작 -->
			<div class="tab01 small"  id="divtab" style="display:none;">
			  <ul>
				<li id="divtab1" style="display:none;"><a href="#" onclick="javascript:changeBox(this);" id="tab1" name="tab1"><span><%= Resources.Approval.lbl_doc_reglist%><!--등록대장--></span></a></li>
				<li id="divtab2" style="display:none;"><a href="#" onclick="javascript:changeBox(this);" id="tab2" name="tab2"><span><%= Resources.Approval.lbl_doc_recvlist%><!--발신대장--></span></a></li>
				<li id="divtab3" style="display:none;"><a href="#" onclick="javascript:changeBox(this);" id="tab3" name="tab3"><span><%= Resources.Approval.lbl_doc_sendlist%><!--접수대장--></span></a></li>
				<li id="divtab4" style="display:none;"><a href="#" onclick="javascript:changeBox(this);" id="tab4" name="tab4"><span><%= Resources.Approval.lbl_doc_reglist%><!--등록대장--></span></a></li>
				<li id="divtab5" style="display:none;"><a href="#" onclick="javascript:changeBox(this);" id="tab5" name="tab5"><span><%= Resources.Approval.lbl_doc_sendlist%><!--발신대장--></span></a></li>
				<li id="divtab6" style="display:none;"><a href="#" onclick="javascript:changeBox(this);" id="tab6" name="tab6"><span><%= Resources.Approval.lbl_ApplicationRecvList%><!--접수대장--></span></a></li>
				<li id="divtab7" style="display:none;"><a href="#" onclick="javascript:changeBox(this);" id="tab7" name="tab7"><span><%= Resources.Approval.lbl_doc_sendlist%><!--발신대장--></span></a></li>
				<li id="divtab8" style="display:none;"><a href="#" onclick="javascript:changeBox(this);" id="tab8" name="tab8"><span><%= Resources.Approval.lbl_doc_notelist%><!--수기대장--></span></a></li>
				<li id="divtab9" style="display:none;"><a href="#" onclick="javascript:changeBox(this);" id="tab9" name="tab9"><span><%= Resources.Approval.lbl_doc_seallist%><!--직인날인대장--></span></a></li>
				<li id="divtab10" style="display:none;"><a href="#" onclick="javascript:changeBox(this);" id="tab10" name="tab10"><span><%= Resources.Approval.lbl_doc_publicsendshare%><!--대외공문발송대장(공유)--></span></a></li>
				<li id="divtab11" style="display:none;"><a href="#" onclick="javascript:changeBox(this);" id="tab11" name="tab11"><span><%= Resources.Approval.lbl_doc_licenceshare%><!--라이선스대장(공유)--></span></a></li>
				<li id="divtab12" style="display:none;"><a href="#" onclick="javascript:changeBox(this);" id="tab12" name="tab12"><span>발주/계약대장</span></a></li>
			  </ul>
			</div>
			<!-- 탭 div 끝 -->			                                		                			    			    			
    		<div class="BTable" >
				<!-- 게시판 리스트 div 시작 -->
				<iframe id="docList" name="docList" width='100%' height="310px" frameborder="0" src="about:blank" style='PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px; scroll:auto'></iframe>
			</div>
				<!-- 게시판 리스트 div 끝 -->
			  <!-- 페이징 div 시작 -->
			  <div class="Paging">
				<input name="gopage" type="text" class="input" size="4" onKeyPress="if (event.keyCode==13) go_page(this.value);" style="display:none">
				<a href="#" onclick="go_page('f')"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_start.gif" align="absmiddle" /></a>
				<a href="#" onclick="go_page('p')" ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_prev.gif" hspace="7" align="absmiddle" /></a>
				 <span  id="totalpage"></span>
				<a href="#" onclick="go_page('n')"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_next.gif" hspace="7" align="absmiddle" /></a>
				<a href="#" onclick="go_page('l')"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_end.gif" align="absmiddle" /></a>
			  </div>        

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
					<iframe id="iApvLine" name="iApvLine" width='100%' height='130' frameborder='0' src='about:blank' datasrc="../ApvlineMgr/ApvlineViewer.aspx" style='margin:0; padding:0; scroll=auto;'></iframe>
					</span>
					<span id="spanApvGraphic" style="DISPLAY: none" name="spanApvGraphic">
					<iframe id="iApvGraphic" style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; scroll: auto" name="iApvGraphic" src="../ApvMonitor/MonitorGraphic.aspx" frameBorder="0" width="100%" height="130" ></iframe>
					</span>        
				</div>     
			</div>
			<!-- list graphic div 끝 -->			
		<!--footer start-->
			<ucfooter:UxFooter ID="UxFooter1" runat="server" />
			<!--footer end -->
		</div>
		<!--quick Menu-->
		<ucquickmenu:UxQuickMenu ID="UxWF_Footer" runat="server" />
		<!--quick End-->
		<form class="form" id="form1" method="post" name="myform" target="result_fr"></form>
		<iframe src="" name="result_fr" height="100" width="100" style="DISPLAY:none;"></iframe>
		<script type="text/javascript" language="javascript">
    
				var fldrName="";
				var strDate;
				var aryDate;
				var bOnGoing;
				var strDate = new String();
				var aryDate = new Array();
				var sAuthDeptCode = "00080";//총무부
				var sUserDeptCode = '<%= Session["user_dept_code"].ToString()%>';
				var page = "1";
				var strDocListValue = "<%=strDocListValue %>";//var selMainTab = "tab1";
				var selMainTab = "<%=Request.QueryString["tab"]%>";
				var selApv = "tabApvLine";
				var igTmrDocList = 0;//이준희(2010-10-14): Added to avoid timing error in setApvLineClear().

				window.onload = initOnload;//alert(132);
				function initOnload()
				{//debugger;
					setDisplayMenu();
					document.getElementById("div"+selMainTab.replace("div","")).className = "current" ;
					setYearMonth();
					{//이준희(2010-10-14): Improved to avoid timing error in setApvLineClear().
					//setApvLineClear();
					igTmrDocList = window.setInterval('setApvLineClear()', 400);
					}
					setWorkList() ;
					setWrintBtn();
				
					document.getElementById("cboDate").selectedIndex = 0;    		
					document.getElementById("foldername").innerHTML = document.getElementById(selMainTab).innerHTML.replace("<SPAN>","").replace("</SPAN>","");
				
				}           
				function changeBox(selTab){			
					if (selTab.name != selMainTab) {
						document.getElementById("div"+selMainTab.replace("div","")).className = "" ;
						document.getElementById("div"+selTab.id.replace("div","")).className = "current" ;
					
						selMainTab = selTab.name ;
						setDate() ;
						setApvLineClear();
						setWorkList() ;
						setWrintBtn();
        				document.getElementById("foldername").innerHTML = document.getElementById(selMainTab).innerHTML.replace("<SPAN>","").replace("</SPAN>","");
					}
				}
				function changeApv(selTab, oApvLine, strApvlineDisp, oApvGraphic, strApvGraphicDisp) {
					if (selTab.name != selApv) {
						document.getElementById("div"+selApv.replace("div","")).className = "" ;
						document.getElementById("div"+selTab.id.replace("div","")).className = "current" ;
					
						selApv = selTab.name ;
						document.getElementById(oApvLine).style.display = strApvlineDisp ;
						document.getElementById(oApvGraphic).style.display = strApvGraphicDisp ;
					}
				}
				function setWorkList() {			    
					docList.location.href = "/CoviWeb/approval/Doclist/DocListItems.aspx?docListType=" + selMainTab.replace("tab","") + "&strMonth=" + fldrName;            	
				}

				function setApvLineClear()
				{
					{//이준희(2010-10-14): Improved to avoid a timing error loading .
					//document.getElementById("iApvGraphic").contentWindow.drawGraphic('');
					try
					{//alert(180);//document.getElementById('approve_bt_write').innerHTML += '|';
						document.getElementById('iApvGraphic').contentWindow.drawGraphic('');
						window.clearInterval(igTmrDocList);
					}
					catch(e)
					{
					}
					}
				}

				function setYearMonth(){
					strDate = "<%=strDate%>";
					aryDate = strDate.split("/"); 
					var aryDate1 = new Array();
				
					for(var i=aryDate.length-1;i>-1;i--){
						aryDate1 = aryDate[i].split("#");
						makeNode1(aryDate1[0]);
						if (aryDate1[0] == document.getElementById("cboDate").value){
							makeNode2(aryDate1[1]); 
						}
					}
					setDate() ;

	//				if ( sAuthDeptCode == sUserDeptCode ){
	//					var oOption = document.createElement("OPTION");
	//					cboDocListType.options.add(oOption);
	//					oOption.text="대외문서접수대장";
	//					oOption.value="4";	
	//					var oOption2 = document.createElement("OPTION");
	//					cboDocListType.options.add(oOption2);
	//					oOption2.text="직인날인기록부";
	//					oOption2.value="5";	
	//				}

				}
				function setDate() {
					//document.getElementById("cboDate").text = "<%=strYear%>";
					document.getElementById("cboDate").value = "<%=strYear%>";
					//document.getElementById("cboDate1").text = "<%= Resources.Approval.lbl_total %>";
					document.getElementById("cboDate1").value = "total";
					fldrName="";
				}
				function cboDate_onchange(){
					if (document.getElementById("cboDate1").value == "total"){
						fldrName = document.getElementById("cboDate").value;
					}else{
						fldrName = document.getElementById("cboDate").value + "-" + document.getElementById("cboDate1").value;
					}	
					if (fldrName != ""){
						setWorkList() ;
					}
					return;
				}
				function cboDate_onchange1(){
					var i=0;
					var intCount = document.getElementById("cboDate1").length;
					for (i=intCount-1;i>0;i--){
						document.getElementById("cboDate1").remove(i);			
					}	
					strDate = "<%=strDate%>";
					aryDate = strDate.split("/");
					var aryDate1 = new Array();
				
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
				
					for (var k=document.getElementById("cboDate").length-1;k>-1;k--){
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
				
					for (j=document.getElementById("cboDate1").length-1;j>-1;j--){
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
					var oChild=cboDate.options.children(str);
					cboDate.removeChild(oChild);
					return;
				}
				function viewDocListType(){
					if (document.getElementById("cboDate1").value == 'total'){
						fldrName = document.getElementById("cboDate").value;
					}else{
						fldrName = document.getElementById("cboDate").value + "-" + document.getElementById("cboDate1").value;
					}

					if (fldrName != ""){
						setWorkList() ;
					}				
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
				}
				function openWindow(registered_id, serial_number) {
					var szURL = "../forms/form.aspx?fmid={A950BDB1C5CB456CBB7DB1F538F849B0}&fmnm=대외공문접수&fmpf=OUTERPUBLISH_ENFORCE&scid={59EF56B327824994B0494901FB5E22CF}&mode=DRAFT&fmrv=0&fmfn=OUTERPUBLISH_ENFORCE";

					CoviWindow(szURL, "Form", 380,250,'resize');
				}
				function SavePC() {			
					var fldrName="";
					if (document.getElementById("cboDate1").value == "total"){
						fldrName = document.getElementById("cboDate").value;
					}else{
						fldrName = document.getElementById("cboDate").value + "-" + document.getElementById("cboDate1").value;
					}	
					if(docList.g_totalcount == "0") 
					{
						alert("<%= Resources.Approval.msg_279 %>");
						return false;
					}
					if (fldrName != ""){
						var sdoclistname='';
						switch (selMainTab.replace("tab",""))
						{
							case "1": sdoclistname= "<%= Resources.Approval.lbl_doc_reglist %>";break;
							case "2": sdoclistname= "<%= Resources.Approval.lbl_doc_recvlist %>";break;
							case "3": sdoclistname= "<%= Resources.Approval.lbl_doc_ForeignRegList %>";break;
							case "4": sdoclistname= "<%= Resources.Approval.lbl_doc_ForeignRecvList %>";break;
							case "5": sdoclistname= "<%= Resources.Approval.lbl_OfficialSealList %>";break;
							case "6": sdoclistname= "<%= Resources.Approval.lbl_ApplicationRecvList %>";break;
							case "7": sdoclistname= "<%= Resources.Approval.lbl_doc_sendlist %>";break;
							case "8": sdoclistname= "<%= Resources.Approval.lbl_doc_notelist %>";break;
							case "9": sdoclistname= "<%= Resources.Approval.lbl_doc_seallist %>";break;
							case "10": sdoclistname= "<%= Resources.Approval.lbl_doc_publicsendshare %>";break;
							case "11": sdoclistname= "<%= Resources.Approval.lbl_doc_licenceshare %>";break;
							case "12": sdoclistname= "발주/계약";break;
						}
						if (document.getElementById("cboDate1").value == "total")
						{
							sdoclistname += "(" + document.getElementById("cboDate").value + "01~" + document.getElementById("cboDate").value + "12" + ")";
						}
						else
						{
							sdoclistname += "(" + document.getElementById("cboDate").value + document.getElementById("cboDate1").value + ")";
						}					
				    
						document.getElementById("form1").action = "DocListItemsExcel.aspx?docListType=" + selMainTab.replace("tab","") + "&strMonth=" + fldrName + "&doclistname="+escape(sdoclistname);					
						document.getElementById("form1").target = "result_fr";
						document.getElementById("form1").submit();
					}						
				}
			//탭 활성화 2008.02 sunny	
			function distab(objchecktabview){
				if(objchecktabview.checked) {
					document.getElementById("divtab").style.display = "";
				}
				else {
					document.getElementById("divtab").style.display = "none";
				}
			}	
			function setDisplayMenu(){
				var aMenu = strDocListValue.split(":");    
				for(var j=1;j<aMenu.length;j++)
				{  
					if(aMenu[j]=="1")   document.getElementById("divtab"+j).style.display = "";
					else document.getElementById("divtab"+j).style.display = "none";
				}
			}	
			// 문서대장에서 작성 버튼 클릭시 해당 양식 오픈 by 2008.10.1 강효정
			function WriteDocList()
			{
				var fmid = "";
				var fmnm = "";
				var fmpt = "";
				var scid = "";
				var fmrv = "";
				var fmfn = "";
            
				switch(selMainTab){
					case "tab8":
						fmid = "{3CE92F24307B4E5792A3BF4BCBA30304}";
						fmnm = "수기문서";
						fmpt = "OFFICIAL_DOCUMENT_03";
						scid = "{B2ECBF0D43EB435E9222AE06070A7540}";
						fmrv = "0";
						fmfn = "OFFICIAL_DOCUMENT_03";
						break;
					case "tab9":
						fmid = "{9521ECB2632A42B7A8369B943A099C2B}";
						fmnm = "직인날인부(수기문서)";
						fmpt = "OFFICIAL_DOCUMENT_01";
						scid = "{B2ECBF0D43EB435E9222AE06070A7540}";
						fmrv = "0";
						fmfn = "OFFICIAL_DOCUMENT_01";
						break;
					case "tab10":
						fmid = "db0cd137-0092-4117-9ac6-edd794bb89de";
						fmnm = "대외공문발송(수기문서)";
						fmpt = "OFFICIAL_DOCUMENT_04";
						scid = "{B2ECBF0D43EB435E9222AE06070A7540}";
						fmrv = "0";
						fmfn = "OFFICIAL_DOCUMENT_04";
						
					    /*
						fmid = "71d2d0f6-c456-4018-879c-f989f6260366";
						fmnm = "대외공문";
						fmpt = "DRC_FORM_OFFICIAL_DOCUMENT";
						scid = "{B2ECBF0D43EB435E9222AE06070A7540}";
						fmrv = "0";
						fmfn = "DRC_FORM_OFFICIAL_DOCUMENT";
						*/
						break;
					case "tab11":
						fmid = "ed864603-ac11-4b93-b6b1-b51f2e6b4a4a";
						fmnm = "라이선스발송(수기문서)";
						fmpt = "OFFICIAL_DOCUMENT_05";
						scid = "{B2ECBF0D43EB435E9222AE06070A7540}";
						fmrv = "0";
						fmfn = "OFFICIAL_DOCUMENT_05";
						break;
					case "tab12":
						fmid = "8E586FCE-F662-4F3F-915C-288EC4C13DD8";
						fmnm = "발주/게약(수기문서)";
						fmpt = "OFFICIAL_DOCUMENT_06";
						scid = "B2ECBF0D-43EB-435E-9222-AE06070A7540";
						fmrv = "0";
						fmfn = "OFFICIAL_DOCUMENT_06";
						break;
					default:;
				}
				Open_FormDocList(fmid,toUTF8(fmnm),fmpt,scid,fmrv,fmfn);
			}				
			function setWrintBtn()
			{
				if(selMainTab=="tab8" || selMainTab=="tab9" || selMainTab=="tab10" || selMainTab=="tab11" || selMainTab=="tab12")
				{
					document.getElementById("span_note").style.display="";
				}else
				{
					document.getElementById("span_note").style.display="none";
				}
			}
			function go_page(pagegb){
				docList.go_page(pagegb);
			}
			</script>    
	</body>    
</html>