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
/// 첨부파일 List
/// </summary>
public partial class Approval_ApvInfoList_AttachFileList : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string piid, fiid, culturecode;
	public string strLangIndex = "0";
    protected void Page_Load(object sender, EventArgs e)
    {
        culturecode = strLangID;//다국어 언어설정
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

        //2009.03 : Guid 변경
        piid = Request.QueryString["piid"];
        fiid = Request.QueryString["fiid"];
        if (piid != null && piid.IndexOf("{") > -1) piid = COVIFlowCom.Common.ConvertGuid(piid);
        if (fiid != null && fiid.IndexOf("{") > -1) fiid = COVIFlowCom.Common.ConvertGuid(fiid);

    }
}
