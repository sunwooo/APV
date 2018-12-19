<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SearchGoods.aspx.cs" Inherits="Approval_Popup_SearchGoods" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title></title>
	<link rel="stylesheet" href="/GWImages/common/css/approval_form.css" type="text/css" />
    <script type="text/javascript" language="javascript" src="../../Common/script/COVIFlowNet/openWindow.js" ></script>		
	<script type="text/javascript" language="javascript" src="../../common/script/CFL.js"></script>
	<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js" ></script>
    <script type="text/javascript" language="javascript" src="../Forms/formscript.js"></script>
</head>
<body>

<div class="popup_title">
  <div class="title_tl">
    <div class="title_tr">
      <div class="title_tc">
      <h2><span>품명 코드 조회</span></h2></div>
    </div>
  </div>
</div>
<div style="padding-left: 35px; padding-right: 20px;">
	<!-- 등록 div 시작 -->
	<div class="write">
        <table class="table_7" summary="검색" cellpadding="0" cellspacing="0">
            <tr>
                <th colspan="2">
                    <input checked type="radio" value="0" name="radSch1" id="radSch1" style="background:none;border:0;" />단종제외				
				    <input type="radio" value="1" name="radSch1" id="radSch1" style="background:none;border:0;" />단종포함
                </th>
            </tr>
            <tr>
                <th style="width:80px">제품명</th>
                <td>
                    <input type="text" id="schText" name="schText" tabindex="2" onkeyup="ExcuteClickEvent(this);" maxlength="50" style="width:240px; height:20px; border:0px;" />
                </td>
            </tr>
        </table>
        <div id="lyr_1" style="overflow-y:auto; border:0px; height:342px;">
        </div>
    </div>
    <!-- 등록 div 끝 -->
</div>
<div class="popup_Btn small AlignR" style=" text-align: right; padding-right: 20px;">
    <a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:parent.window.close();"><span><%= Resources.Approval.btn_close %></span></a>
</div>	   
</body>
</html>
<script language="javascript" type="text/javascript">
    var bcode = '<%= Request.QueryString["code"]  %>';
    var comCD = '<%= Request.QueryString["comCD"]  %>';
    window.onload = initOnload;
    function initOnload() {
    }

    function ExcuteClickEvent(obj) {
        if (event.keyCode == 13) {
            GetSearchKind();
        }
    }

    //거래처 검색
    function GetSearchKind() {
        var queryStr = "EXEC USP_GETSEARCHGOODS '" + bcode.substring(0, 2) + "', '" + bcode.substring(2, 4) + "', '" + comCD + "', '" + getRadio("radSch1") + "', '" + document.getElementById("schText").value + "'";
        var sXML = "<Items><connectionname>COVI_FLOW_SI_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + queryStr + "]]></sql></Items>";
        var szURL = "../Popup/getXMLQuery.aspx";

        var m_CurrxmlHTTP = new ActiveXObject("Microsoft.XMLHTTP");
        var m_CurrxmlHTTP2 = new ActiveXObject("MSXML2.DOMDocument");
        m_CurrxmlHTTP.open("GET", szURL, false);
        m_CurrxmlHTTP.send(sXML);

        if (m_CurrxmlHTTP.status != 200) {
            alert("ERROR : " + m_CurrxmlHTTP.statusText);
        }
        else {
            var elmList, elm;
            var elmListLan;
            var code1, code2;
            var name;
            var strTable = "";

            strTable += '<table class="table_7" summary="결과" cellpadding="0" cellspacing="0" style="margin-top:5px">';
            strTable += '    <tr>';
            strTable += '        <th style="width:80px">제품코드</th>';
            strTable += '        <th>제품명</th>';
            strTable += '    </tr>';

            m_CurrxmlHTTP2.loadXML(m_CurrxmlHTTP.responseXML.selectSingleNode("response/ROOT").xml);

            var returnVal = m_CurrxmlHTTP.responseXML.selectSingleNode("response/error");
            if (returnVal != null) {
                alert(returnVal.text);
            } else {
                var msg = m_CurrxmlHTTP2.documentElement.selectSingleNode("/ROOT/Table/MSG").text.replace(/(^\s*)|(\s*$)/gi, "");
                if (msg != "") {
                    alert(msg);
                }
                if (m_CurrxmlHTTP2.documentElement.selectSingleNode("/ROOT/Table/ERR") == "Y") {
                    return;
                }
                elmList = m_CurrxmlHTTP2.documentElement.selectNodes("/ROOT/Table1");
                for (var i = 0; i < elmList.length; i++) {
                    elm = elmList.nextNode();

                    code1 = elm.selectSingleNode("GW0801").text;
                    name = elm.selectSingleNode("GW0802").text;

                    strTable += '<tr>';
                    strTable += "    <td style='cursor:pointer' onDblclick=javascript:SetTextBox('" + code1 + "','" + name + "');>" + code1 + "</td>";
                    strTable += "    <td style='cursor:pointer' onDblclick=javascript:SetTextBox('" + code1 + "','" + name + "');>" + name + "</td>";
                    strTable += '</tr>';
                }

                if (elmList.length == 0)  //리턴데이터가 없을때
                {
                    strTable += "<tr><td colspan='2' align='center' style='padding-top:7px;'>해당 데이터가 없습니다</td></tr>";
                }

                strTable += '</table>';

                document.getElementById("lyr_1").innerHTML = strTable;
            }
        }
    }

    function SetTextBox(code1, name) {
        opener.document.getElementsByName("goodsCD")[0].value = code1;
        opener.document.getElementsByName("goodsNM")[0].value = name;
        self.close();
    }
</script>
