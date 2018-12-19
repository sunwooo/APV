using System;
using System.Collections.Generic;

using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Text;
using System.Data;
using System.IO;
using Covision.Framework;
using Covision.Framework.Data.Business;
using Covision.Framework.Data.ComBase;


public partial class Approval_CallBack : PageBase
{
    private DataSet ds = null;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.AddHeader("pragma", "no-cache");
        Response.AddHeader("cache-control", "private");
        Response.CacheControl = "no-cache";
        Response.ContentType = "text/xml";

        Response.Write("<?xml version=\"1.0\" encoding=\"utf-8\"?><response>");

        DataPack INPUT = null;

        try
        {
            INPUT = new DataPack();
            ds = new DataSet();

            switch (Request.QueryString["CODE"])
            {
                case "00":  //HR에서 휴가예정일 가져오기
                    {
                        string sProc = "APR_SelectUserVacaFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
                        INPUT.add("@SABUN", Request["SABUN"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            //SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("PORTAL_ConnectionString").ToString();
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "01":  //HR에서 휴가종류 가져오기
                    {
                        string sProc = "APR_SelectVacaKindFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            //SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("PORTAL_ConnectionString").ToString();
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "02":  //HR에서 휴가기간에따른 휴가 총일수 가져오기
                    {
                        string sProc = "APR_SelectVacaTotDaysFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
                        INPUT.add("@S_YMD", Request["S_YMD"]);
                        INPUT.add("@E_YMD", Request["E_YMD"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "03":  //HR에서 휴가기간에따른 휴가 적용일수(실사용일수) 가져오기
                    {
                        string sProc = "APR_SelectVacaApplyDaysFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
                        INPUT.add("@USER_CODE", Request["USER_CODE"]);
                        INPUT.add("@GNT_CD", Request["GNT_CD"]);
                        INPUT.add("@S_YMD", Request["S_YMD"]);
                        INPUT.add("@E_YMD", Request["E_YMD"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "04":  //HR에서 해당년도의 잔여휴가일수 가져오기
                    {
                        string sProc = "APR_SelectVacaRemainDaysFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
                        INPUT.add("@USER_CODE", Request["USER_CODE"]);
                        INPUT.add("@YEAR", DateTime.Now.ToString("d").Substring(0, 4));
                        
                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());
                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "05":  //HR에서 성명으로 검색
                    {
                        string sProc = "APR_SelectSearchUserFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
                        INPUT.add("@KEY_WORD", Server.UrlDecode(Request["KEY_WORD"]));

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                //2015.11.27 PSW 추가
                case "63":  //건설ERP에서 계정명으로 검색
                    {
                        //Response.Write(Request["CD_DEPT"]);

                        string sProc = "APR_SelectSearchAccountFromConERP";//APR_SelectSearchAccountFromConERP

                        INPUT.add("@ENT_CODE", "ISU_CT");
                        INPUT.add("@KEY_WORD", Server.UrlDecode(Request["KEY_WORD"]));
                        
                        INPUT.add("@CD_DEPT", Request["CD_DEPT"]);
                        INPUT.add("@YM_ACCOUNT", Request["YM_ACCOUNT"]);


                        //추가//
                        


                        //INPUT.add("@KEY_WORD", Server.UrlDecode(Request["KEY_WORD"]));

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                //2016.02.01 PSW 추가
                case "64":  //건설ERP에서 부서명으로 검색
                    {
                        //Response.Write(Request["CD_DEPT"]);

                        string sProc = "APR_SelectSearchBudgetDeptFromConERP";

                        //INPUT.add("@ENT_CODE", "ISU_CT");
                        INPUT.add("@KEY_WORD", Server.UrlDecode(Request["KEY_WORD"]));

                        //INPUT.add("@CD_DEPT", Request["CD_DEPT"]);
                        INPUT.add("@YR_ACCOUNT", Request["YR_ACCOUNT"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                //추경예산양식 가져올때, 부서코드 불러오기 2016-02-02 PSW
                case "65":  
                    {
                        string sProc = "ORG_SelectUserBasicInfoConERP";

                        INPUT.add("@PERSON_CODE", Request["PERSON_CODE"]);
                        //INPUT.add("@LANGUAGE", Request["LANGUAGE"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }

                case "06":  //HR에서 대체휴가의 대체근무시간 가져오기
                    {
                        string sProc = "APR_SelectVacaReplaceWorkTimeFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "07":  //HR에서 교육과정종류 가져오기
                    {
                        string sProc = "APR_SelectEduSubjectFromHR";

                        INPUT.add("@P_ENTER_CD", Request["ENT_CODE"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "08":  //HR에서 선택한 교육과정의 교육정보 가져오기
                    {
                        string sProc = "APR_SelectEduInfoFromHR";

                        INPUT.add("@PSTN_CODE", Request["PSTN_CODE"]);
                        INPUT.add("@P_ENTER_CD", Request["ENT_CODE"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "09":  //HR에서 휴가중복 체크
                    {
                        /* 구 중복체크함수 호출
                        string sProc = "APR_SelectVacaCheckDupFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
                        INPUT.add("@USER_CODE", Request["USER_CODE"]);
                        INPUT.add("@GNT_CD", Request["GNT_CD"]);
                        INPUT.add("@S_YMD", Request["S_YMD"]);
                        INPUT.add("@E_YMD", Request["E_YMD"]);
                        */

                        string sProc = "APR_SelectVacaCheckDupFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
                        INPUT.add("@GUBUN", Request["GUBUN"]);  //휴가구분(휴가신청/휴가취소)
                        INPUT.add("@GNT_CD", Request["GNT_CD"]);  //휴가종류코드
                        INPUT.add("@USER_CODE", Request["USER_CODE"]);
                        INPUT.add("@S_YMD", Request["S_YMD"]);
                        INPUT.add("@E_YMD", Request["E_YMD"]);
                       
                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);
                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
				case "10":  //HR에서 제증명종류 가져오기
                    {
						string sProc = "APR_SelectAllCertificaFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
						

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "15":  //HR에서 제증명종류 가져오기
                    {
						string sProc = "APR_SelectSearchUserFromHR_CERTIFICATION";
						

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
						INPUT.add("@KEY_WORD", Server.UrlDecode(Request["KEY_WORD"]));

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "11":  //HR에서 해당 대상자 집주소 가져오기 (제증명신청시 사용)
                    {
                        string sProc = "APR_SelectAddrHomeFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
                        INPUT.add("@SABUN", Request["SABUN"]);
                        INPUT.add("@APPL_CD", Request["APPL_CD"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "12":  //HR에서 해당회사의 근무처 가져오기 (제증명신청시 사용)
                    {
                        string sProc = "APR_SelectWorkplaceListFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "13":  //HR에서 해당 근무처 주소 가져오기 (제증명신청시 사용)
                    {
                        string sProc = "APR_SelectWorkplaceAddrFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
                        INPUT.add("@PSTN_CODE", Request["WorkplaceCode"]);
                        INPUT.add("@APPL_CD", Request["CertiCode"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "14":  //HR에서 근태종류 가져오기
                    {
                        string sProc = "APR_SelectWorkKindFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            //SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("PORTAL_ConnectionString").ToString();
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                
                case "40":  //ERP에서 예산사용부서 가져오기
                    {
                        string sProc = "APR_SelectBudgetDeptFromERP";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "41":  //ERP에서 경조사 계정코드 가져오기
                    {
                        string sProc = "APR_SelectEventAccountFromERP";

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "42":  //ERP에서 국내출장 계정코드 가져오기
                    {
                        string sProc = "APR_SelectInTripAccountFromERP";

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "43":  //ERP에서 해외출장 계정코드 가져오기
                    {
                        string sProc = "APR_SelectOutTripAccountFromERP";

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "60":  //해당사용자의 사번,성명,직위,소속정보 가져오기 (COVI_GROUPWARE에서 가져옴 - 다국어처리됨)
                    {
                        string sProc = "ORG_SelectUserBasicInfo";

                        INPUT.add("@PERSON_CODE", Request["PERSON_CODE"]);
                        INPUT.add("@LANGUAGE", Request["LANGUAGE"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                case "61":  //해당사용자의 사번,성명,직위,소속정보, 입사일자 가져오기 (EHR에서 가져옴)
                    {
                        string sProc = "APR_SelectUserBasicInfoFromHR";

                        INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
                        INPUT.add("@SABUN", Request["SABUN"]);

                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                    case "62":  //해당양식의 변경이력 가져오기
                    {
                        StringBuilder szQuery = new StringBuilder();
                        szQuery.Append(" select [REVISION], [DATE], [DISPLAY_NAME] ");
                        szQuery.Append(" from( ");
			            szQuery.Append(" SELECT A.[REVISION] ,left(convert( varchar,A.[MODIFIED_DATE],121),19) as [DATE],B.DISPLAY_NAME+';'+ISNULL(B.DISPLAY_ENG_NAME,B.DISPLAY_NAME)+';'+ISNULL(B.DISPLAY_JAP_NAME,B.DISPLAY_NAME)+';'+ISNULL(B.DISPLAY_CHA_NAME,B.DISPLAY_NAME) AS [DISPLAY_NAME] ");
                        szQuery.Append(" FROM [COVI_FLOW_FORM_INST].[dbo].[WF_FORM_HISTORY_").Append(Request["fmpf"]).Append("__V").Append(Request["fmrv"]).Append("] A with (nolock) left join [COVI_GROUPWARE].[dbo].[ORG_PERSON] B with (nolock) on  ");
                        szQuery.Append(" A.[MODIFIER_ID] = B.[PERSON_CODE] ");
                        szQuery.Append(" where [FORM_INST_ID] = '").Append(Request["fiid"]).Append("'");
                        szQuery.Append(" )C ");
                        szQuery.Append(" group by [REVISION],[DATE], [DISPLAY_NAME] ");
                        szQuery.Append(" ORDER BY [REVISION] ASC");

                        ds = new DataSet();
                        INPUT = new DataPack();
                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();

                            ds = SqlDbAgent.ExecuteDataSet(CommandType.Text, szQuery.ToString(), INPUT);
                        }

                        Response.Write(ds.GetXml());

                        Response.Write("<result>SUCEESS</result>");
                        break;
                    }
                default:
                    {
                        throw new Exception("해당 모드[" + Request.QueryString["mode"] + "]를 지원하지 않습니다.");
                    }

            }
        }
        catch (Exception ex)
        {
            Response.Write("<result>" + Server.HtmlEncode(ex.Message) + "</result>");

        }
        finally
        {
            Response.Write("</response>");

            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
        }
    }


}



    
