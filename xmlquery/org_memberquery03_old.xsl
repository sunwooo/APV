<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="ROOT">
	<xsl:element name="response">
		<xsl:if test="(count(//ORG_PERSON)+count(//ORG_ADDITIONALJOB)+count(//ORG_DISPATCHEDJOB)+count(//ORG_UNIT)) = 0 ">
			<xsl:element name="error">none</xsl:element>
		</xsl:if>
		<xsl:if test="(count(//ORG_PERSON)+count(//ORG_ADDITIONALJOB) +count(//ORG_DISPATCHEDJOB)+count(//ORG_UNIT)) > 0 ">
			<xsl:element name="addresslist">
				<xsl:for-each select="ORG_PERSON">
					<xsl:element name="item" use-attribute-sets="itemSet">
						<xsl:element name="DN"><xsl:value-of select="@DISPLAY_NAME" /></xsl:element>
						<xsl:element name="DO"><xsl:value-of select="@DISPLAY_NAME" /></xsl:element>
						<xsl:element name="JD"></xsl:element>
						<xsl:element name="LN"></xsl:element>
						<xsl:element name="FN"><xsl:value-of select="@DISPLAY_NAME" /></xsl:element>
						<xsl:element name="TL"><xsl:value-of select="substring-before(@JOBTITLE_Z,'&amp;')" /></xsl:element>
						<xsl:element name="PO"><xsl:value-of select="substring-before(@JOBPOSITION_Z,'&amp;')" /></xsl:element>
						<xsl:element name="LV"><xsl:value-of select="substring-before(@JOBLEVEL_Z,'&amp;')" /></xsl:element>
						<xsl:element name="AN"><xsl:value-of select="@PERSON_CODE" /></xsl:element>
						<xsl:element name="PI"><xsl:value-of select="@PERSON_ID" /></xsl:element>
						<xsl:element name="CP"></xsl:element>
						<xsl:element name="DP"><xsl:value-of select="@UNIT_NAME" /></xsl:element>
						<xsl:element name="OF"></xsl:element>
						<xsl:element name="CY"><xsl:value-of select="@ENT_CODE" /></xsl:element>
						<xsl:element name="EM"><xsl:value-of select="@EMAIL" /></xsl:element>
						<xsl:element name="SO"><xsl:value-of select="@SORT_KEY" /></xsl:element>
						<xsl:element name="RG"><xsl:value-of select="@UNIT_CODE" /></xsl:element>
						<xsl:element name="RGNM"><xsl:value-of select="@UNIT_NAME" /></xsl:element>
						<xsl:element name="SG"><xsl:value-of select="@UNIT_CODE" /></xsl:element>
						<xsl:element name="SGNM"><xsl:value-of select="@UNIT_NAME" /></xsl:element>
						<xsl:element name="UG"><xsl:value-of select="B/@PARENT_UNIT_CODE" /></xsl:element>
						<xsl:element name="UGNM"><xsl:value-of select="B/C/@NAME" /></xsl:element>
						<xsl:element name="DEPUTY"><xsl:value-of select="@DEPUTY" /></xsl:element>
						<xsl:element name="RV1"><xsl:value-of select="@RESERVED1" /></xsl:element>
						<xsl:element name="RV2"><xsl:value-of select="@RESERVED2" /></xsl:element>
						<xsl:element name="OT"><xsl:value-of select="@OFFICE_TEL" /></xsl:element>
						<xsl:element name="MT"><xsl:value-of select="@MOBILE_TEL" /></xsl:element>
						<xsl:element name="ABS"><xsl:value-of select="@ABSENT" /></xsl:element>
						<xsl:element name="ABS_RS"><xsl:value-of select="@ABSENT_REASON" /></xsl:element>
						<xsl:element name="UID"><xsl:value-of select="@UID" /></xsl:element>
						<xsl:element name="ETID"><xsl:value-of select="@ENT_CODE" /></xsl:element>
						<xsl:element name="USRC"><xsl:value-of select="@REGION_CODE" /></xsl:element>
						<xsl:element name="USEC"><xsl:value-of select="@SABUN" /></xsl:element>
						<xsl:element name="USCC"><xsl:value-of select="@COST_CENTER" /></xsl:element>
						<xsl:element name="JDT"><xsl:value-of select="substring-before(@JOIN_DATE,'T')" /></xsl:element>
					</xsl:element>	
				</xsl:for-each>
				<xsl:for-each select="ORG_ADDITIONALJOB">
					<xsl:element name="item" use-attribute-sets="itemSetAdd">
						<xsl:element name="DN"><xsl:value-of select="B/C/D/@DISPLAY_NAME" /></xsl:element>
						<xsl:element name="DO"><xsl:value-of select="B/C/D/@DISPLAY_NAME" /></xsl:element>
						<xsl:element name="JD"></xsl:element>
						<xsl:element name="LN"></xsl:element>
						<xsl:element name="FN"><xsl:value-of select="B/C/D/@DISPLAY_NAME" /></xsl:element>
						<xsl:element name="TL"><xsl:value-of select="@TITLE_NAME" /></xsl:element>
						<xsl:element name="PO"><xsl:value-of select="@PSTN_NAME" /></xsl:element>
						<xsl:element name="LV"><xsl:value-of select="substring-before(B/C/D/@JOBLEVEL_Z,'&amp;')" /></xsl:element>
						<xsl:element name="AN"><xsl:value-of select="@PERSON_CODE" /></xsl:element>
						<xsl:element name="PI"><xsl:value-of select="@PERSON_ID" /></xsl:element>
						<xsl:element name="CP"></xsl:element>
						<xsl:element name="DP"><xsl:value-of select="@UNIT_NAME" /></xsl:element>
						<xsl:element name="OF"></xsl:element>
						<xsl:element name="CY"></xsl:element>
						<xsl:element name="EM"><xsl:value-of select="B/C/D/@EMAIL" /></xsl:element>
						<xsl:element name="SO"><xsl:value-of select="B/C/D/@SORT_KEY" /></xsl:element>
						<xsl:element name="RG"><xsl:value-of select="@UNIT_CODE" /></xsl:element>
						<xsl:element name="RGNM"><xsl:value-of select="B/@NAME" /></xsl:element>
						<xsl:element name="SG"><xsl:value-of select="B/C/D/@UNIT_CODE" /></xsl:element>
						<xsl:element name="SGNM"><xsl:value-of select="B/C/D/@UNIT_NAME" /></xsl:element>
						<xsl:element name="UG"><xsl:value-of select="B/@PARENT_UNIT_CODE" /></xsl:element>
						<xsl:element name="UGNM"><xsl:value-of select="B/C/@NAME" /></xsl:element>
						<xsl:element name="DEPUTY"><xsl:value-of select="B/C/D/@DEPUTY" /></xsl:element>
						<xsl:element name="RV1"><xsl:value-of select="B/C/D/@RESERVED1" /></xsl:element>
						<xsl:element name="RV2"><xsl:value-of select="B/C/D/@RESERVED2" /></xsl:element>
						<xsl:element name="OT"><xsl:value-of select="@OFFICE_TEL" /></xsl:element>
						<xsl:element name="MT"><xsl:value-of select="@MOBILE_TEL" /></xsl:element>
						<xsl:element name="ABS"><xsl:value-of select="@ABSENT" /></xsl:element>
						<xsl:element name="ABS_RS"><xsl:value-of select="@ABSENT_REASON" /></xsl:element>
						<xsl:element name="UID"><xsl:value-of select="@UID" /></xsl:element>
						<xsl:element name="ETID"><xsl:value-of select="B/C/D/@ENT_CODE" /></xsl:element>
						<xsl:element name="USRC"><xsl:value-of select="B/C/D/@REGION_CODE" /></xsl:element>
						<xsl:element name="USEC"><xsl:value-of select="B/C/D/@SABUN" /></xsl:element>
						<xsl:element name="USCC"><xsl:value-of select="B/C/D/@COST_CENTER" /></xsl:element>
						<xsl:element name="JDT"><xsl:value-of select="B/C/D/@JOIN_DATE" /></xsl:element>
					</xsl:element>
				</xsl:for-each>
				<xsl:for-each select="ORG_DISPATCHEDJOB">
					<xsl:element name="item" use-attribute-sets="itemSetDis">
						<xsl:element name="DN"><xsl:value-of select="B/C/D/@DISPLAY_NAME" /></xsl:element>
						<xsl:element name="DO"><xsl:value-of select="B/C/D/@DISPLAY_NAME" /></xsl:element>
						<xsl:element name="JD"></xsl:element>
						<xsl:element name="LN"></xsl:element>
						<xsl:element name="FN"><xsl:value-of select="B/C/D/@DISPLAY_NAME" /></xsl:element>
						<xsl:element name="TL"><xsl:value-of select="@TITLE_NAME" /></xsl:element>
						<xsl:element name="PO"><xsl:value-of select="@PSTN_NAME" /></xsl:element>
						<xsl:element name="LV"><xsl:value-of select="substring-before(B/C/D/@JOBLEVEL_Z,'&amp;')" /></xsl:element>
						<xsl:element name="AN"><xsl:value-of select="@PERSON_CODE" /></xsl:element>
						<xsl:element name="PI"><xsl:value-of select="@PERSON_ID" /></xsl:element>
						<xsl:element name="CP"></xsl:element>
						<xsl:element name="DP"><xsl:value-of select="@UNIT_NAME" /></xsl:element>
						<xsl:element name="OF"></xsl:element>
						<xsl:element name="CY"></xsl:element>
						<xsl:element name="EM"><xsl:value-of select="B/C/D/@EMAIL" /></xsl:element>
						<xsl:element name="SO"><xsl:value-of select="B/C/D/@SORT_KEY" /></xsl:element>
						<xsl:element name="RG"><xsl:value-of select="@UNIT_CODE" /></xsl:element>
						<xsl:element name="RGNM"><xsl:value-of select="B/@NAME" /></xsl:element>
						<xsl:element name="SG"><xsl:value-of select="B/C/D/@UNIT_CODE" /></xsl:element>
						<xsl:element name="SGNM"><xsl:value-of select="B/C/D/@UNIT_NAME" /></xsl:element>
						<xsl:element name="UG"><xsl:value-of select="B/@PARENT_UNIT_CODE" /></xsl:element>
						<xsl:element name="UGNM"><xsl:value-of select="B/C/@NAME" /></xsl:element>
						<xsl:element name="DEPUTY"><xsl:value-of select="B/C/D/@DEPUTY" /></xsl:element>
						<xsl:element name="RV1"><xsl:value-of select="B/C/D/@RESERVED1" /></xsl:element>
						<xsl:element name="RV2"><xsl:value-of select="B/C/D/@RESERVED2" /></xsl:element>
						<xsl:element name="OT"><xsl:value-of select="@OFFICE_TEL" /></xsl:element>
						<xsl:element name="MT"><xsl:value-of select="@MOBILE_TEL" /></xsl:element>
						<xsl:element name="ABS"><xsl:value-of select="@ABSENT" /></xsl:element>
						<xsl:element name="ABS_RS"><xsl:value-of select="@ABSENT_REASON" /></xsl:element>
						<xsl:element name="UID"><xsl:value-of select="@UID" /></xsl:element>
						<xsl:element name="ETID"><xsl:value-of select="B/C/D/@ENT_CODE" /></xsl:element>
						<xsl:element name="USRC"><xsl:value-of select="B/C/D/@REGION_CODE" /></xsl:element>
						<xsl:element name="USEC"><xsl:value-of select="B/C/D/@SABUN" /></xsl:element>
						<xsl:element name="USCC"><xsl:value-of select="B/C/D/@COST_CENTER" /></xsl:element>
						<xsl:element name="JDT"><xsl:value-of select="B/C/D/@JOIN_DATE" /></xsl:element>
					</xsl:element>
				</xsl:for-each>
				<xsl:for-each select="ORG_UNIT">
					<xsl:element name="item" use-attribute-sets="itemSetUnit">
						<xsl:element name="ROLE">manager</xsl:element>
						<xsl:element name="AN"><xsl:value-of select="@UNIT_CODE" /></xsl:element>
						<xsl:element name="DN"><xsl:value-of select="@NAME" /></xsl:element>
						<xsl:element name="EM"><xsl:value-of select="@EMAIL" /></xsl:element>
						<xsl:element name="JD"><xsl:value-of select="@NAME" /></xsl:element>
						<xsl:element name="LN"></xsl:element>
						<xsl:element name="FN"><xsl:value-of select="@NAME" /></xsl:element>
						<xsl:element name="PI"><xsl:value-of select="@UNIT_ID" /></xsl:element>
						<xsl:element name="SG"><xsl:value-of select="@UNIT_CODE" /></xsl:element>
						<xsl:element name="SGNM"><xsl:value-of select="@UNIT_NAME" /></xsl:element>
						<xsl:element name="DO"></xsl:element>
						<xsl:element name="TL"></xsl:element>
						<xsl:element name="PO"></xsl:element>
						<xsl:element name="LV"></xsl:element>
						<xsl:element name="RK"></xsl:element>
						<xsl:element name="CP"></xsl:element>
						<xsl:element name="DP"><xsl:value-of select="@UNIT_NAME" /></xsl:element>
						<xsl:element name="OF"></xsl:element>
						<xsl:element name="CY"></xsl:element>
						<xsl:element name="SO"><xsl:value-of select="@SORT_KEY" /></xsl:element>
						<xsl:element name="RG"><xsl:value-of select="@UNIT_CODE" /></xsl:element>
						<xsl:element name="RGNM"><xsl:value-of select="@UNIT_NAME" /></xsl:element>
						<xsl:element name="UG"><xsl:value-of select="@PARENT_UNIT_CODE" /></xsl:element>
						<xsl:element name="UGNM"><xsl:value-of select="C/@NAME" /></xsl:element>
						<xsl:element name="DEPUTY"></xsl:element>
						<xsl:element name="RV1"></xsl:element>
						<xsl:element name="RV2"></xsl:element>
						<xsl:element name="OT"></xsl:element>
						<xsl:element name="MT"></xsl:element>
						<xsl:element name="ABS"></xsl:element>
						<xsl:element name="ABS_RS"></xsl:element>
						<xsl:element name="UID"></xsl:element>
					</xsl:element>
				</xsl:for-each>
			</xsl:element>
		</xsl:if>
	</xsl:element>	
