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

/// <summary>
/// 완료문서 - 조회 - 변경이력 조회 목록 보여 주는 페이지.
/// </summary>
public partial class COVIFlowNet_Forms_HistoryList : PageBase
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string fiid, fmpf,fmrv, sbodylist;
	public string strLangIndex = "0";
    protected void Page_Load(object sender, EventArgs e)
    {
        string culturecode = strLangID;//다국어 언어설정
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

        fiid = Request.QueryString["fiid"];
        fmpf = Request.QueryString["fmpf"];
        fmrv = Request.QueryString["fmrv"];
		Title = Resources.Approval.lbl_chglogsearch;
        HistoryListView();
    }


    protected void HistoryListView()
    {
        //string sEntCode = "";
        string strResult = "";

        System.Text.StringBuilder szQuery = null;
        System.Text.StringBuilder selEnt = null;
        DataSet ds = null;
        DataPack INPUT = null;

        
        try
        {
            szQuery = new System.Text.StringBuilder();
            szQuery.Append(" select [REVISION], [DATE], [DISPLAY_NAME],[COMMENT] ");
            szQuery.Append(" from( ");
			szQuery.Append(" SELECT A.[REVISION] ,left(convert( varchar,A.[MODIFIED_DATE],121),19) as [DATE],B.DISPLAY_NAME+';'+ISNULL(B.DISPLAY_ENG_NAME,B.DISPLAY_NAME)+';'+ISNULL(B.DISPLAY_JAP_NAME,B.DISPLAY_NAME)+';'+ISNULL(B.DISPLAY_CHA_NAME,B.DISPLAY_NAME) AS [DISPLAY_NAME] ");
            szQuery.Append("  ,ISNULL(C.COMMENT,'') AS COMMENT ");
            szQuery.Append(" FROM [COVI_FLOW_FORM_INST].[dbo].[WF_FORM_HISTORY_").Append( fmpf).Append( "__V").Append( fmrv ).Append( "] A with (nolock) left join [COVI_GROUPWARE].[dbo].[ORG_PERSON] B with (nolock) on  ");
            szQuery.Append(" A.[MODIFIER_ID] = B.[PERSON_CODE] ");
            szQuery.Append(" left join [COVI_FLOW_FORM_INST].[dbo].[WF_FORM_HISTORY_MODIFY_COMMENT] C ON  A.FORM_INST_ID=C.FORM_INST_ID AND A.REVISION=C.REVISION ");
            szQuery.Append(" where A.[FORM_INST_ID] = '" ).Append( fiid).Append( "'");
            szQuery.Append(" )C ");
            szQuery.Append(" group by [REVISION],[DATE], [DISPLAY_NAME],[COMMENT] ");
            szQuery.Append(" ORDER BY [REVISION] ASC");

            ds = new DataSet();
            INPUT = new DataPack();
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();

                ds = SqlDbAgent.ExecuteDataSet(CommandType.Text, szQuery.ToString(), INPUT);
            }
            DataRowCollection colDR;
            colDR = ds.Tables[0].Rows;

            if (ds == null)
            {
                strResult = "ERROR";
            }
            else
            {
                if (ds.Tables[0].Rows.Count == 0) strResult = "No Data";
            }

            selEnt = new System.Text.StringBuilder();
            if (strResult == "")
            {
                /* 주석처리후 아래 새로코딩 (2013-01-09 HIW)
                string temp = "기안자";
                foreach (DataRow DR in colDR)
                {
                    selEnt.Append("<tr>");
                    selEnt.Append("<td height='18' width='15%'>").Append(DR["REVISION"].ToString()).Append("</td>");
                    selEnt.Append("<td  width='30%'>").Append(DR["DATE"].ToString()).Append("</td>");
                    selEnt.Append("<td  width='55%' style='cursor:hand;'><a href=\"javascript:openURL('HistoryView.aspx?");
                    selEnt.Append("fiid=").Append(fiid).Append("&fmpf=").Append(fmpf).Append("&fmrv=").Append(fmrv).Append("&revision=").Append(DR["REVISION"].ToString()).Append("')\">").Append(temp).Append("</a></td></tr>");
					temp = COVIFlowCom.Common.splitNameExt(DR["DISPLAY_NAME"].ToString(), strLangIndex);
                }
                */  
                string sModifierNm = String.Empty;
                string Commtemp = String.Empty;
                foreach (DataRow DR in colDR)
                {
                    Commtemp = DR["COMMENT"].ToString();
                    sModifierNm = COVIFlowCom.Common.splitNameExt(DR["DISPLAY_NAME"].ToString(), strLangIndex);
                    selEnt.Append("<tr>");
                    //selEnt.Append("<td height='18' width='15%'>").Append(DR["REVISION"].ToString()).Append("</td>");
                    selEnt.Append("<td height='20'>").Append(DR["DATE"].ToString()).Append("</td>");
                    selEnt.Append("<td>").Append(sModifierNm).Append("</td>");

                    selEnt.Append("<td style='cursor:hand;'><SPAN id='btn_search'><A class='btnov' href='#' onclick=\"javascript:openURL('HistoryView.aspx?");
                    selEnt.Append("fiid=").Append(fiid).Append("&fmpf=").Append(fmpf).Append("&fmrv=").Append(fmrv).Append("&revision=").Append(DR["REVISION"].ToString()).Append("');\">");
                    selEnt.Append("<SPAN><IMG align=middle src='/GwImages/BLUE/Covi/Common/btn/btn_icon03_history.gif'>&nbsp;보기</SPAN></A> </SPAN></td>");
                    selEnt.Append("<td align='left' style='padding-right: 1px;'>").Append(Commtemp).Append("</td>");
                    selEnt.Append("</tr>");
                }
            }
        }
        catch (System.Exception ex)
        {
            throw ex;
        }
        finally
        {
            sbodylist = selEnt.ToString();
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
            if (INPUT != null)
            {
                INPUT = null;
            }
            if (szQuery != null)
            {
                szQuery = null;
            }
            if (selEnt != null)
            {
                selEnt = null;
            }
            
        }
    }
}
