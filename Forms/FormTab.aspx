<%@ Page Language="C#" validateRequest="false" AutoEventWireup="true" CodeFile="FormTab.aspx.cs" Inherits="Approval_Forms_FormTab" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
    
</head>
<body class="bg_right">
	<!-- border div 시작-->
	<div id="App_list" style="width:100%;" >
	 <!-- 탭 div 시작 -->
    <div class="tab01 small" style="width:100%;">
      <ul>
        <li id="divform0" class="current" style="display:;"><a href="#" class="s1" onclick="javascript:changeForm(this,'spanform0');" clicktag="0"><span id="spfmnm" key="">#1양식</span></a></li>
        <li id="divform1" style="display:none;"><a href="#" class="s1" onclick="javascript:changeForm(this,'spanform1');" clicktag="0"><span id="spfmnm" key="">#2양식</span></a></li>
        <li id="divform2" style="display:none;"><a href="#" class="s1" onclick="javascript:changeForm(this,'spanform2');" clicktag="0"><span id="spfmnm" key="">#3양식</span></a></li>
        <li id="divform3" style="display:none;"><a href="#" class="s1" onclick="javascript:changeForm(this,'spanform3');" clicktag="0"><span id="spfmnm" key="">#4양식</span></a></li>
        <li id="divform4" style="display:none;"><a href="#" class="s1" onclick="javascript:changeForm(this,'spanform4');" clicktag="0"><span id="spfmnm" key="">#5양식</span></a></li>
        <li id="divform5" style="display:none;"><a href="#" class="s1" onclick="javascript:changeForm(this,'spanform5');" clicktag="0"><span id="spfmnm" key="">#6양식</span></a></li>
        <li id="divform6" style="display:none;"><a href="#" class="s1" onclick="javascript:changeForm(this,'spanform6');" clicktag="0"><span id="spfmnm" key="">#7양식</span></a></li>
        <li id="divform7" style="display:none;"><a href="#" class="s1" onclick="javascript:changeForm(this,'spanform7');" clicktag="0"><span id="spfmnm" key="">#8양식</span></a></li>
        <li id="divform8" style="display:none;"><a href="#" class="s1" onclick="javascript:changeForm(this,'spanform8');" clicktag="0"><span id="spfmnm" key="">#9양식</span></a></li>
        <li id="divform9" style="display:none;"><a href="#" class="s1" onclick="javascript:changeForm(this,'spanform9');" clicktag="0"><span id="spfmnm" key="">#10양식</span></a></li>
				<li><span class="list_right"><img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_x.gif" onclick="javascript:window.close()"></span></li>
      </ul>
    </div>
    <!-- 탭 div 끝 -->
		<div id="App_listIn"  style="width:100%;height:650px;">
			<span id="spanform0" name="spanform0" style="display:;">
				<iframe id="iform0" name="iform0" width="99%" height="650" frameborder="1" src="about:blank" style="margin:0; padding:0; scroll=auto;"></iframe>
			</span>
			<span id="spanform1" name="spanform1" style="display:none;">
				<iframe id="iform1" name="iform1" width="99%" height="650" frameborder="1" src="about:blank" style="margin:0; padding:0; scroll=auto;"></iframe>
			</span>
			<span id="spanform2" name="spanform2" style="display:none;">
				<iframe id="iform2" name="iform2" width="99%" height="650" frameborder="1" src="about:blank" style="margin:0; padding:0; scroll=auto;"></iframe>
			</span>
			<span id="spanform3" name="spanform3" style="display:none;">
				<iframe id="iform3" name="iform3" width="99%" height="650" frameborder="1" src="about:blank" style="margin:0; padding:0; scroll=auto;"></iframe>
			</span>
			<span id="spanform4" name="spanform4" style="display:none;">
				<iframe id="iform4" name="iform4" width="99%" height="650" frameborder="1" src="about:blank" style="margin:0; padding:0; scroll=auto;"></iframe>
			</span>
			<span id="spanform5" name="spanform5" style="display:none;">
				<iframe id="iform5" name="iform5" width="99%" height="650" frameborder="1" src="about:blank" style="margin:0; padding:0; scroll=auto;"></iframe>
			</span>
			<span id="spanform6" name="spanform6" style="display:none;">
				<iframe id="iform6" name="iform6" width="99%" height="650" frameborder="1" src="about:blank" style="margin:0; padding:0; scroll=auto;"></iframe>
			</span>
			<span id="spanform7" name="spanform7" style="display:none;">
				<iframe id="iform7" name="iform7" width="99%" height="650" frameborder="1" src="about:blank" style="margin:0; padding:0; scroll=auto;"></iframe>
			</span>
			<span id="spanform8" name="spanform8" style="display:none;">
				<iframe id="iform8" name="iform8" width="99%" height="650" frameborder="1" src="about:blank" style="margin:0; padding:0; scroll=auto;"></iframe>
			</span>
			<span id="spanform9" name="spanform9" style="display:none;">
				<iframe id="iform9" name="iform9" width="99%" height="650" frameborder="1" src="about:blank" style="margin:0; padding:0; scroll=auto;"></iframe>
			</span>
		
		<!-- 결재 리스트 끝-->
		
		</div>
	</div>
	<!-- border div 끝-->
