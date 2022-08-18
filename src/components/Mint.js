import "../styles/Mint.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import Timer from "./Timer";
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

function Mint({ account }) {

  const [isLoading, setIsLoading] = React.useState(true);
  const [signature, setSignature] = useState([]);
  const [error, setError] = useState('');

  const [contract, setContract] = useState(null);

  const [status, setStatus] = useState('');
  const [supply, setSupply] = useState({maxSupply: 10000, totalSupply: 0})
  const [pausedStates, setPausedStates] = useState({public: true, presale: true})
  const [mintInfo, setMintInfo] = useState(null)

  useEffect(() => {
    setIsLoading(true)
  }, [])

  useEffect(() => {
    if(contract !== null) {
      try {
        getMintedNum().then(data => {
          setSupply(data)
          getPausedStates().then(data => {
            setPausedStates(data)
            setIsLoading(false)
            if(data.presale === true && data.public === true) {
              setStatus('Sale is not live yet. Please be patient')
            }
          })
        })
      } catch(e) {
        console.log(e)
      }
    }
  }, [contract])

  useEffect(() => {
    if(mintInfo) {
      mintPresale()
    }
  }, [mintInfo])

  useEffect(() => {
    connect()
  }, [account])

  const getMintedNum = async () => {
    const maxSupply = await contract.maxSupply()
    const totalSupply = await contract.totalSupply()

    return {
      maxSupply: maxSupply.toNumber(),
      totalSupply: totalSupply.toNumber()
    }
  };

  const getPausedStates = async () => {
    const publicSale = await contract.paused()
    const presale = await contract.presalePaused()


    console.log(publicSale)
    return {
      public: publicSale,
      presale: presale
    }
  };

  const mintPresale = async() => {
    if(mintInfo) {
      try {
        var mintTx;
        if(mintInfo.holder) {
          mintTx = await contract.mintPresale(mintInfo.merkleProof)
        }
        if(mintInfo.whitelist) {
          mintTx = await contract.mintPresale(mintInfo.merkleProof)
        }
        
        setStatus('Your tokens are on the way!')
        await mintTx.wait()
        setStatus('Tokens successfully minted. Public sale coming soon.')
        var totals = await getMintedNum()
        setSupply(totals)
      } catch (e) {
        setStatus('')
        setError(e.message)
        if(e.message.includes('estimate gas')){
          setStatus('')
          setError('You have already minted!')
        }
      }
    }
  }

  const mintPublic = async() => {
    try {
      var mintTx = await contract.mint()
      
      setStatus('Your token is on the way!')
      await mintTx.wait()
      setStatus('Tokens successfully minted. Reveal coming soon.')
      var totals = await getMintedNum()
      setSupply(totals)
    } catch (e) {
      setStatus('')
      setError(e.message)
      if(e.message.includes('estimate gas')){
        setStatus('')
        setError('You have already minted!')
      }
    }
  }

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

  const handleSign = async (e) => {
    setError();
    setStatus('Please sign to verify holder / whitelist status')
    const sig = await signMessage({
      setError,
      message: 'Verifying whitelist / holder status'
    });
    setStatus('')
    if (sig) {
      setSignature(sig);
    }
    console.log(sig)

    // Send to backend to then verify, get WL and 
    let url = process.env.REACT_APP_BASE_URI + '/mintstatus';
    axios.post(url, {sig: sig}).then((response) => {
      console.log(response.data)
      if(response.data.statusCode === 403) {
        setStatus('')
        setError('Invalid signature...')
      }

      if(response.data.statusCode === 200 && response.data.mintInfo.merkleProof === null) {
        setStatus('Not a holder or on presale. Please wait until public mint is live.')
      }

      if(response.data.statusCode === 200 && response.data.mintInfo.holder) {
        setStatus('You are elligible to mint 3 PIXELBAES. All 3 will be minted in one transaction.')
        setMintInfo(response.data.mintInfo)
      }
      
      if(response.data.statusCode === 200 && response.data.mintInfo.whitelist) {
        setStatus('You are elligible to mint 2 PIXELBAES. All 2 will be minted in one transaction.')
        setMintInfo(response.data.mintInfo)
      }

    });
  };


  return (
    <div>
      {isLoading ? (
        <div className="loadingView">
          <Loading></Loading>
          <p className="error">{error}</p>
        </div>
      ) : (
          <div className="mint-viewer">
            <h1>SEASON 2.5</h1>
            <h1 className="pink">PIXELBAES</h1>
            <Timer></Timer>
            <h2 hidden={pausedStates.presale && pausedStates.public}>{supply.totalSupply} / {supply.maxSupply}</h2>
            <button className="mint-button" hidden={pausedStates.presale && (supply.totalSupply / supply.maxSupply !== 1)} onClick={handleSign}>MINT PRESALE</button>
            <button className="mint-button" hidden={pausedStates.public && (supply.totalSupply / supply.maxSupply !== 1)} onClick={mintPublic}>MINT PUBLIC</button>
            <div className="statusText">
              <p className="error">{error}</p>
              <p className="status">{status}</p>
              <p className="status" hidden={supply.totalSupply / supply.maxSupply !== 1}>Sale has concluded. Check us out on <a href="https://opensea.io/collection/pixelbaes">Opensea</a></p>
            </div>
            <img className='image-mint' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/pixel.gif"></img>
          </div>
      )}
    </div>
  );
}

export default Mint;
