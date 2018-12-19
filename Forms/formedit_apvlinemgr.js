// JScript 파일
// 기능 : 양식 내 결재선 관리
// 작성일 : 2008.01.24
//결재선 지정 UI 변경
var m_oHTMLProcessor;
var m_xmlHTTPXSL = CreateXmlHttpRequest();
function displayApvListFormApvLine(oApvList){
    m_oHTMLProcessor = makeProcessorScript("../ApvLineMgr/ApvlineDisplayFormWrite_xsl.aspx");
    refreshList(oApvList);
    var elmRoot = oApvList.documentElement;		
    try{displayCCInfo(elmRoot);}catch(e){}	  
    try{G_displaySpnDocLinkInfo();}catch(e){}
	try{G_displaySpnRejectDocLinkInfo();}catch(e){}
	try{if(getInfo("scPM")=="1") G_displaySpnPMLinkInfo((getInfo("scPMV")==""?null:getInfo("scPMV")));}catch(e){}     
}
function makeProcessor(urlXsl){
    if (window.ActiveXObject) {
        var oXslDom = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
        oXslDom.async = false;
        if(!oXslDom.load(urlXsl)){
	        alertParseError(oXslDom.parseError);
	        throw new Error(-1,"couldn't make TemplateProcessor with ["+urlXsl+"].");
        }
        var oXSLTemplate = new ActiveXObject("MSXML2.XSLTemplate");
        oXSLTemplate.stylesheet = oXslDom;
        return oXSLTemplate.createProcessor();
    }else{
          var oXSL = "";
          var oXslDom = CreateXmlDocument();
//        if (urlXsl.indexOf(".xsl") > -1){
//            oXslDom.async = false;
//            oXslDom.load(urlXsl);
//        }else{
            var oXMLHttp =  CreateXmlHttpRequest();
	        oXMLHttp.open("GET",urlXsl,false);
	        oXMLHttp.send();
	        //시간 늘리기
	        delay(600);
	        if ( oXMLHttp.status == 200){
		       var parser = new DOMParser();
               oXslDom = parser.parseFromString(oXMLHttp.responseText,"text/xml");
               //oXSL = oXMLHttp.responseText.substring(38,oXMLHttp.responseText.length) ;
	        }
//        }
        var oProcessor = new XSLTProcessor();
        oProcessor.importStylesheet(oXslDom);
        return oProcessor;
          //return oXMLHttp.responseText.replace("<![CDATA[", "&lt;![CDATA[").replace("]]>", "]]&gt;").replace('(iVal<10?"0"+iVal:iVal)','(iVal&lt;!10?"0"+iVal:iVal)').replace('for(var i=0; i < aDotCount.length-1; i++){','for(var i=0; i &lt;! aDotCount.length-1; i++){').replace('"<br>"','"&lt;!br&gt;"').replace('"<font color=\'white\'>-</font>"','"&lt;!font color=\'white\'&gt;-&lt;!/font&gt;"');
       // return oXMLHttp.responseText.replace("<![CDATA[", "@CDATASTART").replace("]]>", "@CDATAEND");
    }
}
function makeProcessorScript(urlXsl){
  var oXSL = "";
  var oXslDom = CreateXmlDocument();
    var oXMLHttp =  CreateXmlHttpRequest();
    oXMLHttp.open("GET",urlXsl,false);
    oXMLHttp.send();
    //시간 늘리기
    delay(600);
    if ( oXMLHttp.status == 200){
       oXSL = oXMLHttp.responseText;
    }
    return oXSL;
}
function delay(gap){/*gap is in milisecs*/
	var then, now;
	then = new Date().getTime();
	now=then;
	while((now-then)<gap)
	{
		now = new Date().getTime();
	}
}
function refreshList(m_oApvList, selectedRowId){
	try {
            var pXML =null ;
            var aXML = "";

	        if (getInfo("loct")=="PREAPPROVAL"||getInfo("loct")=="COMPLETE"){		//	쿠쿠전자 수정
		        aXML+="<param><name>viewtype</name><value><![CDATA["+"read"+"]]></value></param>";
	        }else{
		        switch(m_sApvMode){
			        case "DRAFT":
			        case "TEMPSAVE":
        		        aXML+="<param><name>viewtype</name><value><![CDATA["+"create"+"]]></value></param>";
				        break;
			        case "REDRAFT":
        		        aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
				        break;
			        case "SUBREDRAFT":
        		        aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
        		        aXML+="<param><name>currentroutetype</name><value><![CDATA["+"consult"+"]]></value></param>";
				        break;
			        case "APVLINE":
        		        aXML+="<param><name>viewtype</name><value><![CDATA["+"create"+"]]></value></param>";
				        break;
			        case "APPROVAL":
        		        aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
				        break;
			        case "SUBAPPROVAL":
        		        aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
        		        aXML+="<param><name>currentroutetype</name><value><![CDATA["+"consult"+"]]></value></param>";
				        break;
			        case "RECAPPROVAL":
        		        aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
				        break;
			        case "CHARGE":
        		        aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
				        break;
			        case "PROCESS":
        		        aXML+="<param><name>viewtype</name><value><![CDATA["+"change"+"]]></value></param>";
				        break;
			        case "DEPTLIST": //200902 추가 시작 : 일괄결재선지정
        		        aXML+="<param><name>viewtype</name><value><![CDATA["+"create"+"]]></value></param>";
				        break;
			        default:
        		        aXML+="<param><name>viewtype</name><value><![CDATA["+"read"+"]]></value></param>";
				        break;
		        }
	        }
	        aXML+="<param><name>deputytype</name><value><![CDATA[" + m_oFormMenu.gDeputyType + "]]></value></param>"; //대결자설정사용여부
            aXML+="<param><name>scPAgr</name><value><![CDATA["+getInfo("scPAgr")+"]]></value></param>";
            aXML+="<param><name>scPCoo</name><value><![CDATA["+getInfo("scPCoo")+"]]></value></param>";
            aXML+="<param><name>scPAdt</name><value><![CDATA["+getInfo("scPAdt")+"]]></value></param>";
            aXML+="<param><name>scPRec</name><value><![CDATA["+getInfo("scPRec")+"]]></value></param>";
            aXML+="<param><name>scPReview</name><value><![CDATA[" + getInfo("scReview") + "]]></value></param>";
            aXML+="<param><name>lngindex</name><value><![CDATA[" + m_oFormMenu.gLngIdx + "]]></value></param>";
            
            var sXML = "<Items><xml><![CDATA[" +m_oApvList.xml+"]]></xml><xslxml><![CDATA[" + m_oHTMLProcessor + "]]></xslxml></Items>" ;
            if ( aXML != "") {
	            sXML = "<Items><xml><![CDATA[" +m_oApvList.xml+"]]></xml><xslxml><![CDATA[" + m_oHTMLProcessor + "]]></xslxml>"+aXML+"</Items>" ;
            }
            var szURL = "../getXMLXslParsing.aspx";
            requestHTTPXSL("POST", szURL, false, "text/xml; charset=utf-8", null, sXML);
            receiveHTTPXSL();
	}catch(e){
		//alert(strMsg_030 "오류가 발생했습니다. at refreshList in ApvlineMgr.js\nError Desc:" + e.description);
		alert(+ "\n at refreshList in ApvlineMgr.js\nError Desc:" + e.description);
	}
}
function receiveHTTPXSL(){	
	if(m_xmlHTTPXSL.readyState==4){
		m_xmlHTTPXSL.onreadystatechange=event_noop;
		var xmlReturn=m_xmlHTTPXSL.responseXML;
		if(xmlReturn.xml==""){
			//alert(m_xmlHTTPXSL.responseText);
		}
		else {
		    document.getElementById("AppLine").innerHTML =  xmlReturn.documentElement.xml;
		}
	}
}
var m_selectedRow=null;
var m_selectedRowId=null;
function setSelectedRowId(id){m_selectedRowId=id;}
function selectRow(id){
	var oRow;
	if(id==null){
		oRow=event.srcElement;
	}else{
		oRow=document.all[id];
	}
	if(oRow!=null){
		switchSelectedRow(oRow);
	}else{
		m_selectedRow=null;
		m_selectedRowId=null;
	}
}
function switchSelectedRow(oRow){
	while(oRow!=null&&oRow.tagName!="TR"){
		oRow=oRow.parentNode;
	}
	if(oRow!=null){
		//if(m_selectedRow!=null)m_selectedRow.className="";
		//oRow.className="rowselected";
		if(m_selectedRow!=null)m_selectedRow.style.backgroundColor="#FFFFFF";
		oRow.style.backgroundColor="#EEF7F9";

		m_selectedRow=oRow;
		m_selectedRowId=oRow.id;
	}
}
function clearSelection(){
	m_selectedRow=null;
	m_selectedRowId=null;
}
function getPatentRow(){
	switchSelectedRow(event.srcElement);
	return m_selectedRow;
}
function getSelectedRow(){return m_selectedRow;}
function doFormButtonAction(obj){
    var tbl = document.getElementById("APVTable");
    switch(obj.id){
        case "btAPVAdd":
            var tr = tbl.insertRow(tbl.rows.length);
	        tr.Height= 20;
	        var beforid = tbl.rows[tbl.rows.length-2].id;
	        var currentid = 0; 
	        if(isNaN(beforid)){
	            currentid =  parseInt(beforid.substring(beforid.indexOf("[")+1, beforid.indexOf("]")))+2;
	            tr.id = currentid;
	        }else{
	            currentid= parseInt(beforid) + 1; 
	            tr.id = currentid; 
	        }
	        var td0 = tr.insertCell();
	        td0.innerHTML = "<input type='checkbox' id='achk' name='achk"+currentid+"' />";
	        var td1 = tr.insertCell();
	        td1.innerHTML = currentid; 
	        //division type
	        var td2 = tr.insertCell();
	        var szinnerHTML = '<select id="aSELdivision" name="adivisiontype'+currentid+'" style="font-size:9pt;width:100%;height:18;" onchange="divisiontypeChange(this)">'
	                        +'<option value="send">'+parent.menu.gLabel_send+'</option>'
	                        +(getInfo("scPRec")=="1"?'<option value="receive">'+parent.menu.gLabel_receive+'</option>':'')
		                +'</select>'; 
		    td2.innerHTML =szinnerHTML;
	        //step route
	        var td3 = tr.insertCell();
            szinnerHTML = '<select id="aSELroutetype" name="aroutetype'+currentid+'" style="font-size:9pt;width:100%;height:18;" onchange="routetypeChange()">'
	                    +'<option value="approve">'+parent.menu.gLabel_approve+'</option>'
	                    +(getInfo("scPCoo")=="1"?'<option value="assist">'+parent.menu.gLabel_assist +'</option>':'')
	                    +(getInfo("scPAgr")=="1"?'<option value="consult">'+parent.menu.gLabel_consent +'</option>':'')
	                    +(getInfo("scPAdt")=="1"?'<option value="audit">'+parent.menu.gLabel_audit +'</option>':'')
		            '</select>';
	                    //+(getInfo("scPRec")=="1"?'<option value="receive">'+parent.menu.gLabel_receive +'</option>':'')
		    td3.innerHTML =  szinnerHTML;	        
	        var td4 = tr.insertCell();
	        //szinnerHTML = '<input type="text" id="atext1" name="aname'+currentid+'" onKeyUp="formapvdynamicsearch(this)" style="width:100%"/>';
	        szinnerHTML = '<input type="text" id="atext1" name="aname' + currentid + '" onKeyUp="if (event.keyCode==13) formapvdynamicsearch(this)" style="width:100%" ';
	        szinnerHTML +=	'onblur="fnMiniOrgSrchOnBlur();" ';//이준희(2008-03-05): 컨텍스트 창 외부 클릭 여부를 확인하기 위한 이벤트를 추가함.
	        szinnerHTML += '/>';
	        td4.innerHTML = szinnerHTML; 
	        var td5 = tr.insertCell();
	        td5.id =  "tcol1"+currentid;
	        //td5.align="center";
	        td5.innerHTML = "&nbsp;";
	        var td6 = tr.insertCell();
	        td6.id =  "tcol2"+currentid;
	        //td6.align="center";
	        td6.innerHTML = "&nbsp;";
	        var td7 = tr.insertCell();
	        td7.id =  "tcol3"+currentid;
	        //td7.align="center";
	        td7.innerHTML = "&nbsp;";
	        var td8 = tr.insertCell();
	        td8.id =  "tcol4"+currentid;
	        //td8.align="center";
	        td8.innerHTML = "&nbsp;";
	        var td9 = tr.insertCell();
	        td9.innerHTML = '<input type="text" id="atext2" name="adeptname'+currentid+'" onKeyUp="if (event.keyCode==13) formapvdynamicsearch(this)" style="width:70%"/><input type="text" id="aData" name="aDataDESC'+currentid+'" style="display:none;"/>';
            
            break;
        case "btAPVDelete":
    	    for(var i=tbl.rows.length-1; i>3 ; i--){
                var selitemid =  aData[i-3].name.replace("aDataDESC","");
                var ochkobj = document.all["achk"+selitemid];
                if (ochkobj == null){
                }else{
                    if(ochkobj.checked){
                        var tr1 = tbl.deleteRow(i);	
                    }
                }
    	    }
            
            break;
        case "btAPVOK"://확인버튼
            chkApplyAPVLine();
            break;
    }
}
function divisiontypeChange(obj){
    //route type 선택권 제한
    var objroutetype = eval(obj.name.replace("adivision","aroute" ));
    switch(obj.value){
        case "send":
            var i=0;
            objroutetype.options(i).value = "approve";
			objroutetype.options(i).text = parent.menu.gLabel_approve; //전체
			i++;
			if(getInfo("scPCoo")==1){//asssit
                objroutetype.options(i).value = "assist";
			    objroutetype.options(i).text = parent.menu.gLabel_assist; //전체
    			i++;
			}
			if(getInfo("scPAgr")==1){
                objroutetype.options(i).value = "consult";
			    objroutetype.options(i).text = parent.menu.gLabel_consent; //전체
    			i++;
			}
			if(getInfo("scPAdt")==1){
                objroutetype.options(i).value = "audit";
			    objroutetype.options(i).text = parent.menu.gLabel_audit; //전체
    			i++;
			}
            break;
        case "receive":
            objroutetype.length = 1;
            objroutetype.options(0).value = "receive";
			objroutetype.options(0).text = parent.menu.gLabel_receive; //전체
        break;
    }
}
function routetypeChange(){
 //alert('implement');
}

