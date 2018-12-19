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
/// 사용자 ContextMenu 기본 페이지
/// 옵션에 따른 메뉴 활성화
/// 사용자 정보/쪽지 보내기/메신저 연결/메일 보내기
/// 쪽지/메신저/메일은 회사 기본제품이 아닌 3rd part 제품 연결상태임
/// </summary>
public partial class Approval_Portal_HTML_ContextMenu : System.Web.UI.Page
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    /// <summary>
    /// 다국어 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        //다국어 언어설정
        if (Session["user_language"] != null)
        {
            strLangID = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        string culturecode = strLangID;	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

    }
}
