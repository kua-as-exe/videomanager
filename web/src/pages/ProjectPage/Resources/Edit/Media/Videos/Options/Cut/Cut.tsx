import React from 'react'

import { ResourceContext } from '../../../../EditSidebar'
import { bytesToMegaBytes, getTotalSeconds } from '../../../../../../../../helpers'
import { ProjectContext } from '../../../../../../ProjectPage'
import { UserContext } from '../../../../../../../Main'

import TimeRange from 'react-timeline-range-slider' 
import { Tag } from 'primereact/tag';
import {useVideo} from 'react-use';

import { format, set, addSeconds, formatDistance } from "date-fns";
import ClipsList from './ClipsList'

import {generate} from 'randomstring';

import { Button } from 'primereact/button'
import { Slider } from 'primereact/slider';
import {SplitButton} from 'primereact/splitbutton';
import {InputSwitch} from 'primereact/inputswitch';
// @ts-ignore
import { Splitter, SplitterPanel } from 'primereact/splitter';

import ProcessDialogue from './ProcessDialogue'
import { useDebounce } from "react-recipes";

import {isEqual} from 'lodash';
import PlayLine from './PlayLine'
import './Cut.scss'

const now = new Date();
const clearDate = set(now, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });

export const PROCESS_MODES = {
    SAVE_INDEPENDENT: 'Guardar por separado',
    PROCESS_INDEPENDENT: 'Procesar por separado',
}

