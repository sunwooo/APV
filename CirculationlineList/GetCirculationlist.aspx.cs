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
/// 개인 회람 그룹 목록 조회
/// </summary>
public partial class COVIFlowNet_CirculationlineList_GetCirculationlist : System.Web.UI.Page
{
	CEPSBase cbsg = null;//이준희(2010-10-07): Added to support SharePoint environment.
	/// <summary>
	/// 다국어 처리
	/// 파라미터 처리
	/// 개인 회람 그룹 조회
	/// </summary>
	/// <param name="sender"></param>
	/// <param name="e"></param>
	protected void Page_Load(object sender, EventArgs e)
	{
		Response.ContentType = "text/xml";
		Response.Expires = -1;
		Response.CacheControl = "no-cache";
		Response.Buffer = true;

		//String g_strResp = "";
		Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
		String sOWNER_ID = Request.QueryString["USER_ID"];
		String sPDD_ID = Request.QueryString["PDD_ID"];
		DataPack INPUT = null;
		DataSet ds = null;
		cbsg = new CEPSBase();
		try
		{
			string szQuery = "";
			INPUT = new DataPack();
			if (sOWNER_ID != null)
			{
				//szQuery = String.Format("EXEC sp_executesql N'SELECT PDD_ID, DISPLAY_NAME, OWNER_ID, DSCR, PRIVATE_CONTEXT FROM WF_CIRCULATION_DOMAIN_DATA (NOLOCK)  WHERE TYPE = ''C'' AND OWNER_ID=@OWNER_ID', N'@OWNER_ID VARCHAR(34)', '{0}'", sOWNER_ID);
				INPUT.add("@OWNER_ID", sOWNER_ID);
				INPUT.add("@TYPE", "C");
				szQuery = "dbo.usp_wf_GetCirculationlist";
                
			}else if (sPDD_ID != null)
			{
				//szQuery = String.Format("EXEC sp_executesql N'SELECT  PDD_ID, DISPLAY_NAME, DSCR ,  PRIVATE_CONTEXT    FROM    WF_CIRCULATION_DOMAIN_DATA WITH (NOLOCK) 	WHERE TYPE = ''C'' AND 	PDD_ID = @PDD_ID ', N'@PDD_ID VARCHAR(34)', '{0}'", sPDD_ID);
				INPUT.add("@PDD_ID", sPDD_ID);
				INPUT.add("@TYPE", "C");
				szQuery = "dbo.usp_wf_GetCirculationlistDetail";
			}
			if (szQuery != "")
			{
				ds = new DataSet();

				using (SqlDacBase SqlDbAgent = new SqlDacBase())
				{
					SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
					ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, szQuery, INPUT);
				}
				{//이준희(2010-10-07): Changed to support SharePoint environment.
				//Response.Write(COVIFlowCom.Common.pTransform(ds.GetXml(), Server_MapPath("wf_PrivateDomainData01.xsl")).Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", ""));
				Response.Write(COVIFlowCom.Common.pTransform(ds.GetXml(), cbsg.CoviServer_MapPath("wf_PrivateDomainData01.xsl")).Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", ""));
				}
			}
		}
		catch (System.Exception ex)
		{
			HandleException(ex);
		}
		finally
		{
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

			Response.Write("</response>");
		}
	}

	/// <summary>
	/// 에러메시지 출력
	/// </summary>
	/// <param name="_Ex">Exception 객체</param>
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
}
