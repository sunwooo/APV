<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
  <xsl:output media-type="text/html"/>
  <xsl:param name="sTitle">받은시간</xsl:param>
  <xsl:param name="sType"></xsl:param>

  <msxsl:script language="JScript" implements-prefix="cfxsl">
    <![CDATA[
	function getSubKind(sKind, swibd1){
		try{
		var sSubKind="";
		if(swibd1 == "ExtType"){
		    sSubKind= "<%=Resources.Approval.lbl_ExtType %>";
		}else{
		    switch(sKind){
			    case "T000"://결재
				    sSubKind= "<%=Resources.Approval.lbl_app %>";break;
			    case "T001"://시행
				    sSubKind= "<%=Resources.Approval.lbl_ITrans %>";break;
			    case "T002"://시행
				    sSubKind= "<%=Resources.Approval.lbl_ITrans %>";break;
			    case "T003"://직인
				    sSubKind= "<%=Resources.Approval.lbl_OfficialSeal %>";break;
			    case "T004"://협조
				    sSubKind= "<%=Resources.Approval.lbl_assist %>";break;
			    case "T005"://후결
				    sSubKind= "<%=Resources.Approval.lbl_review %>";break;
			    case "T006"://열람
				    sSubKind= "<%=Resources.Approval.lbl_reading %>";break;
			    case "T007":
				    sSubKind= "경유";break;
			    case "T008"://담당
				    sSubKind= "<%=Resources.Approval.lbl_charge %>";break;
			    case "T009"://합의
				    sSubKind= "<%=Resources.Approval.lbl_consent %>";break;
			    case "T010"://예고
				    sSubKind= "<%=Resources.Approval.lbl_doc_pre2 %>";break;
			    case "T011"://담당
				    sSubKind= "<%=Resources.Approval.lbl_charge %>";break;
			    case "T012"://담당
				    sSubKind= "<%=Resources.Approval.lbl_charge %>";break;
			    case "T013"://참조
				    sSubKind= "<%=Resources.Approval.lbl_cc %>";break;
			    case "T014"://통지
				    sSubKind= "<%=Resources.Approval.lbl_notice2 %>";break;
			    case "T015"://협조
				    sSubKind= "<%=Resources.Approval.lbl_assist %>";break;
			    case "T016"://감사
				    sSubKind= "<%=Resources.Approval.lbl_audit %>";break;
			    case "T017"://공람
				    sSubKind= "<%=Resources.Approval.lbl_audit2 %>";break;
			    case "T018"://감사
				    sSubKind= "<%=Resources.Approval.lbl_PublicInspect %>";break;
			    case "A"://품의함
				    sSubKind= "<%=Resources.Approval.lbl_completedBox %>";break;
			    case "R"://수신
				    sSubKind= "<%=Resources.Approval.lbl_receive %>";break;
			    case "S"://발신
				    sSubKind= "<%=Resources.Approval.lbl_send %>";break;
			    case "E"://접수
				    sSubKind= "<%=Resources.Approval.lbl_receive %>";break;
			    case "REQCMP"://신청처리
				    sSubKind= "<%=Resources.Approval.lbl_receive %>";break;
			    case "P"://발신
				    sSubKind= "<%=Resources.Approval.lbl_send %>";break;
			    case "SP"://열람
				    sSubKind= "<%=Resources.Approval.lbl_reading %>";break;
			    case "C"://합의기안
			    case "AS"://협조기안
			    case "AD"://감사기안
			    case "AE"://준법기안
				    sSubKind= "<%=Resources.Approval.btn_redraft %>";break;
			    default: sSubKind= sKind;break;
		    }
		}
		return sSubKind;
		}catch(e){throw e}
	}
	function getIsPaper(sIsPaper){
		try{
		var sYN="";
		switch(sIsPaper){
			case "Y":
				sYN= "서면결재";break;
			case "N":
			case "":
			default: sYN= "";break;
		}
		return sYN;
		}catch(e){throw e}
	}
	function getUrgent(sPriority){
		try{
		var sYN="";
		switch(sPriority){
			case "1":
			case "2":
			case "3":sYN= "";break;
			case "4":sYN= "*";break;
			case "5":sYN= "*";break;
			default: sYN= sPriority;break;
		}
		return sYN;
		}catch(e){throw e}
	}
	function getRequestResponse(sReqResponse){
		try{
		var sYN="";
		switch(sReqResponse){
			case "Y":
				sYN= "회신요구";break;
			case "N":
			case "":
			default: sYN= "";break;
		}
		return sYN;
		}catch(e){throw e}
	}	
	]]>
  </msxsl:script>

  <xsl:template match="response">
    <!-- 리스트 테이블 시작 -->
    <table id="tblGalInfo" width="100%" border="0" cellspacing="0" cellpadding="0" onselectstart="return false"  >
      <tr>
        <td height="1" colspan="9" class="BTable_bg01"></td>
      </tr>
      <tr class="BTable_bg02">
        <th id="thAPV" noWrap="t" style="padding-left:10px;display:none;" width="45" class="BTable_bg07">
          <input type="checkbox" id="chkAPVALL" name="chkAPVALL" onclick="javascript:chkAPVALL_onClick();"/>
          <!--전체<%=Resources.Approval.lbl_total %>-->
        </th>
        <th id="thSK" noWrap="t" width="60"  class="BTable_bg07">
          <%=Resources.Approval.lbl_gubun%></th>
        <!--구분-->
        <th id="thST" nowrap="t" style="display:none;" width="80"  class="BTable_bg07">
          <%=Resources.Approval.lbl_step%></th>
        <!--결재단계-->

        <th id="imgAtt" nowrap="t" width="20" class="BTable_bg07">
          <img src=""
            <%=Session["user_thema"] %>/Covi/Common/icon/icon_clip.gif" />
        </th>

        <th id="thDN" onClick="sortColumn('PI_SUBJECT');" style="cursor:hand;" class="BTable_bg07">
          <a href="#">
            <%=Resources.Approval.lbl_subject%><span id="spanPI_SUBJECT"></span>
          </a>
        </th>
        <!--제목-->
        <th id="thAT" width="125" onClick="sortColumn('WORKDT');" style="cursor:hand;" class="BTable_bg07">
          <a href="#">
            <xsl:value-of select="$sTitle"/>
            <span id="spanWORKDT"></span>
          </a>
        </th>
        <th id="thER" noWrap="t" width="70" onClick="sortColumn('PI_INITIATOR_UNIT_NAME');" style="cursor:hand;" class="BTable_bg07">
          <a href="#">
            <%=Resources.Approval.lbl_writedept%><span id="spanPI_INITIATOR_UNIT_NAME"></span>
          </a>
        </th>
        <!--기안부서-->
        <th id="thCR" noWrap="t" width="70" onClick="sortColumn('PI_INITIATOR_NAME');" style="cursor:hand;" class="BTable_bg07">
          <a href="#">
            <%=Resources.Approval.lbl_writer%><span id="spanPI_INITIATOR_NAME"></span>
          </a>
        </th>
        <!--기안자명-->
        <th id="thBR" noWrap="t" width="110" onClick="sortColumn('FORM_NAME');" style="cursor:hand;" class="BTable_bg07">
          <a href="#">
            <%=Resources.Approval.lbl_formname%><span id="spanFORM_NAME"></span>
          </a>
        </th>
        <!--양식명-->
        <!--<td class="table_mgraybg" id="thET" noWrap="t" width="60">비고</td>-->
      </tr>
      <xsl:choose>
        <xsl:when test="count(workitem) = 0 ">
          <tr>
            <td  colspan="9" nowrap="true" align="center" class="BTable_bg08">
              <%=Resources.Approval.msg_101%></td>
            <td  nowrap="true" style="overflow:hidden; paddingRight:1px;display:none;" onselect="false" class="BTable_bg08">
              <input type="checkbox" id="chkAPV" name="chkAPV"></input>
            </td>
          </tr>
        </xsl:when>
        <xsl:otherwise>
          <xsl:for-each select="workitem">
            <xsl:variable name="index">
              <xsl:number value="position()"/>
            </xsl:variable>

            <tr onkeydown="event_row_onkeydown" onkeyup="event_row_onkeyup" onselectstart="event_row_onselectstart" >
              <xsl:choose>
                <xsl:when test="(position() mod 2) = 1 ">
                  <xsl:attribute name="onMouseover">this.style.background='#F8F4DE';</xsl:attribute>
                  <!--필요없으면 제거할것-->
                  <xsl:attribute name="onMouseout">this.style.background=''</xsl:attribute>
                  <!--필요없으면 제거할것-->
                </xsl:when>
                <xsl:otherwise>
                  <xsl:attribute name="onMouseover">this.style.background='#F8F4DE';</xsl:attribute>
                  <!--필요없으면 제거할것-->
                  <xsl:attribute name="onMouseout">this.style.background=''</xsl:attribute>
                  <!--필요없으면 제거할것-->
                </xsl:otherwise>
              </xsl:choose>
              <xsl:attribute name="workitemid">
                <xsl:value-of select="id"/>
              </xsl:attribute>
              <xsl:attribute name="piid">
                <xsl:value-of select="piid"/>
              </xsl:attribute>
              <xsl:attribute name="pfid">
                <xsl:value-of select="pfid"/>
              </xsl:attribute>
              <xsl:attribute name="mode">
                <xsl:value-of select="mode"/>
              </xsl:attribute>
              <xsl:attribute name="participantid">
                <xsl:value-of select="participantid"/>
              </xsl:attribute>
              <xsl:attribute name="piviewstate"></xsl:attribute>
              <xsl:attribute name="fiid">
                <xsl:value-of select="fiid"/>
              </xsl:attribute>
              <xsl:attribute name="ftid">
                <xsl:value-of select="ftid"/>
              </xsl:attribute>
              <xsl:attribute name="fmid">
                <xsl:value-of select="fmid"/>
              </xsl:attribute>
              <xsl:attribute name="fmnm">
                <xsl:value-of select="fmnm"/>
              </xsl:attribute>
              <xsl:attribute name="fmrv">
                <xsl:value-of select="fmrv"/>
              </xsl:attribute>
              <xsl:attribute name="scid">
                <xsl:value-of select="scid"/>
              </xsl:attribute>
              <xsl:attribute name="fmpf">
                <xsl:value-of select="fmpf"/>
              </xsl:attribute>
              <xsl:attribute name="fmfn">
                <xsl:value-of select="fmfn"/>
              </xsl:attribute>
              <xsl:attribute name="bstate">
                <xsl:value-of select="bstate"/>
              </xsl:attribute>
              <xsl:attribute name="pfsk">
                <xsl:value-of select="pfsk"/>
              </xsl:attribute>
              <xsl:attribute name="pibd1">
                <xsl:value-of select="pibd1"/>
              </xsl:attribute>
              <xsl:attribute name="pipr">
                <xsl:value-of select="pipr"/>
              </xsl:attribute>
              <xsl:attribute name="pidc">
                <xsl:value-of select="pidc"/>
              </xsl:attribute>
              <xsl:attribute name="secdoc">
                <xsl:value-of select="secdoc"/>
              </xsl:attribute>
              <xsl:attribute name="isfile">
                <xsl:value-of select="isfile"/>
              </xsl:attribute>
              <!--<xsl:attribute name="onMouseover">this.style.background='#FAE6BA';this.style.cursor='hand'</xsl:attribute>-->
              <!--<xsl:attribute name="onMouseout">this.style.background='ffffff'</xsl:attribute>-->
              <xsl:attribute name="edms_document">
                <xsl:value-of select="edms_document"/>
              </xsl:attribute>
              <xsl:attribute name="ptid">
                <xsl:value-of select="participantid"/>
              </xsl:attribute>
              <xsl:attribute name="rowselected"></xsl:attribute>
              <!-- 폴더 이동 때문에 추가된 attribute 시작-->
              <xsl:attribute name="subject">
                <xsl:value-of select="title"/>
              </xsl:attribute>
              <xsl:attribute name="initiator_name">
                <xsl:value-of select="picreator"/>
              </xsl:attribute>
              <xsl:attribute name="initiator_unit_name">
                <xsl:value-of select="picreatordept"/>
              </xsl:attribute>
              <xsl:attribute name="initiator_id">
                <xsl:value-of select="picreatorid"/>
              </xsl:attribute>
              <xsl:attribute name="initiator_unit_id">
                <xsl:value-of select="picreatordeptid"/>
              </xsl:attribute>
              <!-- 폴더 이동 때문에 추가된 attribute 끝-->
              <td  nowrap="true" style="padding-left:10px;overflow:hidden; paddingRight:1px;display:none;" onselect="false" onmousedown="noResponse();" class="BTable_bg08">
                <input type="checkbox" id="chkAPV" name="chkAPV"></input>
              </td>
              <td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08">
                <a href="#" onclick="javascript:OpenApprovalLine(this)" class="text02_L" >
                  <xsl:attribute name="piid">
                    <xsl:value-of select="piid"/>
                  </xsl:attribute>
                  <xsl:attribute name="scid">
                    <xsl:value-of select="scid"/>
                  </xsl:attribute>
                  <xsl:attribute name="fmpf">
                    <xsl:value-of select="fmpf"/>
                  </xsl:attribute>
                  <xsl:attribute name="fmrv">
                    <xsl:value-of select="fmrv"/>
                  </xsl:attribute>
                  <xsl:attribute name="fiid">
                    <xsl:value-of select="fiid"/>
                  </xsl:attribute>
                  <img src="<%=Session["user_thema="""] %>/Covi/Common/btn_type2/btn_lookdc.gif" width="14" height="14" border="0" align="absmiddle" covimode="imgctxmenu">
                  </img>
                </a>
                <xsl:value-of select="cfxsl:getSubKind(string(pfsk), string(wibd1))"/>
              </td>
              <td nowrap="true" style="overflow:hidden; paddingRight:1px;display:none;" onselect="false"  class="BTable_bg08"></td>

              <td nowrap="true" style="overflow:hidden; paddingRight:1px;cursor:hand;" onselect="false" class="BTable_bg08">
                <xsl:choose>
                  <xsl:when test="isfile='1' ">
                    <img id="img1" src="<%=Session["user_thema="""] %>/Covi/Common/icon/icon_clip.gif" align="middle" onmousedown="noResponse();" onclick="attachLayer(10,70,this);" style="display:;" />
                    <!-- 첨부파일이미지 -->
                  </xsl:when>
                  <xsl:otherwise>
                    &#160;
                  </xsl:otherwise>
                </xsl:choose>
              </td>
              <td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08"  onmouseover="event_GalTable_onmousemove();" >
                <xsl:attribute name="alt">
                  <xsl:value-of select="title" />
                </xsl:attribute>
                <div style="width: expression(this.firstChild.style.display == 'inline' ? this.style.width : this.parentElement.offsetWidth); overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                  <a href="#" class="text02_L" style="display: none; cfdummy: expression(this.style.display = parseInt(this.parentElement.style.width) > 0 ? 'inline' : 'none')">
                    <xsl:value-of select="title" />
                  </a>
                </div>
              </td>
              <td nowrap="true" style="overflow:hidden; paddingRight:2px" onselect="false" class="BTable_bg08">
                <xsl:choose>
                  <xsl:when test="mode='APPROVAL' and string-length(apvdate) > 0 ">
                    <xsl:choose>
                      <xsl:when test="60 > apvdatemi">
                        <xsl:value-of select="apvdatemi"/>
                        <%=Resources.Approval.lbl_before_m%></xsl:when>
                      <xsl:when test="apvdate > 24*7 ">
                        <xsl:value-of select="completedate"/>
                      </xsl:when>
                      <xsl:when test="apvdate > 24 ">
                        <xsl:value-of select="floor(apvdate div number(24))+ 1 "/>
                        <%=Resources.Approval.lbl_before_d%></xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="apvdate"/>
                        <%=Resources.Approval.lbl_before_h%></xsl:otherwise>
                    </xsl:choose>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="completedate"/>
                  </xsl:otherwise>
                </xsl:choose>
              </td>
              <td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08">
                <xsl:value-of select="picreatordept"/>
              </td>
              <td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08">
                <xsl:choose>
                  <xsl:when test="$sType ='ocs' ">
                    <span>
                      <img src='/GWImages/common/namecontrol_images/unknown.gif'  style='border-width:0px;' align="absmiddle"  covimode="imgctxmenu">
                        <xsl:attribute name="onload">
                          <xsl:text>PresenceControl("</xsl:text><xsl:value-of select="picreatorsipaddress" />"<xsl:text>);</xsl:text>
                        </xsl:attribute>
                        <xsl:attribute name="id">
                          <xsl:text>ctl00_ContentPlaceHolder1_GridView1_ctl</xsl:text>
                          <xsl:value-of select="$index"/>
                          <xsl:text>_presence</xsl:text>
                        </xsl:attribute>
                      </img>
                    </span>&#160;
                  </xsl:when>
                  <xsl:when test="$sType ='ctx' ">
                    <a href="#" onclick="javascript:OpenContextMenu4Approval(this)" class="text02_L"  onmouseout="MM_swapImgRestore()">
                      <xsl:attribute name="onmouseover">
                        <xsl:text>MM_swapImage('Image</xsl:text>
                        <xsl:value-of select="position()" />
                        <xsl:text>','','<%=Session["user_thema"]%>/Covi/Common/icon/icon_writer_on.gif',1)</xsl:text>
                      </xsl:attribute>
                      <img src="<%=Session["user_thema="""] %>/Covi/Common/icon/icon_writer_off.gif" border="0" align="absmiddle" covimode="imgctxmenu">
                        <xsl:attribute name="name">
                          <xsl:text>Image</xsl:text>
                          <xsl:value-of select="position()" />
                        </xsl:attribute>
                        <xsl:attribute name="id">
                          <xsl:text>Image</xsl:text>
                          <xsl:value-of select="position()" />
                        </xsl:attribute>
                      </img>
                    </a>&#160;
                  </xsl:when>
                  <xsl:otherwise>
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:value-of select="picreator"/>
              </td>
              <td nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false" class="BTable_bg08">
                <xsl:value-of select="fmnm"/>
              </td>
              <!--<td class="tableDot" height="21" valign="top" nowrap="true" style="overflow:hidden; paddingRight:1px" onselect="false"><xsl:value-of select="ugrs"/><xsl:value-of select="cfxsl:getIsPaper(string(ispaper))"/><xsl:value-of select="cfxsl:getRequestResponse(string(rqrs))"/></td>-->
            </tr>
          </xsl:for-each>
        </xsl:otherwise>
      </xsl:choose>
    </table>
  </xsl:template>
</xsl:stylesheet>