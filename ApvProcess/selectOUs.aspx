<%@ Page Language="C#" AutoEventWireup="true" CodeFile="selectOUs.aspx.cs" Inherits="ApvProcess_selectOUs" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>합의부서삭제처리</title>
	<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js" ></script>
	<script type="text/javascript" language="javascript">window.focus();</script>
</head>
<body>
<div class="popup_title">
  <div class="title_tl">
    <div class="title_tr">
      <div class="title_tc">
      <h2><span><%= Resources.Approval.lbl_delete_assistous_instruction%></span></h2></div>
    </div>
  </div>
</div>
<!-- 본문내용 시작 -->
<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">	
    <tr height="10%">
        <td colspan="2" valign="top" class="pop_bg" height="27">
            <br/>
                <table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
                   <thead>
                        <tr>
                            <td height="2" colspan="8" class="BTable_bg01"></td>
                        </tr>
                        <tr class="BTable_bg02" style="height:25px">
                            <td width="15%" valign="middle" align=center><INPUT Type="CheckBox" onClick="CheckedAll();" name='chkall'></td>
                             <td width="45%" valign="middle"><%= Resources.Approval.lbl_assist_ou%></td>
                             <td width="40%" valign="middle"><%= Resources.Approval.lbl_state %></td>
                        </tr>
                        <tr>
                            <td height="1" colspan="8" class="BTable_bg03"></td>
                        </tr>
                    </thead>
                </table>   

                <table  width="100%" border="0" cellpadding="1" cellspacing="1" id="tbAssist">
                  <tr style="height:1px;">
                    <td width="15%">
                    </td>
                    <td width="45%">
                    </td>
                    <td width="40%">
                    </td>
                  </tr>
                </table>
        </td>
    </tr>		    
</table>  
<!-- 본문내용 끝 -->                      
     
<!-- 버튼_시작-->
<div class="popup_Btn small AlignR">
    <a href="#" class="Btn04" id="btDelete" name="cbBTN" onclick="javascript:fn_approval();"><span><%= Resources.Approval.btn_dcooremove%></span></a>
    <a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="javascript:parent.window.close();"><span><%= Resources.Approval.btn_close %></span></a>
