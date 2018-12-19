<%@ Page Language="C#" AutoEventWireup="true" CodeFile="info_change_sign.aspx.cs" Inherits="Approval_Portal_info_change_sign" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <title>결재서명</title>
			
    
</head>
<body>
    <form runat="server" id="oForm" name="oForm" target="result_fr">
			<div class="popup_title">
				<div class="title_tl">
					<div class="title_tr">
						<div class="title_tc">
						<h2><%=Resources.Approval.lbl_sign_instruction %></h2>
						</div>
					</div>
				</div>
			</div>
			<div class="popup_box">
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
					<td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_top_left.gif" /></td>
					<td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_top_bg.gif"></td>
					<td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_top_right.gif" /></td>
					</tr>
					<tr>
					<td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_left_bg.gif"></td>
					<td>
					<%--<INPUT TYPE="radio" NAME="gubun" onClick="setMode('stamp')" value="stamp" checked><%= Resources.Approval.lbl_stamp %><INPUT TYPE="radio" NAME="gubun" value="sign" onclick="setMode('sign')"><%= Resources.Approval.lbl_sign %>--%>
					<table width="100%" border="0" cellspacing="0" cellpadding="0">
						<tr>
						<td width="80%" style=" padding-left: 10px;">
						<iframe name="frameUploadFile" id="frameUploadFile" frameborder="0" width="100%" height="120px" src="iStampUpload.aspx" scrolling="no"></iframe> 
						</td>
						<td width="20%" style=" padding-top: 5px; padding-bottom: 5px;" align="center" valign="middle"><img  id="ImageLoc" name="ImageLoc"  src="<%=Session["user_thema"] %>/Covi/approval/sample_sign.gif" width="50" height="50"></td>
						</tr>
					</table>
					</td>
					<td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_right_bg.gif"></td>
					</tr>  
					<tr>
					<td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_bottom_left.gif" /></td>
					<td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_bottom_bg.gif"></td>
					<td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_bottom_right.gif" /></td>
					</tr>
				</table>
				<div id="dellink" style="display:none;"></div>
			</div>
			<div style="padding-top: 10px; padding-left: 5px; padding-right: 5px;height:130px;">
				<!-- 등록 div 시작 -->
				<div class="BTable" id="list" style="overflow:auto;">
				<!-- 일반 div 시작 -->
			 </div>
			</div>
			<div class="popup_Btn small" style=" text-align: right; padding-right: 20px;">
                <a class="Btn04" href="#" onclick="javascript:window.deleteitem();"><span><%=Resources.Approval.btn_delete %></span></a>
                <a class="Btn04" href="#" onclick="window.close();"><span><%=Resources.Approval.btn_close %></span></a>
            </div>	   									
    </form>
