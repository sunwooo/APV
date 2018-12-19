<%@ Page Language="C#" AutoEventWireup="true" CodeFile="listitemsXSLUFolder.aspx.cs" Inherits="COVIFlowNet_listitemsXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">
	
<xsl:param name="sTitle">받은시간</xsl:param>
<xsl:param name="sType"></xsl:param>

<xsl:template match="response">
      <!-- 리스트 테이블 시작 -->
      <table id="tblGalInfo" width="100%" border="0" cellspacing="0" cellpadding="0" onselectstart="return false">
		<THEAD>
        <tr>
          <td height="1" colspan="6" class="BTable_bg01"></td>
        </tr>
        <tr class="BTable_bg02">
			<th id="thAPV" noWrap="t" style="padding-left:10px;display:none;" width="60" class="BTable_bg07">
			    <input type="checkbox" id="chkAPVALL" name="chkAPVALL" onclick="javascript:chkAPVALL_onClick();"/><!--전체-->
			</th>
			<th id="thDN" onClick="sortColumn('SUBJECT');" style="cursor:hand;" class="BTable_bg07"><a href="#"><%=Resources.Approval.lbl_subject %>  <span id="spanSUBJECT"></span></a></th><!--제목-->
			<th id="thAT" width="120" onClick="sortColumn('REGISTERED');"  class="BTable_bg07"><a href="#"><xsl:value-of select="$sTitle"/><span id="spanREGISTERED"></span></a></th>
			<th id="thER" noWrap="t" width="70" onClick="sortColumn('INITIATOR_UNIT_NAME');" style="cursor:hand;" class="BTable_bg07"><a href="#"><%=Resources.Approval.lbl_writedept %> <span id="spanINITIATOR_UNIT_NAME"></span></a></th><!--기안부서-->
			<th id="thCR" noWrap="t" width="70" onClick="sortColumn('INITIATOR_NAME');" style="cursor:hand;" class="BTable_bg07"><a href="#"><%=Resources.Approval.lbl_writer %> <span id="spanINITIATOR_NAME"></span></a></th><!--기안자명-->
			<th id="thBR" noWrap="t" width="150" onClick="sortColumn('FORM_NAME');" class="BTable_bg07"><a href="#"><%=Resources.Approval.lbl_formname%> <span id="spanFORM_NAME"></span></a></th><!--양식명-->
			<!--<td class="table_mgraybg" id="thET" noWrap="t" width="60">비고</td>-->
        </tr>
        </THEAD>
        <TBODY>
		<xsl:choose>
			<xsl:when test="count(workitem) = 0 ">
				<tr>
					<td  colspan="6" nowrap="true" align="center" class="BTable_bg08"><%=Resources.Approval.msg_101 %> </td>
					<td  nowrap="true" style="overflow:hidden; paddingRight:1px;display:none;" onselect="false" class="BTable_bg08">
					    <input type="checkbox" id="chkAPV" name="chkAPV"></input>
					</td>
				</tr>
			</xsl:when>
			<xsl:otherwise>
				<xsl:for-each select="workitem">
						<tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" >
						<xsl:choose>
							<xsl:when test="(position() mod 2) = 1 ">
							    <xsl:attribute name="onMouseover">this.style.background='#F8F4DE';</xsl:attribute><!--필요없으면 제거할것-->
				                <xsl:attribute name="onMouseout">this.style.background=''</xsl:attribute><!--필요없으면 제거할것-->
						    </xsl:when>
						    <xsl:otherwise>
								<xsl:attribute name="onMouseover">this.style.background='#F8F4DE';</xsl:attribute><!--필요없으면 제거할것-->
				                <xsl:attribute name="onMouseout">this.style.background=''</xsl:attribute><!--필요없으면 제거할것-->
						    </xsl:otherwise>
						</xsl:choose>
						<xsl:attribute name="mode"><xsl:value-of select="mode"/></xsl:attribute>
						<xsl:attribute name="workitemid"><xsl:value-of select="id"/></xsl:attribute>
				        <xsl:attribute name="piid"><xsl:value-of select="cfxsl:getPINodeValue(linkurl,1)"/></xsl:attribute>
				        <xsl:attribute name="bstate"><xsl:value-of select="cfxsl:getPINodeValue(linkurl,2)"/></xsl:attribute>
				        <xsl:attribute name="pibd1"><xsl:value-of select="cfxsl:getPINodeValue(linkurl,0)"/></xsl:attribute>
				        <xsl:attribute name="fmid"><xsl:value-of select="cfxsl:getNodeValue(linkurl,'id')"/></xsl:attribute>
				        <xsl:attribute name="fmnm"><xsl:value-of select="cfxsl:getNodeValue(linkurl,'name')"/></xsl:attribute>
				        <xsl:attribute name="fmpf"><xsl:value-of select="cfxsl:getNodeValue(linkurl,'prefix')"/></xsl:attribute>
				        <xsl:attribute name="fmrv"><xsl:value-of select="cfxsl:getNodeValue(linkurl,'revision')"/></xsl:attribute>
				        <xsl:attribute name="scid"><xsl:value-of select="cfxsl:getNodeValue(linkurl,'schemaid')"/></xsl:attribute>
				        <xsl:attribute name="fiid"><xsl:value-of select="cfxsl:getNodeValue(linkurl,'instanceid')"/></xsl:attribute>
				        <xsl:attribute name="fmfn"><xsl:value-of select="cfxsl:getNodeValue(linkurl,'filename')"/></xsl:attribute>
				        <xsl:attribute name="secdoc"><xsl:value-of select="cfxsl:getNodeValue(linkurl,'secure_doc')"/></xsl:attribute>
			            <xsl:attribute name="edms_document"><xsl:value-of select="cfxsl:getNodeValue(linkurl,'edms_document')"/></xsl:attribute>
						<xsl:attribute name="rowselected"></xsl:attribute>
						<!-- 폴더 이동 때문에 추가된 attribute 시작-->
						<xsl:attribute name="subject"><xsl:value-of select="title"/></xsl:attribute>
						<xsl:attribute name="initiator_name"><xsl:value-of select="picreator"/></xsl:attribute>
						<xsl:attribute name="initiator_unit_name"><xsl:value-of select="picreatordept"/></xsl:attribute>
						<xsl:attribute name="listid"><xsl:value-of select="listid"/></xsl:attribute>
			            <xsl:attribute name="linkkey"><xsl:value-of select="linkkey"/></xsl:attribute>
			            <xsl:attribute name="wfmode"><xsl:value-of select="wfmode"/></xsl:attribute>
			            <xsl:attribute name="deputystate"><xsl:value-of select="deputystate"/></xsl:attribute>
						<!-- 폴더 이동 때문에 추가된 attribute 끝-->
						<td  nowrap="true" style="padding-left:10px;overflow:hidden; paddingRight:1px;display:none;" onselect="false" onmousedown="noResponse();" class="BTable_bg08">
						    <input type="checkbox" id="chkAPV" name="chkAPV"></input>
						    <%--<xsl:value-of select="substring(wfmode,1,1)"/>--%>
						</td>
						<td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08">
                            <a href="#" onclick="javascript:OpenApprovalLine(this)" class="text02_L" >	
    						<xsl:attribute name="piid"><xsl:value-of select="cfxsl:getPINodeValue(linkurl,1)"/></xsl:attribute>
    						<xsl:attribute name="scid"><xsl:value-of select="cfxsl:getNodeValue(linkurl,'schemaid')"/></xsl:attribute>
    						<xsl:attribute name="fmpf"><xsl:value-of select="cfxsl:getNodeValue(linkurl,'prefix')"/></xsl:attribute>
    						<xsl:attribute name="fmrv"><xsl:value-of select="cfxsl:getNodeValue(linkurl,'revision')"/></xsl:attribute>
    						<xsl:attribute name="fiid"><xsl:value-of select="cfxsl:getNodeValue(linkurl,'instanceid')"/></xsl:attribute>
                           <img src="<%=Session["user_thema"] %>/Covi/Common/btn_type2/btn_lookdc.gif" width="14" height="14" border="0" align="absmiddle" covimode="imgctxmenu">
                           </img>
		                	</a> 						
						    <a href="javascript:event_GalTable_ondblclick()" class="text02_L"><xsl:value-of select="title"/></a>
						</td>
						<td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08"><xsl:value-of select="completedate"/></td>
						<td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08"><xsl:value-of select="picreatordept"/></td>
						<td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08">
		                	<xsl:value-of select="picreator"/>
					    <% if (this.Page.Application["ContextMenu_USER_YN"].ToString() == "Y")
                                        { %>
		                	
							   <a href="#" onclick="javascript:OpenContextMenu4Approval(this)" class="text02_L"  onmouseout="MM_swapImgRestore()">		
							   <xsl:attribute name="onmouseover">
							   <xsl:text>MM_swapImage('Image</xsl:text>
							   <xsl:value-of select="position()" />
							   <xsl:text>','','<%=Session["user_thema"] %>/Covi/Common/icon/icon_writer_on.gif',1)</xsl:text>
							   </xsl:attribute>
    							<xsl:attribute name="person_code"><xsl:value-of select="picreatorid"/></xsl:attribute>
							   <img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_writer_off.gif" border="0" align="absmiddle" covimode="imgctxmenu">
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
		                	<%} %>
						</td>
						<td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08"><xsl:value-of select="fmnm"/></td>
						<!--<td class="tableDot" height="21" valign="top" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="ugrs"/><xsl:value-of select="cfxsl:getIsPaper(string(ispaper))"/><xsl:value-of select="cfxsl:getRequestResponse(string(rqrs))"/></td>-->
						</tr>
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
   		</TBODY>        
     </table>
</xsl:template>
</xsl:stylesheet>