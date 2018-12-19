<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApvMonitoring.aspx.cs" Inherits="COVIFlowNet_ApvMonitor_ApvMonitoring" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>결재 현황 조회</title>
	<script type="text/javascript" language="javascript" src="/CoviWeb/common/script/CFL.js"></script>
	<script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
	<script FOR="cbBTN" EVENT="onmousedown()">this.className = 'btnDown';</script>
	<script FOR="cbBTN" EVENT="onmouseover()">this.className = 'btnOver';</script>
	<script FOR="cbBTN" EVENT="onmouseout()">this.className = 'btnOut';</script>
	
</head>
<body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td class="line00_b"></td>
			</tr>
			<tr>
				<td height="17" align="right">[Home]&gt; 전자결재 &gt; 결재현황조회 &gt; <b>진행/완결 현황</b> &nbsp;</td>
			</tr>
		</table>
		<table width="98%" border="0" cellspacing="0" cellpadding="0" align="center">
			<tr>
				<td>
					<table border="0" cellspacing="0" cellpadding="0" width="100%">
						<tr>
							<td class="title" width="70%"><img src="/CoviWeb/common/Images/title_button_blue.gif" align="absMiddle" width="33" height="36">
								진행/완결현황 &nbsp;
								<select id="cboViewGoing" name="cboViewGoing" onchange="on_ViewGoing()" class="select_text">
									<option value="1" selected>진행중</option>
									<option value="-1">완료</option>
								</select>&nbsp;
								<select id="cboDate" name="cboDate" onchange="return cboDate_onchange1()" style="VISIBILITY:hidden"
									class="select_text">
								</select>&nbsp; &nbsp;<select id="cboDate1" name="cboDate1" onchange="return cboDate_onchange()" style="VISIBILITY:hidden"
									class="select_text">
								</select>&nbsp;
							</td>
							<!--<td width="30%" align="right"><input type="button" value="결재문서단계조회" name="bt_search" class="button_blong" onclick="OK()"></td>-->
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td class="line01_b"></td>
			</tr>
			<tr>
				<td class="line02_b"></td>
			</tr>
			<tr>
			</tr>
			<tr>
				<td width="100%" height="5"></td>
			</tr>
		</table>
		<table width="98%" border="0" cellspacing="0" cellpadding="0" height="40%" align="center">
			<tr>
				<td valign="top">
					<IFRAME ID="monitorList" name="monitorList" FRAMEBORDER="1" style="WIDTH:100%;HEIGHT:100%"
						Border="0" SRC="MonitorList.aspx?bOnGoing=true"></IFRAME>
				</td>
			</tr>
		</table>
		<table width="98%" border="0" cellspacing="0" cellpadding="0" height="45%" align="center">
			<tr>
				<td valign="top" style="width: 922px">
					<table width="100%" border="0" cellspacing="0" cellpadding="0" height="95%">
						<tr> <!--위 테이블과의 여백을 위한 공간-->
							<td colspan="3" height="23">
							</td>
						</tr>
						<tr id="TabHeader"> <!--탭으로 사용되는 이미지 반전되었을때의 이미지명은 on/off 로 구분-->
							<td class="TabSel" id="dftList" width="10%" align="center" noWrap contentID="tabList">
								<IMG name="imglist" onclick='changeimglist();' ondragstart='return false' src="/CoviWeb/common/Images/tap_list_on.gif"
									style="CURSOR:hand" border="0" align="absBottom">
							</td>
							<td class="TabUnSel" id="dftGraphic" width="10%" align="center" noWrap contentID="tabGraphic">
								<IMG name="imggraphic" onclick='changeimggraphic();' ondragstart='return false' src="/CoviWeb/common/Images/tap_graphic_off.gif"
									style="CURSOR:hand" border="0" align="absBottom">
							</td>
							<td></td>
						</tr>
						<tr> <!--탭이미지와 같은 바 색상 #8CA5BF-->
							<td colspan="3" bgcolor="#8ca5bf" height="3"></td>
						</tr>
						<tr height="90%">
							<td id="TabContent" width="100%" colspan="3" height="100%">
								<div class="TabSel" id="tabList" width="100%"><iframe frameborder="0" width="100%" height="100%" datasrc="../ApvlineMgr/ApvlineViewer.htm"
										src="" id="monitor"></iframe></div>
								<div class="TabUnSel" id="tabGraphic" width="100%"><iframe frameborder="0" width="100%" height="100%" datasrc="MonitorGraphic.htm" src="MonitorGraphic.htm"
										id="graphic" scrolling="auto"></iframe></div>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		<script language="javascript" type="text/javascript">
			var m_oSelTab = self.dftList;

			function changeimggraphic() {
				document.imggraphic.src="/CoviWeb/common/Images/tap_graphic_on.gif";
				document.imglist.src="/CoviWeb/common/Images/tap_list_off.gif";
			}
			function changeimglist() {
				document.imggraphic.src="/CoviWeb/common/Images/tap_graphic_off.gif";
				document.imglist.src="/CoviWeb/common/Images/tap_list_on.gif";
			}
		</script>
