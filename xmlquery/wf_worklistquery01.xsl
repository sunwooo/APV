<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">

<xsl:output method="xml"  media-type="text/xml" />
<xsl:param name="sortby">PI_STARTED</xsl:param>
<xsl:param name="iPage">1</xsl:param>
<xsl:param name="iPageSize">10</xsl:param>

<msxsl:script language="JScript" implements-prefix="cfxsl">
	<![CDATA[
	function getPageValue(ipPageSize, ipTotalCount){
		try{
			var ipage = parseInt(ipTotalCount/ipPageSize);
			if((ipTotalCount % ipPageSize) > 0 ){
				 ipage++;
			}
			return ipage;
		}catch(e){throw e}
	}
	function getNodeValue(strXML, strNodeName){
		try{
			var objNode =strXML.nextNode();
  			var objXML = new ActiveXObject("MSXML.DOMDocument");
			if(objNode.text != ""){
				objXML.loadXML(objNode.text);
				return objXML.documentElement.getAttribute(strNodeName);
			}else{
				return "";
			}
		}catch(e){throw e}
	}
	]]>
</msxsl:script>
 <xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:element name="totalcount"><xsl:value-of select="count(//WF_WORKITEM_LIST)"/></xsl:element>
		<xsl:for-each select="WF_WORKITEM_LIST">
			<xsl:sort select="string(concat('@',$sortby))" order="descending"/>
				<xsl:element name="workitem">
					//<xsl:element name="id"><xsl:value-of select="@WI_ID"/></xsl:element>
					<xsl:element name="pfid"><xsl:value-of select="@PF_ID"/></xsl:element>
					<xsl:element name="piid"><xsl:value-of select="@PI_ID"/></xsl:element>
					<xsl:element name="state"><xsl:value-of select="@PI_STATE"/></xsl:element>
					<xsl:element name="bstate"><xsl:value-of select="@PI_BUSINESS_STATE"/></xsl:element>
					<xsl:element name="title"><xsl:value-of select="@PI_SUBJECT"/></xsl:element>
					<xsl:element name="piviewstate"></xsl:element>
					<xsl:element name="mode"><xsl:value-of select="@MODE"/></xsl:element>
					<xsl:element name="pinm"><xsl:value-of select="@PI_NAME"/></xsl:element>
					<xsl:element name="picreator"><xsl:value-of select="@PI_INITIATOR_NAME"/></xsl:element>
					<xsl:element name="picreatorid"><xsl:value-of select="@PI_INITIATOR_ID"/></xsl:element>
					<xsl:element name="picreatordept"><xsl:value-of select="@PI_INITIATOR_UNIT_NAME"/></xsl:element>
					<xsl:element name="picreatordeptid"><xsl:value-of select="@PI_INITIATOR_UNIT_CODE"/></xsl:element>
					<xsl:element name="participant"><xsl:value-of select="@PF_PERFORMER_NAME"/></xsl:element>
					<xsl:element name="participantid"><xsl:value-of select="@PF_PERFORMER_ID"/></xsl:element>
					<xsl:element name="createdate"><xsl:value-of select="@PI_STARTED"/></xsl:element>
					<xsl:element name="completedate"><xsl:value-of select="@WORKDT"/></xsl:element>
					<xsl:element name="fmid"><xsl:value-of select="cfxsl:getNodeValue(@PI_BUSINESS_DATA1,'id')"/></xsl:element>
					<xsl:element name="fmnm"><xsl:value-of select="cfxsl:getNodeValue(@PI_BUSINESS_DATA1,'name')"/></xsl:element>
					<xsl:element name="fmpf"><xsl:value-of select="cfxsl:getNodeValue(@PI_BUSINESS_DATA1,'prefix')"/></xsl:element>
					<xsl:element name="fmrv"><xsl:value-of select="cfxsl:getNodeValue(@PI_BUSINESS_DATA1,'revision')"/></xsl:element>
					<xsl:element name="scid"><xsl:value-of select="cfxsl:getNodeValue(@PI_BUSINESS_DATA1,'schemaid')"/></xsl:element>
					<xsl:element name="fiid"><xsl:value-of select="cfxsl:getNodeValue(@PI_BUSINESS_DATA1,'instanceid')"/></xsl:element>
				</xsl:element>
		</xsl:for-each>
	</xsl:element>
</xsl:template>
</xsl:stylesheet>