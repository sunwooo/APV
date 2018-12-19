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
///  listitems.js case "1" : 등록대장 용 XSL 템플릿
/// </summary>
public partial class COVIFlowNet_Doclist_regdoclistXSL : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //다국어 언어설정
        string culturecode = ConfigurationManager.AppSettings["LanguageType"];
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }

        Page.UICulture = culturecode;
        Page.Culture = culturecode;
    }
}
