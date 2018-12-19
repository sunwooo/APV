var m_xmlHTTP = CreateXmlHttpRequest();
var m_objXML = CreateXmlDocument();
var g_szAcceptLang="ko";
var L_idsSearcing_Text="Loading...";
var L_idsUnknownError_Text="Unknown Error";
var g_eGalTable;
var g_eErrorDiv;
var g_eCurrentRow;
var g_objXmlSelectedWorkItem=null;
var m_objRowLastSelected=null;
var m_objRowRange=null;
var UP=0;
var DOWN=1;
var strSearch;
var truthBeTold;
var pagecnt = 10;
var g_totalpage = "";
var g_totalcount = "";
var g_orderfield = "";
var g_orderdesc = "";
var	gOrder = "";
var gGubun="";
var d_QSDATE = "";
var d_QEDATE = "";
var checkccinfo = null; //201808 참조회람 추가

var GUBUN ;
var TITLE;
window.onload= initOnload;
function initOnload()
{	
	g_eErrorDiv = document.getElementById("divErrorMessage");

	clearContents();
	queryGetData();
}
function queryGetData(){
    
	if ( page == "") { page = 1;}
	
//		g_orderfield = gOrder.substring(2,gOrder.length);		
//		g_orderdesc	= gOrder.substring(0,1);
//		
//		if(g_orderdesc == "-")
//			g_orderdesc = "DESC";
//		else if(g_orderdesc == "+")
//			g_orderdesc = "ASC";
	var aryOrder = new String();
	aryOrder = gOrder.split(";");	
	
	if (aryOrder.length>1){
		g_orderfield = aryOrder[1];
		g_orderdesc = aryOrder[0];
	}	

				
	//alert("UNITCODE : " + sDept + " || DocListType : " + sDocListType + " || ?꾨뱶 : " + g_orderfield + " || ?뺣젹 : " + g_orderdesc + " || ?섏씠吏 : " + page + " || 移댁슫??: " + pagecnt + "            ");

	var szURL;
	var	connectionname = "FORM_DEF_ConnectionString";
	var pXML;
	var aXML="";
	var sXML;

    var PF_PERFORMER_ID=suid;
    var USER_ID=suid;
    var PF_SUB_KIND="";
	var PI_FINISHED="";
	var PI_NAME= "";
	var PAGENUM= page;
	var PAGECNT= pagecnt;
	var QUERYSIZE= pagecnt;	
	var GROUP_KIND= "";
	TITLE= "";
	var ORDERFILED=g_orderfield;			
	var ORDERDESC=g_orderdesc;	
	var PI_INITIATOR_NAME="";//spi_initiator;
	var PI_ETC= "";//spi_etc;
	var WI_STATE=528;
	var PI_STATE=528;
	var PF_STATE = "1";
	var MODE="";
	GUBUN=gGubun;
    TITLE=gSearch;
	
    var OWNER_UNIT_CODE= sDept;
    var DOC_LIST_TYPE= sDocListType;
    var YEARMONTH= sMonth;
    var PAGE= page;
    var PAGECOUNT= pagecnt;
    var ORDER_FIELD= g_orderfield;
    var ORDER_SORT= g_orderdesc;
    var pxslpath = "";
    var pExt = "";
    //debugger;  //HIW
	switch (sDocListType){
		case "1":
		case "2":
		    pxslpath = "DocList\\wf_doclistquery01.xsl";
	        pXML = "dbo.usp_wfform_docList";
            aXML="<param><name>OWNER_UNIT_CODE</name><type>varchar</type><length>256</length><value><![CDATA["+OWNER_UNIT_CODE+"]]></value></param>";
	        aXML+="<param><name>DOC_LIST_TYPE</name><type>varchar</type><length>256</length><value><![CDATA["+DOC_LIST_TYPE+"]]></value></param>";
	        aXML+="<param><name>YEARMONTH</name><type>varchar</type><length>256</length><value><![CDATA["+YEARMONTH+"]]></value></param>";
	        aXML+="<param><name>PAGE</name><type>int</type><length>4</length><value><![CDATA["+PAGE+"]]></value></param>";
	        aXML+="<param><name>PAGECOUNT</name><type>int</type><length>4</length><value><![CDATA["+PAGECOUNT+"]]></value></param>";
	        aXML+="<param><name>ORDER_FIELD</name><type>varchar</type><length>256</length><value><![CDATA["+ORDER_FIELD+"]]></value></param>";
	        aXML+="<param><name>ORDER_SORT</name><type>varchar</type><length>256</length><value><![CDATA["+ORDER_SORT+"]]></value></param>";	        
			break;
		case "TCINFO":
		    connectionname = "FORM_DEF_ConnectionString";
		    pxslpath = "Circulation\\wfform_tonccquery02.xsl";
		    pExt = "<MODE>TCINFO</MODE>";
		    //2014-10-28 hyh 수정
            //if(pXML==null)pXML = "dbo.usp_wfform_tonccquery01";
		    if (pXML == null) pXML = "dbo.usp_wfform_tonccquery01_doc";
		    //2014-10-28 hyh 수정 끝
            
            //201808 참조회람함 추가 시작			
			aXML = "<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_PERFORMER_ID + "]]></value></param>";
			if (checkccinfo == "Y" && TITLE == '') {

			pXML = "dbo.usp_wfform_tonccquery01_doc_ccinfo";
			aXML += "<param><name>d_QSDATE</name><type>varchar</type><length>256</length><value><![CDATA[" + d_QSDATE + "]]></value></param>";
			aXML += "<param><name>d_QEDATE</name><type>varchar</type><length>256</length><value><![CDATA[" + d_QEDATE + "]]></value></param>";
			}
			//201808 참조회람함 추가 끝
			
            //20170201 수정시작
            //if (PI_NAME != '' || PI_INITIATOR_NAME != '' || PI_ETC != '' || GROUP_KIND != '' || TITLE != '' || ORDERFILED != '' || ORDERDESC != '') {
		    if (PI_NAME != '' || PI_INITIATOR_NAME != '' || PI_ETC != '' || GROUP_KIND != '' || TITLE != '' || ORDERFILED != '' || ORDERDESC != '') {

		        if (TITLE != '') {
                      
					 //20180802 참조회람함 검색 수정
		             //pXML = "dbo.usp_wfform_tonccquery01_doc";
					 pXML = "dbo.usp_wfform_tonccquery01_doc_NEW";
                }else{

                     //2014-10-28 hyh 수정
                    //pXML = "dbo.usp_wfform_tonccquery01_dynamic";
                    pXML = "dbo.usp_wfform_tonccquery01_dynamic_doc";
                    //2014-10-28 hyh 수정 끝
                }
                
           //20170201 수정끝
                
                //기간 검색을 위한 파라미터 추가
                aXML += "<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA[" + GUBUN + "]]></value></param>";
                //aXML += "<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QSDATE + "]]></value></param>";
                //aXML += "<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QEDATE + "]]></value></param>";
				//201808 참조회람 추가
				aXML += "<param><name>d_QSDATE</name><type>varchar</type><length>256</length><value><![CDATA[" + d_QSDATE + "]]></value></param>";
                aXML += "<param><name>d_QEDATE</name><type>varchar</type><length>256</length><value><![CDATA[" + d_QEDATE + "]]></value></param>";
				//201808 참조회람 추가 끝
         
	        }			
        	//pXML += "'" + PF_PERFORMER_ID + "','" +  "','" + TITLE + "','" + PAGENUM + "','" + PAGECNT + "','" + QUERYSIZE + "','" + GROUP_KIND + "','" + TITLE + "','" + ORDERFILED + "','" + ORDERDESC +"'";
		    var PF_PERFORMER_DEPT_ID = "";
		    //aXML="<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+PF_PERFORMER_ID+"]]></value></param>";
		    aXML+="<param><name>DEPT_ID</name><type>varchar</type><length>1024</length><value><![CDATA["+PF_PERFORMER_DEPT_ID+"]]></value></param>";
		    //aXML+="<param><name>SUBJECT</name><type>varchar</type><length>1024</length><value><![CDATA["+PI_NAME+"]]></value></param>";
		    aXML+="<param><name>pagenum</name><type>int</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
		    aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
		    aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
		    aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
		    aXML+="<param><name>TITLE</name><type>varchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
		    aXML+="<param><name>SUBJECT</name><type>varchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
		    aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
		    aXML += "<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERDESC + "]]></value></param>";
		    //2014-10-28 hyh 추가
		    //d_QSDATE = parent.document.getElementById("QSDATE").value;
		    //d_QEDATE = parent.document.getElementById("QEDATE").value;
		    //20180802 참조회람함 검색 주석 품
			//aXML += "<param><name>d_QSDATE</name><type>varchar</type><length>256</length><value><![CDATA[" + d_QSDATE + "]]></value></param>";
		    //aXML += "<param><name>d_QEDATE</name><type>varchar</type><length>256</length><value><![CDATA[" + d_QEDATE + "]]></value></param>";
		   
		    //2014-10-28 hyh 추가 끝
			break;
		case "CCINFO":
			if(pXML==null)pXML = "dbo.usp_wf_worklistquery01ccinfo";
		    connectionname = "INST_ConnectionString";
		    pxslpath = "wf_worklistquery02.xsl";

		case "COMPLETED":
		    connectionname = "INST_ConnectionString";
			if(pXML==null)pXML = "dbo.usp_wf_worklistquery01complete";

            if(sDocListType == "COMPLETED"){MODE="COMPLETE"}			
            if(sDocListType == "CCINFO"){MODE="CCINFO"}			
		    aXML="<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+PF_PERFORMER_ID+"]]></value></param>";
	        if (GUBUN != '' || GROUP_KIND != '' || TITLE!= '' || ORDERFILED != '' || ORDERDESC !='' || d_QSDATE !=''){
                pXML = "dbo.usp_wf_worklistquery01";
		        //기간 검색을 위한 파라미터 추가
		        aXML+="<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA["+GUBUN+"]]></value></param>";    
		        aXML+="<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QSDATE+"]]></value></param>";
		        aXML+="<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QEDATE+"]]></value></param>";
           	}
		    aXML+="<param><name>WI_STATE</name><type>varchar</type><length>256</length><value><![CDATA["+WI_STATE+"]]></value></param>";
		    aXML+="<param><name>PI_STATE</name><type>varchar</type><length>256</length><value><![CDATA["+PI_STATE+"]]></value></param>";
		    aXML+="<param><name>MODE</name><type>varchar</type><length>256</length><value><![CDATA["+MODE+"]]></value></param>";
		    aXML+="<param><name>pagenum</name><type>int</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
		    aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
		    aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
		    aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
		    aXML+="<param><name>TITLE</name><type>varchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
		    aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
		    aXML+="<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERDESC+"]]></value></param>";
           	
			break;
		case "REC_COMPLETED"	:  //수신처리함
		    connectionname = "INST_ConnectionString";
		    pxslpath = "wf_worklistquery02.xsl";
			if(pXML==null)pXML = "dbo.usp_wf_worklistdeptquery01RC";
		    var PF_SUB_KIND = "A";
            if(sDocListType == "A"){PF_SUB_KIND = "A";MODE="A";}			
            if(sDocListType == "CCINFO"){PF_SUB_KIND = "I";MODE="I";}	
            if(sDocListType == "REC_COMPLETED"){PF_SUB_KIND = "RC";MODE="RC";}	
            
		case "REC_L"	:  //참조함
		    connectionname = "INST_ConnectionString";
			if(pXML==null)pXML = "dbo.usp_wf_worklistdeptquery01I";
	        if (GUBUN != '' || GROUP_KIND != '' || TITLE!= '' || ORDERFILED != '' || ORDERDESC !='' || d_QSDATE !=''){
	            pXML = "dbo.usp_wf_worklistdeptquery01";
    		    //기간 검색을 위한 파라미터 추가
    		    aXML+="<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA["+GUBUN+"]]></value></param>";
		        aXML+="<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QSDATE+"]]></value></param>";
		        aXML+="<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QEDATE+"]]></value></param>";				
            }
		    aXML="<param><name>PF_PERFORMER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+OWNER_UNIT_CODE+"]]></value></param>";
		    aXML+="<param><name>WI_STATE</name><type>varchar</type><length>256</length><value><![CDATA["+WI_STATE+"]]></value></param>";
		    aXML+="<param><name>PI_STATE</name><type>varchar</type><length>256</length><value><![CDATA["+PI_STATE+"]]></value></param>";
		    aXML+="<param><name>MODE</name><type>varchar</type><length>256</length><value><![CDATA["+MODE+"]]></value></param>";
		    aXML+="<param><name>pagenum</name><type>varchar</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
		    aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
		    aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
		    aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
		    aXML+="<param><name>TITLE</name><type>varchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
		    aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
		    aXML+="<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERDESC+"]]></value></param>";
		    aXML+="<param><name>PI_FINISHED</name><type>varchar</type><length>256</length><value><![CDATA["+PI_FINISHED+"]]></value></param>";
		    aXML+="<param><name>PF_SUB_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+PF_SUB_KIND+"]]></value></param>";
			break;
		case "OLD-CCINFO":
			if(pXML==null)pXML = "dbo.usp_wf_worklistquery01ccinfo";
		    connectionname = "INST_ARCHIVE_ConnectionString";
		case "OLD-COMPLETED":
		    connectionname = "INST_ARCHIVE_ConnectionString";
		    pxslpath = "wf_worklistquery02.xsl";
			if(pXML==null)pXML = "dbo.usp_wf_worklistquery01complete";
            if(sDocListType == "OLD-COMPLETED"){MODE="COMPLETE"}			
            if(sDocListType == "OLD-CCINFO"){MODE="CCINFO"}			
		    aXML="<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+PF_PERFORMER_ID+"]]></value></param>";
	        if (GUBUN != '' || GROUP_KIND != '' || TITLE!= '' || ORDERFILED != '' || ORDERDESC !='' || d_QSDATE !=''){
                pXML = "dbo.usp_wf_worklistquery01";
		        //기간 검색을 위한 파라미터 추가
		        aXML+="<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA["+GUBUN+"]]></value></param>";    
		        aXML+="<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QSDATE+"]]></value></param>";
		        aXML+="<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QEDATE+"]]></value></param>";
           	}
		    aXML+="<param><name>WI_STATE</name><type>varchar</type><length>256</length><value><![CDATA["+WI_STATE+"]]></value></param>";
		    aXML+="<param><name>PI_STATE</name><type>varchar</type><length>256</length><value><![CDATA["+PI_STATE+"]]></value></param>";
		    aXML+="<param><name>MODE</name><type>varchar</type><length>256</length><value><![CDATA["+MODE+"]]></value></param>";
		    aXML+="<param><name>pagenum</name><type>int</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
		    aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
		    aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
		    aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
		    aXML+="<param><name>TITLE</name><type>varchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
		    aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
		    aXML+="<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERDESC+"]]></value></param>";
			break;
		case "OLD-A"	:  //품의함
		    connectionname = "INST_ARCHIVE_ConnectionString";
		    if (pXML == null) pXML = "dbo.usp_wf_worklistdeptquery01A";
		case "OLD-B":  //발신함 (2013-01-24 HIW)
		    connectionname = "INST_ARCHIVE_ConnectionString";
		    if (pXML == null) pXML = "dbo.usp_wf_worklistdeptquery01S";
		case "OLD-REC_COMPLETED"	:  //수신처리함
		    connectionname = "INST_ARCHIVE_ConnectionString";
		    pxslpath = "wf_worklistquery02.xsl";
		    var PF_SUB_KIND = "A";
		    if (sDocListType == "OLD-A") { PF_SUB_KIND = "A"; MODE = "A"; }	
            if (sDocListType == "OLD-B") { PF_SUB_KIND = "S"; MODE = "A"; }	 //추가 (2013-01-24 HIW)		
            if(sDocListType == "OLD-CCINFO"){PF_SUB_KIND = "I";MODE="I";}	
            if(sDocListType == "OLD-REC_COMPLETED"){PF_SUB_KIND = "RC";MODE="RC";}	
			if(pXML==null)pXML = "dbo.usp_wf_worklistdeptquery01RC";
	        if (GUBUN != '' || GROUP_KIND != '' || TITLE!= '' || ORDERFILED != '' || ORDERDESC !='' || d_QSDATE !=''){
	            pXML = "dbo.usp_wf_worklistdeptquery01";
    		    //기간 검색을 위한 파라미터 추가
    		    aXML+="<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA["+GUBUN+"]]></value></param>";
		        aXML+="<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QSDATE+"]]></value></param>";
		        aXML+="<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QEDATE+"]]></value></param>";				
            }
            if(aXML == '' )
                aXML="<param><name>PF_PERFORMER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+OWNER_UNIT_CODE+"]]></value></param>";
            else    
                aXML+="<param><name>PF_PERFORMER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+OWNER_UNIT_CODE+"]]></value></param>";
		    aXML+="<param><name>WI_STATE</name><type>varchar</type><length>256</length><value><![CDATA["+WI_STATE+"]]></value></param>";
		    aXML+="<param><name>PI_STATE</name><type>varchar</type><length>256</length><value><![CDATA["+PI_STATE+"]]></value></param>";
		    aXML+="<param><name>MODE</name><type>varchar</type><length>256</length><value><![CDATA["+MODE+"]]></value></param>";
		    aXML+="<param><name>pagenum</name><type>varchar</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
		    aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
		    aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
		    aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
		    aXML+="<param><name>TITLE</name><type>varchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
		    aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
		    aXML+="<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERDESC+"]]></value></param>";
		    aXML+="<param><name>PI_FINISHED</name><type>varchar</type><length>256</length><value><![CDATA["+PI_FINISHED+"]]></value></param>";
		    aXML+="<param><name>PF_SUB_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+PF_SUB_KIND+"]]></value></param>";
			break;
		case "DIST"	:  //부서 참조/회람함
		    if (pXML == null) connectionname = "FORM_DEF_ConnectionString";
		    if (pXML == null) pXML = "dbo.usp_wf_worklistdeptquery01S";
		    pxslpath = "Circulation\\wfform_tonccquery02.xsl";
		    pExt = "<MODE>TCINFO</MODE>";
			if(pXML==null)pXML = "dbo.usp_wfform_tonccquery01";
	        if ( PI_NAME != '' || PI_INITIATOR_NAME!='' || PI_ETC != '' || GROUP_KIND != '' || TITLE!= '' || ORDERFILED != '' || ORDERDESC !=''){
	            pXML = "dbo.usp_wfform_tonccquery01_dynamic";
	        }			
        	//pXML += "'" + PF_PERFORMER_ID + "','" +  "','" + TITLE + "','" + PAGENUM + "','" + PAGECNT + "','" + QUERYSIZE + "','" + GROUP_KIND + "','" + TITLE + "','" + ORDERFILED + "','" + ORDERDESC +"'";
		    var PF_PERFORMER_DEPT_ID = "";
		    aXML="<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA["+OWNER_UNIT_CODE+"]]></value></param>";
		    aXML+="<param><name>DEPT_ID</name><type>varchar</type><length>1024</length><value><![CDATA["+OWNER_UNIT_CODE+"]]></value></param>";
		    //aXML+="<param><name>SUBJECT</name><type>varchar</type><length>1024</length><value><![CDATA["+PI_NAME+"]]></value></param>";
		    aXML+="<param><name>pagenum</name><type>int</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
		    aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
		    aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
		    aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
		    aXML+="<param><name>TITLE</name><type>varchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
		    aXML+="<param><name>SUBJECT</name><type>varchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
		    aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
		    aXML+="<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERDESC+"]]></value></param>";
			break;
        //=== 이관문서보관함 추가 시작 (2013-01-24 HIW) ===================         case "MIG-INDI_COMPLETED":  //이관문서보관함-개인문서함(완료함)
            connectionname = "STORE_ConnectionString";
            if (pXML == null) pXML = "dbo.usp_wf_worklistquery01complete";
		    pxslpath = "wf_worklistquery02.xsl";
		    MODE = "COMPLETE"; 

	        if (GUBUN != '' || GROUP_KIND != '' || TITLE!= '' || ORDERFILED != '' || ORDERDESC !='' || d_QSDATE !=''){
	            pXML = "dbo.usp_wf_worklistdeptquery01";
    		    //기간 검색을 위한 파라미터 추가
    		    aXML+="<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA["+GUBUN+"]]></value></param>";
		        aXML+="<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QSDATE+"]]></value></param>";
		        aXML+="<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA["+d_QEDATE+"]]></value></param>";				
            }
            if(aXML == '' )
                aXML = "<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_PERFORMER_ID + "]]></value></param>";
            else
                aXML += "<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_PERFORMER_ID + "]]></value></param>";
		    aXML+="<param><name>WI_STATE</name><type>varchar</type><length>256</length><value><![CDATA["+WI_STATE+"]]></value></param>";
		    aXML+="<param><name>PI_STATE</name><type>varchar</type><length>256</length><value><![CDATA["+PI_STATE+"]]></value></param>";
		    aXML+="<param><name>MODE</name><type>varchar</type><length>256</length><value><![CDATA["+MODE+"]]></value></param>";
		    aXML+="<param><name>pagenum</name><type>varchar</type><length>4</length><value><![CDATA["+PAGENUM+"]]></value></param>";
		    aXML+="<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA["+PAGECNT+"]]></value></param>";
		    aXML+="<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA["+QUERYSIZE+"]]></value></param>";
		    aXML+="<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+GROUP_KIND+"]]></value></param>";
		    aXML+="<param><name>TITLE</name><type>varchar</type><length>256</length><value><![CDATA["+TITLE+"]]></value></param>";
		    aXML+="<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERFILED+"]]></value></param>";
		    aXML+="<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA["+ORDERDESC+"]]></value></param>";
		    aXML+="<param><name>PI_FINISHED</name><type>varchar</type><length>256</length><value><![CDATA["+PI_FINISHED+"]]></value></param>";
		    //aXML+="<param><name>PF_SUB_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+PF_SUB_KIND+"]]></value></param>";
		    break;
		case "MIG-INDI_CIRCU":  //이관문서보관함-개인문서함(참조함)
		    connectionname = "STORE_ConnectionString";
		    if (pXML == null) pXML = "dbo.usp_wf_worklistquery01ccinfo ";
		    pxslpath = "wf_worklistquery02.xsl";

		    if (GUBUN != '' || GROUP_KIND != '' || TITLE != '' || ORDERFILED != '' || ORDERDESC != '' || d_QSDATE != '') {
		        pXML = "dbo.usp_wf_worklistdeptquery01";
		        //기간 검색을 위한 파라미터 추가
		        aXML += "<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA[" + GUBUN + "]]></value></param>";
		        aXML += "<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QSDATE + "]]></value></param>";
		        aXML += "<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QEDATE + "]]></value></param>";
		    }
		    if (aXML == '')
		        aXML = "<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_PERFORMER_ID + "]]></value></param>";
		    else
		        aXML += "<param><name>USER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_PERFORMER_ID + "]]></value></param>";
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
		    aXML += "<param><name>PI_FINISHED</name><type>nvarchar</type><length>256</length><value><![CDATA[" + PI_FINISHED + "]]></value></param>";
		    //aXML+="<param><name>PF_SUB_KIND</name><type>varchar</type><length>256</length><value><![CDATA["+PF_SUB_KIND+"]]></value></param>";
		    break;
		case "MIG-DEPT_DRAFT":  //이관문서보관함-부서문서함(품의함)
		    connectionname = "STORE_ConnectionString";
		    if (pXML == null) pXML = "dbo.usp_wf_worklistdeptquery01A";
		    pxslpath = "wf_worklistquery02.xsl";
		    MODE = "DEPART";
		    PF_SUB_KIND = "A";

		    if (GUBUN != '' || GROUP_KIND != '' || TITLE != '' || ORDERFILED != '' || ORDERDESC != '' || d_QSDATE != '') {
		        pXML = "dbo.usp_wf_worklistdeptquery01";
		        //기간 검색을 위한 파라미터 추가
		        aXML += "<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA[" + GUBUN + "]]></value></param>";
		        aXML += "<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QSDATE + "]]></value></param>";
		        aXML += "<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QEDATE + "]]></value></param>";
		    }
		    if (aXML == '')
		        aXML = "<param><name>PF_PERFORMER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + OWNER_UNIT_CODE + "]]></value></param>";
		    else
		        aXML += "<param><name>PF_PERFORMER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + OWNER_UNIT_CODE + "]]></value></param>";
		    aXML += "<param><name>WI_STATE</name><type>varchar</type><length>256</length><value><![CDATA[" + WI_STATE + "]]></value></param>";
		    aXML += "<param><name>PI_STATE</name><type>varchar</type><length>256</length><value><![CDATA[" + PI_STATE + "]]></value></param>";
		    aXML += "<param><name>MODE</name><type>varchar</type><length>256</length><value><![CDATA[" + MODE + "]]></value></param>";
		    aXML += "<param><name>pagenum</name><type>varchar</type><length>4</length><value><![CDATA[" + PAGENUM + "]]></value></param>";
		    aXML += "<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA[" + PAGECNT + "]]></value></param>";
		    aXML += "<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA[" + QUERYSIZE + "]]></value></param>";
		    aXML += "<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA[" + GROUP_KIND + "]]></value></param>";
		    aXML += "<param><name>TITLE</name><type>varchar</type><length>256</length><value><![CDATA[" + TITLE + "]]></value></param>";
		    aXML += "<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERFILED + "]]></value></param>";
		    aXML += "<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERDESC + "]]></value></param>";
		    aXML += "<param><name>PI_FINISHED</name><type>varchar</type><length>256</length><value><![CDATA[" + PI_FINISHED + "]]></value></param>";
		    aXML += "<param><name>PF_SUB_KIND</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_SUB_KIND + "]]></value></param>";
		    break;
		case "MIG-DEPT_SEND":  //이관문서보관함-부서문서함(발신함)
		    connectionname = "STORE_ConnectionString";
		    if (pXML == null) pXML = "dbo.usp_wf_worklistdeptquery01S";
		    pxslpath = "wf_worklistquery02.xsl";
		    MODE = "DEPART";
		    PF_SUB_KIND = "S";

		    if (GUBUN != '' || GROUP_KIND != '' || TITLE != '' || ORDERFILED != '' || ORDERDESC != '' || d_QSDATE != '') {
		        pXML = "dbo.usp_wf_worklistdeptquery01";
		        //기간 검색을 위한 파라미터 추가
		        aXML += "<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA[" + GUBUN + "]]></value></param>";
		        aXML += "<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QSDATE + "]]></value></param>";
		        aXML += "<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QEDATE + "]]></value></param>";
		    }
		    if (aXML == '')
		        aXML = "<param><name>PF_PERFORMER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + OWNER_UNIT_CODE + "]]></value></param>";
		    else
		        aXML += "<param><name>PF_PERFORMER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + OWNER_UNIT_CODE + "]]></value></param>";
		    aXML += "<param><name>WI_STATE</name><type>varchar</type><length>256</length><value><![CDATA[" + WI_STATE + "]]></value></param>";
		    aXML += "<param><name>PI_STATE</name><type>varchar</type><length>256</length><value><![CDATA[" + PI_STATE + "]]></value></param>";
		    aXML += "<param><name>MODE</name><type>varchar</type><length>256</length><value><![CDATA[" + MODE + "]]></value></param>";
		    aXML += "<param><name>pagenum</name><type>varchar</type><length>4</length><value><![CDATA[" + PAGENUM + "]]></value></param>";
		    aXML += "<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA[" + PAGECNT + "]]></value></param>";
		    aXML += "<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA[" + QUERYSIZE + "]]></value></param>";
		    aXML += "<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA[" + GROUP_KIND + "]]></value></param>";
		    aXML += "<param><name>TITLE</name><type>varchar</type><length>256</length><value><![CDATA[" + TITLE + "]]></value></param>";
		    aXML += "<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERFILED + "]]></value></param>";
		    aXML += "<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERDESC + "]]></value></param>";
		    aXML += "<param><name>PI_FINISHED</name><type>varchar</type><length>256</length><value><![CDATA[" + PI_FINISHED + "]]></value></param>";
		    aXML += "<param><name>PF_SUB_KIND</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_SUB_KIND + "]]></value></param>";
		    break;
		case "MIG-DEPT_RECPROCESS":  //이관문서보관함-부서문서함(수신처리함)
		    connectionname = "STORE_ConnectionString";
		    if (pXML == null) pXML = "dbo.usp_wf_worklistdeptquery01RC";
		    pxslpath = "wf_worklistquery02.xsl";
		    MODE = "DEPART";
		    PF_SUB_KIND = "RC";

		    if (GUBUN != '' || GROUP_KIND != '' || TITLE != '' || ORDERFILED != '' || ORDERDESC != '' || d_QSDATE != '') {
		        pXML = "dbo.usp_wf_worklistdeptquery01";
		        //기간 검색을 위한 파라미터 추가
		        aXML += "<param><name>GUBUN</name><type>varchar</type><length>1024</length><value><![CDATA[" + GUBUN + "]]></value></param>";
		        aXML += "<param><name>QSDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QSDATE + "]]></value></param>";
		        aXML += "<param><name>QEDATE</name><type>char</type><length>8</length><value><![CDATA[" + d_QEDATE + "]]></value></param>";
		    }
		    if (aXML == '')
		        aXML = "<param><name>PF_PERFORMER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + OWNER_UNIT_CODE + "]]></value></param>";
		    else
		        aXML += "<param><name>PF_PERFORMER_ID</name><type>varchar</type><length>256</length><value><![CDATA[" + OWNER_UNIT_CODE + "]]></value></param>";
		    aXML += "<param><name>WI_STATE</name><type>varchar</type><length>256</length><value><![CDATA[" + WI_STATE + "]]></value></param>";
		    aXML += "<param><name>PI_STATE</name><type>varchar</type><length>256</length><value><![CDATA[" + PI_STATE + "]]></value></param>";
		    aXML += "<param><name>MODE</name><type>varchar</type><length>256</length><value><![CDATA[" + MODE + "]]></value></param>";
		    aXML += "<param><name>pagenum</name><type>varchar</type><length>4</length><value><![CDATA[" + PAGENUM + "]]></value></param>";
		    aXML += "<param><name>page_size</name><type>int</type><length>4</length><value><![CDATA[" + PAGECNT + "]]></value></param>";
		    aXML += "<param><name>query_size</name><type>int</type><length>4</length><value><![CDATA[" + QUERYSIZE + "]]></value></param>";
		    aXML += "<param><name>GROUP_KIND</name><type>varchar</type><length>256</length><value><![CDATA[" + GROUP_KIND + "]]></value></param>";
		    aXML += "<param><name>TITLE</name><type>varchar</type><length>256</length><value><![CDATA[" + TITLE + "]]></value></param>";
		    aXML += "<param><name>order_field</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERFILED + "]]></value></param>";
		    aXML += "<param><name>order_desc</name><type>varchar</type><length>256</length><value><![CDATA[" + ORDERDESC + "]]></value></param>";
		    aXML += "<param><name>PI_FINISHED</name><type>varchar</type><length>256</length><value><![CDATA[" + PI_FINISHED + "]]></value></param>";
		    aXML += "<param><name>PF_SUB_KIND</name><type>varchar</type><length>256</length><value><![CDATA[" + PF_SUB_KIND + "]]></value></param>";
		    break;
		//=== 이관문서보관함 추가 종료 (2013-01-24 HIW) ===================  
    }

    var szURL = "./getXMLDocListSelect.aspx"; //"../getXMLQuery.aspx";
    //var szURL = "../getXMLList.aspx?admintype=" + admintype;
    var sXML = "<Items><connectionname>"+connectionname+"</connectionname><xslpath><![CDATA[" + pxslpath + "]]></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>" + aXML +"</Items>" ;
	doProgressIndicator(true);
    requestHTTP("POST",szURL,true,"text/xml; charset=utf-8",receiveHTTP, sXML);
}

