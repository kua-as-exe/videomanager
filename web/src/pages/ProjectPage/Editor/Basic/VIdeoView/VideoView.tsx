import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {useVideo} from 'react-use';

function VideoView({current: {fileName}, currentIndex, mediaPathBase, nextVideo}) {
    const [video, state, controls, ref] = useVideo(
        <video src={`${mediaPathBase}/${fileName}`} controls/>
    );

    useEffect(() => {
        if(state.paused == false && state.time == state.duration)
            nextVideo(currentIndex).then(
                () => setTimeout(
                    () => controls.play()
                    , 100)
                )
        
        
    }, [state.time])

    return (
        <div>
            <div>
                {video}
            </div>
            {/* <div>
                <pre>{JSON.stringify(state, null, 2)}</pre>
            </div> */}
        </div>
    )
}

VideoView.propTypes = {

}

export default VideoView

