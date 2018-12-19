<%@ Page Language="C#" AutoEventWireup="true" CodeFile="search.old.aspx.cs" Inherits="COVIFlowNet_ApvlineMgr_search" %>

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
					<td width="25%"><INPUT TYPE='text' id='dataField' NAME="DN" class='input4' ACCESSKEY="N" style="width:90%"></td>
					<td width="25%" align="center" class="BTable_bg02 text01"><%= Resources.Approval.lbl_dept%>(<u>D</u>)</td>
					<td width="25%"><INPUT TYPE="text" id='dataField' NAME="DP" class='input4' ACCESSKEY="D" style="width:90%"></td>
				</tr>
				<tr bgcolor="#FFFFFF">
					<!--
					<td align="center" class="table_gray">사번(<u>A</u>)</td>
					<td class="table_white"><INPUT TYPE="text" id='dataField' NAME="AN" class='input4' ACCESSKEY="A" style="width:100%"></td>
					-->
					<td align="center" class="BTable_bg02 text01"><%= Resources.Approval.lbl_jobposition%>(<u>L</u>)</td>
					<td><INPUT TYPE="text" id='dataField' NAME="LV" class='input4' ACCESSKEY="L" style="width:90%"></td>
					<td align="center" class="BTable_bg02 text01"><%= Resources.Approval.lbl_jobtitle%>(<u>T</u>)</td>
					<td><INPUT TYPE="text" id="dataField" NAME="TL" class='input4' ACCESSKEY="T" style="width:90%"></td>					
				</tr>
				<!--
				<tr>
					<td align="center" class="table_gray">직책(<u>T</u>)</td>
					<td class="table_white"><INPUT TYPE="text" id='dataField' NAME="TL" class='input4' ACCESSKEY="T" style="width:100%"></td>
					<td align="center" class="table_gray">업무(<u>W</u>)</td>
					<td class="table_white"><INPUT TYPE="text" id='dataField' NAME="WK" class='input4' ACCESSKEY="W" style="width:100%"></td>
				</tr>
				-->
				<tr style="display:;" bgcolor="#FFFFFF">
					<td align="center" class="BTable_bg02 text01"><%= Resources.Approval.lbl_deptsearch%></td>
					<td colspan="3"><input type='checkbox' id="buse" name="buse" onclick="m_objResultWin.clearContents();" />(<%= Resources.Approval.msg_214 %>)</td>
				</tr>
			</table>			
            <div class="popup_table_Btn" align="center">
              <ul>
                <li><a href="#" class="Btn05" id="btnFind" onclick="javascript:event_button_find('btnFind');" ><span><%= Resources.Approval.btn_search%></span></a></li>
                <li><a href="#" class="Btn05" id="btnReset" onclick="javascript:event_button_find('btnReset');" ><span><%= Resources.Approval.btn_refresh%></span></a></li>
              </ul>
            </div>			
	    </body>
	<script language="javascript" type="text/javascript">
