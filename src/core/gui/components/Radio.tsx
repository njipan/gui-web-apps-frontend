import React from 'react';
import IComponent from '../models/IComponent';
import { propsToStyle, getName } from './../utils/component';
import clsx from 'clsx';

export class Radio extends React.Component<IComponent>{
    constructor(props:IComponent){
        super(props);
    }
    render() {
        const {element} = this.props;
        let style = propsToStyle(element.properties);
        let text = getName(element.properties, this.props.elementName);

        return (
            <div 
                data-index={element.element_id}
                onMouseMove={this.props.onMouseMove}
                className={this.props.className}
                style={style}
            >
                <input type='radio'
                    id={`rd-comp-${element.element_id}`}
                    disabled
                />
                {text}
            </div>
        );
    }
};