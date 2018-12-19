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

/// <summary>
/// 담당자 지정
/// 수신/합의 담당자, 일괄 담당자 지정
/// </summary>
public partial class COVIFlowNet_Forms_ReassignWorkitem : PageBase
{
	protected void Page_Load(object sender, EventArgs e)
	{
		Response.ContentType = "text/xml";
		Response.Expires = -1;
		Response.CacheControl = "no-cache";
		Response.Buffer = true;

		Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");
		try
		{
			pProcessForm();
			System.EnterpriseServices.ContextUtil.SetComplete();
		}
		catch (System.Exception Ex)
		{
			System.EnterpriseServices.ContextUtil.SetAbort();
			HandleException(Ex);
		}
		finally
		{
			Response.Write("</response>");
		}
	}

	private void pProcessForm()
	{
		try
		{
			System.Xml.XmlDocument oFormXMLDOM = COVIFlowCom.Common.ParseRequestBytes(Request);

			string strIssueDocNO = "";

			System.Xml.XmlElement elmRoot = oFormXMLDOM.DocumentElement;
			string sMode = COVIFlowCom.Common.GetProp(elmRoot, "mode", false);

			if (strIssueDocNO != "") //'문서번호 발번 후 forminfoext 변환 
			{
				if (sMode == "SIGN") //'외부공문
				{
					oFormXMLDOM.DocumentElement.SelectSingleNode("forminfoext/forminfo/docinfo/outerpubdocno").InnerText = strIssueDocNO;
				}
				else if (sMode == "REDRAFT")
				{
					string sReceiveNO = oFormXMLDOM.DocumentElement.SelectSingleNode("formdata/RECEIVE_NO").InnerText;
					sReceiveNO = sReceiveNO + "[" + oFormXMLDOM.DocumentElement.SelectSingleNode("dpid").InnerText + "]" + strIssueDocNO + ";";
					oFormXMLDOM.DocumentElement.SelectSingleNode("formdata/RECEIVE_NO").InnerText = sReceiveNO;
				}
				else
				{
					oFormXMLDOM.DocumentElement.SelectSingleNode("formdata/DOC_NO").InnerText = strIssueDocNO;
				}
			}

			pReassignWorkItem(oFormXMLDOM);

			oFormXMLDOM = null;

			Response.Write("<success>" + Server.HtmlEncode(DateTime.Now.ToString()) + "</success>");
		}
		catch (System.Exception Ex)
		{
			throw new Exception(null, Ex);
		}
	}

