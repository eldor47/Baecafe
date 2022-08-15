import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

function Header({ connect, account }) {

  const navigate = useNavigate();
  const handleOnClick = useCallback((route) => navigate('/' + route), [navigate]);

  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => {

  }

  const hasWindow = typeof window !== 'undefined';

  React.useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        if(getWindowDimensions().width < 800) {
          setOpen(false)
        }
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  React.useEffect(() => {
    if(getWindowDimensions().width < 800) {
      setOpen(true)
    }
    
  }, []);

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const toggle = () => {
    if(getWindowDimensions().width < 1080) {
      setOpen(!open)
    }
  }

  return (
    <div className="header">
      <img onClick={toggle} className="headerIcon"src="./image/logo-s2.png"></img>
      <div hidden={open} className="header-item" onClick={() => handleOnClick('')}> About </div>
      <div hidden={open} className="header-item" onClick={() => handleOnClick('gallery')}> Gallery </div>
      <div hidden={open} className="header-item" onClick={() => handleOnClick('stake')}> Staking </div>
      <div hidden={open} className="header-item" onClick={() => handleOnClick('marketplace')}> Marketplace </div>
      <div hidden={open} className="button" onClick={() => handleOnClick('mint')}> SEASON 2.5 </div>
      {account == "" ? (
        <button hidden={open} onClick={connect} className="button-connect">
          Connect
        </button>
      ) : (
        <p hidden={open} >{account.substring(0, 2)}...{account.substring(account.length - 4)}</p>
      )}
      <div className='header-right'>
        <a hidden={open} href="https://twitter.com/baebaecafe"><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.png"/></a>
        <a hidden={open} href="https://discord.gg/baecafe"><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/discord.png"/></a>
        <a hidden={open} href="https://opensea.io/collection/baecafe-s2"><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/opensea.png"/></a>
        <a hidden={open} href="https://www.instagram.com/baecafe.xyz/"><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/instagram.png"/></a>
        <a hidden={open} href="https://medium.com/@baecafe"><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/medium.png"/></a>
      </div>
    </div>
  );
}

export default Header;
