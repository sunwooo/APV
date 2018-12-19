<%@ Page Language="C#" AutoEventWireup="true" CodeFile="notedoclistXSL.aspx.cs" Inherits="Approval_Doclist_notedoclistXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"	
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">

<xsl:template match="response">
    <table border="0" id="tblGalInfo" cellpadding="0" cellspacing="0" style="width:100%;" >
        <THEAD>
            <tr>
                <td height="1" colspan="6" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02">
				<th valign="middle" id="thSN" noWrap="t" width="40" class="BTable_bg07" style="padding-left:10px;"><%= Resources.Approval.lbl_no%></th>
				<th valign="middle" id="thAD" noWrap="t" width="120" onClick="sortColumn('apvdt');" style="cursor:hand;" class="BTable_bg07"><%= Resources.Approval.lbl_createdate%><span id="spanapvdt"></span></th>
				<th valign="middle" id="thCN" noWrap="t" width="180" onClick="sortColumn('docno');" style="cursor:hand;" class="BTable_bg07"><%= Resources.Approval.lbl_DocNo%><span id="spandocno"></span></th>
				<th valign="middle" id="thDN" onClick="sortColumn('docsubject');" style="cursor:hand;" class="BTable_bg07"><%= Resources.Approval.lbl_subject%><span id="spandocsubject"></span></th>
				<th valign="middle" id="thNM" noWrap="t" width="80"  class="BTable_bg07"><%= Resources.Approval.lbl_initiator%></th>
				<th valign="middle" id="thRC" noWrap="t" width="80"  class="BTable_bg07"><%= Resources.Approval.lbl_finalpprover%></th>
			</tr>
		</THEAD>
		<TBODY>
		<xsl:choose>
			<xsl:when test="count(docitem) = 0 ">
				<tr>
			        <td  height="25" colspan="6" valign="middle" nowrap="true" align="center" class="BTable_bg08"> <%= Resources.Approval.msg_112 %> <!-- 검색된 문서가 없습니다. --></td>
		        </tr>
			</xsl:when>
			<xsl:otherwise>
		    <xsl:for-each select="docitem">
			    <tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart">
			        <xsl:choose>
							<xsl:when test="(position() mod 2) = 1 ">
							    <xsl:attribute name="onMouseover">this.style.background='#F8F4DE';</xsl:attribute><!--필요없으면 제거할것-->
				                <xsl:attribute name="onMouseout">this.style.background=''</xsl:attribute><!--필요없으면 제거할것-->						
						    </xsl:when>
						    <xsl:otherwise>
								<xsl:attribute name="onMouseover">this.style.background='#F8F4DE';</xsl:attribute><!--필요없으면 제거할것-->
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
			        <td valign="middle" nowrap="true" style="overflow:hidden; padding-Right:10px " align="center" onselect="false" class="BTable_bg08"><xsl:value-of select="serial"/></td>
			        <td valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px " onselect="false" class="BTable_bg08"><xsl:value-of select="apvdt"/></td>
			        <td valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px " onselect="false" class="BTable_bg08"><xsl:value-of select="docno"/></td>
			        <td name ="title" valign="middle" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false" class="BTable_bg08"><a href="#" class="text02_L"><xsl:value-of select="docsubject"/></a></td>
			        <td nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false" class="BTable_bg08">
			            <xsl:choose>
					        <xsl:when test="initnm =''">&#160;
					        </xsl:when>
					        <xsl:otherwise>
					            <xsl:value-of select="initnm"/>
					        </xsl:otherwise>
					    </xsl:choose>
			        </td>
			        <td align="center" nowrap="true" style="overflow:hidden; padding-Right:1px" onselect="false" class="BTable_bg08">
			            <xsl:choose>
					        <xsl:when test="cfxsl:getRgcmtNodeValue(rgcmt,'approval') =''">&#160;
					        </xsl:when>
					        <xsl:otherwise>
					            <xsl:value-of select="cfxsl:getRgcmtNodeValue(rgcmt,'approval')"/>
					        </xsl:otherwise>
					    </xsl:choose>
			        </td>
			        </tr>
		    </xsl:for-each>
		   </xsl:otherwise>
		  </xsl:choose>
		</TBODY>
    </table>
</xsl:template>
</xsl:stylesheet>