function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
	m_xmlHTTP.open(sMethod,sUrl,bAsync);
	m_xmlHTTP.setRequestHeader("Accept-Language",g_szAcceptLang);
	m_xmlHTTP.setRequestHeader( "Content-type", sCType);
	if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
	(vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();
}
function receiveHTTP(){
	if(m_xmlHTTP.readyState==4){
		m_xmlHTTP.onreadystatechange=event_noop;
		if(m_xmlHTTP.responseText.charAt(0)=='\r'){
			alert(m_xmlHTTP.responseText);
		}
		else{
			var errorNode=m_xmlHTTP.responseXML.selectSingleNode("response/error");
			if(errorNode!=null){
				alert("Desc: " + errorNode.text);
			}
			else{
//				var m_oXSLProcessor, strXSLFile;
//				switch (sDocListType){
//					case "1":
//					case "2":
//						strXSLFile = "wf_doclistquery01.xsl"; 	break;
//					//<유미
//					case "TCINFO":
//					    strXSLFile = "../Circulation/wfform_tonccquery01.xsl";   break;
//					//유미>
//					default:
//						strXSLFile = "../wf_worklistquery01.xsl"; //완료함
//						break;
//				}
//				m_oXSLProcessor = makeProcessor(strXSLFile);
//				m_oXSLProcessor.input = m_xmlHTTP.responseXML;
//				switch (sDocListType){
//					case "0":
//					case "2":
//						m_oXSLProcessor.addParameter("sortby", "SERIAL_NUMBER");	break;
//					default:
//						m_oXSLProcessor.addParameter("sortby", "");	break;
//				}
//				if ( page == "") { page = 1;}

//				m_oXSLProcessor.addParameter("iPage", page);
//				m_oXSLProcessor.addParameter("iPageSize", pagecnt);
//				m_oXSLProcessor.transform();

//				m_objXML.loadXML(m_oXSLProcessor.output);

//				processXml();
//				//(truthBeTold)?document.location.reload():processXml();
		      //m_objXML.loadXML(m_xmlHTTP.responseXML.documentElement.xml);
			    m_objXML = m_xmlHTTP.responseXML;
              processXml();

			}
		}
	}
}


