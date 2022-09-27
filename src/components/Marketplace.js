import '../styles/Marketplace.css'
import React from 'react'
import axios from "axios";

function Marketplace({account, contracts}) {

  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState();

  React.useEffect(() => {
    getListingData()
  }, []);

  const getListingData = () => {
    let url = process.env.REACT_APP_BASE_URI_NEW + '/getListings';
    
    axios.post(url, {}).then((response) => {
      // Set data and viewable data for scrollable component
      console.log(response.data)
      setData(response.data.listings)
    });
  }

  return (
    <div className="marketplace">
      <div className="left-market">
        CATEGORIES
        <div className="category-filter">
          <div>Whitelist</div>
          <div>Artist Commission</div>
          <div>Merch</div>
          <div>NFT</div>
        </div>
        FILTERS
        <div className="category-filter">
          <div>All</div>
          <div>Active</div>
          <div>Newest</div>
          <div>Oldest</div>
          <div>Lowest Price</div>
          <div>Highest Price</div>
        </div>
      </div>
      <div className="right-market">
      {data.map(e => {
        return (<div className="market-item" key={e.id}>
          <img className="item-img" src={e.image}></img>
          <div className='item-body'>
            <p className='description'>{e.description}</p>
            <p className='expiration'>Ends in 2 days</p>
          </div>
          <div>
            <a href={e.twitter}><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.png"/></a>
            <a href={e.discord}><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/discord.png"/></a>
          </div>
          <button className='button-submit'>View</button>
          <button className='button-submit'>Buy</button>
        </div>)
        })}
      </div>
    </div>
  );
}

export default Marketplace;
