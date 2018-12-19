<%@ Page Language="C#" AutoEventWireup="true" CodeFile="button.aspx.cs" Inherits="COVIFlowNet_Address_button" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
</head>
<body style="overflow:hidden;">
<div class="popup_Btn small AlignR" style=" margin-left:0; margin-top:0; margin-right:0;">
  <a href="#" class="Btn04" id="Img1" name="cbBTN" onClick="javascript:parent.frames[4].okClicked();"><span><%= Resources.Approval.btn_confirm %></span></a> 
  <a href="#" class="Btn04" id="Img2" name="cbBTN" onClick="javascript:parent.frames[4].cancelClicked();"><span><%= Resources.Approval.btn_close %></span></a>
</div>                          
</body>
</html>
