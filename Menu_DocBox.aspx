<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Menu_DocBox.aspx.cs" Inherits="Approval_Menu_DocBox" %>



<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="head1" runat="server">
    <title>전자결재</title>
	<script type="text/javascript" language="javascript" src="../common/script/CFL.js"></script>
	<script type="text/javascript" language="javascript" src="common/function.js"></script>
	<script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>
    <style type="text/css" title="defaultStyle">
    <!--
			html, body
			{
				height: 100%;
				overflow:hidden;/* Required */
			}
    -->
    </style>
</head>
<body>

<table border="0"  style="height:100%;vertical-align:top;" cellpadding="0" cellspacing="0">
	<tr style="height:70px;">
		<td>

<div id='n_leftm'>

            <!-- 타이틀 플래시 영역 시작 -->
            <div id="n_lefttop"><img src="<%=Session["user_thema"] %>/Covi/Doc/lnb_document.jpg" /></div>
            <!-- 타이틀 플래시 영역 끝 -->
            </div>
        </td>
	</tr>
	<tr style="height:100%;vertical-align:top;">
	    <td class="n_leftcnt" style="padding-left: 10px;">
            <!-- 메뉴 영역 시작 -->
             <span>
                <%=Resources.Approval.lbl_ent%> : <select id='SelEnt' onchange="SetENT(this.value)"></select>
            </span>
                    
            <div style="overflow-x:auto; overflow-y:auto; height:100%; width:175px;">
             <ul class="m_list">
      <!-- 개인문서함 시작 -->
      <li class="line_bg" id="docbox1" style="display:none;">
      <a href="#" class="mmenu"><span onclick="gotoFolder('list.aspx?barchived=true&amp;uid=' + uid + '&amp;location=COMPLETE','미결함');switchSubMenu('target_1');ChangType('menu_1_2');"><b ><asp:Label ID="lbl_doc_person2" runat="server"></asp:Label></b>&nbsp;</span><span id="fnPersonDoc"  style="display:none"><img onclick="javascript:fnPersonDocView();switchSubMenu('fnPersonDoc');" src="<%=Session["user_thema"] %>/Covi/btn/btn_icon03_decide-sch.gif" align="abmiddle" alt="<%= Resources.Approval.lbl_admin_approvalMenu_08 %>" /></span></a>
          <!-- 서브 메뉴 시작 -->
          <div id="submenu" name="target_1" style="display:none;" >
            <ul class="s_list"  >
              <li id='menu_1_4'><a href="javascript:onclick=gotoFolder('list.aspx?barchived=true&amp;uid=' + uid + '&amp;location=COMPLETE','완료함');ChangType('menu_1_4');" class="smenu"><asp:Label ID="lbl_doc_complete2" runat="server"></asp:Label></a></li>
              <li id='menu_1_5'><a href="javascript:onclick=gotoFolder('list.aspx?barchived=true&amp;uid=' + uid + '&amp;location=REJECT','반려함');ChangType('menu_1_5');" class="smenu"><asp:Label ID="lbl_doc_reject2" runat="server"></asp:Label></a></li>
              <li id='menu_1_7'><a href="javascript:onclick=gotoFolder('list.aspx?barchived=true&amp;uid=' + uid + '&amp;location=CCINFO','통보함');ChangType('menu_1_7');" class="smenu"><asp:Label ID="lbl_doc_reference2" runat="server"></asp:Label></a></li>
              <li id='menu_1_9'><a href="javascript:onclick=gotoFolder('list.aspx?barchived=true&amp;uid=' + uid + '&amp;location=REVIEW1','공람함');ChangType('menu_1_9');" class="smenu"><asp:Label ID="lbl_doc_review" runat="server" /></a></li>
            </ul>
          </div>
        <!-- 서브 메뉴 끝 -->
        </li>
      <!-- 개인문서함 끝 -->
      <!-- 부서문서함 시작 -->
      <li class="line_bg" id="docbox2" style="display:none;">
        <a href="#"  class="mmenu"><span onclick="javascript:gotoFolder('listDept.aspx?barchived=true&amp;uid=' + deptid + '_A' + '&amp;location=DEPART','부서문서함');switchSubMenu('target_2');ChangType('menu_4_1');"><b><asp:Label ID="lbl_doc_deptcomplet" runat="server"></asp:Label></b></span>&nbsp;<span id="fnUnitDoc"  style="display:none"><img onclick="javascript:fnUnitDocView();switchSubMenu('fnUnitDoc');" src="<%=Session["user_thema"] %>/Covi/btn/btn_icon03_decide-sch.gif" align="abmiddle" alt="<%= Resources.Approval.lbl_admin_approvalMenu_14 %>" /></span></a>
        
          <!-- 서브 메뉴 시작 -->
          <div id="submenu" name="target_2"  style="display:none;">
            <ul class="s_list">
              <li id='menu_4_1'><a href="javascript:onclick=gotoFolder('listDept.aspx?barchived=true&amp;uid=' + deptid + '_A' + '&amp;location=DEPART','부서함');ChangType('menu_4_1');" class="smenu"><asp:Label ID="lbl_doc_deptcomplet2" runat="server"></asp:Label></a></li>
              <li id='menu_4_2'><a href="javascript:onclick=gotoFolder('listDept.aspx?barchived=true&amp;uid=' + deptid + '_S' + '&amp;location=DEPART','발신함');ChangType('menu_4_2');" class="smenu"><asp:Label ID="lbl_doc_sent" runat="server"></asp:Label></a></li>
              <li id='menu_4_4'><a href="javascript:onclick=gotoFolder('listDept.aspx?barchived=true&amp;uid=' + deptid + '_RC' + '&amp;location=DEPART','수신처리함');ChangType('menu_4_4');" class="smenu"><asp:Label ID="lbl_doc_receiveprocess" runat="server"></asp:Label></a></li>
              <li id='menu_4_5'><a href="javascript:onclick=gotoFolder('listDept.aspx?barchived=true&amp;uid=' + deptid + '_I' + '&amp;location=DEPART','통보함');ChangType('menu_4_5');" class="smenu"><asp:Label ID="lbl_doc_reference3" runat="server"></asp:Label></a></li>
            </ul>
          </div>
        <!-- 서브 메뉴 끝 -->
      </li>
      <!-- 부서문서함 끝 -->
      <!-- 분류문서함 시작 -->
      <li class="line_bg" id="docbox3"><a href="#" onclick="javascript:switchSubMenu('target_3');" class="mmenu"><b><span><%= Resources.Approval.lbl_doc_folder %><!--분류별문서함--></span></b></a>
          <!-- 서브 메뉴 시작 -->
          <div id="submenu" name="target_3"  style="display:;">
            <ul class="s_list">
                <iframe id="iDocTree" name="iDocTree" width="100%" height="470" frameborder="0" src="about:blank"></iframe>
            </ul>
          </div>
        <!-- 서브 메뉴 끝 -->     
      </li>
      <!-- 분류문서함 끝 -->
      <!-- 수신처그룹함 시작 -->
	    <li class="line_bg" id="docbox4" style="display:none;">
		    <a href="#" class="mmenu" onclick="switchSubMenu('target_4');" >
		        <b><span><%= Resources.Approval.lbl_doc_group %><!--수신처그룹함--></span></b>
		    </a>
		    <!-- 서브 메뉴 시작 -->
		    <div id="submenu" name="target_4"  style="display:none;">
			    <ul class="s_list">              
				    <%=GetGroupBoxes() %>
			    </ul>
		    </div>
		    <!-- 서브 메뉴 끝 -->
	    </li>      
      <!-- 수신처그룹함 끝 -->

    </ul>
            </div>
    <!-- 메뉴 영역 끝 -->
        </td>
    </tr>
	<tr style="height:11px">
		<td>
			<div id="n_leftfoot" style="position:relative;margin-top:-1px;"></div>	
		</td>
	</tr>
