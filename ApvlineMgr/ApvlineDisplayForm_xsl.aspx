<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApvlineDisplayForm_xsl.aspx.cs" Inherits="COVIFlowNet_ApvlineMgr_ApvlineDisplayForm_xsl" %><?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow"
    xmlns:cfutil="http://www.covision.co.kr/xslt/coviflow/util">

	<xsl:param name="viewtype">create</xsl:param>
	<xsl:param name="currentroutetype">approve</xsl:param>
	<msxsl:script language="VBScript" implements-prefix="cfutil">
	<![CDATA[
Function vbTypeName(o)
	vbTypeName = TypeName(o)
End Function
	]]>
	</msxsl:script>
	<msxsl:script language="JScript" implements-prefix="cfxsl">
	<![CDATA[
//에러난 위치에 16을 더하면 xsl 전체에서의 위치가 됨.
var m_log="LOG=";
var m_cntHiddenPerson=0;
var m_cntHiddenOu=0;
var m_cntHiddenGroup=0;
var m_cntHiddenStep=0;
var m_cntApvStep=0;

function log(v){m_log+=" #"+v;}
function getLog(){return m_log;}

function resetHiddenPersonCount(oNodeList){
log("rhpc"+oNodeList.length);
	m_cntHiddenPerson=oNodeList.length;return "";
}
function resetHiddenOuCount(oNodeList){
log("rhoc"+oNodeList.length);
	m_cntHiddenOu=oNodeList.length;return "";
}
function resetHiddenStepCount(oNodeList){
log("rhsc"+oNodeList.length);
	m_cntHiddenStep=oNodeList.length;return "";
}
function countHidden(oNodeList){
	if(oNodeList.length==0) return 0;

	var oNode = oNodeList.nextNode()
	var sName = oNode.nodeName;
	var oTI = oNode.selectSingleNode("taskinfo[@visible='n']");
	switch(sName){
		case "step":if(oTI!=null)m_cntHiddenStep--;log("chs"+m_cntHiddenStep);return m_cntHiddenStep;break;
		case "ou":if(oTI!=null)m_cntHiddenOu--;log("cho"+m_cntHiddenOu);return m_cntHiddenOu;break;
		case "role":
		case "person":if(oTI!=null)m_cntHiddenPerson--;log("chp"+m_cntHiddenPerson);return m_cntHiddenPerson;break;
		case "group":if(oTI!=null)m_cntHiddenGroup--;log("chg"+m_cntHiddenGroup);return m_cntHiddenGroup;break;
	}
}
function formatDate(sDate){
	if(sDate=="")return "&nbsp;";
	var dtDate = new Date(sDate.replace(/-/g,"/").replace(/오후/,"pm").replace(/오전/,"am"));
	return dtDate.getYear()+"-"+dblDigit(dtDate.getMonth()+1)+"-"+dblDigit(dtDate.getDate())+" "+dblDigit(dtDate.getHours())+":"+dblDigit(dtDate.getMinutes());//+":"+dblDigit(dtDate.getSeconds());
	//return sDate;
}
function dblDigit(iVal){return (iVal<10?"0"+iVal:iVal);}
function isLastApvStep(){
	return (m_cntApvStep++==0?true:false);
}
function splitName(sValue){
	var sName=sValue.substr(sValue.lastIndexOf(";")+1);
	return sName==""?"&nbsp;":sName;
}
		function convertKindToSignTypeByRTnUT(sKind,sParentUT,sRT,sUT){
		log("kind:"+sKind+"|"+sParentUT+"|"+sRT+"|"+sUT);
			var sSignType="&nbsp;";
			switch(sRT){
				case "receive":
					switch(sUT){
						case "ou":
							switch(sParentUT){
								case "ou":sSignType="<%= Resources.Approval.lbl_ChargeDept %>";break;
								case "person":sSignType=convertKindToSignType(sKind) ;break;
							}break;
						case "role":
						case "person":
							sSignType="<%= Resources.Approval.lbl_receive %>";break;
						case "group":
							sSignType="<%= Resources.Approval.lbl_receive %>";break;
					}break;
				case "consult":
					switch(sUT){
						case "ou":
							switch(sParentUT){
								case "ou":sSignType="<%= Resources.Approval.lbl_DeptConsent %>";break;
								case "role":
								case "person":sSignType=convertKindToSignType(sKind) ;break;
							}break;
						case "role":
						case "person":
							sSignType="<%= Resources.Approval.lbl_PersonConsent %>";break;
					}break;
				case "assist":
					switch(sUT){
						case "ou":
							switch(sParentUT){
								case "ou":sSignType="<%= Resources.Approval.lbl_DeptAssist %>";break;
								case "role":
								case "person":sSignType=convertKindToSignType(sKind) ;break;
							}break;
						case "role":
						case "person":
							sSignType="<%= Resources.Approval.lbl_assist %>";break;
					}break;
				case "audit":
					switch(sUT){
						case "ou":
							switch(sParentUT){
								case "ou":sSignType="<%= Resources.Approval.lbl_audit_finance %>";break;
								case "role":
								case "person":sSignType=convertKindToSignType(sKind) ;break;
							}break;
						case "role":
						case "person":
							sSignType="<%= Resources.Approval.lbl_audit_daily %>";break;
					}break;
				case "review":
					sSignType="<%= Resources.Approval.lbl_PublicInspect %>";break;
				case "notify":
					sSignType="<%= Resources.Approval.lbl_SendInfo %>";break;
				case "approve":
					switch(sUT){
						case "role":
						case "person":
							sSignType=convertKindToSignType(sKind) ;break;
						case "ou":
							sSignType="<%= Resources.Approval.lbl_DeptApprv %>";break;
					}break;
			}
			return sSignType;
		}
		function convertKindToSignType(sKind){
			var sSignType;
			switch(sKind){
				case "normal":
					sSignType = "<%= Resources.Approval.lbl_normalapprove %>";break;
				case "consent":
					sSignType = "<%= Resources.Approval.lbl_investigation %>";break;
				case "authorize":
					sSignType = "<%= Resources.Approval.lbl_authorize %>";break;
				case "substitute":
					sSignType = "<%= Resources.Approval.lbl_substitue %>";break;
				case "review":
					sSignType = "<%= Resources.Approval.lbl_review %>";break;
				case "bypass":
					sSignType = "<%= Resources.Approval.lbl_bypass %>";break;
				case "charge":
					sSignType = "<%= Resources.Approval.lbl_charge %>";break;
                case "confidential":
                  sSignType = "<%= Resources.Approval.lbl_Confidential %>";break;
                case "conveyance":
                  sSignType = "<%= Resources.Approval.lbl_forward %>";break;
				case "skip":
					sSignType = "<%= Resources.Approval.lbl_NoApprvl %>";break;
				default:
					sSignType = "&nbsp;";break;
			}
			return sSignType;
		}
		function convertSignResult(sResult,sKind){
			var sSignResult;
			switch(sResult){
				case "inactive":
					sSignResult = "<%= Resources.Approval.lbl_inactive %>";break;
				case "pending":
					sSignResult = "<%= Resources.Approval.lbl_inactive %>";break;
				case "reserved":
					sSignResult = "<%= Resources.Approval.lbl_hold %>";break;
				case "completed":
					sSignResult =  (sKind=='charge')?"<%= Resources.Approval.btn_draft %>":"<%= Resources.Approval.lbl_app %>";break;
				case "rejected":
					sSignResult = "<%= Resources.Approval.lbl_reject %>";break;
				case "rejectedto":
					sSignResult = "<%= Resources.Approval.lbl_reject %>";break;
				case "authorized":
					sSignResult = "<%= Resources.Approval.lbl_authorize %>";break;
				case "reviewed":
					sSignResult = "<%= Resources.Approval.lbl_review %>";break;
				case "substituted":
					sSignResult = "<%= Resources.Approval.lbl_substitue %>";break;
				case "agreed":
					sSignResult = "<%= Resources.Approval.lbl_consent %>";break;
				case "disagreed":
					sSignResult = "<%= Resources.Approval.lbl_disagree %>";break;
				case "bypassed":
					sSignResult = "<%= Resources.Approval.lbl_bypass %>";break;
				case "skipped":
					sSignResult = "<%= Resources.Approval.lbl_NoApprvl %>";break;
				default:
					sSignResult = "";break;
			}
			return sSignResult;
		}
        function replaceCR(s){
	        return s.replace(/\n/g,"<br>");
        }
	]]>
	</msxsl:script>
	<xsl:template match="/">
		<xsl:value-of select="cfxsl:resetHiddenStepCount(steps/step[taskinfo/@visible='n'])"/>
		<xsl:variable name="displaylog">false</xsl:variable>
		<table bordercolor='#101010' width='100%' border='0' style='border-collapse: collapse;MARGIN-TOP: 0px;height:100%;' >
			<thead>
				<tr style='background:#D7D7D7'>
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'><%= Resources.Approval.lbl_no %></td>
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'><%= Resources.Approval.lbl_jobtitle %></td>
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'><%= Resources.Approval.lbl_username %></td>
					<!--<td height="20"  align="center" valign="middle"  nowrap="t">직 급</td>-->
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'><%= Resources.Approval.lbl_state%></td>
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'><%= Resources.Approval.lbl_kind %></td>
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'><%= Resources.Approval.lbl_dept %></td>
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'><%= Resources.Approval.lbl_approvdate %></td>
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'><%= Resources.Approval.lbl_receivedate %></td>
				</tr>
			</thead>
			<tbody>
			<xsl:for-each select="steps/division">
		        <%--<xsl:sort select="position()" data-type="number" order="descending"/>--%>
		        <xsl:variable name="idxdivision"><xsl:number value="last()-position()+1" format="01"/></xsl:variable>
			    <xsl:apply-templates select=".">
					    <xsl:with-param name="idxdivision" select="$idxdivision"/>
				</xsl:apply-templates>
			</xsl:for-each>
			</tbody>
		</table>
		<xsl:if test="$displaylog='true'"><div><xsl:value-of select="cfxsl:getLog()"/></div></xsl:if>
	</xsl:template>
    <xsl:template match="division">
		<xsl:param name="idxdivision"/>
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
    </xsl:template>
	<xsl:template match="step">
		<xsl:param name="idxdivision"/>
		<xsl:param name="idxstep"/>
		<xsl:variable name="idxstepdisp" select="$idxstep - cfxsl:countHidden(.)"/>
		<xsl:variable name="stepunittype" select="string(@unittype)"/>
		<xsl:variable name="steproutetype" select="string(@routetype)"/>
		<xsl:value-of select="cfxsl:resetHiddenOuCount(ou[taskinfo/@visible='n'])"/>
		<xsl:value-of select="cfxsl:resetHiddenPersonCount(person[taskinfo/@visible='n'])"/>
		<xsl:choose>
			<xsl:when test="$steproutetype='approve'">
				<xsl:choose>
					<xsl:when test="$stepunittype='person'">
						<xsl:apply-templates select="ou/person">
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
							<!--<xsl:sort select="position()" data-type="number" order="descending"/>-->
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
							<!--<xsl:sort select="position()" data-type="number" order="descending"/>-->
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
							<!--<xsl:sort select="position()" data-type="number" order="descending"/>-->
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
					<%--<xsl:when test="$stepunittype='ou'">
						<xsl:for-each select="ou">
							<!--<xsl:sort select="position()" data-type="number" order="descending"/>-->
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
					</xsl:when>--%>
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
							<!--<xsl:sort select="position()" data-type="number" order="descending"/>-->
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
							<!--<xsl:sort select="position()" data-type="number" order="descending"/>-->
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
							<!--<xsl:sort select="position()" data-type="number" order="descending"/>-->
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
							<!--<xsl:sort select="position()" data-type="number" order="descending"/>-->
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
								<xsl:with-param name="idxdivision" select="$idxdivision"/>
								<xsl:with-param name="idxstep" select="$idxstep"/>
								<xsl:with-param name="idxstep" select="$idxstepdisp"/>
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
			<xsl:number value="$idxstepdisp" format="01"/>
			<xsl:if test="$cntou>1">.<xsl:number value="$idxoudisp" format="01"/></xsl:if>
			<xsl:if test="$cntperson>1">.<xsl:number value="$idxperson - cfxsl:countHidden(.)" format="01"/></xsl:if>
		</xsl:variable>
		<xsl:if test="not(taskinfo/@visible='n')">
			<xsl:call-template name="htmlrow">
				<xsl:with-param name="steproutetype" select="$steproutetype"/>
				<xsl:with-param name="stepunittype" select="$stepunittype"/>
				<xsl:with-param name="parentunittype" select="$parentunittype"/>
				<xsl:with-param name="itemid" select="concat('step[',number($idxstep)-1,']/ou[',number($idxou)-1,']/(person|role)[',number($idxperson)-1,']')"/>
				<xsl:with-param name="index" select="$index"/>
				<xsl:with-param name="displayname" select="string(@name)"/>
				<xsl:with-param name="title" select="string(@title)"/>				
				<xsl:with-param name="level" select="string(@level)"/>
				<xsl:with-param name="itemtaskinfo" select="taskinfo"/>
				<xsl:with-param name="oudisplayname" select="string(@ouname)"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

	<xsl:template match="role">
		<xsl:param name="idxdivision"/><xsl:param name="idxstep"/><xsl:param name="idxstepdisp"/><xsl:param name="idxou"/><xsl:param name="idxoudisp"/><xsl:param name="cntou"/><xsl:param name="idxperson"/><xsl:param name="cntperson"/>
		<xsl:param name="steproutetype"/><xsl:param name="stepunittype"/><xsl:param name="parentunittype"/>
		<xsl:variable name="index">
			<xsl:number value="$idxstepdisp" format="01"/>
			<xsl:if test="$cntou>1">.<xsl:number value="$idxoudisp" format="01"/></xsl:if>
			<xsl:if test="$cntperson>1">.<xsl:number value="$idxperson - cfxsl:countHidden(.)" format="01"/></xsl:if>
		</xsl:variable>
		<xsl:if test="not(taskinfo/@visible='n')">
			<xsl:call-template name="htmlrow">
				<xsl:with-param name="steproutetype" select="$steproutetype"/>
				<xsl:with-param name="stepunittype" select="$stepunittype"/>
				<xsl:with-param name="parentunittype" select="$parentunittype"/>
				<xsl:with-param name="itemid" select="concat('step[',number($idxstep)-1,']/ou[',number($idxou)-1,']/(person|role)[',number($idxperson)-1,']')"/>
				<xsl:with-param name="index" select="$index"/>
				<xsl:with-param name="displayname" select="string(@name)"/>
				<xsl:with-param name="title" select="string(@title)"/>				
				<xsl:with-param name="level" select="string(@level)"/>
				<xsl:with-param name="itemtaskinfo" select="taskinfo"/>
				<xsl:with-param name="oudisplayname" select="string(@ouname)"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

	<xsl:template match="ou">
		<xsl:param name="idxdivision"/><xsl:param name="idxstep"/><xsl:param name="idxstepdisp"/><xsl:param name="idxou"/><xsl:param name="idxoudisp"/><xsl:param name="cntou"/>
		<xsl:param name="steproutetype"/><xsl:param name="stepunittype"/><xsl:param name="parentunittype"/>
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
				</xsl:apply-templates>
			</xsl:for-each>
		</xsl:if>
			
		<xsl:if test="$cntvisibleperson=0 or ($cntvisibleperson>0 and $assureouvisible='true')">
			<xsl:variable name="index">
				<xsl:number value="$idxstepdisp" format="01"/>
				<xsl:if test="$cntou>1">.<xsl:number value="$idxoudisp" format="01"/></xsl:if>
			</xsl:variable>
			<xsl:if test="not(taskinfo/@visible='n')">
				<xsl:call-template name="htmlrow">
					<xsl:with-param name="steproutetype" select="$steproutetype"/>
					<xsl:with-param name="stepunittype" select="$stepunittype"/>
					<xsl:with-param name="parentunittype" select="$parentunittype"/>
					<xsl:with-param name="itemid" select="concat('step[',number($idxstep)-1,']/ou[',number($idxou)-1,']')"/>
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
		<xsl:choose>
			<xsl:when test="$viewtype='create'">
				<tr align="center">
					<xsl:attribute name="id"><xsl:value-of select="$itemid"/></xsl:attribute>
					<td height="20"  nowrap="t"><xsl:value-of select="$index"/> </td>
					<td nowrap="t"><xsl:value-of select="$displayname"/> </td>
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($title)"/> </td>					
					<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($level)"/> </td>
					<td nowrap="t"><xsl:value-of select="cfxsl:convertSignResult(string($itemtaskinfo/@result),string($itemtaskinfo/@kind))"/> </td>
					<td nowrap="t">
						<xsl:apply-templates select="$itemtaskinfo">
							<xsl:with-param name="steproutetype" select="$steproutetype"/>
							<xsl:with-param name="stepunittype" select="$stepunittype"/>
							<xsl:with-param name="parentunittype" select="$parentunittype"/>
						</xsl:apply-templates>
					 </td>
					<td nowrap="t"><xsl:value-of select="$oudisplayname"/><xsl:text disable-output-escaping="yes">&amp;nbsp;</xsl:text></td>
				</tr>
			</xsl:when>
			<xsl:when test="$viewtype='read'">
				<tr align="center">
					<xsl:attribute name="id"><xsl:value-of select="$itemid"/></xsl:attribute>
					<td height="20"  nowrap="t" style='font-size:9pt;'><xsl:value-of select="$index"/> </td>
					<td nowrap="t" style='font-size:9pt;'><xsl:value-of select="$displayname"/> </td>
					<td nowrap="t" style='font-size:9pt;'><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($title)"/> </td>					
					<!--<td nowrap="t"><xsl:value-of disable-output-escaping="yes" select="cfxsl:splitName($level)"/> </td>-->
					<td nowrap="t" style='font-size:9pt;'><xsl:value-of disable-output-escaping="yes" select="cfxsl:convertSignResult(string($itemtaskinfo/@result),string($itemtaskinfo/@kind))"/> </td>
					<td nowrap="t" style='font-size:9pt;'>
						<xsl:apply-templates select="$itemtaskinfo">
							<xsl:with-param name="steproutetype" select="$steproutetype"/>
							<xsl:with-param name="stepunittype" select="$stepunittype"/>
							<xsl:with-param name="parentunittype" select="$parentunittype"/>
						</xsl:apply-templates>
					 </td>
					<td nowrap="t" style='font-size:9pt;'><xsl:value-of select="$oudisplayname"/><xsl:text disable-output-escaping="yes">&amp;nbsp;</xsl:text></td>
					<td nowrap="t" style='font-size:9pt;'><xsl:value-of disable-output-escaping="yes" select="cfxsl:formatDate(string($itemtaskinfo/@datecompleted))"/> </td>
					<td nowrap="t" style='font-size:9pt;'><xsl:value-of disable-output-escaping="yes" select="cfxsl:formatDate(string($itemtaskinfo/@datereceived))"/> </td>
				</tr>
				<xsl:if test="($itemtaskinfo/comment)">
					<tr >
						<td  colspan="2"  nowrap="t" style='font-size:9pt;'><xsl:text disable-output-escaping="yes">&amp;nbsp;</xsl:text></td>
						<td  colspan="8"  nowrap="t" style='font-size:9pt;'>
							<xsl:call-template name="displaycomment">
								<xsl:with-param name="itemtaskinfo" select="$itemtaskinfo"/>
							</xsl:call-template>
						 </td>
					</tr>
				</xsl:if>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="displaycomment" match="*">
		<xsl:param name="itemtaskinfo"/>
		<xsl:apply-templates select="$itemtaskinfo/comment"/>
	</xsl:template>
	
	<xsl:template match="comment">
		<xsl:text disable-output-escaping="yes">&amp;nbsp;</xsl:text><font color="red"><xsl:value-of disable-output-escaping="yes" select="cfxsl:replaceCR(string(.))"/></font>
	</xsl:template>
		
	<xsl:template match="taskinfo">
		<xsl:param name="steproutetype"/><xsl:param name="stepunittype"/><xsl:param name="parentunittype"/>
		<xsl:choose>
			<xsl:when test="@datecompleted or $viewtype='read'"><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype)"/></xsl:when>

			<xsl:when test="$steproutetype='approve'">
				<xsl:variable name="isLastApvStep" select="cfxsl:isLastApvStep()"/>
				<xsl:choose>
					<xsl:when test="$stepunittype='person' or $stepunittype='role'">
						<xsl:call-template name="statusselector"/>
					</xsl:when>
					<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype)"/></xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<xsl:when test="$steproutetype='audit'"><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype)"/></xsl:when>
			<xsl:when test="$steproutetype='review'"><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype)"/></xsl:when>
			<xsl:when test="$steproutetype='notify'"><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype)"/></xsl:when>
			<xsl:when test="$steproutetype='assist'"><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype)"/></xsl:when>

			<xsl:when test="$steproutetype='consult'">
				<xsl:choose>
					<xsl:when test="$stepunittype='ou'">
						<xsl:choose>
							<xsl:when test="(ancestor::person or ancestor::role) and (@kind='normal' or @kind='authorize' or @kind='substitute' or @kind='review')">
								<xsl:call-template name="statusselector"/>
							</xsl:when>
							<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype)"/></xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype)"/></xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<xsl:when test="$steproutetype='receive'">
				<xsl:choose>
					<xsl:when test="$stepunittype='ou'">
						<xsl:choose>
							<xsl:when test="(ancestor::person or ancestor::role) and (@kind='normal' or @kind='authorize' or @kind='substitute' or @kind='review')">
								<xsl:call-template name="statusselector"/>
							</xsl:when>
							<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype)"/></xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype)"/></xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),$parentunittype,$steproutetype,$stepunittype)"/></xsl:otherwise>
		</xsl:choose>
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
			<xsl:when test="@kind='normal'">
				<select style="font-size:9pt;width:80;height:18;" onchange="parent.statusChange()">
					<option value="normal" selected="t"><xsl:value-of select="cfxsl:convertKindToSignType('normal')"/></option>
					<option value="authorize"><xsl:value-of select="cfxsl:convertKindToSignType('authorize')"/></option>
					<option value="substitute"><xsl:value-of select="cfxsl:convertKindToSignType('substitute')"/></option>
					<option value="review"><xsl:value-of select="cfxsl:convertKindToSignType('review')"/></option>
				</select>
			</xsl:when>
			<xsl:otherwise><xsl:value-of select="cfxsl:convertKindToSignTypeByRTnUT(string(@kind),'person','approve','person')"/></xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>