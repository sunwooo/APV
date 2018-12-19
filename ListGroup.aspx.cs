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

public partial class COVIFlowNet_ListGroup : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string gKind, UserID, Location, Mode, sEntcode;
	public string strLangIndex = "0";

    /// <summary>
    /// 결재함 그루핑 목록
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        UserID = Request.QueryString["uid"];
        Location = Request.QueryString["location"];
		Mode = Request.QueryString["mode"];
        gKind = Request.QueryString["kind"];
        sEntcode = Request.QueryString["entcode"];
        //code
        if (Session["user_language"] != null)
        {
            strLangID = Session["user_language"].ToString();
        }
        //다국어 언어설정
        string culturecode = strLangID; //"en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

    }
}
