<%@ Page Language="C#" AutoEventWireup="true" CodeFile="formmenu_mini_diffCopy.aspx.cs" Inherits="Approval_Forms_formmenu_mini_diffCopy" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>difference form copy</title>
    <script type="text/javascript" language="javascript" src="../../common/script/coviflownet/openwindow.js"></script>
    <script language="javascript" src="formedit.js" type="text/javascript"></script>
    <script type="text/javascript" language="javascript" src="/CoviWeb/SiteReference/js/Utility.js" ></script>
</head>
<body>
<div id="divDifferform" container='1' style='overflow: hidden; position: absolute; z-index: 12000;'>
	<div submenu='1' id='divDifferform_C' class="Ctx_Table1" style='position: relative;background-image: url(<%=Session["user_thema"] %>/Covi/Common/icon/cont_back.gif); background-repeat: repeat-y;' igLevel='0'>
			<div scrollDiv=1>
				<%=strDiffForm%>
       </div>
  </div>
</div>
<script type="text/javascript" language="javascript" >
    
    var windowname="<%= Resources.Approval.lbl_write %>";
    function Open_Form(fmid, fmnm, fmpt, scid, fmrv, fmfn){
			var today = new Date();
	    var strURL = "Form.aspx?fmid=" + fmid + "&fmnm=" + toUTF8(fmnm) + "&fmpf="+fmpt+"&scid="+scid+"&mode=DRAFT&fmrv="+fmrv+"&fmfn="+fmfn;
			if(top.location.href.toUpperCase().indexOf("FORMTAB.ASPX") > -1 ){ //MULTI TAB으로 OPEN됨
				var szopenerparenturl = "";
				var oTopOpenWindow = null;
				szopenerparenturl = top.opener.location.href.toUpperCase();
				if (szopenerparenturl.indexOf("/FORMLIST/FORMLIST.ASPX") > -1 ){//문서작성 창에서 OPEN
					oTopOpenWindow = top.opener.parent.oFRMWIN;
				}else if(szopenerparenturl.indexOf("/FORMS/FORMMENU_MINI.ASPX") > -1 ){//좌측메뉴 양식즐겨찾기 메뉴에서 양식 오픈시(작은버튼)
					oTopOpenWindow = top.opener.parent.parent.oFRMWIN;
				}else if(szopenerparenturl.indexOf("/APPROVAL/LISTITEMS.ASPX") > -1 ){//임시보관함
					oTopOpenWindow = top.opener.parent.parent.oFRMWIN;
				}
				if(oTopOpenWindow == null){
							strURL = strURL.replace("Form.aspx?","Forms/FormTab.aspx?");
							openWindow(strURL,"FORMS",1024 ,720 ,'fix');
							if (szopenerparenturl.indexOf("/FORMLIST/FORMLIST.ASPX") > -1 ){//문서작성 창에서 OPEN
								top.opener.parent.oFRMWIN= win;
							}else if(szopenerparenturl.indexOf("/FORMS/FORMMENU_MINI.ASPX") > -1 ){//좌측메뉴 양식즐겨찾기 메뉴에서 양식 오픈시(작은버튼)
								top.opener.parent.parent.oFRMWIN= win;
							}else if(szopenerparenturl.indexOf("/APPROVAL/LISTITEMS.ASPX") > -1 ){//임시보관함
								top.opener.parent.parent.oFRMWIN= win;
							}
				}else{
					try{
						if(oTopOpenWindow.name == "FORMS"){
							oTopOpenWindow.setformTab3(strURL,fmnm, fmid+today.getTime());//창이 떠 있는 경우 데이터 넘기기 처리
						}else{//신규 창 열기
							strURL = strURL.replace("Form.aspx?","Forms/FormTab.aspx?");
							openWindow(strURL,"FORMS",1024 ,720 ,'fix');
							if (szopenerparenturl.indexOf("/FORMLIST/FORMLIST.ASPX") > -1 ){//문서작성 창에서 OPEN
								top.opener.parent.oFRMWIN= win;
							}else if(szopenerparenturl.indexOf("/FORMS/FORMMENU_MINI.ASPX") > -1 ){//좌측메뉴 양식즐겨찾기 메뉴에서 양식 오픈시(작은버튼)
								top.opener.parent.parent.oFRMWIN= win;
							}else if(szopenerparenturl.indexOf("/APPROVAL/LISTITEMS.ASPX") > -1 ){//임시보관함
								top.opener.parent.parent.oFRMWIN= win;
							}
						}
					}catch(e){//신규 창 열기
						strURL = strURL.replace("Form.aspx?","Forms/FormTab.aspx?");
						openWindow(strURL,"FORMS",1024 ,720 ,'fix');
						if (szopenerparenturl.indexOf("/FORMLIST/FORMLIST.ASPX") > -1 ){//문서작성 창에서 OPEN
							top.opener.parent.oFRMWIN= win;
						}else if(szopenerparenturl.indexOf("/FORMS/FORMMENU_MINI.ASPX") > -1 ){//좌측메뉴 양식즐겨찾기 메뉴에서 양식 오픈시(작은버튼)
							top.opener.parent.parent.oFRMWIN= win;
						}else if(szopenerparenturl.indexOf("/APPROVAL/LISTITEMS.ASPX") > -1 ){//임시보관함
							top.opener.parent.parent.oFRMWIN= win;
						}
					}
				}							
			}else{
				openWindow(strURL,top.window.name,800,720,'fix'); //동일 페이지로 open하기 위해 window name을 동일하게 받아서 처리
			}
    }
    function DiffForm(){
				var szopenerparenturl = "";
				var oMenu_approval = null;
				if(top.location.href.toUpperCase().indexOf("FORMTAB.ASPX") > -1 ){ //MULTI TAB으로 OPEN됨
					szopenerparenturl = top.opener.location.href.toUpperCase();
					if (szopenerparenturl.indexOf("/FORMLIST/FORMLIST.ASPX") > -1 ){//문서작성 창에서 OPEN
						oMenu_approval = top.opener.parent.frames.item(0);//formList에서 양식 오픈시
					}else if(szopenerparenturl.indexOf("/FORMS/FORMMENU_MINI.ASPX") > -1 ){//즐겨쓰는 양식
						oMenu_approval = top.opener.parent;//좌측메뉴 양식즐겨찾기 메뉴에서 양식 오픈시(작은버튼)
					}else if(szopenerparenturl.indexOf("/APPROVAL/LISTITEMS.ASPX") > -1 ){//임시보관함
						oMenu_approval = top.opener.parent.parent.frames.item(0);//임시함 or 완료함 재사용에서 양식
					}
				}else{//일반 양식으로 open 됨
					szopenerparenturl = parent.parent.opener.parent.location.href.toUpperCase();
					if (szopenerparenturl.indexOf("/APPROVAL/DEFAULT.ASPX") > -1 ){//문서작성 창에서 OPEN
						oMenu_approval = parent.parent.opener.parent.frames.item(0);//formList에서 양식 오픈시
					}else if(szopenerparenturl.indexOf("/APPROVAL/MENU_APPROVAL.ASPX") > -1 ){//즐겨쓰는 양식
						oMenu_approval = parent.parent.opener.parent;//좌측메뉴 양식즐겨찾기 메뉴에서 양식 오픈시(작은버튼)
					}else if(szopenerparenturl.indexOf("/APPROVAL/LIST.ASPX") > -1 ){//임시보관함
						oMenu_approval = parent.parent.opener.parent.parent.frames.item(0);//임시함 or 완료함 재사용에서 양식
					}
					
				}
				/*
				var oMenu_approval = parent.parent.opener.parent.frames.item(0);//formList에서 양식 오픈시
				var fMenu_approval = parent.parent.opener.parent;//좌측메뉴 양식즐겨찾기 메뉴에서 양식 오픈시(작은버튼)
				var tMenu_approval = parent.parent.opener.parent.parent.frames.item(0);//임시함 or 완료함 재사용에서 양식 오픈시(미완결)
				*/
        var mTempText = parent.getFields(parent.mField);
        var dTempText = parent.getFields(parent.dField);
        var cTempText = parent.getFields(parent.cField);
        if (oMenu_approval != null){
					var tTempText = "";
					//try{
					if(parent.tbContentElement != undefined){
					 tTempText = parent.tbContentElement.HtmlValue;	
					}
//					}catch(e){alert(e.message);}
          oMenu_approval.document.all["mTempDiffSave"].value = "<mField>"+mTempText+"</mField>";
          oMenu_approval.document.all["dTempDiffSave"].value = "<dField>"+dTempText+"</dField>"; 
          oMenu_approval.document.all["cTempDiffSave"].value = "<cField>"+cTempText+"</cField>"; 
          oMenu_approval.document.all["tTempDiffSave"].value = tTempText;
        }
    }
    </script>
</body>
</html>
