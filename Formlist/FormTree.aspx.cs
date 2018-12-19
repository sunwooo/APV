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
/// 문서양식 리스트 - Tree 구조로 보여줌(사용안함)
/// </summary>
public partial class COVIFlowNet_Formlist_FormTree : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }
   
    public string DisplayGroup()
    {
        CfnFormManager.WfFormManager objMTS = new CfnFormManager.WfFormManager();
        string treeForms = "";
        int j = 0;
        string strQuery = "";
        DataSet oDS = null;
        SqlDacBase SqlDbAgent = null;
        DataPack INPUT = null;
        System.Text.StringBuilder TempStructure = null;
        try
        {
            INPUT = new DataPack();
            strQuery = "[dbo].[usp_wf_GetFormClassList]";
            INPUT.add("@USAGE_STATE", CfnFormManager.CfFormUsageState.fustActive);
            
            SqlDbAgent = new SqlDacBase();
            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();

            oDS = new DataSet();
            oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, strQuery, INPUT);
            SqlDbAgent.Dispose();
            SqlDbAgent = null;
            System.Data.DataTable oTable = oDS.Tables[0];
            System.Data.DataRowCollection oRows = oTable.Rows;

            TempStructure = new System.Text.StringBuilder();

            foreach (System.Data.DataRow oRow in oRows)
            {
                if (treeForms != oRow["CLASS_ID"].ToString())
                {
                    if (j > 0) TempStructure.Append("</UL></LI>");

                    TempStructure.Append("<LI><A HREF=" + (char)34 + "javascript:setFormPath('', '','','','')" + (char)34 + ">" + oRow["CLASS_NAME"].ToString() + "</a><UL>");
                    if (oRow["FORM_DESC"].ToString() == "")
                    {
                        TempStructure.Append("<LI class='exe'><A HREF=" + (char)34 + "javascript:setFormPath('" + oRow["FORM_PREFIX"].ToString() + "','" + oRow["FORM_ID"].ToString() + "','" + oRow["FORM_NAME"].ToString() + "','" + oRow["SCHEMA_ID"].ToString() + "','" + oRow["REVISION"].ToString() + "','" + oRow["FILE_NAME"].ToString() + "')" + (char)34 + ">" + oRow["FORM_NAME"].ToString() + "</a></LI>");
                    }
                    else
                    {
                        TempStructure.Append("<LI class='exe'><A HREF=" + (char)34 + "javascript:setFormPath('" + oRow["FORM_PREFIX"].ToString() + "','" + oRow["FORM_ID"].ToString() + "','" + oRow["FORM_NAME"].ToString() + "','" + oRow["SCHEMA_ID"].ToString() + "','" + oRow["REVISION"].ToString() + "','" + oRow["FILE_NAME"].ToString() + "')" + (char)34 + ">" + oRow["FORM_NAME"].ToString() + "[" + oRow["FORM_DESC"].ToString() + "]" + "</a></LI>");
                    }
                }
                else
                {
                    if (oRow["FORM_DESC"].ToString() == "")
                    {
                        TempStructure.Append("<LI class='exe'><A HREF=" + (char)34 + "javascript:setFormPath('" + oRow["FORM_PREFIX"].ToString() + "','" + oRow["FORM_ID"].ToString() + "','" + oRow["FORM_NAME"].ToString() + "','" + oRow["SCHEMA_ID"].ToString() + "','" + oRow["REVISION"].ToString() + "','" + oRow["FILE_NAME"].ToString() + "')" + (char)34 + ">" + oRow["FORM_NAME"].ToString() + "</a></LI>");
                    }
                    else
                    {
                        TempStructure.Append("<LI class='exe'><A HREF=" + (char)34 + "javascript:setFormPath('" + oRow["FORM_PREFIX"].ToString() + "','" + oRow["FORM_ID"].ToString() + "','" + oRow["FORM_NAME"].ToString() + "','" + oRow["SCHEMA_ID"].ToString() + "','" + oRow["REVISION"].ToString() + "','" + oRow["FILE_NAME"].ToString() + "')" + (char)34 + ">" + oRow["FORM_NAME"].ToString() + "[" + oRow["FORM_DESC"].ToString() + "]" + "</a></LI>");
                    }
                }
                treeForms = oRow["CLASS_ID"].ToString();
                j = j + 1;
            }
            oDS.Dispose();
            oDS = null;
            System.EnterpriseServices.ServicedComponent.DisposeObject(objMTS);
            objMTS = null;

            TempStructure = null;

            return TempStructure.ToString();
                     
            ////using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter("DbProvider", "FORM_DEF_ConnectionString", true))
            //using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter(Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["DbProvider"].ToString(), Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["FORM_DEF_ConnectionString"].ToString(), false))
            //{
            //    oDS = adapter.FillDataSet(strQuery);

            //    System.Data.DataTable oTable = oDS.Tables[0];
            //    System.Data.DataRowCollection oRows = oTable.Rows;
               
            //    System.Text.StringBuilder TempStructure = new System.Text.StringBuilder();
                
            //    foreach(System.Data.DataRow oRow in oRows)
            //    {                
            //        if(treeForms != oRow["CLASS_ID"].ToString())
            //        {
            //            if(j > 0) TempStructure.Append("</UL></LI>");

            //            TempStructure.Append("<LI><A HREF=" + (char)34 + "javascript:setFormPath('', '','','','')" + (char)34 + ">" + oRow["CLASS_NAME"].ToString() + "</a><UL>");
            //            if(oRow["FORM_DESC"].ToString() == "")
            //            {
            //                TempStructure.Append("<LI class='exe'><A HREF=" + (char)34 + "javascript:setFormPath('" + oRow["FORM_PREFIX"].ToString() + "','" + oRow["FORM_ID"].ToString() + "','" + oRow["FORM_NAME"].ToString() + "','" + oRow["SCHEMA_ID"].ToString() + "','" + oRow["REVISION"].ToString() + "','" + oRow["FILE_NAME"].ToString() + "')" + (char)34 + ">" + oRow["FORM_NAME"].ToString() + "</a></LI>");
            //            }
            //            else
            //            {
            //                TempStructure.Append("<LI class='exe'><A HREF=" + (char)34 + "javascript:setFormPath('" + oRow["FORM_PREFIX"].ToString() + "','" + oRow["FORM_ID"].ToString() + "','" + oRow["FORM_NAME"].ToString() + "','" + oRow["SCHEMA_ID"].ToString() + "','" + oRow["REVISION"].ToString() + "','" + oRow["FILE_NAME"].ToString() + "')" + (char)34 + ">" + oRow["FORM_NAME"].ToString() + "[" + oRow["FORM_DESC"].ToString() + "]" + "</a></LI>");
            //            }
            //        }
            //        else
            //        {
            //            if (oRow["FORM_DESC"].ToString() == "")
            //            {
            //                TempStructure.Append("<LI class='exe'><A HREF=" + (char)34 + "javascript:setFormPath('" + oRow["FORM_PREFIX"].ToString() + "','" + oRow["FORM_ID"].ToString() + "','" + oRow["FORM_NAME"].ToString() + "','" + oRow["SCHEMA_ID"].ToString() + "','" + oRow["REVISION"].ToString() + "','" + oRow["FILE_NAME"].ToString() + "')" + (char)34 + ">" + oRow["FORM_NAME"].ToString() + "</a></LI>");
            //            }
            //            else
            //            {
            //                TempStructure.Append("<LI class='exe'><A HREF=" + (char)34 + "javascript:setFormPath('" + oRow["FORM_PREFIX"].ToString() + "','" + oRow["FORM_ID"].ToString() + "','" + oRow["FORM_NAME"].ToString() + "','" + oRow["SCHEMA_ID"].ToString() + "','" + oRow["REVISION"].ToString() + "','" + oRow["FILE_NAME"].ToString() + "')" + (char)34 + ">" + oRow["FORM_NAME"].ToString() + "[" + oRow["FORM_DESC"].ToString() + "]" + "</a></LI>");
            //            }
            //        }
            //        treeForms = oRow["CLASS_ID"].ToString();
            //        j = j + 1;
            //    }

            //    oDS = null;
            //    System.EnterpriseServices.ServicedComponent.DisposeObject(objMTS);
            //    objMTS = null;

            //    TempStructure = null;

            //    return TempStructure.ToString();    
            //}                    
        }
        catch(System.Exception eX)
        {
            HandleException(eX);
            throw new System.Exception(null, eX);
        }
        finally
        {
            if (objMTS != null) 
            { 
                System.EnterpriseServices.ServicedComponent.DisposeObject(objMTS);
                objMTS = null;
            }
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
            if (TempStructure != null)
            {
                TempStructure = null;
            }
        }
    }

    private void HandleException(System.Exception _Ex)
    {        
        try
        {

            Response.Write("<script language=jscript>alert(\"" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)).Replace("\"", "\\\"") + "\");</script>");
        }
        catch (System.Exception Ex)       
        {
            Response.Write("<script language=jscript>alert(\"" + COVIFlowCom.ErrResult.ReplaceErrMsg(Ex.Message).Replace("\"", "\\\"") + "\");</script>");
        }
    }
}
