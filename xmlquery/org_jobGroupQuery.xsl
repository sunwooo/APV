<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:if test="count(//ORG_JOBTITLE) = 0 ">
			<xsl:element name="error">none</xsl:element>
		</xsl:if>
		<xsl:if test="count(//ORG_JOBTITLE) > 0 ">
			<xsl:element name="addresslist">
				<xsl:for-each select="ORG_JOBTITLE">
					<xsl:element name="item" use-attribute-sets="itemSet">
                				<xsl:element name="TC"><xsl:value-of select="@TITLE_CODE" /></xsl:element>
	                			<xsl:element name="DN"><xsl:value-of select="@NAME" /></xsl:element>
        	        			<xsl:element name="EC"><xsl:value-of select="@ENT_CODE" /></xsl:element>
	                			<xsl:element name="PT"><xsl:value-of select="@PARENT_TITLE_CODE" /></xsl:element>
	                			<xsl:element name="DP"><xsl:value-of select="@DEPTH" /></xsl:element>
                				<xsl:element name="PY"><xsl:value-of select="@PERSON_YN" /></xsl:element>
					</xsl:element>
				</xsl:for-each>
			</xsl:element>	
		</xsl:if>
	</xsl:element>	
</xsl:template>
	<xsl:attribute-set name="itemSet" >
	<xsl:attribute name="DN"><xsl:value-of select="@NAME" /></xsl:attribute>
	</xsl:attribute-set>
</xsl:stylesheet>
