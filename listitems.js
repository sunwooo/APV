var m_xmlHTTP=CreateXmlHttpRequest();
var m_xmlHTTPXSL = CreateXmlHttpRequest();
var m_objXML=CreateXmlDocument();
var bState = "";
var g_szAcceptLang="ko";
var L_idsSearcing_Text="Loading...";
var L_idsSearcing_IMG="<img src='"+ g_imgBasePath+ "/Covi/Common/icon/loading.gif' align='absmiddle'/>";
var L_idsUnknownError_Text="Unknown Error";
var g_eGalTable;
var g_eErrorDiv;
var g_eCurrentRow;
var g_objXmlSelectedWorkItem=null;
var m_objRowLastSelected=null;
var m_objRowRange=null;
var UP=0;
var DOWN=1;
var truthBeTold;
var pagecnt = 10;
var g_totalpage = "";
var g_totalcount = "";
var g_pagecount = "1";
var g_querysize = "";
var g_orderfield = "";
var g_orderdesc = "";
var temp_querysize = "";
var gGubun="";
var d_QSDATE = "";
var d_QEDATE = "";

var PF_PERFORMER_ID="";
var USER_ID="";
var PF_SUB_KIND="";
var PI_FINISHED="";
var PI_NAME= "";
var PAGENUM= "";
var PAGECNT= "";
var QUERYSIZE= "";	
var GROUP_KIND= "";
var ORDERFILED="";			
var ORDERDESC="";	
var PI_INITIATOR_NAME="";
var PI_ETC= "";
var WI_STATE="";
var PI_STATE="";
var PF_STATE = "";
var MODE="";
var GUBUN ;
var TITLE;

window.onload = initOnload;
function initOnload() {
	//debugger
	g_eErrorDiv = window.document.getElementById("divErrorMessage");
	clearContents();
	queryGetData();
}
function getSearchValue()
{
	var searchValue = gGubun+";"+TITLE+";"+d_QSDATE+";"+d_QEDATE;
	return searchValue;
}
function queryGetData(){//debugger;
	if (temp_querysize=="0" || temp_querysize=="" )
		g_querysize=pagecnt;
	else
		g_querysize=temp_querysize;
		
	if ( page == "") { page = 1;}
	
	var szURL = null;

	var aryOrder = new String();
	aryOrder = gOrder.split(";");	
	
	if (aryOrder.length>1){
		g_orderfield = aryOrder[1];
		g_orderdesc = aryOrder[0];
	}	
	PF_PERFORMER_ID="";
	USER_ID="";
	PF_SUB_KIND="";
	PI_FINISHED="";
	PAGENUM= page;
	PAGECNT= pagecnt;
	QUERYSIZE= g_querysize;	
	GROUP_KIND= kind;
	//TITLE= gTitle;//toUTF8(gTitle);
	ORDERFILED=g_orderfield;			
	ORDERDESC=g_orderdesc;	
	WI_STATE=528;
	PI_STATE=528;
	PF_STATE = "1";
	MODE = gLocation;

	GUBUN=gGubun;
	TITLE = gSearch;
	var connectionname = "INST_ConnectionString";
	if (bArchived) connectionname = "INST_ARCHIVE_ConnectionString";
	if (bstored) connectionname = "STORE_ConnectionString";
	if (parent.fldrName != '') PI_FINISHED = parent.fldrName;
	var pXML =null ;
	var aXML = "";
	if (TITLE=="")TITLE=gTitle;
	var strBox = '';  
    //debugger;
	if (admintype == "MONITOR"){
	    var sLocation;
	    if (parent.location.href.toUpperCase().indexOf("LISTAUDIT.ASPX") > -1) {
	        switch (gLocation) {
	            case "PROCESS":
	            case "REJECT":
	            case "COMPLETE":
	                if (pXML == null) pXML = "exec dbo.usp_wf_worklistquery01monitor ";
	                if (sLocation == null) sLocation = gLocation;
	                PF_SUB_KIND = 'T006';
	                PF_PERFORMER_ID = uid;
	                switch (sLocation) {
	                    case "PROCESS": WI_STATE = '528'; PI_STATE = '288'; break;
	                    case "COMPLETE": WI_STATE = '528'; PI_STATE = '528'; break;
	                    case "REJECT": WI_STATE = '528'; PI_STATE = '528'; break;
	                }
	                MODE = sLocation;

	                pXML = pXML.replace("exec ", "");
	                aXML = "<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_PERFORMER_ID + "]]></value></param>";
	                aXML += "<param><name>WI_STATE</name><type>varchar</type><length>256</length><value><![CDATA[" + WI_STATE + "]]></value></param>";
	                aXML += "<param><name>PI_STATE</name><type>varchar</type><length>256</length><value><![CDATA[" + PI_STATE + "]]></value></param>";
	                aXML += "<param><name>MODE</name><type>varchar</type><length>256</length><value><![CDATA[" + MODE + "]]></value></param>";
	                aXML += "<param><name>PI_NAME</name><type>nvarchar</type><length>1024</length><value><![CDATA[" + PI_NAME + "]]></value></param>";
	                aXML += "<param><name>PI_INITIATOR_NAME</name><type>nvarchar</type><length>256</length><value><![CDATA[" + PI_INITIATOR_NAME + "]]></value></param>";
	                aXML += "<param><name>PI_ETC</name><type>nvarchar</type><length>256</length><value><![CDATA[" + PI_ETC + "]]></value></param>";
	                aXML += "<param><name>pagenum</name><type>int</type><length>4</length><value><![CDATA[" + PAGENUM + "]]></value></param>";
	                aXML += "<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA[" + PAGECNT + "]]></value></param>";
	                aXML += "<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA[" + QUERYSIZE + "]]></value></param>";
	                aXML += "<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA[" + GROUP_KIND + "]]></value></param>";
	                aXML += "<param><name>TITLE</name><type>nvarchar</type><length>256</length><value><![CDATA[" + TITLE + "]]></value></param>";
	                aXML += "<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERFILED + "]]></value></param>";
	                aXML += "<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERDESC + "]]></value></param>";
	                aXML += "<param><name>startdate</name><type>varchar</type><length>10</length><value><![CDATA[" + startdate + "]]></value></param>";
	                break;
	        }
	    } else if (parent.location.href.toUpperCase().indexOf("LISTDEPTAUDIT.ASPX") > -1) {
	        //2010.11 yu2mi : 감사함 변경 작업
	        d_QSDATE = parent.document.getElementById("QSDATE").value.replace(/-/g, "");
	        d_QEDATE = parent.document.getElementById("SEARCHDATE").value.replace(/-/g, "");
	        var FORM_NAME = parent.document.getElementById("sel_Form").value;


	        if (pXML == null) {
	            pXML = "exec dbo.usp_wf_worklistquery01deptaudit ";
	        }
	        PF_PERFORMER_ID = uid;

	        pXML = pXML.replace("exec ", "");
	        aXML = "<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_PERFORMER_ID + "]]></value></param>";
	        aXML += "<param><name>GUBUN</name><type>varchar</type><length>50</length><value><![CDATA[" + gGubun + "]]></value></param>";
	        aXML += "<param><name>TITLE</name><type>varchar</type><length>1024</length><value><![CDATA[" + TITLE + "]]></value></param>";
	        aXML += "<param><name>FORM_NAME</name><type>varchar</type><length>128</length><value><![CDATA[" + FORM_NAME + "]]></value></param>";
	        aXML += "<param><name>pagenum</name><type>int</type><length>4</length><value><![CDATA[" + PAGENUM + "]]></value></param>";
	        aXML += "<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA[" + PAGECNT + "]]></value></param>";
	        aXML += "<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA[" + QUERYSIZE + "]]></value></param>";
	        aXML += "<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERFILED + "]]></value></param>";
	        aXML += "<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERDESC + "]]></value></param>";
	        aXML += "<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QSDATE + "]]></value></param>";
	        aXML += "<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QEDATE + "]]></value></param>";		    
	    }	
	}else{
		if( gLocation == "DEPART"){
			strBox = uid.substring(uid.lastIndexOf("_")+1);
			var strDeptID = uid.substring(0,uid.lastIndexOf("_"));
			PF_SUB_KIND = uid.substring(uid.lastIndexOf("_")+1);
			PF_PERFORMER_ID = strDeptID;
			//debugger;
			switch (strBox){
				case "A": //품의함 (부서함)
					pXML = "exec dbo.usp_wf_worklistdeptquery01A "; break;
				case "R"://수신함
					pXML = "exec dbo.usp_wf_worklistdeptquery01R "; break;
				case "RC"://부서접수완료함-수신함
					pXML = "exec dbo.usp_wf_worklistdeptquery01RC "; break;
				case "C": //부서함
				  PF_SUB_KIND='C';pXML = "exec dbo.usp_wf_worklistdeptquery01C "; break;
				case "S": //발신함
					PF_SUB_KIND = 'S'; pXML = "exec dbo.usp_wf_worklistdeptquery01S "; break;
				case "SS": //완료함 (부서함, 발신함, 수신처리함) 통합 , 2010.04.15 한송이
					PF_SUB_KIND = 'SS'; pXML = "exec dbo.usp_wf_worklistdeptquery01SS "; break;			
				case "E"://접수함
				  PF_SUB_KIND='E';pXML = "exec dbo.usp_wf_worklistdeptquery01E "; break;			
				case "I"://참조함
				  PF_SUB_KIND='I';pXML = "exec dbo.usp_wf_worklistdeptquery01I "; break;			
				case "D"://회람수신함 (참조/회람함)
				  PF_SUB_KIND='D';pXML = "exec dbo.usp_wf_worklistdeptquery01D "; break;
				case "AD": //감사할 문서함
				  PF_SUB_KIND='AD';pXML = "exec dbo.usp_wf_worklistdeptquery01AD ";break;				  			
			}			
			if (GUBUN != '' || GROUP_KIND != '' || TITLE!= '' || ORDERFILED != '' || ORDERDESC !='' || d_QSDATE !=''){
				pXML = "exec dbo.usp_wf_worklistdeptquery01 ";
			}	   
			pXML = pXML.replace("exec ","");
			aXML="<param><name>PF_PERFORMER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+PF_PERFORMER_ID+"]]></value></param>";
			aXML+="<param><name>WI_STATE</name><type>varchar</type><length>256</length><value><![CDATA["+WI_STATE+"]]></value></param>";
			aXML+="<param><name>PI_STATE</name><type>varchar</type><length>256</length><value><![CDATA["+PI_STATE+"]]></value></param>";
			aXML+="<param><name>MODE</name><type>varchar</type><length>256</length><value><![CDATA["+MODE+"]]></value></param>";
			aXML+="<param><name>pagenum</name><type>varchar</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
			aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
			aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
			aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
			aXML+="<param><name>TITLE</name><type>nvarchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
			aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
			aXML+="<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERDESC+"]]></value></param>";
			aXML+="<param><name>PI_FINISHED</name><type>varchar</type><length>256</length><value><![CDATA["+PI_FINISHED+"]]></value></param>";
			aXML+="<param><name>PF_SUB_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+PF_SUB_KIND+"]]></value></param>";
			//기간 검색을 위한 파라미터 추가
			aXML+="<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA["+GUBUN+"]]></value></param>";
			aXML+="<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QSDATE+"]]></value></param>";
			aXML+="<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QEDATE+"]]></value></param>";				
	  		if (strBox == "D"){//회람수신함
	   			pXML = "exec dbo.usp_wfform_tonccquery01 ";
				connectionname = "FORM_DEF_ConnectionString";
				if ( PI_NAME != '' || PI_INITIATOR_NAME!='' || PI_ETC != '' || GROUP_KIND != '' || TITLE!= '' || ORDERFILED != '' || ORDERDESC !=''){
					pXML = "exec dbo.usp_wfform_tonccquery01_dynamic ";
				}

				PF_PERFORMER_ID = PF_PERFORMER_ID;
				var PF_PERFORMER_DEPT_ID = PF_PERFORMER_ID;
						 		
				pXML = pXML.replace("exec ","");
				aXML="<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+PF_PERFORMER_ID+"]]></value></param>";
				aXML+="<param><name>DEPT_ID</name><type>varchar</type><length>1024</length><value><![CDATA["+PF_PERFORMER_DEPT_ID+"]]></value></param>";
				//aXML+="<param><name>SUBJECT</name><type>varchar</type><length>1024</length><value><![CDATA["+PI_NAME+"]]></value></param>";
				aXML += "<param><name>SUBJECT</name><type>nvarchar</type><length>1024</length><value><![CDATA[" + TITLE + "]]></value></param>";
				aXML+="<param><name>pagenum</name><type>int</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
				aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
				aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
				aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
				aXML+="<param><name>TITLE</name><type>nvarchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
				aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
				aXML+="<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERDESC+"]]></value></param>";
	  		}
		}else{//debugger;
			var sLocation;
			switch (gLocation){
				case "PREAPPROVAL":	if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01preapproval ";
				case "APPROVAL":	if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01approval ";
				case "CONSULT":		if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01consult ";
				case "PROCESS": if (pXML == null) pXML = "exec dbo.usp_wf_worklistquery01process ";
				case "TODO": if (pXML == null) pXML = "exec dbo.usp_wf_worklistquery01todo ";
				case "CANCEL":		if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01cancel ";
				case "REJECT":	    if (pXML == null) pXML = "exec dbo.usp_wf_worklistquery01reject ";
				case "CCINFO":		if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01ccinfo ";
				case "REVIEW1":		if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01review1 ";
				case "REVIEW2":		if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01review2 ";
				case "REVIEW3":		if(pXML==null)pXML = "exec dbo.usp_wf_worklistquery01review3 ";
				case "COMPLETE": if (pXML == null) pXML = "exec dbo.usp_wf_worklistquery01complete ";
				case "SHARE": if (pXML == null) pXML = "exec dbo.usp_wf_worklistquery01share "; //gLabel = "받은일자";
				case "FINISH": if (pXML == null) pXML = "exec dbo.usp_wf_worklistquery01finish ";	
					if(sLocation==null) sLocation = gLocation;
	            case "JOBFUNCTION":
	                var strBox = uid.substring(uid.lastIndexOf("_") + 1);
	                var strDeptID = uid.substring(0, uid.lastIndexOf("_"));
	                PF_PERFORMER_ID = strDeptID;

	                switch (strBox) {
	                    case "SP": //특정부서함
	                        pXML = "exec dbo.usp_wf_worklistdeptquery01SP "; break;
	                    default:
	                        PF_SUB_KIND = 'T008';
	                        if (pXML == null) pXML = "exec dbo.usp_wf_worklistquery01general ";
	                        if (gLocation == "JOBFUNCTION") {
	                            PF_PERFORMER_ID = strDeptID; //toUTF8(strDeptID);
	                            gLocationMode = strBox;
	                        } else {
	                            PF_PERFORMER_ID = uid;
	                        }
	                        //201107 공문게시
	                        if (PF_PERFORMER_ID == "APVBOARD") {
	                            pXML = "exec dbo.usp_wf_worklistquery01apvboard ";
	                        }
	                        if (sLocation == null) {
	                            sLocation = gLocationMode;
	                            switch (sLocation) {
	                                case "APPROVAL": WI_STATE = '288'; PI_STATE = '288'; break;
	                                case "PROCESS": WI_STATE = '528'; PI_STATE = '288'; break;
	                                case "COMPLETE": WI_STATE = '528'; PI_STATE = '528'; break;
	                                case "REJECT": WI_STATE = '528'; PI_STATE = '528'; break;
	                            }
	                        }
	                        MODE = sLocation;
	                        break;
	                }

	                if (gLocation == "JOBFUNCTION") {
	                    if (GUBUN != '' || GROUP_KIND != '' || TITLE != '' || ORDERFILED != '' || ORDERDESC != '') {
	                        pXML = "exec dbo.usp_wf_worklistquery01general_dynamic ";
	                        //201107 공문게시
	                        if (PF_PERFORMER_ID == "APVBOARD") {
	                            pXML = "exec dbo.usp_wf_worklistquery01apvboard_dynamic ";
	                            //PF_PERFORMER_ID = parent.userid;
	                        }
	                    }
	                } else {
	                    if (GUBUN != '' || GROUP_KIND != '' || TITLE != '' || ORDERFILED != '' || ORDERDESC != '' || d_QSDATE != '') {
	                        pXML = "exec dbo.usp_wf_worklistquery01 ";
	                    } else {
	                        if (gLocation.indexOf("REVIEW") > -1) {
	                            MODE = "REVIEW";
	                        }
	                    }
	                }
	                pXML = pXML.replace("exec ", "");
	                //201107 공문게시
	                if (PF_PERFORMER_ID == "APVBOARD") {
	                    PF_PERFORMER_ID = parent.userid;
	                }
	                //debugger; //ㅋ
	                aXML = "<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_PERFORMER_ID + "]]></value></param>";
	                if (gLocation == "JOBFUNCTION") {
	                    aXML += "<param><name>PF_SUB_KIND</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_SUB_KIND + "]]></value></param>";
	                    aXML += "<param><name>PF_STATE</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_STATE + "]]></value></param>";
	                }
	                aXML += "<param><name>WI_STATE</name><type>varchar</type><length>256</length><value><![CDATA[" + WI_STATE + "]]></value></param>";
	                aXML += "<param><name>PI_STATE</name><type>varchar</type><length>256</length><value><![CDATA[" + PI_STATE + "]]></value></param>";
	                aXML += "<param><name>MODE</name><type>varchar</type><length>256</length><value><![CDATA[" + MODE + "]]></value></param>";
	                aXML += "<param><name>pagenum</name><type>int</type><length>4</length><value><![CDATA[" + PAGENUM + "]]></value></param>";
	                aXML += "<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA[" + PAGECNT + "]]></value></param>";
	                aXML += "<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA[" + QUERYSIZE + "]]></value></param>";
	                aXML += "<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA[" + GROUP_KIND + "]]></value></param>";
	                aXML += "<param><name>TITLE</name><type>nvarchar</type><length>256</length><value><![CDATA[" + TITLE + "]]></value></param>";
	                aXML += "<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERFILED + "]]></value></param>";
	                aXML += "<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERDESC + "]]></value></param>";
	                //기간 검색을 위한 파라미터 추가
	                aXML += "<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA[" + GUBUN + "]]></value></param>";
	                aXML += "<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QSDATE + "]]></value></param>";
	                aXML += "<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QEDATE + "]]></value></param>";
	                if (bstored) { aXML += "<param><name>PI_FINISHED</name><type>nvarchar</type><length>256</length><value><![CDATA[" + PI_FINISHED + "]]></value></param>"; }

	                break;
				case "TEMPSAVE":
					MODE = "TEMPSAVE";
					if(pXML==null)pXML = "exec dbo.usp_wfform_tempsavequery01 ";
					connectionname = "FORM_DEF_ConnectionString";
					PF_PERFORMER_ID = uid;
					
					//pXML += "'" + PF_PERFORMER_ID + "','" + PI_NAME + "','" + PAGENUM + "','" + PAGECNT + "','" + QUERYSIZE + "','" + GROUP_KIND + "','" + TITLE + "','" + ORDERFILED + "','" + ORDERDESC +"'";
					//exec sp_wfform_tempsavequery01 @USER_ID, @SUBJECT, @PAGENUM, @PAGECNT, @QUERYSIZE, @GROUP_KIND, @TITLE, @ORDERFILED, @ORDERDESC
					pXML = pXML.replace("exec ","");
					aXML="<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+PF_PERFORMER_ID+"]]></value></param>";
					aXML+="<param><name>SUBJECT</name><type>varchar</type><length>1024</length><value><![CDATA["+TITLE+"]]></value></param>";
					aXML+="<param><name>pagenum</name><type>int</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
					aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
					aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
					aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
					aXML+="<param><name>TITLE</name><type>nvarchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
					aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
					aXML+="<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERDESC+"]]></value></param>";
					break;
				//<유미
				case "TCINFO":	//수신/참조함
			   		if(pXML==null)pXML = "exec dbo.usp_wfform_tonccquery01 ";
					connectionname = "FORM_DEF_ConnectionString";
					if ( PI_NAME != '' || PI_INITIATOR_NAME!='' || PI_ETC != '' || GROUP_KIND != '' || TITLE!= '' || ORDERFILED != '' || ORDERDESC !=''){
						pXML = "exec dbo.usp_wfform_tonccquery01_dynamic ";
					}

					PF_PERFORMER_ID = uid;
					var PF_PERFORMER_DEPT_ID = "";//gDept;
					//pXML += " @USER_ID=N'" + PF_PERFORMER_ID + "',@DEPT_ID='" + PF_PERFORMER_DEPT_ID + "',@SUBJECT='" + PI_NAME + "',@pagenum=" + PAGENUM + ",@page_size=" + PAGECNT + ",@query_size=" + QUERYSIZE + ",@GROUP_KIND=N'" + GROUP_KIND + "',@TITLE=N'" + TITLE + "',@order_field=N'" + ORDERFILED + "',@order_desc=N'" + ORDERDESC +"'";
					pXML = pXML.replace("exec ","");
					aXML="<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+PF_PERFORMER_ID+"]]></value></param>";
					aXML+="<param><name>DEPT_ID</name><type>varchar</type><length>1024</length><value><![CDATA["+PF_PERFORMER_DEPT_ID+"]]></value></param>";
					//aXML+="<param><name>SUBJECT</name><type>varchar</type><length>1024</length><value><![CDATA["+PI_NAME+"]]></value></param>";
					aXML += "<param><name>SUBJECT</name><type>varchar</type><length>1024</length><value><![CDATA[" + TITLE + "]]></value></param>";
					aXML+="<param><name>pagenum</name><type>int</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
					aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
					aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
					aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
					aXML+="<param><name>TITLE</name><type>nvarchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
					aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
					aXML+="<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERDESC+"]]></value></param>";
					break;
				case "UFOLDER":	//사용자 정의 폴더
				case "GARBAGE":	//사용자 정의 폴더			
					connectionname = "FORM_DEF_ConnectionString";
					PF_PERFORMER_ID = uid;
					var PF_PERFORMER_DEPT_ID = gDept;
					if(parent.foldermode == "I"){
						pXML = "dbo.usp_wfform_userfolderquery02";//dbo.usp_wfform_folder
						aXML="<param><name>userid</name><type>varchar</type><length>256</length><value><![CDATA["+PF_PERFORMER_ID+"]]></value></param>";
						aXML+="<param><name>pagenum</name><type>int</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
						aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
					}else{
	   					if ( pXML==null) pXML = "exec dbo.usp_wfform_userfolderquery01 ";
						if ( PI_NAME != '' || PI_INITIATOR_NAME!='' || PI_ETC != '' || GROUP_KIND != '' || TITLE!= '' || ORDERFILED != '' || ORDERDESC !=''){
								pXML = "exec dbo.usp_wfform_userfolderquery01_dynamic ";
						}		
						
						pXML = pXML.replace("exec ","");
						aXML="<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+PF_PERFORMER_ID+"]]></value></param>";
						aXML+="<param><name>DEPT_ID</name><type>varchar</type><length>1024</length><value><![CDATA["+PF_PERFORMER_DEPT_ID+"]]></value></param>";
