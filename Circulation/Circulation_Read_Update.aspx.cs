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
/// 회람 수신 내역 처리
/// </summary>
public partial class Approval_Circulation_Circulation_Read_Update : System.Web.UI.Page
{
	public string culturecode = "ko-KR";

    /// <summary>
    /// 다국어설정
    /// 파라미터에 따른 회람 수신 내역 처리
    /// 개인수신인 경우 읽은 일자 update
    /// 부서수신인 경우 개인수신(읽음일자 포함) 생성
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
	protected void Page_Load(object sender, EventArgs e)
	{
		if (Session["user_language"] != null)
		{
			culturecode = Session["user_language"].ToString();
		}
		Page.UICulture = culturecode;
		Page.Culture = culturecode;

		Response.ContentType = "text/xml";
		Response.Expires = -1;
		Response.CacheControl = "no-cache";
		Response.Buffer = true;

		AccepData accData = new AccepData();
		System.Xml.XmlDocument oXML = null;
        System.Xml.XmlNode oItem = null;
		Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
		try
		{
            oXML = new System.Xml.XmlDocument();
			oXML = COVIFlowCom.Common.ParseRequestBytes(Request);
			oItem = oXML.SelectSingleNode("request");
            oXML = null;
			string strForm_inst_id = oItem.SelectSingleNode("fiid").InnerText;
			string strSend_id = oItem.SelectSingleNode("sendid").InnerText;
			string strType = oItem.SelectSingleNode("type").InnerText;
			string strReceipt_id = oItem.SelectSingleNode("receipt_id").InnerText;
			string strReceipt_name = oItem.SelectSingleNode("receipt_name").InnerText;
			string strReceipt_ou_id = oItem.SelectSingleNode("receipt_ou_id").InnerText;
			string strReceipt_ou_name = oItem.SelectSingleNode("receipt_ou_name").InnerText;
			string strReceipt_state = oItem.SelectSingleNode("receipt_state").InnerText;
			string strReceipt_date = oItem.SelectSingleNode("receipt_date").InnerText;
			string strRead_date = oItem.SelectSingleNode("read_date").InnerText;

			if ((strType == "P" || strType == "" || strType=="TCINFO" ) && strRead_date == "")
			{
                Boolean nResult = accData.UpdateReadData(strForm_inst_id, strReceipt_id);//, new Guid(strSend_id)
			}
			else if (strType == "DEPART" && strRead_date == "")
			{
                Boolean nResult = accData.InsertReadData(Guid.NewGuid(), strForm_inst_id, strReceipt_id, strReceipt_name,
                                                        strReceipt_ou_id, strReceipt_ou_name, strReceipt_state, strReceipt_date, "2");

			}
		}
		catch (System.Exception ex)
		{
			
			Response.Write("<error>" + Server.HtmlEncode(COVIFlowCom.ErrResult.ParseStackTrace(ex)) + "</error>");
		}
		finally
		{
			if (accData != null) accData = null; //20070619 이학승
            if (oXML != null) oXML = null;
            if (oItem != null) oItem = null;
			Response.Write("</response>");
		}

	}
}
