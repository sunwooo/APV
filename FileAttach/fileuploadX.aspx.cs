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

public partial class Approval_FileAttach_fileuploadX : PageBase
{
    public string user_code;
    public string FrontPath;
    public string strUserName;
    public string strUserDeptName;
    protected void Page_Load(object sender, EventArgs e)
    {
        user_code = Session["user_code"].ToString();
        FrontPath = System.Configuration.ConfigurationSettings.AppSettings["FrontStorage"].ToString();
        strUserName = Session["user_name"].ToString();
        strUserDeptName = Sessions.USER_DEPT_NAME.ToString();
    }

}