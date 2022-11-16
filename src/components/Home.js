import React, {useEffect, forwardRef} from 'react';
import "../styles/Home.css";
import AOS from 'aos';
import 'aos/dist/aos.css';

function Home() {


    // AOS.init({duration: 1000});
    
    //ANIMATE
    useEffect(() => {
        AOS.init({duration: 1000});
    });

    return (

        <div className="page">
                <div className="home">

                    <div data-aos="fade-left" data-aos-delay="500" className="left banner">

                        <div className="banner-text"><h1>WELCOME <br />
                       TO <span className='accent'>BAECAFE</span></h1>
                        <p>A Web3 Brand for Digital Artists and Enthusiasts.</p>

                        <div className="mobilevid" >
                            <div className="videoWrapper">
                                <iframe data-aos="fade-down" data-aos-delay="1000" width="560" height="315" 
                                    src="https://www.youtube-nocookie.com/embed/3DIvD7K0E0w?showinfo=0&modestbranding=0&controls=0&autohide=1&rel=0" 
                                    title="YouTube video player"  
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" >
                                </iframe>
                            </div>
                        </div>
                        
                        <a href="#roadmap" className='offset-scroll'><span className='accent'>Scroll</span> to Continue</a>
                        </div>
                        <div className="right" >
                            <div className="videoWrapper">
                                <iframe data-aos="fade-down" data-aos-delay="1000" width="560" height="315" 
                                    src="https://www.youtube-nocookie.com/embed/3DIvD7K0E0w?showinfo=0&modestbranding=0&controls=0&autohide=1&rel=0" 
                                    title="YouTube video player"  
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" >
                                </iframe>
                            </div>
                        </div>
                    </div>

                    <div className="roadmap" id="roadmap">

                        <div data-aos="fade-right" className="roadmap-panel">
                            <div className="roadmap-desc">
                                <h1>PHASE 1</h1>
                                <p>It started simply with an image from the mind of our founding artist 
                                <a href="https://twitter.com/sawawse"> @sawawse</a>
                                    -- bikini waifus on the beach serving drinks and living the bae life.  
                                    We launched 1000 Baes onto Ethereum to begin the journey.</p>
                            </div>
                            <img className="roadmap-img" src="./image/bae_cafe.jpg"  />
                        </div>

                        <div data-aos="fade-left" className="roadmap-panel" >
                            <img className="roadmap-img" src="./image/mekabae_launch.gif"  />
                            <div className="roadmap-desc">
                                <h2>PHASE 2</h2>
                                <p>Soon the Cafe was invaded by an alien threat and the Baes were forced to defend.  Meka suits were designed by 
                                <a href="https://twitter.com/sayuki_0123"> @sayuki_0123 </a>
                                for this purpose and 2222 MEKABAES were launched.  Season 2 is cc0, and we encourage artists to use our images for their benefit.</p>
                            </div>
                        </div>
                        <div data-aos="fade-right" className="roadmap-panel" >
                            <div className="roadmap-desc">
                                <h2>PHASE 3</h2>
                                <p>The next Phase to launch will be staking on Aug 18th. 
                                    Holders will be able to stake their season 1 and 2 NFT to generate $BAE, a community currency to be used for purchasing art commissions, exclusive WLs, merch, and more! 
                                    Holders can get staking multipliers by voting monthly</p>
                            </div>
                            <img className="roadmap-img" src="./image/baetoken.png"  />
                        </div>
                        <div data-aos="fade-left" className="roadmap-panel">
                            <img className="roadmap-img" src="./image/hanapixel.gif"  />
                            <div className="roadmap-desc">
                                <h2>PHASE 4</h2>
                                <p>On Aug 18th, we will launch 10,000 PIXELBAES onto Eth by <a href="https://twitter.com/ChinpongR">@ChinpongR</a>. 
                                    Over 200 traits mixed from seasons 1 and 2 are used. They are individually hand outlined with love.</p>
                            </div>
                        </div>
                        <div data-aos="fade-right" className="roadmap-panel">
                            <div className="roadmap-desc">
                                <h2>PHASE 5</h2>
                                <p>After PIXELBAES settle in, we will launch the marketplace. This is where stakers can spend their $BAE. Offerings will include Artist Commissions, Exclusive WLS, Raffle entries, Merch, and more!</p>
                            </div>
                            <img className="roadmap-img" src="./image/bae_shop.jpg"  />
                        </div>
                        <div data-aos="fade-left" className="roadmap-panel">
                            <img className="roadmap-img" src="./image/robot_face.jpg"  />
                            <div className="roadmap-desc">
                                <h2>PHASE 6</h2>
                                <p>After that, the metaverse phase will begin.  BaeCafe will enter various metaverses with land acquisitions and game integrations for the PIXELBAES. Partnership discussions have begun.</p>
                            </div>
                        </div>
                        <div data-aos="fade-right" className="roadmap-panel">
                            <div className="roadmap-desc">
                                <h2>PHASE 7</h2>
                                <p>Finally, the Cafe will be made real with real land and real Boba tea! Something like this is what we have in mind.  Holders will be invited for perk filled weekend getaways! 
                                    We can't wait to see everyone there!!</p>
                            </div>
                            <img className="roadmap-img" src="./image/baereal.png"  />
                        </div>
                    </div>
                    
                    <div className="team">
                        <h2>MEET THE <span className='pink'>TEAM</span></h2>
                        <div className='team-holder'>
                            <div 
                            data-aos="fade-up"
                            data-aos-delay=""
                             className='team-item' >
                                <a href="https://twitter.com/sawawse"><img className='team-img' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/sawa.png"/></a>
                                <h3>Sawa</h3>
                                <p>Taiwanese digital artist</p>
                                <a href="https://twitter.com/sawawse"><img className='twitter-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.svg"/></a>
                            </div>
                            <div 
                            data-aos="fade-up"
                            data-aos-delay="100"
                             className='team-item' >
                                <a href="https://twitter.com/claracottontail"><img className='team-img' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/cottons.png"/></a>
                                <h3>cottons.eth</h3>
                                <p>Project Owner</p>
                                <a href="https://twitter.com/claracottontail"><img className='twitter-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.svg"/></a>
                            </div>
                            <div 
                            data-aos="fade-up"
                            data-aos-delay="200"
                             className='team-item' >
                                <a href="https://twitter.com/chasethefeel"><img className='team-img' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/chase.png"/></a>
                                <h3>Chasethefeel</h3>
                                <p>Project Admin</p>
                                <a href="https://twitter.com/chasethefeel"><img className='twitter-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.svg"/></a>
                            </div>
                            <div 
                            data-aos="fade-up"
                            data-aos-delay="300"
                             className='team-item' >
                                <a href="https://twitter.com/eldor4747"><img className='team-img' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/eldor.png"/></a>
                                <h3>eldor.eth</h3>
                                <p>Web3 Developer</p>
                                <a href="https://twitter.com/eldor4747"><img className='twitter-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.svg"/></a>
                            </div>
                            <div 
                            data-aos="fade-up"
                            data-aos-delay="400"
                             className='team-item' >
                                <a href="https://twitter.com/joxiecoxie"><img className='team-img' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/joxie.png"/></a>
                                <h3>Joxie</h3>
                                <p>Community Management</p>
                                <a href="https://twitter.com/joxiecoxie"><img className='twitter-icon' src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/image/twitter.svg"/></a>
                            </div>
                        </div>
                    </div>
                </div>

        </div>)
}

export default Home;
