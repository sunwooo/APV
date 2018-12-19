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
/// 결재 진행/완료현황 조회 - 현재 사용안함
/// </summary>
public partial class COVIFlowNet_ApvMonitor_ApvMonitoring : PageBase
{
    public string strYear, strMonth, strDate;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Expires = 0;
        Response.CacheControl = "private";
        Response.Buffer = true;

        strDate = "";
        strYear = DateTime.Now.Year.ToString();
        strMonth = DateTime.Now.Month.ToString();

        for(int i = 2003; i < int.Parse(strYear); i++)	
		{
            for(int j = 1; j < 12; j++)	
		    {
                if(strDate != "") strDate = strDate + "/";

                strDate = strDate + i.ToString() + "년#" + j.ToString() + "월";
            }
        }
    }
}
