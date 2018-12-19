<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:if test="count(//ORG_UNIT) = 0 ">
			<xsl:element name="error">none</xsl:element>
		</xsl:if>
		<xsl:if test="count(//ORG_UNIT) > 0 ">
			<xsl:element name="addresslist">
				<xsl:for-each select="ORG_UNIT">
					<xsl:element name="item" use-attribute-sets="itemSet">
						<xsl:element name="DN"><xsl:value-of select="@NAME" /></xsl:element>
						<xsl:element name="DO"><xsl:value-of select="@NAME" /></xsl:element>
						<xsl:element name="JD"></xsl:element>
						<xsl:element name="LN"></xsl:element>
						<xsl:element name="FN"><xsl:value-of select="@NAME" /></xsl:element>
						<xsl:element name="TL"></xsl:element>
						<xsl:element name="PO"></xsl:element>
						<xsl:element name="LV"></xsl:element>
						<xsl:element name="AN"><xsl:value-of select="@UNIT_CODE" /></xsl:element>
						<xsl:element name="PI"><xsl:value-of select="@UNIT_ID" /></xsl:element>
						<xsl:element name="CP"></xsl:element>
						<xsl:element name="DP"><xsl:value-of select="@UNIT_FULL_NAME" /></xsl:element>
						<xsl:element name="RGNM"><xsl:value-of select="@NAME" /></xsl:element>
						<xsl:element name="OF"></xsl:element>
						<xsl:element name="CY"></xsl:element>
						<xsl:element name="EM"><xsl:value-of select="@EMAIL" /></xsl:element>
						<xsl:element name="SO"><xsl:value-of select="@SORT_KEY" /></xsl:element>
						<xsl:element name="SG"><xsl:value-of select="@PARENT_UNIT_CODE" /></xsl:element>
						<xsl:element name="SGNM"></xsl:element>
						<xsl:element name="RG"><xsl:value-of select="@UNIT_CODE" /></xsl:element>
						<xsl:element name="DEPUTY"></xsl:element>
						<xsl:element name="RV1"><xsl:value-of select="@RESERVED1" /></xsl:element>
						<xsl:element name="RV2"><xsl:value-of select="@RESERVED2" /></xsl:element>
						<xsl:element name="RV3"><xsl:value-of select="@RESERVED3" /></xsl:element>
					</xsl:element>
				</xsl:for-each>
			</xsl:element>
		</xsl:if>
	</xsl:element>	
</xsl:template>
	<xsl:attribute-set name="itemSet" >
	<xsl:attribute name="so"><xsl:value-of select="@SORT_KEY" /></xsl:attribute>
	<xsl:attribute name="tl"></xsl:attribute>
	<xsl:attribute name="po"></xsl:attribute>
	<xsl:attribute name="lv"></xsl:attribute>
	</xsl:attribute-set>
</xsl:stylesheet>
