<%@ Page Language="C#" AutoEventWireup="true" CodeFile="comment_view.aspx.cs" Inherits="COVIFlowNet_Comment_comment_view" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">	 

	<title></title>
    <link rel="stylesheet" href="/GWImages/Blue/CSS/css_style.css" type="text/css" />
    <style type="text/css">
        td.t1 {BORDER-RIGHT: a9a9a9 1px solid; BORDER-TOP: a9a9a9 1px solid; BORDER-LEFT: a9a9a9 1px solid; BORDER-BOTTOM: a9a9a9 1px solid; HEIGHT: 20px}
    </style>
	<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js" ></script>
    <script type="text/javascript" language="javascript" src="/CoviWeb/common/script/jquery-1.6.1.min.js"></script>
</head>
<body style="overflow:hidden;">
<div class="popup_title">
  <div class="title_tl">
	<div class="title_tr">
	  <div class="title_tc">
	  <h2><span><%= Resources.Approval.lbl_comment_view_instruction %></span></h2></div>
	</div>
  </div>
</div>
<div id="CommentList" style="height:340px; overflow:auto; margin-left:15px; " class="BTable">
</div>
<div class="popup_Btn small AlignR">
	<a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:parent.window.close();"><span><%= Resources.Approval.btn_close %></span></a>
</div>
<!-- 추가의견 -->
<textarea id="extcmt" name="extcmt" style="display:none;"><%=strCommentView %></textarea>
<!-- 추가의견 끝 -->
<!-- feedback의견 -->
<textarea id="feedbackcmt" name="feedbackcmt" style="display:none;"><%=strFeedbackView%></textarea>
<!-- feedback 추가의견 끝 -->
<!-- 메모 시작 -->
<textarea id="memocmt" name="memocmt" style="display:none;"><%=strMemo%></textarea>
<!-- 메모 끝 -->
<script  type="text/javascript" language="javascript">
	var gLngIdx = <%=strLangIndex %>;

	function makeProcessor(urlXsl){
		if (("ActiveXObject" in window) || window.ActiveXObject) {
			var oXslDom = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
			oXslDom.async = false;
			if(!oXslDom.load(urlXsl)){
				alertParseError(oXslDom.parseError);
				throw new Error(-1,"couldn't make TemplateProcessor with ["+urlXsl+"].");
			}
			var oXSLTemplate = new ActiveXObject("MSXML2.XSLTemplate");
			oXSLTemplate.stylesheet = oXslDom;
			return oXSLTemplate.createProcessor();
		}else{
			  var oXSL = "";
			  var oXslDom = CreateXmlDocument();
				var oXMLHttp =  CreateXmlHttpRequest();
				oXMLHttp.open("GET",urlXsl,false);
				oXMLHttp.send();
				//시간 늘리기
				delay(600);
				if ( oXMLHttp.status == 200){
				   var parser = new DOMParser();
				   oXslDom = parser.parseFromString(oXMLHttp.responseText,"text/xml");
				}
			var oProcessor = new XSLTProcessor();
			oProcessor.importStylesheet(oXslDom);
			return oProcessor;
		}
	}
	function delay(gap){/*gap is in milisecs*/
		var then, now;
		then = new Date().getTime();
		now=then;
		while((now-then)<gap)
		{
			now = new Date().getTime();
		}
	}	


	//var sComment = dialogArguments["objMessage"];
	var sComment = "<table width='98%' border='0' cellpadding='0' cellspacing='0' >";
	sComment +="<tr class='BTable_bg02' ><th class='BTable_bg07' width='25%' >"+opener.gLabel_dept+"</th>";
	sComment +="<th class='BTable_bg07' width='15%'  >"+opener.gLabel_username+"</th>";
	sComment +="<th class='BTable_bg07' width='20%' >"+opener.gLabel_approvdate+"</th>";
	sComment +="<th class='BTable_bg07' width='40%' >"+opener.gLabel_comment+"</th>";
	sComment +="</tr>";
	
	var m_oApvList =CreateXmlDocument();
	m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+opener.document.getElementsByName("APVLIST")[0].value);
	elmRoot = m_oApvList.documentElement;	

    //=== 현사용자가 수신부서 결재선자인지의 유무 (HIW)
    var sRowCnt = 0;
    var sRecDeptUserYN = "N";  
    if (opener.gProcessKind == "Cooperate" || opener.gProcessKind == true) {  //협조프로세스 20160310 jkh opener.gProcessKind == true 조건문 추가
        $($.parseXML(elmRoot.xml)).find("division").each(function () {
            /*
            if ($(this).attr("divisiontype") == "receive") {
                $(this).find("step").each(function (j, stepNode) {
                    if ($(stepNode).find("person").attr("code") == getInfo("ptid"))
                        sRecDeptUserYN = "Y";
                });
            }
            */
            if ($(this).attr("divisiontype") == "receive" && $(this).attr("oucode") == opener.getInfo("dpid")) {
                sRecDeptUserYN = "Y";
               
            }
        });
    }
    //===============================================
    	
	if (elmRoot != null){
		var elmList;
		if(window.addEventListener){
			//elmList = elmRoot.selectNodes("division/step/ou/*[name()='person' or name()='role']/taskinfo/comment");
            elmList = elmRoot.selectNodes("division/step/ou/(person|role)/taskinfo/comment");
		}else{
			elmList = elmRoot.selectNodes("division/step/ou/(person|role)/taskinfo/comment");
		}
		for(var i=0; i<elmList.length; i++){
			var  elm = elmList.nextNode();

            //== 수신부서에서는 수신부서 의견만 보이게 (2012-11-22 HIW) ======
            var bProceed = false;

            if (sRecDeptUserYN == "Y") {
                if (elm.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("divisiontype") == "receive" && opener.getInfo("dpid") == elm.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("oucode"))  //수신부서코멘트이고 로그인사용자부서가 수신부서인 경우
                    bProceed = true;
                else
                    bProceed = false;
            }
            else {
                bProceed = true;
            }
            //===============================================================
          
            if (bProceed) {
                sRowCnt++;
			    sComment +="<tr> <td class='BTable_bg08' valign='top' width='20%'>"+getLngLabel(elm.parentNode.parentNode.getAttribute("ouname"),false)+"</td>";
			    sComment +="<td class='BTable_bg08' valign='top' width='20%'>"+getLngLabel(elm.parentNode.parentNode.getAttribute("name"),false)+"</td>";
			    if(elm.parentNode.getAttribute("datecompleted") == null)
			    {//alert(0);
				    sComment += "<td class='BTable_bg08' valign='top' width='20%'>" + opener.parent.editor.formatDate(elm.getAttribute("datecommented")) + "</td>";
			    }
			    else
			    {//alert(1);
				    //alert(opener.location);
				    //alert(opener.parent.location);
				    sComment += "<td class='BTable_bg08' valign='top' width='20%'>" + opener.parent.editor.formatDate(elm.parentNode.getAttribute("datecompleted")) + "</td>";
			    }
			    sComment +="<td class='BTable_bg08' width='40%' height='100%' style='padding-left:4; word-break:break-all'>"+elm.text.replace(/\n/g,"<br />")+"</td>";
			    sComment +="</tr>";
            }
		}
	}


