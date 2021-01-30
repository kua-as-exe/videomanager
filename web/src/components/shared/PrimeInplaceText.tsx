import React from 'react'
import PropTypes from 'prop-types'

import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { InputText } from 'primereact/inputtext';

function PrimeInplaceText({value = "", setValue = (value?)=>{}, initialValue = "", onExit=(value?)=>{}, className=""}) {
    const [active, setActive] = React.useState(false)
    const [innerValue, setInnerValue] = React.useState(initialValue)

    const exit = () => {
        onExit(innerValue? innerValue: value);
        setActive(false);
    }
    
    return (
        <Inplace
            className={className}
            style={{width: '100%'}}
            active={active} 
            onToggle={(e) => setActive(e.value)}>

            <InplaceDisplay>
                <span>{initialValue? innerValue: value}</span>
            </InplaceDisplay>
            <InplaceContent>
                <InputText
                    style={{width: '100%'}}
                    onBlur={exit}
                    value={initialValue? innerValue: value} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if(initialValue) setInnerValue(e.target.value)
                        else setValue(e.target.value);
                    }}
                    onKeyDown={(e)=>{
                        if(e.key === "Enter") exit();
                    }}
                    autoFocus/>

            </InplaceContent>
        </Inplace>
    )
}

PrimeInplaceText.propTypes = {

}

export default PrimeInplaceText

