<%@ Page Language="C#" AutoEventWireup="true" CodeFile="comment.aspx.cs" Inherits="COVIFlowNet_ApvlineMgr_comment" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
</head>
<body>
<div class="popup_title">
  <div class="title_tl">
    <div class="title_tr">
      <div class="title_tc">
      <h2><%=Resources.Approval.lbl_comment_view_instruction %></h2>
      </div>
    </div>
  </div>
</div>
<div id="CommentList" name="CommentList" style="overflow:auto;HEIGHT:100%;WIDTH:100%;word-break:break-all; vertical-align:top;"></div>
<DIV ID="divComment" name="divComment" style="overflow:auto;HEIGHT:100%;WIDTH:100%;word-break:break-all;display:none"></DIV>
<div class="popup_Btn small" style=" text-align: right; padding-right: 20px;">
  <table border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td><a class="Btn04" href="#" id="btExit" onclick="window.close()" ><span><%= Resources.Approval.btn_close %></span></a></td>
    </tr>
  </table>
</div>
	<script language="javascript" type="text/javascript">
	    var sComment = dialogArguments["objMessage"];
	    var aComment = sComment.split("uri:\\\\");
	    if ( aComment.length == 1 ){
            //201107 의견조회 관련 수정
		   document.getElementById("CommentList").innerHTML = dialogArguments["objMessage"].replace(/\n/g,"<br />");	
		   document.getElementById("CommentList").style.height = "275px";
	    }else{
		    CommentList.innerHTML = aComment[0];
		    var aURL = aComment[1].split("<br>");
		    //ifrDL.Src = "http://"+window.document.host+aURL[0];
		    var oXMLHttp = new ActiveXObject("MSXML2.XMLHttp");
		    oXMLHttp.open("GET",aURL[0],false);
		    oXMLHttp.send();
		    document.getElementById("divComment").innerHTML = oXMLHttp.responseText.replace(/\n/g,"<br />");		
		    document.getElementById("divComment").style.display="";
	    }
	</script>
</body>
</html>
