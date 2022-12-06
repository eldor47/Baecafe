import "../styles/Gallery.css";
import React, { useEffect } from 'react'
import axios from "axios";

import OutsideClickHandler from 'react-outside-click-handler';
import Loading from "./Loading";

import AOS from 'aos'

const pageSize = 35;
let seasons = {
  's1': 1000,
  's2': 2222,
  's2.5': 10000,
  's3': 2500
}

function Gallery() {

  const [isLoading, setIsLoading] = React.useState(true);
  const [isGalleryLoading, setIsGalleryLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [dropdownData, setDropdownData] = React.useState([]);
  const [dropdownStatus, setDropdownStatus] = React.useState([]);
  const [view, setView] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(2500);

  const [modalOpen, openModal] = React.useState(false);
  const [selectedNft, setNft] = React.useState(false);
  const [checked, setChecked] = React.useState({}); 
  const [season, setSeason] = React.useState('s3'); 

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
    
    axios.post(url, { season: season, page: page, batchSize: pageSize, filter: checked }).then((response) => {
      // Set data and viewable data for scrollable component
      setIsGalleryLoading(true)
      setTimeout(() => {
        for(var item of response.data.metadata) {
          var attributes = []
          for (const [key, value] of Object.entries(item)) {
            var na = ["os_url", "external_url", "name", "image", "season"]
            if(!na.includes(key))
              attributes.push({trait_type: key, value: value})
          }
          item.attributes = attributes
        }
        setData(response.data)
        setView(response.data.metadata.slice(0, imageCount))
        setIsGalleryLoading(false)
        setTotal(response.data.total)
      }, "2 second")
    });
  }, [page])

  React.useEffect(() => {
    let url = process.env.REACT_APP_BASE_URI_NEW + '/gallery';
    setIsGalleryLoading(true)
    setChecked({})
    
    axios.post(url, { season: season, page: 1, batchSize: pageSize, filter: checked }).then((response) => {
      // Set data and viewable data for scrollable component
      for(var item of response.data.metadata) {
        var attributes = []
        for (const [key, value] of Object.entries(item)) {
          var na = ["os_url", "external_url", "name", "image", "season"]
          if(!na.includes(key))
            attributes.push({trait_type: key, value: value})
        }
        item.attributes = attributes
      }
      setData(response.data)
      setView(response.data.metadata.slice(0, imageCount))
      setIsGalleryLoading(false)
      setTotal(response.data.total)
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
    let url = process.env.REACT_APP_BASE_URI_NEW + '/gallery';

    if(page != 1){
      setPage(1)
      return
    }
    
    axios.post(url, { season: season, page: page, batchSize: pageSize, filter: checked }).then((response) => {
      // Set data and viewable data for scrollable component
      setIsGalleryLoading(true)
      setTimeout(() => {
        for(var item of response.data.metadata) {
          var attributes = []
          for (const [key, value] of Object.entries(item)) {
            var na = ["os_url", "external_url", "name", "image", "season"]
            if(!na.includes(key))
              attributes.push({trait_type: key, value: value})
          }
          item.attributes = attributes
        }
        setData(response.data)
        setView(response.data.metadata.slice(0, imageCount))
        setIsGalleryLoading(false)
        setTotal(response.data.total)
      }, "2 second")
    });
  }, [checked]);

  const resetFilters = () => {
    // This doesnt work because react wont let me uncheck the boxes...
    setChecked({})
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
                <button className="button-connect" onClick={() => setSeason('s1')}>S1</button>
                <button className="button-connect" onClick={() => setSeason('s2')}>S2</button>
                <button className="button-connect" onClick={() => setSeason('s2.5')}>S2.5</button>
                <button className="button-connect" onClick={() => setSeason('s3')}>S3</button>
                <button className="button-connect" onClick={() => resetFilters()}>Reset Filters</button>
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
          {isGalleryLoading ? <div className="image-viewer clearfix"><Loading></Loading></div> :
          <div className="image-viewer clearfix" >
            {page === 1 ? <></> :
            <div hidden={page === 1} className='image-holder page'>
              <p>Page {page} of {Math.round(total / pageSize)}</p>
              <button onClick={() => setPage(page-1)} className='button-connect'>PREVIOUS PAGE</button>
            </div>
            }
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
            {page*pageSize >= total ? <></> :
            <div className='image-holder page'>
              <p>Page {page} of {Math.round(total / pageSize)}</p>
              <button  onClick={() => setPage(page+1)} className='button-connect'>NEXT PAGE</button>
            </div>
            }
            <h1 hidden={view.length !== 0}>No results found.</h1>
          </div>
          }
        </div>
      )}
    </div>
  );
}

export default Gallery;
