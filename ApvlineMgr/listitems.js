var m_objXML = new ActiveXObject("MSXML2.DOMDocument");
var g_idsNoSearchInfo_Text      = "At least one field should be filled out.";
var L_idsSearcing_Text          = "Searching...\n\rYou can get quicker response with more than two conditions.";
var L_idsUnknownError_Text      = "Unknown Error";
var L_idsTrySimplifySearch_Text = "Please simplify the query.";
var g_eGalTable;
var g_eErrorDiv;
var g_eCurrentRow;
var g_rgElemRecipients = new Array();
var g_elemTo;
var g_elemCc;
var g_elemBcc;
var g_selectedEmail="";
var g_objXmlSelectedRecipient=null;
var m_oHTMLProcessor;
function window.onload(){
	g_eGalTable    = window.document.all['tblGalInfo'];
	g_eErrorDiv    = window.document.all['divErrorMessage'];

	var oStyles = window.document.styleSheets[0];
	var szFont = "font-family:'" + window.document.body.currentStyle.fontFamily + "'";
	oStyles.addRule( "SELECT", szFont );
	oStyles.addRule( "INPUT", szFont );
	oStyles.addRule( "BUTTON", szFont );

	//g_eGalTable.attachEvent("ondblclick",event_GalTable_ondblclick);
	g_eGalTable.attachEvent("onmousedown",event_GalTable_onmousedown);
	window.document.attachEvent("onmousemove",event_GalTable_onmousemove);
	clearContents();
	
	//if (parent.parent.SelectedItems.g_objMessage.m_sAddList == 'charge'){//담당자 지정시 해당 부서원만 출력
	//		parent.parent.Tab.ifrGroup.getMembers(parent.parent.SelectedItems.g_objMessage.getInfo("dpid_apv"));
	//}
	m_oHTMLProcessor = parent.makeProcessor("search.xsl");

}
function sortColumn(strKey){
	var oOrderNode = g_oSSXML.selectSingleNode("response/addresslist/xsl:for-each/@order-by");
	if(oOrderNode.text == "+ " + strKey)
		oOrderNode.text = "- " + strKey;
	else
		oOrderNode.text = "+ " + strKey;

	clearContents();
	processXmlData(m_objXML);
}
function processXmlData(objXML){
	if(objXML.selectNodes("response/addresslist/item").length==0) return false;

	objXML.documentElement.transformNodeToObject(g_oSSXML.documentElement,m_objXML);
	
	var rgData = new Array();
	var nodesAllItems = m_objXML.selectNodes("response/addresslist/item");
	
	if (nodesAllItems.length > 0){
		g_eGalTable.rows(0).style.display="";
		for(var x=0; x<nodesAllItems.length; x++){
		    var el = nodesAllItems.nextNode();
			rgData[0] =getLngLabel(el.selectSingleNode("DN").text.replace(/\x08/g,"&"),false);
			rgData[1] =getLngLabel(el.selectSingleNode("PO").text.replace(/\x08/g,"&"),false);			
			rgData[2] =getLngLabel(el.selectSingleNode("TL").text.replace(/\x08/g,"&"),false);
			if(gOUNameType == "1"){
			    rgData[3] = (el.selectSingleNode("ETNM").text!=""?el.selectSingleNode("ETNM").text.replace(/\x08/g,"&") +'-':"")+getLngLabel(el.selectSingleNode("RGNM").text.replace(/\x08/g,"&"),false);
			}else{
			    rgData[3] = getLngLabel(el.selectSingleNode("RGNM").text.replace(/\x08/g,"&"),false);
			}
			addAddress(rgData,el.selectSingleNode("AN").text.replace(/\x08/g,"&"),el.selectSingleNode("JD").text.replace(/\x08/g,"&"),el.selectSingleNode("FLDP").text.replace(/\x08/g,"&"));
		}
	}else{
		var nodesAllErrors = m_objXML.selectSingleNode("response/addresslist/error");
		
		if(nodesAllErrors != null){                       
			if (nodesAllErrors.text != "none")
				addMessage(nodesAllErrors.text);
		}else{
			addMessage(L_idsUnknownError_Text + "\r\n"+ L_idsTrySimplifySearch_Text);
		}
	}
	return;
}
function enableRecipientButtons(fYesNo){
	if (fYesNo == false){
		g_selectedEmail="";
	}
}
function event_GalTable_ondblclick(){
	if (event.srcElement.parentElement.parentElement.tagName != "THEAD" && event.srcElement.tagName != "TABLE"){
		parent.SelectedItems.addDblClicked();
	}
}
function event_GalTable_onmousedown(){
	if (event.srcElement.parentElement.parentElement.parentElement.tagName != "THEAD" && event.srcElement.tagName != "TABLE"){
		if (g_eCurrentRow != null){
		//	g_eCurrentRow.setAttribute("className","rowunselected");
		//	g_eCurrentRow.style.backgroundColor = "#FFFFFF";//"transparent";
		//	g_eCurrentRow.style.color = "#333333";//"windowtext";
		}
		eTR = event.srcElement.parentElement;
		while(eTR.tagName != "TR"){
			eTR = eTR.parentElement;
		}
		//eTR.setAttribute("className","rowselected");
		
		g_eCurrentRow = eTR;
		//g_eCurrentRow.style.backgroundColor = "#D7DFE8";//"highlight";
		//g_eCurrentRow.style.color =  "#333333";//"highlighttext";	
		processSelectedRow();   
	}
}
function processSelectedRow(){
	try{
	    //겸직자 선택을 위한 추가 작업 2006.09 by sunny
		var szEM = g_eCurrentRow.em;
		var szJD = g_eCurrentRow.jd;
		g_objXmlSelectedRecipient = m_objXML.selectSingleNode("response/addresslist/item[AN = '"+ szEM +"' and JD = '"+ szJD +"' ]");
		//g_selectedEmail = g_objXmlSelectedRecipient.selectSingleNode("EM").text.replace(/\x08/g,"&");
		if(g_objXmlSelectedRecipient.selectSingleNode("ROLE").text != "manager"){
		    parent.getDetailInfo(g_objXmlSelectedRecipient.selectSingleNode("AN").text.replace(/\x08/g,"&"));
		}
	}catch(e){
		 //2006.09.26 김현태 개인결재선 Listitem 클릭시 이벤트 처리
	    try{
	        parent.getDetailInfo(g_objXmlSelectedRecipient.selectSingleNode("AN").text.replace(/\x08/g,"&"));
	    }catch(e){
	        parent.getDetailInfo(szEM);
	    }
	}
}
function clearContents(){
	for (var x=g_eGalTable.rows.length-1; x >= 1; x--){
		g_eGalTable.deleteRow(x);
	}
	g_eErrorDiv.innerText = "";

	g_eErrorDiv.style.display = "none";
	divGalTable.style.display = "block";
}
function event_eTR_onMouseOver(obj){
	obj.style.backgroundColor = "#EEF7F9";
}
function event_eTR_onMouseOut(obj){
	obj.style.backgroundColor = "#FFFFFF";
}

