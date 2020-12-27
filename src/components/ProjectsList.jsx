import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa';
import useApi from 'use-http-api';
import { api } from '../api'
import { UserContext } from '../pages/Main';
import CreateProjectModal from './CreateProjectModal';
import ProjectCard from './ProjectCard';

export default function ProjectsList() {
    const user = React.useContext(UserContext)
    
    const [{ loading, data, error }, getProjects] = useApi({
        url: api.user(user.id).projects().get(), 
        defaultData: { projects: [] }, 
        autoTrigger: false
    });
    
    useEffect(() => {
        getProjects()
    }, [user])

    const [createModal, setCreateModal] = useState(false);

    const List = () => 
        <>
            <CreateProjectModal done={()=>getProjects()} userID={user.id} show={createModal} close={()=>setCreateModal(false)}/>
            <div className="box is-primary p-0">
                <div className="field p-0 m-0">
                    <button 
                        className="button m-1 is-success is-pulled-right"
                        onClick={()=>setCreateModal(true)}>
                    <FaPlus/></button>

                </div>
                <div className="field p-3 m-0">
                    <span>Mis videos</span>
                </div>
            </div>
            <div className="columns is-multiline">
                    {!loading && data.length && data.map( 
                        project => <ProjectCard key={project.id} {...project} userID={user.id}/>
                    )}
            </div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
    
    const Error = () => 
        <div class="notification is-danger">
            {String(error)}
        </div>
    

    const Loading = () => 
        <div className="notification is-warning">
            A
        </div>
    

    return loading? <Loading/>: (error? <Error/>: <List/>)
}
