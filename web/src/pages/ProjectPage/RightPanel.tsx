import React, { useContext } from 'react'
import { FaAccessibleIcon, FaArrowCircleDown, FaCode, FaDashcube, FaEnvelopeOpenText, FaFileArchive, FaMusic, FaTools, FaVideo } from 'react-icons/fa'
import BulmaTabs from '../../components/shared/BulmaTabs'
import ResourcesPanel from './Resources/ResourcesPanel';
import {ProjectContext} from './ProjectPage';
import About from './About/About';
import ProcessPanel from './Editor/ProcessPanel';
import OutputsPanel from './Outputs/OutputsPanel';

const EnProceso = ()=><p className="title is-1 is-fullwidth has-text-centered p-5">En proceso <FaTools/></p>

export default React.memo(({base}:{base})=>{
    console.log("Right Panel");

    return (
        <>
            <BulmaTabs 
                base={base}
                tabsClass="mb-3"
                fullWith={true}
                tabsStyle="default"
                align="centered"
                tabs={[
                    {
                        text: 'Recursos', to: 'resources', icon: <FaFileArchive/>,
                        component: ResourcesPanel
                    },
                    {
                        text: 'Editor', to: 'edit', icon: <FaVideo/>,
                        component: ()=><ProcessPanel tabsBase={base+'/edit'}/>
                    },
                    {
                        text: 'Salidas', to: 'outputs',  icon: <FaVideo/>,
                        component: OutputsPanel,
                    },
                    {
                        text: '', to: 'about',  icon: <FaCode/>,
                        component: About,
                    },
                ]}/>
        </>
    )
})