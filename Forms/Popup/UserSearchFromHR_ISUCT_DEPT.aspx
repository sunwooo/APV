<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserSearchFromHR_ISUCT_DEPT.aspx.cs" Inherits="Approval_Forms_Popup_UserSearchFromHR_ISUCT_DEPT" %>

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
        var cdDeptOfficer = "<%=cdDeptOfficer %>";
        var dsDeptOfficer = "<%=dsDeptOfficer %>";
        var yrAccount = "<%=yrAccount %>";


        $(window).load(function () {

            //alert("gDataRowNo" + gDataRowNo);
            //alert(cdDeptOfficer);
            //alert(dsDeptOfficer);
            $("#txtUserName").focus();
            ClickSearch(gDataRowNo);


        });
        

        //2015.11.27 PSW 수정
        function ClickSearch(i) {
            

            //alert("ClickSearch");
            $('#divTblHeader').css({ "display": "none" });

            var sTableStr = "";
            sTableStr += "<table cellpadding=0 cellspacing=0 ID='Table3' style='BORDER-RIGHT: #cccccc 1px solid; BORDER-TOP: #cccccc 1px solid; BORDER-LEFT: #cccccc 1px solid; BORDER-BOTTOM: #cccccc 1px solid;'>";
            sTableStr += "<tr>";
            sTableStr += "<td width='170' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;BORDER-BOTTOM: #cccccc 1px solid;'><b>부서코드</b></td>";
            sTableStr += "<td width='320' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;BORDER-BOTTOM: #cccccc 1px solid;'><b>부서명칭</b></td>";

            sTableStr += "</tr>";

            //2015.11.27 계정코드+계정명 뿌리기 수정 PSW
            

            var url = "/CoviWeb/Approval/CallBack.aspx";
            var param = "CODE=64&ENT_CODE=" + opener.getInfo("etid") + "&YR_ACCOUNT=" + yrAccount + "&KEY_WORD=" + escape($('#txtUserName').val());
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

                var vcdDeptOfficer = "";
                var vdsDeptOfficer = "";
                /*
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
                */

                try {
                    if ($(elmRoot).find("Table").length > 0) {
                        $(elmRoot).find("Table").each(function (i) {

                            vcdDeptOfficer = $(this).find("CD_DEPTOFFICER").text();
                            vdsDeptOfficer = $(this).find("DS_DEPTOFFICER").text();
                            
                            sTableStr += "<tr>";
                            sTableStr += "<td align='center' style='BORDER-BOTTOM: #cccccc 1px solid; BORDER-RIGHT: #cccccc 1px solid;'><a class='a1' href='javascript:SetSabun(\"" + vcdDeptOfficer + "\",\"" + vdsDeptOfficer + "\");'>" + vcdDeptOfficer + "</a></td>";
                            sTableStr += "<td style='padding-left:5; BORDER-BOTTOM: #cccccc 1px solid; BORDER-RIGHT: #cccccc 1px solid;'>" + vdsDeptOfficer + "</td>";
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

        


        //사번 클릭시...
        function SetSabun(vcdDeptOfficer, vdsDeptOfficer) {


            //opener.$("input[name=txtCDAccount]").val(vAccountCode);

		    //2016.02.01 PSW 추가
            
            if (gDataRowNo == 2) {
                //alert("2     : "+vcdDeptOfficer);
                opener.$("input[name=txtDept_2]").val(vdsDeptOfficer);
                opener.$("input[name=txtcdDept_2]").val(vcdDeptOfficer);
                opener.$("input[name=txtDeptCode]").val(vcdDeptOfficer);

            } else {
                //alert("1     : " + vcdDeptOfficer);
                //alert(vdsDeptOfficer);
                opener.$("input[name=txtDept]").val(vdsDeptOfficer);
                opener.$("input[name=txtcdDept]").val(vcdDeptOfficer);
            }
           
            self.close();
        }

        function ExcuteClickEvent(e) {
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
    
    </script>
    


</head>
<body style="margin-bottom:10px; margin-left:10px; margin-right:10px; margin-top:10px;">
    <form id="form1" runat="server">
    
        <div class="popup_title">
            <div class="title_tl">
            <div class="title_tr">
                <div class="title_tc">
                <h2>발의(귀속)부서 검색</h2>
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
													    <td>발의(귀속)부서:</td>
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
                                                            <!--<td width='70' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;'><b>사 번</b></td>-->
                                                            <!--<td width='100' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;'><b>성 명</b></td>-->
                                                            <td width='170' height='25' align='center' bgcolor='#F2F2F2' style='BORDER-RIGHT: #cccccc 1px solid;'><b>부서코드</b></td>
                                                            <td width='320' height='25' align='center' bgcolor='#F2F2F2'><b>부서명칭</b></td>
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
