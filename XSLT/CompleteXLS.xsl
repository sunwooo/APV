<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"	
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    xmlns:cfxsl="urn:cfxsl"
    xmlns:cfutil="urn:cfxsl">
	<xsl:output media-type="text/html"/>
	<xsl:param name="lngindex">0</xsl:param>
  <xsl:param name="mode">1</xsl:param>
  <xsl:template match="response">
		<xsl:for-each select="docitem">
			<tr>
				<td valign="top"><xsl:value-of select="cfxsl:getSubKind(string(PF_SUB_KIND))"/></td>
				<td valign="top" style="mso-number-format:\@"><xsl:if test="$mode='9' and PI_BUSINESS_DATA1 ='rejected' ">[R]</xsl:if><xsl:value-of select="PI_SUBJECT"/></td>
				<td valign="top"><xsl:value-of select="PI_FINISHED"/></td>
				<td valign="top"><xsl:value-of select="cfxsl:splitNameExt(PI_INITIATOR_UNIT_NAME,number($lngindex))"/></td>
				<td valign="top"><xsl:value-of select="cfxsl:splitNameExt(PI_INITIATOR_NAME,number($lngindex))"/></td>
				<td valign="top"><xsl:value-of select="FORM_NAME"/></td>
			</tr>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
