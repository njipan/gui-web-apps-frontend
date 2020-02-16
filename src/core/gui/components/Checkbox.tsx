import React from 'react';
import IComponent from '../models/IComponent';
import { propsToStyle } from './../utils/component';
import clsx from 'clsx';

export class Checkbox extends React.Component<IComponent>{
    constructor(props:IComponent){
        super(props);
    }
    render() {
        const {element} = this.props;
        let style = propsToStyle(element.properties);
        let nameProp = element.properties.find((v: any) => {
            return v.property_name === 'value';
        });
        let text = typeof(nameProp) !== 'undefined' ? nameProp.value : this.props.elementName;
        return (
            <div 
                onMouseMove={this.props.onMouseMove}
                data-index={element.element_id}
                className={this.props.className}
                style={style}
            >
                <input type='checkbox'
                        id={`cb-comp-${element.element_id}`}
                />
                {text}
            </div>
        );
    }
};