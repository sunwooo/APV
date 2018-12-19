<%@ Page Language="C#" AutoEventWireup="true" CodeFile="MonitorGraphicXSL.aspx.cs" Inherits="COVIFlowNet_ApvMonitor_MonitorGraphicXSL" %><?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"	
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="urn:cfxsl">
	<xsl:param name="lngindex">0</xsl:param>
    <xsl:template match="/">
		<div id="divgraphic" name="divgraphic" class="iframe_border">
			<table align="center" border="0" width="100%" height="100%">
				<tr>
					<xsl:apply-templates select="steps/division/step" />
				</tr>
			</table>
		</div>
	</xsl:template>
	<xsl:template match="step">
		<td height="100%" valign="middle" align="center">
			<xsl:choose>
				<xsl:when test="@routetype='approve' and @allottype='parallel' and (@unittype='person' or @unittype='role')">
					<table  width="100%" height="100%">
						<tr>
							<td valign="middle" align="center">
								<xsl:for-each select="ou">
									<xsl:apply-templates select="person|role" />
								</xsl:for-each>
							</td>
						</tr>
					</table>
				</xsl:when>
				<xsl:when test="@routetype='consult' and (@unittype='person' or @unittype='role')">
					<table  width="100%" height="100%">
						<tr>
							<td valign="middle" align="center">
								<xsl:for-each select="ou">
									<xsl:apply-templates select="person|role" />
								</xsl:for-each>
							</td>
						</tr>
					</table>
				</xsl:when>
				<xsl:when test="@routetype='assist' and @unittype='person'">
					<table  width="100%" height="100%">
						<tr>
							<td valign="middle" align="center">
								<xsl:for-each select="ou">
									<xsl:apply-templates select="person" />
								</xsl:for-each>
							</td>
						</tr>
					</table>
				</xsl:when>
				<xsl:when test="@unittype='role'">
					<xsl:apply-templates select="ou/role" />
				</xsl:when>
				<xsl:when test="@unittype='ou'">
					<table border="0"  width="100%" height="100%">
						<tr>
							<td valign="middle" align="center">
								<xsl:for-each select="ou">
									<xsl:apply-templates select="taskinfo" />
									<br />
									<xsl:value-of select='cfxsl:splitNameExt(@name,$lngindex)' />
									<br />
									<xsl:value-of select='cfxsl:convertDate(taskinfo/@datecompleted)' />
									<br />
									<xsl:choose>
										<xsl:when test="taskinfo/@kind='charge'">
											<%=Resources.Approval.lbl_Draft %>
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select='cfxsl:convertResult(taskinfo/@kind,taskinfo/@result)' />
										</xsl:otherwise>
									</xsl:choose>
									<br />
								</xsl:for-each>
							</td>
						</tr>
						<xsl:choose>
							<xsl:when test="@routetype='receive'">
								<tr>
									<td>
										<table  width="100%" height="100%">
											<tr>
												<xsl:for-each select="ou/*[taskinfo]">
													<td valign="middle" align="center">
														<xsl:choose>
															<xsl:when test="taskinfo/@status='pending'">
																<img src="<%=Session["user_thema"] %>/COVI/approval/workitem.gif" />
															</xsl:when>
															<xsl:when test="taskinfo/@status='inactive'">
																<img src="<%=Session["user_thema"] %>/COVI/approval/workitem_dim.gif" />
															</xsl:when>
															<xsl:when test="taskinfo/@status='completed' or taskinfo/@status=''">
																<img src="<%=Session["user_thema"] %>/COVI/approval/workitem_pre.gif" />
															</xsl:when>
															<xsl:otherwise>
																<img src="<%=Session["user_thema"] %>/COVI/approval/workitem_dim.gif" />
															</xsl:otherwise>
														</xsl:choose>
														<br />
														<xsl:value-of select='cfxsl:splitNameExt(@name,$lngindex)' />
														<br />
														<xsl:value-of select='cfxsl:convertDate(taskinfo/@datecompleted)' />
														<br />
														<xsl:choose>
															<xsl:when test="taskinfo/@kind='charge'">
													            <%=Resources.Approval.lbl_Draft %>
												            </xsl:when>            
															<xsl:otherwise>
																<xsl:value-of select='cfxsl:convertResult(taskinfo/@kind,taskinfo/@result)' />
															</xsl:otherwise>
														</xsl:choose>
													</td>
													<xsl:if test="not(position()=last())">
														<td width="20" align="center"><img src="<%=Session["user_thema"] %>/COVI/common/icon/icon_next.gif" /></td>
													</xsl:if>
												</xsl:for-each>
											</tr>
										</table>
									</td>
								</tr>
							</xsl:when>
						</xsl:choose>
					</table>
				</xsl:when>
				<xsl:otherwise>
					<xsl:choose> 
						<xsl:when test="ou/*/taskinfo/@status='pending'">
							<img src="<%=Session["user_thema"] %>/COVI/approval/workitem.gif" />
						</xsl:when>
						<xsl:when test="ou/*/taskinfo/@status='inactive'">
							<img src="<%=Session["user_thema"] %>/COVI/approval/workitem_dim.gif" />
						</xsl:when>
						<xsl:when test="ou/*/taskinfo/@status='completed'">
							<img src="<%=Session["user_thema"] %>/COVI/approval/workitem_pre.gif" />
						</xsl:when>
						<xsl:otherwise>
							<img src="<%=Session["user_thema"] %>/COVI/approval/workitem_dim.gif" />
						</xsl:otherwise>								
					</xsl:choose>
					<br />
					<xsl:value-of select='cfxsl:splitNameExt(ou/@name,$lngindex)' />
					<br />
					<xsl:value-of select='cfxsl:splitNameExt(ou/*/@name,$lngindex)' />
			    <% if (this.Page.Application["ContextMenu_USER_YN"].ToString() == "Y")
                                { %>
					
					<a href="#" onclick="javascript:OpenContextMenu4Approval(this)" class="text02_L"  onmouseout="MM_swapImgRestore()">		
					   <xsl:attribute name="onmouseover">
					   <xsl:text>MM_swapImage('Image</xsl:text>
					   <xsl:value-of select="position()" />
					   <xsl:text>','','<%=Session["user_thema"] %>/Covi/Common/icon/icon_writer_on.gif',1)</xsl:text>
					   </xsl:attribute>
						<xsl:attribute name="person_code"><xsl:value-of select="string(@code)"/></xsl:attribute>
					   <img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_writer_off.gif" width="20" height="11" border="0" align="absmiddle" covimode="imgctxmenu">
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
					<br />
					<xsl:value-of select='cfxsl:convertDate(ou/*/taskinfo/@datecompleted)' />
					<br />
					<xsl:choose>
						<xsl:when test="ou/*/taskinfo/@kind='charge'">
							<%=Resources.Approval.lbl_Draft %>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select='cfxsl:convertResult(ou/*/taskinfo/@kind,ou/*/taskinfo/@result)' />
						</xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
		</td>
		<xsl:if test="not(position()=last())">
			<td width="20" align="center"><img src="<%=Session["user_thema"] %>/COVI/common/icon/icon_next.gif" /></td>
		</xsl:if>
	</xsl:template>
	<xsl:template match="taskinfo">
		<xsl:choose>
			<xsl:when test="@status='pending'">
				<img src="<%=Session["user_thema"] %>/COVI/approval/workitem.gif" />
			</xsl:when>
			<xsl:when test="@status='inactive'">
				<img src="<%=Session["user_thema"] %>/COVI/approval/workitem_dim.gif" />
			</xsl:when>
			<xsl:otherwise>
				<img src="<%=Session["user_thema"] %>/COVI/approval/workitem_pre.gif" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="person">
		<xsl:choose>
			<xsl:when test="taskinfo/@status='pending'">
				<img src="<%=Session["user_thema"] %>/COVI/approval/workitem.gif" />
			</xsl:when>
			<xsl:when test="taskinfo/@status='inactive'">
				<img src="<%=Session["user_thema"] %>/COVI/approval/workitem_dim.gif" />
			</xsl:when>
			<xsl:otherwise>
				<img src="<%=Session["user_thema"] %>/COVI/approval/workitem_pre.gif" />
			</xsl:otherwise>
		</xsl:choose>
		<br />
		<xsl:value-of select='cfxsl:splitNameExt(@ouname,$lngindex)' />
		<br />
		<xsl:value-of select='cfxsl:splitNameExt(@name,$lngindex)' />
    <% if (this.Page.Application["ContextMenu_USER_YN"].ToString() == "Y")
                          { %>
		<!--<xsl:if test=" @code !='' ">-->
			<a href="#" onclick="javascript:OpenContextMenu4Approval(this)" class="text02_L"  onmouseout="MM_swapImgRestore()">		
           <xsl:attribute name="onmouseover">
           <xsl:text>MM_swapImage('Image</xsl:text>
           <xsl:value-of select="position()" />
           <xsl:text>','','<%=Session["user_thema"] %>/Covi/Common/icon/icon_writer_on.gif',1)</xsl:text>
           </xsl:attribute>
			<xsl:attribute name="person_code"><xsl:value-of select="string(@code)"/></xsl:attribute>
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
	    <!--</xsl:if>				-->
	    <%} %>
		<br />
		<xsl:value-of select='cfxsl:convertDate(taskinfo/@datecompleted)' />
		<br />
		<xsl:value-of select='cfxsl:convertResult(taskinfo/@kind,taskinfo/@result)' />
		<br />
	</xsl:template>
	<xsl:template match="role">
		<xsl:choose>
			<xsl:when test="taskinfo/@status='pending'">
				<img src="<%=Session["user_thema"] %>/COVI/approval/workitem.gif" />
			</xsl:when>
			<xsl:when test="taskinfo/@status='inactive'">
				<img src="<%=Session["user_thema"] %>/COVI/approval/workitem_dim.gif" />
			</xsl:when>
			<xsl:otherwise>
				<img src="<%=Session["user_thema"] %>/COVI/approval/workitem_pre.gif" />
			</xsl:otherwise>
		</xsl:choose>
		<br />
		<xsl:value-of select='cfxsl:splitNameExt(@ouname,$lngindex)' />
		<br />
		<xsl:value-of select='cfxsl:splitNameExt(@name,$lngindex)' />
		<br />
		<xsl:value-of select='cfxsl:convertDate(taskinfo/@datecompleted)' />
		<br />
		<xsl:value-of select='cfxsl:convertResult(taskinfo/@kind,taskinfo/@result)' />
		<br />
	</xsl:template>
</xsl:stylesheet>

