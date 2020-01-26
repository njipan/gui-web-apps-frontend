import React, { useState, useEffect, useRef } from 'react';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { makeStyles, useTheme } from '@material-ui/styles';
import {
    Grid, 
    Typography, 
    Fab,
    Radio,
    RadioGroup,
    FormControlLabel,
    Paper,
    TextField
} from '@material-ui/core'; 

import SkipNextIcon from '@material-ui/icons/SkipNext';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { QuizApi } from '../apis';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    wrapperQuiz : {
        backgroundColor: '#283048',
        width: '100vw', 
        height: '100vh', 
        boxSizing: 'border-box',
    },
    centerXY : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    question : {
        padding: '20px 32px', 
        borderRadius: '20px !important'
    },
    rounded : {
        borderRadius: '50%'
    },
    textCenter: {
        textAlign: 'center'
    },
    moduleName : {
        margin: '12px 0'
    }
}));

interface WelcomeProp {
    isStarting: boolean;
    onStart: () => any;  
};

const Welcome = (props: WelcomeProp) => {
    const classes = useStyles();

    return (
        <Grid item xs={10} md={10} sm={10} className={ classes.centerXY }>
            <div className={ classes.centerXY } style={{ color: 'white', flexDirection: 'column' }}>
                <Typography variant="h2" color="inherit" style={{ marginBottom: '2em' }}>Basic Component GUI</Typography>
                { 
                !props.isStarting &&
                <Fab variant="extended" style={{ marginLeft: '8px' }} onClick={ props.onStart }>
                    START NOW <ArrowRightAltIcon style={{ marginLeft: '8px' }}/> 
                </Fab> 
                }
            </div>
        </Grid>
    )
} 

interface  IQuestionEssayProp{
    text: string;
    answers: any;
    onAnswerChange : (idx: number, text: string) => any;
}

function QuestionEssay (props: IQuestionEssayProp) {

    let countIndex = -1;

    const incrementIndex = () => {
        countIndex ++;
        return true;
    }

    const renderText = (idx: number, text: any, nextText: any) => {
        if(text === ""){
            incrementIndex();
            return ( <TextField onChange={ (e) => { props.onAnswerChange(countIndex, e.target.value); } } /> );
        }
        else{
            return (
                <React.Fragment>
                <span>{ text }</span>
                    { typeof nextText === 'string' && nextText !== '' && incrementIndex() && <TextField onChange={ (e) => { props.onAnswerChange(countIndex, e.target.value); } } /> }
                </React.Fragment>
            )
        }
    }

    const question = () => {
        const lines = props.text.split("\\n");
        const lineTexts: any = [];
        for(let line of lines){
            lineTexts.push(line.split("..."));
        }
        return (
            <React.Fragment>
                {
                    lineTexts.map( (line: any, key: number) => (
                        <React.Fragment>
                            <br />
                            { 
                            line.map((item: any, keyIdx: number) => {
                                let nextText = (keyIdx === lineTexts.length - 1) ? null : line[keyIdx + 1];
                                return (
                                    <React.Fragment>
                                        { renderText(countIndex , item, nextText) }
                                    </React.Fragment>
                                )
                            })
                            }
                        </React.Fragment>
                    ))
                    
                }
            </React.Fragment>
        );
    }
    
    return (
        <div>
            <Typography variant="subtitle1">
                { question() }
            </Typography>
            
        </div>
    );
}

function QuestionMultipleChoice (props: any) {
    return (
        <div>
            <Typography variant="subtitle1">
                { props.text }
            </Typography>
            <RadioGroup aria-label="answer-question" name={`answers-q${ props.number }`} value={props.answer} >
                {
                    props.answers.length > 0 && props.answers.map((item: any, key: number) => (
                        <FormControlLabel value={ item.id } control={<Radio />} label={ item.text } onClick={ () => props.onSelect(item.id) } />
                    ))
                }
            </RadioGroup>
        </div>
    );
}
 
