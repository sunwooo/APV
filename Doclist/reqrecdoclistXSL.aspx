<%@ Page Language="C#" AutoEventWireup="true" CodeFile="reqrecdoclistXSL.aspx.cs" Inherits="COVIFlowNet_Doclist_reqrecdoclistXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"	
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">

<xsl:template match="response">
		<table border="0" id="tblGalInfo" cellpadding="2" cellspacing="0" style="width;">
		<THEAD>
		    <tr>
                <td height="2" colspan="5" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02" style="height:30px">
				<TD height="30" align="center" valign="middle" class="table_green" id="thSN" noWrap="t" width="60" onClick="sortColumn('serial');" style="cursor:hand;"><%= Resources.Approval.lbl_SerialNo %></TD>
				<TD align="center" valign="middle" class="table_mgreenbg" id="thAD" noWrap="t" width="120" onClick="sortColumn('rgdt');" style="cursor:hand;"><%= Resources.Approval.lbl_ReceiptDate %></TD>
				<TD align="center" valign="middle" class="table_green" id="thSN" noWrap="t" width="100" onClick="sortColumn('senounm');" style="cursor:hand;"><%= Resources.Approval.lbl_send %></TD>
				<TD align="center" valign="middle" class="table_mgreenbg" id="thDN"  onClick="sortColumn('docsubject');" style="cursor:hand;"><%= Resources.Approval.lbl_subject %></TD>
				<TD align="center" valign="middle" class="table_green" id="thEF" noWrap="t" width="70"><%= Resources.Approval.lbl_ReceiverName %></TD>
				<!--<TD id="thET" width="70" >비고</TD>-->
			</tr>
			<tr>
                <td height="1" colspan="5" class="BTable_bg03"></td>
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
				<xsl:attribute name="secdoc"><xsl:value-of select="cfxsl:getNodeValue(effectcmt,'secure_doc')"/></xsl:attribute>
			    <xsl:attribute name="edms_document"><xsl:value-of select="cfxsl:getNodeValue(effectcmt,'edms_document')"/></xsl:attribute>
				<td  height="20" valign="middle" nowrap="true" style="overflow:hidden; padding-Right:10px;" align="right" onselect="false"><xsl:value-of select="serial"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="rgdt"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="senounm"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="docsubject"/></td>
				<td  valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="chargenm"/></td>
				<!--<td  valign="top" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"></td>-->
			</tr>
		</xsl:for-each>
		<tr>
          <td height="1" colspan="5" class="BTable_bg03"></td>
        </tr>
        <tr>
          <td height="2" colspan="5" class="BTable_bg04"></td>
        </tr>
		</TBODY>
		</table>
	</xsl:template>
</xsl:stylesheet>
