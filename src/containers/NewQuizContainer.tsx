import React, { useState, useEffect } from 'react';
import ProgrammingLanguageApi from '../apis/ProgrammingLanguageApi';
import { InputMark } from '../components/Form';
import styled from 'styled-components';

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
import { QuizApi, ProgrammingModuleApi } from '../apis';

const ClearTextField = styled(TextField)`
  label.Mui-focused {
    color: green;
  }
  .MuiInput-underline {
    &:before {
      border-color: transparent;
    }
  }
`;


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
    }
};

function RadioWithDelete(props: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center'}}>
            <DeleteIcon color="secondary" />
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

const useStyles = makeStyles(styles);

function NewQuizContainer(props: any){

    const classes = useStyles();

    const api = new QuizApi();

    console.log(props);

    const [modules, setModules] = useState([]);
    const [module, setModule] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [type, setType] = useState('0');

    // useEffect(() => {
    //     const moduleApi = new ProgrammingModuleApi();

    //     moduleApi.all()
    //     .then(response => {
    //         setModules(response.data);
    //     })
    // }, []);

    const onMarked = async (number: any, data: any) => {

        const temp: any = [...questions];
        const questionId = parseInt(number) - 1;
        temp[questionId].answers.push({ text: data.selectedText, is_answer: true});
        
        setQuestions(temp); 
    }

    const addQuestion = () => {
        const temp: any = [...questions];
        temp.push({ type: type, answers : [], text: '' });
        setQuestions(temp);
        setType('0');
    }

    const deleteQuestion = (id: string) => {
        console.log(`deleting ${id}`);
    }

    const questionChange = (id: string, text: string) => {
        const questionId = parseInt(id) - 1;
        const temp: any = [...questions];
        console.log(temp[questionId]);
        temp[questionId].text = text;
        setQuestions(temp);
    }

    const answerDelete = (questionId: string, answerId: string) => {
        console.log(`deleting question ${questionId} answers id ${answerId}`);
    }

    const moduleChange = (e: any) => {
        const moduleId = e.target.value;
        if(moduleId === 0) setQuestions([]);
        setModule(e.target.value);
    }

    const typeChange = (e: any) => {
        const value = e.target.value;
        setType(value);
    }

    const addAnswer = (number: string, text: string) => {
        const temp: any = [...questions];
        const id: number = parseInt(number) - 1;
        temp[id].answers.push({ text, is_answer : false });
        setQuestions(temp);
    }

    const save = async () => {
        const data = {
            module_id : module,
            questions : [...questions]
        }
        api.insert(data);
    }

    const selectAnswer = (number: any, answerId: any) => {
        const temp: any = [...questions];
        const id: number = parseInt(number) - 1;
        
        temp[id].answers = [...temp[id].answers].map((answer: any, idx: number) => {
            const edited: any = {...answer};
            edited.is_answer = false;
            if(idx === parseInt(answerId)) edited.is_answer = true;

            return edited;
        });

        setQuestions(temp);
    }

    return (
        <div>
            <Grid container spacing={1} alignItems="center" justify="space-between" direction="row">
                <Typography variant="h6" className={ classes.titleTextHeader }>
                    Create New Quiz
                </Typography>
            </Grid>
            <Divider />
            <Grid container style={{ margin: '16px 0' }}>
                <Grid container>
                    <Grid item xs={4} sm={4} md={3}>
                        <FormControl fullWidth>
                            <Select value={module} displayEmpty onChange={ moduleChange }>
                                <MenuItem value="0" disabled>
                                    Choose Module
                                </MenuItem>
                                <MenuItem value={2}>Basic GUI Component</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {  module !== 0 && 
                <React.Fragment>
                    { questions.map((question: any, idx) => (
                        <Grid item xs={12} sm={12} md={12}>
                            {
                                question.type === 'essay' ?
                                    <Essay number={`${idx+1}`} text={question.text} answers={ question.answers }
                                        onMark={ onMarked }
                                        onAnswerDelete= { (number, answerId) => console.log(number, answerId) }
                                        onAnswerUpdate= { (number, answerId, text) => console.log(number, answerId, text) }
                                        onQuestionTextChange= { (id, text) => console.log(id, text)  }
                                        onQuestionDelete = { (questionId) => console.log('Deleting question -> ', questionId)  }
                                    />
                                    :
                                    <MultipleChoice 
                                        text={question.text} 
                                        number={`${idx + 1}`} 
                                        answers={question.answers} 
                                        onSelectAnswer = { selectAnswer }
                                        onAnswerAdd = { addAnswer }
                                        onAnswerDelete={ answerDelete }
                                        onDeleteQuestion={ deleteQuestion } 
                                        onQuestionChange={ questionChange }
                                    />            
                            }
                        </Grid>
                    )) }
                    <Grid container spacing={2} direction="row" alignItems="center">
                        <Grid item xs={3} sm={3} md={3}>
                            <FormControl fullWidth>
                                <Select value={type} displayEmpty onChange={ typeChange }>
                                    <MenuItem value="0" disabled>
                                        Choose Question Type
                                    </MenuItem>
                                    <MenuItem value='essay'>Essay / Snippet</MenuItem>
                                    <MenuItem value='multiple_choice'>Multiple Choice</MenuItem>
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
                    <div style={{ margin: '16px 0' }}>
                        <Fab variant="extended" color="primary" onClick={ save }>
                            SAVE &nbsp; <SaveIcon  />
                        </Fab>
                    </div>
                </React.Fragment>
                }
            </Grid>
            
        </div>
    );
}

export default NewQuizContainer;