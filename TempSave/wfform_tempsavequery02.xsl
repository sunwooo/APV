<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">

<xsl:param name="iPage">1</xsl:param>
<xsl:param name="iPageSize">20</xsl:param>

 <xsl:template match="NewDataSet">
	 <xsl:element name="response">
	<xsl:element name="totalcount"><xsl:value-of select="//Table/totalcount"/></xsl:element>
	<xsl:variable name="iTotalCount" select="//Table/totalcount"/>
	<xsl:element name="totalpage"><xsl:value-of select="cfxsl:getPageValue($iPageSize, number($iTotalCount))"/></xsl:element>
	<xsl:for-each select="//Table1">
		<!--<xsl:sort select="string(concat('@',$sortby))" order="descending"/>-->
		<!--<xsl:if test=" ( position() > ( $iPage - 1 )*$iPageSize ) and ($iPage*$iPageSize  >= position() ) ">-->
			<xsl:element name="forminstance">
				<xsl:element name="id"><xsl:value-of select="FORM_TEMP_INST_ID"/></xsl:element>
				<xsl:element name="ftid"><xsl:value-of select="FORM_TEMP_INST_ID"/></xsl:element>
				<xsl:element name="fiid"><xsl:value-of select="FORM_INST_ID"/></xsl:element>
				<xsl:element name="fmid"><xsl:value-of select="FORM_ID"/></xsl:element>
				<xsl:element name="scid"><xsl:value-of select="SCHEMA_ID"/></xsl:element>
				<xsl:element name="fmpf"><xsl:value-of select="FORM_PREFIX"/></xsl:element>
				<xsl:element name="fmnm"><xsl:value-of select="FORM_NAME"/></xsl:element>
				<xsl:element name="fmrv"><xsl:value-of select="FORM_VERSION"/></xsl:element>
				<xsl:element name="fitn"><xsl:value-of select="FORM_INST_TABLE_NAME"/></xsl:element>
				<xsl:element name="fmfn"><xsl:value-of select="FORM_FILE_NAME"/></xsl:element>
				<xsl:element name="picreatorid"><xsl:value-of select="OWNER_ID"/></xsl:element>
				<xsl:element name="createdate"><xsl:value-of select="WORKDT"/></xsl:element>
				<xsl:element name="title"><xsl:value-of select="SUBJECT"/></xsl:element>
				<xsl:element name="mode">TEMPSAVE</xsl:element>
			</xsl:element>
		<!--</xsl:if>-->
	</xsl:for-each></xsl:element>
</xsl:template>
</xsl:stylesheet>
