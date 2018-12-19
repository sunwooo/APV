<%@ Page Language="C#" AutoEventWireup="true" CodeFile="pubrecdoclistExcelXSL.aspx.cs" Inherits="COVIFlowNet_Doclist_pubrecdoclistExcelXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output media-type="text/html"/>
<xsl:template match="response">
		<table border="1" cellpadding="2" cellspacing="0" style="TABLE-LAYOUT: fixed;"  width="100%" >
			<tr bgcolor="olive">
				<TD align="center"><%= Resources.Approval.lbl_SerialNo %></TD>
				<TD align="center"><%= Resources.Approval.lbl_receivedate %></TD>
				<TD align="center"><%= Resources.Approval.lbl_SenderName %></TD>
				<TD align="center"><%= Resources.Approval.lbl_DocNo %></TD>
				<TD align="center"><%= Resources.Approval.lbl_ManageDept %></TD>
				<TD align="center"><%= Resources.Approval.lbl_ReceiverName %></TD>
				<TD align="center"><%= Resources.Approval.lbl_Remark %></TD>
				<TD align="center"><%= Resources.Approval.lbl_ManageState %></TD>
			</tr>
		<xsl:for-each select="docitem">
			<tr>
				<td valign="top"><xsl:value-of select="serial"/></td>
				<td valign="top"><xsl:value-of select="rgdt"/></td>
				<td valign="top"><xsl:value-of select="senounm"/></td>
				<td valign="top"><xsl:value-of select="docno"/></td>
				<td valign="top"><xsl:value-of select="recounm"/></td>
				<td valign="top"><xsl:value-of select="chargenm"/></td>
				<td valign="top"><xsl:value-of select="rgcmt"/></td>
				<td valign="top"><xsl:value-of select="effectcmt"/></td>
			</tr>
		</xsl:for-each>
		</table>
	</xsl:template>
</xsl:stylesheet>
