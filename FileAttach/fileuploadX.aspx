<%@ Page Language="C#" AutoEventWireup="true" CodeFile="fileuploadX.aspx.cs" Inherits="Approval_FileAttach_fileuploadX" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<HTML>
	<HEAD>
		<TITLE><%= Resources.Approval.lbl_attachfile %></TITLE>
		<meta http-equiv="Content-Language" content="ko">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="Cache-Control" content="no-cache">
		<meta http-equiv="Pragma" content="no-cache">
		<script language="javascript" src="../common/function.js"></script>
		
        		
        <script language="javascript" src="../../SiteReference/js/ClientMessageBox.js"></script>
        <script language="javascript" src="../../SiteReference/js/Utility.js"></script>
        <script language="javascript" src="../../SiteReference/js/Config.js"></script>
        <script language="javascript" src="../../SiteReference/js/EmbedObject.js"></script>
		
		
		<link rel="stylesheet" href="<%=Session["user_thema"] %>/css/css_style.css" type="text/css" />
        <link rel="stylesheet" href="<%=Session["user_thema"] %>/css/search.css" type="text/css" />
		<SCRIPT FOR="flow_bt" EVENT="onmouseover()">this.className = 'Over';</SCRIPT>
		<SCRIPT FOR="flow_bt" EVENT="onmouseout()">this.className = 'Out';</SCRIPT>
		<SCRIPT FOR="ListUpCTL" Event="OnError(nCode, sMsg, sDetailMsg)" LANGUAGE="javascript">
			OnFileManagerError(nCode, sMsg, sDetailMsg);
		</SCRIPT>
		
		<SCRIPT LANGUAGE="JavaScript">
			function OnFileManagerError(nCode, sMsg, sDetailMsg)
			{
//				alert(nCode);
				alert(sMsg);
//				alert(sDetailMsg);
			}
		</SCRIPT>
		<script language="javascript">
		function OnLoadProc(wmin,hmin)
		{
			var sw = screen.availWidth;
			var sh = screen.availHeight;
			var wx = ( sw - wmin ) / 2;
			var wy = ( sh - hmin ) / 2;
			window.moveTo( wx, wy );
			window.resizeTo( wmin, hmin );
		}
		</script>
		<script language="javascript">
		var g_fileCount;
		var sAttchList,g_AttchList;
		var up_xmlHTTP = new ActiveXObject("Microsoft.xmlhttp");
		function ok(){
			if (ShowProgress()) document.oForm.submit();
		}
		function ShowProgress()
		{
			strAppVersion = navigator.appVersion;
			
			if (document.oForm.oFile1.value != "") 
			{
				ProgressID = (new Date()).getTime() % 1000000;
				if (ProgressID==0) ProgressID = 1000000;
				
				if (strAppVersion.indexOf('MSIE') != -1 && strAppVersion.substr(strAppVersion.indexOf('MSIE')+5,1) > 4) {
					winstyle = "dialogWidth=385px; dialogHeight:160px; center:yes";
					window.showModelessDialog("./Progress/show_progress_IE.aspx?ProgressID="+ProgressID, null, winstyle);
				}
				else {
					winpos = "left=" + ((window.screen.width-380)/2) + ",top=" + ((window.screen.height-110)/2);
					winstyle="width=380,height=110,status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=no,copyhistory=no," + winpos;
					var strNewFearture = ModifyWindowFeature(winstyle);
	                window.open("./Progress/show_progress_NN.aspx?ProgressID="+ProgressID,null,strNewFearture);
	                //window.open("./Progress/show_progress_NN.aspx?ProgressID="+ProgressID,null,winstyle);
				}
				document.oForm.action = "uploadFile.aspx?ProgressID=" + ProgressID;
			}
			return true;
		}	
		var g_objMessage;
		var m_objWinDlgArgs = window.dialogArguments;
		var child =null; //20070328
		function window.onload(){
			document.all("ListUpCTL").CodePage = 65001	//20070328
			g_objMessage = getArg("objMessage",null); 
			
		}

		//20070328
		function window.onunload()
		{
			//if(child!= null && !child.closed)
			//	child.close();
			winclose();
		}
		function getArg(sArgName,vDefault){
			try{
				var v = m_objWinDlgArgs[sArgName];
				if(v==null)return vDefault;else return v;
			}catch(e){
				return vDefault;
			}
		}
		function insertfiles(){
		    var strUserName = '<%=strUserName%>'
		    var strUserDeptName = '<%=strUserDeptName%>'
		    filename.value = savefilename.value;
		    filesize.value = savefilesize.value;

		    var aFiles = filename.value.split("||");
		    var aSizes = filesize.value.split("||");
			for (var i=0 ; i < aFiles.length; i++){
			    //opener.addDictionary(aFiles[i], "1;" + aFiles[i] + ";<%=FrontPath%>Approval/" + "<%=user_code%>_" + aFiles[i], aSizes[i], "", strUserName, strUserDeptName); //20070328
			    opener.addDictionary(aFiles[i], "<%=FrontPath%>Approval/" + "<%=user_code%>_" + aFiles[i], aSizes[i], "", strUserName, strUserDeptName); //20070328
			}
			opener.setAttInfo(); //20070328
		}
			
		function displayFileInfo(strFileName){
		//alert("strFileName"+strFileName);
			if (strFileName != ""){g_AttchList = (g_AttchList == "") ? strFileName  : strFileName + "||" + g_AttchList;}
			if (g_AttchList.charAt(g_AttchList.length-1) == "|"){g_AttchList = g_AttchList.substr(0, g_AttchList.length - 2);}
			g_AddAttch = strFileName;
					
			var arrFile = new Array();
			arrFile = g_AttchList.split("||");
			var arrSize = new Array();
			
			g_fileCount = arrFile.length;
			sAttchList = "";

			for (var i= 0; i < arrFile.length-1 ; i++){												
				sAttchItem =  arrFile[i];
				parent.parent.parent.aaa();
				parent.parent.parent.all("AttFileInfo").innerHTML =  "aaa";
			}	
		}
		//20070328
		function Upload()
		{
			if(document.all("ListUpCTL").Count <= 0 )
			{
				alert("There is no file to attach.");
			}	
			else
			{
				winstyle="height=350,width=460, status=no,toolbar=no,menubar=no,location=no";
				var strNewFearture = ModifyWindowFeature(winstyle);
	            child = window.open("XFileUploadMonitor.htm", null,strNewFearture);
	            //child = window.open( "XFileUploadMonitor.htm", null, winstyle);
			}
		}
		
		function AddFile_onclick()
		{
			document.all("ListUpCTL").OpenFileDialog();
		}
		
		function Delete_Onclick()
		{
			document.all("ListUpCTL").DeleteSelectedFile();
		}			
		</script>
		<SCRIPT Language="VBS">
		sub winclose
			If savefilename.value <> "" Then
				insertfiles()
			//	displayFileInfo Trim(filename.value)
			//	msgbox aa
			//	parent.window.close()
			End If
			self.window.close()
		end sub	

		sub EndProc()
			self.window.close()
		end sub	

		
		</script>
	
		<script language="vbs" for="ListUpCTL" event="Upload"> 
			'Upload() 
		</script> 
		
