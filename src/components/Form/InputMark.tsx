import React, { useState } from 'react';
import ClearTextField from './ClearTextField';

export default function InputMark(props: any){

    const [value, setValue] = React.useState('');

    var isDown: boolean = false;
    var dateDown: number;

    async function handleMouseDown(e: any){
        if(value === '') return;

        e.target.focus();
        isDown = true;
        dateDown = Date.now();
    }

    async function handleMouseUp(e: any){
        
        if(!isDown || value.trim() === '') return;
        if(Date.now() - dateDown < 200) return;
        isDown = false;
        
        const oldText = e.target.value;
        const startIdx = e.target.selectionStart;
        const endIdx = e.target.selectionEnd;
        const text = value.toString();
        const selectedText = text.substr(startIdx, (endIdx - startIdx));
        if(selectedText.trim() === "" || selectedText.includes("...")) return;
        const id = `#@${Date.now()}@#`;
        setValue(`${text.substr(0,startIdx)}...${text.substr(endIdx)}`);
        props.onMark({ id, selectedText, startIdx, endIdx, oldText });
    }

    const handleChange = async (e: any) => {
        setValue(e.target.value);
        props.onTextChange(e.target.value);
    };

    const handleOnKeyDown = (e: any) => {
        const text: string = e.target.value;

        const startIdx = e.target.selectionStart;
        const endIdx = e.target.selectionEnd;
        const selectedText = text.substr(startIdx, (endIdx - startIdx));
        if(selectedText.includes("...")){
            e.preventDefault(); return;
        }

        if(e.keyCode == 8 || e.keyCode == 46) {
            if(startIdx <= 1) return;
            
            if(text.charAt(startIdx - 1) === "." && ( text.charAt(startIdx) === "." || text.charAt(startIdx - 2) === "." )){
                e.preventDefault(); return;
            }
            


        }
    }

    return (
        <ClearTextField {...props} onMouseDown = {handleMouseDown} onMouseUp={ handleMouseUp } onChange={ handleChange } value={value} onKeyDown={ handleOnKeyDown } />
    )
}