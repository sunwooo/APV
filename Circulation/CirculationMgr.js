var backurl = "../Circulation/";

//발신자측 data field
 var send_id=null;
 var Form_inst_id=opener.getInfo("fiid");
 var Process_id=opener.getInfo("piid");
 var Sender_id=opener.getInfo("usid");
 var Sender_name=opener.getInfo("usdn");
 var Sender_ou_id=opener.getInfo("dpid");
 var Sender_ou_name=opener.getInfo("dpdn");
 var Send_date=opener.getInfo("formatDate");
 var Form_name=opener.getInfo("fmnm");
 var Subject=opener.getInfo("SUBJECT");
 var Link_URL = opener.getPIDC();
 var Comment="";
 var Send_date="";

 var	Receipt_id = new Array();
 var	Receipt_name = new Array();
 var	Receipt_ou_id = new Array();
 var	Receipt_ou_name = new Array();
 var	Receipt_state = new Array();
 var	Receipt_date = new Array();
 var	Receipt_sender_name = new Array();
 var	Receipt_sender_id = new Array();
 var	Receipt_gp_name = new Array();
 var	Receipt_kind = new Array(); //수신 0/참조 1/회람 2 구분 - 명칭
 var	Receipt_kind_code = new Array(); //수신 0/참조 1/회람 2 구분 - code
 
 var	User_chk = new Array();	

var Receipt_id;var Receipt_name;var Receipt_ou_id;var Receipt_ou_name;var Receipt_state;var User_chk;var Receipt_sender_name; var Receipt_sender_id; var Receipt_date; var Receipt_gp_name; var Receipt_kind; var Receipt_kind_code;

var m_cvtXML = CreateXmlDocument().createTextNode("");
var sdivision= "";

var m_xmlHTTP=CreateXmlHttpRequest();

window.onload= initOnload;
function initOnload()
{
    GetEnt();

    circulationinfo_ccrec = document.getElementById("circulationinfotxt_ccrec").value;
    circulationinfo_ref = document.getElementById("circulationinfotxt_ref").value;
    sdivision = "1";
    //수신/참조
    //getListInit(circulationinfo_ccrec, tblccrecinfo);
    //회람
    getListInit(circulationinfo_ref, document.getElementById("tblrefinfo"));
    
    //수신,참조,회람 중복 체크
	try{
	    var xmldom = CreateXmlDocument();;
	    xmldom.async = false;
	    xmldom.loadXML("<?xml version='1.0' encoding='utf-8'?>"+document.getElementById("circulationinfoExttxt").value);
	    var col = xmldom.selectNodes("/NewDataSet/CirculationData");
	    var ii=0;
	    for (var i=0;i<col.length ;i++)
	    {
		    User_chk[ii] = col.nextNode().selectSingleNode("RECEIPT_ID").text;   //수신자 사번
		    ii++;
	    }
	    //결재자 삽입
        var m_oApvList = CreateXmlDocument();
	    m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + opener.field["APVLIST"].value);	
	    elmRoot = m_oApvList.documentElement;
	    if ( elmRoot != null){
		    elmList = elmRoot.selectNodes("division/step/ou/person");
		    for (var k=0; k<elmList.length;k++) {
			    var elm = elmList.nextNode();
			    User_chk[ii] = elm.getAttribute("code");
			    ii++;
		    }
        }
        //부품개발 요청서 다른 단계 수신자 넣기
	    if(opener.getInfo("fmpf") == "WF_CUCKOO_DEVELOP"){//부품개발요청서의 경우 처리
	        xmldom.loadXML("<?xml version='1.0' encoding='utf-8'?>"+document.getElementById("circulationinfotxt").value);
	        var col = xmldom.selectNodes("/NewDataSet/CirculationData");
	        var ii=0;
	        for (var i=0;i<col.length ;i++)
	        {
				var elm = col.nextNode();
	            if ( elm.selectSingleNode("DIVISION").text != sdivision) {
		            User_chk[ii] = elm.selectSingleNode("RECEIPT_ID").text;   //수신자 사번
		            ii++;
		        }
	        }
	    }
        
        document.getElementById("tblCirculationLine").style.display="none";
        
    }catch(e){
    }	
    //수신,참조,회람 중복 체크
    
    //버튼 활성화 - 수신/참조/회람을 사용할 수 있는 상태에서만 창이 활성화 된다(formmenu.js 에서 제어)
    // 조건에 따른 버튼 활성화 만 필요하다.
    //완료이면서 결재선상에 존재하는 결재자의 경우 회람 가능-합의제외
    if ((opener.getInfo("loct") == "COMPLETE") && (opener.getInfo("ptid") == opener.getInfo("usid")) && (opener.getInfo("pfsk") != "T009")) {
        document.getElementById("tblCirculation").style.display="";
        //document.getElementById("tblCirculationDept").style.display="";  //HIW
        document.getElementById("btDeleteref").style.display="";
    }
    
    //기안/임시저장/결재중
	if(opener.getInfo("scCKCC") == "1"){
	    document.getElementById("tblReference").style.display="";
	}
	if(opener.getInfo("scCKRec") == "1"){
	    document.getElementById("tblReceive").style.display="";
	}
	if((opener.getInfo("scCKCC") == "1") || (opener.getInfo("scCKRec") == "1" )){
	    document.getElementById("btDeleteccrec").style.display="";
	    document.getElementById("divrecccinfomain").style.display="";
	}else{
	    document.getElementById("divccinfomain").style.height=408+"px";

	}
}

