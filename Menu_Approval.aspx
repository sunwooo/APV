<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Menu_Approval.aspx.cs" Inherits="COVINet.COVIFlowNet.Menu_Approval" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
	<head id="head1" runat="server">
		<title>전자결재</title>
		<!--<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />-->
        <!--<meta http-equiv="X-UA-Compatible" content="IE=10"/>-->
		<script type="text/javascript" language="javascript" src="../common/script/CFL.js"></script>
		<script type="text/javascript" language="javascript" src="common/function.js"></script>
		<style type="text/css" title="defaultStyle">
			html, body
			{
				height: 100%;
                                overflow:hidden;
			}
		</style>
	</head>
	<body >
		<form id="form1" runat="server"></form>
			<!--이준희(2010-09-09): Wrapped the main table widh DIV to support SharePoint environment.-->
			<div id="dvCEPSFlowMnuL" style="position: relative; margin: 0px; padding: 0px; text-align: left; vertical-align: top; width: 200px; display: block;height:100%;">
				<table border="0" cellpadding="0" cellspacing="0" style="width: 200px; height: 100%;">
					<!-- 타이틀 플래시 영역 시작 --> 
					<tr style="height: 70px;">
						<td>
							<div id="n_leftm">
								<div id="n_lefttop">
									<img src="<%=Session["user_thema"] %>/Covi/Approval/title_img_<%=strLangID.Substring(0,2)%>.gif" />
								</div>
							</div>
						</td>
					</tr>
					<!-- 타이틀 플래시 영역 끝 -->
					<tr style="height: 100%;">
						<td class="n_leftcnt" style="vertical-align: top; height: 100%; padding-left: 10px;">
							<div style="overflow-x: hidden; overflow-y: hidden; height: 98%; width: 98%;">
								<ul id="uCEPSFlowMnuL" class="m_list"><!--이준희(2010-10-14): Added an _id to support SharePoint environment.-->
							    <!-- 결재문서작성 시작
							    //이준희(2010-10-15): Added an ID to the below <LI> to support SharePoint environment.-->
							    <li id="liCEPSFORMLIST" class="line_bg">
									<table border="0" cellpadding="0" cellspacing="0" style="width:100%; padding-left:0;">
										<tr>
											<td>
												<a href="javascript: void(0);" onclick="gotoFolder('formlist/formlist.aspx', null, this); switchSubMenu('target_8');" COVIBuffer='' class="mmenu">
												<b>
													<asp:Label ID="lbl_write" runat="server"></asp:Label>
												</b>
												</a>
											</td>
											<td style="display:none"><img src="/GwImages/common/btn/btn_icon_down.gif" align="abmiddle" alt="" id="imgminifmmenu" onclick="fnMnuPRD(this);"/></td>
										</tr>
									</table>
									<div id="submenu" name="target_8"	style="display:none;height:0px;"></div>	
								</li>
								<!--개인문서함 시작
								//이준희(2010-10-15): Added an ID to the below <LI> to support SharePoint environment.	alert(this);-->
								<li id="liCEPSLIST" class="line_bg"><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=APPROVAL','미결함', this); switchSubMenu('target_1'); ChangType('menu_1_2')"; class="mmenu"><b><asp:Label ID="lbl_doc_person2" runat="server"></asp:Label></b>&nbsp;</a>
										<!-- 서브 메뉴 시작 -->
										<div id="submenu" name="target_1" style="display:block;">
										<ul class="s_list"	>
											<li id='menu_1_1'><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=PREAPPROVAL','예고함', this); ChangType('menu_1_1');" class="smenu"><asp:Label ID="lbl_doc_pre2" runat="server"></asp:Label>&nbsp;<span id="preapproval" ></span></a></li>
											<li id='menu_1_2'><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=APPROVAL','미결함', this); ChangType('menu_1_2');" class="smenu"><asp:Label ID="lbl_doc_approve2" runat="server"></asp:Label>&nbsp;<span id="approval" ></span></a></li>
											<li id='menu_1_3'><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=PROCESS','진행함', this); ChangType('menu_1_3');" class="smenu"><asp:Label ID="lbl_doc_process2" runat="server"></asp:Label>&nbsp;<span id="process" ></span></a></li>
                                            <li id='menu_1_11'><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=SHARE','참조함', this); ChangType('menu_1_11');" class="smenu"><asp:Label ID="lbl_doc_share2" runat="server"></asp:Label>&nbsp;<span id="share" ></span></a></li>
											<li id='menu_1_8'><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=TCINFO','배포수신함', this); ChangType('menu_1_8');" class="smenu"><asp:Label ID="lbl_doc_circulation" runat="server"></asp:Label><span id="circulation" ></span></a></li>
											<li id='menu_1_4'><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=COMPLETE&amp;barchived=true','완료함', this); ChangType('menu_1_4');" class="smenu"><asp:Label ID="lbl_doc_complete2" runat="server"></asp:Label></a></li>
											<li id='menu_1_5'><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=REJECT&amp;barchived=true','반려함', this); ChangType('menu_1_5');" class="smenu"><asp:Label ID="lbl_doc_reject2" runat="server"></asp:Label>&nbsp;<span id="REJECT" ></span></a></li>
                                            <li id='menu_1_10'><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=TCINFO','참조/회람함', this); ChangType('menu_1_3');" class="smenu"><asp:Label ID="lbl_doc_reference_circulation2" runat="server"></asp:Label>&nbsp;<span id="TCINFO" ></span></a></li> <!--참조/회람함 추가 (2013-01-30 HIW) -->
											<li id='menu_1_6'><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=TEMPSAVE','임시함', this); ChangType('menu_1_6');" class="smenu"><asp:Label ID="lbl_composing" runat="server"></asp:Label></a></li>
											<li id='menu_1_7'><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=CCINFO&amp;barchived=true','통보함', this); ChangType('menu_1_7');" class="smenu"><asp:Label ID="lbl_doc_reference2" runat="server"></asp:Label></a></li>
											<li id='menu_1_9' style="display:none;"><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=REVIEW1','공람함', this); ChangType('menu_1_9');" class="smenu"><asp:Label ID="lbl_doc_review" runat="server" /></a></li>
										</ul>
									</div><!-- 서브 메뉴 끝 -->
								</li>
								<!-- 개인문서함 끝 -->
								<!-- 개인문서함2 시작
								//이준희(2010-10-15): Added an ID to the below <LI> to support SharePoint environment.-->
								<li id="liCEPSLISTTODO" class="line_bg" style="display:;"><a href="javascript: void(0);" onclick="gotoFolder('listtodo.aspx?uid=' + uid + '&amp;location=TODO','진행함', this); switchSubMenu('target_7');ChangType('menu_1_2');" class="mmenu"><b><span><%=Resources.Approval.lbl_doc_person2%></span></b>&nbsp;</a>
									<!-- 서브 메뉴 시작 -->
									<div id="submenu" name="target_7" style="display:none;" >
									<ul class="s_list"	>
									    <li id='menu_11_1'><a href="javascript: void(0);" onclick="gotoFolder('listtodo.aspx?uid=' + uid + '&amp;location=TODO','진행함', this); ChangType('menu_1_1');" class="smenu"><asp:Label ID="lbl_doc_todo" runat="server"></asp:Label>&nbsp;<span id="todo"></span></a></li>
										<li id='menu_11_2'><a href="javascript: void(0);" onclick="gotoFolder('listtodo.aspx?uid=' + uid + '&amp;location=FINISH&amp;barchived=true','완료함', this); ChangType('menu_1_2');" class="smenu"><asp:Label ID="lbl_doc_finish" runat="server"></asp:Label>&nbsp;<span id="finish" ></span></a></li>
										<li id='menu_11_3'><a href="javascript: void(0);" onclick="gotoFolder('listtodo.aspx?uid=' + uid + '&amp;location=TCINFO','참조/회람함', this); ChangType('menu_1_3');" class="smenu"><asp:Label ID="lbl_doc_reference_circulation" runat="server"></asp:Label>&nbsp;<span id="TCINFO" ></span></a></li>
										<li id='menu_11_4'><a href="javascript: void(0);" onclick="gotoFolder('listtodo.aspx?uid=' + uid + '&amp;location=TEMPSAVE','임시함', this); ChangType('menu_1_3');" class="smenu"><asp:Label ID="lbl_composing2" runat="server"></asp:Label>&nbsp;<span id="TEMPSAVE"></span></a></li>
									</ul>
									</div>
								<!-- 서브 메뉴 끝 -->
								</li>
								<!-- 개인문서함2 끝 -->
							<!-- 부서문서함 시작
							//이준희(2010-10-15): Added an ID to the below <LI> to support SharePoint environment.-->
							<li id="liCEPSLISTDEPT" class="line_bg"><a href="javascript: void(0);" onclick="javascript: gotoFolder('listDept.aspx?uid=' + deptid + '_A' + '&amp;location=DEPART&amp;barchived=true','부서문서함', this); switchSubMenu('target_2'); ChangType('menu_4_1');" class="mmenu"><b><asp:Label ID="lbl_doc_deptcomplet" runat="server"></asp:Label></b></a>
									<!-- 서브 메뉴 시작 -->
									<div id="submenu" name="target_2"	style="display:block;">
									<ul class="s_list">
										<li id='menu_4_1'><a href="javascript: void(0);" onclick="gotoFolder('listDept.aspx?uid=' + deptid + '_A' + '&amp;location=DEPART&amp;barchived=true','부서함', this); ChangType('menu_4_1');" class="smenu"><asp:Label ID="lbl_doc_deptcomplet2" runat="server"></asp:Label></a></li>
										<li id='menu_4_2'><a href="javascript: void(0);" onclick="gotoFolder('listDept.aspx?uid=' + deptid + '_S' + '&amp;location=DEPART&amp;barchived=true','발신함', this); ChangType('menu_4_2');" class="smenu"><asp:Label ID="lbl_doc_sent" runat="server"></asp:Label></a></li>
										<li id='menu_4_3'><a href="javascript: void(0);" onclick="gotoFolder('listDept.aspx?uid=' + deptid + '_R' + '&amp;location=DEPART','수신함', this); ChangType('menu_4_3');" class="smenu"><asp:Label ID="lbl_doc_receive" runat="server"></asp:Label>&nbsp;<span id="spnReceiveCnt" ></span></a></li>
										<li id='menu_4_4'><a href="javascript: void(0);" onclick="gotoFolder('listDept.aspx?uid=' + deptid + '_RC' + '&amp;location=DEPART&amp;barchived=true','수신처리함', this); ChangType('menu_4_4');" class="smenu"><asp:Label ID="lbl_doc_receiveprocess" runat="server"></asp:Label></a></li>
										<li id='menu_4_5'><a href="javascript: void(0);" onclick="gotoFolder('listDept.aspx?uid=' + deptid + '_I' + '&amp;location=DEPART&amp;barchived=true','통보함', this); ChangType('menu_4_5');" class="smenu"><asp:Label ID="lbl_doc_reference3" runat="server"></asp:Label></a></li>
										<li id='menu_4_6'><a href="javascript: void(0);" onclick="gotoFolder('listDept.aspx?uid=' + deptid + '_D' +'&amp;location=DEPART','배포수신함', this); ChangType('menu_4_6');" class="smenu"><span><%=Resources.Approval.lbl_doc_circulation %></span></a></li>
										<li id="tdAuditOU" style="display:none;"><a href="javascript: void(0);" onclick="gotoFolder('listDept.aspx?uid=' + deptid + '_AD' + '&amp;location=DEPART','감사할문서함', this); ChangType('tdAuditOU');" class="smenu"><asp:Label ID="lbl_doc_auditou" runat="server"></asp:Label></a></li>			
									</ul>
									</div>
								<!-- 서브 메뉴 끝 -->
							</li>
							<!-- 부서문서함 끝 -->
							<!-- 부서문서함(폴더통합) 시작
							//이준희(2010-10-15): Added an ID to the below <LI> to support SharePoint environment.-->
							<li id="liCEPSLISTDEPTTODO" class="line_bg" style="display:;"><a href="javascript: void(0);" onclick="javascript: gotoFolder('listDepttodo.aspx?uid=' + deptid + '_SS' + '&amp;location=DEPART&amp;barchived=true','완료함', this);switchSubMenu('target_3');ChangType('menu_3_1');" class="mmenu"><b><span><%=Resources.Approval.lbl_doc_dept2 %></span></b></a>
									<!-- 서브 메뉴 시작 -->
									<div id="submenu" name="target_3"	style="display:none;">
									<ul class="s_list">										
										<li id='menu_3_1'><a href="javascript: void(0);" onclick="gotoFolder('listDepttodo.aspx?uid=' + deptid + '_SS' + '&amp;location=DEPART&amp;barchived=true','완료함', this); ChangType('menu_4_1');" class="smenu"><span><%=Resources.Approval.lbl_doc_complete3%></span></a></li>										
										<li id='menu_3_2'><a href="javascript: void(0);" onclick="gotoFolder('listDepttodo.aspx?uid=' + deptid + '_R' + '&amp;location=DEPART','수신함', this); ChangType('menu_4_2');" class="smenu"><span><%=Resources.Approval.lbl_doc_receive%></span></a></li>
										<li id='menu_3_3'><a href="javascript: void(0);" onclick="gotoFolder('listDepttodo.aspx?uid=' + deptid + '_D' +'&amp;location=DEPART','참조/회람함', this); ChangType('menu_4_3');" class="smenu"><span><%=Resources.Approval.lbl_doc_circulation%></span></a></li>
									</ul>
									</div>
								<!-- 서브 메뉴 끝 -->
							</li>
							<!-- 부서문서함(폴더통합) 끝 -->
								<!-- 담당업무함 시작 -->
								<li class="line_bg" id="trJF1">
									<table border="0" cellpadding="0" cellspacing="0" style="width:100%; padding-left:0;">
										<tr>
											<td>
												<a href="javascript: void(0);" onclick="switchSubMenu('target_5');" COVIBuffer='' class="mmenu">
												<b>
													<asp:Label ID="lbl_chargedoc" runat="server" Text="담당업무함" CssClass="leftSub"></asp:Label>
												</b>
												</a>
											</td>
											<td style="vertical-align:middle; display:none;">
												<span id="spanjfarchive"  style="display:none;"><input type="checkbox" id="chkjfarchive" name="chkjfarchive" /><%= Resources.Approval.lbl_doc_old %></span>
											</td>
										</tr>
									</table>								
									<!-- 서브 메뉴 시작 -->
									<div id="submenu" name="target_5"	style="display:none;">
										<ul class="s_list">				
											<%=GetAdditionalBoxes() %>
										</ul>
									</div>
									<!-- 서브 메뉴 끝 -->
								</li>
								<!-- 담당업무함 끝 -->
						 			
								<!-- 문서대장 시작
								//이준희(2010-10-15): Added an ID to the below <LI> to support SharePoint environment.-->
								<li id="liCEPSDOCLIST" class="line_bg" style="display:none;"><a href="javascript: void(0);" onclick="gotoFolder('Doclist/Doclist.aspx?tab=tab1','문서대장', this); switchSubMenu('target_4'); ChangType('menu_6_1');" class="mmenu"><b><asp:Label ID="lbl_doc_list" runat="server"></asp:Label></b>&nbsp;<%--<img src="<%=Session["user_thema"] %>/Covi/common/icon/plus.gif" align="abmiddle" alt="" />--%></a>
									<!-- 서브 메뉴 시작 -->
									<div id="submenu" name="target_4" style="display:none;">
									<ul class="s_list">
										<li id="menu_6_1"><a href="javascript: void(0);" onclick="gotoFolder('Doclist/Doclist.aspx?tab=tab1','<%= Resources.Approval.lbl_doc_reglist%>', this); ChangType('menu_6_1');" class="smenu"><%= Resources.Approval.lbl_doc_reglist%></a></li>
										<li id="menu_6_2"><a href="javascript: void(0);" onclick="gotoFolder('Doclist/Doclist.aspx?tab=tab2','<%= Resources.Approval.lbl_doc_recvlist%>', this); ChangType('menu_6_2');" class="smenu"><%= Resources.Approval.lbl_doc_recvlist%></a></li>
										<li id="menu_6_3"><a href="javascript: void(0);" onclick="gotoFolder('Doclist/Doclist.aspx?tab=tab3','<%= Resources.Approval.lbl_doc_sendlist%>', this); ChangType('menu_6_3');" class="smenu"><%= Resources.Approval.lbl_doc_sendlist%></a></li>
										<li id="menu_6_4"><a href="javascript: void(0);" onclick="gotoFolder('Doclist/Doclist.aspx?tab=tab4','<%= Resources.Approval.lbl_doc_reglist%>', this); ChangType('menu_6_4');" class="smenu"><%= Resources.Approval.lbl_doc_reglist%></a></li>	
										<li id="menu_6_5"><a href="javascript: void(0);" onclick="gotoFolder('Doclist/Doclist.aspx?tab=tab5','<%= Resources.Approval.lbl_doc_sendlist%>', this); ChangType('menu_6_5');" class="smenu"><%= Resources.Approval.lbl_doc_sendlist%></a></li>	
										<li id="menu_6_6"><a href="javascript: void(0);" onclick="gotoFolder('Doclist/Doclist.aspx?tab=tab6','<%= Resources.Approval.lbl_ApplicationRecvList%>', this); ChangType('menu_6_6');" class="smenu"><%= Resources.Approval.lbl_ApplicationRecvList%></a></li>
										<li id="menu_6_7"><a href="javascript: void(0);" onclick="gotoFolder('Doclist/Doclist.aspx?tab=tab7','<%= Resources.Approval.lbl_doc_sendlist%>', this); ChangType('menu_6_7');" class="smenu"><%= Resources.Approval.lbl_doc_sendlist%></a></li>
										<li id="menu_6_8"><a href="javascript: void(0);" onclick="gotoFolder('Doclist/Doclist.aspx?tab=tab8','<%= Resources.Approval.lbl_doc_notelist%>', this); ChangType('menu_6_8');" class="smenu"><%= Resources.Approval.lbl_doc_notelist%></a></li>	
										<li id="menu_6_9"><a href="javascript: void(0);" onclick="gotoFolder('Doclist/Doclist.aspx?tab=tab9','<%= Resources.Approval.lbl_doc_seallist%>', this); ChangType('menu_6_9');" class="smenu"><%= Resources.Approval.lbl_doc_seallist%></a></li>			 
										<li id="menu_6_10"><a href="javascript: void(0);" onclick="gotoFolder('Doclist/Doclist.aspx?tab=tab10','<%= Resources.Approval.lbl_doc_publicsendshare%>', this); ChangType('menu_6_10');" class="smenu"><%= Resources.Approval.lbl_doc_publicsendshare%></a></li>	
										<li id="menu_6_11"><a href="javascript: void(0);" onclick="gotoFolder('Doclist/Doclist.aspx?tab=tab11','<%= Resources.Approval.lbl_doc_licenceshare%>', this); ChangType('menu_6_11');" class="smenu"><%= Resources.Approval.lbl_doc_licenceshare%></a></li>			 
										<li id="menu_6_12"><a href="javascript: void(0);" onclick="gotoFolder('Doclist/Doclist.aspx?tab=tab12','발주/계약', this); ChangType('menu_6_12');" class="smenu">발주/계약</a></li>			 
									</ul>
									</div>
								<!-- 서브 메뉴 끝 -->
								</li>
								<!-- 문서대장 끝 -->
								<!-- 개인폴더 시작 -->
								<li id="liCEPSPFOLDER" style="display:none;"><a href="javascript: void(0);" onclick="gotoFolder('listFolder.aspx?uid='+uid+'&FOLDERMODE=I&location=UFOLDER','<%=Resources.Approval.lbl_userdefinedfolder%>', this); switchSubMenu('target_9'); " class="mmenu"><b><span><%=Resources.Approval.lbl_userdefinedfolder%></span></b></a>
									<div id="submenu" name="target_9"	style="display:none;height:100px; overflow:auto;">
										<ul class="s_list">
											<%=GetUserDefinedFolders()%>
										</ul>
									</div>
								</li>
								<!-- 개인폴더 끝 -->
								<!-- 부서폴더 시작 -->
								<li id="liCEPSDFOLDER" style="display:none;"><a href="javascript: void(0);" onclick="gotoFolder('listFolder.aspx?uid='+deptid+'&FOLDERMODE=I&location=UFOLDER','<%=Resources.Approval.lbl_deptfolder%>', this); switchSubMenu('target_10'); " class="mmenu"><b><span><%=Resources.Approval.lbl_deptfolder%></span></b></a>
									<div id="submenu" name="target_10"	style="display:none;height:100px; overflow:auto;">
										<ul class="s_list">
											<%=GetUnitDefinedFolders()%>
										</ul>
									</div>
								</li>
								<!-- 부서폴더 끝 -->
								
								<!-- Store DB 시작(이관문서 보관함, 본사) // 보관함(신세계) -->                             
                                <li id="liCEPSLISTMIGRATION"  class="line_bg" ><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=COMPLETE&amp;bstored=true','완료함');switchSubMenu('target_11');ChangType('menu_8_1');" class="mmenu"><b><span><%= Resources.Approval.lbl_old_doc%></span></b></a>
                                    <div id="submenu" name="target_11" style="display:none;">
                                    <ul class="s_list">
                                    <!-- 서브 메뉴 시작 -->
                                        <li id="menu_8_1"><a href="javascript: void(0);" onclick="gotoFolder('list.aspx?uid=' + uid + '&amp;location=COMPLETE&amp;bstored=true','완료함'); ChangType('menu_8_1');" class="smenu"><%= Resources.Approval.lbl_doc_person2%></a></li>
                                        <span id="spnStoredDeptBox"><li id="menu_8_2"><a href="javascript: void(0);" onclick="gotoFolder('listDept.aspx?uid=' + deptid + '_A' + '&amp;location=DEPART&amp;bstored=true','부서문서함'); ChangType('menu_8_2');" class="smenu"><%= Resources.Approval.lbl_doc_dept2%></a></li></span>
                                        <!-- 서브 메뉴 끝 -->
                                    </ul>
                                    </div>                                                                
                                </li>
                                <!-- Store DB 끝 -->

								<!-- 결재 확인함 시작 -->
								<% if (bMonitor == true)
									 { %>
								<li class="line_bg"><a href="javascript: void(0);" onclick="gotoFolder('listAudit.aspx', null, this); switchSubMenu('target_12');ChangType('menu_12_1');" class="mmenu"><b><asp:Label ID="lbl_monitor" runat="server" Text="결재확인함"></asp:Label></b></a>
								<div id="submenu" name="target_12"	style="display:none;">
									<ul class="s_list">
										<li id="menu_12_1"><a href="javascript: void(0);" onclick="gotoFolder('listAudit.aspx', null, this); ChangType('menu_12_1');" class="smenu"><%= Resources.Approval.lbl_monitor %></a></li>
										<li id="menu_12_2"><a href="javascript: void(0);" onclick="gotoFolder('listDeptAudit.aspx', null, this); ChangType('menu_12_2');" class="smenu"><%= Resources.Approval.lbl_monitor %></a></li>
									</ul>								
								</div>
								</li>
								<% } %>							
								<!-- 결재 확인함 끝-->
								<!-- 겸직자 부서변경 시작 -->
								<% if (System.Convert.ToInt32(Session["user_additionaljob_no"].ToString()) == -100)
								{ %>
								<li class="line_bg"><a href="javascript:onclick=changeApvDept();switchSubMenu();" class="mmenu"><b><asp:Label ID="lbl_deptchange" runat="server"></asp:Label></b></a>
								</li>
								<% } %>
								<!-- 겸직자 부서변경 끝 -->
								<!-- 전자결재 환경설정 시작
								//이준희(2010-10-15): Added an ID to the below <LI> to support SharePoint environment.-->
								<li id="liCEPSOM_RIGHTAPPROVALCONFIG" class="line_bg"><a href="javascript: void(0);" onclick="gotoFolder('/CoviWeb/PortalService/OrgMap/OM_RightApprovalConfig.aspx', null, this); switchSubMenu('target_6'); ChangType('menu_7_1');" class="mmenu"><b><span><%= Resources.Approval.lbl_ApprovalbaseInfo%></span></b></a>
									<div id="submenu" name="target_6" style="display:none;">
									<ul class="s_list">
										<li id="menu_7_1"><a href="javascript: void(0);" onclick="gotoFolder('/CoviWeb/PortalService/OrgMap/OM_RightApprovalConfig.aspx', null, this); ChangType('menu_7_1');" class="smenu"><%= Resources.Approval.lbl_ApprovalbaseInfo%></a></li>
										<li id="menu_7_2"><a href="javascript: void(0);" onclick="gotoFolder('ApvLinelist/Apvlinelist.aspx', null, this); ChangType('menu_7_2');" class="smenu"><asp:Label ID="lbl_doc_privateapv" runat="server"></asp:Label></a></li>
										<li id="menu_7_3" style="display:none;"><a href="javascript: void(0);" onclick="gotoFolder('CirculationlineList/CirculationlineList.aspx', null, this); ChangType('menu_7_3');" class="smenu"><asp:Label ID="lbl_Circulationline_setup" runat="server"></asp:Label></a></li>
										<li id="menu_7_4" style="display:"><a href="javascript: void(0);" onclick="gotoFolder('DeployList/DeploylineList.aspx', null, this); ChangType('menu_7_4');" class="smenu"><span><%= Resources.Approval.lbl_doc_deploy_setting%></span></a></li> <!--배포그룹설정-->
										<li id="menu_7_5" style="display:none;"><a href="javascript: void(0);" onclick="gotoFolder('/CoviWeb/Admin/Approval_Admin/JFMgr/JFMemberList.aspx?jfid=3&jfcode=Receptionist&jfname=문서관리자&ismanager=true&callpage=user', null, this); ChangType('menu_7_5');" class="smenu"><span><%= Resources.Approval.lbl_doc_manager%></span></a></li>
									</ul>
									</div>								
								</li>
								<!-- 전자결재 환경설정 끝 -->
								<!-- 201107 공문게시 시작 -->
								<li id="liCEPSLISTBOARDJOBFUNCTION" class="line_bg" style="display:none;"><a href="javascript:gotoFolder('listJF.aspx?uid=APVBOARD_COMPLETE&amp;location=JOBFUNCTION', '공문게시', this);switchSubMenu('target_13');" class="mmenu"><b>공문게시</b></a>
								<div id="submenu" name="target_13"	style="display:none;height:0px;"></div>	
								</li>		
								<li id="li1" class="line_bg" style="display:none;"><a href="javascript: void(0);" onclick="gotoFolder('/coviweb/approval/default.aspx?location=DOCBOX', null, this); " class="mmenu"><b><span><%= Resources.Approval.lbl_doc_folder%></span></b></a>
								</li>						
								<!-- 201107 공문게시 끝   -->
							 </ul>
					</div>
				</td>	
			</tr> 
			<tr style="height:11px">
				<td>
					<div id="n_leftfoot" style="position:relative;margin-top:-1px;"></div>	
				</td>
			</tr>
			<!-- hot key 시작 -->
			<tr>
				<td>
					<div id="minifmmenu" onclick="this.style.display='none';" oncontextmenu="return false" ondragstart="return false"
					onselectstart="return false"	onmouseout="this.style.display='none';"
					class="Css_Table1" style="background-image: url(<%=Session["user_thema"] %>/Covi/Common/icon/cont_back.gif); background-repeat: repeat-y; ; margin: 0; margin-top: 0;border-top: 1 solid buttonhighlight;border-left: 1 solid buttonhighlight;border-right: 1 solid buttonshadow;border-bottom: 1 solid buttonshadow;width:160px;height:160px;display:none;position: absolute; z-index: 99;overflow: hidden;">
						<iframe id="frmminimenu" src="/CoviWeb/Approval/Forms/FormMenu_Mini.aspx" scrolling="no" frameborder="0" style="background : #eff2f7; margin: 0; margin-top: 0;border-top: 0 solid buttonhighlight;border-left: 0 solid buttonhighlight;border-right: 0 solid buttonshadow;border-bottom: 0 solid buttonshadow;width:160;position: absolute; z-index: 100"></iframe>
					</div>
				</td>
			</tr>
			<!-- hot key 종료 -->	
			<!-- 타양식 내용복사 -->
			<tr>
				<td>
					<div id="divTempSave" style="display:none;">
						<input type="hidden" id="dTempDiffSave"/>
						<input type="hidden" id="cTempDiffSave" />
						<input type="hidden" id="mTempDiffSave" />
						<input type="hidden" id="tTempDiffSave" />
					</div>
				</td>
			</tr>
		</table>
		</div><!--이준희(2010-10-28): -->
        <%--2014-06-11 hyh 추가--%>
        <input type="hidden" id="txt_temp" value="1" />
        <%--2014-06-11 hyh 추가 끝--%>
	<script type="text/javascript">	
	//	try
	//	{
	//		var oTmp = null;
	//		var iTmp = 0;
	//		//oTmp = this.frames['bodyFrame'].frames['leftFrame'].document.body;
	//		oTmp = this.document.body;//debugger;
	//		//if(oTmp.offsetHeight > this.frames['bodyFrame'].frames['leftFrame'].frameElement.offsetHeight)
	//		if(oTmp.offsetHeight > top.frames['bodyFrame'].frames['leftFrame'].frameElement.offsetHeight)
	//		{//좌측 프레임 내에 종 스크롤바가 발생했을 경우
	//			//debugger;//dvLFROutmost
	//			iTmp = parseInt(dvLFROutmost.style.paddingLeft) - 10;
	//			//dvLFROutmost.style.paddingLeft = iTmp.toString() + 'px';
	//		}
	//	}
	//	catch(e)
	//	{
	//	}
	//	function window.onresize()
	//	{
	//		 try{top.fnWResize();}catch(e){}
	//	}
