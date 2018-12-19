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
using System.Text;

/// <summary>
/// 결재선 관리 페이지 - Master 페이지 상속
/// </summary>
public partial class COVIFlowNet_ApvlineMgr : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string strENTGROUPYN = ConfigurationManager.AppSettings["WF_ENTGROUPYN"];
	public string strEntList = String.Empty;
    public string gEntCode = String.Empty;
    /// <summary>
    /// 다국어 설정	
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        //다국어 언어설정
        string culturecode = strLangID;
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }

        gEntCode = Sessions.USER_ENT_CODE;

        Page.UICulture = culturecode;
        Page.Culture = culturecode;
        Title = Resources.Approval.btn_apvline;

		DataSet ds = null;
		DataPack INPUT = null;
		StringBuilder sb = null;
		if (strENTGROUPYN == "T")
		{
			try
			{
				ds = new DataSet();
				INPUT = new DataPack();
				sb =  new StringBuilder();

				using (SqlDacBase SqlDbAgent = new SqlDacBase())
				{
					SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
					ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_GetEntInfo", INPUT);
					if (ds != null && ds.Tables[0].Rows.Count > 0)
					{
						sb.Append("<option value=\"").Append(string.Empty).Append("\">").Append(Resources.Approval.lbl_total).Append("</option>");
						foreach (DataRow odr in ds.Tables[0].Rows)
						{

                            if (Session["user_language"].ToString() == "ko-KR") //20161121 추가 
                            {
                                sb.Append("<option value=\"").Append(odr["ENT_CODE"].ToString()).Append("\">").Append(odr["NAME"].ToString()).Append("</option>");
                            }
                            else
                            {
                                sb.Append("<option value=\"").Append(odr["ENT_CODE"].ToString()).Append("\">").Append(odr["ENG_NAME"].ToString()).Append("</option>");
                            }
                            //20161121 추가끝
                            //sb.Append("<option value=\"").Append(odr["ENT_CODE"].ToString()).Append("\">").Append(odr["NAME"].ToString()).Append("</option>");
						}
						strEntList = sb.ToString();
					}
				}
			}
			catch (System.Exception ex)
			{
			}
			finally
			{
				if (ds != null) ds.Dispose();
				if (INPUT != null) INPUT.Dispose();
				if ( sb != null) sb = null;
			}
		}
    }
}
