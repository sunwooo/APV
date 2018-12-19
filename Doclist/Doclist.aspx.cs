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
/// 문서대장 List
/// </summary>
public partial class COVIFlowNet_Doclist_Doclist : PageBase
{
    public  string strYear, strMonth, strDate;
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    
    //다국어 처리 변수 선언부
    /*
    public string approve_bt_excel,approve_bt_reload,approve_sel_all,approve_tab_ApplicationReceiptList;
    public string approve_tab_DispatchList,approve_tab_DocRegisterList,approve_tab_graphic,approve_tab_list;
    public string approve_tab_OutsideDocRegisterList,approve_tab_OutsideDocRequisitionList,approve_tab_ReceiptList;
    public string DoclistPageName,Month,PagePath,Year;
    */
    public string str_approve_sel_all;
    public string strDocListValue;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Expires = 0;
        Response.CacheControl = "private";
        Response.Buffer = true;

        
        //다국어 언어설정
        string culturecode = strLangID;	//"ko-KR"; "en-US"; "ja-JP";
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        DoclistPageName.Text = Resources.Approval.lbl_doc_list;
        DoclistPageName2.Text = Resources.Approval.lbl_doc_list;

        PagePath.Text = Resources.Approval.lbl_approval;
        str_approve_sel_all = Resources.Approval.lbl_total;

        DisplayTab.Text = Resources.Approval.lbl_viewtab;
        //approve_bt_reload.Text = Resources.Approval.btn_refresh;
        //approve_bt_excel.Text = Resources.Approval.lbl_SaveToExcel;
        if (System.Web.Configuration.WebConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DocList"] != null)
        {
            strDocListValue = System.Web.Configuration.WebConfigurationManager.AppSettings[Session["user_ent_code"].ToString() + "_DocList"].ToString();
        }
        else
        {
            strDocListValue = System.Web.Configuration.WebConfigurationManager.AppSettings["Default_DocList"].ToString();
        }

        int i, j;
        strDate = "";
        strYear = DateTime.Now.ToString("yyyy");
        strMonth = DateTime.Now.ToString("MM");

        //int nStdYear = int.Parse(System.Configuration.ConfigurationManager.AppSettings["StandardYear"].ToString());
        int nStdYear = 2007; // 필히 변경

        for (i = nStdYear; i <= DateTime.Now.Year; i++)
        {
            for (j = 1;j<=12 ; j++)
            {
                if(strDate != "")
                {
                    strDate = strDate + "/";
                }
                strDate = strDate + i.ToString() + "#" + j.ToString().PadLeft(2, '0');
            }
        }
        

    }
}
