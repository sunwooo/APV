<%@ Page Language="C#" AutoEventWireup="true" CodeFile="detail.aspx.cs" Inherits="COVIFlowNet_Address_detail" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <script type="text/javascript" language="javascript" src="/coviweb/SiteReference/js/Dictionary.js"></script>
    <script type="text/javascript" language="javascript" src="/coviweb/SiteReference/js/Utility.js"></script>
</head>
<body leftmargin="5" topmargin="8" >
	<div style="padding-left:5; margin-left:26px; text-align:right" >
		<div class="popup_line BTable_bg01"></div>			    							
		<table width="100%" border="0" cellpadding="2" cellspacing="1" class="BTable_bg03">
			<tr id="Person" bgcolor="#FFFFFF">
				<td width="25%" align="center" class="BTable_bg02 text01"><%=Resources.Approval.lbl_Name2%></td>
				<td width="25%" class="table_white"><INPUT TYPE='text' name='dataField' id="DISPLAY_NAME" class='input4' style="width:90%; border:0px;" readonly /></td>
				<td width="25%" align="center" class="BTable_bg02 text01"><%=Resources.Approval.lbl_dept%></td>
				<td width="25%" class="table_white"><INPUT TYPE="text" name='dataField' id="UNIT_NAME" class='input4' style="width:90%; border:0px;" readonly /></td>
			</tr>
			<tr id="Person" bgcolor="#FFFFFF">
				<td align="center" class="BTable_bg02 text01"><%=Resources.Approval.lbl_jobtitle%></td>
				<td class="table_white"><INPUT TYPE="text" name='dataField' id="JOBTITLE_Z" class='input4' style="width:90%; border:0px;" readonly /></td>
				<td align="center" class="BTable_bg02 text01"><%=Resources.Approval.lbl_jobposition%></td>
				<td class="table_white"><INPUT TYPE="text" name='dataField' id="JOBPOSITION_Z" class='input4' style="width:90%; border:0px;" readonly /></td>
			</tr>
			<tr id="Person" bgcolor="#FFFFFF">
				<td align="center" class="BTable_bg02 text01">Tel</td>
				<td class="table_white" colspan="3"><INPUT TYPE="text" name='dataField' id="OFFICE_TEL" class='input4' style="width:97%; border:0px;"  readonly /></td>
			</tr>
			<tr id="Person" bgcolor="#FFFFFF">
				<td align="center" class="BTable_bg02 text01"><%=Resources.Approval.lbl_absence_reason%></td>
				<td class="table_white" colspan="3"><INPUT TYPE="text" name='dataField' id="ABR" class='input4' style="width:97%; border:0px;"  readonly /></td>
			</tr>
			<tr id="Person" bgcolor="#FFFFFF">
				<td align="center" class="BTable_bg02 text01"><%=Resources.Approval.lbl_UseSubstitue%></td>
				<td class="table_white"  colspan="3"><INPUT TYPE="text" name='dataField' id="DEPUTY_USAGE" class='input4' style="width:97%; border:0px;"  readonly /></td>
			</tr>
			<tr id="Person" bgcolor="#FFFFFF">
				<td align="center" class="BTable_bg02 text01"><%=Resources.Approval.lbl_Delegator%></td>
				<td class="table_white" colspan="3"><INPUT TYPE="text" name='dataField' id="DEPUTY" class='input4' style="width:97%; border:0px;"  readonly /></td>
			</tr>
			<tr id="Person" bgcolor="#FFFFFF" style="display:none">
				<td align="center" class="BTable_bg02 text01"><%=Resources.Approval.lbl_Email%></td>
				<td class="table_white" colspan="3"><input type='text' name="dataField" class='input4' id="EMAIL" style="width:97%; border:0px;" readonly></td>
			</tr>
		</table>
	</div>
	<script language="jscript" type="text/javascript">
        var m_xmlHTTP = CreateXmlHttpRequest();
        var m_oXMLDOM = CreateXmlDocument();
        var m_bDisplayed = false;
        var m_oDF = document.getElementsByName("dataField");
        var m_Alias="";
        var m_pPerson = document.getElementById("Person");
        var m_DirtyProps = new Dictionary();
        var m_bGroup = getArg("bGroup",false);
        var m_bRecp = getArg("bRecp", false);
        var gLngIdx = <%=strLangIndex %>;

        if(m_bGroup || m_bRecp){
	        resizeField("group");
        }
 //       for(var x=0;x<m_oDF.length;x++) m_oDF[x].attachEvent("onchange",setDirty);

