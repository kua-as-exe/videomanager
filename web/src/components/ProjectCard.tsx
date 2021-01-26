import React from 'react'
import PropTypes from 'prop-types'
import { Link, useRouteMatch, useLocation } from 'react-router-dom'

function ProjectCard({id, name, prefix, thumbnail, tags, lastEdit, userID}) {
    const route = useLocation();
    console.log(route);
    return (
        <Link className="column is-3 is-half-mobile" to={`/${userID}/${id}`}>
            <div className="card">
                <div className="card-image">
                    <figure className="image is-4by3">
                    <img src={thumbnail} alt="Placeholder image"/>
                    </figure>
                </div>
                
                <div className="card-content p-4">

                    <div className="content">
                        <h6 className="mb-1">{name}</h6>
                        {tags && <div className="tags">
                            {tags.map(tag => <span className="tag is-primary">{tag}</span>)}
                        </div>}
                        <time dateTime={lastEdit}>{new Date(lastEdit).toLocaleString()}</time>
                    </div>
                </div>
            </div>
        </Link>
    )
}

ProjectCard.propTypes = {

}

export default ProjectCard

