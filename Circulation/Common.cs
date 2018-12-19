using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

using Covision.Framework;
using Covision.Framework.Data.Business;
using System.Xml;
using System.Text;

/// <summary>
/// 전자결재 공통 함수 
/// </summary>

namespace COVIFlowCom
{
    public class Common
    {
        public const long HKEY_LOCAL_MACHINE = -2147483646;
        public const String CONST_FILE_FRONT_ROOT = "/FrontStorage/Approval/";
        public const String CONST_FILE_COMMENT_PATH = "/BackStorage/e-sign/ApprovalComment/";
        public const Int64 CONST_FILE_COUNT = 5000;
        public const Int64 CONST_COMMENT_LENGTH = 250;
        public const String C_UPLOAD_IMAGE_DIRECTORY = "/FrontStorage/Approval/IMAGEATTACH";

        public Common()
        {
            //

            // TODO: Add constructor logic here
            //

        }

        /// <summary>
        /// xml 특정 node의 값 추출
        /// </summary>
        /// <param name="ParentNode">대상 부모 node</param>
        /// <param name="Name">xml node명</param>
        /// <param name="RaiseException">오류처리여부</param>
        /// <returns>string</returns>
        public static string GetProp(System.Xml.XmlElement ParentNode, String Name, System.Boolean RaiseException)
        {
            try
            {
                System.Xml.XmlNode oNode = ParentNode.SelectSingleNode(Name);
                if (oNode.GetType() == typeof(System.Xml.XmlAttribute))
                {
                    return oNode.Value;
                }
                else
                {
                    return oNode.InnerText;
                }
            }
            catch (Exception Ex)
            {
                if (RaiseException)
                {
                    throw new System.Exception("ParentNode[" + ParentNode.Name + "],ChildName[" + Name + "]", Ex);
                }
                else
                {
                    return "";
                }

            }
        }

        /// <summary>
        /// xml 특정 node의 값 추출
        /// </summary>
        /// <param name="ParentNode">대상 부모 node</param>
        /// <param name="Name">xml node명</param>
        /// <returns>string</returns>
        public static string GetProp(System.Xml.XmlElement ParentNode, String Name)
        {
            return GetProp(ParentNode, Name, false);
        }

