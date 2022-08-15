import "../styles/Mint.css";
import React from 'react'
import axios from "axios";

import OutsideClickHandler from 'react-outside-click-handler';
import Loading from "./Loading";

import AOS from 'aos'
import Timer from "./Timer";


function Mint({ connect, account }) {

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(false)
  }, [])


  return (
    <div>
      {isLoading ? (
        <div className="loadingView">
          <Loading></Loading>
        </div>
      ) : (
          <div className="mint-viewer">
            <h1>SEASON 2.5</h1>
            <h1 className="pink">PIXEL BAES</h1>
            <Timer></Timer>
            <img className='image-item' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/pixel.gif"></img>
          </div>
      )}
    </div>
  );
}

export default Mint;
