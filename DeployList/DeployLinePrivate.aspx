<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DeployLinePrivate.aspx.cs" Inherits="DeployList_DeployLinePrivate" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title><%= Resources.Approval.lbl_circulation_list %></title>
    <script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
    <script language="javascript" type="text/javascript" src="DeployMgr.js" ></script>
</head>
<body style="overflow:hidden;">

		<input type="hidden" id="chk" name="chk" />
		<textarea id="circulationinfotxt" name="circulationinfotxt" style="display:none;"></textarea>
		<textarea id="circulationinfotxt_ccrec" name="circulationinfotxt_ccrec" style="display:none;"><%=_circulationInfo_ccrec%></textarea>
		<textarea id="circulationinfotxt_ref" name="circulationinfotxt_ref" style="display:none;"><%=_circulationInfo_ref%></textarea>
        <textarea id="circulationinfoExttxt" name="circulationinfoExttxt" style="display:none;"><%=_circulationInfoExt%></textarea>		
		
<!-- 왼쪽 div 시작 -->
<div class="popup_left" id="divleft" name="divleft">
  <!-- 탭 div 시작 -->
  <div class="tab01 small">
    <ul>
      <li id="divtSearch" class="current"><a href="#"  onclick="javascript:changeTab(this);" id="tSearch" name="tSearch"><span><%= Resources.Approval.lbl_search %></span></a><!--검색--></li>      
      <li id="divtGroup"><a href="#"  onclick="javascript:changeTab(this);" id="tGroup" name="tGroup"><span><%= Resources.Approval.lbl_org %></span></a><!--조직도--></li>
    </ul>
  </div>
  <!-- 탭 div 끝 -->
  <!-- 컬러 라인 시작 -->  
  <div class="popup_line BTable_bg01"></div>
  <!-- 컬러 라인 끝 -->
  <div class="iframe_border" id="spantSearch" name="tSearch">
    <iframe id="iSearch" name="iSearch" width="100%" height="183" frameborder="0" src="../Address/search.aspx?Ent=<%=Session["user_ent_code"].ToString()%>" datasrc="../ApvLineMgr/search.aspx" style='scroll:auto'></iframe>
  </div>
  <div class="iframe_border" id="spantGroup" name="tGroup" style='DISPLAY:none;'>
    <iframe id="iGroup" name="iGroup" width="100%" height="183" frameborder="0" src="../ApvLineMgr/OrgTree.aspx?Ent=<%=Session["user_ent_code"].ToString()%>" datasrc="../ApvLineMgr/OrgTree.aspx" style='scroll:auto'></iframe>
  </div>  
  <!-- 컬러 라인 시작 -->  
  <div class="popup_line BTable_bg01"></div>
  <!-- 컬러 라인 끝 -->
  <div class="iframe_border">
    <iframe id="ListItems" name="ListItems" width="100%" height="200" frameborder="0" src="../Address/listitems.aspx" style='scroll:auto'></iframe>
  </div>
</div>
<!-- 왼쪽 div 끝 -->
		
<!-- 가운데 div 시작 -->
<div class="popup_center">
  <div class="Btn">
    <ul>        
    <!-- 배포자 --><li id="tblCirculation"><a href="#" class="Btn06" id="btCirculation" name="cbBTN" onclick="doButtonAction(this);"><span><%= Resources.Approval.lbl_deploy_person%><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon06_blt.gif" align="absmiddle" /></span></a></li>
    <!-- 배포부서 --><li id="tblCirculationDept"><a href="#" class="Btn06" id="btCirculationDept" name="cbBTN" onclick="doButtonAction(this);"><span><%= Resources.Approval.lbl_deploy_dept%><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_icon06_blt.gif" align="absmiddle" /></span></a></li>	    
    </ul>
  </div>
