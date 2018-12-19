<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApvlinelistMgr.aspx.cs" Inherits="COVIFlowNet_ApvlineList_ApvlinelistMgr" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">	
	<title></title>
	<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>
</head>
<body>
<div class="popup_title">
  <div class="title_tl">
	<div class="title_tr">
	  <div class="title_tc">
	  <h2><%= Resources.Approval.lbl_privateapvsetupcomment_01 %>
		<select id='SelEnt' onchange="SetENT(this.value)" style="display:none;"></select>
	  </h2>
	  </div>
	</div>
  </div>
</div>
<div class="popup_box">
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tr>
		<td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_top_left.gif" /></td>
		<td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_top_bg.gif"></td>
		<td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_top_right.gif" /></td>
	  </tr>
	  <tr>
		<td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_left_bg.gif"></td>
		<td>
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
		  <tr>
			<td width="90" style=" padding-left: 10px;"><b><asp:Label runat="server" ID="msg_txt_apvline_name" /> :</b></td>
			<td style=" padding-top: 5px; padding-bottom: 5px;"><input type="text" class="type-text" id="title" name="title" maxlength="20" style=" width: 760px;" /></td>
		  </tr>
		  <tr>
			<td colspan="2" class="line"></td>
		  </tr>
		  <tr>
			<td style=" padding-left: 10px;"><b><asp:Label runat="server" id="msg_txt_apvline_comment" /> :</b></td>
			<td style=" padding-top: 5px; padding-bottom: 5px;"><input type="text" class="type-text" id="description" name="description" maxlength="50" style=" width: 760px;" /></td>
		  </tr>
		  <tr>
			<td colspan="2" class="line"></td>
		  </tr>
		  <tr>
			<td>&nbsp;</td>
			<td style=" padding-top: 10px;"><img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_!.gif" align="absmiddle" /> <font color="#992300"><asp:Label runat="server" ID="msg_txt_apvline_first_comment" /></font></td>
		  </tr>
		</table>
		</td>
		<td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_right_bg.gif"></td>
	  </tr>  
	  <tr>
		<td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_bottom_left.gif" /></td>
		<td background="<%=Session["user_thema"] %>/Covi/Common/box/box05_bottom_bg.gif"></td>
		<td width="9"><img src="<%=Session["user_thema"] %>/Covi/Common/box/box05_bottom_right.gif" /></td>
	  </tr>
	</table>
</div>
<div style="padding-top: 10px; padding-left: 5px; padding-right: 5px;">
  <!-- 등록 div 시작 -->
  <div class="write">
  <!-- 일반 div 시작 -->
	<div> 
	<iframe id="ApvlineViewer" frameborder="0" width="100%" height="200" src="../ApvlineMgr/ApvlinePrivate.aspx"></iframe>  
	</div>
 </div>
</div>
<div class="popup_Btn small AlignR">
  <a href="#" class="Btn04" id="btOK" name="cbBTN" onClick="doButtonAction(this);"><span><%= Resources.Approval.btn_confirm_setup %></span></a> 
  <a href="#" class="Btn04" id="btExit" name="cbBTN" onClick="doButtonAction(this);"><span><%= Resources.Approval.btn_close %></span></a>
</div>

<script language="javascript" type="text/javascript">
	if( top.opener.bState=="change"){
	
		document.getElementById("title").value = top.opener.document.getElementById("Apvline").contentWindow.m_title;
		document.getElementById("description").value = top.opener.document.getElementById("Apvline").contentWindow.m_dscr;
	}
	function setchangeApvlineList(){				
		var elmRoot = document.getElementById('ApvlineViewer').contentWindow.m_oApvList.documentElement;	
		
		if (chkConsultAppLine(elmRoot)){				
			var sText = '<request><type>change</type><id>'
			+top.opener.document.getElementById("Apvline").contentWindow.m_id+'</id><userid>'+top.opener.UserID
			+'</userid><title><![CDATA['+document.getElementById('title').value+']]></title><dscr><![CDATA['+document.getElementById('description').value+']]></dscr>'
			+elmRoot.xml+'</request>';
			
			evalXML(sText);

			m_xmlHTTP.open("POST","SetApvlist.aspx",true);
			//m_xmlHTTP.setRequestHeader("Accept-Language","ko");
			m_xmlHTTP.setRequestHeader("Content-type", "text/xml");
			m_xmlHTTP.onreadystatechange=receiveHTTP;
			m_xmlHTTP.send(sText);
		}else{
			return false;
		}
	}
	function setApvlineList(){		
		
		var elmRoot = document.getElementById('ApvlineViewer').contentWindow.m_oApvList.documentElement;	
		
		if (chkConsultAppLine(elmRoot)){
			var sText = '<request><type>add</type><id>'+top.opener.document.getElementById("Apvline").contentWindow.m_id
			+'</id><userid>'+top.opener.UserID+'</userid><title><![CDATA['+document.getElementById('title').value+']]></title><dscr><![CDATA['
			+document.getElementById('description').value+']]></dscr>'+elmRoot.xml+'</request>';
			evalXML(sText);

			m_xmlHTTP.open("POST","SetApvlist.aspx",true);
			//m_xmlHTTP.setRequestHeader("Accept-Language","ko");
			m_xmlHTTP.setRequestHeader("Content-type", "text/xml");
			m_xmlHTTP.onreadystatechange=receiveHTTP;
			m_xmlHTTP.send(sText);
		}else{
			return false;
		}
		
	}
	
