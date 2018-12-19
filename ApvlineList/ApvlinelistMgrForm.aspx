<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApvlinelistMgrForm.aspx.cs" Inherits="COVIFlowNet_ApvlineList_ApvlinelistMgrForm" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
   
  
</head>
<body style="MARGIN: 0px;    OVERFLOW: hidden">
    <input type="hidden" id="title" name="title"  maxlength="20">
    <input type="hidden" id="description" name="description" >
    <div class="popup_title">
      <div class="title_tl">
        <div class="title_tr">
          <div class="title_tc">
            <h2><%= Resources.Approval.lbl_formcreate_LCODE17%>&nbsp;<select id='SelEnt' onchange="SetENT(this.value)"></select></h2>
          </div>
        </div>
      </div>
    </div>        
    <div style="padding-top:0px;padding-left: 0px; padding-right: 0px;">
        <!-- 등록 div 시작 -->
        <div class="write" style="padding-top:0px;">
            <!-- 일반 div 시작 -->
            <div style="padding-top:0px;">         
	            <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td>
                        <iframe id="ApvlineViewer" frameborder="0" style="WIDTH:100%;HEIGHT:440px;" src="../ApvlineMgr/ApvlinePrivate.aspx"></iframe>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
     </div>
    <div class="popup_Btn small" style=" text-align: right; padding-right: 20px;">
      <table border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td><a class="Btn04" href="#" id="btn_save"  onclick="javascript:doButtonAction();"><asp:Label ID="btOK" runat="server" /></a></td>
          <td><a class="Btn04" href="#" id="btn_delete"  onclick="javascript:doButtonAction();"><asp:Label ID="btDelete" runat="server" /></a></td>
          <td><a class="Btn04" href="#" id="btn_close"  onclick="javascript:doButtonAction();"><asp:Label ID="btExit" runat="server" /></a></td>
        </tr>
      </table>
    </div>
  <script language="javascript" type="text/javascript">
		var m_evalXML = new ActiveXObject("MSXML2.DOMDocument");
		var m_xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP");
		if (parent.m_id == "") {
			parent.menu.APVLIST.value = "";
		}else{
			queryGetData();
		}

		function queryGetData() 
		{
			var szURL = "GetApvlist.aspx?PDD_ID="+parent.m_id;
			requestHTTP("GET",szURL,false,"text/xml",receiveHTTPStep,null);
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
						parent.menu.APVLIST.value = m_xmlHTTP.responseXML.selectSingleNode("response/item[id='"+parent.m_id+"']/signinform/steps").xml; 			
					}
				}
			}
		}
		function doButtonAction(){		
			switch(event.srcElement.id){
				case "btOK":
					if ( title.value.length == 0 )
					{
					    alert('<%=msg_err_apv_subject%>');
					    title.focus();return false;
					}
					var elmRoot = ApvlineViewer.m_oApvList.documentElement;	
					if (elmRoot.childNodes.length < 1)
					{
					    alert('<%=msg_err_apv_line%>');
					    return false;
					}
					if (parent.m_id!=""){
						setchangeApvlineList();
					}
					else{
						setApvlineList();
					}
					break;		
				//삭제 기능 추가(2007.5.10. by chlee)
				case "btDelete":
					if ( title.value.length == 0 )
					{
					    alert('<%=msg_err_apv_subject%>');
					    title.focus();return false;
					}
					var elmRoot = ApvlineViewer.m_oApvList.documentElement;	
					
					if (parent.m_id!=""){
						if(!confirm("지정결재선을 삭제 하시겠습니까?"))
						{
								return false;
						}
						setdeleteApvlineList();
					}				
					break;				
				case "btExit":	
					parent.CloseSelectorApvLine();
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
//						window.close();
//						top.opener.location.reload();	
					    parent.processRequest("APVLINE");
					    parent.CloseSelectorApvLine();
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
	<script language="javascript" type="text/javascript">
		title.value = parent.field["fmpf"].value;
		description.value = parent.field["fmnm"].value;
	    function setchangeApvlineList(){				
		    var elmRoot = ApvlineViewer.m_oApvList.documentElement;	
			
		    if (chkConsultAppLine(elmRoot)){				
				var sText = "<request><type>change</type><id>"+parent.m_id+"</id><userid>"+parent.field["fmid"].value+"</userid><title><![CDATA["+title.value+"]]></title><dscr><![CDATA["+description.value+"]]></dscr>"+elmRoot.xml+"</request>";
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
	   //삭제 기능 추가(2007.5.10. by chlee) 
	    function setdeleteApvlineList(){				
		    var elmRoot = ApvlineViewer.m_oApvList.documentElement;	
			
		    if (chkConsultAppLine(elmRoot)){				
				var sText = "<request><type>delete</type><id>"+parent.m_id+"</id><userid>"+parent.field["fmid"].value+"</userid><title><![CDATA["+title.value+"]]></title><dscr><![CDATA["+description.value+"]]></dscr>"+elmRoot.xml+"</request>";
			    evalXML(sText);

			    m_xmlHTTP.open("POST","SetApvlist.aspx",true);
			    //m_xmlHTTP.setRequestHeader("Accept-Language","ko");
			    m_xmlHTTP.setRequestHeader("Content-type", "text/xml");
			    m_xmlHTTP.onreadystatechange=receiveHTTP;
			    m_xmlHTTP.send(sText);
			   parent.self.close(); 
		    }else{
			    return false;
		    }
	    } 
	    function setApvlineList(){				
		    var elmRoot = ApvlineViewer.m_oApvList.documentElement;	
			
		    if (chkConsultAppLine(elmRoot)){
				var sText = "<request><type>add</type><id>"+parent.m_id+"</id><userid>"+parent.field["fmid"].value+"</userid><title><![CDATA["+title.value+"]]></title><dscr><![CDATA["+description.value+"]]></dscr>"+elmRoot.xml+"</request>";
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
        var	m_xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP");
        
        function SetENT(m_EntCode)
        {
            ApvlineViewer.iSearch.frameElement.src="search.aspx?Ent="+m_EntCode;
            ApvlineViewer.iGroup.frameElement.src="OrgTree.aspx?Ent="+m_EntCode;
        }
        function GetEnt(){
            
            /* parameter type 숫자값
            Data.SqlDbType.NChar : 10
            Data.SqlDbType.NText :11
            Data.SqlDbType.VarChar : 12
            Data.SqlDbType.Char : 3
            Data.SqlDbType.VarChar : 22
            Data.SqlDbType.Int : 8
            Data.SqlDbType.DateTime : 4
            */
            
            var pXML = "exec usp_GetEntInfo";
            var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
            var szURL = "../GetXMLQuery.aspx";
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
		                SelEnt.length = 0;
		                SelEnt.options.add(oOption);
	                    oOption.text="전체";
	                    oOption.value="";
    			        
		                for(var i = 0; i < elmlist.length; i++)
		                {
		                    elm = elmlist.nextNode();
    			            
		                    var oOption = document.createElement("OPTION");
		                    SelEnt.options.add(oOption);
		                    oOption.text=elm.selectSingleNode("NAME").text;
		                    oOption.value=elm.selectSingleNode("ENT_CODE").text;
		                }
    			        
		                SelEnt.value = '<%=Session["user_ent_code"].ToString()%>';
	                }
                }
            }
        }
        
        GetEnt();
    </script>
		
	</body>
</html>