var uid="<%= Session["user_code"] %>";
var deptid="<%= Session["user_dept_code"] %>"; 
var parentdeptid="<%= Session["user_parent_dept_code"]%>";
var refresh	= "<%=sRefresh%>";
var bAuditDept = "<%=bAuditDept%>";
var gPersonCode = "<%= gPersonCode %>";

//부서품의함존재여부 
if( deptid != parentdeptid) deptid=parentdeptid;		 
				
var g_winDocAll = window.document.all;
var bReceptionist = "<%= bReceptionist%>";
var bMonitor = "<%=bMonitor %>";
//var	m_xmlHTTP = CreateXmlHttpRequest();

var ijfcnt = "<%=strJFCount %>";
var strPersonListValue =	"<%=strPersonListValue %>";
var strDocListValue = "<%=strDocListValue %>";
var strDeptListValue = "<%=strDeptListValue %>";
var strMenuListValue = "<%=strMenuListValue %>";//2011-04-11
var a,ua = navigator.userAgent;
this.agent= { 
	safari	: ((a=ua.split('AppleWebKit/')[1])?(a.split('(')[0]).split('.')[0]:0)>=412 ,
	konqueror : ((a=ua.split('Konqueror/')[1])?a.split(';')[0]:0)>=3.4 ,
	mozes	 : ((a=ua.split('Gecko/')[1])?a.split(" ")[0]:0) >= 20011128 ,
	opera	 : (!!window.opera) && (document.body.style.opacity=="") ,
	msie		: (!!window.ActiveXObject)?(!!(new ActiveXObject("Microsoft.XMLHTTP"))):false 
} //safari, konqueror, opera url 한글 인코딩 처리를 위해추가
var btoUtf = ((this.agent.safari || this.agent.konqueror || this.agent.opera)?false:true);

	
window.onload= initOnload;
function initOnload()
{//alert(346);
	var sTmp = '';
	sTmp = "target_<%=strMenu %>";
	//switchSubMenu(sTmp);//alert(sTmp);//Expand or collapse the level 2 left menus.
	/*
	개인문서함	target_1
	부서문서함	
	결재문서작성	
	문서대장	
	환경설정	*/
	ChangType("<%=strSubMenu %>");
	setDisplayMenu_Approval();
	if(refresh == ""){
		if ('<%=Request.QueryString["mType"]%>' == "1") {
			gotoFolder('list.aspx?uid=' + uid + '&location=COMPLETE', null, null);
		}else if ('<%=Request.QueryString["mType"]%>' == "search") {
			gotoFolder('ApvMonitor/ApvMonitoring.aspx', null, null);
		}else if ('<%=Request.QueryString["mType"]%>' == "sitemap") {
			gotoFolder('<%=Request.QueryString["mURL"]%>', null, null);
		}else if ('<%=Request.QueryString["mType"]%>' == "portal") {
		}else {
			//gotoFolder('approval_home.aspx');
			//gotoFolder('list.aspx?uid=' + uid + '&location=APPROVAL');
		}
        getApprovalCount();
    }
	//담당업무함 설정
	if ( ijfcnt != "0"){
		document.getElementById('trJF1').style.display = "block";
	}else{
		document.getElementById('trJF1').style.display = "none";
	}
	
	//감사할문서함 메뉴 활성화 : 특정 부서의 문서수발자만 해당됨
	if(bAuditDept == "True"){ 
		document.getElementById('tdAuditOU').style.display="block";
	}else{
		document.getElementById('tdAuditOU').style.display="none";
	}
    
    //2013-02-21 HIW
    if(gPersonCode == "PRESIDENTC9501") { //그룹회장 
        document.getElementById("liCEPSFORMLIST").style.display = "none";  //결재문서작성  
        document.getElementById("liCEPSLISTDEPT").style.display = "none";  //부서문서함
        document.getElementById("spnStoredDeptBox").style.display = "none";  //이관문서함 > 부서문서함
    }
    if(gPersonCode == "ISU_ST12009") { //화학 감사 계정 숨김처리 
        document.getElementById("liCEPSFORMLIST").style.display = "none";  //결재문서작성
        document.getElementById("liCEPSLIST").style.display= "none";       //개인문서함
        document.getElementById("liCEPSOM_RIGHTAPPROVALCONFIG").style.display= "none";    //전자결재 환경설정
        //document.getElementById("liCEPSLISTDEPT").style.display = "none";  //부서문서함
        //document.getElementById("spnStoredDeptBox").style.display = "none";  //이관문서함 > 부서문서함
    }

	return true;
}

