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

using COVIFlowCom;
using System.IO;

public partial class COVIFlowNet_FileAttach_htmldown : System.Web.UI.Page 
{
	CEPSBase cbsg = null;//이준희(2010-10-07): Added to support SharePoint environment.

    protected void Page_Load(object sender, EventArgs e)
    {
        string fileinfo = Request.QueryString["file"];
        string filename = Request.QueryString["filename"];
        cbsg = new CEPSBase();//System.Object fileDownload;
        

        try
        {
            string ContentDisposition, ContentType;

            if (Request.UserAgent.IndexOf("MSIE") >= 0)
            {
                //IE 5.0인 경우.
                if (Request.UserAgent.IndexOf("MSIE 5.0") >= 0)
                {
                    ContentDisposition = "inline;filename=";
                    ContentType = "application/x-msdownload";
                    //IE 5.0이 아닌 경우.
                }
                else
                {
                    //2014-06-09 hyh 수정
                    //ContentDisposition = "inline;filename=";
                    //ContentType = "application/octet-stream";
                    ContentDisposition = "attachment;filename=";
                    ContentType = "application/octet-stream";
                    //2014-06-09 hyh 수정 씉
                }
            }
            else
            {
                //Netscape등 기타 브라우저인 경우.
                ContentDisposition = "attachment;filename=";
                ContentType = "application/octet-stream";
            }

            string filepath = Request.QueryString["location"];

            if (filepath == "")
            {
                filepath = fileinfo;
            }

            string strURL = "";

            strURL = fileinfo;

            

            //한글이 깨지지 않게 UTF-8로 인코딩함.
            //filename = filename;// +filepath.Substring(filepath.LastIndexOf("."));
            filename = HttpUtility.UrlEncode(filename, new System.Text.UTF8Encoding()).Replace("+", "%20");
            Response.AddHeader("Content-Disposition", ContentDisposition + "\"" + filename + "\"");
            Response.ContentType = ContentType;
            Response.CacheControl = "public";
            
            
            //string strFilePath = filepath.Substring(0, filepath.IndexOf("_") + 1);
			string strFilePath = filepath.Substring(0, filepath.LastIndexOf("/") + 1).ToUpper();
			{
                //이준희(2010-10-07): Changed to support SharePoint environment.
			    //strFilePath = Server_MapPath(strFilePath.Replace("HTTP://" + System.Configuration.ConfigurationSettings.AppSettings["LinKURL"].ToString().ToUpper(),""));
                strFilePath = cbsg.CoviServer_MapPath(strFilePath.Replace("HTTP://" + System.Configuration.ConfigurationSettings.AppSettings["LinKURL"].ToString().ToUpper(),""));
            }
            //2014-06-10 hyh 추가
            if (filepath.IndexOf("http://gw.isudev.com") == -1)
            {
                filepath = "http://gw.isudev.com" + filepath;
            }
            //2014-06-10 hyh 추가 끝
            
            //2014-06-10 hyh 수정
            //Response.WriteFile(strFilePath + filepath.Substring(filepath.LastIndexOf("/") + 1, filepath.IndexOf("_") + 1-(filepath.LastIndexOf("/") + 1)) + HttpUtility.UrlDecode(filename));
            try
            {
                Response.WriteFile(strFilePath + filepath.Substring(filepath.LastIndexOf("/") + 1, filepath.IndexOf("_") + 1 - (filepath.LastIndexOf("/") + 1)) + HttpUtility.UrlDecode(filename));
            }
            catch (System.Exception ex)
            {
                try
                {
                    Response.WriteFile(strFilePath + HttpUtility.UrlDecode(filename));
                }
                catch (System.Exception ex2) 
                {
                    if (filepath.IndexOf("FrontStorage") > -1)
                    {
                        filename = Session["user_code"] +  "_" + filename;
                    }
                    
                    Response.WriteFile(strFilePath + HttpUtility.UrlDecode(filename));
                }
            }
            //2014-06-10 hyh 수정 끝
        }
        catch (System.Exception ex)
        {
            
            ErrResult.HandleException(Response, ex); 
        }
        finally
        {
            //code
            //fileDownload = null;
        }
		Response.End();
	}
}
