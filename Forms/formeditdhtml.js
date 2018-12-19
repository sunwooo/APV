var nowDate = new Date();
var nowYear = nowDate.getFullYear().toString();
var nowMonth = lengthCheck((nowDate.getMonth()+1).toString());
var nowDay = lengthCheck(nowDate.getDate().toString());
var nowHour = lengthCheck(nowDate.getHours().toString());
var nowMin = lengthCheck(nowDate.getMinutes().toString());
var nowSec = lengthCheck(nowDate.getSeconds().toString());
var prefix, file_loc;

var aryFileName = "";		
var aryFileFullPath = "";	
var flag;		

//function prefixMaker(){		// Dhtml Editor 사용
	prefix = nowYear + nowMonth + nowDay + nowHour + nowMin + nowSec;
	file_loc = "/FrontStorage/Approval/ImageAttach/";
//}	

function lengthCheck(num){
	if (num.length >= 2){
		return num;
	}else{
		num = "0" + num;
		return num;
	}
}	

function insertDictionaryFileInfo(fName, fFullpath, foldername)
{			
	try{
		aryFileName += fName + "@@@@";
		aryFileFullPath += fFullpath + "@@@";											
		hField["IMG_ATTACH_FOLDERNAME"].value = foldername;						
		hField["IMG_ATTACH_FILENAME"].value = aryFileName;
		hField["IMG_ATTACH_FULLPATH"].value = aryFileFullPath;				
	}catch(e){
		alert("오류가 발생했습니다. 오류 내용은 다음과 같습니다. \r\nError File : insertDictionaryFileInfo(fName, fFullpath, foldername) in Forms/"+getInfo("fmpf")+"_V"+getInfo("fmrv")+".htm\r\nError Number: " + e.number + "\r\nError Description: " + e.description);
	}							
}	

function procImage(){
	try {
		
		//표안깨지게 처리.
		var strDelList, imgSrc, szDBodyHTML;		
		szDBodyHTML = tbContentElement.DOM.body.innerHTML;
		
		var aryKey = new Array();
		var aryTemp = new Array();
		var arycount;
						
		aryKey = (new VBArray(dicFileInfo2.Keys())).toArray();
		aryTemp = (new VBArray(dicFileInfo2.Items())).toArray();
		
		arycount = aryTemp.length;
							
		while (szDBodyHTML.indexOf("></TD>") > -1){
			szDBodyHTML = szDBodyHTML.replace("></TD>", ">&nbsp;</TD>");
		}
		while (szDBodyHTML.indexOf("</P>&nbsp;</TD>") > -1){
			szDBodyHTML = szDBodyHTML.replace("</P>&nbsp;</TD>", "</P></TD>");
		}
		
		tbContentElement.DOM.body.innerHTML = szDBodyHTML;
		var objImages = tbContentElement.DOM.images;
		var i, j;
			
		for(i = 0 ; i < objImages.length; i++){
			imgSrc = objImages[i].src;
	
			if (imgSrc.indexOf("file://") > -1){	//new
				imgSrc = imgSrc.replace("file://", "");
										
			}else{
				
				imgSrc = imgSrc.replace("http://" + window.document.location.host , "");							
			}
			
			for(j = 0 ; j < arycount; j++){						
				if(dicFileInfo2.Item(j) == imgSrc){
					objImages[i].src = "http://" + window.document.location.host + dicFileInfo2.Item(j);														
					dicFileInfo2.Remove(j);	//현재 본문에 있는 이미지이면 dicFileInfo에서 삭제함
				}
				else if(dicFileInfo.Exists(imgSrc) == true){
					objImages[i].src = "http://" + window.document.location.host + dicFileInfo.Item(imgSrc);
					dicFileInfo.Remove(imgSrc);		//현재 본문에 있는 이미지이면 dicFileInfo에서 삭제함							
				}	
			}		
							
			imgSrc = objImages[i].src;
		}									
			
		var aryTemp2 = new Array() ;
		var aryKey2 = new Array() ;
					
		aryKey2 = (new VBArray(dicFileInfo2.Keys())).toArray();
		aryTemp2 = (new VBArray(dicFileInfo2.Items())).toArray();			
					
		strDelList = "";		
		
		for(i=aryKey2.length-1;i>-1;i--){					
			strDelList += aryTemp2[i] + "|";	//image upload후 본문에서 삭제한 이미지들을 storage에서 삭제하기 위한 리스트
		}							
		return strDelList;
				
	}catch(e){
			alert("오류가 발생했습니다. 오류 내용은 다음과 같습니다. \r\nError File : procImage() in Forms/"+getInfo("fmpf")+"_V"+getInfo("fmrv")+".htm\r\nError Number: " + e.number + "\r\nError Description: " + e.description);
	}	
}

function window.onunload(){
	try{		
		flag=0;		
		if ( hField["IMG_ATTACH_FILENAME"].value == "") {
		}else{															
			var szURL = "dhtml/DhtmltempFileClear.aspx?filename=" + escape(hField["IMG_ATTACH_FILENAME"].value);
			m_xmlHTTP.open("POST",szURL,true); 

			if(g_szAcceptLang != "" )
			{
			m_xmlHTTP.setRequestHeader("Accept-Language:",g_szAcceptLang);
			}
			m_xmlHTTP.setRequestHeader( "Content-type:", "text/xml");
			m_xmlHTTP.onreadystatechange = fnSaveCompleted;

			m_xmlHTTP.send("");
		}
		
	}catch(e){
		alert("오류가 발생했습니다. 오류 내용은 다음과 같습니다. \r\nError File : window.onunload() in Forms/DRAFT_V0.htm\r\nError Number: " + e.number + "\r\nError Description: " + e.description);
	}	
}					

function fnSaveCompleted(){
	try{
		if(m_xmlHTTP.readyState == 4 && flag==0){
			flag=1;					
			window.close();
		}
	}catch(e){
		alert("오류가 발생했습니다. 오류 내용은 다음과 같습니다. \r\nError File : fnSaveCompleted() in Forms/DRAFT_V0.htm\r\nError Number: " + e.number + "\r\nError Description: " + e.description);
	}
}
//dhtml 이미지 처리
function setDHTMLImg(){
	hField["IMG_DELETE_LIST"].value = procImage();	
	var sImageFiles = IMG_ATTACH_FILENAME.value;
	if (sImageFiles != ""){
		//setDocumentHTML();											  
		var sURL = "dhtml/fnMoveFilegetFileInfo.aspx?imgfilename=" + escape(IMG_ATTACH_FILENAME.value) + "&imgfilepath=" + escape(IMG_ATTACH_FULLPATH.value) + "&foldername=" + IMG_ATTACH_FOLDERNAME.value;							
		requestHTTP("GET",sURL,false,"text/xml",null,null);
		receiveGeneralQuery();
	}
}
