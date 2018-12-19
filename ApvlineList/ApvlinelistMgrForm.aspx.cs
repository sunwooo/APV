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



public partial class COVIFlowNet_ApvlineList_ApvlinelistMgrForm : PageBase
{
    //현재 파일은 원래 htm이나 다국어 처리를 위하여 
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string msg_err_apv_agree, msg_err_apv_line, msg_err_apv_line_last, msg_err_apv_subject;

    protected void Page_Load(object sender, EventArgs e)
    {
        //다국어 언어설정
        if (Session["user_language"] != null)
        {
            strLangID = Session["user_language"].ToString();
        }
        //다국어 언어설정
        string culturecode = strLangID; //"en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        btExit.Text = Resources.Approval.btn_close;
        btOK.Text = Resources.Approval.btn_save;
		btDelete.Text = Resources.Approval.btn_delete;
        //msg_txt_apvline_first_comment.Text = Resources.Approval.msg_091;
        //msg_txt_apvline_comment.Text = Resources.Approval.lbl_apvline_summary;
        //msg_txt_apvline_name.Text = Resources.Approval.lbl_apvline_name;

        Title = Resources.Approval.lbl_doc_privateapv;
        //ApvlinelistMgrPageName.Text = Resources.Approval.btn_apvline;

        msg_err_apv_agree = Resources.Approval.msg_052;
        msg_err_apv_line = Resources.Approval.msg_029;
        msg_err_apv_line_last = Resources.Approval.msg_058;
        msg_err_apv_subject = Resources.Approval.msg_028;
    }
}
