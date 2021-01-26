import React, { useContext } from 'react'
import { ProjectContext } from '../ProjectPage'

export default function About() {
    const {project} = useContext(ProjectContext)
    return (
        <div>
            <pre>{JSON.stringify(project, null, 2)}</pre>
        </div>
    )
}
