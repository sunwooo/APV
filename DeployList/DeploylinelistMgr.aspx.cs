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
/// 배포그룹 설정시 배포그룹 이름, 설명 입력하는 페이지
/// </summary>
public partial class DeployList_DeploylinelistMgr : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string msg_err_apv_agree, msg_err_apv_line, msg_err_apv_line_last, msg_err_apv_subject;
    public string titleName; //20161017 중국어 추가
    public string language; //20161017 중국어 추가

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            //다국어 언어설정
            string culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
            language = Session["user_language"].ToString();
            Page.UICulture = culturecode;
            Page.Culture = culturecode;
            msg_txt_Deployline_name.Text = Resources.Approval.lbl_Deployline_name;
            msg_txt_Deployline_desc.Text = Resources.Approval.lbl_desc;
			msg_err_apv_line = Resources.Approval.msg_003;
            msg_err_apv_line_last = Resources.Approval.msg_058;
            msg_err_apv_subject = Resources.Approval.msg_278;

            //20161017 중국어 추가
            if (culturecode == "zh-CN")
            {
                titleName = "分布集团设置";
            }
            else
            {
                titleName = "배포그룹 설정";
            }
            //20161017 중국어 추가 끝

        }
        catch (Exception ex)
        {
            HandleException(ex);
        }
    }
    private void HandleException(System.Exception _Ex)
    {
        try
        {

            Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)) + "]]></error>");
        }
        catch (System.Exception Ex)
        {
            Response.Write("<error><![CDATA[" + Ex.Message + "]]></error>");
        }
    }
}
