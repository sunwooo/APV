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
/// 전자결재 포탈 초기화면 - 구버젼 
/// </summary>
public partial class Approval_Approval_home : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    protected void Page_Load(object sender, EventArgs e)
    {
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

            lbl_Title1.Text = Resources.Approval.lbl_approval;
            lbl_Title2.Text = Resources.Approval.lbl_approval;


        }
    }
}
