var curSelection = null;

function setStyle(src, toClass){
	if (null != src) 
		src.className = toClass;
}
function mouseEnters(e){
    var evt=(window.event)?window.event: e;
    var toElement=(evt.toElement)?evt.toElement:((evt.relatedTarget)?evt.relatedTarget:evt.originalTarget);
	if ((curSelection != toElement) && ("A" == toElement.tagName))
		setStyle(toElement,"over");
}
function mouseLeaves(e){
    var evt=(window.event)?window.event: e;
    var fromElement=(evt.fromElement)?evt.fromElement: ((evt.relatedTarget)?evt.relatedTarget:evt.originalTarget);
	if ((curSelection != fromElement) && ("A" == fromElement.tagName))
	   setStyle(fromElement, "out");
 }
function outliner(e){
	var child = null, el = null;
	var groupID;
    var evt=(window.event)?window.event: e;
    el = (evt.srcElement)?evt.srcElement:evt.target;	
	
	switch (el.tagName){
	case "A": 
	   el = el.parentNode;
	   child =  el.nextSibling;//document.getElementById(el.sourceIndex+1);
	   break;
	case "LI":
	   child =  el.lastChild; //document.getElementById(el.sourceIndex+2);
	   break;
	}

	if ((null != child) && ("UL" == child.tagName) && ("LI" == child.parentNode.tagName)){
		if (child.parentNode.className != "spot") {
		    if ("" == child.className || "exe" == child.className ){
			    child.className = "expanded";
			    el.className = "open";
		    }
		    else{
			    child.className = "exe";
			    el.className = "exe";
		    }
		    getSubGroups(child.id.toString());
		}else{
		    try{
				m_oNode =  document.getElementById(child.id.toString()); 
				groupID = child.id.toString().replace("_","");
				groupID = groupID;
	            if(m_bGroup || m_bRecp){
		            parent.parent.SelectedItems.setSourceList(window);
		            m_sSelGrpID = groupID;
	            }
		    }catch(e){
		    }
		}
		
	}
	if ("A" == ((evt.srcElement)?evt.srcElement:evt.target).tagName){
	   if (null != curSelection)
		  setStyle(curSelection, "");

	   curSelection = (evt.srcElement)?evt.srcElement:evt.target;
	   setStyle(curSelection, "select");
	}
}
function outliner_title(e){
	//alert(g_user_check_all_title);
	var child = null, el = null;
	var groupID;
	
    var evt=(window.event)?window.event :e;
    el = (evt.srcElement)?evt.srcElement:evt.target;
	
	switch (el.tagName){
	case "A": 
	   el = el.parentNode;
	   child = document.getElementById(el.sourceIndex+1);
	   break;
	case "LI":
	   //el = event.srcElement 
	   child =document.getElementById(el.sourceIndex+2);
	   break;
	}

	if ((null != child) && ("UL" == child.tagName) && ("LI" == child.parentNode.tagName)){	
		if ("" == child.className){
			child.className = "expanded";
			el.className = "open";
		}
		else{
			child.className = "";
			el.className = "closed";
		}
		// 한진 중공업과 그외 회사들과 보직조직도 구성이 다르다. 그래서 구분 필요!!
		if (g_ENT == "H")
		{
			//getSubGroups_title(child.id.toString());
			getSubGroups_title(child.id.toString());
		}
		else
		{
			getSubGroups_title_else(child.id.toString());
		}
	}
	if ("A" == ( (evt.srcElement)?evt.srcElement:evt.target).tagName){
	   if (null != curSelection)
		  setStyle(curSelection, "");

	   curSelection =  (evt.srcElement)?evt.srcElement:evt.target;
	   setStyle(curSelection, "select");
	}
}
function outliner_group(e){
	var child = null, el = null;
	var groupID;
    var evt=(window.event)?window.event: e;
    var el =  (evt.srcElement)?evt.srcElement:evt.target;
	switch (el.tagName){
	case "A": 
	   el = el.parentNode;
	   child = document.getElementById(el.sourceIndex+1);
	   break;
	case "LI":
	   child = document.getElementById(el.sourceIndex+2);
	   break;
	}

	if ((null != child) && ("UL" == child.tagName) && ("LI" == child.parenNode.tagName)){	
		if ("" == child.className){
			child.className = "expanded";
			el.className = "open";
		}
		else{
			child.className = "";
			el.className = "closed";
		}
		//alert(child.name.toString());
		getSubGroups_group(child.id.toString() + ";" + child.name.toString());
	}
	if ("A" == el.tagName){
	   if (null != curSelection)
		  setStyle(curSelection, "");

	   curSelection = (evt.srcElement)?evt.srcElement:evt.target;
	   setStyle(curSelection, "select");
	}
}