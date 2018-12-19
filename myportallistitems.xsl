<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
<xsl:output media-type="text/html"/>
<xsl:param name="sTitle">받은일시</xsl:param>
<msxsl:script language="JScript" implements-prefix="cfxsl">
	<![CDATA[
	function getSubKind(sKind){
		try{
		var sSubKind="";
		//var strKind = sKind.text;
		switch(sKind){
			case "T000":
				sSubKind= "결재";break;
			case "T001":
				sSubKind= "시행";break;
			case "T002":
				sSubKind= "시행";break;
			case "T003":
				sSubKind= "직인";break;
			case "T004":
				sSubKind= "협조";break;
			case "T005":
				sSubKind= "후결";break;
			case "T006":
				sSubKind= "열람";break;
			case "T007":
				sSubKind= "경유";break;
			case "T008":
				sSubKind= "재기안";break;
			case "A":
				sSubKind= "품의함";break;
			case "R":
				sSubKind= "수신";break;
			case "S":
				sSubKind= "발신";break;
			case "REQCMP":
				sSubKind= "신청처리";break;
			case "P":
				sSubKind= "발신";break;
			default: sSubKind= sKind;break;
		}
		return sSubKind;
		}catch(e){throw e}
	}
	]]>
</msxsl:script>

<xsl:template match="response">
	<table id="tblGalInfo" width="100%" border="0" cellpadding="1" cellspacing="1" style="table-layout:fixed">
		<THEAD>
		</THEAD>
		<TBODY>
		<xsl:for-each select="workitem">
				<tr  class="rowunselected">
				<xsl:attribute name="className">rowunselected</xsl:attribute>
				<xsl:attribute name="workitemid"><xsl:value-of select="id"/></xsl:attribute>
				<xsl:attribute name="piid"><xsl:value-of select="piid"/></xsl:attribute>
				<xsl:attribute name="pfid"><xsl:value-of select="pfid"/></xsl:attribute>
				<xsl:attribute name="mode"><xsl:value-of select="mode"/></xsl:attribute>
				<xsl:attribute name="participantid"><xsl:value-of select="participantid"/></xsl:attribute>
				<xsl:attribute name="piviewstate"></xsl:attribute>
				<xsl:attribute name="fiid"><xsl:value-of select="fiid"/></xsl:attribute>
				<xsl:attribute name="ftid"><xsl:value-of select="ftid"/></xsl:attribute>
				<xsl:attribute name="fmid"><xsl:value-of select="fmid"/></xsl:attribute>
				<xsl:attribute name="fmnm"><xsl:value-of select="fmnm"/></xsl:attribute>
				<xsl:attribute name="fmrv"><xsl:value-of select="fmrv"/></xsl:attribute>
				<xsl:attribute name="scid"><xsl:value-of select="scid"/></xsl:attribute>
				<xsl:attribute name="fmpf"><xsl:value-of select="fmpf"/></xsl:attribute>
				<xsl:attribute name="fmfn"><xsl:value-of select="fmfn"/></xsl:attribute>
				<xsl:attribute name="bstate"><xsl:value-of select="bstate"/></xsl:attribute>
				<xsl:attribute name="pfsk"><xsl:value-of select="pfsk"/></xsl:attribute>
				<xsl:attribute name="pibd1"><xsl:value-of select="pibd1"/></xsl:attribute>
				<xsl:attribute name="pipr"><xsl:value-of select="pipr"/></xsl:attribute>
				<xsl:attribute name="pidc"><xsl:value-of select="pidc"/></xsl:attribute>
				<xsl:attribute name="secdoc"><xsl:value-of select="secdoc"/></xsl:attribute>
				<td  valign="top" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="title"/></td>
				<td  align="right" valign="top" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="completedate"/></td>
				</tr>
		</xsl:for-each>
		</TBODY>
	</table>
</xsl:template>
</xsl:stylesheet>