//2014-08-12 hyh 추가
if (opener.getInfo("commentlist").indexOf("rejectedtodept") > -1) {
if(opener.getInfo("gloct")=="DEPART"){
                        var m_Comment = CreateXmlDocument();
                        m_Comment.loadXML("<?xml version='1.0' encoding='utf-8'?>" + opener.getInfo("commentlist"));
                        var m_CommentList = m_Comment.selectNodes("WF_COMMENT/comment_list");
                        //for (var i = 0; i < m_CommentList.length; i++) {
                            var comment_list = m_CommentList[m_CommentList.length-1].getAttribute("INSERT_DATE").replace("T", " ").substring(0, m_CommentList[m_CommentList.length-1].getAttribute("INSERT_DATE").replace("T", " ").indexOf("."));
                            var commentList = m_CommentList[m_CommentList.length-1].getAttribute("COMMENT");
                            if (m_CommentList[m_CommentList.length-1].getAttribute("COMMENT").indexOf("rejectedtodept") > -1) {
				                var dpdn = commentList.split("&")[2];
                                var usdn = commentList.split("&")[3];
                                var uspn = commentList.split("&")[4];
				                var sStr = m_CommentList[m_CommentList.length-1].getAttribute("COMMENT").split("&rejectedtodept")[0];
				                //부서내 반송 추가 2015-07-16 
                                var DEPT = commentList.split(";");
                                   if (opener.gProcessKind == "Cooperate")
                                   {
                                       
                                        if(opener.getInfo("dpdsn")!=DEPT[2])
                                        {
                                          //sComment +="<tr> <td class='BTable_bg08' valign='top' width='20%'>"+getLngLabel(m_CommentList[m_CommentList.length-1].getAttribute("COMMENT").split("rejectedtodept&")[1].split("&")[0] ,false)+"</td>";
	   		                              //sComment +="<td class='BTable_bg08' valign='top' width='20%'>"+getLngLabel(m_CommentList[m_CommentList.length-1].getAttribute("USER_NAME").split(";")[0],false)+"</td>";
 			                              //sComment += "<td class='BTable_bg08' valign='top' width='20%'>" + m_CommentList[m_CommentList.length-1].getAttribute("INSERT_DATE").split("T")[0] + "</td>";
  			                              //sComment +="<td class='BTable_bg08' width='40%' height='100%' style='padding-left:4; word-break:break-all'>"+sStr.replace(/\n/g,"<br />")+"</td>";
   			                              //sComment +="</tr>";
                                        }
                                        else
                                        {
                                         sComment +="<tr> <td class='BTable_bg08' valign='top' width='20%'>"+getLngLabel(m_CommentList[m_CommentList.length-1].getAttribute("COMMENT").split("rejectedtodept&")[1].split("&")[0] ,false)+"</td>";
	   		                             sComment +="<td class='BTable_bg08' valign='top' width='20%'>"+getLngLabel(m_CommentList[m_CommentList.length-1].getAttribute("USER_NAME").split(";")[0],false)+"</td>";
 			                             sComment += "<td class='BTable_bg08' valign='top' width='20%'>" + m_CommentList[m_CommentList.length-1].getAttribute("INSERT_DATE").split("T")[0] + "</td>";
  			                             sComment +="<td class='BTable_bg08' width='40%' height='100%' style='padding-left:4; word-break:break-all'>"+sStr.replace(/\n/g,"<br />")+"</td>";
   			                             sComment +="</tr>";
                                        }
                                    }
                                    else
                                    {
                                         sComment +="<tr> <td class='BTable_bg08' valign='top' width='20%'>"+getLngLabel(m_CommentList[m_CommentList.length-1].getAttribute("COMMENT").split("rejectedtodept&")[1].split("&")[0] ,false)+"</td>";
	   		                             sComment +="<td class='BTable_bg08' valign='top' width='20%'>"+getLngLabel(m_CommentList[m_CommentList.length-1].getAttribute("USER_NAME").split(";")[0],false)+"</td>";
 			                             sComment += "<td class='BTable_bg08' valign='top' width='20%'>" + m_CommentList[m_CommentList.length-1].getAttribute("INSERT_DATE").split("T")[0] + "</td>";
  			                             sComment +="<td class='BTable_bg08' width='40%' height='100%' style='padding-left:4; word-break:break-all'>"+sStr.replace(/\n/g,"<br />")+"</td>";
   			                             sComment +="</tr>";
                                       

                                    }
                                    //부서내 반송 추가 끝 2015-07-16 
                            }
                        //}
}
                    }

