<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Apvline.aspx.cs" Inherits="COVIFlowNet_ApvlineList_Apvline" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<title></title>
		<script type="text/javascript" language="javascript" src="../../SiteReference/js/Utility.js"></script>
		<script type="text/javascript" language="javascript" src="../../SiteReference/js/Dictionary.js"></script>
	</head>
	<body onselectstart="return false;">
		<div id='divGalTable' class="BTable"></div>
	</body>
	<script language="javascript" type="text/javascript">
	
	var m_xmlHTTP = CreateXmlHttpRequest();
	var m_xmlDOM = CreateXmlDocument();
	/* 웹표준화로수정
	var m_xmlHTTP=new ActiveXObject("MSXML2.XMLHTTP");
	var m_xmlDOM=new ActiveXObject("MSXML2.DOMDocument");*/
	var bState="";
	var g_dicFormInfo = new Dictionary();
	
    var m_id="";
    var m_title="";
    var m_dscr="";
    
    //window.onload= initOnload;
    function initOnload()
    {
        window.parent.document.onreadystatechange = initialize;
	    return;	
    }
    /* 웹표준화로수정
    function window.onload(){
	    window.parent.document.onreadystatechange = initialize;
	    return;	
    }*/
    function initialize(){
	    if(window.parent.document.readyState == "complete"){
		    //window.parent.document.onreadystatechange = noop;
		   //window.parent.initialize();
	   	    
	    }
    }
    function noop(){return;}
    function changerChk(obj){
        if (obj == null){
	        if (document.getElementsByName("rChk").length==null){
		        m_id = document.getElementsByName("rChk").id;
		        m_title = document.getElementsByName("rChk").title;
		        m_dscr = document.getElementsByName("rChk").dscr;
        //		setApvlist();
		        selectRow(document.getElementsByName("rChk").id);
	        }
	        else{
		        var x = document.getElementsByName("rChk");
		        for(i=0;i<x.length;i++){
			        if (x[i].checked) {
				        m_id = x[i].getAttribute("id");
				        m_title = x[i].getAttribute("title");
				        m_dscr = x[i].getAttribute("dscr");
        //				setApvlist();
				        selectRow(x[i].getAttribute("id"));
			        }
		        }
	        }
	    }else{
	        if (document.getElementsByName("rChk").length==null){
		        m_id = document.getElementsByName("rChk").id;
		        m_title = document.getElementsByName("rChk").title;
		        m_dscr = document.getElementsByName("rChk").dscr;
        //		setApvlist();
		        selectRow(document.getElementsByName("rChk").id);
	        }
	        else{
		        var x = document.getElementsByName("rChk");
		        for(i=0;i<document.getElementsByName("rChk").length;i++){
			        if (x[i].id == obj.id) {
				        m_id = x[i].id;
				        m_title = x[i].title;
				        m_dscr = x[i].dscr;
        //				setApvlist();
				        selectRow(obj);
				        x[i].checked = true;
			        }
		        }
	        }	    
	    }
    }
    function setApvlist(){
	    window.parent.menu.APVLIST.value = window.parent.m_xmlHTTP.responseXML.selectSingleNode("response/item[id='"+m_id+"']/signinform/steps").xml;
    }

    var m_selectedRow=null;
    var m_selectedRowId=null;
    function selectRow(id){
	    var oRow;
	    //alert(event.srcElement.parentElement.tagName);
   	   // oRow=event.srcElement.parentElement;
   	   if(evt != null) 	    oRow = evt.parentElement;

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
		    if(m_selectedRow!=null) {
		        //m_selectedRow.className="";
		        //m_selectedRow.style.backgroundColor ="#ffffff";
		        //m_selectedRow.style.color ="#000000";
		    }
		    //oRow.className="rowselected";
		    oRow.style.backgroundColor = "#f8f4de";//"highlight";
		    //oRow.style.color = "#333333";//"highlighttext";	
		    m_selectedRow=oRow;
		    m_selectedRowId=oRow.id;
	    }
    }
    //2008.11.04 by wolf Row Click시 라디오 버튼 처리
    var evt;
    function onSelectRow(e){
		if (window.event) e = window.event; 
		evt = e.srcElement? e.srcElement : e.target;
    
        if (document.getElementsByName("rChk").length==null){
		    document.getElementsByName("rChk").checked = true;
	    }
	    else{
	        var x = document.getElementsByName("rChk");
		    for(i=0;i<document.getElementsByName("rChk").length;i++){
			    if (e.id == x[i].id) {
				    x[i].checked = true;
			    }
		    }
	    }
	    changerChk();
    	
    }
	</script>
</html>
