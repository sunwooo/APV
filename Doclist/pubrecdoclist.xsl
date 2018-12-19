<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output media-type="text/html"/>
<xsl:template match="response">
		<table border="0" id="tblGalInfo" cellpadding="2" cellspacing="0" style="TABLE-LAYOUT: fixed;">
		<THEAD>
			<tr>
				<TD height="20" align="center" valign="middle" class="table_green" id="thSN" noWrap="t" width="70" onClick="sortColumn('serial');" style="cursor:hand;">일련번호</TD>
				<TD height="20" align="center" valign="middle" class="table_mgreenbg" id="thAD" noWrap="t" width="100" onClick="sortColumn('rgdt');" style="cursor:hand;">접수일자</TD>
				<TD height="20" align="center" valign="middle" class="table_green" id="thSON" noWrap="t" width="100" onClick="sortColumn('senounm');" style="cursor:hand;">발신기관명</TD>
				<TD height="20" align="center" valign="middle" class="table_mgreenbg" id="thCN" noWrap="t" width="120" onClick="sortColumn('docno');" style="cursor:hand;">문서번호</TD>
				<TD height="20" align="center" valign="middle" class="table_green" id="thDN"  width="100" >처리과</TD>
				<TD height="20" align="center" valign="middle" class="table_mgreenbg" id="thEF" noWrap="t" width="70" >인수자명</TD>
				<TD height="20" align="center" valign="middle" class="table_green" id="thET" >비고</TD>
				<TD height="20" align="center" valign="middle" class="table_mgreenbg" id="thPR"  width="100" >처리현황</TD>
			</tr>
			<tr>
				<td height="1" colspan="8" align="center" class="table_line"></td>
			</tr>
		</THEAD>
		<TBODY>
		<xsl:for-each select="docitem">
			<tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" class="rowunselected">
				<td height="20"  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:10px" align="right" onselect="false"><xsl:value-of select="serial"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="rgdt"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="senounm"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="docno"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="recounm"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="chargenm"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="rgcmt"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="effectcmt"/></td>
			</tr>
		</xsl:for-each>
		</TBODY>
		</table>
	</xsl:template>
</xsl:stylesheet>
