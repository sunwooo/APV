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

namespace COVINet.COVIFlowNet
{
    /// <summary>
    /// 감사권한자에 의한 감사대상자 결재함 조회 페이지
    /// 현재 사용하지 않음
    /// </summary>
    public partial class ListMonitor : PageBase
    {
        private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

        /// <summary>
        /// 감사권한자에 의한 감사대상자 결재함 조회
        /// 다국어 처리
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Page_Load(object sender, EventArgs e)
        {
            
            if (!IsPostBack)
            {
                if (Session["user_language"] != null){
                    strLangID = Session["user_language"].ToString();
                }
                //다국어 언어설정
                string culturecode = strLangID; //"en-US"; "ja-JP";
                Page.UICulture = culturecode;
                Page.Culture = culturecode;

                Title = Resources.Approval.lbl_doc_person2;
                lbl_Title.Text = Resources.Approval.lbl_subject;
                lbl_Intiator.Text = Resources.Approval.lbl_writer;
                //PageName.Text = Resources.COVIFlowNet.lbl_doc_person2; 20070226
                //PageName2.Text = Resources.COVIFlowNet.lbl_doc_person2;
                PagePath.Text = Resources.Approval.lbl_approval;
                ApvLineView.Text = Resources.Approval.lbl_viewAL;

                btn_reload.Text = Resources.Approval.btn_refresh;
                btn_delete.Text = Resources.Approval.btn_delete;
                btn_search.Text = Resources.Approval.btn_search;

            }
        }

                
    }
}
