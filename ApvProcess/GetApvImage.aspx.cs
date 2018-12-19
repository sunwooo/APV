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


/// <summary>
/// 시  스  템 : 종합정보시스템
/// 단위시스템 : Workflow
/// 프로그램명 : 전자결재 인장,서명이미지  조회
/// 모  듈  명 : 인장서명이미지 R
/// 파  일  명 : GetApvImage.aspx
/// 설      명 : 인장서명이미지 R
/// </summary>
/// <history>
/// CH00 2003/06/17 황선희 : 최초 작성
/// 
/// </history>
public partial class COVIFlowNet_ApvProcess_GetApvImage : PageBase
{
	/// <summary>
	/// 서명이미지 조회 함수 호출
	/// </summary>
	/// <param name="sender"></param>
	/// <param name="e"></param>
	protected void Page_Load(object sender, EventArgs e)
	{
		Response.ContentType = "text/xml";
		Response.Expires = -1;
		Response.CacheControl = "no-cache";
		Response.Buffer = true;

		string g_strResp;

		try
		{

			Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");

			g_strResp = GetSigninform(Session["user_code"].ToString());

			Response.Write(g_strResp);
		}
		catch (System.Exception Ex)
		{
			HandleException(Ex);
		}
		finally
		{
			Response.Write("</response>");
		}
	}

	/// <summary>
	/// 사용자 서명이미지 목록 조회
	/// </summary>
	/// <param name="UserID">사용자 id(person code)</param>
	/// <returns></returns>
	/// <example>stamp_a1.gif;stamp_a2.gif@sign_b1.gif;sign_b2.gif@</example>
	private string GetSigninform(string UserID)
	{
		string sSignPath = string.Empty;
		string sSignURL = "/GWStorage/e-sign/ApprovalSign/Backstamp/";
		{//이준희(2010-10-07): Changed to support SharePoint environment.
		//string sSignPath = Server_MapPath(sSignURL);
		sSignPath = cbsg.CoviServer_MapPath(sSignURL);
		}
		Covi.FileSystemNet oFS = null;

		string fileName;
		System.Text.StringBuilder strSign = null;
		System.Text.StringBuilder strStamp = null;
		try
		{
			oFS = new Covi.FileSystemNet();
			string[] fileEntries = oFS.fnSearchDirectory(sSignPath, "*_" + UserID + "_*.*");

			strSign = new System.Text.StringBuilder();
			strStamp = new System.Text.StringBuilder();
			foreach (string filePath in fileEntries)
			{
				fileName = filePath.Substring(filePath.LastIndexOf("\\") + 1);
				if (fileName.Split("_"[0])[0].ToString() == "stamp")
				{
					strStamp.Append(";");
					strStamp.Append(fileName);
				}
				else
				{
					strSign.Append(";");
					strSign.Append(fileName);
				}
			}
			if(strSign.Length > 1)
				strSign = strSign.Remove(0, 1);
            
			if(strStamp.Length > 1)
				strStamp = strStamp.Remove(0, 1);
           
			return makeNode("item", strStamp.ToString() + "@" + strSign.ToString(), true);            
		}
		catch(System.Exception Ex)
		{
			throw new System.Exception("GetApvImage", Ex);
		}
		finally
		{
			//System.EnterpriseServices.ServicedComponent.DisposeObject(oFS);
			if (strStamp != null)
			{
				strStamp = null;
			}
			if (strSign != null)
			{
				strSign = null;
			}
			if (oFS != null)
			{
				oFS = null;
			}
		}
	}

	/// <summary>
	/// node정보 생성
	/// </summary>
	/// <param name="sName">node명</param>
	/// <param name="vVal">node 값</param>
	/// <param name="bCData">CDATA표시여부</param>
	/// <returns></returns>
	private string makeNode(string sName, string vVal, Boolean bCData)
	{
		System.Text.StringBuilder strNode = null;
		try
		{
			strNode = new System.Text.StringBuilder();
			strNode.Append("<").Append( sName ).Append(">");
			if (bCData)
				strNode.Append("<![CDATA[").Append( vVal ).Append("]]>");
			else
				strNode.Append(vVal);

			strNode.Append("</").Append(sName).Append(">");
			return strNode.ToString();
		}
		catch (System.Exception Ex)
		{
			throw new System.Exception("makeNode", Ex);
		}
		finally
		{
			if (strNode != null)
			{
				strNode = null;
			}
		}
	}

	/// <summary>
	/// 에러 메시지 처리
	/// </summary>
	/// <param name="_Ex">Exception 객체</param>
	public void HandleException(System.Exception _Ex)
	{
		try
		{
			Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)) + "]]></error>");
		}
		catch (Exception ex)
		{
			Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(ex)) + "]]></error>");
		}
	}
}
