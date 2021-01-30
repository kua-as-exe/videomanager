import React, { useEffect, useReducer, useState, useContext } from 'react'
import {api} from '../../api';
import { Link, useParams } from 'react-router-dom'
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import useApi from 'use-http-api';
import { UserContext } from '../Main';
import { useLocation } from 'react-router-dom';

const Error = ({title, message}) => (
    <div className="notification is-danger">
        <p className="title is-3">{title}</p>
        {message && <p>{message}</p>}
        <Link className="button is-primary" to="/">Go back to projects</Link>
    </div>
)
export interface ProjectData {
    id: string
}
export const ProjectContext: React.Context<{
    project?: ProjectData,
    projectDispatch?: ()=>{}
}> = React.createContext({});

export default function ProjectPage() {
    const { projectID, userID } = useParams();
    
    let [{loading, data, error, initialLoad}, getProject] = useApi({
        url: api.user(userID).project(projectID).get(),
        autoTrigger: false,
        defaultData: {project: {}},
        method: 'GET'
    })
    const project = data as ProjectData;
    
    const [{}, refreshProject] = useApi({
        url: api.user(userID).project(projectID).resources().refresh(), 
        defaultData: [], autoTrigger: false, method: 'POST'
    });

    useEffect(() => {
        ( async ()=>{
            await refreshProject();
            await getProject();
        })()
    }, [])


    return (
        <ProjectContext.Provider value={{project}}>
        <div>
            <section className="section mt-5 ">
            <div className="container">

            {   
                initialLoad || loading? <>CARGANDO</>:
                error?
                    <Error title="Wops :(" message={error}/>
                :
                <div className="columns">

                    <div className="column is-3">
                        <LeftPanel userID={userID} projectData={project}/>
                    </div>
                    <div className="column is-9">
                        <RightPanel base={`/${userID}/${projectID}`}/>
                    </div>

                </div>
            }
            </div>
            </section>   
        </div>
        </ProjectContext.Provider>
    )
}
