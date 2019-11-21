import * as React from 'react';

export default interface IComponent{
    element: any,
    onMouseMove:(e:React.MouseEvent<HTMLElement>)=>void,
    className?: string | undefined,
}