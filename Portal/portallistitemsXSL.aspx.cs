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
/// 전자결재 홈 페이지 미결함/부서수신함 목록 변환 XSL 파일
/// </summary>
public partial class COVIFlowNet_Portal_portallistitemsXSL : PageBase
{
    /// <summary>
    /// 다국어 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        
        
        try
        {
            //code
            String strLangID = Session["user_language"].ToString();
            //다국어 언어설정
            string culturecode = strLangID; //"en-US"; "ja-JP";
            Page.UICulture = culturecode;
            Page.Culture = culturecode;
        }
        catch (System.Exception ex)
        {
            
            throw new System.Exception(null, ex.InnerException);
        }
        finally
        {
            //code
        }

    }
}
