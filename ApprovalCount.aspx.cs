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
/// 개인정보 포틀릿 - 전자결재 count 제공
/// 개인미결함count;부서수신함count
/// </summary>
public partial class Approval_ApprovalCount : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        
        string user_id = Request.QueryString["Id"];
        string dept_id = Request.QueryString["DeptId"];
        if (user_id == null && Session["user_code"] != null)
        {
            user_id = Session["user_code"].ToString();
        }
        if (dept_id == null && Session["user_dept_code"] != null)
        {
            dept_id = Session["user_dept_code"].ToString();
        }
        if (user_id != null)
        {
            string szReturn;

            System.Data.DataSet oDS = null;
            DataPack INPUT = null;
            try
            {
                oDS = new DataSet();
                INPUT = new DataPack();
                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();

                    INPUT.add("@USER_ID", user_id);
                    //2013-05-06 hyh 추가
                    INPUT.add("@UNIT_CODE", dept_id);
                    //2013-05-06 hyh 추가 끝

                    oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "usp_wf_approvalcount_All", INPUT);
                }
                if (oDS.Tables[0].Rows.Count > 0)
                {
                    System.Data.DataRow DR = oDS.Tables[0].Rows[0];

                    szReturn = DR["APPROVAL"].ToString() + ";" + DR["RECEIVE"].ToString() + ";" + DR["PROCESS"].ToString();//미결함, 수신함, 진행함

                    Response.Write(szReturn);
                }
            }
            catch (System.Exception ex)
            {
                Response.Write("error" + ex.Message);
            }
            finally
            {
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
        }
        else
        {
            Response.Write("0");
        }
    }
}
