import React, { useState } from 'react';

import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route,Routes } from "react-router-dom";
import Test from './components/Test/Test.js'
import Login from './components/Login/Login.js'

function App() {
  const [token, setToken] = useState();
  if(!token) {
    return <Login setToken={setToken} />
  }
  return (
    <BrowserRouter>
  <Routes>
    <Route path='/' element={<Test />}/>
    <Route path='/test' element={<Test/>}/>
  </Routes>
  </BrowserRouter>
  );
}

export default App;
