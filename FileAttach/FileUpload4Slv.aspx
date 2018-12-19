<%@ Page Language="C#" AutoEventWireup="true" CodeFile="fileupload4Slv.aspx.cs" Inherits="COVIFlowNet_FileAttach_fileupload" %>
<%@ Register Assembly="Covision.Framework.Web.UI.Controls, Version=1.0.0.0, Culture=neutral, PublicKeyToken=1ea798a9b6a02d8c" Namespace="Covision.Framework.Web.UI.Controls" TagPrefix="CoviWebControls" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
	<title>
		<%= Resources.Approval.btn_attach %></title>
	<style type="text/css">
		td
		{
			font-family: tahoma;
			font-size: 9pt;
		}
		input
		{
			border: 1px solid;
			border-color: #CCCCCC;
		}
		textarea
		{
			border: 1px solid;
			border-color: #CCCCCC;
		}
	</style>
	<link href = "/COVINet/common/style/covi.css" rel = "stylesheet" type = "text/css" />
	<script type="text/javascript" src="Silverlight.js"></script>
	<script language="javascript" type="text/javascript">
		var bUploadControl = true;
		var bSubmit = false;
		var upfileList = "<%=strINIList %>";
		var OriCoviFileList = "<%=strINIList %>";
		var INIfileList = "<%=strINIListFiles %>";
		var sgUploadSize = '<%=System.Configuration.ConfigurationManager.AppSettings["UploadSize"].ToString()%>';//이준희(2007-01-30): 한 번에 멀티 업로드할 수 있는 파일들의 총 용량임.
		var sgLogoUrl = '<%=System.Configuration.ConfigurationManager.AppSettings["LogoUrl"].ToString()%>';//이준희(2007-01-30): 파일 목록 배경에 사용될 로고의 주소임.
		var sgMaxUnitSize = '<%=System.Configuration.ConfigurationManager.AppSettings["MaxUnitSize"].ToString()%>';//이준희(2007-01-30): 업로드할 수 있는 개별 파일의 최대 용량임.
		var sgUserLanguage = '';
		sgUserLanguage = '<%=Session["user_language"].ToString()%>';//이준희(2007-01-30): 사용자 언어임.
		var sgCoviFileTransVer = '<%=System.Configuration.ConfigurationManager.AppSettings["CoviFileTransVer"].ToString()%>';//이준희(2007-07-09): 파일 전송 컨트롤의 버젼 정보임.
		var user_name = '<%=Session["user_name"].ToString()%>';
		var dept_name = '<%=Session["user_dept_name"].ToString()%>';
		
		function AttachFiles() 
		{
			try 
			{
				while(document.CoviUpload==null) 
				{
				}
			}
			catch(e) 
			{
				alert(e);
			}
			document.CoviUpload.AttachFiles();
			//2006.12.05 by wolf upload UI 변경
			//파일 추가 후 바로 파일 front로 올리기
			sendit();
			//2006.12.05 by wolf upload UI 변경 End
		}

		function DeleteFiles() 
		{
			document.CoviUpload.DeleteFiles();
		}
		function CKoldanew(filelist) 
		{
			var aryTemp = new Array();
			aryTemp = filelist.split(';');
			var strListVal = "";

			for(i = 0;i <= aryTemp.length - 2; i++) 
			{
				var aryKey = new Array();
				aryKey = aryTemp[i].split(':');
				if(aryKey[2] == "NEW") 
				{
					strListVal = "NEW";
				}
			}
			if(strListVal == "") 
			{
				return false;
			}
			else 
			{
				return true;
			}
		}
		function sendit() 
        {
			if(bUploadControl == false) 
			{
				alert("\"CoviUpload\" 컨트롤이 설치되지 않았습니다.");
				return;
			}
			if(bSubmit == true) 
			{
				return;
			}
			
			bSubmit = true;
			var sURL1 = '', sURL2 = '';
			sURL1 = 'http://'+document.location.host;
			sURL2 = '/CoviWeb/common/FileAttach/Common_UP_load.aspx?fpath=Approval';//debugger;
			if("<%=strKind %>" == "1")
			{
				sURL2 = '/CoviWeb/common/FileAttach/Common_UP_load.aspx?fpath=Approval';
			}
			else
			{
				sURL2 = "/CoviWeb/common/FileAttach/Common_UP_load.aspx?fpath='Approval|IMGUpload'";
			}
			
			if(document.CoviUpload.SendFile(sURL1, sURL2)) 
			{
				if(fnHxmFileExist()) 
				{//파일 업로드 직후 유효성 검사를 수행함.
					funConfirm();
				}
				else 
				{
					alert('파일 업로드 중 문제가 발생했습니다. 재시도를 하시고 지속적으로 문제가 발생하면 관리자에게 문의하십시오.');
					bSubmit = false;
					return;
				}
			}
			else 
			{
				alert("전송이 취소되었습니다.");
			}

            		bSubmit = false;
		}
		
		function fnHxmFileExist() 
		{
			var bRet = false;
			var aryTemp = new Array();//배열 만들고
			var aryTemp = document.CoviUpload.GetFilesList().split(';');
			var i = 0, j = 0;
			var sURL = '';
			for(i = 0; i < aryTemp.length - 1; i++) 
			{
				var aryKey = new Array();
				aryKey = aryTemp[i].split(':');
				if(aryKey[2] == "NEW") 
				{//sURL = 'http://' + document.location.host + '<%=strStorage%>'+'<%=Session["user_code"]%>'+'_' + aryKey[0];
					sURL = '<%=strStorage%>'+'<%=Session["user_code"]%>' + '_' + aryKey[0];
					while(bRet == false && j < 10) 
					{//이준희(2007-02-06): robustness를 위해, 컨트롤 자체 역시 100ms 간격으로 총 3회 재시도하도록 되어 있음.
						if(document.CoviUpload.FileExists(sURL) == 200) 
						{
							bRet = true;
						}
						else 
						{
							setTimeout('event_noop()', 1000);
						}
						j += 1;
					}
				}
			}
			//return true;//이준희(2007-02-06): 타이밍 이슈에 대한 조치 후 본 라인은 제거할 것.
			bRet = true;
			return bRet;
		}
		function funConfirm(sFiles)
		{
			//2006.12.05 by wolf upload UI 변경
			//새로 작성

			var AttFileInfo = '', AttFiles = '';
			if(sFiles == '')
			{//이민지(2010-04-15): CoviFileTrans를 사용해서 업로드한 직후일 경우
				AttFileInfo = getListXML();
				AttFiles = getListVal("");
				parent.setAttachInfo2(AttFileInfo, AttFiles);
				return;
			}//이민지(2010-04-15): 이하, CoviSilverlightTrans를 사용해서 업로드한 직후일 경우
			{
				AttFileInfo = getListXML(sFiles);
				AttFiles = getListVal("");
				top.frames[0].setAttachInfo2(AttFileInfo, AttFiles);
            }
            parent.document.getElementById("dvSilverlightTransWrap").style.display = 'none';
			parent.document.getElementById("dvSilverlightTransWrapWrap").style.display = 'none';
		}
		
		function makeDelstring(FileList,fname) 
		{
			var nowINIFile = new Array();
			nowINIFile = FileList.split(';');

			for(var j = 0; j < nowINIFile.length - 1; j++) 
			{
				var aryNow = new Array();
				aryNow = nowINIFile[j].split(':');
				if(fname == aryNow[0] && aryNow[2] == "DEL") 
				{
					return false;
				}
			}
			return true;
		}
		function makeOldXml(FileList) 
		{
			var oldINIFile = new Array();
			var oldOriFile = new Array();

			oldINIFile = INIfileList.split(';');
			oldOriFile = OriCoviFileList.split(';');

			var ofileinfo = "";
			ofileinfo= new ActiveXObject("MSXML2.DOMDocument");
			ofileinfo.loadXML("<fileinfo></fileinfo>");


			for(var i = 0; i < oldINIFile.length - 1; i++) 
			{
				var aryINI = new Array();
				var aryOri =new Array();


				aryINI = oldINIFile[i].split(':');
				aryOri = oldOriFile[i].split(':');
				//xml 알맹이 채우기
				if(makeDelstring(FileList,aryOri[0]) == true) 
				{
					if(CKFrontFile(aryOri[0]) == false)
					 {
						//ofileinfo += " <file name=\"" + aryOri[0] + "\"  ";
						//ofileinfo += " location=\"" + "<%=strBFileLoc%>" + aryINI[0] + "\"   ";
						//ofileinfo += "  size=\"" + aryOri[1] + "\"  ";
						//ofileinfo += "  state=\"OLD\" ";
						//ofileinfo += "  user_name=\"" + aryOri[2] + "\" ";
						//ofileinfo += "  dept_name=\"" + aryOri[3] + "\" ";
						//ofileinfo += "  />";

						var ofile = ofileinfo.createElement("file");
						ofile.setAttribute("name",aryOri[0]);
						ofile.setAttribute("location","<%=strBFileLoc%>"+aryINI[0]);
						ofile.setAttribute("size",aryOri[1]);
						ofile.setAttribute("state","OLD");
						ofile.setAttribute("user_name",aryOri[2] );
						ofile.setAttribute("dept_name", aryOri[3]);
						ofileinfo.documentElement.appendChild(ofile);
					}
				}
			}
			//return ofileinfo;
			 return ofileinfo.xml.replace("<fileinfo>","").replace("</fileinfo>","")
		}
		function makeRloadXml(FileList) 
		{//debugger;
			var oldINIFile = new Array();
			var oldOriFile = new Array();


			oldINIFile = INIfileList.split(';');
			oldOriFile = OriCoviFileList.split(';');

			var ofileinfo = "";
			var ofileinfo= new ActiveXObject("MSXML2.DOMDocument");
			ofileinfo.loadXML("<fileinfo></fileinfo>");

			for(var i = 0; i < oldINIFile.length - 1; i++) 
			{
				var aryINI = new Array();
				var aryOri = new Array();


				aryINI = oldINIFile[i].split(':');
				aryOri = oldOriFile[i].split(':');

				if(makeDelstring(FileList,aryOri[0]) == true) 
				{
					if(CKFrontFile(aryOri[0])) 
					{
						//ofileinfo += " <file name=\"" + aryOri[0] + "\"  ";
						//ofileinfo += " location=\"" + "<%=strStorage%>/" + aryINI[0] + "\"   ";
						//ofileinfo += "  size=\"" + aryOri[1] + "\"  ";
						//ofileinfo += "  state=\"NEW\"  ";
						//ofileinfo += "  user_name=\"" + aryOri[2] + "\"  ";
						//ofileinfo += "  dept_name=\"" + aryOri[3] + "\"  ";
						//ofileinfo += " />";
						var ofile = ofileinfo.createElement("file");
						ofile.setAttribute("name",aryOri[0]);
						ofile.setAttribute("location", "<%=strStorage%>" + aryINI[0]); //원래 코드 ofile.setAttribute("location", "<%=strBFileLoc%>" + aryINI[0]);
						ofile.setAttribute("size",aryOri[1]);
						ofile.setAttribute("state","NEW");
						ofile.setAttribute("user_name",aryOri[2]);
						ofile.setAttribute("dept_name",aryOri[3]);
						ofileinfo.documentElement.appendChild(ofile);
					}
				}
			}
			//return ofileinfo;
			return ofileinfo.xml.replace("<fileinfo>","").replace("</fileinfo>","");
		}
		function getListXML(sFiles)
		{
			var ofileinfo = new ActiveXObject("MSXML2.DOMDocument");
			//xml 껍데기를 만들기
			var aryTemp = new Array();//배열 만들고
			var tmp = '', oldtext = "";
			if(sFiles == null || sFiles == '')
			{//이민지(2010-04-15): CoviFileTrans를 사용해 업로드한 직후일 경우
				tmp = document.CoviUpload.GetFilesList();
			}
			else
			{
				tmp = sFiles;
			}
			if(INIfileList != "")
			{
				oldtext = makeOldXml(tmp);
				oldtext += makeRloadXml(tmp);
				ofileinfo.loadXML("<fileinfo>" + oldtext + "</fileinfo>");
			}
			else 
			{
				ofileinfo.loadXML("<fileinfo></fileinfo>");
			}

			aryTemp = tmp.split(';');
			var strListVal = "";

			var aryINITemp = new Array();

			aryINITemp = INIfileList.split(';');
			var aryUPTemp = new Array();
			aryUPTemp = upfileList.split(';');

			var k;
			if(aryINITemp.length==0) 
			{
				k=0;
			}
			else 
			{
				k = aryINITemp.length-1;
			}
			
			for(var i = 0; i < aryTemp.length - 1; i++)
			{

				var aryKey = new Array();

				aryKey = aryTemp[i].split(':');

				strStorage = '<%=strStorage%>';
				strUserCode = '<%=strUserCode%>';
				var strUserName = '<%=strUserName%>'
				var strUserDeptName = '<%=strUserDeptName%>'

				var strlocation = strStorage + strUserCode + "_" + aryKey[0];
				//삭제일 경우에는 삭제 리스트에는 보이지 않으나
				//데이터 상에는 남아 있으므로 이렇게 한다
				if(aryKey[2] != "OLD" && aryKey[2] != "DEL") 
				{
					//xml 알맹이 채우기
					var ofile = ofileinfo.createElement("file");															
					ofile.setAttribute("name", aryKey[0]);					
					ofile.setAttribute("storageid", "1");
					ofile.setAttribute("id", aryKey[0]);
					ofile.setAttribute("location", strlocation);
					ofile.setAttribute("user_name", strUserName);
					ofile.setAttribute("dept_name", strUserDeptName);
					//파일 업로드 컴포넌트 문제로 사용
					//사이즈가 필요 해서 사용함
					ofile.setAttribute("size", aryKey[1]);
					//파일 상태 값 old;new;del				
					if(aryKey[2] == undefined)
					{
						ofile.setAttribute("state", "NEW");
					}
					else
					{
						ofile.setAttribute("state", aryKey[2]);
					}
					ofileinfo.documentElement.appendChild(ofile);
				}
			}
			if(ofileinfo.xml == null || ofileinfo.xml == "")
			{
				return "";
			}
			else if(aryTemp.length == 1) 
			{
				return "";
			}
			else 
			{
				return ofileinfo.xml;	
			}
		}
		function getListVal(href) 
		{
			return "";
		}
		function CKFrontFile(name)
		{
		
			var strFfile;
			var aryTemp = new Array();
			aryTemp = INIfileList.split(';');

			for(var i = 0; i < aryTemp.length - 1; i++) 
			{
				var aryKey = new Array();
				aryKey = aryTemp[i].split(':');

				strFfile = aryKey[0];
				strFfile = strFfile.replace("<%=strUserCode%>" + "_" , "")
				if(strFfile == name) 
				{
					return true;
				}
			}
			return false;
		}
		function fileHref(name) 
		{
			return name.replace("%", "%25").replace("&", "%26").replace("#", "%23").replace("+", "%2B");
		}
		//2006.12.05 by wolf upload UI변경
		//창이 로딩되면서 파일선택창 나타나게
		var bgCoviSlvInit = false
		var igSlvTransTmr = 0;
		window.onload = function() 
		{
			var bSlvTrans = false;//이민지(2010-04-14): 이하, CoviSilverlightTrans를 지원하기 위해 부분 수정함.
			var sQstr = '';
			try 
			{
				sQstr = document.location.href.split('?')[1];
				if(sQstr.indexOf('mod=SlvTrans') > -1) 
				{
					bSlvTrans = true;
				}
			}
			catch(e) 
			{
			} 
			if(bSlvTrans) 
			{
				var asSizeOri = new Array();
				document.getElementById('Xaml1').style.display = 'inline';
				var oContainer = null;
				oContainer = document.getElementById('dvSilverlightTrans');
				asSizeOri = document.getElementById('btnClickAgent').value.split('_');
				oContainer.style.width = asSizeOri[0];
				oContainer.style.height = asSizeOri[1];
				if(!bgCoviSlvInit)
				{//컨트롤이 아직 표시된 적이 없을 경우
					bgCoviSlvInit = true;
					fnSendKey('KEYONLY');
				}
				else
				{//이미 표시되었던 경우
					fnSendKey();//이준희(2010-04-09): 파일 선택 대화상자를 매번 자동으로 열어주기 위해 추가함.
				}
			}
			else 
			{
				document.getElementById('dvSilverlightTrans').style.display = 'none';
				document.getElementById('CoviFileTrans').style.display = 'inline';
				igSlvTransTmr = window.setInterval('fnSlvTransDelay()', 200);
			} 
		}
		
		function fnSlvTransDelay()
		{
			var oBody = null, oEle = null;
			oBody = document.body;
			oEle = document.createElement('DIV');
			if(document.getElementById('dvSlvTransDum') == null)
			{
				oBody.appendChild(oEle);
				oEle.id = 'dvSlvTransDum';
				return;
			}
			document.getElementById('dvSlvTransDum').appendChild(oEle);
			oEle.innerHTML = 'DUMMYDUMMYDUMMYDUMMYDUMMYDUMMYDUMMYDUMMYDUMMYDUMMY';
			if(document.getElementById('dvSlvTransDum').innerHTML.length < 300)
			{
				return;
			}
			window.clearInterval(igSlvTransTmr);
			AttachFiles();
		}
		
		function event_noop() 
		{ 
			return (false); 
		}
		
		function fnCOPMNow()
		{//이준희(2000-03-10): 현재 일자를 yyyymmddhhmmss 형식으로 반환하는 함수를 추가함.
			var sToday = '', sTmp = '', dt = '';
			dt = new Date();
			
			sTmp	+= dt.getYear().toString();
			sToday	+= sTmp;
			sTmp = (parseInt(dt.getMonth()) + 1).toString();
			sTmp = ('0' + sTmp);
			sTmp = sTmp.substring(sTmp.length - 2, sTmp.length);
			sToday += sTmp;
			sTmp = dt.getDate().toString();
			sTmp = ('0' + sTmp);
			sTmp = sTmp.substring(sTmp.length - 2, sTmp.length);
			sToday += sTmp;
			sTmp = dt.getHours().toString();
			sTmp = ('0' + sTmp);
			sTmp = sTmp.substring(sTmp.length - 2, sTmp.length);
			sToday += sTmp;
			sTmp = dt.getMinutes().toString();
			sTmp = ('0' + sTmp);
			sTmp = sTmp.substring(sTmp.length - 2, sTmp.length);
			sToday += sTmp;
			sTmp = dt.getSeconds().toString();
			sTmp = ('0' + sTmp);
			sTmp = sTmp.substring(sTmp.length - 2, sTmp.length);
			sToday += sTmp;
			return sToday;
		}
		function fnSendKey(sMod) 
		{
			try 
			{
				if (navigator.userAgent.indexOf('MSIE') > -1) 
				{//이민지(2010-05-28): IE 인 경우에는 fnSendKey 실행
				}
				else 
				{//이민지(2010-05-28): 다른 브라우저인 경우에는 return
					return;
				}
			}
			catch (e)
			{
			}
			
			var upctrl = document.getElementById('Xaml1');
			
			if(sMod == 'KEYONLY')
			{
			}
			try
			{
				fnSendFileList();
			}
			catch(e)
			{
			}
			var i = 0;
			var sPath = '';
			var asVbs = new Array();
			var shl = null, fso = null, fle = null;
			asVbs.push('Option Explicit');
			asVbs.push('Dim i');
			asVbs.push('Dim shl');
			asVbs.push('set shl = CreateObject("WScript.Shell")');
			asVbs.push('For i = 0 To 5');
			asVbs.push('WScript.Sleep 100');
			asVbs.push('shl.SendKeys "{F9}"');
			asVbs.push('Next');
			asVbs.push('WScript.Quit');
			try
			{
				document.onkeypress = null;
				document.onkeydown = null;
				try
				{
					sPath += FnTmpGet();
				}
				catch(e)
				{
				}
				//이민지(2010-07-01): 임시폴더경로를 가지고 오지 못했을 경우 처리
				if(sPath == '')
				{
					return;
				}
				sPath += '\\~' + fnCOPMNow() + 'CoviSilverlightTransTmp.vbs';
				shl = new ActiveXObject('WScript.Shell');
				fso = new ActiveXObject('Scripting.FileSystemObject');
				fle = fso.OpenTextFile(sPath, 2, true, -1);
				while(!fso.FileExists(sPath) && i < 1024)
				{
					i++;
				}
				if(!fso.FileExists(sPath))
				{
					return;
				}
				for(i = 0; i < asVbs.length; i++) 
				{
					fle.WriteLine(asVbs[i]);
				}
				fle.Close();
				fle = null;
				i = 0;
				while(!fso.FileExists(sPath) && i < 1024)
				{
					i++;
				}
				if(!fso.FileExists(sPath))
				{
					return;
				}
				fso = null;
				{
					shl.Run(sPath);
				}
			}
			catch(e)
			{
			}
			finally
			{
				fle = null;
				fso = null;
			}

}