</table>

	<script type="text/javascript" language="javascript">		
		var uid="<%= Session["user_code"] %>";
		var deptid="<%= Session["user_dept_code"] %>";
		var parentdeptid="<%= Session["user_parent_dept_code"]%>";
		var refresh  = "<%=sRefresh%>";
		var sEntCode  = "<%=sEntCode%>";
		
		//부서품의함존재여부 
        if( deptid != parentdeptid) deptid=parentdeptid;       
        		        
        var g_winDocAll = window.document.all;
        var	m_xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP");
        var	m_xmlHTTPUnit = new ActiveXObject("MSXML2.XMLHTTP");

        var ijfcnt = "<%=strGRCount %>";
        var strPersonListValue =  "<%=strPersonListValue %>";
        var strDocListValue = "<%=strDocListValue %>";
        var strDeptListValue = "<%=strDeptListValue %>";
        var strAdminType = "<%=strAdminType %>";
		var gDocboxMenu = "<%=System.Configuration.ConfigurationSettings.AppSettings["WF_DocboxMenu"].ToString()%>";
        
        function window.onload() 
        {	
            switchSubMenu("target_<%=strMenu %>");//target_1
            ChangType("<%=strSubMenu %>");
            setDisplayMenu();
            if(refresh == ""){
                if ("<%=Request.QueryString["mType"]%>" == "1") {
                    gotoFolder('list.aspx?uid=' + uid + '&location=COMPLETE');
                }else if ("<%=Request.QueryString["mType"]%>" == "search") {
                    gotoFolder('ApvMonitor/ApvMonitoring.aspx');
                }else if ("<%=Request.QueryString["mType"]%>" == "sitemap") {
                    gotoFolder('<%=Request.QueryString["mURL"]%>');
                }else if ("<%=Request.QueryString["mType"]%>" == "portal") {
                }else {
                    //gotoFolder('approval_home.aspx');
                    //gotoFolder('list.aspx?uid=' + uid + '&location=APPROVAL');
                }
                
            }
            if(strAdminType =="true"){
                fnPersonDoc.style.display="";
                fnUnitDoc.style.display="";
            }
            if(gDocboxMenu == "T"){
                iDocTree.location.href = "../Admin/Approval_Admin/DocboxFolderMgr/DocboxTree.aspx?Ent=" + sEntCode;
            }else if(gDocboxMenu == "F"){
                iDocTree.location.href = "/CoviWeb/ExtensionService/Doc/DM_Folder_List2.aspx";
            }
            return true;
        }

        function gotoFolder(strFolderURL, strFolderName){
            try{
                
                if ( strFolderName != undefined){
                    parent.rightFrame.document.location = strFolderURL+"&location_name="+ escape(strFolderName);
                    //getApprovalCount();	
                }else{
                    parent.rightFrame.document.location = strFolderURL;	
                }
            }catch(e){alert(e.message)}
                //return true;
        }
    
        function switchSubMenu(targetName) {
            try {
                var oSM;
                for(var i=0;i<submenu.length;i++){
                    oSM = submenu[i];
                    var name = (("ActiveXObject" in window) ? oSM.getAttribute("name") : oSM.name);
                    if(name==targetName){
	                    (oSM.style.display=="inline")?oSM.style.display="none":oSM.style.display="inline";
	                    oSM.parentElement.className = "line_bg current";
                    }else{
	                    oSM.style.display="none";							
	                    oSM.parentElement.className = "line_bg";
                    }
                }
                						
            }catch(e) {}					
        }

        function event_noop(){return;}
        function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
            m_xmlHTTP.open(sMethod,sUrl,bAsync);
            //m_xmlHTTP.setRequestHeader("Accept-Language","ko");
            m_xmlHTTP.setRequestHeader("Content-type", sCType);
            if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
            (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
        	
        }
        function receiveHTTP(){
            if(m_xmlHTTP.readyState==4){
                m_xmlHTTP.onreadystatechange=event_noop;
                var xmlReturn=m_xmlHTTP.responseXML;
                if(xmlReturn.xml==""){
	                //alert(m_xmlHTTP.responseText);
                }else{
	                var errorNode=xmlReturn.selectSingleNode("response/error");
	                if(errorNode!=null){
		                alert("Desc: " + errorNode.text);
	                }else{
		                approval.innerHTML = '[ <font color=red>' +xmlReturn.selectSingleNode("response/NewDataSet/Table/APPROVAL").text + '</font> ]';
	                }
                }
            }
        }
        function changeApvDept(){
			var x = window.screen.width  / 2 - 345/2;
			var y = window.screen.height / 2 - 315/2;

			var etcParam = "dialogLeft:" + x + ";dialogTop:" + y + ";dialogWidth:345px;dialogHeight:340px;help:no;status:no;scroll:No;";

			var retValue = showModalDialog("/CoviWeb/PortalService/Session/DeptChange.aspx",'',etcParam);
			//var retValue = showModalDialog("DeptChange.aspx",'','menubar=0,resizable=0,scrollbars=0,width=330,height=180,left=230,top=240');
			if (retValue != null) {
				//spnUserDept.innerText = retValue;			
				window.parent.location.reload();
				try{
                    //parent.parent.mainFrame.spnPerInfo.innerHTML = " " + retValue + " [<a href='/COVINet/COVIServiceNet/PersonInfo/PersonInfo.htm' target='sub_main'> " + "<%= Session["user_name"] %>" + " 님 </a>] " ;				
                    parent.parent.mainFrame.setPerInfo();
				}catch(e){
				}
			}
		}
        function toUTF8(szInput){
	        var wch,x,uch="",szRet="";
	        for (x=0; x<szInput.length; x++) {
		        wch=szInput.charCodeAt(x);
		        if (!(wch & 0xFF80)) {
			        szRet += "%" + wch.toString(16);
		        }
		        else if (!(wch & 0xF000)) {
			        uch = "%" + (wch>>6 | 0xC0).toString(16) +
				          "%" + (wch & 0x3F | 0x80).toString(16);
			        szRet += uch;
		        }
		        else {
			        uch = "%" + (wch >> 12 | 0xE0).toString(16) +
				          "%" + (((wch >> 6) & 0x3F) | 0x80).toString(16) +
				          "%" + (wch & 0x3F | 0x80).toString(16);
			        szRet += uch;
		        }
	        }
	        return(szRet);
        }
		function fnMnuPRD(oPRD)
		{//이준희(2008-02-29): 좌측 메뉴상의 Progressive Disclosure 아이콘 클릭 시 메뉴 자체가 클릭되지 않도록 처리하는 함수를 추가함.
			try
			{//debugger;
				//oPRD.parentElement.COVIBuffer = oPRD.parentElement.href;
				//oPRD.parentElement.href = '#';
				displayminimenu(oPRD);
			}
			catch(e)
			{
			}
		}
		
		function setDisplayMenu(){
		    //개인문서함
		    var aMenuPerson = strPersonListValue.split(":");    
            for(var j=1;j<aMenuPerson.length;j++)
            {  
                if(aMenuPerson[j]=="1")   eval("menu_1_"+j).style.display = "";
                else eval("menu_1_"+j).style.display = "none";
            }
            //부서문서함
            var aDeptMenu = strDeptListValue.split(":");
            for(var k=1; k < aDeptMenu.length ; k++){
                if(aDeptMenu[k]=="1")   eval("menu_4_"+k).style.display = "";
                else eval("menu_4_"+k).style.display = "none";
            }
		    
            //문서대장		
            var aMenuDoc = strDocListValue.split(":");    
            for(var j=1;j<aMenuDoc.length;j++)
            {  
                if(aMenuDoc[j]=="1")   eval("menu_6_"+j).style.display = "";
                else eval("menu_6_"+j).style.display = "none";
            }
            
            //
            if( ijfcnt > 0){
                docbox4.style.display="";
            }
        }	
        
        var preItem;
        function ChangType(currItem) {
	        if (currItem !=""){
		        var oLi;
		        //CSS가 잘 적용되지 않아 강제적으로 변경함. 2007.12.11 김영종
		        if(preItem != null) {
			        oLi = eval(document.all[preItem]);
			        if(oLi != null) oLi.className="";
		        }
		        if(currItem != null) {
			        oLi = eval(document.all[currItem]);
			        if(oLi != null) oLi.className="current";
		        }
		        preItem = currItem;
		    }
	    }
	    
        function processXmlData(objXML)
        {
	        if(objXML.selectNodes("response/NewDataSet/Table").length==0) return false;
        	
	        var rgData = new Array();
	        var nodesAllItems = objXML.selectNodes("response/NewDataSet/Table");
        	
	        if (nodesAllItems.length > 0){
		        for(var x=0; x<nodesAllItems.length; x++){
			        rgData[0] = nodesAllItems.item(x).selectSingleNode("NAME").text.replace(/\x08/g,"&");
			        rgData[1] = nodesAllItems.item(x).selectSingleNode("ID").text.replace(/\x08/g,"&");			
			        rgData[2] = nodesAllItems.item(x).selectSingleNode("KEEP_YEAR").text.replace(/\x08/g,"&");
			        rgData[3] = nodesAllItems.item(x).selectSingleNode("SORT_ORDER").text.replace(/\x08/g,"&");
			        rgData[4] = nodesAllItems.item(x).selectSingleNode("ENT_CODE").text.replace(/\x08/g,"&"); // sEntCode
		        }
		        gotoFolder("/coviweb/approval/listDocBox.aspx?barchived=true&location=FOLDER&uid="+ deptid +"&classid="+rgData[1] + "&sEntCode="+rgData[4], rgData[0]);
	        }
	        return;
        }
        function processXmlDataDocList(szName, szCode){
            gotoFolder("/coviweb/approval/listDocBox.aspx?barchived=true&location=FOLDER&uid="+ deptid +"&classid="+szCode+ "&sEntCode="+sEntCode, szName);
  	        return;
        }
        var unit_code = "";
		//부서 문서 조회
		function fnUnitDocView(){
		    fnUnitChange();
		}
		//부서 변경
		function fnUnitChange(){
		    editList(true);
		}
		var person_code = "";
		var gubun ="";
		//사용자 문서 조회
		function fnPersonDocView(){
		    
		    fnPersonChange();
		
		}
		//사용자 변경
		function fnPersonChange(){
		    editList(false);
		}
		var person_code = "";
		var gubun ="";
		function editList(bgroup,type){
		    if(type != null){
		        gubun = type;
		    }
		    bGroup = bgroup;
		    
	
	        var rgParams=null;
	        rgParams=new Array();
	        rgParams["bMail"]  = false;
	        rgParams["bUser"] = ((bgroup== true)?false:true);
	        rgParams["bGroup"] = bgroup;
	        rgParams["bRef"] = false;
	        rgParams["bIns"] = false; 
	        rgParams["bRecp"] = bgroup; 
	        rgParams["sCatSignType"] = null; 
	        rgParams["sDeptSignType"] = null;
	        rgParams["sDeptSignStatus"] = null; 
	        rgParams["sUserSignType"] = null;
	        rgParams["sUserSignStatus"] = null; 
	        //rgParams["sUser"] = g_memberList.substring(6,g_memberList.length-7); 
	        rgParams["objMessage"] = window;

	        var szFont = "FONT-FAMILY: '굴림';font-size:9px;";var nWidth = 640;var nHeight = 610;
            var sFeature = szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:no;help:no;";
	        var strNewFearture = ModifyDialogFeature(sFeature);
	        var vRetval = window.showModelessDialog("/COVIWeb/approval/address/address.aspx", rgParams, strNewFearture);
        }
        function insertToList(oList){
	       if (bGroup){//부서일 경우
               var oPersonNodeList = oList.selectNodes("//group/item");
               if(oPersonNodeList.length > 1){
                    alert("<%=Resources.Approval.msg_239 %>");//부서는 1개 만 선택할 수 있습니다."
                    return false;
               }else if(oPersonNodeList.length == 1){
	                var oPersonNode = oPersonNodeList[0];
                    unit_code = oPersonNode.selectSingleNode("AN").text;
                    gotoFolder('../listDept.aspx?uid=' + unit_code + '_A&amp;location=DEPART&amp;admintype=ADMIN','부서함');
                }
            }else{ 
	               var oPersonNodeList = oList.selectNodes("//user/item");
	               if(oPersonNodeList.length > 1){
	                    alert('<%=Resources.Approval.msg_287%>');//"사용자는 1명만 선택할 수 있습니다."
	                    return false;
	               }else if(oPersonNodeList.length == 1){
                        var oPersonNode = oPersonNodeList[0];
                        gotoFolder('../list.aspx?admintype=admin&barchived=true&amp;uid=' + oPersonNode.selectSingleNode("AN").text + '&amp;location=COMPLETE','미결함');
	               }
	        }
        }
	</script>
	
	
	    <script language="javascript" type="text/javascript">
        var	m_xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP");
        
        function SetENT(m_EntCode)
        {
            sEntCode = m_EntCode;
            //if (window.kind.value != "total") {alert("<%= Resources.Approval.msg_004 %>");return false;}
            //iworklist.queryGetData();
            var sUrl ="";
            sUrl += "menu_DocBox.aspx";
            sUrl += "?sMenu=<%=strMenu %>";
            sUrl += "&SubMenu=";
            sUrl += "&List=List";
            sUrl += "&sEntCode=" + sEntCode;
            document.location.href = sUrl
        }
        function GetEnt(){
            
           
            var pXML = "exec usp_GetEntInfo";
            var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
            var szURL = "GetXMLQuery.aspx";
            requestHTTP("POST",szURL,true,"text/xml",receiveEntHTTP, sXML);
        }

        function event_noop(){return;}
        function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
            m_xmlHTTP.open(sMethod,sUrl,bAsync);
            //m_xmlHTTP.setRequestHeader("Accept-Language","ko");
            m_xmlHTTP.setRequestHeader("Content-type", sCType);
            if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
            (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
    		
        }
        function receiveEntHTTP(){
            if(m_xmlHTTP.readyState==4){
                m_xmlHTTP.onreadystatechange=event_noop;
                var xmlReturn=m_xmlHTTP.responseXML;
                if(xmlReturn.xml==""){
    	        
                }else{
	                var errorNode=xmlReturn.selectSingleNode("response/error");
	                if(errorNode!=null){
		                alert("Desc: " + errorNode.text);
	                }else{
	                    var m_oChargeList = new ActiveXObject("MSXML2.DOMDocument");
                        m_oChargeList.loadXML(m_xmlHTTP.responseText);  
	                    var elmRoot = m_oChargeList.documentElement;
		                var elmlist = elmRoot.selectNodes("NewDataSet/Table");
		                var elm;
		                var oOption = document.createElement("OPTION");
    			        
    			        
		                //콤보 박스 초기화
//		                SelEnt.length = 0;
//		                SelEnt.options.add(oOption);
//	                    oOption.text="전체";
//	                    oOption.value="";
//    			        
		                for(var i = 0; i < elmlist.length; i++)
		                {
		                    elm = elmlist.nextNode();
    			            
		                    var oOption = document.createElement("OPTION");
		                    SelEnt.options.add(oOption);
		                    oOption.text=elm.selectSingleNode("NAME").text;
		                    oOption.value=elm.selectSingleNode("ENT_CODE").text;
		                }
    			        
//		                SelEnt.value = '<%=Session["user_ent_code"].ToString()%>';
//		                sEntCode = SelEnt.value;

                        SelEnt.value = sEntCode;
	                }
                }
            }
        }
        function FirstForderList(firstCode,firstName){
            processXmlDataDocList(firstName,firstCode);
        }
        GetEnt();
    </script>
</body>
</html>