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



public partial class COVIFlowNet_Forms_doSaveBody : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
        System.Xml.XmlDocument oFormXMLDOM;
        try
        {
            oFormXMLDOM = pParseRequestBytes();

            //pBindData(oFormXMLDOM.DocumentElement);
            COVIFlowCom.processFormData.processFormDatap(oFormXMLDOM);
            Response.Write("<success>" + Server.HtmlEncode(DateTime.Now.ToString()) + "</success>");
        }
        catch (System.Exception ex)
        {
            HandleException(ex);
        }
        Response.Write("</response>");
        Response.End();
    }

    private void pBindData(System.Xml.XmlElement elmRoot)
    {
        string strMode; //strFormID, 
        CfnFormManager.WfFormManager oFormDBMgr = new CfnFormManager.WfFormManager();   

        System.Xml.XmlNode elmFormData = null;
        System.Collections.Hashtable oFields = null;
        try
        {
            elmFormData = elmRoot.SelectSingleNode("formdata");
            if(elmFormData != null)
            {                
                strMode = COVIFlowCom.Common.GetProp(elmRoot, "mode", true).ToUpper();

                //추가 필드 넣기 ( 입력 대상 필드, 수정시 수정된 필드만 넘김)               
                oFields = new System.Collections.Hashtable();
                System.Xml.XmlElement oFormNode = null;

                foreach (System.Xml.XmlNode oFormNode2 in elmFormData)
                {
                    oFields.Add(oFormNode2.Name.ToUpper(), oFormNode2.InnerText);
                } 

                if(oFields.Count > 0) //수정사항 존재할 경우
                {                                  
                    CfnFormManager.WfFormInstance oFormInfo = new CfnFormManager.WfFormInstance(
                        COVIFlowCom.Common.GetProp(elmRoot, "fiid", true),
                        COVIFlowCom.Common.GetProp(elmRoot, "fmnm", true),
                        COVIFlowCom.Common.GetProp(elmRoot, "fmpf", true),
                        int.Parse(COVIFlowCom.Common.GetProp(elmRoot, "fmrv", true))
                    );

                    oFormInfo.Fields = oFields;

                    oFormDBMgr.UpdateEntity(oFormInfo, COVIFlowCom.Common.GetProp(oFormNode, "LAST_MODIFIER_ID", true), false);

                    System.EnterpriseServices.ServicedComponent.DisposeObject(oFormDBMgr);
                    oFormDBMgr = null;
                }
            }
        }
        catch(System.Exception Ex)
        {
            throw new System.Exception(null, Ex);
        }
        finally
        {
            if (oFormDBMgr != null)
            {
                System.EnterpriseServices.ServicedComponent.DisposeObject(oFormDBMgr);
                oFormDBMgr = null;
            }
            if (elmFormData != null)
            {
                elmFormData = null;
            }
            if (oFields != null)
            {
                oFields = null;
            }
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
        catch(System.Exception Ex)
        {           
            throw new Exception("Requested Bytes Count=" + aBytes.Length, Ex);
        }
    }

    private void HandleException(System.Exception _Ex)
    {
        try
        {
            Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)) + "]]></error>");
        }
        catch(System.Exception Ex)
        {
            Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(Ex)) + "]]></error>");
        }
    }
}
