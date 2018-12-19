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

using Covision.Framework.Data.Business;
using Covision.Framework;
using System.Diagnostics;

/// <summary>
/// 전자결재 부서함 목록
/// </summary>
public partial class COVIFlowNet_listDept : PageBase
{
	private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
	public string Label1, Label2, Label3, Label4, Label5, Label6;
	public string sel_Label1, sel_Label2, sel_Label3, sel_Label4, sel_Label5, sel_Label6;
	public string box_Label1, box_Label2;	
	public string strYear, strMonth, strDate;
    public string strDeptListButton;
    public string span_userfoldermove, span_unitfoldermove;
    public string strFolderDelYN = ConfigurationManager.AppSettings["Default_folderDelYN"];
    public string strDeptList = ConfigurationManager.AppSettings["Default_DeptList"];
    public Boolean bAuditDept = false;      // 감사부서여부
    public string strUsismanager;
    public string strUsisdocmanager;
    public string strDpisdocmanager;
    //사용자 서명이미지 호출 by 2007.12 for loreal
    public string usit = string.Empty;


	protected void Page_Load(object sender, EventArgs e)
	{
        #region PerformanceLog 처리를 위한 Stopwatch 설정
        Stopwatch stopwatch = null;
        if (sPerformanceYN == "True")
        {
            stopwatch = new Stopwatch();
            stopwatch.Start();
        }
        #endregion

        string str_L_Year = "", str_L_Month = "";
		//Language
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

			Title = Resources.Approval.lbl_doc_dept2;
			lbl_Title.Text = Resources.Approval.lbl_subject;
			lbl_Intiator.Text = Resources.Approval.lbl_writer;
			PageName.Text = Resources.Approval.lbl_doc_dept2;
			PageName2.Text = Resources.Approval.lbl_doc_dept2;
			PagePath.Text = Resources.Approval.lbl_approval;
			ApvLineView.Text = Resources.Approval.lbl_viewAL;
			DisplayTab.Text = Resources.Approval.lbl_viewtab;

			//btn_reload.Text = Resources.Approval.btn_refresh;
			//btn_delete.Text = Resources.Approval.btn_delete;
			//btn_search.Text = Resources.Approval.btn_search;

			str_L_Year = Resources.Approval.lbl_year;
			str_L_Month = Resources.Approval.lbl_month;
            //버튼 활성화유무
            if (ConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DeptListButton"] != null)
            {
                strDeptListButton = ConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DeptListButton"].ToString();
            }
            else
            {
                strDeptListButton = ConfigurationManager.AppSettings["Default_DeptListButton"].ToString();
            }
            //폴더이동옵션에 따른 설정
            //폴더 추가 시 데이터 삭제 여부 설정
            string strKey = Session["user_ent_code"].ToString() + "_" + "folderDelYN";
            if (ConfigurationManager.AppSettings[strKey] != null)
            {
                strFolderDelYN = ConfigurationManager.AppSettings[strKey].ToString();
            }
            //부서폴더 활성화유무
            if (ConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DeptList"] != null)
            {
                strDeptList = ConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DeptList"].ToString();
            }
            else
            {
                strDeptList = ConfigurationManager.AppSettings["Default_DeptList"].ToString();
            }

            //기간 검색을 위해 히든필드에 기본 날짜값 입력(기간 한달)
            this.hidQSDATE.Value = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd");
            this.hidQEDATE.Value = DateTime.Now.ToString("yyyy-MM-dd");

            //부서함일 경우 사용자폴더이동은 복사, 부서폴더이동은 옵션대로 처리
            if(strFolderDelYN.Substring(1) == "0"){
                span_unitfoldermove = Resources.Approval.btn_unitfoldermove;
            }else{
                span_unitfoldermove = Resources.Approval.btn_unitfoldercopy;
            }
            span_userfoldermove = Resources.Approval.btn_userfoldermove;

            #region 감사할문서함 권한 체크
            string strdeptid = Session["user_dept_code"].ToString();
            string strcmpdeptid = ";" + System.Web.Configuration.WebConfigurationManager.AppSettings["WF_AUDITOUs"].ToString();
            if (strcmpdeptid.IndexOf(strdeptid) > -1)
            {
                bAuditDept = true;
            }
            #endregion
            GetDocmanager();
            if (Session["user_code"] != null)
            {
                usit = GetSigninform(Session["user_code"].ToString(), "sign");
            }
		}
		int i, j;
		strDate = "";
		strYear = DateTime.Now.Year.ToString();
		strMonth = DateTime.Now.Month.ToString();
		for (i = 2005; i <= Convert.ToInt32(strYear); i++)
		{
			for (j = 1; j <= 12; j++)
			{
				if (strDate != "")
				{
					strDate = strDate + "/";
				}
				strDate = strDate + i.ToString() + str_L_Year + "#" + j.ToString() + str_L_Month;
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
    
    /// <summary>
    /// 문서관리자/부서 내 문서관리자 여부 추출
    /// </summary>
    /// <returns></returns>
    public void GetDocmanager()
    {
        #region 200807 추가 시작 : 우리금융

        string strEnt = Session["user_ent_code"].ToString();

        string sJFCode = System.Web.Configuration.WebConfigurationManager.AppSettings["WF_JFReceive"].ToString(); ; //수신담당자            
        //문서관리자여부
        strUsisdocmanager = COVIFlowCom.Common.getAuthority(Session["user_code"].ToString(), sJFCode, "").ToString().ToLower();
        strUsismanager = Sessions.ISMANAGER.ToString();
        strDpisdocmanager = COVIFlowCom.Common.getDocmanager(Sessions.USER_ENT_CODE.ToString(), Sessions.USER_DEPT_CODE.ToString(), sJFCode).ToString().ToLower();
        #endregion
    }

    /// <summary>
    /// 결재이미지정보 조회
    /// </summary>
    /// <param name="UserID">사용자 id(person code)</param>
    /// <param name="SignType">서명/인장구분</param>
    /// <returns>이미지경로</returns>
    private string GetSigninform(string UserID, string SignType)
    {
        string sSignURL = "/GWStorage/e-sign/ApprovalSign/Backstamp/";//System.Configuration.ConfigurationSettings.AppSettings["BackStorage"].ToString() + 
        string sSignPath = Server.MapPath(sSignURL);
        Covi.FileSystemNet oFS = new Covi.FileSystemNet();

        string[] fileEntries = oFS.fnSearchDirectory(sSignPath, SignType + "_" + UserID + "_*.*");
        string fileName = String.Empty;
        try
        {
            if (fileEntries.Length > 0)
            {
                fileName = fileEntries[fileEntries.Length - 1].Substring(fileEntries[fileEntries.Length - 1].LastIndexOf("\\") + 1);
            }
        }
        catch (System.Exception Ex)
        {
            throw new System.Exception("GetApvImage", Ex);
        }
        finally
        {
            oFS = null;
        }
        return fileName;
    }
}
