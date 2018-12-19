var m_sAddList;

function addList(sMode){
	var rgParams=null;
	rgParams=new Array();
	rgParams["bMail"]  = false;
	rgParams["bUser"] = (sMode=='charge'? true:false);
	rgParams["bGroup"] = (sMode=='charge'?false:true);
	rgParams["bRef"] = false;
	rgParams["bIns"] = false; 
	rgParams["bRecp"] = false; 
	rgParams["sCatSignType"] = "수신결재"; 
	rgParams["sDeptSignType"] = "일반결재";
	rgParams["sDeptSignStatus"] = "수신"; 
	rgParams["sUserSignType"] = "일반결재";
	rgParams["sUserSignStatus"] = "대기"; 
	rgParams["objMessage"] = window;

	var szFont = "FONT-FAMILY: '굴림';font-size:9px;";
	var nWidth = 640;
	var nHeight = 480;
	var vRetval = window.showModelessDialog("../address/address.htm", rgParams, szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;help:no;");
}
function insertToList(oList){
	var m_oChargeList = new ActiveXObject("MSXML2.DOMDocument");
	m_oChargeList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+oList.xml);
	var elmRoot = m_oChargeList.documentElement;
	var elmlist = elmRoot.selectNodes("item");
	if (elmlist.length == 0 ){
		alert('인수자를 지정하십시요!');
		return false;
	}else if(elmlist.length > 1){
		alert('1명의 인수자만 지정하십시요!');
		return false;
	}else{
		form1.PERSON_CHARGE_CODE.value  = elmRoot.selectSingleNode("item/AN").text;
		form1.PERSON_CHARGE_NAME.value = elmRoot.selectSingleNode("item/DN").text;;
		form1.RECEIVED_BY_UNIT_CODE.value  = elmRoot.selectSingleNode("item/RG").text;
		form1.RECEIVED_BY_UNIT_NAME.value = elmRoot.selectSingleNode("item/RGNM").text;;
	}
}
