
var m_xmlHTTP=CreateXmlHttpRequest();
var m_objXML=CreateXmlDocument();
var g_szAcceptLang="ko";
var L_idsSearcing_Text="Loading......";
var L_idsUnknownError_Text="Unknown Error";
var g_eGalTable;
var g_eErrorDiv;
var pXML;
var aXML;
var sXML ;
var strXSLFile;
var bReadOnly = false;
var connectionname = "";
var bState = "";
var m_xmlXSL = "";        

window.onload= initOnload;
function initOnload() {
    g_eErrorDiv = document.getElementById("divErrorMessage");
    clearContents(); 
    if (type != "file" && type!="") {
        getXSL();
	}
    queryGetData();
}
function getXSL(){	
	var szURL = "";
	bState = "XSL";
	
	switch(type)
	{
	    case "receipt":
	        szURL = "ReceiptListXSL.aspx";
	        break;	    
	    case "read":
	        szURL = "ReadListXSL.aspx";	        
	        break;
	}
	
	requestHTTP("GET",szURL,false, "text/xml", null, null);
    receiveHTTPXSL();
}
function clearContents(){
    g_eErrorDiv.innerText = "";
    g_eErrorDiv.style.display = "none";
    //divGalTable.style.display = "block";
    document.getElementById("divGalTable").style.display = "block";
}
function queryGetData(){
	switch(type)
	{
	    case "file":
	        pXML = "dbo.usp_form_attachfileinfo";
	        aXML+="<param><name>fmpf</name><type>varchar</type><length>30</length><value><![CDATA["+fmpf+"]]></value></param>";
		    aXML+="<param><name>revision</name><type>varchar</type><length>10</length><value><![CDATA["+fmrv+"]]></value></param>";
		    aXML+="<param><name>fiid</name><type>char</type><length>34</length><value><![CDATA["+fiid+"]]></value></param>";
		    //archive =="true" ? connectionname = "FORM_INST_ARCHIVE_ConnectionString" :connectionname = "FORM_INST_ConnectionString" ; //Archive DB 연결여부 판단
		    connectionname = "FORM_INST_ConnectionString";    
	        break;
	    case "receipt":
	        pXML = "dbo.usp_wf_receivelist";
	        aXML+="<param><name>piid</name><type>varchar</type><length>34</length><value><![CDATA["+piid+"]]></value></param>";
	        aXML+="<param><name>fiid</name><type>varchar</type><length>34</length><value><![CDATA["+"0"+"]]></value></param>";
	        aXML+="<param><name>reply</name><type>varchar</type><length>34</length><value><![CDATA["+"0"+"]]></value></param>";
	        aXML+="<param><name>LANGUAGE</name><type>varchar</type><length>34</length><value><![CDATA["+uslng+"]]></value></param>";
	        connectionname = "INST_ConnectionString";
	        strXSLFile = "ReceiptListXSL.aspx";
	        break;
	    case "read":
	        pXML = "dbo.usp_WF_ApvRead_Select_List";
	        aXML+="<param><name>piid</name><type>varchar</type><length>34</length><value><![CDATA["+piid+"]]></value></param>";
	        connectionname = "INST_ConnectionString";
	        strXSLFile = "ReadListXSL.aspx";
	        break;
	}
	
	if(pXML != null){
	    sXML = "<Items><connectionname>"+connectionname+"</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
    	
	    var szURL = "../getXMLQuery.aspx";
        doProgressIndicator(true);
        requestHTTP("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTP, sXML);
    }
}
function receiveHTTPXSL() {
   if (m_xmlHTTP.status == 200) {
       m_xmlXSL = m_xmlHTTP.responseText;
   }
} 

function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
    m_xmlHTTP.open(sMethod,sUrl,bAsync);
   
    m_xmlHTTP.setRequestHeader("Content-type", sCType);
    if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
    (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
}

function receiveHTTP(){
    if(m_xmlHTTP.readyState==4){    
        m_xmlHTTP.onreadystatechange=event_noop;
        var xmlReturn=m_xmlHTTP.responseXML;
        //if(xmlReturn.xml==""){
        if(m_xmlHTTP.responseText.charAt(0)=='\r')
        {
	        alert(m_xmlHTTP.responseText);
        }else{
                if(type != "file")
                { 
                     refreshList(m_xmlHTTP.responseXML);
                    /*
                    if (bState == "XSL")
                    {
                        var parser = new DOMParser();
                       
                        m_objXML = parser.parseFromString(m_xmlHTTP.responseText, "text/xml");
                        queryGetData();                                       
                        bState = "";
                    }else{
                        var errorNode=xmlReturn.selectSingleNode("response/error");
                        if(errorNode!=null){
                            alert("Desc: " + errorNode.text);
                        }
                        else{                               
                            if (window.ActiveXObject)
                            {
                                var m_oXSLProcessor;
                               
                                m_oXSLProcessor = makeProcessor(strXSLFile);
                                m_oXSLProcessor.input = xmlReturn;
                                m_oXSLProcessor.transform();
                                document.getElementById("divGalTable").innerHTML = m_oXSLProcessor.output;
                            }else{
                                document.getElementById("divGalTable").innerHTML = xmlReturn.transformNode(m_objXML);                                    
                            }
                        }
                    }
                    */
                }	
                else
                {    
                    var user_name;
                    var dept_name;
                    var re = "/_N_/g";
    	            
                    var sCommentHtml ;
                    
                    sCommentHtml='<table width="100%" border="0" cellspacing="0" cellpadding="0">';
                    sCommentHtml +='<tr><td height="2" colspan="4" class="BTable_bg01"></td></tr>';
                    sCommentHtml +='<tr class="BTable_bg02" style="height:25px"><th style="padding-left:10px;text-align:left;" width="10%" height="20">'+strNum+'</th>';
                    sCommentHtml +='<th style="padding-left:10px;text-align:left;" width="50%" height="20">'+strFileName+'</th>';
                    sCommentHtml +='<th style="padding-left:10px;text-align:left;" width="20%" height="20">'+strUserName+'</th>';
                    sCommentHtml +='<th style="padding-left:10px;text-align:left;" width="20%" height="20">'+strDeptName+'</th></tr>';
                    sCommentHtml +='<tr><td height="1" colspan="4" class="BTable_bg03"></td></tr>';                       
    	            
                    var elmlist = xmlReturn.selectNodes("response/NewDataSet/Table");
                    var elmAttFiles = xmlReturn.selectNodes("response/NewDataSet/Table/fileinfos");
                    var elm;
    	            
                    //if(elmlist.context.text != "")//if(elmlist.length >0)
                    if(xmlReturn.xml.indexOf("fileinfos") > 0)
                    {
                        for(var i=0 ; i < elmlist.length ; i++){
                            elm = elmlist.nextNode();	
                            var attFiles = elm.text;
                            var fState="";
			                        var m_oFileList = CreateXmlDocument();
			                        m_oFileList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+attFiles);
			                        var nelmRoot, nelmList, nelm, nelmTaskInfo;
			                        nelmRoot = m_oFileList.documentElement;
			                        if (nelmRoot != null){
				                        nelmList = nelmRoot.selectNodes("fileinfo/file");			
				                        szAttFileInfo = "";
				                        for (var i=0; i<nelmList.length;i++) {
					                        nelm = nelmList.nextNode();
					                        displayFileName = nelm.getAttribute("name").substring(0, nelm.getAttribute("name").lastIndexOf(".")) ;
					                        displayFileName = displayFileName.replace(re,"&");
    							            
					                        user_name = nelm.getAttribute("user_name") == null?"":nelm.getAttribute("user_name");
					                        dept_name = nelm.getAttribute("dept_name") == null?"":nelm.getAttribute("dept_name");
            	
                                            if (nelm.getAttribute("location").indexOf(".") > -1 ){
                                                if (bReadOnly){
                                                    szAttFileInfo = displayFileName;
                                                }
                                                else{
                                                    if(fState==""||fState=="OLD"||fState=="NEW"){
                                                         szAttFileInfo = "<a href=\""+nelm.getAttribute("location").replace("+","%2B")+  "\" target = \"_blank\" >" + nelm.getAttribute("name") + "</a>";
                                                    }	
                                                }						
                                            }
                                            else{
                                                szAttFileInfo = "<a href=\""+m_KMWebAttURL+nelm.getAttribute("location")+ "\" target = \"_blank\" >" + nelm.getAttribute("name") + "</a>"; //TARGET=\"_blank\"
                                            }
    							      
					                        sCommentHtml +='<tr  ';
					                        sCommentHtml +=" fileurl=\"" +  nelm.getAttribute("location") + ':'+ nelm.getAttribute("size") + "\" > "
					                        sCommentHtml +='<td class="BTable_bg08" style="padding-left:10px;text-align:left;">'+(i+1)+'</td>';
					                        if (window.ActiveXObject){
					                            sCommentHtml += '<td class="BTable_bg08" onclick=\'javascript:PopListSingle(event);\' style=\'cursor:pointer;\' >'+getAttachImage(nelm.getAttribute("name").substring(nelm.getAttribute("name").lastIndexOf('.') + 1, nelm.getAttribute("name").length)) +'&nbsp;'+ nelm.getAttribute("name")+'</td>';//
					                        }else{
					                            sCommentHtml += '<td class="BTable_bg08" style=\'cursor:pointer;\' >'+getAttachImage(nelm.getAttribute("name").substring(nelm.getAttribute("name").lastIndexOf('.') + 1, nelm.getAttribute("name").length)) +'&nbsp;'+ szAttFileInfo+'</td>';//
					                        }
					                        sCommentHtml += '<td class="BTable_bg08">'+getLngLabel(user_name,false,"^")+'&nbsp;</td>';
					                        sCommentHtml += '<td class="BTable_bg08">'+getLngLabel(dept_name,false,"^")+'&nbsp;</td>';
                                            sCommentHtml +='</tr>';     								            
					                        //sCommentHtml +='<tr><td height="10px"  colspan="4" align="center" ></td></tr>';
			                              }//end for	
    				                  
			                            sCommentHtml +='</table>';
		                          }//end if
	                        }//end for
	                    }
	                    else
	                    {
	                        sCommentHtml +='<tr><td height="10px"  colspan="4" align="center" ></td></tr>';
	                        sCommentHtml +='<tr>';
				            sCommentHtml +='<td colspan="4" align="center">'+strMessageNoData+'</td>';
				            sCommentHtml +='</tr>';
				            sCommentHtml +='</table>';
	                    }
    			        
	                    document.getElementById("divGalTable").innerHTML = sCommentHtml;
                }//end else	        
           
                doProgressIndicator(false);
	        }
      }
}
function refreshList(oDOM){
    var sXML = "<Items><xml><![CDATA[" + oDOM.xml.replace(/<!\[CDATA\[/gi, "@CDATASTART").replace(/\]\]>/gi, "@CDATAEND") + "]]></xml><xslxml><![CDATA[" + m_xmlXSL + "]]></xslxml><param><name>lngindex</name><value><![CDATA[" + gLngIdx + "]]></value></param></Items>";
    var szURL = "../getXMLXslParsing.aspx";
    requestHTTP("POST", szURL, false, "text/xml; charset=utf-8", null, sXML);
    receiveHTTPXSLXML();
}
function receiveHTTPXSLXML() {
    if (m_xmlHTTP.readyState == 4) {
        m_xmlHTTP.onreadystatechange = event_noop;
        var xmlReturn = m_xmlHTTP.responseXML;
        //if(xmlReturn.xml==""){
        if (m_xmlHTTP.responseText.charAt(0) == '\r') {
            alert(m_xmlHTTP.responseText);
        }
        else {
            document.getElementById("divGalTable").innerHTML = xmlReturn.documentElement.xml;
        }
    }
}


