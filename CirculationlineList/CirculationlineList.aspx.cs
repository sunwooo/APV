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
/// 개인 회람 그룹 목록 조회
/// 결재선 관리 페이지에서도 수신처 옵션 설정시 활성화 됨
/// </summary>
public partial class COVIFlowNet_CirculationlineList_CirculationlineList : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string UserID;
    public string msg_err_apv, msg_err_apv_delete, msg_err_apv_select;

    /// <summary>
    /// 다국어 설정
    /// 파라미터 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            //code
            //다국어 언어설정
            string culturecode = strLangID;
            if (Session["user_language"] != null)
            {
                culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
            }
            Page.UICulture = culturecode;
            Page.Culture = culturecode;

            //다국어 처리부
            Title = Resources.Approval.lbl_privateapv;

	        ApvlinelistPageName.Text = Resources.Approval.lbl_Circulationline_setup;
            ApvlinelistPagePath.Text = Resources.Approval.lbl_approval;
            ApvlinelistPageName2.Text = Resources.Approval.lbl_Circulationline_setup;

            //btn_register.Text = Resources.Approval.btn_add;
            //btn_modify.Text = Resources.Approval.btn_modify;
            //btn_delete.Text = Resources.Approval.btn_delete;

            msg_err_apv = Resources.Approval.msg_030;
            msg_err_apv_delete = Resources.Approval.msg_032;
            msg_err_apv_select = Resources.Approval.msg_154;
            //다국어 처리부 끝

            Response.Expires = 0;
            Response.CacheControl = "private";
            Response.Buffer = true;
            UserID = Session["user_code"].ToString();
        }
        catch (System.Exception ex)
        {
            throw ex;
        }
        finally
        {
            //code
        }
    }

}
