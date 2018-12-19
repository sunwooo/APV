<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SearchAddData.aspx.cs" Inherits="Approval_Popup_SearchAddData" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title></title>
	<link rel="stylesheet" href="/GWImages/common/css/approval_form.css" type="text/css" />
    <script type="text/javascript" language="javascript" src="../../Common/script/COVIFlowNet/openWindow.js" ></script>		
	<script type="text/javascript" language="javascript" src="../../common/script/CFL.js"></script>
	<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js" ></script>
    <script type="text/javascript" language="javascript" src="../../SiteReference/js/jquery-1.7.2.min.js"></script>
    <!-- 달력 -->
    <link rel="stylesheet" type="text/css"  href="../Forms/calendar/datepickercontrol.css" />
    <script language="javascript" type="text/javascript" src="../Forms/calendar/datepickercontrol.js"></script>
</head>
<body>

<div class="popup_title">
  <div class="title_tl">
    <div class="title_tr">
      <div class="title_tc">
      <h2><span>데이터 추가</span></h2></div>
    </div>
  </div>
</div>
<div style="padding-left: 35px; padding-right: 20px;">
	<!-- 등록 div 시작 -->
	<div class="write">
	    <table class="table_5" summary="업체코드" cellpadding="0" cellspacing="0">
            <tr>
                <th style="width:15%">업체코드</th>
                <td>
                    <input type="text" id="comCD" name="comCD" tabindex="1" onkeyup="ExcuteClickEvent(this,1);" maxlength="6" style="width:38px; height:20px;" />
                    <a href="javascript:ClickSearchCompany();"><img alt='search' style="vertical-align: middle; margin-top:-1px;" src="<%=Session["user_thema"] %>/common/devs/btn_search.gif" width="25" height="21"/></a>
                    <input type="text" id="comNM" name="comNM" maxlength="50" style="width:302px; height:20px; border:0px;" readonly="readonly" />
                </td>
            </tr>
        </table>
	    <table class="table_5" summary="지종배합" cellpadding="0" cellspacing="0" style="margin-top:5px">
            <tr>
                <th style="width:15%">지종배합</th>
                <td>
                    <input type="text" id="kindCD" name="kindCD" tabindex="2" onkeyup="ExcuteClickEvent(this,2);" maxlength="2" style="width:14px; height:20px;" />
                    <a href="javascript:ClickSearchKind();"><img alt='search' style="vertical-align: middle; margin-top:-1px;" src="<%=Session["user_thema"] %>/common/devs/btn_search.gif" width="25" height="21"/></a>
                    <input type="text" id="kindComponentCD" name="kindComponentCD" tabindex="3" maxlength="20" style="width:120px; height:20px;" />
                    <input type="text" id="kindCorrugated" name="kindCorrugated" tabindex="4" onkeyup="ExcuteClickEvent(this,3);" maxlength="3" style="width:20px; height:20px;" />
                    <input type="button" value="초기화" onclick="fn_init()" id="Button2" style="border-right: #999999 1px solid; padding-right: 2px; border-top: #999999 1px solid; padding-left: 2px; background: url(/CoviWeb/images/bg_bt.gif) #ffffff; padding-bottom: 2px; font: 11px '돋움'; border-left: #999999 1px solid; cursor: hand; color: #333333; padding-top: 2px; border-bottom: #999999 1px solid; height: 18px" />
                </td>
            </tr>
            <tr>
                <td style="height:10px; border-left-width:0px; border-right-width:0px; border-bottom-width:0px;"></td>
                <td style="height:10px; padding-left:68px;border-left-width:0px; border-right-width:0px; border-bottom-width:0px;">
                    <input type="text" id="GW0504" name="GW0504" maxlength="20" style="vertical-align:top; width:120px; height:10px; border:0px;" readonly="readonly" />
                    <input type="text" id="GW0505" name="GW0505" maxlength="3" style="vertical-align:top;width:20px; height:10px; border:0px;" readonly="readonly" />
                </td>
            </tr>
        </table>
        <table class="table_4" summary="결과1" cellpadding="0" cellspacing="0" style="height:30px">
            <tr>
                <td style="vertical-align:top">
	                <table class="table_7" summary="단조율" cellpadding="0" cellspacing="0" style="margin:0px;width:90px;">
                        <tr>
                            <th colspan="2">단조율</th>
                        </tr>
                        <tr>
                            <td style="width:50%; text-align:center">A골</td>
                            <td><input type="text" id="GW0421" name="GW0421" style="width:24px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td style="text-align:center">B골</td>
                            <td><input type="text" id="GW0422" name="GW0422" style="width:24px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td style="text-align:center">E골</td>
                            <td><input type="text" id="GW0423" name="GW0423" style="width:24px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                    </table>
				</td>
                <td style="vertical-align:top">
	                <table class="table_7" summary="Loss 율" cellpadding="0" cellspacing="0" style="margin:0px;width:90px;">
                        <tr>
                            <th colspan="2">Loss 율</th>
                        </tr>
                        <tr>
                            <td style="text-align:center">S/W</td>
                            <td><input type="text" id="GW0424" name="GW0424" style="width:24px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td style="text-align:center">D/W</td>
                            <td><input type="text" id="GW0425" name="GW0425" style="width:24px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td style="text-align:center">T/W</td>
                            <td><input type="text" id="GW0426" name="GW0426" style="width:24px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                    </table>
				</td>
                <td style="vertical-align:top">
	                <table class="table_7" summary="가 공 비" cellpadding="0" cellspacing="0" style="margin:0px;width:90px;">
                        <tr>
                            <th colspan="2">가 공 비</th>
                        </tr>
                        <tr>
                            <td style="text-align:center">S/W</td>
                            <td><input type="text" id="GW0427" name="GW0427" style="width:24px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td style="text-align:center">D/W</td>
                            <td><input type="text" id="GW0428" name="GW0428" style="width:24px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td style="text-align:center">T/W</td>
                            <td><input type="text" id="GW0429" name="GW0429" style="width:24px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                    </table>
				</td>
                <td style="vertical-align:top">
	                <table class="table_7" summary="특수가공비" cellpadding="0" cellspacing="0" style="margin:0px;width:90px;">
                        <tr>
                            <th colspan="2">특수가공비</th>
                        </tr>
                        <tr>
                            <td style="text-align:center">E,EB</td>
                            <td><input type="text" id="GW0430" name="GW0430" style="width:24px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td style="text-align:center">L2</td>
                            <td><input type="text" id="GW0431" name="GW0431" style="width:24px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td style="text-align:center">L3</td>
                            <td><input type="text" id="GW0432" name="GW0432" style="width:24px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td style="text-align:center">E4</td>
                            <td><input type="text" id="GW0433" name="GW0433" style="width:24px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                    </table>
				</td>
                <td style="vertical-align:top">
	                <table class="table_7" summary="결재조건" cellpadding="0" cellspacing="0" style="margin:0px;width:90px;">
                        <tr>
                            <th>결재조건</th>
                        </tr>
                        <tr>
                            <td><input type="text" id="GW0434" name="GW0434" style="width:66px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td><input type="text" id="GW0410" name="GW0410" style="width:66px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                        </tr>
                    </table>
				</td>
            </tr>
        </table>
        <table class="table_4" summary="결과2" cellpadding="0" cellspacing="0" style="height:30px">
            <tr>
                <td style="vertical-align:top">
                    <div id="lyr_1" style="overflow-y:auto; border:0px; height:206px;">
	                    <table class="table_7" summary="원지코드" cellpadding="0" cellspacing="0" style="margin:0px;width:350px;">
                            <tr>
                                <th>원지코드</th>
                                <th>원지명</th>
                                <th>평량</th>
                                <th>기준단가</th>
                                <th>단조율</th>
                                <th>적용단가</th>
                            </tr>
                            <!--tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr-->
                            <tr>
                                <td><input type="text" id="GW06A21" name="GW06A21" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A31" name="GW06A31" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A41" name="GW06A41" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A51" name="GW06A51" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A61" name="GW06A61" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A71" name="GW06A71" style="width:50px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                            </tr>
                            <tr>
                                <td><input type="text" id="GW06A22" name="GW06A22" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A32" name="GW06A32" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A42" name="GW06A42" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A52" name="GW06A52" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A62" name="GW06A62" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A72" name="GW06A72" style="width:50px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                            </tr>
                            <tr>
                                <td><input type="text" id="GW06A23" name="GW06A23" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A33" name="GW06A33" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A43" name="GW06A43" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A53" name="GW06A53" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A63" name="GW06A63" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A73" name="GW06A73" style="width:50px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                            </tr>
                            <tr>
                                <td><input type="text" id="GW06A24" name="GW06A24" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A34" name="GW06A34" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A44" name="GW06A44" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A54" name="GW06A54" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A64" name="GW06A64" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A74" name="GW06A74" style="width:50px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                            </tr>
                            <tr>
                                <td><input type="text" id="GW06A25" name="GW06A25" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A35" name="GW06A35" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A45" name="GW06A45" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A55" name="GW06A55" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A65" name="GW06A65" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A75" name="GW06A75" style="width:50px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                            </tr>
                            <tr>
                                <td><input type="text" id="GW06A26" name="GW06A26" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A36" name="GW06A36" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A46" name="GW06A46" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A56" name="GW06A56" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A66" name="GW06A66" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A76" name="GW06A76" style="width:50px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                            </tr>
                            <tr>
                                <td><input type="text" id="GW06A27" name="GW06A27" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A37" name="GW06A37" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A47" name="GW06A47" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A57" name="GW06A57" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A67" name="GW06A67" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A77" name="GW06A77" style="width:50px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                            </tr>
                            <tr>
                                <td><input type="text" id="GW06A28" name="GW06A28" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A38" name="GW06A38" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A48" name="GW06A48" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A58" name="GW06A58" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A68" name="GW06A68" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                                <td><input type="text" id="GW06A78" name="GW06A78" style="width:50px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                            </tr>
                        </table>
                    </div>
				</td>
                <td style="vertical-align:top; text-align:right">
	                <table class="table_7" align="right" summary="원지가 합" cellpadding="0" cellspacing="0" style="margin:0px;width:260px;">
                        <tr>
                            <th style="text-align:left">1) 원지가 합</th>
                            <td style="width:30px;"></td>
                            <td style="width:100px"><input type="text" id="GW0607" name="GW0607" style="width:88px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <th style="text-align:left">2) 로 스 율  x</th>
                            <td><input type="text" id="GW0606" name="GW0606" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                            <td><input type="text" id="GW0607" name="GW0607" style="width:88px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <th style="text-align:left">3) 가 공 비  +</th>
                            <td><input type="text" id="GW0608" name="GW0608" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                            <td><input type="text" id="GW0609" name="GW0609" style="width:88px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <th style="text-align:left">4) 특수지종 +</th>
                            <td><input type="text" id="GW0610" name="GW0610" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                            <td><input type="text" id="GW0611" name="GW0611" style="width:88px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <th style="text-align:left">5) 결재조건 /</th>
                            <td><input type="text" id="GW0612" name="GW0612" style="width:30px; height:20px; border:0px; text-align:center" readonly="readonly" /></td>
                            <td><input type="text" id="GW0613" name="GW0613" style="width:88px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <th style="text-align:left">6) 적용단가</th>
                            <td></td>
                            <td><input type="text" id="GW0614" name="GW0614" maxlength="5" style="width:88px; height:20px; border:0px; text-align:right" onkeypress='isNumCheck()' onkeyup='formatNumber(this);' /></td>
                        </tr>
                        <tr>
                            <th style="text-align:left">7) 운반비</th>
                            <td></td>
                            <td><input type="text" id="GW0615" name="GW0615" style="width:88px; height:20px; border:0px; text-align:right" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <th style="text-align:left">8) 적용일자</th>
                            <td></td>
                            <td><input type="text" id="GW0616" name="GW0616" style="width:62px; height:20px; border:0px; text-align:center" readonly="readonly" datepicker="true" datepicker_format="YYYY-MM-DD" offsetWidth="-134" offsetHeight="-114" /></td>
                        </tr>
                        <tr>
                            <th style="text-align:left">9) 비고</th>
                            <td colspan="2"><input type="text" id="GW0714" name="GW0714" maxlength="50" style="width:140px; height:20px; border:0px;" /></td>
                        </tr>
                    </table>
				</td>
            </tr>
        </table>
    </div>
    <!-- 등록 div 끝 -->
