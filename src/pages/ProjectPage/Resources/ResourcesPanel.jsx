import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { ProjectContext } from '../ProjectPage';
import ResourceCard from './ResourceCard';
import { FaArrowsAlt, FaFileUpload, FaPlus } from 'react-icons/fa';
import UploadFileModal from './UploadFileModal';
import useApi from 'use-http-api';
import { api } from '../../../api';
import { UserContext } from '../../Main';

const ResourcesNavbar = React.memo(({projectID, handleUpdate}) => {
    const [uploadModal, setUploadModal] = useState(false)
    return(
    <div className="navbar is-dark">
        <UploadFileModal show={uploadModal} close={()=>setUploadModal(false)} projectID={projectID} handleUpdate={handleUpdate}/>
        <div className="navbar-brand buttons">
            <div className="navbar-end navbar-item">
                <button className="button is-small is-success">
                    <span className="icon is-small">
                        <FaPlus />
                    </span>
                </button>                                       
                <button 
                    className="button is-small is-primary"
                    onClick={()=>setUploadModal(true)}>
                    <span className="icon is-small">
                        <FaFileUpload />
                    </span>
                </button>                                       
                <button 
                    className="button is-small is-info"
                    onClick={()=>handleUpdate()}>
                    <span className="icon is-small">
                        <FaArrowsAlt />
                    </span>
                </button>                                       
            </div>
        </div>
    </div>
)})

function ResourcesPanel({}) {
    const {project: {id: projectID}, projectDispatch} = useContext(ProjectContext);
    const {id: userID} = useContext(UserContext);
    
    const [{ loading, data: resources}, getResources] = useApi({
        url: api.user(userID).project(projectID).resources().get(),
        defaultData: [],
    });
    const [{status: deleteStatus, error}, deleteResource] = useApi({
        url: api.user(userID).project(projectID).resources().delete(), defaultData: [], autoTrigger: false, method: 'POST'
    });
    if(error) console.log(error)
    const handleUpdate = useCallback(() =>  getResources(), [projectID] )
    const handleDelete = useCallback((resourceID)=> {
        deleteResource({resourceID})
        .then(()=> {
            getResources();
        })
    }, [projectID])
    
    return (
        <div className="box p-0">
            <ResourcesNavbar projectID={projectID} handleUpdate={handleUpdate}/>
            {loading? 
                <div>
                    <div className="notification">
                        Cargando
                    </div>
                </div>:
                <div className="columns p-3 is-multiline">
                    {resources && resources.map(resource => 
                        <ResourceCard
                            userID={userID}
                            projectID={projectID}
                            handleDelete={()=>handleDelete(resource.id)}
                            key={resource.id}
                            resourceData={resource}/>
                    )}
                </div>
            }
        </div>
    )
}

ResourcesPanel.propTypes = {

}

export default React.memo(ResourcesPanel)