//        if(document.getElementById("Person") != null){
//            var unFiltered = document.getElementsByTagName('*');
//            for (var i = 0; i < unFiltered.length; i++){
//                if (unFiltered[i].getAttribute('id') == "Person"){
//                    alert( "Person");
//                }
//                if (unFiltered[i].getAttribute('id') == "dataField"){
//                    alert( "dataField");
//                }
//            }
//        }
 
        function getArg(sArgName,vDefault){
	        try{
		        return parent.parent.parent.dialogArguments[sArgName];
	        }catch(e){
		        return vDefault;
	        }
        }



        function displayPhoto(){
	        if(!m_bDisplayed){
		        try{
			        m_bDisplayed = true;
			        photoimg.src = "photo.aspx?alias=" + m_Alias ;
			        divPhoto.runtimeStyle.display = "block";
			        divPhotoOff.runtimeStyle.display = "none";
		        }catch(e){
			        alert(e.description);
		        }
	        }
        }
        function erasePhoto(){
	        m_bDisplayed = false;
	        photoimg.src = "";
	        divPhoto.runtimeStyle.display  = "none";
	        divPhotoOff.runtimeStyle.display = "block";
        }
        function getDetailInfo(strAlias) {
	        try{
		        strAlias = strAlias.replace(/&/g,String.fromCharCode(8)).replace(/=/g,String.fromCharCode(11));
		        m_Alias = strAlias;
 				var pXML = "dbo.usp_GetMember02";
                var aXML = "<param><name>PERSON_CODE</name><type>VarChar</type><length>100</length><value><![CDATA["+strAlias+"]]></value></param>";
                aXML += "<param><name>LANGUAGE</name><type>VarChar</type><length>100</length><value><![CDATA["+"<%=strLangID %>"+"]]></value></param>";
                var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
                var szURL = "getXMLQuery.aspx?Type=searchMember";
                requestHTTP("POST", szURL, false, "text/xml", null, sXML);
                listenSUBHTTP();
	        }
	        catch(e){
		        alert("detail.aspx error: "+e.description + "\r\nError number: " + e.number);
	        }
        }
        function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
            m_xmlHTTP.open(sMethod,sUrl,bAsync);
            //m_xmlHTTP.setRequestHeader("Accept-Language","ko");
            m_xmlHTTP.setRequestHeader( "Content-type", sCType);
            if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
            (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
       }

		function event_noop(){return false;}   
        function listenSUBHTTP(){	
	        if(m_xmlHTTP.readyState == 4){
		        m_xmlHTTP.onreadystatechange = event_noop;//re-entrant gate
		        if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			        alert("error in event_retrieve_completed(): no responseText returned");
		        }
		        else{
                    var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			        if(errorNode!=null){
				        return true;
			        }else{	
			            var oAllNodes;
			            try{					
				            var oALL = m_xmlHTTP.responseXML.selectSingleNode("ROOT/ORG_PERSON");
				            if (oALL != null) {
				            	var oAllNodes = oALL.childNodes;
				            	var oNode;
				            	var el;
				            	for (var x = 0; x < oAllNodes.length; x++) {
				            		oNode = oAllNodes[x];
				            		if (document.getElementById(oNode.nodeName) != null) {
				            			if (oNode.nodeName == "JOBTITLE_Z" || oNode.nodeName == "JOBPOSITION_Z" || oNode.nodeName == "JOBLEVEL_Z") {
				            				document.getElementById(oNode.nodeName).value = getLngLabel(oNode.text, true);
				            			} else {
				            				document.getElementById(oNode.nodeName).value = oNode.text;
				            			}
				            		}
				            	}
				            }
			            }catch(e){
			                alert("error in event_retrieve_completed(): " + e.message);
			            }
			        }
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
                    oXslDom.async = false;
                    oXslDom.load(urlXsl);
        //        }else{
        //            var oXMLHttp =  CreateXmlHttpRequest();
	    //            oXMLHttp.open("GET",urlXsl,false);
	    //           oXMLHttp.send();
	    //            //시간 늘리기
	    //            delay(600);
	    //            if ( oXMLHttp.status == 200){
		//               var parser = new DOMParser();
        //              oXslDom = parser.parseFromString(oXMLHttp.responseText,"text/xml");
        //               //oXSL = oXMLHttp.responseText.substring(38,oXMLHttp.responseText.length) ;
	    //            }
        ////        }
                var oProcessor = new XSLTProcessor();
                oProcessor.importStylesheet(oXslDom);
                return oProcessor;
                  //return oXMLHttp.responseText.replace("<![CDATA[", "&lt;![CDATA[").replace("]]>", "]]&gt;").replace('(iVal<10?"0"+iVal:iVal)','(iVal&lt;!10?"0"+iVal:iVal)').replace('for(var i=0; i < aDotCount.length-1; i++){','for(var i=0; i &lt;! aDotCount.length-1; i++){').replace('"<br>"','"&lt;!br&gt;"').replace('"<font color=\'white\'>-</font>"','"&lt;!font color=\'white\'&gt;-&lt;!/font&gt;"');
               // return oXMLHttp.responseText.replace("<![CDATA[", "@CDATASTART").replace("]]>", "@CDATAEND");
            }
        }
        function resizeField(szClass){
	        if(szClass=="group"){
		        if(m_pPerson.length>0){
			        for(var y=0;y<m_pPerson.length;y++){
				        m_pPerson[y].style.display="none";
			        }
		        }
	        }
	        else if(szClass=="user"){
		        if(m_pPerson.length>0){
			        for(var y=0;y<m_pPerson.length;y++){
				        m_pPerson[y].style.display="block";
			        }
		        }
	        }
        }
        function event_noop(){
	        return(false);
        }
        function setDirty(){
	        if(m_DirtyProps!=null){
		        var elm = event.srcElement;
		        if(!m_DirtyProps.Exists(elm.name)){
			        m_DirtyProps.Add(elm.name,(elm.tagName!="SELECT"?elm.value:elm.item(elm.selectedIndex).value).replace(/&/g,String.fromCharCode(8)));
		        }
		        else{
			        m_DirtyProps(elm.name) = (elm.tagName!="SELECT"?elm.value:elm.item(elm.selectedIndex).value).replace(/&/g,String.fromCharCode(8));
		        }
	        }
        }
        function progressBox(oIndicator,oHandler,szPostContent,szContent,szTitle){
	        var rgParams = new Array();
	        rgParams["indicator"] = oIndicator;
	        rgParams["handler"] = oHandler;
	        rgParams["postContent"] = szPostContent;
	        rgParams["content"] = "<pre>\n\r</pre><center>" + szContent + "</center>";
	        rgParams["title"] = szTitle;

	        showModelessDialog("progress.htm", rgParams, "dialogHeight:120px;dialogWidth:250px;status:no;resizable:no;help:no;");
        }	
    </script>
</body>
</html>