function switchSubMenu(targetName)
{//alert(388);//Collapse or expand the left submenus.
	{//이준희(2010-10-14): Added to support SharePoint environment.
	var iW = 0;
	var dv = null, rect = null;
	try
	{
		dv = document.getElementById('dvCEPSFlowMnuL');//alert(dv.lang);//if(window.sessionStorage.getItem('CEPSMnuL') == 'RST' && document.getElementById('dvCEPSFlowMnuL').innerHTML.length > 16)//if(dv.lang == '' && 1 == 1)
		if('<%=Session["CEPS"]%>' == 'true')
		{//In SharePoint,
			if(dv.lang == '')//if(dv.lang == null)
			{//alert(396);
				dv.lang = 'CPL';
				return;
			}
			else
			{
				if(dv.lang == 'RST')
				{//alert(392);//window.sessionStorage.setItem('CEPSMnuL', '');
					dv.lang = 'PAS';//rect = document.getElementById('dvCEPSFlowMnuL').getBoundingClientRect();//rect = dv.getBoundingClientRect();
					return;
				}
			}
		}
	}
	catch(e)
	{
	}
	}
	try 
	{//alert(414);
		var divtag = null;//divtag = document.getElementsByTagName('div');//alert(divtag.length);
		divtag = document.getElementById('dvCEPSFlowMnuL').getElementsByTagName('div');
		for (var i = 0; i < divtag.length; i++)
		{
			if(divtag[i].id == 'submenu')
			{
				if(divtag[i].getAttribute("name") == targetName)
				{//'target_1,' for example
					if(navigator.appName.indexOf("Netscape")!=-1)
					{
						(divtag[i].style.display == 'block') ? divtag[i].style.display = 'none' : divtag[i].style.display = 'block';
						divtag[i].parentNode.className = "line_bg current";
					}
					else
					{
						if(divtag[i].style.display == "block")
						{//debugger;//alert(divtag[i].style.display);
							divtag[i].style.display = "none"
						}
						else
						{//alert(409);
							divtag[i].style.display = "block";
						}
						divtag[i].parentElement.className = "line_bg current";
					}
				}
				else
				{
                /* 이벤트 주지 않은 것은 변경되지 않도록 함.
					if(navigator.appName.indexOf("Netscape") != -1)
					{
						divtag[i].style.display = 'none';
						divtag[i].parentNode.className = "line_bg"; 
					}
					else
					{//alert(divtag[i].innerText);
						divtag[i].style.display = 'none';
						divtag[i].parentElement.className = "line_bg";
					}
                */
				}
			}	
		}
		/*이준희(2010-10-04): Commented out the unncesary non-standard phrase below.
		if(window.ActiveXObject){
			imgminifmmenu.src = "<%=Session["user_thema"] %>/COVI/common/btn/btn_icon_down.gif";
			minifmmenu.style.display = "none";
		}else*/
		{
			document.getElementById('imgminifmmenu').src = "<%=Session["user_thema"] %>/COVI/common/btn/btn_icon_down.gif";
			document.getElementById('minifmmenu').style.display = "none";
		}
	}
	catch (e) 
	{
		alert("switchSubMenu(targetName) error: " + e.description + "\r\nError number: " + e.number);
	}
}
var preItem;

