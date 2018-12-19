// form에서 공통적으로 사용하는 div 정의
var sTmpFrmEdtObj = '';//이준희(2008-03-05): 렌더링 속도 개선을 위해 임시 변수 방식으로 변경함.
//sTmpFrmEdtObj += '<!-- 검색 div 시작 -->');
sTmpFrmEdtObj += '<div id="miniorgsearch" OnClick="this.style.display=\'none\';" oncontextmenu="return false" ondragstart="return false"';
//sTmpFrmEdtObj +=	'onselectstart="return false" style="background : #eff2f7; margin: 5; margin-top: 2;border-top: 1 solid buttonhighlight;border-left: 1 solid buttonhighlight;border-right: 1 solid buttonshadow;border-bottom: 1 solid buttonshadow;width:200;height:200;display:none;position: absolute; z-index: 4;overflow: scroll;">';
sTmpFrmEdtObj +=	'onselectstart="return false" style="overflow:hidden;position:absolute;visibility:hidden;display:none;z-index:12000;">';
sTmpFrmEdtObj +='<div submenu="1" id="Context_MainM" class="Ctx_Table1" style="position: relative; background-repeat: repeat-y;overflow: scroll;" igLevel="0">';
sTmpFrmEdtObj +='<div scrollDiv=1 id="divminiorgsearch" style="border-color:black;border-width:thin; border-style:dotted;"></div>';
sTmpFrmEdtObj +='</div>';
sTmpFrmEdtObj +='</div>';
sTmpFrmEdtObj += '<iframe id="frmorgsearch"  scrolling="no" frameborder="0" style="background : #eff2f7; margin: 5; margin-top: 2;border-top: 0 solid buttonhighlight;border-left: 0 solid buttonhighlight;border-right: 0 solid buttonshadow;border-bottom: 0 solid buttonshadow;width:200;display:none;position: absolute; z-index: 3"></iframe>';
//sTmpFrmEdtObj += '<!-- 검색 div 종료 --> ');

//sTmpFrmEdtObj += '<!-- hot key 시작 -->');
sTmpFrmEdtObj += '<div id="minifmmenu" OnClick="this.style.display=\'none\';" oncontextmenu="return false" ondragstart="return false"';
sTmpFrmEdtObj +=	'onselectstart="return false" style="background : #eff2f7; margin: 0; margin-top: 0;width:150px;height:180px;display:none;position: absolute; z-index: 5;overflow:visible;">';
sTmpFrmEdtObj +=	'<div id="divminifmmenu" style="width:100%;height:100%;">';
sTmpFrmEdtObj +=		'<iframe id="frmminimenu" name="frmminimenu" src="/CoviWeb/Approval/Forms/formmenu_mini.aspx" scrolling="auto" frameborder="0" style="width:190px;height:100%;margin: 0; margin-top: 0;position: relative; z-index: 6"></iframe>';
sTmpFrmEdtObj +=	'</div>';
sTmpFrmEdtObj += '</div>';

sTmpFrmEdtObj += '<div id="dropForm" style="background : #eff2f7; margin: 0; margin-top: 0;width:200;height:180;display:none;position: absolute; z-index: 5;overflow: hidden;" onmouseout="this.style.display=\'none\';" >';
sTmpFrmEdtObj +=	'<div id="divDropForm" >';
sTmpFrmEdtObj +=		'<iframe id="nDropForm" name="nDropForm" src="formmenu_mini_diffCopy.aspx" style="border-color:Black;width:200;height:180;margin: 0; margin-top: 0;position: absolute; z-index: 6" frameborder="0"></iframe>';
sTmpFrmEdtObj +=	'</div>';
sTmpFrmEdtObj +=	'</div>';
document.write(sTmpFrmEdtObj);//alert();
//sTmpFrmEdtObj += '<!-- hot key 종료 -->');

var g_oFrmEdtObj = null;
//var oPopupFrmEdtObj = window.createPopup();
//oPopupFrmEdtObj.document.createStyleSheet("GWImages/common/css/css_style.css", 10);
function OpenPopupFrmEdtObj(obj, szName1, szName2){
    g_oFrmEdtObj = obj;
    //OpenContextMenu(Context_MainM, event,obj.person_code);
    //OpenMenu(eval(szName1), event,obj.person_code);
    setTimeout("view4Approval('"+szName2+"')","1");
   
}
function view4Approval(szName2) {
    var el = g_oFrmEdtObj;
    var oContextHTML = window.document.all[szName2];//window.document.all["divContextApproval"];
    if ( szName2 == "divminifmmenu"){
		oContextHTML = frmminimenu.document.all["divminemenu_Main"];
    }

    if (oContextHTML != null) {
        oContextHTML.style.display = "";

        var h = oContextHTML.offsetHeight;		       
        var w = oContextHTML.offsetWidth;

        oContextHTML.style.display = "none";
		
        if(oContextHTML.childNodes[0].innerHTML == "") {
	        h = 0;
	        w = 0;
        }
		//if ( h > 200 ) h = 200;
        var oPopupBody = oPopupFrmEdtObj.document.body;
        oPopupBody.innerHTML = oContextHTML.innerHTML;		                       

        CTXfadeIn(oPopupBody);
				
        oPopupFrmEdtObj.show(0, 20, w, h, el);
    }
}
function CTXfadeIn(obj) {
    obj.style.filter="blendTrans(duration=0.5)";
   
    if (obj.filters.blendTrans.status != 2) {
        obj.filters.blendTrans.apply();
        obj.filters.blendTrans.play();
    }
}