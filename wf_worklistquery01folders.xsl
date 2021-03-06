<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">

<xsl:param name="iPage">1</xsl:param>
<xsl:param name="iPageSize">15</xsl:param>

 <xsl:template match="response">
		<xsl:element name="totalcount"><xsl:value-of select="//Table1/totalcount"/></xsl:element>
		<xsl:variable name="iTotalCount" select="//Table1/totalcount"/>
		<xsl:element name="totalpage"><xsl:value-of select="cfxsl:getPageValue($iPageSize, number($iTotalCount))"/></xsl:element>
		<xsl:for-each select="//Table">
			<!--<xsl:sort select="string(concat('@',$sortby))" order="descending"/>-->
			<!--<xsl:if test=" ( position() > ( $iPage - 1 )*$iPageSize ) and ($iPage*$iPageSize  >= position() ) ">-->
				<xsl:element name="workitem">
					<!--<xsl:element name="id"><xsl:value-of select="LIST_ID"/></xsl:element>-->
					<xsl:element name="folderid">
						<xsl:value-of select="FOLDER_ID"/>
					</xsl:element>
					<xsl:element name="foldernm">
						<xsl:value-of select="FOLDER_NAME"/>
					</xsl:element>
					<xsl:element name="title"><xsl:value-of select="FOLDER_NAME"/></xsl:element>
					<xsl:element name="picreator"><xsl:value-of select="INITIATOR_NAME"/></xsl:element>
					<xsl:element name="picreatordept"><xsl:value-of select="INITIATOR_UNIT_NAME"/></xsl:element>
					<xsl:element name="createdate"><xsl:value-of select="REGISTERED"/></xsl:element>
					<xsl:element name="completedate"><xsl:value-of select="REGISTERED"/></xsl:element>
					<xsl:element name="wfmode">
						<xsl:value-of select="WF_MODE"/>
					</xsl:element>
				</xsl:element>
			<!--</xsl:if>-->
		</xsl:for-each>
</xsl:template>
</xsl:stylesheet>
