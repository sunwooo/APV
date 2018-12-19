<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DeployListPopup2.aspx.cs" Inherits="ApvlineList_DeployListPopup2" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>배포 부서 목록</title>
</head>
<body>
	<form id="myForm" name="myForm" method="post" runat="server">
	<div class="popup_title">
      <div class="title_tl">
        <div class="title_tr">
          <div class="title_tc">
          <h2><span><%= Resources.Approval.lbl_deploy_list %></span></h2></div>
        </div>
      </div>
    </div>
    <table width="100%" border="0" cellpadding="0" cellspacing="0">
         <tr>
		    <td>						    
			    <table   width="100%"  cellpadding="0" cellspacing="0" border="0">
				    <tr class="BTable_bg02" style="height:25px">								    
					    <td width="5%">&nbsp;</td>
					    <td width="95%"><%= Resources.Approval.lbl_Dept_User %></td>									    
				    </tr>
				    <tr><td colspan="2" height='1' colspan='3' align='center' class='table_line'></td></tr>		
				   <tr><td colspan="2"><span id='DeployDeptList'></span></td></tr> 								   					   
			    </table>							                               
		    </td>
	    </tr>
    </table>
    <div class="popup_Btn small AlignR">
        <a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:window.close();"><span><%= Resources.Approval.btn_close %></span></a>
    </div>        	
    </form>
</body>
	<script language="javascript" type="text/javascript">
		var gLngIdx = <%=strLangIndex %>;
        window.onload= initOnload;
        function initOnload(){
		    var sbHtml ="";
		    var oUser;
		    var oSteps = opener.oList;
		    var oStepUsers = oSteps.selectNodes("root/*/item");
		    sbHtml = "<table width='100%'  border='0' cellspacing='0' cellpadding='0'>";
		    for(var i=0;i<oStepUsers.length;i++){
				oUser = oStepUsers.nextNode();
		        sbHtml+= "<tr  class='td_list_a'>";
		        sbHtml+= "<td width='5%' height='20px' nowrap='t' ></td>";
		        sbHtml+= "<td width='95%' height='20px' nowrap='t' >";
		        sbHtml+= getLngLabel(oUser.selectSingleNode("DN").text,false);
		        sbHtml+= "</td>";
		        sbHtml+= "</tr>";
			}
			sbHtml+= "</table>";	
			document.getElementById("DeployDeptList").innerHTML = sbHtml;
		}
		</script>
</html>