</div>
<div class="popup_Btn small AlignR" style=" text-align: right; padding-right: 20px;">
    <a href="#" class="Btn04" id="btOK" name="cbBTN" onclick="javascript:fn_OK();"><span><%= Resources.Approval.btn_confirm_confirm %></span></a>
    <a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:parent.window.close();"><span><%= Resources.Approval.btn_close %></span></a>
</div>	   
</body>
</html>
<script language="javascript" type="text/javascript">
    var bcode = '<%= Request.QueryString["code"]  %>'
	window.onload= initOnload;
	function initOnload() {
	    $("#kindCD").blur(function () {
	        GetSearchKind();
	    });

	    $("#kindCorrugated").blur(function () {
	        GetCalUnitPrice();
	    }); 

	    document.getElementById("comCD").focus();
    }

    function ExcuteClickEvent(obj, kind) {
        if (kind == 1) {
            if (obj.value.length == 6) {
                GetSearchCompany(obj.value);
            }
        } else if (kind == 2) {
            if (event.keyCode == 13) {
                GetSearchKind();
            }
        } else {
            if (event.keyCode == 13) {
                GetCalUnitPrice();
            }
        }
    }

    //거래처 검색
    function GetSearchCompany(comCD) {
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

                    document.getElementById("comCD").value = code;
                    document.getElementById("comNM").value = name;

//                    document.getElementById("GW0421").value = elm.selectSingleNode("GW0421").text;
//                    document.getElementById("GW0422").value = elm.selectSingleNode("GW0422").text;
//                    document.getElementById("GW0423").value = elm.selectSingleNode("GW0423").text;

                }
            }
        }
    }

    //지종 구성 검색
    function GetSearchKind() {
        var queryStr = "EXEC USP_GETSEARCHKINDENTER '" + bcode.substring(0, 2) + "', '" + bcode.substring(2, 4) + "', '" + document.getElementById("kindCD").value + "'";
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
            var code1;
            var code2;

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

                    code1 = elm.selectSingleNode("GW0501").text;
                    code2 = elm.selectSingleNode("GW0503").text;

                    document.getElementById("kindCD").value = code1;
                    document.getElementById("kindComponentCD").value = code2;

                    document.getElementById("GW0504").value = elm.selectSingleNode("GW0504").text;
                    document.getElementById("GW0505").value = elm.selectSingleNode("GW0505").text;

                }
            }
        }
    }

    //원단 단가 계산
    function GetCalUnitPrice() {
        var queryStr = "EXEC USP_GETCALUNITPRICE '" + bcode.substring(0, 2) + "', '" + bcode.substring(2, 4) + "', '" + document.getElementById("comCD").value + "', '" + document.getElementById("kindCD").value + "', '" + document.getElementById("kindComponentCD").value + "', '" + document.getElementById("kindCorrugated").value + "'";
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
            var strTable = "";

//            strTable += '<table class="table_7" summary="원지코드" cellpadding="0" cellspacing="0" style="margin:0px;width:350px;">';
//            strTable += '   <tr>';
//            strTable += '       <th>원지코드</th>';
//            strTable += '       <th>원지명</th>';
//            strTable += '       <th>평량</th>';
//            strTable += '       <th>기준단가</th>';
//            strTable += '       <th>단조율</th>';
//            strTable += '       <th>적용단가</th>';
//            strTable += '   </tr>';

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

                    document.getElementById("GW0421").value = elm.selectSingleNode("GW0421").text;
                    document.getElementById("GW0422").value = elm.selectSingleNode("GW0422").text;
                    document.getElementById("GW0423").value = elm.selectSingleNode("GW0423").text;
                    document.getElementById("GW0424").value = elm.selectSingleNode("GW0424").text;
                    document.getElementById("GW0425").value = elm.selectSingleNode("GW0425").text;
                    document.getElementById("GW0426").value = elm.selectSingleNode("GW0426").text;
                    document.getElementById("GW0427").value = elm.selectSingleNode("GW0427").text;
                    document.getElementById("GW0428").value = elm.selectSingleNode("GW0428").text;
                    document.getElementById("GW0429").value = elm.selectSingleNode("GW0429").text;
                    document.getElementById("GW0430").value = elm.selectSingleNode("GW0430").text;
                    document.getElementById("GW0431").value = elm.selectSingleNode("GW0431").text;
                    document.getElementById("GW0432").value = elm.selectSingleNode("GW0432").text;
                    document.getElementById("GW0433").value = elm.selectSingleNode("GW0433").text;
                    document.getElementById("GW0434").value = elm.selectSingleNode("GW0434").text;
                    document.getElementById("GW0410").value = elm.selectSingleNode("GW0410").text;
                }

                elmList = m_CurrxmlHTTP2.documentElement.selectNodes("/ROOT/Table2");
                for (var i = 0; i < elmList.length; i++) {
                    elm = elmList.nextNode();

                    document.getElementById("GW0607").value = elm.selectSingleNode("GW0607").text;
                    document.getElementById("GW0606").value = elm.selectSingleNode("GW0606").text;
                    document.getElementById("GW0607").value = elm.selectSingleNode("GW0607").text;
                    document.getElementById("GW0608").value = elm.selectSingleNode("GW0608").text;
                    document.getElementById("GW0609").value = elm.selectSingleNode("GW0609").text;
                    document.getElementById("GW0610").value = elm.selectSingleNode("GW0610").text;
                    document.getElementById("GW0611").value = elm.selectSingleNode("GW0611").text;
                    document.getElementById("GW0612").value = elm.selectSingleNode("GW0612").text;
                    document.getElementById("GW0613").value = elm.selectSingleNode("GW0613").text;
                    document.getElementById("GW0614").value = elm.selectSingleNode("GW0614").text;
                    document.getElementById("GW0615").value = elm.selectSingleNode("GW0615").text;

                    if (elm.selectSingleNode("GW0616") != null && elm.selectSingleNode("GW0616").text.replace(/(^\s*)|(\s*$)/gi, "") != "") {
                        var strDate = elm.selectSingleNode("GW0616").text;
                        document.getElementById("GW0616").value = strDate.substring(0, 4) + "-" + strDate.substring(4, 2) + "-" + strDate.substring(6, 8);
                    }
                }

                elmList = m_CurrxmlHTTP2.documentElement.selectNodes("/ROOT/Table3");
                for (var i = 0; i < elmList.length; i++) {
                    elm = elmList.nextNode();

                    document.getElementById("GW06A2" + (i + 1)).value = elm.selectSingleNode("GW06A2").text;
                    document.getElementById("GW06A3" + (i + 1)).value = elm.selectSingleNode("GW06A3").text;
                    document.getElementById("GW06A4" + (i + 1)).value = elm.selectSingleNode("GW06A4").text;
                    document.getElementById("GW06A5" + (i + 1)).value = elm.selectSingleNode("GW06A5").text;
                    document.getElementById("GW06A6" + (i + 1)).value = elm.selectSingleNode("GW06A6").text;
                    document.getElementById("GW06A7" + (i + 1)).value = elm.selectSingleNode("GW06A7").text;

//                    strTable += '<tr>';
//                    strTable += '   <td>' + elm.selectSingleNode("GW06A2").text + '</td>';
//                    strTable += '   <td>' + elm.selectSingleNode("GW06A3").text + '</td>';
//                    strTable += '   <td>' + elm.selectSingleNode("GW06A4").text + '</td>';
//                    strTable += '   <td>' + elm.selectSingleNode("GW06A5").text + '</td>';
//                    strTable += '   <td>' + elm.selectSingleNode("GW06A6").text + '</td>';
//                    strTable += '   <td>' + elm.selectSingleNode("GW06A7").text + '</td>';
//                    strTable += '</tr>';
                }

