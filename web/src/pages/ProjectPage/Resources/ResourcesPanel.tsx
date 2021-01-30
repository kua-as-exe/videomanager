import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { ProjectContext } from '../ProjectPage';
import ResourceCard from './ResourceCard';
import { FaArrowsAlt, FaFileUpload, FaPlus, FaRecordVinyl } from 'react-icons/fa';
import UploadFileModal from './UploadFileModal';
import useApi from 'use-http-api';
import { api } from '../../../api';
import { UserContext } from '../../Main';
import { Toast } from 'primereact/toast';
import { Switch, Route, useParams } from 'react-router-dom';
import EditSidebar from './Edit/EditSidebar';

import Record from './Record/Record';

const ResourcesNavbar = React.memo(({projectID, handleUpdate}:{
    projectID, handleUpdate
}) => {
    const [uploadModal, setUploadModal] = useState(false)
    const [recordModal, setRecordModal] = useState(false)
    
    return(
    <div className="navbar is-dark">
        <Record show={recordModal} close={()=>setRecordModal(false)}  {...{projectID, handleUpdate}}/>
        <UploadFileModal show={uploadModal} close={()=>setUploadModal(false)} {...{projectID, handleUpdate}}/>
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
                <button 
                    className="button is-small is-danger"
                    onClick={()=>setRecordModal(true)}>
                    <span className="icon is-small">
                        <FaRecordVinyl />
                    </span>
                </button>                                                                            
            </div>
        </div>
    </div>
)})

function ResourcesPanel({}) {
    const {project, projectDispatch} = React.useContext(ProjectContext);
    const {id: projectID} = project || {};
    const {id: userID} = useContext(UserContext);
    const toast = React.useRef(null);

    
    const [resources, setResources] = useState([])
    const [{ loading, data, error}, getResources] = useApi({
        url: api.user(userID).project(projectID).resources().get(),
        defaultData: [], autoTrigger: false, method: 'GET'
    });
    const resourcesData = data as any
    const [{status: deleteStatus, error: deleteError}, deleteResource] = useApi({
        url: api.user(userID).project(projectID).resources().delete(), defaultData: [], autoTrigger: false, method: 'POST'
    });
    
    if(error) console.log(error)
    const handleUpdate = useCallback(() =>  getResources(), [projectID] )

    const handleDelete = useCallback((resourceID)=> {
        deleteResource({resourceID})
        .then(()=> {
            toast.current.show({severity: 'info', summary: 'Recurso eliminado', detail: 'Directito a la papelera'});
            setResources(resources.filter( res => res && res.id !== resourceID))
        })
    }, [projectID, resources])
    React.useEffect( ()=>{
        if(error) return;
        console.log(resourcesData)
        setResources(resourcesData)
    }, [resourcesData])
    React.useEffect( () => {
        getResources()
    },[])
   
    return (
        <div className="box p-0">
            <Toast ref={toast} />
            <ResourcesNavbar
                {...{ projectID, handleUpdate }}
                />
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

