<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApvActForward.aspx.cs" Inherits="Approval_ApvProcess_ApvActForward" %>

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
      <h2><span><%=Resources.Approval.lbl_forward%></span></h2></div>
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
	            <td class="title"><%=Resources.Approval.lbl_to %></td>
	            <td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;">
                    <input type="text" class="type-text" id="txtName" name="txtName" style=" width: 150px;" />
                    <A href="javascript:addForward();"><IMG style="VERTICAL-ALIGN: middle; margin-top:-6px;" src="<%=Session["user_thema"] %>/common/devs/btn_search.gif" width=25 height=21></A>
                </td>
            </tr>
            <tr>
	            <td colspan="2" class="line"></td>
            </tr>    
            <tr>
	            <td class="title"><%=Resources.Approval.lbl_comment %><br /><img src="<%=Session["user_thema"] %>/Covi/Common/icon/blank.gif" Name="selectImage" ID="selectImage" border="0" style="width:30px;height:30px" align="absmiddle"></td>
	            <td style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;"><textarea id="txtComment" name="txtComment" style="width: 98%; height: 70px;"></textarea></td>
            </tr>
            <tr>
	            <td colspan="2" class="line"></td>
            </tr>
        </table>
    </div>
    <!-- 등록 div 끝 -->
</div>
<div class="popup_Btn small" style=" text-align: right; padding-right: 20px;">
    <a href="#" class="Btn04" id="btOK" name="cbBTN" onclick="javascript:fn_forward();"><span><%= Resources.Approval.btn_confirm_confirm %></span></a>
    <a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:parent.window.close();"><span><%= Resources.Approval.btn_close %></span></a>