</xsl:template>
	<xsl:attribute-set name="itemSet" >
	<xsl:attribute name="so"><xsl:value-of select="@SORT_KEY" /></xsl:attribute>
	<xsl:attribute name="tl"><xsl:value-of select="concat(concat(substring-after(@JOBTITLE_Z,'&amp;'),';'),substring-before(@JOBTITLE_Z,'&amp;'))" /></xsl:attribute>
	<xsl:attribute name="po"><xsl:value-of select="concat(concat(substring-after(@JOBPOSITION_Z,'&amp;'),';'),substring-before(@JOBPOSITION_Z,'&amp;'))" /></xsl:attribute>
	<xsl:attribute name="lv"><xsl:value-of select="concat(concat(substring-after(@JOBLEVEL_Z,'&amp;'),';'),substring-before(@JOBLEVEL_Z,'&amp;'))" /></xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="itemSetAdd" >
	<xsl:attribute name="so"><xsl:value-of select="B/C/D/@SORT_KEY" /></xsl:attribute>
	<xsl:attribute name="tl"><xsl:value-of select="concat(concat(@TITLE_CODE,';'), @TITLE_NAME)" /></xsl:attribute>
	<xsl:attribute name="po"><xsl:value-of select="concat(concat(@PSTN_CODE,';'), @PSTN_NAME)" /></xsl:attribute>
	<xsl:attribute name="lv"><xsl:value-of select="concat(concat(substring-after(B/C/D/@JOBLEVEL_Z,'&amp;'),';'),substring-before(B/C/D/@JOBLEVEL_Z,'&amp;'))" /></xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="itemSetDis" >
	<xsl:attribute name="so"><xsl:value-of select="B/C/D/@SORT_KEY" /></xsl:attribute>
	<xsl:attribute name="tl"><xsl:value-of select="concat(concat(@TITLE_CODE,';'), @TITLE_NAME)" /></xsl:attribute>
	<xsl:attribute name="po"><xsl:value-of select="concat(concat(@PSTN_CODE,';'), @PSTN_NAME)" /></xsl:attribute>
	<xsl:attribute name="lv"><xsl:value-of select="concat(concat(substring-after(B/C/D/@JOBLEVEL_Z,'&amp;'),';'),substring-before(B/C/D/@JOBLEVEL_Z,'&amp;'))" /></xsl:attribute>
	</xsl:attribute-set>
	<xsl:attribute-set name="itemSetUnit" >
	<xsl:attribute name="so"><xsl:value-of select="@SORT_KEY" /></xsl:attribute>
	<xsl:attribute name="tl"><xsl:value-of select="concat(concat('manager',';'), '부서장')" /></xsl:attribute>
	<xsl:attribute name="po"><xsl:value-of select="concat(concat('',';'), '')" /></xsl:attribute>
	<xsl:attribute name="lv"><xsl:value-of select="concat(concat('',';'),'')" /></xsl:attribute>
	</xsl:attribute-set>
</xsl:stylesheet>
