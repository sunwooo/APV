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
    /// 시  스  템 : WP
    /// 단위시스템 : Approval
    /// 프로그램명 : 전자결재 Process Instance 취소(Abort)
    /// 모  듈  명 : switchPI2Abort
    /// 파  일  명 : switchPI2Abort.aspx
    /// 설      명 : Process Instance 취소(기안후 기안자가 결재가 이루어지지 않은 결재문서 회수)
    ///              기안취소 또는 회수 처리
    /// </summary>
    /// <history>
    /// CH00 2003/06/10 황선희 : 최초 작성
    /// 
    /// </history>

public partial class COVIFlowNet_Admin_InstMgr_switchPI2Abort :PageBase // PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    /// <summary>
    /// 다국어 설정
    /// 결재 인스탄스 상태 체크
    /// 해당 프로세스 취소 처리
    /// 상위 프로세스 취소 처리
    /// 취소 메일 발송
    /// 포인트 처리
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
        CfnCoreEngine.WfProcessManager oPMgr = null;
        CfnCoreEngine.WfWorkitemManager oWMgr = null;
        CfnDatabaseManager.WfDBManager oDBMgr = null;

        try
        {
            oPMgr = new CfnCoreEngine.WfProcessManager();
            oWMgr = new CfnCoreEngine.WfWorkitemManager();
            oDBMgr = new CfnDatabaseManager.WfDBManager();

            System.Xml.XmlDocument oRequestXML = COVIFlowCom.Common.ParseRequestBytes(Request);
            System.Xml.XmlElement elmRoot = oRequestXML.DocumentElement;
            System.String sPIID = COVIFlowCom.Common.GetProp(elmRoot, "piid", true);
            System.String sUSID = COVIFlowCom.Common.GetProp(elmRoot, "usid", true);
            System.String sComment = COVIFlowCom.Common.GetProp(elmRoot, "actcmt", false);
            System.String sMode = COVIFlowCom.Common.GetProp(elmRoot, "type", false); //회수, 취소 구분
            System.String sFMPF = COVIFlowCom.Common.GetProp(elmRoot, "fmpf", true);
            System.String sFIID = COVIFlowCom.Common.GetProp(elmRoot, "fiid", false);
            System.String sKEYVALUE;

            CfnEntityClasses.WfProcessInstance oPI = (CfnEntityClasses.WfProcessInstance)oPMgr.GetEntity(sPIID);

            //'결재 인스턴스의 상태 체크
            System.Int32 iPIState = (System.Int32)oPMgr.GetPropertyValue("WfProcessInstance", COVIFlowCom.Common.GetProp(elmRoot, "piid", true), "state");

            if (iPIState > 500)
            {
                Response.Write("<error>" +Resources.Approval.btn_cancel + "</error>");
            }
            else
            {
                //해당 프로세스의 ThreadContext 막기
                if (this.ClearThreadContext(sPIID))
                {
                    //'//완료일자 및 취소처리
                    oDBMgr.ChangeProperty("WfProcessInstance", sPIID, "finishDate", System.DateTime.Now);
                    oPMgr.Abort(oPI);

                    //'//상위 프로세스 존재시 상위 프로세스 변경
                    System.String sPPIID = String.Empty;
                    sPPIID = Convert.ToString(oPI.parentPiid);
                    if (sPPIID != null && sPPIID != String.Empty)
                    {
                        if (this.ClearThreadContext(sPPIID))
                        {
                            CfnEntityClasses.WfProcessInstance oPPI = (CfnEntityClasses.WfProcessInstance)oPMgr.GetEntity(sPPIID);
                            oDBMgr.ChangeProperty("WfProcessInstance", sPPIID, "finishDate", System.DateTime.Now);
                            oPMgr.Abort(oPPI);
                        }
                    }
                }

                //ARCHIVE DB DELETE
                DataPack INPUTD = null;
                try
                {
                    INPUTD = new DataPack();
                    INPUTD.add("@PROCESS_ID", sPIID);
                    using (SqlDacBase SqlDbAgent = new SqlDacBase())
                    {
                        SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                        object ireturn = System.Convert.ToDecimal(SqlDbAgent.ExecuteScalar(CommandType.StoredProcedure, "dbo.usp_wf_delete_archive_processid", INPUTD));
                    }
                }
                catch (System.Exception ex)
                {
                }
                finally
                {
                    if (INPUTD != null)
                    {
                        INPUTD.Dispose();
                        INPUTD = null;
                    }
                }

                //회람 삭제
                try
                {
                    INPUTD = new DataPack();
                    INPUTD.add("@Form_inst_id", COVIFlowCom.Common.GetProp(elmRoot, "fiid", true));
                    using (SqlDacBase SqlDbAgent = new SqlDacBase())
                    {
                        SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
                        object ireturn = System.Convert.ToDecimal(SqlDbAgent.ExecuteScalar(CommandType.StoredProcedure, "dbo.usp_wfform_circulationdelete", INPUTD));
                    }
                }
                catch (System.Exception ex)
                {
                }
                finally
                {
                    if (INPUTD != null)
                    {
                        INPUTD.Dispose();
                        INPUTD = null;
                    }
                }

                //취소/회수일 경우 메일 발송
                if (sMode == "abort" || sMode == "withdraw")
                {
                //if (sComment != String.Empty)
                //{
                    this.pProcessMailSend(oRequestXML, sMode);

                }

                /*
                //결재문서 취소
                if (oPI.initiatorId == sUSID)
                {
                    //결재문서 취소
                    //업무의뢰 관련 sp 호출
                    if (COVIFlowCom.Common.GetProp(elmRoot, "fmpf", true) == "WF_FORM_DRAFT" || COVIFlowCom.Common.GetProp(elmRoot, "fmpf", true) == "WF_FORM_MEMO" || COVIFlowCom.Common.GetProp(elmRoot, "fmpf", true) == "WF_FORM_COORDINATE" || COVIFlowCom.Common.GetProp(elmRoot, "fmpf", true) == "WF_FORM_REQUEST")
                    {
                        bool oReturn = false;
                        DataPack INPUT = null;

                        try
                        {
                            INPUT = new DataPack();

                            //@CD_APPROVEINFO 결재 ID
                            //@DT_APPROVE 결재일자
                            //@DS_APPROVE_STATE 결재상태
                            //@DS_APPROVE_TITLE 결재제목

                            INPUT.add("@CD_APPROVEINFO", COVIFlowCom.Common.GetProp(elmRoot, "fiid", true));
                            INPUT.add("@DT_APPROVE", System.DateTime.Now);
                            //INPUT.add("@DS_APPROVE_STATE", System.DateTime.Now);
                            
                            if (sComment != String.Empty)
                            {
                                INPUT.add("@DS_APPROVE_STATE", "취소");                                
                            }
                            //결재문서 회수
                            else
                            {
                                INPUT.add("@DS_APPROVE_STATE", "회수");                                
                            }

                            INPUT.add("@DS_APPROVE_TITLE", oPI.subject);
                            using (SqlDacBase SqlDbAgent = new SqlDacBase())
                            {
                                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
                                SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, "COVI_GROUPWARE.dbo.TMP_APPROVAL_UPDATE", INPUT);
                            }

                            oReturn = true;

                        }
                        catch (System.Exception ex)
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
                    }
                }
                */
            }

            Response.Write(Resources.Approval.msg_151); //결재진행 쥐소 용어 변경 msg_138에서 151로 변경 20071013
            System.EnterpriseServices.ContextUtil.SetComplete();

            //연동양식 기안취소 및 회수시 연동처리 (2013-01-08 HIW)
            //if (sFMPF == "WF_FORM_COMMON_VACATION" || sFMPF == "WF_FORM_COMMON_EDUCATION" || sFMPF == "WF_FORM_COMMON_CERTIFICATION" || sFMPF == "WF_FORM_COMMON_WORK_ATTITU")
            /* 2014.01.06 LHI 수정 (이수시스템 휴가신청및변경 추가) */
            /* 2014.09.15 PSW 수정 (이수시스템 휴가신청/휴가취소 양식 분류 추가) */
            /* 2016.04.21 jkh 수정 (이수시스템 전자증빙 회람) WF_SLIP */
			/* 2018.08.16 PSW 수정 (이수시스템 국내/해외출장신청서) */
			/* 2018.09.14 PSW 수정 (이수화학 해외출장신청서) */
			/* 2019.01.08 PSW 수정 (주이수 전자증빙시스템) */
            if (sFMPF == "WF_FORM_COMMON_VACATION" 
                || sFMPF == "WF_FORM_COMMON_VACATION_2" 
                || sFMPF == "WF_FORM_COMMON_VACATION_ST" 
                || sFMPF == "WF_FORM_COMMON_VACATION_CHG" 
                || sFMPF == "WF_FORM_COMMON_EDUCATION" 
                || sFMPF == "WF_FORM_COMMON_CERTIFICATION" 
                || sFMPF == "WF_FORM_COMMON_WORK_ATTITU" 
                || sFMPF == "WF_FORM_COMMON_VACA_REGIST" 
                || sFMPF == "WF_FORM_COMMON_VACA_CANCEL"
                || sFMPF == "WF_SLIP"
				|| sFMPF == "WF_ORDER"
				|| sFMPF == "WF_FORM_HR_IN_TRIP_3"
				|| sFMPF == "WF_FORM_HR_OUT_TRIP_4"
				|| sFMPF == "WF_FORM_COMMON_EDUCATION_3"
				|| sFMPF == "WF_FORM_HR_OUT_TRIP_5"
				|| sFMPF == "WF_SLIP_ISU"
				|| sFMPF == "WF_FORM_ISU_ACCOUNTING_003"
				|| sFMPF == "WF_FORM_ISU_ACCOUNTING_007"
				|| sFMPF == "WF_FORM_ISU_ACCOUNTING_011")
            {
                FormWS ws = new FormWS();
                ws.ExecuteLegacy(sFMPF, COVIFlowCom.Common.GetProp(elmRoot, "formdata/BODY_CONTEXT", false), "<FORM_INFO_EXT></FORM_INFO_EXT>", COVIFlowCom.Common.GetProp(elmRoot, "apvlist", false), false, sMode, "", sUSID, sFIID);
            }
        }
        catch (System.Exception ex)
        {
            
            Response.Write("<error>" + Server.HtmlEncode(COVIFlowCom.ErrResult.ParseStackTrace(ex)) + "</error>");
            System.EnterpriseServices.ContextUtil.SetAbort();
        }
        finally
        {
            //code
            if (oDBMgr != null)
            {
                oDBMgr.Dispose();
                oDBMgr = null;
            }
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
            Response.Write("</response>");
        }

    }

    /// <summary>
    /// 취소메일 발송
    /// 모바일 결재 취소 처리
    /// </summary>
    /// <param name="oFormXMLDOM">취소요청 내역</param>
    /// <param name="sMode">취소구분</param>
    private void pProcessMailSend(System.Xml.XmlDocument oFormXMLDOM, string sMode) // 수정요망
    {
        CfnCoreEngine.WfAdministration oAdmin = new CfnCoreEngine.WfAdministration();
        CfnCoreEngine.WfOrganizationQueryManager OManager = null;
        try
        {
         
                System.Xml.XmlElement elmRoot   = oFormXMLDOM.DocumentElement;
                System.String sPiid = COVIFlowCom.Common.GetProp(elmRoot, "piid", true);
                System.String sUserID = COVIFlowCom.Common.GetProp(elmRoot, "usid", true);
                System.String sOUID = COVIFlowCom.Common.GetProp(elmRoot, "dpid_apv", true);
                System.String sComment = COVIFlowCom.Common.GetProp(elmRoot, "actcmt", false);
                System.String sfmnm = COVIFlowCom.Common.GetProp(elmRoot, "fmnm", false);// fmnm
                System.String sfiid = COVIFlowCom.Common.GetProp(elmRoot, "fiid", false);// fiid

                System.String sUsDN = COVIFlowCom.Common.GetProp(elmRoot, "usdn", false);//기안자: 김병로
                System.String sDpDN = COVIFlowCom.Common.GetProp(elmRoot, "dpdn_apv", false);//부서명 : 
                System.String sSvDt = COVIFlowCom.Common.GetProp(elmRoot, "svdt", false);//기안일 : 


                CfnDatabaseUtility.WfEntityFilter[] aEFs ={
                            new CfnDatabaseUtility.WfEntityFilter ("piid",Convert.ToString(COVIFlowCom.Common.GetProp(elmRoot, "piid", true)),CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual ,true),
                            new CfnDatabaseUtility.WfEntityFilter ("name",Convert.ToString("APPROVERCONTEXT"),CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true)
                        };
                CfnCoreEngine.WfAdministration objMTS = new CfnCoreEngine.WfAdministration();
                System.Collections.ArrayList oDDs = objMTS.GetEntity(typeof(CfnEntityClasses.WfDomainDataInstance), aEFs);
                CfnEntityClasses.WfDomainDataInstance oDDI = (CfnEntityClasses.WfDomainDataInstance)oDDs[0];

                System.String sSubject  = Convert.ToString(oAdmin.GetPropertyValue("WfProcessInstance", sPiid, "subject"));

                System.Xml.XmlDocument oApvList = (System.Xml.XmlDocument)oDDI.value;
                System.Xml.XmlNode oApvRoot = oApvList.DocumentElement;

                System.Xml.XmlNode oStep;
                System.Boolean bRecYN  = false;

                oStep = oApvRoot.SelectSingleNode("division[@divisiontype='send']/step[(ou/*/taskinfo/@status='pending')]");
                if(oStep!= null){
                }else{
                    bRecYN = true;
                }

                sSubject = "[" + Resources.Approval.btn_cancel +"][" + sSubject + "]";//: " + COVIFlowCom.Common.GetProp(elmRoot, "usdn", true);

                System.Xml.XmlNodeList oPrevPersons ;
                if( bRecYN){
                    oPrevPersons = oApvRoot.SelectNodes("division[@divisiontype='receive']/step[ou/taskinfo/@status='pending']/ou/*[taskinfo/@status='completed' or taskinfo/@status='pending']");
                }else{
                    oPrevPersons = oApvRoot.SelectNodes("division[@divisiontype='send']/step/ou/*[taskinfo/@status='completed' or taskinfo/@status='pending']");
                }

                System.String[] sRecipients = new string[oPrevPersons.Count]; 
                //'sRecipients(0) = oApvRoot.Attributes("initiatorcode").Value
                System.Int32  idx = 0;

                foreach ( System.Xml.XmlNode oPrevPerson in oPrevPersons){
                    if ( oPrevPerson.Name == "role"){
                        sRecipients[idx] = oPrevPerson.SelectSingleNode("person").Attributes["code"].Value;
                    }else{
                        sRecipients[idx]= oPrevPerson.Attributes["code"].Value;
                    }
                    idx++;
                }

                if( sRecipients.Length > 0 && sComment != "" ){
                    try
                    {
                        //메일발송
                        COVIFlowCom.Common.SendMessage(
                            sSubject,
                            oApvRoot.Attributes["initiatorcode"].Value,
                            sRecipients,
                            CfnEngineInterfaces.IWfOrganization.OMEntityType.ettpPerson,
                            System.Net.Mail.MailPriority.Normal,
                            false,
                            sComment);
                    }
                    catch (System.Exception exmail)
                    {
                     //   throw new System.Exception("pProcessMailSend", exmail); 메일발송에 관계 없이 메일 발송이 진행된다.
                    }
                }
                #region 모바일결재
                //모바일 결재 문서일 경우 모바일 결재 대상자들 push
                System.Xml.XmlNode oMobileYN = elmRoot.SelectSingleNode("IsMobile");
                String sMobileMode = string.Empty;
                if (sMode == "withdraw")
                {
                    sMobileMode = "RETURN";
                }
                else
                {
                    sMobileMode = "CANCEL";
                }
                if (oMobileYN != null && oMobileYN.InnerText == "true")
                {
                    DataPack hst = null;
                    try
                    {
                        hst = new DataPack();
                        OManager = new CfnCoreEngine.WfOrganizationQueryManager();
                        System.Xml.XmlDocument oMobileXML = OManager.GetOMEntityInfo(sRecipients, CfnEngineInterfaces.IWfOrganization.OMEntityType.ettpPerson);
                        if (oMobileXML != null)
                        {
                            foreach (System.Xml.XmlNode oNode in oMobileXML.DocumentElement.ChildNodes)
                            {
                                if (oNode.Attributes["mobileyn"].Value == "Y")
                                {
                                    hst.Clear();
                                    try
                                    {
                                        using (SqlDacBase oDB = new SqlDacBase())
                                        {
                                            hst.add("@touser_id", oNode.Attributes["code"].Value);               //-- 사번 
                                            hst.add("@msg_event", "APPR_NEW");           //'-- push event 종류(메일:MAIL_NEW, 전자결재:APPR_NEW, CRM:CRM_NEW)
                                            hst.add("@mailkey", String.Empty);     //'-- 메일키(URL)
                                            hst.add("@crmkey", String.Empty);     //'--CRM 문서키 
                                            hst.add("@piid", sPiid);            //'-- 전자결재 문서키 1
                                            hst.add("@wiid", String.Empty);           //'-- 전자결재 문서키 2
                                            hst.add("@pfid", String.Empty);       //'-- 전자결재 문서키 3
                                            hst.add("@ptid", oNode.Attributes["code"].Value);        //'-- 전자결재 문서키 4
                                            hst.add("@usid", oNode.Attributes["code"].Value);            //'-- 전자결재 문서키 5
                                            hst.add("@fiid", sfiid);     //'-- 전자결재 문서키 6
                                            hst.add("@fmpf", String.Empty);         //'-- 전자결재 문서키 7
                                            hst.add("@fmrv", String.Empty);      //'-- 전자결재 문서키 8
                                            hst.add("@sender", oApvRoot.Attributes["initiatorcode"].Value);          //'-- 메일:보낸사람 메일주소, 전자결재,CRM:기안자 이름
                                            hst.add("@write_dt", System.DateTime.Now);          //'등록자명
                                            hst.add("@important", String.Empty);  //'-- 메일 중요도(0:낮음,1:보통,2:높음) 
                                            hst.add("@attach", String.Empty);  //'-- 첨부파일 여부 (Y:첨부있음, N:첨부없음)
                                            hst.add("@subject", sSubject);    //'-- 제목
                                            hst.add("@doc_type", String.Empty);            //'-- 전자결재 문서종류(미결,반송)
                                            hst.add("@doc_status", sMobileMode);          //'-- 전자결재 문서상태(취소:CANCEL, 회수:RETURN)

                                            oDB.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("MOBILE_ConnectionString").ToString();
                                            int oRet = oDB.ExecuteNonQuery(CommandType.StoredProcedure, "dbo.MPOP_PROC_PUSH_EVENT", hst);
                                        }
                                    }
                                    catch (System.Exception ex)
                                    {
                                        //ExceptionHandler(ex, false, WOORI.IGW.Framework.SystemOption.APV);
                                        throw ex;
                                    }
                                    finally
                                    {
                                    }
                                }
                            }
                        }
                    }
                    catch (System.Exception ex)
                    {
                    }
                    finally
                    {
                        if (hst != null)
                        {
                            hst.Dispose();
                            hst = null;
                        }
                    }
                }

                #endregion

        }
        catch (System.Exception ex)
        {
            
            throw new System.Exception("pProcessMailSend", ex);
        }
        finally
        {
            //code
            oAdmin.Dispose();
            if (OManager != null) OManager.Dispose();
        }
    }

    /// <summary>
    /// 결재 instance 취소처리
    /// Process Instance state, finished 날짜 변경
    /// Activity Instance state, finished 날짜 변경
    /// workitem Instance state, finished 날짜 변경
    /// ThreadContext dead상태로 변경
    /// </summary>
    /// <param name="sPIID"></param>
    /// <returns></returns>
    private bool ClearThreadContext(string sPIID)
    {
        
        System.Boolean bReturn = false;
        CfnDatabaseManager.WfDBManager oDBMgr = null;
        CfnCoreEngine.WfProcessManager oPMgr = null;
        CfnCoreEngine.WfActivityManager oAMgr = null;
        CfnCoreEngine.WfWorkitemManager oWMgr = null;
        try
        {
            oDBMgr = new CfnDatabaseManager.WfDBManager();
            oPMgr = new CfnCoreEngine.WfProcessManager();
            oAMgr = new CfnCoreEngine.WfActivityManager();
            oWMgr = new CfnCoreEngine.WfWorkitemManager();

            //code
                CfnDatabaseUtility.WfEntityFilter[] aSubPIEFs  = { 
                    new CfnDatabaseUtility.WfEntityFilter("parentPiid", sPIID, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true),
                    new CfnDatabaseUtility.WfEntityFilter("state", CfnEntityClasses.CfInstanceState.instOpen_NotRunning, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopNotEqual,true)};

                System.Collections.ArrayList oPIs   = oPMgr.GetEntity(aSubPIEFs);
                foreach(CfnEntityClasses.WfProcessInstance oPI in oPIs){
                    if (ClearThreadContext(oPI.id)){
                    }
                    oDBMgr.ChangeProperty("WfProcessInstance", oPI.id, "finishDate", System.DateTime.Now);
                    oPMgr.Abort(oPI);

                }

                CfnDatabaseUtility.WfEntityFilter[] aEFs = {
                    new CfnDatabaseUtility.WfEntityFilter("piid", sPIID, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true),
                    new CfnDatabaseUtility.WfEntityFilter("state", CfnEntityClasses.CfInstanceState.instClosed_Completed, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopNotEqual,true)
                };

                System.Collections.ArrayList oWIs = oWMgr.GetEntity(aEFs);
                foreach(CfnEntityClasses.WfWorkitem oWI in oWIs){
                    oDBMgr.ChangeProperty("WfWorkitem", oWI.id, "finishDate", System.DateTime.Now);
                    oWMgr.ChangeState(oWI, CfnEntityClasses.CfInstanceState.instClosed_AbnormalCompleted_Aborted);
                    oWMgr.Abort(oWI);
                }

                System.Collections.ArrayList oAIs   = oAMgr.GetEntity(aEFs);
                foreach(CfnEntityClasses.WfActivityInstance oAI in oAIs){
                    oDBMgr.ChangeProperty("WfActivityInstance", oAI.id, "finishDate", System.DateTime.Now);
                    oAMgr.ChangeState(oAI, CfnEntityClasses.CfInstanceState.instClosed_AbnormalCompleted_Aborted);
                    oAMgr.Abort(oAI);
                }

                CfnDatabaseUtility.WfEntityFilter[] aEntityFilters  = {
                 new CfnDatabaseUtility.WfEntityFilter("piid", sPIID, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true),
                 new CfnDatabaseUtility.WfEntityFilter("state", CfnEntityClasses.CfThreadContextState.tcstAlive, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true)
                };
                System.Collections.ArrayList oTCs   = oDBMgr.LookupEntityCollectionAsArrayList("WfThreadContext", aEntityFilters);
                foreach(CfnEntityClasses.WfThreadContext oTC in oTCs){
                    oTC.state = Convert.ToInt16(CfnEntityClasses.CfThreadContextState.tcstDead);
                }
                oDBMgr.UpdateEntity(oTCs);
                bReturn = true;
                return bReturn;
            }
        catch (System.Exception ex)
        {
            
            throw new System.Exception("", ex);
        }
        finally
        {
            //code
            if (oDBMgr != null)
            {
                oDBMgr.Dispose();
                oDBMgr = null;
            }
            if (oPMgr != null)
            {
                oPMgr.Dispose();
                oPMgr = null;
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
        }
    }
}
