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

public partial class Approval_UserFolderMgr : PageBase
{
    /// <summary>
    /// 개인/부서 폴더 선택 페이지
    /// </summary>
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
    public string strFolderDelYN = ConfigurationManager.AppSettings["Default_folderDelYN"];
    public string strUID, strGubun;
    public int iCount = 0;

    public string strJFCount = "0";

    /// <summary>
    /// 개인/부서 폴더 선택 페이지
    /// 개인/부서 구분에 따른 폴더 조회
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
                //code
        if (!IsPostBack)
        {
            if (Session["user_language"] != null)
            {
                strLangID = Session["user_language"].ToString();
            }

            if (Request.QueryString["count"] != null)
                iCount = Convert.ToInt32(Request.QueryString["count"]);

            //다국어 언어설정
            string culturecode = strLangID; //"en-US"; "ja-JP";
            Page.UICulture = culturecode;
            Page.Culture = culturecode;

            Title = Resources.Approval.lbl_userfoldertitle;
            //폴더 추가 시 데이터 삭제 여부 설정
            string strKey = Session["user_ent_code"].ToString() + "_" + "folderDelYN";
            if (ConfigurationManager.AppSettings[strKey] != null)
            {
                strFolderDelYN = ConfigurationManager.AppSettings[strKey].ToString();
            }

            //부서함일 경우 폴더소유자 key 값을 user_code에서 부서로 변경
            if (Request.QueryString["uid"] != null)
            {
                strUID = Request.QueryString["uid"].ToString();
                strGubun = "unit";
            }
            else
            {
                strUID = Session["user_code"].ToString();
                strGubun = "user";
            }

            //폴더조회
            GetDataFolder();
            classifySelect();
        }
    }
    
#region GetDataFolderList- 데이타조회후 바인딩
    /// <summary>
    /// 데이타조회후 바인딩(목록 나열)
    /// </summary>
    private void GetDataFolder()
    {
        DataSet ds = null;
        DataPack INPUT = null;
        try
        {
            ds = new DataSet();
            INPUT = new DataPack();
            INPUT.add("@userid", strUID);
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
                ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wfform_folder", INPUT);
            }
            if (ds.Tables[0].Rows.Count > 0)
            {
                Folder.DataSource = ds.Tables[0];
                Folder.DataBind();
            }

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
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
        }
    }
    #endregion
    #region folder ItemDataBound 담당바인딩
    /// <summary>
    /// 개별 데이터에 대한 연결
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Folder_ItemDataBound(object sender, RepeaterItemEventArgs e)
    {
        string sFolerID= string.Empty;
        string sFolderName = string.Empty;
        string sf6 = string.Empty;
        

        Label folder_name = (Label)e.Item.FindControl("foldername");

       // if (e.Item.ItemType == ListItemType.Item || e.Item.ItemType == ListItemType.AlternatingItem)
        //{
            sFolerID = Convert.ToString(DataBinder.Eval(e.Item.DataItem, "FOLDER_ID"));
            sFolderName = Convert.ToString(DataBinder.Eval(e.Item.DataItem, "FOLDER_NAME"));
            sf6 = Convert.ToString(DataBinder.Eval(e.Item.DataItem, "f6"));


            if (sFolderName == sf6)
            {
                folder_name.Text = "<ul style='padding: 0 5px 1px 7px;'><li><a href='#'  onClick=\"setFolderID('" + sFolerID + ":" + sFolderName + "');\" >" + sFolderName + "</a></li></ul>";
            }
            else
            {
                folder_name.Text = "<ul style='padding: 0 5px 1px 20px;'><li><a href='#'  onClick=\"setFolderID('" + sFolerID + ":" + sFolderName + "');\" >" + sFolderName + "</a></li></ul>";
            }
            //folder_name.Text = "<a href='#'  onClick=\"setFolderID('" + sFolerID + "');\" >" + Convert.ToString(DataBinder.Eval(e.Item.DataItem, "FOLDER_NAME")) + "</a>";
            //folder_name.Text = "<a href='#'  onClick=\"setFolderID('" + sFolerID + ":" + sFolderName + "');\" >" + sEmpty + "</a>";
            
        //}
    }
    #endregion
    /// <summary>
    /// parent folder id 추출
    /// </summary>
    private void classifySelect()
    {
        DataPack INPUT = null;
        DataSet oDS = null;
        int count = 0;
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
                classify.Items.Insert(i + 1, itm);

            }
            //classify.Height = 50;
            classify.Width = 80;

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
}
