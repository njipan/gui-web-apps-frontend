import React from 'react';
import {Button} from "../components/Button";

export enum ComponentType {
    BUTTON = "button",
    LABEL = "label",
    TEXT = "text"
}

export function make(type: string) : any{
    switch(type){
        case ComponentType.BUTTON : return (<Button point={{ x : 10, y : 20}} onClick={() => {}}/>)
    };
}