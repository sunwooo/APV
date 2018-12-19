<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApvTotalApproval.aspx.cs" Inherits="Approval_ApvProcess_ApvTotalApproval" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title></title>
	<script type="text/javascript" language="javascript" src="../../common/script/CFL.js"></script>
	<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js" ></script>
</head>
<body>

<div class="popup_title">
  <div class="title_tl">
    <div class="title_tr">
      <div class="title_tc">
      <%--<h2><span id="lbl_Action"></span></h2></div>--%>
      <h2><span id="lbl_Action"><%= Resources.Approval.lbl_approvecomment_01 %></span></h2></div>
    </div>
  </div>
</div>
<div style="padding-left: 35px; padding-right: 20px;">
	<!-- 등록 div 시작 -->
	<div class="write">
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tr>
			  <td colspan="2" class="line"></td>
			</tr>
			<tr id="triptPassword" style="display:;">
			  <td class="title"><%=Resources.Approval.lbl_approvalpwd %></td>
			  <td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><input type="password" class="type-text" id="iptPassword" onKeyPress="if (event.keyCode==13) fn_approval();" style=" width: 150px;" /><span id="spAppName"></span></td>
			</tr>
			<tr id="trlinetPassword" style="display:none;">
			  <td colspan="2" class="line"></td>
			</tr>    
			<tr id="trSignImage" style="display:none;">
			  <td class="title"><%=Resources.Approval.lbl_signtype %></td>
			  <td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><span id="spanRdo" style="display:none;"><input type="radio" value="stamp" name="radSign" id="radSign" onclick="make_select('stamp')"><%=Resources.Approval.lbl_stamp %>	</span>						
				<input type="radio" value="sign" name="radSign" id="radSign" onclick="make_select('sign')"><%=Resources.Approval.lbl_sign %>	 				
				<input checked type="radio" value="usnm" name="radSign" id="radSign"  onclick="make_select('usnm')"><%=Resources.Approval.lbl_Name %>	 
				<select name="selImage" id="selImage" size="1"  onChange="setImage();" style="width:100%;display:none;">
				</select></td>
			</tr>
			<tr id="trlineSignImage" style="display:none;">
			  <td colspan="2" class="line"></td>
			</tr>
			<tr style="display:none;">
			  <td class="title"><%=Resources.Approval.lbl_comment %><br /><img src="<%=Session["user_thema"] %>/Covi/Common/icon/blank.gif" Name="selectImage" ID="selectImage" border="0" style="width:30px;height:30px" align="absmiddle"></td>
			  <td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><textarea id="txtComment" name="txtComment" style="width: 98%; height: 70px;"></textarea></td>
			</tr>
			<!--2011.03.22 시작 -->
			<tr style="display:none;">
			  <td colspan="2" class="line"></td>
			</tr>
			<tr style="display:none;">
			    <td class="title">memo</td>
			    <td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><textarea id="txtMemo" name="txtMemo" style="width: 98%; height: 30px;"></textarea></td>
			</tr>
			<!--2011.03.22 끝 -->
			<tr>
			  <td colspan="2" class="line"></td>
			</tr>
		  </table>
  </div>
    <!-- 등록 div 끝 -->
</div>
<div class="popup_Btn small" style=" text-align: right; padding-right: 20px;">
  <table border="0" cellspacing="0" cellpadding="0">
    <tr>
     <td><a href="#" class="Btn04" id="btOK" name="cbBTN" onclick="javascript:fn_approval();"><span id="btn_Action"><%= Resources.Approval.btn_confirm_approve %></span></a></td>
      <td><a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:parent.window.close();"><span><%= Resources.Approval.btn_close %></span></a></td>
    </tr>
  </table>
</div>	   
</body>
</html>

	
<script language="javascript" type="text/javascript">

function fn_approval() {
	var i,choice,comment, blastapprove,signimagetype; 		
   
    var sAddage = "<usid>"+"<%=Session["user_code"] %>"+"</usid>"+ "<actpwd>"+document.getElementById("iptPassword").value +"</actpwd>";
	var sText = "<request>"+sAddage+"</request>";
    var sTargetURL = "getProcessBizData.aspx";
	smode="password";
	requestHTTP("POST",sTargetURL,true,"text/xml",receiveHTTP,sText);
	
}

function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
			m_xmlHTTP.open(sMethod,sUrl,bAsync);
			//m_xmlHTTP.setRequestHeader("Accept-Language","ko");
			m_xmlHTTP.setRequestHeader( "Content-type", sCType);
			if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
			(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
		}
		
function receiveHTTP(){
	if(m_xmlHTTP.readyState==4){			
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			alert(m_xmlHTTP.responseText);
		}else{
		    if(m_xmlHTTP.responseXML!=null){
			    var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			    if(errorNode!=null){
				    if(errorNode.text.indexOf("<%=Resources.Approval.msg_102 %>") > -1){
					    //alert("결재암호가 틀립니다");
					    alert("<%=Resources.Approval.msg_102 %>");
					    document.getElementById("iptPassword").value="";
				    }else{
					    alert("Desc: " + errorNode.text);
				    }
			    }else
			    {//debugger;
		                    
                    window.returnValue = true;
                    window.close();

			    }
			}
		}
	}
}
		
</script>