</div>	
<!-- 버튼_끝-->   
        <input type="hidden" id="chk" name="chk" />
                                      
    <script language="javascript" type="text/javascript">
        var m_objWinDlgArgs = window.dialogArguments;
        var g_objMessage;
        var m_oApvList;
        var gMessage265 = "<%= Resources.Approval.msg_265 %>";
        var gMessage266 = "<%= Resources.Approval.msg_266 %>";
        var gMessage267 = "<%= Resources.Approval.msg_267 %>";
        var glblgoProcess = "<%= Resources.Approval.lbl_goProcess %>";
        var glblcompleted = "<%= Resources.Approval.lbl_completed %>";
        var glblnoreceipt = "<%= Resources.Approval.lbl_noreceipt %>";
        var glblinactive = "<%= Resources.Approval.lbl_inactive %>";

		var gLngIdx = <%=strLangIndex %>;

        function getArg(sArgName,vDefault){
	        try{
		        var v = m_objWinDlgArgs[sArgName];
		        if(v==null)return vDefault;else return v;
	        }catch(e){
		        return vDefault;
	        }
        }
        function window.onload(){
        	g_objMessage = getArg("objMessage",null); 
        	m_oApvList = CreateXmlDocument();
        	if(!m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+getArg("APVLIST",null))){
                alert(gMessage265);
        	}else{
        	    var elmRoot = m_oApvList.documentElement;
                var elmAssist = elmRoot.selectNodes("division[taskinfo/@status='pending']/step[@routetype='assist' and @unittype='ou' and (taskinfo/@status='pending' or taskinfo/@status='inactive')]/ou[taskinfo/@status='pending' or taskinfo/@status='inactive' ]");
                for(var ia=0;ia<elmAssist.length  ; ia++){
                    var elmaOU = elmAssist.nextNode();
                    var elmaTaskInfo = elmaOU.selectSingleNode("taskinfo");

                    var eTR = tbAssist.insertRow(tbAssist.rows.length);
                    eTR.setAttribute("className","bg_white");
                    eTR.setAttribute("piid",elmaTaskInfo.getAttribute("piid"));
                    eTR.setAttribute("code",elmaOU.getAttribute("code"));
                    eTR.setAttribute("name",elmaOU.getAttribute("name"));

                    //checkbox
                    var eTD1 = eTR.insertCell(eTR.cells.length);
                    eTD1.valign = "middle";
                    eTD1.align = "center";
                    
                    var elmaPerson = elmaOU.selectNodes("person");
                    if(elmaPerson.length == 0 ){
                               eTD1.innerHTML = "<INPUT TYPE='CHECKBOX' id='chkRowSelect'  >";
                    }else{
                               eTD1.innerHTML = "<INPUT TYPE='CHECKBOX' id='chkRowSelect'  disabled >";
                    }
                    //부서명
                    var eTD2 = eTR.insertCell(eTR.cells.length);
                    eTD2.innerHTML = getLngLabel(elmaOU.getAttribute("name"),false);
                    //부서상태
                    var eTD3 = eTR.insertCell(eTR.cells.length);
                    switch (elmaTaskInfo.getAttribute("status")){
                        case "inactive":eTD3.innerHTML = glblinactive;break;
                        case "pending":
                            if(elmaPerson.length == 0 ){
                                eTD3.innerHTML = glblnoreceipt;
                            }else{
                                eTD3.innerHTML = glblgoProcess;
                            }
                            break;
                        case "completed":eTD3.innerHTML = glblcompleted;break;
                        //case "none":eTD3.innerHTML = "대상아님";break;
                    }
                }
            }
        }
        function CheckedAll(){
	        event_select();
	        if(typeof(document.all.chkRowSelect) == "undefined"){
		        chkall.checked = false;
		        return;
	        }
	        var chk_count = chkRowSelect.length;
	        if(event.srcElement.checked){
		        if(typeof(chk_count) == "undefined"){
			        if(!chkRowSelect.disabled) chkRowSelect.checked = true;
			        var eTR = chkRowSelect.parentElement;
			        while(eTR.tagName != "TR") {
				        eTR = eTR.parentElement;
			        }
			        //eTR.setAttribute("className","rowselected");
		        }else if(chk_count > 1){
			        for(y = 0 ; y < chk_count ; y ++){
				        if(!chkRowSelect[y].disabled)  chkRowSelect[y].checked = true;
				        var eTR = chkRowSelect[y].parentElement;
				        while(eTR.tagName != "TR") {
					        eTR = eTR.parentElement;
				        }
				        //eTR.setAttribute("className","rowselected");
			        }
		        }
	        }else{
		        if(typeof(chk_count) == "undefined"){
			        chkRowSelect.checked = false;
			        var eTR = chkRowSelect.parentElement;
			        while(eTR.tagName != "TR") {
				        eTR = eTR.parentElement;
			        }
			        //eTR.setAttribute("className","rowunselected");
		        }else if(chk_count > 1){
			        for(y = 0 ; y < chk_count ; y ++){
				        chkRowSelect[y].checked = false;
				        var eTR = chkRowSelect[y].parentElement;
				        while(eTR.tagName != "TR") {
					        eTR = eTR.parentElement;
				        }
				        //eTR.setAttribute("className","rowunselected");
			        }
		        }
	        }
        }
        function event_select()
        {
	        chk.value = "1";
        }
        function fn_approval(){
            var strflag = false;
	        var sItems="<items>";
	        var sUrl;
	        
            if (chkRowSelect.length == null){//한개
                if(chkRowSelect.checked){
                    var item = chkRowSelect.parentElement.parentElement;
			        sItems+="<item piid=\""+item.piid+"\" code=\"" +item.code +"\" />";
				    strflag = true;
                }
            }else{ //2개 이상
                for(var i=0 ; i < chkRowSelect.length; i++){
                    if(chkRowSelect[i].checked){
                        var item = chkRowSelect[i].parentElement.parentElement;
    			        sItems+="<item piid=\""+item.piid+"\" code=\"" +item.code +"\" />";
				        strflag = true;
                    }
                }
            }
    	    sItems+="</items>";            
    	    if(strflag){
    	        if(confirm(gMessage266)){
    	            g_objMessage.requestProcessDCooAbort(sItems);
     	            window.close();
    	        } 
    	    }else{
    	        alert(gMessage267);
    	    }
        }                
    </script>            
</body>
</html>
