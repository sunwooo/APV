<%@ Page Language="C#" EnableSessionState="True" AutoEventWireup="true" CodeFile="ListItems.aspx.cs" Inherits="COVINet.COVIFlowNet.ListItems" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
	<head runat="server">
		<title>ListItems</title>
		<script type="text/javascript" language="javascript" src="../common/script/CFL.js"></script>
		<script type="text/javascript" language="javascript" src="../common/script/coviflownet/openwindow.js"></script>
		<script type="text/javascript" language="javascript" src="../common/script/NameControl.js"></script>
		<script type="text/javascript" language="javascript" src="../SiteReference/js/Dictionary.js"></script>
        <script type="text/javascript" language="javascript" src="/CoviWeb/common/script/jquery-1.6.1.min.js"></script>
	</head>
<form id="form1" runat="server"></form>
<body oncontextmenu="return false" >
<table width="100%" border="0" cellpadding="0" cellspacing="0">
	<tr>
	
		<td valign="top" class="BTable_bg09" style="height:285">
			<div id='divGalTable' class="BTable" style="height:300">
			</div>
			<div id='divErrorMessage' class='errormessage'></div>
		</td>
	</tr>
	<tr>
		<td>
	<!-- 페이징 div 시작 -->
	<div id="divPaging" name="divPaging" class="Paging">
		<input name="gopage" type="text" class="input" size="4" onKeyPress="if (event.keyCode==13) go_page(this.value);" style="display:none" />
		<a href="#" onclick="go_page('f')"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_start.gif" align="absmiddle" /></a>
		<a href="#" onclick="go_page('p')" ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_prev.gif" hspace="7" align="absmiddle" /></a>
		 <span  id="totalpage"></span>
		<a href="#" onclick="go_page('n')"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_next.gif" hspace="7" align="absmiddle" /></a>
		<a href="#" onclick="go_page('l')"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_end.gif" align="absmiddle" /></a>
	</div>
	<!-- 페이징 div 끝 -->
		</td>
	</tr>	
</table>	
	<!--	
		
	  <table width="100%"  border="0" cellpadding="0" cellspacing="0" class="listbg" valign="bottom">
		<tr>
		  <td height="35" align="center">
			<span class="bottom5px" style="vertical-align:middle;"><strong>
				<input name="gopage" type="text" class="input" size="4" onKeyPress="if (event.keyCode==13) go_page(this.value);" style="display:none">
			</strong>
		<img src="<%=Session["user_thema"] %>/common/btn/btn_go.gif" width="27" height="15" align="absmiddle" onclick="go_page(gopage.value)" style="cursor:hand;display:none;">
		<span class="left20px"><img src="<%=Session["user_thema"] %>/common/btn/page_prevv.gif" width="21" height="11" align="absmiddle" onclick="go_page('f')" style="cursor:hand"></span>
		 <img src="<%=Session["user_thema"] %>/common/btn/page_prev.gif" width="17" height="11" align="absmiddle" onclick="go_page('p')" style="cursor:hand"></span>
		&nbsp;<span class="bottom5px" id="totalpage"></span>&nbsp;
		<img src="<%=Session["user_thema"] %>/common/btn/page_next.gif" width="17" height="11" align="absmiddle" onclick="go_page('n')" style="cursor:hand"> 
		<img src="<%=Session["user_thema"] %>/common/btn/page_nextt.gif" width="21" height="11" align="absmiddle" onclick="go_page('l')" style="cursor:hand">
		</span>
	  </td>
		</tr>
	  </table>-->
	<span id="tooltip" class="tooltip"></span>
	<DIV style="DISPLAY:none">
		<form id="menu">
			<input type="hidden" name="APVLIST"></form>
		<form id="editor">
		</form>
	</DIV>
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
		//장혜인 2011-02-01 bstored 변수추가
		var bstored = parent.bstored;
		//부서함관련수정
		var fldrName='';
		var strDate;
		var aryDate;
		var bOnGoing;
		var strDate = new String();
		var aryDate = new Array();
		var g_dicFormInfo = new Dictionary();
		var g_imgBasePath = "<%=Session["user_thema"] %>";
		var g_usepresence = "<%=strContextMenuType %>";
		var sEntCode ="<%=sEntcode%>";
		
		//회장님 기능수정
		var startdate = "";
		//try{startdate = parent.SEARCHDATE.value;}catch(e){}
		//try{startdate = parent.document.getElementById("SEARCHDATE").value;}catch(e){}
		
		if (startdate == ""){startdate ="<%=strstartdate%>";}		//20071107 hjy
		
		if(gLabel =="")
		{
			gLabel = "<%=Resources.Approval.lbl_date2 %>";   
		}
		var userid="<%=Session["user_code"]%>";
		
		g_dicFormInfo.Add("mode","READ");
		
		//사용자 문서 조회 및 수정
		//변수 선언
		var admintype = "<%=Request.QueryString["admintype"]%>";
		//사용자 문서 조회 및 수정 End
		if (admintype == "ADMIN"){
		}else{
			var userid = "<%=Session["user_code"]%>";
			var strBox = uid.substring(uid.lastIndexOf("_")+1);
			if (gLocation == "DEPART" || gLocation == "JOBFUNCTION" || gLocation == "UFOLDER"  || gLocation == "GARBAGE" || gLocation == "FOLDER" ){
			}else{//개인함-본인것만 보도록 uid 강제 변환
				uid = userid;
			}
		}			
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
		
