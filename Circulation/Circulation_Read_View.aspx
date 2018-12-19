<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Circulation_Read_View.aspx.cs" Inherits="COVIFlowNet_Circulation_Circulation_Read_View" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head runat="server">
    <title></title>
</head>
<body>
    <form id="myForm" name="myForm" method="post" runat="server">
    <div class="popup_title">
      <div class="title_tl">
        <div class="title_tr">
          <div class="title_tc">
          <h2><span><%= Resources.Approval.lbl_circulationviewcomment_01 %></span></h2></div>
        </div>
      </div>
    </div>
    <div style="height:290px; overflow:auto; vertical-align:top; margin-left:10px; margin-right:10px; " class="BTable">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
           <thead>
                <tr>
                  <td height="2" colspan="3" class="BTable_bg01"></td>
                </tr>
                <tr class="BTable_bg02" style="height:25px">
                     <td width="35%" valign="middle" style='padding-left:5px;'><%= Resources.Approval.lbl_dept %></td>
                     <td width="35%" valign="middle"><%= Resources.Approval.lbl_circulation_person %></td>
                     <td width="30%" valign="middle"><%= Resources.Approval.lbl_ReceiptDate %></td>
                </tr>
                <tr>
                  <td height="1" colspan="3" class="BTable_bg03"></td>
                </tr>
           </thead>
        </table>                   
        <table width="100%"  border="0" cellspacing="0" cellpadding="0" style="overflow:auto;">
             <%= strCommentView %>
        </table>                
    </div>
    <div class="popup_Btn small AlignR">
        <a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:parent.window.close();"><span><%= Resources.Approval.btn_close %></span></a>
    </div> 
    </form>
</body>
</html>
