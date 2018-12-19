﻿using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Text;

/// <summary>
/// 기안 또는 임시저장시 FrontStorage에서 BackStorage로 파일을 옮김 
/// </summary>
public partial class COVIFlowNet_FileAttach_fnMoveFilegetFileInfo : PageBase
{
	string strStorageID = "";
	//string strStorageServerName = "";
	string strStorageVOLUME_NAME = "";
	string logPath = "";
	string FrontPath = "";
	string BackPath = "";

	protected void Page_Load(object sender, EventArgs e)
	{
		//logPath=Server_MapPath("/COVINet/FrontStorage/Approval/Log/log_"+ DateTime.Now.Minute + DateTime.Now.Millisecond + ".txt");
		FrontPath = System.Configuration.ConfigurationSettings.AppSettings["FrontStorage"].ToString();
		BackPath = System.Configuration.ConfigurationSettings.AppSettings["BackStorage"].ToString();

		Response.ContentType = "text/xml";
		Response.Expires = -1;
		Response.CacheControl = "no-cache";
		Response.Buffer = true;

		//string fileinfo = Request.QueryString["filelist"];
		string g_strResp;
		Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");

		try
		{
			//code
			System.Xml.XmlDocument oFormXMLDom;
			oFormXMLDom = pParseRequestBytes(); 
			g_strResp = pMoveFile(oFormXMLDom.DocumentElement);
			Response.Write(g_strResp);
		}
		catch (System.Exception ex)
		{
            
			HandleException(ex);
		}
		finally
		{
			//code
			Response.Write("</response>");
		}
      
	}
    

	public System.Xml.XmlDocument pParseRequestBytes()
	{
        

		Byte[] aBytes=null;
		try
		{
			//code
			System.Xml.XmlDocument oXMLData = new System.Xml.XmlDocument();
			System.Text.Decoder oDecoder = System.Text.Encoding.UTF8.GetDecoder();
            
			aBytes = Request.BinaryRead(Request.TotalBytes);
			char[] aChars = new char[oDecoder.GetCharCount(aBytes, 0, aBytes.Length)];

			oDecoder.GetChars(aBytes, 0, aBytes.Length, aChars, 0);
			oXMLData.Load(new System.IO.StringReader(new String(aChars)));
			return oXMLData;
		}
		catch (System.Exception ex)
		{
            
			throw new System.Exception("Requested Bytes Count = " + aBytes.Length.ToString(), ex);
		}

        
	}


