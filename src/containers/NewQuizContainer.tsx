import React from 'react';
import ProgrammingLanguageApi from '../apis/ProgrammingLanguageApi';
import InputMark from '../components/InputMark';

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
        <div>
            <IconButton aria-label="delete" color="secondary">
                <DeleteIcon />
            </IconButton>
            <Radio
                disableRipple
                color="primary"
                {...props}
            />
        </div>
        
    )
}

class NewQuizContainer extends React.Component <any, any>{
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
                        Create New Quiz
                    </Typography>
                </Grid>
                <Divider />
                    {/* Multiple Choice */} 

                <div style={{ margin: '12px 0' }}>
                    <div >
                        <TextField
                            fullWidth
                            placeholder="Write your question here"
                            multiline
                            InputProps={{
                                startAdornment: <InputAdornment position="start">1. </InputAdornment>,
                              }}
                        />
                    </div>
                    <div style={{ margin: '16px 0', marginLeft: '22px' }}>
                        <div className="answers">
                            <RadioGroup aria-label="gender" name="gender1" >
                                <FormControlLabel value="female" control={<RadioWithDelete />} label="Good" />
                                <FormControlLabel value="male" control={<RadioWithDelete />} label="Bad" />
                                <FormControlLabel value="other" control={<RadioWithDelete />} label="Other" />
                            </RadioGroup>
                        </div>
                        <div className="create-answer">
                            <Grid container>
                                <Grid item xs={8} sm={8} md={8}>
                                    <TextField
                                        fullWidth
                                        placeholder="Write your answer text"
                                        multiline
                                    />
                                </Grid>
                                <Grid item xs={4} sm={4} md={4}>
                                    <Chip 
                                        label="Answer" 
                                        color="primary" 
                                        icon={ <AddBoxIcon className={ this.props.classes.quizIcon} /> } 
                                        className={ this.props.classes.quizChip }
                                        variant="outlined"
                                        onClick={ () => { console.log('X'); }}
                                    />
                                    <Chip 
                                        label="Question" 
                                        color="secondary" 
                                        icon={ <DeleteIcon className={ this.props.classes.quizIcon} /> } 
                                        className={ this.props.classes.quizChip }
                                        variant="outlined"
                                        onClick={ () => { console.log('X'); }}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    
                    {/* Essay */}
                </div>
                <div style={{ margin: '12px 0' }}>
                    <div>
                        <InputMark onMark={ this.onMarked }
                            fullWidth
                            placeholder="Write your question here"
                            multiline
                            InputProps={{
                                startAdornment: <InputAdornment position="start">2. </InputAdornment>,
                              }}
                        />
                    </div>
                    <div style={{ margin: '16px 0', marginLeft: '22px' }}>
                        {
                            Object.keys(this.state.questions[0].answers).length > 0 && Object.keys(this.state.questions[0].answers).map((item, key) => (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton aria-label="delete" color="secondary">
                                        <DeleteIcon />
                                    </IconButton>
                                    <TextField key={key}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">{ key + 1} </InputAdornment>,
                                        }}
                                      />
                                </div>
                            ))
                        }
                    </div>
                    <div>
                        <Chip 
                            label="Question" 
                            color="secondary" 
                            icon={ <DeleteIcon className={ this.props.classes.quizIcon} /> } 
                            className={ this.props.classes.quizChip }
                            variant="outlined"
                            onClick={ () => { console.log('X'); }}
                        />
                    </div>
                </div>
                <Grid container spacing={2} direction="row" alignItems="center">
                    <Grid item xs={4} sm={4} md={4}>
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
                
                {/* {
                    this.state.modules.length > 0 && 
                    <Grid container spacing={1} direction="row">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Module Name</TableCell>
                                    <TableCell>File</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.modules.map(( module : any) => (
                                    <TableRow key={module.id}>
                                        <TableCell>{module.name}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="secondary">Download</Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary" onClick={ () => this.goToManageQuiz(module.id) }>Manage Quiz</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                } */}
            </div>
        )
    }
}

export default withStyles(styles)(NewQuizContainer);