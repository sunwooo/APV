<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt">
<xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:if test=" count(//ORG_ENTERPRISE) = 0  ">
			<xsl:element name="error">회사주소 자료가 없습니다</xsl:element>
		</xsl:if>
		<xsl:for-each select="ORG_ENTERPRISE">
			<xsl:element name="item">
				<xsl:element name="ent_code"><xsl:value-of select="@ENT_CODE"/></xsl:element>
				<xsl:element name="name"><xsl:value-of select="@NAME"/></xsl:element>
				<xsl:element name="rgst_no"><xsl:value-of select="@RGST_NO"/></xsl:element>
				<xsl:element name="ceo_name"><xsl:value-of select="@CEO_NAME"/></xsl:element>
				<xsl:element name="ent_class"><xsl:value-of select="@ENT_CLASS"/></xsl:element>
				<xsl:element name="ent_type"><xsl:value-of select="@ENT_TYPE"/></xsl:element>
				<xsl:element name="capital"><xsl:value-of select="@CAPITAL"/></xsl:element>
				<xsl:element name="employee_no"><xsl:value-of select="@EMPLOYEE_NO"/></xsl:element>
				<xsl:element name="tel"><xsl:value-of select="@TEL"/></xsl:element>
				<xsl:element name="fax"><xsl:value-of select="@FAX"/></xsl:element>
				<xsl:element name="url"><xsl:value-of select="@URL"/></xsl:element>
				<xsl:element name="email"><xsl:value-of select="@EMAIL"/></xsl:element>
				<xsl:element name="nation_z"><xsl:value-of select="@NATION_Z"/></xsl:element>
				<xsl:element name="nation_id"><xsl:value-of select="@NATION_ID"/></xsl:element>
				<xsl:element name="zipcode"><xsl:value-of select="@ZIPCODE"/></xsl:element>
				<xsl:element name="address1"><xsl:value-of select="@ADDRESS1"/></xsl:element>
				<xsl:element name="address2"><xsl:value-of select="@ADDRESS2"/></xsl:element>
				<xsl:element name="dscr"><xsl:value-of select="@DSCR"/></xsl:element>
				<xsl:element name="fnd_date"><xsl:value-of select="@FND_DATE"/></xsl:element>
				<xsl:element name="insert_date"><xsl:value-of select="@INSERT_DATE"/></xsl:element>					
			</xsl:element>
		</xsl:for-each>
	</xsl:element>	
</xsl:template>
</xsl:stylesheet>
