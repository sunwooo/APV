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
using System.Text;


/// <summary>
/// 결재문서의 결재선 조회 페이지
/// arhive 된 데이터 고려하여 조회함
/// </summary>
public partial class COVIFlowNet_ApvlineMgr_getapvsteps : PageBase
{
    private Boolean bArchived = false; //이관문서 체크

    /// <summary>
    /// 파라미터 설정
    /// 결재문서 결재선 조회 함수 호출
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        //'여기에 사용자 코드를 배치하여 페이지를 초기화합니다.
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        //Try

        StringBuilder strResponse = null;
        try
        {
            //code
            string piid = Request.QueryString["piid"];
            strResponse = new System.Text.StringBuilder();
            string scid = Request.QueryString["scid"];
            //string listid = Request.QueryString["listid"];
            String sArchived = Request.QueryString["archived"];
            if (sArchived != null && sArchived.ToUpper() == "Y") bArchived = true;

            //2006.4.7 사원 이후창 주석 처리
            //아래 주석 코드 사용 안함
            //if (listid != "")
            //{
            //    strResponse.Append(GetPrivateStep(listid));
            //}
            //else 
            if (piid != null)
            {
                strResponse.Append(GetPiStep(piid, scid));
            }
            else
            {
                strResponse.Append("<steps initiatorcode='" + Session["user_code"].ToString());
                strResponse.Append("' initiatoroucode='" + Session["user_dept_code"].ToString());
                strResponse.Append("' status='inactive'/>");
            }
            string strComp = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
            strResponse = strResponse.Replace(strComp, "");
            Response.Write(strResponse.ToString());
        }
        catch (System.Exception ex)
        {
            HandleException(ex);
        }
        finally
        {
            if (strResponse != null)
            {
                strResponse = null;
            }
        }
    }

    /// <summary>
    /// 파라미터에 따른 결재선 가져오기
    /// </summary>
    /// <param name="sPIID">결재문서 process instance id(piid) </param>
    /// <param name="sSCID">결재문서 사용 양식 프로세스 id (scid) </param>
    /// <returns></returns>
    public string GetPiStep(string sPIID, string sSCID)
    {
        string strBusinessState = "";
        System.Xml.XmlDocument oXML = new System.Xml.XmlDocument();
        System.Xml.XmlElement oSchema = null;
        try
        {
            //code
            String strSchemaID = sSCID;
            //2009.03 : Guid 변경
            if (strSchemaID != null && strSchemaID.IndexOf("{") > -1) strSchemaID = COVIFlowCom.Common.ConvertGuid(strSchemaID);

            oSchema = pGetSchema(strSchemaID);
            strBusinessState = COVIFlowCom.Common.GetPropertyValue("WfProcessInstance", "id", "", sPIID, "", "BUSINESS_STATE");

            return COVIFlowCom.Common.getApproveSteps(sPIID, oSchema, strBusinessState, Server.MachineName);
        }
        catch (System.Exception ex)
        {
            throw ex;
        }
        finally
        {
            //code
            if (oXML != null)
            {
                oXML = null;
            }
            if (oSchema != null)
            {
                oSchema = null;
            }

        }

    }
    /// <summary>
    /// 양식프로세스 상세 내역 조회
    /// </summary>
    /// <param name="sSCID">양식프로세스 id(scid)</param>
    /// <returns></returns>
    public System.Xml.XmlElement pGetSchema(string sSCID)
    {
        
        CfnFormManager.WfFormManager objMTS = null;
        CfnFormManager.WfFormSchema oFS = null;
        try
        {
            objMTS = new CfnFormManager.WfFormManager();
            oFS = (CfnFormManager.WfFormSchema)objMTS.GetDefinitionEntity(sSCID, CfnFormManager.CfFormEntityKind.fekdFormSchema);
            //CfnFormManager.CfFormEntityKind.fekdFormSchema 
            //주 끝
            System.Xml.XmlDocument oXML = new System.Xml.XmlDocument();
            oXML.LoadXml(oFS.Context);
            return oXML.DocumentElement;
        }
        catch (System.Exception ex)
        {
            
            throw ex;
        }
        finally
        {
            //code
            if (objMTS != null)
            {
                objMTS.Dispose();
                objMTS = null;
            }
        }
    }

    /// <summary>
    /// 오류 메시지 출력
    /// </summary>
    /// <param name="_Ex">Error 객체</param>
    public void HandleException(System.Exception _Ex)
    {
        //Try
        try
        {
            Response.Write
                (
                "<response>"
                + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)).Replace("\"\"", "\\\"\"")
                + "</response>"
                );
        }

        catch (Exception Ex)
        {
            Response.Write(
                "<response>"
                + COVIFlowCom.ErrResult.ReplaceErrMsg(Ex.Message).Replace("\"\"", "\\\"\"")
                + "</response>"
                );
        }
    }

    /// <summary>
    /// DB의 Null 값 확인
    /// Null인 경우 "" 값 넘김
    /// </summary>
    /// <param name="p">null 확인 객체</param>
    /// <returns></returns>
    private string pCheckDBNull2String(object p)
    {
        if (p == System.DBNull.Value)
        {
            return "";
        }
        else
        {
            return Convert.ToString(p);
        }
    }
}
