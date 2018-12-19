<%@ Page Language="C#" AutoEventWireup="true" CodeFile="FileUpload4Net.aspx.cs" Inherits="Approval_FileAttach_FileUpload4Net" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>제목 없음</title>
</head>
<body>
	<form name="oForm" id="oForm" target="result_fr"  enctype="multipart/form-data" method="post" runat="server">
        <div class="popup_title">
          <div class="title_tl">
            <div class="title_tr">
              <div class="title_tc">
              <h2><%= Resources.Approval.msg_189 %></h2></div>
            </div>
          </div>
        </div>
        <div class="popup_field">
	        <table width="100%" border="0" cellpadding="0" cellspacing="0">
		        <tr> <!--찾아보기부분 -->
			        <td style=" padding-top: 5px; padding-bottom: 5px;width:100%;">								
				        <input type="file" id="oFile1" name="oFile1" style="width:98%;" runat="server" size="40" />
			        </td>
		        </tr>
	        </table>
        </div>
        <div class="popup_Btn small AlignR">    
            <asp:LinkButton ID="btnAdd" CssClass="Btn04" runat="server" OnClick="BtnAdd_Click" Text="" />    
            <a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:window.close();"><span><%= Resources.Approval.btn_close %></span></a>
        </div>	
	</form>
	<iframe src="" name="result_fr" height="0%" width="100%" frameborder="0"></iframe>
</body>
</html>
