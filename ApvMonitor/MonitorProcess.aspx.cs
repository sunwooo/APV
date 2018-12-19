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


/// <summary>
/// 결재문서 단계 조회 - 현재 사용 안함
/// 결재문서 상태 변화 단계별로 설명됨
/// </summary>
public partial class COVIFlowNet_ApvMonitor_MonitorProcess : PageBase
{
    public string gString;
    protected void Page_Load(object sender, EventArgs e)
    {   
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;

        string sPIID = Request["piid"];
        CfnCoreEngine.WfAdministrationQuery oAdmin = new CfnCoreEngine.WfAdministrationQuery();
        CfnCoreEngine.WfWorkitemQueryManager oWIMgr = new CfnCoreEngine.WfWorkitemQueryManager();

        System.Text.StringBuilder sbResponse = null;
        System.Xml.XmlDocument oXMLDoc = null;
        System.Xml.XmlNodeList oNodeList = null;
        try
        {
            string sPPiid;
            sPPiid = oAdmin.GetPropertyValue("WfProcessInstance", sPIID, "parentPiid").ToString();
            if(sPPiid != null) sPPiid = "";
            string sUsePIID;

            if(sPPiid != "") //'Draft, Request 
                sUsePIID = sPPiid;
            else
                sUsePIID = sPIID;
            
            //Dim aWIEFs() As CfnDatabaseUtility.WfEntityFilter = { _
            //    New CfnDatabaseUtility.WfEntityFilter("id", Nothing, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopNone, False), _
            //    New CfnDatabaseUtility.WfEntityFilter("PF_SUB_KIND", Nothing, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopIn, False), _
            //    New CfnDatabaseUtility.WfEntityFilter("PF_STATE", Nothing, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, False) _
            //}
            CfnDatabaseUtility.WfEntityFilter[] aWIEFs = {
                new CfnDatabaseUtility.WfEntityFilter("id", null, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopNone, false),
                new CfnDatabaseUtility.WfEntityFilter("PF_SUB_KIND", null, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopIn, false),
                new CfnDatabaseUtility.WfEntityFilter("PF_STATE", null, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, false)
            };
            
            aWIEFs[0].PropertyValue = "( PI_PPI_ID = '" + sUsePIID + "' OR PI_ID = '" + sUsePIID + "')";
            aWIEFs[1].PropertyValue = "('A','S','R','P','REQCMP','T001','T002','T003')";
            aWIEFs[2].PropertyValue = CfnEntityClasses.CfPerformerState.pfstAssigned.ToString();
            //Dim aWIESs() As CfnDatabaseUtility.WfEntitySorter = { _
            // New CfnDatabaseUtility.WfEntitySorter("WI_CREATED", CfnDatabaseUtility.WfEntitySorter.ESSorterDirection.stdrAscending) _
            // }
            CfnDatabaseUtility.WfEntitySorter[] aWIESs = {                
                new CfnDatabaseUtility.WfEntitySorter("WI_CREATED", CfnDatabaseUtility.WfEntitySorter.ESSorterDirection.stdrAscending)
            };

            string sWI = oWIMgr.GetWorklist(aWIEFs, aWIESs, 0, 0);
            oXMLDoc = new System.Xml.XmlDocument();
            oXMLDoc.LoadXml(sWI);
            oNodeList = oXMLDoc.DocumentElement.ChildNodes;
            oXMLDoc = null;
            sbResponse = new System.Text.StringBuilder();    
            foreach(System.Xml.XmlNode oNode in oNodeList)
            {
                sbResponse.Append("<TR class='rowunselected'><TD>");
                switch(oNode["PF_SUB_KIND"].InnerText)
                {
                    case "A":
                        sbResponse.Append("기안부서결재</TD>");
                        break;
                    case "S":
                        sbResponse.Append("발신함</TD>");
                        break;
                    case "P":
                        sbResponse.Append("대외공문발신함</TD>");
                        break;
                    case "REQCMP":
                        sbResponse.Append("신청서처리함</TD>");
                        break;
                    case "T001":
                        sbResponse.Append("시행문발송</TD>");
                        break;
                    case "R":
                        sbResponse.Append("수신,신청접수</TD>");
                        break;
                    case "T002":
                        sbResponse.Append("대외공문변환</TD>");
                        break;
                    case "T003":
                        sbResponse.Append("대외공문직인</TD>");
                        break;
                    default :
                        sbResponse.Append(oNode["PF_SUB_KIND"].InnerText + "</TD>");
                        break;
                }
                
                sbResponse.Append("<TD>" + oNode["PF_PERFORMER_NAME"].InnerText + "</TD>");
                sbResponse.Append("<TD>" + pMakeState(oNode["WI_STATE"].InnerText) + "</TD>");
                sbResponse.Append("<TD>" + oNode["WI_CREATED"].InnerText.Replace("T", " ").Substring(0, 16) + "</TD>");
                sbResponse.Append("<TD>" + COVIFlowCom.Common.GetProp((System.Xml.XmlElement)oNode, "WI_FINISHED", false).Replace("T", " ").Substring(0, 16) + "</TD>");
                
                sbResponse.Append("</TR>");
            }

            gString = sbResponse.ToString();
            sbResponse = null;
            System.EnterpriseServices.ServicedComponent.DisposeObject(oAdmin);
            oAdmin = null;

            System.EnterpriseServices.ServicedComponent.DisposeObject(oWIMgr);
            oWIMgr = null;
        }
        catch(System.Exception Ex)
        {
            COVIFlowCom.ErrResult.HandleException(Response, Ex);
            
        }
        finally
        {
            if(oXMLDoc !=null)
            {
                oXMLDoc = null;
            }
            if(sbResponse != null)
            {
                sbResponse = null;
            }
            if (oWIMgr != null)
            {
                System.EnterpriseServices.ServicedComponent.DisposeObject(oWIMgr);
                oWIMgr = null;
            }

            if (oAdmin != null)
            {
                System.EnterpriseServices.ServicedComponent.DisposeObject(oAdmin);
                oAdmin = null;
            }
        }        
    }

    public string pMakeState(string sWI_STATE)
    {
        string RtnValue;
        if(sWI_STATE == CfnEntityClasses.CfInstanceState.instClosed_Completed.ToString()) 
            RtnValue = "완료";
        else 
            RtnValue = "대기";

        return RtnValue;
    }
}
