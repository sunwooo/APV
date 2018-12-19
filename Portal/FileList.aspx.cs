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

using Covision.Framework;
using Covision.Framework.Data.Business;
using System.Text;

/// <summary>
/// 첨부파일 목록 출력 페이지
/// 결재목록 결재선 Layer 및 첨부파일 Layer 선택 시 사용됨
/// </summary>
public partial class Approval_Portal_FileList : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    /// <summary>
    /// 다국어 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        string culturecode = strLangID;//다국어 언어설정
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

    }
    /// <summary>
    /// 해당 결재문서 첨부파일 목록 조회
    /// </summary>
    /// <returns></returns>
    public string GetFileList()
    {
        string strResult = string.Empty;
        StringBuilder sbHtml = null;
        DataSet ds = null;
        DataPack INPUT = null;
        System.Xml.XmlDocument xmlDoc = null;
        System.Xml.XmlDocument xmlDocDscr = null;
        try
        {
            string strXML = string.Empty;
            sbHtml = new StringBuilder();
            ds = new DataSet();
            INPUT = new DataPack();

            xmlDoc = new System.Xml.XmlDocument();
            xmlDocDscr = new System.Xml.XmlDocument();


            INPUT.add("@USER_ID", Session["user_code"].ToString());
            INPUT.add("@WI_CREATED", "2009-01-01");
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wf_worklistquery01Attach", INPUT);
            }

            DataRowCollection colDR;
            colDR = ds.Tables[0].Rows;

            if (ds == null)
            {
               strResult = "ERROR";
            }
            else
            {
                if (ds.Tables[0].Rows.Count == 0) strResult = "No Data";
            }
            
            sbHtml.Append("<Table  width='100%' border='0' cellspacing='0' cellpadding='0' class='n_ptly' style='table-layout:fixed'>");
            sbHtml.Append("<tr>");
            sbHtml.Append("<td class='n_phtitle'>").Append(Resources.Approval.lbl_portal_newdocfiletitle).Append("</td>"); //최근 결재 문서의 첨부파일
            sbHtml.Append("<td class='n_more'><img src='");
            sbHtml.Append(Session["user_thema"]);
            sbHtml.Append("/Covi/main/more.png' width='15' height='13' /></td>");
            sbHtml.Append("</tr>");
            sbHtml.Append("<tr>");
            sbHtml.Append("<td colspan='2'></td>");
            sbHtml.Append("</tr>");
            sbHtml.Append("<tr>");
            sbHtml.Append("<td colspan='2' class='n_tgab' width='100%'>");
            sbHtml.Append("<table width='100%' border='0' cellspacing='0' cellpadding='0'>");
            sbHtml.Append("");
            sbHtml.Append("");

            if (strResult == "")
            {
                int nCount = 0;

                foreach (DataRow DR in colDR)
                {
                    strXML = DR["VALUE"].ToString();
                    xmlDoc.LoadXml(strXML);
                    System.Xml.XmlNodeList xmlList = xmlDoc.SelectNodes("forminfo/docinfo/attach/path");

                    xmlDocDscr.LoadXml(DR["PI_DSCR"].ToString());
                    System.Xml.XmlNode xmlDscr = xmlDocDscr.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");

                    for (int i = 1; i < xmlList.Count; i++)
                    {
                        nCount += 1;
                        if (nCount < 6)
                        {
                            string sFilePath = xmlList[i].InnerText;
                            string sFileURL = sFilePath.Substring(sFilePath.IndexOf("e-sign"), sFilePath.Length - sFilePath.IndexOf("e-sign"));
                            sFileURL = System.Configuration.ConfigurationManager.AppSettings["BackStorage"].ToString() + sFileURL.Replace("\\", "/");
                            string sFileName = sFilePath.Split('\\')[sFilePath.Split('\\').Length - 1];
                            sFileName = sFileName.Replace(sFileName.Split('_')[0] + "_", "");
                            string sImgName = sFileName.Split('.')[sFileName.Split('.').Length - 1];
                            if (sFileName.Length > 10)
                            {
                                sFileName = sFileName.Substring(0, 10) + "..";
                            }
                            string sSubject = DR["PI_SUBJECT"].ToString().Trim();
                            if (sSubject.Length > 12)
                            {
                                sSubject = sSubject.Substring(0, 12) + "..";
                            }
                            sbHtml.Append("<tr");
                            sbHtml.Append(" mode='");
                            sbHtml.Append("PROCESS");
                            sbHtml.Append("' piid='");
                            sbHtml.Append(DR["PI_ID"].ToString());
                            sbHtml.Append("' pfid='");
                            sbHtml.Append(DR["PF_ID"].ToString());
                            sbHtml.Append("' ptid='");
                            sbHtml.Append(DR["PF_PERFORMER_ID"].ToString());
                            sbHtml.Append("' wiid='");
                            sbHtml.Append(DR["WI_ID"].ToString());
                            sbHtml.Append("' bstate='");
                            sbHtml.Append(DR["PI_BUSINESS_STATE"].ToString());
                            sbHtml.Append("' fiid='");
                            sbHtml.Append(xmlDscr.Attributes["instanceid"].Value);
                            sbHtml.Append("' pfsk='");
                            sbHtml.Append(DR["PF_SUB_KIND"].ToString());
                            sbHtml.Append("' fmid='");
                            sbHtml.Append(xmlDscr.Attributes["id"].Value);
                            sbHtml.Append("' fmnm='");
                            sbHtml.Append(xmlDscr.Attributes["name"].Value);
                            sbHtml.Append("' fmpf='");
                            sbHtml.Append(xmlDscr.Attributes["prefix"].Value);
                            sbHtml.Append("' scid='");
                            sbHtml.Append(xmlDscr.Attributes["schemaid"].Value);
                            sbHtml.Append("' fmrv='");
                            sbHtml.Append(xmlDscr.Attributes["revision"].Value);
                            sbHtml.Append("' fmfn='");
                            sbHtml.Append(xmlDscr.Attributes["filename"].Value);
                            sbHtml.Append("' fileurl='");
                            sbHtml.Append(sFileURL).Append(":");
                            sbHtml.Append("' >");
                            sbHtml.Append("<td width='50%' style=\"text-overflow:ellipsis; overflow:hidden;white-space:nowrap;\" class='n_pttd02' width='150px' nowrap=\"true\" onclick='PopListSingle()'  >");
                            sbHtml.Append("<img src='");
                            sbHtml.Append(Session["user_thema"]);
                            sbHtml.Append("/Covi/main/icon_num0").Append(nCount).Append(".gif' />");

                            sbHtml.Append("&nbsp;<a href='#'>");
                            //sbHtml.Append(sFileURL);
                            //sbHtml.Append(":')\">");
                            sbHtml.Append(getImg(sImgName)).Append("&nbsp;");
                            sbHtml.Append(sFileName);
                            sbHtml.Append("</a>");

                            sbHtml.Append("</td>");
                            sbHtml.Append("<td width='50%' style='padding-left:3px;overflow:hidden;text-overflow:ellipsis; ' onclick='event_GalTable_ondblclick()' nowrap='true'  ><a hrdf='#'>");
                            sbHtml.Append(sSubject);
                            sbHtml.Append("</a></td>");
                            sbHtml.Append("</tr>");
                        }
                        if (nCount < 5)
                        {
                            sbHtml.Append("<tr>");
                            sbHtml.Append("<td colspan='2' class='n_line'></td>");
                            sbHtml.Append("</tr>");
                        }
                    }

                }
            }
            else
            {
                sbHtml.Append("<tr><td colspan='2'  class='n_pttd02'>최근 결재 문서의 첨부파일이 없습니다.</td></tr>");
            }
            sbHtml.Append("</table>");
            sbHtml.Append("</td></tr>");
            sbHtml.Append("</Table>");
            
            strResult = sbHtml.ToString();
        }
        catch (System.Exception ex)
        {
        }
        finally
        {
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
            if (sbHtml != null)
            {
                sbHtml = null;
            }

        }
        return strResult;
    }

    /// <summary>
    /// 첨부파일 확장자 대표 이미지 변환
    /// </summary>
    /// <param name="image">첨부파일 확장자</param>
    /// <returns>이미지명 포함 전체 경로</returns>
    private string getImg(string image)
    {
        string imageurl;
        if (image == "alz" || image == "asf" || image == "asp" || image == "avi" || 
            image == "bmp" || image == "cab" || image == "css" || image == "csv" || 
            image == "dll" || image == "doc" || image == "exe" || image == "gif" || 
            image == "zip" || image == "doc" || image == "ppt" || image == "dll" || 
            image == "htm" || image == "html" || image == "inf" || image == "iso" || 
            image == "jpg" || image == "js" || image == "lzh" || image == "mid" ||  
            image == "mp3" || image == "mpeg" || image == "mpg" || image == "pdf" || 
            image == "rar" || image == "reg" || image == "sys" || image == "txt" || 
            image == "htm" || image == "html" || image == "inf" || image == "iso" || 
            image == "vbs" || image == "wav" || image == "wma" || image == "wmv" || 
            image == "xls" || image == "xml" || image == "xsl" || image == "zip" || 
            image == "xlsx" || image == "docx" || image == "pptx" || image == "hwp")
        {
            imageurl = "<img src='" + Session["user_thema"] + "/Covi/Common/icon/icon_filetype_" + image + ".gif' style='vertical-align:middle;' />";
        }
        else
        {
            imageurl = "<img src='" + Session["user_thema"] + "/Covi/Common/icon/icon_filetype_unknown.gif' style='vertical-align:middle;' />";
        }
        return imageurl;
    }
}


