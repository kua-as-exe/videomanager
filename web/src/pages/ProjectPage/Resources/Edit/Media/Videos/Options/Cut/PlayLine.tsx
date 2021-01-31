import React from 'react';
import styled from 'styled-components'

const A = styled.div`
    width: 2px;
    padding: 0px;
    height: 50px;
    background: gray;
    z-index: 500000000;
    position: relative;
    margin-bottom: -50px;
`
const Container = styled.div`
    margin-top: 0.25rem;
    padding-bottom: 2.5px;
`

const PlayLine = ({time = 0, duration = 0}) => {
    const percent = time/duration*100;
    return (
        <Container>
            <A style={{left: percent+'%'}}/>
        </Container>
    )
}

export default React.memo(PlayLine)

