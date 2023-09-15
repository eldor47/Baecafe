import "./App.css";
import Home from "./components/Home";
import Gallery  from "./components/Gallery";
import Stake  from "./components/Stake";
import Vault  from "./components/Vault";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';

import { ethers } from "ethers";
import { useState, useEffect, useRef } from "react";

import React from 'react';
import Marketplace from "./components/Marketplace";
import Mint from "./components/Mint";
import BaeBox from "./components/BaeBox";


function App() {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [contracts, setContracts] = useState([]);

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setSigner(signer);
      setAccount(accounts[0]);
    } else {
      console.log("Please install metamask.");
    }
  };

  useEffect(() => {
    connect();
    if(window.ethereum) {
      window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        setAccount(accounts[0])
      })
    }
  }, []);
  
  return (
    <Router>
      <Header connect={connect} account={account} />
       <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery/>} />
          <Route path="/stake" element={<Stake account={account} contracts={contracts}/>} />
          <Route path="/marketplace" element={<Marketplace account={account} contracts={contracts}/>} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/mint" element={<Mint account={account}/>} />
          <Route path="/baebox" element={<BaeBox account={account}/>} />
        </Routes>
    </Router>
  );
}
export default App;
