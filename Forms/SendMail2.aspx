<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SendMail2.aspx.cs" Inherits="Approval_Forms_SendMail2" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title></title>
    <link type="text/css" rel="stylesheet" href="/GwImages/RED/CSS/css_style.css" />
    <link type="text/css" rel="stylesheet" href="/GwImages/RED/CSS/search.css" />
    <link type="text/css" rel="stylesheet" href="/GwImages/RED/CSS/button.css" />

</head>
 <script language="javascript" type="text/javascript">
    
    var xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP");
    var m_evalXML = new ActiveXObject("MSXML2.DOMDocument");
    var subject;
    var body;
    var email;
    var ssss="";
    function winload(){
        /*
	    if (window.dialogArguments != null){
		    var objWinDlgArgs = window.dialogArguments;
		    title.value = objWinDlgArgs["tSubject"];
		    subject = objWinDlgArgs["tSubject"];
		    body = objWinDlgArgs["tBody"];
		    email = objWinDlgArgs["tEmail"];
	    }
	    */
	    //다음에서는 그냥 오프너로 받자.
    //	txtbody.value = opener.sContents.innerHTML;
	    //title.value = opener.outdoc_submit.innerHTML;
    	document.getElementById("txtSubject").value = opener.outdoc_submit.innerHTML;
	    opener.CloseWindows();
    }

    
    function sendmail(){
	    try{
	        if(document.getElementById("txtReceive").value == "")
	        {
	            alert("받는사람 메일주소를 입력해주세요");
	            return false;
	        }
	        else if(document.getElementById("txtSubject").value == "")
	        {
	            alert("제목을 입력해주세요");
	            return false;
	        }
	        document.getElementById("hdnReceive").value = document.getElementById(el_txtReceive).value;
	        
		    var szURL = "SendMail.aspx";
		    var szText = "<MAIL>";
		        szText+="<RECEIVER><![CDATA[" + document.getElementById("hdnReceive").value  + " ]]></RECEIVER>";
			    szText+="<TITLE><![CDATA[대외공문 메일발송]]></TITLE>";
                szText+="<SUBJECT><![CDATA[" + document.getElementById(el_txtSubject).value + "]]></SUBJECT>";
                szText+="<CONTENT><![CDATA[" + document.getElementById("tbContentElement").HtmlValue + "]]></CONTENT>";
                szText+= "</MAIL>";
    		
		    evalXML(szText);
		    requestHTTP("POST",szURL,true,"text/xml",receiveHTTP,szText);					
	    }catch(e){
		    alert("Error : "+e.description + "\r\nError number: " + e.number);
	    }	
    }
    function evalXML(sXML){
	    if(!m_evalXML.loadXML(sXML)){
		    var err = m_evalXML.parseError;
		    throw new Error(err.errorCode,"desc:"+err.reason+"\nsrctxt:"+err.srcText+"\nline:"+err.line+"\tcolumn:"+err.linepos);
	    }
    }
    function receiveHTTP(){
	    if(xmlHTTP.readyState==4){
		    xmlHTTP.onreadystatechange=event_noop;
		    if(xmlHTTP.responseText.charAt(0)=='\r'){
			    alert(xmlHTTP.responseText);
		    }else{
			    var errorNode=xmlHTTP.responseXML.selectSingleNode("response/error");
			    if(errorNode!=null){
							//alert("Desc: " + errorNode.text);
							alert("메일전송이 실패하였습니다.");
						}else{
							alert("메일전송이 완료되었습니다.");
							window.close();
						}
		    }
	    }
    }
    function makeNode(sName,vVal,bCData){
	    return "<"+sName+">"+(bCData?"<![CDATA[":"")+vVal+(bCData?"]]>":"")+"</"+sName+">";
    }
    function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	    xmlHTTP.open(sMethod,sUrl,bAsync);
	    xmlHTTP.setRequestHeader("Accept-Language","ko");
	    xmlHTTP.setRequestHeader("Content-type", sCType);
	    if(pCallback!=null)xmlHTTP.onreadystatechange = pCallback;
	    (vBody!=null)?xmlHTTP.send(vBody):xmlHTTP.send();
    }
    function event_noop(){return(false);}
        
    </script>
<body> 
    <form id="form1" runat="server">
    
    <div id="divMenu" class="Approval_Btn">
        <!--버튼 시작-->
        <div style="width: 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_group03_left.gif" /></div>
        <div style="width: 780px; height: 31px; background: url(<%=Session["user_thema"] %>/Covi/Common/btn/btn_group03_bg.gif); padding-top: 4px">
            <!--다음 대외공문 메일발송   -->
            <span id="btOTransMail" name="cbBTN"  onclick="javascript:sendmail();"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_appmail.gif" align="middle" /><span id="spanOTransMail">SEND MAIL</span></a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
            <!-- 닫기 -->
            <span id="btExit" name="cbBTN" onclick="javascript:window.close();"><a href="#" class="Btn_Group03"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon03_close.gif" align="middle" />CLOSE</a><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_Group01_line.gif" align="absmiddle" class="btn_line" /></span>
        </div>
        <div style="width: 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_group03_right.gif" /></div>
        <!--버튼 끝-->
    </div>    
        <!--입력폼 시작-->
        <div class="Search">            
         <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#eeeeee">
            <tr>
              <td align="left" style="padding-left:5px;"><!-- 검색 시작 -->
                <table border="0" cellspacing="0" cellpadding="0" width="100%">
                  <tr>
                    <td class="blt01"><b>받는 사람</b></td>
                    <td>&nbsp;<CoviWebControls:CoviTextBox ID="txtReceive" runat="server" Width="700px" CssClass="type-text" />
                        <input name="hdnReceive" type="hidden" style="height:20;width:350;" readonly>
                    </td>
                  </tr>
                  <tr>
                    <td height="1" class="BTable_bg03" colspan="2"></td>
                  </tr>
                  <tr>
                    <td class="blt01"><b>제목</b></td>
                    <td>&nbsp;<CoviWebControls:CoviTextBox ID="txtSubject" runat="server" Width="700px" CssClass="type-text" /></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
        <!--입력폼 끝-->

        <!--태그프리 시작-->
        <div id="DhtmlBody" name="DhtmlBody">
            <script language="JScript" FOR="tbContentElement" EVENT="OnControlInit">
                    tbContentElement.HtmlValue = opener.sContents.innerHTML;
                    
                    winload();
            </script>  
	    </div>
        <!--태그프리 끝-->
    </form>
    <script type="text/javascript" language="javascript" src="editControl.js"></script>
</body>
</html>
