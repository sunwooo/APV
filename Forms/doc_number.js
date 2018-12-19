function gonumber(num)
{
	doctypeno=num;
	if(num=="0")
	{
		var sHtml="<select name='scode1' onchange='code1()'>"
				+	"<option value=''>선택"
				+	"<option value='0'>[사무실지역]"
				+	"<option value='2'>[현장지역]-GORWING"
				+	"<option value='3'>[현장지역]-SHAPING"
				+	"<option value='4'>[현장지역]-POLISHING"
				+	"<option value='5'>[현장지역]-품질경영"
				+	"<option value='6'>[현장지역]-연구소"
				+	"<option value='7'>[현장지역]-생산정보관리"
				+	"<option value='8'>[현장지역]-시설관리"
				+	"<option value='E'>[현장지역]-환경관리"
				+	"<option value='S'>[현장지역]-안전관리"
				+	"<option value='H'>[현장지역]-보건관리"
				+	"<option value='9'>[현장지역]-공통"
				+"</select>";
		select0.innerHTML=sHtml;
		codes.docno1.readOnly=true;
		codes.docno2.readOnly=true;
		revno="O";
		codes.scode1.focus();
	}
	else
	{
		selectinit(0);
		selectinit(1);
		selectinit(2);
		selectinit(3);
		selectinit(4);
		codes.docno1.readOnly=false;
		codes.docno2.readOnly=false;
		revno="*";
		codes.docno1.focus();
	}	
	
}
function code1()
{
	var codeno=codes.scode1.value;
	var sHtml="";
	switch  (codeno)
	{
		case "0" :
			sHtml="<select name='scode2' onchange='code2()'><option value=''>선택"
				+	"<option value='00'>전사공통<option value='01'>공장공통<option value='02'>서울사무소"
				+	"<option value='03'>1공장<option value='04'>2공장<option value='05'>3공장"
				+	"<option value='06'>이천공장<option value='08'>구미공장공통<option value='09'>연구소"
				+	"</select>";
			break;		
		case "2" :
			sHtml="<select name='scode2' onchange='code2()'><option value=''>선택"
				+	"<option value='20'>공통<option value='21'>SS POLY/SEED/DOPANT<option value='22'>CHARGE PREPARATION"
				+	"<option value='23'>HOT ZONE<option value='24'>CRYSTAL GROWING<option value='25'>CROPPING"
				+	"<option value='26'>ETCHING<option value='28'>INSPECTION<option value='2A'>X-RAY GONIOMETER"
				+	"<option value='2B'>GRINDING/FLATTING/NOTCH<option value='2C'>감독자실<option value='2D'>QUARTZ CLEANING"
				+	"<option value='2E'>PRE-STACKING<option value='2F'>NOP CLEANING"
				+	"</select>";
			break;
		case "3" :
			sHtml="<select name='scode2' onchange='code2()'><option value=''>선택"
				+	"<option value='30'>공통<option value='31'>MOUNTING<option value='32'>SLICING"
				+	"<option value='33'>SLICE WASH<option value='34'>HEAT TREATMENT<option value='35'>EDGE ROUNDING"
				+	"<option value='36'>LASER MARKING<option value='37'>LAPPING<option value='38'>LAP WASH/ETCH"
				+	"<option value='39'>SORTING<option value='3A'>감독자실<option value='3B'>BACKSIDE DAMAGE"
				+	"<option value='3C'>TUBE CLEANING<option value='3D'>BACKSEAL (POLYBACK)<option value='3E'>X-RAY GONIOMETER"
				+	"<option value='3F'>HF CLEANING<option value='3G'>BACKSEAL(NSG)<option value='3H'>DSG(DOUBLE SIDE GRINDING)"
				+	"<option value='3J'>SSG(SINGLESIDE SURFACE GRINDING)<option value='3K'>BACKSEAL(CLEANER)<option value='3L'>BACKSEAL(EDGE ETCHER)<option value='3M'>BACKSEAL(측정장비)"
				+	"</select>";
			break;
		case "4" :
			sHtml="<select name='scode2' onchange='code2()'><option value=''>선택"
				+	"<option value='40'>공통<option value='41'>POLISHING STAGE<option value='44'>WET STATION"
				+	"<option value='45'>청정실<option value='46'>BOX CLEANNING<option value='47'>포장실"
				+	"<option value='48'>화학약품저장실<option value='49'>탈의실<option value='4A'>WAX PREPARATION"
				+	"<option value='4B'>LASER MARKING<option value='4C'>BACKSIDE TOUCH POLISHING<option value='4E'>Epi. WAFER"
				+	"</select>";
			break;
		case "5" :
			sHtml="<select name='scode2' onchange='code2()'><option value=''>선택"
				+	"<option value='50'>공통<option value='51'>수입검사<option value='52'>INGOT 공정검사"
				+	"<option value='53'>SHAPING 공정검사<option value='54'>POLISHING 공정검사<option value='55'>실험실"
				+	"<option value='56'>감독자실<option value='57'>CERTI/CORRELATION<option value='58'>EPI WAFER 검사"
				+	"</select>";
			break;
		case "6" :
			sHtml="<select name='scode2' onchange='code2()'><option value=''>선택"
				+	"<option value='60'>공통<option value='61'>자료실<option value='62'>화학 분석실"
				+	"<option value='63'>FURNACE 실<option value='64'>LIFETIME 분석실<option value='65'>WET STATION"
				+	"<option value='66'>X-RAY TOPO. 실<option value='67'>SEM 실<option value='68'>암실"
				+	"<option value='69'>SAMPLE 준비실<option value='6A'>SIMULATION<option value='6B'>EPI"
				+	"<option value='6C'>SOI"
				+	"</select>";
			break;
		case "7" :
			sHtml="<select name='scode2' onchange='code2()'><option value=''>선택"
				+	"<option value='70'>공통<option value='71'>INGOT P.C<option value='72'>ETCH P.C"
				+	"<option value='73'>F/GOOD P.C<option value='74'>자재창고"
				+	"</select>";
			break;
		case "8" :
			sHtml="<select name='scode2' onchange='code2()'><option value=''>선택"
				+	"<option value='80'>공통<option value='81'>대외공문<option value='82'>건축"
				+	"<option value='83'>전기,통신<option value='84'>정비<option value='85'>기계,설비"
				+	"<option value='86'>배관<option value='87'>공조<option value='88'>용수,정수"
				+	"<option value='89'>초순수"
				+	"</select>";
			break;
		case "E" :
			sHtml="<select name='scode2' onchange='code2()'><option value=''>선택"
				+	"<option value='E0'>공통<option value='E1'>대기<option value='E2'>수질"
				+	"<option value='E3'>폐기물<option value='E4'>소음,진동<option value='E5'>유해화학물질"
				+	"<option value='E6'>토양오염<option value='E7'>배수로<option value='E8'>오수,정화조"
				+	"<option value='E9'>적출물"
				+	"</select>";
			break;
		case "S" :
			sHtml="<select name='scode2' onchange='code2()'><option value=''>선택"
				+	"<option value='S0'>공통"
				+	"</select>";
			break;
		case "H" :
			sHtml="<select name='scode2' onchange='code2()'><option value=''>선택"
				+	"<option value='H1'>보건"
				+	"</select>";
			break;
		case "9" :
			sHtml="<select name='scode2' onchange='code2()'><option value=''>선택"
				+	"<option value='90'>공통<option value='91'>단결정/SHAPING<option value='92'>단결정/POLISHING"
				+	"<option value='93'>SHAPING/POLISHING<option value='94'>품질경영실/기술팀<option value='95'>GR/SH/PO"
				+	"</select>";
			break;
		default :
			sHtml="<select name='scode2'><option value='0'>--------------</select>";
			break;
	}
	select1.innerHTML=sHtml;
	selectinit(2);
	selectinit(3);
	selectinit(4);
}
function code2()
{
	var sHtml="<select name='scode3' onchange='code3()'><option value=''>선택"
			+	"<option value='1'>지침서<option value='2'>절차서<option value='3'>지도서<option value='4'>재료규격"
			+	"<option value='6'>연구보고서(RD&E)<option value='7'>기술보고서/F/T결과"
			+	"</select>";
	select2.innerHTML=sHtml;
	selectinit(3);
	selectinit(4);
}
function code3()
{
	var codeno=codes.scode3.value;
	var sHtml="";
	switch  (codeno)
	{
		case "1" :
			sHtml="<select name='scode4' onchange='code4()'><option value=''>선택"
				+	"<option value='1'>작업지침<option value='2'>일반관리(사무)<option value='3'>생산관리"
				+	"<option value='4'>공정관리<option value='5'>품질관리(공장공통)<option value='9'>재료규격"
				+	"<option value='A'>포장규격<option value='B'>ESH 관련"
				+	"</select>";
			break;
		case "2" :
			sHtml="<select name='scode4' onchange='code4()'><option value=''>선택"
				+	"<option value='1'>경영/조직<option value='2'>인사/노무/총무<option value='3'>재무/회계"
				+	"<option value='4'>구매/자재<option value='5'>영업/관리<option value='6'>정보/전산"
				+	"<option value='7'>품질경영<option value='8'>생산/공정<option value='9'>설비/계측"
				+	"<option value='B'>ESH 관련"
				+	"</select>";
			break;
		case "3" :
			sHtml="<select name='scode4' onchange='code4()'><option value=''>선택"
				+	"<option value='1'>생산(장비운전)<option value='2'>시설(장비운전)<option value='3'>품질(장비운전)"
				+	"<option value='4'>생산(설비운전)<option value='5'>시설(설비운전)"
				+	"</select>";
			break;
		case "4" :
			sHtml="<select name='scode4' onchange='code4()'><option value=''>선택<option value='9'>재료규격"
				+	"</select>";
			break;
		case "6" :
			sHtml="<select name='scode4' onchange='code4()'><option value=''>선택"
				+	"<option value='1'>공정<option value='2'>원/부자재<option value='3'>장비"
				+	"<option value='4'>기타"
				+	"</select>";
			break;
		case "7" :
			sHtml="<select name='scode4' onchange='code4()'><option value=''>선택"
				+	"<option value='1'>공정<option value='2'>원/부자재<option value='3'>장비"
				+	"<option value='4'>기타"
				+	"</select>";
			break;
	}
	select3.innerHTML=sHtml;
	selectinit(4);
}
function code4()
{
	var codeno=codes.scode1.value;
	var sHtml="";
	switch  (codeno)
	{
		case "2" :
			sHtml="<select name='scode5' onchange='code5()'><option value=''>선택"
				+	"<option value='0'>AREA 공통<option value='1'>860D<option value='2'>AG660"
				+	"<option value='3'>CG 6000 18&quot;<option value='4'>EKZ 16&quot;<option value='5'>EKZ 22&quot;"
				+	"<option value='6'>FERRO<option value='7'>KX 150 22&quot;(MCZ 포함)<option value='8'>N3 22&quot;"
				+	"<option value='9'>EKZ 18&quot;<option value='A'>GTW 32&quot;<option value='B'>CG 6000 16&quot;"
				+	"<option value='C'>N3 24&quot;"
				+	"</select>";
			break;
		default:
			sHtml="<select name='scode5' onchange='code5()'><option value=''>선택"
				+	"<option value='1'>4&quot;,5&quot;,6&quot;(2공장)<option value='4'>4&quot;,5&quot;,6&quot;(이천공장)<option value='5'>6&quot;(구미공장)"
				+	"<option value='6'>8&quot;(B동 2층)<option value='7'>6&quot;,8&quot;공통(A동)<option value='8'>공장공통(이천/구미공장)"
				+	"<option value='0'>구미공장공통<option value='B'>8&quot;(B동4층)<option value='C'>8&quot;공통(B동 공통)"
				+	"<option value='D'>6&quot;,8&quot;공통(A/B동)<option value='F'>12&quot;<option value='G'>CATHOD"
				+	"<option value='E'>이천공장<option value='3'>3공장"
				+	"</select>";
			break;
	}
	select4.innerHTML=sHtml;			
}
function code5()
{
	var doc1="";
	var doc2="";
	var code3=codes.scode3.value;
	if (codes.scode3.value=="4")
	{
		code3="1";
	}	
	doc1="5"+codes.scode2.value+code3;
	doc2=codes.scode4.value+codes.scode5.value+"**";
	codes.docno1.value=doc1;
	codes.docno2.value=doc2;
	
}
function selectinit(no)
{
	var sHtml="<select name='scode"+(no+1)+"'><option value='0'>--------------</select>";
	var div=eval("window.select"+no);
	div.innerHTML=sHtml;
}
function doButtonAction(){
	switch(event.srcElement.id){
		case "btOk":		
				opener.doctype.value=doctypeno;
				if(opener.doc_bno)
				{ opener.doc_bno.value= check_type();}
				doc_number();
				break;
		case "btExit":		window.close();break;
	}
}
function check_type()
{
	if (doctypeno=="1")
	{
		return "(개정)";
	}
	else if (doctypeno=="2")
	{
		return "(폐기)";
	}
	else
	{
		return "(초도발행)";
	}
}
