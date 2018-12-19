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


public partial class Approval_Forms_FormLink4HD : System.Web.UI.Page
{
    public System.String userid; //사용자사번
    public System.String key; //key
    public System.String fmpf; //양식 prefix
    public System.String fmid; //양식 id
    public System.String scid; //스키마 id
    public System.String fmrv; //양식 revision
    public System.String fmnm; //양식명

    protected void Page_Load(object sender, EventArgs e)
    {
        DataSet oDS = null;
        DataPack INPUT = null;
        SqlDacBase SqlDbAgent = null;
        try
        {
            //파라미터 받기
            userid = Request.QueryString["sabun"];
            key = Request.QueryString["WEBGHOSTKEY01"];
            fmpf = Request.QueryString["fmpf"];

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


            if (Session == null || Session["user_code"] == null || Session["user_code"].ToString().Equals(""))
            {
                if (HttpContext.Current.User.Identity.Name == null || HttpContext.Current.User.Identity.Name.Length <= 0)
                {
            
                    if (Convert.ToString(System.Configuration.ConfigurationManager.AppSettings["AuthMode"]) == "FORMS")
                    {
                        FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(userid, false, 5000);
                        string encTicket = FormsAuthentication.Encrypt(ticket);
                        Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket));
                        Response.Cookies["GW_AUTH_TYPE"].Value = "FORMS";
                        Response.Cookies["GW_AUTH_TYPE"].Domain = System.Configuration.ConfigurationManager.AppSettings["URLDomain"];
                    }
                    else
                    { }

                    //Session 생성
                    Covision.Framework.Web.Utility.UtilAuthHelper.Instance.SetUserInfo(userid);
                }
                else
                {	
				    Covision.Framework.Web.Utility.UtilAuthHelper.Instance.SetUserInfo(HttpContext.Current.User.Identity.Name.Split('\\')[HttpContext.Current.User.Identity.Name.Split('\\').GetUpperBound(0)]);
                 
                }
            }

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

    private string pReplaceSpecialCharacter(string strContent)
    {
        if (strContent != null)
        {
            strContent = strContent.Replace("\\", "\\\\");
            strContent = strContent.Replace("\r\n", "\\r\\n");
            strContent = strContent.Replace("\n", "\\n");
            strContent = strContent.Replace("'", "\\'");
        }
        return strContent;
    }
}
