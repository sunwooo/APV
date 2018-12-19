<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">

  <xsl:param name="iPage">1</xsl:param>
  <xsl:param name="iPageSize">20</xsl:param>
  
  <xsl:template match="response">   
      <xsl:element name="totalcount"><xsl:value-of select="//Table/totalcount"/></xsl:element>
      <xsl:variable name="iTotalCount" select="//Table/totalcount"/>
      <xsl:element name="totalpage"><xsl:value-of select="cfxsl:getPageValue($iPageSize, number($iTotalCount))"/></xsl:element>
      <xsl:for-each select="//Table1">
        <!--<xsl:sort select="string(concat('@',$sortby))" order="descending"/>-->
        <!--<xsl:if test=" ( position() > ( $iPage - 1 )*$iPageSize ) and ($iPage*$iPageSize  >= position() ) ">-->
        <xsl:element name="forminstance">        
          <xsl:element name="piid"><xsl:value-of select="PROCESS_ID"/></xsl:element>
          <xsl:element name="bstate"><xsl:value-of select="BSTATE"/></xsl:element>
          <xsl:element name="receipt_id"><xsl:value-of select="RECEIPT_ID"/></xsl:element>
          <xsl:element name="receipt_name"><xsl:value-of select="RECEIPT_NAME"/></xsl:element>
          <xsl:element name="receipt_ou_id"><xsl:value-of select="RECEIPT_OU_ID"/></xsl:element>
          <xsl:element name="receipt_ou_name"><xsl:value-of select="RECEIPT_OU_NAME"/></xsl:element>
          <xsl:element name="receipt_state"><xsl:value-of select="RECEIPT_STATE"/></xsl:element>
          <xsl:element name="receipt_date"><xsl:value-of select="RECEIPT_DATE"/></xsl:element>
          <xsl:element name="type"><xsl:value-of select="RECEIPT_TYPE"/></xsl:element>
          <xsl:element name="picreatorid"><xsl:value-of select="SENDER_NAME"/></xsl:element>
          <xsl:element name="picreator"><xsl:value-of select="SENDER_ID"/></xsl:element>
          <xsl:element name="createdate"><xsl:value-of select="SEND_DATE"/></xsl:element>
          <xsl:element name="title"><xsl:value-of select="SUBJECT"/></xsl:element>
          <xsl:element name="kind"><xsl:value-of select="KIND"/></xsl:element>
          <xsl:element name="sendid"><xsl:value-of select="SEND_ID"/></xsl:element>
          <xsl:element name="read_date"><xsl:value-of select="READ_DATE"/></xsl:element>
          <xsl:element name="fiid"><xsl:value-of select="cfxsl:getNodeValue(LINK_URL,'instanceid')"/></xsl:element>
          <xsl:element name="fmid"><xsl:value-of select="cfxsl:getNodeValue(LINK_URL,'id')"/></xsl:element>
          <xsl:element name="scid"><xsl:value-of select="cfxsl:getNodeValue(LINK_URL,'schemaid')"/></xsl:element>
          <xsl:element name="fmpf"><xsl:value-of select="cfxsl:getNodeValue(LINK_URL,'prefix')"/></xsl:element>
          <xsl:element name="fmnm"><xsl:value-of select="cfxsl:getNodeValue(LINK_URL,'name')"/></xsl:element>
          <xsl:element name="fmrv"><xsl:value-of select="cfxsl:getNodeValue(LINK_URL,'revision')"/></xsl:element>       
          <xsl:element name="mode">COMPLETE</xsl:element>
          <xsl:element name="link_url"><xsl:value-of select="LINK_URL"/></xsl:element>
        </xsl:element>
        <!--</xsl:if>-->
      </xsl:for-each>    
  </xsl:template>
</xsl:stylesheet>
