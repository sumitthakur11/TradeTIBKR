import React, { useEffect, useState } from 'react';
import { Outlet,useNavigate } from 'react-router-dom';
import ColNav from './ColNav';
import { handleauth } from './auth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"



import { handleexchangerequest } from '../utility/Api';
import { RefreshCcw } from 'lucide-react';
const Layout = () => {


  const dummyLogs = [
  { id: 1, message: 'User logged in successfully', timestamp: '2025-05-13 19:45:32' },
  { id: 2, message: 'API request failed: Invalid token', timestamp: '2025-05-13 19:46:10' },
  { id: 3, message: 'Database connection established', timestamp: '2025-05-13 19:46:45' },
  { id: 3, message: 'Database connection established', timestamp: '2025-05-13 19:46:45' },
  { id: 3, message: 'Database connection established', timestamp: '2025-05-13 19:46:45' },
  { id: 3, message: 'Database connection established', timestamp: '2025-05-13 19:46:45' },
  { id: 3, message: 'Database connection established', timestamp: '2025-05-13 19:46:45' },



 
];

const navigate= useNavigate()


const [data,setdata]= useState([])
const [loading,setLoading]= useState([])

const fetchlogsdata = async () => {
    setLoading(true);
    try {
      const type = "GET";
      const endpoint = "sendlog"; // Replace with your API endpoint
      const payload = ""     
      const response = await handleexchangerequest(type, payload, endpoint, false);
      if (response) {
        setdata(response);
        console.log(response,'response')
      } else {
        console.error("Failed to fetch table data");
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      setLoading(false);
    }
  };

      useEffect( ()=>{
        

        fetchlogsdata()
      
      },[])



     const isAuthExpired = handleauth();
  console.log(isAuthExpired,'checktimestamp')

  {if (isAuthExpired) (
    navigate('/')
  )}
 




  return (
    <div className="bg-blue-300/15 text-black h-screen w-screen overflow-hidden flex flex-row">
      {/* Fixed Navigation Bar */}
      <ColNav />
      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        <div className="flex flex-col flex-1 h-screen py-6 max-xs:pt-14 overflow-auto">
          <Outlet />
        </div>
<Accordion type="single" collapsible className='bg-gray-300 rounded-md '>
  <AccordionItem value="item-1">
    <AccordionTrigger className=" text-black px-3">SYSTEM LOGS (Click here)</AccordionTrigger>
    <AccordionContent className=" text-black px-3 overflow-scroll h-44 scrollbar-hide">
      <RefreshCcw onClick={fetchlogsdata} className='cursor-pointer text-black hover:text-slate-800 duration-500' />
      <ul >
        {data.map((log,index) => (
          <li className=' text-wrap break-words w-4/5' key={index}>{log}</li> // Adjust based on your data structure
        ))}
      </ul>
    </AccordionContent>
  </AccordionItem>
</Accordion>
      </div>
    </div>
  );
};

export default Layout;