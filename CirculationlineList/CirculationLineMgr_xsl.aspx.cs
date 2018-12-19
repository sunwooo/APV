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
/// 회람 목록 변환 XSL 파일
/// </summary>
public partial class COVIFlowNet_CirculationlineList_CirculationLineMgr_xsl : System.Web.UI.Page
{
    /// <summary>
    /// 다국어 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        string culturecode = Session["user_language"].ToString();
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

    }
}
