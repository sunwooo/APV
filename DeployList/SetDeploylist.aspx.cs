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
using Covision.Framework.Data.ComBase; 

/// <summary>
/// 배포그룹설정 등록/수정/삭제 처리 페이지
/// </summary>
public partial class DeployList_SetDeploylist : PageBase
{
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
            Response.Write("<success>" + Server.HtmlEncode(DateTime.Now.ToString()) + "</success>");
        }
        catch (Exception ex)
        {
            HandleException(ex);
        }
        finally
        {
            Response.Write("</response>");
        }

    }

    private void pSetSigninform(System.Xml.XmlDocument oXMLDOM)
    {
        //Covi.LogManager.ILogService logger = Covi.LogManager.LogService.GetInstance();
        //System.Text.StringBuilder sbComment = null;
        System.Xml.XmlNode elmRoot = null;
        DataPack INPUT = null;
        SqlDacBase SqlDbAgent =null;
        try
        {
            //sbComment = new System.Text.StringBuilder();
            elmRoot = oXMLDOM.DocumentElement;
            INPUT = new DataPack();
            if (elmRoot.SelectSingleNode("type").InnerText.ToString() == "change")
            {
                string sPDDID = elmRoot.SelectSingleNode("id").InnerText;
                INPUT.add("@PRIVATE_CONTEXT", elmRoot.SelectSingleNode("root").OuterXml.Replace("\\\"", "\""));
                INPUT.add("@DSCR", elmRoot.SelectSingleNode("dscr").InnerText);
                INPUT.add("@DISPLAY_NAME", elmRoot.SelectSingleNode("title").InnerText);
                INPUT.add("@PDD_ID", sPDDID);

                //sbComment.Append("UPDATE WF_CIRCULATION_DOMAIN_DATA WITH (ROWLOCK) ");
                //sbComment.Append(" SET");
                //sbComment.Append(" PRIVATE_CONTEXT='").Append(elmRoot.SelectSingleNode("root").OuterXml.Replace("\\\"", "\""));
                //sbComment.Append("',DSCR='").Append(elmRoot.SelectSingleNode("dscr").InnerText);
                //sbComment.Append("',DISPLAY_NAME='").Append(elmRoot.SelectSingleNode("title").InnerText);
                //sbComment.Append("'");
                //sbComment.Append(" WHERE PDD_ID='").Append(sPDDID).Append("' ");

                try
                {
                    int outp;
                    SqlDbAgent = new SqlDacBase();
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                    outp = SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, "dbo.usp_wf_update_Circulation", INPUT);

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                }

            }
            else if (elmRoot.SelectSingleNode("type").InnerText.ToString() == "delete")
            {
                string sPDDID = elmRoot.SelectSingleNode("id").InnerText;
                INPUT.add("@PDD_ID", sPDDID);
                //sbComment = new System.Text.StringBuilder();
                //sbComment.Append("DELETE WF_CIRCULATION_DOMAIN_DATA ");
                //sbComment.Append(" WHERE PDD_ID='").Append(sPDDID).Append("' ");

                try
                {
                    int outp;
                    SqlDbAgent = new SqlDacBase();
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                    outp = SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, "dbo.usp_wf_delete_Circulation", INPUT);

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                }
            }
            else if (elmRoot.SelectSingleNode("type").InnerText == "add")
            {

                INPUT.add("@PDD_ID", CfnEntityClasses.WfEntity.NewGUID());
                INPUT.add("@TYPE", 'D');
                INPUT.add("@OWNER_ID", elmRoot.SelectSingleNode("userid").InnerText);
                INPUT.add("@DISPLAY_NAME", elmRoot.SelectSingleNode("title").InnerText);
                INPUT.add("@PRIVATE_CONTEXT", elmRoot.SelectSingleNode("root").OuterXml.Replace("\\\"", "\""));
                INPUT.add("@DSCR", elmRoot.SelectSingleNode("dscr").InnerText);

                //sbComment.Append("INSERT INTO WF_CIRCULATION_DOMAIN_DATA WITH (ROWLOCK) ");
                //sbComment.Append(" ( PDD_ID,TYPE, OWNER_ID,DISPLAY_NAME,PRIVATE_CONTEXT,DSCR) ");
                //sbComment.Append(" VALUES( ");
                //sbComment.Append("'").Append(CfnEntityClasses.WfEntity.NewGUID());
                //sbComment.Append("','D");
                //sbComment.Append("','").Append(elmRoot.SelectSingleNode("userid").InnerText);
                //sbComment.Append("','").Append(elmRoot.SelectSingleNode("title").InnerText);
                //sbComment.Append("','").Append(elmRoot.SelectSingleNode("root").OuterXml.Replace("\\\"", "\""));
                //sbComment.Append("','").Append(elmRoot.SelectSingleNode("dscr").InnerText);
                //sbComment.Append("')");


                try
                {
                    int outp;
                    SqlDbAgent = new SqlDacBase();
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                    outp = SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, "dbo.usp_wf_insert_Circulation", INPUT);

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                }

            }
        }
        catch
        {
            //sbComment = null;
        }
        finally {
            //if (sbComment != null) sbComment = null;
            if (elmRoot != null) elmRoot = null;
            if (INPUT != null) INPUT = null;
            if (SqlDbAgent != null)
            {
                SqlDbAgent.Dispose();
                SqlDbAgent = null;
            }
        }
    }

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
