<%@ Page Language="C#" AutoEventWireup="true" CodeFile="sealdoclistExcelXSL.aspx.cs" Inherits="COVIFlowNet_Doclist_sealdoclistExcelXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output media-type="text/html"/>
<xsl:template match="response">
	<table border="1" cellpadding="2" cellspacing="0" style="TABLE-LAYOUT: fixed;" width="100%" >
			<tr bgcolor="olive">
				<TD align="center" rowspan="2" ><%= Resources.Approval.lbl_SerialNo %></TD>
				<TD align="center" rowspan="2" ><%= Resources.Approval.lbl_date %></TD>
				<TD align="center" rowspan="2" ><%= Resources.Approval.lbl_receive %></TD>
				<TD align="center" rowspan="2" ><%= Resources.Approval.lbl_subject %></TD>
				<TD align="center" rowspan="2" ><%= Resources.Approval.lbl_Copies %></TD>
				<TD align="center" rowspan="2" ><%= Resources.Approval.lbl_Manager %></TD>
				<TD align="center" colspan="3" ><%= Resources.Approval.lbl_app %></TD>
			</tr>
			<tr bgcolor="olive">
				<TD align="center"><%= Resources.Approval.lbl_Section %></TD>
				<TD align="center"><%= Resources.Approval.lbl_SectionChief %></TD>
				<TD align="center"><%= Resources.Approval.lbl_SectionHead %></TD>
			</tr>
		<xsl:for-each select="docitem">
			<tr>
				<td valign="top"><xsl:value-of select="serial"/></td>
				<td valign="top"><xsl:value-of select="apvdt"/></td>
				<td valign="top"><xsl:value-of select="recounm"/></td>
				<td valign="top"><xsl:value-of select="docsubject"/></td>
				<td valign="top"><xsl:value-of select="rgcmt"/></td>
				<td valign="top"><xsl:value-of select="initnm"/></td>
				<td valign="top"></td>
				<td valign="top"></td>
				<td valign="top"></td>
			</tr>
		</xsl:for-each>
	</table>
	</xsl:template>
</xsl:stylesheet>
