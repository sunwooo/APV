using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Text;
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
/// 모든 양식 상단의 버튼메뉴를 권한과 조건에 맞춰 display하는 페이지 formmenu.js와 연동한다.
/// </summary>
public partial class COVIFlowNet_FormsForMHT_FormMenu : PageBase
{   

    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string strDeputyType = string.Empty;
    public string strLangIndex = "0";

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

		string culturecode = strLangID;//다국어 언어설정
        if (Session["user_language"] != null){
            culturecode = Session["user_language"].ToString();//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;


        //대결설정 표시
        if (System.Configuration.ConfigurationSettings.AppSettings[Session["user_ent_code"].ToString() + "_DeputyType"] != null)
        {
            strDeputyType = System.Configuration.ConfigurationSettings.AppSettings[Session["user_ent_code"].ToString() + "_DeputyType"].ToString();
        }
        else
        {
            strDeputyType = System.Configuration.ConfigurationSettings.AppSettings["Default_DeputyType"].ToString();
        }

        strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);


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
    /// 팀장 여부 체크하기(2007.12.27 by chlee)
    /// </summary>
    /// <returns></returns>
	public string GetManagerYN()
	{
		string rtnValue = "";
        DataSet oDS = null;
        DataPack INPUT = null;
		try
		{
			//code

            oDS = new DataSet();
            INPUT = new DataPack();
            
            INPUT.add("@dept_code", Session["user_dept_code"]);
            INPUT.add("@person_code", Session["user_code"]);

            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_getIsManager", INPUT);
            }
			if (oDS != null)
			{
				if (oDS.Tables[0].Rows.Count > 0)
				{
					rtnValue = "Y";
				}
				else
				{
					rtnValue = "N";
				}
			}
			else { rtnValue = "N"; }
		}
		catch (System.Exception ex)
		{
			
		}
		finally
		{
			//code
            if (oDS != null)
            {
                oDS.Dispose();
                oDS = null;
            }

            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
		}
		return rtnValue;
	}

  
}
