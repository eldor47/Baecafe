import '../styles/Marketplace.css'
import React from 'react'
import axios from "axios";
import OutsideClickHandler from 'react-outside-click-handler';
import pixelbaesabi from "../abi/erc20.json";

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

function Marketplace({account, contracts}) {

  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState();
  const [status, setStatus] = React.useState();
  const [modalOpen, openModal] = React.useState(false);
  const [listing, setListing] = React.useState(false);
  const [addresses, setAddresses] = React.useState([]);
  const [userBalance, setBalance] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [signature, setSignature] = React.useState([]);
  const [contract, setContract] = React.useState(null);
  const [filter, setFilter] = React.useState('All');
  const [category, setCategory] = React.useState('All');
  const [view, setView] = React.useState([]);

  React.useEffect(() => {
    connect()
    getListingData()
  }, []);

  React.useEffect(() => {
    if(contract != null) {
      balance().then(data => {
        setBalance(data / Math.pow(10, 18))
      })
    }
  }, [contract])

  const getListingData = () => {
    let url = process.env.REACT_APP_BASE_URI_NEW + '/getListings';
    
    axios.post(url, {}).then((response) => {
      // Set data and viewable data for scrollable component
      console.log(response.data)
      setData(response.data.listings)
      setView(response.data.listings)
    });
  }

  React.useEffect(() => {
    connect()
  }, [account])

  // React.useEffect(() => {
  //   console.log(filter)
  //   if(filter === 'All') {
  //     setView(data)
  //   }
  //   if(filter === 'Active') {
  //     setView(data.filter((e) => {
  //       var startDate = new Date(e.startDate)
  //       var endDate = new Date(e.endDate)
  //       var today = new Date()
  //       return startDate <= today && endDate 
  //     }))
  //   }
  //   if(category === 'Commission') {
  //     setView(data.filter(e => e.type === 'Commission'))
  //   }
  // }, [filter])

  React.useEffect(() => {
    if(category === 'All') {
      setView(data)
    }
    if(category === 'Whitelist') {
      setView(data.filter(e => e.type === 'Whitelist'))
    }
    if(category === 'Commission') {
      setView(data.filter(e => e.type === 'Commission'))
    }
  }, [category])

  const balance = async () => {
    const balance = await contract.balanceOf(account);
    return parseFloat(balance.toString());
  };

  const handleSign = async () => {
    setError();
    setStatus('Please sign to verify tokens in wallet.')
    const sig = await signMessage({
      setError,
      message: 'Please sign to verify tokens in wallet.'
    });
    setStatus('')
    if (sig) {
      setSignature(sig);
      return sig;
    } else {
      return false
    }
  };

  const baeApproval = async(price, id) => {
    console.log(account)
    try {

      var sig = await handleSign()
      if(sig) {
        var number = ethers.utils.parseUnits(price, 18)
        console.log(number)
        var approvalTx = await contract.increaseAllowance(account, number)
        setStatus('You are approving use of BAE token. Please wait...')
        await approvalTx.wait()
        setStatus('Approval success! Now please confirm transfer ')
  
        var transferTx = await contract.transferFrom(account, '0xc00fCD5e5c7D931b1d42b84bf9292b2D28B9Aec5', number)
        setStatus('Transferring payment to team wallet. Please do not leave page!')
        await transferTx.wait()
  
        // Send to backend
        console.log(sig)
        let url = process.env.REACT_APP_BASE_URI_NEW + '/satisfyListing';
        axios.post(url, {id: id, sig: sig}).then((response) => {
          if(response.data.statusCode === 403) {
            setStatus('')
            setError('Invalid signature...')
          } else {
            setStatus(response.data.msg)
            setIsLoading(false)
            getWL(id)
            setTimeout(() => {
              getListingData()
              handleClose(false)
            }, 5000);
          }
        });
      }

    } catch (e) {
      setStatus('')
      setError(e.message)
      console.log(e.message)
    }
  }

  async function getChain(_provider) {
    let chainId = await _provider.getNetwork()
    return chainId.chainId
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
  
        setContract(new ethers.Contract(process.env.REACT_APP_BAE_TOKEN, pixelbaesabi, signer))
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

  const handleClose = () => {
    openModal(false)
  }

  const getWL = async (id) => {
    let url = process.env.REACT_APP_BASE_URI_NEW + '/getListingsWL';
    
    var res = await axios.post(url, {id})

    return res.data.addresses
  }

  const openWhitelist = async (listing) => {
    console.log(listing)
    setListing(listing)
    setError('')
    // Need to grab whitelist listing data here
    var addresses = await getWL(listing.id)
    setAddresses(addresses)

    openModal(true)
  }

  const openCommission = async (listing) => {
    console.log(listing)
    setAddresses([])
    setError('')
    setListing(listing)

    openModal(true)
  }

  const getStatus = (listing) => {
    if(listing.locked) {
      return 'Commission locked'
    }
    if(listing.type === "Whitelist") {
      var startDate = new Date(listing.startDate)
      var endDate = new Date(listing.endDate)
      var today = new Date()
      if(startDate > today){
        var difference = startDate - today
        var timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
        return 'Live in ' + timeLeft.days + ' days and ' + timeLeft.hours + ' hours'
      }
      if(endDate < today) {
        return 'Whitelist has expired'
      }
      return false
    }
  }

  const checkWL = () => {
    for(var address of addresses) {
      if(address.toLowerCase() === account.toLowerCase()) {
        return 'Wallet already whitelisted!'
      }
    }
  }

  return (
    <div className="marketplace">
      {modalOpen ? (
        <div className="modal-bg" >
          <OutsideClickHandler onOutsideClick={() => { handleClose(false) }}>
            <div className="modal">
              <div className="modal-header" onClick={() => {handleClose(false)}}>X</div>
                <div className="modal-main-listing">
                  <h1 hidden={listing.type === 'Commission'}>Whitelisted Wallets</h1>
                  <h1 hidden={listing.type === 'Whitelist'}>Artist Commission</h1>
                  <p hidden={listing.type === 'Commission'}>{listing.maxWhitelist - addresses.length} remaining</p>
                  <ul hidden={listing.type === 'Commission'} className='list-wl'>
                    {addresses.map(a => {
                      return <li key={a}>{a.substring(0, 5)}...{a.substring(a.length - 4)}</li>
                    })}
                  </ul>
                  <p className='info-commission' hidden={listing.type === 'Whitelist'}>
                   How does a commission work?
                  </p>
                  <p className='info-commission' hidden={listing.type === 'Whitelist'}>
                    <b>The first step is to pay for the commssion upfront in BAE. After you have approved and transfered
                    BAE to the community wallet, make sure to copy your transaction ID and open a ticket in the BaeCafe Discord.
                    This commssion will remained locked until the artist has finished and given their artwork to the buyer.</b>
                  </p>
                  <p hidden={listing.type === 'Whitelist'}>
                    You are inquiring to buy a commission from the artist <b>{listing.artist}</b>
                  </p>
                  <p hidden={listing.type === 'Whitelist'}>
                    {listing.description}
                  </p>
                  <div className='desc-mark'>
                    <button disabled={userBalance < listing.price || checkWL()} onClick={() => baeApproval(listing.price, listing.id)}>Reserve for {listing.price} $BAE</button>
                    {userBalance < listing.price ? <p className='error'>Not enough $BAE</p> : <></>}
                    {<p className='error'>{checkWL()}</p>}
                    <p className='error'>{error}</p>
                    <p>{status}</p>
                  </div>
                </div>
            </div>
          </OutsideClickHandler>
        </div>
      ) : (<></>)}
      <div className="left-market">
        <h1>CATEGORIES</h1>
        <div className="category-filter">
          <div onClick={()=> setCategory('All')} className='category-filter-item'>All</div>
          <div onClick={()=> setCategory('Whitelist')} className='category-filter-item'>Whitelist</div>
          <div onClick={()=> setCategory('Commission')} className='category-filter-item'>Artist Commission</div>
          <div className='filter-disabled'>Merch</div>
          <div className='filter-disabled'>NFT</div>
        </div>
        {/* <h1>FILTERS</h1>
        <div className="category-filter">
          <div onClick={()=> setFilter('All')} className='category-filter-item'>All</div>
          <div onClick={()=> setFilter('Active')} className='category-filter-item'>Active</div>
          <div onClick={()=> setFilter('Newest')} className='category-filter-item'>Newest</div>
          <div onClick={()=> setFilter('Oldest')} className='category-filter-item'>Oldest</div>
          <div onClick={()=> setFilter('Lowest')} className='category-filter-item'>Lowest Price</div>
          <div onClick={()=> setFilter('Highest')} className='category-filter-item'>Highest Price</div>
        </div> */}
        <div className='desc-mark'>
          <button>{userBalance.toFixed(2)} $BAE</button>
          <img className="token"src="./image/baetoken.png"></img>
        </div>
      </div>
      <div className="right-market">
      {view.map(e => {
        return (<div className="market-item" key={e.id}>
          <div className="item-img" style={{backgroundImage: `url(${e.image})`, backgroundSize: 'cover', backgroundPosition: "center"}}></div>
          <div className='item-body'>
            <p className='description'>{e.description}</p>
            <div className='button-group'>
              <a hidden={!e.twitter} href={e.twitter}><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.png"/></a>
              <a hidden={!e.discord} href={e.discord}><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/discord.png"/></a>
            </div>
            <div className='button-group'>
                            {
                e.type === 'Whitelist' ? 
                <button disabled={getStatus(e)} className='button-submit' onClick={() => openWhitelist(e)}>View</button> 
                :
                <button disabled={getStatus(e)} className='button-submit' onClick={() => openCommission(e)}>View</button> 
              }
            </div>
            <p className='error'>{getStatus(e)}</p>
          </div>
        </div>)
        })}
      </div>
    </div>
  );
}

export default Marketplace;
