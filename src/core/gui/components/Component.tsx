import React from 'react';
import IComponent from '../models/IComponent';

export abstract class Component extends React.Component<IComponent>{
    constructor(props:IComponent){
        super(props);
    }

    
}