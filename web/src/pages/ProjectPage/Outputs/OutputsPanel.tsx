import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { ProjectContext } from '../ProjectPage';
import { FaArrowsAlt, FaFileUpload, FaPlus } from 'react-icons/fa';
import useApi from 'use-http-api';
import { api } from '../../../api';
import { UserContext } from '../../Main';
import OutputCard from './OutputCard';

function OutputsPanel() {
    const {project: {id: projectID} } = useContext(ProjectContext);
    const {id: userID} = useContext(UserContext);
    
    const [{ loading, data}, getResources] = useApi({
        url: api.user(userID).project(projectID).outputs(),
        defaultData: [],
        autoTrigger: true,
        method: 'GET'
    });
    const resources = data as {
        id: string,
        [key: string]: any
    }[];

    return (
        <div className="box p-0">
            {loading? 
                <div>
                    <div className="notification">
                        Cargando
                    </div>
                </div>:
                <div className="columns p-3 is-multiline">
                    {resources && resources.map(resource => 
                        <OutputCard
                            userID={userID}
                            projectID={projectID}
                            key={resource.id}
                            resourceData={resource}/>
                    )}
                </div>
            }
        </div>
    )
}

OutputsPanel.propTypes = {

}

export default OutputsPanel

