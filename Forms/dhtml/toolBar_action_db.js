// Constants
var MENU_SEPARATOR = ""; // Context menu separator

// Globals
var QueryStatusToolbarButtons = new Array();
var ContextMenu = new Array();

//	var bodyStyle = "<STYLE>P {margin-top:2px;margin-bottom:2px;}</STYLE>";
var DHTMLEditCtrlLoadFlag = false;

// Constructor for custom object that represents an item on the context menu
function ContextMenuItem(string, cmdId) {
	this.string = string;
	this.cmdId = cmdId;
}

// Constructor for custom object that represents a QueryStatus command and 
// corresponding toolbar element.
function QueryStatusItem(command, element) {
	this.command = command;
	this.element = element;
}

// Event handlers
function InitEditCtrl() {
	// Initialze QueryStatus tables. These tables associate a command id with the
	// corresponding button object. Must be done on window load, 'cause the buttons must exist.
	QueryStatusToolbarButtons[0] = new QueryStatusItem(DECMD_BOLD, document.body.all["DECMD_BOLD"]);
	QueryStatusToolbarButtons[1] = new QueryStatusItem(DECMD_HYPERLINK, document.body.all["DECMD_HYPERLINK"]);
	QueryStatusToolbarButtons[2] = new QueryStatusItem(DECMD_INDENT, document.body.all["DECMD_INDENT"]);
	QueryStatusToolbarButtons[3] = new QueryStatusItem(DECMD_ITALIC, document.body.all["DECMD_ITALIC"]);
	QueryStatusToolbarButtons[4] = new QueryStatusItem(DECMD_JUSTIFYLEFT, document.body.all["DECMD_JUSTIFYLEFT"]);
	QueryStatusToolbarButtons[5] = new QueryStatusItem(DECMD_JUSTIFYCENTER, document.body.all["DECMD_JUSTIFYCENTER"]);
	QueryStatusToolbarButtons[6] = new QueryStatusItem(DECMD_JUSTIFYRIGHT, document.body.all["DECMD_JUSTIFYRIGHT"]);
	QueryStatusToolbarButtons[7] = new QueryStatusItem(DECMD_IMAGE, document.body.all["DECMD_IMAGE"]);	
	QueryStatusToolbarButtons[8] = new QueryStatusItem(DECMD_ORDERLIST, document.body.all["DECMD_ORDERLIST"]);
	QueryStatusToolbarButtons[9] = new QueryStatusItem(DECMD_OUTDENT, document.body.all["DECMD_OUTDENT"]);
	QueryStatusToolbarButtons[10] = new QueryStatusItem(DECMD_UNDERLINE, document.body.all["DECMD_UNDERLINE"]);
	QueryStatusToolbarButtons[11] = new QueryStatusItem(DECMD_UNORDERLIST, document.body.all["DECMD_UNORDERLIST"]);
	QueryStatusToolbarButtons[12] = new QueryStatusItem(DECMD_INSERTTABLE, document.body.all["DECMD_INSERTTABLE"]);
	QueryStatusToolbarButtons[13] = new QueryStatusItem(DECMD_INSERTROW, document.body.all["DECMD_INSERTROW"]);
	QueryStatusToolbarButtons[14] = new QueryStatusItem(DECMD_DELETEROWS, document.body.all["DECMD_DELETEROWS"]);
	QueryStatusToolbarButtons[15] = new QueryStatusItem(DECMD_INSERTCOL, document.body.all["DECMD_INSERTCOL"]);
	QueryStatusToolbarButtons[16] = new QueryStatusItem(DECMD_DELETECOLS, document.body.all["DECMD_DELETECOLS"]);
	QueryStatusToolbarButtons[17] = new QueryStatusItem(DECMD_INSERTCELL, document.body.all["DECMD_INSERTCELL"]);
	QueryStatusToolbarButtons[18] = new QueryStatusItem(DECMD_DELETECELLS, document.body.all["DECMD_DELETECELLS"]);
	QueryStatusToolbarButtons[19] = new QueryStatusItem(DECMD_MERGECELLS, document.body.all["DECMD_MERGECELLS"]);
	QueryStatusToolbarButtons[20] = new QueryStatusItem(DECMD_SPLITCELL, document.body.all["DECMD_SPLITCELL"]);
	QueryStatusToolbarButtons[21] = new QueryStatusItem(DECMD_SETFORECOLOR, document.body.all["DECMD_SETFORECOLOR"]);

	// Initialize the context menu arrays.
	ContextMenu[0] = new ContextMenuItem(MENU_SEPARATOR, 0);
	ContextMenu[1] = new ContextMenuItem("?ÑÏ≤¥?†ÌÉù", DECMD_SELECTALL);
}

function InitEditor() {
	DHTMLEditor.document.body.style.fontSize = "10pt";
	DHTMLEditor.document.body.style.fontFamily = "Íµ¥Î¶ºÏ≤?;
}


