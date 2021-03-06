var m_objXML = CreateXmlDocument();
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

window.onload= initOnload;
function initOnload(){
	g_eGalTable    = window.document.getElementById("tblGalInfo");
	g_eErrorDiv    = window.document.getElementById("divErrorMessage");
	
	var oStyles = window.document.styleSheets[0];
	var szFont = "";
	if (document.all){
        szFont = "font-family:'" + window.document.body.currentStyle.fontFamily + "'";
	    oStyles.addRule( "SELECT", szFont );
	    oStyles.addRule( "INPUT", szFont );
	    oStyles.addRule( "BUTTON", szFont );
    }else{
        szFont = "font-family:'" + window.document.body.style.fontFamily + "'";
    }

	if(window.addEventListener){
	    g_eGalTable.addEventListener('onmousedown',event_GalTable_onmousedown, false);
	    window.document.addEventListener('onmousemove',event_GalTable_onmousemove, false);
	}else{
	    //g_eGalTable.attachEvent("ondblclick",event_GalTable_ondblclick);
	    g_eGalTable.attachEvent("onmousedown",event_GalTable_onmousedown);
	    window.document.attachEvent("onmousemove",event_GalTable_onmousemove);
	}
	clearContents();
	/*
	var m_objXMLData = CreateXmlDocument();
	m_objXMLData.loadXML(document.getElementById("txtData").value);
	processXmlData(m_objXMLData);
	*/
	//if (parent.parent.SelectedItems.g_objMessage.m_sAddList == 'charge'){//담당자 지정시 해당 부서원만 출력
	//		parent.parent.Tab.ifrGroup.getMembers(parent.parent.SelectedItems.g_objMessage.getInfo("dpid_apv"));
	//}
	//try{if(parent.makeProcessor) m_oHTMLProcessor = parent.makeProcessor("../address/search.xsl");}catch(e){}

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
	objXML.documentElement.transformNodeToObject(g_oSSXML.documentElement, m_objXML);
	
	var rgData = new Array();
	var nodesAllItems = m_objXML.selectNodes("response/addresslist/item");
	if (nodesAllItems.length > 0){
		g_eGalTable.rows[0].style.display="";
		for(var x=0; x<nodesAllItems.length; x++){
		    var el = nodesAllItems.nextNode();
		    if(el.selectSingleNode("ROLE") != null && el.selectSingleNode("ROLE").text == "manager"){
	    		rgData[0] =getLngLabel(el.selectSingleNode("DN").text.replace(/\x08/g,"&"),false) + (gLngIdx == 1?" manager":"장");
		    }else{
    			rgData[0] =getLngLabel(el.selectSingleNode("DN").text.replace(/\x08/g,"&"),false);
			}
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
function event_GalTable_ondblclick(e){
	if (event.srcElement.parentNode.parentNode.tagName != "THEAD" && event.srcElement.tagName != "TABLE"){
		parent.SelectedItems.addDblClicked();
	}
}
function event_GalTable_onmousedown(e){
    var evt=(window.event)?window.event: e;
    el = (evt.srcElement)?evt.srcElement:evt.target;	

	if (el.parentNode.parentNode.parentNode.tagName != "THEAD" && el.tagName != "TABLE"){
		if (g_eCurrentRow != null){
		//	g_eCurrentRow.setAttribute("className","rowunselected");
		//	g_eCurrentRow.style.backgroundColor = "#FFFFFF";//"transparent";
		//	g_eCurrentRow.style.color = "#333333";//"windowtext";
		}
		eTR = el.parentNode;
		while(eTR.tagName != "TR"){
			eTR = eTR.parentNode;
		}
		//eTR.setAttribute("className","rowselected");
		
		g_eCurrentRow = eTR;
		//g_eCurrentRow.style.backgroundColor = "#D7DFE8";//"highlight";
		//g_eCurrentRow.style.color =  "#333333";//"highlighttext";	
		processSelectedRow();   
	}
}
function processSelectedRow(){
    g_objXmlSelectedRecipient = null;
	try{
		if(g_eCurrentRow.attributes["em"] != null){
			var szEM = g_eCurrentRow.attributes["em"].value;
			var szJD = g_eCurrentRow.attributes["jd"].value;
			if(szEM != null){
				g_objXmlSelectedRecipient = m_objXML.selectSingleNode("response/addresslist/item[AN = '"+ szEM +"' and JD = '"+ szJD +"' ]");
				//g_selectedEmail = g_objXmlSelectedRecipient.selectSingleNode("EM").text.replace(/\x08/g,"&");
				if(g_objXmlSelectedRecipient.selectSingleNode("ROLE").text != "manager"){
					try{if(parent.getDetailInfo) parent.getDetailInfo(g_objXmlSelectedRecipient.selectSingleNode("AN").text.replace(/\x08/g,"&"));}catch(e){}
				}
			}else{
				g_objXmlSelectedRecipient = null;
			}
		}
	}catch(e){
	}
}
function clearContents(){
	for (var x=g_eGalTable.rows.length-1; x >= 1; x--){
		g_eGalTable.deleteRow(x);
	}
	g_eErrorDiv.innerText = "";
	g_eErrorDiv.style.display = "none";
	document.getElementById("divGalTable").style.display = "block";
}
function event_eTR_onMouseOver(obj){
	obj.style.backgroundColor = "#EEF7F9";
}
function event_eTR_onMouseOut(obj){
	obj.style.backgroundColor = "#FFFFFF";
}

function addAddress(rgData,szEM,szJD,szFLDP){
    //debugger;
	var eTD;
	var eTR = g_eGalTable.insertRow(g_eGalTable.rows.length);	
	eTR.style.cursor = "hand";
	eTR.style.backgroudcolor='#FFFFFF';
	eTR.setAttribute("em",szEM);  //PERSON_CODE
	eTR.setAttribute("jd",szJD);
	eTR.setAttribute("FLDP", szFLDP);
	if (parent.gStampRightsYN == "Y") { //인장권자탭 선택인경우 (2012-12-17 HIW)
	    eTR.setAttribute("STAMP", "Y");
	}
	else {
	    eTR.setAttribute("STAMP", "N");
	}

	eTD = eTR.insertCell(eTR.cells.length);	
	eTD.style.height = "25px";
	//eTD.valign = "middle";
	eTD.style.paddingLeft = "5px";

	if (parent.gPrivateAppLine == "Y")  //개인결재선탭 선택한 경우 (2013-03-18 HIW)
        eTD.innerHTML = "<input id='chkRowSelect' name='chkRowSelect' type='checkbox' onclick='javascript:changeChecked(event);' disabled />";
    else
        eTD.innerHTML = "<input id='chkRowSelect' name='chkRowSelect' type='checkbox' onclick='javascript:changeChecked(event);' />";

	for (var x=0;x<rgData.length;x++){
		eTD = eTR.insertCell(eTR.cells.length);
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
	document.getElementById("divGalTable").style.display = "none"
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
			el = el.parentNode;
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
	//이중선택 방지
	var returnObj =  g_objXmlSelectedRecipient
    g_objXmlSelectedRecipient = null;
	return returnObj;//g_objXmlSelectedRecipient;
}
function changeChecked(e){
	event_select();
    var evt=(window.event)?window.event: e;
    var eval = (evt.srcElement)?evt.srcElement:evt.target;	

	eTR = eval.parentNode;

	if(eTR.tagName != "TR"){
		eTR = eTR.parentNode;
	}
	if(eTR.tagName != "TR"){
		eTR = eTR.parentNode;
	}
	if(eTR.tagName != "TR"){
		eTR = eTR.parentNode;
	}
	/*
	if(eval.checked){
		eTR.setAttribute("className","rowselected");
	}else{
		eTR.setAttribute("className","rowunselected");
	}
	*/
}
function CheckedAll(e){
	event_select();
	
    var evt=(window.event)?window.event: e;
    el = (evt.srcElement)?evt.srcElement:evt.target;	

    var sel_row = (window.addEventListener)? document.getElementsByName('chkRowSelect'):document.all.chkRowSelect;
    var chk_count = sel_row.length;
    if(el.checked){
        if (chk_count > 0) {
            for (var i = (chk_count - 1); i >= 0; i--) {
                sel_row[i].checked = true;
                var eTR = sel_row[i].parentNode;
                while (eTR.tagName != "TR") { eTR = eTR.parentNode; }
            }
        }else{
            document.getElementById("chkall").checked = false;
		    return;
        }
    }else{
        if (chk_count > 0) {
            for (var i = (chk_count - 1); i >= 0; i--) {
                sel_row[i].checked = false;
                var eTR = sel_row[i].parentNode;
                while (eTR.tagName != "TR") { eTR = eTR.parentNode; }
            }
        }else{
            document.getElementById("chkall").checked = false;
		    return;
        }
    }            

}
// ----------------------------------------------
function event_select()
{
	if(parent.document.getElementById("chk")){
	    parent.document.getElementById("chk").value = "1";
	}else{
	    if(document.getElementById("chk")) document.getElementById("chk").value = "1";
	}
	//catch(e){document.getElementById("chk").value = "1";}
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

/*

个*/