////수신,참조의 경우 양식 본문에 다시 그리기 by sunny
//window.onunload = initonunload;
//function initonunload(){
//    //if (g_openType == "0" || g_openType=="1"){ 
//        try{opener.getRecCCList4CK()}catch(e){}
//   // }
//}
////////////////////////////////////////////////////////////////////////

function resetGird(oTable)
{   //기본데이터 입력 해줄것 꼭
	for (var i = oTable.rows.length-1; i >= 0; i--){
		 oTable.deleteRow(i);
	}
}

function gridBind(name,etname,ouname,id, chk,kind, sender_id, oTable, OpenType,sendname,senddate,callType)
{
	var tr = oTable.insertRow(oTable.rows.length);
	tr.style.height = "25px";
	if ( ( oTable.rows.length % 2 ) == 0 ) tr.className = "BTable_bg04";
	var td0 = tr.insertCell(tr.cells.length);var td1 = tr.insertCell(tr.cells.length);var td2 = tr.insertCell(tr.cells.length);var td3 = tr.insertCell(tr.cells.length);var td4 = tr.insertCell(tr.cells.length);
	td0.width="8%";td1.width="23%";td2.width="23%";td3.width="23%";td4.width="23%";
    td0.style.paddingLeft = "10px";
    if (OpenType == "2"){
	    if (callType=="new"){
	        td0.innerHTML = "<input type='checkbox' name='chkDelref' value='"+id+"'>"; 
	    }else{
	        td0.innerHTML = "<input type='checkbox' name='chkDelref' value='"+id+"' disabled >"; 
	    }
        td1.innerHTML = getLngLabel(ouname,false);
        td2.innerHTML = getLngLabel(name,false);
        td3.innerHTML = getLngLabel(sendname,false);
        td4.innerHTML = senddate;//sender;
	}else{
	    td0.innerHTML = "<input type='checkbox' name='chkDel' value='"+id+"'>"; 
	    
        td1.innerHTML = getLngLabel(ouname,false);
        td2.innerHTML = getLngLabel(name,false);
        td3.innerHTML = getLngLabel(sendname,false);
        td4.innerHTML = senddate;//sender;
	}
}

