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

/// <summary>
/// 사용자 서명/인장 이미지 파일 첨부 페이지
/// </summary>
public partial class Approval_Portal_IStampUpload : PageBase
{
	public string strUploadFolder = System.Configuration.ConfigurationManager.AppSettings["FrontStorage"].ToString() + "Approval/SIGNIMAGE";
    public string strUploadFolderPath = System.Configuration.ConfigurationManager.AppSettings["FrontStoragePath"].ToString() + "Approval\\SIGNIMAGE\\";
    public string strSaveFolder = System.Configuration.ConfigurationManager.AppSettings["BackStorage"].ToString() + "e-sign/ApprovalSign";
    public string strSaveFolderPath = System.Configuration.ConfigurationManager.AppSettings["BackStoragePath"].ToString() + "e-sign\\ApprovalSign\\";
    public string strSaveFolder_1 = System.Configuration.ConfigurationManager.AppSettings["BackStorage"].ToString() + "e-sign/ApprovalSign/Backstamp";  //2007.06.20 박동현 사인이미지 백업폴더
    public string strSaveFolderPath_1 = System.Configuration.ConfigurationManager.AppSettings["BackStoragePath"].ToString() + "e-sign\\ApprovalSign\\Backstamp\\";  //2007.06.20 박동현 사인이미지 백업폴더
	public int cnt = 0;

    /// <summary>
    /// 다국어 설정
    /// 파라미터 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
	protected void Page_Load(object sender, EventArgs e)
	{
		string culturecode = Session["user_language"].ToString();
		Page.UICulture = culturecode;
		Page.Culture = culturecode;

		string sWorkMode = Request.QueryString["workmode"];

		if (sWorkMode == "delete") pDeleteFiles();
	}

    /// <summary>
    /// 서명/인장이미지 index 추출
    /// </summary>
    /// <param name="sMode">서명/인장 구분</param>
    /// <param name="strUserAlias">사용자 id(person code)</param>
    /// <returns></returns>
	private string pGetIndex(string sMode, string strUserAlias)
	{
		string sSignPath = strSaveFolderPath;
		Covi.FileSystemNet oFS = new Covi.FileSystemNet();

		string[] fileEntries = oFS.fnSearchDirectory(sSignPath, sMode + "_" + strUserAlias + "*.*");

		int i = -1;

		foreach (string fileName in fileEntries)
		{
			string sidx = fileName.Substring(fileName.LastIndexOf("_") + 1);
			sidx = sidx.Remove(sidx.LastIndexOf("."), 4);
			int idx = 0;
			if (sidx == "")
			{
				idx = -1;
			}
			else
			{
				idx = System.Convert.ToInt16(sidx);
			}
			if (i < idx) i = idx;
		}

		i = i + 1;
		cnt = i;
		return i.ToString();
	}

    /// <summary>
    /// 서명/인장이미지 index 추출2 - backStamp기준
    /// </summary>
    /// <param name="sMode">서명/인장 구분</param>
    /// <param name="strUserAlias">사용자 id(person code)</param>
    /// <returns></returns>
	private string pGetIndex_1(string sMode, string strUserAlias)
	{
		string sSignPath_1 = strSaveFolderPath_1;
		Covi.FileSystemNet oFS = new Covi.FileSystemNet();

        string[] fileEntries = oFS.fnSearchDirectory(sSignPath_1, sMode + "_" + strUserAlias  +"_*.*");
		//string[] fileEntries = oFS.fnSearchDirectory(sSignPath_1, sMode + "_" + sFilename + "_" + strUserAlias + "*.*");

		int j = -1;

		foreach (string fileName in fileEntries)
		{
			string sidx = fileName.Substring(fileName.LastIndexOf("_") + 1);
			sidx = sidx.Remove(sidx.LastIndexOf("."), 4);
			int idx =0;
			if (sidx == ""){
					idx = -1;
			}else{
				idx = System.Convert.ToInt16(sidx);
			}
		}

		j = j + 1;
		return j.ToString();
	}