	/// <summary>
	/// FrontStorage에서 BackStorage로 파일을 옮김 
	/// </summary>
	/// <param name="elmRoot">xml형식의 첨부파일리스트</param>
	/// <returns></returns>
	public string pMoveFile(System.Xml.XmlNode elmRoot)
	{
		System.Text.StringBuilder strfilelist = null;
		CfnFormManager.WfFormManager objMTS = null;
		Covi.FileSystemNet objMTSFS = null;
		string filename = "";
		string strFileName = "";
		string strFilelocation = "";
		string strFileURL = "";
		string strStorageId = "";
		string strUserName = "";
		string strDeptName = "";
		//파일 업다운 로드 컴포넌트는 사이즈가 상시 필요하다
		string strFileSize = "";

		System.Xml.XmlNodeList elmList = elmRoot.SelectNodes("fileinfos");
		int i, j, k;

        
		//    ''--- STORAGE ID 얻어오기--'
		//strStorageID = "1";
		strStorageVOLUME_NAME = BackPath;

		//DataSet DS = COVIFlowCom.Common.GetActiveStorageInfo("APPROVAL");

		//if (DS != null)
		//{
		//    if (DS.Tables[0].Rows.Count > 0)
		//    {
		//        DataRow DR;
		//        DR = DS.Tables[0].Rows[0];
		//        if (DR["STORAGE_ID"] != null)
		//        {
		//            strStorageID = DR["STORAGE_ID"].ToString();
		//            strStorageServerName = DR["SERVER_NAME"].ToString();
		//            strStorageVOLUME_NAME = DR["VOLUME_NAME"].ToString();
		//        }

		//    }
		//}
		//else
		//{
		//    throw new Exception("Storage 저장소 값이 존재하지 않습니다");
		//}
		//DS.Dispose();

        
		try
		{
			strfilelist = new StringBuilder();
			//code
			objMTS = new CfnFormManager.WfFormManager();
			objMTSFS = new Covi.FileSystemNet();
			strfilelist.Append("<fileinfos>");
			System.Xml.XmlDocument oFormInfoDom = new System.Xml.XmlDocument();
			oFormInfoDom.LoadXml("<fileinfos></fileinfos>");

			for (j = 0; j <= elmList.Count - 1; j++)
			{
				System.Xml.XmlNodeList elmfileinfo = elmList.Item(j).SelectNodes("fileinfo");
				for (k = 0; k <= elmfileinfo.Count - 1; k++)
				{
					System.Xml.XmlNodeList elmfileList = elmfileinfo.Item(k).SelectNodes("file");
					strfilelist.Append("<fileinfo index='" + k + "'>");
					System.Xml.XmlNode ofileinfo = oFormInfoDom.CreateElement("fileinfo");
					//oFormInfoDom.DocumentElement.AppendChild(ofileinfo);

					System.Xml.XmlAttribute oAttribute = oFormInfoDom.CreateAttribute("index");
					oAttribute.Value = k.ToString();
					ofileinfo.Attributes.SetNamedItem(oAttribute);

					for (i = 0; i <= elmfileList.Count - 1; i++)
					{
						System.Xml.XmlNode elm = elmfileList.Item(i);
						strFileName = elm.Attributes["name"].InnerText;
						strFilelocation = elm.Attributes["location"].InnerText;
						//strStorageId = elm.Attributes["storageid"].InnerText;
						strUserName = elm.Attributes["user_name"].InnerText;
						strDeptName = elm.Attributes["dept_name"].InnerText;
						//사이즈 받아 오는 부분
						strFileSize = elm.Attributes["size"].InnerText;
						strFileURL = strFilelocation;


						filename = strFileName;

						if (strFilelocation.IndexOf(FrontPath) > -1)
						{
                        
							//''첨부파일을 이동
							//''Back-End로 파일저장을 위해 아래로 변경

							//'--- Location ID 생성 ---

							double fileLOCID = objMTS.GetLOCID();
							int fileFolder = Convert.ToInt32(Convert.ToInt32(fileLOCID) / COVIFlowCom.Common.CONST_FILE_COUNT);

							string strCopyFromFile = strFilelocation;
							//Back-End로 파일저장을 위해 아래로 변경및 추가
							string strFILE_BACK_ROOT = System.Configuration.ConfigurationSettings.AppSettings["BackStoragePath"].ToString();

							// 저장할 경로 + 파일 이름 -> url
							string strCopyToFile = strFILE_BACK_ROOT + "e-sign\\Approval\\ATTACH\\" + fileFolder.ToString() + "\\" + fileLOCID.ToString() + "_" + filename;
							//' 저장할 경로 + 파일 이름 -> url
							strFileURL = strStorageVOLUME_NAME + "e-sign/Approval/ATTACH/" + fileFolder.ToString() + "/" + fileLOCID.ToString() + "_" + filename;
                            
							// 프론트 PATH 가져오기
							string frontUrl =  System.Configuration.ConfigurationSettings.AppSettings["FrontStorage"].ToString();
							string frontPhy = System.Configuration.ConfigurationSettings.AppSettings["FrontStoragePath"].ToString();

							strCopyFromFile = strCopyFromFile.Replace(frontUrl,"") .Replace("/","\\");
							strCopyFromFile = frontPhy + "\\" + strCopyFromFile;

                            //네트워크 경로 오류로 주석 (2012-04-19 leesh) strCopyFromFile = strCopyFromFile.Replace("\\\\", "\\");


							//strCopyFromFile = Server_MapPath(strCopyFromFile); // 최종 물리 경로
							// 프론트 PATH 끝



                            

							//'Back-End로 파일저장을 위해 막음

							string strFileResult = objMTSFS.fnMoveFile(strCopyFromFile, strCopyToFile);

							if (strFileResult.Length >= 5)
							{

								if (strFileResult.Substring(0, 5).ToUpper() == "ERROR")
								{
                                    throw new Exception("Error : Move " + strCopyFromFile + " to " + strCopyToFile);
								}
							}
							else
							{
								//임시 디렉토리 삭제
                                
								// 복수 파일 업로드시 문제가 생김
								//if (strCopyFromFile.IndexOf("\\" + Session["user_code"].ToString() + "\\") > -1)
								//{
								//    string strDirectory = strCopyFromFile.Substring(0, strCopyFromFile.LastIndexOf("\\"));
								//    if (System.IO.Directory.Exists(strDirectory))
								//    {
								//        System.IO.Directory.Delete(strDirectory);
								//    }
								//}

								strfilelist.Append("<file name='" + filename + "'");
								strfilelist.Append(" id='" + fileLOCID.ToString() + "_" + filename + "'");
								strfilelist.Append(" location='" + strFileURL + "'");
								strfilelist.Append(" user_name='" + strUserName + "'");
								strfilelist.Append(" dept_name='" + strDeptName + "'");
								strfilelist.Append(" />");

								System.Xml.XmlNode ofile = oFormInfoDom.CreateElement("file");
								ofile.Attributes.SetNamedItem(getAttribute(oFormInfoDom, "name", filename));
								ofile.Attributes.SetNamedItem(getAttribute(oFormInfoDom, "location", strFileURL));
								//사이즈 추가 부분
								ofile.Attributes.SetNamedItem(getAttribute(oFormInfoDom, "size", strFileSize));
								ofile.Attributes.SetNamedItem(getAttribute(oFormInfoDom, "user_name", strUserName));
								ofile.Attributes.SetNamedItem(getAttribute(oFormInfoDom, "dept_name", strDeptName));
                                ofile.Attributes.SetNamedItem(getAttribute(oFormInfoDom, "state", "OLD"));

								ofileinfo.AppendChild(ofile);

							}
						}
						else if (strFilelocation.IndexOf(BackPath) > -1)
						{
							strfilelist.Append("<file name='" + filename + "'");
							strfilelist.Append(" id='" + filename + "'");
							strfilelist.Append(" location='" + strFilelocation + "'");
							strfilelist.Append(" />");

							System.Xml.XmlNode ofile = oFormInfoDom.CreateElement("file");
							ofile.Attributes.SetNamedItem(getAttribute(oFormInfoDom, "name", filename));
							ofile.Attributes.SetNamedItem(getAttribute(oFormInfoDom, "location", strFilelocation));
							//사이즈 추가 부분
							ofile.Attributes.SetNamedItem(getAttribute(oFormInfoDom, "size", strFileSize));
							ofile.Attributes.SetNamedItem(getAttribute(oFormInfoDom, "user_name", strUserName));
							ofile.Attributes.SetNamedItem(getAttribute(oFormInfoDom, "dept_name", strDeptName));
                            ofile.Attributes.SetNamedItem(getAttribute(oFormInfoDom, "state", "OLD"));
                            ofileinfo.AppendChild(ofile);

						}
						else
						{   
								throw new Exception("Error : " + "storage name error");
                            

						}
                            

					}
					oFormInfoDom.DocumentElement.AppendChild(ofileinfo);

					strfilelist.Append("</fileinfo>");
				}
			}
			strfilelist.Append("</fileinfos>");
			objMTS.Dispose();
			objMTS = null;
			objMTSFS = null;
			//' LogWriter.WriteLogToFile(logPath, "<process> (AttachFile) " & " XmlInfo:" & elmRoot.OuterXml & "User:" & Request.ServerVariables("AUTH_USER"))
			//'If Session("user_code") = "A041219" Then
			//'    Throw New System.Exception("첨부파일 오류")
			//'End If
			//'Return strfilelist.ToString
			//Return oFormInfoDom.OuterXml
			return oFormInfoDom.OuterXml;
			//oFormInfoDom = Nothing


		}
		catch (System.Exception ex)
		{
            
			throw ex;


		}
		finally
		{
			//code
			/*
			if(objMTS==null)
			{
				System.EnterpriseServices.ServicedComponent.DisposeObject(objMTS);
			}
			if(objMTSFS==null)
			{
				//System.EnterpriseServices.ServicedComponent.DisposeObject(objMTSFS);
			}*/
		}
	}



