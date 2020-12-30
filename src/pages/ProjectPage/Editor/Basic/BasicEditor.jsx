import React, { useContext, useEffect, useState, useCallback} from 'react'
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
    
    const nextVideo = useCallback( async (index) => {
        let newIndex = index < timeline.length-1? index + 1 : 0;
        if(newIndex < timeline.length-1 && timeline[newIndex].hidden){
            nextVideo(newIndex);
        }else{
            setEditor({...editor, current: newIndex})
        }
        return;
    }, [])

    useEffect(() => {
        console.log("A")
    }, [timeline])

    /* const getTotalDuration = () => {
        let duration = 0;
        editor.resources.forEach( r => duration += r?.metadata?.format?.duration | 0)
        return toHHMMSS(duration);
    } */

    /* useEffect(() => {
        console.log(resources);
        let timeline = resources.map(resource => ({
            id: resource.id,
            hidden: false
        }))
        setEditor({
            current: 0,
            duration: 0,
            timeline
        })
    }, [resources]) */

    return (
        <>
            <div className="box">
            <div className="columns">
                
                <div className="column is-5">
                        <ResourcesList
                            button={
                               ( <button className="button is-link is-outlined is-fullwidth" onClick={()=>alert("A")}>
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

