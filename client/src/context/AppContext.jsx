import axios from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

   axios.defaults.withCredentials = true

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setisLoggedin] = useState(false);
  const [userData, setuserData] = useState(false);


  const getAuthState = async()=>{
    try {
      const {data} =await axios.get(backend_url+'/api/auth/is-auth')
      if(data.success){
        setisLoggedin(true)
        getUserData()
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const getUserData = async () => {
    try {

      const { data } = await axios.get(
        backend_url + '/api/user/data',
      );

      console.log(data)

      if (data.success) {
        setuserData(data.userData);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message || "Failed to fetch user data");
    }
  };

  useEffect(()=>{
    getAuthState()
  },[])




  const value = {
    backend_url,
    isLoggedin,
    setisLoggedin,
    userData,
    setuserData,
    getUserData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
