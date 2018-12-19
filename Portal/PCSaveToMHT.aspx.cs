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
using System.IO;
public partial class PCSave_PCSaveToMHT : PageBase
{
    #region 변수정의
    public string strUrl;
    public string strDownUri;
    public string strFileName;
    public string strPath;
    public string strFileSize;
    public string strFileLocation;
    public string strDownloadFileName;
    public string fiid;
    public string strBodyHTML;
    public string strfileHTML;
    public string strSubject;
    public string strHOSTURL;
    public string strFormName;
    #endregion

    #region 페이지로드
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            XmlDocument oRequestXML = new XmlDocument();
            oRequestXML.LoadXml(Request.Form["txtHTML"].ToString());
            XmlElement elmRoot = oRequestXML.DocumentElement;
            fiid = COVIFlowCom.Common.GetProp(elmRoot, "fiid", true);
            strBodyHTML = COVIFlowCom.Common.GetProp(elmRoot, "context_body", true);
            strSubject = COVIFlowCom.Common.GetProp(elmRoot, "filename", true);
            strHOSTURL = COVIFlowCom.Common.GetProp(elmRoot, "url", true);
            strFormName = COVIFlowCom.Common.GetProp(elmRoot, "fmnm", true);

            if (Page.IsPostBack == false)
            {
                GetParams();
                SaveMht();
                PutDownload();
            }
        }
        catch (Exception ex)
        {
           
        }
    }
    #endregion

    #region  쿼리스트링 데이타 가져오기 - htm 파일 생성 및 넘겨주기
    private void GetParams()
    {
        try
        {

            //  this.strUrl =Request.QueryString["url"];
            this.strUrl = strHOSTURL + "/GWImages/e-sign/Approval/" + fiid + "_" + Session["user_code"].ToString() + ".htm";
            //this.strUrl = "http://news.empas.com/show.tsp/20080521n03684";

            System.String strDirectory = Server.MapPath("/GWImages/e-sign/Approval/");

            strfileHTML = strDirectory + fiid + "_" + Session["user_code"].ToString() + ".htm"; //' 저장할 경로 + 파일 이름 -> url

            //'Write out the decoded data.
            StreamWriter sw = new StreamWriter(strfileHTML, false, System.Text.Encoding.UTF8); //'한글 encode값 949
            //StreamWriter sw = new StreamWriter(strfile, false, System.Text.Encoding.Default); //'한글 encode값 949
            sw.Write(strBodyHTML);
            sw.Close();
            sw.Dispose();


            // mht 파일 확장자 다운로드
            //this.strDownloadFileName = System.IO.Path.GetFileNameWithoutExtension(Request.QueryString["filename"]) + ".mht";
            //this.strDownloadFileName = System.IO.Path.GetFileNameWithoutExtension(fiid) + ".mht";
            if (strSubject == string.Empty)
            {
                this.strDownloadFileName = HttpUtility.UrlEncode(System.IO.Path.GetFileNameWithoutExtension(strFormName) + ".mht", new System.Text.UTF8Encoding()).Replace("+", "%20");
            }
            else
            {
                this.strDownloadFileName = HttpUtility.UrlEncode(System.IO.Path.GetFileNameWithoutExtension(strSubject) + ".mht", new System.Text.UTF8Encoding()).Replace("+", "%20");
            }

        }
        catch (Exception ex)
        {

        }
    }
    #endregion

    #region MHT 저장
    private void SaveMht()
    {
        string gID = System.Guid.NewGuid().ToString();
        string uploadPath = Server.MapPath("/GWImages/e-sign/Approval");
        strPath = uploadPath + "\\" + Session["user_code"].ToString() + "\\";

        try
        {
            if (Directory.Exists(strPath) == false)
            {
                Directory.CreateDirectory(strPath);
            }

            Builder _mht = new Builder();
            Builder.FileStorage st;

            st = Builder.FileStorage.DiskPermanent;
            _mht.AllowRecursiveFileRetrieval = false;
            strFileName = gID + ".mht";
            strDownUri = _mht.SavePageArchive(strPath + strFileName, Builder.FileStorage.Memory, strUrl);
        }
        catch (Exception ex)
        {

        }
    }
    #endregion

    #region 다운로드 처리
    private void PutDownload()
    {
        string ContentDisposition = "";
        string ContentType = "";

        string strFile = string.Empty;

        System.IO.Stream iStream = null;
        byte[] buffer = new Byte[10000];

        int length;

        long dataToRead;
        FileInfo ofInfo;

        try
        {
            strFile = strPath + strFileName;

            Page.Response.Clear();
            Page.Response.BufferOutput = false;

            if (Request.UserAgent.IndexOf("MSIE") >= 0)
            {
                //IE 5.0인 경우.
                if (Request.UserAgent.IndexOf("MSIE 5.0") >= 0)
                {
                    ContentDisposition = "inline;filename=";
                    ContentType = "application/x-msdownload";
                }
                else //IE 5.0이 아닌 경우.
                {
                    ContentDisposition = "attachment; filename=";
                    ContentType = "application/octet-stream";
                }
            }
            else
            {
                //Netscape등 기타 브라우저인 경우.
                ContentDisposition = "attachment;filename=";
                ContentType = "application/octet-stream";
            }


            // Response.AddHeader("Content-Disposition", ContentDisposition + strFileName);
            Response.AddHeader("Content-Disposition", ContentDisposition + strDownloadFileName);
            //Response.AddHeader("Content-Disposition", ContentDisposition + fiid + ".mht");
            Response.ContentType = ContentType;
            Response.CacheControl = "public";

            string filename = System.IO.Path.GetFileName(strFile);
            iStream = new System.IO.FileStream(strFile, System.IO.FileMode.Open, System.IO.FileAccess.Read, System.IO.FileShare.Read);

            // 파일을 스트림으로 처리한다
            dataToRead = iStream.Length;
            while (dataToRead > 0)
            {
                if (Response.IsClientConnected)
                {
                    length = iStream.Read(buffer, 0, 10000);
                    Response.OutputStream.Write(buffer, 0, length);
                    Response.Flush();

                    buffer = new Byte[10000];
                    dataToRead = dataToRead - length;
                }
                else
                {
                    dataToRead = -1;
                }
            }



        }
        catch (Exception ex)
        {

        }
        finally
        {
            if (iStream != null)
            {
                //Close the file.
                iStream.Close();
            }
            Response.Close();
            //삭제됨
           ofInfo = new FileInfo(strFile);
            if (ofInfo.Exists)
            {
                ofInfo.Delete();
            }
            ofInfo = new FileInfo(strfileHTML);
            if (ofInfo.Exists)
            {
                ofInfo.Delete();
            }

        }

    }
    #endregion
}
