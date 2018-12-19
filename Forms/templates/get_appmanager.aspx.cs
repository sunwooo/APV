using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

using System.Xml;

using Covision.Framework;
using Covision.Framework.Data.Business;

public partial class COVIFlowNet_Forms_templates_get_appmanager : PageBase
{
    protected void Page_Load(object sender, EventArgs e)
    {
        XmlDocument xmldom = new XmlDocument();
        xmldom.Load(Request.InputStream);

        string usid = xmldom.DocumentElement.ChildNodes.Item(0).InnerText;   //넘어온 값
        string jfid = xmldom.DocumentElement.ChildNodes.Item(0).InnerText;   //넘어온 값

        DataSet ds = null;
        DataPack INPUT = null;
        SqlDacBase SqlDbAgent = null;
        try
        {
            //string szQuery = @" SELECT  PERSON_CODE 
            //                    FROM	ORG_JOBFUNCTION_MEMBER 
            //                    WHERE	JF_ID = @JF_ID AND
		    //                            PERSON_CODE = @USID ";
            //
            string szQuery = "[dbo].[usp_GetPersonCode]";
            

            ds = new DataSet();            
            INPUT = new DataPack();
            SqlDbAgent = new SqlDacBase();
            SqlDbAgent.ConnectionString = Covision.Framework.Common.Configuration.ConfigurationApproval.ApprovalConfig("ORG_ConnectionString").ToString();
            INPUT.add("@JF_ID", jfid);           
            INPUT.add("@USID", usid);

            ds = SqlDbAgent.ExecuteDataSet(CommandType.StoredProcedure, szQuery, INPUT);
            SqlDbAgent.Dispose();
            SqlDbAgent = null;
            ////using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter("DbProvider", "ORG_ConnectionString", true))
            //using (Covi.DBManager.IDBAdapter adapter = Covi.DBManager.DBFactory.CreateAdapter(Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["DbProvider"].ToString(), Feelanet.Dev2005.Server.Common.ConfigurationManagement.ConfigurationManager.Items["ORG_ConnectionString"].ToString(), false))
            //{
            //    System.Data.IDataParameter param = adapter.CreateParameter();
            //    param.DbType = DbType.String;
            //    param.ParameterName = "@JF_ID";
            //    param.Value = jfid;
            //    adapter.DbSelectParameters.Add(param);

            //    System.Data.IDataParameter param1 = adapter.CreateParameter();
            //    param1.DbType = DbType.String;
            //    param1.ParameterName = "@USID";
            //    param1.Value = usid;
            //    adapter.DbSelectParameters.Add(param1);

            //    ds = adapter.FillDataSet(szQuery);
            //} 
            Response.Write(szQuery);

            DataTable _DataTable = ds.Tables[0];
            //Response.Write(_DataTable.Rows.Count);
            //Response.End;

            string strXML = "<DOCCATEGORYLIST>";

            for (int i = 0; i < _DataTable.Rows.Count; i++)
            {
                strXML = strXML + "<PERSON>";
                strXML = strXML + "<CODE>" + _DataTable.Rows[i]["PERSON_CODE"].ToString() + "</CODE>";
                strXML = strXML + "</PERSON>";
            }

            strXML = strXML + "</DOCCATEGORYLIST>";

            XmlDocument xmlResult = new XmlDocument();
            xmlResult.LoadXml(strXML);
            Response.ContentType = "text/xml;charset=euc-kr";
            xmlResult.Save(Response.OutputStream);
        }
        catch (System.Exception ex)
        {
            
            
            throw new System.Exception(null, ex.InnerException);
        }
        finally
        {
            if (ds != null)
            {
                ds.Dispose();
                ds = null;
            }
            if (SqlDbAgent != null)
            {
                SqlDbAgent.Dispose();
                SqlDbAgent = null;
            }
            if (INPUT != null)
            {
                INPUT.Dispose();
                INPUT = null;
            }
        }
    }
}
