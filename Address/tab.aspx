<%@ Page Language="C#" AutoEventWireup="true" CodeFile="tab.aspx.cs" Inherits="COVIFlowNet_Address_tab" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <script type="text/javascript" language="javascript" src="/coviweb/SiteReference/js/Utility.js"></script>
    <script type="text/javascript" language="javascript" src="/CoviWeb/common/script/jquery-1.6.1.min.js"></script>
</head>
<body>
<!-- 왼쪽 div 시작 -->
<div>
  <!-- 탭 div 시작 -->
  <div class="tab01 small">
    <ul>
      <li id="divtSearch" style="display:;" class="current"><a href="#" onclick="javascript:changeTab(this.name)" id="tSearch" name="tSearch"><span><%= Resources.Approval.lbl_search%></span></a><!--검색--></li>      
      <li id="divtGroup" style="display:;" ><a href="#" onclick="javascript:changeTab(this.name)" id="tGroup" name="tGroup"><span><%= Resources.Approval.lbl_org %></span></a><!--조직도--></li>      
    </ul>&nbsp;&nbsp;<select id='SelEnt' onchange="SetENT(this.value)" style="display:none;"></select>
  </div>
  <!-- 탭 div 끝 -->
  <!-- 컬러 라인 시작 -->  
  <div class="popup_line BTable_bg01"></div>
  <!-- 컬러 라인 끝 -->
  <div class="iframe_border" id="spantSearch" name="tSearch" style='display:;'>
    <iframe id="ifrSearch" name="iSearch" width="100%" height="190" frameborder="0" src="search.aspx?Ent="
	datasrc="search.aspx?Ent=<%=Session["user_ent_code"].ToString()%>" style='PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px;overflow:auto;'></iframe>
  </div>
  <div class="iframe_border" id="spantGroup" name="tGroup" style='display:none;'>
    <iframe id="ifrGroup" name="iGroup" width="100%" height="190" frameborder="0" src='dl.aspx?Ent=<%=Session["user_ent_code"].ToString()%>'
	datasrc="dl.aspx?Ent=<%=Session["user_ent_code"].ToString()%>" style='PADDING-RIGHT:0px; PADDING-LEFT:0px; PADDING-BOTTOM:0px; MARGIN:0px; PADDING-TOP:0px;overflow:auto;'></iframe>
  </div>
