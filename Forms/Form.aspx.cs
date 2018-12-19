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

using System.Web.Configuration;
using System.Web.Services;
using Covision.Framework;
using Covision.Framework.Data.Business;
using System.Diagnostics;
using System.Text;
using System.Text.RegularExpressions;


/// <summary>
/// 양식작성 및 열람 시 사용되는 페이지
/// </summary>
public partial class COVIFlowNet_Forms_Form : PageBase //PageBase
{
	public string strApvDeptAlias, strApvDeptName, strApvDeptShortName;
	public string strReadMode, strFormId, strFormName, strFormPrefix, strSchemaID;
	public string strParentID, strPiid, sPiid, sWiid, sPIDC, sPIBD1, sPIBD2;
	public string strApvSteps, strBusinessState, strFileBackRoot, strFileSystemLocation;
	public string strBodyType, strFormFileName, strFormInstanceID, strFormTempInstanceID, strFormInstanceTableName, strFormVersion;
	public string strCommentList;
	public Hashtable oFormData;
	public XmlElement oSchema;
	public string strPFSubKind;
	public string strDebugInfo;
	public string sOid;
	public string strFormBodyContext;//기간연동에서 넘겨준 양식본문XML형식
	public Int32 iPIState;
	public Int32 iWIState;
	private Boolean bArchived = false; //이관문서 체크
	public string strpipr = ""; //우선순위 추가
	public string strPerformerid, strdeputyid; //2011.06
	public string usit = "";
	public string sMenuURL = "formmenu.aspx";
	public string sMobileYN = "N";
    private Boolean bstored = false;//보관문서 체크 2010.11
    private string strMsgBoxView, strTmpListView, strTabView; //전자결재 개인환경설정 저장 값 2010.11

    private string strLangID = ConfigurationManager.AppSettings["LanguageType"];
	public string strLangIndex = "0";
	private CEPS.CoviFlow.Lib.Main.UriCtxPrx urpg = null;//public string sgCEPSUri = string.Empty;//이준희(2010-12-15): Added to support SharePoint environment.

	//장혜인 2011-01-31 start
	//private Boolean bstored = false;//보관문서 체크
	public string sLocationURL = string.Empty;
    //private string sSubject = string.Empty;
    //private string sFileList = string.Empty;
	public string sHeight = "0";
	//장혜인 2011-01-31 end

    