function processXml(){
	//parent.window.totalpage.innerHTML= page + "/" +m_objXML.selectSingleNode("response/totalpage").text;
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
    var endPage = m_objXML.selectSingleNode("response/totalpage").text;
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
	    //(i==page)? pageList += "<a style='color: #555555;font-weight: bold; '>" + i + "</a>&nbsp;" :pageList += "<a style='color: #4e6fa6;cursor:hand;' onclick='go_page(" + i + ")'>" + i + "</a>&nbsp;" ;
	}
	parent.document.getElementById("totalpage").innerHTML = pageList;
	
	g_totalpage = m_objXML.selectSingleNode("response/totalpage").text;
	g_totalcount = m_objXML.selectSingleNode("response/totalcount").text;	
	processXmlData(m_objXML);
	doProgressIndicator(false); 

}
function makeProcessor(urlXsl){
	var oXslDom = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
	oXslDom.async = false;
	if(!oXslDom.load(urlXsl)){
		alertParseError(oXslDom.parseError);
		throw new Error(-1,"couldn't make TemplateProcessor with ["+urlXsl+"].");
	}
	var oXSLTemplate = new ActiveXObject("MSXML2.XSLTemplate");
	oXSLTemplate.stylesheet = oXslDom;
	return oXSLTemplate.createProcessor();
}
/*
function sortColumn(szClm){

	var oOrderNode = g_oSSXML.selectSingleNode("response/xsl:for-each/@order-by");
	if(szClm == 'serial') szClm = 'number('+szClm+')';
	if(oOrderNode.text == "+ " + szClm)
		oOrderNode.text = "- " + szClm;
	else
		oOrderNode.text = "+ " + szClm;
		
	gOrder = oOrderNode.text;
	
	if(m_xmlHTTP.responseXML.xml != ""){
		clearContents();
		go_page(page);
		//processXmlData(m_objXML);

		doProgressIndicator(false); 
	}else if (m_objXML.documentElement.childNodes.length == 0){
		clearContents();
		displayZero(true);
	}
}
*/
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
		g_eErrorDiv.innerText = "조회된 결과가 없습니다";
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
	//objXML.documentElement.transformNodeToObject(g_oSSXML.documentElement,m_objXML);

