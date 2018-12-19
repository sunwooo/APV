<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
	<xsl:output media-type="text/html"/>
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

		<table border="0" cellpadding="0" cellspacing="0" style="height:23px">
			<tr>
				<xsl:for-each select="//Table">
					<xsl:variable name="index">
						<xsl:number value="position()"/>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="$index=1">
							<td>
								<table border="0" cellspacing="0" cellpadding="0" id="1st">
									<tr>
										<td class="tab_on_left">
											<xsl:attribute name="name">
												<xsl:text>l_</xsl:text>
												<xsl:value-of select="$index"/>
											</xsl:attribute>
											<xsl:attribute name="id">
												<xsl:text>l_</xsl:text>
												<xsl:value-of select="$index"/>
											</xsl:attribute>
											<xsl:text></xsl:text>
										</td>
										<td class="tab_on_center">
											<xsl:attribute name="name">
												<xsl:text>tab_</xsl:text>
												<xsl:value-of select="$index"/>
											</xsl:attribute>
											<xsl:attribute name="id">
												<xsl:text>tab_</xsl:text>
												<xsl:value-of select="$index"/>
											</xsl:attribute>
											<xsl:attribute name="onclick">
												<xsl:text>changeBox(this,</xsl:text>
												<xsl:value-of select="$index"/>
												<xsl:text>)</xsl:text>
											</xsl:attribute>
											<xsl:value-of select="CLASS_NAME"/>
										</td>
										<td class="tab_on_right">
											<xsl:attribute name="name">
												<xsl:text>r_</xsl:text>
												<xsl:value-of select="$index"/>
											</xsl:attribute>
											<xsl:attribute name="id">
												<xsl:text>r_</xsl:text>
												<xsl:value-of select="$index"/>
											</xsl:attribute>
											<xsl:text></xsl:text>
										</td>
									</tr>
								</table>
							</td>
						</xsl:when>
						<xsl:otherwise>
							<td>
								<table border="0" cellspacing="0" cellpadding="0" id="2nd">
									<tr>
										<td class="tab_off_left">
											<xsl:attribute name="name">
												<xsl:text>l_</xsl:text>
												<xsl:value-of select="$index"/>
											</xsl:attribute>
											<xsl:attribute name="id">
												<xsl:text>l_</xsl:text>
												<xsl:value-of select="$index"/>
											</xsl:attribute>
											<xsl:text></xsl:text>
										</td>
										<td class="tab_off_center">
											<xsl:attribute name="name">
												<xsl:text>tab_</xsl:text>
												<xsl:value-of select="$index"/>
											</xsl:attribute>
											<xsl:attribute name="id">
												<xsl:text>tab_</xsl:text>
												<xsl:value-of select="$index"/>
											</xsl:attribute>
											<xsl:attribute name="onclick">
												<xsl:text>changeBox(this,</xsl:text>
												<xsl:value-of select="$index"/>
												<xsl:text>)</xsl:text>
											</xsl:attribute>
											<xsl:value-of select="CLASS_NAME"/>
										</td>
										<td class="tab_off_right">
											<xsl:attribute name="name">
												<xsl:text>r_</xsl:text>
												<xsl:value-of select="$index"/>
											</xsl:attribute>
											<xsl:attribute name="id">
												<xsl:text>r_</xsl:text>
												<xsl:value-of select="$index"/>
											</xsl:attribute>
											<xsl:text></xsl:text>
										</td>
									</tr>
								</table>
							</td>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
			</tr>
		</table>
		<table width="100%"  border="0" cellspacing="0" cellpadding="0">
			<tr >
				<td width="100%" height="3" align="center" valign="middle" class="tab_line"></td>
			</tr>
		</table>
		<xsl:for-each select="//Table">
			<xsl:variable name="indexA">
				<xsl:number value="position()"/>
			</xsl:variable>
			<xsl:variable name="CLASSID" select="CLASS_ID" />
			<table width="100%"  border="0" cellspacing="" cellpadding="0" style="display:">
				<xsl:choose>
					<xsl:when test="$indexA=1">
						<xsl:attribute name="style">
							<xsl:text>display:</xsl:text>
						</xsl:attribute>
					</xsl:when>
					<xsl:otherwise>
						<xsl:attribute name="style">
							<xsl:text>display:none</xsl:text>
						</xsl:attribute>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:attribute name="id">
					<xsl:text>tb_</xsl:text>
					<xsl:value-of select="$indexA"/>
				</xsl:attribute>

				<tr>
					<td height="20" valign="middle" >
						<table width="100%"  border="0" cellspacing="" cellpadding="10">
							<tr>
								<td style="height:1px; width:20%"></td>
								<td style="height:1px; width:20%"></td>
								<td style="height:1px; width:20%"></td>
								<td style="height:1px; width:20%"></td>
								<td style="height:1px; width:20%"></td>
							</tr>
							<tr>
								<td align="center">
									<xsl:for-each select="//Table1[CLASS_ID=$CLASSID]">
										<xsl:variable name="indexB">
											<xsl:number value="position()"/>
										</xsl:variable>
										<xsl:variable name="J">
											<xsl:number value="cfxsl:getMod(position())"/>
										</xsl:variable>

										<a>
											<xsl:attribute name="href">
												javascript:Open_Form('<xsl:value-of select="FORM_ID"/>', '<xsl:value-of select="FORM_NAME"/>', '<xsl:value-of select="FORM_PREFIX"/>', '<xsl:value-of select="SCHEMA_ID"/>', '<xsl:value-of select="REVISION"/>', '<xsl:value-of select="FILE_NAME"/>')
											</xsl:attribute>
											<img src="/COVINet/images/icon/icon_docment05.gif" border="0" width="60" height="46"/>
											<br/>
										</a>
										<a>
											<xsl:attribute name="href">
												javascript:Open_Form('<xsl:value-of select="FORM_ID"/>', '<xsl:value-of select="FORM_NAME"/>', '<xsl:value-of select="FORM_PREFIX"/>', '<xsl:value-of select="SCHEMA_ID"/>', '<xsl:value-of select="REVISION"/>', '<xsl:value-of select="FILE_NAME"/>')
											</xsl:attribute>
											<xsl:value-of select="FORM_NAME"/>
											<br/>
											<xsl:value-of select="FORM_DESC"/>
										</a>
										<xsl:choose>
											<xsl:when test="$J=1">
												<xsl:text disable-output-escaping="yes">&lt;/td&gt;&lt;td  align="center" &gt;</xsl:text>
											</xsl:when>
											<xsl:otherwise>
												<xsl:text disable-output-escaping="yes">&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td  align="center" &gt;</xsl:text>
											</xsl:otherwise>
										</xsl:choose>

									</xsl:for-each>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</xsl:for-each>
	</xsl:template>

</xsl:stylesheet>