var g_szAcceptLang = "ko";
var m_szUrlParams = "";
var m_xmlHTTP;
var m_objResultWin;
var m_selectDept = false;
//var m_ENT="<%=Session["user_ent_code"].ToString()%>";
m_ENT = "<%=Ent%>"
var gUserLanguage = "<%= Session["user_language"] %>";
var m_parent =false;
window.document.body.attachEvent("onkeydown", event_window_onkeydown);
init();
function init(){
    try{
        m_rgPostFields = window.document.all['dataField'];
        
        if(parent.ListItems != undefined){ 
    	    m_objResultWin = parent.ListItems;
	    }else{
	        m_objResultWin = parent.parent.ListItems;	
        
	        if(parent.parent.SelectedItems.m_bGroup || parent.parent.SelectedItems.m_bRef){
    	        m_selectDept = true;    
	        }
	        if (parent.parent.SelectedItems.m_bUser ){
	            m_parent = true;
	        }
	    }
	}catch(e){
	    m_objResultWin = parent.parent.ListItems;
	}
}
function event_window_onkeydown(){if(event.keyCode==13)event_button_find('btnFind');}
function event_button_find(btn_event){
	//m_ENT = parent.iGroup.g_ENT;
	var btn_E =  btn_event;
	if (btn_E == "btnReset"){
	    m_szUrlParams = "";
	    m_objResultWin.clearContents();
	    
	    for (var x=0; x < m_rgPostFields.length; x++)
		{
			m_rgPostFields[x].value = ""
		}

        first_value();
        
        DN.disabled=false;
        LV.disabled=false;
        TL.disabled=false;
        DN.style.backgroundColor = "";
        LV.style.backgroundColor = "";
        TL.style.backgroundColor = "";
	}else{
	    m_szUrlParams = "";
	    m_objResultWin.clearContents();
	    for (var x=0; x<dataField.length; x++){
		    if (dataField[x].value != ""){
			    fHasData = true;
			    m_szUrlParams += "&" + dataField[x].name + "=" + dataField[x].value;			
		    }    
	    }
	    if(m_selectDept){
	        if(buse.checked && window.document.all['DP'].value == ""){
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
		            window.document.all['DN'].focus();
	            }  
	        }
	    }
	}
	m_objResultWin.enableRecipientButtons(false);
}
function queryGetData(){
	try{		
		m_xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP");
		var	szURL = ""; 
		if(buse.checked){
			var buse_nm = window.document.all['DP'].value;
			var pXML = "dbo.usp_SearchUnit01";
            var aXML = "<param><name>ENT_CODE</name><type>VarChar</type><length>100</length><value><![CDATA["+m_ENT+"]]></value></param>";
			if (dataField["DP"].value != ""){
			    aXML += "<param><name>DP</name><type>VarChar</type><length>100</length><value><![CDATA["+dataField["DP"].value+"]]></value></param>";
			}
            sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath>org_unitquery.xsl</xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
            szURL = "../address/getXMLQuery.aspx?Type=Unit";
		}else{
//			szURL = "/xmlorg/query/org_memberquery03.xml?" + m_szUrlParams.substring(1)+"&ENT_CODE="+m_ENT;
			var pXML = "dbo.usp_SearchMember01";
            var aXML = "<param><name>ENT_CODE</name><type>VarChar</type><length>100</length><value><![CDATA["+m_ENT+"]]></value></param>";
			if (dataField["DN"].value != ""){
			   aXML += "<param><name>DN</name><type>VarChar</type><length>100</length><value><![CDATA["+dataField["DN"].value+"]]></value></param>";
			}
			if (dataField["DP"].value != ""){
			   aXML += "<param><name>DP</name><type>VarChar</type><length>100</length><value><![CDATA["+dataField["DP"].value+"]]></value></param>";
			}
			if (dataField["LV"].value != ""){
			   aXML += "<param><name>LV</name><type>VarChar</type><length>100</length><value><![CDATA["+dataField["LV"].value+"]]></value></param>";
			}
			if (dataField["TL"].value != ""){
			   aXML += "<param><name>TL</name><type>VarChar</type><length>100</length><value><![CDATA["+dataField["TL"].value+"]]></value></param>";
			}
			//다국어정보
			aXML += "<param><name>LANGUAGE</name><type>VarChar</type><length>100</length><value><![CDATA["+gUserLanguage+"]]></value></param>";

            sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath>org_memberquery.xsl</xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
            szURL = "../address/getXMLQuery.aspx?Type=searchMember";
		
		}
         requestHTTP("POST",szURL,true,"text/xml",event_listen_queryGetData, sXML);

	}catch(e){
		//alert("오류가 발생했습니다.\nSource:gueryGetData() in search.htm\nNo:"+e.number+" Desc:"+e.description);
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
		btnFind.disabled = true;
		btnReset.disabled = true;
	}else{
		m_objResultWin.clearContents();
		btnFind.disabled = false;
		btnReset.disabled = false;
	}    
}
function event_button_reset(){
	m_objResultWin.clearContents();
	for (var x=0; x < dataField.length; x++){
		dataField[x].value = "";
	}
	m_objResultWin.enableRecipientButtons(false);    
}
// 새로고침 버튼 선택 시 입력란 부서체크 풀어줌 : 07. 6. 20. JSI
function first_value()
{
    try{
    buse.checked=false;
    DN.disabled=false;
    PO.disabled=false;
    TL.disabled=false;
    DN.focus();
    }
    catch(e){}
}
	</script>
</html>
