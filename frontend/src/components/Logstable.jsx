import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button } from '../components/ui/button';
import { handleexchangerequest } from '../utility/Api';
import { RefreshCcw } from 'lucide-react';

import { DownloadCSVFromJSON } from '../utility/downloadcsv';
const Logs = () => {
  const [loading, setLoading] = useState(false);
  const [tableDatafetch, setTableDatafetch] = useState([]);
  const [filtereddata, setfiltereddata] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const paginationModel = { page: 0, pageSize: 10 };

  // Fetch table data
  const fetchTableData = async () => {
    setLoading(true);
    try {
      const type = 'GET';
      const endpoint = 'getlogs'; // Replace with your API endpoint
      const payload = 'type=all'; // Example payload
      const response = await handleexchangerequest(type, payload, endpoint, false);
      if (response) {
        console.log('API Response:', response);
        setTableDatafetch(response);
      } else {
        console.error('Failed to fetch table data');
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process data and add unique IDs
  useEffect(() => {
    fetchTableData();
  }, []);

  useEffect(() => {
    const dataWithIds = tableDatafetch.map((item, index) => ({
      ...item,
      id: index, // Add a unique id based on the index
    }));
    setfiltereddata(dataWithIds);
    console.log('Processed Data:', dataWithIds);
  }, [tableDatafetch]);

  // Handle row deletion
  const handleDelete = () => {
    const updatedData = filtereddata.filter((row) => !selectedRows.includes(row.id));
    setfiltereddata(updatedData);
    setSelectedRows([]); // Clear the selection
  };

  return (
    <>
      <h1 className="text-2xl">Logs</h1>
      <div className="container flex items-end gap-2 flex-col mx-auto  mt-6 p-6 bg-transparent rounded-lg max-w-6xl " >
      <RefreshCcw className="text-black cursor-pointer" onClick={fetchTableData} />
       <Button color="primary" className="p-3 bg-cyan-700/85" onClick = {() => DownloadCSVFromJSON(filtereddata,'Logs.csv')}>
                Download
              </Button>
      
        <Paper sx={{ height: "100%", width: '100%' }}>
          <DataGrid
            className="text-black overflow-x-scroll scrollbar-hide font-bold"
            rows={filtereddata}
            getRowId={(row) => row.id}
            disableSelectionOnClick
            columns={[
              ...Object.keys(filtereddata[0] || {}).map((key) => ({
                field: key,
                headerName: key.charAt(0).toUpperCase() + key.slice(1),
                width: 250,
              })),
              
            ]}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[10, 20,50]}
            checkboxSelection
            onRowSelectionModelChange={(ids) => {
              console.log('Selected IDs:', ids);
              setSelectedRows(ids);
            }}
sx={{ border: 0 , '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' }}}          />
        </Paper>
      </div>
    </>
  );
};

export default Logs;