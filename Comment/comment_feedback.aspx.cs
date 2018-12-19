using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;

using System.IO;
using COVIFlowCom;
using Covision.Framework;
using Covision.Framework.Data.Business;

/// <summary>
/// 의견추가 페이지
/// </summary>
public partial class Approval_Comment_comment_feedback : PageBase
{
    public string strFormId, strUserId, strInsertDate, strKind, strMode, strUserNAme, strComment, strPiid;

    protected void Page_Load(object sender, EventArgs e)
    {
        //다국어 언어설정
        string culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
        Title = "Feedback " + Resources.Approval.lbl_comment_write;

        strPiid = Request.QueryString["piid"].ToString();
        strFormId = Request.QueryString["form_inst_id"].ToString();
        strUserId = Request.QueryString["user_id"].ToString();
        strUserNAme = Request.QueryString["user_name"].ToString();
        strKind = Request.QueryString["kind"].ToString();
        strMode = Request.QueryString["mode"].ToString();

        btnAdd.Text = "<span>" + Resources.Approval.btn_confirm_commnet + "</span>";

    }

    /// <summary>
    /// 의견추가 버튼
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void BtnAdd_Click(object sender, EventArgs e)
    {
        Comment comData = new Comment();
        string strGubun = "F";
        Boolean bResult = false;
        DataPack INPUT = null;
        try
        {
            if ((this.txtComment.Text == "") && (strGubun == "N"))
            {
            }
            else
            {
                if (this.txtComment.Text != "")
                {

                    bResult = comData.InsertCommentData(strFormId, strUserId, strUserNAme + "@" + Session["user_dept_name_lng"].ToString(), strKind, "F", this.txtComment.Text, "");

                    if (bResult)
                    {
                        INPUT = new DataPack();
                        INPUT.add("@piid", strPiid);
                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ARCHIVE_ConnectionString").ToString();
                            SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, "dbo.usp_wf_setfeedbackstate", INPUT);
                        }
                        INPUT.Dispose();
                        INPUT = null;
                    }
                    //의견 추가 시 메일 발송 추가 by sunny-2006-09
                    if (strMode == "COMPLETE")
                    {

                        String temp = "111";
                        System.Xml.XmlDocument oXML = null;
                        System.Xml.XmlNode oFNode = null;
                        DataSet oDS = null;
                        DataRow oDR = null;
                        string strApvSteps = string.Empty;
                        try
                        {
                            INPUT = new DataPack();
                            INPUT.add("@PIID", strPiid);
                            using (SqlDacBase SqlDbAgent = new SqlDacBase())
                            {
                                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ARCHIVE_ConnectionString").ToString();
                                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wf_getdomaindata", INPUT);
                            }
                            if (oDS != null && oDS.Tables[0].Rows.Count > 0)
                            {
                                oDR = oDS.Tables[0].Rows[0];
                                strApvSteps = Convert.ToString(oDR[0]);
                            }
                            System.Xml.XmlDocument oApvList = new System.Xml.XmlDocument();
                            oApvList.LoadXml(strApvSteps);
                            System.Xml.XmlNode oCharge = oApvList.DocumentElement.SelectSingleNode("division[@divisiontype='send']/step/ou/person[taskinfo/@kind='charge']");

                            INPUT.Dispose();
                            INPUT = null;

                            INPUT = new DataPack();
                            INPUT.add("@PI_ID", strPiid);
                            using (SqlDacBase SqlDbAgent = new SqlDacBase())
                            {
                                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ARCHIVE_ConnectionString").ToString();
                                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wf_getprocessinstance", INPUT);
                            }
                            oXML = new System.Xml.XmlDocument();
                            temp = oDS.Tables[0].Rows[0]["PI_DSCR"].ToString();
                            oXML.LoadXml(temp);
                            oFNode = oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");

                            System.String sSubject = "[Feedback][" + oFNode.Attributes["name"].Value + "]" + oFNode.Attributes["subject"].Value;// +"(" + oCharge.Attributes["name"].Value + "/" + oCharge.SelectSingleNode("taskinfo").Attributes["datecompleted"].Value.Substring(0, 10) + ")";
                            oFNode = null;
                            //결재판(합의포함)
                            System.Xml.XmlNodeList oPrevPerson = oApvList.DocumentElement.SelectNodes("division/step/ou/person[taskinfo/@status!='inactive' ]");
                            String[] aReceipt_id = new string[oPrevPerson.Count - 1];
                            int k = 0;
                            int kk = 0;
                            foreach (System.Xml.XmlNode oPerson in oPrevPerson)
                            {
                                if (kk > 0)
                                {
                                    aReceipt_id[k] = oPerson.Attributes["code"].Value;
                                    k++;
                                }
                                kk++;
                            }
                            //개인발송
                            try
                            {
                                Common.SendMessage(
                                    sSubject,
                                    strUserId,
                                    aReceipt_id,
                                    CfnEngineInterfaces.IWfOrganization.OMEntityType.ettpPerson,
                                    System.Net.Mail.MailPriority.Normal,
                                    false,
                                    this.txtComment.Text);
                            }
                            catch (System.Exception ex1)
                            {
                            }

                        }
                        catch (System.Exception ex)
                        {
                            //throw ex;
                        }
                        finally
                        {
                            if (oXML != null) oXML = null;
                            if (oFNode != null) oFNode = null;
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
                    if (bResult == true) Response.Write("<script language=jscript>alert('" + Resources.Approval.msg_117 + "');self.close();</script>");
                    else Response.Write("<script language=jscript>alert('" + Resources.Approval.msg_073 + "');</script>");
                }
                else
                {
                    Response.Write("<script language=jscript>alert('" + Resources.Approval.msg_161 + "');</script>");
                }
            }
        }
        catch (System.Exception ex)
        {
        }
        finally
        {
            if (INPUT != null) { INPUT.Dispose(); INPUT = null; }
        }

    }
}