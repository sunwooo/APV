<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListGroup.aspx.cs" Inherits="COVIFlowNet_ListGroup" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>리스트 그룹핑</title>
	<script type="text/javascript" language="javascript" src="/CoviWeb/common/script/CFL.js"></script>
	<script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/utility.js"></script>  
</head>
<body leftmargin="0" rightmaring="0" topmargin="0">
    <div style="width: 100%" id="lists"></div>
    <script type="text/javascript" language="javascript">
        var UserID="<%=UserID%>";
        var mLocation="<%=Location%>";
        var mMode="<%=Mode%>";
        var gKind="<%=gKind%>";
        var gLabel ="<%=Request.QueryString["gLabel"]%>";
        var gmsg_101 = "<%=Resources.Approval.msg_101 %>";
        var sEntcode ="<%=sEntcode%>";
        var view="";
        var m_xmlHTTP = CreateXmlHttpRequest();
        var oldViewNo = "0" ;
        var fldrName = "" ;
        var bArchived = false ;
		//장혜인 2011-02-01 bstored 변수추가
		var bstored = parent.bstored;
        var gTotalCount = 0;
        var a,ua = navigator.userAgent;
        this.agent= { 
            safari    : ((a=ua.split('AppleWebKit/')[1])?(a.split('(')[0]).split('.')[0]:0)>=412 ,
            konqueror : ((a=ua.split('Konqueror/')[1])?a.split(';')[0]:0)>=3.4 ,
            mozes     : ((a=ua.split('Gecko/')[1])?a.split(" ")[0]:0) >= 20011128 ,
            opera     : (!!window.opera) && (document.body.style.opacity=="") ,
            msie      : (!!window.ActiveXObject)?(!!(new ActiveXObject("Microsoft.XMLHTTP"))):false 
        }   
		var btoUtf = ((this.agent.safari || this.agent.konqueror || this.agent.opera)?false:true);
        var gLngIdx = <%=strLangIndex %>;
   
        function init()
        {	//debugger 
         
            if (gKind != "total"){
	            bArchived =parent.bArchived;
		        var szURL ="workgroup.aspx?uid=" + toUTF8(UserID) + "&location=" + mLocation + "&mode=" + mMode + "&kind=" + gKind+ "&bArchived=" + String(parent.bArchived)+ "&bstored=" + String(parent.bstored)+  "&admintype=" + String(parent.admintype)+ "&subkind=<%=Request.QueryString["subkind"]%>";
		        if (String(parent.admintype) == "MONITOR") szURL+= "&startdate=" + String(parent.document.getElementById("SEARCHDATE").value);
		        if (mLocation == "FOLDER") szURL+= "&entcode=" + sEntcode ;
			    requestHTTP("GET",szURL,true,"text/xml",getxml,null);//false
	        }
        }
        		
        function getxml()
        {
	        if(m_xmlHTTP.readyState == 4)
	        {
        		m_xmlHTTP.onreadystatechange=event_noop;
            	var m_oXSLProcessor;
            	
            	var elmlist = m_xmlHTTP.responseXML.documentElement.selectNodes("//Table");
            	var szHTML = "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
            	szHTML +="<tr><td height=\"2px\" class=\"BTable_bg01\"></td></tr>";
            	szHTML +="<tr><td height=\"1\" class=\"BTable_bg03\"></td></tr>";
            	if(elmlist.length < 1){
            		szHTML +="<tr style=\"height:25px\"><td nowrap=\"true\" align=\"center\">"+gmsg_101+"</td></tr>";
            	}else{
            		for(var i=0; i < elmlist.length ; i++){
            			var elm = elmlist.nextNode();
						szHTML +="	<tr style=\"height:25px\">";
						szHTML +="		<td nowrap=\"true\" onselect=\"false\">";
						szHTML +="			<a href=\"javascript:view_list("+i+",\'"+elm.selectSingleNode("kind").text+"\',\'"+elm.selectSingleNode("field").text+"\',"+elm.selectSingleNode("fieldcount").text+");\">";
						szHTML +="				<div style=\"font-family:Arial,돋움;font-size:9pt;	color:#666666;	line-height:16px;	work-break:break-all;font-weight: bold;padding-top: 5px; padding-left: 6px; \" ";
						szHTML +="					id=\"image_"+i+"\">";
						szHTML +="					<img id=\"image2_"+i+"\" src=\"/GWImages/common/btn/btn_icon_down.gif\" border=\"0\" align=\"absmiddle\" />"+ getLngLabel(elm.selectSingleNode("field").text,false)+"("+elm.selectSingleNode("fieldcount").text+")";
						szHTML +="				</div>";
						szHTML +="			</a>"
						szHTML +="			<div id=\"list_"+i+"\"></div>";
						szHTML +="		</td>";
						szHTML +="	</tr>";	            		
	            		
            		}
            	}
             	szHTML +="</table>";
				document.getElementById("lists").innerHTML =    szHTML;         	
           	
	            gTotalCount = m_xmlHTTP.responseXML.documentElement.selectNodes("//Table").length;
				//try{parent.iworklist.frameElement.height = gTotalCount*25 + 10; }catch(e){}//lists.offsetHeight
//				try{
//				    if (gTotalCount !=0){parent.iworklist.frameElement.height = gTotalCount*25 + 10;}
//				    else{parent.iworklist.frameElement.height = 30;} 
//			    }
//			    catch(e){}//lists.offsetHeight
	        }
        }
        		
        function view_list(no,kind,title,rowcount)
        {
	        var size;
	        size = (rowcount * 25 + 30 + 30)+"px";
	        var div= document.getElementById("list_"+no);
	        var div2=document.getElementById("image_"+no);
	        var check_no=check(no);
	        var szURL = "";

            if (!btoUtf){
                if (String(parent.admintype) == "MONITOR"){
                    szURL = "listitems.aspx?uid="+ UserID +"&Location="+mLocation+"&Kind="+gKind+"&title="+title+ "&admintype=" + String(parent.admintype)  + "&startdate=" + String(parent.SEARCHDATE.value)+"&label="+gLabel; 
                }else{
                    szURL = "listitems.aspx?uid="+ UserID +"&Location="+mLocation+"&Kind="+gKind+"&title="+title+ "&admintype=" + String(parent.admintype)  + "&label="+gLabel;
                }
            }else{	        
                if (String(parent.admintype) == "MONITOR"){
                    szURL = "listitems.aspx?uid="+ toUTF8(UserID) +"&Location="+mLocation+"&Kind="+gKind+"&title="+escape(title)+ "&admintype=" + String(parent.admintype)  + "&startdate=" + String(parent.SEARCHDATE.value)+"&label="+toUTF8(gLabel); 
                }else{
                    szURL = "listitems.aspx?uid="+ toUTF8(UserID) +"&Location="+mLocation+"&Kind="+gKind+"&title="+escape(title)+ "&admintype=" + String(parent.admintype)  + "&label="+toUTF8(gLabel);
                }
            }
            if (mLocation == "FOLDER") szURL+= "&entcode=" + sEntcode ;
	        if(check_no==1)
	        {
		        oldViewCollapse(no,title,rowcount) ;
		        var golist;
		        if (String(parent.admintype) == "MONITOR"){ 
    		        golist="<IFRAME ID='ifrDL' FRAMEBORDER=0 height='"+ size +"' width='100%' SRC='"+ szURL +"'></IFRAME>";	
		        }else{
    		        golist="<IFRAME ID='ifrDL' FRAMEBORDER=0 height='"+ size +"' width='100%' SRC='"+ szURL +"'></IFRAME>";	
		        }
		        
		        div.innerHTML= golist;
		        div.style.display="";
		        div2.innerHTML="<img id=\"image2_"+no+"\" src='/GWImages/common/btn/btn_icon_up.gif' border='0' /> " + getLngLabel(title,false)+" ("+rowcount+")";//+ kind + " : " 
		        //div2.style.backgroundColor='slategray';
		        view=view+ ","+no+"_0";
	        }
	        else if(check_no==2)
	        {
		        div.innerHTML="";
		        div.style.display="none";
		        div2.innerHTML="<img id=\"image2_"+no+"\" src='/GWImages/common/btn/btn_icon_down.gif' border='0' /> "+ getLngLabel(title,false)+" ("+rowcount+")";// + kind + " : " 
		        //div2.style.backgroundColor='';
		        view = view.replace(","+no+"_0" , ","+no+"_1");
	        }
	        else
	        {
		        oldViewCollapse(no,title,rowcount) ;
		        var golist;
		        if (String(parent.admintype) == "MONITOR"){ 
    		        golist="<IFRAME id='ifrDL' FRAMEBORDER=0  height='"+ size +"' width='100%' SRC='"+ szURL +"'></IFRAME>";	
		        }else{
    		        golist="<IFRAME id='ifrDL' FRAMEBORDER=0  height='"+ size +"' width='100%' SRC='"+ szURL +"'></IFRAME>";	
		        }
		        
		        div.innerHTML= golist;
		        div.style.display="";
		        div2.innerHTML="<img id=\"image2_"+no+"\" src='/GWImages/common/btn/btn_icon_up.gif' border='0' /> "+ getLngLabel(title,false)+" ("+rowcount+")";// + kind + " : " 
		        //div2.style.backgroundColor='slategray';
		        view = view.replace( ","+no+"_1" , ","+no+"_0");
	        }
					//try{parent.iworklist.frameElement.height =  gTotalCount*25 + 20 + size+ 30; }catch(e){}
	        
        }		

        function oldViewCollapse(no,title,rowcount) {
	        if(oldViewNo != no) {
		        document.getElementById("list_"+oldViewNo).innerHTML="";
		        document.getElementById("list_"+oldViewNo).style.display="none";
		        //document.getElementById("image_"+oldViewNo).src = "/GWImages/common/btn/btn_icon_down.gif" ;
		        //document.getElementById("image2_"+oldViewNo).innerHTML="<img  src='/GWImages/common/btn/btn_icon_down.gif' border='0' /> "+ getLngLabel(title,false)+" ("+rowcount+")";
		        document.getElementById("image2_"+oldViewNo).src = "/GWImages/common/btn/btn_icon_down.gif" ;


		        view = view.replace(","+oldViewNo+"_0" , ","+oldViewNo+"_1");
	        }
	        oldViewNo = no ;
        }

        function check(no)
        {
	        var temp = ","+no +"_";
	        var str=view.indexOf(temp);
        	
	        if(str >= 0)
	        {	
		        var temp2 = temp +"0"
		        var str2 = view.indexOf(temp2);
		        if(str2 >=0)
		        {return 2;} 
		        else
		        {return 3;} 
	        }
	        else
	        {
		        return 1;
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
//            var oXSL = "";
//            var oXslDom = CreateXmlDocument();
//            if (urlXsl.indexOf(".xsl") > -1){
//                oXslDom.async = false;
//                oXslDom.load(urlXsl);
    //        }else{
                var oXMLHttp =  CreateXmlHttpRequest();
	            oXMLHttp.open("GET",urlXsl,false);
	            oXMLHttp.send();
	            //시간 늘리기
	            delay(300);
	            if ( oXMLHttp.status == 200){
		           var parser = new DOMParser();
                  oXslDom = parser.parseFromString(oXMLHttp.responseText,"text/xml");
                  //oXSL = oXMLHttp.responseText.substring(38,oXMLHttp.responseText.length) ;
	            }
    //        }
    //        }
            var oProcessor = new XSLTProcessor();
            oProcessor.importStylesheet(oXslDom);
            return oProcessor;
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
     function checkAjaxBrowser() {
        var a,ua = navigator.userAgent;
        this.agent= { 
        safari    : ((a=ua.split('AppleWebKit/')[1])?(a.split('(')[0]).split('.')[0]:0)>=412 ,
        konqueror : ((a=ua.split('Konqueror/')[1])?a.split(';')[0]:0)>=3.4 ,
        mozes     : ((a=ua.split('Gecko/')[1])?a.split(" ")[0]:0) >= 20011128 ,
        opera     : (!!window.opera) && (document.body.style.opacity=="") ,
        msie      : (!!window.ActiveXObject)?(!!(new ActiveXObject("Microsoft.XMLHTTP"))):false 
        }
        return (this.agent.safari || this.agent.konqueror || this.agent.opera)
      }
             
    </script>
	<script type="text/javascript" language="javascript">
		init();
	</script>
</body>
</html>
