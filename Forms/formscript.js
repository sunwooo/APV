//Select DataBinding
function BindSelectBox(queryStr, code, codeName) {
    var sXML = "<Items><connectionname>COVI_FLOW_SI_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + queryStr + "]]></sql></Items>";
    var szURL = "../Popup/getXMLQuery.aspx";

    var m_CurrxmlHTTP = CreateXmlHttpRequest();
    var m_CurrxmlHTTP2 = CreateXmlDocument();
    m_CurrxmlHTTP.open("GET", szURL, false);
    m_CurrxmlHTTP.send(sXML);

    if (m_CurrxmlHTTP.status != 200) {
        alert("ERROR : " + m_CurrxmlHTTP.statusText);
    }
    else {
        var elmList, elm;
        var elmListLan;
        var optStr = "";
        var value;
        var text;

        //m_CurrxmlHTTP2.loadXML(m_CurrxmlHTTP.responseXML.selectSingleNode("response/ROOT").xml);

        var returnVal = m_CurrxmlHTTP.responseXML.selectSingleNode("//response/error");
        if (returnVal != null) {
            alert(returnVal.text);
        } else {
            var msg = m_CurrxmlHTTP.responseXML.selectSingleNode("//ROOT/Table/MSG").text.replace(/(^\s*)|(\s*$)/gi, "");
            if (msg != "") {
                alert(msg);
            }
            if (m_CurrxmlHTTP.responseXML.selectSingleNode("//ROOT/Table/ERR") == "Y") {
                return;
            }
            elmList = m_CurrxmlHTTP.responseXML.selectNodes("//ROOT/Table1");
            for (var i = 0; i < elmList.length; i++) {
                elm = elmList.nextNode();
                if (code.indexOf("@") > -1) {
                    value = elm.selectSingleNode(code.split("@")[0]).text + elm.selectSingleNode(code.split("@")[1]).text;                    
                } else {
                    value = elm.selectSingleNode(code).text;
                }
                text = elm.selectSingleNode(codeName).text;
                optStr += "<option value=" + value + ">" + text + "</option>";
            }
            return optStr;
        }
    }
}

//데이터 추가 팝업
function ClickAddData(code) {
    var url = "../Popup/SearchAddData.aspx?code=" + code;
    openWindow(url, "AddDataPopup", 700, 554, "fix");
}

//거래처 검색 팝업
function ClickSearchCompany(code) {
    var url = "../Popup/SearchCompany.aspx?code=" + code;
    openWindow(url, "SearchCompanyPopup", 400, 518, "fix");
}

//품명 코드 조회 팝업
function ClickSearchGoods(code, comCD) {
    if (comCD == "") {
        alert("거래처를 입력하세요.");
        return;
    }
    var url = "../Popup/SearchGoods.aspx?code=" + code + "&comCD=" + comCD;
    openWindow(url, "SearchGoodsPopup", 400, 518, "fix");
}

//라디오 버튼 value
function getRadio(szname) {
    var _value = "";
    var objrdo = document.getElementsByName(szname);
    for (i = 0; i < objrdo.length; i++) {
        if (objrdo[i].checked) _value = objrdo[i].value;
    }
    return _value;
}

//치환(Replace) 함수 
function replaceChars(entry, orginVal, newVal) {
    temp = "" + entry;

    while (temp.indexOf(orginVal) > -1) {
        pos = temp.indexOf(orginVal);
        temp = "" + (temp.substring(0, pos) + newVal +
		temp.substring((pos + orginVal.length), temp.length));
    }
    return temp;
}

//거래처 검색
function GetSearchCompany(bcode, comCD) {
    var queryStr = "EXEC USP_GETSEARCHCOMPANY '" + bcode.substring(0, 2) + "', '" + bcode.substring(2, 4) + "', '" + comCD + "'";
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
        var code;
        var name;

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

                code = elm.selectSingleNode("GW0401").text;
                name = elm.selectSingleNode("GW0402").text;

                document.getElementsByName("comCD")[0].value = code;
                document.getElementsByName("comNM")[0].value = name;

                //                    document.getElementById("GW0421").value = elm.selectSingleNode("GW0421").text;
                //                    document.getElementById("GW0422").value = elm.selectSingleNode("GW0422").text;
                //                    document.getElementById("GW0423").value = elm.selectSingleNode("GW0423").text;

            }
        }
    }
}

//품명코드 검색
function GetSearchGoods() {
    var queryStr = "EXEC USP_GETSEARCHGOODSENTER '"
                + document.getElementsByName("WorkplaceCD")[0].value.substring(0, 2) + "', '"
                + document.getElementsByName("WorkplaceCD")[0].value.substring(2, 4) + "', '"
                + document.getElementsByName("comCD")[0].value + "', '"
                + document.getElementsByName("goodsCD")[0].value + "'";
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
        var code;
        var name;

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

                document.getElementsByName("goodsNM")[0].value = elm.selectSingleNode("GW0902").text;

            }
        }
    }
}

// 콤마세자리 찍기
function CFN_AddComma(objValue) {
    var objTemp = objValue;
    var objTempValue = '';
    var objFlag = '';
    objTemp = objTemp.replace(/,/g, '');
    if (objTemp.charAt(0) == '-') {
        objFlag = 'Y';
        objTemp = objTemp.substring(1);
    }
    if (objTemp.length > 3) {
        var tempV1 = objTemp.substring(0, objTemp.length % 3);
        var tempV2 = objTemp.substring(objTemp.length % 3, objTemp.length);
        if (tempV1.length != 0) {
            tempV1 += ',';
        }
        objTempValue += tempV1;
        for (i = 0; i < tempV2.length; i++) {
            if (i % 3 == 0 && i != 0) {
                objTempValue += ',';
            }
            objTempValue += tempV2.charAt(i);
        }
    } else {
        objTempValue = objTemp;
    }
    if (objFlag == 'Y') {
        objTempValue = '-' + objTempValue;
    }
    return objTempValue;
}

//금액세자리
function SetThreeCharComma(oTbx) {

    var oVal = oTbx.value;
    oTbx.value = CFN_AddComma(oVal);
}

//숫자만 입력
function CheckInteger() {
    var keyCode = window.event.keyCode;

    if ((keyCode < 48) || (keyCode > 57)) {
        event.returnValue = false;
        return;
    }
}

//사업장 찾기
function getWorkplaceCD() {
    var _return = "";
    var arrDeptPathId = getInfo("dppathid").split("\\");

    if (arrDeptPathId[2] != null) {
        _return = arrDeptPathId[2].replace("U_", "");
    }

    return _return;
}

