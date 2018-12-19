<script language="javascript">
function getRefWindow(){
	if(parent.name == 'rightFrame')		// 리스트뷰에서 사용할때
		return parent.window;
	if(window.top.navbar_fr == null)	// mainform.asp 로 열리지 않고 직접 열린 문서
		return window.top ;
	else	// mainform.asp 로 열린 문서 
		return window.top.navbar_fr ;
}
</script>

<%
Function beginProgress(Title,subTitle)
	Title = Replace(Title,"'","\'")
	subTitle = Replace(subTitle,"'","\'")
	Response.write "<script language='javascript'>getRefWindow().beginProgress('" & Title & "','" & subTitle & "');</script>"
	Response.flush
End function

Function beginConCurProgress(Title,subTitle)
	Title = Replace(Title,"'","\'")
	subTitle = Replace(subTitle,"'","\'")
	Response.write "<script language='javascript'>getRefWindow().beginProgress('" & Title & "','" & subTitle & "');</script>"
	Response.flush
End function

Function beginProgress_Cooper(Title,subTitle)
	Title = Replace(Title,"'","\'")
	subTitle = Replace(subTitle,"'","\'")
	Response.write "<script language='javascript'>getRefWindow().beginProgress('" & Title & "','" & subTitle & "  [ 남은 협조처 : ' + parent.cnt_req_cooper + ' 개 ]');</script>"
	Response.flush
End function

Function updateProgress(Title,subTitle)
	Title = Replace(Title,"'","\'")
	subTitle = Replace(subTitle,"'","\'")
	Response.write "<script language='javascript'>getRefWindow().updateProgress('" & Title & "','" & subTitle & "');</script>"
	Response.flush
End function

Function endProgress()
	AfterScript = Replace(AfterScript,"'","\'")
	Response.write "<script language='javascript'>getRefWindow().endProgress();</script>"
	'Response.flush
End function

Function endProgress_Cooper(AfterScript)
	AfterScript = Replace(AfterScript,"'","\'")
	Response.write "<script language='javascript'>if (parent.cnt_req_cooper==0){getRefWindow().endProgress('" & AfterScript & "');}</script>"
	'Response.flush
End function

Function endProgress_Delay(AfterScript,DelayTime)
	AfterScript = Replace(AfterScript,"'","\'")
	Response.write "<script language='javascript'>setTimeout(""getRefWindow().endProgress('" & AfterScript & "')""," & DelayTime & ")</script>"
	'Response.flush
End function
%>
