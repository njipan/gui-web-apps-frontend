import React from 'react';
import IComponent from '../models/IComponent';
import clsx from 'clsx';

export class Label extends React.Component<IComponent>{
    constructor(props:IComponent){
        super(props);
    }
    render() {
        const {element} = this.props;
        return (
            <label
                data-index={element.element_id}
                onMouseMove={this.props.onMouseMove}
                className={this.props.className}
            >
                {element.properties[0].value}
            </label>
        );
    }
};