function formapvdynamicsearch(obj)
{//이준희(2008-03-05): 결재선 직접 입력 시 수행되는 함수임.
	//alert('implement');//alert(obj.name);
	if ( obj.value != "")	MiniOrgSearch(obj, -100, 10, obj.value);
}

var target;
var fname;
var szQuery;

function MiniOrgSearch(f1, diffx, diffy, szvalue)
{//debugger;//이준희(2008-03-05): 결재선 직접 입력 시의 팝업을 처리하는 함수임.
	if(event.type == 'keyup' && event.keyCode == 9)
	{//탭 키를 눌러 포커스를 벗어나는 순간이면
		miniorgsearch.style.display = 'none';//창을 감추고
		return;//함수를 탈출함.
	}
	//miniorgsearch.style.display = (miniorgsearch.style.display == "block") ? "block" : "block";
	
	target=f1; 
	fname=f1.name;

	szQuery = szvalue;
	
	m_xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP");
	var	szURL = ""; 
/*	
	if(String(f1.id) == "atext2"){
		var buse_nm = szQuery;
		var pXML = "dbo.usp_SearchUnit01 ";
        var aXML = "<param><name>ENT_CODE</name><type>VarChar</type><length>100</length><value><![CDATA["+getInfo("etid")+"]]></value></param>";
		if (buse_nm != ""){
		    aXML += "<param><name>DP</name><type>VarChar</type><length>100</length><value><![CDATA["+buse_nm+"]]></value></param>";
		}
        sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath>org_unitquery.xsl</xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
        szURL = "../address/getXMLQuery.aspx?Type=Unit";
	}else{*/
		var pXML = "dbo.usp_SearchMember01";
        var aXML = "<param><name>ENT_CODE</name><type>VarChar</type><length>100</length><value><![CDATA["+getInfo("etid")+"]]></value></param>";
        if(String(f1.id) == "atext2"){
		    if (szQuery != ""){
		       aXML += "<param><name>DP</name><type>VarChar</type><length>100</length><value><![CDATA["+szQuery+"]]></value></param>";
		    }
        }else{
		    if (szQuery != ""){
		       aXML += "<param><name>DN</name><type>VarChar</type><length>100</length><value><![CDATA["+szQuery+"]]></value></param>";
		    }
		}
		//다국어정보
		aXML += "<param><name>LANGUAGE</name><type>VarChar</type><length>100</length><value><![CDATA["+getInfo("uslng")+"]]></value></param>";
		
		/*
		if (dataField["DP"].value != ""){
		   aXML += "<param><name>DP</name><type>VarChar</type><length>100</length><value><![CDATA["+dataField["DP"].value+"]]></value></param>";
		}
		if (dataField["LV"].value != ""){
		   aXML += "<param><name>LV</name><type>VarChar</type><length>100</length><value><![CDATA["+dataField["LV"].value+"]]></value></param>";
		}
		if (dataField["TL"].value != ""){
		   aXML += "<param><name>TL</name><type>VarChar</type><length>100</length><value><![CDATA["+dataField["TL"].value+"]]></value></param>";
		}
		*/
        sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath>org_memberquery.xsl</xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>"+aXML+"</Items>" ;
        szURL = "../address/getXMLQuery.aspx?Type=searchMember";
	
	//}
    x = (document.layers) ? loc.pageX : event.clientX;
    y = (document.layers) ? loc.pageY : event.clientY;
    sH = parseInt(document.body.scrollTop);
    sW = parseInt(document.body.scrollLeft);
	
    miniorgsearch.style.pixelTop	= sH+y+diffy;
    miniorgsearch.style.pixelLeft	= sW+x+diffx;
    requestHTTP("POST",szURL,true,"text/xml",event_listen_queryGetData, sXML);
}

