<%@ Page Language="C#" AutoEventWireup="true" CodeFile="senddoclistXSL.aspx.cs" Inherits="COVIFlowNet_Doclist_senddoclistXSL" %><?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"	
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">

<xsl:template match="response">
		<table border="0" id="tblGalInfo" cellpadding="0" cellspacing="0" style="width:100%;">
		<THEAD>
		    <tr>
                <td height="1" colspan="6" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02" style="width:100%;">
				<Th class="BTable_bg07" id="thSN" width="60" style="padding-left:10px;"><%= Resources.Approval.lbl_SerialNo %></Th>
				<Th class="BTable_bg07" id="thCN" width="100" onClick="sortColumn('docno');" style="cursor:hand;"><%= Resources.Approval.lbl_DocNo %><span id="spandocno"></span></Th>
				<Th class="BTable_bg07" id="thRD" noWrap="t" width="100"><%= Resources.Approval.lbl_RecvDept %></Th>
				<Th class="BTable_bg07" id="thDN"  onClick="sortColumn('docsubject');" style="cursor:hand;"><%= Resources.Approval.lbl_subject %><span id="spandocsubject"></span></Th>
				<!--<TD id="thED" noWrap="t" width="90"  onClick="sortColumn('effectdt');">일 자</TD>-->
				<Th class="BTable_bg07"  width="100" ><%= Resources.Approval.lbl_writer %></Th>
				<Th class="BTable_bg07" id="thAD" width="120" onClick="sortColumn('rgdt');" style="cursor:hand;"><%= Resources.Approval.lbl_senddate %><span id="spanrgdt"></span></Th>
				<!--<TD  id="thET" width="80">비고</TD>-->
			</tr>
		</THEAD>
		<TBODY>
		<xsl:choose>
		    <xsl:when test="count(docitem) = 0 ">
		    <tr>
			    <td  height="25" colspan="6"  class="BTable_bg08" nowrap="true" align="center"> <%= Resources.Approval.msg_112 %> <!-- 검색된 문서가 없습니다. --></td>
		    </tr>
		    </xsl:when>
		    <xsl:otherwise>
		        <xsl:for-each select="docitem">
			        <tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" style="height:25px">
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
				        <!--<xsl:attribute name="pidc"><xsl:value-of select="cfxsl:getPINodeValue(effectcmt,0)"/></xsl:attribute>-->
				        
			            
			            <td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-left:10px" onselect="false"><xsl:value-of select="serial"/></td>
				        <td class="BTable_bg08" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="docno"/></td>
				        <td class="BTable_bg08" nowrap="true" style="overflow:hidden; paddingRight:1px" onClick="openpopup();" onselect="false"><xsl:value-of select="cfxsl:setNodeValue(recounm)" disable-output-escaping="yes"/>&#160;</td>
				        <td class="BTable_bg08" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><a href="#" class="text02_L"><xsl:value-of select="docsubject"/></a></td>
				        <!--<td class="BTable_bg08" valign="top" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="effectdt"/></td>-->
				        <td class="BTable_bg08" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="rgnm"/></td>
				        <td class="BTable_bg08" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="rgdt"/></td>
				        <!--<td cclass="BTable_bg08" style="overflow:hidden; paddingRight:1px" onselect="false"></td>-->
			        </tr>
		        </xsl:for-each>
		    </xsl:otherwise>
		</xsl:choose>
		<!--<tr>
          <td height="1" colspan="5" class="BTable_bg03"></td>
        </tr>
        <tr>
          <td height="2" colspan="5" class="BTable_bg04"></td>
        </tr>-->
		</TBODY>
		</table>
	</xsl:template>
</xsl:stylesheet>
