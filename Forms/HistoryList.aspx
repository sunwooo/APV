<%@ Page Language="C#" AutoEventWireup="true" CodeFile="HistoryList.aspx.cs" Inherits="COVIFlowNet_Forms_HistoryList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
	<title></title>
    <style type="text/css">
        a.a1 {color:DarkOrange; text-decoration:underline}
    </style>
	<script type="text/javascript" language="javascript" src="/CoviWeb/common/script/COVIFlowNet/openWindow.js"></script>
	<script type="text/javascript" language="javascript">
	    function openURL(szURL) {
			document.getElementById("iframefrm").src = szURL;
		}
	</script>
</head>
<body>
    <div class="popup_title">
      <div class="title_tl">
        <div class="title_tr">
          <div class="title_tc">
          <h2><span><%= Resources.Approval.lbl_chglogsearch %></span></h2></div>
        </div>
      </div>
    </div>

        <table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">	
            <tr height="10%">
                <td colspan="2" align="center" valign="top" class="pop_bg">
                    <table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
                       <thead>
                            <tr>
                              <td height="2" colspan="4" class="BTable_bg01"></td>
                            </tr>
	                        <tr class="BTable_bg02" style="height:25px">
	                             <%--<td width="15%" valign="middle"><%= Resources.Approval.lbl_revision %></td>--%>
	                             <td width="20%" valign="middle"><%= Resources.Approval.lbl_chgdate %></td>
	                             <td width="20%" valign="middle"><%= Resources.Approval.lbl_chgname %></td>
                                 <td width="20%" valign="middle"><%= Resources.Approval.lbl_chgAsname %></td>
                                 <td width="40%" valign="middle"><%= Resources.Approval.lbl_chgcoment %></td>
	                        </tr>
	                        <tr>
                              <td height="1" colspan="4" class="BTable_bg03"></td>
                            </tr>
                       </thead>
                       <tbody>
	                         <%=sbodylist %>
                       </tbody>
                    </table>
                </td>
            </tr>
		    <tr>
			    <td height="1" colspan="2" class="BTable_bg03"></td>
		    </tr>
		    <tr >
			    <td colspan="2" align="center" valign="top" height="500px">
			        <iframe frameborder="0" id="iframefrm" src='' width="99%" height="100%" style="overflow:hidden;"></iframe>
			    </td>
		    </tr>
	    </table>

    <div class="popup_Btn small AlignR">
        <a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:parent.window.close();"><span><%= Resources.Approval.btn_close %></span></a>
    </div>	 
</body>
</html>
