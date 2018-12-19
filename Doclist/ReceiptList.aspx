<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ReceiptList.aspx.cs" Inherits="COVIFlowNet_Doclist_ReceiptList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
		<script type="text/javascript" language="javascript" src="../../common/script/coviflownet/openWindow.js"></script>
		<script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>
	</head>
	<body>
	<textarea id="ReceiptList" name="ReceiptList" style="display:none;" rows="10" cols="10"><%=strReceiptList %></textarea>
        <div class="popup_title">
          <div class="title_tl">
            <div class="title_tr">
              <div class="title_tc">
              <h2><span><%= Resources.Approval.lbl_receiptviewcomment_01 %></span></h2></div>
            </div>
          </div>
        </div>
        <table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
			<tr>	
				<td align="center" valign="top" width="100%" colspan="2">
				<!--내용들어갈 테이블 시작  -->
					<table width="100%" border="0" cellspacing="0" cellpadding="0">
						<tr>
							<td width="100%" height="3" align="center" valign="middle"></td>
						</tr>
					</table>	
					<table width="100%" border="0" cellspacing="1" cellpadding="0" align="center" bgcolor="white">
					    <%if (sReply == "1")
                        {%>
                            <tr class="BTable_bg02" style="height:25px">
                                <td width="5%"  valign="middle"><input type="checkbox" id="checkAll" onclick="checkAll(this);" /></td>							
			                    <td  valign="middle"><%= Resources.Approval.lbl_ent%></td>
                                <td  valign="middle"><%= Resources.Approval.lbl_RecvDeptName %></td>
			                    <td  valign="middle"><%= Resources.Approval.lbl_receiver %></td>						
			                    <td width="4%"  valign="middle"><%= Resources.Approval.lbl_receipt %><br /><%= Resources.Approval.lbl_Is %></td>
			                    <td width="4%"  valign="middle"><%= Resources.Approval.lbl_Processing %><br /><%= Resources.Approval.lbl_state %></td>
			                    <td width="7%"  valign="middle"><%= Resources.Approval.lbl_app %><br /><%= Resources.Approval.lbl_result2 %></td>
			                    <td  valign="middle"><%= Resources.Approval.lbl_arrived_time %></td>
			                    <td  valign="middle"><%= Resources.Approval.lbl_receipt_time %></td>
			                    <td  valign="middle"><%= Resources.Approval.lbl_complete_time %></td>
			                    <!-- 회신기능 추가 -->
			                    <td  valign="middle">&nbsp;</td>
			                    <td  valign="middle"><%= Resources.Approval.lbl_charge_person %></td>
			                    <td  valign="middle"><%= Resources.Approval.lbl_draft_date %></td>
			                    <td  valign="middle"><%= Resources.Approval.lbl_complete_time %></td>
                            </tr>
                            <tr><td colspan="13" class="line_gray"></td></tr>
                        <% } %>
                        <% else{ %>
						    <tr class="BTable_bg02" style="height:25px">
							    <td width="5%" valign="middle" ><input type="checkbox" id="checkAll" onclick="checkAll(this);" /></td>		
                                <td width="15%"  valign="middle" ><%= Resources.Approval.lbl_ent%></td>	
							    <td width="15%"  valign="middle" ><%= Resources.Approval.lbl_RecvDeptName %></td>	
							    <td width="10%"  valign="middle" ><%= Resources.Approval.lbl_receiver %></td>							
							    <td width="6%"  ><%= Resources.Approval.lbl_receipt %><br /><%= Resources.Approval.lbl_Is %></td>
							    <td width="6%" ><%= Resources.Approval.lbl_Processing %><br /><%= Resources.Approval.lbl_state %></td>
							    <td width="6%"  ><%= Resources.Approval.lbl_app %><br /><%= Resources.Approval.lbl_result2 %></td>
							    <td width="13%" valign="middle" ><%= Resources.Approval.lbl_arrived_time %></td>
							    <td width="13%" valign="middle" ><%= Resources.Approval.lbl_receipt_time %></td>
							    <td width="13%" valign="middle" ><%= Resources.Approval.lbl_complete_time %></td>
						    </tr>
                            <tr><td colspan="9" class="line_gray"></td></tr>
						<% } %>
						<%=strDisplayList %>
					</table>
					<!--내용들어갈 테이블 끝  -->
					<table width="100%" border="0" cellspacing="0" cellpadding="0">
						<tr>
							<td width="100%" height="3" align="center" valign="middle"></td>
						</tr>
					</table>					
				</td>
			</tr>
		</table>
		<div class="popup_Btn small AlignR">
            <a href="#" class="Btn04" id="btSend" name="cbBTN" onclick="javascript:editList(true);" style="display:none;"><span><%= Resources.Approval.btn_addsend %></span></a>
            <a href="#" class="Btn04" id="btDelete" name="cbBTN" onclick="javascript:deleteClick();" style="display:none;"><span><%= Resources.Approval.btn_sendcancel%></span></a>
            <a href="#" class="Btn04" id="btExcel" name="cbBTN" onclick="javascript:excelDown();" style="display:none;"><span><%= Resources.Approval.lbl_SaveToExcel %></span></a>
            <a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:window.close();"><span><%= Resources.Approval.btn_close %></span></a>
        </div> 
        <form class="form" id="form1" method="post" name="myform" target="result_fr"></form>
        <iframe src="" name="result_fr" height="100" width="100" style="DISPLAY:none;"></iframe>	
