<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserSearchFromHR_ISUCT.aspx.cs" Inherits="Approval_Forms_Popup_UserSearchFromHR_ISUCT" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="stylesheet" href="/GWImages/common/css/approval_form.css" type="text/css" />
    <link rel="Stylesheet" href="/GWImages/Common/Css/css_style.css" type="text/css" />
    <style type="text/css">
        a.a1 {color:DarkOrange; text-decoration:underline}
    </style>

    <!--<textarea id="Textarea1" name="memocmt"><%//=pstnCode%></textarea>-->

    <script type="text/javascript" language="javascript" src="/CoviWeb/common/script/jquery-1.6.1.min.js"></script>
    <script type="text/javascript" language="javascript">
        
        var gKind = "<%=gKind %>";
        var gDataRowNo = "<%=gDataRowNo %>";
        var cd_Dept = "<%=cd_Dept %>";
        var requestDeptCD = "<%=requestDeptCD %>";
        var ymAccount = "<%=ymAccount %>"; 

        today = new Date();
        var cYear = today.getYear();


        $(window).load(function () {
            
            $("#txtUserName").focus();
            ClickSearch();

            //alert(cdDept);
            

        });

        //2015.11.27 PSW 수정
        function ClickSearch() {
            //alert(ymAccount);
            //alert("ClickSearch");
            $('#divTblHeader').css({ "display": "none" }); 

            var sTableStr = "";
            sTableStr += "<table cellpadding=0 cellspacing=0 ID='Table3' style='BORDER-RIGHT: #cccccc 1px solid; BORDER-TOP: #cccccc 1px solid; BORDER-LEFT: #cccccc 1px solid; BORDER-BOTTOM: #cccccc 1px solid;'>";
            sTableStr += "<tr>";
            sTableStr += "<td width='170' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;BORDER-BOTTOM: #cccccc 1px solid;'><b>계정코드</b></td>";
            sTableStr += "<td width='320' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;BORDER-BOTTOM: #cccccc 1px solid;'><b>계정명칭</b></td>";
    
            sTableStr += "</tr>";
            
            //2015.11.27 계정코드+계정명 뿌리기 수정 PSW


            var url = "/CoviWeb/Approval/CallBack.aspx";
            var param = "CODE=63&ENT_CODE=" + opener.getInfo("etid") + "&CD_DEPT=" + requestDeptCD + "&YM_ACCOUNT=" + ymAccount + "&KEY_WORD=" + escape($('#txtUserName').val());
            //alert(param);

            var xml = DoCallback(url, param);
            var result = xml.responseXML;

            var elmRoot = result.documentElement;
            //debugger;
            if (SelectSingleNode(elmRoot, "result") != "SUCEESS") {
                alert("[Error]\n\r\n\r" + SelectSingleNode(elmRoot, "result"));
                return;
            }
            else {
                /*
                var vSabun = "";
                var vUserNm = "";
                var vJobPosition = "";
                var vDeptNm = "";
                var vDeptCd = "";
                var vEnterDate = "";
                */
                var vAccountCode = "";
                var vAccountName = "";
                var vYearPlanAmt = "";
                var vAccPlanAmt = "";
                var vChgAccPlanAmt = "";
                var vTotPlanAmt = "";
                var vAccRsltAmt = "";
                var vPlanVsRsltAmt = "";
                var vThisPlanAmt = "";
                var vThisChgPlanAmt = "";
                var vThisTotPlanAmt = "";
                var vThisRsltAmt = "";
                var vRemainAmt = "";
                

                try {
                    if ($(elmRoot).find("Table").length > 0) {
                        $(elmRoot).find("Table").each(function (i) {
                            /*
                            vSabun = $(this).find("SABUN").text();
                            vUserNm = $(this).find("UserNm").text();
                            vJobPosition = $(this).find("JobPosition").text();
                            vDeptNm = $(this).find("DeptNm").text();
                            vDeptCd = $(this).find("DeptCd").text();
                            vEnterDate = $(this).find("ENTER_DATE").text();  //입사일자
                            */

                            vAccountCode = $(this).find("CD_ACCOUNT").text();
                            vAccountName = $(this).find("DS_ACCOUNT").text();

                            vYearPlanAmt    = $(this).find("YEAR_PLAN_AMT").text();
                            //vYearPlanAmt    = 12000;
                            vAccPlanAmt     = $(this).find("ACC_PLAN_AMT").text();
                            vChgAccPlanAmt  = $(this).find("CHG_ACC_PLAN_AMT").text();
                            vTotPlanAmt     = $(this).find("TOT_PLAN_AMT").text();
                            vAccRsltAmt     = $(this).find("ACC_RSLT_AMT").text();
                            vPlanVsRsltAmt  = $(this).find("PLAN_VS_RSLT_AMT").text();
                            vThisPlanAmt    = $(this).find("THIS_PLAN_AMT").text();
                            vThisChgPlanAmt = $(this).find("THIS_CHG_PLAN_AMT").text();
                            vThisTotPlanAmt = $(this).find("THIS_TOT_PLAN_AMT").text();
                            vThisRsltAmt    = $(this).find("THIS_RSLT_AMT").text();
                            vRemainAmt      = $(this).find("REMAIN_AMT").text();


                       


                            //alert(vAccountName);
                            sTableStr += "<tr>";
                            //sTableStr += "<td align='center' style='BORDER-BOTTOM: #cccccc 1px solid; BORDER-RIGHT: #cccccc 1px solid;'><a class='a1' href='javascript:SetSabun(\"" + vSabun + "\",\"" + vUserNm + "\",\"" + vJobPosition + "\",\"" + vDeptNm + "\",\"" + vDeptCd + "\",\"" + vEnterDate + "\");'>" + vSabun + "</a></td>";
                            //sTableStr += "<td style='padding-left:5; BORDER-BOTTOM: #cccccc 1px solid; BORDER-RIGHT: #cccccc 1px solid;'>" + vUserNm + "</td>";
                            sTableStr += "<td align='center' style='BORDER-BOTTOM: #cccccc 1px solid; BORDER-RIGHT: #cccccc 1px solid;'><a class='a1' href='javascript:SetSabun(\"" + vAccountCode + "\",\"" + vAccountName + "\",\"" + vYearPlanAmt + "\",\"" + vAccPlanAmt + "\",\"" + vChgAccPlanAmt + "\",\"" + vTotPlanAmt + "\",\"" + vAccRsltAmt + "\",\"" + vPlanVsRsltAmt + "\",\"" + vThisPlanAmt + "\",\"" + vThisChgPlanAmt + "\",\"" + vThisTotPlanAmt + "\",\"" + vThisRsltAmt + "\",\"" + vRemainAmt + "\");'>" + vAccountCode + "</a></td>";
                            sTableStr += "<td style='padding-left:5; BORDER-BOTTOM: #cccccc 1px solid; BORDER-RIGHT: #cccccc 1px solid;'>" + vAccountName + "</td>";


                            //sTableStr += "<td style='padding-left:5; BORDER-BOTTOM: #cccccc 1px solid; BORDER-RIGHT: #cccccc 1px solid;'>" + vJobPosition + "</td>";
                            //sTableStr += "<td style='padding-left:5; BORDER-BOTTOM: #cccccc 1px solid;'>" + vDeptNm + "</td>";


                            sTableStr += "</tr>";
                        });
                    }
                    else {

                        sTableStr += "<tr><td colspan='2' align='center' style='padding-top:7px;'>해당 데이터가 없습니다</td></tr>";
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
		//function SetSabun(pSabun, pUserNm, pJobPosition, pDeptNm, pDeptCd, pEnterDate) {
		//2015.11.30 PSW 수정


		function SetSabun(vAccountCode, vAccountName, vYearPlanAmt, vAccPlanAmt, vChgAccPlanAmt, vTotPlanAmt, vAccRsltAmt, vPlanVsRsltAmt, vThisPlanAmt, vThisChgPlanAmt, vThisTotPlanAmt, vThisRsltAmt, vRemainAmt) {
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

		        //alert("확인 : " + xml.responseText);
		        //debugger;
		        if (SelectSingleNode(elmRoot, "result") != "SUCEESS") {
		            alert("[Error]\n\r\n\r" + SelectSingleNode(elmRoot, "result"));
		            //alert("[Error]\n\r\n\r1");
                    return;
		        }
		        else {
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
		    else if (gKind == "VacaChgSubmit")   //휴가변경신청서
		    {
		        opener.$("input[name=txtSabun]").val(pSabun);
		        opener.$("input[name=txtUserName]").val(pUserNm);
		        opener.$("input[name=txtJobPosition]").val(pJobPosition);
		        opener.$("input[name=txtUnitName]").val(pDeptNm);

		        opener.SetVacaDay();

		    }
		    else if (gKind == "Certification")   //제증명신청서
		    {
		        opener.$("input[name=txtSabun]").val(pSabun);
		        opener.$("input[name=txtUserName]").val(pUserNm);
		        opener.$("input[name=txtJobPosition]").val(pJobPosition);
		        opener.$("input[name=txtUnitName]").val(pDeptNm);

		        opener.ResetApplyKindCmbAndAddressTbx();

		    }

            //2015.11.20 PSW 추가
		    else if (gKind == "Budget")   //추경예산변경신청(승인)서
		    {
		        //opener.$("input[name=txtSabun]").val(pSabun);
                /*
		        opener.$("input[name=txtName_" + gDataRowNo + "]").val(pUserNm);
		        opener.$("input[name=val1_" + gDataRowNo + "]").val(pSabun);
		        opener.$("input[name=val2_" + gDataRowNo + "]").val(pUserNm);
		        opener.$("input[name=val3_" + gDataRowNo + "]").val(pJobPosition);
		        opener.$("input[name=val4_" + gDataRowNo + "]").val(pDeptNm);
		        */
                //opener.$("input[name=txtCDDept]").val(cdDept);
		        //opener.ResetApplyKindCmbAndAddressTbx();

		    }
		    //2015.11.25 PSW 추가
		    else if (gKind == "CallHrView")   //HR View Call
		    {
		        opener.$("input[name=txtCDAccount_" + gDataRowNo + "]").val(vAccountCode);
		        opener.$("input[name=txtName_" + gDataRowNo + "]").val(vAccountName+"("+vAccountCode+")");
		        opener.$("input[name=val1_" + gDataRowNo + "]").val(numberFormat(vYearPlanAmt));
		        opener.$("input[name=val2_" + gDataRowNo + "]").val(numberFormat(vAccPlanAmt));
                opener.$("input[name=val3_" + gDataRowNo + "]").val(numberFormat(vChgAccPlanAmt));
                opener.$("input[name=val4_" + gDataRowNo + "]").val(numberFormat(vTotPlanAmt));
                opener.$("input[name=val5_" + gDataRowNo + "]").val(numberFormat(vAccRsltAmt));
                opener.$("input[name=val6_" + gDataRowNo + "]").val(numberFormat(vPlanVsRsltAmt));
                opener.$("input[name=val7_" + gDataRowNo + "]").val(numberFormat(vThisPlanAmt));
                opener.$("input[name=val8_" + gDataRowNo + "]").val(numberFormat(vThisChgPlanAmt));
                opener.$("input[name=val9_" + gDataRowNo + "]").val(numberFormat(vThisTotPlanAmt));
                opener.$("input[name=val10_" + gDataRowNo + "]").val(numberFormat(vThisRsltAmt));
                opener.$("input[name=val11_" + gDataRowNo + "]").val(numberFormat(vRemainAmt));

                opener.$("input[name=txtCD_Dept]").val(cd_Dept);
                opener.$("input[name=txtDeptCode]").val(requestDeptCD);
                //opener.$("input[name=txtCDAccount]").val(vAccountCode);
                //opener.$("input[name=txtYMAccount]").val(ymAccount);

            }

		    else if (gKind == "EduSubmit")   //교육훈련신청서
		    {
		        opener.$("input[name=txtSabun_" + gDataRowNo + "]").val(pSabun);
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


        //세자리마다 콤마찍기
        function numberFormat(num) {
            var pattern = /(-?[0-9]+)([0-9]{3})/;
            while (pattern.test(num)) {
                num = num.replace(pattern, "$1,$2");
            }
            return num;
        }

    </script>
    


</head>
<body style="margin-bottom:10px; margin-left:10px; margin-right:10px; margin-top:10px;">
    <form id="form1" runat="server">
    
        <div class="popup_title">
            <div class="title_tl">
            <div class="title_tr">
                <div class="title_tc">
                <h2>계정 검색</h2>
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
                                    <!--<textarea id="Textarea1" name="memocmt"><%//cd_Dept%></textarea>-->
								    <table>
									
									    <tr>
										    <td height="5"></td>
									    </tr>
									    <tr>
										    <td align="center">
											    <table>
												    <tr>
													    <td>계정명칭 : </td>
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
                                                            <td width='170' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;'><b>계정코드</b></td>
                                                            <td width='320' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;'><b>계정명칭</b></td>
                                                            <!--
                                                            <td width='320' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;'><b>직 위</b></td>
                                                            <td width='250' height='25' align='center' bgcolor='#F2F2F2'><b>소 속</b></td>
                                                            -->
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
