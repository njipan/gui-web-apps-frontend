import React, { useState } from 'react';
import ClearTextField from './ClearTextField';

interface IInputMark {
    onTextChange : (text: string) => any;
    onMark : (text: string) => any;
};

export default function InputMark(props: any){

    var isDown: boolean = false;
    var dateDown: number;

    async function handleMouseDown(e: any){
        const value = e.target.value || '';
        if(value === '') return;

        e.target.focus();
        isDown = true;
        dateDown = Date.now();
    }

    async function handleMouseUp(e: any){
        const value = e.target.value || '';
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
        const updatedText = `${text.substr(0,startIdx)}...${text.substr(endIdx)}`;
        props.onTextChange(updatedText);
        props.onMark({ id, selectedText, startIdx, endIdx, oldText, updatedText });
    }

    const handleChange = async (e: any) => {
        props.onTextChange(e.target.value || '');
    };

    const handleOnKeyDown = (e: any) => {
        const text: string = e.target.value || '';

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
        <ClearTextField { ...props.dataInput } onMouseDown = {handleMouseDown} onMouseUp={ handleMouseUp } onChange={ handleChange } value={ props.value.replace('\\n', '')} onKeyDown={ handleOnKeyDown } />
    )
}