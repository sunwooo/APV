<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Menu2.aspx.cs" Inherits="Approval_Menu2" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="head1" runat="server">
    <title>전자결재</title>
	<script type="text/javascript" language="javascript" src="../common/script/CFL.js"></script>
	<script type="text/javascript" language="javascript" src="common/function.js"></script>
    <style type="text/css" title="defaultStyle">
    <!--
    html, body {
    height: 100%;
    overflow:hidden;
    /* Required */
    }
    -->
    </style>
</head>
<body>
<form id="form1" runat="server"></form>
<table border="0" cellpadding="0" cellspacing="0" style="height: 100%;">
<!-- 타이틀 플래시 영역 시작 --> 
<tr style="height: 70px;">
    <td>
        <div id="n_leftm">
            <div id="n_lefttop">
                <img src="<%=Session["user_thema"] %>/Covi/Approval/title_img.gif" />
            </div>
        </div> 
    </td>
</tr>
<!-- 타이틀 플래시 영역 끝 -->
<tr style="height: 100%;">
    <td class="n_leftcnt" style="vertical-align: top; height: 98%; padding-left: 10px;">
        <div style="overflow-x: auto; overflow-y: auto; height: 98%; width: 98%;">
             <ul class="m_list">
                  <!-- 개인문서함 시작 -->
                  <li class="line_bg"><a href="javascript:onclick=gotoFolder('list.aspx?uid=' + uid + '&amp;location=APPROVAL','미결함');switchSubMenu('target_1');ChangType('menu_1_2');" class="mmenu"><b><asp:Label ID="lbl_doc_person2" runat="server"></asp:Label></b>&nbsp;<%--<img src="<%=Session["user_thema"] %>/Covi/common/icon/plus.gif" align="abmiddle" alt="" />--%></a>
                      <!-- 서브 메뉴 시작 -->
                      <div id="submenu" name="target_1" style="display:none;" >
                        <ul class="s_list"  >
                          <li id='menu_1_1'><a href="javascript:onclick=gotoFolder('list.aspx?uid=' + uid + '&amp;location=PREAPPROVAL','예고함');ChangType('menu_1_1');" class="smenu"><asp:Label ID="lbl_doc_pre2" runat="server"></asp:Label></a></li>
                          <li id='menu_1_2'><a href="javascript:onclick=gotoFolder('list.aspx?uid=' + uid + '&amp;location=APPROVAL','미결함');ChangType('menu_1_2');" class="smenu"><asp:Label ID="lbl_doc_approve2" runat="server"></asp:Label>&nbsp;<span id="approval" ></span></a></li>
                          <li id='menu_1_3'><a href="javascript:onclick=gotoFolder('list.aspx?uid=' + uid + '&amp;location=PROCESS','진행함');ChangType('menu_1_3');" class="smenu"><asp:Label ID="lbl_doc_process2" runat="server"></asp:Label>&nbsp;<span id="process" ></span></a></li>
                          <li id='menu_1_4'><a href="javascript:onclick=gotoFolder('list.aspx?uid=' + uid + '&amp;location=COMPLETE&amp;barchived=true','완료함');ChangType('menu_1_4');" class="smenu"><asp:Label ID="lbl_doc_complete2" runat="server"></asp:Label></a></li>
                          <li id='menu_1_5'><a href="javascript:onclick=gotoFolder('list.aspx?uid=' + uid + '&amp;location=REJECT&amp;barchived=true','반려함');ChangType('menu_1_5');" class="smenu"><asp:Label ID="lbl_doc_reject2" runat="server"></asp:Label></a></li>
                          <li id='menu_1_6'><a href="javascript:onclick=gotoFolder('list.aspx?uid=' + uid + '&amp;location=TEMPSAVE','임시함');ChangType('menu_1_6');" class="smenu"><asp:Label ID="lbl_composing" runat="server"></asp:Label></a></li>
                          <li id='menu_1_7'><a href="javascript:onclick=gotoFolder('list.aspx?uid=' + uid + '&amp;location=CCINFO&amp;barchived=true','통보함');ChangType('menu_1_7');" class="smenu"><asp:Label ID="lbl_doc_reference2" runat="server"></asp:Label></a></li>
                          <li id='menu_1_8'><a href="javascript:onclick=gotoFolder('list.aspx?uid=' + uid + '&amp;location=TCINFO','배포수신함');ChangType('menu_1_8');" class="smenu"><asp:Label ID="lbl_doc_circulation" runat="server"></asp:Label></a></li>
                          <li id='menu_1_9'><a href="javascript:onclick=gotoFolder('list.aspx?uid=' + uid + '&amp;location=REVIEW1','공람함');ChangType('menu_1_9');" class="smenu"><asp:Label ID="lbl_doc_review" runat="server" /></a></li>
                          <!-- 사용자 정의 폴더 시작 -->
                          <li class="line_bg"><a href="#" style="color: #656565;
                                              background: url(<%=Session["user_thema"] %>/Covi/Common/icon/icon_folder.gif) no-repeat 7px 6px; 
					                          display: block;
					                          height: 18px;
					                          padding: 7px 0 0 23px;" onclick="javascript:gotoFolder('listFolder.aspx?uid='+uid+'&FOLDERMODE=I&location=UFOLDER','<%=Resources.Approval.lbl_userdefinedfolder%>');"><b><%=Resources.Approval.lbl_userdefinedfolder%></b></a> 
                              <div id="Div1" name="target_6"  style="display:block;">
                                  <ul class="s_list">
                                    <%=GetUserDefinedFolders()%>
                                  </ul>
                              </div>
                          </li>
                          <!-- 사용자 정의 폴더 끝 -->
                        </ul>
                      </div>
                    <!-- 서브 메뉴 끝 -->
                    </li>
                  <!-- 개인문서함 끝 -->
                  <!-- 담당업무함 시작 -->
                    <li class="line_bg" id="trJF1">
                        <a href="#" class="mmenu" onclick="switchSubMenu('target_5');" >
                            <b><asp:Label ID="lbl_chargedoc" runat="server" Text="담당업무함" CssClass="leftSub"></asp:Label></b>&nbsp;
                        </a>
                        <!-- 서브 메뉴 시작 -->
                        <div id="submenu" name="target_5"  style="display:none;">
                            <ul class="s_list">              
	                            <%=GetAdditionalBoxes() %>
                            </ul>
                        </div>
                        <!-- 서브 메뉴 끝 -->
                    </li>
                  <!-- 담당업무함 끝 -->
                  <!-- 부서문서함 시작 -->
                  <li class="line_bg"><a href="#" onclick="javascript:gotoFolder('listDept.aspx?uid=' + deptid + '_A' + '&amp;location=DEPART&amp;barchived=true','부서문서함');switchSubMenu('target_2');ChangType('menu_4_1');" class="mmenu"><b><asp:Label ID="lbl_doc_deptcomplet" runat="server"></asp:Label></b></a>
                    <span style="display:none;" id="tr_controldept">
                            <select name="ManageDept" style="width:100" onchange="queryManageDept();">
                                <option><%=Resources.Approval.lbl_selection%></option><!--선택-->
                            </select>
                      </span>
                      <!-- 서브 메뉴 시작 -->
                      <div id="submenu" name="target_2"  style="display:none;">
                        <ul class="s_list">
                          <li id='menu_4_1'><a href="javascript:onclick=gotoFolder('listDept.aspx?uid=' + deptid + '_A' + '&amp;location=DEPART&amp;barchived=true','부서함');ChangType('menu_4_1');" class="smenu"><asp:Label ID="lbl_doc_deptcomplet2" runat="server"></asp:Label></a></li>
                          <li id='menu_4_2'><a href="javascript:onclick=gotoFolder('listDept.aspx?uid=' + deptid + '_S' + '&amp;location=DEPART&amp;barchived=true','발신함');ChangType('menu_4_2');" class="smenu"><asp:Label ID="lbl_doc_sent" runat="server"></asp:Label></a></li>
                          <li id='menu_4_3'><a href="javascript:onclick=gotoFolder('listDept.aspx?uid=' + deptid + '_R' + '&amp;location=DEPART','수신함');ChangType('menu_4_3');" class="smenu"><asp:Label ID="lbl_doc_receive" runat="server"></asp:Label></a></li>
                          <li id='menu_4_4'><a href="javascript:onclick=gotoFolder('listDept.aspx?uid=' + deptid + '_RC' + '&amp;location=DEPART&amp;barchived=true','수신처리함');ChangType('menu_4_4');" class="smenu"><asp:Label ID="lbl_doc_receiveprocess" runat="server"></asp:Label></a></li>
                          <li id='menu_4_5'><a href="javascript:onclick=gotoFolder('listDept.aspx?uid=' + deptid + '_I' + '&amp;location=DEPART&amp;barchived=true','통보함');ChangType('menu_4_5');" class="smenu"><asp:Label ID="lbl_doc_reference3" runat="server"></asp:Label></a></li>
                          <li id='menu_4_6'><a href="javascript:onclick=gotoFolder('listDept.aspx?uid=' + deptid + '_D' +'&amp;location=DEPART','배포수신함');ChangType('menu_4_6');" class="smenu"><span><%=Resources.Approval.lbl_doc_circulation %></span></a></li>
                          <li id="tdAuditOU" style="display:none;"><a href="javascript:onclick=gotoFolder('listDept.aspx?uid=' + deptid + '_AD' + '&amp;location=DEPART','감사할문서함');ChangType('tdAuditOU');" class="smenu"><asp:Label ID="lbl_doc_auditou" runat="server"></asp:Label></a></li>            
                          <!-- 사용자 정의 폴더 시작 -->
                          <li id='menu_4_7' class="line_bg" style="display:none;"><a href="#" style="color: #656565;
                                              background: url(<%=Session["user_thema"] %>/Covi/Common/icon/icon_folder.gif) no-repeat 7px 6px; 
					                          display: block;
					                          height: 18px;
					                          padding: 7px 0 0 23px;" onclick="javascript:gotoFolder('listFolder.aspx?uid='+deptid+'&FOLDERMODE=I&location=UFOLDER','<%=Resources.Approval.lbl_deptfolder%>');"><b><%=Resources.Approval.lbl_deptfolder%></b></a> 
                          <div id="Div2" name="target_6"  style="display:block;">
                              <ul class="s_list">
                                <%=GetUnitDefinedFolders()%>
                              </ul>
                          </div>
                          </li>
                          <li>
                          <!-- 사용자 정의 폴더 끝 -->              
                              <!-- 서브 > 서브 메뉴 시작 -->
                              <ul class="sel" style="display:none;" id="tr_controlUnit">
                                <li>
                                    <select name="ManageUnit" style="width:145" onchange="queryManageUnit();">
                                        <option><%=Resources.Approval.lbl_selection%></option><!--선택-->
                                    </select><!--부서함 공유-->
                                </li>
                              </ul>
                            <!-- 서브 > 서브 메뉴 끝 -->
                          </li>
                        </ul>
                      </div>
                    <!-- 서브 메뉴 끝 -->
                  </li>
                  <!-- 부서문서함 끝 -->
              
                        <!-- 결재문서작성 시작
                        <input type=checkbox id="imgminifmmenu_Chk" name="chkjfarchive" />
                        javascript:onclick=gotoFolder('formlist/formlist.aspx');
                        onclick="fnMnuPRD(this);"
                        -->
                        <li class="line_bg">
                        <table border="0" cellpadding="0" cellspacing="0" style="width:100%; padding-left:0;">
                            <tr>
                                <td>
                                    <a href="javascript:onclick=gotoFolder('formlist/formlist.aspx');switchSubMenu();" COVIBuffer='' class="mmenu">
			                        <b>
				                        <asp:Label ID="lbl_write" runat="server"></asp:Label>
			                        </b>
            				        
	                                </a>
                                </td>
                                <td><img src="/GwImages/common/btn/btn_icon_down.gif" align="abmiddle" alt="" id="imgminifmmenu" onclick="fnMnuPRD(this);"/></td>
                            </tr>
                        </table>
            				
                        </li>
           		  
                  <!-- 겸직자 부서변경 시작 -->
                  <% if (System.Convert.ToInt32(Session["user_additionaljob_no"].ToString()) == -100)
                  { %>
                  <li class="line_bg"><a href="javascript:onclick=changeApvDept();switchSubMenu();" class="mmenu"><b><asp:Label ID="lbl_deptchange" runat="server"></asp:Label></b></a>
                  </li>
                  <% } %>
                  <!-- 겸직자 부서변경 끝 -->
                  <!-- 문서대장 시작 -->
                  <li class="line_bg"><a href="javascript:onclick=gotoFolder('Doclist/Doclist.aspx?tab=tab1','문서대장');switchSubMenu('target_4');ChangType('menu_6_1');" class="mmenu"><b><asp:Label ID="lbl_doc_list" runat="server"></asp:Label></b>&nbsp;<%--<img src="<%=Session["user_thema"] %>/Covi/common/icon/plus.gif" align="abmiddle" alt="" />--%></a>
                      <!-- 서브 메뉴 시작 -->
                      <div id="submenu" name="target_4" style="display:none;">
                        <ul class="s_list">
                          <li id="menu_6_1"><a href="javascript:onclick=gotoFolder('Doclist/Doclist.aspx?tab=tab1','<%= Resources.Approval.lbl_doc_reglist%>');ChangType('menu_6_1');" class="smenu"><%= Resources.Approval.lbl_doc_reglist%></a></li>
                          <li id="menu_6_2"><a href="javascript:onclick=gotoFolder('Doclist/Doclist.aspx?tab=tab2','<%= Resources.Approval.lbl_doc_recvlist%>');ChangType('menu_6_2');" class="smenu"><%= Resources.Approval.lbl_doc_recvlist%></a></li>
                          <li id="menu_6_3"><a href="javascript:onclick=gotoFolder('Doclist/Doclist.aspx?tab=tab3','<%= Resources.Approval.lbl_doc_sendlist%>');ChangType('menu_6_3');" class="smenu"><%= Resources.Approval.lbl_doc_sendlist%></a></li>
                          <li id="menu_6_4"><a href="javascript:onclick=gotoFolder('Doclist/Doclist.aspx?tab=tab4','<%= Resources.Approval.lbl_doc_reglist%>');ChangType('menu_6_4');" class="smenu"><%= Resources.Approval.lbl_doc_reglist%></a></li>  
                          <li id="menu_6_5"><a href="javascript:onclick=gotoFolder('Doclist/Doclist.aspx?tab=tab5','<%= Resources.Approval.lbl_doc_sendlist%>');ChangType('menu_6_5');" class="smenu"><%= Resources.Approval.lbl_doc_sendlist%></a></li>  
                          <li id="menu_6_6"><a href="javascript:onclick=gotoFolder('Doclist/Doclist.aspx?tab=tab6','<%= Resources.Approval.lbl_ApplicationRecvList%>');ChangType('menu_6_6');" class="smenu"><%= Resources.Approval.lbl_ApplicationRecvList%></a></li>
                          <li id="menu_6_7"><a href="javascript:onclick=gotoFolder('Doclist/Doclist.aspx?tab=tab7','<%= Resources.Approval.lbl_doc_sendlist%>');ChangType('menu_6_7');" class="smenu"><%= Resources.Approval.lbl_doc_sendlist%></a></li>
                          <li id="menu_6_8"><a href="javascript:onclick=gotoFolder('Doclist/Doclist.aspx?tab=tab8','<%= Resources.Approval.lbl_doc_notelist%>');ChangType('menu_6_8');" class="smenu"><%= Resources.Approval.lbl_doc_notelist%></a></li>  
                          <li id="menu_6_9"><a href="javascript:onclick=gotoFolder('Doclist/Doclist.aspx?tab=tab9','<%= Resources.Approval.lbl_doc_seallist%>');ChangType('menu_6_9');" class="smenu"><%= Resources.Approval.lbl_doc_seallist%></a></li>           
                          <li id="menu_6_10"><a href="javascript:onclick=gotoFolder('Doclist/Doclist.aspx?tab=tab10','<%= Resources.Approval.lbl_doc_publicsendshare%>');ChangType('menu_6_10');" class="smenu"><%= Resources.Approval.lbl_doc_publicsendshare%></a></li>  
                          <li id="menu_6_11"><a href="javascript:onclick=gotoFolder('Doclist/Doclist.aspx?tab=tab11','<%= Resources.Approval.lbl_doc_licenceshare%>');ChangType('menu_6_11');" class="smenu"><%= Resources.Approval.lbl_doc_licenceshare%></a></li>           
                        </ul>
                      </div>
                    <!-- 서브 메뉴 끝 -->
                  </li>
                  <!-- 문서대장 끝 -->

                  <!-- 결재 확인함 시작 -->
                    <% if (bMonitor == true)
                       { %>
                    <li class="line_bg"><a href="javascript:onclick=gotoFolder('listAudit.aspx');switchSubMenu();" class="mmenu"><b><asp:Label ID="lbl_monitor" runat="server" Text="결재확인함"></asp:Label></b></a></li>
                    <% } %>							
                  <!-- 결재 확인함 끝-->
                  <!-- 결재문서함 시작 
                  <li class="line_bg"><a href="javascript:onclick=gotoDocBox('DeployList/DeploylineList.aspx');" class="mmenu"><b>결재문서함</b></a>
                  </li>
                   결재문서함 끝 -->
                  <!-- 전자결재 환경설정 시작 -->
                  <li class="line_bg"><a href="javascript:onclick=gotoFolder('/CoviWeb/PortalService/OrgMap/OM_RightApprovalConfig.aspx');switchSubMenu('target_6');ChangType('menu_7_1');" class="mmenu"><b><%= Resources.Approval.lbl_ApprovalbaseInfo%></b></a>
                      <div id="submenu" name="target_6" style="display:none;">
                        <ul class="s_list">
                          <li id="menu_7_1"><a href="javascript:onclick=gotoFolder('/CoviWeb/PortalService/OrgMap/OM_RightApprovalConfig.aspx');ChangType('menu_7_1');" class="smenu"><%= Resources.Approval.lbl_ApprovalbaseInfo%></a></li>
                          <li id="menu_7_2"><a href="javascript:onclick=gotoFolder('ApvLinelist/Apvlinelist.aspx');ChangType('menu_7_2');" class="smenu"><asp:Label ID="lbl_doc_privateapv" runat="server"></asp:Label></a></li>
                          <li id="menu_7_3"><a href="javascript:onclick=gotoFolder('CirculationlineList/CirculationlineList.aspx');ChangType('menu_7_3');" class="smenu"><asp:Label ID="lbl_Circulationline_setup" runat="server"></asp:Label></a></li>
                          <li id="menu_7_4"><a href="javascript:onclick=gotoFolder('DeployList/DeploylineList.aspx');ChangType('menu_7_4');" class="smenu"><%= Resources.Approval.lbl_doc_deploy_setting%></a></li>  
                          <li id="menu_7_5"><a href="javascript:onclick=gotoFolder('/CoviWeb/Admin/Approval_Admin/JFMgr/JFMemberList.aspx?jfid=3&jfcode=Receptionist&jfname=문서관리자&ismanager=true&callpage=user');ChangType('menu_7_5');" class="smenu"><%= Resources.Approval.lbl_doc_manager%></a></li>  
                        </ul>
                      </div>                              
                  </li>
                  <!-- 전자결재 환경설정 끝 -->
                <!-- 결재문서작성 끝 -->
                <!-- 개인결재선관리 시작 
                <li class="line_bg"><a href="javascript:onclick=gotoFolder('ApvLinelist/Apvlinelist.aspx');switchSubMenu();" class="mmenu"><b></b></a>
                </li>
                개인결재선관리 끝 -->
               
                  <!-- 회람그룹설정 시작 
                  <li class="line_bg"><a href="javascript:onclick=gotoFolder('CirculationlineList/CirculationlineList.aspx');switchSubMenu();" class="mmenu"><b></b></a>
                  </li>
                   회람그룹설정 끝 -->
                  <!-- 배포그룹설정 시작 
                  <li class="line_bg"><a href="javascript:onclick=gotoFolder('DeployList/DeploylineList.aspx');switchSubMenu();" class="mmenu"><b><%= Resources.Approval.lbl_doc_deploy_setting%></b></a>
                  </li>
                   배포그룹설정 끝 -->
                  <!-- 문서관리자 시작 
                  <li class="line_bg"><a href="javascript:gotoFolder('/CoviWeb/Admin/Approval_Admin/JFMgr/JFMemberList.aspx?jfid=3&jfcode=Receptionist&jfname=문서관리자&ismanager=true&callpage=user');switchSubMenu();" class="mmenu"><b><%= Resources.Approval.lbl_doc_manager%></b></a>
                  </li>
                   문서관리자 끝 -->                              
                 </ul>
        </div>
    </td>    
