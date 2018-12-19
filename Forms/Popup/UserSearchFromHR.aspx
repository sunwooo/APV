<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserSearchFromHR.aspx.cs" Inherits="Approval_Forms_Popup_UserSearchFromHR" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="stylesheet" href="/GWImages/common/css/approval_form.css" type="text/css" />
    <link rel="Stylesheet" href="/GWImages/Common/Css/css_style.css" type="text/css" />
    <style type="text/css">
        a.a1 {color:DarkOrange; text-decoration:underline}
    </style>

    <script type="text/javascript" language="javascript" src="/CoviWeb/common/script/jquery-1.6.1.min.js"></script>
    <script type="text/javascript" language="javascript">

        var gKind = "<%=gKind %>";
        var gDataRowNo = "<%=gDataRowNo %>";

        $(window).load(function () {

            $("#txtUserName").focus();
        });

        function ClickSearch() {

            $('#divTblHeader').css({ "display": "none" }); 

            var sTableStr = "";
            sTableStr += "<table cellpadding=0 cellspacing=0 ID='Table3' style='BORDER-RIGHT: #cccccc 1px solid; BORDER-TOP: #cccccc 1px solid; BORDER-LEFT: #cccccc 1px solid; BORDER-BOTTOM: #cccccc 1px solid;'>";
            sTableStr += "<tr>";
            sTableStr += "<td width='70' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;BORDER-BOTTOM: #cccccc 1px solid;'><b>사 번</b></td>";
            sTableStr += "<td width='100' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;BORDER-BOTTOM: #cccccc 1px solid;'><b>성 명</b></td>";
            sTableStr += "<td width='70' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;BORDER-BOTTOM: #cccccc 1px solid;'><b>직 위</b></td>";
            sTableStr += "<td width='250' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-BOTTOM: #cccccc 1px solid;'><b>소 속</b></td>";
            sTableStr += "</tr>";
            
            var url = "/CoviWeb/Approval/CallBack.aspx";
			//alert(opener.getInfo("fmpf"));
			var param = "";
			if(opener.getInfo("fmpf") == "WF_FORM_COMMON_CERTIFICATION"){
				param = "CODE=15&ENT_CODE=" + opener.getInfo("etid") + "&KEY_WORD="+escape($('#txtUserName').val());
			
			}else{
				var param = "CODE=05&ENT_CODE=" + opener.getInfo("etid") + "&KEY_WORD="+escape($('#txtUserName').val());
			}	
            var xml = DoCallback(url, param);
            var result = xml.responseXML;

            var elmRoot = result.documentElement;
            //debugger;
            if (SelectSingleNode(elmRoot, "result") != "SUCEESS") {
                alert("[Error]\n\r\n\r" + SelectSingleNode(elmRoot, "result"));
                return;
            }
            else {
                var vSabun = "";
                var vUserNm = "";
                var vJobPosition = "";
                var vDeptNm = "";
                var vDeptCd = "";
                var vEnterDate = "";

                try {
                    if ($(elmRoot).find("Table").length > 0) {
                        $(elmRoot).find("Table").each(function (i) {

                            vSabun = $(this).find("SABUN").text();
                            vUserNm = $(this).find("UserNm").text();
                            vJobPosition = $(this).find("JobPosition").text();
                            vDeptNm = $(this).find("DeptNm").text();
                            vDeptCd = $(this).find("DeptCd").text();
                            vEnterDate = $(this).find("ENTER_DATE").text();  //입사일자

                            sTableStr += "<tr>";
                            sTableStr += "<td align='center' style='BORDER-BOTTOM: #cccccc 1px solid; BORDER-RIGHT: #cccccc 1px solid;'><a class='a1' href='javascript:SetSabun(\"" + vSabun + "\",\"" + vUserNm + "\",\"" + vJobPosition + "\",\"" + vDeptNm + "\",\"" + vDeptCd + "\",\"" + vEnterDate + "\");'>" + vSabun + "</a></td>";
                            sTableStr += "<td style='padding-left:5; BORDER-BOTTOM: #cccccc 1px solid; BORDER-RIGHT: #cccccc 1px solid;'>" + vUserNm + "</td>";
                            sTableStr += "<td style='padding-left:5; BORDER-BOTTOM: #cccccc 1px solid; BORDER-RIGHT: #cccccc 1px solid;'>" + vJobPosition + "</td>";
                            sTableStr += "<td style='padding-left:5; BORDER-BOTTOM: #cccccc 1px solid;'>" + vDeptNm + "</td>";
                            sTableStr += "</tr>";
                        });
                    }
                    else {

                        sTableStr += "<tr><td colspan='4' align='center' style='padding-top:7px;'>해당 데이터가 없습니다</td></tr>";
				    }
				    
                } catch (e) {
                    alert(e.message);
                }
            }

            sTableStr += "</table>";

            $('#spnSearchResult').html(sTableStr);  
        }


        function ExcuteClickEvent(e)
		{
            if (navigator.userAgent.indexOf("Firefox") > -1)  //파이어폭스인 경우
            {
                if (e.which == 13) {
                    ClickSearch();
                }
            }
            else  //그외 브라우져
            {
                if (event.keyCode == 13) {
                    ClickSearch();
                }
            }
		}


        //사번 클릭시...
		function SetSabun(pSabun, pUserNm, pJobPosition, pDeptNm, pDeptCd, pEnterDate) {
            //debugger;
            if (gKind == "VacaSubmit")   //휴가신청/취소신청서
            {  
                opener.$("input[name=txtSabun]").val(pSabun);
                opener.$("input[name=txtUserName]").val(pUserNm);
                opener.$("input[name=txtJobPosition]").val(pJobPosition);
                opener.$("input[name=txtUnitName]").val(pDeptNm);

                var url = "/CoviWeb/Approval/CallBack.aspx";
                var param = "CODE=04&ENT_CODE=" + opener.getInfo("etid") + "&USER_CODE=" + pSabun;

                var xml = DoCallback(url, param);
                var result = xml.responseXML;

                var elmRoot = result.documentElement;
                //debugger;
                if (SelectSingleNode(elmRoot, "result") != "SUCEESS") {
                    alert("[Error]\n\r\n\r" + SelectSingleNode(elmRoot, "result"));
                    return;
                }
                else
                {
                    var vRtnVal = "";
                    try {
                        if ($(elmRoot).find("Table").length > 0) {
                            $(elmRoot).find("Table").each(function (i) {

                                vRtnVal = $(this).find("Column1").text();

                            });
                            //vRtnVal = ReplaceChars(vRtnVal, "<BR>", "\r\n\r\n");
                            vRtnVal = ReplaceChars(vRtnVal, "<BR>", "\n");
                            opener.$("textarea[name=txtRemainVacat]").val(vRtnVal);
                        }

                    } catch (e) {
                        alert(e.message);
                    }
                }
            }
            else if (gKind == "Certification")   //제증명신청서
            {
                opener.$("input[name=txtSabun]").val(pSabun);
                opener.$("input[name=txtUserName]").val(pUserNm);
                opener.$("input[name=txtJobPosition]").val(pJobPosition);
                opener.$("input[name=txtUnitName]").val(pDeptNm);

                opener.ResetApplyKindCmbAndAddressTbx();

            }
            else if (gKind == "EduSubmit")   //교육훈련신청서
            {
                opener.$("input[name=txtSabun_"+gDataRowNo+"]").val(pSabun);
                opener.$("input[name=txtUserName_" + gDataRowNo + "]").val(pUserNm);
                opener.$("input[name=txtJobPosition_" + gDataRowNo + "]").val(pJobPosition);
                opener.$("input[name=txtUnitName_" + gDataRowNo + "]").val(pDeptNm);

            }
            else if (gKind == "EventSubmit")   //경조금신청서
            {
                opener.$("input[name=txtSabun]").val(pSabun);
                opener.$("input[name=txtUserName]").val(pUserNm);
                opener.$("input[name=txtJobPosition]").val(pJobPosition);
                opener.$("input[name=txtUnitName]").val(pDeptNm);
                opener.$("input[name=hdnUnitCd]").val(pDeptCd);
                opener.$("input[name=txtEntDate]").val(pEnterDate.substr(0, 4) + "-" + pEnterDate.substr(4, 2) + "-" + pEnterDate.substr(6, 2));
            }
            else if (gKind == "FromTrip")   //국내/해외출장신청서(출장자)
            {
                opener.$("input[name=txtSabun_" + gDataRowNo + "]").val(pSabun);
                opener.$("input[name=txtUserName_" + gDataRowNo + "]").val(pUserNm);
                opener.$("input[name=txtJobPosition_" + gDataRowNo + "]").val(pJobPosition);
                opener.$("input[name=txtUnitName_" + gDataRowNo + "]").val(pDeptNm);
                opener.$("input[name=hdnUnitCd_" + gDataRowNo + "]").val(pDeptCd);
            }
            else if (gKind == "ReceipterFromTrip")   //국내/해외출장신청서(입금대상자)
            {
                opener.$("input[name=txtReceipterSabun]").val(pSabun);
                opener.$("input[name=txtReceipterNm]").val(pUserNm);
            }

            self.close();
        }
    
    </script>
    