    /// <summary>
    /// 서명/인장이미지 삭제
    /// </summary>
	private void pDeleteFiles()
	{
		Covi.FileSystemNet oFS = null;

		try
		{
			oFS = new Covi.FileSystemNet();

			string deleteFiles = Request.QueryString["deleteFiles"]; //fileUrlName
			string physicalPath;
			//string UTFfile = HttpUtility.UrlEncode(deleteFiles, new System.Text.UTF8Encoding()).Replace("+", "%20");
			string[] files = deleteFiles.Split("|".ToCharArray());
			//string[] files = HttpUtility.UrlDecode(UTFfile).Split("|".ToCharArray());

			foreach (string fileinfo in files)
			{
				if (fileinfo != "")
				{
					//string Ufilename = HttpUtility.UrlEncode(fileinfo, new System.Text.UTF8Encoding()).Replace("+", "%20");

					//physicalPath = Server_MapPath(strSaveFolder_1 + fileinfo);
					//physicalPath = Server_MapPath(strSaveFolder_1 + HttpUtility.UrlDecode(fileinfo));
					//physicalPath = strSaveFolderPath_1 + fileinfo;
                    physicalPath = strSaveFolderPath + fileinfo;

					string returnValue = oFS.fnDeleteFile(physicalPath, true);

					if (returnValue.ToUpper() != "OK")
					{
						throw new Exception(Resources.Approval.msg_203 + " : " + returnValue);
					}
				}
			}

			//Response.Write("<script language='JavaScript'>");
			//Response.Write("alert('" + Resources.COVIServiceNet.msg_072 + "');");
			//Response.Write("</script>");
		}
		catch (Exception ex)
		{
			COVIFlowCom.ErrResult.HandleException(Response, ex);
		}
	}


    /// <summary>
    /// 파일첨부찾아보기) 버튼 처리
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
	protected void imgUpload_Click(object sender, ImageClickEventArgs e)
	{
		//Dim fileUpload As System.Object 'DEXTUpload.NET.FileUpload
		Covi.FileSystemNet oFS;

		try
		{
//			string strFileName;
			// string strFileName_1;
			string strDirectory, strfile, filename;//, strfile_1;
			string strFullFileName;

			strFullFileName = this.MyFile.PostedFile.FileName;

			if (MyFile.PostedFile.FileName == "")
			{
				Response.Write("<script>alert('" + Resources.Approval.msg_066 + "')</script>");
				return;
			}

			//--- 파일 이름을 세팅합니다.---
			System.IO.FileInfo upFile = new System.IO.FileInfo(MyFile.PostedFile.FileName);
			filename = upFile.Name; //순수 파일명
			//string fname = filename.ToString().Split(".");
			string FileExt = upFile.Extension.ToLower();
			//---- 원본 파일명만 빼낸다.  2007.07.26 박동현----
			char[] Separators = new char[] { '.' };
			//string[] SplitFname = filename.Split(Separators, StringSplitOptions.RemoveEmptyEntries);
			string[] SplitFname = filename.Split(Separators);
			string Fname = SplitFname[0];
			if (Fname.Length > 20)
			{
				Response.Write("<script language='JavaScript'>");
				Response.Write("alert('" + Resources.Approval.msg_207 + "');"); //파일명은 20자이내로 작성하여 주십시요.
				Response.Write("</script>");
				return;
			}

			//Response.Write("<script language='JavaScript'>");
			//Response.Write("alert('" + Fname + "');");
			//Response.Write("</script>");

			if (FileExt != ".gif" && FileExt != ".jpg" && FileExt != ".bmp")
			{
				throw new Exception("FileExt " + FileExt + Resources.Approval.msg_208);
			}

			//폴더생성
            string sFrontPath = Server.MapPath("/FrontStorage/Approval/SIGNIMAGE");
            if (Directory.Exists(sFrontPath) == false)
            {
                Directory.CreateDirectory(sFrontPath);
            }

			if (strUploadFolder.Substring(strUploadFolder.Length-2, 1) != "/") strUploadFolder = strUploadFolder + "/";

			//strDirectory = Server_MapPath(strUploadFolder);
			strDirectory = strUploadFolderPath;

			//string urlFileName = mode.Value + "_" + Session["user_code"].ToString() + "_" + pGetIndex(mode.Value, Session["user_code"].ToString()) + filename.Substring(filename.LastIndexOf("."));  // 저장할 경로 + 파일 이름 -> url
			string urlFileName = mode.Value + "_" + Session["user_code"].ToString() + "_" + Fname.ToString() + "_" + pGetIndex(mode.Value, Session["user_code"].ToString()) + filename.Substring(filename.LastIndexOf("."));  // 저장할 경로 + 파일 이름 -> url  2007.07.25 박동현 파일명 그대로.
			string utffilename = urlFileName;// HttpUtility.UrlEncode(urlFileName, new System.Text.UTF8Encoding()).Replace("+", "%20");
			//strfile = strDirectory + HttpUtility.UrlDecode(utffilename);
			strfile = strDirectory + utffilename;

			MyFile.PostedFile.SaveAs(strfile);
			oFS = new Covi.FileSystemNet();

			string strFileResult = oFS.fnMoveFile(strUploadFolderPath + utffilename, strSaveFolderPath + utffilename);
			

		if (strFileResult.ToUpper() != "OK")
			{
				throw new Exception("Error : " + strSaveFolder);
			}
			else
			{
				Response.Write("<script language='JavaScript'>");
				Response.Write("window.parent.addDictionary('" + urlFileName + "','" + (mode.Value == "sign" ? Resources.Approval.lbl_sign : Resources.Approval.lbl_stamp) + "');");
				Response.Write("</script>");
			}

		}
		catch (Exception ex)
		{
			COVIFlowCom.ErrResult.HandleException(Response, ex);
		}

		imgUpload_BackStamp();
	}


