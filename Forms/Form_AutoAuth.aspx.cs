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

public partial class Approval_Forms_Form_AutoAuth : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        DataSet oDS = null;
        DataPack INPUT = null;
        SqlDacBase SqlDbAgent = null;

        string g_UserID = String.Empty;
        string g_mode = String.Empty;
        string g_piid = String.Empty;
        string g_wiid = String.Empty;
        string g_bstate = String.Empty;
        string g_fmid = String.Empty;
        string g_fmpf = String.Empty;
        string g_fmrv = String.Empty;
        string g_fiid = String.Empty;
        string g_scid = String.Empty;
        string g_pfsk = String.Empty;
        string g_pfid = String.Empty;
        string g_ptid = String.Empty;
        string g_pibd1 = String.Empty;
        string g_secdoc = String.Empty;

        try
        {
            //파라미터 받기
            if (Request.QueryString["UserID"] != null && Request.QueryString["UserID"] != "") g_UserID = Request.QueryString["UserID"];
            if (Request.QueryString["mode"] != null && Request.QueryString["mode"] != "") g_mode = Request.QueryString["mode"];
            if (Request.QueryString["piid"] != null && Request.QueryString["piid"] != "") g_piid = Request.QueryString["piid"];
            if (Request.QueryString["wiid"] != null && Request.QueryString["wiid"] != "") g_wiid = Request.QueryString["wiid"];
            if (Request.QueryString["bstate"] != null && Request.QueryString["bstate"] != "") g_bstate = Request.QueryString["bstate"];
            if (Request.QueryString["fmid"] != null && Request.QueryString["fmid"] != "") g_fmid = Request.QueryString["fmid"];
            if (Request.QueryString["fmpf"] != null && Request.QueryString["fmpf"] != "") g_fmpf = Request.QueryString["fmpf"];
            if (Request.QueryString["fmrv"] != null && Request.QueryString["fmrv"] != "") g_fmrv = Request.QueryString["fmrv"];
            if (Request.QueryString["fiid"] != null && Request.QueryString["fiid"] != "") g_fiid = Request.QueryString["fiid"];
            if (Request.QueryString["scid"] != null && Request.QueryString["scid"] != "") g_scid = Request.QueryString["scid"];
            if (Request.QueryString["pfsk"] != null && Request.QueryString["pfsk"] != "") g_pfsk = Request.QueryString["pfsk"];
            if (Request.QueryString["pfid"] != null && Request.QueryString["pfid"] != "") g_pfid = Request.QueryString["pfid"];
            if (Request.QueryString["ptid"] != null && Request.QueryString["ptid"] != "") g_ptid = Request.QueryString["ptid"];
            if (Request.QueryString["pibd1"] != null && Request.QueryString["pibd1"] != "") g_pibd1 = Request.QueryString["pibd1"];
            if (Request.QueryString["secdoc"] != null && Request.QueryString["secdoc"] != "") g_secdoc = Request.QueryString["secdoc"];
            
            /*
            //양식정보 획득 
            INPUT = new DataPack();
            INPUT.add("@fmpf", this.fmpf);
            using (SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wfform_forminfo_by_fmpf", INPUT);
            }
            if (oDS != null && oDS.Tables[0].Rows.Count > 0)
            {

                foreach (System.Data.DataRow oDR in oDS.Tables[0].Rows)
                {
                    fmid = oDR["FORM_ID"].ToString();
                    scid = oDR["SCHEMA_ID"].ToString();
                    fmrv = oDR["REVISION"].ToString();
                    fmnm = oDR["FORM_NAME"].ToString();
                }
            }
            */

            if (Session == null || Session["user_code"] == null || Session["user_code"].ToString().Equals(""))
            {
                if (HttpContext.Current.User.Identity.Name == null || HttpContext.Current.User.Identity.Name.Length <= 0)
                {

                    if (Convert.ToString(System.Configuration.ConfigurationManager.AppSettings["AuthMode"]) == "FORMS")
                    {
                        FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(g_UserID, false, 5000);
                        string encTicket = FormsAuthentication.Encrypt(ticket);
                        Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket));
                        Response.Cookies["GW_AUTH_TYPE"].Value = "FORMS";
                        Response.Cookies["GW_AUTH_TYPE"].Domain = System.Configuration.ConfigurationManager.AppSettings["URLDomain"];
                    }
                    else
                    { }

                    //Session 생성
                    Covision.Framework.Web.Utility.UtilAuthHelper.Instance.SetUserInfo(g_UserID);
                }
                else
                {
                    Covision.Framework.Web.Utility.UtilAuthHelper.Instance.SetUserInfo(HttpContext.Current.User.Identity.Name.Split('\\')[HttpContext.Current.User.Identity.Name.Split('\\').GetUpperBound(0)]);

                }
            }


            string sUrl = String.Empty;
            sUrl = "Form.aspx?mode=" + g_mode + "&piid=" + g_piid + "&wiid=" + g_wiid + "&bstate=" + g_bstate + "&fmid=" + g_fmid + "&fmpf=" + g_fmpf + "&fmrv=" + g_fmrv + "&fiid=" + g_fiid + "&scid=" + g_scid + "&pfsk=" + g_pfsk + "&pfid=" + g_pfid + "&ptid=" + g_ptid + "&pibd1=" + g_pibd1 + "&secdoc=" + g_secdoc;

            Response.Redirect(sUrl);

        }
        catch (System.Exception ex)
        {
            Response.Write(ex.Message);
        }
        finally
        {
            if (oDS != null)
            {
                oDS.Dispose();
                oDS = null;
            }
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
        }



    }
}