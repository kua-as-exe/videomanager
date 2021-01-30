import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import PreviewMedia from '../../../../components/shared/PreviewMedia';
import EditVideo from './Media/Videos/EditVideo';

export const ResourceContext: React.Context<{
    resourceData?: {
        name
        mimetype
        size
        fileName
        metadata?: any
    }
}> = React.createContext({})

export default ({sidebar, setSidebar, userID, projectID, resourceData, ...rest}) => {
    const {fileName, mimetype} = resourceData;
    const src = `/api/user/${userID}/project/${projectID}/resources/${fileName}`;

    return (
        <Sidebar visible={sidebar} fullScreen baseZIndex={10000000} onHide={() => setSidebar(false)}>
            <ResourceContext.Provider value={{resourceData}}>
            {
            String(mimetype).includes('video')?
            <EditVideo/>:
            <div className="columns">
                <div className="column is-6">
                        
                </div>
                <div className="column">
                    <h1 style={{ fontWeight: 'normal' }}>{JSON.stringify(resourceData, null, 2)}</h1>
                    <Button type="button" onClick={() => setSidebar(false)} label="Save" className="p-button-success" style={{ marginRight: '.25em' }} />
                    <Button type="button" onClick={() => setSidebar(false)} label="Cancel" className="p-button-secondary" />
                </div>
            </div>
            }
            </ResourceContext.Provider>
        </Sidebar>
    )
}