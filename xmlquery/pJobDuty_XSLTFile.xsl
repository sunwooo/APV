<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="ROOT">
	<xsl:element name="response">
    <xsl:if test="(count(//ORG_JOBDUTY)) = 0 ">
      <xsl:element name="error">none</xsl:element>
    </xsl:if>
    <xsl:if test="(count(//ORG_JOBDUTY)) > 0 ">
			<xsl:element name="addresslist">
				<xsl:for-each select="ORG_JOBDUTY">
					<xsl:element name="item">
            <xsl:element name="DN"><xsl:value-of select="@NAME" /></xsl:element>
						<xsl:element name="DO"><xsl:value-of select="@DUTY_CODE" /></xsl:element>
						<xsl:element name="JD"></xsl:element>
						<xsl:element name="PO"></xsl:element>
						<xsl:element name="LV"><xsl:value-of select="@JOBDUTY" /></xsl:element>
						<xsl:element name="AN"><xsl:value-of select="@DUTY_CODE" /></xsl:element>
						<xsl:element name="DP"><xsl:value-of select="@DUTY_CODE" /></xsl:element>
						<xsl:element name="EM"></xsl:element>
           <xsl:element name="CC"><xsl:value-of select="@CHILD_LEN" /></xsl:element>
					</xsl:element>	
				</xsl:for-each>
			</xsl:element>
    </xsl:if>
	</xsl:element>
</xsl:template>
</xsl:stylesheet>

