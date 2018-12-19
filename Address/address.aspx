<%@ Page Language="C#" AutoEventWireup="true" CodeFile="address.aspx.cs" Inherits="COVIFlowNet_Address_address" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<META content="IE=7.0000" http-equiv="X-UA-Compatible"> 
<head runat="server">
    <title><%= Resources.Approval.lbl_orgselect %></title>
</head>
    <frameset rows="50,*,45" framespacing="0" frameborder="0" topmargin="0" leftmargin="0">
        <frame frameborder="0" src="Title.aspx" id="banner" scrolling="no" >
	    <frameset cols="5px,47%,*,5px" framespacing="0" frameborder="0" topmargin="0" leftmargin="0">
	        <frame frameborder="0" src="about:blank"  scrolling="no" >
		    <frameset rows="50%,*" id="LeftFrmset"  framespacing="0" leftmargin="0" frameborder="1">
			    <frame frameborder="0" src="tab.aspx" id="Tab" scrolling="no">
			    <frame frameborder="0" src="/coviweb/approval/address/listitems.aspx" id="ListItems">
		    </frameset>
		    <frameset rows="65%,35%" id="RightFrmset" >
			    <frame frameborder="0" src="selected.aspx" id="SelectedItems">
			    <frame frameborder="0" src="detail.aspx" id="Detail">
		    </frameset>
		    <frame frameborder="0" src="about:blank"  scrolling="no" />
	    </frameset>
		<frame frameborder="0" src="button.aspx" id="Selectedbutton" />
    </frameset>
</html>
