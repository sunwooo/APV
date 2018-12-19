<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DeploylineXSL.aspx.cs" Inherits="COVIFlowNet_DeployList_DeploylineXSL" %><?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output media-type="text/html"/>
	<xsl:template match="/">
	<div class="BTable">
		<table  width="100%" border="0" cellspacing="0" cellpadding="0">
			<thead>
			    <tr>
                    <td height="1" colspan="3" class="BTable_bg01"></td>
                </tr> 
				<tr class="BTable_bg02">	
				  <th style="display:;padding-left:10px" class="BTable_bg07" valign="middle" width="30px" >&#160;</th>
				  <th style="padding-left:10px;" class="BTable_bg07" valign="middle" width="*" ><%=Resources.Approval.lbl_Dployline_name%></th>
				  <th class="BTable_bg07" valign="middle" width="500px"><%=Resources.Approval.lbl_desc%></th>
				</tr>
			</thead>
			<tbody>
		        <xsl:choose>
			        <xsl:when test="count(response/item) = 0 ">
				        <tr>
					        <td class="BTable_bg09" colspan="3" valign="middle" nowrap="true" align="center" height="25px"><%=Resources.Approval.msg_169%></td>
				        </tr>
			        </xsl:when>
			        <xsl:otherwise>
			            <xsl:for-each select="response/item">
				            <!--<tr style="cursor:hand;background-Color:#FFFFFF;" onMouseOver = "this.style.backgroundColor = '#EEF7F9'" onMouseOut = "this.style.backgroundColor = '#FFFFFF'" onClick="changerChk()">-->
				            <tr onkeydown="event_row_onkeydown" onclick="onSelectRow(this);" ondblclick="parent.changeSignLine()" class="rowunselected">
					            <xsl:attribute name="id"><xsl:value-of select="id"/></xsl:attribute>
					            <xsl:choose>
									<xsl:when test="(position() mod 2) = 1 ">
										<xsl:attribute name="onMouseover">this.style.background='#F8F4DE';</xsl:attribute><!--필요없으면 제거할것-->
										<xsl:attribute name="onMouseout">this.style.background=''</xsl:attribute><!--필요없으면 제거할것-->						
									</xsl:when>
									<xsl:otherwise>
										<xsl:attribute name="onMouseover">this.style.background='#F8F4DE';</xsl:attribute><!--필요없으면 제거할것-->
										<xsl:attribute name="onMouseout">this.style.background='';</xsl:attribute><!--필요없으면 제거할것-->
									</xsl:otherwise>
								</xsl:choose>
					            <td class="BTable_bg08" nowrap="t" style="display:;">
					                <input type="radio" name="rChk" onclick="changerChk()">
					                    <xsl:attribute name="id"><xsl:value-of select="id"/></xsl:attribute>
					                    <xsl:attribute name="title"><xsl:value-of select="signlistname"/></xsl:attribute>
					                    <xsl:attribute name="dscr"><xsl:value-of select="dscr"/></xsl:attribute>
					                </input>
  				                </td>
					            <td class="BTable_bg08" style="padding-left:10px;" nowrap="t" ><xsl:value-of select="signlistname"/></td>
					            <td class="BTable_bg08" nowrap="t" ><xsl:value-of select="dscr"/>&#160;</td>
				            </tr>  
			            </xsl:for-each>
			        </xsl:otherwise>
		        </xsl:choose>
			</tbody>
		</table>
	</div>
	</xsl:template>
</xsl:stylesheet>