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
using System.Runtime.InteropServices;


using Covision.Framework;
using Covision.Framework.Data.Business;

// <summary>
// 시  스  템 : 종합정보시스템
// 단위시스템 : Workflow
// 프로그램명 : 전자결재 결재암호확인
// 모  듈  명 : 결재 R
// 파  일  명 : getProcessBizData.aspx
// 설      명 : 결재 R
// </summary>
// <history>
// CH00 2003/03/24 황선희 : 최초 작성
// </history>
public partial class COVIFlowNet_ApvProcess_getProcessBizData : PageBase
{
    /// <summary>
    /// 결재암호 확인
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

        DataSet ds = null;
        System.Xml.XmlDocument oFormXMLDOM = null;
        DataPack INPUT = null;
        try
        {
            oFormXMLDOM = pParseRequestBytes();
            System.Xml.XmlElement elmRoot = oFormXMLDOM.DocumentElement;
            oFormXMLDOM = null;

            ds = new DataSet();
            INPUT = new DataPack();

            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                INPUT.add("@vc_PERSON_CODE", elmRoot.SelectSingleNode("usid").InnerText);
                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "usp_WF_CK_APPROVAL_PWD", INPUT);
            }


            string sDBPWD = ds.Tables[0].Rows[0][0].ToString();
            string sInputPWD = COVIFlowCom.Common.GetProp(elmRoot, "actpwd", true);
            if (sDBPWD == "" && sInputPWD == "")
            {
                Response.Write("ok");
            }
            else
            {
                sInputPWD = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(COVIFlowCom.Common.GetProp(elmRoot, "actpwd", true), "MD5");
                if (sDBPWD == sInputPWD)
                {
                    Response.Write("ok");
                }
                else
                {
                    throw new System.Exception(Resources.Approval.msg_102);
                }
            }

        }
        catch(System.Exception Ex)
        {
            HandleException(Ex);
        }
        finally
        {
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }

            if (oFormXMLDOM != null)
            {
                oFormXMLDOM = null;
            }
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
            Response.Write("</response>");
        }
    }
   
    /// <summary>
    /// Request Stream 객체 xmlDocument로 변환
    /// </summary>
    /// <returns></returns>
    private System.Xml.XmlDocument pParseRequestBytes()
    {
        System.Byte[] aBytes = Request.BinaryRead(Request.TotalBytes);
        System.Xml.XmlDocument oXMLData = null;
        try
        {
            oXMLData = new System.Xml.XmlDocument();
            System.Text.Decoder oDecoder = System.Text.Encoding.UTF8.GetDecoder();

            System.Char[] aChars = new char[oDecoder.GetCharCount(aBytes, 0, aBytes.Length)];

            oDecoder.GetChars(aBytes, 0, aBytes.Length, aChars, 0);
            oXMLData.Load(new System.IO.StringReader(new String(aChars)));
            return oXMLData;
        }
        catch (Exception Ex)
        {
            throw new System.Exception("Requested Bytes Count=" + aBytes.Length, Ex);
        }
        finally
        {
            if (oXMLData != null)
            {
                oXMLData = null;
            }
        }
    }

    /// <summary>
    /// 에러메시지 출력
    /// </summary>
    /// <param name="_Ex">Exception 객체</param>
    private void HandleException(System.Exception _Ex)
    {       
        try
        {
            Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)) + "]]></error>");
            
        }
        catch (Exception Ex)
        {
            Response.Write("<error><![CDATA[" + Ex.Message + "]]></error>");
        }
    }
}
