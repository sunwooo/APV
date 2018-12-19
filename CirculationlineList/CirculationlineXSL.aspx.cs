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
/// 회람 목록 조회 XSL 파일
/// </summary>
public partial class COVIFlowNet_CirculationlineList_CirculationlineXSL : System.Web.UI.Page
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
    }
}
