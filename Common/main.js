function Title(){
	document.write("<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'>");
	document.write("	<tr height='26'>");
	document.write("		<td  valign='top' colspan='2'>");
	document.write("			<table bgcolor='E5E5E5' border='0' cellpadding='0' cellspacing='0' width='100%'>");
	document.write("				<tr>");
}


function Category(div){
	if(div==0){ // 개인전자결재함
	document.write("					<td><img src='image/scwh-title01.gif'></td>");
	document.write("					<td>");
	document.write("					<td class='location' align='right' nowrap><img src='../lg/image/arrow_location0.gif' align='absmiddle'>홈<img src='../lg/image/arrow_location.gif' align='absmiddle'>결제 서비스<img src='../lg/image/arrow_location.gif' align='absmiddle'>개인전자결재함</td>");
	document.write("					</td>");
	document.write("					<td width='20'><img src='../lg/image/title02.gif'></td>");
	document.write("				</tr>");
	document.write("			</table>");
	document.write("		</td>");
	document.write("	</tr>");
	document.write("	<tr>");
	document.write("		<td width='25'></td>");
	document.write("		<td valign='top'>");
	document.write("			<table border='0' cellpadding='0' cellspacing='0' width='100%'>");
	document.write("				<tr>");
	document.write("					<td height='10'></td>");
	document.write("					<td width='20'></td>");
	document.write("				</tr>");
	document.write("				<tr>");
	document.write("					<td>");
	}else if(div==1){   // 내가결제할 문서
	document.write("					<td><img src='image/scwh-title01_01.gif'></td>");
	document.write("					<td>");
	document.write("					<td class='location' align='right' nowrap><img src='../lg/image/arrow_location0.gif' align='absmiddle'>홈<img src='../lg/image/arrow_location.gif' align='absmiddle'>결제 서비스<img src='../lg/image/arrow_location.gif' align='absmiddle'>개인전자결재함<img src='../lg/image/arrow_location.gif' align='absmiddle'>내가결재할문서</td>");
	document.write("					</td>");
	document.write("					<td width='20'><img src='../lg/image/title02.gif'></td>");
	document.write("				</tr>");
	document.write("			</table>");
	document.write("		</td>");
	document.write("	</tr>");
	document.write("	<tr>");
	document.write("		<td width='25'></td>");
	document.write("		<td valign='top'>");
	document.write("			<table border='0' cellpadding='0' cellspacing='0' width='100%'>");
	document.write("				<tr>");
	document.write("					<td height='10'></td>");
	document.write("					<td width='20'></td>");
	document.write("				</tr>");
	document.write("				<tr>");
	document.write("					<td>");
	}else if(div==2){ // 진행함
	document.write("					<td><img src='image/scwh-title01_02.gif'></td>");
	document.write("					<td>");
	document.write("					<td class='location' align='right' nowrap><img src='../lg/image/arrow_location0.gif' align='absmiddle'>홈<img src='../lg/image/arrow_location.gif' align='absmiddle'>결제 서비스<img src='../lg/image/arrow_location.gif' align='absmiddle'>개인전자결재함<img src='../lg/image/arrow_location.gif' align='absmiddle'>진행함</td>");
	document.write("					</td>");
	document.write("					<td width='20'><img src='../lg/image/title02.gif'></td>");
	document.write("				</tr>");
	document.write("			</table>");
	document.write("		</td>");
	document.write("	</tr>");
	document.write("	<tr>");
	document.write("		<td width='25'></td>");
	document.write("		<td valign='top'>");
	document.write("			<table border='0' cellpadding='0' cellspacing='0' width='100%'>");
	document.write("				<tr>");
	document.write("					<td height='10'></td>");
	document.write("					<td width='20'></td>");
	document.write("				</tr>");
	document.write("				<tr>");
	document.write("					<td>");
	}else if(div==3){ // 완료함
	document.write("					<td><img src='image/scwh-title01_03.gif'></td>");
	document.write("					<td>");
	document.write("					<td class='location' align='right' nowrap><img src='../lg/image/arrow_location0.gif' align='absmiddle'>홈<img src='../lg/image/arrow_location.gif' align='absmiddle'>결제 서비스<img src='../lg/image/arrow_location.gif' align='absmiddle'>개인전자결재함<img src='../lg/image/arrow_location.gif' align='absmiddle'>완료함</td>");
	document.write("					</td>");
	document.write("					<td width='20'><img src='../lg/image/title02.gif'></td>");
	document.write("				</tr>");
	document.write("			</table>");
	document.write("		</td>");
	document.write("	</tr>");
	document.write("	<tr>");
	document.write("		<td width='25'></td>");
	document.write("		<td valign='top'>");
	document.write("			<table border='0' cellpadding='0' cellspacing='0' width='100%'>");
	document.write("				<tr>");
	document.write("					<td height='10'></td>");
	document.write("					<td width='20'></td>");
	document.write("				</tr>");
	document.write("				<tr>");
	document.write("					<td>");
	}else if(div==4){ // 반려함
	document.write("					<td><img src='image/scwh-title01_04.gif'></td>");
	document.write("					<td>");
	document.write("					<td class='location' align='right' nowrap><img src='../lg/image/arrow_location0.gif' align='absmiddle'>홈<img src='../lg/image/arrow_location.gif' align='absmiddle'>결제 서비스<img src='../lg/image/arrow_location.gif' align='absmiddle'>개인전자결재함<img src='../lg/image/arrow_location.gif' align='absmiddle'>반려함</td>");
	document.write("					</td>");
	document.write("					<td width='20'><img src='../lg/image/title02.gif'></td>");
	document.write("				</tr>");
	document.write("			</table>");
	document.write("		</td>");
	document.write("	</tr>");
	document.write("	<tr>");
	document.write("		<td width='25'></td>");
	document.write("		<td valign='top'>");
	document.write("			<table border='0' cellpadding='0' cellspacing='0' width='100%'>");
	document.write("				<tr>");
	document.write("					<td height='10'></td>");
	document.write("					<td width='20'></td>");
	document.write("				</tr>");
	document.write("				<tr>");
	document.write("					<td>");
	}else if(div==5){ // 부서함
	document.write("					<td><img src='image/scwh-title01_06.gif'></td>");
	document.write("					<td>");
	document.write("					<td class='location' align='right' nowrap><img src='../lg/image/arrow_location0.gif' align='absmiddle'>홈<img src='../lg/image/arrow_location.gif' align='absmiddle'>결제 서비스<img src='../lg/image/arrow_location.gif' align='absmiddle'>개인전자결재함<img src='../lg/image/arrow_location.gif' align='absmiddle'>부서함</td>");
	document.write("					</td>");
	document.write("					<td width='20'><img src='../lg/image/title02.gif'></td>");
	document.write("				</tr>");
	document.write("			</table>");
	document.write("		</td>");
	document.write("	</tr>");
	document.write("	<tr>");
	document.write("		<td width='25'></td>");
	document.write("		<td valign='top'>");
	document.write("			<table border='0' cellpadding='0' cellspacing='0' width='100%'>");
	document.write("				<tr>");
	document.write("					<td height='10'></td>");
	document.write("					<td width='20'></td>");
	document.write("				</tr>");
	document.write("				<tr>");
	document.write("					<td>");
	}else if(div==6) {// 임시 보관함
	document.write("					<td><img src='image/scwh-title01_05.gif'></td>");
	document.write("					<td>");
	document.write("					<td class='location' align='right' nowrap><img src='../lg/image/arrow_location0.gif' align='absmiddle'>홈<img src='../lg/image/arrow_location.gif' align='absmiddle'>결제 서비스<img src='../lg/image/arrow_location.gif' align='absmiddle'>개인전자결재함<img src='../lg/image/arrow_location.gif' align='absmiddle'>임시보관함</td>");
	document.write("					</td>");
	document.write("					<td width='20'><img src='../lg/image/title02.gif'></td>");
	document.write("				</tr>");
	document.write("			</table>");
	document.write("		</td>");
	document.write("	</tr>");
	document.write("	<tr>");
	document.write("		<td width='25'></td>");
	document.write("		<td valign='top'>");
	document.write("			<table border='0' cellpadding='0' cellspacing='0' width='100%'>");
	document.write("				<tr>");
	document.write("					<td height='10'></td>");
	document.write("					<td width='20'></td>");
	document.write("				</tr>");
	document.write("				<tr>");
	document.write("					<td>");	
	}else if(div==7) {// 부서수신함
	document.write("					<td><img src='image/scwh-title01_07.gif'></td>");
	document.write("					<td>");
	document.write("					<td class='location' align='right' nowrap><img src='../lg/image/arrow_location0.gif' align='absmiddle'>홈<img src='../lg/image/arrow_location.gif' align='absmiddle'>결제 서비스<img src='../lg/image/arrow_location.gif' align='absmiddle'>개인전자결재함<img src='../lg/image/arrow_location.gif' align='absmiddle'>부서수신함</td>");
	document.write("					</td>");
	document.write("					<td width='20'><img src='../lg/image/title02.gif'></td>");
	document.write("				</tr>");
	document.write("			</table>");
	document.write("		</td>");
	document.write("	</tr>");
	document.write("	<tr>");
	document.write("		<td width='25'></td>");
	document.write("		<td valign='top'>");
	document.write("			<table border='0' cellpadding='0' cellspacing='0' width='100%'>");
	document.write("				<tr>");
	document.write("					<td height='10'></td>");
	document.write("					<td width='20'></td>");
	document.write("				</tr>");
	document.write("				<tr>");
	document.write("					<td>");	
	}else if(div==8) {// ECN
	document.write("					<td><img src='image/ecn_title.gif'></td>");
	document.write("					<td>");
	document.write("					<td class='location' align='right' nowrap><img src='../lg/image/arrow_location0.gif' align='absmiddle'>홈<img src='../lg/image/arrow_location.gif' align='absmiddle'>결제 서비스<img src='../lg/image/arrow_location.gif' align='absmiddle'>개인전자결재함<img src='../lg/image/arrow_location.gif' align='absmiddle'>ECN</td>");
	document.write("					</td>");
	document.write("					<td width='20'><img src='../lg/image/title02.gif'></td>");
	document.write("				</tr>");
	document.write("			</table>");
	document.write("		</td>");
	document.write("	</tr>");
	document.write("	<tr>");
	document.write("		<td width='25'></td>");
	document.write("		<td valign='top'>");
	document.write("			<table border='0' cellpadding='0' cellspacing='0' width='100%'>");
	document.write("				<tr>");
	document.write("					<td height='10'></td>");
	document.write("					<td width='20'></td>");
	document.write("				</tr>");
	document.write("				<tr>");
	document.write("					<td>");	
	}else if(div==9) {// 결재함 관리
	document.write("					<td><img src='image/scwh-title01_08.gif'></td>");
	document.write("					<td>");
	document.write("					<td class='location' align='right' nowrap><img src='/cfweb/lg/image/arrow_location0.gif' align='absmiddle'>홈<img src='/cfweb/lg/image/arrow_location.gif' align='absmiddle'>결제 서비스<img src='/cfweb/lg/image/arrow_location.gif' align='absmiddle'>개인전자결재함<img src='/cfweb/lg/image/arrow_location.gif' align='absmiddle'>결재함관리</td>");
	document.write("					</td>");
	document.write("					<td width='20'><img src='/cfweb/lg/image/title02.gif'></td>");
	document.write("				</tr>");
	document.write("			</table>");
	document.write("		</td>");
	document.write("	</tr>");
	document.write("	<tr>");
	document.write("		<td width='25'></td>");
	document.write("		<td valign='top'>");
	document.write("			<table border='0' cellpadding='0' cellspacing='0' width='100%'>");
	document.write("				<tr>");
	document.write("					<td height='10'></td>");
	document.write("					<td width='20'></td>");
	document.write("				</tr>");
	document.write("				<tr>");
	document.write("					<td>");	
	}
}

