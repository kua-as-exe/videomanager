import React from 'react'
import PropTypes from 'prop-types'
import { FaCircle, FaFile, FaIcons, FaImage, FaMusic, FaPlay, FaVideo } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'

const fileTypeIcons = {
    'audio': FaMusic,
    'video': FaVideo,
    'image': FaImage,
    'default': FaFile
}

const playbackIcons = {
    'current': FaPlay,
}

function DynamicFaIcon({fileType, playback, exact = false, ...rest}:{
    fileType?: string;
    playback?: string;
    exact?: boolean;
    [key: string]: any 
}) {
    let Icon: IconType = FaIcons;
    if(fileType){
        Icon = FaFile
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
    if(playback){
        if(exact)
            Icon = playbackIcons[playback] || Icon;
        else {
            Icon = playbackIcons[
                    Object.keys(playbackIcons)
                        .find(  type => 
                            playback.toLowerCase()
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