</div>
<!-- 왼쪽 div 끝 -->
		<span id="tooltip" class="tooltip"></span>
		<script language="javascript" type="text/javascript">

		    var gEntCode = "<%= gEntCode %>";

		    $(window).load(function () {

		        //$("#SelEnt").val(gEntCode);  //HIW
		        
		        //추가 (2013-03-20 HIW)
		        if (parent.location.href.indexOf("From=ReceiptList") > -1) {
		            document.getElementById("divtSearch").style.display = "none";
		            changeTab("tGroup");
		        }
		    });


            //var m_oSelTab = self.tSearch;//tGroup;
            var m_oSelTab = self.document.getElementById("tSearch");//tGroup;

            if(getArg("bGroup",false)||getArg("bRecp",false)){
	            //tGroup.style.display="block";
	            //tSearch.style.display="block";
	            document.getElementById("tGroup").style.display="block";
	            document.getElementById("tSearch").style.display="block";
            }
            if(getArg("bUser",false)){
	            //dftManager.style.display="block";
	            //tGroup.style.display="block";
	            //tSearch.style.display="block";
	            document.getElementById("tGroup").style.display="block";
	            document.getElementById("tSearch").style.display="block";
            }
            if(getArg("bRef",false)){
	            //tGroup.style.display="block";
	            //tSearch.style.display="block";
	            document.getElementById("tGroup").style.display="block";
	            document.getElementById("tSearch").style.display="block";
            }

            function getArg(sArgName,vDefault){
	            try{
		            return parent.parent.dialogArguments[sArgName];
	            }
	            catch(e){
		            return vDefault;
	            }
            }

            var selTab = "tSearch";

            function changeTab(selObject) {
            
		        if (document.getElementById(selObject).name != selTab) {
        			document.getElementById("div"+selTab.replace("_","")).className = "" ;
                    document.getElementById("div"+selObject.replace("_","")).className = "current" ;   
			        document.getElementById('span'+selTab).style.display = "none" ;
        			
			        document.getElementById('span'+selObject).style.display ="" ;
			        selTab = selObject;
			        if(selTab.indexOf("tSearch") > -1 ){
		                document.getElementById("ifrGroup").m_objResultWin = parent.ListItems;
		                //document.getElementById("ifrGroup").setSourceList();
			        }else{
			            //ifrGroup.init();
			            document.getElementById("ifrGroup").contentWindow.init();
			        }
		        }
            }
		</script>
		<script type="text/javascript" language="javascript" defer="defer">
            //var	m_xmlHTTP = new ActiveXObject("MSXML2.XMLHTTP");
            var	m_xmlHTTP = CreateXmlHttpRequest();
	        var sEntGroupYN = "<%=ConfigurationManager.AppSettings["WF_ENTGROUPYN"] %>";		    
            document.getElementById("SelEnt").value = '<%=Session["user_ent_code"].ToString()%>';
            if(sEntGroupYN == "T") GetEnt();
            function SetENT(m_EntCode)
            {
                //ifrGroup.src = "dl.aspx?Ent="+m_EntCode;
                //ifrGroup.frameElement.src ="dl.aspx?Ent="+m_EntCode;
                //ifrSearch.frameElement.src ="search.aspx?Ent="+m_EntCode;
                document.getElementById("ifrGroup").contentWindow.frameElement.src = "dl.aspx?Ent=" + m_EntCode;
                document.getElementById("ifrSearch").contentWindow.frameElement.src = "search.aspx?Ent=" + m_EntCode;                
            }
            function GetEnt(){
                
                /* parameter type 숫자값
                Data.SqlDbType.NChar : 10
                Data.SqlDbType.NText :11
                Data.SqlDbType.VarChar : 12
                Data.SqlDbType.Char : 3
                Data.SqlDbType.VarChar : 22
                Data.SqlDbType.Int : 8
                Data.SqlDbType.DateTime : 4
                */
                
                var pXML = "dbo.usp_GetEntInfo";
                var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type></Items>" ;
                var szURL = "../GetXMLQuery.aspx";
                requestHTTP("POST",szURL,true,"text/xml",receiveHTTP, sXML);
            }

            function event_noop(){return;}
            
            function requestHTTP(sMethod,sUrl,bAsync,sCType,pCallback,vBody){
                m_xmlHTTP.open(sMethod,sUrl,bAsync);
                //m_xmlHTTP.setRequestHeader("Accept-Language","ko");
                m_xmlHTTP.setRequestHeader("Content-type", sCType);
                if(pCallback!=null)m_xmlHTTP.onreadystatechange = pCallback;
                (vBody!=null)?m_xmlHTTP.send(vBody):m_xmlHTTP.send();        		
            }
            
            function receiveHTTP(){
                if(m_xmlHTTP.readyState==4){
	                m_xmlHTTP.onreadystatechange=event_noop;
	                var xmlReturn=m_xmlHTTP.responseXML;
	                if(xmlReturn.xml==""){
        	        
	                }else{
		                var errorNode=xmlReturn.selectSingleNode("response/error");
		                if(errorNode!=null){
			                alert("Desc: " + errorNode.text);
		                }else{
		                    //var m_oChargeList = new ActiveXObject("MSXML2.DOMDocument");
		                    var m_oChargeList = CreateXmlDocument();
	                        m_oChargeList.loadXML(m_xmlHTTP.responseText);  
		                    var elmRoot = m_oChargeList.documentElement;
			                var elmlist = elmRoot.selectNodes("NewDataSet/Table");
			                var elm;
			                var oOption = document.createElement("OPTION");        			        
        			        
			                //콤보 박스 초기화
			                document.getElementById("SelEnt").length = 0;
			                document.getElementById("SelEnt").options.add(oOption);
		                    oOption.text="<%=Resources.Approval.lbl_total %>";
		                    oOption.value="";
        			        
			                for(var i = 0; i < elmlist.length; i++)
			                {
			                    elm = elmlist.nextNode();
        			            
			                    var oOption = document.createElement("OPTION");
			                    document.getElementById("SelEnt").options.add(oOption);
			                    oOption.text=elm.selectSingleNode("NAME").text;
			                    oOption.value=elm.selectSingleNode("ENT_CODE").text;
			                }
        			        
			                if (elmlist.length > 0){
			                    document.getElementById("SelEnt").style.display = "";
			                }
		                }
	                }
                }
            }
            
        </script>
</body>
</html>