function dataBind (mode,xmldom, oTable, OpenType)
{
    var bFirst=true;
	switch (mode)
	{
		case "delete":
		 	resetGird(oTable);
			for (var i=0;i<Receipt_name.length ;i++){
				gridBind(Receipt_name[i],Receipt_gp_name[i],Receipt_ou_name[i],Receipt_id[i]+"@"+Receipt_ou_id[i],"",Receipt_sender_id[i],oTable,OpenType);
			}//Receipt_date[i].substring(0,10)
			break;
		case "new":
			var col = xmldom.selectNodes("//item");
			var place="";var name="";var date;var chk; var kind_data;
			var j= Receipt_id.length;
		    if(col.length > 0 && oTable.rows.length > 0 && oTable.rows[0].innerText == msg_112 ){//
		        resetGird(oTable);
		    }else if(col.length == 0 ){
                alert(msg_162);//"하나 이상의 대상자를 선택하세요."	
		    }
			
			for (var i=0;i<col.length ;i++)
			{
				var elm = col.nextNode();
			    if (elm.parentNode.nodeName=="group") bDept=true;
			    else bDept=false;
			    
				if(( bDept && chkDuplicate(Receipt_ou_id, elm.selectSingleNode("AN").text) == false) || (bDept==false && chkDuplicate(Receipt_id, elm.selectSingleNode("AN").text) == false)){
				    if (bDept){
					    Receipt_id[j] = "";   //수신자 사번
					    Receipt_name[j] = ""; //수신자명
					    Receipt_ou_name[j] = elm.selectSingleNode("DN").text; //수신자부서명
					    Receipt_ou_id[j] = elm.selectSingleNode("AN").text;     //부서코드
					    Receipt_gp_name[j] = elm.selectSingleNode("ETNM").text;  // 해당회사
                        
				    }else{
					    Receipt_id[j] = elm.selectSingleNode("AN").text;   //수신자 사번
					    Receipt_name[j] = elm.selectSingleNode("DN").text; //수신자명
					    Receipt_ou_name[j] = elm.selectSingleNode("DP").text; //수신자부서명
					    Receipt_ou_id[j] = elm.selectSingleNode("JD").text;     //부서코드
    				    Receipt_gp_name[j] = elm.selectSingleNode("ETNM").text; //해당회사:는 ETNM을 가져다 보여줌(변경) 
				    }
					Receipt_state[j] = "N";					
					Receipt_date[j] = "RECEIPT_DATE";//Receipt_ou_name[j]
					Receipt_sender_name[j] = "";
					Receipt_sender_id[j] = "";
					
					var tmkind;
					switch (OpenType){
					    case "0":tmkind="수신";  break;
					    case "1":tmkind="참조";  break;
					    case "2":tmkind=lbl_Circulate;  break;
					}
					Receipt_kind_code[j]=OpenType;
					Receipt_kind[j]=tmkind;
				
			        gridBind(Receipt_name[j],Receipt_gp_name[j],Receipt_ou_name[j],Receipt_id[j]+"@"+Receipt_ou_id[j],"",tmkind,Receipt_sender_id[j],oTable, OpenType,username,getToday,mode);
					j = Receipt_id.length;
				}else
				{
				    if(bFirst)
				    {
				        alert(msg_171);//"이미 배포수신자 이거나 결재선에 지정된 사람 입니다.\r\n배포 그룹에 추가 할 수 없습니다.");	
				        bFirst=false;
				    }
				}
			}
			break;
	}	
}
function chkDuplicate(aRec, szid){
	var bDuplicate = false;
	for(var i=0; i < aRec.length ; i++){
		if( aRec[i] == szid && Receipt_state[i]!="D"){
			bDuplicate = true;
			break;
		} 
	}
	//수신,참조,회람, 결재선 중복 체크
	if (!bDuplicate){
	    for(var i=0; i < User_chk.length ; i++){
		    if( User_chk[i] == szid ){
			    bDuplicate = true;
			    break;
		    } 
	    }
	}
	//수신,참조,회람, 결재선 중복 체크
	return bDuplicate;
}

//배포목록
function distributionShow()
{
	url = "mini_mainDistribution.aspx";
	iWidth = "450";iHeight="450";sSize="fix";
	openWindow(url,"DISTRIBUTION",iWidth,iHeight,sSize);
}
/*//////////////////////////////*/


/*//////////////////////////////*/
function doButtonAction(obj)
{	//debugger
	var sUrl;
	var iWidth=640;
	var iHeight=480;
	var sSize="fix";
	switch (obj.id)
	{
		case "btReceive" ://수신 
		    g_openType = "0";   insertToList(switchParentNode(3)); break;
		case "btReference" ://참조
		    g_openType = "1";		insertToList(switchParentNode(3));break;
		case "btCirculation" ://회람자
		    g_openType = "2";    insertToList(switchParentNode(3));  break;
		case "btCirculationDept" ://회람부서
		    g_openType = "2"; bDept = true;	insertToList(switchParentNode(4));   break;
		case "btClose" :
		    window.close(); break;
		case "btSend":  //삭제처리,추가처리  
		    if (document.getElementById("ideas").value == ""){alert(msg_161); return;}    
		    SaveDB();	break;
		case "btDeleteccrec":
			delItem(document.getElementById("tblccrecinfo"), "chkDel","chkAllccrec");break;
		case "btDeleteref":
			delItem(document.getElementById("tblrefinfo"),"chkDelref","chkAllref");break;
		case "chkAllccrec"://수신참조전체선택chkAllref회람 chkAllccrec/chkDel수신/참조
			chkHandle(tblccrecinfo, "chkDel","chkAllccrec"); break;
		case "chkAllref"://회람전체선택
			chkHandle(tblrefinfo,"chkDelref","chkAllref");break;
		//reset 버튼 기능 구현 필요
		case "btCirculationLine"://배포그룹 선택

			var rtnLine = CirculationLine(); 
			   
		    if(rtnLine == undefined)
			{
				alert(msg_172);		//"배포그룹을 선택하세요."
				break;			
			}else{
				insertToList2(CirculationLine());   
				break;
			}			
		//reset 버튼 기능 구현 필요
		default :
			break;
	}
}

