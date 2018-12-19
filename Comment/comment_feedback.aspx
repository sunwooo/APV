<%@ Page Language="C#" AutoEventWireup="true" CodeFile="comment_feedback.aspx.cs" Inherits="Approval_Comment_comment_feedback" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">     
    <title></title>    
</head>
<body>
<form id="myForm" name="myForm" method="post" enctype="multipart/form-data" runat="server">
<div class="popup_title">
  <div class="title_tl">
    <div class="title_tr">
      <div class="title_tc">
      <h2><%= Resources.Approval.lbl_writecomment_01 %></h2></div>
    </div>
  </div>
</div>
<div class="popup_field">
  <fieldset>  
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
      <td class="title"><%=Resources.Approval.lbl_comment_write %></td>
      <td style=" padding-top: 5px; padding-bottom: 5px;"><asp:TextBox ID="txtComment" runat="server" style="width:98%;height:100px;" TextMode="MultiLine" Width="300px"></asp:TextBox></td>
    </tr>
    <tr>
      <td colspan="2" class="line"></td>
    </tr>
  </table>  
  </fieldset>
</div>

<div class="popup_Btn small AlignR">    
    <asp:LinkButton ID="btnAdd" CssClass="Btn04" runat="server" OnClick="BtnAdd_Click" Text="" />    
    <a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:window.close();"><span><%= Resources.Approval.btn_close %></span></a>
</div>
</form>
</body>
</html>
