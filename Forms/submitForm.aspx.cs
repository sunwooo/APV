using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml;

/// <summary>
/// 기안/결재 처리 페이지 
/// </summary>
public partial class COVIFlowNet_Forms_submitForm : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
        try
        {
            pProcessForm();
        }
        catch (System.Exception Ex)
        {
            HandleException(Ex);
        }
        finally
        {
            Response.Write("</response>");
        }
    }

    /// <summary>
    /// Process Instance 생성(폼 및 결재 정보 저장)(#1)
    /// 주의사항 : 트랜잭션 문제 해결 되면 submitForm.aspx 파일 내 Transaction="Required"  지시문 추가할 것
    /// </summary>
    private void pProcessForm()
    {
		//{
		//이준희(2011-01-20): 
		int i = 0;
		string sTmp = string.Empty, sXml = string.Empty;
		StringBuilder sb = null;
		XmlNode nd = null;
		XmlNodeList nds = null;
		MatchCollection mcol = null;
		//}
        try
        {
            System.Xml.XmlDocument oFormXMLDOM;
            oFormXMLDOM = pParseRequestBytes();

            System.String strIssueDocNO = COVIFlowCom.processRegisterDocNo.processRegisterDocNop(oFormXMLDOM);
            System.Xml.XmlElement elmRoot = oFormXMLDOM.DocumentElement;

            System.String sMode = COVIFlowCom.Common.GetProp(elmRoot, "mode", false);
            System.String sIsLast = COVIFlowCom.processWebservice.IsLast(oFormXMLDOM); //웹서비스 호출

            if (sIsLast != "ok")
            {
                System.Xml.XmlDocument oBodyRoot = new System.Xml.XmlDocument();
                oBodyRoot.LoadXml(oFormXMLDOM.DocumentElement.SelectSingleNode("formdata/BODY_CONTEXT").InnerText);

                oBodyRoot.SelectSingleNode("BODY_CONTEXT/SEQ").InnerText = sIsLast;

                oFormXMLDOM.DocumentElement.SelectSingleNode("formdata/BODY_CONTEXT").InnerText = oBodyRoot.InnerXml;


                //oFormXMLDOM.DocumentElement.SelectSingleNode("BODY_CONTEXT/SEQ").InnerText = sIsLast;

            }

            if (strIssueDocNO != "") //문서번호 발번 후 forminfoext 변환 
            {
                
                if (sMode == "REDRAFT" || sMode == "SUBREDRAFT") //'외부공문접수 및 재기안시 접수번호 부여
                {
                    oFormXMLDOM.DocumentElement.SelectSingleNode("formdata/DOC_NO").InnerText = strIssueDocNO;
                    oFormXMLDOM.DocumentElement.SelectSingleNode("forminfoext/forminfo/docinfo/docno").InnerText = strIssueDocNO;
                }
                else
                {
                    oFormXMLDOM.DocumentElement.SelectSingleNode("formdata/DOC_NO").InnerText = strIssueDocNO;
                    oFormXMLDOM.DocumentElement.SelectSingleNode("forminfoext/forminfo/docinfo/docno").InnerText = strIssueDocNO;
                }
            }
            COVIFlowCom.processFormData.processFormDatap(oFormXMLDOM);
            if (oFormXMLDOM.DocumentElement.SelectSingleNode("pdef").InnerText != "")
            {
                COVIFlowCom.processWorkflowData.ProcessWfData(oFormXMLDOM);
            }
			//{//이준희(2011-01-20): Added to support SharePoint environment.
			//if(base.bgCEPSIn && sMode.IndexOf("DRAFT") > -1 && oFormXMLDOM.SelectSingleNode("request/formdata/BODY_CONTEXT/CEPSUriIte") != null)//mcol = Regex.Matches(sTmp, "person code" + Regex.Escape("=\"") + "[^" + Regex.Escape("\"") + @"]*\.[^" + Regex.Escape("\".") + "]*" + Regex.Escape("\""));
			//sXml = oFormXMLDOM.SelectSingleNode("request/formdata/BODY_CONTEXT").InnerXml;
			if(base.bgCEPSIn && sMode.IndexOf("DRAFT") > -1 && oFormXMLDOM.InnerXml.IndexOf("&lt;CEPSUriIte&gt;") > -1)
			{
				nd = oFormXMLDOM.SelectSingleNode("request/apvlist");
				sTmp = nd.InnerXml;//nds = nd.SelectNodes("*/");//<person code=\"
				mcol = Regex.Matches(sTmp, "person code" + Regex.Escape("=\"") + "[^" + Regex.Escape("\"") + @"]*[^" + Regex.Escape("\".") + "]*" + Regex.Escape("\""));
				//sTmp = string.Empty;
				sb = new StringBuilder();
				for(i = 0; i < mcol.Count; i++)
				{
					try
					{//sTmp += mcol[i].Groups[0].Value + "|";
						sb.Append(mcol[i].Groups[0].Value.Replace("person code=\"", "").Replace("\"", "")).Append("|");
					}
					catch(Exception exMcol)
					{
					}
				}
				mcol = Regex.Matches(sTmp, "ou code" + Regex.Escape("=\"") + "[^" + Regex.Escape("\"") + @"]*[^" + Regex.Escape("\".") + "]*" + Regex.Escape("\""));
				for(i = 0; i < mcol.Count; i++)
				{
					try
					{
						sb.Append(mcol[i].Groups[0].Value.Replace("ou code=\"", "").Replace("\"", "")).Append("|");
					}
					catch(Exception exMcol)
					{
					}
				}

				nd = oFormXMLDOM.SelectSingleNode("request/formdata/BODY_CONTEXT");
				sTmp = nd.InnerXml.Replace("&lt;", "<").Replace("&gt;", ">");
				oFormXMLDOM.LoadXml(sTmp);
				nd = oFormXMLDOM.SelectSingleNode("BODY_CONTEXT/CEPSUriIte");
				sTmp = nd.InnerXml;
				base.lbg.bgUriPem(sTmp, sb.ToString());
			}
			//}
            oFormXMLDOM = null;
            Response.Write("<docno>" + strIssueDocNO + "</docno>");
            Response.Write("<success>" + Server.HtmlEncode(DateTime.Now.ToString()) + "</success>");
            System.EnterpriseServices.ContextUtil.SetComplete(); //반드시 다시 살릴 것
        }
        catch (System.Exception Ex)
        {
            System.EnterpriseServices.ContextUtil.SetAbort(); //반드시 다시 살릴 것
            throw new System.Exception("ProcessForm", Ex);
        }
		finally
		{
			sb = null;
			nd = null;
			mcol = null;
		}
    }

    private System.Xml.XmlDocument pParseRequestBytes()
    {
        System.Byte[] aBytes = Request.BinaryRead(Request.TotalBytes);
        try
        {
            System.Xml.XmlDocument oXMLData = new System.Xml.XmlDocument();
            System.Text.Decoder oDecoder = System.Text.Encoding.UTF8.GetDecoder();
            //aBytes = Request.BinaryRead(Request.TotalBytes);
            //Dim aChars(oDecoder.GetCharCount(aBytes, 0, aBytes.Length)) As System.Char;
            System.Char[] aChars = new Char[oDecoder.GetCharCount(aBytes, 0, aBytes.Length)];
            oDecoder.GetChars(aBytes, 0, aBytes.Length, aChars, 0);
            oXMLData.Load(new System.IO.StringReader(new String(aChars)));
            return oXMLData;
        }
        catch (System.Exception Ex)
        {
            throw new Exception("pParseRequestBytes", Ex);
        }
    }

    /// <summary>
    /// 초기화 (#1-1)
    /// </summary>
    private void Initialize()
    {
        try
        {
        }
        catch (System.Exception Ex)
        {
            throw new System.Exception(null, Ex);
        }
    }

    private void HandleException(System.Exception _Ex)
    {
        try
        {
            var msg = "<error><![CDATA[" + (_Ex.InnerException.InnerException.Message) + "]]></error>";
            //var msg = "<error><![CDATA[" + _Ex.InnerException.InnerException.Message + "]]></error>";
            //Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)) + "]]></error>"); // 중복결재 메시지 수정위해 주석20150918

            Response.Write(msg); // 중복결재 메시지수정 20150918
            //Response.Write("<error><![CDATA[" + _Ex.Message + "]]></error>");
            //throw new Exception(Resources.Approval.msg_084.ToString());

        }
        catch (System.Exception Ex)
        {
            Response.Write("<error><![CDATA[" + Ex.Message + "]]></error>");
        }
    }
}
