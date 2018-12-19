<%@ Page Language="C#" MasterPageFile="~/Approval/ApvlineMgr/ApvLineMgr.master" AutoEventWireup="true" CodeFile="ApvLineScForm.aspx.cs" Inherits="Approval_ApvlineMgr_ApvLineScForm" Title="제목 없음" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentHeader" Runat="Server">
        <div class="popup_title">
          <div class="title_tl">
            <div class="title_tr">
              <div class="title_tc">
                <h2><%= Resources.Approval.lbl_apvlinecomment_01 %>&nbsp;&nbsp;&nbsp;&nbsp;<select id='SelEnt' onchange="SetENT(this.value)" style="display:none;"><%=strEntList %></select></h2>
              </div>
            </div>
          </div>
        </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentBottom" Runat="Server">
</asp:Content>

