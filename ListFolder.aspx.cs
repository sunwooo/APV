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
using System.Xml;

using System.Globalization;
using System.Threading;
using Covision.Framework;
using Covision.Framework.Data.Business;
using System.Diagnostics;

using System.Collections.Generic;
using System.Text;


namespace COVINet.COVIFlowNet
{
    /// <summary>
    /// 개인폴더 목록 조회
    /// </summary>
    public partial class List : PageBase
    {
        private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

        private static System.Xml.Xsl.XslCompiledTransform oXSLTJF = null;
        private static System.Xml.Xsl.XslCompiledTransform oXSLTUF = null;
        public string strJFCount = "0";
        int count = 0;
        DataSet oDS = null;


        /// <summary>
        /// 개인폴더 목록 - 다국어 설정
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Page_Load(object sender, EventArgs e)
        {
           
             // ID="imgSave" src="<%=Session["user_thema"] %>/Covi/Common/btn_type2/btn_x02.gif"
           

            if (!IsPostBack)
            {
                if (Session["user_language"] != null){
                    strLangID = Session["user_language"].ToString();
                }
                //다국어 언어설정
                string culturecode = strLangID; //"en-US"; "ja-JP";
                Page.UICulture = culturecode;
                Page.Culture = culturecode;

                Title = Resources.Approval.lbl_userdefinedfolder;
                lbl_Title.Text = Resources.Approval.lbl_subject;
                lbl_Intiator.Text = Resources.Approval.lbl_writer;
                PageName.Text = Resources.Approval.lbl_userdefinedfolder;
                PageName2.Text = Resources.Approval.lbl_userdefinedfolder;
                PagePath.Text = Resources.Approval.lbl_approval;
                ApvLineView.Text = Resources.Approval.lbl_viewAL;

                //[usp_wfform_userfolderquery_dropdownlist]
                classifySelect();

            }
        }
        private void classifySelect()
        {
            DataPack INPUT = null;

            try
            {
                string sQuery = "dbo.usp_wfform_userfolderquery_dropdownlist02";

                INPUT = new DataPack();
                //2011.06 사용자/부서폴더구분 조회
                if (Request.QueryString["uid"] == null)
                {
                    INPUT.add("@userid", Session["user_code"]);
                }
                else
                {
                    INPUT.add("@userid", Request.QueryString["uid"].ToString());
                }

                oDS = new DataSet();
                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
                    oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sQuery, INPUT);
                }

                strJFCount = oDS.Tables[0].Rows.Count.ToString();
                count = oDS.Tables[0].Rows.Count;

                ListItem itm = new ListItem();
                itm = new ListItem(" ", "0|0");
                classify.Items.Insert(0, itm);
               
                //DDLanguage.Items.Insert(0, itm);
                //itm = new ListItem("English", "en-US");
                //DDLanguage.Items.Insert(1, itm);

                for (int i = 0; i < count; i++)
                {
                    itm = new ListItem(oDS.Tables[0].Rows[i][0].ToString(), oDS.Tables[1].Rows[i][0].ToString() + "|" + oDS.Tables[1].Rows[i][4].ToString());
                    classify.Items.Insert(i+1, itm);

                }
                //classify.Height = 50;
                classify.Width = 125;

                //hidClassify.Value = classify.SelectedItem.Value;
            }
            catch (System.Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (oDS != null)
                {
                    oDS.Dispose();
                    oDS = null;
                }
                if (INPUT != null)
                {
                    INPUT.Dispose();
                    INPUT = null;
                }
            }
        }
      

        //protected void TossParentsID(object sender, EventArgs e)
        //{

        //    //javascript:document.getElementById('divfoldername').style.display='none';
            
        //    DataPack INPUT = null;

        //    string[] h_id = hidClassify.Value.Split('|');

        //    try
        //    {
        //        string sQuery = "dbo.usp_wfform_userfolderquery_TossParentsID";

        //        INPUT = new DataPack();
        //        INPUT.add("@Fold_id", h_id[0]);
        //        INPUT.add("@pa_id", h_id[1]);

        //        oDS = new DataSet();
        //        using (SqlDacBase SqlDbAgent = new SqlDacBase())
        //        {
        //            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
        //            oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sQuery, INPUT);
        //        }

        //    }
        //    catch (System.Exception ex)
        //    {
        //        throw ex;
        //    }
        //    finally
        //    {
        //        if (oDS != null)
        //        {
        //            oDS.Dispose();
        //            oDS = null;
        //        }
        //        if (INPUT != null)
        //        {
        //            INPUT.Dispose();
        //            INPUT = null;
        //        }
        //    }
        //}
    }
}
