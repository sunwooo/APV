﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="recdoclistXSL.aspx.cs" Inherits="COVIFlowNet_Doclist_recdoclistXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"	
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">

<xsl:template match="response">
		<table  border="0" id="tblGalInfo" cellpadding="0" cellspacing="0" style="width:100%;">
		<THEAD>
		<tr>
            <td height="1" colspan="6" class="BTable_bg01"></td>
        </tr>
			<tr class="BTable_bg02" style="width:100%;">
				<Th class="BTable_bg07" style="padding-left:10px;" id="thSN" noWrap="t" width="60"><%= Resources.Approval.lbl_SerialNo%></Th>
				<Th class="BTable_bg07" id="thAD" noWrap="t" width="100" onClick="sortColumn('rgdt');" style="cursor:hand;"><%= Resources.Approval.lbl_RecvDate %><span id="spanrgdt"></span></Th>
				<Th class="BTable_bg07" id="thSN" noWrap="t" width="100" onClick="sortColumn('senounm');" style="cursor:hand;"><%= Resources.Approval.lbl_send %><span id="spansenounm"></span></Th>
				<Th class="BTable_bg07" id="thCN" noWrap="t" width="160" onClick="sortColumn('docno');" style="cursor:hand;"><%= Resources.Approval.lbl_DocNo %><span id="spandocno"></span></Th>
				<Th class="BTable_bg07" id="thDN"  onClick="sortColumn('docsubject');" style="cursor:hand;"><%= Resources.Approval.lbl_subject %><span id="spandocsubject"></span></Th>
				<Th class="BTable_bg07" id="thEF" noWrap="t" width="70"><%= Resources.Approval.lbl_ReceiverName %></Th>
				<!--<TD id="thET" width="70" >비고</TD>-->
			</tr>
		</THEAD>
		<TBODY>
		<xsl:choose>
		    <xsl:when test="count(docitem) = 0 ">
		    <tr>
			    <td  class="BTable_bg08"  colspan="6" valign="middle" nowrap="true" align="center"> <%= Resources.Approval.msg_112 %> <!-- 검색된 문서가 없습니다. --></td>
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
				        <xsl:attribute name="secdoc"><xsl:value-of select="cfxsl:getNodeValue(effectcmt,'secure_doc')"/></xsl:attribute>
			            <xsl:attribute name="edms_document"><xsl:value-of select="cfxsl:getNodeValue(effectcmt,'edms_document')"/></xsl:attribute>
			            
				        <td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-left:10px" onselect="false"><xsl:value-of select="serial"/></td>
				        <td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="rgdt"/></td>
				        <td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="senounm"/></td>
				        <td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="docno"/></td>
				        <td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><a href="#" class="text02_L"><xsl:value-of select="docsubject"/></a></td>
				        <td  class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="chargenm"/></td>
				        <!--<td  valign="top" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"></td>-->
			        </tr>
		        </xsl:for-each>
		    </xsl:otherwise>
		</xsl:choose>
		<!--<tr>
          <td height="1" colspan="6" class="BTable_bg03"></td>
        </tr>
        <tr>
          <td height="2" colspan="6" class="BTable_bg04"></td>
        </tr>-->
		</TBODY>   
		</table>
	</xsl:template>
</xsl:stylesheet>

