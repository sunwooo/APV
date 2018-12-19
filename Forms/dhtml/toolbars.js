DECMD_BOLD =                      5000
DECMD_COPY =                      5002
DECMD_CUT =                       5003
DECMD_DELETE =                    5004
DECMD_DELETECELLS =               5005
DECMD_DELETECOLS =                5006
DECMD_DELETEROWS =                5007
DECMD_FINDTEXT =                  5008
DECMD_FONT =                      5009
DECMD_GETBACKCOLOR =              5010
DECMD_GETBLOCKFMT =               5011
DECMD_GETBLOCKFMTNAMES =          5012
DECMD_GETFONTNAME =               5013
DECMD_GETFONTSIZE =               5014
DECMD_GETFORECOLOR =              5015
DECMD_HYPERLINK =                 5016
DECMD_IMAGE =                     5017
DECMD_INDENT =                    5018
DECMD_INSERTCELL =                5019
DECMD_INSERTCOL =                 5020
DECMD_INSERTROW =                 5021
DECMD_INSERTTABLE =               5022
DECMD_ITALIC =                    5023
DECMD_JUSTIFYCENTER =             5024
DECMD_JUSTIFYLEFT =               5025
DECMD_JUSTIFYRIGHT =              5026
DECMD_LOCK_ELEMENT =              5027
DECMD_MAKE_ABSOLUTE =             5028
DECMD_MERGECELLS =                5029
DECMD_ORDERLIST =                 5030
DECMD_OUTDENT =                   5031
DECMD_PASTE =                     5032
DECMD_REDO =                      5033
DECMD_REMOVEFORMAT =              5034
DECMD_SELECTALL =                 5035
DECMD_SEND_BACKWARD =             5036
DECMD_BRING_FORWARD =             5037
DECMD_SEND_BELOW_TEXT =           5038
DECMD_BRING_ABOVE_TEXT =          5039
DECMD_SEND_TO_BACK =              5040
DECMD_BRING_TO_FRONT =            5041
DECMD_SETBACKCOLOR =              5042
DECMD_SETBLOCKFMT =               5043
DECMD_SETFONTNAME =               5044
DECMD_SETFONTSIZE =               5045
DECMD_SETFORECOLOR =              5046
DECMD_SPLITCELL =                 5047
DECMD_UNDERLINE =                 5048
DECMD_UNDO =                      5049
DECMD_UNLINK =                    5050
DECMD_UNORDERLIST =               5051
DECMD_PROPERTIES =                5052

//
// Enums
//

// OLECMDEXECOPT  
OLECMDEXECOPT_DODEFAULT =         0 
OLECMDEXECOPT_PROMPTUSER =        1
OLECMDEXECOPT_DONTPROMPTUSER =    2

// DHTMLEDITCMDF
DECMDF_NOTSUPPORTED =             0 
DECMDF_DISABLED =                 1 
DECMDF_ENABLED =                  3
DECMDF_LATCHED =                  7
DECMDF_NINCHED =                  11

// DHTMLEDITAPPEARANCE
DEAPPEARANCE_FLAT =               0
DEAPPEARANCE_3D =                 1 

// OLE_TRISTATE
OLE_TRISTATE_UNCHECKED =          0
OLE_TRISTATE_CHECKED =            1
OLE_TRISTATE_GRAY =               2

var tbEventSrcElement;

TB_STS_OK = "OK" // Success return
TB_E_INVALID_CLASS = "Invalid class value"

TB_DISABLED_OPACITY_FILTER = "alpha(opacity=45)"
TB_HANDLE = '<DIV class=tbHandleDiv style="LEFT: 3"> </DIV>' +
'<DIV class=tbHandleDiv style="LEFT: 6"> </DIV>'

