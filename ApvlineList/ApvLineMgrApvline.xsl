<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output media-type="text/html"/>
	<xsl:template match="/">
		<table width="100%"  border="0" cellspacing="0" cellpadding="0">
			<thead>
				<tr>
					  <td width="7%" height="25" align="center" valign="middle" class="table_mgraybg"></td>
					  <td width="26%" height="25" align="center" valign="middle" class="table_mgraybg">결재선 이름</td>
					  <td width="67%" height="25" align="center" valign="middle" class="table_mgraybg">결재선</td>
				</tr>
				<tr>
				  <td height="1" colspan="3" align="center"  class="table_line"></td>
				</tr>
			</thead>
			<tbody>
			<xsl:for-each select="response/item">
				<tr><xsl:attribute name="id"><xsl:value-of select="id"/></xsl:attribute>
					<td nowrap="t" valign="middle" align="center"><input type="radio" name="rChk" onclick="changerChk()"><xsl:attribute name="id"><xsl:value-of select="id"/></xsl:attribute><xsl:attribute name="title"><xsl:value-of select="signlistname"/></xsl:attribute><xsl:attribute name="dscr"><xsl:value-of select="dscr"/></xsl:attribute></input></td>
					<td nowrap="t" valign="middle" align="center"><xsl:value-of select="signlistname"/></td>
					<td nowrap="t"><xsl:value-of select="abstract"/></td>
				</tr>
				<tr>
				  <td height="1" colspan="3"  class="table_line"></td>
				</tr>
			</xsl:for-each>
			</tbody>
		</table>
	</xsl:template>
</xsl:stylesheet>