	//'결재선변경
	//'
	//'workitem 재배정(부서/사용자 구분 및 pf_sk 종류 받을 것)
	private void pReassignWorkItem(System.Xml.XmlDocument oFormXMLDOM)
	{
		CfnCoreEngine.WfOrganizationManager oManager = null;
		CfnCoreEngine.WfAdministration oAdmin = null;
		CfnCoreEngine.WfProcessManager oPMgr = null;
		CfnCoreEngine.WfWorkitemManager WManager = null;

		string sPFSK = string.Empty;
		Boolean bVRUpdate = false;
		Boolean bSubApproval = false;
		CfnEntityClasses.WfProcessInstance oPI = null;
		try
		{
			oManager = new CfnCoreEngine.WfOrganizationManager();
			oAdmin = new CfnCoreEngine.WfAdministration();
			oPMgr = new CfnCoreEngine.WfProcessManager();
			WManager = new CfnCoreEngine.WfWorkitemManager();

			System.Xml.XmlElement elmRoot = oFormXMLDOM.DocumentElement;
			sPFSK = COVIFlowCom.Common.GetProp(elmRoot, "pfsk", true);
			oPI = oPMgr.GetEntity(COVIFlowCom.Common.GetProp(elmRoot, "piid", true));

			CfnDatabaseUtility.WfEntityFilter[] aEFs = {
					new CfnDatabaseUtility.WfEntityFilter("piid", COVIFlowCom.Common.GetProp(elmRoot, "piid", true), CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true),
					new CfnDatabaseUtility.WfEntityFilter("name", "APPROVERCONTEXT", CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true)
				};

			System.Collections.ArrayList oDDs = oAdmin.GetEntity(typeof(CfnEntityClasses.WfDomainDataInstance), aEFs);
			if (oDDs.Count == 0) //inLine SubProcess의 경우 Domain Data와 Global Data를 Parent Process를 공유한다.
			{
				bSubApproval = true;
				CfnDatabaseUtility.WfEntityFilter[] aPPDDEFs = {
					new CfnDatabaseUtility.WfEntityFilter("piid", oPI.parentPiid, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true),
					new CfnDatabaseUtility.WfEntityFilter("name", "APPROVERCONTEXT", CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true)
				};
				oDDs = oAdmin.GetEntity(typeof(CfnEntityClasses.WfDomainDataInstance), aPPDDEFs);
			}

			if (oDDs.Count > 0)
			{
				System.Xml.XmlDocument oXML = new System.Xml.XmlDocument();
				if (elmRoot.SelectSingleNode("apvlist/steps") != null)
				{
					oXML.LoadXml(elmRoot.SelectSingleNode("apvlist/steps").OuterXml.ToString());
				}
				CfnEntityClasses.WfDomainDataInstance oDDI = (CfnEntityClasses.WfDomainDataInstance)oDDs[0];

				System.Xml.XmlDocument oApvList = (System.Xml.XmlDocument)oDDI.value;//최종결재선
				System.Xml.XmlNode oApvRoot = oApvList.DocumentElement;
				System.Xml.XmlNode oStep;
				System.Xml.XmlNode oOU;
				if (COVIFlowCom.Common.GetProp(elmRoot, "admintype", true) == "ADMIN")
				{
					oApvList = (System.Xml.XmlDocument)oXML.Clone();
				}
				else
				{
					if (COVIFlowCom.Common.GetProp(elmRoot, "pfsk", true).IndexOf("T") > -1)
					{
						if (bSubApproval)
						{
							oStep = oApvRoot.SelectSingleNode("division[taskinfo/@status='pending']/step[(ou[taskinfo/@piid='" + oPI.id + "']/*/taskinfo/@status='pending' or ou/*/taskinfo/@status='reserved' )]");
						}
						else
						{
							oStep = oApvRoot.SelectSingleNode("division[taskinfo/@status='pending']/step[(ou/*/taskinfo/@status='pending' or ou/*/taskinfo/@status='reserved' )]");
						}
					}
					else
					{
						oStep = oApvRoot.SelectSingleNode("division[taskinfo/@status='pending']/step[(ou/taskinfo/@status='pending' or ou/taskinfo/@status='reserved' )]");
					}

					if (oXML.DocumentElement != null)
					{
						System.Xml.XmlNode oWLocalApvRoot = oXML.DocumentElement;
						System.Xml.XmlNode oWLocalStep = null;
						System.Xml.XmlNode oWLocalOU = null;
						System.Xml.XmlNode oWLocalPerson = null;
						if (COVIFlowCom.Common.GetProp(elmRoot, "pfsk", true).IndexOf("T") > -1)
						{
							//person forward
							if (bSubApproval)
							{
								oWLocalStep = oWLocalApvRoot.SelectSingleNode("division[taskinfo/@status='pending']/step[(ou[taskinfo/@piid='" + oPI.id + "']/*/taskinfo/@status='pending' or ou[taskinfo/@piid='" + oPI.id + "']/*/taskinfo/@status='reserved' )]");
							}
							else
							{
								oWLocalStep = oWLocalApvRoot.SelectSingleNode("division[taskinfo/@status='pending']/step[(ou/*/taskinfo/@status='pending' or ou/*/taskinfo/@status='reserved' )]");
							}
							//재기안으로 들어온 경우 결재선 생성 없이 담당자 변경 가능
							if (oWLocalStep != null)
							{
								if (bSubApproval)
								{
									oWLocalOU = oWLocalStep.SelectSingleNode("ou[taskinfo/@piid='" + oPI.id + "' and (*[((name()='person' and @code='" + COVIFlowCom.Common.GetProp(elmRoot, "id", true) + "') or (name()='role' and person/@code='" + COVIFlowCom.Common.GetProp(elmRoot, "id", true) + "')) and (taskinfo/@status='pending' or taskinfo/@status='reserved')])]");
								}
								else
								{
									oWLocalOU = oWLocalStep.SelectSingleNode("ou[*[((name()='person' and @code='" + COVIFlowCom.Common.GetProp(elmRoot, "id", true) + "') or (name()='role' and person/@code='" + COVIFlowCom.Common.GetProp(elmRoot, "id", true) + "')) and (taskinfo/@status='pending' or taskinfo/@status='reserved')]]");
								}

								if (oWLocalOU != null)
								{
									oWLocalPerson = oWLocalOU.SelectSingleNode("*[((name()='person' and @code='" + COVIFlowCom.Common.GetProp(elmRoot, "id", true) + "') or (name()='role' and person/@code='" + COVIFlowCom.Common.GetProp(elmRoot, "id", true) + "'))]");
									System.Xml.XmlNode oWLocalDelPerson = oWLocalOU.SelectSingleNode("*[((name()='person' and @code='" + COVIFlowCom.Common.GetProp(elmRoot, "usid", true) + "') or (name()='role' and person/@code='" + COVIFlowCom.Common.GetProp(elmRoot, "usid", true) + "'))]");
									if (oWLocalPerson != null)
									{
										string Tpfsk = COVIFlowCom.Common.GetProp(elmRoot, "pfsk", true);
										if (Tpfsk == "T000" || Tpfsk == "T004" || Tpfsk == "T009") { }
										else
										{
											oWLocalOU.RemoveChild(oWLocalDelPerson);
										}
									}
									if (oWLocalPerson != null)
									{
										oOU = oStep.SelectSingleNode("ou[*[((name()='person' and @code='" + COVIFlowCom.Common.GetProp(elmRoot, "usid", true) + "') or (name()='role' and person/@code='" + COVIFlowCom.Common.GetProp(elmRoot, "usid", true) + "')) and (taskinfo/@status='pending' or taskinfo/@status='reserved')]]");
										oOU.InnerXml = oWLocalOU.Clone().InnerXml;
									}
								}
							}
							bVRUpdate = true;
						}
						else
						{
							//ou forward - 전달이력 남기지 않음
							oOU = oStep.SelectSingleNode("ou[@piid='" + COVIFlowCom.Common.GetProp(elmRoot, "piid", true) + "' and taskinfo/@status='pending']");
							if (oOU == null)
							{
								oOU = oStep.SelectSingleNode("ou[@code='" + COVIFlowCom.Common.GetProp(elmRoot, "ptid", true) + "' and taskinfo/@status='pending']");
							}
							oWLocalStep = oWLocalApvRoot.SelectSingleNode("division[taskinfo/@status='pending']/step[(ou/*/taskinfo/@status='pending' or ou/*/taskinfo/@status='reserved' )]");
							if (oWLocalStep == null)
							{
								if (COVIFlowCom.Common.GetProp(elmRoot, "gubun", true) == "chargegroup")
								{
									oOU.Attributes["code"].Value = COVIFlowCom.Common.GetProp(elmRoot, "id", true);
									oOU.Attributes["name"].Value = COVIFlowCom.Common.GetProp(elmRoot, "name", true);
								}
								else
								{
									//부서로 들어온 문서를 담당자에게 전달함
									sPFSK = "T008"; //재기안
								}
							}
							else
							{
								//부서로 들어온 문서를 담당자에게 전달함
								sPFSK = "T008"; //재기안
								oWLocalOU = oWLocalStep.SelectSingleNode("ou[*[((name()='person' and @code='" + COVIFlowCom.Common.GetProp(elmRoot, "id", true) + "') or (name()='role' and person/@code='" + COVIFlowCom.Common.GetProp(elmRoot, "id", true) + "')) and (taskinfo/@status='pending' or taskinfo/@status='reserved')]]");
								oWLocalPerson = oWLocalOU.SelectSingleNode("*[((name()='person' and @code='" + COVIFlowCom.Common.GetProp(elmRoot, "id", true) + "') or (name()='role' and person/@code='" + COVIFlowCom.Common.GetProp(elmRoot, "id", true) + "'))]");
								if (oWLocalPerson != null)
								{
									oOU = oStep.SelectSingleNode("ou[@code='" + COVIFlowCom.Common.GetProp(elmRoot, "ptid", true) + "' and taskinfo/@status='pending']");
									oOU.InnerXml = oWLocalOU.Clone().InnerXml;
								}
							}
						}
					}
					else
					{
						sPFSK = "T008"; //2009.02.09 : 일괄담당자 지정 - 리스트 상에서 담당자 지정일경우 추가됨
					}
				}
				oDDI.value = oApvList.Clone();

				System.Collections.ArrayList oData = new System.Collections.ArrayList();
				oData.Add(oDDI);
				oAdmin.UpdateData(typeof(CfnEntityClasses.WfDomainDataHistory), oData, "CoviflowNET");

				if (bVRUpdate)
				{
					//전달자 변경
					//System.Collections.Specialized.ListDictionary oVRMembers = new System.Collections.Specialized.ListDictionary();
					//System.Xml.XmlNodeList oTransmitters = oApvRoot.SelectNodes("division/step/ou/*[taskinfo/@kind='conveyance']");
					//System.String sPersonCode = String.Empty;
					//System.String sPersonName = String.Empty;

					//foreach(System.Xml.XmlNode oTransmitrer in oTransmitters)
					//{
					//    if(oTransmitrer.Name == "person")
					//    {
					//        sPersonCode = oTransmitrer.Attributes["code"].Value;
					//        sPersonName = oTransmitrer.Attributes["name"].Value;
					//    }
					//    else if(oTransmitrer.Name == "role")
					//    {
					//        System.String sRoleCode = oTransmitrer.Attributes["code"].Value;

					//        if(sRoleCode == "UNIT_MANAGER")
					//        {
					//            sPersonCode = oTransmitrer.SelectSingleNode("person").Attributes["code"].Value;
					//            sPersonName = oTransmitrer.SelectSingleNode("person").Attributes["name"].Value;
					//        }
					//        else
					//        {
					//            sPersonCode = oTransmitrer.Attributes["code"].Value;
					//            sPersonName = oTransmitrer.Attributes["name"].Value;
					//        }
					//    }
					//    if(oVRMembers.Contains(sPersonCode) == false)
					//    {
					//        oVRMembers.Add(sPersonCode, sPersonName);
					//    }
					//}

					//if(oVRMembers.Count > 0)
					//{
					//    System.Collections.Hashtable PGlobal = oPMgr.GetGlobalRDICollection(COVIFlowCom.Common.GetProp(elmRoot, "piid", true));
					//    if (Convert.ToString(PGlobal["TransmitterWIID"]) != "" && Convert.ToString(PGlobal["TransmitterPFID"]) != null)
					//    {
					//        CfnDatabaseUtility.WfEntityFilter[] aEFTranmitters = {
					//         new CfnDatabaseUtility.WfEntityFilter("wiid", Convert.ToString(PGlobal["TransmitterWIID"]), CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true), 
					//         new CfnDatabaseUtility.WfEntityFilter("state", CfnEntityClasses.CfPerformerState.pfstAssigned, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true)
					//        };
					//        System.Collections.ArrayList oPFs = WManager.GetEntity(typeof(CfnEntityClasses.WfPerformer), aEFTranmitters);

					//        Int16 j = 0;
					//        foreach (CfnEntityClasses.WfPerformer oPF in oPFs)
					//        {
					//            if (j == 0)
					//            {
					//                PGlobal["TransmitterPFID"] = oPF.id;
					//                break;
					//            }
					//        }
					//        if (PGlobal["TransmitterPFID"].ToString() != "")
					//        {
					//            CfnEntityClasses.WfProcessInstance PInstance = oPMgr.GetEntity(COVIFlowCom.Common.GetProp(elmRoot, "piid", true));

					//            oManager.ResetVRoleMember(PInstance.pdid, PInstance.id, "Transmitter");
					//            oManager.InsertVRoleMember(PInstance.pdid, PInstance.id, "Transmitter", oVRMembers, CfnEntityClasses.CfParticipantKind.ptkdHuman, CfnCoreEngine.WfOrganizationManager.VRHandlerKey.pthkHumanSingle, null, "T016", false);


					//            CfnDatabaseUtility.WfEntityFilter[] aVREFs = {
					//               new CfnDatabaseUtility.WfEntityFilter("pdid", PInstance.pdid, CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true),
					//               new CfnDatabaseUtility.WfEntityFilter("name", "Transmitter", CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true)
					//           };
					//            System.Collections.ArrayList oVRs = WManager.GetEntity(typeof(CfnEntityClasses.WfVirtualRole), aVREFs);
					//            System.String oTaregetID = String.Empty;
					//            foreach (CfnEntityClasses.WfVirtualRole oVR in oVRs)
					//            {
					//                oTaregetID = oVR.id;
					//            }
					//            try
					//            {
					//                oManager.ReassignWorkitem(
					//                                 PGlobal["TransmitterWIID"].ToString(),
					//                                 PGlobal["TransmitterPFID"].ToString(),
					//                                  oTaregetID,
					//                                 "전달자",
					//                                 CfnEntityClasses.CfParticipantKind.ptkdVirtualRole,
					//                                 CfnCoreEngine.WfOrganizationManager.VRHandlerKey.pthkVRQueue,
					//                                 null,
					//                                 "T016",
					//                                  false);
					//            }
					//            catch (System.Exception exTrans)
					//            {
					//            }
					//        }
					//    }
					//}
				}
			}
			oPMgr.Dispose();
			oPMgr = null;
			WManager.Dispose();
			WManager = null;
			oAdmin.Dispose();
			oAdmin = null;

            if (sPFSK.IndexOf("T") > -1)
            {
                oManager.ReassignWorkitem(
                        COVIFlowCom.Common.GetProp(elmRoot, "wiid", true),
                        COVIFlowCom.Common.GetProp(elmRoot, "pfid", true),
                        COVIFlowCom.Common.GetProp(elmRoot, "id", true),
                        COVIFlowCom.Common.GetProp(elmRoot, "name", true),
                        CfnEntityClasses.CfParticipantKind.ptkdHuman,
                        CfnCoreEngine.WfOrganizationManager.VRHandlerKey.pthkHumanSingle,
                        null,
                        sPFSK,
                        false);

                if (sPFSK == "T009")
                {
                    //합의자 전달 시 안내 메일 발송
                    //CfnDatabaseUtility.WfEntityFilter[] aEFMails ={
                    //        new CfnDatabaseUtility.WfEntityFilter ("piid",Convert.ToString(COVIFlowCom.Common.GetProp(elmRoot, "piid", true)),CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual ,true),
                    //        new CfnDatabaseUtility.WfEntityFilter ("name",Convert.ToString("APPROVERCONTEXT"),CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true)
                    //    };
                    CfnCoreEngine.WfAdministration objMTS = new CfnCoreEngine.WfAdministration();
                    //oDDs = objMTS.GetEntity(typeof(CfnEntityClasses.WfDomainDataInstance), aEFMails);
                    CfnEntityClasses.WfDomainDataInstance oDDI = (CfnEntityClasses.WfDomainDataInstance)oDDs[0];
                    System.Xml.XmlDocument oApvList = (System.Xml.XmlDocument)oDDI.value;
                    System.Xml.XmlNode oCharge = oApvList.DocumentElement.SelectSingleNode("division/step/ou/person[taskinfo/@kind='charge']");


                    System.Xml.XmlDocument oXML = new System.Xml.XmlDocument();
                    oXML.LoadXml(oPI.description);
                    System.Xml.XmlNode oFNode = oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");

                    System.String sSubject = "[합의요청][" + COVIFlowCom.Common.GetProp(elmRoot, "fmnm", true) + "]" + oFNode.Attributes["subject"].Value + "(" + oCharge.Attributes["name"].Value + "/" + oCharge.SelectSingleNode("taskinfo").Attributes["datecompleted"].Value.Substring(0, 10) + ") 합의자 변경문서 입니다.";

                    System.Text.StringBuilder sbMailBody = new System.Text.StringBuilder();
                    sbMailBody.Append("<MAIL>");
                    sbMailBody.Append("<TITLE><![CDATA[").Append(Resources.Approval.lbl_Notice_mail).Append("]]></TITLE>");
                    sbMailBody.Append("<CONTENT BOLD='YES'><![CDATA[[");
                    sbMailBody.Append(COVIFlowCom.Common.GetProp(elmRoot, "fmnm", true)).Append(" - ");
                    sbMailBody.Append(oFNode.Attributes["subject"].Value);
                    sbMailBody.Append("(").Append(Resources.Approval.lbl_forward).Append(")");
                    sbMailBody.Append("]]]></CONTENT>");
                    sbMailBody.Append("<URL><![CDATA[");
                    sbMailBody.Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString());
                    sbMailBody.Append("Approval/Forms/Form.aspx?");
                    sbMailBody.Append("mode=APPROVAL");
                    sbMailBody.Append("&piid=").Append(oPI.id);
                    sbMailBody.Append("&wiid=").Append(COVIFlowCom.Common.GetProp(elmRoot, "wiid", true));
                    sbMailBody.Append("&bstate=").Append(oPI.businessState);
                    sbMailBody.Append("&fmid=").Append(oFNode.Attributes["id"].Value);
                    sbMailBody.Append("&fmpf=").Append(oFNode.Attributes["prefix"].Value);
                    sbMailBody.Append("&fmrv=").Append(oFNode.Attributes["revision"].Value);
                    sbMailBody.Append("&fiid=").Append(oFNode.Attributes["instanceid"].Value);
                    sbMailBody.Append("&scid=").Append(oFNode.Attributes["schemaid"].Value);
                    sbMailBody.Append("&secdoc=").Append(oFNode.Attributes["secure_doc"].Value);

                    CfnDatabaseUtility.WfEntityFilter[] aEFPFs = { 
						new CfnDatabaseUtility.WfEntityFilter("wiid", COVIFlowCom.Common.GetProp(elmRoot, "wiid", true), CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true), 
						new CfnDatabaseUtility.WfEntityFilter("performerId", COVIFlowCom.Common.GetProp(elmRoot, "id", true), CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true),
						new CfnDatabaseUtility.WfEntityFilter("state",CfnEntityClasses.CfPerformerState.pfstAssigned,CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true)
					};
                    System.Collections.ArrayList oPFs = objMTS.GetEntity(typeof(CfnEntityClasses.WfPerformer), aEFPFs);
                    foreach (CfnEntityClasses.WfPerformer oPF in oPFs)
                    {
                        sbMailBody.Append("&pfsk=").Append(oPF.subKind);
                        sbMailBody.Append("&pfid=").Append(oPF.id);
                        sbMailBody.Append("&ptid=").Append(COVIFlowCom.Common.GetProp(elmRoot, "id", true));
                    }
                    sbMailBody.Append("]]></URL></MAIL>");
                    string sContents = string.Empty;
                    //html 포맷 맞추기 
                    System.IO.StringWriter oTW = null;
                    try
                    {
                        System.Xml.Xsl.XsltSettings settings = new System.Xml.Xsl.XsltSettings(true, true);
                        System.Xml.Xsl.XslCompiledTransform xslsteps = new System.Xml.Xsl.XslCompiledTransform();
                        {//이준희(2010-10-07): Changed to support SharePoint environment.
                            //xslsteps.Load(Server_MapPath(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString() + "/common/Mail.xsl"), settings, new System.Xml.XmlUrlResolver());
                            xslsteps.Load(cbsg.CoviServer_MapPath(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString() + "/common/Mail.xsl"), settings, new System.Xml.XmlUrlResolver());
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


                    string[] aReceipt_id = new string[1];
                    aReceipt_id[0] = COVIFlowCom.Common.GetProp(elmRoot, "id", true);
                    try
                    {
                        //개인발송
                        Common.SendMessage(
                            sSubject,
                            COVIFlowCom.Common.GetProp(elmRoot, "usid", true),
                            aReceipt_id,
                            CfnEngineInterfaces.IWfOrganization.OMEntityType.ettpPerson,
                            System.Net.Mail.MailPriority.Normal,
                            true,
                            sContents);
                    }
                    catch (Exception sendmail)
                    {
                        throw new System.Exception(null, sendmail.InnerException);
                    }
                    finally
                    {
                        objMTS.Dispose();
                        objMTS = null;
                        sbMailBody = null;
                    }
                }
                else if (sPFSK == "T000")
                {
                    CfnCoreEngine.WfAdministration objMTS = new CfnCoreEngine.WfAdministration();
                    CfnEntityClasses.WfDomainDataInstance oDDI = (CfnEntityClasses.WfDomainDataInstance)oDDs[0];
                    System.Xml.XmlDocument oApvList = (System.Xml.XmlDocument)oDDI.value;
                    System.Xml.XmlNode oCharge = oApvList.DocumentElement.SelectSingleNode("division/step/ou/person[taskinfo/@kind='charge']");


                    System.Xml.XmlDocument oXML = new System.Xml.XmlDocument();
                    oXML.LoadXml(oPI.description);
                    System.Xml.XmlNode oFNode = oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");

                    System.String sSubject = "[결재문서 전달][" + COVIFlowCom.Common.GetProp(elmRoot, "fmnm", true) + "]" + oFNode.Attributes["subject"].Value; // +"(" + oCharge.Attributes["name"].Value + "/" + oCharge.SelectSingleNode("taskinfo").Attributes["datecompleted"].Value.Substring(0, 10) + ") 전달 된 결재문서 입니다.";

                    System.Text.StringBuilder sbMailBody = new System.Text.StringBuilder();
                    sbMailBody.Append("<MAIL>");
                    sbMailBody.Append("<TITLE><![CDATA[").Append(Resources.Approval.lbl_Notice_mail).Append("]]></TITLE>");
                    sbMailBody.Append("<CONTENT BOLD='YES'><![CDATA[[");
                    sbMailBody.Append(COVIFlowCom.Common.GetProp(elmRoot, "fmnm", true)).Append(" - ");
                    sbMailBody.Append(oFNode.Attributes["subject"].Value);
                    sbMailBody.Append("(").Append(Resources.Approval.lbl_forward).Append(")");
                    sbMailBody.Append("]]]></CONTENT>");
                    if (!COVIFlowCom.Common.GetProp(elmRoot, "apvcmt", true).Equals(string.Empty))
                    {
                        sbMailBody.Append("<CONTENT BOLD='YES'><![CDATA[[");
                        sbMailBody.Append(COVIFlowCom.Common.GetProp(elmRoot, "apvcmt", true));
                        sbMailBody.Append("]]]></CONTENT>");
                    }
                    sbMailBody.Append("<URL><![CDATA[");
                    sbMailBody.Append(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString());
                    sbMailBody.Append("Approval/Forms/Form.aspx?");
                    sbMailBody.Append("mode=APPROVAL");
                    sbMailBody.Append("&piid=").Append(oPI.id);
                    sbMailBody.Append("&wiid=").Append(COVIFlowCom.Common.GetProp(elmRoot, "wiid", true));
                    sbMailBody.Append("&bstate=").Append(oPI.businessState);
                    sbMailBody.Append("&fmid=").Append(oFNode.Attributes["id"].Value);
                    sbMailBody.Append("&fmpf=").Append(oFNode.Attributes["prefix"].Value);
                    sbMailBody.Append("&fmrv=").Append(oFNode.Attributes["revision"].Value);
                    sbMailBody.Append("&fiid=").Append(oFNode.Attributes["instanceid"].Value);
                    sbMailBody.Append("&scid=").Append(oFNode.Attributes["schemaid"].Value);
                    sbMailBody.Append("&secdoc=").Append(oFNode.Attributes["secure_doc"].Value);

                    CfnDatabaseUtility.WfEntityFilter[] aEFPFs = { 
						new CfnDatabaseUtility.WfEntityFilter("wiid", COVIFlowCom.Common.GetProp(elmRoot, "wiid", true), CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual, true), 
						new CfnDatabaseUtility.WfEntityFilter("performerId", COVIFlowCom.Common.GetProp(elmRoot, "id", true), CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true),
						new CfnDatabaseUtility.WfEntityFilter("state",CfnEntityClasses.CfPerformerState.pfstAssigned,CfnDatabaseUtility.WfEntityFilter.EFFilterOperator.ftopEqual,true)
					};
                    System.Collections.ArrayList oPFs = objMTS.GetEntity(typeof(CfnEntityClasses.WfPerformer), aEFPFs);
                    foreach (CfnEntityClasses.WfPerformer oPF in oPFs)
                    {
                        sbMailBody.Append("&pfsk=").Append(oPF.subKind);
                        sbMailBody.Append("&pfid=").Append(oPF.id);
                        sbMailBody.Append("&ptid=").Append(COVIFlowCom.Common.GetProp(elmRoot, "id", true));
                    }
                    sbMailBody.Append("]]></URL></MAIL>");
                    string sContents = string.Empty;
                    //html 포맷 맞추기 
                    System.IO.StringWriter oTW = null;
                    try
                    {
                        System.Xml.Xsl.XsltSettings settings = new System.Xml.Xsl.XsltSettings(true, true);
                        System.Xml.Xsl.XslCompiledTransform xslsteps = new System.Xml.Xsl.XslCompiledTransform();
                        {//이준희(2010-10-07): Changed to support SharePoint environment.
                            //xslsteps.Load(Server_MapPath(System.Configuration.ConfigurationManager.AppSettings["UserUrl"].ToString() + "/common/Mail.xsl"), settings, new System.Xml.XmlUrlResolver());
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


                    string[] aReceipt_id = new string[1];
                    aReceipt_id[0] = COVIFlowCom.Common.GetProp(elmRoot, "id", true);
                    try
                    {
                        //개인발송
                        Common.SendMessage(
                            sSubject,
                            COVIFlowCom.Common.GetProp(elmRoot, "usid", true),
                            aReceipt_id,
                            CfnEngineInterfaces.IWfOrganization.OMEntityType.ettpPerson,
                            System.Net.Mail.MailPriority.Normal,
                            true,
                            sContents);
                    }
                    catch (Exception sendmail)
                    {
                        throw new System.Exception(null, sendmail.InnerException);
                    }
                    finally
                    {
                        objMTS.Dispose();
                        objMTS = null;
                        sbMailBody = null;
                    }
                }
            }
            else
            {
                oManager.ReassignWorkitem(
                        COVIFlowCom.Common.GetProp(elmRoot, "wiid", true),
                        COVIFlowCom.Common.GetProp(elmRoot, "pfid", true),
                        COVIFlowCom.Common.GetProp(elmRoot, "id", true),
                        COVIFlowCom.Common.GetProp(elmRoot, "name", true),
                        CfnEntityClasses.CfParticipantKind.ptkdOrganizationalUnit,
                        CfnCoreEngine.WfOrganizationManager.VRHandlerKey.pthkOUSingle,
                        null,
                        sPFSK,
                        false);
            }
			oManager.Dispose();
			oManager = null;
		}
		catch (System.Exception Ex)
		{
			throw new Exception(null, Ex);
		}
		finally
		{
			if (oManager != null)
			{
				oManager.Dispose();
				oManager = null;
			}
			if (oPMgr != null)
			{
				oPMgr.Dispose();
				oPMgr = null;
			}
			if (WManager != null)
			{
				WManager.Dispose();
				WManager = null;
			}
			if (oAdmin != null)
			{
				oAdmin.Dispose();
				oAdmin = null;
			}
		}
	}

	//private System.Xml.XmlDocument pParseRequestBytes()
	//{
	//    System.Byte[] aBytes = Request.BinaryRead(Request.TotalBytes); 
	//    try
	//    {            
	//        System.Xml.XmlDocument oXMLData = new System.Xml.XmlDocument();
	//        System.Text.Decoder oDecoder = System.Text.Encoding.UTF8.GetDecoder();
	//        //aBytes = Request.BinaryRead(Request.TotalBytes);
	//        //Dim aChars(oDecoder.GetCharCount(aBytes, 0, aBytes.Length)) As System.Char;
	//        System.Char[] aChars = new Char[oDecoder.GetCharCount(aBytes, 0, aBytes.Length)];
	//        oDecoder.GetChars(aBytes, 0, aBytes.Length, aChars, 0);
	//        oXMLData.Load(new System.IO.StringReader(new String(aChars)));
	//        return oXMLData;
	//    }
	//    catch(System.Exception Ex)
	//    {           
	//        throw new Exception("Requested Bytes Count=" + aBytes.Length, Ex);
	//    }
	//}

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