function fnMiniOrgSrchOnBlur()
{//이준희(2008-03-05): 창 외부 클릭 시 해당 창이 사라지도록 하는 함수를 추가함.
	var bOut	= false;//마우스가 컨텍스트 검색창 외부를 클릭했을 경우 true가 됨.
	var iOut	= 0;
	try
	{
		iOut += (event.x < miniorgsearch.offsetLeft);
		iOut += (event.x > miniorgsearch.offsetLeft + miniorgsearch.offsetWidth);
		iOut += (event.y < miniorgsearch.offsetTop);
		iOut += (event.y > miniorgsearch.offsetTop + miniorgsearch.offsetHeight);
		if(iOut > 0)
		{
			miniorgsearch.style.display = 'none';
		}
	}
	catch(e)
	{
	}
}

var mAPVSearchResultXML = CreateXmlDocument();
function event_listen_queryGetData(){
	if(m_xmlHTTP.readyState == 4){
		m_xmlHTTP.onreadystatechange = event_noop;//re-entrant gate
		if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			document.all.miniorgsearch.innerHTML=""; 
		}else{
	        //miniorgsearch.style.display = (miniorgsearch.style.display == "block") ? "none" : "block";	
			var oDOM = m_xmlHTTP.responseXML;
			var oErr = oDOM.documentElement.selectSingleNode("error");
			if(oErr==null){
                oDOM.documentElement.transformNodeToObject(g_oSSXML.documentElement,mAPVSearchResultXML);
			
			    //mAPVSearchResultXML.loadXML(oDOM.xml);  
			    //document.all.miniorgsearch.innerHTML =displayAPVSearchList();
			    //document.all.miniorgsearch.innerHTML =displayAPVSearchList(mAPVSearchResultXML);
			    document.all.divminiorgsearch.innerHTML =displayAPVSearchList(mAPVSearchResultXML);
			    OpenPopupFrmEdtObj(target, 'miniorgsearch', 'miniorgsearch' );
			}else{
				if(oErr.text!="none") document.all.miniorgsearch.innerHTML=oErr.text;
			}
		}
	}
}
//검색결과 뿌리기
function displayAPVSearchList(mAPVSearchResultXML){
    if(mAPVSearchResultXML!= null){
	    var rgData = new Array();
	    var nodesAllItems = mAPVSearchResultXML.selectNodes("response/addresslist/item");
    	var szHTML = "<table  id='tblGalInfo' width='150' border='0' cellspacing='1' cellpadding='1'  style='OVERFLOW: scroll;height:100;font-family: Verdana; font-size: 8pt; color: Black; border-color: Transparent; border-style: Solid; border-width: 0px;'>";
	    if (nodesAllItems.length > 0){
		    for(var x=0; x<nodesAllItems.length; x++){
			    rgData[0] = nodesAllItems.item(x).selectSingleNode("DN").text.replace(/\x08/g,"&");
			    //rgData[1] = nodesAllItems.item(x).selectSingleNode("PO").text.replace(/\x08/g,"&");			
			    rgData[1] = nodesAllItems.item(x).selectSingleNode("TL").text.replace(/\x08/g,"&");
			    rgData[2] = (parent.menu.gOUNameType=="1"?(elm.selectSingleNode("ETNM").text + "-"):"")+nodesAllItems.item(x).selectSingleNode("RGNM").text.replace(/\x08/g,"&");
			    szHTML += addAddress(rgData,nodesAllItems.item(x).selectSingleNode("AN").text.replace(/\x08/g,"&"),nodesAllItems.item(x).selectSingleNode("JD").text.replace(/\x08/g,"&"),nodesAllItems.item(x).selectSingleNode("FLDP").text.replace(/\x08/g,"&"));
		    }
	    }else{
		    var nodesAllErrors = mAPVSearchResultXML.selectSingleNode("response/addresslist/error");
    		
		    if(nodesAllErrors != null){                       
			    if (nodesAllErrors.text != "none")
				    addMessage(nodesAllErrors.text);
		    }else{
			    addMessage(L_idsUnknownError_Text + "\r\n"+ L_idsTrySimplifySearch_Text);
		    }
	    }
	    szHTML +="</table>";
	    return szHTML;       
    }
}
function addAddress(rgData,szEM,szJD,szFLDP){
	var eTD;
    var szHTML = "<tr style='cursor:hand;backgroundcolor:#FFFFFF;' em=\'"+szEM+"\' jd=\'" +szJD+ "\' FLDP=\'"+szFLDP+"\' onclick='javascript:parent.selectObject(this);' >";
	for (var x=0;x<rgData.length;x++){
	    szHTML += "<td valign='top' align='left' nowrap='t' style='font-size: 9pt;padding-bottom: 0px; padding-top: 5px; font-family: 돋움,Dotum;' >"+rgData[x].replace(/&/g,"&amp;")+"</td>";
	}
	szHTML +="</tr>";
	return szHTML;
}
function selectObject(obj){
    var selIDX = target.name.replace("adeptname","").replace("aname","");
    var elm = mAPVSearchResultXML.selectSingleNode("response/addresslist/item[AN='"+obj.em+"' and RG='"+obj.jd+"']");
    eval("aname"+selIDX).value = mAPVSearchResultXML.selectSingleNode("response/addresslist/item[AN='"+obj.em+"']/DN").text;
    eval("aDataDESC"+selIDX).value = mAPVSearchResultXML.selectSingleNode("response/addresslist/item[AN='"+obj.em+"' and RG='"+obj.jd+"']").xml;
    eval("tcol1"+selIDX).innerHTML = elm.selectSingleNode("PO").text.replace(/\x08/g,"&");	
    eval("tcol2"+selIDX).innerHTML = elm.selectSingleNode("TL").text.replace(/\x08/g,"&");	
    //eval("tcol3"+selIDX).innerHTML = elm.selectSingleNode("LV").text.replace(/\x08/g,"&");	
    eval("adeptname"+selIDX).value =(parent.menu.gOUNameType=="1"?(elm.selectSingleNode("ETNM").text + "-"):"")+elm.selectSingleNode("RGNM").text;
    oPopupFrmEdtObj.hide();
    
}
//변경된 결재선 - hidden에 값이 있는 경우 
//index에 .이 있는 경우 기존 결재선 변경 없는 경우 추가 
var m_oXSLProcessor;
var m_oApvList =  CreateXmlDocument();
var m_oApvListMenu =  CreateXmlDocument();
var g_oSSXML  =  CreateXmlDocument();
g_oSSXML.load("../address/sort.xsl");
function chkApplyAPVLine(){
	APVLIST.value = parent.menu.APVLIST.value;
	m_oXSLProcessor = makeProcessor("../ApvLineMgr/ApvlineGen.xsl");
	//복사할 대상
	m_oApvListMenu.loadXML("<?xml version='1.0' encoding='utf-8'?>"+parent.menu.APVLIST.value);
	if(!m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+parent.menu.APVLIST.value)){
		alertParseError(m_oApvList.parseError);	
		return;		
	}else{
	    /*기안자 및 기 진행자를 제외한 node 삭제*/
	    var elmList;
	    if(getInfo("mode") == "DRAFT" || getInfo("mode") == "TEMPSAVE"){
	        //수신division 삭제
	        elmList = m_oApvList.documentElement.selectNodes("division[@divisiontype != 'send']");
	        for(var i=0;i<elmList.length;i++){
	            m_oApvList.documentElement.removeChild(elmList.item(i));
	        }
	        //기안자 및 결재자 추가자 삭제
	        elmList = m_oApvList.documentElement.selectNodes("division/step[taskinfo/@status='inactive' or (ou/person/taskinfo/@status = 'inactive' and ou/person/taskinfo/@kind!='charge')]");
	        for(var i=0;i<elmList.length;i++){
	            var oCurrentParent = elmList.item(i).parentNode;
	            oCurrentParent.removeChild(elmList.item(i));
	        }	    
	    }else if (getInfo("SUBREDRAFT") || getInfo("SUBAPPROVAL")){
	        //나중에 수정할 것
	    }else if (getInfo("REDRAFT") || getInfo("RECAPPROVAL")){
	        //나중에 수정할 것
	    }
	    
	    var selIDX = "";
	    var selitemid = "";
        var m_objXML =  CreateXmlDocument();
	    var tbl = document.all["APVTable"];
	    for(var i=4; i<tbl.rows.length ; i++){
	        selitemid = i - 2; //aData[i-3].name.replace("aDataDESC","");
            selIDX = tbl.rows[i].id;
            var sSelDivisionType = eval("adivisiontype"+String(selitemid)).value;
            var sSelRouteType = eval("aroutetype" + String(selitemid)).value;
            var saData = document.getElementsByName("aDataDESC" + String(selitemid)).value;
            if (saData != "") {//변경사항있음
                m_objXML.loadXML("<response><addresslist>" + saData + "</addresslist></response>");
                var m_XMLDOM =  CreateXmlDocument();
                m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
                if(!m_XMLDOM.parsed){
                }
                var m_oParent = m_XMLDOM.selectSingleNode("selected/user");
                var elmList = m_objXML.selectNodes("response/addresslist/item");
                for(var j=0; j < elmList.length; j++){
                    var elm = elmList.nextNode();
                    m_oParent.appendChild(elm);
                }			
                
                m_objXML.loadXML(m_oParent.xml);
	            var oApvList =  CreateXmlDocument();
	            if(!oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>"+parent.menu.field["APVLIST"].value)){
	            }
	            var oCurrentOUNode =oApvList.documentElement.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending' ]");	
	            var sallottype = "serial";
	            var sstepref = "일반결재";
	            switch(sSelRouteType){
	                case "approve":sallottype='serial';break; 
	                case "assist":sstepref = "협조";sallottype='serial';break; 
	                case "consult":sstepref = "합의";sallottype='parallel';break;
	                case "audit":sstepref = "일반감사";sallottype='serial';break;
	                case "receive":sstepref = "수신결재";sallottype='serial';break; 
	            }
               
               insertToList4ApvLine(m_objXML, oCurrentOUNode,"division",sSelDivisionType, "person",sSelRouteType,sallottype, sstepref , getInfo("mode"));
               
	        }else{//변경사항없음
	           if(selIDX.indexOf("[") > -1){//기존 수정
                //divisiontype or routetype 변환 여부 확인
                var aPath = selIDX.split("/");
		            var elmRoot = m_oApvListMenu.documentElement;
		            var xpathCur = selIDX;//oSelTR.id;
		            var elmCur = elmRoot.selectSingleNode(xpathCur);
		            if(elmCur==null)return;
                        
		            var elmParent = elmCur;
		            var xpathNew;
		            var sDivisionType = getFamilyAttribute(elmCur,"division","divisiontype");
		            var sRouteType = getFamilyAttribute(elmCur,"step","routetype");
		            var sUnitType = getFamilyAttribute(elmCur,"step","unittype");
		            var bChangeDivisionType = false;
		            var bChangeRoutetype = false;
		            
		            if(sDivisionType != sSelDivisionType){//divisiontype 변경
		                var elmCurDIVmenu =  elmRoot.selectSingleNode(aPath[0]);
		                elmCurDIVmenu.setAttribute("divisiontype",eval("adivisiontype"+selitemid).value);
		                bChangeDivisionType = true;
		            }
		            if(sRouteType != sSelRouteType){//routetype 변경
		                var elmCurStepmenu = elmRoot.selectSingleNode(aPath[0]+"/"+aPath[1]);
		                elmCurStepmenu.setAttribute("routetype",sSelRouteType);
		                bChangeRoutetype = true;
		            }
		            //담당자, 담당부서가 지정이 되는 경우 예외처리
		            if(!bChangeDivisionType && !bChangeRoutetype && sDivisionType == "receive" && sRouteType=="receive" &&sUnitType == "ou"){
										var elmCurDIVmenu =  elmRoot.selectSingleNode(aPath[0]);
		                elmCurDIVmenu.setAttribute("divisiontype",eval("adivisiontype"+selitemid).value);
		                bChangeDivisionType = true;		
		                var elmCurStepmenu = elmRoot.selectSingleNode(aPath[0]+"/"+aPath[1]);
		                elmCurStepmenu.setAttribute("routetype",sSelRouteType);
		                bChangeRoutetype = true;		                							
		            }
		            
		            //변경하기
		            var elmCurDIV =  m_oApvList.documentElement.selectSingleNode(aPath[0]);
		            var elmCurStep = m_oApvList.documentElement.selectSingleNode(aPath[0]+"/"+aPath[1]);
		            if( bChangeDivisionType){//발신 --> 수신으로 변경
		                elmCurDIV =  m_oApvList.documentElement.selectSingleNode(aPath[0]);//"division[@divisiontype='"+sSelDivisionType+"']");
		                if(elmCurDIV == null){
												if(elmCur.nodeName == "ou"){
													m_oApvList.documentElement.appendChild(elmCur.parentNode.parentNode.cloneNode(false));
		                    }else{
													m_oApvList.documentElement.appendChild(elmCur.parentNode.parentNode.parentNode.cloneNode(false));
		                    }
                        elmCurDIV =  m_oApvList.documentElement.selectSingleNode(aPath[0]);//"division[@divisiontype='"+sSelDivisionType+"']");
                        if(elmCur.parentNode.parentNode.parentNode != null){
													elmCurDIV.appendChild(elmCur.parentNode.parentNode.parentNode.firstChild.cloneNode(false));
                        }else{
													elmCurDIV.appendChild(elmCur.parentNode.parentNode.firstChild.cloneNode(false));
                        }
		                }

                    //해당 step이 존재하지 않음 --> DIVISION 바뀐 경우 무조건 추가
                    elmCurDIV.appendChild(elmCur.parentNode.parentNode.cloneNode(false)); //step
                    if(elmCur.parentNode.parentNode.firstChild.nodeName == "taskinfo")   elmCurDIV.lastChild.appendChild(elmCur.parentNode.parentNode.firstChild.cloneNode(false)); //taskinfo
                    if(sUnitType == "ou"){
                        elmCurDIV.lastChild.appendChild(elmCur.cloneNode(true)); //ou
                    }else{                           
                        elmCurDIV.lastChild.appendChild(elmCur.parentNode.cloneNode(true)); //ou
                    }

                    setStepTaskInfo(bChangeRoutetype, sSelDivisionType, sSelRouteType,aPath[0]+"/"+aPath[1]); //
		            }else{
		                if(elmCurDIV == null){
		                    m_oApvList.documentElement.appendChild(elmCur.parentNode.parentNode.parentNode.cloneNode(true));
		                    //division밑의 taskinfo를 제외한 나머지 node들 삭제
		                    elmCurDIV =  m_oApvList.documentElement.selectSingleNode(aPath[0]);
		                    for(var k=1; k < elmCurDIV.childNodes.length; k++){
		                        elmCurDIV.removeChild(elmCurDIV.childNodes.item(k));
		                    }
		                }
	                    if ( elmCurStep == null ) { //해당 step이 존재하지 않음
	                        if(sUnitType == "ou"){
		                        elmCurDIV.appendChild(elmCur.parentNode.cloneNode(false)); //step까지만생성
	                        }else{
		                        elmCurDIV.appendChild(elmCur.parentNode.parentNode.cloneNode(false)); //step까지만생성
		                    }
		                    elmCurStep = elmCurDIV.lastChild;//m_oApvList.documentElement.selectSingleNode(aPath[0]+"/"+aPath[1]);
	                    }
                        if(sUnitType == "ou"){
                            elmCurStep.appendChild(elmCur.cloneNode(true));
                        }else{
                            elmCurStep.appendChild(elmCur.parentNode.cloneNode(true));
                        }
	                    setStepTaskInfo(bChangeRoutetype, sSelDivisionType, sSelRouteType, aPath[0]+"/"+aPath[1]); //
                    }
                    
                }
	        }  
	    }
	}
	APVLIST.value = m_oApvList.documentElement.xml;
    parent.menu.APVLIST.value =  APVLIST.value;
    initApvList();
}
//oList --> 조직도 화면에서 리턴값으로 넘어온 xml 데이타
//function insertToList4ApvLine(oList, oCurrentOUNode, oSrcDoc, steptype, divisiontype, unittype, routetype, allottype, referencename){
function insertToList4ApvLine(oList, m_oCurrentOUNode,m_sSelectedStepType, m_sSelectedDivisionType, m_sSelectedUnitType, m_sSelectedRouteType, m_sSelectedAllotType, m_sSelectedStepRef, m_sApvMode){
//function insertToList(oList){APVLINEMGR\APVLINEMGR.JS 파일 내 함수 사용
	var xpathNew="";
	var oSrcDoc =  CreateXmlDocument();
	var oSelTR = getSelectedRow();
	if(!oSrcDoc.loadXML(oList.xml)){
		//alert(oSrcDoc.parseError);
		alertParseError(oSrcDoc.parseError);
		return;
	}
	
	//배포처 처리 2005.08 황선희
	if (m_sSelectedRouteType == 'dist'){
		setDistDept(oList);
	}else{
		/*
		//결재선에 중복 사용자 삽입 방지 2005.07 황선희
		if (m_sSelectedUnitType != "ou" &&  m_sApvMode != "SUBREDRAFT" )
		{
			m_oXSLProcessor.input = chkDuplicateApprover(oSrcDoc);
		}else{
			m_oXSLProcessor.input = oSrcDoc;
		}
		*/
		m_oXSLProcessor.input = oSrcDoc;

		//개인 합의는 부서장만 선택한다. 2005.11 황선희
		//일반결재는 개인만 선택한다. 2005.11 황선희
		/* 양식 내 막기
		if ( m_sSelectedRouteType == "consult"){oSrcDoc = chkManagerConsult(oSrcDoc);}
		if ( m_sSelectedRouteType == "approve" ||  m_sSelectedRouteType == "receive" ){oSrcDoc = chkManagerApprove(oSrcDoc);}
		if ( oSrcDoc.selectNodes("//item").length == 0) {
			return;
		}
		*/
		m_oXSLProcessor.input = oSrcDoc;

		try { 
			//맨 처음 elmRoot --> <steps initiatorcode=\"200208\" initiatoroucode=\"2100\" status=\"inactive\"/>	
			var elmRoot = m_oApvList.documentElement;
			var bDivisionSeparate = false;//boolean of division 
			var bSeparate = false;
			var sSeparateLevel = "division/step/ou";
			var elmTarget = null;
			var sVisible = null;
			var refreshTarget = refreshList;
			//alert("m_sSelectedRouteType: " + m_sSelectedRouteType +" m_sApvMode : "+ m_sApvMode);
			switch(m_sSelectedRouteType){
				case "ccinfo":	oSelTR=null;sVisible="";bSeparate=true;refreshTarget=refreshCC;elmTarget=elmRoot;
					//var elmcc=elmRoot.selectSingleNode("ccinfo[@belongto='"+m_sSelectedAllotType+"']");
					//if(elmcc!=null)elmRoot.removeChild(elmcc);
					break;
				case "assist":	if(sVisible==null)sVisible="";
				case "audit":	if(sVisible==null)sVisible="";
//					elmTarget=elmRoot;bSeparate=true;
//					break;
				case "consult":	if(sVisible==null)sVisible="";
//					//elmTarget=elmRoot.selectSingleNode("step[@routetype='"+m_sSelectedRouteType+"' and @unittype='"+m_sSelectedUnitType+"']");
//					//if(elmTarget==null){
//						elmTarget=elmRoot;bSeparate=true;
//					//}else{
//					//	bSeparate=false;
//					//}
//                  수신 부서 내 합의 대비용
					if(m_sApvMode=="REDRAFT"||m_sApvMode=="RECAPPROVAL"){
						elmTarget=m_oCurrentOUNode.selectSingleNode("step[@routetype='"+m_sSelectedRouteType+"' and @unittype='"+m_sSelectedUnitType+"' and taskinfo/@status='inactive']");
                        if(elmTarget==null){
                            elmTarget=m_oCurrentOUNode;bSeparate=true;
                        }else{
                            bSeparate=false; 
                        }
						sSeparateLevel="division/step/ou";
					}else if(m_sApvMode=="SUBREDRAFT"  ||m_sApvMode=="SUBAPPROVAL"){
						elmTarget=m_oCurrentOUNode;
						bSeparate=false;
						sSeparateLevel="division/step/ou/person";
					}else{
                        elmTarget=elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']/step[@routetype='"+m_sSelectedRouteType+"' and @unittype='"+m_sSelectedUnitType+"' and @allottype='"+m_sSelectedAllotType+"'and taskinfo/@status='inactive']");
                       
                        if(elmTarget==null){
                            elmTarget=elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']");bSeparate=true;
                        }else{
                            //부서합의의 경우 순차 및 병렬 합의가 존재한다.
                            if(m_sSelectedRouteType == "consult" && m_sSelectedAllotType == "serial" && m_sSelectedUnitType == "ou"){
                                elmTarget=elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']"); bSeparate=true;
                            //개인헙조의 경우 순차 및 병렬 협조가 존재한다.
                            }else if(m_sSelectedRouteType == "assist" && m_sSelectedAllotType == "serial" && m_sSelectedUnitType == "ou"){
                                elmTarget=elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']"); bSeparate=true;
                            }else{
                                bSeparate=false; 
                            }
                        }
						sSeparateLevel="division/step/ou";
					}
					if(getInfo("scMltStep") == "1"){//다중합의 허용
                            elmTarget=elmRoot.selectSingleNode("division[taskinfo/@status='inactive' or taskinfo/@status='pending']");bSeparate=true;
					}

					break;
				case "receive":	if(sVisible==null)sVisible="";
				    //수신단계별로 div 생성됨
                    if (m_sSelectedDivisionType == 'receive' && m_sSelectedRouteType == 'receive'){
                        if (m_sSelectedUnitType == 'ou'  || ( m_sSelectedUnitType == 'person' && elmRoot.selectSingleNode("division[@divisiontype='"+m_sSelectedDivisionType+"' and taskinfo/@status='inactive']") == null) ){
		                    var oDiv=m_oApvList.createElement("division");
		                    var oTaskinfo = m_oApvList.createElement("taskinfo");
	                        elmRoot.appendChild(oDiv).appendChild(oTaskinfo);
		                    oDiv.setAttribute("divisiontype",m_sSelectedDivisionType);
		                    oDiv.setAttribute("name", m_sSelectedStepRef);
		                    oTaskinfo.setAttribute("status","inactive");
		                    oTaskinfo.setAttribute("kind", m_sSelectedRouteType);
					        elmTarget=oDiv;
					    }else{
					        elmTarget=elmRoot.selectSingleNode("division[@divisiontype='"+m_sSelectedDivisionType+"' and taskinfo/@status='inactive']");
					    }
                    }
					bSeparate=true;
    				break;
				//case "assist":	if(sVisible==null)sVisible="";
				case "review":	if(sVisible==null)sVisible="n";
				case "notify":	if(sVisible==null)sVisible="n";
				    //꼭 수정할 것
					elmTarget=elmRoot.selectSingleNode("division/step[@routetype='"+m_sSelectedRouteType+"' and @unittype='"+m_sSelectedUnitType+"']");
					if(elmTarget==null){
						elmTarget=elmRoot;bSeparate=true;
					}else{
						bSeparate=false;
					}
					break;
				case "approve":	if(sVisible==null)sVisible="";
				default:if(sVisible==null)sVisible="";
					if(m_sApvMode=="REDRAFT"||m_sApvMode=="RECAPPROVAL"){
						elmTarget=m_oCurrentOUNode;bSeparate=true;sSeparateLevel="division/step/ou/person";//bSeparate=false;sSeparateLevel="division/step/ou/person"
					}else if(m_sApvMode=="SUBREDRAFT"  ||m_sApvMode=="SUBAPPROVAL"){
						elmTarget=m_oCurrentOUNode;bSeparate=false;sSeparateLevel="division/step/ou/person";
					}else{
						//elmTarget=elmRoot;bSeparate=true;
			            if (elmRoot.selectSingleNode("division[@divisiontype='"+m_sSelectedDivisionType+"']") == null){
				            var oDiv=m_oApvList.createElement("division");
    			            var oTaskinfo = m_oApvList.createElement("taskinfo");
			                elmRoot.appendChild(oDiv).appendChild(oTaskinfo);
				            oDiv.setAttribute("divisiontype",m_sSelectedDivisionType);
				            oDiv.setAttribute("name", m_sSelectedStepRef);
			                oTaskinfo.setAttribute("status","inactive");
			                oTaskinfo.setAttribute("kind", m_sSelectedRouteType);
			            }
   						elmTarget=elmRoot.selectSingleNode("division");
						bSeparate=true;
					}
					break;
			}
			
			m_oXSLProcessor.addParameter("steptype", m_sSelectedStepType);
			m_oXSLProcessor.addParameter("divisiontype", m_sSelectedDivisionType);

			m_oXSLProcessor.addParameter("unittype", m_sSelectedUnitType);
			m_oXSLProcessor.addParameter("routetype", m_sSelectedRouteType);
			m_oXSLProcessor.addParameter("allottype", m_sSelectedAllotType);
			m_oXSLProcessor.addParameter("referencename", m_sSelectedStepRef);
			m_oXSLProcessor.addParameter("childvisible", sVisible);
			try{m_oXSLProcessor.addParameter("ounametype",parent.menu.gOUNameType)}catch(e){} //부서명 옵션
			try{m_oXSLProcessor.addParameter("splittype",(getInfo("scMltStep") == "1"?"split":""))}catch(e){} //부서명 옵션
			m_oXSLProcessor.transform();
			
			var oTargetDoc =  CreateXmlDocument();
			oTargetDoc.loadXML(m_oXSLProcessor.output);
			//var oChildren = (bSeparate?oTargetDoc.documentElement.childNodes:oTargetDoc.documentElement.selectNodes(sSeparateLevel));
			var oChildren = (bSeparate?oTargetDoc.documentElement.firstChild.childNodes:oTargetDoc.documentElement.selectNodes(sSeparateLevel));//documentElement.firstChild.selectNodes(sSeparateLevel)
			if(m_sSelectedStepType=="ccinfo"){oChildren = oTargetDoc.documentElement.childNodes;}
			var elm=oChildren.nextNode();
			
			var xpathCur;
			var oSelectedElm;
			//alert(m_sSelectedUnitType+'--'+m_sSelectedRouteType +'---'+oTargetDoc.xml);
			while(elm!=null){
                if (m_sSelectedDivisionType == 'receive' && m_sSelectedRouteType == 'receive' && m_sSelectedUnitType == 'ou'){
                    if (elmRoot.selectNodes("division[@divisiontype='"+m_sSelectedDivisionType+"' and taskinfo/@status='inactive']").length > 0){
                    }else{ 
		                var oDiv=m_oApvList.createElement("division");
		                var oTaskinfo = m_oApvList.createElement("taskinfo");
	                    elmRoot.appendChild(oDiv).appendChild(oTaskinfo);
		                oDiv.setAttribute("divisiontype",m_sSelectedDivisionType);
		                oDiv.setAttribute("name", m_sSelectedStepRef);
		                oTaskinfo.setAttribute("status","inactive");
		                oTaskinfo.setAttribute("kind", m_sSelectedRouteType);
					    elmTarget=oDiv;
					}
                }

				elmTarget.appendChild(elm.cloneNode(true));
				elm = oChildren.nextNode();
			}
			//refreshList(m_oApvList);
		}catch(e){
			alert("오류가 발생했습니다. at insertToList in formedit.js\nError Desc:" + e.description);
			//alert(strMsg_030 + "\n at insertToList in ApvlineMgr.js\nError Desc:" + e.description);
		}
	}
    return;
}
function getFamilyAttribute(elmCur,sTargetNode,sAttrName){
	var elmParent = elmCur;
	while(elmParent!=null){
		if(elmParent.nodeName==sTargetNode){
			return elmParent.getAttribute(sAttrName);
		}
		elmParent = elmParent.parentNode;
	}
	return null;
}
//step check
function setStepTaskInfo(bChangeRoutetype, sSelDivisionType, sSelRouteType, xPath){
    //if(bChangeRoutetype){//routetype 변경
        if(sSelRouteType == "approve"){
            //step allottype이 parrelle이 아닌 경우 taskinfo node 삭제
            var elmCurStepTaskInfo = m_oApvList.documentElement.selectSingleNode("division[@divisiontype='"+ sSelDivisionType+"']/step[@routetype='approve' and allottype!='parallel']/taskinfo");
            if(elmCurStepTaskInfo != null){
                m_oApvList.documentElement.removeChild(elmCurStepTaskInfo);
            }else{
                var elmCurStep = m_oApvList.documentElement.selectSingleNode("division[@divisiontype='"+sSelDivisionType+"']/step[@routetype='"+sSelRouteType+"']");
	            elmCurStep.setAttribute("allottype","serial");
            }
        }else{
            //그외 경우 taskinfo가 존재해야
            //var elmCurStepTaskInfo = m_oApvList.documentElement.selectSingleNode("division[@divisiontype='"+ sSelDivisionType+"']/step[@routetype='"+sSelRouteType+"']/taskinfo");
            var elmCurStepTaskInfo = m_oApvList.documentElement.selectSingleNode(xPath +"/taskinfo");
            if(elmCurStepTaskInfo != null){
                //m_oApvList.documentElement.removeChild(elmCurStepTaskInfo);
            }else{
                //var elmCurStep = m_oApvList.documentElement.selectSingleNode("division[@divisiontype='"+sSelDivisionType+"']/step[@routetype='"+sSelRouteType+"']");
                var elmCurStep = m_oApvList.documentElement.selectSingleNode(xPath);
                var elmCurStepTaskInfo = m_oApvList.createElement("taskinfo");
	            elmCurStepTaskInfo.setAttribute("status","inactive");
	            elmCurStepTaskInfo.setAttribute("result","inactive");
	            elmCurStepTaskInfo.setAttribute("kind","normal");
	            var sallottype = "serial";
	            switch(sSelRouteType){
	                case "assist":sallottype=(getInfo("scPCoo")==1?"serial":(getInfo("scPCooPL")==1?"parallel":"serial"));break; 
	                case "consult":sallottype=(getInfo("scPAgr")==1?"parallel":(getInfo("scPAgrSEQ")==1?"serial":"parallel"));break;
	                case "audit":sallottype='serial';break;
	            }
	            elmCurStep.setAttribute("allottype",sallottype);
                var currNode = elmCurStep.insertBefore(elmCurStepTaskInfo, elmCurStep.childNodes.item(0));
            }
        }
    //}
}
function requestHTTPXSL(sMethod, sUrl, bAsync, sCType, pCallback, vBody) {
    m_xmlHTTPXSL.open(sMethod, sUrl, bAsync);
    m_xmlHTTPXSL.setRequestHeader("Accept-Language", g_szAcceptLang);
    m_xmlHTTPXSL.setRequestHeader("Content-type", sCType);
    if (pCallback != null) m_xmlHTTPXSL.onreadystatechange = pCallback;
    (vBody != null) ? m_xmlHTTPXSL.send(vBody) : m_xmlHTTPXSL.send();
}