function makeProcessor(urlXsl){
    if (window.ActiveXObject) {
        var oXslDom = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
        oXslDom.async = false;
        if(!oXslDom.load(urlXsl)){
	        alertParseError(oXslDom.parseError);
	        throw new Error(-1,"couldn't make TemplateProcessor with ["+urlXsl+"].");
        }
        var oXSLTemplate = new ActiveXObject("MSXML2.XSLTemplate");
        oXSLTemplate.stylesheet = oXslDom;
        return oXSLTemplate.createProcessor();
    }else{
          var oXSL = "";
          var oXslDom = CreateXmlDocument();
//        if (urlXsl.indexOf(".xsl") > -1){
//            oXslDom.async = false;
//            oXslDom.load(urlXsl);
//        }else{
            var oXMLHttp =  CreateXmlHttpRequest();
	        oXMLHttp.open("GET",urlXsl,false);
	        oXMLHttp.send();
	        //시간 늘리기
	        delay(600);
	        if ( oXMLHttp.status == 200){
		       var parser = new DOMParser();
               oXslDom = parser.parseFromString(oXMLHttp.responseText,"text/xml");
               //oXSL = oXMLHttp.responseText.substring(38,oXMLHttp.responseText.length) ;
	        }
//        }
        var oProcessor = new XSLTProcessor();
        oProcessor.importStylesheet(oXslDom);
        return oProcessor;
          //return oXMLHttp.responseText.replace("<![CDATA[", "&lt;![CDATA[").replace("]]>", "]]&gt;").replace('(iVal<10?"0"+iVal:iVal)','(iVal&lt;!10?"0"+iVal:iVal)').replace('for(var i=0; i < aDotCount.length-1; i++){','for(var i=0; i &lt;! aDotCount.length-1; i++){').replace('"<br>"','"&lt;!br&gt;"').replace('"<font color=\'white\'>-</font>"','"&lt;!font color=\'white\'&gt;-&lt;!/font&gt;"');
       // return oXMLHttp.responseText.replace("<![CDATA[", "@CDATASTART").replace("]]>", "@CDATAEND");
    }
}

