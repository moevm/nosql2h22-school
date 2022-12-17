import React from 'react';

import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route,Routes } from "react-router-dom";
import Test from './components/Test/Test.js'
import Login from './components/Login/Login.js'

function setToken(token) {
  sessionStorage.setItem('token', JSON.stringify(token));
}
function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

function App() {
  const token = getToken();
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
