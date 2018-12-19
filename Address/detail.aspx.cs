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
/// 전자결재 조직도 - 사용자 상세정보
/// </summary>
public partial class COVIFlowNet_Address_detail : PageBase
{
	public string strLangID = ConfigurationManager.AppSettings["LanguageType"];
	public string strLangIndex = "0";
	/// <summary>
    /// <summary>
    /// 전자결재 조직도 - 사용자 상세정보
    /// 다국어 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["user_language"] != null){
            strLangID = Session["user_language"].ToString();
        }
        //다국어 언어설정
        string culturecode = strLangID; //"en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);
    }
}
