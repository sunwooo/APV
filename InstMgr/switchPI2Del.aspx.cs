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
/// 시  스  템 : WP
/// 단위시스템 : Approval
/// 프로그램명 : 전자결재 Process Instance Delete 플래그 설정
/// 모  듈  명 : switchPI2Del
/// 파  일  명 : switchPI2Del.aspx
/// 설      명 : Process Instance Delete 플래스 설정
/// </summary>
/// <history>
/// CH00 2003/06/04  이현석 : 최초 작성
/// 
/// </history>


public partial class COVIFlowNet_Admin_InstMgr_switchPI2Del : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    /// <summary>
    /// 다국어 설정
    /// Process Instance 삭제일자 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        //다국어 언어설정
        if (Session["user_language"] != null)
        {
            strLangID = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        string culturecode = strLangID;	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
        CfnDatabaseManager.WfDBManager oDBMgr = null;
        try
        {
            oDBMgr = new CfnDatabaseManager.WfDBManager();
            //code
            System.Xml.XmlDocument oRequestXML = COVIFlowCom.Common.ParseRequestBytes(Request);
                System.Xml.XmlNodeList oItems  = oRequestXML.SelectNodes("//item");
                if (oItems.Count > 0 ){
                    System.String sPIID;
                    foreach(System.Xml.XmlNode oItem in oItems){
                        sPIID = oItem.Attributes["piid"].Value;
                        oDBMgr.ChangeProperty("WfProcessInstance", sPIID, "deletionDate", System.DateTime.Now);
                    }
                }
                Response.Write(Resources.Approval.msg_138);
        }
        catch (System.Exception ex)
        {
            
            Response.Write("<error>" + Server.HtmlEncode(COVIFlowCom.ErrResult.ParseStackTrace(ex)) + "</error>");
        }
        finally
        {
            //code
            if (oDBMgr != null)
            {
                oDBMgr.Dispose();
                oDBMgr = null;
            }
        }
    }
}
