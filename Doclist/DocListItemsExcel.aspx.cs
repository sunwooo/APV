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
using System.Xml.Xsl;

/// <summary>
/// 문서대장 엑셀저장 페이지
/// </summary>
public partial class COVIFlowNet_Doclist_DocListItemsExcel : PageBase
{
    public string strdept, strpage, strDocListType, strDocListName, strMonth, strSort, strExcelList;
	public string strLangIndex = "0";
	protected void Page_Load(object sender, EventArgs e)
    {
		//다국어 언어설정
		string culturecode = ConfigurationManager.AppSettings["LanguageType"];
		if (Session["user_language"] != null)
		{
			culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
		}
		Page.UICulture = culturecode;
		Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

        Response.ContentType = "application/vnd.ms-excel";
        Response.AddHeader("Content-Disposition", "attachment;filename=DocList(" + DateTime.Now.Year.ToString() + ").xls");


        if (Request.QueryString["doclisttype"] == "3" || Request.QueryString["doclisttype"] == "10" || Request.QueryString["doclisttype"] == "11")
        {
            strdept = Session["user_ent_code"].ToString();
        }
        else
        {
            if (Session["user_dept_code"].ToString() == Session["user_parent_dept_code"].ToString())
            {
                strdept = Session["user_dept_code"].ToString();
            }
            else
            {
                strdept = Session["user_parent_dept_code"].ToString();
            }
        }
        strpage = Request.QueryString["page"];
        if (strpage == "")
        {
            strpage = "1";
        }
        
        strDocListType = Request.QueryString["doclisttype"];
        strDocListName = Request.QueryString["doclistname"];
        strMonth = Request.QueryString["strMonth"];

        if (strMonth == "")
        {
            strMonth = DateTime.Now.Year.ToString();
        }
        else
        {
            if (strMonth.Length > 4)
            {
                strMonth = strMonth.Substring(0, 4) + "-" + strMonth.Substring(strMonth.Length - 3, strMonth.Length - 1);
            }
            else
            {
                strMonth = strMonth.Substring(0, 4);
            }

        }
        strSort = "registerd_date";
        
        pGetExcelFile();
    }

