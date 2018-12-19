<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApvlineDisplay_xsl.aspx.cs" Inherits="COVIFlowNet_ApvlineMgr_ApvlineDisplay_xsl" %><?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    xmlns:cfxsl="urn:cfxsl"
    xmlns:cfutil="urn:cfxsl">

	<xsl:param name="viewtype">create</xsl:param>
	<xsl:param name="currentroutetype">approve</xsl:param>
	<xsl:param name="deputytype">T</xsl:param>
	<xsl:param name="lngindex">0</xsl:param>
	<xsl:template match="/">
		<xsl:value-of select="cfxsl:resetHiddenStepCount(steps/division/step[taskinfo/@visible='n'])"/>
		<xsl:variable name="displaylog">false</xsl:variable>
		<table width="100%" border="0" cellspacing="0" cellpadding="0" class="BTable">
			<thead>
			<xsl:choose>
				<xsl:when test="$viewtype='create'">
					<tr class="BTable_bg02" style="height:25px">
						<th style=" padding-left:10px" nowrap="t"><%= Resources.Approval.lbl_no %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_username %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_jobposition %></th>						
						<th nowrap="t"><%= Resources.Approval.lbl_jobtitle %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_state%></th>
						<th nowrap="t"><%= Resources.Approval.lbl_kind %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_dept %></th>
					</tr>
					<tr>
                        <td height="1" colspan="7" class="BTable_bg03"></td>
                    </tr>
				</xsl:when>
				<xsl:when test="$viewtype='read'">
					<tr class="BTable_bg02" style="height:25px">
						<th style=" padding-left:10px"><%= Resources.Approval.lbl_no %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_username %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_jobposition %></th>						
						<th nowrap="t"><%= Resources.Approval.lbl_jobtitle %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_state %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_kind %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_dept %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_approvdate %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_receivedate %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_comment %></th>
					</tr>
					<tr>
                        <td height="1" colspan="10" class="BTable_bg03"></td>
                    </tr>
				</xsl:when>
				<xsl:when test="$viewtype='change'">
					<tr class="BTable_bg02" style="height:25px">
						<th style=" padding-left:10px"><%= Resources.Approval.lbl_no %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_username %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_jobposition %></th>						
						<th nowrap="t"><%= Resources.Approval.lbl_jobtitle %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_state %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_kind %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_dept %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_approvdate %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_receivedate %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_comment %></th>
					</tr>
					<tr>
                        <td height="1" colspan="10" class="BTable_bg03"></td>
                    </tr>
				</xsl:when>
			</xsl:choose>
			</thead>
			<tbody>
			<xsl:for-each select="steps/division">
		        <xsl:sort select="position()" data-type="number" order="descending"/>
		        <xsl:variable name="idxdivision"><xsl:number value="last()-position()+1" format="1"/></xsl:variable>
		        <xsl:variable name="cntdivision"><xsl:number value="last()" format="1"/></xsl:variable>
			    <xsl:apply-templates select=".">
					    <xsl:with-param name="idxdivision" select="$idxdivision"/>
					    <xsl:with-param name="cntdivision" select="$cntdivision"/>
				</xsl:apply-templates>
			</xsl:for-each>
			</tbody>
		</table>
		<%--<xsl:if test="$displaylog='true'"><div><xsl:value-of select="cfxsl:getLog()"/></div></xsl:if>--%>
	</xsl:template>
    <xsl:template match="division">
		<xsl:param name="idxdivision"/>
		<xsl:param name="cntdivision"/>
		<xsl:for-each select="step">
		    <xsl:sort select="position()" data-type="number" order="descending"/>
		    <xsl:variable name="idxstep"><xsl:number value="last()-position()+1" format="01"/></xsl:variable>
		    <xsl:choose>
			    <xsl:when test="taskinfo/@visible='n'"/>
			    <xsl:otherwise>
				    <xsl:apply-templates select=".">
					    <xsl:with-param name="idxdivision" select="$idxdivision"/>
					    <xsl:with-param name="idxstep" select="$idxstep"/>
				    </xsl:apply-templates>
			    </xsl:otherwise>
		    </xsl:choose>
		</xsl:for-each>
		<xsl:if test="$cntdivision>1">
		    <xsl:call-template name="htmlrow">
			    <xsl:with-param name="steproutetype" select="@divisiontype"/>
			    <xsl:with-param name="stepunittype" select="@divisiontype"/>
			    <%--<xsl:with-param name="parentunittype" select="" />--%>
			    <xsl:with-param name="itemid" select="concat('division[',number($idxdivision)-1,']')"/>
			    <xsl:with-param name="index" select="$idxdivision"/>
			    <xsl:with-param name="displayname" select="string(@name)"/>
			    <%--<xsl:with-param name="title" select=""/>--%>				
			    <%--<xsl:with-param name="level" select=""/>--%>
			    <xsl:with-param name="itemtaskinfo" select="taskinfo"/>
			    <xsl:with-param name="oudisplayname" select="string(@ouname)"/>
		    </xsl:call-template>
		</xsl:if>  
    </xsl:template>
	<xsl:template match="step">
		<xsl:param name="idxdivision"/>
		<xsl:param name="idxstep"/>
		<xsl:variable name="idxstepdisp" select="$idxstep - cfxsl:countHidden(.)"/>
		<xsl:variable name="stepunittype" select="string(@unittype)"/>
		<xsl:variable name="steproutetype" select="string(@routetype)"/>
		<xsl:variable name="stepallottype" select="string(@allottype)" />
		<!-- 2007.08 sunny 추가 -->
		<xsl:value-of select="cfxsl:resetHiddenOuCount(ou[taskinfo/@visible='n'])"/>
		<xsl:value-of select="cfxsl:resetHiddenPersonCount(person[taskinfo/@visible='n'])"/>
		<xsl:choose>
			<xsl:when test="$steproutetype='approve'">
				<xsl:choose>
					<xsl:when test="$stepunittype='person'">
						<xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="descending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="idxperson" select="1"/>
								<xsl:with-param name="cntperson" select="1"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="parentunittype" select="'person'"/>
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="$stepunittype='ou'">
					</xsl:when>
					<xsl:when test="$stepunittype='role'">
						<xsl:apply-templates select="ou/role">
							<xsl:with-param name="idxdivision" select="$idxdivision"/>
							<xsl:with-param name="idxstep" select="$idxstep"/>
							<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
							<xsl:with-param name="idxou" select="1"/>
							<xsl:with-param name="idxoudisp" select="1 - cfxsl:countHidden(ancestor::ou)"/>
							<xsl:with-param name="cntou" select="1"/>
							<xsl:with-param name="idxperson" select="1"/>
							<xsl:with-param name="cntperson" select="1"/>
							<xsl:with-param name="steproutetype" select="$steproutetype"/>
							<xsl:with-param name="stepunittype" select="$stepunittype"/>
							<xsl:with-param name="parentunittype" select="'person'"/>
						</xsl:apply-templates>
					</xsl:when>
					<xsl:when test="$stepunittype='mix'">
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$steproutetype='consult'">
				<xsl:choose>
					<xsl:when test="$stepunittype='person'">
						<xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="descending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="idxperson" select="1"/>
								<xsl:with-param name="cntperson" select="1"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="parentunittype" select="'person'"/>
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="$stepunittype='ou'">
						<xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="descending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="parentunittype" select="'ou'"/>
								<xsl:with-param name="assureouvisible" select="'true'"/>
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="$stepunittype='role'">
					</xsl:when>
					<xsl:when test="$stepunittype='mix'">
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$steproutetype='receive'">
				<xsl:choose>
					<xsl:when test="$stepunittype='person'">
						<xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="descending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="idxperson" select="1"/>
								<xsl:with-param name="cntperson" select="1"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="parentunittype" select="'person'"/>
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="$stepunittype='ou'">
						<xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="descending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="parentunittype" select="'ou'"/>
								<xsl:with-param name="assureouvisible" select="'true'"/>
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="$stepunittype='role'">
					</xsl:when>
					<xsl:when test="$stepunittype='mix'">
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$steproutetype='assist'">
				<xsl:choose>
					<xsl:when test="$stepunittype='person'">
						<xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="descending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="idxperson" select="1"/>
								<xsl:with-param name="cntperson" select="1"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="parentunittype" select="'person'"/>
								<xsl:with-param name="stepallottype" select="$stepallottype" />
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="$stepunittype='ou'">
						<xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="descending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="parentunittype" select="'ou'"/>
								<xsl:with-param name="assureouvisible" select="'true'"/>
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="$stepunittype='role'">
					</xsl:when>
					<xsl:when test="$stepunittype='mix'">
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$steproutetype='audit'">
				<xsl:choose>
					<xsl:when test="$stepunittype='person'">
						<xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="descending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="idxperson" select="1"/>
								<xsl:with-param name="cntperson" select="1"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="parentunittype" select="'person'"/>
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="$stepunittype='ou'">
						<xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="descending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="parentunittype" select="'ou'"/>
								<xsl:with-param name="assureouvisible" select="'true'"/>
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="$stepunittype='role'">
					</xsl:when>
					<xsl:when test="$stepunittype='mix'">
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$steproutetype='review'">
				<xsl:choose>
					<xsl:when test="$stepunittype='person'">
                        <xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="descending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="idxperson" select="1"/>
								<xsl:with-param name="cntperson" select="1"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="parentunittype" select="'person'"/>
								<xsl:with-param name="stepallottype" select="$stepallottype" />
							</xsl:apply-templates>
						</xsl:for-each>					
					</xsl:when>
					<xsl:when test="$stepunittype='ou'">
					</xsl:when>
					<xsl:when test="$stepunittype='role'">
					</xsl:when>
					<xsl:when test="$stepunittype='mix'">
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$steproutetype='notify'">
				<xsl:choose>
					<xsl:when test="$stepunittype='person'">
					</xsl:when>
					<xsl:when test="$stepunittype='ou'">
					</xsl:when>
					<xsl:when test="$stepunittype='role'">
					</xsl:when>
					<xsl:when test="$stepunittype='mix'">
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$stepunittype='person'">
					</xsl:when>
					<xsl:when test="$stepunittype='ou'">
					</xsl:when>
					<xsl:when test="$stepunittype='role'">
					</xsl:when>
					<xsl:when test="$stepunittype='mix'">
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="person">
		<xsl:param name="idxdivision"/><xsl:param name="idxstep"/><xsl:param name="idxstepdisp"/><xsl:param name="idxou"/><xsl:param name="idxoudisp"/><xsl:param name="cntou"/><xsl:param name="idxperson"/><xsl:param name="cntperson"/>
		<xsl:param name="steproutetype"/><xsl:param name="stepunittype"/><xsl:param name="parentunittype"/>
		<xsl:variable name="index">
			<xsl:number value="$idxdivision" format="01"/>
			<xsl:text>.</xsl:text>
			<xsl:number value="$idxstepdisp" format="01"/>
			<xsl:if test="$cntou>1">.<xsl:number value="$idxoudisp" format="01"/></xsl:if>
			<xsl:if test="$cntperson>1">.<xsl:number value="$idxperson - cfxsl:countHidden(.)" format="01"/></xsl:if>
		</xsl:variable>
		<xsl:if test="not(taskinfo/@visible='n')">
			<xsl:call-template name="htmlrow">
				<xsl:with-param name="steproutetype" select="$steproutetype"/>
				<xsl:with-param name="stepunittype" select="$stepunittype"/>
				<xsl:with-param name="parentunittype" select="$parentunittype"/>
				<xsl:with-param name="itemid" select="concat('division[',number($idxdivision)-1,']/step[',number($idxstep)-1,']/ou[',number($idxou)-1,']/(person|role)[',number($idxperson)-1,']')"/>
				<xsl:with-param name="index" select="$index"/>
				<xsl:with-param name="displayname" select="string(@name)"/>
				<xsl:with-param name="title" select="string(@title)"/>				
				<xsl:with-param name="level" select="string(@position)"/>				
				<xsl:with-param name="itemtaskinfo" select="taskinfo"/>
				<xsl:with-param name="oudisplayname" select="string(@ouname)"/>
				<xsl:with-param name="person_code"  select="string(@code)" />
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

	<xsl:template match="role">
		<xsl:param name="idxdivision"/><xsl:param name="idxstep"/><xsl:param name="idxstepdisp"/><xsl:param name="idxou"/><xsl:param name="idxoudisp"/><xsl:param name="cntou"/><xsl:param name="idxperson"/><xsl:param name="cntperson"/>
		<xsl:param name="steproutetype"/><xsl:param name="stepunittype"/><xsl:param name="parentunittype"/>
		<xsl:variable name="index">
			<xsl:number value="$idxdivision" format="01"/>
			<xsl:text>.</xsl:text>
			<xsl:number value="$idxstepdisp" format="01"/>
			<xsl:if test="$cntou>1">.<xsl:number value="$idxoudisp" format="01"/></xsl:if>
			<xsl:if test="$cntperson>1">.<xsl:number value="$idxperson - cfxsl:countHidden(.)" format="01"/></xsl:if>
		</xsl:variable>
		<xsl:if test="not(taskinfo/@visible='n')">
			<xsl:call-template name="htmlrow">
				<xsl:with-param name="steproutetype" select="$steproutetype"/>
				<xsl:with-param name="stepunittype" select="$stepunittype"/>
				<xsl:with-param name="parentunittype" select="$parentunittype"/>
				<xsl:with-param name="itemid" select="concat('division[',number($idxdivision)-1,']/step[',number($idxstep)-1,']/ou[',number($idxou)-1,']/(person|role)[',number($idxperson)-1,']')"/>
				<xsl:with-param name="index" select="$index"/>
				<xsl:with-param name="displayname" select="string(@name)"/>
				<xsl:with-param name="title" select="string(@title)"/>				
				<xsl:with-param name="level" select="string(@position)"/>				
				<xsl:with-param name="itemtaskinfo" select="taskinfo"/>
				<xsl:with-param name="oudisplayname" select="string(@ouname)"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

	<xsl:template match="ou">
		<xsl:param name="idxdivision"/><xsl:param name="idxstep"/><xsl:param name="idxstepdisp"/><xsl:param name="idxou"/><xsl:param name="idxoudisp"/><xsl:param name="cntou"/>
		<xsl:param name="steproutetype"/><xsl:param name="stepunittype"/><xsl:param name="parentunittype"/><xsl:param name="stepallottype" />
		<xsl:param name="assureouvisible" select="'false'"/>
		<xsl:value-of select="cfxsl:resetHiddenPersonCount((person|role)[taskinfo/@visible='n'])"/>
		<xsl:variable name="cntvisibleperson"><xsl:number value="count((person|role)[not(taskinfo/@visible='n')])"/></xsl:variable>
		
		<xsl:if test="$cntvisibleperson>0">
			<xsl:for-each select="person|role">
				<xsl:sort select="position()" data-type="number" order="descending"/>
				<xsl:variable name="idxperson"><xsl:number count="person|role" format="01"/></xsl:variable>
				<xsl:variable name="cntperson" select="last()"/>
				<xsl:apply-templates select=".">
				    <xsl:with-param name="idxdivision" select="$idxdivision"/>
					<xsl:with-param name="idxstep" select="$idxstep"/>
					<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
					<xsl:with-param name="idxou" select="$idxou"/>
					<xsl:with-param name="idxoudisp" select="$idxoudisp"/>
					<xsl:with-param name="cntou" select="$cntou"/>
					<xsl:with-param name="idxperson" select="$idxperson"/>
					<xsl:with-param name="cntperson" select="$cntperson"/>
					<xsl:with-param name="steproutetype" select="$steproutetype"/>
					<xsl:with-param name="stepunittype" select="$stepunittype"/>
					<xsl:with-param name="parentunittype" select="'person'"/>
					<xsl:with-param name="stepallottype" select="$stepallottype" />
				</xsl:apply-templates>
			</xsl:for-each>
		</xsl:if>
			
		<xsl:if test="($stepunittype!='person' and $cntvisibleperson=0) or ($cntvisibleperson>0 and $assureouvisible='true')">
			<xsl:variable name="index">
                <xsl:number value="$idxdivision" format="01"/>
                <xsl:text>.</xsl:text>
                <xsl:number value="$idxstepdisp" format="01"/>
				<xsl:if test="$cntou>1">.<xsl:number value="$idxoudisp" format="01"/></xsl:if>
			</xsl:variable>
			<xsl:if test="not(taskinfo/@visible='n')">
				<xsl:call-template name="htmlrow">
					<xsl:with-param name="steproutetype" select="$steproutetype"/>
					<xsl:with-param name="stepunittype" select="$stepunittype"/>
					<xsl:with-param name="parentunittype" select="$parentunittype"/>
					<xsl:with-param name="itemid" select="concat('division[',number($idxdivision)-1,']/step[',number($idxstep)-1,']/ou[',number($idxou)-1,']')"/>
					<xsl:with-param name="index" select="$index"/>
					<xsl:with-param name="displayname" select="string(@name)"/>
					<xsl:with-param name="title" select="string(@none)"/>					
					<xsl:with-param name="level" select="string(@none)"/>
					<xsl:with-param name="itemtaskinfo" select="taskinfo"/>
					<xsl:with-param name="oudisplayname" select="string(@ouname)"/>
				</xsl:call-template>
			</xsl:if>
		</xsl:if>
	</xsl:template>
	
	<xsl:template name="htmlrow" match="*">
		<xsl:param name="steproutetype"/>
		<xsl:param name="stepunittype"/>
		<xsl:param name="parentunittype"/>
		<xsl:param name="itemid"/>
		<xsl:param name="index"/>
		<xsl:param name="displayname"/>
		<xsl:param name="title"/>		
		<xsl:param name="level"/>
		<xsl:param name="itemtaskinfo"/>
		<xsl:param name="oudisplayname"/>
		<xsl:param name="person_code" />
		<xsl:choose>
			<xsl:when test="$viewtype='create'">
				<tr onmousedown="selectRow(null,event)" onmousemove="event_GalTable_onmousemove(null, event)" style="height:25px">
					<xsl:attribute name="id"><xsl:value-of select="$itemid"/></xsl:attribute>
					<td style=" padding-left:10px" nowrap="t">
					<xsl:value-of  disable-output-escaping="yes" select="cfxsl:getDotCountSpace(string($index))" />
					<!--<xsl:value-of select="$index"/>-->
					</td>
					<td nowrap="t"><xsl:value-of  select="cfxsl:splitNameExt($displayname,$lngindex)"/></td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($level,$lngindex)"/></td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($title,$lngindex)"/></td>					
					<td nowrap="t"><xsl:value-of select="cfxsl:convertSignResult(string($itemtaskinfo/@result),string($itemtaskinfo/@kind),string((ancestor::step)/@name))"/></td>
					<td nowrap="t">
                        <xsl:apply-templates select="$itemtaskinfo">
							<xsl:with-param name="steproutetype" select="$steproutetype"/>
                            <xsl:with-param name="stepunittype" select="$stepunittype"/>
							<xsl:with-param name="parentunittype" select="$parentunittype"/>
						</xsl:apply-templates>
					 </td>
					<td nowrap="t"><xsl:value-of  select="cfxsl:splitNameExt($oudisplayname,$lngindex)"/><xsl:text disable-output-escaping="yes"></xsl:text></td>
				</tr>				
			</xsl:when>
			<xsl:when test="$viewtype='read'">
				<tr onmousedown="selectRow(null,event)" style="height:25px">
					<xsl:attribute name="id"><xsl:value-of select="$itemid"/></xsl:attribute>
					<td style=" padding-left:10px" nowrap="t">
					<xsl:value-of  disable-output-escaping="yes" select="cfxsl:getDotCountSpace(string($index))" />
					<!--<xsl:value-of select="$index"/>-->
					</td>
					<td nowrap="t">
						<xsl:value-of  select="cfxsl:splitNameExt($displayname,$lngindex)"/>
					    <% if (this.Page.Application["ContextMenu_USER_YN"].ToString() == "Y")
						{ %>
					    <xsl:if test=" $person_code !='' ">
							<a href="#" onclick="javascript:OpenContextMenu4Approval(this)" class="text02_L"  onmouseout="MM_swapImgRestore()">		
                           <xsl:attribute name="onmouseover">
                           <xsl:text>MM_swapImage('Image</xsl:text>
                           <xsl:value-of select="$itemid" />
                           <xsl:text>','','<%=Session["user_thema"]%>/Covi/Common/icon/icon_writer_on.gif',1)</xsl:text>
                           </xsl:attribute>
    						<xsl:attribute name="person_code"><xsl:value-of select="string($person_code)"/></xsl:attribute>
                           <img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_writer_off.gif" border="0" align="absmiddle" covimode="imgctxmenu">
                           <xsl:attribute name="name">
                                <xsl:text>Image</xsl:text>
                               <xsl:value-of select="$itemid" />
                           </xsl:attribute>
                           <xsl:attribute name="id">
                                <xsl:text>Image</xsl:text>
                               <xsl:value-of select="$itemid" />
                           </xsl:attribute>
                           </img>
		                	</a>					    
					    </xsl:if>
					    <%} %>
					</td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($level,$lngindex)"/> </td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($title,$lngindex)"/> </td>					
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:convertSignResult(string($itemtaskinfo/@result),string($itemtaskinfo/@kind),string((ancestor::step)/@name))"/> </td>
					<td nowrap="t">
						<xsl:apply-templates select="$itemtaskinfo">
							<xsl:with-param name="steproutetype" select="$steproutetype"/>
							<xsl:with-param name="stepunittype" select="$stepunittype"/>
							<xsl:with-param name="parentunittype" select="$parentunittype"/>
						</xsl:apply-templates>
					 </td>
					<td nowrap="t"><xsl:value-of  select="cfxsl:splitNameExt($oudisplayname,$lngindex)"/><xsl:text disable-output-escaping="yes"></xsl:text></td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:formatDate(string($itemtaskinfo/@datecompleted))"/> </td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:formatDate(string($itemtaskinfo/@datereceived))"/> </td>
					<td nowrap="t">
						<xsl:if test="($itemtaskinfo/comment)">
							<xsl:call-template name="displaycomment">
								<xsl:with-param name="itemtaskinfo" select="$itemtaskinfo"/>
								<xsl:with-param name="id" select="$itemid" />
							</xsl:call-template>
						</xsl:if>
						<xsl:text disable-output-escaping="yes"></xsl:text>
					 </td>
				</tr>
			</xsl:when>
			<xsl:when test="$viewtype='change'">
				<tr style="height:25px">
					<xsl:attribute name="id"><xsl:value-of select="$itemid"/></xsl:attribute>
					<xsl:if test="not(taskinfo/@datereceived)"><xsl:attribute name="onmousedown"><xsl:text>selectRow(null, event)</xsl:text></xsl:attribute></xsl:if>
					<td style=" padding-left:10px" nowrap="t">
					<xsl:value-of  disable-output-escaping="yes" select="cfxsl:getDotCountSpace(string($index))" />
						<!--<xsl:value-of select="$index"/>-->
					</td>
					<!--<td nowrap="t"><xsl:value-of select="$displayname"/> </td>-->
					<td nowrap="t"><xsl:value-of  select="cfxsl:splitNameExt($displayname,$lngindex)"/> </td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($level,$lngindex)"/> </td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($title,$lngindex)"/> </td>					
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:convertSignResult(string($itemtaskinfo/@result),string($itemtaskinfo/@kind),string((ancestor::step)/@name))"/> </td>
					<td nowrap="t">
						<xsl:apply-templates select="$itemtaskinfo">
							<xsl:with-param name="steproutetype" select="$steproutetype"/>
							<xsl:with-param name="stepunittype" select="$stepunittype"/>
							<xsl:with-param name="parentunittype" select="$parentunittype"/>
						</xsl:apply-templates>
					 </td>
					<td nowrap="t"><xsl:value-of select="cfxsl:splitNameExt($oudisplayname,$lngindex)"/><xsl:text disable-output-escaping="yes"></xsl:text></td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:formatDate(string($itemtaskinfo/@datecompleted))"/> </td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:formatDate(string($itemtaskinfo/@datereceived))"/> </td>
					<td nowrap="t">
						<xsl:if test="($itemtaskinfo/comment)">
							<xsl:call-template name="displaycomment">
								<xsl:with-param name="itemtaskinfo" select="$itemtaskinfo"/>
								<xsl:with-param name="id" select="$itemid" />
							</xsl:call-template>
						</xsl:if>
						<xsl:text disable-output-escaping="yes"></xsl:text>
					 </td>
				</tr>
			</xsl:when>			
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="displaycomment" match="*">
		<xsl:param name="itemtaskinfo"/>
		<xsl:param name="id" />
		<%--<xsl:variable name="commentkey"><xsl:value-of select="@name"/>_<xsl:value-of select="$itemtaskinfo/@datereceived"/></xsl:variable>--%>
        <xsl:variable name="commentkey"><xsl:value-of select="@name"/>_<xsl:value-of select="$id"/></xsl:variable>		
		<a>
		    <xsl:attribute name="href">
			<!--<xsl:text>javascript:viewComment("</xsl:text><xsl:value-of select="$commentkey"/><xsl:text>")</xsl:text>-->
			<xsl:text>javascript:try{viewComment("</xsl:text><xsl:value-of select="$commentkey"/><xsl:text>");}catch(e){parent.viewComment("</xsl:text><xsl:value-of select="$commentkey"/><xsl:text>");}</xsl:text>
		    </xsl:attribute><%=Resources.Approval.lbl_comment %>
		</a>
		<textarea style="display:none"><xsl:attribute name="id"><xsl:value-of select="$commentkey"/></xsl:attribute><xsl:apply-templates select="$itemtaskinfo/comment"/>
		</textarea><!-- 201107 의견저장수정 div - textarea -->
	</xsl:template>
	
	<xsl:template match="comment"><b><xsl:value-of select="cfxsl:convertSignResult(string(@relatedresult),string(@kind),string((ancestor::step)/@name))"/></b> <xsl:value-of disable-output-escaping="yes" select="cfxsl:formatDate(string(@datecommented))"/>
		<br /><xsl:value-of select="string(.)"/><!-- 201107수정 disable-output-escaping="no" cfxsl:replaceCR()-->
	</xsl:template>
		
	<xsl:template match="taskinfo">
		<xsl:param name="steproutetype"/><xsl:param name="stepunittype"/><xsl:param name="parentunittype"/>
		<xsl:choose>
			<xsl:when test="@datecompleted or $viewtype='read'">
			    <xsl:choose>
			        <xsl:when test="$steproutetype='audit' and $stepunittype='ou'">
					    <xsl:choose>
						    <xsl:when test="(ancestor::person or ancestor::role) and (@kind='normal' or @kind='authorize' or @kind='substitute' or @kind='review' or @kind='skip')">
                			    <xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,string(@customattribute2))"/>
						    </xsl:when>
						    <xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype, string((ancestor::step)/@name))"/></xsl:otherwise>
					    </xsl:choose>
			        </xsl:when>
			        <xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,string((ancestor::step)/@name))"/></xsl:otherwise>
			    </xsl:choose>
			</xsl:when>
            <xsl:when test="string((ancestor::step)/@name) = 'ExtType'">
                <xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype, string((ancestor::step)/@name))"/>
            </xsl:when>
			<xsl:when test="$steproutetype='approve'">
				<xsl:variable name="isLastApvStep" select="cfxsl:isLastApvStep()"/>
				<xsl:choose>
					<xsl:when test="$stepunittype='person' or $stepunittype='role'">
						<xsl:call-template name="statusselector"/>
					</xsl:when>
					<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,'')"/></xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<!--<xsl:when test="$steproutetype='audit'"><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,'')"/></xsl:when>-->
			<xsl:when test="$steproutetype='audit'">
				<xsl:choose>
					<xsl:when test="$stepunittype='ou'">
						<xsl:choose>
							<xsl:when test="(ancestor::person or ancestor::role) and ((ancestor::step)/taskinfo[@status='pending']) and (@kind='normal' or @kind='authorize' or @kind='substitute' or @kind='review' or @kind='skip')  ">
							<!--<xsl:when test="(ancestor::person or ancestor::role) and (@kind='normal' or @kind='authorize' or @kind='substitute' or @kind='review' or @kind='skip')  ">-->
								<xsl:call-template name="statusselector"/>
							</xsl:when>
							<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype, string((ancestor::step)/@name))"/></xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype, string((ancestor::step)/@name))"/></xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<xsl:when test="$steproutetype='review'"><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,'')"/></xsl:when>
			<xsl:when test="$steproutetype='notify'"><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,'')"/></xsl:when>
			<!--<xsl:when test="$steproutetype='assist'"><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,'')"/></xsl:when>-->
			<xsl:when test="$steproutetype='assist'">
				<xsl:choose>
					<xsl:when test="$stepunittype='ou'">
						<xsl:choose>
							<xsl:when test="(ancestor::person or ancestor::role)  and ((ancestor::step)/taskinfo[@status='pending']) and (@kind='normal' or @kind='authorize' or @kind='substitute' or @kind='review' or @kind='skip')">
								<xsl:call-template name="statusselector"/>
							</xsl:when>
							<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,'')"/></xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype, string((ancestor::step)/@name))"/></xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<xsl:when test="$steproutetype='consult'">
				<xsl:choose>
					<xsl:when test="$stepunittype='ou'">
						<xsl:choose>
							<xsl:when test="(ancestor::person or ancestor::role)  and ((ancestor::step)/taskinfo[@status='pending']) and (@kind='normal' or @kind='authorize' or @kind='substitute' or @kind='review' or @kind='skip')">
								<xsl:call-template name="statusselector"/>
							</xsl:when>
							<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,'')"/></xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,'')"/></xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<xsl:when test="$steproutetype='receive'">
				<xsl:choose>
					<xsl:when test="$stepunittype='ou'">
						<xsl:choose>
							<xsl:when test="(ancestor::person or ancestor::role)  and ((ancestor::step)/taskinfo[@status='pending']) and (@kind='normal' or @kind='authorize' or @kind='substitute' or @kind='review' or @kind='skip')">
								<xsl:call-template name="statusselector"/>
							</xsl:when>
							<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,'')"/></xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,'')"/></xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,string((ancestor::step)/@name))"/></xsl:otherwise>
		</xsl:choose>
	</xsl:template>	
	
	<xsl:template name="statusselector" match="*">
		<xsl:choose>
			<xsl:when test="@kind='review'">
				<select style="font-size:9pt;width:80px;height:18px;" onchange="parent.statusChange(event)">
					<option value="review" selected="t"><xsl:value-of select="cfxsl:convertKindToSignType('review','')"/></option>
					<option value="normal"><xsl:value-of select="cfxsl:convertKindToSignType('normal','')"/></option>
				</select>
			</xsl:when>
			<xsl:when test="@kind='authorize'">
				<select style="font-size:9pt;width:80px;height:18px;" onchange="parent.statusChange(event)">
					<option value="authorize" selected="t"><xsl:value-of select="cfxsl:convertKindToSignType('authorize','')"/></option>
					<option value="normal"><xsl:value-of select="cfxsl:convertKindToSignType('normal','')"/></option>
				</select>
			</xsl:when>
			<xsl:when test="@kind='substitute'">
				<select style="font-size:9pt;width:80px;height:18px;" onchange="parent.statusChange(event)">
					<option value="substitute" selected="t"><xsl:value-of select="cfxsl:convertKindToSignType('substitute','')"/></option>
					<option value="normal"><xsl:value-of select="cfxsl:convertKindToSignType('normal','')"/></option>
				</select>
			</xsl:when>
			<xsl:when test="@kind='confidential'">
				<select style="font-size:9pt;width:80px;height:18px;" onchange="parent.statusChange(event)">
					<option value="confidential" selected="t"><xsl:value-of select="cfxsl:convertKindToSignType('confidential','')"/></option>
					<option value="normal"><xsl:value-of select="cfxsl:convertKindToSignType('normal','')"/></option>
				</select>
			</xsl:when>
			<xsl:when test="@kind='normal'">
				<xsl:choose>
					<xsl:when test="(ancestor::person or ancestor::role)  and ((ancestor::step)/taskinfo[@status='pending']) and ((ancestor::step)[@unittype='ou']) ">
                        <select style="font-size:9pt;width:80px;height:18px;" onchange="parent.statusChange(event)">
			                <option value="normal" selected="t"><xsl:value-of select="cfxsl:convertKindToSignType('normal','')"/></option>
			                <xsl:if test="$deputytype='F'" >
			                    <option value="substitute"><xsl:value-of select="cfxsl:convertKindToSignType('substitute','')"/></option>
			                </xsl:if>
			                <option value="authorize"><xsl:value-of select="cfxsl:convertKindToSignType('authorize','')"/></option>
		                </select>							    
					</xsl:when>
					<xsl:otherwise>
                        <select style="font-size:9pt;width:80px;height:18px;" onchange="parent.statusChange(event)">
			                <option value="normal" selected="t"><xsl:value-of select="cfxsl:convertKindToSignType('normal','')"/></option>
		                    <xsl:if test="$deputytype='F'" >
			                    <option value="substitute"><xsl:value-of select="cfxsl:convertKindToSignType('substitute','')"/></option>
			                </xsl:if>			                
			                <option value="authorize"><xsl:value-of select="cfxsl:convertKindToSignType('authorize','')"/></option>
                            <option value="review"><xsl:value-of select="cfxsl:convertKindToSignType('review','')"/></option>
                          <!-- 
			                <option value="substitute"><xsl:value-of select="cfxsl:convertKindToSignType('substitute','')"/></option>
			                <option value="skip"><xsl:value-of select="cfxsl:convertKindToSignType('skip','')"/></option>
                            <option value="confidential"><xsl:value-of select="cfxsl:convertKindToSignType('confidential','')"/></option>
                            <option value="conveyance"><xsl:value-of select="cfxsl:convertKindToSignType('conveyance','')"/></option>
                          -->
		                </select>							    
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),'person','approve','person','')"/></xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>