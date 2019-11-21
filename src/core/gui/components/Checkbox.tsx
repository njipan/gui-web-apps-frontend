import React from 'react';
import IComponent from '../models/IComponent';
import clsx from 'clsx';

export class Checkbox extends React.Component<IComponent>{
    constructor(props:IComponent){
        super(props);
    }
    render() {
        
        const {element} = this.props;
        return (
            <div 
                onMouseMove={this.props.onMouseMove}
                data-index={element.element_id}
                className={this.props.className}
            >
                <input type='checkbox'
                        id={`cb-comp-${element.element_id}`}
                        
                />
                {element.properties[0].value}
            </div>
        );
    }
};