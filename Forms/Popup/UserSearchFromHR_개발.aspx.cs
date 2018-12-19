using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;




public partial class Approval_Forms_Popup_UserSearchFromHR : PageBase
{
    public string gKind = String.Empty;
    public string gDataRowNo = String.Empty;
    

    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.QueryString["kind"] != null && Request.QueryString["kind"] != "") gKind = Request.QueryString["kind"];

        if (Request.QueryString["DataRowNo"] != null && Request.QueryString["DataRowNo"] != "") gDataRowNo = Request.QueryString["DataRowNo"];
    } 
        
}