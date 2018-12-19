<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
	<xsl:output media-type="text/html"/>
	<xsl:param name="sTitle">받은시간</xsl:param>
	<msxsl:script language="JScript" implements-prefix="cfxsl">
		<![CDATA[
	function getSubKind(sKind){
		try{
		var sSubKind="";
		//var strKind = sKind.text;
		switch(sKind){
			case "T000":
				sSubKind= "결재";break;
			
			default: sSubKind= sKind;break;
		}
		return sSubKind;
		}catch(e){throw e}
	}
	function getIsPaper(sIsPaper){
		try{
		var sYN="";
		switch(sIsPaper){
			case "Y":
				sYN= "서면결재";break;
			case "N":
			case "":
			default: sYN= "";break;
		}
		return sYN;
		}catch(e){throw e}
	}
	function getUrgent(sPriority){
		try{
		var sYN="";
		switch(sPriority){
			case "1":
			case "2":
			case "3":sYN= "";break;
			case "4":sYN= "*";break;
			case "5":sYN= "*";break;
			default: sYN= sPriority;break;
		}
		return sYN;
		}catch(e){throw e}
	}
	function getRequestResponse(sReqResponse){
		try{
		var sYN="";
		switch(sReqResponse){
			case "Y":
				sYN= "회신요구";break;
			case "N":
			case "":
			default: sYN= "";break;
		}
		return sYN;
		}catch(e){throw e}
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
								<TD height="20" align="center" valign="middle" class="table_green" id="thSK" noWrap="t" width="60" >구분</TD>
								<TD align="center" valign="middle" class="table_green" id="thBR" noWrap="t" width="170" onClick="sortColumn('FORM_NAME');" style="cursor:hand;">
									<span id="spanFORM_NAME"></span>
								</TD>
								<TD align="center" valign="middle" class="table_green" id="thDN" onClick="sortColumn('PI_SUBJECT');" style="cursor:hand;">
									<span id="spanPI_SUBJECT"></span>
								</TD>
								<TD align="center" valign="middle" class="table_green" id="thER" noWrap="t" width="90" onClick="sortColumn('PI_INITIATOR_UNIT_NAME');" style="cursor:hand;">
									<span id="spanPI_INITIATOR_UNIT_NAME"></span>
								</TD>
								<TD align="center" valign="middle" class="table_green" id="thCR" noWrap="t" width="90" onClick="sortColumn('PI_INITIATOR_NAME');" style="cursor:hand;">
									<span id="spanPI_INITIATOR_NAME"></span>
								</TD>
								<TD align="center" valign="middle" class="table_green" id="thAT" width="100">
									<xsl:value-of select="$sTitle"/>
								</TD>
								<!--<TD class="table_mgraybg" id="thET" noWrap="t" width="60">비고</TD>-->
							</tr>
							<tr>
								<td height="1" colspan="6" align="center" class="table_line"></td>
							</tr>
						</THEAD>

						<TBODY>
							<xsl:choose>
								<xsl:when test="count(workitem) = 0 ">
									<tr>
										<td  height="20" colspan="6" valign="top" nowrap="true" align="center">저장된 문서가 없습니다.</td>
									</tr>
								</xsl:when>
								<xsl:otherwise>
									<xsl:for-each select="workitem">
										<tr>
											<!--<xsl:attribute name="secdoc"><xsl:value-of select="@secdoc"/></xsl:attribute>-->
											<xsl:attribute name="className">rowunselected</xsl:attribute>
											<xsl:attribute name="workitemid">
												<xsl:value-of select="id"/>
											</xsl:attribute>
											<xsl:attribute name="piid">
												<xsl:value-of select="piid"/>
											</xsl:attribute>
											<xsl:attribute name="pfid">
												<xsl:value-of select="pfid"/>
											</xsl:attribute>
											<xsl:attribute name="mode">
												<xsl:value-of select="mode"/>
											</xsl:attribute>
											<xsl:attribute name="participantid">
												<xsl:value-of select="participantid"/>
											</xsl:attribute>
											<xsl:attribute name="piviewstate"></xsl:attribute>
											<xsl:attribute name="fiid">
												<xsl:value-of select="fiid"/>
											</xsl:attribute>
											<xsl:attribute name="ftid">
												<xsl:value-of select="ftid"/>
											</xsl:attribute>
											<xsl:attribute name="fmid">
												<xsl:value-of select="fmid"/>
											</xsl:attribute>
											<xsl:attribute name="fmnm">
												<xsl:value-of select="fmnm"/>
											</xsl:attribute>
											<xsl:attribute name="fmrv">
												<xsl:value-of select="fmrv"/>
											</xsl:attribute>
											<xsl:attribute name="scid">
												<xsl:value-of select="scid"/>
											</xsl:attribute>
											<xsl:attribute name="fmpf">
												<xsl:value-of select="fmpf"/>
											</xsl:attribute>
											<xsl:attribute name="fmfn">
												<xsl:value-of select="fmfn"/>
											</xsl:attribute>
											<xsl:attribute name="bstate">
												<xsl:value-of select="bstate"/>
											</xsl:attribute>
											<xsl:attribute name="pfsk">
												<xsl:value-of select="pfsk"/>
											</xsl:attribute>
											<xsl:attribute name="pibd1">
												<xsl:value-of select="pibd1"/>
											</xsl:attribute>
											<xsl:attribute name="pipr">
												<xsl:value-of select="pipr"/>
											</xsl:attribute>
											<xsl:attribute name="pidc">
												<xsl:value-of select="pidc"/>
											</xsl:attribute>
											<xsl:attribute name="secdoc">
												<xsl:value-of select="secdoc"/>
											</xsl:attribute>
											<xsl:attribute name="edms_document">
												<xsl:value-of select="edms_document"/>
											</xsl:attribute>
											<td height="20" align="center" valign="middle" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false">
												<xsl:value-of select="cfxsl:getSubKind(string(pfsk))"/>
											</td>
											<td valign="middle" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false">
												<xsl:value-of select="fmnm"/>
											</td>
											<td valign="middle" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false">
												<xsl:value-of select="title"/>
											</td>
											<td align="center" valign="middle" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false">
												<xsl:value-of select="picreatordept"/>
											</td>
											<td align="center" vnowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false">
												<xsl:value-of select="picreator"/>
											</td>
											<td align="center" valign="middle" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false">
												<xsl:value-of select="completedate"/>
											</td>
											<!--<td class="tableDot" height="21" valign="top" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="ugrs"/><xsl:value-of select="cfxsl:getIsPaper(string(ispaper))"/><xsl:value-of select="cfxsl:getRequestResponse(string(rqrs))"/></td>-->
										</tr>
									</xsl:for-each>
								</xsl:otherwise>
							</xsl:choose>
						</TBODY>
					</table>
				</td>
			</tr>
		</table>
	</xsl:template>
</xsl:stylesheet>
