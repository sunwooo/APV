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
using System.Xml;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.XPath;
using System.Xml.Xsl;

public partial class Approval_getXMLList : System.Web.UI.Page // PageBase
{
	private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
	public XmlDocument oXMLList = new XmlDocument();
	public String sList = string.Empty;
	public int totalcount = 0;
	public int totalpage = 0;
	public int pagecnt = 0;
	public int pagenum = 0;
	public String strContextMenuType = "";
	public String strTitle = "";
	public String foldermode = "";
	public String mode = "";
	public String strBox = "";
	public string subkind = "";
	public String serror = "";
	public string strLangIndex = "0";

	protected void Page_Load(object sender, EventArgs e)
	{

		Response.ContentType = "text/xml";
		Response.Expires = -1;
		Response.CacheControl = "no-cache";
		Response.Buffer = true;

		//code
		if (Session["user_language"] != null)
		{
			strLangID = Session["user_language"].ToString();
		}
		//다국어 언어설정
		string culturecode = strLangID; //"en-US"; "ja-JP";
		Page.UICulture = culturecode;
		Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);
		
		try
		{

			if (this.Page.Application["ContextMenu_USER_YN"].ToString() == "Y")
			{
				strContextMenuType = "ctx";
			}
			else if (this.Page.Application["ContextMenu_OCS"].ToString() == "Y")
			{
				strContextMenuType = "ocs";
			}
			else
			{
				strContextMenuType = string.Empty;
			}
			pSetData();
			if (mode == "")
			{
				mode = "TEMPSAVE";
			}
			pMakeXML();
		}
		catch (Exception ex)
		{
			pHandleException(ex);
		}
		finally
		{
		}
		
	}


	/// <summary>
	/// sql query 실행
	/// </summary>
	private void pSetData()
	{
		XmlDocument oXML = new XmlDocument();
		StringBuilder sb = new StringBuilder();
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
				{//이준희(2011-01-05): Added to support SharePoint environment.
					if (szXSLPath.IndexOf("?") > -1)
					{//szXSLPath = Server.UrlDecode(szXSLPath.Split('?')[1]);
						szXSLPath = Server.UrlDecode(Regex.Split(szXSLPath, "CEPSUrl=")[1]);
						szXSLPath = szXSLPath.Substring(szXSLPath.LastIndexOf("/") + 1);
					}
				}
				if (szXSLPath != "") szXSLPath = szXSLPath.Replace(Request.Url.Host, Server.MachineName);

				System.Xml.XmlNodeList oParams = oXML.SelectNodes("Items/param");
				foreach (System.Xml.XmlNode oParam in oParams)
				{
					INPUT.add("@" + oParam.SelectSingleNode("name").InnerText, oParam.SelectSingleNode("value").InnerText);
					if (oParam.SelectSingleNode("name").InnerText == "pagenum") { pagenum = Convert.ToInt16(oParam.SelectSingleNode("value").InnerText); }
					if (oParam.SelectSingleNode("name").InnerText == "page_size") { pagecnt = Convert.ToInt16(oParam.SelectSingleNode("value").InnerText); }
					if (oParam.SelectSingleNode("name").InnerText == "MODE") { mode = oParam.SelectSingleNode("value").InnerText; }
				}

				using (SqlDacBase SqlDbAgent = new SqlDacBase())
				{
					////완료함 뒤로가기 bug 문제 : ConnectionString 일단 강제변환 hichang START
					//if (mode == "APPROVAL" || mode == "PREAPPROVAL" || mode == "PROCESS" )
					//{
					//    g_connectString = "INST_ConnectionString";
					//}
					////완료함 뒤로가기 bug 문제 : ConnectionString 일단 강제변환 hichang END

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
				//if (szXSLPath != "")
				//{
				//    Response.Write(COVIFlowCom.Common.pTransform(ds.GetXml(), szXSLPath).Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", ""));
				//}
				//else
				//{
				//    Response.Write(ds.GetXml());
				//}
				strTitle = oXML.SelectSingleNode("Items/datetitle").InnerText;
				foldermode = oXML.SelectSingleNode("Items/foldermode").InnerText;

				if (strBox == "") { strBox = oXML.SelectSingleNode("Items/strBox").InnerText; }
				if (mode == "")
				{
					mode = oXML.SelectSingleNode("Items/gLocation").InnerText;
					if (mode == "DEPART" && strBox == "D")
					{
						mode = "TCINFO";
					}
				}

				sb.Append(this.pTransform(ds.GetXml(), AppDomain.CurrentDomain.BaseDirectory + "Approval\\" + szXSLPath, mode, foldermode, strBox).Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", ""));

				oXMLList.LoadXml(sb.ToString());
				if (mode == "DEPART" && strBox == "D") mode = "TCINFO";
			}
			catch (System.Exception ex)
			{
				throw ex;
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
			sb = null;
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
			//Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ParseStackTrace(ex) + "]]></error>");
			serror = "<error><![CDATA[" + COVIFlowCom.ErrResult.ParseStackTrace(ex) + "]]></error>";
		}
		catch (Exception e)
		{
			//Response.Write("<error><![CDATA[" + e.Message + "]]></error>");
			serror = "<error><![CDATA[" + e.Message + "]]></error>";
		}
	}
	/// <summary>
	/// xml형태를 갖는 데이터를 xsl file을 이용하여 변환
	/// </summary>
	/// <param name="sXML">xml형태의 데이터</param>
	/// <param name="sXSLPath">xsl file path</param>
	/// <returns>String</returns>
	private static System.Xml.Xsl.XslCompiledTransform oXSLTTEMPSAVE = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLTTCINFO = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLTAPV = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLTFOLDER01 = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLTFOLDER02 = null;
	private static System.Xml.Xsl.XslCompiledTransform oXSLTAPVDEPART = null;
	/// <summary>
	/// Data를 XML형태(string)로 받아 XSL로 Parsing해주는 함수
	/// </summary>
	/// <param name="sXML">XML string</param>
	/// <param name="sXSLPath">XSL파일 경로</param>
	/// <param name="smode"></param>
	/// <returns></returns>
	public string pTransform(string sXML, System.String sXSLPath, string smode, string foldermode, string strbox)
	{
		System.IO.StringReader oSR = null;
		System.Xml.XPath.XPathDocument oXPathDoc = null;
		System.IO.StringWriter oSW = null;
		string sReturn = "";

		System.Xml.Xsl.XsltSettings XSLTsettings = null;
		try
		{
			XSLTsettings = new System.Xml.Xsl.XsltSettings();
			XSLTsettings.EnableScript = true;
			oSR = new System.IO.StringReader(sXML.ToString());
			oXPathDoc = new System.Xml.XPath.XPathDocument(oSR);
			oSW = new System.IO.StringWriter();
			if (smode == "TEMPSAVE")
			{
				if (oXSLTTEMPSAVE == null)
				{
					oXSLTTEMPSAVE = new System.Xml.Xsl.XslCompiledTransform();
					oXSLTTEMPSAVE.Load(sXSLPath, XSLTsettings, null);
				}
				XsltArgumentList xslArg = new XsltArgumentList();
				cfxsl o = new cfxsl();
				xslArg.AddExtensionObject("urn:cfxsl", o);

				oXSLTTEMPSAVE.Transform(oXPathDoc, xslArg, oSW);
			}
			else if (smode == "TCINFO" || (smode == "DEPRT" && strbox == "D"))
			{
				if (oXSLTTCINFO == null)
				{
					oXSLTTCINFO = new System.Xml.Xsl.XslCompiledTransform();
					oXSLTTCINFO.Load(sXSLPath, XSLTsettings, null);
				}
				XsltArgumentList xslArg = new XsltArgumentList();
				cfxsl o = new cfxsl();
				xslArg.AddExtensionObject("urn:cfxsl", o);

				oXSLTTCINFO.Transform(oXPathDoc, xslArg, oSW);
			}
			else if (smode == "UFOLDER" && foldermode == "I")
			{

				if (oXSLTFOLDER01 == null)
				{
					oXSLTFOLDER01 = new System.Xml.Xsl.XslCompiledTransform();
					oXSLTFOLDER01.Load(sXSLPath, XSLTsettings, null);
				}
				XsltArgumentList xslArg = new XsltArgumentList();
				cfxsl o = new cfxsl();
				xslArg.AddExtensionObject("urn:cfxsl", o);

				oXSLTFOLDER01.Transform(oXPathDoc, xslArg, oSW);

			}
			else if (smode == "UFOLDER" && foldermode != "I")
			{

				if (oXSLTFOLDER02 == null)
				{
					oXSLTFOLDER02 = new System.Xml.Xsl.XslCompiledTransform();
					oXSLTFOLDER02.Load(sXSLPath, XSLTsettings, null);
				}
				XsltArgumentList xslArg = new XsltArgumentList();
				cfxsl o = new cfxsl();
				xslArg.AddExtensionObject("urn:cfxsl", o);

				oXSLTFOLDER02.Transform(oXPathDoc, xslArg, oSW);

			}
			else if (smode == "DEPART" && (strbox == "R" || strbox == "AD"))
			{

				if (oXSLTAPVDEPART == null)
				{
					oXSLTAPVDEPART = new System.Xml.Xsl.XslCompiledTransform();
					oXSLTAPVDEPART.Load(sXSLPath, XSLTsettings, null);
				}
				XsltArgumentList xslArg = new XsltArgumentList();
				cfxsl o = new cfxsl();
				xslArg.AddExtensionObject("urn:cfxsl", o);

				oXSLTAPVDEPART.Transform(oXPathDoc, xslArg, oSW);

			}
			else
			{
				if (oXSLTAPV == null)
				{
					oXSLTAPV = new System.Xml.Xsl.XslCompiledTransform();
					oXSLTAPV.Load(sXSLPath, XSLTsettings, null);
				}
				XsltArgumentList xslArg = new XsltArgumentList();
				cfxsl o = new cfxsl();
				xslArg.AddExtensionObject("urn:cfxsl", o);

				oXSLTAPV.Transform(oXPathDoc, xslArg, oSW);
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
			if (XSLTsettings != null)
			{
				XSLTsettings = null;
			}
		}
		return sReturn;
	}
	/// <summary>
	/// 결재함 본문 그리기
	/// </summary>
	private void pMakeXML()
	{

		StringBuilder sb = new StringBuilder();
		XmlNode emlRoot = oXMLList.DocumentElement;
		cfxsl cfxsl = new cfxsl();
		string id = "";
		string fmid = "";
		string fmnm = "";
		string fmpf = "";
		string fmrv = "";
		string scid = "";
		string fiid = "";
		string fmfn = "";
		string piid = "";
		string bstate = "";
		string ftid = "";
		string fitn = "";
		XmlDocument PI_DSCR = new XmlDocument();
		XmlNode oforminfo = null;
		XmlNodeList emlList = null;

		switch (mode)
		{
			case "UFOLDER": emlList = emlRoot.SelectNodes("workitem"); break;
			case "TEMPSAVE": emlList = emlRoot.SelectNodes("forminstance"); break;
			case "TCINFO": emlList = emlRoot.SelectNodes("forminstance"); break;
			default: emlList = emlRoot.SelectNodes("workitem"); break;
		}
		try
		{
			if (emlList != null)
			{

				//count
				totalcount = Convert.ToInt16(emlRoot.SelectSingleNode("totalcount").InnerText);
				totalpage = cfxsl.getPageValue(pagecnt, totalcount);

				//list
				if (emlList.Count == 0)
				{
					sb.Append("<tr>");
					switch (mode)
					{
						case "UFOLDER":
							if (foldermode == "I")
							{
								sb.Append("	<td colspan=\"3\" ");
							}
							else
							{
								sb.Append("	<td colspan=\"6\" ");
							}
							break;
						case "PREAPPROVAL": sb.Append("	<td colspan=\"8\" "); break;
						case "TEMPSAVE": sb.Append("	<td colspan=\"4\" "); break;
						case "TCINFO": sb.Append("	<td colspan=\"6\" "); break;
						case "REJECT": sb.Append("	<td colspan=\"8\" "); break;
						case "REVIEW": sb.Append("	<td colspan=\"7\" "); break;
						default: sb.Append("	<td colspan=\"9\" "); break;
					}
					sb.Append(" nowrap=\"true\" align=\"center\" class=\"BTable_bg08\">").Append(Resources.Approval.msg_101).Append("</td>");
					sb.Append("</tr>");
				}
				else
				{
					int i = 0;
					foreach (XmlNode eml in emlList)
					{
						sb.Append("<tr onkeydown=\"event_row_onkeydown\" onkeyup=\"event_row_onkeyup\" onselectstart=\"event_row_onselectstart\" ");
						sb.Append(" onMouseover=\"this.style.background='#F8F4DE';\" ");
						sb.Append(" onMouseout=\"this.style.background=''\" ");

						string ispaper = "";
						string ugrs = "";
						string rqrs = "";
						string secdoc = "";
						string isfile = "";
						string edms_document = "";
						string title = "";
						#region PI_DSCR
						if (mode != "TEMPSAVE")
						{
							if (eml.SelectSingleNode("effectcmt") != null)
							{
								PI_DSCR.LoadXml(eml.SelectSingleNode("effectcmt").InnerText.Split(';')[0]);
								piid = eml.SelectSingleNode("effectcmt").InnerText.Split(';')[1];
								bstate = eml.SelectSingleNode("effectcmt").InnerText.Split(';')[2];
							}
							else if (eml.SelectSingleNode("linkurl") != null)
							{
								if (eml.SelectSingleNode("linkurl").InnerText.Split(';')[0] != string.Empty)
								{
									try
									{
										PI_DSCR.LoadXml(eml.SelectSingleNode("linkurl").InnerText.Split(';')[0]);
									}
									catch (System.Exception ex)
									{
									}
								}
								piid = eml.SelectSingleNode("linkurl").InnerText.Split(';')[1];
								bstate = eml.SelectSingleNode("linkurl").InnerText.Split(';')[2];
							}
							else if (eml.SelectSingleNode("link_url") != null)
							{
								PI_DSCR.LoadXml(eml.SelectSingleNode("link_url").InnerText);
								piid = eml.SelectSingleNode("piid").InnerText;
								bstate = eml.SelectSingleNode("bstate").InnerText;
							}
                            else if (eml.SelectSingleNode("pidc") != null && eml.SelectSingleNode("pidc").InnerText !="")
							{
								PI_DSCR.LoadXml(eml.SelectSingleNode("pidc").InnerText);
							}
							if (PI_DSCR != null)
							{
								oforminfo = PI_DSCR.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");
							}
							if (oforminfo != null)
							{
								fmid = oforminfo.Attributes["id"].Value;
								fmnm = oforminfo.Attributes["name"].Value;
								fmpf = oforminfo.Attributes["prefix"].Value;
								fmrv = oforminfo.Attributes["revision"].Value;
								scid = oforminfo.Attributes["schemaid"].Value;
								fiid = oforminfo.Attributes["instanceid"].Value;
								if (oforminfo.Attributes["filename"] != null) fmfn = oforminfo.Attributes["filename"].Value;
								if (oforminfo.Attributes["ispaper"] != null) ispaper = oforminfo.Attributes["ispaper"].Value;
								if (oforminfo.Attributes["urgentreason"] != null) ugrs = oforminfo.Attributes["urgentreason"].Value;
								if (oforminfo.Attributes["req_response"] != null) rqrs = oforminfo.Attributes["req_response"].Value;
								if (oforminfo.Attributes["secure_doc"] != null) secdoc = oforminfo.Attributes["secure_doc"].Value;
								if (oforminfo.Attributes["isfile"] != null) isfile = oforminfo.Attributes["isfile"].Value;
								if (oforminfo.Attributes["edms_document"] != null) edms_document = oforminfo.Attributes["edms_document"].Value;
							}
						}
						if (secdoc == "") { secdoc = "0"; }
						if (isfile != "0" && isfile != "") { isfile = "1"; } else { isfile = "0"; }
						if (edms_document == "") { edms_document = "0"; } else { edms_document = "1"; }

						if (eml.SelectSingleNode("docsubject") != null) title = eml.SelectSingleNode("docsubject").InnerText;
						if (eml.SelectSingleNode("piid") != null) piid = eml.SelectSingleNode("piid").InnerText;
						if (eml.SelectSingleNode("bstate") != null) bstate = eml.SelectSingleNode("bstate").InnerText;
						if (eml.SelectSingleNode("title") != null) title = eml.SelectSingleNode("title").InnerText;

						#endregion

						if (mode == "TEMPSAVE")
						{
							#region TEMPSAVE Attribute Setting
							sb.Append(" id=\"").Append(eml.SelectSingleNode("ftid").InnerText).Append("\"");
							//sb.Append(" workitemid=\"").Append(eml.SelectSingleNode("ftid").InnerText).Append("\"");
							sb.Append(" ftid=\"").Append(eml.SelectSingleNode("ftid").InnerText).Append("\"");
							sb.Append(" fiid=\"").Append(eml.SelectSingleNode("fiid").InnerText).Append("\"");
							sb.Append(" fmid=\"").Append(eml.SelectSingleNode("fmid").InnerText).Append("\"");
							sb.Append(" fmnm=\"").Append(eml.SelectSingleNode("fmnm").InnerText).Append("\"");
							sb.Append(" fmrv=\"").Append(eml.SelectSingleNode("fmrv").InnerText).Append("\"");
							sb.Append(" scid=\"").Append(eml.SelectSingleNode("scid").InnerText).Append("\"");
							sb.Append(" fmpf=\"").Append(eml.SelectSingleNode("fmpf").InnerText).Append("\"");
							sb.Append(" fmfn=\"").Append(eml.SelectSingleNode("fmfn").InnerText).Append("\"");
							sb.Append(" fitn=\"").Append(eml.SelectSingleNode("fitn").InnerText).Append("\"");
							sb.Append(" subject=\"").Append(replaceXLCharacter(eml.SelectSingleNode("title").InnerText)).Append("\"");
							sb.Append(" title=\"").Append(replaceXLCharacter(eml.SelectSingleNode("title").InnerText)).Append("\"");
							sb.Append(" mode=\"").Append(eml.SelectSingleNode("mode").InnerText).Append("\"");
							sb.Append(" picreatorid=\"").Append(eml.SelectSingleNode("picreatorid").InnerText).Append("\"");
							#endregion
							sb.Append(" rowselected='' ");
							sb.Append(" >");
							sb.Append("<td  nowrap=\"true\" style=\"padding-left:10px;overflow:hidden; paddingRight:1px;display:none;\" onselect=\"false\" onmousedown=\"noResponse(event);\" class=\"BTable_bg08\">");
							sb.Append("    <input type=\"checkbox\" id=\"chkAPV\" name=\"chkAPV\"></input>");
							sb.Append("</td>");
							#region TEMPSAVE LIST
							sb.Append("<td  nowrap=\"true\" style=\"padding-left:10px;overflow:hidden; paddingRight:1px;;\" onselect=\"false\" onmousedown=\"noResponse(event);\" class=\"BTable_bg08\">");
							sb.Append("    <input type=\"checkbox\" id=\"chkAPV\" name=\"chkAPV\"></input>");
							sb.Append("</td>");
							sb.Append("<td  nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">").Append(eml.SelectSingleNode("fmnm").InnerText).Append("</td>");
							sb.Append("<td  nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">");
                            sb.Append("     <a href=\"#\" class=\"text02_L\" >").Append(replaceXLCharacter(eml.SelectSingleNode("title").InnerText)).Append("</a>&#160;");
							sb.Append("</td>");
							sb.Append("<td  nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">").Append(eml.SelectSingleNode("createdate").InnerText).Append("</td>");
							#endregion
						}

						else if (mode == "TCINFO") //회람함
						{
							//장혜인 시작

							#region TCINFO Attribute Setting
							sb.Append(" piid=\"").Append(piid).Append("\"");
							sb.Append(" bstate=\"").Append(bstate).Append("\"");
							//sb.Append(" pidc=\"").Append(eml.SelectSingleNode("link_url").InnerText).Append("\"");										
							sb.Append(" mode=\"").Append(eml.SelectSingleNode("mode").InnerText).Append("\"");
							sb.Append(" workitemid=\"").Append("").Append("\"");
							sb.Append(" fiid=\"").Append(fiid).Append("\"");
							sb.Append(" fmid=\"").Append(fmid).Append("\"");
							sb.Append(" scid=\"").Append(scid).Append("\"");
							sb.Append(" fmpf=\"").Append(fmpf).Append("\"");
							sb.Append(" fmnm=\"").Append(fmnm).Append("\"");
							sb.Append(" fmrv=\"").Append(fmrv).Append("\"");
							sb.Append(" fmfn=\"").Append(fmfn).Append("\"");
							sb.Append(" ftid=\"").Append(ftid).Append("\"");
							sb.Append(" fitn=\"").Append(fitn).Append("\"");
							sb.Append(" picreatorid=\"").Append(eml.SelectSingleNode("picreatorid").InnerText).Append("\"");
							sb.Append(" picreator=\"").Append(eml.SelectSingleNode("picreator").InnerText).Append("\"");
							sb.Append(" createdate=\"").Append(eml.SelectSingleNode("createdate").InnerText).Append("\"");
                            sb.Append(" title=\"").Append(replaceXLCharacter(eml.SelectSingleNode("title").InnerText)).Append("\"");
							sb.Append(" link_url=\"").Append("").Append("\"");//eml.SelectSingleNode("link_url").InnerText

							sb.Append(" sendid=\"").Append(eml.SelectSingleNode("sendid").InnerText).Append("\"");
							sb.Append(" process_id=\"").Append(piid).Append("\"");
							sb.Append(" subject=\"").Append(replaceXLCharacter(title)).Append("\"");
							sb.Append(" pfsk=\"").Append(cfxsl.getPfsk(eml.SelectSingleNode("kind").InnerText)).Append("\"");
							sb.Append(" kind=\"").Append(eml.SelectSingleNode("kind").InnerText).Append("\"");
							sb.Append(" type=\"").Append(eml.SelectSingleNode("type").InnerText).Append("\"");

							sb.Append(" receipt_id=\"").Append(eml.SelectSingleNode("receipt_id").InnerText).Append("\"");
							sb.Append(" receipt_name=\"").Append(eml.SelectSingleNode("receipt_name").InnerText).Append("\"");
							sb.Append(" receipt_ou_id=\"").Append(eml.SelectSingleNode("receipt_ou_id").InnerText).Append("\"");
							sb.Append(" receipt_ou_name=\"").Append(eml.SelectSingleNode("receipt_ou_name").InnerText).Append("\"");
							sb.Append(" receipt_state=\"").Append(eml.SelectSingleNode("receipt_state").InnerText).Append("\"");
							sb.Append(" receipt_date=\"").Append(eml.SelectSingleNode("receipt_date").InnerText).Append("\"");

							sb.Append(" read_date=\"").Append(eml.SelectSingleNode("read_date").InnerText).Append("\"");

							#endregion

							sb.Append(" rowselected='' ");
							sb.Append(" >");
							sb.Append("<th  nowrap=\"true\" style=\"padding-left:10px;display:none;\" width=\"60\" onselect=\"false\" onmousedown=\"noResponse(event);\" class=\"BTable_bg08\">");
							//sb.Append("<input type=\"checkbox\" id=\"chkAPVALL\" name=\"chkAPVALL\" onclick=\"javascript:chkAPVALL_onClick();\"></input></th>");
							sb.Append("<input type=\"checkbox\" id=\"chkAPV\" name=\"chkAPV\"></input></th>"); //회람함 checkbok인식 오류 수정 2010-05-22 by ssuby
							#region case( TCINFO foldermode=I) LIST
							//KIND, 수정 필요     
							sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">");
							sb.Append("<a href=\"#\" onclick=\"javascript:OpenApprovalLine(this, event)\" class=\"text02_L\" ");
							sb.Append(" piid=\"").Append(piid).Append("\"");
							sb.Append(" scid=\"").Append(scid).Append("\"");
							sb.Append(" fmpf=\"").Append(fmpf).Append("\"");
							sb.Append(" fmrv=\"").Append(fmrv).Append("\"");
							sb.Append(" fiid=\"").Append(fiid).Append("\"");
							sb.Append(" >");
							sb.Append("<img src=\"").Append(Session["user_thema"].ToString()).Append("/Covi/Common/btn_type2/btn_lookdc.gif\" width=\"14px\" height=\"14px\" border=\"0\" align=\"absmiddle\" covimode=\"imgctxmenu\" />");
							sb.Append("</a>").Append(cfxsl.getSubKind(eml.SelectSingleNode("kind").InnerText, ""));
							sb.Append("</td>");
							//sb.Append("<td  nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">").Append(eml.SelectSingleNode("RECEIPT_TYPE").InnerText).Append("</td>");
							sb.Append("<td  nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">").Append(fmnm).Append("</td>");
							
							//참조/회람함 읽음 안읽음 처리 hichang 시작
							if (eml.SelectSingleNode("read_date").InnerText =="")
							{
								sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px; font-weight:bold;\" onselect=\"false\" class=\"BTable_bg08\"  onmouseover=\"event_GalTable_onmousemove(event);\" ");
							}else{
								sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\"  onmouseover=\"event_GalTable_onmousemove(event);\" ");
							}
							//참조/회람함 읽음 안읽음 처리 hichang 끝
							
							sb.Append(" alt=\"").Append(replaceXLCharacter(title)).Append("\"");
							sb.Append(" >");
							sb.Append("<div style=\"width: expression(this.firstChild.style.display == 'inline' ? this.style.width : this.parentNode.offsetWidth); overflow: hidden; white-space: nowrap; text-overflow: ellipsis;\">");
							//<!-- firefox에서 display: none; 하면 제목이 안 나오는 문제로 display: none;을 뺏음
							//sb.Append("<a href="#" class="text02_L" style="display: none; cfdummy: expression(this.style.display = parseInt(this.parentElement.style.width) > 0 ? 'inline' : 'none')">
							//    <xsl:value-of select="title" />
							//sb.Append("</a>
							//-->
							sb.Append("<a href=\"#\" class=\"text02_L\" style=\"cfdummy: expression(this.style.display = parseInt(this.parentNode.style.width) > 0 ? 'inline' : 'none')\">");
							sb.Append(replaceXLCharacter(title));
							sb.Append("</a>");
							sb.Append("</div>");
							sb.Append("</td>");
							
							
							
							sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">");
							if (strContextMenuType == "ocs")
							{
								sb.Append("<span>");
								if (eml.SelectSingleNode("PI_INITIATOR_SIPADDRESS") != null)
								{
									sb.Append("    <img src='/GWImages/common/namecontrol_images/unknown.gif'  style='border-width:0px;' align=\"absmiddle\"  covimode=\"imgctxmenu\" ").Append(" onload=\"PresenceControl(\'").Append(eml.SelectSingleNode("PI_INITIATOR_SIPADDRESS").InnerText).Append("\');\"");
									sb.Append(" id=\"ctl").Append(System.Guid.NewGuid().ToString()).Append("_presence\"");
									sb.Append("    />");
								}
								sb.Append("</span>&#160;");
							}
							else if (strContextMenuType == "ctx")
							{
								sb.Append("<a href=\"#\" onclick=\"javascript:OpenContextMenu4Approval(this)\" class=\"text02_L\"  onmouseout=\"MM_swapImgRestore()\" ");
								sb.Append(" onmouseover=\"");
								sb.Append("MM_swapImage('Image");
								sb.Append(i);
								sb.Append("','','").Append(Session["user_thema"].ToString()).Append("/Covi/Common/icon/icon_writer_on.gif',1)\"");
								sb.Append(" person_code='").Append(eml.SelectSingleNode("picreator").InnerText).Append("'");
								sb.Append(" >");
								sb.Append("<img src=\"").Append(Session["user_thema"].ToString()).Append("/Covi/Common/icon/icon_writer_off.gif\" border=\"0\" align=\"absmiddle\" covimode=\"imgctxmenu\" ");
								sb.Append(" name=\"Image").Append(i).Append("\"");
								sb.Append(" id=\"Image").Append(i).Append("\"");
								sb.Append(" />");
								sb.Append("</a>&#160;");
							}
							sb.Append(splitNameExt(eml.SelectSingleNode("picreatorid").InnerText, strLangIndex));
							sb.Append("</td>"); sb.Append("<td  nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">").Append(eml.SelectSingleNode("createdate").InnerText).Append("</td>");
							#endregion
							//장혜인 끝

						}

							//장혜인 수정 시작
						else if (mode == "UFOLDER")
						{

							if (foldermode == "I")
							{

								#region case( UFOLDER foldermode=I) Attribute Setting
								sb.Append(" mode=\"").Append(mode).Append("\"");
								sb.Append(" folderid=\"").Append(eml.SelectSingleNode("folderid").InnerText).Append("\"");
								sb.Append(" foldernm=\"").Append(eml.SelectSingleNode("foldernm").InnerText).Append("\"");
                                sb.Append(" title=\"").Append(replaceXLCharacter(eml.SelectSingleNode("foldernm").InnerText)).Append("\"");
								sb.Append(" createdate=\"").Append(eml.SelectSingleNode("completedate").InnerText).Append("\"");
								#endregion

								sb.Append(" rowselected='' ");
								sb.Append(" >");
								sb.Append("<td  nowrap=\"true\" style=\"padding-left:10px;display:none;\" width=\"60\" onselect=\"false\" onmousedown=\"noResponse(event);\" class=\"BTable_bg08\">");
								sb.Append("    <input type=\"checkbox\" id=\"chkAPV\" name=\"chkAPV\"></input>");
								sb.Append(eml.SelectSingleNode("wfmode").InnerText);
								sb.Append("</td>");

								#region case( UFOLDER foldermode=I) LIST
								sb.Append("<td  nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">");

								if (eml.SelectSingleNode("parentfolderid").InnerText == "0")
								{
									sb.Append(eml.SelectSingleNode("foldernm").InnerText).Append("</td>");
								}
								else
								{
									sb.Append("&#160;<img src=\"").Append(Session["user_thema"].ToString()).Append("/COVI/COMMON/icon/icon_bbs_arrow.gif\" border=\"0\" align=\"absmiddle\"  />&#160;");
									sb.Append(eml.SelectSingleNode("foldernm").InnerText).Append("</td>");
								}
								sb.Append("<td  nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">");
								sb.Append("     <a href=\"#\" class=\"text02_L\" >").Append(eml.SelectSingleNode("completedate").InnerText).Append("</a>&#160;");
								sb.Append("</td>");
								#endregion

							}

							else
							{
								#region case( UFOLDER else) Attribute Setting
								sb.Append(" mode=\"").Append(mode).Append("\"");
								sb.Append(" workitemid=\"").Append("").Append("\"");//eml.SelectSingleNode("listid").InnerText
								sb.Append(" piid=\"").Append(piid).Append("\"");
								sb.Append(" bstate=\"").Append(bstate).Append("\"");
								sb.Append(" pibd1=\"").Append("").Append("\"");
								sb.Append(" fiid=\"").Append(fiid).Append("\"");
								sb.Append(" fmid=\"").Append(fmid).Append("\"");
								sb.Append(" scid=\"").Append(scid).Append("\"");
								sb.Append(" fmpf=\"").Append(fmpf).Append("\"");
								sb.Append(" fmnm=\"").Append(fmnm).Append("\"");
								sb.Append(" fmrv=\"").Append(fmrv).Append("\"");
								sb.Append(" fmfn=\"").Append(fmfn).Append("\"");

								sb.Append(" secdoc=\"").Append(secdoc).Append("\"");
								sb.Append(" edms_document=\"").Append(edms_document).Append("\"");
								//<!-- 폴더 이동 때문에 추가된 attribute 시작-->
								sb.Append(" subject=\"").Append(replaceXLCharacter(title)).Append("\"");
								sb.Append(" initiator_name=\"").Append(replaceXLCharacter(eml.SelectSingleNode("picreator").InnerText)).Append("\"");

								sb.Append(" initiator_unit_name=\"").Append(replaceXLCharacter(eml.SelectSingleNode("picreatordept").InnerText)).Append("\"");
								sb.Append(" listid=\"").Append(eml.SelectSingleNode("listid").InnerText).Append("\"");
								sb.Append(" linkkey=\"").Append(eml.SelectSingleNode("linkkey").InnerText).Append("\"");
								sb.Append(" wfmode=\"").Append(eml.SelectSingleNode("wfmode").InnerText).Append("\"");
								sb.Append(" deputystate=\"").Append(eml.SelectSingleNode("deputystate").InnerText).Append("\"");
								//<!-- 폴더 이동 때문에 추가된 attribute 끝-->

								#endregion

								sb.Append(" rowselected='' ");
								sb.Append(" >");
								sb.Append("<th  nowrap=\"true\" style=\"padding-left:10px;display:none;\" width=\"60\" onselect=\"false\" onmousedown=\"noResponse(event);\" class=\"BTable_bg08\">");
								sb.Append("    <input type=\"checkbox\" id=\"chkAPV\" name=\"chkAPV\"></input></th>");

								#region case( UFOLDER else) LIST
								sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">");
								sb.Append("<a href=\"#\" onclick=\"javascript:OpenApprovalLine(this, event)\" class=\"text02_L\" ");
								sb.Append(" piid=\"").Append(piid).Append("\"");
								sb.Append(" scid=\"").Append(scid).Append("\"");
								sb.Append(" fmpf=\"").Append(fmpf).Append("\"");
								sb.Append(" fmrv=\"").Append(fmrv).Append("\"");
								sb.Append(" fiid=\"").Append(fiid).Append("\"");
								sb.Append(" >");
								sb.Append("<img src=\"").Append(Session["user_thema"].ToString()).Append("/Covi/Common/btn_type2/btn_lookdc.gif\" width=\"14px\" height=\"14px\" border=\"0\" align=\"absmiddle\" covimode=\"imgctxmenu\" />");
								sb.Append("</a>");
                                sb.Append("&#160;<a href=\"#\" class=\"text02_L\" >").Append(replaceXLCharacter(eml.SelectSingleNode("title").InnerText)).Append("</a>&#160;");
								sb.Append("</td>");
								sb.Append("<td  nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">");
								sb.Append(" ").Append(eml.SelectSingleNode("completedate").InnerText).Append("&#160;");
								sb.Append("</td>");
								sb.Append("<td  nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">").Append(replaceXLCharacter(splitNameExt(eml.SelectSingleNode("picreatordept").InnerText,strLangIndex))).Append("</td>");
								sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">");
								if (strContextMenuType == "ocs")
								{
									sb.Append("<span>");
									if (eml.SelectSingleNode("PI_INITIATOR_SIPADDRESS") != null)
									{
										sb.Append("    <img src='/GWImages/common/namecontrol_images/unknown.gif'  style='border-width:0px;' align=\"absmiddle\"  covimode=\"imgctxmenu\" ").Append(" onload=\"PresenceControl(\'").Append(eml.SelectSingleNode("PI_INITIATOR_SIPADDRESS").InnerText).Append("\');\"");
										sb.Append(" id=\"ctl").Append(System.Guid.NewGuid().ToString()).Append("_presence\"");
										sb.Append("    />");
									}
									sb.Append("</span>&#160;");
								}
								else if (strContextMenuType == "ctx")
								{
									sb.Append("<a href=\"#\" onclick=\"javascript:OpenContextMenu4Approval(this)\" class=\"text02_L\"  onmouseout=\"MM_swapImgRestore()\" ");
									sb.Append(" onmouseover=\"");
									sb.Append("MM_swapImage('Image");
									sb.Append(i);
									sb.Append("','','").Append(Session["user_thema"].ToString()).Append("/Covi/Common/icon/icon_writer_on.gif',1)\"");
									sb.Append(" person_code='").Append(eml.SelectSingleNode("picreatorid").InnerText).Append("'");
									sb.Append(" >");
									sb.Append("<img src=\"").Append(Session["user_thema"].ToString()).Append("/Covi/Common/icon/icon_writer_off.gif\" border=\"0\" align=\"absmiddle\" covimode=\"imgctxmenu\" ");
									sb.Append(" name=\"Image").Append(i).Append("\"");
									sb.Append(" id=\"Image").Append(i).Append("\"");
									sb.Append(" />");
									sb.Append("</a>&#160;");
								}
								sb.Append(replaceXLCharacter(splitNameExt(eml.SelectSingleNode("picreator").InnerText,strLangIndex)));
								sb.Append("</td>");
								sb.Append("<td  nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">").Append(fmnm).Append("</td>");

								#endregion

							}
						}

							//장혜인 수정 끝 
						else
						{

							#region NOT TEMPSAVE Attribute Setting

							if (eml.SelectSingleNode("id") != null)
							{ //WI_ID 값이 개인문서함엔 존재하나, 부서문서함에는 존재하지 않음 2010.04.21

								sb.Append(" workitemid=\"").Append(eml.SelectSingleNode("id").InnerText).Append("\""); //개인문서함(완료함)의 경우 (삭제)
							}

							sb.Append(" piid=\"").Append(piid).Append("\"");
							sb.Append(" pfid=\"").Append(eml.SelectSingleNode("pfid").InnerText).Append("\"");
							sb.Append(" mode=\"").Append(eml.SelectSingleNode("mode").InnerText).Append("\"");
							sb.Append(" participantid=\"").Append(eml.SelectSingleNode("participantid").InnerText).Append("\"");
							sb.Append(" piviewstate=''");
							sb.Append(" fiid=\"").Append(fiid).Append("\"");
							sb.Append(" fmid=\"").Append(fmid).Append("\"");
							sb.Append(" fmnm=\"").Append(fmnm).Append("\"");
							sb.Append(" fmrv=\"").Append(fmrv).Append("\"");
							sb.Append(" scid=\"").Append(scid).Append("\"");
							sb.Append(" fmpf=\"").Append(fmpf).Append("\"");
							sb.Append(" fmfn=\"").Append(fmfn).Append("\"");

							sb.Append(" bstate=\"").Append(bstate).Append("\"");
							sb.Append(" pfsk=\"").Append(eml.SelectSingleNode("pfsk").InnerText).Append("\"");
							sb.Append(" pibd1=\"").Append(eml.SelectSingleNode("pibd1").InnerText).Append("\"");

							if (eml.SelectSingleNode("pipr") != null)
							{
								sb.Append(" pipr=\"").Append(eml.SelectSingleNode("pipr").InnerText).Append("\"");
							}
							else
							{
								sb.Append(" pipr=\"\"");
							}
							sb.Append(" pidc=\"").Append("").Append("\"");
							sb.Append(" secdoc=\"").Append(secdoc).Append("\"");
							sb.Append(" isfile=\"").Append(isfile).Append("\"");
							sb.Append(" edms_document=\"").Append(edms_document).Append("\"");
							sb.Append(" ptid=\"").Append(eml.SelectSingleNode("participantid").InnerText).Append("\"");
							//<!-- 폴더 이동 때문에 추가된 attribute 시작-->
							sb.Append(" initiator_name=\"").Append(eml.SelectSingleNode("picreator").InnerText).Append("\"");
							sb.Append(" initiator_unit_name=\"").Append(replaceXLCharacter(eml.SelectSingleNode("picreatordept").InnerText)).Append("\"");
							sb.Append(" initiator_id=\"").Append(eml.SelectSingleNode("picreatorid").InnerText).Append("\"");
							sb.Append(" initiator_unit_id=\"").Append(replaceXLCharacter(eml.SelectSingleNode("picreatordeptid").InnerText)).Append("\"");
							//<!-- 폴더 이동 때문에 추가된 attribute 끝-->
							sb.Append(" subject=\"").Append(replaceXLCharacter(eml.SelectSingleNode("title").InnerText)).Append("\"");
							#endregion
							sb.Append(" rowselected='' ");
							sb.Append(" >");
							sb.Append("<td nowrap=\"true\" style=\"padding-left:10px;overflow:hidden; paddingRight:1px;display:none;\" onselect=\"false\" onmousedown=\"noResponse(event);\" class=\"BTable_bg08\">");
							sb.Append("<input type=\"checkbox\" id=\"chkAPV\" name=\"chkAPV\" ");
							if (eml.SelectSingleNode("state") != null && eml.SelectSingleNode("wstate") != null)
							{
								if (mode == "TODO" && eml.SelectSingleNode("state").InnerText == "288" && eml.SelectSingleNode("wstate").InnerText == "528")
								{
									sb.Append(" disabled=\"true\" ");
								}
							}
							sb.Append("></input>");
							//sb.Append(mode).Append(eml.SelectSingleNode("PI_STATE").InnerText).Append(eml.SelectSingleNode("WI_STATE").InnerText);
							sb.Append("</td>");


							//sb.Append("<td  nowrap=\"true\" style=\"padding-left:10px;overflow:hidden; paddingRight:1px;display:none;\" onselect=\"false\" onmousedown=\"noResponse(event);\" class=\"BTable_bg08\">");
							//sb.Append("    <input type=\"checkbox\" id=\"chkAPV\" name=\"chkAPV\"></input>");
							//sb.Append("</td>");

							#region NONE TEMPSAVE LIST
							sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">");
							sb.Append("<a href=\"#\" onclick=\"javascript:OpenApprovalLine(this, event)\" class=\"text02_L\" ");
							sb.Append(" piid=\"").Append(piid).Append("\"");
							sb.Append(" scid=\"").Append(scid).Append("\"");
							sb.Append(" fmpf=\"").Append(fmpf).Append("\"");
							sb.Append(" fmrv=\"").Append(fmrv).Append("\"");
							sb.Append(" fiid=\"").Append(fiid).Append("\"");
							sb.Append(" >");
							{//이준희(2010-11-04): 
							if(Session["user_thema"] == null)
							{
								Session["user_thema"] = "/GwImages/BLUE";
							}
							}
							sb.Append("<img src=\"").Append(Session["user_thema"].ToString()).Append("/Covi/Common/btn_type2/btn_lookdc.gif\" width=\"14px\" height=\"14px\" border=\"0\" align=\"absmiddle\" covimode=\"imgctxmenu\" />");
							sb.Append("</a>").Append(cfxsl.getSubKind(eml.SelectSingleNode("pfsk").InnerText, ""));
							//sb.Append("</a>").Append(cfxsl.getSubKind(eml.SelectSingleNode("PF_SUB_KIND").InnerText, eml.SelectSingleNode("WI_BUSINESS_DATA1").InnerText));
							sb.Append("</td>");
							sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px;display:none;\" onseclect=\"false\"  class=\"BTable_bg08\"></td>");
							sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px;cursor:hand;\" onselect=\"false\" class=\"BTable_bg08\">");
							if (isfile == "1")
							{
								//<!-- 첨부파일이미지 -->
								sb.Append("<img id=\"img1\" src=\"").Append(Session["user_thema"].ToString()).Append("/Covi/Common/icon/icon_clip.gif\" align=\"middle\" onmousedown=\"noResponse(event);\" onclick=\"attachLayer(10,70,this,event);\" style=\"display:;\" /> ");
								//sb.Append(i);
							}
							else
							{
								sb.Append("&#160;");
							}
							sb.Append("</td>");
							sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\"  onmouseover=\"event_GalTable_onmousemove(event);\" ");
							sb.Append(" alt=\"").Append(replaceXLCharacter(title)).Append("\"");
							sb.Append(" >");
							sb.Append("<div style=\"width: expression(this.firstChild.style.display == 'inline' ? this.style.width : this.parentNode.offsetWidth); overflow: hidden; white-space: nowrap; text-overflow: ellipsis;\">");
							//<!-- firefox에서 display: none; 하면 제목이 안 나오는 문제로 display: none;을 뺏음
							//sb.Append("<a href="#" class="text02_L" style="display: none; cfdummy: expression(this.style.display = parseInt(this.parentElement.style.width) > 0 ? 'inline' : 'none')">
							//    <xsl:value-of select="title" />
							//sb.Append("</a>
							//-->
							sb.Append("<a href=\"#\" class=\"text02_L\" style=\"cfdummy: expression(this.style.display = parseInt(this.parentNode.style.width) > 0 ? 'inline' : 'none')\">");
							sb.Append(replaceXLCharacter(title));
							sb.Append("</a>");
							sb.Append("</div>");
							sb.Append("</td>");
							sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:2px\" onselect=\"false\" class=\"BTable_bg08\">");
							if (eml.SelectSingleNode("mode").InnerText == "APPROVAL")
							{
								if (eml.SelectSingleNode("apvdate").InnerText.Length > 0)
								{
									if (60 > Convert.ToDouble(eml.SelectSingleNode("apvdatemi").InnerText))
									{
										sb.Append(eml.SelectSingleNode("apvdatemi").InnerText).Append(Resources.Approval.lbl_before_m);
									}
									else if (Convert.ToDouble(eml.SelectSingleNode("apvdate").InnerText) > 24 * 7)
									{
										sb.Append(eml.SelectSingleNode("completedate").InnerText);
									}
									else if (Convert.ToDouble(eml.SelectSingleNode("apvdate").InnerText) > 24)
									{
										sb.Append(Convert.ToInt16(Convert.ToDouble(eml.SelectSingleNode("apvdate").InnerText) / 24) + 1).Append(Resources.Approval.lbl_before_d);
									}
									else
									{
										sb.Append(eml.SelectSingleNode("completedate").InnerText);
									}
								}
								else
								{
									sb.Append("&#160;");
								}
							}
							else
							{
								sb.Append(eml.SelectSingleNode("completedate").InnerText);
							}
							sb.Append("</td>");
							sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">");
							sb.Append(replaceXLCharacter(splitNameExt(eml.SelectSingleNode("picreatordept").InnerText, strLangIndex)));
							sb.Append("</td>");
							sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\">");
							if (strContextMenuType == "ocs")
							{
								sb.Append("<span>");
								if (eml.SelectSingleNode("picreatorsipaddress") != null)
								{
									sb.Append("    <img src='/GWImages/common/namecontrol_images/unknown.gif'  style='border-width:0px;' align=\"absmiddle\"  covimode=\"imgctxmenu\" ").Append(" onload=\"PresenceControl(\'").Append(eml.SelectSingleNode("picreatorsipaddress").InnerText).Append("\');\"");
									sb.Append(" id=\"ctl").Append(System.Guid.NewGuid().ToString()).Append("_presence\"");

									sb.Append("    />");
								}
								sb.Append("</span>&#160;");
							}
							else if (strContextMenuType == "ctx")
							{
								sb.Append("<a href=\"#\" onclick=\"javascript:OpenContextMenu4Approval(this)\" class=\"text02_L\"  onmouseout=\"MM_swapImgRestore()\" ");
								sb.Append(" onmouseover=\"");
								sb.Append("MM_swapImage('Image");
								sb.Append(i);
								sb.Append("','','").Append(Session["user_thema"].ToString()).Append("/Covi/Common/icon/icon_writer_on.gif',1)\"");
								sb.Append(" >");
								sb.Append("<img src=\"").Append(Session["user_thema"].ToString()).Append("/Covi/Common/icon/icon_writer_off.gif\" border=\"0\" align=\"absmiddle\" covimode=\"imgctxmenu\" ");
								sb.Append(" name=\"Image").Append(i).Append("\"");
								sb.Append(" id=\"Image").Append(i).Append("\"");
								sb.Append(" />");
								sb.Append("</a>&#160;");
							}
							sb.Append(splitNameExt(eml.SelectSingleNode("picreator").InnerText,strLangIndex));
							sb.Append("</td>");
							sb.Append("<td nowrap=\"true\" style=\"overflow:hidden; paddingRight:1px\" onselect=\"false\" class=\"BTable_bg08\" >").Append(fmnm).Append("</td>");
							//<!--<td class="tableDot" height="21" valign="top" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false=\"").Append(ugrs"/><xsl:value-of select="cfxsl:getIsPaper(string(ispaper))"/><xsl:value-of select="cfxsl:getRequestResponse(string(rqrs))"/></td>-->
							#endregion
						}
						sb.Append("</tr>");
						i++;
					}
				}
			}
			sList = sb.ToString();

		}
		catch (System.Exception ex)
		{
			throw ex;
		}
		finally
		{
			sb = null;
			cfxsl = null;
		}
	}
	public string replaceXLCharacter(string strContent)
	{
		if (strContent != null)
		{
			strContent = strContent.Replace("\"", "");
			strContent = strContent.Replace("\\", "");
			strContent = strContent.Replace("\'", "");
			strContent = strContent.Replace("'", "\'");
			//strContent = strContent.Replace("&", "");
			//strContent = strContent.Replace("<", "");
			//strContent = strContent.Replace(">", "");
			strContent = strContent.Replace("&", "&amp;");
			strContent = strContent.Replace("<", "&lt;");
			strContent = strContent.Replace(">", "&gt;");
		}
		return strContent;
	}
	public string splitName(string sValue, string szLangIndex)
	{
		int iLangIndex = Convert.ToInt16(szLangIndex);
		//string sName = sValue.Substring(sValue.LastIndexOf(";") + 1);
		//return sName == "" ? " " : sName;
		string[] ary = sValue.Split(';');
		if (ary.Length > 2)
		{
			if (ary.Length >= iLangIndex) { return ary[iLangIndex + 1]; } else { return ary[1]; }
		}//구데이터 처리
		else if (ary.Length == 2) { return ary[1]; }
		else
		{
			return "";
		}
	}
	public string splitNameExt(string sValue, string szLangIndex)
	{
		//return sValue;
		int iLangIndex = Convert.ToInt16(szLangIndex);
		string[] ary = sValue.Split(';');
		if (ary.Length > iLangIndex) { return ary[iLangIndex]; } else { return ary[0]; }
	}
	
	public class cfxsl
	{
		public string m_log = "LOG=";
		public int m_cntHiddenPerson = 0;
		public int m_cntHiddenOu = 0;
		public int m_cntHiddenGroup = 0;
		public int m_cntHiddenStep = 0;
		public int m_cntApvStep = 0;

		public void log(string v) { m_log += " #" + v; }
		public string getLog() { return m_log; }

		public string resetHiddenPersonCount(XPathNodeIterator oNodeList)
		{
			log("rhpc" + oNodeList.Count.ToString());
			m_cntHiddenPerson = oNodeList.Count; return "";
		}
		public string resetHiddenOuCount(XPathNodeIterator oNodeList)
		{
			log("rhoc" + oNodeList.Count.ToString());
			m_cntHiddenOu = oNodeList.Count; return "";
		}
		public string resetHiddenStepCount(XPathNodeIterator oNodeList)
		{
			log("rhsc" + oNodeList.Count.ToString());
			m_cntHiddenStep = oNodeList.Count; return "";
		}
		public int countHidden(XPathNodeIterator oNodeList)
		{
			if (oNodeList.Count == 0) return 0;
			int ireutrn = 0;
			oNodeList.MoveNext();
			XPathNavigator oNode = oNodeList.Current;
			string sName = oNode.Name;
			XPathNavigator oTI = oNode.SelectSingleNode("taskinfo[@visible='n']");
			switch (sName)
			{
				case "step": if (oTI != null) m_cntHiddenStep--; log("chs" + m_cntHiddenStep); ireutrn = m_cntHiddenStep; break;
				case "ou": if (oTI != null) m_cntHiddenOu--; log("cho" + m_cntHiddenOu); ireutrn = m_cntHiddenOu; break;
				case "role":
				case "person": if (oTI != null) m_cntHiddenPerson--; log("chp" + m_cntHiddenPerson); ireutrn = m_cntHiddenPerson; break;
				case "group": if (oTI != null) m_cntHiddenGroup--; log("chg" + m_cntHiddenGroup); ireutrn = m_cntHiddenGroup; break;
			}
			return ireutrn;

		}
		public string convertDate(XPathNodeIterator oNodeList)
		{
			if (oNodeList.Count == 0) return "";

			oNodeList.MoveNext();
			XPathNavigator oNode = oNodeList.Current;
			return formatDate(oNode.Value);
		}
		public string formatDate(string sDate)
		{
			if (sDate == "")
				return " ";
			DateTime dtDate = DateTime.Parse(sDate.Replace("-", "/").Replace("오후", "pm").Replace("오전", "am"));
			return dtDate.Year.ToString() + "-" + dblDigit(dtDate.Month) + "-" + dblDigit(dtDate.Day) + " " + dblDigit(dtDate.Hour) + ":" + dblDigit(dtDate.Minute);//+":"+dblDigit(dtDate.getSeconds());            
		}
		public string dblDigit(int iVal) { return (iVal < 10 ? "0" + iVal.ToString() : iVal.ToString()); }
		public bool isLastApvStep()
		{
			return (m_cntApvStep++ == 0 ? true : false);
		}
		public string splitName(string sValue, string szLangIndex)
		{
			int iLangIndex = Convert.ToInt16(szLangIndex);
			//string sName = sValue.Substring(sValue.LastIndexOf(";") + 1);
			//return sName == "" ? " " : sName;
			string[] ary = sValue.Split(';');
			if (ary.Length >= iLangIndex) { return ary[iLangIndex + 1]; } else { return ary[1]; }
		}
		public string splitNameExt(string sValue, string szLangIndex)
		{
			//return sValue;
			int iLangIndex = Convert.ToInt16(szLangIndex);
			string[] ary = sValue.Split(';');
			if (ary.Length > iLangIndex) { return ary[iLangIndex]; } else { return ary[0]; }
		}
		public string convertKindToSignTypeByRTnUT(string sKind, string sParentUT, string sRT, string sUT, string customattribute2)
		{
			log("kind:" + sKind + "|" + sParentUT + "|" + sRT + "|" + sUT);

			string sSignType = " ";
			string scustomattribute2 = (customattribute2 == "") ? "" : customattribute2;
			if (scustomattribute2 == "ExtType")
			{
				sSignType = Resources.Approval.lbl_ExtType;
			}
			else if (scustomattribute2 == "개인준법")
			{
				sSignType = Resources.Approval.lbl_person_audit2;
			}
			else
			{
				switch (sRT)
				{
					case "receive":
						switch (sUT)
						{
							case "ou":
								switch (sParentUT)
								{
									case "ou": sSignType = Resources.Approval.lbl_ChargeDept; break;
									case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
								} break;
							case "role":
							case "person":
								sSignType = Resources.Approval.lbl_receive; break;
							case "group":
								sSignType = Resources.Approval.lbl_receive; break;
						} break;
					case "consult":
						switch (sUT)
						{
							case "ou":
								switch (sParentUT)
								{
									case "ou": sSignType = Resources.Approval.lbl_DeptConsent; break;
									case "role":
									case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
								} break;
							case "role":
							case "person":
								sSignType = Resources.Approval.lbl_PersonConsent; break;
						} break;
					case "assist":
						switch (sUT)
						{
							case "ou":
								switch (sParentUT)
								{
									case "ou": sSignType = Resources.Approval.lbl_DeptAssist; break;
									case "role":
									case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
								} break;
							case "role":
							case "person":
								//sSignType= Resources.Approval.lbl_assist ;break;
								sSignType = scustomattribute2; break;
						} break;
					case "audit":
						switch (sUT)
						{
							case "ou":
								switch (sParentUT)
								{
									case "ou": sSignType = (scustomattribute2 == "" ? Resources.Approval.lbl_audit : scustomattribute2); break;
									case "role":
									case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
								} break;
							case "role":
							case "person":
								sSignType = Resources.Approval.lbl_audit; break;
						} break;
					case "review":
						sSignType = Resources.Approval.lbl_PublicInspect; break;
					case "notify":
						sSignType = Resources.Approval.lbl_SendInfo; break;
					case "approve":
						switch (sUT)
						{
							case "role":
							case "person":
								sSignType = convertKindToSignType(sKind, scustomattribute2); break;
							case "ou":
								sSignType = Resources.Approval.lbl_DeptApprv; break;
						} break;
				}
			}
			return sSignType;
		}
		public string convertKindToSignType(string sKind, string customattribute2)
		{
			string sSignType;
			string scustomattribute2 = (customattribute2 == "") ? "" : customattribute2;
			switch (sKind)
			{
				case "normal":
					sSignType = Resources.Approval.lbl_normalapprove; break;
				case "consent":
					sSignType = Resources.Approval.lbl_investigation; break;
				case "authorize":
					sSignType = Resources.Approval.lbl_authorize; break;
				case "substitute":
					sSignType = Resources.Approval.lbl_substitue; break;
				case "review":
					sSignType = Resources.Approval.lbl_review; break;
				case "bypass":
					sSignType = Resources.Approval.lbl_bypass; break;
				case "charge":
					sSignType = Resources.Approval.lbl_charge; break;
				case "confidential":
					sSignType = Resources.Approval.lbl_Confidential; break;
				case "conveyance":
					sSignType = Resources.Approval.lbl_forward; break;
				case "skip":
					sSignType = Resources.Approval.lbl_NoApprvl + " " + scustomattribute2; break;
				case "confirm":
					sSignType = Resources.Approval.lbl_Confirm; break;
				default:
					sSignType = " "; break;
			}
			return sSignType;
		}
		public string convertSignResult(string sResult, string sKind, string customattribute2)
		{
			string sSignResult;

			switch (sResult)
			{
				case "inactive":
					sSignResult = Resources.Approval.lbl_inactive; break;
				case "pending":
					sSignResult = Resources.Approval.lbl_inactive; break;
				case "reserved":
					sSignResult = Resources.Approval.lbl_hold; break;
				case "completed":
					if (customattribute2 == "ExtType")
					{
						sSignResult = Resources.Approval.lbl_ExtType_agree;
					}
					else
					{
						sSignResult = (sKind == "charge") ? Resources.Approval.btn_draft : Resources.Approval.lbl_app;
					} break;
				case "rejected":
					if (customattribute2 == "ExtType")
					{
						sSignResult = Resources.Approval.lbl_ExtType_disagree;
					}
					else
					{
						sSignResult = Resources.Approval.lbl_reject;
					} break;
				case "rejectedto":
					sSignResult = Resources.Approval.lbl_reject; break;
				case "authorized":
					sSignResult = Resources.Approval.lbl_authorize; break;
				case "reviewed":
					sSignResult = Resources.Approval.lbl_review; break;
				case "substituted":
					sSignResult = Resources.Approval.lbl_substitue; break;
				case "agreed":
					if (customattribute2 == "ExtType")
					{
						sSignResult = Resources.Approval.lbl_ExtType_agree;
					}
					else
					{
						sSignResult = Resources.Approval.lbl_consent;
					} break;
				case "disagreed":
					if (customattribute2 == "ExtType")
					{
						sSignResult = Resources.Approval.lbl_ExtType_disagree;
					}
					else
					{
						sSignResult = Resources.Approval.lbl_disagree;
					} break;
				case "bypassed":
					sSignResult = Resources.Approval.lbl_bypass; break;
				case "skipped":
					sSignResult = Resources.Approval.lbl_NoApprvl; break;
				case "confirmed":
					sSignResult = Resources.Approval.lbl_confirmed; break;
				default:
					sSignResult = " ";
					break;
			}
			return sSignResult;
		}
		public string replaceCR(string s)
		{
			return s.Replace("\n", "<br>");
		}
		public string getDotCountSpace(string sDotVar)
		{
			string[] aDotCount = sDotVar.Split('.');
			string sDotCount = "";
			for (int i = 0; i < aDotCount.Length - 1; i++)
			{
				if (sDotCount == "")
				{
					sDotCount += "<font color='white'>-</font>";
				}
				else
				{
					sDotCount += "";
				}
			}
			return sDotCount + sDotVar.Substring(sDotVar.IndexOf(".") + 1);
		}

		public int getPageValue(int ipPageSize, int ipTotalCount)
		{
			int ipage = ipTotalCount / ipPageSize;
			if ((ipTotalCount % ipPageSize) > 0)
			{
				ipage++;
			}
			if (ipage == 0) ipage = 1;
			return ipage;

		}

		public string HtmlEncode(string s)
		{
			return s.Replace("&quot;", "quot");
		}

		public string setNodeValue(XPathNodeIterator oNodeList)
		{
			oNodeList.MoveNext();
			XPathNavigator oNode = oNodeList.Current;

			if (oNode.Value != "")
			{
				string[] aRecDept = oNode.Value.Split(',');
				string sReturn = "";
				for (int i = 0; i < aRecDept.Length; i++)
				{
					sReturn += "<br>" + aRecDept[i];
				}
				if (sReturn.Length > 4) sReturn = sReturn.Substring(4);
				return sReturn;
			}
			else
			{
				return "";
			}
		}

		public string getNodeValue(XPathNodeIterator oNodeList, string strNodeName)
		{
			System.Xml.XmlDocument oXML = null;

			oNodeList.MoveNext();
			XPathNavigator oNode = oNodeList.Current;

			if (oNode.Value != "")
			{
				string[] aForm = oNode.Value.Split(';');

				oXML = new System.Xml.XmlDocument();
				try
				{
					oXML.LoadXml(aForm[0]);
				}
				catch (System.Exception ex)
				{
					oXML.LoadXml(oNode.Value);
				}
				finally
				{
				}
				if (oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo") != null)
				{
					if (oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo").Attributes[strNodeName] != null)
					{
						return oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo").Attributes[strNodeName].InnerText;
					}
					else
					{
						return "";
					}
				}
				else { return ""; }

			}
			else
			{
				return "";
			}
		}

		public string getPINodeValue(XPathNodeIterator oNodeList, int iIndex)
		{
			oNodeList.MoveNext();
			XPathNavigator oNode = oNodeList.Current;
			if (oNode.Value != "")
			{
				string[] aForm = oNode.Value.Split(';');
				if (aForm.Length > iIndex)
				{
					return aForm[iIndex];
				}
				else
				{
					return "";
				}
			}
			else
			{
				return "";
			}
		}

		public string getRgcmtNodeValue(XPathNodeIterator oNodeList, string strNodeName)
		{
			System.Xml.XmlDocument oXML = null;

			oNodeList.MoveNext();
			XPathNavigator oNode = oNodeList.Current;

			oXML = new System.Xml.XmlDocument();
			oXML.LoadXml(oNode.Value);

			return oXML.SelectSingleNode(strNodeName).InnerText;
		}

		public string convertResult(XPathNodeIterator oNodeListKind, XPathNodeIterator oNodeListStatus)
		{
			if (oNodeListKind.Count == 0) return "";

			oNodeListKind.MoveNext();
			XPathNavigator oNodeKind = oNodeListKind.Current;

			oNodeListStatus.MoveNext();
			XPathNavigator oNodeStatus = oNodeListStatus.Current;

			string sKind = oNodeKind.Value;
			string sResult = oNodeStatus.Value;
			string sSignStatus = "";
			switch (sResult)
			{
				case "inactive":
					sSignStatus = Resources.Approval.lbl_inactive; break;
				case "pending":
					sSignStatus = Resources.Approval.lbl_inactive; break;
				case "reserved":
					sSignStatus = Resources.Approval.lbl_hold; break;
				case "completed":
					if (sKind == "charge")
					{
						sSignStatus = Resources.Approval.btn_draft;
					}
					else
					{
						sSignStatus = Resources.Approval.lbl_app;
					}
					break;
				case "rejected":
					sSignStatus = Resources.Approval.lbl_reject; break;
				case "authorized":
					sSignStatus = Resources.Approval.lbl_authorize; break;
				case "reviewed":
					sSignStatus = Resources.Approval.lbl_review; break;
				case "substituted":
					sSignStatus = Resources.Approval.lbl_substitue; break;
				case "agreed":
					sSignStatus = Resources.Approval.lbl_consent; break;
				case "disagreed":
					sSignStatus = Resources.Approval.lbl_disagree; break;
				case "bypassed":
					sSignStatus = Resources.Approval.lbl_bypass; break;
				case "confidential":
					sSignStatus = Resources.Approval.lbl_Confidential; break;
				case "conveyance":
					sSignStatus = Resources.Approval.lbl_forward; break;
				case "skipped":
					sSignStatus = Resources.Approval.lbl_NoApprvl; break;
				default: sSignStatus = sResult; break;
			}
			return sSignStatus;
		}

		public string getSubKind(string sKind, string swibd1)
		{
			string sSubKind = "";
			if (swibd1 == "ExtType")
			{
				sSubKind = Resources.Approval.lbl_ExtType;
			}
			else
			{
				switch (sKind)
				{
					case "T000"://결재
						sSubKind = Resources.Approval.lbl_app; break;
					case "T001"://시행
						sSubKind = Resources.Approval.lbl_ITrans; break;
					case "T002"://시행
						sSubKind = Resources.Approval.lbl_ITrans; break;
					case "T003"://직인
						sSubKind = Resources.Approval.lbl_OfficialSeal; break;
					case "T004"://협조
						sSubKind = Resources.Approval.lbl_assist; break;
					case "T005"://후결
						sSubKind = Resources.Approval.lbl_review; break;
					case "T006"://열람
						sSubKind = Resources.Approval.lbl_reading; break;
					case "T007":
						sSubKind = "경유"; break;
					case "T008"://담당
						sSubKind = Resources.Approval.lbl_charge; break;
					case "T009"://합의
						sSubKind = Resources.Approval.lbl_consent; break;
					case "T010"://예고
						sSubKind = Resources.Approval.lbl_doc_pre2; break;
					case "T011"://담당
						sSubKind = Resources.Approval.lbl_charge; break;
					case "T012"://담당
						sSubKind = Resources.Approval.lbl_charge; break;
					case "T013"://참조
						sSubKind = Resources.Approval.lbl_cc; break;
					case "T014"://통지
						sSubKind = Resources.Approval.lbl_notice2; break;
					case "T015"://협조
						sSubKind = Resources.Approval.lbl_assist; break;
					case "T016"://감사
						sSubKind = Resources.Approval.lbl_audit; break;
                    case "T017"://감사
						sSubKind = Resources.Approval.lbl_audit2; break;
                    case "T018"://공람
						sSubKind = Resources.Approval.lbl_PublicInspect; break;
                    //20110318 확인/참조결재 추가
                    case "T019"://확인
                        sSubKind = Resources.Approval.lbl_confirm4list; break;
                    case "T020"://참조
                        sSubKind = Resources.Approval.lbl_share4list; break;
                    //20110318 확인/참조결재 추가
                    case "A"://품의함
						sSubKind = Resources.Approval.lbl_completedBox; break;
					case "R"://수신
						sSubKind = Resources.Approval.lbl_receive; break;
					case "S"://발신
						sSubKind = Resources.Approval.lbl_send; break;
					case "E"://접수
						sSubKind = Resources.Approval.lbl_receive; break;
					case "REQCMP"://신청처리
						sSubKind = Resources.Approval.lbl_receive; break;
					case "P"://발신
						sSubKind = Resources.Approval.lbl_send; break;
					case "SP"://열람
						sSubKind = Resources.Approval.lbl_reading; break;
					case "C"://합의기안
					case "AS"://협조기안
					case "AD"://감사기안
					case "AE"://준법기안
						sSubKind = Resources.Approval.btn_redraft; break;
					case "0"://수신
						sSubKind = Resources.Approval.lbl_receive; break;
					case "1"://참조
						sSubKind = Resources.Approval.lbl_cc; break;
					case "2"://열람
						sSubKind = Resources.Approval.btn_Circulate; break;

					default: sSubKind = sKind; break;
				}
			}
			return sSubKind;
		}

		public string getIsPaper(string sIsPaper)
		{
			string sYN = "";
			switch (sIsPaper)
			{
				case "Y":
					sYN = "서면결재"; break;
				case "N":
				case "":
				default: sYN = ""; break;
			}
			return sYN;
		}

		public string getUrgent(string sPriority)
		{
			string sYN = "";
			switch (sPriority)
			{
				case "1":
				case "2":
				case "3": sYN = ""; break;
				case "4": sYN = "*"; break;
				case "5": sYN = "*"; break;
				default: sYN = sPriority; break;
			}
			return sYN;
		}

		public string getRequestResponse(string sReqResponse)
		{
			string sYN = "";
			switch (sReqResponse)
			{
				case "Y":
					sYN = "회신요구"; break;
				case "N":
				case "":
				default: sYN = ""; break;
			}
			return sYN;
		}

		public string getKind(string sKind)
		{
			string sSubKind = "";
			switch (sKind)
			{
				case "1"://참조
					sSubKind = Resources.Approval.lbl_cc; break;
				case "0"://수신
					sSubKind = Resources.Approval.lbl_receive; break;
				case "2":
					sSubKind = Resources.Approval.btn_Circulate; break;
				default: sSubKind = sKind; break;
			}
			return sSubKind;
		}
		public string getPfsk(string sKind)
		{
			string sSubPfsk = "";
			switch (sKind)
			{
				case "1"://참조
					sSubPfsk = "T014"; break;
				case "0"://수신
					sSubPfsk = "T015"; break;
				case "2"://회람
					sSubPfsk = "T006"; break;
				default: sSubPfsk = sKind; break;
			}
			return sSubPfsk;
		}
	}
}
