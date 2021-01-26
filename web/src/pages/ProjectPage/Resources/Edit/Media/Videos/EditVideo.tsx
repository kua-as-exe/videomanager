import React from 'react'
import Cut from './Options/Cut/Cut'

export default function EditVideo() {
    /* const sections = [
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
    ]

    return (
        <>
    {     }   <BulmaTabs 
                base={base}
                tabsClass="mb-3"
                fullWith={true}
                tabsStyle="default"
                align="centered"
                tabs={sections}/>
    {    <}/>
    ) */
    return (
        <>
            <Cut/>
        </>
    )
}
