<%@ Page Language="C#" AutoEventWireup="true" CodeFile="search.aspx.cs" Inherits="COVIFlowNet_Address_search" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
	<head runat="server">
		<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8" />
		<script src="/CoviWeb/SiteReference/js/Config.js" type="text/javascript"></script>
        <script src="/CoviWeb/SiteReference/js/ClientMessageBox.js" type="text/javascript"></script>
        <script src="/CoviWeb/SiteReference/js/EmbedObject.js" type="text/javascript"></script>
        <script src="/CoviWeb/SiteReference/js/Utility.js" type="text/javascript"></script>
	</head>
	    <body>               
			<table width="100%" border="0" cellpadding="2" cellspacing="1" class="BTable_bg03">			    
				<tr bgcolor="#FFFFFF">
					<td width="25%" align="center" class="BTable_bg02 text01"><%= Resources.Approval.lbl_username%>(<u>N</u>)</td>
					<td width="25%"><INPUT TYPE='text' id='dataField' NAME="DN" class='input4' ACCESSKEY="N" style="width:90%" /></td>
					<td width="25%" align="center" class="BTable_bg02 text01"><%= Resources.Approval.lbl_dept%>(<u>D</u>)</td>
					<td width="25%"><INPUT TYPE="text" id='dataField' NAME="DP" class='input4' ACCESSKEY="D" style="width:90%" /></td>
				</tr>
				<tr bgcolor="#FFFFFF">
					<!--
					<td align="center" class="table_gray">사번(<u>A</u>)</td>
					<td class="table_white"><INPUT TYPE="text" id='dataField' NAME="AN" class='input4' ACCESSKEY="A" style="width:100%" /></td>
					-->
					<td align="center" class="BTable_bg02 text01"><%= Resources.Approval.lbl_jobposition%>(<u>L</u>)</td>
					<td><INPUT TYPE="text" id='dataField' NAME="LV" class='input4' ACCESSKEY="L" style="width:90%" /></td>
					<td align="center" class="BTable_bg02 text01"><%= Resources.Approval.lbl_jobtitle%>(<u>T</u>)</td>
					<td><INPUT TYPE="text" id="dataField" NAME="TL" class='input4' ACCESSKEY="T" style="width:90%" /></td>					
				</tr>
				<!--
				<tr>
					<td align="center" class="table_gray">직책(<u>T</u>)</td>
					<td class="table_white"><INPUT TYPE="text" id='dataField' NAME="TL" class='input4' ACCESSKEY="T" style="width:100%" /></td>
					<td align="center" class="table_gray">업무(<u>W</u>)</td>
					<td class="table_white"><INPUT TYPE="text" id='dataField' NAME="WK" class='input4' ACCESSKEY="W" style="width:100%" /></td>
				</tr>
				-->
				<tr style="display:;" bgcolor="#FFFFFF">
					<td align="center" class="BTable_bg02 text01"><%= Resources.Approval.lbl_deptsearch%></td>
					<td colspan="3"><input type='checkbox' id="buse" name="buse" onclick="m_objResultWin.clearContents();" />(<%= Resources.Approval.msg_214 %>)</td>
				</tr>
			</table>			
            <div class="popup_table_Btn" align="center">
              <ul>
                <li><a class="Btn05" id="btnFind" href="javascript:event_button_find('btnFind');" ><span><%= Resources.Approval.btn_search%></span></a></li>
                <li><a class="Btn05" id="btnReset" href="javascript:event_button_find('btnReset');" ><span><%= Resources.Approval.btn_refresh%></span></a></li>
              </ul>
            </div>			
	    </body>
	<script language="javascript" type="text/javascript">
    var g_szAcceptLang = "ko";
    var m_szUrlParams = "";
    var m_xmlHTTP;
    var m_objResultWin;
    var m_selectDept = false;
    var m_ENT = "<%=Ent%>"
    var gUserLanguage = "<%= Session["user_language"] %>";
    var m_parent =false;
    var m_rgPostFields;
	if(window.addEventListener){
	    window.document.addEventListener('keydown',event_window_onkeydown, false);
	}else{    
        window.document.body.attachEvent("onkeydown", event_window_onkeydown);
    }
    window.onload= init;
    function init(){
        try{
            m_rgPostFields = window.document.getElementById("dataField");
            
            if(parent.ListItems != undefined){ 
    	        m_objResultWin = parent.ListItems;
	        }else{
	            m_objResultWin = parent.parent.frames[3];//ListItems;	
            
	            if(parent.parent.frames[4].m_bGroup || parent.parent.frames[4].m_bRef){//parent.parent.SelectedItems
    	            m_selectDept = true;    
	            }
	            if (parent.parent.frames[4].m_bUser ){
	                m_parent = true;
	            }
	        }
	    }catch(e){
	        m_objResultWin = parent.parent.frames[3];//ListItems;
	    }
    }
    function event_window_onkeydown(e){
        var ev=(window.event)?window.event: e;
        var chrCode = (ev.keyCode)? ev.keyCode: ((ev.charCode)? ev.charCode: ev.which);
        if(chrCode==13)event_button_find('btnFind');
    }
    function event_button_find(btn_event){
	    //m_ENT = parent.iGroup.g_ENT;
	    var btn_E =  btn_event;
	    if (btn_E == "btnReset"){
	        m_szUrlParams = "";
	        m_objResultWin.clearContents();
    	    
	        if(window.addEventListener){
                var szId = "dataField";
	            var unFiltered = document.getElementsByTagName('*');
	            for (var i = 0; i < unFiltered.length; i++){
	                if (unFiltered[i].getAttribute('id') == szId){
	                    if (unFiltered[i].value != "" ){
		                    unFiltered[i].value = "";
	                    }	        
	                }
	            }
            }
            first_value();
            
            document.getElementsByName("DN")[0].disabled=false;
            document.getElementsByName("LV")[0].disabled=false;
            document.getElementsByName("TL")[0].disabled=false;
            document.getElementsByName("DN")[0].style.backgroundColor = "";
            document.getElementsByName("LV")[0].style.backgroundColor = "";
            document.getElementsByName("TL")[0].style.backgroundColor = "";
	    }else{
	        m_szUrlParams = "";
	        m_objResultWin.clearContents();
	        if(window.addEventListener){
                var szId = "dataField";
	            var unFiltered = document.getElementsByTagName('*');
	            for (var i = 0; i < unFiltered.length; i++){
	                if (unFiltered[i].getAttribute('id') == szId){
	                    if (unFiltered[i].value != "" ){
			                fHasData = true;
			                m_szUrlParams += "&" + unFiltered[i].getAttribute("name") + "=" + unFiltered[i].value;			
	                    }	        
	                }
	            }	        
	        }else{
	            for (var x=0; x<dataField.length; x++){
		            if (dataField[x].value != ""){
			            fHasData = true;
			            m_szUrlParams += "&" + dataField[x].name + "=" + dataField[x].value;			
		            }    
	            }
	        }
	        
	        if(m_selectDept){
	            if(document.getElementById("buse").checked && window.document.getElementsByName("DP")[0].value == ""){
		            alert("<%= Resources.Approval.msg_001 %>"+":"+"<%=Resources.Approval.lbl_dept %>");
	            }else{
    		        queryGetData();
	            }
	        }else{
	            if ( ( m_parent && !buse.checked) || (!m_parent)){
	                if (m_szUrlParams.length > 0){
		                queryGetData();
	                }else{
		                //alert("하나 이상의 조건을 넣어주세요.");
		                alert("<%= Resources.Approval.msg_060 %>");
		                window.document.getElementsByName("DN")[0].focus();
	                }  
	            }
	        }
	    }
	    m_objResultWin.enableRecipientButtons(false);
    }
    function queryGetData(){
	    try{		
		    m_xmlHTTP =  CreateXmlHttpRequest();
		    var	szURL = ""; 
		    if(document.getElementById("buse").checked){
			    var buse_nm = window.document.getElementsByName("DP")[0].value;
			    var pXML = "dbo.usp_SearchUnit01";
                var aXML = "<param><name>ENT_CODE</name><type>VarChar</type><length>100</length><value><![CDATA["+m_ENT+"]]></value></param>";
			    if (document.getElementsByName("DP")[0].value != ""){
			        aXML += "<param><name>DP</name><type>VarChar</type><length>100</length><value><![CDATA["+document.getElementsByName("DP")[0].value+"]]></value></param>";
			    }
                sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath>org_unitquery.xsl</xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
                szURL = "../address/getXMLQuery.aspx?Type=Unit";
		    }else{
			    var pXML = "dbo.usp_SearchMember01";
                var aXML = "<param><name>ENT_CODE</name><type>VarChar</type><length>100</length><value><![CDATA["+m_ENT+"]]></value></param>";
			    if (document.getElementsByName("DN")[0].value != ""){
			       aXML += "<param><name>DN</name><type>nVarChar</type><length>100</length><value><![CDATA["+document.getElementsByName("DN")[0].value+"]]></value></param>";
			    }
			    if (document.getElementsByName("DP")[0].value != ""){
			       aXML += "<param><name>DP</name><type>nVarChar</type><length>100</length><value><![CDATA["+document.getElementsByName("DP")[0].value+"]]></value></param>";
			    }
			    if (document.getElementsByName("LV")[0].value != ""){
			       aXML += "<param><name>LV</name><type>nVarChar</type><length>100</length><value><![CDATA["+document.getElementsByName("LV")[0].value+"]]></value></param>";
			    }
			    if (document.getElementsByName("TL")[0].value != ""){
			       aXML += "<param><name>TL</name><type>nVarChar</type><length>100</length><value><![CDATA["+document.getElementsByName("TL")[0].value+"]]></value></param>";
			    }
			    //다국어정보
			    aXML += "<param><name>LANGUAGE</name><type>VarChar</type><length>100</length><value><![CDATA["+gUserLanguage+"]]></value></param>";

                sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath>org_memberquery.xsl</xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
                szURL = "../address/getXMLQuery.aspx?Type=searchMember";
		    }
            requestHTTP("POST",szURL,true,"text/xml",event_listen_queryGetData, sXML);
	    }catch(e){
		    alert("<%= Resources.Approval.msg_030 %>\nSource:gueryGetData() in search.htm\nNo:"+e.number+" Desc:"+e.description);		
	    }
    }
    function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
        m_xmlHTTP.open(sMethod,sUrl,bAsync);
        //m_xmlHTTP.setRequestHeader("Accept-Language","ko");
        m_xmlHTTP.setRequestHeader( "Content-type", sCType);
        if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
        (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
    }

    function event_noop(){return(false);}    
    function event_listen_queryGetData(){
	    if(m_xmlHTTP.readyState == 4){
	        doProgressIndicator(false);
    	    
		    m_xmlHTTP.onreadystatechange = event_noop;//re-entrant gate
		    if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			    //alert("오류가 발생했습니다.\nSource:event_listen_queryGetData() in search.htm\n"+m_xmlHTTP.responseText);
			    alert("<%= Resources.Approval.msg_030 %>\nSource:event_listen_queryGetData() in search.htm\n"+m_xmlHTTP.responseText);
		    }else{
			    var oDOM = m_xmlHTTP.responseXML;
			    var oErr = oDOM.documentElement.selectSingleNode("error");
			    if(oErr==null){
				    m_objResultWin.processXmlData(oDOM);
			    }else{
				    //if(oErr.text!="none")alert("오류가 발생했습니다.\nSource:event_listen_queryGetData() in search.htm\n"+oErr.text);
				    if(oErr.text!="none")alert("<%= Resources.Approval.msg_030 %>\nSource:event_listen_queryGetData() in search.htm\n"+oErr.text);
			    }
		    }
	    }
    }
    function doProgressIndicator(fDisplay){
	    if(fDisplay){
		    m_objResultWin.addMessage("Searching...");
		    document.getElementById("btnFind").disabled = true;
		    document.getElementById("btnReset").disabled = true;
	    }else{
		    m_objResultWin.clearContents();
		    document.getElementById("btnFind").disabled = false;
		    document.getElementById("btnReset").disabled = false;
	    }    
    }
    function event_button_reset(){
	    m_objResultWin.clearContents();
        var unFiltered = document.getElementsByTagName('*');
        for (var i = 0; i < unFiltered.length; i++){
            if (unFiltered[i].getAttribute('id') == szId){
                if (unFiltered[i].value != "" ){
	                unFiltered[i].value ="";			
                }	        
            }
        }	    
	    m_objResultWin.enableRecipientButtons(false);    
    }
    // 새로고침 버튼 선택 시 입력란 부서체크 풀어줌 : 07. 6. 20. JSI
    function first_value()
    {
        try{
            document.getElementById("buse").checked=false;
            document.getElementsByName("DN")[0].disabled=false;
            document.getElementsByName("PO")[0].disabled=false;
            document.getElementsByName("TL")[0].disabled=false;
            document.getElementsByName("DN")[0].focus();
        }
        catch(e){}
    }
	</script>
</html>
