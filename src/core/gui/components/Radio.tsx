import React from 'react';
import IComponent from '../models/IComponent';
import clsx from 'clsx';

export class Radio extends React.Component<IComponent>{
    constructor(props:IComponent){
        super(props);
    }
    render() {
        const {element} = this.props;
        return (
            <div 
                data-index={element.element_id}
                onMouseMove={this.props.onMouseMove}
                className={this.props.className}
            >
                <input type='radio'
                        id={`rd-comp-${element.element_id}`}
                />
                {element.properties[0].value}
            </div>
        );
    }
};