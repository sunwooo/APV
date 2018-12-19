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

public partial class Approval_Portal_mailtest : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		System.Net.Mail.MailAddress from = new System.Net.Mail.MailAddress("shpark@workplace.com", "박상훈");
		//, System.Text.Encoding.UTF8);
		string to = "shpark@workplace.com;박상훈|sunnyhwang@workplace.com";
		string cc= "sunnyhwang@workplace.com";
		string bcc = "shpark@workplace.com;박상훈|sunnyhwang@workplace.com;황선희";

		string xml = "<?xml version='1.0' encoding='euc-kr'?><MAIL><TITLE><![CDATA[일정등록]]></TITLE><CONTENT><![CDATA[" + "TEST" + "]]></CONTENT><CONTENT><![CDATA[" + "TEST2" + "]]></CONTENT><CONTENT><![CDATA[빠른 확인 부탁드립니다.]]></CONTENT><URL><![CDATA[" + System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString() + "/BaseService/Schedule/SC_Schedule.aspx]]></URL></MAIL>";
        string xsl = "";
        string url = System.Configuration.ConfigurationSettings.AppSettings["SMTPRelayUrl"].ToString();
        string subject = "test";

        //bool MailResult = Covision.Framework.Core.SendMailAgent.SendHTTP(url, from, fromname, to, subject, xml, xsl);

		bool MailResult = COVIFlowCom.Common.SendHTTP(url, from, to, cc, bcc, subject, xml, xsl);
	}
}
