var target;
var stime;
var szSdate = "";
var szEdate = "";
var szSdateNum = "";
var szEdateNum = "";
var szSdateCut = "";
var szEdateCut = "";
var szStringTemp = "";
var szCurrentDate = "";
/////////////////////////////////////////

////////////////////////////////////////////////////////////////////////

function showHide()
{
 var ifr1 = document.all.iframe1;

 if(ifr1.style.visibility == "hidden")
 {
 
  ifr1.style.visibility = "visible";
  mydiv.style.visibility = "visible";
  //sel1.disabled = true;
 }
 else
 {
 	
  ifr1.style.visibility = "hidden";
  mydiv.style.visibility = "hidden";
 // sel1.disabled = false;
 }
 
}

function MiniCal(f1,diffx,diffy,today)
{
	target=f1; 
	fname=f1.name;

	szCurrentDate = today;

	x = (document.layers) ? loc.pageX : event.clientX;
	y = (document.layers) ? loc.pageY : event.clientY;
	sH = parseInt(document.body.scrollTop);
	sW = parseInt(document.body.scrollLeft);
	
	minical.style.pixelTop	= sH+y+diffy;
	minical.style.pixelLeft	= sW+x+diffx;

	minical.style.display = (minical.style.display == "block") ? "none" : "block";	
	
	Show_cal(0,0,0);
}

function doOver() {
	var el = window.event.srcElement;
	cal_Day = el.title;

	if (cal_Day.length > 7) {
		el.style.borderTopColor = el.style.borderLeftColor = "buttonhighlight";
		el.style.borderRightColor = el.style.borderBottomColor = "buttonshadow";
	}
	window.clearTimeout(stime);
}

function doClick()
{
	//var szDateTmp = target.name;
		
	var szDateTmp = target.name;
	var szLen = szDateTmp.length;
	var szString = szDateTmp.substring(0, 5);
	var szNum = szDateTmp.substring(5, szLen);
	cal_Day = window.event.srcElement.title;
	window.event.srcElement.style.borderColor = "red";
		
	if (cal_Day.length > 7) {
		//target.value=cal_Day;
		
		if ((szString == "REQUE") && szDateTmp.length == 11){
			var szDay;
			szDay = cal_Day.replace(/-/gi, "/");
			szDay= new Date(szDay);
			nowDate = new Date();
		
			request_day = new Date(nowDate.getYear(), nowDate.getMonth(), nowDate.getDate()+89);
						
			if(szDay < request_day){
				target.value = "";
				alert("요청일 범위 안에 있는 날짜가 아닙니다.\n\n다시 선택하여 주세요.");
			}else{
				target.value=cal_Day;
			}		
		}else if ((szString == "ULOAD") && szDateTmp.length == 9){				
			target.value=cal_Day;	
			ReturnData();
		}else{
			target.value=cal_Day;
		}
	
		if ((szDateTmp == "REINSTATEMENT_DATE")){	//복귀복직신청서 복귀일자 선택시					
			var szbetweenday = jsGetBetweenDay(jsDeleteChar(szCurrentDate, '-'), jsDeleteChar(REINSTATEMENT_DATE.value, '-'));			
			if (szbetweenday < 0){
				target.value = "";
				alert("인사팀 담당자에게 문의 하세요.");
				return false;
			}				
		}
		
		if ( (szString == "SDATE" || szString == "EDATE") && szDateTmp.length == 5){
			if (SDATE.value == "") {
				target.value = "";
				alert("기간 시작 날짜를 먼저 입력하여 주세요.");
				return false;	
			}
			
			if (szNum > 0) {
				if (EDATE.value == "") {
					target.value = "";
					alert("기간 종료 날짜를 먼저 입력하여 주세요.");
					return false;
				}
			}			 
			if (SDATE.value != "" && EDATE.value != "") {
				eval("oSdate = SDATE");
				eval("oEdate = EDATE");
				eval("oDateSum = DAYS");
				eval("oDateSumN = NIGHTS");
				
				f_Date(oSdate.value);
				szToDate = new Date(strDate);
				szTo = szToDate.getTime();
				
				f_Date(oEdate.value);
				szFromDate = new Date(strDate);
				szFrom = szFromDate.getTime();
								
				if (oSdate.value != "" && oEdate.value != "") {
					
					f_Date(oSdate.value);
					sDate = new Date(strDate);
					sDay = sDate.getTime();
					
					f_Date(oEdate.value)
					eDate = new Date(strDate);
					eDay = eDate.getTime();
									
					if (sDay > eDay) {
						oSdate.value = "";
						oEdate.value = "";
						oDateSum.value = "";
						oDateSumN.value= "";
						alert("날짜 범위 오류입니다.\n\n다시 입력하여 주세요.");
						return false;
					}
					else {
						//sum = Math.round((eDay - sDay) / (1000*60*60*24)) + 1;
						//oDateSum.value = sum;
						//oDateSumN.value=sum-1;
						oSdate.value != "";
						oEdate.value != "";
						getUseHolidayWS();
					}
				}
			}
		}		
	}      
}

