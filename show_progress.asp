<%
	Response.CharSet = "euc-kr"

	Dim fileinfo
	fileinfo = Request.QueryString("fileinfo")
%>
<html>
	<head>
	    <style type="text/css">
TD{ FONT-SIZE: 9pt;COLOR: #393939;FONT-FAMILY: "����"}
DIV{ FONT-SIZE: 9pt; COLOR: #393939; FONT-FAMILY: "����"}
A:link{ FONT-SIZE: 9pt;COLOR: #393939;FONT-FAMILY: ����;TEXT-DECORATION: none}
A:visited{    FONT-SIZE: 9pt;    COLOR: #393939;   FONT-FAMILY: ����;TEXT-DECORATION: none}
A:active{    FONT-SIZE: 9pt;   COLOR: #393939;    FONT-FAMILY: ����;    TEXT-DECORATION: none}
A:hover{    FONT-SIZE: 9pt;    COLOR: #0B790E;    FONT-FAMILY: ����;    TEXT-DECORATION: none}
INPUT{    FONT-SIZE: 9pt;    FONT-FAMILY: "����"}
SELECT{    FONT-SIZE: 9pt;    FONT-FAMILY: "����";    HEIGHT: 20px}
text{    FONT-SIZE: 9pt;    FONT-FAMILY: "����"}
TEXTAREA{    PADDING-RIGHT: 5px;    PADDING-LEFT: 5px;    FONT-SIZE: 9pt;    PADDING-BOTTOM: 5px;    COLOR: #393939;    PADDING-TOP: 5px;    FONT-FAMILY: "����"}

.btn{    BORDER-TOP-WIDTH: 1px;    BORDER-LEFT-WIDTH: 1px;    BORDER-LEFT-COLOR: #ffffff;    BORDER-BOTTOM-WIDTH: 1px;    BORDER-BOTTOM-COLOR: #ffffff;    WIDTH: 70px;    BORDER-TOP-COLOR: #ffffff;    PADDING-TOP: 2px;    HEIGHT: 20px;    BACKGROUND-COLOR: #e0e0e0;    BORDER-RIGHT-WIDTH: 1px;    BORDER-RIGHT-COLOR: #ffffff}
.page{    VERTICAL-ALIGN: bottom;   TEXT-ALIGN: right;padding-bottom:4px;width:300}
.point{    FONT-WEIGHT: bold;    COLOR: #cc6600;    PADDING-TOP: 2px}
.dotted{    BACKGROUND: url(../images/main/line_dot01.gif) #ffffff left ;    HEIGHT: 1px}
.white{    HEIGHT: 22px;    BACKGROUND-COLOR: #ffffff;padding-left:1;padding-right:1}
.line{    HEIGHT: 1px;    BACKGROUND-COLOR: #bcbcbc}
.calendar {  font-family: "Arial"; font-size: 8pt; color: #212121; text-decoration: none}


.mbody{    BACKGROUND-POSITION: left top;    BACKGROUND-IMAGE:  url(../images/bg_main.gif);   margin-left: 8px; margin-top:0;   BACKGROUND-REPEAT: repeat-x; background-color: #FFFFFF}
.mtitle{	height:47px;color:#3A3A3A;font-size:12pt;font-weight:bold;padding-top:8px;width:500;vertical-align : middle;}
.micon{padding:2px;height:40px;;}
.mwidth{    WIDTH: 800;}
.twidth{    MARGIN-LEFT: 25px;    WIDTH: 740px}
.subtxt{ COLOR: #2778a7; }
.mtxt{    FONT-WEIGHT: bold;   COLOR: #2778a7;    HEIGHT: 30px;padding-left:8px}
.msg{padding-left:55px;height:100;BACKGROUND-image: url(../images/i_msg.gif);BACKGROUND-REPEAT: no-repeat;background-position:left 50%;width:300;margin:10;border:1px dotted #dadada;padding-top:4px}


.ltitle{padding-left:10px;padding-top:2px;height:23px;background-color:E4E4E4;width:800}
.ltitle2{padding-left:10px;padding-top:2px;height:23px;background-color:FFFFCC;width:800}
.list{margin-top:2px;padding-top:4px;padding-left:10px;width:800}
.gray1{    PADDING-LEFT: 15px;    PADDING-TOP: 2px;    HEIGHT: 23px;    BACKGROUND-COLOR: #e4e4e4}
.gray2{    PADDING-LEFT: 3px;     BACKGROUND-COLOR: #eaeaea}
.gray3{    PADDING-LEFT: 15px;    PADDING-TOP: 2px;    HEIGHT: 23px;    BACKGROUND-COLOR: #e4e4e4}
.T1{    PADDING-LEFT: 15px;    PADDING-TOP: 2px;    HEIGHT: 23px}
.T2{    PADDING-LEFT: 15px;    PADDING-TOP: 2px;    HEIGHT: 23px}

A.l:link{    FONT-SIZE: 9pt;    FONT-FAMILY: ����;   TEXT-DECORATION: none}
A.l:visited{    FONT-SIZE: 9pt;    FONT-FAMILY: ����;    TEXT-DECORATION: none}
A.l:active{    FONT-SIZE: 9pt;    COLOR: #D58713;    FONT-FAMILY: ����;    TEXT-DECORATION: none}
A.l:hover{    FONT-SIZE: 9pt;    COLOR: #D58713;    FONT-FAMILY: ����;    TEXT-DECORATION: none}
.leftline1{    HEIGHT: 1px;    BACKGROUND-COLOR: #c3c3c3}
.leftline2{    HEIGHT: 1px;BACKGROUND: url(../images/main/line_dot01.gif) }
.leftmenu{height:22px;padding-top:4px }

.pbody{ background-color: F5F5F5;margin:0}
.iconbg{    BORDER-bottom: #7EAACA 1px solid;   BACKGROUND-COLOR: #C9E0F2;    COLOR: #002B42;    HEIGHT: 42px}
.vline1{    WIDTH: 1px;    BACKGROUND-COLOR: #6A9DBA;}
.vline2{    WIDTH: 1px;    BACKGROUND-COLOR: #DBF5FB;}
.pframe{   padding-left: 10px;padding-right:10}
.ptable{    MARGIN: 10px;background-color : B6B6B6;}
.tbbg{	background-color : B6B6B6;}
.ptitle{    PADDING-LEFT: 10px;    PADDING-TOP: 5px;    HEIGHT: 23px;    BACKGROUND-COLOR: E4F1FB}
.pstitle{background-color: f5f5f5;padding-left:15px;padding-top:4px;height:23}
.ptb1{background-color:f5f5f5;}
</style>
		<title>ó�� ���Դϴ�.</title>
		<link rel="stylesheet" href="/css/style.css" type="text/css">
			<script language="JScript">
				function fileinfo_change(fileinfo)
				{
					message.innerText = fileinfo;
				}
			</script>
	</head>
	<body scroll="no" class="pbody">
		<table width="100%" cellspacing="0" cellpadding="0" class="iconbg">
			<tr>
				<td width="65">
					<img src="/covinet/coviflownet/p_etc.jpg" width="65" height="41">
				</td>
				<td>
					<div id="message"><%= Server.HTMLEncode(fileinfo) %></div>
				</td>
			</tr>
		</table>
		<table border="0" cellspacing="1" cellpadding="2" class="ptable" width="360">
			<tr>
				<td height="60" align="center" bgcolor="#ffffff">
					<img src="/covinet/coviflownet/progress.gif" align="absmiddle">
				</td>
			</tr>
		</table>
	</body>
</html>
