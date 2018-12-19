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
/// 문서대장 문서발번
/// 수기로 문서번호 발번시 사용
/// </summary>
public partial class COVIFlowNet_Forms_RegisterDocumentList : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
        System.Xml.XmlDocument oRequestXML;
        try
        {
            System.String sActionMode = Request.QueryString["actionmode"];
            oRequestXML =COVIFlowCom.Common.ParseRequestBytes(Request);

            if(sActionMode == "NEW")
            {
                System.String strIssueDocNO = "";
                strIssueDocNO = pRegisterDocList(oRequestXML);
                Response.Write("<docno>" + strIssueDocNO + "</docno>");
            }
            else if(sActionMode == "UPDATE")
            {
                pUpdate(oRequestXML);
            }
            else if(sActionMode == "DELETE")
            {
                pDelete(oRequestXML);
            }
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

    //문서번호생성 및 등록
    private string pRegisterDocList(System.Xml.XmlDocument oFormXMLDOM)
    {
        CfnDocumentManager.WfDocumentManager oDocMgr = null;
        
        System.String sIssueDocNo = "";
        try
        {
            oDocMgr = new CfnDocumentManager.WfDocumentManager();
            System.Xml.XmlElement elmRoot = oFormXMLDOM.DocumentElement;
            
            System.String sDocumentListType = COVIFlowCom.Common.GetProp(elmRoot, "doclisttype", false);
            System.String sEffectCmt = elmRoot.SelectSingleNode("ClientAppInfo").OuterXml;
            System.Int16 iDocumentListType = sDocumentListType == "" ? (Int16)1 : Int16.Parse(sDocumentListType);
          
            System.String sUnitCode;
            System.String sUnitAbbreviation;
            System.String sFiscalYear;

            System.String sCategoryNumber;

            System.String sDisplayNumberPrefix;
            System.DateTime dtComplete = DateTime.Now;

            sUnitCode = COVIFlowCom.Common.GetProp(elmRoot, "dpid_apv", true);
            sUnitAbbreviation = COVIFlowCom.Common.GetProp(elmRoot, "etnm", true); //'회사명
            sFiscalYear = dtComplete.Year.ToString();

            sCategoryNumber = "";
            sDisplayNumberPrefix = sUnitAbbreviation + " 제 " + string.Format("{0:00}", sFiscalYear.Substring(2)) + " - {0:0000}호";

            //System.String sConnectionName = (string)CfnConfiguration.WfConfiguration.GetValue("engine/documentmanager/@connectionname", true, true).ToString();
            //System.String sConnectionString = (string)CfnDatabaseUtility.WfDatabaseDirectory.GetConnectionString(sConnectionName);

            System.String sConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();

            Object oEfDate = COVIFlowCom.Common.GetProp(elmRoot, "efdate", false);            
            oEfDate = (oEfDate.ToString() == "" ? Convert.ToDateTime("") : Convert.ToDateTime(oEfDate));

            Object oApvDate = COVIFlowCom.Common.GetProp(elmRoot, "apvdate", false);
            oApvDate = (oApvDate.ToString() == "" ? Convert.ToDateTime("") : Convert.ToDateTime(oApvDate));

            if (iDocumentListType == 10)
            {
                sDisplayNumberPrefix = "CO-N" + string.Format("{0:00}", sFiscalYear.Substring(2)) + "-{0:000}";
                //sDisplayNumberPrefix = COVIFlowCom.Common.GetProp(elmRoot, "doc_no", false);
                sUnitCode = COVIFlowCom.Common.GetProp(elmRoot, "docdpid", false);
                sUnitAbbreviation = COVIFlowCom.Common.GetProp(elmRoot, "etnm", false);
            }
            if (iDocumentListType == 11)
            {
                sDisplayNumberPrefix = "CO-L" + string.Format("{0:00}", sFiscalYear.Substring(2)) + "-{0:000}";
                sUnitCode = COVIFlowCom.Common.GetProp(elmRoot, "docdpid", false);
                sUnitAbbreviation = COVIFlowCom.Common.GetProp(elmRoot, "etnm", false);
            }
            if (iDocumentListType == 12)
            {
                sDisplayNumberPrefix = "CO-P" + string.Format("{0:00}", sFiscalYear.Substring(2)) + "-{0:000}";
                sUnitCode = COVIFlowCom.Common.GetProp(elmRoot, "docdpid", false);
                sUnitAbbreviation = COVIFlowCom.Common.GetProp(elmRoot, "etnm", false);
            }        
            //2005.03.27 이후창 수정
            sIssueDocNo = oDocMgr.RegisterDocumentAndIssueDocumentNumber(sUnitCode,
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "docdpid", false)),
                                            sUnitAbbreviation,
                                            sFiscalYear, 
                                            sCategoryNumber, 
                                            iDocumentListType, 
                                            sDisplayNumberPrefix,
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "regcmt", false)),
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "usdn", false)),
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "usid", false)),
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "sdpdn", false)),
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "sdpid", false)),
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "rdpdn", false)),
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "rdpid", false)),
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "subject", false)),
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "chdn", false)),
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "chid", false)),
                                            oApvDate,
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "indn", false)),
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "inid", false)), 
                                            oEfDate,
                                            (string)pEvaluateNull(COVIFlowCom.Common.GetProp(elmRoot, "efmt", false)), 
                                            sEffectCmt, 
                                            sConnectionString);

            return sIssueDocNo;
        }
        catch(System.Exception Ex)
        {
            throw Ex;
        }
        finally
        {
            if(oDocMgr != null)
            {
                oDocMgr.Dispose();
                oDocMgr = null;
            }
        }
    }

    private Object pEvaluateNull(String sValue)
    {
        if(sValue == "") return null;
        else return sValue;
    }

    private void pUpdate(System.Xml.XmlDocument oFormXMLDOM)
    {
        System.String sConnectionName = (string)CfnConfiguration.WfConfiguration.GetValue("engine/documentmanager/@connectionname", true, true);
        System.String sConnectionString = (string)CfnDatabaseUtility.WfDatabaseDirectory.GetConnectionString(sConnectionName);
        System.Data.SqlClient.SqlConnection oGVConn = null;
        System.Data.SqlClient.SqlCommand oComm = null;

        try
        {
            //System.String sConnectionName = CfnConfiguration.WfConfiguration.GetValue("engine/documentmanager/@connectionname");
            //System.String sConnectionString = CfnDatabaseUtility.WfDatabaseDirectory.GetConnectionString(sConnectionName);

            System.Xml.XmlElement elmRoot = oFormXMLDOM.DocumentElement;
            System.String sEffectCmt = elmRoot.SelectSingleNode("ClientAppInfo").OuterXml;
            oComm = new System.Data.SqlClient.SqlCommand();
            oComm.CommandText = 
                "UPDATE WF_DOC_REG_LIST " +
                " SET DOCUMENT_SUBJECT=@DOCUMENT_SUBJECT, EFFECTUATION_COMMENT=@EFFECTUATION_COMMENT, " +
                " RECEIVED_BY_UNIT_NAME=@RECEIVED_BY_UNIT_NAME, REGISTRATION_COMMENT=@REGISTRATION_COMMENT " +
                " WHERE DOCUMENT_NUMBER=@DOCUMENT_NUMBER";

            oComm.Parameters.AddWithValue("@DOCUMENT_NUMBER", COVIFlowCom.Common.GetProp(elmRoot, "docno", false));
            oComm.Parameters.AddWithValue("@DOCUMENT_SUBJECT", COVIFlowCom.Common.GetProp(elmRoot, "subject", false));
            oComm.Parameters.AddWithValue("@EFFECTUATION_COMMENT", sEffectCmt);
            oComm.Parameters.AddWithValue("@RECEIVED_BY_UNIT_NAME", COVIFlowCom.Common.GetProp(elmRoot, "rdpdn", false));
            oComm.Parameters.AddWithValue("@REGISTRATION_COMMENT", COVIFlowCom.Common.GetProp(elmRoot, "regcmt", false));
            oGVConn = new System.Data.SqlClient.SqlConnection(sConnectionString);
            oGVConn.Open();
            oComm.Connection = oGVConn;

            oComm.ExecuteNonQuery();
        }
        catch(System.Exception Ex)
        {
            throw new System.Exception(null, Ex);
        }
        finally
        {
            if(oGVConn != null)
            {
                if(oGVConn.State != ConnectionState.Closed)
                {
                    oGVConn.Close();
                }
                oGVConn = null;
            }
            if(oComm != null)
            {
                oComm.Dispose();
                oComm = null;
            }
        }
    }

    private void pDelete(System.Xml.XmlDocument oFormXMLDOM)
    {
        System.String sConnectionName = (string)CfnConfiguration.WfConfiguration.GetValue("engine/documentmanager/@connectionname", true, true);
        System.String sConnectionString = (string)CfnDatabaseUtility.WfDatabaseDirectory.GetConnectionString(sConnectionName);
        System.Data.SqlClient.SqlConnection oGVConn = null;
        System.Data.SqlClient.SqlCommand oCommDRL = null;
        System.Data.SqlClient.SqlCommand oCommDN = null;

        try
        {
            oGVConn = new System.Data.SqlClient.SqlConnection(sConnectionString);
            oCommDRL = new System.Data.SqlClient.SqlCommand();
            oCommDN = new System.Data.SqlClient.SqlCommand();

            //System.String sConnectionName = CfnConfiguration.WfConfiguration.GetValue("engine/documentmanager/@connectionname");
            //System.String sConnectionString = CfnDatabaseUtility.WfDatabaseDirectory.GetConnectionString(sConnectionName);
                       
            System.Xml.XmlElement elmRoot = oFormXMLDOM.DocumentElement;

            oCommDRL.CommandText =
                "DELETE WF_DOC_REG_LIST " +
                " WHERE DOCUMENT_NUMBER=@DOCUMENT_NUMBER";

            oCommDRL.Parameters.AddWithValue("@DOCUMENT_NUMBER", COVIFlowCom.Common.GetProp(elmRoot, "docno", false));

            oGVConn.Open();
            oCommDRL.Connection = oGVConn;

            oCommDRL.ExecuteNonQuery();

            oCommDN.CommandText = 
                "DELETE WF_DOCUMENT_NUMBER " +
                " WHERE DISPLAYED_NUMBER=@DISPLAYED_NUMBER";
            oCommDN.Parameters.AddWithValue("@DISPLAYED_NUMBER", COVIFlowCom.Common.GetProp(elmRoot, "docno", false));

            oCommDN.Connection = oGVConn;

            oCommDN.ExecuteNonQuery();
        }
        catch(System.Exception Ex)
        {
            throw new System.Exception(null, Ex);
        }
        finally
        {
            if(oGVConn != null)
            {
                if(oGVConn.State != ConnectionState.Closed)
                {
                    oGVConn.Close();
                }
                oGVConn = null;
            }
            if(oCommDRL != null)
            {
                oCommDRL.Dispose();
                oCommDRL = null;
            }
            if(oCommDN != null)
            {
                oCommDN.Dispose();
                oCommDN = null;
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
            Response.Write("<error><![CDATA[" + Ex.Message + "]]></error>");
        }
    }
}
