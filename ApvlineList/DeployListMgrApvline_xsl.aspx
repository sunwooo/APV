<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DeployListMgrApvline_xsl.aspx.cs" Inherits="COVIFlowNet_ApvlineList_DeployListMgrApvline_xsl" %><?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output media-type="text/html"/>
	<xsl:template match="/">
		<table width="100%"  border="0" cellspacing="0" cellpadding="0">
			<thead>
				<tr class="BTable_bg02" style="height:25px">
					<td width="7%" height="25px" align="center" valign="middle" ></td>
					<td width="33%" height="25px" align="center" valign="middle" ><%= Resources.Approval.lbl_Name2 %></td>
					<td width="60%" height="25px" align="center" valign="middle" ><%= Resources.Approval.lbl_desc %></td>
				</tr>
				<tr>
					<td height="1" colspan="3" align="center"  class="BTable_bg03"></td>
				</tr>
			</thead>
			<tbody>
				<xsl:for-each select="response/NewDataSet/Table">
					<tr height="25px">
						<xsl:attribute name="id">
							<xsl:value-of select="GROUP_CODE"/>
						</xsl:attribute>
						<td nowrap="t" valign="middle" align="center">
							<input type="CheckBox" id="chkRowSelect"  name="chkRowSelect" onclick="changeChecked(event)">
								<xsl:attribute name="strid">
									<xsl:value-of select="GROUP_CODE"/>
								</xsl:attribute>
								<xsl:attribute name="strname">
									<xsl:value-of select="NAME"/>
								</xsl:attribute>
								<xsl:attribute name="strdscr">
									<xsl:value-of select="DSCR"/>
								</xsl:attribute>
							</input>
						</td>
						<td nowrap="t" valign="middle" align="left">
							<a>
								<xsl:attribute name="href">
									javascript:OpenDeployList('<xsl:value-of select="GROUP_ID"/>')
								</xsl:attribute>
								<xsl:value-of select="NAME"/>
							</a>
						</td>
						<td nowrap="t">
							<xsl:value-of select="DSCR"/>
						</td>
					</tr>
					<tr>
						<td height="1" colspan="3"  class="table_line"></td>
					</tr>
				</xsl:for-each>
			</tbody>
		</table>
	</xsl:template>
</xsl:stylesheet>

