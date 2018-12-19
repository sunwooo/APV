<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:if test="count(//ORG_PERSON) = 0 ">
			<xsl:element name="error">none</xsl:element>
		</xsl:if>
		<xsl:if test="count(//ORG_PERSON) > 0 ">
			<xsl:element name="addresslist">
				<xsl:for-each select="ORG_PERSON">
					<xsl:element name="item" >
						<xsl:element name="DN"><xsl:value-of select="@DISPLAY_NAME" /></xsl:element>
						<xsl:element name="RGNM"><xsl:value-of select="@UNIT_NAME" /></xsl:element>
					</xsl:element>	
				</xsl:for-each>
			</xsl:element>
		</xsl:if>
	</xsl:element>	
</xsl:template>
</xsl:stylesheet>
