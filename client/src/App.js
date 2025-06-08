

import { useState } from "react";
import Router from "./Router";
import { AdminContextProvider } from "./context/AdminContext";
import { AuthContextProvider } from "./context/AuthContext";
import { useEffect } from "react";
import axios from './axios'

axios.defaults.withCredentials = true

function App() {

  const [serverError, setServerError] = useState(false)
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/user/`)
      .catch(err => {
        console.log("server is down: ", err.message)
        setServerError(true)
      })
  })
  if(serverError) {
    return (<h1>Server Down</h1>)
  }
  return (
   <>
        <AuthContextProvider>
          <AdminContextProvider>
            <Router />
          </AdminContextProvider>           
        </AuthContextProvider>
    
    </>
   
  );
}

export default App;
