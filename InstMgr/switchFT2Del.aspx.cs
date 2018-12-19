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

/// <summary>
/// 결재문서 임시저장 문서 삭제처리
/// 임시저장 결재선도 함께 삭제
/// </summary>
public partial class COVIFlowNet_Admin_InstMgr_switchFT2Del : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    /// <summary>
    /// 다국어 설정
    /// 관련 회람데이터 삭제
    /// 관련 임시저장 결재선 데이터 삭제처리
    /// 관련 임시저장 양식 내역 삭제처리
    /// 임시저장 목록 삭제처리
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
        
        CfnFormManager.WfFormManager oFMMgr = null;

        //결재선 임시저장 관련
        CfnCoreEngine.WfAdministration oDBMgr = null;
        
        try
        {
            //code
            oFMMgr = new CfnFormManager.WfFormManager();
            System.Xml.XmlDocument oRequestXML  = COVIFlowCom.Common.ParseRequestBytes(Request);
            System.Xml.XmlNodeList oItems = oRequestXML.SelectNodes("//item");
            if( oItems.Count > 0 ){
                foreach(System.Xml.XmlNode oItem in oItems){
                    //회람함에서 삭제시 바로 삭제
                    if (Request.QueryString["TCINFO"] == "TCINFO")
                    {
                        System.Data.SqlClient.SqlCommand oCommDRE = new System.Data.SqlClient.SqlCommand(
                           " DELETE FROM WF_CIRCULATION_RECEIPT  " +
                           " WHERE SEND_ID='" + oItem.Attributes["sendid"].Value + "' AND RECEIPT_ID='" + oItem.Attributes["receipt_id"].Value + "'");

                        oFMMgr.ExecuteNonQuery(CfnFormManager.CfDatabaseType.dbtpDefinition, null, oCommDRE);
                    }
                    else{
                        //양식이 삭제되었을 수도 있어 exception 제거
                       System.Data.SqlClient.SqlCommand oCommFI = new System.Data.SqlClient.SqlCommand(
                            " IF EXISTS(SELECT  * FROM COVI_FLOW_FORM_INST.sys.objects WHERE name=\'" + oItem.Attributes["fitn"].Value +"%\') BEGIN DELETE FROM " + oItem.Attributes["fitn"].Value +
                            " WHERE FORM_INST_ID='" + oItem.Attributes["fiid"].Value + "' END ");

                        oFMMgr.ExecuteNonQuery(CfnFormManager.CfDatabaseType.dbtpInstance, oItem.Attributes["fmpf"].Value, oCommFI);

                        System.Data.SqlClient.SqlCommand oCommFT = new System.Data.SqlClient.SqlCommand(
                            " DELETE FROM WF_FORMS_TEMP_INST " +
                            " WHERE FORM_TEMP_INST_ID='" + oItem.Attributes["id"].Value + "'");

                        oFMMgr.ExecuteNonQuery(CfnFormManager.CfDatabaseType.dbtpDefinition, null, oCommFT);

                        //임시저장 시 회람데이터 삭제 방지
                        //if (oItem.Attributes["fiid_spare"] != null)
                        //{
                        //    //수신/참조/회람
                        //    System.Data.SqlClient.SqlCommand oCommRE = new System.Data.SqlClient.SqlCommand(
                        //   " UPDATE WF_CIRCULATION_RECEIPT  set FORM_INST_ID = '" + oItem.Attributes["fiid_spare"].Value + "'" +
                        //   " WHERE FORM_INST_ID='" + oItem.Attributes["fiid"].Value + "'");

                        //    oFMMgr.ExecuteNonQuery(CfnFormManager.CfDatabaseType.dbtpDefinition, null, oCommRE);

                        //    //수신/참조/회람
                        //    System.Data.SqlClient.SqlCommand oCommSE = new System.Data.SqlClient.SqlCommand(
                        //   " UPDATE WF_CIRCULATION_SEND  set FORM_INST_ID = '" + oItem.Attributes["fiid_spare"].Value + "'" +
                        //   " WHERE FORM_INST_ID='" + oItem.Attributes["fiid"].Value + "'");

                        //    oFMMgr.ExecuteNonQuery(CfnFormManager.CfDatabaseType.dbtpDefinition, null, oCommSE);

                        //    //의견
                        //    System.Data.SqlClient.SqlCommand oCommCO = new System.Data.SqlClient.SqlCommand(
                        //   " UPDATE COVI_FLOW_INST.dbo.WF_COMMENT  set FORM_INST_ID = '" + oItem.Attributes["fiid_spare"].Value + "'" +
                        //   " WHERE FORM_INST_ID='" + oItem.Attributes["fiid"].Value + "'");

                        //    oFMMgr.ExecuteNonQuery(CfnFormManager.CfDatabaseType.dbtpDefinition, null, oCommCO);

                        //}
                        //else
                        //{
                        //    //수신/참조/회람
                        //    System.Data.SqlClient.SqlCommand oCommRE = new System.Data.SqlClient.SqlCommand(
                        //   " DELETE WF_CIRCULATION_RECEIPT WHERE FORM_INST_ID='" + oItem.Attributes["fiid"].Value + "'");

                        //    oFMMgr.ExecuteNonQuery(CfnFormManager.CfDatabaseType.dbtpDefinition, null, oCommRE);

                        //    //수신/참조/회람
                        //    System.Data.SqlClient.SqlCommand oCommSE = new System.Data.SqlClient.SqlCommand(
                        //   " DELETE WF_CIRCULATION_SEND  WHERE FORM_INST_ID='" + oItem.Attributes["fiid"].Value + "'");

                        //    oFMMgr.ExecuteNonQuery(CfnFormManager.CfDatabaseType.dbtpDefinition, null, oCommSE);

                        //    //의견
                        //    System.Data.SqlClient.SqlCommand oCommCO = new System.Data.SqlClient.SqlCommand(
                        //   " DELETE COVI_FLOW_INST.dbo.WF_COMMENT  WHERE FORM_INST_ID='" + oItem.Attributes["fiid"].Value + "'");

                        //    oFMMgr.ExecuteNonQuery(CfnFormManager.CfDatabaseType.dbtpDefinition, null, oCommCO);

                        //}
                    

                        CfnDatabaseUtility.WfEntityFilter[] aFilters ={ new CfnDatabaseUtility.WfEntityFilter("id", oItem.Attributes["id"].Value, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true) };
                        oDBMgr = new CfnCoreEngine.WfAdministration();
                        oDBMgr.DeleteEntity("WfPrivateDomainData", aFilters);
                    }
                }//foreach
            }//if

            Response.Write(Resources.Approval.msg_022);
            System.EnterpriseServices.ContextUtil.SetComplete();
        }
        catch (System.Exception ex)
        {
//            logger.SendMessage(new Covi.Message.CoviMessage(ex));
            System.EnterpriseServices.ContextUtil.SetAbort();
            Response.Write("<error>" + Server.HtmlEncode(COVIFlowCom.ErrResult.ParseStackTrace(ex)) + "</error>");
        }
        finally
        {
            //code
            if (oFMMgr != null)
            {
                oFMMgr.Dispose();
                oFMMgr = null;
            }
            if (oDBMgr != null)
            {
                oDBMgr.Dispose();
                oDBMgr = null;
            }
            Response.Write("</response>");
        }
    }
}
