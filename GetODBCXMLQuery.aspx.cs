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
/// oledb query 
/// </summary>
public partial class COVIFlowNet_GetODBCXMLQuery : PageBase
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

    /// <summary>
    /// oledb query 실행
    /// </summary>
    private void pSetData()
    {
        XmlDocument oXML = null;

        try
        {
            oXML = new XmlDocument();
            oXML = pParseRequestBytes();

            string g_connectString = oXML.SelectSingleNode("Items/connectionname").InnerText;

            DataSet ds = null;
            DataPack INPUT = null;

            try
            {
                string szQuery = oXML.SelectSingleNode("Items/sql").InnerText;
                string szXSLPath = oXML.SelectSingleNode("Items/xslpath").InnerText;
                szXSLPath = szXSLPath.Replace(Request.Url.Host, Server.MachineName);

                ds = new DataSet();
                INPUT = new DataPack();
                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(g_connectString).ToString();
                    ds = SqlDbAgent.ExecuteDataSet(CommandType.Text, szQuery, INPUT);
                }
                //using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter("ODBCDbProvider", g_connectString, true))
                //{
                //    System.Data.IDataParameter param = adapter.CreateParameter();
                //    param.DbType = DbType.Int32;
                //    param.ParameterName = "@PID";
                //    param.Value = 19;
                //    adapter.DbSelectParameters.Add(param);
                //    ds = adapter.FillDataSet(szQuery);
                //}
                if (szXSLPath != "")
                {
                    Response.Write(COVIFlowCom.Common.pTransform(ds.GetXml(), szXSLPath).Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", ""));
                }
                else
                {
                    Response.Write(ds.GetXml());
                }

            }
            catch (System.Exception ex)
            {
                
                
                throw ex;
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

    /// <summary>
    /// Request 값 xml 객체로 추출
    /// </summary>
    /// <returns>XmlDocument</returns>
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
        catch (Exception e)
        {
            throw new Exception(null, e);
        }
    }

    /// <summary>
    /// Exception Handling
    /// </summary>
    /// <param name="ex">exception</param>
    /// <returns>XmlDocument</returns>
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
    /// <summary>
    /// Exception Parsing
    /// </summary>
    /// <param name="_ex">exception</param>
    /// <returns>String</returns>
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
    /// <summary>
    /// XML 형식 string을 xsl 파일로 변환하기
    /// </summary>
    /// <param name="sXML">xml형식의 데이터</param>
    /// <param name="sXSLPath">xsl file path</param>
    /// <returns>String</returns>
    private string pTransform(string sXML, System.String sXSLPath)
    {
        System.IO.StringReader oSR = new System.IO.StringReader(sXML.ToString());
        System.Xml.Xsl.XslCompiledTransform oXSLT = new System.Xml.Xsl.XslCompiledTransform();
        System.Xml.XPath.XPathDocument oXPathDoc = new System.Xml.XPath.XPathDocument(oSR);
        System.IO.StringWriter oSW = new System.IO.StringWriter();
        string sReturn = "";
        try
        {
            //code
            if (sXSLPath.IndexOf("http") == -1)
            {
                sXSLPath = AppDomain.CurrentDomain.BaseDirectory + sXSLPath;
            }
            oXSLT.Load(sXSLPath);
            oXSLT.Transform(oXPathDoc, null, oSW);

            sReturn = oSW.ToString();

        }
        catch (System.Exception ex)
        {
            
            throw new System.Exception("pResolveXSL", ex);
        }
        finally
        {
            //code
            oSR.Close();
            oSR.Dispose();
            oSR = null;
            oXPathDoc = null;
            oSW.Close();
            oSW.Dispose();
            oSW = null;
            oXSLT = null;
        }
        return sReturn;
    }
}
