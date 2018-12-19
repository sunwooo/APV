<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Approval_home.aspx.cs" Inherits="Approval_Approval_home" %>
<%@ Register Src="Portal/UxFooter.ascx" TagName="UxFooter" TagPrefix="ucfooter" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Approval Home</title>
    <link rel="alternate" type="application/rss+xml" title="결재함" href="/CoviWeb/Approval/Portal/GetRssData.aspx?location=APPROVAL"/>
		<style type="text/css">
		<!--
		#SLayer {
			position:absolute;
			left:150px;
			top:55px;
			width:600px;
			z-index:1;
		}
		-->
		</style>     
</head>
<body >
    <div id="SubWidth">
      <!-- 타이틀 영역 div 시작 -->
      <div class="Title">
        <h1><asp:Label ID="lbl_Title1" runat="server"></asp:Label></h1>
        <!-- 네비게이션 영역 시작 -->
        <ul class="small" style="display:none;">
          <li>Home&gt;</li>
          <li><asp:Label ID="lbl_Title2" runat="server"></asp:Label></li>
        </ul>
        <!-- 네비게이션 영역 끝 -->
      </div>
  <!-- 타이틀 라인 끝 -->

        <div>
                <iframe id="notice" src="Approval_home_notice.aspx" height="150px" width="750px" frameborder="0" scrolling="no"></iframe><%--공지사항--%>
        </div>
	    <div>
	            <iframe id="list" src="portal/portallist.aspx?location=APPROVAL" height="230px" width="370px" frameborder="0" scrolling="no"></iframe><%--미결함--%><iframe height="200px" width="10px" frameborder="0" scrolling="no"></iframe>
	            <iframe id="dept" src="portal/portallist.aspx?location=DEPART" height="230px" width="370px" frameborder="0" scrolling="no"></iframe><%--부서함--%>
	    </div>
	    <%--<div>
	            <iframe id="Graph" src="portal/Statistics_Unit_CountGraph.aspx" height="300px" width="370px" frameborder="0" scrolling="no"></iframe><iframe height="200px" width="10px" frameborder="0" scrolling="no"></iframe>
	    </div>--%><%--통계Graph용 div 임시로 주석처리 by ssuby 20090312--%>
	     <!-- footer 영역 div 시작 -->
          <ucfooter:UxFooter ID="UxFooter1" runat="server" />
          <!-- footer 영역 div 끝 --> 
	</div>
	<script type="text/javascript" language="javascript" src="../common/script/CFL.js"></script>
	<script type="text/javascript" language="javascript">
	    var uid="<%=Request.QueryString["uid"]%>";
	    if(uid==""){
		    uid="<%=Session["user_dept_code"]%>";
	    }
	</script>
	
</body>
</html>
