'public array1()
Function getFileList()
	getFileList = ""
	imgList = ""
	upImage = ""

	dim n
	n = tbContentElement.GetFileNum(0)			
	
	if n = 0 then
	exit Function
	end if
	
	Redim array1(n-1)
	tbContentElement.GetFileList 0, array1
	Dim k
	Dim imgList
	For k=0 To UBound(array1) step 1
		imgList = array1(k) + "|" + imgList			
	Next			
	   
	getFileList = imgList			
End Function 

Function G_getFileList(ByRef tbContentElementObj)
	G_getFileList = ""
	dim n
	n = tbContentElementObj.GetFileNum(0)			
	
	if n = 0 then

	exit Function
	end if
	
	Redim array1(n-1)
	tbContentElementObj.GetFileList 0, array1
	Dim k
	Dim imgList
	For k=0 To UBound(array1) step 1
		imgList = array1(k) + "|" + imgList			
	Next			
	   
	G_getFileList = imgList			
End Function 
