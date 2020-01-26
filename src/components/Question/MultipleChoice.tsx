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
                onClick={ props.onSelectAnswer }
            />
        </div>
    )
}

const Answers = (props: any) => {

    return (
        <div className="answers">
            <RadioGroup aria-label="answer-question" >
            {
                props.answers.length > 0 && props.answers.map((answer: any, key:any) => (
                    <FormControlLabel 
                    value={ answer.text } 
                    control={
                        <RadioWithDelete onAnswerDelete={ () => { props.onAnswerDelete(props.number, key + 1) } } onSelectAnswer={ () => { props.onSelectAnswer(props.number, key + 1) } } />
                    } 
                    label={ answer.text } key={key}/>
                ))
            }
            </RadioGroup>
        </div>
    )
}

export interface IMultipleChoiceAnswerFormProp {
    number: string;
    onAnswerAdd: (questionId: string, answer: string) => any;
    onDeleteQuestion: (id: string) => any;
}

const AnswerForm = (props: IMultipleChoiceAnswerFormProp) => {
    const classes = useStyles();
    const [answer, setAnswer] = useState('');

    const answerTextChange = (e: any) => {
        setAnswer(e.target.value || '');
    }

    const add = (e: any) => {
        props.onAnswerAdd(props.number, answer);
        setAnswer('');
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

export interface IMultipleChoiceProp {
    text: string;
    number: string;
    answers: any;
    onSelectAnswer: (questionId: string, answerId: string) => any;
    onAnswerAdd: (questionId: string, answer: string) => any;
    onAnswerDelete: (questionId: string, answerId: string) => any;
    onQuestionChange: (id: string, text: string) => any;
    onDeleteQuestion: (id: string) => any;
}

export function MultipleChoice (props: IMultipleChoiceProp){

    const handleText = async(e: any) => {
        props.onQuestionChange(props.number, e.target.value);
    }

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
                    value={props.text}
                    onChange = { handleText }
                />
            </div>
            <div style={{ margin: '2px 0', marginLeft: '22px' }}>
                <Answers number={props.number} answers={ props.answers } onAnswerDelete={ props.onAnswerDelete } onSelectAnswer={ props.onSelectAnswer } />
                <AnswerForm onAnswerAdd= { props.onAnswerAdd } onDeleteQuestion= { props.onDeleteQuestion } number={ props.number }/>
            </div>
        </div>
    )
}

export default MultipleChoice;


