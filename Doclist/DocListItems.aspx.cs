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
/// 문서대장 실제 목록
/// </summary>
public partial class COVIFlowNet_Doclist_DocListItems : PageBase
{
    //Public uid, strdept, strpage, strDocListType, strMonth, strSort As System.String
    public string uid, strdept, strpage, strDocListType, strMonth, strSort,sDept;
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;
        uid = Convert.ToString(Request.QueryString["uid"]);
        
        if (uid == "")
        {
            uid = Session["user_code"].ToString();
        }

        if (Session["user_dept_code"].ToString() == Session["user_parent_dept_code"].ToString())
        {
            strdept = Session["user_dept_code"].ToString();
        }else{
            strdept = Session["user_parent_dept_code"].ToString();
        }
        
        
        strpage = Request.QueryString["page"];
        
        if (strpage=="")
        {
            strpage = "1";
        }
        
        strDocListType = Request.QueryString["doclisttype"];
        
        strMonth = Request.QueryString["strMonth"];
        
        if (strMonth == "")
        {
            strMonth = DateTime.Now.Year.ToString();
        }
        else
        {
            //if (strMonth.Length > 4)
            //{
            //    strMonth = strMonth.Substring(0, 4) + "-" + strMonth.Substring(strMonth.Length - 3, strMonth.Length - 1);
            //}
            //else
            //{
            //    strMonth = strMonth.Substring(0, 4);
            //}
            //strMonth = strMonth.Substring(0, 4);
            //strMonth = strMonth;

        }
        strSort = "registerd_date";

        if (strDocListType == "5" || strDocListType == "10" || strDocListType == "11" || strDocListType == "12")
        {
            sDept=Session["user_ent_code"].ToString();
        }
        else
        {
            sDept = strdept;
        }
        
   }
}