function delItem(oTable, szchkDel, szchkAll)
{   //array의 state 상태를 D로 변경
    //chkbox value 구성 person_code@unit_code - 부서회람일 경우 person_code가 없다
    var ochkDel = document.getElementsByName(szchkDel);
    var chk_count = ochkDel.length;
    if (chk_count > 0) {
        for (var i = (chk_count - 1); i >= 0; i--) {
            if (ochkDel[i].checked) {
                deleteRecArray(ochkDel[i].value.split("@")[0],ochkDel[i].value.split("@")[1]);
                oTable.deleteRow(i);
            }
        }
    }      

}
//06/08/23김인호 수정
function runDel(deleteinfo) {
	var xmlhttp = CreateXmlHttpRequest();
	xmlhttp.open("post",backurl + "DelMail.aspx",false);
	xmlhttp.setRequestHeader("Accept-Language","ko");
	xmlhttp.setRequestHeader("Content-type", "text/xml");
	
	xmlhttp.send(deleteinfo);

	if (xmlhttp.responseXML.selectSingleNode("//response").text=="OK") {
		document.location.reload();
	}else{
		alert(msg_005 + "\r\n" +xmlhttp.responseXML.selectSingleNode("//response/error").text );//"일시적인 문제로 인해 삭제가 취소되었습니다.");
	}
}
//2006.12 UI 변경 추가 state D로 변경
//state가 N인 경우 바로 삭제
function deleteRecArray(szid,szouid){
	var j;
	var i=0;
    for(i=0; i <Receipt_id.length ; i++){
	    if((szid!="" && Receipt_id[i] == szid) || (szid=="" && Receipt_ou_id[i] == szouid)){
	        if(Receipt_state[i] == "N"){
			    j=i;
			    break;
	        }else{
	            Receipt_state[i] = "D";
	        }
	    } 
    }
    if(Receipt_state[i] == "N"){
	    for(var k=j;k<Receipt_id.length-1;k++){
		    Receipt_id[k] = Receipt_id[k+1];
		    Receipt_name[k] = Receipt_name[k+1];
		    Receipt_ou_name[k] =Receipt_ou_name[k+1] ;
		    Receipt_ou_id[k] =Receipt_ou_id[k+1] ;
		    Receipt_state[k] = Receipt_state[k+1];
            Receipt_date[i] = Receipt_date[k+1];
            Receipt_gp_name[k] = Receipt_gp_name[k+1]
		    Receipt_sender_name[k] = Receipt_sender_name[k+1];
		    Receipt_sender_id[k] = Receipt_sender_id[k+1];
	        Receipt_kind_code[i]=Receipt_kind_code[k+1];
            Receipt_kind[i]=Receipt_kind[k+1];
        }    
	    Receipt_id.length = Receipt_id.length-1;
	    Receipt_name.length = Receipt_name.length-1;
	    Receipt_ou_name.length =Receipt_ou_name.length-1;
	    Receipt_ou_id.length =Receipt_ou_id.length-1;
	    Receipt_state.length = Receipt_state.length-1;
        Receipt_date.length = Receipt_date.length-1;
        Receipt_gp_name.length = Receipt_gp_name.length-1;
	    Receipt_sender_name.length = Receipt_sender_name.length-1;
	    Receipt_sender_id.length = Receipt_sender_id.length-1;
        Receipt_kind_code.length=Receipt_kind_code.length-1;
        Receipt_kind.length=Receipt_kind.length-1;
    }
}

