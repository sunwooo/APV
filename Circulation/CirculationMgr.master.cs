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
/// 회람 발송 Master 페이지
/// 구성 : 조직도 + 조직도검색목록 + 회람자 목록
/// </summary>
public partial class COVIFlowNet_Circulation_CirculationMgr : System.Web.UI.MasterPage
{
    public string userid;
    public string username;
    public string _circulationInfo;
    public string strOpenType = null;
    public string strTitle = null;
    public string _circulationInfoExt;
    public string _circulationInfo_ccrec;
    public string _circulationInfo_ref;

    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
	public string strLangIndex = "0";

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            if (Session["user_language"] != null)
            {
                strLangID = Session["user_language"].ToString();
            }

            //다국어 언어설정
            Page.UICulture = strLangID;
            Page.Culture = strLangID;

        }
		strLangIndex = COVIFlowCom.Common.getLngIdx(strLangID);
       
        userid = Session["user_code"].ToString();
        username = Session["user_name"].ToString();

        XmlDocument objDoc = new XmlDocument();
        AccepData _accep = new AccepData();
        string sPID = "";
        string sFID = "";

        if (Request.QueryString["piid"] != null)
            sPID = Request.QueryString["piid"].ToString();

        if (Request.QueryString["fiid"] != null)
            sFID = Request.QueryString["fiid"].ToString();
        if (Request.QueryString["openType"] != null)
            strOpenType = Request.QueryString["openType"].ToString();


        try
        {
            if (sPID != "" && sFID != "")
            {
                //objDoc = _accep.SelectCirculationData(sPID, sFID, "0");
                //_circulationInfo_ccrec = objDoc.OuterXml;
                objDoc = _accep.SelectCirculationData(sPID, sFID, "2", Session["user_ent_code"].ToString());
                _circulationInfo_ref = objDoc.OuterXml;

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
