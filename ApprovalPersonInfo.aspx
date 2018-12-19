<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApprovalPersonInfo.aspx.cs" Inherits="COVIFlowNet_ApprovalPersonInfo" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title><%= Resources.Approval.lbl_SubstitueSetting %></title>
	<script type="text/javascript" language="javascript" src="/CoviWeb/common/script/CFL.js"></script>
	<script language="javascript" src="./Forms/calendar/__cal.js"></script>
	<script language="vbscript" src="./Forms/calendar/__cal.vbs"></script>
	<script language="javascript" type="text/javascript">
		var UserAlias = "<%=UserAlias%>";
		var stamp_num = "";
		var sign_num = "";

		function window.onload() {
			frmBody.begin_date.value = "<%=reserved3%>";
			frmBody.end_date.value = "<%=reserved4%>";

			/*대결사용여부*/
			if("<%=deputy_usage%>" == "1") {
				frmBody.deputy_usage.checked = true ;
				spandeputy_usage.style.display = "" ;
			}
			else {
				frmBody.deputy_usage.checked = false ;
				spandeputy_usage.style.display = "none" ;
			}

		}
		function fnWfPwd() {
			window.showModalDialog("/Password/setPwdWf.aspx","","dialogHeight:170px;dialogWidth:300px;status:no;resizable:no;help:no;");
		}
		function fnSave() {
			if(chkVal()){
				process() ;
			}
		}
		function chkVal() {
			if (document.frmBody.begin_date.value > document.frmBody.end_date.value) {
				//alert("대결기간 시작 일자가 종료 일자보다 클 수 없습니다!") ;
				alert("<%= Resources.Approval.msg_115 %>") ;
				return false ;
			}
			return true ;
		}
		function chkChar(str1) {
			var chkIndex = false ;
			if(str1.indexOf("&")>-1){chkIndex = true;}
			if(str1.indexOf("'")>-1){chkIndex = true;}
			if (chkIndex == false) {return false ;}
			//else {alert("입력 값에 & 나 ' 를 포함할 수 없습니다...!");return true;}
			else {alert("<%= Resources.Approval.msg_116 %>");return true;}
		}

		function process(){
			var m_xmlHTTP = new ActiveXObject("Microsoft.XMLHTTP");
			var sXML = "<Items>" ;
			var strdeputy_usage = (frmBody.deputy_usage.checked == true)?"1" :"0";

			sXML = sXML + "<reserved3>" + frmBody.begin_date.value + "</reserved3>" ;
			sXML = sXML + "<reserved4>" + frmBody.end_date.value + "</reserved4>" ;
			sXML = sXML + "<reserved5>" + frmBody.reserved5.value + "</reserved5>" ;
			sXML = sXML + "<deputy>" + frmBody.deputy.value + "</deputy>" ;
			sXML = sXML + "<deputy_usage>" + strdeputy_usage + "</deputy_usage>" ;	
			sXML = sXML + "<UserAlias>" + UserAlias + "</UserAlias>" ;				
			sXML = sXML + "</Items>";

			m_xmlHTTP.open("GET","perProcess.aspx",false);

			m_xmlHTTP.send(sXML);

			if (m_xmlHTTP.status != 200) {
				alert("ERROR : " + m_xmlHTTP.statusText);
			}
			else {
				var returnVal = m_xmlHTTP.responseXML.selectSingleNode("response/error") ;
				if (returnVal != null){
					alert(returnVal.text);
				}else{
					//alert("성공적으로 저장하였습니다.");
					alert("<%= Resources.Approval.msg_117 %>");
				}
			}
		}
		function calcWindowLocation(nWidth, nHeight) {
			theLeft = (window.screen.width / 2) - (nWidth / 2);
			theTop = (window.screen.height / 2) - (nHeight / 2); 
		}
		function fnDeputyDel() {
			frmBody.reserved5.value = ""
			frmBody.deputy.value = ""
		}
		function fndeputy_usage(){
		    
		}
		function fnDeputy() {
			var rgParams=null;
			var g_nFontHeight = 13;
			rgParams=new Array();
			calcWindowLocation(550,550);
			
			rgParams["bMail"]  = false;
			rgParams["bUser"] = true;
			rgParams["bGroup"] = false;
			rgParams["bRef"] = false;
			rgParams["bMember"] = true;
			rgParams["bPerson"] = true;				
			rgParams["objMessage"] = window;
			
			var oStyle = window.document.body.currentStyle;
			var nFontHeight = g_nFontHeight - 4;
			var szFont = "FONT:"+ oStyle.fontFamily + ";font-size:" + nFontHeight + "px;";
			var nWidth = 640;//110 + 30 * nFontHeight;
			var nHeight = 540;//210 + 25 * nFontHeight;
			var sFeature = szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;help:no;scroll=no";
			var strNewFearture = ModifyDialogFeature(sFeature);
			
			var pass = "http://" + window.document.location.host + "/COVINet/CoviflowNet/Address/address.aspx";
			var vRetval = window.showModelessDialog(pass, rgParams, strNewFearture);	
		}
        //선택된사용자 화면에 보여주기
        function insertToList(oList){
            var m_oChargeList = new ActiveXObject("MSXML2.DOMDocument");
            m_oChargeList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+oList.xml);
        	
            //alert(oList.xml);

            var elmRoot = m_oChargeList.documentElement;
            var elmlist = elmRoot.selectNodes("item");
            var elm;
            //if (elmlist.length > 1 ){alert('대결는 1명만 입력가능합니다');return;}
            if (elmlist.length > 1 ){alert("<%= Resources.Approval.msg_118 %>");return;}
            for(var i=0; i< elmlist.length; i++){
	            elm = elmlist.nextNode();
	            frmBody.reserved5.value = elm.selectSingleNode("DN").text+'/'+elm.selectSingleNode("DP").text+'/'+elm.selectSingleNode("PO").text;		//신청자
	            frmBody.deputy.value = elm.selectSingleNode("AN").text;		//아이디
            }
        }
	</script>
