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
            <xsl:attribute name="id">
              menu_2_<xsl:value-of select="FOLDER_ID"/>
            </xsl:attribute>
            <a >
              <xsl:attribute name="class">
                <xsl:choose>
                  <xsl:when test="PARENTS_ID != '0'">
                    smenu2
                  </xsl:when>
                  <xsl:otherwise>
                    smenu
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:attribute>
              <xsl:attribute name="folderid">
                <xsl:value-of select="FOLDER_ID"/>
              </xsl:attribute>
              <xsl:attribute name="foldername">
                <xsl:value-of select="FOLDER_NAME"/>
              </xsl:attribute>
              <xsl:attribute name="ownerid">
                <xsl:value-of select="OWNER_ID"/>
              </xsl:attribute>
              <xsl:attribute name="foldermode">
                <xsl:value-of select="FOLDER_MODE"/>
              </xsl:attribute>
              <xsl:attribute name="href">#</xsl:attribute>
              <xsl:attribute name="onclick">
                gotoFolder4Folder(this);ChangType('menu_2_<xsl:value-of select="FOLDER_ID"/>');
              </xsl:attribute>
              <!--<xsl:if test="PARENTS_ID != '0'">
        &#160;&#160;
       </xsl:if>-->
              <xsl:value-of select="FOLDER_NAME"/>
            </a>
          </li>
        </xsl:for-each>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>

