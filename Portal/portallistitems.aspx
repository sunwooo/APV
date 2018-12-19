d<%@ Page Language="C#" AutoEventWireup="true" CodeFile="portallistitems.aspx.cs" Inherits="COVIFlowNet_Portal_portallistitems" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Worklist</title>
	<script type="text/javascript" language="javascript" src="/CoviWeb/common/script/CFL.js"></script>
	<script type="text/javascript" language="javascript" src="/CoviWeb/common/script/coviflownet/openwindow.js"></script>
	<script type="text/javascript" language="javascript" src="/CoviWeb/Approval/Portal/portallistitems.js"></script>
	<script type="text/javascript" language="javascript" src="../common/function.js"></script>
	<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Dictionary.js"></script>
</head>
<body style="OVERFLOW: auto; MARGIN: 0px;">
    <table width="100%" border="0"  cellpadding="0" cellspacing="0" width="530" >
		<tr>
			<td valign="top">
				<div id='divGalTable'>
				</div>
				<div id='divErrorMessage' class='errormessage'></div>
			</td>
		</tr>
		</table>
	     
	<script type="text/javascript" language="javascript">
		var uid = "<%=uid%>";
		var page = "<%=strpage%>";
		var kind = "<%=strkind%>";
		var gLocation = "<%=strlocation%>";
		var gLocationMode = "<%=strlocationmode%>";
		var gTitle = "<%=strtitle%>";
		var gSearch = "";
		var gLabel ="<%=strlabel%>";
		var gDept ="<%=strDept%>";
		var gOrder = "";
		var bArchived = parent.bArchived;
		//부서함관련수정
		var fldrName='';
		var strDate;
		var aryDate;
		var bOnGoing;
		var strDate = new String();
		var aryDate = new Array();
		var g_dicFormInfo = new Dictionary();
		g_dicFormInfo.Add("mode","READ");
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

			cboDate.text = "<%=strYear%><%= Resources.Approval.lbl_year %>";
			cboDate.value = "<%=strYear%><%= Resources.Approval.lbl_year %>";
			cboDate1.text = "<%=strMonth%><%= Resources.Approval.lbl_month %>";
			cboDate1.value = "<%=strMonth%><%= Resources.Approval.lbl_month %>";
			cboDate.style.visibility="visible"; 
			cboDate1.style.visibility="visible";
		}
		function cboDate_onchange(){
			if (self.cboDate1.value.indexOf("<%= Resources.Approval.lbl_month %>") == 2){
				fldrName = self.cboDate.value.substring(0,4) + self.cboDate1.value.substring(0,2);
			}else{
				fldrName = self.cboDate.value.substring(0,4) + "0" + self.cboDate1.value.substring(0,1);
			}	
			if (fldrName != ""){
					queryGetData();
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
			if(self.cboDate.value == "<%=strYear%><%= Resources.Approval.lbl_year %>") {
				cboDate1.text = "<%=strMonth%><%= Resources.Approval.lbl_month %>";
				cboDate1.value = "<%=strMonth%><%= Resources.Approval.lbl_month %>";	
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
				if (self.cboDate1.value.indexOf("<%= Resources.Approval.lbl_month %>") == 2){
					fldrName = self.cboDate.value.substring(0,4) + self.cboDate1.value.substring(0,2);
				}else{
					fldrName = self.cboDate.value.substring(0,4) + "0" + self.cboDate1.value.substring(0,1);
				}
				if (fldrName != "") {
					cboDate.style.visibility="visible"; 
					cboDate1.style.visibility="visible";
					queryGetData();
				}			
			}
			return;	
		}
	</script>
</body>
</html>