//날짜와 날짜 사이의 일수를 리턴한다.
function jsGetBetweenDay( startDt, endDt )
{
   var rtnValue = 0 ;
    
   var yyyy = startDt.substring(0,4) +"" ;
   var mm   = startDt.substring(4,6) +"" ;
   var dd   = startDt.substring(6,8) +"" ;
   var startDate = new Date(yyyy,(eval(mm)-1),dd) ; // 달 은 한달이 느리므로 1을 빼준다.
   yyyy = endDt.substring(0,4) +"" ;
   mm   = endDt.substring(4,6) +"" ;
   dd   = endDt.substring(6,8) +"" ;
   var endDate = new Date(yyyy,(eval(mm)-1),dd) ;
   // 1000분의 1초 단위를 일 단위로 바꾸기
   return rtnValue = ((endDate-startDate)/60/60/24/1000);
    
}

//해당 폼에 해당하는 모든 오브젝트의 값들에서 ',' and '/'문자를 지워준다. 
function jsDeleteChar( varText, varDelete ){
 var varLength = varText.length ;
 varReturnText = "" ;
 for ( var inx = 0 ; inx < varLength ; inx++ ) {
  if ( varText.substring( inx, inx+1 ) != varDelete ) {
   varReturnText = varReturnText + varText.substring( inx, inx+1 ) ;
  }
 }
 return varReturnText ;
}

/*
function doClick()
{
	var szDateTmp = target.name;
	var szLen = szDateTmp.length;
	var szString = szDateTmp.substring(0, 5);
	var szNum = szDateTmp.substring(5, szLen);
	cal_Day = window.event.srcElement.title;
	window.event.srcElement.style.borderColor = "red";
		
	if (cal_Day.length > 7) {
		target.value=cal_Day
		if (szString == "sdate" || szString == "edate") {
			if (sdate0.value == "") {
				target.value = "";
				alert("출장 기한 시작 날짜를 먼저 입력하여 주세요.");
				return false;	
			}
			
			if (szNum > 0) {
				if (edate0.value == "") {
					target.value = "";
					alert("출장 기한 종료 날짜를 먼저 입력하여 주세요.");
					return false;
				}
			}
			 
			if (sdate0.value != "" && edate0.value != "") {
				for (i=0; i<6; i++) {
					//alert("i==>"+i);
					eval("oSdate = sdate"+ i);
					eval("oEdate = edate"+ i);
					eval("oDateSum = datesum" + i);
					
					if (i == 0) {
						f_Date(oSdate.value);
						szToDate = new Date(strDate);
						szTo = szToDate.getTime();
						
						f_Date(oEdate.value);
						szFromDate = new Date(strDate);
						szFrom = szFromDate.getTime();
					}
					else {			
						if (oSdate.value != "") {
							f_Date(oSdate.value);
							sDate = new Date(strDate);
							sDay = sDate.getTime();
							if (sDay < szTo || sDay > szFrom) {
								oSdate.value = "";
								oEdate.value = "";
								oDateSum.value = "";
								alert(i+"번째 출장기간은 출장기한 범위 안에 있는 날짜가 아닙니다.\n\n다시 입력하여 주세요");
								//return false;
								//break;
							}
						}
						
						if (oEdate.value != "") {
							f_Date(oEdate.value);
							eDate = new Date(strDate);
							eDay = eDate.getTime();
							if (eDay < szTo || eDay > szFrom) {
								oSdate.value = "";
								oEdate.value = "";
								oDateSum.value = "";
								alert(i+"번째 출장기간은 출장기한 범위 안에 있는 날짜가 아닙니다.\n\n다시 입력하여 주세요");
								//return false;
								//break;
							}
						} 
					}					
									
					if (oSdate.value != "" && oEdate.value != "") 
					{
						
						f_Date(oSdate.value);
						sDate = new Date(strDate);
						sDay = sDate.getTime();
						
						f_Date(oEdate.value)
						eDate = new Date(strDate);
						eDay = eDate.getTime();
										
						if (sDay > eDay) 
						{
							oSdate.value = "";
							oEdate.value = "";
							oDateSum.value = "";
							alert("날짜 범위 오류입니다.\n\n다시 입력하여 주세요");
							return false;
							break;
						}
						else 
						{
							sum = Math.round((eDay - sDay) / (1000*60*60*24)) + 1;
							oDateSum.value = sum;
						}
					}
				}
			  }
		}
	}
			
			
*/				
	