</div>
<!-- 가운데 div 끝 -->
<!-- 오른쪽 div 시작 -->
<div class="popup_right">
    <!-- 배포 정보 시작 -->
    <div id="divccinfomain" name="divccinfomain">
            <!-- 타이틀 & 버튼 div 시작 -->  
            <div class="title" >
			    <div class="text"><h3><%= Resources.Approval.lbl_deploy_list %></h3></div>
			    <div class="Btn">
			      <ul>
				    <li><a href="#" class="Btn05" id="btDeleteref" name="cbBTN" onClick="doButtonAction(this);"><span><%= Resources.Approval.btn_delete  %></span></a></li>
			      </ul>
			    </div>
            </div>
            <!-- 타이틀 & 버튼 div 끝 -->
            <!-- 컬러 라인 시작 -->
            <div class="popup_line BTable_bg01"></div>
            <!-- 컬러 라인 끝 -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" > 
                  <tr>
                    <td id="tdrefinfo" name="tdrefinfo" valign="top">
                        <div class="BTable">		
                        <table  width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr class="BTable_bg02" style="height:27px">
                              <th width="8%" height="20" align="center" valign="middle" class="td01_app"><input id="chkAllref" name="cbBTN" onclick="doButtonAction(this);" type="checkbox" /></th>
                              <th width="46%" align="center" valign="middle" class="td01_app"><%= Resources.Approval.lbl_deploy_dept%></th>
                              <th width="46%" align="center" valign="middle" class="td01_app"><%= Resources.Approval.lbl_deploy_person%></th>
                            </tr>
				            <tr>
                                <td height="1" colspan="3" class="BTable_bg03"></td>
                            </tr>
                            <tr>
                                <td  colspan="6" height="350" >
                                    <div id="divrefinfo" name="divrefinfo" class="iframe_border" style="OVERFLOW:auto;HEIGHT:99%">
                                        <!-- 회람리스트 -->
                                        <table id="tblrefinfo" name="tblrefinfo" width="100%" border="0" cellspacing="0" cellpadding="0">
                                        </table>
                                    </div>
                                
                                </td>
                            </tr>
                            <tr>
                            <td height="1" colspan="3" class="BTable_bg03"></td>
                            </tr>
                            <tr>
                            <td height="2" colspan="3" class="BTable_bg04"></td>
                            </tr>
                        </table>
                        </div>
                    </td>
                </tr>
            </table>
    </div>
    <!--  참조 정보 끝 -->       
