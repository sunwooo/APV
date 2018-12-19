using System;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using DEXTUpload.NET;
using System.IO;

/// <summary>
/// XFileUploadMoitor에서 호출
/// </summary>
public partial class Approval_FileAttach_PostUpload : PageBase
{
	protected void Page_Load(object sender, EventArgs e)
	{
		using (DEXTUpload.NET.FileUpload fileUpload = new DEXTUpload.NET.FileUpload())
		{

			string strFileName, strDirectory, strfile;
			string FrontPath = System.Configuration.ConfigurationSettings.AppSettings["FrontStoragePath"];
			string folderName = Request.QueryString["folder"].ToString();
			string strUploadFolder = Session["user_code"].ToString();

			for (int i = 0; i <= fileUpload["DextuploadX"].Count - 1; i++)
			{
				//<input type="file" ...> 폼요소이고 업로드할 파일을 지정한 경우만 화면에 보여줌.
				if (fileUpload["DextuploadX"][i].IsFileElement && fileUpload["DextuploadX"][i].Value != "")
				{
					strFileName = fileUpload["DextuploadX"][i].FileName;
					//strUploadFolder = FrontPath + folderName + "/"; //폴더생성
					strDirectory = FrontPath + folderName + "\\";// +strUploadFolder + "\\";
					//strDirectory = Server_MapPath();
					strfile = strDirectory + strUploadFolder + "_" +strFileName;
					fileUpload["DextuploadX"][i].SaveAs(strfile);

				}
			}
		}
	}
}
