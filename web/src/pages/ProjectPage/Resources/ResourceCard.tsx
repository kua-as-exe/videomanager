import React, { useRef, useState } from 'react'
import { FaArrowCircleDown } from 'react-icons/fa';

import PropTypes from 'prop-types'
import { ProjectContext } from '../ProjectPage';
import DynamicFaIcon from '../../../components/shared/DynamicFaIcon';
import { useContext } from 'react/cjs/react.development';
import BulmaModal from '../../../components/shared/BulmaModal';
import PrimeInplaceText from '../../../components/shared/PrimeInplaceText';
import EditSidebar from './Edit/EditSidebar';
import PreviewMedia from '../../../components/shared/PreviewMedia';

function ResourceCard({handleDelete, userID, projectID, resourceData }) {
    const { fileName, uploaded, id, mimetype } = resourceData;
    const [infoModal, setInfoModal] = useState(false);
    const [sidebar, setSidebar] = useState(false);

    const [name, setName] = useState(resourceData.name);
    const src = `/api/user/${userID}/project/${projectID}/resources/${fileName}`;


    return (
        <div className="column is-4">
        <EditSidebar sidebar={sidebar} setSidebar={setSidebar} {...{projectID, userID, resourceData}}/>
        <BulmaModal show={infoModal} close={()=>setInfoModal(false)} title={`${name}`}>
            <pre>{JSON.stringify(resourceData, null, 2)}</pre>
        </BulmaModal>

        <div className="card">
            <header className="card-header">
                <div className="card-header-title pr-0" style={{whiteSpace: 'nowrap', overflowX: 'hidden'}}>
                    <span className="icon mr-2"><DynamicFaIcon fileType={mimetype}/></span> 
                    <PrimeInplaceText
                        value={name}
                        setValue={setName}
                    />
                </div>
                <a href="#" className="card-header-icon" aria-label="more options">
                    <span className="icon">
                        <FaArrowCircleDown/>
                    </span>
                </a>
            </header>
            <div className="card-content p-0">
                <PreviewMedia src={src} mimetype={mimetype} controls/>
                {/* <div className="content">
                    <p>{fileName}</p>
                    <p><small>{id}</small></p>
                    {new Date(uploaded).toLocaleDateString()}
                </div> */}
            </div>
            <footer className="card-footer">
                <a onClick={()=>setSidebar(true)} className="card-footer-item">Editar</a>
                <a onClick={()=>setInfoModal(true)} className="card-footer-item">Ver</a>
                <a onClick={handleDelete} className="card-footer-item">Eliminar</a>
            </footer>
        </div>
        </div>
    )
}

ResourceCard.propTypes = {

}

export default React.memo(ResourceCard)

