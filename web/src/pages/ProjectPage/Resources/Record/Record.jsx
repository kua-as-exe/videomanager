import React from 'react'
import PropTypes from 'prop-types'
import VideoRecorder from 'react-video-recorder'
import styled from 'styled-components'
import Actions from './Actions/Actions'

const RecorderWraper = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
`

function Record({show, close, projectID, handleUpdate}) {
    if(!show) return <></>


    return (
        <RecorderWraper>
            <VideoRecorder
                renderActions={Actions}
                
                onRecordingComplete={videoBlob => {
                    // Do something with the video...
                    console.log('videoBlob', videoBlob)
                    close();
                }}
            />
        </RecorderWraper>
    )
}

Record.propTypes = {

}

export default Record

