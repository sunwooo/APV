<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DPrivateLineList.aspx.cs" Inherits="DeployList_DPrivateLineList" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Untitled Page</title>
    <script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
</head>
<body  leftmargin="0" topmargin="0" marginheight="0" marginwidth="0" style="OVERFLOW: auto;    MARGIN: 0px;">
</body>
<script language="javascript" type="text/javascript">
		var UserID="<%=UserID%>";
		var m_id="";
		var m_xmlHTTP=CreateXmlHttpRequest();
		var xslDOM=CreateXmlDocument();
        window.onload= initOnload;
        function initOnload(){
            if (window.ActiveXObject || ("ActiveXObject" in window)) {
			    var szURL = "GetDeploylist.aspx?USER_ID="+UserID;			
			    requestHTTP("GET",szURL,true,"text/xml",receiveHTTP,null);
			}else{
		        getXSL();
		    }    
		}
	    function getXSL(){
            var szURL = "DeployLineMgr_xsl.aspx";
            requestHTTP("GET",szURL,true,"text/xml",receiveHTTPXSL,null);
	    }
		function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
			m_xmlHTTP.open(sMethod,sUrl,bAsync);			
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
					        xslDOM.load("DeployLineMgr_xsl.aspx");
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
			    var szURL = "GetDeploylist.aspx?USER_ID="+UserID;			
			    requestHTTP("GET",szURL,true,"text/xml",receiveHTTP,null);
   		    }
	    }		
		function event_noop(){return(false);}
		function changerChk(e){
            var sel_row = document.getElementsByName('rChk');
            var chk_count = sel_row.length;
            if (chk_count > 0) {
                for (var i = (chk_count - 1); i >= 0; i--) {
                    if (sel_row[i].checked) {
                        m_id = sel_row[i].id;
                        selectRow(sel_row[i].id, e);
                    }
                }
            } 		
		}
		var m_selectedRow=null;
		var m_selectedRowId=null;
		function selectRow(id,e){
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
//				if(m_selectedRow!=null)m_selectedRow.className="";
//				oRow.className="rowselected";
				m_selectedRow=oRow;
				m_selectedRowId=oRow.id;
			}
		}
		
		function queryGetData(){
			var szURL = "GetDeploylist.aspx?PDD_ID="+m_id;			
			requestHTTP("GET",szURL,false,"text/xml",null,null);
			return receiveHTTPStep();
		}
		function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
			m_xmlHTTP.open(sMethod,sUrl,bAsync);			
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
						return m_xmlHTTP.responseXML.selectSingleNode("response/item[id='"+m_id+"']/signinform");
					}
				}
			}
		}		
		var oList;		
		function showList(obj){
		    m_id = obj.id.substring(3);
		    oList = queryGetData();
		    var strURL ="../ApvlineList/DeployListPopup2.aspx";
//			var x = 300;
//			var y = 300;
//			
//			var sy = window.screen.height / 2 - y / 2 - 70;
//			var sx = window.screen.width  / 2 - x / 2;
//			
//	        if (sy < 0 ) 
//	        {
//		        sy = 0;
//	        }
//	
//	        var sz = ",top=" + sy + ",left=" + sx;
	        
	       // var sFeature = "toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=1"+ ",width=" + x + ",height=" + y + sz;
    
            //창사이즈 강제적용함수 호출
            //var strNewFearture = ModifyWindowFeature(sFeature);

            var strNewFearture = ModifyWindowFeature("toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=300,height=288");
	        window.open(strURL,"",strNewFearture);
	        //window.open(strURL,"","toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=300,height=288")
		}
		</script>
</html>
