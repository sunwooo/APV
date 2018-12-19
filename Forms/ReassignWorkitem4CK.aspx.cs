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
using COVIFlowCom;

using Covision.Framework;
using Covision.Framework.Data.Business;

//쿠쿠전자 부품개발 요청서 담당자 변경 건
public partial class COVIFlowNet_Forms_ReassignWorkitem4CK : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
        try
        {
            pProcessForm();
            System.EnterpriseServices.ContextUtil.SetComplete();
        }
        catch (System.Exception Ex)
        {
            System.EnterpriseServices.ContextUtil.SetAbort();
            HandleException(Ex);
        }
        finally
        {
            Response.Write("</response>");
        }
    }
    private void pProcessForm()
    {
        try
        {
            System.Xml.XmlDocument oFormXMLDOM = COVIFlowCom.Common.ParseRequestBytes(Request);

            System.Xml.XmlElement elmRoot = oFormXMLDOM.DocumentElement;
            string sMode = COVIFlowCom.Common.GetProp(elmRoot, "mode", false);
            pReassignWorkItem(oFormXMLDOM);

            oFormXMLDOM = null;

            Response.Write("<success>" + Server.HtmlEncode(DateTime.Now.ToString()) + "</success>");
        }
        catch (System.Exception Ex)
        {
            throw new Exception(null, Ex);
        }
    }

    //'결재선변경
    //'
    //'workitem 재배정(부서/사용자 구분 및 pf_sk 종류 받을 것)
    private void pReassignWorkItem(System.Xml.XmlDocument oFormXMLDOM)
    {
        CfnCoreEngine.WfOrganizationManager oManager = null;
        System.Data.DataSet oDS = null;
        System.Data.DataRow oDR = null;
        
        string sPFSK = string.Empty;
        string sLocation = string.Empty;
        try
        {
            oDS = new DataSet();
            System.Xml.XmlElement elmRoot = oFormXMLDOM.DocumentElement;
            sPFSK = COVIFlowCom.Common.GetProp(elmRoot, "pfsk", true);
            sLocation = COVIFlowCom.Common.GetProp(elmRoot, "loct", false);

            //workitem 완료여부 확인
            String sWorkitemListQuery = String.Empty;
            //sWorkitemListQuery = String.Format("EXEC sp_executesql N'SELECT TOP 1 WI_STATE, PF_PERFORMER_ID, PI_STATE FROM WF_WORKITEM_LIST WHERE WI_ID=@WI_ID AND PF_STATE=1 ', N'@WI_ID CHAR(34)', '{0}'", COVIFlowCom.Common.GetProp(elmRoot, "wiid", true));
            sWorkitemListQuery = "[dbo].[usp_wf_GetCheckApvCompletedW]";

            DataPack INPUT = null;
            SqlDacBase SqlDbAgent = null;
            try
            {
                INPUT = new DataPack();
                INPUT.add("@WI_ID", COVIFlowCom.Common.GetProp(elmRoot, "wiid", true));
                SqlDbAgent = new SqlDacBase();
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();

                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sWorkitemListQuery, INPUT);
                SqlDbAgent.Dispose();
                SqlDbAgent = null;
                ////using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter("DbProvider", "INST_ConnectionString", true))
                ////using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter("DbProvider", "ORG_ConnectionString", true))
                //using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter(Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["DbProvider"].ToString(), Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["ORG_ConnectionString"].ToString(), false))
                //{
                //    System.Data.IDataParameter param = adapter.CreateParameter();
                //    param.DbType = DbType.Int32;
                //    param.ParameterName = "@PID";
                //    param.Value = 19;
                //    adapter.DbSelectParameters.Add(param);
                //    oDS = adapter.FillDataSet(sWorkitemListQuery);
                //}
            }
            catch (System.Exception ex)
            {
                throw new System.Exception("Get Archived", ex);
            }
            finally
            {
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

            oDR = oDS.Tables[0].Rows[0];
            //20041206 백종기 추가               
            System.Int32 iWIState = System.Convert.ToInt32(oDR["WI_STATE"]);
            System.Int32 iPIState = System.Convert.ToInt32(oDR["PI_STATE"]);

            if (iWIState == 0 && iPIState == 0)
            {
                //pErrorMessage("존재하지 않는 결재문서입니다.");
                throw new System.Exception(Resources.Approval.msg_082);
            }
            if (iWIState != 288 || iPIState != 288)
            {
                //pErrorMessage("이미 처리된 결재문서입니다.")
                throw new System.Exception(Resources.Approval.msg_084);
            }
            if (sLocation != "APPROVAL" && System.Convert.ToString(oDR["PF_PERFORMER_ID"]) != "system")
            {
                throw new System.Exception("이미 담당자가 지정되었습니다.");
            }

            oManager = new CfnCoreEngine.WfOrganizationManager();
            if (sPFSK.IndexOf("T") > -1)
            {
                oManager.ReassignWorkitem(
                        COVIFlowCom.Common.GetProp(elmRoot, "wiid", true),
                        COVIFlowCom.Common.GetProp(elmRoot, "pfid", true),
                        COVIFlowCom.Common.GetProp(elmRoot, "id", true),
                        COVIFlowCom.Common.GetProp(elmRoot, "name", true),
                        CfnEntityClasses.CfParticipantKind.ptkdHuman,
                        CfnCoreEngine.WfOrganizationManager.VRHandlerKey.pthkHumanSingle,
                        null,
                        sPFSK,
                        false);

                //담당자 전달 시 안내 메일 발송
                CfnDatabaseUtility.WfEntityFilter[] aEFs ={
                            new CfnDatabaseUtility.WfEntityFilter ("piid",Convert.ToString(COVIFlowCom.Common.GetProp(elmRoot, "piid", true)),CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual ,true),
                            new CfnDatabaseUtility.WfEntityFilter ("name",Convert.ToString("APPROVERCONTEXT"),CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true)
                        };
                CfnCoreEngine.WfAdministration objMTS = new CfnCoreEngine.WfAdministration();
                System.Collections.ArrayList oDDs = objMTS.GetEntity(typeof(CfnEntityClasses.WfDomainDataInstance), aEFs);
                CfnEntityClasses.WfDomainDataInstance oDDI = (CfnEntityClasses.WfDomainDataInstance)oDDs[0];
                System.Xml.XmlDocument oApvList = (System.Xml.XmlDocument)oDDI.value;
                System.Xml.XmlNode oCharge = oApvList.DocumentElement.SelectSingleNode("division/step/ou/person[taskinfo/@kind='charge']");

                CfnDatabaseUtility.WfEntityFilter[] aEFProcesss ={
                            new CfnDatabaseUtility.WfEntityFilter ("id",Convert.ToString(COVIFlowCom.Common.GetProp(elmRoot, "piid", true)),CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual ,true)
                        };
                oDDs = objMTS.GetEntity(typeof(CfnEntityClasses.WfProcessInstance), aEFProcesss);
                CfnEntityClasses.WfProcessInstance PInstance = (CfnEntityClasses.WfProcessInstance)oDDs[0];
                System.Xml.XmlDocument oXML = new System.Xml.XmlDocument();
                oXML.LoadXml(PInstance.description);
                System.Xml.XmlNode oFNode = oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");

                System.String sSubject = "[결재요청][" + oFNode.Attributes["name"].Value + "]" + oFNode.Attributes["subject"].Value + "(" + oCharge.Attributes["name"].Value + "/" + oCharge.SelectSingleNode("taskinfo").Attributes["datecompleted"].Value.Substring(0, 10) + ")";


                System.Text.StringBuilder sbMailBody = new System.Text.StringBuilder();

                sbMailBody.Append("<HTML><HEAD><meta http-equiv='Content-Type' ></HEAD><BODY>");
                sbMailBody.Append("결재 문서가 도착하였습니다.<BR>전자결재의 미결함에서 조회가능합니다.<BR>");
                sbMailBody.Append("<U>전자결재 > 미결함</U><BR><A HREF='http://");
                sbMailBody.Append(System.Web.Configuration.WebConfigurationManager.AppSettings["LinKURL"].ToString());
                sbMailBody.Append("/COVIWeb/Approval/Forms/Form.aspx?");
                sbMailBody.Append("mode=APPROVAL");
                sbMailBody.Append("&piid=").Append(PInstance.id);
                sbMailBody.Append("&wiid=").Append(COVIFlowCom.Common.GetProp(elmRoot, "wiid", true));
                sbMailBody.Append("&bstate=").Append(PInstance.businessState);
                sbMailBody.Append("&fmid=").Append(oFNode.Attributes["id"].Value);
                sbMailBody.Append("&fmpf=").Append(oFNode.Attributes["prefix"].Value);
                sbMailBody.Append("&fmrv=").Append(oFNode.Attributes["revision"].Value);
                sbMailBody.Append("&fiid=").Append(oFNode.Attributes["instanceid"].Value);
                sbMailBody.Append("&scid=").Append(oFNode.Attributes["schemaid"].Value);
                sbMailBody.Append("&secdoc=").Append(oFNode.Attributes["secure_doc"].Value);

                CfnDatabaseUtility.WfEntityFilter[] aEFPFs = { 
                        new CfnDatabaseUtility.WfEntityFilter("wiid", COVIFlowCom.Common.GetProp(elmRoot, "wiid", true), CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true), 
                        new CfnDatabaseUtility.WfEntityFilter("performerId", COVIFlowCom.Common.GetProp(elmRoot, "id", true), CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true),
                        new CfnDatabaseUtility.WfEntityFilter("state",CfnEntityClasses.CfPerformerState.pfstAssigned,CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true)
                    };
                System.Collections.ArrayList oPFs = objMTS.GetEntity(typeof(CfnEntityClasses.WfPerformer), aEFPFs);
                foreach (CfnEntityClasses.WfPerformer oPF in oPFs)
                {
                    sbMailBody.Append("&pfsk=").Append(oPF.subKind);
                    sbMailBody.Append("&pfid=").Append(oPF.id);
                    sbMailBody.Append("&ptid=").Append(COVIFlowCom.Common.GetProp(elmRoot, "id", true));
                }
                sbMailBody.Append("'>");
                sbMailBody.Append(oFNode.Attributes["name"].Value).Append("-").Append(oFNode.Attributes["subject"].Value);
                sbMailBody.Append("</a>");
                sbMailBody.Append("</BODY></HTML>");
                string[] aReceipt_id = new string[1];
                aReceipt_id[0] = COVIFlowCom.Common.GetProp(elmRoot, "id", true);
                try
                {
                    //개인발송
                    Common.SendMessage(
                        sSubject,
                        Session["user_code"].ToString(),
                        aReceipt_id,
                        CfnEngineInterfaces.IWfOrganization.OMEntityType.ettpPerson,
                        System.Net.Mail.MailPriority.Normal,
                        true,
                        sbMailBody.ToString());
                }
                catch (Exception sendmail)
                {
                    throw new System.Exception(null, sendmail.InnerException);
                }
                finally
                {
                    if (objMTS != null)
                    {
                        objMTS.Dispose();
                        objMTS = null;
                    }
                    if (sbMailBody != null)
                    {
                        sbMailBody = null;
                    }
                }
            }
            oManager.Dispose();
            oManager = null;
        }
        catch (System.Exception Ex)
        {
            throw new Exception(null, Ex);
        }
        finally
        {
            if (oManager != null)
            {
                System.EnterpriseServices.ServicedComponent.DisposeObject(oManager);
                oManager = null;
            }
            if (oDS != null)
            {
                oDS.Dispose();
                oDS = null;
            }
            if (oDR != null)
            {
                oDR = null;
            }
        }
    }

    private void HandleException(System.Exception _Ex)
    {
        try
        {
            Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)) + "]]></error>");
        }
        catch (System.Exception Ex)
        {
            Response.Write("<error><![CDATA[" + Ex.Message + "]]></error>");
        }
    }
}