</head>
<body style="margin-bottom:10px; margin-left:10px; margin-right:10px; margin-top:10px;">
    <form id="form1" runat="server">
    
        <div class="popup_title">
            <div class="title_tl">
            <div class="title_tr">
                <div class="title_tc">
                <h2>사용자 검색</h2>
                </div>
            </div>
            </div>
        </div>

        <div>
            <table width="100%">
			    <tr>
				    <td style="BORDER-RIGHT: #cccccc 1px solid; BORDER-TOP: #cccccc 1px solid; BORDER-LEFT: #cccccc 1px solid; BORDER-BOTTOM: #cccccc 1px solid;">
					    <table style="height:250px;">
						
						    <tr>
							    <td align="center" valign="top">
								    <table>
									
									    <tr>
										    <td height="5"></td>
									    </tr>
									    <tr>
										    <td align="center">
											    <table>
												    <tr>
													    <td>성 명:</td>
										                <td>
                                                            <input type="text" id="txtUserName" onkeypress="ExcuteClickEvent(event);" maxlength="30" style="width:120px;">&nbsp;
                                                            <img src="/GwImages/BLUE/common/devs/btn_search.gif" onclick="ClickSearch();" style="cursor:hand;" />
                                                        </td>
												    </tr>
											    </table>
										    </td>
										
									    </tr>
									    <tr>
										    <td height="5"></td>
									    </tr>
									    <tr>
										    <td align="center">
                                                <div id="divTblHeader">
											        <table cellpadding="0" cellspacing="0" ID='Table3' style='BORDER-RIGHT: #cccccc 1px solid; BORDER-TOP: #cccccc 1px solid; BORDER-LEFT: #cccccc 1px solid; BORDER-BOTTOM: #cccccc 1px solid;'>
                                                        <tr>
                                                            <td width='70' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;'><b>사 번</b></td>
                                                            <td width='100' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;'><b>성 명</b></td>
                                                            <td width='70' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;'><b>직 위</b></td>
                                                            <td width='250' height='25' align='center' bgcolor='#F2F2F2'><b>소 속</b></td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <span id="spnSearchResult"></span>
										    </td>
									    </tr>
								    </table>
							    </td>
						    </tr>
						    <tr>
							    <td height="20"><input type="text" style="display:none"/></td>
						    </tr>
					    </table>
				    </td>
			    </tr>
		    </table>
        </div>

        <div class="popup_Btn small" style=" text-align: right; padding-right: 20px;">
            <table border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td><CoviWebControls:CoviImageButton ID="btnCancle" runat="server" Text="btn_Close" OnClientClick="self.close();return false;" UserFrontIcon="False"></CoviWebControls:CoviImageButton></td>
            </tr>
            </table>
        </div>

   
    </form>
</body>
</html>
