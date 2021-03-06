﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="orgtree.aspx.cs" Inherits="COVIFlowNet_ApvlineMgr_orgtree" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>
	<script type="text/javascript" language="javascript" src="../address/tree.js"></script>
</head>
<body leftmargin="0" topmargin="0"  style="OVERFLOW: auto;    MARGIN: 0px;">
    <span id="tooltip" class="tooltip"></span>
		<table width="100%" height="100%"  border="0" cellpadding="10" cellspacing="0" class="pop_gray">
			<tr>
			    <td  valign="top">
					<UL class="toc" name="clicked" onclick="outliner(event);" onseletstart="return false;" onmouseover="mouseEnters(event);" onmouseout="mouseLeaves(event);" nowrap="t">
					<%= sOrgtree %>
					</UL>
				</td>
			</tr>
		</table>
		<%Response.Flush();%>
		<script language="javascript" type="text/javascript">
			var TopGroupCN = "<%=Session["TopGroupCode"]%>";
			var g_ENT = "<%=Ent%>";
			var g_user_check_all_title	=	"<%=Session["user_checkall_title"]%>";
			//var g_UseOUManager = "<%= System.Configuration.ConfigurationManager.AppSettings["WF_UseOUManager"]%>";
			var g_UseOUManager = "F";
            if(parent.location.href.indexOf("/ApvlineMgr.aspx") > 0){
                g_UseOUManager = "<%= System.Configuration.ConfigurationManager.AppSettings["WF_UseOUManager"]%>";
            }
			var m_objGrpInfoXML = CreateXmlDocument();
			var m_xmlHTTP = CreateXmlHttpRequest();
			var m_subHTTP = CreateXmlHttpRequest();
			var m_oNode = null;
			var m_objResultWin;
			var m_sSelGrpID;
			var gLngIdx = <%=strLangIndex %>;

            m_objGrpInfoXML.loadXML("<addresslist/>");
            //if ("ActiveXObject" in window) {
            //    window.document.attachEvent("onmousemove",event_Tree_onmousemove);	
            //} else {
            //    window.document.addEventListener('onmousemove',event_Tree_onmousemove, false);
            //}
			if(window.addEventListener){
			    window.document.addEventListener('onmousemove',event_Tree_onmousemove, false);
			}else{
			    window.document.attachEvent("onmousemove",event_Tree_onmousemove);	
            }
            window.onload= init;
			function init(){
					m_objResultWin = parent.ListItems;
					setSourceList();
			}
			function setSourceList(){}
			function getLocalMember()
			{
			    getMembers('<%=Session["user_dept_code"]%>;<%=Session["user_dept_name"]%>');
			}
			
			
			function getMembers(groupID){
				var groupArray = groupID.split(";");
				m_objResultWin.clearContents();	
				try{
                    var re1 = /&/g;
                    var re2 = /=/g;
                    var szOrder = "orderby=displayName";
                    var szURL;
                    var sXML;

					m_sSelGrpID = groupArray[0].toString();
					//parent.parent.Detail.getDetailInfo(m_sSelGrpID);
					
					//부서장 결재를 위해 추가함. 부서장 결재를 하지 않는 경우 주석처리할것
					var pXML = "dbo.usp_GetMember01";
                    var aXML = "<param><name>ENT_CODE</name><type>VarChar</type><length>100</length><value><![CDATA["+g_ENT+"]]></value></param>";
                    aXML += "<param><name>UNIT_CODE</name><type>VarChar</type><length>100</length><value><![CDATA["+groupArray[0].replace(re1,String.fromCharCode(8)).replace(re2,String.fromCharCode(11))+"]]></value></param>";
                    aXML += "<param><name>FLAG</name><type>VarChar</type><length>100</length><value><![CDATA["+((g_UseOUManager == "T")?"1":"0") +"]]></value></param>";

                    sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath>org_memberquery.xsl</xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
                    szURL = "../Address/getXMLQuery.aspx?Type=Member";
	                
                    requestHTTP("POST",szURL,true,"text/xml",listenXMLHTTP, sXML);
					doProgressIndicator(true);

				}
				catch(e){
					doProgressIndicator(false);
					alert("OrgTree error: "+e.description + "\r\nError number: " + e.number);
				}
			}

            function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
                m_xmlHTTP.open(sMethod,sUrl,bAsync);
                //m_xmlHTTP.setRequestHeader("Accept-Language","ko");
                m_xmlHTTP.setRequestHeader( "Content-type", sCType);
                if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
                (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
            }

            function event_noop(){return false;}   
            function requestSubHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
                m_subHTTP.open(sMethod,sUrl,bAsync);
                //m_xmlHTTP.setRequestHeader("Accept-Language","ko");
                m_subHTTP.setRequestHeader( "Content-type", sCType);
                if(pCallback!=null)m_subHTTP.onreadystatechange = pCallback;
                (vBody!=null)?m_subHTTP.send(vBody):m_subHTTP.send();
            }
			 
			function listenXMLHTTP(){
				if(m_xmlHTTP.readyState == 4){
					doProgressIndicator(false);     
					m_xmlHTTP.onreadystatechange = event_noop;
					if(m_xmlHTTP.responseText.charAt(0)=='\r'){
						alert("Source:listenXMLHTTP() in OrgTree.aspx\n"+m_xmlHTTP.responseText);
					}else{
						var oDOM = m_xmlHTTP.responseXML;
				
						var oErr = oDOM.documentElement.selectSingleNode("//error");
						if(oErr==null||oErr.text=="none"){
							m_objResultWin.processXmlData(oDOM);
						}else{
							if(oErr.text!="none")alert("Source:listenXMLHTTP() in OrgTree.aspx\n"+oErr.text);
						}
					}
				}
			}
			function doProgressIndicator(fDisplay){
				if (fDisplay){
					m_objResultWin.addMessage("<%= Resources.Approval.lbl_searchprocessing %>");					
				}else{
					m_objResultWin.clearContents();
				}
			}
			function getSubGroups(groupID){
				m_oNode = document.getElementById(groupID);
				groupID = groupID.replace("_","");
				groupID = groupID.replace(";","");
				m_sSelGrpID = groupID;
				if(m_oNode!=null){
					if(m_oNode.firstChild==null){
						if(m_oNode.name!="clicked"){
							try{
								var re1 = /&/g;
								var re2 = /=/g;

                                var pXML = "dbo.usp_GetUnit";
                                var aXML = "<param><name>PARENT_UNIT_CODE</name><type>VarChar</type><length>100</length><value><![CDATA["+groupID.replace(re1,String.fromCharCode(8)).replace(re2,String.fromCharCode(11))+"]]></value></param>";
                                var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath>org_unit.xsl</xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
                                var szURL = "../address/getXMLQuery.aspx?Type=Unit";

                                requestSubHTTP("POST",szURL,true,"text/xml",listenSUBHTTP, sXML);
                                doProgressIndicator(true);
							}
							catch(e){
            			          doProgressIndicator(false);
								alert("Source:getSubGroups() in OrgTree.aspx\nNo:"+e.number+" Desc:"+e.description);
							}
						}else{
							m_oNode.className = "closed";
						}
					}
				}
			}

      function requestSubHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
        m_subHTTP.open(sMethod,sUrl,bAsync);
        //m_xmlHTTP.setRequestHeader("Accept-Language","ko");
        m_subHTTP.setRequestHeader( "Content-type", sCType);
        if(pCallback!=null)m_subHTTP.onreadystatechange = pCallback;
        (vBody!=null)?m_subHTTP.send(vBody):m_subHTTP.send();
      }

			function listenSUBHTTP(){
				if(m_subHTTP.readyState == 4){
					m_subHTTP.onreadystatechange = event_noop;
                    doProgressIndicator(false);

					if(m_subHTTP.responseText.charAt(0)=='\r'){
						alert("Source:listenSUBHTTP() in OrgTree.aspx\n"+m_subHTTP.responseText);
					}
					else{
						m_oNode.name = "clicked";
						var oDOM = m_subHTTP.responseXML;
						var oErr = oDOM.documentElement.selectSingleNode("error");
						if(oErr==null){
							var szParsed = parseSubGroups(oDOM);
							(szParsed=="")?m_oNode.style.display="none":m_oNode.innerHTML = szParsed;
						}
						else{
							if(oErr.text!="none")
								alert("Source:listenSUBHTTP() in OrgTree.aspx\n"+oErr.text);
							else
								m_oNode.className = "closed";
						}
					}
				}
			}
			function parseSubGroups(objXML){
				var strParsed = "";
				var nodesAllItems = objXML.selectNodes("response/addresslist/item");
				var szANE;
				if (nodesAllItems.length > 0){
					strParsed = "<div id=sublistitems>";
					var szDN = "";
					var szAN = "";
					var szRN = "";
					var szCN = "";
					var szClass = "" ;
					var oItem;
					for(var x=0; x<nodesAllItems.length; x++){                       
						oItem = nodesAllItems.nextNode();
						szAN = nodeData(oItem,"AN");
						szANE = "_" + nodeData(oItem,"AN");
						szDN = nodeData(oItem,"DN");
						szRN = nodeData(oItem,"RN");
						try{szCN = nodeData(oItem,"CN");}
						catch(e){szCN = "1";}
						if(szCN == 0) {szClass = " class='spot'" ;}
						else {szClass = " class='exe'" ;}
						
						var sRcv = nodeData(oItem,"@rcv");
						//etnm 추가 (부서회람땜시) 2006.12
						strParsed = strParsed + "<LI" + szClass
									+ " an=\"" + szAN + "\""
									+ " em=\"" + nodeData(oItem,"EM") + "\""
									+ " jd=\"" + nodeData(oItem,"DN") + "\""
									+ " etnm=\"" + nodeData(oItem,"ETNM") + "\""
									//+ " pi=\"" + nodeData(oItem,"PI") + "\""
									+ " rcv=\"" + sRcv + "\""
									+ " rn=\"" + szRN + "\">"
									//+ "<img src=\"" + (sRcv=="Y"?"folder":"space") + ".gif\"> "
									+ "<A HREF=\"javascript:getMembers('" + szAN + ";" + szDN.replace(/"/g,"&quot;").replace(/'/g,"&apos;") + "');\">" +  getLngLabel(szDN,false) + "</A>"
									+ "<UL id=\"" + szANE + "\" name=\"\"></UL></LI>";
									//alert(strParsed);
					}
					strParsed = strParsed + "</div>";
				}
				return strParsed;
			}
			function nodeData(oNode,szName){return oNode.selectSingleNode(szName).text.replace(/\x08/g,"&");}
			function event_Tree_onmousemove(e){
//                var evt=(window.event)?window.event:e;
//                var el = (evt.srcElement)?evt.srcElement:evt.target;
//			
//				document.getElementById("tooltip").style.display = "none";
//				if(el==null)return;
//				if (el.tagName=="LI" || el.tagName=="A"){
//					while(el.tagName != "LI"){
//						el = el.parentNode;
//						if(el==null)return;
//					}
//					if(el.getAttribute("jd")!=null && el.getAttribute("jd") != ""){
//						document.getElementById("tooltip").innerText = getLngLabel(el.getAttribute("jd"),false);
//						document.getElementById("tooltip").style.left = (window.event)?event.offsetX:e.ClientX + 10 + "px";
//						document.getElementById("tooltip").style.top = (window.event)?event.offsetY:e.ClientY + 10 + "px";
//						document.getElementById("tooltip").style.zIndex = 1;
//						document.getElementById("tooltip").style.display = "block";
//					}
//				}
			}
			function makeCurrentNode(groupID){
					//Alias,DisplayName,SuperAlias,SuperDisplayName
                var oParentItem = m_objGrpInfoXML.selectSingleNode("addresslist");
				var oItem = oParentItem.selectSingleNode("item[AN='" + groupID + "']");
				var tmpgroupID = "_" + groupID;
				var oNode = document.getElementById(tmpgroupID).previousSibling;
				var rcv = oNode.parentNode.getAttribute("rcv");
				if(oItem==null){
                    oItem = oParentItem.appendChild(m_objGrpInfoXML.createElement("item"));
                    if ("ActiveXObject" in window) {
                        oItem.appendChild(m_objGrpInfoXML.createElement("AN")).text=groupID;
                    } else {
                        oItem.appendChild(m_objGrpInfoXML.createElement("AN")).textContent=groupID;
                    }
					//if(window.addEventListener){
					//    oItem.appendChild(m_objGrpInfoXML.createElement("AN")).textContent=groupID;
					//    //oItem.appendChild(m_objGrpInfoXML.createElement("DN")).textContent=oNode.text;
					//}else{
					//    oItem.appendChild(m_objGrpInfoXML.createElement("AN")).text=groupID;
					//    //oItem.appendChild(m_objGrpInfoXML.createElement("DN")).text=oNode.innerText;
					//}		
                    oNode = oNode.parentNode;
                    if ("ActiveXObject" in window) {
                        oItem.appendChild(m_objGrpInfoXML.createElement("DN")).text = oNode.getAttribute("jd") == null ? "" : oNode.getAttribute("jd");
					    oItem.appendChild(m_objGrpInfoXML.createElement("EM")).text = oNode.getAttribute("em") == null ? "" : oNode.getAttribute("em");
					    oItem.appendChild(m_objGrpInfoXML.createElement("JD")).text = oNode.getAttribute("jd") == null ? "" : oNode.getAttribute("jd");
					    oItem.appendChild(m_objGrpInfoXML.createElement("RN")).text = oNode.getAttribute("rn") == null ? "" : oNode.getAttribute("rn");
					    oItem.appendChild(m_objGrpInfoXML.createElement("PI")).text = oNode.getAttribute("pi") == null ? "" : oNode.getAttribute("pi");
					    oItem.appendChild(m_objGrpInfoXML.createElement("ETNM")).text=oNode.getAttribute("etnm") == null ? "" : oNode.getAttribute("etnm");; //회사명 추가 2006.12
                    } else {
                        oItem.appendChild(m_objGrpInfoXML.createElement("DN")).textContent=oNode.getAttribute("jd");
					    oItem.appendChild(m_objGrpInfoXML.createElement("EM")).textContent=oNode.getAttribute("em");
					    oItem.appendChild(m_objGrpInfoXML.createElement("JD")).textContent=oNode.getAttribute("jd");
					    oItem.appendChild(m_objGrpInfoXML.createElement("RN")).textContent=oNode.getAttribute("rn");
					    oItem.appendChild(m_objGrpInfoXML.createElement("PI")).textContent=oNode.getAttribute("pi");
					    oItem.appendChild(m_objGrpInfoXML.createElement("ETNM")).textContent=oNode.getAttribute("etnm"); //회사명 추가 2006.12
                    }
                    /*
					if(window.addEventListener){
					    oItem.appendChild(m_objGrpInfoXML.createElement("DN")).textContent=oNode.getAttribute("jd");
					    oItem.appendChild(m_objGrpInfoXML.createElement("EM")).textContent=oNode.getAttribute("em");
					    oItem.appendChild(m_objGrpInfoXML.createElement("JD")).textContent=oNode.getAttribute("jd");
					    oItem.appendChild(m_objGrpInfoXML.createElement("RN")).textContent=oNode.getAttribute("rn");
					    oItem.appendChild(m_objGrpInfoXML.createElement("PI")).textContent=oNode.getAttribute("pi");
					    oItem.appendChild(m_objGrpInfoXML.createElement("ETNM")).textContent=oNode.getAttribute("etnm"); //회사명 추가 2006.12
                    }else{
					    oItem.appendChild(m_objGrpInfoXML.createElement("DN")).text=oNode.jd;
					    oItem.appendChild(m_objGrpInfoXML.createElement("EM")).text=oNode.em;
					    oItem.appendChild(m_objGrpInfoXML.createElement("JD")).text=oNode.jd;
					    oItem.appendChild(m_objGrpInfoXML.createElement("RN")).text=oNode.rn;
					    oItem.appendChild(m_objGrpInfoXML.createElement("PI")).text=oNode.pi;
					    oItem.appendChild(m_objGrpInfoXML.createElement("ETNM")).text=oNode.etnm; //회사명 추가 2006.12
                    }		
                    */
					oNode = oNode.parentNode;
                    if (oNode.className == "toc") {
                        if ("ActiveXObject" in window) {
                            oItem.appendChild(m_objGrpInfoXML.createElement("SGAN")).text="toc";
					        oItem.appendChild(m_objGrpInfoXML.createElement("SGDN")).text="toc";
                        } else {
                            oItem.appendChild(m_objGrpInfoXML.createElement("SGAN")).textContent="toc";
					        oItem.appendChild(m_objGrpInfoXML.createElement("SGDN")).textContent="toc";
                        }
				     //   if(window.addEventListener){
					    //    oItem.appendChild(m_objGrpInfoXML.createElement("SGAN")).textContent="toc";
					    //    oItem.appendChild(m_objGrpInfoXML.createElement("SGDN")).textContent="toc";
					    //}else{
					    //    oItem.appendChild(m_objGrpInfoXML.createElement("SGAN")).text="toc";
					    //    oItem.appendChild(m_objGrpInfoXML.createElement("SGDN")).text="toc";
					    //}
					}
					else{
                        oNode = oNode.parentNode;
                        if ("ActiveXObject" in window) {
                            oItem.appendChild(m_objGrpInfoXML.createElement("SGAN")).text=oNode.id;
						    if (oNode.previousSibling != null){
							    oItem.appendChild(m_objGrpInfoXML.createElement("SGDN")).text=oNode.previousSibling.innerText;
						    }else{
							    oItem.appendChild(m_objGrpInfoXML.createElement("SGDN")).text=oNode.previousSibling.innerText;
						    }
                        } else {
                            oItem.appendChild(m_objGrpInfoXML.createElement("SGAN")).textContent=oNode.getAttribute("id");
						    if (oNode.previousSibling != null){
							    oItem.appendChild(m_objGrpInfoXML.createElement("SGDN")).textContent=oNode.previousSibling.text;
						    }else{
							    oItem.appendChild(m_objGrpInfoXML.createElement("SGDN")).textContent=oNode.previousSibling.text;
						    }
                        }
				  //      if(window.addEventListener){
						//    oItem.appendChild(m_objGrpInfoXML.createElement("SGAN")).textContent=oNode.getAttribute("id");
						//    if (oNode.previousSibling != null){
						//	    oItem.appendChild(m_objGrpInfoXML.createElement("SGDN")).textContent=oNode.previousSibling.text;
						//    }else{
						//	    oItem.appendChild(m_objGrpInfoXML.createElement("SGDN")).textContent=oNode.previousSibling.text;
						//    }
						//}else{
						//    oItem.appendChild(m_objGrpInfoXML.createElement("SGAN")).text=oNode.id;
						//    if (oNode.previousSibling != null){
						//	    oItem.appendChild(m_objGrpInfoXML.createElement("SGDN")).text=oNode.previousSibling.innerText;
						//    }else{
						//	    oItem.appendChild(m_objGrpInfoXML.createElement("SGDN")).text=oNode.previousSibling.innerText;
						//    }
						//}
					}
				}
				if(rcv == "t")return oItem;
			}
			function getCurrentNode(){
			    
				//if((m_sSelGrpID != undefined) && (m_sSelGrpID!="") && (m_sSelGrpID!=TopGroupCN) && (document.all[m_sSelGrpID] != undefined)){
				if((m_sSelGrpID != undefined) && (m_sSelGrpID!="") && (m_sSelGrpID!=TopGroupCN) ){
					try{
					    return makeCurrentNode(m_sSelGrpID);
					}catch(e){}
				}
				else{
					return null;
				}
			}
			function progressBox(oIndicator,oHandler,szPostContent,szContent,szTitle){
				var rgParams = new Array();
				rgParams["indicator"] = oIndicator;
				rgParams["handler"] = oHandler;
				rgParams["postContent"] = szPostContent;
				rgParams["content"] = "<pre>\n\r</pre><center>" + szContent + "</center>";
				rgParams["title"] = szTitle;

				parent.parent.showModalDialog("../../common/script/progress.htm", rgParams, "dialogHeight:120px;dialogWidth:250px;status:no;resizable:no;help:no;");
			}
		</script>
</body>
</html>
