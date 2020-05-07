<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApvProcessDraft.aspx.cs" Inherits="COVIFlowNet_ApvProcess_ApvProcessDraft" validateRequest=false %>

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
      <h2><span id="lbl_Action"></span></h2></div>
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
			<tr>
				<td class="title"><%=Resources.Approval.lbl_comment %></td>
				<td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><textarea id="txtComment" name="txtComment" rows="10" style="width: 300px;"></textarea></td>
			</tr>
			
            <tr style="display:none;" id="tr_memo">
			    <td class="title">변경 사유</td>
			    <td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><textarea id="txtMemo" name="txtMemo" style="width: 300px; height: 30px;"></textarea></td>
			</tr>
            <tr>
				<td colspan="2" class="line"></td>
			</tr>
		</table>  
	 </div>
    <!-- 등록 div 끝 -->
</div>
<div class="popup_Btn small" style=" text-align: right; padding-right: 20px;">
    <a href="#" class="Btn04" id="btOK" name="cbBTN" onclick="javascript:fnOK();"><span id="btnOK"><%= Resources.Approval.btn_confirm %></span></a>
    <a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:parent.window.close();"><span><%= Resources.Approval.btn_close %></span></a>
</div>	   
<script type="text/javascript" language="javascript">
	    var sy = window.screen.height / 2 - 270;
		var sx = window.screen.width  / 2 - 660 / 2;
		window.moveTo(sx, sy);
	    var m_evalXML = CreateXmlDocument();
		var m_xmlHTTP=CreateXmlHttpRequest();
		var m_oApvList;
		var smode="sign";
		var bcomment = false;
		var scmttype = "<%=Request.QueryString["type"] %>";
		window.onload= initOnload;
        function initOnload(){
            var g_height = 310;
			m_oApvList = CreateXmlDocument();
			if(!m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+opener.document.getElementsByName("APVLIST")[0].value)){
				//alertParseError(m_oApvList.parseError);			
			}else{
			    //결재 외 의견을 받는 창으로 기능 확장 2007.07
			    if ( scmttype == "DRAFT" || scmttype == "RECREATE"){
        			getComment();
			    }
			}

            if(String(opener.parent.editor.location).indexOf("_read.htm") == -1 &&  opener.getInfo("loct") == "REDRAFT" ) //편집 모드
            {
                //2020.01.03 PSW 특정양식일 때 변경사유 입력 제거 
                if (opener.getInfo("fmpf").indexOf("WF_FORM_ISU_ACCOUNTING_") > -1) {
                    document.getElementById("tr_memo").style.display = "none";
                } else {
                    document.getElementById("tr_memo").style.display = "";
                    g_height = g_height+ 50;
                }
            }
            window.resizeTo(500,g_height+25);
		}	
		function getComment()
		{
		   
		    bcomment = false;
	        smode = "comment";
            var pXML = "SELECT COMMENT FROM WF_COMMENT WITH (NOLOCK) WHERE FORM_INST_ID ='" + parent.opener.getInfo("fiid") + "' AND USER_ID = '"+ parent.opener.getInfo("usid") +"'";
            var sXML = "<Items><connectionname>INST_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
            var szURL = "../getXMLQuery.aspx";
            requestHTTP("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTP, sXML);
			
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
				
					var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
					if(errorNode!=null){
						if(errorNode.text.indexOf("<%=Resources.Approval.msg_102 %>") > -1){
							//alert("결재암호가 틀립니다");
							alert("<%=Resources.Approval.msg_102 %>");
							iptPassword.value="";
						}else{
							alert("Desc: " + errorNode.text);
						}
					}else{
						if(smode=="comment"){
						    if (m_xmlHTTP.responseXML.selectSingleNode("response/NewDataSet/Table/COMMENT") == null){
						        bcomment = false;
						    }else{
						        //document.getElementById("txtComment").value = m_xmlHTTP.responseXML.selectSingleNode("response/NewDataSet/Table/COMMENT").text;
						        bcomment = true;
						    }
						}
					}
				}
			}
		}
		function event_noop(){return(false);}
        function fnOK() {//debugger;
            //alert(document.getElementById("txtComment").value);
	        var i,choice,comment, blastapprove,signimagetype; 		
             opener.document.getElementsByName("ACTIONINDEX")[0].value = "approve";
            if (scmttype == "DRAFT" || scmttype == "RECREATE"  ){ 
                // 의견 저장
                //fn_SaveComment('s');
                if(document.getElementById("txtComment").value != ""){
				    //결재선에 <comment> 추가 후 의견 저장
				    var oComment =  CreateXmlDocument();
				    oComment.loadXML("<?xml version='1.0' encoding='utf-8'?><root><comment><![CDATA[" + document.getElementById("txtComment").value + "]]></comment></root>");
				    var oCommentNode = oComment.documentElement.selectSingleNode("//comment");
    				if (scmttype == "DRAFT"){
				        var eml= m_oApvList.documentElement.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step/ou/person/taskinfo[@kind='charge']");
				        if (eml != null){
				            var emlComment = eml.selectSingleNode("comment");
				            if(emlComment != null){
					            var delemlComment =  eml.removeChild(emlComment);
				            }
    			            eml.appendChild(oCommentNode.cloneNode(true));
				        }
				    }else{
    			        opener.document.getElementsByName("ACTIONCOMMENT")[0].value = document.getElementById("txtComment").value;
                        /*
                        debugger;
                        //2014-06-27 hyh 추가
					    m_evalXML.loadXML("<?xml version='1.0' encoding='utf-8'?>" + opener.getInfo("commentlist"));
					    //var commentRoot = m_evalXML.documentElement;
                        for (i = 0; i < m_evalXML.documentElement.childNodes.length; i++) {
					        if (m_evalXML.documentElement.childNodes[i].attributes[7].nodeValue.indexOf("rejectedtodept") > -1)
					            removeComment = m_evalXML.documentElement.childNodes[i];
					    }
					    //m_evalXML.documentElement.childNodes[i].parentNode.removeChild(m_evalXML.documentElement.childNodes[i]);

					    //getInfo("commentlist").replace(removeComment, "");
                    
					    //setInfo("commentlist", "");
					    //2014-06-27 hyh 추가 끝
                        */
				    }   
			        opener.document.getElementsByName("APVLIST")[0].value = m_oApvList.documentElement.xml;
			    }
			}else{ //기타 의견 받는 창에서는 의견만 받음
			    if ( document.getElementById("txtComment").value != ""){
			        opener.document.getElementsByName("ACTIONCOMMENT")[0].value = document.getElementById("txtComment").value;
			    }else{
			        alert("<%=Resources.Approval.msg_064 %>");
			        return;
			    }
			}
            if (String(opener.parent.editor.location).indexOf("_read.htm") == -1 &&  opener.getInfo("loct") == "REDRAFT" && document.getElementById("tr_memo").style.display == "") //편집 모드
            {
                if (document.getElementById("txtMemo").value == "") {
                    alert("변경 사유를 입력하세요");
                    return;
                }
            }
			opener.focus();
		//2007.07 결재의견 받는 창 확장
			if (opener.getInfo("mode") == "DRAFT" || opener.getInfo("mode") == "TEMPSAVE"){
    			opener.requestProcess("DRAFT");
			}else if(opener.getInfo("mode") == "REDRAFT" || opener.getInfo("mode") == "SUBREDRAFT"){
                opener.parent.editor.Modify_Comment = document.getElementById("txtMemo").value;
   	    		opener.requestProcess("RECREATE");
			}else{
   	    		opener.requestProcess(scmttype);
			}
		    window.close();
        }
        function fn_SaveComment(sCall){
            var blastapprove =  "false";
            var sKind="";    
            var sItems="<request>";
            var sUrl="../Comment/comment_apv.aspx";
            
            if(blastapprove == "true") sKind="lastapprove";
            else sKind="initiator";    
            
            sItems +="<call>"+ sCall +"</call>"
                    + "<fiid>" + parent.opener.getInfo("fiid") + "</fiid>"
                    + "<userid>" + parent.opener.getInfo("usid") + "</userid>"
                    + "<username><![CDATA[" + parent.opener.getInfo("usdn") + "]]></username>"
                    + "<kind>" + sKind + "</kind>"
                    + "<mode>" + parent.opener.getInfo("mode") + "</mode>"
                    + "<comment><![CDATA[" + document.getElementById("txtComment").value + "]]></comment>"
                    + "<save_path></save_path>";
            sItems+="</request>";
	        requestHTTP("POST",sUrl,true,"text/xml; charset=utf-8",receiveHTTP_Comment,sItems);
	        if (sCall=="d") document.getElementById("txtComment").value="";
        }

        function receiveHTTP_Comment(){
	        if(m_xmlHTTP.readyState==4){
		        m_xmlHTTP.onreadystatechange=event_noop;
		        if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			        //alert(m_xmlHTTP.responseText);
		        }else{
			        var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			        if(errorNode!=null){
				        alert("Desc: " + errorNode.text);
			        }else{	
			            //var Message = m_xmlHTTP.responseXML.selectSingleNode("response/message")
			            //if (Message!=null)	alert(Message.text);
			        }
		        }
	        }
        }
	
	</script>        	              
