<%@ Page Language="C#" MasterPageFile="CirculationMgr.master" AutoEventWireup="true" CodeFile="CirculationManager.aspx.cs" Inherits="COVIFlowNet_Circulation_CirculationManager" Title="Untitled Page" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentHeader" Runat="Server">
        <script>
        function send(){
            g_openType=sel.value;                                                                                                                                                                                                             return;
        }
        </script>
		<tr class="table_green">
			<td width="24%" height="40" align="left" valign="middle">&nbsp;&nbsp;&nbsp;<img src="/COVINet/images/icon/icon_pop.gif" width="27" height="18" align="absMiddle">
				<span class="text-blue2">수신/참조/회람 </span></td>
			<td align="right" valign="bottom" class="right10px">&nbsp;
			</td>
		</tr>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentBottom" Runat="Server">     
			<br>
			<table border="0" cellpadding="0" cellspacing="0" >
			    <tr>        
			        <td>
			            <table border="0" cellpadding="0" cellspacing="0" id="btSend" name="cbBTN" onClick="doButtonAction(this);" style="CURSOR:hand; margin-right:2px">
                            <tr align="center">
                                <td align="left"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_left.gif" alt=""/></td>
                                <td class="btn_bg"><%= Resources.Approval.btn_confirm  %></td>
                                <td align="right"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_right.gif" alt=""/></td>
                            </tr>
                        </table> 
				    </td>
				    <td>
                        <table border="0" cellpadding="0" cellspacing="0" id="btClose" name="cbBTN" onClick="doButtonAction(this);" style="CURSOR:hand; margin-right:2px">
                            <tr align="center">
                                <td align="left"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_left.gif" alt=""/></td>
                                <td class="btn_bg"><%= Resources.Approval.btClose%></td>
                                <td align="right"><img src="<%=Session["user_thema"] %>/common/btn/btn_appr01_right.gif" alt=""/></td>
                            </tr>
                        </table> 
				    </td>
				</tr>
		    </table>
			<br>
			<br>
</asp:Content>

