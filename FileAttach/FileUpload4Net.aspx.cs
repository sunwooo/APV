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
using System.Configuration;
using System.Xml;

/// <summary>
/// .Net 기본 controle을 이용한 파일 upload
/// </summary>
public partial class Approval_FileAttach_FileUpload4Net : PageBase //System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //다국어 언어설정
        string culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
        Title = Resources.Approval.lbl_fileupload;
        btnAdd.Text = "<span>" + Resources.Approval.btn_add + "</span>";

    }
   /// <summary>
    /// 파일추가 버튼
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void BtnAdd_Click(object sender, EventArgs e)
    {
        XmlDocument oXML = new XmlDocument(); 
        try{
            if (oFile1.PostedFile.FileName == "")
            {
                Response.Write("<script>alert('"+Resources.Approval.msg_066+"')</script>");
            }
            else
            {
                //--- 파일 이름을 세팅합니다.---
                FileInfo upFile = new FileInfo(oFile1.PostedFile.FileName);
                String filename = upFile.Name; //'순수 파일명
                String strURL = ConfigurationManager.AppSettings["FrontStorage"].ToString() + "Approval/"; //폴더생성
                String strDirectory = ConfigurationManager.AppSettings["FrontStoragePath"].ToString() + "\\Approval\\"; //폴더생성
                String strfile = strDirectory + Session["user_code"].ToString() + "_" + filename; //' 저장할 경로 + 파일 이름 -> url
                String filesize = oFile1.PostedFile.ContentLength.ToString();
                oFile1.PostedFile.SaveAs(strfile);

                //oXML.LoadXml("<fileinfo><fileinfo>");
                //XmlElement ofile = oXML.CreateElement("file");
                //ofile.setAttribute("name", filename);
                //ofile.setAttribute("storageid", "1");
                //ofile.setAttribute("id", filename);
                //ofile.setAttribute("location", strURL);
                //ofile.setAttribute("user_name", Session["user_name"].ToString());
                //ofile.setAttribute("dept_name", Session["user_dept_name"].ToString());
                ////파일 업로드 컴포넌트 문제로 사용
                ////사이즈가 필요 해서 사용함
                //ofile.setAttribute("size", oFile1.PostedFile.ContentLength);
                ////파일 상태 값 old;new;del
                //ofile.setAttribute("state", "NEW");
                //ofileinfo.documentElement.appendChild(ofile);
                //function addDictionary(strKey, fileInfo, filesize, filestate, username, deptname)
                Response.Write("<script type='text/javascript' language='javascript' >");
				Response.Write(" window.parent.opener.addDictionary('" + filename.Replace("'", "\'") + "','" + strURL + Session["user_code"].ToString() + "_" + filename.Replace("'", "\'") + "','" + filesize + "','NEW','" + Session["user_name_lng"].ToString().Replace(";", "^") + "','" + Session["user_dept_name_lng"].ToString().Replace(";", "^") + "');");
                Response.Write(" window.parent.opener.setAttInfo(); window.parent.window.close(); ");
                Response.Write("</script>");

            }
        }catch(System.Exception ex){
            throw ex;
        }finally{
        }
    }
}