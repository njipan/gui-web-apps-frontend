import React, { useState, useEffect } from 'react';
import ProgrammingLanguageApi from '../apis/ProgrammingLanguageApi';
import { InputMark } from '../components/Form';
import styled from 'styled-components';

import { Debounce } from './../shared/modules/util';

import { findIndexToPush } from './../shared/modules/util';

import { 
    Card,
    FormControl, 
    InputLabel, 
    Input, 
    IconButton,
    Typography,
    Divider,
    withStyles,
    Select,
    MenuItem,
    Grid,
    Button,
    Table,
    TextField,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Box,
    Paper, 
    Badge,
    Chip,
    RadioGroup,
    Radio,
    FormControlLabel,
    FormGroup,
    Fab,
    InputAdornment
} from '@material-ui/core';

import NavigationIcon from '@material-ui/icons/Navigation';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CodeIcon from '@material-ui/icons/Code';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';

import SearchIcon from '@material-ui/icons/Search';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
import AddIcon from '@material-ui/icons/Add';
import { MultipleChoice } from '../components/Question/MultipleChoice';
import { Essay } from '../components/Question/Essay';
import { makeStyles } from '@material-ui/styles';
import Api from '../apis/Api';
import { QuizApi, ProgrammingModuleApi, QuestionApi } from '../apis';
import Swal from 'sweetalert2';
import QuestionFormResponseMessage from '../shared/transforms/QuestionFormResponseMessage';
import transform from '../shared/transforms';
import QuestionFormMessageResponseTransform from '../shared/transforms/QuestionFormResponseMessage';
import { QuestionType } from '../shared/enums';


const styles = {
    content: {
        height: "100vh",
        borderRadius: 0,
        position : "relative" as "relative",
        userSelect: 'none' as 'none'
    },
    center:{
        margin: "0 auto",
    },
    elementContent:{
        position: "absolute" as "absolute",
        top: 10,
        left: 10
    },
    titleTextHeader : {
        margin: "10px 0"
    },
    formControl : {
        margin: "8px 0",
        width: "100%"
    },
    btnCreate: {
        marginLeft : '16px'
    },
    searchWrapper: {
        margin: '16px 0'
    },
    quizItemWrapper : {
        margin: '16px 0'
    },
    quizItem : {
        padding: '16px',
    },
    quizChip : {
        marginRight: '8px',
    },
    quizIcon : {
        fontSize : 16,
        marginLeft : '12px'
    },
};

const useStyles = makeStyles(styles);

