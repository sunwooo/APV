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
/// 특정사용자 개인회람그룹 조회
/// </summary>
public partial class COVIFlowNet_CirculationlineList_CPrivateLineList : System.Web.UI.Page
{
    public string UserID;
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Expires = -1;
        Response.CacheControl = "no-cache";

        Response.Buffer = true;

        UserID = Session["user_code"].ToString();

    }
}
