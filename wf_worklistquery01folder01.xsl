<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">

<xsl:param name="iPage">1</xsl:param>
<xsl:param name="iPageSize">15</xsl:param>

 <xsl:template match="NewDataSet">
	 <xsl:element name="response">	 
		<xsl:element name="totalcount"><xsl:value-of select="//Table/totalcount"/></xsl:element>
		<xsl:variable name="iTotalCount" select="//Table/totalcount"/>
		<xsl:element name="totalpage"><xsl:value-of select="cfxsl:getPageValue($iPageSize, number($iTotalCount))"/></xsl:element>
		<xsl:for-each select="//Table1">
			<!--<xsl:sort select="string(concat('@',$sortby))" order="descending"/>-->
			<!--<xsl:if test=" ( position() > ( $iPage - 1 )*$iPageSize ) and ($iPage*$iPageSize  >= position() ) ">-->
				<xsl:element name="workitem">
					<!--<xsl:element name="id"><xsl:value-of select="LIST_ID"/></xsl:element>-->
					<xsl:element name="listid"><xsl:value-of select="LIST_ID"/></xsl:element>
					<xsl:element name="fmnm"><xsl:value-of select="FORM_NAME"/></xsl:element>
					<xsl:element name="title"><xsl:value-of select="SUBJECT"/></xsl:element>
					<xsl:element name="picreator"><xsl:value-of select="INITIATOR_NAME"/></xsl:element>
					<xsl:element name="picreatordept"><xsl:value-of select="INITIATOR_UNIT_NAME"/></xsl:element>
					<xsl:element name="createdate"><xsl:value-of select="REGISTERED"/></xsl:element>
					<xsl:element name="completedate"><xsl:value-of select="REGISTERED"/></xsl:element>
					<xsl:element name="linkurl"><xsl:value-of select="LINKURL"/></xsl:element>
					<xsl:element name="linkkey"><xsl:value-of select="LINKKEY"/></xsl:element>
					<xsl:element name="wfmode"><xsl:value-of select="WF_MODE"/></xsl:element>
					<xsl:element name="deputystate"><xsl:value-of select="DEPUTY_STATE"/></xsl:element>
					<xsl:element name="mode">COMPLETE</xsl:element>
					<xsl:element name="picreatorid"><xsl:value-of select="INITIATOR_ID"/></xsl:element>
					<xsl:element name="picreatordeptid"><xsl:value-of select="INITIATOR_UNIT_ID"/></xsl:element>
				</xsl:element>
			<!--</xsl:if>-->
		</xsl:for-each>
		 </xsl:element>
</xsl:template>
</xsl:stylesheet>
