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
/// 기안 의견 입력 Page
/// 회수/기안취소/승인취소 의견 입력도 수행함
/// </summary>
public partial class COVIFlowNet_ApvProcess_ApvProcessDraft : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    /// <summary>
    /// 다국어 설정
    /// 파라미터 처리
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        //Language
        string culturecode = strLangID;
        string FMPF = string.Empty;
        

        if (Session["user_language"] != null)
        {
			culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
        string  scmttype = Request.QueryString["type"].ToString();
        //title 설정
        //instruction 설정
        switch (scmttype)
        {
            case "DRAFT":
                Title = Resources.Approval.btn_draft;

                break;
            case "CHANGEAPV":	//	결재선변경
                Title = Resources.Approval.btn_apvline;// "결재선변경";
                break;
            case "BYPASS":	//	현결재자후열
                Title = Resources.Approval.lbl_bypass;
                break;
            case "CHARGE":
                Title = Resources.Approval.btn_charge;// "담당자지정";
                break;
            case "RECREATE":

                if (Request.QueryString["fmpf"] != null)
                {
                    FMPF = Request.QueryString["fmpf"].ToString();
                    
                }
                if (FMPF == "WF_SLIP")
                {
                    string GBNNO = Request.QueryString["gbnno"].ToString();
                    string ENTCODE = Request.QueryString["entcode"].ToString();
                    string RECIVECODE = Request.QueryString["recivecode"].ToString();
                    string FIID = Request.QueryString["FIID"].ToString();
                    Title = Resources.Approval.btn_redraft;// "재기안";
                    FormWS ws = new FormWS();
                    ws.ExecuteLegacySLIP(FMPF, GBNNO, ENTCODE, RECIVECODE, FIID);

                }
                else
                {
                    Title = Resources.Approval.btn_redraft;// "재기안";
                }
                //Title = Resources.Approval.btn_redraft;// "재기안";
                break;
            case "APPROVE":
                Title = Resources.Approval.btn_apv;// "승인하기";
                break;
            case "ITRANS":
                Title = "시행문변환";
                break;
            case "OTRANS":
                Title = "대외공문변환";
                break;
            case "SIGN":
                Title = "직인처리";
                break;
            case "TEMPSAVE":
                Title = "임시저장";
                break;
            case "WITHDRAW":
                Title = Resources.Approval.btn_Withdraw;// "결재문서 취소";
                break;
            case "ABORT":
                Title = Resources.Approval.btn_Withdraw;// "결재문서 취소";
                break;
            case "APPROVECANCEL":
                Title = Resources.Approval.btn_approve_cancel;// "승인 취소";
                break;
            case "MONITOR":
                Title = "결재문서 확인";
                break;
            default:
                Title = Resources.Approval.btn_draft; //"기안하기";
                break;
        }


    }
}

