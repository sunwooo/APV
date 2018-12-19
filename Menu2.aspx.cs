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

using Covision.Framework;
using Covision.Framework.Data;
using System.Diagnostics;
using Covision.Framework.Data.Business;

public partial class Approval_Menu2 : PageBase //System.Web.UI.Page 
{
	private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

	public Boolean bReceptionist = false;   // 부서 수신함 조회 권한
	public Boolean bMonitor = false;        // 모니터 권한
	public Boolean bAuditDept = false;      // 감사부서여부
	public string sRefresh = "";
	public string strJFCount = "0";         //담당업무 갯수
	public string strPersonListValue, strDocListValue, strDeptListValue;
	public string strMenu = "";
	public string strSubMenu = "";

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
				//COVIFlowCom.Common.SetPageCulture(sender, Session["user_language"], Request);

				//Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(Request.UserLanguages[0]);
				//Thread.CurrentThread.CurrentUICulture = new CultureInfo(Request.UserLanguages[0]);

				strMenu = Request.QueryString["sMenu"];
				if (Request.QueryString["sSubMenu"] != null) strSubMenu = Request.QueryString["sSubMenu"];


				Title = Resources.Approval.lbl_approval;
				//lbl_approval.Text = Resources.Approval.lbl_approval;
				lbl_chargedoc.Text = Resources.Approval.lbl_chargedoc;
				//lbl_circulation.Text = Resources.Approval.lbl_circulation;
				//lbl_circulation_rec.Text = Resources.Approval.lbl_circulation_rec;
				//lbl_circulation_sent.Text = Resources.Approval.lbl_circulation_sent;
				lbl_deptchange.Text = Resources.Approval.lbl_deptchange;
				lbl_doc_pre2.Text = Resources.Approval.lbl_doc_pre2;
				lbl_doc_approve2.Text = Resources.Approval.lbl_doc_approve2;
				//lbl_doc_dept2.Text = Resources.Approval.lbl_doc_dept2;
				lbl_doc_person2.Text = Resources.Approval.lbl_doc_person2;
				lbl_doc_privateapv.Text = Resources.Approval.lbl_doc_privateapv;
				lbl_doc_process2.Text = Resources.Approval.lbl_doc_process2;
				lbl_doc_complete2.Text = Resources.Approval.lbl_doc_complete2;
				lbl_doc_reject2.Text = Resources.Approval.lbl_doc_reject2;
				lbl_composing.Text = Resources.Approval.lbl_composing;
				lbl_doc_reference2.Text = Resources.Approval.lbl_doc_reference2;
				lbl_doc_circulation.Text = Resources.Approval.lbl_doc_circulation;
				lbl_doc_review.Text = Resources.Approval.lbl_doc_review;
				lbl_doc_deptcomplet.Text = Resources.Approval.lbl_doc_dept2;
				lbl_doc_deptcomplet2.Text = Resources.Approval.lbl_doc_deptcomplet;
				lbl_doc_sent.Text = Resources.Approval.lbl_doc_sent;
				lbl_doc_receive.Text = Resources.Approval.lbl_doc_receive;
				lbl_doc_receiveprocess.Text = Resources.Approval.lbl_doc_receiveprocess;
				lbl_doc_reference3.Text = Resources.Approval.lbl_doc_reference2;
				lbl_doc_auditou.Text = Resources.Approval.lbl_doc_auditou;
				//lbl_doc_list.Text = Resources.Approval.lbl_doc_list;
				//lbl_doc_reglist.Text = Resources.Approval.lbl_doc_reglist;
				//lbl_doc_recvlist.Text = Resources.Approval.lbl_doc_recvlist;
				//lbl_doc_sendlist.Text = Resources.Approval.lbl_doc_sendlist;
				//lbl_lagacyerror.Text = Resources.Approval.lbl_lagacyerror;
				//lbl_personinfo.Text = Resources.Approval.lbl_personinfo;
				lbl_write.Text = Resources.Approval.lbl_write;
				lbl_doc_list.Text = Resources.Approval.lbl_doc_list;

				//lbl_old_doc.Text = Resources.Approval.lbl_old_doc;
				//lbl_doc_old_person.Text = Resources.Approval.lbl_doc_person2;
				//lbl_doc_old_dept.Text = Resources.Approval.lbl_doc_dept2;

				lbl_Circulationline_setup.Text = Resources.Approval.lbl_Circulationline_setup;
				lbl_monitor.Text = Resources.Approval.lbl_monitor;

