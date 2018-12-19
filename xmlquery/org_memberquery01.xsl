<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:if test="count(//ORG_PERSON) > 0 ">
			<xsl:for-each select="ORG_PERSON">
	 		<xsl:element name="UNIT_CODE"><xsl:value-of select="UNIT_CODE" /></xsl:element>
			<xsl:element name="PERSON_CODE"><xsl:value-of select="PERSON_CODE" /></xsl:element>
			<xsl:element name="PERSON_ID"><xsl:value-of select="PERSON_ID" /></xsl:element>
			<xsl:element name="UNIT_NAME"><xsl:value-of select="UNIT_NAME" /></xsl:element>
			<xsl:element name="JOBLEVEL_Z"><xsl:value-of select="concat(concat(substring-after(JOBLEVEL_Z,'&amp;'),';'),substring-before(JOBLEVEL_Z,'&amp;'))" /></xsl:element>
			<xsl:element name="LEVEL_CODE"><xsl:value-of select="LEVEL_CODE" /></xsl:element>
			<xsl:element name="LEVEL_NAME"><xsl:value-of select="substring-before(LEVEL_NAME,'&amp;')" /></xsl:element>
			<xsl:element name="JOBTITLE_Z"><xsl:value-of select="concat(concat(substring-after(JOBTITLE_Z,'&amp;'),';'),substring-before(JOBTITLE_Z,'&amp;'))" /></xsl:element>
			<xsl:element name="JOBTITLE_CODE"><xsl:value-of select="substring-after(JOBTITLE_Z,'&amp;')" /></xsl:element>
			<xsl:element name="JOBTITLE_NAME"><xsl:value-of select="substring-before(JOBTITLE_Z,'&amp;')" /></xsl:element>
			<xsl:element name="DISPLAY_NAME"><xsl:value-of select="DISPLAY_NAME" /></xsl:element>
			<xsl:element name="FIRST_NAME"><xsl:value-of select="FIRST_NAME" /></xsl:element>
			<xsl:element name="JOBPOSITION_Z"><xsl:value-of select="concat(concat(substring-after(JOBPOSITION_Z,'&amp;'),';'),substring-before(JOBPOSITION_Z,'&amp;'))" /></xsl:element>
			<xsl:element name="JOBPOSITION_CODE"><xsl:value-of select="substring-after(JOBPOSITION_Z,'&amp;')" /></xsl:element>
			<xsl:element name="JOBPOSITION_NAME"><xsl:value-of select="substring-before(JOBPOSITION_Z,'&amp;')" /></xsl:element>
			<xsl:element name="EMAIL"><xsl:value-of select="EMAIL" /></xsl:element>
			<xsl:element name="SORT_KEY"><xsl:value-of select="SORT_KEY" /></xsl:element>
			<xsl:element name="ENT_CODE"><xsl:value-of select="ENT_CODE" /></xsl:element>
			<xsl:element name="PROVINCE"><xsl:value-of select="PROVINCE" /></xsl:element>
			<xsl:element name="CITY"><xsl:value-of select="CITY" /></xsl:element>
			<xsl:element name="OFFICE"><xsl:value-of select="OFFICE" /></xsl:element>
			<xsl:element name="OFFICE_ZIPCODE"><xsl:value-of select="OFFICE_ZIPCODE" /></xsl:element>
			<xsl:element name="OFFICE_ADDRESS1"><xsl:value-of select="OFFICE_ADDRESS1" /></xsl:element>
			<xsl:element name="OFFICE_ADDRESS2"><xsl:value-of select="OFFICE_ADDRESS2" /></xsl:element>
			<xsl:element name="HOME_ZIPCODE"><xsl:value-of select="HOME_ZIPCODE" /></xsl:element>
			<xsl:element name="HOME_ADDRESS1"><xsl:value-of select="HOME_ADDRESS1" /></xsl:element>
			<xsl:element name="HOME_ADDRESS2"><xsl:value-of select="HOME_ADDRESS2" /></xsl:element>
			<xsl:element name="OFFICE_TEL"><xsl:value-of select="OFFICE_TEL" /></xsl:element>
			<xsl:element name="OFFICE_FAX"><xsl:value-of select="OFFICE_FAX" /></xsl:element>
			<xsl:element name="HOME_TEL"><xsl:value-of select="HOME_TEL" /></xsl:element>
			<xsl:element name="MOBILE_TEL"><xsl:value-of select="MOBILE_TEL" /></xsl:element>
			<xsl:element name="URL"><xsl:value-of select="URL" /></xsl:element>
			<xsl:element name="DEPUTY"><xsl:value-of select="DEPUTY" /></xsl:element>
			<xsl:element name="APPROVAL_PWD"><xsl:value-of select="APPROVAL_PWD" /></xsl:element>
			<xsl:element name="APPROVAL_UNIT_CODE"><xsl:value-of select="APPROVAL_UNIT_CODE" /></xsl:element>
			</xsl:for-each>
		</xsl:if>
	</xsl:element>	
</xsl:template>
</xsl:stylesheet>
