<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">

	<xsl:output method="xml"  media-type="xml" />
	<xsl:param name="sortby">CREATED</xsl:param>
	<xsl:param name="iPage">1</xsl:param>
	<xsl:param name="iPageSize">20</xsl:param>

	<msxsl:script language="JScript" implements-prefix="cfxsl">
		<![CDATA[
	function getPageValue(ipPageSize, ipTotalCount){
		try{
			var ipage = parseInt(ipTotalCount/ipPageSize);
			if((ipTotalCount % ipPageSize) > 0 ){
				 ipage++;
			}
			if(ipage == 0 ) ipage = 1;
			return ipage;
		}catch(e){throw e}
	}
	]]>
	</msxsl:script>
	<xsl:template match="response">
		<xsl:element name="response">
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
				<xsl:element name="docitem">
					<xsl:element name="id">
						<xsl:value-of select="REGISTERED_ID"/>
					</xsl:element>
					<xsl:element name="jdid">
						<xsl:value-of select="JOBDUTY_CODE"/>
					</xsl:element>
					<xsl:element name="fmnm">
						<xsl:value-of select="FORM_NAME"/>
					</xsl:element>
					<xsl:element name="picreator">
						<xsl:value-of select="INITIATOR_NAME"/>
					</xsl:element>
					<xsl:element name="picreatorid">
						<xsl:value-of select="INITIATOR_ID"/>
					</xsl:element>
					<xsl:element name="picreatordept">
						<xsl:value-of select="INITIATOR_OU_NAME"/>
					</xsl:element>
					<xsl:element name="picreatordeptid">
						<xsl:value-of select="INITIATOR_OU_CODE"/>
					</xsl:element>
					<xsl:element name="createdate">
						<xsl:value-of select="COMPLETED_DATE"/>
					</xsl:element>
					<xsl:element name="title">
						<xsl:value-of select="SUBJECT"/>
					</xsl:element>
					<xsl:element name="effectcmt">
						<xsl:value-of select="EFFECTUATION_COMMENT"/>
					</xsl:element>
					<xsl:element name="mode">JOBDUTY</xsl:element>
				</xsl:element>
				<!--</xsl:if>-->
			</xsl:for-each>
		</xsl:element>
	</xsl:template>
</xsl:stylesheet>
