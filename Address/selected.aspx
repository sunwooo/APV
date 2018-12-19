<%@ Page Language="C#" AutoEventWireup="true" CodeFile="selected.aspx.cs" Inherits="COVIFlowNet_Address_selected" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <script type="text/javascript" language="javascript" src="/coviweb/SiteReference/js/Utility.js"></script>
    <script type="text/javascript" src="showModalDialogCallee.js"></script>
</head>
<body leftmargin="5" topmargin="0" scroll="no">
	<table id='idmaintable' class='maintable' cellpadding='2' cellspacing='0' border="0" style="width:100%;height:100%;" >
		<tr id='trList' name="trList" class='SelList' style="display:none">
			<td valign="center" width="10px" nowrap>
				<Input type="radio" name="radRecips" value="To">TO<br>
				<Button id="btnAdd" onClick="addClicked(0);">&nbsp;>>&nbsp;</Button><br>
				<Button id="btnRemove" onClick="removeClicked(0);">&nbsp;<<&nbsp;</Button>
			</td>
			<td>
				<div class="rim">
					<DIV id='divGalTable' name="0" class='divgaltable'>
						<TABLE id='tblGalInfo' name="0" class='gallisttable' cellpadding='2' cellspacing='0'>
							<thead>
								<tr>
									<td class="table_mgraybg" height="20px">이름</td>
									<td class="table_mgraybg" height="20px">직급</td>																
									<td class="table_mgraybg" height="20px">직책</td>
									<td class="table_mgraybg" height="20px">부서</td>
								</tr>
							</thead>
							<tbody></tbody>
						</TABLE>
					</DIV>
				</div>
			</td>
		</tr>
		<tr id='trList' name="trList" class='SelList' style="display:none">
			<td valign="center" width="10px" nowrap>
				<Input type="radio" name="radRecips" value="CC">CC<br>
				<Button id="Button1" onClick="addClicked(1);">&nbsp;>>&nbsp;</Button><br>
				<Button id="Button2" onClick="removeClicked(1);">&nbsp;<<&nbsp;</Button>
			</td>
			<td>
				<div class="rim">
					<DIV id='divGalTable' name="1" class='divgaltable'>
						<TABLE id='tblGalInfo' name="1" class='gallisttable' cellpadding='2' cellspacing='0'>
							<thead>
								<tr>
									<td class="table_mgraybg" height="20px">이름</td>
									<td class="table_mgraybg" height="20px">직급</td>																
									<td class="table_mgraybg" height="20px">직책</td>
									<td class="table_mgraybg" height="20px">부서</td>
								</tr>
							</thead>
							<tbody></tbody>
						</TABLE>
					</DIV>
				</div>
			</td>
		</tr>
		<tr id='trList' name="trList" class='SelList' style="display:none">
			<td valign="center" width="10px" nowrap>
				<Input type="radio" name="radRecips" value="BCC">BCC<br>
				<Button id="Button3" onClick="addClicked(2);">&nbsp;>>&nbsp;</Button><br>
				<Button id="Button4" onClick="removeClicked(2);">&nbsp;<<&nbsp;</Button>
			</td>
			<td>
				<div class="rim">
					<DIV id='divGalTable' name="2" class='divgaltable'>
						<TABLE id='tblGalInfo' name="3" width="100%" border="0" cellspacing="0" cellpadding="0">
							<thead>
								<tr>
									<td class="table_mgraybg" height="20px" width="25%">&nbsp;이름</td>
									<td class="table_mgraybg" height="20px" width="25%">직급</td>																
									<td class="table_mgraybg" height="20px" width="25%">직책</td>
									<td class="table_mgraybg" height="20px" width="25%">부서</td>
								</tr>
							</thead>
							<tbody></tbody>
						</TABLE>
					</DIV>
				</div>
			</td>
		</tr>
		<!-- 이름 ,직급, 직책, 부서-->
		<tr id='trList' name="trList" style="width:100%;height:100%;display:none"  >
			<td valign="center" width="10px" nowrap="t">
				<img id="Img3" onclick="addClicked(3);" src="<%=Session["user_thema"] %>/COVI/Common/btn_type2/btn_right01.gif" width="20" height="20" align="absmiddle" alt="<%= Resources.Approval.btn_add %>">
				<br /><br />
				<img id="Img4"  onclick="removeClicked(3);" src="<%=Session["user_thema"] %>/COVI/Common/btn_type2/btn_left01.gif" width="20" height="20" align="absmiddle" alt="<%= Resources.Approval.btn_delete %>">
			</td>
			<td style="width:100%;height:100%;"  valign="top" >
			<div class="popup_line BTable_bg01"></div>
				<table cellpadding="0" cellspacing="0"  border="0" style="width:100%;height:100%;">
					<tr>
						<td valign="top">
							<div>
								<DIV id='divGalTable' name="3" class='iframe_border' style="overflow-x:hidden;overflow-y:auto;width:100%;height:100%;">
									<TABLE id='tblGalInfo' name="3" width="100%" border="0" cellspacing="0" cellpadding="0">
										<thead>
											<tr class="BTable_bg02" style="height:25px">
												<td width="25%" ><%=Resources.Approval.lbl_username%></td>
												<td width="25%" ><%=Resources.Approval.lbl_jobposition%></td>																
												<td width="25%" ><%=Resources.Approval.lbl_jobtitle%></td>
												<td width="25%" ><%=Resources.Approval.lbl_dept%></td>
											</tr>
										</thead>
										<tbody></tbody>
									</TABLE>
								</DIV>
							</div>
						</td>
					</tr>
				</table>
			</td>
		</tr>		
		<tr id='trList' name="trList" style="width:100%;height:100%;display:none" >
			<td valign="middle" width="10px" nowrap>
				<img id="Img1" onclick="addClicked(4);" src="<%=Session["user_thema"] %>/COVI/Common/btn_type2/btn_right01.gif" width="20" height="20" align="absmiddle" alt="<%= Resources.Approval.btn_add %>">
				<br /><br />
				<img id="Img2"  onclick="removeClicked(4);" src="<%=Session["user_thema"] %>/COVI/Common/btn_type2/btn_left01.gif" width="20" height="20" align="absmiddle" alt="<%= Resources.Approval.btn_delete %>">
			</td>
			<td style="width:100%;height:100%;" valign="top" >
                <div class="popup_line BTable_bg01"></div>
				<div id='divGalTable' name="4" class="iframe_border">
					<TABLE id='tblGalInfo' name="4" width="100%"  border="0" cellspacing="0" cellpadding="0" class="BTable">
							<tr class="BTable_bg02" style="height:25px">
								<td width="10%"></td>
								<td width="40%"><%=Resources.Approval.lbl_dept%></td>																
								<td width="10%"></td>
								<td width="40%"><%=Resources.Approval.lbl_dept_parent%></td>
							</tr>
							<tr>
                                <td height="1" colspan="4" class="BTable_bg03"></td>
                            </tr>															
					</TABLE>
			    </div>								
			</td>
		</tr>

		<tr id='trList' name="trList" class='SelList'style="width:100%;height:100%;display:none" >
			<td valign="middle" width="10px" height="100%">
				<img id="btnadd" onclick="addClicked(3);" src="<%=Session["user_thema"] %>/COVI/Common/btn_type2/btn_right01.gif" width="20" height="20" align="absmiddle" alt="<%= Resources.Approval.btn_add %>">
				<br /><br />
				<img id="btndelete"  onclick="removeClicked(3);" src="<%=Session["user_thema"] %>/COVI/Common/btn_type2/btn_left01.gif" width="20" height="20" align="absmiddle" alt="<%= Resources.Approval.btn_delete %>">
			</td>
			<td style="width:100%;height:100%;"  valign="top" >
				<table cellpadding="0" cellspacing="0" border="0" style="width:100%;height:100%;" >						
					<tr>
						<td width="81" height="3" align="center" valign="top" class="tab_popline"></td>
					</tr>
					<tr>
						<td style="width:100%;height:100%;" align="center"  valign="top">
							<table cellpadding="0" cellspacing="0"style="width:100%;height:100%;"  style="border:1px #999999 solid;">
								<tr>
									<td valign="top" style="width:100%;height:100%;" >
										<div class="rim">
											<DIV id='divGalTable' name="5" class='divgaltable'>
												<TABLE id='tblGalInfo' name="5" width="100%"   class='gallisttable' cellpadding='2' cellspacing='0'>
													<thead>
														<tr>																
															<td class="table_mgraybg" height="20px" width="10%"></td>
															<td class="table_mgraybg" height="20px" width="40%"><%=Resources.Approval.lbl_dept%></td>																
															<td class="table_mgraybg" height="20px" width="10%"></td>
															<td class="table_mgraybg" height="20px" width="40%"><%=Resources.Approval.lbl_dept_parent%></td>
														</tr>	
													</thead>
													<tbody></tbody>
												</TABLE>
											</DIV>
										</div>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
	<Input type="hidden" name="radRecips" value="User" />
	<Input type="hidden" name="radRecips" value="Group" />
	<span id="tooltip" class="tooltip"></span>
	<script type="text/javascript" language="javascript" src="selected.js"></script>
	<script type="text/javascript" language="javascript">
        var msg_195 = "<%=Resources.Approval.msg_195 %>";
        var msg_196 = "<%=Resources.Approval.msg_196 %>";	
        var gLngIdx = <%=strLangIndex %>;
	</script>
</body>	
</html>