<script language="javascript" type="text/javascript">
	var fldrName;
	var strDate;
	var aryDate;
	var bOnGoing;
	var strDate = new String();
	var aryDate = new Array();
	var m_ProcInstID="";

	function window.onload(){
		strDate = "<%=strDate%>";
		aryDate = strDate.split("/"); 
		
		for(i=aryDate.length-1;i>-1;i--){
			aryDate1 = aryDate[i].split("#");  
			makeNode1(aryDate1[0]);
			if (aryDate1[0] == self.cboDate.value){
				makeNode2(aryDate1[1]); 
			}
		}

		cboDate.text = "<%=strYear%>년";
		cboDate.value = "<%=strYear%>년";
		cboDate1.text = "<%=strMonth%>월";
		cboDate1.value = "<%=strMonth%>월";
	}
	function cboDate_onchange(){
		if (self.cboDate1.value.indexOf("월") == 2){
			fldrName = self.cboDate.value.substring(0,4) + self.cboDate1.value.substring(0,2);
		}else{
			fldrName = self.cboDate.value.substring(0,4) + "0" + self.cboDate1.value.substring(0,1);
		}	
		if (fldrName != ""){
			window.self.monitorList.location = "MonitorList.aspx?bOnGoing=" + bOnGoing + "&strMonth=" + fldrName;	
			//monitor.location = "about:blank";
			//graphic.drawGraphic("");
			monitor.location = "about:blank";
			graphic.drawGraphic("");
		}
		return;
	}
	function cboDate_onchange1(){
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
		if(self.cboDate.value == "<%=strYear%>년") {
			cboDate1.text = "<%=strMonth%>월";
			cboDate1.value = "<%=strMonth%>월";	
		}
		cboDate_onchange();
		return;
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
	function removeNode(str){
		var oChild=cboDate.options.children(str);
		cboDate.removeChild(oChild);
		return;
	}
	function on_ViewGoing(){
		viewOnGoing(cboViewGoing.value);
	}
	function viewOnGoing(n){	
		if (n==1){
			cboDate.style.visibility="hidden"; 
			cboDate1.style.visibility="hidden";	
			monitorList.location = "MonitorList.aspx?bOnGoing=true";	
			monitor.location = "about:blank";
			graphic.drawGraphic("");
		}else{
			bOnGoing = false;		
			if (self.cboDate1.value.indexOf("월") == 2){
				fldrName = self.cboDate.value.substring(0,4) + self.cboDate1.value.substring(0,2);
			}else{
				fldrName = self.cboDate.value.substring(0,4) + "0" + self.cboDate1.value.substring(0,1);
			}
			if (fldrName != "") {
				cboDate.style.visibility="visible"; 
				cboDate1.style.visibility="visible";
				monitorList.location = "MonitorList.aspx?bOnGoing=" + bOnGoing + "&strMonth=" + fldrName;
				monitor.location = "about:blank";
				graphic.drawGraphic("");
			}			
		}
		return;	
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
        //window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
	}
	function OK(){
		if (m_ProcInstID == "") {
			alert("결재문서를 선택하십시요") ; 
		}else{
			var strURL = "MonitorProcess.aspx?piid="+ m_ProcInstID;
			openWindow(strURL,"결재문서단계조회",450,300,'resize');
		}	
	}
	</script>		
</body>
</html>
