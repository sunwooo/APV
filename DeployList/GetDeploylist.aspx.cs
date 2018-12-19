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
/// 배포처 목록 데이터 쿼리 가져오기 페이지
/// </summary>
public partial class DeployList_GetDeploylist : PageBase
{
	protected void Page_Load(object sender, EventArgs e)
	{

		Response.ContentType = "text/xml";
		Response.Expires = -1;
		Response.CacheControl = "no-cache";
		Response.Buffer = true;

		String g_strResp = "";
		Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
		String sOWNER_ID = Request.QueryString["USER_ID"];
		String sPDD_ID = Request.QueryString["PDD_ID"];

		DataPack INPUT = null;
		DataSet ds = null;
		SqlDacBase SqlDbAgent = null;

		try
		{
			string szQuery = "";
			INPUT = new DataPack();
			if (sOWNER_ID != null)
			{
				//szQuery = String.Format("EXEC sp_executesql N'SELECT PDD_ID, DISPLAY_NAME, OWNER_ID, DSCR, PRIVATE_CONTEXT FROM WF_CIRCULATION_DOMAIN_DATA (NOLOCK)  WHERE TYPE = ''D'' AND OWNER_ID=@OWNER_ID', N'@OWNER_ID VARCHAR(34)', '{0}'", sOWNER_ID);
				INPUT.add("@OWNER_ID", sOWNER_ID);
				INPUT.add("@TYPE", "D");
				szQuery = "dbo.usp_wf_GetCirculationlist";

			}
			else if (sPDD_ID != null)
			{
				//szQuery = String.Format("EXEC sp_executesql N'SELECT  PDD_ID, DISPLAY_NAME, DSCR ,  PRIVATE_CONTEXT    FROM    WF_CIRCULATION_DOMAIN_DATA WITH (NOLOCK) 	WHERE TYPE = ''D'' AND 	PDD_ID = @PDD_ID ', N'@PDD_ID VARCHAR(34)', '{0}'", sPDD_ID);
				INPUT.add("@PDD_ID", sPDD_ID);
				INPUT.add("@TYPE", "D");
				szQuery = "dbo.usp_wf_GetCirculationlistDetail";
			}
			if (szQuery != "")
			{
				ds = new DataSet();

				SqlDbAgent = new SqlDacBase();
				SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
				ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, szQuery, INPUT);
				{//이준희(2010-10-07): Changed to support SharePoint environment.
				//Response.Write(this.pTransform(ds.GetXml(), Server_MapPath("wf_PrivateDomainData01.xsl"), "1").Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", ""));
				Response.Write(this.pTransform(ds.GetXml(), cbsg.CoviServer_MapPath("wf_PrivateDomainData01.xsl"), "1").Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", ""));
				}
			}

		}
		catch (System.Exception ex)
		{
			HandleException(ex);
		}
		finally
		{
			if (INPUT != null) INPUT = null;

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
			Response.Write("</response>");
		}
	}
	private void HandleException(System.Exception _Ex)
	{
		try
		{
			Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)) + "]]></error>");
		}
		catch (System.Exception Ex)
		{
			Response.Write("<error><![CDATA[" + Ex.Message + "]]></error>");
		}
	}
	private static System.Xml.Xsl.XslCompiledTransform oXSLT1 = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLT2 = null;

	public string pTransform(string sXML, System.String sXSLPath, string smode)
	{
		System.IO.StringReader oSR = null;
		System.Xml.XPath.XPathDocument oXPathDoc = null;
		System.IO.StringWriter oSW = null;
		string sReturn = "";
		try
		{
			oSR = new System.IO.StringReader(sXML.ToString());
			oXPathDoc = new System.Xml.XPath.XPathDocument(oSR);
			oSW = new System.IO.StringWriter();
			if (smode == "1")
			{
				if (oXSLT1 == null)
				{
					oXSLT1 = new System.Xml.Xsl.XslCompiledTransform();
					oXSLT1.Load(sXSLPath);
				}
				oXSLT1.Transform(oXPathDoc, null, oSW);
			}
			else
			{
				if (oXSLT2 == null)
				{
					oXSLT2 = new System.Xml.Xsl.XslCompiledTransform();
					oXSLT2.Load(sXSLPath);
				}
				oXSLT2.Transform(oXPathDoc, null, oSW);
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
}