    /// <summary>
    /// 이미지 저장 시 BackStamp에도 저장 처리
    /// </summary>
	protected void imgUpload_BackStamp()
	{
		//Dim fileUpload As System.Object 'DEXTUpload.NET.FileUpload
		Covi.FileSystemNet oFS;

		try
		{
			string strFileName;
			string strDirectory, strfile_1, filename;//, strfile;
			string strFullFileName;


			strFullFileName = this.MyFile.PostedFile.FileName;

			if (MyFile.PostedFile.FileName == "")
			{
				Response.Write("<script>alert('" + Resources.Approval.msg_066 + "')</script>");
				return;
			}

			//--- 파일 이름을 세팅합니다.---
			System.IO.FileInfo upFile = new System.IO.FileInfo(MyFile.PostedFile.FileName);
			filename = upFile.Name; //순수 파일명
			string FileExt = upFile.Extension.ToLower();

			//---- 원본 파일명만 빼낸다.  2007.07.26 박동현----
			char[] Separators = new char[] { '.' };
			string[] SplitFname = filename.Split(Separators);
			string Fname = SplitFname[0];
			//-------------------------------------------------


			if (FileExt != ".gif" && FileExt != ".jpg" && FileExt != ".bmp")
			{
				throw new Exception("FileExt " + FileExt + Resources.Approval.msg_208);
			}

			//폴더생성
			//if (strUploadFolder.SubStrng, 1) != "/") strUploadFolder = strUploadFolder + "/";
			if (strUploadFolder.Substring(strUploadFolder.Length-2, 1) != "/") strUploadFolder = strUploadFolder + "/";

			//strDirectory = Server_MapPath(strUploadFolder);//가상경로 이상현상으로 아래 코딩으로 대체
			strDirectory = strUploadFolderPath;

			//string urlFileName_1 = mode.Value + "_" + Session["user_code"].ToString() + "_" + pGetIndex_1(mode.Value, Session["user_code"].ToString()) + filename.Substring(filename.LastIndexOf("."));  // 저장할 경로 + 파일 이름 -> url
			string urlFileName_1 = mode.Value + "_" + Session["user_code"].ToString() + "_" + Fname.ToString() + "_" + cnt.ToString() + filename.Substring(filename.LastIndexOf("."));  // 저장할 경로 + 파일 이름 -> url
			//  string urlFileName_1 = mode.Value + "_" + filename.ToString() + "_" + cnt.ToString() + filename.Substring(filename.LastIndexOf("."));  // 저장할 경로 + 파일 이름 -> url
			string utffilename = urlFileName_1;// HttpUtility.UrlEncode(urlFileName_1, new System.Text.UTF8Encoding()).Replace("+", "%20");//urlFileName_1;
			//strfile_1 = strDirectory + HttpUtility.UrlDecode(utffilename);
			strfile_1 = strDirectory + utffilename;

			MyFile.PostedFile.SaveAs(strfile_1);
			oFS = new Covi.FileSystemNet();

			string strFileResult_1 = oFS.fnMoveFile(strDirectory + utffilename, strSaveFolderPath_1 + utffilename);

			if (strFileResult_1.ToUpper() != "OK")
			{
				throw new Exception("Error : " + strSaveFolder_1);
			}
			else
			{
				Response.Write("<script language='JavaScript'>");
				Response.Write("window.parent.addDictionary('" + urlFileName_1 + "','" + (mode.Value == "sign" ? Resources.Approval.lbl_sign : Resources.Approval.lbl_stamp) + "');");
				Response.Write("</script>");
			}

		}
		catch (Exception ex)
		{
			COVIFlowCom.ErrResult.HandleException(Response, ex);
		}
	}
}
