using System;
using System.Text;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml;

/// <summary>
/// 회람내역(발신/수신) 삭제
/// </summary>
public partial class COVIFlowNet_Circulation_DelMail : PageBase
{
    /// <summary>
    /// Request Stream xml 처리
    /// 회람 삭제 함수 호출
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        XmlDocument objXml = this.RequestXml();

        try
        {            
            Response.Write("<?xml version='1.0'?><response>" + this.DeleteProcess(objXml) + "</response>");
        }
        catch(Exception ex)
        {
            Response.Write("<?xml version='1.0' ?><response>" + ex.Message + "</response>");
        } 
        finally
        {
            objXml = null;
        }
    }

    /// <summary>
    /// 삭제요청 처리
    /// </summary>
    /// <param name="objXml">삭제요청 내역</param>
    /// <returns></returns>
    private string DeleteProcess(XmlDocument objXml)
    {
        StringBuilder sbSQL = null;
        AccepData acceptData = new AccepData(); 
       
        XmlNodeList recNodes = null;
        XmlNodeList sendNodes = null;

        string sFormInstID;
        string sProcessId;
        string sReceiptID;

        try
        {
            sbSQL = new StringBuilder();
            //회람 수신내역 삭제
            if (objXml.SelectSingleNode("REQUEST/MODE") != null)
            {
                sFormInstID = objXml.SelectSingleNode("REQUEST/FORM_INST_ID").InnerText;
                string sDivision = objXml.SelectSingleNode("REQUEST/DIVISION").InnerText;

                sbSQL.Append(" DELETE WF_CIRCULATION_RECEIPT");
                sbSQL.Append(" WHERE FORM_INST_ID='").Append(sFormInstID).Append("'");
                sbSQL.Append(" AND KIND IN ('0','1') ");
                sbSQL.Append(" AND ( DIVISION ='").Append(sDivision).Append("' OR DIVISION IS NULL) ");
            }
                //회람 발신 내역삭제
            else
            {
                recNodes = objXml.SelectNodes("REQUEST/RECEIPT_DEL/DEL_ITEM");

                foreach (XmlNode node in recNodes)
                {
                    sFormInstID = node.SelectSingleNode("FORM_INST_ID").InnerText;
                    sReceiptID = node.SelectSingleNode("RECEIPT_ID").InnerText;

                    sbSQL.Append(" DELETE WF_CIRCULATION_RECEIPT");
                    sbSQL.Append(" WHERE FORM_INST_ID='").Append(sFormInstID).Append("'");
                    sbSQL.Append(" AND RECEIPT_ID='").Append(sReceiptID).Append("'");
                    //회람부서 삭제 추가
                    try
                    {
                        if (sReceiptID == "" && node.SelectSingleNode("RECEIPT_OU_ID") != null)
                        {
                            sbSQL.Append(" AND RECEIPT_OU_ID='").Append(node.SelectSingleNode("RECEIPT_OU_ID").InnerText).Append("'");
                        }
                    }
                    catch (System.Exception ex)
                    {
                        throw new System.Exception(null, ex.InnerException);
                    }
                }

                sendNodes = objXml.SelectNodes("REQUEST/SEND_DEL/DEL_ITEM");

                foreach (XmlNode node in sendNodes)
                {
                    sFormInstID = node.SelectSingleNode("FORM_INST_ID").InnerText;
                    sProcessId = node.SelectSingleNode("PROCESS_ID").InnerText;

                    sbSQL.Append(" DELETE WF_CIRCULATION_SEND");
                    sbSQL.Append(" WHERE FORM_INST_ID='").Append(sFormInstID).Append("'");
                    sbSQL.Append(" AND PROCESS_ID='").Append(sProcessId).Append("'");
                }
            }
            acceptData.DeleteData(sbSQL.ToString());

            return "OK";
        }
        catch(Exception ex)
        {
            throw new Exception(sbSQL.ToString()+ex.InnerException.Message);
        }
        finally
        {
            if (sbSQL != null) sbSQL = null;
            if (acceptData != null) acceptData = null;
            if (recNodes != null) recNodes = null;
            if (sendNodes != null) sendNodes = null;
        }
    }

    /// <summary>
    /// Request Stream Xml 변환
    /// </summary>
    /// <returns></returns>
    private XmlDocument RequestXml()
    {
        XmlDocument objXml = new XmlDocument(); 

        try
        {            
            objXml.Load(Request.InputStream);

            return objXml;
        }
        catch(Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
}