</tr> 
<tr style="height:30px">
    <td>
        <div id="n_leftfoot" style="position:relative;margin-top:-1px;"></div>    
    </td>
</tr>
</table>
<!-- hot key 시작 -->
<div id="minifmmenu" onclick="this.style.display='none';" oncontextmenu="return false" ondragstart="return false"
onselectstart="return false"  onmouseout="this.style.display='none';"
class="Css_Table1" style="background-image: url(<%=Session["user_thema"] %>/Covi/Common/icon/cont_back.gif); background-repeat: repeat-y; ; margin: 0; margin-top: 0;border-top: 1 solid buttonhighlight;border-left: 1 solid buttonhighlight;border-right: 1 solid buttonshadow;border-bottom: 1 solid buttonshadow;width:160px;height:160px;display:none;position: absolute; z-index: 99;overflow: hidden;">
<iframe id="frmminimenu" src="/CoviWeb/Approval/forms/formmenu_mini.aspx" scrolling="no" frameborder="0" style="background : #eff2f7; margin: 0; margin-top: 0;border-top: 0 solid buttonhighlight;border-left: 0 solid buttonhighlight;border-right: 0 solid buttonshadow;border-bottom: 0 solid buttonshadow;width:160;position: absolute; z-index: 100"></iframe>
</div>
<!-- hot key 종료 -->  
<!-- 타양식 내용복사 -->
<div id="divTempSave" style="display:none;">
    <input type="hidden" id="dTempDiffSave" />
    <input type="hidden" id="cTempDiffSave" />
    <input type="hidden" id="mTempDiffSave" />
    <input type="hidden" id="tTempDiffSave" />
