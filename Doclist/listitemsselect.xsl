<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
<xsl:output media-type="text/html"/>
<xsl:param name="sTitle">받은시간</xsl:param>
<xsl:param name="totalcount" />
<xsl:param name="pagenum" />
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
				sSubKind= "담당";break;
			case "T009":
				sSubKind= "합의";break;
			case "T010":
				sSubKind= "예고";break;
			case "T012":
				sSubKind= "담당";break;
			case "T013":
				sSubKind= "참조";break;
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
			case "SP":
				sSubKind= "열람";break;
			case "C":
				sSubKind= "합의기안";break;
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
		<table width='100%'   height="100%"  id="tblGalInfo"  border="0" cellpadding="0" cellspacing="0" >
		<THEAD>
      <tr>
        <td height="2" colspan="6" bgcolor="#dc5f0a"></td>
      </tr>
      <tr bgcolor="#f5ebe2">
				<TD height="27"  class="list_tit" style="border-style: solid; border-width: 0;"  noWrap="t" width="40"><input type="checkbox"  id="chkAll" onClick="chkAll();"/></TD>
        <TD class="list_tit" style="border-style: solid; border-width: 0" id="thNo" noWrap="t" width="40" align="center" >번호</TD>
				<!--<TD class="list_tit" style="border-style: solid; border-width: 0" id="thSK" noWrap="t" width="10" align="center" ></TD>-->
				<!--<TD class="list_tit" style="border-style: solid; border-width: 0" id="thSK" noWrap="t" width="60" align="center" >구분</TD>-->
				<TD class="list_tit" style="border-style: solid; border-width: 0;" id="thBR" noWrap="t" width="170" onClick="sortColumn('FORM_NAME');" align="center" >문서명<span id="spanFORM_NAME"></span></TD>
				<TD class="list_tit" style="border-style: solid; border-width: 0;" id="thDN" onClick="sortColumn('PI_SUBJECT');" align="center" >제목<span id="spanPI_SUBJECT"></span></TD>
				<!--<TD class="list_tit" style="border-style: solid; border-width: 0;cursor:hand" id="thER" noWrap="t" width="90" onClick="sortColumn('PI_INITIATOR_UNIT_NAME');" align="center" >기안부서<span id="spanPI_INITIATOR_UNIT_NAME"></span></TD>-->
				<TD class="list_tit" style="border-style: solid; border-width: 0;" id="thCR" noWrap="t" width="90" onClick="sortColumn('PI_INITIATOR_NAME');" align="center" >기안자<span id="spanPI_INITIATOR_NAME"></span></TD>
				<TD class="list_tit" style="border-style: solid; border-width: 0" id="thAT" width="100" align="center" ><xsl:value-of select="$sTitle"/></TD>
				<!--<TD class="list_tit" id="thET" noWrap="t" width="60">비고</TD>-->
			</tr>
      <tr>
        <td height="1" colspan="6" bgcolor="#cccccc"></td>
      </tr>
		</THEAD>
		<TBODY>
		<xsl:for-each select="workitem">
				<tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" class="rowunselected">
				<!--<xsl:attribute name="secdoc"><xsl:value-of select="@secdoc"/></xsl:attribute>-->
				<xsl:attribute name="className">rowunselected</xsl:attribute>
				<xsl:attribute name="id"><xsl:value-of select="id"/></xsl:attribute>
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
				<xsl:attribute name="title"><xsl:value-of select="title"/></xsl:attribute>
				<xsl:attribute name="effectcmt"><xsl:value-of select="concat(concat(concat(concat(pidc,';'),piid),bstate),';')"/></xsl:attribute>
				<td  height="24" valign="middle" nowrap="true"  style="overflow:hidden; padding-Right:5px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" align="right" onselect="false">
					<input type="checkbox" id="chkID" ><xsl:attribute name="value"><xsl:value-of select="concat(id,'@@@',concat(pidc,';',piid,';',bstate),'@@@',title)"/></xsl:attribute></input>
				</td>
				<td height="24" align="center" valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false"><xsl:value-of select="$totalcount - ($pagenum - 1 ) * 15 - position() + 1 "/></td>
				<!--<td height="24" valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false"><xsl:value-of select="cfxsl:getUrgent(string(pipr))"/></td>-->
				<!--<td height="24" align="center" valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false"><xsl:value-of select="cfxsl:getSubKind(string(pfsk))"/></td>-->
				<td height="24" valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false"><xsl:value-of select="fmnm"/></td>
				<td height="24" valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false">
          <a href="#" class="text02_L" onclick="event_GalTable_ondblclick()" >
            <xsl:value-of select="title"/>
          </a>
        </td>
				<!--<td height="24" valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false"><xsl:value-of select="picreatordept"/></td>-->
				<td height="24" valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false"><xsl:value-of select="picreator"/></td>
				<td height="24" valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false"><xsl:value-of select="completedate"/></td>
				<!--<td height="24" valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px;font-size:9pt; 	font-family:굴림체; 	color:#60593A;border-bottom-style: solid; border-width: 1" onselect="false"><xsl:value-of select="ugrs"/><xsl:value-of select="cfxsl:getIsPaper(string(ispaper))"/><xsl:value-of select="cfxsl:getRequestResponse(string(rqrs))"/></td>-->
				</tr>
		</xsl:for-each>
      <tr>
        <td height="1" colspan="6" bgcolor="#cccccc"></td>
      </tr>
      <tr>
        <td height="3" colspan="6" bgcolor="#f0f0f0"></td>
      </tr>
		</TBODY>
		</table>
</xsl:template>
</xsl:stylesheet>
