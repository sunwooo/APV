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

/// <summary>
/// 전자결재 결재확인함 엑셀다운로드 처리 페이지
/// </summary>
public partial class Approval_ListDeptAuditExcel : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string strUserId;

    public string strdept, strListName, strExcelList, strPI_BUSINESS_DATA2, strSearchType, strSearchWord, strSearchWord1, strSearchWord2, strSearchWord3, strSelForm;
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
            //Response.ContentType = "application/vnd.ms-excel";
            Response.Clear();
            Response.ContentType = "application/vnd.xls";
            Response.AddHeader("Content-Disposition", "attachment;filename=ListDeptAudit.xls");
            Response.Buffer = true; 
          
            Response.Charset = "euc-kr";
            HttpContext context = HttpContext.Current;
            context.Response.Write("<META  HTTP-EQUIV=\"Content-Type\"  CONTENT=\"text/html; charset=euc-kr\">");

            Response.ContentEncoding = System.Text.Encoding.GetEncoding("euc-kr");

            strUserId = Session["user_code"].ToString();
            strdept = Session["user_dept_code"].ToString();

            strListName = Request.QueryString["doclistname"];

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


            //if (Request.QueryString["selForm"] == null)
            //    strSelForm = "";
            //else           
            //    strSelForm = Request.QueryString["selForm"];
            //strSelForm = hdn_Form.Value;
               

            //archive 여부
            bArchived = System.Convert.ToBoolean(Request.QueryString["barchived"]);
            
            
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
        System.IO.StringReader oSR = null;
        System.Xml.XPath.XPathDocument oXPathDoc = null;
        System.IO.StringWriter oSW = null;
        string sReturn = "";
        try
        {
            oSR = new System.IO.StringReader(sXML.ToString());
            oXPathDoc = new System.Xml.XPath.XPathDocument(oSR);
            //if (oXSLTformcount == null)
            {
                oXSLTformcount = new System.Xml.Xsl.XslCompiledTransform();
                oXSLTformcount.Load(sXSLPath);
            }
            oSW = new System.IO.StringWriter();
            oXSLTformcount.Transform(oXPathDoc, null, oSW);
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
	}
}
