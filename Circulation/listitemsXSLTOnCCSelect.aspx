<%@ Page Language="C#" AutoEventWireup="true" CodeFile="listitemsXSLTOnCCSelect.aspx.cs" Inherits="COVIFlowNet_Circulation_listitemsXSLTOnCCSelect" %><?xml version="1.0" encoding="utf-8" ?>

<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
<xsl:output media-type="text/html"/>
<xsl:param name="totalcount" />
<xsl:param name="pagenum" />
<msxsl:script language="JScript" implements-prefix="cfxsl">
	<![CDATA[
	function getKind(sKind){
	    try{
	    var sSubKind="";
		switch(sKind){			
			case "1"://참조
				sSubKind= "<%=Resources.Approval.lbl_cc %>";break;
			
			case "0"://수신
				sSubKind= "<%=Resources.Approval.lbl_receive %>";break;
			
			case "2":
				sSubKind= "<%=Resources.Approval.btn_Circulate %>";break;
		
			default: sSubKind= sKind;break;
		}
		return sSubKind;
		}catch(e){throw e}
	}
	function getPfsk(sKind){
	    try{
	    var sSubPfsk="";
		switch(sKind){			
			case "1"://참조
				sSubPfsk= "T014";break;
			
			case "0"://수신
				sSubPfsk= "T015";break;
			
			case "2"://회람
				sSubPfsk= "T006";break;
		
			default: sSubPfsk= sKind;break;
		}
		return sSubPfsk;
		}catch(e){throw e}
	}
  
    ]]>
