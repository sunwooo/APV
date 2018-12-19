<%@ Page Language="C#" AutoEventWireup="true" CodeFile="getXMLDocList.aspx.cs" Inherits="Approval_Doclist_getXMLDocList" %><?xml version="1.0" encoding="utf-8" ?>
<response>
    <%=serror%>
    <totalcount><%=totalcount%></totalcount>
    <totalpage><%=totalpage%></totalpage>
    <listhtml>
        <table id="tblGalInfo" class="imsitable" border="0" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;"  onselectstart="return false"  >
            <% if (mode == "1") //문서대장(등록대장)
               { %>
			<tr class="BTable_bg02">
				<!--th class="BTable_bg07" style="padding-left:10px;" id="thSN" noWrap="t" width="60"--><!--%= Resources.Approval.lbl_SerialNo%--><!--/th--> <!--일련번호-->
				<th  id="thSN" noWrap="t" width="40px" class="BTable_bg07"><span class="headerheight" style="padding-left:10px;"><%= Resources.Approval.lbl_no%></span></th> <!--순번-->                
				<th class="BTable_bg07" id="thAD" noWrap="t" width="70px" onclick="sortColumn('apvdt');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_approvdate%><span id="spanapvdt"></span></span></th>
				<th class="BTable_bg07" id="thCN" noWrap="t" width="160px" onclick="sortColumn('docno');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_DivNo%><span id="spandocno"></span></span></th>
				<th class="BTable_bg07" id="thDN" width="*" onclick="sortColumn('docsubject');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_subject%><span id="spandocsubject"></span></span></th>
			</tr>              
            <% }
               else if (mode == "2") //수신대장
               { %>   
			<tr class="BTable_bg02" style="width:100%;">
				<th class="BTable_bg07" noWrap="t" width="60px"><span class="headerheight" style="padding-left:10px;"><%= Resources.Approval.lbl_SerialNo%></span></th>
				<th class="BTable_bg07" id="thAD" noWrap="t" width="100px" onclick="sortColumn('rgdt');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_RecvDate%><span id="spanrgdt"></span></span></th>
				<th class="BTable_bg07" id="thSN" noWrap="t" width="100px" onclick="sortColumn('senounm');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_send%><span id="spansenounm"></span></span></th>
				<th class="BTable_bg07" id="thCN" noWrap="t" width="160px" onclick="sortColumn('docno');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_DocNo%><span id="spandocno"></span></span></th>
				<th class="BTable_bg07" id="thDN"  onclick="sortColumn('docsubject');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_subject%><span id="spandocsubject"></span></span></th>
				<th class="BTable_bg07" id="thEF" noWrap="t" width="70px"><span class="headerheight"><%= Resources.Approval.lbl_ReceiverName%></span></th>
			</tr>              
           <% }
               else if (mode == "3") //접수대장
               { 
                     %>
			<tr class="BTable_bg02" >
				<th class="BTable_bg07" id="thSN" noWrap="t" width="60px" onclick="sortColumn('serial');" style="cursor:hand;"><span class="headerheight" style="padding-left:10px;"><%= Resources.Approval.lbl_RegisterNo%><span id="spanserial"></span></span></th>
				<th class="BTable_bg07" id="thAD" noWrap="t" width="70px" onclick="sortColumn('apvdt');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_senddate%><span id="spanapvdt"></span></span></th>
				<th class="BTable_bg07" id="thCN" noWrap="t" width="140px" onclick="sortColumn('docno');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_SendNo%><span id="spandocno"></span></span></th>
				<th class="BTable_bg07" id="thDN" onClick="sortColumn('docsubject');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_DocName%><span id="spandocsubject"></span></span></th>
				<th class="BTable_bg07" id="thRC" noWrap="t" width="50px"><span class="headerheight"><%= Resources.Approval.lbl_DocPages%></span></th>
				<th class="BTable_bg07" id="thRON" noWrap="t" width="100px"><span class="headerheight"><%= Resources.Approval.lbl_RecvDept%></span></th>
				<th class="BTable_bg07" id="thRN" noWrap="t" width="70px"><span class="headerheight"><%= Resources.Approval.lbl_Sender%></span></th>
			</tr>
                   <%  }
               else if (mode == "4") //등록대장
               {%>
			<tr class="BTable_bg02">
				<th class="BTable_bg07" id="thSN" noWrap="t" width="70px" onclick="sortColumn('serial');" style="cursor:hand;"><span class="headerheight" style="padding-left:10px;"><%= Resources.Approval.lbl_SerialNo%><span id="spanserial"></span></span></th>
				<th class="BTable_bg07" id="thAD" noWrap="t" width="100px" onclick="sortColumn('rgdt');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_receivedate%><span id="spanrgdt"></span></span></th>
				<th class="BTable_bg07" id="thSON" noWrap="t" width="100px" onclick="sortColumn('senounm');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_SenderName%><span id="spansenounm"></span></span></th>
				<th class="BTable_bg07" id="thCN" noWrap="t" width="120px" onclick="sortColumn('docno');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_DocNo%><span id="spandocno"></span></span></th>
				<th class="BTable_bg07" id="thDN"  width="100px" ><span class="headerheight"><%= Resources.Approval.lbl_ManageDept%></span></th>
				<th class="BTable_bg07" id="thEF" noWrap="t" width="70px" ><span class="headerheight"><%= Resources.Approval.lbl_ReceiverName%></span></th>
				<th class="BTable_bg07" id="thET" ><span class="headerheight"><%= Resources.Approval.lbl_Remark%></span></th>
				<th class="BTable_bg07" id="thPR"  width="100px" ><span class="headerheight"><%= Resources.Approval.lbl_ManageState%></span></th>
			</tr>
                <%  }
               else if (mode == "5") //발신대장
               { %>
			<tr  class="BTable_bg02" style="width:100%;">
				<th class="BTable_bg07" rowspan="2"  id="thSN" width="70px" onclick="sortColumn('serial');"><span class="headerheight" style="padding-left:10px;"><%= Resources.Approval.lbl_SerialNo%><span id="spanserial"></span></span></th>
				<th class="BTable_bg07" rowspan="2" id="thAD" width="70px" onclick="sortColumn('apvdt');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_date%><span id="spanapvdt"></span></span></th>
				<th class="BTable_bg07" rowspan="2"  id="thCN" width="120px" onclick="sortColumn('docno');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_receive%><span id="spandocno"></span></span></th>
				<th class="BTable_bg07" rowspan="2"  id="thDN"  onclick="sortColumn('docsubject');" width="30%" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_subject%><span id="spandocsubject"></span></span></th>
				<th class="BTable_bg07" rowspan="2"  id="thCL" ><span class="headerheight"><%= Resources.Approval.lbl_Copies%></span></th>
				<th class="BTable_bg07" rowspan="2"  id="thCH" ><span class="headerheight"><%= Resources.Approval.lbl_Manager%></span></th>
				<th class="BTable_bg07" colspan="3"  id="thApp" style="border-left-width: 1px; border-right-width: 1px; border-top-width: 1px; border-bottom-style: solid; border-bottom-width: 1px"><span class="headerheight"><%= Resources.Approval.lbl_app%></span></th>
			</tr>
			<tr class="BTable_bg02" style="width:100%;">
				<th class="BTable_bg07" id="thApp1"   noWrap="t" width="50px"><span class="headerheight"><%= Resources.Approval.lbl_Section%></span></th>
				<th class="BTable_bg07" id="thApp2"   noWrap="t" width="50px"><span class="headerheight"><%= Resources.Approval.lbl_SectionChief%></span></th>
				<th class="BTable_bg07" id="thApp3"   noWrap="t" width="50px"><span class="headerheight"><%= Resources.Approval.lbl_SectionHead%></span></th>
			</tr>
                <%  }
               else if (mode == "6") // 신청서 수신대장
               { %>
			<tr class="BTable_bg02" >
				<th class="BTable_bg07" id="thSN" noWrap="t" width="60px" onclick="sortColumn('serial');"><span class="headerheight" style="padding-left:10px;"><%= Resources.Approval.lbl_SerialNo%><span id="spanserial"></span></span></th>
				<th class="BTable_bg07" id="thAD" noWrap="t" width="120px" onclick="sortColumn('rgdt');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_ReceiptDate%><span id="spanrgdt"></span></span></th>
				<th class="BTable_bg07" id="thSON" noWrap="t" width="100px" onclick="sortColumn('senounm');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_send%><span id="spansenounm"></span></span></th>
				<th class="BTable_bg07" id="thDN"  onclick="sortColumn('docsubject');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_subject%><span id="spandocsubject"></span></span></th>
				<th class="BTable_bg07" id="thEF" noWrap="t" width="70px"><span class="headerheight"><%= Resources.Approval.lbl_ReceiverName%></span></th>
			</tr>
                  <%  }
               else if (mode == "7") //발신대장
               { %>
			<tr class="BTable_bg02" >
				<th class="BTable_bg07" id="thSN" noWrap="t" width="40px"><span class="headerheight" style="padding-left:10px;"><%= Resources.Approval.lbl_no%></span></th> <!--순번-->
                <th class="BTable_bg07" id="thCN" width="100px" onclick="sortColumn('docno');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_DocNo%><span id="spandocno"></span></span></th>
				<th class="BTable_bg07" id="thRD" noWrap="t" width="100px"><span class="headerheight"><%= Resources.Approval.lbl_RecvDept%></span></th>
				<th class="BTable_bg07" id="thDN"  onclick="sortColumn('docsubject');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_subject%><span id="spandocsubject"></span></span></th>
				<th class="BTable_bg07" id="thNM" noWrap="t" width="80px"  ><span class="headerheight"><%= Resources.Approval.lbl_initiator%></span></th> <!--작성자-->
				<th class="BTable_bg07" id="thAD" width="120px" onclick="sortColumn('rgdt');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_senddate%><span id="spanrgdt"></span></span></th>
			</tr>
			  <%  }
               else if (mode == "10" || mode == "11" || mode == "12") //대외공문발송대장 = mode 10, 라이선스대장 = mode 11, 발주/계약 mode 12)
               { %> 
			<tr class="BTable_bg02" >
				<th class="BTable_bg07" id="thSN" noWrap="t" width="40px" ><span class="headerheight" style="padding-left:10px;"><%= Resources.Approval.lbl_no%><span></span></span></th> <!--순번-->
                <th class="BTable_bg07" id="thCN" width="100" onclick="sortColumn('docno');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_DocNo%><span id="spandocno"></span></span></th> <!--문서번호-->				
				<th class="BTable_bg07" id="thRD" noWrap="t" width="100px"><span class="headerheight"><%= Resources.Approval.lbl_RecvDept%><span></span></span></th> <!--수신처-->
				<th class="BTable_bg07" id="thDN"  onclick="sortColumn('docsubject');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_subject%><span id="spandocsubject"></span></span></th> <!--제목-->				
				<th class="BTable_bg07" id="thNM" noWrap="t" width="80px"  ><span class="headerheight"><%= Resources.Approval.lbl_initiator%><span></span></span></th> <!--작성자-->
				<th class="BTable_bg07" id="thAD" width="120px" onclick="sortColumn('rgdt');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_senddate%><span id="spanrgdt"></span></span></th> <!--지정일자-->
 			</tr>               
                <%  }
               else if (mode == "8") //수기대장
               { %>
			<tr class="BTable_bg02">
				<th  id="thSN" noWrap="t" width="40px" class="BTable_bg07"><span class="headerheight" style="padding-left:10px;"><%= Resources.Approval.lbl_no%></span></th>
				<th  id="thAD" noWrap="t" width="120px" onclick="sortColumn('apvdt');" style="cursor:hand;" class="BTable_bg07"><span class="headerheight"><%= Resources.Approval.lbl_createdate%><span id="spanapvdt"></span></span></th>
				<th  id="thCN" noWrap="t" width="180px" onclick="sortColumn('docno');" style="cursor:hand;" class="BTable_bg07"><span class="headerheight"><%= Resources.Approval.lbl_DocNo%><span id="spandocno"></span></span></th>
				<th  id="thDN" onclick="sortColumn('docsubject');" style="cursor:hand;" class="BTable_bg07"><span class="headerheight"><%= Resources.Approval.lbl_subject%><span id="spandocsubject"></span></span></th>
				<th  id="thNM" noWrap="t" width="80px"  class="BTable_bg07"><span class="headerheight"><%= Resources.Approval.lbl_initiator%></span></th>
				<th  id="thRC" noWrap="t" width="80px"  class="BTable_bg07"><span class="headerheight"><%= Resources.Approval.lbl_finalpprover%></span></th>
			</tr>               
                <%  }
               else if (mode == "9") //직인날일부
               { %>
			<tr class="BTable_bg02" style="width:100%;" >
				<th class="BTable_bg07"  id="thSN" width="40px"><span class="headerheight" style="padding-left:10px;"><%= Resources.Approval.lbl_no%></span></th>
				<th class="BTable_bg07"  id="thAD" width="90px" onclick="sortColumn('apvdt');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_createdate%><span id="spanapvdt"></span></span></th>
				<th class="BTable_bg07"  id="thCN" noWrap="t" width="160px" onclick="sortColumn('docno');" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_DocNo%><span id="spandocno"></span></span></th>
				<th class="BTable_bg07"  id="thDN"  onClick="sortColumn('docsubject');" width="30%" style="cursor:hand;"><span class="headerheight"><%= Resources.Approval.lbl_subject%><span id="spandocsubject"></span></span></th>
				<th class="BTable_bg07"  width="50px"><span class="headerheight"><%= Resources.Approval.lbl_receiver%></span></th>
				<th class="BTable_bg07"  width="70px"><span class="headerheight"><%= Resources.Approval.lbl_stempkind%></span></th>
				<th class="BTable_bg07"  width="60px" id="th5" ><span class="headerheight"><%= Resources.Approval.lbl_initiator%></span></th>
				<th class="BTable_bg07"  width="80px"><span class="headerheight"><%= Resources.Approval.lbl_finalpprover%></span></th>
				<th class="BTable_bg07"  width="40px"><span class="headerheight"><%= Resources.Approval.lbl_gubun%></span></th>
			</tr>               
                 <%} %>
            <%=sList%>
         </table>
    </listhtml>
</response>