//2014-08-12 hyh 추가 끝

	if (opener.getInfo("mode") == "COMPLETE") {
        //20110526 변경시작
		var m_oCMT = CreateXmlDocument();
		m_oCMT.loadXML(document.getElementById("extcmt").value);
		
		var elmListcmt = m_oCMT.documentElement.selectNodes("Table");
		if(elmListcmt.length > 0 ){
        
			for(var i=0; i < elmListcmt.length ; i++){
				var  elm = elmListcmt.nextNode();
				sComment +="<tr> <td class='BTable_bg08' width='25%' >"+(elm.selectSingleNode("USER_NAME").text.indexOf("@")>-1?getLngLabel(elm.selectSingleNode("USER_NAME").text.split("@")[1],false):"&nbsp;")+"</td>";
				sComment +="<td class='BTable_bg08' width='15%'>"+(elm.selectSingleNode("USER_NAME").text.indexOf("@")>-1?getLngLabel(elm.selectSingleNode("USER_NAME").text.split("@")[0],false):getLngLabel(elm.selectSingleNode("USER_NAME").text,false))+"</td>";
				sComment +="<td class='BTable_bg08' width='20%'>"+opener.parent.editor.formatDate(elm.selectSingleNode("INSERT_DATE").text) + "</td>";
				sComment +="<td class='BTable_bg08' width='40%' height='100%' style='padding-left:4; word-break:break-all'>"+elm.selectSingleNode("COMMENT").text.replace(/\n/g,"<br />")+"</td>";
				sComment +="</tr>";
			}
		}
        //20110526 변경 끝
   	}
	sComment +="</table>";
	if(opener.getInfo("mode") == "COMPLETE" && opener.getInfo("feedback") == "1"){
    
		sComment += "<br /><table width='98%' border='0' cellpadding='0' cellspacing='0' >";
		sComment +="<tr  >";
		sComment +="<td  width='100%' style='font-weight:bold;'>Feedback "+opener.gLabel_comment+"</td>";
		sComment +="</tr></table>";
		sComment += "<table width='98%' border='0' cellpadding='0' cellspacing='0' >";
		sComment +="<tr class='BTable_bg02' >";
		sComment +="<th class='BTable_bg07' width='25%' >"+opener.gLabel_dept+"</th>";
		sComment +="<th class='BTable_bg07' width='15%' >"+opener.gLabel_username+"</th>";
		sComment +="<th class='BTable_bg07' width='20%' >"+opener.gLabel_approvdate+"</th>";
		sComment +="<th class='BTable_bg07' width='40%' >"+opener.gLabel_comment+"</th>";
		sComment +="</tr>";
		var m_oCMT = CreateXmlDocument();
		m_oCMT.loadXML(document.getElementById("feedbackcmt").value);
		
		var elmListfeedback = m_oCMT.documentElement.selectNodes("Table");
		if(elmListfeedback.length > 0 ){
			for(var i=0; i < elmListfeedback.length ; i++){
				var  elm = elmListfeedback.nextNode();
               
				sComment +="<tr> <td class='BTable_bg08' width='25%' >"+getLngLabel(elm.selectSingleNode("USER_NAME").text.split("@")[1],false)+"</td>";
				sComment +="<td class='BTable_bg08' width='15%'>"+getLngLabel(elm.selectSingleNode("USER_NAME").text.split("@")[0],false)+"</td>";
				sComment +="<td class='BTable_bg08' width='20%'>"+opener.parent.editor.formatDate(elm.selectSingleNode("INSERT_DATE").text) + "</td>";
				sComment +="<td class='BTable_bg08' width='40%' height='100%' style='padding-left:4; word-break:break-all'>"+elm.selectSingleNode("COMMENT").text.replace(/\n/g,"<br />")+"</td>";
				sComment +="</tr>";
			}
		}else{
			sComment +="<tr> <td class='BTable_bg08' colspan='4' >"+"<%=Resources.Approval.msg_215  %>"+"</td>";
			sComment +="</tr>";
		}
	    sComment +="</table>";
	}
	
	if(opener.getInfo("mode") != "COMPLETE"){
//		var m_oCMT = CreateXmlDocument();
//		m_oCMT.loadXML(document.getElementById("memocmt").value);
//		
//		var elmListfeedback = m_oCMT.documentElement.selectNodes("Table");
//		if(elmListfeedback.length > 0 ){
//		    sComment += "<br /><table width='98%' border='0' cellpadding='0' cellspacing='0' >";
//		    sComment +="<tr  >";
//		    sComment +="<td  width='100%' style='font-weight:bold;'>Memo</td>";
//		    sComment +="</tr></table>";
//		    sComment += "<table width='98%' border='0' cellpadding='0' cellspacing='0' >";
//		    sComment +="<tr class='BTable_bg02' >";
//		    sComment +="<th class='BTable_bg07' width='25%' >"+opener.gLabel_dept+"</th>";
//		    sComment +="<th class='BTable_bg07' width='15%' >"+opener.gLabel_username+"</th>";
//		    sComment +="<th class='BTable_bg07' width='20%' >"+opener.gLabel_approvdate+"</th>";
//		    sComment +="<th class='BTable_bg07' width='40%' >"+opener.gLabel_comment+"</th>";
//		    sComment +="</tr>";
//			for(var i=0; i < elmListfeedback.length ; i++){
//				var  elm = elmListfeedback.nextNode();
//				sComment +="<tr> <td class='BTable_bg08' width='25%' >"+getLngLabel(elm.selectSingleNode("USER_NAME").text.split("@").length>1?elm.selectSingleNode("USER_NAME").text.split("@")[1]:"",false)+"</td>";
//				sComment +="<td class='BTable_bg08' width='15%'>"+getLngLabel(elm.selectSingleNode("USER_NAME").text.split("@")[0],false)+"</td>";
//				sComment +="<td class='BTable_bg08' width='20%'>"+opener.parent.editor.formatDate(elm.selectSingleNode("INSERT_DATE").text) + "</td>";
//				sComment +="<td class='BTable_bg08' width='40%' height='100%' style='padding-left:4; word-break:break-all'>"+elm.selectSingleNode("COMMENT").text.replace(/\n/g,"<br />")+"</td>";
//				sComment +="</tr>";
//			}
//    	    sComment +="</table>";
//		}
	}
	document.getElementById("CommentList").innerHTML =sComment;

    //if(sRowCnt == 1)  //HIW
       // self.close();

	</script>
</body>
</html>
