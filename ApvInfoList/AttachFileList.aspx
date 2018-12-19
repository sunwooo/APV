<%@ Page Language="C#" AutoEventWireup="true" CodeFile="AttachFileList.aspx.cs" Inherits="Approval_ApvInfoList_AttachFileList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>첨부파일</title>
    <script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>
    <script language="javascript" type="text/javascript" src="ApvLineOthers.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr id="trclose">
                <td height="10px" align="right">
                    <img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_x.gif" onclick="javascript:parent.PopLayer.style.display='none';" />&nbsp;
                </td>
            </tr>
		    <tr>
			    <td valign="top">
				    <div id='divGalTable'>
				    </div>
				    <div id='divErrorMessage' class='errormessage'></div>
			    </td>
		    </tr>
	    </table>
	    <iframe id="download" src="" name="download" style="display:none;"></iframe>
    </form>
    <script language="javascript" type="text/javascript">      
    var strMessageNoData = "<%= Resources.Approval.msg_160 %>"; 
    var strNum = "<%= Resources.Approval.lbl_no %>";
    var strFileName = "<%= Resources.Approval.lbl_FileName %>";
    var strUserName = "<%= Resources.Approval.lbl_name3 %>";
    var strDeptName = "<%= Resources.Approval.lbl_dept %>";
    var fmpf = "<%=Request.QueryString["fmpf"] %>";
    var fmrv = "<%=Request.QueryString["fmrv"] %>";
    var fiid = "<%=fiid %>"; 
    var piid = "<%=piid %>"; 
    var type = "<%=Request.QueryString["type"] %>";
    var archive = "<%=Request.QueryString["archive"] %>";
    var uslng = "<%=culturecode %>";
    var gLngIdx = <%=strLangIndex %>;

    if(parent.location.href.toUpperCase().indexOf("LISTITEMSAPPROVELINE.ASPX")>-1){
        document.getElementById('trclose').style.display = "none";
    }else{
        document.getElementById('trclose').style.display = "";
    }
    </script>
</body>
</html>
