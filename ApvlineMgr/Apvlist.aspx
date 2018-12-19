<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Apvlist.aspx.cs" Inherits="Approval_ApvlineMgr_Apvlist" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>제목 없음</title>
</head>
<body leftmargin="0" topmargin="0" onselectstart="return false;" marginheight="0" marginwidth="0" style="MARGIN: 0px;">
</body>
<script type="text/javascript" language="javascript">
window.onload= initOnload;
function initOnload(){
	window.parent.document.onreadystatechange = initialize;
	return;	
}
function initialize(){
	if(window.parent.document.readyState == "complete"){
		window.parent.document.onreadystatechange = noop;
		window.parent.initialize();
	}else
		window.setTimeout(initialize,500);
}
function noop(){return;}
function initTable(){
	if(m_selectedRowId!=null){
		selectRow(m_selectedRowId);
	}
}
var m_selectedRow=null;
var m_selectedRowId=null;
function setSelectedRowId(id){m_selectedRowId=id;}
function selectRow(id, e){
   var evt=(window.event)?window.event: e;
	var oRow;
	if(id==null){
		oRow=(evt.srcElement) ? evt.srcElement : evt.target;
	}else{
		oRow=document.getElementById(id);
	}
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
function getPatentRow(e){
   var evt=(window.event)?window.event: e;
	switchSelectedRow((evt.srcElement) ? evt.srcElement : evt.target);
	return m_selectedRow;
}
function getSelectedRow(){return m_selectedRow;}
function getComment(id){return document.getElementById(id).innerHTML;}
var selftime;
function event_GalTable_onmousemove(e){
    if(parent.document.getElementById("tooltip") != undefined){
	    parent.document.getElementById("tooltip").style.display = "none";
	}else{
	    document.getElementById("tooltip").style.display = "none";
	}
    var evt=(window.event)?window.event: e;

    if(evt == null)return;
    var el = (evt.srcElement)?evt.srcElement:evt.target;	
	if(el==null)return;
	if (el.tagName != "TH" && el.tagName != "TABLE" && el.tagName != "DIV" && el.tagName != "SPAN"){
		while(el.tagName != "TR"){
			el = el.parentNode;
			if(el==null)return;
		}
		if(el.FLDP!=null && el.FLDP != ""){
			//tooltip.innerText = el.jd;
			//tooltip.innerText = "event.clientY " + event.clientY + "offsetY" + event.offsetY ;
			if(parent.document.getElementById("tooltip") != undefined){
			    parent.document.getElementById("tooltip").innerText = el.FLDP;
			    parent.document.getElementById("tooltip").style.left = event.clientX + 10;
			    parent.document.getElementById("tooltip").style.top = event.clientY + 310;
			    parent.document.getElementById("tooltip").style.zIndex = 1;
			    parent.document.getElementById("tooltip").style.display = "block";
			}else{
			    document.getElementById("tooltip").innerText = el.FLDP;
			    document.getElementById("tooltip").style.left = event.clientX + 10;
			    document.getElementById("tooltip").style.top = event.clientY + 10;
			    document.getElementById("tooltip").style.zIndex = 1;
			    document.getElementById("tooltip").style.display = "block";
			}
		}
	}
	//selftime = setTimeout("event_GalTable_onmousemove()",1000);
}
	</script>
</html>

