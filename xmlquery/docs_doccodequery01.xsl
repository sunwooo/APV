<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt">
<xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:if test=" count(//V_DOC_CODE) = 0  ">
			<xsl:element name="error">검색된 자료가 없습니다</xsl:element>
		</xsl:if>
		<xsl:for-each select="V_DOC_CODE">
			<xsl:element name="item">
				<xsl:element name="doc_code"><xsl:value-of select="@DOC_CODE"/></xsl:element>
				<xsl:element name="doc_code1"><xsl:value-of select="@DOC_MST1_CD"/></xsl:element>
				<xsl:element name="doc_code2"><xsl:value-of select="@DOC_MST2_CD"/></xsl:element>
				<xsl:element name="doc_code3"><xsl:value-of select="@DOC_MST3_CD"/></xsl:element>
				<xsl:element name="doc_name1"><xsl:value-of disable-output-escaping="yes" select="@DOC_MST1_NAME"/></xsl:element>
				<xsl:element name="doc_name2"><xsl:value-of disable-output-escaping="yes" select="@DOC_MST2_NAME"/></xsl:element>
				<xsl:element name="doc_name3"><xsl:value-of disable-output-escaping="yes" select="@DOC_MST3_NAME"/></xsl:element>
				<xsl:element name="keep_year"><xsl:value-of select="@KEEP_YEAR"/></xsl:element>
			</xsl:element>
		</xsl:for-each>
	</xsl:element>	
</xsl:template>
</xsl:stylesheet>