function tbContentElement_ShowContextMenu() {
	var menuStrings = new Array();
	var menuStates = new Array();
	var state;
	var i
	var idx = 0;

	// Set up the actual arrays that get passed to SetContextMenu
	for (i=0; i<ContextMenu.length; i++) {
		menuStrings[i] = ContextMenu[i].string;
		if (menuStrings[i] != MENU_SEPARATOR) {
			state = tbContentElement.QueryStatus(ContextMenu[i].cmdId);
		} else {
			state = DECMDF_ENABLED;
		}
		if (state == DECMDF_DISABLED || state == DECMDF_NOTSUPPORTED) {
			menuStates[i] = OLE_TRISTATE_GRAY;
		} else if (state == DECMDF_ENABLED || state == DECMDF_NINCHED) {
			menuStates[i] = OLE_TRISTATE_UNCHECKED;
		} else { // DECMDF_LATCHED
			menuStates[i] = OLE_TRISTATE_CHECKED;
		}
	}

	// Set the context menu
	tbContentElement.SetContextMenu(menuStrings, menuStates);
}

function tbContentElement_ContextMenuAction(itemIndex) {
	if (ContextMenu[itemIndex].cmdId == DECMD_INSERTTABLE) {
		InsertTable();
	} else {
		tbContentElement.ExecCommand(ContextMenu[itemIndex].cmdId, OLECMDEXECOPT_DODEFAULT);
	}
}

function tbContentElement_DisplayChanged() {
	var i, s;
	try
	{
		for (i=0; i<QueryStatusToolbarButtons.length; i++) {			
			s = tbContentElement.QueryStatus(QueryStatusToolbarButtons[i].command);			
			if (s == DECMDF_DISABLED || s == DECMDF_NOTSUPPORTED) {
				TBSetState(QueryStatusToolbarButtons[i].element, "gray"); 
			} else if (s == DECMDF_ENABLED  || s == DECMDF_NINCHED) {
				TBSetState(QueryStatusToolbarButtons[i].element, "unchecked"); 
			} else { // DECMDF_LATCHED
				TBSetState(QueryStatusToolbarButtons[i].element, "checked");
			}
		}

		s = tbContentElement.QueryStatus(DECMD_GETFONTNAME);
		if (s == DECMDF_DISABLED || s == DECMDF_NOTSUPPORTED) {
			FontName.disabled = true;
		} else {
			FontName.disabled = false;
			FontName.value = tbContentElement.ExecCommand(DECMD_GETFONTNAME, OLECMDEXECOPT_DODEFAULT);
		}
		if (s == DECMDF_DISABLED || s == DECMDF_NOTSUPPORTED) {
			FontSize.disabled = true;
		} else {
			FontSize.disabled = false;
			FontSize.value = tbContentElement.ExecCommand(DECMD_GETFONTSIZE, OLECMDEXECOPT_DODEFAULT);
		}
	}
	catch (e) 	{}
}

function tbContentElement_DocumentComplete() {
	try {
		tbContentElement.DOM.charset = "utf-8";
	} catch ( e ) {
	}
	if(DHTMLEditCtrlLoadFlag == false) {
		DHTMLEditor = document.tbContentElement.DOM.parentWindow;
		setTimeout("InitEditor()", 0);
		DHTMLEditCtrlLoadFlag = true;
	}
}

function DECMD_SETFORECOLOR_Click() {
	var arr = showModalDialog("http://" + window.document.location.host + "/COVINet/COVIFlowNet/Forms/dhtml/setforeColor.htm", "",
							 "dialogWidth:30em;dialogHeight:35em;resizable:no;center:yes;help:0;status=0");
	if (arr != null) {
		tbContentElement.ExecCommand(DECMD_SETFORECOLOR,OLECMDEXECOPT_DODEFAULT, arr);
	}
}

function DECMD_IMAGE_Click() {	
	var strFilename;
	var strFileFrontFullpath = "";
	var strFileClientFullpath = "";
	var strFolderName = "";
	var szRet = "";	// imageÍ∞Ä ?àÎäî ?ÑÏπò ?ïÎ≥¥(DB=File)	
	var file_backloc;
			
	szRet = window.showModalDialog("http://" + window.document.location.host + "/COVINet/COVIFlowNet/Forms/dhtml/InsertImage_dbmain.aspx?fileloc=" + file_loc + "&prefix=" + prefix,	"", 
				"dialogWidth:333px;dialogHeight:200px;resizable:no;center:yes;help:0;status=0");
	
	if ( szRet != null && szRet != "" ) {
		file_backloc = "/COVINet/Backstorage/e-sign/Approval/ImageAttach/" + szRet.split("|")[3] + "/";
		strFileFrontFullpath = szRet.split("|")[0];
		strFileClientFullpath = szRet.split("|")[1];
		strFilename = szRet.split("|")[2];		
		strFolderName = szRet.split("|")[3];	
			
		insertDictionaryFileInfo(strFilename, strFileFrontFullpath, strFolderName);							
		dicFileInfo.add(strFileClientFullpath, file_backloc + strFilename);
		dicFileInfo2.add(strFileClientFullpath, strFilename);
		//dicFileInfo.add(szRet.split("|")[1], "");
		//szRet = szRet.split("|")[1];
		tbContentElement.ExecCommand(DECMD_IMAGE, OLECMDEXECOPT_DONTPROMPTUSER, strFileClientFullpath);
	}
}

