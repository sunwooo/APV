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
/// 완료문서 - 조회 - 변경이력 조회 목록에서 항목 클릭시의 VIEW페이지
/// </summary>
public partial class COVIFlowNet_Forms_HistoryView : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string fiid,fmpf,fmrv, revision;
    public System.Text.StringBuilder selEnt;
    protected void Page_Load(object sender, EventArgs e)
    {
        string culturecode = strLangID;//다국어 언어설정
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        fiid = Request.QueryString["fiid"];
        fmpf = Request.QueryString["fmpf"];
        fmrv = Request.QueryString["fmrv"];

		Title = Resources.Approval.lbl_chglogsearch + "-" + Resources.Approval.lbl_detail;

        revision = Request.QueryString["revision"];
        
        HistoryListView();
    }

    protected void HistoryListView()
    {
        //string sEntCode = "";
        string strResult = "";

        System.Text.StringBuilder szQuery = null;
        DataSet ds = null;
        DataPack INPUT = null;
        SqlDacBase SqlDbAgent = null;

        try
        {
            selEnt = new System.Text.StringBuilder();
            szQuery = new System.Text.StringBuilder();

            //szQuery.Append(" SELECT A.[REVISION],FIELD_NAME, MODIFIED_VALUE");
            //szQuery.Append("   FROM [COVI_FLOW_FORM_INST].[dbo].[WF_FORM_HISTORY_" + fmpf + "__V" + fmrv + "] A left join [ORG_PERSON] B on ");
            //szQuery.Append("         A.[MODIFIER_ID] = B.[PERSON_CODE]");
            //szQuery.Append(" where [FORM_INST_ID] = '" + fiid + "' and A.[REVISION] >= " + revision);
            //szQuery.Append(" ORDER BY A.[REVISION] DESC ");
            ////szQuery.Append(" FOR XML AUTO ");

            ds = new DataSet();
            INPUT = new DataPack();
            SqlDbAgent = new SqlDacBase();
            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();

            INPUT.add("@fmpf", fmpf);
            INPUT.add("@fmrv", fmrv);
            INPUT.add("@fiid", fiid);
            INPUT.add("@revision", revision);

            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "usp_getHistoryView", INPUT);
            SqlDbAgent.Dispose();
            SqlDbAgent = null;
        
            DataRowCollection colDR;
            colDR = ds.Tables[0].Rows;

            if (ds == null)
            {
                strResult = "ERROR";
            }
            else
            {
                if (ds.Tables[0].Rows.Count == 0) strResult = "No Data";
            }

            if (strResult == "")
            {
                //foreach (DataRow DR in colDR)
                //{
                //    selEnt.Append(DR[0].ToString());
                //}
                selEnt.Append(pReplaceSpecialCharacter(ds.GetXml()));
            }            

            ////using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter("DbProvider", "ORG_ConnectionString", true))
            //using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter(Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["DbProvider"].ToString(), Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["ORG_ConnectionString"].ToString(), false))
            //{
            //    ds = adapter.FillDataSet(szQuery.ToString());

            //    DataRowCollection colDR;
            //    colDR = ds.Tables[0].Rows;

            //    if (ds == null)
            //    {
            //        strResult = "ERROR";
            //    }
            //    else
            //    {
            //        if (ds.Tables[0].Rows.Count == 0) strResult = "No Data";
            //    }

            //    if (strResult == "")
            //    {
            //        //foreach (DataRow DR in colDR)
            //        //{
            //        //    selEnt.Append(DR[0].ToString());
            //        //}
            //        selEnt.Append(pReplaceSpecialCharacter(ds.GetXml()));
            //    }
            //}
        }
        catch (System.Exception ex)
        {
            
            throw new System.Exception(null, ex.InnerException);
        }
        finally
        {
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
            if (SqlDbAgent != null)
            {
                SqlDbAgent.Dispose();
                SqlDbAgent = null;
            }
            if (INPUT != null)
            {
                INPUT = null;
            }
            if (szQuery != null)
            {
                szQuery = null;
            }
        }
    }
    private string pReplaceSpecialCharacter(string strContent)
    {
        //Response.Write("<script>alert('" + strContent + "');</script>");
        if (strContent != null)
        {
            //Response.Write("<script>alert('" + strContent + "');</script>");
            strContent = strContent.Replace("\\", "\\\\");
            strContent = strContent.Replace("\r\n", "\\r\\n");
            strContent = strContent.Replace("\n", "\\n");
            strContent = strContent.Replace("'", "\\'");
            //Response.Write("<script>alert('" + strContent + "');</script>");
        }
        return strContent;
    }
}
