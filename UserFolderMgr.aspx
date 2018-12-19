<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserFolderMgr.aspx.cs" Inherits="Approval_UserFolderMgr" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
</head>
<body>
<form id="form1" runat="server">
    <div class="popup_title">
      <div class="title_tl">
        <div class="title_tr">
          <div class="title_tc">
            <h2><%=Resources.Approval.lbl_userfolder %></h2>
          </div>
        </div>
      </div>
    </div>
    <div class="Box_cl">
        <div class="Box_cr">
            <div class="Box_cc">
                <div style="width:285px;height:215px;overflow:auto;">
                  <fieldset>
                     <%-- <ul >--%>
                      <asp:Repeater ID="Folder" runat="server" OnItemDataBound="Folder_ItemDataBound">
                          <ItemTemplate>
                            <%--<li >--%><asp:Label ID="foldername" runat="server"></asp:Label><%--</li>--%>
                          </ItemTemplate>
                      </asp:Repeater>
                     <%-- </ul>--%>
                      <div class="line"></div>
                  </fieldset>
                  <div id="divfoldername" name="divfoldername" style="display:none;">
			        <div class="AppPop" style="width:270px;height:40px;" >
				        <table border="0" cellpadding="0" cellspacing="0" style="width:100%;height:100%;" >
					        <tr>
						        <td><strong><%=Resources.Approval.lbl_Name %>:</strong>&nbsp;
						        <div style="display:none"><CoviWebControls:CoviDropDown runat="server" ID="classify"  /></div>
						        <input id="foldername" name="foldername" size="10" maxlength="30" type="text" class="type-text" style=" width: 148px; height:15px;" onKeyPress="if (event.keyCode==13) foldersave();" value="" />&nbsp;<a href="#" onclick="javascript:foldersave()" class="Btn02"><span><%=Resources.Approval.btn_save %></span></a></td>
						        <td style="padding-bottom:6px;"><img src="<%=Session["user_thema"] %>/Covi/Common/btn_type2/btn_x02.gif" alt="" onclick="javascript:document.getElementById('divfoldername').style.display='none';"></td>
					        </tr>
				        </table>
			        </div>                  
                  </div>
                </div>
            </div>
        </div>
    </div>
    <!--2011.03.21. 추가-->
    <br />
   <!-- 경로 테두리 테이블 시작 -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" >
      <tr>
        <td width="5"><img src="/GwImages/BLUE/Covi/Common/box/box04_top_left.gif" width="5" height="5" /></td>
        <td background="/GwImages/BLUE/Covi/Common/box/box04_top_bg.gif"></td>
        <td width="5"><img src="/GwImages/BLUE/Covi/Common/box/box04_top_right.gif" width="5" height="5" /></td>
      </tr>
      <tr>
        <td background="/GwImages/BLUE/Covi/Common/box/box04_left_bg.gif"></td>
        <td bgcolor="#f5f5f5" style=" padding-left: 10px;"><!-- 경로 테이블 시작 -->
            <table border="0" cellspacing="0" cellpadding="0" width="95%">
              <tr>
                <td style="height:30px; width:55px"><img src="/GwImages/BLUE/Covi/Common/icon/blt_03.gif" hspace="3" align="absmiddle" /><b>경로</b>&nbsp; &nbsp; </td>
                <td><input name="txtPath" type="text" readonly="readonly" id="txtPath" class="type-text" style="width:100%;" /></td>
              </tr>
            </table>
          <!-- 경로 테이블 끝 --></td>
        <td background="/GwImages/BLUE/Covi/Common/box/box04_right_bg.gif"></td>
      </tr>
     <tr>
        <td width="5"><img src="/GwImages/BLUE/Covi/Common/box/box04_bottom_left.gif" width="5" height="5" /></td>
        <td background="/GwImages/BLUE/Covi/Common/box/box04_bottom_bg.gif"></td>
        <td width="5"><img src="/GwImages/BLUE/Covi/Common/box/box04_bottom_right.gif" width="5" height="5" /></td>
      </tr>
    </table>
    <!-- 경로 테두리 테이블 끝 -->


    
    <div class="popup_Btn small" style="margin-top:30px;">
      <a class="Btn04" href="#" onclick="javascript:folderaddclick();"><span><%=Resources.Approval.btn_userfolderadd %></span></a>
      <a class="Btn04" href="#" onclick="javascript:foldermoveclick();"><span id="spanfoldermove"><%=Resources.Approval.btn_userfoldermove %></span></a>
      <a class="Btn04" href="#" onclick="javascript:folderRefreshClick();"><span><%=Resources.Approval.btn_close %></span></a>
    </div>
     <div id="divprogress" style="visibility:hidden;position:absolute; vertical-align:middle;">
     <input type="hidden" id="hidCount" value="0" />
     <img src="<%=Session["user_thema"] %>/Covi/Common/icon/loading.gif" alt="" />
     </div>
     </form>
    <script type="text/javascript" language="javascript">        
        var folderDelYN = "<%=strFolderDelYN %>";
        var	m_xmlHTTP = CreateXmlHttpRequest();
        var m_folderid = "";
        var m_mode = "";
        var oCount = <%=iCount%>; 
        var m_gubun = "<%=strGubun %>";
        var m_uid="<%=strUID %>";
        if(opener.gLocation != "UFOLDER"){ //다른 폴더로 이동
            document.getElementById("spanfoldermove").innerHTML = "<%=Resources.Approval.btn_userfoldercopy %>";
        }
        //추가 입력란 활성화
        function folderaddclick(){
            if(document.getElementById("divfoldername").style.display == "none"){
                document.getElementById("divfoldername").style.display = "inline";
                document.getElementById("foldername").focus();
            }else{
                document.getElementById("divfoldername").style.display = "none";
            }
        }
        //폴더이동 활성화
        function foldermoveclick(){
        //폴더 이동 성공 후에는 결재문서 삭제 module을 호출해야 함
            if(m_folderid == ""){
                alert("<%=Resources.Approval.msg_164 %>");
            }else{
                
                document.getElementById("divprogress").style.left = 30 ;
                document.getElementById("divprogress").style.top = 40;
                document.getElementById("divprogress").style.visibility = "visible";
                document.getElementById("divprogress").style.display = "";
                
                var oData = opener.foldermove_makeData(m_folderid);
                
                if( oData != ""){
                    m_mode = "foldermove";
                    var sXML = "<Items>";
                    sXML += "<folderid>"+m_folderid+"</folderid>";
                    if(opener.gLocation == "UFOLDER"){ //다른 폴더로 이동
                        sXML += "<mode>UPDATE</mode>";
                    }else{//결재함에서 폴더로 이동
                        sXML += "<mode>INSERT</mode>";
                    } 
                    sXML += oData;
                    sXML += "</Items>" ;
                    var szURL = "UserFolderList.aspx";
                    requestHTTP("POST",szURL,true,"text/xml",receiveHTTP, sXML);
                }
                else{
                
                     document.getElementById("divprogress").style.visibility="hidden";
                     document.getElementById("divprogress").style.display ="none";
                     
                     alert(opener.gMessage003);   
                                       
                     return false;
                }
            }
        }

        //2011.03.21 수정 
        //폴더id 셋팅 + 선택한 폴더 표시
        function setFolderID(szfolderid){
                      
            var strValue = szfolderid.split(':');
           
            m_folderid = strValue[0];
            document.getElementById("txtPath").value = strValue[1];
        }
        //신규 폴더 저장
        function foldersave(){
            m_mode = "foldersave";
            var m_parentid = document.getElementById("classify").value;
            var sXML = "<Items><mode>INSERT</mode><folderid></folderid><foldername><![CDATA[" + document.getElementById("foldername").value + "]]></foldername><foldermode>N</foldermode><uid>"+m_uid+"</uid><pid><![CDATA[" + m_parentid + "]]></pid></Items>" ;
            var szURL = "UserFolder.aspx";
            requestHTTP("POST",szURL,true,"text/xml",receiveHTTP, sXML);
        }
        function event_noop(){return;}
        function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
            m_xmlHTTP.open(sMethod,sUrl,bAsync);
            //m_xmlHTTP.setRequestHeader("Accept-Language","ko");
            m_xmlHTTP.setRequestHeader("Content-type", sCType);
            if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
            (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
        }
        //완료처리
        function receiveHTTP(){
            if(m_xmlHTTP.readyState==4){
                m_xmlHTTP.onreadystatechange=event_noop;
                var xmlReturn=m_xmlHTTP.responseXML;
                document.getElementById("divprogress").style.display = "none";
                if(xmlReturn.xml==""){
	                alert(m_xmlHTTP.responseText);
                }else{
	                var errorNode=xmlReturn.selectSingleNode("response/error");
	                if(errorNode!=null){
		                alert("Desc: " + errorNode.text);
	                }else{//debugger
	                    switch(m_mode){
	                        case "foldersave":
	                        
	                            var oHidCount = document.getElementById("hidCount");
	                            oHidCount.value = parseInt(oHidCount.value)+1 ;   //폴더가 만들어 졌는지 체크
	                            var hidValue = oHidCount.value;
	                            
	                            alert(xmlReturn.selectSingleNode("response").text);
	                            //window.location.reload();
	                            if(m_gubun=="unit"){
	                                window.location.href="UserFolderMgr.aspx?count="+hidValue+"&uid="+m_uid;
	                            }else{
	                                window.location.href="UserFolderMgr.aspx?count="+hidValue;
	                            }
	                            break;
	                        case "foldermove":
	                            alert(xmlReturn.selectSingleNode("response").text);
	                            if(opener.gLocation != "UFOLDER"){ //다른 폴더로 이동
	                                if(opener.gLocation != "DEPART" && folderDelYN.substring(0,1) == "0"){//폴더 이동시 개인함에서 삭제여부
	                                    opener.delete_onClick(true);
	                                }else if(opener.gLocation == "DEPART" && folderDelYN.substring(1,1) == "0"){//폴더 이동시 부서함에서 삭제여부
	                                    opener.delete_onClick(true);
	                                }
	                                try{opener.refresh();}catch(e){}
	                            }else{
	                                try{opener.parent.refresh();}catch(e){try{opener.parent.parent.refresh();}catch(e){}}
	                            }
	                            window.close();
	                            break;
	                    }
	                }
                }
            }
        }
        
        function folderRefreshClick(){
            
            var globalCount = parseInt(document.getElementById("hidCount").value);
            
            if(globalCount > 0){                
                
                opener.parent.parent.leftFrame.document.location.href= "Menu_Approval.aspx?refresh=target_6";
            }
            
            window.close();
        }
        
        window.onload= initOnload;
        function initOnload() {           
            var oHid = document.getElementById("hidCount");
        
            oHid.value = parseInt(oHid.value) + parseInt(oCount);
        }
        
        window.unload= Unload;
        function Unload(){        
             var globalCount = parseInt(document.getElementById("hidCount").value);
            
            if(globalCount > 0){                
                
                opener.parent.parent.leftFrame.document.location.href= "Menu_Approval.aspx?refresh=target_6";
            }
        }
        
    </script> 
</body>
</html>