function ChangType(currItem)
{//Inverts the current left subment.
	var dv = null;
	{//이준희(2010-10-14): Added to support SharePoint environment.
	try
	{
		dv = document.getElementById('dvCEPSFlowMnuL');
		//if(dv.lang == null || dv.lang == '' || dv.lang == 'PAS')//if(dv.lang == 'PAS' || dv.lang == 'RST')//if(window.sessionStorage.getItem('CEPSMnuL') == 'RST' && document.getElementById('dvCEPSFlowMnuL').innerHTML.length > 16)
		{//alert(467);
		}
		if(dv.lang == 'RST' || dv.lang == 'PAS')//else
		{
			dv.lang = 'CPL';//dv.lang = '';//window.sessionStorage.setItem('CEPSMnuL', '');//alert(469);
			return;
		}
	}
	catch(e)
	{
	}
	}
	if (currItem !=""){
		var sTmp = '';
		var oLi;//CSS가 잘 적용되지 않아 강제적으로 변경함. 2007.12.11 김영종
		if(preItem != null) {
			oLi = document.getElementById(preItem);
			if(oLi != null) oLi.className="";
		}
		if(currItem != null)
		{
			oLi = document.getElementById(currItem);
			if(oLi != null)
			{//alert(475);
				oLi.className = "current";//alert(476);
			}
		}
		preItem = currItem;
	}
}

