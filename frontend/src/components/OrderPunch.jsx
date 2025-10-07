import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { handleexchangerequest } from "../utility/Api";
import { Check, ChevronsUpDown } from "lucide-react";
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
} from "../components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import debounce from "lodash.debounce";
import { MultiSelect } from './ui/multi-select'
import { HomeIcon, Code, Laptop, Palette, Zap, Database, Cloud, Settings, Lock } from "lucide-react"



const OrderPunch = () => {
  const location = useLocation();
  const passedState = location.state || {};

  const [placeorderopen, setPlaceOrderOpen] = useState(false);
  const [dialogTheme, setDialogTheme] = useState("");
  const [loading, setLoading] = useState("");
  const [Comboopen, setComboOpen] = useState(false);
  const [Symbol, setsymbol] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [accountlist, setAccountlist] = useState([]);
  
  const [product, setProduct] = useState("");
  const [brokerName, setBrokerName] = useState("");
  const [orderType, setOrderType] = useState("");
  const [Loginopen, setLoginOpen] = useState(false);
  const [brokerName2, setBrokerName2] = useState("");
  const [quantity, setQuantity] = useState("");
  const [discloseqty, setdiscolseqty] = useState("");
  const [isIndexEnabled, setIsIndexEnabled] = useState(true);
  const [tableDatafetch, setTableDatafetch] = useState([]);

  const [brokerName4, setBrokerName4] = useState( "");
  const [exchange, setExchange] = useState('');
  const [instrument, setInstrument] = useState( "");
  const [selectsymbol, setselectsymbol] = useState("");
  const[token,settoken]=useState( "");
  const [side, setside] = useState(""); // "Buy" or "Sell"
  const [price, setPrice] = useState('');
  const [accountname, setAccountname] = useState([]);
  const [lotsize, setlotsize] = useState('');
  const [isAccountDisabled, setIsAccountDisabled] = useState(false);
  const [modify, setmodify] = useState(false);
  const [orderid, setorderid] = useState('');


  

  const [query, setQuery] = useState('');
 const [data,setdata]= useState([])
  const [selected, setSelected] = useState([])



  const [isindexEQ,setIsIndexEQ] = useState(false);
  

  useEffect(() => {
    if (passedState.action) {
      console.log(passedState.data,'data>>>>')
      setside(passedState.action.toUpperCase());
      setmodify(passedState.modify)
      settoken(passedState.data.symboltoken ) 
      setPrice(passedState.data.ltp )
      setorderid(passedState.data.orderid)
      setBrokerName4(passedState.data.brokername || "");
      setExchange(passedState.data.exchange || "");
      setInstrument(passedState.data.instrument || "");
      setselectsymbol(passedState.data.tradingsymbol || "");
      // setside(passedState.data.side || "");
      setlotsize(passedState.data.lotsize || "");
      setQuantity(passedState.data.quantity || "");
      setdiscolseqty(passedState.data.discloseqty || "");
      setProduct(passedState.data.product_type||"")
      setOrderType(passedState.data.ordertype||"")
      setBrokerName4(passedState.data.broker||"")
      setPrice(passedState.data.ltp||"")
      setAccountname(passedState.data.accountnumber || "");  






    }
  }, [passedState]);


  const dummyLogs = [
  { id: 1, message: 'User logged in successfully', timestamp: '2025-05-13 19:45:32' },
  { id: 2, message: 'API request failed: Invalid token', timestamp: '2025-05-13 19:46:10' },
  { id: 3, message: 'Database connection established', timestamp: '2025-05-13 19:46:45' },
  { id: 4, message: 'File uploaded to server', timestamp: '2025-05-13 19:47:22' },
  { id: 5, message: 'User updated profile', timestamp: '2025-05-13 19:48:01' },
  { id: 6, message: 'Scheduled task started', timestamp: '2025-05-13 19:49:15' },
  { id: 7, message: 'Payment processed successfully', timestamp: '2025-05-13 19:50:00' },
];

    const frameworks = [
  { value: "react", label: "React", icon: Code },
  { value: "next", label: "Next.js", icon: Zap },
  { value: "vue", label: "Vue", icon: Laptop },
  { value: "nuxt", label: "Nuxt.js", icon: Cloud },
  { value: "svelte", label: "Svelte", icon: Palette },
  { value: "angular", label: "Angular", icon: Settings },
  { value: "solid", label: "Solid", icon: Database },
  { value: "ember", label: "Ember", icon: HomeIcon },
  { value: "alpine", label: "Alpine", icon: Lock },
]


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


  const fetchaccountlist = async (broker) => {
        try {
      const response = await handleexchangerequest("GET", 'broker='+broker+'&account=all', "broker",false); // Replace with your API endpoint
      if (response) {
        setAccountlist(response); // Assuming response.data contains the broker list
        console.log(response,'account');
        if(response.length==0){
          alert('No Logged in  Account found. Please Login to Broker ')
        }

      } else {
        console.error("Failed to fetch brokers");
      }
    } catch (error) {
      console.error("Error fetching brokers:", error);
    }
  };



    // Fetch brokers on component mount
        useEffect(() => {
          fetchBrokers();
          // fetchaccountlist()
      
        }, []);

  

   
    const handlePlaceOrder = ()=>{
         const payload = JSON.stringify({
          brokerName4,
          selectsymbol,
          orderType,
          product,
          quantity,
          price,
          exchange,
          side,
          accountname,
          token,
          discloseqty,
          instrument,
          modify,
          orderid,
          lotsize


        });
        const type = "POST"
        const endpoint= "placeorder"
        handleexchangerequest(type, payload, endpoint,true)
    .then(response => {
    console.log(response) 
    
    // window.location.reload()
    })
    
    }

  

  const handleSelectChange = (value) => {
    if (value === "Buy") {
      setDialogTheme("bg-green-300"); // Greenish theme for Buy
      setPlaceOrderOpen(true);
      setside("BUY");
    } else if (value === "Sell") {
      setDialogTheme("bg-red-300"); // Reddish theme for Sell
      setPlaceOrderOpen(true);
      setside("SELL");
    }
  };

  const handleSearch = debounce((value) => {
    setQuery(value);
    if (value) {
      setselectsymbol(value);
      fetchSymbols(brokerName4, exchange, instrument, value);
    }
  }, 600);

  const handlelogin = async () => {
    const payload = JSON.stringify({ brokerName2 });
    const type = "POST";
    const endpoint = "loginbroker";
    handleexchangerequest(type, payload, endpoint, true).then((response) => {
      console.log(response);
      // window.location.reload();
    });
  };

  
      const handleSelectIndex = (value) => {
        console.log(value);
         if (brokerName4) {
      // fetchSymbols(brokerName4, value)
        setExchange(value)

      // ;

    } 
    else {
      alert("Please select a broker first");
    }

    // Enable "Select Index" only for "NFO" or "BFO"
    if (value === "NFO" || value === "BFO") {
      setIsIndexEnabled(true);
      setIsIndexEQ(false);
      setInstrument('')


      


    } else {
      setIsIndexEnabled(false);
    }
    if (value === "BSE" || value === "NSE") {
      setIsIndexEQ(true);
      setInstrument('')

    }


    else {
      setIsIndexEQ(false);
      
    }
  }


  const fetchSymbols = async (broker, exchange,instrument,symbol) => {
          setLoading(true);
          let removeDuplicatsymbol
          try {
            const queryParams = `Broker=${broker}&exchange=${exchange}&instrument=${instrument}&name=${symbol}`;
            const response = await handleexchangerequest("GET", queryParams, "symbols",false);
            if (response) {
              setdata(response)
              if(broker=='SHOONYA'){
               removeDuplicatsymbol = [...new Set(response.TradingSymbol)];
              }
  
               if(broker=='ANGEL'){
               removeDuplicatsymbol = [...new Set(response.TradingSymbol)];
               
              }else{

               removeDuplicatsymbol = [...new Set(response.TradingSymbol)];

              }
              
              setsymbol(removeDuplicatsymbol);
              console.log("Symbols fetched successfully:", response);
            } else {
              console.error("Failed to fetch symbols");
            }
          } catch (error) {
            console.error("Error fetching symbols:", error);
          } finally {
            setLoading(false);
          }
        };
  
  console.log(instrument,'instrument')
  const alertsymbol = (value) => {

    
    if (brokerName4) {  
      setInstrument(value)

      // fetchSymbols(brokerName4, value);
    } else {
      alert("Please select a broker first");
    }
  }

  
  const navigate = useNavigate();
 const handleLoginaccount = () => {
    if (brokerName2 === "SHOONYA") {
      navigate("/ViewBroker"); // Redirect to AddBroker page
    } 
    if (brokerName2 === "ANGEL") {
      navigate("/ViewAngel"); // Redirect to AddBroker page
    }
  };

  const handleReset = () => {
    setside("");
    setPrice("");
    setQuantity("");
    setProduct("");
    setOrderType("");
    setExchange("")
    setInstrument("")
    setdiscolseqty("")

  }

  const handleaccountselect=(value)=>{
    // setBrokerName4(value.brokername)
    console.log('Selected accounts:', value);
    setAccountname(value)

  }

  const handlesetlotsize=(index)=>{
    if (brokerName4==='ANGEL'){
      setlotsize(data.lotsize[index])
      settoken(data.token[index])

    }
     if (brokerName4==='SHOONYA'){
      setlotsize(data.LotSize[index])
      settoken(data.Token[index])


    }
    else{
      setlotsize(data.lotsize[index])
      settoken(data.token[index])

    }
    
  }

  

  return (
    <>
    <div className="flex flex-col h-screen">
      
      <div className="flex flex-col items-start gap-3 p-6 pt-0 bg-transparent text-slate-800">
        <div className="flex flex-col gap-4 h-full"> 
        <div className="flex flex-wrap items-start gap-4">


          <Dialog open={Loginopen} onOpenChange={setLoginOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setLoginOpen(true)}>Login Account</Button>
            </DialogTrigger>

            <DialogContent className="bg-zinc-400 w-2/5">
              <DialogHeader>
                <DialogTitle>Login Account</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2 items-center justify-between w-full">
                <Label htmlFor="broker-name" className="mr-2">

                  
                  Select Broker
                </Label>
                <Select onValueChange={(value) => setBrokerName2(value)}>
                  <SelectTrigger className="w-[180px] bg-stone-700 text-slate-800 hover:bg-stone-600">
                    <SelectValue placeholder="Market" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-slate-800 border border-blue-300">
                    {/* {brokers && brokers.length > 0 ? (
                      brokers.map((broker, index) => (
                        <SelectItem
                          key={index}
                          value={broker.NAME}
                          // value = "SHOONYA"
                          className="hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-200"
                        >
                          {broker.NAME}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        {loading ? "Loading brokers..." : "No brokers available"}
                      </SelectItem>
                    )} */}
                    <SelectItem value="SHOONYA">SHOONYA</SelectItem>
                    <SelectItem value="ANGEL">ANGEL</SelectItem>
                    
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="bg-green-700 hover:bg-green-900"
                onClick={handleLoginaccount}
              >
                LogIn Account
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
        

        {/* Buy/Sell Radio Buttons */}

        <div
          className={`flex outline-1 bg-neutral-300/20 outline w-full items-center justify-center p-4 rounded-lg ${
            side === "BUY"
              ? "outline-green-500 shadow-green-500/75 shadow-xl"
              : side === "SELL"
              ? "outline-red-500 shadow-xl shadow-red-500"
              : "outline-slate-800text-slate-800"
          }`}
        >
          
          
          <div className="flex flex-col gap-3 w-full items-center justify-center">
            <h1 className="text-3xl font-bold text-slate-800">Order Punch</h1>
            <div className="flex gap-3 w-full items-center max-xs:flex-col">
              <div className="flex flex-col gap-2 items-center justify-center w-full">
                <Label className="text-lg text-slate-800 text-center">Accounts</Label>
                <div className="flex items-center gap-2 justify-center w-full max-xs:flex-col">

                  <Select onValueChange={(value) => {setBrokerName4(value),setIsAccountDisabled(true),setAccountname(''),fetchaccountlist(value)}}>
            <SelectTrigger className="w-full bg-blue-800 text-white hover:bg-blue-700">
              <SelectValue placeholder="All in Broker" />
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
            

       
        <div className="space-y-4 w-full">
          <MultiSelect
            options={accountlist.map((broker)=>{
              return {
                value: broker.accountnumber,
                label: broker.nickname,
              }
            })}
            // className="text-black"
            onValueChange={(value) => {handleaccountselect(value);}}
            placeholder="Select Account"
            animation={0.5}
            maxCount={3}
            variant="default"
          />
        </div>
     
         
            
          </div>
          </div>
              
              

              <div className="flex flex-col gap-2 w-full items-center ">
                  <Label className="text-lg text-slate-800 text-center">Exchange</Label>
                <div className="flex flex-wrap max-xs:flex-col gap-6 w-full">
                  <div className="flex gap-6 flex-wrap">
                    <div className=" flex max-xs:flex-col gap-4 ">
                  <Label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="exchange"
                      value="NFO"
                      
                      checked={exchange === "NFO"}
                      onChange={(e) => handleSelectIndex(e.target.value)}
                      className="w-4 h-4 "
                    />
                    <span className="text-lg text-slate-800">NFO</span>
                  </Label>
                  
                    <Label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="exchange"
                        
                        value="NSE"
                        checked={exchange === "NSE"}
                        onChange={(e) => handleSelectIndex(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-lg text-slate-800">NSE</span>
                    </Label>
                    </div>
                    <div className="flex max-xs:flex-col gap-4">
                    <Label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="exchange"
                        value="BSE"
                        checked={exchange === "BSE"}
                        onChange={(e) => handleSelectIndex(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-lg text-slate-800">BSE</span>
                    </Label>
                    <Label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="exchange"
                        value="BFO"
                        checked={exchange === "BFO"}
                        onChange={(e) => handleSelectIndex(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-lg text-slate-800">BFO</span>
                    </Label>
                    </div>
                    {/* <Label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="exchange"
                        value="MCX"
                        // checked={exchange === "MCX"}
                        onChange={(e) => handleSelectIndex(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-lg text-slate-800">MCX</span>
                    </Label> */}
                  </div>
                </div>
              </div>

              {/* Entry Price */}
              

                                          

          
          

              
              
            </div>

            <div className="flex gap-6 w-full items-center justify-evenly">
                <div>
               <div className={`flex flex-col gap-2 w-full items-center ${!isIndexEnabled && !isindexEQ ? "text-gray-400 hidden" : "text-slate-800 flex"}`}>
  <Label className="text-slate-800 text-center">Type</Label>
  <div className="flex gap-4 flex-wrap">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
    <Label className="flex items-center gap-2">
      <input
        type="radio"
        name="type"
        value="FUTSTK"
        checked={instrument === "FUTSTK"}
        
        onChange={(e) => alertsymbol(e.target.value)}
        disabled={!isIndexEnabled} // Disable when `isIndexEnabled` is false
        className="w-4 h-4"
      />
      <span className={`text-lg ${!isIndexEnabled ? "text-gray-400" : "text-slate-800"}`}>
        FUTSTK
      </span>
    </Label>
    <Label className="flex items-center gap-2">
      <input
        type="radio"
        name="type"
        value="FUTIDX"
        checked={instrument === "FUTIDX"}

        onChange={(e) => alertsymbol(e.target.value)}
        disabled={!isIndexEnabled}
        className="w-4 h-4"
      />
      <span className={`text-lg ${!isIndexEnabled ? "text-gray-400" : "text-slate-800"}`}>
        FUTIDX
      </span>
    </Label>
    {/* </div>

      <div className="flex gap-3 flex-wrap items-center"> */}
    <Label className="flex items-center gap-2">
      <input
        type="radio"
        name="type"
        value="OPTIDX"
        checked={instrument === "OPTIDX"}

        onChange={(e) => alertsymbol(e.target.value)}
        disabled={!isIndexEnabled}
        className="w-4 h-4"
      />
      <span className={`text-lg ${!isIndexEnabled ? "text-gray-400 hidden" : "text-slate-800 flex"}`}>
        OPTIDX
      </span>
    </Label>
    <Label className="flex items-center gap-2">
      <input
        type="radio"
        name="type"
        value="OPTSTK"
        checked={instrument === "OPTSTK"}

        onChange={(e) => alertsymbol(e.target.value)}
        disabled={!isIndexEnabled}
        className={"w-4 h-4"}
      />
      <span className={`text-lg ${!isIndexEnabled ? "text-gray-400" : "text-slate-800"}`}>
        OPTSTK
      </span>
    </Label>
    {/* <div> */}
     <Label className="flex items-center gap-2">
      <input
        type="radio"
        name="type"
        checked={instrument === "EQ"}

        value="EQ"
        onChange={(e) => alertsymbol(e.target.value)}
        disabled={!isindexEQ}
        className={"w-4 h-4"}
      />
      <span className={`text-lg ${!isindexEQ ? "text-gray-400" : "text-slate-800"}`}>
        EQ
      </span>
    </Label>
  {/* </div> */}
   
    </div>
    
  </div>
  
</div>
  
  </div>

<div className="flex flex-col gap-2">
  <Label>Buy/Sell</Label>
  <div className="flex gap-6 max-xs:flex-col">
                <Label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="side"
                    value="BUY"
                    checked={side === "BUY"}
                    onChange={(e) => setside(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-lg text-green-600">Buy</span>
                </Label>
                <Label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="side"
                    value="SELL"
                    checked={side === "SELL"}
                    onChange={(e) => setside(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-lg text-red-600">Sell</span>
                </Label>
              </div>
              </div>


              </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              <div className="space-y-2">
                <Label className="text-lg text-slate-800">Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() =>
                      {setQuantity((prev) => Math.max(0, Number(prev) - 1))
                      setdiscolseqty((prev) => Math.max(0, Number(prev) - 1))}
                    } // Convert to number before decrementing
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 flex-shrink-0"
                  >
                    -
                  </Button>
                  {/* Quantity Input */}
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => {setQuantity(Number(e.target.value))
                      setdiscolseqty(Number(e.target.value))
                    } }// Ensure the value is a number
                    placeholder="Enter quantity"
                    className="w-full min-w-24 p-2 border border-gray-300 rounded-md text-center bg-slate-300/65 shadow-md"
                  />
                  {/* Increment Button */}
                  <Button
                    onClick={() => {setQuantity((prev) => Number(prev) + 1)

                       setdiscolseqty((prev) => Number(prev) + 1)}} // Convert to number before incrementing
                    className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 flex-shrink-0"
                  >
                    +
                  </Button>

                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-base sm:text-lg text-slate-800">Disclose Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() =>
                      setdiscolseqty((prev) => Math.max(0, Number(prev) - 1))
                    } // Convert to number before decrementing
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 flex-shrink-0"
                  >
                    -
                  </Button>
                  {/* Quantity Input */}
                  <Input
                    type="number"
                    value={discloseqty}
                    onChange={(e) => setdiscolseqty(Number(e.target.value))} // Ensure the value is a number
                    placeholder="Enter quantity"
                    className="w-full min-w-24 p-2 border border-gray-300 rounded-md text-center bg-slate-300/65 shadow-md"
                  />
                  {/* Increment Button */}
                  <Button
                    onClick={() => setdiscolseqty((prev) => Number(prev) + 1)} // Convert to number before incrementing
                    className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 flex-shrink-0"
                  >
                    +
                  </Button>

                  

                </div>
                  <p className="text-xs text-gray-600">{"Lot size: " + lotsize}</p>
              </div>
                
              <div className="flex flex-col space-y-3">
                <Label className="text-slate-800 text-base">Symbol</Label>
                <Popover open={Comboopen} onOpenChange={setComboOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={Comboopen}
                      className="max-xs:w-full justify-between bg-stone-700 text-white hover:bg-stone-600"
                    >
                      {selectsymbol || "Select Symbol"}
                      {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        onValueChange={handleSearch}
                        placeholder="Search symbol..."
                      />
                      <CommandList>
                        <CommandEmpty>No symbol found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="select-symbol"
                            onChange={(e) => setselectsymbol(e)}
                          >
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
                                  handlesetlotsize(index)
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    selectsymbol === symbol
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                {symbol}
                              </CommandItem>
                            ))
                          ) : (
                            <CommandItem disabled>
                              {loading
                                ? "Loading symbols..."
                                : "No symbols available"}
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-lg text-slate-800">Entry Price</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  className="w-full p-2 border border-gray-300 rounded-md bg-slate-300/65 shadow-md"
                />
              </div>
              

            </div>

            <div className="flex gap-2 w-full ">
              <div className="flex flex-col gap-2 w-full ">
              {/* Product */}
                <Label className="text-lg text-slate-800">Product</Label>
                <div className="flex gap-6 flex-wrap ">
                  <Label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="product"
                      value="INTRADAY"
                      checked={product === "INTRADAY"}
                      onChange={(e) => setProduct(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-lg text-slate-800">MIS</span>
                  </Label>
                  
                    <Label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="product"
                        value="CARRYFORWARD"
                        checked={product === "CARRYFORWARD"}
                        onChange={(e) => setProduct(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-lg text-slate-800">NRML</span>
                    </Label>
                    <Label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="product"
                        value="DELIVERY"
                        checked={product === "DELIVERY"}
                        onChange={(e) => setProduct(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-lg text-slate-800">DELIVERY</span>
                    </Label>
                  
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full ">
                <Label className="text-lg text-slate-800">Order Type</Label>
                <div className="flex gap-6 flex-wrap">
                  <Label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="orderType"
                      value="LIMIT"
                      checked={orderType === "LIMIT"}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-lg text-slate-800">Limit</span>
                  </Label>
                  <Label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="orderType"
                      value="MARKET"
                      checked={orderType === "MARKET"}
                      onChange={(e) => {setOrderType(e.target.value),setPrice(0)}}
                      className="w-4 h-4"
                    />
                    <span className="text-lg text-slate-800">Market</span>
                  </Label>
                </div>
              </div>
            </div>

           
            {/* Place Order Button */}
            <div className="flex gap-4 w-full justify-end">
              <Button
                onClick={handlePlaceOrder}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
              >
                Submit
              </Button>
              <Button className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      
     
        </div>
      
    </>
  );
};

export default OrderPunch;