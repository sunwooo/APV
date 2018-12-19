using System;
using System.Text;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Drawing;
using CoviChart;

using Covision.Framework;
using Covision.Framework.Data.Business;

/// <summary>
/// 결재 포탈 통계 그래프(월별 승인/반려 현황)
/// </summary>
public partial class Approval_Portal_Statistics_Unit_CountGraph : PageBase
{
    public string strSubject = string.Empty;
    /// <summary>
    /// 제목 설정
    /// 그래프 출력 함수 호출
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            //"2009년도 월별 승인/반려 현황";
            strSubject = DateTime.Now.ToString("yyyy") + Resources.Approval.lbl_StaticSubject;
        }
        //ViewChart();
        ViewGraph();
    }
    /// <summary>
    /// 대상 월 통계현황 조회
    /// </summary>
    /// <returns></returns>
    private DataSet GetData()
    {
        DataSet ds = new DataSet();
        DataPack INPUT = new DataPack();

        try
        {
            ds = new DataSet();
            INPUT = new DataPack();

            INPUT.add("@vc_YEAR", System.DateTime.Now.Year);
            INPUT.add("@vc_UNIT_ALL", "F");
            INPUT.add("@vc_USER_ID_H",Sessions.USER_DEPT_CODE.ToString());
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ARCHIVE_ConnectionString").ToString();
                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_WF_unit_count_month_G", INPUT);
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (INPUT != null)
            {
                INPUT.Dispose();
            }
        }

        return ds;

    }
 
    /// <summary>
    /// 부서별  월별 승인/반려 현황 Graph
    /// 1. SP: dbo.usp_WF_unit_count_month_G : 부서별, 월별, 승인/반려 현황을 받아 온다.
    /// 2. StringBuilder로 해당 그래프를 그려 준다.
    /// </summary>
    private void ViewGraph()
    {
        string[] labels = { Resources.Approval.lbl_Month_1, Resources.Approval.lbl_Month_2, Resources.Approval.lbl_Month_3, Resources.Approval.lbl_Month_4, Resources.Approval.lbl_Month_5, Resources.Approval.lbl_Month_6, Resources.Approval.lbl_Month_7, Resources.Approval.lbl_Month_8, Resources.Approval.lbl_Month_9, Resources.Approval.lbl_Month_10, Resources.Approval.lbl_Month_11, Resources.Approval.lbl_Month_12 };
        DataSet ds = null;
        DataPack INPUT = null;

        try
        {
            ds = new DataSet();
            INPUT = new DataPack();

            INPUT.add("@vc_YEAR", System.DateTime.Now.Year);
            INPUT.add("@vc_UNIT_ALL", "F");
            INPUT.add("@vc_USER_ID_H", Sessions.USER_DEPT_CODE.ToString());
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ARCHIVE_ConnectionString").ToString();
                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_WF_unit_count_month_G", INPUT);
            }

            DataTable dtStatData = ds.Tables[0];
            
            int cntMonth = 0;
            
            StringBuilder sb = new StringBuilder();

            sb.Append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"1\">");
            sb.Append("<tr height=\"102px\">");
            if (dtStatData.Rows.Count != 0)
            {
                int MaxValue = 0;
                int num = 0;
                int num2 = 0;
                int lastMax = 0;

                for (int y = 1; y <= dtStatData.Columns.Count - 1; y = y + 4)
                {
                    int stMax = Convert.ToInt32(dtStatData.Rows[0][y + 2]);
                    if (stMax > MaxValue)
                    {
                        if (stMax > num)
                        {
                            num = stMax;
                        }
                        
                    }

                    int stMax2 = Convert.ToInt32(dtStatData.Rows[0][y + 3]);
                    if (stMax2 > MaxValue)
                    {
                        if (stMax2 > num2)
                        {
                            num2 = stMax2;
                        }
     
                    }

                    if (num > num2)
                    {
                        lastMax = num;
                    }
                    else if (num < num2)
                    {
                        lastMax = num2;
                    }
                    else
                    {
                        lastMax = 100;
                    }

                }
                
                for (int i = 1; i <= dtStatData.Columns.Count - 1; i = i + 4)
                {
                    int intValue = (100 * Convert.ToInt32(dtStatData.Rows[0][i + 2])) / lastMax;
                    int intValue2 = (100 * Convert.ToInt32(dtStatData.Rows[0][i + 3])) / lastMax;

                    //int intValue = (100 * Convert.ToInt32(dtStatData.Rows[0][i + 2])) / 33;
                    //int intValue2 = (100 * Convert.ToInt32(dtStatData.Rows[0][i + 3])) / 33;

                    string sValue = dtStatData.Rows[0][i + 2].ToString();
                    string sValue2 = dtStatData.Rows[0][i + 3].ToString();
                    //if (intValue == 1 || intValue2 == 1)
                    //{
                    //    intValue = 2;
                    //    intValue2 = 2;
                    //}
                    if (sValue == "0") 
                    {
                        sValue = "";
                    }
                    if (sValue2 == "0")
                    {
                        sValue2 = "";
                    }
                    //sb.Append("<td align=\"right\" valign=\"bottom\" bgcolor=#ffffff >");
                    //sb.Append("<div style=\"padding-bottom:3px;vertical-align:top;font-size:9pt;\"> ").Append(sValue).Append("</div>");
                    //sb.Append("<div><img src=\"").Append(Session["user_thema"]).Append("/Covi/Approval/app_portal/grap_blue.gif\" width=\"9px\" height=\"").Append(intValue).Append("%\"></div>");
                    //sb.Append("</td>");
                    //sb.Append("<td align=\"left\" valign=\"bottom\" bgcolor=#ffffff >");
                    //sb.Append("<div style=\"padding-bottom:3px;vertical-align:top;font-size:9pt;\"> ").Append(sValue2).Append("</div>");
                    //sb.Append("<div><img src=\"").Append(Session["user_thema"]).Append("/Covi/Approval/app_portal/grap_yellow.gif\" width=\"9px\" height=\"").Append(intValue2).Append("%\"></div>");
                    //sb.Append("</td>");

                    sb.Append("<td align=\"right\" valign=\"bottom\" bgcolor=#ffffff >");
                    sb.Append("<div style=\"padding-bottom:3px;vertical-align:top;font-size:9pt;\"> ").Append(sValue).Append("</div>");
                    sb.Append("<div style=\"height:").Append(intValue).Append("px;\"><img src=\"").Append(Session["user_thema"]).Append("/Covi/Approval/app_portal/grap_blue.gif\" width=\"9px\" height=\"").Append(intValue).Append("px\"></div>");
                    sb.Append("</td>");
                    sb.Append("<td align=\"left\" valign=\"bottom\" bgcolor=#ffffff >");
                    sb.Append("<div style=\"padding-bottom:3px;vertical-align:top;font-size:9pt;\"> ").Append(sValue2).Append("</div>");
                    sb.Append("<div style=\"height:").Append(intValue2).Append("px;\"><img src=\"").Append(Session["user_thema"]).Append("/Covi/Approval/app_portal/grap_yellow.gif\" width=\"9px\"  height=\"").Append(intValue2).Append("px\"></div>");
                    sb.Append("</td>");

                }
                sb.Append("</tr>");
                sb.Append("<tr align=\"center\">");
                for (int j = 1; j <= dtStatData.Columns.Count - 1; j = j + 4)
                {
                    sb.Append("<td colspan=\"2\"><div style=\"padding-top:10px;vertical-align:bottom;font-size:9pt;\">").Append(labels[cntMonth]).Append("</div></td>");
                    
                    cntMonth++;
                }
            }
            sb.Append("</tr>");
            sb.Append("</table>");

            Stgraph.InnerHtml = sb.ToString();
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
            if( ds != null){
                ds.Dispose();
                ds = null;
            }
        }

    }
}
