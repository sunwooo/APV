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
/// 결재선 관리 Master 페이지
/// 구성 : 제목영역/ 조직도+검색리스트 | 결재선목록+참조목록+수신목록 /버튼영역
/// </summary>
public partial class COVIFlowNet_ApvlineMgr_ApvLineMgr : System.Web.UI.MasterPage
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string strDeputyType = string.Empty;
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
           culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        //대결설정 표시
        if (System.Configuration.ConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DeputyType"] != null)
        {
            strDeputyType = System.Configuration.ConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DeputyType"].ToString();
        }
        else
        {
            strDeputyType = System.Configuration.ConfigurationManager.AppSettings["Default_DeputyType"].ToString();
        }

        strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);
    }
}