	protected void Page_Load(object sender, EventArgs e)
	{
		#region PerformanceLog 처리를 위한 Stopwatch 설정
		Stopwatch stopwatch = null;
		if (sPerformanceYN == "True")
		{
			stopwatch = new Stopwatch();
			stopwatch.Start();
		}
		#endregion

		Response.Expires = -1;
		Response.CacheControl = "no-cache";
		Response.Buffer = true;
		Boolean bError = false;
		string sMessage = "";
		String sArchiveDB;
		System.Data.DataSet oDS = null;
		System.Data.DataRow oDR = null;

		//다국어 언어설정
		string culturecode = strLangID;
		if (Session["user_language"] != null)
		{
			culturecode = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
			strLangID = Session["user_language"].ToString();	//"ko-KR"; "en-US"; "ja-JP";
		}
		Page.UICulture = culturecode;
		Page.Culture = culturecode;
		strLangIndex = COVIFlowCom.Common.getLngIdx(culturecode);

		try
		{

			sArchiveDB = "INST_ARCHIVE_ConnectionString";
			String sArchived = Request.QueryString["archived"];
			if (sArchived != null && sArchived.ToUpper() == "Y") bArchived = true;
			if (Request.QueryString["bstored"] != null && Request.QueryString["bstored"] == "true") bstored = true;
			if (Request.QueryString["locationurl"] != null && Request.QueryString["locationurl"] != "") sLocationURL = Request.QueryString["locationurl"];
            
            String sPPIID = "";
            #region 세션정보확인
            if (Session["user_code"].ToString() == "")
			{
				bError = true;
				//sMessage = "현재 사용자의 사번 데이터가 없습니다. 세션이 종료되었습니다.";
				sMessage = Resources.Approval.msg_078;
			}
			if (Session["user_code"].ToString() == "")
			{
				bError = true;
				//sMessage = "현재 사용자의 이름 데이터가 없습니다.";
				sMessage = Resources.Approval.msg_079;
			}
			if (Session["user_dept_code"].ToString() == "")
			{
				bError = true;
				//sMessage = "현재 사용자의 부서코드 데이터가 없습니다.";
				sMessage = Resources.Approval.msg_080;
			}
			if (Session["user_dept_name"].ToString() == "")
			{
				bError = true;
				//sMessage = "현재 사용자의 부서명 데이터가 없습니다.";
				sMessage = Resources.Approval.msg_081;
			}
            #endregion
			oDS = new DataSet();
			if (bError == false)
			{
				strReadMode = Request.QueryString["mode"];
				strFormId = Request.QueryString["fmid"];
				strFormName = Request.QueryString["fmnm"];
				strFormPrefix = Request.QueryString["fmpf"];

				sMobileYN = Request.QueryString["mobileyn"];

				//2009.03 : Guid 변경
				if (strFormId != null && strFormId.IndexOf("{") > -1) strFormId = COVIFlowCom.Common.ConvertGuid(strFormId);

				if (Request.Form["fmbd"] != null)
				{
					strFormBodyContext = Request.Form["fmbd"];
				}
				else
				{
					strFormBodyContext = "";
				}

				if (strFormPrefix == "") strFormPrefix = "DRAFT";

				strFormVersion = Request.QueryString["fmrv"];
				strSchemaID = Request.QueryString["scid"];
				//2009.03 : Guid 변경
				if (strSchemaID != null && strSchemaID.IndexOf("{") > -1) strSchemaID = COVIFlowCom.Common.ConvertGuid(strSchemaID);

				oSchema = pGetSchema();

				sPiid = Request.QueryString["piid"];
				sWiid = Request.QueryString["wiid"];
				//2009.03 : Guid 변경
				if (sPiid != null && sPiid.IndexOf("{") > -1) sPiid = COVIFlowCom.Common.ConvertGuid(sPiid);
				if (sWiid != null && sWiid.IndexOf("{") > -1) sWiid = COVIFlowCom.Common.ConvertGuid(sWiid);

               
                #region workitem상세정보
                if (sPiid == null) sPiid = "";
				if (sPiid == "")
				{ //strReadMode = "REJECT"
					sPiid = CfnEntityClasses.WfEntity.NewGUID();
				}
				else
				{
					String sWorkitemListQuery = String.Empty;
					if (sWiid != null && sWiid != "")
					{
						sWorkitemListQuery = "dbo.usp_wf_getworkitemdata";
					}
					else
					{
						sWorkitemListQuery = "dbo.usp_wf_getprocessinstance";
					}

					DataPack INPUT = null;
					try
					{
						INPUT = new DataPack();
						if (sWiid != null && sWiid != "")
						{
							INPUT.add("@WI_ID", sWiid);
						}
						else
						{
							INPUT.add("@PI_ID", sPiid);
						}

                        //장혜인 2011-01-31 start
                        if (bstored)
                        {
                            using (SqlDacBase SqlDbAgent = new SqlDacBase())
                            {
                                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("STORE_ConnectionString").ToString();
                                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sWorkitemListQuery, INPUT);
                            }
                        }
                        //장혜인 2011-01-31 end 

                        else
                        {
                            if (!bArchived)
                            {
                                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                                {
                                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                                    oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sWorkitemListQuery, INPUT);
                                }
                            }
                            else
                            {
                                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                                {
                                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(sArchiveDB).ToString();
                                    oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sWorkitemListQuery, INPUT);
                                }
                            }
                        }
						if ((oDS == null) || (oDS.Tables.Count == 0 || oDS.Tables[0].Rows.Count == 0))
						{
							bArchived = true;
							using (SqlDacBase SqlDbAgent = new SqlDacBase())
							{
								SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(sArchiveDB).ToString();
								oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sWorkitemListQuery, INPUT);
							}
                            if ((oDS == null) || (oDS.Tables.Count == 0 || oDS.Tables[0].Rows.Count == 0))
                            {
                                bArchived = false;
                                using (SqlDacBase SqlDbAgent = new SqlDacBase())
                                {
                                    SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("STORE_ConnectionString").ToString();
                                    oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, sWorkitemListQuery, INPUT);
                                }
                                //장혜인 2011-01-31 start
                                if ((oDS == null) && (oDS.Tables.Count == 0 || oDS.Tables[0].Rows.Count == 0))
                                {
                                    bstored = false;
                                }
                                //장혜인 2011-01-31 end
                				else {
                    				bstored = true;
                				}
                            }
                        }
					}
					catch (System.Exception ex)
					{
						throw new System.Exception("Get Archived", ex);
					}
					finally
					{
						if (INPUT != null)
						{
							INPUT.Dispose();
							INPUT = null;
						}
					}


					oDR = oDS.Tables[0].Rows[0];
					if (sWiid != null && sWiid != "")
					{
						try { 
                            strPerformerid = oDR["PF_PERFORMER_ID"].ToString();
                            strdeputyid = oDR["WI_DEPUTY_ID"].ToString();//2011.06
                        }
						catch (System.Exception ex)
						{
							pErrorMessage(ex.Message);
							Response.End();
						}
					}

					////결재 인스턴스의 상태 체크
					try { if (oDR["WI_STATE"] != null) iWIState = System.Convert.ToInt32(oDR["WI_STATE"]); }
					catch (System.Exception exwistate) { }
					iPIState = System.Convert.ToInt32(oDR["PI_STATE"]);

					//20041206 백종기 추가               
					if (strReadMode == "APPROVAL" || strReadMode == "REDRAFT")
					{
						if (iWIState == 0 && iPIState == 0)
						{
							//pErrorMessage("존재하지 않는 결재문서입니다.");
							pErrorMessage(Resources.Approval.msg_082);
							Response.End();
						}
                        if (iWIState != 288 || iPIState != 288)
                        {
                            //진행으로 변경2011.06
                            //2011.07.15 최아영-회수 및 삭제 문서 구분                                 
                            if((iWIState == 546 || iPIState == 546) || (iWIState == 688 || iPIState == 688) || strPerformerid == "AdministratorTerminate") { 
                                pErrorMessage(Resources.Approval.msg_082);                                 
                                Response.End();   
                            }  
                                                                                            
                            if (iPIState == 528)
                            {
                                strReadMode = "COMPLETE";
                            }
                            else
                            {
                                strReadMode = "PROCESS";
                            }
                        }
                        else
                        {
                            //2011.06
                            //if (Request.QueryString["pfsk"] == "T009" && Request.QueryString["ptid"] != System.Convert.ToString(oDR["PF_PERFORMER_ID"]))
                            //{
                            //    //pErrorMessage("이미 처리된 결재문서입니다.")
                            //    pErrorMessage(Resources.Approval.msg_084);
                            //    Response.End();
                            //}
                            if (Session["user_code"].ToString() == Request.QueryString["ptid"] ||  Session["user_code"].ToString() == strPerformerid || Session["user_code"].ToString() == strdeputyid || Request.QueryString["gloct"] == "JOBFUNCTION" || Request.QueryString["gloct"] == "DEPART")
                            {
                                //정상 권한자
                            }
                            else
                            {
                                strReadMode = "PROCESS";
                            }
                        }
					}
					if (sPiid == "")
					{
						sPIDC = "";
						sPIBD1 = "";
						sPIBD2 = "";
					}
					else
					{
						sPIDC = pCheckDBNull2String(oDR["PI_DSCR"]);
						sPIBD1 = pCheckDBNull2String(oDR["PI_BUSINESS_DATA1"]);
						sPIBD2 = pCheckDBNull2String(oDR["PI_BUSINESS_DATA2"]);
						sPPIID = pCheckDBNull2String(oDR["PI_PPI_ID"]);
						strpipr = pCheckDBNull2String(oDR["PI_PRIORITY"]);
										
					}

				}
                #endregion
				strBusinessState = Request.QueryString["bstate"]; //비즈니스 state
				strPFSubKind = Request.QueryString["pfsk"]; //PF_SUBKIND

				strFormInstanceID = Request.QueryString["fiid"]; //Form instance id
				if (strFormInstanceID == null) strFormInstanceID = "";
				if (strFormInstanceID == "") strFormInstanceID = CfnFormManager.WfFormManager.NewGUID();

				strFormTempInstanceID = Request.QueryString["ftid"]; //Form Temporary instance id
				strFormInstanceTableName = Request.QueryString["fitn"]; //Form instance Table Name

                if (sLocationURL.CompareTo("") == 0) oFormData = pGetFormData();

				if (Request.QueryString["mode"] != "COMPLETE")
					pGetReadModeNFormFileName(strBusinessState, strBodyType);   //ReadMode 변환이 이뤄짐

				//ReadMode 변환 이후 작업
				pGetApvDeptInfo();

                #region 결재선정보 가져오기
                //대외공문접수대장의 경우 결재선 정보가 없으므로 빈값을 넣어준다.               
				if (strFormPrefix == "OFFICIAL_DOCUMENT")
				{
					strApvSteps = "";
				}
				else
				{
					// strApvSteps = pGetApvSteps(sPiid);
                    // strApvSteps = pGetApvSteps(sPiid);
                    #region orginal source 장혜인
                    //if (bArchived)
                    //{
                    #endregion
                    //bestored 장혜인 2011-01-31
                    if (bArchived || bstored)
                    {
						DataPack INPUT = null;
                        if (bstored) { sArchiveDB = "STORE_ConnectionString"; } else { sArchiveDB = "INST_ARCHIVE_ConnectionString"; }
                        try
						{
							INPUT = new DataPack();
							INPUT.add("@PIID", sPiid);
							using (SqlDacBase SqlDbAgent = new SqlDacBase())
							{
								SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(sArchiveDB).ToString();
								oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wf_getdomaindata", INPUT);
							}
							if (oDS != null && oDS.Tables[0].Rows.Count > 0)
							{
								oDR = oDS.Tables[0].Rows[0];
								strApvSteps = Convert.ToString(oDR[0]);
							}
							else
							{
								//부서합의의 경우 상위 프로세스의 결재선을 사용한다.
								if (sPPIID != "")
								{
									INPUT.Clear();
									INPUT.add("@PIID", sPPIID);
									using (SqlDacBase SqlDbAgent = new SqlDacBase())
									{
										SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(sArchiveDB).ToString();
										oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wf_getdomaindata", INPUT);
									}
									if (oDS != null && oDS.Tables[0].Rows.Count > 0)
									{
										oDR = oDS.Tables[0].Rows[0];
										strApvSteps = Convert.ToString(oDR[0]);
									}
									else
									{
										throw new System.Exception(Resources.Approval.msg_082);
									}
								}
                                #region originalsource 장혜인
                                //else
                                //{
                                //    throw new System.Exception(Resources.Approval.msg_082);
                                //}
                                #endregion
                                // 장혜인 2011-01-21 start
                                else
                                {
                                    if (!bstored) throw new System.Exception(Resources.Approval.msg_082);
                                }
                                // 장혜인 2011-01-21 end
							}
						}
						catch (System.Exception ex)
						{
							throw new System.Exception("Get Archived", ex);
						}
						finally
						{
							if (INPUT != null)
							{
								INPUT.Dispose();
								INPUT = null;
							}
						}
					}
					else
					{
						strApvSteps = pGetApvSteps(sPiid);
					}

                }
                #endregion
                #region 완료문서 권한 체크
				//완료이면서 security level이 confidential인 경우에 권한 체크
				if (Request.QueryString["mode"] == "ADMINEDMS") //2006.10
				{

				}
				else
				{
					if (Request.QueryString["mode"] == "COMPLETE" && Request.QueryString["secdoc"] == "1")
					{
						Boolean bIsManager = false;
						if (Session["ismanager"] != null)
						{
							bIsManager = Convert.ToBoolean(Session["ismanager"].ToString());

						}
						if (!bIsManager) //조직장의 경우에는 기밀문서 여부에 상관없이 문서를 볼 수 있음. - 2004.07.30 농수산 추가 
						{
							Boolean bAuth = COVIFlowCom.processFormAuth.chkFormAuth(Session["user_code"].ToString(), Session["user_dept_code"].ToString(), strFormInstanceID, strApvSteps);

							//2013-05-08 hyh 추가
                            //if (!bAuth) //2013-12-10 hyh 수정 //20170616 주석
                            if (!bAuth && Session["user_code"].ToString() != "ISU_STWEBMASTER") //20170616 주석 품
                            //2013-05-08 hyh 추가 끝
							{
								//pErrorMessage("현재 양식에 대한 조회권한이 없습니다.");
								pErrorMessage(Resources.Approval.msg_083);
								Response.End();
							}

                            if (Request.QueryString["gloct"] == "JOBFUNCTION") {
                            
                                pErrorMessage(Resources.Approval.msg_083);
                                Response.End();
                            
                            }
						}
					}
                }
                #endregion
                strFileSystemLocation = "/FrontStorage/Approval/";
				strFileBackRoot = pResolveFormFilePath();

				//읽음확인추가 
                if (Request.QueryString["mode"] != "DRAFT" && Request.QueryString["mode"] != "TEMPSAVE" && Request.QueryString["admintype"] != "ADMIN")
				{
					ConfirmRead();
				}

				//모바일 오픈을 위한 formmenu.aspx 변경
				if (sMobileYN == "Y")
				{
					sMenuURL = "formmenuExt.aspx";
				}

				#region 다국어를 위한 데이터 처리
                if (Session["user_name_lng"] == null || (Session["user_name_lng"] != null && Session["user_dept_name_lng"].ToString().IndexOf(Session["user_dept_name"].ToString()) == -1))
                {
						DataPack INPUT = null;
						try
						{
							INPUT = new DataPack();
							INPUT.add("@person_code", Session["user_code"].ToString());
							INPUT.add("@unit_code", Session["user_dept_code"].ToString());
							INPUT.add("@ent_code", Session["user_ent_code"].ToString());
							using (SqlDacBase SqlDbAgent = new SqlDacBase())
							{
								SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
								oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_getpersoninfoext", INPUT);
							}
							if (oDS != null && oDS.Tables[0].Rows.Count > 0)
							{
								oDR = oDS.Tables[0].Rows[0];
								Session["user_name_lng"] = Convert.ToString(oDR["DISPLAY_NAME"]);
								Session["user_dept_name_lng"] = Convert.ToString(oDR["UNIT_NAME"]);
								Session["user_jobposition_name_lng"] = Convert.ToString(oDR["JOBPOSITION_Z"]);
								Session["user_joblevel_name_lng"] = Convert.ToString(oDR["JOBLEVEL_Z"]);
								Session["user_jobtitle_name_lng"] = Convert.ToString(oDR["JOBTITLE_Z"]);

								Session["user_jobposition_code"] = Session["user_jobposition_name_lng"].ToString().Split('&')[0];
								Session["user_joblevel_code"] = Session["user_joblevel_name_lng"].ToString().Split('&')[0];
								Session["user_jobtitle_code"] = Session["user_jobtitle_name_lng"].ToString().Split('&')[0];

							}
						}
						catch (System.Exception ex)
						{
						}
						finally
						{
							if (INPUT != null)
							{
								INPUT.Dispose();
								INPUT = null;
							}
						}
				}
				#endregion
                #region 개인환경설정조회
                DataPack INPUTPersonOption= null;
                try
                {
                    INPUTPersonOption = new DataPack();
                    INPUTPersonOption.add("@PERSON_CODE", Session["user_code"].ToString());
                    INPUTPersonOption.add("@LANGUAGE", Sessions.USER_LANGUAGE.ToString());
                    using (SqlDacBase SqlDbAgent = new SqlDacBase())
                    {
                        SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
                        oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.OMP_PERSON_INFO", INPUTPersonOption);
                    }
                    if (oDS != null && oDS.Tables[0].Rows.Count > 0)
                    {
                        oDR = oDS.Tables[0].Rows[0];
                        if (oDR["APPROVAL_MESSAGE_BOX_VIEW"].Equals("Y")) strMsgBoxView = "Y";   // 확인메시지표시
                        if (oDR["APPROVAL_TMP_LIST_VIEW"].Equals("Y")) strTmpListView = "Y";    // 임시함 문서 기안시
                    }
                }
                catch (System.Exception ex)
                {
                }
                finally
                {
                    if (INPUTPersonOption != null)
                    {
                        INPUTPersonOption.Dispose();
                        INPUTPersonOption = null;
                    }
                }
                #endregion
            }
			else
			{
				pErrorMessage(sMessage);
				Response.End();
			}
		}
        catch (System.Threading.ThreadAbortException exth) { }    //2009.4 jju
        catch (System.Exception ex)
		{

			//COVIFlowCom.ErrResult.AlertMsg(Response, COVIFlowCom.ErrResult.ParseStackTrace(ex));
			pErrorMessage(ex.Message);
			Response.End();
		}
		finally
		{
			//if (oAdmin != null) System.EnterpriseServices.ServicedComponent.DisposeObject(oAdmin);
			if (oDS != null)
			{
				oDS.Dispose();
				oDS = null;
			}
			if (oDR != null)
			{
				oDR = null;
			}
		}

		#region PerformanceLog 처리
		if (sPerformanceYN == "True")
		{
			stopwatch.Stop();
			if (stopwatch.ElapsedMilliseconds > Convert.ToInt32(iPerformanceLimit))
			{
				string fullMethodName = string.Format("{0} --> {1}", this.GetType().Name, System.Reflection.MethodBase.GetCurrentMethod().Name);
				this.SetPerformanceLog(fullMethodName, stopwatch.Elapsed.ToString());

			}
		}
		#endregion
	}
	/// <summary>
	/// 작성 목적 : 문서 읽음 여부를 확인하고 읽음정보를 추가한다.
	/// 작  성  자 : 
	/// 최초작성일 : 
	/// 변경  내용 : 
	/// 변  경  자 : 
	/// 변  경  일 : 
	/// </summary>
	/// <param name="sFiid">Form Instance ID</param>
	/// <param name="sPiid">Process Instance ID</param>
	//private void ConfirmRead(string sFiid, string sPiid)
	private void ConfirmRead()
	{
		DataPack INPUT = null;
		string sUserID = Sessions.PERSON_CODE.ToString();           //사원번호
		string sUserName = Sessions.PERSON_NAME.ToString();          //사원명
		string sTitle = Sessions.USER_JOBPOSITION_NAME.ToString(); //직책
		string sLevel = Sessions.USER_JOBLEVEL_NAME.ToString();    //직급명

		string sProcName = "usp_WF_Confirm_Read";
		try
		{
			INPUT = new DataPack();
			INPUT.add("@USER_ID", sUserID);
			INPUT.add("@DISPLAY_NAME", sUserName);
			INPUT.add("@TITLE", sTitle);
			INPUT.add("@LEVEL", sLevel);
			INPUT.add("@PROCESS_ID", sPiid);
			INPUT.add("@FORM_INST_ID", strFormInstanceID);

			using (SqlDacBase SqlDbAgent = new SqlDacBase())
			{
				SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
				SqlDbAgent.ExecuteNonQuery(CommandType.StoredProcedure, sProcName, INPUT);
			}
		}
		catch (Exception ex) { }
		finally
		{
			if (INPUT != null)
			{
				INPUT.Dispose();
				INPUT = null;
			}
		}
	}
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

	private void pErrorMessage(string src)
	{
		Response.Write("<script language=jscript>alert(\"" + COVIFlowCom.ErrResult.ReplaceScriptMsg(src) + "\"); window.close();</script>");
	}

	/// <summary>
	/// 스키마 정보 조회
	/// </summary>
	/// <returns></returns>

	private System.Xml.XmlElement pGetSchema()
	{//여기에 스키마 정보 조회        
		CfnFormManager.WfFormManager oFM = null;
		try
		{
			oFM = new CfnFormManager.WfFormManager();
			System.Xml.XmlDocument oXML = new System.Xml.XmlDocument();
			CfnFormManager.WfFormSchema oFS = (CfnFormManager.WfFormSchema)oFM.GetDefinitionEntity(strSchemaID, CfnFormManager.CfFormEntityKind.fekdFormSchema);
			oXML.LoadXml(oFS.Context);
			return oXML.DocumentElement;
		}
		catch (System.Exception ex)
		{
			//COVIFlowCom.ErrResult.AlertMsg(Response, pReplaceSpecialCharacter( COVIFlowCom.ErrResult.ParseStackTrace(ex)));
			throw ex;
		}
		finally
		{
			if (oFM != null)
			{
				oFM.Dispose();
				oFM = null;
			}
		}
	}

	/// <summary>
	/// 양식데이터 조회
	/// </summary>
	/// <returns></returns>
	private System.Collections.Hashtable pGetFormData()
	{
		CfnFormManager.WfFormManager objMTS = null;
		System.Data.DataSet oDS = null;
		System.Collections.Hashtable oFormFields = null;
		try
		{
			objMTS = new CfnFormManager.WfFormManager();
			//String sArchiveDB = System.Web.Configuration.WebConfigurationManager.AppSettings["FORM_INST_ARCHIVE_ConnectionString"];
			String sArchiveDB = "FORM_INST_ARCHIVE_ConnectionString";
			oFormFields = new System.Collections.Hashtable();
			oDS = new DataSet();

			CfnFormManager.WfFormDefinition oFormDef = (CfnFormManager.WfFormDefinition)objMTS.GetDefinitionEntity(strFormId, CfnFormManager.CfFormEntityKind.fekdFormDefinition);
			strBodyType = oFormDef.BodyType;
			strFormName = oFormDef.Name;
			oFormFields.Add("fmbt", strBodyType);

			if (strReadMode == "DRAFT") //기안의 경우
			{
				oFormFields.Add("fmbd", oFormDef.DefaultBody);
				System.Collections.ArrayList oFieldDefs = objMTS.GetDefinitionEntities(strFormId, CfnFormManager.CfFormEntityKind.fekdFieldDefinitionsByForm);
				//CfnFormManager.WfFieldDefinition oFieldDef;

				foreach (CfnFormManager.WfFieldDefinition oFieldDef in oFieldDefs)
				{
					oFormFields.Add(oFieldDef.Name.ToUpper(), oFieldDef.Default);
				}
			}
			else   //기안 이외의 경우
			{
				//CfnFormManager.WfFormInstance oFormInst = (CfnFormManager.WfFormInstance)objMTS.GetInstanceEntity(strFormInstanceID, CfnFormManager.CfFormEntityKind.fekdFormInstance, strFormPrefix, int.Parse(strFormVersion));

				//foreach (DictionaryEntry oFormField in oFormInst.Fields)
				//{
				//    oFormFields.Add(oFormField.Key.ToString().ToUpper(), oFormField.Value);
				//}

				//2009.03 : Guid 변경
				if (strFormInstanceID.IndexOf("{") > -1) strFormInstanceID = COVIFlowCom.Common.ConvertGuid(strFormInstanceID);

				String sTableName = "WF_FORM_INSTANCE_" + strFormPrefix + "__V" + strFormVersion;
				String szQuery = String.Format("EXEC sp_executesql N'SELECT * FROM {0} WITH (NOLOCK) WHERE FORM_INST_ID=@FIID',N'@FIID AS VARCHAR(50)','{1}'", sTableName, strFormInstanceID);

				DataPack INPUT = null;
				try
				{
					if (bArchived || bstored)
					{
						INPUT = new DataPack();
						using (SqlDacBase SqlDbAgent = new SqlDacBase())
						{
							SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(sArchiveDB).ToString();
							oDS = SqlDbAgent.ExecuteDataSet(CommandType.Text, szQuery, INPUT);
						}
						if (oDS != null && oDS.Tables[0].Rows.Count > 0)
						{
						}
						else
						{
							oDS = objMTS.LookupData(CfnFormManager.CfDatabaseType.dbtpInstance, strFormPrefix, szQuery, "DataSet");
						}
					}
					else
					{
						oDS = objMTS.LookupData(CfnFormManager.CfDatabaseType.dbtpInstance, strFormPrefix, szQuery, "DataSet");
						if (oDS != null && oDS.Tables[0].Rows.Count > 0)
						{
						}
						else
						{
							INPUT = new DataPack();
							using (SqlDacBase SqlDbAgent = new SqlDacBase())
							{
								SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig(sArchiveDB).ToString();
								oDS = SqlDbAgent.ExecuteDataSet(CommandType.Text, szQuery, INPUT);
							}
						}
					}
				}
				catch (System.Exception ex)
				{
					throw new System.Exception("getFormData()", ex);
				}
				finally
				{
					if (INPUT != null)
					{
						INPUT.Dispose();
						INPUT = null;
					}
				}


				foreach (System.Data.DataRow oDR in oDS.Tables[0].Rows)
				{
					foreach (System.Data.DataColumn oFormField in oDS.Tables[0].Columns)
					{
						System.Object oValue = oDR[oFormField.ColumnName];
						if (oValue == System.DBNull.Value)
						{
							oValue = null;
							oFormFields.Add(System.Convert.ToString((oFormField.ColumnName)).ToUpper(), oValue);
						}
						else
						{
							oFormFields.Add(System.Convert.ToString((oFormField.ColumnName)).ToUpper(), oValue.ToString());
						}
					}
				}
			}


			DataPack INPUT2 = null;
			try
			{
				INPUT2 = new DataPack();
				INPUT2.add("@fmid", this.strFormId);
				using (SqlDacBase SqlDbAgent2 = new SqlDacBase())
				{
					SqlDbAgent2.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("FORM_DEF_ConnectionString").ToString();
					oDS = SqlDbAgent2.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wfform_forminfo", INPUT2);
				}
				if (oDS != null && oDS.Tables[0].Rows.Count > 0)
				{
					foreach (System.Data.DataRow oDR in oDS.Tables[0].Rows)
					{
						if (oDR["WORK_DESC"] != System.DBNull.Value)
						{
							oFormFields.Add("fmwkds", oDR["WORK_DESC"]);
						}
						else
						{
							oFormFields.Add("fmwkds", null);
						}
						if (oDR["USAGE_STATE"] != System.DBNull.Value)
						{
							oFormFields.Add("fmusyn", oDR["USAGE_STATE"]);
						}
						else
						{
							oFormFields.Add("fmusyn", null);
						}

					}
				}
			}
			catch (Exception ex) { throw ex; }
			finally
			{
				if (INPUT2 != null)
				{
					INPUT2.Dispose();
					INPUT2 = null;
				}
			}
			return oFormFields;
		}
		catch (System.Exception ex)
		{
			COVIFlowCom.ErrResult.AlertMsg(Response, COVIFlowCom.ErrResult.ParseStackTrace(ex));
			throw ex;
		}
		finally
		{
			if (objMTS != null)
			{
				objMTS.Dispose();
				objMTS = null;
			}
			if (oDS != null)
			{
				oDS.Dispose();
				oDS = null;
			}
			if (oFormFields != null)
			{
				oFormFields = null;
			}
		}
	}

	/// <summary>
	/// 결재선 정보 조회
	/// </summary>
	/// <param name="sPIID">process id</param>
	/// <returns></returns>
	private string pGetApvSteps(string sPIID)
	{
		//CfnCoreEngine.WfAdministration oAdmin;
		try
		{
			if (strReadMode == "DRAFT" || strReadMode == "TEMPSAVE" || strReadMode == "PREDRAFT")
			{
				return "<steps initiatorcode=\"" + Session["user_code"] + "\" initiatoroucode=\"" + strApvDeptAlias +
					"\" status=\"inactive\"></steps>";
			}
			else
			{

				return COVIFlowCom.Common.getApproveSteps(sPIID, oSchema, strBusinessState, Server.MachineName);
			}
		}
		catch (System.Exception ex)
		{

			COVIFlowCom.ErrResult.AlertMsg(Response, COVIFlowCom.ErrResult.ParseStackTrace(ex));
			throw new Exception(null, ex);
		}
		finally
		{
			//if (oAdmin != null) System.EnterpriseServices.ServicedComponent.DisposeObject(oAdmin);
		}
	}

	/// <summary>
	/// 특수문자 변환
	/// </summary>
	/// <param name="strContent">Content 원문</param>
	/// <returns>string</returns>
	private string pReplaceSpecialCharacter(string strContent)
	{
		//Response.Write("<script>alert('" + strContent + "');</script>");
		if (strContent != null)
		{
			//Response.Write("<script>alert('" + strContent + "');</script>");
			strContent = strContent.Replace("\\", "\\\\");
			strContent = strContent.Replace("\r\n", "\\r\\n");
			strContent = strContent.Replace("\n", "\\n");
			strContent = strContent.Replace("'", "\\'");
			//Response.Write("<script>alert('" + strContent + "');</script>");
		}
		return strContent;
	}

	private void pGetReadModeNFormFileName(string strBusinessState, string strBodyType)
	{
		string sFormReadSuffix = ""; //읽기 양식을 위한 서픽스

		switch (strBusinessState)
		{
			case "03_01_02": //수신부서기안대기   "Receive"
				strReadMode = "REDRAFT";
				break;
			case "01_02_01": //"PersonConsult" 개인
			case "01_04_01":
			case "01_04_02":
				strReadMode = "PCONSULT";
				break;
			case "01_03_01": //감사 개인
				strReadMode = "AUDIT";
				break;
			case "01_01_02": //"RecApprove"
				strReadMode = "RECAPPROVAL";
				break;
			case "03_01_03": //협조부서
			case "03_01_04": //"SubRedraft" 합의부서기안대기
			case "03_01_05": //감사 부서 대기
				strReadMode = "SUBREDRAFT";
				break;
			case "01_01_04": //"SubApprove" 부서결재
			case "01_02_02":
			case "01_01_05":
			case "01_03_02":
			case "01_03_03":
			case "01_02_03":
				strReadMode = "SUBAPPROVAL";
				break;
			case "02_02_01":   //기안부서 반려"Reject"
			case "02_02_02":
			case "02_02_03":
			case "02_02_04":
			case "02_02_05":
			case "02_02_06":
			case "02_02_07":
				strReadMode = "REJECT";
				break;
			case "03_01_06": //"Charge"
				strReadMode = "CHARGE";
				break;
			default:
				break;
		}

		if (strPFSubKind == "T001" || strPFSubKind == "T002") //시행문변환
			strReadMode = "TRANS"; //변환
		else if (strPFSubKind == "T003")
			strReadMode = "SIGN"; //직인
		else if (strPFSubKind == "T018")
		{
			if (iWIState == 288) strReadMode = "APPROVAL";
			else strReadMode = "COMPLETE"; //공람
		}

		//양식에 따른 파일 변경
		switch (strBodyType)
		{
			case "DHTML":
				strFormFileName = strFormPrefix + "_V" + strFormVersion;
				break;
			case "HWP":
				strFormFileName = strFormPrefix + "_V" + strFormVersion + "_HWP";
				break;
			case "DOC":
				strFormFileName = strFormPrefix + "_V" + strFormVersion + "_DOC";
				break;
			default:
				strFormFileName = strFormPrefix + "_V" + strFormVersion;
				break;
		}

		strFormFileName += sFormReadSuffix;

	}

	/// <summary>
	/// 결재본문 파일 경로명 생성
	/// </summary>
	/// <returns></returns>
	private string pResolveFormFilePath()
	{
		//결재본문 파일 경로명 생성 - 
		string strStorageVolName = "";
		//--- STORAGE ID 얻어오기--
		//DataSet DSStorage = COVINet.COVIFlowNetCommon.GetActiveStorageInfo("APPROVALEDMS");
		DataSet DSStorage = null;
		string strFileBackEndRoot = "";
		try
		{
			DSStorage = COVIFlowCom.Common.GetActiveStorageInfo("APPROVALEDMS");

			//if (DSStorage != null)
			//{
			if (DSStorage != null)
			{
				//if (DSStorage.Tables[0].Rows.Count > 0)
				//{
				if (DSStorage.Tables[0].Rows.Count > 0)
				{
					//DataRow DRStorage;
					DataRow DRStorage;
					//DRStorage = DSStorage.Tables[0].Rows[0];
					DRStorage = DSStorage.Tables[0].Rows[0];
					//if (DRStorage["STORAGE_ID"].ToString() != null)
					if (DRStorage["STORAGE_ID"].ToString() != null)
					{
						strStorageVolName = DRStorage["VOLUME_NAME"].ToString();
					}
					//  strStorageVolName = DRStorage["VOLUME_NAME"].ToString();

				}
				//}
			}
			//}
			//Back-End로 파일저장을 위해 아래로 변경및 추가
			strFileBackEndRoot = strStorageVolName;
			if (strFileBackEndRoot.Length > 0)
			{
				if (strFileBackEndRoot.Substring(strFileBackEndRoot.Length - 1, 1) != "/")
				{
					strFileBackEndRoot += "/";
				}
			}
			else
			{
				strFileBackEndRoot += "/";
			}
		}
		catch (Exception ex) { throw ex; }
		finally
		{
			if (DSStorage != null)
			{
				DSStorage.Dispose();
				DSStorage = null;
			}
		}
		return strFileBackEndRoot;

	}

	/// <summary>
	/// 첨부 파일 경로명 생성
	/// </summary>
	/// <returns></returns>
	private string pResolveAttachFilePath()
	{
		//첨부 파일 경로명 생성 - 
		string strStorageVolName = "";
		//--- STORAGE ID 얻어오기--
		//DataSet DSStorage = COVINet.COVIFlowNetCommon.GetActiveStorageInfo("APPROVAL");
		DataSet DSStorage = null;
		string strFileBackEndRoot = "";
		try
		{
			DSStorage = COVIFlowCom.Common.GetActiveStorageInfo("APPROVAL");
			if (DSStorage != null)
			{
				if (DSStorage.Tables[0].Rows.Count > 0)
				{
					DataRow DRStorage;

					DRStorage = DSStorage.Tables[0].Rows[0];
					if (DRStorage["STORAGE_ID"].ToString() != null)
						strStorageVolName = DRStorage["VOLUME_NAME"].ToString();
				}
			}
			//Back-End로 파일저장을 위해 아래로 변경및 추가
			strFileBackEndRoot = strStorageVolName;
			if (strFileBackEndRoot.Length > 0)
			{
				if (strFileBackEndRoot.Substring(strFileBackEndRoot.Length - 1, 1) != "/")
				{
					strFileBackEndRoot += "/";
				}
			}
			else
			{
				strFileBackEndRoot += "/";
			}
		}
		catch (Exception ex) { throw ex; }
		finally
		{
			if (DSStorage != null)
			{
				DSStorage.Dispose();
				DSStorage = null;
			}
		}
		return strFileBackEndRoot;
	}

	/// <summary>
	/// 의견목록 가져오기
	/// </summary>
	/// <returns></returns>
	private string pGetCommentList()
	{
		string strQuery = "";
		StringBuilder sb = null;
		DataSet oDS = null;
		DataPack INPUT = null;
		try
		{
			sb = new StringBuilder();
			oDS = new DataSet();
			INPUT = new DataPack();

			INPUT.add("@fiid", strFormInstanceID);
			using (SqlDacBase SqlDbAgent = new SqlDacBase())
			{
				SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
				oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wf_get_comment_list", INPUT);
			}

			sb.Append("<WF_COMMENT>");
			for (int i = 0; i < oDS.Tables[0].Rows.Count; i++)
			{
				sb.Append(oDS.Tables[0].Rows[i][0].ToString());
			}
			sb.Append("</WF_COMMENT>");

			strCommentList = sb.ToString();
		}
		catch (System.Exception ex)
		{
			//COVIFlowCom.ErrResult.AlertMsg(Response, COVIFlowCom.ErrResult.ParseStackTrace(ex));
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
		return strCommentList;

	}

    /// <summary>
    /// 의견목록 가져오기
    /// </summary>
    /// <returns></returns>
    private string pGetCommentList2()
    {
        string strQuery = "";
        StringBuilder sb = null;
        DataSet oDS = null;
        DataPack INPUT = null;
        try
        {
            sb = new StringBuilder();
            oDS = new DataSet();
            INPUT = new DataPack();

            INPUT.add("@fiid", strFormInstanceID);
            using (SqlDacBase SqlDbAgent = new SqlDacBase())
            {
                SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("INST_ConnectionString").ToString();
                oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_wf_get_comment_list2", INPUT);
            }

            sb.Append("<WF_COMMENT>");
            for (int i = 0; i < oDS.Tables[0].Rows.Count; i++)
            {
                sb.Append(oDS.Tables[0].Rows[i][0].ToString());
            }
            sb.Append("</WF_COMMENT>");

            strCommentList = sb.ToString();
        }
        catch (System.Exception ex)
        {
            //COVIFlowCom.ErrResult.AlertMsg(Response, COVIFlowCom.ErrResult.ParseStackTrace(ex));
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
        return strCommentList;

    }

	/// <summary>
	/// 교원신청서 종류나 다른 겸직/파견부서에서 기안할때 실결재 부서가 다른 경우 이곳에서 실결재부서를 설정
	/// </summary>
	private void pGetApvDeptInfo()
	{
		string strQuery = "";
		DataSet oDS = null;
		DataPack INPUT = null;
		try
		{
			if (Session["user_dept_approvable"].ToString() == "1")
			{
				strApvDeptAlias = Session["user_dept_code"].ToString();
				strApvDeptName = Session["user_dept_name"].ToString();
				strApvDeptShortName = Session["user_dept_short_name"].ToString();
			}
			else
			{
				strApvDeptAlias = Session["user_parent_dept_code"].ToString();//.Split("@"[0]).ToString()
				strApvDeptName = "";

				oDS = new DataSet();
				INPUT = new DataPack();
				INPUT.add("@strUnitID", strApvDeptAlias);
				using (SqlDacBase SqlDbAgent = new SqlDacBase())
				{
					SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
					oDS = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, "dbo.usp_GetUnitInfo", INPUT);
				}
				if (oDS.Tables[0].Rows.Count > 0)
				{
					System.Data.DataRow DR = oDS.Tables[0].Rows[0];
					strApvDeptShortName = DR["SHORT_NAME"].ToString();  //부서약명
					strApvDeptName = DR["UNIT_NAME"].ToString();
				}
				else
				{
					strApvDeptShortName = Session["user_dept_short_name"].ToString();
				}
			}
		}
		catch (System.Exception ex)
		{
			//COVIFlowCom.ErrResult.AlertMsg(Response, COVIFlowCom.ErrResult.ParseStackTrace(ex));
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
	/// 양식 상단에 양식정보 initFormInfro() 함수와 함께 결재문서 관련 각종 정보를 만들 주는 함수
	/// Ex]사용자 정보, 프로세스 정보, 양식프로세스 정보, 양식 데이터 ...
	/// </summary>
	public void MakeScript()
	{
		int i = 0;
		string sTmp = string.Empty;
		StringBuilder sScript = null;
		try
		{
			sScript = new StringBuilder();
			//양식 일반 정보	
			sScript.Append("<script type=\"text/javascript\" language=\"javascript\">function initFormInfo(){var oDic = new Dictionary();");//new ActiveXObject('Scripting.Dictionary');
			sScript.Append("\r\n");
			if (Request.QueryString["Readtype"] == "preview")
			{
				sScript.Append("oDic.Add('mode','").Append(strReadMode).Append("');\r\n");
				sScript.Append("oDic.Add('readtype','").Append(Request.QueryString["Readtype"]).Append("');");
			}
			else
			{
				sScript.Append("oDic.Add('mode','").Append(strReadMode).Append("');\r\n");
            }

            #region 201106 결재문서notify FW 권한체크
            //20041206 백종기 수정
			if (Request.QueryString["mode"] == "APPROVAL")
			{

				if (iPIState != (int)CfnEntityClasses.CfInstanceState.instOpen_Running)
				{
                    ////pErrorMessage("결재문서가 이미 처리되었습니다.");
                    //pErrorMessage(Resources.Approval.msg_084);
                    //return;
                    sScript.Append("oDic.Add('loct','").Append("COMPLETE").Append("');");
                    sScript.Append("\r\n");
				}
				else
				{
                    if (iWIState != (int)CfnEntityClasses.CfInstanceState.instOpen_Running)
                    {
                        //pErrorMessage(Resources.Approval.msg_084);
                        //return;
                        sScript.Append("oDic.Add('loct','").Append("PROCESS").Append("');");
                        sScript.Append("\r\n");
                    }
                    else
                    {
                        if (Session["user_code"].ToString() == Request.QueryString["ptid"] || Session["user_code"].ToString() == strPerformerid || Session["user_code"].ToString() == strdeputyid || Request.QueryString["gloct"] == "JOBFUNCTION" || Request.QueryString["gloct"] == "DEPART")
                        {
                            sScript.Append("oDic.Add('loct','").Append(Request.QueryString["mode"]).Append("');");
                            sScript.Append("\r\n");
                        }
                        else
                        {
                            sScript.Append("oDic.Add('loct','").Append("PROCESS").Append("');");
                            sScript.Append("\r\n");
                        }
					}
				}
			}
			else if (Request.QueryString["mode"] == "REDRAFT")
			{
				if (iPIState != (int)CfnEntityClasses.CfInstanceState.instOpen_Running)
				{
                    ////pErrorMessage("결재문서가 이미 재기안되었습니다.");
                    //pErrorMessage(Resources.Approval.msg_085);
                    //return;
                    sScript.Append("oDic.Add('loct','").Append("COMPLETE").Append("');");
                    sScript.Append("\r\n");
				}
				else
				{
       				if (iWIState != (int)CfnEntityClasses.CfInstanceState.instOpen_Running)
				    {
                 ////pErrorMessage("결재문서가 이미 재기안되었습니다.");
                        //pErrorMessage(Resources.Approval.msg_085);
                        //return;
                        sScript.Append("oDic.Add('loct','PROCESS');");//진행중
                        sScript.Append("\r\n");
					}
				    else
				    {
					    sScript.Append("oDic.Add('loct','").Append(Request.QueryString["mode"]).Append("');");
					    sScript.Append("\r\n");
				    }
                }
            }
			else
			{
				sScript.Append("oDic.Add('loct','").Append(Request.QueryString["mode"]).Append("');");
				sScript.Append("\r\n");
            }
            #endregion
            //2006.08 추가 - 양식을 연 결재함 종류 표시
			if (Request.QueryString["gloct"] == null)
			{
				sScript.Append("oDic.Add('gloct','');\r\n");
			}
			else
			{
				sScript.Append("oDic.Add('gloct','").Append(Request.QueryString["gloct"]).Append("');\r\n");
			}

			sScript.Append("oDic.Add('wiid','").Append(Request.QueryString["wiid"]).Append("');\r\n");
			sScript.Append("oDic.Add('ptid','").Append(Request.QueryString["ptid"]).Append("');\r\n");
			sScript.Append("oDic.Add('pist','").Append(Request.QueryString["pist"]).Append("');\r\n");
			sScript.Append("oDic.Add('pfid','").Append(Request.QueryString["pfid"]).Append("');\r\n");
			sScript.Append("oDic.Add('pfsk','").Append(Request.QueryString["pfsk"]).Append("');\r\n");
			sScript.Append("oDic.Add('pidc','").Append(pReplaceSpecialCharacter(Request.QueryString["pidc"])).Append("');\r\n");
			sScript.Append("oDic.Add('pibd1','").Append(pReplaceSpecialCharacter(Request.QueryString["pibd1"])).Append("');\r\n");


			//시행문변환 시 값 변경 필요
			sScript.Append("oDic.Add('fmid','").Append(strFormId).Append("');\r\n");  //'Form ID
			//'sScript.Append("oDic.Add('fmnm','" & Request.QueryString.Item("fmnm") & "');")  'Form Name
			sScript.Append("oDic.Add('fmnm','").Append(strFormName).Append("');\r\n");  //'Form Name 메일에서 오픈시 한글깨짐 현상발생으로 변경
			sScript.Append("oDic.Add('fmpf','").Append(Request.QueryString["fmpf"]).Append("');\r\n");  //'Form Prefix
			sScript.Append("oDic.Add('fmrv','").Append(Request.QueryString["fmrv"]).Append("');\r\n");  //'Form Version
			sScript.Append("oDic.Add('scid','").Append(strSchemaID).Append("');\r\n");  //'schema ID
			sScript.Append("oDic.Add('fmfn','").Append(Request.QueryString["fmfn"]).Append("');\r\n");  //'Form File Name
			sScript.Append("oDic.Add('piid2','").Append(Request.QueryString["piid"]).Append("');\r\n");
            sScript.Append("oDic.Add('gbnno','").Append(Request["gbnno"]).Append("');\r\n"); //20151230 전자증빙 id 추가 


            #region DSCR 보관 값들에 대한 조회 처리 추가 2010.12
            if (sPIDC != string.Empty)
            {
                XmlDocument oXML = new XmlDocument();
                try
                {
                    oXML.LoadXml(sPIDC);
                    XmlNode oFNode = oXML.SelectSingleNode("ClientAppInfo/App/forminfos/forminfo");
                    //기밀문서 여부
                    if (oFNode.Attributes["secure_doc"] != null)
                    {
                        sScript.Append("oDic.Add('secdoc','").Append(oFNode.Attributes["secure_doc"].Value).Append("');\r\n");
                    }
                    else
                    {
                        sScript.Append("oDic.Add('secdoc','").Append(Request.QueryString["secdoc"]).Append("');\r\n");
                    }
                    //feedback
                    if (oFNode.Attributes["feedback"] != null)
                    {
                        sScript.Append("oDic.Add('feedback','").Append(oFNode.Attributes["feedback"].Value).Append("');\r\n");
                    }
                    if (oFNode.Attributes["selfeedback"] != null)
                    {
                        sScript.Append("oDic.Add('selfeedback','").Append(oFNode.Attributes["selfeedback"].Value).Append("');\r\n");
                    }
                }
                catch (System.Exception ex)
                {
                }
                finally
                {
                    oXML = null;
                }
            }
            else
            {
                //기밀문서 여부
                sScript.Append("oDic.Add('secdoc','").Append(Request.QueryString["secdoc"]).Append("');\r\n");
            }
            #endregion
            // '문서이관'  체크박스 출력 여부
			sScript.Append("oDic.Add('edms_document','").Append(Request.QueryString["edms_document"]).Append("');\r\n");

			//'기안일자            
			DateTime dtServerDate = DateTime.Now;

			sScript.Append("oDic.Add('svdt','").Append(pReplaceSpecialCharacter(dtServerDate.ToString("yyyy-MM-dd HH:mm:ss"))).Append("');\r\n");
			//<add key="FrontStorage" value="http://file.test.com/FrontStorage/" />
			//<add key="BackStorage" value="http://file.test.com/BackStroage/" />
			//<add key="FrontStoragePath" value="D:\FrontStorage\" />
			//<add key="BackStoragePath" value="D:\BackStorage\" />
			//'파일 경로명 생성
			//sScript.Append("oDic.Add('fmfl','").Append(pReplaceSpecialCharacter(strFileSystemLocation)).Append("');\r\n");  //'양식의 File System 위치
			sScript.Append("oDic.Add('fmfl','").Append(pReplaceSpecialCharacter(System.Configuration.ConfigurationSettings.AppSettings["FrontStorage"].ToString() + "Approval/")).Append("');\r\n");  //'양식의 File System 위치

			//sScript.Append("oDic.Add('fmurl','").Append(pReplaceSpecialCharacter(strFileBackRoot)).Append("');\r\n");  //'양식의 File System 위치
			sScript.Append("oDic.Add('fmurl','").Append(pReplaceSpecialCharacter(System.Configuration.ConfigurationSettings.AppSettings["BackStorage"].ToString() + "e-sign/ApprovalEDMS/")).Append("');\r\n");  //'양식의 File System 위치
			//sScript.Append("oDic.Add('fmpath','").Append(pReplaceSpecialCharacter(Server_MapPath(strFileBackRoot))).Append("');\r\n");  //'양식의 File System 위치
			sScript.Append("oDic.Add('fmpath','").Append(pReplaceSpecialCharacter(System.Configuration.ConfigurationSettings.AppSettings["BackStoragePath"].ToString() + "e-sign\\ApprovalEDMS\\")).Append("');\r\n");  //'양식의 File System 위치

			//sScript.Append("oDic.Add('attpath','").Append(pReplaceSpecialCharacter(Server_MapPath(pResolveAttachFilePath()))).Append("');\r\n");  //'첨부 File System 위치
			sScript.Append("oDic.Add('attpath','").Append(pReplaceSpecialCharacter(System.Configuration.ConfigurationSettings.AppSettings["BackStoragePath"].ToString() + "e-sign\\Approval\\Attach\\")).Append("');\r\n");  //'첨부 File System 위치

			//'양식 Schema 관련 정보	
			sScript.Append("oDic.Add('scFmid','").Append(strFormId).Append("');\r\n");  //FORM ID
			sScript.Append("oDic.Add('pdef','").Append(oSchema.GetAttribute("pdef")).Append("');\r\n");  //'DEFINITION ID
			//System.Xml.XmlNode oSchemaNode;
			string sSchemaName;

			foreach (System.Xml.XmlNode oSchemaNode in oSchema.ChildNodes)
			{
				sSchemaName = oSchemaNode.Name;
				sScript.Append("oDic.Add('").Append(sSchemaName).Append("','").Append(oSchema.GetAttribute(sSchemaName)).Append("');\r\n"); //'사용여부(1:TRUE,0:FALSE)
				sScript.Append("oDic.Add('").Append(sSchemaName).Append("V','").Append(oSchemaNode.InnerText).Append("');\r\n"); //'특정값

				if (sSchemaName == "scCMB" && oSchema.GetAttribute(sSchemaName) == "1" && oSchemaNode.InnerText != "")
				{
					sMenuURL = oSchemaNode.InnerText;
				}
			}

			sScript.Append("oDic.Add('etnm','").Append(Session["user_ent_name"]).Append("');\r\n");  //'회사명
			sScript.Append("oDic.Add('etid','").Append(Session["user_ent_code"]).Append("');\r\n");  //'회사코드
			sScript.Append("oDic.Add('usid','").Append(Session["user_code"]).Append("');\r\n");  //'로그인 ID
			//sScript.Append("oDic.Add('usdn','").Append(Session["user_name"]).Append("');\r\n");  //'이름
			sScript.Append("oDic.Add('usdn','").Append(Session["user_name_lng"]).Append("');\r\n");  //'이름
			sScript.Append("oDic.Add('sabun','").Append(Session["sabun"]).Append("');\r\n");     //'사번

			sScript.Append("oDic.Add('dpid','").Append(Session["user_dept_code"]).Append("');\r\n");   //'부서코드
			//sScript.Append("oDic.Add('dpdn','").Append(pReplaceSpecialCharacter(Session["user_dept_name"])).Append("');\r\n");   //'부서명
			sScript.Append("oDic.Add('dpdn','").Append(pReplaceSpecialCharacter(Session["user_dept_name_lng"].ToString())).Append("');\r\n");   //'부서명
			sScript.Append("oDic.Add('dpid_apv','").Append(strApvDeptAlias).Append("');\r\n");         //'결재부서코드
			sScript.Append("oDic.Add('dpdn_apv','").Append(pReplaceSpecialCharacter(strApvDeptName)).Append("');\r\n");         //'결재부서명
			sScript.Append("oDic.Add('dpdsn','").Append(strApvDeptShortName).Append("');\r\n");       //'부서명
			sScript.Append("oDic.Add('dppathid','").Append(pReplaceSpecialCharacter(Session["user_dept_fullcode"].ToString())).Append("');\r\n"); //'부서idpath
			sScript.Append("oDic.Add('dppathdn','").Append(pReplaceSpecialCharacter(Session["user_dept_fullname"].ToString())).Append("');\r\n"); //'부서명path
			sScript.Append("oDic.Add('usem','").Append(Session["user_email"]).Append("');\r\n");   //'이메일

			//sScript.Append("oDic.Add('uspn','").Append(Session["user_jobposition_name"]).Append("');\r\n");    //'직위
			sScript.Append("oDic.Add('uspn','").Append(pReplaceSpecialCharacter(Session["user_jobposition_name_lng"].ToString().Replace(Session["user_jobposition_code"].ToString() + "&", ""))).Append("');\r\n");    //'직위
			sScript.Append("oDic.Add('uspc','").Append(Session["user_jobposition_code"]).Append("');\r\n");    //'직위코드
			//sScript.Append("oDic.Add('usln','").Append(Session["user_joblevel_name"]).Append("');\r\n");      //'직급
			sScript.Append("oDic.Add('usln','").Append(pReplaceSpecialCharacter(Session["user_joblevel_name_lng"].ToString().Replace(Session["user_joblevel_code"].ToString()+"&", ""))).Append("');\r\n");      //'직급
			sScript.Append("oDic.Add('uslc','").Append(Session["user_joblevel_code"]).Append("');\r\n");       //'직급코드
			//sScript.Append("oDic.Add('ustn','").Append(Session["user_jobtitle_name"]).Append("');\r\n");       //'직책
			sScript.Append("oDic.Add('ustn','").Append(pReplaceSpecialCharacter(Session["user_jobtitle_name_lng"].ToString().Replace(Session["user_jobtitle_code"].ToString()+"&", ""))).Append("');\r\n");       //'직책
			sScript.Append("oDic.Add('ustc','").Append(Session["user_jobtitle_code"]).Append("');\r\n");       //'직책코드

			sScript.Append("oDic.Add('ustp','").Append(Session["user_tel"]).Append("');\r\n");   //'전화번호
			if (Session["user_fax"].ToString() != "")
				sScript.Append("oDic.Add('usfx','").Append(Session["user_fax"]).Append("');\r\n");  //'전화번호
			else
				sScript.Append("oDic.Add('usfx','").Append(Session["user_tel"]).Append("');\r\n");   //'전화번호          

			sScript.Append("oDic.Add('ussip','").Append(Session["user_sipaddress"]).Append("');\r\n");

			//기안자 서명이미지
			if (Session["user_code"] != null)
			{
				usit = GetSigninform(Session["user_code"].ToString(), "sign");
			}
			sScript.Append("oDic.Add('usit','").Append(usit).Append("');\r\n");

            //개인환경설정값 2010.11
            sScript.Append("oDic.Add('usmsgboxview','").Append(strMsgBoxView).Append("');\r\n");
            sScript.Append("oDic.Add('ustmplistview','").Append(strTmpListView).Append("');\r\n");
            //개인환경설정값 2010.11

			//'결재정보
			sScript.Append("oDic.Add('apst','").Append(pReplaceSpecialCharacter(strApvSteps)).Append("');\r\n");

			//'에디터 사용정보
			sScript.Append("oDic.Add('editortype','").Append(System.Configuration.ConfigurationManager.AppSettings["EditorType"].ToString()).Append("');\r\n");  //에디터

			//'양식정보            
			foreach (System.Collections.DictionaryEntry oFormField in oFormData)
			{
				string strTemp = "";
				if (oFormField.Value != null)
				{
					strTemp = oFormField.Value.ToString();
					if (oFormField.Key.ToString() == "fmbd" && strFormBodyContext != "")
					{
						strTemp = strFormBodyContext;
					}
                    //스크립트 태그 오류로 인해 스크립트 태그 제거(2010-12-13 leesh)
                    if (oFormField.Key.ToString().Equals("BODY_CONTEXT") || oFormField.Key.ToString().Equals("FORM_HTML"))
                    {
                        //스크립트 제거
                        strTemp = removeTag(strTemp, @"<script.*?</script>");

                    }

				}

				sScript.Append("oDic.Add('").Append(oFormField.Key).Append("','").Append(pReplaceSpecialCharacter(strTemp)).Append("');\r\n");
			}

			sScript.Append("oDic.Add('piid','").Append(sPiid).Append("');\r\n");
			sScript.Append("oDic.Add('fiid','").Append(strFormInstanceID).Append("');\r\n");
			sScript.Append("oDic.Add('fiid_spare','").Append(CfnEntityClasses.WfEntity.NewGUID()).Append("');\r\n");
			sScript.Append("oDic.Add('fiid_response','").Append(CfnEntityClasses.WfEntity.NewGUID()).Append("');\r\n");
			sScript.Append("oDic.Add('fiid_reuse','").Append(CfnEntityClasses.WfEntity.NewGUID()).Append("');\r\n");
			sScript.Append("oDic.Add('ftid','").Append(strFormTempInstanceID).Append("');\r\n");
			sScript.Append("oDic.Add('fitn','").Append(strFormInstanceTableName).Append("');\r\n");
			sScript.Append("oDic.Add('piid_spare','").Append(CfnEntityClasses.WfEntity.NewGUID()).Append("');\r\n");

			#region 200902 : 문서관리자 기능 추가
			sScript.Append("oDic.Add('usismanager','").Append(Sessions.ISMANAGER.ToString().ToLower()).Append("');//부서장\r\n"); //부서장여부

			if (strReadMode == "REDRAFT" || strReadMode == "SUBREDRAFT")
			{
				if (Request.QueryString["usisdocmanager"] != null)
				{
					sScript.Append("oDic.Add('usisdocmanager','").Append(Request.QueryString["usisdocmanager"]).Append("');\r\n");
					sScript.Append("oDic.Add('dpisdocmanager','").Append(Request.QueryString["dpisdocmanager"]).Append("');\r\n");
				}
				else
				{
					string sJFCode = System.Web.Configuration.WebConfigurationManager.AppSettings["WF_JFReceive"].ToString(); //수신담당자            
					sScript.Append("oDic.Add('usisdocmanager','").Append(COVIFlowCom.Common.getAuthority(Sessions.PERSON_CODE, sJFCode, "").ToString().ToLower()).Append("');\r\n");//문서관리자여부
					sScript.Append("oDic.Add('dpisdocmanager','").Append(COVIFlowCom.Common.getDocmanager(Sessions.USER_ENT_CODE, Sessions.USER_DEPT_CODE, sJFCode).ToString().ToLower()).Append("');\r\n");//부서 문서관리자 존재여부
				}
			}
			#endregion
			//'임시
			sScript.Append("oDic.Add('DebugInfo','").Append(pReplaceSpecialCharacter(strDebugInfo)).Append("');\r\n");
			//'EDMS 문서에서 재기안
			sScript.Append("oDic.Add('Oid','").Append(Request.QueryString["Oid"]).Append("');\r\n");
			sScript.Append("oDic.Add('Full','").Append(Request.QueryString["Full"]).Append("');\r\n");
			//'발신부서 문서를 수신부서에서 변경하며 재사용을 하는 경우
			if (System.Web.Configuration.WebConfigurationManager.AppSettings[Request.QueryString["fmpf"]] != null)
				sScript.Append("oDic.Add('cvtfminfo','").Append(pReplaceSpecialCharacter(System.Web.Configuration.WebConfigurationManager.AppSettings[Request.QueryString["fmpf"]].ToString()) + "');");
			else
				sScript.Append("oDic.Add('cvtfminfo','');");

			sScript.Append("\r\n");

			//'의견
            //sScript.Append("oDic.Add('commentlist','").Append(pReplaceSpecialCharacter(pGetCommentList().ToString())).Append("');\r\n");
            if (strReadMode == "RECAPPROVAL")
			    sScript.Append("oDic.Add('commentlist','").Append(pReplaceSpecialCharacter(pGetCommentList2().ToString())).Append("');\r\n");
            else
                sScript.Append("oDic.Add('commentlist','").Append(pReplaceSpecialCharacter(pGetCommentList().ToString())).Append("');\r\n");
			//'우선순위
			sScript.Append("oDic.Add('pipr','").Append(strpipr).Append("');\r\n");

			sScript.Append("oDic.Add('pfpfid','").Append(strPerformerid).Append("');\r\n");

			//사용자 언어
			sScript.Append("oDic.Add('uslng','").Append(strLangID).Append("');\r\n");
			//데이터 다국어를 위해 추가
			sScript.Append("oDic.Add('uslngIdx','").Append(COVIFlowCom.Common.getLngIdx(strLangID)).Append("');\r\n");
            
            //장혜인 추가 bstored 2011-01-31 시작
			//마이그레이션데이터
			sScript.Append("oDic.Add('locationurl','").Append(sLocationURL).Append("');\r\n");
            //if (bstored && sLocationURL != string.Empty)
            //{
            //    sScript.Append("oDic.Add('SUBJECT','").Append(pReplaceSpecialCharacter(sSubject)).Append("');\r\n");
            //    sScript.Append("oDic.Add('ATTACH_FILE_INFO','").Append(pReplaceSpecialCharacter(sFileList)).Append("');\r\n");
            //}
			//장혜인 추가 bstored 2011-01-31 끝

            //모바일 추가
            sScript.Append("oDic.Add('mobileyn','").Append(sMobileYN).Append("');\r\n");

            //대결자 id추가
            sScript.Append("oDic.Add('dptid','").Append(strdeputyid).Append("');\r\n");
            
			sScript.Append("return oDic;}\r\n");
			sScript.Append("var g_dicFormInfo=initFormInfo();\r\n");

			{//이준희(2010-12-15): Changed to support SharePoint environment.
			//sScript.Append("function refreshList(){try{opener.parent.location.reload();}catch(e){}}\r\n");
			//sScript.Append("function getFormInfo(){return g_dicFormInfo;}\r\n</script>\r\n");
			sScript.Append("function getFormInfo(){return g_dicFormInfo;}\r\n");
			if (base.bgCEPSIn)//CEPS.CoviFlow.Lib.Main.UriCtxPrx urp = null;//base.lbg.clsgPar
			{//sgCEPSUri = base.lbg.sgUriPop(ConfigurationManager.AppSettings["LoginDomain"], Session["user_code"].ToString(), cbsg.sgIPFlt(Request.UserHostAddress), true);			
				try
				{
					if (strReadMode == "DRAFT")
					{
					}
					else
					{
						sTmp = oFormData["BODY_CONTEXT"].ToString();
						i = sTmp.IndexOf("<CEPSUriID>");
						if (i > -1)
						{
							XmlDocument xdoc = null;
							XmlNode xnd = null;
							xdoc = new XmlDocument();
							xdoc.LoadXml(sTmp);
							xnd = xdoc.SelectSingleNode("BODY_CONTEXT");
							sTmp = xnd.SelectSingleNode("CEPSUriFrmDsp").InnerText;
							sTmp = sTmp.Replace(".", "|");//To avoid URI matching

							sScript.Append("try {opener.parent.CEPD = {");
							sScript.Append("FrmDsp: '" + sTmp + "'.replace(/\\|/g, '.'),");
							sScript.Append("ID: '" + xnd.SelectSingleNode("CEPSUriID").InnerText + "',");
							sScript.Append("Uri: '" + xnd.SelectSingleNode("CEPSUriIte").InnerText + "'");
							sScript.Append("};}catch(e){};");
							//sScript.Append("var sgCEPSUriAbstRot = '").Append(ConfigurationManager.AppSettings["CEPSUriAbstRot"]).Append("';");
							//sScript.Append("var sgCEPSUrlRot = '").Append(ConfigurationManager.AppSettings["CEPSUrlRot"]).Append("';");
						}
					}
				}
				catch (Exception exCEPSUri)
				{
				}
				sScript.Append("function refreshList(){opener.location.reload();};");
			}
			else
			{
				sScript.Append("function refreshList(){try{opener.parent.location.reload();}catch(e){}}\r\n");
			}
			}
			sScript.Append("</script>\r\n");

			Response.Write(sScript.ToString());
		}
		catch (System.Exception ex)
		{
			throw ex;
		}
		finally
		{
			if (sScript != null)
			{
				sScript = null;
			}
		}
	}
	private string GetSigninform(string UserID, string SignType)
	{
		string sSignPath = string.Empty;
		//string sSignURL = "/GWStorage/e-sign/ApprovalSign/Backstamp/";
        string sSignURL = "/GWStorage/e-sign/ApprovalSign/";  //HIW
		{//이준희(2010-10-07): Changed to support SharePoint environment.
		//string sSignPath = Server_MapPath(sSignURL);
		sSignPath = cbsg.CoviServer_MapPath(sSignURL);
		}
		Covi.FileSystemNet oFS = new Covi.FileSystemNet();

		string[] fileEntries = oFS.fnSearchDirectory(sSignPath, SignType + "_" + UserID + "_*.*");
		string fileName = String.Empty;
		try
		{
			if (fileEntries.Length > 0)
			{
				fileName = fileEntries[fileEntries.Length - 1].Substring(fileEntries[fileEntries.Length - 1].LastIndexOf("\\") + 1);
			}
		}
		catch (System.Exception Ex)
		{
			throw new System.Exception("GetApvImage", Ex);
		}
		finally
		{
			oFS = null;
		}
		return fileName;
	}
    #region 스크립트 태그 오류로 인해 스크립트 태그 제거(2010-11-10 leesh)
    /// <summary>
    /// 불필요한 태그 제거
    /// </summary>
    /// <param name="strDocument">strDocument</param>
    /// <param name="strPattern">strPattern</param>
    /// <returns>태그 제거된 본문 ( STIRNG )</returns>
    public string removeTag(string strDocument, string strPattern)
    {

        string strReturnDocument = string.Empty;
        try
        {
            strReturnDocument = Regex.Replace(strDocument, strPattern, "", RegexOptions.Singleline | RegexOptions.IgnoreCase);
        }
        catch (Exception ex)
        {
            throw ex;
        }
        return strReturnDocument;
    }
    #endregion


}