</msxsl:script>
<xsl:template match="response">
      <table id="tblGalInfo" width="100%" border="0" cellspacing="0" cellpadding="0" onselectstart="return false">
		<THEAD>
        <tr>
          <td height="2" colspan="6" class="BTable_bg01"></td>
        </tr>
        <tr class="BTable_bg02" style="height:27px">
			<th noWrap="t" style="padding-left:10px;" width="40">
			    <input type="checkbox" id="chkAll" name="chkAll" onclick="javascript:chkAll();"/><!--전체-->
			</th>
			<th noWrap="t" style="padding-left:10px;" width="40">
			    <%=Resources.Approval.lbl_no %><!--전체-->
			</th>						    
			<th id="thBR" noWrap="t" width="180" onClick="sortColumn('FORM_NAME');" style="cursor:hand;" align="CENTER"><%=Resources.Approval.lbl_formname%> <span id="spanFORM_NAME"></span></th><!--양식명-->
			<th id="thDN"  onClick="sortColumn('SUBJECT');"  style="cursor:hand;" align="CENTER"><%=Resources.Approval.lbl_subject %>  <span id="spanSUBJECT"></span></th><!--제목-->
			<th id="TD2"  width="110" onClick="sortColumn('SENDER_NAME');" style="cursor:hand;" align="CENTER"><%=Resources.Approval.lbl_Sender %>  <span id="spanSENDER_NAME"></span></th>
			<th id="thAT"  width="110" onClick="sortColumn('SEND_DATE');" style="cursor:hand;" align="CENTER"><%=Resources.Approval.lbl_senddate%> <span id="spanSEND_DATE"></span></th>
			</tr>
            <tr>
              <td height="1" colspan="6" class="BTable_bg03"></td>
            </tr>
		</THEAD>
		<TBODY>
		<xsl:choose>
			<xsl:when test="(count(forminstance)) = 0 ">
				<tr  style="height:25px">
					<td  colspan="5" nowrap="true" align="center"><%=Resources.Approval.msg_101 %> </td>
					<td  nowrap="true" style="overflow:hidden; paddingRight:1px;display:none;" onselect="false">
					    <input type="checkbox" id="chkID" name="chkID"></input>
					</td>
				</tr>
			</xsl:when>
			<xsl:otherwise>
				<xsl:for-each select="forminstance">
					<tr  onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" class="rowunselected">						
						<xsl:attribute name="piid"><xsl:value-of select="piid"/></xsl:attribute>																		
						<xsl:attribute name="bstate"><xsl:value-of select="bstate"/></xsl:attribute>						
						<xsl:attribute name="pidc"><xsl:value-of select="link_url"/></xsl:attribute>										
						<xsl:attribute name="mode"><xsl:value-of select="mode"/></xsl:attribute>
						<xsl:attribute name="workitemid"><xsl:value-of select="id"/></xsl:attribute>
						<xsl:attribute name="fiid"><xsl:value-of select="fiid"/></xsl:attribute>
						<xsl:attribute name="fmid"><xsl:value-of select="fmid"/></xsl:attribute>
						<xsl:attribute name="scid"><xsl:value-of select="scid"/></xsl:attribute>
						<xsl:attribute name="fmpf"><xsl:value-of select="fmpf"/></xsl:attribute>
						<xsl:attribute name="fmnm"><xsl:value-of select="fmnm"/></xsl:attribute>
						<xsl:attribute name="fmrv"><xsl:value-of select="fmrv"/></xsl:attribute>
						<xsl:attribute name="ftid"><xsl:value-of select="ftid"/></xsl:attribute>
						<xsl:attribute name="fitn"><xsl:value-of select="fitn"/></xsl:attribute>
						<xsl:attribute name="fmfn"><xsl:value-of select="fmfn"/></xsl:attribute>
						<xsl:attribute name="picreatorid"><xsl:value-of select="picreatorid"/></xsl:attribute>
						<xsl:attribute name="createdate"><xsl:value-of select="createdate"/></xsl:attribute>
						<xsl:attribute name="title"><xsl:value-of select="title"/></xsl:attribute>						
						<xsl:attribute name="link_url"><xsl:value-of select="LINK_URL"/></xsl:attribute>
						<xsl:attribute name="sendid"><xsl:value-of select="sendid"/></xsl:attribute>
						<xsl:attribute name="process_id"><xsl:value-of select="PROCESS_ID"/></xsl:attribute>
						<xsl:attribute name="subject"><xsl:value-of select="SUBJECT"/></xsl:attribute>	
						<xsl:attribute name="pfsk"><xsl:value-of select="cfxsl:getPfsk(string(kind))"/></xsl:attribute>					
						<xsl:attribute name="type"><xsl:value-of select="type"/></xsl:attribute>
						<xsl:attribute name="kind"><xsl:value-of select="kind"/></xsl:attribute>
						
						<xsl:attribute name="receipt_id"><xsl:value-of select="receipt_id"/></xsl:attribute>
						<xsl:attribute name="receipt_name"><xsl:value-of select="receipt_name"/></xsl:attribute>
						<xsl:attribute name="receipt_ou_id"><xsl:value-of select="receipt_ou_id"/></xsl:attribute>
						<xsl:attribute name="receipt_ou_name"><xsl:value-of select="receipt_ou_name"/></xsl:attribute>
						<xsl:attribute name="receipt_state"><xsl:value-of select="receipt_state"/></xsl:attribute>
						<xsl:attribute name="receipt_date"><xsl:value-of select="receipt_date"/></xsl:attribute>
						
						<xsl:attribute name="read_date"><xsl:value-of select="read_date"/></xsl:attribute>				
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
						
						<td  nowrap="true" style="overflow:hidden; paddingRight:1px;" onselect="false">
        					<input type="checkbox" id="chkID"  ><xsl:attribute name="value"><xsl:value-of select="concat(fiid,'@@@',concat(link_url,';',piid,';',bstate),'@@@',title)"/></xsl:attribute></input>
						</td>
				        <td nowrap="true" style="overflow:hidden; paddingRight:1px;" onselect="false"><xsl:value-of select="$totalcount - ($pagenum - 1 ) * 10 - position() + 1 "/></td>
						<td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="fmnm"/></td>
						<td  nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false">
						<a href="#" class="text02_L" onclick="event_GalTable_ondblclick()" >
                        <xsl:value-of select="title"/>
                        </a></td>
						<td  valign="top" align="center" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="picreatorid"/></td>
						<td  valign="top" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="createdate"/></td>
					</tr>
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
		    <tr>
              <td height="1" colspan="6" class="BTable_bg03"></td>
            </tr>
            <tr>
              <td height="2" colspan="6" class="BTable_bg04"></td>
            </tr>
		</TBODY>
		</table>
</xsl:template>
</xsl:stylesheet>
