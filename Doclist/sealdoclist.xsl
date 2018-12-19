<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"	
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
<xsl:output media-type="text/html"/>
<msxsl:script language="JScript" implements-prefix="cfxsl">
	<![CDATA[
	function getNodeValue(strXML, strNodeName){
		try{
			var objNode =strXML.nextNode();
  			var objXML = new ActiveXObject("MSXML.DOMDocument");
			if(objNode.text != ""){
				var aForm = objNode.text.split(";");
				objXML.loadXML(aForm[0]);
				if ( objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo") != null ){
					if (objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute(strNodeName) != null ){
						return objXML.selectSingleNode("ClientAppInfo/App/forminfos/forminfo").getAttribute(strNodeName);
					}else{
						return "";
					}
				}else{ return "";	}
			}else{
				return "";
			}
		}catch(e){return "";} //throw e
	}
	function getPINodeValue(strXML,iIndex){
		try{
			var objNode =strXML.nextNode();
  			var objXML = new ActiveXObject("MSXML.DOMDocument");
			if(objNode.text != ""){
				var aForm = objNode.text.split(";");
				if ( aForm.length > iIndex) {
					return aForm[iIndex];
				}else{
					return "";
				}
			}else{
				return "";
			}
		}catch(e){return "";} //throw e
	}
	]]>
</msxsl:script>
<xsl:template match="response">
		<table border="0" id="tblGalInfo" cellpadding="2" cellspacing="0" style="TABLE-LAYOUT: fixed;">
		<THEAD>
			<tr>
				<TD align="center" valign="middle" rowspan="2"  class="table_green" id="thSN" width="70" onClick="sortColumn('serial');" style="cursor:hand;">일련번호</TD>
				<TD align="center" valign="middle" rowspan="2"  class="table_mgreenbg" id="thAD" width="70" onClick="sortColumn('apvdt');" style="cursor:hand;">년월일</TD>
				<TD align="center" valign="middle" rowspan="2"  class="table_green" id="thCN" width="120" onClick="sortColumn('docno');" style="cursor:hand;">수 신</TD>
				<TD align="center" valign="middle" rowspan="2"  class="table_mgreenbg" id="thDN"  onClick="sortColumn('docsubject');" width="30%" style="cursor:hand;">제목</TD>
				<TD align="center" valign="middle" rowspan="2" class="table_green" id="thCL" >부수</TD>
				<TD align="center" valign="middle" rowspan="2" class="table_mgreenbg" id="thCH" >취급자</TD>
				<TD align="center" valign="middle" height="20" colspan="3"  class="table_green" id="thApp" style="border-left-width: 1px; border-right-width: 1px; border-top-width: 1px; border-bottom-style: solid; border-bottom-width: 1px">결 재</TD>
			</tr>
			<tr>
				<TD align="center" valign="middle" height="20" class="table_green" id="thApp1"   noWrap="t" width="50">계</TD>
				<TD align="center" valign="middle" class="table_mgreenbg" id="thApp2"   noWrap="t" width="50">계장</TD>
				<TD align="center" valign="middle" class="table_green" id="thApp3"   noWrap="t" width="50">과장</TD>
			</tr>
			<tr>
				<td height="1" colspan="9" align="center" class="table_line"></td>
			</tr>
		</THEAD>
		<TBODY>
		<xsl:for-each select="docitem">
			<tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" class="rowunselected">
				<xsl:attribute name="className">rowunselected</xsl:attribute>
				<xsl:attribute name="piid"><xsl:value-of select="cfxsl:getPINodeValue(effectcmt,1)"/></xsl:attribute>
				<xsl:attribute name="bstate"><xsl:value-of select="cfxsl:getPINodeValue(effectcmt,2)"/></xsl:attribute>
				<xsl:attribute name="pibd1"><xsl:value-of select="cfxsl:getPINodeValue(effectcmt,0)"/></xsl:attribute>
				<xsl:attribute name="fmid"><xsl:value-of select="cfxsl:getNodeValue(effectcmt,'id')"/></xsl:attribute>
				<xsl:attribute name="fmnm"><xsl:value-of select="cfxsl:getNodeValue(effectcmt,'name')"/></xsl:attribute>
				<xsl:attribute name="fmpf"><xsl:value-of select="cfxsl:getNodeValue(effectcmt,'prefix')"/></xsl:attribute>
				<xsl:attribute name="fmrv"><xsl:value-of select="cfxsl:getNodeValue(effectcmt,'revision')"/></xsl:attribute>
				<xsl:attribute name="scid"><xsl:value-of select="cfxsl:getNodeValue(effectcmt,'schemaid')"/></xsl:attribute>
				<xsl:attribute name="fiid"><xsl:value-of select="cfxsl:getNodeValue(effectcmt,'instanceid')"/></xsl:attribute>
				<xsl:attribute name="fmfn"><xsl:value-of select="cfxsl:getNodeValue(effectcmt,'filename')"/></xsl:attribute>
				<xsl:attribute name="ispaper"><xsl:value-of select="cfxsl:getNodeValue(effectcmt,'ispaper')"/></xsl:attribute>
				<td  height="20" valign="middle" nowrap="true" style="overflow:hidden; padding-Right:10px" align="right" onselect="false"><xsl:value-of select="serial"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="apvdt"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="recounm"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="docsubject"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="rgcmt"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="initnm"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"></td>
			</tr>
		</xsl:for-each>
		</TBODY>
		</table>
	</xsl:template>
</xsl:stylesheet>
