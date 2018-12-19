<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="ROOT">
	<xsl:for-each select="WF_DOMAIN_DATA">
		<xsl:value-of select="@DOMAIN_DATA_CONTEXT"/>
	</xsl:for-each>
</xsl:template>
</xsl:stylesheet>
