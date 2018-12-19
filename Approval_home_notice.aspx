<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Approval_home_notice.aspx.cs" Inherits="Approval_Approval_home_notice" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>NOTICE</title>
</head>
<body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0"> 	  
        <tr>
            <td width="48%" valign="middle">
		    <div class="sTitle"><%= Resources.Approval.lbl_notice %></div>
		   </td>
      </tr>
   </table>
 	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
		 <tr>
			<td width="5"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box04_top_left.gif" width="5" height="5" /></td>
			<td background="<%=Session["user_thema"] %>/Covi/Common/box/box04_top_bg.gif"></td>
			<td width="5"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box04_top_right.gif" width="5" height="5" /></td>
		 </tr>
		 <tr>
			<td background="<%=Session["user_thema"] %>/Covi/Common/box/box04_left_bg.gif"></td>
			<td bgcolor="#f5f5f5" style=" padding: 5px;"> 
				 
				 &nbsp;<b>1) 각종 청구 안내 </b>
				<br /> 
							&nbsp;&nbsp;- 전월 업무추진비청구는 금월 20일까지 기안지 양식을 사용 (결재라인 : 팀장 --> 부장 --> 관리부 참조 )
				<br /> 
							&nbsp;&nbsp;- 일반 경비청구 내역은 매주 수요일 지급합니다.
				<br /><br /> 
				 &nbsp;<b>2) 기타 </b>
				<br /> 
							&nbsp;&nbsp;- 오류사항이나 개선사항은 ProcessTeam 혹은 알리미(버그를 알려주세요, 개선사항을 알려주세요)로 문의바랍니다.
				<br /> 
				<%--***************************************************************************************************-
				 
				 &nbsp;<b>1) Request Form  </b>
				<br /> 
							&nbsp;&nbsp;- Payment term : Month-end + 45days after receipt of invoice
				<br /><br /> 
				 &nbsp;<b>2) Default Approval Line </b>
				<br /> 
							&nbsp;&nbsp;- Author --> Author's manager --> Division manager 
				<br /> 
				***************************************************************************************************--%>

			</td>
		  <td background="<%=Session["user_thema"] %>/Covi/Common/box/box04_right_bg.gif"></td>
		</tr>
		<tr>
		  <td width="5"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box04_bottom_left.gif" width="5" height="5" /></td>
		  <td background="<%=Session["user_thema"] %>/Covi/Common/box/box04_bottom_bg.gif"></td>
		  <td width="5"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box04_bottom_right.gif" width="5" height="5" /></td>
		</tr>
	  </table>
</body>
</html>
