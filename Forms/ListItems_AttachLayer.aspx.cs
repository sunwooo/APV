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
/// 게시판 전자결재 첨부파일 레이어
/// </summary>
public partial class Approval_Forms_ListItems_AttachLayer : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
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
}
