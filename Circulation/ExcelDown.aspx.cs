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

public partial class COVIFlowNet_Circulation_ExcelDown : PageBase
{
    public string userid;
    public string pagerow;
    public string strMode;
    public int showpagerow = 20;
    public string strOption;
    public string strSend_id;
    public System.Xml.XmlDocument objXml = new System.Xml.XmlDocument();

    protected void Page_Load(object sender, EventArgs e)
    {
        if(Request.QueryString["userid"].ToString() != "")
            userid = Request.QueryString["userid"].ToString();  
     
        if(Request.QueryString["pagerow"] != "")
            pagerow = Request.QueryString["pagerow"].ToString().Trim();
        
        if(Request.QueryString["mode"] != "") 
            strMode = Request.QueryString["mode"].ToString().Trim();
        
        if(Request.QueryString["option"] != "")
            strOption = Request.QueryString["option"].ToString().Trim();
        
        if(Request.QueryString["send_id"] != "")
            strSend_id = Request.QueryString["send_id"].ToString().Trim();
        
        MakeXml();
    }

    private void MakeXml()
    {
        switch(strOption)
        {
            case "all":
                strOption = "";
                break;
            case "noreceipt":
                strOption = " AND RECEIPT_STATE='N' ";
                break;
            case "receipt":
                strOption = " AND RECEIPT_STATE='Y' ";
                break;
            default:
                strOption = "";
                break;
        }

        AccepData _accep = new AccepData();

        try
        {
            objXml = _accep.SelectDataList(strMode, Convert.ToInt32(pagerow), showpagerow, userid, strSend_id, strOption);
            ReturnXml();
        }
        catch(Exception ex)
        {
            throw new System.Exception(null, ex);
        }
    }

    private void ReturnXml()
    {
        string myfilename;
        myfilename = userid + "_" + DateTime.Now.ToString("hhmmss") + ".csv";
        try
        {
            Response.AddHeader("Content-Disposition", "attachment;filename=" + myfilename);
            Response.ContentType = "application/vnd.ms-excel";
            //'Response.ContentType = "Application/UnKnown"


            System.IO.StreamWriter sw = new System.IO.StreamWriter(Response.OutputStream, System.Text.Encoding.Default);
            System.Xml.XmlNodeList DataList;
            if (strMode == "send_list")
            {
                sw.WriteLine("발신일,양식,제목");
                DataList = objXml.SelectNodes("//send_list");
                for(int i=0; i<=DataList.Count - 1; i++)
                {
                    sw.WriteLine(DataList.Item(i).SelectSingleNode("SEND_DATE").InnerText + "," + DataList.Item(i).SelectSingleNode("FORM_NAME").InnerText + "," + DataList.Item(i).SelectSingleNode("SUBJECT").InnerText);
                }
            }
            else if (strMode == "request_list") 
            {
                sw.WriteLine("발신일,발신자,양식,제목,수신일");
                DataList = objXml.SelectNodes("//request_list");
                for (int i = 0; i <= DataList.Count - 1; i++)
                {
                    sw.WriteLine(DataList.Item(i).SelectSingleNode("SEND_DATE").InnerText + "," + DataList.Item(i).SelectSingleNode("SENDER_NAME").InnerText + "," + DataList.Item(i).SelectSingleNode("FORM_NAME").InnerText + "," + DataList.Item(i).SelectSingleNode("SUBJECT").InnerText + "," + DataList.Item(i).SelectSingleNode("RECEIPT_DATE").InnerText);
                }
            }
            sw.Flush();
        }
        catch(Exception ex)
        {
            throw new System.Exception(null, ex);
        }
    }
}
