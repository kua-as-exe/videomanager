import React, { useContext, useEffect, useState, useCallback} from 'react'
import useApi from 'use-http-api';
import { api } from '../../../../api';
import { ResourcesList } from './ResourcesList/ResourcesList';
import VideoView from './VIdeoView/VideoView';

const toHHMMSS = (seconds)  => new Date(seconds * 1000).toISOString().substr(11, 8)
const toMMSS = (seconds)  => new Date(seconds * 1000).toISOString().substr(14, 5)

function BasicEditor({projectID, userID, resources}) {

    const [editor, setEditor] = useState({
        current: 0,
        duration: 0,
        timeline: []
    });
    const {current, duration, timeline} = editor;

    useEffect(() => {
        let timeline = Object.keys(resources).map(resource => ({
            id: resources[resource].id,
            hidden: false
        }))
        let duration = 0;
        timeline.filter(h => h.hidden == false).forEach( (item) => {
            duration += resources[item.id]?.metadata?.format?.duration | 0;
        })
        setEditor({
            current: 0,
            duration,
            timeline
        })
    }, [resources])

    const changeEditorState = (key, value) => setEditor({ ...editor, [key]: value })
    const setTimeline = (items) => changeEditorState('timeline', items)
    const setCurrent = (index) => changeEditorState('current', index )

    const setVideo = (index, action, payload) => {
        let items = Object.assign([], timeline);
        switch (action) {
            case 'toggleHidden':
                    items[index].hidden = !items[index].hidden
                break;
            default:
                break;
        }
        let duration = 0;
        items.filter(h => h.hidden == false).forEach( (item) => {
            duration += resources[item.id]?.metadata?.format?.duration | 0;
        })

        setEditor({
            ...editor,
            timeline: items,
            duration
        })
        //changeEditorState('timeline', items);
    }
    
    const nextVideo = async (index) => {
        let newIndex = index < timeline.length-1? index + 1 : 0;
        if(newIndex < timeline.length && timeline[newIndex].hidden){
            nextVideo(newIndex);
        }else{
            console.log(newIndex)
            changeEditorState('current', newIndex);
        }
        return;
    };

    useEffect(() => {
        console.log("A")
    }, [timeline])

    const [ processResponse, process] = useApi({
        url: api.user(userID).project(projectID).resources().mergeVideos(),
        defaultData: [], autoTrigger: false, method: 'POST'
    });
    useEffect(()=>{
        console.log(processResponse);
    }, [processResponse])
    const handleProcess = () => {
        process({
            timeline: timeline.filter(r => !r.hidden).map( r => (
                //id: r.id,
                resources[r.id].fileName
            ))
        })
    }
    
    if(processResponse.loading){
        return (
            <div className="box">
                <div className="notification is-info">PROCESANDO</div>
            </div>
        )
    }

    return (
        <>
            <div className="box">
            <div className="columns">
                
                <div className="column is-5">
                        <ResourcesList
                            button={
                               ( <button className="button is-link is-outlined is-fullwidth" disabled={Object.keys(resources).length == 0 || duration == 0} onClick={handleProcess}>
                                    Boton para hacer algo
                                </button>)
                            }
                            setCurrent={setCurrent}
                            setVideo={setVideo}
                            current={editor.current}
                            resources={resources}
                            items={Object.assign([], editor.timeline)} 
                            setItems={setTimeline}/>
                        
                        <div className="notification is-primary">
                            <p>Duración total: <b>{duration < 3600? toMMSS(duration):toHHMMSS(duration)}</b> </p>
                        </div>
                    
                </div>
                <div className="column is-7">
                    {   current != undefined && timeline[current] && resources[timeline[current].id] && 
                        <VideoView
                        nextVideo={nextVideo}
                        mediaPathBase={`/api/user/${userID}/project/${projectID}/resources`}
                        currentIndex={current}
                        current={resources[timeline[current].id]}
                        /> 
                    }
                </div>
            </div>
            </div>
            <div className="columns">
                <div className="column is-6"><div className="notificacion"><pre>{JSON.stringify(editor, null, 2)}</pre></div></div>
                <div className="column is-6"><div className="notificacion"><pre>{JSON.stringify(resources, null, 2)}</pre></div></div>
            </div>
        </>
    )
}

BasicEditor.propTypes = {

}

export default React.memo(BasicEditor)

