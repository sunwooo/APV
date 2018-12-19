<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApvLineMgrApvline_xsl.aspx.cs" Inherits="COVIFlowNet_ApvlineList_ApvLineMgrApvline_xsl" %><?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output media-type="text/html"/>
	<xsl:template match="/">
		<table width="100%"  border="0" cellspacing="0" cellpadding="0" class="BTable">
			<thead>
				<tr class="BTable_bg02" style="height:25px">
					  <th width="7%" style="display:none;"></th>
					  <th width="26%" ><%= Resources.Approval.lbl_apvline_name%></th>
					  <th width="67%"><%= Resources.Approval.lbl_apvline_summary%></th>
				</tr>
				<tr>
                        <td height="1" colspan="3" class="BTable_bg03"></td>
				</tr>				
			</thead>
			<tbody>
			 <xsl:choose>
			        <xsl:when test="count(response/item) = 0 ">
				        <tr>
					        <td  height="25" colspan="3" valign="top" nowrap="true" align="center"><%=Resources.Approval.msg_167%></td>
				        </tr>
				        <tr>
					        <td  height="25" colspan="3" valign="top" nowrap="true" align="left" style="padding-left:5px; color:Red"><%=Resources.Approval.msg_213%></td>
				        </tr>
			        </xsl:when>
			        <xsl:otherwise>
			            <xsl:for-each select="response/item">
				            <tr  height="25" onkeydown="event_row_onkeydown"  onClick="changerChk(this, event)" class="rowunselected">
				                <xsl:attribute name="id"><xsl:value-of select="id"/></xsl:attribute>
					            <td nowrap="t" valign="middle" align="center"   style="display:none;">
					                <input type="radio" name="rChk" onclick="changerChk(event)"><xsl:attribute name="id"><xsl:value-of select="id"/></xsl:attribute><xsl:attribute name="title"><xsl:value-of select="signlistname"/></xsl:attribute><xsl:attribute name="dscr"><xsl:value-of select="dscr"/></xsl:attribute></input>
					            </td>
					            <td nowrap="t" valign="middle" align="left" style="padding-left:5px"><xsl:value-of select="signlistname"/></td>
					            <td nowrap="t" align="left" style="padding-left:5px"><xsl:value-of select="dscr"/></td>
				            </tr>
			            </xsl:for-each>
		             </xsl:otherwise>
	        </xsl:choose>
			</tbody>
		</table>
	</xsl:template>
</xsl:stylesheet>
