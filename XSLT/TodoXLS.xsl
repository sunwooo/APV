<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"	
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:cfxsl="http://www.covision.co.kr/xslt/coviflow">
<xsl:output media-type="text/html"/>

  <msxsl:script language="JScript" implements-prefix="cfxsl">
    <![CDATA[
	function getSubKind(sKind){
		try{
		var sSubKind="";
		
		    switch(sKind){
			    case "T000"://결재
				    sSubKind= "결재";break;
			    case "T001"://시행
				    sSubKind= "시행";break;
			    case "T002"://시행
				    sSubKind= "시행";break;
			    case "T003"://직인
				    sSubKind= "직인";break;
			    case "T004"://협조
				    sSubKind= "협조";break;
			    case "T005"://후결
				    sSubKind= "후결";break;
			    case "T006"://열람
				    sSubKind= "열람";break;
			    case "T007":
				    sSubKind= "경유";break;
			    case "T008"://담당
				    sSubKind= "담당";break;
			    case "T009"://합의
				    sSubKind= "합의";break;
			    case "T010"://예고
				    sSubKind= "예고";break;
			    case "T011"://담당
				    sSubKind= "담당";break;
			    case "T012"://담당
				    sSubKind= "담당";break;
			    case "T013"://참조
				    sSubKind= "참조";break;
			    case "T014"://통지
				    sSubKind= "통지";break;
			    case "T015"://협조
				    sSubKind= "협조";break;
			    case "T016"://감사
				    sSubKind= "감사";break;
			    case "T017"://감사
				    sSubKind= "감사";break;
			    case "A"://품의함
				    sSubKind= "품의함";break;
			    case "R"://수신
				    sSubKind= "수신";break;
			    case "S"://발신
				    sSubKind= "발신";break;
			    case "E"://접수
				    sSubKind= "접수";break;
			    case "REQCMP"://신청처리
				    sSubKind= "신청처리";break;
			    case "P"://발신
				    sSubKind= "발신";break;
			    case "SP"://열람
				    sSubKind= "열람";break;
			    case "C"://합의기안
			    case "AS"://협조기안
			    case "AD"://감사기안
			    case "AE"://준법기안
				    sSubKind= "기안";break;
			    default: sSubKind= sKind;break;

		}
		return sSubKind;
		}catch(e){throw e}
	}
	]]>
  </msxsl:script>
  
<xsl:template match="response">
		<table border="1" cellpadding="2" cellspacing="0" style="TABLE-LAYOUT: fixed;" width="100%">
			<tr bgcolor="olive">
        <TD align="center">구분</TD>
        <TD align="center">제목</TD>
        <TD align="center">결재일자</TD>
        <TD align="center">기안부서</TD>
        <TD align="center">기안자</TD>
        <TD align="center">양식명</TD>
			</tr>		
		<xsl:for-each select="docitem">
			<tr>
        <td valign="top"><xsl:value-of select="cfxsl:getSubKind(string(PF_SUB_KIND))"/></td>
        <td valign="top" style="mso-number-format:\@"><xsl:value-of select="PI_SUBJECT"/></td>
        <td valign="top"><xsl:value-of select="WI_FINISHED"/></td>
        <td valign="top"><xsl:value-of select="PI_INITIATOR_UNIT_NAME"/></td>
        <td valign="top"><xsl:value-of select="PI_INITIATOR_NAME"/></td>
        <td valign="top"><xsl:value-of select="FORM_NAME"/></td>        
			</tr>
		</xsl:for-each>
		</table>
	</xsl:template>
</xsl:stylesheet>
