<?xml version="1.0" encoding="euc-kr" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt">
<xsl:output media-type="text/html"/>
 <xsl:template match="ROOT">
<html>
<head />
<body>
	<table width="100%" border="1" cellspacing="0" cellpadding="0">
		<thead>
			<tr>
				<td width="5%">UID</td>
				<td width="25%">메뉴명</td>
				<td width="35%">등록SQL</td>
				<td width="35%">조회SQL</td>
			</tr>
		</thead>
		<tbody>
			<xsl:for-each select="PT_SVC_GRP">
			    <tr >
				<td height="20"><xsl:value-of select="@UID"/></td>
				<td><xsl:value-of select="@MENU_NAME"/></td>
				<td><xsl:value-of select="@REGI_SQL" /></td>
				<td><xsl:value-of select="@READ_SQL" /></td>
			    </tr>
			</xsl:for-each>
		</tbody>
	</table>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
