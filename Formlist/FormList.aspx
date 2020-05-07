<%@ Page Language="C#" AutoEventWireup="true" CodeFile="FormList.aspx.cs" Inherits="COVIFlowNet_Formlist_FormList" %>
<%@ Register Src="../Portal/UxFooter.ascx" TagName="UxFooter" TagPrefix="ucfooter" %>
<%@ Register Src="../Portal/UxQuickMenu.ascx" TagName="UxQuickMenu" TagPrefix="ucquickmenu" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script language="javascript" type="text/javascript" src="../../common/script/coviflownet/openwindow.js"></script>
<script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
<script language="javascript" type="text/javascript" src="FormList.js"></script>
</head>
<body  class="bg_right">
<div id="SubWidth">
  <!-- 타이틀 영역 div 시작 -->
  <div class="Title">
    <h1><%= Resources.Approval.lbl_write %></h1>
    <!-- 네비게이션 영역 시작 -->
    <ul class="small" style="display:none;">
      <li>Home &gt;</li>
      <li><%= Resources.Approval.lbl_approval %> &gt;</li>
      <li><b><%= Resources.Approval.lbl_write %></b></li>
    </ul>
    <!-- 네비게이션 영역 끝 -->
  </div>
  <!-- 타이틀 영역 div 끝 -->
  <!-- form 시작 -->
  <!--<form id="form1" name="form1" method="post" action=""> -->
    <div class="n_btntb">
        <ul style="padding-top:0px;">
            <li>
            <span class="clas" style="padding-right:10px;">
                <span id="spanactivitydesc" style="display:none; font-weight:bold;"><%=Resources.Approval.lbl_rel_activity %> : </span><span id="spanactivityname"  name="spanactivityname" style="display:none;"></span>&nbsp;&nbsp;
                <span style="display:none"><input type="checkbox" id="chkthumbnail" name="chkthumbnail" onclick="javascript:viewthumbnail(this)" /><%=Resources.Approval.lbl_view_thumbnail%>&nbsp;&nbsp;</span>
                <!--
                <input name="listtypetab" type="radio" id="tab" value="tab" checked onclick="getListType('tab');" /> <%=Resources.Approval.lbl_class_by %>&nbsp;&nbsp;
                <input name="listtypetab" type="radio" id="list" value="list" onclick="getListType('list');" /> <%=Resources.Approval.lbl_total %>
                -->
                <input name="listtypetab" type="radio" id="tab" value="tab" checked onclick="hiddenSLayer();getListType('tab');" /> <%=Resources.Approval.lbl_class_by %>&nbsp;&nbsp;
                <input name="listtypetab" type="radio" id="list" value="list" onclick="getListType('list');" /> <%=Resources.Approval.lbl_total %>
            </span>
            </li>
        </ul>
		<!--
        <ul style="padding-top:0px;">
            검색 버튼 추가 
            <li><a class="btnov" href="#" onclick="javascript:search_OnClick();" href="javascript:__doPostBack('ctl00$UserContentsHolder$ctl00$btnSearch','')"><span><img src="/GwImages/BLUE/Covi/Common/btn/btn_icon01_search.gif" align="middle" />&nbsp;검색</span></a></li>            
        </ul>
		-->
    <!--추가 -->
    <!--검색 시작-->
    <div id="SLayer" style="display: none; position: absolute;">
        <div class="Box04">
            <div class="Box04_tl">
                <div class="Box04_tr">
                    <div class="Box04_tc">
                    </div>
                </div>
            </div>
            <div class="Box04_cl">
                <div class="Box04_cr">
                    <div class="Box04_cc">
                        <!-- 검색 조건 시작 -->
                        <div class="Search">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="right">
                                        <!-- 검색 시작 -->
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td>
                                                    <input id="Checkbox1" type="checkbox" name="ctl00$UserContentsHolder$ctl00$chkSubject" checked="checked" /><label for="ctl00_UserContentsHolder_ctl00_chkSubject">양식명</label>&nbsp;
                                                </td>
                                                <td>
                                                    <input class="type-text" name="ctl00$UserContentsHolder$ctl00$txtSearchWord" type="text" id="Ctl00_Usercontentsholder_Ctl00_Txtsearchword" class="type-text" onkeyup="if (event.keyCode == 13)  {  return goSearch(); }else{ return false; } " style="width:95px;" />
                                                    <a href="#" onclick="return goSearch();">
                                                        <img src="/GwImages/BLUE/Covi/Common/btn/btn_search02.gif" align="absmiddle"
                                                            border="0" /></a>
                                                </td>

                                                <td style="padding: 0 2px 8px 10px;">
                                                    <img src="/GwImages/BLUE/Covi/Common/icon/icon_box_x.gif" alt="" onclick="javascript:document.getElementById('SLayer').style.display='none'">
                                                </td>
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
            <div class="Box04_bl">
                <div class="Box04_br">
                    <div class="Box04_bc">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--검색 끝-->

    <!--추가 끝-->

    <!-- 게시판 리스트 div 시작 -->
    <div class="BTable">
      <!-- 리스트 테이블 시작 -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td id="FormList" ></td>
        </tr> 
      </table>
  <%--        <td id="diffFormList" style="display:none;"></td>--%>
      <!-- 리스트 테이블 끝 -->
      <!-- 페이징 div - display: none 으로 하면서 높이값 준 div -->
      <div style="height: 50px;"></div>
      <!-- 페이징 div 시작 -->
      <div class="Paging" style=" display: none;"><a href="#"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_start.gif" align="absmiddle" /></a><a href="#"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_prev.gif" hspace="7" align="absmiddle" /></a><span><b>1</b></span> | <a href="#">2</a> | <a href="#">3</a><a href="#"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_next.gif" hspace="7" align="absmiddle" /></a><a href="#"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_end.gif" align="absmiddle" /></a></div>
      <!-- 페이징 div 끝 -->
    </div>
    <!-- 게시판 리스트 div 끝 -->   
	
    <!-- 썸네일 박스 div 시작 -->
    <div class="Box04" id="divthumbnail" name="divthumbnail" style="display:none;">
      <div class="Box04_tl">
        <div class="Box04_tr">
          <div class="Box04_tc"></div>
        </div>
      </div>
      <div class="Box04_cl">
        <div class="Box04_cr">
          <div class="Box04_cc">
            <!-- 썸네일 시작 -->
			<div class="thumbnail">
			  <div class="img"><img src="<%=Session["user_thema"] %>/Covi/Approval/thumbnail_img.gif" id="imgthumbnail"  width="275" height="220" alt="" /></div>			  
			  <span class="text">
			  <b><%= Resources.Approval.lbl_formcreate_LCODE03 %> :</b> <span id="spanfmnm">OOO</span><br />
		      <b><%= Resources.Approval.lbl_formcreate_LCODE16%> :</b> <span id="spanfmdc"> OOOOO</span>
		      <br />
		      <span id="spanfmsdc"></span>
		      </span>
			</div>
            <!-- 썸네일 끝 -->
          </div>
        </div>
      </div>
      <div class="Box04_bl">
        <div class="Box04_br">
          <div class="Box04_bc"></div>
        </div>
      </div>
    <!-- 검색 영역 div 끝 -->   