</head>
<body>
    <FORM id="frmBody" name="frmBody">
	<table width="100%" border="0" cellpadding="0" cellspacing="0">
	  <tr> 
		<td height="3" colspan="4"></td> 
	  </tr> 
	  <tr> 
		<td width="15" height="238"><img src="/CoviWeb/common/images/groupware/spacer.gif" width="15" height="1" /></td> 
		<td width="100%" colspan="3" valign="top"> 
			<table width="99%" border="0" cellspacing="0" cellpadding="0"> 
				<tr class="titlebg"  > 
				<td width="100%" height="30" align="left" class="title"><img src="/CoviWeb/common/images/icon/icon_greensquare.gif" width="19" height="19" align="absmiddle"> 대결설정</td> 				
				</tr> 
				<tr> 
				<td colspan="2" align="center" valign="middle">
				    <table width="100%" height="3"  border="0" cellpadding="0" cellspacing="0"> 
					    <tr> 
						    <td width="20%" class="title_greenline"></td> 
						    <td width="80%" class="title_grayline"></td> 
					    </tr> 
					</table>
					</td> 
				</tr> 
				<tr> 
				    <td height="10" colspan="2"></td> 
				</tr> 
			</table>
		<table width="99%" border="0" cellspacing="0" cellpadding="0"> 
			<tr>
				<td width="100%">
					<table width="99%" border="0" cellspacing="0" cellpadding="2"> 
						<tr> 
							<td width="100%" height="3" align="center" valign="middle"  class="tab_line" colspan="4"></td> 
						</tr> 
						<tr> 
							<td width="14%" height="24" valign="middle" class="table_green" align="center"><%= Resources.Approval.lbl_username %></td> 
							<td height="24" colspan="3" valign="middle"><%=display_name%> / <%=jobtitle%> / <%=jobposition%></td> 
						</tr> 
						<tr> 
							<td colspan="4"  class="table_line"></td> 
						</tr> 
						<tr> 
							<td height="24" valign="middle" class="table_green" align="center"><%= Resources.Approval.lbl_BelongDept %></td> 
							<td height="24" colspan="3" valign="middle" > <%=unit_name%> </td> 
						</tr>
						<tr> 
							<td colspan="4"  class="table_line"></td> 
						</tr> 
						<tr> 
							<td height="24" valign="middle" class="table_green" align="center"><%= Resources.Approval.lbl_Email %></td> 
							<td height="24" colspan="3" valign="middle"><%=email%></td> 
						</tr> 
						<tr> 
							<td colspan="4"  class="table_line"></td> 
						</tr> 
						<tr> 
							<td height="24" valign="middle" class="table_green" align="center"><%= Resources.Approval.lbl_UseSubstitue %></td> 
							<td height="24" colspan="3" valign="middle">&nbsp;<input type="checkbox" name="deputy_usage" onClick="fndeputy_usage();">&nbsp;<SPAN id="spandeputy_usage">사용</SPAN></td> 
						</tr> 
						<tr> 
							<td colspan="4"  class="table_line"></td> 
						</tr> 
						<tr> 
							<td height="24" valign="middle" class="table_green" align="center"><%= Resources.Approval.lbl_SubstituePeriod %></td> 
							<td height="24" colspan="3" valign="middle">&nbsp;<input type="text" id="begin_date" name="begin_date" value="" size="12" class="input" /><img src="/CoviWeb/common/images/button/bt_date.gif" name="btnSdate" id="Img1" class="Out" align="absmiddle" border="0" onclick="MiniCal(begin_date,10,-45);" style="cursor:hand;">&nbsp;
								~ <input type="text" id="end_date" name="end_date" value="" size="12" class="input" /><img src="/CoviWeb/common/Images/button/bt_date.gif" name="btnSdate" id="Img2" class="Out" align="absmiddle" border="0" onclick="MiniCal(end_date,10,-45);" style="cursor:hand;">&nbsp;
							</td> 
						</tr> 
						<tr> 
							<td colspan="4"  class="table_line"></td> 
						</tr> 
						<tr> 
							<td height="24" valign="middle" class="table_green" align="center"><%= Resources.Approval.lbl_Delegator %></td> 
							<td height="24" colspan="3" valign="middle">
							    <table border="0" cellpadding="0" cellspacing="0">
							        <tr>
							            <td>
							                &nbsp;<input type="text" value="<%=reserved5%>" name="reserved5" readOnly  class="input" size="40"/>&nbsp;
							            </td>
							            <td>
				                            <table border="0" cellpadding="0" cellspacing="0" onclick="fnDeputy();" style="cursor:hand">
	                                            <tr align="center">
		                                            <td align="left"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_left.gif" alt=""/></td>
		                                            <td class="btn_bg"><%= Resources.Approval.btn_Appoint %></td>
		                                            <td align="right"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_right.gif" alt=""/></td>
		                                            <td>&nbsp;</td>
	                                            </tr>
                                            </table>
							            </td>
							            <td>
				                            <table border="0" cellpadding="0" cellspacing="0" onclick="fnDeputyDel();" style="cursor:hand">
	                                            <tr align="center">
		                                            <td align="left"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_left.gif" alt=""/></td>
		                                            <td class="btn_bg"><%= Resources.Approval.btn_delete %></td>
		                                            <td align="right"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_right.gif" alt=""/></td>
		                                            <td>&nbsp;</td>
	                                            </tr>
                                            </table>
							            </td>
							        </tr>
							    </table>
							    <input type="hidden" name="deputy" value="<%=deputy%>" />
							</td> 
						</tr> 
					</table> 
					</td>
				</tr>
			</table>
			<table width="99%"  border="0" cellspacing="0" cellpadding="0"> 
				<tr> 
				<td width="100%" height="3" align="center" valign="middle"  class="tab_line"></td> 
				</tr> 
			</table> 
			<table width="99%"  border="0" cellspacing="0" cellpadding="0"> 
				<tr> 
				<td height="40" align="center" class="listbg">
			        <table border="0" cellpadding="0" cellspacing="0" onclick="javascript:fnSave();" style="cursor:hand">
                        <tr align="center">
	                        <td align="left"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_left.gif" alt=""/></td>
	                        <td class="btn_bg"><%= Resources.Approval.btn_save %></td>
	                        <td align="right"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_right.gif" alt=""/></td>
	                        <td>&nbsp;</td>
                        </tr>
                    </table>
			        <!--<img src="/COVINet/images/button/btn_save.gif" width="52" height="21" style="CURSOR: hand" onclick="javascript:fnSave();" >->
				</td> 
				</tr> 
			</table>
		</td> 
	  </tr>
	</table> 
</FORM>
	<!-- 달력선택 div 시작 -->
	<div id="minical" OnClick="this.style.display='none';" oncontextmenu="return false" ondragstart="return false"
	onselectstart="return false" style="background : buttonface; margin: 5; margin-top: 2;border-top: 1 solid buttonhighlight;border-left: 1 solid buttonhighlight;border-right: 1 solid buttonshadow;border-bottom: 1 solid buttonshadow;width:155;display:none;position: absolute; z-index: 1"></div>
	<!-- 달력선택 div 종료 -->
</body>
</html>
