var objDel = window.dialogArguments;
var backurl = "../../Circulation/";

function window.onload()
{
	var isRead = opener.user_chk;
	//수신 건수 없음
	var bRead = false;
	for(var i=0 ; i < isRead.length ; i++){
		if (opener.user_chk[i] == true){
			if(opener.read_chk[i] == 'Y'){
				bRead = true;
			}
		}
	}
	//alert(isRead +'--' + bRead);
	if(bRead == false ){
		runDel();
	}
}

function doButtonAction()
{
	switch (event.srcElement.id)
	{
		case "cancel":
			this.close();
		break;
		case "del" :
			if (content.value!="")
				runDel();
			else
				alert("사유를 입력하세요.");
		break;
	}
}

function makeMailXml()
{
	var i=0;
	var receiptid="";
	while (i<receipt_id.length)
	{
		if (user_chk[i] == true && read_chk[i] == "Y")
		{
			receiptid += receipt_id[i];
			receiptid += ",";
		}
		
		i++;
	}	
	return receiptid.substring(0,receiptid.length-1);
}



var partcol=0;
function makeIdXml()
{
	var i=0;
	var receiptid="";
	while (i<receipt_id.length)
	{
		if (user_chk[i] == true)
		{
			receiptid += receipt_id[i];
			receiptid += ",";
			partcol++;
		}
		i++;
	}	
	return receiptid.substring(0,receiptid.length-1);
}



var receipt_id;
var user_chk;
var read_chk;
var send_id;
var subject;
var datacol;
function runDel()
{
	//opener.getDelValues();
	receipt_id = opener.receipt_id;
	user_chk = opener.user_chk;
	read_chk = opener.read_chk;
	send_id = opener.send_id;
	subject = opener.subject;
	datacol = opener.datacol;
	partcol=0;
	
	
	var mailid = makeMailXml();
	var delid = makeIdXml();
	
	
	var alldel="TRUE";
	if (datacol != partcol)
		alldel = "FALSE";
    
	var strXml = "<?xml version='1.0'?><delmail><send_id>"+send_id+"</send_id><mails>"+makeMailXml()+"</mails><receiptids>"+makeIdXml()+"</receiptids><content>"+content.value+"</content><subject>"+subject+"</subject><alldel>"+alldel+"</alldel></delmail>";
	
	var xmlhttp = new ActiveXObject("MSXML2.XMLHTTP");
	xmlhttp.open("post",backurl + "DellMail.aspx?userid="+userid,false);
	xmlhttp.setRequestHeader("Accept-Language","ko");
	xmlhttp.setRequestHeader("Content-type", "text/xml");
	
	xmlhttp.send(strXml);
	//alert(strXml);


	if (xmlhttp.responseXML.selectSingleNode("//response").text=="OK"){
		//alert(xmlhttp.responseXML.xml);
		alert("삭제하였습니다.");
		opener.EndAction();
		this.close();
	}else{
		alert("일시적인 문제로 인해 삭제가 취소되었습니다.");
	}
}	





		