var TBInitialized = false; // Set to true when the package has initialized.
var tbdButtons;  // Array of all toolbars.
var tbContentElementObject = null; // Content element.
var tbContentElementTop = 0;  // Y pixel coordinate of the top of the content element.
var tbContentElementBottom = 0; // Y pixel coordinate of the bottom of the content element.
var tbRaisedElement = null; // Current toolbar button that is being shown raised.
var tbOnClickInProcess;	// Executing user's onClick event.
var tbMouseOutWhileInOnClick;  // An onmouseout event occurred while executing the user's onClick event.



function TBSetState(element, newState) {

	newState = newState.toLowerCase();

	switch (element.className) {
		
		case "tbdButton" :
		case "tbdButtonDown" :
		case "tbdButtonMouseOverUp" :
		case "tbdButtonMouseOverDown" :
		case "tbMenuItem" :
				if ((newState != "gray") && (newState != "checked") && (newState != "unchecked")) {
				return TB_E_INVALID_STATE;
			}
			
			currentState = element.TBSTATE;

			if (currentState == "") {
				 currentState = "checked";
			}

			if (newState == currentState) {
				return;
			}
		
			if (element.className != "tbMenuItem") {
				image = element.children.tags("IMG")[0];

				if (newState == "gray") {
					element.className = "tbdButton";  
					image.className = "tbdIcon";
					element.style.filter = TB_DISABLED_OPACITY_FILTER;
				}

// Coming out of disabled state. Remove disabled look.
				if (currentState == "gray") {
					element.style.filter = "";
				}

				if (newState == "checked") {
					element.className = "tbdButtonDown";  
					image.className = "tbdIconDown";
				} else { //unchecked
					element.className = "tbdButton";  
					image.className = "tbdIcon";
				}  
			 }
			
			element.TBSTATE = newState;
			break;

		default :
			return TB_E_INVALID_CLASS;
	}
	return TB_STS_OK;
} //TBSetState


// Event handler for tbContentElementObject onmouseover events.
function TBContentElementMouseOver() {
	if (tbRaisedElement) {
		switch (tbRaisedElement.className) {
			case "tbdButtonMouseOverUp" :
				tbRaisedElement.className = "tbdButton";
				break;
			case "tbdButtonMouseOverDown" :
				tbRaisedElement.className = "tbdButtonDown";
				break;
		}
		tbRaisedElement = null;
	}
}

// Hander that simply cancels an event
function TBCancelEvent() {
	event.returnValue=false;
	event.cancelBubble=true;
}

// Toolbar button onmouseover handler
function tbdButtonMouseOver() {
	var element, image;

	image = event.srcElement;
	element = image.parentElement;

	if (element.TBSTATE == "gray") {
		event.cancelBubble=true;
		return;
	}
// Change button look based on current state of image.
	if (image.className == "tbdIcon") {
		element.className = "tbdButtonMouseOverUp";
		tbRaisedElement = element;
	} else if (image.className == "tbdIconDown") {
		element.className = "tbdButtonMouseOverDown";
	}

	event.cancelBubble=true;
} // tbdButtonMouseOver

// Toolbar button onmouseout handler
function tbdButtonMouseOut() {
	var element, image;

	image = event.srcElement;
	element = image.parentElement;
	if (element.TBSTATE == "gray") {
		event.cancelBubble=true;
		return;
	}

	tbRaisedElement = null;

// Are we in the middle of an onClick event? Set a flag for the onclick handler and return if so.
	if (tbOnClickInProcess) {
		tbMouseOutWhileInOnClick = true;
		return;
	}

	switch (image.className) {
		case "tbdIcon" :
// Is the user cancelling unchecking a toggle/radio button by moving out?
			if ((element.TBTYPE == "toggle") && (element.TBSTATE == "checked")) {
				element.className = "tbdButtonDown";
				image.className = "tbdIconDown";
			} else {
				element.className = "tbdButton";
			}
			break;

		case "tbdIconDown" :
// Is the user cancelling checking a toggle/radio button by moving out?
			if ((element.TBTYPE == "toggle") && (element.TBSTATE == "unchecked")) {
				element.className = "tbdButton";
				image.className = "tbdIcon";
			} else {
				element.className = "tbdButtonDown"
			}
			break;

		case "tbdIconDownPressed" :
// The only time we'll see this is if the user is cancelling unchecking a checked toggle/radio
			element.className = "tbdButtonDown";
			image.className = "tbdIconDown";
			break;  
	}
	event.cancelBubble=true;
} // tbdButtonMouseOut