function chkHandle(oTable,szchkDel, szchkAll)
{   //chkAllref회람 chkAllccrec/chkDel수신/참조
    try{
        var ochkDel = eval(szchkDel);
        if ( ochkDel != null){
            var ochkAll = eval(szchkAll);
            if(ochkDel.length == null){
                ochkDel.checked=(ochkAll.checked == true)?true:false;
            }else{
                for(var i=0;i<ochkDel.length;i++){ochkDel[i].checked=(ochkAll.checked == true)?true:false;}
            }
        }
    }catch(e){}
}

//xml 유효성 검사
function evalXML(sXML){
		var xml = CreateXmlDocument();
		if(!xml.loadXML(sXML)){
			var err = xml.parseError;
			throw new Error(err.errorCode,"desc:"+err.reason+"\nsrctxt:"+err.srcText+"\nline:"+err.line+"\tcolumn:"+err.linepos);
			//throw new Error("xml file 형식 오류 입니다.");
		}
		else
			return xml;
}

function getHeader()
{
    
	var strHeader="<head>";
	strHeader+=makeNode("send_id","");	
	strHeader+=makeNode("Form_inst_id",Form_inst_id);
	strHeader+=makeNode("Process_id",Process_id);
	strHeader+=makeNode("Sender_id",Sender_id);
	strHeader+=makeNode("Sender_name",Sender_name,null,true);
	strHeader+=makeNode("Sender_ou_id",Sender_ou_id);
	strHeader+=makeNode("Sender_ou_name",Sender_ou_name,null,true);
	strHeader+=makeNode("Form_name",Form_name,null,true);
	strHeader+=makeNode("Subject",Subject,null,true);
	strHeader+=makeNode("Link_URL",Link_URL,null,true);
	//hjy strHeader+=makeNode("Comment","");
	strHeader+=makeNode("Comment",document.getElementById("ideas").value,null,true);   //hjy_add
//	strHeader+=makeNode("Send_date",Send_date);	
	strHeader+="</head>";
		
	return strHeader;
}	

function getBody()
{
	var strBody = "";
	for (var i=0;i<Receipt_id.length;i++ )
	{
		if (Receipt_state[i] == "N") {
			strBody+="<detail>";
			strBody+="<Receipt_id>"+Receipt_id[i]+"</Receipt_id>";
			strBody+="<Receipt_name><![CDATA["+Receipt_name[i]+"]]></Receipt_name>";
			strBody+="<Receipt_ou_id>"+Receipt_ou_id[i]+"</Receipt_ou_id>";
			strBody+="<Receipt_ou_name><![CDATA["+Receipt_ou_name[i]+"]]></Receipt_ou_name>";
			strBody+="<Receipt_gp_name><![CDATA["+Receipt_gp_name[i]+"]]></Receipt_gp_name>";
			strBody+="<Receipt_state>"+Receipt_state[i]+"</Receipt_state>";
			strBody+="<Receipt_date>"+Receipt_date[i]+"</Receipt_date>";
			if(opener.getInfo("mode") == "COMPLETE"){
		    	strBody+="<state>528</state>";
	    	}else{
    			strBody+="<state>288</state>";
			}
			strBody+="<Receipt_sender_name><![CDATA["+Receipt_sender_name[i]+"]]></Receipt_sender_name>";
			strBody+="<Receipt_sender_id><![CDATA["+Receipt_sender_id[i]+"]]></Receipt_sender_id>";
   		    strBody+="<DIVISION><![CDATA["+sdivision+"]]></DIVISION>";
   		    strBody+="<Receipt_kind_code>"+Receipt_kind_code[i]+"</Receipt_kind_code>";//2006.11추가 for UI변경
			strBody+="</detail>";
		}
	}
	
	if (strBody != "") {
		strBody = "<body>" + strBody+ "</body>";
	}
	return strBody;
}
var bDept = false;
var xmldom;
function insertToList(oList)
{
	xmldom = CreateXmlDocument();
	xmldom.async = false;
	xmldom.loadXML("<?xml version='1.0' encoding='utf-8'?>"+oList.xml);
	switch (g_openType){
	    case "0":
	    case "1":dataBind("new",xmldom, document.getElementById("tblccrecinfo"), g_openType);break;
	    case "2":dataBind("new",xmldom, document.getElementById("tblrefinfo"), g_openType);bDept = false;break;
	}
}

function insertToList2(oList)
{
	xmldom = CreateXmlDocument();
	xmldom.async = false;
	xmldom.loadXML("<?xml version='1.0' encoding='utf-8'?>"+oList.xml);
	switch (g_openType){
	    case "0":
	    case "1":dataBind("new",xmldom, tblccrecinfo, g_openType);break;
	    case "2":dataBind("new",xmldom, tblrefinfo, g_openType);bDept = false;break;
	}
}


