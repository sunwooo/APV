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
using System.IO;
using COVIFlowCom;
using Covision.Framework;
using Covision.Framework.Data.Business;

public partial class COVIFlowNet_Comment_comment_add_dobal : PageBase
{
    public string strFormId, strUserId, strInsertDate, strKind, strMode, strUserNAme, strComment, strPiid;
    
    public CommentData objCommentDate; //코멘트를 나타내는 클래스 변수 선언
     
    protected void Page_Load(object sender, EventArgs e)
    {
        //CommentData 인스턴스 생성
        objCommentDate = new CommentData();

        //다국어 언어설정
        string culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        //strPiid = Request.QueryString["piid"].ToString();
        //strFormId = Request.QueryString["form_inst_id"].ToString();
        //strUserId = Request.QueryString["user_id"].ToString();
        //strUserNAme = Request.QueryString["user_name"].ToString();
        //strKind = Request.QueryString["kind"].ToString();
        strMode = Request.QueryString["mode"].ToString();

        objCommentDate.Piid = Request.QueryString["piid"].ToString();
        objCommentDate.FormId = Request.QueryString["form_inst_id"].ToString();
        objCommentDate.UserId = Request.QueryString["user_id"].ToString();
        objCommentDate.UserName = Request.QueryString["user_name"].ToString();
        objCommentDate.Kind = Request.QueryString["kind"].ToString();
        

        if (!Page.IsPostBack)
        {
            if (strMode != "COMPLETE")
            {
                Comment comData = new Comment();
                //string strComment = comData.GetComment(strFormId, strUserId);
                //this.txtComment.Text = strComment;
                if (strComment == "") this.btnDel.Visible = false;
                else this.btnDel.Visible = true;

                objCommentDate.Comment = comData.GetCommentDobal(strFormId, strUserId);
                this.txtComment.Text = objCommentDate.Comment;

                //(objCommentDate.Comment == "") ? this.btnDel.Visible = false : this.btnDel.Visible = true;

                if (objCommentDate.Comment == "")
                {
                    this.btnDel.Visible = false;
                }
                else
                {
                    this.btnDel.Visible = true;
                }
            }
            else
            {
                this.btnDel.Visible = false;
            }
        }

    }
    protected void BtnAdd_Click(object sender, EventArgs e)
    {
        Comment comData = new Comment();
        string strGubun;
        if (strMode == "COMPLETE") strGubun = "Y";
        else strGubun = "N";
        Boolean bResult = false;
        if ((this.txtComment.Text == "") && (strGubun == "N"))
        {
            bResult = comData.DeleteCommentData(strFormId, strUserId);
            if (bResult == true) Response.Write("<script language=jscript>alert('의견이 삭제 되었습니다..');self.close();</script>");
        }
        else
        {
            if (this.txtComment.Text != "")
            {
                
                bResult = comData.InsertCommentData(strFormId, strUserId, strUserNAme, strKind, strGubun, this.txtComment.Text, "");
                
                //의견 추가 시 메일 발송 추가 by sunny-2006-09
                if (strMode == "COMPLETE")
                {
                    //2006.10.23
                    bResult = comData.UpdateEsingMeta(strFormId);

                    CfnCoreEngine.WfAdministration objMTS = new CfnCoreEngine.WfAdministration();
                    String temp = "111";
                    try
                    {
                        CfnDatabaseUtility.WfEntityFilter[] aEFs ={
                            new CfnDatabaseUtility.WfEntityFilter ("piid",Convert.ToString(strPiid),CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual ,true),
                            new CfnDatabaseUtility.WfEntityFilter ("name",Convert.ToString("APPROVERCONTEXT"),CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true)
                        };
                        System.Collections.ArrayList oDDs = objMTS.GetEntity(typeof(CfnEntityClasses.WfDomainDataInstance), aEFs);
                        CfnEntityClasses.WfDomainDataInstance oDDI = (CfnEntityClasses.WfDomainDataInstance)oDDs[0];
                        System.Xml.XmlDocument oApvList = (System.Xml.XmlDocument)oDDI.value;
                        System.Xml.XmlNode oCharge = oApvList.DocumentElement.SelectSingleNode("division/step/ou/person[taskinfo/@kind='charge']");

                        CfnDatabaseUtility.WfEntityFilter[] aEFProcesss ={
                            new CfnDatabaseUtility.WfEntityFilter ("id",Convert.ToString(strPiid),CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual ,true)
                        };
                        oDDs = objMTS.GetEntity(typeof(CfnEntityClasses.WfProcessInstance), aEFProcesss);
                        CfnEntityClasses.WfProcessInstance PInstance = (CfnEntityClasses.WfProcessInstance)oDDs[0];

                        System.Xml.XmlDocument oXML = new System.Xml.XmlDocument();
                        temp = PInstance.description;
                        oXML.LoadXml(PInstance.description);
                        System.Xml.XmlNode oFNode = oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");

                        System.String sSubject = "[의견추가][" + oFNode.Attributes["name"].Value + "]" + oFNode.Attributes["subject"].Value + "(" + oCharge.Attributes["name"].Value + "/" + oCharge.SelectSingleNode("taskinfo").Attributes["datecompleted"].Value.Substring(0, 10) + ")";
                        //결재판(합의포함)
                        System.Xml.XmlNodeList oPrevPerson = oApvList.DocumentElement.SelectNodes("division/step/ou/person[taskinfo/@status='completed' or taskinfo/@status='rejected']");
                        //수신자,참조자 조회
                        DataSet oDS = new DataSet();
                        String sQuery = String.Format("EXEC sp_executesql N'SELECT [RECEIPT_ID] FROM [WF_CIRCULATION_RECEIPT] WITH (NOLOCK)  WHERE FORM_INST_ID =@FIID  AND	(STATE = 528 ) AND KIND IN (''0'',''1'') ', N'@FIID CHAR(34)', '{0}'", strFormId);
                        ////using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter("DbProvider", "FORM_DEF_ConnectionString", true))
                        //using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter(Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["DbProvider"].ToString(), Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["FORM_DEF_ConnectionString"].ToString(), false))
                        //{
                        //    System.Data.IDataParameter param = adapter.CreateParameter();
                        //    oDS = adapter.FillDataSet(sQuery);
                        //}
                        DataPack INPUT = new DataPack();
                        SqlDacBase SqlDbAgent = new SqlDacBase();
                        SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();

                        oDS = SqlDbAgent.ExecuteDataSet(CommandType.Text, sQuery, INPUT);
                        SqlDbAgent.Dispose();
                        int iView = 0;
                        if ((oDS == null) || (oDS.Tables.Count == 0 || oDS.Tables[0].Rows.Count == 0))
                        {
                        }
                        else { iView = oDS.Tables[0].Rows.Count; }
                        String[] aReceipt_id = new string[oPrevPerson.Count + iView];
                        int k = 0;
                        foreach (System.Xml.XmlNode oPerson in oPrevPerson)
                        {
                            aReceipt_id[k] = oPerson.Attributes["code"].Value;
                            k++;
                        }
                        if (iView > 0)
                        {
                            foreach (DataRow DR in oDS.Tables[0].Rows)
                            {
                                aReceipt_id[k] = DR["RECEIPT_ID"].ToString();
                                k++;
                            }
                        }
                        //개인발송
                        Common.SendMessage(
                            sSubject,
                            strUserId,
                            aReceipt_id,
                            CfnEngineInterfaces.IWfOrganization.OMEntityType.ettpPerson,
                            System.Net.Mail.MailPriority.Normal,
                            false,
                            this.txtComment.Text);

                    }
                    catch (System.Exception ex)
                    {
                        throw new System.Exception(temp, ex);
                    }
                    finally
                    {
                        objMTS.Dispose();
                        objMTS = null;
                    }
                }
                if (bResult == true) Response.Write("<script language=jscript>alert('저장하였습니다.');self.close();</script>");
                else Response.Write("<script language=jscript>alert('저장을 실패하였습니다.');</script>");
            }
            else
            {
                Response.Write("<script language=jscript>alert('의견을 입력하세요');</script>");
            }
        }

    }

    protected void BtnDel_Click(object sender, EventArgs e)
    {
        Comment comData = new Comment();
        Boolean bResult = false;
        bResult = comData.DeleteCommentData(strFormId, strUserId);
        if (bResult == true) Response.Write("<script language=jscript>alert('삭제하였습니다.');self.close();</script>");
        else Response.Write("<script language=jscript>alert('삭제를 실패하였습니다.');</script>");
    }
}

