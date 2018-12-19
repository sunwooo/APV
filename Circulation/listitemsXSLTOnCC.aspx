<%@ Page Language="C#" AutoEventWireup="true" CodeFile="listitemsXSLTOnCC.aspx.cs" Inherits="COVIFlowNet_Circulation_listitemsXSLTOnCC" %><?xml version="1.0" encoding="utf-8" ?>

<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">
<xsl:output media-type="text/html"/>

<xsl:template match="response">
      <!-- 리스트 테이블 시작 -->
      <table id="tblGalInfo" width="100%" border="0" cellspacing="0" cellpadding="0" onselectstart="return false">
		<THEAD>
        <tr>
          <td height="1" colspan="6" class="BTable_bg01"></td>
        </tr>
        <tr class="BTable_bg02">
                    <th id="thAPV" noWrap="t" style="padding-left:10px;display:none;" width="30" class="BTable_bg07">
			            <input type="checkbox" id="chkAPVALL" name="chkAPVALL" onclick="javascript:chkAPVALL_onClick();"/><!--전체<%=Resources.Approval.lbl_total %>-->
			        </th>
					<th id="TD1"  onClick="sortColumn('KIND');" width="60" class="BTable_bg07"><%=Resources.Approval.lbl_gubun %><span id="spanKIND"></span></th><!--구분-->
					<th id="thBR" noWrap="t" width="180" onClick="sortColumn('FORM_NAME');" class="BTable_bg07"><%=Resources.Approval.lbl_formname%> <span id="spanFORM_NAME"></span></th><!--양식명-->
					<th id="thDN"  onClick="sortColumn('SUBJECT');" class="BTable_bg07"><%=Resources.Approval.lbl_subject %>  <span id="spanSUBJECT"></span></th><!--제목-->
					<th id="TD2"  width="110" onClick="sortColumn('SENDER_NAME');" class="BTable_bg07"><%=Resources.Approval.lbl_Sender %>  <span id="spanSENDER_NAME"></span></th>
					<th id="thAT" width="110" onClick="sortColumn('SEND_DATE');" class="BTable_bg07"><%=Resources.Approval.lbl_senddate%> <span id="spanSEND_DATE"></span></th>
        </tr>
        </THEAD>
        <TBODY>
		<xsl:choose>
			<xsl:when test="(count(forminstance)) = 0 ">
				<tr>
					<td colspan="6" align="center" class="BTable_bg08"><%=Resources.Approval.msg_101 %></td>
					<td  nowrap="true" style="overflow:hidden; paddingRight:1px;display:none;" onselect="false" class="BTable_bg08">
					    <input type="checkbox" id="Checkbox1" name="chkAPV"></input>
					</td>
				</tr>
			</xsl:when>
			<xsl:otherwise>
				<xsl:for-each select="forminstance">
					<tr  onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart">				
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
						<xsl:attribute name="rowselected"></xsl:attribute>
						<td  nowrap="true" style="overflow:hidden; padding-left:10px;display:none;" onselect="false" onmousedown="noResponse();" class="BTable_bg08">
						    <input type="checkbox" id="chkAPV" name="chkAPV"></input>
						</td>
						<td  nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08">
						    <a href="#" onclick="javascript:OpenApprovalLine(this)" class="text02_L" >	
    						<xsl:attribute name="piid"><xsl:value-of select="piid"/></xsl:attribute>
    						<xsl:attribute name="scid"><xsl:value-of select="scid"/></xsl:attribute>
						    <xsl:attribute name="fiid"><xsl:value-of select="fiid"/></xsl:attribute>
						    <xsl:attribute name="fmid"><xsl:value-of select="fmid"/></xsl:attribute>
						    <xsl:attribute name="fmpf"><xsl:value-of select="fmpf"/></xsl:attribute>
						    <xsl:attribute name="fmrv"><xsl:value-of select="fmrv"/></xsl:attribute>
    						
                           <img src="<%=Session["user_thema"] %>/Covi/Common/btn_type2/btn_lookdc.gif" width="14" height="14" border="0" align="absmiddle" covimode="imgctxmenu">
                           </img>
		                	</a>	
						    <xsl:value-of select="cfxsl:getKind(string(kind))"/>
						</td>
						<td  nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08"><xsl:value-of select="fmnm"/></td>
						<td  nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08"><a href="#" class="text02_L" ><xsl:value-of select="title"/></a></td><!-- onclick="event_GalTable_ondblclick()" -->
						<td  nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08">
						    <xsl:value-of select="picreatorid"/>
					    <% if (this.Page.Application["ContextMenu_USER_YN"].ToString() == "Y")
                                        { %>
                            <a href="#" onclick="javascript:OpenContextMenu4Approval(this)" class="text02_L"  onmouseout="MM_swapImgRestore()">	
                           <xsl:attribute name="onmouseover">
                           <xsl:text>MM_swapImage('Image</xsl:text>
                           <xsl:value-of select="position()" />
                           <xsl:text>','','<%=Session["user_thema"] %>/Covi/Common/icon/icon_writer_on.gif',1)</xsl:text>
                           </xsl:attribute>
    						<xsl:attribute name="person_code"><xsl:value-of select="picreator"/></xsl:attribute>
                           <img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_writer_off.gif" border="0" align="absmiddle"  covimode="imgctxmenu">
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
						<td  nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08"><xsl:value-of select="createdate"/></td>
					</tr>
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
   		</TBODY>        
     </table>
     </xsl:template>
</xsl:stylesheet>
