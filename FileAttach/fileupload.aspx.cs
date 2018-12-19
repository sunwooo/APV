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

    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["user_language"] != null)
        {
            strLangID = Session["user_language"].ToString();
        }
        //다국어 언어설정
        string culturecode = strLangID; //"en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        strStorage = System.Configuration.ConfigurationManager.AppSettings["FrontStorage"].ToString();
        //각 솔루션 별로 올라갈 부분들을 지정 해주어야 한다
        strStorage = strStorage + "Approval/";

        //수정일경우 파일 로게이션을 받아 온다
        //백스토리지 로캐이션 에서 사용이 가능하도록 하기 위해서 이다
        /*
        if (Request.QueryString["FileLoc"] != null || Request.QueryString["FileLoc"] != "")
        {
            strBFileLoc = Request.QueryString["FileLoc"];
        }
        */
        if (Request.Form["hidlocation"] != null || Request.Form["hidlocation"] != "")
        {
            strBFileLoc = Request.Form["hidlocation"];
        }
        else
        {
            strBFileLoc = "";
        }

        strUserCode = Session["user_code"].ToString();
        //strINIListFiles = Request.QueryString["INIListFiles"];
        strINIListFiles = Request.Form["hidINIListFiles"];
		strUserName = Session["user_name_lng"].ToString().Replace(";", "^");
		strUserDeptName = Session["user_dept_name_lng"].ToString().Replace(";","^");


        if (strINIListFiles != "")
        {
            string[] strtemp;
            strtemp = strINIListFiles.Split(';');
            for (int i = 0; i <= strtemp.Length - 2; i++)
            {
                string[] strtemp2;
                strtemp2 = strtemp[i].Split(':');

                strtemp2[0] = strtemp2[0].Replace(Session["user_code"].ToString() + "_", "_");  //추가(2013-03-20 HIW) --> 이수계열사 회사코드에 "_"가 들어가있으므로 파일명만 제대로 가져오기위해서 좌측과같이 Replace처리함 
                strtemp2[0] = strtemp2[0].Substring(strtemp2[0].IndexOf("_") + 1, strtemp2[0].Length - strtemp2[0].IndexOf("_") - 1);
                
                strINIList = strINIList + strtemp2[0] + ":" + strtemp2[1] + ":" + strtemp2[2] + ":" + strtemp2[3] + ";";
            }
            //strINIListFiles = strtempINI;
        }

    }
}
