<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PrivateLineList.aspx.cs" Inherits="Approval_Forms_PrivateLineList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js" ></script>
</head>
<body  leftmargin="0" topmargin="0" marginheight="0" marginwidth="0" style="MARGIN: 0px;">

</body>
	<script language="javascript" type="text/javascript">
		var UserID="<%=UserID%>";
		var m_id="";
		var m_oInfoSrc;
		var m_oFormMenu;
		var m_oFormEditor;
		var m_xmlHTTP=CreateXmlHttpRequest();
		var m_oApvList=CreateXmlDocument();
		var xslDOM=CreateXmlDocument();
		
		var strMsg_029 = "<%= Resources.Approval.msg_029 %>";
		var strMsg_030 = "<%= Resources.Approval.msg_030 %>";
		var strMsg_033 = "<%= Resources.Approval.msg_033 %>";
		var strMsg_034 = "<%= Resources.Approval.msg_034 %>";
		var strMsg_035 = "<%= Resources.Approval.msg_035 %>";
		var strMsg_036 = "<%= Resources.Approval.msg_036 %>";
		var strMsg_038 = "<%= Resources.Approval.msg_038 %>";
		var strMsg_039 = "<%= Resources.Approval.msg_039 %>";
		var strMsg_040 = "<%= Resources.Approval.msg_040 %>";
		var strMsg_042 = "<%= Resources.Approval.msg_042 %>";
		var strMsg_044 = "<%= Resources.Approval.msg_044 %>";
		var strMsg_046 = "<%= Resources.Approval.msg_046 %>";
		var strMsg_047 = "<%= Resources.Approval.msg_047 %>";
		var strMsg_048 = "<%= Resources.Approval.msg_048 %>";
		var strMsg_049 = "<%= Resources.Approval.msg_049 %>";
		var strMsg_050 = "<%= Resources.Approval.msg_050 %>";
		var strMsg_051 = "<%= Resources.Approval.msg_051 %>";
		var strMsg_052 = "<%= Resources.Approval.msg_052 %>";
		var strMsg_053 = "<%= Resources.Approval.msg_053 %>";
		var strMsg_054 = "<%= Resources.Approval.msg_054 %>";
		var strMsg_055 = "<%= Resources.Approval.msg_055 %>";
		var strMsg_056 = "<%= Resources.Approval.msg_056 %>";
		var strMsg_057 = "<%= Resources.Approval.msg_057 %>";
		var strMsg_058 = "<%= Resources.Approval.msg_058 %>";
		var strMsg_061 = "<%= Resources.Approval.msg_061 %>";
		var strMsg_121 = "<%= Resources.Approval.msg_121 %>";
		var strMsg_122 = "<%= Resources.Approval.msg_122 %>";
		var strMsg_123 = "<%= Resources.Approval.msg_123 %>";
		var strMsg_124 = "<%= Resources.Approval.msg_124 %>";
		var strMsg_125 = "<%= Resources.Approval.msg_125 %>";
		var strMsg_149 = "<%= Resources.Approval.msg_149 %>";
		var strMsg_173 = "<%= Resources.Approval.msg_173 %>";
		var strMsg_176 = "<%= Resources.Approval.msg_176 %>";
		var strMsg_177 = "<%= Resources.Approval.msg_177 %>";
		var strMsg_178 = "<%= Resources.Approval.msg_178 %>";
		var strMsg_179 = "<%= Resources.Approval.msg_179 %>";
		var strMsg_180 = "<%= Resources.Approval.msg_180 %>";
		var strMsg_181 = "<%= Resources.Approval.msg_181 %>";
		var strMsg_182 = "<%= Resources.Approval.msg_182 %>";
		var strMsg_183 = "<%= Resources.Approval.msg_183 %>";
		var strMsg_184 = "<%= Resources.Approval.msg_184 %>";
		var strMsg_185 = "<%= Resources.Approval.msg_185 %>";
		var strMsg_186 = "<%= Resources.Approval.msg_186 %>";
		var strMsg_187 = "<%= Resources.Approval.msg_187 %>";
		var strMsg_188 = "<%= Resources.Approval.msg_188 %>";		

        window.onload= initOnload;
        function initOnload(){	
		    m_oInfoSrc = top;    
		    m_oFormMenu = m_oInfoSrc.menu;
		    m_oFormEditor = m_oInfoSrc.editor;
            if (window.ActiveXObject) {
			    var szURL = "../ApvlineList/GetApvlist.aspx?USER_ID="+UserID;
			    requestHTTP("GET",szURL,true,"text/xml",receiveHTTP,null);
			}else{
			    getXSL();
			}			
		}
		function getXSL(){
	        var szURL = "../ApvlineList/ApvLineMgrApvline_xsl.aspx";
	        requestHTTP("GET",szURL,true,"text/xml",receiveHTTPXSL,null);
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
                        if (m_xmlHTTP.responseXML.selectNodes("response/item").length == 0 ) {parent.gHasPrivateLines=true;}
                        if (window.ActiveXObject) {
						    xslDOM.async=false;
						    xslDOM.load("../ApvlineList/ApvLineMgrApvline_xsl.aspx");
						}
					    document.body.innerHTML = "<div style='height:180;'>" + m_xmlHTTP.responseXML.transformNode(xslDOM)+"</div>";
					}
				}
			}
		}
        function receiveHTTPXSL(){
			if(m_xmlHTTP.readyState==4){
				m_xmlHTTP.onreadystatechange=event_noop;
                var parser = new DOMParser();
                xslDOM = parser.parseFromString(m_xmlHTTP.responseText, "text/xml");
				
			    var szURL = "../ApvlineList/GetApvlist.aspx?USER_ID="+UserID;
			    requestHTTP("GET",szURL,true,"text/xml",receiveHTTP,null);
			}
		}		
		function event_noop(){return(false);}
