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
using System.Xml;

using System.Globalization;
using System.Threading;
using Covision.Framework;
using Covision.Framework.Data.Business;
using System.Diagnostics;



	/// <summary>
	/// 전자결재 왼쪽 메뉴
	/// </summary>
public partial class Approval_Menu_DocBox : PageBase //System.Web.UI.Page 
	{
		private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

		public string sRefresh = "";
		public string strGRCount = "0";         //수신처그룹 갯수
		public string strPersonListValue, strDocListValue, strDeptListValue;
		public string strMenu = "";
		public string strSubMenu = "";
		public string strAdminType = "";
        public string sEntCode = "";

		private static System.Xml.Xsl.XslCompiledTransform oXSLTJF = null;
		private static System.Xml.Xsl.XslCompiledTransform oXSLTUF = null;

		/// <summary>
		/// 전자결재 왼쪽 메뉴 조회
		/// 다국어처리
		/// 개인함/부서함 사용 함 활성화 처리
		/// </summary>
		/// <param name="sender"></param>
		/// <param name="e"></param>
		protected void Page_Load(object sender, EventArgs e)
		{
			try
			{
				#region PerformanceLog 처리를 위한 Stopwatch 설정
				Stopwatch stopwatch = null;
				if (sPerformanceYN == "True")
				{
					stopwatch = new Stopwatch();
					stopwatch.Start();
				}
				#endregion

				//code
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

					strMenu = Request.QueryString["sMenu"];
					if (Request.QueryString["sSubMenu"] != null) strSubMenu = Request.QueryString["sSubMenu"];


					Title = Resources.Approval.lbl_approval;
					lbl_doc_person2.Text = Resources.Approval.lbl_doc_person2;
					lbl_doc_complete2.Text = Resources.Approval.lbl_doc_complete2;
					lbl_doc_reject2.Text = Resources.Approval.lbl_doc_reject2;
					lbl_doc_reference2.Text = Resources.Approval.lbl_doc_reference2;
					lbl_doc_review.Text = Resources.Approval.lbl_doc_review;
					lbl_doc_deptcomplet.Text = Resources.Approval.lbl_doc_dept2;
					lbl_doc_deptcomplet2.Text = Resources.Approval.lbl_doc_deptcomplet;
					lbl_doc_sent.Text = Resources.Approval.lbl_doc_sent;
					lbl_doc_receiveprocess.Text = Resources.Approval.lbl_doc_receiveprocess;
					lbl_doc_reference3.Text = Resources.Approval.lbl_doc_reference2;


					if (Request.QueryString["refresh"] != null) //왼쪽 메뉴 refresh
					{
						sRefresh = Request.QueryString["refresh"];
					}
					//관리자 설정
					strAdminType = COVIFlowCom.Common.GetAdminType(Session["Admin_SysTotal"].ToString(), Session["Admin_EntSys"].ToString(), "");
					if (strAdminType == "SysAdmin" || strAdminType == "EntAdmin") strAdminType = "true";
					else strAdminType = "false";



                    if (Request.QueryString["sEntCode"] != null) //왼쪽 메뉴 refresh
                    {
                        sEntCode = Request.QueryString["sEntCode"];
                    }
                    else
                    {
                        sEntCode = Session["user_ent_code"].ToString();
                    }
				}



				#region PerformanceLog 처리
				if (sPerformanceYN == "True")
				{
					stopwatch.Stop();
					if (stopwatch.ElapsedMilliseconds > Convert.ToInt32(iPerformanceLimit))
					{
						string fullMethodName = string.Format("{0} --> {1}", this.GetType().Name, System.Reflection.MethodBase.GetCurrentMethod().Name);
						this.SetPerformanceLog(fullMethodName, stopwatch.Elapsed.ToString());

					}
				}
				#endregion
			}
			catch (System.Exception ex)
			{
				throw new System.Exception(null, ex);
			}
			finally
			{
				//code
			}
		}

		/// <summary>
		/// 소속부서가 속한 수신처그룹 조회
		/// </summary>
		/// <returns></returns>
		public string GetGroupBoxes()
		{
			String sGroupBoxes = "";
			DataSet oDS = null;
			DataPack INPUT = null;
			try
			{
				//code
				string sQuery = "dbo.usp_getdeptgroups";
				string deptid = Session["user_dept_code"].ToString();
				string parentdeptid = Session["user_parent_dept_code"].ToString();
				if (deptid != parentdeptid) deptid = parentdeptid;

				INPUT = new DataPack();
				INPUT.add("@UNIT_CODE", deptid);
				INPUT.add("@MSG", Resources.Approval.msg_111);

				oDS = new DataSet();
				using (SqlDacBase SqlDbAgent = new SqlDacBase())
				{
					SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
					oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sQuery, INPUT);
				}
				sGroupBoxes = MakeJFList(oDS.GetXml(), "group");
				strGRCount = oDS.Tables[0].Rows.Count.ToString();
			}
			catch (System.Exception ex)
			{
				throw ex;
			}
			finally
			{
				if (oDS != null)
				{
					oDS.Dispose();
					oDS = null;
				}
				if (INPUT != null)
				{
					INPUT.Dispose();
					INPUT = null;
				}
			}
			return sGroupBoxes;
		}
		/// <summary>
		/// 수신처그룹데이터 xsl 파일에 의한 목록 만들기
		/// </summary>
		/// <param name="DSXML">수신처그룹 data</param>
		/// <param name="mode">구분(미사용)</param>
		/// <returns></returns>
		private string MakeJFList(string DSXML, string mode)
		{
			System.IO.StringWriter oTW = null;
			System.Xml.XPath.XPathDocument oXPathDoc = null;
			try
			{
				oTW = new System.IO.StringWriter();
				if (oXSLTJF == null)
				{
					oXSLTJF = new System.Xml.Xsl.XslCompiledTransform();
					{//이준희(2010-10-07): Changed to support SharePoint environment.
					//oXSLTJF.Load(Server_MapPath("deptgrouplist.xsl"));
					oXSLTJF.Load(cbsg.CoviServer_MapPath("deptgrouplist.xsl"));
					}
				}
				oXPathDoc = new System.Xml.XPath.XPathDocument(new System.IO.StringReader(DSXML));
				oXSLTJF.Transform(oXPathDoc, null, oTW);
				oTW.GetStringBuilder().Remove(0, 39);

				return oTW.ToString();
			}
			catch (System.Exception ex)
			{
				throw ex;
			}
			finally
			{
				if (oTW != null)
				{
					oTW.Dispose();
					oTW = null;
				}
				if (oXPathDoc != null)
				{
					oXPathDoc = null;
				}
			}   
		}
	}

