/* ��� 
beginProgress('��� ��ٷ� �ֽʽÿ�...','��Ʈ�� ������ �ʱ�ȭ �ϴ� ��...');
updateProgress('��� ��ٷ� �ֽʽÿ�...',' �����ϴ� ��..');
endProgress('top.close()');
*/

window.attachEvent("onload",createProgress);

function createProgress(){
	var strIFR = '<iframe id="ifrProgress" name="ifrProgress" frameborder="0" border="0" src="../common/progress.htm" style="position:absolute;margin:0px;border:1px;width:320;height:120;display:none"></iframe>';
	var oNewNode = document.createElement("SPAN");
	document.body.appendChild(oNewNode);
	oNewNode.innerHTML = strIFR;
}

function beginProgress(Title,SubTitle){
	positProgress();
	try{
		updateProgress(Title,SubTitle);
	}
	catch(e){
		setTimeout("updateProgress('" + Title + "','" + SubTitle + "')",2000);
	}
	document.all.ifrProgress.style.display='';
	window.attachEvent("onresize",positProgress);	
}

function updateProgress(Title,SubTitle){
	document.frames("ifrProgress").progTitl.innerText = Title;
	document.frames("ifrProgress").progSubTitl.innerText = SubTitle;
}

function endProgress(){
	document.all.ifrProgress.style.display='none';
	try{
		var arguments = endProgress.arguments;
		//alert(arguments.length);
		for (var i = 0; i < arguments.length; i++) {
			try{var arg=arguments[i];if(arg!=null)eval(arg);}catch(e){}
		}
	}
	catch(e){}
}

function positProgress(){
	var posTop = (document.body.clientHeight/2) - 70;
	var posLeft = (document.body.clientWidth/2) - 160;
	document.all.ifrProgress.style.top = posTop;
	document.all.ifrProgress.style.left = posLeft;
}
