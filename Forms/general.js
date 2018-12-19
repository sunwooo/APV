var g_isSubmit;

function submitwork()
{
	var rtnVal;
	rtnVal = procImage();
	if (dField["dhtml_body"] != null)	{
		dField["dhtml_body"].innerText = document.tbContentElement.DocumentHTML;
		dField["del"].value = rtnVal
	}	else {
		alert("본문 내용이 없습니다.");
		return false;
	}
	g_isSubmit = true;
}

//submit전에 이미지 경로를 바꿔줌.
function procImage() {
	var i,objImages;
	var strDelList, imgSrc;

	try {
		//표안깨지게 처리.
		var szDBodyHTML;
		szDBodyHTML = tbContentElement.DOM.body.innerHTML;
		while (szDBodyHTML.indexOf("></TD>") > -1){
			szDBodyHTML = szDBodyHTML.replace("></TD>", ">&nbsp;</TD>");
		}
		while (szDBodyHTML.indexOf("</P>&nbsp;</TD>") > -1){
			szDBodyHTML = szDBodyHTML.replace("</P>&nbsp;</TD>", "</P></TD>");
		}
		tbContentElement.DOM.body.innerHTML = szDBodyHTML;

		objImages = tbContentElement.DOM.images;

		for(i = 0 ; i < objImages.length; i++) {
			imgSrc = objImages[i].src;
			if (imgSrc.indexOf("file://") > -1)  {	//new
				imgSrc = imgSrc.replace("file://", "");
			}
			else	{
				imgSrc = imgSrc.replace("http://" + window.document.location.host , "");
			}


			if (dicFileInfo.Exists(imgSrc) == true) {
				objImages[i].src = dicFileInfo.Item(imgSrc);
				dicFileInfo.Remove(imgSrc);	//현재 본문에 있는 이미지이면 dicFileInfo에서 삭제함
			}
		}

		var aryTemp = new Array() ;
		var aryKey = new Array() ;

		aryKey = (new VBArray(dicFileInfo.Keys())).toArray();
		aryTemp = (new VBArray(dicFileInfo.Items())).toArray();

		strDelList = "";
		for(i=aryKey.length-1;i>-1;i--){
			strDelList += aryTemp[i] + "|";	//image upload후 본문에서 삭제한 이미지들을 storage에서 삭제하기 위한 리스트
		}

		return strDelList;

	} catch(e)
	{
		alert("procImage() error: "+e.description + "\r\nError number: " + e.number);
		return false;
	}

}

var m_xmlHTTP;

//unload시 Undo
function window.onunload() {
	try {
		var aryTemp = new Array() ;
		var aryKey = new Array() ;
		var szFilePath = dField["file_loc"].value;
		
		//dicFileInfo : delete 해야 하는 file Dictionary
		//dhtml body가 있으면..
		if (document.all["tbContentElement"] != null)	{
			objImages = tbContentElement.DOM.images;
			
			if (g_isSubmit) {		//정상종료시 이미지 처리
				for(i = 0 ; i < objImages.length; i++) {
					imgSrc = objImages[i].src;			
					if (imgSrc.indexOf("file://") > -1)  {	//새로 추가한 이미지..
						imgSrc = imgSrc.replace("file://", "");	
					}
					else	{
						imgSrc = imgSrc.replace("http://" + window.document.location.host , "");		//이미지 파일명만 추출
					} 
					if (dicFileInfo.Exists(imgSrc) == true) {
						dicFileInfo.Remove(imgSrc);			//현재 본문에 있는 이미지이면 dicFileInfo에서 삭제함
					}
				}
			} else {		//g_isSubmit 가 false이면
				aryKey = (new VBArray(dicFileInfo.Keys())).toArray();
				aryTemp = (new VBArray(dicFileInfo.Items())).toArray();			
				for (i = 0; i < aryKey.length; i++ ){
					if (aryKey[i].indexOf(szFilePath) > -1) 	//기존에 존재하던 파일이면
						dicFileInfo.remove(aryKey[i]);
				}
			}
		}


		strDelList = "";				//삭제 파일 리스트	

		if (dField["att_files"] != null && dField["file_loc"] != null)	{			//file첨부기능이 있는 경우		
			if (g_isSubmit != true) {																					//submit이 정상 실행되지 않은 경우 upload된 파일 들 삭제(일괄삭제)
				if (dField["att_files"].value.length > 0){
					objAtt = (dField["att_files"].value).split(":");										// 현재까지 업로드된 파일들

					for (i = 0; i < objAtt.length; i++) {
						var szTemp = objAtt[i].split("|")[0];
						if (originAttFiles.indexOf(szTemp) < 0){	
							strDelList += szTemp + "|";
						}
					}
				}
				aryKey = (new VBArray(dicFileInfo.Keys())).toArray();
				aryTemp = (new VBArray(dicFileInfo.Items())).toArray();

				for (i = 0; i < aryKey.length; i++ ){
					if (originAttFiles.indexOf(aryKey[i]) > -1) { //삭제루틴 undo
						dicFileInfo.Remove(aryKey[i]);		
					}
				}	
			}	//{비정상종료시끝}
			else {	//정상종료시
				var szAttFiles = dField["att_files"].value;										// 현재까지 업로드된 파일들
				aryKey = (new VBArray(dicFileInfo.Keys())).toArray();
				aryTemp = (new VBArray(dicFileInfo.Items())).toArray();

				for (i = 0; i < aryKey.length; i++ ){
					if (dicFileInfo.Exists(aryKey[i]) == true && szAttFiles.indexOf(aryKey[i]) > -1) {		//삭제후 동일이름으로 upload한 파일인 경우, 삭제 리스트에서 제거
						dicFileInfo.Remove(aryKey[i]);		
					}
				}	
			}
		}	


		aryKey = (new VBArray(dicFileInfo.Keys())).toArray();
		aryTemp = (new VBArray(dicFileInfo.Items())).toArray();

		for(i=aryKey.length-1;i>-1;i--){
			strDelList += aryTemp[i].replace(szFilePath, "") + "|";	//upload후 삭제 해야 하는 파일을 위한 list 구성
		}


		if (strDelList != ""){
			m_xmlHTTP = new ActiveXObject("Microsoft.xmlhttp");

			var szURL = "../FileAttach/UndofileDelete.asp?path="+szFilePath+"&target="+ strDelList;
			m_xmlHTTP.open("GET",szURL,false); 
			m_xmlHTTP.setRequestHeader( "Content-type:", "text/xml");  

			m_xmlHTTP.onreadystatechange = event_retrieve_completed;
			m_xmlHTTP.send();
			if (m_xmlHTTP.status > 200){
				alert("Fail Undo~");
			}
		} //strDelList비교끝

	} catch(e){
		return false;
	}
}


