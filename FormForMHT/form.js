
var g_szAcceptLang  = "ko";
var m_xmlHTTP = CreateXmlHttpRequest();
var g_szEditable = false;//작성창 open 여부
window.onload= initOnload;

function initOnload()
{//debugger;
    var sFormEdit = "";	

    switch (getInfo("fmpf")) {
	    case "OFFICIAL_DOCUMENT":	
		case "OFFICIAL_DOCUMENT_01":			
		case "OFFICIAL_DOCUMENT_02":			
		case "OFFICIAL_DOCUMENT_03":			
		case "OFFICIAL_DOCUMENT_04":			
		case "OFFICIAL_DOCUMENT_05":		    
		    if (getInfo("mode") == "DRAFT")
		        sFormEdit = getInfo("fmpf") + "_V" + getInfo("fmrv") + ".htm";
		    else
		        sFormEdit = getInfo("fmpf") + "_V" + getInfo("fmrv") + "_read.htm";
		    break;
		default:
			switch(getInfo("mode")){ 			
				case "DRAFT":
				case "TEMPSAVE":
					g_szEditable=true;sFormEdit=getInfo("fmpf")+"_V"+getInfo("fmrv")+".htm"; break;
				case "APPROVAL":				
				case "RECAPPROVAL":	
				case "CHARGE":				
				case "REDRAFT":
					if(getInfo("scCHBis") == "1" && getInfo("loct") != "PROCESS"){
						if ( getInfo("scIPub") == "1" && (getInfo("mode") == "REDRAFT" || getInfo("mode") == "RECAPPROVAL")){
							sFormEdit=getInfo("fmpf")+"_V"+getInfo("fmrv")+"_read.htm"; 
						}else{
							 //2006.09.19 김현태 readonly로 열리고 편집버튼 활성화
							g_szEditable=false;sFormEdit=getInfo("fmpf")+"_V"+getInfo("fmrv")+"_read.htm"; 
						}
					}else if(getInfo("scRCHBis") == "1" &&  (getInfo("loct") == "REDRAFT" || getInfo("loct") == "APPROVAL" ) && (getInfo("mode") == "APPROVAL" || getInfo("mode") == "REDRAFT" ||getInfo("mode") == "RECAPPROVAL" )) { //주?�부?�만 변?
						//2006.09.19 김현태 readonly로 열리고 편집버튼 활성화
						g_szEditable=false;sFormEdit=getInfo("fmpf")+"_V"+getInfo("fmrv")+"_read.htm"; 
					}else{
						sFormEdit=getInfo("fmpf")+"_V"+getInfo("fmrv")+"_read.htm"; 
					}
				//파일 업로드 컴포넌트 감추기	
				
					break;
				default:sFormEdit=getInfo("fmpf")+"_V"+getInfo("fmrv")+"_read.htm"; break;
			}
			break;
	}

	//2011-02-08-hichang 
	if (getInfo("readtype") != "preview") {
	    // 미결업무 점검 양식은 Parameters 를 넘겨준다.
	    if (sFormEdit == "WF_FORM_DRAFT_PROCESS_026_V0.htm") {
	        editor.location.href = sFormEdit + "?Flag=" + strFlag + "&Month=" + strMonth + "&Jumpo=" + strJumpo;
	    }
	    else {
	        editor.location.href = "/Approval/Forms/" + sFormEdit;
	    }

	    try { if (menu.gPrintType == "1") reader.location.href = "PrintMade.htm"; } catch (e) { }
	}
	
	//회람현황 입력
	//완료함 및 수신/참조에서 열 경우 입력
	if(getInfo("loct") == "COMPLETE" && getInfo("mode") == "COMPLETE" && ( getInfo("gloct") == "TCINFO" || (getInfo("gloct") == "DEPART" && getInfo("pfsk")=="T006" ))){
	    settingTCINFO();
	}
}
window.onunload= initOnUnload;