    /// <summary>
    /// 문서대장 목록에 있는 Data를 가져와서 해당  XSL을 입혀 Excel파일로 내보낸다.
    /// </summary>
    public void pGetExcelFile()
    {
        System.Xml.XmlDocument xmlDoc = null;
        System.Text.StringBuilder sb = null;
        DataSet ds = null;
        DataPack INPUT = null;
        try
        {
            xmlDoc = new System.Xml.XmlDocument();
            sb = new System.Text.StringBuilder(100);
            ds = new DataSet();
            INPUT = new DataPack();
            using ( SqlDacBase SqlDbAgent  = new SqlDacBase())
            {
                INPUT.add("@OWNER_UNIT_CODE",strdept);
                INPUT.add("@DOC_LIST_TYPE",strDocListType);
                INPUT.add("@YYYYMM", strMonth);
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();

                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wfform_doclistexcel", INPUT);
            }

            //sb.Remove(0, sb.Length - 1);
            String sMainURL = Request.Url.ToString().Substring(0, Request.Url.ToString().LastIndexOf("/"));
            //sMainURL = sMainURL.Replace(Request.Url.Host, Server.MachineName);
            if (Request.IsSecureConnection)
            {
                sMainURL = "https://" + Server.MachineName + "/Approval/DocList/";
            }
            else
            {
                sMainURL = "http://" + Server.MachineName + "/Approval/DocList/";
            }

            //sb.Append(COVIFlowCom.Common.pTransform(ds.GetXml(), AppDomain.CurrentDomain.BaseDirectory + "/Approval/DocList/wfform_doclist02.xsl"));
            sb.Append(this.pTransform(ds.GetXml(), AppDomain.CurrentDomain.BaseDirectory + "Approval\\DocList\\wfform_doclist02.xsl", "0"));
            xmlDoc.LoadXml(sb.ToString().Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>",""));

            string sXSLFile="";
            //System.Xml.Xsl.XslTransform xsldoc = new System.Xml.Xsl.XslTransform();
            switch (strDocListType)
            {
                case "1":
                    sXSLFile = "regdoclistXLS.xsl"; //"regdoclistExcelXSL.aspx";
                    break;
                case "2":
                    sXSLFile = "recdoclistXLS.xsl";//"recdoclistExcelXSL.aspx";
                    break;
                case "3":
                    sXSLFile = "pubregdoclistXLS.xsl";//"pubregdoclistExcelXSL.aspx";
                    break;
                case "4":
                    sXSLFile = "pubrecdoclistXLS.xsl";//"pubrecdoclistExcelXSL.aspx";
                    break;
                case "5":
                    sXSLFile = "sealdoclistXLS.xsl";//"sealdoclistExcelXSL.aspx";
                    break;
                case "6":
                    sXSLFile = "reqrecdoclistXLS.xsl";//"reqrecdoclistExcelXSL.aspx";
                    break;
                case "7":
                    sXSLFile = "senddoclistXLS.xsl";// "senddoclistExcelXSL.aspx";
                    break;
                case "8":
                    sXSLFile = "notedoclistXLS.xsl";//"sealdoclistExcelXSL.aspx";
                    break;
                case "9":
                    //sXSLFile = "http://localhost/COVIFlowNet/Doclist/officlaldocXSL.aspx";// "officlaldocXSL.aspx";
                    sXSLFile = "notesealdoclistXLS.xsl";// "officlaldocXSL.aspx";
                    break;
                case "10":
                    sXSLFile = "senddoclistXLS.xsl";// "senddoclistExcelXSL.aspx";
                    break;
                case "11":
                    sXSLFile = "senddoclistXLS.xsl";// "senddoclistExcelXSL.aspx";
                    break;
                case "12":
                    sXSLFile = "senddoclistXLS.xsl";// "senddoclistExcelXSL.aspx";
                    break;
            }
            sXSLFile = AppDomain.CurrentDomain.BaseDirectory + "Approval\\DocList\\" + sXSLFile;
            //strExcelList = COVIFlowCom.Common.pTransform(xmlDoc.OuterXml, sXSLFile);
            strExcelList = this.pTransform(xmlDoc.OuterXml, sXSLFile, strDocListType);
            strExcelList = strExcelList.Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>","");

        }
        catch (System.Exception ex)
        {
            
            throw ex;
        }
        finally
        {
            if (xmlDoc!=null)
            {
                xmlDoc = null;
            }
            if (sb != null)
            {
                sb = null;
            }
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
    /// Data를 XML형태(string)로 받아 XSL로 Parsing해주는 함수
    /// </summary>
    /// <param name="sXML">XML string</param>
    /// <param name="sXSLPath">XSL파일 경로</param>
    /// <param name="smode"></param>
    /// <returns></returns>
    public string pTransform(string sXML, System.String sXSLPath, string smode)
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
			XsltArgumentList xslArg = new XsltArgumentList();
			xslArg.AddParam("lngindex", "", COVIFlowCom.Common.getLngIdx(Page.Culture));
			cfxsl o = new cfxsl();
			xslArg.AddExtensionObject("urn:cfxsl", o);

            if (smode == "0")
            {
                if (oXSLT0 == null)
                {
                    oXSLT0 = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLT0.Load(sXSLPath, XSLTsettings, null);
                }
				oXSLT0.Transform(oXPathDoc, xslArg, oSW);
            }
            if (smode == "1")
            {
                if (oXSLT1 == null)
                {
                    oXSLT1 = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLT1.Load(sXSLPath, XSLTsettings, null);
                }
				oXSLT1.Transform(oXPathDoc, xslArg, oSW);
            }
            if (smode == "2")
            {
                if (oXSLT2 == null)
                {
                    oXSLT2 = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLT2.Load(sXSLPath, XSLTsettings, null);
                }
				oXSLT2.Transform(oXPathDoc, xslArg, oSW);
            }
            if (smode == "3")
            {
                if (oXSLT3 == null)
                {
                    oXSLT3 = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLT3.Load(sXSLPath, XSLTsettings, null);
                }
				oXSLT3.Transform(oXPathDoc, xslArg, oSW);
            }
            if (smode == "4")
            {
                if (oXSLT4 == null)
                {
                    oXSLT4 = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLT4.Load(sXSLPath, XSLTsettings, null);
                }
				oXSLT4.Transform(oXPathDoc, xslArg, oSW);
            }

            if (smode == "5")
            {
                if (oXSLT5 == null)
                {
                    oXSLT5 = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLT5.Load(sXSLPath, XSLTsettings, null);
                }
				oXSLT5.Transform(oXPathDoc, xslArg, oSW);
            }
            if (smode == "6")
            {
                if (oXSLT6 == null)
                {
                    oXSLT6 = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLT6.Load(sXSLPath, XSLTsettings, null);
                }
				oXSLT6.Transform(oXPathDoc, xslArg, oSW);
            }
            if (smode == "7" || smode == "10" || smode == "11" || smode == "12")
            {
                if (oXSLT7 == null)
                {
                    oXSLT7 = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLT7.Load(sXSLPath, XSLTsettings, null);
                }
				oXSLT7.Transform(oXPathDoc, xslArg, oSW);
            }
            if (smode == "8")
            {
                if (oXSLT8 == null)
                {
                    oXSLT8 = new System.Xml.Xsl.XslCompiledTransform(true);
                    oXSLT8.Load(sXSLPath, XSLTsettings, null);
                }
				oXSLT8.Transform(oXPathDoc, xslArg, oSW);
            }
            if (smode == "9")
            {
                if (oXSLT9 == null)
                {
                    oXSLT9 = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLT9.Load(sXSLPath, XSLTsettings, null);
                }
				oXSLT9.Transform(oXPathDoc, xslArg, oSW);
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
	public class cfxsl
	{
		public string getSubKind(string sKind)
		{
			string sSubKind = "";
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
			return sSubKind;
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
		public string getRgcmtNodeValue(string sValue, string strNodeName, string szLangIndex)
		{
			System.Xml.XmlDocument oXML = null;
			oXML = new System.Xml.XmlDocument();
			try
			{
				oXML.LoadXml(sValue);
			}
			catch (System.Exception ex)
			{
				oXML.LoadXml("<root>" +sValue+"</root>");
			}
			if (oXML.SelectSingleNode(strNodeName) != null)
			{
				if (strNodeName == "approver")
				{
					return splitNameExt(oXML.SelectSingleNode(strNodeName).InnerText, szLangIndex);

				}
				else
				{
					return oXML.SelectSingleNode(strNodeName).InnerText;
				}
			}
			else
			{
				return "";
			}
		}

	}
}
