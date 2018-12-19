<%@ Page Language="C#" AutoEventWireup="true" CodeFile="posttest.aspx.cs" Inherits="Approval_Forms_posttest" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>제목 없음</title>
</head>
<form id="contact-form" action="request.aspx" method="post">
    
      <p>
            사번:
            <input type="text" name="empNo" id="empNo" value="" />
      </p>
       
       <p> 
            전자증빙: 
            <input type="text" name="gbnno" id="gbnno" value="" />
      </p>
       <p>
           양식키:
           <input type="text" name="fmpf" id="fmpf" value="" />
       </p>
        <p>
          본문내용:  
        <textarea name="content" id="content" cols="25" rows="3"></textarea>
        </p>
        <p>
           <input type="submit" value="submit" />
           
        </p>
    
</form>

</body>
</html>
