<%@ Page Language="C#" AutoEventWireup="true" CodeFile="listitemsapproveline.aspx.cs" Inherits="Approval_listitemsapproveline" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Approval Line</title>
        <script language="javascript" type="text/javascript" src="../SiteReference/js/utility.js"></script>
        <script type="text/javascript" language="javascript" src="../SiteReference/js/Dictionary.js"></script>
</head>
<body style="overflow:hidden; margin-left:0; margin-right:0; margin-top:0; margin-bottom:0;">
    <div class="tab01 small">
      <ul>
        <li id="divtabApvLine" class="current"><a href="#" class="s1" onclick="javascript:changeApv(this,'spanApvLine','','spanApvGraphic','none', '');" id="tabApvLine" name="tabApvLine"><span><%= Resources.Approval.lbl_list%></span></a></li>
        <li id="divtabApvGraphic"><a href="#" class="s1" onclick="javascript:changeApv(this,'spanApvLine','none','spanApvGraphic','', '');" id="tabApvGraphic" name="tabApvGraphic"><span><%= Resources.Approval.lbl_graphic%></span></a></li>
        <li id="divtabAttach"><a href="#" class="s1" onclick="javascript:changeApv(this,'spanApvLine','none','spanApvGraphic','none', 'file');" id="tabAttach" name="tabAttach"><span><%= Resources.Approval.lbl_AttachList %></span></a></li>
        <li id="divtabReceipt"><a href="#" class="s1" onclick="javascript:changeApv(this,'spanApvLine','none','spanApvGraphic','none', 'receipt');" id="tabReceipt" name="tabReceipt"><span><%= Resources.Approval.lbl_receipt_view %></span></a></li>
        <li id="divtabReadDoc"><a href="#" class="s1" onclick="javascript:changeApv(this,'spanApvLine','none','spanApvGraphic','none', 'read');" id="tabReadDoc" name="tabReadDoc"><span><%= Resources.Approval.lbl_ReadCheck %></span></a></li>
        <li><span class="list_right"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_x.gif" onclick="javascript:parent.document.getElementById('PopLayerAPV').style.display='none';" /></span></li>            
      </ul>
    </div>
    <span>
        <span id="spanApvLine" name="spanApvLine">
		<iframe id="iApvLine" name="iApvLine" style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px;" width="645" height="250" frameborder="0" src="about:blank" datasrc="../ApvlineMgr/ApvlineViewer.aspx" ></iframe>
		</span>
		<span id="spanApvGraphic" style="DISPLAY: none" name="spanApvGraphic">
		<iframe id="iApvGraphic"name="iApvGraphic"  style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; scroll: auto" dataSrc="./ApvMonitor/MonitorGraphic.aspx" src="./ApvMonitor/MonitorGraphic.aspx" frameborder="0" width="650" height="255"></iframe>
		</span>      
		<span id="spanAttach" style="DISPLAY: none" name="spanAttach">
		<iframe id="iAttach"name="iAttach"  style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; scroll: auto"  src="about:blank" frameborder="0" width="645" height="250"></iframe>
		</span>     
		<span id="spanReceipt" style="DISPLAY: none" name="spanReceipt">
		<iframe id="iReceipt"name="iReceipt"  style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; scroll: auto"  src="about:blank" frameborder="0" width="645" height="250"></iframe>
		</span> 
		<span id="spanReadDoc" style="DISPLAY: none" name="spanReadDoc">
		<iframe id="iReadDoc"name="iReadDoc"  style="PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; scroll: auto"  src="about:blank" frameborder="0" width="645" height="250"></iframe>
		</span> 
    </span>
		<div style="DISPLAY:none">
			<form id="menu"><input type="hidden" name="APVLIST"></form>
			<form id="editor"></form>
		</div>	
		<input type="hidden" id="hidType" />
  <!-- context menu 관련 뿌리기 끝-->
    <script language="javascript" type="text/javascript">
        ////////////////////////결재선 조회 메뉴 보여주기///////////////////////
		var g_dicFormInfo = new Dictionary();
		g_dicFormInfo.Add("mode","READ");
        var m_ProcInstID="";
        var m_xmlHTTP= CreateXmlHttpRequest();
        var piid = "<%=Request.QueryString["piid"] %>";
        var scid = "<%=Request.QueryString["scid"] %>";
        var fmpf ="<%=Request.QueryString["fmpf"] %>";
        var fmrv ="<%=Request.QueryString["fmrv"] %>";
        var fiid ="<%=Request.QueryString["fiid"] %>";
       
        window.onload= initOnload;
        function initOnload()
        {
            //showDetail(oPiid, oScid);
        }
        function showDetail(ProcInstID,SchemaID){      
            changeApv(document.getElementById("tabApvLine"), "spanApvLine", "", "spanApvGraphic", "none", "");
            window.focus();
            if (ProcInstID != ""){
                m_ProcInstID =  ProcInstID;
                requestHTTP("GET","./ApvlineMgr/getApvSteps.aspx?piid="+ProcInstID+"&scid="+SchemaID,true,"text/xml",receiveHTTPMonitor);
            }
            return;
        } 
        function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	        m_xmlHTTP.open(sMethod,sUrl,bAsync);
	        //m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
	        m_xmlHTTP.setRequestHeader("Content-type", sCType);
	        if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	        (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
        	
        }
        function event_noop(){return(false);} 
        function receiveHTTPMonitor(){
	        if(m_xmlHTTP.readyState==4){
		        m_xmlHTTP.onreadystatechange=event_noop;
		        if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			        alert(m_xmlHTTP.responseText);
		        }else{
			        document.getElementById("menu").APVLIST.value = m_xmlHTTP.responseText.replace(/<\?xml version=\"1.0\" encoding=\"utf-8\"\?>/,"").replace(/<\?xml version=\"1.0\" encoding=\"euc-kr\"\?>/,"");
			        iApvLine.location = "./ApvlineMgr/ApvlineViewer.aspx";
			        document.getElementById("iApvGraphic").contentWindow.drawGraphic(document.getElementById("menu").APVLIST.value);
		        }
	        }
        }
        var selApv = "tabApvLine" ;
		function changeApv(selTab, oApvLine, strApvlineDisp, oApvGraphic, strApvGraphicDisp, type) {
			if (selTab.name != selApv) {
			    document.getElementById("div"+selApv.replace("_","")).className = "" ;
			    document.getElementById("div"+selTab.id.replace("_","")).className = "current" ;

				selApv = selTab.name ;
				document.getElementById(oApvLine).style.display = strApvlineDisp ;
				document.getElementById(oApvGraphic).style.display = strApvGraphicDisp;
				if(selApv == "tabAttach"){
				    document.getElementById("spanAttach").style.display = "";
				    document.getElementById("spanReceipt").style.display = "none";
				    document.getElementById("spanReadDoc").style.display = "none";
				}
				else if(selApv == "tabReceipt"){
				    document.getElementById("spanAttach").style.display = "none";
				    document.getElementById("spanReceipt").style.display = "";
				    document.getElementById("spanReadDoc").style.display = "none";
				}
				else if(selApv == "tabReadDoc"){
				    document.getElementById("spanAttach").style.display = "none";
				    document.getElementById("spanReceipt").style.display = "none";
				    document.getElementById("spanReadDoc").style.display = "";
				}
				else{
				    document.getElementById("spanAttach").style.display = "none";
				    document.getElementById("spanReceipt").style.display = "none";
				    document.getElementById("spanReadDoc").style.display = "none";
				}				
				if(type == "file"){
                    iAttach.location.href = "./ApvInfoList/AttachFileList.aspx?fmpf="+fmpf+"&fmrv="+fmrv+"&fiid="+fiid+"&type="+type;
				}
				else if(type == "receipt"){
				    iReceipt.location.href = "./ApvInfoList/AttachFileList.aspx?fmpf="+fmpf+"&fmrv="+fmrv+"&fiid="+fiid+"&type="+type+"&piid="+piid;
				}
				else if(type == "read"){
				    iReadDoc.location.href = "./ApvInfoList/AttachFileList.aspx?fmpf="+fmpf+"&fmrv="+fmrv+"&fiid="+fiid+"&type="+type+"&piid="+piid;
				}
			}
		}
         
    </script>   		  
</body>
</html>
