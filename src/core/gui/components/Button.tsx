import React from 'react';
import IButton from "../models/IButton";
import { Rect, Text } from 'react-konva';

export class Button extends React.Component <IButton>{
    constructor(props: IButton){
        super(props);
    }

    render() {
        return (
            <Rect
                x={this.props.point.x}
                y={this.props.point.x}
                width={this.props.width || 70}
                height={this.props.height || 30}
                fill={this.props.backgroundColor || 'grey'}
                onClick={this.props.onClick || null}
                draggable={true}
                strokeWidth={0}
                shadowEnabled={false}
                cornerRadius={4}
            />
        );
    }
};