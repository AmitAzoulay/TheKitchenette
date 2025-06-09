import React, { useContext } from 'react'
import Register from "./components/auth/Register";
import Login from "./components/auth/Login"
import Chat from "./components/chat/Chat"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import Admin from './components/admin/Admin';
import NavbarHeader from './components/layout/Navbar';
import AdminContext from './context/AdminContext';

const Router = () => {

  const { loggedIn } = useContext(AuthContext)
  const {isAdmin} = useContext(AdminContext)
  
  return (
    <BrowserRouter>
      <NavbarHeader></NavbarHeader>
      <Routes>
        <Route>
          {
            loggedIn === false && <>
              <Route path="/register" element={<Register></Register>} />
              <Route path="/" element={<Login></Login>} />
              <Route path="/chat" element={<Chat></Chat>} />
            </>
          }
          {
            loggedIn === true && <>
              <Route path="/register" element={<Register></Register>} />
              <Route path="/" element={<Login></Login>} />
              <Route path="/chat" element={<Chat></Chat>} />
            </>
          }
          {
            isAdmin === true && <>
              <Route path="/admin" element={<Admin></Admin>} />
            </>
          }

          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
