﻿<%@ Page Language="C#"  ValidateRequest="false" AutoEventWireup="true" CodeFile="FormLink4KCCP.aspx.cs" Inherits="Approval_Forms_FormLink4KCCP" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>결재연동양식연결</title>
    <script language="javascript" type="text/javascript">
        var m_cvtXML = new ActiveXObject("MSXML2.DOMDocument").createTextNode("");
        function window.onload(){
            var userid = '<%=userid %>';
            var passwd = '<%=passwd%>';
            var security = '<%=security%>';
            var gw_num = '<%=gw_num%>';
            var title = '<%=title%>';
            var htmmess = '<%=htmmess%>';
            var title = '<%=title%>';
            var htmmess = '<%=htmmess%>';
            var ing_status = '<%=ing_status%>';
            var end_status = '<%=end_status%>';
            var EAID = '<%=EAID%>';  
            
            //fmbd 만들기
            
            var fmbdxml = "";
            fmbdxml = makeNode("USERID",userid);
            fmbdxml += makeNode("PASSWD",passwd);
            fmbdxml += makeNode("SECURITY",security);
            fmbdxml += makeNode("GW_NUM",gw_num);
            fmbdxml += makeNode("SUBJECT",title, null, true);
            fmbdxml += makeNode("tbContentElement",htmmess,null,true);
            fmbdxml += makeNode("INT_STATUS",ing_status);
            fmbdxml += makeNode("END_STATUS",end_status);
            fmbdxml += makeNode("EAID",EAID);
            fmbdxml = "<BODY_CONTEXT>"+fmbdxml+"</BODY_CONTEXT>";
            form1.fmbd.value = fmbdxml;
            //submit호출
            form1.submit();          
        }
        function makeNode(sName,vVal,sKey,bCData) {
	        if(vVal==null){	m_cvtXML.text = dField[(sKey!=null?sKey:sName)].value;	}else{	m_cvtXML.text = vVal;	}
	        return "<"+sName+">"+(bCData?"<![CDATA[":"")+(bCData?m_cvtXML.text+"]]>":m_cvtXML.xml)+"</"+sName+">";
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
    </script>
</head>
<body>
    <form id="form1" action="Form.aspx?fmid=<%=fmid %>&scid=<%=scid %>&fmpf=<%=fmpf %>&fmrv=<%=fmrv %>&mode=DRAFT&fmnm=<%=fmnm %>" method="post">
       <textarea id="fmbd" name="fmbd" cols="10" rows="10" style="display:none"></textarea>
    </form>
</body>
</html>
