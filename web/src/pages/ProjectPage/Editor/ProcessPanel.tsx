import React, {useContext, useEffect, useState} from 'react'
import { FaList, FaSolarPanel, FaToolbox } from 'react-icons/fa'
import useApi from 'use-http-api';
import { api } from '../../../api';
import BulmaTabs from '../../../components/shared/BulmaTabs'
import { UserContext } from '../../Main';
import { ProjectContext } from '../ProjectPage';
import BasicEditor from './Basic/BasicEditor'

export default React.memo(({tabsBase}: {tabsBase: any})=>{
    const {project: {id: projectID}} = useContext(ProjectContext);
    const {id: userID} = useContext(UserContext);
    const [resources, setResources] = useState({})
    const [{ loading: resourcesLoading, data, error, initialLoad: resourcesInitialLoad}, getResources] = useApi({
        url: api.user(userID).project(projectID).resources().get(),
        defaultData: [],
        method: 'GET',
        autoTrigger: false
    });
    const resourcesArray = data as any[]
    useEffect(() => {
        let temp = {}
        resourcesArray.filter(r => r.mimetype.includes('video')).forEach(r => {
            temp[r.id] = r;
        })
        setResources(temp);
    }, [resourcesArray])

    return (
        <div>
            {
                error ? 
                    <div className="notification is-danger">
                        <pre>{JSON.stringify(error, null, 2)}</pre>
                    </div>
                :
                resourcesInitialLoad || resourcesLoading ?
                    <div className="notification is-success">CARGANDO...</div>
                :
                    <BulmaTabs 
                        base={tabsBase}
                        tabsClass="mb-3"
                        fullWith={false}
                        tabsStyle="default"
                        align="left"
                        size="small"
                        tabs={[
                            {
                                text: 'Básico',
                                to: 'a', 
                                component: ()=><BasicEditor
                                                    {...{ projectID, userID, resources }}/>,
                                icon: <FaList/>
                            },
                            {
                                text: 'Avanzado',
                                to: 'b', 
                                component: ()=><p className="title is-1"> Próximamente <FaToolbox/></p>,
                                icon: <FaSolarPanel/>
                            },
                        ]}/>
            }
        </div>
    )
})
