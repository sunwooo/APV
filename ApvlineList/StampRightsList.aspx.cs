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

using Covision.Framework.Data.Business;
using Covision.Framework;

public partial class Approval_ApvlineList_StampRightsList : PageBase
{
    public string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    protected void Page_Load(object sender, EventArgs e)
    {
        string culturecode = strLangID;//다국어 언어설정
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();//"ko-KR" "en-US" "ja-JP" "zh-CN"
        }
        strLangID = culturecode;
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        
    }
}