<script language="javascript"	 type="text/javascript">
      var icnttab = 0;
      var icurrentiform ;
      var icurrentspan;
			function window.onload(){
				setformTab1();
			}
			//tab에 양식 열기 - 최초열기
			function setformTab1(){
	      var today = new Date();
				var szURL = window.location.href;
				var fmnm = "<%=Request.QueryString["fmnm"] %>";
				spfmnm[0].innerHTML = fmnm +'&nbsp;<img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_x.gif" onclick="javascript:closeForm(this,\'spanform0\');" clicktag="1" >';
				var wiid = "<%=Request.QueryString["wiid"] %>";
				var fmid = "<%=Request.QueryString["fmid"] %>";
				if(wiid != ""){
				 	spfmnm[0].key = wiid ;
				}else if(fmid != "") {
					spfmnm[0].key = fmid+today.getTime() ;
				}
				iform0.location= szURL.replace("FormTab","Form");
				icnttab++;
				icurrentspan = spfmnm[0];
				icurrentiform = iform0;
				window.focus();
			}
			//신규 양식 띄우기
			function setformTab2(szURL, fmnm, key){
				if (getActualFormCNT() > 9){
						alert("<%=Resources.Approval.msg_194 %>");
				}else{
					//중복 문서 확인
					var icnttabexsit = -1;
					for(var i=0; i < 10; i++){
						if (spfmnm[i].key == key){icnttabexsit = i;break;}
					}
					
					if ( icnttabexsit > -1 ){
						changeForm(null, "spanform"+ icnttabexsit);
					}else{
						for(var i=0; i < 10; i++){
							if ( eval("divform"+i).style.display == "none"){ icnttab = i;break;}
						}
						spfmnm[icnttab].innerHTML = fmnm +'&nbsp;<img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_x.gif" onclick="javascript:closeForm(this,\'spanform'+icnttab+'\');" clicktag="1" >';
						spfmnm[icnttab].key = key;
						eval("iform"+icnttab).location = szURL;
						eval("divform"+icnttab).style.display = "";
						changeForm(null, "spanform"+ icnttab);
					}
				}
				window.focus();
			}
			//타양식 복사
			function setformTab3(szURL, fmnm, fmid){
				//현재 활성화 된 부분에 정보 변경
				var iscurrentspan = getActualFormIndex();
				spfmnm[iscurrentspan].innerHTML = fmnm +'&nbsp;<img src="<%=Session["user_thema"] %>/Covi/Common/btn/btn_x.gif" onclick="javascript:closeForm(this,\'spanform'+icnttab+'\');" clicktag="1" >';
				eval("iform"+iscurrentspan).location = szURL;
				eval("divform"+iscurrentspan).style.display = "";
				changeForm(null, "spanform"+ iscurrentspan);
				window.focus();
			}
			var selApv = "spanform0" ;
			function changeForm(obj, oFormIndex) {
				try{
					if(obj == null || (obj != null && obj.clicktag == "0")){
						if (oFormIndex != selApv) {
								var selSpan = oFormIndex.replace("span","div");
								eval(selApv.replace("span","div")).className = "" ;
								eval(selSpan).className = "current" ;

								eval(selApv).style.display = "none";
								selApv = oFormIndex ;
								eval(selApv).style.display = "";
						}
					}
				}catch(e){alert(e.message);}
			}
			//전체 open 된 양식 개수
			function getActualFormCNT(){
				var maxcnt = 10;
				var actioncnt = 0;
				for(var i=0 ; i < maxcnt; i++){
					if (eval("divform"+i).style.display == "")  actioncnt++;
				}
				return actioncnt;
			}
			//현재 활성화 된 division index 값 빼내기
			function getActualFormIndex(){
				var maxcnt = 10;
				var actioncnt = 0;
				for(var i=0 ; i < maxcnt; i++){
					if (eval("divform"+i).className == "current"){
					  actioncnt = i;
					  break;
					}
				}
				return actioncnt;
			}
			function closeForm(obj, oFormIndex) {
				if ( obj.clicktag == "1"){
					var selSpan = oFormIndex.replace("span","div");
					eval(selSpan).className = "" ;
					eval(oFormIndex.replace("spanform","iform")).location = "about:blank";
					eval(selSpan).style.display = "none";
					eval(oFormIndex).style.display = "none";
					
					//인접 tab 활성화
					var closetabindex = parseInt(oFormIndex.replace("spanform",""));
					var bdisplay = false;
					for(var i=(closetabindex-1) ; i >=0; i--){
						if(eval("divform"+i).style.display == ""){
							eval("divform"+i).className = "current" ;
							eval("spanform"+i).style.display = "";
							bdisplay = true;
							break;
						}
					}
					eval(oFormIndex).style.display = "none";
					if(!bdisplay){
						for(var j=(closetabindex+1) ; j <10; j++){
							if(eval("divform"+j).style.display == ""){
								eval("divform"+j).className = "current" ;
								eval("spanform"+j).style.display = "";
								//eval("spanform"+(i-1)).style.display = "none";
								bdisplay = true;
								break;
							}
						}
					}
				}
				for(var k=0; k < 10; k++){
					if(	eval("divform"+k).className != "current") eval("spanform"+k).style.display="none" ;
				}
			}	
			function closeFormbyForm(){
				//현재 활성화 된 부분에 정보 변경
				var iscurrentspan = getActualFormIndex();
				eval("spanform"+iscurrentspan).className = "" ;
				eval("iform"+iscurrentspan).location = "about:blank";
				eval("spanform"+iscurrentspan).style.display = "none";
				eval("divform"+iscurrentspan).style.display = "none";
					
			}	
    </script>
</body>
</html>
