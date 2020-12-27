import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
//import { HashLink as Link } from 'react-router-hash-link';

function BulmaNavbar({links = [], logoUrl = '', brandText = ''}) {

    const [isActive, setIsActive] = useState(false)
    
    const ExpandButton = () => (
        <a role="button" 
            className="navbar-burger burger" 
            aria-label="menu" 
            aria-expanded="false" 
            data-target="navbarBasicExample"
            onClick={ () => setIsActive(!isActive) }>

            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    )

    const exit = () => setIsActive(false);
    const Links = () => {
        return links.map( link => (
            <Link className="navbar-item" 
                to={link.to}
                key={link.to}
                onClick={exit}>
                {link.text}
            </Link>
        ))
    }

    return (
        <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <Link className="navbar-item" to="/#" onClick={exit}>
                <img src={logoUrl} />
                {brandText && <p className="title is-5 ml-2">{brandText}</p>}
            </Link>
            <ExpandButton/>
        </div>

        <div 
            id="navbarBasicExample" 
            className={`navbar-menu ${isActive? 'is-active': ''}`}>
            <div className="navbar-start">
                <Links/>
            </div>
        </div>
        </nav>
    )
}

const {string, array} = PropTypes;
BulmaNavbar.propTypes = {
    links: array,
    logoUrl: string
}

export default BulmaNavbar