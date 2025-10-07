import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "./ui/select"


 import {handleexchangerequest}  from '../utility/Api'
import { Type } from "lucide-react";
const Stoxkart = () => {
  const [brokerName, setBrokerName] = useState('STOXKART');
  const [apikey, setapikey] = useState("");
  const [secretkey, setsecretkey] = useState("");
  const [AuthToken, setAuthToken] = useState("");
  const [vendorcode, setvendorcode] = useState("");
  const [accountnumber, setaccountnumber] = useState("");
  const [password, setPassword] = useState("");
  const [tableDatafetch, setTableDatafetch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brokerid, setBrokerid] = useState(false);
    const [nickname, setnickname] = useState('');

      const [REType, setREType] = useState('POST');


  useEffect(() => {
    // Dummy data for testing
   fetchaccountlist()
  }, []);


  const fetchaccountlist = async () => {
    const type = "GET";
    const endpoint = "loadaccount";
    const payload = "broker=Stoxkart";
    setLoading(true); // Set loading to true before fetching data
    handleexchangerequest(type, payload, endpoint, false)
      .then((response) => {
        console.log(response);
        setTableDatafetch(response || []); // Ensure response is an array
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after fetching data
      });
  };

  


    

  

  const handleAddBroker = () => {
    let put= false
     if (REType=="PUT"){
      put = true
    }
    const payload = JSON.stringify({
      brokerName,
      apikey,
      secretkey,
      AuthToken,
      vendorcode,
      accountnumber,
      password,
      put,
      brokerid,
      nickname
    });
    
      const Rtype = REType
        const endpoint= "broker"
        handleexchangerequest(Rtype, payload, endpoint,true)
    .then(response => {
    console.log(response) 
    
    window.location.reload()
    })
  






  
 
    // Add API call logic here to save the broker details
  };
    const handlelogin = async (brokerid) => {
        const payload = "brokerid="+brokerid;
        const type = "GET"
        const endpoint= "loginredirect"
        handleexchangerequest(type, payload, endpoint,true)
          .then(response => {
          console.log(response)
          localStorage.setItem('brokerid',brokerid)
          window.open(response)
          setBrokerid(false)
    
    // window.location.reload()
    })
  }


  
  

   const handleadelete=(brokerid)=>{

     const payload = 'brokerid='+brokerid;
        const type = "DELETE"
        const endpoint= "broker"
        handleexchangerequest(type, payload, endpoint,true)
    .then(response => {
    console.log(response) 
    setBrokerid(false)
    
    window.location.reload()
    })

  }
  const handleactivebroker=(brokerid)=>{
    const put = false
     const payload = JSON.stringify({brokerid,put });
        const type = "PUT"
        const endpoint= "broker"
        handleexchangerequest(type, payload, endpoint,true)
    .then(response => {
    console.log(response) 
    setBrokerid(false)
    
    window.location.reload()
    })

  }

  const handleEdit = (brokerid) => {
    const rowData = tableDatafetch[brokerid];
    console.log(rowData,'rowdata')
    setBrokerName(rowData.brokername);
    setapikey(rowData.apikey);
    setsecretkey(rowData.secretkey);
    setAuthToken(rowData.AuthToken);
    setvendorcode(rowData.vendorcode);
    setaccountnumber(rowData.accountnumber);
    setPassword(rowData.password);
    setBrokerid(rowData.brokerid)
    setREType('PUT')
    
  };


  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md max-w-7xl">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Add Broker</h1>
      <form className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="broker-name" className="w-1/3 text-lg text-gray-700">
            Broker Name
          </Label>
          <Input
            id="broker-name"
            type="text"
            value={brokerName}
            readOnly
            className="w-2/3 p-2 border border-gray-300 rounded-md bg-gray-200 pointer-events-none"
          />
        </div>
        {/* Other input fields */}
         <div className="flex items-center gap-4">
                                  <Label htmlFor="broker-name" className="w-1/3 text-lg text-gray-700">
                                    Nick Name
                                  </Label>
                                  <Input
                                    id="broker-name"
                                    type="text"
                                    placeholder="Enter Nick Name"
                                    value={nickname}
                                    onChange={(e) => setnickname(e.target.value)}
                                    className="w-2/3 p-2 border border-gray-300 rounded-md"
                                  />
                                </div>
       
        <div className="flex items-center gap-4">
          <Label htmlFor="auth-token" className="w-1/3 text-lg text-gray-700">
            Auth Token(optional)
          </Label>
          <Input
            id="auth-token"
            type="text"
            placeholder="Enter Auth Token"
            value={AuthToken}
            onChange={(e) => setAuthToken(e.target.value)}
            className="w-2/3 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Vendor Code */}
        <div className="flex items-center gap-4">
          <Label htmlFor="vendor-code" className="w-1/3 text-lg text-gray-700">
            Secret Key
          </Label>
          <Input
            id="vendor-code"
            type="text"
            placeholder="Enter secret Code"
            value={secretkey    }
            onChange={(e) => setsecretkey(e.target.value)}
            className="w-2/3 p-2 border border-gray-300 rounded-md"
          />
        </div>
         <div className="flex items-center gap-4">
          <Label htmlFor="vendor-code" className="w-1/3 text-lg text-gray-700">
            API KEY
          </Label>
          <Input
            id="vendor-code"
            type="text"
            placeholder="Enter Api key"
            value={apikey    }
            onChange={(e) => setapikey(e.target.value)}
            className="w-2/3 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Account Number */}
        <div className="flex items-center gap-4">
          <Label htmlFor="account-number" className="w-1/3 text-lg text-gray-700">
            Account Number(app id)
          </Label>
          <Input
            id="account-number"
            type="text"
            placeholder="Enter Account Number"
            value={accountnumber}
            onChange={(e) => setaccountnumber(e.target.value)}
            className="w-2/3 p-2 border border-gray-300 rounded-md"
          />
        </div>

       

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={()=>handleAddBroker()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Broker
          </Button>
        </div>
      </form>

      <div className="container mx-auto mt-6 p-6 bg-gray-100 rounded-lg shadow-md max-w-6xl">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-700">Loading...</p>
          ) : tableDatafetch.length === 0 ? (
            <p className="text-center text-gray-700">No data available</p>
          ) : (
            <table className="min-w-full table-auto">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Login</th>

                 {Object.keys(tableDatafetch[0])
                                  .filter((key) => key !== 'valid' && key !== 'active')
                                  .map((key) => (
                                    <th key={key} className="px-6 py-3">
                                      {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </th>
                                  ))}
                  <th   className="px-6 py-3"> Active</th>
                  <th className="px-6 py-3">Edit</th>
                  <th className="px-6 py-3">Delete</th>
                </tr>
              </thead>
              <tbody>
                {tableDatafetch.map((row, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                     <td className="px-6 py-4 text-center">
                                            <Button
                                           className={row.valid?"bg-green-600 text-white py-2 text-sm rounded-md hover:bg-blue-700":"bg-red-600 text-white py-2 text-sm rounded-md hover:bg-blue-700"}
                                           onClick={() => handlelogin(row.brokerid)}
                                         >
                                           Login
                                         </Button>
                                       </td>
                        {Object.entries(row)
      .filter(([key]) => key !== 'valid' && key !== 'active')
      .map(([key, value], idx) => (
        <td key={idx} className="px-6 py-4">
          {value}
        </td>
      ))}
                    <td className="px-6 py-4 text-center">
                      <Button
                        className="bg-blue-600 text-white py-2 text-sm rounded-md hover:bg-blue-700"
                        onClick={() => handleactivebroker(row.brokerid)}
                      >
                        {row.active?"Deactivate":"Activate"}
                      </Button>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <Button
                        className="bg-blue-600 text-white py-2 text-sm rounded-md hover:bg-blue-700"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        className="bg-blue-600 text-white py-2 text-sm rounded-md hover:bg-blue-700"
                        onClick={() => handleadelete(row.brokerid)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stoxkart;

[{'Prc': '34.73', 'RequestID': '1', 'Cancelqty': 0, 'discQtyPerc': 'NA', 'customText': 'NA', 'Mktpro': 'NA', 'defmktproval': '', 'optionType': 'XX', 'usecs': 'NA', 'mpro': '', 'Qty': 2552, 'ordergenerationtype': '--', 'Unfilledsize': 0, 'orderAuthStatus': '', 'Usercomments': 'NA', 'ticksize': '0.01', 'Prctype': 'L', 'Status': 'complete', 'Minqty': 0, 'orderCriteria': 'NA', 'Exseg': 'bse_cm', 'Sym': 'COLAB', 'multiplier': '1', 'ExchOrdID': '1750996800000107697', 'ExchConfrmtime': '27-Jun-2025 13:31:22', 'Pcode': 'CNC', 'SyomOrderId': '', 'Dscqty': 0, 'Exchange': 'BSE', 'Ordvaldate': 'NA', 'accountId': '1841781', 'exchangeuserinfo': 'NA', 'Avgprc': '34.73', 'Trgprc': '00.00', 'Trantype': 'S', 'bqty': '2552', 'Trsym': 'COLAB', 'Fillshares': 2552, 'AlgoCategory': 'NA', 'sipindicator': 'NA', 'strikePrice': '00.00', 'reporttype': 'NA', 'AlgoID': 'NA', 'noMktPro': '', 'BrokerClient': '--', 'OrderUserMessage': '--', 'decprec': 'NA', 'ExpDate': 'NA', 'COPercentage': 0.0, 'marketprotectionpercentage': '--', 'Nstordno': '25062700089034', 'ExpSsbDate': 'NA', 'OrderedTime': '27/06/2025 14:15:00', 'RejReason': ' ', 'modifiedBy': '--', 'Scripname': 'COLAB', 'stat': 'Ok', 'orderentrytime': 'Jun 27 2025 14:15:00', 'PriceDenomenator': '1', 'panNo': 'NA', 'RefLmtPrice': 0.0, 'PriceNumerator': '1', 'token': '542866', 'ordersource': 'NA', 'Validity': 'DAY', 'GeneralDenomenator': '1', 'series': '', 'InstName': 'E', 'GeneralNumerator': '1', 'user': '1841781', 'remarks': '--', 'iSinceBOE': 0}, {'Prc': '34.73', 'RequestID': '1', 'Cancelqty': 0, 'discQtyPerc': 'NA', 'customText': 'NA', 'Mktpro': 'NA', 'defmktproval': '', 'optionType': 'XX', 'usecs': 'NA', 'mpro': '', 'Qty': 1450, 'ordergenerationtype': '--', 'Unfilledsize': 0, 'orderAuthStatus': '', 'Usercomments': 'NA', 'ticksize': '0.01', 'Prctype': 'L', 'Status': 'complete', 'Minqty': 0, 'orderCriteria': 'NA', 'Exseg': 'bse_cm', 'Sym': 'COLAB', 'multiplier': '1', 'ExchOrdID': '1750996800000091459', 'ExchConfrmtime': '27-Jun-2025 10:31:15', 'Pcode': 'CNC', 'SyomOrderId': '', 'Dscqty': 0, 'Exchange': 'BSE', 'Ordvaldate': 'NA', 'accountId': '1841781', 'exchangeuserinfo': 'NA', 'Avgprc': '34.73', 'Trgprc': '00.00', 'Trantype': 'S', 'bqty': '1450', 'Trsym': 'COLAB', 'Fillshares': 1450, 'AlgoCategory': 'NA', 'sipindicator': 'NA', 'strikePrice': '00.00', 'reporttype': 'NA', 'AlgoID': 'NA', 'noMktPro': '', 'BrokerClient': '--', 'OrderUserMessage': '--', 'decprec': 'NA', 'ExpDate': 'NA', 'COPercentage': 0.0, 'marketprotectionpercentage': '--', 'Nstordno': '25062700044026', 'ExpSsbDate': 'NA', 'OrderedTime': '27/06/2025 11:15:00', 'RejReason': ' ', 'modifiedBy': '--', 'Scripname': 'COLAB', 'stat': 'Ok', 'orderentrytime': 'Jun 27 2025 11:15:00', 'PriceDenomenator': '1', 'panNo': 'NA', 'RefLmtPrice': 0.0, 'PriceNumerator': '1', 'token': '542866', 'ordersource': 'NA', 'Validity': 'DAY', 'GeneralDenomenator': '1', 'series': '', 'InstName': 'E', 'GeneralNumerator': '1', 'user': '1841781', 'remarks': '--', 'iSinceBOE': 0}, {'Prc': '34.73', 'RequestID': '1', 'Cancelqty': 0, 'discQtyPerc': 'NA', 'customText': 'NA', 'Mktpro': 'NA', 'defmktproval': '', 'optionType': 'XX', 'usecs': 'NA', 'mpro': '', 'Qty': 2000, 'ordergenerationtype': '--', 'Unfilledsize': 0, 'orderAuthStatus': '', 'Usercomments': 'NA', 'ticksize': '0.01', 'Prctype': 'L', 'Status': 'complete', 'Minqty': 0, 'orderCriteria': 'NA', 'Exseg': 'bse_cm', 'Sym': 'COLAB', 'multiplier': '1', 'ExchOrdID': '1750996800000006251', 'ExchConfrmtime': '27-Jun-2025 09:31:22', 'Pcode': 'CNC', 'SyomOrderId': '', 'Dscqty': 2000, 'Exchange': 'BSE', 'Ordvaldate': 'NA', 'accountId': '1841781', 'exchangeuserinfo': 'NA', 'Avgprc': '34.73', 'Trgprc': '00.00', 'Trantype': 'S', 'bqty': '2000', 'Trsym': 'COLAB', 'Fillshares': 2000, 'AlgoCategory': 'NA', 'sipindicator': 'NA', 'strikePrice': '00.00', 'reporttype': 'NA', 'AlgoID': 'NA', 'noMktPro': '', 'BrokerClient': '--', 'OrderUserMessage': '--', 'decprec': 'NA', 'ExpDate': 'NA', 'COPercentage': 0.0, 'marketprotectionpercentage': '--', 'Nstordno': '25062700016673', 'ExpSsbDate': 'NA', 'OrderedTime': '27/06/2025 10:15:00', 'RejReason': ' ', 'modifiedBy': '--', 'Scripname': 'COLAB', 'stat': 'Ok', 'orderentrytime': 'Jun 27 2025 10:15:00', 'PriceDenomenator': '1', 'panNo': 'NA', 'RefLmtPrice': 0.0, 'PriceNumerator': '1', 'token': '542866', 'ordersource': '1750996882857.8074', 'Validity': 'DAY', 'GeneralDenomenator': '1', 'series': '', 'InstName': 'E', 'GeneralNumerator': '1', 'user': '1841781', 'remarks': '1750996882857.8074', 'iSinceBOE': 0}] 