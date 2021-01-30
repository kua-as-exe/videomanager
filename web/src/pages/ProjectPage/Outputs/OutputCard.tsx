import React from 'react'
import PropTypes from 'prop-types'
import { FaVideo } from 'react-icons/fa'
import DynamicFaIcon from '../../../components/shared/DynamicFaIcon'

function OutputCard({handleDelete=()=>{}, userID, projectID, resourceData }) {
    const fileName = resourceData
    /* const [infoModal, setInfoModal] = useState(false) */
    const src = `/api/user/${userID}/project/${projectID}/outputs/${fileName}`

    return (
        <div className="column is-6">
        
        {/* <BulmaModal show={infoModal} close={()=>setInfoModal(false)} title={`${name}`}>
            <pre>{JSON.stringify(resourceData, null, 2)}</pre>
        </BulmaModal> */}

        <div className="card">
            <header className="card-header">
                <p className="card-header-title pr-0" style={{whiteSpace: 'nowrap', overflowX: 'hidden'}}>
                    <span className="icon mr-2"><DynamicFaIcon fileType={'video/mp4'}/></span> 
                    <span>{fileName}</span>
                </p>
                <a href="#" className="card-header-icon" aria-label="more options">
                    <span className="icon">
                        <FaVideo/>
                    </span>
                </a>
            </header>
            <div className="card-content p-0">
                <video src={src} controls></video>
                {/* <div className="content">
                    <p>{fileName}</p>
                    <p><small>{id}</small></p>
                    {new Date(uploaded).toLocaleDateString()}
                </div> */}
            </div>
            {/* <footer className="card-footer">
                <a onClick={()=>console.log("A")} disabled={true} className="card-footer-item">Editar</a>
                <a onClick={()=>setInfoModal(true)} className="card-footer-item">Ver</a>
                <a onClick={handleDelete} className="card-footer-item">Eliminar</a>
            </footer> */}
        </div>
        </div>
    )
}

OutputCard.propTypes = {

}

export default OutputCard

