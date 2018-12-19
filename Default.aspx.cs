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

using COVIFlowCom;
using Covision.Framework;
using Covision.Framework.Data.Business;

/// <summary>
/// 전자결재 초기 페이지(default)
/// 전자결재메뉴/contents 영역 분리 frame 담당
/// </summary>
public partial class COVIFlowNet_Default : PageBase //System.Web.UI.Page 
{
    public string strlocation = "";
    public string subUrl, menuUrl;

    /// <summary>
    /// 전자결재 선택 메뉴 설정/contents 설정
    /// </summary>
    protected void Page_Load(object sender, EventArgs e)
    {
	    string deptid= Session["user_dept_code"].ToString(); 
		string parentdeptid= Session["user_parent_dept_code"].ToString();
        if (deptid != parentdeptid) deptid = parentdeptid;

        strlocation = System.Convert.ToString(Request.QueryString["location"]);
        if (strlocation == "")
        {//menu_approval
            menuUrl = "menu_approval.aspx?sMenu=1&List=false";
        } 
        switch (strlocation)
        {
            case "1":    //미결함
                subUrl = "list.aspx?uid=&location=APPROVAL" ;
                menuUrl = "menu_approval.aspx?sMenu=1&sSubMenu=menu_1_2&List=List";
                break;
            case "2":    //부서수신함
                subUrl = "listDept.aspx?uid=" + deptid + "_R&location=DEPART";
                menuUrl = "menu_approval.aspx?sMenu=2&sSubMenu=menu_4_3&List=List";
                break;
            case "3":    //결재문서 작성
                subUrl = "formlist/formlist.aspx";
                menuUrl = "menu_approval.aspx?sMenu=refresh&List=false";
                break;
            case "4":    //문서대장
                subUrl = "Doclist/Doclist.aspx?tab=tab1&location_name=" + HttpUtility.UrlEncode(Resources.Approval.lbl_doc_reglist, new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=4&sSubMenu=menu_6_1&List=false";
                break;
            case "5":    //개인폴더
                subUrl = "listFolder.aspx?uid='" + Session["user_code"].ToString() + "'&FOLDERMODE=I&location=UFOLDER";
                menuUrl = "menu_approval.aspx?sMenu=6&List=false";
                break;
            ////////////개인결재함////////////
            case "11":    //예고함
                subUrl = "list.aspx?uid=&location=PREAPPROVAL";
                menuUrl = "menu_approval.aspx?sMenu=1&sSubMenu=menu_1_1&List=List";
                break;
            case "12":    //미결함
                subUrl = "list.aspx?uid=&location=APPROVAL";
                menuUrl = "menu_approval.aspx?sMenu=1&sSubMenu=menu_1_2&List=List";
                break;
            case "13":    //진행함
                subUrl = "list.aspx?uid=&location=PROCESS&location_name=" + HttpUtility.UrlEncode("진행함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=1&sSubMenu=menu_1_3&List=List";
                break;
            case "15":    //반송함
                subUrl = "list.aspx?uid=&location=REJECT&barchived=true&location_name=" + HttpUtility.UrlEncode("반송함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=2&sSubMenu=menu_1_5&List=List";
                break;
            case "14":    //완료함
                subUrl = "list.aspx?uid=&location=COMPLETE&barchived=true&location_name=" + HttpUtility.UrlEncode("완료함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=2&sSubMenu=menu_1_4&List=List";
                break;
            case "16":    //임시함
                subUrl = "list.aspx?uid=&location=TEMPSAVE&location_name=" + HttpUtility.UrlEncode("임시함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=2&sSubMenu=menu_1_6&List=List";
                break;
            case "17":    //참조함
                subUrl = "list.aspx?uid=&location=TCINFO&location_name=" + HttpUtility.UrlEncode("회람/참조함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=2&sSubMenu=menu_1_7&List=List";
                break;
            case "18":    //회람함
                subUrl = "list.aspx?uid=&location=TCINFO&location_name=" + HttpUtility.UrlEncode("회람/참조함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=2&sSubMenu=menu_1_8&List=List";
                break;
            ////////////부서문서함////////////
            case "41":    //부서문서함- 품의함
                subUrl = "listDept.aspx?uid=" + deptid + "_A&location=DEPART&barchived=true&location_name=" + HttpUtility.UrlEncode("품의함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=2&sSubMenu=menu_4_1&List=List";
                break;
            case "42":    //부서문서함- 발신함
                subUrl = "listDept.aspx?uid=" + deptid + "_S&location=DEPART&barchived=true&location_name=" + HttpUtility.UrlEncode("발신함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=2&sSubMenu=menu_4_2&List=List";
                break;
            case "43":    //부서문서함- 수신함
                subUrl = "listDept.aspx?uid=" + deptid + "_R&location=DEPART&location_name=" + HttpUtility.UrlEncode("발신함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=2&sSubMenu=menu_4_3&List=List";
                break;
            case "44":    //부서문서함- 접수완료함
                subUrl = "listDept.aspx?uid=" + deptid + "_RC&location=DEPART&barchived=true&location_name=" + HttpUtility.UrlEncode("접수완료함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=2&sSubMenu=menu_4_4&List=List";
                break;
            case "45":    //부서문서함- 참조함
                subUrl = "listDept.aspx?uid=" + deptid + "_I&location=DEPART&barchived=true&location_name=" + HttpUtility.UrlEncode("접수완료함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=2&sSubMenu=menu_4_5&List=List";
                break;
            case "46":    //부서문서함- 회람함
                subUrl = "listDept.aspx?uid=" + deptid + "_I&location=DEPART&location_name=" + HttpUtility.UrlEncode("접수완료함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=2&sSubMenu=menu_4_6&List=List";
                break;
            case "47":    //부서문서함- 감사할문서함
                subUrl = "listDept.aspx?uid=" + deptid + "_AD&location=DEPART&location_name=" + HttpUtility.UrlEncode("감사할문서함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=2&sSubMenu=menu_4_7&List=List";
                break;
            ////////////이관문서보관함////////////
            case "51": //이관문서함 - 개인함
                subUrl = "list.aspx?barchived=true&uid=&location=COMPLETE&location_name=" + HttpUtility.UrlEncode("완료함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=3&sSubMenu=menu_5_1&List=List";
                break;
            case "52": //이관문서함 - 부서함
                subUrl = "listDept.aspx?barchived=true&uid=" + deptid + "_A&location=DEPART&location_name=" + HttpUtility.UrlEncode("감사할문서함", new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=3&sSubMenu=menu_5_2&List=List";
                break;
            ////////////담당업무함////////////
            case "61":    //첫번째 담당엄무함
                string[] strJobfunction = Get_Jobfunction();
                subUrl = "listJF.aspx?uid=" + HttpUtility.UrlEncode(strJobfunction[0] + "_APPROVAL", new System.Text.UTF8Encoding()) + "&location=JOBFUNCTION&location_name=" + HttpUtility.UrlEncode(strJobfunction[1], new System.Text.UTF8Encoding());
                menuUrl = "menu_approval.aspx?sMenu=5&sSubMenu=menu_3_" + strJobfunction[0] + "&List=List";
                break;
            ////////////환경설정////////////
            case "71":     //개인결재선
                subUrl = "ApvLinelist/Apvlinelist.aspx";
                menuUrl = "menu_approval.aspx?sMenu=&sSubMenu=&List=List";
                break;
            case "76":     //회람/배포그룹설정
                subUrl = "CirculationlineList/CirculationlineList.aspx";
                menuUrl = "menu_approval.aspx?sMenu=&sSubMenu=&List=List";
                break;
            case "72":     //결재서명
                subUrl = "ApvSign/info_change_sign.aspx";
                menuUrl = "menu_approval.aspx?sMenu=&sSubMenu=&List=List";
                break;
            case "74":     //대결자 지정
                subUrl = "/CoviFlowNet/ApprovalPersonInfo.aspx";
                menuUrl = "menu_approval.aspx?sMenu=&sSubMenu=&List=List";
                break;
            case "75":     //문서관리자
                subUrl = "Admin/JFMgr/JFMemberList.aspx?jfid=3&jfcode=Receptionist&jfname=문서관리자&ismanager=true";
                menuUrl = "menu_approval.aspx?sMenu=&sSubMenu=&List=List";
                break;
 
            case "APPROVAL":    //미결함
                subUrl = "list.aspx?uid=&location=APPROVAL";
                menuUrl = "menu_approval.aspx?sMenu=1&sSubMenu=menu_1_2&List=List";
                break;
            case "PROCESS":     //진행함
                subUrl = "list.aspx?uid=&location=PROCESS";
                menuUrl = "menu_approval.aspx?sMenu=1&sSubMenu=menu_1_3&List=List";
                break;
            case "COMPLETE":     //완료함
                subUrl = "list.aspx?uid=&barchived=true&location=COMPLETE";
                menuUrl = "menu_approval.aspx?sMenu=1&sSubMenu=menu_1_4&List=List";
                break;
            case "REJECT":     //반려함
                subUrl = "list.aspx?uid=&barchived=true&location=REJECT";
                menuUrl = "menu_approval.aspx?sMenu=1&sSubMenu=menu_1_5&List=List";
                break;
            case "TEMPSAVE":     //임시함
                subUrl = "list.aspx?uid=&location=TEMPSAVE";
                menuUrl = "menu_approval.aspx?sMenu=1&sSubMenu=menu_1_6&List=List";
                break;
            case "CCINFO":     //참조함
                subUrl = "list.aspx?uid=&location=CCINFO";
                menuUrl = "menu_approval.aspx?sMenu=1&sSubMenu=menu_1_7&List=List";
                break;
            case "TCCINFO":     //회람함
                subUrl = "list.aspx?uid=&location=TCCINFO";
                menuUrl = "menu_approval.aspx?sMenu=1&sSubMenu=menu_1_8&List=List";
                break;
            case "FORMLIST":    //결재문서작성
                subUrl = "/coviweb/approval/Formlist/formlist.aspx";
                menuUrl = "menu_approval.aspx?sMenu=&sSubMenu=&List=List";
                break;
            case "APVLINELIST":     //개인결재선
                subUrl = "/coviweb/approval/ApvLinelist/Apvlinelist.aspx";
                menuUrl = "menu_approval.aspx?sMenu=&sSubMenu=&List=List";
                break;
            case "DOCBOX": //결재문서함
                //subUrl = "list.aspx?barchived=true&uid=&location=COMPLETE";
                subUrl = "about:blank";
                menuUrl = "menu_DocBox.aspx?sMenu=3&sSubMenu=&List=List";
                break;
			case "PTODO": //개인통합
				subUrl = "Listtodo.aspx?uid=&location=TODO";
				menuUrl = "menu_approval.aspx?sMenu=&sSubMenu=&List=List";
				break;
			case "DTODO": //부서통합
                subUrl = "listDepttodo.aspx?uid=" + deptid + "_SS&location=DEPART&barchived=true";
				menuUrl = "menu_approval.aspx?sMenu=&sSubMenu=&List=List";
				break;
			default:
				//if (Sessions.PERSON_CODE == "whiteym")
				//{
				//    subUrl = "list.aspx?uid=&location=APPROVAL";
				//    menuUrl = "menu_approval.aspx?sMenu=1&sSubMenu=menu_1_2&List=List";
				//}
				//else
				//{
                    subUrl = "../approval/Approval_portal.aspx";
                    menuUrl = "menu_approval.aspx?sMenu=1&sSubMenu=menu_1_2&List=List";
				//}
                //subUrl = "/CoviWeb/PortalService/RolePortal.aspx?hhdPortalCode=64388D4B-8D32-4CAB-8A38-155668CDA6B4";
                break;
        }
    }

    private string[] Get_Jobfunction()
    {
        string[] strJobfunction = { "", "" };
        DataSet oDS = null;
        DataPack INPUT = null;
        try
        {
            //code
            string sQuery = "usp_wf_user_jobfunction";

            INPUT = new DataPack();
            INPUT.add("@USER_ID", Session["user_code"]);

            oDS = new DataSet();
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sQuery, INPUT);
            }
            if (oDS.Tables[0].Rows.Count > 0)
            {
                strJobfunction[0] = oDS.Tables[0].Rows[0]["JF_CODE"].ToString();
                strJobfunction[1] = oDS.Tables[0].Rows[0]["NAME"].ToString();
            }
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
        return strJobfunction;
    }
}
