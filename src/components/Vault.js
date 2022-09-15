import React, {useEffect, useState} from 'react'
import "../styles/Vault.css";

const images = [{name: "name"}, {name: "name1"}]
function Vault() {
    const test = useState('test')

    //ngOnInit
    useEffect(() => {
        console.log('hey')
    }, [])

    return (
        <div className="page">
            {images.map(e => {
                return <div>{e.name}</div>
            })}
            <div>{test}</div>
        </div>
    )
}

export default Vault;
