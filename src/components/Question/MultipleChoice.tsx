import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Box,
    Chip, 
    FormControlLabel,
    InputAdornment,
    Radio,
    RadioGroup,
    TextField
} from '@material-ui/core';

import { 
    ClearTextField 
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

const RadioWithDelete = (props: any) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center'}}>
            <DeleteIcon color="secondary" onClick={ props.onAnswerDelete }/>
            &nbsp;
            <Radio
                disableRipple
                color="primary"
                {...props}
                style={{ display: 'inline-block'}}
            />
        </div>
    )
}

export interface IMultipleChoiceProp {
    text: string;
    number: string;
    answers: any;
    onAnswerDelete: (questioniId: string, answerId: string) => any;
    onQuestionChange: (id: string, text: string) => any;
    onDeleteQuestion: (id: string) => any;
}

const Answers = (props: any) => {
    const keys = Object.keys(props.answers);

    return (
        <div className="answers">
            <RadioGroup aria-label="answer-question" name={`answers-q${ props.number }`} >
            {
                keys.length > 0 && keys.map((key) => (
                    <FormControlLabel value={ props.answers[key] } control={<RadioWithDelete number={key} onAnswerDelete={ props.onAnswerDelete }/>} label={ props.answers[key] } />
                ))
            }
            </RadioGroup>
        </div>
    )
}

export interface IMultipleChoiceAnswerFormProp {
    number: string;
    onAnswerChange: (id: string, answer: string) => any;
    onDeleteQuestion: (id: string) => any;
}

const AnswerForm = (props: IMultipleChoiceAnswerFormProp) => {
    const classes = useStyles();
    const [answer, setAnswer] = useState('');

    const answerTextChange = (e: any) => {
        setAnswer(e.target.value || '');
    }

    const add = (e: any) => {
        props.onAnswerChange(props.number, answer);
    }

    const deleteQuestion = (e: any) => {
        props.onDeleteQuestion(props.number);
    }

    return (
        <div className="form-answer">
            <div>
                <TextField
                    fullWidth
                    placeholder="Write your answer text"
                    multiline
                    value={ answer }
                    onChange={ answerTextChange }
                />
            </div>
            <div className={ classes.answerForm }>
                <Chip 
                    label="Answer" 
                    color="primary" 
                    icon={ <AddBoxIcon className={ classes.icon} /> } 
                    className={ classes.chip }
                    variant="outlined"
                    onClick={ add }
                />
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
    )
}

export function MultipleChoice (props: IMultipleChoiceProp){

    return (
        <div style={{ margin: '12px 0' }}>
            <div>
                <ClearTextField
                    fullWidth
                    placeholder="Write your question here"
                    multiline
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{ props.number }. </InputAdornment>,
                    }}
                />
            </div>
            <div style={{ margin: '2px 0', marginLeft: '22px' }}>
                <Answers answers={ props.answers } onAnswerDelete={ props.onAnswerDelete }/>
                <AnswerForm onAnswerChange= { props.onQuestionChange } onDeleteQuestion= { props.onDeleteQuestion } number={ props.number }/>
            </div>
        </div>
    )
}

export default MultipleChoice;


