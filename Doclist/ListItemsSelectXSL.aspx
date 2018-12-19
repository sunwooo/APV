<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListItemsSelectXSL.aspx.cs" Inherits="Approval_Doclist_ListItemsSelectXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
<xsl:output media-type="text/html"/>
<xsl:param name="sTitle"><%=Resources.Approval.lbl_donedate %></xsl:param>
<xsl:param name="totalcount" />
<xsl:param name="pagenum" />
<msxsl:script language="JScript" implements-prefix="cfxsl">
	<![CDATA[
	function getSubKind(sKind){
		try{
		var sSubKind="";
		switch(sKind){
			case "T000"://결재
				sSubKind= "<%=Resources.Approval.lbl_app %>";break;
			case "T001":
				sSubKind= "시행";break;
			case "T002":
				sSubKind= "시행";break;
			case "T003":
				sSubKind= "직인";break;
			case "T004"://협조
				sSubKind= "<%=Resources.Approval.lbl_assist %>";break;
			case "T005":
				sSubKind= "후결";break;
			case "T006"://열람
				sSubKind= "열람";break;
			case "T007":
				sSubKind= "경유";break;
			case "T008"://담당
				sSubKind= "<%=Resources.Approval.lbl_charge %>";break;
			case "T009"://합의
				sSubKind= "<%=Resources.Approval.lbl_consent %>";break;
			case "T010"://예고
				sSubKind= "<%=Resources.Approval.lbl_doc_pre2 %>";break;
			case "T011"://담당
				sSubKind= "<%=Resources.Approval.lbl_charge %>";break;
			case "T012"://담당
				sSubKind= "<%=Resources.Approval.lbl_charge %>";break;
			case "T013"://참조
				sSubKind= "<%=Resources.Approval.lbl_cc %>";break;
			case "T014":
				sSubKind= "통지";break;
			case "T015"://협조
				sSubKind= "<%=Resources.Approval.lbl_assist %>";break;
			case "T016"://감사
				sSubKind= "<%=Resources.Approval.lbl_audit %>";break;
			case "A"://품의함
				sSubKind= "<%=Resources.Approval.lbl_completedBox %>";break;
			case "R"://수신
				sSubKind= "<%=Resources.Approval.lbl_receive %>";break;
			case "S"://발신
				sSubKind= "<%=Resources.Approval.lbl_send %>";break;
			case "E"://접수
				sSubKind= "<%=Resources.Approval.lbl_receive %>";break;
			case "REQCMP"://신청처리
				sSubKind= "<%=Resources.Approval.lbl_receive %>";break;
			case "P"://발신
				sSubKind= "<%=Resources.Approval.lbl_send %>";break;
			case "SP":
				sSubKind= "열람";break;
			case "C"://합의기안
			case "AS"://협조기안
			case "AD"://감사기안
				sSubKind= "<%=Resources.Approval.btn_redraft %>";break;
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
      <!-- 리스트 테이블 시작 -->
      <table id="tblGalInfo" width="100%" border="0" cellspacing="0" cellpadding="0" onselectstart="return false">
		<THEAD>
        <tr>
          <td height="2" colspan="6" class="BTable_bg01"></td>
        </tr>
        <tr class="BTable_bg02" style="height:27px">
			<th noWrap="t"  width="40">
			    <input type="checkbox" id="chkAll" name="chkAll" onclick="javascript:chkAll();"/><!--전체-->
			</th>
			<th noWrap="t"  width="40">
			    <%=Resources.Approval.lbl_no %><!--전체-->
			</th>			
			<th id="thBR" noWrap="t" width="150" onClick="sortColumn('FORM_NAME');" style="cursor:hand;"><a href="#"><%=Resources.Approval.lbl_formname%> <span id="spanFORM_NAME"></span></a></th><!--양식명-->
			<th id="thDN" onClick="sortColumn('PI_SUBJECT');" style="cursor:hand;"><a href="#"><%=Resources.Approval.lbl_subject %>  <span id="spanPI_SUBJECT"></span></a></th><!--제목-->
			<th id="thCR" noWrap="t" width="70" onClick="sortColumn('PI_INITIATOR_NAME');" style="cursor:hand;"><a href="#"><%=Resources.Approval.lbl_writer %> <span id="spanPI_INITIATOR_NAME"></span></a></th><!--기안자명-->
			<th id="thAT" width="120" onClick="sortColumn('WORKDT');" style="cursor:hand;"><a href="#"><xsl:value-of select="$sTitle"/><span id="spanWORKDT"></span></a></th>
        </tr>
        <tr>
          <td height="1" colspan="6" class="BTable_bg03"></td>
        </tr>
        </THEAD>
        <TBODY>
		<xsl:choose>
			<xsl:when test="count(workitem) = 0 ">
				<tr  style="height:25px">
					<td  colspan="5" nowrap="true" align="center"><%=Resources.Approval.msg_101 %> </td>
					<td  nowrap="true" style="overflow:hidden; paddingRight:1px;display:none;" onselect="false">
					    <input type="checkbox" id="chkID" name="chkID"></input>
					</td>
				</tr>
			</xsl:when>
			<xsl:otherwise>
				<xsl:for-each select="workitem">
						<tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" style="height:25px" >
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
				        <xsl:attribute name="id"><xsl:value-of select="id"/></xsl:attribute>
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
				        <xsl:attribute name="title"><xsl:value-of select="title"/></xsl:attribute>
				        <xsl:attribute name="effectcmt"><xsl:value-of select="concat(concat(concat(concat(pidc,';'),piid),bstate),';')"/></xsl:attribute>

						<td  nowrap="true" style="overflow:hidden; paddingRight:1px;" onselect="false">
        					<input type="checkbox" id="chkID" ><xsl:attribute name="value"><xsl:value-of select="concat(id,'@@@',concat(pidc,';',piid,';',bstate),'@@@',title)"/></xsl:attribute></input>
						</td>
				        <td nowrap="true" style="overflow:hidden; paddingRight:1px;" onselect="false"><xsl:value-of select="$totalcount - ($pagenum - 1 ) * 10 - position() + 1 "/></td>
						<td nowrap="true" style="overflow:hidden; paddingRight:1px;" onselect="false"><xsl:value-of select="fmnm"/></td>
						<td nowrap="true" style="overflow:hidden; paddingRight:1px;" onselect="false">
						<a href="javascript:event_GalTable_ondblclick()" class="text02_L">
						<xsl:value-of select="title"/>
						</a>
						</td>
						<td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false">
		                	<xsl:value-of select="picreator"/>
					    <% if (this.Page.Application["ContextMenu_USER_YN"].ToString() == "Y")
                                        { %>
		                	
		                	<!--
		                	
                           <a href="#" onclick="javascript:OpenContextMenu4Approval(this)" class="text02_L"  onmouseout="MM_swapImgRestore()">		
                           <xsl:attribute name="onmouseover">
                           <xsl:text>MM_swapImage('Image</xsl:text>
                           <xsl:value-of select="position()" />
                           <xsl:text>','','/GWImages/Covi/Common/icon/icon_writer_on.gif',1)</xsl:text>
                           </xsl:attribute>
    						<xsl:attribute name="person_code"><xsl:value-of select="picreatorid"/></xsl:attribute>
                           <img src="/GWImages/Covi/Common/icon/icon_writer_off.gif" width="20" height="11" border="0" align="absmiddle" >
                           <xsl:attribute name="name">
                                <xsl:text>Image</xsl:text>
                               <xsl:value-of select="position()" />
                           </xsl:attribute>
                           <xsl:attribute name="id">
                                <xsl:text>Image</xsl:text>
                               <xsl:value-of select="position()" />
                           </xsl:attribute>
                           </img>
		                	</a>
		                	-->
		                	<%} %>
						</td>
						<td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="completedate"/></td>
						<!--<td class="tableDot" height="21" valign="top" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="ugrs"/><xsl:value-of select="cfxsl:getIsPaper(string(ispaper))"/><xsl:value-of select="cfxsl:getRequestResponse(string(rqrs))"/></td>-->
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