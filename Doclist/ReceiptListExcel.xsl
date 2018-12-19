<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    xmlns:cfxsl="urn:cfxsl"
    xmlns:cfutil="urn:cfxsl">
	<xsl:output media-type="text/html"/>
	<xsl:param name="lngindex">0</xsl:param>	
	<xsl:template match="/">
			<xsl:choose>
				<xsl:when test="count(//Table) = 0 ">
					<tr >
						<td  colspan="3"   align="center">
							데이터가 없습니다.
						</td>
					</tr>
				</xsl:when>
				<xsl:otherwise>
					<xsl:for-each select="//Table">
						<tr >
							<xsl:attribute name="workitemid">
								<xsl:value-of select="WI_DSCR"/>
							</xsl:attribute>
							<td>
								<xsl:value-of select="cfxsl:splitNameExt(PF_PERFORMER_NAME,number($lngindex))"/>
							</td>
							<td>
								<xsl:value-of select="cfxsl:splitName(WI_DSCR,number($lngindex))"/>
							</td>
							<td>
								<xsl:value-of select="cfxsl:convertWState(WI_STATE)"/>
							</td>
							<td>
								<xsl:value-of select="cfxsl:convertPState(PI_STATE)"/>
							</td>
							<td>
								<xsl:value-of select="cfxsl:convertBState(PI_BUSINESS_STATE)"/>
							</td>
							<td>
								<xsl:value-of select="PI_STARTED"/>
							</td>
							<td>
								<xsl:value-of select="WI_FINISHED"/>
							</td>
							<td>
								<xsl:value-of select="PI_FINISHED"/>
							</td>							
						</tr>
					</xsl:for-each>
				</xsl:otherwise>
			</xsl:choose>
	</xsl:template>
</xsl:stylesheet>