function delay(gap){/*gap is in milisecs*/
	var then, now;
	then = new Date().getTime();
	now=then;
	while((now-then)<gap)
	{
		now = new Date().getTime();
	}
}

function processXml(){	        
    window.totalpage.innerHTML= page + "/" +m_objXML.selectSingleNode("response/totalpage").text;	
    g_totalcount = m_objXML.selectSingleNode("response/totalcount").text; 	
    g_pagecount=Math.ceil(g_totalcount/pagecnt);	
    g_totalpage = m_objXML.selectSingleNode("response/totalpage").text;        	
		
    // 리스트에 뿌려줄 때에 Apostrophe 처리부분 : 07. 7. 19. JSI
    var Nodes_Subject = m_objXML.selectNodes("response/workitem");
    if (Nodes_Subject.length > 0) {
        for (var i = 0; i < Nodes_Subject.length; i++) {
            var Subject_Replace = Nodes_Subject.item(i).selectSingleNode("title").text.replace(/&apos;/g, "'");
            Nodes_Subject.item(i).selectSingleNode("title").text = Subject_Replace;
        }
    }        	

    //2003.03.27 황선희 수정
    processXmlData(m_objXML);
    doProgressIndicator(false); 

}

function doProgressIndicator(fDisplay){
    if (fDisplay){
        addMessage(L_idsSearcing_Text);
    }
    else{
        g_eErrorDiv.style.display = "none";
        document.getElementById("divGalTable").style.display = "block";
    }
}

