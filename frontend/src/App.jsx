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
import Angel from './components/Angelbroker';
import Funds from './components/Funds';
import Holdings from './components/Holdings';
import NetPosition from './components/NetPosition';


function App() {
  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
      
          <Route element={<Layout />}>
            
            
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
    















          </Route>
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;