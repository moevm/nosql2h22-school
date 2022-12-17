import React, { useState } from 'react';

import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Test from './components/Test/Test.js'
import Login from './components/Login/Login.js'
import useToken from './components/Login/useToken';
import Admin from './components/Admin/Admin'


function App() {
  const { token, setToken } = useToken();
  console.log(token)
  if(!token) {
    return <Login setToken={setToken} />
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Test />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