function addMessage(szMsg){
    var re = /항목을 찾을 수 없습니다./i;
   
    if(szMsg.search(re)!=-1) szMsg = "Could not find the matching item.";
    g_eErrorDiv.innerText = szMsg;
    g_eErrorDiv.style.display = "block";
    document.getElementById("divGalTable").style.display = "none";
}

function event_noop(){return(false);} 

function displayZero(fDisplay){
    if (fDisplay){
        g_eErrorDiv.innerText = "There is no result.";
        g_eErrorDiv.style.display = "block";
        document.getElementById("divGalTable").style.display = "none";
    }
    else{
        g_eErrorDiv.style.display = "none";
        document.getElementById("divGalTable").style.display = "block";
    }
}

var m_selectedRow=null;
var m_selectedRowId=null;
function switchSelectedRow(oRow){
	    
    while(oRow!=null&&oRow.tagName!="TR"){
	    oRow=oRow.parentNode;
    }
    if(oRow!=null){
	    
	    if(m_selectedRow!=null)m_selectedRow.style.backgroundColor="#FFFFFF";
	    oRow.style.backgroundColor="#EEF7F9";

	    m_selectedRow=oRow;
	    m_selectedRowId=oRow.id;
    }
}
function clearSelection(){
    m_selectedRow=null;
    m_selectedRowId=null;
}

