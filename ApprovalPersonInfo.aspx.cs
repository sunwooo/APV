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

public partial class COVIFlowNet_ApprovalPersonInfo : PageBase
{
    public string UserAlias, display_name, jobtitle, jobposition, unit_name, email, reserved3, reserved4, reserved5, deputy, deputy_usage, deputy_name;

    protected void Page_Load(object sender, EventArgs e)
    {
        

        string sQuery;
        //DataSet oDS = new DataSet();

        //다국어 언어설정
        string culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        try
        {
            //sQuery = System.String.Format("SELECT A.PERSON_CODE, A.DISPLAY_NAME, A.UNIT_NAME, A.JOBPOSITION_Z, A.JOBTITLE_Z, A.RESERVED3, A.RESERVED4, A.RESERVED5, A.DEPUTY, A.DEPUTY_USAGE, A.EMAIL, A.DEPUTY_NAME FROM [ORG_PERSON] A with (NOLOCK) WHERE A.PERSON_CODE = '{0}' ", Session["user_code"]);
            //DataPack INPUT = new DataPack();
            //SqlDacBase SqlDbAgent = new SqlDacBase();
            //SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();

            //oDS = SqlDbAgent.ExecuteDataSet(CommandType.Text, sQuery, INPUT);
            //SqlDbAgent.Dispose();

            // if (oDS != null)
            // {
            //     UserAlias = oDS.Tables[0].Rows[0]["PERSON_CODE"].ToString();
            //     display_name = oDS.Tables[0].Rows[0]["DISPLAY_NAME"].ToString();
            //     unit_name = oDS.Tables[0].Rows[0]["UNIT_NAME"].ToString();
            //     jobposition = oDS.Tables[0].Rows[0]["JOBPOSITION_Z"].ToString().Split('&')[0];
            //     jobtitle = oDS.Tables[0].Rows[0]["JOBTITLE_Z"].ToString().Split('&')[0];
            //     reserved3 = oDS.Tables[0].Rows[0]["RESERVED3"].ToString();      // 부재기간 시작
            //     reserved4 = oDS.Tables[0].Rows[0]["RESERVED4"].ToString();      // 부재기간 끝
            //     reserved5 = oDS.Tables[0].Rows[0]["RESERVED5"].ToString();      // 대결자 정보
            //     deputy = oDS.Tables[0].Rows[0]["DEPUTY"].ToString();            // 대결자 정보
            //     deputy_usage = oDS.Tables[0].Rows[0]["DEPUTY_USAGE"].ToString();// 대결자 정보
            //     deputy_name = oDS.Tables[0].Rows[0]["DEPUTY_NAME"].ToString();  // 대결자 정보
            //     email = oDS.Tables[0].Rows[0]["EMAIL"].ToString();              // 대결자 정보
            // }

            ////using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter("DbProvider", "ORG_ConnectionString", true))
            //using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter(Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["DbProvider"].ToString(), Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["ORG_ConnectionString"].ToString(), false))
            //{
            //    oDS = adapter.FillDataSet(sQuery);

            //    if (oDS != null)
            //    {
            //        UserAlias = oDS.Tables[0].Rows[0]["PERSON_CODE"].ToString();
            //        display_name = oDS.Tables[0].Rows[0]["DISPLAY_NAME"].ToString();
            //        unit_name = oDS.Tables[0].Rows[0]["UNIT_NAME"].ToString();
            //        jobposition = oDS.Tables[0].Rows[0]["JOBPOSITION_Z"].ToString().Split('&')[0];
            //        jobtitle = oDS.Tables[0].Rows[0]["JOBTITLE_Z"].ToString().Split('&')[0];
            //        reserved3 = oDS.Tables[0].Rows[0]["RESERVED3"].ToString();      // 부재기간 시작
            //        reserved4 = oDS.Tables[0].Rows[0]["RESERVED4"].ToString();      // 부재기간 끝
            //        reserved5 = oDS.Tables[0].Rows[0]["RESERVED5"].ToString();      // 대결자 정보
            //        deputy = oDS.Tables[0].Rows[0]["DEPUTY"].ToString();            // 대결자 정보
            //        deputy_usage = oDS.Tables[0].Rows[0]["DEPUTY_USAGE"].ToString();// 대결자 정보
            //        deputy_name = oDS.Tables[0].Rows[0]["DEPUTY_NAME"].ToString();  // 대결자 정보
            //        email = oDS.Tables[0].Rows[0]["EMAIL"].ToString();              // 대결자 정보
            //    }
            //}
        }
        catch (System.Exception ex)
        {
                        
            throw new System.Exception(null, ex);
        }
        finally
        {
            //if (oDS != null)
            //{
            //    oDS.Dispose();
            //    oDS = null;
            //}
        }        
    }
}