//	var m_oXSLProcessor;
//	switch (sDocListType)
//	{
//	case "0": m_oXSLProcessor = makeProcessor("regdoclistselect.xsl");break;
//	case "1": m_oXSLProcessor = makeProcessor("regdoclistselect.xsl");break;
//	case "2": m_oXSLProcessor = makeProcessor("recdoclistselect.xsl");break;
//	case "3": m_oXSLProcessor = makeProcessor("pubregdoclistselect.xsl");break;
//	case "4": m_oXSLProcessor = makeProcessor("pubrecdoclistselect.xsl");break;
//	case "5": m_oXSLProcessor = makeProcessor("sealdoclistselect.xsl");break;
//	case "6": m_oXSLProcessor = makeProcessor("reqrecdoclistselect.xsl");break;
//	case "7": m_oXSLProcessor = makeProcessor("senddoclistselect.xsl");break;
//    //<유미
//	case "TCINFO":xslURL="../Circulation/listitemsXSLTOnCCSelect.aspx"; m_oXSLProcessor = makeProcessor(xslURL); break;
//	//case "TCINFO":xslURL="../Circulation/wfform_tonccquery01.xsl"; break; 
//	//유미>
//	default://m_oXSLProcessor = makeProcessor("listitemsselect.xsl");break;
//	    m_oXSLProcessor = makeProcessor("ListItemsSelectXSL.aspx");break;
//	}
//	m_oXSLProcessor.input = m_objXML;
//	m_oXSLProcessor.addParameter("totalcount", g_totalcount);
//	m_oXSLProcessor.addParameter("pagenum", page);
//	m_oXSLProcessor.transform();
//	//alert(m_oXSLProcessor.output);
//	divGalTable.innerHTML = m_oXSLProcessor.output;
//	
    document.getElementById("divGalTable").innerHTML = objXML.selectSingleNode("response/listhtml").xml;
    
    g_eGalTable = document.getElementById("tblGalInfo");
    if(g_eGalTable!=null){
//        if(window.addEventListener){           
//            g_eGalTable.addEventListener("mousedown",event_GalTable_ondblclick, false);
//        }else{	   
//            g_eGalTable.attachEvent("onmousedown",event_GalTable_ondblclick);	    
//        }
	}
	
	//상단 아이프레임 높이
	if (parent.cboDocListType != null){
		//try{parent.docList.frameElement.height = (g_eGalTable.rows.length-3)*27;}catch(e){}
	}
}
function event_GalTable_onmousedown(){
	if (event.srcElement.tagName != "THEAD" && event.srcElement.tagName != "TABLE" ){
		eTR = event.srcElement.parentElement;
		while(eTR.tagName != "TR"){
			eTR = eTR.parentElement;
		}
		g_eCurrentRow = eTR;
			
		if(g_eCurrentRow != null){
			if(event.ctrlKey){
				m_objRowRange = null;
				var fFire = false;												
				if (g_eCurrentRow.className == "rowselected")
					mf_unselectRecord(g_eCurrentRow);
				else
					mf_selectRecord(g_eCurrentRow);

				//search.focus();
			}
			else if(event.shiftKey){
				if (m_objRowRange == null){
				   if (m_objRowLastSelected != null){
						mf_unselectAll(g_eCurrentRow);
						m_objRowRange = new RowRange(m_objRowLastSelected, g_eCurrentRow);
					}
					else{
						m_objRowRange = new RowRange(g_eCurrentRow, g_eCurrentRow);
					}
				}
				else{
					m_objRowRange.endRow = g_eCurrentRow;
					m_objRowRange.update();
					m_objRowLastSelected = g_eCurrentRow;
				}				
				//search.focus()
			}
			else{
				m_objRowRange = null;
				mf_unselectAll(g_eCurrentRow);
				mf_selectRecord(g_eCurrentRow);
			}
		}
	}
}
function mf_unselectAll(objcol){
	for (var x=g_eGalTable.rows.length-1; x >= 1; x--){
		if(g_eGalTable.rows[x].className == "rowselected" && objcol.sourceIndex != g_eGalTable.rows[x].sourceIndex){
			g_eGalTable.rows[x].setAttribute("className","rowunselected");
			g_eGalTable.rows[x].style.backgroundColor ="#ffffff";// "transparent";
			g_eGalTable.rows[x].style.color ="#333333";// "windowtext";
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
function mf_selectRecord(objRecord){
	var retval = true;	
	if (objRecord != null && objRecord != false){
		if (objRecord.className  != "rowselected"){
			m_objRowLastSelected = objRecord;			
			objRecord.setAttribute("className","rowselected");
			objRecord.style.backgroundColor = "#FAE6BA";//"highlight";
			objRecord.style.color ="#333333";// "highlighttext";
		}
	}
	else{
		retval = false;
	}
	return(retval);
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
		objSelector.setAttribute("className","rowSelectedException");
		mf_unselectAll(objSelector);
		objSelector.setAttribute("className","rowselected");
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
function event_GalTable_ondblclick(){
    if (event != null){

	if (event.srcElement.parentElement.parentElement.tagName != "THEAD" && event.srcElement.parentElement.parentElement.tagName != "TABLE" ){
		if (g_eCurrentRow != null){
			g_eCurrentRow.setAttribute("className","rowunselected");
			g_eCurrentRow.style.backgroundColor = "#ffffff";//"transparent";
			g_eCurrentRow.style.color = "#333333";//"windowtext";
		}
		eTR = event.srcElement.parentElement;
		while(eTR.tagName != "TR"){
			eTR = eTR.parentElement;
		}
		eTR.setAttribute("className","rowselected");
		g_eCurrentRow = eTR;
		g_eCurrentRow.style.backgroundColor ="#FAE6BA";// "HIGHLIGHT";
		g_eCurrentRow.style.color = "#333333";//"HIGHLIGHTTEXT";
		processSelectedRow();
	}
	}
}
function processSelectedRow(){	

	if (getRowAttribute(g_eCurrentRow,"fmid") != ''){
		var strURL ="../Forms/Form.aspx?mode=COMPLETE" + "&piid=" + getRowAttribute(g_eCurrentRow,"piid")  + "&bstate=" + getRowAttribute(g_eCurrentRow,"bstate")
					+ "&fmid=" + getRowAttribute(g_eCurrentRow,"fmid") + "&fmnm=" + toUTF8(getRowAttribute(g_eCurrentRow,"fmnm"))
					+ "&fmpf=" + getRowAttribute(g_eCurrentRow,"fmpf") + "&fmrv=" + getRowAttribute(g_eCurrentRow,"fmrv") + "&fiid=" + getRowAttribute(g_eCurrentRow,"fiid")
					+ "&ftid=" + getRowAttribute(g_eCurrentRow,"ftid") + "&fitn=" + getRowAttribute(g_eCurrentRow,"fitn") + "&scid=" + getRowAttribute(g_eCurrentRow,"scid")
					+ "&pfsk=" + getRowAttribute(g_eCurrentRow,"pfsk")+ "&pidc=" + "&pibd1=" + toUTF8(getRowAttribute(g_eCurrentRow,"pibd1"));	//toUTF8(getRowAttribute(g_eCurrentRow,"pidc")) + 	
		openWindow(strURL,"FormLink",800,600,'resize');
	}

}
function getRowAttribute(elm,sName){var v=elm.getAttribute(sName);return (v==null?"":v);}
function addAddress(rgData,szWI,szPI){
	var eTD;
	var eTR = g_eGalTable.insertRow();
	eTR.setAttribute("className","rowunselected");
	eTR.setAttribute("workitemid",szWI);
	eTR.setAttribute("processid",szPI);
	eTR.attachEvent("onkeydown",event_row_onkeydown);
	eTR.attachEvent("onkeyup",event_row_onkeyup);
	eTR.attachEvent("onselectstart",event_row_onselectstart);

	for (var x=0;x<rgData.length;x++){
		if (x!=1){
			eTD = eTR.insertCell();
			eTD.valign = "top";
			eTD.noWrap=true;
			eTD.style.overflow = "hidden";
			eTD.style.paddingRight = "1px";
			eTD.innerHTML = rgData[x];
		}
		else{
			eTD = eTR.insertCell();
			eTD.valign = "top";
			eTD.noWrap=true;
			eTD.style.paddingRight = "1px";
			eTD.innerHTML = rgData[x];
		}
	}
}
function addMessage(szMsg){
	var re = /항목을 찾을 수 없습니다./i;
   
	if(szMsg.search(re)!=-1) szMsg = "Could not find the matching item.";
	g_eErrorDiv.innerText = szMsg;
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
		eTR.setAttribute("className","rowselected");
		g_eCurrentRow = eTR;
		g_eCurrentRow.style.backgroundColor = "highlight";
		g_eCurrentRow.style.color = "highlighttext";		
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
function cmdSearch_onClick(){
	strSearch = parent.window.search.value;
	if (strSearch==""){
		alert("검색어를 입력하세요.");
	}
	else{
		clearContents();
		queryGetData();
	}
}
function cmdSearch_onClick(strGubun,  strSearch, QSDATE, QEDATE){//debugger;
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
    } else if (gSearch == "") {

        if (language == "zh-CN") 
        {
	         alert("请输入搜索关键字。");//20161021
             return;
        }
        else {
            //2017.1.31 PSW 수정 
             //alert(gMessage001);//"검색어를 입력하십시오"
             //return;
        }
	    
	}
	checkccinfo = "Y"; //201808 참조회람함 추가
	clearContents();
	queryGetData();
    page=1;gOrder='';
		//(gLocation == "TEMPSAVE")?TempQueryGetData():queryGetData();
	
}

function go_page(pagegb){

    if(g_totalpage < 2)
    {
        //return;
    }
    
	var currPage = 1;
	switch (pagegb)	{
	case "f"  :	currPage=1;break;
	case "p" :	currPage=(parseInt(page)-1);break;
	case "n" :	currPage=(parseInt(page)+1);break;
	case "l"  :	currPage=g_totalpage;break;
	default:		currPage=pagegb;break;
	}

	if (parseInt(currPage) < 1) currPage = 1;
	if (parseInt(currPage) > parseInt(g_totalpage)) currPage = g_totalpage;
	page = currPage;

	queryGetData()

	/*var m_oXSLProcessor, strXSLFile;
	strXSLFile = "wf_doclistquery01.xsl"; 

	m_oXSLProcessor = makeProcessor(strXSLFile);
	m_oXSLProcessor.input = m_xmlHTTP.responseXML;
	m_oXSLProcessor.addParameter("sortby", "SERIAL_NUMBER");
	if ( page == "") { page = 1;}

	m_oXSLProcessor.addParameter("iPage", page);
	m_oXSLProcessor.addParameter("iPageSize", pagecnt);
	m_oXSLProcessor.transform();
	m_objXML.loadXML(m_oXSLProcessor.output);

	processXml();
	*/

	/*
	var url="listitems.aspx?uid=" + uid + "&location=" + gLocation + "&kind=" + kind + "&title=" + gTitle + "&page=" + page+"&label="+gLabel;
	window.open(url,"_self");
	*/
}

function openpopup(){
	var	pi_id = getRowAttribute(g_eCurrentRow,"piid");
	//alert(pi_id);
	var szURL = "ReceiptList.aspx?PIID=" + pi_id;
	//alert(szURL );
	CoviWindow(szURL, "newMessageWindow", 550, 300, "resize") ;
}

function CoviWindow(fileName,windowName,theWidth,theHeight,etcParam) {	
	var x = theWidth;
	var y = theHeight;

	var sx = window.screen.width  / 2 - x / 2;
	var sy = window.screen.height / 2 - y / 2 - 40;
	if (etcParam == 'fix') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0";
	}
	else if (etcParam == 'resize') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1";
	}
	else if (etcParam == 'scroll') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1";
	}
	if (sy < 0 ) {
		sy = 0;
	}
	var sz = ",top=" + sy + ",left=" + sx;
	if (windowName == "newMessageWindow" || windowName == "") {
		windowName = new String(Math.round(Math.random() * 100000));
	}
	var strNewFearture = ModifyWindowFeature(etcParam + ",width=" + x + ",height=" + y + sz);
    window.open(fileName,windowName,strNewFearture);
    //window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
	//objNewWin =  window.showModalDialog(fileName, windowName,"dialogHeight:400px;dialogWidth:350px;status:no;resizable:yes;help:no;")   
}
/*
function go_page(page){
	var szURL = "DocListItems.aspx?doclisttype=" + sDocListType + "&page=" + page + "&strMONTH=" + sMonth;
	window.open(szURL,"_self");
}
*/
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