<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">

	<xsl:param name="unittype">person</xsl:param>
	<xsl:param name="routetype">approve</xsl:param>
	<xsl:param name="allottype"></xsl:param>
	<xsl:param name="referencename"></xsl:param>
	<xsl:param name="childvisible"></xsl:param>
	<msxsl:script language="JScript" implements-prefix="cfxsl">
	<![CDATA[
	]]>
	</msxsl:script>
	<xsl:template match="/">
		<steps>
			<xsl:choose>
				<xsl:when test="$routetype='approve'">
					<xsl:call-template name="tpl_step_splitted"/>
				</xsl:when>
				<xsl:when test="$routetype='consult'">
					<xsl:call-template name="tpl_step_joined">
						<xsl:with-param name="visible" select="$childvisible"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$routetype='receive'">
					<xsl:call-template name="tpl_step_splitted">
						<xsl:with-param name="visible" select="$childvisible"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$routetype='assist'">
					<xsl:call-template name="tpl_step_joined">
						<xsl:with-param name="visible" select="$childvisible"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$routetype='audit'">
					<xsl:call-template name="tpl_step_splitted">
						<xsl:with-param name="visible" select="$childvisible"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$routetype='review'">
					<xsl:call-template name="tpl_step_joined">
						<xsl:with-param name="visible" select="$childvisible"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$routetype='notify'">
					<xsl:call-template name="tpl_step_joined">
						<xsl:with-param name="visible" select="$childvisible"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$routetype='ccinfo'">
					<xsl:call-template name="tpl_ccinfo"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="tpl_step_splitted">
						<xsl:with-param name="visible" select="$childvisible"/>
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>
		</steps>
	</xsl:template>

	<xsl:template name="tpl_step_splitted" match="*">
		<xsl:param name="visible"/>
		<xsl:for-each select="*/item">
		    <step>
				<xsl:attribute name="unittype">
					<xsl:choose>
						<xsl:when test="$unittype='person' and ROLE='manager'">
							<xsl:text>role</xsl:text>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$unittype"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
				<xsl:attribute name="routetype"><xsl:value-of select="$routetype"/></xsl:attribute>
				<xsl:if test="$allottype!=''">
					<xsl:attribute name="allottype"><xsl:value-of select="$allottype"/></xsl:attribute>
				</xsl:if>
				<xsl:attribute name="name"><xsl:value-of select="$referencename"/></xsl:attribute>
				<xsl:choose>
					<xsl:when test="$unittype='ou'">
						<xsl:call-template name="tpl_group_item">
							<xsl:with-param name="visible" select="$visible"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:when test=" $routetype='receive' and ROLE='charge'">
						<xsl:call-template name="tpl_role_receive_item">
							<xsl:with-param name="visible" select="$visible"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:when test="$unittype='person' and ROLE='manager'">
						<xsl:call-template name="tpl_role_manager_item">
							<xsl:with-param name="visible" select="$visible"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:when test="$unittype='person'">
						<xsl:call-template name="tpl_user_item">
							<xsl:with-param name="visible" select="$visible"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:when test="$unittype='role'">
						<xsl:call-template name="tpl_role_item">
							<xsl:with-param name="visible" select="$visible"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:when test="$unittype='group'">
						<xsl:call-template name="tpl_dist_item">
							<xsl:with-param name="visible" select="$visible"/>
						</xsl:call-template>
					</xsl:when>
				</xsl:choose>
		    </step>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="tpl_step_joined" match="*">
		<xsl:param name="visible"/>
	    <step>
			<xsl:attribute name="unittype">
				<xsl:choose>
					<xsl:when test="$unittype='person' and ROLE='manager'">
						<xsl:text>role</xsl:text>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$unittype"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>
			<xsl:attribute name="routetype"><xsl:value-of select="$routetype"/></xsl:attribute>
			<xsl:if test="$allottype!=''">
				<xsl:attribute name="allottype"><xsl:value-of select="$allottype"/></xsl:attribute>
			</xsl:if>
			<xsl:attribute name="name"><xsl:value-of select="$referencename"/></xsl:attribute>
			<xsl:call-template name="tpl_taskinfo">
				<xsl:with-param name="visible" select="$visible"/>
			</xsl:call-template>
			<xsl:for-each select="*/item">
				<xsl:choose>
					<xsl:when test="$unittype='ou'">
						<xsl:call-template name="tpl_group_item"/>
					</xsl:when>
					<xsl:when test="$unittype='person' and ROLE='manager'">
						<xsl:call-template name="tpl_role_manager_item"/>
					</xsl:when>
					<xsl:when test="$unittype='person'">
						<xsl:call-template name="tpl_user_item"/>
					</xsl:when>
					<xsl:when test="$unittype='role'">
						<xsl:call-template name="tpl_role_item"/>
					</xsl:when>
					<xsl:when test="$unittype='group'">
						<xsl:call-template name="tpl_dist_item"/>
					</xsl:when>
				</xsl:choose>
			</xsl:for-each>
	    </step>
	</xsl:template>

	<xsl:template name="tpl_ccinfo" match="*">
		<xsl:param name="visible"/>
	    <ccinfo>
			<xsl:attribute name="belongto"><xsl:value-of select="$allottype"/></xsl:attribute>
			<xsl:for-each select="*/item">
				<xsl:choose>
					<xsl:when test="$unittype='ou'">
						<xsl:call-template name="tpl_group_item"/>
					</xsl:when>
					<xsl:when test="$unittype='person'">
						<xsl:call-template name="tpl_user_item"/>
					</xsl:when>
					<xsl:when test="$unittype='role'">
						<xsl:call-template name="tpl_role_item"/>
					</xsl:when>
					<xsl:when test="$unittype='group'">
						<xsl:call-template name="tpl_dist_item"/>
					</xsl:when>
				</xsl:choose>
			</xsl:for-each>
	    </ccinfo>
	</xsl:template>

	<xsl:template name="tpl_group_item" match="*">
		<xsl:param name="visible"/>
		<ou>
			<xsl:attribute name="code"><xsl:value-of select="AN"/></xsl:attribute>
			<xsl:attribute name="name"><xsl:value-of select="DN"/></xsl:attribute>
			<xsl:if test="$routetype!='notify' and $routetype!='ccinfo'">
				<xsl:call-template name="tpl_taskinfo">
					<xsl:with-param name="visible" select="$visible"/>
				</xsl:call-template>
			</xsl:if>
		</ou>
	</xsl:template>

	<xsl:template name="tpl_user_item" match="*">
		<xsl:param name="visible"/>
		<ou>
			<xsl:attribute name="code"><xsl:value-of select="RG"/></xsl:attribute>
			<xsl:attribute name="name"><xsl:value-of select="RGNM"/></xsl:attribute>
			<person>
				<xsl:attribute name="code"><xsl:value-of select="AN"/></xsl:attribute>
				<xsl:attribute name="name"><xsl:value-of select="DN"/></xsl:attribute>
				<xsl:attribute name="position"><xsl:value-of select="@po"/></xsl:attribute>
				<xsl:attribute name="title"><xsl:value-of select="@tl"/></xsl:attribute>
				<xsl:attribute name="level"><xsl:value-of select="@lv"/></xsl:attribute>
				<xsl:attribute name="oucode"><xsl:value-of select="SG"/></xsl:attribute>
				<xsl:attribute name="ouname"><xsl:value-of select="DP"/></xsl:attribute>
				<xsl:if test="$routetype!='notify' and $routetype!='ccinfo'">
					<xsl:call-template name="tpl_taskinfo">
						<xsl:with-param name="visible" select="$visible"/>
					</xsl:call-template>
				</xsl:if>
			</person>
		</ou>
	</xsl:template>

	<xsl:template name="tpl_role_manager_item" match="*">
		<xsl:param name="visible"/>
		<ou>
			<xsl:attribute name="code"><xsl:value-of select="AN"/></xsl:attribute>
			<xsl:attribute name="name"><xsl:value-of select="DN"/></xsl:attribute>
			<role>
				<xsl:attribute name="code">UNIT_MANAGER</xsl:attribute>
				<xsl:attribute name="name"><xsl:value-of select="DN"/>장</xsl:attribute>		
				<xsl:attribute name="oucode"><xsl:value-of select="AN"/></xsl:attribute>
				<xsl:attribute name="ouname"><xsl:value-of select="DN"/></xsl:attribute>		
				<xsl:call-template name="tpl_taskinfo">
					<xsl:with-param name="visible" select="$visible"/>
				</xsl:call-template>
			</role>
		</ou>
	</xsl:template>
	<xsl:template name="tpl_role_receive_item" match="*">
		<xsl:param name="visible"/>
		<ou>
			<xsl:attribute name="code"><xsl:value-of select="RG"/></xsl:attribute>
			<xsl:attribute name="name"><xsl:value-of select="RGNM"/></xsl:attribute>
			<role>
				<xsl:attribute name="code"><xsl:value-of select="AN"/></xsl:attribute>
				<xsl:attribute name="name"><xsl:value-of select="DN"/></xsl:attribute>		
				<xsl:attribute name="oucode"><xsl:value-of select="AN"/></xsl:attribute>
				<xsl:attribute name="ouname"><xsl:value-of select="DN"/></xsl:attribute>		
				<xsl:call-template name="tpl_taskinfo">
					<xsl:with-param name="visible" select="$visible"/>
				</xsl:call-template>
			</role>
		</ou>
	</xsl:template>
	<xsl:template name="tpl_role_item" match="*">
		<xsl:param name="visible"/>
		<role>
			<xsl:attribute name="code"><xsl:value-of select="RG"/></xsl:attribute>
			<xsl:attribute name="name"><xsl:value-of select="RGNM"/></xsl:attribute>		
			<person>
				<xsl:attribute name="code"><xsl:value-of select="AN"/></xsl:attribute>
				<xsl:attribute name="name"><xsl:value-of select="DN"/></xsl:attribute>
				<xsl:attribute name="position"><xsl:value-of select="@po"/></xsl:attribute>
				<xsl:attribute name="title"><xsl:value-of select="@tl"/></xsl:attribute>
				<xsl:attribute name="level"><xsl:value-of select="@lv"/></xsl:attribute>
				<xsl:attribute name="oucode"><xsl:value-of select="SG"/></xsl:attribute>
				<xsl:attribute name="ouname"><xsl:value-of select="DP"/></xsl:attribute>
				<xsl:if test="$routetype!='notify' and $routetype!='ccinfo'">
					<xsl:call-template name="tpl_taskinfo">
						<xsl:with-param name="visible" select="$visible"/>
					</xsl:call-template>
				</xsl:if>
			</person>
		</role>
	</xsl:template>

	<xsl:template name="tpl_dist_item" match="*">
		<xsl:param name="visible"/>
		<group>
			<xsl:attribute name="code"><xsl:value-of select="AN"/></xsl:attribute>
			<xsl:attribute name="name"><xsl:value-of select="DN"/></xsl:attribute>		
			<xsl:if test="$routetype!='notify' and $routetype!='ccinfo'">
				<xsl:call-template name="tpl_taskinfo">
					<xsl:with-param name="visible" select="$visible"/>
				</xsl:call-template>
			</xsl:if>
		</group>
	</xsl:template>

	<xsl:template name="tpl_taskinfo" match="*">
		<xsl:param name="visible"/>
		<taskinfo status="inactive" result="inactive">
			<xsl:attribute name="kind">
			<xsl:choose>
				<xsl:when test="$routetype='consult'">consent</xsl:when>
				<xsl:when test="$routetype='review'">confirm</xsl:when>
				<!--<xsl:when test="$unittype='role'">charge</xsl:when>-->
				<xsl:otherwise>normal</xsl:otherwise>
			</xsl:choose>
			</xsl:attribute>
			<xsl:if test="$visible='n'">
				<xsl:attribute name="visible">n</xsl:attribute>
			</xsl:if>
		</taskinfo>
	</xsl:template>

</xsl:stylesheet>

