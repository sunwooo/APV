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

public partial class COVIFlowNet_ListItemsXSL_Template : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            //code
            String strLangID = Session["user_language"].ToString();
            //다국어 언어설정
            string culturecode = strLangID; //"en-US"; "ja-JP";
            Page.UICulture = culturecode;
            Page.Culture = culturecode;
        }
        catch (System.Exception ex)
        {
            
            throw new Exception(null, ex);
        }
        finally
        {
            //code
        }

    }
}
