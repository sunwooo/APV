<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:if test="count(//ORG_JOBFUNCTION_MEMBER) = 0 ">
			<xsl:element name="authority">false</xsl:element>
		</xsl:if>
		<xsl:if test="count(//ORG_JOBFUNCTION_MEMBER) = 1 ">
			<xsl:element name="authority">true</xsl:element>
		</xsl:if>
	</xsl:element>	
</xsl:template>
</xsl:stylesheet>
