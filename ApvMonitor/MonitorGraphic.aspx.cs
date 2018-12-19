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
/// 결재선 그래픽(아이콘) 조회 페이지
/// </summary>
public partial class COVIFlowNet_ApvMonitor_MonitorGraphic : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
	public string strLangIndex = "0";
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
          culturecode =  Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

    }
}