function FnTmpGet(){var sRet = '';var fso = null;try{fso = new ActiveXObject("Scripting.FileSystemObject");sRet = fso.GetSpecialFolder(2);}catch(e){}return sRet;}

	</script>
</head>
<body topmargin="0" leftmargin="0">
	<form id="form1" method="post" enctype="multipart/form-data" action="/CoviWeb/common/FileAttach/Common_UP_load.aspx?fpath='Approval'"
	runat="server">
	<div id= "CoviFileTrans" style="display: none; background-color:Transparent;">
	<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
		<tr>
			<td height="3" align="center" valign="middle" class="table_topline">
			</td>
		</tr>
		<tr>
			<td height="40" align="left" valign="middle" class="table_green">
				&nbsp;&nbsp;&nbsp;
				<img src="../../common/images/icon/icon_pop.gif" width="27" height="18"
					align="absmiddle">
				파일첨부
			</td>
		</tr>
		<tr>
			<td height="1" align="center" valign="middle" class="pop_line">
			</td>
		</tr>
		<tr>
			<td align="center" valign="top" class="pop_bg">
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td height="200" align="center" class="table_gray">
							<div id="CoviUpload">
								<script type="text/javascript" src="./fileupload.js" language="javascript"></script>							
							</div>
						</td>
					</tr>
					<tr>
						<td align="center" height="30">
							<table border="0" cellpadding="0" cellspacing="0" style="padding-left: 3px; margin-top: 15">
								<tr>
									<td>
										<table border="0" cellpadding="0" cellspacing="0" height="20" style="cursor: hand"
											onclick="AttachFiles();">
											<tr align="center">
												<td align="left">
													<img src="../../common/images/button/btn_left.gif" alt="" />
												</td>
												<td class="btn_bg">
													<%= Resources.Approval.btn_add %>
												</td>
												<td align="right">
													<img src="../../common/images/button/btn_right.gif" alt="" />
												</td>
											</tr>
										</table>
									</td>
									<td>
										<table border="0" cellpadding="0" cellspacing="0" height="20" style="cursor: hand"
											onclick="DeleteFiles();">
											<tr align="center">
												<td align="left">
													<img src="../../common/images/button/btn_left.gif" alt="" />
												</td>
												<td class="btn_bg">
													<%= Resources.Approval.btn_delete %>
												</td>
												<td align="right">
													<img src="../../common/images/button/btn_right.gif" alt="" />
												</td>
											</tr>
										</table>
									</td>
									<td>
										<table border="0" cellpadding="0" cellspacing="0" height="20" style="cursor: hand"
											onclick="sendit();">
											<tr align="center">
												<td align="left">
													<img src="../../common/images/button/btn_left.gif" alt="" />
												</td>
												<td class="btn_bg">
													<%= Resources.Approval.btn_confirm %>
												</td>
												<td align="right">
													<img src="../../common/images/button/btn_right.gif" alt="" />
												</td>
											</tr>
										</table>
									</td>
									<td>
										<table border="0" cellpadding="0" cellspacing="0" height="20" style="cursor: hand"
											onclick="javascript:window.close();">
											<tr align="center">
												<td align="left">
													<img src="../../common/images/button/btn_left.gif" alt="" />
												</td>
												<td class="btn_bg">
													<%= Resources.Approval.btn_close %>
												</td>
												<td align="right">
													<img src="../../common/images/button/btn_right.gif" alt="" />
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td height="2" align="center" background="../../common/images/icon/spot_gray.gif">
						</td>
					</tr>
					<tr>
						<td height="10" align="center">
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td height="3" align="center" valign="middle" class="table_topline">
			</td>
		</tr>
	</table>
	</div>
	<div id="dellink">
	</div>
	<div id="dvSilverlightTrans" CoviSlvTransBuf="568_344" style="position: absolute; left: 0px; top: 0px; width: 568px; height: 344px; z-index: 1;" >
	<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="Xaml1" width="100%" height="344px" style="display: none; border: none;">;
	<param name="source" value="/covision.SilverlightMultiFileUploadWeb/ClientBin/covision.SilverlightMultiFileUpload.xap" />;
	<param name="minRuntimeVersion" value="2.0.30825.0" />
	<param name="HttpUploader" value="true" />
	<param name="DefaultColor" value="#e8e8e9" />
	<param name="Windowless" value="true" />
	<param name="initParams" value="Fpath=Approval,FilesExisting=<%=FilesExisting%>,ID=<%=strUserCode%>,MaxFileSizeKB=<%=MaxFileSize%>,MaxUploads=<%=MaxUpload%>,FileExtensionFilter=<%=FileExtensionFilter%>,FileNameFilter=<%=FileNameFilter%>,SlvColor=<%=SlvColor%>,TimeKey=<%=sTimeKey%>,Lan=<%=Lan%>"/>
	</object>
	<script type="text/javascript"></script>
		<input type="button" id="btnClickAgent" visible="false" style="height: 0px; width: 0px" value="568_344"/>
		<span style="cursor: pointer;" onclick="JavaScript:fnSendKey();"></span>
	</div>

	<script type="text/javascript">
		var upctrl = document.getElementById('Xaml1');
		setTimeout(setFnCloseUpload,1000);


