import React, { useRef, useState } from 'react'
import { FaArrowCircleDown } from 'react-icons/fa';

import PropTypes from 'prop-types'
import { ProjectContext } from '../ProjectPage';
import DynamicFaIcon from '../../../components/shared/DynamicFaIcon';
import { useContext } from 'react/cjs/react.development';

function ResourceCard({name, fileName, uploaded, id, mimetype, projectID, handleDelete, userID}) {
    const src = `/api/user/${userID}/project/${projectID}/resources/${name}`

    return (
        <div className="column is-4">
        <div className="card">
            <header className="card-header">
                <p className="card-header-title pr-0" style={{whiteSpace: 'nowrap', overflowX: 'hidden'}}>
                    <span className="icon mr-2"><DynamicFaIcon fileType={mimetype}/></span> 
                    <span>{name}</span>
                </p>
                <a href="#" className="card-header-icon" aria-label="more options">
                    <span className="icon">
                        <FaArrowCircleDown/>
                    </span>
                </a>
            </header>
            <div className="card-content p-0">
                {String(mimetype).includes('video') && <video src={src} controls></video>}
                {String(mimetype).includes('image') && <img src={src}/>}
                {String(mimetype).includes('audio') && <audio src={src} controls style={{width: '100%'}}/>}
                {/* <div className="content">
                    <p>{fileName}</p>
                    <p><small>{id}</small></p>
                    {new Date(uploaded).toLocaleDateString()}
                </div> */}
            </div>
            <footer className="card-footer">
                <a onClick={()=>console.log("A")} className="card-footer-item">Ver</a>
                <a onClick={()=>console.log("A")} className="card-footer-item">Editar</a>
                <a onClick={handleDelete} className="card-footer-item">Eliminar</a>
            </footer>
        </div>
        </div>
    )
}

ResourceCard.propTypes = {

}

export default React.memo(ResourceCard)