</div>
</body>
</html>
<script type="text/javascript" language="javascript">
var uid="<%= Session["user_code"] %>";
var deptid="<%= Session["user_dept_code"] %>"; 
var parentdeptid="<%= Session["user_parent_dept_code"]%>";
var refresh  = "<%=sRefresh%>";
var bAuditDept = "<%=bAuditDept%>";

//부서품의함존재여부 
if(deptid != parentdeptid) deptid=parentdeptid;       
		        
var g_winDocAll = window.document.all;
var bReceptionist = "<%= bReceptionist%>";
var bMonitor = "<%=bMonitor %>";
var	m_xmlHTTP = CreateXmlHttpRequest();
var	m_xmlHTTPUnit = CreateXmlHttpRequest();

var ijfcnt = "<%=strJFCount %>";
var strPersonListValue =  "<%=strPersonListValue %>";
var strDocListValue = "<%=strDocListValue %>";
var strDeptListValue = "<%=strDeptListValue %>";

window.onload= initOnload;
function initOnload()
{
    switchSubMenu("target_<%=strMenu %>");//target_1
    ChangType("<%=strSubMenu %>");
    setDisplayMenu();
    
    if(refresh == ""){
        if ("<%=Request.QueryString["mType"]%>" == "1") {
            gotoFolder('list.aspx?uid=' + uid + '&location=COMPLETE');
        }else if ("<%=Request.QueryString["mType"]%>" == "search") {
            gotoFolder('ApvMonitor/ApvMonitoring.aspx');
        }else if ("<%=Request.QueryString["mType"]%>" == "sitemap") {
            gotoFolder('<%=Request.QueryString["mURL"]%>');
        }else if ("<%=Request.QueryString["mType"]%>" == "portal") {
        }else {
            //gotoFolder('approval_home.aspx');
            //gotoFolder('list.aspx?uid=' + uid + '&location=APPROVAL');
        }
        
        getApprovalCount();
    }
    
    //담당업무함 설정
    if ( ijfcnt != "0"){
        //trJF1.style.display = "";
        document.getElementById('trJF1').style.display = "block";
    }else{
        document.getElementById('trJF1').style.display = "none";
    }
    
    //감사할문서함 메뉴 활성화 : 특정 부서의 문서수발자만 해당됨
    //if(bAuditDept == "True"){ tdAuditOU.style.display="";}else{tdAuditOU.style.display="none";}
    if(bAuditDept == "True"){ 
        document.getElementById('tdAuditOU').style.display="block";
    }else{
        document.getElementById('tdAuditOU').style.display="none";
    }
                
    return true;
}

