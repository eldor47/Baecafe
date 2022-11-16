import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

function Header({ connect, account }) {
        
  const navigate = useNavigate();
  const handleOnClick = useCallback((route) => navigate('/' + route), [navigate]);

  const [open, setOpen] = React.useState(false);

  const hasWindow = typeof window !== 'undefined';

  return (
    <div className="hamburger-menu">
    
      <a className="logo" onClick={() => handleOnClick('')}> <img  className="headerIcon"src="./image/LOGO.png"></img></a>

        <input id="menu__toggle" type="checkbox"  />
        <label className="menu__btn" htmlFor="menu__toggle">
          <span></span>
        </label>
        <div className="header menu__box">

          <div className="header-item" onClick={() => handleOnClick('')}>About</div>
          <div className="header-item" onClick={() => handleOnClick('gallery')}>Gallery</div>
          <div className="header-item" onClick={() => handleOnClick('vault')}>Vault</div>
          <div className="header-item" onClick={() => handleOnClick('stake')}>Staking</div>
          <div className="header-item" onClick={() => handleOnClick('marketplace')}>Marketplace</div>
          <div className="button" onClick={() => handleOnClick('mint')}>SEASON 3</div>
          {account == "" ? (
            <button onClick={connect} className="button-connect">
              CONNECT WALLET
            </button>
          ) : (
            <p>{account.substring(0, 2)}...{account.substring(account.length - 4)}</p>
          )}

          <div className='header-right'>
            <a hidden={open} href="https://twitter.com/baebaecafe"><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.png"/></a>
            <a hidden={open} href="https://discord.gg/baecafe"><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/discord.png"/></a>
            <a hidden={open} href="https://opensea.io/collection/baecafe-s2"><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/opensea.png"/></a>
            <a hidden={open} href="https://www.instagram.com/baecafe.xyz/"><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/instagram.png"/></a>
            <a hidden={open} href="https://medium.com/@baecafe"><img className='header-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/medium.png"/></a>
          </div>
      </div>


    </div>
  );
}

export default Header;