</HEAD>
<BODY>
<div class="popup_title">
  <div class="title_tl">
    <div class="title_tr">
      <div class="title_tc">
      <h2><span><%= Resources.Approval.msg_189 %></span></h2></div>
    </div>
  </div>
</div>
<div class="popup_field">
        <table width="100%" height="120" border="0" cellpadding="0" cellspacing="0" >
            <tr>
                <td width="80%" align="right" bgcolor="#efefef" class="t04"><span id="_StatusInfo"></span></td>
                <td width="20%" align="center" bgcolor="#efefef" rowspan="2">
                    <a href="#" class="Btn05" vspace="5" id="_UxUpload.AddFile" onclick="javascript:AddFile_onclick();"><span><%= Resources.Approval.btn_addfile %></span></a><br />
                    <a href="#" class="Btn05"  id="_UxUpload.DeleteItem"  onclick="javascript:Delete_Onclick();"><span><%= Resources.Approval.btn_removeitem %></span></a> 
                </td>
            </tr>
            <tr>
                <td id="ListUPX"></td>
            </tr>
            <tr>
                <td width="90%" align="right" bgcolor="#efefef" class="t04"><span id="Span1"></span></td>
            </tr>
        </table>
</div>
<div class="popup_Btn small AlignR">
    <a href="#" class="Btn04" id="btnAct" name="btnAct" onclick="javascript:Upload();"><span><%= Resources.Approval.btn_attachfile %></span></a> 
    <a href="#" class="Btn04" onclick="javascript:parent.window.close();"><span><%= Resources.Approval.btn_close %></span></a>
</div>
<input type="hidden" id="Hidden1" name="savefilename">
<input type="hidden" id="Hidden3" name="savefilesize">
<input name="filename" type="hidden">
<input name="filesize" type="hidden">
<input type="hidden" id="Hidden2" name="childalive">

<script language="javascript">
    InnerDexUploadCoustomManager(ListUPX,"ListUpCTL",280,120);
</script>		
</BODY>
</HTML>



