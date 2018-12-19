var curSelection = null;

function setStyle(src, toClass) {
	if (null != src) 
		src.className = toClass;
}

function mouseEnters() {  

	if ((curSelection != event.toElement) && ("A" == event.toElement.tagName))
		setStyle(event.toElement,"over");
}

function mouseLeaves() {

if ((curSelection != event.fromElement) &&
	  ("A" == event.fromElement.tagName))
   setStyle(event.fromElement, "");
}

function outliner(){
	var child = null, el = null;

	switch (event.srcElement.tagName) {
	case "A": 
	   el = event.srcElement.parentElement
	   child = document.all[event.srcElement.sourceIndex+1];
	   break;
	case "LI":
	   el = event.srcElement 
	   child = document.all[event.srcElement.sourceIndex+2];
	   break;
	}

	if ((null != child) && ("UL" == child.tagName) &&
		  ("LI" == child.parentElement.tagName)) {
	   if ("" == child.className) {

		  child.className = "expanded";
		  el.className = "open";
	   }
	   else { 

		  child.className = "";
		  el.className = "closed";
	   }
	}

	if ("A" == event.srcElement.tagName) {
	   if (null != curSelection)
		  setStyle(curSelection, "");

	   curSelection = event.srcElement;
	   setStyle(curSelection, "select");
	}
}
