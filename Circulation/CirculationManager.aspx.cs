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
using System.IO;
using System.Xml;


public partial class COVIFlowNet_Circulation_CirculationManager : PageBase
{
    //private string strLangID;


    protected void Page_Load(object sender, EventArgs e)
    {
        //if (!IsPostBack)
        //{
        //    /* �ٱ���ó�� 06/08/23 ����ȣ */
        //    strLangID = Session["user_language"].ToString();
        //    //�ٱ��� ����
        //    string culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";

        //    Page.UICulture = strLangID;
        //    Page.Culture = strLangID;

        //}

        Title = "����/����/ȸ��";
    }
}
