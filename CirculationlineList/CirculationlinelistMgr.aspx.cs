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
/// 개인 회람그룹 관리 Main 페이지
/// 구성 : 개인회람그룹 이름 + 회람그룹 관리 화면
/// </summary>
public partial class COVIFlowNet_CirculationlineList_CirculationlinelistMgr : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string msg_err_apv_agree, msg_err_apv_line, msg_err_apv_line_last, msg_err_apv_subject;

    /// <summary>
    /// 다국어 설정
    /// 파라미터 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {

        //다국어 언어설정
        string culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        //btExit.Text = Resources.Approval.btn_close;
        //btOK.Text = Resources.Approval.btn_save;
        //msg_txt_apvline_first_comment.Text = Resources.Approval.msg_091;
        //msg_txt_apvline_comment.Text = Resources.Approval.lbl_apvline_summary;
        //msg_txt_apvline_name.Text = Resources.Approval.lbl_apvline_name;
	    msg_txt_Circulationline_desc.Text = Resources.Approval.lbl_desc;
        msg_txt_Circulationline_name.Text = Resources.Approval.lbl_Circulationline_name;

		Title = Resources.Approval.lbl_Circulationline_setup;
        //ApvlinelistMgrPageName.Text = Resources.Approval.btn_apvline;
	    //CirculationlinelistMgrPageName.Text = Resources.Approval.lbl_Circulationline_setup;

        msg_err_apv_agree = Resources.Approval.msg_052;
        msg_err_apv_line = Resources.Approval.msg_003;
        msg_err_apv_line_last = Resources.Approval.msg_058;
        msg_err_apv_subject = Resources.Approval.msg_277;
    }
}