	/// <summary>
	/// 사용 안함.
	/// </summary>
	/// <param name="strFileName"></param>
	/// <param name="strFilelocation"></param>
	/// <returns></returns>
	public String pMoveFileLocID(string strFileName, string strFilelocation)
	{
        string filename = string.Empty, strCopyToFile = string.Empty;
		CfnFormManager.WfFormManager objMTS=null;
		Covi.FileSystemNet objMTSFS = null;
		System.Text.StringBuilder strfile = new System.Text.StringBuilder();
		filename = strFileName;
		try
		{
			//code
			objMTS = new CfnFormManager.WfFormManager();
			objMTSFS = new Covi.FileSystemNet();

			//'--- Location ID 생성 ---
			Double fileLOCID = objMTS.GetLOCID();
			int fileFolder = Convert.ToInt32( Convert.ToInt32( fileLOCID) / COVIFlowCom.Common.CONST_FILE_COUNT);

			string strCopyFromFile = strFilelocation;
			//'Back-End로 파일저장을 위해 아래로 변경및 추가
			string strFILE_BACK_ROOT = strStorageVOLUME_NAME;

			if (!strFILE_BACK_ROOT.EndsWith("/"))
			{
				strFILE_BACK_ROOT += "/";
			}


			//저장할 경로 + 파일 이름 -> url
			{//이준희(2010-10-07): Changed to support SharePoint environment.
			//string strCopyToFile = Server_MapPath(strFILE_BACK_ROOT) + fileFolder.ToString() + "\\" + fileLOCID.ToString() + "_" + filename;
			strCopyToFile = cbsg.CoviServer_MapPath(strFILE_BACK_ROOT) + fileFolder.ToString() + "\\" + fileLOCID.ToString() + "_" + filename;
			}
			//저장할 경로 + 파일 이름 -> url
			string strFileURL = strFILE_BACK_ROOT + fileFolder.ToString() + "/" + fileLOCID.ToString() + filename;

            
			string strFileResult = objMTSFS.fnMoveFile(strCopyFromFile, strCopyToFile);

			if (strFileResult.Substring(0, 5).ToUpper() == "ERROR")
			{
                throw new Exception("Error : Copy " + strCopyFromFile + " to " +strCopyToFile);
			}
			else
			{
				strfile.Append("<file name='" + filename + "'");
				//strfile.Append(" storageid='" + strStorageID + "'");
				strfile.Append(" id='" + fileLOCID.ToString() + "_" + filename + "'");
				strfile.Append(" location='" + strFileURL + "'");
				Response.Write(" />");
			}

            
			//System.EnterpriseServices.ServicedComponent.DisposeObject(objMTS)
			//objMTS = Nothing
			System.EnterpriseServices.ServicedComponent.DisposeObject(objMTS);
			objMTS = null;
			//System.EnterpriseServices.ServicedComponent.DisposeObject(objMTSFS)
			//objMTSFS = Nothing
			//System.EnterpriseServices.ServicedComponent.DisposeObject(objMTSFS);
			objMTSFS = null;

			return strfile.ToString();


		}
		catch (System.Exception ex)
		{
            
			HandleException (ex);
			throw new Exception(null, ex);
		}
		finally
		{
			//code
			//If Not objMTS Is Nothing Then
			if (objMTS != null)
			{
				System.EnterpriseServices.ServicedComponent.DisposeObject(objMTS);
			}
			//End If
			//If Not objMTSFS Is Nothing Then
			//    System.EnterpriseServices.ServicedComponent.DisposeObject(objMTSFS)
			//End If
			if (objMTSFS != null)
			{
				//System.EnterpriseServices.ServicedComponent.DisposeObject(objMTSFS);
				objMTSFS = null;
			}
		}
	}


