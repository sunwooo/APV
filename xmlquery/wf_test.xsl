<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:if test="count(//FILE_TMP) = 0 ">
			<xsl:element name="error">none</xsl:element>
		</xsl:if>
		<xsl:if test="count(//FILE_TMP) > 0 ">
			<xsl:for-each select="FILE_TMP">
				<xsl:element name="docno"><xsl:value-of select="@UID" /></xsl:element>
				<xsl:element name="title"><xsl:value-of select="@TITLE" /></xsl:element>
				<xsl:element name="body"><xsl:value-of select="@BODYCONTEXT" /></xsl:element>
			</xsl:for-each>
		</xsl:if>
	</xsl:element>	
</xsl:template>
</xsl:stylesheet>
