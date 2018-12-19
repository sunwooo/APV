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
using Covi;

using Covision.Framework;
using Covision.Framework.Data.Business;

public partial class COVIFlowNet_Forms_formlink : PageBase
{
    //'QueryString Items
    //'mode={0}
    //'loct={1}

    //'piid={2}
    //'pist={6}
    //'bstate={8}

    //'wiid={7}
    //'pfid={3}
    //'completedate={4}
    //'ptid={5}
    //'pfsk={17}

    //'fiid={13}
    //'fmid={9}
    //'fmnm={10}
    //'fmpf={11}
    //'fmrv={12}
    //'ftid={14}
    //'fitn={15}
    //'scid={16}
    //'secdoc={18}
    public System.Boolean pbArchived = false;
    public String psArchiveDB;
    public String sPIID;
    public String psUID;
    

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            psArchiveDB = "INST_ARCHIVE_ConnectionString";
            sPIID = Request.QueryString["piid"].ToUpper();
            psUID = Session["user_code"].ToString();
            
            String[] aParams =  new string[20];
            //aParams = pSetInfo();
            try
            {
                String sWorkitemListQuery = String.Empty;
                sWorkitemListQuery = String.Format("EXEC sp_executesql N'SELECT STATE AS PI_STATE, [PARENT_PROCESS_ID] AS PI_PPI_ID, [DSCR] AS PI_DSCR, [BUSINESS_DATA1] AS PI_BUSINESS_DATA1, [BUSINESS_DATA2] AS  PI_BUSINESS_DATA2 FROM [WF_PROCESS] WITH (NOLOCK) WHERE PROCESS_ID=@PI_ID ', N'@PI_ID CHAR(34)', '{0}'", sPIID);
                //sWorkitemListQuery = String.Format("EXEC sp_executesql N'SELECT TOP 1 PI_STATE, PI_INITIATOR_ID, PI_DSCR, PI_BUSINESS_STATE, WI_ID, PF_ID FROM WF_WORKITEM_LIST WHERE PI_ID=@PI_ID AND WI_DELETED IS NULL ORDER BY WI_CREATED ASC ', N'@PI_ID CHAR(34)', '{0}' ", sPIID);
                System.Data.DataSet oDS = new DataSet();
                if (!pbArchived)
                {
                    ////using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter("DbProvider", "INST_ConnectionString", true))
                    ////using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter("DbProvider", "ORG_ConnectionString", true))
                    //using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter(Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["DbProvider"].ToString(), Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["ORG_ConnectionString"].ToString(), false))
                    //{
                    //    oDS = adapter.FillDataSet(sWorkitemListQuery);
                    //}
                    DataPack INPUT = new DataPack();
                    SqlDacBase SqlDbAgent = new SqlDacBase();
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();

                    oDS = SqlDbAgent.ExecuteDataSet(CommandType.Text, sWorkitemListQuery, INPUT);
                    SqlDbAgent.Dispose();
                    if ((oDS == null) || (oDS.Tables.Count == 0 || oDS.Tables[0].Rows.Count == 0))
                    {
                        pbArchived = true;
                        throw new System.Exception("해당문서가 존재하지 않습니다.");
                    }
                }

                aParams[2] = sPIID;
                aParams[6] = pCheckDBNull2String(oDS.Tables[0].Rows[0]["PI_STATE"]);
                aParams[8] = pCheckDBNull2String(oDS.Tables[0].Rows[0]["PI_BUSINESS_STATE"]);

                ////pSetWIInfo(aParams, oDS);
                //pSetFIInfo(aParams, pCheckDBNull2String(oDS.Tables(0).Rows(0).Item("PI_DSCR")));

            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
            aParams[0] = Request.QueryString["mode"];
            aParams[1] = Request.QueryString["mode"];
            aParams[2] = Request.QueryString["piid"];
            aParams[3] = pCheckDBNull2String(Request.QueryString["pfid"]);
            aParams[4] = "0";
            aParams[5] = pCheckDBNull2String(Request.QueryString["ptid"]);
            //aParams[6] = "";
            aParams[7] = pCheckDBNull2String(Request.QueryString["wiid"]);
            //aParams[8] = pCheckDBNull2String(Request.QueryString["bstate"]);
            aParams[9] = pCheckDBNull2String(Request.QueryString["fmid"]);
            aParams[10] = pCheckDBNull2String(Request.QueryString["fmnm"]);
            aParams[11] = pCheckDBNull2String(Request.QueryString["fmpf"]);
            aParams[12] = pCheckDBNull2String(Request.QueryString["fmrv"]);
            aParams[13] = pCheckDBNull2String(Request.QueryString["fiid"]);
            aParams[14] = pCheckDBNull2String(Request.QueryString["ftid"]);
            aParams[15] = pCheckDBNull2String(Request.QueryString["fitn"]);
            aParams[16] = pCheckDBNull2String(Request.QueryString["scid"]);
            aParams[17] = pCheckDBNull2String(Request.QueryString["pfsk"]);
            aParams[18] = pCheckDBNull2String(Request.QueryString["secdoc"]);
            aParams[19] = pCheckDBNull2String(Request.QueryString["gloct"]);
            //회람자 읽은 표시 하기
            if (Request.QueryString["pfsk"] == "T006" && Request.QueryString["gloct"] == "TCINFO" && Request.QueryString["receipt_id"] != "")
            {
                AccepData accData = new AccepData();
                string strForm_inst_id = Request.QueryString["fiid"];
                string strSend_id = Request.QueryString["sendid"];
                string strType = Request.QueryString["type"];
                string strReceipt_id = Request.QueryString["receipt_id"];
                string strReceipt_name = Request.QueryString["receipt_name"];
                string strReceipt_ou_id = Request.QueryString["receipt_ou_id"];
                string strReceipt_ou_name = Request.QueryString["receipt_ou_name"];
                string strReceipt_state = "Y" ;
                System.Boolean iReadCount = false;                
                if (strType == "P" )
                {
                    iReadCount = accData.CheckReadData(strForm_inst_id, Session["user_code"].ToString());
                    if (iReadCount == true)
                    {
                        Boolean nResult = accData.UpdateReadData(strForm_inst_id, strReceipt_id);
                       // Boolean nResult = accData.UpdateReadData(strForm_inst_id, strSend_id, strReceipt_id);
                    }
                }
                else if (strType == "O")
                {
                    //기존 체크 데이터가 존재하는지 확인
                    System.Xml.XmlDocument oXML = new System.Xml.XmlDocument();
                    oXML = accData.SelectCirculationData(sPIID, strForm_inst_id);
                    iReadCount = accData.CheckReadData(strForm_inst_id, strSend_id, Session["user_code"].ToString());
                    if (iReadCount == true)
                    {
                        Boolean nResult = accData.InsertReadData(strSend_id, strForm_inst_id, Session["user_code"].ToString(), Session["user_name"].ToString(),
                                                                strReceipt_ou_id, strReceipt_ou_name, strReceipt_state, oXML.DocumentElement.SelectSingleNode("//Table/RECEIPT_DATE").InnerText, "2");
                    }
                }

            }

            Response.Redirect(String.Format("/COVINet/COVIFlowNet/Forms/Form.aspx?mode={0}&loct={1}&piid={2}&pfid={3}&completedate={4}&ptid={5}&pist={6}&wiid={7}&bstate={8}&fmid={9}&fmnm={10}&fmpf={11}&fmrv={12}&fiid={13}&ftid={14}&fitn={15}&scid={16}&pfsk={17}&secdoc={18}&gloct={19}", aParams), false);
        }
        catch (System.Exception ex)
        {
            pErrorMessage(ex.Message);
            
        }
    }
    //private String[] pSetInfo( )
    //{
    //    try
    //    {
    //        String sWorkitemListQuery = String.Empty;
    //        sWorkitemListQuery = String.Format("EXEC sp_executesql N'SELECT TOP 1 PI_STATE, PI_INITIATOR_ID, PI_DSCR, PI_BUSINESS_STATE, WI_ID, PF_ID FROM WF_WORKITEM_LIST WHERE PI_ID=@PI_ID AND WI_DELETED IS NULL ORDER BY WI_CREATED ASC ', N'@PI_ID CHAR(34)', '{0}' ", sPIID);
    //        System.Data.DataSet oDS = new DataSet();
    //        if (!pbArchived)
    //        {
    //            using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter("DbProvider", "INST_ConnectionString", true))
    //            {
    //                oDS = adapter.FillDataSet(sWorkitemListQuery);
    //            }
    //            if ((oDS == null) || (oDS.Tables.Count == 0 || oDS.Tables[0].Rows.Count == 0))
    //            {
    //                pbArchived = true;
    //                throw new System.Exception("해당문서가 존재하지 않습니다.");
    //            }
    //        }

    //        aParams[2] = sPIID;
    //        aParams[6] = pCheckDBNull2String(oDS.Tables[0].Rows[0]["PI_STATE"]);
    //        aParams[8] = pCheckDBNull2String(oDS.Tables[0].Rows[0]["PI_BUSINESS_STATE"]);

    //        //pSetWIInfo(aParams, oDS);
    //        //pSetFIInfo(aParams, pCheckDBNull2String(oDS.Tables(0).Rows(0).Item("PI_DSCR")));

    //    }
    //    catch (System.Exception ex)
    //    {
    //        throw new System.Exception("해당 문서가 존재하지 않습니다.");
    //    }
    //}
    private void pErrorMessage(string src)
    {
        Response.Write("<script language=jscript>alert(\"" + COVIFlowCom.ErrResult.ReplaceScriptMsg(src) + "\"); window.close();</script>");
    }
    private string pCheckDBNull2String(object p)
    {
        if (p == System.DBNull.Value)
        {
            return "";
        }
        else
        {
            return Convert.ToString(p);
        }
    } 
}