function initOnUnload(){		
	switch(g_dicFormInfo.item("mode")){ //첨부파일 처리
		case "DRAFT":
		case "TEMPSAVE":
			deleteClientFiles(); break;
		default:break;
	}
}
function deleteClientFiles(){
	try{
		if ((menu.m_bFrmClientFileDitry == false) && (editor.document.getElementsByName("attach")[0].value !='')){//첨부파일 존재하는 경우cField["attach"]
			deleteFiles(editor.document.getElementsByName("attach")[0].value);
		}
	}catch(e){}
}
function deleteFiles(sattach){
	var attFiles, fileLoc, szAttFileInfo ;
	var displayFileName;		
	var re = /_N_/g;
	if (sattach != ""){
		szAttFileInfo = "";

		var r, res;
		var s =sattach;
		res = /^^^/i;
		attFiles = s.replace(res, "");
		var m_oFileList = CreateXmlDocument();
		m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?><fileinfos>"+attFiles+"</fileinfos>");
		var elmRoot, elmList, elm, elmTaskInfo;
		elmRoot = m_oFileList.documentElement;
		if (elmRoot != null){
			elmList = elmRoot.selectNodes("fileinfo/file");
			for (var i=0; i<elmList.length;i++) {
				elm = elmList.nextNode();
				displayFileName = elm.getAttribute("name").substring(0, elm.getAttribute("name").lastIndexOf(".")) ;
				displayFileName = displayFileName.replace(re,"&");	
				szAttFileInfo += elm.getAttribute("location") + ";filename=" +  displayFileName + "|";
			}
		}

		var sText = "../../common/FileAttach/filedelete.aspx?deleteFiles=" + toUTF8(fileHref(szAttFileInfo));		
		//alert("그냥 창닫??+sText);
		requestHTTP("GET",sText,false,"text/xml",null,null);
		receiveFileHTTP();
	}
}
function event_noop(){return(false);}
function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	m_xmlHTTP.open(sMethod,sUrl,bAsync);
	m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
	m_xmlHTTP.setRequestHeader("Content-type", sCType);
	if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
}
function receiveFileHTTP(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			//alert(m_xmlHTTP.responseText);
		}else{
			var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			if(errorNode!=null){
				alert("Desc: " + errorNode.text);
			}else{				
				//alert(m_xmlHTTP.responseXML.selectSingleNode("response/fileinfo").xml);
				//m_bFrmClientFileDitry = true;
				//m_oFormEditor.dField["ATTACH_FILE_INFO"].value = m_xmlHTTP.responseXML.selectSingleNode("response/fileinfo").xml;
			}
		}
	}
}
function getInfo(sKey){try{return g_dicFormInfo.item(sKey);}catch(e){alert(menu.gMessage254+sKey+menu.gMessage255);}}
function setInfo(sKey,sValue){
	try{	
		if(g_dicFormInfo.Exists(sKey))	g_dicFormInfo.Remove(sKey);
		g_dicFormInfo.Add(sKey,sValue);
	}catch(e){alert(menu.gMessage254+sKey+menu.gMessage255);} //"양식정보에 없는 키값["+sKey+"]입니다."
}
function fileHref(name)
{
	return name.replace("%","%25").replace("&","%26").replace("#","%23").replace("+","%2B")
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
//<유미
function settingTCINFO(){
   
	var strflag = false;
	var sItems="<request>";
	var sUrl;
	sUrl = "../Circulation/Circulation_Read_Update.aspx";
   
     sItems += makeNode("fiid",getInfo("fiid"))
                + makeNode("sendid","")
                + makeNode("type",getInfo("gloct"))
                + makeNode("receipt_id",getInfo("usid"))
                + makeNode("receipt_name",getInfo("usdn"))
                + makeNode("receipt_ou_id",getInfo("dpid"))
                + makeNode("receipt_ou_name",getInfo("dpdn"))
                + makeNode("receipt_state","")
               +  makeNode("receipt_date","")
               +  makeNode("read_date","")
               +  makeNode("piid",getInfo("piid"))
               +  makeNode("sender_id",getInfo("INITIATOR_ID"))
              +   makeNode("sender_name",getInfo("INITIATOR_NAME"))
               +  makeNode("sender_ou_id",getInfo("INITIATOR_OU_ID"))
               +  makeNode("sender_ou_name",getInfo("INITIATOR_OU_NAME"), null, true)
              +   makeNode("fmnm",getInfo("fmnm"), null, true)
              +   makeNode("subject",getInfo("SUBJECT"))
              +   makeNode("link_url",getInfo("pidc"), null, true)
              +   makeNode("send_date",getInfo("INITIATED_DATE"))
                ;
	sItems+="</request>";
	//alert(sUrl);
	requestHTTP("POST",sUrl,true,"text/xml; charset=utf-8",null,sItems);		
}
//var m_cvtXML = new ActiveXObject("MSXML2.DOMDocument").createTextNode("");
var m_cvtXML = CreateXmlDocument().createTextNode("");
function makeNode(sName,vVal,sKey,bCData) {
	if(vVal==null){	m_cvtXML.text = opener.getInfo((sKey!=null?sKey:sName));}else{	m_cvtXML.text = vVal;	}	
	return "<"+sName+">"+(bCData?"<![CDATA[":"")+(bCData?m_cvtXML.text+"]]>":m_cvtXML.xml)+"</"+sName+">";
}
//유미>

/////////////////////////////////////////////////////////////////////////////////////
//타양식으로 내용복사 없는 필드는 임시메모장으로.....강성채  2008.05//
/////////////////////////////////////////////////////////////////////////////////////
var timerID ;
function DiffFormTempMemo(){
	try{
		var szopenerparenturl = "";
		var oDivTempSave = null;
		if(opener != null){
			szopenerparenturl = opener.parent.location.href.toUpperCase();
			if (szopenerparenturl.indexOf("/APPROVAL/DEFAULT.ASPX") > -1 ){//문서작성 창에서 OPEN
				oDivTempSave =  opener.parent.frames[0];
			}else if(szopenerparenturl.indexOf("/APPROVAL/MENU_APPROVAL.ASPX") > -1 ){//즐겨쓰는 양식
				oDivTempSave =  opener.parent;
			}else if(szopenerparenturl.indexOf("/APPROVAL/LIST.ASPX") > -1 ){//임시보관함
				oDivTempSave =  opener.parent.parent.frames[0];
			}
		}else if(top.opener!=null){
			szopenerparenturl = top.opener.parent.location.href.toUpperCase();
			if (szopenerparenturl.indexOf("/APPROVAL/DEFAULT.ASPX") > -1 ){//문서작성 창에서 OPEN
				oDivTempSave =  top.opener.parent.frames[0];
			}else if(szopenerparenturl.indexOf("/APPROVAL/MENU_APPROVAL.ASPX") > -1 ){//즐겨쓰는 양식
				oDivTempSave =  top.opener.parent;
			}else if(szopenerparenturl.indexOf("/APPROVAL/LIST.ASPX") > -1 ){//임시보관함
				oDivTempSave =  top.opener.parent.parent.frames[0];
			}
		}

		if ( oDivTempSave != null){
			if (oDivTempSave.document.getElementById("dTempDiffSave").value != ""){
				var tTempStrXml = oDivTempSave.document.getElementById("tTempDiffSave").value;
				var mTempStrXml = oDivTempSave.document.getElementById("mTempDiffSave").value;
				var dTempStrXml = oDivTempSave.document.getElementById("dTempDiffSave").value;
				var cTempStrXml = oDivTempSave.document.getElementById("cTempDiffSave").value;
				oDivTempSave.document.getElementById("tTempDiffSave").value = "";
				oDivTempSave.document.getElementById("mTempDiffSave").value = "";
				oDivTempSave.document.getElementById("dTempDiffSave").value = "";
				oDivTempSave.document.getElementById("cTempDiffSave").value = "";
				menu.tempMemo();

				var m_objXML=CreateXmlDocument();
				var elmList, elm;
				var elmListLan;
				m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?>"+dTempStrXml);
				try{
					elmList = m_objXML.documentElement.childNodes;
					for(var i=0; i < elmList.length; i++){
						var elm = elmList.item(i);
						innerHtmlData(elm.nodeName, elm.text);
					}
				}	catch(e){ }
				
				m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?>"+cTempStrXml);
				try{
					elmList = m_objXML.documentElement.childNodes;
					for(var i=0; i < elmList.length; i++){
						var elm = elmList.item(i);
						innerHtmlData(elm.nodeName, elm.text);
					}
				}	catch(e){ }
				//debugger;
				m_objXML.loadXML("<?xml version='1.0' encoding='utf-8'?>"+mTempStrXml);
				try{
					elmList = m_objXML.documentElement.childNodes;
					for(var i=0; i < elmList.length; i++){
						var elm = elmList.item(i);
						innerHtmlData(elm.nodeName, elm.text);
					}
				}catch(e){ }

				try{
					if ( editor.tbContentElement != null){
						var dom = editor.tbContentElement.getDom();
						dom.body.innerHTML= tTempStrXml;				
						//editor.tbContentElement.HtmlValue = tTempStrXml;
					}
				}	catch(e){
					document.frames.getElementById("menu").contentDocument.getElementById("sTempMemo").value += tTempStrXml;
				}  
			}
		}
		clearInterval(timerID);
	}catch(e){}    
}

function innerHtmlData(nodeNm, nodeVal){
    try{
    	if (editor.document.getElementById(nodeNm) != undefined) {
		    editor.document.getElementById(nodeNm).value = nodeVal;
	    }
			 else if(nodeVal != ""){
						 menu.document.getElementById("sTempMemo").value += nodeVal+"\n\r";//nodeNm+" : "+
			}  
    }
    catch(e){}
}