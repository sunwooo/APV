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

// <summary>
// 시  스  템 : WP2.0
// 단위시스템 : Approval
// 프로그램명 : 전자결재 Woitem Instance 취소(Abort)
// 모  듈  명 : switchWI2Cancel
// 파  일  명 : switchWI2Cancel.aspx
// 설      명 : 승인 취소(결재 후 다음 결재가 이루어지지 않은 상황에서 미결함으로 문서 되돌리기)
// </summary>
// <history>
// CH00 2007/07/16 황선희 : 최초 작성
// 
// </history>
public partial class Approval_InstMgr_switchWI2Cancel : PageBase // PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    /// <summary>
    /// 다국어 설정
    /// 결재선 처리 및 Update
    /// global 변수 Update
    /// 다음단계 완료건수 확인
    /// Update 및 취소 처리
    /// 승인 취소 알림
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        //다국어 언어설정
        if (Session["user_language"] != null)
        {
            strLangID = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        string culturecode = strLangID;	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");

        CfnCoreEngine.WfAdministration oAdmin = null;
        CfnCoreEngine.WfActivityManager oAMgr = null;
        CfnCoreEngine.WfWorkitemManager oWMgr = null;
        CfnCoreEngine.WfOrganizationManager oManager = null;
        DataSet oDS = null;
        DataPack INPUT = null;

        try
        {
            oAdmin = new CfnCoreEngine.WfAdministration();
            oAMgr = new CfnCoreEngine.WfActivityManager();
            oWMgr = new CfnCoreEngine.WfWorkitemManager();
            oManager = new CfnCoreEngine.WfOrganizationManager();

            System.Xml.XmlDocument oRequestXML = COVIFlowCom.Common.ParseRequestBytes(Request);
            System.Xml.XmlElement elmRoot = oRequestXML.DocumentElement;
            System.String sPIID = COVIFlowCom.Common.GetProp(elmRoot, "piid", true);
            System.String sWIID = COVIFlowCom.Common.GetProp(elmRoot, "wiid", true);
            System.String sUSID = COVIFlowCom.Common.GetProp(elmRoot, "usid", true);
            System.String Form_name = COVIFlowCom.Common.GetProp(elmRoot, "fmnm", true); // 20151113 양식명 추가 
            System.String sComment = COVIFlowCom.Common.GetProp(elmRoot, "actcmt", false);
            //System.String sSubject = Convert.ToString(oAdmin.GetPropertyValue("WfProcessInstance", sPIID, "subject"));
            System.String Subject = Convert.ToString(oAdmin.GetPropertyValue("WfProcessInstance", sPIID, "subject")); // 20151113 제목 적용 수정 
            System.String sSubject = "[" +"승인취소"+ "]" + Subject;// 20151113 제목 적용 수정 
            System.String sAIID = String.Empty;


            // 20151113 취소 메일 보내기 추가 
            //System.Xml.XmlDocument oApvList = null;
            //System.Xml.XmlNode oCharge = null;
            //System.Xml.XmlDocument oXML = null;
            //System.Xml.XmlNode oFNode = null;
            System.Text.StringBuilder sbMailBody = null;

            //System.String sSubject = "[" + Resources.Approval.lbl_circulation + "][" + Form_name + "]" + Subject;// +"(" + oCharge.Attributes["name"].Value + "/" + oCharge.SelectSingleNode("taskinfo").Attributes["datecompleted"].Value.Substring(0, 10) + ")";
            //oCharge = null;
            //oXML = new System.Xml.XmlDocument();
            //oXML.LoadXml(Link_URL);
            //oFNode = oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");
            //oXML = null;

            sbMailBody = new System.Text.StringBuilder();
            
            //sbMailBody.Append("<MAIL>");
            //sbMailBody.Append("<TITLE><![CDATA[").Append(Resources.Approval.lbl_Notice_mail).Append("]]></TITLE>");
            //sbMailBody.Append("<CONTENT BOLD='NO'><![CDATA[[");
            //sbMailBody.Append(Form_name).Append(" - ");
            //sbMailBody.Append(sSubject);
            //sbMailBody.Append("(").Append("승인취소").Append(")");
            //sbMailBody.Append("]]]></CONTENT>");
            //sbMailBody.Append("<CONTENT BOLD='YES'><![CDATA[[");
            //sbMailBody.Append(sComment);
            //sbMailBody.Append("]]]></CONTENT>");

            sbMailBody.Append("<MAIL>");
		    sbMailBody.Append("<TITLE><![CDATA[").Append(" 결재문서취소").Append("]]></TITLE>");
		    sbMailBody.Append("<TITLE><![CDATA[").Append(" 그룹웨어에서 확인하시기 바랍니다 (Please check in the groupware)").Append("]]></TITLE>");
            sbMailBody.Append("<CONTENT BOLD='YES'><![CDATA[제목(Subject):  ");
            sbMailBody.Append(Subject);
		    sbMailBody.Append("]]></CONTENT>");
            sbMailBody.Append("<CONTENT BOLD='YES'><![CDATA[취소사유:  ");
            sbMailBody.Append(sComment);
		    sbMailBody.Append("]]></CONTENT>");
            //sbMailBody.Append("<URL><![CDATA[");
            //sbMailBody.Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString());
            //sbMailBody.Append("Approval/Forms/Form.aspx?");
            //sbMailBody.Append("mode=COMPLETE");
            //sbMailBody.Append("&piid=").Append(Process_id);
            //sbMailBody.Append("&fmid=").Append(oFNode.Attributes["id"].Value);
            //sbMailBody.Append("&fmpf=").Append(oFNode.Attributes["prefix"].Value);
            //sbMailBody.Append("&fmrv=").Append(oFNode.Attributes["revision"].Value);
            //sbMailBody.Append("&fiid=").Append(oFNode.Attributes["instanceid"].Value);
            //sbMailBody.Append("&scid=").Append(oFNode.Attributes["schemaid"].Value);
            //sbMailBody.Append("&secdoc=").Append(oFNode.Attributes["secure_doc"].Value);
            //sbMailBody.Append("]]></URL></MAIL>");
            sbMailBody.Append("</MAIL>");
            //oFNode = null;
            string sContents = string.Empty;
            //html 포맷 맞추기 
            System.IO.StringWriter oTW = null;
            try
            {
                System.Xml.Xsl.XsltSettings settings = new System.Xml.Xsl.XsltSettings(true, true);
                System.Xml.Xsl.XslCompiledTransform xslsteps = new System.Xml.Xsl.XslCompiledTransform();
                {//이준희(2010-10-07): Changed to support SharePoint environment.
                    //xslsteps.Load(Server_MapPath("\\\\CoviWeb\\common\\Mail.xsl"), settings, new System.Xml.XmlUrlResolver());
                    xslsteps.Load(cbsg.CoviServer_MapPath("\\\\CoviWeb\\common\\Mail.xsl"), settings, new System.Xml.XmlUrlResolver());
                }
                System.Xml.XPath.XPathDocument oXPathDoc = new System.Xml.XPath.XPathDocument(new System.IO.StringReader(sbMailBody.ToString()));
                oTW = new System.IO.StringWriter();
                xslsteps.Transform(oXPathDoc, null, oTW);
                oTW.GetStringBuilder().Remove(0, 39);
                sContents = oTW.ToString();
                oTW.Close();
                oTW = null;
            }
            catch (System.Exception ex)
            {
            }
            finally
            {
                if (oTW != null)
                {
                    oTW.Close();
                    oTW = null;
                }
            }
            // 20151113 취소 메일 보내기 추가 끝 

            //결재선 처리
            #region
                //결재선 정보
                System.Xml.XmlDocument oXML = new System.Xml.XmlDocument();
                oXML.LoadXml(elmRoot.SelectSingleNode("apvlist/steps").OuterXml.ToString());

                System.Xml.XmlDocument oApvList = oXML;//최종결재선
                System.Xml.XmlNode oApvRoot = oApvList.DocumentElement;
                System.Xml.XmlNode oStep=null;

                //승인취소자 추출
                System.Xml.XmlNodeList oSteps = oApvRoot.SelectNodes("division[taskinfo/@status='pending']/step[ou/person/taskinfo/@kind!='charge' and ou/person/taskinfo/@kind!='bypass' and ou/person/taskinfo/@kind!='review' ]");

                foreach(System.Xml.XmlNode oStepTemp in oSteps){
                    if (oStepTemp.SelectSingleNode("ou/person[(taskinfo/@kind!='charge' and taskinfo/@kind!='bypass' and taskinfo/@kind!='review' ) and  taskinfo/@status='pending']") != null)
                    {
                        break;
                    }
                    oStep = oStepTemp;
                }

                //현재 결재자 추출 - 추출 시 status, result도 변경
                System.Xml.XmlNode oPendingStep = oApvRoot.SelectSingleNode("division[taskinfo/@status='pending']/step[ou/person/taskinfo/@status='pending']");
                System.Xml.XmlNodeList oPendingPersons = oApvRoot.SelectNodes("division[taskinfo/@status='pending']/step/ou/person[taskinfo/@status='pending']");
                System.String[] sRecipients = new string[oPendingPersons.Count];
                System.Int32 idx = 0;

                foreach (System.Xml.XmlNode oPendingPerson in oPendingPersons)
                {
                    if (oPendingPerson.Name == "role")
                    {
                        sRecipients[idx] = oPendingPerson.SelectSingleNode("person").Attributes["code"].Value;
                    }
                    else
                    {
                        sRecipients[idx] = oPendingPerson.Attributes["code"].Value;
                    }
                    idx++;
                    System.Xml.XmlNode oPendingPersonTaskInfo = oPendingPerson.SelectSingleNode("taskinfo");
                    oPendingPersonTaskInfo.Attributes["status"].Value = "inactive";
                    oPendingPersonTaskInfo.Attributes["result"].Value = "inactive";
                    oPendingPersonTaskInfo.Attributes.RemoveNamedItem("datereceived");
                    //oPendingPersonTaskInfo.Attributes.RemoveNamedItem("wiid");
                }

                //현재 step 상태변경
                if (oPendingStep.SelectSingleNode("taskinfo") != null)
                {
                    System.Xml.XmlNode oPendingStepTaskinfo = oPendingStep.SelectSingleNode("taskinfo");
                    oPendingStepTaskinfo.Attributes["status"].Value = "inactive";
                    oPendingStepTaskinfo.Attributes["result"].Value = "inactive";
                    oPendingStepTaskinfo.Attributes.RemoveNamedItem("datereceived");
                }

                //이전 결재자 상태 변경
                //대결일 경우 원결재선으로 변경
                System.Xml.XmlNode oStepPersonTaskinfo = oStep.SelectSingleNode("ou/*/taskinfo[@status!='inactive']");
                if (oStepPersonTaskinfo.Attributes["kind"].Value == "substitute")
                {
                    oApvList.RemoveChild(oStep);
                    oStep = oStep.NextSibling;
                }
                System.Xml.XmlNode oStepTaskinfo = oStep.SelectSingleNode("taskinfo");

                if (oStepPersonTaskinfo.Attributes["kind"].Value == "bypass")
                {
                    oStepPersonTaskinfo.Attributes["kind"].Value = "normal";
                }
                oStepPersonTaskinfo.Attributes["status"].Value = "inactive";
                oStepPersonTaskinfo.Attributes["result"].Value = "inactive";
                oStepPersonTaskinfo.Attributes.RemoveNamedItem("datereceived");
                oStepPersonTaskinfo.Attributes.RemoveNamedItem("datecompleted");
                oStepPersonTaskinfo.Attributes.RemoveNamedItem("customattribute1");
                if (oStepPersonTaskinfo.SelectSingleNode("comment") != null)
                {
                    oStepPersonTaskinfo.RemoveChild(oStepPersonTaskinfo.SelectSingleNode("comment"));
                }

                if (oStepTaskinfo != null)
                {
                    oStepTaskinfo.Attributes["status"].Value = "inactive";
                    oStepTaskinfo.Attributes["result"].Value = "inactive";
                    oStepTaskinfo.Attributes.RemoveNamedItem("datereceived");
                    oStepTaskinfo.Attributes.RemoveNamedItem("datecompleted");
                }
                
                
            #endregion

            //결재선 Update
            #region
                CfnDatabaseUtility.WfEntityFilter[] aEFs = {
                    new CfnDatabaseUtility.WfEntityFilter("piid", COVIFlowCom.Common.GetProp(elmRoot, "piid", true), CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true),
                    new CfnDatabaseUtility.WfEntityFilter("name", "APPROVERCONTEXT", CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true)
                };
                System.Collections.ArrayList oDDs = oAdmin.GetEntity(typeof(CfnEntityClasses.WfDomainDataInstance), aEFs);

                CfnEntityClasses.WfDomainDataInstance oDDI = (CfnEntityClasses.WfDomainDataInstance)oDDs[0];
                oDDI.value = oApvList.Clone();

            #endregion
            
            //Global변수 Update 
            #region
                //System.Collections.Specialized.NameValueCollection oGLRDIs = new System.Collections.Specialized.NameValueCollection();
                //oGLRDIs.Add("CurrentRouteType","");
                CfnDatabaseUtility.WfEntityFilter[] aEFGRDIs = {
                    new CfnDatabaseUtility.WfEntityFilter("ownerId", COVIFlowCom.Common.GetProp(elmRoot, "piid", true), CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true),
                    new CfnDatabaseUtility.WfEntityFilter("name", "CurrentRouteType", CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true)
                };
                System.Collections.ArrayList oGRDI = oAdmin.GetEntity(typeof(CfnEntityClasses.WfGlobalRDI), aEFGRDIs);
                //CfnEntityClasses.WfRelevantDataInstance oGRDI = (CfnEntityClasses.WfRelevantDataInstance)oAdmin.GetEntity(typeof(CfnEntityClasses.WfGlobalRDI), aEFGRDIs);
                foreach (CfnEntityClasses.WfRelevantDataInstance oRDI in oGRDI)
                {
                    if (oRDI.name == "CurrentRouteType")
                    {
                        oRDI.value = "";
                    }
                }
            #endregion

            //다음단계 완료된 결재건수 있는지 확인
            System.String szQuery = "dbo.usp_wf_getworkitemAbort";
            INPUT = new DataPack();
            INPUT.add("@PROCESS_ID", sPIID);
            INPUT.add("@WORKITEM_ID", sWIID);

            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();

                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, szQuery, INPUT);
            }
            if (oDS == null && oDS.Tables.Count < 2)
            {
                throw new System.Exception(Resources.Approval.msg_112);
            }
            else
            {
                if (System.Convert.ToInt32(oDS.Tables[0].Rows[0]["WI_ID_COUNT"]) > 0)
                {
                    throw new System.Exception(Resources.Approval.msg_112);
                }
                else
                {
                    sAIID = System.Convert.ToString(oDS.Tables[1].Rows[0]["WI_AI_ID"]);
                }
            }

            //Update 및 취소 처리 영역
            #region
                System.Collections.ArrayList oData = new System.Collections.ArrayList();
                oData.Add(oDDI);
                oData.Add(oGRDI[0]);
                oAdmin.UpdateData(typeof(CfnEntityClasses.WfDomainDataHistory), oData, "CoviflowNET");
                
               CfnDatabaseUtility.WfEntityFilter[] aEFWIs = {
                        new CfnDatabaseUtility.WfEntityFilter("aiid", sAIID, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true),
                        new CfnDatabaseUtility.WfEntityFilter("state", CfnEntityClasses.CfInstanceState.instClosed_Completed, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopNotEqual,true)
                    };
                System.Collections.ArrayList oWIs = oWMgr.GetEntity(aEFWIs);
                foreach (CfnEntityClasses.WfWorkitem oWI in oWIs)
                {
                    oManager.ReassignWorkitem(
                            oWI.id,
                            oWI.pfid,
                            "AdministratorTerminate",
                            "AdministratorTerminate",
                            CfnEntityClasses.CfParticipantKind.ptkdSystem,
                            CfnCoreEngine.WfOrganizationManager.VRHandlerKey.pthkSystem,
                            null,
                            "T010",
                            false);
                    oWMgr.RequestComplete(oWI, null, null);
                }

                CfnEntityClasses.WfWorkitem oWIApprover = oWMgr.GetEntity(sWIID);
                oWMgr.Abort(oWIApprover);
            #endregion


             #region notify
                if (sRecipients.Length > 0)
                {
                    try
                    {
                        COVIFlowCom.Common.SendMessage2(
                            sSubject,
                            sUSID,
                            sRecipients,
                            CfnEngineInterfaces.IWfOrganization.OMEntityType.ettpPerson,
                            System.Net.Mail.MailPriority.Normal,
                            true,
                            sContents,
                            Session["user_language"].ToString()
                            );
                    }
                    catch (System.Exception exmail)
                    {
                    }
                }
                #endregion


            //#region notify
            //    if (sRecipients.Length > 0)
            //    {
            //        try
            //        {
            //            COVIFlowCom.Common.SendMessage(
            //                sSubject,
            //                sUSID,
            //                sRecipients,
            //                CfnEngineInterfaces.IWfOrganization.OMEntityType.ettpPerson,
            //                System.Net.Mail.MailPriority.Normal,
            //                false,
            //                sComment);
            //        }
            //        catch (System.Exception exmail)
            //        {
            //        }
            //    }
            //#endregion

            #region setpoint  포인트 입력 - 49 : 결재승인 취소
                //SetPoint("52", sUSID, "WI546" + sPIID);
            #endregion


            Response.Write(Resources.Approval.msg_138);
            System.EnterpriseServices.ContextUtil.SetComplete();
        }
        catch (System.Exception ex)
        {
            
            System.EnterpriseServices.ContextUtil.SetAbort();
            Response.Write("<error><![CDATA[" + Server.HtmlEncode(COVIFlowCom.ErrResult.ParseStackTrace(ex)) + "]]></error>");
        }
        finally
        {
            //code
            if (oAdmin != null)
            {
                oAdmin.Dispose();
                oAdmin = null;
            }
            if (oAMgr != null)
            {
                oAMgr.Dispose();
                oAMgr = null;
            }
            if (oWMgr != null)
            {
                oWMgr.Dispose();
                oWMgr = null;
            }
            if (oManager != null)
            {
                oManager.Dispose();
                oManager = null;
            }
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
            Response.Write("</response>");
        }
    }
}
