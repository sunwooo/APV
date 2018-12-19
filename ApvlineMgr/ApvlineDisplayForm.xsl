<?xml version="1.0" encoding="utf-8"?>
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
						case "ou":sSignType="담당부서";break;
						case "person":sSignType=convertKindToSignType(sKind) ;break;
					}break;
				case "role":
				case "person":
					sSignType="수신";break;
				case "group":
					sSignType="수신";break;
			}break;
		case "consult":
			switch(sUT){
				case "ou":
					switch(sParentUT){
						case "ou":sSignType="부서합의";break;
						case "role":
						case "person":sSignType=convertKindToSignType(sKind) ;break;
					}break;
				case "role":
				case "person":
					sSignType="개인합의";break;
			}break;
		case "assist":
			switch(sUT){
				case "ou":
					switch(sParentUT){
						case "ou":sSignType="부서협조";break;
						case "role":
						case "person":sSignType=convertKindToSignType(sKind) ;break;
					}break;
				case "role":
				case "person":
					sSignType="협조";break;
			}break;
		case "audit":
			switch(sUT){
				case "ou":
					switch(sParentUT){
						case "ou":sSignType="재경감사";break;
						case "role":
						case "person":sSignType=convertKindToSignType(sKind) ;break;
					}break;
				case "role":
				case "person":
					sSignType="일상감사";break;
			}break;
		case "review":
			sSignType="공람";break;
		case "notify":
			sSignType="통보";break;
		case "approve":
			switch(sUT){
				case "role":
				case "person":
					sSignType=convertKindToSignType(sKind) ;break;
				case "ou":
					sSignType="부서결재";break;
			}break;
	}
	return sSignType;
}
function convertKindToSignType(sKind){
	var sSignType;
	switch(sKind){
		case "normal":
			sSignType = "일반결재";break;
		case "consent":
			sSignType = "검토";break;
		case "authorize":
			sSignType = "전결";break;
		case "substitute":
			sSignType = "대결";break;
		case "review":
			sSignType = "후결";break;
		case "bypass":
			sSignType = "후열";break;
		case "charge":
			sSignType = "담당";break;
		case "skip":
			sSignType = "결재안함";break;
		default:
			sSignType = "&nbsp;";break;
	}
	return sSignType;
}
function convertSignResult(sResult,sKind){
	var sSignResult;
	switch(sResult){
		case "inactive":
			sSignResult = "대기";break;
		case "pending":
			sSignResult = "대기";break;
		case "reserved":
			sSignResult = "보류";break;
		case "completed":
			sSignResult =  (sKind=='charge')?"기안":"결재";break;
		case "rejected":
			sSignResult = "반려";break;
		case "rejectedto":
			sSignResult = "반려";break;
		case "authorized":
			sSignResult = "전결";break;
		case "reviewed":
			sSignResult = "후결";break;
		case "substituted":
			sSignResult = "대결";break;
		case "agreed":
			sSignResult = "합의";break;
		case "disagreed":
			sSignResult = "이의";break;
		case "bypassed":
			sSignResult = "후열";break;
		case "skipped":
			sSignResult = "결재안함";break;
		default:
			sSignResult = "&nbsp;";break;
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
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'>순 번</td>
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'>직 책</td>
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'>이 름</td>
					<!--<td height="20"  align="center" valign="middle"  nowrap="t">직 급</td>-->
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'>상 태</td>
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'>종 류</td>
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'>부 서</td>
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'>결재일자</td>
					<td height="20"  align="center" valign="middle"  nowrap="t" style='font-size:9pt;'>받은일자</td>
				</tr>
			</thead>
			<tbody>
			<xsl:for-each select="steps/step">
				<!--<xsl:sort select="position()" data-type="number" order="descending"/>-->
				<xsl:variable name="idxstep"><xsl:number value="position()" format="01"/></xsl:variable>
				<xsl:choose>
					<xsl:when test="taskinfo/@visible='n'"/>
					<xsl:otherwise>
						<xsl:apply-templates select=".">
							<xsl:with-param name="idxstep" select="$idxstep"/>
						</xsl:apply-templates>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
			</tbody>
		</table>
		<xsl:if test="$displaylog='true'"><div><xsl:value-of select="cfxsl:getLog()"/></div></xsl:if>
	</xsl:template>

	<xsl:template match="step">
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
							<!--<xsl:sort select="position()" data-type="number" order="descending"/>-->
							<xsl:variable name="idxou"><xsl:number count="ou" format="01"/></xsl:variable>
							<xsl:variable name="cntou" select="last()"/>
							<xsl:apply-templates select=".">
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
		<xsl:param name="idxstep"/><xsl:param name="idxstepdisp"/><xsl:param name="idxou"/><xsl:param name="idxoudisp"/><xsl:param name="cntou"/><xsl:param name="idxperson"/><xsl:param name="cntperson"/>
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
		<xsl:param name="idxstep"/><xsl:param name="idxstepdisp"/><xsl:param name="idxou"/><xsl:param name="idxoudisp"/><xsl:param name="cntou"/><xsl:param name="idxperson"/><xsl:param name="cntperson"/>
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
		<xsl:param name="idxstep"/><xsl:param name="idxstepdisp"/><xsl:param name="idxou"/><xsl:param name="idxoudisp"/><xsl:param name="cntou"/>
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