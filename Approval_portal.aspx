<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Approval_portal.aspx.cs" Inherits="Approval_Approval_portal" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<title>Approval Mail</title>
<script type="text/javascript" language="javascript" src="../common/script/COVIFlowNet/openWindow.js"></script>
<script type="text/javascript" language="javascript" src="../common/script/NameControl.js"></script>
<script type="text/javascript" language="javascript" src="../SiteReference/js/Utility.js"></script>
<script type="text/javascript" language="javascript">
    function openBetter(){
        CoviWindow("./Portal/Apvbetter.htm","Better",600,700,"resize");
    }
    function openOCS(){
        self.location.href = "im:<sip:justnow@covision.co.kr><sip:dry007@covision.co.kr>";
    }
    function openapvavi(gubun){
        var szURL=""
        switch(gubun){
            case "draft": szURL = "./Portal/Apvavi.htm";break;
        }
        if (szURL !=""){
            CoviWindow(szURL,"",600,560,"resize");
        }
    }
    function openApprovalDoc(gubun){
        var szURL = "";
        var szPIDC = "";
        switch (gubun){
            case "a": if (aPIDC != ""){szPIDC = aPIDC;} break;
            case "c": if (cPIDC != ""){szPIDC = cPIDC;} break;
        }
        if (szPIDC != ""){
			var aForm = szPIDC.split(";");
			var objXML =CreateXmlDocument();
			objXML.loadXML(aForm[0]);
			var pibd1 = aForm[0];
			var piid = aForm[1];
			var bstate = "";
			var fmid	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('id');
			var fmnm	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('name');
			var fmpf	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('prefix');
			var fmrv	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('revision');
			var scid	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('schemaid');
			var fiid	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('instanceid');
			var fmfn	= objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute('filename');
			var FormUrl = "http://" + document.location.host +"/CoviWeb/approval/forms/form.aspx"; 
            var szPIDC = FormUrl+ "?mode=COMPLETE" + "&piid=" + piid  + "&bstate=" + bstate+ "&fmid=" + fmid + "&fmnm=" + "&fmpf=" + fmpf + "&fmrv=" + fmrv + "&fiid=" + fiid+ "&scid=" + scid;
            CoviWindow(szPIDC,"",800,600,"resize");
            
        }
    }
    function openProfile(szPersonCode){
        CoviWindow("/CoviWeb/PortalService/OrgMap/OM_PersonDetail.aspx?PersonCode="+szPersonCode,"PersonDetail","510","450");
    }
</script>
</head>

