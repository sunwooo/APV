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
/// 의견 조회 - 결재선 목록에서 의견보기 클릭 시 오픈 됨
/// </summary>
public partial class COVIFlowNet_ApvlineMgr_comment : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    /// <summary>
    /// 다국어 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        //Language
        string culturecode = strLangID;
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
		Title = Resources.Approval.lbl_viewopinion;
    }
}
