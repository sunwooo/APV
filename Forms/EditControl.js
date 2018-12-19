// JScript File
//if (!window.ActiveXObject)
//{
//	document.write("<textarea id='tbContentElement' name='tbContentElement' rows='25' cols='100' style='width:100%;height:100%;'></textarea>");
//}
//else
//{
//	PrintTagFreeEditor('tbContentElement', '100%', '100%', '/CoviWeb/SiteReference/editor/env_toolbarALL.xml', '1', '0');
//}

try {
    if (getInfo("editortype")) {
        gz_Editor == getInfo("editortype");
    }
} catch (e) { }
var oXml = CreateXmlDocument();
var oitem;

if (getInfo("editortype") == "3" || (getInfo("editortype") == "4" && !window.ActiveXObject)) {
    tbContentElement = new XFE();
    tbContentElement.setBasePath("/CoviWeb/common/Editor/XFree");
    /* 2014.1.9 LHI 서식보호모드 적용 0:사용자모드(default), 1:관리자모드, 2:서식보호모드 */
    //tbContentElement.setEditMode(2);

    switch (getInfo("uslng")) {
        case "en-US":
            tbContentElement.Language = "eng";
            break;
        case "zh-CN":
            //tbContentElement.Language = "ChineseS";
            tbContentElement.Language = "ChineseT";
            break;
        default:
            //ko-KR
            tbContentElement.Language = "kor";
    }

    tbContentElement.width = "100%";
    //tbContentElement.height = "840px";  //에디터높이 --> formedit.js(5075라인)에서 지정

    tbContentElement.setInitBaseTag("<html><head><title></title></head><body><p></p></body></html>");
    tbContentElement.initialize();

    //본문 내용
    if (getInfo("BODY_CONTEXT") != undefined) {
        oXml.loadXML(getInfo("BODY_CONTEXT"));
        oitem = oXml.selectSingleNode("BODY_CONTEXT/tbContentElement").text;
        tbContentElement.SetHtmlValue(oitem);
    } else {
        if (getInfo("fmbd") != "undefined") {
            try { tbContentElement.SetHtmlValue(getInfo("fmbd")); } catch (e) { }
        }
    }
} else if (getInfo("editortype") == "2" || (getInfo("editortype") == "4" && window.ActiveXObject)) {
    var inifile = '/CoviWeb/SiteReference/editor/env_toolbarALL.xml';
    try {//debugger;
        switch (getInfo("uslng")) {
            case "en-US": inifile = "/CoviWeb/common/resource/env-eng.xml"; break;
            case "ja-JP": inifile = "/CoviWeb/common/resource/env-jap.xml"; break;
            case "zh-cn":
            case "zh-CN": inifile = "/CoviWeb/common/resource/env-ChaS.xml"; break;
        }
    } catch (e) { }
    PrintTagFreeEditor('tbContentElement', '100%', '362px', inifile, '1', '0');
} else if (getInfo("editortype") == "6" || (getInfo("editortype") == "7" && !window.ActiveXObject)) {
    var tbContentElement = new NamoSE("tbContentElement");
    tbContentElement.editorStart();
} else if (getInfo("editortype") == "5" || (getInfo("editortype") == "7" && window.ActiveXObject)) {
    //        document.onreadystatechange = function() {
    //            if (document.readyState == 'complete') {
    //                if (document.all['divShowInstall'])
    //                    document.all['divShowInstall'].style.visibility = 'hidden';
    //                //document.getElementById("tbContentElement").RestoreState("Wec");
    //                //document.getElementById("tbContentElement").SaveState("Wec");
    //                document.getElementById("tbContentElement").DoCommandEx("fontlist", "굴림");
    //                document.getElementById("tbContentElement").DoCommandEx("fontsizelist", "12");
    //                //document.getElementById("tbContentElement").ShowToolbar(0, 0);
    //                //document.getElementById("tbContentElement").ShowToolbar(1, 1);
    //                //document.getElementById("tbContentElement").ShowToolbar(2, 1);

    //            }
    //        }
   // var namouserlang = "kor";
    var namouserlang = "ko-kr";
    var nameuserlang02 = "ko-KR";
    try {
        switch (getInfo("uslng")) {
            case "en-US": namouserlang = "enu"; break;
            case "ja-JP": namouserlang = "jpn"; break;
            case "zh-CN": namouserlang = "chs"; break;
        }
        nameuserlang02 = getInfo("uslng");
    } catch (e) { }

    var strScripts = "";
    var strHeight = "450px";
    var sEditorToolBarType = "0";
    var env = "/CoviWeb/common/Editor/NamoActiveSquare/";
    switch (sEditorToolBarType) {
        case "0":
            env += "env_TypeA"; // 모든 툴바 표시
            break;
        case "1":
            env += "env_Type1"; // 2번째 툴바 표시
            break;
        case "2":
            env += "env_Type2"; // 1번째 툴바 표시
            break;
    }
    env += ".xml";
    strScripts += "<DIV id='divShowInstall' width='100%' height='100%' style='BORDER-RIGHT: 0px; BORDER-TOP: 0px; Z-INDEX: 0; BORDER-LEFT: 0px; BORDER-BOTTOM: 0px; POSITION: absolute'>";
    strScripts += "</Div>";
    strScripts += "<OBJECT ID='tbContentElement' CLASSID='CLSID:51B791C6-FB86-42DA-AA1B-23982BF08545' WIDTH='100%' HEIGHT='" + strHeight + "%' CodeBase='/coviweb/common/editor/NamoActivesquare/NamoWec.cab#Version=7,0,1,9'>";
    strScripts += "<PARAM NAME='UserLang' VALUE='" + namouserlang + "'>";
    strScripts += "<PARAM NAME='InitFileURL' VALUE='" + env + "'>";
    strScripts += "<PARAM NAME='InitFileVer' VALUE='1.3'>";
    strScripts += "<PARAM NAME='InitFileWaitTime' VALUE='3000'>";
    //strScripts += "<PARAM NAME='InstallSourceURL' VALUE='http://help.namo.co.kr/activesquare/techlist/help/AS7_update'>";
    strScripts += "</OBJECT>";
    document.write(strScripts);
} else if (getInfo("editortype") == "0") {
    document.write("<textarea id='tbContentElement' name='tbContentElement' rows='25' cols='100' style='width:100%;height:100%;'></textarea>");
} else if (getInfo("editortype") == "8") {//dext5 add
    var namouserlang = "ko-kr";
    var nameuserlang02 = "ko-KR";
    try {
        switch (getInfo("uslng")) {
            case "en-US": namouserlang = "en-us"; break;
            case "ja-JP": namouserlang = "ja-JP"; break;
            case "zh-CN": namouserlang = "zh-CN"; break;
        }
        nameuserlang02 = getInfo("uslng");
    } catch (e) { }
    //PrintDEXT5Editor('dext5editor1', '100% ', '650px', 'edit', 'ko-kr');
    PrintDEXT5Editor('dext5editor1', '100% ', '650px', 'edit', namouserlang);
}
function OnInitCompleted() {
    if (getInfo("editortype") == "8") {
        if(gBodyContext1 != "" && gBodyContext1 != "undefined") {
            void_Editor_SetContent();
        }
    } else {

        if (getInfo("BODY_CONTEXT") != undefined) {     //기안,임시저장으로 저장된 값 setting
            
            setBodyContext(getInfo("BODY_CONTEXT"));
            
        try { G_displaySpnDocLinkInfo(); } catch (e) { }
    } else {//양식 생성 시 입력한 본문내역 조회
        if (getInfo("fmbd") != "undefined") {
            tbContentElement.SetBodyValue(getInfo("fmbd")); // 컨텐츠 내용 에디터 삽입
        }
        }
    }
} 
function void_Editor_GetContent() {
    //debugger;
    document.getElementById("dhtml_body").value = DEXT5.getBodyValue();
}

