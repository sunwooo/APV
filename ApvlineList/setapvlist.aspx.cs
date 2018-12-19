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
using System.Xml.Xsl;
using System.IO;
using System.Xml.XPath;



public partial class COVIFlowNet_ApvlineList_setapvlist : PageBase
{
	private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
	public string strLangIndex = "0";

    protected void Page_Load(object sender, EventArgs e)
    {
        //    '여기에 사용자 코드를 배치하여 페이지를 초기화합니다.
		//Language
		string culturecode = strLangID;
		if (Session["user_language"] != null)
		{
			culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
		}
		Page.UICulture = culturecode;
		Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);


        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;
        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
        System.Xml.XmlDocument oXMLDOM;
        try
        {
            oXMLDOM = COVIFlowCom.Common.ParseRequestBytes(Request);
            pSetSigninform(oXMLDOM);
            Response.Write("<success>" + Server.HtmlEncode(DateTime.Now.ToString()) + "</success>");
        }
        catch (Exception Ex)
        {
            HandleException(Ex);
        }
        finally
        {
            Response.Write("</response>");
        }
    }

    public void Initialize()
    {
       
        try
        {
            //code
        }
        catch (System.Exception ex)
        {
            
            throw new Exception(null, ex);
        }
    }
    public void pSetSigninform(System.Xml.XmlDocument oXMLDOM)
    {
        
        CfnCoreEngine.WfAdministration oDBMgr = new CfnCoreEngine.WfAdministration();
        System.Xml.XmlNode elmRoot = null;
        try
        {
            elmRoot = oXMLDOM.DocumentElement;

            if (elmRoot.SelectSingleNode("type").InnerText == "change")
            {
                string sPDDID = elmRoot.SelectSingleNode("id").InnerText;

                CfnEntityClasses.WfPrivateDomainData oSI = (CfnEntityClasses.WfPrivateDomainData)oDBMgr.LookupEntity("WfPrivateDomainData", sPDDID);
                oSI.displayName = elmRoot.SelectSingleNode("title").InnerText;
                oSI.context = elmRoot.SelectSingleNode("steps").OuterXml;
                oSI.description = elmRoot.SelectSingleNode("dscr").InnerText;
                oSI.@abstract = pGetAbstract(elmRoot);

                oDBMgr.UpdateGeneralInstance(oSI);
            }
            else if (elmRoot.SelectSingleNode("type").InnerText.ToString() == "delete")
            {
                string sPDDID = elmRoot.SelectSingleNode("id").InnerText;
                CfnDatabaseUtility.WfEntityFilter[] aFilters ={ new CfnDatabaseUtility.WfEntityFilter("id", sPDDID, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true) };
                oDBMgr.DeleteEntity("WfPrivateDomainData", aFilters);
            }
            else
            {
                string sguid = elmRoot.SelectSingleNode("id").InnerText;
                if (sguid == string.Empty)
                {
                    sguid = CfnEntityClasses.WfEntity.NewGUID();
                }
                CfnEntityClasses.WfPrivateDomainData oSI =
                new CfnEntityClasses.WfPrivateDomainData
                (
                    sguid,
                    "APPROVERCONTEXT",
                    elmRoot.SelectSingleNode("title").InnerText,
                    elmRoot.SelectSingleNode("userid").InnerText,
                    pGetAbstract(elmRoot),
                    elmRoot.SelectSingleNode("dscr").InnerText,
                    elmRoot.SelectSingleNode("steps").OuterXml
                );

                oDBMgr.CreateEntity(oSI);
            }

        }
        catch (System.Exception ex)
        {
            // logger.SendMessage(new Covi.Message.CoviMessage(ex));
            throw new Exception(null, ex);
        }
        finally
        {
            //code
            if (oDBMgr != null)
            {
                System.EnterpriseServices.ServicedComponent.DisposeObject(oDBMgr);
                oDBMgr = null;
            }
            if (elmRoot != null)
            {
                elmRoot = null;
            }
        }
    }
	private static System.Xml.Xsl.XslCompiledTransform oXSLT = null;
    public string pGetAbstract(System.Xml.XmlNode oelmRoot)
    {
        string sReturn = "";
        StringReader oSR = null;
        XPathDocument oXPathDoc = null;
        StringWriter oSW = null;
        // Create the XsltSettings object with script enabled.
        XsltSettings settings = null;

        try
        {
            oSR = new StringReader(oelmRoot.SelectSingleNode("steps").OuterXml.ToString());
            oXPathDoc = new XPathDocument(oSR);
            oSW = new System.IO.StringWriter();
            // Create the XsltSettings object with script enabled.
            settings = new System.Xml.Xsl.XsltSettings(false, true);
			XsltArgumentList xslArg = new XsltArgumentList();
			if (oXSLT == null)
			{
				oXSLT = new System.Xml.Xsl.XslCompiledTransform();
				{//이준희(2010-10-07): Changed to support SharePoint environment.
				//oXSLT.Load(Server_MapPath("SetApvliststeps.xsl"), settings, new System.Xml.XmlUrlResolver());
				oXSLT.Load(cbsg.CoviServer_MapPath("SetApvliststeps.xsl"), settings, new System.Xml.XmlUrlResolver());
				}
			}
			xslArg.AddParam("lngindex","",strLangIndex);
			cfxsl o = new cfxsl();
			xslArg.AddExtensionObject("urn:cfxsl", o);

			oXSLT.Transform(oXPathDoc, xslArg, oSW);

            sReturn = oSW.GetStringBuilder().Remove(0, 39).ToString();
        }
        catch (System.Exception ex)
        {
            throw new System.Exception("pResolveXSL", ex);
        }
        finally
        {
            //code
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

        //System.IO.StringWriter oTW = new System.IO.StringWriter();;

        //
        //try
        //{
        //    System.Xml.Xsl.XslTransform xslsteps = new System.Xml.Xsl.XslTransform();
        //    //사용하지 않는다고 에러남
        //    xslsteps.Load(Server_MapPath("SetApvliststeps.xsl"));
        //    System.Xml.XPath.XPathDocument oXPathDoc = new System.Xml.XPath.XPathDocument(new System.IO.StringReader(oelmRoot.SelectSingleNode("steps").OuterXml));

        //    System.Xml.XmlUrlResolver oXMLResolver = new System.Xml.XmlUrlResolver();
        //    xslsteps.Transform(oXPathDoc, null, oTW, oXMLResolver);
        //    oTW.GetStringBuilder().Remove(0, 39);
        //    return oTW.ToString();


        //}
        //catch (System.Exception ex)
        //{
        //    
        //    throw new Exception(null, ex);
        //}
        //finally
        //{
        //    if (oTW != null)
        //    {
        //        oTW.Close();
        //    }
        //}

    }
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
				oXML.LoadXml(aForm[0]);

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
					case "T017"://공람
						sSubKind = Resources.Approval.lbl_audit2; break;
					case "T018"://감사
						sSubKind = Resources.Approval.lbl_PublicInspect; break;
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
