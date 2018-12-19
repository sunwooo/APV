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
using Covision.Framework;
using Covision.Framework.Data.Business;

public partial class Approval_Forms_formmenu_mini_diffCopy : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string strDiffForm = "";
    //public string intUserForm = "0";
    protected void Page_Load(object sender, EventArgs e)
    {
        //다국어 언어설정
        string culturecode = strLangID;
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        DataSet ds = null;
        DataPack INPUT = null;
        SqlDacBase SqlDbAgent = null;
        System.Text.StringBuilder sb = null;
        //string strQuery = "dbo.usp_wfform_favorformlist";
        string strQuery = "usp_wfform_formlistquery01";
        //INPUT.add("@usid", Session["user_code"].ToString());
        
        try
        {
            ds = new DataSet();
            INPUT = new DataPack();
            SqlDbAgent = new SqlDacBase();
            sb = new System.Text.StringBuilder();

            INPUT.add("@ent_code", Session["user_ent_code"].ToString());
            INPUT.add("@viewall", "");
            INPUT.add("@language", Session["user_language"]);//20161102 다국어처리    
            sb.Append("		<table border='0' cellpadding='2' cellspacing='0' class='Ctx_Table1' style='background-image:url(").Append(Session["user_thema"]).Append("/Covi/Common/icon/cont_back.gif); background-repeat: repeat-y; border-width: 0;'>");
            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, strQuery, INPUT);
            if (ds != null)
            {
                //intUserForm = ds.Tables[1].Rows.Count.ToString();
                foreach (System.Data.DataRow dr in ds.Tables[1].Rows)
                {
                    //sb.Append("<li id='fmid' fmid='").Append(dr["FORM_ID"].ToString()).Append("' onclick=\"Open_Form('").Append(dr["FORM_ID"].ToString()).Append("','','").Append(dr["FORM_PREFIX"].ToString()).Append("','").Append(dr["SCHEMA_ID"].ToString()).Append("','").Append(dr["REVISION"].ToString()).Append("','").Append(dr["FILE_NAME"].ToString()).Append("')\"  >").Append(dr["FORM_NAME"].ToString()).Append("</li>");
                    sb.Append("		<tr onmouseover='this.style.fontSize=\"8pt\";this.className=\"Ctx_MouseOver\";' onmouseout=\"this.className='Ctx_Table2';\">");
                    sb.Append("			<td>");
                    sb.Append("				<table width='100%' cellpadding='2' cellspacing='0'  class='Ctx_Table2' >");
                    sb.Append("					<tr>");
                    sb.Append("						<td width='25px' >");
                    sb.Append("							");
                    sb.Append("						</td>");
					sb.Append("						<td align='left' id='fmid' fmid='").Append(dr["FORM_ID"].ToString()).Append("' onclick=\"DiffForm();Open_Form('").Append(dr["FORM_ID"].ToString()).Append("','").Append(this.pReplaceSpecialCharacter(dr["FORM_NAME"].ToString())).Append("','").Append(dr["FORM_PREFIX"].ToString()).Append("','").Append(dr["SCHEMA_ID"].ToString()).Append("','").Append(dr["REVISION"].ToString()).Append("','").Append(dr["FILE_NAME"].ToString()).Append("'); \" >");
                    sb.Append("							<nobr>").Append(dr["FORM_NAME"].ToString()).Append("</nobr>");
                    sb.Append("						</td>");
                    sb.Append("					</tr>");
                    sb.Append("				</table>");
                    sb.Append("			</td>");
                    sb.Append("		</tr>");
                }
                if (ds.Tables[0].Rows.Count == 0)
                {
                    sb.Append("		<tr onmouseover='this.style.fontSize=\"8pt\";' >");
                    sb.Append("			<td>");
                    sb.Append(Resources.Approval.msg_003);
                    sb.Append("			</td>");
                    sb.Append("		</tr>");
                }
            }
            sb.Append("	</table>   ");
            strDiffForm = sb.ToString();
        }
        catch (System.Exception ex)
        {
            
        }
        finally
        {
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
            if (SqlDbAgent != null)
            {
                SqlDbAgent.Dispose();
                SqlDbAgent = null;
            }
            if (INPUT != null)
            {
                INPUT = null;
            }
            if (sb != null)
            {
                sb = null;
            }
        }

    }
	private string pReplaceSpecialCharacter(string strContent)
	{
		//Response.Write("<script>alert('" + strContent + "');</script>");
		if (strContent != null)
		{
			//Response.Write("<script>alert('" + strContent + "');</script>");
			strContent = strContent.Replace("\\", "\\\\");
			strContent = strContent.Replace("\r\n", "\\r\\n");
			strContent = strContent.Replace("\n", "\\n");
			strContent = strContent.Replace("'", "\\'");
			//Response.Write("<script>alert('" + strContent + "');</script>");
		}
		return strContent;
	}
}
