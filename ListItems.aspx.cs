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
using System.Diagnostics;

namespace COVINet.COVIFlowNet
{
    /// <summary>
    /// 결재함(개인/부서/개인폴더/부서폴더) 목록 조회 처리
    /// </summary>
    public partial class ListItems : PageBase 
    {
        private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
        public string uid, strlocation, strlocationmode, strpage, strkind, strtitle, strlabel, strDept, strOrder, strpi_state, strwi_state, strstartdate;
        public string strYear, strMonth, strDate, sEntcode;
        public string strContextMenuType;

        /// <summary>
        /// 결재함 목록 다국어 처리
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

            Response.Expires = -1;
            Response.CacheControl = "no-cache";
            Response.Buffer = true;

            uid = Request.QueryString["uid"];
            
            if(uid == "") uid = Session["user_code"].ToString();

            try
            {
                strlocation = Request.QueryString["location"];
                strlocationmode = Request.QueryString["mode"];
                strpage = Request.QueryString["page"];
                strkind = Request.QueryString["kind"];
                strtitle = Request.QueryString["title"];
                strlabel = Request.QueryString["label"];
                strstartdate = Request.QueryString["startdate"];   //20071107 hjy
                sEntcode = Request.QueryString["entcode"];

                strDept = Session["user_dept_code"].ToString();

                if(strlocation == "APPROVAL")
                {
                    strOrder = "PI_STARTED";                    
                    DataSet rsDeputy = new DataSet();
                    //string sDeputy = "";
                }
                else if(strlocation == "REJECT")
                {
                    strOrder = "PI_STARTED";
                }
                else if(strlocation == "COMPLETE")
                {
                    strOrder = "PI_FINISHED";
                }
                else if(strlocation == "PROCESS")
                {
                    strOrder = "WI_FINISHED";
                }else if(strlocation == "DEPART")
                {
                    strOrder = "PI_STARTED";
                }
                
                if (this.Page.Application["ContextMenu_USER_YN"].ToString() == "Y")
                {
                    strContextMenuType = "ctx";
                }
                else if (this.Page.Application["ContextMenu_OCS"].ToString() == "Y")
                {
                    strContextMenuType = "ocs";
                }
                else
                {
                    strContextMenuType = string.Empty;
                }
 

                 

            }
            catch (System.Exception ex)
            {
                throw new System.Exception(null, ex);
            }
            
            strDate = "";
            strYear = DateTime.Now.Year.ToString();
            strMonth = DateTime.Now.Month.ToString();

            for(int i = 2003; i < int.Parse(strYear); i++)	
			{
                for(int j = 1; j < 12; j++)	
			    {
                    if(strDate != "") strDate = strDate + "/";

                    strDate = strDate + i.ToString() +  Resources.Approval.lbl_year+"#" + j.ToString() + Resources.Approval.lbl_month;
                }
            }

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
    }
}
