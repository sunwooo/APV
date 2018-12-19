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
using Covision.Framework.Data.Business;
using Covision.Framework;

//
public partial class Approval_Forms_favorform : PageBase //System.Web.UI.Page
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    protected void Page_Load(object sender, EventArgs e)
    {
        //다국어 언어설정
        if (Session["user_language"] != null)
        {
            strLangID = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        string culturecode = strLangID;	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        Response.AddHeader("pragma", "no-cache");
        Response.AddHeader("cache-control", "private");
        Response.ContentType = "text/xml";
        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");

        SqlDacBase SqlDbAgent = null;
        DataPack INPUT = null;
        try
        {
            //code
            System.Xml.XmlDocument oRequestXML = COVIFlowCom.Common.ParseRequestBytes(Request);


            System.String sMode = oRequestXML.SelectSingleNode("//mode").InnerText;
            System.String suserid = oRequestXML.SelectSingleNode("//usid").InnerText;
            System.String sfmid = oRequestXML.SelectSingleNode("//fmid").InnerText;

            System.String szQuery = String.Empty;

            INPUT = new DataPack();
            SqlDbAgent = new SqlDacBase();
            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();

            szQuery = "dbo.usp_wfform_favorformprocess";
            INPUT.add("@mode", sMode);
            INPUT.add("@usid", suserid);
            INPUT.add("@fmid", sfmid);
            SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, szQuery, INPUT);


            Response.Write(Resources.Approval.msg_117);

        }
        catch (System.Exception ex)
        {
            Response.Write("<error>" + Server.HtmlEncode(COVIFlowCom.ErrResult.ParseStackTrace(ex)) + "</error>");
        }
        finally
        {
            //code
            if (SqlDbAgent != null)
            {
                SqlDbAgent.Dispose();
                SqlDbAgent = null;
            }
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
            Response.Write("</response>");
        }
    }
}
