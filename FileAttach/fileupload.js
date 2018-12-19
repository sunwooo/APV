// document.write('<object classid="CLSID:274A3A7E-2CEB-423B-B3E5-B08660D6465E" codebase="../../common/codebase/CoviUpload.cab#version=1,0,0,12" width="1px" height="1px" id="CoviUpload" name="CoviUpload" onError="bUploadControl = false;" style="border:0px;" VIEWASTEXT>')
//document.write('    <param name="uploadSize" value="52428800"> <!-- 전체업로드용량(Bytes): 0으로 넣거나 빼면 제한없음 -->')
////document.write('    <param name="uploadSize" value="0"> <!-- 전체업로드용량(Bytes): 0으로 넣거나 빼면 제한없음 -->')
//document.write('    <param name="UploadFileCnt" value="49">')
//document.write('    <param name="INIListFiles" value="">')
//document.write('</object>')
//document.write('<script language=javascript>document.CoviUpload.INIListFiles = OriCoviFileList</script>')
////document.write('<script language=javascript>alert(upfileList)</script>')
////document.write('<script language=javascript>alert(document.CoviUpload.INIListFiles);</script>')

var s = '';

if(navigator.userAgent.indexOf('Windows 98') > -1)

{//사용자 운영체제가 Windows98이면
s += '<object classid="CLSID:9EF096ED-EBB5-44F1-9657-D6732B745E78" codebase="/COVINet/common/codebase/CoviFileTransW98Up.cab#version=1,0,0,7' + '" width="100%" height="100%" id="CoviUpload" name="CoviUpload" onError="bUploadControl = false;" style="border:0px;" VIEWASTEXT>';//Windows98용 업로딩 컨트롤을 사용함.
}
else
{//Windows 2000 이상이면
//s += '<object classid="CLSID:9EF096ED-EBB5-44F1-9657-D6732B745E78" codebase="/COVINet/common/codebase/CoviFileTrans.cab#version=1,0,1,5" width="100%" height="100%" id="CoviUpload" name="CoviUpload" onError="bUploadControl = false;" style="border:0px;" VIEWASTEXT>';//정규 컨트롤을 사용함.
//s += '<object classid="CLSID:9EF096ED-EBB5-44F1-9657-D6732B745E78" codebase="/CoviWeb/SiteReference/cab/CoviFileTrans.cab#version=' + sgCoviFileTransVer + '" width="100%" height="100%" id="CoviUpload" name="CoviUpload" onError="bUploadControl = false;" style="border:0px;" VIEWASTEXT>';//정규 컨트롤을 사용함.
    s += '<object classid="CLSID:9EF096ED-EBB5-44F1-9657-D6732B745E78" codebase="/CoviWeb/SiteReference/cab/CoviFileTrans.cab#version=1,0,1,48" width="100%" height="100%" id="CoviUpload" name="CoviUpload" onError="bUploadControl = false;" style="border:0px;" VIEWASTEXT>';//정규 컨트롤을 사용함.
}
document.write(s);
//document.write('<object classid="CLSID:9EF096ED-EBB5-44F1-9657-D6732B745E78" codebase="/CoviWeb/SiteReference/cab/CoviFileTrans.cab#version=1,0,1,5" width="100%" height="100%" id="CoviUpload" name="CoviUpload" onError="bUploadControl = false;" style="border:0px;" VIEWASTEXT>');
document.write('<param name="uploadSize" value="' + sgUploadSize + '">');
document.write('<param name="UploadFileCnt" value="100">');
document.write('<param name="LogoUrl" value="' + sgLogoUrl + '">');
document.write('<param name="MaxUnitSize" value="' + sgMaxUnitSize + '">');//개별 파일의 최대 용량임.
document.write('<param name="Lang" value="ko-KR">');
document.write('</object>');//document.write('<script language=javascript>document.CoviUpload.INIListFiles = OriCoviFileList</script>');
document.write('<script language=javascript>');
document.write('document.CoviUpload.INIListFiles = OriCoviFileList;');
document.write('document.CoviUpload.SetLangMode("' + sgUserLanguage + '");');
document.write('</script>');

//i.	국문: “ko”
//ii.	영문: “en”
//iii.	중문: “zh”
//iv.	일문: “ja”