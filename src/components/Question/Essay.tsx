import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Box,
    Chip, 
    FormControlLabel,
    InputAdornment,
    Radio,
    RadioGroup,
    TextField,
    FormControl
} from '@material-ui/core';


import { 
    InputMark
} from '../../components/Form';

import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
    chip: {
        marginRight: '8px',
    },
    icon : {
        fontSize : 16,
        marginLeft : '12px'
    },
    answerForm : {
        margin: '16px 0'
    }
});


export interface IAnswersProp {
    number: string;
    answers: any;
    onAnswerDelete: (number: string, answerId: string) => any;
    onAnswerUpdate: (number: string, answerId: string, text: string) => any;
};

export function Answers (props: IAnswersProp) {

    return (
        <div style={{ margin: '12px 0', marginLeft: '11px' }}>
            {
                props.answers.length > 0 && props.answers.map((item: any, key: number) => (
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', margin: '10px 0' }} key={ item }>
                        <DeleteIcon aria-label="delete" color="secondary" style={{ marginRight: '16px' }} 
                            onClick={ () => { props.onAnswerDelete(props.number, `${key + 1}`) } }
                        />
                        <TextField key={key}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"> { key + 1 }. </InputAdornment>,
                            }} 
                            value={ item.text }
                            onChange= { (e: any) => props.onAnswerUpdate(props.number, `${key + 1}`, e.target.value || '') }
                        />
                    </div>
                ))
            }
        </div>
    );
}

export interface IEssayProp{
    text: string;
    number: string;
    answers?: any;
    placeholder?: string;
    onMark: (number: string, data: any) => any;
    onAnswerDelete: (number: string, answerId: string) => any;
    onAnswerUpdate: (number: string, answerId: string, text: string) => any;
    onQuestionTextChange: (id: string, text: string) => any;
    onQuestionDelete: (id: string) => any;
};

export function Essay(props: IEssayProp) {
    const classes = useStyles();

    const questionTextChanged = (text: string) => {
        props.onQuestionTextChange(props.number, text);
    }

    const deleteQuestion = () => {
        props.onQuestionDelete(props.number);
    }

    const handleMark = async (data: any) => {
        props.onMark(props.number, data);
    }

    const dataInput = {
        fullWidth : true,
        placeholder : props.placeholder || "Write your question here",
        multiline : true,
        InputProps : {
            startAdornment: <InputAdornment position="start"> { props.number }. </InputAdornment>,
        }
    };
    
    return (
        <div style={{ margin: '12px 0' }}>
            <div id="create-question">
                <InputMark onMark={ handleMark }
                    dataInput = { dataInput }
                    onTextChange = { questionTextChanged }
                    value={props.text}
                />
            </div>
            <Answers answers={ props.answers } number={ props.number } 
                onAnswerDelete = { props.onAnswerDelete } 
                onAnswerUpdate = { props.onAnswerUpdate } 
            />
            <div style={{ marginLeft : '22px' }}>
                <Chip 
                    label="Question" 
                    color="secondary" 
                    icon={ <DeleteIcon className={ classes.icon} /> } 
                    className={ classes.chip }
                    variant="outlined"
                    onClick={ deleteQuestion }
                />
            </div>
        </div>
    );

}