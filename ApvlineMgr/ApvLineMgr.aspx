<%@ Page Language="C#" MasterPageFile="~/Approval/ApvlineMgr/ApvLineMgr.master" AutoEventWireup="true" CodeFile="ApvLineMgr.aspx.cs" Inherits="COVIFlowNet_ApvlineMgr" Title="Untitled Page" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentHeader" Runat="Server">
        <div class="popup_title">
          <div class="title_tl">
            <div class="title_tr">
              <div class="title_tc">
                <h2><%= Resources.Approval.lbl_apvlinecomment_01 %>&nbsp;&nbsp;&nbsp;&nbsp;<select id='SelEnt' onchange="SetENT(this.value)" style="display:none;"><%=strEntList %></select></h2>
              </div>
            </div>
          </div>
        </div>			
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentBottom" Runat="Server">						
	    <div class="popup_Btn small AlignR">
          <a href="#" class="Btn04" id="btOK" name="cbBTN" onclick="doButtonAction(this);"><span><%= Resources.Approval.btn_confirm_apv %></span></a> 
          <a href="#" class="Btn04" id="btExit" name="cbBTN" onclick="doButtonAction(this);"><span><%= Resources.Approval.btn_close %></span></a>
        </div>
		<script language="javascript" type="text/javascript">

        var m_xmlHTTP = CreateXmlHttpRequest();
        var sEntGroupYN = "<%=strENTGROUPYN %>";
        var gEntCode = "<%= gEntCode %>";

        $(window).load(function () {
            
            $("#SelEnt").val(gEntCode);  //HIW
        });

        function SetENT(m_EntCode) {

            parent.iSearch.frameElement.src="../address/search.aspx?Ent="+m_EntCode;
            parent.iGroup.frameElement.src="OrgTree.aspx?Ent="+m_EntCode;
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
            if (sEntGroupYN == "T"){
//                var pXML = "dbo.usp_GetEntInfo";
//                var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type></Items>" ;
//                var szURL = "../GetXMLQuery.aspx";
//                requestHTTP("POST",szURL,true,"text/xml",receiveHTTP, sXML);
				if(document.getElementById("SelEnt").options.length > 1){
					document.getElementById("SelEnt").style.display = "";
				}
            }else{
                document.getElementById("SelEnt").value = '<%=Session["user_ent_code"].ToString()%>';
            }
            //소속부서 팀원을 자동으로 조회하게 함
            iGroup.getLocalMember('<%=Session["user_dept_code"]%>;<%=Session["user_dept_name"]%>');
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
                
	                    for (var i = 0; i < elmlist.length; i++)
                        {
                            
		                    elm = elmlist.nextNode();
		                    var oOption = document.createElement("OPTION");
		                    document.getElementById("SelEnt").options.add(oOption);
		                    oOption.text=elm.selectSingleNode("NAME").text;
		                    oOption.value=elm.selectSingleNode("ENT_CODE").text;
		                }
		                document.getElementById("SelEnt").value = '<%=Session["user_ent_code"].ToString()%>';
		                if(elmlist.length > 0 ){
		                    document.getElementById("SelEnt").style.display="none";
		                }
	                }
                }
		        iGroup.getLocalMember('<%=Session["user_dept_code"]%>;<%=Session["user_dept_name"]%>');
                //소속부서 팀원을 자동으로 조회하게 함
            }
            
        }
    </script>			
</asp:Content>


