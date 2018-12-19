<%@ Page Language="C#" AutoEventWireup="true" CodeFile="selectApprover.aspx.cs" Inherits="COVIFlowNet_ApvProcess_selectApprover" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title><%=Resources.Approval.lbl_selection %></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="Cache-Control" content="no-cache" />
	<meta http-equiv="Pragma" content="no-cache" />
	<script type="text/javascript" language="javascript" src="/CoviWeb/common/script/COVIFlowNet/openWindow.js"></script>
	<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js" ></script>	
	</head>
	<body style="margin:0px 0px 0px 0px;">
    <div class="popup_title">
      <div class="title_tl">
        <div class="title_tr">
          <div class="title_tc">
          <h2><span><%= Resources.Approval.lbl_selection%></span></h2></div>
        </div>
      </div>
    </div>	
		<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0" ID="Table1">
			<tr>
                <td colspan="2" valign="top" class="pop_bg" height="27">
<%--                   <table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
                       <thead>
                            <tr>
                                <td height="2"  class="BTable_bg01"></td>
                            </tr>
                            <tr class="BTable_bg02" style="height:25px">
                                <td width="100%" valign="middle" align=center ><%= Resources.Approval.lbl_approver%></td>
                            </tr>
                            <tr>
                                <td height="1" class="BTable_bg03"></td>
                            </tr>
                        </thead>
                    </table> --%>                 
					<!--내용들어갈 테이블 시작  -->
                    <!-- [2013-11-14 PSW 수정] height="100px"-->
					<table width="100%" height="60px" border="0" cellspacing="0" cellpadding="0" align="center" id="Table2">
						<tr>
							<td bgcolor="#FFFFFF"  width="100%" height="60px" valign="top" align="center" id="applist">
							</td>
						</tr>
					</table>
					<!--내용들어갈 테이블 끝  -->
				</td>
			</tr>
		</table>
     
        <!-- 버튼_시작-->
        <div class="popup_Btn small AlignR">
            <a href="#" class="Btn04" id="btok" onclick="OK()"><span><%= Resources.Approval.btn_confirm%></span></a>
            <a href="#" class="Btn04" id="btclose" onclick="javascript:window.close();"><span><%= Resources.Approval.btn_close %></span></a>
        </div>	
        <!-- 버튼_끝-->   
		
		<script language="javascript" type="text/javascript">
	    <!--
		var sWIID="";
		var sName="";
		window.onload= initOnload;
        function initOnload(){
			var oStep, oPerson, oTaskInfo;
			var oApprovedSteps;
			var szTemp="";
			//var oApprovedSteps = opener.parent.processlist.m_oApvList.documentElement.selectNodes("step[@routetype='approve' and .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed')]");
			if (opener.m_oFormMenu.getInfo("mode") == "RECAPPROVAL"){
				oApprovedSteps = opener.m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed' and not(.//taskinfo/@rejectee))]");			
				for(var i=0;i < oApprovedSteps.length ; i++){
					oStep = oApprovedSteps.nextNode();
					if (oStep.getAttribute("allottype") != "parallel"){
					    oPerson = oStep.selectSingleNode("ou/person[taskinfo/@kind!='conveyance']");
					    oTaskInfo = oPerson.selectSingleNode("taskinfo");
					    if ( oTaskInfo.getAttribute("rejectee") != 'y'){
						    szTemp += '<input type="radio" value="' +oTaskInfo.getAttribute("wiid")+"@"+oPerson.getAttribute("name") + '"  name="radAction" id="radAction" style="WIDTH: 30;" onClick="chkAction(this);">' + opener.m_oFormMenu.getLngLabel(oPerson.getAttribute("name"),false) + '<br>';
					    }
					}
				}
            }else if ( opener.m_oFormMenu.getInfo("mode") == "SUBAPPROVAL"){
				oApprovedSteps = opener.m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[taskinfo/@status='pending']/ou[taskinfo/@status='pending' and taskinfo/@piid='" +opener.m_oFormMenu.getInfo("piid").toUpperCase() + "']/person[taskinfo/@kind!='review' and taskinfo/@kind!='bypass'  and taskinfo/@kind!='skip' and taskinfo/@kind!='conveyance' and (taskinfo/@status='completed' and not(taskinfo/@rejectee))]");
				for(var i=0;i < oApprovedSteps.length ; i++){
					oPerson = oApprovedSteps.nextNode();
					oTaskInfo = oPerson.selectSingleNode("taskinfo");
					if ( oTaskInfo.getAttribute("rejectee") != 'y'){
						szTemp += '<input type="radio" value="' +oTaskInfo.getAttribute("wiid")+"@"+oPerson.getAttribute("name") + '"  name="radAction" id="radAction" style="WIDTH: 30;" onClick="chkAction(this);">' + opener.m_oFormMenu.getLngLabel(oPerson.getAttribute("name"),false) + '<br>';
					}
				}
			}else{
				oApprovedSteps = opener.m_oApvList.documentElement.selectNodes("division[taskinfo/@status='pending']/step[@routetype='approve' and .//taskinfo/@kind!='charge' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='completed' and not(.//taskinfo/@rejectee))]");			
				for(var i=0;i < oApprovedSteps.length ; i++){
					oStep = oApprovedSteps.nextNode();
					if (oStep.getAttribute("allottype") != "parallel"){
					    oPerson = oStep.selectSingleNode("ou/person[taskinfo/@kind!='conveyance']");
					    oTaskInfo = oPerson.selectSingleNode("taskinfo");
					    if ( oTaskInfo.getAttribute("rejectee") != 'y'){
						    szTemp += '<input type="radio" value="' +oTaskInfo.getAttribute("wiid")+"@"+oPerson.getAttribute("name") + '"  name="radAction" id="radAction" style="WIDTH: 30;" onClick="chkAction(this);">' + opener.m_oFormMenu.getLngLabel(oPerson.getAttribute("name"),false) + '<br>';
					    }
					}
				}
			}

			document.getElementById("applist").innerHTML = szTemp;
			window.focus();
		}
		function OK() {
           
		    var oradAction = document.getElementsByName("radAction");
			for (var i = 0; i < oradAction.length ; i++)
			{
				if (oradAction[i].checked == true)
				{
				    
					opener.inputApprover(sWIID,opener.m_oFormMenu.getLngLabel(sName,false));//2011-05-16 다국어수정
					window.close();
					return;
				}
			}
			alert("<%=Resources.Approval.msg_291 %>"); //반려자를 선택하세요
			return;		    

		}
		function  chkAction(oRdo){
			var aApprove = oRdo.value.split("@");
			sWIID = aApprove[0];
			sName = aApprove[1];
		}
		//-->
		</script>
</body>
</html>
