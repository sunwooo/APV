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
/// 개인결재선 가져오기
/// 조건 : 결재무서 결재선 출력형태 == Section Type && 수신자사용==0 && 수신부서사용 == 0 && 배포사용 == 0 일떄
/// </summary>
public partial class Approval_Forms_PrivateLineList : PageBase
{
    public string UserID;
    protected void Page_Load(object sender, EventArgs e)
    {
	    Response.Expires=-1;
        Response.CacheControl = "no-cache";

        Response.Buffer = true;

        UserID = Session["user_code"].ToString();
        Title = System.Configuration.ConfigurationManager.AppSettings["AppName"];

    }
}
