import "../styles/Gallery.css";
import React, { useEffect } from 'react'
import axios from "axios";

import OutsideClickHandler from 'react-outside-click-handler';
import Loading from "./Loading";

import AOS from 'aos'

const pageSize = 100;

function Gallery({ bottom }) {

  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [dropdownData, setDropdownData] = React.useState([]);
  const [dropdownStatus, setDropdownStatus] = React.useState([]);
  const [view, setView] = React.useState([]);
  const [page, setPage] = React.useState(1);

  const [modalOpen, openModal] = React.useState(false);
  const [selectedNft, setNft] = React.useState(false);
  const [checked, setChecked] = React.useState({}); 
  const [season, setSeason] = React.useState('s2'); 

  const [imageCount, setImageCount] = React.useState(pageSize);

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
    let url = process.env.REACT_APP_BASE_URI_NEW + '/gallery';
    let seasons = {
      's1': 1000,
      's2': 2222,
      's2.5': 10000,
      's3': 2500
    }
    
    axios.post(url, { season: season, page: 1, batchSize: pageSize }).then((response) => {
      // Set data and viewable data for scrollable component
      setData(response.data)
      setView(response.data.metadata.slice(1, imageCount))
      setPage(page+1)
    });

    url = process.env.REACT_APP_BASE_URI_NEW + '/dropdowns';
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

  useEffect(() => {
    console.log('bottom')
    // GRAB MORE DATA
    let url = process.env.REACT_APP_BASE_URI_NEW + '/gallery';
    axios.post(url, { season: season, page: page, batchSize: pageSize }).then((response) => {
      // Set data and viewable data for scrollable component
      var newMeta = [...data.metadata, ...response.data.metadata].sort((a,b) => {
        return a.name.split('#')[1] - b.name.split('#')[1]
      })

      console.log(newMeta.length)
      response.data.metadata = newMeta
      setData(response.data)
      setView(response.data.metadata.slice(1, imageCount+pageSize))
      setPage(page+1)
    });
    var newView = getFilterData()?.slice(0, imageCount+pageSize)
    setView(newView)
    setImageCount(imageCount + pageSize)
  }, [bottom])

  const handleScroll = async (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight;
    console.log(e.target.scrollHeight - e.target.scrollTop)
    console.log(e.target.clientHeight)
    if (bottom) { 
      console.log('bottom')
      // GRAB MORE DATA
      let url = process.env.REACT_APP_BASE_URI_NEW + '/gallery';
      axios.post(url, { season: season, page: page, batchSize: pageSize }).then((response) => {
        // Set data and viewable data for scrollable component
        var newMeta = [...data.metadata, ...response.data.metadata].sort((a,b) => {
          return a.name.split('#')[1] - b.name.split('#')[1]
        })

        console.log(newMeta.length)
        response.data.metadata = newMeta
        setData(response.data)
        setView(response.data.metadata.slice(1, imageCount+pageSize))
        setPage(page+1)
      });
      var newView = getFilterData()?.slice(0, imageCount+pageSize)
      setView(newView)
      setImageCount(imageCount + pageSize)
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
    var keys = Object.keys(checked)
    console.log(checked)
    var newData = data.metadata
    for(var key of keys) {
      newData = newData.filter(item => {
        var fil = false
        var value = item.attributes.find(({ trait_type }) => trait_type === key)?.value
        if(checked[key].includes(value)){
          fil = true
        }

        return fil
      })
    }
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
  
  //refresh AOS don't think this is working
  React.useEffect(() => {
    AOS.refresh();
  });

  return (
    <div className="gallery-page">
      {modalOpen ? (
        <div className="modal-bg" data-aos="fade-in">
          <OutsideClickHandler onOutsideClick={() => { handleClose(false) }}>
            <div className="modal">
              <div className="modal-header" onClick={() => {handleClose(false)}}><span className='close-modal'></span></div>
              <div className="modal-left">
                <img className='modal-image-item' src={selectedNft.external_url} alt={selectedNft.name}></img>
              </div>
              <div className="modal-right">
                <div className="modal-right-header">
                  <p>{data.name}</p>
                  <a className="nft-os-link" target="_blank" href={selectedNft.os_url}><img alt="Opensea Link" src="./image/OpenseaIcon.png" width="40" height="40" /></a>
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

        <div className='gallery clearfix'>
          <input id="filter-menu__toggle" type="checkbox"  />
          <label className="filter-menu__btn" htmlFor="filter-menu__toggle">
            <span></span>
          </label>
          <div className="filter-viewer-container">
          <div className="filter-viewer" data-aos="fade-right">
            <h1>THE <br />
            <span className="blue">GALLERY</span></h1> 
            <div className="season-filter">
                <button className="button-connect" onClick={() => setSeason('s1')}>Season 1</button>
                <button className="button-connect" onClick={() => setSeason('s2')}>Season 2</button>
                <button className="button-connect" onClick={() => setSeason('s2.5')}>Season 2.5</button>
                {/* <button className="button-connect" onClick={() => resetFilters()}>Reset Filters</button> */}
              </div>
            <div className="filter-box">

             
              {Object.keys(dropdownData).map((key) => (
                <div key={key}>
                  <div className="filter-item" onClick={() => toggleHiddenFilter(key)}><p>{key}</p><span>+</span></div>
                  <div className="expanded-view" hidden={dropdownStatus[key]}>
                    {dropdownData[key].map(value => (
                      <div className="filter-item expanded" key={value}>
                        <label><span>{value}</span>
                          <input type="checkbox" onChange={()=> handleChange(key, value)}/>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
          <div className="mobile-title">
            <h1>THE <br />
            <span className="blue">GALLERY</span></h1> 
          </div>
          <div className="image-viewer clearfix" onScroll={handleScroll} >
            
            {view.map((nft, index) => (
              <div className='image-holder' 
              data-aos="fade-up"
              // data-aos-delay={index*50+100}
              data-aos-delay={200}
              key={nft.name} onClick={() => handleAddClick(nft)}>
                <img className='image-item' src={nft.external_url}></img>
                <p className='image-text'>{nft.name}</p>
              </div>
            ))}
            <h1 hidden={view.length !== 0}>No results found.</h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
