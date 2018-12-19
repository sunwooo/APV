<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:if test="count(//ORG_PERSON) = 0 ">
			<xsl:element name="error">none</xsl:element>
		</xsl:if>
		<xsl:if test="count(//ORG_PERSON) > 0 ">
			<xsl:for-each select="ORG_PERSON">
				<xsl:element name="item">
                			<xsl:element name="OC"></xsl:element>
                			<xsl:element name="DEPUTY"><xsl:value-of select="substring-after(DEPUTY,';')" /></xsl:element>
	                		<xsl:element name="LN"><xsl:value-of select="DISPLAY_NAME" /></xsl:element>
                			<xsl:element name="DN"><xsl:value-of select="DISPLAY_NAME" /></xsl:element>
	                		<xsl:element name="IT"><xsl:value-of select="DISPLAY_NAME" /></xsl:element>
                			<xsl:element name="DO"><xsl:value-of select="DISPLAY_NAME" /></xsl:element>
                			<xsl:element name="AN"><xsl:value-of select="PERSON_CODE" /></xsl:element>
                			<xsl:element name="PI"><xsl:value-of select="PERSON_ID" /></xsl:element>
                			<xsl:element name="ET"></xsl:element>
                			<xsl:element name="TL"><xsl:value-of select="substring-before(JOBTITLE_Z,'&amp;')" /></xsl:element>
                			<xsl:element name="LV"><xsl:value-of select="substring-before(JOBLEVEL_Z,'&amp;')" /></xsl:element>
                			<xsl:element name="JT"><xsl:value-of select="substring-before(JOBPOSITION_Z,'&amp;')" /></xsl:element>
                			<xsl:element name="JD"><xsl:value-of select="DSCR" /></xsl:element>
        	        		<xsl:element name="DP"><xsl:value-of select="UNIT_NAME" /></xsl:element>
	                		<xsl:element name="CP"></xsl:element>
	                		<xsl:element name="OF"><xsl:value-of select="OFFICE" /></xsl:element>
	                		<xsl:element name="CT"></xsl:element>
	                		<xsl:element name="ZC"></xsl:element>
	                		<xsl:element name="CO"></xsl:element>
	                		<xsl:element name="SA"></xsl:element>
                			<xsl:element name="EM"><xsl:value-of select="EMAIL" /></xsl:element>
        	        		<xsl:element name="TP"><xsl:value-of select="OFFICE_TEL" /></xsl:element>
        	        		<xsl:element name="MP"><xsl:value-of select="MOBILE_TEL" /></xsl:element>
        	        		<xsl:element name="FX"><xsl:value-of select="OFFICE_FAX" /></xsl:element>
	                		<xsl:element name="HP"><xsl:value-of select="HOME_TEL" /></xsl:element>
	                		<xsl:element name="RV1"><xsl:value-of select="RESERVED1" /></xsl:element>
				</xsl:element>
			</xsl:for-each>
		</xsl:if>
	</xsl:element>	
</xsl:template>
</xsl:stylesheet>
