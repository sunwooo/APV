<?xml version="1.0" encoding="utf-8" ?>

  <xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">
  
  
<xsl:output method="xml"  media-type="xml" />
<xsl:param name="sortby">PI_STARTED</xsl:param>
<xsl:param name="iPage">1</xsl:param>
<xsl:param name="iPageSize">20</xsl:param>

 <xsl:template match="response">

    <xsl:element name="totalcount">
      <xsl:value-of select="//Table/totalcount"/>
    </xsl:element>
    <xsl:variable name="iTotalCount" select="//Table/totalcount"/>
    <xsl:element name="totalpage">
      <xsl:value-of select="cfxsl:getPageValue($iPageSize, number($iTotalCount))"/>
    </xsl:element>
    <xsl:for-each select="//Table1">
      <!--<xsl:sort select="string(concat('@',$sortby))" order="descending"/>-->
			<!--<xsl:if test=" ( position() > ( $iPage - 1 )*$iPageSize ) and ($iPage*$iPageSize  >= position() ) ">-->
				<xsl:element name="workitem">
					<xsl:element name="id"><xsl:value-of select="WI_ID"/></xsl:element>
					<xsl:element name="pfid"><xsl:value-of select="PF_ID"/></xsl:element>
					<xsl:element name="piid"><xsl:value-of select="PI_ID"/></xsl:element>
					<xsl:element name="state"><xsl:value-of select="PI_STATE"/></xsl:element>
					<xsl:element name="bstate"><xsl:value-of select="PI_BUSINESS_STATE"/></xsl:element>
					<xsl:element name="pfsk"><xsl:value-of select="PF_SUB_KIND"/></xsl:element>
					<xsl:element name="title"><xsl:value-of select="PI_SUBJECT"/></xsl:element>
					<xsl:element name="piviewstate"></xsl:element>
					<xsl:element name="mode"><xsl:value-of select="MODE"/></xsl:element>
					<xsl:element name="pinm"><xsl:value-of select="PI_NAME"/></xsl:element>
					<xsl:element name="picreator"><xsl:value-of select="PI_INITIATOR_NAME"/></xsl:element>
					<xsl:element name="picreatorid"><xsl:value-of select="PI_INITIATOR_ID"/></xsl:element>
					<xsl:element name="picreatordept"><xsl:value-of select="PI_INITIATOR_UNIT_NAME"/></xsl:element>
					<xsl:element name="picreatordeptid"><xsl:value-of select="PI_INITIATOR_UNIT_CODE"/></xsl:element>
					<xsl:element name="participant"><xsl:value-of select="PF_PERFORMER_NAME"/></xsl:element>
					<xsl:element name="participantid"><xsl:value-of select="PF_PERFORMER_ID"/></xsl:element>
					<xsl:element name="createdate"><xsl:value-of select="PI_STARTED"/></xsl:element>
					<xsl:element name="completedate"><xsl:value-of select="WORKDT"/></xsl:element>
					<xsl:element name="pibd1"><xsl:value-of select="PI_BUSINESS_DATA1"/></xsl:element>
					<xsl:element name="pipr"><xsl:value-of select="PI_PRIORITY"/></xsl:element>
					<xsl:element name="pidc"><xsl:value-of select="PI_DSCR"/></xsl:element>
					<xsl:element name="fmid"><xsl:value-of select="cfxsl:getNodeValue(PI_DSCR,'id')"/></xsl:element>
					<xsl:element name="fmnm"><xsl:value-of select="cfxsl:getNodeValue(PI_DSCR,'name')"/></xsl:element>
					<xsl:element name="fmpf"><xsl:value-of select="cfxsl:getNodeValue(PI_DSCR,'prefix')"/></xsl:element>
					<xsl:element name="fmrv"><xsl:value-of select="cfxsl:getNodeValue(PI_DSCR,'revision')"/></xsl:element>
					<xsl:element name="scid"><xsl:value-of select="cfxsl:getNodeValue(PI_DSCR,'schemaid')"/></xsl:element>
					<xsl:element name="fiid"><xsl:value-of select="cfxsl:getNodeValue(PI_DSCR,'instanceid')"/></xsl:element>
					<xsl:element name="fmfn"><xsl:value-of select="cfxsl:getNodeValue(PI_DSCR,'filename')"/></xsl:element>
					<xsl:element name="ispaper"><xsl:value-of select="cfxsl:getNodeValue(PI_DSCR,'ispaper')"/></xsl:element>
					<xsl:element name="ispaper"><xsl:value-of select="cfxsl:getNodeValue(PI_DSCR,'ispaper')"/></xsl:element>
					<xsl:element name="ugrs"><xsl:value-of select="cfxsl:getNodeValue(PI_DSCR,'urgentreason')"/></xsl:element>
					<xsl:element name="rqrs"><xsl:value-of select="cfxsl:getNodeValue(PI_DSCR,'req_response')"/></xsl:element>
					<!--수신함에서는 기밀여부에 상관없이 모든 수신함 권한을 가진 사람이 볼 수 있다-->
					<!--<xsl:element name="secdoc">0</xsl:element>-->
					<!--결재완료문서만 권한 체크를 하기 때문에 기밀여부를 0으로 할 필요없음-->
					<xsl:element name="secdoc">
						<xsl:variable name="iSDoc" select="cfxsl:getNodeValue(PI_DSCR,'secure_doc')"/>
						<xsl:choose>
							<xsl:when test="$iSDoc=''">0</xsl:when>
							<xsl:otherwise><xsl:value-of select="$iSDoc"/></xsl:otherwise>
						</xsl:choose>
					</xsl:element>
					<xsl:element name="edms_document">
						<xsl:variable name="iSEdms" select="cfxsl:getNodeValue(PI_DSCR,'edms_document')"/>
						<xsl:choose>
							<xsl:when test="$iSEdms=''">0</xsl:when>
							<xsl:otherwise><xsl:value-of select="$iSEdms"/></xsl:otherwise>
						</xsl:choose>
					</xsl:element>
					<xsl:element name="wibd1">
						<xsl:value-of select="WI_BUSINESS_DATA1"/>
					</xsl:element>
					<xsl:element name="wibd2">
						<xsl:value-of select="WI_BUSINESS_DATA2"/>
					</xsl:element>
					<xsl:element name="picreatorsipaddress">
						<xsl:value-of select="PI_INITIATOR_SIPADDRESS"/>
					</xsl:element>

				</xsl:element>
			<!--</xsl:if>-->
		</xsl:for-each>

</xsl:template>
</xsl:stylesheet>
