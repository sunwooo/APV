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
/// 결재문서 작성에서 추가된 첨부파일 삭제
/// </summary>
public partial class COVIFlowNet_FileAttach_filedelete : PageBase
{
	protected void Page_Load(object sender, EventArgs e)
	{
		//'여기에 사용자 코드를 배치하여 페이지를 초기화합니다.
		//Dim oFS As FileSystemNet.FileSystemNet
		Covi.FileSystemNet oFS;
        

		try
		{
			//code
			//Dim deleteFiles As System.String = Request.QueryString("deleteFiles") 'fileUrlName
			string deleteFiles = Request.QueryString["deleteFiles"];
			//Dim physicalPath As String
			//string physicalPath=ConfigurationManager.AppSettings["FrontStorage"];
			//physicalPath=physicalPath+"Approval/";
			string physicalPath = COVIFlowCom.Common.CONST_FILE_FRONT_ROOT;
			{//이준희(2010-10-07): Changed to support SharePoint environment.
			//physicalPath=Server_MapPath(physicalPath);
			physicalPath = cbsg.CoviServer_MapPath(physicalPath);
			}
			//Dim files As System.Array = Split(deleteFiles, "|")
			Array files=deleteFiles.Split(';');
			//Dim fileinfo As System.String
			//string fileinfo;
			//Dim i As Int16
			//int i;
			//Response.ContentType = "text/xml"
			Response.ContentType = "text/xml";
			//Response.Expires = -1
			Response.Expires = -1;
			//Response.CacheControl = "no-cache"
			Response.CacheControl = "no-cache";
			//Response.Buffer = True
			Response.Buffer = true;

			//Response.Write("<?xml version='1.0' encoding='utf-8'?><response>")
			Response.Write("<?xml version='1.0' encoding='utf-8'?><response>");

			//oFS = New FileSystemNet.FileSystemNet()
			oFS = new Covi.FileSystemNet();
			//For Each fileinfo In files
			//    If fileinfo <> "" Then
			//        If fileinfo.ToLower.IndexOf("/frontstorage/") > -1 Then
						//physicalPath = Server_MapPath(Split(fileinfo, ";")(0))
			//            Dim sResult = oFS.fnDeleteFile(physicalPath, True)
			//            If Left(sResult, 5) = "ERROR" Then
			//                Throw New System.Exception(Nothing, sResult)
			//            End If

			//        End If
			//    End If
			//Next
			foreach (string fileinfo in files)
			{
				if (fileinfo != "")
				{
					string PhysicalFileName = physicalPath 
						+Session["user_code"].ToString()+"_"+ fileinfo;
					//if (fileinfo.ToLower().IndexOf("/frontstorage/") > -1)
					//{
						//physicalPath = Server_MapPath(Split(fileinfo, ";")(0))
                    
                    
					//physicalPath=Server_MapPath (fileinfo.Split(";"));


					string sResult = oFS.fnDeleteFile(PhysicalFileName, true);

					if(sResult.Length >= 5)
					{
						if (sResult.Substring(0, 5) == "ERROR")
						{
							//throw new System.Exception(null, (System.Exception)sResult);
						}
					}
                        
					//}
				}
			}
			//Response.Write("ok")
			Response.Write("ok");
		}
		catch (System.Exception ex)
		{
            
			HandleException(ex);
			//Catch Ex As System.Exception
			//HandleException(Ex)
		}
		finally
		{
			//code
			Response.Write("</response>");
			//Finally
			//Response.Write("</response>")
			//End Try
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
}
