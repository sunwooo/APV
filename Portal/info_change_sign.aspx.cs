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
/// 전자결재 사용자 서명/인장 이미지 관리
/// </summary>
public partial class Approval_Portal_info_change_sign : PageBase
{
	public string sInfo;
    /// <summary>
    /// 다국어설정
    /// 사용자 세션 확인
    /// 사용자 서명/인장이미지 backstorage에서 검색
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
	protected void Page_Load(object sender, EventArgs e)
	{
		string culturecode = Session["user_language"].ToString();
		Page.UICulture = culturecode;
		Page.Culture = culturecode;

        Title = Resources.Approval.lbl_SingImageUpdate;

        //string sSignURL = System.Configuration.ConfigurationManager.AppSettings["BackStorage"].ToString() + "e-sign/ApprovalSign/Backstamp/"; ;
        //string sSignPath = System.Configuration.ConfigurationManager.AppSettings["BackStoragePath"].ToString() + "e-sign\\ApprovalSign\\Backstamp\\";// Server.MapPath(sSignURL);
        string sSignURL = System.Configuration.ConfigurationManager.AppSettings["BackStorage"].ToString() + "e-sign/ApprovalSign/"; ;
        string sSignPath = System.Configuration.ConfigurationManager.AppSettings["BackStoragePath"].ToString() + "e-sign\\ApprovalSign\\";// Server.MapPath(sSignURL);

		Covi.FileSystemNet oFS = new Covi.FileSystemNet();
		if (Session["user_code"] != "" || Session["user_code"] != null)
		{
			string[] fileEntries = oFS.fnSearchDirectory(sSignPath, "*_" + Session["user_code"].ToString() + "_*.*");

			sInfo = "";
			foreach (string fileName in fileEntries)
			{
				sInfo = sInfo + ";" + HttpUtility.UrlDecode(fileName).Substring(fileName.LastIndexOf("\\") + 1);
			}

			if (sInfo.Length > 1) sInfo = sInfo.Substring(1);
		}
		else
		{
			Response.Write("<script language='JavaScript'>");
			Response.Write("alert('" + Resources.Approval.msg_292+"');");
			Response.Write("</script>");
		}
		
	}
}
