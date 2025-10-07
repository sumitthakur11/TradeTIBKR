

import React, { useState, useEffect } from "react";
import {handleexchangerequest}  from '../utility/Api'
import { Type } from "lucide-react";
import { useSearchParams } from "react-router-dom";
const Stoxkartred = () => {
  
    const [searchParams] = useSearchParams();
    useEffect(() => {
                            handlelogin()

    // const code = searchParams.get("status");
    //                 if (code=='success') {

    //                 }


                    },[])
                    
 

    const handlelogin = async () => {
        try{

    
        
        const accesstoken = searchParams.get("request_token");
        console.log(accesstoken)
        const brokerid=localStorage.getItem("brokerid")
        const payload = JSON.stringify({brokerid,accesstoken });
        const type = "POST"
        const endpoint= "loginredirect"
        handleexchangerequest(type, payload, endpoint,true)
    .then(response => {
      // localStorage.clear('brokerid')
    console.log(response)
    // window.close()
    })
}
    catch{
    alert('something went wrong try again')

}
    
  }


  
  

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md max-w-7xl">
      <p>
        SUBMITED 
      </p>
    </div>
  );
};

export default Stoxkartred;
