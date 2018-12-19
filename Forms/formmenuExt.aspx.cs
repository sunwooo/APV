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

public partial class Approval_Forms_formmenuExt : PageBase // System.Web.UI.Page
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
	public string strLangIndex = "0";
	protected void Page_Load(object sender, EventArgs e)
    {
        string culturecode = strLangID;//다국어 언어설정
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

    }
}
