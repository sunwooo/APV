<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:param name="type">fix</xsl:param>
	<xsl:template match="signinform">
		<xsl:element name="response">
			<xsl:choose>
				<xsl:when test="$type='controller'">
					<xsl:if test="(count(//Table1)) = 0 ">
						<xsl:element name="error">none</xsl:element>
					</xsl:if>
					<xsl:if test="(count(//Table1)) > 0 ">
						<xsl:element name="addresslist">
							<xsl:for-each select="//Table1">
								<!--<xsl:element name="item" use-attribute-sets="itemSet">-->
								<xsl:element name="item">
									<xsl:attribute name="so">
										<xsl:value-of select="@SORT_KEY" />
									</xsl:attribute>
									<xsl:if test="contains(substring-after(JOBTITLE_Z,'&amp;'),'&amp;')">
										<xsl:attribute name="tl">
											<xsl:value-of select="concat(concat(substring-after(substring-after(JOBTITLE_Z,'&amp;'),'&amp;'),';'),concat(concat(substring-before(JOBTITLE_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBTITLE_Z,'&amp;'),'&amp;')))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBTITLE_Z,'&amp;'),'&amp;'))">
										<xsl:attribute name="tl">
											<xsl:value-of select="concat(concat(substring-after(JOBTITLE_Z,'&amp;'),';'),substring-before(JOBTITLE_Z,'&amp;'))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="contains(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;')">
										<xsl:attribute name="po">
											<xsl:value-of select="concat(concat(substring-after(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;'),';'),concat(concat(substring-before(JOBPOSITION_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;')))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;'))">
										<xsl:attribute name="po">
											<xsl:value-of select="concat(concat(substring-after(JOBPOSITION_Z,'&amp;'),';'),substring-before(JOBPOSITION_Z,'&amp;'))" />
										</xsl:attribute>
									</xsl:if>

									<xsl:if test="contains(substring-after(JOBLEVEL_Z,'&amp;'),'&amp;')">
										<xsl:attribute name="lv">
											<xsl:value-of select="concat(concat(substring-after(substring-after(JOBLEVEL_Z,'&amp;'),'&amp;'),';'),concat(concat(substring-before(JOBLEVEL_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBLEVEL_Z,'&amp;'),'&amp;')))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBLEVEL_Z,'&amp;'),'&amp;'))">
										<xsl:attribute name="lv">
											<xsl:value-of select="concat(concat(substring-after(JOBLEVEL_Z,'&amp;'),';'),substring-before(JOBLEVEL_Z,'&amp;'))" />
										</xsl:attribute>
									</xsl:if>


									<xsl:element name="DN">
										<xsl:value-of select="DISPLAY_NAME" />
									</xsl:element>
									<xsl:element name="DO">
										<xsl:value-of select="DISPLAY_NAME" />
									</xsl:element>
									<xsl:element name="JD">
										<xsl:value-of select="UNIT_CODE" />
									</xsl:element>
									<xsl:element name="LN"></xsl:element>
									<xsl:element name="FN">
										<xsl:value-of select="DISPLAY_NAME" />
									</xsl:element>
									<!--<xsl:element name="TL">
                  <xsl:value-of select="substring-before(JOBTITLE_Z,'&amp;')" />
                </xsl:element>
                <xsl:element name="PO">
                  <xsl:value-of select="substring-before(JOBPOSITION_Z,'&amp;')" />
                </xsl:element>-->
									<xsl:if test="contains(substring-after(JOBTITLE_Z,'&amp;'),'&amp;')">
										<xsl:element name="TL">
											<xsl:value-of select="concat(concat(substring-before(JOBTITLE_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBTITLE_Z,'&amp;'),'&amp;'))" />
										</xsl:element>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBTITLE_Z,'&amp;'),'&amp;'))">
										<xsl:element name="TL">
											<xsl:value-of select="substring-before(JOBTITLE_Z,'&amp;')" />
										</xsl:element>
									</xsl:if>
									<xsl:if test="contains(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;')">
										<xsl:element name="PO">
											<xsl:value-of select="concat(concat(substring-before(JOBPOSITION_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;'))" />
										</xsl:element>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;'))">
										<xsl:element name="PO">
											<xsl:value-of select="substring-before(JOBPOSITION_Z,'&amp;')" />
										</xsl:element>
									</xsl:if>
									<xsl:element name="LV">
										<xsl:value-of select="substring-before(JOBLEVEL_Z,'&amp;')" />
									</xsl:element>
									<xsl:element name="AN">
										<xsl:value-of select="PERSON_CODE" />
									</xsl:element>
									<xsl:element name="PI">
										<xsl:value-of select="PERSON_ID" />
									</xsl:element>
									<xsl:element name="CP"></xsl:element>
									<xsl:element name="DP">
										<xsl:value-of select="UNIT_NAME" />
									</xsl:element>
									<xsl:element name="DPSH">
										<xsl:value-of select="SHORT_NAME" />
									</xsl:element>
									<xsl:element name="OF"></xsl:element>
									<xsl:element name="CY">
										<xsl:value-of select="ENT_CODE" />
									</xsl:element>
									<xsl:element name="EM">
										<xsl:value-of select="EMAIL" />
									</xsl:element>
									<xsl:element name="SO">
										<xsl:value-of select="SORT_KEY" />
									</xsl:element>
									<xsl:element name="RG">
										<xsl:value-of select="UNIT_CODE" />
									</xsl:element>
									<xsl:element name="RGNM">
										<xsl:value-of select="UNIT_NAME" />
									</xsl:element>
									<xsl:element name="SG">
										<xsl:value-of select="UNIT_CODE" />
									</xsl:element>
									<xsl:element name="SGNM">
										<xsl:value-of select="UNIT_NAME" />
									</xsl:element>
									<xsl:element name="UG">
										<xsl:value-of select="PARENT_UNIT_CODE" />
									</xsl:element>
									<xsl:element name="UGNM">
										<xsl:value-of select="NAME" />
									</xsl:element>
									<xsl:element name="DEPUTY">
										<xsl:value-of select="DEPUTY" />
									</xsl:element>
									<xsl:element name="RV1">
										<xsl:value-of select="RESERVED1" />
									</xsl:element>
									<xsl:element name="RV2">
										<xsl:value-of select="RESERVED2" />
									</xsl:element>
									<xsl:element name="OT">
										<xsl:value-of select="OFFICE_TEL" />
									</xsl:element>
									<xsl:element name="MT">
										<xsl:value-of select="MOBILE_TEL" />
									</xsl:element>
									<xsl:element name="ABS">
										<xsl:value-of select="ABSENT" />
									</xsl:element>
									<xsl:element name="ABS_RS">
										<xsl:value-of select="ABSENT_REASON" />
									</xsl:element>
									<xsl:element name="UID">
										<xsl:value-of select="UID" />
									</xsl:element>
									<xsl:element name="ETID">
										<xsl:value-of select="ENT_CODE" />
									</xsl:element>
									<xsl:element name="ETNM">
										<xsl:value-of select="ENT_NAME" />
									</xsl:element>
									<xsl:element name="USRC">
										<xsl:value-of select="REGION_CODE" />
									</xsl:element>
									<xsl:element name="USEC">
										<xsl:value-of select="SABUN" />
									</xsl:element>
									<xsl:element name="USCC">
										<xsl:value-of select="COST_CENTER_CODE" />
									</xsl:element>
									<xsl:element name="USCN">
										<xsl:value-of select="COST_CENTER_NAME" />
									</xsl:element>
									<xsl:element name="USDNEN">
										<xsl:value-of select="DISPLAY_NAME_EN" />
									</xsl:element>
									<xsl:element name="JDT">
										<xsl:value-of select="substring-before(JOIN_DATE,'T')" />
									</xsl:element>
								</xsl:element>
							</xsl:for-each>
						</xsl:element>
					</xsl:if>
				</xsl:when>
				<xsl:when test="$type='etc'">
					<xsl:if test="(count(//Table2)+count(//Table3)) = 0 ">
						<xsl:element name="error">none</xsl:element>
					</xsl:if>
					<xsl:if test="(count(//Table2)+count(//Table3)) > 0 ">
						<xsl:element name="addresslist">
							<xsl:for-each select="//Table2">
								<xsl:element name="item">
									<xsl:attribute name="so">
										<xsl:value-of select="@SORT_KEY" />
									</xsl:attribute>
									<xsl:if test="contains(substring-after(JOBTITLE_Z,'&amp;'),'&amp;')">
										<xsl:attribute name="tl">
											<xsl:value-of select="concat(concat(substring-after(substring-after(JOBTITLE_Z,'&amp;'),'&amp;'),';'),concat(concat(substring-before(JOBTITLE_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBTITLE_Z,'&amp;'),'&amp;')))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBTITLE_Z,'&amp;'),'&amp;'))">
										<xsl:attribute name="tl">
											<xsl:value-of select="concat(concat(substring-after(JOBTITLE_Z,'&amp;'),';'),substring-before(JOBTITLE_Z,'&amp;'))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="contains(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;')">
										<xsl:attribute name="po">
											<xsl:value-of select="concat(concat(substring-after(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;'),';'),concat(concat(substring-before(JOBPOSITION_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;')))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;'))">
										<xsl:attribute name="po">
											<xsl:value-of select="concat(concat(substring-after(JOBPOSITION_Z,'&amp;'),';'),substring-before(JOBPOSITION_Z,'&amp;'))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="contains(substring-after(JOBLEVEL_Z,'&amp;'),'&amp;')">
										<xsl:attribute name="lv">
											<xsl:value-of select="concat(concat(substring-after(substring-after(JOBLEVEL_Z,'&amp;'),'&amp;'),';'),concat(concat(substring-before(JOBLEVEL_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBLEVEL_Z,'&amp;'),'&amp;')))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBLEVEL_Z,'&amp;'),'&amp;'))">
										<xsl:attribute name="lv">
											<xsl:value-of select="concat(concat(substring-after(JOBLEVEL_Z,'&amp;'),';'),substring-before(JOBLEVEL_Z,'&amp;'))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:element name="DN">
										<xsl:value-of select="DISPLAY_NAME" />
									</xsl:element>
									<xsl:element name="DO">
										<xsl:value-of select="DISPLAY_NAME" />
									</xsl:element>
									<xsl:element name="JD">
										<xsl:value-of select="UNIT_CODE" />
									</xsl:element>
									<xsl:element name="LN"></xsl:element>
									<xsl:element name="FN">
										<xsl:value-of select="DISPLAY_NAME" />
									</xsl:element>
									<xsl:if test="contains(substring-after(JOBTITLE_Z,'&amp;'),'&amp;')">
										<xsl:element name="TL">
											<xsl:value-of select="concat(concat(substring-before(JOBTITLE_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBTITLE_Z,'&amp;'),'&amp;'))" />
										</xsl:element>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBTITLE_Z,'&amp;'),'&amp;'))">
										<xsl:element name="TL">
											<xsl:value-of select="substring-before(JOBTITLE_Z,'&amp;')" />
										</xsl:element>
									</xsl:if>
									<xsl:if test="contains(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;')">
										<xsl:element name="PO">
											<xsl:value-of select="concat(concat(substring-before(JOBPOSITION_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;'))" />
										</xsl:element>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;'))">
										<xsl:element name="PO">
											<xsl:value-of select="substring-before(JOBPOSITION_Z,'&amp;')" />
										</xsl:element>
									</xsl:if>
									<xsl:element name="LV">
										<xsl:value-of select="substring-before(JOBLEVEL_Z,'&amp;')" />
									</xsl:element>
									<xsl:element name="AN">
										<xsl:value-of select="PERSON_CODE" />
									</xsl:element>
									<xsl:element name="PI">
										<xsl:value-of select="PERSON_ID" />
									</xsl:element>
									<xsl:element name="CP"></xsl:element>
									<xsl:element name="DP">
										<xsl:value-of select="UNIT_NAME" />
									</xsl:element>
									<xsl:element name="DPSH">
										<xsl:value-of select="SHORT_NAME" />
									</xsl:element>
									<xsl:element name="OF"></xsl:element>
									<xsl:element name="CY">
										<xsl:value-of select="ENT_CODE" />
									</xsl:element>
									<xsl:element name="EM">
										<xsl:value-of select="EMAIL" />
									</xsl:element>
									<xsl:element name="SO">
										<xsl:value-of select="SORT_KEY" />
									</xsl:element>
									<xsl:element name="RG">
										<xsl:value-of select="UNIT_CODE" />
									</xsl:element>
									<xsl:element name="RGNM">
										<xsl:value-of select="UNIT_NAME" />
									</xsl:element>
									<xsl:element name="SG">
										<xsl:value-of select="UNIT_CODE" />
									</xsl:element>
									<xsl:element name="SGNM">
										<xsl:value-of select="UNIT_NAME" />
									</xsl:element>
									<xsl:element name="UG">
										<xsl:value-of select="PARENT_UNIT_CODE" />
									</xsl:element>
									<xsl:element name="UGNM">
										<xsl:value-of select="NAME" />
									</xsl:element>
									<xsl:element name="DEPUTY">
										<xsl:value-of select="DEPUTY" />
									</xsl:element>
									<xsl:element name="RV1">
										<xsl:value-of select="RESERVED1" />
									</xsl:element>
									<xsl:element name="RV2">
										<xsl:value-of select="RESERVED2" />
									</xsl:element>
									<xsl:element name="OT">
										<xsl:value-of select="OFFICE_TEL" />
									</xsl:element>
									<xsl:element name="MT">
										<xsl:value-of select="MOBILE_TEL" />
									</xsl:element>
									<xsl:element name="ABS">
										<xsl:value-of select="ABSENT" />
									</xsl:element>
									<xsl:element name="ABS_RS">
										<xsl:value-of select="ABSENT_REASON" />
									</xsl:element>
									<xsl:element name="UID">
										<xsl:value-of select="UID" />
									</xsl:element>
									<xsl:element name="ETID">
										<xsl:value-of select="ENT_CODE" />
									</xsl:element>
									<xsl:element name="ETNM">
										<xsl:value-of select="ENT_NAME" />
									</xsl:element>
									<xsl:element name="USRC">
										<xsl:value-of select="REGION_CODE" />
									</xsl:element>
									<xsl:element name="USEC">
										<xsl:value-of select="SABUN" />
									</xsl:element>
									<xsl:element name="USCC">
										<xsl:value-of select="COST_CENTER_CODE" />
									</xsl:element>
									<xsl:element name="USCN">
										<xsl:value-of select="COST_CENTER_NAME" />
									</xsl:element>
									<xsl:element name="USDNEN">
										<xsl:value-of select="DISPLAY_NAME_EN" />
									</xsl:element>
									<xsl:element name="JDT">
										<xsl:value-of select="substring-before(JOIN_DATE,'T')" />
									</xsl:element>
								</xsl:element>
							</xsl:for-each>
							<xsl:for-each select="//Table3">
								<xsl:element name="item">
									<xsl:attribute name="so">
										<xsl:value-of select="@SORT_KEY" />
									</xsl:attribute>
									<xsl:if test="contains(substring-after(JOBTITLE_Z,'&amp;'),'&amp;')">
										<xsl:attribute name="tl">
											<xsl:value-of select="concat(concat(substring-after(substring-after(JOBTITLE_Z,'&amp;'),'&amp;'),';'),concat(concat(substring-before(JOBTITLE_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBTITLE_Z,'&amp;'),'&amp;')))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBTITLE_Z,'&amp;'),'&amp;'))">
										<xsl:attribute name="tl">
											<xsl:value-of select="concat(concat(substring-after(JOBTITLE_Z,'&amp;'),';'),substring-before(JOBTITLE_Z,'&amp;'))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="contains(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;')">
										<xsl:attribute name="po">
											<xsl:value-of select="concat(concat(substring-after(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;'),';'),concat(concat(substring-before(JOBPOSITION_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;')))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;'))">
										<xsl:attribute name="po">
											<xsl:value-of select="concat(concat(substring-after(JOBPOSITION_Z,'&amp;'),';'),substring-before(JOBPOSITION_Z,'&amp;'))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="contains(substring-after(JOBLEVEL_Z,'&amp;'),'&amp;')">
										<xsl:attribute name="lv">
											<xsl:value-of select="concat(concat(substring-after(substring-after(JOBLEVEL_Z,'&amp;'),'&amp;'),';'),concat(concat(substring-before(JOBLEVEL_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBLEVEL_Z,'&amp;'),'&amp;')))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBLEVEL_Z,'&amp;'),'&amp;'))">
										<xsl:attribute name="lv">
											<xsl:value-of select="concat(concat(substring-after(JOBLEVEL_Z,'&amp;'),';'),substring-before(JOBLEVEL_Z,'&amp;'))" />
										</xsl:attribute>
									</xsl:if>
									<xsl:element name="DN">
										<xsl:value-of select="DISPLAY_NAME" />
									</xsl:element>
									<xsl:element name="DO">
										<xsl:value-of select="DISPLAY_NAME" />
									</xsl:element>
									<xsl:element name="JD">
										<xsl:value-of select="UNIT_CODE" />
									</xsl:element>
									<xsl:element name="LN"></xsl:element>
									<xsl:element name="FN">
										<xsl:value-of select="DISPLAY_NAME" />
									</xsl:element>
									<xsl:if test="contains(substring-after(JOBTITLE_Z,'&amp;'),'&amp;')">
										<xsl:element name="TL">
											<xsl:value-of select="concat(concat(substring-before(JOBTITLE_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBTITLE_Z,'&amp;'),'&amp;'))" />
										</xsl:element>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBTITLE_Z,'&amp;'),'&amp;'))">
										<xsl:element name="TL">
											<xsl:value-of select="substring-before(JOBTITLE_Z,'&amp;')" />
										</xsl:element>
									</xsl:if>
									<xsl:if test="contains(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;')">
										<xsl:element name="PO">
											<xsl:value-of select="concat(concat(substring-before(JOBPOSITION_Z,'&amp;'),'&amp;'),substring-before(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;'))" />
										</xsl:element>
									</xsl:if>
									<xsl:if test="not(contains(substring-after(JOBPOSITION_Z,'&amp;'),'&amp;'))">
										<xsl:element name="PO">
											<xsl:value-of select="substring-before(JOBPOSITION_Z,'&amp;')" />
										</xsl:element>
									</xsl:if>
									<xsl:element name="LV">
										<xsl:value-of select="substring-before(JOBLEVEL_Z,'&amp;')" />
									</xsl:element>
									<xsl:element name="AN">
										<xsl:value-of select="PERSON_CODE" />
									</xsl:element>
									<xsl:element name="PI">
										<xsl:value-of select="PERSON_ID" />
									</xsl:element>
									<xsl:element name="CP"></xsl:element>
									<xsl:element name="DP">
										<xsl:value-of select="UNIT_NAME" />
									</xsl:element>
									<xsl:element name="DPSH">
										<xsl:value-of select="SHORT_NAME" />
									</xsl:element>
									<xsl:element name="OF"></xsl:element>
									<xsl:element name="CY">
										<xsl:value-of select="ENT_CODE" />
									</xsl:element>
									<xsl:element name="EM">
										<xsl:value-of select="EMAIL" />
									</xsl:element>
									<xsl:element name="SO">
										<xsl:value-of select="SORT_KEY" />
									</xsl:element>
									<xsl:element name="RG">
										<xsl:value-of select="UNIT_CODE" />
									</xsl:element>
									<xsl:element name="RGNM">
										<xsl:value-of select="UNIT_NAME" />
									</xsl:element>
									<xsl:element name="SG">
										<xsl:value-of select="UNIT_CODE" />
									</xsl:element>
									<xsl:element name="SGNM">
										<xsl:value-of select="UNIT_NAME" />
									</xsl:element>
									<xsl:element name="UG">
										<xsl:value-of select="PARENT_UNIT_CODE" />
									</xsl:element>
									<xsl:element name="UGNM">
										<xsl:value-of select="NAME" />
									</xsl:element>
									<xsl:element name="DEPUTY">
										<xsl:value-of select="DEPUTY" />
									</xsl:element>
									<xsl:element name="RV1">
										<xsl:value-of select="RESERVED1" />
									</xsl:element>
									<xsl:element name="RV2">
										<xsl:value-of select="RESERVED2" />
									</xsl:element>
									<xsl:element name="OT">
										<xsl:value-of select="OFFICE_TEL" />
									</xsl:element>
									<xsl:element name="MT">
										<xsl:value-of select="MOBILE_TEL" />
									</xsl:element>
									<xsl:element name="ABS">
										<xsl:value-of select="ABSENT" />
									</xsl:element>
									<xsl:element name="ABS_RS">
										<xsl:value-of select="ABSENT_REASON" />
									</xsl:element>
									<xsl:element name="UID">
										<xsl:value-of select="UID" />
									</xsl:element>
									<xsl:element name="ETID">
										<xsl:value-of select="ENT_CODE" />
									</xsl:element>
									<xsl:element name="ETNM">
										<xsl:value-of select="ENT_NAME" />
									</xsl:element>
									<xsl:element name="USRC">
										<xsl:value-of select="REGION_CODE" />
									</xsl:element>
									<xsl:element name="USEC">
										<xsl:value-of select="SABUN" />
									</xsl:element>
									<xsl:element name="USCC">
										<xsl:value-of select="COST_CENTER_CODE" />
									</xsl:element>
									<xsl:element name="USCN">
										<xsl:value-of select="COST_CENTER_NAME" />
									</xsl:element>
									<xsl:element name="USDNEN">
										<xsl:value-of select="DISPLAY_NAME_EN" />
									</xsl:element>
									<xsl:element name="JDT">
										<xsl:value-of select="substring-before(JOIN_DATE,'T')" />
									</xsl:element>
								</xsl:element>
							</xsl:for-each>
						</xsl:element>
					</xsl:if>
				</xsl:when>
				<xsl:otherwise>
					<xsl:if test="(count(//Table)) = 0 ">
						<xsl:element name="error">none</xsl:element>
					</xsl:if>
					<xsl:if test="(count(//Table)) > 0 ">
						<xsl:element name="addresslist">
							<xsl:for-each select="//Table">
								<xsl:element name="item" use-attribute-sets="itemSet">
									<xsl:element name="DN">
										<xsl:value-of select="DISPLAY_NAME" />
									</xsl:element>
									<xsl:element name="DO">
										<xsl:value-of select="DISPLAY_NAME" />
									</xsl:element>
									<xsl:element name="JD">
										<xsl:value-of select="UNIT_CODE" />
									</xsl:element>
									<xsl:element name="LN"></xsl:element>
									<xsl:element name="FN">
										<xsl:value-of select="DISPLAY_NAME" />
									</xsl:element>
									<xsl:element name="TL">
										<xsl:value-of select="substring-before(JOBTITLE_Z,'&amp;')" />
									</xsl:element>
									<xsl:element name="PO">
										<xsl:value-of select="substring-before(JOBPOSITION_Z,'&amp;')" />
									</xsl:element>
									<xsl:element name="LV">
										<xsl:value-of select="substring-before(JOBLEVEL_Z,'&amp;')" />
									</xsl:element>
									<xsl:element name="AN">
										<xsl:value-of select="PERSON_CODE" />
									</xsl:element>
									<xsl:element name="PI">
										<xsl:value-of select="PERSON_ID" />
									</xsl:element>
									<xsl:element name="CP"></xsl:element>
									<xsl:element name="DP">
										<xsl:value-of select="UNIT_NAME" />
									</xsl:element>
									<xsl:element name="DPSH">
										<xsl:value-of select="SHORT_NAME" />
									</xsl:element>
									<xsl:element name="OF"></xsl:element>
									<xsl:element name="CY">
										<xsl:value-of select="ENT_CODE" />
									</xsl:element>
									<xsl:element name="EM">
										<xsl:value-of select="EMAIL" />
									</xsl:element>
									<xsl:element name="SO">
										<xsl:value-of select="SORT_KEY" />
									</xsl:element>
									<xsl:element name="RG">
										<xsl:value-of select="UNIT_CODE" />
									</xsl:element>
									<xsl:element name="RGNM">
										<xsl:value-of select="UNIT_NAME" />
									</xsl:element>
									<xsl:element name="SG">
										<xsl:value-of select="UNIT_CODE" />
									</xsl:element>
									<xsl:element name="SGNM">
										<xsl:value-of select="UNIT_NAME" />
									</xsl:element>
									<xsl:element name="UG">
										<xsl:value-of select="PARENT_UNIT_CODE" />
									</xsl:element>
									<xsl:element name="UGNM">
										<xsl:value-of select="NAME" />
									</xsl:element>
									<xsl:element name="DEPUTY">
										<xsl:value-of select="DEPUTY" />
									</xsl:element>
									<xsl:element name="RV1">
										<xsl:value-of select="RESERVED1" />
									</xsl:element>
									<xsl:element name="RV2">
										<xsl:value-of select="RESERVED2" />
									</xsl:element>
									<xsl:element name="OT">
										<xsl:value-of select="OFFICE_TEL" />
									</xsl:element>
									<xsl:element name="MT">
										<xsl:value-of select="MOBILE_TEL" />
									</xsl:element>
									<xsl:element name="ABS">
										<xsl:value-of select="ABSENT" />
									</xsl:element>
									<xsl:element name="ABS_RS">
										<xsl:value-of select="ABSENT_REASON" />
									</xsl:element>
									<xsl:element name="UID">
										<xsl:value-of select="UID" />
									</xsl:element>
									<xsl:element name="ETID">
										<xsl:value-of select="ENT_CODE" />
									</xsl:element>
									<xsl:element name="ETNM">
										<xsl:value-of select="ENT_NAME" />
									</xsl:element>
									<xsl:element name="USRC">
										<xsl:value-of select="REGION_CODE" />
									</xsl:element>
									<xsl:element name="USEC">
										<xsl:value-of select="SABUN" />
									</xsl:element>
									<xsl:element name="USCC">
										<xsl:value-of select="COST_CENTER_CODE" />
									</xsl:element>
									<xsl:element name="USCN">
										<xsl:value-of select="COST_CENTER_NAME" />
									</xsl:element>
									<xsl:element name="USDNEN">
										<xsl:value-of select="DISPLAY_NAME_EN" />
									</xsl:element>
									<xsl:element name="JDT">
										<xsl:value-of select="substring-before(JOIN_DATE,'T')" />
									</xsl:element>
								</xsl:element>
							</xsl:for-each>
						</xsl:element>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:element>
	</xsl:template>
	<xsl:attribute-set name="itemSet" >
		<xsl:attribute name="so">
			<xsl:value-of select="SORT_KEY" />
		</xsl:attribute>
		<xsl:attribute name="tl">
			<xsl:value-of select="concat(concat(substring-after(JOBTITLE_Z,'&amp;'),';'),substring-before(JOBTITLE_Z,'&amp;'))" />
		</xsl:attribute>
		<xsl:attribute name="po">
			<xsl:value-of select="concat(concat(substring-after(JOBPOSITION_Z,'&amp;'),';'),substring-before(JOBPOSITION_Z,'&amp;'))" />
		</xsl:attribute>
		<xsl:attribute name="lv">
			<xsl:value-of select="concat(concat(substring-after(JOBLEVEL_Z,'&amp;'),';'),substring-before(JOBLEVEL_Z,'&amp;'))" />
		</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="itemSetAdd" >
		<xsl:attribute name="so">
			<xsl:value-of select="SORT_KEY" />
		</xsl:attribute>
		<xsl:attribute name="tl">
			<xsl:value-of select="concat(concat(TITLE_CODE,';'), TITLE_NAME)" />
		</xsl:attribute>
		<xsl:attribute name="po">
			<xsl:value-of select="concat(concat(PSTN_CODE,';'), PSTN_NAME)" />
		</xsl:attribute>
		<xsl:attribute name="lv">
			<xsl:value-of select="concat(concat(LEVEL_CODE,';'), LEVEL_NAME)" />
		</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="itemSetDis" >
		<xsl:attribute name="so">
			<xsl:value-of select="B/C/D/SORT_KEY" />
		</xsl:attribute>
		<xsl:attribute name="tl">
			<xsl:value-of select="concat(concat(TITLE_CODE,';'), TITLE_NAME)" />
		</xsl:attribute>
		<xsl:attribute name="po">
			<xsl:value-of select="concat(concat(PSTN_CODE,';'), PSTN_NAME)" />
		</xsl:attribute>
		<xsl:attribute name="lv">
			<xsl:value-of select="concat(concat(substring-after(B/C/D/JOBLEVEL_Z,'&amp;'),';'),substring-before(B/C/D/JOBLEVEL_Z,'&amp;'))" />
		</xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="itemSetUnit" >
		<xsl:attribute name="so">
			<xsl:value-of select="SORT_KEY" />
		</xsl:attribute>
		<xsl:attribute name="tl">
			<xsl:value-of select="concat(concat('manager',';'), '관리자')" />
		</xsl:attribute>
		<xsl:attribute name="po">
			<xsl:value-of select="concat(concat('',';'), '')" />
		</xsl:attribute>
		<xsl:attribute name="lv">
			<xsl:value-of select="concat(concat('',';'),'')" />
		</xsl:attribute>
	</xsl:attribute-set>
</xsl:stylesheet>