export function TakeQuizContainer (props: any) {
    const classes = useStyles();
    const api = new QuizApi();
    const inputNavigation = useRef<any>({});

    const { match : { params } } = props;
    const [module, setModule] = useState({});
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isStart, setStart] = useState(false);
    const [inputIndex, setInputIndex] = useState<number>(1);

    useEffect(() => {
        Swal.fire({
            title: "Please wait",
            type: "info",
            showConfirmButton: false,
            allowOutsideClick: false
        });
        api.getQuestions(params.id)
        .then((response) => {
            setQuestions(response.data.result.questions);
            setModule(response.data.result.quiz.module);
        })
        .catch(() => {
            props.history.goBack();
        }).finally(() => {
            Swal.close();
        })
    }, []);

    const startQuiz = () => {
        setStart(true);
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        const temp:any = [ ...answers ];
        temp.push({ 
            question_id : getQuestion(nextIndex).id ,
            answer_id : -1
        });
        setAnswers(temp);
    }

    const next = () => {
        const index = currentIndex + 1;
        setInputIndex(index + 1);
        setCurrentIndex(index);
    }

    const back = () => {
        const index = currentIndex - 1;
        setInputIndex(index + 1);
        setCurrentIndex(index);
    }

    const checkType = (question: any) => {
        return question.type !== 'essay';
    }

    const getAnswer = (data: any) => {
        return data;
    }

    const parseAny = (data: any) : any => {
        return data;
    }

    const getQuestion = (question: any) : any => {
        return question;
    }

    const onAnswerSelect = (answerId: any) => {
        const temp:any = [ ...answers ];
        temp[currentIndex] = { 
            question_id : getQuestion(questions[currentIndex]).id,
            type: getQuestion(questions[currentIndex]).type,
            answer_id : answerId
        };
        setAnswers(temp);
    }

    const essayAnswerChange = (idx: number, text: string) => {
        const temp:any = [ ...answers ];
        let essayAnswers = [];
        if(temp[currentIndex]){
            essayAnswers = temp[currentIndex].answers;
        }
        essayAnswers[idx] = text;
        temp[currentIndex] = { 
            question_id : getQuestion(questions[currentIndex]).id ,
            type: getQuestion(questions[currentIndex]).type,
            answers : essayAnswers,
        };
        setAnswers(temp);
    }

    const handleInputIndex = (e: any) => {
        setInputIndex(e.target.value);
    }
 
    const finishClicked = () => {
        Swal.fire({
            title: 'Finish?',
            text: 'Are you sure?',
            type: 'question',
            showCancelButton: true,
        }).then((result: SweetAlertResult) => {
            if(result.dismiss === Swal.DismissReason.cancel) return;

            api.getResult(params.id, { answers })
            .then((response: any) => {
                Swal.fire({
                    text: `Your Score`,
                    title: `${response.data.result}`,
                    type: 'success'
                }).then(() => {
                    props.history.push('/material');
                });
            });
        });
    }

    const handleNumberChange = (e : any) => {
        
        if(e.keyCode === 13){
            const value = parseInt(e.target.value) || questions.length;
            const index = (value > questions.length) ? questions.length : value;

            setCurrentIndex(index - 1);
        }
    }

    return (
        <div className={ classes.wrapperQuiz }>
            <Grid container justify="center" alignItems="center"  style={{ height: '100vh', alignItems: 'inherit' }}>
                { 
                !isStart && 
                <Grid item xs={10} md={10} sm={10} className={ classes.centerXY } style={{ color: 'white', flexDirection: 'column' }}>
<Typography variant="h2" color="inherit" style={{ marginBottom: '2em' }}>{ (module as any).name }</Typography>
                    <Fab variant="extended" style={{ marginLeft: '8px' }} onClick={ startQuiz }>
                        START NOW <ArrowRightAltIcon style={{ marginLeft: '8px' }}/> 
                    </Fab> 
                </Grid>
                }
                {
                isStart && currentIndex >= 0 && questions.length > 0 &&
                <Grid item xs={10} sm={10} md={10} style={{ color: 'white', display: 'flex' }} direction="column" justify="center">
                    <Paper elevation={0} className={ classes.question }>
                        <Typography variant="h5" style={ { margin: '1.2em 0', textAlign: 'center' } }>
                            { 'Basic Component GUI' }
                        </Typography>
                        <div style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TextField value={inputIndex} type='number' onKeyUp={ handleNumberChange } style={{ width: '36px' }} onChange={ handleInputIndex } />&nbsp;/&nbsp;<strong>{  questions.length }</strong>
                        </div>
                        { ( checkType(questions[currentIndex]) ) ?  
                            <QuestionMultipleChoice 
                                {...questions[currentIndex]} 
                                onSelect={ onAnswerSelect } 
                                answer={ getAnswer(answers[currentIndex]).answer_id } 
                            /> 
                            : 
                            <QuestionEssay {...questions[currentIndex]} onAnswerChange={ essayAnswerChange }/> 
                        }  
                        <Grid container justify="space-between" style={{ padding: '20px 0' }}>
                            <div>
                                { 
                                currentIndex > 0 && 
                                <Fab variant="extended" style={{ marginLeft: '8px' }} color="primary" onClick={ () => { back() } }>
                                    <ArrowBackIcon style={{ marginLeft: '8px' }}/> Back
                                </ Fab>
                                }
                            </div>
                            <div>
                                { 
                                currentIndex < (questions.length - 1) && 
                                <Fab variant="extended" style={{ marginLeft: '8px' }} color="primary" onClick={ () => { next() } }>
                                    NEXT <ArrowForwardIcon style={{ marginLeft: '8px' }}/> 
                                </ Fab>
                                }
                                {
                                currentIndex == (questions.length - 1) && 
                                <Fab variant="extended" color="secondary" style={{ marginLeft: '10px' }} onClick={ finishClicked }>
                                    FINISH
                                </Fab> 
                                }
                            </div>
                        </Grid>
                    </Paper>
                </Grid>
                }
            </Grid>
        </div>
    );

}

export default TakeQuizContainer;