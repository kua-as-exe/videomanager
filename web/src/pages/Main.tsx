import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Navbar from '../components/shared/BulmaNavbar'
import HomePage from './HomePage/HomePage'
import ProjectPage from './ProjectPage/ProjectPage'
import { useParams } from 'react-router-dom'

export const UserContext = React.createContext({ name:'', id: ''})

function Main() {
    const [user, setUser] = useState({name: '', id: '', logo: '/logo.png'})
    const { userID } = useParams();
    
    useEffect(() => {
        setUser({id: userID, name: userID, logo: user.logo});
    }, [userID])

    return (
        <div>
        <UserContext.Provider value={user}>

            <Navbar
                logoUrl = {user.logo}
                brandText={user.name}
                links = {[
                    {text:'Inicio', to:"/"}, 
                    {text:'Panel', to:`/${userID}/dashboard`, invisible: true}, 
                    {text:'Videos', to:`/${userID}/videos`, invisible: true}, 
                    {text:'Musikita', to:`/${userID}/musikita`, invisible: true}, 
                ]}
            />
            <Switch>
                <Route path="/:userID/:projectID" component={ProjectPage}/>
                <Route path="/" component={HomePage}/>
                <Redirect path="/" to="/user/Cranki220"/>
            </Switch>
        </UserContext.Provider>
        </div>
    )
}

export default Main;