<%@ Page Language="C#" AutoEventWireup="true" CodeFile="file_listXSL.aspx.cs" Inherits="Approval_Portal_file_listXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
<xsl:output media-type="text/html"/>
<msxsl:script language="JScript" implements-prefix="cfxsl">
	<![CDATA[
	function getNodeValue(strXML){
		try{
		    var m_evalXML = new ActiveXObject("MSXML2.DOMDocument");
		    m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>"+strXML);
		    var elmRoot = m_evalXML.documentElement;
		    var elmList = elmRoot.selectNodes("docinfo/attach/path");
			var filePath = elmList.nextNode().text;
			
		}catch(e){throw e}
	}
	]]>
</msxsl:script>

<xsl:template match="response">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	<tr>
	    <td  valign="top"> 
		<table id="tblGalInfo" width="100%"  border="0" cellspacing="0" cellpadding="0" style="TABLE-LAYOUT: fixed;">
		<TBODY>
				<xsl:for-each select="NewDataSet/Table">
				        <tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" >
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
						<xsl:attribute name="edms_document"><xsl:value-of select="edms_document"/></xsl:attribute>
						
						    <td align="left" vnowrap="true" style="overflow:hidden;height:25px" onselect="false" width="82" height="20">
						        <xsl:value-of select="cfxsl:getNodeValue(string(VALUE))"/>
						    </td>
						    <td valign="middle" nowrap="true" style="text-overflow:ellipsis; overflow:hidden; paddingRight:1px;height:25px;" onselect="false" width="330" height="20" colspan="4" >
						        <a href="#" class="text02_L"><xsl:value-of select="PI_SUBJECT"/></a>
						    </td>
						</tr>
				</xsl:for-each>
		</TBODY>
		</table>
	  </td>
    </tr>
	<tr>
	   <td height="1"  class="BTable_bg03"></td>
	</tr>
  </table>
</xsl:template>
</xsl:stylesheet>
