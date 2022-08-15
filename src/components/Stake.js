import "../styles/Stake.css";
import React from 'react'
import axios from "axios";

import { ethers } from "ethers";
import Loading from "./Loading";

import OutsideClickHandler from 'react-outside-click-handler';

function Stake({account, contracts}) {

  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [view, setView] = React.useState([]);

  const [modalOpen, openModal] = React.useState(false);
  const [selectedNft, setNft] = React.useState(false);
  const [checked, setChecked] = React.useState({}); 

  
  const [totalBaes, setTotalBaes] = React.useState(0); 
  const [totalMeka, setTotalMeka] = React.useState(0); 
  // const balance = async (tokenAddress) => {
  //   const contract = new ethers.Contract(tokenAddress, erc721Abi, signer);
  //   const balance = await contract.balanceOf(account);
  //   console.log(balance.toString());
  // };

  const [imageCount, setImageCount] = React.useState(30);

  const handleAddClick = (selectedNft) => {
    openModal(true);
    setNft(selectedNft)
  };
  const handleClose = () => {
    openModal(false)
  }

  React.useEffect(() => {
    let url = process.env.REACT_APP_BASE_URI + '/gallery';
    axios.post(url, { season: 's1' }).then((response) => {
      // Set data and viewable data for scrollable component
      setData(response.data)
      setView(response.data.metadata.slice(0, imageCount))
    });
  }, []);

  React.useEffect(() => {
    console.log(contracts)
    for(var contract of contracts) {
      if(contract != null){
        console.log(account)
        contract.balanceOf(account).then(data => {
          console.log(data.toNumber())
        })
      }
    }
  }, [contracts]);

  React.useEffect(() => {
    if (data.length !== 0) {
      setIsLoading(false);
    }
  }, [data]);

  React.useEffect(() => {
    // Trigger refilter of data here
    var newView = getFilterData()?.slice(0, imageCount)
    setView(newView)
  }, [checked]);

  const handleScroll = async (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) { 
      // GRAB MORE DATA
      var newView = getFilterData()?.slice(0, imageCount+30)
      setView(newView)
      setImageCount(imageCount + 30)
    }
  }

  const getFilterData = () => {
    var newData = data.metadata?.filter(item => {
      var fil = false

      var keys = Object.keys(checked)
      if(keys.length === 0) {
        return true
      }

      keys.forEach(key => {
        var value = item.attributes.find(({ trait_type }) => trait_type === key).value
        if(checked[key].includes(value)){
          fil = true
        }
      })
      return fil
    }).slice(0, imageCount)
    return newData
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


      <div className="coming-soon">COMING SOON...</div>

      {isLoading ? (
        <div className="loadingView">
          <Loading></Loading>
        </div>
      ) : (
        <div className='stake'>
          <div className="desc-viewer">
            <div className='desc-top'>
                <h1 className="pink">STAKING</h1>
                <p className="stake-description">Stake your Bae Cafe, Meka Baes or Pixel Baes for $BAE token rewards. Tokens for exclusive marketplace perks.</p>
            </div>
            <div className='desc-bottom'>
                <h2>Current Balance</h2>
                <button>47000 $BAE</button>
                <img className="token"src="./image/baetoken.png"></img>
            </div>
          </div>
          <div className="stake-viewer" onScroll={handleScroll}>
            <div className="stake-box">
                <div className="stake-top">
                    <h1 className="stake-header">Currently Staking</h1>
                    <button className="stake-button">Unstake</button>
                    <button className="stake-button">Select All</button>
                </div>
                <div className="stake-bottom">
                    {view.map((nft) => (
                    <div className='image-holder' key={nft.name} onClick={() => handleAddClick(nft)}>
                        <img className='stake-image-item' src={nft.external_url}></img>
                    </div>
                    ))}
                </div>
            </div>
            <div className="stake-box">
                <div className="stake-top">
                    <h1 className="stake-header">Select to Stake</h1>
                    <button className="stake-button">Stake</button>
                    <button className="stake-button">Select All</button>
                </div>
                <div className="stake-bottom">
                    {view.map((nft) => (
                    <div className='image-holder' key={nft.name} onClick={() => handleAddClick(nft)}>
                        <img className='stake-image-item' src={nft.external_url}></img>
                    </div>
                    ))}
                </div>
            </div>
            <div className="stake-box">
                <div className="stake-top">
                    <h1 className="stake-header">Current Rewards</h1>
                    <button className="stake-button" >?</button>
                </div>
            </div>
            <div className="stake-box">
                <div className="stake-top">
                    <h1 className="stake-header">Pending Rewards</h1>
                    <button className="stake-button">Claim Now</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stake;