function event_retrieve_completed(){
	var bRtn;
	bRtn = false;
	if(m_xmlHTTP.readyState == 4)
	{
		m_xmlHTTP.onreadystatechange = event_noop;//re-entrant gate

		if(m_xmlHTTP.responseText.charAt(0)=='\r')
		{
			alert("error in event_listen_getGalData(): no responseText returned");
		}
		else
		{

			var oXMLDOM = new ActiveXObject("Microsoft.XMLDOM");

			if (oXMLDOM.loadXML(m_xmlHTTP.responseText)==true)
			{
				var oAllNodes;
				try{
					oAllNodes = oXMLDOM.selectSingleNode("response").childNodes;

					var oNode;
					for(var x=0;x<oAllNodes.length;x++){
						oNode = oAllNodes[x];
						if ("return" == oNode.nodeName && "ok" == oNode.text) {
							return true;

						}
					}
				}catch(e){
					alert("error in event_retrieve_completed(): "+ oXMLDOM.selectSingleNode("response/error").text);
				}

			}
			else
			{
				alert("error in event_retrieve_completed(): "+oXMLDOM.parseError.reason);
			}
		}

		if (bRtn == false) {
			return false;
		}
	}
}

function event_noop()
{
	return(false);
}

function toUTF8(szInput)
{

	var wch,x,uch="",szRet="";

	for (x=0; x<szInput.length; x++)
	{
		wch=szInput.charCodeAt(x);
		if (!(wch & 0xFF80))
		{
			szRet += "%" + wch.toString(16);
		}
		else if (!(wch & 0xF000))
		{
			uch = "%" + (wch>>6 | 0xC0).toString(16) +
				  "%" + (wch & 0x3F | 0x80).toString(16);
			szRet += uch;
		}
		else
		{
			uch = "%" + (wch >> 12 | 0xE0).toString(16) +
				  "%" + (((wch >> 6) & 0x3F) | 0x80).toString(16) +
				  "%" + (wch & 0x3F | 0x80).toString(16);
			szRet += uch;
		}
	}
	return(szRet);
}
//각span에 첨부파일정보를 display
//comment : 에러나면 aromie에게 문의바람.
function G_displaySpnAttInfo(bComment) {	// bComment : 파일설명을 display할것인가..
	var attFiles, fileLoc, bodyFile, szAttFileInfo ;	//Att_Files, File_Loc, BODY_FILE, {파일 attch정보를 보여주기 위한 span의 ID}
	var displayFileName;		
	var re = /_N_/g;

	if (dField["att_files"].value != ""){
		attFiles = dField["att_files"].value.split(":");
		fileLoc = dField["file_loc"].value;  

		bodyFiles = document.all['body_file'].value;
		bodyFiles = (bodyFiles.split("."))[0];

		szAttFileInfo = "";
		for (var i = 0; i < attFiles.length; i++) {
			displayFileName = attFiles[i].split("|")[0].replace(bodyFiles + "_" , "");
			displayFileName = displayFileName.replace(bodyFiles +".Files/","");	//migration data용
			displayFileName = displayFileName.replace(re,"&");	
			szAttFileInfo += "<a href=\"../fileattach/download.asp?file=" + fileLoc + escape(attFiles[i].split("|")[0]) + "&filename=" +  displayFileName + "\" target = \"_blank\">" + displayFileName + "</a>";

			if (bComment){	 				////첨부화일설명 display
				if (attFiles[i].split("|").length >= 3) {
					szAttFileInfo += "(" + attFiles[i].split("|")[3] + ")";
				}
			}
			if (i < attFiles.length - 1)
				szAttFileInfo += ", ";
		} 
		document.all['AttFileInfo'].innerHTML = szAttFileInfo;
	}
}
