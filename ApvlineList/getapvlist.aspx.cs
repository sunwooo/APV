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

//System name:
//Writer
//Date :
//Description :
//History

public partial class COVIFlowNet_ApvlineList_getapvlist : PageBase
{
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
		String sType = Request.QueryString["Type"];
		DataPack INPUT = null;
		try
		{
			//code
			INPUT = new DataPack();
			string szQuery = "";
			if (sOWNER_ID != null)
			{
				INPUT.add("@OWNER_ID", sOWNER_ID);
				INPUT.add("@TYPE", sType);
				szQuery = "dbo.usp_wf_GetApvlist";
			}
			else if (sPDD_ID != null)
			{
				INPUT.add("@PDD_ID", sPDD_ID);
				szQuery = "dbo.usp_wf_GetApvlistDetail";
			}
			if (szQuery != "")
			{
				DataSet ds = null;
				SqlDacBase SqlDbAgent = null;
				try
				{
					SqlDbAgent = new SqlDacBase();
					SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
					ds = new DataSet();
					ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, szQuery, INPUT);
					INPUT = null;
					{//이준희(2010-10-07): Changed to support SharePoint environment.
					//Response.Write(COVIFlowCom.Common.pTransform(ds.GetXml(), Server_MapPath("wf_PrivateDomainData01.xsl")).Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", ""));
					Response.Write(COVIFlowCom.Common.pTransform(ds.GetXml(), cbsg.CoviServer_MapPath("wf_PrivateDomainData01.xsl")).Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", ""));
					}
				}
				catch (Exception ex)
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
					if (SqlDbAgent != null)
					{
						SqlDbAgent.Dispose();
						SqlDbAgent = null;
					}
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
				INPUT = null;
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

	public string GetSigninform(string UserID)
	{
		/*
		//    Dim oDBMgr, oSignList, oSignLists
		//object oDBMgr,  oSignLists;
		CfnDatabaseManager.WfDBManager oDBMgr = new CfnDatabaseManager.WfDBManager();
		//    Dim strResp As System.Text.StringBuilder
		System.Text.StringBuilder strResp;
		try
		{
			oDBMgr = Server.CreateObject("CfDBMgr.WfDBManager");
			oDBMgr.gets
            
			//oDBMgr = Server.CreateObject("CfDBMgr.WfDBManager");
			//oSignLists = oDBMgr.getSignerLists(UserID)
			oSignLists = oDBMgr.getSignerLists(UserID);
			foreach (object oSignList in oSignLists)
			{
				strResp.Append("<item>");
				strResp.Append(makeNode("id", oSignList.ID, False));
				strResp.Append(makeNode("signlistname", oSignList.SignListName, True));
				strResp.Append(makeNode("signinform", oSignList.SignInform, False));
				strResp.Append("</item>");
			}

				oDBMgr = null;
                
				strResp = null;

				return strResp.ToString();

		}
		catch(Exception Ex)
		{
			oSignLists = null;
			strResp = null;
			throw new System.Exception("fnDispGroup", Ex);
		}
		*/
		return "";
	}
//    '결정정보 조회
//Private Function GetSigninform(ByVal UserID As String) As String

//    Dim oDBMgr, oSignList, oSignLists
//    Dim strResp As System.Text.StringBuilder
//    Try
//        oDBMgr = Server.CreateObject("CfDBMgr.WfDBManager")
//        oSignLists = oDBMgr.getSignerLists(UserID)

//        For Each oSignList In oSignLists
//            strResp.Append("<item>")
//            strResp.Append(makeNode("id", oSignList.ID, False))
//            strResp.Append(makeNode("signlistname", oSignList.SignListName, True))
//            strResp.Append(makeNode("signinform", oSignList.SignInform, False))
//            strResp.Append("</item>")
//        Next

//        oDBMgr = Nothing
//        oSignList = Nothing
//        strResp = Nothing

//        Return strResp.ToString
//    Catch Ex As System.Exception
//        oSignLists = Nothing
//        strResp = Nothing
//        Throw New System.Exception("fnDispGroup", Ex)
//    End Try
//End Function

	public string makeNode(string sName, string vVal, Boolean bCData)
	{
        
		System.Text.StringBuilder strNode = null;

		try
		{
			//code
			strNode = new System.Text.StringBuilder();
			strNode.Append("<" + sName + ">");
			if (bCData)
			{
				strNode.Append("<![CDATA[" + vVal + "]]>");
			}
			else
			{
				strNode.Append(vVal);
			}
			strNode.Append("</" + sName + ">");
			return strNode.ToString();
		}
		catch (System.Exception ex)
		{
            
			throw new System.Exception("makeNode", ex);
		}
		finally
		{
			if (strNode != null)
			{
				strNode = null;
			}
		}
	}


}
