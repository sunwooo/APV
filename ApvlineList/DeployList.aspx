<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DeployList.aspx.cs" Inherits="COVIFlowNet_ApvlineList_DeployList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
</head>
<body leftmargin="0" topmargin="0"  style="OVERFLOW: auto;    MARGIN: 0px;">

</body>
	<script language="javascript" type="text/javascript">
		var UserID="<%=UserID%>";
		var m_id="";
		var m_xmlHTTP=CreateXmlHttpRequest();
		var m_objGrpInfoXML = CreateXmlDocument();
		var m_sSelGrpID;
		var xslDOM=CreateXmlDocument();
		m_objGrpInfoXML.loadXML("<addresslist/>");

		window.onload= initOnload;
        function initOnload(){
            if (window.ActiveXObject || ("ActiveXObject" in window)) {        
                var pXML = "dbo.usp_GetDistributionList";
                var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><type>sp</type><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
                var szURL = "../GetXMLQuery.aspx";
                requestHTTP("POST",szURL,true,"text/xml",receiveHTTP, sXML);	
		    }else{
		        getXSL();
		    }                 	
		}
	    function getXSL(){
            var szURL = "DeployListMgrApvline_xsl.aspx";
            requestHTTP("GET",szURL,true,"text/xml",receiveHTTPXSL,null);
	    }
		function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
			m_xmlHTTP.open(sMethod,sUrl,bAsync);
			m_xmlHTTP.setRequestHeader("Accept-Language","ko");
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
                        if (window.ActiveXObject || ("ActiveXObject" in window)) {
					        xslDOM.async=false;
					        xslDOM.load("DeployListMgrApvline_xsl.aspx");
					    }					
						document.body.innerHTML = m_xmlHTTP.responseXML.transformNode(xslDOM);
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
                var pXML = "dbo.usp_GetDistributionList";
                var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><type>sp</type><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
                var szURL = "../GetXMLQuery.aspx";
                requestHTTP("POST",szURL,true,"text/xml",receiveHTTP, sXML);
   		    }
	    }		
		function event_noop(){return(false);}
		function changeChecked(e){
        	event_select();
            var sel_row = document.getElementsByName('chkRowSelect');
            var chk_count = sel_row.length;
            if (chk_count > 0) {
                for (var i = (chk_count - 1); i >= 0; i--) {
                    if (sel_row[i].checked) {
                        m_id = sel_row[i].getAttribute("strid");
                        selectRow(sel_row[i].getAttribute("strid"), e);
                    }
                }
            }        	
//			if (chkRowSelect.length==null){
//				m_id = chkRowSelect.strid;
//				selectRow(chkRowSelect.strid);
//			}
//			else{
//				for(i=0;i<chkRowSelect.length;i++){
//					if (chkRowSelect[i].checked) {
//						m_id = chkRowSelect[i].strid;
//						selectRow(chkRowSelect[i].strid);
//					}
//				}
//			}
		}
		var m_selectedRow=null;
		var m_selectedRowId=null;
		function selectRow(id, e){
			var oRow;
            var evt=(window.event)?window.event: e;
            var el = (evt.srcElement)?evt.srcElement:evt.target;	
				
			oRow=el.parentNode.parentNode;

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
				if(m_selectedRow!=null)m_selectedRow.className="";
				oRow.className="rowselected";
				m_selectedRow=oRow;
				m_selectedRowId=oRow.id;
			}
		}
		//결재선조회
		function queryGetData(){
			//var szURL = "/xmlwf/query/wf_privatedomaindata02.xml?PDD_ID="+m_id;
            var szURL = "../ApvLineList/GetApvlist.aspx?PDD_ID="+m_id;
			requestHTTP("GET",szURL,false,"text/xml",null,null);
			return receiveHTTPStep();
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
		function getCurrentNode(){
            var sel_row = document.getElementsByName('chkRowSelect');
            var chk_count = sel_row.length;
            if (chk_count > 0) {
                return makeCurrentNode(m_id);
            }else{
                return null;
            } 		
//			if (chkRowSelect.length==null){
//			    if (chkRowSelect.checked) {
//			        return makeCurrentNode(m_id);
//			    }else{
//			        return null;
//			    }
//			}else{
//		        return makeCurrentNode(m_id);
//			}
		}
	
		function makeCurrentNode(groupID){
			var oParentItem = m_objGrpInfoXML.selectSingleNode("addresslist");
			var oItem;
            var sel_row = document.getElementsByName('chkRowSelect');
            var chk_count = sel_row.length;
            if (chk_count > 0) {
			    var bchecked = false;
                for (var i = (chk_count - 1); i >= 0; i--) {
                    if (sel_row[i].getAttribute("strid")== groupID) {
    			        oItem = oParentItem.selectSingleNode("item[AN='" +  sel_row[i].getAttribute("strid")+ "']");
			            if(oItem==null){
				            oItem = oParentItem.appendChild(m_objGrpInfoXML.createElement("item"));
				            if(window.addEventListener){
				                oItem.appendChild(m_objGrpInfoXML.createElement("AN")).textContent=sel_row[i].getAttribute("strid");
				                oItem.appendChild(m_objGrpInfoXML.createElement("DN")).textContent=sel_row[i].getAttribute("strname");
				                oItem.appendChild(m_objGrpInfoXML.createElement("EM")).textContent=sel_row[i].getAttribute("strid");
				            }else{
				                oItem.appendChild(m_objGrpInfoXML.createElement("AN")).text=sel_row[i].getAttribute("strid");
				                oItem.appendChild(m_objGrpInfoXML.createElement("DN")).text=sel_row[i].getAttribute("strname");
				                oItem.appendChild(m_objGrpInfoXML.createElement("EM")).text=sel_row[i].getAttribute("strid");
				            }
			            }
					}
                }
            }             
//			if ( chkRowSelect.length==null){
//    			oItem = oParentItem.selectSingleNode("item[AN='" +  chkRowSelect.strid + "']");
//			    if(oItem==null){
//				    oItem = oParentItem.appendChild(m_objGrpInfoXML.createElement("item")); //
//				    oItem.appendChild(m_objGrpInfoXML.createElement("AN")).text=chkRowSelect.strid;
//				    oItem.appendChild(m_objGrpInfoXML.createElement("DN")).text=chkRowSelect.strname;
//				    oItem.appendChild(m_objGrpInfoXML.createElement("EM")).text=chkRowSelect.strid;
//			    }
//			}else{
//			    var bchecked = false;
//				for(i=0;i< chkRowSelect.length;i++){
//					if (chkRowSelect[i].strid == groupID) {
//    			        oItem = oParentItem.selectSingleNode("item[AN='" +  chkRowSelect[i].strid + "']");
//			            if(oItem==null){
//				            oItem = oParentItem.appendChild(m_objGrpInfoXML.createElement("item"));
//				            oItem.appendChild(m_objGrpInfoXML.createElement("AN")).text=chkRowSelect[i].strid;
//				            oItem.appendChild(m_objGrpInfoXML.createElement("DN")).text=chkRowSelect[i].strname;
//				            oItem.appendChild(m_objGrpInfoXML.createElement("EM")).text=chkRowSelect[i].strid;
//			            }
//					}
//				}
//			}
            return oItem;
		}
        function event_select()
        {
	        parent.document.getElementById("chk").value = "1";
        }	
					
		//배포리스트 보여주기
		function OpenDeployList(GroupID)
		{				
			var strURL ="DeployListPopup.aspx?GroupID=" + String(GroupID);
			//openWindow(strURL,"DeployList",300,350,'resize');			
			var strNewFearture = ModifyWindowFeature("toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=300,height=288");
	        window.open(strURL,"",strNewFearture);
	        //window.open(strURL,"","toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=300,height=288")
		}
		</script>
		
</html>
