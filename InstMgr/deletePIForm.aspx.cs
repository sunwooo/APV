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

using COVIFlowCom;
using Covision.Framework;
using Covision.Framework.Data.Business;


/// <summary>
/// 전자결재 문서 삭제 - 관리자 결재문서 조회 시 문서삭제 버튼에 이해서 호출되는 페이지
/// 기본 data flag 변경
/// </summary>
public partial class Admin_InstMgr_deletePIForm : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    
    /// <summary>
    /// 다국어 설정
    /// 현행 및 archive 디비에서 항목 삭제
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.AddHeader("pragma", "no-cache");
        Response.AddHeader("cache-control", "private");
        Response.ContentType = "text/xml";
        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");

        DataPack INPUT = null;
        

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
            //insert

            INPUT = new DataPack();
            INPUT.add("@PROCESS_ID", Common.GetProp((System.Xml.XmlElement)elmRoot, "piid", true));
            INPUT.add("@FIID", Common.GetProp((System.Xml.XmlElement)elmRoot, "fiid", true));
            INPUT.add("@FMPF", Common.GetProp((System.Xml.XmlElement)elmRoot, "fmpf", true));
            INPUT.add("@FMRV", Common.GetProp((System.Xml.XmlElement)elmRoot, "fmrv", true));

            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                //현행 DB
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, "dbo.usp_wf_delete_approvaldoc", INPUT);
            }
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                //이관 DB
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ARCHIVE_ConnectionString").ToString();
                SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, "dbo.usp_wf_delete_approvaldoc", INPUT);
            }

        }
        catch (System.Exception ex)
        {
            Response.Write("<error>" + Server.HtmlEncode(COVIFlowCom.ErrResult.ParseStackTrace(ex)) + "</error>");
        }
        finally
        {
            //code

            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
            Response.Write("</response>");
        }
    }
}
