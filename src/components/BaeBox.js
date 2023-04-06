import "../styles/BaeBox.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import baebox from "../abi/baebox.json";
import OutsideClickHandler from 'react-outside-click-handler';

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

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [contract, setContract] = useState(null);

  const [status, setStatus] = useState('');
  const [prices, setPrices] = useState([0, 0, 0]);

  const [modalOpen, setModalOpen] = useState(false);

  const [balances, setBalances] = useState([0,0,0,0,0])
  const [boxHtml, setBoxHtml] = useState([])

  const [isBurning, setIsBurning] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const [contracts, setContracts] = useState({
	baeToken: "",
	s1: "",
	s2: "",
	s3: "",
	sPixel: ""
  })

  const [rewards, setRewards] = useState({
	s1: [],
	s2: [],
	s3: [],
	sPixel: [],
	bae: 0
})

  const contractsPrd = {
	baeToken: "",
	s1: "",
	s2: "",
	s3: "",
	sPixel: ""
  }

  const contractsTest = {
	baeToken: "0x1fb7b8ad0C8368Db5463b34D5EA58778706D580e",
	s1: "0xb209d45dC4CA1E370E6A6821fB62cD8F02e421C1",
	s2: "0xb209d45dC4CA1E370E6A6821fB62cD8F02e421C1",
	s3: "0xb209d45dC4CA1E370E6A6821fB62cD8F02e421C1",
	sPixel: "0xb209d45dC4CA1E370E6A6821fB62cD8F02e421C1"
  }


  useEffect(() => {
    if(contract !== null) {
        // Grab contract states
        setIsLoading(false)
		loadData()

		if(process.env.REACT_APP_NETWORK_ID === "5") {
			setContracts(contractsTest)
		} else {
			setContracts(contractsPrd)
		}

		async function loadData() {
			await getPrices()
			await getBalances()
		}
    }
  }, [contract])

  useEffect(() => {
	createBoxHtml()
  }, [balances])

  useEffect(() => {
    connect()
	console.log(account)
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
  
        setContract(new ethers.Contract(process.env.REACT_APP_BAE_BOX, baebox, signer))
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

  async function getPrices() {
	const balance = await contract.showCostsPerTier();
	var n = [0, 0, 0];
	for(var i = 0; i < n.length; i++) {
		n[i] = parseFloat(balance[i]) / Math.pow(10, 18)
	}
	setPrices(n)
	return n;
  }
  async function getBalances() {
	const balance0 = await contract.balanceOf(account, 0);
	const balance1 = await contract.balanceOf(account, 1);
	const balance2 = await contract.balanceOf(account, 2);
	const balance3 = await contract.balanceOf(account, 3);
	const balance4 = await contract.balanceOf(account, 4);

	var balances = [parseFloat(balance0), parseFloat(balance1), parseFloat(balance2), parseFloat(balance3), parseFloat(balance4)]
	setBalances(balances)
  }

  async function getMintedNum() {

  }

  async function openBox() {
	console.log(contracts)
	setIsBurning(true)
	setError("")
	try{
		for(var a of boxHtml) {
			if(a.selected) {
				var openTx = await contract.openBox(a.tier - 1)
				setStatus('Your box is being burned 🔥')
				var receipt = await openTx.wait()
	
				console.log(receipt.logs)
				var r = {
					s1: [],
					s2: [],
					s3: [],
					sPixel: [],
					bae: 0
				}
	
				for(var log of receipt.logs) {
					if(log.address === contracts.s1) {
						r.s1.push(parseInt(Number(log.topics[3])))
					}
					if(log.address === contracts.s2) {
						r.s2.push(parseInt(Number(log.topics[3])))
					}
					if(log.address === contracts.s3) {
						r.s3.push(parseInt(Number(log.topics[3])))
					}
					if(log.address === contracts.sPixel) {
						r.sPixel.push(parseInt(Number(log.topics[3])))
					}
					if(log.address === contracts.baeToken) {
						var removal = log.data.slice()
						r.bae = h2d(removal) / Math.pow(10, 18)
					}
				}
	
				console.log(r)
				setRewards(r)
				setIsBurning(false)
				setIsOpened(true)
				await getBalances()
			}
		}
	} catch(e) {
		setIsBurning(false)
		setError('Error opening. Please try again.')
	}
  }

  function h2d(s) {

    function add(x, y) {
        var c = 0, r = [];
        var x = x.split('').map(Number);
        var y = y.split('').map(Number);
        while(x.length || y.length) {
            var s = (x.pop() || 0) + (y.pop() || 0) + c;
            r.unshift(s < 10 ? s : s - 10); 
            c = s < 10 ? 0 : 1;
        }
        if(c) r.unshift(c);
        return r.join('');
    }

    var dec = '0';
    s.split('').forEach(function(chr) {
        var n = parseInt(chr, 16);
        for(var t = 8; t; t >>= 1) {
            dec = add(dec, dec);
            if(n & t) dec = add(dec, '1');
        }
    });
    return dec;
}

  async function mintBox(_tier) {

	console.log('here')
	console.log(prices[_tier])


	try {
        var mintTx = await contract.mintBox(_tier, { value: ethers.utils.parseEther(prices[_tier].toString()) })
        setStatus('Your tokens are on the way!')
        await mintTx.wait()
        setStatus('Tokens successfully minted.') 
		await getBalances()
      } catch (e) {
        setStatus('')
        if(e.message.includes('estimate gas')){
          setStatus('')
          setError('Cannot estimate gas!')
        }
        if(e.message.includes('insufficient funds')){
          setStatus('')
          setError('Insufficient funds in your wallet!')
        }
      }
  }

  function createBoxHtml() {
	var b = []
	for(var i = 0; i < 3; i++) {
		for(var j = 0; j < balances[i]; j++) {
			var cssVar = ""
			if(i === 0) {
				cssVar = "one"
			} else if(i === 1) {
				cssVar = "two"
			} else {
				cssVar = "three"
			}
			b.push(
			{
				tier: i+1,
				cssVar,
				selected: false,
				id: i+j
			}
			)
		}
	}

	setBoxHtml(b)
  }

  function selectBox(a) {
	setError("")
	setIsOpened(false)
	var newBoxHtml = [...boxHtml]
	for(var b of boxHtml) {
		if(a.id === b.id) {
			b.selected = true
		} else {
			b.selected = false
		}
	}
	setBoxHtml(newBoxHtml)
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
		  {modalOpen ?
		  <>		  <div className="baebox-overlay"></div>
		  <OutsideClickHandler onOutsideClick={() => { setModalOpen(false) }}>
		  <div className="baebox-modal clearfix">
	  		<span className="close-baebox-modal"></span>
	  		<div className="owned-boxes clearfix">
	  			<h3>Open Baebox</h3>
	  			<div className="list-of-boxes clearfix">
					{boxHtml.map(a => {
						return <div key={a.id} onClick={() => selectBox(a)} className={"baebox-single" + (a.selected ? " selected" : "")}>
							<span className={"baebox-title tier-cup-" + a.cssVar}>Baebox Tier {a.tier}</span>
							<span className="select-baebox">select</span>
						</div>
					})}
	  			</div>
	  			
	  		</div>
	  		<div className="view-baebox-contents">
	  			<div className="closed-box-NFT">
					{boxHtml.map(a => {
						if(a.selected && !isBurning && !isOpened) {
							return <img width="300" src={"https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/baebox/tier" + a.tier + ".gif"}></img>
						}
					})}
					{isBurning ? <img width="200" src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/baebox/small.gif"></img> :
						<></>
					}
					{isOpened ?
					<div>
						{rewards.s1.map((r, index) => {
							return <img key={index+r}className='stake-image-item'style={{padding:"2px"}} src={"https://dx8cklxaufs1v.cloudfront.net/collections/s1/" + r + ".png"}></img>
						})}
						{rewards.s2.map((r, index) => {
							return <img key={index+r}className='stake-image-item'style={{padding:"2px"}} src={"https://dx8cklxaufs1v.cloudfront.net/collections/s2/" + r + ".png"}></img>
						})}
						{rewards.s3.map((r, index) => {
							return <img key={index+r}className='stake-image-item'style={{padding:"2px"}} src={"https://dx8cklxaufs1v.cloudfront.net/collections/s3/" + r + ".png"}></img>
						})}
						{rewards.sPixel.map((r, index) => {
							return <img key={index+r}className='stake-image-item'style={{padding:"2px"}} src={"https://dx8cklxaufs1v.cloudfront.net/collections/s2.5/" + r + ".gif"}></img>
						})}
						<p>{rewards.bae} $BAE Received</p>
					</div>
					 : <></>
					}
				  	<div className="error">{error}</div>
				</div>
	  			<a className="burn-open-baebox" onClick={() => openBox()}>Burn to Open</a>
	  		</div>
	  		</div>
		  </OutsideClickHandler>
		
		</> : <></>}
	  	<div className="page baebox clearfix">

	  		<div className="left clearfix">
		  		<h1>Bae<span className="blue">Box</span></h1>
		  		<span className="by">by BaeCafe</span>	
	  		</div>

	  		<div className="right clearfix">

	  			<div className="info">
	  				<h2>Acquire <span className="i"></span></h2>
	  				<p>After you have acquired your BAEBOX, click <span>OPEN BAEBOX</span> to burn the box, reveal what’s inside, and claim the contents secured within it. <br></br><br></br>Good luck!</p>
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
		  				<span className="price">{prices[0]} ETH</span>
		  				<button className="acquire" onClick={() => mintBox(0)}>Acquire</button>
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
		  				<span className="price">{prices[1]} ETH</span>
		  				<a className="acquire" onClick={() => mintBox(1)}>Acquire</a>
		  			</div>
	  			</div>

	  			<div className="tier three">
	  				<h3>Tier 3 <span>BaeBox</span></h3>
	  				<div className="tier-content clearfix">
		  				<span className="what-inside">What's inside:</span>
		  				<div className="img-roller-container">
		  					<div className="img-roller s1-roller"><span className="qmark"><span className="blue-cover-fade"></span></span></div>
		  					<span className="item-title">S1</span>	
		  					<span className="item-qty">x2</span>	
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
		  					<span className="item-qty">x2</span>	
		  				</div>
		  				<div className="bae-bonus">
		  					<h3>$BAE Bonus</h3>
		  					<span>Up to <span className="bae-q">5000</span> $BAE</span>
		  				</div>
		  				<span className="price">{prices[2]} ETH</span>
		  				<a className="acquire" onClick={() => mintBox(2)}>Acquire</a>
		  			</div>
	  			</div>

	  			<div className="bottom clearfix">
		  			<div className="left">
		  				<p>All tiers include the chance of containing: <br></br>1) a free S4 mint. 2) a voucher allowing you to claim a derivative version of one of your NFTs made by Sawa, Ruri, or a special guest Bae Artist.</p>
		  			</div>
		  			<div className="right">
		  				<div className="holding-info">
			  				<span className="you-have">You currently have:</span>
			  				<span className="held-q">{balances[0] + balances[1] + balances[2]} Bae Boxes</span>
		  				</div>
		  				<a className="open-baebox" onClick={() => setModalOpen(true)}>Open BaeBox</a>
		  			</div>
					<div className="error">{error}</div>
		  		</div>
	  		</div>

	  		

	  	</div>
        
        </div>
      )}
    </div>
  );
}

export default BaeBox;
