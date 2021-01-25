import React from 'react'
import PropTypes from 'prop-types'
import { Dialog } from 'primereact/dialog';
import { PROCESS_MODES } from './Cut';
import { Button } from 'primereact/button';
import { Knob } from 'primereact/knob';
import useApi from 'use-http-api';
import { api } from '../../../../../../../../api';
import { getTotalSeconds } from '../../../../../../../../helpers';
import { Toast } from 'primereact/toast';

function useInterval(callback, delay) {
    const savedCallback = React.useRef();
  
    // Remember the latest callback.
    React.useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    React.useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
const ProcessingText = React.memo(({text = "Procesando", className=""}) => {
    const [processingText, setProcessingText] = React.useState(0);
    const proccesingTextModes = [text, text+'.', text+'..', text+'...'];
    
    useInterval(()=>{
        if(processingText === proccesingTextModes.length-1)
            setProcessingText(0);
        else setProcessingText(processingText + 1 );
    }, 700)

    return <p className={className}>{proccesingTextModes[processingText]}</p>
    
})

function Process({config, close, clips = [], resourceData, userID, projectID}) {
    const {visible, options: {mode} } = config;
    const [current, setCurrent] = React.useState(0)
    const [done, setDone] = React.useState(false)
    const toast = React.useRef(null)

    const [{error, initialLoad, loading, data}, requestExtractClips] = useApi({
        url: api.user(userID).project(projectID).resources().tools().extractClip(),
        method: 'POST', autoTrigger: false
    })

    React.useEffect(() => {
        console.log(current);
        if(done) return;
        const {name, interval:[start, end]} = clips[current]
        requestExtractClips({
            resourceData, name,
            start: getTotalSeconds(start),
            end: getTotalSeconds(end),
            mode
        }).then( ()=>{
            if(current === clips.length-1){
                setDone(true);
                return
            }
            setTimeout(()=>
                setCurrent(current+1)
            , 2000);
        }).catch( e => {
            console.error(e);
        })
    }, [current])
    React.useEffect(() => {
        if(done){
            toast.current.show({severity: 'success', summary: 'Clips listos', detail: 'Todos los clips extraidos con éxito'});
            setTimeout(() => {
                //close()
            }, 2000);
        }
    }, [done])

    React.useEffect( ()=>{
        console.log(data);
    }, [data])

    const footer = (
        <div className="p-d-flex p-jc-between">
            <Button 
                label="Cancelar" 
                icon="pi pi-ban" 
                className="p-button-danger" 
                onClick={()=>close()} />
            <Button 
                label="Finalizar" 
                className="p-mr-0"
                // icon="pi pi-check" 
                disabled={!done}
                onClick={()=>close()} />
        </div>
    );

    const Porgress = React.memo( () => (
        <Knob 
            value={done? current+1:current} 
            max={clips.length}
            size={150}
            showValue={!done}
            valueColor={done?"LightGreen": "LightGray"}
            valueTemplate={"{value}/"+String(clips.length)}/>

    ), [current])

    return (
       <>
        <Toast ref={toast} />
        <Dialog
            style={{maxWidth: '90%'}}
            header={mode}
            visible={visible} 
            footer={footer}
            closeOnEscape={false}
            onHide={() => close()}>
            
            <section className="p-mb-4">
                <div className="p-d-flex p-jc-center">
                    {done && <i className='pi pi-check' style={{fontSize: '2rem', position: 'absolute', top: 'calc(50% - 1.5rem)', color: 'lightgreen'}}></i>}
                    <Porgress/>
                </div>
                
                <div className="" style={{textAlign:"center"}}>
                    {loading?
                        <p className="title is-5">Inicializando</p>:
                    !done?
                        <ProcessingText className="title is-5"/>:
                        <p className="title is-5">Listo</p>
                    }
                    <p className="subtitle is-5"> 
                        {loading && <i className="pi pi-spin pi-spinner p-mr-2"/>}
                        {!done && clips[current].name}
                    </p>
                </div>
                
                {error && (
                    <div className="notification is-danger">
                        <pre>{JSON.stringify(error, null, 2)}</pre>
                    </div>
                )}

            </section>

        </Dialog>
       </>
    )
}

Process.propTypes = {

}

export default Process

