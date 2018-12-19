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
/// 전자결재 홈 화면에서 하단 미결함/부서수신함 목록 내 데이터 출력 페이지
/// 홈 화면 변경으로 현재는 사용 안됨
/// </summary>
public partial class COVIFlowNet_Portal_portallistitems : PageBase
{

    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string uid, strlocation, strlocationmode, strpage, strkind, strtitle, strlabel, strDept, strOrder, strpi_state, strwi_state;
    public string strYear, strMonth, strDate;

    /// <summary>
    /// 파라미터 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        uid = Request.QueryString["uid"];

        if (uid == "") uid = Session["user_code"].ToString();

        

        try
        {
            strlocation = Request.QueryString["location"];
            strlocationmode = Request.QueryString["mode"];
            strpage = Request.QueryString["page"];
            strkind = Request.QueryString["kind"];
            strtitle = Request.QueryString["title"];
            strlabel = Request.QueryString["label"];
            strDept = Session["user_dept_code"].ToString();

            if (strlocation == "APPROVAL")
            {
                strOrder = "PI_STARTED";
                DataSet rsDeputy = new DataSet();
                //string sDeputy = "";
            }
            else if (strlocation == "REJECT")
            {
                strOrder = "PI_STARTED";
            }
            else if (strlocation == "COMPLETE")
            {
                strOrder = "PI_FINISHED";
            }
            else if (strlocation == "PROCESS")
            {
                strOrder = "WI_FINISHED";
            }
            else if (strlocation == "DEPART")
            {
                strOrder = "PI_STARTED";
            }
        }
        catch (System.Exception ex)
        {
            
            throw ex;
        }

        strDate = "";
        strYear = DateTime.Now.Year.ToString();
        strMonth = DateTime.Now.Month.ToString();

        for (int i = 2003; i < int.Parse(strYear); i++)
        {
            for (int j = 1; j < 12; j++)
            {
                if (strDate != "") strDate = strDate + "/";

                strDate = strDate + i.ToString() + Resources.Approval.lbl_year+"#" + j.ToString() + Resources.Approval.lbl_month;
            }
        }
    }
}
