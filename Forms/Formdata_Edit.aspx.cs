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

public partial class COVIFlowNet_Forms_Formdata_Edit : PageBase
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
            Response.Write("<error>"+Ex.InnerException.Message+"</error>");
        }
        finally
        {
            Response.Write("</response>");
        }
    }
     private void pProcessForm()
    {
        System.Xml.XmlDocument oFormXMLDOM = null;
        try
        {
            oFormXMLDOM = pParseRequestBytes();

            COVIFlowCom.processFormData.processFormDatap(oFormXMLDOM);


        }
        catch (System.Exception Ex)
        {
            System.EnterpriseServices.ContextUtil.SetAbort();
            throw new System.Exception("ProcessForm", Ex);
        }
        finally
        {
            if (oFormXMLDOM != null)
            {
                oFormXMLDOM = null;
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
            throw new Exception("pParseRequestBytes", Ex);
        }
    }

}
