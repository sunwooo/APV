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
using System.Diagnostics;
using System.Xml;

/// <summary>
/// oledb client query 실행
/// </summary>
/// <remarks>sp 호출 type 추가</remarks>
public partial class Approval_GetOleXMLQuery : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        #region PerformanceLog 처리를 위한 Stopwatch 설정
        Stopwatch stopwatch = null;
        using (PageBase pb = new PageBase())
        {

            if (pb.sPerformanceYN == "True")
            {
                stopwatch = new Stopwatch();
                stopwatch.Start();
            }
        }
        #endregion

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
        #region PerformanceLog 처리 주석
        //using (PageBase pb = new PageBase()){
        //    if (pb.sPerformanceYN == "True")
        //    {
        //        stopwatch.Stop();
        //        if (stopwatch.ElapsedMilliseconds > Convert.ToInt32(pb.iPerformanceLimit))
        //        {
        //            string fullMethodName = string.Format("{0} --> {1}", this.GetType().Name, System.Reflection.MethodBase.GetCurrentMethod().Name);
        //            try
        //            {

        //                pb.SetPerformanceLog(fullMethodName, stopwatch.Elapsed.ToString());
        //            }
        //            catch (Exception ex)
        //            {
        //                throw ex;
        //            }
        //        }
        //    }
        //}
        #endregion

    }
    /// <summary>
    /// sql query 실행
    /// </summary>
    private void pSetData()
    {
        XmlDocument oXML = new XmlDocument();

        try
        {
            oXML = pParseRequestBytes();

            string g_connectString = oXML.SelectSingleNode("Items/connectionname").InnerText;
            DataSet ds = null;
            DataPack INPUT = null;
            try
            {
                ds = new DataSet();
                INPUT = new DataPack();

                string szQuery = oXML.SelectSingleNode("Items/sql").InnerText;
                string szXSLPath = oXML.SelectSingleNode("Items/xslpath").InnerText;
                if (szXSLPath != "") szXSLPath = szXSLPath.Replace(Request.Url.Host, Server.MachineName);

                System.Xml.XmlNodeList oParams = oXML.SelectNodes("Items/param");
                foreach (System.Xml.XmlNode oParam in oParams)
                {
                    INPUT.add("@" + oParam.SelectSingleNode("name").InnerText, oParam.SelectSingleNode("value").InnerText);
                }

                using (OleDbDacBase SqlDbAgent = new OleDbDacBase())
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(g_connectString).ToString();
                    if (oXML.SelectSingleNode("Items/type") != null && oXML.SelectSingleNode("Items/type").InnerText.ToLower() == "sp")
                    {
                        ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, szQuery, INPUT);
                    }
                    else
                    {
                        ds = SqlDbAgent.ExecuteDataSet(CommandType.Text, szQuery, INPUT);
                    }
                }

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
                throw new System.Exception(null, ex);
            }
            finally
            {
                //code
                oXML = null;
                if (INPUT != null)
                {
                    INPUT.Dispose();
                    INPUT = null;
                }
                if (ds != null)
                {
                    ds.Dispose();
                    ds = null;
                }
            }
        }
        catch (Exception e)
        {
            throw e;
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
            Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ParseStackTrace(ex) + "]]></error>");
        }
        catch (Exception e)
        {
            Response.Write("<error><![CDATA[" + e.Message + "]]></error>");
        }
    }


    /// <summary>
    /// xml형태를 갖는 데이터를 xsl file을 이용하여 변환
    /// </summary>
    /// <param name="sXML">xml형태의 데이터</param>
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
                if (Request.IsSecureConnection)
                {
                    sXSLPath = "https://" + Server.MachineName + sXSLPath;
                }
                else
                {
                    sXSLPath = "http://" + Server.MachineName + sXSLPath;
                }
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
