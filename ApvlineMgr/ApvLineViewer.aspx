<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApvLineViewer.aspx.cs" Inherits="COVIFlowNet_ApvlineMgr_ApvLineViewer" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
<title></title>
<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>
</head>
<body>
	<input type="hidden" id="chk" name="chk" />
	<div id="trButton" name="trButton" class="popup_title" style="display:none;">
		<div class="title_tl">
			<div class="title_tr">
				<div class="title_tc">
					<h2><%=Resources.Approval.lbl_viewAL%></h2>
				</div>
			</div>
		</div>
	</div>
	<div class="iframe_border" id="tblapvinfo" name="tblapvinfo" style="overflow:auto;">
        <table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0" >
            <tr>
                <td id="Apvlist"  valign="top" height="100%">
                    <!--<iframe id="Iframe1" width="100%" height="100%" frameborder="0" src="Apvlist.htm" ></iframe>-->
                </td>
            </tr>
        </table>
    </div>
	<!-- 참조 정보 시작 -->
	<div id="divccinfomain" name="divccinfomain" style="display:;">
		<!-- 타이틀 & 버튼 div 시작 -->
		<div class="popup_right">  
		<div class="title" >
		<div class="text">
		  <h3><%= Resources.Approval.lbl_cclisttitle %></h3>
		</div>
		</div>
		<div class="Btn" style="display:none;">
		  <ul>
			<li><a href="#" class="Btn05" id="btDeleteCC" name="cbBTN" onClick="doButtonAction(this);"><span><%= Resources.Approval.btn_delete  %></span></a></li>
		  </ul>
		</div>
		</div>
		<!-- 타이틀 & 버튼 div 끝 -->
		<!-- 컬러 라인 시작 -->
		<div class="popup_line BTable_bg01"></div>
		<!-- 컬러 라인 끝 -->
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td id="tdccinfo" name="tdccinfo" valign="top">
					<div id="divccinfo" name="divccinfo" class="iframe_border" style="OVERFLOW:auto;HEIGHT:100%">					    
						<table width="100%" id="tblccinfo" name="tblccinfo" border="0" cellspacing="0" cellpadding="0" class="BTable">
							<tr class="BTable_bg02" style="height:25px">
								<th style=" padding-left:10px"><%= Resources.Approval.lbl_username %></th>
								<th><%= Resources.Approval.lbl_jobposition %></th>
								<th><%= Resources.Approval.lbl_jobtitle %></th>
								<th><%= Resources.Approval.lbl_kind %></th>
								<th><%= Resources.Approval.lbl_dept %></th>
							</tr>
							<tr>
								<td height="1" colspan="6" class="BTable_bg03"></td>
							</tr>
							<tr>
							    <td height="1" colspan="6" class="BTable_bg03"></td>
							</tr>
							<tr>
							    <td height="2" colspan="6" class="BTable_bg04"></td>
							</tr>
						</table>
					</div>
				</td>
			</tr>
		</table>
	</div>
	<!-- 참조 정보 끝 -->  	
	<div id="divpopbtn" name="divpopbtn" class="popup_Btn small" style="display:none; text-align: right; padding-right: 20px;">
	  <table border="0" cellspacing="0" cellpadding="0">
		<tr>
		  <!--<td><a href="#" class="Btn04"><span>저장</span></a></td>-->
		  <td><a class="Btn04" href="#" id="btExit" onclick="window.close()" ><span><%= Resources.Approval.btn_close%></span></a></td>
		</tr>
	  </table>
	</div>
	<script language="javascript" type="text/javascript">
        //결재자 선택 관련 종료
        function overM(e){	    
        
	        var teTR = window.event ? event.srcElement : e.target;
	        while(teTR.tagName != "TR") {
		        //teTR = teTR.parentElement;
		        teTR = teTR.parentNode;
	        }
	        teTR.style.backgroundColor = "#EEF7F9";
	        return true;
        }

        function outM(e){
	        //var teTR = event.srcElement;
	        var teTR = window.event ? event.srcElement : e.target;
	        
	        while(teTR.tagName != "TR") {
		        //teTR = teTR.parentElement;
		        teTR = teTR.parentNode;
	        }
	        teTR.style.backgroundColor = "#FFFFFF";
	        return true;
        }
        function selectCCRow(id){
	        var oRow;
	        //if(id==null){
		        oRow=event.srcElement;
	        //}else{
	        //	oRow=document.all[id];
	        //}
	        if(oRow!=null){
		        switchSelectedRow(oRow);
	        }else{
		        m_selectedCCRow=null;
		        m_selectedCCRowId=null;
	        }

        }
        function switchSelectedRow(oRow){
	        while(oRow!=null&&oRow.tagName!="TR"){
		        oRow=oRow.parentNode;
	        }
	        if(oRow!=null){
		        if(m_selectedCCRow!=null)m_selectedCCRow.style.backgroundColor="#FFFFFF";
		        oRow.style.backgroundColor="#EEF7F9";
		        m_selectedCCRow=oRow;
		        m_selectedCCRowId=oRow.id;
	        }
        }
        function getSelectedRow(){return m_selectedCCRow;}

        //결재선 관리 
        var m_oApvList;
        var m_oCCList;
        var m_sApvMode;
        var m_oXSLProcessor;
        var m_oHTMLProcessor;
        var m_oInfoSrc;
        var m_oFormMenu;
        var m_oFormEditor;
        var m_xmlHTTP = CreateXmlHttpRequest();
        var m_xmlHTTPXSL = CreateXmlHttpRequest();
        var m_oCurrentOUNode;
        var m_bCC;
        var l_bGroup;//그룹참조여부
        var m_sNAuthTL1 = '000'; //보직없음
        var m_sNAuthTL2 = '31'; 
        var m_modeless = null;

		var strlable_send = "<%=Resources.Approval.lbl_send %>";
		var strlable_global = "<%=Resources.Approval.lbl_global %>";
		var strlable_receive = "<%=Resources.Approval.lbl_receive %>";

		var gLngIdx = <%=strLangIndex %>;

        function initialize(){    
                 
	        m_oInfoSrc = top.opener;	
	        if(m_oInfoSrc==null){
		        m_oInfoSrc = parent.monitorList;
		        if(m_oInfoSrc==null){
		            try{
		            if(parent.location.href.toUpperCase().indexOf("LISTITEMSAPPROVELINE.ASPX") > 0){m_oInfoSrc = parent;}
		            else if(parent.location.href.toUpperCase().indexOf("LISTITEMS.ASPX") > 0){m_oInfoSrc = parent;}
			        else if(parent.parent.location.href.toUpperCase().indexOf("LISTITEMS.ASPX") > 0) {m_oInfoSrc = parent.parent;}
			        else if(parent.iworklist.location.href.toUpperCase().indexOf("LISTITEMS.ASPX") > 0) {m_oInfoSrc = parent.iworklist;}
			        else{m_oInfoSrc = parent.iworklist.ifrDL;}
			        }catch(e){}
		        }
		        m_sApvMode = getInfo("mode");
		        if(m_sApvMode=="READ"){
					document.getElementById("trButton").style.display="none"; 
					//document.body.style.overflow = "hidden";
				}else{
					document.getElementById("trButton").style.display = "";
					document.getElementById("divpopbtn").style.display = "";
				}
            }else{
                if (top.opener.g_dicFormInfo!=null){	
			        //m_sApvMode --> APVLINE
			        m_sApvMode = getInfo("mode");		    
		        }else{
			        m_oInfoSrc = top.opener.parent;
			        m_sApvMode = getInfo("mode");
		        }
//	        	m_oFormMenu = m_oInfoSrc.menu;
//	            m_oFormEditor = m_oInfoSrc.editor;


	        }
	        m_oFormMenu = m_oInfoSrc.document.getElementById("menu");
	        m_oFormEditor = m_oInfoSrc.document.getElementById("editor");
    		
	        try{
		        //m_oXSLProcessor = makeProcessor("ApvlineGen.xsl");
		        m_oHTMLProcessor = makeProcessorScript("ApvlineDisplay_xsl.aspx");			
	        }catch(e){alert(e.description);return false;}

	        m_oApvList = CreateXmlDocument();
	        m_oCCList = CreateXmlDocument();
	        m_oCCList.loadXML("<?xml version='1.0' encoding='utf-8'?><cc/>");
    		   
	        //if(!m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+m_oFormMenu.APVLIST.value)){
	        if(!m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+ Get_choiseIdOrName("APVLIST"))){
		        alertParseError(m_oApvList.parseError);			
	        }else{		
		        initiateCC();
		        refreshList();
		        refreshCC(true);
	        }		
	        return true;
        }
        
        function Get_choiseIdOrName(IdName)
        {
            var tmpValue = "";
            if(m_oFormMenu.contentWindow){
                tmpValue = m_oFormMenu.contentWindow.document.getElementsByName(IdName)[0].value;
            }
            else{
                tmpValue = m_oFormMenu.children.item(IdName).value;
            }
            return tmpValue;
        }
        
        function Set_choiseIdOrName(IdName, data)
        {            
            if(m_oFormMenu.contentWindow){
                m_oFormMenu.contentWindow.document.getElementsByName(IdName)[0].value = data;
            }
            else{
                m_oFormMenu.children.item(IdName).value = data;
            }         
        }
        
        function initiateCC(){	
	        var ccList = m_oApvList.selectNodes("steps/ccinfo");
    		
	        if(ccList.length>0){
		        var elm = ccList.nextNode();
		        while(elm!=null){
			        m_oCCList.documentElement.appendChild(elm.cloneNode(true));
			        elm = ccList.nextNode();
		        }
	        }
        }

        function initServerValues(){	
	        if(m_xmlHTTP.readyState==4){	
    			
		        m_xmlHTTP.onreadystatechange=event_noop;
		        if(m_xmlHTTP.responseText.charAt(0)=="\r"){
			    			
		        }else{			
			        var errorNode=m_xmlHTTP.responseXML.selectSingleNode("error");
			        if(errorNode!=null){
				        alert("Error at initServerValues in ApvLineViewer.aspx\nError Desc:" + errorNode.text);
			        }else{			
			       	     
				        //m_oFormMenu.APVLIST.value = m_xmlHTTP.responseXML.xml;
				        Set_choiseIdOrName("APVLIST", m_xmlHTTP.responseXML.xml);
				        
				        m_oApvList.loadXML(m_xmlHTTP.responseXML.xml);
				        initiateCC();
				        refreshList();
				        refreshCC(true);
			        }
		        }
	        }
        }
        function event_noop(){return(false);}
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
        function makeProcessorScript(urlXsl){
          var oXSL = "";
          var oXslDom = CreateXmlDocument();
            var oXMLHttp =  CreateXmlHttpRequest();
            oXMLHttp.open("GET",urlXsl,false);
            oXMLHttp.send();
            //시간 늘리기
            //delay(600);
            if ( oXMLHttp.status == 200){
               oXSL = oXMLHttp.responseText;
            }
            return oXSL;
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
        function getInfo(sKey){try{return m_oInfoSrc.g_dicFormInfo.item(sKey);}catch(e){alert("<%=Resources.Approval.msg_060 %> :"+sKey);}}
        function alertParseError(err){
	        alert("<%=Resources.Approval.msg_060 %>"+"in ApvLineViewer.aspx\ndesc:"+err.reason+"\nsrcurl:"+err.url+"\nsrctxt:"+err.srcText+"\nline:"+err.line+"\tcolumn:"+err.linepos);
        }
        function refreshList(selectedRowId){        
	        try {
	            var aXML = "";
	            var sXML = "";
	            
	            aXML = "<param><name>viewtype</name><value><![CDATA[read]]></value></param>";
	            aXML += "<param><name>lngindex</name><value><![CDATA["+"<%=strLangIndex %>"+"]]></value></param>";
	            sXML = "<Items><xml><![CDATA[" + m_oApvList.xml.replace(/<!\[CDATA\[/gi, "@CDATASTART").replace(/\]\]>/gi, "@CDATAEND") +"]]></xml><xslxml><![CDATA[" + m_oHTMLProcessor + "]]></xslxml>"+aXML+"</Items>" ;
	           
                var szURL = "../getXMLXslParsing.aspx";
                requestHTTPXSL("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTPXSL, sXML);
            
	        }catch(e){
		        alert("<%=Resources.Approval.msg_060 %>. at refreshList in ApvLineViewer.aspx\nError Desc:" + e.description);
	        }
        }
        function refreshCC(bAll){       
	        var sPath = "";
	        bAll = true;
	        if(bAll==null || bAll==false)sPath="[@belongto='" + m_sSelectedAllotType + "']";
	        var ccInfos = m_oApvList.selectNodes("steps/ccinfo"+sPath);
	        var otblccinfo = document.getElementById("tblccinfo");
	        var tbllength = otblccinfo.rows.length;
	        //Table 지우기
	        for(var i=0;i<tbllength-2;i++){
		        otblccinfo.deleteRow(otblccinfo.rows.length-1);
	        }
	        
	        var eTR, eTD;
	        for(var i=0;i<ccInfos.length;i++){
	        
		        var sList = "";
		        var ccInfo = window.event? ccInfos[i]:ccInfos.item[i];
		        var sBelongTo = ccInfo.getAttribute("belongto");
		        var ccList = ccInfo.childNodes;
		        for(var j=0 ; j < ccList.length; j++){
			        //var cc = ccList.nextNode();
			        var cc = ccList[j];
			        if(cc.hasChildNodes())cc=cc.firstChild;

			        eTR = document.getElementById("tblccinfo").insertRow(j+2);

			        if(cc.nodeName == "person"){
				        eTR.setAttribute("id","ccinfo["+i+"]/*["+j+"]/(person|role)[0]");
			        
				        if(window.event) {
				            eTR.attachEvent("onmouseover",overM);
				            eTR.attachEvent("onmouseout",outM);
				        }
				        else {
				            eTR.addEventListener("mouseover", overM, false);
				            eTR.addEventListener("mouseout", outM, false);
				        }
				        eTR.align= "left";
				        eTD = eTR.insertCell(0); eTD.innerHTML = getLngLabel(cc.getAttribute("name"),false); eTD.height=25;
				        eTD = eTR.insertCell(1); eTD.innerHTML = getLngLabel(cc.getAttribute("position"),true);
				        eTD = eTR.insertCell(2); eTD.innerHTML = getLngLabel(cc.getAttribute("title"),true);
				        eTD = eTR.insertCell(3); eTD.innerHTML = (sBelongTo=="sender")?strlable_send:((sBelongTo=="global")?strlable_global:strlable_receive);//"발신""전역""수신"
				        eTD = eTR.insertCell(4); eTD.innerHTML = getLngLabel(cc.getAttribute("ouname"),false);
			        }else if(cc.nodeName == "ou"){
			            eTR.setAttribute("id","ccinfo["+i+"]/*["+j+"]");
				        if(window.event) {
				            eTR.attachEvent("onmouseover",overM);
				            eTR.attachEvent("onmouseout",outM);
				        }
				        else {
				            eTR.addEventListener("mouseover", overM(event), false);
				            eTR.addEventListener("mouseout", outM(event), false);
				        }
				        eTR.align= "left";
				        eTD = eTR.insertCell(0); eTD.innerHTML = "&nbsp;"; eTD.height=25;
				        eTD = eTR.insertCell(1); eTD.innerHTML = "&nbsp;";
				        eTD = eTR.insertCell(2); eTD.innerHTML = "&nbsp;";
				        eTD = eTR.insertCell(3); eTD.innerHTML = (sBelongTo=="sender")?strlable_send:((sBelongTo=="global")?strlable_global:strlable_receive);//"발신""전역""수신"
				        eTD = eTR.insertCell(4); eTD.innerHTML = getLngLabel(cc.getAttribute("name"),false);
			        }

			        //eTR = tblccinfo.insertRow();
			        //eTD = eTR.insertCell();			eTD.height =1;			eTD.colSpan = 5;			eTD.className = "table_line";

		        }
	        }
        }
        function getSplitted(src,delim,idx){var aSrc = src.split(delim);return (aSrc.length>idx?aSrc[idx]:"");}
        function viewComment(idx){       
	        var rgParams = null;
	        rgParams = new Array();
	        rgParams["objMessage"] = getComment(idx);//Apvlist.getComment(idx);
	        var nWidth = 400;
            var nHeight = 400;
            var sFeature = "dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;scrolling:no;help:no;";
            var strNewFearture = ModifyDialogFeature(sFeature);
            //201107 의견조회 관련 수정
            var vRetval = window.showModalDialog("comment.aspx", rgParams, strNewFearture);
            //var vRetval = window.showModelessDialog("comment.aspx", rgParams, strNewFearture);
        }
	   
	    window.onload= initOnload;
        function initOnload()
        {
            initialize();
        }
	    function initTable(){
		    if(m_selectedRowId!=null){
			    selectRow(m_selectedRowId);
		    }
	    }
	    var m_selectedRow=null;
	    var m_selectedRowId=null;
	    function setSelectedRowId(id){m_selectedRowId=id;}
	    function selectRow(data, e){
	        
	        var oRow;
		    if(e.id==null){
			    oRow=window.event ? e.srcElement : e.target;
		    }else{
			    oRow=document.getElementById(e.id);
		    }
		    if(oRow!=null){
			    switchSelectedRow(oRow);
		    }else{
			    m_selectedRow=null;
			    m_selectedRowId=null;
		    }
	    }
//	    function selectRow(id){
//	    debugger;
//		    var oRow;
//		    if(id==null){
//			    oRow=event.srcElement;
//		    }else{
//			    oRow=document.all[id];
//		    }
//		    if(oRow!=null){
//			    switchSelectedRow(oRow);
//		    }else{
//			    m_selectedRow=null;
//			    m_selectedRowId=null;
//		    }
//	    }
	    function switchSelectedRow(oRow){
		    while(oRow!=null&&oRow.tagName!="TR"){
			    oRow=oRow.parentNode;
		    }
		    if(oRow!=null){
			    //if(m_selectedRow!=null)m_selectedRow.className="";
			    //oRow.className="rowselected";
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
	    function getPatentRow(){
		    switchSelectedRow(event.srcElement);
		    return m_selectedRow;
	    }
	    function getSelectedRow(){return m_selectedRow;}
	    function getComment(id){return document.getElementById(id).value;}//innerHTML//201107수정

	    var g_szAcceptLang  = "ko";
        function requestHTTPXSL(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	        m_xmlHTTPXSL.open(sMethod,sUrl,bAsync);
	        m_xmlHTTPXSL.setRequestHeader("Accept-Language",g_szAcceptLang);
	        m_xmlHTTPXSL.setRequestHeader("Content-type", sCType);
	        if(pCallback!=null)m_xmlHTTPXSL.onreadystatechange = pCallback;
	        (vBody!=null)?m_xmlHTTPXSL.send(vBody):m_xmlHTTPXSL.send();
        }       
        function receiveHTTPXSL(){	
	        if(m_xmlHTTPXSL.readyState==4){
		        m_xmlHTTPXSL.onreadystatechange=event_noop;
		        var xmlReturn=m_xmlHTTPXSL.responseXML;
		        //if(xmlReturn.xml==""){
		        if (m_xmlHTTPXSL.responseText.charAt(0) == '\r') {
			        alert(m_xmlHTTPXSL.responseText);
		        }
		        else
		        {
		            document.getElementById("Apvlist").innerHTML = xmlReturn.documentElement.xml;        
		        }
	        }
        }
	</script>
</body>
</html>
