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
/// 전자결재 초기화면 
/// </summary>
public partial class AppMaster : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        SetMenu("148", "149", "");

    }
}
