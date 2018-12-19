<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="ROOT">
    <xsl:element name="response">
      <xsl:if test="count(//ORG_PERSON) = 0 ">
        <xsl:element name="error">none</xsl:element>
      </xsl:if>
      <xsl:if test="count(//ORG_PERSON) > 0 ">
        <xsl:element name="addresslist">
          <xsl:for-each select="ORG_PERSON" >
            <xsl:element name="item"  use-attribute-sets="itemSet">
              <xsl:element name="AN"><xsl:value-of select="PERSON_CODE" /></xsl:element>
              <xsl:element name="DN"><xsl:value-of select="DISPLAY_NAME" /></xsl:element>
              <xsl:element name="DP"><xsl:value-of select="UNIT_NAME" /></xsl:element>
              <xsl:element name="RG"><xsl:value-of select="UNIT_CODE" /></xsl:element>
              <xsl:element name="RGNM"><xsl:value-of select="UNIT_NAME" /></xsl:element>
            </xsl:element>
          </xsl:for-each>
        </xsl:element>
      </xsl:if>
    </xsl:element>
  </xsl:template>
  <xsl:attribute-set name="itemSet" >
		<xsl:attribute name="tl"><xsl:value-of select="concat(concat(substring-before(JOBTITLE_Z,'&amp;'),';'),substring-after(JOBTITLE_Z,'&amp;'))" ></xsl:value-of></xsl:attribute>
		<xsl:attribute name="po"><xsl:value-of select="concat(concat(substring-before(JOBPOSITION_Z,'&amp;'),';'),substring-after(JOBPOSITION_Z,'&amp;'))" /></xsl:attribute>
		<xsl:attribute name="lv"><xsl:value-of select="concat(concat(substring-before(JOBLEVEL_Z,'&amp;'),';'),substring-after(JOBLEVEL_Z,'&amp;'))" /></xsl:attribute>
  </xsl:attribute-set>
</xsl:stylesheet>