<script type="text/javascript" language="javascript">	
		var m_xmlHTTP = CreateXmlHttpRequest();
		var m_evalXML = CreateXmlDocument();
//		var m_xslProcessor = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
//		var m_cvtXML = new ActiveXObject("MSXML2.DOMDocument").createTextNode("");

		var g_szAcceptLang="ko";
		var ppiid ="<%=sPPIID %>";
		var pdid = "<%=sPDEFID %>";
		var reply = "<%=sReply %>";
	    var fiid = "<%=sFiid %>";

		window.onload= initOnload;
        function initOnload(){
		    //버튼 활성화
		    //발신부서원일 경우 삭제 및 추가 발송 버튼 활성화. 그 외는 사용 불가
		    if (opener.getInfo("INITIATOR_OU_ID") == opener.getInfo("dpid_apv")){
		         document.getElementById("btSend").style.display = "";
		         document.getElementById("btDelete").style.display = "";
		         document.getElementById("btExcel").style.display = "";
		    }
		}
		
		function checkAll(obj){
		    var chklist = document.getElementsByName("cField");
		    
		    if(chklist.length == null || chklist.length == "0") {

		    }
            /*
		    else{
		        if(obj.checked == true){ 		     
		            for(var i=0; i< chklist.length; i++){			           	 					
					    chklist[i].checked = true;					   
				    }
				}
				else{			
					for(var i=0; i< chklist.length; i++){		 					
					    chklist[i].checked = false;
				    }
				}		    		    		    
		    }
            */
                    
                    /*[2013-12-12] checkbox 수정 PSW*/ 
		    else {
		        if (obj.checked == true) {
		            for (var i = 0; i < chklist.length; i++) {
		                if (chklist[i].disabled == true) {
		                    chklist[i].checked = false;
		                }
		                else {
		                    chklist[i].checked = true;
		                }
		            }
		        }
		        else {
		            for (var i = 0; i < chklist.length; i++) {
		                chklist[i].checked = false;
		            }
		        }
		    }
                    /*끝*/
            		   
		}
				
	    function deleteClick(cField){
	        XmlSet();
		}
		function XmlSet(){
			var sItems="<request><mode>delete</mode>";
			var sUrl;
			var piid =null;
			var wiid = null;
			var strflag = false;
			if ( document.getElementsByName("cField").length == null || document.getElementsByName("cField").length == 0 ){
					if( document.getElementById("cField").checked == true){
						var aFiles =  document.getElementById("cField").value.split(":");	
						wiid = aFiles[0];					
						piid = aFiles[1];
						sItems+="<item wiid=\"" +  wiid + "\"  piid=\"" +  piid + "\"/>"
            			strflag = true;
					}
			}else{
				for(var i=0; i<document.getElementsByName("cField").length; i++){					
					if(document.getElementsByName("cField")[i].checked == true)
					{
						var var_split = document.getElementsByName("cField")[i].value;															
						var aFiles = var_split.split(":");						
						wiid = aFiles[0];					
						piid = aFiles[1];
						sItems+="<item wiid=\"" +  wiid + "\"  piid=\"" +  piid + "\"/>"
            			strflag = true;
					}					
				}
			}
			
			sItems+="</request>";

			//alert(sItems);
			sUrl = "ReceiptModify.aspx";		
			
			if(strflag == false){
				alert("<%=Resources.Approval.msg_003 %>");
				return;
			}else{	
			    var truthBeTold = window.confirm("<%=Resources.Approval.msg_190 %>");//"해당 항목들을 발송 취소하시겠습니까?"
			    if (truthBeTold != true){return;}
    			
			    requestHTTP("POST",sUrl,false,"text/xml",receiveGeneralQuery,sItems);
			    receiveGeneralQuery();
			}
		}
