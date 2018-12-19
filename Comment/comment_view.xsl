<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
	<table width='100%' border='0' cellpadding='0' cellspacing='0' >
		<xsl:for-each select="//Table">
			<tr style="height:25px">
				<td width="20%" class="BTable_bg08" >
					&#160;
				</td>
				<td width="20%" class="BTable_bg08">
					<xsl:value-of select="USER_NAME"/>
				</td>
				<td width='20%' class="BTable_bg08">
					<xsl:value-of select="INSERT_DATE"/>
				</td>
				<td width='40%' class="BTable_bg08" height='100%' style='padding-left:4; word-break:break-all'>
					<xsl:value-of select="COMMENT"/>
				</td>
			</tr>
		</xsl:for-each>
	</table>
</xsl:template>

</xsl:stylesheet>