//						aXML+="<param><name>SUBJECT</name><type>varchar</type><length>1024</length><value><![CDATA["+PI_NAME+"]]></value></param>";
                        //aXML+="<param><name>SUBJECT</name><type>varchar</type><length>1024</length><value><![CDATA["+TITLE+"]]></value></param>";
						aXML+="<param><name>pagenum</name><type>int</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
						aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
						aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
						aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
						aXML+="<param><name>TITLE</name><type>nvarchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
						aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
						aXML+="<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERDESC+"]]></value></param>";
						aXML+="<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA["+GUBUN+"]]></value></param>";	
					}					
					break;
				case "FOLDER":	//분류별
					var strBox = uid.substring(uid.lastIndexOf("_")+1);
					var strDeptID = uid.substring(0,uid.lastIndexOf("_"));
					PF_PERFORMER_ID = strDeptID;
					
	   				if(pXML==null)pXML = "exec dbo.usp_wf_worklistdocboxquery01Forder ";
	   				if (GUBUN != '' || GROUP_KIND != '' || TITLE!= '' || ORDERFILED != '' || ORDERDESC !='' || d_QSDATE !=''){
						pXML = "exec dbo.usp_wf_worklistdocboxquery01Forder_dynamic ";
					}else if(PF_PERFORMER_ID =="")
	   				{
	   					pXML = "exec dbo.usp_wf_worklistdocboxquery01ForderAll ";
	   				}
								
					pXML = pXML.replace("exec ","");
					aXML="<param><name>PF_PERFORMER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+PF_PERFORMER_ID+"]]></value></param>";
					aXML+="<param><name>pagenum</name><type>varchar</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
					aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
					aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
					aXML+="<param><name>DOC_FOLDER</name><type>varchar</type><length>256</length><value><![CDATA["+strBox+"]]></value></param>";
					aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
					aXML+="<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERDESC+"]]></value></param>";
					aXML+="<param><name>PI_FINISHED</name><type>varchar</type><length>256</length><value><![CDATA["+PI_FINISHED+"]]></value></param>";
					aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
					aXML+="<param><name>TITLE</name><type>nvarchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
					aXML+="<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA["+GUBUN+"]]></value></param>";	
					aXML+="<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QSDATE+"]]></value></param>";
					aXML+="<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QEDATE+"]]></value></param>";
					
					var sEnt_code = parent.sEntCode;
					if(parent.sEntCode == null) sEnt_code = sEntCode;
					aXML+="<param><name>ent_code</name><type>varchar</type><length>256</length><value><![CDATA["+sEnt_code+"]]></value></param>";
					break;
				case "GROUP":	//수신처별
					var strBox = uid.substring(uid.indexOf("_")+1);
					var strDeptID = uid.substring(0,uid.indexOf("_"));
					PF_PERFORMER_ID = strDeptID;
					
	   				if(pXML==null)pXML = "exec dbo.usp_wf_worklistdocboxquery01Group ";
	   				if (GUBUN != '' || GROUP_KIND != '' || TITLE!= '' || ORDERFILED != '' || ORDERDESC !='' || d_QSDATE !=''){
						pXML = "exec dbo.usp_wf_worklistdocboxquery01Group_dynamic ";
					}
								
					pXML = pXML.replace("exec ","");
					aXML="<param><name>PF_PERFORMER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+strBox+"]]></value></param>";
					aXML+="<param><name>pagenum</name><type>varchar</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
					aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
					aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
					aXML+="<param><name>UNIT_CODE</name><type>varchar</type><length>256</length><value><![CDATA["+PF_PERFORMER_ID+"]]></value></param>";
					aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
					aXML+="<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERDESC+"]]></value></param>";
					aXML+="<param><name>PI_FINISHED</name><type>varchar</type><length>256</length><value><![CDATA["+PI_FINISHED+"]]></value></param>";
					aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
					aXML+="<param><name>TITLE</name><type>nvarchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
					aXML+="<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA["+GUBUN+"]]></value></param>";	
					aXML+="<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QSDATE+"]]></value></param>";
					aXML+="<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QEDATE+"]]></value></param>";
					break;
	            case "REVIEW4": //회람문서함 (2012-12-03 HIW)
	                PF_PERFORMER_ID = uid;
	                var PF_PERFORMER_DEPT_ID = ""; //gDept;

	                if (pXML == null) pXML = "exec dbo.usp_wfform_circulationSendlist ";
	                connectionname = "FORM_DEF_ConnectionString";
	                if (PI_NAME != '' || PI_INITIATOR_NAME != '' || PI_ETC != '' || GROUP_KIND != '' || TITLE != '' || ORDERFILED != '' || ORDERDESC != '') {
	                    //pXML = "exec dbo.usp_wfform_circulationSendlist_dynamic ";
	                    pXML = "exec dbo.usp_wfform_circulationSendlist ";
	                }

	                PF_PERFORMER_ID = uid;
	                var PF_PERFORMER_DEPT_ID = ""; //gDept;

	                pXML = pXML.replace("exec ", "");
	                aXML = "<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_PERFORMER_ID + "]]></value></param>";
	                aXML += "<param><name>pagenum</name><type>varchar</type><length>4</length><value><![CDATA[" + PAGENUM + "]]></value></param>";
	                aXML += "<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA[" + PAGECNT + "]]></value></param>";
	                aXML += "<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA[" + QUERYSIZE + "]]></value></param>";
	                aXML += "<param><name>UNIT_CODE</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_PERFORMER_ID + "]]></value></param>";
	                aXML += "<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERFILED + "]]></value></param>";
	                aXML += "<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERDESC + "]]></value></param>";
	                aXML += "<param><name>PI_FINISHED</name><type>varchar</type><length>256</length><value><![CDATA[" + PI_FINISHED + "]]></value></param>";
	                aXML += "<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA[" + GROUP_KIND + "]]></value></param>";
	                aXML += "<param><name>TITLE</name><type>nvarchar</type><length>256</length><value><![CDATA[" + TITLE + "]]></value></param>";
	                aXML += "<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA[" + GUBUN + "]]></value></param>";
	                aXML += "<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QSDATE + "]]></value></param>";
	                aXML += "<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QEDATE + "]]></value></param>";
	                break;
			}
		}
	}
	var strXSLFile;
	//debugger;
	switch(gLocation){
		case "DEPART":
			strBox = uid.substring(uid.lastIndexOf("_")+1);
			switch (strBox){
				case "R":   //부서수신함
				case "AD"://감사할문서함 
					strXSLFile = "wf_worklistquerydeptr01.xsl"; break;
				case "D"://회람수신함 (참조/회람함)
					strXSLFile = "Circulation\\wfform_tonccquery02.xsl"; break;
				default:strXSLFile = "wf_worklistquery02.xsl"; 
			}
			break;
		case "TEMPSAVE":strXSLFile = "TempSave\\wfform_tempsavequery02.xsl";break;
		case "TCINFO":strXSLFile = "Circulation\\wfform_tonccquery02.xsl";break;
		case "UFOLDER":
			if(parent.foldermode == "I"){
				strXSLFile = "wf_worklistquery01folders01.xsl";
			}else{
				strXSLFile = "wf_worklistquery01folder01.xsl";
			}
            break;
        case "REVIEW4":  //회람문서함 (2012-12-03 HIW)
            strXSLFile = "Circulation\\wfform_tonccquery03.xsl";
            break;
		default:strXSLFile = "wf_worklistquery02.xsl"; 
	}	
	
	var sXML = "<Items><connectionname>" + connectionname + "</connectionname><xslpath><![CDATA[" + strXSLFile + "]]></xslpath><sql><![CDATA[" + pXML + "]]></sql><datetitle><![CDATA[" + gLabel + "]]></datetitle><gLocation>" + gLocation + "</gLocation><foldermode><![CDATA[" + parent.foldermode + "]]></foldermode></Items>";
	if(aXML != "")
	{
		sXML = "<Items><connectionname>" + connectionname + "</connectionname><xslpath><![CDATA[" + strXSLFile + "]]></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>" + aXML + "<datetitle><![CDATA[" + gLabel + "]]></datetitle><gLocation>" + gLocation + "</gLocation><foldermode><![CDATA[" + parent.foldermode + "]]></foldermode><strBox>" + strBox + "</strBox></Items>";
	}//var szURL = "getXMLQuery.aspx";//doProgressIndicator(true);//requestHTTP("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTP, sXML);
	var szURL = "getXMLList.aspx?admintype=" + admintype;
	doProgressIndicator(true);
	
	requestHTTP("POST", szURL, true, "text/xml; charset=utf-8", receiveHTTPList, sXML);
}

