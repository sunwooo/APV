using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Covision.Framework;
using Covision.Framework.Data.Business;
using System.Diagnostics;

/// <summary>
/// 전자결재 포탈 화면
/// 최근결재문서/부서통계/안내문구/첨부파일 표현
/// </summary>
public partial class Approval_Approval_portal :PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    private string userID;
    private string userDept;
    public string thisYear;
    private string todayNow = DateTime.Today.ToString();
    public string aSubject = "";
    public string aWorkdate = "";
    public string aPIDC = "";
    //public string cSubject = "(최근 완료된 결재 문서가 없습니다)";
    public string cSubject = Resources.Approval.msg_290;
    public string cWorkdate = "";
    public string cPIDC = "";
    public string lastForm1 = "";
    public string lastForm2 = "";
    public string lastForm3 = "";
    public string lastForm4 = "";
    public string formCount1 = "0";
    public string formCount2 = "0";
    public string formCount3 = "0";
    public string formCount4 = "0";

    public string deptexec, deptapv, deptreturn, deptform, deptuser, deptdelay; //최근1달간 부서정보

    public string RelApproverCode, RelApproverName; //최다 결재 관련자
	public string strLangIndex = "0";

    /// <summary>
    /// 전자결재 포탈 화면
    /// 최근결재문서(링크포함)/부서통계 추출
    /// </summary>
    protected void Page_Load(object sender, EventArgs e)
    {
        #region PerformanceLog 처리를 위한 Stopwatch 설정
        Stopwatch stopwatch = null;
        if (sPerformanceYN == "True")
        {
            stopwatch = new Stopwatch();
            stopwatch.Start();
        }
        #endregion

        if (!IsPostBack)
        {
            if (Session["user_language"] != null)
            {
                strLangID = Session["user_language"].ToString();
            }
            //다국어 언어설정
            string culturecode = strLangID; //"en-US"; "ja-JP";
            Page.UICulture = culturecode;
            Page.Culture = culturecode;
			strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

        }
        userID = Sessions.PERSON_CODE.ToString();
        userDept = Sessions.USER_DEPT_CODE.ToString();
        thisYear = todayNow.Substring(0, 4);
        string thisYearF = todayNow.Substring(0, 4) + "0101";

        DataSet ds1 = null;
        DataPack INPUT1 = null;
        string g_connectString = "INST_ConnectionString";
        string strQuery1 = "dbo.usp_WF_get_ApprovalInfoEtc";//userID,userDept,thisYear/

        try
        {
            ds1 = new DataSet();
            INPUT1 = new DataPack();
            INPUT1.add("@USER_ID", userID);
            INPUT1.add("@INITIATOR_UNIT_ID", userDept);
            INPUT1.add("@date", thisYearF);

            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(g_connectString).ToString();
                ds1 = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, strQuery1, INPUT1);
                if (ds1.Tables[0].Rows.Count > 0)
                {
                    aSubject = ds1.Tables[0].Rows[0]["PI_SUBJECT"].ToString();
                    aWorkdate = ds1.Tables[0].Rows[0]["WORKDT"].ToString().Substring(0, 10);
                    aPIDC = ds1.Tables[0].Rows[0]["PI_DSCR"].ToString() + ";" + ds1.Tables[0].Rows[0]["PI_ID"].ToString();
                }
                if (ds1.Tables[1].Rows.Count > 0)
                {
                    cSubject = ds1.Tables[1].Rows[0]["PI_SUBJECT"].ToString();
                    cWorkdate = ds1.Tables[1].Rows[0]["WORKDT"].ToString().Substring(0, 10);
                    cPIDC = ds1.Tables[1].Rows[0]["PI_DSCR"].ToString() + ";" + ds1.Tables[1].Rows[0]["PI_ID"].ToString();
                }
                if (ds1.Tables[2].Rows.Count > 0)
                {
                    int Rcount = ds1.Tables[2].Rows.Count;
                    for (int i = 0; i < Rcount; i++)
                    {
                        switch (i)
                        {
                            case 0:
                                lastForm1 = ds1.Tables[2].Rows[i]["FORM_NAME"].ToString();
                                formCount1 = ds1.Tables[2].Rows[i]["TOTAL"].ToString();
                                break;
                            case 1:
                                lastForm2 = ds1.Tables[2].Rows[i]["FORM_NAME"].ToString();
                                formCount2 = ds1.Tables[2].Rows[i]["TOTAL"].ToString();
                                break;
                            case 2:
                                lastForm3 = ds1.Tables[2].Rows[i]["FORM_NAME"].ToString();
                                formCount3 = ds1.Tables[2].Rows[i]["TOTAL"].ToString();
                                break;
                            case 3:
                                lastForm4 = ds1.Tables[2].Rows[i]["FORM_NAME"].ToString();
                                formCount4 = ds1.Tables[2].Rows[i]["TOTAL"].ToString();
                                break;
                        }
                    }
                }
                if (ds1.Tables[3].Rows.Count > 0)
                {
                    RelApproverCode = ds1.Tables[3].Rows[0]["APPROVER_CODE"].ToString();
                    //2011.01.20 조직도 다국어 처리 by sunnyhwang
                    RelApproverName = COVIFlowCom.Common.splitNameExt(ds1.Tables[3].Rows[0]["APPROVER_NAME"].ToString(), strLangIndex);
                }
                else
                {
                    RelApproverCode = "";
                    RelApproverName = "";
                }



                INPUT1.Clear();
                INPUT1.add("@vc_USER_ID_H", userDept);
                ds1 = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure,"dbo.usp_wf_portal_unitinfo",INPUT1);
                if (ds1 != null && ds1.Tables.Count > 1)
                {
                    deptexec = System.Convert.ToString(Math.Round(System.Convert.ToDouble(ds1.Tables[0].Rows[0]["AVG1"]),1));
                    deptapv = ds1.Tables[0].Rows[0]["SUC1"].ToString();
                    deptreturn = ds1.Tables[0].Rows[0]["RET1"].ToString();
                    deptform = ds1.Tables[1].Rows[0]["FORM_NAME"].ToString();
					deptuser = COVIFlowCom.Common.splitNameExt(ds1.Tables[2].Rows[0]["INITIATOR_NAME"].ToString(),strLangIndex);
                    deptdelay = ds1.Tables[3].Rows[0]["TOTAL4"].ToString();

                }

            }
        }
        catch (Exception ex)
        {
            //throw ex;
        }
        finally
        {
            if (ds1 != null)
            {
                ds1.Dispose();
                ds1 = null;
            }
            if (INPUT1 != null)
            {
                INPUT1.Dispose();
                INPUT1 = null;
            }
        }
        getMyCount();
        #region PerformanceLog 처리
        if (sPerformanceYN == "True")
        {
            stopwatch.Stop();
            if (stopwatch.ElapsedMilliseconds > Convert.ToInt32(iPerformanceLimit))
            {
                string fullMethodName = string.Format("{0} --> {1}", this.GetType().Name, System.Reflection.MethodBase.GetCurrentMethod().Name);
                this.SetPerformanceLog(fullMethodName, stopwatch.Elapsed.ToString());

            }
        }
        #endregion
    }

    /// <summary>
    /// 결재요약정보
    /// 오늘 도착/결재/진행/완료 건수 조회
    /// </summary>
    #region 결재요약정보
    public string todayCount = "0";
    public string relationCount = "0";
    public string approvalCount = "0";
    public string processCount = "0";
    public string completeMCount = "0";
    public string approcalMCount = "0";

    private void getMyCount()
    {
        DataSet ds1 = null;
        DataPack INPUT1 = null;
        string g_connectString = "INST_ConnectionString";
        string strQuery1 = "dbo.usp_wf_approvalcount_portal";//userID,userDept,thisYear/
        
        try
        {
            ds1 = new DataSet();
            INPUT1 = new DataPack();
            INPUT1.add("@User_ID", userID);
            INPUT1.add("@Date", DateTime.Today.AddDays(-4).ToString("yyyy-MM-dd"));
            INPUT1.add("@fromdate", DateTime.Today.AddMonths(-1).ToString("yyyyMMdd"));
            INPUT1.add("@todate", DateTime.Today.ToString("yyyyMMdd"));

            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(g_connectString).ToString();
                ds1 = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, strQuery1, INPUT1);
                todayCount = ds1.Tables[0].Rows[0]["TODAY"].ToString();
                relationCount = ds1.Tables[0].Rows[0]["RELATION"].ToString();
                approvalCount = ds1.Tables[0].Rows[0]["APPROVAL"].ToString();
                processCount = ds1.Tables[0].Rows[0]["PROCESS"].ToString();

                completeMCount = Convert.ToString(Convert.ToInt32(ds1.Tables[1].Rows[0]["SUC"]) + Convert.ToInt32(ds1.Tables[1].Rows[0]["RET"]));
                approcalMCount = ds1.Tables[1].Rows[0]["TOTAL"].ToString();
            }
        }
        catch (Exception ex)
        {
        }
        finally
        {
            if (ds1 != null)
            {
                ds1.Dispose();
                ds1 = null;
            }
            if (INPUT1 != null)
            {
                INPUT1.Dispose();
                INPUT1 = null;
            }
        }
    }
    #endregion
}
