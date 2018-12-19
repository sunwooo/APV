<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ReceiptListXSL.aspx.cs" Inherits="Approval_ApvInfoList_ReceiptListXSL" %><?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    xmlns:cfxsl="urn:cfxsl"
    xmlns:cfutil="urn:cfxsl">

<xsl:param name="lngindex">0</xsl:param>
<xsl:template match="/">
  <table border="0" cellpadding="0" cellspacing="0" class="BTable" style="TABLE-LAYOUT: fixed;" width="100%">
    <tr>
      <td height="2" colspan="7" class="BTable_bg01"></td>
    </tr>
    <tr class="BTable_bg02" style="height:25px">
      <th style=" padding-left:10px"><%= Resources.Approval.lbl_RecvDept %></th>
      <th><%= Resources.Approval.lbl_receiver %></th>
      <th><%= Resources.Approval.lbl_receiptIs %></th>
      <th><%= Resources.Approval.lbl_processState %></th>
      <th><%= Resources.Approval.lbl_result %></th>
      <th><%= Resources.Approval.lbl_receipt_time %></th>
      <th><%= Resources.Approval.lbl_complete_time %></th>
    </tr>
	<tr>
	    <td height="1" colspan="7" class="BTable_bg03"></td>
	</tr> 
	<tr>
      <td height="5px"  colspan="7" align="center" > </td>
    </tr>   
    <xsl:choose>
      <xsl:when test="count(//Table) = 0 ">
        <tr>
          <td height="5px"  colspan="7" align="center" > </td>
        </tr>
        <tr>
          <td  colspan="7" align="center" >
            <%= Resources.Approval.msg_160 %>
          </td>
        </tr>
      </xsl:when>
      <xsl:otherwise>
        <xsl:for-each select="//Table">
          <tr class="td_list_a">
            <td class="pad_l_5" >
              <div style='width:100%;height:20px;line-height:20px;overflow:hidden;'>
                <xsl:value-of select="cfxsl:splitNameExt(PF_PERFORMER_NAME,$lngindex)"/>
              </div>
            </td>
            <td class="pad_l_5"  >
              <xsl:value-of  select="cfxsl:splitNameExt(substring-before(substring-after(WI_DSCR,'@'),'@'),$lngindex)"/>
            </td>
            <td class="pad_l_5"  >
				<xsl:if test="WI_STATE = '528'">
				<%=Resources.Approval.btn_receipt %>
				</xsl:if>
				<xsl:if test="WI_STATE = '288'">
				<%=Resources.Approval.lbl_inactive %>
				</xsl:if>
				<xsl:if test="WI_STATE = '544'">
				<%=Resources.Approval.btn_cancel %>
				</xsl:if>
				<xsl:if test="WI_STATE = '545'">
				<%=Resources.Approval.btn_cancel %>
				</xsl:if>
				<xsl:if test="WI_STATE = '546'">
				<%=Resources.Approval.btn_cancel %>
				</xsl:if>
            </td>
            <td class="pad_l_5"  >
				<xsl:if test="PI_STATE = '528'">
				<%=Resources.Approval.lbl_completed%>
				</xsl:if>
				<xsl:if test="PI_STATE = '288'">
				<%=Resources.Approval.lbl_Processing %>
				</xsl:if>
				<xsl:if test="PI_STATE = '544'">
				<%=Resources.Approval.btn_cancel %>
				</xsl:if>
				<xsl:if test="PI_STATE = '545'">
				<%=Resources.Approval.btn_cancel %>
				</xsl:if>
				<xsl:if test="PI_STATE = '546'">
				<%=Resources.Approval.btn_cancel %>
				</xsl:if>
            </td>
            <td class="pad_l_5"  >
				<xsl:if test="PI_BUSINESS_STATE = '02_01_01'">
				<%=Resources.Approval.lbl_Approved %>
				</xsl:if>
				<xsl:if test="PI_BUSINESS_STATE = '02_01_02'">
				<%=Resources.Approval.lbl_Approved %>
				</xsl:if>
				<xsl:if test="PI_BUSINESS_STATE = '02_01_03'">
				<%=Resources.Approval.lbl_Approved %>
				</xsl:if>
				<xsl:if test="PI_BUSINESS_STATE = '02_01_04'">
				<%=Resources.Approval.lbl_Approved %>
				</xsl:if>
				<xsl:if test="PI_BUSINESS_STATE = '02_01_05'">
				<%=Resources.Approval.lbl_Approved %>
				</xsl:if>
				<xsl:if test="PI_BUSINESS_STATE = '02_01_06'">
				<%=Resources.Approval.lbl_Approved %>
				</xsl:if>
				<xsl:if test="PI_BUSINESS_STATE = '02_02_01'">
				<%=Resources.Approval.lbl_reject %>
				</xsl:if>
				<xsl:if test="PI_BUSINESS_STATE = '02_02_02'">
				<%=Resources.Approval.lbl_reject %>
				</xsl:if>
				<xsl:if test="PI_BUSINESS_STATE = '02_02_03'">
				<%=Resources.Approval.lbl_reject %>
				</xsl:if>
				<xsl:if test="PI_BUSINESS_STATE = '02_02_04'">
				<%=Resources.Approval.lbl_reject %>
				</xsl:if>
				<xsl:if test="PI_BUSINESS_STATE = '02_02_05'">
				<%=Resources.Approval.lbl_reject %>
				</xsl:if>
				<xsl:if test="PI_BUSINESS_STATE = '02_02_06'">
				<%=Resources.Approval.lbl_reject %>
				</xsl:if>
            </td>
            <td class="pad_l_5"  >
              <xsl:value-of select="WI_FINISHED"/>
            </td>
            <td class="pad_l_5"  >
              <xsl:value-of select="PI_FINISHED"/>
            </td>
          </tr>
        </xsl:for-each>
      </xsl:otherwise>
    </xsl:choose>
  </table>
</xsl:template>

</xsl:stylesheet> 