function CirculationLine(){
	if (self.iCirculationLine.m_id!=""){
		
	    var oSteps = self.iCirculationLine.queryGetData();
	    var oCheckSteps = chkAbsent(oSteps);
	}							
	return 	oSteps;
}

function chkAbsent(oSteps){
	var oUsers = oSteps.selectNodes("user/item");
	var elmUsers;
	var sUsers="";
	for(var i=0; i < oUsers.length ; i++){
		elmUsers = oUsers.nextNode();
		if(sUsers.length > 0 ){
		    var szcmpUsers = ";" + sUsers + ";";
		    if (szcmpUsers.indexOf(";" + elmUsers.selectSingleNode("AN").text + ";") == -1 ){
			    sUsers += ";"+elmUsers.selectSingleNode("AN").text;
			}
		}else{
			sUsers += elmUsers.selectSingleNode("AN").text;
		}
	}
	//var szURL = "/xmlorg/query/org_chkabsent.xml?USER_ID="+sUsers;
	var pXML = " EXEC dbo.usp_CheckAbsentMember '"  + sUsers + "' ";
    var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>" ;
    var szURL = "/covinet/coviportalnet/address/getXMLQuery.aspx?Type=searchMember";
    requestHTTP("POST",szURL,false,"text/xml",null, sXML);
	//requestHTTP("GET",szURL,false,"text/xml",null,null);
	return chkAbsentUsers(oSteps);
}
var g_szAcceptLang  = "ko";
function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	m_xmlHTTP.open(sMethod,sUrl,bAsync);
	m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
	m_xmlHTTP.setRequestHeader("Content-type", sCType);
	if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
}
function event_noop(){return(false);}
function chkAbsentUsers(oSteps){	
	if(m_xmlHTTP.readyState==4){	
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=="\r"){
			//alert(m_xmlHTTP.responseText);			
		}else{			
			var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			if(errorNode!=null){
				return true;
			}else{
                var m_objXML=CreateXmlDocument();
				var m_oMemberXSLProcessor = makeProcessor("../Address/org_memberquery.xsl");
	            m_oMemberXSLProcessor.input = m_xmlHTTP.responseXML;
	            m_oMemberXSLProcessor.transform();
	            m_objXML.loadXML(m_oMemberXSLProcessor.output);
		
				//Active 한 사용자들 모두 조회, 부서, 직위, 직급, 직책 비고
				var oUsers = m_objXML.selectNodes("response/addresslist/item");
				var oUser;
				var sAbsentResult="";
				var sResult="";
				var oStepUsers = oSteps.selectNodes("division/step/ou/person");
				
				for(var i=0;i<oStepUsers.length;i++){
					oUser = oStepUsers.nextNode();
					var oChkAbsent = m_objXML.selectNodes("response/addresslist/item[AN='" +oUser.getAttribute("code") + "']");
					if ( oChkAbsent != null ){ 
						var oChkAbsentNode = m_objXML.selectSingleNode("response/addresslist/item[AN='" +oUser.getAttribute("code") + "' and @tl='"+ oUser.getAttribute("title") +"' and RG='" + oUser.getAttribute("oucode") + "' and RGNM = '" + oUser.getAttribute("ouname") + "']");
						if(oChkAbsentNode != null){
							
						}else{
							sResult += "	" + oUser.getAttribute("ouname") +" : " + oUser.getAttribute("name")+"\n";
						}
						
					}else{//퇴직자
						sAbsentResult += "	" + oUser.getAttribute("ouname") +" : " + oUser.getAttribute("name")+"\n";
					}
				}
				if (sAbsentResult != "" ){
					alert(strMsg_057+sAbsentResult); //"선택한 개인 결재선에 퇴직자가 포함되어 적용이 되지 않습니다.\n\n---퇴직자--- \n\n"
					return false;
				}else{
					if(sResult != ""){
						alert(msg_173+sResult);//"선택한 개인 결재선의 부서/인사정보가 최신정보와 일치하지 않아 적용이 되지 않습니다.\n\n---변경자--- \n\n"
						return false;
					}else{
						return true;
					}
					
				}
			}
		}
	}
}