function switchSubMenu(targetName)
{
    try 
    { 
        var divtag = document.getElementsByTagName("div");
        
        for (var i = 0; i < divtag.length; i++)
        {
            if(divtag[i].id=='submenu')
            {
                if(divtag[i].getAttribute("name")==targetName)
                {
                    if(navigator.appName.indexOf("Netscape")!=-1)
                    {
                        (divtag[i].style.display == 'block') ? divtag[i].style.display = 'none' : divtag[i].style.display = 'block';
                        //divtag[i].parentElement.className = "line_bg current";
                        divtag[i].parentNode.className = "line_bg current";
                    }
                    else
                    {
                        (divtag[i].style.display == "block") ? divtag[i].style.display = "none" : divtag[i].style.display = "block";
                        divtag[i].parentElement.className = "line_bg current";
                    }
                }

                else {
                    
                    if (navigator.appName.indexOf("Netscape")!=-1)
                    {
                        divtag[i].style.display = 'none';
                        divtag[i].parentNode.className = "line_bg"; 
                    }
                    else
                    {
                        divtag[i].style.display = 'none';
                        divtag[i].parentElement.className = "line_bg";
                    }
                }
            }  
        }
        //debugger;
        //imgminifmmenu.src = "<%=Session["user_thema"] %>/COVI/common/btn/btn_icon_down.gif";
        //minifmmenu.style.display = "none";
        
        //임시로 막았음 2010-01-18 ssuby
        //document.getElementById('imgminifmmenu').src = "<%=Session["user_thema"] %>/COVI/common/btn/btn_icon_down.gif";
        //document.getElementById('minifmmenu').style.display = "none";
    }
    catch (e) 
    {
        alert("switchSubMenu(targetName) error: " + e.description + "\r\nError number: " + e.number);
    }
}
var preItem;
function ChangType(currItem) {
    if (currItem !=""){
        var oLi;
        //CSS가 잘 적용되지 않아 강제적으로 변경함. 2007.12.11 김영종
        if(preItem != null) {
	        //oLi = eval(document.all[preItem]);
	        //oLi = eval(document.getElementById('preItem'));
	        oLi = document.getElementById(preItem);
	        if(oLi != null) oLi.className="";
        }
        if(currItem != null) {
	        //oLi = eval(document.all[currItem]);
	        //oLi = eval(document.getElementById(currItem));
	        oLi = document.getElementById(currItem);
	        if(oLi != null) oLi.className="current";
        }
        preItem = currItem;
    }
}
function setDisplayMenu(){
    //개인문서함
    var aMenuPerson = strPersonListValue.split(":");    
    for(var j=1;j<aMenuPerson.length;j++)
    {  
//        if(aMenuPerson[j]=="1")   eval("menu_1_"+j).style.display = "";
//        else eval("menu_1_"+j).style.display = "none";
        if(aMenuPerson[j]=="1")   eval(document.getElementById("menu_1_"+j)).style.display = "block";
        else eval(document.getElementById("menu_1_"+j)).style.display = "none";
    }
    //부서문서함
    var aDeptMenu = strDeptListValue.split(":");
    for(var k=1; k < aDeptMenu.length ; k++){
//        if(aDeptMenu[k]=="1")   eval("menu_4_"+k).style.display = "";
//        else eval("menu_4_"+k).style.display = "none";
        if(aDeptMenu[k]=="1")   eval(document.getElementById("menu_4_"+k)).style.display = "block";
        else eval(document.getElementById("menu_4_"+k)).style.display = "none";
    }
    
    //문서대장		
    var aMenuDoc = strDocListValue.split(":");    
    for(var j=1;j<aMenuDoc.length;j++)
    {  
//        if(aMenuDoc[j]=="1")   eval("menu_6_"+j).style.display = "";
//        else eval("menu_6_"+j).style.display = "none";
        if(aMenuDoc[j]=="1")   eval(document.getElementById("menu_6_"+j)).style.display = "block";
        else eval(document.getElementById("menu_6_"+j)).style.display = "none";
    }
}	
function gotoFolder(strFolderURL, strFolderName){
    try{
        if ( strFolderName != undefined){
            parent.rightFrame.document.location = strFolderURL+"&location_name="+ escape(strFolderName);
            //getApprovalCount();	
        }else{
            parent.rightFrame.document.location = strFolderURL;	
        }
        //imgminifmmenu.src = "<%=Session["user_thema"] %>/COVI/common/btn/btn_icon_down.gif";
        //minifmmenu.style.display = "none";
        
        //document.getElementById('imgminifmmenu').src = "<%=Session["user_thema"] %>/COVI/common/btn/btn_icon_down.gif";
        //document.getElementById('minifmmenu').style.display = "none";
        
    }catch(e){alert(e.message)}
        //return true;
}
function getApprovalCount(){
    /* parameter type 숫자값
    Data.SqlDbType.NChar : 10
    Data.SqlDbType.NText :11
    Data.SqlDbType.VarChar : 12
    Data.SqlDbType.Char : 3
    Data.SqlDbType.VarChar : 22
    Data.SqlDbType.Int : 8
    Data.SqlDbType.DateTime : 4
    */
   
    var pXML = "dbo.usp_wf_approvalcount";
    var aXML = "<param><name>USER_ID</name><type>VarChar</type><length>100</length><value><![CDATA["+uid+"]]></value></param>";
    var sXML = "<Items><connectionname>INST_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
    var szURL = "getXMLQuery.aspx";
    requestHTTP("POST",szURL,true,"text/xml",receiveHTTP, sXML);
}
function event_noop(){return;}
function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
    m_xmlHTTP.open(sMethod,sUrl,bAsync);
    //m_xmlHTTP.setRequestHeader("Accept-Language","ko");
    m_xmlHTTP.setRequestHeader("Content-type", sCType);

    if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
    (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
	
}
function receiveHTTP(){
    if(m_xmlHTTP.readyState==4){
        m_xmlHTTP.onreadystatechange=event_noop;
        var xmlReturn=m_xmlHTTP.responseXML;

        if(xmlReturn.xml==""){
            //alert(m_xmlHTTP.responseText);
        }else{
            var errorNode=xmlReturn.selectSingleNode("response/error");
            //var errorNode= SelectSingleNode(xmlReturn,"response/error");
            if(errorNode!=null){
                alert("Desc: " + errorNode.text);
            }else{
                //approval.innerHTML = '[ <font color=red>' +xmlReturn.selectSingleNode("response/NewDataSet/Table/APPROVAL").text + '</font> ]';
                //process.innerHTML =  '[ <font color=red>' +xmlReturn.selectSingleNode("response/NewDataSet/Table/PROCESS").text + '</font> ]';
                
                document.getElementById("approval").innerHTML = '[ <font color=red>' +xmlReturn.selectSingleNode("response/NewDataSet/Table/APPROVAL").text + '</font> ]';
                document.getElementById("process").innerHTML =  '[ <font color=red>' +xmlReturn.selectSingleNode("response/NewDataSet/Table/PROCESS").text + '</font> ]';
                
                //document.getElementById("approval").innerHTML = '[ <font color=red>' +SelectSingleNode(xmlReturn,"response/NewDataSet/Table/APPROVAL") + '</font> ]';
                //document.getElementById("process").innerHTML =  '[ <font color=red>' +SelectSingleNode(xmlReturn,"response/NewDataSet/Table/PROCESS") + '</font> ]';

                //receive.innerHTML =  '[ <font color=red>' + xmlReturn.selectSingleNode("response/NewDataSet/Table/RECEIVE").text + '</font> ]';				
                /*
                //preapproval.innerText = xmlReturn.selectSingleNode("response/NewDataSet/Table/PREAPPROVAL").text;
                //deptapproval.innerText = xmlReturn.selectSingleNode("response/deptapproval").text;				
                //circulation.innerText = xmlReturn.selectSingleNode("response/NewDataSet/Table/CIRCULATION").text;		        
                //circulation.innerHTML = ' <font color=red style="font-weight: bold">[ ' +xmlReturn.selectSingleNode("response/circulation").text + ' ]</font></a>';
                */
            }
        }
        
//        getManageDept(uid);     //부서관리
//        getManageUnit(deptid);  //통합부서관리
    }
}


function SelectSingleNode(xmlDoc, elementPath) 
{
    if(window.ActiveXObject) 
    {
        if (elementPath == "response/error"){
            return null;
        }else{
            return xmlDoc.selectSingleNode(elementPath).text;
        } 
    }
    else 
    { 
        var xpe = new XPathEvaluator(); 
        var nsResolver = xpe.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement); 
        var results = xpe.evaluate(elementPath,xmlDoc,nsResolver,XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
        
        if (elementPath == "response/error"){
            return null;
        }else{
            return results.singleNodeValue.textContent; 
        }
    } 
}
</script>