function addAddress(rgData,szEM,szJD,szFLDP){

	var eTD;
	var eTR = g_eGalTable.insertRow();	
	eTR.style.cursor = "hand";
	eTR.style.backgroudcolor='#FFFFFF';
	eTR.setAttribute("em",szEM);
	eTR.setAttribute("jd",szJD);
	eTR.setAttribute("FLDP",szFLDP);

	eTD = eTR.insertCell();	
	eTD.style.height = "25px";
	//eTD.valign = "middle";
	eTD.style.paddingLeft = "5px";
	eTD.innerHTML = "<INPUT id='chkRowSelect' Type='Checkbox' onclick='changeChecked();'>";
	for (var x=0;x<rgData.length;x++){
		eTD = eTR.insertCell();
		//eTD.halign = "middle";
		//eTD.align = "center";
		eTD.noWrap=true;
		//eTD.style.paddingRight = "10px";
		eTD.innerHTML = rgData[x].replace(/&/g,"&amp;");
	}
	//eTR = g_eGalTable.insertRow();
	//eTD = eTR.insertCell();
	//eTD.height = "1";
	//eTD.colSpan = 6;
	//eTD.className = "table_line";


}
function addMessage(szMsg){
	g_eErrorDiv.innerText = szMsg;
	g_eErrorDiv.style.display = "block"
	divGalTable.style.display = "none"
}


