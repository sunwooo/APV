﻿using System;
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
/// 개인배포그룹 설정 리스트페이지
/// </summary>
public partial class DeployList_DeploylineList : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string UserID;


    public string msg_err_apv, msg_err_apv_delete, msg_err_apv_select;
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            //다국어 언어설정
            string culturecode = strLangID;
            if (Session["user_language"].ToString() != null)
            {
                culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
            }
            Page.UICulture = culturecode;
            Page.Culture = culturecode;

            Title = Resources.Approval.lbl_privateapv;
            ApvlinelistPageName.Text = Resources.Approval.lbl_doc_deploy_setting;
            ApvlinelistPagePath.Text = Resources.Approval.lbl_approval;
            ApvlinelistPageName2.Text = Resources.Approval.lbl_doc_deploy_setting;

            msg_err_apv = Resources.Approval.msg_030;
            msg_err_apv_delete = Resources.Approval.msg_032;
            msg_err_apv_select = Resources.Approval.msg_031;
            //다국어 처리부 끝

            Response.Expires = 0;
            Response.CacheControl = "private";
            Response.Buffer = true;
            UserID = Session["user_code"].ToString(); 
        }
        catch (System.Exception ex)
        {
            HandleException(ex);
        }
        finally
        {
            //code
        }
    }
    private void HandleException(System.Exception _Ex)
    {
        try
        {

            Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)) + "]]></error>");
        }
        catch (System.Exception Ex)
        {
            Response.Write("<error><![CDATA[" + Ex.Message + "]]></error>");
        }
    }

}
