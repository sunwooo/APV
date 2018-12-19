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

public partial class COVIFlowNet_ApvlineList_DeployListPopup : PageBase
{
    public String UserID;
    public String GroupID;
	public String strLangID;
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        //다국어 언어설정
        string culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
		strLangID = culturecode;
		Title = Resources.Approval.lbl_DistributeList;
        UserID = Session["user_code"].ToString();
        GroupID = Request.QueryString["GroupID"].ToString();
    }
}