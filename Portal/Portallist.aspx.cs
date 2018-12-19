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
/// 전자결재 홈 화면에서 하단 미결함/부서수신함 목록 출력 페이지
/// 홈 화면 변경으로 현재는 사용 안됨
/// </summary>
public partial class COVIFlowNet_Portallist : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    /// <summary>
    /// 다국어 설정
    /// 파라미터에 따른 Title 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {

        if (!IsPostBack)
        {
            if (Session["user_language"] != null)
            {
                strLangID = Session["user_language"].ToString();
            }
            //다국어 언어설정
            string culturecode = strLangID; //"en-US"; "ja-JP";
            Page.UICulture = culturecode;
            Page.Culture = culturecode;


            if (Request.QueryString["location"] == "APPROVAL")
            {
                strSubject.Text = Resources.Approval.lbl_doc_approve2;
            }
            else
            {
                strSubject.Text = Resources.Approval.lbl_dept_receive;
            }
        }
    }
}
