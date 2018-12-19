<%@ Page Language="C#" AutoEventWireup="true" CodeFile="listitems_TempXSL.aspx.cs" Inherits="COVIFlowNet_TempSave_listitems_TempXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output media-type="text/html"/>
<xsl:template match="response">
      <!-- 리스트 테이블 시작 -->
      <table id="tblGalInfo" width="100%" border="0" cellspacing="0" cellpadding="0" onselectstart="return false">
		<THEAD>
        <tr>
          <td height="1" colspan="4" class="BTable_bg01"></td>
        </tr>
        <tr class="BTable_bg02">
				<th id="thAPV" noWrap="t"  width="60" style="padding-left:10px" class="BTable_bg07">
				    <input type="checkbox" id="chkAPVALL" name="chkAPVALL" onclick="javascript:chkAPVALL_onClick();"/>
				</th>
				<th id="thBR" noWrap="t" width="180" onClick="sortColumn('FORM_NAME');"  class="BTable_bg07"><%=Resources.Approval.lbl_formname %> <span id="spanFORM_NAME"></span></th>
				<th id="thDN"  onClick="sortColumn('SUBJECT');"  class="BTable_bg07"><%=Resources.Approval.lbl_subject %>  <span id="spanSUBJECT"></span></th>
				<th id="thAT"  width="110" onClick="sortColumn('CREATED');" class="BTable_bg07"><%=Resources.Approval.lbl_savedate%>  <span id="spanCREATED"></span></th>
        </tr>
        </THEAD>
        <TBODY>
		<xsl:choose>
			<xsl:when test="(count(forminstance)) = 0 ">
				<tr>
					<td  colspan="4" nowrap="true" align="center" class="BTable_bg08"><%=Resources.Approval.msg_101 %> </td>
					<td  nowrap="true" style="overflow:hidden; paddingRight:1px;display:none;" onselect="false" class="BTable_bg08">
					    <input type="checkbox" id="chkAPV" name="chkAPV"></input>
					</td>
				</tr>
			</xsl:when>
			<xsl:otherwise>
				<xsl:for-each select="forminstance">
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
											
						<xsl:attribute name="id"><xsl:value-of select="ftid"/></xsl:attribute>
						<xsl:attribute name="workitemid"><xsl:value-of select="ftid"/></xsl:attribute>
						<xsl:attribute name="mode"><xsl:value-of select="mode"/></xsl:attribute>
						<xsl:attribute name="fiid"><xsl:value-of select="fiid"/></xsl:attribute>
						<xsl:attribute name="fmid"><xsl:value-of select="fmid"/></xsl:attribute>
						<xsl:attribute name="scid"><xsl:value-of select="scid"/></xsl:attribute>
						<xsl:attribute name="fmpf"><xsl:value-of select="fmpf"/></xsl:attribute>
						<xsl:attribute name="fmnm"><xsl:value-of select="fmnm"/></xsl:attribute>
						<xsl:attribute name="fmrv"><xsl:value-of select="fmrv"/></xsl:attribute>
						<xsl:attribute name="ftid"><xsl:value-of select="ftid"/></xsl:attribute>
						<xsl:attribute name="fitn"><xsl:value-of select="fitn"/></xsl:attribute>
						<xsl:attribute name="fmfn"><xsl:value-of select="fmfn"/></xsl:attribute>
						<xsl:attribute name="picreatorid"><xsl:value-of select="picreatorid"/></xsl:attribute>
						<xsl:attribute name="createdate"><xsl:value-of select="createdate"/></xsl:attribute>
						<xsl:attribute name="title"><xsl:value-of select="title"/></xsl:attribute>
						<xsl:attribute name="subject"><xsl:value-of select="title"/></xsl:attribute>
						<xsl:attribute name="rowselected"></xsl:attribute>
						
						<td  nowrap="true" style="padding-left:10px;overflow:hidden; paddingRight:1px;;" onselect="false" onmousedown="noResponse();" class="BTable_bg08">
						    <input type="checkbox" id="chkAPV" name="chkAPV"></input>
						</td>
						<td  nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08"><xsl:value-of select="fmnm"/></td>
						<td  nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08">
						     <a href="#" class="text02_L" ><xsl:value-of select="title"/></a>&#160;
						</td>
						<td  nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08"><xsl:value-of select="createdate"/></td>
					</tr>
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
   		</TBODY>        
     </table>
</xsl:template>
</xsl:stylesheet>
