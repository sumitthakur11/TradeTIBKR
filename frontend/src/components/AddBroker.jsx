import React, { useState, useEffect } from "react";
import { handleexchangerequest } from "../utility/Api";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const AddBroker = () => {
  const [tableDatafetch, setTableDatafetch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Form states
  const [brokerName, setBrokerName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [vendorCode, setVendorCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [brokerName1, setBrokerName1] = useState("");
  const [brokers, setBrokers] = useState([])

  const handleorders = async (x) => {
    const type = "GET";
    const endpoint = "position";
    const payload = "type=" + x;
    setLoading(true); // Set loading to true before fetching data
    handleexchangerequest(type, payload, endpoint, true)
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

  useEffect(() => {
    // Dummy data for testing
    const dummyData = [
      {
        brokerName: "Broker A",
        apiKey: "API_KEY_A",
        apiSecret: "API_SECRET_A",
        authToken: "AUTH_TOKEN_A",
        vendorCode: "VENDOR_A",
        accountNumber: "123456",
        password: "passwordA",
      },
      {
        brokerName: "Broker B",
        apiKey: "API_KEY_B",
        apiSecret: "API_SECRET_B",
        authToken: "AUTH_TOKEN_B",
        vendorCode: "VENDOR_B",
        accountNumber: "654321",
        password: "passwordB",
      },
      {
        brokerName: "Broker C",
        apiKey: "API_KEY_C",
        apiSecret: "API_SECRET_C",
        authToken: "AUTH_TOKEN_C",
        vendorCode: "VENDOR_C",
        accountNumber: "789012",
        password: "passwordC",
      },
    ];

    // Set dummy data to tableDatafetch
    setTableDatafetch(dummyData);
    setLoading(false); // Set loading to false since data is already loaded
  }, []);

  const handleAddBroker = () => {
    const payload = {
      brokerName,
      apiKey,
      apiSecret,
      authToken,
      vendorCode,
      accountNumber,
      password,
      
    };
    

    const type = "POST"
    const endpoint= "broker"
    handleexchangerequest(type, payload, endpoint,true)
    .then(response => {
    console.log(response) 
    
    // window.location.reload()
    })
  

    // Add API call logic here to save the broker details
  };





  

  

 

    
        };
  const handleOpen = (rowIndex) => {
    const row = tableDatafetch[rowIndex];
    setSelectedRow(rowIndex);
    setBrokerName(row.brokerName || "");
    setApiKey(row.apiKey || "");
    setApiSecret(row.apiSecret || "");
    setAuthToken(row.authToken || "");
    setVendorCode(row.vendorCode || "");
    setAccountNumber(row.accountNumber || "");
    setPassword(row.password || "");
    setIsOpen(true);
    




  



  const fetchaccountlist=()=>{




    

  }
  

  return (
    <>
      <div className="container mx-auto mt-5 bg-slate-800 p-4 rounded-lg">
        {/* Add Broker Form */}
        {isOpen && selectedRow !== null && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-blue-800 mb-6">Edit Broker</h1>
            <form className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="broker-name" className="w-1/3 text-lg text-gray-700">
                  Broker Name
                </Label>
                <Input
                  id="broker-name"
                  type="text"
                  placeholder="Enter Broker Name"
                  value={brokerName}
                  onChange={(e) => setBrokerName(e.target.value)}
                  className="w-2/3 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="api-key" className="w-1/3 text-lg text-gray-700">
                  API Key
                </Label>
                <Input
                  id="api-key"
                  type="text"
                  placeholder="Enter API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-2/3 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="api-secret" className="w-1/3 text-lg text-gray-700">
                  API Secret
                </Label>
                <Input
                  id="api-secret"
                  type="password"
                  placeholder="Enter API secret"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="w-2/3 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="auth-token" className="w-1/3 text-lg text-gray-700">
                  Auth Token
                </Label>
                <Input
                  id="auth-token"
                  type="text"
                  placeholder="Enter Auth Token"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  className="w-2/3 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="vendor-code" className="w-1/3 text-lg text-gray-700">
                  Vendor Code
                </Label>
                <Input
                  id="vendor-code"
                  type="text"
                  placeholder="Enter Vendor Code"
                  value={vendorCode}
                  onChange={(e) => setVendorCode(e.target.value)}
                  className="w-2/3 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="account-number" className="w-1/3 text-lg text-gray-700">
                  Account Number
                </Label>
                <Input
                  id="account-number"
                  type="text"
                  placeholder="Enter Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-2/3 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="password" className="w-1/3 text-lg text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-2/3 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleAddBroker}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section */}
        <div className="container mx-auto mt-6 p-6 bg-trasparent rounded-lg max-w-6xl">
        <div className="overflow-x-auto h-72 w-full rounded-lg">
          {loading ? (
            <p className="text-center text-white">Loading...</p>
          ) : tableDatafetch.length === 0 ? (
            <p className="text-center text-white">No data available</p>
          ) : (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  {tableDatafetch[0] &&
                    Object.keys(tableDatafetch[0]).map((key) => (
                      <th key={key} scope="col" className="px-6 py-3">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </th>
                    ))}
                  <th className="px-6 py-3">Edit</th>
                </tr>
              </thead>
              <tbody>
                {tableDatafetch.map((row, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    {Object.values(row).map((value, idx) => (
                      <td key={idx} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {value}
                      </td>
                    ))}
                    <td className="px-6 py-2 text-center">
                      <Button
                        className="bg-blue-600 text-white py-2 text-sm rounded-md hover:bg-blue-700"
                        onClick={() => handleOpen(index)}
                      >
                        Edit
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
    </>
  );
};

export default AddBroker;