var m_oApvList;
var	Receipt_id = new Array();
var	Receipt_name = new Array();
var	Receipt_ou_id = new Array();
var	Receipt_ou_name = new Array();
var	Receipt_state = new Array();
var	User_chk = new Array();	
var sdivision= "";
var Receipt_id;
var Receipt_name;
var Receipt_ou_id;
var Receipt_ou_name;
var Receipt_state;
var User_chk;
var m_cvtXML = CreateXmlDocument();
var m_xmlHTTP = CreateXmlHttpRequest();

window.onload=initOnload;
function initOnload()
{
    if(top.opener.bState =="change")
    {
        insertToList2(CirculationLine());
    }else
    {
        //cirdom= new ActiveXObject("MSXML2.DOMDocument");    
        cirdom = CreateXmlDocument();
        cirdom.loadXML("<?xml version='1.0' encoding='utf-8'?><root></root>");
    }
    
    try{parent.document.getElementById("ApvlineViewer").contentWindow.frameElement.height = document.getElementById("divleft").offsetHeight+10;}catch(e){}
    
}

function doButtonAction(obj)
{
	var sUrl;
	var iWidth=640;
	var iHeight=480;
	var sSize="fix";
	switch (obj.id)
	{
		case "btCirculation" ://회람자
		    insertToList(switchParentNode(3));  break;
		case "btCirculationDept" ://회람부서
		    bDept = true;	insertToList(switchParentNode(4));   break;
		case "btClose" :
		    window.close(); break;
		case "btSend":  //삭제처리,추가처리  
		    if (document.getElemetById("ideas").value == ""){alert("의견을 입력하셔요!"); return;}    
		    SaveDB();break;
		case "btDeleteccrec":
			delItem(document.getElementById("tblccrecinfo"), "chkDel","chkAllccrec");break;
		case "btDeleteref":
			delItem(document.getElementById("tblrefinfo"),"chkDelref","chkAllref");break;
		case "chkAllccrec"://수신참조전체선택chkAllref회람 chkAllccrec/chkDel수신/참조
			chkHandle(document.getElementById("tblccrecinfo"), "chkDel","chkAllccrec"); break;
		case "chkAllref"://회람전체선택
			chkHandle(document.getElementById("tblrefinfo"),"chkDelref","chkAllref");break;
		//reset 버튼 기능 구현 필요
		default :
			break;
	}
}

var bDept = false;
var xmldom;
var scir="";
var scir_Group="";
var cirdom;

function insertToList(oList)
{
    xmldom = CreateXmlDocument();
    xmldom.async = true;    
    xmldom.loadXML("<?xml version='1.0' encoding='utf-8'?>"+oList.xml);  
       
    var xmldom_temp = CreateXmlDocument();
    xmldom_temp.async = true;    
    xmldom_temp.loadXML(oList.xml);  
      
    // 사람
    var oXml= xmldom_temp.selectNodes("user/item");
    var oCXml = cirdom.selectSingleNode("root/user");
    
    if (oXml.length>0)
    {
        if(oCXml==null)
        {
            oXml= xmldom_temp.selectSingleNode("user");
            oCXml = cirdom.selectSingleNode("root");
            oCXml.appendChild(oXml.cloneNode(true));
        }else
        {
            for(var i =0 ; i<oXml.length; i++)
            {
                if(window.event){
                    if((oCXml.xml.indexOf("<AN>" + oXml[i].selectSingleNode("AN").text+"</AN>")>-1)==false)
                    {
                        oCXml.appendChild(oXml[i].cloneNode(true));
                    }
                }
                else
                {
                    if((oCXml.xml.indexOf("<AN>" + oXml.item[i].selectSingleNode("AN").text+"</AN>")>-1)==false)
                    {
                        oCXml.appendChild(oXml.item[i].cloneNode(true));
                    }
                }
            }
        }
    }
    
    //부서
    oXml= xmldom_temp.selectNodes("group/item");
    oCXml = cirdom.selectSingleNode("root/group");
    if (oXml.length>0)
    {
        if(oCXml==null)
        {
            oXml= xmldom_temp.selectSingleNode("group");
            oCXml = cirdom.selectSingleNode("root");
            oCXml.appendChild(oXml.cloneNode(true));
        }else
        {
            for(var i =0 ; i<oXml.length; i++)
            {
                if(window.event){                
                    if((oCXml.xml.indexOf("<AN>" + oXml[i].selectSingleNode("AN").text+"</AN>")>-1)==false)
                    {
                        oCXml.appendChild(oXml[i].cloneNode(true));
                    }
                }
                else{
                    if((oCXml.xml.indexOf("<AN>" + oXml.item[i].selectSingleNode("AN").text+"</AN>")>-1)==false)
                    {
                        oCXml.appendChild(oXml.item[i].cloneNode(true));
                    }
                }
            }
        }
    }
    
	dataBind("new",xmldom, document.getElementById("tblrefinfo"));
	bDept = false;
}

