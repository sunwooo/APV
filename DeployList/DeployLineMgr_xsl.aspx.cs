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
/// 배포그룹 설정 등록페이지 xsl
/// </summary>
public partial class DeployList_DeployLineMgr_xsl : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            string culturecode = Session["user_language"].ToString();
            Page.UICulture = culturecode;
            Page.Culture = culturecode;
        }
        catch (Exception ex)
        {
            HandleException(ex);
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