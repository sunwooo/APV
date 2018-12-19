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
/// 결재하기 main Page
/// 구성 : 결재종류 선택 화면 + 결재선 관리 화면
/// </summary>
public partial class COVIFlowNet_ApvProcess_Apvprocess : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    protected void Page_Load(object sender, EventArgs e)
    {
        //다국어 언어설정
        string culturecode = strLangID;
        if (Session["user_language"] != null)
        {
			culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

		Title = Resources.Approval.lbl_approve;
    }
}