function setDisplayMenu_Approval(){
    //왼쪽메뉴활성화- 전자결재 왼쪽메뉴사용여부 개인함:개인통합함:부서함:부서통합함:이관문서함
    var aApprovalMenu = strMenuListValue.split(":");
	for(var k=0;k<aApprovalMenu.length;k++)
	{	
		switch (String(k)){
		 case "0": document.getElementById("liCEPSLIST").style.display = (aApprovalMenu[k]=="1"? "":"none");break;
		 case "1": document.getElementById("liCEPSLISTTODO").style.display = (aApprovalMenu[k]=="1"? "":"none");break;
		 case "2": document.getElementById("liCEPSLISTDEPT").style.display = (aApprovalMenu[k]=="1"? "":"none");break;
		 case "3": document.getElementById("liCEPSLISTDEPTTODO").style.display = (aApprovalMenu[k]=="1"? "":"none");break;
		 case "4": 
		    //document.getElementById("liCEPSLISTMIGRATION").style.display = (aApprovalMenu[k]=="1"? "":"none");
		    document.getElementById("spanjfarchive").style.display = (aApprovalMenu[k]=="1"? "":"none");
		    break;
		}
	}
	//개인문서함
	var aMenuPerson = strPersonListValue.split(":");	
	for(var j=1;j<aMenuPerson.length;j++)
	{	
		if(aMenuPerson[j]=="1")	 eval(document.getElementById("menu_1_"+j)).style.display = "block";
		else eval(document.getElementById("menu_1_"+j)).style.display = "none";
	}
	//부서문서함
	var aDeptMenu = strDeptListValue.split(":");
	for(var k=1; k < aDeptMenu.length-1 ; k++){
		if(aDeptMenu[k]=="1")	 eval(document.getElementById("menu_4_"+k)).style.display = "block";
		else eval(document.getElementById("menu_4_"+k)).style.display = "none";
	}
	
	//문서대장		
	var aMenuDoc = strDocListValue.split(":");	
	for(var j=1;j<aMenuDoc.length;j++)
	{	
		if(aMenuDoc[j]=="1")	 eval(document.getElementById("menu_6_"+j)).style.display = "block";
		else eval(document.getElementById("menu_6_"+j)).style.display = "none";
	}
}

