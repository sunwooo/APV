<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">

<xsl:output method="xml"  media-type="xml" />
<xsl:param name="sortby">SERIAL_NUMBER</xsl:param>
 <xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:for-each select="WF_DOC_REG_LIST">
			<xsl:sort select="string(concat('@',$sortby))" order="ascending"/>
			<xsl:element name="docitem">
				<xsl:element name="id"><xsl:value-of select="@REGISTERED_ID"/></xsl:element>
				<xsl:element name="owouid"><xsl:value-of select="@OWNER_UNIT_CODE"/></xsl:element>
				<xsl:element name="listtype"><xsl:value-of select="@DOC_LIST_TYPE"/></xsl:element>
				<xsl:element name="fiscal"><xsl:value-of select="@FISCAL_YEAR"/></xsl:element>
				<xsl:element name="serial"><xsl:value-of select="@SERIAL_NUMBER"  /></xsl:element>
				<xsl:element name="rgdt"><xsl:value-of select="@REGISTERED_DATE"/></xsl:element>
				<xsl:element name="rgcmt"><xsl:value-of select="@REGISTRATION_COMMENT"/></xsl:element>
				<xsl:element name="rgnm"><xsl:value-of select="@REGISTRATOR_NAME"/></xsl:element>
				<xsl:element name="rgid"><xsl:value-of select="@REGISTRATOR_CODE"/></xsl:element>
				<xsl:element name="senounm"><xsl:value-of select="@SENT_BY_UNIT_NAME"/></xsl:element>
				<xsl:element name="senouid"><xsl:value-of select="@SENT_BY_UNIT_CODE"/></xsl:element>
				<xsl:element name="recounm"><xsl:value-of select="@RECEIVED_BY_UNIT_NAME"/></xsl:element>
				<xsl:element name="recouid"><xsl:value-of select="@RECEIVED_BY_UNIT_CODE"/></xsl:element>
				<xsl:element name="docno"><xsl:value-of select="@DOCUMENT_NUMBER"/></xsl:element>
				<xsl:element name="docsubject"><xsl:value-of select="@DOCUMENT_SUBJECT"/></xsl:element>
				<xsl:element name="chargenm"><xsl:value-of select="@PERSON_IN_CHARGE_NAME"/></xsl:element>
				<xsl:element name="chargeid"><xsl:value-of select="@PERSON_IN_CHARGE_CODE"/></xsl:element>
				<xsl:element name="apvdt"><xsl:value-of select="@APPROVED_DATE"/></xsl:element>
				<xsl:element name="initnm"><xsl:value-of select="@INITIATOR_NAME"/></xsl:element>
				<xsl:element name="initid"><xsl:value-of select="@INITIATOR_CODE"/></xsl:element>
				<xsl:element name="effectdt"><xsl:value-of select="@EFFECTUATED_DATE"/></xsl:element>
				<xsl:element name="effectmethod"><xsl:value-of select="@EFFECTUATION_METHOD"/></xsl:element>
				<xsl:element name="effectcmt"><xsl:value-of select="@EFFECTUATION_COMMENT"/></xsl:element>
			</xsl:element>
		</xsl:for-each>
	</xsl:element>
</xsl:template>
</xsl:stylesheet>