</div>	   
</body>
</html>
<script language="javascript" type="text/javascript">
    var m_oFormMenu = opener;
    var m_oApvList = CreateXmlDocument();
    var elmRoot = CreateXmlDocument();
    var gMessage197 = "<%= Resources.Approval.msg_197 %>";

	window.onload= initOnload;
    function initOnload(){
		var g_height = 298;
        //window.resizeTo(600,g_height);  //주석처리 HIW
        var sy = window.screen.height / 2 - g_height;
        var sx = window.screen.width  / 2 - 600 / 2;
        window.moveTo(sx, sy);
        m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + m_oFormMenu.document.getElementsByName("APVLIST")[0].value);
	}

	function addForward() {
	    var m_sAddList = "charge";
	    if ((m_oFormMenu.getInfo("loct") == "REDRAFT") && (m_oFormMenu.getInfo("mode") == "REDRAFT" || m_oFormMenu.getInfo("mode") == "SUBREDRAFT")) {
	        m_sAddList = 'chargegroup';
	    } else {
	        m_sAddList = 'charge';
	    }
	    addList(m_sAddList);
	}

	function addList(sMode) {
	    var rgParams = null;
	    rgParams = new Array();
	    rgParams["bMail"] = false;
	    rgParams["bUser"] = (sMode == 'charge' ? true : false);
	    rgParams["bGroup"] = (sMode == 'charge' ? false : true);
	    rgParams["bRef"] = false;
	    rgParams["bIns"] = false;
	    rgParams["bRecp"] = false;
	    rgParams["sCatSignType"] = m_oFormMenu.gLabel__recieve_apv; //"수신결재"
	    rgParams["sDeptSignType"] = m_oFormMenu.gLabel_approve; 		//"일반결재"
	    rgParams["sDeptSignStatus"] = m_oFormMenu.gLabel_receive;   //"수신"
	    rgParams["sUserSignType"] = m_oFormMenu.gLabel_approve; 		//"일반결재"
	    rgParams["sUserSignStatus"] = m_oFormMenu.gLabel_inactive;  //"대기"
	    rgParams["objMessage"] = window;

	    var szFont = "FONT-FAMILY: '굴림';font-size:9px;";
	    var nWidth = 640;
	    var nHeight = 610;
	    var sFeature = szFont + "dialogHeight:" + nHeight + "px;dialogWidth:" + nWidth + "px;status:no;resizable:yes;help:no;";
	    var strNewFearture = m_oFormMenu.ModifyDialogFeature(sFeature);
	    var vRetval = window.showModalDialog("/COVIWeb/approval/address/address.aspx", rgParams, strNewFearture);
	}

    function insertToList(oList) {
        var m_oChargeList = CreateXmlDocument();
        m_oChargeList.loadXML(oList.xml);
        elmRoot = m_oChargeList.documentElement;
        var elmlist = elmRoot.selectNodes("item");
        if (elmlist.length == 0) {
            alert(gMessage54);
            return false;
        } else if (elmlist.length > 1) {
            alert(gMessage55);
            return false;
        } else {
            document.getElementsByName("txtName")[0].value = m_oFormMenu.getLngLabel(elmRoot.selectSingleNode("item/DN").text, false);
        }
    }

    function fn_forward() {
        if (confirm(gMessage197)) {
            try { m_oFormMenu.document.getElementsByName("CHARGEID")[0].value = elmRoot.selectSingleNode("item/AN").text; } catch (e) { }
            try { m_oFormMenu.document.getElementsByName("CHARGENAME")[0].value = m_oFormMenu.getLngLabel(elmRoot.selectSingleNode("item/DN").text, false); } catch (e) { }
            try { m_oFormMenu.document.getElementsByName("ACTIONCOMMENT")[0].value = document.getElementById("txtComment").value; } catch (e) { }
            m_oFormMenu.setForwardApvList(elmRoot);
            parent.window.close();
            m_oFormMenu.focus();
            m_oFormMenu.requestProcess('CHARGE');
            fn_SaveComment("s");
        }
    }

    function fn_SaveComment(sCall) {
        var blastapprove = fn_lastapproval();
        var sKind = "";
        var sItems = "<request>";
        var sUrl = "../Comment/comment_apv.aspx";

        if (blastapprove == "true") {
            sKind = "lastapprove";
        } else if (opener.getInfo("mode") == "REDRAFT") {
            sKind = "initiator";
        } else { sKind = "approve"; }

        sItems += "<call>" + sCall + "</call>"
            + "<fiid>" + parent.opener.getInfo("fiid") + "</fiid>"
            + "<userid>" + parent.opener.getInfo("usid") + "</userid>"
            + "<username><![CDATA[" + parent.opener.getInfo("usdn") + "@" + parent.opener.getInfo("dpdn") + "]]></username>"
            + "<kind>" + sKind + "</kind>"
            + "<mode>" + parent.opener.getInfo("mode") + "</mode>"
            + "<comment><![CDATA[" + document.getElementById("txtComment").value + "]]></comment>";
        sItems += "</request>";
        if (document.getElementById("txtComment").value != "") {
            requestHTTP("POST", sUrl, true, "text/xml; charset=utf-8", receiveHTTP_Comment, sItems);
        }
        if (sCall == "d") txtComment.value = ""
    }

    function receiveHTTP_Comment() {
        if (m_xmlHTTP.readyState == 4) {
            m_xmlHTTP.onreadystatechange = event_noop;
            if (m_xmlHTTP.responseText.charAt(0) == '\r') {
                //alert(m_xmlHTTP.responseText);
            } else {
                if (m_xmlHTTP.responseXML != null) {
                    var errorNode = m_xmlHTTP.responseXML.selectSingleNode("response/error");
                    if (errorNode != null) {
                        alert("Desc: " + errorNode.text);
                    } else {
                        var Message = m_xmlHTTP.responseXML.selectSingleNode("response/message")
                        if (Message != null) alert(Message.text);
                    }
                }
            }
        }
    }

    function fn_lastapproval() {
        var oPendingSteps = m_oApvList.documentElement.selectNodes("division/step[.//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='pending' or .//taskinfo/@status='reserved')]");
        //var oinActiveSteps = m_oApvList.documentElement.selectNodes("division/step[@routetype!='receive' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass' and .//taskinfo/@kind!='skip'  and .//taskinfo/@status='inactive']");
        var oinActiveSteps = m_oApvList.documentElement.selectNodes("division/step[.//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass' and .//taskinfo/@kind!='skip'  and .//taskinfo/@status='inactive']");
        if ((oPendingSteps.length == 1) && (oinActiveSteps.length == 0)) {
            return "true";
        } else {
            return "false";
        }
    }
</script>
