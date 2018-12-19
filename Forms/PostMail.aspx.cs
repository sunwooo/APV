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
/// "전자메일발송" 버튼기능
/// </summary>
public partial class Approval_Forms_PostMail : PageBase
{
    public string User_id;    
    protected void Page_Load(object sender, EventArgs e)
    {
        string user_code = Session["user_code"].ToString();
        User_id = Base64Encode(user_code);
    }


    protected string Base64Encode(string str)
    {
        return Convert.ToBase64String(
          System.Text.Encoding.GetEncoding(0).GetBytes(str));
    }

    protected string Base64Decode(string str)
    {
        return System.Text.Encoding.GetEncoding(0).GetString(
          System.Convert.FromBase64String(str));
    }


}