//****************************************
// 하단 COPYRIGHT 출력함수
//****************************************
function printCopyRight(){
	document.writeln("					</td>");
	document.writeln("					<td width='20'></td>");
	document.writeln("				</tr>");
	document.writeln("			</table>");
	document.writeln("		</td>");
	document.writeln("	</tr>");
	document.writeln("	<tr height='27'>");
	document.write("		<td width='25' background='../lg/image/copyright_bg.gif'></td>");
	document.writeln("		<td align='center' valign='bottom'>");
	document.writeln("			<table width='100%' border='0' cellpadding='0' cellspacing='0' background='../lg/image/copyright_bg.gif'>");
	document.writeln("				<tr>");
	document.writeln("					<td align='center'><a href='JavaScript:mastermail();' onfocus='this.blur()'><img src='../lg/image/copyright.gif' border='0'></td>");
	document.writeln("				</tr>");
	document.writeln("			</table>");
	document.writeln("		</td>");
	document.writeln("	</tr>");
	document.writeln("</table>");
}

function mastermail() {
	var modeUrl	= "http://" + window.document.location.host + "/Covi/person/mail/GGOI_newpost_W01.asp?Cmd=new&MailTo=webmaster" ;
	CoviFullWindow(modeUrl,'','resize');
}
function CoviFullWindow(fileName,windowName,etcParam) {

	var x = 800;
	var y = 600;

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

	if (windowName == "newMessageWindow")
	{
		windowName = new String(Math.round(Math.random() * 100000));
	}
	window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}