<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:cfxsl="urn:cfxsl"
  xmlns:cfutil="urn:cfxsl">

	<xsl:param name="lngindex">0</xsl:param>
    
	<xsl:template match="/">
	<xsl:apply-templates select="steps/division/step"/>
	</xsl:template>
		<xsl:template match="step">
		<xsl:choose>
			<xsl:when test="@routetype='consult' and @allottype='parallel'">
			[<xsl:value-of select='cfxsl:convertKindToSignType(taskinfo/@kind, "")'/>(<xsl:value-of select='count(ou)'/>)]<xsl:if test="not(position()=last())"> - </xsl:if>
			</xsl:when>				
			<xsl:otherwise>
				<xsl:value-of select='cfxsl:splitNameExt(string(ou/person/@name),$lngindex)'/>[<xsl:value-of select='cfxsl:convertKindToSignType(ou/person/taskinfo/@kind, "")'/>]<xsl:if test="not(position()=last())"> - </xsl:if>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="not(position()=last())"></xsl:if>
	</xsl:template>
</xsl:stylesheet>