// Toolbar button onmousedown handler
function tbdButtonMouseDown() {
	var element, image;

	if (event.srcElement.tagName == "IMG") {
		image = event.srcElement;
		element = image.parentElement;
	} else {
		element = event.srcElement;
		image = element.children.tags("IMG")[0];
	}
	if (element.TBSTATE == "gray") {
		event.cancelBubble=true;
		return;
	}
	switch (image.className) {
		case "tbdIcon" :
			element.className = "tbdButtonMouseOverDown";
			image.className = "tbdIconDown";
			break;

		case "tbdIconDown" :
			if (element.TBTYPE == "toggle") {
				image.className = "tbdIconDownPressed";
			} else {
				element.className = "tbdButton";
				image.className = "tbdIcon";
			}
			break;
	}   

	event.cancelBubble=true;
	return false;

} //tbdButtonMouseDown

// Toolbar button onmouseup handler
function tbdButtonMouseUp() {
	var element, image, userOnClick, i;

	if (event.srcElement.tagName == "IMG") {
		image = event.srcElement;
		element = image.parentElement;
	} else {
		element = event.srcElement;
		image = element.children.tags("IMG")[0];
	}

	if (element.TBSTATE == "gray") {
		event.cancelBubble=true;
		return;
	}

// Initialize tbEventSrcElement so that the user's onClick handler can find out where the
// event is coming from
	tbEventSrcElement = element;

	tbOnClickInProcess = true;
	tbMouseOutWhileInOnClick = false;
	if (element.TBUSERONCLICK) {
		eval(element.TBUSERONCLICK + "anonymous()");
	}
	tbOnClickInProcess = false;

// Is the nomouseover flag set on the toolbar?
	if (element.parentElement.TBTYPE == "nomouseover") {
		tbMouseOutWhileInOnClick = true;
	}

//Update state and appearance based on type of button
	switch (element.TBTYPE) {
		case "toggle" :
			if (element.TBSTATE == "checked") {
				element.TBSTATE = "unchecked";
				if (tbMouseOutWhileInOnClick) {
					element.className = "tbdButton";
				} else {
					element.className = "tbdButtonMouseOverUp";
				}
				image.className = "tbdIcon";
			} else {
				element.TBSTATE = "checked";
				if (tbMouseOutWhileInOnClick) {
					element.className = "tbdButtonDown";
				} else {
					element.className = "tbdButtonMouseOverDown";
				}
				image.className = "tbdIconDown";
			}
			break;

		default : // Regular button
			if (tbMouseOutWhileInOnClick) {
				element.className = "tbdButton";
			} else {
				element.className = "tbdButtonMouseOverUp";
			}
			image.className = "tbdIcon";
	}

	event.cancelBubble=true;
	return false;

} // tbdButtonMouseUp

// Initialize a toolbar button
function TBInitButton(element, mouseOver) {
	var image;

// Make user-settable properties all lowercase and do a validity check
	if (element.TBTYPE) {
		element.TBTYPE = element.TBTYPE.toLowerCase();
	}
	if (element.TBSTATE) {
		element.TBSTATE = element.TBSTATE.toLowerCase();
	}

	image = element.children.tags("IMG")[0]; 

// Set up all our event handlers
	if (mouseOver) {
		element.onmouseover = tbdButtonMouseOver;
		element.onmouseout = tbdButtonMouseOut;
	}
	element.onmousedown = tbdButtonMouseDown; 
	element.onmouseup = tbdButtonMouseUp; 
	element.ondragstart = TBCancelEvent;
	element.onselectstart = TBCancelEvent;
	element.onselect = TBCancelEvent;
	element.TBUSERONCLICK = element.onclick; // Save away the original onclick event
	element.onclick = TBCancelEvent;

// Set up initial button state
	if (element.TBSTATE == "gray") {
		element.style.filter = TB_DISABLED_OPACITY_FILTER;
		return TB_STS_OK;
	}
	if (element.TBTYPE == "toggle") {
		if (element.TBSTATE == "checked") {
			element.className = "tbdButtonDown";
			image.className = "tbdIconDown";
		} else {
			element.TBSTATE = "unchecked";
		}
	}
	element.TBINITIALIZED = true;
	return TB_STS_OK;
} // TBInitButton

