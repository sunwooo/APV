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
/// 첨부파일 추가 - frontstorage에 파일을 업로드 시킴
/// </summary>
public partial class COVIFlowNet_FileAttach_fileupload : PageBase
{
	public string strStorage;
	public string strUserCode;
	public string strINIListFiles;
	public string strINIList;
	public string strFileLoc, strBFileLoc;
	public string strUserName;
	public string strUserDeptName;
	public string strKind = "1";
	private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
	
	public string FilesExisting = string.Empty;
	public int MaxFileSize;
	public int MaxUpload;
	public string FileExtensionFilter = string.Empty;
	public string FileNameFilter = string.Empty;
	public string SlvColor = string.Empty;
	public string Lan = string.Empty;
	public string sTimeKey = string.Empty;


		

	protected void Page_Load(object sender, EventArgs e)
	{
		if (Session["user_language"] != null)
		{
			strLangID = Session["user_language"].ToString();
		}
		strUserCode = Session["user_code"].ToString();
		strUserName = Session["user_name"].ToString();
		strUserDeptName = Sessions.USER_DEPT_NAME.ToString();
		strINIListFiles = Request.QueryString["INIListFiles"];
		//다국어 언어설정
		string culturecode = strLangID; //"en-US"; "ja-JP";
		Page.UICulture = culturecode;
		Page.Culture = culturecode;
		strStorage = System.Configuration.ConfigurationManager.AppSettings["FrontStorage"].ToString();
		MaxFileSize = int.Parse(System.Configuration.ConfigurationManager.AppSettings["MaxFileSize"].ToString());
		MaxUpload = int.Parse(System.Configuration.ConfigurationManager.AppSettings["MaxUpload"].ToString());

		FileExtensionFilter = System.Configuration.ConfigurationManager.AppSettings["FileExtensionFilter"].ToString();
		FileNameFilter = System.Configuration.ConfigurationManager.AppSettings["FileNameFilter"].ToString();
		SlvColor = System.Configuration.ConfigurationManager.AppSettings["SlvColor"].ToString();
		Lan = Session["user_language"].ToString();
		sTimeKey = sgNow(" ");
		//각 솔루션 별로 올라갈 부분들을 지정 해주어야 한다
		strStorage = strStorage + "Approval/";

		//수정일경우 파일 로게이션을 받아 온다
		//백스토리지 로캐이션 에서 사용이 가능하도록 하기 위해서 이다
		if (Request.QueryString["FileLoc"] != null || Request.QueryString["FileLoc"] != "")
		{
			strBFileLoc = Request.QueryString["FileLoc"];
		}
		else
		{
			strBFileLoc = "";
		}

		strUserCode = Session["user_code"].ToString();
		strINIListFiles = Request.QueryString["INIListFiles"];
		strUserName = Session["user_name"].ToString();
		strUserDeptName = Sessions.USER_DEPT_NAME.ToString();

		try
		{//이민지(2010-04-14): CoviSilverlightTrans를 지원하기 위해 Try/Catch 처리를 추가함.
			if (strINIListFiles != "")
			{
				string[] strtemp;
				strtemp = strINIListFiles.Split(';');
				for (int i = 0; i <= strtemp.Length - 2; i++)
				{
					string[] strtemp2;
					strtemp2 = strtemp[i].Split(':');
					strtemp2[0] = strtemp2[0].Substring(strtemp2[0].IndexOf("_") + 1, strtemp2[0].Length - strtemp2[0].IndexOf("_") - 1);
					strINIList = strINIList + strtemp2[0] + ":" + strtemp2[1] + ":" + strtemp2[2] + ":" + strtemp2[3] + ";";
				}
				//strINIListFiles = strtempINI;
			}
		}
		catch (Exception ex)
		{
		}
		
		if(strINIListFiles !="")
		{//이민지(2010-04-16): sandkey 를 실행 시키기 위한 함수 추가
			string[] saFiles = strINIListFiles.Split(';');
			for(int i=0;i<saFiles.Length-1;i++)
			{
				string[] saFilesExist = saFiles[i].Split(':');
				FilesExisting += saFilesExist[0]+'`';	
			}
		}
		else
		{
			FilesExisting = "";
		}
	}
	public string sgNow(string sMode)
	{//현재 시각을 문자열로 반환함.
		DateTime dt = new DateTime();
		string sRet = "", sTmp = "";
		dt = new DateTime();
		dt = System.DateTime.Now;
		sRet += dt.Year.ToString();
		if (sMode == "KO")
		{
			sRet += "-";
		}
		else if (sMode == "KR")
		{
			sRet += ".";
		}
		sTmp = "0" + dt.Month.ToString();
		sRet += sTmp.Substring(sTmp.Length - 2, 2);
		if (sMode == "KO")
		{
			sRet += "-";
		}
		sTmp = "0" + dt.Day.ToString();
		sRet += sTmp.Substring(sTmp.Length - 2, 2);
		if (sMode == "KO")
		{
			sRet += " ";
		}
		sTmp = "0" + dt.Hour.ToString();
		sRet += sTmp.Substring(sTmp.Length - 2, 2);
		if (sMode == "KO")
		{
			sRet += ":";
		}
		sTmp = "0" + dt.Minute.ToString();
		sRet += sTmp.Substring(sTmp.Length - 2, 2);
		if (sMode == "KO")
		{
			sRet += ":";
		}
		sTmp = "0" + dt.Second.ToString();
		sRet += sTmp.Substring(sTmp.Length - 2, 2);
		return sRet;
	}
}
