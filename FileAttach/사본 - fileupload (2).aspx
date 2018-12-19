<%@ Page Language="C#" AutoEventWireup="true" CodeFile="fileupload.aspx.cs" Inherits="COVIFlowNet_FileAttach_fileupload" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title><%=Resources.Approval.btn_attach %></title>
    <style type="text/css">
    td { font-family: tahoma; font-size: 9pt }
    input { border:1px solid; border-color:#CCCCCC }
    textarea { border:1px solid; border-color:#CCCCCC }
    </style>
    <link href="/COVINet/common/style/covi.css" rel="stylesheet" type="text/css" />
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


function AttachFiles()
{
	document.CoviUpload.AttachFiles();//debugger;
}

function DeleteFiles()
{  
	document.CoviUpload.DeleteFiles();
	
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
	
	if(chkExistsZero(document.CoviUpload.GetFilesList()))
    {
		bSubmit = true;
    }
    else
    {
		bSubmit = false;
		alert("파일 사이즈가 0인 파일은 업로드 할 수 없습니다.");
		return;
    }
	
	
	var filelist = document.CoviUpload.GetFilesList();//debugger;
	
	var ooan = CKoldanew(filelist);//파일 중 새로 올라가는 파일이 있는지 없는지 체크 한다
	
	if(document.CoviUpload.GetFilesList() == null || document.CoviUpload.GetFilesList() == "" || ooan==false)
    {
        if(upfileList != "")
        {
           funConfirm();
           window.close();
           
           // return부분이 빠져 있었으므로 추가 : 07. 3. 16. JSI
           return;
        }
        else
        {
			alert("첨부할 파일이 없습니다");
            return;
        }
    }
	bSubmit = true;//debugger;//debugger;//이준희(2006-12-06): 65자가 넘는 길이의 파일명이 있을 경우, 경고 메시지와 함께 업로드 프로세스를 중단하도록 아래를 추가함.//var sHmxTest = "일이삼사오육칠팔구십이이삼사오육칠팔구십삼이삼사오육칠팔구십사이삼사오육칠팔구십오이삼사오육칠팔구십육이삼사오육칠팔구십칠이삼사오";
	var asHmxFles = new Array();//사용자가 선택한 파일들에 대한 정보의 배열임
	var i = 0; iHmx = 0;
	asHmxFles = filelist.split(';');
//	
	var sURL1 = '', sURL2 = '';
	sURL1 = 'http://' + document.location.host;
	sURL2 = '/COVINet/common/FileAttach/Common_UP_load.aspx?fpath=Approval';
	if(document.CoviUpload.SendFile(sURL1, sURL2))//if(document.CoviUpload.SendFile(document.location.host, "/COVINet/common/FileAttach/Common_UP_load.aspx?fpath=Approval"))
	{	
       if(fnHxmFileExist() != true)
		{
			alert('파일 업로드 중 문제가 발생했습니다. 재시도를 하시고 지속적으로 문제가 발생하면 관리자에게 문의하십시오.');//"파일 업로드 중 문제가 발생했습니다." 오류 메시지를 띄움.
			bSubmit = false;
			return;
		}else{
		    funConfirm();
		
		}
	}
	else
	{//파일 업로드 무결성 코드를 입력할 예정
		alert("전송이 취소되었습니다.");
	}
	bSubmit = false;
}


function chkExistsZero(filelist)
{
    var aryTemp = new Array();
    aryTemp = filelist.split(';');
	
    for(i = 0; i <= aryTemp.length - 2; i++)
    {
        var aryKey = new Array();
        aryKey = aryTemp[i].split(':'); 
        if(aryKey[2] == "NEW" && aryKey[1] < 1)
        {
            return false;
        }
    }
    
    return true;
}

function fnHxmFileExist()
{//debugger;
	var bRet = false;
	var aryTemp = new Array();//배열 만들고
	var aryTemp = document.CoviUpload.GetFilesList().split(';');
	var i = 0, j = 0;
	for(i = 0; i < aryTemp.length-1; i++)
	{
		var aryKey = new Array();
		aryKey = aryTemp[i].split(':');//debugger;
		if(aryKey[2] == "NEW")
		{//debugger;//신규 파일의 경우 front에서 연다. download com에서 어찌 여는지 모르겠음//if(document.CoviUpload.FileExists("http://" + document.location.host + '<%=strStorage%>/<%=Session["user_code"]%>_' + aryKey[0]) < 1)
		   var exHref = "http://" + document.location.host + '<%=strStorage%>/<%=Session["user_code"]%>_' + aryKey[0];
			while(bRet == false && j < 50)//이준희(2007-02-08): n회 시도함.
			{
				if(document.CoviUpload.FileExists(exHref) == 200)
				{
					bRet = true;
				}
				else
				{
					setTimeout('event_noop()', 1000);//1000ms동안 대기 후 재시도함.
				}
				j += 1;
			}
		}
	}
	//debugger;
	return bRet;//return true;
}
function funConfirm() 
{//debugger;//var tmp = document.CoviUpload.GetFilesList();//alert(tmp);
    var AttFileInfo = getListXML();//debugger;
    var AttFiles = getListVal("");//debugger;
    opener.setAttachInfo(AttFileInfo, AttFiles);
    window.close();/*var AttFileInfo = getListXML();var AttFiles = getListVal("");opener.setAttachInfo(AttFileInfo, AttFiles);window.close();*/
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
    var oldINIFile = new Array();
    var oldOriFile = new Array();
    
   
    oldINIFile=INIfileList.split(';');
    oldOriFile=OriCoviFileList.split(';');
    
    var ofileinfo ="";
    
    
    //strBFileLoc
    //debugger;
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
                ofileinfo+=" <file name=\"" +aryOri[0] +"\"  ";
                ofileinfo+=" location=\""+"<%=strBFileLoc%>"+aryINI[0]+"\"   ";
                ofileinfo+="  size=\""+aryOri[1]+"\"  ";
                ofileinfo+="  state=\"OLD\"  />";
                }
            }
    }
    return ofileinfo;
}
function makeRloadXml(FileList)
{
    var oldINIFile = new Array();
    var oldOriFile = new Array();
    
    oldINIFile=INIfileList.split(';');
    oldOriFile=OriCoviFileList.split(';');
    
    var ofileinfo ="";
    
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
                ofileinfo+=" <file name=\"" +aryOri[0] +"\"  ";
                
        
                ofileinfo+=" location=\""+"<%=strStorage%>"+aryINI[0]+"\"   ";
                ofileinfo+="  size=\""+aryOri[1]+"\"  ";
                    ofileinfo+="  state=\"NEW\"  />";
                }
            }
    }
    return ofileinfo;
}
function getListXML() 
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
	    var strlocation  =strStorage+strUserCode+"_"+aryKey[0];
	        if(aryKey[2]!="OLD"&&aryKey[2]!="DEL")
	        {
                //xml 알맹이 채우기
	            var ofile = ofileinfo.createElement("file");
	            ofile.setAttribute("name",aryKey[0]);
	            ofile.setAttribute("location",strlocation);
    	        
	            //파일 업로드 컴포넌트 문제로 사용
		        //사이즈가 필요 해서 사용함
	            ofile.setAttribute("size",aryKey[1]);
	            //파일 상태 값 old;new;del
	            ofile.setAttribute("state",aryKey[2]);
	            ofileinfo.documentElement.appendChild(ofile);
            }
	    
	}
	// alert(ofileinfo.xml);
    if (ofileinfo.xml == null || ofileinfo.xml == "")
    {
		return "";
	}
	else if(aryTemp.length==1)
	{
		return "";
	}
	else
	{
	   
		return "<fileinfos>"+ofileinfo.xml+"</fileinfos>";
	}



}
function getListVal(href) 
{

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

//창이 로딩되면서 파일선택창 나타나게
/*
function window.onload(){
    debugger;
     if(window.document.readyState == "complete"){
        window.document.onreadystatechange = event_noop;
        AttachFiles();
     }
     
}*/
function event_noop(){return(false);}

//-->
		</script>
</head>
<body  topmargin ="0" leftmargin="0">
    <form id="form1" method ="post" enctype="multipart/form-data"  action="/COVINet/common/FileAttach/Common_UP_load.aspx?fpath='Approval'">
    
        <table width="100%" height="100%"  border="0" cellpadding="0" cellspacing="0">
            <tr>
	            <td height="3" align="center" valign="middle" class="table_topline"></td>
            </tr>
            <tr>
	            <td height="40" align="left" valign="middle" class="table_green"> &nbsp;&nbsp;&nbsp;<img src="../../common/images/icon/icon_pop.gif" width="27" height="18" align="absmiddle"> 파일첨부 </td>
            </tr>
            <tr >
	            <td  height="1" align="center" valign="middle" class="pop_line"></td>
            </tr>
            <tr>
	            <td align="center" valign="top" class="pop_bg">
                    <table width="100%"  border="0" cellspacing="0" cellpadding="0">
	                    <tr>
		                    <td height="200" align="center" class="table_gray">
               		            <div id="CoviUpload">
		                        <script src="./fileupload.js" language ="javascript" ></script>
		                        </div>
                            </td>
                            
	                    </tr>
                        <tr>
                            <td align="center" height="30">
                                <table border="0" cellpadding="0" cellspacing="0" style="padding-left:3px;margin-top:15">
                                    <tr>
                                        <td>
                                            <table border="0" cellpadding="0" cellspacing="0" height="20" style="cursor:hand" onclick="AttachFiles();">
                                            <tr align="center">
                                            <td align="left"><img src="../../common/images/button/btn_left.gif" alt=""/></td>
                                            <td class="btn_bg"><%= Resources.Approval.btn_add %></td>
                                            <td align="right"><img src="../../common/images/button/btn_right.gif" alt=""/></td>
                                            </tr>
                                            </table>
                                        </td>
                                        <td>
                                            <table border="0" cellpadding="0" cellspacing="0" height="20" style="cursor:hand" onclick="DeleteFiles();">
                                            <tr align="center">
                                            <td align="left"><img src="../../common/images/button/btn_left.gif" alt=""/></td>
                                            <td class="btn_bg"><%= Resources.Approval.btn_delete %></td>
                                            <td align="right"><img src="../../common/images/button/btn_right.gif" alt=""/></td>
                                            </tr>
                                            </table>
                                        </td>
                                        <td>
                                            <table border="0" cellpadding="0" cellspacing="0" height="20" style="cursor:hand" onclick="sendit();">
                                            <tr align="center">
                                            <td align="left"><img src="../../common/images/button/btn_left.gif" alt=""/></td>
                                            <td class="btn_bg"><%= Resources.Approval.btn_confirm %></td>
                                            <td align="right"><img src="../../common/images/button/btn_right.gif" alt=""/></td>
                                            </tr>
                                            </table>
                                        </td>
                                        <td>
                                            <table border="0" cellpadding="0" cellspacing="0" height="20" style="cursor:hand" onclick="javascript:window.close();">
                                            <tr align="center">
                                            <td align="left"><img src="../../common/images/button/btn_left.gif" alt=""/></td>
                                            <td class="btn_bg"><%= Resources.Approval.btn_close %></td>
                                            <td align="right"><img src="../../common/images/button/btn_right.gif" alt=""/></td>
                                            </tr>
                                            </table>
                                        </td>
                                        
                                    </tr>
                                </table>
                              </td>
                        </tr>
	                    <tr>
		                    <td height="2" align="center" background="../../common/images/icon/spot_gray.gif"></td>
	                    </tr>
	                    <tr>
		                    <td height="10" align="center"></td>
	                    </tr>
                    </table>        
	            </td>
            </tr>
            <tr>
	            <td height="3" align="center" valign="middle" class="table_topline"></td>
            </tr>
        </table>
        <div id="dellink"></div>
    </form>
</body>
</html>

