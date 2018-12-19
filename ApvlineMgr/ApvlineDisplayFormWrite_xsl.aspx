<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApvlineDisplayFormWrite_xsl.aspx.cs" Inherits="COVIFlowNet_ApvlineMgr_ApvlineDisplay_xsl" %><?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    xmlns:cfxsl="urn:cfxsl"
    xmlns:cfutil="urn:cfxsl">

	<xsl:param name="viewtype">create</xsl:param>
	<xsl:param name="currentroutetype">approve</xsl:param>
	<xsl:param name="scPCoo">0</xsl:param>
	<xsl:param name="scPAgr">0</xsl:param>
	<xsl:param name="scPAdt">0</xsl:param>
	<xsl:param name="scPRec">0</xsl:param>
	<xsl:param name="scPReview">0</xsl:param>
	<xsl:param name="lngindex">0</xsl:param>
	<xsl:template match="/">
		<xsl:value-of select="cfxsl:resetHiddenStepCount(steps/division/step[taskinfo/@visible='n'])"/>
		<xsl:variable name="displaylog">false</xsl:variable>
        <table border="0" cellpadding="0" cellspacing="0">
            <tr align="right">
                <td with="250"><xsl:text disable-output-escaping="yes">&#160;</xsl:text></td>
                <td id="btAPVAdd" name="cbBTN"  onclick="doFormButtonAction(this);"><a href="#" class="Btn02"><span><%= Resources.Approval.btn_add  %></span></a></td>
                <td><xsl:text disable-output-escaping="yes">&#160;</xsl:text></td>
                <td id="btAPVDelete" name="cbBTN" onclick="doFormButtonAction(this);" ><a href="#" class="Btn02"><span><%= Resources.Approval.btn_delete %></span></a></td>
                <td><xsl:text disable-output-escaping="yes">&#160;</xsl:text></td>
                <td id="btAPVOK" name="cbBTN" onclick="doFormButtonAction(this);" ><a href="#" class="Btn02"><span><%= Resources.Approval.btn_confirm %></span></a></td>
            </tr>
        </table>
		<div class="BTable">
		<table cellpadding="0" cellspacing="0" border="0" width="720" class="BTable" id="APVTable" name="APVTable">
			<thead>
			<xsl:choose>
				<xsl:when test="$viewtype='create'">
			        <tr><td height="2" colspan="10" class="BTable_bg01"></td></tr>
					<tr  class="BTable_bg02" style="height:25px">
						<th  nowrap="t"  width="20" ><xsl:text disable-output-escaping="yes">&#160;</xsl:text></th>
						<th  nowrap="t"  width="50" style="font-family: µ¸¿ò, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;  " ><%= Resources.Approval.lbl_no %></th>
						<th  nowrap="t"  width="70" style="font-family: µ¸¿ò, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;  " ><%= Resources.Approval.lbl_step %></th>
						<th  nowrap="t"  width="50" style="font-family: µ¸¿ò, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;  " ><%= Resources.Approval.lbl_gubun %></th>
						<th  nowrap="t" style="font-family: µ¸¿ò, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;  " ><%= Resources.Approval.lbl_username %></th>
						<th  nowrap="t"  width="70" style="font-family: µ¸¿ò, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;  " ><%= Resources.Approval.lbl_jobposition %></th>						
						<th  nowrap="t"  width="70" style="font-family: µ¸¿ò, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;  " ><%= Resources.Approval.lbl_jobtitle %></th>
						<th  nowrap="t"  width="80" style="font-family: µ¸¿ò, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;  " ><%= Resources.Approval.lbl_state%></th>
						<th  nowrap="t"  width="80" style="font-family: µ¸¿ò, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;  " ><%= Resources.Approval.lbl_kind %></th>
						<th  nowrap="t" style="font-family: µ¸¿ò, Dotum;font-size: 12px;color: #142460; text-align: left; letter-spacing: -0.3pt; text-decoration: none;  " ><%= Resources.Approval.lbl_dept %></th>
					</tr>
					<tr>
						<td height="1" colspan="10" align="center"  class="BTable_bg03"></td>
					</tr>
				</xsl:when>
				<xsl:when test="$viewtype='read'">
			        <tr><td height="2" colspan="10" class="BTable_bg01"></td></tr>
					<tr  class="BTable_bg02" style="height:25px">
						<th nowrap="t"  width="50"><%= Resources.Approval.lbl_no %></th>
						<th nowrap="t"><%= Resources.Approval.lbl_username %></th>
						<th nowrap="t" width="70"><%= Resources.Approval.lbl_jobposition %></th>						
						<th nowrap="t" width="70"><%= Resources.Approval.lbl_jobtitle %></th>
						<th nowrap="t" width="80"><%= Resources.Approval.lbl_state %></th>
						<th nowrap="t" width="80"><%= Resources.Approval.lbl_kind %></th>
						<th nowrap="t" width="90"><%= Resources.Approval.lbl_dept %></th>
						<th nowrap="t" width="100"><%= Resources.Approval.lbl_approvdate %></th>
						<th nowrap="t" width="100"><%= Resources.Approval.lbl_receivedate %></th>
						<th nowrap="t" width="60"><%= Resources.Approval.lbl_comment %></th>
					</tr>
					<tr>
						<td height="1" colspan="10" align="center"  class="BTable_bg03"></td>
					</tr>
				</xsl:when>
				<xsl:when test="$viewtype='change'">
			        <tr><td height="2" colspan="10" class="BTable_bg01"></td></tr>
					<tr  class="BTable_bg02" style="height:25px">
						<th   nowrap="t"   width="50" ><%= Resources.Approval.lbl_no %></th>
						<th   nowrap="t"  ><%= Resources.Approval.lbl_username %></th>
						<th   nowrap="t"   width="70"><%= Resources.Approval.lbl_jobposition %></th>						
						<th   nowrap="t"   width="70"><%= Resources.Approval.lbl_jobtitle %></th>
						<th   nowrap="t"   width="80"><%= Resources.Approval.lbl_state %></th>
						<th   nowrap="t"   width="80"><%= Resources.Approval.lbl_kind %></th>
						<th   nowrap="t"   width="90"><%= Resources.Approval.lbl_dept %></th>
						<th   nowrap="t"   width="100"><%= Resources.Approval.lbl_approvdate %></th>
						<th   nowrap="t"   width="100"><%= Resources.Approval.lbl_receivedate %></th>
						<th   nowrap="t"   width="60"><%= Resources.Approval.lbl_comment %></th>
					</tr>
					<tr>
						<td height="1" colspan="10" align="center"  class="BTable_bg03"></td>
					</tr>
				</xsl:when>
			</xsl:choose>
			</thead>
			<tbody>
			<xsl:for-each select="steps/division">
		        <xsl:sort select="position()" data-type="number" order="ascending"/>
		        <xsl:variable name="idxdivision"><xsl:number value="position()" format="01"/></xsl:variable>
			    <xsl:apply-templates select=".">
					    <xsl:with-param name="idxdivision" select="$idxdivision"/>
					    <xsl:with-param name="divisiontype" select="string(@divisiontype)"/>
				</xsl:apply-templates>
			</xsl:for-each>
			</tbody>
		</table>
		</div>
		<xsl:if test="$displaylog='true'"><div><xsl:value-of select="cfxsl:getLog()"/></div></xsl:if>
	</xsl:template>
    <xsl:template match="division">
		<xsl:param name="idxdivision"/>
		<xsl:param name="divisiontype"/>
		<xsl:for-each select="step">
		    <xsl:sort select="position()" data-type="number" order="ascending"/>
		    <xsl:variable name="idxstep"><xsl:number value="position()" format="01"/></xsl:variable>
		    <xsl:choose>
			    <xsl:when test="taskinfo/@visible='n'"/>
			    <xsl:otherwise>
				    <xsl:apply-templates select=".">
					    <xsl:with-param name="idxdivision" select="$idxdivision"/>
					    <xsl:with-param name="idxstep" select="$idxstep"/>
					    <xsl:with-param name="divisiontype" select="$divisiontype"/>
				    </xsl:apply-templates>
			    </xsl:otherwise>
		    </xsl:choose>
		</xsl:for-each>
    </xsl:template>
	<xsl:template match="step">
		<xsl:param name="idxdivision"/>
		<xsl:param name="idxstep"/>
		<xsl:param name="divisiontype"/>
		<xsl:variable name="idxstepdisp" select="$idxstep - cfxsl:countHidden(.)"/>
		<xsl:variable name="stepunittype" select="string(@unittype)"/>
		<xsl:variable name="steproutetype" select="string(@routetype)"/>
		<xsl:variable name="stepallottype" select="string(@allottype)" />
		<!-- 2007.08 sunny Ãß°¡ -->
		<xsl:value-of select="cfxsl:resetHiddenOuCount(ou[taskinfo/@visible='n'])"/>
		<xsl:value-of select="cfxsl:resetHiddenPersonCount(person[taskinfo/@visible='n'])"/>
		<xsl:choose>
			<xsl:when test="$steproutetype='approve'">
				<xsl:choose>
					<xsl:when test="$stepunittype='person'">
						<xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="ascending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="divisiontype" select="$divisiontype"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="idxperson" select="1"/>
								<xsl:with-param name="cntperson" select="1"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="stepallottype" select="$stepallottype"/>
								<xsl:with-param name="parentunittype" select="'person'"/>
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="$stepunittype='ou'">
					</xsl:when>
					<xsl:when test="$stepunittype='role'">
						<xsl:apply-templates select="ou/role">
							<xsl:with-param name="idxdivision" select="$idxdivision"/>
							<xsl:with-param name="divisiontype" select="$divisiontype"/>
							<xsl:with-param name="idxstep" select="$idxstep"/>
							<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
							<xsl:with-param name="idxou" select="1"/>
							<xsl:with-param name="idxoudisp" select="1 - cfxsl:countHidden(ancestor::ou)"/>
							<xsl:with-param name="cntou" select="1"/>
							<xsl:with-param name="idxperson" select="1"/>
							<xsl:with-param name="cntperson" select="1"/>
							<xsl:with-param name="steproutetype" select="$steproutetype"/>
							<xsl:with-param name="stepunittype" select="$stepunittype"/>
							<xsl:with-param name="stepallottype" select="$stepallottype"/>
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
							<xsl:sort select="position()" data-type="number" order="ascending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="divisiontype" select="$divisiontype"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="idxperson" select="1"/>
								<xsl:with-param name="cntperson" select="1"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
    							<xsl:with-param name="stepallottype" select="$stepallottype"/>
								<xsl:with-param name="parentunittype" select="'person'"/>
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="$stepunittype='ou'">
						<xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="ascending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="divisiontype" select="$divisiontype"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="parentunittype" select="'ou'"/>
    							<xsl:with-param name="stepallottype" select="$stepallottype"/>
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
							<xsl:sort select="position()" data-type="number" order="ascending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="divisiontype" select="$divisiontype"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="idxperson" select="1"/>
								<xsl:with-param name="cntperson" select="1"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="stepallottype" select="$stepallottype"/>
								<xsl:with-param name="parentunittype" select="'person'"/>
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="$stepunittype='ou'">
						<xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="ascending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="divisiontype" select="$divisiontype"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="stepallottype" select="$stepallottype"/>
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
							<xsl:sort select="position()" data-type="number" order="ascending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="divisiontype" select="$divisiontype"/>
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
							<xsl:sort select="position()" data-type="number" order="ascending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="divisiontype" select="$divisiontype"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="stepallottype" select="$stepallottype"/>
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
							<xsl:sort select="position()" data-type="number" order="ascending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="divisiontype" select="$divisiontype"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="idxperson" select="1"/>
								<xsl:with-param name="cntperson" select="1"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="stepallottype" select="$stepallottype"/>
								<xsl:with-param name="parentunittype" select="'person'"/>
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="$stepunittype='ou'">
						<xsl:for-each select="ou">
							<xsl:sort select="position()" data-type="number" order="ascending"/>
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="divisiontype" select="$divisiontype"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstepdisp" select="$idxstepdisp"/>
								<xsl:with-param name="idxou" select="$idxou"/>
								<xsl:with-param name="idxoudisp" select="$idxou - cfxsl:countHidden(.)"/>
								<xsl:with-param name="cntou" select="$cntou"/>
								<xsl:with-param name="steproutetype" select="$steproutetype"/>
								<xsl:with-param name="stepunittype" select="$stepunittype"/>
								<xsl:with-param name="stepallottype" select="$stepallottype"/>
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
		<xsl:param name="steproutetype"/><xsl:param name="stepunittype"/><xsl:param name="parentunittype"/><xsl:param name="divisiontype"/><xsl:param name="stepallottype"/>
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
				<xsl:with-param name="divisiontype" select="$divisiontype"/>
				<xsl:with-param name="stepallottype" select="$stepallottype" />
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

	<xsl:template match="role">
		<xsl:param name="idxdivision"/><xsl:param name="idxstep"/><xsl:param name="idxstepdisp"/><xsl:param name="idxou"/><xsl:param name="idxoudisp"/><xsl:param name="cntou"/><xsl:param name="idxperson"/><xsl:param name="cntperson"/>
		<xsl:param name="steproutetype"/><xsl:param name="stepunittype"/><xsl:param name="parentunittype"/><xsl:param name="divisiontype"/><xsl:param name="stepallottype"/>
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
				<xsl:with-param name="divisiontype" select="$divisiontype"/>
				<xsl:with-param name="stepallottype" select="$stepallottype" />
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

	<xsl:template match="ou">
		<xsl:param name="idxdivision"/><xsl:param name="idxstep"/><xsl:param name="idxstepdisp"/><xsl:param name="idxou"/><xsl:param name="idxoudisp"/><xsl:param name="cntou"/>
		<xsl:param name="steproutetype"/><xsl:param name="stepunittype"/><xsl:param name="parentunittype"/><xsl:param name="divisiontype"/><xsl:param name="stepallottype"/>
		<xsl:param name="assureouvisible" select="'false'"/>
		<xsl:value-of select="cfxsl:resetHiddenPersonCount((person|role)[taskinfo/@visible='n'])"/>
		<xsl:variable name="cntvisibleperson"><xsl:number value="count((person|role)[not(taskinfo/@visible='n')])"/></xsl:variable>
		
		<xsl:if test="$cntvisibleperson>0">
			<xsl:for-each select="person|role">
				<xsl:sort select="position()" data-type="number" order="ascending"/>
				<xsl:variable name="idxperson"><xsl:number count="person|role" format="01"/></xsl:variable>
				<xsl:variable name="cntperson" select="last()"/>
				<xsl:apply-templates select=".">
				    <xsl:with-param name="idxdivision" select="$idxdivision"/>
					<xsl:with-param name="divisiontype" select="$divisiontype"/>
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
					<xsl:with-param name="stepallottype" select="$stepallottype"/>
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
					<xsl:with-param name="divisiontype" select="$divisiontype"/>
    				<xsl:with-param name="stepallottype" select="$stepallottype" />
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
		<xsl:param name="divisiontype"/>
		<xsl:param name="stepallottype"/>
		<xsl:choose>
			<xsl:when test="$viewtype='create'">
				<tr onmousedown="selectRow()" style="height:25px;" >
					<xsl:attribute name="id"><xsl:value-of select="$itemid"/></xsl:attribute>
					<xsl:attribute name="name"><xsl:value-of select="cfxsl:replaceitemid(string($index))"/></xsl:attribute>
					<td>
					    <xsl:choose>
	                        <xsl:when test="$itemtaskinfo/@datereceived">
	                            <xsl:text disable-output-escaping="yes">&#160;</xsl:text>
	                        </xsl:when>
	                        <xsl:when test="$stepunittype='ou'">
	                            <xsl:text disable-output-escaping="yes">&#160;</xsl:text>
	                        </xsl:when>
	                        <xsl:otherwise>
					            <input type="checkbox" id="achk">
					            <xsl:attribute name="name"><xsl:text>achk</xsl:text><xsl:value-of select="cfxsl:replaceitemid(string($index))"/></xsl:attribute>
					            </input>
	                        </xsl:otherwise>
	                    </xsl:choose>
					</td>
					<td nowrap="t">
					<xsl:value-of select="$index"/>
					</td>
					<td nowrap="t">
		                <xsl:call-template name="divisiontypeselector">
        					<xsl:with-param name="index" select="$index"/>
		                </xsl:call-template>
					</td>
					<td nowra="t">
					    <xsl:call-template name="routeselector">
        					<xsl:with-param name="index" select="$index"/>
					    </xsl:call-template>
					</td>
					<td nowrap="t">
					    <xsl:choose>
	                        <xsl:when test="$itemtaskinfo/@datereceived">
        					    <xsl:value-of select="$displayname" />
	                        </xsl:when>
	                        <xsl:when test="$stepunittype='ou'">
        					    <xsl:value-of select="$displayname" />
	                        </xsl:when>
	                        <xsl:otherwise>
					            <input type="text" id="atext" size="6">
					            <xsl:attribute name="name"><xsl:text>aname</xsl:text><xsl:value-of select="cfxsl:replaceitemid(string($index))" /></xsl:attribute>
					            <xsl:attribute name="onKeyUp"><xsl:text>if (event.keyCode==13) formapvdynamicsearch(this)</xsl:text></xsl:attribute>
					            <xsl:attribute name="value"><xsl:value-of select="$displayname" /></xsl:attribute>
					            </input>
	                        </xsl:otherwise>
					    </xsl:choose>
					</td>
					<td nowrap="t">
					    <xsl:attribute name="id"><xsl:text>tcol1</xsl:text><xsl:value-of select="cfxsl:replaceitemid(string($index))"  /></xsl:attribute>
					    <xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($level)"/>
					</td>
					<td nowrap="t">
    					<xsl:attribute name="id"><xsl:text>tcol2</xsl:text><xsl:value-of select="cfxsl:replaceitemid(string($index))"  /></xsl:attribute>
					    <xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($title)"/>
					</td>					
					<td nowrap="t"><xsl:value-of select="cfxsl:convertSignResult(string($itemtaskinfo/@result),string($itemtaskinfo/@kind), '')"/></td>
					<td nowrap="t">
                        <xsl:apply-templates select="$itemtaskinfo">
							<xsl:with-param name="steproutetype" select="$steproutetype"/>
                            <xsl:with-param name="stepunittype" select="$stepunittype"/>
							<xsl:with-param name="parentunittype" select="$parentunittype"/>
							<xsl:with-param name="divisiontype"  select="$divisiontype"/>
							<xsl:with-param name="stepallottype"  select="$stepallottype"/>
						</xsl:apply-templates>
					 </td>
					<td nowrap="t">
                        <input type="hidden" id="aData" >
	                    <xsl:attribute name="name"><xsl:text>aDataDESC</xsl:text><xsl:value-of select="cfxsl:replaceitemid(string($index))" /></xsl:attribute>
	                    </input>					    
					    <xsl:choose>
                            <xsl:when test="$stepunittype='ou'">
                                <xsl:value-of select="$oudisplayname"/><xsl:text disable-output-escaping="yes">&#160;</xsl:text>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:choose>
                                    <xsl:when test="$itemtaskinfo/@datereceived">
                                        <xsl:value-of select="$oudisplayname"/><xsl:text disable-output-escaping="yes">&#160;</xsl:text>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <input type="text" id="atext2" >
                                        <xsl:attribute name="name"><xsl:text>adeptname</xsl:text><xsl:value-of select="cfxsl:replaceitemid(string($index))" /></xsl:attribute>
                                        <xsl:attribute name="onKeyUp"><xsl:text>if (event.keyCode==13) formapvdynamicsearch(this)</xsl:text></xsl:attribute>
                                        <xsl:attribute name="value"><xsl:value-of select="$oudisplayname" /></xsl:attribute>
                                        </input>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:otherwise>
	                     </xsl:choose>
					</td>
				</tr>
				
			</xsl:when>
			<xsl:when test="$viewtype='read'">
				<tr onmousedown="selectRow()" style="height:25px;" >
					<xsl:attribute name="id"><xsl:value-of select="$itemid"/></xsl:attribute>
					<td nowrap="t"><xsl:value-of select="$index"/> </td>
					<td nowrap="t"><xsl:value-of select="cfxsl:splitNameExt($displayname,$lngindex)"/> </td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($level,$lngindex)"/> </td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($title,$lngindex)"/> </td>					
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:convertSignResult(string($itemtaskinfo/@result),string($itemtaskinfo/@kind),'')"/> </td>
					<td nowrap="t">
						<xsl:apply-templates select="$itemtaskinfo">
							<xsl:with-param name="steproutetype" select="$steproutetype"/>
							<xsl:with-param name="stepunittype" select="$stepunittype"/>
							<xsl:with-param name="parentunittype" select="$parentunittype"/>
						</xsl:apply-templates>
					 </td>
					<td nowrap="t"><xsl:value-of select="cfxsl:splitNameExt($oudisplayname,$lngindex)"/><xsl:text disable-output-escaping="yes">&#160;</xsl:text></td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:formatDate(string($itemtaskinfo/@datecompleted))"/> </td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:formatDate(string($itemtaskinfo/@datereceived))"/> </td>
					<td nowrap="t">
						<xsl:if test="($itemtaskinfo/comment)">
							<xsl:call-template name="displaycomment">
								<xsl:with-param name="itemtaskinfo" select="$itemtaskinfo"/>
								<xsl:with-param name="id" select="$itemid" />
							</xsl:call-template>
						</xsl:if>
						<xsl:text disable-output-escaping="yes">&#160;</xsl:text>
					 </td>
				</tr>
			</xsl:when>
			<xsl:when test="$viewtype='change'">
				<tr  style="height:25px;" >
					<xsl:attribute name="id"><xsl:value-of select="$itemid"/></xsl:attribute>
					<xsl:if test="not(taskinfo/@datereceived)"><xsl:attribute name="onmousedown"><xsl:text>selectRow()</xsl:text></xsl:attribute></xsl:if>
					<td height="20" align="left" nowrap="t"><xsl:value-of select="$index"/> </td>
					<td nowrap="t"><xsl:value-of select="cfxsl:splitNameExt($displayname,$lngindex)"/> </td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($level,$lngindex)"/> </td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($title,$lngindex)"/> </td>					
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:convertSignResult(string($itemtaskinfo/@result),string($itemtaskinfo/@kind),'')"/> </td>
					<td nowrap="t">
						<xsl:apply-templates select="$itemtaskinfo">
							<xsl:with-param name="steproutetype" select="$steproutetype"/>
							<xsl:with-param name="stepunittype" select="$stepunittype"/>
							<xsl:with-param name="parentunittype" select="$parentunittype"/>
						</xsl:apply-templates>
					 </td>
					<td nowrap="t"><xsl:value-of select="cfxsl:splitNameExt($oudisplayname,$lngindex)"/><xsl:text disable-output-escaping="yes">&#160;</xsl:text></td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:formatDate(string($itemtaskinfo/@datecompleted))"/> </td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:formatDate(string($itemtaskinfo/@datereceived))"/> </td>
					<td nowrap="t">
						<xsl:if test="($itemtaskinfo/comment)">
							<xsl:call-template name="displaycomment">
								<xsl:with-param name="itemtaskinfo" select="$itemtaskinfo"/>
								<xsl:with-param name="id" select="$itemid" />
							</xsl:call-template>
						</xsl:if>
						<xsl:text disable-output-escaping="yes">&#160;</xsl:text>
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
			<xsl:text>javascript:viewComment("</xsl:text><xsl:value-of select="$commentkey"/><xsl:text>")</xsl:text>
		    </xsl:attribute>
		</a>
		<div style="display:none"><xsl:attribute name="id"><xsl:value-of select="$commentkey"/></xsl:attribute><xsl:apply-templates select="$itemtaskinfo/comment"/>
		</div>
	</xsl:template>
	
	<xsl:template match="comment"><b><xsl:value-of select="cfxsl:convertSignResult(string(@relatedresult),string(@kind),'')"/></b> <xsl:value-of disable-output-escaping="yes" select="cfxsl:formatDate(string(@datecommented))"/>
		<br><xsl:value-of disable-output-escaping="yes" select="cfxsl:replaceCR(string(.))"/></br>
	</xsl:template>
		
	<xsl:template match="taskinfo">
		<xsl:param name="steproutetype"/><xsl:param name="stepunittype"/><xsl:param name="parentunittype"/><xsl:param name="divisiontype"/><xsl:param name="stepallottype"/>
        <xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype,string((ancestor::step)/@name))"/>
	</xsl:template>	
	
	<xsl:template name="statusselector" match="*">
		<xsl:choose>
			<xsl:when test="@kind='review'">
				<select style="font-size:9pt;width:80;height:18;" onchange="parent.statusChange()">
					<option value="review" selected="t"><xsl:value-of select="cfxsl:convertKindToSignType('review')"/></option>
					<option value="normal"><xsl:value-of select="cfxsl:convertKindToSignType('normal')"/></option>
				</select>
			</xsl:when>
			<xsl:when test="@kind='authorize'">
				<select style="font-size:9pt;width:80;height:18;" onchange="parent.statusChange()">
					<option value="authorize" selected="t"><xsl:value-of select="cfxsl:convertKindToSignType('authorize')"/></option>
					<option value="normal"><xsl:value-of select="cfxsl:convertKindToSignType('normal')"/></option>
				</select>
			</xsl:when>
			<xsl:when test="@kind='substitute'">
				<select style="font-size:9pt;width:80;height:18;" onchange="parent.statusChange()">
					<option value="substitute" selected="t"><xsl:value-of select="cfxsl:convertKindToSignType('substitute')"/></option>
					<option value="normal"><xsl:value-of select="cfxsl:convertKindToSignType('normal')"/></option>
				</select>
			</xsl:when>
			<xsl:when test="@kind='confidential'">
				<select style="font-size:9pt;width:80;height:18;" onchange="parent.statusChange()">
					<option value="confidential" selected="t"><xsl:value-of select="cfxsl:convertKindToSignType('confidential')"/></option>
					<option value="normal"><xsl:value-of select="cfxsl:convertKindToSignType('normal')"/></option>
				</select>
			</xsl:when>
			<xsl:when test="@kind='normal'">
				<xsl:choose>
					<xsl:when test="(ancestor::person or ancestor::role)  and ((ancestor::step)/taskinfo[@status='pending']) and ((ancestor::step)[@unittype='ou']) ">
                        <select style="font-size:9pt;width:80;height:18;" onchange="parent.statusChange()">
			                <option value="normal" selected="t"><xsl:value-of select="cfxsl:convertKindToSignType('normal')"/></option>
			                <option value="authorize"><xsl:value-of select="cfxsl:convertKindToSignType('authorize')"/></option>
		                </select>							    
					</xsl:when>
					<xsl:otherwise>
                        <select style="font-size:9pt;width:80;height:18;" onchange="parent.statusChange()">
			                <option value="normal" selected="t"><xsl:value-of select="cfxsl:convertKindToSignType('normal')"/></option>
			                <option value="authorize"><xsl:value-of select="cfxsl:convertKindToSignType('authorize')"/></option>
                            <option value="review"><xsl:value-of select="cfxsl:convertKindToSignType('review')"/></option>
                          <!-- 
			                <option value="substitute"><xsl:value-of select="cfxsl:convertKindToSignType('substitute')"/></option>
			                <option value="skip"><xsl:value-of select="cfxsl:convertKindToSignType('skip')"/></option>
                            <option value="confidential"><xsl:value-of select="cfxsl:convertKindToSignType('confidential')"/></option>
                            <option value="conveyance"><xsl:value-of select="cfxsl:convertKindToSignType('conveyance')"/></option>
                          -->
		                </select>							    
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),'person','approve','person')"/></xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="divisiontypeselector" match="*">
		<xsl:param name="index"/>
	    <xsl:choose>
	        <xsl:when test="(ancestor::step)/@unittype='ou'">
	            <xsl:value-of select="cfxsl:convertDivisionType(string((ancestor::division)/@divisiontype))"/>
	            <input type="hidden" id="aSELdivision">
                    <xsl:attribute name="name"><xsl:text>adivisiontype</xsl:text><xsl:value-of select="cfxsl:replaceitemid(string($index))" /></xsl:attribute>
                    <xsl:attribute name="value"><xsl:value-of select="string((ancestor::division)/@divisiontype)" /></xsl:attribute>
	            </input>
	        </xsl:when>
	        <xsl:otherwise>
	            <xsl:choose>
	                <xsl:when test="taskinfo/@datereceived">
	                    <xsl:value-of select="cfxsl:convertDivisionType(string((ancestor::division)/@divisiontype))"/>
	                    <input type="hidden" id="aSELdivision">
                            <xsl:attribute name="name"><xsl:text>adivisiontype</xsl:text><xsl:value-of select="cfxsl:replaceitemid(string($index))" /></xsl:attribute>
                            <xsl:attribute name="value"><xsl:value-of select="string((ancestor::division)/@divisiontype)" /></xsl:attribute>
	                    </input>
	                </xsl:when>
	                <xsl:otherwise>
                        <select id="aSELdivision">
                            <xsl:attribute name="style"><xsl:text>font-size:9pt;width:80;height:18;</xsl:text></xsl:attribute>
                            <xsl:attribute name="onchange"><xsl:text>divisiontypeChange(this)</xsl:text></xsl:attribute>
                            <xsl:attribute name="name"><xsl:text>adivisiontype</xsl:text><xsl:value-of select="cfxsl:replaceitemid(string($index))" /></xsl:attribute>
	                        <xsl:choose>
                                <xsl:when test="(ancestor::division)[@divisiontype='send']">
                                        <option value="send" selected="t"><%=Resources.Approval.lbl_send %></option>
                                        <option value="receive"><%=Resources.Approval.lbl_receive %></option>
                                </xsl:when>
                                <xsl:otherwise>
                                        <option value="send" ><%=Resources.Approval.lbl_send %></option>
                                        <option value="receive" selected="t"><%=Resources.Approval.lbl_receive %></option>
                                </xsl:otherwise>
	                        </xsl:choose>
                        </select>
	                </xsl:otherwise>
	            </xsl:choose>
	        </xsl:otherwise>
	    </xsl:choose>
	</xsl:template>
