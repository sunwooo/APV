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
using System.Xml.Xsl;

public partial class Doclist_ReceiptListExcel : PageBase
{
    public string strListName, strExcelList;
	public string sReply = String.Empty;
	public string strLangIndex = "0";

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
			//다국어 언어설정
			string culturecode = ConfigurationManager.AppSettings["LanguageType"];
			if (Session["user_language"] != null)
			{
				culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
			}
			Page.UICulture = culturecode;
			Page.Culture = culturecode;
			strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

            Response.ContentType = "application/vnd.ms-excel";
            Response.AddHeader("Content-Disposition", "attachment;filename=ListItem.xls");

            string encoding = Request.ContentEncoding.HeaderName;
            Response.Write("<meta http-equiv='Content-Type' content='text/html; charset=" + encoding + "'>");
            Response.Buffer = true;

            MakeExcel();
        }
        catch (Exception ex)
        {
            COVIFlowCom.ErrResult.HandleException(Response, ex);
        }

    }

    public void MakeExcel()
    {
        string sProcessID;
        string sFiid  = String.Empty;
        DataSet ds = null;
        DataPack INPUT = null;
        try
        {
            if (Request.QueryString["ppiid"] != null)
            {
                sProcessID = Request.QueryString["ppiid"];
            }
            else
            {
                sProcessID = "";
            }

            if (Request.QueryString["reply"] != null)
                sReply = Request.QueryString["reply"];


            if (Request.QueryString["fiid"] != null)
                sFiid = Request.QueryString["fiid"];

            string sSPName = "dbo.usp_wf_receivelist";

            INPUT = new DataPack();
            INPUT.add("@piid", sProcessID);
            INPUT.add("@fiid", sFiid);
            INPUT.add("@reply", sReply);
			using (SqlDacBase SqlDbAgent = new SqlDacBase())
			{
				SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
				ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sSPName, INPUT);
			}
            string sXSLFile;

            if (sReply == "1")
                sXSLFile = AppDomain.CurrentDomain.BaseDirectory + "Approval\\DocList\\ReceiptReplyListExcel.xsl";
            else
                sXSLFile = AppDomain.CurrentDomain.BaseDirectory + "Approval\\DocList\\ReceiptListExcel.xsl";

            strExcelList = this.pTransform(ds.GetXml(), sXSLFile, sReply);

            strExcelList = strExcelList.Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", "");
        }
        catch (Exception ex) { }
        finally
        {
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
            if (INPUT != null)
            {
                INPUT = null;
            }
        }

    }
    private static System.Xml.Xsl.XslCompiledTransform oXSLT1 = null;
    private static System.Xml.Xsl.XslCompiledTransform oXSLT2 = null;

    public string pTransform(string sXML, System.String sXSLPath, string smode)
    {
        System.IO.StringReader oSR = null;
        System.Xml.XPath.XPathDocument oXPathDoc = null;
        System.IO.StringWriter oSW = null;
        string sReturn = "";
        try
        {
            oSR = new System.IO.StringReader(sXML.ToString());
            oXPathDoc = new System.Xml.XPath.XPathDocument(oSR);
            oSW = new System.IO.StringWriter();

			XsltArgumentList xslArg = new XsltArgumentList();
			xslArg.AddParam("lngindex", "", COVIFlowCom.Common.getLngIdx(Page.Culture));
			cfxsl o = new cfxsl();
			xslArg.AddExtensionObject("urn:cfxsl", o);

            if (smode == "1")
            {
                if (oXSLT1 == null)
                {
                    oXSLT1 = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLT1.Load(sXSLPath);
                }
				oXSLT1.Transform(oXPathDoc, xslArg, oSW);
            }
            else
            {
                if (oXSLT2 == null)
                {
                    oXSLT2 = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLT2.Load(sXSLPath);
                }
				oXSLT2.Transform(oXPathDoc, xslArg, oSW);
            }

            sReturn = oSW.ToString();
			xslArg = null;
			o = null;
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

	public class cfxsl
	{
		public string convertWState(string State)
		{
			string sState = "";
			switch (State)
			{
				case "528":
					sState = Resources.Approval.btn_receipt; break;
				case "288":
					sState = Resources.Approval.lbl_inactive; break;
				case "544":
					sState = Resources.Approval.btn_cancel; break;
				case "545":
					sState = Resources.Approval.btn_cancel; break;
				case "546":
					sState = Resources.Approval.btn_cancel; break;
				default: sState = State; break;
			}
			return sState;
		}
		public string convertPState(string State)
		{
			string sState = "";
			switch (State)
			{
				case "528":
					sState = Resources.Approval.lbl_completed; break;
				case "288":
					sState = Resources.Approval.lbl_Processing; break;
				case "544":
					sState = Resources.Approval.btn_cancel; break;
				case "545":
					sState = Resources.Approval.btn_cancel; break;
				case "546":
					sState = Resources.Approval.btn_cancel; break;
				default: sState = State; break;
			}
			return sState;
		}
		public string convertBState(string State)
		{
			string sState = "";
			if (State.Substring(0, 5) == "02_02")
			{
				sState = Resources.Approval.lbl_reject;
			}
			else if (State.Substring(0, 5) == "02_01")
			{
				sState = Resources.Approval.lbl_Approved;
			}
			else
			{
				sState = "";
			}
			return sState;
		}
		public string splitName(string sValue, string szLangIndex)
		{
			int iLangIndex = Convert.ToInt16(szLangIndex);
			//string sName = sValue.Substring(sValue.LastIndexOf(";") + 1);
			//return sName == "" ? " " : sName;
			string[] ary = sValue.Split(';');
			if (ary.Length > 2)
			{
				if (ary.Length >= iLangIndex) { return ary[iLangIndex + 1]; } else { return ary[1]; }
			}//구데이터 처리
			else if (ary.Length == 2) { return ary[1]; }
			else
			{
				return "";
			}
		}
		public string splitNameExt(string sValue, string szLangIndex)
		{
			//return sValue;
			int iLangIndex = Convert.ToInt16(szLangIndex);
			string[] ary = sValue.Split(';');
			if (ary.Length > iLangIndex) { return ary[iLangIndex]; } else { return ary[0]; }
		}
	}
}
