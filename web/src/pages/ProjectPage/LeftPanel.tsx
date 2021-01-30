import React, { useContext } from 'react'
import { FaArrowLeft, FaTrash } from 'react-icons/fa'
import { Link, useHistory } from 'react-router-dom'
import { api } from '../../api';

export default React.memo( ({userID, projectData}:{
    projectData
    userID
}) => {
    const {name, thumbnail, id, prefix, lastEdit, id: projectID} = projectData;
    console.log("Left panel");
    const history = useHistory();
    const handleDelete = async () => {
        const url = api.user(userID).project(projectID).delete();
        const data = await(await fetch(url, {method: 'POST'})).json();
        if(data.error) {console.error(data.error); return;}
        history.push('/');
    }

    return (
        <>
            <Link className="button is-fullwidth is-primary mb-3 has-text-left	" to="/">
            <span className="icon is-small">
                <FaArrowLeft className="fas fa-align-left"/>
            </span>
            <span>Volver</span>
            </Link>

            <div className="box">
                <figure className="image is-4by3 mb-3">
                    <img src={thumbnail}/>
                </figure>
                {/* <hr/> */}
                <p className="title is-5">{name}</p>
                <p className="subtitle is-6">{prefix}</p>
                <hr/>
                <p>{new Date(lastEdit).toLocaleDateString()}</p>
            </div>

            <button 
                className="button is-danger is-fullwidth"
                onClick={handleDelete}
                >

                <span className="icon is-small">
                    <FaTrash className="fas fa-align-left"/>
                </span>
                <span>Eliminar</span>
            </button>
        </>
    )
});
