<%@ Page Language="C#" AutoEventWireup="true" CodeFile="portallistitemsXSL.aspx.cs" Inherits="COVIFlowNet_Portal_portallistitemsXSL" %>

<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
<xsl:output media-type="text/html"/>
<xsl:param name="sTitle">받은시간</xsl:param>
<msxsl:script language="JScript" implements-prefix="cfxsl">
	<![CDATA[
	function getSubKind(sKind){
		try{
		var sSubKind="";
		switch(sKind){
			case "T000"://결재
				sSubKind= "<%=Resources.Approval.lbl_app %>";break;
			
			default: sSubKind= sKind;break;
		}
		return sSubKind;
		}catch(e){throw e}
	}
	function getIsPaper(sIsPaper){
		try{
		var sYN="";
		switch(sIsPaper){
			case "Y":
				sYN= "서면결재";break;
			case "N":
			case "":
			default: sYN= "";break;
		}
		return sYN;
		}catch(e){throw e}
	}
	function getUrgent(sPriority){
		try{
		var sYN="";
		switch(sPriority){
			case "1":
			case "2":
			case "3":sYN= "";break;
			case "4":sYN= "*";break;
			case "5":sYN= "*";break;
			default: sYN= sPriority;break;
		}
		return sYN;
		}catch(e){throw e}
	}
	function getRequestResponse(sReqResponse){
		try{
		var sYN="";
		switch(sReqResponse){
			case "Y":
				sYN= "회신요구";break;
			case "N":
			case "":
			default: sYN= "";break;
		}
		return sYN;
		}catch(e){throw e}
	}
	]]>
</msxsl:script>

<xsl:template match="response">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	<tr>
	    <td  valign="top"> 
		<table id="tblGalInfo" width="100%"  border="0" cellspacing="0" cellpadding="0" style="TABLE-LAYOUT: fixed;">
		<THEAD style="display:none;">
			<tr class="BTable_bg02" style="height:25px">
                <TD align="left" valign="middle"  id="thCR" noWrap="t" width="50" >
                    <span id="spanPI_INITIATOR_NAME"><%=Resources.Approval.lbl_writer %></span>
                </TD><!--기안자명-->
                <TD align="left" valign="middle"  id="thDN" width="*"  colspan="4">
                    <span id="spanPI_SUBJECT"><%=Resources.Approval.lbl_subject %></span>
                </TD><!--제목-->
                <TD align="left" valign="middle"  id="thER" noWrap="t" width="60" >
                    <span id="spanPI_INITIATOR_UNIT_NAME"><%= Resources.Approval.lbl_receivedate %></span>
                </TD><!--날자-->
			</tr>
				<tr>
	               <td height="1" colspan="6"  class="BTable_bg03"></td>
	            </tr>
		</THEAD>

		<TBODY>
		<xsl:choose>
			<xsl:when test="count(workitem) = 0 ">
				<tr style="height:25px">
					<td colspan="6" valign="middle" nowrap="true" align="center"><%=Resources.Approval.msg_101 %> </td>
				</tr>
			</xsl:when>
			<xsl:otherwise>
				<xsl:for-each select="workitem">
				        <tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" >
						<%--<tr style="cursor:hand;">--%>
						<xsl:choose>
							<xsl:when test="(position() mod 2) = 1 ">
							    <xsl:attribute name="onMouseover">this.style.background='#FAE6BA';</xsl:attribute><!--필요없으면 제거할것-->
				                <xsl:attribute name="onMouseout">this.style.background=''</xsl:attribute><!--필요없으면 제거할것-->						
						    </xsl:when>
						    <xsl:otherwise>
								<xsl:attribute name="class">BTable_bg04</xsl:attribute>
								<xsl:attribute name="onMouseover">this.style.background='#FAE6BA';</xsl:attribute><!--필요없으면 제거할것-->
				                <xsl:attribute name="onMouseout">this.style.background='#f2f2f2'</xsl:attribute><!--필요없으면 제거할것-->
						    </xsl:otherwise>
						</xsl:choose>
						<xsl:attribute name="className">rowunselected</xsl:attribute>
						<xsl:attribute name="workitemid"><xsl:value-of select="id"/></xsl:attribute>
						<xsl:attribute name="piid"><xsl:value-of select="piid"/></xsl:attribute>
						<xsl:attribute name="pfid"><xsl:value-of select="pfid"/></xsl:attribute>
						<xsl:attribute name="mode"><xsl:value-of select="mode"/></xsl:attribute>
						<xsl:attribute name="participantid"><xsl:value-of select="participantid"/></xsl:attribute>
						<xsl:attribute name="piviewstate"></xsl:attribute>
						<xsl:attribute name="fiid"><xsl:value-of select="fiid"/></xsl:attribute>
						<xsl:attribute name="ftid"><xsl:value-of select="ftid"/></xsl:attribute>
						<xsl:attribute name="fmid"><xsl:value-of select="fmid"/></xsl:attribute>
						<xsl:attribute name="fmnm"><xsl:value-of select="fmnm"/></xsl:attribute>
						<xsl:attribute name="fmrv"><xsl:value-of select="fmrv"/></xsl:attribute>
						<xsl:attribute name="scid"><xsl:value-of select="scid"/></xsl:attribute>
						<xsl:attribute name="fmpf"><xsl:value-of select="fmpf"/></xsl:attribute>
						<xsl:attribute name="fmfn"><xsl:value-of select="fmfn"/></xsl:attribute>
						<xsl:attribute name="bstate"><xsl:value-of select="bstate"/></xsl:attribute>
						<xsl:attribute name="pfsk"><xsl:value-of select="pfsk"/></xsl:attribute>
						<xsl:attribute name="pibd1"><xsl:value-of select="pibd1"/></xsl:attribute>
						<xsl:attribute name="pipr"><xsl:value-of select="pipr"/></xsl:attribute>
						<xsl:attribute name="pidc"><xsl:value-of select="pidc"/></xsl:attribute>
						<xsl:attribute name="secdoc"><xsl:value-of select="secdoc"/></xsl:attribute>
						<xsl:attribute name="edms_document"><xsl:value-of select="edms_document"/></xsl:attribute>
						
						    <td align="left" vnowrap="true" style="overflow:hidden;height:25px" onselect="false" width="82" height="20">
						    <%--<img src="/COVINet/images/cuckoo/main/spot.gif" width="3" height="3" align="absmiddle"/>&#160;--%><xsl:value-of select="picreator"/>
						    </td>
						    <td valign="middle" nowrap="true" style="text-overflow:ellipsis; overflow:hidden; paddingRight:1px;height:25px;" onselect="false" width="330" height="20" colspan="4" >
						        <nobr><a href="#" class="text02_L"><xsl:value-of select="title"/></a></nobr>
						    </td>
						    <td align="left" valign="middle" nowrap="true" style="overflow:hidden; paddingRight:1px;height:25px" onselect="false" width="100" height="20">
						        [<xsl:value-of select="substring(completedate,3,8)"/>]
						    </td>
						</tr>
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
		</TBODY>
		</table>
	  </td>
    </tr>
	<tr>
	   <td height="1"  class="BTable_bg03"></td>
	</tr>
  </table>
</xsl:template>
</xsl:stylesheet>
