<response>
	<!--<xsl:for-each order-by=" - number(serial);apvdt;docno;docsubject;rgdt;senounm;recounm" select="docitem" xmlns:xsl="http://www.w3.org/TR/WD-xsl">-->
  <xsl:for-each select="docitem" xmlns:xsl="http://www.w3.org/TR/WD-xsl">
	    <docitem>
			<id><xsl:value-of select="id"/></id>
			<owouid><xsl:value-of select="owouid"/></owouid>
			<listtype><xsl:value-of select="listtype"/></listtype>
			<fiscal><xsl:value-of select="fiscal"/></fiscal>
			<serial><xsl:value-of select="serial" /></serial>
			<rgdt><xsl:value-of select="rgdt"/></rgdt>
			<rgcmt><xsl:value-of select="rgcmt"/></rgcmt>
			<rgnm><xsl:value-of select="rgnm"/></rgnm>
			<rgid><xsl:value-of select="rgid"/></rgid>
			<senounm><xsl:value-of select="senounm"/></senounm>
			<senouid><xsl:value-of select="senouid"/></senouid>
			<recounm><xsl:value-of select="recounm"/></recounm>
			<recouid><xsl:value-of select="recouid"/></recouid>
			<docno><xsl:value-of select="docno"/></docno>
			<docsubject><xsl:value-of select="docsubject"/></docsubject>
			<chargenm><xsl:value-of select="chargenm"/></chargenm>
			<chargeid><xsl:value-of select="chargeid"/></chargeid>
			<apvdt><xsl:value-of select="apvdt"/></apvdt>
			<initnm><xsl:value-of select="initnm"/></initnm>
			<initid><xsl:value-of select="initid"/></initid>
			<effectdt><xsl:value-of select="effectdt"/></effectdt>
			<effectmethod><xsl:value-of select="effectmethod"/></effectmethod>
			<effectcmt><xsl:value-of select="effectcmt"/></effectcmt>
	    </docitem>
	</xsl:for-each>
</response>