</script>

<script language="javascript" type="text/javascript">
	function SetENT(m_EntCode)
	{
	  
		document.getElementById("ApvlineViewer").contentWindow.document.getElementById("iSearch").contentWindow.frameElement.src="search.aspx?Ent="+m_EntCode;
		document.getElementById("ApvlineViewer").contentWindow.document.getElementById("iGroup").contentWindow.frameElement.src="OrgTree.aspx?Ent="+m_EntCode;
	}
	function GetEnt(){
		var pXML = "dbo.usp_GetEntInfo";
		var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type></Items>" ;
		var szURL = "../GetXMLQuery.aspx";
		requestHTTP("POST",szURL,true,"text/xml",receiveHTTPEnt, sXML);
	}
	function receiveHTTPEnt(){
		if(m_xmlHTTP.readyState==4){
			m_xmlHTTP.onreadystatechange=event_noop;
			var xmlReturn=m_xmlHTTP.responseXML;
			if(xmlReturn.xml==""){
			
			}else{
				var errorNode=xmlReturn.selectSingleNode("response/error");
				if(errorNode!=null){
					alert("Desc: " + errorNode.text);
				}else{
					var m_oChargeList = CreateXmlDocument();
					m_oChargeList.loadXML(m_xmlHTTP.responseText);  
					var elmRoot = m_oChargeList.documentElement;
					var elmlist = elmRoot.selectNodes("NewDataSet/Table");
					var elm;
					var oOption = document.createElement("OPTION");
					
					
					//콤보 박스 초기화
					document.getElementById("SelEnt").length = 0;
					document.getElementById("SelEnt").options.add(oOption);
					oOption.text="<%=Resources.Approval.lbl_total %>";
					oOption.value="";
					
					for(var i = 0; i < elmlist.length; i++)
					{
						elm = elmlist.nextNode();
						
						var oOption = document.createElement("OPTION");
						document.getElementById("SelEnt").options.add(oOption);
						oOption.text=elm.selectSingleNode("NAME").text;
						oOption.value=elm.selectSingleNode("ENT_CODE").text;
					}
					if (elmlist.length > 0){
						//document.getElementById("SelEnt").style.display = "none";
					}
					
				}
			}
		}
	}
