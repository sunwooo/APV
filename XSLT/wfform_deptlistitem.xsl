<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">  
    <xsl:template match="NewDataSet">
        <xsl:element name="response">
            <xsl:for-each select="Table">               
                <xsl:element name="docitem">
                    <xsl:element name="PF_SUB_KIND">
                        <xsl:value-of select="PF_SUB_KIND"/>
                    </xsl:element>
                    <xsl:element name="WI_STATE">
                        <xsl:value-of select="WI_STATE"/>
                    </xsl:element>
                    <xsl:element name="PI_SUBJECT">
                        <xsl:value-of select="PI_SUBJECT"/>
                    </xsl:element>
                    <xsl:element name="WI_CREATED">
                        <xsl:value-of select="WI_CREATED"/>
                    </xsl:element>
                    <xsl:element name="WI_FINISHED">
                        <xsl:value-of select="WI_FINISHED"/>
                    </xsl:element>
                    <xsl:element name="PI_FINISHED">
                        <xsl:value-of select="PI_FINISHED"/>
                    </xsl:element>
                    <xsl:element name="PI_INITIATOR_NAME">
                        <xsl:value-of select="PI_INITIATOR_NAME"/>
                    </xsl:element>
                    <xsl:element name="PI_INITIATOR_UNIT_NAME">
                        <xsl:value-of select="PI_INITIATOR_UNIT_NAME"  />
                    </xsl:element>
                    <xsl:element name="FORM_NAME">
                        <xsl:value-of select="FORM_NAME"/>
                    </xsl:element>
					        <xsl:element name="PI_BUSINESS_DATA1">
						        <xsl:value-of select="PI_BUSINESS_DATA1"/>
					        </xsl:element>
                  <xsl:element name="PI_BUSINESS_DATA2">
                    <xsl:value-of select="PI_BUSINESS_DATA2"/>
                  </xsl:element>
                </xsl:element>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
</xsl:stylesheet>
