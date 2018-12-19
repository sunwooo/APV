<%@ Page Language="C#" AutoEventWireup="true" CodeFile="MonitorList.aspx.cs" Inherits="COVIFlowNet_ApvMonitor_MonitorList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
	<script language="javascript" type="text/javascript" src="/CoviWeb/common/script/CFL.js"></script>
	<script language="javascript" type="text/javascript" src="../../SiteReference/js/Dictionary.js"></script>
</head>
<body topmargin="0" leftmargin="0" onselectstart="return false;"  scroll="auto">
		<table style="width:100%;border:none" cellspacing="0" cellpadding="0">
			<tr> 
    				<td style="background-color:#598ACF;height:1px"></td>
  			</tr>
  			<tr> 
    				<td style="background-color:#DFECFD;height:4px"></td>
	  		</tr>
		</table>
		<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#c5c5c5" align="center">
			<tr>
				<td bgcolor="#FFFFFF">
					<table cellpadding="0" cellspacing="0" style="TABLE-LAYOUT: fixed" width="100%">
						<tr bgcolor="#f1f1f1">
							<td height="21" width="50" class='gallistheading' NOWRAP>구분</td>
							<td height="21" width="160" class='gallistheading' NOWRAP>양식</td>
							<td width="100%" class='gallistheading'>제목</td>
							<td width="50" class='gallistheading' NOWRAP>기안자</td>
							<td width="80" class='gallistheading' NOWRAP>기안부서</td>
							<td width="100" class='gallistheading' NOWRAP>기안/완료일자</td>
						</tr>
						<% //2003.03.22 황선희 수정	%>
						<%=	strList %>
					</table>
				  </td>
			</tr>
		</table>
		<div style="DISPLAY:none">
			<form id="menu"><input type="hidden" name="APVLIST"></form>
			<form id="editor"></form>
		</div>
		<script language="javascript" type="text/javascript">
		var m_xmlHTTP=new ActiveXObject("MSXML2.XMLHTTP");
		var g_eCurrentRow;
		var g_dicFormInfo = new Dictionary();
		g_dicFormInfo.Add("mode","READ");
		function showDetail(ProcInstID,SchemaID){
			parent.m_ProcInstID =  ProcInstID;
			
			requestHTTP("GET","../ApvlineMgr/getApvSteps.aspx?piid="+ProcInstID+"&scid="+SchemaID,true,"text/xml",receiveHTTP);
			return;
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
				if(m_xmlHTTP.responseText.charAt(0)=='\r'){
					alert(m_xmlHTTP.responseText);
				}else{
					menu.APVLIST.value = m_xmlHTTP.responseText.replace(/<\?xml version=\"1.0\" encoding=\"utf-8\"\?>/,"").replace(/<\?xml version=\"1.0\" encoding=\"euc-kr\"\?>/,"");
					//alert(menu.APVLIST.value);
					//menu.APVLIST.value = m_xmlHTTP.responseText;
					parent.monitor.location = "../ApvlineMgr/ApvlineViewer.htm";
					parent.graphic.drawGraphic(menu.APVLIST.value);
					//parent.monitorProcess.location="MonitorProcess.aspx?piid="+ m_ProcInstID;
				}
			}
		}
		function event_noop(){return(false);}
		var m_selectedRow=null;
		var m_selectedRowId=null;
		function selectRow(){
			var oRow;
			oRow=event.srcElement;

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
				if(m_selectedRow!=null)m_selectedRow.className="rowunselected";
				oRow.className="rowselected";
				m_selectedRow=oRow;
				m_selectedRowId=oRow.id;
			}
			showDetail(oRow.id, oRow.scid);
		}
		function event_ondblclick(){
			var oRow;
			oRow=event.srcElement;
			while(oRow!=null&&oRow.tagName!="TR"){
				oRow=oRow.parentNode;
			}
			if(oRow!=null){
				if(m_selectedRow!=null)m_selectedRow.className="rowunselected";
				oRow.className="rowselected";
				m_selectedRow=oRow;
				m_selectedRowId=oRow.id;
			}
			g_eCurrentRow = oRow;
			processSelectedRow();
		}
		function processSelectedRow(){
			//alert(parent.cboViewGoing.value);
			//var strURL ="../Forms/Form.aspx?mode=" + "COMPLETE"
			if(parent.cboViewGoing.value == 1) //진행중
			{
				var strURL ="../Forms/Form.aspx?mode=" + "PROCESS"
					+ "&piid=" + getRowAttribute(g_eCurrentRow,"piid") + "&pfid=" + getRowAttribute(g_eCurrentRow,"pfid")
					+ "&ptid=" + getRowAttribute(g_eCurrentRow,"participantid") + "&pist=" + getRowAttribute(g_eCurrentRow,"piviewstate")
					+ "&wiid=" + getRowAttribute(g_eCurrentRow,"workitemid") + "&bstate=" + getRowAttribute(g_eCurrentRow,"bstate")
					+ "&fmid=" + getRowAttribute(g_eCurrentRow,"fmid") + "&fmnm=" + toUTF8(getRowAttribute(g_eCurrentRow,"fmnm"))
					+ "&fmpf=" + getRowAttribute(g_eCurrentRow,"fmpf") + "&fmrv=" + getRowAttribute(g_eCurrentRow,"fmrv") + "&fiid=" + getRowAttribute(g_eCurrentRow,"fiid")
					+ "&ftid=" + getRowAttribute(g_eCurrentRow,"ftid") + "&fitn=" + getRowAttribute(g_eCurrentRow,"fitn") + "&scid=" + getRowAttribute(g_eCurrentRow,"scid")
					+ "&pfsk=" + getRowAttribute(g_eCurrentRow,"pfsk")+ "&pidc=" + "&pibd1=" + toUTF8(getRowAttribute(g_eCurrentRow,"pibd1"));//+ toUTF8(getRowAttribute(g_eCurrentRow,"pidc")) 
			}
			else if(parent.cboViewGoing.value == -1) // 완료
			{
				var strURL ="../Forms/Form.aspx?mode=" + "COMPLETE"
					+ "&piid=" + getRowAttribute(g_eCurrentRow,"piid") + "&pfid=" + getRowAttribute(g_eCurrentRow,"pfid")
					+ "&ptid=" + getRowAttribute(g_eCurrentRow,"participantid") + "&pist=" + getRowAttribute(g_eCurrentRow,"piviewstate")
					+ "&wiid=" + getRowAttribute(g_eCurrentRow,"workitemid") + "&bstate=" + getRowAttribute(g_eCurrentRow,"bstate")
					+ "&fmid=" + getRowAttribute(g_eCurrentRow,"fmid") + "&fmnm=" + toUTF8(getRowAttribute(g_eCurrentRow,"fmnm"))
					+ "&fmpf=" + getRowAttribute(g_eCurrentRow,"fmpf") + "&fmrv=" + getRowAttribute(g_eCurrentRow,"fmrv") + "&fiid=" + getRowAttribute(g_eCurrentRow,"fiid")
					+ "&ftid=" + getRowAttribute(g_eCurrentRow,"ftid") + "&fitn=" + getRowAttribute(g_eCurrentRow,"fitn") + "&scid=" + getRowAttribute(g_eCurrentRow,"scid")
					+ "&pfsk=" + getRowAttribute(g_eCurrentRow,"pfsk")+ "&pidc=" +  "&pibd1=" + toUTF8(getRowAttribute(g_eCurrentRow,"pibd1"));	//toUTF8(getRowAttribute(g_eCurrentRow,"pidc")) +						
			}
			else
			{
				var strURL ="../Forms/Form.aspx?mode=" + getRowAttribute(g_eCurrentRow,"mode")
					+ "&piid=" + getRowAttribute(g_eCurrentRow,"piid") + "&pfid=" + getRowAttribute(g_eCurrentRow,"pfid")
					+ "&ptid=" + getRowAttribute(g_eCurrentRow,"participantid") + "&pist=" + getRowAttribute(g_eCurrentRow,"piviewstate")
					+ "&wiid=" + getRowAttribute(g_eCurrentRow,"workitemid") + "&bstate=" + getRowAttribute(g_eCurrentRow,"bstate")
					+ "&fmid=" + getRowAttribute(g_eCurrentRow,"fmid") + "&fmnm=" + toUTF8(getRowAttribute(g_eCurrentRow,"fmnm"))
					+ "&fmpf=" + getRowAttribute(g_eCurrentRow,"fmpf") + "&fmrv=" + getRowAttribute(g_eCurrentRow,"fmrv") + "&fiid=" + getRowAttribute(g_eCurrentRow,"fiid")
					+ "&ftid=" + getRowAttribute(g_eCurrentRow,"ftid") + "&fitn=" + getRowAttribute(g_eCurrentRow,"fitn") + "&scid=" + getRowAttribute(g_eCurrentRow,"scid")
					+ "&pfsk=" + getRowAttribute(g_eCurrentRow,"pfsk")+ "&pidc=" +  "&pibd1=" + toUTF8(getRowAttribute(g_eCurrentRow,"pibd1"));//toUTF8(getRowAttribute(g_eCurrentRow,"pidc")) +
			}

			//alert(strURL);
			//if ((getRowAttribute(g_eCurrentRow,"fmpf") == "DRAFT") || (getRowAttribute(g_eCurrentRow,"fmpf") == "OUTERPUBLISH") || (getRowAttribute(g_eCurrentRow,"fmpf") == "ENFORCE")) {
				openWindow(strURL,"FORMSMONITOR",800,600,'fix');
			//}else{
			//	openWindow(strURL,"FORMS",710,600,'resize');
			//}
		}
		function getRowAttribute(elm,sName){var v=elm.getAttribute(sName);return (v==null?"":v);}		
		</script>
	</body>
</html>
