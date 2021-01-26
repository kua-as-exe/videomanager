import React from 'react'
import PropTypes from 'prop-types'
import BulmaModal from './shared/BulmaModal'
import { useForm } from '../hooks/useForm';
import { api } from '../api';

function CreateProjectModal(props: {
    userID: string,
    done: ()=>void,
    close: ()=>void,
    [key: string]: any
}) {
    const initialForm = {
        name: '',
    };
    
    const [ formValues, handleInputChange, reset ] = useForm( initialForm );
    
    const createProject = () => {
        console.log(formValues);
        fetch(api.user(props.userID).projects().new(), {
            method: 'POST',
            body: JSON.stringify(formValues),
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(response => {
                console.log('Success:', response)
                if(props.done) props.done();
                props.close();
          });
    }

    return (
        <BulmaModal 
            {...props}
            title="Nuevo proyecto"
            footer={ <button className="button is-success is-expanded is-fullwidth" onClick={createProject}>Crear</button> }
        >
            <div>
                <input autoComplete="off" className="input" type="text" name="name" onChange={handleInputChange}/>
            </div>
        </BulmaModal>
    )
}

CreateProjectModal.propTypes = {

}

export default CreateProjectModal