//                if (elmList.length == 0)  //리턴데이터가 없을때
//                {
//                    strTable += "<tr><td colspan='6' align='center' style='padding-top:7px;'>해당 데이터가 없습니다</td></tr>";
//                }

//                strTable += '</table>';

//                document.getElementById("lyr_1").innerHTML = strTable;
            }
        }
    }

    //확인
    function fn_OK() {
        var queryStr = "EXEC USP_GETSAVEUNITPRICE '" + bcode.substring(0, 2) + "', '" + bcode.substring(2, 4) + "', '" + document.getElementById("comCD").value + "', '" + document.getElementById("kindCD").value + "', '" + document.getElementById("kindComponentCD").value + "', '" + document.getElementById("kindCorrugated").value + "', " + document.getElementById("GW0614").value.split(',').join('') + ", '" + document.getElementById("GW0616").value.split('-').join('') + "', '" + document.getElementById("GW0714").value + "'";
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
            var strTable = "";

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

                opener.AddRow();

                var tableIndex = opener.document.getElementById("tblAddData").rows.length;

                elmList = m_CurrxmlHTTP2.documentElement.selectNodes("/ROOT/Table1");
                for (var i = 0; i < elmList.length; i++) {
                    elm = elmList.nextNode();

                    opener.document.getElementsByName("GW0401_" + tableIndex)[0].value = elm.selectSingleNode("GW0401").text;
                    opener.document.getElementsByName("GW0402_" + tableIndex)[0].value = elm.selectSingleNode("GW0402").text;
                    opener.document.getElementsByName("GW0404_" + tableIndex)[0].value = elm.selectSingleNode("GW0404").text;
                    opener.document.getElementsByName("GW0406_" + tableIndex)[0].value = elm.selectSingleNode("GW0406").text;
                    
                }

                elmList = m_CurrxmlHTTP2.documentElement.selectNodes("/ROOT/Table2");
                for (var i = 0; i < elmList.length; i++) {
                    elm = elmList.nextNode();

                    opener.document.getElementsByName("GW0504_" + tableIndex)[0].value = elm.selectSingleNode("GW0504").text;
                }

                elmList = m_CurrxmlHTTP2.documentElement.selectNodes("/ROOT/Table3");
                for (var i = 0; i < elmList.length; i++) {
                    elm = elmList.nextNode();

                    opener.document.getElementsByName("GW0607_" + tableIndex)[0].value = elm.selectSingleNode("GW0607").text;
                    opener.document.getElementsByName("GW0615_" + tableIndex)[0].value = elm.selectSingleNode("GW0615").text;
                }

                elmList = m_CurrxmlHTTP2.documentElement.selectNodes("/ROOT/Table4");
                for (var i = 0; i < elmList.length; i++) {
                    elm = elmList.nextNode();

                    opener.document.getElementsByName("GW06A2" + (i + 1) + "_" + tableIndex)[0].value = elm.selectSingleNode("GW06A2").text;
                    opener.document.getElementsByName("GW06A3" + (i + 1) + "_" + tableIndex)[0].value = elm.selectSingleNode("GW06A3").text;
                    opener.document.getElementsByName("GW06A4" + (i + 1) + "_" + tableIndex)[0].value = elm.selectSingleNode("GW06A4").text;
                    opener.document.getElementsByName("GW06A5" + (i + 1) + "_" + tableIndex)[0].value = elm.selectSingleNode("GW06A5").text;
                    opener.document.getElementsByName("GW06A7" + (i + 1) + "_" + tableIndex)[0].value = elm.selectSingleNode("GW06A7").text;
                }

                elmList = m_CurrxmlHTTP2.documentElement.selectNodes("/ROOT/Table5");
                for (var i = 0; i < elmList.length; i++) {
                    elm = elmList.nextNode();

                    opener.document.getElementsByName("GW0705_" + tableIndex)[0].value = elm.selectSingleNode("GW0705").text;
                    opener.document.getElementsByName("GW0706_" + tableIndex)[0].value = elm.selectSingleNode("GW0706").text;
                    opener.document.getElementsByName("GW0707_" + tableIndex)[0].value = elm.selectSingleNode("GW0707").text;
                    opener.document.getElementsByName("GW0708_" + tableIndex)[0].value = elm.selectSingleNode("GW0708").text;
                    opener.document.getElementsByName("GW0709_" + tableIndex)[0].value = elm.selectSingleNode("GW0709").text;
                    opener.document.getElementsByName("GW0710_" + tableIndex)[0].value = elm.selectSingleNode("GW0710").text;
                    opener.document.getElementsByName("GW0711_" + tableIndex)[0].value = elm.selectSingleNode("GW0711").text;
                    opener.document.getElementsByName("GW0712_" + tableIndex)[0].value = elm.selectSingleNode("GW0712").text;
                    opener.document.getElementsByName("GW0713_" + tableIndex)[0].value = elm.selectSingleNode("GW0713").text;
                    opener.document.getElementsByName("GW0714_" + tableIndex)[0].value = elm.selectSingleNode("GW0714").text;
                }
            }
        }

        self.close();
    }

    //거래처 검색 팝업
    function ClickSearchCompany() {
        var url = "../Popup/SearchCompany.aspx?code=" + bcode;
        openWindow(url, "SearchCompanyPopup", 400, 518, "fix");
    }

    //지종 구성 조회 팝업
    function ClickSearchKind() {
        var url = "../Popup/SearchKind.aspx?code=" + bcode;
        openWindow(url, "SearchKindPopup", 400, 466, "fix");
    }

    // 입력되는 값이 숫자값인지 체크
    function isNumCheck() {
        if ((event.keyCode < 48) || (event.keyCode > 57))
            event.returnValue = false;

    }

    function formatNumber(obj) {
        var strValue = obj.value;
        if (strValue == "") strValue = "0";

        while (strValue.indexOf(',') != -1) {
            strValue = strValue.replace(',', '');
        }
        if (isNaN(strValue)) strValue = 0;

        str = eval(strValue).toString();

        ret = str.charAt(str.length - 1);
        for (i = 2; i <= str.length; i++) {
            if (i % 3 == 1)
                ret = ',' + ret;
            ret = str.charAt(str.length - i) + ret;
        }

        if (ret.substring(0, 1) == '-' && ret.substring(1, 2) == ',') // 음수 일 때 처음 콤마를 없앰 (예) -,111,111
        {
            ret = ret.replace(',', "");
        }

        obj.value = ret;
    }

    //초기화
    function fn_init() {
        document.location.reload();
    }
</script>