function makeNode(sName,vVal,sKey,bCData) {
    if ("ActiveXObject" in window) {
        if (vVal == null) { m_cvtXML.text = opener.getInfo((sKey != null ? sKey : sName)); } else { m_cvtXML.text = vVal; }	
    }else {
        if (vVal == null) { m_cvtXML.textContent = opener.getInfo((sKey != null ? sKey : sName)); } else { m_cvtXML.textContent = vVal; }	
    }
	return "<"+sName+">"+(bCData?"<![CDATA[":"")+(bCData?m_cvtXML.text+"]]>": m_cvtXML.xml)+"</"+sName+">";
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
//As the window opens, call this function.
//This function displays cclist and reflist.
function getListInit(szDataSet, oTable){
	if (szDataSet == "" || szDataSet == "<NewDataSet />") {
		var tr = oTable.insertRow(oTable.rows.length);
		var td1 = tr.insertCell(tr.cells.length);
		td1.width="100%";
		td1.align="center";
		td1.colSpan=5;
		td1.innerHTML =  msg_112;//"항목이 없습니다.";
	}
	else {
		var xmldom = CreateXmlDocument();
		xmldom.async = false;
		//2014-06-26 hyh 수정
        //xmldom.loadXML("<?xml version='1.0' encoding='utf-8'?>"+szDataSet);
		xmldom.loadXML("<?xml version='1.0' encoding='utf-8'?>" + szDataSet.split("&").join(""));
		//2014-06-26 hyh 수정 끝
		var col = xmldom.selectNodes("/NewDataSet/CirculationData");
		var j= Receipt_id.length;
		var temp_kind;
		for (var i=0;i<col.length ;i++)
		{
			if( (col(i).selectSingleNode("RECEIPT_ID").text != "") || (col(i).selectSingleNode("RECEIPT_ID").text == "" && chkDuplicate(Receipt_ou_id, col(i).selectSingleNode("RECEIPT_OU_ID").text) == false)){
			    if(( opener.getInfo("fmpf") == "WF_CUCKOO_DEVELOP" && col(i).selectSingleNode("DIVISION").text == sdivision ) || (opener.getInfo("fmpf") != "WF_CUCKOO_DEVELOP")){
				    Receipt_id[j] = col(i).selectSingleNode("RECEIPT_ID").text;   //수신자 사번
				    Receipt_name[j] = col(i).selectSingleNode("RECEIPT_NAME").text; //수신자명
				    Receipt_ou_name[j] = col(i).selectSingleNode("RECEIPT_OU_NAME").text; //수신자부서명
				    Receipt_ou_id[j] = col(i).selectSingleNode("RECEIPT_OU_ID").text;     //부서코드
				    Receipt_state[j] = "O";
				    Receipt_date[j] = col(i).selectSingleNode("SEND_DATE").text;
				    Receipt_gp_name[j] = col(i).selectSingleNode("RECEIPT_GP_NAME").text; //해당회사
    //				Receipt_date[j] = col(i).selectSingleNode("SEND_DATE").text;	// 발신일
				    Receipt_sender_name[j] = col(i).selectSingleNode("SENDER_NAME").text;	// 발신자명
				    Receipt_sender_id[j] = col(i).selectSingleNode("SENDER_ID").text;	// 발신자ID
				    Receipt_kind_code[j]=col(i).selectSingleNode("KIND").text;//수신/참조/회람 구분
				    temp_kind = col(i).selectSingleNode("KIND").text;	// 수신/참조/회람 구분명
				    if (temp_kind=="0") Receipt_kind[j]="수신";
				    else if (temp_kind=="1") Receipt_kind[j]="참조";
				    else if (temp_kind=="2") Receipt_kind[j]="회람";
				    //2007.06 유유미
				    //gridBind(Receipt_name[j],Receipt_gp_name[j],Receipt_ou_name[j],Receipt_id[j]+"@"+Receipt_ou_id[j],"",Receipt_kind[j],Receipt_sender_id[j], oTable,temp_kind);
				    gridBind(Receipt_name[j],Receipt_gp_name[j],Receipt_ou_name[j],Receipt_id[j]+"@"+Receipt_ou_id[j],"",Receipt_kind[j],Receipt_sender_id[j], oTable,temp_kind,Receipt_sender_name[j],Receipt_date[j].substring(0,10),"old");
				    j = Receipt_id.length;
				}
			}//Receipt_date[j].substring(0,10)
		}
		//의견넣기 2007.06 의견 예외 처리
		//의견넣기 2007.03 동일양식 보낼 시에 의견은 일단 뿌려주자
		var oComment = xmldom.selectSingleNode("/NewDataSet/CirculationData[SENDER_ID='"+userid+"']/COMMENT");
		if ( oComment != null){
		    ideas.value = oComment.text;
		}else{
		    //의견이 없을 경우 수신자
		    oComment = xmldom.selectSingleNode("/NewDataSet/CirculationData[RECEIPT_ID='"+userid+"']/COMMENT");
		    if ( oComment != null){
		        ideas.value = oComment.text;
		    }else{
				oComment = xmldom.selectSingleNode("/NewDataSet/CirculationData[RECEIPT_OU_ID='"+Sender_ou_id+"']/COMMENT");
		    }
		}
	}
}

function getBodyDelete()
{
	var strBodyRec = "";
	var strBodySend = "";
	var deleteinfo ="";
	//수신 삭제 리스트
	for (var i=0;i<Receipt_id.length;i++ )
	{
		if (Receipt_state[i] == "D") {
		    //부서회람의 경우도 삭제가 필요함
		    strBodyRec += "<DEL_ITEM>";
		    strBodyRec += "<PROCESS_ID>" + Process_id + "</PROCESS_ID>";
		    strBodyRec += "<FORM_INST_ID>" + Form_inst_id + "</FORM_INST_ID>";
		    strBodyRec += "<RECEIPT_ID>" + Receipt_id[i] + "</RECEIPT_ID>";
		    strBodyRec += "<RECEIPT_OU_ID>" + Receipt_ou_id[i] + "</RECEIPT_OU_ID>";
		    strBodyRec += "</DEL_ITEM>";
		}
	}
	
	//발신에 포함되는 수신리스트가 없을 경우 발신내역 삭제
    if(document.getElementById("tblccrecinfo").rows.length == 0 && document.getElementById("tblrefinfo").rows.length== 0){
		strBodySend += "<DEL_ITEM>";
		strBodySend += "<PROCESS_ID>" + Process_id + "</PROCESS_ID>";
		strBodySend += "<FORM_INST_ID>" + Form_inst_id + "</FORM_INST_ID>";
		strBodySend += "</DEL_ITEM>";
    }
	if ( strBodyRec != "" || strBodySend != ""){
	    deleteinfo = "<REQUEST><RECEIPT_DEL>" + strBodyRec + "</RECEIPT_DEL><SEND_DEL>" + strBodySend + "</SEND_DEL></REQUEST>";
	}
	return deleteinfo;
}

//확인버튼 - 추가 삭제 동시 처리
function SaveDB(){
    //삭제처리
    var deleteinfo = getBodyDelete();
    if (deleteinfo != ""){
	    var xmlhttp = CreateXmlHttpRequest();
	    xmlhttp.open("post",backurl + "DelMail.aspx",false);
	    xmlhttp.setRequestHeader("Accept-Language","ko");
	    xmlhttp.setRequestHeader("Content-type", "text/xml");
    	
	    xmlhttp.send(deleteinfo);
	    alert(xmlhttp.responseText);
	    if (xmlhttp.responseXML.selectSingleNode("//response").text=="OK") {
		    //document.location.reload();
	    }else{
		    alert(msg_005);//"일시적인 문제로 인해 삭제가 취소되었습니다.");
		    return;
	    }    
	}

	var strBody = getBody();
	if (strBody != ""){
	    var xmlhttp = CreateXmlHttpRequest();
	    var strXml = "<?xml version='1.0'?><impoinsert>"+getHeader()+strBody+"</impoinsert>";	 
	    var xml;    	
	    try{xml = evalXML(strXml);	}catch(e){alert(e.description);return;}	    
    	
	    try
	    {
		    xmlhttp.open("POST",backurl + "Circulation.aspx?userid="+userid+"&kind="+g_openType,false);//수정된부분
		    xmlhttp.setRequestHeader("Content-type", "text/xml");
		    xmlhttp.setRequestHeader("Accept-Language","ko");
		    xmlhttp.send(xml.xml);
		    if (xmlhttp.responseXML.selectSingleNode("//response").text=="OK")
		    {
    			alert(msg_170);    //			alert('완료되었습니다.');
		    }
		    else {
                return;
		    }
	    }
	    catch(e){
		    alert("error: " + e.description);
	    }
	}
    window.close();
}