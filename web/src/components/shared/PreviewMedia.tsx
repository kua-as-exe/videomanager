import React from 'react'
import PropTypes from 'prop-types'

function PreviewMedia({src, mimetype, ...rest}) {
    const is = (type) => String(mimetype).includes(type);
    if( is('video') )
        return <video src={src} controls></video>
    if( is('image') )
        return <img src={src}/>
    if( is('audio') )
        return <audio src={src} controls style={{width: '100%'}}/>
        
    return <>No preview</>
}

PreviewMedia.propTypes = {
    src: PropTypes.string.isRequired,
    mimetype: PropTypes.string.isRequired
}

export default PreviewMedia

