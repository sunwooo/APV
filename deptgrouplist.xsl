<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output media-type="text/html"/>
	<xsl:template match="NewDataSet">
		<xsl:choose>
			<xsl:when test="count(Table) = 0 ">
				<b>
          <xsl:for-each select="Table1">
            <xsl:value-of select="USER_LANGUAGE" />
          </xsl:for-each>
        </b>
			</xsl:when>
			<xsl:otherwise>
				<xsl:for-each select="Table">
					<li>
            <xsl:attribute name="id">menu_3_<xsl:value-of select="GROUP_CODE"/></xsl:attribute>
						<a  class="smenu">
						<xsl:attribute name="href">#</xsl:attribute>
						<xsl:attribute name="onclick">
              gotoFolder('listDocbox.aspx?barchived=true&amp;uid='+toUTF8('<xsl:value-of select="PERSON_CODE"/>')+'&amp;classid='+toUTF8('<xsl:value-of select="GROUP_CODE"/>')+'&amp;location=GROUP','<xsl:value-of select="NAME"/>');
						  ChangType('menu_3_<xsl:value-of select="GROUP_CODE"/>');
						</xsl:attribute>
						<xsl:value-of select="NAME"/>
						</a>
						</li>
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>