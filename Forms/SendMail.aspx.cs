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
using System.Text;
using Covision.Framework;
using Covision.Framework.Data.Business;

/// <summary>
/// 대외공문 문서발송 메일 보내기
/// </summary>
public partial class Approval_Forms_SendMail : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        XmlDocument xmlDoc = new XmlDocument();
        xmlDoc.Load(Request.InputStream);

        string sReceiver = xmlDoc.DocumentElement.SelectNodes("/MAIL/RECEIVER").Item(0).InnerText;
        string sTitle = xmlDoc.DocumentElement.SelectNodes("/MAIL/TITLE").Item(0).InnerText;
        string sSubject = xmlDoc.DocumentElement.SelectNodes("/MAIL/SUBJECT").Item(0).InnerText;
        string sContent = xmlDoc.DocumentElement.SelectNodes("/MAIL/CONTENT").Item(0).InnerText;

        string url = System.Configuration.ConfigurationSettings.AppSettings["SMTPRelayUrl"].ToString();
        System.Net.Mail.MailAddress from = new System.Net.Mail.MailAddress(Sessions.USER_EMAIL.ToString(), Sessions.USER_DISPLAY_MAIL_SENDER_NAME.ToString());

        string[] sReceivers = sReceiver.Split(';');
        bool MailResult = false;
        for (int i = 0; i < sReceivers.Length; i++)
        {
            string to = sReceivers[i].ToString();
            MailResult = Covision.Framework.Core.SendMailAgent.SendSMTP(url, from, to, sSubject, sContent);

            if (!MailResult)
                break;
            //bool MailResult = Covision.Framework.Core.SendMailAgent.SendHTTP(url, from, to, "", "", sSubject, sbXml.ToString(), null);
        }

        if (!MailResult)
            Response.Write("<error><![CDATA[" + "메일전송이 실패하였습니다." + "]]></error>");
        else
            Response.Write(MailResult);
    }
}
