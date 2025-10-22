import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { BsBoxSeamFill } from 'react-icons/bs';
import { CiDeliveryTruck } from 'react-icons/ci';
import { IoIosLogOut } from 'react-icons/io';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Menu } from 'lucide-react';
import { useNavigate } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"


const NavLink = ({ to, icon: Icon, children, isActive, onClick }) => (
  <Link to={to} onClick={onClick} className="w-full">
    <div
      className={`hover:text-slate-800 cursor-pointer flex items-center gap-3 duration-500 p-2 rounded-md ${
        isActive ? 'bg-violet-600/20 text-gray-800' : ''
      }`}
    >
      {Icon && <Icon className="size-5" />}
      <span className="md:inline">{children}</span>
    </div>
  </Link>
);

const NavContent = ({ className = '' }) => {
  const [activeLink, setActiveLink] = useState('/home');
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const [showDropdown2, setShowDropdown2] = useState(false); // State for dropdown visibility
  const [showDropdown3, setShowDropdown3] = useState(false); // State for dropdown visibility
  const location = useLocation();

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setShowDropdown(false); // Close dropdown when navigating
    setShowDropdown2(false); 
  };

  return (
    <div className={`flex flex-col items-center gap-9 text-gray-800 text-base p-4 ${className}`}>
      <Link to="/">
        <img
          src="https://www.visualcinnamon.com/img/site/visual_cinnamon_logo_512.png"
          alt=""
          className="w-12"
        />
      </Link>
      <div className="w-full h-[2px] bg-[var(--color-border-subtle,#303034)]" />
      

      <div
        className={`hover:text-slate-800 cursor-pointer flex flex-col gap-2 duration-500 p-2 rounded-md w-full text-gray-800 ${
          location.pathname.startsWith('/') ? 'bg-transparent text-gray-800 hover:text-gray-700' : ''
        }`}
      >
        <div
          className="flex items-center gap-3 cursor-pointer w-full"
          onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown visibility
        >
          <BsBoxSeamFill className="size-5" />
          <span className="md:inline">Order Punch Tool</span>
        </div>
        {showDropdown && (
          <div className="pl-8 flex flex-col gap-2">
            <NavLink
              to="/OrderPunch"
              isActive={location.pathname === '/OrderPunch'}
              onClick={() => handleLinkClick('/OrderPunch')}
            >
              Order Punch
            </NavLink>
            <NavLink
              to="/OrderStatus"
              isActive={location.pathname === '/OrderStatus'}
              onClick={() => handleLinkClick('/OrderStatus')}
            >
              Order Status
            </NavLink>
            {/* <NavLink
              to="/Funds"
              isActive={location.pathname === '/Funds'}
              onClick={() => handleLinkClick('/Funds')}
            >
              Funds
            </NavLink> */}
            <NavLink
              to="/OrderRequest"
              isActive={location.pathname === '/OrderRequest'}
              onClick={() => handleLinkClick('/OrderRequest')}
            >
              Order Request
            </NavLink>
            <NavLink
              to="/NetPosition"
              isActive={location.pathname === '/NetPosition'}
              onClick={() => handleLinkClick('/NetPosition')}
            >
              Net Position
            </NavLink>
            <NavLink
              to="/Holdings"
              isActive={location.pathname === '/Holdings'}
              onClick={() => handleLinkClick('/Holdings')}
            >
              Holdings
            </NavLink>
            {/* <NavLink
              to="/Logs"
              isActive={location.pathname === '/Logs'}
              onClick={() => handleLinkClick('/Logs')}
            >
              Logs
            </NavLink> */}
            
          </div>
        )}
      </div>
       <div
        className={`hover:text-slate-800 cursor-pointer flex flex-col gap-2 duration-500 p-2 rounded-md w-full text-slate-800 ${
          location.pathname.startsWith('/') ? 'bg-transparent hover:text-gray-700 text-gray-800' : ''
        }`}
      >
        <div
          className="flex items-center gap-3 cursor-pointer w-full"
          onClick={() => setShowDropdown2(!showDropdown2)} // Toggle dropdown visibility
        >
          <BsBoxSeamFill className="size-5" />
          <span className="md:inline">Broker</span>
        </div>
        {showDropdown2 && (
        <div className='h-72 overflow-y-scroll scrollbar-hide'>
          <div className="pl-8 flex flex-col gap-2">
         
             <NavLink
              to="/ViewIBKR"
              isActive={location.pathname === '/ViewIBKR'}
              onClick={() => handleLinkClick('/ViewIBKR')}
            >
              IBKR
            </NavLink>
            
             

            


            
            
            
          </div>
      </div>
        )}
      </div>
      {/* <NavLink
        to="/Instrument"
        icon={CiDeliveryTruck}
        isActive={activeLink === '/Instrument'}
        onClick={() => handleLinkClick('/Instrument')}
        className="text-slate-800 hover:text-gray-700"
      >Instrument</NavLink> */}
    </div>
  );
};

const ColNav = () => {
    const navigate = useNavigate();

  const handlelogout=()=>{  

        localStorage.clear()
        navigate('/')
      


  }
  return (
    <div className="flex">
      {/* Desktop Navigation */}
      <div className="hidden tablet-md:flex flex-col justify-between h-screen w-16 md:w-60 overflow-y-scroll scrollbar-hide ">
        <NavContent />
        <div className="flex flex-col md:flex-row justify-evenly text-slate-800 p-7 gap-4 items-center">
          <IoIosLogOut className="size-7 cursor-pointer text-black hover:text-slate-800 duration-500" />
          <Button  onClick={()=>handlelogout()}className="hidden md:flex text-lg text-black bg-green-600/90 hover:text-slate-800 cursor-pointer items-center gap-3 duration-500">
            LogOut
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="tablet-md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-black text-gray-800">
          <NavContent className="w-full" />
          <div className="flex justify-center mt-8">
            <Button className="text-lg hover:text-cyan-500 cursor-pointer flex items-center gap-3 duration-500">
              LogOut
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ColNav;