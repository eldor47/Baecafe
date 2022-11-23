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
  const [page, setPage] = React.useState(1);

  const [modalOpen, openModal] = React.useState(false);
  const [selectedNft, setNft] = React.useState(false);
  const [checked, setChecked] = React.useState({}); 
  const [season, setSeason] = React.useState('s2'); 

  const [imageCount, setImageCount] = React.useState(100);

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
    let seasons = {
      's1': 1000,
      's2': 2222,
      's2.5': 10000
    }
    
    axios.post(url, { season: season, page: 1, batchSize: 100 }).then((response) => {
      // Set data and viewable data for scrollable component
      setData(response.data)
      setView(response.data.metadata.slice(1, imageCount))
      setPage(page+1)
    });

    url = process.env.REACT_APP_BASE_URI + '/dropdowns';
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
      let url = process.env.REACT_APP_BASE_URI + '/gallery';
      axios.post(url, { season: season, page: page, batchSize: 100 }).then((response) => {
        // Set data and viewable data for scrollable component
        var newMeta = [...data.metadata, ...response.data.metadata].sort((a,b) => {
          return a.name.split('#')[1] - b.name.split('#')[1]
        })

        console.log(newMeta.length)
        response.data.metadata = newMeta
        setData(response.data)
        setView(response.data.metadata.slice(1, imageCount+100))
        setPage(page+1)
      });
      var newView = getFilterData()?.slice(0, imageCount+100)
      setView(newView)
      setImageCount(imageCount + 100)
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
    <div>
      {modalOpen ? (
        <div className="modal-bg" data-aos="fade-in">
          <OutsideClickHandler onOutsideClick={() => { handleClose(false) }}>
            <div className="modal">
              <div className="modal-header" onClick={() => {handleClose(false)}}>X</div>
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
          <div className="image-viewer" onScroll={handleScroll} >
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
