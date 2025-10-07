import React, { useEffect, useState } from "react"; // Ensure useState is imported
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../components/ui/select"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "../components/ui/command"
import { Input } from "../components/ui/input"
import debounce from "lodash.debounce";
import { handleexchangerequest } from "../utility/Api";
import{WSHOST} from "../utility/Host"
import { Check, ChevronsUpDown } from "lucide-react"
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { RefreshCcw } from 'lucide-react';


const Marketwatch = () => {
    const [brokerName4, setBrokerName4] = useState(""); 
    const [Comboopen, setComboOpen] = useState(false);
    const [isIndexEnabled, setIsIndexEnabled] = useState(false);
    const [selectsymbol, setselectsymbol] = useState('');
    const [brokers, setBrokers] = useState([]);
    const [loading, setLoading] = useState('');
    const [tableDatafetch, setTableDatafetch] = useState([]);
    const [symbolCount, setSymbolCount] = useState(0); // Track the number of symbols added
         const[exchange,setExchange]= useState("")
         const [query, setQuery] = useState("");
        const [Symbol,setsymbol]= useState('')
        const [token,setToken]= useState('')
        const [data,setdata]= useState('')
        const [instrument,setInstrument]= useState('')
        const [lotsize,setlotsize]= useState('')


        
  

    const [messages, setMessages] = useState([]);

       const  handletoken = (index)=>{
        if (brokerName4=='SHOONYA'){
        setToken(data['Token'][index])
        setlotsize(data['LotSize'][index])

        }


        else if (brokerName4=='ANGEL'){

        setToken(data['token'][index])
        setlotsize(data['lotsize'][index])


       }

       else {
       setToken(data['token'][index])
        setlotsize(data['lotsize'][index])

       }

        }
    



     const navigate = useNavigate();
     const location = useLocation();



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


        useEffect(() => {
        fetchBrokers();
    
      }, []);
    useEffect(() => {
    const dummyBrokers = [
      { NAME: "Broker1" },
      { NAME: "Broker2" },
      { NAME: "Broker3" },
    ];
    const dummySymbols = [];
    const dummyTableData = [
      { id: 1, column1: "Row1-Col1", column2: "Row1-Col2", column3: "Row1-Col3" },
      { id: 2, column1: "Row2-Col1", column2: "Row2-Col2", column3: "Row2-Col3" },
      { id: 3, column1: "Row3-Col1", column2: "Row3-Col2", column3: "Row3-Col3" },
    ];

    setBrokers(dummyBrokers);
    setsymbol(dummySymbols);
    setTableDatafetch(dummyTableData);
  }, []);
    
 const fetchSymbols = async (broker, exchange,instrument,symbol) => {
        setLoading(true);
        let removeDuplicatsymbol
        try {
          const queryParams = `Broker=${broker}&exchange=${exchange}&instrument=${instrument}&name=${symbol}`;
          const response = await handleexchangerequest("GET", queryParams, "symbols",false);
          if (response) {
            setdata(response)
            // if(broker=='SHOONYA'){
            //  removeDuplicatsymbol = [...new Set(response.TradingSymbol)];
            // }

            //  if(broker=='ANGEL'){
            //  removeDuplicatsymbol = [...new Set(response.symbol)];
            // }
           
            removeDuplicatsymbol = [...new Set(response.TradingSymbol)];




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

      // Fetch brokers on component mou
      // 
      // 
      // 
      // nt



 useEffect(() => {
  const socket = new WebSocket(WSHOST);

  const id = window.localStorage.getItem('id');

  socket.onopen = () => {
    console.log('WebSocket connection established', id);
    socket.send(JSON.stringify({ message: 'LTPFEEDS', user: id }));
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('EVENT', message);
      setMessages(message.message);
    } catch (e) {
      console.error('Error parsing message', e);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };

  // 🔁 Keep-alive ping every 30 seconds
  const pingInterval = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping' }));
    }
  }, 60000); // 30 seconds

  // Cleanup function
  return () => {
    clearInterval(pingInterval);
    socket.close();
  };
}, [setMessages]);





        console.log(messages,'messages')


















    
const handleSelectIndex = (value) => {
     if (brokerName4) {
  // fetchSymbols(brokerName4, value)
    setExchange(value)
    if (value==='NSE'){
  setInstrument('EQ')
      

    }

    if (value==='BSE'){
  setInstrument('EQ')
      

    }

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

 const handleAddSymbol = ()=>{
    if (symbolCount >= 50) {
        alert("You cannot add more than 50 symbols.");
        return;
    }
         const payload = JSON.stringify({
          brokerName4,
          exchange,
          instrument,
          selectsymbol,
          token,lotsize
        


        });
        const type = "POST"
        const endpoint= "watchlist"
        handleexchangerequest(type, payload, endpoint,true)
    .then(response => {
    console.log(response) 
    setSymbolCount(response); // Increment the symbol count
    
    // window.location.reload()
    })
    
    }
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

      }, 1000); // Wait 300ms before executing the search



const handleBuyOrSell = (data,action) => {
  console.log(data,'action')
    navigate("/OrderPunch",{
        state: {
            data: data,
            action: action
        },
    });

};

const handleDelete = (id,name,ts) => {




 
      const type = "DELETE"
      const endpoint= "watchlist"
      const payload= "id="+id+"&brokername="+name+"&ts="+ts
      handleexchangerequest(type, payload, endpoint,true)
      .then(response => {
        console.log(response) 
    })
}


return (
<>
<div>
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
                    ? "bg-blue-800  bg-sky-700/85 text-white hover:bg-sky-700"
                    : "bg-gray-400 text-blak cursor-not-allowed"
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
                            
                <div className='flex gap-2 items-end'>
                            <div className='flex flex-col gap-2'>
                            <Label className =" text-slate-800 text-base">Symbol</Label>
                            <Popover open={Comboopen} onOpenChange={setComboOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={Comboopen}
                                  className="w-48 max-xs:w-20 justify-between bg-sky-700/85 text-white hover:bg-sky-700"
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
                                              handletoken(index)
                                            }}
                                          >
                                            {/* <Check
                                              className={`mr-2 h-4 w-4 ${
                                                selectsymbol === symbol ? "opacity-100" : "opacity-0"
                                              }`}
                                            /> */}
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
                            <Button
                                className={`bg-green-700/85 text-white hover:bg-green-700 w-44 max-xs:w-20 ${
                                    symbolCount >= 50 ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                onClick={handleAddSymbol}
                                disabled={symbolCount >= 50} // Disable button if symbol count exceeds 50
                            >
                                Add Symbol
                            </Button>
                            <p>New subscriptions will reflect below on market open.</p>
                        </div>
                            
                        </div>
                        
                        </div>
                        
                        </div>
                        <div className="container mx-auto mt-2 bg-transparent rounded-lg h-full">
<div className="container mx-auto mt-6 p-6 h-full bg-gray-100 rounded-lg shadow-md max-w-6xl">
  <div className="overflow-x-auto h-full w-full rounded-lg">
{loading ? (
<p className="text-center text-slate-800">Loading...</p> // Loading message
) : tableDatafetch.length === 0 ? (
<Paper sx={{ height: "100%", width: '100%' }}>
    <DataGrid
      className="text-black overflow-x-scroll scrollbar-hide"
      rows={[...Array(5)].map((_, index) => ({ id: index }))} // Dummy rows for empty state
      getRowId={(row) => row.id}
      disableSelectionOnClick
      columns={[
        { field: 'column1', headerName: 'Column 1', width: 150, renderCell: () => '-' },
        { field: 'column2', headerName: 'Column 2', width: 150, renderCell: () => '-' },
        { field: 'column3', headerName: 'Column 3', width: 150, renderCell: () => '-' },
        {
          field: 'buy',
          headerName: 'Buy',
          width: 100,
          renderCell: () => (
            <Button
              variant="contained"
              sx={{ backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' } }}
            >
              Buy
            </Button>
          ),
        },
        {
          field: 'sell',
          headerName: 'Sell',
          width: 100,
          renderCell: () => (
            <Button
              variant="contained"
              sx={{ backgroundColor: '#dc2626', '&:hover': { backgroundColor: '#b91c1c' } }}
            >
              Sell
            </Button>
          ),
        },
        {
          field: 'delete',
          headerName: 'Delete',
          width: 100,
          renderCell: () => (
            <Button
              variant="contained"
              sx={{ backgroundColor: '#b91c1c', '&:hover': { backgroundColor: '#991b1b' } }}
            >
              Delete
            </Button>
          ),
        },
      ]}
      initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
      pageSizeOptions={[5, 10]}
      sx={{ border: 0 }}
    />
  </Paper>
) : (
<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 font-bold">
  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
    {messages.length > 0 &&
      Object.keys(messages[0]).filter((key) => key !== 'lotsize')
        .map((key) => (
        <th key={key} scope="col" className="px-6 py-3">
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </th>
      ))}
    <th scope="col" className="px-6 py-3">Buy</th>
    <th scope="col" className="px-6 py-3">Sell</th>
    <th scope="col" className="px-6 py-3">Delete</th>
  </tr>
</thead>
<tbody>
  {messages.map((row, rowIndex) => (
    <tr
      key={rowIndex}
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
    >
      {Object.keys(row).filter((key) => key !== 'lotsize')
      .map((key, colIndex) => (
        <td
          key={colIndex}
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-slate-800"
        >
          {row[key]}
        </td>
      ))}
      {/* Add static action buttons */}
      <td
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-slate-800"
      >
        <Button
          className="bg-green-600 text-white hover:bg-green-700"
          onClick={() => handleBuyOrSell(row,'BUY')}
        >
          Buy
        </Button>
      </td>
      <td
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-slate-800"
      >
        <Button
          className="bg-red-600/90 text-white hover:bg-red-700"
          onClick={() => handleBuyOrSell(row,"SELL")}
        >
          Sell
        </Button>
      </td>
      <td
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-slate-800"
      >
        <Button
          className="bg-red-700 text-white hover:bg-red-700"
          onClick={() => handleDelete(row.id,row.broker,row.tradingsymbol)}
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
</div>
                        
                        </>
)
}

export default Marketwatch