function tbContentElement_HyperLink() {
	var activeElement = tbContentElement.DOM.activeElement.sourceIndex;
	tbContentElement.ExecCommand(DECMD_HYPERLINK,OLECMDEXECOPT_DODEFAULT);
	tbContentElement.DOM.body.innerHTML = tbContentElement.DOM.body.innerHTML;
	
	var range = tbContentElement.DOM.all[activeElement].createTextRange();
	range.collapse(false);
	range.select();
}

function DECMD_Click(cmd) {
	switch (cmd){
		case DECMD_SETFORECOLOR:
			DECMD_SETFORECOLOR_Click() ;
			break;
		case DECMD_IMAGE:
			DECMD_IMAGE_Click() ;
			break;
		case DECMD_HYPERLINK:
			tbContentElement_HyperLink() ;
			break;
		case DECMD_FINDTEXT:
			tbContentElement.ExecCommand(DECMD_FINDTEXT,OLECMDEXECOPT_PROMPTUSER);
			tbContentElement.focus();
			break;
		case DECMD_INSERTTABLE:
			TABLE_INSERTTABLE_Click() ;
			break;
		case DECMD_INSERTROW:
			tbContentElement.ExecCommand(DECMD_INSERTROW,OLECMDEXECOPT_PROMPTUSER);
			tbContentElement.focus();
			break;
		default: 
			tbContentElement.ExecCommand(cmd,OLECMDEXECOPT_DODEFAULT);
			tbContentElement.focus();
			break;
	}
}

function FontName_Change() {
	tbContentElement.ExecCommand(DECMD_SETFONTNAME, OLECMDEXECOPT_DODEFAULT, FontName.value);
	tbContentElement.focus();
}

function FontSize_Change() {
	tbContentElement.ExecCommand(DECMD_SETFONTSIZE, OLECMDEXECOPT_DODEFAULT, parseInt(FontSize.value));
	tbContentElement.focus();
}

function button_toggle() {
	if (document.all("bottom_toolBar").style.display == "none") {
		document.all("bottom_toolBar").style.display = "" ;
	} 
	else {
		document.all("bottom_toolBar").style.display = "none" ;
	}
}

function TABLE_INSERTTABLE_Click() {
	InsertTable();
	tbContentElement.focus();
}
function setTable(val) 
{
	var sel = tbContentElement.document.selection.createRange();
		sel.pasteHTML(val);		
		sel.select();
}
function InsertTable() {
	var pVar = ObjTableInfo;
	var args = new Array();
	var arr = null;

	// Display table information dialog
	args["NumRows"] = ObjTableInfo.NumRows;
	args["NumCols"] = ObjTableInfo.NumCols;
	args["TableAttrs"] = ObjTableInfo.TableAttrs;
	args["CellAttrs"] = ObjTableInfo.CellAttrs;
	args["Caption"] = ObjTableInfo.Caption;

	arr = null;

	arr = showModalDialog("http://" + window.document.location.host + "/COVINet/COVIFlowNet/Forms/dhtml/insertTable.htm",	 args,
						 "dialogWidth:23em;dialogHeight:20em;resizable:no;center:yes;help:0;status=0");
	if (arr != null) {
		// Initialize table object
		for ( elem in arr ) {
			if ("NumRows" == elem && arr["NumRows"] != null) {
				ObjTableInfo.NumRows = arr["NumRows"];
			} else if ("NumCols" == elem && arr["NumCols"] != null) {
				ObjTableInfo.NumCols = arr["NumCols"];
			//} else if ("TableAttrs" == elem) {
			//	ObjTableInfo.TableAttrs = arr["TableAttrs"];
			//} else if ("CellAttrs" == elem) {
			//	ObjTableInfo.CellAttrs = arr["CellAttrs"];
			} else if ("Caption" == elem) {
				ObjTableInfo.Caption = arr["Caption"];
			}
		}
		tbContentElement.ExecCommand(DECMD_INSERTTABLE,OLECMDEXECOPT_DODEFAULT, pVar); 
		//for (i=0;i<tbContentElement.DOM.body.document.all("eTD").length;i++ ){
		//	tbContentElement.DOM.body.document.all("eTD").item(i).innerHTML = tbContentElement.DOM.body.document.all("eTD").item(i).innerHTML + "&nbsp;";
		//}
	}
}
