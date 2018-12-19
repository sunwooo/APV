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
using System.Text;
using Covision.Framework.Data.Business;
using Covision.Framework;

/// <summary>
/// 의견보기페이지
/// </summary>
public partial class COVIFlowNet_Comment_comment_view : PageBase
{
    public string strForm_Inst_Id, strCommentView, strFeedbackView, strfeedback, strMemo;
	public string strLangIndex = "0";

    protected void Page_Load(object sender, EventArgs e)
    {
        string culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

        strForm_Inst_Id = Request.QueryString["form_inst_id"];

        if (Request.QueryString["feedback"] != null)
        {
            strfeedback = Request.QueryString["feedback"];
        }

		Title = Resources.Approval.lbl_comment_view;
        Commend_View();
     
    }
    public void Commend_View()
    {
        DataSet ds = null;

        DataPack INPUT = null;
        try
        {
            Comment comData = new Comment();
            ds = new DataSet();
            string strComment;
            ds = comData.GetCommentView(strForm_Inst_Id);

            strCommentView = ds.GetXml();
            if (strfeedback == "1")
            {
                INPUT = new DataPack();
                INPUT.add("@fiid", strForm_Inst_Id);
                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                    ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wf_get_comment_feedback", INPUT);
                    strFeedbackView = ds.GetXml();
                }
            }

            INPUT = null;
            INPUT = new DataPack();
            INPUT.add("@fiid", strForm_Inst_Id);
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wf_get_comment_list03", INPUT);
                strMemo = ds.GetXml();
            }

        }
        catch (Exception ex) { }
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