function requestHTTP(sMethod, sUrl, bAsync, sCType, pCallback, vBody) {
//debugger
	m_xmlHTTP.open(sMethod,sUrl,bAsync);	
	m_xmlHTTP.setRequestHeader("Content-type", sCType);
	if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
	
}
function requestHTTPXSL(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	m_xmlHTTPXSL.open(sMethod,sUrl,bAsync);
	m_xmlHTTPXSL.setRequestHeader("Accept-Language",g_szAcceptLang);
	m_xmlHTTPXSL.setRequestHeader("Content-type", sCType);
	if(pCallback!=null)m_xmlHTTPXSL.onreadystatechange = pCallback;
	(vBody!=null)?m_xmlHTTPXSL.send(vBody):m_xmlHTTPXSL.send();
}
function receiveHTTP(){	
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		var xmlReturn=m_xmlHTTP.responseXML;
		if(xmlReturn.xml==""){
			alert(m_xmlHTTP.responseText);
		}else{
			var errorNode=xmlReturn.selectSingleNode("response/error");
			if(errorNode!=null){
				alert("Desc: " + errorNode.text);
			}
			else{
				var m_oXSLProcessor, strXSLFile;
				var aXML = "";
			
				switch(gLocation){
					case "DEPART":
						//var 3 = uid.substring(uid.length-1);
						var strBox = uid.substring(uid.lastIndexOf("_")+1);
						switch (strBox){
//							case "S":
//								strXSLFile = "wf_worklistquerydepts.xsl"; //부서발신함 
//								break;
							case "R":   //부서수신함
							case "AD":
								strXSLFile = "wf_worklistquerydeptr.xsl"; //감사할문서함 
								break;
							case "D":
								strXSLFile = "Circulation/wfform_tonccquery02.xsl"; //회람수신함 (참조/회람함)
								break;
							default:
								strXSLFile = "wf_worklistquery01.xsl";
						}
						break;
					case "TEMPSAVE":
						strXSLFile = "TempSave/wfform_tempsavequery01.xsl";
						break;
					case "TCINFO":
						strXSLFile = "Circulation/wfform_tonccquery01.xsl";
						break;
					case "UFOLDER":
							if(parent.foldermode == "I"){
							strXSLFile = "wf_worklistquery01folders.xsl";
						}else{
							strXSLFile = "wf_worklistquery01folder.xsl";
						}
						break;
					default:
						strXSLFile = "wf_worklistquery01.xsl"; 
				}
				
				m_oXSLProcessor = makeProcessorScript(strXSLFile);//alert(527);
				
				if ( page == "") { page = 1;}
				
				aXML+="<param><name>iPage</name><value><![CDATA["+page+"]]></value></param>";
				aXML+="<param><name>iPageSize</name><value><![CDATA["+pagecnt+"]]></value></param>";
				
				var sXML = "<Items><xml><![CDATA[" + m_xmlHTTP.responseXML.xml + "]]></xml><xslxml><![CDATA[" + m_oXSLProcessor + "]]></xslxml>"+aXML+"</Items>" ;
			
				var szURL = "getXMLXslParsing.aspx";

				requestHTTPXSL("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTPXSL, sXML);
			}
		}
	}
}
function receiveHTTPXSL(){	
	if(m_xmlHTTPXSL.readyState==4){
		m_xmlHTTPXSL.onreadystatechange=event_noop;
		var xmlReturn=m_xmlHTTPXSL.responseXML;
		
		if (m_xmlHTTPXSL.responseText.charAt(0) == '\r') {
			alert(m_xmlHTTPXSL.responseText);
		}
		else
		{
			if(xmlReturn!=null){
				m_objXML.loadXML(xmlReturn.documentElement.xml);
				processXml();
			}
		}
	}
}
function receiveHTTPXSL2(){
	if (m_xmlHTTPXSL.readyState == 4) {
	
		m_xmlHTTPXSL.onreadystatechange=event_noop;
		var xmlReturn=m_xmlHTTPXSL.responseXML;
		
		if (m_xmlHTTPXSL.responseText.charAt(0) == '\r') {
			alert(m_xmlHTTPXSL.responseText);
		}
		else
		{	
			m_objXML.loadXML(xmlReturn.documentElement.xml);		   
			document.getElementById("divGalTable").innerHTML = m_objXML.xml;//alert(572);
			g_eGalTable = window.document.getElementById("tblGalInfo");

			if(window.addEventListener){
				g_eGalTable.addEventListener("mousedown", event_GalTable_onmousedown, false);
				//g_eGalTable.addEventListener("dblclick", event_GalTable_ondblclick, false);
			}else{	   
				g_eGalTable.attachEvent("onmousedown", event_GalTable_onmousedown);
				//g_eGalTable.attachEvent("ondblclick", event_GalTable_ondblclick);	
			}
		   
		  //한번클릭으로 문서 오픈
		  //g_eGalTable.attachEvent("onmouseup",event_GalTable_onmousedown);
		  if (gOrder != '')
			{
				var aOrder=gOrder.split(";");
				document.getElementById('span'+aOrder[1]).innerHTML = '<img src="'+ g_imgBasePath+ '/Covi/common/icon/blt_07_'+aOrder[0]+'.gif" align="absmiddle">';
			}

			//미결,진행 진행 바 표현
			if (gLocation == "APPROVAL" || gLocation == "PROCESS" || (gLocation=="JOBFUNCTION" && (gLocationMode=="APPROVAL" || gLocationMode=="PROCESS" ) )){
				document.getElementById("thST").style.display = "";
				if (g_totalcount > 0 ){
					for (var x=1; x < g_eGalTable.rows.length; x++){
							g_eGalTable.rows[x].cells[2].innerHTML = getStep(g_eGalTable.rows[x].attributes["pibd1"].value);
							g_eGalTable.rows[x].cells[2].style.display = "";
					}
				}
			}else{
			}
			//미결/완료/반송/참조/회람/사용자폴더 다중선택
			//체크박스 활성화
			if (uid != 'MONITOR' && (gLocation == "APPROVAL" || gLocation == "COMPLETE" || gLocation == "REJECT" || gLocation == "CCINFO" || gLocation == "TCINFO" || gLocation == "REVIEW3" || (gLocation == "JOBFUNCTION" && (gLocationMode == "APPROVAL")) || gLocation == "UFOLDER" || (gLocation == "DEPART" && (strBox == "A" || strBox == "E" || strBox == "S" || strBox == "SS" ||  strBox == "RC" || strBox == "I" || strBox == "R")))) {
				document.getElementById("thAPV").style.display = "";
				if (g_totalcount > 0 ){
					for (var x=1; x < g_eGalTable.rows.length; x++){
							g_eGalTable.rows[x].cells[0].style.display = "";
					}
				}
			}

		
			
			//상단 아이프레임 높이 조정
			try
			{//이준희(2011-01-04): Added try/catch to support SharePoint environment.
				if (parent.document.getElementById("kind") != null && parent.document.getElementById("kind").value == "total"){
					if(parent.document.getElementById("iworklist") != null){
						try{parent.document.getElementById("iworklist").style.height = "400px";}catch(e){}
						try{document.getElementById("divGalTable").style.height = "290px";}catch(e){}
					}
				}else{
					if(parent.document.getElementById("ifrDL") != null){
						if(parent.document.getElementById("iworklist") != null){
							try{parent.document.getElementById("ifrDL").style.height = (g_eGalTable.rows.length+3)*24 + "px";}catch(e){}
						}
					}
					if(document.getElementById("divGalTable") != null){
						try{document.getElementById("divGalTable").height = (g_eGalTable.rows.length+3)*24+ "px";}catch(e){}
					}
				}
			}
			catch(e)
			{
			}
		}
	}
}

