<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DocListItemsExcel.aspx.cs" Inherits="COVIFlowNet_Doclist_DocListItemsExcel" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>Untitled Page</title>
</head>
<body oncontextmenu="return false;" style="FONT-SIZE: 9pt" leftMargin="0" topMargin="0">
		<table border="0" width="100%" height="5" align="center">
			<tr>
				<td>&nbsp;</td>
			</tr>
			<tr>
				<td><%= strDocListName %>&nbsp;</td>
			</tr>
		</table>
		<table border="1" cellpadding="2" cellspacing="0" style="TABLE-LAYOUT: fixed;" width="100%" >
			<tr bgcolor="olive">		
<%
	switch (strDocListType)
	{
		case "1":
		%>
				<td align="center"><%= Resources.Approval.lbl_SerialNo%></td>
				<td align="center"><%= Resources.Approval.lbl_approvdate %></td>
				<td align="center"><%= Resources.Approval.lbl_DivNo %></td>
				<td align="center"><%= Resources.Approval.lbl_subject %></td>
		<%	//sXSLFile = "regdoclistXLS.xsl"; //"regdoclistExcelXSL.aspx";
			break;
		case "2":
					%>
				<td align="center"><%= Resources.Approval.lbl_SerialNo%></td>
				<td align="center"><%= Resources.Approval.lbl_RecvDate%></td>
				<td align="center"><%= Resources.Approval.lbl_send%></td>
				<td align="center"><%= Resources.Approval.lbl_DocNo%></td>
				<td align="center"><%= Resources.Approval.lbl_subject%></td>
				<td align="center"><%= Resources.Approval.lbl_ReceiverName%></td>
		<%	//sXSLFile = "recdoclistXLS.xsl";//"recdoclistExcelXSL.aspx";
			break;
		case "3":
								%>
				<td align="center"><%= Resources.Approval.lbl_RegisterNo%></td>
				<td align="center"><%= Resources.Approval.lbl_senddate%></td>
				<td align="center"><%= Resources.Approval.lbl_SendNo%></td>
				<td align="center"><%= Resources.Approval.lbl_DocName%></td>
				<td align="center"><%= Resources.Approval.lbl_DocPages%></td>
				<td align="center"><%= Resources.Approval.lbl_RecvDept%></td>
				<td align="center"><%= Resources.Approval.lbl_Sender%></td>
		<%	//sXSLFile = "pubregdoclistXLS.xsl";//"pubregdoclistExcelXSL.aspx";
			break;
		case "4":
											%>
				<td align="center"><%= Resources.Approval.lbl_SerialNo %></td>
				<td align="center"><%= Resources.Approval.lbl_receivedate %></td>
				<td align="center"><%= Resources.Approval.lbl_SenderName %></td>
				<td align="center"><%= Resources.Approval.lbl_DocNo %></td>
				<td align="center"><%= Resources.Approval.lbl_ManageDept %></td>
				<td align="center"><%= Resources.Approval.lbl_ReceiverName %></td>
				<td align="center"><%= Resources.Approval.lbl_Remark %></td>
				<td align="center"><%= Resources.Approval.lbl_ManageState %></td>
		<%	//sXSLFile = "pubrecdoclistXLS.xsl";//"pubrecdoclistExcelXSL.aspx";
			break;
		case "5":
			%>
				<td align="center"><%= Resources.Approval.lbl_SerialNo %></td>
				<td align="center"><%= Resources.Approval.lbl_date %></td>
				<td align="center"><%= Resources.Approval.lbl_receive %></td>
				<td align="center"><%= Resources.Approval.lbl_subject %></td>
				<td align="center"><%= Resources.Approval.lbl_Copies %></td>
				<td align="center"><%= Resources.Approval.lbl_Manager %></td>
				<td align="center"><%= Resources.Approval.lbl_app %></td>
			</tr>
			<tr bgcolor="olive">
				<td align="center"><%= Resources.Approval.lbl_Section %></td>
				<td align="center"><%= Resources.Approval.lbl_SectionChief %></td>
				<td align="center"><%= Resources.Approval.lbl_SectionHead %></td>
		<%	//sXSLFile = "sealdoclistXLS.xsl";//"sealdoclistExcelXSL.aspx";
			break;
		case "6":
			%>
				<td align="center"><%= Resources.Approval.lbl_SerialNo %></td>
				<td align="center"><%= Resources.Approval.lbl_ReceiptDate %></td>
				<td align="center"><%= Resources.Approval.lbl_send %></td>
				<td align="center"><%= Resources.Approval.lbl_subject %></td>
				<td align="center"><%= Resources.Approval.lbl_ReceiverName %></td>
		<%	//sXSLFile = "reqrecdoclistXLS.xsl";//"reqrecdoclistExcelXSL.aspx";
			break;
		case "7":
						%>
				<td align="center"><%= Resources.Approval.lbl_SerialNo %></td>
				<td align="center"><%= Resources.Approval.lbl_DocNo %></td>
				<td align="center"><%= Resources.Approval.lbl_RecvDept %></td>
				<td align="center"><%= Resources.Approval.lbl_subject %></td>
				<td align="center"><%= Resources.Approval.lbl_writer %></td>
				<td align="center"><%= Resources.Approval.lbl_senddate %></td>
		<%	//sXSLFile = "senddoclistXLS.xsl";// "senddoclistExcelXSL.aspx";
			break;
		case "8":
			%>
				<td align="center"><%= Resources.Approval.lbl_no%></td>
				<td align="center"><%= Resources.Approval.lbl_createdate%></td>
				<td align="center"><%= Resources.Approval.lbl_DocNo%></td>
				<td align="center"><%= Resources.Approval.lbl_subject %></td>
				<td align="center"><%= Resources.Approval.lbl_initiator%></td>
				<td align="center"><%= Resources.Approval.lbl_finalpprover%></td>
		<%	//sXSLFile = "notedoclistXLS.xsl";//"sealdoclistExcelXSL.aspx";
			break;
		case "9":
						%>
				<td align="center"><%= Resources.Approval.lbl_no%></td>
				<td align="center"><%= Resources.Approval.lbl_createdate%></td>
				<td align="center"><%= Resources.Approval.lbl_DocNo%></td>
				<td align="center"><%= Resources.Approval.lbl_subject%></td>
				<td align="center"><%= Resources.Approval.lbl_receiver%></td>
				<td align="center"><%= Resources.Approval.lbl_stempkind%></td>
				<td align="center"><%= Resources.Approval.lbl_initiator%></td>
				<td align="center"><%= Resources.Approval.lbl_finalpprover%></td>
				<td align="center"><%= Resources.Approval.lbl_gubun%></td>
		<%	//sXSLFile = "notesealdoclistXLS.xsl";// "officlaldocXSL.aspx";
			break;
		case "10":
			%>
				<td align="center"><%= Resources.Approval.lbl_SerialNo %></td>
				<td align="center"><%= Resources.Approval.lbl_DocNo %></td>
				<td align="center"><%= Resources.Approval.lbl_RecvDept %></td>
				<td align="center"><%= Resources.Approval.lbl_subject %></td>
				<td align="center"><%= Resources.Approval.lbl_writer %></td>
				<td align="center"><%= Resources.Approval.lbl_senddate %></td>
		<%	//sXSLFile = "senddoclistXLS.xsl";// "senddoclistExcelXSL.aspx";
			break;
		case "11":
			%>
				<td align="center"><%= Resources.Approval.lbl_SerialNo %></td>
				<td align="center"><%= Resources.Approval.lbl_DocNo %></td>
				<td align="center"><%= Resources.Approval.lbl_RecvDept %></td>
				<td align="center"><%= Resources.Approval.lbl_subject %></td>
				<td align="center"><%= Resources.Approval.lbl_writer %></td>
				<td align="center"><%= Resources.Approval.lbl_senddate %></td>
		<%	//sXSLFile = "senddoclistXLS.xsl";// "senddoclistExcelXSL.aspx";
			break;
	}
 %>	
		</tr>
		<%= strExcelList %>
		</table>
	</body>
</html>
