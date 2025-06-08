import React, { createContext, useEffect, useState } from 'react'
import instance from '../axios'

const AdminContext = createContext()


const AdminContextProvider = (props) => {
    const [isAdmin, setIsAdmin] = useState(undefined)

     async function getIsAdmin(props) {
        try {
            const isAdminRes = await instance.get(`${process.env.REACT_APP_SERVER_URL}/user/isAdmin`,{withCredentials: true})
            setIsAdmin(isAdminRes.data)
        } catch (err) {
            console.log("Internal error, serve might be down")
        }
        
    }
    useEffect(() => {
        getIsAdmin()
    },[])

    return (
         <AdminContext.Provider value={{isAdmin,getIsAdmin}}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContext
export {AdminContextProvider}