/*

function doClick()
{
	var formName = "edit";
	var szDateTmp = target.name;
	var szLen = szDateTmp.length;
	var szString = szDateTmp.substring(0, 5);
	var szNum = szDateTmp.substring(5, szLen);
	eval("oFocus = document." + formName + "." + szDateTmp + ";");
	cal_Day = window.event.srcElement.title;
	window.event.srcElement.style.borderColor = "red";
	
	if (cal_Day.length > 7)
	{
		target.value=cal_Day
		//window.target.style.borderColor = "#ffffff"
		
		if (szString == "sdate")
		{
			szSdateNum = szDateTmp.substring(5, szLen);
			szSdateCut  = szDateTmp.substring(1, szLen);
			szSdate = cal_Day;
			szStemp = target.name;
						
			eval("oDateSumF = datesum"+szSdateNum);
			eval("oSdateF = sdate"+szSdateNum);
			eval("oEdateF = edate"+szSdateNum);
			
			if (szSdateNum > 1)
			{
				for (i=szSdateNum-1; i>=1; i--)
				{
					edateTmp = "edate" + i;
					eval("oEdateTmp=document." + formName + "." + edateTmp + ";");
					if (oEdateTmp.value == "")
					{
						szSdateCut = "date"+i;
						szEdateCut = "";
						oFocus.value = "";
						alert("출장기간은 앞에서부터 먼저 차례차례로 입력하세요");
						return;
					}
				}
			}
			eval("oSdate = document." + formName + "." + szStemp + ";");
			
			if (sdate0.value != "") {
				if (oSdate.value < sdate0.value) {
					oSdateF.value = "";
					oEdateF.value = "";
					oDateSumF.value = "";
					szSdateCut = "";

					alert("출장기한 범위에 들어있지 않습니다.\n\n다시 날짜를 선택해 주세요");
					return false;
				}
			}
			f_Date(oSdate.value)
			sDate = new Date(strDate);
			sDay = sDate.getTime();

		}
		else if (szString == "edate")
		{
			szEdateCut  = szDateTmp.substring(1, szLen);
			
			if (szSdateCut != szEdateCut)
			{
				szEtemp = "s"+szEdateCut;
				szSdateCut = "";
				szEdateCut = "";
				oFocus.value = "";

				eval("oSdate = document." + formName + "." + szEtemp + ";");
				eval("oDateSum = document." + formName + ".datesum" + szNum + ";");
				oSdate.value = "";
				oDateSum.value = "";
				alert("출장기간은 앞에서부터 먼저 차례차례로 입력하세요");
				return;
			}
			szEdateNum = szDateTmp.substring(5, szLen);
			szEdate = cal_Day;
			szEtemp = target.name;
			eval("oEdate = document." + formName + "." + szEtemp + ";");
			if (edate0.value != "") {
				if (oEdate.value > edate0.value) {
					oSdateF.value = "";
					oEdateF.value = "";
					oDateSumF.value = "";
					szEdateCut = "";
					szSdate = "";
					szEdate = "";

					alert("출장기한 범위에 들어있지 않습니다.\n\n다시 날짜를 선택해 주세요");
					return false;
				}
			}
			f_Date(oEdate.value)
			eDate = new Date(strDate);
			eDay = eDate.getTime();
		}
		
		
		if (szSdate != "" && szEdate != "")
		{
			if (szSdate != "" && szEdate != "")
			{
				if (szSdateNum != "" && szEdateNum != "")
				{
					if (szSdateNum == szEdateNum)
					{
						if (szSdate > szEdate)
						{
							ErrMsg()
							szSdateCut = "";
							szEdateCut = "";
							oSdate.value = "";
							oEdate.value = "";
							szSdate = "";
							szEdate = "";
						}
						else
						{
							sum = Math.round((eDay - sDay) / (1000*60*60*24)) + 1;
							szDateSum = "datesum"+szEdateNum;
							eval("oDateSum = document." + formName + "." + szDateSum + ";");
							oDateSum.value = "("+sum+" 일)";
							oDateSum.value = sum;
						}
					}
				}
			}
		}
	}
}
*/

function doOut()
{
	var el = window.event.fromElement;
	cal_Day = el.title;

	if (cal_Day.length > 7)
	{
		el.style.borderColor = "white";
	}
	stime=window.setTimeout("minical.style.display='none';", 500);
}

function f_Month(M)
{
	switch(M)
	{
		case  1: strMonth = "January"; break;
		case  2: strMonth = "February"; break;
		case  3: strMonth = "March"; break;
		case  4: strMonth = "April"; break;
		case  5: strMonth = "May"; break;
		case  6: strMonth = "June"; break;
		case  7: strMonth = "July"; break;
		case  8: strMonth = "August"; break;
		case  9: strMonth = "September"; break;
		case 10: strMonth = "October"; break;
		case 11: strMonth = "November"; break;
		case 12: strMonth = "December"; break;
		default: alert("날짜를 다시 선택하여 주세요\n\n계속해서 에러가 발생할 경우 관리자에게 문의하세요!"); break;
	}
}

function f_Date(obj)
{
	var strObj, strYear, nMonth, strDay, nJinsu, nInitLen;
	strObj = obj;
	nJinsu = 10;
	nInitLen = 0;
	nMaxLen = strObj.length;
	nFirstLen = strObj.indexOf("-");
	nLastLen = strObj.lastIndexOf("-");
	strYear = strObj.substring(nInitLen, nFirstLen);
	nMonth = parseInt(strObj.substring(nFirstLen + 1, nLastLen), nJinsu);
	strDay = strObj.substring(nLastLen + 1, nMaxLen);
	f_Month(nMonth)
	strDate = strMonth + " "+ strDay + ", " + strYear;

}

function ErrMsg()
{alert("날짜 범위 오류입니다.\n\n다시 선택하세요!");}