import React from 'react';
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

import { MultipleChoice, Essay } from './../components/Question';

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

class QuizDetailContainer extends React.Component <any, any>{
    api: any;

    constructor(props: any){
        super(props);
        this.api = new ProgrammingLanguageApi();
        this.state = {
            prog_languages : [],
            modules : [],
            form : {
                selectedLanguage : {}
            },
            questions : [
                { answers : {} }
            ]
        };
    }

    async componentDidMount(){
        this.api.all().then((response: any) => {
            this.setState({ prog_languages : response.data })
        })
    }

    onLanguageChanged = (langId: any) => {
        const form = { ...this.state.form, selectedLanguage : langId };
        this.setState({ form });
    }

    searchModuleClicked = () => {
        this.api.getModules(this.state.form.selectedLanguage).then((response: any) => {
            this.setState({ modules : response.data })
        });
    }

    goToManageQuiz = ( id : any ) => {
        this.props.history.push(`/admin/quizzes/${id}`);
    }

    onMarked = (data: any) => {
        const temp = {...this.state };
        temp.questions[0].answers[data.id] = data.selectedText;
        this.setState(temp);
    }

    render() {

        return (
            <div>
                <Grid container spacing={1} alignItems="center" justify="space-between" direction="row">
                    <Typography variant="h6" className={ this.props.classes.titleTextHeader }>
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
                            : Basic Programming GUI 
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <MultipleChoice 
                            text={'How to'} 
                            number={'1'} 
                            answers={{ 'c1' : 'Good' }} 
                            onSelectAnswer={ () => { console.log('X') } }
                            onAnswerAdd={ () => { console.log('X') } }
                            onAnswerDelete={ () => { console.log('X') } }
                            onDeleteQuestion={ () => { console.log('X') } } 
                            onQuestionChange={ () => { console.log('X') } }
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        {/* <Essay number={'2'} text={'var age = 2;'} answers={ this.state.questions[0].answers }
                            onMark={ this.onMarked }
                            onAnswerDelete= { (number, answerId) => console.log(number, answerId) }
                            onAnswerUpdate= { (number, answerId, text) => console.log(number, answerId, text) }
                            onQuestionTextChange= { (id, text) => console.log(id, text)  }
                            onQuestionDelete = { (questionId) => console.log('Deleting question -> ', questionId)  }
                            onKeyDown = { (e: any) => console.log(e)  }
                        /> */}
                    </Grid>
                </Grid>
                <Grid container spacing={2} direction="row" alignItems="center">
                    <Grid item xs={3} sm={3} md={3}>
                        <FormControl fullWidth>
                            <Select value={0} displayEmpty>
                                <MenuItem value="0" disabled>
                                    Choose Question Type
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                        <FormControl>
                            <Chip 
                                label="Question" 
                                color="primary" 
                                icon={ <AddBoxIcon className={ this.props.classes.quizIcon} /> } 
                                className={ this.props.classes.quizChip }
                                variant="outlined"
                                onClick={ () => { console.log('X'); }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <div style={{ margin: '16px 0' }}>
                    <Fab variant="extended" color="primary">
                        SAVE &nbsp; <SaveIcon  />
                    </Fab>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(QuizDetailContainer);