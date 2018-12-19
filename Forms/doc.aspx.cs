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


public partial class Approval_Forms_doc : System.Web.UI.Page
{
    public String fiid; //process id
    public String PIDC;//pidc
    
    public string _piid = string.Empty;
    //public System.String fmpf; //양식 prefix
    //public System.String fmid; //양식 id
    //public System.String scid; //스키마 id
    //public System.String fmrv; //양식 revision
    //public System.String fmnm; //양식명
    public String mobileyn; //모바일 호출여부
    public String userid; //사용자 id

    protected void Page_Load(object sender, EventArgs e)
    {
        DataSet oDS = null;
        DataPack INPUT = null;
        try
        {
            //파라미터 받기
            fiid = Request.QueryString["appId"];
            mobileyn = Request.QueryString["mobileyn"];
            userid = Session["user_code"].ToString();
            //2009.03 : Guid 변경
            
            String sWorkitemListQuery = String.Empty;
            sWorkitemListQuery = "dbo.usp_wfform_getPROCESSID";
            oDS = new DataSet();
            INPUT = new DataPack();
            INPUT.add("@fiid", fiid);
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_INST_ConnectionString").ToString();
                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sWorkitemListQuery, INPUT);

                if (oDS.Tables[0].Rows.Count > 0)
                {
                    _piid = oDS.Tables[0].Rows[0]["PROCESS_ID"].ToString();
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
                }
                else
                {
                    if (!HttpContext.Current.User.Identity.Name.ToLower().Equals(userid))
                    {
                        if (Convert.ToString(System.Configuration.ConfigurationManager.AppSettings["AuthMode"]) == "FORMS")
                        {
                            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(userid, false, 5000);
                            string encTicket = FormsAuthentication.Encrypt(ticket);
                            Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket));
                            Response.Cookies["GW_AUTH_TYPE"].Value = "FORMS";
                            Response.Cookies["GW_AUTH_TYPE"].Domain = System.Configuration.ConfigurationManager.AppSettings["URLDomain"];
                        }
                    }
                }
            }
            else
            {
                if (!Session["user_code"].ToString().ToLower().Equals(userid))
                {
                    if (Convert.ToString(System.Configuration.ConfigurationManager.AppSettings["AuthMode"]) == "FORMS")
                    {
                        FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(userid, false, 5000);
                        string encTicket = FormsAuthentication.Encrypt(ticket);
                        Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket));
                        Response.Cookies["GW_AUTH_TYPE"].Value = "FORMS";
                        Response.Cookies["GW_AUTH_TYPE"].Domain = System.Configuration.ConfigurationManager.AppSettings["URLDomain"];

                        Covision.Framework.Web.Utility.UtilAuthHelper.Instance.SetUserInfo(userid);
                    }
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

        try{

        String sWorkitemListQuery2 = String.Empty;
            sWorkitemListQuery2 = "dbo.usp_wf_getprocessinstance";
            oDS = new DataSet();
            INPUT = new DataPack();
            INPUT.add("@PI_ID", _piid);
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sWorkitemListQuery2, INPUT);
                if ((oDS == null) || (oDS.Tables.Count == 0 || oDS.Tables[0].Rows.Count == 0))
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ARCHIVE_ConnectionString").ToString();
                    oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sWorkitemListQuery2, INPUT);
                    if ((oDS == null) || (oDS.Tables.Count == 0 || oDS.Tables[0].Rows.Count == 0))
                    {
                        throw new System.Exception( Resources.Approval.msg_082 + " : " + _piid);
                    }
                    else
                    {
                        PIDC = pReplaceSpecialCharacter(oDS.Tables[0].Rows[0]["PI_DSCR"].ToString());
                    }
                }
                else
                {
                    PIDC = pReplaceSpecialCharacter(oDS.Tables[0].Rows[0]["PI_DSCR"].ToString());
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