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
using Covision.Framework.Data.Business;
using Covision.Framework;
using System.Xml;
using System.Text;
using System.Xml.Xsl;
using System.Xml.XPath;

public partial class Approval_Doclist_GetXMLDocListSelect : System.Web.UI.Page
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public XmlDocument oXMLList = new XmlDocument();
    public String sList = string.Empty;
    public int totalcount = 0;
    public int totalpage = 0;
    public int pagecnt = 0;
    public int pagenum = 0;
    public String strContextMenuType = "";
    public String strTitle = "";
    public String foldermode = "";
    public String mode = "";
    public String strBox = "";
    public String serror = "";
	public string strLangIndex = "0";

    protected void Page_Load(object sender, EventArgs e)
    {

        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        //code
        if (Session["user_language"] != null)
        {
            strLangID = Session["user_language"].ToString();
        }
        //다국어 언어설정
        string culturecode = strLangID; //"en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

        try
        {

            if (this.Page.Application["ContextMenu_USER_YN"].ToString() == "Y")
            {
                strContextMenuType = "ctx";
            }
            else if (this.Page.Application["ContextMenu_OCS"].ToString() == "Y")
            {
                strContextMenuType = "ocs";
            }
            else
            {
                strContextMenuType = string.Empty;
            }
            pSetData();
            if (mode == "")
            {
                mode = "TEMPSAVE";
            }
            if (strTitle == "")
            {
                strTitle = Resources.Approval.lbl_donedate;
            }
            pMakeXML();
        }
        catch (Exception ex)
        {
            pHandleException(ex);
        }
        finally
        {
        }
    }
    /// <summary>
    /// sql query 실행
    /// </summary>
    private void pSetData()
    {
        XmlDocument oXML = new XmlDocument();
        StringBuilder sb = null;
        try
        {
            oXML = pParseRequestBytes();
            sb = new StringBuilder();
            string g_connectString = oXML.SelectSingleNode("Items/connectionname").InnerText;
            DataSet ds = null;
            DataPack INPUT = null;
            try
            {
                ds = new DataSet();
                INPUT = new DataPack();

                string szQuery = oXML.SelectSingleNode("Items/sql").InnerText;
                string szXSLPath = oXML.SelectSingleNode("Items/xslpath").InnerText;
                if (szXSLPath != "") szXSLPath = szXSLPath.Replace(Request.Url.Host, Server.MachineName);

                System.Xml.XmlNodeList oParams = oXML.SelectNodes("Items/param");
                foreach (System.Xml.XmlNode oParam in oParams)
                {
                    INPUT.add("@" + oParam.SelectSingleNode("name").InnerText, oParam.SelectSingleNode("value").InnerText);
                    if (oParam.SelectSingleNode("name").InnerText == "PAGE") { pagenum = Convert.ToInt16(oParam.SelectSingleNode("value").InnerText); }
                    if (oParam.SelectSingleNode("name").InnerText == "PAGECOUNT") { pagecnt = Convert.ToInt16(oParam.SelectSingleNode("value").InnerText); }
                    if (oParam.SelectSingleNode("name").InnerText == "DOC_LIST_TYPE") { mode = oParam.SelectSingleNode("value").InnerText; }
                    if (oParam.SelectSingleNode("name").InnerText == "pagenum") { pagenum = Convert.ToInt16(oParam.SelectSingleNode("value").InnerText); }
                    if (oParam.SelectSingleNode("name").InnerText == "page_size") { pagecnt = Convert.ToInt16(oParam.SelectSingleNode("value").InnerText); }
                    if (oParam.SelectSingleNode("name").InnerText == "MODE") { mode = oParam.SelectSingleNode("value").InnerText; }
                }
               if( oXML.SelectSingleNode("Items/datetitle") != null)  strTitle = oXML.SelectSingleNode("Items/datetitle").InnerText;
               if (mode == "") mode = "TCINFO";
                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(g_connectString).ToString();
                    if (oXML.SelectSingleNode("Items/type") != null && oXML.SelectSingleNode("Items/type").InnerText.ToLower() == "sp")
                    {
                        ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, szQuery, INPUT);
                    }
                    else
                    {
                        ds = SqlDbAgent.ExecuteDataSet(CommandType.Text, szQuery, INPUT);
                    }
                }

                sb.Append(this.pTransform(ds.GetXml(), AppDomain.CurrentDomain.BaseDirectory + "Approval\\" + szXSLPath, mode).Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", ""));
                oXMLList.LoadXml(sb.ToString());


            }
            catch (System.Exception ex)
            {
                throw ex;
            }
            finally
            {
                //code
                oXML = null;
                if (INPUT != null)
                {
                    INPUT.Dispose();
                    INPUT = null;
                }
                if (ds != null)
                {
                    ds.Dispose();
                    ds = null;
                }
            }
        }
        catch (Exception e)
        {
            throw e;
        }
        finally
        {
        }
    }
    /// <summary>
    /// Request 값 xml 객체로 추출
    /// </summary>
    /// <returns>XmlDocument</returns>
    private XmlDocument pParseRequestBytes()
    {
        try
        {
            XmlDocument oXMLData = new XmlDocument();
            System.Text.Decoder oDecoder = System.Text.Encoding.UTF8.GetDecoder();
            System.Byte[] aBytes = Request.BinaryRead(Request.TotalBytes);
            long iCount = oDecoder.GetCharCount(aBytes, 0, aBytes.Length);
            System.Char[] aChars = new char[iCount];
            oDecoder.GetChars(aBytes, 0, aBytes.Length, aChars, 0);
            oXMLData.Load(new System.IO.StringReader(new String(aChars)));
            return oXMLData;
        }
        catch (Exception e)
        {
            throw new Exception(null, e);
        }
    }
    /// <summary>
    /// Exception Handling
    /// </summary>
    /// <param name="ex">exception</param>
    /// <returns>XmlDocument</returns>
    private void pHandleException(Exception ex)
    {
        try
        {
            //Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ParseStackTrace(ex) + "]]></error>");
            serror = "<error><![CDATA[" + COVIFlowCom.ErrResult.ParseStackTrace(ex) + "]]></error>";
        }
        catch (Exception e)
        {
            //Response.Write("<error><![CDATA[" + e.Message + "]]></error>");
            serror = "<error><![CDATA[" + e.Message + "]]></error>";
        }
    }
    private static System.Xml.Xsl.XslCompiledTransform oXSLTDOCLIST = null;
    private static System.Xml.Xsl.XslCompiledTransform oXSLTTCINFO = null;
    private static System.Xml.Xsl.XslCompiledTransform oXSLTAPV = null;

    /// <summary>
    /// Data를 XML형태(string)로 받아 XSL로 Parsing해주는 함수
    /// </summary>
    /// <param name="sXML">XML string</param>
    /// <param name="sXSLPath">XSL파일 경로</param>
    /// <param name="smode"></param>
    /// <returns></returns>
    public string pTransform(string sXML, System.String sXSLPath, string smode)
    {
        System.IO.StringReader oSR = null;
        System.Xml.XPath.XPathDocument oXPathDoc = null;
        System.IO.StringWriter oSW = null;
        string sReturn = "";

        System.Xml.Xsl.XsltSettings XSLTsettings = null;
        try
        {
            XSLTsettings = new System.Xml.Xsl.XsltSettings();
            XSLTsettings.EnableScript = true;
            oSR = new System.IO.StringReader(sXML.ToString());
            oXPathDoc = new System.Xml.XPath.XPathDocument(oSR);
            oSW = new System.IO.StringWriter();
            if (smode == "1" || smode == "2" || smode=="3")
            {
                if (oXSLTDOCLIST == null)
                {
                    oXSLTDOCLIST = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLTDOCLIST.Load(sXSLPath, XSLTsettings, null);
                }
                XsltArgumentList xslArg = new XsltArgumentList();
                cfxsl o = new cfxsl();
                xslArg.AddExtensionObject("urn:cfxsl", o);

                oXSLTDOCLIST.Transform(oXPathDoc, xslArg, oSW);
            }
            else if (smode == "TCINFO")
            {
                if (oXSLTTCINFO == null)
                {
                    oXSLTTCINFO = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLTTCINFO.Load(sXSLPath, XSLTsettings, null);
                }
                XsltArgumentList xslArg = new XsltArgumentList();
                cfxsl o = new cfxsl();
                xslArg.AddExtensionObject("urn:cfxsl", o);

                oXSLTTCINFO.Transform(oXPathDoc, xslArg, oSW);
            }
            else
            {
                if (oXSLTAPV == null)
                {
                    oXSLTAPV = new System.Xml.Xsl.XslCompiledTransform();
                    oXSLTAPV.Load(sXSLPath, XSLTsettings, null);
                }
                XsltArgumentList xslArg = new XsltArgumentList();
                cfxsl o = new cfxsl();
                xslArg.AddExtensionObject("urn:cfxsl", o);

                oXSLTAPV.Transform(oXPathDoc, xslArg, oSW);
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
            if (XSLTsettings != null)
            {
                XSLTsettings = null;
            }
        }
        return sReturn;
    }
    /// <summary>
    /// 결재함 본문 그리기
    /// </summary>
    private void pMakeXML()
    {

        StringBuilder sb = new StringBuilder();
        XmlNode emlRoot = oXMLList.DocumentElement;
        cfxsl cfxsl = new cfxsl();
        string fmid = "";
        string fmnm = "";
        string fmpf = "";
        string fmrv = "";
        string scid = "";
        string fiid = "";
        string fmfn = "";
        string piid = "";
        string bstate = "";
        XmlDocument PI_DSCR = new XmlDocument();
        XmlNode oforminfo = null;
        XmlNodeList emlList = null;

        switch (mode)
        {
            case "1": 
            case "2": 
            case "3": 
            case "4":
            case "5": 
            case "6": 
            case "7": 
            case "8": 
            case "9": 
            case "10":
            case "11": emlList = emlRoot.SelectNodes("docitem"); break;
            case "DIST": emlList = emlRoot.SelectNodes("forminstance"); break;
            case "TCINFO": emlList = emlRoot.SelectNodes("forminstance"); break;
            default: emlList = emlRoot.SelectNodes("workitem"); break;
        }

        try
        {
            if (emlList != null)
            {
                //count
                totalcount = Convert.ToInt16(emlRoot.SelectSingleNode("totalcount").InnerText);
                totalpage = cfxsl.getPageValue(pagecnt, totalcount);

                //list
                if (emlList.Count == 0)
                {
                    sb.Append("<tr>");
                    switch (mode)
                    {
                        case "1": sb.Append("	<td colspan=\"4\" "); break;
                        case "2": sb.Append("	<td colspan=\"6\" "); break;
                        case "3": sb.Append("	<td colspan=\"7\" "); break;
                        case "4": sb.Append("	<td colspan=\"8\" "); break;
                        case "5": sb.Append("	<td colspan=\"9\" "); break;
                        case "6": sb.Append("	<td colspan=\"5\" "); break;
                        case "7": sb.Append("	<td colspan=\"5\" "); break;
                        case "8": sb.Append("	<td colspan=\"6\" "); break;
                        case "9": sb.Append("	<td colspan=\"9\" "); break;
                        case "10": sb.Append("	<td colspan=\"5\" "); break;
                        case "11": sb.Append("	<td colspan=\"5\" "); break; 
                        case "TCINFO": sb.Append("	<td colspan=\"6\" "); break;
                        case "DIST": sb.Append("	<td colspan=\"6\" "); break;
                        default: sb.Append("	<td colspan=\"6\" "); break;
                    }
                    sb.Append(" nowrap=\"true\" align=\"center\" class=\"BTable_bg08\">").Append(Resources.Approval.msg_101).Append("</td>");
                    sb.Append("</tr>");
                }
                else
                {
                    int i = 0;
                    #region List Start
                    foreach (XmlNode eml in emlList)
                    {
                        sb.Append("<tr onkeydown=\"event_row_onkeydown\" onkeyup=\"event_row_onkeyup\" onselectstart=\"event_row_onselectstart\" ");
                        sb.Append(" onMouseover=\"this.style.background='#F8F4DE';\" ");
                        sb.Append(" onMouseout=\"this.style.background=''\" ");

                        #region PI_DSCR
                        //2011.06 특수문자 포함 연결문서 처리 방지
                        String smodifydscr = "";
                        if (eml.SelectSingleNode("effectcmt") != null)
                        {
                            //2011.06 제목 특수문자 포함 처리
                            String strDSCR = eml.SelectSingleNode("effectcmt").InnerText.Substring(0, eml.SelectSingleNode("effectcmt").InnerText.IndexOf("</ClientAppInfo>")) + "</ClientAppInfo>";
                            String strmodifyeffectcmt = eml.SelectSingleNode("effectcmt").InnerText.Replace(strDSCR, "");
                            PI_DSCR.LoadXml(strDSCR);
                            piid = strmodifyeffectcmt.Split(';')[1];
                            bstate = strmodifyeffectcmt.Split(';')[2];
                            smodifydscr = strDSCR;
                            smodifydscr = smodifydscr.Replace("&quot;", "").Replace("&amp;", "").Replace("&lt;", "").Replace("&gt;", "").Replace(";", "");
                            smodifydscr = smodifydscr + ";" + piid + ";" + bstate;
                        }
                        else if (eml.SelectSingleNode("link_url") != null)
                        {
                            //2011.06 제목 특수문자 포함 처리
                            String strDSCR = eml.SelectSingleNode("link_url").InnerText.Substring(0, eml.SelectSingleNode("link_url").InnerText.IndexOf("</ClientAppInfo>")) + "</ClientAppInfo>";
                            String strmodifyeffectcmt = eml.SelectSingleNode("link_url").InnerText.Replace(strDSCR, "");
                            PI_DSCR.LoadXml(strDSCR);
                            piid = eml.SelectSingleNode("piid").InnerText;
                            bstate = eml.SelectSingleNode("bstate").InnerText;
                            smodifydscr = strDSCR;
                            smodifydscr = smodifydscr.Replace("&quot;", "").Replace("&amp;", "").Replace("&lt;", "").Replace("&gt;", "").Replace(";", "");
                            smodifydscr = smodifydscr + ";" + piid + ";" + bstate;
                        }
                        else if (eml.SelectSingleNode("pidc") != null)
                        {
                            PI_DSCR.LoadXml(eml.SelectSingleNode("pidc").InnerText);
                            smodifydscr = eml.SelectSingleNode("pidc").InnerText;
                            smodifydscr = smodifydscr.Replace("&quot;", "").Replace("&amp;", "").Replace("&lt;", "").Replace("&gt;", "").Replace(";", "");
                        }

                        oforminfo = PI_DSCR.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");
                        fmid = oforminfo.Attributes["id"].Value;
                        fmnm = oforminfo.Attributes["name"].Value;
                        fmpf = oforminfo.Attributes["prefix"].Value;
                        fmrv = oforminfo.Attributes["revision"].Value;
                        scid = oforminfo.Attributes["schemaid"].Value;
                        fiid = oforminfo.Attributes["instanceid"].Value;
                        fmfn = oforminfo.Attributes["filename"].Value;

                        string ispaper = "";
                        if (oforminfo.Attributes["ispaper"] != null) ispaper = oforminfo.Attributes["ispaper"].Value;
                        string ugrs = "";
                        if (oforminfo.Attributes["urgentreason"] != null) ugrs = oforminfo.Attributes["urgentreason"].Value;
                        string rqrs = "";
                        if (oforminfo.Attributes["req_response"] != null) rqrs = oforminfo.Attributes["req_response"].Value;
                        string secdoc = "";
                        if (oforminfo.Attributes["secure_doc"] != null) secdoc = oforminfo.Attributes["secure_doc"].Value;
                        if (secdoc == "") { secdoc = "0"; }
                        string isfile = "";
                        if (oforminfo.Attributes["isfile"] != null) isfile = oforminfo.Attributes["isfile"].Value;
                        if (isfile != "0" && isfile != "") { isfile = "1"; } else { isfile = "0"; }
                        string edms_document = "";
                        if (oforminfo.Attributes["edms_document"] != null) edms_document = oforminfo.Attributes["edms_document"].Value;
                        if (edms_document == "") { edms_document = "0"; } else { edms_document = "1"; }

                        string title = "";
                        if (eml.SelectSingleNode("docsubject") != null) title =eml.SelectSingleNode("docsubject").InnerText;
                        if (eml.SelectSingleNode("piid") != null) piid = eml.SelectSingleNode("piid").InnerText;
                        if (eml.SelectSingleNode("bstate") != null) bstate = eml.SelectSingleNode("bstate").InnerText;
                        if (eml.SelectSingleNode("title") != null) title = eml.SelectSingleNode("title").InnerText;

                        #endregion
                        #region NOT TEMPSAVE Attribute Setting

                        //sb.Append(" workitemid=\"").Append(eml.SelectSingleNode("WI_ID").InnerText).Append("\"");

                        sb.Append(" piid=\"").Append(piid).Append("\"");
                        sb.Append(" bstate=\"").Append(bstate).Append("\"");
                        sb.Append(" pibd1=\"").Append("").Append("\"");
                        sb.Append(" fiid=\"").Append(fiid).Append("\"");
                        sb.Append(" fmid=\"").Append(fmid).Append("\"");
                        sb.Append(" fmnm=\"").Append(fmnm).Append("\"");
                        sb.Append(" fmrv=\"").Append(fmrv).Append("\"");
                        sb.Append(" scid=\"").Append(scid).Append("\"");
                        sb.Append(" fmpf=\"").Append(fmpf).Append("\"");
                        sb.Append(" fmfn=\"").Append(fmfn).Append("\"");
                        sb.Append(" ispaper=\"").Append(ispaper).Append("\"");
                        sb.Append(" secdoc=\"").Append(secdoc).Append("\"");
                        sb.Append(" edms_document=\"").Append(edms_document).Append("\"");
                        #endregion
                        sb.Append(" className='rowunselected' ");
                        sb.Append(" >");

                        #region LIst
                        switch (mode)
                        {
                            case "1":
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\"><input type=\"checkbox\" id=\"chkID\" name=\"chkID\" value=\"").Append(eml.SelectSingleNode("id").InnerText).Append("@@@").Append(replaceXLCharacterValue(smodifydscr)).Append("@@@").Append(replaceXLCharacterValue(eml.SelectSingleNode("docsubject").InnerText.Replace("\"", ""))).Append(" \" /></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(eml.SelectSingleNode("serial").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("apvdt").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("docno").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"><a href=\"#\" class=\"text02_L\">").Append(replaceXLCharacter(eml.SelectSingleNode("docsubject").InnerText)).Append("</a></td>");
                                break;
                            case "2":
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\"><input type=\"checkbox\" id=\"chkID\" name=\"chkID\" value=\"").Append(eml.SelectSingleNode("id").InnerText).Append("@@@").Append(replaceXLCharacterValue(smodifydscr)).Append("@@@").Append(replaceXLCharacterValue(eml.SelectSingleNode("docsubject").InnerText.Replace("\"", ""))).Append(" \" /></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(eml.SelectSingleNode("serial").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("rgdt").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("senounm").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("docno").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"><a href=\"#\" class=\"text02_L\">").Append(replaceXLCharacter(eml.SelectSingleNode("docsubject").InnerText)).Append("</a></td>");
								sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(splitNameExt(eml.SelectSingleNode("chargenm").InnerText,strLangIndex)).Append("</td>");
                                break;
                            case "3":
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\"><input type=\"checkbox\" id=\"chkID\" name=\"chkID\" value=\"").Append(eml.SelectSingleNode("id").InnerText).Append("@@@").Append(replaceXLCharacterValue(smodifydscr)).Append("@@@").Append(replaceXLCharacterValue(eml.SelectSingleNode("docsubject").InnerText.Replace("\"", ""))).Append(" \" /></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(eml.SelectSingleNode("serial").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("apvdt").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("docno").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"><a href=\"#\" class=\"text02_L\">").Append(replaceXLCharacter(eml.SelectSingleNode("docsubject").InnerText)).Append("</a></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("rgcmt").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("recounm").InnerText).Append("</td>");
								sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(splitNameExt(eml.SelectSingleNode("rgnm").InnerText,strLangIndex)).Append("</td>");
                                break;
                            case "4":
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\"><input type=\"checkbox\" id=\"chkID\" name=\"chkID\" value=\"").Append(eml.SelectSingleNode("id").InnerText).Append("@@@").Append(replaceXLCharacterValue(smodifydscr)).Append("@@@").Append(replaceXLCharacterValue(eml.SelectSingleNode("docsubject").InnerText.Replace("\"", ""))).Append(" \" /></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(eml.SelectSingleNode("serial").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("rgdt").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("senounm").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("docno").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("recounm").InnerText).Append("</td>");
                                //sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"><a href=\"#\" class=\"text02_L\">").Append(replaceXLCharacter(eml.SelectSingleNode("docsubject").InnerText)).Append("</a></td>");
								sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(splitNameExt(eml.SelectSingleNode("chargenm").InnerText,strLangIndex)).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("rgcmt").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("effectcmt").InnerText).Append("</td>");
                                break;
                            case "5":
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\"><input type=\"checkbox\" id=\"chkID\" name=\"chkID\" value=\"").Append(eml.SelectSingleNode("id").InnerText).Append("@@@").Append(replaceXLCharacterValue(smodifydscr)).Append("@@@").Append(replaceXLCharacterValue(eml.SelectSingleNode("docsubject").InnerText.Replace("\"", ""))).Append(" \" /></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(eml.SelectSingleNode("serial").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("apvdt").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("recounm").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"><a href=\"#\" class=\"text02_L\">").Append(replaceXLCharacter(eml.SelectSingleNode("docsubject").InnerText)).Append("</a></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("rgcmt").InnerText).Append("</td>");
								sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(splitNameExt(eml.SelectSingleNode("initnm").InnerText,strLangIndex)).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"> </td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"> </td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"> </td>");
                                break;
                            case "6":
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\"><input type=\"checkbox\" id=\"chkID\" name=\"chkID\" value=\"").Append(eml.SelectSingleNode("id").InnerText).Append("@@@").Append(replaceXLCharacterValue(smodifydscr)).Append("@@@").Append(replaceXLCharacterValue(eml.SelectSingleNode("docsubject").InnerText.Replace("\"", ""))).Append(" \" /></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(eml.SelectSingleNode("serial").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("rgdt").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("senounm").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"><a href=\"#\" class=\"text02_L\">").Append(replaceXLCharacter(eml.SelectSingleNode("docsubject").InnerText)).Append("</a></td>");
								sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(splitNameExt(eml.SelectSingleNode("chargenm").InnerText,strLangIndex)).Append("</td>");
                                break;
                            case "7":
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\"><input type=\"checkbox\" id=\"chkID\" name=\"chkID\" value=\"").Append(eml.SelectSingleNode("id").InnerText).Append("@@@").Append(replaceXLCharacterValue(smodifydscr)).Append("@@@").Append(replaceXLCharacterValue(eml.SelectSingleNode("docsubject").InnerText.Replace("\"", ""))).Append(" \" /></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(eml.SelectSingleNode("serial").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("docno").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\" onclick=\"openpopup();\" >").Append(cfxsl.setNodeValue(eml.SelectSingleNode("recounm").InnerText)).Append("&#160;</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"><a href=\"#\" class=\"text02_L\">").Append(replaceXLCharacter(eml.SelectSingleNode("docsubject").InnerText)).Append("</a></td>");
								sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(splitNameExt(eml.SelectSingleNode("rgnm").InnerText,strLangIndex)).Append("&#160;</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("rgdt").InnerText).Append("&#160;</td>");
                                break;
                            case "8":
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\"><input type=\"checkbox\" id=\"chkID\" name=\"chkID\" value=\"").Append(eml.SelectSingleNode("id").InnerText).Append("@@@").Append(replaceXLCharacterValue(smodifydscr)).Append("@@@").Append(replaceXLCharacterValue(eml.SelectSingleNode("docsubject").InnerText.Replace("\"", ""))).Append(" \" /></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(eml.SelectSingleNode("serial").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(eml.SelectSingleNode("apvdt").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("docno").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"><a href=\"#\" class=\"text02_L\">").Append(replaceXLCharacter(eml.SelectSingleNode("docsubject").InnerText)).Append("</a></td>");
								sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(splitNameExt(eml.SelectSingleNode("initnm").InnerText,strLangIndex)).Append("&#160;</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(cfxsl.getRgcmtNodeValue(eml.SelectSingleNode("rgcmt").InnerText, "approval")).Append("&#160;</td>");
                                break;
                            case "9":
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\"><input type=\"checkbox\" id=\"chkID\" name=\"chkID\" value=\"").Append(eml.SelectSingleNode("id").InnerText).Append("@@@").Append(replaceXLCharacterValue(smodifydscr)).Append("@@@").Append(replaceXLCharacterValue(eml.SelectSingleNode("docsubject").InnerText.Replace("\"", ""))).Append(" \" /></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(eml.SelectSingleNode("serial").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(eml.SelectSingleNode("apvdt").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("docno").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"><a href=\"#\" class=\"text02_L\">").Append(replaceXLCharacter(eml.SelectSingleNode("docsubject").InnerText)).Append("</a></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(cfxsl.getRgcmtNodeValue(eml.SelectSingleNode("rgcmt").InnerText, "receive")).Append("&#160;</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(cfxsl.getRgcmtNodeValue(eml.SelectSingleNode("rgcmt").InnerText, "stemp")).Append("&#160;</td>");
								sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(splitNameExt(eml.SelectSingleNode("initnm").InnerText,strLangIndex)).Append("&#160;</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(cfxsl.getRgcmtNodeValue(eml.SelectSingleNode("rgcmt").InnerText, "approval")).Append("&#160;</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(cfxsl.getRgcmtNodeValue(eml.SelectSingleNode("rgcmt").InnerText, "kind")).Append("&#160;</td>");
                                break;
                            case "10":
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\"><input type=\"checkbox\" id=\"chkID\" name=\"chkID\" value=\"").Append(eml.SelectSingleNode("id").InnerText).Append("@@@").Append(replaceXLCharacterValue(smodifydscr)).Append("@@@").Append(replaceXLCharacterValue(eml.SelectSingleNode("docsubject").InnerText.Replace("\"", ""))).Append(" \" /></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(eml.SelectSingleNode("serial").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("docno").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\" onclick=\"openpopup();\" >").Append(cfxsl.setNodeValue(eml.SelectSingleNode("recounm").InnerText)).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"><a href=\"#\" class=\"text02_L\">").Append(replaceXLCharacter(eml.SelectSingleNode("docsubject").InnerText)).Append("</a></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("rgnm").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("rgdt").InnerText).Append("</td>");
                                break;
                            case "11":
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\"><input type=\"checkbox\" id=\"chkID\" name=\"chkID\" value=\"").Append(eml.SelectSingleNode("id").InnerText).Append("@@@").Append(replaceXLCharacterValue(smodifydscr)).Append("@@@").Append(replaceXLCharacterValue(eml.SelectSingleNode("docsubject").InnerText.Replace("\"", ""))).Append(" \" /></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(eml.SelectSingleNode("serial").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("docno").InnerText).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\" onclick=\"openpopup();\" >").Append(cfxsl.setNodeValue(eml.SelectSingleNode("recounm").InnerText)).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"><a href=\"#\" class=\"text02_L\">").Append(replaceXLCharacter(eml.SelectSingleNode("docsubject").InnerText)).Append("</a></td>");
								sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(splitNameExt(eml.SelectSingleNode("rgnm").InnerText,strLangIndex)).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("rgdt").InnerText).Append("</td>");
                                break;
                            case "DIST":
                            case "TCINFO":
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\"><input type=\"checkbox\" id=\"chkID\" name=\"chkID\" value=\"").Append(fiid).Append("@@@").Append(replaceXLCharacterValue(smodifydscr)).Append(";").Append(eml.SelectSingleNode("piid").InnerText).Append(";").Append(eml.SelectSingleNode("bstate").InnerText).Append("@@@").Append(replaceXLCharacterValue(title.Replace("\"", ""))).Append(" \" /></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(Convert.ToString(totalcount - (pagenum - 1 ) * pagecnt - i )).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(fmnm).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"><a href=\"#\" class=\"text02_L\">").Append(replaceXLCharacter(eml.SelectSingleNode("title").InnerText)).Append("</a></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(splitNameExt(eml.SelectSingleNode("picreator").InnerText, strLangIndex)).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("createdate").InnerText).Append("</td>");
                                break;
                            default:
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\"><input type=\"checkbox\" id=\"chkID\" name=\"chkID\" value=\"").Append(eml.SelectSingleNode("id").InnerText).Append("@@@").Append(replaceXLCharacterValue(smodifydscr)).Append(";").Append(eml.SelectSingleNode("piid").InnerText).Append(";").Append(eml.SelectSingleNode("bstate").InnerText).Append("@@@").Append(replaceXLCharacterValue(title.Replace("\"", ""))).Append(" \" /></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-left:10px\" onselect=\"false\">").Append(Convert.ToString(totalcount - (pagenum - 1) * pagecnt - i )).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(fmnm).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\"><a href=\"#\" class=\"text02_L\">").Append(replaceXLCharacter(eml.SelectSingleNode("title").InnerText)).Append("</a></td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">");
                                if (strContextMenuType == "ocs")
                                {
                                    sb.Append("<span>");
                                    if (eml.SelectSingleNode("picreatorsipaddress") != null)
                                    {
                                        sb.Append("    <img src='/GWImages/common/namecontrol_images/unknown.gif'  style='border-width:0px;' align=\"absmiddle\"  covimode=\"imgctxmenu\" ").Append(" onload=\"PresenceControl(\'").Append(eml.SelectSingleNode("picreatorsipaddress").InnerText).Append("\');\"");
                                        sb.Append(" id=\"ctl00_ContentPlaceHolder1_GridView1_ctl").Append(i).Append("_presence\"");
                                        sb.Append("    />");
                                    }
                                    sb.Append("</span>&#160;");
                                }
                                else if (strContextMenuType == "ctx")
                                {
                                    sb.Append("<a href=\"#\" onclick=\"javascript:OpenContextMenu4Approval(this)\" class=\"text02_L\"  onmouseout=\"MM_swapImgRestore()\" ");
                                    sb.Append(" onmouseover=\"");
                                    sb.Append("MM_swapImage('Image");
                                    sb.Append(i);
                                    sb.Append("','','").Append(Session["user_thema"].ToString()).Append("/Covi/Common/icon/icon_writer_on.gif',1)\"");
                                    sb.Append(" >");
                                    sb.Append("<img src=\"").Append(Session["user_thema"].ToString()).Append("/Covi/Common/icon/icon_writer_off.gif\" border=\"0\" align=\"absmiddle\" covimode=\"imgctxmenu\" ");
                                    sb.Append(" name=\"Image").Append(i).Append("\"");
                                    sb.Append(" id=\"Image").Append(i).Append("\"");
                                    sb.Append(" />");
                                    sb.Append("</a>&#160;");
                                }
								sb.Append(splitNameExt(eml.SelectSingleNode("picreator").InnerText,strLangIndex)).Append("</td>");
                                sb.Append("	<td class=\"BTable_bg08\" nowrap=\"true\" style=\"overflow:hidden; padding-Right:1px\" onselect=\"false\">").Append(eml.SelectSingleNode("completedate").InnerText).Append("</td>");
                                break;

                        }
                        #endregion List끝
                        sb.Append("</tr>");
                        i++;
                    }
                    #endregion List End
                }
            }
            sList = sb.ToString();

        }
        catch (System.Exception ex)
        {
            throw ex;
        }
        finally
        {
            sb = null;
            cfxsl = null;
        }
    }
    public string replaceXLCharacter(string strContent)
    {
        if (strContent != null)
        {            
            strContent = strContent.Replace("\"", "");
            strContent = strContent.Replace("&", "&amp;");
            strContent = strContent.Replace("<", "&lt;");
            strContent = strContent.Replace(">", "&gt;");
        }
        return strContent;  
    }
    public string replaceXLCharacterValue(string strContent)
    {
        if (strContent != null)
        {
            strContent = strContent.Replace("&quot;", "");
            strContent = strContent.Replace("\"", "&quot;");
            strContent = strContent.Replace("&", "&amp;");
            strContent = strContent.Replace("<", "&lt;");
            strContent = strContent.Replace(">", "&gt;");
        }
        return strContent;
    }
	public string splitName(string sValue, string szLangIndex)
	{
		int iLangIndex = Convert.ToInt16(szLangIndex);
		//string sName = sValue.Substring(sValue.LastIndexOf(";") + 1);
		//return sName == "" ? " " : sName;
		string[] ary = sValue.Split(';');
		if (ary.Length >= iLangIndex) { return ary[iLangIndex + 1]; } else { return ary[1]; }
	}
	public string splitNameExt(string sValue, string szLangIndex)
	{
		//return sValue;
		int iLangIndex = Convert.ToInt16(szLangIndex);
		string[] ary = sValue.Split(';');
		if (ary.Length > iLangIndex) { return ary[iLangIndex]; } else { return ary[0]; }
	}
    public class cfxsl
    {
        public string m_log = "LOG=";
        public int m_cntHiddenPerson = 0;
        public int m_cntHiddenOu = 0;
        public int m_cntHiddenGroup = 0;
        public int m_cntHiddenStep = 0;
        public int m_cntApvStep = 0;

        public void log(string v) { m_log += " #" + v; }
        public string getLog() { return m_log; }

        public string resetHiddenPersonCount(XPathNodeIterator oNodeList)
        {
            log("rhpc" + oNodeList.Count.ToString());
            m_cntHiddenPerson = oNodeList.Count; return "";
        }
        public string resetHiddenOuCount(XPathNodeIterator oNodeList)
        {
            log("rhoc" + oNodeList.Count.ToString());
            m_cntHiddenOu = oNodeList.Count; return "";
        }
        public string resetHiddenStepCount(XPathNodeIterator oNodeList)
        {
            log("rhsc" + oNodeList.Count.ToString());
            m_cntHiddenStep = oNodeList.Count; return "";
        }
        public int countHidden(XPathNodeIterator oNodeList)
        {
            if (oNodeList.Count == 0) return 0;
            int ireutrn = 0;
            oNodeList.MoveNext();
            XPathNavigator oNode = oNodeList.Current;
            string sName = oNode.Name;
            XPathNavigator oTI = oNode.SelectSingleNode("taskinfo[@visible='n']");
            switch (sName)
            {
                case "step": if (oTI != null) m_cntHiddenStep--; log("chs" + m_cntHiddenStep); ireutrn = m_cntHiddenStep; break;
                case "ou": if (oTI != null) m_cntHiddenOu--; log("cho" + m_cntHiddenOu); ireutrn = m_cntHiddenOu; break;
                case "role":
                case "person": if (oTI != null) m_cntHiddenPerson--; log("chp" + m_cntHiddenPerson); ireutrn = m_cntHiddenPerson; break;
                case "group": if (oTI != null) m_cntHiddenGroup--; log("chg" + m_cntHiddenGroup); ireutrn = m_cntHiddenGroup; break;
            }
            return ireutrn;

        }
        public string convertDate(XPathNodeIterator oNodeList)
        {
            if (oNodeList.Count == 0) return "";

            oNodeList.MoveNext();
            XPathNavigator oNode = oNodeList.Current;
            return formatDate(oNode.Value);
        }
        public string formatDate(string sDate)
        {
            if (sDate == "")
                return " ";
            DateTime dtDate = DateTime.Parse(sDate.Replace("-", "/").Replace("오후", "pm").Replace("오전", "am"));
            return dtDate.Year.ToString() + "-" + dblDigit(dtDate.Month) + "-" + dblDigit(dtDate.Day) + " " + dblDigit(dtDate.Hour) + ":" + dblDigit(dtDate.Minute);//+":"+dblDigit(dtDate.getSeconds());            
        }
        public string dblDigit(int iVal) { return (iVal < 10 ? "0" + iVal.ToString() : iVal.ToString()); }
        public bool isLastApvStep()
        {
            return (m_cntApvStep++ == 0 ? true : false);
        }
        public string splitName(string sValue)
        {
            string sName = sValue.Substring(sValue.LastIndexOf(";") + 1);
            return sName == "" ? " " : sName;
        }
        public string convertKindToSignTypeByRTnUT(string sKind, string sParentUT, string sRT, string sUT, string customattribute2)
        {
            log("kind:" + sKind + "|" + sParentUT + "|" + sRT + "|" + sUT);

            string sSignType = " ";
            string scustomattribute2 = (customattribute2 == "") ? "" : customattribute2;
            if (scustomattribute2 == "ExtType")
            {
                sSignType = Resources.Approval.lbl_ExtType;
            }
            else if (scustomattribute2 == "개인준법")
            {
                sSignType = Resources.Approval.lbl_person_audit2;
            }
            else
            {
                switch (sRT)
                {
                    case "receive":
                        switch (sUT)
                        {
                            case "ou":
                                switch (sParentUT)
                                {
                                    case "ou": sSignType = Resources.Approval.lbl_ChargeDept; break;
                                    case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                                } break;
                            case "role":
                            case "person":
                                sSignType = Resources.Approval.lbl_receive; break;
                            case "group":
                                sSignType = Resources.Approval.lbl_receive; break;
                        } break;
                    case "consult":
                        switch (sUT)
                        {
                            case "ou":
                                switch (sParentUT)
                                {
                                    case "ou": sSignType = Resources.Approval.lbl_DeptConsent; break;
                                    case "role":
                                    case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                                } break;
                            case "role":
                            case "person":
                                sSignType = Resources.Approval.lbl_PersonConsent; break;
                        } break;
                    case "assist":
                        switch (sUT)
                        {
                            case "ou":
                                switch (sParentUT)
                                {
                                    case "ou": sSignType = Resources.Approval.lbl_DeptAssist; break;
                                    case "role":
                                    case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                                } break;
                            case "role":
                            case "person":
                                //sSignType= Resources.Approval.lbl_assist ;break;
                                sSignType = scustomattribute2; break;
                        } break;
                    case "audit":
                        switch (sUT)
                        {
                            case "ou":
                                switch (sParentUT)
                                {
                                    case "ou": sSignType = (scustomattribute2 == "" ? Resources.Approval.lbl_audit : scustomattribute2); break;
                                    case "role":
                                    case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                                } break;
                            case "role":
                            case "person":
                                sSignType = Resources.Approval.lbl_audit; break;
                        } break;
                    case "review":
                        sSignType = Resources.Approval.lbl_PublicInspect; break;
                    case "notify":
                        sSignType = Resources.Approval.lbl_SendInfo; break;
                    case "approve":
                        switch (sUT)
                        {
                            case "role":
                            case "person":
                                sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                            case "ou":
                                sSignType = Resources.Approval.lbl_DeptApprv; break;
                        } break;
                }
            }
            return sSignType;
        }
        public string convertKindToSignType(string sKind, string customattribute2)
        {
            string sSignType;
            string scustomattribute2 = (customattribute2 == "") ? "" : customattribute2;
            switch (sKind)
            {
                case "normal":
                    sSignType = Resources.Approval.lbl_normalapprove; break;
                case "consent":
                    sSignType = Resources.Approval.lbl_investigation; break;
                case "authorize":
                    sSignType = Resources.Approval.lbl_authorize; break;
                case "substitute":
                    sSignType = Resources.Approval.lbl_substitue; break;
                case "review":
                    sSignType = Resources.Approval.lbl_review; break;
                case "bypass":
                    sSignType = Resources.Approval.lbl_bypass; break;
                case "charge":
                    sSignType = Resources.Approval.lbl_charge; break;
                case "confidential":
                    sSignType = Resources.Approval.lbl_Confidential; break;
                case "conveyance":
                    sSignType = Resources.Approval.lbl_forward; break;
                case "skip":
                    sSignType = Resources.Approval.lbl_NoApprvl + " " + scustomattribute2; break;
                case "confirm":
                    sSignType = Resources.Approval.lbl_Confirm; break;
                default:
                    sSignType = " "; break;
            }
            return sSignType;
        }
        public string convertSignResult(string sResult, string sKind, string customattribute2)
        {
            string sSignResult;

            switch (sResult)
            {
                case "inactive":
                    sSignResult = Resources.Approval.lbl_inactive; break;
                case "pending":
                    sSignResult = Resources.Approval.lbl_inactive; break;
                case "reserved":
                    sSignResult = Resources.Approval.lbl_hold; break;
                case "completed":
                    if (customattribute2 == "ExtType")
                    {
                        sSignResult = Resources.Approval.lbl_ExtType_agree;
                    }
                    else
                    {
                        sSignResult = (sKind == "charge") ? Resources.Approval.btn_draft : Resources.Approval.lbl_app;
                    } break;
                case "rejected":
                    if (customattribute2 == "ExtType")
                    {
                        sSignResult = Resources.Approval.lbl_ExtType_disagree;
                    }
                    else
                    {
                        sSignResult = Resources.Approval.lbl_reject;
                    } break;
                case "rejectedto":
                    sSignResult = Resources.Approval.lbl_reject; break;
                case "authorized":
                    sSignResult = Resources.Approval.lbl_authorize; break;
                case "reviewed":
                    sSignResult = Resources.Approval.lbl_review; break;
                case "substituted":
                    sSignResult = Resources.Approval.lbl_substitue; break;
                case "agreed":
                    if (customattribute2 == "ExtType")
                    {
                        sSignResult = Resources.Approval.lbl_ExtType_agree;
                    }
                    else
                    {
                        sSignResult = Resources.Approval.lbl_consent;
                    } break;
                case "disagreed":
                    if (customattribute2 == "ExtType")
                    {
                        sSignResult = Resources.Approval.lbl_ExtType_disagree;
                    }
                    else
                    {
                        sSignResult = Resources.Approval.lbl_disagree;
                    } break;
                case "bypassed":
                    sSignResult = Resources.Approval.lbl_bypass; break;
                case "skipped":
                    sSignResult = Resources.Approval.lbl_NoApprvl; break;
                case "confirmed":
                    sSignResult = Resources.Approval.lbl_confirmed; break;
                default:
                    sSignResult = " ";
                    break;
            }
            return sSignResult;
        }
        public string replaceCR(string s)
        {
            return s.Replace("\n", "<br>");
        }
        public string getDotCountSpace(string sDotVar)
        {
            string[] aDotCount = sDotVar.Split('.');
            string sDotCount = "";
            for (int i = 0; i < aDotCount.Length - 1; i++)
            {
                if (sDotCount == "")
                {
                    sDotCount += "<font color='white'>-</font>";
                }
                else
                {
                    sDotCount += "";
                }
            }
            return sDotCount + sDotVar.Substring(sDotVar.IndexOf(".") + 1);
        }

        public int getPageValue(int ipPageSize, int ipTotalCount)
        {
            int ipage = ipTotalCount / ipPageSize;
            if ((ipTotalCount % ipPageSize) > 0)
            {
                ipage++;
            }
            if (ipage == 0) ipage = 1;
            return ipage;

        }

        public string HtmlEncode(string s)
        {
            return s.Replace("&quot;", "quot");
        }

        public string setNodeValue(String sText)
        {
            if (sText != "")
            {
                string[] aRecDept = sText.Split(',');
                string sReturn = "";
                for (int i = 0; i < aRecDept.Length; i++)
                {
                    sReturn += "<br>" + aRecDept[i];
                }
                if (sReturn.Length > 4) sReturn = sReturn.Substring(4);
                return sReturn;
            }
            else
            {
                return "";
            }
        }

        public string getNodeValue(XPathNodeIterator oNodeList, string strNodeName)
        {
            try
            {
                System.Xml.XmlDocument oXML = null;

                oNodeList.MoveNext();
                XPathNavigator oNode = oNodeList.Current;

                if (oNode.Value != "")
                {
                    string[] aForm = oNode.Value.Split(';');

                    oXML = new System.Xml.XmlDocument();
                    try
                    {
                        oXML.LoadXml(aForm[0]);
                    }
                    catch (System.Exception ex)
                    {
                        oXML.LoadXml(oNode.Value);
                    }
                    finally
                    {
                    }

                    if (oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo") != null)
                    {
                        if (oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo").Attributes[strNodeName] != null)
                        {
                            return oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo").Attributes[strNodeName].InnerText;
                        }
                        else
                        {
                            return "";
                        }
                    }
                    else { return ""; }
                }
                else
                {
                    return "";
                }
            }
            catch (Exception ex)
            {
                return "";
            }
        }

        public string getPINodeValue(XPathNodeIterator oNodeList, int iIndex)
        {
            oNodeList.MoveNext();
            XPathNavigator oNode = oNodeList.Current;
            if (oNode.Value != "")
            {
                string[] aForm = oNode.Value.Split(';');
                if (aForm.Length > iIndex)
                {
                    return aForm[iIndex];
                }
                else
                {
                    return "";
                }
            }
            else
            {
                return "";
            }
        }

        public string getRgcmtNodeValue(string oNodeList, string strNodeName)
        {
            System.Xml.XmlDocument oXML = null;

            oXML = new System.Xml.XmlDocument();
            oXML.LoadXml(oNodeList);

            return oXML.SelectSingleNode(strNodeName).InnerText;
        }

        public string convertResult(XPathNodeIterator oNodeListKind, XPathNodeIterator oNodeListStatus)
        {
            if (oNodeListKind.Count == 0) return "";

            oNodeListKind.MoveNext();
            XPathNavigator oNodeKind = oNodeListKind.Current;

            oNodeListStatus.MoveNext();
            XPathNavigator oNodeStatus = oNodeListStatus.Current;

            string sKind = oNodeKind.Value;
            string sResult = oNodeStatus.Value;
            string sSignStatus = "";
            switch (sResult)
            {
                case "inactive":
                    sSignStatus = Resources.Approval.lbl_inactive; break;
                case "pending":
                    sSignStatus = Resources.Approval.lbl_inactive; break;
                case "reserved":
                    sSignStatus = Resources.Approval.lbl_hold; break;
                case "completed":
                    if (sKind == "charge")
                    {
                        sSignStatus = Resources.Approval.btn_draft;
                    }
                    else
                    {
                        sSignStatus = Resources.Approval.lbl_app;
                    }
                    break;
                case "rejected":
                    sSignStatus = Resources.Approval.lbl_reject; break;
                case "authorized":
                    sSignStatus = Resources.Approval.lbl_authorize; break;
                case "reviewed":
                    sSignStatus = Resources.Approval.lbl_review; break;
                case "substituted":
                    sSignStatus = Resources.Approval.lbl_substitue; break;
                case "agreed":
                    sSignStatus = Resources.Approval.lbl_consent; break;
                case "disagreed":
                    sSignStatus = Resources.Approval.lbl_disagree; break;
                case "bypassed":
                    sSignStatus = Resources.Approval.lbl_bypass; break;
                case "confidential":
                    sSignStatus = Resources.Approval.lbl_Confidential; break;
                case "conveyance":
                    sSignStatus = Resources.Approval.lbl_forward; break;
                case "skipped":
                    sSignStatus = Resources.Approval.lbl_NoApprvl; break;
                default: sSignStatus = sResult; break;
            }
            return sSignStatus;
        }

        public string getSubKind(string sKind, string swibd1)
        {
            string sSubKind = "";
            if (swibd1 == "ExtType")
            {
                sSubKind = Resources.Approval.lbl_ExtType;
            }
            else
            {
                switch (sKind)
                {
                    case "T000"://결재
                        sSubKind = Resources.Approval.lbl_app; break;
                    case "T001"://시행
                        sSubKind = Resources.Approval.lbl_ITrans; break;
                    case "T002"://시행
                        sSubKind = Resources.Approval.lbl_ITrans; break;
                    case "T003"://직인
                        sSubKind = Resources.Approval.lbl_OfficialSeal; break;
                    case "T004"://협조
                        sSubKind = Resources.Approval.lbl_assist; break;
                    case "T005"://후결
                        sSubKind = Resources.Approval.lbl_review; break;
                    case "T006"://열람
                        sSubKind = Resources.Approval.lbl_reading; break;
                    case "T007":
                        sSubKind = "경유"; break;
                    case "T008"://담당
                        sSubKind = Resources.Approval.lbl_charge; break;
                    case "T009"://합의
                        sSubKind = Resources.Approval.lbl_consent; break;
                    case "T010"://예고
                        sSubKind = Resources.Approval.lbl_doc_pre2; break;
                    case "T011"://담당
                        sSubKind = Resources.Approval.lbl_charge; break;
                    case "T012"://담당
                        sSubKind = Resources.Approval.lbl_charge; break;
                    case "T013"://참조
                        sSubKind = Resources.Approval.lbl_cc; break;
                    case "T014"://통지
                        sSubKind = Resources.Approval.lbl_notice2; break;
                    case "T015"://협조
                        sSubKind = Resources.Approval.lbl_assist; break;
                    case "T016"://감사
                        sSubKind = Resources.Approval.lbl_audit; break;
                    case "T017"://공람
                        sSubKind = Resources.Approval.lbl_audit2; break;
                    case "T018"://감사
                        sSubKind = Resources.Approval.lbl_PublicInspect; break;
                    case "A"://품의함
                        sSubKind = Resources.Approval.lbl_completedBox; break;
                    case "R"://수신
                        sSubKind = Resources.Approval.lbl_receive; break;
                    case "S"://발신
                        sSubKind = Resources.Approval.lbl_send; break;
                    case "E"://접수
                        sSubKind = Resources.Approval.lbl_receive; break;
                    case "REQCMP"://신청처리
                        sSubKind = Resources.Approval.lbl_receive; break;
                    case "P"://발신
                        sSubKind = Resources.Approval.lbl_send; break;
                    case "SP"://열람
                        sSubKind = Resources.Approval.lbl_reading; break;
                    case "C"://합의기안
                    case "AS"://협조기안
                    case "AD"://감사기안
                    case "AE"://준법기안
                        sSubKind = Resources.Approval.btn_redraft; break;
                    default: sSubKind = sKind; break;
                }
            }
            return sSubKind;
        }

        public string getIsPaper(string sIsPaper)
        {
            string sYN = "";
            switch (sIsPaper)
            {
                case "Y":
                    sYN = "서면결재"; break;
                case "N":
                case "":
                default: sYN = ""; break;
            }
            return sYN;
        }

        public string getUrgent(string sPriority)
        {
            string sYN = "";
            switch (sPriority)
            {
                case "1":
                case "2":
                case "3": sYN = ""; break;
                case "4": sYN = "*"; break;
                case "5": sYN = "*"; break;
                default: sYN = sPriority; break;
            }
            return sYN;
        }

        public string getRequestResponse(string sReqResponse)
        {
            string sYN = "";
            switch (sReqResponse)
            {
                case "Y":
                    sYN = "회신요구"; break;
                case "N":
                case "":
                default: sYN = ""; break;
            }
            return sYN;
        }

        public string getKind(string sKind)
        {
            string sSubKind = "";
            switch (sKind)
            {
                case "1"://참조
                    sSubKind = Resources.Approval.lbl_cc; break;
                case "0"://수신
                    sSubKind = Resources.Approval.lbl_receive; break;
                case "2":
                    sSubKind = Resources.Approval.btn_Circulate; break;
                default: sSubKind = sKind; break;
            }
            return sSubKind;
        }
        public string getPfsk(string sKind)
        {
            string sSubPfsk = "";
            switch (sKind)
            {
                case "1"://참조
                    sSubPfsk = "T014"; break;
                case "0"://수신
                    sSubPfsk = "T015"; break;
                case "2"://회람
                    sSubPfsk = "T006"; break;
                default: sSubPfsk = sKind; break;
            }
            return sSubPfsk;
        }
    }
}
