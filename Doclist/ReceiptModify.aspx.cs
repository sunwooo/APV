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

public partial class Approval_Doclist_ReceiptDelelte : System.Web.UI.Page
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

        try
        {
            //code
            System.Xml.XmlDocument oRequestXML = pParseRequestBytes(); 
            System.Xml.XmlNodeList oItems = oRequestXML.SelectNodes("//item");
            System.String sMode = oRequestXML.SelectSingleNode("//mode").InnerText;

            if (oItems.Count > 0)
            {
                System.String sWIID;
                foreach (System.Xml.XmlNode oItem in oItems)
                {
                    switch (sMode)
                    {
                        case "DRAFT":
                            //oItemChangeState(sMode, oItem.Attributes["pfid"].Value, CfnEntityClasses.CfPerformerState.pfstCancelled.ToString(), "", sFolderMove);
                            AddSend(oItem.Attributes["ouid"].Value, oItem.Attributes["ounm"].Value, oRequestXML);
                            break;
                        case "delete":
                            sWIID = oItem.Attributes["wiid"].Value;
                            SendCancel(oItem.Attributes["piid"].Value, sWIID);
                            break;
                    }
                }
            }
            //System.EnterpriseServices.ContextUtil.SetComplete();
            switch (sMode)
            {
                case "DRAFT":
                    Response.Write(Resources.Approval.msg_136);
                    break;
                case "delete":
                    Response.Write(Resources.Approval.msg_138);
                    break;
            }
        }
        catch (System.Exception ex)
        {
            Response.Write("<error>" + Server.HtmlEncode(COVIFlowCom.ErrResult.ParseStackTrace(ex)) + "</error>");
            //System.EnterpriseServices.ContextUtil.SetAbort();
        }
        finally
        {
            //code
            Response.Write("</response>");
        }
    }
    //summary
    //발송취소
    //summary
    private void SendCancel(string piid, string wiid)
    {
        DataPack INPUT = null;
        SqlDacBase SqlDbAgent = null;
        try
        {
            SqlDbAgent = new SqlDacBase();
            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
            System.String szQuery = String.Empty;
            szQuery = "dbo.usp_wf_sendcancel";
            INPUT = new DataPack();
            INPUT.add("@piid", piid);
            INPUT.add("@wiid", wiid);

            SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, szQuery, INPUT);

        }
        catch (System.Exception ex)
        {
            throw new System.Exception(null, ex);
        }
        finally
        {
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
            if (SqlDbAgent != null)
            {
                SqlDbAgent.Dispose();
                SqlDbAgent = null;
            }
        }
    }
    //summary
    //추가발송
    //summary
    private void AddSend(string ouid, string ounm, System.Xml.XmlDocument oFormXMLDOM)
    {
        try
        {
            COVIFlowCom.processWorkflow4AddSend.ProcessSend(ouid, ounm, oFormXMLDOM);

        }
        catch (System.Exception ex)
        {
            throw new System.Exception(null, ex);
        }
        finally
        {
        }
    }
    private System.Xml.XmlDocument pParseRequestBytes()
    {
        System.Byte[] aBytes = Request.BinaryRead(Request.TotalBytes);
        try
        {
            System.Xml.XmlDocument oXMLData = new System.Xml.XmlDocument();
            System.Text.Decoder oDecoder = System.Text.Encoding.UTF8.GetDecoder();
            //aBytes = Request.BinaryRead(Request.TotalBytes);
            //Dim aChars(oDecoder.GetCharCount(aBytes, 0, aBytes.Length)) As System.Char;
            System.Char[] aChars = new Char[oDecoder.GetCharCount(aBytes, 0, aBytes.Length)];
            oDecoder.GetChars(aBytes, 0, aBytes.Length, aChars, 0);
            oXMLData.Load(new System.IO.StringReader(new String(aChars)));
            return oXMLData;
        }
        catch (System.Exception Ex)
        {
            throw new Exception("pParseRequestBytes", Ex);
        }
    }
}
