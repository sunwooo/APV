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


public partial class Approval_UserFolderProcess : PageBase //System.Web.UI.Page
{
    /// <summary>
    /// 사용자 폴더 추가/삭제처리
    /// </summary>
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    /// <summary>
    /// 사용자 폴더 추가/삭제처리 
    /// 다국어 처리
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
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

        DataPack INPUT = null;
        DataSet ds = null;
        try
        {
            
            //code
            System.Xml.XmlDocument oRequestXML = COVIFlowCom.Common.ParseRequestBytes(Request);

            System.String sMode = oRequestXML.SelectSingleNode("//mode").InnerText;
            System.String suserid = Session["user_code"].ToString();
            if (oRequestXML.SelectSingleNode("//uid") != null)
            {
                suserid = oRequestXML.SelectSingleNode("//uid").InnerText; 
            }
            System.String sfolderid = oRequestXML.SelectSingleNode("//folderid").InnerText;
            System.String sfoldername = oRequestXML.SelectSingleNode("//foldername").InnerText;
            System.String sfoldermode = oRequestXML.SelectSingleNode("//foldermode").InnerText;
            System.String  sparentsid = oRequestXML.SelectSingleNode("//pid").InnerText;
            
            string[] split_pid = sparentsid.Split('|');



            System.String szQuery = String.Empty;

            if (sMode == "INSERT")
            {
                sfolderid = "0";
            }
            szQuery = "dbo.usp_wfform_setfolder";

            INPUT = new DataPack();
            INPUT.add("@mode", sMode);
            INPUT.add("@userid", suserid);
            INPUT.add("@folderid", sfolderid);
            INPUT.add("@foldername", sfoldername);
            INPUT.add("@foldermode", sfoldermode);
            INPUT.add("@parentid", split_pid[0]);


            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
               // ds = SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, szQuery, INPUT);
                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, szQuery, INPUT);
            }

           //if(Convert.ToInt32(ds.Tables[0].Rows[0][0]) > 0 )
           if (Convert.ToInt32(INPUT.Items[7].ToString()) == 1)
                Response.Write(Resources.Approval.msg_117);
           else
               Response.Write("중복되었습니다.");

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
