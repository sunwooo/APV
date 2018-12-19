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
using System.Diagnostics;
using System.Text;
using System.Xml;
using System.Xml.Xsl;
using System.Xml.XPath;

/// <summary>
/// 전자결재 감사함(감사권한자 검색 목록)
/// </summary>
namespace COVINet.COVIFlowNet
{
    public partial class ListDeptAudit : PageBase
    {
        private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

        protected void Page_Load(object sender, EventArgs e)
        {

            if (!IsPostBack)
            {
                if (Session["user_language"] != null)
                {
                    strLangID = Session["user_language"].ToString();
                }
                //다국어 언어설정
                string culturecode = strLangID; //"en-US"; "ja-JP";
                Page.UICulture = culturecode;
                Page.Culture = culturecode;

                Title = Resources.Approval.lbl_doc_person2;
                //lbl_Title.Text = Resources.Approval.lbl_subject;
                //lbl_Intiator.Text = Resources.Approval.lbl_writer;
                //PageName.Text = Resources.COVIFlowNet.lbl_doc_person2; 20070226
                //PageName2.Text = Resources.COVIFlowNet.lbl_doc_person2;
                PagePath.Text = Resources.Approval.lbl_approval;
                ApvLineView.Text = Resources.Approval.lbl_viewAL;
                DisplayTab.Text = Resources.Approval.lbl_viewtab;
                PageName.Text = Resources.Approval.lbl_monitor;
                PageName2.Text = Resources.Approval.lbl_monitor;

                this.hidQSDATE.Value = DateTime.Now.AddMonths(-3).ToString("yyyy-MM-dd");
                this.hidQEDATE.Value = DateTime.Now.ToString("yyyy-MM-dd");

                //     btn_reload.Text = Resources.Approval.btn_refresh;
                //     btn_delete.Text = Resources.Approval.btn_delete;
                //     btn_search.Text = Resources.Approval.btn_search;

            }
        }

        protected void btn_Excel_Click(object sender, EventArgs e)
        {
            try
            {  
                string strUserId;

                string strdept, strListName, strExcelList, strPI_BUSINESS_DATA2, strSearchType, strSearchWord, strSearchWord1, strSearchWord2, strSearchWord3, strSelForm;
                string start_date, end_date = String.Empty;
                string sWhere = String.Empty;               

                //다국어 언어설정
                string culturecode = strLangID; //"en-US"; "ja-JP";
                Page.UICulture = culturecode;
                Page.Culture = culturecode;

                //this.IsAutoIncludeScript = false;
                Response.Clear();
                Response.Charset = "euc-kr";
                HttpContext context = HttpContext.Current;
                context.Response.Write("<META HTTP-EQUIV=\"Content-Type\"  CONTENT=\"text/html; charset=euc-kr\">");

                Response.ContentType = "application/vnd.ms-excel";
                Response.AddHeader("Content-Disposition", "attachment;filename=ListDeptAudit.xls");
                Response.Buffer = true;
               
                Response.ContentEncoding = System.Text.Encoding.GetEncoding("euc-kr");

                strUserId = Session["user_code"].ToString();
                strdept = Session["user_dept_code"].ToString();


                if (hdn_Excel.Value != "")
                {
                    string[] arrSearch = hdn_Excel.Value.Split(new char[]{';'});
                   
                    //검색일
                    start_date = arrSearch[2];
                    end_date = arrSearch[3];

                    //검색종류
                    strSearchType = arrSearch[0];

                    //검색어            
                    strSearchWord = arrSearch[1];

                    strSelForm = arrSearch[4];
                }
                else
                {
                    start_date = "";
                    end_date = "";

                    //검색종류
                    strSearchType = "";

                    //검색어
                    strSearchWord = "";
                    strSelForm = "";
                }

                //엑셀파일생성
                DataSet ds = null;
                DataPack INPUT = null;

                try
                {
                    ds = new DataSet();
                    INPUT = new DataPack();

                    INPUT.add("@USER_ID", strUserId);
                    INPUT.add("@GUBUN", strSearchType);
                    INPUT.add("@TITLE", strSearchWord);
                    INPUT.add("@FORM_NAME", strSelForm);
                    INPUT.add("@order_field", "");
                    INPUT.add("@order_desc", "");
                    INPUT.add("@QSDATE", start_date);
                    INPUT.add("@QEDATE", end_date);

                    using (SqlDacBase SqlDbAgent = new SqlDacBase())
                    {
                        SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();                     
                        
                        ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wf_worklistquery01deptaudit_excel", INPUT);
                    }
                    string sXSLFile = "ListDeptAudit.xsl";
                    Response.Write(this.pTransform(ds.GetXml(), AppDomain.CurrentDomain.BaseDirectory + "Approval\\" + sXSLFile));
                    Response.End();
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

                    if (INPUT != null)
                    {
                        INPUT.Dispose();
                        INPUT = null;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    private static System.Xml.Xsl.XslCompiledTransform oXSLTformcount = null;
    public string pTransform(string sXML, System.String sXSLPath)
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

            if (oXSLTformcount == null)
            {
                oXSLTformcount = new System.Xml.Xsl.XslCompiledTransform();
                oXSLTformcount.Load(sXSLPath, XSLTsettings, null);
            }
            oXSLTformcount.Transform(oXPathDoc, xslArg, oSW);
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

        public string getStateName(int iValue)
        {
            string ret = string.Empty;
            switch (iValue)
            {
                case 288:
                    ret = "진행";
                    break;
                case 528:
                    ret = "완료";
                    break;
            }

            return ret;
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
    }
    }
}
