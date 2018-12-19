<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DocListItems.aspx.cs" Inherits="COVIFlowNet_Doclist_DocListItems" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
    <script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js"></script>
</head>
<body>
 <!-- 게시판 리스트 div 시작 -->    
    <table width="100%" border="0" cellpadding="0" cellspacing="0">
		<tr>
			<td valign="top">
				<div id='divGalTable' class="BTable">
				</div>
				<div id='divErrorMessage' class='errormessage'></div>
			</td>
		</tr>
	</table>
<%-- <body leftmargin="0" topmargin="0"  onselectstart="return false;"  style="OVERFLOW: auto;    MARGIN: 0px;">
  <!-- 리스트 테이블 시작 -->
		<XML id="g_oSSXML" src="sortdoclist.xsl"></XML>
		<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" height="100%">
			<tr>
				<td valign="top" width="100%">
					<div id='divGalTable' class='divgaltable'></div>
					<div id='divErrorMessage' class='errormessage'></div>
				</td>
			</tr>
		</table>
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td width="100%" height="3" align="center" valign="middle" class="table_topline"></td>
			</tr>
		</table>
<body>--%>      
      
  <!-- 페이징 div 시작 -->
  <div class="Paging" style="display:none;">
    <input name="gopage" type="text" class="input" size="4" onKeyPress="if (event.keyCode==13) go_page(this.value);" style="display:none">
    <a href="#" onclick="go_page('f')"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_start.gif" align="absmiddle" /></a>
    <a href="#" onclick="go_page('p')" ><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_prev.gif" hspace="7" align="absmiddle" /></a>
     <span  id="totalpage"></span>
    <a href="#" onclick="go_page('n')"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_next.gif" hspace="7" align="absmiddle" /></a>
    <a href="#" onclick="go_page('l')"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_page_end.gif" align="absmiddle" /></a>
  </div>	
	<span id="tooltip" class="tooltip"></span>
	<div style="DISPLAY:none">
		<form id="menu"><input type="hidden" name="APVLIST"></form>
		<form id="editor"></form>
	</div>
    <script language="javascript" type="text/javascript">
	    var suid = "<%=uid%>";
	    var page = "<%=strpage%>";
	    var sDept = "<%=sDept%>";
	    var sDocListType ="<%=strDocListType%>";//alert('57: ' + sDocListType);
	    var sMonth ="<%=strMonth%>";
	    var sSort ="<%=strSort%>";
		var g_imgBasePath = "<%=Session["user_thema"] %>";
		
		var g_oSSXML = CreateXmlDocument();
        if (window.ActiveXObject) {
		    g_oSSXML.async=false;						
		    g_oSSXML.load("sortdoclist.xsl");	
		}else{
            getXSL();		    
		}
        function getXSL(){
            var szURL = "sortdoclist.xsl";
            requestHTTP("GET",szURL,true,"text/xml",receiveHTTPXSL,null);
        }
        function receiveHTTPXSL(){
		    if(m_xmlHTTP.readyState==4){
			    m_xmlHTTP.onreadystatechange=event_noop;
                var parser = new DOMParser();
                g_oSSXML = parser.parseFromString(m_xmlHTTP.responseText, "text/xml");
		    }
	    }
    </script>
    <script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
    <script language="javascript" type="text/javascript" src="../../common/script/COVIFlowNet/openWindow.js"></script>		
	<script language="javascript" type="text/javascript" src="listitems.js"></script>
    </body>
</html>
