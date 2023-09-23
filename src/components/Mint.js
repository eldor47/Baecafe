import "../styles/Mint.css";
import React, { useEffect, useState } from "react";
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
  const [supply, setSupply] = useState({maxSupply: 1000, totalSupply: 0})
  const [pausedStates, setPausedStates] = useState({public: true, presale: true, freesale: true})
  const [mintInfo, setMintInfo] = useState(null)
  const [mintAmount, setMintAmount] = useState(10)
  const [price, setPrice] = useState(0.019)
  const [isWhitelisted, setWhitelisted] = useState(false)
  const [isFree, setFree] = useState(false)
  const [availWL, setAvailWL] = useState(null)
  const [hasFreeMinted, setHasFreeMinted] = useState(false)

  const pricesWL = [0.029, 0.026, 0.023, 0.021, 0.019, 0.017, 0.015, 0.013, 0.011, 0.010, 0];
  const pricesPublic = [0.0019, 0.0019, 0.0019, 0.0019, 0.0019, 0.0019,0.0019, 0.0019,0.0019, 0.0019];
  const priceNew = 0.0019;

  const [mintState, setMintState] = useState('state-countdown')


  useEffect(() => {
    if(contract !== null) {
      try {
        console.log('here')
        getMintedNum().then(data => {
          setSupply(data)
          getPausedStates().then(data => {
            setPausedStates(data)
            console.log(data)
            if(data.public === false) {
              setMintState('state-mint')
            }
          })
        })
      } catch(e) {
        console.log(e)
      }
    }
  }, [contract])

const MINUTE_MS = 10000;

useEffect(() => {
  const interval = setInterval(() => {
    console.log(contract)
    if(contract !== null) {
    getMintedNum().then(data => {
      setSupply(data)
      getPausedStates().then(data => {
        setPausedStates(data)
        console.log(data)
        if(mintState === 'state-countdown' && data.public === false) {
          setMintState('state-mint')
        }
      })
    })
  }
  }, MINUTE_MS);

  return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
}, [contract])

  useEffect(() => {
    connect()
  }, [account])

  useEffect(() => {
    setIsLoading(false)
  }, [availWL])

  const getMintedNum = async () => {
    const maxSupply = await contract.maxSupply()
    const totalSupply = await contract.totalSupply()

    return {
      maxSupply: maxSupply.toNumber(),
      totalSupply: totalSupply.toNumber()
    }
  };

  const getMintedNums = async () => {
    const freeMints = await contract.minted(account)

    var mints = {
      minted: parseInt(freeMints.toString())
    }

    console.log(mints.minted)
    var avail = 10 - mints.minted

    console.log("HERHEHEHR")
    console.log(avail)
    setAvailWL(avail)
    if(mints.minted === 10){
      setWhitelisted(false)
      setPrice(0.106)
      setMintAmount(3)
    }
  }

  const getPausedStates = async () => {
    const publicSale = await contract.paused()

    await getMintedNums()

    console.log(publicSale)
    return {
      public: publicSale
    }
  };

  const mintPublic = async() => {
    try {
      var mintTx;
      
      mintTx = await contract.mint(mintAmount, { value: ethers.utils.parseEther(price.toString()) })
      
      await mintTx.wait()
      var totals = await getMintedNum()
      await getPausedStates()
      setSupply(totals)

      setMintState('state-success post-mint')
    } catch (e) {
      console.log(e)
      setMintState('state-fail post-mint')
    }
  }

  const mint = async() => {
      await mintPublic()
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

  const getPrice = (amount, isWL) => {
    var total = 0
    for(var i = 0; i < amount; i++) {
      if(isWL) {
        total += pricesPublic[i]
      } else {
        total += pricesPublic[i]
      }
    }
    console.log(Math.round((total + Number.EPSILON) * 10000) / 10000)
    return Math.round((total + Number.EPSILON) * 100000) / 100000
  }

  const updateValue = (e) => {
    console.log(e.target.value)
    setMintAmount(Math.min(Math.floor(e.target.value), 10))
    setPrice(getPrice(Math.min(Math.floor(e.target.value), 10), false))
  }

  const renderMintState = () => {
    if(mintState === 'state-mint') {
      return <div className="state-mint">
      <span className="choose">Choose how many chibaes<br></br> you want and click mint!</span>
      <div className="mint">
        <input value={mintAmount} onChange={updateValue} className="q" name="q" type="number" max="12" min="1" placeholder="10"></input>
      </div>
      <button onClick={mint} className="connect mint">mint</button>
    </div>
    }
    if(mintState === 'state-success post-mint'){
      return <div className="state-success post-mint">
      <span className="choose">Mint successful!</span>
      <div className="check icon"></div>
      <a className="view-chibaes" href="https://opensea.io/collection/chibae">View on OpenSea</a>
    </div>
    }
    if(mintState === 'state-fail post-mint') {
      return <div className="state-fail post-mint">
      <span className="choose">Something went wrong!</span>
      <div className="fail icon"></div>
      <button onClick={() => setMintState('state-mint')} className="view-chibaes">Try Again</button>
    </div>
    }
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
        <div className="karu">
        <p className="presents"><span className="blue">BaeCafe</span> Presents</p>
        <div className="chibae">
          <div className="karu-mint-box">
          <h1>Chibaes <br></br> by Karu</h1>
          {mintState === 'state-countdown' ? 
            <div className={mintState}>
              <div className="countdown">
                <Timer></Timer>	
              </div>
              <button onClick={connect} disabled={account} className="connect">connect</button>
            </div>
            :
            renderMintState()
           }
          </div>
        </div>	
      </div>
      )}
    </div>
  );
}

export default Mint;