	public String makeNode(string sName, string vVal, bool bCData)
	{
        
		System.Text.StringBuilder strNode=new System.Text.StringBuilder();
		try
		{
			//code
			strNode.Append("<" + sName + ">");
			if (bCData)
			{
				strNode.Append("<![CDATA[" + vVal + "]]>");
			}
			else
			{
				strNode.Append(vVal);
			}
			strNode.Append("</" + sName + ">");
			return strNode.ToString();
            
		}
		catch (System.Exception ex)
		{
            
			throw new Exception("makeNode", ex);
		}
	}

	public System.Xml.XmlAttribute getAttribute(System.Xml.XmlDocument oDom, string name, string value)
	{
        

		try
		{
			//code
			System.Xml.XmlAttribute oAttribute = oDom.CreateAttribute(name);
			oAttribute.Value = value;
			return oAttribute;
		}
		catch (System.Exception ex)
		{
            
            
			HandleException(ex);
			throw new Exception(null, ex);
		}

	}
   
	public void HandleException(System.Exception _Ex)
	{
		try
		{

			Response.Write("<error><![CDATA[" 
				+ COVIFlowCom.ErrResult.ReplaceScriptMsg
				(
					COVIFlowCom.ErrResult.ReplaceErrMsg
					(
						COVIFlowCom.ErrResult.ParseStackTrace(_Ex)
					)
				) + "]]></error>");
		}
		catch (Exception Ex)
		{
			Response.Write("<error><![CDATA[" 
				+ COVIFlowCom.ErrResult.ReplaceScriptMsg
				(
					COVIFlowCom.ErrResult.ReplaceErrMsg(Ex.Message)
				) + "]]></error></response>");
		}
	}

	public void pDeleteFile()
	{
		try
		{
			//code
		}
		catch (System.Exception ex)
		{
            
			HandleException(ex);
			throw new Exception(null, ex);
		}
		finally
		{
			//code
            
		}
	}

}
