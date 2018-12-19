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
using System.Diagnostics;

/// <summary>
/// 전자결재 조직도 query 실행
/// </summary>
public partial class COVIPortalNet_Address_GetXMLQuery : PageBase
{
	public string strType;

	/// <summary>
	/// 파라미터 속성 처리
	/// 실제 쿼리 함수 호출
	/// </summary>
	/// <param name="sender"></param>
	/// <param name="e"></param>
	protected void Page_Load(object sender, EventArgs e)
	{

		#region PerformanceLog 처리를 위한 Stopwatch 설정
		Stopwatch stopwatch = null;
		if (sPerformanceYN == "True")
		{
			stopwatch = new Stopwatch();
			stopwatch.Start();
		}
		#endregion


		strType = Request.QueryString["Type"];
		Response.ContentType = "text/xml";
		Response.Expires = -1;
		Response.CacheControl = "no-cache";
		Response.Buffer = true;

		Response.Write("<?xml version='1.0' encoding='utf-8'?>");

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
			Response.Write("");
		}

		#region PerformanceLog 처리
		if (sPerformanceYN == "True")
		{
			stopwatch.Stop();
			if (stopwatch.ElapsedMilliseconds > Convert.ToInt32(iPerformanceLimit))
			{
				string fullMethodName = string.Format("{0} --> {1}", this.GetType().Name, System.Reflection.MethodBase.GetCurrentMethod().Name);
				this.SetPerformanceLog(fullMethodName, stopwatch.Elapsed.ToString());

			}
		}
		#endregion
	}
	/// <summary>
	/// sql query 실행
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
				if(szXSLPath != "") szXSLPath = AppDomain.CurrentDomain.BaseDirectory + "Approval\\Address\\" + szXSLPath;
				ds = new DataSet();
				INPUT = new DataPack();
				System.Xml.XmlNodeList oParams = oXML.SelectNodes("Items/param");
				foreach (System.Xml.XmlNode oParam in oParams)
				{
					INPUT.add("@" + oParam.SelectSingleNode("name").InnerText, oParam.SelectSingleNode("value").InnerText);
				}

				using (SqlDacBase SqlDbAgent = new SqlDacBase())
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

				ds.DataSetName = "ROOT";

				switch (strType)
				{
					case "Member":                            
						ds.Tables[0].TableName = "ORG_PERSON";
						if (ds.Tables.Count > 1)
						{
							ds.Tables[1].TableName = "ORG_ADDITIONALJOB";
						}
						if (ds.Tables.Count > 2)
						{
							ds.Tables[2].TableName = "ORG_DISPATCHEDJOB";
						}
						if (ds.Tables.Count > 3){
							ds.Tables[3].TableName = "ORG_UNIT";
						}
						break;
					case "Unit":
						ds.Tables[0].TableName = "ORG_UNIT";
						break;
					case "searchMember":
						//ds.Tables[0].TableName = "ORG_PERSON";
						//break;
						ds.Tables[0].TableName = "ORG_PERSON";
						if (ds.Tables.Count > 1)
						{
							ds.Tables[1].TableName = "ORG_ADDITIONALJOB";
						}
						if (ds.Tables.Count > 2)
						{
							ds.Tables[2].TableName = "ORG_DISPATCHEDJOB";
						}
						break;
					default:
						break;
				}             

				if (szXSLPath != "")
				{
					Response.Write(pTransform(ds.GetXml(), szXSLPath).Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", ""));
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
				//code
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
	private static System.Xml.Xsl.XslCompiledTransform oXSLT0 = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLT1 = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLT2 = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLT3 = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLT4 = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLT5 = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLT6 = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLT7 = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLT8 = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLT9 = null;

	/// <summary>
	/// xml형태를 갖는 데이터를 xsl file을 이용하여 변환
	/// </summary>
	/// <param name="sXML">xml형태의 데이터</param>
	/// <param name="sXSLPath">xsl file path</param>
	/// <returns>String</returns>
	public string pTransform(string sXML, System.String sXSLPath)
	{
		System.IO.StringReader oSR = null;
		System.Xml.XPath.XPathDocument oXPathDoc = null;
		System.IO.StringWriter oSW = null;
		string sReturn = "";
		string smode = "";
		System.Xml.Xsl.XsltSettings XSLTsettings = new System.Xml.Xsl.XsltSettings();
		XSLTsettings.EnableScript = true;

		if (sXSLPath.ToLower().IndexOf("org_memberquery.xsl") > -1) smode = "0";
		if (sXSLPath.ToLower().IndexOf("org_unit.xsl") > -1 ) smode = "1";
		if (sXSLPath.ToLower().IndexOf("org_unitquery.xsl") > -1) smode = "2";
		//이후 case 증가되면 smode의 숫자값을 증가시킵니다.
		try
		{
			oSR = new System.IO.StringReader(sXML.ToString());
			oXPathDoc = new System.Xml.XPath.XPathDocument(oSR);
			oSW = new System.IO.StringWriter();
			if (smode == "0")
			{
				if (oXSLT0 == null)
				{
					oXSLT0 = new System.Xml.Xsl.XslCompiledTransform();
					oXSLT0.Load(sXSLPath, XSLTsettings, null);
				}
				oXSLT0.Transform(oXPathDoc, null, oSW);
			}
			if (smode == "1")
			{
				if (oXSLT1 == null)
				{
					oXSLT1 = new System.Xml.Xsl.XslCompiledTransform();
					oXSLT1.Load(sXSLPath, XSLTsettings, null);
				}
				oXSLT1.Transform(oXPathDoc, null, oSW);
			}
			if (smode == "2")
			{
				if (oXSLT2 == null)
				{
					oXSLT2 = new System.Xml.Xsl.XslCompiledTransform();
					oXSLT2.Load(sXSLPath, XSLTsettings, null);
				}
				oXSLT2.Transform(oXPathDoc, null, oSW);
			}
			if (smode == "3")
			{
				if (oXSLT3 == null)
				{
					oXSLT3 = new System.Xml.Xsl.XslCompiledTransform();
					oXSLT3.Load(sXSLPath, XSLTsettings, null);
				}
				oXSLT3.Transform(oXPathDoc, null, oSW);
			}
			if (smode == "4")
			{
				if (oXSLT4 == null)
				{
					oXSLT4 = new System.Xml.Xsl.XslCompiledTransform();
					oXSLT4.Load(sXSLPath, XSLTsettings, null);
				}
				oXSLT4.Transform(oXPathDoc, null, oSW);
			}

			if (smode == "5")
			{
				if (oXSLT5 == null)
				{
					oXSLT5 = new System.Xml.Xsl.XslCompiledTransform();
					oXSLT5.Load(sXSLPath, XSLTsettings, null);
				}
				oXSLT5.Transform(oXPathDoc, null, oSW);
			}
			if (smode == "6")
			{
				if (oXSLT6 == null)
				{
					oXSLT6 = new System.Xml.Xsl.XslCompiledTransform();
					oXSLT6.Load(sXSLPath, XSLTsettings, null);
				}
				oXSLT6.Transform(oXPathDoc, null, oSW);
			}
			if (smode == "7")
			{
				if (oXSLT7 == null)
				{
					oXSLT7 = new System.Xml.Xsl.XslCompiledTransform();
					oXSLT7.Load(sXSLPath, XSLTsettings, null);
				}
				oXSLT7.Transform(oXPathDoc, null, oSW);
			}
			if (smode == "8")
			{
				if (oXSLT8 == null)
				{
					oXSLT8 = new System.Xml.Xsl.XslCompiledTransform(true);
					oXSLT8.Load(sXSLPath, XSLTsettings, null);
				}
				oXSLT8.Transform(oXPathDoc, null, oSW);
			}
			if (smode == "9")
			{
				if (oXSLT9 == null)
				{
					oXSLT9 = new System.Xml.Xsl.XslCompiledTransform();
					oXSLT9.Load(sXSLPath, XSLTsettings, null);
				}
				oXSLT9.Transform(oXPathDoc, null, oSW);
			}
			sReturn = oSW.ToString();
		}
		catch (System.Exception ex)
		{
			throw ex;
		}
		finally
		{
			if (oSR != null)
			{
				oSR.Close();
				oSR.Dispose();
				oSR = null;
			}
			if (oXPathDoc != null)
			{
				oXPathDoc = null;
			}
			if (oSW != null)
			{
				oSW.Close();
				oSW.Dispose();
				oSW = null;
			}
		}
		return sReturn;
	}
	//private string pTransform(string  sXML, System.String sXSLPath)
	//{
	//    System.IO.StringWriter oTW = null;
	//    System.Xml.XPath.XPathDocument oXPathDoc = null;
	//    try
	//    {
	//        oTW = new System.IO.StringWriter();
	//        if (oXSLTUF == null)
	//        {
	//            oXSLTUF = new System.Xml.Xsl.XslCompiledTransform();
	//            oXSLTUF.Load(Server_MapPath("userfolderlist.xsl"));
	//        }

	//        oXPathDoc = new System.Xml.XPath.XPathDocument(new System.IO.StringReader(DSXML));
	//        oXSLTUF.Transform(oXPathDoc, null, oTW);
	//        oTW.GetStringBuilder().Remove(0, 39);

	//        return oTW.ToString();
	//    }
	//    catch (System.Exception ex)
	//    {
	//        throw ex;
	//    }
	//    finally
	//    {
	//        if (oTW != null)
	//        {
	//            oTW.Dispose();
	//            oTW = null;
	//        }
	//        if (oXPathDoc != null)
	//        {
	//            oXPathDoc = null;
	//        }
	//    }

        

	//    System.IO.StringReader oSR = new System.IO.StringReader(sXML.ToString());
	//    System.Xml.Xsl.XslCompiledTransform oXSLT = new System.Xml.Xsl.XslCompiledTransform();
	//    System.Xml.XPath.XPathDocument oXPathDoc = new System.Xml.XPath.XPathDocument(oSR);
	//    System.IO.StringWriter oSW = new System.IO.StringWriter();
	//    string sReturn = "";
	//    try
	//    {
	//        if (sXSLPath.IndexOf("http") == -1)
	//        {
	//            sXSLPath = AppDomain.CurrentDomain.BaseDirectory + "/Approval/address/" + sXSLPath;
	//        }
	//        oXSLT.Load(sXSLPath);
	//        oXSLT.Transform(oXPathDoc,null, oSW);

	//        sReturn = oSW.ToString();

	//    }
	//    catch (System.Exception ex)
	//    {
            
	//        throw new System.Exception("pResolveXSL", ex);
	//    }
	//    finally
	//    {
	//        //code
	//        oSR.Close();
	//        oSR.Dispose();
	//        oSR = null;
	//        oXPathDoc = null;
	//        oSW.Close();
	//        oSW.Dispose();
	//        oSW = null;
	//        oXSLT = null;
	//    }
	//    return sReturn;
	//}
}
