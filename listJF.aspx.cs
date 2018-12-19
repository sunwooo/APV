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
using System.Diagnostics;

/// <summary>
/// 전자결재 담당업무함 목록
/// 2011-04-11 RSS버튼 활성화 기능 추가
/// </summary>
public partial class COVIFlowNet_listJF : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
	//사용자 서명이미지 호출 by 2007.12 for loreal
	public string usit = string.Empty;
    public string strRSSButtonValue = string.Empty; //2011.04.11 추가

    /// <summary>
    /// 담당업무함 목록 조회
    /// 다국어 처리
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
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

            Title = Resources.Approval.lbl_chargedoc;
            lbl_Title.Text = Resources.Approval.lbl_subject;
            lbl_Intiator.Text = Resources.Approval.lbl_writer;
            PageName.Text = Resources.Approval.lbl_chargedoc;
            PageName2.Text = Resources.Approval.lbl_chargedoc;
            PagePath.Text = Resources.Approval.lbl_approval;
            ApvLineView.Text =Resources.Approval.lbl_viewAL;
            DisplayTab.Text = Resources.Approval.lbl_viewtab;

            //btn_reload.Text = Resources.Approval.btn_refresh;           
            //btn_search.Text = Resources.Approval.btn_search;
            //btn_approve.Text = Resources.Approval.btn_approve;
			//사용자 서명이미지 호출 by 2007.12 for loreal
			if (Session["user_code"] != null)
			{
				usit = GetSigninform(Session["user_code"].ToString(), "sign");
			}
            //RSS버튼 활성 여부 2011-04-11추가
            if (System.Web.Configuration.WebConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_RSSButton"] != null)
            {
                strRSSButtonValue = System.Web.Configuration.WebConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_RSSButton"].ToString();
            }
            else
            {
                strRSSButtonValue = System.Web.Configuration.WebConfigurationManager.AppSettings["Default_RSSButton"].ToString();
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
    /// 결재이미지정보 조회
    /// </summary>
    /// <param name="UserID">사용자 id(person code)</param>
    /// <param name="SignType">서명/인장구분</param>
    /// <returns>이미지경로</returns>
	private string GetSigninform(string UserID, string SignType)
	{
        string sSignURL = "/GWStorage/e-sign/ApprovalSign/Backstamp/";//System.Configuration.ConfigurationSettings.AppSettings["BackStorage"].ToString() + 
		string sSignPath = string.Empty;
		{//이준희(2010-10-07): Changed to support SharePoint environment.
		//string sSignPath = Server_MapPath(sSignURL);
		sSignPath = cbsg.CoviServer_MapPath(sSignURL);
		}
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
