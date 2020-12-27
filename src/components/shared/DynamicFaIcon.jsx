import React from 'react'
import PropTypes from 'prop-types'
import { FaCircle, FaFile, FaImage, FaMusic, FaVideo } from 'react-icons/fa'

const fileTypeIcons = {
    'audio': FaMusic,
    'video': FaVideo,
    'image': FaImage,
    'default': FaFile
}

function DynamicFaIcon({fileType = 'default', exact = false, ...rest}) {
    let Icon = FaFile
    if(fileType){
        if(exact)
            Icon = fileTypeIcons[fileType] || Icon;
        else {
            Icon = fileTypeIcons[
                    Object.keys(fileTypeIcons)
                        .find(  type => 
                            fileType.toLowerCase()
                            .includes(type.toLowerCase()
                    ))]
                || Icon
        }
    }
    return <Icon {...rest}/>
}

DynamicFaIcon.propTypes = {
    exact: PropTypes.bool,
    fileType: PropTypes.string
}

export default React.memo(DynamicFaIcon)

