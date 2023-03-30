import "../styles/BaeBox.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import pixelbaesabi from "../abi/pixelbaes.json";

import { ethers } from "ethers";

const signMessage = async ({ setError, message }) => {
  try {
    console.log({ message });
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    return {
      message,
      signature,
      address
    };
  } catch (err) {
    setError(err.message);
    console.log(err)
  }
};

function BaeBox({ account }) {

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = useState('');

  const [contract, setContract] = useState(null);

  const [status, setStatus] = useState('');
  const [price, setPrice] = useState(0.106);


  useEffect(() => {
    if(contract !== null) {
        // Grab contract states
        setIsLoading(false)
    }
  }, [contract])

  // useEffect(() => {
  //   if(mintInfo) {
  //     mintPresale()
  //   }
  // }, [mintInfo])

  useEffect(() => {
    connect()
  }, [account])

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        var chain = await getChain(provider)
        var envChain = parseInt(process.env.REACT_APP_NETWORK_ID)
        if(chain !== envChain) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(envChain) }]
          });
        }
        provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
  
        setContract(new ethers.Contract(process.env.REACT_APP_PIXEL_CONTRACT, pixelbaesabi, signer))
        console.log('here')
        setError('')
      } catch (e) {
        console.log(e)
        if(e.message.includes('wallet_switchEthereumChain')) {
          setError('Please switch to ETH mainnet.')
        } else {
          setError('Please connect MetaMask to continue.')
        }
      }
    } else {
      setError("Please install metamask.");
    }
  };

  async function getChain(_provider) {
    let chainId = await _provider.getNetwork()
    return chainId.chainId
  }

  return (
    <div>
      {isLoading ? (
        <div className="loadingView">
          <Loading></Loading>
          <p className="error">{error}</p>
          <p className="status">{status}</p>
        </div>
      ) : (
        <div>
          <div className="baebox-overlay"></div>
	  	<div className="baebox-modal clearfix">
	  		<span className="close-baebox-modal"></span>
	  		<div className="owned-boxes clearfix">
	  			<h3>Open Baebox</h3>
	  			<div className="list-of-boxes clearfix">
	  				<div className="baebox-single">
		  				<span className="baebox-title tier-cup-one">Baebox #123</span>
		  				<span className="select-baebox">select</span>
		  			</div>
		  			<div className="baebox-single">
		  				<span className="baebox-title tier-cup-one">Baebox #124</span>
		  				<span className="select-baebox">select</span>
		  			</div>
		  			<div className="baebox-single">
		  				<span className="baebox-title tier-cup-two">Baebox #125</span>
		  				<span className="select-baebox">select</span>
		  			</div>
		  			<div className="baebox-single selected">
		  				<span className="baebox-title tier-cup-one">Baebox #129</span>
		  				<span className="select-baebox">selected</span>
		  			</div>
		  			<div className="baebox-single">
		  				<span className="baebox-title tier-cup-three">Baebox #1509</span>
		  				<span className="select-baebox">select</span>
		  			</div>
	  			</div>
	  			
	  		</div>
	  		<div className="view-baebox-contents">
	  			<div className="closed-box-NFT"></div>
	  			<a className="burn-open-baebox">Burn to Open</a>
	  		</div>
	  	</div>
	  	<div className="page baebox clearfix">

	  		<div className="left clearfix">
		  		<h1>Bae<span className="blue">Box</span></h1>
		  		<span className="by">by BaeCafe</span>	
	  		</div>

	  		<div className="right clearfix">

	  			<div className="info">
	  				<h2>Acquire <span className="i"></span></h2>
	  				<p>After you have acquired your BAEBOX, click <span>OPEN BAEBOX</span> to burn the box, reveal what’s inside, and claim the contents secured within it. <br></br>Good luck!</p>
	  			</div>

	  			<div className="tier one">
	  				<h3>Tier 1 <span>BaeBox</span></h3>
	  				<div className="tier-content clearfix">
	  					<span className="what-inside">What's inside:</span>
		  				<div className="img-roller-container">
		  					<div className="img-roller s3-roller"><span className="qmark"><span className="blue-cover-fade"></span></span></div>
		  					<span className="item-title">S3</span>	
		  					<span className="item-qty">x1</span>	
		  				</div>
		  				<div className="img-roller-container">
		  					<div className="img-roller pixelbae-roller"><span className="qmark"><span className="blue-cover-fade"></span></span></div>
		  					<span className="item-title">pixelbae</span>	
		  					<span className="item-qty">x2</span>	
		  				</div>
		  				<div className="bae-bonus">
		  					<h3>$BAE Bonus</h3>
		  					<span>Up to <span className="bae-q">1000</span> $BAE</span>
		  				</div>
		  				<span className="price">.05 ETH</span>
		  				<a className="acquire" href="#">Acquire</a>
	  				</div>
	  				
	  			</div>

	  			<div className="tier two">
	  				<h3>Tier 2 <span>BaeBox</span></h3>
	  				<div className="tier-content clearfix">
		  				<span className="what-inside">What's inside:</span>
		  				<div className="img-roller-container">
		  					<div className="img-roller s1-roller"><span className="qmark"><span className="blue-cover-fade"></span></span></div>
		  					<span className="item-title">S1</span>	
		  					<span className="item-qty">x1</span>	
		  				</div>
		  				<div className="img-roller-container">
		  					<div className="img-roller s2-roller"><span className="qmark"><span className="blue-cover-fade"></span></span></div>
		  					<span className="item-title">S2</span>	
		  					<span className="item-qty">x1</span>	
		  				</div>
		  				<div className="img-roller-container">
		  					<div className="img-roller pixelbae-roller"><span className="qmark"><span className="blue-cover-fade"></span></span></div>
		  					<span className="item-title">pixelbae</span>	
		  					<span className="item-qty">x3</span>	
		  				</div>
		  				<div className="bae-bonus">
		  					<h3>$BAE Bonus</h3>
		  					<span>Up to <span className="bae-q">3000</span> $BAE</span>
		  				</div>
		  				<span className="price">.05 ETH</span>
		  				<a className="acquire" href="#">Acquire</a>
		  			</div>
	  			</div>

	  			<div className="tier three">
	  				<h3>Tier 3 <span>BaeBox</span></h3>
	  				<div className="tier-content clearfix">
		  				<span className="what-inside">What's inside:</span>
		  				<div className="img-roller-container">
		  					<div className="img-roller s1-roller"><span className="qmark"><span className="blue-cover-fade"></span></span></div>
		  					<span className="item-title">S1</span>	
		  					<span className="item-qty">x1</span>	
		  				</div>
		  				<div className="img-roller-container">
		  					<div className="img-roller s2-roller"><span className="qmark"><span className="blue-cover-fade"></span></span></div>
		  					<span className="item-title">S2</span>	
		  					<span className="item-qty">x1</span>	
		  				</div>
		  				<div className="img-roller-container">
		  					<div className="img-roller s3-roller"><span className="qmark"><span className="blue-cover-fade"></span></span></div>
		  					<span className="item-title">S3</span>	
		  					<span className="item-qty">x1</span>	
		  				</div>
		  				<div className="img-roller-container">
		  					<div className="img-roller pixelbae-roller"><span className="qmark"><span className="blue-cover-fade"></span></span></div>
		  					<span className="item-title">pixelbae</span>	
		  					<span className="item-qty">x5</span>	
		  				</div>
		  				<div className="bae-bonus">
		  					<h3>$BAE Bonus</h3>
		  					<span>Up to <span className="bae-q">5000</span> $BAE</span>
		  				</div>
		  				<span className="price">.05 ETH</span>
		  				<a className="acquire" href="#">Acquire</a>
		  			</div>
	  			</div>

	  			<div className="bottom clearfix">
		  			<div className="left">
		  				<p>All tiers include a randomized chance for a voucher allowing you to claim a derivative version of one of your NFTs. The derivative will be made by Sawa, Ruri, or a special guest Bae Artist.</p>
		  			</div>
		  			<div className="right">
		  				<div className="holding-info">
			  				<span className="you-have">You currently have:</span>
			  				<span className="held-q">3 BaeBoxes</span>
		  				</div>
		  				<a className="open-baebox" href="#">Open BaeBox</a>
		  			</div>	
		  		</div>
	  		</div>

	  		

	  	</div>
        
        </div>
      )}
    </div>
  );
}

export default BaeBox;