function receiveHTTPList() {
	if(m_xmlHTTP.readyState != 4)
	{
		return;
	}
    m_xmlHTTP.onreadystatechange = event_noop;
	var xmlReturn=m_xmlHTTP.responseXML;
	if (xmlReturn.xml == "") {
	    alert(m_xmlHTTP.responseText);
	    return;
	}
	else {
	    //2014-04-17 hyh 수정
	    //var errorNode = xmlReturn.selectSingleNode("response/error");
	    var errorNode = $(xmlReturn).find("response error")[0];
	    //2014-04-17 hyh 수정 끝
	    //if (errorNode != null) {
	    if (errorNode != null || errorNode != undefined) {
	        alert("Desc: " + errorNode.text);
	        return;
	    }
	}
	var bSRPT = false;
	var iTmp = 0;
	var sTgt = '', sTmp = '';
	var ele = null;
	m_objXML = m_xmlHTTP.responseXML; //정상처리 – 변경소스
	processXml(); //alert(646);//Passes here in [미결함]/[진행함]
	//2014-04-17 hyh 수정
    //document.getElementById("divGalTable").innerHTML = m_objXML.documentElement.selectSingleNode("listhtml/table").xml;
	document.getElementById("divGalTable").innerHTML = $(m_objXML.documentElement).find("listhtml table")[0].xml;
	//2014-04-17 hyh 수정 끝
	{//이준희(2010-10-15): Added to support SharePoint environment.
	try
	{
		parent.location.toString().toUpperCase();
	}
	catch(e)
	{//Within SharePoint environment.
		bSRPT = true;
	}
	if(bSRPT)
	{
		try
		{
			ele = document.getElementById('tblGalInfo');//debugger;
			iTmp = ele.getElementsByTagName('TR').length - 2;
			if(iTmp < 10)
			{//alert(672);//The document count in the box can be infered from the list.
				sTmp = '[ <font color=red>' + iTmp.toString() + '</font> ]';//alert(654);sTgt = fnCEPSQs(window.location.toString(), 'location').toLowerCase();
				sTgt = window.location.toString().split('location=')[1].split('&')[0];/*switch(fnCEPSQs(window.location.toString(), 'location'))
				{
					case 'approval':
						break;
					case 'process':
						break;
					default:
						break;
				}*///sTmp = '999';//$$
				parent.document.getElementById(sTgt).innerHTML = sTmp;
			}
		}
		catch(e)
		{
		}
	}//sTmp = '[ <font color=red>' + '888' + '</font> ]';//parent.document.getElementById('process').innerHTML = sTmp;
	}
	g_eGalTable = window.document.getElementById("tblGalInfo");

	if(window.addEventListener){
		g_eGalTable.addEventListener("mousedown", event_GalTable_onmousedown, false);
		//g_eGalTable.addEventListener("dblclick", event_GalTable_ondblclick, false);
	}else{	   
		g_eGalTable.attachEvent("onmousedown", event_GalTable_onmousedown);
		//g_eGalTable.attachEvent("ondblclick", event_GalTable_ondblclick);	
	}
		   
	//한번클릭으로 문서 오픈
	//g_eGalTable.attachEvent("onmouseup",event_GalTable_onmousedown);
	if (gOrder != '')
	{
		var aOrder=gOrder.split(";");
		document.getElementById('span'+aOrder[1]).innerHTML = '<img src="'+ g_imgBasePath+ '/Covi/common/icon/blt_07_'+aOrder[0]+'.gif" align="absmiddle">';
	}
	//미결,진행 진행 바 표현
	if (gLocation == "APPROVAL" || gLocation == "PROCESS" || gLocation == "TODO" || gLocation == "FINISH" || (gLocation=="JOBFUNCTION" && (gLocationMode=="APPROVAL" || gLocationMode=="PROCESS" ) )){
		document.getElementById("thST").style.display = "";
		if (g_totalcount > 0 ){
			for (var x=1; x < g_eGalTable.rows.length; x++){
			    if(gLocation == "FINISH"){
			        g_eGalTable.rows[x].cells[3].innerHTML = getStep(g_eGalTable.rows[x].attributes["bstate"].value);
					g_eGalTable.rows[x].cells[3].style.display = "";
			    }else{
					g_eGalTable.rows[x].cells[3].innerHTML = getStep(g_eGalTable.rows[x].attributes["pibd1"].value);
					g_eGalTable.rows[x].cells[3].style.display = "";
				}
			}
		}
	}
			
	//미결/완료/반송/참조/회람/사용자폴더 다중선택
	//체크박스 활성화
	if (uid != 'MONITOR' && (gLocation == "PREAPPROVAL" || gLocation == "PROCESS" || gLocation == "APPROVAL" || gLocation == "TODO" || gLocation == "FINISH" || gLocation == "COMPLETE" || gLocation == "REJECT" || gLocation == "CCINFO" || gLocation == "TCINFO" || gLocation == "REVIEW3" || (gLocation == "JOBFUNCTION" && (gLocationMode == "APPROVAL")) || gLocation == "UFOLDER" || (gLocation == "DEPART" && (strBox == "A" || strBox == "E" || strBox == "S" || strBox == "SS" || strBox == "D" || strBox == "RC" || strBox == "I" || strBox == "R")))) {
		document.getElementById("thAPV").style.display = "";
		if (g_totalcount > 0 ){
		    if(gLocation == "UFOLDER" || gLocation == "TCINFO" ||  (gLocation == "DEPART" && (strBox == "D"))){
			    for (var x=1; x < g_eGalTable.rows.length; x++){
				    g_eGalTable.rows[x].cells[0].style.display = "";
			    }
		    }else{
		        if( gLocation == "REJECT"){
		            //document.getElementById("thAPV").style.display = "none";

                    //=== 반려함 체크박스 보이게위해 추가 (2013-02-07 HIW) ====
		            document.getElementById("thAPV").style.display = "";
		            for (var x = 1; x < g_eGalTable.rows.length; x++) {
		                g_eGalTable.rows[x].cells[1].style.display = "";
		            }
                    //=======================================================
		        }else{
			        for (var x=1; x < g_eGalTable.rows.length; x++){
				        g_eGalTable.rows[x].cells[1].style.display = "";
			        }
			    }
			}
		}else{
		    if( gLocation == "COMPLETE"){
                g_eGalTable.rows[0].cells[3].style.display = "";  
                g_eGalTable.rows[0].cells[0].style.display = "";  
                g_eGalTable.rows[0].cells[1].style.display = "";  
            }
		    if( gLocation == "REJECT"){
                g_eGalTable.rows[0].cells[0].style.display = "none";  
		    }
        }
	}
//상단 아이프레임 높이 조정
	if ((admintype == "MONITOR") || (parent.document.getElementById("kind") != null && parent.document.getElementById("kind").value == "total")){
		if(parent.document.getElementById("iworklist") != null){
			try{parent.document.getElementById("iworklist").style.height = "400px";}catch(e){}
			try{document.getElementById("divGalTable").style.height = "300px";}catch(e){}
		}
	}else{
		if(parent.document.getElementById("ifrDL") != null){
			if(parent.document.getElementById("iworklist") != null){
				try{parent.document.getElementById("ifrDL").style.height = (g_eGalTable.rows.length+3)*24 + "px";}catch(e){}
			}
		}
		if(document.getElementById("divGalTable") != null){
			try{document.getElementById("divGalTable").style.height = (g_eGalTable.rows.length+3)*24+ "px";}catch(e){}
		}
	}
}


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
				if (m_foldermove) {
					document.location.reload();
					m_foldermove = false;
				}else{
					if(gLocation == "UFOLDER"){//폴더삭제 시 좌측 메뉴 다시 load
					   if(parent.parent.leftFrame != null){
							try{
								if(parent.foldermode =="I") parent.parent.leftFrame.location.reload();
							}catch(e){}
					   }
					}
					document.location.reload();
				}
			}
		}
	}
}
function processXml() {  
	var pageList ="";
	var temp = page-1;
	var cPage = parseInt(temp/10);
	
	var startPage;
	if(cPage == 0){
		startPage = 1; 
	}
	else{
		startPage = cPage+"1";
	}
    //2014-04-17 hyh 수정
    //var endPage = m_objXML.selectSingleNode("response/totalpage").text;
    var endPage = $(m_objXML).find("response totalpage")[0].text;
    //2014-04-17 hyh 수정 끝
	var fPage;
	var temp2 = endPage-1;
	var ePage = parseInt(temp2/10);
	if(cPage == ePage){
		fPage = endPage
	}
	else if(endPage == "NaN"){
		fPage = 1;
	}
	else{
		fPage = parseInt(startPage)+9;
	}
	for(i=startPage;i<= fPage;i++)	{
		if (pageList!=""){ pageList =pageList + "&nbsp;|&nbsp;";  }
		(i==page)? pageList += "<span><b>" + i + "</b></span>" :pageList += "<a href='#' onclick='go_page(" + i + ")'>" + i + "</a>" ;
	}	
	document.getElementById("totalpage").innerHTML = pageList;
	//2014-04-17 hyh 수정
	//g_totalcount = m_objXML.selectSingleNode("response/totalcount").text; 	
	g_totalcount = $(m_objXML).find("response totalcount")[0].text;
	//2014-04-17 hyh 수정 끝
	g_pagecount = Math.ceil(g_totalcount / pagecnt);
	//2014-04-17 hyh 수정
	//g_totalpage = m_objXML.selectSingleNode("response/totalpage").text;
	g_totalpage = $(m_objXML).find("response totalpage")[0].text;
	//2014-04-17 hyh 수정 끝
	//2003.03.27 황선희 수정
//	processXmlData(m_objXML);
doProgressIndicator(false); 

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
 
		var oXMLHttp =  CreateXmlHttpRequest();
		oXMLHttp.open("GET",urlXsl,false);
		oXMLHttp.send();
		//시간 늘리기
		delay(600);
		if ( oXMLHttp.status == 200){
		   var parser = new DOMParser();
		   oXslDom = parser.parseFromString(oXMLHttp.responseText,"text/xml");		   
		}

		var oProcessor = new XSLTProcessor();
		oProcessor.importStylesheet(oXslDom);
		return oProcessor;
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
function sortColumn(szClm){
	var aOrder=gOrder.split(";");
	if(aOrder[1]==szClm && aOrder[0]=="asc")
		gOrder="desc;" + szClm;
	else
		gOrder="asc;" + szClm;			
	
	if(m_xmlHTTP.responseXML.xml != ""){
		clearContents();
		go_page(page);		

		doProgressIndicator(false); 
	}else if (m_objXML.documentElement.childNodes.length == 0){
		clearContents();
		displayZero(true);
	}
}
function doProgressIndicator(fDisplay){
	if (fDisplay){
		addMessage(L_idsSearcing_Text);		
	}
	else{
		g_eErrorDiv.style.display = "none";
		document.getElementById("divGalTable").style.display = "block";
	}
}
function displayZero(fDisplay){
	if (fDisplay){
		g_eErrorDiv.innerText = "There is no result.";
		g_eErrorDiv.style.display = "block";
		document.getElementById("divGalTable").style.display = "none";
	}
	else{
		g_eErrorDiv.style.display = "none";
		document.getElementById("divGalTable").style.display = "block";
	}
}
function clearContents(){
	g_eErrorDiv.innerText = "";
	g_eErrorDiv.style.display = "none";
	document.getElementById("divGalTable").style.display = "block";
}
function event_noop(){return(false);} 
function HtmlEncode(text){
	return text.replace(/&amp;/g, '&').replace(/&quot;/g, "\"").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&apos;/g, "'");
}
function processXmlData(objXML){	
	var m_oXSLProcessor;
	var xslURL;
	var aXML = "";
	switch(gLocation){		
		case "TEMPSAVE":xslURL="TempSave/listitems_TempXSL.aspx"; break;
		case "TCINFO":xslURL="Circulation/listitemsXSLTOnCC.aspx"; break;
		case "UFOLDER":
			if(parent.foldermode == "I"){
				xslURL="listitemsXSLUFolders.aspx"; 
			}else{
				xslURL="listitemsXSLUFolder.aspx"; 
			}
			break;
		case "DEPART":
			//회람함 처리 따로  그외 일반처리
			//var strBox = uid.substring(uid.length-1);
			var strBox = uid.substring(uid.lastIndexOf("_")+1);
			switch (strBox){
				case "D":xslURL="Circulation/listitemsXSLTOnCC.aspx"; break;
				default :xslURL="listitemsXSL.aspx";break;
			}			
			break;		
		default:xslURL="listitemsXSL.aspx";
	}
	m_oXSLProcessor = makeProcessorScript(xslURL);
	
	aXML+="<param><name>sTitle</name><value><![CDATA["+gLabel+"]]></value></param>";
	aXML+="<param><name>sType</name><value><![CDATA["+g_usepresence+"]]></value></param>";
	
	var sXML = "<Items><xml><![CDATA[" + objXML.xml + "]]></xml><xslxml><![CDATA[" + m_oXSLProcessor + "]]></xslxml>"+aXML+"</Items>" ;
			
	var szURL = "getXMLXslParsing.aspx";
	
	requestHTTPXSL("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTPXSL2, sXML);	
}
//list에서 체크박스,첨부이미지 클릭시 양식 열리지 않게..
function noResponse(e) { 
//debugger
	var evt=(window.event)?window.event: e;
	evt.cancelBubble = true;
}
function event_GalTable_onmousedown(e) {
   //debugger
	var evt=(window.event)?window.event: e;
	el = (evt.srcElement) ? evt.srcElement : evt.target;
	
	if (el.tagName == "IMG" && (el.attributes["covimode"] != null && el.attributes["covimode"].nodeValue == 'imgctxmenu')) {
	}  else {
	if (el.tagName != "THEAD" && el.tagName != "TABLE" && el.tagName != "TH") {	  
			eTR = el.parentNode;
			while (eTR.tagName != "TR") {
				eTR = eTR.parentNode;
			}
			if(eTR.attributes["fiid"] != undefined){
				if (eTR.attributes["fiid"].nodeValue == null) { 
				//if (eTR.attributes["id"].nodeValue == null) { //fiid->id로 변경 2010.04.22  오류떠서 변경 (그룹핑시 저장문서가 없을 경우)
					//if (eTR.attributes["fiid"].nodeValue == null) { 
					eTR = eTR.parentNode;

					while (eTR != null && eTR.tagName != "TR") {
						eTR = eTR.parentNode;
					}
				}
				g_eCurrentRow = eTR;
				if (g_eCurrentRow != null) {
					if (evt.ctrlKey) {
						m_objRowRange = null;
						var fFire = false;
						if (g_eCurrentRow.rowselected == "rowselected") //className
							mf_unselectRecord(g_eCurrentRow);
						else
							mf_selectRecord(g_eCurrentRow);

						//				search.focus();
					}
					else if (evt.shiftKey) {
						if (m_objRowRange == null) {
							if (m_objRowLastSelected != null) {
								mf_unselectAll(g_eCurrentRow);
								m_objRowRange = new RowRange(m_objRowLastSelected, g_eCurrentRow);
							}
							else {
								m_objRowRange = new RowRange(g_eCurrentRow, g_eCurrentRow);
							}
						}
						else {
							m_objRowRange.endRow = g_eCurrentRow;
							m_objRowRange.update();
							m_objRowLastSelected = g_eCurrentRow;
						}
						//				search.focus();
					}
					else {
						m_objRowRange = null;
						mf_unselectAll(g_eCurrentRow);
						mf_selectRecord(g_eCurrentRow);
					}
				}
			}
		}
	}
}
function mf_unselectAll(objcol){
	for (var x=g_eGalTable.rows.length-1; x >= 1; x--){
		if(g_eGalTable.rows[x].rowselected == "rowselected" && objcol.sourceIndex != g_eGalTable.rows[x].sourceIndex){
			g_eGalTable.rows[x].setAttribute("rowselected","rowunselected");
			//g_eGalTable.rows[x].style.backgroundColor = "#ffffff";//"transparent";
			g_eGalTable.rows[x].style.color = "#333333";//"windowtext";
			g_eGalTable.rows[x].style.fontWeight='normal';

		}
	}
}
function RowRange(objStartRow, objEndRow){	
	var iDelta = objStartRow.sourceIndex - objEndRow.sourceIndex;
	var objNextRow;	
	this.rangeDirection = 0;	
	if (iDelta == 0){
		mf_selectRecord(objStartRow);
	}
	else{
		this.rangeDirection = (iDelta < 0)?DOWN:UP;
		mf_selectRecord(objStartRow);		
		objNextRow = mf_getNextRow(objStartRow,this.rangeDirection);
		for( ;objNextRow.uniqueID != objEndRow.uniqueID &&  mf_selectRecord(objNextRow);){
			objNextRow = mf_getNextRow(objNextRow,this.rangeDirection);
		}
		mf_selectRecord(objEndRow);
	}	
	this.startRow = objStartRow;
	this.tempEndRow = objEndRow;
	this.endRow   = objEndRow;	
	this.trimRange = mf_trimRowRange;
	this.expandRange = mf_expandRange;
	this.update =  mf_updateRowRange;
}
//한번클릭으로 문서 오픈
function mf_selectRecord(objRecord){
	var retval = true;	
	var rechecked = false;
	try
	{
		rechecked = parent.document.getElementById("chkView").checked;
	}
	catch(e)
	{
		if(parent.parent.document.getElementById('chkView') != null)
		{//이준희(2010-12-26): Added [if] condition to prevent any script error.
			rechecked = parent.parent.document.getElementById("chkView").checked;
		}
	}
	if (objRecord != null && objRecord != false){
		
		if (rechecked){
//			//if (objRecord.className  != "rowselected"){
////				m_objRowLastSelected = objRecord;			
////				objRecord.setAttribute("className","rowselected");
////				objRecord.style.backgroundColor = "#D6E7FB";//"highlight";
//				//objRecord.style.color = "#0000FF";//"highlighttext";
//				//showDetail(getRowAttribute(g_eCurrentRow,"piid"), getRowAttribute(g_eCurrentRow,"scid"));	// Monitor
//				try{
//					
//					showDetail(getRowAttribute(g_eCurrentRow,"piid"), getRowAttribute(g_eCurrentRow,"scid"));	  // Monitor
//					//g_eGalTable.attachEvent("ondblclick", event_GalTable_ondblclick);
//					
//				}catch(e){
//					//showDetail(getRowAttribute(g_eCurrentRow,"piid"), getRowAttribute(g_eCurrentRow,"scid"));	  // Monitor
//					//g_eGalTable.attachEvent("ondblclick", event_GalTable_ondblclick);
//				}
//			//}
		}
		else{			
//			m_objRowLastSelected = objRecord;			
//			objRecord.setAttribute("className","rowselected");
//			objRecord.style.backgroundColor = "#D6E7FB";//"highlight";
//			objRecord.style.color = "#0000FF";//"highlighttext";
			//showDetail(getRowAttribute(g_eCurrentRow,"piid"), getRowAttribute(g_eCurrentRow,"scid"));	// Monitor
			try{
				processSelectedRow();
			}catch(e){
				//processSelectedRow();
			}
		}
	}
	else{
		retval = false;
	}
	return(retval);
}
function showDetail(ProcInstID,SchemaID){
	if (ProcInstID != ""){
		parent.m_ProcInstID =  ProcInstID;
		//2006.04.03사원 이후창 주석 처리
		//추후 풀어 줄것 테스트 하기 위해 주석으로 만들었음
		requestHTTP("GET","./ApvlineMgr/getApvSteps.aspx?piid="+ProcInstID+"&scid="+SchemaID,true,"text/xml",receiveHTTPMonitor);
	}
	return;
}
function receiveHTTPMonitor(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			alert(m_xmlHTTP.responseText);
		}else{
			menu.APVLIST.value = m_xmlHTTP.responseText.replace(/<\?xml version=\"1.0\" encoding=\"utf-8\"\?>/,"").replace(/<\?xml version=\"1.0\" encoding=\"euc-kr\"\?>/,"");
			/*
			try {
				parent.iApvLine.location = "./ApvlineMgr/ApvlineViewer.aspx";
				parent.iApvGraphic.drawGraphic(menu.APVLIST.value);
			} catch(e) {
				parent.parent.iApvLine.location = "./ApvlineMgr/ApvlineViewer.aspx";
				parent.parent.iApvGraphic.drawGraphic(menu.APVLIST.value);
			}
			*/
			iApvLine.location = "./ApvlineMgr/ApvlineViewer.aspx";
			iApvGraphic.drawGraphic(menu.APVLIST.value);		
		}
	}
}
function mf_unselectRecord(objRecord){		
	var retval = false;	
	if(objRecord != null){
		objRecord.setAttribute("className","rowunselected");
		objRecord.style.backgroundColor = "#ffffff";//"transparent";
		objRecord.style.color = "#333333";//"windowtext";		
		retval = true;
	}
	return(retval);
}
function mf_getNextRow(objRow, iDirection){
	var objNextRow = null;
	var retval = false;	
	if (objRow != null){
		if(iDirection == UP)
			objNextRow = objRow.previousSibling;
		else
			objNextRow = objRow.nextSibling;
		
		if(objNextRow != null)retval = objNextRow;		
	}
	return(retval);
}
function mf_updateRowRange(){
	var objNextRow;
	var iTempDir = 0;
	var iDelta = this.startRow.sourceIndex - this.endRow.sourceIndex;
	if(iDelta < 0){
		iTempDir = DOWN;
	}
	else if(iDelta > 0){
		iTempDir = UP;
	}
	else if(iDelta == 0){
		mf_unselectRecord(this.tempEndRow);
		this.tempEndRow = this.endRow;
		this.rangeDirection = null;
		return(true);
	}
	if (this.rangeDirection == null)this.rangeDirection = iTempDir;
	if(iTempDir == this.rangeDirection){
		 //Either add or remove rows based on the endRow
		var iEndDelta = this.tempEndRow.sourceIndex - this.endRow.sourceIndex;
		if(iEndDelta > 0 ){
			if(this.rangeDirection == DOWN)
				//remove rows
				this.trimRange(UP);
			else
				//add rows
				this.expandRange(this.tempEndRow);
		}
		if(iEndDelta < 0){
			if(this.rangeDirection == UP)
				//remove rows
				this.trimRange(DOWN);
			else
				//add rows
				this.expandRange(this.tempEndRow);
		}
	}
	else{
		//Unselect all rows except the start row
		this.rangeDirection = iTempDir;
		var objSelector = this.startRow;
		objSelector.setAttribute("rowselected","rowSelectedException");
		mf_unselectAll(objSelector);
		objSelector.setAttribute("rowselected","rowselected");
		//add rows in range
		this.expandRange(this.startRow);
	}
}
function mf_trimRowRange(iDirection){
	//remove rows
	mf_unselectRecord(this.tempEndRow);
	var objTempRow = mf_getNextRow(this.tempEndRow, iDirection);	
	if(objTempRow){
		for(;objTempRow.uniqueID != this.endRow.uniqueID && mf_unselectRecord(objTempRow);){
			objTempRow = mf_getNextRow(objTempRow,  iDirection);
		}
		this.tempEndRow = this.endRow;
	}
}
function mf_expandRange(objStartRow){
	var objTempRow = mf_getNextRow(objStartRow, this.rangeDirection);
	mf_selectRecord(this.endRow);	
	if (mf_selectRecord(objTempRow)){
		for(;objTempRow.uniqueID != this.endRow.uniqueID && mf_selectRecord(objTempRow) ;){
			objTempRow = mf_getNextRow(objTempRow,  this.rangeDirection);
		}
		this.tempEndRow = this.endRow;
	}
}
function mf_scrollIntoView(objRow){
	if ((objRow.offsetTop + objRow.offsetHeight - this.scrollTop) > this.clientHeight){
		objRow.scrollIntoView(false);
	}
	else if(objRow.offsetTop < this.scrollTop){
		objRow.scrollIntoView(true);
	}
}
function event_GalTable_ondblclick(e){
	var evt=(window.event)?window.event: e;
	el = (evt.srcElement)?evt.srcElement:evt.target;

	if (evt != null){
		if (el.parentNode.parentNode.tagName != "THEAD" && el.parentNode.parentNode.tagName != "TABLE" ){
			if (g_eCurrentRow != null){
				g_eCurrentRow.setAttribute("rowselected","rowunselected");
				//g_eCurrentRow.style.backgroundColor = "#ffffff";//"transparent";
				//g_eCurrentRow.style.color = "#333333";//"windowtext";
			}
			eTR = el.parentNode;
			while(eTR.tagName != "TR"){
				eTR = eTR.parentNode;
			}
			eTR.setAttribute("rowselected","rowselected");
			g_eCurrentRow = eTR;
			//g_eCurrentRow.style.backgroundColor = "#e2e8ce";//"HIGHLIGHT";
			//g_eCurrentRow.style.color = "#333333";//"HIGHLIGHTTEXT";		
			processSelectedRow();
		}
	}
}
function processSelectedRow(){
	if ( getRowAttribute(g_eCurrentRow,"fmid") != "WF_FORM_MIGRATION" ){
	        var smode = getRowAttribute(g_eCurrentRow,"mode");//201108 사용자 정의폴더 open
	        if(smode == "UFOLDER"){smode = "COMPLETE";}
			var strURL ="Forms/Form.aspx?mode=" + smode
					+ "&piid=" + getRowAttribute(g_eCurrentRow,"piid") + "&pfid=" + getRowAttribute(g_eCurrentRow,"pfid")
					+ "&ptid=" + toUTF8(getRowAttribute(g_eCurrentRow,"participantid")) + "&pist=" + getRowAttribute(g_eCurrentRow,"piviewstate")
					+ "&wiid=" + getRowAttribute(g_eCurrentRow,"workitemid") + "&bstate=" + getRowAttribute(g_eCurrentRow,"bstate")
					+ "&fmid=" + getRowAttribute(g_eCurrentRow,"fmid") + "&fmnm=" + toUTF8(getRowAttribute(g_eCurrentRow,"subject").substring(0,6) +"..")
					+ "&fmpf=" + getRowAttribute(g_eCurrentRow,"fmpf") + "&fmrv=" + getRowAttribute(g_eCurrentRow,"fmrv") + "&fiid=" + getRowAttribute(g_eCurrentRow,"fiid")
					+ "&ftid=" + getRowAttribute(g_eCurrentRow,"ftid") + "&fitn=" + getRowAttribute(g_eCurrentRow,"fitn") + "&scid=" + getRowAttribute(g_eCurrentRow,"scid")
					+ "&pfsk=" + getRowAttribute(g_eCurrentRow,"pfsk") +"&gloct="+gLocation
					+ "&secdoc=" + getRowAttribute(g_eCurrentRow,"secdoc")+ "&edms_document=" + getRowAttribute(g_eCurrentRow,"edms_document")+"&pipr="+getRowAttribute(g_eCurrentRow,"pipr")//;				
					+ "&admintype=" + admintype+ "&archived="+bArchived+ "&pidc=" + "&pibd1=&bstored="+bstored;// + toUTF8(getRowAttribute(g_eCurrentRow,"pibd1"));//toUTF8(getRowAttribute(g_eCurrentRow,"pidc")) + 2006.12.13 by wolf 사용자 문서 조회 및 수정 파라미터 추가		
			//2006.04.13 by wolf 결재선 보기 쿠키정보 읽어오기
			var cookiedata = document.cookie; 	
			if(cookiedata.indexOf("chkFormTabView=True") > -1 ){
					var oTopOpenWindow = null;
					if ( parent.parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
						oTopOpenWindow = parent.parent.oFRMWIN;
					}else{
						oTopOpenWindow = parent.parent.parent.oFRMWIN;
					}
					if(oTopOpenWindow == null){
						strURL = strURL.replace("Forms/Form.aspx?","Forms/FormTab.aspx?");
						openWindow(strURL,"FORMS",1024 ,720 ,'fix');
						if ( parent.parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
							parent.parent.oFRMWIN = win;
						}else{
							parent.parent.parent.oFRMWIN = win;
						}
					}else{
						try{
							if(oTopOpenWindow.name == "FORMS"){
								oTopOpenWindow.setformTab2(strURL, getRowAttribute(g_eCurrentRow,"subject").substring(0,6) +"..",getRowAttribute(g_eCurrentRow,"workitemid") );//창이 떠 있는 경우 데이터 넘기기 처리["+parent.foldername.innerHTML+"]
							}else{//신규 창 열기
								strURL = strURL.replace("Forms/Form.aspx?","Forms/FormTab.aspx?");
								openWindow(strURL,"FORMS",1024 ,720 ,'fix');
								if ( parent.parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
									parent.parent.oFRMWIN = win;
								}else{
									parent.parent.parent.oFRMWIN = win;
								}
							}
						}catch(e){//신규 창 열기
								strURL = strURL.replace("Forms/Form.aspx?","Forms/FormTab.aspx?");
								openWindow(strURL,"FORMS",1024 ,720 ,'fix');
								if ( parent.parent.location.href.toUpperCase().indexOf("/APPROVAL/DEFAULT.ASPX") > -1){
									parent.parent.oFRMWIN = win;
								}else{
									parent.parent.parent.oFRMWIN = win;
								}
						}
					}
			}else{
				//alert("strURL:"+ strURL);
				//		var width = 800 ;
				//		var height = window.screen.height - 85;
				//		if (getRowAttribute(g_eCurrentRow,"fmpf") == "BUDGET_CHANGE_REQUEST") height = 700 ;
				openWindow(strURL,"FORMS",800 ,720 ,'fix');
			}
	}else { // migration Data hykim
        var strURL = "Forms/Form.aspx?mode=MIGRATION" 
			    + "&piid=" + getRowAttribute(g_eCurrentRow, "piid")
			    + "&wiid=" + getRowAttribute(g_eCurrentRow, "workitemid") + "&bstate=" + getRowAttribute(g_eCurrentRow, "bstate")
			    + "&locationurl=" + getRowAttribute(g_eCurrentRow, "locationurl")
				+ "&fmid=" + getRowAttribute(g_eCurrentRow, "fmid")
				+ "&fmnm=" + getRowAttribute(g_eCurrentRow, "fmnm")
				+ "&fmpf=" + getRowAttribute(g_eCurrentRow, "fmpf")
				+ "&fmrv=" + getRowAttribute(g_eCurrentRow, "fmrv")
				+ "&fiid=" + getRowAttribute(g_eCurrentRow, "fiid")
			    + "&bstored=true&=&=&=&=&scid=&pfsk=" + getRowAttribute(g_eCurrentRow, "pfsk") + "&gloct=" + gLocation
			    + "&secdoc=" + getRowAttribute(g_eCurrentRow, "secdoc") + "&edms_document=" + getRowAttribute(g_eCurrentRow, "edms_document") + "&pipr=" + getRowAttribute(g_eCurrentRow, "pipr")//;				
			    + "&admintype=" + admintype + "&pidc=&pibd1=";
        openWindow(strURL, "FORMS", 800, 720, 'fix');
    }

}
function getRowAttribute(elm,sName){var v=elm.getAttribute(sName);return (v==null?"":v);}
function addMessage(szMsg, bIMG){
	var re = /항목을 찾을 수 없습니다./i;
   
	if(szMsg.search(re)!=-1) szMsg = "Could not find the matching item.";
	if(bIMG){
		g_eErrorDiv.innerHTML = szMsg;
	}else{
		g_eErrorDiv.innerText = szMsg;
	}
	g_eErrorDiv.style.display = "block";
	document.getElementById("divGalTable").style.display = "none";
}
function event_row_onkeydown(){
	if (event.keyCode == 16){ 
		//shift key	
	}
	else if(event.keyCode == 17){ 
		//ctrl key		
	}
	else if(event.keyCode == 40){ 
		//down		
		objRow = m_objRowLastSelected;
		m_objRowRange = null;
		var objNextRow = mf_getNextRow(objRow,  DOWN);
		if (objNextRow != false){
			mf_unselectAll(objNextRow);
			mf_selectRecord(objNextRow);
			mf_scrollIntoView(objNextRow);
			m_objRowLastSelected = objNextRow;
		}	
	}
	else if (event.keyCode == 38){
		//up
		objRow = m_objRowLastSelected;
		m_objRowRange = null;
		var objNextRow = mf_getNextRow(objRow,  UP);
		if (objNextRow != false){
			mf_unselectAll(objNextRow);
			mf_selectRecord(objNextRow);
			mf_scrollIntoView(objNextRow);
			m_objRowLastSelected = objNextRow;
		}		
	}
	else if (event.keyCode == 13){ 
		//enter
		eTR = m_objRowLastSelected;
		m_objRowRange = null;		
		while(eTR.tagName != "TR"){
			eTR = eTR.parentElement;
		}
		eTR.setAttribute("rowselected","rowselected");
		g_eCurrentRow = eTR;
		//g_eCurrentRow.style.backgroundColor = "#e2e8ce";//"highlight";
		//g_eCurrentRow.style.color = "#333333";//"highlighttext";		
		processSelectedRow();
	}
	else if(event.keyCode==46){
		//delete
		delete_onClick();
	}
}
function event_row_onkeyup(){
	if (event.keyCode == 16){ 
		//shift key
		//search.focus();
	}
	else if(event.keyCode == 17){ 
		//ctrl key
		//search.focus();
	}
}
function event_row_onselectstart(){
	event.cancelBubble = true;
	event.returnValue = false;
}
function cmdSearch_onClick(strGubun,  strSearch, QSDATE, QEDATE){
//	gSearch = window.search.value;
	gGubun = strGubun;
	gSearch = strSearch;
	if(QSDATE == undefined){
	}
	else{
		//기간검색을 위한 파라미터 추가
		d_QSDATE = QSDATE.replace(/-/g, "");
		d_QEDATE = QEDATE.replace(/-/g, "");
	}
	if (gGubun == "WORKDT"){
		if (QSDATE == "" || QEDATE == ""){
			alert(gMessage001);
			return;
		}
//	}else if (gSearch=="" && admintype != "MONITOR"){
//		alert(gMessage001);//"검색어를 입력하십시오"
//		return;
	}
	clearContents();
	page=1;gOrder='';
	queryGetData();
		//(gLocation == "TEMPSAVE")?TempQueryGetData():queryGetData();
	
}
// 부서문서함검색용 임시 함수 - 날짜지정Parameter 제외 추후 날짜 지정기능 추가 하면 원래 함수 적용예정[20090213 by ssuby]
function cmdSearchDept_onClick(strGubun,strSearch, QSDATE, QEDATE){
//	gSearch = window.search.value;
	gGubun = strGubun;
	gSearch = strSearch;
	//기간검색을 위한 파라미터 추가
	d_QSDATE = QSDATE.replace(/-/g, "");
	d_QEDATE = QEDATE.replace(/-/g, "");
	if (gSearch==""){
		alert(gMessage001);//"검색어를 입력하십시오"
	}
	else{
		clearContents();
		page=1;gOrder='';
		queryGetData();
		//(gLocation == "TEMPSAVE")?TempQueryGetData():queryGetData();
	}
}

