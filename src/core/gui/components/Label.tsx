import React from 'react';
import IComponent from '../models/IComponent';
import { propsToStyle } from './../utils/component';
import clsx from 'clsx';

export class Label extends React.Component<IComponent>{
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
            <label
                data-index={element.element_id}
                onMouseMove={this.props.onMouseMove}
                className={this.props.className}
                style={style}
            >
                {text}
            </label>
        );
    }
};