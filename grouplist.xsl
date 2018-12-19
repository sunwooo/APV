<?xml version="1.0" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output media-type="text/html"/>
	<xsl:param name="sMessage">저장된 문서가 없습니다.</xsl:param>
	<xsl:template match="/">
		<table border="0" cellpadding="0" cellspacing="0" width="100%">
			<THEAD>
				<tr>
					<td height="2" class="BTable_bg01"></td>
				</tr>
				<tr>
					<td height="1" class="BTable_bg03"></td>
				</tr>				
			</THEAD>
			<TBODY>
				<xsl:choose>
					<xsl:when test="count(//NewDataSet/Table) = 0 ">
						<tr style="height:25px">
							<td nowrap="true" align="center">
								<xsl:value-of select="$sMessage"></xsl:value-of>
							</td>
						</tr>
					</xsl:when>
					<xsl:otherwise>
						<xsl:for-each select="//NewDataSet/Table">
							<tr style="height:25px">
								<xsl:choose>
									<xsl:when test="(position() mod 2) = 1 ">
									</xsl:when>
									<xsl:otherwise>
										<xsl:attribute name="class">BTable_bg04</xsl:attribute>
									</xsl:otherwise>
								</xsl:choose>								
								<td nowrap="true" onselect="false">
									<a>
										<xsl:attribute name="href">
											javascript:view_list(<xsl:value-of select="position()"/>,'<xsl:value-of select="normalize-space(kind)"/>','<xsl:value-of select="normalize-space(field)"/>',<xsl:value-of select="fieldcount"/>)
										</xsl:attribute>
										<div style="font-family:돋움;font-size:9pt;	color:#666666;	line-height:16px;	work-break:break-all;font-weight: bold;padding-top: 5px; padding-left: 6px; ">
											<xsl:attribute name="id">image_<xsl:value-of select="position()"/></xsl:attribute>
											<img  src="/GWImages/common/btn/btn_icon_down.gif" border="0" align="absmiddle" /> <!--<xsl:value-of select="normalize-space(kind)"/> :--> <xsl:value-of select="normalize-space(field)"/> (<xsl:value-of select="fieldcount"/>)
										</div>
									</a>
									<div>
										<xsl:attribute name="id">list_<xsl:value-of select="position()"/></xsl:attribute>
									</div>
								</td>
							</tr>
						</xsl:for-each>
					</xsl:otherwise>
				</xsl:choose>
			</TBODY>
    </table>
	</xsl:template>
</xsl:stylesheet>


