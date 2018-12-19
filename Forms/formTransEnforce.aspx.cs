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

/// <summary>
/// 시행문 변환에 사용되는 페이지
/// </summary>
public partial class COVIFlowNet_Forms_formTransEnforce : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;
        

        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
        System.String sfmcnt = Request.QueryString["fmcnt"];
        System.Int16 ifmcnt;

        if(sfmcnt == "") ifmcnt = 0;
        else ifmcnt = Int16.Parse(sfmcnt);
        
        System.String strResp = "";
        try
        {
            strResp = pGetEnforceFormInfo(ifmcnt);
            Response.Write(strResp);
        }
        catch(System.Exception Ex)
        {
            HandleException(Ex);
        }
        finally
        {
            Response.Write("</response>");
        }
    }

    private string pGetEnforceFormInfo(System.Int16 efmcnt)
    {       
        System.Text.StringBuilder sbFormInfo = null;
        //CfnFormManager.WfFormManager objMTS;
        DataSet DS = null;

        DataPack INPUT = null;
        SqlDacBase SqlDbAgent = null;
        try
        {
            sbFormInfo = new System.Text.StringBuilder();
            //CfnFormManager.WfFormManager objMTS = new CfnFormManager.WfFormManager();           
            string strQuery = "[dbo].[usp_wf_GetEnforceFormInfo]";
            DS = new DataSet();
           
            INPUT = new DataPack();
            SqlDbAgent = new SqlDacBase();
            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();

            DS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, strQuery, INPUT);
            SqlDbAgent.Dispose();
            SqlDbAgent = null;
            if (DS != null)
            {
                if (DS.Tables[0].Rows.Count > 0)
                {
                    DataRow DR;

                    DR = DS.Tables[0].Rows[0];
                    if (DR["FORM_ID"].ToString() != null)
                    {
                        sbFormInfo.Append("<fmid>" + DR["FORM_ID"].ToString() + "</fmid>");
                        sbFormInfo.Append("<fmnm>" + DR["FORM_NAME"].ToString() + "</fmnm>");
                        sbFormInfo.Append("<fmpf>" + DR["FORM_PREFIX"].ToString() + "</fmpf>");
                        sbFormInfo.Append("<fmrv>" + DR["REVISION"].ToString() + "</fmrv>");
                        sbFormInfo.Append("<scid>" + DR["SCHEMA_ID"].ToString() + "</scid>");  //'schema ID
                        sbFormInfo.Append("<fmfn>" + DR["FILE_NAME"].ToString() + "</fmfn>");  //'fielname
                    }
                }
            }
            else
            {
                throw new System.Exception("시행문 양식 값이 존재하지 않습니다");
            }           

            ////using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter("DbProvider", "FORM_DEF_ConnectionString", true))
            //using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter(Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["DbProvider"].ToString(), Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["FORM_DEF_ConnectionString"].ToString(), false))
            //{
            //    DS = adapter.FillDataSet(strQuery);

            //    if(DS != null)
            //    {
            //        if(DS.Tables[0].Rows.Count > 0)
            //        {
            //            DataRow DR;
                        
            //            DR = DS.Tables[0].Rows[0];
            //            if(DR["FORM_ID"].ToString() != null)
            //            {
            //                sbFormInfo.Append("<fmid>" + DR["FORM_ID"].ToString() + "</fmid>");
            //                sbFormInfo.Append("<fmnm>" + DR["FORM_NAME"].ToString() + "</fmnm>");
            //                sbFormInfo.Append("<fmpf>" + DR["FORM_PREFIX"].ToString() + "</fmpf>");
            //                sbFormInfo.Append("<fmrv>" + DR["REVISION"].ToString() + "</fmrv>");
            //                sbFormInfo.Append("<scid>" + DR["SCHEMA_ID"].ToString() + "</scid>");  //'schema ID
            //                sbFormInfo.Append("<fmfn>" + DR["FILE_NAME"].ToString() + "</fmfn>");  //'fielname
            //            }
            //        }
            //    }
            //    else
            //    {
            //        throw new System.Exception("시행문 양식 값이 존재하지 않습니다");
            //    }
            //}
            

            //System.String strFIIDs;
            //System.Int16 i;
            //for(i=0;i<efmcnt;i++)
            //{
            //    string strFormInstanceID = CfnFormManager.WfFormManager.NewGUID();
            //    strFIIDs = strFIIDs + ";" + strFormInstanceID;
            //}
            //if(strFIIDs.Length > 1) strFIIDs = strFIIDs.Remove(0, 1);
            //sbFormInfo.Append("<fiid>").Append(strFIIDs).Append("</fiid>");

            //System.EnterpriseServices.ServicedComponent.DisposeObject(objMTS);
            //objMTS = null;

            return sbFormInfo.ToString();
        }
        catch(System.Exception Ex)
        {           
            throw new Exception(null, Ex);
        }
        finally
        {
            if (sbFormInfo != null)
            {
                sbFormInfo = null;
            }
            if (DS != null)
            {
                DS.Dispose();
                DS = null;
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
    
    private void HandleException(System.Exception _Ex)
    {
        try
        {
            Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)) + "]]></error>");
        }
        catch(System.Exception Ex)
        {
            Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(Ex)) + "]]></error></response>");
        }
    }
}
