<%@ Page Language="C#" AutoEventWireup="true" CodeFile="getXMLList.aspx.cs" Inherits="Approval_getXMLList" %><?xml version="1.0" encoding="utf-8" ?>
<response>
<%=serror %>
    <totalcount><%=totalcount %></totalcount>
    <totalpage><%=totalpage %></totalpage>
    <listhtml>
        <table id="tblGalInfo"  class="imsitable" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;" onselectstart="return false"  >
            <% if (mode == "TEMPSAVE")
               { %>
            <tr class="BTable_bg02">
			    <th id="thAPV" noWrap="t"  width="50px" class="BTable_bg07"><span class="headerheight" style="padding-left:10px">
			        <input type="checkbox" id="chkAPVALL" name="chkAPVALL" onclick="javascript:chkAPVALL_onClick();"/></span>
			    </th>
			    <th id="thBR" noWrap="t" width="150px" onClick="sortColumn('FORM_NAME');"  class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_formname %> <span id="spanFORM_NAME"></span></span></th>
			    <th id="thDN"  onclick="sortColumn('SUBJECT');"  class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_subject %>  <span id="spanSUBJECT"></span></span></th>
			    <th id="thAT"  width="100px" onclick="sortColumn('CREATED');" class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_savedate%>  <span id="spanCREATED"></span></span></th>
            </tr>               
            <% }
               else if (adminType == "MONITOR")
               {%>
            <tr class="BTable_bg02">              
      		<th id="thAPV" noWrap="t" style="display:none;" width="45px" class="BTable_bg07"><span class="headerheight" style="padding-left:10px"><%=Resources.Approval.lbl_gubun%></span></th>
			<th id="Th3" nowrap="t" width="20px" class="BTable_bg07"><span class="headerheight"><img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_clip.gif" /></span></th>
			<th id="thDN" onClick="sortColumn('PI_SUBJECT');" style="cursor:hand;" class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_subject %>  <span id="spanPI_SUBJECT"></span></a></span></th><!--제목-->
			<th id="thAT" width="125px" onClick="sortColumn('PI_STARTED');" style="cursor:hand;"  class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_doc_requested%><span id="spanPI_STARTED"></span></a></span></th>
			<th id="th8" width="125px" onClick="sortColumn('PI_STATE');" style="cursor:hand;"  class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_state%><span id="spanPI_STATE"></span></a></span></th>
			<th id="th2" noWrap="t" width="70px" onClick="sortColumn('PI_INITIATOR_UNIT_NAME');" style="cursor:hand;"  class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_writedept %> <span id="spanPI_INITIATOR_UNIT_NAME"></span></a></span></th><!--기안부서-->
			<th id="th1" noWrap="t" width="70px" onClick="sortColumn('PI_INITIATOR_NAME');" style="cursor:hand;"  class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_writer %> <span id="spanPI_INITIATOR_NAME"></span></a></span></th><!--기안자명-->
			<th id="th7" width="125px" onClick="sortColumn('FORM_NAME');" style="cursor:hand;"  class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_form%><span id="spanFORM_NAME"></span></a></span></th>
            </tr>               
                               
              <%  }
               else if (mode == "TCINFO")
               { %>   
                    <tr class="BTable_bg02">
                        <th id="thAPV" noWrap="t" style="display:none;" width="30px" class="BTable_bg07"><span class="headerheight" style="padding-left:10px">
	                        <input type="checkbox" id="chkAPVALL" name="chkAPVALL" onclick="javascript:chkAPVALL_onClick();"/>
	                    </span></th>
			            <th id="TD1"  onClick="sortColumn('KIND');" width="60px" class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_gubun%><span id="spanKIND"></span></span></th><!--구분-->
					    <th id="thBR" noWrap="t" width="180px"  onClick="sortColumn('FORM_NAME');" class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_formname%> <span id="spanFORM_NAME"></span></span></th>
			            <th id="thDN"                           onclick="sortColumn('SUBJECT');"        class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_subject%>  <span id="spanSUBJECT"></span></span></th>
			            <th id="TD2"  width="110px"             onclick="sortColumn('SENDER_NAME');"    class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_Sender%>  <span id="spanSENDER_NAME"></span></span></th>
			            <th id="thAT" width="110px"             onclick="sortColumn('SEND_DATE');"      class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_senddate%> <span id="spanSEND_DATE"></span></span></th>
                    </tr>               
           <% }

               else if (mode == "UFOLDER")
               {
                   if (foldermode == "I")
                   { %>
                        <tr class="BTable_bg02">
	                        <th id="thAPV" noWrap="t" style="display:none;" width="60px" class="BTable_bg07"><span class="headerheight" style="padding-left:10px">
	                            <input type="checkbox" id="chkAPVALL" name="chkAPVALL" onclick="javascript:chkAPVALL_onClick();"/>
	                        </span></th>
	                        <th id="thDN"  style="cursor:hand;" class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_Name%>  <span id="spanFOLDER_NAME"></span></a></span></th>
	                        <th id="thAT" width="120px"   class="BTable_bg07"><span class="headerheight"><a href="#"><%=strTitle%><span id="spanREGISTERED"></span></a></span></th>
                        </tr>
                   <%  }
                   else
                   {%>
                        <tr class="BTable_bg02">
	                        <th id="thAPV" noWrap="t" style="display:none;" width="60px" class="BTable_bg07"><span class="headerheight" style="padding-left:10px">
	                            <input type="checkbox" id="chkAPVALL" name="chkAPVALL" onclick="javascript:chkAPVALL_onClick();"/>
	                        </span></th>
	                        <th id="thDN" onClick="sortColumn('SUBJECT');" style="cursor:hand;" class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_subject%>  <span id="spanSUBJECT"></span></a></span></th>
	                        <th id="thAT" width="120px" onClick="sortColumn('REGISTERED');"  class="BTable_bg07"><span class="headerheight"><a href="#"><%=strTitle%><span id="spanREGISTERED"></span></a></span></th>
	                        <th id="thER" noWrap="t" width="70px" onClick="sortColumn('INITIATOR_UNIT_NAME');" style="cursor:hand;" class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_writedept%> <span id="spanINITIATOR_UNIT_NAME"></span></a></span></th>
	                        <th id="thCR" noWrap="t" width="70px" onClick="sortColumn('INITIATOR_NAME');" style="cursor:hand;" class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_writer%> <span id="spanINITIATOR_NAME"></span></a></span></th>
	                        <th id="thBR" noWrap="t" width="150px" onClick="sortColumn('FORM_NAME');" class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_formname%> <span id="spanFORM_NAME"></span></a></span></th>
                        </tr>
                <%    }
               }

               else if (mode == "REVIEW4")  //회람문서함 (2012-12-03 HIW)
               { %>   
                    <tr class="BTable_bg02">
                        <th id="thAPV" noWrap="t" style="display:none;" width="30px" class="BTable_bg07"><span class="headerheight" style="padding-left:10px">
	                        <input type="checkbox" id="chkAPVALL" name="chkAPVALL" onclick="javascript:chkAPVALL_onClick();"/>
	                    </span></th>
			            <th id="TD1"  onClick="sortColumn('KIND');" width="60px" class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_gubun%><span id="spanKIND"></span></span></th><!--구분-->
					    <th id="thBR" noWrap="t" width="180px"  class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_formname%> <span id="spanFORM_NAME"></span></span></th>
			            <th id="thDN" class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_subject%>  <span id="spanSUBJECT"></span></span></th>
                        <th id="TD2"  width="100px" class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_CircDate%>  <span id="spanCircDate"></span></span></th> <!--회람일자-->
			            <th id="thAT" width="70px" align='center' class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_CircTotCnt%> <span id="spnTotCnt"></span></span></th> <!--총회람수-->
                        <th id="th7" width="70px" align='center' class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_CircCnt%> <span id="span1"></span></span></th> <!--회람수-->
                        <th id="th8" width="70px" align='center' class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_CircUnReadedCnt%> <span id="span2"></span></span></th> <!--미회람수-->
                    </tr>               
           <% }    
                  
               else
               {
					%>
					<tr class="BTable_bg02">
					    <th id="thAL" align="center" valign="middle" class="BTable_bg07" noWrap="t" width="10px" ><span class="headerheight">&#160;</span></th><!--긴급문서-->
						<th id="thAPV" noWrap="t" style="display:none;" width="30px" class="BTable_bg07">
							<span class="headerheight" style="padding-left:10px;"><input type="checkbox" id="chkAPVALL" name="chkAPVALL" onmousedown="noResponse(event);" onclick="javascript:chkAPVALL_onClick();"/></span>
						</th>
						<th id="thSK" noWrap="t" width="60px"  class="BTable_bg07"><span class="headerheight"><%=Resources.Approval.lbl_gubun%></span></th>
						<th id="thST" nowrap="t" style="display:none;" width="80px"  class="BTable_bg07"><span class="headerheight"><%=strTitleStep%></span></th>
                        <th id="th9" noWrap="t" width="110px" onclick="sortColumn('FORM_NAME');" style="cursor:hand;" class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_formname%> <span id="spanFORM_NAME"></span></a></span></th>
						<th id="thER" noWrap="t" width="80px" onclick="sortColumn('PI_INITIATOR_UNIT_NAME');" style="cursor:hand;" class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_writedept%> <span id="spanPI_INITIATOR_UNIT_NAME"></span></a></span></th>
						<th id="thCR" noWrap="t" width="50px" onclick="sortColumn('PI_INITIATOR_NAME');" style="cursor:hand;" class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_writer%> <span id="spanPI_INITIATOR_NAME"></span></a></span></th>	
                        <th id="imgAtt" nowrap="t" width="20px" class="BTable_bg07"><span class="headerheight"><img src="<%=Session["user_thema"] %>/Covi/Common/icon/icon_clip.gif" /></span></th>
                        <th id="th5" onclick="sortColumn('PI_SUBJECT');" style="cursor:hand;" class="BTable_bg07"><span class="headerheight"><a href="#"><%=Resources.Approval.lbl_subject%><span id="spanPI_SUBJECT"></span></a></span></th>
						<th id="th6" noWrap="t" width="105px" onclick="sortColumn('WORKDT');" style="cursor: pointer;" class="BTable_bg07"><span class="headerheight"><a href="#"><%=strTitle%><span id="spanWORKDT"></span></a></span></th>
                        <th id="th4" noWrap="t" width="50px" class="BTable_bg07"><span class="headerheight" style="padding-left:10px;"><%=Resources.Approval.lbl_comment2%> <span id="spanComment"></span></span></th> <!--의견유무 (2012-12-30 HIW)-->
					</tr>
				<%
                } 
				%>
            <%=sList %>
         </table>
    </listhtml>
</response>