//		//첨부 레이어 2008.04 강성채
//		function attachLayer(diffx,diffy, obj, event){		
//			x = (document.layers) ? loc.pageX : event.clientX;
//			y = (document.layers) ? loc.pageY : event.clientY;
//			sH = parseInt(document.body.scrollTop);
//			sW = parseInt(document.body.scrollLeft);
//			
//			try{
//				var objTR = obj.parentElement.parentElement;
//				var fiid = objTR.attributes["fiid"].value;
//				var fmpf = objTR.attributes["fmpf"].value;
//				var fmrv = objTR.attributes["fmrv"].value;
//			
//				if(parent.PopLayer != null){
//					parent.document.getElementById("PopLayer").style.left = sW+x+diffx+'px';
//					parent.document.getElementById("PopLayer").style.top = sH+y+diffy+'px';
//					parent.document.getElementById("PopLayer").style.display = "";//(PopLayer.style.display == "")?"none":"";
//					parent.nPopLayer.location.href = "./ApvInfoList/AttachFileList.aspx?fiid="+fiid+"&fmpf="+fmpf+"&fmrv="+fmrv+"&type=file&archive="+bArchived;
//				}
//				else{
//					parent.parent.document.getElementById("PopLayer").style.left = sW+x+diffx+'px';
//					parent.parent.document.getElementById("PopLayer").style.top = sH+y+diffy+'px';
//					parent.parent.document.getElementById("PopLayer").style.display = "";//(PopLayer.style.display == "")?"none":"";
//					parent.parent.nPopLayer.location.href = "./ApvInfoList/AttachFileList.aspx?fiid="+fiid+"&fmpf="+fmpf+"&fmrv="+fmrv+"&type=file&archive="+bArchived;
//				}
//				
//				//parent.nPopLayer.location.href = "./forms/ListItems_AttachLayer.aspx?fiid="+objTR.fiid+"&fmpf="+objTR.fmpf+"&fmrv="+objTR.fmrv;
//			}
//			catch(e){
//				//alert(e);
//			}
//		}

