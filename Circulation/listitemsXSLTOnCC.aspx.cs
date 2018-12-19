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
/// 회람 목록 변환 xsl 파일
/// </summary>
public partial class COVIFlowNet_Circulation_listitemsXSLTOnCC : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string strLangID = Session["user_language"].ToString();
        //다국어 언어설정
        string culturecode = strLangID; //"en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

    }
}
