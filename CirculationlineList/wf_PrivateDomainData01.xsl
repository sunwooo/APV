<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="NewDataSet">
	<!--<xsl:element name="response">-->
		<xsl:for-each select="Table">
			<xsl:element name="item">
				<xsl:element name="id"><xsl:value-of select="PDD_ID"/></xsl:element>
				<xsl:element name="signlistname"><xsl:value-of select="DISPLAY_NAME"/></xsl:element>
				<xsl:element name="signinform"><xsl:value-of disable-output-escaping="yes" select="PRIVATE_CONTEXT"/></xsl:element>
				<xsl:element name="dscr"><xsl:value-of disable-output-escaping="no" select="DSCR"/></xsl:element>
			</xsl:element>
		</xsl:for-each>
	<!--</xsl:element>-->	
</xsl:template>
</xsl:stylesheet>