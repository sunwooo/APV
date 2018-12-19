<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PrivateLineList.aspx.cs" Inherits="COVIFlowNet_ApvlineList_PrivateLineList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js" ></script>
    <script type="text/javascript" language="javascript" src="/CoviWeb/common/script/jquery-1.6.1.min.js"></script>
</head>
<body  leftmargin="0" topmargin="0" marginheight="0" marginwidth="0" style="OVERFLOW: auto;    MARGIN: 0px;">
</body>
<script language="javascript" type="text/javascript">
	var UserID="<%=UserID%>";
	var m_id="";
	var m_xmlHTTP=CreateXmlHttpRequest();
	var xslDOM=CreateXmlDocument();
	var gLngIdx = <%=strLangIndex %>;
	
    window.onload= initOnload;
    function initOnload(){
        if (window.ActiveXObject || ("ActiveXObject" in window) ) {
		    var szURL = "GetApvlist.aspx?USER_ID="+UserID;
		    requestHTTP("GET",szURL,true,"text/xml",receiveHTTP,null);
		}else{
		    getXSL();
		}    
	}
	function getXSL(){
        var szURL = "ApvLineMgrApvline_xsl.aspx";
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
			m_xmlHTTP.onreadystatechange=event_noop;
			if(m_xmlHTTP.responseText.charAt(0)=='\r'){
				alert(m_xmlHTTP.responseText);
			}else{
				var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
				if(errorNode!=null){
					alert("Desc: " + errorNode.text);
				}else{
                    if (m_xmlHTTP.responseXML.selectNodes("response/item").length == 0 ) {if(parent.contentWindow) parent.contentWindow.gHasPrivateLines=true;}
                    if (window.ActiveXObject || ("ActiveXObject" in window) ) {
					    xslDOM.async=false;
					    xslDOM.load("ApvLineMgrApvline_xsl.aspx");
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
			m_xmlHTTP=CreateXmlHttpRequest();
		    var szURL = "GetApvlist.aspx?USER_ID="+UserID;
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

    function changerChk(obj, e){
        if (obj == null){
            var sel_row = document.getElementsByName('rChk');
            var chk_count = sel_row.length;
            if (chk_count > 0) {
                for (var i = (chk_count - 1); i >= 0; i--) {
                    if (sel_row[i].checked) {
			                m_id = sel_row[i].id;
			                m_title = sel_row[i].title;
			                m_dscr = sel_row[i].dscr;
            //				setApvlist();
			                selectRow(sel_row[i], e);
                    }
                }
            }          
        }else{
            var sel_row = document.getElementsByName('rChk');
            var chk_count = sel_row.length;
            if (chk_count > 0) {
                for (var i = (chk_count - 1); i >= 0; i--) {
                    if (sel_row[i].id == obj.id) {
		                m_id = sel_row[i].id;
		                m_title = sel_row[i].title;
		                m_dscr = sel_row[i].dscr;
        //				setApvlist();
		                selectRow(sel_row[i], e);
		                sel_row[i].checked = true;
                    }
                }
            }          
        }
    }

	var m_selectedRow=null;
	var m_selectedRowId=null;
	
	function selectRow(id, e){
        var evt=(window.event)?window.event: e;
        var oRow;
        oRow=((evt.srcElement)?evt.srcElement:evt.target).parentNode;

        if(oRow!=null){
	        switchSelectedRow(oRow);
        }else{
	        m_selectedRow=null;
	        m_selectedRowId=null;
        }
        getPrivateSteps();
    }
    function switchSelectedRow(oRow){
        while(oRow!=null&&oRow.tagName!="TR"){
	        oRow=oRow.parentNode;
        }
        if(oRow!=null){
	        if(m_selectedRow!=null) {
	            m_selectedRow.className="";
	            m_selectedRow.style.backgroundColor ="#ffffff";
	            m_selectedRow.style.color ="#000000";
	        }
	        oRow.className="rowselected";
	        oRow.style.backgroundColor = "#EEF7F9";//"highlight";
	        oRow.style.color = "#333333";//"highlighttext";		
	        m_selectedRow=oRow;
	        m_selectedRowId=oRow.id;
        }
    }
	

	//결재선조회
	function queryGetData(){
		var szURL = "GetApvlist.aspx?PDD_ID="+m_id;
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
		parent.ListItems.clearContents();
		
		var rgData = new Array();
        //var nodesAllItems = oPrivateSteps.selectNodes("division/step/ou/person"); 
        var nodesAllItems = $(oPrivateSteps).find("division>step>ou>person"); 
    	
        //if (nodesAllItems.length > 0){
        if($(nodesAllItems).length > 0) {
	        parent.ListItems.g_eGalTable.rows[0].style.display="";
            /*
	        for(var x=0; x<nodesAllItems.length; x++){ 
	             var el = nodesAllItems.nextNode(); 	
		        rgData[0] = getLngLabel(nodesAllItems.item(x).getAttribute("name").replace(/\x08/g,"&"),false);
		        rgData[1] = getLngLabel(nodesAllItems.item(x).getAttribute("position").replace(/\x08/g,"&"),true);			
		        rgData[2] = getLngLabel(nodesAllItems.item(x).getAttribute("title").replace(/\x08/g,"&"),true);
		        rgData[3] = getLngLabel(nodesAllItems.item(x).getAttribute("ouname").replace(/\x08/g,"&"),false);
		        parent.ListItems.addAddress(rgData,el.getAttribute("code").replace(/\x08/g,"&"),"");
	        }
            */
            $(nodesAllItems).each(function (index, element) {  //크로스브라우징 처리 (2013-03-21 HIW)
                //var el = nodesAllItems.nextNode();
                
                rgData[0] = getLngLabel($(element).attr("name").replace(/\x08/g,"&"),false);		
                rgData[1] = getLngLabel($(element).attr("position").replace(/\x08/g,"&"),true);			
		        rgData[2] = getLngLabel($(element).attr("title").replace(/\x08/g,"&"),true);
		        rgData[3] = getLngLabel($(element).attr("ouname").replace(/\x08/g,"&"),false);
		        parent.ListItems.addAddress(rgData,$(element).attr("code").replace(/\x08/g,"&"),"");

            });

            //debugger;            //=== 개인결재선 순서 역순으로 재정렬 (2013-03-18 HIW) =======            if (parent.gPrivateAppLine == "Y") {  //개인결재선탭 선택한 경우                            var vArrTr = new Array();                parent.$('#ListItems').contents().find("#tblGalInfo tr").each(function (i) {                    if(i > 0)                        vArrTr[i] = $(this);                });                var vRowCnt = vArrTr.length;                for (var i = vRowCnt - 1; i > -1; i--) {
                    parent.$('#ListItems').contents().find("#tblGalInfo").append(vArrTr[i]);                }            }
            //===========================================================
        }
	}

	//2006.09.26 김현태 개인결재선, 체크된 사람까지의 index 추출
	function getApvlineStep()
	{
	    var oRtnSteps;
	    //결재선 리스트에서 선택한 사람이 없을때.
	    var idxstep = getApvlineIdx();
	    if(idxstep == -1){
	        oRtnSteps =oPrivateSteps;
	        return oRtnSteps;
	    }
	    else
	    {
	        var strApvlist = "";
	        oRtnSteps = oPrivateSteps;
	        var oPrivateSNodelist = oPrivateSteps.selectNodes("division/step");
	        if(oPrivateSNodelist.length > 0)
	        {
	            for(x=0; x<oPrivateSNodelist.length; x++){
					var el = oPrivateSNodelist.nextNode(); 
	                if(x>idxstep){
	                    oRtnSteps.firstChild.removeChild(el);
	                }
	            }
	        }
	        return oRtnSteps;
	    }
	}
	
	
	//2006.09.26 김현태 개인결재선, 체크된 사람까지의 index 추출
	function getApvlineIdx()
	{
        var sel_row = (window.addEventListener)?parent.ListItems.document.getElementsByName('chkRowSelect'):parent.ListItems.chkRowSelect;
        var chk_count = sel_row.length;
        if (chk_count > 0) {
	        var rtnindex;
            for (var i = (chk_count - 1); i >= 0; i--) {
                if (sel_row[i].checked) {
	                rtnindex = i;
                }
            }
 	        return rtnindex;
       }else{
	    return -1;
       }	
	} 					
	</script>
</html>
