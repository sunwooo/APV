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

using Covision.Framework;
using Covision.Framework.Data.Business;

/// <summary>
/// 합의부서(routtype : assist- 반려권한 있는 합의) 삭제 처리
/// workitem이 생성되지 않은 합의부서의 경우 결재선 삭제 및 performer table에서 삭제
/// workitem이 생성된 합의부서의 경우 performer 변경 후 강제 완료 처리
/// </summary>
public partial class Admin_InstMgr_DeleteAssistOUs : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    /// <summary>
    /// 다국어 설정
    /// 순차/병렬처리에 따른 데이터 조정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.AddHeader("pragma", "no-cache");
        Response.AddHeader("cache-control", "private");
        Response.ContentType = "text/xml";
        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");

        StringBuilder sb = null;
        DataSet ds = null;
        DataPack INPUT = null;
        SqlDacBase SqlDbAgent = null;

        CfnCoreEngine.WfWorkitemManager oWIMgr = null;
        CfnCoreEngine.WfAdministration oAdmin = null;
        try
        {
            //다국어 언어설정
            if (Session["user_language"] != null)
            {
                strLangID = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
            }
            string culturecode = strLangID;	//"ko-KR"; "en-US"; "ja-JP";
            Page.UICulture = culturecode;
            Page.Culture = culturecode;
            INPUT = new DataPack();
            

            oWIMgr = new CfnCoreEngine.WfWorkitemManager();
            oAdmin = new CfnCoreEngine.WfAdministration();

            sb = new StringBuilder();
            ds = new DataSet();

            System.Xml.XmlDocument oRequestXML = COVIFlowCom.Common.ParseRequestBytes(Request);
            System.Xml.XmlNode elmRoot = oRequestXML.DocumentElement;

            System.Xml.XmlNode elmApv = elmRoot.SelectSingleNode("apvlist");
            //할당방식
            System.Xml.XmlNode oStep = elmApv.SelectSingleNode("steps/division[taskinfo/@status='pending' or taskinfo/@status='inactive']/step[(@unittype='ou') and (@routetype='assist') and (taskinfo/@status='pending' or taskinfo/@status='inactive')]");
            String sAllotType = oStep.Attributes["allottype"].Value;
            
            System.Xml.XmlNodeList elmList = elmRoot.SelectNodes("items/item");
            System.Collections.Specialized.NameValueCollection oWLRDIs = new System.Collections.Specialized.NameValueCollection();
            System.String sWIID;
            System.String sPFID;

            if (sAllotType == "serial")
            {
                #region 순차합의처리
                //미할당 부서부터 삭제처리
                //이후 할당부서 처리
                //결재선 변경 필요
                CfnDatabaseUtility.WfEntityFilter[] aEFs = {
                    new CfnDatabaseUtility.WfEntityFilter("piid",  elmRoot.SelectSingleNode("piid").InnerText, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true),
                    new CfnDatabaseUtility.WfEntityFilter("name", "APPROVERCONTEXT", CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true)
                };

                System.Collections.ArrayList oDDs = oAdmin.GetEntity(typeof(CfnEntityClasses.WfDomainDataInstance), aEFs);
                CfnEntityClasses.WfDomainDataInstance oDDI = (CfnEntityClasses.WfDomainDataInstance)oDDs[0];

                System.Xml.XmlDocument oApvList = (System.Xml.XmlDocument)oDDI.value;//최종결재선
                System.Xml.XmlNode oApvRoot = oApvList.DocumentElement;
                System.Xml.XmlNode oStepUpdate = oApvRoot.SelectSingleNode("division[taskinfo/@status='pending']/step[(@unittype='ou') and (@routetype='assist') and taskinfo/@status='pending']");
                System.Xml.XmlNode oOUUpdate;
                Boolean bChange = false;
                foreach (System.Xml.XmlNode oNode in elmList)
                {
                    //순차합의의 경우 performer가 순차별로 생성되어 있음. 해당 데이터 삭제 필요
                    if (oNode.Attributes["piid"].Value == string.Empty || oNode.Attributes["piid"].Value == "null" )
                    {
                        INPUT.Clear();
                        INPUT.add("@PROCESS_ID", elmRoot.SelectSingleNode("piid").InnerText);
                        INPUT.add("@OU_CODE", oNode.Attributes["code"].Value);
                        int oReturn = -1;
                        using (SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                            oReturn = SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, "dbo.usp_wf_delete_AssistOU", INPUT);

                            if (oReturn > -1)
                            {
                                oOUUpdate = oStepUpdate.SelectSingleNode("ou[@code='" + oNode.Attributes["code"].Value + "']");
                                oStepUpdate.RemoveChild(oOUUpdate);
                                bChange = true;
                            }
                        }
                    }
                }
                if (bChange)
                {
                    oDDI.value = oApvList.Clone();

                    System.Collections.ArrayList oData = new System.Collections.ArrayList();
                    oData.Add(oDDI);
                    oAdmin.UpdateData(typeof(CfnEntityClasses.WfDomainDataHistory), oData, "CoviflowNET");
                }
                foreach (System.Xml.XmlNode oNode in elmList)
                {
                    //순차합의의 경우 performer가 순차별로 생성되어 있음. 해당 데이터 삭제 필요
                    if (oNode.Attributes["piid"].Value == string.Empty || oNode.Attributes["piid"].Value == "null")
                    {
                    }
                    else
                    {
                        INPUT.Clear();
                        INPUT.add("@PROCESS_ID", oNode.Attributes["piid"].Value);
                        //삭제대상 부서 상태 조회
                        using (SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wf_getPendingAssistOUs", INPUT);
                        }
                        //삭제처리 요청
                        System.Data.DataRowCollection colDR = ds.Tables[0].Rows;
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            foreach (DataRow DR in colDR)
                            {
                                //강제 합의 결재선이 없음
                                sWIID = DR["WI_ID"].ToString();
                                sPFID = DR["PF_ID"].ToString();
                                oWIMgr.RequestComplete(sWIID, sPFID, oWLRDIs, null, string.Empty, "BATCH_DELETE", string.Empty, string.Empty,null);
                            }
                        }
                    }
                }
                #endregion
            }
            else
            {
                #region 병렬합의처리
                foreach (System.Xml.XmlNode oNode in elmList)
                {
                    INPUT.Clear();
                    INPUT.add("@PROCESS_ID", oNode.Attributes["piid"].Value);
                    //삭제대상 부서 상태 조회
                    using (SqlDbAgent = new SqlDacBase())
                    {
                        SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                        ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wf_getPendingAssistOUs", INPUT);
                    }
                    //삭제처리 요청
                    System.Data.DataRowCollection colDR = ds.Tables[0].Rows;
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow DR in colDR)
                        {
                            //강제 합의 결재선이 없음
                            sWIID = DR["WI_ID"].ToString();
                            sPFID = DR["PF_ID"].ToString();
                            oWIMgr.RequestComplete(sWIID, sPFID, oWLRDIs, null, string.Empty, "BATCH_DELETE", string.Empty, string.Empty,null);
                        }
                    }
                }
                #endregion
            }

        }
        catch (System.Exception ex)
        {
            Response.Write("<error>" + Server.HtmlEncode(COVIFlowCom.ErrResult.ParseStackTrace(ex)) + "</error>");
        }
        finally
        {
            if (sb != null)
            {
                sb = null;
            }
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
            if (oWIMgr != null)
            {
                oWIMgr.Dispose();
                oWIMgr = null;
            }
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
            if (oAdmin != null)
            {
                oAdmin.Dispose();
                oAdmin = null;
            }

            Response.Write("</response>");
        }
    }
}
