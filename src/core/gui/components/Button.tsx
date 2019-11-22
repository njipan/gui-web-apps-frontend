// import React from 'react';
// import IButton from "../models/IButton";
// import { Rect } from 'react-konva';

// export class Button extends React.Component <IButton>{
//     render() {
//         return (
//             <Rect
//                 x={this.props.point.x}
//                 y={this.props.point.x}
//                 width={this.props.width || 70}
//                 height={this.props.height || 30}
//                 fill={this.props.backgroundColor || 'grey'}
//                 onClick={this.props.onClick || null}
//                 draggable={true}
//                 strokeWidth={0}
//                 shadowEnabled={false}
//                 cornerRadius={4}
//             />
//         );
//     }
// };

import React from 'react';
import IComponent from '../models/IComponent';
import clsx from 'clsx';

export class Button extends React.Component<IComponent>{
    constructor(props:IComponent){
        super(props);
    }

    render() {
        const {element} = this.props;
        const {x,y} = element.properties[1].sub_properties;
        return (
            <button
                data-index={element.element_id}
                onMouseMove={this.props.onMouseMove}
                className={clsx(this.props.className)}
                style={{
                    position: 'absolute' as 'absolute',
                    left: `${x}px`,
                    top: `${y}px`
                }}
            >
                {element.properties[0].value}
            </button>
        );
    }
};