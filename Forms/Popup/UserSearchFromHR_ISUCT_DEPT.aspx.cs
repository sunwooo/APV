using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

//2016.1.29 PSW 추가
using System.Text;
using System.Data;
using System.IO;
using Covision.Framework;
using Covision.Framework.Data.Business;
using Covision.Framework.Data.ComBase;




public partial class Approval_Forms_Popup_UserSearchFromHR_ISUCT_DEPT : PageBase
{
    public string gKind = String.Empty;
    public string gDataRowNo = String.Empty;
    public string yrAccount = String.Empty;

    //2015.11.25 PSW 추가
    public string strMemo = String.Empty;
    public string pstnCode = String.Empty;
    //public string cdHRDept = String.Empty;
    //public string dsHRDept = String.Empty;
    public string cdDeptOfficer = String.Empty;
    public string dsDeptOfficer = String.Empty;


    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.QueryString["kind"] != null && Request.QueryString["kind"] != "") gKind = Request.QueryString["kind"];

        if (Request.QueryString["DataRowNo"] != null && Request.QueryString["DataRowNo"] != "") gDataRowNo = Request.QueryString["DataRowNo"];

        if (Request.QueryString["YRAccount"] != null && Request.QueryString["YRAccount"] != "") yrAccount = Request.QueryString["YRAccount"];

        

        //2016.1.29 PSW 추가
        
        DataPack INPUT = null;
        DataSet ds = null;

        //2015.11.25 PSW 추가
        try
        {
            INPUT = new DataPack();
            ds = new DataSet();

            //Response.Write(Sessions.USER_DEPT_CODE.ToString().Substring(6));


            //(1) HR 뷰 데이터 가져오는 SP
            //string sProc = "APR_SelectMappingInfoFromHR";
            string sProc = "APR_SelectSearchBudgetDeptFromConERP";

            //INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
            //INPUT.add("@ENT_CODE", "ISU_CT");
            //INPUT.add("@CD_HRDEPT", Sessions.USER_DEPT_CODE.ToString().Substring(6));
            //INPUT.add("@CD_HRDEPT", "B123");
            //재경팀 : B313

            //Sessions.USER_DEPT_CODE.ToString()
            //예 : ISU_STISU_ST011
            INPUT.add("@YR_ACCOUNT", yrAccount);

            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB
                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    cdDeptOfficer = ds.Tables[0].Rows[i]["CD_DEPTOFFICER"].ToString();     //부서코드
                    dsDeptOfficer = ds.Tables[0].Rows[i]["DS_DEPTOFFICER"].ToString();     //부서명칭

                }
            }



            //Response.Write(ds.GetXml());

            //Response.Write("<result>SUCEESS</result>");

            //strMemo = ds.GetXml();
            //Response.Write(strMemo);


        }
        catch (Exception ex)
        {

        }
        finally
        {
            //Response.Write("</response>");

            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
        }

    } 
}