<%@ Page Language="C#" AutoEventWireup="true" CodeFile="sealdoclistXSL.aspx.cs" Inherits="COVIFlowNet_Doclist_sealdoclistXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"	
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">

<xsl:template match="response">
		<table border="0" id="tblGalInfo" cellpadding="0" cellspacing="0" style="width:100%;">
		<THEAD>
		<tr>
            <td height="1" colspan="9" class="BTable_bg01"></td>
        </tr>
			<tr  class="BTable_bg02" style="width:100%;">
				<Th class="BTable_bg07" style="padding-left:10px;" rowspan="2"  id="thSN" width="70" onClick="sortColumn('serial');" style="cursor:hand;"><%= Resources.Approval.lbl_SerialNo %></Th>
				<Th class="BTable_bg07" rowspan="2" id="thAD" width="70" onClick="sortColumn('apvdt');" style="cursor:hand;"><%= Resources.Approval.lbl_date %></Th>
				<Th class="BTable_bg07" rowspan="2"  id="thCN" width="120" onClick="sortColumn('docno');" style="cursor:hand;"><%= Resources.Approval.lbl_receive %></Th>
				<Th class="BTable_bg07" rowspan="2"  id="thDN"  onClick="sortColumn('docsubject');" width="30%" style="cursor:hand;"><%= Resources.Approval.lbl_subject %></Th>
				<Th class="BTable_bg07" rowspan="2"  id="thCL" ><%= Resources.Approval.lbl_Copies %></Th>
				<Th class="BTable_bg07" rowspan="2"  id="thCH" ><%= Resources.Approval.lbl_Manager %></Th>
				<Th class="BTable_bg07" colspan="3"  id="thApp" style="border-left-width: 1px; border-right-width: 1px; border-top-width: 1px; border-bottom-style: solid; border-bottom-width: 1px"><%= Resources.Approval.lbl_app %></Th>
			</tr>
			<tr class="BTable_bg02" style="width:100%;">
				<Th class="BTable_bg07" id="thApp1"   noWrap="t" width="50"><%= Resources.Approval.lbl_Section %></Th>
				<Th class="BTable_bg07" id="thApp2"   noWrap="t" width="50"><%= Resources.Approval.lbl_SectionChief %></Th>
				<Th class="BTable_bg07" id="thApp3"   noWrap="t" width="50"><%= Resources.Approval.lbl_SectionHead %></Th>
			</tr>
		</THEAD>
		<TBODY>
		<xsl:for-each select="docitem">
			<tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" class="rowunselected">
                <xsl:choose>
						<xsl:when test="(position() mod 2) = 1 ">
						    <xsl:attribute name="onMouseover">this.style.background='#f8f4de';</xsl:attribute><!--필요없으면 제거할것-->
			                <xsl:attribute name="onMouseout">this.style.background=''</xsl:attribute><!--필요없으면 제거할것-->						
					    </xsl:when>
					    <xsl:otherwise>
							<xsl:attribute name="onMouseover">this.style.background='#f8f4de';</xsl:attribute><!--필요없으면 제거할것-->
			                <xsl:attribute name="onMouseout">this.style.background=''</xsl:attribute><!--필요없으면 제거할것-->
					    </xsl:otherwise>
				</xsl:choose>
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
				<td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-left:10px" onselect="false"><xsl:value-of select="serial"/></td>
				<td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="apvdt"/></td>
				<td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="recounm"/></td>
				<td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="docsubject"/></td>
				<td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="rgcmt"/></td>
				<td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="initnm"/></td>
				<td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"></td>
				<td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"></td>
				<td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"></td>
			</tr>
		</xsl:for-each>
		<!--<tr>
          <td height="1" colspan="9" class="BTable_bg03"></td>
        </tr>
        <tr>
          <td height="2" colspan="9" class="BTable_bg04"></td>
        </tr>-->
		</TBODY>
		</table>
	</xsl:template>
</xsl:stylesheet>
