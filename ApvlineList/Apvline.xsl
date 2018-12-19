<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output media-type="text/html"/>
	<xsl:template match="/">
		<table width="100%"  border="0" cellspacing="0" cellpadding="0">
			<thead>
				<tr>
				  <td height="20" align="center" valign="middle" width="30px" class="table_green">&#160;</td>
				  <td height="20" align="center" valign="middle" class="table_mgreenbg">결재선 이름</td>
				  <td align="center" valign="middle" class="table_green">결재선 요약</td>
				</tr>
				<!--<tr>
				  <td height="1" colspan="3" align="center"  class="table_line"></td>
				</tr>-->
        <tr>
          <td height="1" colspan="3" bgcolor="#cdd8e1"></td>
        </tr>
        <tr>
          <td height="3" colspan="3" bgcolor="#f5f5f5"></td>
        </tr>        
			</thead>
			<tbody>
			<xsl:for-each select="response/item">
				<tr style="cursor:hand;background-Color:#FFFFFF;" onMouseOver = "this.style.backgroundColor = '#EEF7F9'" onMouseOut = "this.style.backgroundColor = '#FFFFFF'">
					<xsl:attribute name="id"><xsl:value-of select="id"/></xsl:attribute>
					<td height="20"  nowrap="t" valign="middle" align="center"><input type="radio" name="rChk" onclick="changerChk()"><xsl:attribute name="id"><xsl:value-of select="id"/></xsl:attribute><xsl:attribute name="title"><xsl:value-of select="signlistname"/></xsl:attribute><xsl:attribute name="dscr"><xsl:value-of select="dscr"/></xsl:attribute></input></td>
					<td nowrap="t" valign="middle" align="center"><xsl:value-of select="signlistname"/></td>
					<td nowrap="t"><xsl:value-of select="abstract"/></td>
				</tr>
				<!--<tr>
				  <td height="1" colspan="3"  class="table_line"></td>
				</tr>-->
        <tr>
          <td height="1" colspan="3" bgcolor="#cdd8e1"></td>
        </tr>
        <tr>
          <td height="3" colspan="3" bgcolor="#f5f5f5"></td>
        </tr>
      </xsl:for-each>
			</tbody>
		</table>
	</xsl:template>
</xsl:stylesheet>