</div>
<!-- 오른쪽 div 끝 -->                                    
<script type="text/javascript"  language="javascript">
	var selTab = "tSearch";
	//결재선선택
	var m_oParent, m_oUserList;
	var m_selectedCCRow=null;
	var m_selectedCCRowId=null;

	function changeTab(selObject) {
		if (selObject.name != selTab) {
            document.getElementById("div"+selTab.replace("_","")).className = "" ;
            document.getElementById("div"+selObject.name.replace("_","")).className = "current" ;           
			document.getElementById('span'+selTab).style.display = "none" ;			
			document.getElementById('span'+selObject.name).style.display ="" ;
			selTab = selObject.name;
			//검색결과 창 지우기
			ListItems.clearContents();
			
			//개인결재선 결재선 적용 버튼 제어 2006.09 by sunny
//			if (selObject != "tApvLine"){
//			    tblApplyLine.style.display="none"; //개인결재선적용
//			}else{
//			    tblApplyLine.style.display=""; //개인결재선적용
//			}
		}
		
		
	}

	function getDetailInfo(strAlias){	
		try{
		}catch(e){
		}
	}
	function event_retrieve_completed(){	
		if(m_xmlHTTP.readyState == 4){
			m_xmlHTTP.onreadystatechange = event_noop;//re-entrant gate
			if(m_xmlHTTP.responseText.charAt(0)=='\r'){
				alert("error in event_retrieve_completed(): no responseText returned");
			}else{
				var oAllNodes;
				try{	
				   
                    //var m_objXML=new ActiveXObject("MSXML2.DOMDocument");
                    var m_objXML = CreateXmlDocument();
                    var m_oMemberXSLProcessor = makeProcessor("../../COVIPortalnet/Address/detailmember.xsl");
				    m_oMemberXSLProcessor.input = m_xmlHTTP.responseXML;
				    m_oMemberXSLProcessor.transform();
				    m_objXML.loadXML(m_oMemberXSLProcessor.output);            				    				
					
					oAllNodes = m_objXML.selectSingleNode("response/item").childNodes;
					var oNode,el;
					for(var x=0;x<oAllNodes.length;x++){
						oNode = oAllNodes[x];
						try{
							switch (oNode.nodeName){								
								default:eval(oNode.nodeName).innerHTML =  oNode.text.replace(/\x08/g,"&");
							}
						}catch(e){
						}
					}
				}catch(e){
					
				}
			}    
		}	
	}
	//user/group 선택 관련 시작
	function switchParentNode(iType){
		//var m_XMLDOM = new ActiveXObject("MSXML2.DOMDocument");
		var m_XMLDOM = CreateXmlDocument();
		m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
		if(!m_XMLDOM.parsed){
		}
		var sElm = "selected/user";
		switch(iType){
			case 0: m_oParent = m_XMLDOM.selectSingleNode("selected/to");	sElm = 	"selected/to";	break;
			case 1: m_oParent = m_XMLDOM.selectSingleNode("selected/cc");	sElm = 	"selected/cc";	break;
			case 2: m_oParent = m_XMLDOM.selectSingleNode("selected/bcc");	sElm = 	"selected/bcc";	break;
			case 3: m_oParent = m_XMLDOM.selectSingleNode("selected/user");	sElm = 	"selected/user";	break;
			case 4:	m_oParent = m_XMLDOM.selectSingleNode("selected/group");sElm = 	"selected/group";	break;
			case 5:	m_oParent = m_XMLDOM.selectSingleNode("selected/group");sElm = 	"selected/group";	break;
		}

		switch(selTab){
			case "tSearch":
				m_oUserList = ListItems;
				if (iType==3 || iType == 4){
					selectListItmes(iType);
				}
				break;
			case "tGroup":
				if(iType == 4 ){
					m_oUserList = iGroup;
					addClicked()
				    }else if (iType== 3){
					m_oUserList = ListItems;
					selectListItmes(iType);
				}
				break;
			case "tApvLine":
				break;
		}

		return m_XMLDOM.selectSingleNode(sElm);
	}
	function addClicked(){
		var oSelNode = m_oUserList.getCurrentNode();
		if(oSelNode != null){
			if(m_oParent.selectSingleNode("item[AN = '" + oSelNode.selectSingleNode("AN").text + "']") == null){
				addListItem(oSelNode.cloneNode(true));
			}
		}
	}

	function addListItem(oNode){
		try{
			m_oParent.appendChild(oNode);
		}catch(e){
			alert(e.description);
		}
	}
	
	function selectListItmes(iType){

		var sChk = document.getElementById("chk").value ;
		try{
			if ((selTab == 'tSearch' && ((iType==3 && !iSearch.document.getElementById("buse").checked) || (iType==4 && iSearch.document.getElementById("buse").checked))) || selTab == 'tGroup'){
				if (sChk == "1"){
					var chk_count = m_oUserList.document.getElementsByName("chkRowSelect").length;
					if(typeof(chk_count) == "undefined"){
						var eTR = m_oUserList.document.getElementById("chkRowSelect").parentNode;
						while(eTR.tagName != "TR") {	eTR = eTR.parentNode;}
						ListItems.g_eCurrentRow = eTR;
						ListItems.processSelectedRow();   
						addClicked();
					}else if(chk_count > 0){
						for(var i=(chk_count-1);i>=0 ;i--) {//2006.10 by sunny for cuckoo
							if ( m_oUserList.document.getElementsByName("chkRowSelect")[i].checked ){
								var eTR = m_oUserList.document.getElementsByName("chkRowSelect")[i].parentNode;
								while(eTR.tagName != "TR") {	eTR = eTR.parentNode;}
								ListItems.g_eCurrentRow = eTR;
								ListItems.processSelectedRow();   
								addClicked();
            					m_oUserList.document.getElementsByName("chkRowSelect")[i].checked = false; //2006.09 by sunny for cuckoo
							}
						}
					}
				}else {
						addClicked();
				}
			}
		}catch(e){
		}
		document.getElementById("chk").value.value = 1 ;

	}
	//결재자 선택 관련 종료
	function overM(){
		var teTR = event.srcElement;
		while(teTR.tagName != "TR") {
			teTR = teTR.parentElement;
		}
		teTR.style.backgroundColor = "#EEF7F9";
		return true;
	}

	function outM(){
		var teTR = event.srcElement;
		while(teTR.tagName != "TR") {
			teTR = teTR.parentElement;
		}
		teTR.style.backgroundColor = "#FFFFFF";
		return true;
	}
	function selectCCRow(id){
		var oRow;
		
		oRow=event.srcElement;
		
		if(oRow!=null){
			switchSelectedRow(oRow);
		}else{
			m_selectedCCRow=null;
			m_selectedCCRowId=null;
		}

	}
	function switchSelectedRow(oRow){
		while(oRow!=null&&oRow.tagName!="TR"){
			oRow=oRow.parentNode;
		}
		if(oRow!=null){
			if(m_selectedCCRow!=null)m_selectedCCRow.style.backgroundColor="#FFFFFF";
			oRow.style.backgroundColor="#EEF7F9";
			m_selectedCCRow=oRow;
			m_selectedCCRowId=oRow.id;
		}
	}
	function getSelectedRow(){return m_selectedCCRow;}

	var	m_selectedDistRow=null;
	var	m_selectedDistRowId=null;
	function selectDistRow(id){
		var oRow;
		
		oRow=event.srcElement;
		
		if(oRow!=null){
			switchDistSelectedRow(oRow);
		}else{
			m_selectedDistRow=null;
			m_selectedDistRowId=null;
		}

	}
	function switchDistSelectedRow(oRow){
		while(oRow!=null&&oRow.tagName!="TR"){
			oRow=oRow.parentNode;
		}
		if(oRow!=null){
			if(m_selectedDistRow!=null)m_selectedDistRow.style.backgroundColor="#FFFFFF";
			oRow.style.backgroundColor="#EEF7F9";
			m_selectedDistRow=oRow;
			m_selectedDistRowId=oRow.id;
		}
	}
	function getSelectedDistRow(){return m_selectedDistRow;}
    function makeProcessor(urlXsl){
	    // XSL 문서를 DOM 객체로 로딩
	    var oXslDom = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
	    oXslDom.async = false;
	    if(!oXslDom.load(urlXsl)){
		    alertParseError(oXslDom.parseError);
		    throw new Error(-1,"couldn't make TemplateProcessor with ["+urlXsl+"].");
	    }
	    // XML 문서와 XSL 문서를 병합하여 결과를 저장할 XSLTemplate 객체 생성 
	    var oXSLTemplate = new ActiveXObject("MSXML2.XSLTemplate");
	    oXSLTemplate.stylesheet = oXslDom;
	    // XSLTemplate 프로세서 생성
	    return oXSLTemplate.createProcessor();
    }
    	
	</script>
	<script language="javascript" type="text/javascript">
		var userid = "<%=userid%>";
		var username = "<%=username%>";
		var circulationinfo = "";//특수문자 문제로 textarea 사용으로 변경 by sunny
		var circulationinfo_ccrec = "";//특수문자 문제로 textarea 사용으로 변경 by sunny
		var circulationinfo_ref = "";//특수문자 문제로 textarea 사용으로 변경 by sunny
		var g_openType = "<%= strOpenType %>";
		//2007.06 유유미
		var getToday = '<%= DateTime.Today.ToString("yyyy-MM-dd") %>';
		
	    var strMsg_064 = "<%= Resources.Approval.msg_064 %>";
	    var strMsg_136 = "<%= Resources.Approval.msg_136 %>";
	    var strMsg_162 = "<%= Resources.Approval.msg_162 %>";
	    var strMsg_171 = "<%= Resources.Approval.msg_171 %>";
		var gLngIdx = <%=strLangIndex %>;
	</script>
</body>
</html>
