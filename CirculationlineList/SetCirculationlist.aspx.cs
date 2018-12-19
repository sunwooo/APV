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
/// 개인 회람 그룹 생성/수정/삭제 처리
/// </summary>
public partial class COVIFlowNet_CirculationlineList_SetCirculationlist : System.Web.UI.Page
{
    /// <summary>
    /// Request Stream xml 변환
    /// 개인회람그룹 처리 함수호출
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
        System.Xml.XmlDocument oXMLDOM;
        try
        {
            oXMLDOM = COVIFlowCom.Common.ParseRequestBytes(Request);
            pSetSigninform(oXMLDOM);
            Response.Write("<success>"+Server.HtmlEncode(DateTime.Now.ToString())+"</success>");
        }
        catch (Exception Ex)
        {
            HandleException(Ex);
        }
        finally
        {
            Response.Write("</response>");
        }

    }
    /// <summary>
    /// 개인회람그룹 추가/수정/삭제처리
    /// </summary>
    /// <param name="oXMLDOM">개인회람그룹 처리내역</param>
    private void pSetSigninform(System.Xml.XmlDocument oXMLDOM)
    {
        
        DataPack INPUT = null;
        System.Xml.XmlNode elmRoot = null;
	
        try
        {
            elmRoot = oXMLDOM.DocumentElement;
            INPUT = new DataPack();

            if (elmRoot.SelectSingleNode("type").InnerText.ToString() == "change")
            {
                string sPDDID = elmRoot.SelectSingleNode("id").InnerText;
                
                INPUT.add("@PRIVATE_CONTEXT", elmRoot.SelectSingleNode("root").OuterXml.Replace("\\\"", "\""));
                INPUT.add("@DSCR", elmRoot.SelectSingleNode("dscr").InnerText);
                INPUT.add("@DISPLAY_NAME", elmRoot.SelectSingleNode("title").InnerText);
                INPUT.add("@PDD_ID", sPDDID);

                try 
                {
                    using (SqlDacBase SqlDbAgent = new SqlDacBase())
                    {
                        SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                        int outp = SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, "dbo.usp_wf_update_Circulation", INPUT);
                    }

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                

            }
            else if (elmRoot.SelectSingleNode("type").InnerText.ToString() == "delete")
            {
                string sPDDID = elmRoot.SelectSingleNode("id").InnerText;
                
                INPUT.add("@PDD_ID", sPDDID);

                try
                {
                    using (SqlDacBase SqlDbAgent = new SqlDacBase())
                    {
                        SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                        int outp = SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, "dbo.usp_wf_delete_Circulation", INPUT);
                    }

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else if (elmRoot.SelectSingleNode("type").InnerText == "add")
            {
                INPUT.add("@PDD_ID", CfnEntityClasses.WfEntity.NewGUID());
                INPUT.add("@TYPE", 'C');
                INPUT.add("@OWNER_ID", elmRoot.SelectSingleNode("userid").InnerText);
                INPUT.add("@DISPLAY_NAME", elmRoot.SelectSingleNode("title").InnerText);
                INPUT.add("@PRIVATE_CONTEXT", elmRoot.SelectSingleNode("root").OuterXml.Replace("\\\"", "\""));
                INPUT.add("@DSCR", elmRoot.SelectSingleNode("dscr").InnerText);

                try
                {
                    using (SqlDacBase SqlDbAgent = new SqlDacBase())
                    {
                        SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                        int outp = SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, "dbo.usp_wf_insert_Circulation", INPUT);
                    }

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        catch { }
        finally {

            if (elmRoot != null) elmRoot = null;

            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }

        }
    }
 
    /// <summary>
    /// 
    /// </summary>
    /// <param name="_Ex"></param>
    public void HandleException(System.Exception _Ex)
    {
        try
        {

            Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)) + "]]></error>");
        }
        catch (Exception ex)
        {
            Response.Write("<error>Transaction Aborted</error>");
        }
    }


}
