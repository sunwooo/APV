<%@ Page Language="C#" AutoEventWireup="true" CodeFile="CPrivateLineList.aspx.cs" Inherits="COVIFlowNet_CirculationlineList_CPrivateLineList" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>회람그룹</title>
	<script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>
</head>
<body  leftmargin="0" topmargin="0" marginheight="0" marginwidth="0" style="OVERFLOW: auto;    MARGIN: 0px; height:180px;">

</body>
</html>
<script language="javascript" type="text/javascript">
	var UserID="<%=UserID%>";
	var m_id="";
	var m_xmlHTTP = CreateXmlHttpRequest();

	window.onload= initOnload;
	function initOnload(){
		var szURL = "GetCirculationlist.aspx?USER_ID="+UserID;
		//var szURL = "/xmlwf/query/wf_PrivateDomainData01.xml?USER_ID="+UserID;
		requestHTTP("GET",szURL,true,"text/xml",receiveHTTP,null);
	}
	function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
		m_xmlHTTP.open(sMethod,sUrl,bAsync);
		//m_xmlHTTP.setRequestHeader("Accept-Language","ko");
		m_xmlHTTP.setRequestHeader( "Content-type", sCType);
		if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
		(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
	}
	function receiveHTTP(){
		if(m_xmlHTTP.readyState==4){
	//alert(m_xmlHTTP.responseXML.xml);
			m_xmlHTTP.onreadystatechange=event_noop;
			if(m_xmlHTTP.responseText.charAt(0)=='\r'){
				alert(m_xmlHTTP.responseText);
			}else{
				var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
				if(errorNode!=null){
					alert("Desc: " + errorNode.text);
				}else{
					var xslDOM=CreateXmlDocument();
					xslDOM.async=false;
					
					//xslDOM.load("ApvLineMgrApvline.xsl");
					xslDOM.load("CirculationLineMgr_xsl.aspx");						             
					document.body.innerHTML = m_xmlHTTP.responseXML.transformNode(xslDOM);
				}
			}
		}
	}
	function event_noop(){return(false);}
	function changerChk(){
		if (rChk.length==null){
			m_id = rChk.id;
			selectRow(rChk.id);
		}
		else{
			for(i=0;i<rChk.length;i++){
				if (rChk[i].checked) {
					m_id = rChk[i].id;
					selectRow(rChk[i].id);
				}
			}
		}
	}
	var m_selectedRow=null;
	var m_selectedRowId=null;
	function selectRow(id){
		var oRow;
		oRow=event.srcElement.parentElement.parentElement;

		if(oRow!=null){
			switchSelectedRow(oRow);
		}else{
			m_selectedRow=null;
			m_selectedRowId=null;
		}
	}
	function switchSelectedRow(oRow){
		while(oRow!=null&&oRow.tagName!="TR"){
			oRow=oRow.parentNode;
		}
		if(oRow!=null){
			if(m_selectedRow!=null)m_selectedRow.className="";
			oRow.className="rowselected";
			m_selectedRow=oRow;
			m_selectedRowId=oRow.id;
		}
	}
	//결재선조회 2003.04.09 황선희 추가
	function queryGetData(){
		var szURL = "GetCirculationlist.aspx?PDD_ID="+m_id;
		//var szURL = "/xmlwf/query/wf_privatedomaindata02.xml?PDD_ID="+m_id;
		requestHTTP("GET",szURL,false,"text/xml",null,null);
		return receiveHTTPStep();
	}
	function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
		m_xmlHTTP.open(sMethod,sUrl,bAsync);
		//m_xmlHTTP.setRequestHeader("Accept-Language","ko");
		m_xmlHTTP.setRequestHeader( "Content-type", sCType);
		if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
		(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
	}
	function receiveHTTPStep(){
		if(m_xmlHTTP.readyState==4){
			m_xmlHTTP.onreadystatechange=event_noop;
			if(m_xmlHTTP.responseText.charAt(0)=='\r'){
				alert(m_xmlHTTP.responseText);
			}else{
				var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
				if(errorNode!=null){
					alert("Desc: " + errorNode.text);
				}else{
					return m_xmlHTTP.responseXML.selectSingleNode("response/item[id='"+m_id+"']/signinform");
				}
			}
		}
	}				
	</script>
