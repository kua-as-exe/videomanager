import React from 'react'
import PropTypes from 'prop-types'
import { OrderList } from 'primereact/orderlist';
import { Tag } from 'primereact/tag';
import { format } from "date-fns";
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';
import PrimeInplaceText from '../../../../../../../../components/shared/PrimeInplaceText';

function ClipsList({items, setItems, pre, functions: {removeClip, selectClip, updateClip, setPre}}) {

    const ItemTemplate = ({name, interval, src, id}) => {
        return (
            <div>
                <div className="p-d-flex p-jc-between p-ai-center">
                    <div className="p-d-flex p-ai-center">
                        <Button 
                            icon="pi pi-play" 
                            className="p-button-rounded p-button-info  p-button-sm"
                            onClick={()=>selectClip(id)}/>
                        <span className="p-ml-2 p-d-inline-flex">
                            {
                                pre !== ""? <>
                                <span style={{paddingBottom: '0.1rem'}}>{pre}</span>
                                </>:<></>
                            }
                            <PrimeInplaceText 
                                className="p-as-center p-pl-0 list-item-name"
                                initialValue={name}
                                onExit={(name)=>updateClip(id, 'name', name)}/>
                        </span>
                    </div>
                    <div className="p-d-flex p-ai-center">
                        <Tag severity="info" className="p-mr-2" value={format(interval[0], "HH:mm:ss")}></Tag>
                        <Tag severity="info" className="p-mr-2" value={format(interval[1], "HH:mm:ss")}></Tag>
                        <Button 
                            icon="pi pi-trash" 
                            className="p-button-rounded p-button-danger p-button-sm"
                            onClick={()=>removeClip(id)}/>
    
                    </div>
                </div>
            </div>
        );
    }
    

    return (
        <div>
            <OrderList 
                header={(
                    <PrimeInplaceText className="p-as-center" value={pre} setValue={setPre}/>
                )}
                value={items} 
                itemTemplate={(props)=><ItemTemplate {...props}/>} 
                onChange={(e) => setItems(e.value)}
                dragdrop
                id="A"
                ></OrderList>

        </div>
    )
}

ClipsList.propTypes = {

}

export default React.memo(ClipsList)

