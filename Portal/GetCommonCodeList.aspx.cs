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
using System.Xml;

/// <summary>
/// 공통코드집에서 해당 코드 내역 조회
/// xmlhttp post 내역으로 받아서 처리함
/// </summary>
/// <example>
/// ///    var CD1 = "A01";//그룹코드
///    var CD2 = "EA";//업무코드
///    var sPostBody = "<Items><CD1>"+CD1+"</CD1><CD2><![CDATA[" + CD2 + "]]></CD2></Items>" ;
///    var sTargetURL = "../Portal/getCommonCodeList.aspx";
///	requestHTTP((sPostBody==null?"GET":"POST"),sTargetURL,false,"text/xml",receiveCODEQuery,sPostBody);
///  
///		var xmlReturn=m_xmlHTTP.responseXML;
///		    var elmlist = xmlReturn.selectNodes("response/NewDataSet/COMMONCODE");
///		    var elm;
///		    for(var i=0 ; i < elmlist.length ; i++){
///		        elm = elmlist.nextNode();
///             var oOption = document.createElement("option");
///                SEL_VACATION_CODE.options.add(oOption);
///                oOption.text=elm.selectSingleNode("NM_CODE").text;
///                oOption.value=elm.selectSingleNode("CD_CODE").text;	
///		    }
/// 
/// </example>
public partial class Approval_Portal_GetCommonCodeList : PageBase //PageBase
{
    /// <summary>
    /// 코드 조회 함수 호출
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");

        try
        {
            pSetData();
        }
        catch (Exception ex)
        {
            pHandleException(ex);
        }
        finally
        {
            Response.Write("</response>");
        }
    }

    /// <summary>
    /// Request Stream 내역을 XML로 변환
    /// 공통코드 조회
    /// 조회 결과 Response에 XML 형태로 출력
    /// </summary>
    private void pSetData()
    {
        XmlDocument oXML = null;
        DataSet ds = new DataSet();
        System.Data.DataTable dt = null;
        try
        {
            oXML = new XmlDocument();
            oXML = pParseRequestBytes();
            dt = this.GetCodeTable(oXML.SelectSingleNode("Items/CD1").InnerText, oXML.SelectSingleNode("Items/CD2").InnerText);
            ds.Tables.Add(dt);
            Response.Write(ds.GetXml());

           }
        catch (Exception e)
        {
            throw e;
        }
        finally
        {
            if (dt != null)
            {
                dt.Dispose();
                dt = null;
            }
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
        }
    }

    /// <summary>
    /// Request Stream 내역을 XML로 변환
    /// </summary>
    /// <returns></returns>
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
            throw e;
        }
    }

    /// <summary>
    /// 에러 메시지 출력
    /// </summary>
    /// <param name="ex">Exception 객체</param>
    private void pHandleException(Exception ex)
    {
        try
        {
            Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ParseStackTrace(ex) + "]]></error>");
        }
        catch (Exception e)
        {
            Response.Write("<error><![CDATA[" + e.InnerException.Message + "]]></error>");
        }
    }

   }