//bstored 장혜인 2011-02-01 
		function attachLayer(diffx,diffy, obj, event){	
			
		    x = (document.layers) ? loc.pageX : event.clientX;
	        y = (document.layers) ? loc.pageY : event.clientY;
	        sH = parseInt(document.body.scrollTop);
	        sW = parseInt(document.body.scrollLeft);
	        
	        try{
	            var objTR = obj.parentNode.parentNode;
	            var fiid = objTR.attributes["fiid"].value;
                var fmpf = objTR.attributes["fmpf"].value;
                var fmrv = objTR.attributes["fmrv"].value;
                var scid = objTR.attributes["scid"].value;
                var piid = objTR.attributes["piid"].value;
				
//				alert(window.ActiveXObject);
//				alert(window.addEventListener);
				
				if(window.addEventListener)
				{
					
//					parent.document.getElementById("PopLayer").style.left = sW+x+diffx+'px';
//					parent.document.getElementById("PopLayer").style.top = sH+y+diffy+'px';
					parent.document.getElementById("PopLayer").style.left = 50 +'px';
					parent.document.getElementById("PopLayer").style.top =   100 +'px';
					parent.document.getElementById("PopLayer").style.display = "block";//(PopLayer.style.display == "")?"none":"";
					parent.nPopLayer.location.href = "./ApvInfoList/AttachFileList.aspx?fiid="+fiid+"&fmpf="+fmpf+"&fmrv="+fmrv+"&type=file&archive="+bArchived+"&bstored="+bstored+"&scid="+scid+"&piid="+piid;
	            }else{
					if(parent.PopLayer != null){
//						parent.document.getElementById("PopLayer").style.left = sW+x+diffx+'px';
//						parent.document.getElementById("PopLayer").style.top = sH+y+diffy+'px';
						parent.document.getElementById("PopLayer").style.left = 50 +'px';
						parent.document.getElementById("PopLayer").style.top =   100 +'px';
                        parent.document.getElementById("PopLayer").style.display = "";//(PopLayer.style.display == "")?"none":"";
                        parent.document.getElementById("PopLayer").style.backgroundColor = '#FFFFFF';
    					parent.nPopLayer.location.href = "./ApvInfoList/AttachFileList.aspx?fiid="+fiid+"&fmpf="+fmpf+"&fmrv="+fmrv+"&type=file&archive="+bArchived+"&bstored="+bstored+"&scid="+scid+"&piid="+piid;
					}
					else{
//						parent.parent.document.getElementById("PopLayer").style.left = sW+x+diffx+'px';
//						parent.parent.document.getElementById("PopLayer").style.top = sH+y+diffy+'px';
						parent.document.getElementById("PopLayer").style.left = 50 +'px';
						parent.document.getElementById("PopLayer").style.top =   100 +'px';
                        parent.parent.document.getElementById("PopLayer").style.display = "";//(PopLayer.style.display == "")?"none":"";
                        parent.parent.document.getElementById("PopLayer").style.backgroundColor = '#FFFFFF';
    					parent.parent.nPopLayer.location.href = "./ApvInfoList/AttachFileList.aspx?fiid="+fiid+"&fmpf="+fmpf+"&fmrv="+fmrv+"&type=file&archive="+bArchived+"&bstored="+bstored+"&scid="+scid+"&piid="+piid;
					}
	            }
    	        
	            //parent.nPopLayer.location.href = "./forms/ListItems_AttachLayer.aspx?fiid="+objTR.fiid+"&fmpf="+objTR.fmpf+"&fmrv="+objTR.fmrv;
	        }
	        catch(e){
	            //alert(e);
	        }
        }
        
	</script>
	<script type="text/javascript" language="javascript" src="listitems.js"></script>
	<script type="text/javascript" language="javascript" src="common/function.js"></script>
	<script type="text/javascript" language="javascript">
		var gMessage001 = "<%= Resources.Approval.msg_001 %>";
		var gMessage002 = "<%= Resources.Approval.msg_002 %>";
		var gMessage003 = "<%= Resources.Approval.msg_003 %>";
		var gMessage093 = "<%= Resources.Approval.msg_093 %>";
		var gMessage077 = "<%= Resources.Approval.msg_077 %>";
		var gMessage153 = "<%= Resources.Approval.msg_153 %>";
		var gMessage325 = "<%= Resources.Approval.msg_325 %>";
		var gMessage326 = "<%= Resources.Approval.msg_326 %>";
		var gMessage327 = "<%= Resources.Approval.msg_327 %>";
		var language = "<%= Session["user_language"].ToString() %>";
	</script>	
	<%--<!-- 첨부 레이어 2008.04 강성채-->
	<div id="PopLayer" style="display:none; position:absolute;" onmouseout="this.style.display='none';" >
		<iframe id="nPopLayer" name="nPopLayer" src="./forms/ListItems_AttachLayer.aspx" style="border-color:Black;" frameborder="1"></iframe>
	</div>--%>
	<!--context menu 관련 뿌리기 시작-->
	<%--<script type="text/javascript" language="javascript" src="../common/script/ContextMenu4HTML.js"></script>
	<script language="javascript" type="text/javascript">
		//contextmenu write
		getContextMenu();
	</script>--%>
	<!-- context menu 관련 뿌리기 끝-->
	<script type="text/javascript">
		////////////////////////결재선 조회 메뉴 보여주기///////////////////////
		var windowAL = null;
		function OpenApprovalLine(obj, event){				   
			var piid = obj.attributes["piid"].value;
			var scid = obj.attributes["scid"].value;
			var fmpf = obj.attributes["fmpf"].value;
			var fmrv = obj.attributes["fmrv"].value;
			var fiid = obj.attributes["fiid"].value;
		  
			x = (document.layers) ? loc.pageX : event.clientX;
			y = (document.layers) ? loc.pageY : event.clientY;
			sH = parseInt(document.body.scrollTop);
			sW = parseInt(document.body.scrollLeft);
			
			//alert("x : " + x + " -- y :"+ y);
			y = 100;//고정위치변경 - IE에서만 scroll현상 발생 noneIE에서는 정상이었음
			
			if(parent.document.getElementById("PopLayerAPV") != null){
				parent.document.getElementById("PopLayerAPV").style.left = sW+x+20+'px';
				parent.document.getElementById("PopLayerAPV").style.top = sH+y+20+'px';
				parent.document.getElementById("nPopLayerAPV").contentWindow.showDetail(piid, scid);
				parent.nPopLayerAPV.piid = piid;
				parent.nPopLayerAPV.scid = scid;
				parent.nPopLayerAPV.fmpf = fmpf;
				parent.nPopLayerAPV.fmrv = fmrv;
				parent.nPopLayerAPV.fiid = fiid;	  
				parent.document.getElementById("PopLayerAPV").style.display = "";
			}else{
				parent.parent.document.getElementById("PopLayerAPV").style.left = sW+x+20+'px';
				parent.parent.document.getElementById("PopLayerAPV").style.top = sH+y+20+'px';
				parent.parent.document.getElementById("nPopLayerAPV").contentWindow.showDetail(piid, scid);
//				parent.parent.nPopLayerAPV.hidFmpf.value = fmpf;
//				parent.parent.nPopLayerAPV.hidFmrv.value = fmrv;
//				parent.parent.nPopLayerAPV.hidFiid.value = fiid;				
				parent.parent.nPopLayerAPV.fmpf.value = fmpf;
				parent.parent.nPopLayerAPV.fmrv.value = fmrv;
				parent.parent.nPopLayerAPV.fiid.value = fiid;
				parent.parent.document.getElementById("PopLayerAPV").style.display = "";
			}  
		}
		/*

		个*/
	</script>
	</body>
</html>
