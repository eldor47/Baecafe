import React, {useEffect} from 'react'
import "../styles/Home.css";
import AOS from 'aos'

function Home() {
    useEffect(() => {
        AOS.init({duration: 1000})
    }, [])
    return (
        <div className="page">
                <div className="home">
                    <div className="left" data-aos="fade-right">
                        <h1>WELCOME</h1>
                        <h1 className="offset">BAE CAFE</h1>
                        <p>A Web3 Brand for Digital Artists and Enthusiasts.</p>
                        <br></br>
                        <p>Scroll to Continue</p>
                    </div>
                    <div className="right" data-aos="fade-up">

                    </div>

                    <div className="roadmap">
                        <div className="roadmap-panel">
                            <div className="roadmap-desc">
                                <h1>PHASE 1</h1>
                                <p>It started simply with an image from the mind of our founding artist 
                                    @sawawse
                                    -- bikini waifus on the beach serving drinks and living the bae life.  
                                    We launched 1000 Baes onto Ethereum to begin the journey.</p>
                            </div>
                            <img className="roadmap-img" src="./image/bae_cafe.jpg"  />
                        </div>
                        <div className="roadmap-panel">
                            <img className="roadmap-img" src="./image/mekabae_launch.gif"  />
                            <div className="roadmap-desc">
                                <h1>PHASE 2</h1>
                                <p>Soon the Cafe was invaded by an alien threat and the Baes were forced to defend.  Meka suits were designed by 
                                @sayuki_0123
                                for this purpose and 2222 MEKABAES were launched.  Season 2 is cc0, and we encourage artists to use our images for their benefit.</p>
                            </div>
                        </div>
                        <div className="roadmap-panel">
                            <div className="roadmap-desc">
                                <h1>PHASE 3</h1>
                                <p>The next Phase to launch will be staking on Aug 15th. 
                                    Holders will be able to stake their season 1 and 2 NFT to generate $BAE, a community currency to be used for purchasing art commissions, exclusive WLs, merch, and more! 
                                    Holders can get staking multipliers by voting monthly</p>
                            </div>
                            <img className="roadmap-img" src="./image/baetoken.png"  />
                        </div>
                        <div className="roadmap-panel">
                            <img className="roadmap-img" src="./image/hanapixel.gif"  />
                            <div className="roadmap-desc">
                                <h1>PHASE 4</h1>
                                <p>On Aug 18th, we will launch 10,000 PIXELBAES onto Eth by @ChinpongR. 
                                    Over 200 traits mixed from seasons 1 and 2 are used. They are individually hand outlined with love.</p>
                            </div>
                        </div>
                        <div className="roadmap-panel">
                            <div className="roadmap-desc">
                                <h1>PHASE 5</h1>
                                <p>After PIXELBAES settle in, we will launch the marketplace.  This is where stakers can spend their $BAE.  Offerings will include Artist Commissions, Exclusive WLS, Raffle entries, Merch, and more!</p>
                            </div>
                            <img className="roadmap-img" src="./image/bae_shop.jpg"  />
                        </div>
                        <div className="roadmap-panel">
                            <img className="roadmap-img" src="./image/robot_face.jpg"  />
                            <div className="roadmap-desc">
                                <h1>PHASE 6</h1>
                                <p>After that, the metaverse phase will begin.  BaeCafe will enter various metaverses with land acquisitions and game integrations for the PIXELBAES. Partnership discussions have begun.</p>
                            </div>
                        </div>
                        <div className="roadmap-panel">
                            <div className="roadmap-desc">
                                <h1>PHASE 7</h1>
                                <p>Finally, the Cafe will be made real with real land and real Boba tea!   Something like this is what we have in mind.  Holders will be invited for perk filled weekend getaways! 
                                    We can't wait to see everyone there!!</p>
                            </div>
                            <img className="roadmap-img" src="./image/baereal.png"  />
                        </div>
                    </div>
                    
                    <div className="team">
                        <h1>MEET THE <span className='pink'>TEAM</span></h1>
                        <div className='team-holder'>
                            <div className='team-item' >
                                <a href="https://twitter.com/sawawse"><img className='team-img' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/sawa.png"/></a>
                                <h2>Sawa</h2>
                                <p>Taiwanese digital artist</p>
                                <a href="https://twitter.com/sawawse"><img className='twitter-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.svg"/></a>
                            </div>
                            <div className='team-item' >
                                <a href="https://twitter.com/claracottontail"><img className='team-img' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/cottons.png"/></a>
                                <h2>cottons.eth</h2>
                                <p>Project Owner</p>
                                <a href="https://twitter.com/claracottontail"><img className='twitter-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.svg"/></a>
                            </div>
                            <div className='team-item' >
                                <a href="https://twitter.com/chasethefeel"><img className='team-img' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/chase.png"/></a>
                                <h2>Chasethefeel</h2>
                                <p>Project Admin</p>
                                <a href="https://twitter.com/chasethefeel"><img className='twitter-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.svg"/></a>
                            </div>
                            <div className='team-item' >
                                <a href="https://twitter.com/eldor4747"><img className='team-img' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/eldor.png"/></a>
                                <h2>eldor.eth</h2>
                                <p>Web3 Developer</p>
                                <a href="https://twitter.com/eldor4747"><img className='twitter-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.svg"/></a>
                            </div>
                            <div className='team-item' >
                                <a href="https://twitter.com/joxiecoxie"><img className='team-img' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/joxie.png"/></a>
                                <h2>Joxie</h2>
                                <p>Community Management</p>
                                <a href="https://twitter.com/joxiecoxie"><img className='twitter-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.svg"/></a>
                            </div>
                        </div>
                    </div>
                </div>

        </div>)
}

export default Home;
