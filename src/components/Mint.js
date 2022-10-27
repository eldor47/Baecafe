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
  const [supply, setSupply] = useState({maxSupply: 5555, totalSupply: 0})
  const [pausedStates, setPausedStates] = useState({public: true, presale: true, freesale: true})
  const [mintInfo, setMintInfo] = useState(null)
  const [mintAmount, setMintAmount] = useState(3)
  const [price, setPrice] = useState(0.106)
  const [isWhitelisted, setWhitelisted] = useState(false)
  const [isFree, setFree] = useState(false)
  const [availWL, setAvailWL] = useState(null)
  const [hasFreeMinted, setHasFreeMinted] = useState(false)

  const pricesWL = [0.029, 0.026, 0.023, 0.021, 0.019, 0.017, 0.015, 0.013, 0.011, 0.010, 0];
  const pricesPublic = [0.039, 0.035, 0.032, 0.029, 0.026, 0.023, 0.021, 0.019, 0.017, 0.015, 0];


  useEffect(() => {
    if(contract !== null) {
      try {
        getMintedNum().then(data => {
          setSupply(data)
          getPausedStates().then(data => {
            setPausedStates(data)
            // if(data.presale === true && data.public === true) {
            //   setStatus('Sale is not live yet. Please be patient')
            // }
          })
        })
      } catch(e) {
        console.log(e)
      }
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

  useEffect(() => {
    if(availWL !== null)
      handleSign()
  }, [availWL])

  const getMintedNum = async () => {
    const maxSupply = await contract.maxSupply()
    const totalSupply = await contract.totalSupply()
    const freeSupply = await contract.freeSupply()

    return {
      maxSupply: maxSupply.toNumber(),
      totalSupply: totalSupply.toNumber(),
      freeSupply: freeSupply.toNumber()
    }
  };

  const getMintedNums = async () => {
    const freeMints = await contract.mintedFree(account)
    const mintedWL = await contract.mintedWL(account)

    var mints = {
      mintedFree: parseInt(freeMints.toString()),
      mintedWL: parseInt(mintedWL.toString())
    }

    console.log(mints.mintedWL)
    var avail = 11 - mints.mintedWL

    console.log("HERHEHEHR")
    console.log(avail)
    setAvailWL(avail)
    if(mints.mintedWL === 11){
      setWhitelisted(false)
      setPrice(0.106)
      setMintAmount(3)
    }
    setHasFreeMinted(mints.mintedFree === 1 ? true : false)
  }

  const getPausedStates = async () => {
    const publicSale = await contract.paused()
    const presale = await contract.presalePaused()
    const freesale = await contract.freesalePaused()

    await getMintedNums()

    console.log(publicSale)
    return {
      public: publicSale,
      presale: presale,
      freesale: freesale
    }
  };

  const mintPresale = async() => {
    if(mintInfo) {
      try {
        var mintTx;
        if(mintInfo.whitelist) {
          mintTx = await contract.mintPresale(mintInfo.merkleProofWL, mintAmount, { value: ethers.utils.parseEther(price.toString()) })
        }
        
        setStatus('Your tokens are on the way!')
        await mintTx.wait()
        setStatus('Tokens successfully minted. Public sale coming soon.')  
        var totals = await getMintedNum()
        await getPausedStates()
        setSupply(totals)
      } catch (e) {
        setStatus('')
        setError(e.message)
        if(e.message.includes('estimate gas')){
          setStatus('')
          setError('You have already minted!')
        }
        if(e.message.includes('insufficient funds')){
          setStatus('')
          setError('Insufficient funds in your wallet!')
        }
      }
    }
  }

  const mintFree = async() => {
    if(mintInfo) {
      try {
        var mintTx;
        if(mintInfo.free) {
          mintTx = await contract.mintFree(mintInfo.merkleProofFree)
        }
        
        setStatus('Your tokens are on the way!')
        await mintTx.wait()
        setStatus('Tokens successfully minted.')
        var totals = await getMintedNum()
        await getPausedStates()
        setSupply(totals)
      } catch (e) {
        setStatus('')
        setError(e.message)
        if(e.message.includes('estimate gas')){
          setStatus('')
          setError('You have already minted!')
        }
        if(e.message.includes('insufficient funds')){
          setStatus('')
          setError('Insufficient funds in your wallet!')
        }
      }
    }
  }

  const mintPublic = async() => {
    try {
      var mintTx;
      
      mintTx = await contract.mint(mintAmount, { value: ethers.utils.parseEther(price.toString()) })
      
      setStatus('Your tokens are on the way!')
      await mintTx.wait()
      setStatus('Tokens successfully minted.')
      var totals = await getMintedNum()
      await getPausedStates()
      setSupply(totals)
    } catch (e) {
      setStatus('')
      setError(e.message)
      if(e.message.includes('estimate gas')){
        setStatus('')
        setError('You have already minted!')
      }
      if(e.message.includes('insufficient funds')){
        setStatus('')
        setError('Insufficient funds in your wallet!')
      }
    }
  }

  const mint = async() => {
    if(isWhitelisted) {
      await mintPresale()
    } else {
      await mintPublic()
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
    let url = process.env.REACT_APP_BASE_URI_NEW + '/getMintStatus';
    axios.post(url, {sig: sig}).then((response) => {
      console.log(response.data)
      if(response.data.statusCode === 403) {
        setStatus('')
        setError('Invalid signature...')
      }


      if(response.data.statusCode === 200 && response.data.mintInfo.merkleProof === null) {
        setStatus('Not on presale list. You will be able to mint up to 11 NFTs per transaction at normal pricing.')
      }

      if(response.data.statusCode === 200 && response.data.mintInfo.whitelist) {
        console.log(availWL)
        if(availWL === 0){
          setStatus('You have already used all your presale mints. You can still public mint up to 11 per transaction.')
          setWhitelisted(false)
          setPrice(0.106)
          setMintAmount(3)
        } else {
          setStatus('You are elligible to mint 11 NFTs at a discounted price during the presale.')
          setWhitelisted(true)
          setPrice(0.078)
        }
        setMintInfo(response.data.mintInfo)
      }
      
      if(response.data.statusCode === 200 && response.data.mintInfo.free) {
        console.log(availWL)
        if(availWL === 0){
          setStatus('You have already used all your presale mints. You can still public mint up to 11 per transaction.')
          setWhitelisted(false)
          setPrice(0.106)
          setMintAmount(3)
        } else {
          setStatus('You are elligible to mint 11 NFTs at a discounted price during the presale. You are also elligible to claim a free mint!')
          setWhitelisted(true)
          setPrice(0.078)
          setFree(true)
        }
        setMintInfo(response.data.mintInfo)
      }

      setIsLoading(false)

    });
  };

  const getPrice = (amount, isWL) => {
    var total = 0
    for(var i = 0; i < amount; i++) {
      if(isWL) {
        total += pricesWL[i]
      } else {
        total += pricesPublic[i]
      }
    }
    return Math.round((total + Number.EPSILON) * 1000) / 1000
  }

  const changePrice = (direction, isWL) => {
    if(direction === "UP") {
      if(mintAmount + 1 > 11) {
        setMintAmount(11)
      } else {
        var amount = mintAmount + 1
        setMintAmount(amount)
        setPrice(getPrice(amount, isWL))
      }
    } else {
      if(mintAmount - 1 < 1) {
        setMintAmount(1)
      } else {
        var amount = mintAmount - 1
        setMintAmount(amount)
        setPrice(getPrice(amount, isWL))
      }
    }
  }

  function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  const canFreeMint = () => {
    // User is on freelist
    if(isFree && !hasFreeMinted){
       if(pausedStates.freesale === false) {
        return false
       }
    }

    return true
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
          <div className="mint-viewer">
            <h1><span className="pink">BaeCafe</span> Presents</h1>
            <h2>The <span className="pink">Elements</span> by Orange Sekaii</h2>
            <div className="icon-holder">
              <img className="icon-img" src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/earthicon.png"/>
              <img className="icon-img tall" src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/watericon.png"/>
              <img className="icon-img tall" src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/fireicon.png"/>
              <img className="icon-img" src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/airicon.png"/>
              <img className="icon-img tall" src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/electricicon.png"/>
              <img className="icon-img" src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/rareicon.png"/>
            </div>
            <h2 hidden={pausedStates.presale}>{supply.totalSupply} / {supply.maxSupply + supply.freeSupply}</h2>
            {/* <button className="mint-button" hidden={pausedStates.presale && (supply.totalSupply / supply.maxSupply !== 1)} onClick={handleSign}>MINT PRESALE</button>
            <button className="mint-button" hidden={pausedStates.public && (supply.totalSupply / supply.maxSupply !== 1)} onClick={mintPublic}>MINT PUBLIC</button> */}
            {/* <div className="statusText">
              <p className="error">{error}</p>
              <p className="status">{status}</p>
              <p className="status" hidden={supply.totalSupply / supply.maxSupply !== 1}>Sale has concluded. Check us out on <a href="https://opensea.io/collection/pixelbaes">Opensea</a></p>
            </div> */}
            <p className="status">{status}</p>
            <p className="error">{error}</p>
            {pausedStates.presale && pausedStates.public ? <Timer></Timer> : <></> }
            {pausedStates.presale && pausedStates.public ? <></> : 
            <div hidden={pausedStates.presale && pausedStates.public} className="mint-box">
              <h2>Mint Amount</h2>
              <div className="mint-select">
                <img onClick={() => changePrice("UP", isWhitelisted)}width="25" height="25" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAlpJREFUaEPtlb2L1FAUxe/NjjpfL5k0s6K1oCD4N9hrK4LbWdosLMriBwquLAuWNvai/4XaWG+5jS4L7g7iIExe4mSKSY5EDMgwM3nJe2EYeGnz7r3nd87LDdOaP7zm+skCrDpBm4BNQNMBe4U0DdQurzUBAE4cx5fSNJ12u90f2mrnNKgNQEq5Q0TPiUhkcwF8SdN0y/f9E5MgtQAEQfCSmZ/OEXoK4KbneV9NQRgHWCI+12wUwiiAgnjjEMYASog3CmEEoIJ4YxDaABrijUBoARgQrw1RGSAIgj1mfmJqHRJRpe1UCaAG8ZWTKA0gpdwnol1V5wG8YuY7RHRFpQbA9+xn1+v1vqmcLwVQwfnHruvuR1F0MUmSj8x8TUVUmeukDFBVfC64LgglAF3xdUIUApgSXxfEUoAwDB8AeKN4b7NjD13XfV10fjweX55Op59UP2wiOp5MJjf6/X4023shAIDzYRj+IqJukaB/75XE570qQOy6rnugDCClvEpER3WIrwLBzO+FEPeUAQaDQbvT6QTM3CiAKOX8bC/VJADseZ73TBkgOzgajQ4cx3m0BODvnldMaeExhRU7ajQa19vt9lkpAAAbUsp3zHx3znQj4hW2029mviWE+DzPgcI1CuBcGIYvAOww8wUAP4lo2/O8D7rOz9ZHUbSZJMlbIrrNzA6AwzRN7/u+f7hoViFAXpiBxHG82Wq1zpgZpsX/3284HIpms9kUQgyL5igDFDVa1XsLsCrn87k2AZuApgP2CmkaqF1uE9C2ULOBTUDTQO1ym4C2hZoN1j6BP+soRkDsMBgLAAAAAElFTkSuQmCC"></img>
                <h2 className="number">{pad(mintAmount, 2)}</h2>
                <img onClick={() => changePrice("DOWN", isWhitelisted)} width="25" height="25" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAnRJREFUaEPtlz+I1EAUxt83u9tsktlwhaAniqKF9rYeWtlbKNgcIpY2ghYWgoX4r7PVUkvBSgv1kOttxELE8q6wkEyWFMLuPBnZhSib7ExmVjmc1G/efL/3fTNJQHv8wR7XTxHgXzsYHYgOeE4gRshzgN7LowPeI/RsEB3wHKD38v/Dgaqq9mutrzLzIQAf0jR9AuCH9/gWNFBKnQJwgZkTAK+llC/b9lnqwHg83mDmF0S0Nm+ktf44GAzOJUmyGxKiLMvrzHwfQG/eF8CzNE03AUwW7dUKMJvGFhElCxZ/7vV6Z0NBlGV5k4juLRQJPM+y7JITADOjLMtPAE60TDkIRJv4mhPnsywzSfjtaXSgKIqjQoivFhHxgrARbzRorZ/meX7FGqCqqgPT6XTHAsCUfOn3+2eGw6Ft/a+2JvNE9MhmDwCPsyy7Zg1gCouieC+EOG2zARE5OWE7ebM3mzwDG1LKbVeAI0S0LYRYDwnhIn4GcGc0Gt12OsTzYqXUcWbecoBojZNLbGYaHkopbzQNcOl7wCwMBRFavNFmBRACYhXinQB8ICaTyUXb28YmNvU4WTvQ9Uww8zcA+ywvAVN2V0p5y7beGaCjE7Z6Wg9sp1uoaWdzsAG8I6KDtuqW1DmLdz4DfwpQSh0DYD72fCE6ifcGmMXJF6Kz+CAAnhBe4oMBdIHQWj/I89z8A3g9nW6hloNtFadQ4oM6UHtPtEKEFL8SgFqc3hDR4bpbzNz4Vdk1R0EjVBehlFoDcJmIThLRdyHEqzRN33YV2rRuZQChhUaAvzVR131ihFwnFro+OhB6oq79ogOuEwtdHx0IPVHXfj8Ba84AQPi/H1gAAAAASUVORK5CYII="></img>
              </div>
              <div className="mint-amount"><h2>{price}</h2></div>
              <p hidden={!isWhitelisted || availWL === 0}>You have {availWL} presale mints remaining</p>
            </div>
            }
            <button hidden={pausedStates.presale && pausedStates.public} onClick={() => mint()} className="button-connect big">MINT</button>
            <button hidden={canFreeMint()} onClick={() => mintFree()} className="button-connect big">CLAIM FREE MINT</button>
          </div>
      )}
    </div>
  );
}

export default Mint;