        /// <summary>
        /// 저장소 ID 조회
        /// </summary>
        /// <param name="strStorageID">Storage id</param>
        /// <returns>string</returns>
        public static string GetStorageURL(string strStorageID)
        {
            CfnFormManager.WfFormManager objMTS = null;
            DataSet DS=null;
            string strStroageURL = "";

            try
            {
                objMTS = new CfnFormManager.WfFormManager();
                string strQuery = " SELECT STORAGE_ID, CATEGORY_ID, SERVER_NAME, VOLUME_NAME, FTP_USER, FTP_PASSWORD, STORAGE_STATUS  FROM STORAGE_SERVER  WHERE STORAGE_ID = " + strStorageID + " ORDER BY STORAGE_ID ";

                DS = objMTS.LookupData(CfnFormManager.CfDatabaseType.dbtpDefinition, null, strQuery, "COVIFlowForm");
                if (DS != null)
                {
                    if (DS.Tables[0].Rows.Count > 0)
                    {
                        DataRow DR;
                        DR = DS.Tables[0].Rows[0];
                        if (DR["STORAGE_ID"].ToString() != null || DR["STORAGE_ID"].ToString() != "")
                        {
                            strStroageURL = DR["SERVER_NAME"].ToString() + DR["VOLUME_NAME"].ToString();
                        }
                    }
                    else
                    {
                        throw new Exception("Storage 저장소 값이 존재하지 않습니다");
                    }
                }
                return strStroageURL;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            finally
            {
                if (objMTS != null)
                {
                    objMTS.Dispose();
                    objMTS = null;
                }
                if (DS != null) {
                    DS.Dispose();
                    DS = null;
                }
            }
        }

        /// <summary>
        /// 저장소 경로 조회
        /// </summary>
        /// <param name="strStorageID">Storage id</param>
        /// <returns>string</returns>
        public static string GetStoragePath(string strStorageID)
        {
            StringBuilder sb = null;
            CfnFormManager.WfFormManager oFM = new CfnFormManager.WfFormManager();
            DataSet DS = null;
            string strStroageURL = "";
            try
            {
                sb = new StringBuilder();
                oFM = new CfnFormManager.WfFormManager();

                sb.Append(" SELECT STORAGE_ID, CATEGORY_ID, SERVER_NAME, VOLUME_NAME, FTP_USER, FTP_PASSWORD, STORAGE_STATUS ");
                sb.Append(" FROM STORAGE_SERVER " + " WHERE STORAGE_ID = ").Append(strStorageID).Append(" ORDER BY STORAGE_ID ");
                DS = oFM.LookupData(CfnFormManager.CfDatabaseType.dbtpDefinition, null, sb.ToString(), "COVIFlowForm");
                if (DS != null)
                {
                    if (DS.Tables[0].Rows.Count > 0)
                    {
                        DataRow DR;
                        DR = DS.Tables[0].Rows[0];
                        if (DR["STORAGE_ID"].ToString() != null || DR["STORAGE_ID"].ToString() != "")
                        {
                            strStroageURL = DR["VOLUME_NAME"].ToString();
                        }
                    }
                    return strStroageURL;
                }
                else
                {
                    throw new Exception("Storage 저장소 값이 존재하지 않습니다");
                }

            }
            catch (Exception Ex)
            {
                throw new Exception(null, Ex);
            }
            finally
            {
                if (oFM != null)
                {
                    oFM.Dispose();
                    oFM = null;
                }
                if (DS != null)
                {
                    DS.Dispose();
                    DS = null;
                }
                if (sb != null)
                {
                    sb = null;
                }
            }

        }

        /// <summary>
        /// 활성 저장소 조회
        /// </summary>
        /// <param name="strCategory">Storage category</param>
        /// <returns>DataSet</returns>
        public static DataSet GetActiveStorageInfo(string strCategory)
        {
            CfnFormManager.WfFormManager oFM = null;
            System.Text.StringBuilder sb = null;
            DataSet DS = null;
            try
            {
                oFM = new CfnFormManager.WfFormManager();
                sb = new System.Text.StringBuilder();

                sb.Append(" SELECT STORAGE_ID, CATEGORY_ID, SERVER_NAME, VOLUME_NAME, FTP_USER, FTP_PASSWORD, STORAGE_STATUS ");
                sb.Append(" FROM STORAGE_SERVER ");
                sb.Append(" WHERE STORAGE_STATUS = 'Y'");
                sb.Append(" AND CATEGORY_ID = '").Append(strCategory).Append("'");
                sb.Append(" ORDER BY STORAGE_ID ");

                DS = oFM.LookupData(CfnFormManager.CfDatabaseType.dbtpDefinition, null, sb.ToString(), "COVIFlowForm");
                return DS;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            finally
            {
                if (oFM != null)
                {
                    oFM.Dispose();
                    oFM = null;
                }
                if (sb != null)
                {
                    sb = null;
                }
            }
        }

        /// <summary>
        /// job function 별 담당자 여부 조회
        /// </summary>
        /// <param name="sUserID">사용자 id</param>
        /// <param name="sAuthority">job function(담당업무) code</param>
        /// <param name="sFrontName">webserver이름(사용안함)</param>
        /// <returns>Boolean</returns>
        public static System.Boolean getAuthority(String sUserID, String sAuthority, String sFrontName)
        {
            Boolean bAuthority = false;
            DataPack INPUT =null;
            DataSet oDS = null;
            try
            {
                //code
                INPUT = new DataPack();
                oDS = new DataSet();

                INPUT.add("@PERSON_CODE", sUserID);
                INPUT.add("@JF_CODE", sAuthority);

                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
                    oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_getJFAuth", INPUT);
                }
                if (oDS.Tables[0].Rows.Count > 0)
                {
                    bAuthority = true;
                }

            }
            catch (System.Exception ex)
            {
                
            }
            finally
            {
                //code
                if (INPUT != null)
                {
                    INPUT.Dispose();
                    INPUT = null;
                }
                if (oDS != null)
                {
                    oDS.Dispose();
                    oDS = null;
                }
            }
            return bAuthority;
        }

        /// <summary>
        /// 부서 내 문서관리자 존재 여부 조회
        /// </summary>
        /// <param name="sEntCode">회사 code</param>
        /// <param name="sDeptCode">부서 code</param>
        /// <param name="sJFCode">담당업무코드(문서수발담당)</param>
        /// <returns>Boolean</returns>
        public static System.Boolean getDocmanager(String sEntCode, String sDeptCode, String sJFCode)
        {
            Boolean bDocmanager = false;
            DataPack INPUT =null;
            DataSet oDS = null;
            try
            {
                INPUT = new DataPack();
                oDS = new DataSet();

                INPUT.add("@JF_CODE", sJFCode);
                INPUT.add("@UNIT_CODE", sDeptCode);
                INPUT.add("@ENT_CODE", sEntCode);
                
                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
                    oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_getUnitJFMembers", INPUT);
                }
                if (oDS.Tables[0].Rows.Count > 0)
                {
                    bDocmanager = true;
                }

            }
            catch (System.Exception ex)
            {

            }
            finally
            {
                //code
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
            return bDocmanager;
        }

        /// <summary>
        /// 메일발송
        /// </summary>
        /// <param name="Subject">메일제목</param>
        /// <param name="SenderID">발송자id</param>
        /// <param name="RecipientID">수신자id 배열</param>
        /// <param name="RecipientType">조직도 객체 Type</param>
        /// <param name="Priority">메일우선순위</param>
        /// <param name="bHtml">메일본문html여부</param>
        /// <param name="Body">메일본문</param>
        /// <returns></returns>
        public static void SendMessage(String Subject, String SenderID, String[] RecipientID,

                    CfnEngineInterfaces.IWfOrganization.OMEntityType RecipientType, System.Net.Mail.MailPriority Priority,

                    bool bHtml, String Body)
        {

            CfnCoreEngine.WfOrganizationQueryManager OManager = null;

            try
            {
                OManager = new CfnCoreEngine.WfOrganizationQueryManager();
                System.Net.Mail.MailAddress from;
                System.Xml.XmlDocument oXML = OManager.GetPersonInfo(SenderID);
                System.Xml.XmlNode oNode = oXML.DocumentElement.FirstChild;

                if (oNode == null)
                {
                    throw new System.Exception("This sender[" + SenderID + "] doesn't exist.");
                }

                from = new System.Net.Mail.MailAddress(oNode.Attributes["email"].Value, EscapeEMailName(oNode.Attributes["name"].Value));
                OManager = new CfnCoreEngine.WfOrganizationQueryManager();

                oXML = OManager.GetOMEntityInfo(RecipientID, RecipientType);

                if (oXML.DocumentElement.ChildNodes.Count == 0)
                {
                    throw new System.Exception("These recipients[" + String.Join(",", RecipientID) + "] don't exist.");
                }

                System.Net.Mail.MailMessage oNewMsg = new System.Net.Mail.MailMessage();

                oNewMsg.From = from;

                foreach (System.Xml.XmlNode oNodeTo in oXML.DocumentElement.ChildNodes)
                {
                    oNewMsg.To.Add(new System.Net.Mail.MailAddress(oNodeTo.Attributes["email"].Value, EscapeEMailName(oNodeTo.Attributes["name"].Value)));
                }

                oNewMsg.Subject = Subject;
                oNewMsg.Priority = Priority;
                oNewMsg.IsBodyHtml = bHtml;
                oNewMsg.Body = Body;

                System.Net.Mail.SmtpClient oSmtp = new System.Net.Mail.SmtpClient(System.Configuration.ConfigurationManager.AppSettings["SMTPMailServer"].ToString());
                oSmtp.Send(oNewMsg);

            }

            catch (Exception Ex)
            {
                throw Ex;
            }

            finally
            {
                if (OManager != null)
                {
                    OManager.Dispose();
                    OManager = null;
                }
            }
        }

        /// <summary>
        /// 메일발송 (발송자,수신자성명 다국어처리) HIW
        /// </summary>
        /// <param name="Subject">메일제목</param>
        /// <param name="SenderID">발송자id</param>
        /// <param name="RecipientID">수신자id 배열</param>
        /// <param name="RecipientType">조직도 객체 Type</param>
        /// <param name="Priority">메일우선순위</param>
        /// <param name="bHtml">메일본문html여부</param>
        /// <param name="Body">메일본문</param>
        /// <param name="pLangCode">다국어코드</param>
        /// <returns></returns>
        public static void SendMessage2(String Subject, String SenderID, String[] RecipientID, CfnEngineInterfaces.IWfOrganization.OMEntityType RecipientType, System.Net.Mail.MailPriority Priority, bool bHtml, String Body, string pLangCode)
        {
            CfnCoreEngine.WfOrganizationQueryManager OManager = null;

            try
            {
                OManager = new CfnCoreEngine.WfOrganizationQueryManager();
                System.Net.Mail.MailAddress from;
                System.Xml.XmlDocument oXML = OManager.GetPersonInfo(SenderID);
                System.Xml.XmlNode oNode = oXML.DocumentElement.FirstChild;

                if (oNode == null)
                {
                    throw new System.Exception("This sender[" + SenderID + "] doesn't exist.");
                }

                from = new System.Net.Mail.MailAddress(oNode.Attributes["email"].Value, EscapeEMailName(GetMultLanNm(oNode.Attributes["name"].Value, pLangCode)));
                OManager = new CfnCoreEngine.WfOrganizationQueryManager();

                oXML = OManager.GetOMEntityInfo(RecipientID, RecipientType);

                if (oXML.DocumentElement.ChildNodes.Count == 0)
                {
                    throw new System.Exception("These recipients[" + String.Join(",", RecipientID) + "] don't exist.");
                }

                System.Net.Mail.MailMessage oNewMsg = new System.Net.Mail.MailMessage();

                oNewMsg.From = from;

                foreach (System.Xml.XmlNode oNodeTo in oXML.DocumentElement.ChildNodes)
                {
                    oNewMsg.To.Add(new System.Net.Mail.MailAddress(oNodeTo.Attributes["email"].Value, EscapeEMailName(GetMultLanNm(oNodeTo.Attributes["name"].Value, pLangCode))));
                }

                oNewMsg.Subject = Subject;
                oNewMsg.Priority = Priority;
                oNewMsg.IsBodyHtml = bHtml;
                oNewMsg.Body = Body;

                System.Net.Mail.SmtpClient oSmtp = new System.Net.Mail.SmtpClient(System.Configuration.ConfigurationManager.AppSettings["SMTPMailServer"].ToString());
                oSmtp.Send(oNewMsg);

            }

            catch (Exception Ex)
            {
                throw Ex;
            }

            finally
            {
                if (OManager != null)
                {
                    OManager.Dispose();
                    OManager = null;
                }
            }
        }

        /// <summary>
        /// 메일발송(smtp server 주소 파라미터 포함)
        /// </summary>
        /// <param name="url">smtp server 주소(메일발송처리 http url)</param>
        /// <param name="from">발송자 메일주소</param>
        /// <param name="to">받는사람 메일주소</param>
        /// <param name="cc">참조 메일주소</param>
        /// <param name="bcc">숨김참조 멩리주소</param>
        /// <param name="subject">제목</param>
        /// <param name="xml">메일본문(xml)</param>
        /// <param name="xsl">메일본문Letter지 XSL</param>
        /// <returns>bool</returns>
        public static bool SendHTTP(string url, System.Net.Mail.MailAddress from, string to, string cc, string bcc, string subject, string xml, string xsl)
		{
			System.Net.Mail.SmtpClient smtp = null;
			System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage();

			message.From = from;

			if (to.Length > 2)
			{
				System.String[] ArrayTo = to.Split('|');
				foreach (System.String item in ArrayTo)
				{
					if (item.Split(';').Length > 1)
					{
						message.To.Add(new System.Net.Mail.MailAddress(item.Split(';')[0], item.Split(';')[1]));
					}
					else
					{
						message.To.Add(new System.Net.Mail.MailAddress(item.Split(';')[0]));
					}
				}
			}
			if (cc.Length > 2)
			{
				System.String[] ArrayCC = cc.Split('|');
				foreach (System.String item in ArrayCC)
				{
					if (item.Split(';').Length > 1)
					{
						message.CC.Add(new System.Net.Mail.MailAddress(item.Split(';')[0], item.Split(';')[1]));
					}
					else
					{
						message.CC.Add(new System.Net.Mail.MailAddress(item.Split(';')[0]));
					}
				}
			}
			if (bcc.Length > 2)
			{
				System.String[] ArrayBCC = bcc.Split('|');
				foreach (System.String item in ArrayBCC)
				{
					if (item.Split(';').Length > 1)
					{
						message.Bcc.Add(new System.Net.Mail.MailAddress(item.Split(';')[0], item.Split(';')[1]));
					}
					else
					{
						message.Bcc.Add(new System.Net.Mail.MailAddress(item.Split(';')[0]));
					}
				}
			}
			//message = new MailMessage(from, to, subject, makeHTML(xml, xsl));
			message.Subject = subject;
			message.IsBodyHtml = true;
			//message.Body = makeHTML(xml, xsl);
			message.Body = "111";
			smtp = new System.Net.Mail.SmtpClient(url);
			smtp.Send(message);
			
			return true;
		}


        /// <summary>
        /// 결재선 조회
        /// </summary>
        /// <param name="sPIID">process id</param>
        /// <param name="oSchema">양식프로세스(옵션) id</param>
        /// <param name="strBusinessState">process business state</param>
        /// <param name="front_name">web server명(사용안함)</param>
        /// <returns>String</returns>
        public static String getApproveSteps(String sPIID, System.Xml.XmlElement oSchema, String strBusinessState, String front_name)
        {
            String strDebuginfo = "";
            DataSet oDS = null;
            DataPack INPUT = null;
            try
            {
                oDS = new System.Data.DataSet();
                string sAuthDeptPiid = "";
                //합의부서기안으로 들어온 경우 Pinstance의 PPID의 결재선정보를 가져와야 함.
                //합의부서기안(InLine SubProcess)대기
                if (strBusinessState == "01_02_03" || strBusinessState == "02_03_03" || strBusinessState == "03_01_03" || strBusinessState == "03_01_04" || strBusinessState == "03_01_05")
                {
                    string sPPiid;
                    sPPiid = GetPropertyValue("WfProcessInstance", "id", "", sPIID, "", "PARENT_PROCESS_ID");
                    if (sPPiid == "")
                    {
                        sPPiid = "";
                    }
                    strDebuginfo = strDebuginfo + "합의부서기안(InLine SubProcess)대기 bstate=" + strBusinessState + "sPIID : " + sPIID + "--- sppiid : " + sPPiid;
                    sAuthDeptPiid = sPPiid;
                }
                else
                {
                    //담당수신부서가 있는 경우(제신청서)
                    //결재 서브프로세스는 발신/수신 합쳐 최대 2개임을 가정. -> 1개로 변경
                    if (oSchema.GetAttribute("scDRec") == "1" || oSchema.GetAttribute("scChgr") == "1" || oSchema.GetAttribute("scChgrOU") == "1")
                    {
                        String sPPiid;
                        sPPiid = GetPropertyValue("WfProcessInstance", "id", "", sPIID, "", "PARENT_PROCESS_ID");
                        if (sPPiid == null)
                        {
                            sPPiid = "";
                        }
                        //발신부서 열람자가 발신부서 결재 완료(승인/반려)된 후 여는 경우
                        if (sPPiid != "")
                        {
                            string sParentBST = GetPropertyValue("WfProcessInstance", "id", "", sPPiid, "", "BUSINESS_STATE");
                            if (sParentBST == null)
                            {
                                sParentBST = "";
                            }

                            if ((strBusinessState == "02_01_01" || strBusinessState == "02_02_01")
                                && (sParentBST == "01_01_02" || sParentBST.StartsWith("02_")))
                            {

                                strDebuginfo = strDebuginfo + "발신부서 열람자가 발신부서 결재 완료(승인/반려)된 후 여는 경우 bstate=" + strBusinessState + " pbstate=" + sParentBST;

                            //    CfnDatabaseUtility.WfEntityFilter[] aEFs ={
                            //new CfnDatabaseUtility.WfEntityFilter("parentPiid",sPPiid, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true),
                            //new CfnDatabaseUtility.WfEntityFilter("id", sPIID, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopNotEqual,true) 
                            //};
                            //    sAuthDeptPiid = Convert.ToString(oAdmin.GetPropertyValue("WfProcessInstance", aEFs, "id"));
                                sAuthDeptPiid = GetPropertyValue("WfProcessInstance", "parentPiid", "id", sPPiid, sPIID, "PROCESS_ID");
                            }
                        }
                        else
                        {
                            strDebuginfo = strDebuginfo + "발신부서 결재가 없으면서 기안자가 열람한 경우 bstate=" + strBusinessState;
                        //    CfnDatabaseUtility.WfEntityFilter[] aEFs = {
                        //    new CfnDatabaseUtility.WfEntityFilter("parentPiid",sPIID,CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true)
                        //};
                        //    sAuthDeptPiid = Convert.ToString(oAdmin.GetPropertyValue("WfProcessInstance", aEFs, "id"));
                            sAuthDeptPiid = GetPropertyValue("WfProcessInstance", "parentPiid", "", sPIID, "", "PROCESS_ID");
                        }
                        if (sAuthDeptPiid == null)
                        {
                            sAuthDeptPiid = "";
                        }
                        if (sAuthDeptPiid != "")
                        {
                            sPIID = sAuthDeptPiid;
                        }

                    }

                }
                if (sAuthDeptPiid == null)
                {
                    sAuthDeptPiid = "";
                }
                if (sAuthDeptPiid != "")
                {
                    sPIID = sAuthDeptPiid;
                }

                //현재 선택된 프로세스의 state가 완료일 경우 상위 프로세스의 결재선을 보여준다.
                //1. 상위프로세스가 없는 경우 현재 선택된 프로세스의 결재선을 보여준다.
                //2. 상위프로세스가 존재하면서 완료인 경우 상위 프로세스를 찾고 1,2를 반복한다.
                //Int16 iPIState = Convert.ToInt16(oAdmin.GetPropertyValue("WfProcessInstance", sPIID, "state"));
                //String sBSState = Convert.ToString(oAdmin.GetPropertyValue("WfProcessInstance", sPIID, "businessState"));
                //String sPIName = Convert.ToString(oAdmin.GetPropertyValue("WfProcessInstance", sPIID, "name"));

                Int16 iPIState = 0;
                String sBSState = "";
                String sPIName = "";
                String szResult = GetPropertyValue("WfProcessInstance", "id", "", sPIID, "", "STATE, BUSINESS_STATE, NAME");
                if (szResult.IndexOf("`") > -1)
                {
                    string[] aResult = szResult.Split('`');
                    iPIState = Convert.ToInt16(aResult[0]);
                    sBSState = aResult[1];
                    sPIName = aResult[2];
                }


                // 수신부서 처리일 경우 본부서 결재선을 보여줌
                // 부모 프로세스가 품의서, 업연 프로세스 이면서 수신처리 일 경우 해당 프로세스 결재선을 보여준다.
                if (
                    (sPIName == "Subprocess of ProcessInstance[ApprovalSystem-Draft]"
                    ||
                    sPIName == "Subprocess of ProcessInstance[ApprovalSystem-Coordinate]")
                    &&
                    (sBSState == "01_01_02" || sBSState == "02_01_02" || sBSState == "02_01_03" ||
                    sBSState == "02_02_02" || sBSState == "03_01_02" || sBSState == "03_01_06")
                  )
                {
                }
                else if (sBSState == "01_02_03" || sBSState == "02_03_03" || sBSState == "03_01_04" || sBSState == "03_01_05")
                {
                }
                //2013-04-17 hyh 추가
                else if (sPIName == "ApprovalSystem-Basic" && sBSState == "02_01_02" && Convert.ToString(GetPropertyValue("WfProcessInstance", "id", "", sPIID, "", "PARENT_PROCESS_ID")) != "")
                {
                }
                //2013-04-17 hyh 추가 끝
                else
                {

                    //process 완료
                    while (iPIState == 528)
                    {
                        string sPPiid;
                        //sPPiid = Convert.ToString(oAdmin.GetPropertyValue("WfProcessInstance", sPIID, "parentPiid"));
                        sPPiid = Convert.ToString(GetPropertyValue("WfProcessInstance", "id", "", sPIID, "", "PARENT_PROCESS_ID"));
                        if (sPPiid == "")
                        {
                            iPIState = 600;
                        }
                        else
                        {
                            sPIID = sPPiid;
                            //iPIState = Convert.ToInt16(oAdmin.GetPropertyValue("WfProcessInstance", sPPiid, "state"));
                            iPIState = Convert.ToInt16(GetPropertyValue("WfProcessInstance", "id", "", sPPiid, "", "STATE"));
                        }

                    }

                }

                INPUT = new DataPack();
                INPUT.add("@process_id", sPIID);
                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                    oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "usp_wf_get_domaindata01", INPUT);
                }

                String sApvs = System.String.Empty;
                if (oDS == null)
                {
                }
                else
                {
                    if (oDS.Tables[0].Rows.Count > 0)
                    {
                        sApvs = Convert.ToString(oDS.Tables[0].Rows[0][0]);
                    }
                    else
                    {
                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ARCHIVE_ConnectionString").ToString();
                            oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "usp_wf_get_domaindata01", INPUT);
                        }
                        if (oDS.Tables[0].Rows.Count > 0)
                        {
                            sApvs = Convert.ToString(oDS.Tables[0].Rows[0][0]);
                        }
                        else
                        {
                            using (SqlDacBase SqlDbAgent = new SqlDacBase())
                            {
                                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("STORE_ConnectionString").ToString();
                                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "usp_wf_get_domaindata01", INPUT);
                            }
                            if (oDS.Tables[0].Rows.Count > 0)
                            {
                                sApvs = Convert.ToString(oDS.Tables[0].Rows[0][0]);
                            }
                        }
                    }
                }
                return sApvs;
            }
            catch (Exception ex)
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

        /// <summary>
        /// 특정 디비 연결문자열 조회
        /// </summary>
        /// <param name="strDBName">대상 DB 이름</param>
        /// <returns>String</returns>
        public static String GetConnectString(string strDBName)
        {

            string ConnectStrings;
            try
            {
                ConnectStrings = Convert.ToString(System.Web.Configuration.WebConfigurationManager.ConnectionStrings["ConnectString"].ConnectionString);
                return ConnectStrings + "Initial Catalog=" + strDBName + ";";
            }
            catch (System.Exception ex)
            {
                throw ex;
            }

        }

        /// <summary>
        /// 특정 Process 상태 조회
        /// </summary>
        /// <param name="sPIID">process id</param>
        /// <returns>String</returns>
        public static String getProcessState(String sPIID)
        {
            CfnCoreEngine.WfAdministrationQuery oAdmin;
            oAdmin = new CfnCoreEngine.WfAdministrationQuery();
            try
            {
                return oAdmin.GetPropertyValue("WfProcessInstance", sPIID, "state").ToString();
            }
            catch (Exception ex)
            {
                throw new System.Exception(null, ex);
            }
            finally
            {
                if (oAdmin != null)
                {
                    System.EnterpriseServices.ServicedComponent.DisposeObject(oAdmin);
                    oAdmin = null;
                }
            }
        }

        /// <summary>
        /// 메일 사용자 이메일 주소 특수문자 처리
        /// </summary>
        /// <param name="Name">사용자 이메일 주소</param>
        /// <returns>String</returns>
        public static string EscapeEMailName(string Name)
        {
            char[] aChars = { '@', '<', '>', ';', ',' };
            string sName = String.Join("_", Name.Split(aChars));
            return sName;
        }

        /// <summary>
        /// xml, xslpath 넘겨서 경로 parsing
        /// </summary>
        /// <param name="sXML">대상 XML</param>
        /// <param name="sXSLPath">대상 XSL 파일 경로</param>
        /// <returns>String</returns>
        public static string pTransform(string sXML, System.String sXSLPath)
        {
            

            System.IO.StringReader oSR = new System.IO.StringReader(sXML.ToString());
            System.Xml.Xsl.XslCompiledTransform oXSLT = new System.Xml.Xsl.XslCompiledTransform();
            System.Xml.XPath.XPathDocument oXPathDoc = new System.Xml.XPath.XPathDocument(oSR);
            System.IO.StringWriter oSW = new System.IO.StringWriter();
            string sReturn = "";
            try
            {
                oXSLT.Load(sXSLPath);
                oXSLT.Transform(oXPathDoc, null, oSW);

                sReturn = oSW.ToString();

            }
            catch (System.Exception ex)
            {
                
                throw new System.Exception("pResolveXSL", ex);
            }
            finally
            {
                //code
                oSR.Close();
                oSR.Dispose();
                oSR = null;
                oXPathDoc = null;
                oSW.Close();
                oSW.Dispose();
                oSW = null;
                oXSLT = null;
            }
            return sReturn;
        }

        /// <summary>
        /// sql db type을 .net 기본 db type으로 변환
        /// </summary>
        /// <param name="sqlDbType">sql database type</param>
        /// <returns>System.Data.DbType </returns>
        public static System.Data.DbType SqlDbTypeToDbType(SqlDbType sqlDbType)
        {
            switch (sqlDbType)
            {
                case SqlDbType.BigInt: return DbType.Int64;
                case SqlDbType.Binary: return DbType.Binary;
                case SqlDbType.Bit: return DbType.Boolean;
                case SqlDbType.Char: return DbType.AnsiStringFixedLength;
                case SqlDbType.DateTime: return DbType.DateTime;
                case SqlDbType.Decimal: return DbType.Decimal;
                case SqlDbType.Float: return DbType.Double;
                case SqlDbType.Image: return DbType.Binary;
                case SqlDbType.Int: return DbType.Int32;
                case SqlDbType.Money: return DbType.Currency;
                case SqlDbType.NChar: return DbType.StringFixedLength;
                case SqlDbType.NText: return DbType.String;
                case SqlDbType.NVarChar: return DbType.String;
                case SqlDbType.Real: return DbType.Single;
                case SqlDbType.UniqueIdentifier: return DbType.Guid;
                case SqlDbType.SmallDateTime: return DbType.DateTime;
                case SqlDbType.SmallInt: return DbType.Int16;
                case SqlDbType.SmallMoney: return DbType.Currency;
                case SqlDbType.Text: return DbType.AnsiString;
                case SqlDbType.Timestamp: return DbType.Binary;
                case SqlDbType.TinyInt: return DbType.Byte;
                case SqlDbType.VarBinary: return DbType.Binary;
                case SqlDbType.VarChar: return DbType.AnsiString;
                case SqlDbType.Variant: return DbType.Object;
                case SqlDbType.Xml: return DbType.Xml;
                //default : throw ExceptionHelper.InvalidSqlDbType((int)sqlDbType);
                default: return DbType.Object;
            }
        }
        /// <summary>
        /// sqldb type(문자열)을 dbtype으로 변경
        /// </summary>
        /// <param name="sqlDbTypeName">sql db type 이름</param>
        /// <returns>System.Data.DbType </returns>
        public static System.Data.SqlDbType StringToSqlDbType(string sqlDbTypeName)
        {
            switch (sqlDbTypeName.ToLower())
            {
                case "bigint": return SqlDbType.BigInt;
                case "binary": return SqlDbType.Binary;
                case "bit": return SqlDbType.Bit;
                case "char": return SqlDbType.Char;
                case "datetime": return SqlDbType.DateTime;
                case "decimal": return SqlDbType.Decimal;
                case "float": return SqlDbType.Float;
                case "image": return SqlDbType.Image;
                case "int": return SqlDbType.Int;
                case "money": return SqlDbType.Money;
                case "nchar": return SqlDbType.NChar;
                case "ntext": return SqlDbType.NText;
                case "nvarchar": return SqlDbType.NVarChar;
                case "real": return SqlDbType.Real;
                case "uniqueidentifier": return SqlDbType.UniqueIdentifier;
                case "smalldatetime": return SqlDbType.SmallDateTime;
                case "smallint": return SqlDbType.SmallInt;
                case "smallmoney": return SqlDbType.SmallMoney;
                case "text": return SqlDbType.Text;
                case "timestamp": return SqlDbType.Timestamp;
                case "tinyint": return SqlDbType.TinyInt;
                case "varbinary": return SqlDbType.VarBinary;
                case "varchar": return SqlDbType.VarChar;
                case "variant": return SqlDbType.Variant;
                case "xml" : return SqlDbType.Xml;
                //default : throw ExceptionHelper.InvalidSqlDbType((int)sqlDbType);
                default: return SqlDbType.Variant;
            }
        }

        #region xmlParseing Handle
        /// <summary>
        /// Request 데이터 xml 변환
        /// </summary>
        /// <param name="Request">요청 웹페이지 객체</param>
        /// <returns>System.Xml.XmlDataDocument </returns>
        public static System.Xml.XmlDataDocument ParseRequestBytes(System.Web.HttpRequest Request)
        {
            XmlDataDocument oXMLData;
            oXMLData = new System.Xml.XmlDataDocument();
            System.Text.Decoder oDecoder = System.Text.Encoding.UTF8.GetDecoder();
            Byte[] aBytes = Request.BinaryRead(Request.TotalBytes);

            try
            {
                char[] aChars = new char[oDecoder.GetCharCount(aBytes, 0, aBytes.Length)];

                oDecoder.GetChars(aBytes, 0, aBytes.Length, aChars, 0);
                oXMLData.Load(new System.IO.StringReader(new String(aChars)));
                
                return  oXMLData;
            }
            catch (Exception exc)
            {
                throw new System.Exception("Requested Bytes Count = " + aBytes.Length.ToString() , exc);
            }
        }
        #endregion

        /// <summary>
        /// 신규 guid 생성
        /// </summary>
        /// <returns>String</returns>
        public static String NewGUID()
		{
			String tmpVal = "";
			tmpVal = System.Guid.NewGuid().ToString().Replace("-", "");

			tmpVal = "{" + tmpVal.ToUpper() + "}";
			return tmpVal;
		}
        ///////////////////////////////////////////////
        /////////////// 관리자 타입 ///////////////////
        ///////////////////////////////////////////////
        /// <summary>
        /// 관리자 타입  "SysAdmin" 전체 시스템관리자 ,"EntAdmin" 계열사 시스템관리자 "OperAdmin" 계열사별 업무 관리자 "" 관리자 아님
        /// </summary>
        /// <param name="strSysTotal"></param>
        /// <param name="strEntSys"></param>
        /// <param name="strEntOper"></param>
        /// <returns>string</returns>
        public static string GetAdminType(string strSysTotal, string strEntSys, string strEntOper)
        {
            StringBuilder sb = null;
            try
            {
                sb = new StringBuilder();
                //// 관리자 타입  "SysAdmin" 전체 시스템관리자 ,"EntAdmin" 계열사 시스템관리자 "OperAdmin" 계열사별 업무 관리자 "" 관리자 아님
                if (strSysTotal.Equals("Y"))
                {
                    sb.Append("SysAdmin");
                }
                else
                {
                    if (strEntSys.Length > 0)
                    {
                        sb.Append("EntAdmin");
                    }
                    else
                    {
                        if (strEntOper.Length > 0)
                        {
                            sb.Append("OperAdmin");
                        }
                        else
                        {
                            sb.Append("");
                        }
                    }
                }
                return sb.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (sb != null) sb = null;
            }
            return sb.ToString();
        }

        /// <summary>
        /// Guid 변경(구 datatype을 신버젼으로 변경)
        /// </summary>
        /// <param name="strOldGuid"></param>
        /// <returns>string</returns>
        public static string ConvertGuid(string strOldGuid)
        {
            string strNewGuid = string.Empty;

            strNewGuid = strOldGuid.Replace("{","").Replace("}","");
            strNewGuid = strNewGuid.Substring(0, 8) + "-" + strNewGuid.Substring(8, 4) + "-" + strNewGuid.Substring(12, 4) + "-" + strNewGuid.Substring(16, 4) + "-" + strNewGuid.Substring(20, 12);
            return strNewGuid;
        }

        ////////////////////////////////////////////////////////////////////
        /////////////// get workflow object property     ///////////////////
        ////////////////////////////////////////////////////////////////////
        /// <summary>
        /// 객체명, key 이름, key value 값을 넘겨서 원하는 column 값을 넘김
        /// </summary>
        /// <param name="strObjectName"></param>
        /// <param name="strKeyColumn1"></param>
        /// <param name="strKeyColumn2"></param>
        /// <param name="strKeyValue1"></param>
        /// <param name="strKeyValue2"></param>
        /// <param name="strColumnList"></param>
        /// <returns></returns>
        public static string GetPropertyValue(string strObjectName, string strKeyColumn1, string strKeyColumn2, string strKeyValue1, string strKeyValue2, string strColumnList)
        {
            string szReturn = string.Empty;
            DataSet oDS = null;
            StringBuilder sb = null;
            DataPack INPUT = null;
            try
            {
                oDS = new DataSet();
                sb = new StringBuilder();
                INPUT = new DataPack();
                INPUT.add("@ObjectName", strObjectName);
                INPUT.add("@KeyColumn1", strKeyColumn1);
                INPUT.add("@KeyColumn2", strKeyColumn2);
                INPUT.add("@KeyValue1", strKeyValue1);
                INPUT.add("@KeyValue2", strKeyValue2);
                INPUT.add("@ColumnList", strColumnList);

                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                {
                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();                              
                    oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure,"dbo.usp_wf_GetPropertyValue" ,INPUT);
                }

                if (oDS == null)
                {
                }
                else
                {
                    if (oDS.Tables[0].Rows.Count > 0)
                    {
                        int icount = strColumnList.Split(',').Length;
                        for (int i = 0; i < icount; i++)
                        {
                            if (sb.Length > 2)
                            {
                                sb.Append("`");
                            }
                            sb.Append(Convert.ToString(oDS.Tables[0].Rows[0][i]));
                        }
                        szReturn = sb.ToString();
                    }
                    else //archive db query
                    {
                        using (SqlDacBase SqlDbAgent = new SqlDacBase())
                        {
                            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ARCHIVE_ConnectionString").ToString();
                            oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wf_GetPropertyValue", INPUT);
                        }
                        if (oDS.Tables[0].Rows.Count > 0)
                        {
                            int icount = strColumnList.Split(',').Length;
                            for (int i = 0; i < icount; i++)
                            {
                                if (sb.Length > 2)
                                {
                                    sb.Append("`");
                                }
                                sb.Append(Convert.ToString(oDS.Tables[0].Rows[0][i]));
                            }
                            szReturn = sb.ToString();
                        }
                    }
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
                if (sb != null)
                {
                    sb = null;
                }
            }
            return szReturn;
        }

		/// <summary>
		/// 언어코드값 가져오기
		/// </summary>
		/// <param name="culturecode"></param>
		/// <returns></returns>
        public static string getLngIdx(string culturecode)
        {
            string szReturn = "0";
            switch (culturecode.ToUpper())
            {
                case "KO-KR": szReturn = "0"; break;
                case "EN-US": szReturn = "1"; break;
                case "JA-JP": szReturn = "2"; break;
                case "ZH-CN": szReturn = "3"; break;
            }
            return szReturn;
        }
		/// <summary>
		/// 선택 언어별 데이터 추출
		/// </summary>
		/// <param name="gLngIdx"></param>
		/// <param name="szLngLabel"></param>
		/// <param name="szType"></param>
		/// <returns></returns>
		public static string getLngLabel(string gLngIdx, string szLngLabel, Boolean szType)
		{
			string rtnValue = "";
			int idxlng = Convert.ToInt16(gLngIdx);
			if(szType){idxlng++;}
			string[] ary = szLngLabel.Split(';');
			if(ary.Length >= idxlng){
				rtnValue = ary[idxlng];
			}else{
				rtnValue = ary[0];
			}
			return rtnValue;
		}
		public static string splitName(string sValue, string szLangIndex)
		{
			int iLangIndex = Convert.ToInt16(szLangIndex);
			//string sName = sValue.Substring(sValue.LastIndexOf(";") + 1);
			//return sName == "" ? " " : sName;
			string[] ary = sValue.Split(';');
			if (ary.Length > 2)
			{
				if (ary.Length >= iLangIndex) { return ary[iLangIndex + 1]; } else { return ary[1]; }
			}//구데이터 처리
			else if (ary.Length == 2) { return ary[1]; }
			else
			{
				return "";
			}
		}
		public static string splitNameExt(string sValue, string szLangIndex)
		{
			//return sValue;
			int iLangIndex = Convert.ToInt16(szLangIndex);
			string[] ary = sValue.Split(';');
			if (ary.Length > iLangIndex) { return ary[iLangIndex]; } else { return ary[0]; }
		}


        /// <summary>
        /// 해당 다국어명 구하기 (HIW)
        /// </summary>
        /// <param name="pName"></param>
        /// <returns></returns>
        protected static string GetMultLanNm(string pName, string pLangCode)
        {
            string sRtnVal = String.Empty;
            string sCultureCode = pLangCode;  //"ko-KR" "en-US" "ja-JP" "zh-CN"

            int nLang = 0;
            if (sCultureCode.Equals("ko-KR"))
                nLang = 0;
            else if (sCultureCode.Equals("en-US"))
                nLang = 1;
            else if (sCultureCode.Equals("ja-JP"))
                nLang = 2;
            else if (sCultureCode.Equals("zh-CN"))
                nLang = 3;
            else
                nLang = 0;

            sRtnVal = pName.Split(';')[nLang];
            return sRtnVal;
        }


    }
}