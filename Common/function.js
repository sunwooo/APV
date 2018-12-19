function openWindow(fileName,windowName,theWidth,theHeight, etcParam) {
	
	var x = theWidth;
	var y = theHeight;

	var sy = window.screen.height / 2 - y / 2 - 70;
	if (etcParam == 'fix') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0";
		var sy = window.screen.height / 2 - y / 2 - 40;
	}
	else if (etcParam == 'resize') {
		etcParam = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1";
		var sy = window.screen.height / 2 - y / 2 - 40;
	}

	var sx = window.screen.width  / 2 - x / 2;


	if (sy < 0 ) {
		sy = 0;
	}
	
	var sz = ",top=" + sy + ",left=" + sx;
	//2013-12-02 PSW 수정
    //완료함,수신함 등에서 여러개 창이 뜨도록 수정
	//if (windowName==null || windowName == "" || windowName == "newMessageWindow") 
	//{
		windowName = new String(Math.round(Math.random() * 100000));
	//} 

	window.open(fileName,windowName, etcParam + ",width=" + x + ",height=" + y + sz);
}

function Over(obj) { 
    obj.style.filter='gray'; 
} 
function Out(obj) { 
     obj.style.filter='none'
} 

function ShowFlashObject(strFlashUrl, nWith, nHeight)
{
	document.write("<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0\" width=\"" + nWith + "\" height=\"" + nHeight + "\">");
	document.write("<param name=\"movie\" value=\"" + strFlashUrl + "\">");
	document.write("<param name=\"quality\" value=\"high\">");
	document.write("<embed src=\"" + strFlashUrl + "\" quality=\"high\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" width=\"" + nWith + "\" height=\"" + nHeight + "\"></embed>");
	document.write("</object>");
	
}