//function gotoFolder(strFolderURL, strFolderName)
function gotoFolder(strFolderURL, strFolderName, lnk)
{//이준희(2010-10-29): Added <lnk> argument to support SharePoint environment.
	try
	{	
	    //2011-04-11 보관함코딩
	    if(strFolderURL.indexOf("JOBFUNCTION") > -1 && document.getElementById("chkjfarchive").checked == true)  strFolderURL = strFolderURL + 	"&bstored=true";
		if(strFolderName != undefined)
		{
			parent.rightFrame.document.location = strFolderURL+"&location_name="+ ((btoUtf)?escape(strFolderName):strFolderName);
			//getApprovalCount();	
		}else if(strFolderURL.indexOf("DOCBOX") > -1){
			parent.document.location = strFolderURL;	
		}else{
			parent.rightFrame.document.location = strFolderURL;	
		}
	}
	catch(e)
	{
		alert(e.message);
	}//return true;
	{//이준희(2010-10-29): Added to support SharePoint environment.
	try
	{//debugger;//alert(lnk);
		if('<%=Session["CEPS"]%>' == 'true')
		{//alert(fnCEPSInnerText(lnk));
			window.sessionStorage.setItem('CEPSTit', fnCEPSInnerText(lnk));
		}
	}
	catch(e)
	{
	}
	}
}
//2014-06-11 hyh 추가
var tt;
var flag = false;
function getApprovalCountDraft()
{
    document.getElementById("txt_temp").value = 1;
    flag = true;
    t = setInterval("getApprovalCount()",1000);
}
//2014-06-11 hyh 추가 끝
function getApprovalCount()
{//alert(524);//$$
	/* parameter type 숫자값
	Data.SqlDbType.NChar : 10
	Data.SqlDbType.NText :11
	Data.SqlDbType.VarChar : 12
	Data.SqlDbType.Char : 3
	Data.SqlDbType.VarChar : 22
	Data.SqlDbType.Int : 8
	Data.SqlDbType.DateTime : 4
	*/
	//debugger;

    //2014-06-11 hyh 추가
    if(flag == true)
    {//alert(document.getElementById("txt_temp").value);
        document.getElementById("txt_temp").value = document.getElementById("txt_temp").value*1 + 1;
        if(document.getElementById("txt_temp").value == 20) {
            document.getElementById("txt_temp").value = 1;
            clearInterval(t);  // --- (2) 타이머 중단
            flag = false;
        }
        
    }
    //2014-06-11 hyh 추가 끝

	var pXML = "dbo.usp_wf_approvalcount";
	var aXML = "<param><name>USER_ID</name><type>VarChar</type><length>100</length><value><![CDATA["+uid+"]]></value></param>";
    aXML += "<param><name>UNIT_CODE</name><type>VarChar</type><length>100</length><value><![CDATA["+deptid+"]]></value></param>";  //겸직처리위해 세션부서코드값 추가 (2013-03-12 HIW)
	var sXML = "<Items><connectionname>INST_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
	var szURL = "getXMLQuery.aspx";
	requestHTTPMenu_Approval("POST",szURL,true,"text/xml",receiveHTTPMenu_Approval, sXML);
}

