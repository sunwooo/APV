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
using COVIFlowCom;


/// <summary>
/// 회람 Process 처리 페이지
/// </summary>
public partial class COVIFlowNet_Circulation_Circulation : PageBase
{
	Guid _send_id;
    AccepData _accData = new AccepData();
    string userid = "";
    string strKind = "";
    //string Receipt_type = "";

    /// <summary>
    /// 파라미터 설정
    /// 처리함수 호출
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        if(Request.QueryString["userid"].ToString() != null)
            userid = Request.QueryString["userid"].ToString();    
        if (Request.QueryString["kind"].ToString() != null)
            strKind = Request.QueryString["kind"].ToString();

        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.CacheControl = "no-cache";
        Response.Buffer = true;
        Response.Write("<?xml version='1.0'?><response>");
        try
        {
            XmlDocument objXml = this.RequestXml();
            Response.Write(this.XmlHandle(objXml));
        }
        catch (Exception ex)
        {
            HandleException(ex);
        }
        finally
        {
            Response.Write("</response>");
        }
    }
        
    //xml 받는 부분
    /// <summary>
    /// Request Stream 내역 xml로 추출
    /// </summary>
    /// <returns></returns>
    private XmlDocument RequestXml()
    {
        XmlDocument objXml = null;
        try
        {
            objXml = new XmlDocument();
            objXml.Load(Request.InputStream);

            return objXml;
        }
        catch(Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (objXml != null)
            {
                objXml = null;
            }
        }
    }

    /// <summary>
    /// xml 내 파라미터에 따른 처리함수 호출
    /// </summary>
    /// <param name="objXml">처리요청 XML</param>
    /// <returns></returns>
    private string XmlHandle(XmlDocument objXml)
    {
        XmlElement nRoot = objXml.DocumentElement;
        string strReturn = "ERROR";

        try
        {
            if(nRoot.Name.ToString().Trim() == "impoinsert")
                strReturn = this.NewUpdate(objXml);
            else if(nRoot.Name.ToString().Trim() == "impoupdate")
                strReturn = this.OldUpdate(objXml);
            else if(nRoot.Name.ToString().Trim() == "impodelete")
                strReturn = this.DeleteUpdate(objXml);
            else
                strReturn = "ERROR";           

            return strReturn;
        }
        catch(Exception ex)
        {
            throw new Exception(null, ex);
        }
    }

    /// <summary>
    /// 회람 신규 발송 처리(발송/수신/메일알림)
    /// </summary>
    /// <param name="objXml">신규발송 내역</param>
    /// <returns></returns>
    private string NewUpdate(XmlDocument objXml)
    {
        Boolean bHead = false;
        Boolean bBody = false;
        string strDate = System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

        try
        {
            //회람발송신규 id 생성
            _send_id = _accData.MadkSendId();

            string Form_inst_id = objXml.SelectSingleNode("impoinsert/head/Form_inst_id").InnerText;
            string Process_id = objXml.SelectSingleNode("impoinsert/head/Process_id").InnerText;
            string Sender_id = objXml.SelectSingleNode("impoinsert/head/Sender_id").InnerText;
            string Sender_name = objXml.SelectSingleNode("impoinsert/head/Sender_name").InnerText;
            string Sender_ou_id = objXml.SelectSingleNode("impoinsert/head/Sender_ou_id").InnerText;
            string Sender_ou_name = objXml.SelectSingleNode("impoinsert/head/Sender_ou_name").InnerText;
            string Form_name = objXml.SelectSingleNode("impoinsert/head/Form_name").InnerText;
            string Subject = objXml.SelectSingleNode("impoinsert/head/Subject").InnerText;
            string Link_URL = objXml.SelectSingleNode("impoinsert/head/Link_URL").InnerText;
            string Comment = objXml.SelectSingleNode("impoinsert/head/Comment").InnerText;
            string Send_date = strDate;

            //회람발송 내역 생성
            bHead = _accData.InsertHeadData(_send_id, Form_inst_id, Process_id, Sender_id, Sender_name, Sender_ou_id, Sender_ou_name, Form_name, Subject, Link_URL, Comment, Send_date);
            
            string[] aReceipt_id = new string [objXml.SelectNodes("/impoinsert/body/detail").Count];
            string strState = "";
            
            //회람 수신목록 생성
            if(bHead == true)
            {               
                XmlNodeList bodynode;
                bodynode = objXml.SelectNodes("/impoinsert/body/detail");
                int i = 0;
                foreach(XmlNode node in bodynode)
                {
                    string Receipt_id = node.SelectSingleNode("Receipt_id").InnerText;
                    string Receipt_name = node.SelectSingleNode("Receipt_name").InnerText;
                    string Receipt_ou_id = node.SelectSingleNode("Receipt_ou_id").InnerText;
                    string Receipt_ou_name = node.SelectSingleNode("Receipt_ou_name").InnerText;
                    string Receipt_gp_name = node.SelectSingleNode("Receipt_gp_name").InnerText;
                    string Receipt_state = node.SelectSingleNode("Receipt_state").InnerText;
                    string Receipt_date = node.SelectSingleNode("Receipt_date").InnerText;
//                    string Kind_data = node.SelectSingleNode("Kind_data").InnerText;
                    string Receipt_type = "P";
                    if (Receipt_id == "") Receipt_type = "O";
                    string state = node.SelectSingleNode("state").InnerText;
                    strState = state;
                    //string Receipt_date = strDate;
                    aReceipt_id[i] = Receipt_id;

                    //부서배포인 경우 receipt id를 부서로 함
                    if (Receipt_id == "")
                    {
                        Receipt_id = Receipt_ou_id;
                        Receipt_name = Receipt_ou_name;
                    }

                    //부품개발요청서로 인한 추가
                    string strdivision = node.SelectSingleNode("DIVISION").InnerText;
                    i = i + 1;
                    //bBody = _accData.InsertBodyData(_send_id, Form_inst_id, Receipt_id, Receipt_name, Receipt_ou_id, Receipt_ou_name, Receipt_state, Receipt_date);
                    //2006.12 UI 변경건으로 추가
                    try
                    {
                        strKind = node.SelectSingleNode("Receipt_kind_code").InnerText;
                    }
                    catch (System.Exception ex)
                    {
                        throw ex;
                    } 

                    bBody = _accData.InsertBodyData(_send_id, Form_inst_id, Receipt_id, Receipt_name, Receipt_ou_id, Receipt_ou_name, Receipt_state, Send_date, strKind, Receipt_type, state, Receipt_gp_name, strdivision);
                }
            }

            if(bBody == true && bHead == true)
            {
                //메일 보내기 - 완료된 문서에 대해서 회람자 추가할 경우 회람자에게 가는 메일
                System.Xml.XmlDocument oApvList = null;
                System.Xml.XmlNode oCharge = null;
                System.Xml.XmlDocument oXML = null;
                System.Xml.XmlNode oFNode = null;
                System.Text.StringBuilder sbMailBody = null;

                try
                {
                    if (strKind == "2" && strState == "528")
                    {

						System.String sSubject = "[" + Resources.Approval.lbl_circulation + "][" + Form_name + "]" + Subject;// +"(" + oCharge.Attributes["name"].Value + "/" + oCharge.SelectSingleNode("taskinfo").Attributes["datecompleted"].Value.Substring(0, 10) + ")";
                        oCharge = null;
                        oXML = new System.Xml.XmlDocument();
                        oXML.LoadXml(Link_URL);
                        oFNode = oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");
                        oXML = null;
                        sbMailBody = new System.Text.StringBuilder();
						sbMailBody.Append("<MAIL>");
						sbMailBody.Append("<TITLE><![CDATA[").Append(Resources.Approval.lbl_Notice_mail).Append("]]></TITLE>");
						sbMailBody.Append("<CONTENT BOLD='NO'><![CDATA[[");
						sbMailBody.Append(Form_name).Append(" - ");
						sbMailBody.Append(Subject);
						sbMailBody.Append("(").Append(Resources.Approval.lbl_circulation).Append(")");
						sbMailBody.Append("]]]></CONTENT>");
						sbMailBody.Append("<CONTENT BOLD='YES'><![CDATA[[");
						sbMailBody.Append(Comment);
						sbMailBody.Append("]]]></CONTENT>"); 
						sbMailBody.Append("<URL><![CDATA[");
						sbMailBody.Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString());
                        sbMailBody.Append("Approval/Forms/Form.aspx?");
                        sbMailBody.Append("mode=COMPLETE");
                        sbMailBody.Append("&piid=").Append(Process_id);
                        sbMailBody.Append("&fmid=").Append(oFNode.Attributes["id"].Value);
                        sbMailBody.Append("&fmpf=").Append(oFNode.Attributes["prefix"].Value);
                        sbMailBody.Append("&fmrv=").Append(oFNode.Attributes["revision"].Value);
                        sbMailBody.Append("&fiid=").Append(oFNode.Attributes["instanceid"].Value);
                        sbMailBody.Append("&scid=").Append(oFNode.Attributes["schemaid"].Value);
                        sbMailBody.Append("&secdoc=").Append(oFNode.Attributes["secure_doc"].Value);
						sbMailBody.Append("]]></URL></MAIL>");
                        oFNode = null;
						string sContents = string.Empty;
						//html 포맷 맞추기 
						System.IO.StringWriter oTW = null;
						try
						{
							System.Xml.Xsl.XsltSettings settings = new System.Xml.Xsl.XsltSettings(true, true);
							System.Xml.Xsl.XslCompiledTransform xslsteps = new System.Xml.Xsl.XslCompiledTransform();
							{//이준희(2010-10-07): Changed to support SharePoint environment.
							//xslsteps.Load(Server_MapPath("\\\\CoviWeb\\common\\Mail.xsl"), settings, new System.Xml.XmlUrlResolver());
							xslsteps.Load(cbsg.CoviServer_MapPath("\\\\CoviWeb\\common\\Mail.xsl"), settings, new System.Xml.XmlUrlResolver());
							}
							System.Xml.XPath.XPathDocument oXPathDoc = new System.Xml.XPath.XPathDocument(new System.IO.StringReader(sbMailBody.ToString()));
							oTW = new System.IO.StringWriter();
							xslsteps.Transform(oXPathDoc, null, oTW);
							oTW.GetStringBuilder().Remove(0, 39);
							sContents = oTW.ToString();
							oTW.Close();
							oTW = null;
						}
						catch (System.Exception ex)
						{
						}
						finally
						{
							if (oTW != null)
							{
								oTW.Close();
								oTW = null;
							}
						}

                        CfnCoreEngine.WfOrganizationQueryManager OManager = new CfnCoreEngine.WfOrganizationQueryManager();
                        try
                        {
                            //개인발송
                            foreach (String sReceipt_id in aReceipt_id)
                            {
                                if (sReceipt_id != "")
                                {
                                    String[] sRecipientPersons = new string[1];
                                    sRecipientPersons[0] = sReceipt_id;
                                    try
                                    {
                                        //2013-07-05 hyh 수정
                                        //Common.SendMessage(
                                        Common.SendMessage2(
                                        //2013-07-05 hyh 수정 끝
                                            sSubject,
                                            Sender_id,
                                            sRecipientPersons,
                                            CfnEngineInterfaces.IWfOrganization.OMEntityType.ettpPerson,
                                            System.Net.Mail.MailPriority.Normal,
                                            true,
											sContents,
                                            //2013-07-05 hyh 추가
                                            Session["user_language"].ToString()
                                            //2013-07-05 hyh 추가 끝
                                            );
                                    }
                                    catch (System.Exception sendmailex)
                                    {
                                        //throw new System.Exception(null, sendmailex.InnerException);
                                    }
                                }
                            }
                            //부서발송
                            XmlNodeList mailou;
                            mailou = objXml.SelectNodes("/impoinsert/body/detail[Receipt_id='']");
                            foreach (XmlNode node in mailou)
                            {
                                string Receipt_ou_id = node.SelectSingleNode("Receipt_ou_id").InnerText;
                                //부서 --> 소속원 찾아서 메일 보내기
                                System.Xml.XmlDocument oOUInfo = OManager.GetOMEntityInfo(
                                "exec usp_GetPersonMail '" + Receipt_ou_id + "'  ",
                                CfnEngineInterfaces.IWfOrganization.OMEntityType.ettpPerson);
                                String[] sRecipients = new string[oOUInfo.SelectNodes("om/person").Count];
                                int j = 0;
                                foreach (System.Xml.XmlNode oOU in oOUInfo.SelectNodes("om/person"))
                                {
                                    if (Sender_id != oOU.Attributes["code"].Value) //부서회람 시 발송자 자신은 뺀다.
                                    {
                                        sRecipients[j] = oOU.Attributes["code"].Value;
                                        j++;
                                    }
                                }
                                //2013-07-05 hyh 수정
                                //Common.SendMessage(
                                Common.SendMessage2(
                                //2013-07-05 hyh 수정 끝
                                    sSubject,
                                    Sender_id,
                                    sRecipients,
                                    CfnEngineInterfaces.IWfOrganization.OMEntityType.ettpPerson,
                                    System.Net.Mail.MailPriority.Normal,
                                    true,
									sContents,
                                    //2013-07-05 hyh 추가
                                    Session["user_language"].ToString()
                                    //2013-07-05 hyh 추가 끝
                                    );
                            }

                        }
                        catch (Exception sendmail)
                        {
                            //Response.Write("<script language=jscript>alert(\"" + sendmail.Message + "\"); window.close();</script>");
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
                }
                catch (Exception ex)
                {
                    throw new Exception(null, ex);
                    //Response.Write("<script language=jscript>alert(\"" + ex.Message + "\"); window.close();</script>");
                }
                finally
                {
                    if (oApvList != null)
                    {
                        oApvList = null;
                    }
                    if (oCharge != null)
                    {
                        oCharge = null;
                    }
                    if (oXML != null)
                    {
                        oXML = null;
                    }
                    if (oFNode != null)
                    {
                        oFNode = null;
                    }
                    if (sbMailBody != null)
                    {
                        sbMailBody = null;
                    }
                }
                return "OK";
            }
            else
                return "ERROR";
        }
        catch(Exception ex)
        {
            throw new Exception(null, ex);
            //Response.Write("<script language=jscript>alert(\"" + ex.Message + "\"); window.close();</script>");
        }
    }

    /// <summary>
    /// 회람 읽은 일자 적용
    /// </summary>
    /// <param name="objXml">읽은내역</param>
    /// <returns></returns>
    private string OldUpdate(XmlDocument objXml)
    {
        try
        {
            string send_id = objXml.SelectSingleNode("//send_id").InnerText;

            if(_accData.UpdateData(new System.Guid(send_id), userid) == true)
                return "OK";
            else
                return "ERROR";            
        }
        catch(Exception ex)
        {
            throw new Exception(null, ex);
        }
    }

    /// <summary>
    /// 회람내역 삭제
    /// </summary>
    /// <param name="objXml"></param>
    /// <returns></returns>
    private string DeleteUpdate(XmlDocument objXml)
    {
        try
        {
            string send_id = objXml.SelectSingleNode("//send_id").InnerText;
            string sSQL = "DELETE FROM WF_CIRCULATION_SEND WHERE SEND_ID = '" + send_id + "' DELETE FROM WF_CIRCULATION_RECEIPT WHERE SEND_ID = '" + send_id + "' ";

            if(_accData.DeleteData(send_id) == true)
                return "OK";
            else
                return "ERROR";            
        }
        catch(Exception ex)
        {
            throw new Exception(null, ex);
        }
    }

    /// <summary>
    /// 에러메시지 처리
    /// </summary>
    /// <param name="_Ex"> Exception 객체</param>
    private void HandleException(System.Exception _Ex)
    {
        try
        {

            Response.Write("<error><![CDATA[" + COVIFlowCom.ErrResult.ReplaceErrMsg(COVIFlowCom.ErrResult.ParseStackTrace(_Ex)) + "]]></error>");
        }
        catch (System.Exception Ex)
        {
            Response.Write("<error><![CDATA[" + Ex.Message + "]]></error>");
        }
    }
}
