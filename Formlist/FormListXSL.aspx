<%@ Page Language="C#" AutoEventWireup="true" CodeFile="FormListXSL.aspx.cs" Inherits="Approval_Formlist_FormListXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
	<xsl:output media-type="text/html"/>
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
	<div>
		<div class="tab01 small">
			<ul>
				<xsl:for-each select="//Table">
					<xsl:variable name="index">
						<xsl:number value="position()"/>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="$index=1">
							<li style="display:;">
							    <xsl:attribute name="id">
								    <xsl:text>divtab</xsl:text>
								    <xsl:value-of select="$index"/>
							    </xsl:attribute>
							    <xsl:attribute name="class">
								    <xsl:text>current</xsl:text>
							    </xsl:attribute>																	   
							        <a href="#" class="s1">										        
							        <xsl:attribute name="id">
								        <xsl:text>tab_</xsl:text>
								        <xsl:value-of select="$index"/>
							        </xsl:attribute>
							        <xsl:attribute name="name">
								        <xsl:text>tab_</xsl:text>
								        <xsl:value-of select="$index"/>
							        </xsl:attribute>
							        <xsl:attribute name="onclick">
									<xsl:text>javascript:changeBox(this,</xsl:text><xsl:value-of select="$index"/><xsl:text>)</xsl:text>
								    </xsl:attribute>
								<span>
							        <xsl:value-of select="CLASS_NAME"/>										            										        
							    </span>
							    </a>
							</li>																		
						</xsl:when>
						<xsl:otherwise>
							<li style="display:;">
							<xsl:attribute name="id">
								<xsl:text>divtab</xsl:text>
								<xsl:value-of select="$index"/>
							</xsl:attribute>										    
							        <a href="#" class="s1">										        
							        <xsl:attribute name="id">
								        <xsl:text>tab_</xsl:text>
								        <xsl:value-of select="$index"/>
							        </xsl:attribute>
							        <xsl:attribute name="name">
								        <xsl:text>tab_</xsl:text>
								        <xsl:value-of select="$index"/>
							        </xsl:attribute>
							        <xsl:attribute name="onclick">
									<xsl:text>javascript:changeBox(this,</xsl:text><xsl:value-of select="$index"/><xsl:text>)</xsl:text>
								    </xsl:attribute>
								<span>    
							        <xsl:value-of select="CLASS_NAME"/>										            										       
							    </span>
							    </a>
							</li>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
			</ul>
		</div>
	    <div class="BTable">
		<xsl:for-each select="//Table">
			<xsl:variable name="indexA">
				<xsl:number value="position()"/>
			</xsl:variable>
			<xsl:variable name="CLASSID" select="CLASS_ID" />
			<table width="100%"  border="0" cellspacing="0" cellpadding="0" style="display:;">
				<xsl:choose>
					<xsl:when test="$indexA=1">
						<xsl:attribute name="style"><xsl:text>display:</xsl:text></xsl:attribute>
					</xsl:when>
					<xsl:otherwise>
						<xsl:attribute name="style"><xsl:text>display:none</xsl:text></xsl:attribute>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:attribute name="id"><xsl:text>tb_</xsl:text><xsl:value-of select="$indexA"/></xsl:attribute>
				<tr>
					<td valign="middle"  width="100%">
						<table width="100%"  border="0" cellspacing="0" cellpadding="0">
							<tr>
                                <td height="1" colspan="3" class="BTable_bg01"></td>
                            </tr>
                            <tr class="BTable_bg02">
                                <td width="45px" class="BTable_bg07"><%= Resources.Approval.lbl_no %><!--순번--></td>		                        
		                        <td width="280px" class="BTable_bg07"><%= Resources.Approval.lbl_formcreate_LCODE03 %><!--양식명(한글)--></td>
		                        <td class="BTable_bg07"><%= Resources.Approval.lbl_formcreate_LCODE16%><!--설명--></td>
			                </tr>
			                <xsl:choose>
				                <xsl:when test="count(//Table1[CLASS_ID=$CLASSID]) = 0 ">
				                <tr  class="listbg2" >
					                <td colspan="3" valign="top" nowrap="true" align="center" class="BTable_bg08"><%= Resources.Approval.msg_108 %><!--양식이 없습니다.--></td>
				                </tr>
				                </xsl:when>
				                <xsl:otherwise>
					                <xsl:for-each select="//Table1[CLASS_ID=$CLASSID]">
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
							                <td style="padding-left:10px" class="BTable_bg08"><xsl:value-of select="$indexB"/></td>	                                     
	                                        <td class="BTable_bg08">
				                                <xsl:attribute name="onclick">
	                                            javascript:Open_Form('<xsl:value-of select="FORM_ID"/>', '<xsl:value-of select="FORM_NAME"/>', '<xsl:value-of select="FORM_PREFIX"/>', '<xsl:value-of select="SCHEMA_ID"/>', '<xsl:value-of select="REVISION"/>', '<xsl:value-of select="FILE_NAME"/>')
	                                            </xsl:attribute>	                                        
	                                            <a href="#" class="text02_L" >
					                                <xsl:value-of select="FORM_NAME"/>
					                            </a> 
	                                        </td>
	                                        <td class="BTable_bg08">
                                                <!--
	                                            <a class="text02_L" style="cursor:help;">
	                                                <xsl:attribute name="fmpf"><xsl:value-of select="FORM_PREFIX"/></xsl:attribute>
	                                                <xsl:attribute name="fmnm"><xsl:value-of select="FORM_NAME"/></xsl:attribute>
	                                                <xsl:attribute name="fmrv"><xsl:value-of select="REVISION"/></xsl:attribute>
	                                                <xsl:attribute name="fmdc"><xsl:value-of select="FORM_DESC"/></xsl:attribute>
	                                                <xsl:attribute name="fmsdc"><xsl:value-of select="WORK_DESC"/></xsl:attribute>
	                                                <xsl:attribute name="onclick">javascript:viewthumbnaildetail(this)</xsl:attribute>
	                                                <xsl:choose>
					                                    <xsl:when test="FORM_DESC =''">&#160;</xsl:when>
					                                    <xsl:otherwise>
					                                        <xsl:value-of select="FORM_DESC"/>
					                                    </xsl:otherwise>
					                            </xsl:choose>
	                                            </a>
                                                -->
                                                <xsl:choose>
					                                    <xsl:when test="FORM_DESC =''">&#160;</xsl:when>
					                                    <xsl:otherwise>
					                                        <xsl:value-of select="FORM_DESC"/>
					                                    </xsl:otherwise>
					                            </xsl:choose>
                                            </td>
						                </tr>						               
					                </xsl:for-each>
				                </xsl:otherwise>
			                </xsl:choose>					               
						</table>
					</td>
				</tr>
			</table>
		</xsl:for-each>
		</div>
	</div>
	</xsl:template>
</xsl:stylesheet>