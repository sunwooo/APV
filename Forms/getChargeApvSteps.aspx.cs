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
/// 재기안이나 수신결재할 때 결재선에 재기안자 정보가 없을 경우 생성해 주는 페이지
/// </summary>
public partial class COVIFlowNet_Forms_getChargeApvSteps : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {       
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        Response.Write("<?xml version='1.0' encoding='utf-8'?>");
        Response.Write("<person ");

        try
        {
            Response.Write("  code='" + Session["user_code"] + "'");
            Response.Write("  name='" + Session["user_name"] + "'");
            Response.Write("  position='" + Session["user_jobposition_code"] + ";" + Session["user_jobposition_name"] + "'");
            Response.Write("  title='" + Session["user_jobtitle_code"] + ";" + Session["user_jobtitle_name"] + "'");
            Response.Write("  level='" + Session["user_joblevel_code"] + ";" + Session["user_joblevel_name"] + "'");
            Response.Write("  oucode='" + Session["user_dept_code"] + "'");
            Response.Write("  ouname='" + Session["user_dept_name"] + "' ");
            Response.Write("  sipaddress='" + Session["user_sipaddress"] + "'>");
            Response.Write("  <taskinfo ");
            Response.Write("  status='inactive'");
            Response.Write("  result='inactive'");
            Response.Write("  kind='charge'");
            Response.Write("  visible='n' />");
        }
        catch(System.Exception Ex)
        {
            Response.Write("><error><![CDATA[" + Ex.Message + "]]></error>");
        }
        finally
        {
            Response.Write("</person>");
        }
    }
}