function QuizDetailContainer(props: any){
    const quizId = props.match.params.module_id;
    const classes = useStyles();
    const api = new QuizApi();
    const questionApi = new QuestionApi();
    
    const [isLoading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<any>([]);
    const [quiz, setQuiz] = useState<any>({});
    const [type, setType] = useState('0');

    useEffect(() => {
        Swal.fire({
            title: 'Getting information ..',
            target: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            showLoaderOnConfirm: true
        });
        
        api.getQuizById(quizId)
        .then((response) => {
            setQuiz(response.data.result);
            setQuestions(response.data.result.questions);
            setLoading(false);
        }).finally(() => {
            Swal.close();
        });
    }, []);

    const onMarked = async (number: any, data: any) => {
        
        const temp: any = [...questions];
        const questionId = parseInt(number) - 1;
        const answer = { 
            text: data.selectedText, 
            is_answer: true
        };

        temp[questionId].text = data.updatedText;
        if(temp[questionId].answers.length === 0 && data.endIdx == data.selectedText.length - 1){
            temp[questionId].answers.push(answer);
        }
        else{
            const idxToPush = findIndexToPush({
                text: data.oldText,
                arrayLength : temp[questionId].answers.length,
                selectedAt : data.startIdx
            });
            
            temp[questionId].answers.splice(idxToPush, 0, answer);
        }
        updateEssayAnswers(temp[questionId].id, { answers : temp[questionId].answers });
        setQuestions(temp);
        updateQuestionWithDebounce(temp[questionId].id, { text : temp[questionId].text});
    }

    const addQuestion = () => {
        const temp: any = [...questions];
        if(type == '0'){
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Please choose question type',
            })
            return;
        }
        const data = { type: type, text: '' };
        Swal.showLoading();
        
        questionApi.create(parseInt(quiz.id), data)
        .then((response) => {
            const temp = [...questions];
            temp.push(response.data);
            setQuestions(temp);
            Swal.close();
        })
        .catch((err) => {
            Swal.fire(
                'Oops ..',
                err.response.data.message || 'Something went wrong !',
                'error'
            );
        })
        setType('0');
    }

    const questionChange = (id: string, text: string) => {
        const questionId = parseInt(id) - 1;
        const temp: any = [...questions];
        temp[questionId].text = text;
        setQuestions(temp);
        
        updateQuestionWithDebounce(temp[questionId].id, { text });
    }

    const updateQuestionWithDebounce = (questionId: number, data: any) => {
        Debounce.run(() => {
            questionApi.update(parseInt(quiz.id), questionId, data)
            .catch((err) => {
                Swal.fire(
                    'Oops ..',
                    err.response.data.message || 'Something went wrong !',
                    'error'
                );
            })
        }, 500);
    }

    const answerDelete = (questionId: any, answerId: string) => {
        alert('DELETE');
        const temp :any[] = [...questions];
        const idxQuestion = parseInt(questionId) - 1;
        const idxAnswer = parseInt(answerId) - 1;
        const answer = temp[idxQuestion].answers.splice(idxAnswer, 1)[0];

        if(temp[idxQuestion].type === QuestionType.SNIPPET){
            temp[idxQuestion].text = updateTextOnAnswerDeleted(temp[idxQuestion].text, idxAnswer);
            updateEssayAnswers(temp[idxQuestion].id, { answers : temp[idxQuestion].answers });
            setQuestions(temp);
            updateQuestionWithDebounce(temp[idxQuestion].id, { text : temp[idxQuestion].text });
            return;
        }

        deleteMultipleChoiceAnswer(temp[idxQuestion].id, answer.id);
    }

    const deleteMultipleChoiceAnswer = (questionId: number, answerId: number) => {
        Swal.showLoading();
        questionApi.deleteMultipleChoiceAnswer(parseInt(quiz.id), questionId, answerId)
        .then(() => {
            Swal.close();
        })
        .catch((err) => {
            Swal.fire(
                'Oops ..',
                err.response.data.message || 'Something went wrong !',
                'error'
            );
            
        });
    }

    const updateTextOnAnswerDeleted = (text: string, idx: number) => {
        const sections = text.split("...");
        var pivot = idx + 1;

        return `${sections.slice(0, pivot).join('...')}${sections.slice(pivot).join('...')}`;
    }

    const updateEssayAnswers = (questionId: number, data: any) => {
        questionApi.updateEssayAnswers(parseInt(quiz.id), questionId, data)
        .catch((err) => {
            Swal.fire(
                'Oops ..',
                err.response.data.message || 'Something went wrong !',
                'error'
            );
        })

    }

    const addAnswer = (number: string, text: string) => {
        if(typeof text === 'string' && text.trim() === '') return;
        const temp: any = [...questions];
        const id: number = parseInt(number) - 1;
        const data = { text, is_answer : false };
        temp[id].answers.push(data);
        setQuestions(temp);
        addMultipleChoiceAnswer(parseInt(temp[id].id), data);
    }

    const addMultipleChoiceAnswer = (questionId: number, data: any) => {
        Swal.showLoading();
        questionApi.addMultipleChoiceAnswer(parseInt(quiz.id), questionId, data)
        .then(() => {
            Swal.close( );
        })
        .catch((err) => {
            Swal.fire(
                'Oops ..',
                err.response.data.message || 'Something went wrong !',
                'error'
            );
            Swal.hideLoading();
        })
    }

    const save = async () => {
        const data = {
            module_id : module,
            questions : [...questions]
        }
        Swal.fire({
            title: 'Save?',
            text: 'Are you sure want to save?',
            type: 'question',
            showCancelButton: true,
        }).then((value: any) => {
            if(value.dismiss === Swal.DismissReason.cancel) return;

            api.insert(data)
            .then(() => {
                Swal.fire({
                    text: 'Data successfully created!',
                    type: 'success',
                }).then((value) => {
                    props.history.push('/admin/quizzes');
                });
            })
            .catch((error: any) => {
                if(typeof error.response.data.messages === 'undefined') return;

                const messages = transform( 
                    QuestionFormMessageResponseTransform, 
                    [...questions], 
                    error.response.data.messages 
                );
                setQuestions(messages);
            });
        });
    }

    const typeChange = (e: any) => {
        const value = e.target.value;
        setType(value);
    }

    const selectAnswer = (number: any, answerId: any) => {
        alert('select');
        const temp: any = [...questions];
        const id: number = parseInt(number) - 1;
        temp[id].answers = [...temp[id].answers].map((answer: any, idx: number) => {
            const edited: any = {...answer};
            edited.is_answer = false;
            if(idx === parseInt(answerId) - 1){
                
                edited.is_answer = true;
            } 

            return edited;
        });
        console.log(answerId);
        return;
        selectMultipleChoiceAnswer(temp[id].id, temp[id].answers[parseInt(answerId) - 1].id);
        
        setQuestions(temp);
    }

    const selectMultipleChoiceAnswer = (questionId: number, answerId: number) => {
        Swal.showLoading();
        questionApi.selectMultipleChoiceAnswer(parseInt(quiz.id), questionId, answerId)
        .then(() => {
            Swal.close();
        })
        .catch((err) => {
            Swal.fire(
                'Oops ..',
                err.response.data.message || 'Something went wrong !',
                'error'
            );
            
        });
    }

    const handleDeleteQuestion = (id: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this question!",
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {
                const temp = [ ...questions ];
                const idxQuestion = parseInt(id)-1;
                const deletedQuestion: any = temp.splice(idxQuestion, 1)[0];
                Swal.showLoading();
                
                questionApi.delete(parseInt(quiz.id), deletedQuestion.id)
                .then((response) => {
                    setQuestions(temp);
                    Swal.fire(
                        'Deleted!',
                        'Successfully deleted question',
                        'success'
                    )
                })
                .catch((err) => {
                    Swal.fire(
                        'Oops ..!',
                        err.response.data.message || '',
                        'error'
                    );
                })
                .finally(() => {
                    
                });
              
            }
          })
        
    }

    const answerUpdate = (id: string, answerId: string, text: string) => {
         const idxQuestion = parseInt(id) - 1;
         const idxAnswer = parseInt(answerId) - 1;
         const temp = [...questions];
         
         temp[idxQuestion].answers[idxAnswer].text = text;
         setQuestions(temp);
    }

    return (
        <React.Fragment>
            { 
            !isLoading 
            && 
            Object.keys(quiz).length > 0
            &&
            <div>
                <Grid container spacing={1} alignItems="center" justify="space-between" direction="row">
                    <Typography variant="h6" className={ classes.titleTextHeader }>
                        Update Existing Quiz
                    </Typography>
                </Grid>
                <Divider />
                <Grid container style={{ margin: '16px 0' }}>
                    <Grid container style={{ margin: '16px 0' }}>
                        <Grid item xs={2} sm={2} md={2}>
                            Module Name
                        </Grid>
                        <Grid item xs={2} sm={2} md={2}>
                            : { quiz.module.name }
                        </Grid>
                    </Grid>
                    { questions.map((question: any, idx: number) => (
                        <Grid item xs={12} sm={12} md={12} key={idx}>
                            {
                                question.type === 'essay' ?
                                    <Essay number={`${idx+1}`} text={question.text} answers={ question.answers }
                                        onMark={ onMarked }
                                        onAnswerDelete= { answerDelete }
                                        onAnswerUpdate= { answerUpdate }
                                        onQuestionTextChange= { questionChange  }
                                        onQuestionDelete = { handleDeleteQuestion }
                                        error = { typeof question.message === 'string' && question.message.trim() !== '' }
                                        helperText = { question.message || '' }
                                    />
                                    :
                                    <MultipleChoice 
                                        error = { typeof question.message === 'string' && question.message.trim() !== '' }
                                        helperText = { question.message || '' }
                                        text={question.text} 
                                        number={`${idx + 1}`} 
                                        answers={question.answers} 
                                        onSelectAnswer = { selectAnswer }
                                        onAnswerAdd = { addAnswer }
                                        onAnswerDelete={ answerDelete }
                                        onDeleteQuestion={ handleDeleteQuestion } 
                                        onQuestionChange={ questionChange }
                                    />            
                            }
                        </Grid>  
                    )) }                    
                </Grid>
                <Grid container spacing={2} direction="row" alignItems="center">
                    <Grid item xs={3} sm={3} md={3}>
                        <FormControl fullWidth>
                            <Select value={type} displayEmpty onChange={ typeChange }>
                                <MenuItem value="0" disabled>
                                    Choose Question Type
                                </MenuItem>
                                <MenuItem value={QuestionType.SNIPPET}>Essay / Snippet</MenuItem>
                                <MenuItem value={QuestionType.MULTIPLE_CHOICES}>Multiple Choice</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                        <FormControl>
                            <Chip 
                                label="Question" 
                                color="primary" 
                                icon={ <AddBoxIcon className={ classes.quizIcon} /> } 
                                className={ classes.quizChip }
                                variant="outlined"
                                onClick={ addQuestion }
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                    {/* <div style={{ margin: '16px 0' }}>
                    <Fab variant="extended" color="primary">
                        SAVE &nbsp; <SaveIcon  />
                    </Fab>
                </div> */}
            </div>
            }
        </React.Fragment>
    )
}

export default QuizDetailContainer;