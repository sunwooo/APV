<%@ Page Language="C#" AutoEventWireup="true" CodeFile="StampRightsList.aspx.cs" Inherits="Approval_ApvlineList_StampRightsList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
<link rel="stylesheet" href="<%=Session["user_thema"] %>/css/css_style.css" type="text/css" />
    <script type="text/javascript" language="javascript" src="../../common/script/jquery-1.6.1.min.js"></script>
    <script type="text/javascript" language="javascript">

        var gLanguage = "<%= strLangID %>";
        var gLangChoice = "<%= Resources.Approval.lbl_selection %>";
        var gLangEntName = "<%= Resources.Approval.lbl_EntName %>";
        var gLangUnitName = "<%= Resources.Approval.lbl_DeptName %>";
        var gLangJobPosition = "<%= Resources.Approval.lbl_jobposition %>";
        var gLangJobTitle = "<%= Resources.Approval.lbl_jobtitle %>";
        var gLangPersonName = "<%= Resources.Approval.lbl_username %>";

        var m_objResultWin;

        $(window).load(function () {

            if(parent.ListItems != undefined) 
    	        m_objResultWin = parent.ListItems;
	        else 
	            m_objResultWin = parent.parent.frames[3];//ListItems;	

            //DisplayList();
            queryGetData();


        });

        /*
        function DisplayList() {

            var sEntCode = "<%= Sessions.USER_ENT_CODE %>";

            var url = "/CoviWeb/Admin/CallBack.aspx";
            var param = "CODE=08&ENT_CODE=" + sEntCode;

            var xml = DoCallback(url, param);
            var result = xml.responseXML;

            var elmRoot = result.documentElement;
            //debugger;
            if (SelectSingleNode(elmRoot, "result") != "SUCEESS") {
                alert("[Error]\n\r\n\r" + SelectSingleNode(elmRoot, "result"));
                return;
            }
            else {
                try {
                    //다국어 (//"ko-KR" "en-US" "ja-JP" "zh-CN")  이한일;LEEHAN-IL;이한일;李漢日
                    var vLanIndex = 0;
                    if (gLanguage == "ko-KR")
                        vLanIndex = 0;
                    else if (gLanguage == "en-US")
                        vLanIndex = 1;
                    else if (gLanguage == "ja-JP")
                        vLanIndex = 2;
                    else if (gLanguage == "zh-CN")
                        vLanIndex = 3;

                    var sTable = "";
                    var vIdStamp = "";
                    var vEntNm = "";
                    var vEntCd = "";
                    var vPersonCode = "";
                    var vPersonName = "";
                    var vJobPosition = "";
                    var vJobTitle = "";
                    var vUnitName = "";

                    sTable += "<table border='0' cellspacing='0' cellpadding='0' style='TABLE-LAYOUT: fixed;' >";
                    sTable += "<tr><td colspan ='5' width='100%' height='1' class='BTable_bg01'></td></tr>";
                    sTable += "<tr class='BTable_bg02'>";
                    sTable += "<td width='20px' height='20' valign='middle' noWrap='t' class='BTable_bg07'><input type='checkbox' id='chkCheckAll' onclick='CheckAll();'</td>";  //선택
                    sTable += "<td width='100px' height='20' valign='middle' noWrap='t' class='BTable_bg07'>" + gLangPersonName + "</td>";  //성명
                    sTable += "<td width='80px' height='20' valign='middle' noWrap='t' class='BTable_bg07'>" + gLangJobPosition + "</td>";  //직위
                    sTable += "<td width='80px' height='20' valign='middle' noWrap='t' class='BTable_bg07'>" + gLangJobTitle + "</td>";  //직책
                    sTable += "<td width='180px' height='20' valign='middle' noWrap='t' class='BTable_bg07'>" + gLangUnitName + "</td>";  //부서
                    //sTable += "<td width='120px' height='20' valign='middle' noWrap='t' class='BTable_bg07'>"+gLangEntName+"</td>";  //회사
                    sTable += "</tr>";

                    $(elmRoot).find("Table").each(function (i) {
                        //debugger;
                        vIdStamp = $(this).find("ID_STAMP").text();
                        vEntNm = $(this).find("ENT_NAME").text().split(";")[vLanIndex];
                        vEntCd = $(this).find("ENT_CODE").text();
                        vPersonCode = $(this).find("PERSON_CODE").text();
                        vPersonName = $(this).find("PERSON_NAME").text().split(";")[vLanIndex];
                        if (vLanIndex == 0)  //한국어인경우
                            vJobPosition = $(this).find("JOB_POSITION").text().split(";")[0].split("&")[1];
                        else
                            vJobPosition = $(this).find("JOB_POSITION").text().split(";")[vLanIndex];
                        if (vLanIndex == 0)  //한국어인경우
                            vJobTitle = $(this).find("JOB_TITLE").text().split(";")[0].split("&")[1];
                        else
                            vJobTitle = $(this).find("JOB_TITLE").text().split(";")[vLanIndex];
                        vUnitName = $(this).find("UNIT_NAME").text().split(";")[vLanIndex];

                        sTable += "<tr>";
                        sTable += "<td height='25' class='BTable_bg08'><input type='checkbox' id='chkStamp_" + i + 1 + "' name='chkStamp' /></td>";
                        sTable += "<td align='center' nowrap='true' onselect='false' class='BTable_bg08'>" + vPersonName + "</td>";
                        sTable += "<td align='center' nowrap='true' onselect='false' class='BTable_bg08'>" + vJobPosition + "</td>";
                        sTable += "<td align='center' nowrap='true' onselect='false' class='BTable_bg08'>" + vJobTitle + "</td>";
                        sTable += "<td align='left' nowrap='true' onselect='false' class='BTable_bg08'>" + vUnitName + "</td>";
                        //sTable += "<td align='center' nowrap='true' onselect='false' class='BTable_bg08'>" + vEntNm + "</td>";
                        sTable += "</tr>";
                        sTable += "<tr><td colspan ='5' height='1' class='BTable_bg01'></td></tr>";
                    });

                    sTable += "</table>";

                    $("#spnList").html(sTable);

                } catch (e) {
                    alert(e.message);
                }
            }
        }

        //전체선택/전체해제
        function CheckAll() {

            if ($('#chkCheckAll').attr('checked')) {

                $("[name=chkStamp]").each(function (i) {
                    $(this).attr('checked', true);
                });
            }
            else {

                $("[name=chkStamp]").each(function (i) {
                    $(this).attr('checked', false);
                });
            }

        }
        */



        function queryGetData() {
            try {
                m_xmlHTTP = CreateXmlHttpRequest();
                var szURL = "";
               
                //var sEntCode = "<%= Sessions.USER_ENT_CODE %>";
                var sEntCode = parent.$("#SelEnt").val();

                var pXML = "dbo.ADM_SelectStampRightsByAppLine";
                var aXML = "<param><name>ENT_CODE</name><type>VarChar</type><length>100</length><value><![CDATA[" + sEntCode + "]]></value></param>";
                
                //다국어정보
                //aXML += "<param><name>LANGUAGE</name><type>VarChar</type><length>100</length><value><![CDATA[" + gUserLanguage + "]]></value></param>";

                sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath>org_memberquery.xsl</xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>" + aXML + "</Items>";
                szURL = "../address/getXMLQuery.aspx?Type=searchMember";
                
                requestHTTP("POST", szURL, true, "text/xml", event_listen_queryGetData, sXML);
            } catch (e) {
                alert("<%= Resources.Approval.msg_030 %>\nSource:gueryGetData() in search.htm\nNo:" + e.number + " Desc:" + e.description);
            }
        }
        function requestHTTP(sMethod, sUrl, bAsync, sCType, pCallback, vBody) {
            m_xmlHTTP.open(sMethod, sUrl, bAsync);
            //m_xmlHTTP.setRequestHeader("Accept-Language","ko");
            m_xmlHTTP.setRequestHeader("Content-type", sCType);
            if (pCallback != null) m_xmlHTTP.onreadystatechange = pCallback;
            (vBody != null) ? m_xmlHTTP.send(vBody) : m_xmlHTTP.send();
        }

        function event_noop() { return (false); }
        function event_listen_queryGetData() {
            if (m_xmlHTTP.readyState == 4) {
                doProgressIndicator(false);

                m_xmlHTTP.onreadystatechange = event_noop; //re-entrant gate
                if (m_xmlHTTP.responseText.charAt(0) == '\r') {
                    //alert("오류가 발생했습니다.\nSource:event_listen_queryGetData() in search.htm\n"+m_xmlHTTP.responseText);
                    alert("<%= Resources.Approval.msg_030 %>\nSource:event_listen_queryGetData() in search.htm\n" + m_xmlHTTP.responseText);
                } else {
                    var oDOM = m_xmlHTTP.responseXML;
                    var oErr = oDOM.documentElement.selectSingleNode("error");
                    if (oErr == null) {
                        m_objResultWin.processXmlData(oDOM);
                    } else {
                        //if(oErr.text!="none")alert("오류가 발생했습니다.\nSource:event_listen_queryGetData() in search.htm\n"+oErr.text);
                        if (oErr.text != "none") alert("<%= Resources.Approval.msg_030 %>\nSource:event_listen_queryGetData() in search.htm\n" + oErr.text);
                    }
                }
            }
        }

        function doProgressIndicator(fDisplay) {
            if (fDisplay) {
                m_objResultWin.addMessage("Searching...");
            } else {
                m_objResultWin.clearContents();
            }
        }

    </script>
</head>
<body>
    <form id="form1" runat="server">
    
        <div id="SubWidth">
            
            <!-- List 시작 -->
            <div style="width:750">
                <span id="spnList"></span>
            </div>
            <!-- List 끝 -->
        </div>

    </form>
</body>
</html>