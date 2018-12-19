<?xml version="1.0" encoding="euc-kr"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:param name="sortby">PI_STARTED</xsl:param>
<xsl:param name="iPage">1</xsl:param>
<xsl:param name="iPageSize">10</xsl:param>
<xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:element name="totalcount"><xsl:value-of select="count(//WF_WORKITEM_LIST)"/></xsl:element>
		<xsl:element name="totalpage"><xsl:value-of select="format-number((count(//WF_WORKITEM_LIST) div $iPageSize) + 1 , '##0')"/></xsl:element>
		<xsl:for-each select="WF_WORKITEM_LIST">
			<xsl:sort select="string(concat('@',$sortby))" order="descending"/>
			<xsl:if test=" ( position() > ( $iPage - 1 )*$iPageSize ) and ($iPage*$iPageSize  >= position() ) ">
				<xsl:element name="workitem">
					<xsl:element name="id"><xsl:value-of select="@WI_ID"/></xsl:element>
					<xsl:element name="piid"><xsl:value-of select="@PI_ID"/></xsl:element>
					<xsl:element name="state"><xsl:value-of select="@PI_STATE"/></xsl:element>
					<xsl:element name="piviewstate"></xsl:element>
					<xsl:element name="mode"><xsl:value-of select="@MODE"/></xsl:element>
					<xsl:element name="fmid"><xsl:value-of select="@FORM_ID"/></xsl:element>
					<xsl:element name="fmnm"><xsl:value-of select="@FORM_NAME"/></xsl:element>
					<xsl:element name="pinm"><xsl:value-of select="@PI_NAME"/></xsl:element>
					<xsl:element name="picreator"><xsl:value-of select="@PI_INITIATOR_NAME"/></xsl:element>
					<xsl:element name="picreatorid"><xsl:value-of select="@PI_INITIATOR_ID"/></xsl:element>
					<xsl:element name="picreatordept"><xsl:value-of select="@PI_INITIATOR_UNIT_NAME"/></xsl:element>
					<xsl:element name="picreatordeptid"><xsl:value-of select="@PI_INITIATOR_UNIT_CODE"/></xsl:element>
					<xsl:element name="participant"><xsl:value-of select="@PF_PERFORMER_NAME"/></xsl:element>
					<xsl:element name="participantid"><xsl:value-of select="@PF_PERFORMER_ID"/></xsl:element>
					<xsl:element name="createdate"><xsl:value-of select="@PI_STARTED"/></xsl:element>
					<xsl:element name="completedate"><xsl:value-of select="@WORKDT"/></xsl:element>
				</xsl:element>
			</xsl:if>
		</xsl:for-each>
	</xsl:element>
</xsl:template>
</xsl:stylesheet>
