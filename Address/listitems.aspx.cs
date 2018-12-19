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

/// <summary>
/// 전자결재 조직도 검색결과 및 부서선택 사용자 목록 조회
/// </summary>
public partial class COVIFlowNet_Address_listitems : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string strLangIndex = "0";

    /// <summary>
    /// 다국어 설정
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["user_language"] != null)
        {
            strLangID = Session["user_language"].ToString();
        }
        //다국어 언어설정
        string culturecode = strLangID; //"en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

        DataSet ds = null;
        DataPack INPUT = null;
        StringBuilder sb = null;
        try
            {
                ds = new DataSet();
                INPUT = new DataPack();
                sb = new StringBuilder();

                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                {
                    INPUT.add("@ENT_CODE",Session["user_ent_code"].ToString());
                    INPUT.add("@UNIT_CODE", Session["user_dept_code"].ToString());
                    //if(ConfigurationManager.AppSettings["WF_UseOUManager"].ToString() == "T"){
                    //    INPUT.add("@FLAG","1");
                    //}else{
                        INPUT.add("@FLAG", "0");
                    //}
                    
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
                    ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_GetMember01", INPUT);
                    ds.DataSetName = "ROOT";
                    ds.Tables[0].TableName = "ORG_PERSON";
                    if (ds.Tables.Count > 1)
                    {
                        ds.Tables[1].TableName = "ORG_ADDITIONALJOB";
                    }
                    if (ds.Tables.Count > 2)
                    {
                        ds.Tables[2].TableName = "ORG_DISPATCHEDJOB";
                    }
                    if (ds.Tables.Count > 3)
                    {
                        ds.Tables[3].TableName = "ORG_UNIT";
                    }
                    txtData.Value = pTransform(ds.GetXml(), AppDomain.CurrentDomain.BaseDirectory + "Approval\\Address\\org_memberquery.xsl").Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", "");
                }
            }
            catch (System.Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (ds != null) ds.Dispose();
                if (INPUT != null) INPUT.Dispose();
                if (sb != null) sb = null;
            }

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
        string smode = "";
        System.Xml.Xsl.XsltSettings XSLTsettings = new System.Xml.Xsl.XsltSettings();
        XSLTsettings.EnableScript = true;

        if (sXSLPath.ToLower().IndexOf("org_memberquery.xsl") > -1) smode = "0";
         //이후 case 증가되면 smode의 숫자값을 증가시킵니다.
        try
        {
            oSR = new System.IO.StringReader(sXML.ToString());
            oXPathDoc = new System.Xml.XPath.XPathDocument(oSR);
            oSW = new System.IO.StringWriter();
            if (smode == "0")
            {
                if (oXSLT0 == null)
                {
                    oXSLT0 = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLT0.Load(sXSLPath, XSLTsettings, null);
                }
                oXSLT0.Transform(oXPathDoc, null, oSW);
            }
 
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
}
