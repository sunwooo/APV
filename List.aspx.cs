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
using System.Diagnostics;

/// <summary>
/// 개인결재함 목록 페이지
/// 2011-04-11 RSS버튼 활성화 기능 추가
/// </summary>
namespace COVINet.COVIFlowNet
{
    public partial class List : PageBase
    {
        public string strLangID = ConfigurationManager.AppSettings["LanguageType"];
		//사용자 서명이미지 호출 by 2007.12 for loreal
		public string usit = string.Empty;
        public string strDeleteButtonValue = string.Empty;
        public string strRSSButtonValue = string.Empty; //2011.04.11 추가
        public string strYear, strMonth, strDate; //2011.04.07 추가
        public string gEntCode = String.Empty;  
		public string strPersonCode = string.Empty;
		
		
		protected void Page_Load(object sender, EventArgs e)
        {
            string str_L_Year = "", str_L_Month = ""; //2011.04.07 추가

            #region PerformanceLog 처리를 위한 Stopwatch 설정
            Stopwatch stopwatch = null;
            if (sPerformanceYN == "True")
            {
                stopwatch = new Stopwatch();
                stopwatch.Start();
            }
            #endregion

			//2019-10-14 사용자ID 추가 PSW
			strPersonCode = Sessions.PERSON_CODE;

            if (!IsPostBack)
            {
                if (Session["user_language"] != null){
                    strLangID = Session["user_language"].ToString();
                }
                //다국어 언어설정
                string culturecode = strLangID; //"en-US"; "ja-JP";
                Page.UICulture = culturecode;
                Page.Culture = culturecode;

                gEntCode = Sessions.USER_ENT_CODE;
                Title = Resources.Approval.lbl_doc_person2;
                PageName.Text = Resources.Approval.lbl_doc_person2;
                PageName2.Text = Resources.Approval.lbl_doc_person2;
                PagePath.Text = Resources.Approval.lbl_approval;
                ApvLineView.Text = Resources.Approval.lbl_viewAL;
                DisplayTab.Text = Resources.Approval.lbl_viewtab;

                //btn_reload.Text = Resources.Approval.btn_refresh;
                //btn_delete.Text = Resources.Approval.btn_delete;
                //btn_search.TexTet = Resources.Approval.btn_search;
		        //btn_approve.xt = Resources.Approval.btn_approve;
                //2011.04.07 추가 시작
                str_L_Year = Resources.Approval.lbl_year;
                str_L_Month = Resources.Approval.lbl_month;
                //2011.04.07 추가끝
				//사용자 서명이미지 호출 by 2007.12 for loreal
				if (Session["user_code"] != null)
				{
					usit = GetSigninform(Session["user_code"].ToString(), "sign");
				}
                //기간 검색을 위해 히든필드에 기본 날짜값 입력(기간 한달)
                this.hidQSDATE.Value = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd");
                this.hidQEDATE.Value = DateTime.Now.ToString("yyyy-MM-dd");
                //삭제버튼 활성 여부
                if (System.Web.Configuration.WebConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DeleteButton"] != null)
                {
                    strDeleteButtonValue = System.Web.Configuration.WebConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DeleteButton"].ToString();
                }
                else
                {
                    strDeleteButtonValue = System.Web.Configuration.WebConfigurationManager.AppSettings["Default_DeleteButton"].ToString();
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
            //2011.04.07 추가 시작
            int i, j;
            strDate = "";
            strYear = DateTime.Now.Year.ToString();
            strMonth = DateTime.Now.Month.ToString();
            for (i = 2002; i <= Convert.ToInt32(strYear); i++)
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
            //2011.04.07 추가 끝

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
        /// <remarks>사용자 서명이미지 호출 by 2007.12 for loreal</remarks>
        /// <param name="UserID">사용자 id(person code)</param>
        /// <param name="SignType">서명/인장 구분</param>
        /// <returns>서명이미지경로</returns>
		private string GetSigninform(string UserID, string SignType)
		{
            string sSignURL = "/GWStorage/e-sign/ApprovalSign/Backstamp/";
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
}
