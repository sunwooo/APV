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

/// <summary>
/// 상단에 결재하기 버튼이 display될 경우의 결재에서 결재의견 입력 페이지
/// </summary>
public partial class COVIFlowNet_Comment_comment_apv : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {

        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");

        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        AccepData accData = new AccepData();
        System.Xml.XmlDocument oXML = null;
        try
        {
            oXML = new System.Xml.XmlDocument();
            oXML = pParseRequestBytes();
            System.Xml.XmlNode oItem = oXML.SelectSingleNode("request");
            string strCall = oItem.SelectSingleNode("call").InnerText;
            string strFormId = oItem.SelectSingleNode("fiid").InnerText;            
            string strUserId = oItem.SelectSingleNode("userid").InnerText;
            string strUserNAme = oItem.SelectSingleNode("username").InnerText;
            string strKind = oItem.SelectSingleNode("kind").InnerText;
            string strMode = oItem.SelectSingleNode("mode").InnerText;
            string strComment = oItem.SelectSingleNode("comment").InnerText;

            Comment comData = new Comment();
            string strGubun;
            if (strMode == "COMPLETE") strGubun = "Y";
            else strGubun = "N";
            Boolean bResult = false;

            //조용욱(2010-10-28): InkComment Save_path 입력
            string strSave_path = oItem.SelectSingleNode("save_path").InnerText;

            //if ((strCall == "d") || ((strComment == "") && (strGubun == "N")))
            if (strCall == "d")
            {
                bResult = comData.DeleteCommentData(strFormId, strUserId);
                if (bResult == true) Response.Write("<message>의견이 삭제 되었습니다.</message>");
                //else Response.Write("<message>삭제 할 의견이 없습니다.</message>");
            }
            else
            {
                if ((strComment != "") || (strSave_path != ""))
                {
                    bResult = comData.InsertCommentData(strFormId, strUserId, strUserNAme, strKind, strGubun, strComment, strSave_path);
                    //if (bResult == true) Response.Write("<message>의견이 저장되었습니다.</message>");
                }
                else
                {
                    //Response.Write("<message>의견을 작성하세요.</message>");
                }
            }
        }
        catch (System.Exception ex)
        {
            //Response.Write("<error>" + Server.HtmlEncode(COVIFlowCom.ErrResult.ParseStackTrace(ex)) + "</error>");
        }
        finally
        {
            if (oXML != null) oXML = null;
            Response.Write("</response>");
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
}
