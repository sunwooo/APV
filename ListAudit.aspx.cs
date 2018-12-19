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



/// <summary>
/// 전자결재 감사함(감사권한자 검색 목록)
/// </summary>
namespace COVINet.COVIFlowNet
{
    public partial class ListAudit : PageBase
    {
        private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
		public string strLangIndex = "0";

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
				strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

                Title = Resources.Approval.lbl_doc_person2;
                lbl_Title.Text = Resources.Approval.lbl_subject;
                lbl_Intiator.Text = Resources.Approval.lbl_writer;
                //PageName.Text = Resources.COVIFlowNet.lbl_doc_person2; 20070226
                //PageName2.Text = Resources.COVIFlowNet.lbl_doc_person2;
                PagePath.Text = Resources.Approval.lbl_approval;
                ApvLineView.Text = Resources.Approval.lbl_viewAL;
                DisplayTab.Text = Resources.Approval.lbl_viewtab;
                PageName.Text = Resources.Approval.lbl_monitor;
                PageName2.Text = Resources.Approval.lbl_monitor;

                this.hidQSDATE.Value = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd");
                this.hidQEDATE.Value = DateTime.Now.ToString("yyyy-MM-dd");

           //     btn_reload.Text = Resources.Approval.btn_refresh;
           //     btn_delete.Text = Resources.Approval.btn_delete;
           //     btn_search.Text = Resources.Approval.btn_search;

            }
        }

    }
}