//첨부경로이미지 
function getAttachImage(image)
{
    if (image == "alz" || image == "asf" || image == "asp" || image == "avi" || 
        image == "bmp" || image == "cab" || image == "css" || image == "csv" || 
        image == "dll" || image == "doc" || image == "exe" || image == "gif" || 
        image == "zip" || image == "doc" || image == "ppt" || image == "dll" || 
        image == "htm" || image == "html" || image == "inf" || image == "iso" || 
        image == "jpg" || image == "js" || image == "lzh" || image == "mid" ||  
        image == "mp3" || image == "mpeg" || image == "mpg" || image == "pdf" || 
        image == "rar" || image == "reg" || image == "sys" || image == "txt" || 
        image == "htm" || image == "html" || image == "inf" || image == "iso" || 
        image == "vbs" || image == "wav" || image == "wma" || image == "wmv" || 
        image == "xls" || image == "xml" || image == "xsl" || image == "zip" || 
        image == "xlsx" || image == "docx" || image == "pptx" || image == "hwp")
    {
        var imageurl = "<img src='/GWImages/Common/attachicon/" + image + ".gif' style='vertical-align:middle;' />" ;
    }
    else
    {
         var imageurl = "<img src='/GWImages/Common/attachicon/icon-doc.gif' style='vertical-align:middle;' />" ;
    }
    return imageurl;
}
//첨부파일 다운로드
var g_eCurrentRow;
function getRowAttribute(elm,sName){var v=elm.getAttribute(sName);return (v==null?"":v);}
function PopListSingle(e){
    var SingleDownLoadString = '';
    var evt=(window.event)?window.event: e;
    el = (evt.srcElement)?evt.srcElement:evt.target;
     
    if (el.parentNode.parentNode.tagName != "THEAD" && el.parentNode.parentNode.tagName != "TABLE" ){
        if (g_eCurrentRow != null){
        }
        eTR = el.parentNode;
        while(eTR.tagName != "TR"){
            eTR = eTR.parentNode;
        }
        g_eCurrentRow = eTR;
        SingleDownLoadString = getRowAttribute(g_eCurrentRow,"fileurl")
    }    
    if (SingleDownLoadString != ""){        
        download.location.href ='/CoviWeb/SiteReference/Common/covi_fileSingledown.aspx?filepath=' + toUTF8(SingleDownLoadString) ;
     }
}
function toUTF8(szInput){
	var wch,x,uch="",szRet="";
	for (x=0; x<szInput.length; x++) {
		wch=szInput.charCodeAt(x);
		if(!(wch & 0xFF80)) {
			szRet += "%" + wch.toString(16);
		}
		else if(!(wch & 0xF000)) {
			uch = "%" + (wch>>6 | 0xC0).toString(16) +
				  "%" + (wch & 0x3F | 0x80).toString(16);
			szRet += uch;
		}
		else {
			uch = "%" + (wch >> 12 | 0xE0).toString(16) +
				  "%" + (((wch >> 6) & 0x3F) | 0x80).toString(16) +
				  "%" + (wch & 0x3F | 0x80).toString(16);
			szRet += uch;
		}
	}
	return(szRet);
}