//hichang 하위 폴더 동시 삭제 20110915 START
var cnt = "";
function queryGetData01(pFolderid, pParentfolderid){
    try {
        m_xmlHTTP = CreateXmlHttpRequest();
        var szURL = "";
        var pXML = "dbo.usp_wfform_setfolder_01";
        
        var aXML = "<param><name>folderid</name><type>decimal</type><length></length><value><![CDATA[" + pFolderid + "]]></value></param>";
        aXML += "<param><name>parentid </name><type>decimal</type><length></length><value><![CDATA[" + pParentfolderid + "]]></value></param>";

        sXML = "<Items><connectionname>FORM_DEF_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>" + aXML + "</Items>";
        szURL = "GetXMLQuery.aspx";
        requestHTTP("POST", szURL, false, "text/xml", receiveHTTP_01, sXML);
    } catch (e) {
        alert("Error No:" + e.number + " Desc:" + e.description);
    }
}


function receiveHTTP_01() {
    if (m_xmlHTTP.readyState == 4) {
        m_xmlHTTP.onreadystatechange = event_noop;
        if (m_xmlHTTP.responseText.charAt(0) == '\r') {
            //alert(m_xmlHTTP.responseText);
        } else {
            var errorNode = m_xmlHTTP.responseXML.selectSingleNode("response/error");
            if (errorNode != null) {
                alert("Desc: " + errorNode.text);
                document.getElementsByName("ChangeDate" + sidx)[0].value = "";
            } else {
                cnt = m_xmlHTTP.responseXML.selectSingleNode("response/NewDataSet/Table/CntRow").text;
            }
        }

    }
}

