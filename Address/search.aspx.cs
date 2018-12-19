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
using System.Diagnostics;

/// <summary>
/// 전자결재 조직도 검색 화면
/// </summary>
public partial class COVIFlowNet_Address_search : PageBase 
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string Ent="";

    /// <summary>
    /// 전자결재 조직도 검색 화면
    /// 다국어 설정/ 파라미터 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {

        #region PerformanceLog 처리를 위한 Stopwatch 설정
        Stopwatch stopwatch = null;
        if (sPerformanceYN == "True")
        {
            stopwatch = new Stopwatch();
            stopwatch.Start();
        }
        #endregion


        if (Request.QueryString["Ent"] != null)
        {
            Ent = Request.QueryString["Ent"];
        }
        
        //다국어 언어설정
        string culturecode = strLangID;
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        #region PerformanceLog 처리
        if (sPerformanceYN == "True")
        {
            stopwatch.Stop();
            if (stopwatch.ElapsedMilliseconds > Convert.ToInt32(iPerformanceLimit))
            {
                string fullMethodName = string.Format("{0} --> {1}", this.GetType().Name, System.Reflection.MethodBase.GetCurrentMethod().Name);
                this.SetPerformanceLog(fullMethodName, stopwatch.Elapsed.ToString());

            }
        }
        #endregion
    }
}
