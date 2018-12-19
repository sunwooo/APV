<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"	
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
<xsl:output media-type="text/html"/>
<xsl:param name="totalcount" />
<xsl:param name="pagenum" />
<msxsl:script language="JScript" implements-prefix="cfxsl">
	<![CDATA[
	function setNodeValue(strXML){
		try{
			var objNode =strXML.nextNode();
			if (objNode != null){
				if(objNode.text != ""){
					var aRecDept = objNode.text.split(",");
					var sReturn="";
					for(var i=0; i < aRecDept.length; i++){
						sReturn +=  "<br>" + aRecDept[i];
					}
					if( sReturn.length > 4 ) sReturn = sReturn.substring(4);
					return sReturn;
				}else{
					return "";
				}
			}else{
				return "";
			}
		}catch(e){throw e}
	}
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
		<table width='100%'   height="100%"  id="tblGalInfo"  border="0" cellpadding="0" cellspacing="0" style="border-style:solid; border-width:1; border-collapse: collapse; padding-left:1; padding-right:1; padding-top:1; padding-bottom:1;TABLE-LAYOUT: fixed;" bordercolor="#CECECE">
		<THEAD>
			<tr  class="gallistheading" style="border-style: solid; border-width: 1" >
				<TD height="21"  class="gallistheading" style="border-style: solid; border-width: 1;cursor:hand"  noWrap="t" width="40"><input type="checkbox"  id="chkAll" onClick="chkAll();"/></TD>
				<TD height="21"  class="gallistheading" style="border-style: solid; border-width: 1"  id="thSN" noWrap="t" width="60" onClick="sortColumn('serial');">일련번호</TD>
				<TD  class="gallistheading" style="border-style: solid; border-width: 1;cursor:hand"  id="thCN" noWrap="t" width="150" onClick="sortColumn('docno');">문서번호</TD>
				<TD  class="gallistheading" style="border-style: solid; border-width: 1;cursor:hand"  id="thDN" onClick="sortColumn('docsubject');" >제목</TD>
				<!--<TD  class="gallistheading" style="border-style: solid; border-width: 1;cursor:hand"  id="thAD" noWrap="t" width="70" onClick="sortColumn('apvdt');">결재일자</TD>-->
				<TD  class="gallistheading" style="border-style: solid; border-width: 1;cursor:hand"  id="thIT" noWrap="t" width="80"  onClick="sortColumn('initnm');">기안자</TD>
				<TD  class="gallistheading" style="border-style: solid; border-width: 1"  noWrap="t" width="40" >연결</TD>
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
			<xsl:attribute name="secdoc">
				<xsl:variable name="iSDoc" select="cfxsl:getNodeValue(effectcmt,'secure_doc')"/>
				<xsl:choose>
					<xsl:when test="$iSDoc=''">0</xsl:when>
					<xsl:otherwise><xsl:value-of select="$iSDoc"/></xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>
			<td  height="24" valign="middle" nowrap="true"  style="overflow:hidden; padding-Right:5px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" align="right" onselect="false">
				<input type="checkbox" id="chkID" ><xsl:attribute name="value"><xsl:value-of select="concat(id,'@@@',effectcmt,'@@@',docsubject)"/></xsl:attribute></input>
			</td>
				<td height="24" valign="middle" nowrap="true"  style="overflow:hidden; padding-Right:5px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" align="right" onselect="false"><xsl:value-of select="$totalcount - ($pagenum - 1 ) * 15 - position() + 1 "/></td>
			<td valign="middle" nowrap="true"  style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false"><xsl:value-of select="docno"/></td>
			<td valign="middle" nowrap="true"  style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false"><xsl:value-of select="docsubject"/></td>
			<!--<td valign="middle" nowrap="true"  style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false"><xsl:value-of select="apvdt"/></td>-->
			<td valign="middle" nowrap="true"  style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false"><xsl:value-of select="initnm"/></td>
			<td  align="center" valign="middle" nowrap="true"  style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false">
					<xsl:choose>
						<xsl:when test=" linkstate = '1' ">
							*
						</xsl:when>
						<xsl:otherwise>
						</xsl:otherwise>
					</xsl:choose>
			</td>
			</tr>
		</xsl:for-each>
		</TBODY>
		</table>
	</xsl:template>
</xsl:stylesheet>
