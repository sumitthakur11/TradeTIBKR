import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../components/ui/select"

import { Label } from '../components/ui/label';
import { Input } from './ui/input';
import { handleexchangerequest } from "../utility/Api";
import { Check, ChevronsUpDown } from "lucide-react"
import { FixedSizeList } from "react-window";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../components/ui/command"

// import addbrokerbox from './addbrokerbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../components/ui/dialog";
import { useNavigate } from "react-router-dom";
  
import debounce from "lodash.debounce";





const Dashboard = () => {
    const navigate = useNavigate();

    const [AddBropen, setAddBrOpen] = useState(false)
    const [Loginopen, setLoginOpen] = useState(false)
    const [Logoutopen, setLogoutOpen] = useState(false)
    const [placeorderopen, setPlaceOrderOpen] = useState(false)
    const [dialogTheme, setDialogTheme] = useState("");
    const [apikey, setapikey] = useState(""); // State for API Key
    const [secretkey, setsecretkey] = useState(""); // State for API Secret
    const [redirectUrl, setRedirectUrl] = useState("");
    const [brokerName1, setBrokerName1] = useState("");
    const [brokerName2, setBrokerName2] = useState("");
    const [brokerName3, setBrokerName3] = useState(""); 
    const [brokerName4, setBrokerName4] = useState(""); 
    const [vendorcode, setvendorcode] = useState(""); 
    const[filterText,setFilterText]= useState("")
    const [tableDatafetch, setTableDatafetch] = useState([]);
    const [AuthToken, setAuthToken] = useState('');
    const [accountnumber, setaccountnumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading,setLoading]= useState('')
    const [Comboopen, setComboOpen] = useState(false)
    const [selectsymbol,setselectsymbol]=useState('')
    const [Symbol,setsymbol]= useState([])
     const [brokers, setBrokers] = useState([])
     const [ordertype, setOrdertype] = useState("")
     const [product, setProduct] = useState("")
     const [filteredsymbol, setfilteredsymbol] = useState([])
     const [price, setPrice] = useState("")
     const [quantity, setQuantity] = useState("")
     const[exchange,setExchange]= useState("")
     const [query, setQuery] = useState("");
     const [side, setside] = useState("");
     const [isIndexEnabled, setIsIndexEnabled] = useState(false);
     const [instrument, setInstrument] = useState('EQ');





    const handleopen = () => setAddBrOpen(true)
    
    
    
    const handleplaceorder = ()=>{
         const payload = JSON.stringify({
          brokerName4,
          selectsymbol,
          ordertype,
          product,
          quantity,
          price,
          exchange,
          side


        });
        const type = "POST"
        const endpoint= "placeorder"
        handleexchangerequest(type, payload, endpoint,true)
    .then(response => {
    console.log(response) 
    
    window.location.reload()
    })
    
    }
  
    
    

    const handleSelectChange = (value) => {
        if (value === "Buy") {
          setDialogTheme("bg-green-300"); // Greenish theme for Buy
          setPlaceOrderOpen(true);
          setside('BUY')
        } else if (value === "Sell") {
          setDialogTheme("bg-red-300"); // Reddish theme for Sell
          setPlaceOrderOpen(true);
          setside('SELL')

        }
      };

      useEffect(() => {
        const handleKeyPress = (event) => {
          if (event.key === "F1") {
            event.preventDefault(); // Prevent default browser behavior (help menu)
            setDialogTheme("bg-green-300"); // Set theme for Buy
            setPlaceOrderOpen(true); // Open the Buy dialog
            setside('BUY')
          }
            else if (event.key === "F2") {
                event.preventDefault(); // Prevent default browser behavior (help menu)
                setDialogTheme("bg-red-300"); // Set theme for Sell
                setPlaceOrderOpen(true); // Open the Sell dialog
            setside('SELL')

            }
        };
    
        window.addEventListener("keydown", handleKeyPress);
        return () => {
          window.removeEventListener("keydown", handleKeyPress);
        };
      }, []);


      const fetchBrokers = async () => {
        try {
      const response = await handleexchangerequest("GET", 'Broker=all', "symbols",false); // Replace with your API endpoint
      if (response) {
        setBrokers(response); // Assuming response.data contains the broker list
      } else {
        console.error("Failed to fetch brokers");
      }
    } catch (error) {
      console.error("Error fetching brokers:", error);
    }
  };

  // Fetch brokers on component mount
 

      const dashlogout =()=>{
        localStorage.clear()
        navigate('/')
      }


      const data1 = [
        { id: 1, name: "John Doe", age: 28, email: "john.doe@example.com" },
        { id: 2, name: "Jane Smith", age: 34, email: "jane.smith@example.com" },
        { id: 3, name: "Alice Johnson", age: 25, email: "alice.johnson@example.com" },
        { id: 4, name: "Bob Brown", age: 42, email: "bob.brown@example.com" },
        { id: 5, name: "Charlie Davis", age: 30, email: "charlie.davis@example.com" },
        { id: 6, name: "Emily Wilson", age: 29, email: "emily.wilson@example.com" },
        { id: 7, name: "Frank Miller", age: 37, email: "frank.miller@example.com" },
        { id: 8, name: "Grace Lee", age: 31, email: "grace.lee@example.com" },
        { id: 9, name: "Henry White", age: 45, email: "henry.white@example.com" },
        { id: 10, name: "Isabella Green", age: 27, email: "isabella.green@example.com" },
        { id: 11, name: "Jack Black", age: 33, email: "jack.black@example.com" },
        { id: 12, name: "Laura Brown", age: 26, email: "laura.brown@example.com" },
      ];
    
      const data2 = [
        { id: 1, name: "Michael Scott", age: 40, email: "michael.scott@example.com", country: "USA" },
        { id: 2, name: "Dwight Schrute", age: 38, email: "dwight.schrute@example.com", country: "USA" },
        { id: 3, name: "Jim Halpert", age: 35, email: "jim.halpert@example.com", country: "USA" },
        { id: 4, name: "Pam Beesly", age: 32, email: "pam.beesly@example.com", country: "USA" },
        { id: 5, name: "Ryan Howard", age: 29, email: "ryan.howard@example.com", country: "USA" },
        { id: 6, name: "Kelly Kapoor", age: 28, email: "kelly.kapoor@example.com", country: "India" },
        { id: 7, name: "Stanley Hudson", age: 50, email: "stanley.hudson@example.com", country: "USA" },
        { id: 8, name: "Kevin Malone", age: 45, email: "kevin.malone@example.com", country: "USA" },
      ];
    
      const data3 = [
        { id: 1, name: "Tony Stark", age: 48 },
        { id: 2, name: "Steve Rogers", age: 101 },
        { id: 3, name: "Natasha Romanoff", age: 35 },
        { id: 4, name: "Bruce Banner", age: 49 },
        { id: 5, name: "Thor Odinson", age: 1500 },
        { id: 6, name: "Clint Barton", age: 41 },
        { id: 7, name: "Wanda Maximoff", age: 29 },
        { id: 8, name: "Peter Parker", age: 18 },
        { id: 9, name: "Stephen Strange", age: 45 },
        { id: 10, name: "Carol Danvers", age: 38 },
      ];

    const brokerlist=[
    {"NAME":"ANGEL"},
    {"NAME":"SHOONYA"},
    {"NAME":"DHAN"},
    {"NAME":"FYERS"},
    {"NAME":"MOTILAL"},
    {"NAME":"ANANDRATHI"},
    {"NAME":"GROWW"},
    {"NAME":"ZERODHA"},
    {"NAME":"SAMCO"},
    {"NAME":"FLATTRADE"},
    {"NAME":"BIGUL"},
    {"NAME":"STOXKART"}

    
]
    const [tableData, setTableData] = useState(data1);

    

    const handleexchange = async () => {
        const payload = JSON.stringify({
          apikey,
          secretkey,
          redirectUrl,
          brokerName1,
          vendorcode,AuthToken,accountnumber,password

        });
        const type = "POST"
        const endpoint= "broker"
        handleexchangerequest(type, payload, endpoint,true)
    .then(response => {
    console.log(response) 
    
    window.location.reload()
    })
    
        };

 const handlelogin = async () => {
        const payload = JSON.stringify({brokerName2 });
        const type = "POST"
        const endpoint= "loginbroker"
        handleexchangerequest(type, payload, endpoint,true)
    .then(response => {
    console.log(response) 
    
    window.location.reload()
    })
    
        };



const handlelogout = async () => {
        const payload = JSON.stringify({
          brokerName3,
       

        });
        const type = "POST"
        const endpoint= "logoutbroker"
        handleexchangerequest(type, payload, endpoint,true)
    .then(response => {
      
    window.location.reload()
    })
    
        };


const handleorders= async (x) => {
     
        const type = "GET"
        const endpoint= "position"
        const payload= "type="+x
        handleexchangerequest(type, payload, endpoint,true)
        .then(response => {
          console.log(response) 
        setTableDatafetch(response);
    // alert("Data fetched successfully!");
    })
 };

    const handleSearch = debounce((value) => {

         setQuery(value);
      if (value) {
         setselectsymbol(value); 
      fetchSymbols(brokerName4, exchange,instrument,value); 
}
    

        }, 600); // Wait 300ms before executing the search



 const handleFilterChange = (value) => {
      setFilterText(value);
      if (value) {
      filteredAndSortedProjects = filteredAndSortedProjects.filter((Symbol) =>
      Symbol.toLowerCase().includes(value.toLowerCase())
      );
      setfilteredsymbol(filteredAndSortedProjects)


    }

    };
   
  
  let filteredAndSortedProjects = [...Symbol];

    // Apply filtering


  useEffect(()=>{

      setfilteredsymbol(filteredAndSortedProjects)

  },[setfilteredsymbol])
    


  



      const fetchSymbols = async (broker, exchange,instrument,symbol) => {
        setLoading(true);
        try {
          const queryParams = `Broker=${broker}&exchange=${exchange}&instrument=${instrument}&name=${symbol}`;
          const response = await handleexchangerequest("GET", queryParams, "symbols",false);
          if (response) {
            const removeDuplicatsymbol = [...new Set(response.TradingSymbol)];

            setsymbol(removeDuplicatsymbol);
            console.log("Symbols fetched successfully:", removeDuplicatsymbol);
          } else {
            console.error("Failed to fetch symbols");
          }
        } catch (error) {
          console.error("Error fetching symbols:", error);
        } finally {
          setLoading(false);
        }
      };

      // Fetch brokers on component mount
      useEffect(() => {
        fetchBrokers();
    
      }, []);

      const handleSelectIndex = (value) => {
         if (brokerName4) {
      // fetchSymbols(brokerName4, value)
        setExchange(value)
      // ;

    } else {
      alert("Please select a broker first");
    }

    // Enable "Select Index" only for "NFO" or "BFO"
    if (value === "NFO" || value === "BFO") {
      setIsIndexEnabled(true);
    } else {
      setIsIndexEnabled(false);
    }
  }
  const alertsymbol = (value) => {

    
    if (brokerName4) {  
      setInstrument(value)

      // fetchSymbols(brokerName4, value);
    } else {
      alert("Please select a broker first");
    }
  }
    
  return (
    <>
    <div className="container-fluid bg-transparent h-screen flex flex-col gap-4 min-h-screen  px-4 sm:px-6 lg:px-8">
        <div className='flex gap-5 flex-wrap pt-3 items-center'>
        <div className='flex justify-between flex-wrap gap-2'>
                        <div className='flex gap-2 flex-wrap'>
                          <div className='flex flex-col gap-2'>
                            <Label className =" text-slate-800 text-base">Broker</Label>
                            <Select onValueChange={(value) => setBrokerName4(value)}>
                            <SelectTrigger className="w-40 max-xs:w-20 bg-sky-700/85 text-white hover:bg-sky-700">
                              <SelectValue placeholder="Broker" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-blue-300">
                              {brokers && brokers.length > 0 ? (
                                brokers.map((broker, index) => (
                                  <SelectItem
                                    key={index}
                                    value={broker.NAME}
                                    className="hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-200"
                                  >
                                    {broker.NAME}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="loading" disabled>
                                  {loading ? "Loading brokers..." : "No brokers available"}
                                </SelectItem>
                              )}
                              
                            </SelectContent>
                          </Select>
                            </div>
                            <div className='flex flex-col gap-2'>
                            <Label className =" text-slate-800 text-base">Exchange</Label>
                            <Select
              onValueChange= {(value) => handleSelectIndex(value)}
            >
              <SelectTrigger className="w-40 max-xs:w-20 bg-sky-700/85 text-white hover:bg-sky-700">
                <SelectValue placeholder="Exchange" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-blue-300">
                <SelectItem
                  value="NSE"
                  className="hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-200"
                >
                  NSE
                </SelectItem> 
                <SelectItem
                  value="NFO"
                  className="hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-200"
                >
                  NFO
                </SelectItem>
                <SelectItem
                  value="BSE"
                  className="hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-200"
                >
                  BSE
                </SelectItem>
                <SelectItem
                  value="BFO"
                  className="hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-200"
                >
                  BFO
                </SelectItem>
              </SelectContent>
            </Select>
                            </div>
                            <div className='flex flex-col gap-2'>
                            <Label className =" text-slate-800 text-base">Type</Label>
                            <Select
              onValueChange={(value) => {
                alertsymbol(value);
              }}
              disabled={!isIndexEnabled} // Disable when `isIndexEnabled` is false
            >
              <SelectTrigger
                className={`w-[130px] ${
                  isIndexEnabled
                    ? "bg-sky-700/85 text-white hover:bg-sky-700"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              >
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-blue-300">
                
                <SelectItem
                  value="FUTSTK"
                  className="hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-200"
                >
                  FUTSTK
                </SelectItem>
                <SelectItem
                  value="FUTIDX"
                  className="hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-200"
                >
                  FUTIDX
                </SelectItem>
                <SelectItem
                  value="OPTIDX"
                  className="hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-200"
                >
                  OPTIDX
                </SelectItem>
                <SelectItem
                  value="OPTSTK"
                  className="hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-200"
                >
                  OPTSTK
                </SelectItem>
              </SelectContent>
            </Select>
                            </div>
                            
            
                            
            
                          </div>
                        <div className='flex gap-2'>
                            
                <div className='flex gap-2'>
                            <div className='flex flex-col gap-2'>
                            <Label className =" text-white text-base">Symbol</Label>
                            <Popover open={Comboopen} onOpenChange={setComboOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={Comboopen}
                                  className="w-48 max-xs:w-20 justify-between bg-sky-700/85 text-white hover:bg-sky-600"
                                >
                                  {selectsymbol || "Select Symbol"}
                                  {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0">
                                <Command>
                                  <CommandInput  onValueChange={handleSearch} 
                                       
                                    placeholder="Search symbol..." />
                                  <CommandList>
                                    <CommandEmpty>No symbol found.</CommandEmpty>
                                    <CommandGroup>
                                      <CommandItem value="select-symbol" onChange={(e) => setselectsymbol(e)}>
                                        Select Symbol
                                      </CommandItem>
                                      {Symbol.length > 0 ? (
                                        Symbol.map((symbol, index) => (
                                          <CommandItem
                                            key={index}
                                            value={symbol}
                                            onSelect={() => {
                                              setselectsymbol(symbol);
                                              setComboOpen(false);
                                            }}
                                          >
                                            <Check
                                              className={`mr-2 h-4 w-4 ${
                                                selectsymbol === symbol ? "opacity-100" : "opacity-0"
                                              }`}
                                            />
                                            {symbol}
                                          </CommandItem>
                                        ))
                                      ) : (
                                        <CommandItem disabled>
                                          {loading ? "Loading symbols..." : "No symbols available"}
                                        </CommandItem>
                                      )}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            </div>
                        </div>
                            
                        </div>
                        
                        </div>
        </div>

        <div className="container mx-auto mt-6 p-6 bg-gray-100 rounded-lg shadow-md max-w-6xl">

      <div className="overflow-x-auto h-72 w-full rounded-lg">
  {loading ? (
    <p className="text-center text-white">Loading...</p> // Loading message
  ) : tableDatafetch.length === 0 ? (
    <table className="min-w-full table-auto">
      <thead className="text-xs text-gray-700 uppercase bg-gray-350 dark:bg-gray-700 dark:text-gray-400">
        <tr className="bg-gray-200">
          <th className="px-3 py-2">Column 1</th>
          <th className="px-3 py-2">Column 2</th>
          <th className="px-3 py-2">Column 3</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, index) => (
          <tr key={index} className="text-center">
            <td className="px-3 py-2 text-center">-</td>
            <td className="px-3 py-2 text-center">-</td>
            <td className="px-3 py-2 text-center">-</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <table className="table-auto border-collapse border border-gray-300 w-full overflow-hidden">
      <thead>
        <tr className="bg-gray-200">
          {Object.keys(tableDatafetch[0]).map((key) => (
            <th key={key} className="border border-gray-300 px-4 py-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableDatafetch.map((row) => (
          <tr key={row.id} className="text-center">
            {Object.values(row).map((value, index) => (
              <td key={index} className="border border-white-300 text-gray-400 px-4 py-2">
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
    </div>


    </div>
    </>
  )
}


export default Dashboard