//hichang 하위 폴더 동시 삭제 20110915 END



function delete_onClick(bFolder){ //debugger;
    //if ((gLocation == "APPROVAL") || (gLocation == "PROCESS") || (gLocation == "TODO") || (uid.lastIndexOf("_R") > 0) || (uid.lastIndexOf("_A") > 0) || (uid.lastIndexOf("_S") > 0) || (uid.lastIndexOf("_P") > 0)) {
    if ((gLocation == "APPROVAL") || (gLocation == "PROCESS") || (gLocation == "TODO")) {  //2013-05-06
		alert(gMessage002);//"항목을 지우실 수 없습니다."
		return false;
	}
	var strflag = false;
	var sItems="<request>";
	var sUrl;
	if (gLocation == "TEMPSAVE"){
		/*
		for (var x=g_eGalTable.rows.length-1; x >= 1; x--){
			var item = g_eGalTable.rows[x];
			if(item.className == "rowselected"){
				sItems+="<item id=\""+item.id+"\" fitn=\""+item.fitn+"\" fiid=\""+item.fiid+"\" fmpf=\""+item.fmpf+"\"/>";
				strflag = true;
			}
		}
		*/
		if (document.getElementsByName("chkAPV").length == null){//한개
			if(document.getElementsByName("chkAPV")[0].checked){
				var item = document.getElementsByName("chkAPV")[0].parentNode.parentNode;
				sItems+="<item id=\""+item.getAttribute("id")+"\" fitn=\""+item.getAttribute("fitn")+"\" fiid=\""+item.getAttribute("fiid")+"\" fmpf=\""+item.getAttribute("fmpf")+"\"/>";
				if(item.getAttribute("id") != undefined) strflag = true;
			}
		}else{ //2개 이상
			for(var i=0 ; i < document.getElementsByName("chkAPV").length; i++){
				if(document.getElementsByName("chkAPV")[i].checked){
					var item = document.getElementsByName("chkAPV")[i].parentNode.parentNode;
					sItems+="<item id=\""+item.getAttribute("id")+"\" fitn=\""+item.getAttribute("fitn")+"\" fiid=\""+item.getAttribute("fiid")+"\" fmpf=\""+item.getAttribute("fmpf")+"\"/>";
					strflag = true;
				}
			}
		}	
		sUrl = "InstMgr/switchFT2Del.aspx";
	}else if (gLocation == "UFOLDER"){//사용자 정의 폴더 삭제처리
		/*
		for (var x=g_eGalTable.rows.length-1; x >= 1; x--){
			var item = g_eGalTable.rows[x];
			if(item.className == "rowselected"){
				sItems+="<item id=\""+item.id+"\" fitn=\""+item.fitn+"\" fiid=\""+item.fiid+"\" fmpf=\""+item.fmpf+"\"/>";
				strflag = true;
			}
		}
		*/
		sItems+="<mode>DELETE</mode>"; //사용자 정의 폴더 삭제 처리
		var szfoldermode='N';
		try{
			if (parent.foldermode != undefined){
					szfoldermode = parent.foldermode;
			}
		}catch(e){		
			if (parent.parent.foldermode != undefined){
				szfoldermode = parent.foldermode;
			}
		}
		
		sItems+="<foldermode>"+szfoldermode+"</foldermode>"; //사용자 정의 폴더 삭제 처리
		if ( szfoldermode == "I"){
			sItems+=""; //사용자 정의 폴더 삭제 처리
			if (document.getElementsByName("chkAPV").length == null){//한개
				if(document.getElementsByName("chkAPV")[0].checked){
					var item = document.getElementsByName("chkAPV")[0].parentNode.parentNode;
					sItems+="<item id=\""+item.getAttribute("folderid")+"\" >";
					sItems+="</item>";
					if(item.getAttribute("folderid") != undefined) strflag = true;
				}
			}else{ //2개 이상
				for(var i=0 ; i < document.getElementsByName("chkAPV").length; i++){
					if(document.getElementsByName("chkAPV")[i].checked){
						var item = document.getElementsByName("chkAPV")[i].parentNode.parentNode;
						
						//hiichang 20110915 부모폴더 삭제 확인 confirm 창 start
						if(item.getAttribute("parentfolderid") != 0)
						{
						    sItems+="<item id=\""+item.getAttribute("folderid")+"\" >";
						    sItems+="</item>";
						    strflag = true;
						}
						else{
						    queryGetData01(item.getAttribute("folderid"), item.getAttribute("parentfolderid"));
						    if(cnt > 1){
						        if(confirm("하위폴더도 같이 삭제하시겠습니까?"))
						        {
						            sItems+="<item id=\""+item.getAttribute("folderid")+"\" >";
						            sItems+="</item>";
						            strflag = true;
						        }else{
    //						        alert("하위 폴더를 먼저 삭제해 주세요");
						            return false;
						        }
						    }else{
						        sItems+="<item id=\""+item.getAttribute("folderid")+"\" >";
						        sItems+="</item>";
						        strflag = true;
						    }
						}
						//hiichang 20110915 부모폴더 삭제 확인 confirm 창 end
						
					}
				}
			 }
		}else{
			sItems+="<folderid>"+uid+"</folderid>"; //사용자 정의 폴더 삭제 처리
			if (document.getElementsByName("chkAPV").length == null){//한개
				if(document.getElementsByName("chkAPV")[0].checked){
					var item = document.getElementsByName("chkAPV")[0].parentNode.parentNode;
					sItems+="<item id=\""+item.getAttribute("listid")+"\" >";
					sItems+=makefolderinfo(item, "0");
					sItems+="</item>";
					if(item.getAttribute("listid") != undefined) strflag = true;
				}
		  }else{ //2개 이상
				for(var i=0 ; i < document.getElementsByName("chkAPV").length; i++){
					if(document.getElementsByName("chkAPV")[i].checked){
						var item = document.getElementsByName("chkAPV")[i].parentNode.parentNode;
						sItems+="<item id=\""+item.getAttribute("listid")+"\" >";
						sItems+=makefolderinfo(item, "0");
						sItems+="</item>";
						strflag = true;
					}
				}
			 }
		}
		sUrl = "UserFolderList.aspx";
	}else if(gLocation == "CCINFO" || gLocation == "REVIEW3"  ) {
		sItems+="<mode>cancel</mode>"; //할당취소
		sItems+="<archive>"+bArchived+"</archive>"; //Archive 작업 추가
		sItems+="<bfoldermove>"+bFolder+"</bfoldermove>"; //폴더이동 작업 추가
		/*
		for (var x=g_eGalTable.rows.length-1; x >= 1; x--){
			var item = g_eGalTable.rows[x];
			if(item.className == "rowselected"){
				sItems+="<item wiid=\""+item.workitemid+"\" ptid=\"" +item.ptid +"\" pfid=\""+ item.pfid +"\" />";
				strflag = true;
			}
		}
		*/
		if (document.getElementsByName("chkAPV").length == null){//한개
			if(document.getElementsByName("chkAPV")[0].checked){
				var item = document.getElementsByName("chkAPV")[0].parentNode.parentNode;
				sItems+="<item wiid=\""+item.getAttribute("workitemid")+"\" ptid=\"" +item.getAttribute("ptid") +"\" pfid=\""+ item.getAttribute("pfid") +"\" >";
				sItems+=makefolderinfo(item, "0");
				sItems+="</item>";
				if(item.getAttribute("workitemid") != undefined) strflag = true;
			}
		}else{ //2개 이상
			for(var i=0 ; i < document.getElementsByName("chkAPV").length; i++){
				if(document.getElementsByName("chkAPV")[i].checked){
					var item = document.getElementsByName("chkAPV")[i].parentNode.parentNode;
					sItems+="<item wiid=\""+item.getAttribute("workitemid")+"\" ptid=\"" +item.getAttribute("ptid") +"\" pfid=\""+ item.getAttribute("pfid") +"\" >";
					sItems+=makefolderinfo(item, "0");
					sItems+="</item>";
					strflag = true;
				}
			}
		}
		sUrl = "InstMgr/switchWI2Del.aspx";
	
	}else if(gLocation == "TCINFO") {//회람에서 삭제시 바로 삭제
		sItems+="<mode>cancel</mode>"; //할당취소
		sItems+="<bArchived>"+bArchived+"</bArchived>"; //Archive 작업 추가
		sItems+="<bfoldermove>"+bFolder+"</bfoldermove>"; //폴더이동 작업 추가
		if (document.getElementsByName("chkAPV").length == null){//한개
			if(document.getElementsByName("chkAPV")[0].checked){
				var item = document.getElementsByName("chkAPV")[0].parentNode.parentNode;
				sItems+="<item sendid=\""+item.getAttribute("sendid")+"\" receipt_id=\"" +item.getAttribute("receipt_id") +"\" >";
				//sItems+=makefolderinfo(item, "0");
				sItems+="</item>";
				if(item.getAttribute("sendid") != undefined) strflag = true;
			}
		}else{ //2개 이상
			for(var i=0 ; i < document.getElementsByName("chkAPV").length; i++){
				if(document.getElementsByName("chkAPV")[i].checked){
					var item = document.getElementsByName("chkAPV")[i].parentNode.parentNode;
					sItems+="<item sendid=\""+item.getAttribute("sendid")+"\" receipt_id=\"" +item.getAttribute("receipt_id") +"\" >";
					//sItems+=makefolderinfo(item, "0");
					sItems+="</item>";
					strflag = true;
				}
			}
		}
		sUrl = "InstMgr/switchFT2Del.aspx?TCINFO=TCINFO";
	
	}else{
		sItems+="<mode>delete</mode>"; //worktiem 삭제 처리
		sItems+="<archive>"+bArchived+"</archive>";//Archive 작업 추가
		sItems+="<bfoldermove>"+bFolder+"</bfoldermove>"; //폴더이동 작업 추가
		
		/*
		for (var x=g_eGalTable.rows.length-1; x >= 1; x--){
			var item = g_eGalTable.rows[x];
			if(item.className == "rowselected"){
				sItems+="<item wiid=\""+item.workitemid+"\"/>";
				strflag = true;
			}
		}
		*/
		if (document.getElementsByName("chkAPV").length == null){//한개
			if(document.getElementsByName("chkAPV")[0].checked){
				var item = document.getElementsByName("chkAPV")[0].parentNode.parentNode;
				sItems+="<item wiid=\""+item.getAttribute("workitemid")+"\" ptid=\"" +item.getAttribute("ptid") +"\" pfid=\""+ item.getAttribute("pfid") +"\" uid=\"" +uid+ "\" >";
				sItems+=makefolderinfo(item, "0");
				sItems+="</item>";
				if(item.getAttribute("workitemid") != undefined) strflag = true;
			}
		}else{ //2개 이상
			for(var i=0 ; i < document.getElementsByName("chkAPV").length; i++){
				if(document.getElementsByName("chkAPV")[i].checked){
					var item = document.getElementsByName("chkAPV")[i].parentNode.parentNode;
					sItems+="<item wiid=\""+item.getAttribute("workitemid")+"\" ptid=\"" +item.getAttribute("ptid") +"\" pfid=\""+ item.getAttribute("pfid") +"\" uid=\"" +uid+ "\" >";
					sItems+=makefolderinfo(item, "0");
					sItems+="</item>";
					strflag = true;
				}
			}
		}
		sUrl = "InstMgr/switchWI2Del.aspx";
	}
	sItems+="</request>";

	if(strflag == false){
		alert(gMessage003);//"선택된 항목이 없습니다."
		return false;
	}
	if (bFolder) {	//폴더이동으로 호출된 경우
	    m_foldermove = true;
	    truthBeTold = true;
	} else {
	    
        //20161019 추가
	    if (language == "zh-CN"){

	        truthBeTold = window.confirm("确认是否删除？"); 
	    }
	    else{

	        truthBeTold = window.confirm(gMessage093); //"해당 항목들을 삭제하시겠습니까?"
	    }
	    //20161019 추가 끝
	}
	if (truthBeTold != true){return;}
	requestHTTP("POST",sUrl,true,"text/xml",receiveGeneralQuery,sItems);
}
function go_page(pagegb){	
  if(g_totalpage < 2)
  {
	  //return;
  }
	
	var currPage = 1;
	switch (pagegb)	{
	case "f"  :	currPage=1;break;
	case "p" :	currPage=(page-1);break;
	case "n" :	currPage=(page+1);break;
	case "l"  :	currPage=g_totalpage;break;
	default:
		if (pagegb == ""){return;}
		if (isNaN(pagegb)){return;}else{currPage=pagegb;};
		break;
	}
	if (parseInt(currPage) < 1) currPage = 1;
	if (parseInt(currPage) > g_totalpage) currPage = g_totalpage;
	page = currPage;

	/*
	var xmlReturn = m_xmlHTTP.responseXML;
	var m_oXSLProcessor, strXSLFile;
	switch(gLocation){
		case "DEPART":
			var strBox = uid.substring(uid.length-1);
			switch (strBox){
				case "R":
					strXSLFile = "wf_worklistquerydeptr.xsl"; //부서수신함 - 시행문양식으로 open
					break;
				default:
					strXSLFile = "wf_worklistquery01.xsl";
			}
			break;
		case "TEMPSAVE":
			strXSLFile = "TempSave/wfform_tempsavequery01.xsl";
			break;
		default:
			strXSLFile = "wf_worklistquery01.xsl"; //개인함
	}

	m_oXSLProcessor = makeProcessor(strXSLFile);
	m_oXSLProcessor.input = xmlReturn;
	//alert(gOrder);
	m_oXSLProcessor.addParameter("sortby", gOrder);
	if ( page == "") { page = 1;}

	m_oXSLProcessor.addParameter("iPage", page);
	m_oXSLProcessor.addParameter("iPageSize", pagecnt);
	m_oXSLProcessor.transform();
	m_objXML.loadXML(m_oXSLProcessor.output);

	processXml();
	*/
		
	//var url="listitems.aspx?uid=" + uid + "&page=" + page;
	//window.open(url,"_self");
	//window.location.href = url;
	//alert(g_totalcount + "---" + g_pagecount + "--" + pagecnt + "---" + g_querysize);
	if (eval(page)==eval(g_pagecount)){
		if (eval(g_querysize) < pagecnt){
			g_querysize=g_totalcount-(g_pagecount-1)*pagecnt;
		}else{
			g_querysize=g_totalcount-(g_pagecount-1)*g_querysize;
		}
	}else{
		g_querysize=pagecnt;
	}
	
	temp_querysize = g_querysize;
	queryGetData();
}
function groupby() {
//debugger
	var szSrc;
	if (skind.value == "total") {	   
		szSrc = "listitems.aspx?uid=" + uid + "&location=" + gLocation + "&label=" + strlabel;
	}
	else if (skind.value=="name"){
		szSrc = "listgroup.aspx?uid=" + uid + "&location=" + gLocation + "&kind=name";
	}
	else{
		szSrc = "listgroup.aspx?uid=" + uid + "&location=" + gLocation + "&kind=doc";
	}
	parent.worklist.innerHTML="<IFRAME id=iworklist frameborder=0 width=100% height=100% SRC='" + szSrc + "'></IFRAME>";
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
//<유미
function settingTCINFO(){
   
	var strflag = false;
	var sItems="<request>";
	var sUrl;
	sUrl = "Circulation/Circulation_Read_Update.aspx";
   
	 sItems += "<fiid>" + getRowAttribute(g_eCurrentRow,"fiid") + "</fiid>"
				+"<sendid>" + getRowAttribute(g_eCurrentRow,"sendid") + "</sendid>"
				+"<type>" + getRowAttribute(g_eCurrentRow,"type") + "</type>"
				+"<receipt_id>" + getRowAttribute(g_eCurrentRow,"receipt_id") + "</receipt_id>"
				+"<receipt_name>" + getRowAttribute(g_eCurrentRow,"receipt_name") + "</receipt_name>"
				+"<receipt_ou_id>" + getRowAttribute(g_eCurrentRow,"receipt_ou_id") + "</receipt_ou_id>"
				+"<receipt_ou_name>" + getRowAttribute(g_eCurrentRow,"receipt_ou_name") + "</receipt_ou_name>"
				+"<receipt_state>" + getRowAttribute(g_eCurrentRow,"receipt_state") + "</receipt_state>"
				+"<receipt_date>" + getRowAttribute(g_eCurrentRow,"receipt_date") + "</receipt_date>"
				+"<read_date>" + getRowAttribute(g_eCurrentRow,"read_date") + "</read_date>";
	sItems+="</request>";
	requestHTTP("POST",sUrl,true,"text/xml; charset=utf-8",null,sItems);		
}
//유미>

//MutiSelect (2006.09.22)

var m_xmlHTTP = CreateXmlHttpRequest();
var m_evalXML = CreateXmlDocument();

function evalXML(sXML){
	if(!m_evalXML.loadXML(sXML)){
		var err = m_evalXML.parseError;				
		throw new Error(err.errorCode,"desc:"+err.reason+"\nsrctxt:"+err.srcText+"\nline:"+err.line+"\tcolumn:"+err.linepos);
	}
}

var g_progresswin = null;	// 조직도정보 처리중 표시
function showProgress() {
	g_progresswin = window.showModelessDialog("/covinet/coviflownet/show_progress.asp?fileinfo=" + escape("데이타를 처리중입니다.") , "", "dialogWidth=390px; dialogHeight:155px; center:yes; status:no; help:no; edge:sunken;");
}

function hideProgress() 
{
  try {
	if (g_progresswin)
		g_progresswin.close();
  } catch(e) {
  }
}
/** 공백 제거 */
function  funcTrim( str ) 
{
	var src = new String(str);
	var tmp = new String();

	tmp = funcLtrim(funcRtrim(str));
	return tmp;
}
/** 오른쪽 공백 제거 */
function  funcRtrim( str ) 
{
	var src = new String(str);
	var tmp = new String();
	var i,lastnum, len = src.length;

	for(i = len;i >= 0;i--) 
	{
		tmp = src.substring(i,i-1);
		if (tmp != ' ' ) 
		{
			lastnum = i;
			break;
		}
	}
	tmp = src.substring(0,lastnum);
	return tmp;
}
/** 왼쪽 공백 제거 */
function  funcLtrim( str ) 
{
	var src = new String( str );
	var tmp = new String();
	var i,firstnum, len = src.length;

	for(i = 0;i < len ;i++) 
	{
		tmp = src.substring(i,i+1);
		if (tmp != ' ' ) 
		{
			firstnum = i;
			break;
		}
	}
	tmp = src.substring(firstnum);
	return tmp;
}

function chkAPVALL_onClick(){  
	if (document.getElementsByName("chkAPV") != undefined){
		if (document.getElementsByName("chkAPV").length == null){//한개
		    if(document.getElementsByName("chkAPV")[0].disabled == false){
			    document.getElementsByName("chkAPV")[0].checked  = (document.getElementById("chkAPVALL").checked==true?true:false); 
			}
		}else{ //2개 이상
			for(var i=0 ; i < document.getElementsByName("chkAPV").length; i++){
    		    if(document.getElementsByName("chkAPV")[i].disabled == false){
				    document.getElementsByName("chkAPV")[i].checked  = (document.getElementById("chkAPVALL").checked==true?true:false);
				}
			}
		}
	}else{
		alert(gMessage003);//"선택된 항목이 없습니다."
	}   
}

function getStep(sStepCount){
	try{
		var sReturn ="";
		if (sStepCount != "") {
		    sReturn = "<table  border='0'  cellpadding='0' cellspacing='0'  style='font-size:9pt;'>";
		    sReturn += "<tr>";
		    var arrStepInfo = sStepCount.split("_");
		    if (arrStepInfo.length > 2) {
		        sReturn += "<td  align='center' ";
		        if (sStepCount.indexOf("02_02") > -1) {
		            sReturn += " style='background-color:OrangeRed;width:40px;height:10px;line-height:10px;'>&nbsp;</td>";
		        } else {
		            sReturn += " style='background-color:BlueViolet;width:40px;height:10px;line-height:10px;'>&nbsp;</td>";
		        }
		    } else {
		        for (var i = 0; i < arrStepInfo[0]; i++) {
		            sReturn += "<td  align='center' ";

		            if (i < (arrStepInfo[0] - arrStepInfo[1])) {
		                sReturn += "><img src='" + g_imgBasePath + "/Covi/common/icon/b_icon_img_on.gif' width='8' height='8'></td>";
		            } else {
		                sReturn += "><img src='" + g_imgBasePath + "/Covi/common/icon/b_icon_img_off.gif' width='8' height='8'></td>";
		            }
		        }
		    }
		    sReturn += "</tr>";
		    sReturn += "</table>";
		}
		else {
		    sReturn += "&nbsp;";
		}
		return sReturn;
	}catch(e){
	    alert(e.message);
	}		
}
var bMulti = false;
var ApproveClickAPVLIST;
function cmdapprove_OnClick(APVLIST, PwdTo_Approval){	
	if (document.getElementsByName("chkAPV") != null){
		var strflag = false;
		var sItems="<request>";
		var sUrl;
		
		if (document.getElementsByName("chkAPV").length == null){//한개
			if(document.getElementsByName("chkAPV")[0].checked){
				var item = document.getElementsByName("chkAPV")[0].parentNode.parentNode;
				if(gLocation == "JOBFUNCTION" || gLocation == "DEPART"){
					sItems+="<item wiid=\""+item.getAttribute("workitemid")+"\" ptid=\"" +item.getAttribute("ptid") +"\" pfid=\""+ item.getAttribute("pfid") +"\" pfsk=\""+ item.getAttribute("pfsk") +"\" usid=\""+ userid +"\" />";
				}else{
					sItems+="<item wiid=\""+item.getAttribute("workitemid")+"\" ptid=\"" +item.getAttribute("ptid") +"\" pfid=\""+ item.getAttribute("pfid") +"\" pfsk=\""+ item.getAttribute("pfsk") +"\" usid=\""+ uid +"\" />";
				}
				if(item.getAttribute("workitemid") != undefined)strflag = true;
			}
		}else{ //2개 이상
			for(var i=0 ; i < document.getElementsByName("chkAPV").length; i++){
				if(document.getElementsByName("chkAPV")[i].checked){
					var item = document.getElementsByName("chkAPV")[i].parentNode.parentNode;
					if(gLocation == "JOBFUNCTION" || gLocation == "DEPART"){
						sItems+="<item wiid=\""+item.getAttribute("workitemid")+"\" ptid=\"" +item.getAttribute("ptid") +"\" pfid=\""+ item.getAttribute("pfid") +"\" pfsk=\""+ item.getAttribute("pfsk") +"\" usid=\""+ userid +"\" />";
					}else{
						sItems+="<item wiid=\""+item.getAttribute("workitemid")+"\" ptid=\"" +item.getAttribute("ptid") +"\" pfid=\""+ item.getAttribute("pfid") +"\" pfsk=\""+ item.getAttribute("pfsk") +"\" usid=\""+ uid +"\" />";
					}
					strflag = true;
					bMulti = true;
				}
			}
		}
		sItems +="<apv>" + (APVLIST==null?"":APVLIST) + "</apv>";
		try{sItems +="<usit>" + (parent.usit == null? parent.parent.usit:parent.usit) + "</usit>";}catch(e){}//201108
		sItems+="</request>";

		if(strflag == false){
			alert(gMessage003);//"선택된 항목이 없습니다."
			return;
		}else{ 
			sUrl = "InstMgr/switchWI2Complete.aspx";
			//2011.09.07 이은정 일괄결재 암호 추가 _ 시작
			if( PwdTo_Approval == "Y"){
			    truthBeTold = window.showModalDialog("ApvProcess/ApvTotalApproval.aspx","", "dialogWidth:390px;dialogHeight:190px;"); //일괄결재 시 암호 확인
			}else{
			    truthBeTold = window.confirm(gMessage077);//"처리하시겠습니까?" - 일괄결재시 암호 미확인
			}
			//2011.09.07 이은정 일괄결재 암호 추가 _ 끝
			
			if (truthBeTold != true){return;}
			if(bMulti){
				for(var i=document.getElementsByName("chkAPV").length-1 ; i >= 0; i--){
					if(document.getElementsByName("chkAPV")[i].checked){
						ApproveClickAPVLIST=APVLIST;
						ApproveClick();				
						//delay(1000);
					}
				}			  
				delay(500);
				displayMsg();
			}else{
			    requestHTTP("POST", sUrl, false, "text/xml", null, sItems);
			    receiveApproveQuery(); 
			}
		}
	}
}
function displayMsg(){
	if(sMultiMSG!=""){  alert(sMultiMSG);
		if(parent.refresh) parent.refresh();
		//document.location.reload();
		try{parent.parent.frames[0].getApprovalCount();}catch(e){}
		sMultiMSG = "";
	}
}
function ApproveClick(){
	var strflag = false;
	var sItems="<request>";
	var sUrl;

	if (document.getElementsByName("chkAPV").length == null){//한개
		if(document.getElementsByName("chkAPV")[0].checked){
			var item = document.getElementsByName("chkAPV")[0].parentNode.parentNode;
			if( gLocation == "JOBFUNCTION" || gLocation == "DEPART"){
				sItems+="<item wiid=\""+item.getAttribute("workitemid")+"\" ptid=\"" +item.getAttribute("ptid") +"\" pfid=\""+ item.getAttribute("pfid") +"\" pfsk=\""+ item.getAttribute("pfsk") +"\" usid=\""+ userid +"\" />";
			}else{
				sItems+="<item wiid=\""+item.getAttribute("workitemid")+"\" ptid=\"" +item.getAttribute("ptid") +"\" pfid=\""+ item.getAttribute("pfid") +"\" pfsk=\""+ item.getAttribute("pfsk") +"\" usid=\""+ uid +"\" />";
			}
			strflag = true;
		}
	}else{ //2개 이상
	  for(var i=document.getElementsByName("chkAPV").length-1 ; i >= 0; i--){			
			if(document.getElementsByName("chkAPV")[i].checked){
				var item = document.getElementsByName("chkAPV")[i].parentNode.parentNode;
				if( gLocation == "JOBFUNCTION" || gLocation == "DEPART"){
					sItems+="<item wiid=\""+item.getAttribute("workitemid")+"\" ptid=\"" +item.getAttribute("ptid") +"\" pfid=\""+ item.getAttribute("pfid") +"\" pfsk=\""+ item.getAttribute("pfsk") +"\" usid=\""+ userid +"\" />";
				}else{
					sItems+="<item wiid=\""+item.getAttribute("workitemid")+"\" ptid=\"" +item.getAttribute("ptid") +"\" pfid=\""+ item.getAttribute("pfid") +"\" pfsk=\""+ item.getAttribute("pfsk") +"\" usid=\""+ uid +"\" />";
				}
				strflag = true;
				document.getElementsByName("chkAPV")[i].checked = false;
				break;
			}
		}
	}
	sItems+="<apv>" + (ApproveClickAPVLIST==null?"":ApproveClickAPVLIST) + "</apv>";
	try{sItems +="<usit>" + (parent.usit == null? parent.parent.usit:parent.usit) + "</usit>";}catch(e){}//201108
	sItems+="</request>";

	if(strflag == false){
		alert(gMessage003);//"선택된 항목이 없습니다."
		return;
	}else{ 
		sUrl = "InstMgr/switchWI2Complete.aspx";
		requestHTTP("POST", sUrl, false, "text/xml", null, sItems);
		receiveApproveQuery();  
	}
}

function requestProcess(elmRoot){
	if (document.getElementsByName("chkAPV") != null){
		var strflag = false;
		var sItems;
		var sUrl  = "forms/reassignWorkItem.aspx";
		
		if (document.getElementsByName("chkAPV").length == null){//한개
		
			truthBeTold = window.confirm(gMessage077);//"처리하시겠습니까?"
			
			if(document.getElementsByName("chkAPV")[0].checked){
				sItems="<request>";
				var item = document.getElementsByName("chkAPV")[0].parentNode.parentNode;
				sItems+="<mode>"+item.getAttribute("mode")+"</mode>";
				sItems+="<piid>"+item.getAttribute("piid")+"</piid>";
				sItems+="<pfsk>"+item.getAttribute("pfsk")+"</pfsk>";
				sItems+="<id>"+elmRoot.selectSingleNode("item/AN").text+"</id>";
				sItems+="<name>"+elmRoot.selectSingleNode("item/DN").text+"</name>";
				sItems+="<pfid>"+item.getAttribute("pfid")+"</pfid>";
				sItems+="<ftid>"+item.getAttribute("ftid")+"</ftid>";
				sItems+="<wiid>"+item.getAttribute("workitemid")+"</wiid>";
				sItems+="<usid>"+userid+"</usid>";
				sItems+="<actcmt>"+parent.ACTIONCOMMENT.value+"</actcmt>";
				sItems+="</request>";
				strflag = true;
				if (truthBeTold != true){return;}
				requestHTTP("POST",sUrl,true,"text/xml",receiveProcess,sItems);	   
			}
		}else{ //2개 이상
		
			truthBeTold = window.confirm(gMessage077);//"처리하시겠습니까?"
			
			for(var i=0 ; i < document.getElementsByName("chkAPV").length; i++){
				if(document.getElementsByName("chkAPV")[i].checked){
					sItems="<request>";
					var item = chkAPV[i].parentElement.parentElement;
					sItems+="<mode>"+item.getAttribute("mode")+"</mode>";
					sItems+="<piid>"+item.getAttribute("piid")+"</piid>";
					sItems+="<pfsk>"+item.getAttribute("pfsk")+"</pfsk>";
					sItems+="<id>"+elmRoot.selectSingleNode("item/AN").text+"</id>";
					sItems+="<name>"+elmRoot.selectSingleNode("item/DN").text+"</name>";
					sItems+="<pfid>"+item.getAttribute("pfid")+"</pfid>";
					sItems+="<ftid>"+item.getAttribute("ftid")+"</ftid>";
					sItems+="<wiid>"+item.getAttribute("workitemid")+"</wiid>";
					sItems+="<usid>"+userid+"</usid>";
					sItems+="<actcmt>"+parent.ACTIONCOMMENT.value+"</actcmt>";
					sItems+="</request>";
					strflag = true;
					if (truthBeTold != true){return;}
					requestHTTP("POST",sUrl,true,"text/xml",receiveProcess,sItems);	   
				}
			}
		}
		if (bRequestProcess){
			alert(gMessage153); //"성공적으로 처리하였습니다"
			document.location.reload();
			try{parent.parent.menu_fr.getApprovalCount();}catch(e){}
		}		
		if(strflag == false){
			alert(gMessage003);//"선택된 항목이 없습니다."
			return;
		} 
	}else{
		alert(gMessage003);
	}
}
var bRequestProcess = false;
function receiveProcess(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseXML.xml==""){
			alert(m_xmlHTTP.responseText);
		}else{
			var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			if(errorNode!=null){
				alert(errorNode.text);
			}else{
				if(m_xmlHTTP.responseXML.documentElement.text=="OK"){
					cmdapprove_OnClick("");
					return;
				}
				 bRequestProcess = true;
			}
		}
	}
}

