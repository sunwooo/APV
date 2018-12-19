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

public partial class COVIFlowNet_workgroup : PageBase
{
    /// <summary>
    /// 개인/부서 결재함 그루핑 쿼리 실행
    /// 2011-04-11 보관함 조건추가
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/xml";
        Response.Write("<?xml version='1.0' encoding='utf-8'?>");

        //declare variables
        String gKind, UserID, Location, Mode, sSubKind;
        Boolean bArchived = false;
        Boolean bstored = false; //2011-04-11

        StringBuilder sb = null;
        DataPack INPUT = null;
        DataSet ds = null;

        //set variables
        UserID = Request.QueryString["uid"];
		Location = Request.QueryString["location"];
		Mode = Request.QueryString["mode"];
        gKind = Request.QueryString["kind"];
        if (Request.QueryString["bArchived"] == "true")
        {
            bArchived = true;
        }
        //2011-04-11
        if (Request.QueryString["bstored"] == "true")
        {
            bstored = true;
        }
        try
        {
            sb = new StringBuilder("");
            INPUT = new DataPack();
            ds = new DataSet();
            //회장님 기능 수정 by 보광 2007.10
            if (Request.QueryString["admintype"] == "MONITOR")
            {
                sb.Append("dbo.usp_wf_getWorkListsGroupBy");

                INPUT.add("@USER_ID", UserID);
                INPUT.add("@MODE", Location);
                INPUT.add("@KIND", gKind);
                INPUT.add("@PF_SUB_KIND", Request.QueryString["admintype"]);
                INPUT.add("@STARTDATE", Request.QueryString["startdate"]);

            }
            else
            {
                sb.Append("dbo.usp_wf_getWorkListsGroupBy");
                INPUT.add("@USER_ID", UserID);
                INPUT.add("@MODE", Location);
                INPUT.add("@KIND", gKind);


                switch (Request.QueryString["location"])
                {
                    case "PREAPPROVAL":
                        INPUT.add("@PF_SUB_KIND", ""); break;
                    case "APPROVAL":
                        INPUT.add("@PF_SUB_KIND", ""); break;
                    case "PROCESS":
                        INPUT.add("@PF_SUB_KIND", ""); break;
                    case "TODO":
                        INPUT.add("@PF_SUB_KIND", ""); break;
                    case "COMPLETE":
                        INPUT.add("@PF_SUB_KIND", ""); break;
                    case "FINISH":
                        INPUT.add("@PF_SUB_KIND", ""); break;
                    case "REJECT":
                        INPUT.add("@PF_SUB_KIND", ""); break;
                    case "TEMPSAVE":
                        INPUT.add("@PF_SUB_KIND", ""); break;
                    case "TCINFO":
                        INPUT.add("@PF_SUB_KIND", ""); break;
                    case "CCINFO":
                        INPUT.add("@PF_SUB_KIND", "");
                        INPUT.add("@STARTDATE", Session["user_dept_code"].ToString()); break;
                    case "REVIEW1":
                    case "REVIEW2":
                    case "REVIEW3":
                        INPUT.add("@PF_SUB_KIND", ""); break;
                    case "JOBFUNCTION":
                        sSubKind = UserID.Substring(UserID.LastIndexOf("_") + 1);
                        UserID = UserID.Substring(0, UserID.LastIndexOf("_"));
                        INPUT.Remove("@USER_ID");
                        INPUT.add("@USER_ID", UserID);
                        INPUT.add("@PF_SUB_KIND", sSubKind);
                        break;
                    case "JOBDUTY":
                        INPUT.add("@PF_SUB_KIND", ""); break;
                    case "DEPART":
                        sSubKind = UserID.Substring(UserID.LastIndexOf("_") + 1);
                        UserID = UserID.Substring(0, UserID.LastIndexOf("_"));
                        INPUT.Remove("@USER_ID");
                        INPUT.add("@USER_ID", UserID);
                        INPUT.add("@PF_SUB_KIND", sSubKind);
                        break;
                    case "UFOLDER":
                        INPUT.add("@PF_SUB_KIND", ""); break;
                    case "FOLDER":
                        INPUT.Remove("@USER_ID");
                        INPUT.add("@USER_ID", UserID.Split('_')[0].ToString());
                        INPUT.add("@PF_SUB_KIND", Request.QueryString["subkind"]);
                        INPUT.add("@ENT_CODE", Request.QueryString["entcode"]);
                        break;
                    case "GROUP":
                        INPUT.Remove("@USER_ID");
                        INPUT.add("@USER_ID", UserID.Split('_')[0].ToString());
                        INPUT.add("@PF_SUB_KIND", Request.QueryString["subkind"]); break;
                    default: break;
                }
            }

            string szQuery = sb.ToString();
           
            string strConnectString = "INST_ConnectionString";
            if (bArchived) strConnectString = "INST_ARCHIVE_ConnectionString";
            if (bstored) strConnectString = "STORE_ConnectionString";   //2011-04-11
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(strConnectString).ToString();
                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, szQuery, INPUT);
            }
            Response.Write(ds.GetXml());
            
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
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
            if (sb != null)
            {
                sb = null;
            }

        }

    }
}
