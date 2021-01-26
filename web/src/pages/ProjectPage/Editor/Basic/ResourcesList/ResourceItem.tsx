import React from 'react'
import PropTypes from 'prop-types'
import DynamicFaIcon from '../../../../../components/shared/DynamicFaIcon'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const toHHMMSS = (seconds)  => new Date(seconds * 1000).toISOString().substr(11, 8)

function ResourceItem({current, hidden, id, index, setCurrent, resources, setVideo}): React.ReactElement {
    
    let item = Object.assign({}, resources[id]);
    let {name, metadata} = item;
    let duration = toHHMMSS(metadata.format.duration);

    const handleToggleHide = () => {
        setVideo(index, 'toggleHidden')
    }

    return (
        <a 
            className={`panel-block has-tooltip-right ${''}`} 
            data-tooltip={`${duration}`}
            //data-tooltip={`${JSON.stringify(item, null, 2)}`}
            >

            <span className="panel-icon ">
                <DynamicFaIcon playback={index == current? 'current': ''}/>
            </span>
            <span 
                style={{color: hidden? 'gray':''}}
                onClick={()=>{setCurrent(index)}}>
                    {name}
            </span>
            <div className="field has-addons is-float-right" style={{marginLeft: 'auto'}}>
                <button 
                    className={`button is-small ${hidden? '': 'is-info'}`}
                    onClick={handleToggleHide}
                    >{hidden? <FaEyeSlash/>: <FaEye/>}</button>
            </div>
        </a>
    )
}

ResourceItem.propTypes = {

}

export default ResourceItem

