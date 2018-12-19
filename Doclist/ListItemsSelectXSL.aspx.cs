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

public partial class Approval_Doclist_ListItemsSelectXSL : System.Web.UI.Page
{
    public string culturecode = "ko-KR";
    protected void Page_Load(object sender, EventArgs e)
    {

        //20080123 liyahn_ 다국어 언어설정 추가
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
    }
}
