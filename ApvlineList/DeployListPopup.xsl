<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output media-type="text/html"/>
  <xsl:template match="/">
    <table width="100%"  border="0" cellspacing="0" cellpadding="0">
      <!--thead>
        <tr>
		  <td width="2%" height="25" class="table_mgraybg"></td>
          <td width="98%" height="25" align="center" valign="middle" class="table_mgraybg">부서명</td>
        </tr>
        <tr>
          <td colspan="2"  height="1" align="center"  class="table_line"></td>
        </tr>
      </thead-->
      <tbody>
        <xsl:for-each select="response/NewDataSet/Table">
          <tr>
			<td height="20" width="10"></td>
            <td nowrap="t" align="left">
              <xsl:value-of select="NAME"/>              
            </td>
          </tr>
          <tr>
            <td height="1" class="table_line"></td>
			<td height="1" class="table_line"></td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
</xsl:stylesheet>