<script language="javascript" type="text/javascript">
    var szTitle="";			
	switch(scmttype){
	case "DRAFT":
		szTitle = "<%=Resources.Approval.lbl_draftcomment_01 %>"; //문서를 기안합니다.
		document.getElementById("btnOK").innerHTML = "<%=Resources.Approval.btn_confirm_draft %>"
		break;
	case "CHANGEAPV":	//	결재선변경
		szTitle = "<%=Resources.Approval.lbl_changeapprover %>";
		break;
	case "BYPASS":	//	결재선변경
		szTitle = "<%=Resources.Approval.lbl_changeapprover %>";
		break;						
	case "CHARGE":
		szTitle = "<%=Resources.Approval.lbl_Charger %>";
		break;
	case "RECREATE":
		szTitle = "<%=Resources.Approval.lbl_draftcomment_04 %>";//
		break;
	case "APPROVE":
		szTitle = "<%=Resources.Approval.lbl_approve %>";
		break;
	case "ITRANS":
		szTitle = "시행문변환";
	case "OTRANS":
		szTitle = "대외공문변환";
		break;
	case "SIGN":
		szTitle = "직인처리";
		break;
	case "TEMPSAVE":						
		szTitle = "임시저장";
		break;
	case "WITHDRAW":
		szTitle = "<%=Resources.Approval.lbl_draftcomment_02 %>";//"결재문서 취소";
		document.getElementById("btnOK").innerHTML = "<%=Resources.Approval.btn_Withdraw %>"
		break;
	case "ABORT":
		szTitle = "<%=Resources.Approval.lbl_draftcomment_02 %>";//"결재문서 취소";
		document.getElementById("btnOK").innerHTML = "<%=Resources.Approval.btn_draftabort %>"
		break;
	case "APPROVECANCEL":
		szTitle = "<%=Resources.Approval.lbl_draftcomment_03 %>";//"승인 취소";
		document.getElementById("btnOK").innerHTML = "<%=Resources.Approval.btn_approve_cancel %>"
		break;
	case "MONITOR":
		szTitle = "<%=Resources.Approval.lbl_Doc_OK %>";//결재문서 확인
		break;
    default:
        szTitle=  "<%=Resources.Approval.lbl_draftcomment_01 %>"; //"기안하기";
        break;
    }
    document.getElementById("lbl_Action").innerHTML = szTitle;
</script>		
</body>
</html>
