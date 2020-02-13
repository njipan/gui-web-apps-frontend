import React from 'react';
import { Button } from "../components/Button";
import { Label } from '../components/Label';
import { Checkbox } from '../components/Checkbox';
import { Radio } from '../components/Radio';

export enum ComponentType {
    BUTTON = 2,
    LABEL = 3,
    CHECKBOX = 4,
    RADIO = 5
}

export function make(props:any,type:Number,onMoveInComp: (e:any) =>void,className: string){
    switch(type){
        case ComponentType.BUTTON : return (<Button element={props} key={props.element_id} onMouseMove={onMoveInComp} className={className}>{props.name || 'Button'}</Button>)
        case ComponentType.LABEL : return (<Label element={props} key={props.element_id} onMouseMove={onMoveInComp} className={className}>{props.name || 'Label'}</Label>) 
        case ComponentType.CHECKBOX : return (<Checkbox element={props} key={props.element_id} onMouseMove={onMoveInComp} className={className}/>)
        case ComponentType.RADIO : return (<Radio element={props} key={props.element_id} onMouseMove={onMoveInComp} className={className}/>)
    };
}