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
using System.Xml;

/// <summary>
/// 배포그룹 설정시 뜨는 조직도의 배포처 목록페이지
/// </summary>
public partial class DeployList_DeployLinePrivate : PageBase
{
    private string strLangID;
    public string userid;
    public string username;
    public string _circulationInfo;
    //06/08/23 김인호 추가*/
    public string strOpenType = null;
    public string strTitle = null;
    //20060929 황선희 추가 - 중복체크
    public string _circulationInfoExt;

    public string _circulationInfo_ccrec;
    public string _circulationInfo_ref;
	public string strLangIndex = "0";

    protected void Page_Load(object sender, EventArgs e)
    {
        XmlDocument objDoc = new XmlDocument();
        try
        {
            if (!IsPostBack)
            {
                /* 다국어처리 06/08/23 김인호 */
                strLangID = Session["user_language"].ToString();
                //다국어 언어설정
                string culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";

                Page.UICulture = strLangID;
                Page.Culture = strLangID;
				strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

            }
            userid = Session["user_code"].ToString();
            username = Session["user_name"].ToString(); 

            objDoc = new XmlDocument();
            AccepData _accep = new AccepData();
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
            switch (strOpenType)
            {
                case "0":
                    strTitle = "수신자/참조자";
                    break;
                case "1":
                    strTitle = "참조자";
                    break;
                case "2":
                    strTitle = "배포자";
                    break;
                case "3":
                    strTitle = "수신/참조";
                    break;
                default:
                    strTitle = "수신자";
                    break;
            }

            try
            {
                if (sPID != "" && sFID != "")
                {
                    objDoc = _accep.SelectCirculationData(sPID, sFID, "2", Session["user_ent_code"].ToString());
                    _circulationInfo_ref = objDoc.OuterXml;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (objDoc != null) objDoc = null;
                if (_accep != null) _accep = null;
            }
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
