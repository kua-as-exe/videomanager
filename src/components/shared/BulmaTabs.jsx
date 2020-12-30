import React from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom'

// Based on Bulma
// https://bulma.io/documentation/components/tabs
// For everyone - Jorge Arreola

// bulma defaults classes
const activeClass = 'is-active'
const tabsStyles = {
    'default': '',
    'boxed': 'is-boxed',
    'toggle': 'is-toggle',
    'toggleRound': 'is-toggle-rounded'
}
const sizes = {
    'default': '',
    'small': 'is-small',
    'medium': 'is-medium',
    'large': 'is-large'
}
const aligns = {
    'left': '',
    'centered': 'is-centered',
    'right': 'is-right'
}

const BulmaTabs = React.memo((
    {   // default params
        base, 
        tabs = [{text:'', to:'', icon:<></>}], 
        tabsClass='', 
        tabsStyle="default",
        fullWith=false,
        align="left",
        size=''
    }) => {

    const location = useLocation()
    // Check if is on path
    const getNavLinkClass = (path) => location.pathname.includes(path) ? activeClass : '';

    return (
        <>
            {/* Display all the tabs */}
            <div className={`tabs ${tabsClass} ${fullWith? 'is-fullwidth': ''} ${sizes[size]} ${tabsStyles[tabsStyle]} ${aligns[align]}`}>
            <ul>
                {
                    tabs.map( tab => {
                        const {text, to, icon} = tab;
                        const url = base+'/'+to;
                        return (
                            // I nedded to get the activeClass on a separated function
                            // because the class needs to be on <li>, a parent element of <Link>   ( li > a(Link) )
                            <li key={to} className={getNavLinkClass(url)}>
                                <Link to={url}>
                                    {icon && <span className="icon is-small">{icon}</span>}
                                    <span>{text}&nbsp;</span>
                                    {/* I used "&nbsp;", the html code for a non-breaking space 
                                        because the Icon got bugged if there was no text*/}
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
            </div>

            {/* Route between the tabs  */}
            <Switch>
                {
                    tabs.map(tab => {
                        const {to, component} = tab;
                        return <Route key={to} path={`${base}/${to}`} component={component}></Route>
                    })
                }
                {/* If array is not void and any tab are specified, redirect to the first tab */}
                {tabs.length > 0 && <Redirect exact path={base} to={`${base}/${tabs[0].to}`}/>}
            </Switch>
        </>
    )
})

const {string, bool, element, arrayOf, shape} = PropTypes;

BulmaTabs.propTypes = {
    base: string.isRequired,
    tabs: arrayOf(shape({
        to: string.isRequired, 
        text: string, 
        icon: element
    })).isRequired,
    tabsClass: string,
    tabsStyle: string,
    fullWith: bool,
    align: string,
    size: string,
}

export default BulmaTabs

