import React from 'react';
import IComponent from '../models/IComponent';
import { propsToStyle, getName } from './../utils/component';
import clsx from 'clsx';

export class Label extends React.Component<IComponent>{
    constructor(props:IComponent){
        super(props);
    }
    render() {
        const {element} = this.props;

        let style = propsToStyle(element.properties);
        let text = getName(element.properties, this.props.elementName);

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