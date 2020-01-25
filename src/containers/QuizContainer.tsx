import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ProgrammingLanguageApi from '../apis/ProgrammingLanguageApi';

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
    Chip
} from '@material-ui/core';

import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CodeIcon from '@material-ui/icons/Code';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';
import SearchIcon from '@material-ui/icons/Search';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';
import { QuizApi } from '../apis';


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

const useStyles = makeStyles( (theme) => (styles));

function QuizContainer(props: any){
    const classes = useStyles();

    const [isLoading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState({
        data : [ ]
    });
    const api = new QuizApi();

    useEffect(() => {
        api.all()
        .then((response) => {
            setQuizzes(response.data.result);
            setLoading(false);
        })
    }, []);

    const goToNewQuizPage = () => {
        props.history.push(`/admin/quizzes/create`);
    }

    const goQuizDetail = ( id : any ) => {
        props.history.push(`/admin/quizzes/${id}/update`);
    }

    const removeQuiz = (id: string) => {
        if(window.confirm('Are you sure want to delete?') == true) api.delete(id);
    }

    return (
        <div>
            <Grid container spacing={1} alignItems="center" justify="space-between" direction="row">
                <Typography variant="h6" className={ classes.titleTextHeader }>
                    Manage Quiz
                </Typography>
            </Grid>
            <Divider />
            <form style={{ margin: '16px 0' }}>
                <Grid container spacing={1} justify="space-between" alignItems="center">
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Chip 
                            label="Create" 
                            color="primary" 
                            icon={ <AddBoxIcon className={ classes.quizIcon} /> } 
                            className={ classes.quizChip }
                            variant="outlined"
                            onClick={ goToNewQuizPage }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Grid container spacing={1} justify="flex-end">
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <TextField
                                        placeholder="Search"
                                        fullWidth
                                        margin="normal"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Language</InputLabel>
                                    <Select>
                                        <MenuItem value={20}>C</MenuItem>
                                        <MenuItem value={30}>C++</MenuItem>
                                        <MenuItem value={10}>JAVA</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={2} alignItems="center" style={{ display: 'flex'}}>
                                <Chip 
                                    label="Filter" 
                                    color="default" 
                                    icon={ <SearchIcon className={ classes.quizIcon} /> } 
                                    className={ classes.quizChip }
                                    variant="outlined"
                                    onClick={ () => { console.log('X'); }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                    
                
            </form>
            <div>
                
                { isLoading && <b>Please wait ...</b> }
                {
                    !isLoading && quizzes.data.map((quiz: any) => (
                        <Card className={ classes.quizItemWrapper }>
                        <Grid container spacing={2} direction="column" className={classes.quizItem}>
                            <Grid item xs={12} sm>
                                <Typography variant="h6">
                                    { quiz.module.name }
                                </Typography>
                            </Grid>
                            <Grid container direction="row">
                                <Grid item xs sm={6} md={6}>
                                    <Grid container direction="row">
                                        <Chip 
                                            label="10 Jan 2019" 
                                            color="default" 
                                            icon={ <CalendarTodayIcon className={ classes.quizIcon} /> } 
                                            className={ classes.quizChip }
                                        />
                                        <Chip 
                                            label={ quiz.module.language.name }
                                            color="primary" 
                                            icon={ <CodeIcon className={ classes.quizIcon} />  } 
                                            className={ classes.quizChip }
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs sm={6} md={6}>
                                    <Grid container direction="row" justify="flex-end">
                                        <Chip 
                                            label="Edit" 
                                            color="primary" 
                                            icon={ <EditIcon className={ classes.quizIcon} />  } 
                                            className={ classes.quizChip }
                                            variant="outlined"
                                            onClick={ () => { goQuizDetail(quiz.id); }}
                                        />
                                        <Chip 
                                            label="Remove"
                                            color="secondary" 
                                            icon={ <DeleteIcon className={ classes.quizIcon} /> } 
                                            className={ classes.quizChip }
                                            variant="outlined"
                                            onClick={ () => { removeQuiz(quiz.id) } }
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                    ))
                }
            </div>
        </div>
    )
}

// class QuizContainer extends React.Component <any, any>{
//     api: any;

//     constructor(props: any){
//         super(props);
//         this.api = new ProgrammingLanguageApi();
//         this.state = {
//             prog_languages : [],
//             modules : [],
//             form : {
//                 selectedLanguage : {}
//             }
//         };
//     }

//     async componentDidMount(){
//         this.api.all().then((response: any) => {
//             this.setState({ prog_languages : response.data })
//         })
//     }

//     onLanguageChanged = (langId: any) => {
//         const form = { ...this.state.form, selectedLanguage : langId };
//         this.setState({ form });
//     }

//     searchModuleClicked = () => {
//         this.api.getModules(this.state.form.selectedLanguage).then((response: any) => {
//             this.setState({ modules : response.data })
//         });
//     }

//     goToNewQuizPage = () => {
//         this.props.history.push(`/admin/quizzes/create`);
//     }

//     goToManageQuiz = ( id : any ) => {
//         this.props.history.push(`/admin/quizzes/${id}`);
//     }

//     render() {

        
//     }

export default QuizContainer;