// Initialize everything when the document is ready
function initTB() {

	var i, s, elements, j, k;

	if (TBInitialized) {
		return;
	}

	TBInitialized = true;

//	document.body.scroll = "no";

// Find all the toolbars and initialize them. 
	for (i=0; i<document.body.all.length; i++) {
		if (document.body.all[i].className == "tbdButton") {
			tbdButtons = document.body.all[i];
// Iterate through all the top-level elements in the toolbar
			elements = tbdButtons.children;
			for (j=0; j<elements.length; j++) {
				if (elements[j].className == "tbdButton") {
					if (elements[j].TBINITIALIZED == null) {
						k = TBInitButton(elements[j], tbdButtons.TBTYPE != "nomouseover")
					}    	
				}
			}
// Set the toolbar width and put in the handle
			tbdButtons.style.posWidth = 24; // + TB_TOOLBAR_PADDING;
			tbdButtons.insertAdjacentHTML("AfterBegin", TB_HANDLE);
		}
	}

	tbContentElementTop = tbdButtons.offsetHeight;
	tbContentElementBottom = document.body.offsetHeight;
}

tbContentElementObject = document.body.all["tbContentElement"];
document.write('<SCRIPT LANGUAGE="JavaScript" FOR="tbContentElement.HTML" EVENT="onmouseover"> ; </script>');
tbContentElement.attachEvent("DisplayChanged",tbContentElement_DisplayChanged);
tbContentElement.attachEvent("DocumentComplete",tbContentElement_DocumentComplete);
tbContentElement.attachEvent("ShowContextMenu",tbContentElement_ShowContextMenu);
tbContentElement.attachEvent("ContextMenuAction",tbContentElement_ContextMenuAction);