function insertToList2(oList)
{
	xmldom = CreateXmlDocument();
    xmldom.async = false;
	xmldom.loadXML("<?xml version='1.0' encoding='utf-8'?>"+oList);
	
    var oXml= xmldom.selectNodes("root/*");
    for(var i =0 ; i<oXml.length; i++)
    {
        //20110503
        //        if(window.event){scir=scir+oXml[i].xml;}
        //        else{scir=scir+oXml.item[i].xml;}
        var elm = oXml.nextNode();
        scir = scir + elm.xml;
    }
    
	//cirdom= new ActiveXObject("MSXML2.DOMDocument");    
	cirdom = CreateXmlDocument();
    cirdom.async = false;
    cirdom.loadXML("<?xml version='1.0' encoding='utf-8'?><root>"+scir+"</root>");
    
	
	dataBind("new",xmldom, document.getElementById("tblrefinfo"));
	bDept = false;
	
}

function CirculationLine(){
	if (parent.top.opener.document.getElementById("Apvline").contentWindow.m_id !=""){
	    parent.queryGetData();
	}		
	//return parent.top.opener.menu.APVLIST.value;					
	return parent.top.opener.document.getElementById("menu").APVLIST.value;
}


function fn_selectColDate(col, i) {
//20110503
    if(window.addEventListener)
    {
        data = col.item[i]
    }
    else
    {
        data = col[i];
    }
    return data;
}

function dataBind(mode,xmldom, oTable)
{    
    var bFirst=true;
	switch (mode)
	{
		case "delete":
		 	resetGird(oTable);
			for (var i=0;i<Receipt_name.length ;i++){
				gridBind(Receipt_name[i],Receipt_ou_name[i],Receipt_id[i]+"@"+Receipt_ou_id[i]);
			}//Receipt_date[i].substring(0,10)
			break;
		case "new":
			var col = xmldom.selectNodes("//item");
			var place="";var name="";var date;var chk; var kind_data;
			var j= Receipt_id.length;

		    if(col.length > 0 && oTable.rows.length > 0 && oTable.rows[0].innerText == strMsg_136){
		        resetGird(oTable);
		    }else if(col.length == 0 ){
                alert(strMsg_162);	
		    }
			
			for (var i=0;i<col.length ;i++)
			{
			    var colData = fn_selectColDate(col, i);
			    
			    //if (col[i].parentNode.nodeName=="group") bDept=true;
			    if (colData.parentNode.nodeName=="group") bDept=true;
			    else bDept=false;
				//if(( bDept && chkDuplicate(Receipt_ou_id, col[i].selectSingleNode("AN").text) == false) || (bDept==false && chkDuplicate(Receipt_id, col[i].selectSingleNode("AN").text) == false)){
				if(( bDept && chkDuplicate(Receipt_ou_id, colData.selectSingleNode("AN").text) == false) || (bDept==false && chkDuplicate(Receipt_id, colData.selectSingleNode("AN").text) == false)){
				    if (bDept){
					    Receipt_id[j] = "";   //수신자 사번
					    Receipt_name[j] = ""; //수신자명
					    Receipt_ou_name[j] = colData.selectSingleNode("DN").text; //수신자부서명
					    Receipt_ou_id[j] = colData.selectSingleNode("AN").text;     //부서코드
                        
				    }else{
					    Receipt_id[j] = colData.selectSingleNode("AN").text;   //수신자 사번
					    Receipt_name[j] = colData.selectSingleNode("DN").text; //수신자명
					    Receipt_ou_name[j] = colData.selectSingleNode("DP").text; //수신자부서명
					    Receipt_ou_id[j] = colData.selectSingleNode("JD").text;     //부서코드
				    }
					Receipt_state[j] = "N";					
				
			        gridBind(Receipt_name[j], Receipt_ou_name[j], Receipt_id[j]+"@"+Receipt_ou_id[j], oTable, mode);
					j = Receipt_id.length;
				}else
				{
				    if(bFirst)
				    {
				        alert(strMsg_171);//"이미 회람수신자 이거나 결재선에 지정된 사람 입니다.\r\n회람 그룹에 추가 할 수 없습니다.");	
				        bFirst=false;
				    }
				}
			}
			break;
	}	
}