var sMultiMSG = "";
function receiveApproveQuery(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseXML.xml==""){
			alert(m_xmlHTTP.responseText);
		}else{
			var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			if(errorNode!=null){
				alert("Desc: " + errorNode.text);
			}else{
					if(bMulti){
						sMultiMSG = m_xmlHTTP.responseXML.documentElement.text;
					}
					else
					{
						if(parent.refresh) parent.refresh();
						window.location.reoad(true);
						try{parent.parent.frames[0].getApprovalCount();}catch(e){}
					}
			}
		}
	}
}
//사용자 폴더 이동
var m_foldermove = false;
function foldermove_OnClick(gubun){
	var strURL = "UserFolderMgr.aspx?mode=move";
	//부서문서함의 폴더 이동 혹은 복사처리
	if(gubun == "unit") { 
		strURL +="&uid="+uid.substring(0,uid.lastIndexOf("_"))
	}
	openWindow(strURL,"FOLDERFORMS",300 ,430 ,'resize');
}
function showDetailCheckBox(){
  if ( g_eCurrentRow != null){
 		showDetail(getRowAttribute(g_eCurrentRow,"piid"), getRowAttribute(g_eCurrentRow,"scid"));	  // Monitor
 	}
}
//사용자 폴더 이동 데이터 생성
function foldermove_makeData(szfolderid){
	var sItems = "";
	if (document.getElementsByName("chkAPV").length == null){//한개
		if(document.getElementsByName("chkAPV")[0].checked){
			var item = document.getElementsByName("chkAPV")[0].parentNode.parentNode;
			sItems+="<item>";
			sItems+=makefolderinfo(item, szfolderid);
			sItems+="</item>";
		}
	}else{ //2개 이상
		for(var i=0 ; i < document.getElementsByName("chkAPV").length; i++){
			if(document.getElementsByName("chkAPV")[i].checked){
				var item = document.getElementsByName("chkAPV")[i].parentNode.parentNode;
				sItems+="<item>";
				sItems+=makefolderinfo(item, szfolderid);
				sItems+="</item>";
			}
		}
	}
	return sItems;
}
function makefolderinfo(item, szfolderid){
var sItems = "";
	sItems+="<folderid>"+szfolderid+"</folderid>";
	sItems+="<listid>"+item.getAttribute("listid")+"</listid>";
	sItems+="<formname><![CDATA["+item.getAttribute("fmnm")+"]]></formname>"; //g_eGalTable.rows[x].cells[2].innerHTML 
	sItems+="<subject><![CDATA["+item.getAttribute("subject")+"]]></subject>";
	sItems+="<initiator_name><![CDATA["+item.getAttribute("initiator_name")+"]]></initiator_name>";
	sItems+="<initiator_unit_name><![CDATA["+item.getAttribute("initiator_unit_name")+"]]></initiator_unit_name>";
	sItems+="<linkurl><![CDATA["+getPIDC(item)+";"+item.getAttribute("piid")+";"+item.getAttribute("bstate")+"]]></linkurl>";
	sItems+="<linkkey><![CDATA["+item.getAttribute("linkkey")+"]]></linkkey>";
	sItems+="<wfmode><![CDATA["+item.getAttribute("wfmode")+"]]></wfmode>";
	sItems+="<deputystate><![CDATA["+item.getAttribute("deputystate")+"]]></deputystate>";
	sItems+="<initiator_id><![CDATA["+item.getAttribute("initiator_id")+"]]></initiator_id>";
	sItems+="<initiator_unit_id><![CDATA["+item.getAttribute("initiator_unit_id")+"]]></initiator_unit_id>";
return sItems;
}
//휴지통 복구
function restore_OnClick(){
	if (document.getElementsByName("chkAPV") != null){
	var strflag = false;
	if (gLocation == "UFOLDER"){
		var sItems="<request>";
			sItems+="<mode>RESTORE</mode>"; 
			var szfoldermode='N';
			try{
				if (parent.foldermode != undefined){
					szfoldermode = parent.foldermode;
				}
			}catch(e){		
				if (parent.parent.foldermode != undefined){
					szfoldermode = parent.foldermode;
				}
			}
			sItems+="<foldermode>"+szfoldermode+"</foldermode>"; 
			sItems+="<folderid>"+uid+"</folderid>";
			if (document.getElementsByName("chkAPV").length == null){//한개
				if(document.getElementsByName("chkAPV")[0].checked){
					var item = document.getElementsByName("chkAPV")[0].parentNode.parentNode;
					sItems+="<item id=\""+item.getAttribute("listid")+"\" >";
					sItems+=makefolderinfo(item, "0");
					sItems+="</item>";
					strflag = true;
				}
			}else{ //2개 이상
				for(var i=0 ; i < document.getElementsByName("chkAPV").length; i++){
					if(document.getElementsByName("chkAPV")[i].checked){
						var item = document.getElementsByName("chkAPV")[i].parentNode.parentNode;
						sItems+="<item id=\""+item.getAttribute("listid")+"\" >";
						sItems+=makefolderinfo(item, "0");
						sItems+="</item>";
						strflag = true;
					}
				}
			}	
			sItems+="</request>"; 
			
			if(strflag == false){
						alert(gMessage003);//"선택된 항목이 없습니다."
						return;
			} 
		var sUrl = "UserFolderList.aspx";
		requestHTTP("POST",sUrl,true,"text/xml",receiveGeneralQuery,sItems);
		}
			
	}
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

var selftime;
function event_GalTable_onmousemove(e){
	if(parent.document.getElementById("tooltip") != undefined){
		parent.document.getElementById("tooltip").style.display = "none";
	}else{
		document.getElementById("tooltip").style.display = "none";
	}
	var evt=(window.event)?window.event: e;

	if(evt == null)return;
	var el = (evt.srcElement)?evt.srcElement:evt.target;	
	if(el==null)return;
	
	if (el.tagName != "TH" && el.tagName != "TABLE" && el.tagName != "DIV" && el.tagName != "SPAN"){
		if(el.tagName == "TD"){
			el = el.parentNode;
			if(el==null)return;
		}
		if(el.subject!=null && el.subject != ""){
			if(parent.tooltip != undefined){
				parent.document.getElementById("tooltip").innerText = el.subject;
				parent.document.getElementById("tooltip").style.left = event.clientX + 10;
				parent.document.getElementById("tooltip").style.top = event.clientY + 310;
				parent.document.getElementById("tooltip").style.zIndex = 1;
				parent.document.getElementById("tooltip").runtimeStyle.display = "block";
			}else{
				document.getElementById("tooltip").innerText = el.subject;
				document.getElementById("tooltip").style.left = event.clientX + 10;
				document.getElementById("tooltip").style.top = event.clientY + 10;
				document.getElementById("tooltip").style.zIndex = 1;
				document.getElementById("tooltip").runtimeStyle.display = "block";
			}
		}
	}
	selftime = setTimeout("event_GalTable_onmousemove()",1500);
}

function getPIDC(item){	
	var m_oFormInfos = CreateXmlDocument();
	m_oFormInfos.async = false;
	m_oFormInfos.loadXML("<?xml version='1.0' encoding='utf-8'?><ClientAppInfo><App name='FormInfo'><forminfos><forminfo/></forminfos></App></ClientAppInfo>");
	var root = m_oFormInfos.documentElement;
	var currNode = root.childNodes.item(0).childNodes.item(0).childNodes.item(0);
	currNode.setAttribute("prefix",  item.getAttribute("fmpf") );
	currNode.setAttribute("revision", item.getAttribute("fmrv") );
	currNode.setAttribute("instanceid", item.getAttribute("fiid"));
	currNode.setAttribute("id", item.getAttribute("fmid"));
	currNode.setAttribute("name",item.getAttribute("fmnm"));
	currNode.setAttribute("schemaid",  item.getAttribute("scid"));
	currNode.setAttribute("index",  "0");
	currNode.setAttribute("filename",  "");
	currNode.setAttribute("subject", item.getAttribute("subject"));
	currNode.setAttribute("secure_doc", item.getAttribute("secdoc"));
	currNode.setAttribute("req_response", "");
	if(item.getAttribute("isfile") == null){
		currNode.setAttribute("isfile", "0");	
	}else{
		currNode.setAttribute("isfile", item.getAttribute("isfile"));	
	}
	return (!window.ActiveXObject) ?(new XMLSerializer()).serializeToString(root) : root.xml;
}
function chk_check() {//debugger;
    try{
	    if (chkAPV.length == null) {
		    var item = chkAPV.parentElement.parentElement;
		    if (chkAPV.checked) { return item.folderid + "&&" + item.foldernm; }
		    else {
			    alert(gMessage325);//"변경할 폴더를 선택하세요.");
			    return false;
		    }
	    }
	    else {
		    var j = 0;
		    for (var i = 0; i < chkAPV.length; i++) {
			    if (chkAPV[i].checked) {
				    var item = chkAPV[i].parentElement.parentElement;
				    j = j + 1;
			    }
		    }
		    if (j == 0) { alert(gMessage325); return false; }
		    else if (j > 1) { alert(gMessage326); return false; }
		    else { return item.folderid + "&&" + item.foldernm; ; }
	    }
	}catch(e){
	    alert(gMessage327);
	    return false;
	}
}
/*

个*/