function displayTB(){
	toolbar.innerHTML = "<table cellpadding='0' cellspacing='0' border='0' width='100%' id='table_toolBar' bgcolor='buttonface'>"
						+	"<tr id='top_toolBar'>"
						+		"<td width='100%' height='28' nowrap='1'>"
						+			"<span class='tbdButton' id='idFormatbar'>"
						+				"<span class='tbdSeparator'>&nbsp;</span>"
						+				"<span class='tbdSeparator'>&nbsp;</span>"
						+				"<select ID='FontName' class='tbdGeneral' TITLE='Font Name' LANGUAGE='javascript' onchange='return FontName_Change()' style='POSITION: relative;TOP: -3px;width:130;'>"
						+					"<option value='굴림'>굴림"
						+					"<option value='굴림체'>굴림체"
						+					"<option value='궁서'>궁서"
						+					"<option value='궁서체'>궁서체"
						+					"<option value='돋움'>돋움"
						+					"<option value='돋움체'>돋움체"
						+					"<option value='바탕'>바탕"
						+					"<option value='바탕체'>바탕체"
						+					"<option value='휴먼매직체'>휴먼매직체"
						+					"<option value='휴먼옛체'>휴먼옛체"
						+					"<option value='HY견고딕'>HY견고딕"
						+					"<option value='HY견명조'>HY견명조"
						+					"<option value='HY궁서B'>HY궁서B"
						+					"<option value='HY그래픽M'>HY그래픽M"
						+					"<option value='HY신명조'>HY신명조"
						+					"<option value='HY얕은샘물M'>HY얕은샘물M"
						+					"<option value='HY엽서L'>HY엽서L"
						+					"<option value='HY중고딕'>HY중고딕"
						+					"<option value='HY헤드라인M'>HY헤드라인M"
						+					"<option value='Arial'>Arial"
						+					"<option value='Arial Black'>Arial Black"
						+					"<option value='Arial Narrow'>Arial Narrow"
						+					"<option value='Book Antiqua'>Book Antiqua"
						+					"<option value='Bookman Old Style'>Bookman Old Style"
						+					"<option value='Century Gothic'>Century Gothic"
						+					"<option value='Comic Sans MS'>Comic Sans MS"
						+					"<option value='Courier New'>Courier New"
						+					"<option value='Garamond'>Garamond"
						+					"<option value='Georgia'>Georgia"
						+					"<option value='Impact'>Impact"
						+					"<option value='Lucida Console'>Lucida Console"
						+					"<option value='Marlett'>Marlett"
						+					"<option value='Microsoft Sans Serif'>Microsoft Sans Serif"
						+					"<option value='Monotype Corsiva'>Monotype Corsiva"
						+					"<option value='Palatino Linotype'>Palatino Linotype"
						+					"<option value='Symbol'>Symbol"
						+					"<option value='Tahoma'>Tahoma"
						+					"<option value='Times New Roman'>Times New Roman"
						+					"<option value='Trebuchet MS'>Trebuchet MS"
						+					"<option value='Verdana'>Verdana"
						+					"<option value='Webdings'>Webdings"
						+					"<option value='Wingdings'>Wingdings"
						+					"<option value='Wingdings 2'>Wingdings 2"
						+					"<option value='Wingdings 3'>Wingdings 3"
						+				"</select>"
						+				"<select ID='FontSize' class='tbdGeneral' style='width:50;POSITION: relative;TOP: -3px;' TITLE='Font Size' LANGUAGE='javascript' onchange='return FontSize_Change()'>"
						+					"<option value='1'>8"
						+					"<option value='2'>10"
						+					"<option value='3'>12"
						+					"<option value='4'>14"
						+					"<option value='5'>18"
						+					"<option value='6'>24"
						+					"<option value='7'>36"
						+				"</select>"
						+			"<span class='tbdSeparator'>&nbsp;</span>"
						+			"<span class='tbdButton' ID='DECMD_BOLD'  TITLE='굵게' onClick='return DECMD_Click(DECMD_BOLD)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/Bold_kor.GIF'></span>"
						+			"<span class='tbdButton' ID='DECMD_ITALIC'  TITLE='기울림꼴' onClick='return DECMD_Click(DECMD_ITALIC)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/italic_kor.gif'></span>"
						+			"<span class='tbdButton' ID='DECMD_UNDERLINE'  TITLE='밑줄' onClick='return DECMD_Click(DECMD_UNDERLINE)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/under_kor.gif'></span>"
						+			"<span class='tbdSeparator'>&nbsp;</span>"
						+			"<span class='tbdButton' ID='DECMD_JUSTIFYLEFT'  TITLE='왼쪽 맞춤' onClick='return DECMD_Click(DECMD_JUSTIFYLEFT)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/justify_left.gif'></span>"
						+			"<span class='tbdButton' ID='DECMD_JUSTIFYCENTER'  TITLE='가운데 맞춤' onClick='return DECMD_Click(DECMD_JUSTIFYCENTER)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/justify_center.gif'></span>"
						+			"<span class='tbdButton' ID='DECMD_JUSTIFYRIGHT'  TITLE='오른쪽 맞춤' onClick='return DECMD_Click(DECMD_JUSTIFYRIGHT)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/justify_right.gif'></span>"
						+			"<span class='tbdSeparator'>&nbsp;</span>"
						+			"<span class='tbdButton' ID='DECMD_ORDERLIST'  TITLE='번호 매기기' onClick='return DECMD_Click(DECMD_ORDERLIST)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/numlist.GIF'></span>"
						+			"<span class='tbdButton' ID='DECMD_UNORDERLIST'  TITLE='글머리 기호' onClick='return DECMD_Click(DECMD_UNORDERLIST)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/bullist.GIF'></span>"
						+			"<span class='tbdSeparator'>&nbsp;</span>"
						+			"<span class='tbdButton' ID='DECMD_OUTDENT'  TITLE='내어쓰기' onClick='return DECMD_Click(DECMD_OUTDENT)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/DeIndent.GIF'></span>"
						+			"<span class='tbdButton' ID='DECMD_INDENT'  TITLE='들여쓰기' onClick='return DECMD_Click(DECMD_INDENT)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/inindent.GIF'></span>"
						+			"<span class='tbdSeparator'>&nbsp;</span>"
						+			"<span class='tbdButton' ID='DECMD_SETFORECOLOR'  TITLE='글꼴 색' onClick='return DECMD_Click(DECMD_SETFORECOLOR)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/fgcolor.GIF'></span>"
						+			"<span class='tbdSeparator'>&nbsp;</span>"
						+			"<span class='tbdButton' ID='SPECIAL' TITLE='고급서식' onClick='return button_toggle()' style='display:none'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/tool_down.gif'></span>"
						+			"<span class='tbdButton' ID='DECMD_IMAGE'  TITLE='이미지 삽입' onClick='return DECMD_Click(DECMD_IMAGE)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/image.GIF'></span>"
						+			"<span class='tbdSeparator'>&nbsp;</span>"
						+			"<span class='tbdButton' ID='DECMD_HYPERLINK'  TITLE='링크' onClick='return DECMD_Click(DECMD_HYPERLINK)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/Link.GIF'></span>"
						+			"<span class='tbdSeparator'>&nbsp;</span>"
						+			"<span class='tbdButton' ID='DECMD_INSERTTABLE'  TITLE='표 삽입' onClick='return DECMD_Click(DECMD_INSERTTABLE)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/instable.GIF'></span>"
						+			"<span class='tbdSeparator'>&nbsp;</span>"
						+			"<span class='tbdButton' ID='DECMD_INSERTROW'  TITLE='행 삽입' onClick='return DECMD_Click(DECMD_INSERTROW)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/insrow.GIF'></span>"
						+			"<span class='tbdButton' ID='DECMD_DELETEROWS'  TITLE='행 삭제' onClick='return DECMD_Click(DECMD_DELETEROWS)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/delrow.GIF'></span>"
						+			"<span class='tbdSeparator'>&nbsp;</span>"
						+			"<span class='tbdButton' ID='DECMD_INSERTCOL'  TITLE='열 삽입' onClick='return DECMD_Click(DECMD_INSERTCOL)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/inscol.GIF'></span>"
						+			"<span class='tbdButton' ID='DECMD_DELETECOLS'  TITLE='열 삭제' onClick='return DECMD_Click(DECMD_DELETECOLS)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/delcol.GIF'></span>"
						+			"<span class='tbdSeparator'>&nbsp;</span>"
						+			"<span class='tbdButton' ID='DECMD_MERGECELLS'  TITLE='셀 병합' onClick='return DECMD_Click(DECMD_MERGECELLS)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/mrgcell.GIF'></span>"
						+			"<span class='tbdButton' ID='DECMD_SPLITCELL'  TITLE='셀 분할' onClick='return DECMD_Click(DECMD_SPLITCELL)'><img class='tbdIcon' src='/covinet/CoviFlowNet/Forms/dhtml/images/spltcell.GIF'></span>"
						+			"<span class='tbdSeparator'>&nbsp;</span>"
//						+           "<span style='width:230; BACKGROUND-COLOR: buttonface;'>&nbsp;</span>"	
						+			"<span class='tbdSeparator'>&nbsp;</span>"					
						+			"<span class='tbdSeparator'>&nbsp;</span></span></td></tr></table>";
}
