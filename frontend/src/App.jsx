import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import LoginPage from './components/login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';

import OrderStatus from './components/OrderStatus'; // New Component
import OrderPunch from './components/OrderPunch'; // New Component
import AddBroker from './components/AddBroker';
import ViewBroker from './components/ViewBroker';
import Marketwatch from './components/Marketwatch';
import Angel from './components/Angelbroker';
import Funds from './components/Funds';
import Holdings from './components/Holdings';
import NetPosition from './components/NetPosition';
import Dhan from './components/Dhan';
import Motilal from './components/Motilal';
import Groww from './components/Grow';
import Fyers from './components/Fyers';
import Fyersredirect from './components/Fyresredirect';
import Upstox from './components/upstox';
import Upstoxedirect from './components/upstoxredirect';
import Aliceblue from './components/Aliceblue';
import Zerodha from './components/Zerodha';
import Zerodhared from './components/zerodharedirect';
import Stoxkart from './components/stoxkart';
import Stoxkartred from './components/stoxkartredirect';
import Flattrade from './components/flattrade';
import Flattradered from './components/flattraderedirect';
import HDFC from './components/hdfc';
import SAMCO from './components/samco';
import Hdfcred from './components/hdfcredirect';
import Anandrathi from './components/anandrathi';

function App() {
  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
      
          <Route element={<Layout />}>
            <Route path="/home" element={<Marketwatch />} />
            
            {/* Add more protected routes here */}

            <Route path="/Instrument" element={<Dashboard />} />
            
              <Route path="/OrderStatus" element={<OrderStatus />} />
              <Route path="/OrderPunch" element={<OrderPunch />} />
              <Route path="/Funds" element={<Funds />} />
              <Route path="/NetPosition" element={<NetPosition />} />
              <Route path="/Holdings" element={<Holdings />} />
              
            
            {/* <Route path="/Settings" element={<AddBroker />} /> */}
            <Route path="/ViewBroker" element={<ViewBroker defaultBrokerName="Shoonya" />} />
            <Route path="/ViewAngel" element={<Angel />} />
            <Route path="/Viewdhan" element={<Dhan />} />
            <Route path="/Viewmotilal" element={<Motilal />} />
            <Route path="/Viewgroww" element={<Groww />} />
            <Route path="/Viewfyers" element={<Fyers />} />
            <Route path="/fyerstoken" element={<Fyersredirect />} />
            <Route path="/Upstox" element={<Upstox />} />
            <Route path="/upstoxtoken" element={<Upstoxedirect />} />
            <Route path="/Alice" element={<Aliceblue />} />
            <Route path="/Zerodha1" element={<Zerodha />} />
            <Route path="/ZERODHA" element={<Zerodhared />} />
            <Route path="/Stoxkart1" element={<Stoxkart />} />
            <Route path="/STOXKART" element={<Stoxkartred />} />

            <Route path="/Flattrade1" element={<Flattrade />} />
            <Route path="/Flattrade" element={<Flattradered />} />
            <Route path="/hdfc1" element={<HDFC />} />
            <Route path="/samco1" element={<SAMCO />} />
            <Route path="/HDFC" element={<Hdfcred />} />
            <Route path="/Anandrathi" element={<Anandrathi />} />















          </Route>
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;