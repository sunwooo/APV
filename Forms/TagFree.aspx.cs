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




    public partial class COVIFlowNet_Forms_TagFree : PageBase
    {
        //public XmlDocument sXml;

        //protected void Page_Load(object sender, EventArgs e)
        //{
        //    Response.ContentType = "text/xml";

        //    string sMIMEData;
        //    string mdomain;

        //    TWEMIMELib.MimeUtilClass util = new TWEMIMELib.MimeUtilClass();

        //    try
        //    {
        //        sXml = new xmlDocument();
        //        sXml.Load(Request.InputStream);

        //        sMIMEData = sXml.SelectSingleNode("//mime").InnerText;
        //        mdomain = sXml.SelectSingleNode("//domain").InnerText;

        //        //업로드할 경로

        //        string uploadPath = "D:\\COVINetPortal\\COVINet\\COVIFlowNet\\Forms\\ImageUpload\\";
        //        util.ProcessDecoding(sMIMEData, uploadPath, mdomain + "/CoviNet/COVIFlowNet/Forms/ImageUpload", 1);


        //        string bodyHTML = util.DecodedHTML;

        //        Response.Write("<htmldata><![CDATA[" + bodyHTML + "]]></htmldata>");

        //    }
        //    catch (Exception ex)
        //    {
        //        Response.Write("<?xml version='1.0' encoding='utf-8'?><response><error><![CDATA[" + ex.Message + "<br>" + ex.StackTrace + "]]></error></response>");
        //    }

        //}
    }

