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
using System.IO;
using System.Xml;

/// <summary>
/// 개인 회람그룹 조직도 설정 및 회람자 관리 화면
/// 구성 : 조직도 + 검색결과목록 + 회람자 목록
/// </summary>
public partial class COVIFlowNet_CirculationlineList_CirculationLinePrivate : PageBase
{
    private string strLangID;
    public string userid;
    public string username;
    public string _circulationInfo;
    //06/08/23 김인호 추가*/
    public string strOpenType = null;
    public string strTitle = null;
    //    public string strTitlesub = null;
    //20060929 황선희 추가 - 중복체크
    public string _circulationInfoExt;


    public string _circulationInfo_ccrec;
    public string _circulationInfo_ref;

	public string strLangIndex = "0";
    /// <summary>
    /// 다국어 설정
    /// 파라미터 처리
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            /* 다국어처리 06/08/23 김인호 */
            strLangID = Session["user_language"].ToString();
            //다국어 언어설정
            string culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";

            Page.UICulture = strLangID;
            Page.Culture = strLangID;
			Title = Resources.Approval.lbl_Circulationline_setup;
			strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

        }
        
        userid = Session["user_code"].ToString();
        username = Session["user_name"].ToString();

        XmlDocument objDoc = null;
        AccepData _accep = null;
        string sPID = "";
        string sFID = "";

        if (Request.QueryString["piid"] != null)
            sPID = Request.QueryString["piid"].ToString();

        if (Request.QueryString["fiid"] != null)
            sFID = Request.QueryString["fiid"].ToString();
        //06/08/23 김인호 추가*/
        if (Request.QueryString["openType"] != null)
            strOpenType = Request.QueryString["openType"].ToString();
        //06/08/23 김인호 추가*/

        try
        {
            objDoc = new XmlDocument();
            _accep = new AccepData();
            if (sPID != "" && sFID != "")
            {
                //objDoc = _accep.SelectCirculationData(sPID, sFID, "0");
                //_circulationInfo_ccrec = objDoc.OuterXml;
                objDoc = _accep.SelectCirculationData(sPID, sFID, "2", Session["user_ent_code"].ToString());
                _circulationInfo_ref = objDoc.OuterXml;

                //황선희 추가
                //if (strOpenType == "2")
                //{
                //    _circulationInfoExt = _accep.SelectCirculationData(sPID, sFID, "0").OuterXml;
                //}
                //else
                //{
                //    _circulationInfoExt = _accep.SelectCirculationData(sPID, sFID, "2").OuterXml;
                //}
            }
        }
        catch (Exception ex)
        {
            throw new Exception(null, ex);
        }
        finally
        {
            if (objDoc != null) objDoc = null;
            if (_accep != null) _accep = null;
        }
    }
}
