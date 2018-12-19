<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
<xsl:output media-type="text/html"/>

<msxsl:script language="JScript" implements-prefix="cfxsl">
	<![CDATA[
	function getSubKind(sKind){
		try{
		var sSubKind="";
		//var strKind = sKind.text;
		switch(sKind){
			case "T000":
				sSubKind= "결재";break;
			case "T001":
				sSubKind= "시행";break;
			case "T002":
				sSubKind= "시행";break;
			case "T003":
				sSubKind= "직인";break;
			case "T004":
				sSubKind= "협조";break;
			case "T005":
				sSubKind= "후결";break;
			case "T006":
				sSubKind= "열람";break;
			case "T007":
				sSubKind= "경유";break;
			case "T008":
				sSubKind= "재기안";break;
			case "T009":
				sSubKind= "합의";break;
			case "T010":
				sSubKind= "예고";break;
			case "A":
				sSubKind= "품의함";break;
			case "R":
				sSubKind= "수신";break;
			case "S":
				sSubKind= "발신";break;
			case "REQCMP":
				sSubKind= "신청처리";break;
			case "P":
				sSubKind= "발신";break;
			case "C":
				sSubKind= "합의기안";break;
			default: sSubKind= sKind;break;
		}
		return sSubKind;
		}catch(e){throw e}
	}
	function getNodeValue(strXML, strNodeName){
		try{
			var objNode =strXML.nextNode();
  			var objXML = new ActiveXObject("MSXML.DOMDocument");
			if(objNode.text != ""){
				objXML.loadXML(objNode.text);
				var objNodeRoot = objXML.selectSingleNode("ClientAppInfo/App/forminfos");
				var objNodeChild = objNodeRoot.lastChild;
				if ( objNodeChild != null ){
					if (objNodeChild.getAttribute(strNodeName) != null ){
						return objNodeChild.getAttribute(strNodeName);
					}else{
						return "";
					}
				}else{
					return "";
				}
			}else{
				return "";
			}
		}catch(e){throw e}
	}
	]]>
</msxsl:script>
 <xsl:template match="ROOT">
	<tbody>
		<xsl:if test=" count(//WF_WORKITEM_LIST) = 0  ">
                <tr>
			<td colspan="5" align="center">검색된 자료가 없습니다.</td>
                </tr>
		</xsl:if>
		<xsl:for-each select="WF_WORKITEM_LIST">
		    <tr onmousedown="selectRow()" class="rowunselected" ondblclick="event_ondblclick();">
			<xsl:attribute name="id"><xsl:value-of select="@PI_ID"/></xsl:attribute>
			<xsl:attribute name="pi_state"><xsl:value-of select="@PI_STATE"/></xsl:attribute>
			<xsl:attribute name="wi_state"><xsl:value-of select="@WI_STATE"/></xsl:attribute>
			<xsl:attribute name="pf_performer_id"><xsl:value-of select="@PF_PERFORMER_ID"/></xsl:attribute>
			<xsl:attribute name="fiid"><xsl:value-of select="cfxsl:getNodeValue(@PI_DSCR,'instanceid')"/></xsl:attribute>
			<xsl:attribute name="workitemid"><xsl:value-of select="@WI_ID"/></xsl:attribute>
			<xsl:attribute name="piid"><xsl:value-of select="@PI_ID"/></xsl:attribute>
			<xsl:attribute name="pfid"><xsl:value-of select="@PF_PERFORMER_ID"/></xsl:attribute>
			<xsl:attribute name="mode">READ</xsl:attribute>
			<xsl:attribute name="participantid"></xsl:attribute>
			<xsl:attribute name="piviewstate"></xsl:attribute>
			<xsl:attribute name="ftid"></xsl:attribute>
			<xsl:attribute name="fmid"><xsl:value-of select="cfxsl:getNodeValue(@PI_DSCR,'id')"/></xsl:attribute>
			<xsl:attribute name="fmnm"><xsl:value-of select="cfxsl:getNodeValue(@PI_DSCR,'name')"/></xsl:attribute>
			<xsl:attribute name="fmpf"><xsl:value-of select="cfxsl:getNodeValue(@PI_DSCR,'prefix')"/></xsl:attribute>
			<xsl:attribute name="fmrv"><xsl:value-of select="cfxsl:getNodeValue(@PI_DSCR,'revision')"/></xsl:attribute>
			<xsl:attribute name="scid"><xsl:value-of select="cfxsl:getNodeValue(@PI_DSCR,'schemaid')"/></xsl:attribute>
			<xsl:attribute name="bstate"><xsl:value-of select="@PI_BUSINESS_STATE"/></xsl:attribute>
			<xsl:attribute name="pfsk"><xsl:value-of select="@PF_SUB_KIND"/></xsl:attribute>
			<xsl:attribute name="pibd1"><xsl:value-of select="@PI_BUSINESS_DATA1"/></xsl:attribute>
			<xsl:attribute name="pidc"><xsl:value-of select="@PI_DSCR"/></xsl:attribute>
			<td width="50" height="21" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="cfxsl:getSubKind(string(@PF_SUB_KIND))"/></td>
			<td style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="cfxsl:getNodeValue(@PI_DSCR,'name')" disable-output-escaping="no"/></td>
			<td style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="@PI_SUBJECT"/></td>
			<td style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="@PI_INITIATOR_NAME"/></td>
			<td style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="@PI_INITIATOR_UNIT_NAME"/></td>
			<td style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="@WI_FINISHED"/></td>
		    </tr>
		</xsl:for-each>
	</tbody>
</xsl:template>
</xsl:stylesheet>
