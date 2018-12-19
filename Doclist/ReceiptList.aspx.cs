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

public partial class COVIFlowNet_Doclist_ReceiptList : PageBase
{
    //'/// <summary>
    //'/// 시  스  템 : 종합정보시스템
    //'/// 단위시스템 : Workflow
    //'/// 프로그램명 : 수신문서 목록
    //'/// 모  듈  명 : ReceiptList
    //'/// 파  일  명 : ReceiptList.aspx
    //'/// 설      명 : 특정 발송문서의 수신부서 목록 조회
    //'/// </summary>
    //'/// <history>
    //'/// CH00 2004/06/26 박형진 : 최초 작성
    //'/// 
    //'/// </history>
    public String strDisplayList = string.Empty; //HTML 구성
    public String strReceiptList = string.Empty; //수신처 리스트
    public String sPPIID = string.Empty; //parent process id
    public String sPDEFID = string.Empty;
    public string sReply = string.Empty;
    public string sFiid = string.Empty;
    private String strLangID = ConfigurationManager.AppSettings["LanguageType"];
    protected void Page_Load(object sender, EventArgs e)
    {
        //다국어 언어설정
        string culturecode = strLangID;	//"ko-KR"; "en-US"; "ja-JP";
        if (Session["user_language"] != null)
        {
            culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        Page.UICulture = culturecode;
        Page.Culture = culturecode;
        Page.Title = Resources.Approval.lbl_RecvDept;
        try{
            string strPIID = Request.QueryString["piid"];
            sReply = Request.QueryString["reply"];
            sFiid = Request.QueryString["fiid"];

            strDisplayList = pGetData(strPIID);
            sPDEFID = ConfigurationManager.AppSettings["BasicProcessID"];
        }catch(System.Exception ex){
            COVIFlowCom.ErrResult.HandleException(Response, ex);
        }

    }

    private string pGetData(string sPIID)
    {

        System.Text.StringBuilder sb = null;
        System.Text.StringBuilder sbList = null;
        SqlDacBase SqlDbAgent = null;
        DataSet oDS = null;
        try
        {
            string sSPName = "dbo.usp_wf_receivelist";

            DataPack INPUT = new DataPack();
            INPUT.add("@piid", sPIID);
            INPUT.add("@fiid", sFiid);
            INPUT.add("@reply", sReply);
            SqlDbAgent = new SqlDacBase();
            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
            oDS = new DataSet();
            oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sSPName, INPUT);

            DataRowCollection oRows = oDS.Tables[0].Rows;

            //parent_process_id 구하기
            if (oDS.Tables[1].Rows.Count > 0)
                sPPIID = oDS.Tables[1].Rows[0]["PARENT_ID"].ToString();
            else
                sPPIID = sPIID; //parent_process_id 가 없으면 piid를 넣어준다.

            sb = new System.Text.StringBuilder();
            sbList = new System.Text.StringBuilder();   
            foreach (DataRow oRow in oRows)
            {
                sb.Append("<tr>");
                sb.Append("<td align=\"center\"><input type=\"checkbox\" id=\"cField\" name=\"cField\" value=\"").Append(oRow["WI_ID"].ToString()).Append(":").Append(oRow["PI_ID"].ToString()).Append(":").Append(oRow["PF_PERFORMER_ID"].ToString()).Append("\"");
                //2013-12-06 hyh 추가 
                //수신형황 목록에 진행 상태가 완료일 경우 checkbox disabled
                if (Convert.ToInt32(oRow["PI_STATE"].ToString()) == 528) { sb.Append(" disabled "); }
                //2013-12-06 hyh 추가 끝

                //2013-07-24 hyh 주석
                if (Convert.ToInt16(oRow["WI_STATE"].ToString()) > 500 || oRow["PF_STATE"].ToString() == "0") { sb.Append(" disabled "); }
                //2013-07-24 hyh 주석 끝
                //2014-05-08 psw 주석 품

                sb.Append("></td>");
                sb.Append("<td align=\"center\">").Append(COVIFlowCom.Common.splitNameExt(oRow["ENT_NAME"].ToString(), COVIFlowCom.Common.getLngIdx(Page.Culture))).Append("</td>"); //회사 추가 (2013-04-04 leesh)
                sb.Append("<td align=\"center\">").Append(COVIFlowCom.Common.splitNameExt(oRow["pf_performer_name"].ToString(),COVIFlowCom.Common.getLngIdx(Page.Culture))).Append("</td>"); //수신처
                sb.Append("<td align=\"center\">").Append(GetReceiver(oRow["WI_DSCR"].ToString())).Append("</td>"); //수신자
                if (oRow["PF_STATE"].ToString() == "0")
                {
					sb.Append("<td align=\"center\">").Append(Resources.Approval.btn_cancel).Append("</td>"); //접수여부
					sb.Append("<td align=\"center\">").Append(Resources.Approval.btn_cancel).Append("</td>"); //진행상태
                }
                else
                {
					//sb.Append("<td align=\"center\">").Append(oRow["WI_STATE"].ToString()).Append("</td>"); //접수여부
					//sb.Append("<td align=\"center\">").Append(oRow["PI_STATE"].ToString()).Append("</td>"); //진행상태
					if (oRow["WI_STATE"].ToString() == "528")
					{
						sb.Append("<td align=\"center\">").Append(Resources.Approval.btn_receipt).Append("</td>"); //' 접수
					}
					else if (oRow["WI_STATE"].ToString() == "288")
					{
						sb.Append("<td align=\"center\">").Append(Resources.Approval.lbl_inactive).Append("</td>"); //' 미접수-대기
					}
					else if (oRow["WI_STATE"].ToString() == "544")
					{
						sb.Append("<td align=\"center\">").Append(Resources.Approval.btn_cancel).Append("</td>"); //취소
					}
					else if (oRow["WI_STATE"].ToString() == "545")
					{
						sb.Append("<td align=\"center\">").Append(Resources.Approval.btn_cancel).Append("</td>"); //취소
					}
					else if (oRow["WI_STATE"].ToString() == "546")
					{
						sb.Append("<td align=\"center\">").Append(Resources.Approval.btn_cancel).Append("</td>"); //취소
					}
					else
					{
						sb.Append("<td align=\"center\"></td>");
					}
					if (oRow["PI_STATE"].ToString() == "528")
					{
						sb.Append("<td align=\"center\">").Append(Resources.Approval.lbl_completed).Append("</td>"); //' 종료
					}
					else if (oRow["PI_STATE"].ToString() == "288")
					{
						sb.Append("<td align=\"center\">").Append(Resources.Approval.lbl_Processing).Append("</td>"); //' 진행
					}
					else if (oRow["PI_STATE"].ToString() == "544")
					{
						sb.Append("<td align=\"center\">").Append(Resources.Approval.btn_cancel).Append("</td>"); //취소
					}
					else if (oRow["PI_STATE"].ToString() == "545")
					{
						sb.Append("<td align=\"center\">").Append(Resources.Approval.btn_cancel).Append("</td>"); //취소
					}
					else if (oRow["PI_STATE"].ToString() == "546")
					{
						sb.Append("<td align=\"center\">").Append(Resources.Approval.btn_cancel).Append("</td>");
					}
					else
					{
						sb.Append("<td align=\"center\"></td>");
					}
                }

                //sb.Append("<td align=\"center\">").Append(oRow["PI_BUSINESS_STATE"].ToString()).Append("</td>"); //결재결과(승인여부)                
				//승인여부
				if (oRow["PI_BUSINESS_STATE"].ToString().Substring(0, 5) == "02_02")
                // [2014-02-28] 반송일 경우 빨간색 표기 PSW
				{
					sb.Append("<td align=\"center\"><b><font color=red>").Append(Resources.Approval.lbl_reject).Append("</b></font></td>"); //' 반려
				}
				else if (oRow["PI_BUSINESS_STATE"].ToString().Substring(0, 5) == "02_01")
				{
					sb.Append("<td align=\"center\">").Append(Resources.Approval.lbl_Approved).Append("</td>");
				}
				else
				{
					sb.Append("<td align=\"center\"></td>");
				}
				sb.Append("<td>").Append(oRow["PI_STARTED"].ToString()).Append("</td>");   //' 도착시간
                sb.Append("<td>").Append(oRow["WI_FINISHED"].ToString()).Append("</td>");  //' 접수시간
                sb.Append("<td>").Append(oRow["PI_FINISHED"].ToString()).Append("</td>");  //' 완료시간

                //회신정보추가 기능이 있을때만
                if (sReply == "1")
                {
                    sb.Append("<td>").Append(COVIFlowCom.Common.splitNameExt(oRow["RETURN_DEPT"].ToString(), COVIFlowCom.Common.getLngIdx(Page.Culture))).Append("</td>");            //' 회신처
                    sb.Append("<td>").Append(COVIFlowCom.Common.splitNameExt(oRow["RETURN_PERFORMER_NAME"].ToString(), COVIFlowCom.Common.getLngIdx(Page.Culture))).Append("</td>");  //' 담당자
                    sb.Append("<td>").Append(oRow["FORM_START"].ToString()).Append("</td>");             //' 기안일
                    sb.Append("<td>").Append(oRow["FORM_END"].ToString()).Append("</td>");               //' 완료일
                    sb.Append("</tr>");
                }
                //sbList = new System.Text.StringBuilder();                
                sbList.Append(";").Append(oRow["PF_PERFORMER_ID"].ToString());
            }

            oDS.Dispose();
            oDS = null;
            sbList.Append(";");
            strReceiptList = sbList.ToString();
            return sb.ToString();
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (sb != null)
            {
                sb = null;
            }
            if (sbList != null)
            {
                sbList = null;
            }
            if (SqlDbAgent != null)
            {
                SqlDbAgent.Dispose();
                SqlDbAgent = null;
            }
            if (oDS != null)
            {
                oDS.Dispose();
                oDS = null;
            }
        }

    }
    /// <summary>
    /// 메서드명 : GetReceiver
    /// 메서드내용 : 기안부서 완료된 문서중  Description 에서 수신자(접수자) 정보를 분리한다.
    /// 작성자     : 백승찬 대리
    /// 최초작성일 : 2008.07.29
    /// 최종수정일 : 2011.01.27
    /// 수정내용 : 2011.01.27 - 접수자정보 다국어 처리로 변경
    /// </summary>
    /// <param name="value">Desc</param>
    /// <returns>접수자정보</returns>
    private string GetReceiver(string value)
    {
        //데이터 샘플 => Leejh@이정훈;이정훈@2008-07-29 14:52:57
        string sReceiver;

        if (value != "" && value != null && value.IndexOf('@') > -1)
        {
			string[] arrInfo = value.Split('@');

			sReceiver = arrInfo[1];
            sReceiver = COVIFlowCom.Common.splitNameExt(sReceiver, COVIFlowCom.Common.getLngIdx(Page.Culture));
        }
        else
        {
            sReceiver = "";
        }

        return sReceiver;
    }
}
