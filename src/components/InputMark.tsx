import React, { useState } from 'react';
import { TextField } from '@material-ui/core';

export default function InputMark(prop: any){

    const [value, setValue] = React.useState('');

    var isDown: boolean = false;
    var dateDown: number;

    function handleMouseDown(e: any){
        if(value === '') return;
        isDown = true;
        dateDown = Date.now();
    }

    function handleMouseUp(e: any){
        if(value.trim() === '') return;
        isDown = false;
        if(Date.now() - dateDown < 200) return;

        const startIdx = e.target.selectionStart || -1;
        if(startIdx === -1) return;
        const endIdx = e.target.selectionEnd;
        const text = value.toString();
        const selectedText = text.substr(startIdx, (endIdx - startIdx));
        const id = `#@${Date.now()}@#`;
        setValue(`${text.substr(0,startIdx)}...${text.substr(endIdx)}`);
        prop.onMark({ id, selectedText });
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      };


    return (
        <TextField {...prop} onMouseDown = {handleMouseDown} onMouseUp={ handleMouseUp } onChange={ handleChange } value={value}/>
    )
}