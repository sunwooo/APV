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
using WSCall;

public partial class Approval_Portal_WS_CNM_GetUseHoliday : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");

        string emp_id, startdate, enddate;
        string rtn;

        try
        {   
            emp_id = Request.QueryString["emp_id"];
            startdate = Request.QueryString["startdate"];
            enddate = Request.QueryString["enddate"];
            WSCall.CNM oCNM = new CNM(ConfigurationManager.AppSettings["WS_CNM"].ToString() + "s_holiday.asmx");
            rtn = oCNM.GetUseHoliday(emp_id, startdate, enddate);
            Response.Write(rtn);
        }
        catch (Exception ex)
        {
            throw new System.Exception(null, ex);
        }
        finally
        {
            Response.Write("</response>");
        }
    }
}
