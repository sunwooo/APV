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
using System.Web.Services;
using System.Web.Services.Protocols;

/*
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
using System.Text;
using System.Xml;
using System.DirectoryServices;
*/
using Covision.Framework.Web.Utility;
using Covision.Framework.Web.UI.Controls;




public partial class Approval_Forms_request : System.Web.UI.Page
{
    public System.String userid; //사용자사번
    public System.String key; //key
    public System.String fmpf; //양식 prefix
    public System.String fmid; //양식 id
    public System.String scid; //스키마 id
    public System.String fmrv; //양식 revision
    public System.String fmnm; //양식명
    public System.String _fromData; //본문내용
    public System.String _gbnno;// 전자증빙측 ID 
    public System.String _pwd; //메일용 비번
    public System.String wStrLanguage = "ko-KR";

    protected void Page_Load(object sender, EventArgs e)
    {
        DataSet oDS = null;
        DataPack INPUT = null;
        SqlDacBase SqlDbAgent = null;
        try
        {
            //파라미터 받기
            //userid = Request.QueryString["empNo"];
            userid = Request["empNo"];
            key = Request["accessToken"];
            //userid = "ISU_STTMP1";
            //key = "828C88F34ECB4C1CA8D89E018C6FAD1A";

            fmpf = Request["fmpf"];
            _fromData = Request["content"];
            _gbnno = Request["gbnno"];
            _fromData = System.Web.HttpUtility.UrlDecode(_fromData);
            pReplaceSpecialCharacter(_fromData);

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

            //>> 2017.10.25 세션 없을 시 인증
            if (Session == null || Session["user_code"] == null || Session["user_code"].ToString().Equals(""))
            {
                
                DataSet ds = new DataSet();
                DataPack INPUT1 = new DataPack();
                DataPack OUTPUT = null;

                INPUT1.add("@PERSON_CODE", userid);
                INPUT1.add("@GROUPWARE_PWD", key);

                using (Covi.Business.PortalService.OrgMap.NTxWorker obj = new Covi.Business.PortalService.OrgMap.NTxWorker())
                {
                    OUTPUT = obj.CheckPassword(INPUT1);
                }
                if (OUTPUT != null || OUTPUT.DataSet != null || OUTPUT.DataSet.Tables.Count > 0)
                {
                    ds = OUTPUT.DataSet.Copy();
                    DataRow dr = ds.Tables[0].Rows[0];
                    if (0 == string.Compare(dr["PWD_CHECK_COUNT"].ToString(), "0"))
                    {
                        //인증실패
                    }
                    else
                    {
                        
                        INPUT1 = new DataPack();
                        OUTPUT = null;

                        INPUT1.add("@PERSON_CODE", userid);
                        INPUT1.add("@USER_LANGUAGE", wStrLanguage);

                        using (Covi.Business.PortalService.OrgMap.NTxWorker obj = new Covi.Business.PortalService.OrgMap.NTxWorker())
                        {
                            OUTPUT = obj.Set_Person_Language(INPUT1);
                        }

                            //userid = "ISU_ST" + userid;
                            Covision.Framework.Web.Utility.UtilAuthHelper.Instance.SetUserInfo(userid);
                                            
                    }
                }
            }
            //<< 2017.10.25

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

            /* >> 2017.10.25 이전 원본
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
             << */

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
            //strContent = strContent.Replace("\\", "\\\\");
            //strContent = strContent.Replace("\r\n", "\\r\\n");
            //strContent = strContent.Replace("\n", "\\n");
            //strContent = strContent.Replace("'", "\\'");
            //_fromData = strContent.Replace("\n", "");
            //_fromData = strContent.Replace("\r", "");
            //_fromData = _fromData.Replace("\"", "");
            strContent = strContent.Replace("\\", "\\\\");
            strContent = strContent.Replace("\r\n", "\\r\\n");
            strContent = strContent.Replace("\n", "\\n");
            _fromData = strContent.Replace("'", "\\'");

            
        }
        return _fromData;
    }
}
