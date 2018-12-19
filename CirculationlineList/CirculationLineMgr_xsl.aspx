<%@ Page Language="C#" AutoEventWireup="true" CodeFile="CirculationLineMgr_xsl.aspx.cs" Inherits="COVIFlowNet_CirculationlineList_CirculationLineMgr_xsl" %>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output media-type="text/html"/>
	<xsl:template match="/">
		<table width="100%"  border="0" cellspacing="0" cellpadding="0" class="BTable" style="clear: both; margin: 0; padding: 0;">
			<thead>
				<tr class="BTable_bg02" style="height:25px;background-color: #f5ebe2;color: #823300;">
					  <td width="7%" height="25" align="center" valign="middle" class="table_mgraybg"></td>
					  <td  nowrap="t" width="30%" height="25" align="center" valign="middle" class="table_mgraybg" style="font-size:9pt;"><b><%= Resources.Approval.lbl_Circulationline_name%></b></td>
					  <td width="10%" height="25" align="center" valign="middle" class="table_mgraybg"></td>
					  <td width="53%" height="25" align="center" valign="middle" class="table_mgraybg" style="font-size:9pt;"><b><%= Resources.Approval.lbl_desc%></b></td>
				</tr>
				<tr>
				  <td height="1" colspan="4" align="center"  class="table_line"></td>
				</tr>
			</thead>
			<tbody>
			<xsl:for-each select="response/item">
				<tr><xsl:attribute name="id"><xsl:value-of select="id"/></xsl:attribute>
                    <td nowrap="t" valign="middle" align="center">
                        <input type="radio" name="rChk" onclick="changerChk()"><xsl:attribute name="id"><xsl:value-of
                            select="id" />
                        </xsl:attribute><xsl:attribute name="signlistname"><xsl:value-of select="signlistname" />
                        </xsl:attribute><xsl:attribute name="dscr"><xsl:value-of select="dscr" />
                        </xsl:attribute></input></td>
					<td nowrap="t" valign="middle" align="center" style="font-size:12px;"><xsl:value-of select="signlistname"/></td>
					<td nowrap="t"></td>
					<td nowrap="t" style="font-size:12px;"><xsl:value-of select="dscr"/></td>
				</tr>
				<tr>
				  <td height="1" colspan="4"  class="table_line"></td>
				</tr>
			</xsl:for-each>
			</tbody>
		</table>
	</xsl:template>
</xsl:stylesheet>

