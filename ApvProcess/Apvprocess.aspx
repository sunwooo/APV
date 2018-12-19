<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Apvprocess.aspx.cs" Inherits="COVIFlowNet_ApvProcess_Apvprocess" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
	<script type="text/javascript" language="javascript" src="../../common/script/CFL.js"></script>
	
</head>
<body leftmargin="0" topmargin="0" rightmargin="0">
<div class="popup_title">
  <div class="title_tl">
    <div class="title_tr">
      <div class="title_tc">
      <h2><%= Resources.Approval.lbl_approve %></h2></div>
    </div>
  </div>
</div>
        <%--<iframe ID="Apvact" name="Apvact" frameborder="0" style="WIDTH:100%;HEIGHT:208px" src="Apvact.aspx"></iframe>--%>
        <iframe ID="Apvact" name="Apvact" frameborder="0" style="WIDTH:100%;HEIGHT:308px" src="Apvact.aspx"></iframe>
		<table border="0" cellpadding="0" cellspacing="0" style="display:none">
            <tr align="center">
                <td align="left"><img src="/GWImages/common/btn/btn_appr01_left.gif" alt=""/></td>
                <td class="btn_bg" onclick="document.all['processlist'].style.display=''; fn_resizeWindow('open'); bt_ApvlistView.style.display='none';  bt_ApvlistClose.style.display='';" id="bt_ApvlistView">
                    <%= Resources.Approval.btn_viewapv %>
                </td>
                <td class="btn_bg" onclick="document.all['processlist'].style.display='none';  fn_resizeWindow('close'); bt_ApvlistClose.style.display='none'; bt_ApvlistView.style.display=''; "  id="bt_ApvlistClose" style="display:none;">
                    <%= Resources.Approval.btn_closeapv%>
                </td>
                <td align="right"><img src="/GWImages/common/btn/btn_appr01_right.gif" alt=""/></td>
                <td>&nbsp;</td>                       
            </tr>
        </table>
		<IFRAME ID="processlist" name="processlist" FRAMEBORDER="0" style="WIDTH:98%;HEIGHT:540px;display:none;"
			SRC="../ApvlineMgr/ApvlineProcess.aspx"></IFRAME>
</body>
</html>
<script type="text/javascript" language="javascript">
		var g_height = "300";
		var display_flag = "close";
//		window.resizeTo(660,320);
        window.resizeTo(580,330);
		//var sy = window.screen.height / 2 - 320 / 2 + 40;
		var sy = window.screen.height / 2 - g_height - 40;
		var sx = window.screen.width  / 2 - 660 / 2;
		window.moveTo(sx, sy);
		
		//2005.12.23 by wolf 창사이즈 수정
		function fn_resizeWindow(optMode){
			if(display_flag == 'close' && optMode == 'open'){ 
				window.resizeTo(920, 1050); 
				sy = window.screen.height / 2 - 950 / 2 - 40;
				sx = window.screen.width  / 2 - 900 / 2;
				window.moveTo(sx, sy);
				display_flag = 'open'
				try{
					//소속 부서원 표시
//					if(!processlist.iSearch.buse.checked){
//						processlist.iSearch.initFlag.value = "Y";
//						processlist.iSearch.btnFind.onclick();
//						processlist.iSearch.initFlag.value = "";
//					}
				}catch(e){}
			}
			if(display_flag == 'open' && optMode == 'close'){ 
				window.resizeTo(660, 280); 
				sy = window.screen.height / 2 - 280 / 2 - 40;
				sx = window.screen.width  / 2 - 660 / 2;
				window.moveTo(sx, sy);
				display_flag = 'close'
			}
		}
	
	</script>
