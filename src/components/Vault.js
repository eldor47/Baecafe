import React, {useEffect, useState} from 'react'
import "../styles/Vault.css";
import OutsideClickHandler from 'react-outside-click-handler';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

function Vault() {
    
    //image descriptions
    const banangbajaDesc = "The final collaboration with community members related to BaeCafe's first season. This is Indonesian digital artist, benangbaja. 🍉 " 
    + "\n" + "𝗯𝗮𝗲𝗰𝗮𝗳𝗲 𝘀𝟭 is a total of 3 NFTs, each a 1/1 community artist interpretation of BaeCafe heroine, Hana. Proceeds from these auctions are split 50/50 between the artist and BaeCafe. "
    + "\n" + "All bidders will receive one BaeCafe NFT from season 1.";
    const helenaDesc = "Cafe Monthly May winner";
    const hopeDesc = "BaeCafe holder vote winner! "
    + "\n" + "A new world is possible ... with 'Hope'";
    const lewdlilyDesc = "This is the first of three collaborations with community members related to BaeCafe's first season. The artist, lewdlily, has been a member of BaeCafe's community from the start and is also the winner of Cafe Monthly March 2022. "
    + "\n"+ "𝗯𝗮𝗲𝗰𝗮𝗳𝗲 𝘀𝟭 is a total of 3 NFTs, each a 1/1 community artist interpretation of BaeCafe heroine, Hana. Proceeds from these auctions are split 50/50 between the artist and BaeCafe. "
    + "\n" + "All bidders will receive one BaeCafe NFT from season 1.";
    const lewdlily69Desc = "Bae cafe Monthly contest winner mint";
    const madnokofDesc = "Cafe Monthly May Winner";
    const nunuDesc = "Cafe Monthly May Winner";
    const sashaDesc = `The Flame Fox Girl or Red Fox of Flame, A demi-human girl with fox traits. She came from the Flame Fox family of the Far East, came to Villes city and enrolled in the Magic School to awaken the magical fire within her.`;
    const sukiDesc = "Cafe Monthly May Winner";
    const sayakaDesc = "Monthly contest winner. "
    + "Voted by holders of BaeCafe NFTs, Seasons 1 or 2."
    + "MEKABAE 385 Derivative";
    const beachDesc = "BaeCafe pixelated"

    const [modalOpen, openModal] = React.useState(false);
    const [selectedImage, setImage] = React.useState(false);
    const [selectedVideo, setVideo] = React.useState(false);

    const handleAddClick = (selectedImage) => {
        if(selectedImage.link.includes('.mp4')){
            setVideo(selectedImage);
            setImage(false);
            openModal(true);
        }
        else{
            setImage(selectedImage);
            setVideo(false);
            openModal(true);
        }
    };
    const handleClose = () => {
        openModal(false)
    }

    return (
        <div>
            {modalOpen ? (
                <div className="modal-bg" data-aos="fade-in">
                <OutsideClickHandler onOutsideClick={() => { handleClose(false) }}>
                    <div className="vault-modal">
                    <div className="modal-header" onClick={() => {handleClose(false)}}>X</div>
                    <div hidden={selectedVideo} className="modal-main" style={{backgroundImage: "url(" + selectedImage.link + ")",
                            backgroundPosition: 'center',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat'}}>
                    </div>
                    <div hidden={selectedImage} className="modal-main">
                            <video autoPlay loop muted style={{height: "100%", width: "100%"}}>
                                <source src={selectedVideo.link} type="video/mp4"/>
                            </video>
                    </div>
                    <div className="descriptionHolder" hidden={selectedVideo}>
                        <p className="imageDesc">{selectedImage.description}</p>
                        <p></p>
                        <a href={selectedImage.fdlink} target="_blank" rel="noopener noreferrer">{selectedImage.fdlink}</a>
                    </div>
                    <div className="descriptionHolder" hidden={selectedImage}>
                        <p className="imageDesc">{selectedVideo.description}</p>
                        <p></p>
                        <a href={selectedVideo.fdlink} target="_blank" rel="noopener noreferrer">{selectedVideo.fdlink}</a>
                    </div>
                    </div>
                </OutsideClickHandler>
                </div>
            ) : (<></>)}
            <div className="vault-page">
                <div className="vault" data-aos="fade-right">
                    {/* {images.map(e => {
                        return <div>{e.name}</div>
                    })} */}
                    <h1 className="white">COMMUNITY</h1>
                    <h1 className="blue" style={{'padding-bottom': '20px'}}>VAULT</h1>
                    <p>Baecafe's collection of art made by the</p>
                    <p>talented people of this community</p>
                </div>
                <div className="vault-viewer">
                    <GridList className="gridList" cellHeight={500} cols={3}>
                        {/* <video autoPlay loop muted height={300} width={400} onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/nft.mp4", description: beachDesc, fdlink: "https://foundation.app/@baecafe/cafe/1"})}>
                            <source src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/nft.mp4" type="video/mp4"/>
                        </video> */}
                        <GridListTile key="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/benangbaja.png" cols={1}>
                            <img src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/benangbaja.png" onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/benangbaja.png", description: banangbajaDesc, fdlink: "https://foundation.app/@baecafe/cafe-s1/4"})} alt=""/>
                        </GridListTile>
                        <GridListTile key="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/helena.png" cols={1}>
                            <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/helena.png" onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/helena.png", description: helenaDesc, fdlink: "https://foundation.app/@baecafe/bae/5"})} alt=""/>
                        </GridListTile>
                        <GridListTile key="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/hope.png" cols={1}>
                            <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/hope.png" onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/hope.png", description: hopeDesc, fdlink: "https://foundation.app/@baecafe/bae/6"})} alt=""/>
                        </GridListTile>
                        <GridListTile key="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/lewdlily.png" cols={1}>
                            <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/lewdlily.png" onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/lewdlily.png", description: lewdlilyDesc, fdlink: "https://foundation.app/@baecafe/cafe-s1/2"})} alt="" />
                        </GridListTile>
                        <GridListTile key="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/lewdlily69.png" cols={1}>
                            <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/lewdlily69.png" onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/lewdlily69.png", description: lewdlily69Desc, fdlink: "https://foundation.app/@baecafe/bae/1"})} alt=""/>
                        </GridListTile>
                        <GridListTile key="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/madnokof.png" cols={1}>
                            <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/madnokof.png" onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/madnokof.png", description: madnokofDesc, fdlink: "https://foundation.app/@baecafe/bae/4"})} alt=""/>
                        </GridListTile>
                        <GridListTile key="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/nunu.png" cols={1}>
                            <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/nunu.png" onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/nunu.png", description: nunuDesc, fdlink: "https://foundation.app/@baecafe/bae/2"})} alt=""/>
                        </GridListTile>
                        <GridListTile key="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/sasha.png" cols={1}>
                            <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/sasha.png" onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/sasha.png", description: sashaDesc, fdlink: "https://foundation.app/@baecafe/bae/9"})} alt=""/>
                        </GridListTile>
                        <GridListTile key="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/suki.png" cols={1}>
                            <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/suki.png" onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/suki.png", description: sukiDesc, fdlink: "https://foundation.app/@baecafe/bae/3"})} alt=""/>
                        </GridListTile>
                        <GridListTile key="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/nft.mp4" cols={3}>
                            <video height={510} autoPlay loop muted onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/nft.mp4", description: beachDesc, fdlink: "https://foundation.app/@baecafe/cafe/1"})}>
                                <source src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/nft.mp4" type="video/mp4"/>
                            </video>
                        </GridListTile>
                        <GridListTile key="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/sayaka.mp4" cols={2}>
                            <video height={700} autoPlay loop muted onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/sayaka.mp4", description: beachDesc, fdlink: "https://foundation.app/@baecafe/bae/7"})}>
                                <source src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/sayaka.mp4" type="video/mp4"/>
                            </video>
                        </GridListTile>
                        <GridListTile key="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/nekobox.mp4" cols={1}>
                            <video height={500} autoPlay loop muted onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/nekobox.mp4", description: beachDesc, fdlink: "https://foundation.app/@baecafe/cafe-s1/3"})}>
                                <source src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/nekobox.mp4" type="video/mp4"/>
                            </video>
                        </GridListTile>
                    </GridList>
                </div>
            </div>
        </div>
    )
}

export default Vault;
