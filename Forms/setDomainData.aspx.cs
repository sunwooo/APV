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
/// 자동 결재선 가져오기
/// 1. 담당업무(기안/임시저장)
/// 2. 양식 자동 결재선 (기안/임시저장)
/// 2-1. 구분별 양식 자동 결재선(기안/임시저장)
/// 3. 담당부서자동결재선 적용여부 확인(재기안)
/// 4. 임시저장시 결재선 가져오기
/// [1,2,3,4 에서 빈값이면]
/// 5. 양식별 지정결재선(기안/임시저장)
/// 6. 주결재선(기안/임시저장)
/// 7. 고정결재선(기안/임시저장)
/// 8. 주결재선(그외)
/// </summary>
public partial class COVIFlowNet_Forms_setDomainData : PageBase
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
			pSetDomainData();
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

	private void pSetDomainData()
	{
        
		string strQuery = "";
		DataSet oDS = null;
		System.Text.StringBuilder sb = null;
		DataPack INPUT = null;
		SqlDacBase SqlDbAgent = null;
		System.Xml.XmlDocument oSchemaXMLDOM = null;
        
		try
		{
			oDS = new DataSet();
			sb = new System.Text.StringBuilder();
			INPUT = new DataPack();
			SqlDbAgent = new SqlDacBase();

			//기안 혹은 임시저장함에서 문서를 열면서 담당업부 선택으로 된 양식의 경우 담당업무를 강제로 결재선에 입력
			if((Request.QueryString["mode"] == "DRAFT" || Request.QueryString["mode"] == "TEMPSAVE") && Request.QueryString["scChgr"] == "1" && Request.QueryString["scChgrV"] == "select")
			{
				//strQuery = "SELECT A.[JF_CODE], A.[NAME]		FROM [ORG_JOBFUNCTION] A WITH (NOLOCK)		WHERE 	A.JF_CODE = '" + Request.QueryString["fmpf"] + "_" + Request.QueryString["bsid"] + "' ";
				strQuery = "[dbo].[usp_GetFormJobFunction]";
				INPUT.add("@FMPF",Request.QueryString["fmpf"]);
				INPUT.add("@BSID", Request.QueryString["bsid"]);
				SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();

				oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, strQuery, INPUT);
				sb.Append(oDS.GetXml().ToString());
			}
			//기안 혹은 임시저장함에서 문서를 열면서 자동결재선 적용여부 확인
			else if ((Request.QueryString["mode"] == "DRAFT" || Request.QueryString["mode"] == "TEMPSAVE") && Request.QueryString["scCDTApvLine"] == "1" && Request.QueryString["scCDTApvLineV"] != "")
			{
				//자동결재선 설정 형태
				//default 결재단계|제1기준금액;제한결재직책구분|제2기준금액;제한결재직책구분
				string[] aContdition = Request.QueryString["scCDTApvLineV"].ToString().Split('|');
				//기준결재단계
				if (aContdition.Length > 0)
				{
					string[] aFixOUCodes = Request.QueryString["dppathid"].Split('\\');
					string[] aFixOUNames = Request.QueryString["dppathdn"].Split('\\');
					sb.Append("<item>");
					sb.Append("<id>reservedapvline</id>");
					sb.Append("<signlistname>reservedapvline</signlistname>");
					sb.Append("<signinform>");
					SqlDbAgent.ConnectionString =  Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
					INPUT.add("@user_id",Request.QueryString["usid"]);
					INPUT.add("@step",aContdition[0]);
					INPUT.add("@division", aFixOUCodes[1]);
					if (aContdition[1] == null || aContdition[1] == "F")
					{
						INPUT.add("@controlleruser","F");
					}
					else
					{
						try
						{
							oSchemaXMLDOM = pParseRequestBytes();
						}
						catch (System.Exception ex)
						{
						}
						if (oSchemaXMLDOM == null)
						{
							INPUT.add("@controlleruser", "F");
						}
						else
						{
							INPUT.add("@controlleruser",oSchemaXMLDOM.DocumentElement.SelectSingleNode("ct").InnerText);
						}
					}
					string szAMTCondition = string.Empty;
					for (int i = 2; i < aContdition.Length; i++)
					{
						szAMTCondition += aContdition[i].Split(';')[1].ToUpper() + ';';

					}

					INPUT.add("@AMTCONDITION",szAMTCondition);

					if (Request.QueryString["dpid"] != null)
					{
						INPUT.add("@UNIT_CODE",Request.QueryString["dpid"].ToString());
					}
					else
					{
						INPUT.add("@UNIT_CODE",string.Empty);
					}

					oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_getAPVLINEBYCONDITION", INPUT);
					sb.Append(oDS.GetXml());
					sb.Append("</signinform>");
					sb.Append("<abstract>");
					sb.Append("</abstract>");
					sb.Append("<dscr>");
					sb.Append("</dscr>");
					sb.Append("</item>");

				}
			}
			//기안 혹은 임시저장함에서 문서를 열면서 구분별 자동결재선 적용여부 확인
            else if ((Request.QueryString["mode"] == "DRAFT" || Request.QueryString["mode"] == "TEMPSAVE") && Request.QueryString["scMODEApvLine"] == "1" && Request.QueryString["scMODEApvLineV"] != "")
            {
                strQuery = "[dbo].[usp_wf_GetPrivateDomainData]";
                INPUT.add("@OWNER_ID", Request.QueryString["scMODEApvLineV"]);

                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, strQuery, INPUT);
                INPUT.Clear();
                if (oDS.Tables[0].Rows.Count > 0)
                {
                    sb.Append("<item>");
                    sb.Append("<id>");
                    sb.Append(oDS.Tables[0].Rows[0]["PDD_ID"].ToString());
                    sb.Append("</id>");
                    sb.Append("<signlistname><![CDATA[");
                    sb.Append(oDS.Tables[0].Rows[0]["DISPLAY_NAME"].ToString());
                    sb.Append("]]></signlistname>");
                    sb.Append("<signinform><![CDATA[");
                    sb.Append(oDS.Tables[0].Rows[0]["PRIVATE_CONTEXT"].ToString());
                    sb.Append("]]></signinform>");
                    sb.Append("<abstract><![CDATA[");
                    sb.Append(oDS.Tables[0].Rows[0]["ABSTRACT"].ToString());
                    sb.Append("]]></abstract>");
                    sb.Append("<dscr><![CDATA[");
                    sb.Append(oDS.Tables[0].Rows[0]["DSCR"].ToString());
                    sb.Append("]]></dscr>");
                    sb.Append("</item>");

                }
            }
            //재기안에서 문서를 열면서 담당부서자동결재선 적용여부 확인
            else if ((Request.QueryString["mode"] == "REDRAFT") && Request.QueryString["scRCDTApvLine"] == "1" && Request.QueryString["scRCDTApvLineV"] != "")
            {
                sb.Append("<item>");
                sb.Append("<id>reservedapvline</id>");
                sb.Append("<signlistname>reservedapvline</signlistname>");
                sb.Append("<signinform>");
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
                INPUT.add("@user_id", Request.QueryString["usid"]);
                INPUT.add("@step", Request.QueryString["scRCDTApvLineV"]);
                INPUT.add("@division", string.Empty);
                INPUT.add("@controlleruser", "F");
                INPUT.add("@AMTCONDITION", string.Empty);
                if (Request.QueryString["dpid"] != null)
                {
                    INPUT.add("@UNIT_CODE", Request.QueryString["dpid"].ToString());
                }
                else
                {
                    INPUT.add("@UNIT_CODE", string.Empty);
                }
                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_getAPVLINEBYCONDITION", INPUT);

                sb.Append(oDS.GetXml());
                sb.Append("</signinform>");
                sb.Append("<abstract>");
                sb.Append("</abstract>");
                sb.Append("<dscr>");
                sb.Append("</dscr>");
                sb.Append("</item>");

            }
            else
            {
                //0. 임시저장 결재선 조회
                if (Request.QueryString["ftid"] != null && Request.QueryString["ftid"] != "")
                {
                    //strQuery = "SELECT TOP 1 PDD_ID,	DISPLAY_NAME, ABSTRACT, DSCR,PRIVATE_CONTEXT    FROM WF_PRIVATE_DOMAIN_DATA(NOLOCK)	WHERE 	CUSTOM_CATEGORY = 'APPROVERCONTEXT'		AND	OWNER_ID ='" + Request.QueryString["ftid"] + "' ";
                    strQuery = "[dbo].[usp_wf_GetPrivateDomainData]";
                    INPUT.add("@OWNER_ID", Request.QueryString["ftid"]);

                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                    oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, strQuery, INPUT);
                    INPUT.Clear();
                    if (oDS.Tables[0].Rows.Count > 0)
                    {
                        sb.Append("<item>");
                        sb.Append("<id>");
                        sb.Append(oDS.Tables[0].Rows[0]["PDD_ID"].ToString());
                        sb.Append("</id>");
                        sb.Append("<signlistname><![CDATA[");
                        sb.Append(oDS.Tables[0].Rows[0]["DISPLAY_NAME"].ToString());
                        sb.Append("]]></signlistname>");
                        sb.Append("<signinform><![CDATA[");
                        sb.Append(oDS.Tables[0].Rows[0]["PRIVATE_CONTEXT"].ToString());
                        sb.Append("]]></signinform>");
                        sb.Append("<abstract><![CDATA[");
                        sb.Append(oDS.Tables[0].Rows[0]["ABSTRACT"].ToString());
                        sb.Append("]]></abstract>");
                        sb.Append("<dscr><![CDATA[");
                        sb.Append(oDS.Tables[0].Rows[0]["DSCR"].ToString());
                        sb.Append("]]></dscr>");
                        sb.Append("</item>");

                    }

                }
                if (sb.Length == 0)
                {
                    if ((Request.QueryString["mode"] == "DRAFT" || Request.QueryString["mode"] == "TEMPSAVE"))
                    {
                        //양식별 개인 최종 결재선
                        strQuery = "[dbo].[usp_wf_GetPrivateDomainData]";
                        INPUT.add("@OWNER_ID", Request.QueryString["usid"] + "_" + Request.QueryString["fmpf"]);
                        
                        SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                        oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, strQuery, INPUT);

                        INPUT.Clear();
                        if (oDS.Tables[0].Rows.Count > 0)
                        {
                            sb.Append("<item>");
                            sb.Append("<id>");
                            sb.Append(oDS.Tables[0].Rows[0]["PDD_ID"].ToString());
                            sb.Append("</id>");
                            sb.Append("<signlistname><![CDATA[");
                            sb.Append(oDS.Tables[0].Rows[0]["DISPLAY_NAME"].ToString());
                            sb.Append("]]></signlistname>");
                            sb.Append("<signinform><![CDATA[");
                            sb.Append(oDS.Tables[0].Rows[0]["PRIVATE_CONTEXT"].ToString());
                            sb.Append("]]></signinform>");
                            sb.Append("<abstract><![CDATA[");
                            sb.Append(oDS.Tables[0].Rows[0]["ABSTRACT"].ToString());
                            sb.Append("]]></abstract>");
                            sb.Append("<dscr><![CDATA[");
                            sb.Append(oDS.Tables[0].Rows[0]["DSCR"].ToString());
                            sb.Append("]]></dscr>");
                            sb.Append("</item>");
                        }
                        else
                        {
                            //1. 양식별 지정 결재선 조회
                            //strQuery = "SELECT PDD_ID,	DISPLAY_NAME, ABSTRACT, DSCR,PRIVATE_CONTEXT    FROM WF_PRIVATE_DOMAIN_DATA(NOLOCK)	WHERE 	CUSTOM_CATEGORY = 'APPROVERCONTEXT'		AND	OWNER_ID ='" + Request.QueryString["fmid"] + "' ";
                            strQuery = "[dbo].[usp_wf_GetPrivateDomainData]";
                            INPUT.add("@OWNER_ID", Request.QueryString["fmid"]);

                            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();

                            oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, strQuery, INPUT);
                            INPUT.Clear();
                            if (oDS.Tables[0].Rows.Count > 0)
                            {
                                sb.Append("<item>");
                                sb.Append("<id>");
                                sb.Append(oDS.Tables[0].Rows[0]["PDD_ID"].ToString());
                                sb.Append("</id>");
                                sb.Append("<signlistname><![CDATA[");
                                sb.Append(oDS.Tables[0].Rows[0]["DISPLAY_NAME"].ToString());
                                sb.Append("]]></signlistname>");
                                sb.Append("<signinform><![CDATA[");
                                sb.Append(oDS.Tables[0].Rows[0]["PRIVATE_CONTEXT"].ToString());
                                sb.Append("]]></signinform>");
                                sb.Append("<abstract><![CDATA[");
                                sb.Append(oDS.Tables[0].Rows[0]["ABSTRACT"].ToString());
                                sb.Append("]]></abstract>");
                                sb.Append("<dscr><![CDATA[");
                                sb.Append(oDS.Tables[0].Rows[0]["DSCR"].ToString());
                                sb.Append("]]></dscr>");
                                sb.Append("</item>");
                            }
                            else
                            {
                                //2. 주결재선 조회
                                //strQuery = "SELECT TOP 1 PDD_ID,	DISPLAY_NAME, ABSTRACT, DSCR,PRIVATE_CONTEXT    FROM WF_PRIVATE_DOMAIN_DATA(NOLOCK)	WHERE 	CUSTOM_CATEGORY = 'APPROVERCONTEXT'		AND	OWNER_ID ='" + Request.QueryString["usid"] + "' AND	DISPLAY_NAME LIKE '*%' ";
                                strQuery = "[dbo].[usp_wf_GetPrivateDomainDataP]";
                                INPUT.add("@OWNER_ID", Request.QueryString["usid"]);

                                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();

                                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, strQuery, INPUT);
                                INPUT.Clear();
                                if (oDS.Tables[0].Rows.Count > 0)
                                {
                                    sb.Append("<item>");
                                    sb.Append("<id>");
                                    sb.Append(oDS.Tables[0].Rows[0]["PDD_ID"].ToString());
                                    sb.Append("</id>");
                                    sb.Append("<signlistname><![CDATA[");
                                    sb.Append(oDS.Tables[0].Rows[0]["DISPLAY_NAME"].ToString());
                                    sb.Append("]]></signlistname>");
                                    sb.Append("<signinform><![CDATA[");
                                    sb.Append(oDS.Tables[0].Rows[0]["PRIVATE_CONTEXT"].ToString());
                                    sb.Append("]]></signinform>");
                                    sb.Append("<abstract><![CDATA[");
                                    sb.Append(oDS.Tables[0].Rows[0]["ABSTRACT"].ToString());
                                    sb.Append("]]></abstract>");
                                    sb.Append("<dscr><![CDATA[");
                                    sb.Append(oDS.Tables[0].Rows[0]["DSCR"].ToString());
                                    sb.Append("]]></dscr>");
                                    sb.Append("</item>");

                                }
                                else
                                {
                                    //3. 고정결재선 생성
                                    if (System.Configuration.ConfigurationManager.AppSettings["WF_NotFixApvLinePDEF"].IndexOf(Request.QueryString["pdefid"]) > -1)
                                    {
                                        string[] aOUCodes = Request.QueryString["dppathid"].Split('\\');
                                        string[] aOUNames = Request.QueryString["dppathdn"].Split('\\');
                                        sb.Append("<item>");
                                        sb.Append("<id>reservedapvline</id>");
                                        sb.Append("<signlistname>reservedapvline</signlistname>");
                                        sb.Append("<signinform><![CDATA[");
                                        sb.Append("<steps status='inactive'>");

                                        for (int i = aOUCodes.Length - 1; i < 0; i--)
                                        {
                                            if (i != aOUCodes.Length - 1 || Session["ismanager"].ToString() != "false")
                                            {
                                                sb.Append("<step unittype='role' routetype='approve' name='일반결재'>");
                                                sb.Append("<ou code='").Append(aOUCodes[i]).Append("' name='").Append(aOUNames[i]).Append("'>");
                                                sb.Append("<role code='UNIT_MANAGER' name='").Append(aOUNames[i]).Append("장' oucode='").Append(aOUCodes[i]).Append("' ouname='").Append(aOUNames[i]).Append("'>");
                                                sb.Append("<taskinfo status='inactive' result='inactive' kind='normal' />");
                                                sb.Append("</role>");
                                                sb.Append("</ou>");
                                                sb.Append("</step>");
                                            }
                                        }
                                        sb.Append("</steps>");
                                        sb.Append("");
                                        sb.Append("]]></signinform>");
                                        sb.Append("<abstract>");
                                        sb.Append("</abstract>");
                                        sb.Append("<dscr>");
                                        sb.Append("</dscr>");
                                        sb.Append("</item>");
                                    }
                                }

                            }
                        }
                    }
                    else
                    {
                        //2. 주결재선 조회
                        //strQuery = "SELECT TOP 1 PDD_ID,	DISPLAY_NAME, ABSTRACT, DSCR,PRIVATE_CONTEXT    FROM WF_PRIVATE_DOMAIN_DATA(NOLOCK)	WHERE 	CUSTOM_CATEGORY = 'APPROVERCONTEXT'		AND	OWNER_ID ='" + Request.QueryString["usid"] + "' AND	DISPLAY_NAME LIKE '*%' ";
                        strQuery = "[dbo].[usp_wf_GetPrivateDomainDataP]";
                        INPUT.add("@OWNER_ID", Request.QueryString["usid"]);
                        SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();

                        oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, strQuery, INPUT);
                        INPUT.Clear();
                        if (oDS.Tables[0].Rows.Count > 0)
                        {
                            sb.Append("<item>");
                            sb.Append("<id>");
                            sb.Append(oDS.Tables[0].Rows[0]["PDD_ID"].ToString());
                            sb.Append("</id>");
                            sb.Append("<signlistname><![CDATA[");
                            sb.Append(oDS.Tables[0].Rows[0]["DISPLAY_NAME"].ToString());
                            sb.Append("]]></signlistname>");
                            sb.Append("<signinform><![CDATA[");
                            sb.Append(oDS.Tables[0].Rows[0]["PRIVATE_CONTEXT"].ToString());
                            sb.Append("]]></signinform>");
                            sb.Append("<abstract><![CDATA[");
                            sb.Append(oDS.Tables[0].Rows[0]["ABSTRACT"].ToString());
                            sb.Append("]]></abstract>");
                            sb.Append("<dscr><![CDATA[");
                            sb.Append(oDS.Tables[0].Rows[0]["DSCR"].ToString());
                            sb.Append("]]></dscr>");
                            sb.Append("</item>");

                        }

                    }
                }
            }
			Response.Write(sb.ToString());
		}
		catch(Exception ex)
		{
			throw new System.Exception(null, ex);
		}
		finally
		{
			if (oDS != null)
			{
				oDS.Dispose();
				oDS = null;
			}
			if (SqlDbAgent != null)
			{
				SqlDbAgent.Dispose();
				SqlDbAgent = null;
			}
			if (INPUT != null)
			{
				INPUT.Dispose();
				INPUT = null;
			}
			if (sb != null) sb = null;
		}
	}
     
	private string pGetApvLines(System.Xml.XmlNode oelmRoot)
	{
		//System.IO.StringWriter oTW = new System.IO.StringWriter();
		//try
		//{
		//    //        Dim xslsteps As New System.Xml.Xsl.XslTransform
		//    //        oTW = New System.IO.StringWriter
		//    System.Xml.Xsl.XslTransform xslsteps = new System.Xml.Xsl.XslTransform();
		//    //System.Xml.Xsl.XslCompiledTransform xslsteps = new System.Xml.Xsl.XslCompiledTransform();
		//    xslsteps.Load(Server_MapPath("SetApvliststeps.xsl"));
		//    //xslsteps.Load(Server_MapPath("SetApvliststeps.xsl"))
		//    System.Xml.XPath.XPathDocument oXPathDoc = new System.Xml.XPath.XPathDocument(new System.IO.StringReader(oelmRoot.OuterXml));
		//    //Dim oXPathDoc As New System.Xml.XPath.XPathDocument(New System.IO.StringReader(oelmRoot.OuterXml))
		//    System.Xml.XmlUrlResolver oXMLResolver = new System.Xml.XmlUrlResolver();
		//    //Dim oXMLResolver As New System.Xml.XmlUrlResolver
		//    xslsteps.Transform(oXPathDoc, null, oTW, oXMLResolver);
		//    //xslsteps.Transform(oXPathDoc, Nothing, oTW, oXMLResolver)
		//    oTW.GetStringBuilder().Remove(0, 39);
		//    //oTW.GetStringBuilder().Remove(0, 39)
		//    return oTW.ToString();
		//    //Return oTW.ToString()
		//    //oTW.Close();
		//    //oTW = null;
		//}
		//catch(System.Exception Ex)
		//{
		//    throw new System.Exception(null, Ex);
		//}
		//finally
		//{
		//    if(oTW != null) oTW.Close();
		//}
		System.IO.StringReader oSR = new System.IO.StringReader((oelmRoot.OuterXml));
		System.Xml.Xsl.XslCompiledTransform oXSLT = new System.Xml.Xsl.XslCompiledTransform();
		System.Xml.XPath.XPathDocument oXPathDoc = new System.Xml.XPath.XPathDocument(oSR);
		System.IO.StringWriter oSW = new System.IO.StringWriter();
		string sReturn = "";
		try
		{
			{//이준희(2010-10-07): Changed to support SharePoint environment.
			//oXSLT.Load(Server_MapPath("SetApvliststeps.xsl"));
			oXSLT.Load(cbsg.CoviServer_MapPath("SetApvliststeps.xsl"));
			}
			oXSLT.Transform(oXPathDoc, null, oSW);

			sReturn = oSW.ToString();

		}
		catch (System.Exception ex)
		{
            
			throw new System.Exception("pGetApvLines", ex);
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
//Private Function pGetApvLines(ByVal oelmRoot As System.Xml.XmlNode) As String
//    Dim oTW As System.IO.StringWriter
//    Try

//    Catch Ex As System.Exception
//        Throw New System.Exception(Nothing, Ex)
//    Finally
//        If Not oTW Is Nothing Then
//            oTW.Close()
//        End If
//    End Try
//End Function
	private void HandleException(System.Exception _Ex)
	{
		try
		{
			Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)) + "]]></error>");
		}
		catch(System.Exception Ex)
		{            
			Response.Write("<error><![CDATA[" + Ex.Message + "]]></error>");
		}
	}
	private System.Xml.XmlDocument pParseRequestBytes()
	{
		System.Byte[] aBytes = Request.BinaryRead(Request.TotalBytes);
		try
		{
			System.Xml.XmlDocument oXMLData = new System.Xml.XmlDocument();
			System.Text.Decoder oDecoder = System.Text.Encoding.UTF8.GetDecoder();
			//aBytes = Request.BinaryRead(Request.TotalBytes);
			//Dim aChars(oDecoder.GetCharCount(aBytes, 0, aBytes.Length)) As System.Char;
			System.Char[] aChars = new Char[oDecoder.GetCharCount(aBytes, 0, aBytes.Length)];
			oDecoder.GetChars(aBytes, 0, aBytes.Length, aChars, 0);
			oXMLData.Load(new System.IO.StringReader(new String(aChars)));
			return oXMLData;
		}
		catch (System.Exception Ex)
		{
			throw new Exception("pParseRequestBytes", Ex);
		}
	}
}
