<%@ Page Language="C#" AutoEventWireup="true" CodeFile="FormTree.aspx.cs" Inherits="COVIFlowNet_Formlist_FormTree" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
	<script type="text/javascript" language="javascript" src="/CoviWeb/common/script/CFL.js"></script>
	<script type="text/javascript" language="javascript" src="tree.js"></script>
	<script type="text/javascript" language="javascript" src="/CoviWeb/common/script/COVIFlowNet/openWindow.js"></script>
	<script type="text/javascript" language="javascript">
        function setFormPath(prefix, id, name, schemaid, revision, filename){
	        parent.txtSelectedPrefix.value = prefix ;
	        parent.txtSelectedID.value = id ;
	        parent.txtSelectedName.value = name ;
	        parent.txtSelectedschemaid.value = schemaid ;
	        parent.txtSelectedRevision.value = revision;
	        parent.txtSelectedFileName.value = filename;
        }
        function double(){
	        parent.OK();
        }
	</script>
</head>
<body>
    <UL CLASS="toc" ondblclick="double();" ONCLICK="outliner();" ONSELECTSTART="return false;" ONMOUSEOVER="mouseEnters();" ONMOUSEOUT="mouseLeaves();">
		<%= DisplayGroup() %>
	</UL>
</body>
</html>
