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

/// <summary>
/// 결재버튼 개별 사용 시 결재하기 페이지
/// 서명/인장 이미지 선택 및 결재의견 입력처리
/// </summary>
public partial class Approval_ApvProcess_ApvActBasic : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string g_UsePWDCheck = "F";

    /// <summary>
    /// 다국어 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        //Language
        string culturecode = strLangID;
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
		Title = Resources.Approval.lbl_approve;

        DataSet ds = null;
        DataPack INPUT = null;
        try
        {
            ds = new DataSet();
            INPUT = new DataPack();

            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                INPUT.add("@vc_PERSON_CODE", Sessions.PERSON_CODE.ToString());
                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "usp_WF_CK_APPROVAL_PWD", INPUT);
            }


            string sDBPWD = ds.Tables[0].Rows[0][0].ToString();
            if (sDBPWD.Equals(string.Empty))
            {
                g_UsePWDCheck = "F";
            }
            else
            {
                g_UsePWDCheck = "T";
            }

        }
        catch (System.Exception Ex)
        {
        }
        finally
        {
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
        }
    }
}