function event_noop(){return;}
function requestHTTPMenu_Approval(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	m_xmlHTTP.open(sMethod,sUrl,bAsync);
	//m_xmlHTTP.setRequestHeader("Accept-Language","ko");
	m_xmlHTTP.setRequestHeader("Content-type", sCType);
	if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
	
}
function receiveHTTPMenu_Approval()
{
	var sTmp = '';
	var ele = null;
	if(m_xmlHTTP.readyState != 4)
	{
		return;
	}
	m_xmlHTTP.onreadystatechange=event_noop;
	var xmlReturn=m_xmlHTTP.responseXML;

	if(xmlReturn.xml==""){
		//alert(m_xmlHTTP.responseText);
	}else{
		var errorNode=xmlReturn.selectSingleNode("response/error");
		if(errorNode!=null){
			alert("Desc: " + errorNode.text);
		}
		else
		{
			sTmp = xmlReturn.selectSingleNode("response/NewDataSet/Table/APPROVAL").text;//debugger;//alert(sTmp);
            document.getElementById('preapproval').innerHTML = '[<font color=red>' + xmlReturn.selectSingleNode("response/NewDataSet/Table/PREAPPROVAL").text + '</font>]';  //예고함 
			document.getElementById('approval').innerHTML = '[<font color=red>' + sTmp + '</font>]';//Add the counter.
			document.getElementById("process").innerHTML =	'[<font color=red>' +xmlReturn.selectSingleNode("response/NewDataSet/Table/PROCESS").text + '</font>]';
			document.getElementById("circulation").innerHTML =	'[<font color=red>' +xmlReturn.selectSingleNode("response/NewDataSet/Table/CIRCULATION").text + '</font>]';
			document.getElementById('todo').innerHTML = '[<font color=red>' + sTmp + '</font>]';//Add the counter.
			document.getElementById("TCINFO").innerHTML =	'[<font color=red>' +xmlReturn.selectSingleNode("response/NewDataSet/Table/CIRCULATION").text + '</font>]';  
            document.getElementById("REJECT").innerHTML =	'[<font color=red>' +xmlReturn.selectSingleNode("response/NewDataSet/Table/REJECT").text + '</font>]';  //반려갯수 (2013-01-30 HIW)
			//receive.innerHTML =	'[ <font color=red>' + xmlReturn.selectSingleNode("response/NewDataSet/Table/RECEIVE").text + '</font> ]';		
            document.getElementById("spnReceiveCnt").innerHTML =	'[<font color=red>' + xmlReturn.selectSingleNode("response/NewDataSet/Table/RECEIVE").text + '</font>]';	//부서문서함(수신함갯수)	HIW
			/*
			//preapproval.innerText = xmlReturn.selectSingleNode("response/NewDataSet/Table/PREAPPROVAL").text;
			//deptapproval.innerText = xmlReturn.selectSingleNode("response/deptapproval").text;				
			//circulation.innerText = xmlReturn.selectSingleNode("response/NewDataSet/Table/CIRCULATION").text;				
			//circulation.innerHTML = ' <font color=red style="font-weight: bold">[ ' +xmlReturn.selectSingleNode("response/circulation").text + ' ]</font></a>';
			*/
            document.getElementById("share").innerHTML =	'[<font color=red>' + xmlReturn.selectSingleNode("response/NewDataSet/Table/SHARE").text + '</font>]';	//참조함
		}
	}
}

function changeApvDept(){
	var x = window.screen.width	/ 2 - 345/2;
	var y = window.screen.height / 2 - 315/2;

	var etcParam = "dialogLeft:" + x + ";dialogTop:" + y + ";dialogWidth:345px;dialogHeight:340px;help:no;status:no;scroll:No;";

	var retValue = showModalDialog("/CoviWeb/PortalService/Session/DeptChange.aspx",'',etcParam);
	//var retValue = showModalDialog("DeptChange.aspx",'','menubar=0,resizable=0,scrollbars=0,width=330,height=180,left=230,top=240');
	if (retValue != null) {
		//spnUserDept.innerText = retValue;			
		window.parent.location.reload();
		try{
			//parent.parent.mainFrame.spnPerInfo.innerHTML = " " + retValue + " [<a href='/COVINet/COVIServiceNet/PersonInfo/PersonInfo.htm' target='sub_main'> " + "<%= Session["user_name"] %>" + " 님 </a>] " ;				
			parent.parent.mainFrame.setPerInfo();
		}catch(e){
		}
	}
}
function toUTF8(szInput){
	var wch,x,uch="",szRet="";
	if(btoUtf){
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
	}else{
		szRet = szInput;
	}
	return(szRet);
}

function displayminimenu(obj, bover)
{//양식 이름 옆의 쪼그만 버튼 시작 2008.01
	minimenu(obj, -110, 10, obj.value);
	if(window.ActiveXObject)
	{
		obj.src = (minifmmenu.style.display == "block") ? "<%=Session["user_thema"] %>/COVI/common/btn/btn_icon_up.gif" : "<%=Session["user_thema"] %>/COVI/common/btn/btn_icon_down.gif";
	}
	else
	{
		obj.src = (document.getElementById("minifmmenu").style.display == "block") ? "<%=Session["user_thema"] %>/COVI/common/btn/btn_icon_up.gif" : "<%=Session["user_thema"] %>/COVI/common/btn/btn_icon_down.gif";
	}
	event.returnValue = false;//이준희(2008-02-29): 좌측 메뉴상의 Progressive Disclosure 아이콘 클릭 시 메뉴 자체가 클릭되지 않도록 처리하는 라인을 추가함.
}

