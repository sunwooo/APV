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
/// Quick 메뉴 사용자컨트롤
/// 현재 사용 안됨
/// </summary>
public partial class Approval_Portal_UXQuickMenu : System.Web.UI.UserControl
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
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
