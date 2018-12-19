<%@ Page Language="C#" AutoEventWireup="true" CodeFile="GetXMLDocListSelect.aspx.cs" Inherits="Approval_Doclist_GetXMLDocListSelect" %><response>
<%=serror %>
<totalcount><%=totalcount %></totalcount>
<totalpage><%=totalpage %></totalpage>
<listhtml>
    <table id="tblGalInfo" width="100%" border="0" cellspacing="0" cellpadding="0" onselectstart="return false"  >
            <% if (mode == "1")
               { %>
		    <tr>
                  <td height="1" colspan="6" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02">
				<th class="BTable_bg07" style="padding-left:10px;"  noWrap="t" width="40px"><input type="checkbox"  id="chkAll" name="chkAll"  onclick="chkAll(event);"/></th>
				<th class="BTable_bg07" id="thSN" noWrap="t" width="60px"><%= Resources.Approval.lbl_SerialNo%></th>
				<th class="BTable_bg07" id="thAD" noWrap="t" width="70px" onclick="sortColumn('apvdt');" style="cursor:hand;"><%= Resources.Approval.lbl_approvdate %><span id="spanapvdt"></span></th>
				<th class="BTable_bg07" id="thCN" noWrap="t" width="160px" onclick="sortColumn('docno');" style="cursor:hand;"><%= Resources.Approval.lbl_DivNo %><span id="spandocno"></span></th>
				<th class="BTable_bg07" id="thDN" width="*" onclick="sortColumn('docsubject');" style="cursor:hand;"><%= Resources.Approval.lbl_subject %><span id="spandocsubject"></span></th>
				<th class="BTable_bg07" id="thIT" width="80px" ><%= Resources.Approval.lbl_writer %></th>
				<th class="BTable_bg07" width="60px" > </th>
			</tr>              
            <% }
               else if (mode == "2")
               { %>   

		    <tr>
                <td height="1" colspan="7" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02" style="width:100%;">
				<th class="BTable_bg07" style="padding-left:10px;"  noWrap="t" width="40px"><input type="checkbox"  id="chkAll" name="chkAll"  onclick="chkAll(event);"/></th>
				<Th class="BTable_bg07" noWrap="t" width="60px"><%= Resources.Approval.lbl_SerialNo%></Th>
				<Th class="BTable_bg07" id="thAD" noWrap="t" width="100px" onclick="sortColumn('rgdt');" style="cursor:hand;"><%= Resources.Approval.lbl_RecvDate %><span id="spanrgdt"></span></Th>
				<Th class="BTable_bg07" id="thSN" noWrap="t" width="100px" onclick="sortColumn('senounm');" style="cursor:hand;"><%= Resources.Approval.lbl_send %><span id="spansenounm"></span></Th>
				<Th class="BTable_bg07" id="thCN" noWrap="t" width="160px" onclick="sortColumn('docno');" style="cursor:hand;"><%= Resources.Approval.lbl_DocNo %><span id="spandocno"></span></Th>
				<Th class="BTable_bg07" id="thDN"  onclick="sortColumn('docsubject');" style="cursor:hand;"><%= Resources.Approval.lbl_subject %><span id="spandocsubject"></span></Th>
				<Th class="BTable_bg07" id="thEF" noWrap="t" width="70px"><%= Resources.Approval.lbl_ReceiverName %></Th>
			</tr>              
           <% }
               else if (mode == "3")
               { 
                     %>
		    <tr>
                <td height="1" colspan="8" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02" style="height:30px">
				<th class="BTable_bg07" style="padding-left:10px;"  noWrap="t" width="40px"><input type="checkbox"  id="chkAll" name="chkAll"  onclick="chkAll(event);"/></th>
				<Th class="BTable_bg07" id="thSN" noWrap="t" width="60" onclick="sortColumn('serial');" style="padding-left:10px;cursor:hand;"><%= Resources.Approval.lbl_RegisterNo %><span id="spanserial"></span></Th>
				<Th class="BTable_bg07" id="thAD" noWrap="t" width="70" onclick="sortColumn('apvdt');" style="cursor:hand;"><%= Resources.Approval.lbl_senddate %><span id="spanapvdt"></span></Th>
				<Th class="BTable_bg07" id="thCN" noWrap="t" width="140" onclick="sortColumn('docno');" style="cursor:hand;"><%= Resources.Approval.lbl_SendNo %><span id="spandocno"></span></Th>
				<Th class="BTable_bg07" id="thDN" onClick="sortColumn('docsubject');" style="cursor:hand;"><%= Resources.Approval.lbl_DocName %><span id="spandocsubject"></span></Th>
				<Th class="BTable_bg07" id="thRC" noWrap="t" width="50"><%= Resources.Approval.lbl_DocPages %></Th>
				<Th class="BTable_bg07" id="thRON" noWrap="t" width="100"><%= Resources.Approval.lbl_RecvDept %></Th>
				<Th class="BTable_bg07" id="thRN" noWrap="t" width="70"><%= Resources.Approval.lbl_Sender %></Th>
			</tr>
                   <%  }
               else if (mode == "4")
                    {%>
		    <tr>
                <td height="1" colspan="8" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02">
				<th class="BTable_bg07" style="padding-left:10px;"  noWrap="t" width="40px"><input type="checkbox"  id="chkAll" name="chkAll"  onclick="chkAll(event);"/></th>
				<Th class="BTable_bg07" id="thSN" noWrap="t" width="70px" onclick="sortColumn('serial');" style="padding-left:10px;cursor:hand;"><%= Resources.Approval.lbl_SerialNo %><span id="spanserial"></span></Th>
				<Th class="BTable_bg07" id="thAD" noWrap="t" width="100" onclick="sortColumn('rgdt');" style="cursor:hand;"><%= Resources.Approval.lbl_receivedate %><span id="spanrgdt"></span></Th>
				<Th class="BTable_bg07" id="thSON" noWrap="t" width="100" onclick="sortColumn('senounm');" style="cursor:hand;"><%= Resources.Approval.lbl_SenderName %><span id="spansenounm"></span></Th>
				<Th class="BTable_bg07" id="thCN" noWrap="t" width="120" onclick="sortColumn('docno');" style="cursor:hand;"><%= Resources.Approval.lbl_DocNo %><span id="spandocno"></span></Th>
				<Th class="BTable_bg07" id="thDN"  width="100" ><%= Resources.Approval.lbl_ManageDept %></Th>
				<Th class="BTable_bg07" id="thEF" noWrap="t" width="70" ><%= Resources.Approval.lbl_ReceiverName %></Th>
				<Th class="BTable_bg07" id="thET" ><%= Resources.Approval.lbl_Remark %></Th>
				<Th class="BTable_bg07" id="thPR"  width="100px" ><%= Resources.Approval.lbl_ManageState %></Th>
			</tr>
                <%  }
               else if (mode == "5" )
               { %>
		    <tr>
                <td height="1" colspan="9" class="BTable_bg01"></td>
            </tr>
			<tr  class="BTable_bg02" style="width:100%;">
				<th class="BTable_bg07" style="padding-left:10px;"  noWrap="t" width="40px"><input type="checkbox"  id="chkAll" name="chkAll"  onclick="chkAll(event);"/></th>
				<Th class="BTable_bg07" rowspan="2"  id="thSN" width="70" onclick="sortColumn('serial');"><%= Resources.Approval.lbl_SerialNo %><span id="spanserial"></span></Th>
				<Th class="BTable_bg07" rowspan="2" id="thAD" width="70" onclick="sortColumn('apvdt');" style="cursor:hand;"><%= Resources.Approval.lbl_date %><span id="spanapvdt"></span></Th>
				<Th class="BTable_bg07" rowspan="2"  id="thCN" width="120" onclick="sortColumn('docno');" style="cursor:hand;"><%= Resources.Approval.lbl_receive %><span id="spandocno"></span></Th>
				<Th class="BTable_bg07" rowspan="2"  id="thDN"  onclick="sortColumn('docsubject');" width="30%" style="cursor:hand;"><%= Resources.Approval.lbl_subject %><span id="spandocsubject"></span></Th>
				<Th class="BTable_bg07" rowspan="2"  id="thCL" ><%= Resources.Approval.lbl_Copies %></Th>
				<Th class="BTable_bg07" rowspan="2"  id="thCH" ><%= Resources.Approval.lbl_Manager %></Th>
				<Th class="BTable_bg07" colspan="3"  id="thApp" style="border-left-width: 1px; border-right-width: 1px; border-top-width: 1px; border-bottom-style: solid; border-bottom-width: 1px"><%= Resources.Approval.lbl_app %></Th>
			</tr>
			<tr class="BTable_bg02" style="width:100%;">
				<Th class="BTable_bg07" id="thApp1"   noWrap="t" width="50"><%= Resources.Approval.lbl_Section %></Th>
				<Th class="BTable_bg07" id="thApp2"   noWrap="t" width="50"><%= Resources.Approval.lbl_SectionChief %></Th>
				<Th class="BTable_bg07" id="thApp3"   noWrap="t" width="50"><%= Resources.Approval.lbl_SectionHead %></Th>
			</tr>
                <%  }
               else if (mode == "6")
               { %>
		    <tr>
                <td height="1" colspan="6" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02" style="height:30px">
				<th class="BTable_bg07" style="padding-left:10px;"  noWrap="t" width="40px"><input type="checkbox"  id="chkAll" name="chkAll"  onclick="chkAll(event);"/></th>
				<th class="BTable_bg07" id="thSN" noWrap="t" width="60" onclick="sortColumn('serial');"><%= Resources.Approval.lbl_SerialNo %><span id="spanserial"></span></th>
				<th class="BTable_bg07" id="thAD" noWrap="t" width="120" onclick="sortColumn('rgdt');" style="cursor:hand;"><%= Resources.Approval.lbl_ReceiptDate %><span id="spanrgdt"></span></th>
				<th class="BTable_bg07" id="thSON" noWrap="t" width="100" onclick="sortColumn('senounm');" style="cursor:hand;"><%= Resources.Approval.lbl_send %><span id="spansenounm"></span></th>
				<th class="BTable_bg07" id="thDN"  onclick="sortColumn('docsubject');" style="cursor:hand;"><%= Resources.Approval.lbl_subject %><span id="spandocsubject"></span></th>
				<th class="BTable_bg07" id="thEF" noWrap="t" width="70"><%= Resources.Approval.lbl_ReceiverName %></th>
			</tr>
                  <%  }
               else if (mode == "7")
               { %>
		    <tr>
                <td height="1" colspan="6" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02" style="height:30px">
				<th class="BTable_bg07" style="padding-left:10px;"  noWrap="t" width="40px"><input type="checkbox"  id="chkAll" name="chkAll"  onclick="chkAll(event);"/></th>
				<Th class="BTable_bg07" id="thSN" width="60" style="padding-left:10px;"><%= Resources.Approval.lbl_SerialNo %></Th>
				<Th class="BTable_bg07" id="thCN" width="100" onclick="sortColumn('docno');" style="cursor:hand;"><%= Resources.Approval.lbl_DocNo %><span id="spandocno"></span></Th>
				<Th class="BTable_bg07" id="thRD" noWrap="t" width="100"><%= Resources.Approval.lbl_RecvDept %></Th>
				<Th class="BTable_bg07" id="thDN"  onclick="sortColumn('docsubject');" style="cursor:hand;"><%= Resources.Approval.lbl_subject %><span id="spandocsubject"></span></Th>
				<Th class="BTable_bg07" width="100" ><%= Resources.Approval.lbl_writer %></Th>
				<Th class="BTable_bg07" id="thAD" width="120" onclick="sortColumn('rgdt');" style="cursor:hand;"><%= Resources.Approval.lbl_senddate %><span id="spanrgdt"></span></Th>
			</tr>
			  <%  }
               else if ( mode == "10" || mode == "11")
               { %> 
		    <tr>
                <td height="1" colspan="5" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02" style="height:30px">
				<th class="BTable_bg07" style="padding-left:10px;"  noWrap="t" width="40px"><input type="checkbox"  id="chkAll" name="chkAll"  onclick="chkAll(event);"/></th>
				<th class="BTable_bg07" id="thSN" noWrap="t" width="60" onclick="sortColumn('serial');"><%= Resources.Approval.lbl_SerialNo %><span id="spanserial"></span></th>
				<th class="BTable_bg07" id="thAD" noWrap="t" width="120" onclick="sortColumn('rgdt');" style="cursor:hand;"><%= Resources.Approval.lbl_ReceiptDate %><span id="spanrgdt"></span></th>
				<th class="BTable_bg07" id="thSON" noWrap="t" width="100" onclick="sortColumn('senounm');" style="cursor:hand;"><%= Resources.Approval.lbl_send %><span id="spansenounm"></span></th>
				<th class="BTable_bg07" id="thDN"  onclick="sortColumn('docsubject');" style="cursor:hand;"><%= Resources.Approval.lbl_subject %><span id="spandocsubject"></span></th>
				<th class="BTable_bg07" id="thEF" noWrap="t" width="70"><%= Resources.Approval.lbl_ReceiverName %></th>
			</tr>               
                <%  }
               else if (mode == "8")
               { %>
            <tr>
                <td height="1" colspan="7" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02">
				<th class="BTable_bg07" style="padding-left:10px;"  noWrap="t" width="40px"><input type="checkbox"  id="chkAll" name="chkAll"  onclick="chkAll(event);"/></th>
				<th valign="middle" id="thSN" noWrap="t" width="40" class="BTable_bg07" style="padding-left:10px;"><%= Resources.Approval.lbl_no%></th>
				<th valign="middle" id="thAD" noWrap="t" width="120" onclick="sortColumn('apvdt');" style="cursor:hand;" class="BTable_bg07"><%= Resources.Approval.lbl_createdate%><span id="spanapvdt"></span></th>
				<th valign="middle" id="thCN" noWrap="t" width="180" onclick="sortColumn('docno');" style="cursor:hand;" class="BTable_bg07"><%= Resources.Approval.lbl_DocNo%><span id="spandocno"></span></th>
				<th valign="middle" id="thDN" onclick="sortColumn('docsubject');" style="cursor:hand;" class="BTable_bg07"><%= Resources.Approval.lbl_subject%><span id="spandocsubject"></span></th>
				<th valign="middle" id="thNM" noWrap="t" width="80"  class="BTable_bg07"><%= Resources.Approval.lbl_initiator%></th>
				<th valign="middle" id="thRC" noWrap="t" width="80"  class="BTable_bg07"><%= Resources.Approval.lbl_finalpprover%></th>
			</tr>               
                <%  }
               else if (mode == "9")
               { %>
		    <tr>
                <td height="1" colspan="9" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02" style="width:100%;" >
				<th class="BTable_bg07" style="padding-left:10px;"  noWrap="t" width="40px"><input type="checkbox"  id="chkAll" name="chkAll"  onclick="chkAll(event);"/></th>
				<th class="BTable_bg07" valign="middle" id="thSN" width="40" style="padding-left:10px;" ><%= Resources.Approval.lbl_no%></th>
				<th class="BTable_bg07" valign="middle" id="thAD" width="90" onclick="sortColumn('apvdt');" style="cursor:hand;"><%= Resources.Approval.lbl_createdate%><span id="span3"></span></th>
				<th class="BTable_bg07" valign="middle" id="thCN" noWrap="t" width="160" onclick="sortColumn('docno');" style="cursor:hand;"><%= Resources.Approval.lbl_DocNo%><span id="span4"></span></th>
				<th class="BTable_bg07" valign="middle" id="thDN"  onclick="sortColumn('docsubject');" width="30%" style="cursor:hand;"><%= Resources.Approval.lbl_subject%><span id="span5"></span></th>
				<th class="BTable_bg07" valign="middle" width="50"><%= Resources.Approval.lbl_receiver%></th>
				<th class="BTable_bg07" valign="middle" width="70"><%= Resources.Approval.lbl_stempkind%></th>
				<th class="BTable_bg07" valign="middle" width="60" id="th5" ><%= Resources.Approval.lbl_initiator%></th>
				<th class="BTable_bg07" valign="middle" width="80"><%= Resources.Approval.lbl_finalpprover%></th>
				<th class="BTable_bg07" valign="middle" width="40"><%= Resources.Approval.lbl_gubun%></th>
			</tr>               
                <%  }
               else if (mode == "TCINFO")
               { %>
		    <tr>
                <td height="1px" colspan="6" class="BTable_bg01"></td>
            </tr>
			<tr class="BTable_bg02" style="width:100%;height:27px;" >
				<th class="BTable_bg07" style="padding-left:10px;"  noWrap="t" width="40px"><input type="checkbox"  id="chkAll" name="chkAll"  onclick="chkAll(event);"/></th>
			    <th class="BTable_bg07" valign="middle" noWrap="t" style="padding-left:10px;" width="40px"><%=Resources.Approval.lbl_no %><!--전체--></th>						    
			    <th class="BTable_bg07" valign="middle" id="thBR" noWrap="t" width="180" onclick="sortColumn('FORM_NAME');" style="cursor:hand;"><%=Resources.Approval.lbl_formname%> <span id="spanFORM_NAME"></span></th>
			    <th class="BTable_bg07" valign="middle" id="thDN"  onclick="sortColumn('SUBJECT');"  style="cursor:hand;" ><%=Resources.Approval.lbl_subject %>  <span id="spanSUBJECT"></span></th><!--제목-->
			    <th class="BTable_bg07" valign="middle" id="TD2"  width="110px" onclick="sortColumn('SENDER_NAME');" style="cursor:hand;"><%=Resources.Approval.lbl_Sender %>  <span id="spanSENDER_NAME"></span></th>
			    <th class="BTable_bg07" valign="middle" id="thAT" width="110px" onclick="sortColumn('SEND_DATE');" style="cursor:hand;" ><%=Resources.Approval.lbl_senddate%> <span id="spanSEND_DATE"></span></th>
			</tr>
            <tr>
              <td height="1px" colspan="6" class="BTable_bg03"></td>
            </tr>
                 <%  }
               else 
               { %>   
                <tr>
                  <td height="2px" colspan="6" class="BTable_bg01"></td>
                </tr>
                <tr class="BTable_bg02" style="height:27px">
			        <th class="BTable_bg07" style="padding-left:10px;" noWrap="t"  width="40px">
			            <input type="checkbox" id="chkAll" name="chkAll" onclick="javascript:chkAll(event);"/>
			        </th>
			        <th class="BTable_bg07" noWrap="t"  width="40px"><%=Resources.Approval.lbl_no %></th>			
			        <th class="BTable_bg07" id="thBR" noWrap="t" width="150" onclick="sortColumn('FORM_NAME');" style="cursor:hand;"><a href="#"><%=Resources.Approval.lbl_formname%> <span id="spanFORM_NAME"></span></a></th>
			        <th class="BTable_bg07" id="thDN" onclick="sortColumn('PI_SUBJECT');" style="cursor:hand;"><a href="#"><%=Resources.Approval.lbl_subject %>  <span id="spanPI_SUBJECT"></span></a></th>
			        <th class="BTable_bg07" id="thCR" noWrap="t" width="70" onclick="sortColumn('PI_INITIATOR_NAME');" style="cursor:hand;"><a href="#"><%=Resources.Approval.lbl_writer %> <span id="spanPI_INITIATOR_NAME"></span></a></th>
			        <th class="BTable_bg07" id="thAT" width="120" onclick="sortColumn('WORKDT');" style="cursor:hand;"><a href="#"><%=strTitle%><span id="spanWORKDT"></span></a></th>
                </tr>
                <tr>
                  <td height="1px" colspan="6" class="BTable_bg03"></td>
                </tr>                       
                <%} %>
            <%=sList %>
         </table>
    </listhtml>
</response>