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

public partial class COVIFlowNet_listJD : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

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

            //Title = Resources.Approval.lbl_chargedoc;
            lbl_Title.Text = Resources.Approval.lbl_subject;
            lbl_Intiator.Text = Resources.Approval.lbl_writer;
            //PageName.Text = Resources.Approval.lbl_chargedoc;
           // PageName2.Text = Resources.Approval.lbl_chargedoc;
            PagePath.Text = Resources.Approval.lbl_approval;
            ApvLineView.Text = Resources.Approval.lbl_viewAL;

            btn_reload.Text = Resources.Approval.btn_refresh;
            btn_search.Text = Resources.Approval.btn_search;

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
    }
}
