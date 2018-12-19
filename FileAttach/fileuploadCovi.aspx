<%@ Page Language="C#" AutoEventWireup="true" CodeFile="fileuploadCovi.aspx.cs" Inherits="Approval_FileAttach_fileuploadCovi" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title><%= Resources.Approval.lbl_attachfile %></title>
    <style type="text/css">
    td { font-family: tahoma; font-size: 9pt }
    input { border:1px solid; border-color:#CCCCCC }
    textarea { border:1px solid; border-color:#CCCCCC }
    </style>
		<link rel="stylesheet" href="/GWImages/Common/css/css_style.css" type="text/css" />
        <link rel="stylesheet" href="/GWImages/Common/css/search.css" type="text/css" />
	<script language="javascript" type="text/javascript">
<!--
var bUploadControl = true;
var bSubmit = false;
var upfileList="<%=strINIList %>";
var OriCoviFileList="<%=strINIList %>";
var INIfileList="<%=strINIListFiles %>";
var sgUploadSize = '<%=System.Configuration.ConfigurationManager.AppSettings["UploadSize"].ToString()%>';//이준희(2007-01-30): 한 번에 멀티 업로드할 수 있는 파일들의 총 용량임.
var sgLogoUrl = '<%=System.Configuration.ConfigurationManager.AppSettings["LogoUrl"].ToString()%>';//이준희(2007-01-30): 파일 목록 배경에 사용될 로고의 주소임.
var sgMaxUnitSize	= '<%=System.Configuration.ConfigurationManager.AppSettings["MaxUnitSize"].ToString()%>';//이준희(2007-01-30): 업로드할 수 있는 개별 파일의 최대 용량임.
var sgUserLanguage	= '';
sgUserLanguage = '<%=Session["user_language"].ToString()%>';//이준희(2007-01-30): 사용자 언어임.
var sgCoviFileTransVer = '<%=System.Configuration.ConfigurationManager.AppSettings["CoviFileTransVer"].ToString()%>';//이준희(2007-07-09): 파일 전송 컨트롤의 버젼 정보임.
function AttachFiles()
{
	//debugger;
    try
    {
        while(document.CoviUpload == null)
        {
        }
    }
    catch(e)
    {
        alert(e);
    }
    
	document.CoviUpload.AttachFiles();
	//2006.12.05 by wolf upload UI 변경
	//파일 추가 후 바로 파일 front로 올리기
	//sendit();//20110922 front 올리기 변경
	//2006.12.05 by wolf upload UI 변경 End
}

function DeleteFiles()
{
/*
   //이전 파일 리스트 변수
    var strupfileList="";
    //삭제한 파일 리스트 변수 
    var strDfile ="";
    //삭세한 파일이 이전 파일이 아닐 경우 들어가는 변수
    var strFile="";
    
    strDfile =document.CoviUpload.GetFilesList();
     
    if(upfileList!="")
    {
        //이전 파일 리스트 변수에서
        //스트링에서 파일 명만 추출 한다
        var aryTemp = new Array();
        aryTemp=upfileList.split(';');   

	    for(i = 0;i <= aryTemp.length-2;i++)
	    {
	        var aryKey = new Array();
	        aryKey=aryTemp[i].split(':'); 
		    strupfileList=aryKey[0] +';';
	    }
    }
   
    if(strDfile!="")
    {
        //이전 파일 리스트 변수에서
        //스트링에서 파일 명만 추출 한다
        var aryTemp = new Array();
        aryTemp=strDfile.split(';');   
        
        
	    for(i = 0;i <= aryTemp.length-2;i++)
	    {
	        var aryKey = new Array();
	        aryKey=aryTemp[i].split(':');
		    strDfile=aryKey[0] +';';
	    }
    }
    
    //이전 파일중 
    //
    if(strupfileList!=""&&strDfile!="")
    {
        //구분자 ; 인 각각의 파일 리스트를 
        //배열로 분해 한다
        var aryDfile = new Array();
        var aryUpfile = new Array();
        aryDfile = strDfile.split(';'); 
        aryUpfile = strupfileList.split(';'); 
        
        for(var i=0 ; i<=aryDfile.length-2 ; i++)
        {
            for(var j=0 ; j<=aryUpfile.length-2 ; j++)
            {
                if(aryDfile[i]!=aryUpfile[i])
                {
                    strFile=strFile+aryDfile[i]+";";
                }
            }
        }
        
    }
    else if(strDfile!="")
    {
        strFile=strDfile;
    }
    */
   
	document.CoviUpload.DeleteFiles();
	
	
	/*
	
	var frame="<IFRAME ID='ifrDL' FRAMEBORDER=0 style='HEIGHT:0%;WIDTH:100%' "
	+ " SRC='filedelete.aspx?deleteFiles="
	+escape(strFile)+"'  scrolling='no'></IFRAME>";	
	//+strFile
	
	dellink.innerHTML=frame;
	dellink.style.display="none";	
	*/
	//strDfile =document.CoviUpload.GetFilesList();

	
}
function CKoldanew(filelist)
{
    var aryTemp = new Array();
    aryTemp=filelist.split(';');   
	var strListVal="";
	
	for(i = 0;i <= aryTemp.length-2;i++)
	{
	    var aryKey = new Array();
	    aryKey=aryTemp[i].split(':'); 
		if(aryKey[2]=="NEW")
		{
		    strListVal="NEW";
		}
	}
	if(strListVal=="")
	{
	    return false;
	}
	else
	{
	    return true;
	}
}
function sendit()
{
 
if(bUploadControl == false ) 
	{
		alert("\"CoviUpload\" 컨트롤이 설치되지 않았습니다.");
		return;
	}
	if(bSubmit == true)
	{
		return;
	}
	/*
	var filelist = document.CoviUpload.GetFilesList();//debugger;
	
	var ooan = CKoldanew(filelist);//파일 중 새로 올라가는 파일이 있는지 없는지 체크 한다
	
	if(document.CoviUpload.GetFilesList() == null || document.CoviUpload.GetFilesList() == "" || ooan==false)
    {
        if(upfileList != "")
        {
           funConfirm();
           window.close();
        }
        else
        {
			alert("첨부할 파일이 없습니다");
            return;
        }
    }
    */
	bSubmit = true;//debugger;//debugger;//이준희(2006-12-06): 65자가 넘는 길이의 파일명이 있을 경우, 경고 메시지와 함께 업로드 프로세스를 중단하도록 아래를 추가함.//var sHmxTest = "일이삼사오육칠팔구십이이삼사오육칠팔구십삼이삼사오육칠팔구십사이삼사오육칠팔구십오이삼사오육칠팔구십육이삼사오육칠팔구십칠이삼사오";
	/*
	var asHmxFles = new Array();//사용자가 선택한 파일들에 대한 정보의 배열임
	var i = 0; iHmx = 0;
	asHmxFles = filelist.split(';');
    */
	
	//debugger;//신택상 2007-01-26 최대한 오류를 줄이고자 submit()함수를 send 로 변경된것을 적용함
	var sURL1 = '', sURL2 = '';
	sURL1 = 'http://' + document.location.host;
	sURL2 = '/CoviWeb/common/FileAttach/Common_UP_load.aspx?fpath=Approval';
	
	if(document.CoviUpload.SendFile(sURL1, sURL2))
    {
			    if(fnHxmFileExist())
			    {//파일 업로드 직후 유효성 검사를 수행함.
				    funConfirm();
			    }
			    else
			    {
				    alert('파일 업로드 중 문제가 발생했습니다. 재시도를 하시고 지속적으로 문제가 발생하면 관리자에게 문의하십시오.');
				    bSubmit = false;
				    return;
	            }    
	    }
    else
    { 
		    alert("전송이 취소되었습니다.");
	}

	bSubmit = false;
}

function fnHxmFileExist()
{//debugger;
	var bRet = false;
	var aryTemp = new Array();//배열 만들고
	var aryTemp = document.CoviUpload.GetFilesList().split(';');
	var i = 0,j = 0;
	var sURL = '';
	for(i = 0; i < aryTemp.length-1; i++)
	{
		var aryKey = new Array();
	    aryKey = aryTemp[i].split(':'); 
	    if(aryKey[2] == "NEW")
        {//debugger;
			//sURL = 'http://' + document.location.host + '<%=strStorage%>'+'<%=Session["user_code"]%>'+'_' + aryKey[0];
			sURL = '<%=strStorage%>'+'<%=Session["user_code"]%>'+'_' + aryKey[0];
			while(bRet == false && j < 10)
			{//이준희(2007-02-06): robustness를 위해, 컨트롤 자체 역시 100ms 간격으로 총 3회 재시도하도록 되어 있음.
				if(document.CoviUpload.FileExists(sURL) == 200)
				{
					bRet = true;
				}
				else
				{
					setTimeout('event_noop()', 1000);
				}
				j += 1;
			}
        }
    }
    //return true;//이준희(2007-02-06): 타이밍 이슈에 대한 조치 후 본 라인은 제거할 것.
    bRet = true;
    return bRet;
}
function funConfirm() 
{
    //2006.12.05 by wolf upload UI 변경
	//새로 작성
    var AttFileInfo =getListXML();
    var AttFiles = getListVal("");
    opener.setAttachInfo2(AttFileInfo, AttFiles);
    
    //2006.12.05 by wolf upload UI 변경
    
    //2006.12.05 by wolf upload UI 변경
	//이전 소스 주석 처리
	//var AttFileInfo =getListXML();
    //var AttFiles = getListVal("");
    //opener.setAttachInfo(AttFileInfo, AttFiles);
    //window.close();
    //2006.12.05 by wolf upload UI 변경
    
}
function makeDelstring(FileList,fname)
{
    var nowINIFile = new Array();
    nowINIFile=FileList.split(';');
    
    //var bReturn= false;
    for(var j=0;j<nowINIFile.length-1;j++)
    {
        var aryNow = new Array();
        aryNow=nowINIFile[j].split(':'); 
        if(fname==aryNow[0]&&aryNow[2]=="DEL")
        {
           return false; 
        }
       
        
    }
    return true;
}

function makeOldXml(FileList)
{
    var ofileinfo= new ActiveXObject("MSXML2.DOMDocument");
    ofileinfo.loadXML("<fileinfo></fileinfo>");
    var oldINIFile = new Array();
    var oldOriFile = new Array();
    
    oldINIFile=INIfileList.split(';');
    oldOriFile=OriCoviFileList.split(';');
    for(var i=0;i < oldINIFile.length-1;i++)
    {
        var aryINI = new Array();
        var aryOri = new Array();
	    
	    aryINI=oldINIFile[i].split(':'); 
	    aryOri=oldOriFile[i].split(':'); 
	    //xml 알맹이 채우기
	        if(makeDelstring(FileList,aryOri[0])==true)
            {
                if(CKFrontFile(aryOri[0])==false)
                {
//                ofileinfo+=" <file name=\"" +aryOri[0] +"\"  ";
//                ofileinfo+=" location=\""+"<%=strBFileLoc%>"+aryINI[0]+"\"   ";
//                ofileinfo+="  size=\""+aryOri[1]+"\"  ";
//                ofileinfo+="  state=\"OLD\" ";
//                ofileinfo+="  user_name=\"" + aryOri[2] + "\" ";
//                ofileinfo+="  dept_name=\"" + aryOri[3] + "\" ";
//                ofileinfo+="  />";

                //xml 알맹이 채우기
	            var ofile = ofileinfo.createElement("file");
	            ofile.setAttribute("name",aryOri[0]);
	            ofile.setAttribute("location","<%=strBFileLoc%>"+aryINI[0]);
	            ofile.setAttribute("size",aryOri[1]);
	            ofile.setAttribute("state","OLD");
	            ofile.setAttribute("user_name",aryOri[2] );
	            ofile.setAttribute("dept_name", aryOri[3]);
	            ofileinfo.documentElement.appendChild(ofile);
                
                }
            }
    }
    return ofileinfo.xml.replace("<fileinfo>","").replace("</fileinfo>","");
}
function makeRloadXml(FileList)
{
    var ofileinfo= new ActiveXObject("MSXML2.DOMDocument");
    ofileinfo.loadXML("<fileinfo></fileinfo>");

    var oldINIFile = new Array();
    var oldOriFile = new Array();
    
    
    oldINIFile=INIfileList.split(';');
    oldOriFile=OriCoviFileList.split(';');
    
    for(var i=0;i < oldINIFile.length-1;i++)
    {
        var aryINI = new Array();
        var aryOri = new Array();
	    
	
	    aryINI=oldINIFile[i].split(':'); 
	    aryOri=oldOriFile[i].split(':'); 
	    
            if(makeDelstring(FileList,aryOri[0])==true)
            {
                
                if(CKFrontFile(aryOri[0]))
                { 
//                    ofileinfo+=" <file name=\"" +aryOri[0] +"\"  ";
//            
//                    ofileinfo+=" location=\""+"<%=strStorage%>/"+aryINI[0]+"\"   ";
//                    ofileinfo+="  size=\""+aryOri[1]+"\"  ";
//                    ofileinfo+="  state=\"NEW\"  ";
//                    ofileinfo+="  user_name=\""+aryOri[2]+"\"  ";
//                    ofileinfo+="  dept_name=\""+aryOri[3]+"\"  ";
//                    ofileinfo+=" />";
                //xml 알맹이 채우기
	            var ofile = ofileinfo.createElement("file");
	            ofile.setAttribute("name",aryOri[0]);
	            ofile.setAttribute("location", "<%=strStorage%>" + aryINI[0]); //원래 코드 ofile.setAttribute("location", "<%=strBFileLoc%>" + aryINI[0]);
	            ofile.setAttribute("size",aryOri[1]);
	            ofile.setAttribute("state","NEW");
	            ofile.setAttribute("user_name",aryOri[2]);
	            ofile.setAttribute("dept_name",aryOri[3]);
	            ofileinfo.documentElement.appendChild(ofile);

                }
            }
    }
   
     return ofileinfo.xml.replace("<fileinfo>","").replace("</fileinfo>","");
    
}
//function makeOldXml(FileList)
//{
//    var ofileinfo= new ActiveXObject("MSXML2.DOMDocument");
//    ofileinfo.loadXML("<fileinfo></fileinfo>");

//    var oldINIFile = new Array();
//    var oldOriFile = new Array();
//    
//    
//    //<fileinfos><fileinfo index="0">
//    //<file name="고정자산정수(설정,정정)승인서.txt" 
//    //location="/COVINet/BackStorage/e-sign/Approval/ATTACH/10/52646_고정자산정수(설정,정정)승인서.txt" 
//    //size="5129"/></fileinfo>
//    //</fileinfos>
//    oldINIFile=INIfileList.split(';');
//    oldOriFile=OriCoviFileList.split(';');
//    
//    var ofileinfo ="";
//    
//    
//    //strBFileLoc
//    //debugger;
//    for(var i=0;i < oldINIFile.length-1;i++)
//    {
//        var aryINI = new Array();
//        var aryOri = new Array();
//	    
//	
//	    aryINI=oldINIFile[i].split(':'); 
//	    aryOri=oldOriFile[i].split(':'); 
//	    //xml 알맹이 채우기
//	    
////        var ofile = ofileinfo.createElement("file");
////        ofile.setAttribute("name",aryOri[0]);
//            if(makeDelstring(FileList,aryOri[0])==true)
//            {

//                if(CKFrontFile(aryOri[0])==false)
//                {
//                ofileinfo+=" <file name=\"" +aryOri[0] +"\"  ";
//                
//        //        ofile.setAttribute("location",'<%=strBFileLoc%>'+aryINI[0]);
//                ofileinfo+=" location=\""+"<%=strBFileLoc%>"+aryINI[0]+"\"   ";
//        //        //파일 업로드 컴포넌트 문제로 사용
//        //	    //사이즈가 필요 해서 사용함
//        //        ofile.setAttribute("size",aryOri[1]);

//                ofileinfo+="  size=\""+aryOri[1]+"\"  ";
//                
//                ofileinfo+="  user_name=\""+aryOri[2]+"\"  ";
//                ofileinfo+="  dept_name=\""+aryOri[3]+"\"  ";

//        //        //파일 상태 값 old;new;del
//        //        ofile.setAttribute("state","OLD");
//                
////                    ofileinfo+="  state=\"NEW\"  />";
////                }
////                else
////                {
//                    ofileinfo+="  state=\"OLD\"  />";
//                }
//                //ofileinfo+="  state=\"OLD\"  />";
//        //        ofileinfo.documentElement.appendChild(ofile);
//            }
//    
//    

//    }
//    
//    
//    return ofileinfo;
//}
//function makeRloadXml(FileList)
//{
//    var oldINIFile = new Array();
//    var oldOriFile = new Array();
//    
//    
//    //<fileinfos><fileinfo index="0">
//    //<file name="고정자산정수(설정,정정)승인서.txt" 
//    //location="/COVINet/BackStorage/e-sign/Approval/ATTACH/10/52646_고정자산정수(설정,정정)승인서.txt" 
//    //size="5129"/></fileinfo>
//    //</fileinfos>
//    oldINIFile=INIfileList.split(';');
//    oldOriFile=OriCoviFileList.split(';');
//    
//    var ofileinfo ="";
//    
//    
//    //strBFileLoc
//    //debugger;
//    for(var i=0;i < oldINIFile.length-1;i++)
//    {
//        var aryINI = new Array();
//        var aryOri = new Array();
//	    
//	
//	    aryINI=oldINIFile[i].split(':'); 
//	    aryOri=oldOriFile[i].split(':'); 
//	    //xml 알맹이 채우기
//	    
////        var ofile = ofileinfo.createElement("file");
////        ofile.setAttribute("name",aryOri[0]);
//            if(makeDelstring(FileList,aryOri[0])==true)
//            {
//                
//                if(CKFrontFile(aryOri[0]))
//                { 
//                ofileinfo+=" <file name=\"" +aryOri[0] +"\"  ";
//                
//        
//                ofileinfo+=" location=\""+"<%=strStorage%>"+aryINI[0]+"\"   ";
//        //        //파일 업로드 컴포넌트 문제로 사용
//        //	    //사이즈가 필요 해서 사용함
//        //        ofile.setAttribute("size",aryOri[1]);

//                ofileinfo+="  size=\""+aryOri[1]+"\"  ";

//        //        //파일 상태 값 old;new;del
//        //        ofile.setAttribute("state","OLD");
//                
////                    ofileinfo+="  state=\"NEW\"  />";
////                }
////                else
////                {
//                    ofileinfo+="  state=\"NEW\"  />";
//                }
//                //ofileinfo+="  state=\"OLD\"  />";
//        //        ofileinfo.documentElement.appendChild(ofile);
//            }
//    
//    

//    }
//    
//    
//    return ofileinfo;
//    
//}
//function getListXML() 
{
    var ofileinfo= new ActiveXObject("MSXML2.DOMDocument");
    //xml 껍데기를 만들기
	
	//배열 만들고
	var aryTemp = new Array();
	var tmp = document.CoviUpload.GetFilesList();
	
	//debugger;
	var oldtext = "";
	if(INIfileList!="")
	{
	    oldtext = makeOldXml(tmp);
	    //alert(oldtext);
	    oldtext += makeRloadXml(tmp);
	    //alert(oldtext);
	    ofileinfo.loadXML("<fileinfo>"+oldtext+"</fileinfo>");
	}
	else
	{
	    ofileinfo.loadXML("<fileinfo></fileinfo>");
	}	
	
	aryTemp=tmp.split(';');   
	var strListVal="";
	
	var aryINITemp =new Array();
	
	aryINITemp = INIfileList.split(';');
	var aryUPTemp =new Array();
	aryUPTemp =upfileList.split(';');
    
	var k;
	if(aryINITemp.length==0)
	{
	    k=0;
	}
	else
	{
	    k=aryINITemp.length-1;
	}	
	
	for(var i = 0;i < aryTemp.length-1;i++)
	{
	    
	    var aryKey = new Array();
	    
	    aryKey=aryTemp[i].split(':');        
	    
	    strStorage='<%=strStorage%>';
	    strUserCode='<%=strUserCode%>'; 
	    var strUserName = '<%=strUserName%>'
	    var strUserDeptName = '<%=strUserDeptName%>'
	    
	    var strlocation  =strStorage+strUserCode+"_"+aryKey[0];
	    //삭제일 경우에는 삭제 리스트에는 보이지 않으나
	    //데이터 상에는 남아 있음으로 이렇게 한다
            if(aryKey[2]!="OLD"&&aryKey[2]!="DEL")
	        {
                //xml 알맹이 채우기
	            var ofile = ofileinfo.createElement("file");
	            ofile.setAttribute("name",aryKey[0]);
	            ofile.setAttribute("storageid", "1");
	            ofile.setAttribute("id", aryKey[0]);    	        
	            ofile.setAttribute("location",strlocation);  
	            ofile.setAttribute("user_name",strUserName);
	            ofile.setAttribute("dept_name",strUserDeptName);
	            ofile.setAttribute("loct", opener.getInfo("loct"));  	        
	            //파일 업로드 컴포넌트 문제로 사용
		        //사이즈가 필요 해서 사용함
	            ofile.setAttribute("size",aryKey[1]);
	            //파일 상태 값 old;new;del
	            ofile.setAttribute("state",aryKey[2]);
	            ofileinfo.documentElement.appendChild(ofile);
	            
//                strListVal += "<file name='" + aryKey[0]+ "'"
//						+ " storageid='1'"
//						+ " id='" + aryKey[0]+ "'"
//						+ " location='"  +  strlocation + "'"
//						+ " size='"  +  aryKey[1] + "'"
//						+ " state='"  +  aryKey[2]
//						+ "'></file>";
            }
	    
	}
	
	// alert(ofileinfo.xml);
    if (ofileinfo.xml == null || ofileinfo.xml == "")
    //if (strListVal == null || strListVal == "")
    {
		return "";
	}
	else if(aryTemp.length==1)
	{
		return "";
	}
	else
	{	   
		return ofileinfo.xml;		
		//return "<fileinfo>"+strListVal+"</fileinfo>";		
	}



}
function getListVal(href) 
{

//    var ofileinfo= new ActiveXObject("MSXML2.DOMDocument");
//    //xml 껍데기를 만들기
//	ofileinfo.loadXML("<fileinfo></fileinfo>");
//	//배열 만들고
//	var aryTemp = new Array();
//	var tmp = document.CoviUpload.GetFilesList();
//	//제목 없음.JPG:13843:JPEG 이미지;새 텍스트 문서.txt:4:텍스트 문서;
//	//문자열을 쪼갠다 위의 것은 컴포넌트에서 넘어오는 
//	//문자열 형태이다
//	aryTemp=tmp.split(';');   
//	var strListVal="";
//	
//	for(i = 0;i < aryTemp.length-1;i++)
//	{
//	
//	    var aryKey = new Array();
//	    aryKey=aryTemp[i].split(':'); 
//	    var strItem="";
//	    var strStorage='<% =strStorage%>';
//	    
//	    //삭제일 경우에는 삭제 리스트에는 보이지 않으나
//	    //데이터 상에는 남아 있음으로 이렇게 한다
//	    if(aryKey[2]!="DEL")
//	    {
//	        //strListVal=strListVal+aryKey[0].toString()
//	        //strItem = "<a href=\"../FileAttach/download.aspx?location="
//	        if(aryKey[2]=="NEW"){//신규 파일의 경우 front에서 연다. download com에서 어찌 여는지 모르겠음
//    	        strItem = ", "+"<a href=\"/COVINet/FrontStorage/Approval/<%=Session["user_code"]%>_"+aryKey[0]
//    	            + "\" target = \"_blank\">" + aryKey[0]  + "</a>";
//    	        strItem = aryKey[0];
//	        }else{
//    	        /*strItem = "<a href=\"../FileAttach/download.aspx?location="
//    	        strItem =strItem + aryTemp[i] + "\" target = \"_blank\">" + aryKey[0]  + "</a>";
//    	        */
//	        }
//	        //+ strStorage + aryKey[0] + "&filename=" 
//	        strListVal=strListVal+strItem;
//	    }
//	
//	    
//	}
//	//위의 알고리즘에서 , 가 끝에 하나 더붙어 나온다 그걸 잘라준다
//	//strListVal=strListVal.substring(0,strListVal.length-2);

//	if (strListVal == null || strListVal == "")
		return "";
//	else
//		return strListVal;//.substring(1);
}
function CKFrontFile(name)
{
//프론트 스토리지 에 있는 건지 아닌 건지 체크 하는 함수
//draken_icon_research_list7.gif:54;draken_icon_research_list8.gif:54;draken_icon_research_list9.gif:54;
    
    var strFfile;
    var aryTemp = new Array();
    aryTemp=INIfileList.split(';'); 
    
    for(var i = 0;i < aryTemp.length-1;i++)
	{
	    var aryKey = new Array();
	    aryKey=aryTemp[i].split(':'); 
	    
	    strFfile=aryKey[0];
	    strFfile=strFfile.replace("<%=strUserCode%>"+"_","")
	    if(strFfile==name)
	    {
	        return true;
	    }
	}
    return false;
}
function fileHref(name)
{
	return name.replace("%","%25").replace("&","%26").replace("#","%23").replace("+","%2B");
}
//2006.12.05 by wolf upload UI변경
//창이 로딩되면서 파일선택창 나타나게
//function window.onload(){
//     if(window.document.readyState == "complete"){
//        window.document.onreadystatechange = event_noop;
//        AttachFiles();
//     }
//     
//}
function event_noop(){return(false);}
//2006.12.05 by wolf upload UI변경 End
//-->
</script>
</head>
<body>
<div class="popup_title">
  <div class="title_tl">
    <div class="title_tr">
      <div class="title_tc">
      <h2><span><%= Resources.Approval.msg_189 %></span></h2></div>
    </div>
  </div>
</div>

<div id="CoviUpload" style="height:140px;">
    <script src="./fileupload.js" language ="javascript" ></script>
</div>

<div class="popup_Btn small AlignR">
    <a href="#" class="Btn04" id="btnAct" name="btnAct" onclick="javascript:AttachFiles();"><span><%= Resources.Approval.btn_add %></span></a> 
    <a href="#" class="Btn04" onclick="javascript:parent.DeleteFiles();"><span><%= Resources.Approval.btn_delete %></span></a>
    <a href="#" class="Btn04" onclick="javascript:parent.sendit();"><span><%= Resources.Approval.btn_confirm %></span></a>
    <a href="#" class="Btn04" onclick="javascript:parent.window.close();"><span><%= Resources.Approval.btn_close %></span></a>
</div>	   
</body>
</html>