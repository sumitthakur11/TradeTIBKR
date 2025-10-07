import { Host_Ip } from "./Host";
export const Specificdelete = (All,item,blockid, deleteFunction) => {

  if (All){
    let totalLength=0
    item.forEach(keys => {
      if (keys.orderdata) {
        totalLength += keys.orderdata.length;
      }
    });
    if (totalLength<1){
    deleteFunction(0);}
    else {
      alert("Please exit the open position to delete block ");

    }
    console.log('you are all delete')
    return;

  }
  else if (item === 0 && !All) {
    console.log('you are not all delete')
   
    deleteFunction(blockid);
    return;
  }
  else {
    alert("Please exit the open position to delete block ");
    
    
  }
}


export const handleexchangerequest = async (type, payload, endpoint,okalert) => {


  const sdd = localStorage.getItem("token");
  const csrf = localStorage.getItem("csrf");

  console.log(payload)
  try {
    const t = "token " + sdd;

    if (type === "POST") {
      const response = await fetch(Host_Ip+ endpoint, {
        method: type,
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken':csrf,

          Authorization: t,
        },
        body: payload,
      });
      if (!response.ok) {
        alert('something went wrong')

        throw new Error("Login failed");
      }
      const datastr = await response.json();
if (okalert){
        alert('sucessful')
      }
      return datastr.message
      console.log(datastr);
      
    }
    if (type === "PUT") {
      const response = await fetch(Host_Ip + endpoint, {
        method: type,
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken':csrf,

          Authorization: t,
        },
        body: payload,
      });
      if (!response.ok) {
        alert('something went wrong')

        throw new Error("Login failed");
      }
      const datastr = await response.json();
      if (okalert){
        alert('sucessful')
      }
      return datastr.message

      console.log(data);

    }

    if (type === "GET" ) {
      const response = await fetch(
        Host_Ip + endpoint +"?"+ payload,
        {
          method: type,
          headers: {  
            "Content-Type": "application/json",
          'X-CSRFToken':csrf,

            Authorization: t,
          },
        }
      );
      if (!response.ok) {
        alert('something went wrong')

        throw new Error("Login failed");
      }
      const datastr = await response.json();
if (okalert){
        alert('sucessful')
      }
      return  datastr.message

      
    }


    if (type === "DELETE" ) {
      const response = await fetch(
        Host_Ip + endpoint +"?"+ payload,
        {
          method: type,
          headers: {  
            "Content-Type": "application/json",
          'X-CSRFToken':csrf,

            Authorization: t,
          },
        }
      );
      if (!response.ok) {
        alert('something went wrong')

        throw new Error("Login failed");
      }
      const datastr = await response.json();
if (okalert){
        alert('sucessful')
      }
      return  datastr.message

      
    }
    // if (!response.ok) {
    //   throw new Error('Login failed');
    // }
    // const data = await response.json()
  } catch (error) {
    console.error("INIT error:", error);
    return  false

  }

  // Reset the form after submission
};