</div>
<!--footer start-->
<ucfooter:UxFooter ID="UxFooter1" runat="server" />
<!--footer end -->
</div>
<!--quick Menu-->
<ucquickmenu:UxQuickMenu ID="UxWF_Footer" runat="server" />
<!--quick End-->
<script language="JavaScript" type="text/JavaScript">
//alert(100);

    /*추가 */
	    var el_txtSearchWord = 'Ctl00_Usercontentsholder_Ctl00_Txtsearchword';
	    var el_hidUxSearchKeyword = 'ctl00_UserContentsHolder_ctl00_hidUxSearchKeyword';
	/*-*/

    var gAdminSysTotal = "<%= gAdminSysTotal %>";  //전체시스템관리자
    var user_etid = "<%= Session["user_ent_code"] %>";
    var user_dpcd = "<%= Session["user_dept_code"] %>";
	/*2020-01-14 PSW 내부회계관리양식으로 인해 일시적 오픈 처리 (윤태진 차장님)*/
	var user_code = "<%= Session["user_code"] %>";
	
    var user_dppathid = "<%= user_dppathid %>";
    var language = "<%= Session["user_language"] %>" //20161102 다국어처리 - 다국어 값 가져오는 부분   
    var viewall = "<%=System.Web.Configuration.WebConfigurationManager.AppSettings["ViewFormAll"]%>";
    var listtype = "list";
    var windowtitle = "<%= Resources.Approval.lbl_write %>";
    
    /*수행관리 관련 추가 시작*/
    var rel_activityid = "<%=Request["TaskID"] %>";
    var rel_activityname = "<%=Request["TaskName"]%>";
    /*수행관리 관련 추가 끝*/
	var g_imgBasePath = "<%=Session["user_thema"] %>";
    var sgMsg_Err_Apv = '<%=msg_err_apv%>';//이준희(2011-03-09): FormList.js에서 서버 태그를 직접 사용하는 오류를 발견해 이를 수정하기 위해 추가함.


    //추가 HIW
    window.onload = initOnload;
    function initOnload() {

        getListType('tab');
    }


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
	}
	function getListType(value){
	    listtype = value;
	    viewlist(listtype);
	     if (value == "tab") {
			 changeBoxFirst();
		 }
	}
    var fmpf = ""; //양식 key
    var fmrv = ""; //양식 버젼
    var fmnm = ""; //양식 명
    var fmdc = ""; //양식 설명
    var fmsdc = ""; //양식 업무절차
    function viewthumbnail(obj){
	    document.getElementById("divthumbnail").style.display = (obj.checked)? "":"none";
	    if(!obj.checked){
	        imgthumbnail.src=g_imgBasePath+ "/Covi/Approval/thumbnail_img.gif";
		    document.getElementById("spanfmnm").innerHTML = "";
		    document.getElementById("spanfmdc").innerHTML = "";
		    document.getElementById("spanfmsdc").innerHTML = "";
	    }else{
	        if (fmpf != ""){
                displaythumbnaildivision();
	        }
	    }
	}
	function viewthumbnaildetail(obj){
        fmpf = obj.getAttribute("fmpf");//obj.fmpf
        fmrv = obj.getAttribute("fmrv");
        fmnm = obj.getAttribute("fmnm");
        fmdc = obj.getAttribute("fmdc");
        fmsdc = obj.getAttribute("fmsdc");
	    if (document.getElementById("chkthumbnail").checked){
	        displaythumbnaildivision();
		    //divComment.innerHTML = oXMLHttp.responseText.replace(/\n/g,"<br>");			
		}
	}
	function displaythumbnaildivision(){
        var oXMLHttp =  CreateXmlHttpRequest();//new ActiveXObject("MSXML2.XMLHttp");
        
	    oXMLHttp.open("GET","/GWStorage/e-sign/Formthumbnail/"+fmpf+"_V"+fmrv+".gif",false);
	    oXMLHttp.send();
	    if ( oXMLHttp.status == 200){
	        document.getElementById("imgthumbnail").src="/GWStorage/e-sign/Formthumbnail/"+fmpf+"_V"+fmrv+".gif";
	    }else{
	        document.getElementById("imgthumbnail").src=g_imgBasePath + "/Covi/Approval/thumbnail_img.gif";
	    }
	    document.getElementById("spanfmnm").innerHTML = fmnm;
	    document.getElementById("spanfmdc").innerHTML = fmdc;
	    document.getElementById("spanfmsdc").innerHTML = fmsdc;
        scrollDown();
 	}
 
    function scrollDown()
    {        
        var pagebottom = document.body.scrollHeight;
        window.scrollTo(0, pagebottom);
    }

    /*추가 */
            function search_OnClick() {
                if (document.getElementById("SLayer").style.display == "") {
                    document.getElementById("SLayer").style.display = "none";
                } else {
                    document.getElementById("SLayer").style.display = "";
                }

                //alert(document.getElementById("tab").checked); 
                if(document.getElementById("tab").checked){
                    document.getElementById("tab").checked = false;
                    document.getElementById("list").checked = true;
                    getListType('list');
                }
            }

            function hiddenSLayer(){
                document.getElementById("SLayer").style.display = "none";
                document.getElementById("Ctl00_Usercontentsholder_Ctl00_Txtsearchword").value= "";
            }

            function goSearch() {
                
               // alert("1");
                try {
                    //alert("2");
                    var searchFormName = document.getElementById(el_txtSearchWord).value;
                    //검색어 유효성 체크

                    if ((searchFormName) == "") {
                        //document.getElementById(el_txtSearchWord).value = "";
                        alert("검색어를 입력해 주십시요!!");
                        //return false;
                    } else {
                        //alert("3");
                        alert(searchFormName);
                        //alert(gClassId);
                        //alert(gClassName);
                          //document.getElementById(el_hidUxSearchKeyword).value = strSearchWord;
                        getListType('list');
                    }
                } catch (e) {
                    document.getElementById(el_hidUxSearchKeyword).value = "";
                }
            }
    /*추가 끝 */


</script>

</body>
</html>