</script>
<script language="javascript" type="text/javascript">
	var m_evalXML = CreateXmlDocument();
	var m_xmlHTTP = CreateXmlHttpRequest();
	var sEntGroupYN = "<%=ConfigurationManager.AppSettings["WF_ENTGROUPYN"] %>";
	document.getElementById("SelEnt").value = '<%=Session["user_ent_code"].ToString()%>';
	if( ((top.opener.bState=="add") && (top.opener.document.getElementById("Apvline").contentWindow.m_id != "")) && (!confirm("<%= Resources.Approval.msg_092 %>"))){
		top.opener.document.getElementById("menu").APVLIST.value = "";
		if(sEntGroupYN == "T") GetEnt();
	}
	else if((top.opener.bState=="add") && (top.opener.document.getElementById("Apvline").contentWindow.m_id == ""))
	{//debugger;
		try
		{
			top.opener.document.getElementById("menu").APVLIST.value = "";
		}
		catch(e)
		{//이준희(2010-12-22): Added to support SharePoint environment.
			top.opener.document.getElementById('menu').childNodes[0].value = '';
		}
		if(sEntGroupYN == "T") GetEnt();
	}
	else
	{
		queryGetData();
	}

	function queryGetData() 
	{ 
		var szURL = "GetApvlist.aspx?PDD_ID="+top.opener.document.getElementById("Apvline").contentWindow.m_id;
		requestHTTP("GET",szURL,true,"text/xml",receiveHTTPStep,null);
	}

	function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
		m_xmlHTTP.open(sMethod,sUrl,bAsync);
		//m_xmlHTTP.setRequestHeader("Accept-Language","ko");
		m_xmlHTTP.setRequestHeader( "Content-type", sCType);
		if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
		(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
	}
	function receiveHTTPStep()
	{
		if(m_xmlHTTP.readyState==4)
		{
			m_xmlHTTP.onreadystatechange=event_noop;
			var m_id = top.opener.document.getElementById("Apvline").contentWindow.m_id;
			if(m_xmlHTTP.responseText.charAt(0)=='\r')
			{
				alert(m_xmlHTTP.responseText);
			}
			else
			{
				var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
				if(errorNode!=null)
				{
					alert("Desc: " + errorNode.text);
				}
				else
				{//수정 2010.03.10					
					var w_id = m_xmlHTTP.responseXML.selectSingleNode("response/item[id='"+m_id+"']/signinform/steps");
					//var w_id = m_xmlHTTP.responseXML.getElementsByTagName("response/item[id='"+m_id+"']/signinform/steps")[0];//$$
					var w_id_v;
					if(w_id != null)
					{ 
						w_id_v = w_id.xml;
						top.opener.document.getElementById('menu').APVLIST.value = w_id_v;
					}
					GetEnt();
				}
			}
		}
	}
	
	function doButtonAction(obj){		
		//switch(event.srcElement.id){
		
		switch(obj.id){
			case "btOK":
				if ( document.getElementById('title').value.length == 0 )
				{
					alert('<%=msg_err_apv_subject%>');
					document.getElementById('title').focus();return false;
				}
				//var elmRoot = ApvlineViewer.m_oApvList.documentElement;	
				var elmRoot = document.getElementById('ApvlineViewer').contentWindow.m_oApvList.documentElement;
				if (elmRoot.childNodes.length < 1)
				{
					alert('<%=msg_err_apv_line%>');
					return false;
				}
				if (top.opener.bState=="change"){
					setchangeApvlineList();
				}
				else{
					setApvlineList();
				}
				break;						
			case "btExit":	
				window.close();
				break;
		}
	}
	function receiveHTTP(){
		if(m_xmlHTTP.readyState==4){
			m_xmlHTTP.onreadystatechange=event_noop;
			if(m_xmlHTTP.responseText.charAt(0)=="\r"){
				alert(m_xmlHTTP.responseText);
			}else{
				var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
				if(errorNode!=null){
					alert("Desc: " + errorNode.text);
				}else{
					window.close();
					top.opener.location.reload();				
				}
			}
		}
	}
	function event_noop(){return(false);}
	function evalXML(sXML){
		if(!m_evalXML.loadXML(sXML)){
			var err = m_evalXML.parseError;
			throw new Error(err.errorCode,"desc:"+err.reason+"\nsrctxt:"+err.srcText+"\nline:"+err.line+"\tcolumn:"+err.linepos);
		}
	}
	
	function chkConsultAppLine(elmRoot){
		var emlSteps = elmRoot.selectNodes("division/step");
		var emlStep;
		var elmList = elmRoot.selectNodes("division/step[@unittype='person' and @routetype='approve']/ou/person");	// 2004.10.26 update
		var elm, elmTaskInfo;	// 2004.10.26 update
		var HasApprover = false;
		var HasConsult = false;
		var HadReviewer = false;	// 2004.10.26 update
		var PreConsult = false ;	// 2004.10.26 update
		var EndReviewer = false ;	// 2004.10.26 update
		var CurConsult = false ;	// 2004.10.26 update

		for(var i=0; i< emlSteps.length;i++){
			emlStep=emlSteps.nextNode();
			if (emlStep.getAttribute("routetype") == "consult" || emlStep.getAttribute("routetype") == "assist" )	HasConsult = true;
			if (i==emlSteps.length-2 && emlStep.getAttribute("routetype") == "consult")	PreConsult = true ;	// 2004.10.26 update
			if (i==emlSteps.length-1 && emlStep.getAttribute("routetype") == "consult")	CurConsult = true ;	// 2004.10.26 update
		}
		// 2004.10.26 update 
		for (var j=0; j<elmList.length;j++) {
			elm = elmList.nextNode();
			elmTaskInfo = elm.selectSingleNode("taskinfo");
			if (j==elmList.length-1 && elmTaskInfo.getAttribute("kind") == "review")	EndReviewer = true ;	// 2004.10.26 update
		}
		//

		if ( HasConsult ){
			if (emlStep.getAttribute("routetype") == "approve" && elmTaskInfo.getAttribute("kind") != "review") HasApprover = true;	// 2004.10.26 update
		}
		if ( HasConsult ){
			if ( HasApprover == true ) {
				return true;
			}else{
				// 2004.10.26 update 
				if (PreConsult && EndReviewer){
					alert("<%=msg_err_apv_line_last%>");return false;
				}else{
					if (CurConsult){				
						alert("<%=msg_err_apv_agree%>");return false;
					}else{return true;}
				}
				//
			}
		}else{
			return true;
		}
	}
</script>
	
</body>
</html>
