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
//using System.Data.SqlClient;

using Covision.Framework;
using Covision.Framework.Data.Business;

// <summary>
// 시  스  템 : WP2.0
// 단위시스템 : Approval
// 프로그램명 : 전자결재 Woitem Instance 삭제처리 
// 모  듈  명 : switchWI2Del
// 파  일  명 : switchWI2Del.aspx
// 설      명 : 개인함 완료/반려/참조함 데이터 삭제처리(이관 디비 포함)
// </summary>
// <history>
// 
// 
// </history>
public partial class COVIFlowNet_Admin_InstMgr_switchWI2Del : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    /// <summary>
    /// 다국어 설정
    /// 완료/반려/참조(할당취소)함 데이터 삭제처리(이관디비 구분)
    /// 사용자 정의 폴더 이동 고려하서 데이터 변환
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

        Response.AddHeader("pragma", "no-cache");
        Response.AddHeader("cache-control", "private");
        Response.ContentType = "text/xml";
        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
        CfnDatabaseManager.WfDBManager oDBMgr = null;

        try
        { 
            //code
            System.Xml.XmlDocument oRequestXML = COVIFlowCom.Common.ParseRequestBytes(Request); 
            System.Xml.XmlNodeList oItems = oRequestXML.SelectNodes("//item");
            System.String sMode  = oRequestXML.SelectSingleNode("//mode").InnerText;
            //archive 여부
            System.Boolean bArchived = false;
            if (oRequestXML.SelectSingleNode("//archive") != null) bArchived = System.Convert.ToBoolean(oRequestXML.SelectSingleNode("//archive").InnerText);

            System.Decimal ifolderid = 0;//휴지통 폴더 id

            //사용자 정의 폴더이동 여부
            System.Boolean bFolderMove = false;
            if (oRequestXML.SelectSingleNode("//bfoldermove") != null) bFolderMove = System.Convert.ToBoolean(oRequestXML.SelectSingleNode("//bfoldermove").InnerText);
            System.String sFolderMove = "";
            if (bFolderMove)
            {
                sFolderMove = "folder";
            }
            else
            {
                DataPack INPUT = null;
                try
                {
                    INPUT = new DataPack();
                    INPUT.add("@userid", Session["user_code"].ToString());
                    INPUT.add("@foldermode", "X");

                    using (SqlDacBase SqlDbAgent = new SqlDacBase())
                    {
                        SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
                        ifolderid = System.Convert.ToDecimal(SqlDbAgent.ExecuteScalar(CommandType.StoredProcedure, "dbo.usp_wfform_setgarbagefolder", INPUT));
                    }
                }
                catch (System.Exception ex)
                {
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

            oDBMgr = new CfnDatabaseManager.WfDBManager();
            if (oItems.Count > 0)
            {
                System.String sWIID;
                foreach (System.Xml.XmlNode oItem in oItems)
                {
                    sWIID = oItem.Attributes["wiid"].Value;
                    //'oDBMgr.ChangeProperty("WfWorkitem", sWIID, "deletionDate", Now);
                    switch (sMode)
                    {
                        case "cancel":
                            if (bArchived)
                            {
                                ChangeState(sMode, oItem.Attributes["pfid"].Value, CfnEntityClasses.CfPerformerState.pfstCancelled.ToString(), "", sFolderMove);
                                if (!bFolderMove)
                                {
                                    ChangeGarbageFolder(bArchived,ifolderid, "performer", oItem.Attributes["pfid"].Value, "", oItem);
                                }
                            }
                            else
                            {
                                oDBMgr.ChangeProperty("WfPerformer", oItem.Attributes["pfid"].Value, "state", CfnEntityClasses.CfPerformerState.pfstCancelled);
                                if (bFolderMove)
                                {
                                    oDBMgr.ChangeProperty("WfPerformer", oItem.Attributes["pfid"].Value, "performerName", sFolderMove);
                                }
                                else //일반삭제일 경우 휴지통으로 넘길 것.
                                {
                                    ChangeGarbageFolder(bArchived, ifolderid, "performer", oItem.Attributes["pfid"].Value, "", oItem);
                                }
                            }
                            break;
                        case "delete":
                            //대결자가 삭제를 하는 경우 deputyid를 deputyname으로 넘김. 이후 이 값으로 사용
                            if (oItem.Attributes["ptid"].Value == oItem.Attributes["uid"].Value)
                            {
                                if (bArchived)
                                {
                                    ChangeState("", sWIID, "", "", sFolderMove);
                                    if (!bFolderMove)
                                    {
                                        ChangeGarbageFolder(bArchived, ifolderid, "workitem", sWIID, "", oItem);
                                    }
                                }
                                else
                                {
                                    oDBMgr.ChangeProperty("WfWorkitem", sWIID, "deletionDate", System.DateTime.Now);
                                    //folder 이동으로 삭제가 되는 
                                    if (bFolderMove)
                                    {
                                        oDBMgr.ChangeProperty("WfWorkitem", sWIID, "businessData2", "folder");
                                    }
                                    else //일반삭제일 경우 휴지통으로 넘길 것.
                                    {
                                        ChangeGarbageFolder(bArchived, ifolderid, "workitem", sWIID, "", oItem);
                                    }
                                }
                            }
                            else
                            {
                                if (bArchived)
                                {
                                    ChangeState("deputy", sWIID, "", oItem.Attributes["uid"].Value, sFolderMove);
                                    if (!bFolderMove)
                                    {
                                        ChangeGarbageFolder(bArchived, ifolderid, "workitem", sWIID, "D", oItem);
                                    }
                                }
                                else
                                {
                                    oDBMgr.ChangeProperty("WfWorkitem", sWIID, "deputyName", oItem.Attributes["uid"].Value);
                                    //folder 이동으로 삭제가 되는 
                                    if (bFolderMove)
                                    {
                                        oDBMgr.ChangeProperty("WfWorkitem", sWIID, "deputyId", "folder");
                                    }
                                    else //일반삭제일 경우 휴지통으로 넘길 것.
                                    {
                                        oDBMgr.ChangeProperty("WfWorkitem", sWIID, "deputyId", System.DateTime.Now);
                                        ChangeGarbageFolder(bArchived,ifolderid, "workitem", sWIID, "D", oItem);
                                    }

                                }
                            }
                            break;
                    }
                }
            }
            System.EnterpriseServices.ContextUtil.SetComplete();
            Response.Write(Resources.Approval.msg_138);
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
            Response.Write("</response>");
        }
    }

    /// <summary>
    /// 개인폴더(휴지통)에 데이터이동 처리
    /// </summary>
    /// <param name="bArchived">이관디비 사용여부</param>
    /// <param name="folderid">개인폴더 id</param>
    /// <param name="Wf_Mode">완료/반려/참조 구분</param>
    /// <param name="Key">link key(wiid)</param>
    /// <param name="Deputy_State">대결상태</param>
    /// <param name="eml">결재문서정보(양식명/제목/기안자명/기안부서명/문서링크정보)</param>
    private void ChangeGarbageFolder(bool bArchived, decimal folderid, string Wf_Mode, string Key, string Deputy_State, System.Xml.XmlNode eml)
    {
        DataPack INPUT = null;
        try
        {
            INPUT = new DataPack();

            INPUT.add("@mode", "INSERT");
            INPUT.add("@folderid", folderid);
            INPUT.add("@listid", 0);
            INPUT.add("@formname", eml.SelectSingleNode("formname").InnerText);
            INPUT.add("@subject", eml.SelectSingleNode("subject").InnerText);
            INPUT.add("@initiator_name", eml.SelectSingleNode("initiator_name").InnerText);
            INPUT.add("@initiator_unit_name", eml.SelectSingleNode("initiator_unit_name").InnerText);
            INPUT.add("@linkurl", eml.SelectSingleNode("linkurl").InnerText);

            //결재함일반삭제 추가 부분
            INPUT.add("@linkkey", Key);
            INPUT.add("@wf_mode", Wf_Mode);
            INPUT.add("@deputy_state", Deputy_State); 
            
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
                SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, "dbo.usp_wfform_setfolderlist", INPUT);
            }

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

    /// <summary>
    /// 이관디비 wf object 상태 변경
    /// </summary>
    /// <param name="sMode">완료/반려/참조함 구분</param>
    /// <param name="sKey">Key값 wiid</param>
    /// <param name="sState">변경 상태 값</param>
    /// <param name="sUserID">사용자 id(person_code)</param>
    /// <param name="sFolderMove">폴더이동여부</param>
    private void ChangeState(string sMode, string sKey, string sState, string sUserID, string sFolderMove)
    {
        DataPack INPUT = null;

        try
        {
            INPUT = new DataPack();

            INPUT.add("@MODE", sMode);
            INPUT.add("@KEY", sKey);
            INPUT.add("@STATE", sState);
            INPUT.add("@USERID", sUserID);
            INPUT.add("@FOLDERMOVE", sFolderMove);

            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ARCHIVE_ConnectionString").ToString();
                SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, "dbo.usp_wf_deletecompleted", INPUT);
            }
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
