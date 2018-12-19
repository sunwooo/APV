// JScript 파일
document.write('<OBJECT width="500" height="500" align="center" hspace="0" vspace="0" style="border:0px"  ID="CoviDownCtl" CLASSID="CLSID:C036AC04-FAAF-45A7-A493-3FD3E6A2010D" codebase="../../common/codebase/CoviDown.cab#version=1,0,0,9" VIEWASTEXT>');
document.write('    <PARAM NAME ="strComp" VALUE ="COVISION">' ); //LocId제거
document.write('    <PARAM NAME ="URLPath" VALUE = "">');
document.write('    <PARAM NAME ="DownFiles" VALUE = "">');
document.write('</OBJECT>');
document.write('<script language=javascript>document.CoviDownCtl.URLPath=strlocation</script>');
document.write('<script language=javascript>document.CoviDownCtl.DownFiles=strphygicalName</script>');

