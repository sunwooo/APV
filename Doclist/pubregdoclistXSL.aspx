<%@ Page Language="C#" AutoEventWireup="true" CodeFile="pubregdoclistXSL.aspx.cs" Inherits="COVIFlowNet_Doclist_pubregdoclistXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"	
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">

<xsl:template match="response">
		<table border="0" id="tblGalInfo" cellpadding="2" cellspacing="0" style="width:100%;">
		<THEAD>
		    <tr>
                <td height="1" colspan="7" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02" style="height:30px">
				<Th class="BTable_bg07" id="thSN" noWrap="t" width="60" onClick="sortColumn('serial');" style="padding-left:10px;cursor:hand;"><%= Resources.Approval.lbl_RegisterNo %></Th>
				<Th class="BTable_bg07" id="thAD" noWrap="t" width="70" onClick="sortColumn('apvdt');" style="cursor:hand;"><%= Resources.Approval.lbl_senddate %></Th>
				<Th class="BTable_bg07" id="thCN" noWrap="t" width="140" onClick="sortColumn('docno');" style="cursor:hand;"><%= Resources.Approval.lbl_SendNo %></Th>
				<Th class="BTable_bg07" id="thDN" onClick="sortColumn('docsubject');" style="cursor:hand;"><%= Resources.Approval.lbl_DocName %></Th>
				<Th class="BTable_bg07" id="thRC" noWrap="t" width="50"><%= Resources.Approval.lbl_DocPages %></Th>
				<Th class="BTable_bg07" id="thRON" noWrap="t" width="100"><%= Resources.Approval.lbl_RecvDept %></Th>
				<Th class="BTable_bg07" id="thRN" noWrap="t" width="70"><%= Resources.Approval.lbl_Sender %></Th>
			</tr>
			<!--<tr>
                <td height="1" colspan="7" class="BTable_bg03"></td>
            </tr>-->
		</THEAD>
		<TBODY>
		<xsl:choose>
	    <xsl:when test="count(docitem) = 0 ">
	    <tr>
		    <td  class="BTable_bg08"  colspan="7" valign="middle" nowrap="true" align="center"> <%= Resources.Approval.msg_112 %> <!-- 검색된 문서가 없습니다. --></td>
	    </tr>
	    </xsl:when>
	    <xsl:otherwise>
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
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-left:10px" onselect="false"><xsl:value-of select="serial"/></td>
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="apvdt"/></td>
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="docno"/></td>
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="docsubject"/></td>
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="rgcmt"/></td>
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="recounm"/></td>
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="rgnm"/></td>						
			</tr>
		</xsl:for-each>
		<!--<tr>
          <td height="1" colspan="7" class="BTable_bg03"></td>
        </tr>
        <tr>
          <td height="2" colspan="7" class="BTable_bg04"></td>
        </tr>-->
        </xsl:otherwise>		
        </xsl:choose>
        </TBODY>
		</table>
	</xsl:template>
</xsl:stylesheet>