				if (Request.QueryString["refresh"] != null) //왼쪽 메뉴 refresh
				{
					sRefresh = Request.QueryString["refresh"];
				}
				//개인문서함 하위메뉴
				if (System.Web.Configuration.WebConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_List"] != null)
				{
					strPersonListValue = System.Web.Configuration.WebConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_List"].ToString();
				}
				else
				{
					strPersonListValue = System.Web.Configuration.WebConfigurationManager.AppSettings["Default_List"].ToString();
				}

				//문서대장 하위메뉴
				if (System.Web.Configuration.WebConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DocList"] != null)
				{
					strDocListValue = System.Web.Configuration.WebConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DocList"].ToString();
				}
				else
				{
					strDocListValue = System.Web.Configuration.WebConfigurationManager.AppSettings["Default_DocList"].ToString();
				}

				//
				if (System.Web.Configuration.WebConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DeptList"] != null)
				{
					strDeptListValue = System.Web.Configuration.WebConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DeptList"].ToString();
				}
				else
				{
					strDeptListValue = System.Web.Configuration.WebConfigurationManager.AppSettings["Default_DeptList"].ToString();
				}
				#region 감사할문서함 권한 체크
				string strdeptid = Session["user_dept_code"].ToString();
				string strcmpdeptid = ";" + System.Web.Configuration.WebConfigurationManager.AppSettings["WF_AUDITOUs"].ToString();
				if (strcmpdeptid.IndexOf(strdeptid) > -1)
				{
					bAuditDept = true;
				}
				#endregion
			}

			//string sJFCode = System.Web.Configuration.WebConfigurationManager.AppSettings["WF_JFReceive"].ToString(); //수신담당자            
			//bReceptionist = COVIFlowCom.Common.getAuthority(Session["user_code"].ToString(), sJFCode, "");

			bMonitor = COVIFlowCom.Common.getAuthority(Session["user_code"].ToString(), "WFMonitor", "");

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
	/// 사용자가 속한 담당업무 조회
	/// </summary>
	/// <returns></returns>
	public string GetAdditionalBoxes()
	{
		String sAdditionalBoxes = "";
		DataSet oDS = null;
		DataPack INPUT = null;
		try
		{
			//code
			string strWF_JFReceive = System.Web.Configuration.WebConfigurationManager.AppSettings["WF_JFReceive"];
			string sQuery = "dbo.usp_getJFAuth";

			INPUT = new DataPack();
			INPUT.add("@PERSON_CODE", Session["user_code"]);
			INPUT.add("@MSG", Resources.Approval.msg_111);
			INPUT.add("@JF_CODE", strWF_JFReceive);

			oDS = new DataSet();
			using (SqlDacBase SqlDbAgent = new SqlDacBase())
			{
				SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
				oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sQuery, INPUT);
			}
			sAdditionalBoxes = MakeJFList(oDS.GetXml(), "jf");
			strJFCount = oDS.Tables[0].Rows.Count.ToString();
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
		return sAdditionalBoxes;
	}
	/// <summary>
	/// 담당업무데이터 xsl 파일에 의한 목록 만들기
	/// </summary>
	/// <param name="DSXML">담당업무함 data</param>
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
				//oXSLTJF.Load(Server_MapPath("jflist.xsl"));
				oXSLTJF.Load(cbsg.CoviServer_MapPath("jflist.xsl"));
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

	/// <summary>
	/// 사용자 폴더 조회
	/// </summary>
	/// <returns></returns>
	public string GetUserDefinedFolders()
	{
		String sUserFolders = "";
		DataSet ds = null;
		DataPack INPUT = null;
		try
		{
			ds = new DataSet();
			INPUT = new DataPack();

			INPUT.add("@userid", Session["user_code"].ToString());
			INPUT.add("@foldermode", "ALL");
			INPUT.add("@foldername", Resources.Approval.lbl_garbage);
			using (SqlDacBase SqlDbAgent = new SqlDacBase())
			{
				SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
				ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wfform_folder", INPUT);
			}
			if (ds.Tables[0].Rows.Count > 0)
			{
				sUserFolders = MakeUFList(ds.GetXml(), "userfolder");
			}

		}
		catch (System.Exception ex)
		{
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
		return sUserFolders;
	}
	/// <summary>
	/// 부서폴더 조회
	/// </summary>
	/// <returns></returns>
	public string GetUnitDefinedFolders()
	{
		String sUserFolders = "";
		DataSet ds = null;
		DataPack INPUT = null;

		try
		{
			ds = new DataSet();
			INPUT = new DataPack();
			INPUT.add("@userid", Session["user_dept_code"].ToString());
			INPUT.add("@foldermode", "ALL");
			INPUT.add("@foldername", Resources.Approval.lbl_garbage);

			using (SqlDacBase SqlDbAgent = new SqlDacBase())
			{
				SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
				ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wfform_folder", INPUT);
			}
			if (ds.Tables[0].Rows.Count > 0)
			{
				sUserFolders = MakeUFList(ds.GetXml(), "userfolder");
			}

		}
		catch (System.Exception ex)
		{
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
		return sUserFolders;
	}

	/// <summary>
	/// xsl파일에 의한 개인/부서 폴더 목록 변환
	/// </summary>
	/// <param name="DSXML">개인/부서 data</param>
	/// <param name="mode">구분(미사용)</param>
	/// <returns></returns>
	private string MakeUFList(string DSXML, string mode)
	{
		System.IO.StringWriter oTW = null;
		System.Xml.XPath.XPathDocument oXPathDoc = null;
		try
		{
			oTW = new System.IO.StringWriter();
			if (oXSLTUF == null)
			{
				oXSLTUF = new System.Xml.Xsl.XslCompiledTransform();
				{//이준희(2010-10-07): Changed to support SharePoint environment.
				//oXSLTUF.Load(Server_MapPath("userfolderlist.xsl"));
				oXSLTUF.Load(cbsg.CoviServer_MapPath("userfolderlist.xsl"));
				}
			}
			oXPathDoc = new System.Xml.XPath.XPathDocument(new System.IO.StringReader(DSXML));
			oXSLTUF.Transform(oXPathDoc, null, oTW);
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