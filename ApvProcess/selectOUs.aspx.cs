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
/// 합의부서 삭제 시 대상부서 선택 화면
/// </summary>
public partial class ApvProcess_selectOUs : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string strLangIndex = "0";

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

        Title = Resources.Approval.lbl_delete_assistous;
        strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);
    }
}
