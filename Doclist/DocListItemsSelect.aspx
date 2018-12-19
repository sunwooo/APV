<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DocListItemsSelect.aspx.cs" Inherits="COVIFlowNet_Doclist_DocListItemsSelect" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
	<head runat="server">
		<title></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Cache-Control" content="no-cache" />
		<meta http-equiv="Pragma" content="no-cache" />
		<script language="javascript" type="text/javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
		<script language="javascript" type="text/javascript" src="listitemsSelect.js"></script>
		<script language="javascript" type="text/javascript" src="../../common/script/COVIFlowNet/openWindow.js"></script>
	<script type="text/javascript" language="javascript" src="../../common/script/NameControl.js"></script>
		
	</head>
	<body onselectstart="return false;">
		<XML id="g_oSSXML" src="sortdoclist.xsl"></XML>
		<div   class="BTable">
			<div id='divGalTable'></div>
		</div>					
		<div id='divErrorMessage' class='errormessage'></div>
		<span id="tooltip" class="tooltip"></span>
<script language="javascript" type="text/javascript">
			var suid = "<%=uid%>";
			var page = "<%=strpage%>";
			var sDept = "<%= Session["user_dept_code"].ToString()%>";
			var sDocListType ="<%=strDocListType%>";
			var sMonth ="<%=strMonth%>";
			var sSort ="<%=strSort%>";
			var sEntCode = "";
    		var gSearch = "";
			
			function chkAll(e){
			    var bSelect =false;
				//bSelect = document.getElementById("chkAll").checked; 
				
                var evt=(window.event)?window.event: e;
                el = (evt.srcElement)?evt.srcElement:evt.target;	
                bSelect = el.checked; 
                var sel_row = (window.addEventListener)? document.getElementsByName('chkID'):document.all.chkID;
                var chk_count = sel_row.length;
                if (chk_count > 0) {
                    for (var i = (chk_count - 1); i >= 0; i--) {
                        sel_row[i].checked = bSelect;
                        var eTR = sel_row[i].parentNode;
                        while (eTR.tagName != "TR") { eTR = eTR.parentNode; }
                    }
                }else{
                    docuemnt.getElementById("chkID").checked = bSelect;
	                return;
                }
   
				
//				if (window.document.all['chkID'] != undefined){ //김근하 추가 20050702 chkid 
//					if (window.document.all['chkID'].length != null){
//						for(var i=0;i<window.document.all['chkID'].length; i++ ){
//							chkID[i].checked = bSelect;
//						}
//					}else{
//						window.document.all['chkID'].checked = bSelect;
//					}
//				}
				return bSelect;
			}
			function getSelected(){
				var szSelect = "";
				if(document.getElementById("chkID") != undefined){ //김근하 추가 20050702
				    
                    var sel_row = document.getElementsByName("chkID");//20110503
                    var chk_count = sel_row.length;
                    if (chk_count > 0) {
						for(var i=0;i<chk_count; i++ ){
							if ( sel_row[i].checked){
								if ( szSelect != ""){
									szSelect += "^"+sel_row[i].value; 
								}else{
									szSelect = sel_row[i].value;
								}
							}
						}
                    }else{
                    }
				    
					szSelect = szSelect.replace(/&quot;/gi,'"');
                    szSelect = szSelect.replace(/&amp;/gi,'&');
                    szSelect = szSelect.replace(/&lt;/gi,'<');
                    szSelect = szSelect.replace(/&gt;/gi,'>');

					return szSelect;
				}
				//return szSelect;
			}
		</script>
    <script type="text/javascript" language="javascript">
		var gMessage001 = "<%= Resources.Approval.msg_001 %>";
		var gMessage002 = "<%= Resources.Approval.msg_002 %>";
		var gMessage003 = "<%= Resources.Approval.msg_003 %>";
		var gMessage093 = "<%= Resources.Approval.msg_093 %>";
	    var gMessage077 = "<%= Resources.Approval.msg_077 %>";
	    var gMessage153 = "<%= Resources.Approval.msg_153 %>";
	    var language = "<%=languagecode %>"; //20161021 추가
    </script>					
	</body>
</html>
