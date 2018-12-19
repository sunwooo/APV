<%@ Page Language="C#" AutoEventWireup="true" CodeFile="pubregdoclistExcelXSL.aspx.cs" Inherits="COVIFlowNet_Doclist_pubregdoclistExcelXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output media-type="text/html"/>
<xsl:template match="response">
	<table border="1" cellpadding="2" cellspacing="0" style="TABLE-LAYOUT: fixed;" width="100%">
			<tr bgcolor="olive">
				<TD align="center"><%= Resources.Approval.lbl_RegisterNo %></TD>
				<TD align="center"><%= Resources.Approval.lbl_senddate %></TD>
				<TD align="center"><%= Resources.Approval.lbl_SendNo %></TD>
				<TD align="center"><%= Resources.Approval.lbl_DocName %></TD>
				<TD align="center"><%= Resources.Approval.lbl_DocPages %></TD>
				<TD align="center"><%= Resources.Approval.lbl_ReceiptDate %></TD>
				<TD align="center"><%= Resources.Approval.lbl_Sender %></TD>
				<TD align="center"><%= Resources.Approval.lbl_Confirm %></TD>
			</tr>			
		<xsl:for-each select="docitem">
			<tr>
				<td valign="top"><xsl:value-of select="serial"/></td>			
				<td valign="top"><xsl:value-of select="apvdt"/></td>					
				<td valign="top"><xsl:value-of select="docno"/></td>
				<td valign="top"><xsl:value-of select="docsubject"/></td>
				<td valign="top"><xsl:value-of select="rgcmt"/></td>
				<td valign="top"><xsl:value-of select="recounm"/></td>
				<td valign="top"><xsl:value-of select="rgnm"/></td>
				<td valign="top"></td>			
			</tr>
		</xsl:for-each>
	</table>
</xsl:template>
</xsl:stylesheet>
