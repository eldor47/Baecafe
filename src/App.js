import "./App.css";
import Home from "./components/Home";
import Gallery  from "./components/Gallery";
import Stake  from "./components/Stake";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header'

import { ethers } from "ethers";
import { useState, useEffect } from "react";
import erc721Abi from "./abi/erc721.json";
import erc721aAbi from "./abi/erc721a.json";

import React from 'react';
import Marketplace from "./components/Marketplace";
import Mint from "./components/Mint";

const contractInfo = [
  {address: '0x951e4297561e9abef6e5b4b2f78696ed8c552fd0', name: 'Bae Cafe', type: 'erc721'},
  {address: '0x71663f5fb424e2e9e2c82d86f207d50c8ba481c6', name: 'MekaBae', type: 'erc721a'}
]
function App() {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [contracts, setContracts] = useState([]);

  const balance = async (tokenAddress) => {
    const contract = new ethers.Contract(tokenAddress, erc721Abi, signer);
    const balance = await contract.balanceOf(account);
    console.log(balance.toString());
  };

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setSigner(signer);
      setAccount(accounts[0]);

      var c = []
      for(var contract of contractInfo) {
        if(contract.type === 'erc721')
          c.push(new ethers.Contract(contract.address, erc721Abi, signer))
        if(contract.type === 'erc721a') 
          c.push(new ethers.Contract(contract.address, erc721aAbi, signer))
      }
      setContracts(c)
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
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/stake" element={<Stake account={account} contracts={contracts}/>} />
          <Route path="/marketplace" element={<Marketplace account={account} contracts={contracts}/>} />
          <Route path="/mint" element={<Mint account={account}/>} />
        </Routes>
    </Router>
  );
}
export default App;
