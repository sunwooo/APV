var m_objXML = new ActiveXObject("Microsoft.XMLDOM");

function BodyFormXML()
{
	var tXML="";
	
	
	tXML += makeNode("szVal1",szVal1.value,null,true);
	tXML += makeNode("szVal2",szVal2.value,null,true);
	tXML += makeNode("szVal3",szVal3.value,null,true);
	tXML += makeNode("szVal4",szVal4.value,null,true);
	tXML += makeNode("szVal5",szVal5.value,null,true);
	tXML += makeNode("classNum",classNum.value,null,true);
	body.value= "<body>" + tXML  + "</body>";
	
}
function DataXML()
{
	
	var bodyxml = getInfo("body");
	if (m_objXML.loadXML(bodyxml) == true) {
		var nodesClassNumItems = m_objXML.selectNodes("body");
		classNum.value = nodesClassNumItems.item(0).selectSingleNode("classNum").text 
		szVal1.value = nodesClassNumItems.item(0).selectSingleNode("szVal1").text 
		szVal2.value = nodesClassNumItems.item(0).selectSingleNode("szVal2").text 
		szVal3.value = nodesClassNumItems.item(0).selectSingleNode("szVal3").text 
		szVal4.value = nodesClassNumItems.item(0).selectSingleNode("szVal4").text 
		szVal5.value = nodesClassNumItems.item(0).selectSingleNode("szVal5").text 

	} else {
		alert("error in makeBody(): "+m_objXML.parseError.reason);
	}
}

function SaveDataXML()
{
	
	var bodyxml = getInfo("body");
	if (m_objXML.loadXML(bodyxml) == true) {
		var nodesClassNumItems = m_objXML.selectNodes("body");
		classNum.value = nodesClassNumItems.item(0).selectSingleNode("classNum").text 
		szVal1.value = nodesClassNumItems.item(0).selectSingleNode("szVal1").text 
		szVal2.value = nodesClassNumItems.item(0).selectSingleNode("szVal2").text 
		szVal3.value = nodesClassNumItems.item(0).selectSingleNode("szVal3").text 
		szVal4.value = nodesClassNumItems.item(0).selectSingleNode("szVal4").text 
		szVal5.value = nodesClassNumItems.item(0).selectSingleNode("szVal5").text 

	} else {
		alert("error in makeBody(): "+m_objXML.parseError.reason);
	}
}
function urgentApvList(oApvList){
	var elmRoot, elmList, elm, elmPerson, elmTaskInfo,strKind;
	var i;
	var l_DApvLine = window.document.all['DApvLine'];

	elmRoot = oApvList.documentElement;
	for (var t=0; t<=l_DApvLine.length-1; t++) {
		l_DApvLine[t].innerHTML = "&nbsp;"
	}

	//기안부서 결재칸
	elmList = elmRoot.selectNodes("step[@unittype='person' and @routetype='approve']/ou/person");
	if (l_DApvLine.length<elmList.length) {
		parent.menu.field["APVLIST"].value = "";
		if (getInfo("fmid") == "REGISTERORG" || getInfo("fmid") == "ABANDONORG" || getInfo("fmid") == "ASSIDUITY" ) 
			window.parent.menu.displayBtn("none","none","none","none","none","","none","none","none","","none","none","none","none","none");
		else 
			window.parent.menu.displayBtn("none","none","none","none","none","","none","none","none","","none","","none","none","none");
			
		alert("결재자가 많이 지정되었습니다.\n\n확인해 주세요!!");
		return false;
	} else {
		var m;
		if (elmList.length == 5) { m = 0}
		else if (elmList.length == 4) { m = 0}
		else if (elmList.length == 3) { m = 0}
		else if (elmList.length == 2) { m = 0}
		else if (elmList.length == 1) { m = 0}
		
		for (i=0; i<elmList.length;i++) {
			elm = elmList.nextNode();
			elmTaskInfo = elm.selectSingleNode("taskinfo");
			strDate = elmTaskInfo.getAttribute("datecompleted");
			if (strDate == null) {strDate = "";}
			else {arrDate = strDate.split(" ")}
			strComment = elmTaskInfo.selectSingleNode("comment");
			strKind = elmTaskInfo.getAttribute("kind");

			if (strDate == "") {
				if (strKind == "bypass") l_DApvLine[m].innerHTML = "후 열";
				else if (strKind == "authorize") {
					//전결자 처리
					if (l_DApvLine.length <= elmList.length) {
						parent.menu.field["APVLIST"].value = "";
						if (getInfo("fmid") == "REGISTERORG" || getInfo("fmid") == "ABANDONORG" || getInfo("fmid") == "ASSIDUITY" ) 
							window.parent.menu.displayBtn("none","none","none","none","none","","none","none","none","","none","none","none","none","none");
						else
							window.parent.menu.displayBtn("none","none","none","none","none","","none","none","none","","none","","none","none","none");
						for (var x=0; x < l_DApvLine.length; x++) {
							l_DApvLine[x].innerHTML = "&nbsp;";
						}
							
						alert("전결자 지정이 잘 못되었습니다.\n\n다시 지정하세요!!");
						return false;
					}
					l_DApvLine[i].innerHTML = "전 결";
					l_DApvLine[i+1].innerHTML = elm.getAttribute("name");
				}
				else l_DApvLine[m].innerHTML = elm.getAttribute("name");
			} else {
				if (strKind == "bypass") l_DApvLine[m].innerHTML = "후 열";
				else if (strKind == "authorize") {
					l_DApvLine[i].innerHTML = "전 결";
					l_DApvLine[i+1].innerHTML = "<img src='/Storage/workflow/Signimage/" + elm.getAttribute("code") + ".gif' width=50 height=31 border=0>";
				}
				else l_DApvLine[m].innerHTML = "<img src='/Storage/workflow/Signimage/" + elm.getAttribute("code") + ".gif' width=50 height=31 border=0>";
			}
			l_DApvLine[m].align = "center"
			
				if (elmList.length == 5) { m++}
				else if (elmList.length == 4) { 
						if(i==2){m=m+2}
						else{m=m+1}
				}
				else if (elmList.length == 3) { m = m + 2}
				else if (elmList.length <= 3) {}
		}	
		if (getInfo("mode")=="REJECT" && getInfo("isagain") == "again"){
			window.parent.menu.displayBtn("none","none","none","none","","","none","none","none","","none","","none","none","none");
		} else if (getInfo("mode")=="REJECT" && getInfo("isagain") != "again") {
			window.parent.menu.displayBtn("none","none","none","none","none","none","none","none","none","none","none","","","none","");
		}
		if ((getInfo("loct")=="PROCESS") || (getInfo("loct")=="COMPLETE") && (getInfo("mode")!="REJECT")) {
			window.parent.menu.displayBtn("none","none","none","none","none","","none","none","none","none","","none","none","none","none");
		}
	}
}
