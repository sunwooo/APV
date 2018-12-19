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
/// 결재선 목록 조회 - 현재 사용 안함
/// </summary>
public partial class COVIFlowNet_ApvMonitor_MonitorList : PageBase
{
    public string strList;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Expires = 0;
        Response.CacheControl = "private";
        Response.Buffer = true;
        System.Xml.XmlDocument xmlDoc = null;
        try
        {
            String bStatus = Request.QueryString["bOnGoing"];
            String UserID = Session["user_code"].ToString();
            String strMonth = Request.QueryString["strMonth"];

            string strUrl;

            if (bStatus == "true")
            {
                strUrl = "http://" + Session["front_name"] + "/xmlwf/query/wf_worklistquery02.xml?USER_ID=" + UserID + "&PI_STATE=288&WI_STATE=528";
            }
            else
            {
                strUrl = "http://" + Session["front_name"] + "/xmlwf/query/wf_worklistquery03.xml?USER_ID=" + UserID + "&PI_STATE=528&WI_STATE=528&PI_FINISHED=" + strMonth;
            }


            xmlDoc = new System.Xml.XmlDocument();
            xmlDoc.Load(strUrl);
            strList = xmlDoc.OuterXml;
            xmlDoc = null;
        }
        catch (System.Exception Ex)
        {
            throw new System.Exception("MonitorList.aspx", Ex);
            //HandleException(Ex);
        }
        finally
        {
            if (xmlDoc != null)
            {
                xmlDoc = null;
            }
        }
    }

    public void HandleException(System.Exception _Ex)
    {
        
        try
        {
            Response.Write("<script language=jscript>alert(\"" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)).Replace("\"", "\\\"") + "\");</script>");
            
        }
        catch (Exception ex)
        {
            Response.Write("<script language=jscript>alert(\"" + COVIFlowCom.ErrResult.ReplaceErrMsg(ex.Message).Replace("\"", "\\\"") + "\");</script>");
            
        }
    }
}