function setFnCloseUpload(){
fnCloseUpload = function() 
{//이준희(2010-04-06): 페이지 탈출 시의 "Invalid Pointer" 오류 -Silverlight의 rendered script상의 버그임- 를 해결하기 위해 부분 수정함.
	var oContainer = null;
	oContainer = document.getElementById('dvSilverlightTrans');

	//CoviSlvTransBuf = style.width.toString() + '_' + style.height.toString();
	oContainer.style.width		= 0;
	oContainer.style.height 	= 0;

	upctrl.content.Page.ClearFilesList('SCREEN');
	try
	{//이민지(2010-04-16): 파일 전송이 끝난 뒤 iframe 설정을 해제 해 주기 위한 함수로 이동

parent.document.getElementById("dvSilverlightTransWrap").style.display = 'none';
				parent.document.getElementById("dvSilverlightTransWrapWrap").style.display = 'none';
	}
	catch(e)
	{
	}
}
}
	</script>
	</form>
</body>
</html>
<%--<script type="text/vbscript">
	Function FnTmpGet()
		Dim fso, tempfile
		On Error Resume Next
		Set fso = CreateObject("Scripting.FileSystemObject")
		Dim tfolder, tname, tfile
		Const TemporaryFolder = 2
		Set tfolder = fso.GetSpecialFolder(TemporaryFolder)
		FnTmpGet = tfolder
	End Function
</script>--%>