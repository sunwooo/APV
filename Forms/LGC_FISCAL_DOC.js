function FiscalDocInfoView(){
	var m_objXML1 = new ActiveXObject("MSXML2.DOMDocument");
	m_objXML.loadXML(FISCAL_DOC_INFO.value);					   
	m_objXML1.loadXML(FISCAL_DOC_INFO_RESULT.value);					   
	var ZSFIRET0001Table; //전표 조회 조건
	var ZSFISEND0001Table; //전표 조회 결과 master
	var ZSFISEND0002Table; //전표 조회 결과 item
	var ZSFISEND0003Table; //전표 적용 결과 item
	ZSFIRET0001Table = m_objXML.documentElement.selectNodes("ZSFIRET0001Table");
	var elmQCond;

	var m_oHTMLProcessor;
	m_oHTMLProcessor = makeProcessor("LGC_FISCAL_DOC_Master.xsl");

	for(var i= 0 ; i < ZSFIRET0001Table.length ; i++){
		elmQCond = ZSFIRET0001Table.nextNode();
		var Belnr = elmQCond.selectSingleNode("Belnr").text;
		var Msg_Type = elmQCond.selectSingleNode("Msg_Type").text;
		switch (Msg_Type){
			case "0":	//전표정보 반환
				ZSFISEND0001Table = m_objXML.documentElement.selectSingleNode("ZSFISEND0001Table[./Belnr='"+Belnr+"']");
				if	(	ZSFISEND0001Table	!=null	 ){
					/*
					var m_objXMLLocal = new ActiveXObject("MSXML2.DOMDocument");
					m_objXMLLocal.loadXML(ZSFISEND0001Table.xml.replace(/xmlns="LegacySAP"/gi,""));	
					m_oHTMLProcessor.input = m_objXMLLocal; 
					m_oHTMLProcessor.transform();
					eval("M"+i).innerHTML = m_oHTMLProcessor.output;
					*/
					var ZSFISEND0002TableNodes = m_objXML.documentElement.selectNodes("ZSFISEND0002Table[./Belnr='"+Belnr+"']");
					var ToTSwrbtr =0.00;
					for(var j=0 ; j < ZSFISEND0002TableNodes.length ; j++){
						ToTSwrbtr = StringToNumberSUM(ToTSwrbtr,ZSFISEND0002TableNodes.item(j).selectSingleNode("Hwrbtr").text); //Hwrbtr(대변)Swrbtr(차변)
					}
					var szHTML = "";
					szHTML ='<TABLE  cellpadding="0" cellspacing="0" width="100%" height="100%" border="0" bordercolor="#000000" style="border-collapse: collapse;MARGIN-TOP: 0px;table-layout:fixed">';
					szHTML+='	<TR 	style="font-weight :bold" >';
					szHTML+='		<TD align="center" height="100%">'+ZSFISEND0001Table.selectSingleNode("Blart").text+'</TD>';//전표유형Ltext
					szHTML+='		<TD align="center" >'+ZSFISEND0001Table.selectSingleNode("Bldat").text+'</TD>';				//증빙일
					szHTML+='		<TD align="center" >'+ZSFISEND0002TableNodes.item(0).selectSingleNode("Txt20").text+'</TD>';//차변계정
					szHTML+='		<TD align="center" >'+ZSFISEND0002TableNodes.item(1).selectSingleNode("Txt20").text+'</TD>';//대변계정
					szHTML+='		<TD align="left" >'+ZSFISEND0002TableNodes.item(1).selectSingleNode("Name1").text+'</TD>';//거래처
					szHTML+='		<TD align="right" >'+String(ToTSwrbtr)+'</TD>';//금액합계
					szHTML+='	</TR>';
					szHTML+='</TABLE>';
					eval("M"+i).innerHTML = szHTML;
					eval("D"+i).innerHTML = "<a href='#' onClick='OnOff("+i+");'>상세내역</a><br/><div id='DD"+i+"' style='width:100%;height:100%;display:none;'></div>";
					DetailView(Belnr, i)
					/*
					if (eval("FDOCREMARK"+i).value == "")
					{
						eval("FDOCREMARK"+i).value = ZSFISEND0002TableNodes.item(0).selectSingleNode("Sgtxt").text
					}
					*/
					if (m_objXML1.documentElement != null){
						ZSFISEND0003Table = m_objXML1.documentElement.selectSingleNode("ZSFISEND0003Table[./Belnr='"+Belnr+"']");
						if (ZSFISEND0003Table != null && eval("spanFDOCSAPVRESULT"+i) != null){
							switch (ZSFISEND0003Table.selectSingleNode("Msg_Type").text){
								case "0" : 	eval("spanFDOCSAPVRESULT"+i).innerHTML = "<font color='blue'>갱신완료</font>";break;
								case "1" : 	eval("spanFDOCSAPVRESULT"+i).innerHTML = "<font color='red'>기존승인값존재</font>";break;
							}
						}
					}
				}
				break;
			case "1":	//전표정보 없음
				eval("M"+i).innerHTML = "전표정보 없음";
				eval("D"+i).innerHTML = "&nbsp;";
				break;
			case "2":	//삭제/반제 전표
				eval("M"+i).innerHTML = "삭제/반제 전표";
				eval("D"+i).innerHTML = "&nbsp;";
				break;
			case "3":	//결재대상 전표 아님
				eval("M"+i).innerHTML = "결재대상 전표 아님";
				eval("D"+i).innerHTML = "&nbsp;";
				break;
		}

	}
}
function DetailView(sBelnr, idx){
	if ( eval("DD"+idx).innerHTML == ""){
		var m_oHTMLProcessor;
		m_oHTMLProcessor = makeProcessor("LGC_FISCAL_DOC_Detail.xsl");
		var ZSFISEND0002Table = m_objXML.documentElement.selectNodes("ZSFISEND0002Table[./Belnr='"+sBelnr+"']");
		var sText = "";
		for(var i = 0 ; i < ZSFISEND0002Table.length; i++){
			sText += ZSFISEND0002Table.item(i).xml;
		}
		var m_objXMLLocal = new ActiveXObject("MSXML2.DOMDocument");
		m_objXMLLocal.loadXML("<ROOT>" + sText.replace(/xmlns="LegacySAP"/gi,"")+"</ROOT>");	
		m_oHTMLProcessor.input = m_objXMLLocal; 
		m_oHTMLProcessor.transform();
		eval("DD"+idx).innerHTML = m_oHTMLProcessor.output;
	}
}
/*연동 부분 처리*/
var m_objXML = new ActiveXObject("MSXML2.DOMDocument");
var m_xmlHTTP = new ActiveXObject("Msxml2.XMLHTTP");
var m_evalXML = new ActiveXObject("Msxml2.DOMDocument");
var m_xslProcessor = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
var m_cvtXML = new ActiveXObject("MSXML2.DOMDocument").createTextNode("");
function QueryList(){
	var ent_code ="";		//회사코드
	var fiscal_year = ""; //회계년도
	var doclist = ""; //전표번호
	ent_code =ENT_CODE.value;		//회사코드
	fiscal_year = FYEAR.value;
	if ( FDOCNO.length  != null ){ //다중전표
		for(var i=0;i<FDOCNO.length;i++){
			if(doclist.length > 0 ){
				doclist += ";" + FDOCNO[i].value;
			}else{
				doclist = FDOCNO[i].value;
			}
		}
	}else{ //단일전표
		doclist = FDOCNO.value;
	}
	if (ent_code == ""){
		alert("회사코드가 존재하지 않습니다");
		return;
	}
	if (fiscal_year == ""){
		alert("회계년도를 입력하십시요.");
		FYEAR.focus();
		return;
	}
	if (doclist == ""){
		alert("입력된 전표번호가 없습니다.");
		return;
	}
	var szURL = "../SAP/QueryList.aspx?ENT_CODE="+ent_code+"&FISCAL_YEAR="+fiscal_year+"&DOCNO="+doclist;
	var sText = "";
	requestHTTP("POST",szURL,false,"text/xml",receiveGETHTTPEx, sText);
	
}
function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	m_xmlHTTP.open(sMethod,sUrl,bAsync);
	m_xmlHTTP.setRequestHeader("Accept-Language","ko");
	m_xmlHTTP.setRequestHeader("Content-type", sCType);
	if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
}
function receiveGETHTTPEx(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=="\r"){
			alert(m_xmlHTTP.responseText);
		}else{
			var errorNode = m_xmlHTTP.responseXML.selectSingleNode("//response/error");
			if(errorNode != null){
				alert("Desc: " + errorNode.text);
				return false;
			}else{
				try{
					FISCAL_DOC_INFO.value = m_xmlHTTP.responseXML.selectSingleNode("//response/NewDataSet").xml;
					FiscalDocInfoView();
				}catch(e){alert("Error : " + e.description + "\r\nError number: " + e.number);}
			}
		}
	}
}

