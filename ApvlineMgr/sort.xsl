<response><addresslist>
<xsl:for-each order-by="number(@so);@tl;@lv;DN" select="addresslist/item" xmlns:xsl="http://www.w3.org/TR/WD-xsl">
	<item>
		<xsl:attribute name="so"><xsl:value-of select="@so"/></xsl:attribute>
		<xsl:attribute name="tl"><xsl:value-of select="@tl"/></xsl:attribute>
		<xsl:attribute name="po"><xsl:value-of select="@po"/></xsl:attribute>
		<xsl:attribute name="lv"><xsl:value-of select="@lv"/></xsl:attribute>				
		<ROLE><xsl:value-of select="ROLE"/></ROLE>
		<DN><xsl:value-of select="DN"/></DN>
		<DO><xsl:value-of select="DO"/></DO>
    <FLDP><xsl:value-of select="FLDP" /></FLDP>
    <JD><xsl:value-of select="JD"/></JD>
		<LN><xsl:value-of select="LN"/></LN>
		<FN><xsl:value-of select="FN"/></FN>
		<TL><xsl:value-of select="TL"/></TL>
		<PO><xsl:value-of select="PO"/></PO>
		<LV><xsl:value-of select="LV"/></LV>
		<AN><xsl:value-of select="AN"/></AN>
		<PI><xsl:value-of select="PI"/></PI>
		<CP><xsl:value-of select="CP"/></CP>
		<DP><xsl:value-of select="DP"/></DP>
		<RGNM><xsl:value-of select="RGNM"/></RGNM>
		<OF><xsl:value-of select="OF"/></OF>
		<CY><xsl:value-of select="CY"/></CY>
		<EM><xsl:value-of select="EM"/></EM>
		<SO><xsl:value-of select="SO"/></SO>
		<SG><xsl:value-of select="SG"/></SG>
		<SGNM><xsl:value-of select="SGNM"/></SGNM>
		<UG><xsl:value-of select="UG"/></UG>
		<UGNM><xsl:value-of select="UGNM"/></UGNM>
		<RG><xsl:value-of select="RG"/></RG>
		<DEPUTY><xsl:value-of select="DEPUTY"/></DEPUTY>
		<RV1><xsl:value-of select="RV1"/></RV1>
		<RV2><xsl:value-of select="RV2"/></RV2>
		<RV3><xsl:value-of select="RV3"/></RV3>
		<ABS><xsl:value-of select="ABS"/></ABS>
		<ABS_RS><xsl:value-of select="ABS_RS"/></ABS_RS>
		<OT><xsl:value-of select="OT"/></OT>
		<MT><xsl:value-of select="MT"/></MT>
		<ETID>
			<xsl:value-of select="ETIC"/>
		</ETID>
		<ETNM>
			<xsl:value-of select="ETNM"/>
		</ETNM>
	</item>
</xsl:for-each>
</addresslist></response>
