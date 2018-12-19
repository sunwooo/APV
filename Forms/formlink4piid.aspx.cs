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
/// 양식작성 열람 시 사용되는 페이지
/// </summary>
/// <example>
/// process_id : 전자결재 process id
/// </example>
public partial class Approval_Forms_formlink4piid : System.Web.UI.Page
{
    public String process_id; //process id
    public String PIDC;//pidc
    //public System.String fmpf; //양식 prefix
    //public System.String fmid; //양식 id
    //public System.String scid; //스키마 id
    //public System.String fmrv; //양식 revision
    //public System.String fmnm; //양식명
    public String mobileyn; //모바일 호출여부

    protected void Page_Load(object sender, EventArgs e)
    {
        DataSet oDS = null;
        DataPack INPUT = null;
        try
        {
            //파라미터 받기
            process_id = Request.QueryString["process_id"];
            mobileyn = Request.QueryString["mobileyn"];
            //2009.03 : Guid 변경
            if (process_id != null && process_id.IndexOf("-") == -1) process_id = COVIFlowCom.Common.ConvertGuid(process_id.Substring(1));

            String sWorkitemListQuery = String.Empty;
            sWorkitemListQuery = "dbo.usp_wf_getprocessinstance";
            oDS = new DataSet();
            INPUT = new DataPack();
            INPUT.add("@PI_ID", process_id);
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sWorkitemListQuery, INPUT);
                if ((oDS == null) || (oDS.Tables.Count == 0 || oDS.Tables[0].Rows.Count == 0))
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ARCHIVE_ConnectionString").ToString();
                    oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sWorkitemListQuery, INPUT);
                    if ((oDS == null) || (oDS.Tables.Count == 0 || oDS.Tables[0].Rows.Count == 0))
                    {
                        throw new System.Exception( Resources.Approval.msg_082 + " : " + process_id);
                    }
                    else
                    {
                        PIDC = pReplaceSpecialCharacter(oDS.Tables[0].Rows[0]["PI_DSCR"].ToString());
                    }
                }
                else
                {
                    PIDC = pReplaceSpecialCharacter(oDS.Tables[0].Rows[0]["PI_DSCR"].ToString());
                }
            }


        }
        catch (System.Exception ex)
        {
            Response.Write(ex.Message);
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

    private string pReplaceSpecialCharacter(string strContent)
    {
        if (strContent != null)
        {
            strContent = strContent.Replace("\\", "\\\\");
            strContent = strContent.Replace("\r\n", "\\r\\n");
            strContent = strContent.Replace("\n", "\\n");
            strContent = strContent.Replace("'", "\\'");
        }
        return strContent;
    }

}