function void_Editor_SetContent() {

    if (getInfo("BODY_CONTEXT") != undefined) {     //기안,임시저장으로 저장된 값 setting
        DEXT5.setHtmlContentsEw(getInfo("BODY_CONTEXT"), "dext5editor1");

    } else {
        if (getInfo("fmbd") != "undefined") {
            DEXT5.setHtmlContentsEw(getInfo("fmbd"), "dext5editor1");
        }
    }
}
//양식 데이터 가져오기
function dextgetContent() {
    if (getInfo("BODY_CONTEXT") != undefined) {
         //document.write("<LINK rel=stylesheet href='http://gw.isu.co.kr/GWImages/common/TagFree/tagfree.css'>");
        
        setBodyContext(getInfo("BODY_CONTEXT"));
    } else {
        DEXT5.setHtmlContentsEw(getInfo("fmbd").replace("euc-kr", "utf-8"), "dext5editor1");
    }
}
//양식데이터 dhtml_body에 저장하기
function dextgetHtmlValueEx() {
    document.getElementById("dhtml_body").value = DEXT5.getHtmlValueEx();
}
//양식 데이터 설정하기
function dextSetHtmlContentsEw(nodeVal) {

    DEXT5.setHtmlContentsEw(nodeVal, "dext5editor1");
}
