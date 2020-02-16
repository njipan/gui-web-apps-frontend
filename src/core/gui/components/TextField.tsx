import React from 'react';
import IComponent from '../models/IComponent';
import { propsToStyle, getName } from './../utils/component';
import clsx from 'clsx';

export default class TextField extends React.Component<IComponent>{
    constructor(props:IComponent){
        super(props);
    }

    render() {
        const {element} = this.props;

        let style = propsToStyle(element.properties);
        let text = getName(element.properties, this.props.elementName);

        return (
            <input
                type="text"
                data-index={element.element_id}
                onMouseMove={this.props.onMouseMove}
                className={clsx(this.props.className)}
                style={style}
                // value={text}
                defaultValue={text}
                readOnly
            />
        );
    }
};