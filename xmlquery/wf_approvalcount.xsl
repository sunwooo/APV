<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
<xsl:output method="xml"  media-type="text/xml" />

 <xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:element name="approval"><xsl:value-of select="//@APPROVAL"/></xsl:element>
		<xsl:element name="preapproval"><xsl:value-of select="//@PREAPPROVAL"/></xsl:element>
		<xsl:element name="process"><xsl:value-of select="//@PROCESS"/></xsl:element>
		<xsl:element name="deptapproval"><xsl:value-of select="//@DEPTAPPROVAL"/></xsl:element>
		<xsl:element name="receive"><xsl:value-of select="//@RECEIVE"/></xsl:element>
		<!--<xsl:element name="bugetchangerequest"><xsl:value-of select="//BUDGETCHANGEREQUEST/@BUDGETCHANGEREQUESTCOUNT"/></xsl:element>-->
		<!--<xsl:element name="circulation"><xsl:value-of select="//CIRCULATION/@CIRCULATIONCOUNT"/></xsl:element>-->
	</xsl:element>
</xsl:template>
</xsl:stylesheet>