var selftime;
function event_GalTable_onmousemove(){
    if(parent.tooltip != undefined){
	    parent.tooltip.runtimeStyle.display = "none";
	}else{
	    tooltip.runtimeStyle.display = "none";
	}
    if(event == null)return;
	var el = event.srcElement;
	if(el==null)return;
	
	if (el.tagName != "TH" && el.tagName != "TABLE" && el.tagName != "DIV" && el.tagName != "SPAN"){
		while(el.tagName != "TR"){
			el = el.parentElement;
			if(el==null)return;
		}
		if(el.jd!=null && el.jd != ""){
			//tooltip.innerText = el.jd;
			//tooltip.innerText = "event.clientY " + event.clientY + "offsetY" + event.offsetY ;
			if(parent.tooltip != undefined){
			    parent.tooltip.innerText = el.FLDP;
			    parent.tooltip.style.left = event.clientX + 10;
			    parent.tooltip.style.top = event.clientY + 310;
			    parent.tooltip.style.zIndex = 1;
			    parent.tooltip.runtimeStyle.display = "block";
			}else{
			    tooltip.innerText = el.FLDP;
			    tooltip.style.left = event.clientX + 10;
			    tooltip.style.top = event.clientY + 10;
			    tooltip.style.zIndex = 1;
			    tooltip.runtimeStyle.display = "block";
			}
		}
	}
	selftime = setTimeout("event_GalTable_onmousemove()",1000);
}
function getCurrentNode(){
	return g_objXmlSelectedRecipient;
}
function changeChecked(){
	event_select();
	var eval = event.srcElement;
	//parent.parent.main.SelectedItems.setSourceList(window);

	eTR = eval.parentElement;

	if(eTR.tagName != "TR"){
		eTR = eTR.parentElement;
	}
	if(eTR.tagName != "TR"){
		eTR = eTR.parentElement;
	}
	if(eTR.tagName != "TR"){
		eTR = eTR.parentElement;
	}
	/*
	if(eval.checked){
		eTR.setAttribute("className","rowselected");
	}else{
		eTR.setAttribute("className","rowunselected");
	}
	*/
}
function CheckedAll(){
    
	event_select();
	if(typeof(document.all.chkRowSelect) == "undefined"){
		chkall.checked = false;
		return;
	}
	var chk_count = chkRowSelect.length;
	if(event.srcElement.checked){
		if(typeof(chk_count) == "undefined"){
			chkRowSelect.checked = true;
			var eTR = chkRowSelect.parentElement;
			while(eTR.tagName != "TR") {
				eTR = eTR.parentElement;
			}
			//eTR.setAttribute("className","rowselected");
		}else if(chk_count > 1){
			for(y = 0 ; y < chk_count ; y ++){
				chkRowSelect[y].checked = true;
				var eTR = chkRowSelect[y].parentElement;
				while(eTR.tagName != "TR") {
					eTR = eTR.parentElement;
				}
				//eTR.setAttribute("className","rowselected");
			}
		}
	}else{
		if(typeof(chk_count) == "undefined"){
			chkRowSelect.checked = false;
			var eTR = chkRowSelect.parentElement;
			while(eTR.tagName != "TR") {
				eTR = eTR.parentElement;
			}
			//eTR.setAttribute("className","rowunselected");
		}else if(chk_count > 1){
			for(y = 0 ; y < chk_count ; y ++){
				chkRowSelect[y].checked = false;
				var eTR = chkRowSelect[y].parentElement;
				while(eTR.tagName != "TR") {
					eTR = eTR.parentElement;
				}
				//eTR.setAttribute("className","rowunselected");
			}
		}
	}
}
// ----------------------------------------------
function event_select()
{
	parent.chk.value = "1";
	//parent.main.SelectedItems.setSourceList(window);
}	
//다국어처리
function getLngLabel(szLngLabel, szType){
    var rtnValue = "";
    var idxlng = gLngIdx;
    if(szType){idxlng++;}
    var ary = szLngLabel.split(";");
    if(ary.length > idxlng){
        rtnValue = ary[idxlng];
    }else{
        if(szType){rtnValue = ary[1];}
        else{rtnValue = ary[0];}
    }
    return rtnValue;
}