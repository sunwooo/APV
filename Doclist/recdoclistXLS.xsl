<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cfxsl="urn:cfxsl"
    xmlns:cfutil="urn:cfxsl">
	<xsl:output media-type="text/html"/>
	<xsl:param name="lngindex">0</xsl:param>
<xsl:template match="response">

		<xsl:for-each select="docitem">
			<tr>
				<td valign="top"><xsl:value-of select="serial"/></td>
				<td valign="top"><xsl:value-of select="rgdt"/></td>
				<td valign="top"><xsl:value-of select="cfxsl:splitNameExt(senounm,number($lngindex))"/></td>
				<td valign="top"><xsl:value-of select="docno"/></td>
				<td valign="top"><xsl:value-of select="docsubject"/></td>
				<td valign="top"><xsl:value-of select="cfxsl:splitNameExt(chargenm,number($lngindex))"/></td>
			</tr>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