<!--버튼의 이벤트를 위한 스크립트 입니다..-->
    <script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/Dictionary.js"></script>  
	<script language="javascript" type="text/javascript">
			<!--
			var dicFileInfo = new Dictionary();
			var key = 1;
			var count = 0;

			window.onload= initOnload;
			function initOnload(){
				makeDictionary("<%=sInfo%>");
				refreshList();
			}
			function makeDictionary(strFileInfo){
				var  aFile = strFileInfo.split(";");
				if (aFile != ""){
				    for (var i=0; i<aFile.length;i++) {
					    var sMode = aFile[i].substring(0,5);
					    addDictionary(aFile[i],(sMode=="stamp"?"<%= Resources.Approval.lbl_stamp %>":"<%= Resources.Approval.lbl_sign %>"));
				    }
				}
			}
			function refreshList(){
			   document.getElementById("list").innerHTML= makeTable();
			}
			function makeTable() {
			    
				var strTable;
				var aryTemp = new Array() ;
				var aryKey = new Array() ;
				aryKey = dicFileInfo.Keys();
				aryTemp = dicFileInfo.Items();					
				strTable = new String();
				strTable = "<table border='0'  width='100%'  cellspacing='0' cellpadding='0' style='border-width:0px;width:100%;border-collapse:collapse;'><thead> ";
				strTable += "\n<tr><td height=\"2\" colspan=\"9\" class=\"BTable_bg01\"></td></tr>";
				strTable += "\n<tr class=\"BTable_bg02\" style=\"height:27px\"><th width=\"12%\"><%= Resources.Approval.lbl_selection %></th>";
				strTable += "\n<th width=\88%\" align=\"center\"><%= Resources.Approval.lbl_gubun %></th> ";
				strTable += "\n</tr><tr><td height=\"1\" colspan=\"9\" class=\"BTable_bg03\"></td></tr></thead>";
				try{
				    if (count <= 0 ) {
						strTable = strTable + "\n<tr ><td colspan=2 ><%= Resources.Approval.msg_112 %></td>\n</tr>" ;
                        }else{					
					    for(i = 0;i <= aryTemp.length-1;i++){
						    strTable = strTable + "\n<tr style=\"height:25px\">" 
											    + "\n<td>"
											    + "<input type=checkbox name='_" + aryKey[i] + "' value='" + aryKey[i] + "'>" 
											    + "</td>"
											    + getList(aryTemp[i],aryKey[i]) ;
						    strTable = strTable + "\n</tr>" ;
					    }	
					}
					strTable = strTable + "<tr>";
					strTable = strTable + "  <td height=\"1\" colspan=\"2\" class=\"BTable_bg03\"></td>";
					strTable = strTable + "</tr>";
					strTable = strTable + "<tr>";
					strTable = strTable + "  <td height=\"2\" colspan=\"2\" class=\"BTable_bg04\"></td>";
					strTable = strTable + "</tr>";
					
//					strTable = strTable + "<tr><td colspan=\"2\" class=\"table_white\" align=\"center\" ><div ID=\"imgDelete\" style=\"display:none;\"><a class=\"Btn_Group01\" href=\"#\" onclick=\"javascript:window.deleteitem();\" style=\"cursor:default;\"><span><img src=\"<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_delete.gif\" align=\"middle\" /><%=Resources.Approval.btn_delete %></span></a><img src=\"<%=Session["user_thema"] %>/Covi/Common/btn/btn_group01_line.gif\" style=\"display: block; float: left; margin-left: 6px; margin-right: 8px;\" /></div></td></tr>";
					
					strTable = strTable + "</Table>";
				}catch(e){
					alert(e.description);
				}
				return strTable;
			}

			function getList(strItem, key){
				var strList = "";
				var strHref = "";
				
				var Title;
				
				//2007.07.30 박동현 배열갯수가 3, 4개를 구분해서 파일명 출력을 다르게 한다. (옛날파일 : 배열갯수 3개)
				var sp = new Array();
				sp = key.split("_");
				
				if (key.indexOf("ISU_") > -1) {  //지주사외 계열사 HIW
				    if (sp.length > 4) {
				        //if (key!=""){
				        var strTitle0 = key.split("_")[0];
				        var strTitle1 = key.split("_")[1] + "_" + key.split("_")[2];
				        var strTitle2 = key.split("_")[3];
				        var strTitle3 = key.split("_")[4];
				        var Utitle1 = toUTF8(strTitle2);
				        Title = strTitle0 + "_" + strTitle1 + "_" + Utitle1 + "_" + strTitle3;
				    }
				    else {
				        var strTitle0 = key.split("_")[0];
				        var strTitle2 = key.split("_")[1] + "_" + key.split("_")[2];
				        var strTitle1 = key.split("_")[3];
				        Title = strTitle0 + "_" + strTitle2 + "_" + strTitle1;
				    }
				}
				else {  //지주사:(주)이수 인경우 (기존소스와 동일: PERSON_CODE에 "_"가 없기때문) HIW
				    if (sp.length > 3) {
				        //if (key!=""){
				        var strTitle0 = key.split("_")[0];
				        var strTitle1 = key.split("_")[1];
				        var strTitle2 = key.split("_")[2];
				        var strTitle3 = key.split("_")[3];
				        var Utitle1 = toUTF8(strTitle2);
				        Title = strTitle0 + "_" + strTitle1 + "_" + Utitle1 + "_" + strTitle3;
				    }
				    else {
				        var strTitle0 = key.split("_")[0];
				        var strTitle2 = key.split("_")[1];
				        var strTitle1 = key.split("_")[2];
				        Title = strTitle0 + "_" + strTitle2 + "_" + strTitle1;
				    }
				}
                
                //strHref = "<a href=\'#\' onClick=setImage(\'" + key + "\')>["+strItem + "]" + strTitle+"</a>";
                //strHref = "<a href=\'#\' onClick=\"setImage(\'" + key + "\')\"> "+ strTitle2+"</a>";   //2007.07.26 박동현 사용자등록 파일명 보이기
                strHref = "<a href=\'#\' onClick=\"setImage(\'" + Title + "\')\"> "+ strTitle2+"</a>";   //2007.07.26 박동현 사용자등록 파일명 보이기
				strList = "\n<td class=\"table_white\">" + strHref + "</td>"  ;
				//}
				return strList;
			}

			function submitFile() {
				if (oForm.oFile1.value == "") 
				{
					alert("<%= Resources.Approval.msg_003 %>");
					return false;
				}
				document.body.style.cursor = "wait";
				updateProgress('Progress','Wait...');
			//  if (true == ShowProgress())
				oForm.submit();
				document.oForm.oFile1.disabled = true;
			}

			function addDictionary(strKey, smode){
				//alert(strKey + "--" + smode);
				key = strKey;
				count = count + 1;
				if (dicFileInfo.Exists(key) == false) {
					dicFileInfo.Add(key, smode); //사번, 구분
				}
				refreshList();
			}
				
			function deleteitem(){
				var deletemark = DeleteMarked();	
				var aryTemp = new Array();
				var aryKey = new Array();
				var position;
				var delKey, delItem;	
				
				if (deletemark != ""){
					if ( confirm("<%= Resources.Approval.msg_093 %>")){
						aryKey = dicFileInfo.Keys();
						aryTemp = dicFileInfo.Items();
						
						try{
							delKey = "";
							delItem = "";
							for(i=aryKey.length-1;i>-1;i--){			
								position = deletemark.indexOf(aryKey[i]);
								if (position >= 0) {
									delKey = delKey + aryKey[i] +"|";
									delItem = delItem + aryTemp[i] +"|";
									//opener.insertDicFileInfo(aryTemp[i]);
								}	
							}
							deleteDictionary();
						}catch(e){
							alert(e.description);
						}
					}
				}
			}	

			function DeleteMarked() 
			{  
				var tmp="" ;
				var elementName="" ;

				thisForm=self.list.document.oForm ;

				for (j=thisForm.elements.length-1; j>=0; j--) { 
					elementName=thisForm.elements[j].name ;

					if (elementName.substring(0,1)=="_") {
						if (thisForm.elements[j].checked){ 
							tmp = tmp + "|" + thisForm.elements[j].value ;
						}
					}
				}
				return tmp ;
			}

			function deleteDictionary(){
				var deletemark = DeleteMarked();	
				var aryTemp = new Array() ;
				var aryKey = new Array() ;
				var position ;
				var deleteFiles=""
				if (deletemark != "") {
					aryKey = dicFileInfo.Keys();
					aryTemp =dicFileInfo.Items();	
					try{
						for(i=aryKey.length-1;i>-1;i--){
							position = deletemark.indexOf(aryKey[i]) ;
							if (position >= 0) {
								dicFileInfo.Remove(aryKey[i]) ;
								count = count - 1;	
								deleteFiles += toUTF8(aryKey[i]) + "|";		
							}	
						}
						fileDelete(deleteFiles);						
					}catch(e){
						alert(e.description);
					}
				}
				alert('<%= Resources.Approval.msg_170 %>');
				refreshList();
			}			
			//progress bar처리
			function ShowProgress(){ 
			   strAppVersion = navigator.appVersion; 
			   if (document.oForm.oFile1.value != "") {
				  if (strAppVersion.indexOf('MSIE')!=-1 && 
					  strAppVersion.substr(strAppVersion.indexOf('MSIE')+5,1) > 4) { 

					  winstyle = "dialogWidth=385px; dialogHeight:150px; center:yes"; 
					  window.showModelessDialog("show_progress.aspx?nav=ie", null, winstyle); 
				  } 
				  else { 
					  winpos = "left=" + ((window.screen.width-380)/2)+",top=" +
						   ((window.screen.height-110)/2); 
					  winstyle = "width=380,height=110,status=no,toolbar=no,menubar=no," + 
						   "location=no,resizable=no,scrollbars=no,copyhistory=no," + winpos; 
					  var strNewFearture = ModifyWindowFeature(winstyle);
	                    window.open("show_progress.aspx",null,strNewFearture);
	                    //window.open("show_progress.aspx",null,winstyle); 
				  } 
			   }
			   return true; 
			} 
			function fileDelete(deleteFiles){
				var frame="<IFRAME ID='ifrDL' FRAMEBORDER=0 style='HEIGHT:0%;WIDTH:100%' SRC='iStampUpload.aspx?workmode=delete&deleteFiles="+deleteFiles+"' scrolling='no'></IFRAME>";	//fileHref(deleteFiles)
				dellink.innerHTML=frame;
				dellink.style.display="none";					
				return true;
			}
			function fileHref(name){
				return name.replace("%","%25").replace("&","%26").replace("#","%23").replace("+","%2B");
			}
			function setImage(sName){
			    //var sUPUrl = "/GWStorage/e-sign/ApprovalSign/Backstamp/";
			    var sUPUrl = "/GWStorage/e-sign/ApprovalSign/";
				oForm.ImageLoc.src = sUPUrl + sName;
				//oForm.ImageLoc.src = sUPUrl + toUTF8(sName);
			}
			function setMode(sMode){
				frameUploadFile.setMode(sMode);
			}
			function toUTF8(szInput){
	        var wch,x,uch="",szRet="";
	        for (x=0; x<szInput.length; x++) {
		        wch=szInput.charCodeAt(x);
		        if (!(wch & 0xFF80)) {
			        szRet += "%" + wch.toString(16);
		        }
		        else if (!(wch & 0xF000)) {
			        uch = "%" + (wch>>6 | 0xC0).toString(16) +
				          "%" + (wch & 0x3F | 0x80).toString(16);
			        szRet += uch;
		        }
		        else {
			        uch = "%" + (wch >> 12 | 0xE0).toString(16) +
				          "%" + (((wch >> 6) & 0x3F) | 0x80).toString(16) +
				          "%" + (wch & 0x3F | 0x80).toString(16);
			        szRet += uch;
		        }
	        }
	        return(szRet);
            }
            
            // 문자열 공백 제거   2007.07.06 박동현
            function Space_All(str)
            {
              var index, len
                       
              while(true)
              {
               index = str.indexOf("%20")
               if (index == -1) break
               len = str.length
               str = str.replace("%20"," ")
              }
               
              return str;
            }
			//-->
			</script>    
</body>
</html>
