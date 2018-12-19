<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DeploylineList.aspx.cs" Inherits="DeployList_DeploylineList" %>
<%@ Register Src="../Portal/UxFooter.ascx" TagName="UxFooter" TagPrefix="ucfooter" %>
<%@ Register Src="../Portal/UxQuickMenu.ascx" TagName="UxQuickMenu" TagPrefix="ucquickmenu" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
    <head id="Head1" runat="server">
        <title>배포</title>
        <script type="text/javascript" language="javascript" src="../../common/script/CFL.js"></script>
        <script type="text/javascript" language="javascript" src="../../common/script/COVIFlowNet/openWindow.js"></script>
        <script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
        <script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Dictionary.js"></script>
    </head>
<body>
  <div id="SubWidth">
     <!-- 본문영역 시작 -->
      <!-- 타이틀 영역 div 시작 -->
      <div class="Title">
        <h1><asp:Label runat="server" ID="ApvlinelistPageName" /></h1>
        <!-- 네비게이션 영역 시작 -->
        <ul class="small" style="display:none;">
          <li>Home&gt;</li>
          <li><asp:Label runat="server" ID="ApvlinelistPagePath" />&gt;</li>
          <li><b><asp:Label runat="server" ID="ApvlinelistPageName2" /></b></li>
        </ul>
        <!-- 네비게이션 영역 끝 -->
      </div>
      <!-- 타이틀 영역 div 끝 -->
      <!-- 버튼 영역 div 시작 -->
      <div class="n_btntb">
            <ul style="padding-top:2px;">
                <li><a id="btn_register" class="btnov"  href="#" onclick="javascript:addSignLine();" style="cursor:default;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_register.gif" align="middle" /><%=Resources.Approval.btn_register %><!--등록--></span></a></li> 
                <li><a id="btn_modify"  class="btnov" href="#" onclick="javascript:changeSignLine();" style="cursor:default;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_revision.gif" align="middle" /><%=Resources.Approval.btn_modify %><!--수정--></span></a></li>
                <li><a id="btn_delete"  class="btnov" href="#" onclick="javascript:deleteSignLine();" style="cursor:default;"><span><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon01_delete.gif" align="middle" /><%=Resources.Approval.btn_delete %><!--삭제--></span></a></li>
            <!-- 분류 select div 끝 -->
            </ul>
      </div>                                 
      <!-- 버튼 영역 div 끝-->  
      <div class="BTable" id="divApvline"></div>
        <%--<iframe id="Apvline" width='100%' height='100%' frameborder='0' src='Deployline.aspx' style='PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px; scroll:auto'></iframe>--%>
        <!--footer start-->
		<ucfooter:UxFooter ID="UxFooter1" runat="server" />
		<!--footer end -->
    </div>
    <!--quick Menu-->
	<ucquickmenu:UxQuickMenu ID="UxWF_Footer" runat="server" />
	<!--quick End-->
    <!-- 결재선 테이블 시작-->
    <div style="DISPLAY:none">
        <form id="menu"><input type="hidden" name="APVLIST"></form>
        <form id="editor"></form>
    </div>
    <!-- 결재선 테이블 끝-->
    <!-- 본문영역 끝-->
    <script language="javascript" type="text/javascript">
        var m_xmlHTTP = CreateXmlHttpRequest();      
        var m_xmlDOM = CreateXmlDocument();
		var UserID = "<%=UserID%>";
		var bState="";
		var chkform="ok"; //동시결재 버튼 개인결제선일때만 안보이게 처리하기 위한 상태체크 2007.06.22 박동현
		var g_dicFormInfo = new Dictionary();
		var m_xmlXSL = ""; 
		
		g_dicFormInfo.Add('mode','APVLINE');
		g_dicFormInfo.Add('etid','<%=Session["user_ent_code"].ToString().ToString()%>');
        window.onload= initOnload;
        function initOnload()
        {
            var iFrame = null;
            //iframe별 브라우져별 생성에 대한 제약사항이 다름
	    //자식 창의 페이지가 로딩 상태를 확인
	    //smkim if 문 주석
//            if ("ActiveXObject" in window) {
//                iFrame = document.createElement('<iframe  name="Apvline"  width="100%" height="100%" frameborder="0" style="PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px;" />');
//	        iFrame.onreadystatechange = initialize;
//            } else {
                        iFrame= document.createElement("IFRAME");
		        iFrame.addEventListener('load',initialize, false);
		        iFrame.style.height = "100px";
		        iFrame.style.width = "100%";
		        iFrame.style.border = "0";
//            }
		    //if(window.addEventListener){
		    //    iFrame= document.createElement("IFRAME");
		    //    iFrame.addEventListener('load',initialize, false);
		    //    iFrame.style.height = "100px";
		    //    iFrame.style.width = "100%";
		    //    iFrame.style.border = "0";
		    //}else{
		    //    iFrame = document.createElement('<iframe  name="Apvline"  width="100%" height="100%" frameborder="0" style="PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px;" />');
		    //    iFrame.onreadystatechange = initialize;
		    //}
		    iFrame.id = "Apvline";
		    iFrame.src = "Deployline.aspx";
		    
		    //최소 생성시와 재 호출시에 대한 상황별 iframe 실제 로딩
            if (document.getElementById("divApvline").hasChildNodes() == true) {
                if ("ActiveXObject" in window) {
                    window.frames["Apvline"].location.reload();
                } else {
                    document.getElementById("Apvline").src = "Circulationline.aspx";
                }
		        //if(window.addEventListener){
		        //    document.getElementById("Apvline").src = "Circulationline.aspx";
		        //}else{
		        //    window.frames["Apvline"].location.reload();
		        //}			        
		    }else{
		        document.getElementById("divApvline").appendChild(iFrame);
			    //iFrame.style = "width:100%; height:100%; frameborder:0px;";
		    }
        }
        function initialize() {
        	//XSL 파일 XML Load 방식 변경 hichang			
        	getXSL();
        	queryGetData();
		
					
//		    //웹표준화로수정
//		    if (!window.ActiveXObject) {
//		        getXSL();
//		    }else{
//			    queryGetData();
//			}
//			//웹표준화로수정
		}
		function getXSL(){
		    bState = "XSL";
			var szURL = "DeploylineXSL.aspx";
			requestHTTP("GET", szURL, false, "text/xml", null, null);
			receiveHTTPXSL();
		}
		function queryGetData() 
		{
			var szURL = "GetDeploylist.aspx?USER_ID="+UserID;
			requestHTTP("GET", szURL, false, "text/xml", null, null);
			receiveHTTP();

		}

		//XSL 파일 XML Load 방식 변경 hichang			
		function receiveHTTPXSL() {
			if (m_xmlHTTP.status == 200) {
				m_xmlXSL = m_xmlHTTP.responseText;
			}
		} 
		
		function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
			m_xmlHTTP.open(sMethod,sUrl,bAsync);				
			m_xmlHTTP.setRequestHeader( "Content-type", sCType);
			if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
			(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
		}


		//XSL 파일 XML Load 방식 변경 hichang			
		function receiveHTTP() {
			if (m_xmlHTTP.readyState == 4) {
				m_xmlHTTP.onreadystatechange = event_noop;
				if (m_xmlHTTP.responseText.charAt(0) == '\r') {
					alert(m_xmlHTTP.responseText);
				} else {
					refreshList(m_xmlHTTP.responseXML);
				}
			}
		}
		//XSL 파일 XML Load 방식 변경 hichang_backup			
		function receiveHTTP_back(){
			if(m_xmlHTTP.readyState==4){
				m_xmlHTTP.onreadystatechange=event_noop;
				if(m_xmlHTTP.responseText.charAt(0)=='\r'){
					alert(m_xmlHTTP.responseText);
				}else{
				    //웹표준화로수정
				    if(bState=="XSL"){
				       var parser = new DOMParser();
                        m_xmlDOM=parser.parseFromString(m_xmlHTTP.responseText,"text/xml");
                        bState ="";
                        queryGetData() ;
                    //웹표준화로수정
                    }else{				
					    var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
					    if(errorNode!=null){
						    alert("Desc: " + errorNode.text);
					    }else{
						    if (bState=="delete"){
							    window.location.reload();
						    }
						    else{
							    refreshList(m_xmlHTTP.responseXML);
						    }
					    }
					}
				}
			}
		}
		function event_noop() { return (false); }

		
		function refreshList(oDOM)//XSL 파일 XML Load 방식 변경 hichang
		{//debugger;
			{//이준희(2011-03-11): Added to prevent an error due to a mistiming.
			try
			{
				document.getElementById('Apvline').contentWindow.document.getElementById('divGalTable').innerHTML;
			}
			catch(e)
			{
				return;
			}
			}
			var iframeheight = oDOM.documentElement.selectNodes("//item").length * 30 + 35;
			if (iframeheight == 35) {
				iframeheight = iframeheight + 50;
			}
			try {
				//                    if(window.addEventListener){
				//                        document.getElementById("Apvline").style.height = iframeheight+"px";
				//                        document.getElementById("Apvline").contentWindow.document.getElementById("divGalTable").innerHTML =  oDOM.transformNode(m_xmlDOM);
				//                    }else{
				//            m_xmlDOM.async = false;
				//            m_xmlDOM.load("ApvlineXSL.aspx");//Apvline.xsl 
				//                     Apvline.divGalTable.innerHTML = oDOM.transformNode(m_xmlDOM);
				//                     Apvline.frameElement.height = iframeheight+"px";
				//                    }
				document.getElementById("Apvline").style.height = iframeheight + "px";
				var sXML = "<Items><xml><![CDATA[" + oDOM.xml.replace(/<!\[CDATA\[/gi, "@CDATASTART").replace(/\]\]>/gi, "@CDATAEND") + "]]></xml><xslxml><![CDATA[" + m_xmlXSL + "]]></xslxml></Items>";
				var szURL = "/CoviWeb/Approval/getXMLXslParsing.aspx";//debugger;
				requestHTTP("POST", szURL, false, "text/xml; charset=utf-8", null, sXML);
				receiveHTTPXSLXML();

			} catch (e) {
			alert("<%=msg_err_apv %>" + "at refreshList in DeploylineList.aspx\nError Desc:" + e.description);
			}
		}
		//XSL 파일 XML Load 방식 변경 hichang			
		function receiveHTTPXSLXML() {
			if (m_xmlHTTP.readyState == 4) {
				m_xmlHTTP.onreadystatechange = event_noop;
				var xmlReturn = m_xmlHTTP.responseXML;
				//if(xmlReturn.xml==""){
				if (m_xmlHTTP.responseText.charAt(0) == '\r') {
					alert(m_xmlHTTP.responseText);
				}
				else {
					if (window.addEventListener) {
						document.getElementById("Apvline").contentWindow.document.getElementById("divGalTable").innerHTML = xmlReturn.documentElement.xml;
					}
					else
					{//alert(0);
						document.getElementById("Apvline").contentWindow.document.getElementById("divGalTable").innerHTML = xmlReturn.documentElement.xml;
					}
				}
			}
		}
		
		function addSignLine(){
			bState="add";
			//다국어 처리 하면서 고쳐준 부분
			CoviWindow("DeploylinelistMgr.aspx","ApvlinelistMgr",950,650,'fix');	
			return;	
		}
		function changeSignLine(){
		    var delid = "";
		    
            if(window.addEventListener){
                delid = document.getElementById("Apvline").contentWindow.m_id;
            }else{
                delid = Apvline.m_id;
	        }			
			if (delid!=""){		
				bState="change";
				//다국어 처리 하면서 고쳐준 부분
				CoviWindow("DeploylinelistMgr.aspx","ApvlinelistMgr",950,650,'fix');
			}
			else{
				alert("<%=msg_err_apv_select %>");
			}
			return;	
		}
		function deleteSignLine(){
		    var delid = "";
            if(window.addEventListener){
                delid = document.getElementById("Apvline").contentWindow.m_id;
            }else{
                delid = Apvline.m_id;
	        }			
			if (delid!=""){		
				bState="delete";
				var sText = "<request><type>delete</type><id>"+delid+"</id></request>";

				m_xmlHTTP.open("POST","SetDeploylist.aspx",true);
				m_xmlHTTP.setRequestHeader("Accept-Language","ko");
				m_xmlHTTP.setRequestHeader("Content-type", "text/xml");
				m_xmlHTTP.onreadystatechange = receiveHTTPdeleteSignLine;
				m_xmlHTTP.send(sText);
				document.getElementById("Apvline").contentWindow.m_id = "";
				//등록된 결재선을 모두지운후 바로 등록시 템플릿 사용관련 confirm창 뜨기 방지 by ssuby 2011-01-07
            }
			else{
				alert("<%=msg_err_apv_delete%>");
			}
			return;
        }
        //등록된 결재선 삭제 시 결재선 저장 건수 없음 오류 수정 sunnyhwang 2011-01-18
        function receiveHTTPdeleteSignLine() {
            if (m_xmlHTTP.readyState == 4) {
                m_xmlHTTP.onreadystatechange = event_noop;
                if (m_xmlHTTP.responseText.charAt(0) == '\r') {
                    alert(m_xmlHTTP.responseText);
                } else {
                    queryGetData();
                }
            }
        }		
		function mastermail() {
			var modeUrl	= "http://" + window.document.location.host + "/CoviGWNet/person/mail/GGOI_newpost_W01.aspx?Cmd=new&MailTo=webmaster" ;
			CoviFullWindow(modeUrl,'','resize');
		}
		function CoviFullWindow(fileName,windowName,etcParam) {
			var x = 800;
			var y = 600;
			var sx = window.screen.width  / 2 - x / 2;
			var sy = window.screen.height / 2 - y / 2 - 40;
			if (etcParam == 'fix') 
			{
				etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0";
			}else if (etcParam == 'resize') 
			{
				etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1";
			}else if (etcParam == 'scroll') 
			{
				etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1";
			}

			if (sy < 0 ) sy = 0;	
			var sz = ",top=" + sy + ",left=" + sx;
			if (windowName == "newMessageWindow") windowName = new String(Math.round(Math.random() * 100000));					
			var sFeature = etcParam + ",width=" + x + ",height=" + y + sz;

            //창사이즈 강제적용함수 호출
            var strNewFearture = ModifyWindowFeature(sFeature);

            window.open(fileName,windowName, strNewFearture);
		}
		function MM_reloadPage(init) {  //reloads the window if Nav4 resized
		  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
		    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
		  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
		}
		MM_reloadPage(true);

		/* 그림을 클릭시에 테두리에 점선이 나타나는것을 없애는 스크립트. */
		function bluring(){ 
		if(event.srcElement.tagName=="A"||event.srcElement.tagName=="IMG") document.body.focus(); 
		} 
		document.onfocusin=bluring;

		function MM_openBrWindow(theURL,winName,features) { 		  

            //창사이즈 강제적용함수 호출
            var strNewFearture = ModifyWindowFeature(features);
		    window.open(theURL,winName,strNewFearture);
		}
    </script>	
</body>
</html>
