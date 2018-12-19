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
using System.Xml;
using Covision.Framework;
using Covision.Framework.Data.Business;

/// <summary>
/// 전산처리 요청서 Query 처리 페이지
/// </summary>
public partial class Approval_Forms_VarQuery : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");

        try
        {
            pSetData();
        }
        catch (Exception ex)
        {
            pHandleException(ex);
        }
        finally
        {
            Response.Write("</response>");
        }
    }
    private void pSetData()
    {
        XmlDocument oXML = null;
        DataSet ds = new DataSet();

        try
        {
            ds = new DataSet();
            oXML = new XmlDocument();
            oXML = pParseRequestBytes();
            DataPack INPUT = null;
            SqlDacBase SqlDbAgent = null;

            string g_connectString = "COVI_FLOW_SI_ConnectionString";
            try
            {
                string szQuery = oXML.DocumentElement.SelectSingleNode("query").InnerText;//.SelectSingleNode("Items/sql").InnerText;
                INPUT = new DataPack();

                ds = new DataSet();
                SqlDbAgent = new SqlDacBase();
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(g_connectString).ToString();
                ds = SqlDbAgent.ExecuteDataSet(CommandType.Text, szQuery, INPUT);
                SqlDbAgent.Dispose();
                SqlDbAgent = null;
                Response.Write(ds.GetXml());

            }
            catch (System.Exception ex)
            {
                throw new System.Exception(null, ex);
            }
            finally
            {
                //code
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
            }
        }
        catch (Exception e)
        {
            throw new Exception(null, e);
        }
        finally
        {
        }
    }

    private XmlDocument pParseRequestBytes()
    {
        try
        {
            XmlDocument oXMLData = new XmlDocument();
            System.Text.Decoder oDecoder = System.Text.Encoding.UTF8.GetDecoder();
            System.Byte[] aBytes = Request.BinaryRead(Request.TotalBytes);
            long iCount = oDecoder.GetCharCount(aBytes, 0, aBytes.Length);
            System.Char[] aChars = new char[iCount];
            oDecoder.GetChars(aBytes, 0, aBytes.Length, aChars, 0);
            oXMLData.Load(new System.IO.StringReader(new String(aChars)));
            return oXMLData;


        }
        catch (Exception ex)
        {
            throw new Exception(null, ex);
        }
    }
    private String pParseStackTrace(Exception _ex)
    {
        try
        {
            Exception InnEx = _ex;
            System.Text.StringBuilder sb = new System.Text.StringBuilder(" #"
                + InnEx.Message + "#"
                + InnEx.StackTrace.Substring(InnEx.StackTrace.LastIndexOf("   at ")));
            sb.Insert(0, "[" + InnEx.GetType().ToString() + "]");
            while (InnEx.InnerException != null)
            {
                InnEx = InnEx.InnerException;
                sb.Insert(0, " #" + InnEx.Message + "#" +
                    InnEx.StackTrace.Substring(InnEx.StackTrace.LastIndexOf("   at ")));
            }
            sb.Insert(0, "[" + InnEx.GetType().ToString() + "]");
            return sb.ToString();
        }
        catch (Exception e)
        {
            throw new Exception(null, e);
        }
    }
    private void pHandleException(Exception ex)
    {
        try
        {
            Response.Write("<error><![CDATA[" + pParseStackTrace(ex) + "]]></error>");
        }
        catch (Exception e)
        {
            Response.Write("<error><![CDATA[" + e.Message + "]]></error>");
        }
    }
}
