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

public partial class COVIFlowNet_Doclist_DocListSelect : PageBase
{
    public string strYear, strMonth, strDate, slanguage;
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    //다국어 처리 변수 선언부
    /*
    public string approve_bt_excel,approve_bt_reload,approve_sel_all,approve_tab_ApplicationReceiptList;
    public string approve_tab_DispatchList,approve_tab_DocRegisterList,approve_tab_graphic,approve_tab_list;
    public string approve_tab_OutsideDocRegisterList,approve_tab_OutsideDocRequisitionList,approve_tab_ReceiptList;
    public string DoclistPageName,Month,PagePath,Year;
    */
    public string str_approve_sel_all;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Expires = 0;
        Response.CacheControl = "private";
        Response.Buffer = true;

        slanguage = Session["user_language"].ToString();//20161027추가

        //다국어 언어설정
        string culturecode = strLangID;	//"ko-KR"; "en-US"; "ja-JP";
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

		Title = Resources.Approval.lbl_doclink;

        int i, j;
        strDate = "";
        strYear = DateTime.Now.ToString("yyyy");
        strMonth = DateTime.Now.ToString("MM");

        int nStdYear = int.Parse(System.Configuration.ConfigurationManager.AppSettings["StandardYear"].ToString());

        for (i = nStdYear; i <= DateTime.Now.Year; i++)
        {
            for (j = 1; j <= 12; j++)
            {
                if (strDate != "")
                {
                    strDate = strDate + "/";
                }
                strDate = strDate + i.ToString() + "#" + j.ToString().PadLeft(2, '0');
            }
        }

        //기간 검색을 위해 히든필드에 기본 날짜값 입력(기간 한달)
        this.hidQSDATE.Value = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd");
        this.hidQEDATE.Value = DateTime.Now.ToString("yyyy-MM-dd");
        lbl_Title.Text = Resources.Approval.lbl_subject;
        //lbl_Intiator.Text = Resources.Approval.lbl_writer;
        //lbl_InitUnit.Text = Resources.Approval.lbl_writedept;

    }
}
