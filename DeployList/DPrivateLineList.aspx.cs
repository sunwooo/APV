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
/// 결재선관리-개인수신처탭 페이지
/// </summary>
public partial class DeployList_DPrivateLineList : PageBase
{
    public string UserID;
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            Response.Expires = -1;
            Response.CacheControl = "no-cache";

            Response.Buffer = true;

            UserID = Session["user_code"].ToString();
        }
        catch (Exception ex)
        {
            HandleException(ex);
        }
    }
    private void HandleException(System.Exception _Ex)
    {
        try
        {

            Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)) + "]]></error>");
        }
        catch (System.Exception Ex)
        {
            Response.Write("<error><![CDATA[" + Ex.Message + "]]></error>");
        }
    }
}
