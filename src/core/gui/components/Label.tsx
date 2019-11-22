import React from 'react';
import IComponent from '../models/IComponent';
import clsx from 'clsx';

export class Label extends React.Component<IComponent>{
    constructor(props:IComponent){
        super(props);
    }
    render() {
        const {element} = this.props;
        const {x,y} = element.properties[1].sub_properties;
        return (
            <label
                data-index={element.element_id}
                onMouseMove={this.props.onMouseMove}
                className={this.props.className}
                style={{
                    position: 'absolute' as 'absolute',
                    left: `${x}px`,
                    top: `${y}px`
                }}
            >
                {element.properties[0].value}
            </label>
        );
    }
};