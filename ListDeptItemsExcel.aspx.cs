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
using System.Text;
using System.Xml;
using System.Xml.Xsl;

/// <summary>
/// 전자결재 개인/부서함 엑셀다운로드 처리 페이지
/// </summary>
public partial class Approval_ListDeptItemsExcel : WebPartsPageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string strUserId;

    public string strdept, strListType, strListName, strExcelList, strPI_BUSINESS_DATA2, strSearchType, strSearchWord, strSearchWord1, strSearchWord2, strSearchWord3;
    public string start_date, end_date = String.Empty;
    public string sWhere = String.Empty;
    public Boolean bArchived = false;

    /// <summary>
    /// 엑셀파일 생성 -
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (Session["user_language"] != null)
            {
                strLangID = Session["user_language"].ToString();
            }
            //다국어 언어설정
            string culturecode = strLangID; //"en-US"; "ja-JP";
            Page.UICulture = culturecode;
            Page.Culture = culturecode;

            //this.IsAutoIncludeScript = false;

            Response.ContentType = "application/vnd.ms-excel";

            Response.AddHeader("Content-Disposition", "attachment;filename=ListItem.xls");

            string encoding = Request.ContentEncoding.HeaderName;
            Response.Write("<meta http-equiv='Content-Type' content='text/html; charset=" + encoding + "'>");
            Response.Buffer = true;

            strUserId = Session["user_code"].ToString();
            strdept = Session["user_dept_code"].ToString();

            strListType = Request.QueryString["ListType"];
            strListName = Request.QueryString["doclistname"];
			
			 //20190401 추가
		     if(strListType=="RC" || strListType=="A" || strListType=="S")
			 {
			   strdept = Request.QueryString["DeptCode"];
			 }
			 //20190401 추가 끝

            //검색일
            start_date = Request.QueryString["start_date"];
            end_date = Request.QueryString["end_date"];


            //검색종류
            strSearchType = Request.QueryString["SearchType"];

            //검색어            
            if (Request.QueryString["SearchWord"] == null)
            {
                strSearchWord = "";
            }
            else
            {
                strSearchWord = Request.QueryString["SearchWord"];
            }

            //archive 여부
            bArchived = System.Convert.ToBoolean(Request.QueryString["barchived"]);
            //엑셀파일생성
            pGetExcelFile();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /// <summary>
    /// 조건에 따른 엑셀 파일 생성
    /// </summary>
    public void pGetExcelFile()
    {
        StringBuilder sb = null;
        XmlDocument xmlDoc = null;
        DataSet ds = null;
        DataPack INPUT = null;

        try
        {
            string szQuery = "";
            xmlDoc = new XmlDocument();
            sb = new StringBuilder(100);
            ds = new DataSet();
            INPUT = new DataPack();

            INPUT.add("@PF_PERFORMER_ID", strdept);
            INPUT.add("@WI_STATE", "");
            INPUT.add("@PI_STATE", "");
            INPUT.add("@MODE", "");
            if (strSearchType == "PI_SUBJECT")
            {
                INPUT.add("@PI_NAME", strSearchWord);
            }
            else
            {
                INPUT.add("@PI_NAME", "");
            }
            INPUT.add("@PI_INITIATOR_NAME", "");
            INPUT.add("@PF_SUB_KIND", strListType);
            INPUT.add("@PI_FINISHED", "");
            if (strSearchType == "PI_INITIATOR_NAME" || strSearchType == "PI_INITIATOR_UNIT_NAME")
            {
                INPUT.add("@GROUP_KIND", strSearchType);
            }
            else
            {
                INPUT.add("@GROUP_KIND", "");
            }
            INPUT.add("@TITLE", strSearchWord);
            INPUT.add("@order_field", "");
            INPUT.add("@order_desc", "");
            INPUT.add("@QSDATE", start_date);
            INPUT.add("@QEDATE", end_date);


            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                szQuery = "dbo.usp_wf_worklistdeptqueryExcel";
                if (bArchived)
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ARCHIVE_ConnectionString").ToString();
                }
                else
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                }
                //회람함
                if (strListType == "D")
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
                    if (strSearchWord != "" && start_date != "" && end_date != "")
                    {
                        szQuery = "dbo.usp_wfform_tonccquery01_dynamic";
                    }
                    else
                    {
                        szQuery = "dbo.usp_wfform_tonccquery01";
                    }
                }

                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, szQuery, INPUT);
            }
            if (strListType == "D")
            {
                //
            }
            else
            {
                sb.Append(this.pTransform(ds.GetXml(), AppDomain.CurrentDomain.BaseDirectory + "\\Approval\\XSLT\\wfform_deptlistitem.xsl", "1"));
            }

            xmlDoc.LoadXml(sb.ToString().Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", ""));
            string sXSLFile = "";
            string mode = "";
            switch (strListType)
            {
                case "I":
                    mode = "2"; sXSLFile = "Dept_ECXLS.xsl"; //참조함
                    break;
                case "C":
                    mode = "2"; sXSLFile = "Dept_RXLS.xsl"; //수신문서함
                    break;
                case "AD":
                    mode = "2"; sXSLFile = "Dept_RXLS.xsl"; //감사함
                    break;
                case "R":
                    mode = "2"; sXSLFile = "Dept_RXLS.xsl"; //수신문서함
                    break;
                case "RC":
                    mode = "3"; sXSLFile = "Dept_RCXLS1.xsl"; //접수완료함
                    break;
                case "AS":
                    mode = "4"; sXSLFile = "Dept_RCXLS.xsl"; //
                    break;
                case "A":
                    mode = "5"; sXSLFile = "Dept_RCXLS.xsl"; //품의함
                    break;
                case "S":
                    mode = "5"; sXSLFile = "Dept_RCXLS.xsl"; //발신함Dept_SXLS.xsl
                    break;
                    //20111020 추가
                case "SS": 
                    mode = "5"; sXSLFile = "Dept_RCXLS.xsl"; //품의함
                    break;

            }

            sXSLFile = AppDomain.CurrentDomain.BaseDirectory + "Approval\\XSLT\\" + sXSLFile;
            strExcelList = this.pTransform(xmlDoc.OuterXml, sXSLFile, mode);
            strExcelList = strExcelList.Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", "");

        }
        catch (System.Exception ex)
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
            if (xmlDoc != null)
            {
                xmlDoc = null;
            }

            if (sb != null)
            {
                sb = null;
            }
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
        }
    }

    private static System.Xml.Xsl.XslCompiledTransform oXSLT1 = null;
    private static System.Xml.Xsl.XslCompiledTransform oXSLT2 = null;
    private static System.Xml.Xsl.XslCompiledTransform oXSLT3 = null;
    private static System.Xml.Xsl.XslCompiledTransform oXSLT4 = null;
    private static System.Xml.Xsl.XslCompiledTransform oXSLT5 = null;
    private static System.Xml.Xsl.XslCompiledTransform oXSLT6 = null;
    private static System.Xml.Xsl.XslCompiledTransform oXSLT7 = null;
    private static System.Xml.Xsl.XslCompiledTransform oXSLT8 = null;

    /// <summary>
    /// 조건에 따른 xsl 파일 변환
    /// </summary>
    /// <param name="sXML">변환대상 xml data</param>
    /// <param name="sXSLPath">xsl file path</param>
    /// <param name="smode">엑셀파일 구분</param>
    /// <returns>string</returns>
    public string pTransform(string sXML, System.String sXSLPath, string smode)
    {
        System.Xml.Xsl.XsltSettings XSLTsettings = new System.Xml.Xsl.XsltSettings();
        XSLTsettings.EnableScript = true;

        System.IO.StringReader oSR = null;
        System.Xml.XPath.XPathDocument oXPathDoc = null;
        System.IO.StringWriter oSW = null;
        string sReturn = "";
        try
        {
            oSR = new System.IO.StringReader(sXML.ToString());
            oXPathDoc = new System.Xml.XPath.XPathDocument(oSR);
            oSW = new System.IO.StringWriter();

			XsltArgumentList xslArg = new XsltArgumentList();
			xslArg.AddParam("lngindex", "", COVIFlowCom.Common.getLngIdx(Page.Culture));
			cfxsl o = new cfxsl();
			xslArg.AddExtensionObject("urn:cfxsl", o);

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
                oXSLT6.Transform(oXPathDoc, null, oSW);
            }
            if (smode == "7")
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
                    oXSLT8 = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLT8.Load(sXSLPath, XSLTsettings, null);
                }
				oXSLT8.Transform(oXPathDoc, xslArg, oSW);
            }
			o = null;
			xslArg = null;
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
	}
}
