import React, {useEffect, useState} from 'react'
import "../styles/Vault.css";
import OutsideClickHandler from 'react-outside-click-handler';


const images = [{name: "name"}, {name: "name1"}]

function Vault() {
    const link = ""
    
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
    const sashaDesc = "The Flame Fox Girl or Red Fox of Flame, A demi-human girl with fox traits. She came from the Flame Fox family of the Far East, came to Villes city and enrolled in the Magic School to awaken the magical fire within her. "
    + "Race : Human, Half-Fox"
    + "Gender : Female"
    + "Hair Color : Torch Red"
    + "Eye Color : Orange Red"
    + "2480 x 3496px"
    + "AUG 22 BaeCafe Monthly Community Voted Winner";
    const sukiDesc = "Cafe Monthly May Winner";
    const sayakaDesc = "Monthly contest winner. "
    + "Voted by holders of BaeCafe NFTs, Seasons 1 or 2."
    + "MEKABAE 385 Derivative";


    const [modalOpen, openModal] = React.useState(false);
    const [selectedImage, setImage] = React.useState(false);

    const handleAddClick = (selectedImage) => {
        openModal(true);
        setImage(selectedImage)
    };
    const handleClose = () => {
        openModal(false)
    }



    //ngOnInit
    useEffect(() => {
        console.log('hey')
    }, [])

    return (
        <div>
            {modalOpen ? (
                <div className="modal-bg" data-aos="fade-in">
                <OutsideClickHandler onOutsideClick={() => { handleClose(false) }}>
                    <div className="vault-modal">
                    <div className="modal-main" style={{backgroundImage: "url(" + selectedImage.link + ")",
                            backgroundPosition: 'center',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat'}}>
                    </div>
                    <p class="imageDesc">{selectedImage.description}</p>
                    <p></p>
                    <a>{selectedImage.fdlink}</a>
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
                    <h1 className="blue">VAULT</h1>
                </div>
                <div className="vault-viewer">
                    <img src="https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/benangbaja.png" onClick={() => handleAddClick({link: "https://dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/benangbaja.png", description: banangbajaDesc, fdlink: "https://foundation.app/@baecafe/cafe-s1/4"})} alt="" height={300} width={300}/>
                    <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/helena.png" onClick={() => handleAddClick({link: "https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/helena.png" , description: helenaDesc, fdlink: "https://foundation.app/@baecafe/bae/5"})} alt="" height={338} width={300}/>
                    <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/hope.png" onClick={() => handleAddClick({link: "https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/hope.png" , description: hopeDesc, fdlink: "https://foundation.app/@baecafe/bae/6"})} alt="" height={583} width={417}/>
                    <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/lewdlily.png" onClick={() => handleAddClick({link: "https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/lewdlily.png" , description: lewdlilyDesc, fdlink: "https://foundation.app/@baecafe/cafe-s1/2"})} alt="" height={300} width={300}/>
                    <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/lewdlily69.png" onClick={() => handleAddClick({link: "https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/lewdlily69.png" , description: lewdlily69Desc, fdlink: "https://foundation.app/@baecafe/bae/1"})} alt="" height={413} width={276}/>
                    <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/madnokof.png" onClick={() => handleAddClick({link: "https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/madnokof.png" , description: madnokofDesc, fdlink: "https://foundation.app/@baecafe/bae/4"})} alt="" height={300} width={300}/>
                    <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/nunu.png" onClick={() => handleAddClick({link: "https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/nunu.png" , description: nunuDesc, fdlink: "https://foundation.app/@baecafe/bae/2"})} alt="" height={482} width={288}/>
                    <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/sasha.png" onClick={() => handleAddClick({link: "https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/sasha.png" , description: sashaDesc, fdlink: "https://foundation.app/@baecafe/bae/9"})} alt="" height={434} width={310}/>
                    <img src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/suki.png" onClick={() => handleAddClick({link: "https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/suki.png" , description: sukiDesc, fdlink: "https://foundation.app/@baecafe/bae/3"})} alt="" height={437} width={310}/>
                    <video src="https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/sayaka.mov" onClick={() => handleAddClick({link: "https:/dx8cklxaufs1v.cloudfront.net/baecafeweb/vault/sayaka.mov" , description: sayakaDesc, fdlink: "https://foundation.app/@baecafe/bae/7"})} alt="" height={600} width={350}/>
                </div>
            </div>
        </div>
    )
}

export default Vault;