function Cut() {
    const {id: userID} = React.useContext(UserContext)
    const {project: {id: projectID}} = React.useContext(ProjectContext)
    const {resourceData} = React.useContext(ResourceContext)
    const {name, mimetype, size, fileName} = resourceData
    const duration = resourceData?.metadata?.format?.duration || -1;
    
    const src = `/api/user/${userID}/project/${projectID}/resources/${fileName}`;
    const [video, state, controls, videoRef] = useVideo( <video src={src} controls /> );

    const [selectedInterval, setSelectedInterval] = React.useState([ clearDate, addSeconds(clearDate, duration) ])
    const debouncedSelectedInterval = useDebounce(selectedInterval, 200);
    const timelineInterval = [ clearDate, addSeconds(clearDate, duration) ];
    const [error, setError] = React.useState(false);
    const [playOnSeek, setPlayOnSeek] = React.useState(false);
    const [timelineZoom, setTimelineZoom] = React.useState(1);
    const [fit, setFit] = React.useState(false);
    
    const onChangeCallback = (interval) => setSelectedInterval(interval);
    React.useEffect( () => {
        let {time, paused} = state;
        let startSecond = getTotalSeconds(selectedInterval[0]);
        let endSecond = getTotalSeconds(selectedInterval[1]);
        if(fit && !paused){
            if(time < startSecond)
                controls.seek(startSecond);
            if(time > endSecond){
                controls.seek(endSecond);
                controls.pause()
            }
        }
    }, [state, selectedInterval])

    const goStart = () => {
        controls.seek(getTotalSeconds(selectedInterval[0]));
        controls.play()
    }
    const goEnd = () => {
        controls.seek(getTotalSeconds(selectedInterval[1])-2);
        controls.play();
    }

    React.useEffect(() => {
        if(format(debouncedSelectedInterval[0], "HH:mm:ss") !== format(selectedInterval[0], "HH:mm:ss")){
            goStart()
        } else if( format(debouncedSelectedInterval[1], "HH:mm:ss") !== format(selectedInterval[1], "HH:mm:ss")){
            goEnd()
        }
        
    }, [selectedInterval])
    
    const [clips, setClips] = React.useState([/* {id: '', name: '', interval: [new Date(), new Date()]} */]);
    const removeClip = (id) => setClips(clips.filter(clip => clip && clip.id !== id))
    const selectClip = (id) => {
        const clip = clips.find( clip => clip && clip.id === id);

        setSelectedInterval(clip.interval);
        setTimeout( () => {
            controls.seek(getTotalSeconds(clip.interval[0]))
            controls.play();
        }, 50)
    }
    const addClip = () => {
        setClips([ ...clips,
            {
                id: generate(3),
                name: `${clips.length}`,
                interval: selectedInterval,
                src,
            }
        ])
        const [start, end] = selectedInterval;
        let intervalDuration = getTotalSeconds(end)-getTotalSeconds(start);
        setSelectedInterval([
            end,
            addSeconds( end, intervalDuration )
        ])
    }
    const updateClip = (id, prop, value) => {
        let tempClips = Object.assign([], clips);
        let index = tempClips.findIndex(clip => clip.id === id);
        tempClips[index][prop] = value;
        setClips(tempClips)
    }

    const Info = React.memo(() => (
        <>
            <p className="title is-4">{name}</p>
            <p className="subtitle is-5">
                <span>{mimetype}</span> {' - '} <span>{bytesToMegaBytes(size)} MB</span>
            </p>
        </>
    ))
    const VideoData = React.memo(()=>(
        <div className="p-d-flex p-jc-between">
            <div className="">
                Duración: {formatDistance(selectedInterval[0], selectedInterval[1], {includeSeconds: true})}
            </div>
            <div className="">

                <Button severity="warning" className="p-0 p-button-sm p-button-warning p-mr-1"
                    onClick={ () => {
                        setSelectedInterval([
                            addSeconds( clearDate, state.time ), /* The time */
                            selectedInterval[1]
                        ])
                    }}>
                    <Tag 
                        icon="pi pi-step-backward-alt" 
                        severity="warning"
                        style={{padding: '0.17rem 0.2rem'}}/>
                </Button>        
                <Button severity="warning" className="p-0 p-button-sm p-button-warning p-mr-2"
                    onClick={ () => {
                        setSelectedInterval([
                            selectedInterval[0],
                            addSeconds( clearDate, state.time ) /* The time */
                        ])
                    }}>
                    <Tag 
                        icon="pi pi-step-forward-alt" 
                        severity="warning"
                        style={{padding: '0.17rem 0.2rem'}}/>
                </Button>   

                
                <Tag className="p-mr-2" value={format(selectedInterval[0], "HH:mm:ss")}></Tag>
                <Tag className="" value={format(selectedInterval[1], "HH:mm:ss")}></Tag>
            </div>
        </div>
    ), (prev, next) => isEqual(prev, next) )
    const [pre, setPre] = React.useState("Clip-");
    const [videoSpeed, setVideoSpeed] = React.useState(0);
    const videSpeedChangeRate = 25;
    const getPlaybackRate = React.useMemo( ()=>((videoSpeed/videSpeedChangeRate)/2+1), [videoSpeed])
    React.useEffect(()=>{
        videoRef.current.playbackRate = getPlaybackRate;
    }, [getPlaybackRate])

    const [processModal, setProcessModal] = React.useState({
        visible: false, options: {mode: PROCESS_MODES.SAVE_INDEPENDENT},
    })
    return (
        <div className="edit-video-cut">
        {processModal.visible && 
            <ProcessDialogue
            {...{
                userID,
                projectID,
                resourceData,
                clips,
                pre
            }}
            config={processModal} 
            close={()=>setProcessModal({...processModal, visible: false})}
        />}

        <Splitter style={{border: '0'}}>
            <SplitterPanel>
                <Info/>
                {video}
                <VideoData/>

                <div className="timeline-wrapper">
                    <div className="timeline" style={{width: (timelineZoom*2+100)+"%"}}>
                        <PlayLine time={state.time} duration={state.duration}/>
                        <TimeRange
                            error={error}  
                            step={1}
                            selectedInterval={selectedInterval}  
                            timelineInterval={timelineInterval}  
                            onUpdateCallback={({err}) => setError(err)}  
                            onChangeCallback={onChangeCallback}
                            containerClassName="pt-5 pb-5 mb-4"
                            // disabledIntervals={disabledIntervals}  
                            />
                    </div>   
                </div>
                <div className="p-d-flex p-jc-between ">
                    <div className="p-d-flex p-as-center p-ai-center" style={{width: '100%'}}>
                        <div className="p-d-inline-flex p-ai-center">
                            <Slider 
                                style={{width: '5rem'}} 
                                value={videoSpeed} 
                                onChange={(e) => setVideoSpeed(Number(e.value))}
                                step={videSpeedChangeRate} />
                            <span className="p-ml-3">X{getPlaybackRate}</span>
                        </div>
                        <div className="p-ml-3 p-d-inline-flex p-ai-center" style={{width: '100%'}} >
                            <Slider 
                                style={{width: '100%'}} 
                                value={timelineZoom} 
                                onChange={(e) => setTimelineZoom(Number(e.value))} step={0.01} />
                            <span className="p-ml-3">{timelineZoom}</span>
                        </div>

                    </div>
                    <div className="p-d-inline-flex p-ml-3 p-ai-center">
                        <InputSwitch checked={fit} onChange={(e) => setFit(e.value)} className="p-mr-2" />
                        {/* <Button onClick={addClip} icon="pi pi-eject" className="p-button-warning p-mr-2" /> */}
                        <Button onClick={addClip} icon="pi pi-arrow-right" />
                    </div>
                </div>
            </SplitterPanel>
            <SplitterPanel >
                <div style={{width: '100%'}}>
                <ClipsList
                    functions= {{ selectClip, removeClip, updateClip, setPre}}
                    items={clips}
                    setItems={setClips}
                    pre={pre}
                    />
                <div className="p-d-flex p-m-3">
                    <SplitButton 
                        label="Guardar independiente" 
                        icon="pi pi-list" 
                        className="p-mr-2"
                        disabled={clips.length === 0}
                        onClick={()=>{
                            setProcessModal({
                                visible: true,
                                options: {
                                    mode: PROCESS_MODES.SAVE_INDEPENDENT
                                }
                            })
                        }} 
                        model={[
                            {
                                label: 'Procesar',
                                icon: 'pi pi-cog',
                                command: () => {
                                    setProcessModal({
                                        visible: true,
                                        options: {
                                            mode: PROCESS_MODES.PROCESS_INDEPENDENT
                                        }
                                    })
                                }
                            },
                        ]}/>

                    <Button 
                        className="p-col-6"
                        label="Procesar y combinar"
                        icon="pi pi-angle-double-down"
                        disabled={true}
                        onClick={addClip}/>
                </div>
                </div>
            </SplitterPanel>
        </Splitter>
        </div>
    )
}

export default Cut

