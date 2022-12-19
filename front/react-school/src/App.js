import React, { useState } from 'react';

import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from './components/Main/Main.js'
import Login from './components/Login/Login.js'
import useToken from './components/Login/useToken';
import Admin from './components/Admin/Admin'
import Users from "./components/Pages/Users";


function App() {
  const { token, setToken } = useToken();
  if(!token) {
    return <Login setToken={setToken} />
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/users' element={<Users />} />
        <Route path='/classes' element={<Admin />} />
        <Route path='/schedule' element={<Admin />} />
        <Route path='/subjects' element={<Admin />} />
        <Route path='/journal' element={<Admin />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
