import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { api } from '../../../api';
import BulmaModal from '../../../components/shared/BulmaModal';
import axios from 'axios';

import Dropzone from 'react-dropzone'
import { useArray } from 'react-recipes';

import { FaCross, FaCrosshairs, FaFile, FaTrash, FaUpload } from 'react-icons/fa';
import { UserContext } from '../../Main';
import { useParams } from 'react-router-dom';

const bytesToMegaBytes = (bytes, digits = 2) => digits ? (bytes / (1024*1024)).toFixed(digits) : (bytes / (1024*1024));

function UploadFileModal(props) {
    const {id: userID} = useContext(UserContext)
  
    const {
        add,
        clear,
        removeIndex,
        removeById,
        value: currentArray
      } = useArray([]);

    const handleDrop = (files = []) => {
        console.log(files)
        files.forEach( file => add(file) );
    }

    const FileList = ()=>{
        //console.log(currentArray);
        return currentArray.map((file, index) => (
            <a className="panel-block" key={file.name}>
                <span className="panel-icon">
                    <FaFile/>
                </span>
                <div className="container">
                <form>
                    <div className="field mb-0">
                        <span className="is-pulled-left mt-1">{file.name} ({bytesToMegaBytes(file.size)} MB)</span>
                    </div>
                    <div className="field m-0">
                        <button onClick={()=>removeIndex(index)} className="button is-danger is-small is-pulled-right">
                            <span className="icon is-small"><FaTrash/></span>
                        </button>
                    </div>
                </form>
                </div>
                
            </a>
        ))
    }

    const [loading, setLoading] = useState(false)

    const handleUpload = () => {
        console.log(currentArray)
        // Create an object of formData 
      const formData = new FormData(); 
     
      // Update the formData object
      currentArray.forEach( (file, index) => {
          formData.append( index, file);
      })
     
      // Request made to the backend api 
      // Send formData object 
      axios.post(api.user(userID).project(props.projectID).resources().upload(), formData)
        .then( (data)=> {
            console.log(data)
            if(data.status == 200){
                props.close();
                props.handleUpdate();
            }
        })
    }

    return (
        <BulmaModal 
            {...props}
            title="Subir archivos"
            footer={ 
                <button 
                    className="button is-success is-expanded is-fullwidth" 
                    disabled={currentArray.length == 0}
                    onClick={handleUpload}>
                        Subir
                </button> }
        >
            <div>
                <nav className="panel">
                    <p className="panel-heading">Repositories</p>
                    <div className="panel-block">
                        <Dropzone onDrop={handleDrop}>
                            {({getRootProps, getInputProps}) => (
                                <section>
                                <div {...getRootProps()}>
                                    <div className="field is-fullwidth">
                                        <div className="file is-fullwidth is-centered">
                                            <input {...getInputProps()} />
                                        <label className="file-label">
                                            
                                            <span className="file-cta  is-fullwidth">
                                            <span className="file-icon">
                                                <FaUpload/>
                                            </span>
                                            <span className="file-label  is-fullwidth">
                                                Arrastra tus archivos o da click para seleccionarlos
                                            </span>
                                            </span>
                                        </label>
                                        </div>
                                    </div>
                                </div>
                                </section>
                            )}
                        </Dropzone>
                    </div>
                    
                    <FileList/>
            
                </nav>
               
            </div>
        </BulmaModal>
    )
}

UploadFileModal.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
}

export default UploadFileModal

