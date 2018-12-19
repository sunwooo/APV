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


// <summary>
// 시  스  템 : WP2.0
// 단위시스템 : Approval
// 프로그램명 : 전자결재 Woitem Instance 완료처리 요청(RequestCompleted)
// 모  듈  명 : switchWI2Complete
// 파  일  명 : switchWI2Complete.aspx
// 설      명 : 결재하기(일괄결재) / 결재연동 오류 재처리 시도
// </summary>
// <history>
// CH00 2007/07/16 황선희 : 최초 작성
// 
// </history>
public partial class COVIFlowNet_Admin_InstMgr_switchWI2Complete : System.Web.UI.Page
{
    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];

    /// <summary>
    /// 다국어 설정
    /// 결재선 데이터 존재 여부에 따른 workitem instance 완료요청
    /// 결재선데이터 있을 경우 : 전자결재 결재완료요청
    /// 결재선데이터 없을 경우 : 전자결재 연도오류 재처리요청
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        //다국어 언어설정
        if (Session["user_language"] != null)
        {
            strLangID = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
        }
        string culturecode = strLangID;	//"ko-KR"; "en-US"; "ja-JP";
        Page.UICulture = culturecode;
        Page.Culture = culturecode;

        Response.AddHeader("pragma", "no-cache");
        Response.AddHeader("cache-control", "private");
        Response.ContentType = "text/xml";
        Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
        CfnCoreEngine.WfWorkitemManager oWIMgr = null;

        try
        {
            //code
            oWIMgr = new CfnCoreEngine.WfWorkitemManager();

            System.Xml.XmlDocument oRequestXML = COVIFlowCom.Common.ParseRequestBytes(Request);
            System.Xml.XmlNodeList oItems = oRequestXML.SelectNodes("//item");
            System.String sWIID;
            System.String sPFID;
            System.String sPTID;
            System.String sSK;
            System.String sUSID;
            System.String sUSAPPROVER;
            System.String sAPV;
            if (oRequestXML.SelectSingleNode("//apv") != null)
            {
                #region 전자결재 결재완료요청
                if (oItems.Count > 0)
                {
                    //결재 관련 Relevant Data 설정
                    System.Collections.Specialized.NameValueCollection oWLRDIs = new System.Collections.Specialized.NameValueCollection();
                    oWLRDIs.Add("ActionState", "approve");
                    //201108
                    if (oRequestXML.SelectSingleNode("//usit") != null)
                    {
                        oWLRDIs.Add("SignImageType", oRequestXML.SelectSingleNode("//usit").InnerText);
                    }
                    else
                    {
                        oWLRDIs.Add("SignImageType", "");
                    }
                    //oWLRDIs.Add("SignImageType", "sign_" + oItems[0].Attributes["usid"].Value + "_0.gif");
                    sUSAPPROVER = "";// oRequestXML.SelectSingleNode("//usapprover").InnerText;
                    sAPV = oRequestXML.SelectSingleNode("//apv").InnerXml.ToString();
                    if (sAPV != "")
                    {
                        oWLRDIs.Add("APPROVERCONTEXT", sAPV);
                    }
                    foreach (System.Xml.XmlNode oItem in oItems)
                    {
                        sWIID = oItem.Attributes["wiid"].Value;
                        sPFID = oItem.Attributes["pfid"].Value;
                        sPTID = oItem.Attributes["ptid"].Value;
                        sSK = oItem.Attributes["pfsk"].Value;
                        sUSID = oItem.Attributes["usid"].Value;

                        if (sPTID != sUSID)
                        {
                            //대신결재의 경우 대리자 정보를 건네줘야함 - 대리자 정보넘김
                            if (sSK == "T000" || sSK == "T004" || sSK == "T009" || sSK == "T016")
                            {
                                oWIMgr.RequestComplete(sWIID, sPFID, oWLRDIs, null, null, "BATCH", sUSID, string.Empty, null);
                            }
                            //담당업무함의 경우 접수자 정보를 건네줘야 함 - businessData로 넘기가 
                            //수신부서 자동결재선 지정이 필요한 경우 처리
                            //접수자정보@접수자N+1결재자 넘김
                            if (sSK == "T008" || sSK == "R" || sSK == "AS" || sSK == "AD")
                            {
                                oWIMgr.RequestComplete(sWIID, sPFID, oWLRDIs, null, sUSID + "@" + sUSAPPROVER, "BATCH", string.Empty, string.Empty, null);

                            }
                        }
                        else
                        {
                            if (sSK == "T008")
                            {
                                oWIMgr.RequestComplete(sWIID, sPFID, oWLRDIs, null, sUSID + "@" + sUSAPPROVER, "BATCH", string.Empty, string.Empty, null);
                            }
                            else
                            {
                                oWIMgr.RequestComplete(sWIID, sPFID, oWLRDIs, null, null, "BATCH", string.Empty, string.Empty, null);
                            }
                        }

                    }
                }
                //Response.Write(Resources.Approval.msg_117); //성공적으로 저장하였습니다.
                Response.Write(Resources.Approval.msg_153); //성공적으로 결재하였습니다.
                #endregion
            }else{
                #region 연동오류 재처리 시도
                    if (oItems.Count > 0)
                    {
                        foreach (System.Xml.XmlNode oItem in oItems)
                        {
                            sWIID = oItem.Attributes["wiid"].Value;
                            sPFID = oItem.Attributes["pfid"].Value;
                            oWIMgr.RequestComplete(sWIID,sPFID,null,null,null,null,null,null,null);
                        }
                    }
                    Response.Write(Resources.Approval.msg_117);
                #endregion
            }
        }
        catch (System.Exception ex)
        {
            Response.Write("<error>" + Server.HtmlEncode(COVIFlowCom.ErrResult.ParseStackTrace(ex)) + "</error>");
        }
        finally
        {
            //code
            if (oWIMgr != null)
            {
                oWIMgr.Dispose();
                oWIMgr = null;
            }
            Response.Write("</response>");
        }
    }
}
