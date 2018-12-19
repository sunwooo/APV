<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ContextMenu4HTML.aspx.cs" Inherits="Approval_Portal_HTML_ContextMenu" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>제목 없음</title>
</head>
<body>
    <!--context Menu-->
<div id="divContextApproval"  container='1' style='overflow:hidden;position:absolute;visibility:hidden;display:none;z-index:12000;'>
   <div submenu='1' id='Context_MainM' class="Ctx_Table1" style='position: relative; background-image: url(http:<%=Session["user_thema"] %>/Covi/Common/icon/cont_back.gif); background-repeat: repeat-y;' igLevel='0'>
    <div scrollDiv=1>
    <table border='0' cellpadding='2' cellspacing='0' class="Ctx_Table1" style='background-image:url(<%=Session["user_thema"] %>/Covi/Common/icon/cont_back.gif); background-repeat: repeat-y; border-width: 0;'>

<%if (this.Page.Application["ContextMenu_PROFILE_YN"].ToString() == "Y")
  { %>    
    <tr igitem='1'  onmouseover="this.style.fontSize='8pt';this.className='Ctx_MouseOver';" onmouseout="this.className='Ctx_Table2';">
        <td>
            <table width='100%' cellpadding='2' cellspacing='0' id='UxOMContextMenu1CoviMenuContext_1' Tag='Profile'  igTop='1' onclick="parent.fnMenuClick_go(this)"   class="Ctx_Table2">
                <tr>
                <td width='25px' ><img  src='<%=Session["user_thema"] %>/Covi/Common/icon/icon_profile.gif'></td>
                <td igtxt='1' align='left'> <nobr><%=Resources.Approval.lbl_ctxmenu_01 %></nobr> </td>
                <td width="15"></td>
               </tr>
            </table>
        </td>
   </tr>
<% } %>
<%if (this.Page.Application["ContextMenu_MEMO_YN"].ToString() == "Y")
  { %>
    <tr igitem='1'  onmouseover="this.style.fontSize='8pt';this.className='Ctx_MouseOver';" onmouseout="this.className='Ctx_Table2';">
        <td>
            <table width='100%' cellpadding='2' cellspacing='0' id='UxOMContextMenu1CoviMenuContext_2' Tag='Message'  igTop='1' onclick="parent.fnMenuClick_go(this)"  class="Ctx_Table2">
            <tr>
            <td width='25px' ><img  src='<%=Session["user_thema"] %>/Covi/Common/icon/icon_slip.gif'></td>
            <td igtxt='1' align='left'> <nobr><%=Resources.Approval.lbl_ctxmenu_02 %></nobr> </td>
            <td width="15"></td>
            </tr>
            </table>
        </td>
    </tr>
<% } %>    
<%if (this.Page.Application["ContextMenu_CHAT_YN"].ToString() == "Y")
  { %>    
    <tr igitem='1'  onmouseover="this.style.fontSize='8pt';this.className='Ctx_MouseOver';" onmouseout="this.className='Ctx_Table2';">
        <td>
            <table width='100%' cellpadding='2' cellspacing='0' id='UxOMContextMenu1CoviMenuContext_3' Tag='Chatting'  igTop='1' onclick="parent.fnMenuClick_go(this)"   class="Ctx_Table2">
            <tr>
            <td width='25px' ><img  src='<%=Session["user_thema"] %>/Covi/Common/icon/icon_chat.gif'></td>
            <td igtxt='1' align='left'> <nobr><%=Resources.Approval.lbl_ctxmenu_03 %></nobr> </td>
            <td width="15"></td></tr>
            </table>
         </td>
     </tr>   
<% } %>    
<%if (this.Page.Application["ContextMenu_MAIL_YN"].ToString() == "Y")
  { %>      
     <tr igitem='1'  onmouseover="this.style.fontSize='8pt';this.className='Ctx_MouseOver';" onmouseout="this.className='Ctx_Table2';">
        <td>
            <table width='100%' cellpadding='2' cellspacing='0' id='UxOMContextMenu1CoviMenuContext_4' Tag='Mail'  igTop='1' onclick="parent.fnMenuClick_go(this)"   class="Ctx_Table2" mailurl='<%=System.Configuration.ConfigurationManager.AppSettings["OWAUrl"].ToString()%>' mailsuffix = '<%=System.Configuration.ConfigurationManager.AppSettings["MailSuffix"].ToString()%>'>
            <tr>
                <td width='25px' ><img  src='<%=Session["user_thema"] %>/Covi/Common/icon/icon_mail.gif'></td>
                <td igtxt='1' align='left'> <nobr><%=Resources.Approval.lbl_ctxmenu_04 %></nobr> </td>
                <td width="15"></td>
            </tr>
            </table>
        </td>
       </tr>
<% } %>    
<%if (this.Page.Application["ContextMenu_SMS_YN"].ToString() == "Y")
  { %>        
      <tr igitem='1'  onmouseover="this.style.fontSize='8pt';this.className='Ctx_MouseOver';" onmouseout="this.className='Ctx_Table2';">
          <td>
              <table width='100%' cellpadding='2' cellspacing='0' id='UxOMContextMenu1CoviMenuContext_5' Tag='SMS'  igTop='1' onclick="parent.fnMenuClick_go(this)"   class="Ctx_Table2">
               <tr>
                   <td width='25px' ><img  src='<%=Session["user_thema"] %>/Covi/Common/icon/icon_sms.gif'></td>
                   <td igtxt='1' align='left'> <nobr><%=Resources.Approval.lbl_ctxmenu_05 %></nobr> </td>
                   <td width="15"></td>
               </tr>
               </table>
           </td>
       </tr>
<% } %>    
<%if (this.Page.Application["ContextMenu_BLOG_YN"].ToString() == "Y")
  { %>        
       <tr igitem='1'  onmouseover="this.style.fontSize='8pt';this.className='Ctx_MouseOver';" onmouseout="this.className='Ctx_Table2';">
           <td>
               <table width='100%' cellpadding='2' cellspacing='0' id='UxOMContextMenu1CoviMenuContext_6' Tag='Blog'  igTop='1'   onclick="parent.fnMenuClick_go(this)"  class="Ctx_Table2">
               <tr>
                   <td width='25px' ><img  src='<%=Session["user_thema"] %>/Covi/Common/icon/icon_blog.gif'></td>
                   <td igtxt='1' align='left'> <nobr><%=Resources.Approval.lbl_ctxmenu_06 %></nobr> </td>
                   <td width="15"></td>
               </tr>
               </table>
           </td>
       </tr>
<% } %>       
       </table>
       </div>
       <span style="display:none" id="UxOM_ContextMenu1_CoviMenuContext" name="UxOM_ContextMenu1_CoviMenuContext"></span>
       <input type="hidden" id="UxOM_ContextMenu1$CoviMenuContext" name="UxOM_ContextMenu1$CoviMenuContext" value="" /> 
       </div>
       </div> 
        <style type="text/css">
        <!--
        .TopHover9 {  background:Orange;  border-color:#316AC5;  border-style:Solid;  border-width:1px;  cursor:pointer; cursor:Hand;   } 
        -->
        </style>
        <div id="abs_UxOMContextMenu1CoviMenuContext" style="display:none;"></div></body>
</html>
