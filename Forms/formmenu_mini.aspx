<%@ Page Language="C#" AutoEventWireup="true" CodeFile="formmenu_mini.aspx.cs" Inherits="Approval_Forms_formmenu_mini" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>form mini menu</title>
    <script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js" ></script>
    <script type="text/javascript" language="javascript" src="../../common/script/coviflownet/openwindow.js"></script>
</head>
<body >
<div id="divminemenu_Main" container='1' style='overflow: hidden; position: absolute; z-index: 12000;'>
	<div submenu='1' id='divminimenu_MainM' class="Ctx_Table1" style='position: relative;background-image: url(<%=Session["user_thema"] %>/Covi/Common/icon/cont_back.gif); background-repeat: repeat-y;' igLevel='0'>
		<div scrollDiv=1>
			<table border='0' cellpadding='2' cellspacing='0' class="Ctx_Table1" style='background-image:url(<%=Session["user_thema"] %>/Covi/Common/icon/cont_back.gif); background-repeat: repeat-y; border-width: 0;'>
				<tr onmouseover="this.style.fontSize='8pt';this.className='Ctx_MouseOver';" onmouseout="this.className='Ctx_Table2';">
					<td>
						<table width='100%' cellpadding='2' cellspacing='0'  class="Ctx_Table2" onclick="parent.parent.menu.doButtonAction(this);" id="btSave" name="cbBTN" style="display:none;">
							<tr>
								<td width='25px' >
									<img src='<%=Session["user_thema"] %>/Covi/Common/icon/icon_edit.gif'>
								</td>
								<td width='110px' align='left'>
									<nobr><%=Resources.Approval.btn_tempsave %></nobr>
								</td>
								<td width="15"></td>
							</tr>
						</table>
					</td>
				</tr>
				<!--<tr onmouseover="this.style.fontSize='8pt';this.className='Ctx_MouseOver';" onmouseout="this.className='Ctx_Table2';" onclick="copyDiff(530, 65, this);">
					<td>
						<table width='100%' cellpadding='2' cellspacing='0'  class="Ctx_Table2"  id="dCopy" style="display:none;">
							<tr>
								<td width='25px' >
									<img src='<%=Session["user_thema"] %>/Covi/Common/icon/icon_edit.gif'>
								</td>
								<td align='left'>
									<nobr><%= Resources.Approval.lbl_DiffForm_Copy %></nobr><%--타양식으로 내용복사 --%>
								</td>
								<td width="20"></td>
								<%--<td align="right">▶</td>--%>
							</tr>
						</table>
					</td>
				</tr>-->
				<tr onmouseover="this.style.fontSize='8pt';this.className='Ctx_MouseOver';" onmouseout="this.className='Ctx_Table2';">
					<td>
						<table width='100%' cellpadding='2' cellspacing='0' class="Ctx_Table2"  id='favorformadd' onclick="favorform('insert')" style="display:none;">
							<tr>
								<td width='25px'>
									<img src='<%=Session["user_thema"] %>/Covi/Common/icon/icon_pin.gif'>
								</td>
								<td width='110px' align='left'>
									<nobr><%=Resources.Approval.btn_favorform_add%></nobr>
								</td>
								<td width="15"></td>
							</tr>
						</table>
					</td>
				</tr>
                <tr onmouseover="this.style.fontSize='8pt';this.className='Ctx_MouseOver';" onmouseout="this.className='Ctx_Table2';">
					<td>
						<table width='100%' cellpadding='2' cellspacing='0' class="Ctx_Table2"  id='favorformdelete' onclick="favorform('delete')" style="display:none;">
							<tr>
								<td width='25px' >
									<img src='<%=Session["user_thema"] %>/Covi/Common/icon/icon_del.gif'>
								</td>
								<td width='110px' align='left'>
									<nobr><%=Resources.Approval.btn_favorform_delete %></nobr>
								</td>
								<td width="15"></td>
							</tr>
						</table>
					</td>
				</tr>
			</table>				
            <div id="divfavorformhr" style="display:none;">
            <hr />
			<table border='0' cellpadding='2' cellspacing='0' class="Ctx_Table1" style='background-image:url(<%=Session["user_thema"] %>/Covi/Common/icon/cont_back.gif); background-repeat: repeat-y; border-width: 0;'>
				<tr onmouseover="this.style.fontSize='8pt';" >
					<td>
						<table width='100%' cellpadding='2' cellspacing='0'  class="Ctx_Table2" id="Table1" >
							<tr>
								<td width='25px' >
									<img src='<%=Session["user_thema"] %>/Covi/Common/icon/icon_edit.gif'>
								</td>
								<td width='110px' align='left'>
									<nobr><%=Resources.Approval.lbl_favorform %></nobr>
								</td>
								<td width="15"></td>
							</tr>
						</table>
					</td>
				</tr>
			</table>            
            </div>
            <!--- list user's favoriate forms -->
            <%=strUserForm%>
        </div>
    </div>
