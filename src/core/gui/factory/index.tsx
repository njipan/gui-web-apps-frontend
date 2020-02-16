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

export function make(components:any, element:any, onMoveInComp: (e:any) => void, className: string){
    // let type = element.component_id;
    // switch(type){
    //     case ComponentType.BUTTON : return (<Button element={element} key={element.element_id} onMouseMove={onMoveInComp} className={className}>{element.name || 'Button'}</Button>)
    //     case ComponentType.LABEL : return (<Label element={element} key={element.element_id} onMouseMove={onMoveInComp} className={className}>{element.name || 'Label'}</Label>) 
    //     case ComponentType.CHECKBOX : return (<Checkbox element={element} key={element.element_id} onMouseMove={onMoveInComp} className={className}/>)
    //     case ComponentType.RADIO : return (<Radio element={element} key={element.element_id} onMouseMove={onMoveInComp} className={className}/>)
    // };

    let component = components.find((v: any) => {
        return v.id === element.component_id;
    });
    if(typeof(component) === 'undefined') return (<div></div>);

    // Similar Names
    let sns = {
        'button': ['button'],
        'label': ['label'],
        'checkbox': ['checkbox', 'check box'],
        'radio': ['radio', 'radiobutton', 'radio button'],
        'textfield': ['textfield', 'text field', 'textbox', 'text box']
    };

    let name = component.name.toLowerCase();
    if(sns['button'].indexOf(name) > -1) {
        return (
            <Button element={element} elementName={component.name} key={element.element_id} onMouseMove={onMoveInComp} className={className} />
        );
    }
    else if(sns['label'].indexOf(name) > -1) {
        return (
            <Label element={element} elementName={component.name} key={element.element_id} onMouseMove={onMoveInComp} className={className} />
        )
    }
    else if(sns['checkbox'].indexOf(name) > -1) {
        return (
            <Checkbox element={element} elementName={component.name} key={element.element_id} onMouseMove={onMoveInComp} className={className}/>
        )
    }
    else if(sns['radio'].indexOf(name) > -1) {
        return (
            <Radio element={element} elementName={component.name} key={element.element_id} onMouseMove={onMoveInComp} className={className}/>
        )
    }
    else if(sns['textfield'].indexOf(name) > -1) {

    }
}