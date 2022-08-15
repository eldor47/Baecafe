import "../styles/Gallery.css";
import React from 'react'
import axios from "axios";

import OutsideClickHandler from 'react-outside-click-handler';
import Loading from "./Loading";

import AOS from 'aos'


function Gallery({ connect, account }) {

  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [dropdownData, setDropdownData] = React.useState([]);
  const [dropdownStatus, setDropdownStatus] = React.useState([]);
  const [view, setView] = React.useState([]);

  const [modalOpen, openModal] = React.useState(false);
  const [selectedNft, setNft] = React.useState(false);
  const [checked, setChecked] = React.useState({}); 
  const [season, setSeason] = React.useState('s2'); 

  const [imageCount, setImageCount] = React.useState(30);

  const handleAddClick = (selectedNft) => {
    openModal(true);
    setNft(selectedNft)
  };
  const handleClose = () => {
    openModal(false)
  }

  React.useEffect(() => {
      AOS.init({duration: 500})
  }, [])

  React.useEffect(() => {
    let url = process.env.REACT_APP_BASE_URI + '/gallery';
    axios.post(url, { season: season }).then((response) => {
      // Set data and viewable data for scrollable component
      setData(response.data)
      setView(response.data.metadata.slice(0, imageCount))
    });

    url = process.env.REACT_APP_BASE_URI + '/gallery/dropdowns';
    axios.post(url, { season: season }).then((response) => {
      setDropdownData(response.data.dropdowns)

      // Set status of dropdown expansions
      var status = {...response.data.dropdowns}
      Object.keys(status).forEach(key => {
        status[key] = true;
      });
      console.log(status)
      setDropdownStatus(status)
    });
  }, [season]);

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
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight;
    if (bottom) { 
      console.log('bottom')
      // GRAB MORE DATA
      var newView = getFilterData()?.slice(0, imageCount+30)
      setView(newView)
      setImageCount(imageCount + 30)
    }
  }

  const resetFilters = () => {
    setChecked({})
    var status = {...dropdownData}
    Object.keys(status).forEach(key => {
      status[key] = true;
    });
    console.log(dropdownData)
    console.log(status)
    setDropdownStatus(status)
  }

  const getFilterData = () => {
    var newData = data.metadata?.filter(item => {
      var fil = false

      var keys = Object.keys(checked)
      if(keys.length === 0) {
        return true
      }

      keys.forEach(key => {
        var value = item.attributes.find(({ trait_type }) => trait_type === key)?.value
        if(checked[key].includes(value)){
          fil = true
        }
      })
      return fil
    }).slice(0, imageCount)
    return newData
  }

  const toggleHiddenFilter = (key) => {
    var newStatus = {...dropdownStatus}
    newStatus[key] = !newStatus[key]
    setDropdownStatus(newStatus)
  }

  // Handle checking of boxes and filtering data
  const handleChange = async (key, value) => {
    console.log(key + value)
    var newChecked = {...checked};
    if((checked[key] ?? []).includes(value)) {
      checked[key].splice(checked[key].indexOf(value), 1)
      if(checked[key].length === 0)
        delete checked[key]
      newChecked = {...checked}
    } else {
      newChecked[key] = [...checked[key] ?? [], value]
    }
    console.log(newChecked)
    setChecked(newChecked);
  }; 


  return (
    <div>
      {modalOpen ? (
        <div className="modal-bg" data-aos="fade-in">
          <OutsideClickHandler onOutsideClick={() => { handleClose(false) }}>
            <div className="modal">
              <div className="modal-left">
                <img className='modal-image-item' src={selectedNft.external_url} alt={selectedNft.name}></img>
              </div>
              <div className="modal-right">
                <div className="modal-right-header">
                  <p>{data.name}</p>
                  <a href={selectedNft.os_url}><img alt="Opensea Link" src="./image/OpenseaIcon.png" width="40" height="40" /></a>
                </div>
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
          <Loading></Loading>
        </div>
      ) : (
        <div className='gallery'>
          <div className="filter-viewer" data-aos="fade-right">
            <h1>THE</h1>
            <h1 className="pink">GALLERY</h1>
            <div className="filter-box">
              <div>
                <button className="button-connect" onClick={() => setSeason('s1')}>Season 1</button>
                <button className="button-connect" onClick={() => setSeason('s2')}>Season 2</button>
                {/* <button className="button-connect" onClick={() => resetFilters()}>Reset Filters</button> */}
              </div>
              {Object.keys(dropdownData).map((key) => (
                <div key={key}>
                  <div className="filter-item" onClick={() => toggleHiddenFilter(key)}><p>{key}</p><span>+</span></div>
                  <div className="expanded-view" hidden={dropdownStatus[key]}>
                    {dropdownData[key].map(value => (
                      <div className="filter-item expanded" key={value}>
                        <p>{value}</p>
                        <input type="checkbox" onChange={()=> handleChange(key, value)}/>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="image-viewer" onScroll={handleScroll} >
            {view.map((nft) => (
              <div className='image-holder' key={nft.name} onClick={() => handleAddClick(nft)}>
                <img className='image-item' src={nft.external_url}></img>
                <p className='image-text'>{nft.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
