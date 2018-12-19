<%@ Page Language="C#" AutoEventWireup="true" CodeFile="listitemsXSLUFolders.aspx.cs" Inherits="Approval_listitemsXSLUFolders" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">

<xsl:param name="sTitle">받은시간</xsl:param>
<xsl:param name="sType"></xsl:param>

<xsl:template match="response">
      <!-- 리스트 테이블 시작 -->
      <table id="tblGalInfo" width="100%" border="0" cellspacing="0" cellpadding="0" onselectstart="return false">
        <THEAD>
        <tr>
          <td height="1" colspan="3" class="BTable_bg01"></td>
        </tr>
        <tr class="BTable_bg02">
			<th id="thAPV" noWrap="t" style="padding-left:10px;display:none;" width="60" class="BTable_bg07">
			    <input type="checkbox" id="chkAPVALL" name="chkAPVALL" onclick="javascript:chkAPVALL_onClick();"/><!--전체-->
			</th>
			<th id="thDN"  style="cursor:hand;" class="BTable_bg07"><a href="#"><%=Resources.Approval.lbl_Name %>  <span id="spanFOLDER_NAME"></span></a></th><!--제목-->
			<th id="thAT" width="120"   class="BTable_bg07"><a href="#"><xsl:value-of select="$sTitle"/><span id="spanREGISTERED"></span></a></th>
        </tr>
        </THEAD>
        <TBODY>
		<xsl:choose>
			<xsl:when test="count(workitem) = 0 ">
				<tr>
					<td  colspan="3" nowrap="true" align="center" class="BTable_bg08"><%=Resources.Approval.msg_101 %> </td>
					<td  nowrap="true" style="overflow:hidden; paddingRight:1px;display:none;" onselect="false" class="BTable_bg08">
					    <input type="checkbox" id="chkAPV" name="chkAPV"></input>
					</td>
				</tr>
			</xsl:when>
			<xsl:otherwise>
				<xsl:for-each select="workitem">
						<tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" >
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
						<xsl:attribute name="mode"><xsl:value-of select="mode"/></xsl:attribute>
						<xsl:attribute name="folderid"><xsl:value-of select="folderid"/></xsl:attribute>
		                <xsl:attribute name="foldernm"><xsl:value-of select="foldernm"/></xsl:attribute>
						<td  nowrap="true" style="padding-left:10px;overflow:hidden; paddingRight:1px;display:;" onselect="false" onmousedown="noResponse();" class="BTable_bg08">
						    <input type="checkbox" id="chkAPV" name="chkAPV"></input>
						    <xsl:value-of select="substring(wfmode,1,1)"/>
						</td>
						<td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08">
						    <a href="#" class="text02_L"><xsl:value-of select="title"/></a>
						</td>
						<td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08"><xsl:value-of disable-output-escaping="yes" select="completedate"/></td>
						</tr>
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
   		</TBODY>        
     </table>
</xsl:template>
</xsl:stylesheet>