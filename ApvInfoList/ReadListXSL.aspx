<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ReadListXSL.aspx.cs" Inherits="Approval_ApvInfoList_ReadListXSL" %><?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:param name="UserLang"/>

	<xsl:template match="/">		
		<table border="0" cellpadding="0" cellspacing="0" class="BTable" style="TABLE-LAYOUT: fixed;" width="100%">
		    <tr>
              <td height="2" colspan="3" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02" style="height:25px">
				<th style=" padding-left:10px"><%= Resources.Approval.lbl_dept %></th>
				<th align="center"><%= Resources.Approval.lbl_name3 %></th>
				<th align="center"><%= Resources.Approval.lbl_ReadDate %></th>
			</tr>
			<tr>
                <td height="1" colspan="3" class="BTable_bg03"></td>
            </tr>
            <tr>
              <td height="5px"  colspan="3" align="center" > </td>
            </tr>  
			<xsl:choose>
				<xsl:when test="count(//Table) = 0 ">
				    <tr>
                      <td height="5px"  colspan="3" align="center" > </td>
                    </tr>  
					<tr class="td_list_a">
						<td  colspan="3" valign="middle" nowrap="true" class="AlignC"  align="center" >
							<%= Resources.Approval.msg_263 %>
						</td>
					</tr>
				</xsl:when>
				<xsl:otherwise>
					<xsl:for-each select="//Table">
						<tr style="background-Color:#FFFFFF;" onclick="switchSelectedRow(this);" class="td_list_a">
							<td style=" padding-left:10px" height="20" noWrap="true">
								<xsl:value-of select="DEPTNAME"/>
							</td>
							<td  noWrap="true">
								<xsl:value-of select="DISPLAY_NAME"/>
							</td>
							<td  noWrap="true">
								<xsl:value-of select="DATEREAD"/>
							</td>
						</tr>
					</xsl:for-each>
				</xsl:otherwise>
			</xsl:choose>
		</table>
	</xsl:template>
</xsl:stylesheet>