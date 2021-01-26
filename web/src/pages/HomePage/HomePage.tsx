import React from 'react'
import ProjectsList from '../../components/ProjectsList'
import { UserContext } from '../Main'

export default function HomePage() {
    const user = React.useContext(UserContext)
    return (
        <>
            <section className="section mt-5">
            <div className="container">

                <div className="hero is-success is-bold">
                    <div className="hero-body">
                        <p className="subtitle is-3">Bienvenido <b>{user.name}</b></p>
                    </div>
                </div>
                
            </div>
            </section>
            
            <section className="section pt-1">
            <div className="container">

                <ProjectsList/>
                
            </div>
            </section>
            
        </>
    )
}
