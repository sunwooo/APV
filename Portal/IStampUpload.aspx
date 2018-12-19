<%@ Page Language="C#" AutoEventWireup="true" CodeFile="IStampUpload.aspx.cs" Inherits="Approval_Portal_IStampUpload" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>제목 없음</title>
    <script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
<script language="javascript" type="text/javascript">
		<!--
			function setMode(sMode){
				Form1.mode.value = sMode;
			}
		
			function ShowProgress()
			{
				strAppVersion = navigator.appVersion;
				
				if (document.Form1.MyFile.value != "") 
				{
					ProgressID = (new Date()).getTime() % 1000000;
					if (ProgressID==0) ProgressID = 1000000;
					
					if (strAppVersion.indexOf('MSIE') != -1 && strAppVersion.substr(strAppVersion.indexOf('MSIE')+5,1) > 4) {
						winstyle = "dialogWidth=385px; dialogHeight:160px; center:yes";
						window.showModelessDialog("../Progress/show_progress_IE.aspx?ProgressID="+ProgressID, null, winstyle);
					}
					else {
						winpos = "left=" + ((window.screen.width-380)/2) + ",top=" + ((window.screen.height-110)/2);
						winstyle="width=380,height=110,status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=no,copyhistory=no," + winpos;
						var strNewFearture = ModifyWindowFeature(winstyle);
	                    window.open("../Progress/show_progress_NN.aspx?ProgressID="+ProgressID,null,strNewFearture);
	                    //window.open("../Progress/show_progress_NN.aspx?ProgressID="+ProgressID,null,winstyle);
					}
					
					document.Form1.action = "iStampUpload.aspx?ProgressID=" + ProgressID;
				}
				
				return true;
			}	
	        
		//-->
		</script>    
</head>
<body>
		<form enctype="multipart/form-data" runat="server" ID="Form1" name="Form1" onsubmit="">
			<table width="100%"  border="0" cellpadding="0" cellspacing="1" bgcolor="#ffffff">
				<tr>
					<td>
						<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff">
							<tr>
								<td height="25" align="center">
								    <input type="file" id="MyFile" size="25" runat="server" name="MyFile" style="height:25px;" />
								</td>
							</tr>
							<tr height="12px">
							    <td></td>
							</tr>
							<tr class="back_grad">
								<td height="25" align="center" valign="top">
								<table border="0" cellpadding="0" cellspacing="0" style="padding-left:3px">
								<tr>
								    <td>
								        <!-- 더미버튼 Width=0 -->
								        <asp:ImageButton Width="0" Runat="server" ID="imgUpload" ImageUrl="/COVINet/images/button/btn_add.gif" OnClick="imgUpload_Click"></asp:ImageButton>
								    </td>
								    <td>
												<table border="0" cellpadding="0" cellspacing="0" width="100%" style="height:25px" onclick="<%= Page.GetPostBackEventReference(this.imgUpload) %>">
													<tr><td align="left">
															<a id="ctl00_UserContentsHolder_ctl01_btnUpdate" class="Btn01" href="#"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_save.gif" align="absmiddle" border=0 /><%=Resources.Approval.btn_add %></span></a>
														</td>
													</tr>
												</table>								    
								    </td>
								</tr>
								</table>
								</td>
							</tr>
						    <tr>
                    <td height="30" valign="top"><hr /><font color="red">&nbsp;&nbsp;&nbsp;<%=Resources.Approval.msg_206 %></font><br /><font color="blue">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<%=Resources.Approval.msg_330%> </font></td>
               </tr>
						</table>
					</td>
				</tr>
			</table>
			<input type="hidden" name="mode" id="mode" value="sign" runat="server" />
		</form>
</body>
</html>
