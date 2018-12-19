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
/// 결재문서작성 조회(리스트) 페이지
/// </summary>
public partial class COVIFlowNet_Formlist_FormList : PageBase
{

	public string msg_err_apv = string.Empty;
    public string user_dppathid = string.Empty;
    public string gAdminSysTotal = String.Empty;
    /*[2013-12-10] PSW 추가 */
    public string sformName = String.Empty;

	protected void Page_Load(object sender, EventArgs e)
	{
        /*[2013-12-10] PSW 추가 */
        sformName = Request.QueryString["searchFormName"];

		//다국어 언어설정
		string culturecode = ConfigurationManager.AppSettings["LanguageType"];
		if ( Session["user_language"] != null){
			culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
		}
		Page.UICulture = culturecode;
		Page.Culture = culturecode;
		Title = Resources.Approval.lbl_write;
		msg_err_apv = Resources.Approval.msg_030;

        gAdminSysTotal = Sessions.ADMIN_SYSTOTAL;   //전체시스템관리자
        user_dppathid = pReplaceSpecialCharacter(Session["user_dept_fullcode"].ToString());
	}

    /// <summary>
    /// 특수문자 변환
    /// </summary>
    /// <param name="strContent">Content 원문</param>
    /// <returns>string</returns>
    private string pReplaceSpecialCharacter(string strContent)
    {
        //Response.Write("<script>alert('" + strContent + "');</script>");
        if (strContent != null)
        {
            //Response.Write("<script>alert('" + strContent + "');</script>");
            strContent = strContent.Replace("\\", "\\\\");
            strContent = strContent.Replace("\r\n", "\\r\\n");
            strContent = strContent.Replace("\n", "\\n");
            strContent = strContent.Replace("'", "\\'");
            //Response.Write("<script>alert('" + strContent + "');</script>");
        }
        return strContent;
    }
}
