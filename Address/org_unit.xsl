<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="ROOT">
		<xsl:element name="response">
			<xsl:if test="count(//ORG_UNIT) = 0 ">
				<xsl:element name="error">none</xsl:element>
			</xsl:if>
			<xsl:if test="count(//ORG_UNIT) > 0 ">
				<xsl:element name="addresslist">
					<xsl:for-each select="ORG_UNIT">
						<xsl:sort data-type="number" select="SORT_KEY" />
						<xsl:element name="item" use-attribute-sets="itemSet">
							<xsl:element name="AN">
								<xsl:value-of select="UNIT_CODE" />
							</xsl:element>
							<xsl:element name="DN">
								<xsl:value-of select="NAME" />
							</xsl:element>
							<xsl:element name="EM">
								<xsl:value-of select="EMAIL" />
							</xsl:element>
							<xsl:element name="JD">
								<xsl:value-of select="DSCR" />
							</xsl:element>
							<xsl:element name="RN">
								<xsl:value-of select="RESERVED2" />
							</xsl:element>
							<xsl:element name="PI">
								<xsl:value-of select="UNIT_ID" />
							</xsl:element>
							<xsl:element name="CN">
								<xsl:value-of select="CHILD_CNT" />
							</xsl:element>
							<xsl:element name="ETNM">
								<xsl:value-of select="ENT_NAME" />
							</xsl:element>
							<xsl:element name="ETCD">
								<xsl:value-of select="ENT_CODE" />
							</xsl:element>
						</xsl:element>
					</xsl:for-each>
				</xsl:element>
			</xsl:if>
		</xsl:element>
	</xsl:template>
	<xsl:attribute-set name="itemSet" >
		<xsl:attribute name="jtr">f</xsl:attribute>
		<xsl:attribute name="order">
			<xsl:value-of select="SORT_KEY" />
		</xsl:attribute>
		<xsl:attribute name="rcv">
			<xsl:value-of select="translate(translate(RECEIVABLE, '1','t'),'0','f') " />
		</xsl:attribute>
	</xsl:attribute-set>
</xsl:stylesheet>
