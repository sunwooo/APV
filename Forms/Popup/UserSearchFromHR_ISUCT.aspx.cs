using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

//2015.11.25 PSW 추가
using System.Text;
using System.Data;
using System.IO;
using Covision.Framework;
using Covision.Framework.Data.Business;
using Covision.Framework.Data.ComBase;



public partial class Approval_Forms_Popup_UserSearchFromHR_ISUCT : PageBase
{
    public string gKind = String.Empty;
    public string gDataRowNo = String.Empty;
    public string ymAccount = String.Empty;

    //2015.11.25 PSW 추가
    public string strMemo = String.Empty;
    public string pstnCode = String.Empty;
    public string cdHRDept = String.Empty;
    public string dsHRDept = String.Empty;
    public string cd_Dept = String.Empty;
    public string dsDept = String.Empty;
    public string requestDeptCD = String.Empty;
    public string gcode = String.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.QueryString["kind"] != null && Request.QueryString["kind"] != "") gKind = Request.QueryString["kind"];

        if (Request.QueryString["DataRowNo"] != null && Request.QueryString["DataRowNo"] != "") gDataRowNo = Request.QueryString["DataRowNo"];

        if (Request.QueryString["YMAccount"] != null && Request.QueryString["YMAccount"] != "") ymAccount = Request.QueryString["YMAccount"];

        if (Request.QueryString["RequestDeptCD"] != null && Request.QueryString["RequestDeptCD"] != "") requestDeptCD = Request.QueryString["RequestDeptCD"];

        if (Request.QueryString["cd_Dept"] != null && Request.QueryString["cd_Dept"] != "") gcode = Request.QueryString["cd_Dept"];

        

        //2015.11.25 PSW 추가
        /*Response.AddHeader("pragma", "no-cache");
        Response.AddHeader("cache-control", "private");
        Response.CacheControl = "no-cache";
        Response.ContentType = "text/xml";

        Response.Write("<?xml version=\"1.0\" encoding=\"utf-8\"?><response>");
        */
        DataPack INPUT = null;
        DataSet ds = null;

        //2015.11.25 PSW 추가
        try
        {
            INPUT = new DataPack();
            ds = new DataSet();

            //Response.Write(Sessions.USER_DEPT_CODE.ToString().Substring(6));


            //(1) HR 뷰 데이터 가져오는 SP
            string sProc = "APR_SelectSearchBudgetDeptList";

            //INPUT.add("@ENT_CODE", Request["ENT_CODE"]);
            //INPUT.add("@ENT_CODE", "ISU_CT");
            INPUT.add("@YR_ACCOUNT", ymAccount.Substring(0,4));
            INPUT.add("@CD_DEPT", requestDeptCD);
            //INPUT.add("@CD_HRDEPT", "B123");

            //Sessions.USER_DEPT_CODE.ToString()
            //예 : ISU_STISU_ST011

            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;  //COVI_GROUPWARE DB

                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sProc, INPUT);

                            
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    cd_Dept = ds.Tables[0].Rows[i]["CD_DEPTOFFICER"].ToString();     //부서코드
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