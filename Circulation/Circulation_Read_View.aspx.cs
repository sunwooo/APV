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
using System.Text;

/// <summary>
/// 회람 수신현황 목록
/// </summary>
public partial class COVIFlowNet_Circulation_Circulation_Read_View : PageBase
{
	public string strForm_Inst_Id, strCommentView, strLangIndex;

    /// <summary>
    /// 다국어설정
    /// 파리미터 설정
    /// 회람 수신현황 조회 함수 호출
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        string culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

		Title = Resources.Approval.lbl_Circulation_View;
        strForm_Inst_Id = Request.QueryString["form_inst_id"];
        Circulation_View();
    }

    /// <summary>
    /// 회람수신현황 조회
    /// </summary>
    public void Circulation_View()
    {
        StringBuilder sbComment = null;
        AccepData accData = new AccepData();
        
        DataSet ds = null;
        DataRowCollection colDR = null;
        try
        {
            //string strComment;
            ds = new DataSet();
            ds = accData.GetReadView(strForm_Inst_Id, Session["user_ent_code"].ToString());
            colDR = ds.Tables[0].Rows;
            sbComment = new StringBuilder();
            foreach (DataRow DR in colDR)
            {

                sbComment.Append(" <tr style='height:20px;'>");
                sbComment.Append(" <td width='35%' style='padding-left:5px;'>");
				sbComment.Append(COVIFlowCom.Common.getLngLabel(strLangIndex, DR["RECEIPT_OU_NAME"].ToString(),false)).Append("</td> ");
                sbComment.Append(" <td width='35%'>");
				sbComment.Append(COVIFlowCom.Common.getLngLabel(strLangIndex, DR["RECEIPT_NAME"].ToString(), false)).Append("</td> ");
                sbComment.Append(" <td  width='30%'>");
                if (DR["READ_DATE"].ToString() != "")
                {
                    sbComment.Append(Convert.ToDateTime(DR["READ_DATE"]).ToString("yyyy-MM-dd HH:mm:sss"));
                }
                sbComment.Append(" </td></tr>");
                sbComment.Append(" <tr><td height='1' colspan='3' align='center' class='table_line'></td></tr>");
            }
            strCommentView = sbComment.ToString();
        }
        catch (Exception ex) { }
        finally
        {
            if (accData != null)
            {
                accData = null;
            }
            if (sbComment != null) sbComment = null;
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
            if (colDR != null)
            {
                colDR = null;
            }
        }

    }
}