//		function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
//			m_xmlHTTP.open(sMethod,sUrl,bAsync);
//			m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
//			m_xmlHTTP.setRequestHeader( "Content-type", sCType);
//			if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
//			(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
//			
//		}
		function receiveGeneralQuery(){
			if(m_xmlHTTP.readyState==4){
			    m_xmlHTTP.onreadystatechange=event_noop;
			    if(m_xmlHTTP.responseXML.xml==""){
				    alert(m_xmlHTTP.responseText);
			    }else{
				    var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
				    if(errorNode!=null){
					    alert("Desc: " + errorNode.text);
				    }else{
					    alert(m_xmlHTTP.responseXML.documentElement.text);
					    window.close();
				    }
			    }
			}
		}
		function event_noop(){return(false);} 
		//추가발송
    	var gbGroup = false;
        function editList(bGroup){
            //중복안내메시지
            //추가발송 가능하도록 안내창 띄우지 않기 2014-04-16
            alert("<%=Resources.Approval.msg_192 %>");//이미 발송된 부서는 발송대상에서 제외합니다.
            gbGroup = bGroup;
            var rgParams=null;
            rgParams=new Array();
            rgParams["bMail"]  = false;
            rgParams["bUser"] = (bGroup==true)?false:true;
            rgParams["bGroup"] = false;
            rgParams["bRef"] = false;
            rgParams["bIns"] = false; 
            rgParams["bRecp"] = bGroup; 
            rgParams["sCatSignType"] = null; 
            rgParams["sDeptSignType"] = null;
            rgParams["sDeptSignStatus"] = null; 
            rgParams["sUserSignType"] = null;
            rgParams["sUserSignStatus"] = null; 
            rgParams["objMessage"] = window;
           
            var szFont = "FONT-FAMILY: '굴림';font-size:9px;";
            var nWidth = 640;
            var nHeight = 610;
            var sFeature = szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;help:no;";
            var strNewFearture = ModifyDialogFeature(sFeature);
            //var vRetval = window.showModelessDialog("/coviweb/Approval/address/address.aspx", rgParams, szFont+"dialogHeight:"+nHeight+"px;dialogWidth:"+nWidth+"px;status:no;resizable:yes;help:no;");
            //var vRetval = window.showModelessDialog("/COVIWeb/approval/address/address.aspx?From=ReceiptList", rgParams, strNewFearture);
            var vRetval = window.showModalDialog("/COVIWeb/approval/address/address.aspx?From=ReceiptList", rgParams, strNewFearture);  //크로스브라우징처리위해 모달창으로 변경 (2013-03-21 HIW)
       }
        function insertToList(oList){
            try{//debugger;
            var oSrcDoc = CreateXmlDocument();
            /*
	        if (!oSrcDoc.loadXML(oList.xml)) { 
	            return;
	        }
            */
	        var vXMLStr = ReplaceChars(oList.xml, "&amp;", " ");  //2013-03-15 HIW
	        if (!oSrcDoc.loadXML(vXMLStr)) {
	            return;
	        }
            
            if ( oSrcDoc.selectNodes("//item/AN").length > 0 ){
                var strflag = false;
    			var sItems="<request>";
    		    var sAddage="";	
			    sAddage = opener.makeNode("pipo","3") + opener.makeNode("dpid") + opener.makeNode("dpid_apv") + opener.makeNode("dpdsn") + opener.m_oFormEditor.getFormXML();
	            var sXML 
	            = opener.makeNode("ppiid",ppiid )  + opener.makeNode("pdef",pdid) + opener.makeNode("mode","DRAFT")  
	            + opener.makeNode("fmid") + opener.makeNode("fmnm") + opener.makeNode("fmpf") + opener.makeNode("fmbt") + opener.makeNode("fmrv")
	            + opener.makeNode("fiid") + opener.makeNode("ftid") + opener.makeNode("pfid") + opener.makeNode("scid") + opener.makeNode("fmfn")+ opener.makeNode("fiid_response") + opener.makeNode("fiid_spare")
	            + opener.getFormInfosXML() + opener.getFormInfoExtXML()
	            + opener.getApvList();
			    
    			sItems += sXML+ sAddage ;
                if (gbGroup){//부서 발신
	                //scChgrOU.value = oList.selectSingleNode("item/AN").text + "@" + oList.selectSingleNode("item/DN").text;
	                var oitems =oSrcDoc.selectNodes("//item");
	                for(var i=0;i<oitems.length;i++){
    		            var elm = oitems.nextNode();
    		            var cmpoucode = ";" + elm.selectSingleNode("AN").text + ";";

                        //중복해도 재배포 가능하게 if문 주석 처리 2014-02-21 hyh
    		            //중복이면 재배포 불가능
                        
    		            //if ( ReceiptList.value.indexOf(cmpoucode) == -1){
					        sItems+="<item ouid=\"" +  elm.selectSingleNode("AN").text + "\"  ounm=\"" +  elm.selectSingleNode("DN").text + "\"/>";
					        strflag = true;
					   // }
					}
	            }else{
	                //scCAt1.value = oList.selectSingleNode("item/AN").text + "@" + oList.selectSingleNode("item/ETNM").text+"-"+oList.selectSingleNode("item/RGNM").text+"-"+oList.selectSingleNode("item/DN").text;
	            }
		        sItems+="</request>";

		        //alert(sItems);
		        sUrl = "ReceiptModify.aspx";		
    			
		        if(strflag == false){
			        alert("<%=Resources.Approval.msg_136 %>");//항목이 없습니다.
			        return;
		        }	
		        truthBeTold = window.confirm("<%=Resources.Approval.msg_191 %>");//"해당 항목들을 발송하시겠습니까?"
		        if (truthBeTold != true){return;}

		        requestHTTP("POST", sUrl, true, "text/xml", receiveGeneralQuery, sItems);

	        }
	        }catch(e){alert(e.message);}
        }
        /********************************************************************************************
        작성목적    : 리스트 엑셀다운
        작성자      : 백 승 찬 대리 
        최초작성일  : 2008-07-30
        최종작성일  :
        수정내역    :
        ********************************************************************************************/
	   function excelDown()
	   {
	        document.form1.action = "ReceiptListExcel.aspx?ppiid=" + ppiid+"&fiid="+fiid+"&reply="+reply ;
		    document.form1.target = "result_fr";
		    document.form1.submit();			
	   }
		</script>        
</body>
</html>
