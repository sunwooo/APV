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
/// 결재문서 임시저장 처리
/// 임시저장 Table 저장 및 양식 데이터 저장
/// 결재선 임시저장
/// </summary>
public partial class COVIFlowNet_TempSave_saveform : PageBase
{
    /// <summary>
    /// 결재문서 임시저장 처리
    /// 파라미터 처리
    /// Request Stream XML 변환
    /// 임시저장 Table 저장 및 양식 데이터 저장
    /// 결재선 임시저장
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");

        CfnFormManager.WfFormManager oFormMgr=null ;
        

        try
        {
            //code
            System.Xml.XmlDocument oFormXMLDOM=COVIFlowCom.Common.ParseRequestBytes(Request);
            System.Xml.XmlNode elmRoot = oFormXMLDOM.DocumentElement;

            COVIFlowCom.processFormData.processFormDatap(oFormXMLDOM);
             

            string sFTID;
            System.Data.SqlClient.SqlCommand oComm = new System.Data.SqlClient.SqlCommand();

            if (COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "mode", true).ToUpper() == "TEMPSAVE")
            {
                oComm.CommandText = "UPDATE WF_FORMS_TEMP_INST "
                + " SET SUBJECT=@SUBJECT "
                + " WHERE FORM_TEMP_INST_ID=@FORM_TEMP_INST_ID";

                sFTID = COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "ftid", true);
                oComm.Parameters.AddWithValue("@FORM_TEMP_INST_ID", sFTID);
                oComm.Parameters.AddWithValue("@SUBJECT", COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "formdata/SUBJECT", true));
            }
            else
            {
                oComm.CommandText = "INSERT INTO WF_FORMS_TEMP_INST "
                + " (FORM_TEMP_INST_ID,FORM_INST_ID,FORM_ID,SCHEMA_ID,FORM_PREFIX,FORM_NAME,FORM_VERSION,FORM_INST_TABLE_NAME,FORM_FILE_NAME,OWNER_ID,SUBJECT) "
                + " VALUES "
                + " (@FORM_TEMP_INST_ID,@FORM_INST_ID,@FORM_ID,@SCHEMA_ID,@FORM_PREFIX,@FORM_NAME,@FORM_VERSION,@FORM_INST_TABLE_NAME,@FORM_FILE_NAME,@OWNER_ID,@SUBJECT)";

                string sTableName = CfnFormManager.WfFormManager.ResolveFormInstanceTableName(
                    COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fmpf", true),
                    Convert.ToInt32(COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fmrv", true))
                    );
                //2009.03 : Guid 변경
                sFTID = CfnEntityClasses.WfEntity.NewGUID();

                oComm.Parameters.AddWithValue("@FORM_TEMP_INST_ID", sFTID);
                oComm.Parameters.AddWithValue("@FORM_INST_ID", COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fiid", true));
                oComm.Parameters.AddWithValue("@FORM_ID", COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fmid", true));
                oComm.Parameters.AddWithValue("@SCHEMA_ID", COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "scid", true));
                oComm.Parameters.AddWithValue("@FORM_PREFIX", COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fmpf", true));
                oComm.Parameters.AddWithValue("@FORM_NAME", COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fmnm", true));
                oComm.Parameters.AddWithValue("@FORM_VERSION", COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fmrv", true));
                oComm.Parameters.AddWithValue("@FORM_INST_TABLE_NAME", sTableName);
                oComm.Parameters.AddWithValue("@FORM_FILE_NAME", COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fmfn", true));
                oComm.Parameters.AddWithValue("@OWNER_ID", COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "usid", true));
                oComm.Parameters.AddWithValue("@SUBJECT", COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "formdata/SUBJECT", true));

            }

            oFormMgr = new CfnFormManager.WfFormManager();
            oFormMgr.ExecuteNonQuery(CfnFormManager.CfDatabaseType.dbtpDefinition, COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fmpf", true), oComm);


            //수신자,참조자,회람자 살리기
            try
            {
                //수신/참조/회람
                System.Data.SqlClient.SqlCommand oCommRE = new System.Data.SqlClient.SqlCommand(
               " UPDATE WF_CIRCULATION_RECEIPT  set FORM_INST_ID = '" + COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fiid", true) + "'" +
               " WHERE FORM_INST_ID='" + COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fiid_spare", true) + "'");

                oFormMgr.ExecuteNonQuery(CfnFormManager.CfDatabaseType.dbtpDefinition, null, oCommRE);

                //수신/참조/회람
                System.Data.SqlClient.SqlCommand oCommSE = new System.Data.SqlClient.SqlCommand(
               " UPDATE WF_CIRCULATION_SEND  set FORM_INST_ID = '" + COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fiid", true) + "'" +
               " WHERE FORM_INST_ID='" + COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fiid_spare", true) + "'");

                oFormMgr.ExecuteNonQuery(CfnFormManager.CfDatabaseType.dbtpDefinition, null, oCommSE);

                // //의견
                // System.Data.SqlClient.SqlCommand oCommCO = new System.Data.SqlClient.SqlCommand(
                //" UPDATE COVIFLOWV71_INST.dbo.WF_COMMENT  set FORM_INST_ID = '" + oItem.Attributes["fiid_spare"].Value + "'" +
                //" WHERE FORM_INST_ID='" + oItem.Attributes["fiid"].Value + "'");

                // oFMMgr.ExecuteNonQuery(CfnFormManager.CfDatabaseType.dbtpDefinition, null, oCommCO);

            }
            catch (System.Exception ex)
            {
                throw ex;
            }
 
            oFormXMLDOM = null;

            //결재선 임시저장 관련
            //회수인 경우 결재선 임시저장 기능 막음
            
            //2013-05-03 hyh 주석 추가 //고객사 요청으로 회수일 경우에도 결재선 임시저장 할 수 있게 함 
            //if (elmRoot.SelectSingleNode("wiid").InnerText == String.Empty)
            //{
            //2013-05-03 hyh 주석 추가 끝

                CfnCoreEngine.WfAdministration oDBMgr = new CfnCoreEngine.WfAdministration();
                System.Data.DataSet oDS = null;
                try
                {
                    System.String sApvList = elmRoot.SelectSingleNode("apvlist").InnerXml;// COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "apvlist", false);
                    if (sApvList != "")
                    {
                        sApvList = elmRoot.SelectSingleNode("apvlist/steps").OuterXml;
                    }

                    System.String sPDDID = sFTID;
                    System.String sQuery = "[dbo].[usp_wf_GetPrivateDomainDataT]";

                    oDS = new DataSet();

                    DataPack INPUT = null;

                    try
                    {
                        INPUT = new DataPack();
                        INPUT.add("@PDD_ID", sPDDID);
                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                            oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sQuery, INPUT);
                        }
                    }
                    catch (System.Exception ex)
                    {
                        throw ex;
                    }
                    finally
                    {
                        //code
                        if (INPUT != null)
                        {
                            INPUT.Dispose();
                            INPUT = null;
                        }
                    }

                    if ((oDS == null) || (oDS.Tables.Count == 0 || oDS.Tables[0].Rows.Count == 0)) //존재하는 결재선
                    {
                        if (sApvList != "") //결재선 내용이 있을 경우 추가
                        {
                            CfnEntityClasses.WfPrivateDomainData oSI2 =
                            new CfnEntityClasses.WfPrivateDomainData
                            (
                                sPDDID,
                                "APPROVERCONTEXT",
                                COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "usdn", true) + "-" + COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fmnm", true),
                                sPDDID,
                                "",
                                COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "formdata/SUBJECT", true),
                                elmRoot.SelectSingleNode("apvlist/steps").OuterXml
                            );

                            oDBMgr.CreateEntity(oSI2);
                        }
                    }
                    else //존재하는 결재선 없을 경우
                    {
                        if (sApvList != "") //결재선 내용이 있을 경우 수정
                        {
                            CfnEntityClasses.WfPrivateDomainData oSI = (CfnEntityClasses.WfPrivateDomainData)oDBMgr.LookupEntity("WfPrivateDomainData", sPDDID);
                            oSI.displayName = COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "usdn", true) + "-" + COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "fmnm", true);
                            oSI.context = sApvList;
                            oSI.description = COVIFlowCom.Common.GetProp((System.Xml.XmlElement)elmRoot, "formdata/SUBJECT", true);
                            oSI.@abstract = String.Empty;

                            oDBMgr.UpdateGeneralInstance(oSI);
                        }
                        else //없을 경우 삭제
                        {
                            CfnDatabaseUtility.WfEntityFilter[] aFilters ={ new CfnDatabaseUtility.WfEntityFilter("id", sPDDID, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true) };
                            oDBMgr.DeleteEntity("WfPrivateDomainData", aFilters);
                        }
                    }

               }
                catch (System.Exception _ex)
                {
                    throw _ex;
                }
                finally
                {
                    if (oDBMgr != null)
                    {
                        oDBMgr.Dispose();
                        oDBMgr = null;
                    }
                    if(oDS != null){
                        oDS.Dispose();
                        oDS = null;
                    }
                }
            //2013-05-03 hyh 주석 추가 //고객사 요청으로 회수일 경우에도 결재선 임시저장 할 수 있게 함 
            //}
            //2013-05-03 hyh 주석 추가 끝
            
            Response.Write("<ftid>" + sFTID + "</ftid>");
        }
        catch (System.Exception ex)
        {
            
            Response.Write("<error>" + Server.HtmlEncode(COVIFlowCom.ErrResult.ParseStackTrace(ex))+"</error>");
        }
        finally
        {
            //code
            if (oFormMgr != null)
            {
                oFormMgr.Dispose();
                oFormMgr = null;
            }
            Response.Write("</response>");
        }
        
    }
}
