<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output media-type="text/html"/>
<xsl:template match="response">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#c5c5c5" height="100%">
	<tr>
     <td bgcolor="#FFFFFF" height="100%" valign="top"> 
		<table width='100%' id="tblGalInfo"  border="0" cellpadding="0" cellspacing="0" CLASS="DataGrid_NL fixed">
		<THEAD>
			<tr>
				<TD height="20"  CLASS="thTitle_NL" style="cursor:hand;" id="thBR" noWrap="t" width="120" onClick="sortColumn('FORM_NAME');" align="CENTER">구분<span id="spanFORM_NAME"></span></TD>
				<TD CLASS="thTitle_NL" style="cursor:hand;" id="thDN"  onClick="sortColumn('SUBJECT');"  align="CENTER">제목  <span id="spanSUBJECT"></span></TD>
				<TD CLASS="thTitle_NL" style="cursor:hand;" id="thSD"  width="110" onClick="sortColumn('SENDER');" align="CENTER">발신자  <span id="spanSENDER"></span></TD>
				<TD CLASS="thTitle_NL" style="cursor:hand;" id="thAT"  width="110" onClick="sortColumn('CREATED');" align="CENTER">발신일자  <span id="spanCREATED"></span></TD>
			</tr>
			<tr>
				<td height="1" colspan="3" align="center" class="table_line"></td>
			</tr>
		</THEAD>
		<TBODY>
		<xsl:choose>
			<xsl:when test="(count(forminstance)) = 0 ">
				<tr>
					<td  height="20" colspan="3" valign="top" nowrap="true" align="center" CLASS="tdData_NL">저장된 문서가 없습니다.</td>
				</tr>
			</xsl:when>
			<xsl:otherwise>
				<xsl:for-each select="forminstance">
					<tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" class="rowunselected" style="cursor:hand">
						<!--<xsl:attribute name="id"><xsl:value-of select="ftid"/></xsl:attribute>
						<xsl:attribute name="fiid"><xsl:value-of select="fiid"/></xsl:attribute>
						<xsl:attribute name="fmid"><xsl:value-of select="fmid"/></xsl:attribute>
						<xsl:attribute name="scid"><xsl:value-of select="scid"/></xsl:attribute>
						<xsl:attribute name="fmpf"><xsl:value-of select="fmpf"/></xsl:attribute>
						<xsl:attribute name="fmrv"><xsl:value-of select="fmrv"/></xsl:attribute>
						<xsl:attribute name="ftid"><xsl:value-of select="ftid"/></xsl:attribute>
						<xsl:attribute name="fitn"><xsl:value-of select="fitn"/></xsl:attribute>
						<xsl:attribute name="fmfn"><xsl:value-of select="fmfn"/></xsl:attribute>
						<xsl:attribute name="picreatorid"><xsl:value-of select="picreatorid"/></xsl:attribute>-->
						<xsl:attribute name="fmnm"><xsl:value-of select="fmnm"/></xsl:attribute>
						<xsl:attribute name="mode"><xsl:value-of select="mode"/></xsl:attribute>
						<xsl:attribute name="pidc"><xsl:value-of select="pidc"/></xsl:attribute>
						<xsl:attribute name="sender"><xsl:value-of select="sender"/></xsl:attribute>
						<xsl:attribute name="createdate"><xsl:value-of select="createdate"/></xsl:attribute>
						<xsl:attribute name="title"><xsl:value-of select="title"/></xsl:attribute>
						<xsl:attribute name="piid"><xsl:value-of select="piid"/></xsl:attribute>
						<td  height="20" valign="top" nowrap="true" CLASS="tdData_NL" onselect="false"><xsl:value-of select="fmnm"/></td>
						<td  valign="top" nowrap="true" CLASS="tdData_NL" onselect="false"><xsl:value-of select="title"/></td>
						<td  valign="top" nowrap="true" CLASS="tdData_NL" onselect="false"><xsl:value-of select="sender"/></td>
						<td  valign="top" nowrap="true" CLASS="tdData_NL" onselect="false"><xsl:value-of select="createdate"/></td>
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
