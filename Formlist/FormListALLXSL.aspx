<%@ Page Language="C#" AutoEventWireup="true" CodeFile="FormListALLXSL.aspx.cs" Inherits="Approval_Formlist_FormListALLXSL" Title="个"%><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
	<xsl:output media-type="text/html"/>
	<xsl:param name="sortby">SORT_KEY</xsl:param>
	<xsl:param name="sortorder">ascending</xsl:param>
    <xsl:param name="iPage">1</xsl:param>
    <xsl:param name="iPageSize">15</xsl:param>	
	<msxsl:script language="JScript" implements-prefix="cfxsl">


		function getMod(idx){
		if( (idx % 5) == 0){
		return 0;
		}else{
		return 1;
		}
		}


	</msxsl:script>
	<xsl:template match="/">		
		<table width="100%"  border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td height="1" colspan="4" class="BTable_bg01"></td>
            </tr>
            <tr class="BTable_bg02">
		        <td width="45px" style=" padding-left:10px;cursor:hand" onclick="sortColumn('SORT_KEY');" class="BTable_bg07"><%= Resources.Approval.lbl_no %><span id="spanSORT_KEY"></span><!--순번--></td>
		        <td width="150px" onclick="javascript:sortColumn('CLASS_NAME');" style="cursor:hand;" class="BTable_bg07"><%= Resources.Approval.lbl_formcreate_LCODE05 %><span id="spanCLASS_NAME"></span><!--클래스--></td>
		        <td width="280px" onclick="javascript:sortColumn('FORM_NAME');" style="cursor:hand;" class="BTable_bg07"><%= Resources.Approval.lbl_formcreate_LCODE03 %><span id="spanFORM_NAME"></span><!--양식명(한글)--></td>
		        <td class="BTable_bg07"><%= Resources.Approval.lbl_formcreate_LCODE16%><!--설명--></td>
			</tr>
            <xsl:choose>
                <xsl:when test="$sortorder='ascending'">
                    <xsl:apply-templates select="//Table1">
                        <xsl:sort select="$sortby" data-type="text" order="ascending"/>
                    </xsl:apply-templates>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:apply-templates select="//Table1">
                    <xsl:sort select="$sortby"  data-type="text" order="descending"/>
                    </xsl:apply-templates>
                </xsl:otherwise>
            </xsl:choose>
		</table>
	</xsl:template>
    <xsl:template match="Table1">
        <tr>
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
            <xsl:variable name="indexB"><xsl:number value="position()"/></xsl:variable>
            <td style=" padding-left:10px" class="BTable_bg08"><xsl:value-of select="$indexB"/></td>
            <td class="BTable_bg08"><xsl:value-of select="CLASS_NAME"/></td>
            <td  onselect="false" class="BTable_bg08">
                <a class="text02_L">
					<xsl:attribute name="href">
					javascript:Open_Form('<xsl:value-of select="FORM_ID"/>', '<xsl:value-of select="FORM_NAME"/>', '<xsl:value-of select="FORM_PREFIX"/>', '<xsl:value-of select="SCHEMA_ID"/>', '<xsl:value-of select="REVISION"/>', '<xsl:value-of select="FILE_NAME"/>')
					</xsl:attribute>
	                <xsl:value-of select="FORM_NAME"/>
	            </a> 
            </td>
            <td  onselect="false" class="BTable_bg08">
                <!--
				<a class="text02_L" style="cursor:help;">
					<xsl:attribute name="fmpf"><xsl:value-of select="FORM_PREFIX"/></xsl:attribute>
					<xsl:attribute name="fmnm"><xsl:value-of select="FORM_NAME"/></xsl:attribute>
					<xsl:attribute name="fmrv"><xsl:value-of select="REVISION"/></xsl:attribute>
					<xsl:attribute name="fmdc"><xsl:value-of select="FORM_DESC"/></xsl:attribute>
					<xsl:attribute name="fmsdc"><xsl:value-of select="WORK_DESC"/></xsl:attribute>
					<xsl:attribute name="onclick">
						javascript:viewthumbnaildetail(this);
					</xsl:attribute>
					<xsl:choose>
					    <xsl:when test="FORM_DESC =''">&#160;
					    </xsl:when>
					    <xsl:otherwise>
					        <xsl:value-of select="FORM_DESC"/>
					    </xsl:otherwise>
					</xsl:choose>
				</a>
                -->
                <xsl:choose>
				    <xsl:when test="FORM_DESC =''">&#160;
				    </xsl:when>
				    <xsl:otherwise>
					    <xsl:value-of select="FORM_DESC"/>
				    </xsl:otherwise>
			    </xsl:choose>
            </td>
        </tr>
    </xsl:template>	
</xsl:stylesheet>