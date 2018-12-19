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
using System.Diagnostics;
using System.Text;


/// <summary>
/// 결재선 관리 - 조직도 Tree 조회 페이지
/// </summary>
public partial class COVIFlowNet_ApvlineMgr_orgtree : PageBase // PageBase
{
    public string sOrgtree = "";
    public string sComp = "";
    public string TopGroupName;
    public string TopGroupCN;
    public string Ent = "";
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
	public string strLangIndex = "0";

    /// <summary>
    /// 다국어설정
    /// 파라미터 설정
    /// 최상위 조직 조회 처리
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {


        #region PerformanceLog 처리를 위한 Stopwatch 설정
        Stopwatch stopwatch = null;
        if (sPerformanceYN == "True")
        {
            stopwatch = new Stopwatch();
            stopwatch.Start();
        }
        #endregion



        //다국어 언어설정
        if (Session["user_language"] != null)
        {
            strLangID = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        string culturecode = strLangID;	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

        HtmlLink cssStyle3 = null;
        try
        {
            cssStyle3 = new HtmlLink();
            cssStyle3.Attributes.Add("type", "text/css");
            cssStyle3.Attributes.Add("rel", "stylesheet");
            cssStyle3.Href = Session["user_thema"] + "/CSS/app_org_css_style.css";
            Page.Header.Controls.Add(cssStyle3);
        }
        catch (System.Exception ex) { }
        finally
        {
            if (cssStyle3 != null)
            {
                cssStyle3.Dispose();
                cssStyle3 = null;
            }
        }
        TopGroupName = ConfigurationManager.AppSettings["RootName"].ToString();
        TopGroupCN = ConfigurationManager.AppSettings["RootCode"].ToString();

        //사용자 쿼리 받아오는 부분
        if (Request.QueryString["Ent"] != null)
        {
            Ent = Request.QueryString["Ent"];
        }



        //추후 확인 필요
        if (Request.QueryString["comp"] != null)
        {
            sComp = Request.QueryString["comp"];
        }

        if (sComp == "*" || sComp == "")
        {
            sComp = Session["TopGroupCode"].ToString();
        }
        sComp = Session["TopGroupCode"].ToString();
        sOrgtree = fnDispGroup();

        #region PerformanceLog 처리
        if (sPerformanceYN == "True")
        {
            stopwatch.Stop();
            if (stopwatch.ElapsedMilliseconds > Convert.ToInt32(iPerformanceLimit))
            {
                string fullMethodName = string.Format("{0} --> {1}", this.GetType().Name, System.Reflection.MethodBase.GetCurrentMethod().Name);
                this.SetPerformanceLog(fullMethodName, stopwatch.Elapsed.ToString());

            }
        }
        #endregion
    }


    /// <summary>
    ///첫번째 Tree 구성. 회사목록을 보여준다.
    /// </summary>
    /// <returns></returns>
    public string fnDispGroup()
    {
        string strTree2 = "";
        string szQuery = "";
        StringBuilder strList = null;
        DataPack INPUT = null;
        DataSet ds = null;
        try
        {
            ds = new DataSet();
            INPUT = new DataPack();

            if (Ent == "" || Ent == "*" || Ent == null)
            {
                INPUT.add("@UNIT_CODE", TopGroupCN);
                szQuery = "dbo.usp_GetUnitEnt";
            }
            else
            {
                INPUT.add("@ENT_CODE", Ent);
                INPUT.add("@PARENT_UNIT_CODE", TopGroupCN);
                szQuery = "dbo.usp_GetUnitTop";
            }

            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, szQuery, INPUT);
            }

            System.Data.DataRowCollection xmlnode = ds.Tables[0].Rows;

            strList = new StringBuilder();
            foreach (System.Data.DataRow dr in xmlnode)
            {
				strList.Append("<LI an=\"").Append(dr["UNIT_CODE"].ToString()).Append("\" em=\"\" jd=\"").Append(dr["NAME"].ToString()).Append("\" rcv=\"\" class=\"open\">");
                strList.Append("<A HREF=\"javascript:getMembers('").Append(dr["UNIT_CODE"].ToString()).Append(";").Append(dr["NAME"].ToString()).Append("');\">");
				strList.Append(COVIFlowCom.Common.splitNameExt(dr["NAME"].ToString(),strLangIndex)).Append("</A>");
                strList.Append("<UL class=\"expanded\" name=\"clicked\" id=\"_").Append(dr["UNIT_CODE"].ToString()).Append("\">");
                strList.Append(DisplaySubGroups(dr["UNIT_CODE"].ToString()));
                strList.Append("</UL></LI>");

            }
            strTree2 = strList.ToString();
            return strTree2;
        }
        catch (System.Exception ex)
        {
            throw ex;
        }
        finally
        {

            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
            if (strList != null)
            {
                strList = null;
            }
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
        }
    }

    /// <summary>
    /// 특정 부서의 하위부서 조회
    /// </summary>
    /// <param name="strParentCode">상위부서 코드</param>
    /// <returns></returns>
    public string DisplaySubGroups(string strParentCode)
    {
        string szQuery = "";
        string szClass = "";
        DataSet ds = null;
        StringBuilder strList = null;
        DataPack INPUT = null;
        try
        {
            ds = new DataSet();
            strList = new StringBuilder();
            INPUT = new DataPack();

            INPUT.add("@PARENT_UNIT_CODE", strParentCode);
            szQuery = "dbo.usp_GetSubUnit";

            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, szQuery, INPUT);
            }

            System.Data.DataRowCollection xmlnode = ds.Tables[0].Rows;
            int itemCount = xmlnode.Count;
            System.Text.StringBuilder sTemp = new System.Text.StringBuilder();
            if (itemCount == 0)
            {
                return "";
            }
            else
            {
                string strJD, strEM, strHasReceived, strCN, stran;//, strRN;

                strList.Append("<div id=sublistitems>");
                for (int i = 0; i <= itemCount - 1; i++)
                {
                    stran = xmlnode[i]["UNIT_CODE"].ToString();
                    strJD = xmlnode[i]["NAME"].ToString();
                    strEM = xmlnode[i]["EMAIL"].ToString();
                    //strRN = xmlnode[i]["RESERVED1"].ToString();
                    //if (xmlnode[i]["RECEIVABLE"].ToString() == "1")
                    if (xmlnode[i]["RECEIPT_UNIT_CODE"].ToString() == xmlnode[i]["UNIT_CODE"].ToString())
                    {
                        strHasReceived = "t";
                    }
                    else
                    {
                        strHasReceived = "f";
                    }
                    if (xmlnode[i]["CHILD_CNT"].ToString() == "0") { szClass = " class='spot'"; }
                    else { szClass = " class='exe'"; }

                    //strList.Append("<LI").Append(szClass).Append(" an=\"").Append(stran).Append("\" em=\"").Append(strEM).Append("\" jd=\"").Append(strJD).Append("\" rcv=\"").Append(strHasReceived).Append("\" rn=\"").Append(strRN).Append("\" etnm=\"").Append(xmlnode[i]["ENT_NAME"].ToString()).Append("\">");
					strList.Append("<LI").Append(szClass).Append(" an=\"").Append(stran).Append("\" em=\"").Append(strEM).Append("\" jd=\"").Append(strJD).Append("\"").Append("\" rcv=\"").Append(strHasReceived).Append("\"  etnm=\"").Append(xmlnode[i]["ENT_NAME"].ToString()).Append("\">");
                    strCN = "_" + stran;
                    strList.Append("<A HREF=\"javascript:getMembers('").Append(stran).Append(";").Append(strJD.Replace("\"\"", "+quot;")).Append("');\">").Append(COVIFlowCom.Common.splitNameExt(strJD,strLangIndex)).Append("</A>");
                    strList.Append("<UL name=\"\" id=\"").Append(strCN).Append("\"></UL></LI>");

                }
                strList.Append("</div>");
                return strList.ToString();
            }
        }
        catch (System.Exception ex)
        {
            return ex.Message;
        }
        finally
        {
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
            if (strList != null)
            {
                strList = null;
            }
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
        }
    }
}
