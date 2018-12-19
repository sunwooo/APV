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
using COVIFlowCom;
using System.ComponentModel;

using Covision.Framework;
using Covision.Framework.Data.Business;

/// <summary>
/// 변경된 결재선 적용 페이지
/// </summary>
public partial class COVIFlowNet_Forms_ReassignApvList : PageBase
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
        }
        catch (System.Exception Ex)
        {
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
            pReassignApvList();

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
    private void pReassignApvList()
    {
        try
        {
            System.Xml.XmlDocument oFormXMLDOM;
            oFormXMLDOM = pParseRequestBytes();

            System.String strIssueDocNO = "";
            //부산은행 문서번호 발번 PDEF에서 수행
            //strIssueDocNO = processRegisterDocNo.ProcessIssueDocNo(oFormXMLDOM)

            System.Xml.XmlElement elmRoot = oFormXMLDOM.DocumentElement;

            System.String sMode = COVIFlowCom.Common.GetProp(elmRoot, "mode", false);

            //processFormData.ProcessFormData(oFormXMLDOM);

            //후열처리
            System.String wfid = "";
            System.String piid = "";

            piid = COVIFlowCom.Common.GetProp(elmRoot, "piid", false);
            //결재선 변경 --> 현결재자 후열 여부 확인 필요
            if (COVIFlowCom.Common.GetProp(elmRoot, "wfid", false) != "")
            {
                wfid = COVIFlowCom.Common.GetProp(elmRoot, "wfid", false);
            }
            else
            {
                System.Xml.XmlDocument oXML = new System.Xml.XmlDocument();
                oXML.LoadXml(elmRoot.SelectSingleNode("apvlist/steps").OuterXml.ToString());

                System.Xml.XmlDocument oApvList = oXML;//최종결재선
                System.Xml.XmlNode oApvRoot = oApvList.DocumentElement;
                //System.Xml.XmlNode oStep;
                System.Xml.XmlNode oPerson;
                oPerson = oApvRoot.SelectSingleNode("division[taskinfo/@status='pending']/step[@routetype!='consult']/ou/person[taskinfo/@result='prebypass' and taskinfo/@kind='bypass']");
                if (oPerson != null)
                {
                    //if (oPerson.SelectSingleNode("taskinfo").Attributes["kind"].Value == "bypass")
                    //{
                    wfid = oPerson.Attributes["code"].Value;
                    //}
                }
            }

            if (wfid != "")
            {

                processBypassAPV(oFormXMLDOM, piid, wfid);
            }
            else
            {
                processAPV(oFormXMLDOM);
            }

            //수신처 정보 변경 시 처리
            if (elmRoot.SelectSingleNode("formdata") != null)
            {
                COVIFlowCom.processFormData.processFormDatap(oFormXMLDOM);
            }

            oFormXMLDOM = null;

            Response.Write("<docno>" + strIssueDocNO + "</docno>");
            Response.Write("<success>" + Server.HtmlEncode(DateTime.Now.ToString()) + "</success>");
            //System.EnterpriseServices.ContextUtil.SetComplete();
        }
        catch (System.Exception Ex)
        {
            //System.EnterpriseServices.ContextUtil.SetAbort();
            throw new System.Exception("ReassignApvList", Ex);
        }
    }

    private static void processBypassAPV(System.Xml.XmlDocument oFormXMLDOM, System.String piid, System.String wfid)
    {
        CfnCoreEngine.WfProcessManager oPMgr = null;
        CfnCoreEngine.WfWorkitemManager oWMgr = null;
        
        //BizData 설정
        System.Text.StringBuilder sbBizData1 = null;
        System.Text.StringBuilder sbBizData2 = null;
        System.Data.DataSet oDS = null;
        System.Data.DataRow oDR = null;
        DataPack INPUT = null;
        try
        {
            System.Xml.XmlElement elmRoot = oFormXMLDOM.DocumentElement;
            System.Xml.XmlNode elmFormData = elmRoot.SelectSingleNode("formdata");
            string sMode = Common.GetProp(elmRoot, "mode", false);
            ////string sApvResult = "";

            sbBizData1 = new StringBuilder();
            sbBizData2 = new StringBuilder();
            sbBizData1.Append(Common.GetProp(elmRoot, "pibd1", false));
            sbBizData2.Append(Common.GetProp(elmRoot, "pibd2", false));

            System.Collections.Specialized.NameValueCollection oWLRDIs = new System.Collections.Specialized.NameValueCollection();
            oWMgr = new CfnCoreEngine.WfWorkitemManager();


            //workitem 완료여부 확인
            String sWorkitemListQuery = String.Empty;
            //sWorkitemListQuery = String.Format("EXEC sp_executesql N'SELECT TOP 1 WI_ID, WI_STATE,PF_ID,  PF_PERFORMER_ID, PI_STATE FROM WF_WORKITEM_LIST WHERE PI_ID=@PI_ID AND PF_PERFORMER_ID=@PF_PERFORMER_ID AND PF_STATE=1  AND PF_SUB_KIND=''T000'' ', N'@PI_ID CHAR(34), @PF_PERFORMER_ID VARCHAR(32)', '{0}','{1}'", piid, wfid);
            sWorkitemListQuery = "[dbo].[usp_wf_GetCheckApvCompletedP]";
            oDS = new DataSet();
            INPUT = new DataPack();
            INPUT.add("@PI_ID",piid);
            INPUT.add("@PF_PERFORMER_ID", wfid);
			try
            {     
				using (SqlDacBase SqlDbAgent = new SqlDacBase())
				{
					SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INT_ConnectionString").ToString();

					oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sWorkitemListQuery, INPUT);
				}
            }
            catch (System.Exception ex)
            {
                throw new System.Exception("Get Archived", ex);
            }
            finally
            {
            }

            oDR = oDS.Tables[0].Rows[0];
            //결재 인스턴스의 상태 체크

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

            //결재 관련 Relevant Data 설정
            System.Xml.XmlDocument oXML = new System.Xml.XmlDocument();
            oXML.LoadXml(elmRoot.SelectSingleNode("apvlist/steps").OuterXml.ToString());

            System.Xml.XmlDocument oApvList = oXML;//최종결재선
            System.Xml.XmlNode oApvRoot = oApvList.DocumentElement;
            System.Xml.XmlNode oPerson;
            oPerson = oApvRoot.SelectSingleNode("division[taskinfo/@status='pending']/step[@routetype!='consult']/ou/person[taskinfo/@result='prebypass' and taskinfo/@kind='bypass']");

            if (oPerson != null)
            {
                System.Xml.XmlNode oTaskInfo = oPerson.SelectSingleNode("taskinfo");
                oTaskInfo.Attributes["status"].Value = "pending";
                oTaskInfo.Attributes["kind"].Value = "normal";
                oWLRDIs.Add("APPROVERCONTEXT", oApvList.OuterXml);
            }

            oWMgr.RequestComplete(
                System.Convert.ToString(oDR["WI_ID"]),
                System.Convert.ToString(oDR["PF_ID"]),
                oWLRDIs,
                null,
                "",
                "bypass",
                string.Empty,
                string.Empty,
                null
                );
        }
        catch (Exception Ex)
        {
            throw new Exception(null, Ex);
        }
        finally
        {
            if (oPMgr != null)
            {
                oPMgr.Dispose();
                oPMgr = null;
            }
            if (oWMgr != null)
            {
				oWMgr.Dispose();
                oWMgr = null;
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
            if (sbBizData1 != null)
            {
                sbBizData1 = null;
            }
            if (sbBizData2 != null)
            {
                sbBizData2 = null;
            }
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
        }
    }

    private static void processAPV(System.Xml.XmlDocument oFormXMLDOM)
    {
        CfnCoreEngine.WfOrganizationManager OManager = null;
        CfnCoreEngine.WfAdministration oAdmin = null;
        CfnCoreEngine.WfProcessManager oPMgr = null;
        CfnCoreEngine.WfWorkitemManager WManager = null;

        System.Data.DataSet oDS = null;
        System.Data.DataRow oDR = null;
        DataPack INPUT = null;

        System.Xml.XmlDocument oXML = null;
        System.Collections.Specialized.ListDictionary oVRMembers = null;
        try
        {
            OManager = new CfnCoreEngine.WfOrganizationManager();
            oAdmin = new CfnCoreEngine.WfAdministration();
            oPMgr = new CfnCoreEngine.WfProcessManager();
            WManager = new CfnCoreEngine.WfWorkitemManager();

            System.Xml.XmlElement elmRoot = oFormXMLDOM.DocumentElement;
            System.Xml.XmlNode elmFormData = elmRoot.SelectSingleNode("formdata");
            string sMode = Common.GetProp(elmRoot, "mode", false);
            //string sApvResult = "";

            oXML = new System.Xml.XmlDocument();
            oXML.LoadXml(elmRoot.SelectSingleNode("apvlist/steps").OuterXml.ToString());

            System.Xml.XmlDocument oApvList = oXML;//최종결재선
            System.Xml.XmlNode oApvRoot = oApvList.DocumentElement;
            //System.Xml.XmlNode oStep;
            System.Xml.XmlNode oPerson;
            //oPerson = oApvRoot.SelectSingleNode("division[taskinfo/@status='pending']/step[@routetype!='consult']/ou/person[taskinfo/@status='pending' or taskinfo/@status='reserved']");
            oPerson = oApvRoot.SelectSingleNode("division[taskinfo/@status='pending']/step/ou/person[taskinfo/@status='pending' or taskinfo/@status='reserved']");
            System.String sApprover = "";
            if (oPerson != null)
            {
                sApprover = oPerson.Attributes["code"].Value;
            }

            //workitem 완료여부 확인
            String sWorkitemListQuery = String.Empty;
            //sWorkitemListQuery = String.Format("EXEC sp_executesql N'SELECT TOP 1 WI_ID, WI_STATE,PF_ID,  PF_PERFORMER_ID, PI_STATE FROM WF_WORKITEM_LIST WHERE PI_ID=@PI_ID AND PF_PERFORMER_ID=@PF_PERFORMER_ID AND PF_STATE=1  AND PF_SUB_KIND=''T000'' ', N'@PI_ID CHAR(34), @PF_PERFORMER_ID VARCHAR(32)', '{0}','{1}'", Common.GetProp(elmRoot, "piid", true), sApprover);
            sWorkitemListQuery = "[dbo].[usp_wf_GetCheckApvCompletedP]";
            INPUT = new DataPack();

            
            INPUT.add("@PI_ID", Common.GetProp(elmRoot, "piid", false));
            //INPUT.add("@PF_PERFORMER_ID", Common.GetProp(elmRoot, "wfid", false));
            INPUT.add("@PF_PERFORMER_ID", sApprover);
            oDS = new DataSet();
			try
            {
				using (SqlDacBase SqlDbAgent = new SqlDacBase())
				{
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
					oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sWorkitemListQuery, INPUT);
				}
            }
            catch (System.Exception ex)
            {
                throw new System.Exception("Get Archived", ex);
            }
            finally
            {
            }

            oDR = oDS.Tables[0].Rows[0];
            //결재 인스턴스의 상태 체크

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
            //일반SP호출로 변경
            string sProcName = "dbo.usp_wf_update_apvlist";
            try
            {
                INPUT = new DataPack();
                INPUT.add("@PROCESS_ID", Common.GetProp((System.Xml.XmlElement)elmRoot, "piid", true));
                INPUT.add("@APVLIST", oApvList.Clone().OuterXml);
                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                    SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, sProcName, INPUT);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (INPUT != null)
                {
                    INPUT.Dispose();
                    INPUT = null;
                }
            }

            //예고함 변경
            oVRMembers = new System.Collections.Specialized.ListDictionary();
            System.Xml.XmlNodeList oPreviewers;

            oPreviewers = oApvRoot.SelectNodes("division[taskinfo/@status='pending']/step/ou/person[taskinfo/@kind!='charge' and taskinfo/@status='inactive']");
            foreach (System.Xml.XmlNode oApvPerson in oPreviewers)
            {
                System.String sPersonCode = oApvPerson.Attributes["code"].Value;
                System.String sPersonName = oApvPerson.Attributes["name"].Value;

                if (oVRMembers.Contains(sPersonCode) == false)
                {
                    oVRMembers.Add(sPersonCode, sPersonName);
                }
            }

            CfnDatabaseUtility.WfEntityFilter[] aEFPIs = {
                    new CfnDatabaseUtility.WfEntityFilter("id", COVIFlowCom.Common.GetProp(elmRoot, "piid", true), CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true)
                };

            //oDDs = oAdmin.GetEntity(typeof(CfnEntityClasses.WfProcessInstance), aEFPIs);
            System.Collections.ArrayList oDDs = oAdmin.GetEntity(typeof(CfnEntityClasses.WfProcessInstance), aEFPIs);
            CfnEntityClasses.WfProcessInstance PInstance = (CfnEntityClasses.WfProcessInstance)oDDs[0];


            OManager.ResetVRoleMember(PInstance.pdid, PInstance.id, "Previewers");
            if (oVRMembers.Count == 0)
            {
                OManager.InsertVRoleMember(PInstance.pdid, PInstance.id, "Previewers", "admin", "admin", CfnEntityClasses.CfParticipantKind.ptkdSystem, CfnCoreEngine.WfOrganizationManager.VRHandlerKey.pthkSystem, null, "T010", false);
            }
            else
            {
                OManager.InsertVRoleMember(PInstance.pdid, PInstance.id, "Previewers", oVRMembers, CfnEntityClasses.CfParticipantKind.ptkdHuman, CfnCoreEngine.WfOrganizationManager.VRHandlerKey.pthkHumanSingle, null, "T010", false);
            }

            CfnDatabaseUtility.WfEntityFilter[] aVREFs = {
                new CfnDatabaseUtility.WfEntityFilter("pdid",PInstance.pdid, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true),
                new CfnDatabaseUtility.WfEntityFilter("name", "Previewers", CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true)
            };
            System.Collections.ArrayList oVRs = WManager.GetEntity(typeof(CfnEntityClasses.WfVirtualRole), aVREFs);
            System.String oTargetID = "";
            foreach (CfnEntityClasses.WfVirtualRole oVR in oVRs)
            {
                oTargetID = System.Convert.ToString(oVR.id);
            }
            System.Collections.Hashtable PGlobal = oPMgr.GetGlobalRDICollection(COVIFlowCom.Common.GetProp(elmRoot, "piid", true));
            if (PGlobal.Count > 0)
            {
                CfnEntityClasses.WfGlobalRDI oPreviewerWIID = (CfnEntityClasses.WfGlobalRDI)PGlobal["PreviewerWIID"];
                if (oPreviewerWIID.value.ToString() != "")
                {
                    CfnDatabaseUtility.WfEntityFilter[] aPFEFs = {
                    new CfnDatabaseUtility.WfEntityFilter("wiid",oPreviewerWIID.value.ToString(), CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true),
                    new CfnDatabaseUtility.WfEntityFilter("state", CfnEntityClasses.CfPerformerState.pfstAssigned, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true)
                    };

                    System.Collections.ArrayList oPFs = WManager.GetEntity(typeof(CfnEntityClasses.WfPerformer), aPFEFs);
                    //System.Int32 j = 0;
                    System.String sPreviewerPFID = "";
                    if (oPFs.Count > 0)
                    {
                        foreach (CfnEntityClasses.WfPerformer oPF in oPFs)
                        {
                            sPreviewerPFID = System.Convert.ToString(oPF.id);
                        }
                        CfnEntityClasses.WfGlobalRDI osPreviewerWIID = (CfnEntityClasses.WfGlobalRDI)PGlobal["PreviewerWIID"];
                        System.String sPreviewerWIID = osPreviewerWIID.value.ToString();

                        OManager.ReassignWorkitem(
                                sPreviewerWIID,
                                sPreviewerPFID,
                                oTargetID,
                                "예결자",
                                CfnEntityClasses.CfParticipantKind.ptkdVirtualRole,
                                CfnCoreEngine.WfOrganizationManager.VRHandlerKey.pthkVRQueue,
                                null,
                                "T010",
                                false);
                    }
                    else
                    {
                        //throw new System.Exception("oPFs.Count: " + oPFs.Count.ToString() + sPreviewerPFID);
                    }
                }
                else
                {
                    ///throw new System.Exception("PGlobalPreviewerWIID.ToString(): " + oPreviewerWIID.value.ToString());
                }

            }
            else
            {
                //throw new System.Exception("skjflksjdflkjsdlkfj: " + PGlobal.Count.ToString());
            }

        }
        catch (Exception Ex)
        {
            throw new Exception(null, Ex);
        }
        finally
        {
            if (oPMgr != null)
            {
                oPMgr.Dispose();
                oPMgr = null;
            }
            if (WManager != null)
            {
                WManager.Dispose();
                WManager = null;
            }
            if (oAdmin != null)
            {
                oAdmin.Dispose();
                oAdmin = null;
            }
            if (OManager != null)
            {
                OManager.Dispose();
                OManager = null;
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
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
            if (oXML != null)
            {
                oXML = null;
            }
            if (oVRMembers != null)
            {
                oVRMembers = null;
            }
        }

    }

    private System.Xml.XmlDocument pParseRequestBytes()
    {
        System.Byte[] aBytes = Request.BinaryRead(Request.TotalBytes);
        try
        {
            System.Xml.XmlDocument oXMLData = new System.Xml.XmlDocument();
            System.Text.Decoder oDecoder = System.Text.Encoding.UTF8.GetDecoder();
            //aBytes = Request.BinaryRead(Request.TotalBytes);
            //Dim aChars(oDecoder.GetCharCount(aBytes, 0, aBytes.Length)) As System.Char;
            System.Char[] aChars = new Char[oDecoder.GetCharCount(aBytes, 0, aBytes.Length)];
            oDecoder.GetChars(aBytes, 0, aBytes.Length, aChars, 0);
            oXMLData.Load(new System.IO.StringReader(new String(aChars)));
            return oXMLData;
        }
        catch (System.Exception Ex)
        {
            throw new Exception("pParseRequestBytes", Ex);
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
