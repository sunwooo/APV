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
using Covi;
using COVIFlowCom;
using System.Data.SqlClient;

using COVIFlowCom;
using Covision.Framework;
using Covision.Framework.Data.Business;
using System.Text;

/// <summary>
/// 강제합의 처리 페이지
/// </summary>
public partial class Admin_InstMgr_ForcedConsent : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    /// <summary>
    /// 다국어 처리
    /// 합의자/합의부서 결재완료요청
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.AddHeader("pragma", "no-cache");
        Response.AddHeader("cache-control", "private");
        Response.ContentType = "text/xml";
        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");

        DataSet ds = null;
        DataPack INPUT = null;
        StringBuilder sUserid = null;
        StringBuilder sSql = null;
        StringBuilder sOuid = null;
        try
        {
            //다국어 언어설정
            if (Session["user_language"] != null)
            {
                strLangID = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
            }
            string culturecode = strLangID;	//"ko-KR"; "en-US"; "ja-JP";
            Page.UICulture = culturecode;
            Page.Culture = culturecode;

            //code
            System.Xml.XmlDocument oRequestXML = COVIFlowCom.Common.ParseRequestBytes(Request);

            System.Xml.XmlNode elmRoot = oRequestXML.DocumentElement;

            
            System.Xml.XmlNode elmApv = elmRoot.SelectSingleNode("apvlist");
            //합의자
            System.Xml.XmlNodeList oListConsent_id = elmApv.SelectNodes("(steps/division/step[(@unittype='person') and ( @routetype='consult' or @routetype='assist')]/ou/person)");
            sUserid = new StringBuilder();
            foreach (System.Xml.XmlNode oConsent_id in oListConsent_id)
            {
                sUserid.Append("'").Append(oConsent_id.Attributes["code"].Value).Append("'").Append(",");
            }

            //합의부서
            System.Xml.XmlNodeList oListConsent_ou_id = elmApv.SelectNodes("(steps/division/step[@unittype='ou' and ( @routetype='consult' or @routetype='assist' )]/ou)"); //부서협조
            sOuid = new StringBuilder();
            foreach (System.Xml.XmlNode oConsent_ou_id in oListConsent_ou_id)
            {
                sOuid.Append("'").Append(oConsent_ou_id.Attributes["code"].Value).Append("'").Append(",");
            }

            sSql = new System.Text.StringBuilder();
            sSql.Append("SELECT WORKITEM_ID, PF_ID FROM WF_PROCESS P WITH (NOLOCK) ");
            sSql.Append("JOIN WF_WORKITEM I ON P.PROCESS_ID=I.PROCESS_ID ");
            sSql.Append("WHERE P.PARENT_PROCESS_ID='").Append(Common.GetProp((System.Xml.XmlElement)elmRoot, "PARENT_PROCESS_ID", true)).Append("' ");
            sSql.Append("AND PERFORMER_ID IN (").Append(sUserid.ToString() + sOuid.ToString().TrimEnd(',')).Append(") ");
            sSql.Append("AND I.STATE='288'");


            INPUT = new DataPack();
            ds = new DataSet();

            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                ds = SqlDbAgent.ExecuteDataSet(CommandType.Text, sSql.ToString(), INPUT);
            }

            System.Data.DataRowCollection colDR = ds.Tables[0].Rows;
            if (ds.Tables[0].Rows.Count > 0)
            {
                System.String sWIID;
                System.String sPFID;
                CfnCoreEngine.WfWorkitemManager oWIMgr = new CfnCoreEngine.WfWorkitemManager();
                System.Collections.Specialized.NameValueCollection oWLRDIs = new System.Collections.Specialized.NameValueCollection();

                foreach (DataRow DR in colDR)
                {
                    //강제 합의 결재선이 없음
                    sWIID = DR["WORKITEM_ID"].ToString();
                    sPFID = DR["PF_ID"].ToString();
                    oWIMgr.RequestComplete(sWIID, sPFID, oWLRDIs, null, string.Empty, "BATCH_FORCED", string.Empty, string.Empty,null);
                }
            }
            else
            {
                Response.Write("<msg>" + Resources.Approval.msg_268 + "</msg>");
            }
        }
        catch (System.Exception ex)
        {
            Response.Write("<error>" + Server.HtmlEncode(COVIFlowCom.ErrResult.ParseStackTrace(ex)) + "</error>");
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
            if (sUserid != null)
            {
                sUserid = null;
            }

            if (sSql != null)
            {
                sSql = null;
            }
            if (sOuid != null)
            {
                sOuid = null;
            }
            Response.Write("</response>");
        }
    }
}
