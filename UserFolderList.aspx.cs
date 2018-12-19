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


public partial class Approval_UserFolderList : PageBase //System.Web.UI.Page
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    /// <summary>
    /// 사용자 폴더에 데이터 추가/삭제처리
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

        SqlDacBase SqlDbAgent = null;
        string strMsg = Resources.Approval.msg_117;
        try
        {
            //code
            System.Xml.XmlDocument oRequestXML = COVIFlowCom.Common.ParseRequestBytes(Request);


            System.String sMode = oRequestXML.SelectSingleNode("//mode").InnerText;
            System.String sfoldermode = "N";
            if (oRequestXML.SelectSingleNode("//foldermode") != null) sfoldermode = oRequestXML.SelectSingleNode("//foldermode").InnerText;

            System.String suserid = Session["user_code"].ToString();

			System.String sfolderid = "";
			if ( oRequestXML.SelectSingleNode("//folderid") != null){
				sfolderid = oRequestXML.SelectSingleNode("//folderid").InnerText;
			}

            System.String szQuery = String.Empty;
            SqlDbAgent = new SqlDacBase();
            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();

            if (sMode == "DELETE")//휴지통 폴더 생성 및 폴더 아이디 가져오기
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
                DataPack INPUTG = new DataPack();
                decimal ifolderid = 0;
                try
                {

                    INPUTG.add("@userid", Session["user_code"].ToString());
                    INPUTG.add("@foldermode", "X");
                    ifolderid = System.Convert.ToDecimal(SqlDbAgent.ExecuteScalar(CommandType.StoredProcedure, "dbo.usp_wfform_setgarbagefolder", INPUTG));
                }
                catch (System.Exception ex)
                {
                }
                finally
                {
                }
                sfolderid = ifolderid.ToString();
            }

			if (sfoldermode == "I")
			{
				szQuery = "dbo.usp_wfform_setfolder";
			}
			else
			{
				szQuery = "dbo.usp_wfform_setfolderlist";
			}
            System.Xml.XmlNodeList emlList = oRequestXML.SelectNodes("//item");



            foreach (System.Xml.XmlNode eml in emlList)
            {
				System.String slistid = "";
                DataPack INPUT = new DataPack();
				if (sfoldermode == "I")
				{
					INPUT.add("@mode", sMode);
					INPUT.add("@foldermode", sfoldermode);
					INPUT.add("@folderid", eml.Attributes["id"].Value);
					INPUT.add("@gfolderid",sfolderid);//wastebox id
				}
				else
				{

					slistid = eml.SelectSingleNode("listid").InnerText;
					if (sMode == "INSERT")
					{
						slistid = "0";
					}

					INPUT.add("@mode", sMode);
					INPUT.add("@folderid", sfolderid);
					INPUT.add("@listid", slistid);
					INPUT.add("@formname", eml.SelectSingleNode("formname").InnerText);
					INPUT.add("@subject", eml.SelectSingleNode("subject").InnerText);
					INPUT.add("@initiator_name", eml.SelectSingleNode("initiator_name").InnerText);
					INPUT.add("@initiator_unit_name", eml.SelectSingleNode("initiator_unit_name").InnerText);
					INPUT.add("@linkurl", eml.SelectSingleNode("linkurl").InnerText);
					INPUT.add("@foldermode", sfoldermode);
					INPUT.add("@initiator_id", eml.SelectSingleNode("initiator_id").InnerText);
					INPUT.add("@initiator_unit_id", eml.SelectSingleNode("initiator_unit_id").InnerText);

					//폴더삭제 추가 부분
					if (sMode == "DELETE")
					{
						INPUT.add("@linkkey", oRequestXML.SelectSingleNode("//folderid").InnerText);
						INPUT.add("@wf_mode", "folder");
                        strMsg = Resources.Approval.msg_022;
					}

					//복구
					if (sMode == "RESTORE")
					{
						INPUT.add("@linkkey", eml.SelectSingleNode("linkkey").InnerText);
						INPUT.add("@wf_mode", eml.SelectSingleNode("wfmode").InnerText);
						INPUT.add("@deputy_state", eml.SelectSingleNode("deputystate").InnerText);

					}
				}
                SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, szQuery, INPUT);
            }

            Response.Write(strMsg);

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
            Response.Write("</response>");
        }
    }
}