function minimenu__(f1,diffx,diffy,szvalue){
	var x = (document.layers) ? loc.pageX : event.clientX;
	var y = (document.layers) ? loc.pageY : event.clientY;
	var sH = parseInt(document.body.scrollTop);
	var sW = parseInt(document.body.scrollLeft);
	minifmmenu.style.pixelTop	= sH+y+diffy;
	minifmmenu.style.pixelLeft	= sW+x+diffx;
	minifmmenu.style.display = (minifmmenu.style.display == "block") ? "none" : "block";
	if(minifmmenu.style.display == "block")
	{//<LI id=fmid onclick=\"Open_Form('{60D25CD07F064860B063D2EE84198F4F}','','WF_FORM_DRAFT','{B99BBBB2D29A49DE870FB51B0EFCE167}','0','WF_FORM_DRAFT_V0')\" fmid=\"{60D25CD07F064860B063D2EE84198F4F}\">기안지 </LI>
		var oContextHTML = frmminimenu.document.all["divminemenu_Main"];
		if (oContextHTML != null)
		{
			oContextHTML.style.display = "";
			var h = oContextHTML.offsetHeight;				 
			var w = oContextHTML.offsetWidth;
			minifmmenu.style.width = w;
			minifmmenu.style.height = h;
		}	 
	}
}

function minimenu(f1,diffx,diffy,szvalue)
{//x = (document.layers) ? loc.pageX : event.clientX;//y = (document.layers) ? loc.pageY : event.clientY;
	var iW = 0, iL = 0, iT = 0, iTmp = 0;
	var x = 0, y  = 0, sH  = 0, sW = 0;
	var w = null, ele = null, rect = null;
	if (document.getElementById) {
		if (isNaN(window.screenX)) {
			//x=window.screenLeft;
			//y=window.screenTop;
			x = (document.layers) ? loc.pageX : event.clientX;
			y = (document.layers) ? loc.pageY : event.clientY;
		}else {
			x=AnchorPosition_getPageOffsetLeft(f1)+10;
			y=AnchorPosition_getPageOffsetTop(f1)+10;
		}
	}
	else if (document.all) {
		x=event.clientX;
		y=event.clientY;
		sH = parseInt(document.body.scrollTop);
		sW = parseInt(document.body.scrollLeft);
	}
	else if (document.layers) {
		x=loc.pageX;
		y=loc.pageY;
		sH = parseInt(document.body.scrollTop);
		sW = parseInt(document.body.scrollLeft);
	}
	if(window.ActiveXObject)
	{
		//minifmmenu.style.pixelTop	= sH + y + diffy;
		//minifmmenu.style.pixelLeft	= sW + x + diffx;
		{//이준희(2011-04-27): Modified to support SharePoint environment
			iL = sW + x + diffx;
			iT = sH + y + diffy;
			if('<%=Session["CEPS"]%>' == 'true')
			{
				ele = document.getElementById('imgminifmmenu');
				rect = ele.getBoundingClientRect();
				iTmp = minifmmenu.style.zIndex;
				minifmmenu.style.zIndex = -1;
				minifmmenu.style.display = 'block';//debugger;//alert(document.getElementById("divminemenu_Main").offsetWidth);
				if(window.ActiveXObject)
				{
					w = document.getElementById('frmminimenu').contentWindow;
				}
				else
				{
					w = document.getElementById('frmminimenu').contentDocument;
				}
				iW = w.document.getElementById('divminemenu_Main').offsetWidth;
				iL = rect.right - iW - 9;
				iT = rect.bottom - 139;
				minifmmenu.style.zIndex = iTmp;
				minifmmenu.style.display = 'none';//iL = IT = 0;//$$
			}
			minifmmenu.style.pixelLeft	= iL;
			minifmmenu.style.pixelTop	= iT;
		}
	}
	else
	{
		document.getElementById("minifmmenu").style.top = sH + y + diffy + "px";
		document.getElementById("minifmmenu").style.left = sW + x + diffx + "px";
	}//f1.src = (document.getElementById("minifmmenu").style.display == "block") ? m_oFormMenu.g_imgBasePath+"/Covi/common/btn/btn_icon_down.gif" : m_oFormMenu.g_imgBasePath+"/Covi/common/btn/btn_icon_up.gif";
	if (window.ActiveXObject) {
		minifmmenu.style.display = (minifmmenu.style.display == "block") ? "none" : "block";
	}else{	
		document.getElementById("minifmmenu").style.display = (document.getElementById("minifmmenu").style.display == "block") ? "none" : "block";
	}
//	
	if(window.ActiveXObject){
		var minibody = minifmmenu;
	}else{
		var minibody = document.getElementById("minifmmenu");
	}
	if (minibody.style.display == "block")
	{//debugger;
		if (window.ActiveXObject) {
			var oContextHTML = frmminimenu.document.all["divminemenu_Main"];
		}
		else
		{
			var oContextHTML = document.getElementById("frmminimenu").contentDocument.getElementById("divminemenu_Main");
		}
		if(oContextHTML != null) {
			oContextHTML.style.display = "";
//debugger;
			var h = oContextHTML.offsetHeight;				 
			var w = oContextHTML.offsetWidth;
			if(window.ActiveXObject){
				minifmmenu.style.width = w;
				minifmmenu.style.height = h;
			}else{
				document.getElementById("minifmmenu").style.width = w+"px";
				document.getElementById("minifmmenu").style.height = h+"px";
			}
		}	 
	}
}

//양식 이름 옆의 쪼그만 버튼 종료
function AnchorPosition_getPageOffsetLeft (el) {
	var ol=el.offsetLeft;
	while ((el=el.offsetParent) != null) { ol += el.offsetLeft; }
	return ol;
}
function AnchorPosition_getPageOffsetTop (el) {
	var ot=el.offsetTop;
	while((el=el.offsetParent) != null) { ot += el.offsetTop; }
	return ot;
}	
	
function fnMnuPRD(oPRD)
{//이준희(2008-02-29): 좌측 메뉴상의 Progressive Disclosure 아이콘 클릭 시 메뉴 자체가 클릭되지 않도록 처리하는 함수를 추가함.
	try
	{//debugger;
		//oPRD.parentElement.COVIBuffer = oPRD.parentElement.href;ㅌ
		//oPRD.parentElement.href = '#';
		displayminimenu(oPRD);
	}
	catch(e)
	{
	}
}
	
function gotoDocBox(){
	parent.location.href = "default.aspx?location=DOCBOX";
}
function gotoFolder4Folder (obj){
	gotoFolder('listfolder.aspx?uid='+toUTF8(obj.getAttribute("folderid"))+'&location=UFOLDER&FOLDERMODE=' + obj.getAttribute("foldermode")+'&ownerid='+obj.getAttribute("ownerid"),obj.getAttribute("foldername"));
}		
</script>
<!--

个-->
	</body>
</html>