<xsl:template name="routeselector" match="*">
		<xsl:param name="index"/>
	    <xsl:choose>
	        <xsl:when test="(ancestor::step)/@unittype='ou'">
	            <xsl:value-of select="cfxsl:convertRouteType(string((ancestor::step)/@routetype))"/>
	            <input type="hidden" id="aSELroutetype">
                    <xsl:attribute name="name"><xsl:text>aroutetype</xsl:text><xsl:value-of select="cfxsl:replaceitemid(string($index))" /></xsl:attribute>
                    <xsl:attribute name="value"><xsl:value-of select="string((ancestor::step)/@routetype)" /></xsl:attribute>
	            </input>
	        </xsl:when>
	        <xsl:otherwise>
	        <xsl:choose>
	                <xsl:when test="taskinfo/@datereceived">
	                    <xsl:value-of select="cfxsl:convertRouteType(string((ancestor::step)/@routetype))"/>
	                    <input type="hidden" id="aSELroutetype">
                            <xsl:attribute name="name"><xsl:text>aroutetype</xsl:text><xsl:value-of select="cfxsl:replaceitemid(string($index))" /></xsl:attribute>
                            <xsl:attribute name="value"><xsl:value-of select="string((ancestor::step)/@routetype)" /></xsl:attribute>
	                    </input>
	                </xsl:when>
	                <xsl:otherwise>
                        <select id="aSELroutetype">
                            <xsl:attribute name="style"><xsl:text>font-size:9pt;width:80;height:18;</xsl:text></xsl:attribute>
                            <xsl:attribute name="onchange"><xsl:text>routetypeChange()</xsl:text></xsl:attribute>
                            <xsl:attribute name="name"><xsl:text>aroutetype</xsl:text><xsl:value-of select="cfxsl:replaceitemid(string($index))" /></xsl:attribute>
                            <xsl:choose>
	                        <xsl:when test="(ancestor::step)[@routetype='approve']">
	                                <option value="approve" selected="t"><%=Resources.Approval.lbl_normalapprove %></option>
	                                <xsl:if test="$scPCoo='1'"><option value="assist"><%=Resources.Approval.lbl_assist %></option></xsl:if>
	                                <xsl:if test="$scPAgr='1'"><option value="consult"><%=Resources.Approval.lbl_consent%></option></xsl:if>
	                                <xsl:if test="$scPAdt='1'"><option value="audit"><%=Resources.Approval.lbl_audit %></option></xsl:if>
	                                <xsl:if test="$scPReview='1'"><option value="review"><%=Resources.Approval.lbl_PublicInspect %></option></xsl:if>
	                                <!--<option value="receive"><%=Resources.Approval.lbl_receive %></option>-->
	                        </xsl:when>
	                        <xsl:when test="(ancestor::step)[@routetype='assist']">
	                                <option value="approve" ><%=Resources.Approval.lbl_normalapprove %></option>
	                                <option value="assist" selected="t"><%=Resources.Approval.lbl_assist %></option>
	                                <xsl:if test="$scPAgr='1'"><option value="consult"><%=Resources.Approval.lbl_consent%></option></xsl:if>
	                                <xsl:if test="$scPAdt='1'"><option value="audit"><%=Resources.Approval.lbl_audit %></option></xsl:if>
	                                <xsl:if test="$scPReview='1'"><option value="review"><%=Resources.Approval.lbl_PublicInspect %></option></xsl:if>
	                                <!--<option value="receive"><%=Resources.Approval.lbl_receive %></option>-->
	                        </xsl:when>
	                        <xsl:when test="(ancestor::step)[@routetype='consult']">
	                                <option value="approve" ><%=Resources.Approval.lbl_normalapprove %></option>
	                                <xsl:if test="$scPCoo='1'"><option value="assist"><%=Resources.Approval.lbl_assist %></option></xsl:if>
	                                <option value="consult" selected="t"><%=Resources.Approval.lbl_consent %></option>
	                                <xsl:if test="$scPAdt='1'"><option value="audit"><%=Resources.Approval.lbl_audit %></option></xsl:if>
	                                <xsl:if test="$scPReview='1'"><option value="review"><%=Resources.Approval.lbl_PublicInspect %></option></xsl:if>
	                                <!--<option value="receive"><%=Resources.Approval.lbl_receive %></option>-->
	                        </xsl:when>
	                        <xsl:when test="(ancestor::step)[@routetype='audit']">
	                                <option value="approve" ><%=Resources.Approval.lbl_normalapprove %></option>
	                                <xsl:if test="$scPCoo='1'"><option value="assist"><%=Resources.Approval.lbl_assist %></option></xsl:if>
	                                <xsl:if test="$scPAgr='1'"><option value="consult"><%=Resources.Approval.lbl_consent%></option></xsl:if>
	                                <option value="audit" selected="t"><%=Resources.Approval.lbl_audit %></option>
	                                <xsl:if test="$scPReview='1'"><option value="review"><%=Resources.Approval.lbl_PublicInspect %></option></xsl:if>
	                                <!--<option value="receive"><%=Resources.Approval.lbl_receive %></option>-->
	                        </xsl:when>
	                        <xsl:when test="(ancestor::step)[@routetype='review']">
	                                <option value="approve" ><%=Resources.Approval.lbl_normalapprove %></option>
	                                <xsl:if test="$scPCoo='1'"><option value="assist"><%=Resources.Approval.lbl_assist %></option></xsl:if>
	                                <xsl:if test="$scPAgr='1'"><option value="consult"><%=Resources.Approval.lbl_consent%></option></xsl:if>
	                                <xsl:if test="$scPAdt='1'"><option value="audit"><%=Resources.Approval.lbl_audit %></option></xsl:if>
	                                <option value="review" selected="t"><%=Resources.Approval.lbl_PublicInspect%></option>
	                                <!--<option value="receive"><%=Resources.Approval.lbl_receive %></option>-->
	                        </xsl:when>	                        
	                        <xsl:when test="(ancestor::step)[@routetype='receive']">
	                                <!--<option value="approve" ><%=Resources.Approval.lbl_normalapprove %></option>
	                                <option value="assist"><%=Resources.Approval.lbl_assist %></option>
	                                <option value="consult"><%=Resources.Approval.lbl_consent %></option>
	                                <option value="audit"><%=Resources.Approval.lbl_audit %></option>-->
	                                <option value="receive" selected="t"><%=Resources.Approval.lbl_receive %></option>
	                        </xsl:when>
	                        <xsl:otherwise>
	                                <option value="approve" ><%=Resources.Approval.lbl_normalapprove %></option>
	                                <xsl:if test="$scPCoo='1'"><option value="assist"><%=Resources.Approval.lbl_assist %></option></xsl:if>
	                                <xsl:if test="$scPAgr='1'"><option value="consult"><%=Resources.Approval.lbl_consent%></option></xsl:if>
	                                <xsl:if test="$scPAdt='1'"><option value="audit"><%=Resources.Approval.lbl_audit %></option></xsl:if>
	                                <xsl:if test="$scPRec='1'"><option value="audit"><%=Resources.Approval.lbl_receive %></option></xsl:if>
	                                <xsl:if test="$scPReview='1'"><option value="review"><%=Resources.Approval.lbl_PublicInspect %></option></xsl:if>
	                        </xsl:otherwise>
	                        </xsl:choose>	    
	                    </select>
	                </xsl:otherwise>
        	    </xsl:choose>
	        </xsl:otherwise>
	    </xsl:choose>
	</xsl:template>	
</xsl:stylesheet>