//		function changerChk(){
//			if (rChk.length==null){
//				m_id = rChk.id;
//				selectRow(rChk.id);
//			}
//			else{
//				for(i=0;i<rChk.length;i++){
//					if (rChk[i].checked) {
//						m_id = rChk[i].id;
//						selectRow(rChk[i].id);
//					}
//				}
//			}
//		}

        function changerChk(obj){   
            try{
                if (obj == null){
	                if (rChk.length==null){
		                m_id = rChk.id;
		                m_title = rChk.title;
		                m_dscr = rChk.dscr;
                //		setApvlist();
		                selectRow(rChk.id);
	                }
	                else{
		                for(i=0;i<rChk.length;i++){
			                if (rChk[i].checked) {
				                m_id = rChk[i].id;
				                m_title = rChk[i].title;
				                m_dscr = rChk[i].dscr;
                //				setApvlist();
				                selectRow(rChk[i].id);
			                }
		                }
	                }
	            }else{
	                if (rChk.length==null){
		                m_id = rChk.id;
		                m_title = rChk.title;
		                m_dscr = rChk.dscr;
                //		setApvlist();
		                selectRow(rChk.id);
	                }
	                else{
		                for(i=0;i<rChk.length;i++){
			                if (rChk[i].id == obj.id) {
				                m_id = rChk[i].id;
				                m_title = rChk[i].title;
				                m_dscr = rChk[i].dscr;
                //				setApvlist();
				                selectRow(obj);
				                rChk[i].checked = true;
			                }
		                }
	                }	    
	            }
            }catch(e){}
                
        }

		var m_selectedRow=null;
		var m_selectedRowId=null;
		
		function selectRow(id){
	        var oRow;
	        //alert(event.srcElement.parentElement.tagName);
	        oRow=event.srcElement.parentElement;

	        if(oRow!=null){
		        switchSelectedRow(oRow);
	        }else{
		        m_selectedRow=null;
		        m_selectedRowId=null;
	        }
	        getPrivateSteps();
	        applyLine();
        }
        function switchSelectedRow(oRow){
	        while(oRow!=null&&oRow.tagName!="TR"){
		        oRow=oRow.parentNode;
	        }
	        if(oRow!=null){
		        if(m_selectedRow!=null) {
		            m_selectedRow.className="";
		            m_selectedRow.style.backgroundColor ="#ffffff";
		            m_selectedRow.style.color ="#ffffff";
		        }
		        oRow.className="rowselected";
		        oRow.style.backgroundColor = "#EEF7F9";//"highlight";
		        oRow.style.color = "#333333";//"highlighttext";		
		        m_selectedRow=oRow;
		        m_selectedRowId=oRow.id;
	        }
        }		

		//결재선조회 2003.04.09 황선희 추가
		function queryGetData(){
			var szURL = "../ApvlineList/GetApvlist.aspx?PDD_ID="+m_id;
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
						return m_xmlHTTP.responseXML.selectSingleNode("response/item[id='"+m_id+"']/signinform/steps");
					}
				}
			}
		}
		//2006.09.27 김현태 개인결재선 조회
		function getPrivateSteps()
		{
		    //2006.09.26 김현태 개인결재선 클릭시 Listitem에 리스트 출력
			oPrivateSteps = queryGetData();
			//검색결과 창 지우기
			//parent.ListItems.clearContents();
		
//			var rgData = new Array();
//	        var nodesAllItems = oPrivateSteps.selectNodes("division/step/ou/person");
//        	
//	        if (nodesAllItems.length > 0){
//		        parent.ListItems.g_eGalTable.rows(0).style.display="";
//		        for(var x=0; x<nodesAllItems.length; x++){  	
//			        rgData[0] = nodesAllItems.item(x).getAttribute("name").replace(/\x08/g,"&");
//			        rgData[1] = nodesAllItems.item(x).getAttribute("position").split(";")[1].replace(/\x08/g,"&");			
//			        rgData[2] = nodesAllItems.item(x).getAttribute("title").split(";")[1].replace(/\x08/g,"&");
//			        rgData[3] = nodesAllItems.item(x).getAttribute("ouname").replace(/\x08/g,"&");
//			        parent.ListItems.addAddress(rgData,nodesAllItems.item(x).getAttribute("code").replace(/\x08/g,"&"),"");
//		        }
//	        }
		
		}		
		
		//2006.09.26 김현태 개인결재선, 체크된 사람까지의 index 추출
		function getApvlineStep()
		{
		    var oRtnSteps;		  
		    var idxstep;		   
	        var strApvlist = "";
	        oRtnSteps = oPrivateSteps;
	        var oPrivateSNodelist = oPrivateSteps.selectNodes("division/step");
	        if(oPrivateSNodelist.length > 0)
	        {
	            for(x=0; x<oPrivateSNodelist.length; x++){
	                if(x>idxstep){
	                    oRtnSteps.firstChild.removeChild(oPrivateSNodelist.item(x));
	                }
	            }
	        }
	        return oRtnSteps;
		   
		}	
        
        function applyLine(){
            m_sApvMode = getInfo("mode");
            
            //if (self.iApvLine.m_id!=""){
                switch(m_sApvMode){
	                case "REDRAFT":
		                //2006.09.26 김현태 개인결재선 적용방법 변경
		                //var oSteps = self.iApvLine.queryGetData();
		                var oSteps = getApvlineStep();
		                var oCheckSteps = chkAbsent(oSteps);
		                if ( oCheckSteps ){
			                var nodesAllItems = oSteps.selectNodes("division/step");//oSteps.selectNodes("division/step/ou/person");
			                for(var x=0; x<nodesAllItems.length; x++){
				                m_oCurrentOUNode.appendChild(nodesAllItems.item(x));
			                }
			                //refreshList();
			                //2006.09.26 개인결재선 리스트 Refresh
			                //self.iApvLine.getPrivateSteps();
		                }
		                break;
	                case "SUBREDRAFT":
		                //협조전
		                alert("아직 지원하지 않습니다");
		                //alert(strMsg_047);
		                break;
	                default:
		                //2006.09.26 김현태 개인결재선 적용방법 변경
		                //var oSteps = self.iApvLine.queryGetData();
		                var oSteps = getApvlineStep();
		                //var oCheckSteps = chkAbsent(oSteps);
		                var oCheckSteps = true;
		                var oApvList = new ActiveXObject("MSXML2.DOMDocument");
        												
		                if ( oCheckSteps ){					
			                var oStep=oApvList.createElement("step");
			                var oOU=oApvList.createElement("ou");
			                var oPerson=oApvList.createElement("person");
			                var oTaskinfo=oApvList.createElement("taskinfo");
			                var oDivStep =  oSteps.selectSingleNode("division/step");
			                var oDivTaskinfo = oSteps.selectSingleNode("division/taskinfo");
			                var oDiv = oSteps.selectSingleNode("division");
			                //2006.09.20 김현태 결재선 적용 시 기안자 사라지는 오류 수정
			                //oSteps.insertBefore(oStep, oSteps.firstChild).appendChild(oOU).appendChild(oPerson).appendChild(oTaskinfo);
			                oSteps.firstChild.insertBefore(oStep, oDivStep).appendChild(oOU).appendChild(oPerson).appendChild(oTaskinfo);
			                oSteps.setAttribute("initiatoroucode",getInfo("dpid_apv"));
			                oStep.setAttribute("unittype","person");
			                oStep.setAttribute("routetype","approve");
			                oStep.setAttribute("name","기안자");
			                oOU.setAttribute("code",getInfo("dpid_apv"));
			                oOU.setAttribute("name",getInfo("dpdn_apv"));
			                oPerson.setAttribute("code",getInfo("usid"));
			                oPerson.setAttribute("name",getInfo("usdn"));
			                oPerson.setAttribute("position",getInfo("uspc")+";"+getInfo("uspn"));
			                oPerson.setAttribute("title",getInfo("ustc")+";"+getInfo("ustn"));
			                oPerson.setAttribute("level",getInfo("uslc")+";"+getInfo("usln"));
			                oPerson.setAttribute("oucode",getInfo("dpid"));
			                oPerson.setAttribute("ouname",getInfo("dpdn"));
			                oTaskinfo.setAttribute("status","inactive");
			                oTaskinfo.setAttribute("result","inactive");
			                oTaskinfo.setAttribute("kind","charge");
			                oTaskinfo.setAttribute("datereceived",getInfo("svdt"));
			                oTaskinfo.setAttribute("customattribute1",getInfo("usit"));
			                oDivTaskinfo.setAttribute("status","inactive");
			                oDivTaskinfo.setAttribute("result","inactive");
			                oDivTaskinfo.setAttribute("kind","normal");
			                oDivTaskinfo.setAttribute("datereceived",getInfo("svdt"));
			                oDiv.setAttribute("name","발신");
			                oDiv.setAttribute("oucode",getInfo("dpid_apv"));
			                oDiv.setAttribute("ouname",getInfo("dpdn_apv"));
        					
			                var nodesAllItems = oSteps.selectNodes("steps/division/step");
			                for(var x=0; x<nodesAllItems.length; x++){
				                oSteps.documentElement.appendChild(nodesAllItems.item(x));
			                }					
        					
			                m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+oSteps.xml);
			                //refreshList();
			                //refreshCC(true);
			                //2006.09.26 개인결재선 리스트 Refresh
			                //self.iApvLine.getPrivateSteps();
        			        
			                setApvList();
		                }
		                break;
                }
            //}else{
                //alert("결재선을 먼저 선택하십시요");
                //alert(strMsg_048);
            //}	
        }		

        function setApvList(){	
            if(evaluateApvList()){
                //child가 없는 node 삭제
                var ccInfos = m_oApvList.selectNodes("steps/ccinfo");
                for(var i=0;i<ccInfos.length;i++){
	                var ccInfo = ccInfos.nextNode();
	                var ccList = ccInfo.childNodes;
	                if (ccList.length == 0){	m_oApvList.documentElement.removeChild(ccInfo);}
                }
                //쿠쿠전자 합의 기안자 다음으로 무조건 넘김 by sunny 2006.09
                //setApvList4Consult();
                //쿠쿠전자 진행 중 결재문서 변경 by sunny 2006.10
                var bChange = false;
                var m_oApvListExt = new ActiveXObject("MSXML2.DOMDocument");
                m_oApvListExt.loadXML(m_oFormMenu.APVLIST.value);
                if (m_oApvListExt.documentElement.xml != m_oApvList.documentElement.xml){bChange=true;}

                m_oFormMenu.APVLIST.value = m_oApvList.documentElement.xml;
                //alert(m_oApvList.documentElement.xml);
                var sMode = m_sApvMode.toUpperCase();
                if((sMode == "REDRAFT") || (sMode == "SUBREDRAFT")){
	                m_oFormMenu.btDeptDraft.style.display = "inline";
                }
                if((sMode == "DRAFT")||(sMode == "TEMPSAVE") ||(sMode == "REDRAFT")||(sMode == "SUBREDRAFT")||(sMode == "APPROVAL")||(sMode == "PROCESS")){
	                m_oFormEditor.setInlineApvList(m_oApvList);
	                if(sMode == "PROCESS"){  // 진행함일때만 결재선변경 버튼 필요 sMode == "APPROVAL" || 
		                if(bChange) m_oFormMenu.btChgApv.style.display = "";
	                }

                //마지막 결재자인지 확인	
	                var oPendingSteps = m_oApvList.documentElement.selectNodes("division/step[.//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass'  and .//taskinfo/@kind!='skip' and (.//taskinfo/@status='pending' or .//taskinfo/@status='reserved')]");
	                var oinActiveSteps = m_oApvList.documentElement.selectNodes("division/step[@routetype!='receive' and .//taskinfo/@kind!='review' and .//taskinfo/@kind!='bypass' and .//taskinfo/@kind!='skip'  and .//taskinfo/@status='inactive']");
	                //alert(oPendingSteps.length + "---"+ oinActiveSteps.length);
	                if (( oPendingSteps.length == 1 ) && (oinActiveSteps.length == 0)){
		                m_oFormMenu.field["bLASTAPPROVER"].value = "true";
	                }else{
		                m_oFormMenu.field["bLASTAPPROVER"].value = "false";
	                }
                //마지막 결재자인지 확인

                }
                //window.close();
            }
        }

        function evaluateApvList(){
            var elmRoot = m_oApvList.documentElement;
            //alert(elmRoot.xml);
            //scCHLimit 결재자 제한
            //scACLimit  합의자 제한
            if( getInfo("scCHLimit")==1 && getInfo("scCHLimitV")!=''){
                var elmApprove = elmRoot.selectNodes("division/step[@routetype='approve' and @unittype='person' and ou/person[taskinfo/@kind!='charge']]");
                if (elmApprove==null){
	                //alert("결재자를 지정하십시요");
	                alert(strMsg_049);
	                return false;
                }else if(elmApprove.length > parseInt(getInfo("scCHLimitV"))){
	                //alert("결재선에서 결재자수 " + getInfo("scCHLimitV") + "명을 초과할 수 없습니다"); return false;
	                alert(strMsg_050); 
	                return false;
                }
                //return true;
            }
        	
            if (getInfo("scPCoo")==1&&(m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL"||m_sApvMode=="PCONSULT")){
                var elmAssist = elmRoot.selectSingleNode("division/step[@routetype='assist' and @unittype='person']");
                if (elmAssist==null){
	                //if(confirm("협조자 없이 진행하시겠습니까?"))return true;
	                //	return chkConsultAppLine(elmRoot);
	                if (!chkConsultAppLine(elmRoot)) return false;
                }else{
	                //	return chkConsultAppLine(elmRoot);
	                if (!chkConsultAppLine(elmRoot)) return false;
                }
                //return true;
            }
            if (getInfo("scPAgr")==1&&(m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL"||m_sApvMode=="PCONSULT")){
                var elmConsult = elmRoot.selectSingleNode("division/step[@routetype='consult' and @unittype='person' and @allottype='parallel']");
                if (elmConsult==null){
	                //if(confirm("개인합의 없이 진행하시겠습니까?")){
		                if (getInfo("scDAgr") == "1"){
			                //return chkConsultAppLine(elmRoot);
			                if (!chkConsultAppLine(elmRoot)) return false;
		                }else{
			                //return true;
		                }
	                //}else{
	                //	return false;
	                //}
                }else{
 	                if(getInfo("scACLimit")==1 && getInfo("scACLimitV")!='' && elmConsult.selectNodes("ou").length > parseInt(getInfo("scACLimitV"))){
		                //alert("결재선에서 합의자수 " + getInfo("scACLimitV") + "명을 초과할 수 없습니다"); return false;
		                alert(strMsg_051); return false;
	                }else{
		                //return chkConsultAppLine(elmRoot);
		                if (!chkConsultAppLine(elmRoot)) return false;
	                }
                }
            }
            if (getInfo("scDAgr")==1&&(m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL"||m_sApvMode=="PCONSULT")){
                var elmConsult = elmRoot.selectSingleNode("division/step[@routetype='consult' and @unittype='ou' and @allottype='parallel']");
                if (elmConsult==null){
	                //if(confirm("부서합의 없이 진행하시겠습니까?")){
		                if (getInfo("scPAgr") == "1"){
			                //return chkConsultAppLine(elmRoot);
			                if (!chkConsultAppLine(elmRoot)) return false;
		                }else{
			                //return true;
		                }
	                //}else{
	                //	return false;
	                //}
                }else{
	                //return true;
                }
            }
        	
            if (getInfo("scPAgr")==2&&(m_sApvMode=="REDRAFT"||m_sApvMode=="RECAPPROVAL")){
                var elmConsult = elmRoot.selectSingleNode("division/step[@routetype='consult' and @unittype='person' and @allottype='parallel']");
                if (elmConsult==null){
	                //if(confirm("부서합의 없이 진행하시겠습니까?"))return true;
	                //return false;
                }else{
	                var emlSteps = elmRoot.selectNodes("division/step");
	                var emlStep;
	                var HasApprover = false;
	                var HasConsult = false;
	                for(var i=0; i< emlSteps.length;i++){
		                emlStep=emlSteps.nextNode();
		                if (emlStep.getAttribute("routetype") == "consult"){
			                HasConsult = true;
		                }
		                if ( HasConsult ){
			                if (emlStep.getAttribute("routetype") == "approve"){
				                HasApprover = true;
			                }
		                }
	                }
        			
	                if ( HasApprover == true ) {
		                //return true;
	                }else{
		                //alert("결재선에서 합의는 최종결재자 전에 위치해야 합니다.\n현 합의를 결재자 아래로 내려주십시요.");return false;
		                alert(strMsg_052);return false;
	                }
        			
                }
            }
        	
            if (getInfo("scDRec")==1&&(m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL")){
                //var elmOu = elmRoot.selectSingleNode("step[@routetype='receive' and @unittype='ou']");
                /*if (elmOu==null){alert("수신부서를 지정하십시요");return false;} 2003.06 황선희 주석처리*/
                var elmOu = elmRoot.selectNodes("division/step[@routetype='receive']/ou");
        		
                //if (elmOu==null){
                if (elmOu.length==0){
	                //if(confirm("수신처 없이 진행하시겠습니까?"))return true;
	                //return false;
	                //alert("수신처를 지정하십시요."); return false;
	                //if(confirm("경유부서 없이 진행하시겠습니까?"))return true;			
                }else{
                    //BC카드의 경우 수신처 n개 지정 가능
        //			//수신처를 1개만 지정하도록 수정 2004.11.10 김영종
        // 			var elmReceive = elmRoot.selectNodes("division/step[@unittype='ou' and @routetype='receive']");
        //			//한번에 두개 이상의 수신처를 지정 할 경우 Check
        // 			//if(elmReceive.length>1){alert("수신처는 1개만 지정 가능 합니다. \n수신처를 다시 지정해 주십시요.");return false;} 
        // 			if(elmReceive.length>1){alert(strMsg_053);return false;} 
        // 			var ouReceive = elmReceive[0].selectNodes("ou");
        //			//한번씩 하나씩 두번 이상의 수신처를 지정 할 경우 Check
        // 			//if(ouReceive.length>1){alert("수신처는 1개만 지정 가능 합니다. \n수신처를 다시 지정해 주십시요.");return false;} 
        // 			if(ouReceive.length>1){alert(strMsg_053);return false;} 
                }
                //return true;
            }
        	
            if (getInfo("scChgr")==1&& getInfo("scChgrV")=="select" && (m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL")){
                //var elmOu = elmRoot.selectSingleNode("step[@routetype='receive' and @unittype='ou']");
                /*if (elmOu==null){alert("수신부서를 지정하십시요");return false;} 2003.06 황선희 주석처리*/
                var elmOu = elmRoot.selectNodes("division/step[@routetype='receive']/ou/role");
        		
                //if (elmOu==null){
                if (elmOu.length==0){
	                //alert("담당업무를 지정하십시요");
	                alert(strMsg_054);
	                return false;
                }else if (elmOu.length>1){
	                //alert("담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요.");
	                alert(strMsg_055);
	                return false;
                }else{
	                //담당업무를 1개만 지정하도록 수정 2005.04.21 황선희
	                var elmReceive = elmRoot.selectNodes("division/step[@unittype='person' and @routetype='receive']");
	                //한번에 두개 이상의 담당업무를 지정 할 경우 Check
	                //if(elmReceive.length>1){alert("담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요.");return false;} 
	                if(elmReceive.length>1){alert(strMsg_055);return false;} 
	                var ouReceive = elmReceive[0].selectNodes("role");
	                //한번씩 하나씩 두번 이상의 담당업무를 지정 할 경우 Check
	                //if(ouReceive.length>1){alert("담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요.");return false;} 
	                if(ouReceive.length>1){alert(strMsg_055);return false;} 
                }
                var emlSteps = elmRoot.selectNodes("division/step");
                var emlStep;
                var HasApprover = false;
                var HasReceive= false;
                for(var i=0; i< emlSteps.length;i++){
	                emlStep=emlSteps.nextNode();
	                if (emlStep.getAttribute("routetype") == "receive" && emlStep.getAttribute("unittype") == "person" ){
		                HasReceive = true;
	                }
	                if ( HasReceive ){
		                if (emlStep.getAttribute("routetype") == "approve"){
			                HasApprover = true;
		                }
	                }
                }
                if ( HasApprover == true ) {
	                //alert("결재선에서 담당부서처리는 최종결재자 다음에 위치해야 합니다.\n현 업무담당를 결재자 위로 올려주십시요.");return false;
	                alert(strMsg_056);return false;
                }else{
	                //return true;
                }
            }
        	
            if (getInfo("scDCoo")==1&&(m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL")){
                var elmOu = elmRoot.selectSingleNode("division/step[@routeype='assist' and @unittype='ou']");
                /*if (elmOu==null){alert("협조처를 지정하십시요");return false;} 2003.04 황선희 주석처리*/
                if (elmOu==null){
	                //if(!confirm("협조처 없이 진행하시겠습니까?")) return false;
	                //if(!confirm(strMsg_122)) return false;
                }
                //return true;
            }
        	
            if (getInfo("scPCoo")==1&&(m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL")){
                var elmAssist = elmRoot.selectSingleNode("division/step[@routetype='assist' and @unittype='person']");
                if (elmAssist==null){
	                //if(!confirm("협조자 없이 진행하시겠습니까?")) return false;
	                //if(!confirm(strMsg_123)) return false;
                }
                //return true;
            }
            if (getInfo("scDAgr")==1&& m_sApvMode=="SUBREDRAFT"){
                //if (m_oCurrentOUNode.selectNodes("person[taskinfo/@kind!='charge' and taskinfo/@kind!='skip' ]").length < 1 )
                if (m_oCurrentOUNode.selectNodes("person[taskinfo/@kind!='skip' ]").length < 1 )
                {
	                //alert("결재선을 지정하십시요");return false;
	                alert(strMsg_029);return false;
                }
            }
            //수신자 추가 2006.08 by sunny
            if (getInfo("scPRec")==1&& (m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL")){
                var elmOu = elmRoot.selectNodes("division/step[@routetype='receive']/ou/person");
        		
                if (elmOu.length==0){
                    if (getInfo("scPRecV")=="select"){
                    }else{
	                    //alert("담당자를 지정하십시요");
	                    alert(strMsg_054);
	                    return false;
	                }
        //		}else if (elmOu.length>1){
        //			alert("담당자는 1개만 지정 가능 합니다. \n담당자를 다시 지정해 주십시요.");
        //			//alert(strMsg_055);
        //			return false;
        //		}else{
        //			//담당업무를 1개만 지정하도록 수정 2005.04.21 황선희
        // 			var elmReceive = elmRoot.selectNodes("division/step[@unittype='person' and @routetype='receive']");
        //			//한번에 두개 이상의 담당업무를 지정 할 경우 Check
        // 			if(elmReceive.length>1){alert("담당자는 1개만 지정 가능 합니다. \n담당자를 다시 지정해 주십시요.");return false;} 
        // 			//if(elmReceive.length>1){alert(strMsg_055);return false;} 
        // 			var ouReceive = elmReceive[0].selectNodes("person");
        //			//한번씩 하나씩 두번 이상의 담당업무를 지정 할 경우 Check
        // 			if(ouReceive.length>1){alert("담당자는 1개만 지정 가능 합니다. \n담당자를 다시 지정해 주십시요.");return false;} 
        // 			//if(ouReceive.length>1){alert(strMsg_055);return false;} 
                }
                var emlSteps = elmRoot.selectNodes("division/step");
                var emlStep;
                var HasApprover = false;
                var HasReceive= false;
                for(var i=0; i< emlSteps.length;i++){
	                emlStep=emlSteps.nextNode();
	                if (emlStep.getAttribute("routetype") == "receive" && emlStep.getAttribute("unittype") == "person" ){
		                HasReceive = true;
	                }
	                if ( HasReceive ){
		                if (emlStep.getAttribute("routetype") == "approve"){
			                HasApprover = true;
		                }
	                }
                }
                if ( HasApprover == true ) {
	                //alert("결재선에서 담당부서처리는 최종결재자 다음에 위치해야 합니다.\n현 업무담당를 결재자 위로 올려주십시요.");return false;
	                alert(strMsg_056);return false;
                }else{
	                //return true;
                }
            }	
            //감사 조건 추가 - 최종결재자 이전에 위치해야 함
            if (getInfo("scGAdt")==1&&(m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL"||m_sApvMode=="PCONSULT"||m_sApvMode=="AUDIT")){
                var elmAudit = elmRoot.selectSingleNode("division/step[@routetype='audit' and @unittype='person']");
                if (elmAudit==null){
	                return chkConsultAppLine(elmRoot);
                }		
            }	
            //감사 관련 종료
            //감사사용 양식에서 상무 이상이 결재자에 있는 경우 감사자가 반드시 존재해야함
            if (getInfo("scDAdt") == 1 && (m_sApvMode=="DRAFT"||m_sApvMode=="TEMPSAVE"||m_sApvMode=="APPROVAL")){
                var elmApprovers = elmRoot.selectNodes("division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step[@routetype='approve' and @unittype='person']/ou/person[@position='10;사장' or @position='11;부사장' or @position='14;상무']");
                if (elmApprovers.length > 0){
                    var elmAuditOU = elmRoot.selectSingleNode("division/step[@routetype='audit' and @unittype='ou']");
                    if (elmAuditOU == null){
                        alert("최종 결재자가 담당상무 이상일 경우\r\n사전 또는 사후감사를 지정해야 합니다.");
                        return false;
                    }
                }
            }
        		
            //후결자 확인
            /*
            var emlSteps = elmRoot.selectNodes("division/step");
            if (m_sApvMode=="DRAFT" || m_sApvMode=="TEMPSAVE"){
                emlSteps = elmRoot.selectNodes("division[@divisiontype='send']/step");
            }else{
                emlSteps = elmRoot.selectNodes("division[taskinfo/@status='pending']/step");
            }
            var emlStep;
            var HasReviewApprover = false;
            var HasReviewer= false;
            for(var i=0; i< emlSteps.length;i++){
                emlStep=emlSteps.nextNode();
                var elmTaskinfo = emlStep.selectSingleNode("ou/person/taskinfo");
                if (emlStep.getAttribute("routetype") == "approve" && emlStep.getAttribute("unittype") == "person" && elmTaskinfo.getAttribute("kind") == "review" ){
	                HasReviewer = true;
                }
                if ( HasReviewer ){
	                if (emlStep.getAttribute("routetype") == "approve" && elmTaskinfo.getAttribute("kind") != "review"){
		                HasReviewApprover = true;
	                }
                }
            }
            if ( HasReviewApprover == true ) {
                //alert("결재선에서 담당부서처리는 최종결재자 다음에 위치해야 합니다.\n현 업무담당를 결재자 위로 올려주십시요.");return false;
                alert("후결은 최종승인자만 가능합니다.");return false;
            }else{
                //return true;
            }
            */
        	
            //보광 그룹 - 휘닉스커므니케이션즈 결재선 내 팀장이 없으면 경고 처리 20071013
            /*2007.10 고객 요청으로 주석처리
            if (getInfo("fmpf").indexOf("WF_CNM_") > -1 ){
                var elmApprovers = elmRoot.selectNodes("division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step[@routetype='approve' and @unittype='person']/ou/person[@title='310`06;팀장']");
                if (elmApprovers.length > 0){
                }else{
                    alert("결재선에 팀장이 포함되어 있어야 합니다.");
                    return false;
                }
            }
            */
            return true;
        }

        function chkConsultAppLine(elmRoot){
            var emlSteps = elmRoot.selectNodes("division/step");
            var emlStep;
            var elmList = elmRoot.selectNodes("division/step[(@unittype='person' or @unittype='role') and @routetype='approve']/ou/(person|role)");	// 2004.10.26 update
            var elm, elmTaskInfo;	// 2004.10.26 update
            var HasApprover = false;
            var HasConsult = false;
            var HadReviewer = false;	// 2004.10.26 update
            var PreConsult = false ;	// 2004.10.26 update
            var EndReviewer = false ;	// 2004.10.26 update
            var CurConsult = false ;	// 2004.10.26 update

            for(var i=0; i< emlSteps.length;i++){
                emlStep=emlSteps.nextNode();
                if (emlStep.getAttribute("routetype") == "consult" || emlStep.getAttribute("routetype") == "assist"  || emlStep.getAttribute("routetype") == "audit" )	HasConsult = true; //감사관련 수정
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
		                //alert("최종결재자가 후결인 경우에 전 결재자는 합의일 수 없습니다.");return false;
		                alert(strMsg_058);return false;
	                }else{
	                    // 2006.02.24 : 박상호 -> 합의자 최종결재자 전에 위치해야 하는 로직 삭제 (합의자에서 끝날수 있음)
		                if (CurConsult){				
			                alert(strMsg_052);return false;
		                }else{return true;}
		                //return true;
	                }
	                //
                }
            }else{
                return true;
            }
        }

        function chkAbsent(oSteps){
            var oUsers = oSteps.selectNodes("division/step/ou/person");
            var elmUsers;
            var sUsers="";
            for(var i=0; i < oUsers.length ; i++){
                elmUsers = oUsers.nextNode();
                if(sUsers.length > 0 ){
                    var szcmpUsers = ";" + sUsers + ";";
                    if (szcmpUsers.indexOf(";" + elmUsers.getAttribute("code") + ";") == -1 ){
	                    sUsers += ";"+ elmUsers.getAttribute("code");
	                }
                }else{
	                sUsers += elmUsers.getAttribute("code");
                }
            }
            //var szURL = "/xmlorg/query/org_chkabsent.xml?USER_ID="+sUsers;
            var pXML = " EXEC dbo.usp_CheckAbsentMember '"  + sUsers + "' ";
            var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
            //var szURL = "/covinet/coviportalnet/address/getXMLQuery.aspx?Type=searchMember";
            var szURL = "../address/getXMLQuery.aspx?Type=searchMember";
            requestHTTP("POST",szURL,false,"text/xml",null, sXML);
            //requestHTTP("GET",szURL,false,"text/xml",null,null);
            return chkAbsentUsers(oSteps);
        }
        function chkAbsentUsers(oSteps){	
            if(m_xmlHTTP.readyState==4){	
                m_xmlHTTP.onreadystatechange=event_noop;
                if(m_xmlHTTP.responseText.charAt(0)=="\r"){
	                //alert(m_xmlHTTP.responseText);			
                }else{			
	                var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
	                if(errorNode!=null){
		                return true;
	                }else{
                        var m_objXML=new ActiveXObject("MSXML2.DOMDocument");
                        //var m_oMemberXSLProcessor = makeProcessor("../../COVIPortalNet/Address/org_memberquery.xsl");
                        var m_oMemberXSLProcessor = makeProcessor("../Address/org_chkabsent.xsl");
                        m_oMemberXSLProcessor.input = m_xmlHTTP.responseXML;
                        m_oMemberXSLProcessor.transform();
                        m_objXML.loadXML(m_oMemberXSLProcessor.output);
        		
		                //Active 한 사용자들 모두 조회, 부서, 직위, 직급, 직책 비고
		                var oUsers = m_objXML.selectNodes("response/addresslist/item");
		                var oUser;
		                var sAbsentResult="";
		                var sResult="";
		                var oStepUsers = oSteps.selectNodes("division/step/ou/person");
        				
		                for(var i=0;i<oStepUsers.length;i++){
			                oUser = oStepUsers.nextNode();
			                var oChkAbsent = m_objXML.selectNodes("response/addresslist/item[AN='" +oUser.getAttribute("code") + "']");
			                if ( oChkAbsent != null ){ 
				                var oChkAbsentNode = m_objXML.selectSingleNode("response/addresslist/item[AN='"+oUser.getAttribute("code") + "'  and RG='" + oUser.getAttribute("oucode") + "' and RGNM = '" + oUser.getAttribute("ouname") + "']"); //and @tl='"+ oUser.getAttribute("title") +"'
				                if(oChkAbsentNode != null){
        							
				                }else{
					                sResult += "	" + oUser.getAttribute("ouname") +" : " + oUser.getAttribute("name")+"\n";
				                }
        						
			                }else{//퇴직자
				                sAbsentResult += "	" + oUser.getAttribute("ouname") +" : " + oUser.getAttribute("name")+"\n";
			                }
		                }
		                if (sAbsentResult != "" ){
			                alert(strMsg_057+sAbsentResult); //"선택한 개인 결재선에 퇴직자가 포함되어 적용이 되지 않습니다.\n\n---퇴직자--- \n\n"
			                return false;
		                }else{
			                if(sResult != ""){
				                alert(strMsg_177+sAbsentResult);//"선택한 개인 결재선의 부서/인사정보가 최신정보와 일치하지 않아 적용이 되지 않습니다.\n\n---변경자--- \n\n"+sResult);
				                return false;
			                }else{
				                return true;
			                }
        					
		                }
	                }
                }
            }
        }       
        
        function getInfo(sKey){try{return m_oInfoSrc.g_dicFormInfo.item(sKey);}catch(e){alert("양식정보에 없는 키값["+sKey+"]입니다.");}}

		</script>
</html>