<body leftmargin="0" rightmargin="0" topmargin="0">
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td class="n_appleft" >
	<!--검색시작-->
	<table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:none;">
      <tr>
        <td width="6"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/sear_left.gif" width="6" height="28" /></td>
        <td valign="middle" background="<%=Session["user_thema"] %>/Covi/Approval/app_portal/sear_bg.gif"><span style="padding-left:5px; padding-right:3px; color:#ffffff;"><%= Resources.Approval.lbl_Portal_Search_title %></span><!--결재문서 검색-->
        <!--  class="n_appbg"-->
				<select>
				<option selected><%= Resources.Approval.lbl_Portal_Serach_option01 %></option><!--문서제목-->
				</select>
				<input name="Input" type="text" style="background:url(<%=Session["user_thema"] %>/Covi/Approval/app_portal/input_bg02.gif) no-repeat 100% 1px; width:195px; height:20px; border:none;" /><a href="#">&nbsp;<img src="<%=Session["user_thema"] %>/Covi/common/search.gif" alt="" align="absmiddle" /></a></td>
        <td width="5"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/sear_right.gif" width="5" height="28" /></td>
      </tr>
    </table>
	<!-- 검색끝-->
	<!-- 공지사항 start-->
	<table border="0" cellpadding="0" cellspacing="0">
		<tr>
			<td class="abox_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox_left.gif" alt="" /></td>
			<td class="abox_north"></td>
			<td class="abox_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox_right.gif" alt="" /></td>
		</tr>
		<tr>
			<td class="abox_cw"></td>
			<td class="abox_cc">
			<!-- contents start-->
				<table border="0" cellpadding="0" cellspacing="0">
					<tr>
						<td class="abox_img"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/app_noti.gif" /></td>
					    <td>
							<ul><b><%=Resources.Approval.lbl_Portal_title001 %></b><!--1) 각종청구안내-->
								<li>- 전월 업무추진비청구는 금월 20일까지 기안지 양식을 사용<br />(결재라인 : 팀장 -->부장-->관리부 참조)</li></ul>
							<ul><b><%= Resources.Approval.lbl_Portal_title002 %></b><!--2) HelpDesk 활용-->
								<li>-의문점 및 개선사항은 HelpDesk를 이용해주세요.</li>
							</ul>
						</td>
					</tr>
				</table>
			<!-- contents end-->
			</td>
			<td class="abox_ce"></td>
		</tr>
		<tr>
			<td class="abox_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox_left_bot.gif" alt="" /></td>
			<td class="abox_south"></td>
			<td class="abox_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox_right_bot.gif" alt="" /></td>
		</tr>
	</table>
	<!-- 공지사항 end-->
	<!-- 결재 요약정보 start-->
	<table border="0" cellpadding="0" cellspacing="0">
		<tr>
			<td class="abox_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox_left.gif" alt="" /></td>
			<td class="abox_north"></td>
			<td class="abox_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox_right.gif" alt="" /></td>
		</tr>
		<tr>
			<td class="abox_cw"></td>
			<td class="abox_cc">
			<!-- contents start-->
				<table border="0" cellpadding="0" cellspacing="0">
					<tr>
						<td rowspan="2" class="abox_img"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/app_info.gif" /></td>
					    <td colspan="2">
							<ul><!--오늘 도착한 문서-->
								<li><b><%=Resources.Approval.lbl_Portal_title011 %> <font style="color:#ff4500;"> <%=todayCount%></font></b>&nbsp;<%= Resources.Approval.lbl_item %></li>
								<!--지연된 문서-->
								<li><b><%=Resources.Approval.lbl_Portal_title012 %> <font style="color:#ff4500;"> <%=relationCount%></font></b>&nbsp;<%= Resources.Approval.lbl_item %></li>
							</ul>
                        </td>
					</tr>
					<tr>
					  <td>
					    <ul><!--미결함 문서건수-->
							<li><b><%= Resources.Approval.lbl_Portal_title013 %> <font style="color:#ff4500;"><%=approvalCount%></font></b>&nbsp;<%= Resources.Approval.lbl_item %></li>
							<!--진행함 문서건수-->
							<li><b><%= Resources.Approval.lbl_Portal_title014 %> <font style="color:#ff4500;"><%=processCount%></font></b>&nbsp;<%= Resources.Approval.lbl_item %></li>
						</ul>
				      </td>
				      <td>
					    <ul><!--최근한달간 완료건수-->
							<li><b><%= Resources.Approval.lbl_Portal_title015 %> <font style="color:#ff4500;"><%=completeMCount%></font></b>&nbsp;<%= Resources.Approval.lbl_item %></li>
							<!--최근한달간 기안건수-->
							<li><b><%= Resources.Approval.lbl_Portal_title016 %> <font style="color:#ff4500;"><%=approcalMCount%></font></b>&nbsp;<%= Resources.Approval.lbl_item %></li>
						</ul>
					  </td>
				  </tr>
				</table>				
			<!-- contents end-->
			</td>
			<td class="abox_ce"></td>
		</tr>
		<tr>
			<td class="abox_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox_left_bot.gif" alt="" /></td>
			<td class="abox_south"></td>
			<td class="abox_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox_right_bot.gif" alt="" /></td>
		</tr>
	</table>
	<!-- 결재 요약정보 끝-->
	<!-- 기타정보 시작 -->
	<table width="100%" border="0" cellspacing="0" cellpadding="0" class="n_ptly" >
      <tr>
        <td class="n_phtitle"><%= Resources.Approval.lbl_Portal_title021 %></td><!--최근결재정보-->
        <td class="n_more"><img src="<%=Session["user_thema"] %>/Covi/main/more.png" width="15" height="13" /></td>
      </tr>
      <tr>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td colspan="2" class="n_tgab">
			<!-- 결재정보 시작 -->
            <%--<iframe id="app_partEtc" src="Approval_partEtc.aspx" frameborder="0" scrolling="no"></iframe>--%>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="t_gab" style="table-layout:fixed;">
                <tr>
                    <td class="n_pttd" width="140px"><strong><%= Resources.Approval.lbl_Portal_title022 %></strong></td>
                    <td onclick="javascript:openApprovalDoc('a');" width="70%" style="cursor:hand; overflow:hidden; text-overflow:ellipsis;"><%=aSubject%></td>
                    <td width="80px"><%=aWorkdate%></td>
                </tr>
                <tr>
                    <td class="n_pttd"><strong><%= Resources.Approval.lbl_Portal_title023 %></strong></td>
                    <td onclick="javascript:openApprovalDoc('c');" style="cursor:hand; overflow:hidden; text-overflow:ellipsis;"><%=cSubject%></td>
                    <td><%=cWorkdate%></td>
                </tr>
                <tr>
                    <td class="n_pttd"><strong><%= Resources.Approval.lbl_Portal_title024 %></strong></td>
                    <td colspan="2"><a href="javascript:openProfile('<%=RelApproverCode %>');" ><%=RelApproverName %></a></td>
                </tr>
            </table>
            <table width="100%"  border="0" cellpadding="0" cellspacing="0">
                <tr>
                    <td class="abox02_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox02_left.gif" alt="" /></td>
                    <td class="abox02_bg"></td>
                    <td class="abox02_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox02_right.gif" alt="" /></td>
                </tr>
                <tr>
                    <td class="abox02_bg02"></td>
                    <td class="abox02_cc">
                        <!-- contents start-->
                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td colspan="2" class="n_boxtop"><strong><%=thisYear%><%= Resources.Approval.lbl_Portal_title025 %></strong></td>
                            </tr>
                            <tr height="8px"><td></td><td></td></tr>
                            <tr>
                                <td style="padding-left:15px;"><b><%=lastForm1%> : <font style="color:#ff4500;"><%=formCount1%></font></b>&nbsp;<%= Resources.Approval.lbl_item %></td>
                                <td style="padding-left:15px;"><b><%=lastForm2%> : <font style="color:#ff4500;"><%=formCount2%></font></b>&nbsp;<%= Resources.Approval.lbl_item %></td>
                            </tr>
                            <tr height="5px"><td></td><td></td></tr>
                            <tr>
                                <td style="padding-left:15px;"><b><%=lastForm3%> : <font style="color:#ff4500;"><%=formCount3%></font></b>&nbsp;<%= Resources.Approval.lbl_item %></td>
                                <td style="padding-left:15px;"><b><%=lastForm4%> : <font style="color:#ff4500;"><%=formCount4%></font></b>&nbsp;<%= Resources.Approval.lbl_item %></td>
                            </tr>
                        </table>
                <!-- contents end-->
                    </td>
                    <td class="abox02_bg02"></td>
                </tr>
                <tr>
                    <td class="abox02_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox02_left_bot.gif" alt="" /></td>
                    <td class="abox02_bg"></td>
                    <td class="abox02_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox02_right_bot.gif" alt="" /></td>
                </tr>
            </table>
			<!-- 양식누적건수 끝-->
			<p class="p_gab"></p>
			<!-- 그래프 시작 -->
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td class="abox02_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox02_left.gif" alt="" /></td>
                <td class="abox02_bg"></td>
                <td class="abox02_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox02_right.gif" alt="" /></td>
              </tr>
              <tr>
                <td class="abox02_bg02"></td>
                <td class="abox02_cc">
				<!-- contents start-->
 					<iframe id="Graph" src="portal/Statistics_Unit_CountGraph.aspx" height="200px" width="100%" frameborder="0" scrolling="no"></iframe>
                  <!-- contents end-->
                </td>
                <td class="abox02_bg02"></td>
              </tr>
              <tr>
                <td class="abox02_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox02_left_bot.gif" alt="" /></td>
                <td class="abox02_bg"></td>
                <td class="abox02_size"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/abox02_right_bot.gif" alt="" /></td>
              </tr>
            </table>
			<p class="p_gab"></p>
			<!-- 그래프 끝-->
		 </td>
      </tr>
    </table>
	<!-- 결재 요약정보 end-->
	</td>
    <td class="n_appright">
	<!-- 도움말 시작-->
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
		  <tr>
			<td><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/app_helptitle.gif" alt="전자결재 도우미" onclick="javascript:openOCS();" style="cursor:hand;" /></td>
		  </tr>
		  <tr>
			<td class="app_help">
				<table border="0" cellpadding="0" cellspacing="0">
					<tr>
						<td class="app_list" style="cursor:hand;" onclick="javascript:openapvavi('draft');" ><b><%= Resources.Approval.lbl_DraftProcess %></b></td><!--기안하기-->
						<!--승인/반려하기-->
						<td class="app_list"><b><%= Resources.Approval.lbl_Portal_title031 %></b></td>
					</tr>
					<tr><!--문서함 관리하기-->
						<td class="app_list"><b><%= Resources.Approval.lbl_Portal_title032 %></b></td>
						<!--결재 현황보기-->
						<td class="app_list"><b><%= Resources.Approval.lbl_Portal_title033 %></b></td>
					</tr>
					<tr><!--개인결재선 관리-->
						<td class="app_list"><b><%= Resources.Approval.lbl_Portal_title034 %></b></td>
						<!--부서문서함 이용하기-->
						<td class="app_list"><b><%= Resources.Approval.lbl_Portal_title035 %></b></td>
					</tr>
				</table>
			    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="pgap02"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/app_t01.gif" alt="FAQ" /> &nbsp;&nbsp;   <img src='/GWImages/common/namecontrol_images/unknown.gif'  style='border-width:0px;' align="absmiddle"  covimode="imgctxmenu" onload="IMNRC('justnow@covision.co.kr', this);" id="ctl00_ContentPlaceHolder1_GridView1_ctl0_presence" />&nbsp; 전자결재담당자
                    </td>
                  </tr>
                  <tr>
                    <td class="n_pttd">자주 결재하는 사람들을 미리 지정하고 싶어요.</td>
                  </tr>
                  <tr>
                    <td class="n_pttd">대면결재가 필요한 경우 어떻게 해야 하나요?</td>
                  </tr>
                  <tr>
                    <td class="n_pttd">집에서도 전자결재를 할 수 있나요?</td>
                  </tr>
				  <tr>
                    <td class="n_pttd">기안한 전자결재문서를 회수하고 싶습니다.</td>
                  </tr>
                </table>
				<p><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/app_help.gif" alt="" onclick="javascript:openBetter();" style="cursor:hand;" /></p>
			</td>
		  </tr>
		</table>
		<!-- 도움말 끝-->	
		<!-- 나의 결재정보 시작-->
	    <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td width="5"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/n_info_left.gif" width="5" height="139" /></td>
            <td class="n_igboxbg_apv">
                <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="app_my"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/n_info_top.gif" width="100%" height="6" /></td>
                </tr>
                <tr>
                  <td class="n_infot_apv"><%= Resources.Approval.lbl_Portal_title041 %></td><!--최근 한달 간 나의 부서 결재정보-->
                </tr>
                <tr>
                  <td>
					  <table width="100%" border="0" cellspacing="0" cellpadding="0">
						  <tr><!--평균&nbsp;처리시간-->
							<td class="n_pttd03_apv"><strong><%= Resources.Approval.lbl_Portal_title042 %></strong>&nbsp;&nbsp;&nbsp;&nbsp;<b><font style="color:#ff4500;"><%=deptexec %></font></b>&nbsp;<%= Resources.Approval.lbl_Uinttime %></td><!--시간-->
						  </tr>
						  <tr><!--승인/반려건수 :-->
							<td class="n_pttd03_apv"><strong><%= Resources.Approval.lbl_Portal_title043 %></strong>&nbsp;&nbsp;&nbsp;&nbsp;<b><font style="color:#ff4500;"><%=deptapv%></font></b>&nbsp;<%= Resources.Approval.lbl_item %> / <b><font style="color:#ff4500;"><%=deptreturn%></font></b>&nbsp;<%= Resources.Approval.lbl_item %></td>
						  </tr>
						  <tr><!--최다&nbsp;사용양식 :-->
							<td class="n_pttd03_apv"><strong><%= Resources.Approval.lbl_Portal_title044 %></strong>&nbsp;&nbsp;&nbsp;&nbsp;<b><font style="color:#ff4500;"><%=deptform%></font></b></td>
						  </tr>
						  <tr><!--최다&nbsp;기안직원 :-->
							<td class="n_pttd03_apv"><strong><%= Resources.Approval.lbl_Portal_title045 %></strong>&nbsp;&nbsp;&nbsp;&nbsp;<b><font style="color:#ff4500;"><%=deptuser%></font></b></td>
						  </tr>
						  <tr><!--지연&nbsp;문서건수 :-->
							<td class="n_pttd03_apv"><strong><%= Resources.Approval.lbl_Portal_title046 %></strong>&nbsp;&nbsp;&nbsp;&nbsp;<b><font style="color:#ff4500;"><%=deptdelay%></font></b>&nbsp;<%= Resources.Approval.lbl_item %></td>
						  </tr>
					</table>
				  </td>
                </tr>
            </table></td>
            <td width="5"><img src="<%=Session["user_thema"] %>/Covi/Approval/app_portal/n_info_right.gif" width="5" height="139" /></td>
          </tr>
        </table>
		<!-- 나의 결재정보 끝-->
		<p class="p_gab"></p>
		<!-- 첨부파일 시작-->
		<div><iframe id="list" src="portal/FileList.aspx" width="100%" frameborder="0" scrolling="no"></iframe>  </div>
		<!-- 첨부파일 끝-->
	</td>
  </tr>
</table>
<script type="text/javascript" language="javascript">
    var aPIDC = '<%=aPIDC %>';
    var cPIDC = '<%=cPIDC %>';
</script>
<!--

个-->
</body>
</html>