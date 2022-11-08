import "../styles/Stake.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { ethers } from "ethers";
import Loading from "./Loading";
import erc20 from "../abi/erc20.json";

import OutsideClickHandler from 'react-outside-click-handler';


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

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function Stake({account, contracts}) {

  const [isLoading, setIsLoading] = React.useState(true);

  const [modalOpen, openModal] = React.useState(false);
  const [selectedNft, setNft] = React.useState(false);

  const [signature, setSignature] = useState([]);
  const [data, setData] = React.useState([]);
  const [totals, setTotals] = React.useState([0, 0, 0, 0]);
  const [unclaimed, setUnclaimed] = React.useState([0, 0, 0, 0]);
  const [error, setError] = useState('');
  const [claimDisabled, setClaimDisabled] = useState(false);

  const [userBalance, setBalance] = React.useState(0);

  const [status, setStatus] = useState('');

  const [contract, setContract] = useState(null);

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
  
        setContract(new ethers.Contract(process.env.REACT_APP_BAE_TOKEN, erc20, signer))
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

  useEffect(() => {
    if(window.ethereum) {
      connect()
    }
  }, [account])

  useEffect(() => {
    if(contract != null) {
      balance().then(data => {
        setBalance(data / Math.pow(10, 18))
      })
    }
  }, [contract])

  async function getChain(_provider) {
    let chainId = await _provider.getNetwork()
    return chainId.chainId
  }

  const handleAddClick = (selectedNft) => {
    openModal(true);
    setNft(selectedNft)
  };
  const handleClose = () => {
    openModal(false)
  }

  const balance = async () => {
    const balance = await contract.balanceOf(account);
    return parseFloat(balance.toString());
  };

  const handleSign = async (e) => {
    setError();
    setStatus('Please sign to verify tokens in wallet.')
    const sig = await signMessage({
      setError,
      message: 'Please sign to verify tokens in wallet.'
    });
    setStatus('')
    if (sig) {
      setSignature(sig);
    }

    // Send to backend to then verify, get WL and 
    let url = process.env.REACT_APP_BASE_URI_NEW + '/ownedNfts';
    axios.post(url, {sig: sig, chainId: parseInt(process.env.REACT_APP_NETWORK_ID)}).then((response) => {
      if(response.data.statusCode === 403) {
        setStatus('')
        setError('Invalid signature...')
      } else {
        setIsLoading(false)
        loadData(response.data.nfts)
      }
    });
  };

  const refresh = () => {
    // Send to backend to then verify, get WL and 
    let url = process.env.REACT_APP_BASE_URI_NEW + '/ownedNfts';
    axios.post(url, {sig: signature, chainId: parseInt(process.env.REACT_APP_NETWORK_ID)}).then((response) => {
      if(response.data.statusCode === 403) {
        setStatus('')
        setError('Invalid signature...')
      } else {
        setIsLoading(false)
        loadData(response.data.nfts)
      }
    });

    balance().then(data => {
      setBalance(data / Math.pow(10, 18))
    })

    setStatus('')
  }

  const loadData = (nfts) => {
    var totals = [0, 0, 0, 0]
    var unclaimed = [0, 0, 0, 0]
    for(var nft of nfts) {
      if(nft.hasClaimed) {
        setClaimDisabled(true)
        setError('You have already claimed during the current period!')
      }
      var season = nft.id.split(':')[0]
      nft.external_url = 'https://baecafe.s3.amazonaws.com/collections/' + season + '/' + nft.token_id + '.png'
      if(season === 's2.5') {
        nft.external_url = 'https://baecafe.s3.amazonaws.com/collections/' + season + '/' + nft.token_id + '.gif'
      }

      // Get total unclaimed
      if(season === 's1') {
        totals[0]++
        unclaimed[0] += ((new Date() - new Date(nft.lastClaim)) / 1000) * ((10) / 86400)
      } else if (season === 's2'){
        totals[1]++
        unclaimed[1] += ((new Date() - new Date(nft.lastClaim)) / 1000) * ((8) / 86400)
      } else if(season === 's2.5') {
        totals[2]++
        unclaimed[2] += ((new Date() - new Date(nft.lastClaim)) / 1000) * ((1) / 86400)
      } else {
        totals[3]++
        unclaimed[3] += ((new Date() - new Date(nft.lastClaim)) / 1000) * ((7) / 86400)
      }
    }

    setUnclaimed(unclaimed)
    setTotals(totals)

    nfts = nfts.sort((a,b) => {
      return a.token_address - b.token_address
    })

    setData(nfts)
  }

  const claim = async () => {
    // Lets check to make sure its all good and they havent claimed yet
    // Send to backend to then verify, get WL and 
    setClaimDisabled(true)
    let url1 = process.env.REACT_APP_BASE_URI_NEW + '/ownedNfts';
    axios.post(url1, {sig: signature, chainId: parseInt(process.env.REACT_APP_NETWORK_ID)}).then((response) => {
      if(response.data.statusCode === 403) {
        setStatus('')
        setError('Invalid signature...')
      } else {
        for(var nft of response.data.nfts) {
          if(nft.hasClaimed){
            setError('You have already claimed during the period.')
          }
        }
      }
    });

    let url = process.env.REACT_APP_BASE_URI_NEW + '/claim';
    axios.post(url, {sig: signature, chainId: parseInt(process.env.REACT_APP_NETWORK_ID)}).then((response) => {
      if(response.data.statusCode != 200) {
        setStatus('')
        setError(response.data.msg)
      } else {
        console.log(response.data)
        setStatus(response.data.msg)
      }
    });
  }

  React.useEffect(() => {
  }, []);

  const addBaeToken = async () => {
    const tokenAddress = process.env.REACT_APP_BAE_TOKEN;
    const tokenSymbol = 'BAE';
    const tokenDecimals = 18;
    const tokenImage = "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/baetoken.png";

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getDateMessage = () => {
    var d = new Date()
    var month = monthNames[d.getMonth()]
    var currentMonthDate = d.getDate()
    var nexClaimDate = 5
    if(d.getDate() > 19) {
      nexClaimDate = 5
    }
    if(d.getDate() > 5) {
      nexClaimDate = 19
    }
    if(currentMonthDate > 19) {
      if(monthNames[d.getMonth()+1])
        month = monthNames[d.getMonth()+1]
      else 
        month = monthNames[0]
    }

    return month + ' ' + nexClaimDate + 'th 12:00 UTC'
  }


  return (
    <div>
      {modalOpen ? (
        <div className="modal-bg">
          <OutsideClickHandler onOutsideClick={() => { handleClose(false) }}>
            <div className="modal">
              <div className="modal-left">
                <img className='modal-image-item' src={selectedNft.external_url}></img>
              </div>
              <div className="modal-right">
                <p>Mekabae</p>
                <h1>{selectedNft.name}</h1>
                {selectedNft.attributes.map((attribute, index) => (
                  <div className="attribute" key={index}>
                    <div className="attribute-left">{attribute.trait_type}</div>
                    <div className="attribute-right">{attribute.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </OutsideClickHandler>
        </div>
      ) : (<></>)}

      {isLoading ? (
        <div className="loadingView">
          <h1>Welcome to <span className="pink">Staking</span></h1>
          <p>Please verify wallet to continue.</p>
          <button className="mint-button" onClick={handleSign}>Verify Wallet</button>
        </div> 
      ) : (
        <div className='stake'>
          <div className="desc-viewer">
            <div className='desc-top'>
                <h1 className="pink">STAKING</h1>
                <p className="stake-description">Earn daily rewards for all BaeCafe season nfts paid in $BAE. Tokens for exclusive marketplace perks.</p>
            </div>
            <div className='desc-bottom'>
                <h2>Current Balance</h2>
                <button>{userBalance.toFixed(2)} $BAE</button>
                <img className="token"src="./image/baetoken.png"></img>
            </div>
            <p className="small">Want to support our gas funding wallet? <a onClick={() => {
              navigator.clipboard.writeText('0xd8480dBb0C731c378c2C9243c620943483568dBC');
            }}>Copy Address</a></p>
          </div>
          <div className="stake-viewer">
            <div className="stake-box full">
                <div className="stake-top">
                    <h1 className="stake-header">OWNED <span className="pink">BAES</span></h1>
                </div>
                <div className="stake-bottom">
                    {data.map((nft) => (
                    <div className='image-holder' key={nft.token_id}>
                        <img className='stake-image-item' src={nft.external_url}></img>
                    </div>
                    ))}
                </div>
            </div>
            <div className="stake-box">
                <div className="stake-top">
                    <h1 className="stake-header">DAILY <span className="pink">REWARDS</span></h1>
                    <button className="stake-button" onClick={addBaeToken}>Import $BAE</button>
                </div>
                <div className="stake-bottom col">
                  <h2><span className="pink">{totals[0]}</span> BaeCafe</h2>
                  <p>{totals[0] * 10} $BAE per day</p>
                  <h2> <span className="pink">{totals[1]}</span> MEKABAE</h2>
                  <p>{totals[1] * 8} $BAE per day</p>
                  <h2><span className="pink">{totals[2]}</span> PIXELBAES</h2>
                  <p>{totals[2]} $BAE per day</p>
                  <h2><span className="pink">{totals[3]}</span> ELEMENTS</h2>
                  <p>{totals[3] * 7} $BAE per day</p>
                  <h2><span className="pink">{(totals[0] * 10) + (totals[1] * 8) + (totals[2]) + (totals[3] * 7)}</span> $BAE DAILY</h2>
                </div>
            </div>
            <div className="stake-box">
                <div className="stake-top">
                    <h1 className="stake-header">PENDING <span className="pink">REWARDS</span></h1>
                    <button className="stake-button" onClick={refresh}>Refresh</button>
                    <button className="stake-button" disabled={claimDisabled || (totals[0] === 0 && totals[1] === 0 && totals[2] === 0 && totals[3] === 0)} onClick={claim}>Claim</button>
                </div>
                <div className="stake-bottom col">
                  <h2><span className="pink">{totals[0]}</span> BaeCafe</h2>
                  {/* <p>{unclaimed[0].toFixed(2)} $BAE unclaimed</p> */}
                  <h2> <span className="pink">{totals[1]}</span> MEKABAE</h2>
                  {/* <p>{unclaimed[1].toFixed(2)} $BAE unclaimed</p> */}
                  <h2><span className="pink">{totals[2]}</span> PIXELBAES</h2>
                  <h2><span className="pink">{totals[3]}</span> ELEMENTS</h2>
                  {/* <p>{unclaimed[2].toFixed(2)} $BAE unclaimed</p> */}
                  <h2><span className="pink">{((unclaimed[0]) + (unclaimed[1]) + (unclaimed[2]) + (unclaimed[3])).toFixed(2)}</span> $BAE UNCLAIMED*</h2>
                  <p>{status}</p>
                  <p className="error">{error}</p>
                  <p className="small">*Your rewards stack and claims are biweekly resetting each month.</p>
                  <p className="small">Next claim reset: {getDateMessage()}</p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stake;
