<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    xmlns:cfxsl="urn:cfxsl"
    xmlns:cfutil="urn:cfxsl">
  <xsl:output method="html"/>
    <xsl:template match="NewDataSet">
        <center>
            <table>
                <tr>
                    <TD align="center">
                        <B>결재확인함</B>
                    </TD>
                </tr>
                <tr>
                    <td >
                        <table border="1" cellspacing="1" cellpadding="1">
                            <tr>
                                <td bgcolor="yellow" align="center">구분 </td>
                                <td bgcolor="yellow" align="center"  width="30">제목</td>
                                <td bgcolor="yellow" align="center"  width="30">기안일자</td>
                                <td bgcolor="yellow" align="center"  width="30">진행상태</td>
                                <td bgcolor="yellow" align="center"  width="30">기안부서</td>
                                <td bgcolor="yellow" align="center"  width="30">기안자</td>
                                <td bgcolor="yellow" align="center"  width="30">양식명</td>
                            </tr>
                            <xsl:for-each select="Table">
                                <tr>
                                    <td>
                                      <xsl:value-of select="cfxsl:getSubKind(string(PF_SUB_KIND))"/>
                                    </td>
                                    <td>
                                        <xsl:value-of select="PI_SUBJECT"/>
                                    </td>
                                    <td>
                                        <xsl:value-of select="WI_CREATED"/>
                                    </td>
                                    <td>
                                        <xsl:value-of select="PI_STATE"/>
                                    </td>
                                    <td>
                                        <xsl:value-of select="PI_INITIATOR_UNIT_NAME"/>
                                    </td>
                                    <td>
                                        <xsl:value-of select="PI_INITIATOR_NAME"/>
                                    </td>
                                    <td>
                                      <xsl:value-of select="cfxsl:getNodeValue(PI_DSCR,'name')"/>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </xsl:template>
</xsl:stylesheet>