</div>   
<script type="text/javascript" language="javascript" >
        var m_xmlHTTP = CreateXmlHttpRequest();
        var m_objXML = CreateXmlDocument();
        /* 웹표준화로 수정
        var m_xmlHTTP=new ActiveXObject("MSXML2.XMLHTTP");
        var m_objXML=new ActiveXObject("MSXML2.DOMDocument");*/
        //add user's favoriate form    
        //delete user's favoriate form
		var gz_h, gz_w;
        function favorform(szmode){
	        var sItems="<request>";
	        sItems+="<mode>"+szmode+"</mode>"; //worktiem 삭제 처리
			sItems+="<usid>"+parent.getInfo("usid")+"</usid>";
			sItems+="<fmid>"+parent.getInfo("fmid")+"</fmid>";
	        var sUrl = "favorform.aspx";
	        sItems+="</request>";
	        var oContextHTML = document.getElementById("divminemenu_Main");

	        if (oContextHTML != null) {
	        	var h = oContextHTML.offsetHeight;
	        	var w = oContextHTML.offsetWidth;
	        	h = (szmode == "delete") ? (h - 21) : (h + 21);
	        	w = (szmode == "delete") ? (w +3) : (w -3);
	        	//parent.document.getElementById("minifmmenu").style.width = w + "px";
                parent.document.getElementById("frmminimenu").style.height = h+"px";
                parent.document.getElementById("divminifmmenu").style.height = h+"px";
	        	parent.document.getElementById("minifmmenu").style.height = h + "px";
            	        	
	        } 				        

	        requestHTTP("POST",sUrl,true,"text/xml",receiveGeneralQuery,sItems);
        }
        function event_noop(){return(false);} 
        function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	        m_xmlHTTP.open(sMethod,sUrl,bAsync);
	        //m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
	        m_xmlHTTP.setRequestHeader("Content-type", sCType);
	        if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	        (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
        	
        }
        function receiveGeneralQuery()
        {
	        if(m_xmlHTTP.readyState==4)
	        {
		        m_xmlHTTP.onreadystatechange=event_noop;
		        if(m_xmlHTTP.responseXML.xml==""){
			        alert(m_xmlHTTP.responseText);
		        }else{
			        var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			        
			        if(errorNode!=null){
				        alert("Desc: " + errorNode.text);
			        }else{
						alert(m_xmlHTTP.responseXML.documentElement.text);
				        document.location.reload();
			        }
		        }
				try
				{//debugger;//이준희(2008-02-29): 즐겨 쓰는 양식의 추가/삭제 사항이 [결재문서작성] 우측의 점진 노출에 즉시 반영되도록 하기 위해 추가함.
					//top.opener.top.frames[1].frames[0].frmminimenu.location = top.opener.top.frames[1].frames[0].frmminimenu.location.href;
					parent.document.displayminimenu(parent.document.getElementById("btn_formhead"));
					parent.document.displayminimenu(parent.document.getElementById("btn_formhead"));
				}
				catch(e)
				{
				}
	        }
        } 
        var windowname="<%= Resources.Approval.lbl_write %>";
        function Open_Form(fmid, fmnm, fmpt, scid, fmrv, fmfn){
	        var strURL = "/CoviWeb/Approval/Forms/Form.aspx?fmid=" + fmid + "&fmnm=" + toUTF8(fmnm+" ["+windowname+"]") + "&fmpf="+fmpt+"&scid="+scid+"&mode=DRAFT&fmrv="+fmrv+"&fmfn="+fmfn;
					var cookiedata = document.cookie; 	
					if(cookiedata.indexOf("chkFormTabView=True") > -1 ){
							var oTopOpenWindow = null;
							if ( parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
								oTopOpenWindow = parent.oFRMWIN;
							}else if ( parent.parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
								oTopOpenWindow = parent.parent.oFRMWIN;
							}
							if(oTopOpenWindow == null){
										strURL = strURL.replace("Forms/Form.aspx?","Forms/FormTab.aspx?");
										openWindow(strURL,"FORMS",1024 ,720 ,'resize');
										if ( parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
											parent.oFRMWIN = win;
										}else if ( parent.parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
											parent.parent.oFRMWIN = win;
										}
							}else{
								try{
									if(oTopOpenWindow.name == "FORMS"){
										oTopOpenWindow.setformTab2(strURL,fmnm, fmid);//창이 떠 있는 경우 데이터 넘기기 처리
									}else{//신규 창 열기
										strURL = strURL.replace("Forms/Form.aspx?","Forms/FormTab.aspx?");
										openWindow(strURL,"FORMS",1024 ,720 ,'resize');
										if ( parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
											parent.oFRMWIN = win;
										}else{
											parent.parent.oFRMWIN = win;
										}
									}
								}catch(e){//신규 창 열기
										strURL = strURL.replace("Forms/Form.aspx?","Forms/FormTab.aspx?");
										openWindow(strURL,"FORMS",1024 ,720 ,'resize');
										if ( parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
											parent.oFRMWIN = win;
										}else{
											parent.parent.oFRMWIN = win;
										}
								}
							}							
					}else{
						openWindow(strURL,"Form",800,720,'resize'); 
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
       //타양식으로 내용복사 2008.05 강성채 
        function copyDiff(x, y, obj){//debugger;
            parent.copyDiff(x, y, obj);
        }
    </script>                  
<script type="text/javascript" language="javascript">
    try{
        var szfmid = null;
        if(window.ActiveXObject){
            szfmid = parent.getInfo("fmid");
        }else{
            if(parent.getInfo()){szfmid = parent.getInfo("fmid");}
        }
        var bExist = false;
        var sifmcnt = <%=intUserForm %>;
        if(sifmcnt == 0 ){
            
        }else{
            if(document.getElementsByName("fmid").length == null){
                if ( szfmid == document.getElementById("fmid").fmid ){
                    bExist = true;
                }else{
                    bExist = false;
                }
            }else{
                for(var i=0; i < document.getElementsByName("fmid").length ; i++){
                    if(document.getElementsByName("fmid")[i].fmid == szfmid) bExist = true;
                }
            }
        }
        if ( bExist ){
            document.getElementById("favorformadd").style.display = "none";
            document.getElementById("favorformdelete").style.display = "block";
        }else{
            document.getElementById("favorformadd").style.display = "block";
            document.getElementById("favorformdelete").style.display = "none";
        }
        document.getElementById("btSave").style.display="block";
        document.getElementById("divfavorformhr").style.display="block";
        //document.getElementById("dCopy").style.display="block";
       
    }catch(e){}
</script>
</body>
</html>
