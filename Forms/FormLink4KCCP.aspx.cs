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

//KCCP문화진흥 ERP 연계 페이지

public partial class Approval_Forms_FormLink4KCCP : PageBase //PageBase
{
    public System.String userid; //사용자id
    public System.String passwd; //사용자 pw
    public System.String security; //??
    public System.String gw_num; //그룹웨어 관리번호
    public System.String title; //기안서제목
    public System.String htmmess; //본문내역
    public System.String ing_status; //??
    public System.String end_status; //??
    public System.String EAID; //시스템구분
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
        //System.Text.UTF8Encoding utf8 = new System.Text.UTF8Encoding() ;
        try
        {
            //파라미터 받기
            userid = Request.Form["userid"];
            passwd = Request.Form["passwd"];
            security = Request.Form["security"];
            gw_num = Request.Form["gw_num"];
            //Byte[] encodedBytes = utf8.GetBytes(Request.Form["title"]);
            //title = pReplaceSpecialCharacter(utf8.GetString(encodedBytes));

            title = pReplaceSpecialCharacter(Request.Form["title"]);
            htmmess = pReplaceSpecialCharacter(Request.Form["htmmess"]);
            ing_status = Request.Form["ing_status"];
            end_status = Request.Form["end_status"];
            EAID = Request.Form["EAID"];
            fmpf = Request.Form["fmpf"];

            //양식정보 획득 
            INPUT = new DataPack();
            SqlDbAgent = new SqlDacBase();
            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
            INPUT.add("@fmpf", this.fmpf);

            oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wfform_forminfo_by_fmpf", INPUT);
            SqlDbAgent.Dispose();
            SqlDbAgent = null;
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

            ////양식정보 획득
            //using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter(Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["DbProvider"].ToString(), Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["FORM_DEF_ConnectionString"].ToString(), false))
            //{
            //    System.Data.IDataParameter iparam = adapter.CreateParameter();
            //    iparam.DbType = System.Data.DbType.String;
            //    iparam.ParameterName = "@fmpf";
            //    iparam.Value = this.fmpf;
            //    adapter.DbSelectParameters.Add(iparam);

            //    oDS = adapter.FillDataSet("dbo.usp_wfform_forminfo_by_fmpf", CommandType.StoredProcedure);
            //    if (oDS != null && oDS.Tables[0].Rows.Count > 0)
            //    {

            //        foreach (System.Data.DataRow oDR in oDS.Tables[0].Rows)
            //        {
            //            fmid = oDR["FORM_ID"].ToString();
            //            scid = oDR["SCHEMA_ID"].ToString();
            //            fmrv = oDR["REVISION"].ToString();
            //            fmnm = oDR["FORM_NAME"].ToString();
            //        }
            //    }
            //}           

        }catch(System.Exception ex){
            Response.Write(ex.Message);
        }
        finally{
            if (oDS != null)
            {
                oDS.Dispose();
                oDS = null;
            }
            if (SqlDbAgent != null)
            {
                SqlDbAgent.Dispose();
                SqlDbAgent = null;
            }
            if (INPUT != null)
            {
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