function gridBind(name, ouname, id, oTable, callType)
{
	var tr = oTable.insertRow(oTable.rows.length);
	var td0 = tr.insertCell(0);
	var td1 = tr.insertCell(1);
	var td2 = tr.insertCell(2);
	
	td0.width="8%";td1.width="46%";td2.width="46%";
    
    if (callType=="new"){
        td0.innerHTML = "<input type='checkbox' name='chkDelref' value='"+id+"'>"; 
        td0.align="left";
        td1.innerHTML = getLngLabel(ouname,false);
        td1.align="left";
        td2.innerHTML = getLngLabel(name,false);
        td2.align="left";
      
    }else{
        td0.innerHTML = "<input type='checkbox' name='chkDelref' value='"+id+"' disabled >"; 
        td1.innerHTML = "<font color='#cccccc'>"+getLngLabel(ouname,false)+"</font>";
        td2.innerHTML = "<font color='#cccccc'>"+getLngLabel(name,false)+"</font>";
    
    }		
}

function resetGird(oTable)
{   //기본데이터 입력 해줄것 꼭
	for (var i = oTable.rows.length-1; i >= 0; i--){
		 oTable.deleteRow(i);
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

function delItem(oTable, szchkDel, szchkAll)
{   //array의 state 상태를 D로 변경
    //chkbox value 구성 person_code@unit_code - 부서회람일 경우 person_code가 없다    
    try{
        var ochkDel = document.getElementsByName(szchkDel);
        if ( ochkDel != null){
            if(ochkDel.length == null){
                if(ochkDel.checked){
                    deleteRecArray(ochkDel.value.split("@")[0],ochkDel.value.split("@")[1]);
                }
                oTable.deleteRow(0);
            }else{
                for(var i=ochkDel.length-1;i>=0;i--){
                    if(ochkDel[i].checked){
                        deleteRecArray(ochkDel[i].value.split("@")[0],ochkDel[i].value.split("@")[1]);
                        oTable.deleteRow(i);
                    }
                }
            }
        }
    }catch(e){}
}

function deleteXMLDOM(szid,szouid){
    try{
        var oUserNode = cirdom.selectNodes("root/user");
        var elm;
        var oItemNode
        for (var i=0; i<oUserNode.length;i++) {
			elm = oUserNode.nextNode();
			oItemNode = elm.selectSingleNode("item[AN='"+szid+"']");
			if (oItemNode != null) elm.removeChild(oItemNode);
		}
		oUserNode = cirdom.selectNodes("root/group");
		for (var i=0; i<oUserNode.length;i++) {
			elm = oUserNode.nextNode();
			oItemNode = elm.selectSingleNode("item[AN='"+szouid+"']");
			if (oItemNode != null) elm.removeChild(oItemNode);
		}
		
    }catch(e)
    {
    }    
}

function deleteRecArray(szid,szouid){
    deleteXMLDOM(szid,szouid);
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
        }    
	    Receipt_id.length = Receipt_id.length-1;
	    Receipt_name.length = Receipt_name.length-1;
	    Receipt_ou_name.length =Receipt_ou_name.length-1;
	    Receipt_ou_id.length =Receipt_ou_id.length-1;
	    Receipt_state.length = Receipt_state.length-1;
    }
}

function chkHandle(oTable,szchkDel, szchkAll)
{   //chkAllref회람 chkAllccrec/chkDel수신/참조
    try{
        var ochkDel = document.getElementsByName(szchkDel);
        if ( ochkDel != null){
            var ochkAll = document.getElementsByName(szchkAll)[0];
            //var ochkAll = eval(szchkAll);
            if(ochkDel.length == null){
                ochkDel.checked=(ochkAll.checked == true)?true:false;
            }else{
                for(var i=0;i<ochkDel.length;i++){ochkDel[i].checked=(ochkAll.checked == true)?true:false;}
            }
        }
    }catch(e){}
}

function alertParseError(err){
	//alert("오류가 발생했습니다. in ApvlineMgr.js\ndesc:"+err.reason+"\nsrcurl:"+err.url+"\nsrctxt:"+err.srcText+"\nline:"+err.line+"\tcolumn:"+err.linepos);
	alert("CirculationMgr.js\ndesc:"+err.reason+"\nsrcurl:"+err.url+"\nsrctxt:"+err.srcText+"\nline:"+err.line+"\tcolumn:"+err.linepos);
}