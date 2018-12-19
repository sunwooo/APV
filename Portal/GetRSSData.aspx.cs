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
using System.Text;
using System.Xml;


/// <summary>
/// 전자결재 결재함 RSS Reader
/// 회람함/개인폴더/부서폴더는 대상 아님
/// </summary>
public partial class Approval_Portal_GetRSSData : System.Web.UI.Page
{
    public string strUserUrl = System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString();


    /// <summary>
    /// 파라미터 처리
    /// XML 구조 데이터 Response 로 출력
    /// 조건별 목록 조회 쿼리
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        string slocation = Request["location"];
        string uid = Request["uid"];
        string userguid = Request["userguid"];
        string sub_kind = string.Empty;
        string dept_id = string.Empty;
        string mode = slocation;

        if (uid.IndexOf('_') > -1)
        {
            sub_kind = uid.Substring(uid.LastIndexOf('_') + 1);
            dept_id = uid.Substring(0, uid.LastIndexOf('_'));
        }

        StringBuilder sbReturn = new StringBuilder();
        DataSet ds = new DataSet();
        string g_connectString = "INST_ConnectionString";

        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        try
        {
            if (userguid != Session["user_guid"].ToString())
            {
                throw new System.Exception("error");
            }
            else
            {
                sbReturn.Append("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n");
                sbReturn.Append("<rss version=\"2.0\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\">\n");
                sbReturn.Append("<channel>\n");

                //결재함 기본 정보
                switch (slocation)
                {
                    case "PREAPPROVAL":
                        sbReturn.Append("<title>").Append(Resources.Approval.lbl_doc_pre2).Append("</title>\n");
                        sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=&location=").Append(slocation).Append("]]></link>\n");
                        sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_pre2).Append("</description>\n");
                        break;
                    case "APPROVAL":
                        sbReturn.Append("<title>").Append(Resources.Approval.lbl_doc_approve2).Append("</title>\n");
                        sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=&location=").Append(slocation).Append("]]></link>\n");
                        sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_approve2).Append("</description>\n");
                        break;
                    case "PROCESS":
                        sbReturn.Append("<title>").Append(Resources.Approval.lbl_doc_process2).Append("</title>\n");
                        sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=&location=").Append(slocation).Append("]]></link>\n");
                        sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_process2).Append("</description>\n");
                        break;
                    case "COMPLETE":
                        g_connectString = "INST_ARCHIVE_ConnectionString";
                        sbReturn.Append("<title>").Append(Resources.Approval.lbl_doc_complete2).Append("</title>\n");
                        sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=&location=").Append(slocation).Append("]]></link>\n");
                        sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_complete2).Append("</description>\n");
                        break;
                    case "REJECT":
                        g_connectString = "INST_ARCHIVE_ConnectionString";
                        sbReturn.Append("<title>").Append(Resources.Approval.lbl_doc_reject2).Append("</title>\n");
                        sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=&location=").Append(slocation).Append("]]></link>\n");
                        sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_reject2).Append("</description>\n");
                        break;
                    case "CCINFO":
                        g_connectString = "INST_ARCHIVE_ConnectionString";
                        sbReturn.Append("<title>").Append(Resources.Approval.lbl_doc_reference2).Append("</title>\n");
                        sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=&location=").Append(slocation).Append("]]></link>\n");
                        sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_reference2).Append("</description>\n");
                        break;
                    case "TEMPSAVE":
                        sbReturn.Append("<title>").Append(Resources.Approval.lbl_composing).Append("</title>\n");
                        sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=&location=").Append(slocation).Append("]]></link>\n");
                        sbReturn.Append("<description>").Append(Resources.Approval.lbl_composing).Append("</description>\n");
                        break;
                    case "TCINFO":
                        sbReturn.Append("<title>").Append(Resources.Approval.btn_Circulate).Append("</title>\n");
                        sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=&location=").Append(slocation).Append("]]></link>\n");
                        sbReturn.Append("<description>").Append(Resources.Approval.btn_Circulate).Append("</description>\n");
                        break;
                    case "DEPART":
                        switch (sub_kind)
                        {
                            case "A":
                                g_connectString = "INST_ARCHIVE_ConnectionString";
                                sbReturn.Append("<title>").Append(Resources.Approval.lbl_doc_deptcomplet).Append("</title>\n");
                                sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=").Append(uid).Append("&location=").Append(slocation).Append("]]></link>\n");
                                sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_deptcomplet).Append("</description>\n");
                                break;
                            case "R":
                                sbReturn.Append("<title>").Append(Resources.Approval.lbl_doc_receive).Append("</title>\n");
                                sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=").Append(uid).Append("&location=").Append(slocation).Append("]]></link>\n");
                                sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_receive).Append("</description>\n");
                                break;
                            case "I":
                                g_connectString = "INST_ARCHIVE_ConnectionString";
                                sbReturn.Append("<title>").Append(Resources.Approval.lbl_doc_reference2).Append("</title>\n");
                                sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=").Append(uid).Append("&location=").Append(slocation).Append("]]></link>\n");
                                sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_reference2).Append("</description>\n");
                                break;
                            case "RC":
                                g_connectString = "INST_ARCHIVE_ConnectionString";
                                sbReturn.Append("<title>").Append(Resources.Approval.lbl_doc_receiveprocess).Append("</title>\n");
                                sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=").Append(uid).Append("&location=").Append(slocation).Append("]]></link>\n");
                                sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_receiveprocess).Append("</description>\n");
                                break;
                            case "D":
                                sbReturn.Append("<title>").Append(Resources.Approval.lbl_circulation_rec).Append("</title>\n");
                                sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=").Append(uid).Append("&location=").Append(slocation).Append("]]></link>\n");
                                sbReturn.Append("<description>").Append(Resources.Approval.lbl_circulation_rec).Append("</description>\n");
                                break;
                        }
                        break;
                    case "JOBFUNCTION":
                        switch (sub_kind)
                        {
                            case "APPROVAL":
                                sbReturn.Append("<title>").Append(Resources.Approval.lbl_chargedoc).Append("-").Append(Resources.Approval.lbl_doc_approve2).Append("</title>\n");
                                sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=&location=").Append(slocation).Append("]]></link>\n");
                                sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_approve2).Append("</description>\n");
                                break;
                            case "PROCESS":
                                sbReturn.Append("<title>").Append(Resources.Approval.lbl_chargedoc).Append("-").Append(Resources.Approval.lbl_doc_process2).Append("</title>\n");
                                sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=&location=").Append(slocation).Append("]]></link>\n");
                                sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_process2).Append("</description>\n");
                                break;
                            case "COMPLETE":
                                g_connectString = "INST_ARCHIVE_ConnectionString";
                                sbReturn.Append("<title>").Append(Resources.Approval.lbl_chargedoc).Append("-").Append(Resources.Approval.lbl_doc_complete2).Append("</title>\n");
                                sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=&location=").Append(slocation).Append("]]></link>\n");
                                sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_complete2).Append("</description>\n");
                                break;
                            case "REJECT":
                                g_connectString = "INST_ARCHIVE_ConnectionString";
                                sbReturn.Append("<title>").Append(Resources.Approval.lbl_chargedoc).Append("-").Append(Resources.Approval.lbl_doc_reject2).Append("</title>\n");
                                sbReturn.Append("<link><![CDATA[").Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString()).Append("Approval/default.aspx?uid=&location=").Append(slocation).Append("]]></link>\n");
                                sbReturn.Append("<description>").Append(Resources.Approval.lbl_doc_reject2).Append("</description>\n");
                                break;
                        }
                        break;
                }
                sbReturn.Append("<language>ko-KR</language>\n");

                DataPack INPUT = new DataPack();

                string szQuery = "dbo.usp_wf_worklistquery01";
                if (slocation == "DEPART")
                {
                    szQuery = "dbo.usp_wf_worklistdeptquery01";
                    INPUT.add("@PF_PERFORMER_ID", dept_id);
                    INPUT.add("@WI_STATE", "");
                    INPUT.add("@PI_STATE", "");
                    INPUT.add("@MODE", "");
                    INPUT.add("@PI_NAME", "");
                    INPUT.add("@PI_INITIATOR_NAME", "");
                    INPUT.add("@PI_ETC", "");
                    INPUT.add("@pagenum", "1");
                    INPUT.add("@page_size", "15");
                    INPUT.add("@query_size", "15");
                    INPUT.add("@GROUP_KIND", "");
                    INPUT.add("@TITLE", "");
                    INPUT.add("@order_field", "");
                    INPUT.add("@order_desc", "");
                    INPUT.add("@PI_FINISHED", "");
                    INPUT.add("@PF_SUB_KIND", sub_kind);
                }
                else if (slocation == "JOBFUNCTION")
                {
                    szQuery = "dbo.usp_wf_worklistquery01general_dynamic";
                    INPUT.add("@USER_ID", dept_id);
                    switch (sub_kind)
                    {
                        case "APPROVAL":
                            INPUT.add("@WI_STATE", "288");
                            INPUT.add("@PI_STATE", "288");
                            break;
                        case "PROCESS":
                            INPUT.add("@WI_STATE", "528");
                            INPUT.add("@PI_STATE", "288");
                            break;
                        case "COMPLETE":
                            INPUT.add("@WI_STATE", "528");
                            INPUT.add("@PI_STATE", "528");
                            break;
                        case "REJECT":
                            INPUT.add("@WI_STATE", "528");
                            INPUT.add("@PI_STATE", "528");
                            break;
                    }
                    INPUT.add("@MODE", slocation);
                    INPUT.add("@PI_NAME", "");
                    INPUT.add("@PI_INITIATOR_NAME", "");
                    INPUT.add("@PI_ETC", "");
                    INPUT.add("@pagenum", "1");
                    INPUT.add("@page_size", "15");
                    INPUT.add("@query_size", "15");
                    INPUT.add("@GROUP_KIND", "");
                    INPUT.add("@TITLE", "");
                    INPUT.add("@order_field", "");
                    INPUT.add("@order_desc", "");
                    INPUT.add("@PF_SUB_KIND", "T008");
                    INPUT.add("@PF_STATE", "1");

                }
                else if (slocation == "TCINFO")
                {
                    g_connectString = "FORM_DEF_ConnectionString";
                    szQuery = "dbo.usp_wfform_tonccquery01_dynamic";
                    INPUT.add("@USER_ID", uid);
                    INPUT.add("@DEPT_ID", "");
                    INPUT.add("@SUBJECT", "");
                    INPUT.add("@pagenum", "1");
                    INPUT.add("@page_size", "15");
                    INPUT.add("@query_size", "15");
                    INPUT.add("@GROUP_KIND", "");
                    INPUT.add("@TITLE", "");
                    INPUT.add("@order_field", "");
                    INPUT.add("@order_desc", "");
                }
                else
                {

                    INPUT.add("@USER_ID", uid);
                    INPUT.add("@WI_STATE", "");
                    INPUT.add("@PI_STATE", "");
                    INPUT.add("@MODE", slocation);
                    INPUT.add("@PI_NAME", "");
                    INPUT.add("@PI_INITIATOR_NAME", "");
                    INPUT.add("@PI_ETC", "");
                    INPUT.add("@pagenum", "1");
                    INPUT.add("@page_size", "15");
                    INPUT.add("@query_size", "15");
                    INPUT.add("@GROUP_KIND", "");
                    INPUT.add("@TITLE", "");
                    INPUT.add("@order_field", "");
                    INPUT.add("@order_desc", "");
                }


                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(g_connectString).ToString();
                    ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, szQuery, INPUT);
                }

                DataTable dtMessage = ds.Tables[1];

                for (int iIndex = 0; iIndex < dtMessage.Rows.Count; iIndex++)
                {
                    DataRow drMessage = dtMessage.Rows[iIndex];
                    string sContentLInk = string.Empty;
                    string sHeader = string.Empty;
                    if (slocation == "TCINFO")
                    {
                        System.Xml.XmlDocument oPIDC = new System.Xml.XmlDocument();
                        oPIDC.LoadXml(drMessage["LINK_URL"].ToString());
                        System.Xml.XmlNode oFNode = oPIDC.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");

                        sContentLInk = this.getContentsLink(drMessage["PROCESS_ID"].ToString(),
                                                 "",
                                                 drMessage["LINK_URL"].ToString(),
                                                 slocation,
                                                 string.Empty,
                                                 string.Empty,
                                                 string.Empty,
                                                 string.Empty);
                        sHeader = this.getContentsInfo(drMessage["PROCESS_ID"].ToString(), sContentLInk, drMessage["LINK_URL"].ToString(), string.Empty);

                        sbReturn.Append("<item>\n");
                        sbReturn.Append("<title>").Append(drMessage["SUBJECT"].ToString()).Append("</title>\n");
                        sbReturn.Append("<link><![CDATA[").Append(sContentLInk).Append("]]></link>\n");
                        sbReturn.Append("<description><![CDATA[").Append(sHeader).Append("]]></description>\n");
                        sbReturn.Append("<dc:creator>").Append(drMessage["SENDER_NAME"].ToString()).Append("</dc:creator>\n");
                        sbReturn.Append("<dc:date>").Append(drMessage["SEND_DATE"].ToString()).Append("</dc:date>\n");
                        sbReturn.Append("</item>\n");

                    }
                    else
                    {
                        sContentLInk = this.getContentsLink(drMessage["PI_ID"].ToString(),
                                                 drMessage["WI_ID"].ToString(),
                                                 drMessage["PI_DSCR"].ToString(),
                                                 slocation,
                                                 drMessage["PI_BUSINESS_STATE"].ToString(),
                                                 drMessage["PF_SUB_KIND"].ToString(),
                                                 drMessage["PF_ID"].ToString(),
                                                 drMessage["PF_PERFORMER_ID"].ToString());
                        sHeader = this.getContentsInfo(drMessage["PI_ID"].ToString(), sContentLInk, drMessage["PI_DSCR"].ToString(), drMessage["PI_BUSINESS_STATE"].ToString());

                        sbReturn.Append("<item>\n");
                        sbReturn.Append("<title>").Append(drMessage["PI_SUBJECT"].ToString()).Append("</title>\n");
                        sbReturn.Append("<link><![CDATA[").Append(sContentLInk).Append("]]></link>\n");
                        sbReturn.Append("<description><![CDATA[").Append(sHeader).Append("]]></description>\n");
                        sbReturn.Append("<dc:creator>").Append(drMessage["PI_INITIATOR_NAME"].ToString()).Append("</dc:creator>\n");
                        sbReturn.Append("<dc:date>").Append(drMessage["PI_STARTED"].ToString()).Append("</dc:date>\n");
                        sbReturn.Append("</item>\n");
                    }

                }

                sbReturn.Append("</channel>\n</rss>");

                Response.Write(sbReturn.ToString());
            }
        }
        catch (Exception ex)
        {
            Response.Write("<?xml version=\"1.0\" encoding=\"utf-8\"?><rss version=\"2.0\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\"></rss>" + ex.Message);
        }
        finally
        {
            ds.Dispose();
            ds = null;

        }
    }

    /// <summary>
    ///문서 link 가져오기 
    /// </summary>
    /// <param name="sPIID">process id</param>
    /// <param name="sWIID">workitem id</param>
    /// <param name="sPIDESC">결재문서연결문자열</param>
    /// <param name="sMODE">mode</param>
    /// <param name="sbusinessState">문서결재상태</param>
    /// <param name="sPFsubKind">행위자 구분</param>
    /// <param name="sPFid">pf id</param>
    /// <param name="sperfomerid">행위자 id</param>
    /// <returns></returns>
    public string getContentsLink(string sPIID, string sWIID, string sPIDESC, string sMODE, string sbusinessState, string sPFsubKind, string sPFid, string sperfomerid)
    {
        String sContentsLink = String.Empty;
        System.Text.StringBuilder sb = new StringBuilder();
        System.Xml.XmlDocument oPIDC = new System.Xml.XmlDocument();
        try
        {
            oPIDC.LoadXml(sPIDESC);
            System.Xml.XmlNode oFNode = oPIDC.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");

            sb.Append(strUserUrl);
            sb.Append("Approval/Forms/Form.aspx?");
            sb.Append("mode=").Append(sMODE);
            sb.Append("&piid=").Append(sPIID);
            sb.Append("&wiid=").Append(sWIID);
            sb.Append("&bstate=").Append(sbusinessState);
            sb.Append("&fmid=").Append(oFNode.Attributes["id"].Value);
            sb.Append("&fmpf=").Append(oFNode.Attributes["prefix"].Value);
            sb.Append("&fmrv=").Append(oFNode.Attributes["revision"].Value);
            sb.Append("&fiid=").Append(oFNode.Attributes["instanceid"].Value);
            sb.Append("&scid=").Append(oFNode.Attributes["schemaid"].Value);
            sb.Append("&pfsk=").Append(sPFsubKind);
            sb.Append("&pfid=").Append(sPFid);
            sb.Append("&ptid=").Append(sperfomerid);
            sb.Append("&secdoc=").Append(oFNode.Attributes["secure_doc"].Value);

            sContentsLink = sb.ToString();
        }
        catch (System.Exception ex)
        {
            throw ex;
        }
        finally
        {
            sb = null;
            oPIDC = null;
        }

        return sContentsLink;
    }

    /// <summary>
    /// RSS head 만들기
    /// </summary>
    /// <param name="sPIID">process id</param>
    /// <param name="sContentsLink">문서 link</param>
    /// <param name="sPIDESC">문서 설명</param>
    /// <param name="strBusinessState">문서결재상태</param>
    /// <returns></returns>
    public string getContentsInfo(string sPIID, string sContentsLink, string sPIDESC, string strBusinessState)
    {
        String sContents = string.Empty;

        System.Xml.XmlDocument oPIDC = new System.Xml.XmlDocument();
        oPIDC.LoadXml(sPIDESC);
        System.Xml.XmlNode oFNode = oPIDC.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");

        //schema info
        XmlElement oSchema;
        oSchema = pGetSchema(oFNode.Attributes["schemaid"].Value);

        //form info
        Hashtable oFormData;
        oFormData = pGetFormData(oFNode.Attributes["prefix"].Value, oFNode.Attributes["revision"].Value, oFNode.Attributes["instanceid"].Value);

        //결재선 가져오기
        string APVS = COVIFlowCom.Common.getApproveSteps(sPIID, oSchema, strBusinessState, Server.MachineName);
        System.Xml.XmlDocument oApvList = new XmlDocument();
        oApvList.LoadXml(APVS);
        System.Xml.XmlNode oApvRoot = oApvList.DocumentElement;

        //XSL 보내기 위한 XML 구성 시작
        StringBuilder sbMailBody = new StringBuilder();

        sbMailBody.Append("<MAIL>");
        sbMailBody.Append("<TITLE><![CDATA[").Append(Resources.Approval.lbl_approval).Append("]]></TITLE>");
        sbMailBody.Append("<CONTENT BOLD='YES'><![CDATA[[ Notice ]]]></CONTENT>");

        XmlNode oDivision = oApvList.DocumentElement.SelectSingleNode("division");
        int oCount = oApvList.DocumentElement.SelectNodes("division/step/ou/person").Count - 1;
        XmlNodeList nInitiatorNode = oApvList.DocumentElement.SelectNodes("division/step/ou/person/taskinfo");
        XmlNodeList pInitiatorNode = oApvList.DocumentElement.SelectNodes("division/step/ou/person");
        for (int i = oCount; i >= 0; i--)
        {
            String oKind = nInitiatorNode.Item(i).Attributes["kind"].Value;
            String nKind = "";
            switch (oKind)
            {
                case "authorize":
                    nKind = Resources.Approval.lbl_authorize; break;
                case "review":
                    nKind = Resources.Approval.lbl_review; break;
                case "normal":
                    nKind = Resources.Approval.lbl_approval; break;
                case "charge":
                    nKind = Resources.Approval.lbl_charge; break;
                case "substitute":
                    nKind = Resources.Approval.lbl_substitue; break;
                case "bypass":
                    nKind = Resources.Approval.lbl_bypass; break;
                case "consent":
                    nKind = Resources.Approval.lbl_consent; break;
            }

            String oStatus = nInitiatorNode.Item(i).Attributes["status"].Value;
            String nStatus = "";
            switch (oStatus)
            {
                case "authorize":
                    nStatus = Resources.Approval.lbl_Approved; break;//"승인"
                case "completed":
                    nStatus = Resources.Approval.lbl_Approved; break;//"승인"
                case "reviewed":
                    nStatus = Resources.Approval.lbl_Approved; break;//"승인"
                case "agreed":
                    nStatus = Resources.Approval.lbl_Approved; break;//"승인"
                case "rejected":
                    nStatus = Resources.Approval.lbl_Rejected; break;//"부결"
                case "bypass":
                    nStatus = Resources.Approval.lbl_review; break;//"후열"
                case "disagreed":
                    nStatus = Resources.Approval.lbl_disagree; break;//"거부"
                case "reserved":
                    nStatus = Resources.Approval.lbl_hold; break;//"보류"
            }
            String oOuname = pInitiatorNode.Item(i).Attributes["ouname"].Value;
            String oName = pInitiatorNode.Item(i).Attributes["name"].Value;
            String oTitle = pInitiatorNode.Item(i).Attributes["title"].Value;
            String[] sTitle = oTitle.Split(';');

            sbMailBody.Append("<APVLINE>");
            sbMailBody.Append("<KIND><![CDATA[").Append(nKind).Append("]]></KIND>");
            sbMailBody.Append("<STATUS><![CDATA[").Append(nStatus).Append("]]></STATUS>");
            sbMailBody.Append("<OUNAME><![CDATA[").Append(oOuname).Append("]]></OUNAME>");
            sbMailBody.Append("<NAME><![CDATA[").Append(oName).Append("]]></NAME>");
            sbMailBody.Append("<TITLE><![CDATA[").Append(sTitle[1]).Append("]]></TITLE>");
            sbMailBody.Append("</APVLINE>");

            //if (oCount > 0) oCount = oCount - 1;
        }

        String docsec = oFormData["DOC_LEVEL"].ToString();
        if (docsec == "3")
        {
            docsec = "보안문서";
        }
        else if (docsec == "2")
        {
            docsec = "일반문서";
        }
        else if (docsec == "2")
        {
            docsec = "기타문서";
        }

        String keepyear = oFormData["SAVE_TERM"].ToString();
        if (keepyear == "99")
        {
            keepyear = "영구";
        }
        else
        {
            keepyear = keepyear + "년";
        }
        String catname = oFormData["DOC_CLASS_NAME"].ToString();

        sbMailBody.Append("<HEADNAME><![CDATA[").Append(oFNode.Attributes["name"].Value).Append("]]></HEADNAME>");
        sbMailBody.Append("<SUBJECT><![CDATA[").Append(oFNode.Attributes["subject"].Value).Append("]]></SUBJECT>");
        sbMailBody.Append("<DOCSEC><![CDATA[").Append(docsec).Append("]]></DOCSEC>");
        sbMailBody.Append("<KEEPYEAR><![CDATA[").Append(keepyear).Append("]]></KEEPYEAR>");
        sbMailBody.Append("<CATNAME><![CDATA[").Append(catname).Append("]]></CATNAME>");
        //sbMailBody.Append("<URL><![CDATA[").Append(sContentsLink).Append("]]></URL></MAIL>");
        sbMailBody.Append("</MAIL>");

        //html 포맷 맞추기 
        sContents = this.pTransform(sbMailBody.ToString(), Server.MapPath("/COVIWeb/common/MailRSS4Approval.xsl"));
        sbMailBody = null;
        return sContents;
    }

    private static System.Xml.Xsl.XslCompiledTransform oXSLT0 = null;

    /// <summary>
    /// xml형태를 갖는 데이터를 xsl file을 이용하여 변환
    /// </summary>
    /// <param name="sXML">xml형태의 데이터</param>
    /// <param name="sXSLPath">xsl file path</param>
    /// <returns>String</returns>
    public string pTransform(string sXML, System.String sXSLPath)
    {
        System.IO.StringReader oSR = null;
        System.Xml.XPath.XPathDocument oXPathDoc = null;
        System.IO.StringWriter oSW = null;
        string sReturn = "";
        //        string smode = "";
        System.Xml.Xsl.XsltSettings XSLTsettings = new System.Xml.Xsl.XsltSettings();
        XSLTsettings.EnableScript = true;

        try
        {
            oSR = new System.IO.StringReader(sXML.ToString());
            oXPathDoc = new System.Xml.XPath.XPathDocument(oSR);
            oSW = new System.IO.StringWriter();

            if (oXSLT0 == null)
            {
                oXSLT0 = new System.Xml.Xsl.XslCompiledTransform();
                oXSLT0.Load(sXSLPath, XSLTsettings, null);
            }
            oXSLT0.Transform(oXPathDoc, null, oSW);

            sReturn = oSW.ToString();
        }
        catch (System.Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (oSR != null)
            {
                oSR.Close();
                oSR.Dispose();
                oSR = null;
            }
            if (oXPathDoc != null)
            {
                oXPathDoc = null;
            }
            if (oSW != null)
            {
                oSW.Close();
                oSW.Dispose();
                oSW = null;
            }
        }
        return sReturn;
    }

    /// <summary>
    /// 양식프로세스 정보 조회
    /// </summary>
    /// <param name="strSchemaID">양식프로세스 id</param>
    /// <returns></returns>
    private System.Xml.XmlElement pGetSchema(string strSchemaID)
    {
        //여기에 스키마 정보 조회        
        CfnFormManager.WfFormManager oFM = new CfnFormManager.WfFormManager();
        try
        {
            CfnFormManager.WfFormSchema oFS = (CfnFormManager.WfFormSchema)oFM.GetDefinitionEntity(strSchemaID, CfnFormManager.CfFormEntityKind.fekdFormSchema);

            System.Xml.XmlDocument oXML = new System.Xml.XmlDocument();
            oXML.LoadXml(oFS.Context);
            return oXML.DocumentElement;
        }
        catch (System.Exception ex)
        {
            COVIFlowCom.ErrResult.AlertMsg(Response, COVIFlowCom.ErrResult.ParseStackTrace(ex));
            throw new Exception(null, ex);
        }
        finally
        {
            oFM.Dispose();
            oFM = null;
        }
    }
    private System.Collections.Hashtable pGetFormData(string strFormPrefix, string strFormVersion, string strFormInstanceID)
    {
        Boolean bArchived = false;
        CfnFormManager.WfFormManager objMTS = new CfnFormManager.WfFormManager();
        System.Data.DataSet oDS = new DataSet();
        DataPack INPUT = new DataPack();
        DataPack INPUT2 = new DataPack();

        try
        {
            //String sArchiveDB = System.Web.Configuration.WebConfigurationManager.AppSettings["FORM_INST_ARCHIVE_ConnectionString"];
            String sArchiveDB = "FORM_INST_ConnectionString";
            System.Collections.Hashtable oFormFields = new System.Collections.Hashtable();

            String sTableName = "WF_FORM_INSTANCE_" + strFormPrefix + "__V" + strFormVersion;
            String szQuery = String.Format("EXEC sp_executesql N'SELECT * FROM {0} WITH (NOLOCK) WHERE FORM_INST_ID=@FIID',N'@FIID AS VARCHAR(50)','{1}'", sTableName, strFormInstanceID);

            try
            {
                if (bArchived)
                {
                    using (SqlDacBase SqlDbAgent = new SqlDacBase())
                    {
                        SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(sArchiveDB).ToString();
                        oDS = SqlDbAgent.ExecuteDataSet(CommandType.Text, szQuery, INPUT);
                    }

                    if (oDS != null && oDS.Tables[0].Rows.Count > 0)
                    {
                    }
                    else
                    {
                        oDS = objMTS.LookupData(CfnFormManager.CfDatabaseType.dbtpInstance, strFormPrefix, szQuery, "DataSet");
                    }
                }
                else
                {
                    oDS = objMTS.LookupData(CfnFormManager.CfDatabaseType.dbtpInstance, strFormPrefix, szQuery, "DataSet");
                    if (oDS != null && oDS.Tables[0].Rows.Count > 0)
                    {
                    }
                    else
                    {
                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(sArchiveDB).ToString();
                            oDS = SqlDbAgent.ExecuteDataSet(CommandType.Text, szQuery, INPUT);
                        }
                    }
                }
            }
            catch (System.Exception ex)
            {
                throw new System.Exception("getFormData()", ex);
            }
            finally
            {
                //code
            }


            foreach (System.Data.DataRow oDR in oDS.Tables[0].Rows)
            {
                foreach (System.Data.DataColumn oFormField in oDS.Tables[0].Columns)
                {
                    System.Object oValue = oDR[oFormField.ColumnName];
                    if (oValue == System.DBNull.Value)
                    {
                        oValue = null;
                    }
                    oFormFields.Add(System.Convert.ToString((oFormField.ColumnName)).ToUpper(), oValue);
                }
            }

            using (SqlDacBase SqlDbAgent2 = new SqlDacBase())
            {
                SqlDbAgent2.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
                INPUT2.add("@fmid", strFormInstanceID);
                oDS = SqlDbAgent2.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wfform_forminfo", INPUT2);
            }
            if (oDS != null && oDS.Tables[0].Rows.Count > 0)
            {
                foreach (System.Data.DataRow oDR in oDS.Tables[0].Rows)
                {
                    if (oDR["WORK_DESC"] != System.DBNull.Value)
                    {
                        oFormFields.Add("fmwkds", oDR["WORK_DESC"]);
                    }
                    else
                    {
                        oFormFields.Add("fmwkds", null);
                    }

                }
            }
            return oFormFields;
        }
        catch (System.Exception ex)
        {
            COVIFlowCom.ErrResult.AlertMsg(Response, COVIFlowCom.ErrResult.ParseStackTrace(ex));
            throw new Exception(null, ex);
        }
        finally
        {
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
            if (INPUT2 != null)
            {
                INPUT2.Dispose();
                INPUT2 = null;
            }
            if (objMTS != null) objMTS.Dispose();
        }
    }
}
