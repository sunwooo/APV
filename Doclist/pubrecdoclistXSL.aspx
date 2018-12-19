<%@ Page Language="C#" AutoEventWireup="true" CodeFile="pubrecdoclistXSL.aspx.cs" Inherits="COVIFlowNet_Doclist_pubrecdoclistXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="response">
		<table border="0" id="tblGalInfo" cellpadding="2" cellspacing="0" style="width:100%;">
		<THEAD>
		<tr>
            <td height="1" colspan="8" class="BTable_bg01"></td>
        </tr>
			<tr class="BTable_bg02">
				<Th class="BTable_bg07" id="thSN" noWrap="t" width="70" onClick="sortColumn('serial');" style="padding-left:10px;cursor:hand;"><%= Resources.Approval.lbl_SerialNo %></Th>
				<Th class="BTable_bg07" id="thAD" noWrap="t" width="100" onClick="sortColumn('rgdt');" style="cursor:hand;"><%= Resources.Approval.lbl_receivedate %></Th>
				<Th class="BTable_bg07" id="thSON" noWrap="t" width="100" onClick="sortColumn('senounm');" style="cursor:hand;"><%= Resources.Approval.lbl_SenderName %></Th>
				<Th class="BTable_bg07" id="thCN" noWrap="t" width="120" onClick="sortColumn('docno');" style="cursor:hand;"><%= Resources.Approval.lbl_DocNo %></Th>
				<Th class="BTable_bg07" id="thDN"  width="100" ><%= Resources.Approval.lbl_ManageDept %></Th>
				<Th class="BTable_bg07" id="thEF" noWrap="t" width="70" ><%= Resources.Approval.lbl_ReceiverName %></Th>
				<Th class="BTable_bg07" id="thET" ><%= Resources.Approval.lbl_Remark %></Th>
				<Th class="BTable_bg07" id="thPR"  width="100" ><%= Resources.Approval.lbl_ManageState %></Th>
			</tr>
		</THEAD>
		<TBODY>
		<xsl:choose>
	    <xsl:when test="count(docitem) = 0 ">
	    <tr>
		    <td  class="BTable_bg08"  colspan="8" valign="middle" nowrap="true" align="center"> <%= Resources.Approval.msg_112 %> <!-- 검색된 문서가 없습니다. --></td>
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
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-left:10px" onselect="false"><xsl:value-of select="serial"/></td>
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="rgdt"/></td>
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="senounm"/></td>
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="docno"/></td>
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="recounm"/></td>
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="chargenm"/></td>
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="rgcmt"/></td>
				<td class="BTable_bg08" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false"><xsl:value-of select="effectcmt"/></td>
			</tr>
		</xsl:for-each>
		<!--<tr>
          <td height="1" colspan="8" class="BTable_bg03"></td>
        </tr>
        <tr>
          <td height="2" colspan="8" class="BTable_bg04"></td>
        </tr>-->
        </xsl:otherwise>		
        </xsl:choose>
		</TBODY>
		</table>
	</xsl:template>
</xsl:stylesheet>

