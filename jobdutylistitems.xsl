<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"	
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
	<xsl:output media-type="text/html"/>
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
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#FFFFFF" valign="top">
					<table id="tblGalInfo" width="100%"  border="0" cellspacing="0" cellpadding="0" style="TABLE-LAYOUT: fixed;">
						<THEAD>
						<tr>
							<TD height="20" align="center" valign="middle" class="table_green" id="thSN" noWrap="t" width="100" onClick="sortColumn('FORM_NAME');" style="cursor:hand;">
								양식<span id="spanFORM_NAME"></span>
							</TD>
							<TD height="20" align="center" valign="middle" class="table_green" id="thDN" onClick="sortColumn('SUBJECT');" style="cursor:hand;">
								제목<span id="spanSUBJECT"></span>
							</TD>
							<TD height="20" align="center" valign="middle" class="table_green" id="thAD" noWrap="t" width="70" onClick="sortColumn('INITIATOR_OU_NAME');" style="cursor:hand;">
								기안부서<span id="spanINITIATOR_OU_NAME"></span>
							</TD>
							<TD height="20" align="center" valign="middle" class="table_green" id="thCN" noWrap="t" width="160" onClick="sortColumn('INITIATOR_NAME');" style="cursor:hand;">
								기안자<span id="spanINITIATOR_NAME"></span>
							</TD>
							<TD height="20" align="center" valign="middle" class="table_green" id="thED" noWrap="t" width="100"   style="cursor:hand;">완료일자</TD>
							<!--<TD id="thRD" noWrap="t" width="100" onClick="sortColumn('recounm');">수 신 처</TD>
						<TD id="thET" width="50">비고</TD>-->
						</tr>
						<tr>
							<td height="1" colspan="5" align="center" class="table_line"></td>
						</tr>
					</THEAD>
					<TBODY>
						<xsl:for-each select="docitem">
							<tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" class="rowunselected">
								<xsl:attribute name="className">rowunselected</xsl:attribute>
								<xsl:attribute name="piid">
									<xsl:value-of select="cfxsl:getPINodeValue(effectcmt,1)"/>
								</xsl:attribute>
								<xsl:attribute name="bstate">
									<xsl:value-of select="cfxsl:getPINodeValue(effectcmt,2)"/>
								</xsl:attribute>
								<xsl:attribute name="pibd1">
									<xsl:value-of select="cfxsl:getPINodeValue(effectcmt,0)"/>
								</xsl:attribute>
								<xsl:attribute name="fmid">
									<xsl:value-of select="cfxsl:getNodeValue(effectcmt,'id')"/>
								</xsl:attribute>
								<xsl:attribute name="fmnm">
									<xsl:value-of select="cfxsl:getNodeValue(effectcmt,'name')"/>
								</xsl:attribute>
								<xsl:attribute name="fmpf">
									<xsl:value-of select="cfxsl:getNodeValue(effectcmt,'prefix')"/>
								</xsl:attribute>
								<xsl:attribute name="fmrv">
									<xsl:value-of select="cfxsl:getNodeValue(effectcmt,'revision')"/>
								</xsl:attribute>
								<xsl:attribute name="scid">
									<xsl:value-of select="cfxsl:getNodeValue(effectcmt,'schemaid')"/>
								</xsl:attribute>
								<xsl:attribute name="fiid">
									<xsl:value-of select="cfxsl:getNodeValue(effectcmt,'instanceid')"/>
								</xsl:attribute>
								<xsl:attribute name="fmfn">
									<xsl:value-of select="cfxsl:getNodeValue(effectcmt,'filename')"/>
								</xsl:attribute>
								<xsl:attribute name="ispaper">
									<xsl:value-of select="cfxsl:getNodeValue(effectcmt,'ispaper')"/>
								</xsl:attribute>
								<xsl:attribute name="secdoc">
									<xsl:value-of select="cfxsl:getNodeValue(effectcmt,'secure_doc')"/>
								</xsl:attribute>
								<xsl:attribute name="edms_document">
									<xsl:value-of select="cfxsl:getNodeValue(effectcmt,'edms_document')"/>
								</xsl:attribute>
								<xsl:attribute name="jdid">
									<xsl:value-of select="jdid"/>
								</xsl:attribute>
								<xsl:attribute name="mode">
									<xsl:value-of select="mode"/>
								</xsl:attribute>
								<td height="20" valign="middle" nowrap="true" style="overflow:hidden; padding-Right:10px" align="left" onselect="false">
									<xsl:value-of select="fmnm"/>
								</td>
								<td valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false">
									<xsl:value-of select="title"/>
								</td>
								<td valign="middle" align="center" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false">
									<xsl:value-of select="picreatordept"/>
								</td>
								<td valign="middle" align="center" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false">
									<xsl:value-of select="picreator"/>
								</td>
								<td valign="middle" align="center" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false">
									<xsl:value-of select="createdate"/>
								</td>
								<!--<td valign="top" nowrap="true" style="overflow:hidden; padding-Right:1px" onClick="aaa();" onselect="false"><xsl:value-of select="cfxsl:setNodeValue(recounm)" disable-output-escaping="yes"/></td>-->
							</tr>
						</xsl:for-each>
					</TBODY>
				</table>
				</td>
			</tr>
		</table>
	</xsl:template>
</xsl:stylesheet>
